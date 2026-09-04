/* Yurdunu Bil v37 — Gerçek Atlas Altlığı
 * Natural Earth 50m fiziksel verileri: gerçek göl poligonları + akarsu güzergâhları.
 * İl sınırları ve mevcut KPSS katmanları bunun üzerinde çalışır.
 */
(()=>{
'use strict';
const LAKES_URL='https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_lakes.geojson';
const RIVERS_URL='https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_rivers_lake_centerlines_scale_rank.geojson';
const TURKEY={minX:25.5,maxX:45.0,minY:35.5,maxY:42.5};
const NS='http://www.w3.org/2000/svg';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c').trim();
let cache={lakes:null,rivers:null};
function projection(svg){
 const vb=(svg.getAttribute('viewBox')||'0 0 900 520').split(/\s+/).map(Number),W=vb[2]||900,H=vb[3]||520;
 const pad=45,s=Math.min((W-pad*2)/(TURKEY.maxX-TURKEY.minX),(H-pad*2)/(TURKEY.maxY-TURKEY.minY));
 const usedW=(TURKEY.maxX-TURKEY.minX)*s,usedH=(TURKEY.maxY-TURKEY.minY)*s,ox=(W-usedW)/2,oy=(H-usedH)/2;
 return ([lon,lat])=>[ox+(lon-TURKEY.minX)*s,oy+usedH-(lat-TURKEY.minY)*s];
}
function coordsToD(coords,proj){return coords.map((p,i)=>{const [x,y]=proj(p);return `${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`}).join(' ')}
function geometryPaths(g,proj){
 if(!g)return[];
 if(g.type==='LineString')return [coordsToD(g.coordinates,proj)];
 if(g.type==='MultiLineString')return g.coordinates.map(c=>coordsToD(c,proj));
 if(g.type==='Polygon')return [g.coordinates[0].map((p,i)=>{const [x,y]=proj(p);return `${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`}).join(' ')+'Z'];
 if(g.type==='MultiPolygon')return g.coordinates.flatMap(p=>[p[0].map((q,i)=>{const [x,y]=proj(q);return `${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`}).join(' ')+'Z']);
 return[];
}
function featureInTurkey(f){
 const b=f?.bbox;if(Array.isArray(b)&&b.length>=4)return !(b[2]<TURKEY.minX||b[0]>TURKEY.maxX||b[3]<TURKEY.minY||b[1]>TURKEY.maxY);
 let hit=false;const walk=c=>{if(Array.isArray(c)&&typeof c[0]==='number'){if(c[0]>=TURKEY.minX&&c[0]<=TURKEY.maxX&&c[1]>=TURKEY.minY&&c[1]<=TURKEY.maxY)hit=true;return}if(Array.isArray(c))c.forEach(walk)};walk(f?.geometry?.coordinates);return hit;
}
function nameOf(f){const p=f?.properties||{};return p.name||p.NAME||p.name_en||p.NAME_EN||''}
function rankOf(f){const p=f?.properties||{};return Number(p.scalerank??p.RANK??p.min_zoom??9)||9}
function make(tag,attrs={}){const e=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,String(v)));return e}
function layer(svg){let g=$('.v37-real-water',svg);if(!g){g=make('g',{'class':'v37-real-water','aria-label':'Gerçek coğrafi su altlığı'});const first=svg.firstElementChild;svg.insertBefore(g,first||null)}else g.replaceChildren();return g}
function draw(svg,data){
 const g=layer(svg),proj=projection(svg);
 const lakes=(data.lakes?.features||[]).filter(featureInTurkey).sort((a,b)=>rankOf(b)-rankOf(a));
 const rivers=(data.rivers?.features||[]).filter(featureInTurkey).sort((a,b)=>rankOf(b)-rankOf(a));
 const lg=make('g',{class:'v37-real-lakes'}),rg=make('g',{class:'v37-real-rivers'}),labels=make('g',{class:'v37-real-labels'});
 lakes.forEach(f=>geometryPaths(f.geometry,proj).forEach(d=>{const p=make('path',{d,class:'v37-lake-shape'});p.dataset.name=nameOf(f);p.setAttribute('vector-effect','non-scaling-stroke');lg.appendChild(p)}));
 rivers.forEach(f=>geometryPaths(f.geometry,proj).forEach(d=>{const p=make('path',{d,class:'v37-river-line'});p.dataset.name=nameOf(f);p.dataset.rank=rankOf(f);p.setAttribute('vector-effect','non-scaling-stroke');rg.appendChild(p)}));
 const seen=new Set();[...lakes,...rivers].forEach(f=>{const n=nameOf(f);if(!n||seen.has(norm(n)))return;seen.add(norm(n));let coords=[];const walk=c=>{if(Array.isArray(c)&&typeof c[0]==='number'){coords.push(c);return}if(Array.isArray(c)&&coords.length<30)c.slice(0,30).forEach(walk)};walk(f.geometry?.coordinates);if(!coords.length)return;const [x,y]=proj(coords[Math.floor(coords.length/2)]);const t=make('text',{x,y,class:'v37-water-label'});t.textContent=n;labels.appendChild(t)});
 g.append(lg,rg,labels);return{lakes:lakes.length,rivers:rivers.length};
}
async function load(){
 if(!cache.lakes)cache.lakes=fetch(LAKES_URL,{cache:'force-cache'}).then(r=>r.ok?r.json():null).catch(()=>null);
 if(!cache.rivers)cache.rivers=fetch(RIVERS_URL,{cache:'force-cache'}).then(r=>r.ok?r.json():null).catch(()=>null);
 const [lakes,rivers]=await Promise.all([cache.lakes,cache.rivers]);return{lakes,rivers};
}
async function mount(shell){const svg=$('.atlas-svg',shell);if(!svg||svg.dataset.v37Real==='1')return;svg.dataset.v37Real='1';try{const data=await load();if(data.lakes||data.rivers){const stats=draw(svg,{lakes:data.lakes||{features:[]},rivers:data.rivers||{features:[]}});svg.closest('.atlas-shell')?.classList.add('v37-real-ready');const badge=svg.closest('.atlas-shell')?.querySelector('.v37-real-badge');if(badge)badge.textContent=`Gerçek altlık • ${stats.lakes} göl / ${stats.rivers} akarsu verisi`}}catch(e){console.warn('Yurdunu Bil v37 atlas:',e)}}
function scan(){ $$('.atlas-shell').forEach(mount) }
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan,{once:true});else scan();
new MutationObserver(()=>setTimeout(scan,120)).observe(document.body,{subtree:true,childList:true});
window.YB_REAL_ATLAS={refresh:scan};
})();
