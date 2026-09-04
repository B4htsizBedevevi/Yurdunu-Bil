/* Yurdunu Bil — UX v17
 * Mobile-first atlas shell. Additive and defensive: existing app logic remains the source of truth.
 * Goals: no mobile overflow, no sidebar covering the app by default, no OSM map hiding the KPSS atlas,
 * reliable 81-province SVG rendering, searchable provinces, layer-aware colors, safe detail actions,
 * and a visible recovery state when atlas data cannot be loaded.
 */
(() => {
  'use strict';

  const VERSION = '17.0.0';
  const MAP_ID = 'full-map';
  const ATLAS_ID = 'yb-atlas-v17';
  const NS = 'http://www.w3.org/2000/svg';
  let booted = false;
  let building = false;
  let resizeTimer = 0;
  let geoCache = null;

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const norm = (v) => String(v ?? '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const data = () => Array.isArray(window.PROVINCE_DATA) ? window.PROVINCE_DATA : [];

  function injectCSS() {
    if ($('#yb-v17-style')) return;
    const style = document.createElement('style');
    style.id = 'yb-v17-style';
    style.textContent = `
      html,body{width:100%;max-width:100%;overflow-x:hidden!important}
      body{padding-bottom:0!important}
      .app-shell,.main-content,.view,.view.active{min-width:0!important;max-width:100%!important}
      .main-content{overflow-x:clip!important}

      /* ---------- mobile navigation ---------- */
      @media(max-width:760px){
        .main-content{padding:12px 10px calc(104px + env(safe-area-inset-bottom))!important}
        .mobile-bottom-nav{position:fixed!important;left:10px!important;right:10px!important;bottom:calc(8px + env(safe-area-inset-bottom))!important;width:auto!important;max-width:none!important;z-index:100500!important}
        .mobile-bottom-nav>*{min-width:0!important;flex:1 1 0!important}
        .sidebar{width:min(86vw,360px)!important;max-width:min(86vw,360px)!important;z-index:100800!important;transform:translateX(-105%)!important;transition:transform .28s cubic-bezier(.2,.8,.2,1)!important}
        .sidebar.yb-mobile-open{transform:translateX(0)!important}
        .yb-sidebar-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.54);backdrop-filter:blur(3px);z-index:100700;opacity:0;pointer-events:none;transition:opacity .22s ease}
        .yb-sidebar-backdrop.show{opacity:1;pointer-events:auto}
        .yb-mobile-menu{position:fixed;top:calc(10px + env(safe-area-inset-top));left:10px;width:42px;height:42px;border-radius:13px;border:1px solid rgba(115,190,235,.22);background:rgba(5,18,31,.86);backdrop-filter:blur(14px);color:#dff7ff;display:grid;place-items:center;z-index:100600;box-shadow:0 10px 28px rgba(0,0,0,.22);font-size:20px}
        .yb-mobile-menu.hidden{display:none!important}

        /* Map is a normal document block. The fixed bottom nav never sits on top of it. */
        #view-map .full-map-wrap{display:flex!important;flex-direction:column!important;gap:10px!important;min-width:0!important}
        #view-map #full-map{height:clamp(430px,66vh,610px)!important;min-height:430px!important;max-height:610px!important;border-radius:20px!important;overflow:hidden!important;position:relative!important}
        #view-map .map-legend-panel{position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;top:auto!important;width:100%!important;max-width:none!important;max-height:none!important;margin:0!important;z-index:20!important;border-radius:18px!important;box-shadow:0 18px 50px rgba(0,0,0,.25)!important}
        #view-map .map-legend-items{max-height:150px!important;overflow:auto!important}
        #view-map .map-search-floating{position:relative!important;left:auto!important;right:auto!important;top:auto!important;width:100%!important;margin:0!important}
      }
      @media(max-width:390px){
        .main-content{padding-left:8px!important;padding-right:8px!important}
        #view-map #full-map{height:450px!important;min-height:450px!important}
      }

      /* ---------- encoding repair ---------- */
      .yb-v17-encoding-fixed{unicode-bidi:plaintext}

      /* ---------- kill the photographic OSM layer inside the KPSS atlas ---------- */
      #${MAP_ID} .leaflet-tile-pane,#${MAP_ID} .leaflet-overlay-pane,#${MAP_ID} .leaflet-shadow-pane,#${MAP_ID} .leaflet-marker-pane,#${MAP_ID} .leaflet-tooltip-pane{display:none!important}
      #${MAP_ID} .leaflet-control-container{display:none!important}
      #${MAP_ID}{background:radial-gradient(circle at 50% 42%,rgba(68,185,236,.12),transparent 38%),linear-gradient(145deg,#061321,#081c2f)!important}
      #${ATLAS_ID}{position:absolute;inset:0;width:100%;height:100%;z-index:30;overflow:hidden;border-radius:inherit}
      #${ATLAS_ID}>svg{display:block;width:100%;height:100%;touch-action:none;user-select:none}
      #${ATLAS_ID} .yb-v17-bg{fill:url(#yb17bg)}
      #${ATLAS_ID} .yb-v17-grid{stroke:rgba(131,208,242,.055);stroke-width:1;fill:none}
      #${ATLAS_ID} .yb-v17-title{fill:#8ddfff;font:900 22px Inter,system-ui,sans-serif;letter-spacing:3px}
      #${ATLAS_ID} .yb-v17-sub{fill:#7997ad;font:600 11px Inter,system-ui,sans-serif;letter-spacing:.3px}
      #${ATLAS_ID} .yb-province{stroke:rgba(209,243,255,.55);stroke-width:1.05;vector-effect:non-scaling-stroke;cursor:pointer;transition:fill .18s ease,opacity .18s ease,filter .18s ease,stroke .18s ease}
      #${ATLAS_ID} .yb-province:hover,#${ATLAS_ID} .yb-province:focus{stroke:#dff8ff;stroke-width:2.2;filter:url(#yb17shadow);outline:none}
      #${ATLAS_ID} .yb-province.selected{stroke:#ffffff;stroke-width:2.8;filter:url(#yb17glow)}
      #${ATLAS_ID} .yb-province.dimmed{opacity:.16}
      #${ATLAS_ID} .yb-province-depth{fill:rgba(0,0,0,.26);transform:translate(0,5px)}
      #${ATLAS_ID} .yb-label{pointer-events:none;fill:rgba(236,250,255,.72);font:700 6.5px Inter,system-ui,sans-serif;text-anchor:middle}
      #${ATLAS_ID} .yb-label.major{font-size:8px;fill:#eafaff}
      .yb-v17-tools{position:absolute;top:12px;left:12px;right:12px;z-index:60;display:flex;gap:7px;align-items:center}
      .yb-v17-search{flex:1;min-width:0;height:42px;border:1px solid rgba(141,222,255,.22);border-radius:13px;background:rgba(3,15,27,.88);color:#effbff;outline:none;padding:0 13px;font:700 12px Inter,system-ui,sans-serif;box-shadow:0 12px 30px rgba(0,0,0,.25);backdrop-filter:blur(14px)}
      .yb-v17-search::placeholder{color:#6f8ea4}
      .yb-v17-reset{width:42px;height:42px;flex:0 0 42px;border:1px solid rgba(141,222,255,.22);border-radius:13px;background:rgba(3,15,27,.88);color:#effbff;font-size:18px;font-weight:900;cursor:pointer;box-shadow:0 12px 30px rgba(0,0,0,.25)}
      .yb-v17-info{position:absolute;left:12px;right:12px;bottom:12px;z-index:70;padding:15px 16px;border:1px solid rgba(141,222,255,.18);border-radius:17px;background:rgba(3,15,27,.9);box-shadow:0 18px 44px rgba(0,0,0,.34);backdrop-filter:blur(16px);opacity:0;transform:translateY(12px);pointer-events:none;transition:.24s ease}
      .yb-v17-info.show{opacity:1;transform:none;pointer-events:auto}
      .yb-v17-info-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
      .yb-v17-info-name{font-size:18px;font-weight:900;color:#f4fcff}.yb-v17-info-region{font-size:9px;font-weight:900;color:#65dfff;background:rgba(91,213,255,.08);padding:5px 8px;border-radius:8px}
      .yb-v17-info-text{margin:8px 0 11px;color:#9db2c2;font-size:10px;line-height:1.5}
      .yb-v17-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px}.yb-v17-stat{padding:8px;border-radius:10px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.06)}.yb-v17-stat b{display:block;font-size:10px}.yb-v17-stat span{display:block;margin-top:2px;font-size:7px;color:#71899e}
      .yb-v17-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px}.yb-v17-actions button{height:38px;border:1px solid rgba(141,222,255,.16);border-radius:10px;background:rgba(255,255,255,.035);color:#dff7ff;font-size:9px;font-weight:900;cursor:pointer}.yb-v17-actions .primary{border:0;background:linear-gradient(135deg,#49baf0,#4dd1ac);color:#04131e}
      .yb-v17-close{border:0;background:transparent;color:#7790a5;font-size:19px;cursor:pointer}
      .yb-v17-empty{position:absolute;inset:0;z-index:100;display:grid;place-items:center;padding:22px;background:linear-gradient(145deg,#061321,#092137);text-align:center}.yb-v17-empty-box{max-width:410px;padding:22px;border-radius:18px;border:1px solid rgba(141,222,255,.18);background:rgba(3,15,27,.82);box-shadow:0 20px 60px rgba(0,0,0,.32)}.yb-v17-empty h3{margin:0 0 7px;font-size:18px}.yb-v17-empty p{margin:0 0 14px;color:#8da6b8;font-size:10px;line-height:1.55}.yb-v17-empty button{height:40px;width:100%;border:0;border-radius:11px;background:linear-gradient(135deg,#49baf0,#4dd1ac);color:#04131e;font-size:10px;font-weight:900;cursor:pointer}
      @media(max-width:600px){.yb-v17-tools{top:9px;left:9px;right:9px}.yb-v17-info{left:9px;right:9px;bottom:9px}.yb-v17-title{font-size:17px!important}.yb-v17-sub{font-size:9px!important}.yb-label{font-size:5.8px!important}.yb-label.major{font-size:7px!important}}
    `;
    document.head.appendChild(style);
  }

  function repairEncoding(root=document.body){
    const map = new Map([
      ['ğŸ—ºï¸','🗺️'],['ğŸ—º','🗺️'],['ğŸ“š','📚'],['ğŸ”¥','🔥'],['ğŸ§ ','🧠'],['ğŸŽ¯','🎯'],['ğŸ“Š','📊'],['ğŸ“','📍'],['ğŸ“','📝'],['ğŸŒ','🌍'],['âœ“','✓'],['âœï¸','✏️'],['â†’','→'],['â†','←'],['âœ•','×'],['â˜…','★'],['âš¡','⚡'],['âœ¨','✨'],['âœ”ï¸','✔️'],['âš ï¸','⚠️']
    ]);
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{let v=node.nodeValue||'';map.forEach((to,from)=>{if(v.includes(from))v=v.split(from).join(to)});if(v!==node.nodeValue){node.nodeValue=v;node.parentElement?.classList.add('yb-v17-encoding-fixed')}});
  }

  function bounds(features){
    let minX=180,maxX=-180,minY=90,maxY=-90;
    const visit=c=>{if(!Array.isArray(c))return;if(typeof c[0]==='number'){minX=Math.min(minX,c[0]);maxX=Math.max(maxX,c[0]);minY=Math.min(minY,c[1]);maxY=Math.max(maxY,c[1]);return}c.forEach(visit)};
    features.forEach(f=>visit(f.geometry?.coordinates));
    return {minX,maxX,minY,maxY};
  }

  function centroid(feature){
    const pts=[];const visit=c=>{if(!Array.isArray(c))return;if(typeof c[0]==='number'){pts.push(c);return}c.forEach(visit)};visit(feature.geometry?.coordinates);if(!pts.length)return [0,0];return [pts.reduce((s,p)=>s+p[0],0)/pts.length,pts.reduce((s,p)=>s+p[1],0)/pts.length];
  }

  function project(features,w,h){
    const b=bounds(features);const dx=Math.max(.01,b.maxX-b.minX),dy=Math.max(.01,b.maxY-b.minY);const pad=56;const scale=Math.min((w-pad*2)/dx,(h-pad*2)/dy);const ox=(w-dx*scale)/2,oy=(h-dy*scale)/2;
    const pt=([x,y])=>[ox+(x-b.minX)*scale,h-(oy+(y-b.minY)*scale)];
    const ring=r=>r.map((p,i)=>{const [x,y]=pt(p);return `${i?'L':'M'}${x.toFixed(2)} ${y.toFixed(2)}`}).join(' ')+' Z';
    const geom=g=>g?.type==='Polygon'?g.coordinates.map(ring).join(' '):g?.type==='MultiPolygon'?g.coordinates.flatMap(p=>p.map(ring)).join(' '):'';
    return {paths:features.map(f=>({d:geom(f.geometry),name:f.properties?.name||'',number:Number(f.properties?.number)||0,label:centroid(f)}).filter(x=>x.d)),pt};
  }

  function findProvince(name,plate){return data().find(p=>Number(p.plate??p.number)===Number(plate))||data().find(p=>norm(p.name)===norm(name))||{name,plate};}

  function activeMode(){
    const btn=$('.map-mode-btn.active');return btn?.dataset.mode||'default';
  }

  function valueText(v){return Array.isArray(v)?v.slice(0,3).join(', '):String(v??'');}

  function colorFor(p,mode){
    const text=v=>norm(v);
    if(mode==='agriculture'){const s=text(p.agriculture||p.crops);if(s.includes('cay')||s.includes('çay'))return '#169d70';if(s.includes('zeytin'))return '#7aa936';if(s.includes('pamuk'))return '#66a9c7';if(s.includes('uzum')||s.includes('üzüm'))return '#8751bd';if(s.includes('findik')||s.includes('fındık'))return '#b87536';if(s.includes('kayisi')||s.includes('kayısı'))return '#dc8510';return '#265b72'}
    if(mode==='climate'){const s=text(p.climate);if(s.includes('akdeniz'))return '#c9821b';if(s.includes('karadeniz'))return '#20945c';if(s.includes('karasal'))return '#a83b42';return '#2c6487'}
    if(mode==='terrain'){const s=text(p.terrain);if(s.includes('dag')||s.includes('dağ'))return '#7548a7';if(s.includes('ova'))return '#279a68';if(s.includes('plato'))return '#bd6c21';return '#356581'}
    if(mode==='mining'){const s=text(p.mines||p.mining);if(s.includes('bor'))return '#bd910d';if(s.includes('komur')||s.includes('kömür'))return '#596a78';if(s.includes('krom'))return '#7d4da5';if(s.includes('petrol'))return '#ae4d2e';if(s.includes('bakir')||s.includes('bakır'))return '#a85d28';return '#2a5870'}
    return p.color||'#176184';
  }

  function updateLegendMode(){
    const mode=activeMode();const names={default:'Standart',agriculture:'Tarım',climate:'İklim',terrain:'Arazi',mining:'Maden'};const el=$('#map-legend-mode');if(el)el.textContent=names[mode]||'Standart';
  }

  function showInfo(info,p,shape){
    $$('.selected',shape.ownerSVGElement).forEach(x=>x.classList.remove('selected'));shape.classList.add('selected');
    info.querySelector('.yb-v17-info-name').textContent=p.name||shape.dataset.name;info.querySelector('.yb-v17-info-region').textContent=p.region||'Türkiye';
    info.querySelector('.s-pop').textContent=p.population?String(p.population):'—';info.querySelector('.s-area').textContent=p.area?String(p.area):'—';info.querySelector('.s-alt').textContent=p.altitude?String(p.altitude):'—';
    const bits=[p.climate,p.terrain,p.crops,p.economy].filter(Boolean).map(valueText);info.querySelector('.yb-v17-info-text').textContent=bits.join(' · ')||'Bu il için çalışma kartını aç.';
    info.classList.add('show');
    info.querySelector('[data-open]').onclick=()=>{try{localStorage.setItem('yb_selected_province_v17',JSON.stringify({name:p.name,plate:p.plate||p.number||0,at:Date.now()}))}catch(_){};const nav=$('[data-view="topics"]');if(nav)nav.click();};
    info.querySelector('[data-quiz]').onclick=()=>{const nav=$('[data-view="quiz"]');if(nav)nav.click();};
  }

  function createInfo(host){
    let info=$('.yb-v17-info',host);if(info)return info;info=document.createElement('section');info.className='yb-v17-info';info.innerHTML=`<div class="yb-v17-info-head"><div class="yb-v17-info-name">İl seç</div><span class="yb-v17-info-region">Türkiye</span><button class="yb-v17-close" type="button" aria-label="Kapat">×</button></div><p class="yb-v17-info-text">Haritada bir ile dokun. İl bilgileri ve KPSS çalışma seçenekleri burada açılır.</p><div class="yb-v17-stats"><div class="yb-v17-stat"><b class="s-pop">—</b><span>Nüfus</span></div><div class="yb-v17-stat"><b class="s-area">—</b><span>Alan</span></div><div class="yb-v17-stat"><b class="s-alt">—</b><span>Yükselti</span></div></div><div class="yb-v17-actions"><button type="button" data-open>İl detayını aç</button><button type="button" class="primary" data-quiz>Bu ilden test çöz →</button></div>`;host.appendChild(info);info.querySelector('.yb-v17-close').onclick=()=>info.classList.remove('show');return info;
  }

  function createTools(host,paths){
    let tools=$('.yb-v17-tools',host);if(tools)return tools;tools=document.createElement('div');tools.className='yb-v17-tools';tools.innerHTML=`<input class="yb-v17-search" type="search" placeholder="İl ara… ör. Ankara" autocomplete="off" aria-label="Haritada il ara"><button class="yb-v17-reset" type="button" aria-label="Haritayı sıfırla">↺</button>`;host.appendChild(tools);
    const input=$('.yb-v17-search',tools);const reset=()=>{input.value='';$$('.yb-province',host).forEach(el=>{el.classList.remove('dimmed');el.style.opacity='1'});$$('.yb-label',host).forEach(el=>el.style.opacity='1');};
    input.addEventListener('input',()=>{const q=norm(input.value.trim());const shapes=$$('.yb-province',host);shapes.forEach(el=>{const hit=!q||norm(el.dataset.name).includes(q);el.classList.toggle('dimmed',!!q&&!hit);el.style.opacity=hit?'1':q?'.16':'1'});const hit=shapes.find(el=>q&&norm(el.dataset.name).includes(q));if(hit){hit.scrollIntoView?.({block:'nearest'});hit.focus({preventScroll:true})}});tools.querySelector('.yb-v17-reset').onclick=reset;
  }

  async function getGeo(){
    if(geoCache?.features?.length)return geoCache;
    if(window.__YB_ATLAS_GEOJSON?.features?.length){geoCache=window.__YB_ATLAS_GEOJSON;return geoCache}
    const urls=[`data/provinces.geojson?v=${VERSION}`,`./data/provinces.geojson?v=${VERSION}`];
    let last=null;
    for(const url of urls){try{const r=await fetch(url,{cache:'no-store',headers:{Accept:'application/geo+json,application/json'}});if(!r.ok)throw new Error(`GeoJSON ${r.status}`);const g=await r.json();if(!Array.isArray(g.features)||g.features.length<70)throw new Error(`Atlas ${g.features?.length||0} il aldı`);geoCache=g;window.__YB_ATLAS_GEOJSON=g;return g}catch(e){last=e}}
    throw last||new Error('Atlas verisi alınamadı');
  }

  function draw(host,geo){
    if($('#'+ATLAS_ID,host))return;
    const features=geo.features.filter(f=>f?.geometry);const {paths}=project(features,1000,650);const shell=document.createElement('div');shell.id=ATLAS_ID;
    shell.innerHTML=`<svg viewBox="0 0 1000 650" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Türkiye 81 il interaktif KPSS atlası"><defs><linearGradient id="yb17bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#071a2c"/><stop offset="1" stop-color="#081322"/></linearGradient><linearGradient id="yb17province" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2e98bf"/><stop offset="1" stop-color="#174e6b"/></linearGradient><filter id="yb17shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity=".55"/></filter><filter id="yb17glow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#62dfff" flood-opacity=".8"/></filter></defs><rect class="yb-v17-bg" x="0" y="0" width="1000" height="650"/><g opacity=".75">${Array.from({length:12},(_,i)=>`<path class="yb-v17-grid" d="M${i*90} 0V650 M0 ${i*60}H1000"/>`).join('')}</g><text class="yb-v17-title" x="32" y="48">TÜRKİYE · 81 İL</text><text class="yb-v17-sub" x="33" y="67">Haritadan seç · öğren · test çöz</text><g data-depth></g><g data-provinces></g><g data-labels></g></svg>`;
    host.appendChild(shell);const svg=$('svg',shell),depth=$('[data-depth]',svg),group=$('[data-provinces]',svg),labels=$('[data-labels]',svg),mode=activeMode(),info=createInfo(host);
    paths.forEach(item=>{const p=findProvince(item.name,item.number);const d=document.createElementNS(NS,'path');d.setAttribute('d',item.d);d.setAttribute('class','yb-province');d.setAttribute('fill',colorFor(p,mode));d.dataset.name=item.name;d.dataset.number=item.number;d.setAttribute('tabindex','0');d.setAttribute('aria-label',item.name);const shadow=document.createElementNS(NS,'path');shadow.setAttribute('d',item.d);shadow.setAttribute('class','yb-province-depth');depth.appendChild(shadow);group.appendChild(d);const c=centroid({geometry:features.find(f=>String(f.properties?.name)===String(item.name))?.geometry||null});const [x,y]=project(features,1000,650).pt(c);const t=document.createElementNS(NS,'text');t.setAttribute('x',x);t.setAttribute('y',y);t.setAttribute('class','yb-label');t.textContent=item.number||'';labels.appendChild(t);const choose=()=>showInfo(info,p,d);d.addEventListener('click',choose);d.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose()}})});
    createTools(host,paths);updateLegendMode();atlasBuilt= true;
  }

  function repaint(){
    const host=$(MAP_ID);if(!host||!$('#'+ATLAS_ID,host))return;const mode=activeMode();$('.yb-v17-style');$$('.yb-province',host).forEach(shape=>{const p=findProvince(shape.dataset.name,shape.dataset.number);shape.setAttribute('fill',colorFor(p,mode))});updateLegendMode();
  }

  async function ensure(){
    const host=$(MAP_ID);if(!host||building)return;if($('#'+ATLAS_ID,host)){repaint();return}
    building=true;
    try{const geo=await getGeo();draw(host,geo);const status=$('#map-status');if(status)status.classList.add('hide')}catch(e){console.warn('Yurdunu Bil v17 atlas:',e);let empty=$('.yb-v17-empty',host);if(!empty){empty=document.createElement('div');empty.className='yb-v17-empty';empty.innerHTML=`<div class="yb-v17-empty-box"><h3>Atlas yüklenemedi</h3><p>81 il sınır verisi alınamadı. Diğer ders içerikleri çalışmaya devam eder; atlası tekrar deneyebilirsin.</p><button type="button">Atlası yeniden dene</button></div>`;host.appendChild(empty);empty.querySelector('button').onclick=()=>{empty.remove();geoCache=null;ensure()}}}finally{building=false}
  }

  function installSidebar(){
    if(window.innerWidth>760)return;const sidebar=$('.sidebar');if(!sidebar)return;sidebar.classList.remove('yb-mobile-open');let backdrop=$('.yb-sidebar-backdrop');if(!backdrop){backdrop=document.createElement('div');backdrop.className='yb-sidebar-backdrop';document.body.appendChild(backdrop)}let btn=$('.yb-mobile-menu');if(!btn){btn=document.createElement('button');btn.type='button';btn.className='yb-mobile-menu';btn.setAttribute('aria-label','Menüyü aç');btn.textContent='☰';document.body.appendChild(btn)}const close=()=>{sidebar.classList.remove('yb-mobile-open');backdrop.classList.remove('show');btn.setAttribute('aria-expanded','false')};const open=()=>{sidebar.classList.add('yb-mobile-open');backdrop.classList.add('show');btn.setAttribute('aria-expanded','true')};btn.onclick=()=>sidebar.classList.contains('yb-mobile-open')?close():open();backdrop.onclick=close;$$('.nav-item,[data-view]',sidebar).forEach(el=>el.addEventListener('click',close));window.addEventListener('resize',()=>{if(window.innerWidth>760)close()},{passive:true});
  }

  function watch(){
    const root=$(MAP_ID);if(!root)return;const observer=new MutationObserver(()=>{if(!$('#'+ATLAS_ID,root)&&!$('.yb-v17-empty',root))ensure();repairEncoding()});observer.observe(root,{childList:true,subtree:true});
    $$('.map-mode-btn').forEach(btn=>btn.addEventListener('click',()=>setTimeout(repaint,0)));
    window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>ensure(),180)},{passive:true});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(ensure,150)});
  }

  function start(){
    if(booted)return;booted=true;injectCSS();repairEncoding();installSidebar();watch();ensure();let n=0;const tick=()=>{repairEncoding();installSidebar();ensure();if(++n<10)setTimeout(tick,500)};tick();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
