/* Yurdunu Bil 71 — recovered feature stabilization */
(()=>{'use strict';
if(window.__YB71_STABILITY__)return;window.__YB71_STABILITY__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function fixEvents(){
  const v=$('#view-events');
  if(!v||!v.classList.contains('active'))return;
  // app.js used to leave an empty .yb55-games-panel as a placeholder.
  // The real game module treats that as "already mounted" and therefore skips rendering.
  v.querySelectorAll('.yb55-games-panel').forEach(p=>{
    if(!p.querySelector('.yb55-game-card')&&!p.querySelector('.yb55-games-head'))p.remove();
  });
  // Re-run the recovered game module after the placeholder is gone.
  if(window.YB55Games&&typeof window.YB55Games.pool==='function'){
    window.dispatchEvent(new CustomEvent('yb71:games-ready'));
  }
}
function normalizeEvents(){
  fixEvents();
  const v=$('#view-events');
  if(!v)return;
  // Keep one clean entry point for the two Arena actions.
  const arenaButtons=$$('[id="open-arena"]',v);
  arenaButtons.forEach(b=>{if(b.dataset.yb71Bound)return;b.dataset.yb71Bound='1';b.type='button';b.addEventListener('click',()=>window.YBArena?.open?.());});
  const socialButtons=$$('[id="open-social"]',v);
  socialButtons.forEach(b=>{if(b.dataset.yb71Bound)return;b.dataset.yb71Bound='1';b.type='button';b.addEventListener('click',()=>window.YB53Social?.open?.());});
}
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='events')setTimeout(normalizeEvents,80)});
new MutationObserver(()=>{if($('#view-events')?.classList.contains('active'))setTimeout(normalizeEvents,50)}).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',()=>setTimeout(normalizeEvents,120));
setTimeout(normalizeEvents,250);
})();
