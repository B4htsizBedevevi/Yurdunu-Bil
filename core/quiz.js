/* Yurdunu Bil 44 — quiz module boundary */
(()=>{'use strict';const r=window.YB44;if(!r)return;const bank=()=>Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:[];r.register('quiz',{count:()=>bank().length,topics:()=>Array.isArray(window.TOPICS)?window.TOPICS:[]});})();
