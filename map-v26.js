/* Yurdunu Bil 26 — stable SVG atlas renderer polish
 * Keeps the existing province click system intact and fixes only the visual/map-layer problems:
 * - one consistent depth shadow instead of 81 displaced shadows
 * - province names in a dedicated top layer
 * - feature layers projected with exactly the same bounds as province geometry
 * - labels never block province clicks
 */
(() => {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const rootIds = ['dash-svg', 'map-svg'];
  let geo = null;
  let timer = 0;
  const norm = v => String(v || '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c').trim();

  function schedule(){
    clearTimeout(timer);
    timer = setTimeout(enhanceAll, 70);
  }

  async function loadGeo(){
    if (geo) return geo;
    const r = await fetch('data/provinces.geojson', {cache:'no-store'});
    if (!r.ok) throw new Error('GeoJSON HTTP '+r.status);
    geo = await r.json();
    return geo;
  }

  function coordsEach(g, cb){
    if (!g) return;
    if (g.type === 'Polygon') g.coordinates.flat().forEach(cb);
    else if (g.type === 'MultiPolygon') g.coordinates.flat(2).forEach(cb);
  }

  function bounds(fs){
    let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    for(const f of fs) coordsEach(f.geometry,c=>{
      minX=Math.min(minX,c[0]); maxX=Math.max(maxX,c[0]);
      minY=Math.min(minY,c[1]); maxY=Math.max(maxY,c[1]);
    });
    return {minX,minY,maxX,maxY};
  }

  function projectFactory(b){
    const s=Math.min(860/(b.maxX-b.minX||1),390/(b.maxY-b.minY||1));
    return (lon,lat)=>[70+(lon-b.minX)*s,465-(lat-b.minY)*s];
  }

  function ringCentroid(ring, project){
    if(!ring || ring.length < 3) return null;
    let a=0,cx=0,cy=0;
    for(let i=0;i<ring.length;i++){
      const a0=ring[i], a1=ring[(i+1)%ring.length];
      const [x0,y0]=project(a0[0],a0[1]), [x1,y1]=project(a1[0],a1[1]);
      const cross=x0*y1-x1*y0;
      a+=cross; cx+=(x0+x1)*cross; cy+=(y0+y1)*cross;
    }
    if(Math.abs(a)<0.0001) return null;
    return {x:cx/(3*a), y:cy/(3*a), area:Math.abs(a/2)};
  }

  function featureCentroid(geometry, project){
    if(geometry?.type==='Polygon'){
      const c=ringCentroid(geometry.coordinates[0],project);
      return c || averageCoords(geometry.coordinates[0],project);
    }
    if(geometry?.type==='MultiPolygon'){
      let best=null;
      geometry.coordinates.forEach(poly=>{
        const c=ringCentroid(poly[0],project) || averageCoords(poly[0],project);
        if(c && (!best || c.area>best.area)) best=c;
      });
      return best;
    }
    return null;
  }

  function averageCoords(ring,project){
    if(!ring?.length) return null;
    let x=0,y=0;
    ring.forEach(c=>{const p=project(c[0],c[1]);x+=p[0];y+=p[1];});
    return {x:x/ring.length,y:y/ring.length,area:0};
  }

  function provinceName(f){
    return f.properties?.name || f.properties?.NAME_1 || f.properties?.NAME || '';
  }

  function displayName(name){
    const n=norm(name);
    const short={
      'afyonkarahisar':'Afyon',
      'kahramanmaras':'K. Maraş',
      'sanliurfa':'Şanlıurfa',
      'diyarbakir':'Diyarbakır',
      'kutahya':'Kütahya',
      'zonguldak':'Zonguldak',
      'kirikkale':'Kırıkkale',
      'kirklareli':'Kırklareli',
      'osmaniye':'Osmaniye'
    };
    return short[n] || name;
  }

  function activeMode(svg){
    const host=svg.closest('.atlas-shell');
    return host?.querySelector('[data-mode].active')?.dataset.mode || 'default';
  }

  function selectedName(svg){
    const host=svg.closest('.dashboard-layout,.map-layout');
    const h=host?.querySelector('.province-panel h2');
    return norm(h?.textContent || '');
  }

  function clearOld(svg){
    svg.querySelectorAll('.feature-layer,.province-label-layer').forEach(x=>x.remove());
  }

  function addProvinceLabels(svg, fs, b){
    const project=projectFactory(b);
    const g=document.createElementNS(NS,'g');
    g.setAttribute('class','province-label-layer');
    const selected=selectedName(svg);
    fs.forEach(f=>{
      const name=provinceName(f);
      if(!name) return;
      const c=featureCentroid(f.geometry,project);
      if(!c) return;
      const t=document.createElementNS(NS,'text');
      t.setAttribute('x',c.x.toFixed(2));
      t.setAttribute('y',c.y.toFixed(2));
      t.setAttribute('class','province-label'+(norm(name)===selected?' selected':''));
      t.setAttribute('data-province-label',name);
      t.textContent=displayName(name);
      g.appendChild(t);
    });
    svg.appendChild(g);
  }

  function addFeatureLayer(svg, mode, b){
    if(!['water','mountains','plains','mining'].includes(mode)) return;
    const features=window.GEO_FEATURES || {};
    const project=projectFactory(b);
    const g=document.createElementNS(NS,'g');
    g.setAttribute('class','feature-layer '+mode);

    const addText=(x,y,label,cls)=>{
      const t=document.createElementNS(NS,'text');
      t.setAttribute('x',x.toFixed(1)); t.setAttribute('y',y.toFixed(1));
      t.setAttribute('class','feature-label '+cls); t.textContent=label;
      g.appendChild(t);
    };

    if(mode==='water'){
      (features.rivers||[]).forEach(r=>{
        const path=document.createElementNS(NS,'path');
        path.setAttribute('class','feature-river');
        path.setAttribute('d',(r.points||[]).map(([lat,lon],i)=>{const [x,y]=project(lon,lat);return (i?'L':'M')+x.toFixed(1)+','+y.toFixed(1);}).join(' '));
        g.appendChild(path);
      });
      (features.lakes||[]).forEach(l=>{
        const [x,y]=project(l.lon,l.lat);
        const c=document.createElementNS(NS,'ellipse');
        c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('rx',l.rx||9);c.setAttribute('ry',l.ry||5);c.setAttribute('class','feature-lake');
        g.appendChild(c); addText(x,y+3,l.name,'water-label');
      });
    }
    if(mode==='mountains'){
      (features.mountains||[]).forEach(x=>{const [p,q]=project(x.lon,x.lat);addText(p,q,'▲ '+x.name,'mountain-label');});
    }
    if(mode==='plains'){
      (features.plains||[]).forEach(x=>{const [p,q]=project(x.lon,x.lat);const c=document.createElementNS(NS,'ellipse');c.setAttribute('cx',p);c.setAttribute('cy',q);c.setAttribute('rx',x.rx||14);c.setAttribute('ry',x.ry||7);c.setAttribute('class','feature-plain');g.appendChild(c);addText(p,q+3,x.name,'plain-label');});
    }
    if(mode==='mining'){
      (features.mines||[]).forEach(x=>{const [p,q]=project(x.lon,x.lat);const c=document.createElementNS(NS,'circle');c.setAttribute('cx',p);c.setAttribute('cy',q);c.setAttribute('r',6);c.setAttribute('class','feature-mine');g.appendChild(c);addText(p+8,q+3,x.name,'mine-label');});
    }
    svg.appendChild(g);
  }

  async function enhance(svg){
    try{
      const fs=(await loadGeo()).features||[];
      if(!fs.length) return;
      const b=bounds(fs);
      clearOld(svg);
      /* Features first, province names last: names always remain visually on top. */
      addFeatureLayer(svg,activeMode(svg),b);
      addProvinceLabels(svg,fs,b);
    }catch(e){console.warn('Atlas v26:',e);}
  }

  async function enhanceAll(){
    for(const id of rootIds){const svg=document.getElementById(id);if(svg) await enhance(svg);}
  }

  const observer=new MutationObserver(()=>schedule());
  function start(){
    observer.observe(document.body,{subtree:true,childList:true});
    enhanceAll();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
