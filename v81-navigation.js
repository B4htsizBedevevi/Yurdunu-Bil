/* Yurdunu Bil 81 — legacy navigation compatibility bridge */
(()=>{'use strict';
if(window.__YB81_NAV__)return;window.__YB81_NAV__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function install(){
 const nav=$('.side-nav');if(!nav)return;
 // Primary navigation now lives in the top bar (v98). The drawer keeps only account actions.
 $$('[data-view="home"], .yb81-arena, #sidebar-arena-btn, [data-view="events"], [data-view="library"]',nav).forEach(el=>el.remove());
 const label=$('.nav-label',nav);if(label)label.textContent='HESAP';
 const quick=$('.quick-test');
 if(quick&&!quick.dataset.yb81Bound){
   quick.dataset.yb81Bound='1';
   quick.textContent='⚡ Hızlı Oyuna Başla  →';
   quick.addEventListener('click',()=>document.querySelector('.yb98-top-link[data-view="events"]')?.click());
 }
}
function run(){install()}
window.addEventListener('load',()=>setTimeout(run,80));
document.addEventListener('yb:navigate',run);
})();
