/* Yurdunu Bil 42 — map geometry hotfix
   Fixes feature lines escaping the Turkey silhouette by clipping all thematic
   layers to the real 81-province geometry. Keeps one canonical SVG map.
*/
(()=>{
'use strict';
if(window.__YB42_MAP_HOTFIX)return;window.__YB42_MAP_HOTFIX=1;
const NS='http://www.w3.org/2000/svg';
const $=(s,r=document)=>r.querySelector(s);
const norm=v=>String(v??'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c').trim();
const FEATURES=window.GEO_FEATURES||{};
const PLATEAUS=[
 ['Obruk Platosu',38.20,33.25,32,13],['Bozok Platosu',39.55,35.35,38,15],['Haymana Platosu',39.25,32.75,30,13],['Cihanbeyli Platosu',38.80,32.85,38,14],['Teke Platosu',37.15,29.75,28,13],['Taşeli Platosu',36.85,32.95,27,13],['Erzurum-Kars Platosu',40.05,42.95,48,19],['Gaziantep Platosu',37.05,37.35,28,13],['Şanlıurfa Platosu',37.20,38.80,35,15],['Mardin-Midyat Platosu',37.45,40.75,28,13]
];
const el=(tag,a={})=>{const x=document.createElementNS(NS,tag);Object.entries(a).forEach(([k,v])=>x.setAttribute(k,v));return x};
function geoBounds(features){let minX=180,minY=90,maxX=-180,maxY=-90;const walk=(c)=>{if(!Array.isArray(c))return;if(typeof c[0]==='number'){minX=Math.min(minX,c[0]);maxX=Math.max(maxX,c[0]);minY=Math.min(minY,c[1]);maxY=Math.max(maxY,c[1]);return}c.forEach(walk)};features.forEach(f=>walk(f.geometry?.coordinates));return{minX,minY,maxX,maxY}}
function project(b){const sx=920/(b.maxX-b.minX||1),sy=470/(b.maxY-b.minY||1),s=Math.min(sx,sy);const cx=(b.minX+b.maxX)/2,cy=(b.minY+b.maxY)/2;return(lon,lat)=>[500+(lon-cx)*s,280-(lat-cy)*s]}
function path(g,p){const ring=r=>r.map((c,i)=>{const[x,y]=p(c[0],c[1]);return(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)}).join(' ')+' Z';if(g.type==='Polygon')return g.coordinates.map(ring).join(' ');if(g.type==='MultiPolygon')return g.coordinates.map(poly=>poly.map(ring).join(' ')).join(' ');return ''}
function ellipse(p,lat,lon,rx,ry){const[x,y]=p(lon,lat),a=[];for(let i=0;i<36;i++){const t=i*Math.PI*2/36;a.push(`${(x+Math.cos(t)*rx).toFixed(1)},${(y+Math.sin(t)*ry).toFixed(1)}`)}return a.join(' ')}
function label(g,p,text,cls){const t=el('text',{x:p[0]+5,y:p[1]-5,class:'yb42-label '+cls});t.textContent=text;g.appendChild(t)}
function redraw(){const root=$('#view-map'),svg=root?.querySelector('[data-yb41-svg]');if(!svg||!window.geoFeaturesReady)return false;const features=window.geoFeaturesReady.features;if(!features?.length)return false;const b=geoBounds(features),p=project(b);let defs=svg.querySelector('defs');if(!defs){defs=el('defs');svg.insertBefore(defs,svg.firstChild)}let clip=defs.querySelector('#yb42-turkey-clip');if(clip)clip.remove();clip=el('clipPath',{id:'yb42-turkey-clip',clipPathUnits:'userSpaceOnUse'});features.forEach(f=>clip.appendChild(el('path',{d:path(f.geometry,p)})));defs.appendChild(clip);
const old=svg.querySelector('.yb41-feature-layer');if(old)old.remove();
const state=(()=>{try{return JSON.parse(localStorage.getItem('yb41_atlas')||'{}')}catch{return{}}})();const mode=state.mode||'standard';const active=['standard','landform'].includes(mode);const g=el('g',{class:'yb41-feature-layer yb42-feature-layer '+mode,'clip-path':'url(#yb42-turkey-clip)'});const water=mode==='water'||active,land=mode==='landform'||active,mine=mode==='mining';
if(water){(FEATURES.rivers||[]).forEach(r=>{if(!Array.isArray(r.points)||r.points.length<2)return;const q=el('path',{d:r.points.map((pt,i)=>{const lat=Number(pt[0]),lon=Number(pt[1]);const[x,y]=p(lon,lat);return(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)}).join(' '),class:'yb41-river'});q.onclick=()=>window.dispatchEvent(new CustomEvent('yb:feature',{detail:{name:r.name,type:'Akarsu'}}));g.appendChild(q)});(FEATURES.lakes||[]).forEach(l=>{const q=el('polygon',{points:ellipse(p,Number(l.lat),Number(l.lon),Number(l.rx)||12,Number(l.ry)||7,class:'yb41-lake'});g.appendChild(q);label(g,p(Number(l.lon),Number(l.lat)),l.name,'water')})}
if(land){(FEATURES.plains||[]).forEach(x=>{const q=el('polygon',{points:ellipse(p,Number(x.lat),Number(x.lon),Number(x.rx)||16,Number(x.ry)||8,class:'yb41-plain'});g.appendChild(q);label(g,p(Number(x.lon),Number(x.lat)),x.name,'plain')});PLATEAUS.forEach(x=>{const q=el('polygon',{points:ellipse(p,x[1],x[2],x[3],x[4]),class:'yb41-plateau'});g.appendChild(q);label(g,p(x[2],x[1]),x[0],'plateau')});(FEATURES.mountains||[]).forEach(x=>{const q=el('circle',{cx:p(Number(x.lon),Number(x.lat))[0],cy:p(Number(x.lon),Number(x.lat))[1],r:4.5,class:'yb41-mountain'});g.appendChild(q);label(g,p(Number(x.lon),Number(x.lat)),'▲ '+x.name,'mountain')})}
if(mine)(FEATURES.mines||[]).forEach(x=>{const q=el('circle',{cx:p(Number(x.lon),Number(x.lat))[0],cy:p(Number(x.lon),Number(x.lat))[1],r:5.5,class:'yb41-mine'});g.appendChild(q);label(g,p(Number(x.lon),Number(x.lat)),'⛏ '+x.name,'mine')});svg.appendChild(g);return true}
function boot(){if(!window.geoFeaturesReady){const old=window.GEO_FEATURES;window.geoFeaturesReady=window.__YB_GEO_CACHE||null;if(!window.geoFeaturesReady&&old)window.geoFeaturesReady={features:document.querySelectorAll?[]:[]}}try{const root=$('#view-map');const svg=root?.querySelector('[data-yb41-svg]');const geo=window.__YB41_GEO_DATA;if(geo)window.geoFeaturesReady=geo;if(svg&&window.geoFeaturesReady)redraw()}catch(e){console.warn('YB42 map hotfix',e)}}
// v41 keeps its GeoJSON in a closure, so obtain it from the rendered province paths.
function deriveGeo(){const svg=$('#view-map [data-yb41-svg]');if(!svg)return null;const paths=[...svg.querySelectorAll('.yb41-province')];if(paths.length!==81)return null;return {features:paths.map(q=>({geometry:{type:'Polygon',coordinates:[]},properties:{name:q.dataset.name}}))}}
// The safest clip is a geographic bbox around the actual Turkey silhouette. Since the
// province paths are already correctly drawn, also use an SVG mask made from them.
function finalPatch(){const svg=$('#view-map [data-yb41-svg]');if(!svg)return;const layer=svg.querySelector('.yb41-feature-layer');if(!layer)return;let defs=svg.querySelector('defs');if(!defs){defs=el('defs');svg.insertBefore(defs,svg.firstChild)}let clip=defs.querySelector('#yb42-visible-clip');if(!clip){clip=el('clipPath',{id:'yb42-visible-clip',clipPathUnits:'userSpaceOnUse'});svg.querySelectorAll('.yb41-province').forEach(q=>clip.appendChild(q.cloneNode(false)));defs.appendChild(clip)}layer.setAttribute('clip-path','url(#yb42-visible-clip)');layer.style.clipPath='url(#yb42-visible-clip)';}
function wait(){let n=0;const t=setInterval(()=>{n++;const svg=$('#view-map [data-yb41-svg]');if(svg?.querySelectorAll('.yb41-province').length===81){finalPatch();clearInterval(t)}if(n>80)clearInterval(t)},250)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
window.addEventListener('yb:atlas-redraw',()=>setTimeout(wait,50));
})();
