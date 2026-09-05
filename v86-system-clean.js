/* Yurdunu Bil 86 — single navigation owner + no flash transitions */
(()=>{'use strict';
if(window.__YB86_CLEAN__)return;window.__YB86_CLEAN__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function openHome(){const v=$('#view-home');if(!v)return;$$('.view').forEach(x=>x.classList.remove('active'));v.classList.add('active');$$('.nav-item,.yb81-nav-item').forEach(x=>x.classList.remove('active'));$('.yb81-home-nav')?.classList.add('active');const t=$('#page-title');if(t)t.textContent='Ana Sayfa';window.dispatchEvent(new CustomEvent('yb:navigate',{detail:{view:'home'}}));window.scrollTo({top:0,behavior:'instant'});}
function dedupeHome(){const nav=$('.side-nav');if(!nav)return;const homes=$$('.yb81-home-nav,.yb82-home-nav',nav);if(!homes.length)return;const keep=homes[0];homes.slice(1).forEach(x=>x.remove());keep.classList.add('yb86-home-single');if(keep.dataset.yb86Bound)return;keep.dataset.yb86Bound='1';keep.onclick=e=>{e.preventDefault();e.stopPropagation();openHome()};}
function noFlash(){
 document.addEventListener('click',e=>{
  const topic=e.target.closest('[data-yb82-topic],[data-yb83-topic]');
  if(topic){e.preventDefault();e.stopImmediatePropagation();const id=topic.dataset.yb82Topic||topic.dataset.yb83Topic;const lib=$('.nav-item[data-view="library"]');lib?.click();const target=$(`[data-open-topic="${CSS.escape(id)}"]`);target?.click();return;}
  const game=e.target.closest('[data-yb82-game]');
  if(game){e.preventDefault();e.stopImmediatePropagation();const events=$('.nav-item[data-view="events"]');events?.click();window.YB55Games?.start?.('sprint');return;}
 },true);
}
function cleanEvents(){const v=$('#view-events');if(!v?.classList.contains('active'))return;$$('.arena-entry,.events-arena-strip,.yb55-arena-restore,#open-arena,#open-social,[data-yb78-action="arena"],[data-yb55-arena],[data-yb55-social]',v).forEach(x=>x.remove());v.classList.add('yb86-games-only');}
new MutationObserver(()=>{dedupeHome();cleanEvents()}).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',()=>{dedupeHome();noFlash();cleanEvents();setTimeout(dedupeHome,250);setTimeout(cleanEvents,250)});
document.addEventListener('yb:navigate',()=>{dedupeHome();setTimeout(cleanEvents,0)});
setInterval(dedupeHome,700);setInterval(cleanEvents,700);
})();
