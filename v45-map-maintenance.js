/* Yurdunu Bil 45 — hard map park / maintenance screen
 * The atlas is intentionally disabled while Map 2.0 is rebuilt.
 * This guard also removes dashboard map renders created by legacy modules.
 */
(()=>{
'use strict';
if(window.__YB45_MAP_MAINTENANCE__)return;
window.__YB45_MAP_MAINTENANCE__=true;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const screen=()=>`<section class="yb45-map-maintenance"><div class="yb45-map-orbit"><span>⌖</span></div><span class="eyebrow">TÜRKİYE COĞRAFYA ATLASI • BAKIMDA</span><h1>Harita şu an bakımda.</h1><p>Harita motorunu baştan geliştiriyoruz. 81 il, akarsu, göl, ova, dağ, plato ve maden katmanlarını daha doğru ve daha kullanışlı hale getiriyoruz.</p><div class="yb45-map-status"><div><b>MAP 2.0</b><span>Geliştiriliyor</span></div><div><b>81 İL</b><span>Veri korunuyor</span></div><div><b>KPSS</b><span>Harita + soru bağlantısı</span></div></div><div class="yb45-map-actions"><button class="btn primary" data-view="library">📚 Kütüphanede çalış</button><button class="btn secondary" data-view="quiz">⚡ Soru bankasına geç</button><button class="btn secondary" data-view="events">◈ Etkinlikleri aç</button></div><div class="yb45-map-note">🔧 Bakım tamamlandığında harita sekmesi otomatik olarak yeniden açılacak.</div></section>`;
function parkMap(){const v=$('#view-map');if(!v)return;if(v.dataset.yb45Maintenance!=='1'||!v.querySelector('.yb45-map-maintenance')){v.innerHTML=screen();v.dataset.yb45Maintenance='1'}}
function cleanDashboard(){const v=$('#view-dashboard');if(!v)return;$$('.atlas-card,.atlas-shell,.map-v31-panel,.map-v31-tooltip,#dash-atlas,#dash-svg',v).forEach(x=>{const host=x.closest('.atlas-card')||x;if(host.parentElement)host.remove()});if(!v.querySelector('.yb45-dashboard-map-notice')){const n=document.createElement('section');n.className='yb45-dashboard-map-notice';n.innerHTML=screen();v.prepend(n)}}
function run(){parkMap();cleanDashboard();$$('[data-view="map"]').forEach(b=>{b.classList.add('yb45-map-disabled');b.setAttribute('aria-label','Harita bakımda');b.title='Harita bakımda — Map 2.0 hazırlanıyor';})}
function start(){run();let t=0;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(run,60)}).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
