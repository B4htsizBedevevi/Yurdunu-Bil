/* Yurdunu Bil 71 — recovered feature stabilization */
(()=>{'use strict';
if(window.__YB71_STABILITY__)return;window.__YB71_STABILITY__=true;
const $=(s,r=document)=>r.querySelector(s);
function refreshPool(){if(window.YBQuestionPool){const raw=window.QUESTION_BANK||[];window.YBQuestionPool.questions=raw;window.YBQuestionPool.total=raw.length;}}
function fixEvents(){const v=$('#view-events');if(!v||!v.classList.contains('active'))return;refreshPool();v.querySelectorAll('.yb55-games-panel').forEach(p=>{if(!p.querySelector('.yb55-game-card')&&!p.querySelector('.yb55-games-head'))p.remove()})}
function normalizeEvents(){fixEvents()}
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='events')setTimeout(normalizeEvents,80)});
new MutationObserver(()=>{if($('#view-events')?.classList.contains('active'))setTimeout(normalizeEvents,40)}).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',()=>setTimeout(normalizeEvents,120));
setTimeout(normalizeEvents,250);
})();