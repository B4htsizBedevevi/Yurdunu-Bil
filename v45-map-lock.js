/* Yurdunu Bil 45 — global map lock
 * Map 2.0 is parked. This file is intentionally loaded LAST so legacy modules
 * cannot reopen the old atlas or expose misleading map actions.
 */
(()=>{
'use strict';
if(window.__YB45_MAP_LOCK__)return;
window.__YB45_MAP_LOCK__=true;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const notice=()=>`<section class="yb45-map-maintenance yb45-map-lock-screen"><div class="yb45-map-orbit"><span>⌖</span></div><span class="eyebrow">TÜRKİYE COĞRAFYA ATLASI • BAKIMDA</span><h1>Harita şu an bakımda.</h1><p>Harita motorunu baştan geliştiriyoruz. 81 il ve coğrafi katmanları daha doğru, hızlı ve KPSS odaklı hale getiriyoruz.</p><div class="yb45-map-status"><div><b>MAP 2.0</b><span>Geliştiriliyor</span></div><div><b>81 İL</b><span>Veriler korunuyor</span></div><div><b>KPSS</b><span>Harita + soru bağlantısı</span></div></div><div class="yb45-map-actions"><button class="btn primary" data-view="library">📚 Kütüphanede çalış</button><button class="btn secondary" data-view="quiz">⚡ Soru bankasına geç</button><button class="btn secondary" data-view="events">◈ Etkinlikleri aç</button></div><div class="yb45-map-note">🔧 Harita sekmesi Map 2.0 hazır olduğunda yeniden açılacak.</div></section>`;
function show(){
 const v=$('#view-map');if(!v)return;
 $$('[data-view]').forEach(x=>x.classList.remove('active'));
 $$('.view').forEach(x=>x.classList.remove('active'));
 v.classList.add('active');
 v.innerHTML=notice();
 const t=$('#page-title');if(t)t.textContent='Türkiye Haritası • Bakımda';
 window.scrollTo?.({top:0,behavior:'smooth'});
}
function markMapButtons(){
 $$('[data-view="map"]').forEach(b=>{
   b.classList.add('yb45-map-disabled');
   b.setAttribute('aria-label','Harita bakımda');
   b.title='Harita bakımda — Map 2.0 hazırlanıyor';
   if(!b.querySelector('.yb45-map-badge')){const s=document.createElement('small');s.className='yb45-map-badge';s.textContent='BAKIMDA';b.appendChild(s)}
 });
 $$('a,button').forEach(el=>{
   if(el.closest('.yb45-map-maintenance'))return;
   const text=(el.textContent||'').replace(/BAKIMDA/g,'').trim();
   if(!/harita|haritadan/i.test(text))return;
   if(!el.querySelector('.yb45-map-badge')){const s=document.createElement('small');s.className='yb45-map-badge';s.textContent='BAKIMDA';el.appendChild(s)}
   el.setAttribute('title','Harita bakımda — Map 2.0 hazırlanıyor');
 }
 );
}
function guardClick(e){
 const el=e.target?.closest?.('[data-view="map"],a,button');if(!el)return;
 const text=(el.textContent||'').trim();
 if(el.matches('[data-view="map"]')||(/harita|haritadan/i.test(text)&&!el.closest('.yb45-map-maintenance'))){
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();show();return false;
 }
}
function run(){markMapButtons();const v=$('#view-map');if(v&&!v.classList.contains('active')&&v.dataset.yb45Lock==='1')v.innerHTML=notice();}
function start(){
 document.addEventListener('click',guardClick,true);
 run();
 let timer=0;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(run,80)}).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
