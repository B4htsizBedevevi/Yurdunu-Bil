/* Yurdunu Bil 36.2 — navigation + mobile atlas stability */
(()=>{
'use strict';
const wrap=()=>document.getElementById('page-wrap');
let lastView='';
function activeView(){return document.querySelector('.view.active');}
function compactProvince(view){
  if(!view)return;
  const panel=view.querySelector('.province-panel');
  if(!panel)return;
  panel.classList.toggle('v36-map-panel',view.id==='view-map');
}
function onViewChange(){
  const view=activeView();
  if(!view)return;
  compactProvince(view);
  const id=view.id;
  if(id!==lastView){lastView=id;const w=wrap();if(w)w.scrollTo({top:0,left:0,behavior:'auto'});window.scrollTo(0,0)}
}
function bind(){
  if(document.documentElement.dataset.yb362==='1')return;
  document.documentElement.dataset.yb362='1';
  document.addEventListener('click',e=>{
    const nav=e.target.closest?.('[data-view]');
    if(nav){setTimeout(onViewChange,20);}
  },true);
  new MutationObserver(()=>requestAnimationFrame(onViewChange)).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  onViewChange();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
