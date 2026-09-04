/* Yurdunu Bil 43 — real geometry clipping + mobile map cleanup */
(()=>{
'use strict';
if(window.__YB43_MAP_FIX)return;window.__YB43_MAP_FIX=1;
const NS='http://www.w3.org/2000/svg';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const el=(tag,a={})=>{const x=document.createElementNS(NS,tag);Object.entries(a).forEach(([k,v])=>x.setAttribute(k,v));return x};
function buildClip(svg){
 const provinces=$$('.yb41-province',svg), layer=$('.yb41-feature-layer',svg);
 if(provinces.length!==81||!layer)return false;
 let defs=$('defs',svg);if(!defs){defs=el('defs');svg.insertBefore(defs,svg.firstChild)}
 let clip=$('#yb43-turkey-silhouette',defs);
 if(!clip){clip=el('clipPath',{id:'yb43-turkey-silhouette',clipPathUnits:'userSpaceOnUse'});defs.appendChild(clip)}
 while(clip.firstChild)clip.removeChild(clip.firstChild);
 provinces.forEach(p=>{
  const c=p.cloneNode(false);
  ['class','style','fill','stroke','stroke-width','opacity','vector-effect'].forEach(a=>c.removeAttribute(a));
  const d=p.getAttribute('d');
  if(d)c.setAttribute('d',d);
  clip.appendChild(c);
 });
 layer.setAttribute('clip-path','url(#yb43-turkey-silhouette)');
 layer.style.clipPath='url(#yb43-turkey-silhouette)';
 layer.style.overflow='hidden';
 return true;
}
function cleanOld(){
 $$('#view-map #yb42-turkey-silhouette').forEach(x=>x.remove());
 $$('#view-map .yb42-map-guard').forEach(x=>x.remove());
}
function fixMap(){const svg=$('#view-map [data-yb41-svg]');if(!svg)return false;cleanOld();return buildClip(svg)}
function dedupeMobileNav(){
 const nav=$('.mobile-nav');if(!nav)return;
 const seen=new Set();
 $$('button[data-view]',nav).forEach(b=>{const key=b.dataset.view;if(seen.has(key))b.remove();else seen.add(key)});
}
function compactMobileMap(){
 const styleId='yb43-mobile-style';if(document.getElementById(styleId))return;
 const s=document.createElement('style');s.id=styleId;s.textContent=`
@media(max-width:600px){
 #view-map .yb41-atlas{padding-bottom:88px!important}
 #view-map .yb41-hero{margin-bottom:10px!important}
 #view-map .yb41-hero h1{font-size:28px!important}
 #view-map .yb41-map-wrap{min-height:0!important;height:clamp(360px,64vh,570px)!important;overflow:hidden!important}
 #view-map .yb41-map-wrap svg{height:100%!important;min-height:0!important;max-height:none!important;transform-origin:50% 50%!important}
 #view-map .yb41-province-label{font-size:7px!important;font-weight:900!important}
 #view-map .yb41-feature-label{font-size:6.2px!important}
 #view-map .yb41-map-hint{bottom:9px!important;left:9px!important}
 #view-map .yb41-legend{padding:8px 10px!important}
 .mobile-nav button[data-view="map"]+button[data-view="map"]{display:none!important}
}
`;
 document.head.appendChild(s);
}
function watch(){
 compactMobileMap();dedupeMobileNav();
 const svg=$('#view-map [data-yb41-svg]');
 if(svg)fixMap();
}
let timer=0;const observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(watch,80)});
function start(){watch();observer.observe(document.body,{subtree:true,childList:true});setTimeout(watch,500);setTimeout(watch,1500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
