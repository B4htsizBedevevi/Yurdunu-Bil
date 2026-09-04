/* Yurdunu Bil v36 — clearer map feature overlay */
(()=>{
'use strict';
const NS='http://www.w3.org/2000/svg';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=v=>String(v||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c').trim();
function bounds(fs){let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;const walk=g=>{if(!g)return;if(g.type==='Polygon')g.coordinates.flat().forEach(c=>{minX=Math.min(minX,c[0]);maxX=Math.max(maxX,c[0]);minY=Math.min(minY,c[1]);maxY=Math.max(maxY,c[1])});else if(g.type==='MultiPolygon')g.coordinates.flat(2).forEach(c=>{minX=Math.min(minX,c[0]);maxX=Math.max(maxX,c[0]);minY=Math.min(minY,c[1]);maxY=Math.max(maxY,c[1])})};fs.forEach(f=>walk(f.geometry));return{minX,minY,maxX,maxY}}
function project(b){const sx=860/(b.maxX-b.minX||1),sy=390/(b.maxY-b.minY||1),s=Math.min(sx,sy);return(lon,lat)=>[70+(lon-b.minX)*s,465-(lat-b.minY)*s]}
function text(g,x,y,label,cls){const t=document.createElementNS(NS,'text');t.setAttribute('x',x.toFixed(1));t.setAttribute('y',y.toFixed(1));t.setAttribute('class','v36-feature-label '+cls);t.textContent=label;g.appendChild(t)}
function title(g,x,y,label){const t=document.createElementNS(NS,'text');t.setAttribute('x',x.toFixed(1));t.setAttribute('y',y.toFixed(1));t.setAttribute('class','v36-feature-title');t.textContent=label;g.appendChild(t)}
function clear(svg){$$('.v36-feature-layer',svg).forEach(x=>x.remove())}
function draw(svg,mode){clear(svg);if(!['lakes','rivers','mountains','plains','plateaus','mining'].includes(mode))return;const f=window.GEO_FEATURES||{};const fs=window.__YB30_GEO?.features||[];if(!fs.length)return;const p=project(bounds(fs)),g=document.createElementNS(NS,'g');g.setAttribute('class','v36-feature-layer '+mode);
if(mode==='rivers'){
 const major=new Set(['Kızılırmak','Sakarya','Fırat','Dicle','Yeşilırmak','Ceyhan','Seyhan']);
 (f.rivers||[]).forEach(r=>{const pts=r.points||[];if(pts.length<2)return;const path=document.createElementNS(NS,'path');path.setAttribute('class','v36-river'+(major.has(r.name)?' v36-river-major':''));path.setAttribute('d',pts.map(([lat,lon],i)=>{const[x,y]=p(lon,lat);return(i?'L':'M')+x.toFixed(1)+','+y.toFixed(1)}).join(' '));g.appendChild(path);const z=pts[Math.floor((pts.length-1)*.58)];if(z){const[x,y]=p(z[1],z[0]);text(g,x+6,y-5,r.name,'river')}});title(g,82,42,'BAŞLICA AKARSULAR','water')
}
if(mode==='lakes'){
 (f.lakes||[]).forEach(l=>{const[x,y]=p(l.lon,l.lat),e=document.createElementNS(NS,'ellipse');e.setAttribute('cx',x);e.setAttribute('cy',y);e.setAttribute('rx',Math.max(5,Math.min((l.rx||8),34)));e.setAttribute('ry',Math.max(3,Math.min((l.ry||5),18)));e.setAttribute('class','v36-lake');g.appendChild(e);text(g,x+6,y-5,l.name,'water')});title(g,82,42,'BAŞLICA GÖLLER','water')
}
if(mode==='mountains'){(f.mountains||[]).forEach(x=>{const[a,b]=p(x.lon,x.lat);text(g,a+5,b-5,'▲ '+x.name,'land')})}
if(mode==='plains'){(f.plains||[]).forEach(x=>{const[a,b]=p(x.lon,x.lat);text(g,a+5,b-5,x.name,'land')})}
if(mode==='plateaus'){(f.plateaus||[]).forEach(x=>{const[a,b]=p(x.lon,x.lat);text(g,a+5,b-5,'◆ '+x.name,'land')})}
if(mode==='mining'){(f.mines||[]).forEach(x=>{const[a,b]=p(x.lon,x.lat);text(g,a+5,b-5,'● '+x.name,'land')})}
svg.appendChild(g)}
function key(shell,mode){let k=$('.v36-map-key',shell);if(!k){k=document.createElement('div');k.className='v36-map-key';const legend=$('.legend',shell);legend?legend.after(k):shell.appendChild(k)}const labels={lakes:['<i class="lake"></i> Göl yüzeyi','İsim = göl adı'],rivers:['<i></i> Akarsu çizgisi','İsim = akarsu'],mountains:['<i class="mountain"></i> Dağ','İsim = dağ'],plains:['Ovalar','İsim = ova'],plateaus:['Platolar','İsim = plato'],mining:['Maden merkezi','İsim = maden']};const a=labels[mode];k.innerHTML=a?a.map((x,i)=>i===0?`<span>${x}</span>`:`<span>${x}</span>`).join(''):'<span>81 il</span>'}
function runShell(shell){const tabs=$('.mode-tabs',shell);if(!tabs)return;const update=()=>{const active=tabs.querySelector('button.active');const mode=active?.dataset.v30Mode||shell.dataset.v30Mode||'default';draw($('.atlas-svg',shell),mode);key(shell,mode)};update();tabs.addEventListener('click',()=>setTimeout(update,0));new MutationObserver(update).observe(tabs,{subtree:true,attributes:true,attributeFilter:['class']})}
function run(){ $$('.atlas-shell').forEach(runShell) }
run();new MutationObserver(()=>{clearTimeout(window.__yb36Timer);window.__yb36Timer=setTimeout(run,100)}).observe(document.body,{subtree:true,childList:true});
})();
