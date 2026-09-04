/* Yurdunu Bil — UX v14
 * Mobile layout hardening + deterministic SVG Türkiye map + province -> Pomodoro bridge.
 */
(() => {
  'use strict';
  const VERSION = '14.0.0';
  const MAP_ID = 'full-map';
  const SELECTED_KEY = 'yb_selected_province_v1';
  let svgMapReady = false;

  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const norm = (v) => String(v ?? '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');

  function injectCSS() {
    if (document.getElementById('yb-ux14-style')) return;
    const s = document.createElement('style'); s.id = 'yb-ux14-style';
    s.textContent = `
      html,body{max-width:100%;overflow-x:hidden}
      *,*::before,*::after{box-sizing:border-box}
      button,input,select,textarea{max-width:100%;font-size:inherit}
      img,svg,canvas{max-width:100%}
      .content,.main-content,.page-content,.view-content{min-width:0;max-width:100%}
      #yb-pomodoro{width:100%;max-width:100%;min-width:0;overflow:hidden}
      #yb-pomodoro .pom-main{min-width:0}
      #yb-pomodoro .pom-side,#yb-pomodoro .pom-clock-wrap{min-width:0;max-width:100%}
      #yb-pomodoro .pom-panel,#yb-pomodoro .pom-actions,#yb-pomodoro .pom-fields{min-width:0;max-width:100%}
      #yb-pomodoro .pom-field{min-width:0}
      #yb-pomodoro .pom-field select,#yb-pomodoro .pom-field input{min-width:0;max-width:100%}
      #yb-pomodoro .pom-time{white-space:nowrap}
      @media (max-width:1100px){
        #yb-pomodoro .pom-main{grid-template-columns:minmax(0,1fr)!important;gap:10px!important}
        #yb-pomodoro .pom-clock-wrap{min-height:230px!important;order:0}
        #yb-pomodoro .pom-side{order:1}
        #yb-pomodoro .pom-clock{width:min(250px,68vw)!important}
        #yb-pomodoro .pom-actions{grid-template-columns:repeat(3,minmax(0,1fr))!important}
      }
      @media (max-width:600px){
        body{padding-bottom:86px!important}
        #yb-pomodoro{margin:10px 0 14px!important;border-radius:18px!important}
        #yb-pomodoro .pom-inner{padding:13px!important}
        #yb-pomodoro .pom-head{gap:8px!important}
        #yb-pomodoro .pom-title{font-size:18px!important;line-height:1.15!important}
        #yb-pomodoro .pom-sub{font-size:10px!important}
        #yb-pomodoro .pom-session{min-width:66px!important;padding:7px!important}
        #yb-pomodoro .pom-session b{font-size:17px!important}
        #yb-pomodoro .pom-clock-wrap{min-height:220px!important}
        #yb-pomodoro .pom-clock{width:min(235px,64vw)!important}
        #yb-pomodoro .pom-time{font-size:40px!important}
        #yb-pomodoro .pom-modes{grid-template-columns:repeat(3,minmax(0,1fr))!important}
        #yb-pomodoro .pom-mode{min-height:46px!important;padding:4px 2px!important;font-size:10px!important}
        #yb-pomodoro .pom-actions{grid-template-columns:repeat(3,minmax(0,1fr))!important}
        #yb-pomodoro .pom-btn{min-width:0!important;font-size:10px!important;padding:0 4px!important}
      }
      @media (max-width:390px){
        #yb-pomodoro .pom-head{align-items:flex-start!important}
        #yb-pomodoro .pom-title{font-size:16px!important}
        #yb-pomodoro .pom-sub{max-width:210px!important}
        #yb-pomodoro .pom-clock{width:220px!important}
        #yb-pomodoro .pom-time{font-size:36px!important}
        #yb-pomodoro .pom-fields{grid-template-columns:1fr!important}
      }

      #yb-svg-turkey-map{position:absolute;inset:0;width:100%;height:100%;z-index:30;background:linear-gradient(145deg,#071a2b,#0b2135);border-radius:inherit;overflow:hidden;touch-action:pan-x pan-y;}
      #yb-svg-turkey-map svg{display:block;width:100%;height:100%;max-width:none;overflow:visible}
      .yb-province-shape{fill:rgba(38,89,125,.72);stroke:rgba(143,219,255,.58);stroke-width:.7;vector-effect:non-scaling-stroke;cursor:pointer;transition:fill .16s ease,stroke .16s ease,filter .16s ease}
      .yb-province-shape:hover,.yb-province-shape:focus{fill:rgba(61,178,224,.9);stroke:#e8fbff;filter:drop-shadow(0 0 5px rgba(83,211,255,.45));outline:none}
      .yb-province-shape.is-selected{fill:rgba(92,206,255,.92);stroke:#fff;stroke-width:1.2;filter:drop-shadow(0 0 7px rgba(92,206,255,.55))}
      .yb-map-title{font:800 16px Inter,system-ui,sans-serif;fill:#eef9ff;letter-spacing:.5px}
      .yb-map-subtitle{font:500 9px Inter,system-ui,sans-serif;fill:#8fb1c6}
      #yb-map-info{position:absolute;left:12px;bottom:12px;z-index:40;width:min(310px,calc(100% - 24px));padding:12px 13px;border-radius:15px;background:rgba(5,16,29,.91);border:1px solid rgba(116,206,255,.25);box-shadow:0 14px 35px rgba(0,0,0,.35);backdrop-filter:blur(12px);color:#eaf7ff;display:none}
      #yb-map-info.show{display:block;animation:ybMapInfoIn .22s ease both}
      #yb-map-info .yb-mi-top{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}
      #yb-map-info strong{font-size:17px;line-height:1.1}
      #yb-map-info .yb-mi-badge{font-size:9px;font-weight:800;padding:5px 7px;border-radius:99px;background:rgba(76,203,255,.13);color:#78ddff;white-space:nowrap}
      #yb-map-info p{margin:6px 0 9px;font-size:10px;line-height:1.45;color:#9bb2c3}
      #yb-map-info button{width:100%;min-height:38px;border:0;border-radius:10px;background:linear-gradient(135deg,#62ddff,#8c7cff);color:#06111c;font-weight:900;cursor:pointer;touch-action:manipulation}
      #yb-map-info .yb-mi-close{position:absolute;right:7px;top:5px;width:26px;min-height:26px;background:transparent;color:#9eb8c8;font-size:16px}
      .yb-map-zoom{position:absolute;right:12px;bottom:12px;z-index:45;display:flex;flex-direction:column;gap:5px}
      .yb-map-zoom button{width:36px;height:36px;border-radius:10px;border:1px solid rgba(150,220,255,.2);background:rgba(6,18,31,.88);color:#dff8ff;font-size:20px;cursor:pointer}
      @keyframes ybMapInfoIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
      @media(max-width:600px){
        #yb-svg-turkey-map{border-radius:0}
        #yb-map-info{left:8px;bottom:8px;width:min(280px,calc(100% - 70px));padding:10px}
        #yb-map-info strong{font-size:15px}
        .yb-map-zoom{right:8px;bottom:8px}
      }
    `;
    document.head.appendChild(s);
  }

  function mapHost() { return document.getElementById(MAP_ID); }

  function projectFeatures(features, width, height) {
    let minX=180,maxX=-180,minY=90,maxY=-90;
    const visit=(coords)=>{
      if (!Array.isArray(coords)) return;
      if (typeof coords[0] === 'number') { minX=Math.min(minX,coords[0]);maxX=Math.max(maxX,coords[0]);minY=Math.min(minY,coords[1]);maxY=Math.max(maxY,coords[1]);return; }
      coords.forEach(visit);
    };
    features.forEach(f=>visit(f.geometry?.coordinates));
    const pad=34, dx=Math.max(.01,maxX-minX), dy=Math.max(.01,maxY-minY);
    const scale=Math.min((width-pad*2)/dx,(height-pad*2)/dy);
    const ox=(width-dx*scale)/2, oy=(height-dy*scale)/2;
    const pt=([x,y])=>[ox+(x-minX)*scale, height-(oy+(y-minY)*scale)];
    const ringPath=(ring)=>ring.map((p,i)=>{const [x,y]=pt(p);return `${i?'L':'M'}${x.toFixed(2)} ${y.toFixed(2)}`}).join(' ')+' Z';
    const geometryPath=(g)=>{
      if(!g) return '';
      if(g.type==='Polygon') return g.coordinates.map(ringPath).join(' ');
      if(g.type==='MultiPolygon') return g.coordinates.flatMap(poly=>poly.map(ringPath)).join(' ');
      return '';
    };
    return {paths:features.map(f=>({d:geometryPath(f.geometry),name:f.properties?.name||'',number:Number(f.properties?.number)||0})),pt};
  }

  function provinceData(name, number) {
    const list=Array.isArray(window.PROVINCE_DATA)?window.PROVINCE_DATA:[];
    return list.find(p=>Number(p.plate??p.number)===number) || list.find(p=>norm(p.name)===norm(name)) || {name,plate:number};
  }

  function mountInfo(host) {
    if(document.getElementById('yb-map-info')) return document.getElementById('yb-map-info');
    const info=document.createElement('div'); info.id='yb-map-info';
    info.innerHTML=`<button class="yb-mi-close" type="button" aria-label="Kapat">×</button><div class="yb-mi-top"><strong data-mi-name>İl seç</strong><span class="yb-mi-badge" data-mi-region>Türkiye</span></div><p data-mi-text>Haritada bir ile dokun. İl bilgilerini ve çalışma bağlantısını aç.</p><button type="button" data-mi-study>Bu il ile çalış →</button>`;
    host.appendChild(info);
    info.querySelector('.yb-mi-close').onclick=()=>info.classList.remove('show');
    return info;
  }

  function connectPomodoro(data) {
    const subject=document.querySelector('#yb-pomodoro [data-pom-subject]');
    if(!subject) return;
    const value=`Coğrafya — ${data.name}`;
    let option=[...subject.options].find(o=>o.value===value);
    if(!option){option=document.createElement('option');option.value=value;option.textContent=value;subject.appendChild(option)}
    subject.value=value; subject.dispatchEvent(new Event('change',{bubbles:true}));
    localStorage.setItem(SELECTED_KEY,JSON.stringify({name:data.name,plate:data.plate||data.number||0,at:Date.now()}));
    const pom=document.getElementById('yb-pomodoro');
    if(pom){pom.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>pom.querySelector('[data-action="toggle"]')?.focus(),450)}
  }

  async function buildSVG() {
    const host=mapHost();
    if(!host || svgMapReady) return;
    injectCSS();
    try{
      const response=await fetch(`data/provinces.geojson?v=${VERSION}`,{cache:'no-store'});
      if(!response.ok) throw new Error(`GeoJSON ${response.status}`);
      const geo=await response.json();
      const features=Array.isArray(geo.features)?geo.features.filter(f=>f?.geometry):[];
      if(features.length<70) throw new Error(`Yalnızca ${features.length} il yüklendi`);
      host.style.position='relative';
      const w=1000,h=650;
      const projection=projectFeatures(features,w,h);
      const info=mountInfo(host);
      const selected={name:''};
      const svgNS='http://www.w3.org/2000/svg';
      const shell=document.createElement('div');shell.id='yb-svg-turkey-map';
      const svg=document.createElementNS(svgNS,'svg');svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('role','img');svg.setAttribute('aria-label','Türkiye 81 il interaktif haritası');
      const bg=document.createElementNS(svgNS,'rect');bg.setAttribute('width',w);bg.setAttribute('height',h);bg.setAttribute('fill','transparent');svg.appendChild(bg);
      const title=document.createElementNS(svgNS,'text');title.setAttribute('x','28');title.setAttribute('y','34');title.setAttribute('class','yb-map-title');title.textContent='TÜRKİYE · 81 İL';svg.appendChild(title);
      const sub=document.createElementNS(svgNS,'text');sub.setAttribute('x','29');sub.setAttribute('y','51');sub.setAttribute('class','yb-map-subtitle');sub.textContent='Bir ile dokun → bilgiyi aç → çalışma oturumunu başlat';svg.appendChild(sub);
      const group=document.createElementNS(svgNS,'g');group.setAttribute('transform','translate(0,20)');svg.appendChild(group);
      projection.paths.forEach((item,index)=>{
        const path=document.createElementNS(svgNS,'path');path.setAttribute('d',item.d);path.setAttribute('class','yb-province-shape');path.dataset.name=item.name;path.dataset.number=String(item.number);path.setAttribute('tabindex','0');path.setAttribute('aria-label',item.name);
        const choose=()=>{
          group.querySelectorAll('.is-selected').forEach(x=>x.classList.remove('is-selected'));path.classList.add('is-selected');
          const data=provinceData(item.name,item.number);selected.name=data.name||item.name;
          info.querySelector('[data-mi-name]').textContent=data.name||item.name;
          info.querySelector('[data-mi-region]').textContent=data.region||'Türkiye';
          const bits=[];if(data.climate)bits.push(data.climate);if(data.crops)bits.push(Array.isArray(data.crops)?data.crops.slice(0,3).join(', '):String(data.crops));
          info.querySelector('[data-mi-text]').textContent=bits.join(' · ')||'İl bilgilerini çalışma oturumuna bağlayabilirsin.';
          info.querySelector('[data-mi-study]').onclick=()=>connectPomodoro(data);
          info.classList.add('show');
        };
        path.addEventListener('click',choose);path.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose()}});group.appendChild(path);
      });
      shell.appendChild(svg);
      const zoom=document.createElement('div');zoom.className='yb-map-zoom';zoom.innerHTML='<button type="button" aria-label="Yakınlaştır">+</button><button type="button" aria-label="Uzaklaştır">−</button>';
      shell.appendChild(zoom);
      host.appendChild(shell);
      let scale=1;
      const applyZoom=()=>svg.style.transform=`scale(${scale})`;applyZoom();
      zoom.children[0].onclick=()=>{scale=Math.min(1.8,scale+.12);applyZoom()};
      zoom.children[1].onclick=()=>{scale=Math.max(1,scale-.12);applyZoom()};
      svgMapReady=true;
      host.querySelector('#map-status')?.remove();
    }catch(error){
      console.warn('YB v14 SVG harita oluşturulamadı:',error);
    }
  }

  function hookLeaflet(){
    if(!window.L?.Map?.addInitHook) return false;
    if(window.__YB_V14_LEAFLET_HOOK__) return true;
    window.__YB_V14_LEAFLET_HOOK__=true;
    window.L.Map.addInitHook(function(){
      try{
        const id=this.getContainer?.()?.id;
        if(id!==MAP_ID) return;
        setTimeout(()=>{try{this.invalidateSize({pan:false})}catch(_){};buildSVG()},60);
        [250,700,1400].forEach(ms=>setTimeout(()=>{try{this.invalidateSize({pan:false})}catch(_){}},ms));
      }catch(_){ }
    });
    return true;
  }

  function boot(){
    injectCSS();
    hookLeaflet();
    if(mapHost()) buildSVG(); else setTimeout(boot,250);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
