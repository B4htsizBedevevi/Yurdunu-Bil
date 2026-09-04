/* Yurdunu Bil — UX v16
 * Stability-first mobile shell + custom atlas watchdog.
 * This layer is additive: it does not replace the existing app logic.
 */
(() => {
  'use strict';

  const VERSION = '16.0.0';
  const MAP_ID = 'full-map';
  const ATLAS_ID = 'yb-atlas3d';
  const NS = 'http://www.w3.org/2000/svg';
  let atlasBuilding = false;
  let atlasBuilt = false;

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm = (v) => String(v ?? '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const provinces = () => Array.isArray(window.PROVINCE_DATA) ? window.PROVINCE_DATA : [];

  function css() {
    if ($('#yb-ux16-style')) return;
    const s = document.createElement('style');
    s.id = 'yb-ux16-style';
    s.textContent = `
      /* ---------- mobile shell ---------- */
      html,body{width:100%;max-width:100%;overflow-x:hidden!important}
      *,*::before,*::after{box-sizing:border-box}
      body{padding-bottom:calc(92px + env(safe-area-inset-bottom))!important}
      .app-shell,.main-content,.main-content>*{min-width:0!important;max-width:100%!important}
      .main-content{width:100%!important;overflow-x:clip!important}
      .view.active{width:100%!important;min-width:0!important;max-width:100%!important}
      .view.active>*{min-width:0!important;max-width:100%!important}
      button,input,select,textarea{min-width:0!important;max-width:100%!important}

      /* The desktop sidebar must never force the mobile canvas wider. */
      @media(max-width:760px){
        .main-content{padding:12px 12px calc(112px + env(safe-area-inset-bottom))!important}
        .mobile-bottom-nav{position:fixed!important;left:10px!important;right:10px!important;bottom:calc(8px + env(safe-area-inset-bottom))!important;width:auto!important;max-width:none!important;z-index:100000!important}
        .mobile-bottom-nav>*{min-width:0!important;flex:1 1 0!important}
        .sidebar{width:min(88vw,360px)!important;max-width:min(88vw,360px)!important}
        .sidebar-body,.sidebar-content{min-width:0!important;max-width:100%!important;overflow-x:hidden!important}
        .welcome-row,.hero-banner,.content-grid,.topics-grid,.library-grid,.stats-grid,.dashboard-grid,.cards-grid{width:100%!important;min-width:0!important;max-width:100%!important}
        .welcome-row{display:block!important;text-align:center!important}
        .welcome-row>*{width:100%!important;max-width:100%!important;margin-left:auto!important;margin-right:auto!important}
        .panel-head{min-width:0!important;flex-wrap:wrap!important}
        .panel-head>*{min-width:0!important;max-width:100%!important}
        .panel,.hero-banner,.quiz-card,.quiz-start,.topic-progress-panel,.kpss-box,.map-control-panel,.province-detail{width:100%!important;margin-left:auto!important;margin-right:auto!important}
        .content-grid,.topics-grid,.library-grid,.stats-grid,.dashboard-grid,.cards-grid{grid-template-columns:1fr!important}
        .v12-center{width:100%!important;max-width:100%!important;overflow:hidden!important}
        .v12-head{min-width:0!important}
        .v12-head>div{min-width:0!important}
        .v12-title,.v12-sub{overflow-wrap:anywhere!important}
        .yb-atlas-mobile-tools{display:flex!important}
      }
      @media(max-width:390px){
        .main-content{padding-left:9px!important;padding-right:9px!important}
        .sidebar{width:min(92vw,340px)!important;max-width:min(92vw,340px)!important}
      }

      /* ---------- text/emoji corruption guard ---------- */
      .yb-encoding-fixed{unicode-bidi:plaintext}

      /* ---------- atlas stability ---------- */
      #${MAP_ID}{position:relative!important;width:100%!important;min-width:0!important;max-width:100%!important;overflow:hidden!important}
      #${MAP_ID} .leaflet-container,#${MAP_ID} .leaflet-pane,#${MAP_ID} .leaflet-control-container{pointer-events:none!important}
      #${MAP_ID} .leaflet-container>*{visibility:hidden!important}
      #${ATLAS_ID}{pointer-events:auto!important;z-index:20!important}
      #${ATLAS_ID} svg{pointer-events:auto!important;touch-action:none!important}
      .yb-province-3d,.yb-province-3d *{pointer-events:auto!important;touch-action:manipulation!important}
      .yb-atlas-mobile-tools{display:none;position:absolute;left:9px;right:9px;top:9px;z-index:90;gap:6px;align-items:center}
      .yb-atlas-mobile-tools input,.yb-atlas-mobile-tools select{height:38px;border-radius:11px;border:1px solid rgba(139,219,255,.18);background:rgba(4,16,29,.9);color:#eaf9ff;padding:0 10px;outline:none;box-shadow:0 10px 28px rgba(0,0,0,.18);backdrop-filter:blur(12px)}
      .yb-atlas-mobile-tools input{flex:1 1 auto;min-width:0}
      .yb-atlas-mobile-tools button{height:38px;flex:0 0 38px;border:1px solid rgba(139,219,255,.18);border-radius:11px;background:rgba(4,16,29,.9);color:#eaf9ff;font-weight:900;cursor:pointer}
      .yb-atlas-empty{position:absolute;inset:0;display:grid;place-items:center;padding:30px;text-align:center;background:radial-gradient(circle at 50% 40%,rgba(80,210,255,.12),transparent 40%),linear-gradient(145deg,#061423,#081d31);color:#dff7ff;z-index:100}
      .yb-atlas-empty .box{width:min(420px,100%);padding:22px;border:1px solid rgba(120,215,255,.18);border-radius:18px;background:rgba(3,14,25,.78);backdrop-filter:blur(14px)}
      .yb-atlas-empty h3{margin:0 0 7px;font-size:19px}.yb-atlas-empty p{margin:0 0 14px;font-size:11px;line-height:1.55;color:#91aabb}.yb-atlas-empty button{min-height:42px;width:100%;border:0;border-radius:11px;background:linear-gradient(135deg,#61ddff,#9c8bff);color:#04121e;font-weight:900;cursor:pointer}
      @media(max-width:600px){
        #${MAP_ID}{height:560px!important;min-height:560px!important;border-radius:18px!important}
        .yb-atlas-mobile-tools{display:flex}
      }
    `;
    document.head.appendChild(s);
  }

  function repairText() {
    const replacements = new Map([
      ['ğŸ—ºï¸','🗺️'], ['ğŸ—º','🗺️'], ['ğŸ“š','📚'], ['ğŸ”¥','🔥'], ['ğŸ§ ','🧠'],
      ['ğŸŽ¯','🎯'], ['ğŸ“Š','📊'], ['ğŸ“','📍'], ['ğŸ“','📝'], ['ğŸŒ','🌍'],
      ['âœ“','✓'], ['âœï¸','✏️'], ['â†’','→'], ['â†','←'], ['âœ•','×'], ['â˜…','★'],
      ['âš¡','⚡'], ['â±','⏱️'], ['âœ¨','✨'], ['âœ”ï¸','✔️'], ['âš ï¸','⚠️']
    ]);
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      let v=node.nodeValue||'';
      replacements.forEach((to,from)=>{if(v.includes(from))v=v.split(from).join(to)});
      if(v!==node.nodeValue){node.nodeValue=v;node.parentElement?.classList.add('yb-encoding-fixed')}
    });
  }

  function mapFeatures() {
    const geo=window.__YB_ATLAS_GEOJSON;
    return Array.isArray(geo?.features) ? geo.features.filter(f=>f?.geometry) : [];
  }

  function project(features,w,h) {
    let minX=180,maxX=-180,minY=90,maxY=-90;
    const visit=(c)=>{
      if(!Array.isArray(c))return;
      if(typeof c[0]==='number'){minX=Math.min(minX,c[0]);maxX=Math.max(maxX,c[0]);minY=Math.min(minY,c[1]);maxY=Math.max(maxY,c[1]);return}
      c.forEach(visit);
    };
    features.forEach(f=>visit(f.geometry?.coordinates));
    const pad=86,dx=Math.max(.01,maxX-minX),dy=Math.max(.01,maxY-minY);
    const scale=Math.min((w-pad*2)/dx,(h-pad*2)/dy);
    const ox=(w-dx*scale)/2,oy=(h-dy*scale)/2;
    const pt=([x,y])=>[ox+(x-minX)*scale,h-(oy+(y-minY)*scale)];
    const ring=r=>r.map((p,i)=>{const [x,y]=pt(p);return `${i?'L':'M'}${x.toFixed(2)} ${y.toFixed(2)}`}).join(' ')+' Z';
    const geom=g=>g?.type==='Polygon'?g.coordinates.map(ring).join(' '):g?.type==='MultiPolygon'?g.coordinates.flatMap(p=>p.map(ring)).join(' '):'';
    return features.map(f=>({d:geom(f.geometry),name:f.properties?.name||'',number:Number(f.properties?.number)||0}));
  }

  function findProvince(name,plate){
    return provinces().find(p=>Number(p.plate??p.number)===Number(plate)) || provinces().find(p=>norm(p.name)===norm(name)) || {name,plate};
  }

  function details(data,info,shape){
    $$('.is-selected',shape.parentNode).forEach(x=>x.classList.remove('is-selected'));
    shape.classList.add('is-selected');
    info.querySelector('[data-name]').textContent=data.name||shape.dataset.name;
    info.querySelector('[data-region]').textContent=data.region||'Türkiye';
    const bits=[];
    if(data.climate)bits.push(data.climate);
    if(data.terrain)bits.push(data.terrain);
    if(data.crops)bits.push(Array.isArray(data.crops)?data.crops.slice(0,3).join(', '):String(data.crops));
    info.querySelector('[data-text]').textContent=bits.join(' · ')||'İl bilgilerini açmak için aşağıdaki düğmeyi kullan.';
    info.classList.add('show');
    info.querySelector('[data-details]').onclick=()=>{
      const search=$('#province-search');
      const nav=$('[data-view="map"]');
      if(nav&&!document.getElementById('view-map')?.classList.contains('active'))nav.click();
      setTimeout(()=>{if(search){search.value=data.name;search.dispatchEvent(new Event('input',{bubbles:true}));search.dispatchEvent(new Event('change',{bubbles:true}))}},150);
    };
    info.querySelector('[data-study]').onclick=()=>{
      try{localStorage.setItem('yb_selected_province_v1',JSON.stringify({name:data.name,plate:data.plate||data.number||0,at:Date.now()}))}catch(_){}
      const nav=$('[data-view="dashboard"]');if(nav)nav.click();
      setTimeout(()=>$('#yb-pomodoro')?.scrollIntoView({behavior:'smooth',block:'center'}),180);
    };
  }

  function installTools(host){
    if($('.yb-atlas-mobile-tools',host))return;
    const box=document.createElement('div');box.className='yb-atlas-mobile-tools';
    box.innerHTML=`<input type="search" data-atlas-search placeholder="İl ara…" autocomplete="off" aria-label="Haritada il ara"><button type="button" data-atlas-reset aria-label="Haritayı sıfırla">↺</button>`;
    host.appendChild(box);
    const input=box.querySelector('[data-atlas-search]');
    input.addEventListener('input',()=>{
      const q=norm(input.value.trim());
      $$('.yb-province-3d',host).forEach(el=>{
        const hit=!q||norm(el.dataset.name).includes(q);
        el.style.opacity=hit?'1':'0.18';
        el.style.filter=hit?'':'saturate(.25)';
      });
      const hit=$$('.yb-province-3d',host).find(el=>q&&norm(el.dataset.name).includes(q));
      if(hit){hit.focus({preventScroll:true});hit.dispatchEvent(new Event('yb:preview'))}
    });
    box.querySelector('[data-atlas-reset]').onclick=()=>{
      input.value='';$$('.yb-province-3d',host).forEach(el=>{el.style.opacity='1';el.style.filter=''});
      host.querySelector('#yb-atlas-info')?.classList.remove('show');
      const svg=$('svg',host);if(svg)svg.style.transform='';
    };
  }

  function buildFallback(features){
    const host=$(MAP_ID);if(!host||atlasBuilding)return;
    if($('#'+ATLAS_ID,host))return;
    atlasBuilding=true;
    const paths=project(features,1000,650);
    const shell=document.createElement('div');shell.id=ATLAS_ID;
    shell.innerHTML=`<svg viewBox="0 0 1000 650" role="img" aria-label="Türkiye 81 il özel atlası"><defs><linearGradient id="yb16bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#071b2d"/><stop offset="1" stop-color="#091322"/></linearGradient><linearGradient id="yb16p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f93bd"/><stop offset="1" stop-color="#185071"/></linearGradient><filter id="yb16shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity=".45"/></filter></defs><rect width="1000" height="650" fill="url(#yb16bg)"/><g opacity=".22">${Array.from({length:10},(_,i)=>`<circle class="yb-aura" cx="500" cy="330" r="${70+i*42}"/>`).join('')}</g><text x="32" y="42" class="yb-atlas-title">TÜRKİYE · 81 İL ATLASI</text><text x="33" y="60" class="yb-atlas-sub">Bir ile dokun · bilgiyi aç · çalışma oturumuna bağla</text><g data-atlas-provinces></g></svg>`;
    host.appendChild(shell);
    const svg=$('svg',shell),group=$('[data-atlas-provinces]',svg);
    const info=document.createElement('div');info.id='yb-atlas-info';info.innerHTML=`<button class="ai-close" type="button" aria-label="Kapat">×</button><div class="ai-row"><strong data-name>İl seç</strong><span class="ai-region" data-region>Türkiye</span></div><p data-text>Haritada bir ile dokun.</p><div class="ai-actions"><button type="button" data-details>İl detayını aç</button><button type="button" class="primary" data-study>Bu il ile çalış →</button></div>`;host.appendChild(info);
    info.querySelector('.ai-close').onclick=()=>info.classList.remove('show');
    paths.forEach(item=>{
      if(!item.d)return;
      const g=document.createElementNS(NS,'g');
      const depth=document.createElementNS(NS,'path');depth.setAttribute('d',item.d);depth.setAttribute('transform','translate(0 5)');depth.setAttribute('class','yb-province-depth');
      const top=document.createElementNS(NS,'path');top.setAttribute('d',item.d);top.setAttribute('class','yb-province-3d yb-province-top');top.dataset.name=item.name;top.dataset.number=item.number;top.setAttribute('tabindex','0');top.setAttribute('aria-label',item.name);top.setAttribute('filter','url(#yb16shadow)');
      const choose=()=>details(findProvince(item.name,item.number),info,top);
      top.addEventListener('click',choose);top.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose()}});
      g.append(depth,top);group.appendChild(g);
    });
    installTools(host);
    atlasBuilt=true;atlasBuilding=false;
  }

  async function ensureAtlas(){
    const host=$(MAP_ID);if(!host||atlasBuilt)return;
    if($('#'+ATLAS_ID,host)){atlasBuilt=true;installTools(host);return}
    const existing=$$('.leaflet-control-container,.leaflet-pane,.leaflet-top,.leaflet-bottom',host);existing.forEach(x=>x.style.display='none');
    try{
      if(!window.__YB_ATLAS_GEOJSON){
        const r=await fetch(`data/provinces.geojson?v=${VERSION}`,{cache:'no-store'});
        if(!r.ok)throw new Error(`GeoJSON ${r.status}`);
        window.__YB_ATLAS_GEOJSON=await r.json();
      }
      const f=mapFeatures();
      if(f.length<70)throw new Error(`Atlas ${f.length} il aldı`);
      buildFallback(f);
    }catch(error){
      console.warn('Yurdunu Bil atlas verisi yüklenemedi:',error);
      if(!$('.yb-atlas-empty',host)){
        const empty=document.createElement('div');empty.className='yb-atlas-empty';empty.innerHTML=`<div class="box"><h3>Atlas hazır değil</h3><p>81 il atlas verisi yüklenemedi. İnternet bağlantısını kontrol edip tekrar deneyebilirsin.</p><button type="button">Atlası yeniden dene</button></div>`;host.appendChild(empty);empty.querySelector('button').onclick=()=>{empty.remove();atlasBuilding=false;ensureAtlas()};
      }
    }finally{atlasBuilding=false}
  }

  function observer(){
    const host=$(MAP_ID);if(!host)return;
    const mo=new MutationObserver(()=>{
      if(!$('#'+ATLAS_ID,host))ensureAtlas();
      repairText();
    });
    mo.observe(host,{childList:true,subtree:true});
    window.addEventListener('resize',()=>setTimeout(()=>ensureAtlas(),120),{passive:true});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(()=>ensureAtlas(),120)});
  }

  function start(){
    css();
    repairText();
    observer();
    ensureAtlas();
    let n=0;const tick=()=>{repairText();ensureAtlas();if(++n<12)setTimeout(tick,500)};tick();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
