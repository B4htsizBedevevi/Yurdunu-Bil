/* Yurdunu Bil v58 — resilient visual interaction controller */
(()=>{'use strict';
if(window.__YB58_POLISH__)return;window.__YB58_POLISH__=true;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
function ripple(e){if(reduced())return;const b=e.currentTarget;if(!(b instanceof HTMLElement)||b.dataset.noRipple==='true')return;if(getComputedStyle(b).position==='static')b.style.position='relative';b.style.overflow='hidden';const r=document.createElement('span');r.className='yb-ripple';const rect=b.getBoundingClientRect();const size=Math.max(rect.width,rect.height)*1.45;r.style.width=r.style.height=size+'px';r.style.left=(e.clientX-rect.left-size/2)+'px';r.style.top=(e.clientY-rect.top-size/2)+'px';b.appendChild(r);setTimeout(()=>r.remove(),650)}
function bind(){
 $$('button,.btn,[role="button"]').forEach(b=>{if(b.dataset.yb58Bound)return;b.dataset.yb58Bound='1';b.addEventListener('pointerdown',()=>{if(!reduced())b.classList.add('yb-press')},{passive:true});b.addEventListener('pointerup',()=>b.classList.remove('yb-press'),{passive:true});b.addEventListener('pointercancel',()=>b.classList.remove('yb-press'),{passive:true});b.addEventListener('click',ripple)});
}
function decorate(){
 bind();
 // Keep accidental stale map entry points inert. The project is intentionally map-maintenance-only.
 $$('[data-view="map"],a[href*="#map"]').forEach(el=>{el.dataset.yb58MapDisabled='1';el.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();const root=$('#toast-root');if(root){const t=document.createElement('div');t.className='toast ok';t.textContent='Harita bölümü bakımda. Diğer çalışma araçları aktif.';root.appendChild(t);requestAnimationFrame(()=>t.classList.add('show'));setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),220)},1800)}},{capture:true})});
}
function boot(){decorate();const mo=new MutationObserver(()=>{clearTimeout(boot.t);boot.t=setTimeout(decorate,40)});mo.observe(document.body,{childList:true,subtree:true});window.addEventListener('yb57-arena-game-selected',decorate);window.addEventListener('yb57-profile-complete',()=>setTimeout(decorate,120));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
