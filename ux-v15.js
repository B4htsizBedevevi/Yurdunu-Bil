/* Yurdunu Bil — UX v15
 * Mobile-first layout + custom 3D atlas map.
 * No Leaflet tiles are used. The atlas is drawn locally from the bundled province data.
 */
(() => {
  'use strict';

  const VERSION = '15.0.0';
  const MAP_ID = 'full-map';
  const SELECTED_KEY = 'yb_selected_province_v1';
  const NS = 'http://www.w3.org/2000/svg';

  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm = (v) => String(v ?? '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const dataList = () => Array.isArray(window.PROVINCE_DATA) ? window.PROVINCE_DATA : [];
  const findProvince = (name, plate) => {
    const list = dataList();
    return list.find(p => Number(p.plate ?? p.number) === Number(plate)) || list.find(p => norm(p.name) === norm(name)) || { name, plate };
  };

  function css() {
    if (document.getElementById('yb-ux15-style')) return;
    const s = document.createElement('style');
    s.id = 'yb-ux15-style';
    s.textContent = `
      html,body{width:100%;max-width:100%;overflow-x:hidden}
      *,*::before,*::after{box-sizing:border-box}
      body{padding-bottom:calc(94px + env(safe-area-inset-bottom))!important}
      .main-content{width:100%!important;min-width:0!important;max-width:100%!important;overflow-x:hidden!important;padding-left:clamp(12px,3vw,30px)!important;padding-right:clamp(12px,3vw,30px)!important}
      .main-content>*{min-width:0!important;max-width:100%!important}
      .view,.page,.content-grid,.welcome-row,.hero-banner,.panel,.topic-progress-panel,.quiz-card,.quiz-start,.map-control-panel,.province-detail,.kpss-box{min-width:0!important;max-width:100%!important}
      img,video,canvas,svg{max-width:100%}
      button,input,select,textarea{max-width:100%;min-width:0}

      /* Kill desktop-width layouts on narrow screens. */
      @media(max-width:760px){
        .main-content{padding:12px 12px calc(108px + env(safe-area-inset-bottom))!important}
        .view.active,.view.active>*{width:100%!important;max-width:100%!important;min-width:0!important}
        .content-grid,.topics-grid,.library-grid,.stats-grid,.dashboard-grid,.cards-grid{grid-template-columns:1fr!important}
        .welcome-row{display:block!important;text-align:center!important}
        .welcome-row>*{width:100%!important;max-width:100%!important;margin-left:auto!important;margin-right:auto!important}
        .panel,.hero-banner,.quiz-card,.quiz-start,.map-control-panel,.province-detail,.kpss-box,.topic-progress-panel{width:100%!important;margin-left:auto!important;margin-right:auto!important}
        .panel-head{flex-wrap:wrap!important}
        .mobile-bottom-nav{z-index:100000!important}
      }

      /* Pomodoro: one clean column on mobile. */
      @media(max-width:760px){
        #yb-pomodoro{width:100%!important;max-width:100%!important;margin:12px auto 18px!important;border-radius:20px!important;overflow:hidden!important}
        #yb-pomodoro .pi{width:100%!important;padding:14px!important}
        #yb-pomodoro .ph{display:flex!important;align-items:flex-start!important;gap:10px!important}
        #yb-pomodoro .pt{font-size:19px!important;line-height:1.15!important}
        #yb-pomodoro .ps{font-size:10px!important;line-height:1.4!important;max-width:240px!important}
        #yb-pomodoro .pcnt{flex:0 0 62px!important;min-width:62px!important}
        #yb-pomodoro .grid{display:flex!important;flex-direction:column!important;width:100%!important;gap:12px!important}
        #yb-pomodoro .grid>div{width:100%!important;max-width:100%!important}
        #yb-pomodoro .clock{width:min(250px,72vw)!important;height:auto!important;margin:0 auto!important}
        #yb-pomodoro .time{font-size:42px!important}
        #yb-pomodoro .side{display:flex!important;flex-direction:column!important;width:100%!important;gap:9px!important}
        #yb-pomodoro .panel{width:100%!important;margin:0!important}
        #yb-pomodoro .modes{grid-template-columns:repeat(3,minmax(0,1fr))!important;width:100%!important}
        #yb-pomodoro .mode{min-width:0!important;width:100%!important;font-size:9px!important;padding:4px 2px!important}
        #yb-pomodoro .fields{grid-template-columns:minmax(0,1fr) 74px!important;width:100%!important}
        #yb-pomodoro .field{min-width:0!important}
        #yb-pomodoro .field select,#yb-pomodoro .field input{width:100%!important;min-width:0!important}
        #yb-pomodoro .actions{grid-template-columns:repeat(3,minmax(0,1fr))!important;width:100%!important}
        #yb-pomodoro .btn{width:100%!important;min-width:0!important;padding:0 3px!important;font-size:9px!important}
        #yb-pomodoro .stats{grid-template-columns:repeat(3,minmax(0,1fr))!important;width:100%!important}
        #yb-pomodoro .mini{line-height:1.45!important}
      }
      @media(max-width:390px){
        #yb-pomodoro .pt{font-size:17px!important}
        #yb-pomodoro .pcnt{flex-basis:56px!important;min-width:56px!important}
        #yb-pomodoro .pcnt b{font-size:16px!important}
        #yb-pomodoro .clock{width:min(225px,68vw)!important}
        #yb-pomodoro .time{font-size:37px!important}
        #yb-pomodoro .mode{font-size:8px!important}
        #yb-pomodoro .fields{grid-template-columns:1fr!important}
        #yb-pomodoro .actions{grid-template-columns:1fr 1fr!important}
        #yb-pomodoro .actions .primary{grid-column:1/-1!important}
      }

      /* Custom 3D atlas. */
      #full-map{position:relative!important;min-height:520px!important;height:min(68vh,680px)!important;width:100%!important;overflow:hidden!important;border-radius:22px!important;background:#061423!important}
      #yb-atlas3d{position:absolute;inset:0;width:100%;height:100%;overflow:hidden;background:radial-gradient(circle at 50% 44%,rgba(53,178,255,.11),transparent 42%),linear-gradient(145deg,#061423,#081d31 55%,#07101f);touch-action:none;user-select:none}
      #yb-atlas3d svg{width:100%;height:100%;display:block;overflow:visible}
      .yb-aura{fill:none;stroke:rgba(90,210,255,.08);stroke-width:1;vector-effect:non-scaling-stroke}
      .yb-gridline{stroke:rgba(120,210,255,.055);stroke-width:1;vector-effect:non-scaling-stroke}
      .yb-province-3d{cursor:pointer;stroke:rgba(154,225,255,.58);stroke-width:.72;vector-effect:non-scaling-stroke;transition:filter .18s ease,fill .18s ease,stroke .18s ease}
      .yb-province-top{fill:url(#ybProvinceGrad);}
      .yb-province-depth{fill:#0b3852;stroke:rgba(61,164,204,.24);stroke-width:.7;vector-effect:non-scaling-stroke}
      .yb-province-3d:hover,.yb-province-3d:focus{fill:#4edbff!important;stroke:#eaffff;filter:drop-shadow(0 0 7px rgba(75,215,255,.7));outline:none}
      .yb-province-3d.is-selected{fill:#65e3ff!important;stroke:#fff;stroke-width:1.3;filter:drop-shadow(0 0 10px rgba(90,220,255,.85))}
      .yb-atlas-title{font:900 18px Inter,system-ui,sans-serif;fill:#f2fbff;letter-spacing:2px}
      .yb-atlas-sub{font:600 9px Inter,system-ui,sans-serif;fill:#82a8bd;letter-spacing:.7px}
      .yb-atlas-badge{font:900 9px Inter,system-ui,sans-serif;fill:#79dcff;letter-spacing:1px}
      #yb-atlas-info{position:absolute;left:14px;right:14px;bottom:14px;z-index:60;display:none;padding:13px 14px;border-radius:16px;background:rgba(4,14,26,.93);border:1px solid rgba(109,215,255,.24);box-shadow:0 18px 50px rgba(0,0,0,.38);backdrop-filter:blur(14px);color:#edf9ff}
      #yb-atlas-info.show{display:block;animation:ybAtlasIn .2s ease both}
      #yb-atlas-info .ai-row{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
      #yb-atlas-info strong{font-size:17px;line-height:1.1}
      #yb-atlas-info .ai-region{font-size:9px;font-weight:900;color:#79dcff;background:rgba(75,210,255,.1);padding:5px 7px;border-radius:99px;white-space:nowrap}
      #yb-atlas-info p{margin:6px 0 9px;font-size:10px;line-height:1.45;color:#9cb5c5;white-space:normal;overflow-wrap:anywhere}
      #yb-atlas-info .ai-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px}
      #yb-atlas-info button{min-height:39px;border:0;border-radius:10px;background:rgba(255,255,255,.06);color:#dcefff;font:inherit;font-size:10px;font-weight:900;cursor:pointer;touch-action:manipulation}
      #yb-atlas-info button.primary{background:linear-gradient(135deg,#5ddcff,#9a8cff);color:#05121d}
      #yb-atlas-info .ai-close{position:absolute;right:6px;top:5px;width:28px;min-height:28px;background:transparent;color:#91adbf;font-size:18px}
      .yb-atlas-tools{position:absolute;right:14px;top:14px;z-index:55;display:flex;gap:6px}
      .yb-atlas-tools button{width:37px;height:37px;border:1px solid rgba(145,220,255,.18);border-radius:11px;background:rgba(5,17,29,.82);color:#e9faff;font-size:19px;cursor:pointer;backdrop-filter:blur(10px)}
      @keyframes ybAtlasIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
      @media(max-width:600px){
        #full-map{height:560px!important;min-height:560px!important;border-radius:18px!important}
        #yb-atlas3d{border-radius:18px!important}
        .yb-atlas-title{font-size:15px}
        .yb-atlas-sub{font-size:8px}
        #yb-atlas-info{left:8px;right:8px;bottom:8px;padding:11px}
        #yb-atlas-info strong{font-size:15px}
        #yb-atlas-info .ai-actions{grid-template-columns:1fr}
        .yb-atlas-tools{right:8px;top:8px}
      }
      @media(prefers-reduced-motion:reduce){.yb-province-3d{transition:none!important}}
    `;
    document.head.appendChild(s);
  }

  function project(features, width, height) {
    let minX=180,maxX=-180,minY=90,maxY=-90;
    const visit = (c) => {
      if (!Array.isArray(c)) return;
      if (typeof c[0] === 'number') { minX=Math.min(minX,c[0]);maxX=Math.max(maxX,c[0]);minY=Math.min(minY,c[1]);maxY=Math.max(maxY,c[1]);return; }
      c.forEach(visit);
    };
    features.forEach(f=>visit(f.geometry?.coordinates));
    const pad=82, dx=Math.max(.01,maxX-minX), dy=Math.max(.01,maxY-minY);
    const scale=Math.min((width-pad*2)/dx,(height-pad*2)/dy);
    const ox=(width-dx*scale)/2, oy=(height-dy*scale)/2;
    const pt=([x,y])=>[ox+(x-minX)*scale,height-(oy+(y-minY)*scale)];
    const path=(ring)=>ring.map((p,i)=>{const [x,y]=pt(p);return `${i?'L':'M'}${x.toFixed(2)} ${y.toFixed(2)}`}).join(' ')+' Z';
    const geom=(g)=>g?.type==='Polygon'?g.coordinates.map(path).join(' '):g?.type==='MultiPolygon'?g.coordinates.flatMap(poly=>poly.map(path)).join(' '):'';
    return {paths:features.map(f=>({d:geom(f.geometry),name:f.properties?.name||'',number:Number(f.properties?.number)||0}))};
  }

  function removeLegacy() {
    document.getElementById('yb-svg-turkey-map')?.remove();
    document.getElementById('yb-map-info')?.remove();
    document.querySelectorAll('#full-map .yb-map-zoom').forEach(x=>x.remove());
  }

  function infoPanel(host) {
    const old=document.getElementById('yb-atlas-info'); if(old) return old;
    const el=document.createElement('div'); el.id='yb-atlas-info';
    el.innerHTML=`<button class="ai-close" type="button" aria-label="Kapat">×</button><div class="ai-row"><strong data-name>İl seç</strong><span class="ai-region" data-region>Türkiye</span></div><p data-text>Haritada bir ile dokun. İl bilgilerini gör ve istersen o ili çalışma oturumuna bağla.</p><div class="ai-actions"><button type="button" data-details>İl detayını aç</button><button type="button" class="primary" data-study>Bu il ile çalış →</button></div>`;
    host.appendChild(el);
    el.querySelector('.ai-close').onclick=()=>el.classList.remove('show');
    return el;
  }

  function openView(name) {
    const nav=document.querySelector(`[data-view="${name}"]`);
    if(nav) nav.click();
  }

  function bindStudy(data) {
    try { localStorage.setItem(SELECTED_KEY, JSON.stringify({name:data.name,plate:data.plate||data.number||0,at:Date.now()})); } catch(_) {}
    const subject=document.querySelector('#yb-pomodoro [data-sub]');
    if(subject){
      const wanted=`Coğrafya — ${data.name}`;
      let op=[...subject.options].find(o=>o.value===wanted);
      if(!op){op=document.createElement('option');op.value=wanted;op.textContent=wanted;subject.appendChild(op)}
      subject.value=wanted; subject.dispatchEvent(new Event('change',{bubbles:true}));
    }
    openView('dashboard');
    setTimeout(()=>document.getElementById('yb-pomodoro')?.scrollIntoView({behavior:'smooth',block:'center'}),180);
  }

  async function buildAtlas() {
    const host=document.getElementById(MAP_ID);
    if(!host || host.dataset.ybAtlas15==='1') return;
    removeLegacy();
    css();
    try{
      const r=await fetch(`data/provinces.geojson?v=${VERSION}`,{cache:'no-store'});
      if(!r.ok) throw new Error(`GeoJSON ${r.status}`);
      const geo=await r.json();
      const features=(Array.isArray(geo.features)?geo.features:[]).filter(f=>f?.geometry);
      if(features.length<70) throw new Error(`İl verisi eksik: ${features.length}`);

      host.dataset.ybAtlas15='1';
      host.style.position='relative';
      const shell=document.createElement('div');shell.id='yb-atlas3d';
      const w=1200,h=760, P=project(features,w,h);
      const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('role','img');svg.setAttribute('aria-label','Yurdunu Bil özel 3D Türkiye atlası');
      const defs=document.createElementNS(NS,'defs');
      defs.innerHTML=`<linearGradient id="ybProvinceGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2d7fa8"/><stop offset=".55" stop-color="#2676a0"/><stop offset="1" stop-color="#1d5d82"/></linearGradient><radialGradient id="ybGlow"><stop offset="0" stop-color="#5de0ff" stop-opacity=".22"/><stop offset="1" stop-color="#5de0ff" stop-opacity="0"/></radialGradient><filter id="ybSoft"><feGaussianBlur stdDeviation="18"/></filter>`;
      svg.appendChild(defs);
      const bg=document.createElementNS(NS,'rect');bg.setAttribute('width',w);bg.setAttribute('height',h);bg.setAttribute('fill','transparent');svg.appendChild(bg);
      const glow=document.createElementNS(NS,'circle');glow.setAttribute('cx',w/2);glow.setAttribute('cy',h*.52);glow.setAttribute('r','260');glow.setAttribute('fill','url(#ybGlow)');glow.setAttribute('filter','url(#ybSoft)');svg.appendChild(glow);
      for(let x=80;x<w;x+=80){const l=document.createElementNS(NS,'path');l.setAttribute('d',`M${x} 90V${h-50}`);l.setAttribute('class','yb-gridline');svg.appendChild(l)}
      for(let y=100;y<h-20;y+=70){const l=document.createElementNS(NS,'path');l.setAttribute('d',`M50 ${y}H${w-50}`);l.setAttribute('class','yb-gridline');svg.appendChild(l)}
      const title=document.createElementNS(NS,'text');title.setAttribute('x','46');title.setAttribute('y','48');title.setAttribute('class','yb-atlas-title');title.textContent='TÜRKİYE ATLASI';svg.appendChild(title);
      const sub=document.createElementNS(NS,'text');sub.setAttribute('x','47');sub.setAttribute('y','67');sub.setAttribute('class','yb-atlas-sub');sub.textContent='81 İL · DOKUN · KEŞFET · ÇALIŞ';svg.appendChild(sub);
      const badge=document.createElementNS(NS,'text');badge.setAttribute('x',w-48);badge.setAttribute('y','48');badge.setAttribute('text-anchor','end');badge.setAttribute('class','yb-atlas-badge');badge.textContent='3D ATLAS';svg.appendChild(badge);
      const g=document.createElementNS(NS,'g');g.setAttribute('transform','translate(0 18)');svg.appendChild(g);
      const info=infoPanel(shell);

      P.paths.forEach(item=>{
        const depth=document.createElementNS(NS,'path');depth.setAttribute('d',item.d);depth.setAttribute('transform','translate(0 9)');depth.setAttribute('class','yb-province-depth');depth.setAttribute('aria-hidden','true');g.appendChild(depth);
        const side=document.createElementNS(NS,'path');side.setAttribute('d',item.d);side.setAttribute('transform','translate(0 5)');side.setAttribute('class','yb-province-depth');side.setAttribute('aria-hidden','true');g.appendChild(side);
        const path=document.createElementNS(NS,'path');path.setAttribute('d',item.d);path.setAttribute('class','yb-province-3d yb-province-top');path.dataset.name=item.name;path.dataset.plate=String(item.number);path.setAttribute('tabindex','0');path.setAttribute('aria-label',item.name);path.setAttribute('fill','url(#ybProvinceGrad)');
        const choose=()=>{
          g.querySelectorAll('.yb-province-3d.is-selected').forEach(x=>x.classList.remove('is-selected'));path.classList.add('is-selected');
          const data=findProvince(item.name,item.number);
          info.querySelector('[data-name]').textContent=data.name||item.name;
          info.querySelector('[data-region]').textContent=data.region||'Türkiye';
          const bits=[];
          if(data.climate)bits.push(`İklim: ${data.climate}`);
          if(data.terrain)bits.push(`Arazi: ${data.terrain}`);
          if(data.agriculture)bits.push(`Tarım: ${data.agriculture}`);
          if(data.mining)bits.push(`Maden: ${data.mining}`);
          info.querySelector('[data-text]').textContent=bits.slice(0,3).join(' · ')||'Bu il için çalışma kartını açabilirsin.';
          info.querySelector('[data-details]').onclick=()=>{try{localStorage.setItem(SELECTED_KEY,JSON.stringify({name:data.name,plate:data.plate||data.number||0,at:Date.now()}))}catch(_){};openView('map');setTimeout(()=>{const inp=document.getElementById('province-search');if(inp){inp.value=data.name;inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true))}},220)};
          info.querySelector('[data-study]').onclick=()=>bindStudy(data);
          info.classList.add('show');
        };
        path.addEventListener('click',choose);path.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose()}});g.appendChild(path);
      });
      svg.appendChild(g);
      shell.appendChild(svg);
      const tools=document.createElement('div');tools.className='yb-atlas-tools';tools.innerHTML='<button type="button" data-z="in" aria-label="Yakınlaştır">+</button><button type="button" data-z="out" aria-label="Uzaklaştır">−</button><button type="button" data-z="reset" aria-label="Haritayı sıfırla">⌂</button>';
      shell.appendChild(tools);host.appendChild(shell);

      let scale=1;
      const apply=()=>{g.setAttribute('transform',`translate(0 18) translate(${(w-w*scale)/2} ${(h-h*scale)/2}) scale(${scale})`)};
      tools.querySelector('[data-z="in"]').onclick=()=>{scale=Math.min(1.8,scale+.12);apply()};
      tools.querySelector('[data-z="out"]').onclick=()=>{scale=Math.max(.82,scale-.12);apply()};
      tools.querySelector('[data-z="reset"]').onclick=()=>{scale=1;apply()};
      apply();
    }catch(err){
      console.warn('Yurdunu Bil 3D atlas hatası:',err);
      host.innerHTML='<div style="height:100%;min-height:420px;display:grid;place-items:center;padding:24px;text-align:center;color:#9fb6c7"><div><strong style="display:block;color:#eef9ff;font-size:16px;margin-bottom:7px">Atlas hazırlanıyor…</strong><span style="font-size:11px">İl verisi yüklenemedi. Sayfayı yenilediğinde tekrar denenecek.</span></div></div>';
      host.dataset.ybAtlas15='error';
    }
  }

  function watch() {
    css();
    const run=()=>{const map=document.getElementById(MAP_ID);if(map && map.offsetWidth>0) buildAtlas()};
    run();
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)run()});
    window.addEventListener('resize',()=>{clearTimeout(window.__ybAtlasResize);window.__ybAtlasResize=setTimeout(run,120)});
    new MutationObserver(()=>run()).observe(document.body,{childList:true,subtree:true});
    let tries=0;const tick=()=>{tries++;run();if(tries<50)setTimeout(tick,250)};tick();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
})();
