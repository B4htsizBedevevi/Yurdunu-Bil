/* Yurdunu Bil 44 — library module boundary */
(()=>{'use strict';const r=window.YB44;if(!r)return;const topics=()=>Array.isArray(window.TOPICS)?window.TOPICS:[];r.register('library',{count:()=>topics().length,topics});})();
