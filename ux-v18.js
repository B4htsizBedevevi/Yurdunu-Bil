/* Yurdunu Bil — UX v18
   Mobile hardening + atlas preview. This layer is intentionally independent
   from the existing Leaflet logic so the dashboard can never fall back to a
   world map on phones.
*/
(() => {
  'use strict';
  const VERSION='18.0.0';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const norm=v=>String(v??'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const NS='http://www.w3.org/2000/svg';
  let geo=null;
  let busy=false;

  function css(){
    if($('#yb-v18-css'))return;
    const s=document.createElement('style');s.id='yb-v18-css';s.textContent=`
      @media(max-width:760px){
        html,body{overflow-x:hidden!important;width:100%!important;max-width:100%!important}
        .app-shell,.main-content,.view,.view-container{min-width:0!important;max-width:100%!important;width:100%!important}
        .main-content{padding:12px 10px calc(118px + env(safe-area-inset-bottom))!important}
        .mobile-bottom-nav{position:fixed!important;left:10px!important;right:10px!important;bottom:calc(8px + env(safe-area-inset-bottom))!important;width:auto!important;z-index:999999!important}
        .sidebar{position:fixed!important;left:0!important;top:0!important;bottom:0!important;margin:0!important;width:min(86vw,360px)!important;max-width:min(86vw,360px)!important;z-index:1000000!important;transform:translate3d(-110%,0,0)!important;transition:transform .25s ease!important;visibility:visible!important}
        .sidebar.yb-mobile-open{transform:translate3d(0,0,0)!important}
        .yb-sidebar-backdrop{z-index:999998!important}
        .yb-mobile-menu{z-index:1000001!important}
        /* The dashboard map is a KPSS atlas preview, not a geographic tile map. */
        #dashboard-map{position:relative!important;overflow:hidden!important;background:linear-gradient(145deg,#07192a,#0a2539)!important}
        #dashboard-map .leaflet-tile-pane,#dashboard-map .leaflet-overlay-pane,#dashboard-map .leaflet-shadow-pane,#dashboard-map .leaflet-marker-pane,#dashboard-map .leaflet-tooltip-pane,#dashboard-map .leaflet-control-container{display:none!important}
        #yb-mini-atlas{position:absolute;inset:0;width:100%;height:100%;z-index:20;overflow:hidden;border-radius:inherit}
        #yb-mini-atlas svg{display:block;width:100%;height:100%}
        #yb-mini-atlas path{stroke:rgba(203,241,255,.55);stroke-width:1;vector-effect:non-scaling-stroke;cursor:pointer;transition:fill .15s ease,filter .15s ease}
        #yb-mini-atlas path:hover{stroke:#fff;stroke-width:2;filter:drop-shadow(0 0 5px rgba(77,210,255,.8))}
        #yb-mini-atlas text{pointer-events:none;font:800 7px Inter,system-ui,sans-serif;fill:rgba(236,250,255,.75);text-anchor:middle}
        .dashboard-map,.map-preview{min-height:280px!important}
        .library-card{min-width:0!important;overflow:hidden!important}
        .library-card::after,.library-card .library-card-art,.library-card .library-card-image,.library-card .library-visual{display:none!important}
      }
    `;document.head.appendChild(s);
  }

  function repair(){
    const map=new Map([
      ['ğŸ—ºï¸','🗺️'],['ğŸ—º','🗺️'],['ğŸ“š','📚'],['ğŸ”¥','🔥'],['ğŸ§ ','🧠'],['ğŸŽ¯','🎯'],['ğŸ“Š','📊'],['ğŸ“','📍'],['ğŸ“','📝'],['ğŸŒ','🌍'],['âœ“','✓'],['âœï¸','✏️'],['â†’','→'],['â†','←'],['âœ•','×'],['âš ï¸','⚠️']
    ]);
    const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const a=[];while(w.nextNode())a.push(w.currentNode);
    a.forEach(n=>{let v=n.nodeValue||'';map.forEach((to,from)=>{if(v.includes(from))v=v.split(from).join(to)});if(v!==n.nodeValue)n.nodeValue=v});
  }

  function getBounds(features){
    let minX=180,maxX=-180,minY=90,maxY=-90;
    const walk=c=>{if(!Array.isArray(c))return;if(typeof c[0]==='number'){minX=Math.min(minX,c[0]);maxX=Math.max(maxX,c[0]);minY=Math.min(minY,c[1]);maxY=Math.max(maxY,c[1]);return}c.forEach(walk)};
    features.forEach(f=>walk(f.geometry?.coordinates));return{minX,maxX,minY,maxY};
  }
  function centroid(f){
    const p=[];const walk=c=>{if(!Array.isArray(c))return;if(typeof c[0]==='number'){p.push(c);return}c.forEach(walk)};walk(f.geometry?.coordinates);if(!p.length)return[0,0];return[p.reduce((s,x)=>s+x[0],0)/p.length,p.reduce((s,x)=>s+x[1],0)/p.length];
  }
  function project(features,w,h){
    const b=getBounds(features),dx=Math.max(.01,b.maxX-b.minX),dy=Math.max(.01,b.maxY-b.minY),pad=34,scale=Math.min((w-pad*2)/dx,(h-pad*2)/dy),ox=(w-dx*scale)/2,oy=(h-dy*scale)/2;
    const pt=([x,y])=>[ox+(x-b.minX)*scale,h-(oy+(y-b.minY)*scale)];
    const ring=r=>r.map((p,i)=>{const q=pt(p);return`${i?'L':'M'}${q[0].toFixed(2)} ${q[1].toFixed(2)}`}).join(' ')+' Z';
    const geom=g=>g?.type==='Polygon'?g.coordinates.map(ring).join(' '):g?.type==='MultiPolygon'?g.coordinates.flatMap(x=>x.map(ring)).join(' '):'';
    return{items:features.map(f=>({d:geom(f.geometry),name:f.properties?.name||'',number:Number(f.properties?.number)||0,c:pt(centroid(f))})).filter(x=>x.d)};
  }
  function color(n){const k=norm(n);return k==='default'||!k?'#176184':'#176184'}

  async function load(){
    if(geo?.features?.length)return geo;
    const r=await fetch(`data/provinces.geojson?v=${VERSION}`,{cache:'no-store'});if(!r.ok)throw new Error(`Atlas ${r.status}`);const g=await r.json();if(!Array.isArray(g.features)||g.features.length<70)throw new Error(`Atlas ${g.features?.length||0} il`);return geo=g;
  }

  function drawDashboard(g){
    const host=$('#dashboard-map');if(!host||$('#yb-mini-atlas',host))return;
    const fs=g.features.filter(f=>f?.geometry);const items=project(fs,900,520).items;
    const wrap=document.createElement('div');wrap.id='yb-mini-atlas';wrap.innerHTML=`<svg viewBox="0 0 900 520" preserveAspectRatio="xMidYMid meet" aria-label="Türkiye 81 il önizlemesi"><defs><linearGradient id="yb18g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b6c8e"/><stop offset="1" stop-color="#17435f"/></linearGradient></defs><rect width="900" height="520" fill="#07192a"/><g opacity=".35">${Array.from({length:9},(_,i)=>`<path d="M${i*110} 0V520 M0 ${i*65}H900" fill="none" stroke="#62cbed" stroke-opacity=".08"/>`).join('')}</g><text x="28" y="35" text-anchor="start" fill="#82ddff" font="900 18px Inter,system-ui,sans-serif" letter-spacing="2">TÜRKİYE · 81 İL</text><g data-provinces></g><g data-labels></g></svg>`;
    host.appendChild(wrap);const svg=$('svg',wrap),pg=$('[data-provinces]',svg),lg=$('[data-labels]',svg);
    items.forEach(it=>{const p=document.createElementNS(NS,'path');p.setAttribute('d',it.d);p.setAttribute('fill','url(#yb18g)');p.dataset.name=it.name;p.dataset.number=it.number;p.setAttribute('aria-label',it.name);p.addEventListener('click',()=>{const nav=$('[data-view="map"]');if(nav)nav.click();setTimeout(()=>{const input=$('#province-search');if(input){input.value=it.name;input.dispatchEvent(new Event('input',{bubbles:true}))}},250)});pg.appendChild(p);const t=document.createElementNS(NS,'text');t.setAttribute('x',it.c[0]);t.setAttribute('y',it.c[1]);t.textContent=it.number||'';lg.appendChild(t)});
  }

  function start(){
    css();repair();
    load().then(drawDashboard).catch(e=>console.warn('v18 dashboard atlas:',e));
    let n=0;const tick=()=>{repair();if(++n<8)setTimeout(tick,600)};tick();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
