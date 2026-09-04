/* Yurdunu Bil 45 — mobile map badge + navigation polish */
(()=>{
'use strict';
function activate(view){
 document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.id==='view-'+view));
 document.querySelectorAll('.nav-item[data-view],.mobile-nav [data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view===view));
 const titles={library:'Kütüphane',quiz:'Mini Test',events:'Etkinlikler',map:'Türkiye Haritası'};
 const p=document.querySelector('#page-title');if(p)p.textContent=titles[view]||'Genel Bakış';
}
function mount(){
 document.querySelectorAll('.mobile-nav [data-view="map"]').forEach(b=>{
   b.classList.add('yb45-map-soon');
   if(!b.querySelector('.yb45-soon')){const x=document.createElement('i');x.className='yb45-soon';x.textContent='Yakında';b.appendChild(x)}
 });
 document.documentElement.dataset.yb45='45.0.0';
}
function hookClicks(){
 document.addEventListener('click',e=>{
   const b=e.target.closest('[data-topic-quiz],[data-start-quiz],[data-bank-topic],[data-modal-quiz],[data-retry]');
   if(b)setTimeout(()=>activate('quiz'),30);
 });
}
function start(){mount();hookClicks()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});
})();
