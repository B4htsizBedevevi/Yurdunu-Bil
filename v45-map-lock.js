/* Yurdunu Bil 45 — global map lock
 * Loaded last. No legacy module is allowed to reopen Map 1.x while Map 2.0 is rebuilt.
 */
(()=>{
'use strict';
if(window.__YB45_MAP_LOCK__)return;
window.__YB45_MAP_LOCK__=true;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const notice=()=>`<section class="yb45-map-maintenance yb45-map-lock-screen"><div class="yb45-map-orbit"><span>⌖</span></div><span class="eyebrow">TÜRKİYE COĞRAFYA ATLASI • BAKIMDA</span><h1>Harita şu an bakımda.</h1><p>Harita motorunu baştan geliştiriyoruz. 81 il ve coğrafi katmanları daha doğru, hızlı ve KPSS odaklı hale getiriyoruz.</p><div class="yb45-map-status"><div><b>MAP 2.0</b><span>Geliştiriliyor</span></div><div><b>81 İL</b><span>Veriler korunuyor</span></div><div><b>KPSS</b><span>Harita + soru bağlantısı</span></div></div><div class="yb45-map-actions"><button class="btn primary" data-view="library">📚 Kütüphanede çalış</button><button class="btn secondary" data-view="quiz">⚡ Soru bankasına geç</button><button class="btn secondary" data-view="events">◈ Etkinlikleri aç</button></div><div class="yb45-map-note">🔧 Harita sekmesi Map 2.0 hazır olduğunda yeniden açılacak.</div></section>`;
function show(){const v=$('#view-map');if(!v)return;$$('.view').forEach(x=>x.classList.remove('active'));v.classList.add('active');v.innerHTML=notice();const t=$('#page-title');if(t)t.textContent='Türkiye Haritası • Bakımda';window.scrollTo?.({top:0,behavior:'smooth'});}
function mark(){
 $$('[data-view="map"]').forEach(b=>{b.classList.add('yb45-map-disabled');b.setAttribute('aria-label','Harita bakımda');b.title='Harita bakımda — Map 2.0 hazırlanıyor';if(!b.querySelector('.yb45-map-badge')){const s=document.createElement('small');s.className='yb45-map-badge';s.textContent='BAKIMDA';b.appendChild(s)}});
 $$('a,button').forEach(el=>{if(el.closest('.yb45-map-maintenance'))return;const text=(el.textContent||'').replace(/BAKIMDA/g,'').trim();if(!/harita|haritadan/i.test(text))return;if(!el.querySelector('.yb45-map-badge')){const s=document.createElement('small');s.className='yb45-map-badge';s.textContent='BAKIMDA';el.appendChild(s)}el.setAttribute('title','Harita bakımda — Map 2.0 hazırlanıyor')});
}
function guardClick(e){const el=e.target?.closest?.('[data-view="map"],a,button');if(!el)return;const text=(el.textContent||'').trim();if(el.matches('[data-view="map"]')||(/harita|haritadan/i.test(text)&&!el.closest('.yb45-map-maintenance'))){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();show();return false}}
function guardNavigate(){if(typeof window.navigate!=='function'||window.__YB45_NAV_GUARDED__)return;const original=window.navigate;window.__YB45_NAV_GUARDED__=true;window.navigate=function(view,...args){if(view==='map'){show();return false}return original.call(this,view,...args)}}
function run(){guardNavigate();mark();const v=$('#view-map');if(v?.classList.contains('active')&&!v.querySelector('.yb45-map-lock-screen'))show()}
function start(){document.addEventListener('click',guardClick,true);run();let timer=0;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(run,80)}).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
