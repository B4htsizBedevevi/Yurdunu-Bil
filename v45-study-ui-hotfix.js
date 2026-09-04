/* Yurdunu Bil 45 — mobile map badge + small UI polish */
(()=>{
'use strict';
function mount(){
 document.querySelectorAll('.mobile-nav [data-view="map"]').forEach(b=>{
   b.classList.add('yb45-map-soon');
   if(!b.querySelector('.yb45-soon')){const x=document.createElement('i');x.className='yb45-soon';x.textContent='Yakında';b.appendChild(x)}
 });
 document.documentElement.dataset.yb45='45.0.0';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});
})();
