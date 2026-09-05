/* Yurdunu Bil 45.6 — retired map hard remover */
(()=>{
'use strict';
if(window.__YB45_MAP_REMOVED__)return;
window.__YB45_MAP_REMOVED__=true;
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
function clean(){qa('[data-view="map"],[data-study-map],[data-vlesson-map]').forEach(x=>x.remove());q('#view-map')?.remove();const d=q('#view-dashboard');if(d)qa('.atlas-card,.atlas-shell,.map-v31-panel,.map-v31-tooltip,#dash-atlas,#dash-svg',d).forEach(x=>x.closest('.atlas-card')?.remove()||x.remove());qa('.yb45-map-maintenance,.yb45-dashboard-map-notice,.yb45-map-disabled').forEach(x=>x.remove())}
function start(){clean();let t=0;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(clean,20)}).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
