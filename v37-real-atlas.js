/* Yurdunu Bil 37 — gerçek atlas altlığı, performans odaklı */
(()=>{
'use strict';
if(window.__YB_REAL_ATLAS_BOUND)return;
window.__YB_REAL_ATLAS_BOUND=1;
const LAKES_URL='https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_lakes.geojson';
const RIVERS_URL='https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_rivers_lake_centerlines_scale_rank.geojson';
const TURKEY={minX:25.5,maxX:45.0,minY:35.5,maxY:42.5};
const NS='http://www.w3.org/2000/svg';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=v=>String(v||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c').trim();
let cache={lakes:null,rivers:null};
const WATER_RIVER_RANK=6;
function projection(svg){const vb=(svg.getAttribute('viewBox')||'0 0 900 520').split(/\s+/).map(Number),W=vb[2]||900,H=vb[3]||520,pad=45,s=Math.min((W-pad*2)/(TURKEY.maxX-TURKEY.minX),(H-pad*2)/(TURKEY.maxY-TURKEY.minY)),usedW=(TURKEY.maxX-TURKEY.minX)*s,usedH=(TURKEY.maxY-TURKEY.minY)*s,ox=(W-usedW)/2,oy=(H-usedH)/2;return([lon,lat])=>[ox+(lon-TURKEY.minX)*s,oy+usedH-(lat-TURKEY.minY)*s]}
function coordsToD(coords,proj){let d='';for(let i=0;i<coords.length;i++){const p=coords[i],q=proj(p);if(!Number.isFinite(q[0])||!Number.isFinite(q[1]))continue;d+=(d?'L':'M')+q[0].toFixed(1)+','+q[1].toFixed(1)}return d}
function geometryPaths(g,proj){if(!g)return[];if(g.type==='LineString')return [coordsToD(g.coordinates,proj)];if(g.type==='MultiLineString')return g.coordinates.map(c=>coordsToD(c,proj)).filter(Boolean);if(g.type==='Polygon')return [coordsToD(g.coordinates[0],proj)+'Z'];if(g.type==='MultiPolygon')return g.coordinates.map(p=>coordsToD(p[0],proj)+'Z');return[]}
function featureInTurkey(f){const b=f?.bbox;if(Array.isArray(b)&&b.length>=4)return !(b[2]<TURKEY.minX||b[0]>TURKEY.maxX||b[3]<TURKEY.minY||b[1]>TURKEY.maxY);let hit=false;const walk=c=>{if(hit||!Array.isArray(c))return;if(typeof c[0]==='number'){if(c[0]>=TURKEY.minX&&c[0]<=TURKEY.maxX&&c[1]>=TURKEY.minY&&c[1]<=TURKEY.maxY)hit=true;return}for(const x of c)walk(x)};walk(f?.geometry?.coordinates);return hit}
function nameOf(f){const p=f?.properties||{};return p.name||p.NAME||p.name_en||p.NAME_EN||''}
function rankOf(f){const p=f?.properties||{};const n=Number(p.scalerank??p.RANK??p.min_zoom);return Number.isFinite(n)?n:9}
function make(tag,attrs={}){const e=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,String(v));return e}
function layer(svg){let g=$('.v37-real-water',svg);if(!g){g=make('g',{class:'v37-real-water','aria-label':'Gerçek coğrafi su altlığı'});const first=svg.firstElementChild;svg.insertBefore(g,first||null)}else g.replaceChildren();g.setAttribute('visibility','hidden');return g}
function draw(svg,data){const g=layer(svg),proj=projection(svg),lakes=(data.lakes?.features||[]).filter(featureInTurkey),rivers=(data.rivers?.features||[]).filter(f=>featureInTurkey(f)&&rankOf(f)<=WATER_RIVER_RANK),lg=make('g',{class:'v37-real-lakes'}),rg=make('g',{class:'v37-real-rivers'}),labels=make('g',{class:'v37-real-labels'});
lakes.forEach(f=>geometryPaths(f.geometry,proj).forEach(d=>{if(!d)return;const p=make('path',{d,class:'v37-lake-shape'});p.dataset.name=nameOf(f);p.setAttribute('vector-effect','non-scaling-stroke');lg.appendChild(p)}));
rivers.forEach(f=>geometryPaths(f.geometry,proj).forEach(d=>{if(!d)return;const p=make('path',{d,class:'v37-river-line'});p.dataset.name=nameOf(f);p.dataset.rank=rankOf(f);p.setAttribute('vector-effect','non-scaling-stroke');rg.appendChild(p)}));
const seen=new Set();lakes.forEach(f=>{const n=nameOf(f);if(!n||seen.has('l:'+norm(n)))return;seen.add('l:'+norm(n));let c=[];const walk=x=>{if(c.length>=1||!Array.isArray(x))return;if(typeof x[0]==='number'){c.push(x);return}for(const y of x)walk(y)};walk(f.geometry?.coordinates);if(c.length){const [x,y]=proj(c[0]);const t=make('text',{x,y,class:'v37-water-label'});t.textContent=n;labels.appendChild(t)}});rivers.filter(f=>rankOf(f)<=3).forEach(f=>{const n=nameOf(f);if(!n||seen.has('r:'+norm(n)))return;seen.add('r:'+norm(n));let c=[];const walk=x=>{if(!Array.isArray(x)||c.length>=20)return;if(typeof x[0]==='number'){c.push(x);return}for(const y of x)walk(y)};walk(f.geometry?.coordinates);if(c.length){const [x,y]=proj(c[Math.floor(c.length/2)]);const t=make('text',{x,y,class:'v37-water-label'});t.textContent=n;labels.appendChild(t)}});g.append(lg,rg,labels);requestAnimationFrame(()=>{g.setAttribute('visibility','visible')});return{lakes:lakes.length,rivers:rivers.length}}
async function load(){if(!cache.lakes)cache.lakes=fetch(LAKES_URL,{cache:'force-cache'}).then(r=>r.ok?r.json():null).catch(()=>null);if(!cache.rivers)cache.rivers=fetch(RIVERS_URL,{cache:'force-cache'}).then(r=>r.ok?r.json():null).catch(()=>null);const[lakes,rivers]=await Promise.all([cache.lakes,cache.rivers]);return{lakes,rivers}}
async function mount(shell){const svg=$('.atlas-svg',shell);if(!svg||svg.dataset.v37Real==='loading'||svg.dataset.v37Real==='ready')return;svg.dataset.v37Real='loading';try{const data=await load();if(data.lakes||data.rivers){const stats=draw(svg,{lakes:data.lakes||{features:[]},rivers:data.rivers||{features:[]}});svg.closest('.atlas-shell')?.classList.add('v37-real-ready');const badge=svg.closest('.atlas-shell')?.querySelector('.v37-real-badge');if(badge)badge.textContent=`Gerçek altlık • ${stats.lakes} göl / ${stats.rivers} ana akarsu verisi`;svg.dataset.v37Real='ready'}else{svg.dataset.v37Real='error'}}catch(e){svg.dataset.v37Real='error';console.warn('Yurdunu Bil v37 atlas:',e)}}
function scan(){$$('.atlas-shell').forEach(mount)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan,{once:true});else scan();
new MutationObserver(()=>{let t=0;clearTimeout(t);t=setTimeout(scan,180)}).observe(document.body,{subtree:true,childList:true});
window.YB_REAL_ATLAS={refresh:scan};
})();
