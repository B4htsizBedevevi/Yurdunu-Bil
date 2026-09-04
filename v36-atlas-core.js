/* Yurdunu Bil 36.3 — canonical atlas behavior */
(()=>{
'use strict';
const KEY='yb_map_province_v33',MODE='yb_map_mode_v33';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=v=>String(v||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c').trim();
const read=(k,d='')=>{try{return localStorage.getItem(k)||d}catch{return d}},write=(k,v)=>{try{v?localStorage.setItem(k,v):localStorage.removeItem(k)}catch{}};
function canonicalMode(b){return b?.dataset.v30Mode||b?.dataset.mode||'default'}
function provinceName(s){return s?.dataset.province||s?.getAttribute('data-province')||''}
function allShells(){return $$('.atlas-shell')}
function normalizeMarkup(){
 allShells().forEach(shell=>{
  $$('.mode-tabs button',shell).forEach(b=>{const m=canonicalMode(b);b.dataset.mode=m;b.dataset.v30Mode=m});
  $$('.atlas-shell>.map-v31-panel,.atlas-shell>.map-v31-tooltip',shell).forEach(x=>x.remove());
  $$('.feature-layer,.v30-feature-layer',shell).forEach(x=>x.setAttribute('aria-hidden','true'));
 });
}
function paint(name){const n=norm(name);allShells().forEach(shell=>{const svg=$('.atlas-svg',shell);if(!svg)return;$$('.province-shape',svg).forEach(s=>s.classList.toggle('selected',!!n&&norm(provinceName(s))===n));$$('.province-label',svg).forEach(t=>t.classList.toggle('selected',!!n&&norm(t.dataset.provinceLabel||'')===n))})}
function syncMode(id){const m=id||'default';write(MODE,m);allShells().forEach(shell=>{$$('.mode-tabs button',shell).forEach(b=>b.classList.toggle('active',canonicalMode(b)===m))})}
function syncProvince(name){if(name)write(KEY,name);else write(KEY,'');paint(name);}
function onClick(e){const b=e.target.closest?.('.mode-tabs button');if(b){syncMode(canonicalMode(b));return}const s=e.target.closest?.('.province-shape');if(!s)return;const name=provinceName(s);if(name)syncProvince(name)}
function restore(){normalizeMarkup();syncMode(read(MODE,'default'));paint(read(KEY,''))}
let t=0;function schedule(){clearTimeout(t);t=setTimeout(restore,35)}
document.addEventListener('click',onClick,true);
new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true});
window.addEventListener('storage',e=>{if(e.key===KEY||e.key===MODE)schedule()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',restore,{once:true});else restore();
})();
