/* Yurdunu Bil 87 — interaction hotfixes */
(()=>{'use strict';
if(window.__YB87_HOTFIX__)return;window.__YB87_HOTFIX__=true;
const $=(s,r=document)=>r.querySelector(s);
// Fix detached review-modal buttons: route the action to the live v76 listener.
document.addEventListener('click',e=>{
 const b=e.target.closest('.yb84-review');
 if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();
 const topic=b.getAttribute('data-review-topic')||'';
 $('#yb84-module-modal')?.classList.remove('show');
 if(!topic)return;
 const proxy=document.createElement('button');proxy.type='button';proxy.setAttribute('data-review-topic',topic);proxy.setAttribute('aria-hidden','true');proxy.style.display='none';
 document.body.appendChild(proxy);proxy.click();proxy.remove();
},true);
// Keep one clean Events view even if an older renderer wakes up later.
function eventsGuard(){const v=$('#view-events');if(!v?.classList.contains('active'))return;const page=$('.yb86-events-page',v);if(!page)return;page.classList.add('events-dashboard');v.querySelectorAll('.arena-entry,.events-arena-strip,.yb55-arena-restore,#open-arena,#open-social,[data-yb78-action="arena"],[data-yb55-arena],[data-yb55-social]').forEach(x=>x.remove());}
new MutationObserver(eventsGuard).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',()=>setTimeout(eventsGuard,250));
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='events')setTimeout(eventsGuard,0)});
})();
