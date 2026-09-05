/* Yurdunu Bil 88 — navigation, flash and duplicate-owner stabilizer */
(()=>{'use strict';
if(window.__YB88_STABILIZER__)return;window.__YB88_STABILIZER__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function dedupeNav(){const nav=$('.side-nav');if(!nav)return;const candidates=$$('.yb81-home-nav',nav);candidates.slice(1).forEach(x=>x.remove());const items=$$('.nav-item[data-view="library"],.nav-item[data-view="events"],.yb81-arena,.yb81-home-nav',nav);const seen=new Map();items.forEach(x=>{const key=x.classList.contains('yb81-arena')?'arena':(x.dataset.view||x.textContent.trim());if(seen.has(key))x.remove();else seen.set(key,x)});}
function normalizeViews(){const views=$$('.view');const active=views.filter(v=>v.classList.contains('active'));if(active.length>1){const last=active[active.length-1];active.slice(0,-1).forEach(v=>v.classList.remove('active'));last.classList.add('active')}}
function cleanLegacy(){const ev=$('#view-events');if(ev?.classList.contains('active')){$$('.events-dashboard:not(:first-of-type)',ev).forEach(x=>x.remove());$('.yb78-legacy-suppress',ev)?.remove?.()}const home=$('#view-home');if(home?.classList.contains('active')){$$('.yb82-home:not(:first-of-type)',home).forEach(x=>x.remove())}}
function stopButtonJank(){document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.matches('.study-open,.review-launch-btn,.quick-test,[data-game],[data-home],[data-yb83-topic]')){b.blur?.();document.documentElement.classList.add('yb88-busy');setTimeout(()=>document.documentElement.classList.remove('yb88-busy'),180)}},true)}
function run(){dedupeNav();normalizeViews();cleanLegacy()}
document.addEventListener('yb:navigate',()=>requestAnimationFrame(run));window.addEventListener('load',()=>setTimeout(run,120));new MutationObserver(()=>requestAnimationFrame(run)).observe(document.body,{childList:true,subtree:true});stopButtonJank();
})();
