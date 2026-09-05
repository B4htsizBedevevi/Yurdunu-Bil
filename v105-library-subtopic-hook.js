/* Yurdunu Bil 105 — bridge existing study buttons to exact subtopic ids */
(()=>{'use strict';
if(window.__YB105__)return;window.__YB105__=true;
window.addEventListener('click',e=>{const b=e.target.closest?.('[data-subquiz]');if(!b)return;const value=b.dataset.subquiz||'';if(value.includes('-'))return;const card=b.closest('.yb90-subtopic');const name=card?.querySelector('h4')?.textContent?.trim();if(!name)return;const topic=value;const rows=window.YBLearningIndex?.subtopics?.[topic]||[];const row=rows.find(x=>x.name===name);if(row)b.dataset.subquiz=row.id;},true);
})();