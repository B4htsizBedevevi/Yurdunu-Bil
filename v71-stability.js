/* Yurdunu Bil 71 — recovered feature stabilization */
(()=>{'use strict';
if(window.__YB71_STABILITY__)return;window.__YB71_STABILITY__=true;
const $=(s,r=document)=>r.querySelector(s);
function refreshPool(){if(window.YBQuestionPool){const raw=window.QUESTION_BANK||[];window.YBQuestionPool.questions=raw;window.YBQuestionPool.total=raw.length;}}
function loadFresh(){if(window.__YB_FRESH_POOL_LOADING__||window.__YB_FRESH_POOL_LOADED__)return;window.__YB_FRESH_POOL_LOADING__=true;const files=['data/questions-2026-expansion.js?v=98.0.0','data/questions-2026-expansion-2.js?v=98.0.0'];let i=0;function next(){if(i>=files.length){window.__YB_FRESH_POOL_LOADED__=true;window.__YB_FRESH_POOL_LOADING__=false;refreshPool();return}const s=document.createElement('script');s.src=files[i++];s.onload=next;s.onerror=next;document.head.appendChild(s)}next()}
function fixEvents(){const v=$('#view-events');if(!v||!v.classList.contains('active'))return;loadFresh();refreshPool();v.querySelectorAll('.yb55-games-panel').forEach(p=>{if(!p.querySelector('.yb55-game-card')&&!p.querySelector('.yb55-games-head'))p.remove()})}
function normalizeEvents(){fixEvents()}
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='events')setTimeout(normalizeEvents,80)});
new MutationObserver(()=>{if($('#view-events')?.classList.contains('active'))setTimeout(normalizeEvents,40)}).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',()=>setTimeout(normalizeEvents,120));
setTimeout(normalizeEvents,250);
})();