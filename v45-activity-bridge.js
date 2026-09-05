/* Yurdunu Bil 46 — compatibility bridge + unified platform loader */
(()=>{
'use strict';
function mark(){document.querySelectorAll('#view-events .yb45-lab-grid').forEach(x=>x.classList.add('yb45-activity-grid'));}
function loadV46(){
  if(window.__YB46_BRIDGE__)return;
  window.__YB46_BRIDGE__=true;
  const addCss=()=>{
    if(document.querySelector('link[data-yb46-platform-css]'))return;
    const l=document.createElement('link');l.rel='stylesheet';l.href='v46-platform.css?v=46.0.0&t='+Date.now();l.dataset.yb46PlatformCss='1';document.head.appendChild(l);
  };
  const addJs=()=>{
    if(window.__YB46_PLATFORM__||document.querySelector('script[data-yb46-platform-js]'))return;
    const s=document.createElement('script');s.src='v46-platform.js?v=46.0.0&t='+Date.now();s.dataset.yb46PlatformJs='1';document.body.appendChild(s);
  };
  addCss();addJs();
}
function start(){mark();loadV46();new MutationObserver(()=>{mark();loadV46()}).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
