/* Yurdunu Bil — deterministic feature stabilization */
(()=>{'use strict';
if(window.__YB71_STABILITY__)return;window.__YB71_STABILITY__=true;
const $=(s,r=document)=>r.querySelector(s);
function refreshPool(){if(window.YBQuestionPool){const raw=Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:[];window.YBQuestionPool.questions=raw;window.YBQuestionPool.total=raw.length}}
function normalizeEvents(){const v=$('#view-events');if(!v||!v.classList.contains('active'))return;refreshPool();v.querySelectorAll('.yb55-games-panel').forEach(p=>{if(!p.querySelector('.yb55-game-card')&&!p.querySelector('.yb55-games-head'))p.remove()})}
let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(normalizeEvents,80)}
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='events')schedule()});
window.addEventListener('load',()=>setTimeout(normalizeEvents,120));
setTimeout(normalizeEvents,250);
window.YB71Stability={refreshPool,normalizeEvents};
})();
