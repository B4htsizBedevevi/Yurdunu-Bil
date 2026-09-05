/* Yurdunu Bil 26 — stable SVG atlas renderer polish */
(() => {
  'use strict';
  const NS='http://www.w3.org/2000/svg', ROOTS=['dash-svg','map-svg'];
  let geo=null, timer=0;
  const norm=v=>String(v||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c').trim();
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(enhanceAll,80)};
  async function loadGeo(){if(geo)return geo;const r=await fetch('data/provinces.geojson',{cache:'no-store'});if(!r.ok)throw new Error('GeoJSON HTTP '+r.status);return geo=await r.json()}
  function coordsEach(g,cb){if(!g)return;if(g.type==='Polygon')g.coordinates.flat().forEach(cb);else if(g.type==='MultiPolygon')g.coordinates.flat(2).forEach(cb)}
  function bounds(fs){let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;for(const f of fs)coordsEach(f.geometry,c=>{minX=Math.min(minX,c[0]);maxX=Math.max(maxX,c[0]);minY=Math.min(minY,c[1]);maxY=Math.max(maxY,c[1])});return{minX,minY,maxX,maxY}}
  function projectFactory(b){const s=Math.min(860/(b.maxX-b.minX||1),390/(b.maxY-b.minY||1));return(lon,lat)=>[70+(lon-b.minX)*s,465-(lat-b.minY)*s]}
  function ringCentroid(ring,project){if(!ring||ring.length<3)return null;let a=0,cx=0,cy=0;for(let i=0;i<ring.length;i++){const a0=ring[i],a1=ring[(i+1)%ring.length],[x0,y0]=project(a0[0],a0[1]),[x1,y1]=project(a1[0],a1[1]),cross=x0*y1-x1*y0;a+=cross;cx+=(x0+x1)*cross;cy+=(y0+y1)*cross}if(Math.abs(a)<.0001)return null;return{x:cx/(3*a),y:cy/(3*a),area:Math.abs(a/2)}}
  function avg(ring,project){if(!ring?.length)return null;let x=0,y=0;ring.forEach(c=>{const p=project(c[0],c[1]);x+=p[0];y+=p[1]});return{x:x/ring.length,y:y/ring.length,area:0}}
  function centroid(g,project){if(g?.type==='Polygon')return ringCentroid(g.coordinates[0],project)||avg(g.coordinates[0],project);if(g?.type==='MultiPolygon'){let best=null;g.coordinates.forEach(p=>{const c=ringCentroid(p[0],project)||avg(p[0],project);if(c&&(!best||c.area>best.area))best=c});return best}return null}
  function name(f){return f.properties?.name||f.properties?.NAME_1||f.properties?.NAME||''}
  function displayName(v){const n=norm(v),m={'afyonkarahisar':'Afyon','kahramanmaras':'K. Maraş'};return m[n]||v}
  function mode(svg){return svg.closest('.atlas-shell')?.querySelector('[data-mode].active')?.dataset.mode||'default'}
  function selected(svg){return norm(svg.closest('.dashboard-layout,.map-layout')?.querySelector('.province-panel h2')?.textContent||'')}
  function addText(g,x,y,label,cls){const t=document.createElementNS(NS,'text');t.setAttribute('x',x.toFixed(1));t.setAttribute('y',y.toFixed(1));t.setAttribute('class','feature-label '+cls);t.textContent=label;g.appendChild(t)}
  function features(svg,m,b){if(!['water','mountains','plains','mining'].includes(m))return;const f=window.GEO_FEATURES||{},p=projectFactory(b),g=document.createElementNS(NS,'g');g.setAttribute('class','feature-layer '+m);
    if(m==='water'){(f.rivers||[]).forEach(r=>{const path=document.createElementNS(NS,'path');path.setAttribute('class','feature-river');path.setAttribute('d',(r.points||[]).map(([lat,lon],i)=>{const[x,y]=p(lon,lat);return(i?'L':'M')+x.toFixed(1)+','+y.toFixed(1)}).join(' '));g.appendChild(path)});(f.lakes||[]).forEach(l=>{const[x,y]=p(l.lon,l.lat),c=document.createElementNS(NS,'ellipse');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('rx',l.rx||9);c.setAttribute('ry',l.ry||5);c.setAttribute('class','feature-lake');g.appendChild(c);addText(g,x,y+3,l.name,'water-label')})}
    if(m==='mountains')(f.mountains||[]).forEach(x=>{const[a,b1]=p(x.lon,x.lat);addText(g,a,b1,'▲ '+x.name,'mountain-label')});
    if(m==='plains')(f.plains||[]).forEach(x=>{const[a,b1]=p(x.lon,x.lat),c=document.createElementNS(NS,'ellipse');c.setAttribute('cx',a);c.setAttribute('cy',b1);c.setAttribute('rx',x.rx||14);c.setAttribute('ry',x.ry||7);c.setAttribute('class','feature-plain');g.appendChild(c);addText(g,a,b1+3,x.name,'plain-label')});
    if(m==='mining')(f.mines||[]).forEach(x=>{const[a,b1]=p(x.lon,x.lat),c=document.createElementNS(NS,'circle');c.setAttribute('cx',a);c.setAttribute('cy',b1);c.setAttribute('r',6);c.setAttribute('class','feature-mine');g.appendChild(c);addText(g,a+8,b1+3,x.name,'mine-label')});
    svg.appendChild(g)
  }
  const LABEL_TUNE={
    'istanbul':[0,3],'kocaeli':[3,1],'yalova':[0,4],'bilecik':[0,-2],'sakarya':[1,-2],'duzce':[0,2],'bolu':[-2,0],
    'izmir':[-2,1],'manisa':[1,-1],'balikesir':[0,-2],'canakkale':[0,1],'bursa':[0,1],
    'kirklareli':[0,-1],'tekirdag':[0,1],'edirne':[0,1], 'osmaniye':[2,0],'kilis':[0,2],
    'hatay':[0,1],'adiyaman':[0,-1],'gaziantep':[1,1],'sanliurfa':[0,-1],'diyarbakir':[0,1],
    'rize':[1,2],'trabzon':[0,1],'giresun':[0,1],'ordu':[0,-1],'sinop':[0,1],'bartin':[0,1],'artvin':[0,-1],
    'agri':[0,-1],'igdir':[1,1],'bitlis':[0,1],'mus':[0,-1],'hakkari':[0,1],'sirnak':[0,1]
  };
  function labels(svg,fs,b){
    const p=projectFactory(b),g=document.createElementNS(NS,'g'),sel=selected(svg);g.setAttribute('class','province-label-layer');
    fs.forEach(f=>{
      const n=name(f),c=centroid(f.geometry,p);if(!n||!c)return;
      const tune=LABEL_TUNE[norm(n)]||[0,0];
      const area=c.area||0;
      const cls='province-label'+(norm(n)===sel?' selected':'')+(area<350?' tiny':area<850?' small':'');
      const t=document.createElementNS(NS,'text');t.setAttribute('x',(c.x+tune[0]).toFixed(2));t.setAttribute('y',(c.y+tune[1]).toFixed(2));t.setAttribute('class',cls);t.setAttribute('data-province-label',n);t.textContent=displayName(n);g.appendChild(t);
    });
    svg.appendChild(g)
  }
  async function enhance(svg){try{if(svg.querySelector('.province-label-layer'))return;const fs=(await loadGeo()).features||[];if(!fs.length)return;const b=bounds(fs);svg.querySelectorAll('.feature-layer').forEach(x=>x.remove());features(svg,mode(svg),b);labels(svg,fs,b)}catch(e){console.warn('Atlas v26:',e)}}
  async function enhanceAll(){for(const id of ROOTS){const s=document.getElementById(id);if(s)await enhance(s)}}
  const observer=new MutationObserver(schedule);
  function start(){observer.observe(document.body,{subtree:true,childList:true});enhanceAll()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
