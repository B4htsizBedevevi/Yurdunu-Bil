/* Yurdunu Bil 37 — canonical atlas behavior, single listener + idempotent sync */
(()=>{
'use strict';
if(window.__YB_ATLAS_CORE_BOUND)return;
window.__YB_ATLAS_CORE_BOUND=1;
const KEY='yb_map_province_v33',MODE='yb_map_mode_v33';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=v=>String(v||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c').trim();
const read=(k,d='')=>{try{return localStorage.getItem(k)||d}catch{return d}},write=(k,v)=>{try{if(v) localStorage.setItem(k,v); else localStorage.removeItem(k)}catch{}};
function canonicalMode(b){return b?.dataset.v30Mode||b?.dataset.mode||'default'}
function provinceName(s){return s?.dataset.province||s?.getAttribute('data-province')||''}
function allShells(){return $$('.atlas-shell')}
function normalizeMarkup(){
 allShells().forEach(shell=>{
  $$('.mode-tabs button',shell).forEach(b=>{const m=canonicalMode(b);if(b.dataset.mode!==m)b.dataset.mode=m;if(b.dataset.v30Mode!==m)b.dataset.v30Mode=m});
  $$('.atlas-shell>.map-v31-panel,.atlas-shell>.map-v31-tooltip',shell).forEach(x=>x.remove());
  $$('.feature-layer,.v30-feature-layer',shell).forEach(x=>{if(x.getAttribute('aria-hidden')!=='true')x.setAttribute('aria-hidden','true')});
 });
}
function paint(name){const n=norm(name);allShells().forEach(shell=>{const svg=$('.atlas-svg',shell);if(!svg)return;$$('.province-shape',svg).forEach(s=>{const on=!!n&&norm(provinceName(s))===n;if(s.classList.contains('selected')!==on)s.classList.toggle('selected',on)});$$('.province-label',svg).forEach(t=>{const on=!!n&&norm(t.dataset.provinceLabel||'')===n;if(t.classList.contains('selected')!==on)t.classList.toggle('selected',on)})})}
function syncMode(id){const m=id||'default';if(read(MODE,'default')!==m)write(MODE,m);allShells().forEach(shell=>{if(shell.dataset.ybCoreMode===m)return;shell.dataset.ybCoreMode=m;$$('.mode-tabs button',shell).forEach(b=>{const on=canonicalMode(b)===m;if(b.classList.contains('active')!==on)b.classList.toggle('active',on)})})}
function syncProvince(name){const n=name||'';if(read(KEY,'')!==n)write(KEY,n);paint(n)}
function onClick(e){const b=e.target.closest?.('.mode-tabs button');if(b){syncMode(canonicalMode(b));return}const s=e.target.closest?.('.province-shape');if(!s)return;const name=provinceName(s);if(name)syncProvince(name)}
function restore(){normalizeMarkup();syncMode(read(MODE,'default'));paint(read(KEY,''))}
let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(restore,80)}
document.addEventListener('click',onClick,true);
new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true});
window.addEventListener('storage',e=>{if(e.key===KEY||e.key===MODE)schedule()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',restore,{once:true});else restore();
})();
