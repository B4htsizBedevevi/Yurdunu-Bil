/* Yurdunu Bil v33 — one atlas state for every map view
 * Dashboard atlas and dedicated Türkiye Haritası keep mode + selected province aligned.
 */
(()=>{
'use strict';
const MODE_KEY='yb_map_mode_v33';
const PROVINCE_KEY='yb_map_province_v33';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
let syncing=false;

function shells(){return $$('.atlas-shell')}
function activeMode(shell){return $('.mode-tabs [data-v30-mode].active',shell)?.dataset.v30Mode||shell?.dataset.v30Mode||'default'}
function setMode(shell,id){
  const b=$(`.mode-tabs [data-v30-mode="${id}"]`,shell);
  if(!b)return;
  if(activeMode(shell)!==id)b.click();
  shell.classList.add('yb33-synced');
}
function saveMode(id){try{localStorage.setItem(MODE_KEY,id)}catch{}}
function saveProvince(name){try{if(name)localStorage.setItem(PROVINCE_KEY,name)}catch{}}
function getProvince(){try{return localStorage.getItem(PROVINCE_KEY)||''}catch{return ''}}
function getMode(){try{return localStorage.getItem(MODE_KEY)||'default'}catch{return 'default'}}

function syncModeFrom(source,id){
  if(syncing)return;
  syncing=true;
  saveMode(id);
  shells().forEach(s=>{if(s!==source)setMode(s,id)});
  syncing=false;
}
function syncProvinceFrom(source,name){
  if(syncing||!name)return;
  syncing=true;
  saveProvince(name);
  shells().forEach(s=>{
    if(s===source)return;
    const svg=$('.atlas-svg',s);if(!svg)return;
    const target=$$('.province-shape,[data-province]',svg).find(x=>String(x.dataset.province||x.getAttribute('data-province')||'').trim()===name);
    if(target){
      target.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
    }
  });
  syncing=false;
}
function restore(shell){
  if(!shell)return;
  const id=getMode();
  setMode(shell,id);
  const name=getProvince();
  if(name){
    const svg=$('.atlas-svg',shell);if(svg){
      const target=$$('.province-shape,[data-province]',svg).find(x=>String(x.dataset.province||x.getAttribute('data-province')||'').trim()===name);
      if(target){setTimeout(()=>target.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window})),0)}
    }
  }
}
function bindShell(shell){
  if(!shell||shell.dataset.yb33==='1')return;
  shell.dataset.yb33='1';
  shell.addEventListener('click',e=>{
    const mode=e.target.closest?.('.mode-tabs [data-v30-mode]');
    if(mode){syncModeFrom(shell,mode.dataset.v30Mode);return}
    const shape=e.target.closest?.('.province-shape,[data-province]');
    if(shape&&shell.querySelector('.atlas-svg')?.contains(shape)){
      const name=shape.dataset.province||shape.getAttribute('data-province')||'';
      syncProvinceFrom(shell,name);
    }
  },true);
  restore(shell);
}
function refresh(){shells().forEach(bindShell)}
let timer=0;
new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(refresh,90)}).observe(document.body,{subtree:true,childList:true});
window.addEventListener('storage',e=>{
  if(e.key===MODE_KEY||e.key===PROVINCE_KEY)setTimeout(refresh,20);
});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();
})();
