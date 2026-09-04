/* Yurdunu Bil v34.1 — hotfix: scroll, duplicate panels, mobile state */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const MOBILE=()=>window.matchMedia('(max-width:820px)').matches;
function clean(){
  document.documentElement.classList.toggle('yb-mobile',MOBILE());
  /* Never allow an auxiliary map panel to become a second dashboard card. */
  $$('#view-dashboard .atlas-shell > .map-v31-panel, #view-dashboard .atlas-shell > .map-v31-tooltip').forEach(e=>e.remove());
  /* Old injected helpers can survive a view rerender; remove only exact duplicates. */
  $$('.yb34-duplicate').forEach((e,i)=>{if(i)e.remove()});
}
function mobileScrollFix(){
  if(!MOBILE())return;
  const page=$('#page-wrap');
  if(page){page.style.overscrollBehaviorX='none';page.style.scrollBehavior='smooth'}
  const active=$('.view.active');
  if(active)active.style.maxWidth='100%';
}
function markView(){
  $$('.view').forEach(v=>v.classList.toggle('yb34-view-active',v.classList.contains('active')));
}
function run(){clean();mobileScrollFix();markView()}
run();
window.addEventListener('resize',run,{passive:true});
new MutationObserver(()=>{clearTimeout(window.__yb34Timer);window.__yb34Timer=setTimeout(run,30)}).observe(document.body,{subtree:true,childList:true});
})();
