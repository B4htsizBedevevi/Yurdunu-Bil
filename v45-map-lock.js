/* Yurdunu Bil 45.2 — HARD MAP PARK
 * Map is fully closed until Map 2.0 is ready.
 * This guard blocks both user clicks and legacy programmatic map openings.
 */
(()=>{
'use strict';
if(window.__YB45_MAP_LOCK_HARD__)return;
window.__YB45_MAP_LOCK_HARD__=true;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const notice=()=>`<section class="yb45-map-maintenance yb45-map-lock-screen"><div class="yb45-map-orbit"><span>⌖</span></div><span class="eyebrow">TÜRKİYE COĞRAFYA ATLASI • BAKIMDA</span><h1>Harita şu an bakımda.</h1><p>Harita modülünü tamamen kapattık. 81 il ve coğrafi katmanları daha doğru, hızlı ve KPSS odaklı bir Map 2.0 olarak yeniden hazırlıyoruz.</p><div class="yb45-map-status"><div><b>MAP 2.0</b><span>Geliştiriliyor</span></div><div><b>81 İL</b><span>Veriler korunuyor</span></div><div><b>KPSS</b><span>Harita + soru bağlantısı</span></div></div><div class="yb45-map-actions"><button class="btn primary" data-view="library">📚 Kütüphanede çalış</button><button class="btn secondary" data-view="quiz">⚡ Soru bankasına geç</button><button class="btn secondary" data-view="events">◈ Etkinlikleri aç</button></div><div class="yb45-map-note">🔧 Harita sekmesi Map 2.0 hazır olduğunda yeniden açılacak.</div></section>`;
function show(){const v=$('#view-map');if(!v)return;$$('.view').forEach(x=>x.classList.remove('active'));v.classList.add('active');v.innerHTML=notice();v.dataset.yb45HardPark='1';const t=$('#page-title');if(t)t.textContent='Türkiye Haritası • Bakımda';window.scrollTo?.({top:0,behavior:'smooth'});}
function isMapControl(el){if(!el)return false;const ds=el.dataset||{};if('studyMap' in ds||'vlessonMap' in ds)return true;if(el.matches('[data-view="map"]'))return true;const text=(el.textContent||'').replace(/BAKIMDA|YAKINDA/gi,'').trim();return /^(harita|haritayı aç|türkiye atlasını aç|haritadan|haritayı)$/i.test(text)||/haritayı aç/i.test(text);}
function nearestCard(el){return el.closest('.yb45-lab-card,.yb45-topic-card,.activity-card,.feature-card,.study-card,.atlas-card,.atlas-shell,.card,section,article')||el;}
function removeLegacyDashboard(){const v=$('#view-dashboard');if(!v)return;
  $$('.atlas-card,.atlas-shell,.map-v31-panel,.map-v31-tooltip,#dash-atlas,#dash-svg',v).forEach(x=>x.remove());
  $$('[data-study-map],[data-vlesson-map]',v).forEach(x=>nearestCard(x)?.remove());
  $$('button,a',v).forEach(x=>{if(isMapControl(x)&&!x.closest('.yb45-dashboard-map-notice'))nearestCard(x)?.remove()});
  if(!$('.yb45-dashboard-map-notice',v)){const n=document.createElement('section');n.className='yb45-dashboard-map-notice yb45-map-maintenance';n.innerHTML=notice().replace('yb45-map-lock-screen','yb45-dashboard-lock-screen');v.prepend(n)}
}
function mark(){
  $$('[data-view="map"]').forEach(b=>{b.classList.add('yb45-map-disabled');b.setAttribute('aria-label','Harita bakımda');b.title='Harita bakımda — Map 2.0 hazırlanıyor';if(!b.querySelector('.yb45-map-badge')){const s=document.createElement('small');s.className='yb45-map-badge';s.textContent='BAKIMDA';b.appendChild(s)}});
  $$('[data-study-map],[data-vlesson-map]').forEach(b=>{b.classList.add('yb45-map-disabled');b.setAttribute('aria-disabled','true');b.title='Harita bakımda — Map 2.0 hazırlanıyor';if(!b.querySelector('.yb45-map-badge')){const s=document.createElement('small');s.className='yb45-map-badge';s.textContent='BAKIMDA';b.appendChild(s)}});
}
function guardClick(e){const el=e.target?.closest?.('[data-view="map"],[data-study-map],[data-vlesson-map],a,button');if(!el||!isMapControl(el))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();show();return false}
function guardNavigate(){if(typeof window.navigate!=='function')return;if(window.navigate.__yb45HardGuard)return;const original=window.navigate;function guarded(view,...args){if(String(view||'').toLowerCase()==='map'){show();return false}return original.call(this,view,...args)}guarded.__yb45HardGuard=true;window.navigate=guarded}
function guardElementClick(){const NativeClick=Element.prototype.click;if(NativeClick.__yb45Wrapped)return;function safeClick(...args){if(isMapControl(this)){show();return}return NativeClick.apply(this,args)}safeClick.__yb45Wrapped=true;safeClick.__yb45Original=NativeClick;Element.prototype.click=safeClick}
function run(){guardNavigate();guardElementClick();removeLegacyDashboard();mark();const v=$('#view-map');if(v?.classList.contains('active')&&!v.querySelector('.yb45-map-lock-screen'))show()}
function start(){document.addEventListener('click',guardClick,true);run();let timer=0;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(run,50)}).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
