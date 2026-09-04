/* Yurdunu Bil 42 — canonical map geometry guard */
(()=>{
'use strict';
if(window.__YB42_MAP_HOTFIX)return;window.__YB42_MAP_HOTFIX=1;
const NS='http://www.w3.org/2000/svg';
const $=(s,r=document)=>r.querySelector(s);
const el=(tag,a={})=>{const x=document.createElementNS(NS,tag);Object.entries(a).forEach(([k,v])=>x.setAttribute(k,v));return x};
let busy=false;
function applyClip(){
 const svg=$('#view-map [data-yb41-svg]');
 if(!svg)return false;
 const provinces=[...svg.querySelectorAll('.yb41-province')];
 const layer=svg.querySelector('.yb41-feature-layer');
 if(provinces.length!==81||!layer)return false;
 let defs=svg.querySelector('defs');
 if(!defs){defs=el('defs');svg.insertBefore(defs,svg.firstChild)}
 let clip=defs.querySelector('#yb42-turkey-silhouette');
 if(!clip){
  clip=el('clipPath',{id:'yb42-turkey-silhouette',clipPathUnits:'userSpaceOnUse'});
  provinces.forEach(p=>{const c=p.cloneNode(false);c.removeAttribute('class');c.removeAttribute('fill');c.removeAttribute('stroke');clip.appendChild(c)});
  defs.appendChild(clip);
 }
 layer.setAttribute('clip-path','url(#yb42-turkey-silhouette)');
 layer.style.clipPath='url(#yb42-turkey-silhouette)';
 return true;
}
function watch(){
 const svg=$('#view-map [data-yb41-svg]');
 if(!svg)return setTimeout(watch,250);
 applyClip();
 const observer=new MutationObserver(()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{applyClip();busy=false})});
 observer.observe(svg,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
})();
