/* Yurdunu Bil — UX v19
 * Mobile layout + deterministic atlas renderer.
 * This layer intentionally overrides conflicting legacy mobile rules.
 */
(() => {
  'use strict';

  const VERSION = '19.0.0';
  const NS = 'http://www.w3.org/2000/svg';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const norm = v => String(v ?? '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let geoCache = null;
  let renderTimer = 0;

  function css() {
    if ($('#yb-v19-css')) return;
    const style = document.createElement('style');
    style.id = 'yb-v19-css';
    style.textContent = `
      /* ==================== GLOBAL MOBILE RESET ==================== */
      *,*::before,*::after{box-sizing:border-box;min-width:0}
      html{width:100%;max-width:100%;overflow-x:hidden!important;scroll-padding-bottom:150px}
      body{width:100%;max-width:100%;overflow-x:hidden!important;overflow-y:auto!important;-webkit-text-size-adjust:100%}
      img,svg,canvas,video{max-width:100%}
      button,a,input,select,textarea{max-width:100%}
      @media(max-width:760px){
        html,body{width:100%!important;min-width:0!important;max-width:100%!important;overflow-x:hidden!important}
        body{min-height:100dvh!important;padding:0!important}
        .app-screen,.app-shell,.main-content,.view,.view.active,.view-container{width:100%!important;max-width:100%!important;min-width:0!important}
        .app-shell{display:block!important;min-height:100dvh!important}
        .main-content{display:block!important;margin:0!important;padding:8px 10px calc(138px + env(safe-area-inset-bottom))!important;overflow:visible!important}
        .view{padding:0!important;margin:0!important;overflow:visible!important}
        .view-container{padding:0!important;margin:0!important}

        /* ---------- top bar ---------- */
        .topbar{position:sticky!important;top:0!important;z-index:900!important;width:100%!important;height:54px!important;min-height:54px!important;margin:0 0 8px!important;padding:6px!important;border-radius:14px!important}
        .topbar-right{gap:3px!important;flex:0 0 auto!important}
        .topbar-right>*{flex:0 0 36px!important}
        .mobile-menu-btn,.icon-btn,.profile-btn{width:36px!important;height:36px!important;min-width:36px!important;max-width:36px!important}
        .breadcrumb{min-width:0!important;flex:1 1 auto!important;overflow:hidden!important}
        .breadcrumb strong,#page-title{max-width:44vw!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:13px!important}

        /* ---------- fixed bottom navigation ---------- */
        .mobile-bottom-nav{position:fixed!important;left:10px!important;right:10px!important;bottom:calc(8px + env(safe-area-inset-bottom))!important;width:auto!important;max-width:none!important;height:74px!important;min-height:74px!important;padding:5px!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:2px!important;z-index:2147483000!important;border-radius:22px!important;box-shadow:0 18px 55px rgba(0,0,0,.45)!important}
        .mobile-bottom-nav>*{width:100%!important;min-width:0!important;max-width:none!important;flex:1 1 0!important;min-height:62px!important;border-radius:15px!important}
        .mobile-bottom-nav button,.mobile-bottom-nav a{touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}

        /* ---------- mobile sidebar: never cover content unless opened ---------- */
        .sidebar{position:fixed!important;inset:0 auto 0 0!important;width:min(84vw,330px)!important;max-width:min(84vw,330px)!important;transform:translate3d(-110%,0,0)!important;visibility:hidden!important;z-index:2147482500!important;transition:transform .24s ease,visibility 0s linear .24s!important}
        .sidebar.yb-mobile-open{transform:translate3d(0,0,0)!important;visibility:visible!important;transition:transform .24s ease,visibility 0s!important}
        .yb-sidebar-backdrop{position:fixed!important;inset:0!important;z-index:2147482400!important;background:rgba(2,9,17,.64)!important;backdrop-filter:blur(3px)!important}
        .yb-mobile-menu{position:fixed!important;top:calc(10px + env(safe-area-inset-top))!important;left:10px!important;width:42px!important;height:42px!important;z-index:2147482800!important;touch-action:manipulation!important}

        /* ---------- all cards / grids ---------- */
        .panel,.hero-banner,.stat-card,.big-stat,.topic-card,.library-card,.settings-card,.settings-profile-card,.quiz-card,.quiz-start,.province-detail,.kpss-box,.topic-progress-panel,.map-control-panel,.map-preview-card{width:100%!important;min-width:0!important;max-width:100%!important;height:auto!important;min-height:0!important;max-height:none!important}
        .panel,.hero-banner,.topic-card,.library-card,.settings-card,.quiz-card,.quiz-start,.province-detail,.kpss-box,.topic-progress-panel{overflow:hidden!important}
        .topics-grid,.library-grid,.stats-grid{width:100%!important;max-width:100%!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}
        .topic-card,.library-card{padding:10px!important;border-radius:15px!important}
        .topic-card>* , .library-card>*{max-width:100%!important}
        .topic-card h3,.library-card h3{font-size:13px!important;line-height:1.2!important;overflow-wrap:anywhere!important}
        .topic-card p,.library-card p{font-size:8px!important;line-height:1.35!important;overflow-wrap:anywhere!important;min-height:0!important}
        .library-card:before,.library-card:after,.topic-card:before,.topic-card:after{max-width:100%!important}
        .library-card .library-card-art,.library-card .library-card-image,.library-card .library-visual,.library-card .card-art,.library-card .visual,.library-card .decor,.library-card .illustration{display:none!important}
        .library-note-list{width:100%!important}
        .library-note{width:100%!important;grid-template-columns:18px minmax(0,1fr)!important}
        .library-note p{min-width:0!important;overflow-wrap:anywhere!important}

        /* ---------- map view: one clean, tappable atlas block ---------- */
        #view-map{width:100%!important;max-width:100%!important;min-width:0!important}
        #view-map .full-map-wrap{width:100%!important;max-width:100%!important;min-width:0!important;display:flex!important;flex-direction:column!important;gap:9px!important}
        #view-map #full-map{width:100%!important;max-width:100%!important;height:min(56dvh,500px)!important;min-height:350px!important;max-height:500px!important;margin:0!important;padding:0!important;position:relative!important;overflow:hidden!important;border-radius:20px!important;isolation:isolate!important;touch-action:none!important}
        #view-map #full-map .leaflet-container{width:100%!important;height:100%!important;background:transparent!important;touch-action:none!important}
        #view-map #full-map .leaflet-tile-pane,#view-map #full-map .leaflet-overlay-pane,#view-map #full-map .leaflet-shadow-pane,#view-map #full-map .leaflet-marker-pane,#view-map #full-map .leaflet-tooltip-pane,#view-map #full-map .leaflet-control-container{display:none!important;visibility:hidden!important}
        #yb-atlas-v19{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;z-index:100!important;display:block!important;overflow:hidden!important;border-radius:inherit!important;touch-action:pan-x pan-y!important;user-select:none!important}
        #yb-atlas-v19 svg{display:block!important;width:100%!important;height:100%!important;max-width:none!important;pointer-events:auto!important;touch-action:pan-x pan-y!important}
        #yb-atlas-v19 .yb19-province{pointer-events:all!important;cursor:pointer!important;touch-action:manipulation!important;stroke:rgba(225,248,255,.72);stroke-width:1.05;vector-effect:non-scaling-stroke;transition:filter .15s ease,opacity .15s ease,stroke .15s ease}
        #yb-atlas-v19 .yb19-province:active{stroke:#fff;stroke-width:2.4;filter:drop-shadow(0 0 8px rgba(90,205,255,.8))}
        #yb-atlas-v19 .yb19-label{pointer-events:none!important;fill:rgba(235,249,255,.78);font:800 6.5px Inter,system-ui,sans-serif;text-anchor:middle}
        #yb-atlas-v19 .yb19-title{pointer-events:none!important;fill:#91e3ff;font:900 19px Inter,system-ui,sans-serif;letter-spacing:2px}
        #yb-atlas-v19 .yb19-sub{pointer-events:none!important;fill:#7897ad;font:700 9px Inter,system-ui,sans-serif}
        .yb19-map-tools{position:absolute!important;top:9px!important;left:9px!important;right:9px!important;z-index:180!important;display:flex!important;gap:6px!important;pointer-events:auto!important}
        .yb19-map-tools input{flex:1 1 auto!important;width:auto!important;min-width:0!important;height:40px!important;padding:0 12px!important;border-radius:12px!important;border:1px solid rgba(143,222,255,.25)!important;background:rgba(3,14,25,.88)!important;color:#fff!important;outline:0!important}
        .yb19-map-tools button{width:40px!important;height:40px!important;min-width:40px!important;border-radius:12px!important;border:1px solid rgba(143,222,255,.25)!important;background:rgba(3,14,25,.88)!important;color:#e9faff!important}
        .yb19-map-info{position:absolute!important;left:9px!important;right:9px!important;bottom:9px!important;z-index:190!important;padding:11px!important;border:1px solid rgba(143,222,255,.2)!important;border-radius:14px!important;background:rgba(3,14,25,.92)!important;backdrop-filter:blur(14px)!important;pointer-events:none!important}
        .yb19-map-info strong{font-size:14px!important}.yb19-map-info small{font-size:8px!important;color:#8fa8b9!important}
        #view-map .map-search-floating{position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;width:100%!important;margin:0!important;order:2!important}
        #view-map .map-legend-panel{position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;width:100%!important;max-width:none!important;max-height:none!important;margin:0!important;order:3!important;border-radius:15px!important}
        #view-map .map-legend-items{max-height:130px!important;overflow:auto!important}

        /* ---------- dashboard preview ---------- */
        #dashboard-map{width:100%!important;max-width:100%!important;min-width:0!important;height:260px!important;min-height:260px!important;max-height:260px!important;position:relative!important;overflow:hidden!important;border-radius:18px!important;isolation:isolate!important}
        #dashboard-map .leaflet-tile-pane,#dashboard-map .leaflet-overlay-pane,#dashboard-map .leaflet-shadow-pane,#dashboard-map .leaflet-marker-pane,#dashboard-map .leaflet-tooltip-pane,#dashboard-map .leaflet-control-container{display:none!important}
        #yb-mini-atlas{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;z-index:50!important}

        /* ---------- form controls: reliably tappable ---------- */
        input,select,textarea{font-size:16px!important;max-width:100%!important}
        button,.nav-item,.map-mode-btn,.library-open,.primary-btn,.ghost-btn{min-height:40px!important;touch-action:manipulation!important}
        .map-mode-btn{width:100%!important;min-width:0!important}

        /* ---------- remove legacy fixed heights / absolute decorative blocks ---------- */
        [style*="height:"]{max-height:none}
        .library-card .library-card-body,.topic-card .topic-card-body{height:auto!important;min-height:0!important;max-height:none!important}
        .library-card .library-card-foot{margin-top:8px!important}
      }
      @media(max-width:390px){
        .main-content{padding-left:7px!important;padding-right:7px!important;padding-bottom:138px!important}
        .topics-grid,.library-grid{grid-template-columns:1fr 1fr!important;gap:6px!important}
        #view-map #full-map{height:370px!important;min-height:370px!important;max-height:370px!important}
        #dashboard-map{height:230px!important;min-height:230px!important;max-height:230px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function bounds(features) {
    let minX=180,maxX=-180,minY=90,maxY=-90;
    const walk=c=>{ if(!Array.isArray(c))return; if(typeof c[0]==='number'){minX=Math.min(minX,c[0]);maxX=Math.max(maxX,c[0]);minY=Math.min(minY,c[1]);maxY=Math.max(maxY,c[1]);return;} c.forEach(walk); };
    features.forEach(f=>walk(f.geometry?.coordinates));
    return {minX,maxX,minY,maxY};
  }
  function centroid(feature){
    const pts=[];
    const walk=c=>{ if(!Array.isArray(c))return; if(typeof c[0]==='number'){pts.push(c);return;} c.forEach(walk); };
    walk(feature.geometry?.coordinates);
    if(!pts.length)return[0,0];
    return [pts.reduce((s,p)=>s+p[0],0)/pts.length,pts.reduce((s,p)=>s+p[1],0)/pts.length];
  }
  function project(features,w,h){
    const b=bounds(features),dx=Math.max(.01,b.maxX-b.minX),dy=Math.max(.01,b.maxY-b.minY),pad=48,scale=Math.min((w-pad*2)/dx,(h-pad*2)/dy),ox=(w-dx*scale)/2,oy=(h-dy*scale)/2;
    const pt=([x,y])=>[ox+(x-b.minX)*scale,h-(oy+(y-b.minY)*scale)];
    const ring=r=>r.map((p,i)=>{const q=pt(p);return`${i?'L':'M'}${q[0].toFixed(2)} ${q[1].toFixed(2)}`}).join(' ')+' Z';
    const geom=g=>g?.type==='Polygon'?g.coordinates.map(ring).join(' '):g?.type==='MultiPolygon'?g.coordinates.flatMap(p=>p.map(ring)).join(' '):'';
    return features.map(f=>{const c=centroid(f);return{d:geom(f.geometry),name:f.properties?.name||'',number:Number(f.properties?.number)||0,c:pt(c)}}).filter(x=>x.d);
  }
  function palette(i){const p=['#0d5f80','#126b89','#147795','#155f7d','#0e708e','#185d79'];return p[i%p.length];}

  async function loadGeo(){
    if(geoCache?.features?.length)return geoCache;
    const r=await fetch(`data/provinces.geojson?v=${VERSION}`,{cache:'no-store'});
    if(!r.ok)throw new Error(`Atlas HTTP ${r.status}`);
    const g=await r.json();
    if(!Array.isArray(g.features)||g.features.length<70)throw new Error(`Atlas data eksik: ${g.features?.length||0}`);
    return geoCache=g;
  }

  function openProvince(name, number){
    const input=$('#province-search');
    const select=$('#province-select');
    if(input){input.value=name;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));}
    if(select){select.value=name;select.dispatchEvent(new Event('change',{bubbles:true}));}
    const province=dataFind(name,number);
    const info=$('.yb19-map-info');
    if(info){info.innerHTML=`<strong>${escapeHtml(name)}</strong><small>${province?.region||'Türkiye'} · ${province?.climate||'KPSS il özeti'}</small>`;info.style.display='block';}
  }
  function dataFind(name,number){
    const d=Array.isArray(window.PROVINCE_DATA)?window.PROVINCE_DATA:[];
    return d.find(p=>Number(p.plate??p.number)===Number(number))||d.find(p=>norm(p.name)===norm(name));
  }
  function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  function drawFullMap(g){
    const host=$('#full-map');if(!host)return;
    const existing=$('#yb-atlas-v19',host);if(existing)existing.remove();
    const items=project(g.features.filter(f=>f?.geometry),900,520);
    const wrap=document.createElement('div');wrap.id='yb-atlas-v19';
    wrap.innerHTML=`<svg viewBox="0 0 900 520" preserveAspectRatio="xMidYMid meet" aria-label="Türkiye 81 il KPSS atlası"><defs><linearGradient id="yb19bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#061524"/><stop offset="1" stop-color="#0a2a40"/></linearGradient><filter id="yb19glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="900" height="520" fill="url(#yb19bg)"/><g opacity=".28">${Array.from({length:10},(_,i)=>`<path d="M${i*100} 0V520 M0 ${i*58}H900" fill="none" stroke="#73d8f5" stroke-opacity=".09"/>`).join('')}</g><text class="yb19-title" x="28" y="36">TÜRKİYE · 81 İL</text><text class="yb19-sub" x="29" y="53">İle dokun · KPSS özeti ve çalışma seçenekleri</text><g data-provinces></g><g data-labels></g></svg><div class="yb19-map-tools"><input id="yb19-search" type="search" autocomplete="off" placeholder="İl ara…"><button id="yb19-reset" type="button" aria-label="Haritayı sıfırla">↺</button></div><div class="yb19-map-info" style="display:none"></div>`;
    host.appendChild(wrap);
    const svg=$('svg',wrap), pg=$('[data-provinces]',svg), lg=$('[data-labels]',svg);
    items.forEach((it,i)=>{
      const depth=document.createElementNS(NS,'path');depth.setAttribute('d',it.d);depth.setAttribute('fill','rgba(0,0,0,.22)');depth.setAttribute('transform','translate(0 4)');depth.setAttribute('pointer-events','none');pg.appendChild(depth);
      const p=document.createElementNS(NS,'path');p.setAttribute('d',it.d);p.setAttribute('fill',palette(i));p.classList.add('yb19-province');p.dataset.name=it.name;p.dataset.number=it.number;p.setAttribute('tabindex','0');p.setAttribute('aria-label',it.name);p.addEventListener('click',e=>{e.stopPropagation();openProvince(it.name,it.number)});p.addEventListener('touchend',e=>{e.stopPropagation();openProvince(it.name,it.number)},{passive:true});p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openProvince(it.name,it.number)}});pg.appendChild(p);
      const t=document.createElementNS(NS,'text');t.classList.add('yb19-label');t.setAttribute('x',it.c[0]);t.setAttribute('y',it.c[1]);t.textContent=it.number||'';lg.appendChild(t);
    });
    const search=$('#yb19-search',wrap);
    if(search)search.addEventListener('input',()=>{const q=norm(search.value);$$('.yb19-province',wrap).forEach(p=>{const hit=!q||norm(p.dataset.name).includes(q)||p.dataset.number===q;p.style.opacity=hit?'1':'.16';});});
    $('#yb19-reset',wrap)?.addEventListener('click',()=>{if(search)search.value='';$$('.yb19-province',wrap).forEach(p=>p.style.opacity='1');});
  }

  function drawDashboard(g){
    const host=$('#dashboard-map');if(!host)return;
    const old=$('#yb-mini-atlas',host);if(old)old.remove();
    const items=project(g.features.filter(f=>f?.geometry),900,520);
    const wrap=document.createElement('div');wrap.id='yb-mini-atlas';wrap.innerHTML=`<svg viewBox="0 0 900 520" preserveAspectRatio="xMidYMid meet" aria-label="Türkiye 81 il önizlemesi"><defs><linearGradient id="yb19mini" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a6b8c"/><stop offset="1" stop-color="#17425d"/></linearGradient></defs><rect width="900" height="520" fill="#071a2b"/><text x="28" y="34" fill="#8bdfff" font="900 18px Inter,system-ui,sans-serif" letter-spacing="2">TÜRKİYE · 81 İL</text><g data-provinces></g><g data-labels></g></svg>`;
    host.appendChild(wrap);
    const svg=$('svg',wrap),pg=$('[data-provinces]',svg),lg=$('[data-labels]',svg);
    items.forEach(it=>{const p=document.createElementNS(NS,'path');p.setAttribute('d',it.d);p.setAttribute('fill','url(#yb19mini)');p.setAttribute('stroke','rgba(210,244,255,.6)');p.setAttribute('stroke-width','1');p.style.vectorEffect='non-scaling-stroke';p.style.cursor='pointer';p.addEventListener('click',()=>openProvince(it.name,it.number));pg.appendChild(p);const t=document.createElementNS(NS,'text');t.setAttribute('x',it.c[0]);t.setAttribute('y',it.c[1]);t.setAttribute('fill','rgba(240,252,255,.78)');t.setAttribute('font','800 7px Inter,system-ui,sans-serif');t.setAttribute('text-anchor','middle');t.textContent=it.number||'';lg.appendChild(t);});
  }

  function repairText(){
    const fixes=new Map([['ğŸ—ºï¸','🗺️'],['ğŸ—º','🗺️'],['ğŸ“š','📚'],['ğŸ”¥','🔥'],['ğŸ§ ','🧠'],['ğŸŽ¯','🎯'],['ğŸ“Š','📊'],['ğŸ“','📍'],['ğŸ“','📝'],['ğŸŒ','🌍'],['âœ“','✓'],['âœï¸','✏️'],['â†’','→'],['â†','←'],['âœ•','×'],['âš ï¸','⚠️']]);
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{let v=n.nodeValue||'';fixes.forEach((good,bad)=>{if(v.includes(bad))v=v.split(bad).join(good)});if(v!==n.nodeValue)n.nodeValue=v;});
  }

  async function boot(){
    css();
    repairText();
    try{const g=await loadGeo();drawFullMap(g);drawDashboard(g);}catch(e){console.warn('Yurdunu Bil v19 atlas:',e);}
    setTimeout(()=>{try{if(geoCache){drawFullMap(geoCache);drawDashboard(geoCache);}}catch(_){ }},700);
    setTimeout(()=>{try{if(geoCache){drawFullMap(geoCache);drawDashboard(geoCache);}}catch(_){ }},1800);
    window.addEventListener('resize',()=>{clearTimeout(renderTimer);renderTimer=setTimeout(()=>{if(geoCache){drawFullMap(geoCache);drawDashboard(geoCache);}},160);},{passive:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
