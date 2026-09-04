/* Yurdunu Bil v35 — information architecture helper */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
function details(title,nodes){
  if(!nodes.length)return;
  const d=document.createElement('details');d.className='vl-v35-details';
  const s=document.createElement('summary');s.textContent=title;d.appendChild(s);
  const box=document.createElement('div');
  nodes.forEach(n=>box.appendChild(n));d.appendChild(box);
  return d;
}
function enhanceLesson(root){
  $$('.vl-lesson',root).forEach(lesson=>{
    if(lesson.dataset.v35Done)return;
    lesson.dataset.v35Done='1';
    const grid=$('.vl-grid',lesson);
    if(grid){
      const blocks=$$('.vl-block',grid);
      if(blocks.length>2){
        const keep=blocks.slice(0,2), extra=blocks.slice(2);
        blocks.forEach(b=>b.remove());
        keep.forEach(b=>grid.appendChild(b));
        const d=details('Daha fazla konu detayı',extra);
        if(d)grid.after(d);
      }
    }
    const visuals=$$('.vl-visual-row',lesson);
    if(visuals.length){
      visuals.forEach(v=>v.remove());
      const d=details('Hızlı şema ve aktif öğrenme',visuals);
      if(d){const anchor=$('.vl-chips',lesson)||$('.vl-hero',lesson);anchor?anchor.after(d):lesson.appendChild(d)}
    }
  });
}
function tidyPage(id){
  const root=$('#view-'+id);if(!root)return;
  if(id==='topics')$$('.visual-lessons',root).forEach(x=>enhanceLesson(x));
  if(id==='library'){
    /* Library is a reference shelf: keep cards compact and let existing search/filter do the navigation. */
    $$('.note-card,.library-card',root).forEach(card=>card.classList.add('v35-library-card'));
  }
}
function run(){tidyPage('topics');tidyPage('library');tidyPage('provinceStudy');tidyPage('stats');tidyPage('favorites')}
run();
new MutationObserver(()=>{clearTimeout(window.__yb35Timer);window.__yb35Timer=setTimeout(run,60)}).observe(document.body,{subtree:true,childList:true});
})();
