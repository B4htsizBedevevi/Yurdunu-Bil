/* Yurdunu Bil 45 — activity laboratory bridge */
(()=>{
'use strict';
function mark(){document.querySelectorAll('#view-events .yb45-lab-grid').forEach(x=>x.classList.add('yb45-activity-grid'));}
function start(){mark();new MutationObserver(mark).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
