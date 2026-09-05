/* Yurdunu Bil — single navigation owner */
(()=>{'use strict';
if(window.__YB98_COHESION__)return;window.__YB98_COHESION__=true;
const LABELS={home:'Ana Sayfa',library:'Kütüphane',arena:'Arena',events:'Etkinlikler & Oyunlar',settings:'Ayarlar'};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function syncActive(view){const route=LABELS[view]?view:'home';$$('.nav-item[data-view],.yb98-top-link,.mobile-bottom-link,[data-mobile-view]').forEach(x=>x.classList.toggle('active',(x.dataset.view||x.dataset.mobileView)===route));const t=$('#page-title');if(t)t.textContent=LABELS[route];window.YURDUNUBIL_ROUTE=route}
function openMap(){if(window.YBMapGames?.open)return window.YBMapGames.open();if(window.__YB_MAP_LOADING__)return false;window.__YB_MAP_LOADING__=true;const s=document.createElement('script');s.src='features/games/map-games.js?v=99.0.2';s.onload=()=>{window.__YB_MAP_LOADING__=false;window.YBMapGames?.open?.()};s.onerror=()=>{window.__YB_MAP_LOADING__=false};document.body.appendChild(s);return false}
function navigate(view){if(view==='map')return openMap();if(view==='arena'){window.YBArena?.open?.();return true}if(!LABELS[view])view='home';if(typeof window.YURDUNUBIL_NAVIGATE==='function')return window.YURDUNUBIL_NAVIGATE(view);const b=$(`.nav-item[data-view="${view}"]`);if(b){b.click();return true}return false}
document.addEventListener('yb:navigate',e=>syncActive(e.detail?.view||'home'));
window.addEventListener('load',()=>syncActive(window.YURDUNUBIL_ROUTE||'home'));
window.YBUiRouter={navigate,openMap,sync:()=>syncActive(window.YURDUNUBIL_ROUTE||'home'),labels:LABELS};
})();
