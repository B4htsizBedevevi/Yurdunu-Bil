/* Yurdunu Bil 91 — library focus mode */
(()=>{'use strict';
if(window.__YB91_LIBRARY__)return;window.__YB91_LIBRARY__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function compact(){const v=$('#view-library');if(!v?.classList.contains('active'))return;const grid=$('.study-module-grid',v),zone=$('.study-zone',v);if(!grid||!zone)return;let btn=$('.yb91-module-toggle',zone);const modules=$$('.study-module',grid);if(modules.length<=12){if(btn)btn.remove();return}
 if(!btn){btn=document.createElement('button');btn.type='button';btn.className='yb91-module-toggle';grid.insertAdjacentElement('afterend',btn);btn.addEventListener('click',()=>{const expanded=btn.dataset.expanded==='1';btn.dataset.expanded=expanded?'0':'1';$$('.study-module',grid).forEach((m,i)=>m.classList.toggle('yb91-hidden-module',!expanded&&i>=12));btn.textContent=expanded?`Daha az göster · ${modules.length} modül`:`Tüm modülleri göster · ${modules.length}`;});}
 const expanded=btn.dataset.expanded==='1';modules.forEach((m,i)=>m.classList.toggle('yb91-hidden-module',!expanded&&i>=12));btn.textContent=expanded?`Daha az göster · ${modules.length} modül`:`Tüm modülleri göster · ${modules.length}`;
}
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='library')setTimeout(compact,180)});window.addEventListener('load',()=>setTimeout(compact,700));new MutationObserver(()=>setTimeout(compact,120)).observe(document.body,{childList:true,subtree:true});
})();
