/* Yurdunu Bil — navigation bridge
 * App navigation stays in app.js/system-audit; this module owns only routes
 * that are intentionally outside the normal view stack (Arena + map).
 */
(()=>{'use strict';
if(window.__YB98_NAV_BRIDGE__)return;
window.__YB98_NAV_BRIDGE__=true;
const LABELS={home:'Ana Sayfa',library:'Kütüphane',arena:'Arena',events:'Etkinlikler & Oyunlar',settings:'Ayarlar'};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function syncActive(view){
  const route=LABELS[view]?view:'home';
  $$('.nav-item[data-view],.yb98-top-link,.mobile-bottom-link,[data-mobile-view]').forEach(x=>x.classList.toggle('active',(x.dataset.view||x.dataset.mobileView)===route));
  const title=$('#page-title');if(title)title.textContent=LABELS[route];
  window.YURDUNUBIL_ROUTE=route;
}
function openMap(){
  if(window.YBMapGames?.open)return window.YBMapGames.open();
  if(window.__YB_MAP_LOADING__)return false;
  window.__YB_MAP_LOADING__=true;
  const s=document.createElement('script');
  s.src='features/games/map-games.js?v=99.0.5';
  s.onload=()=>{window.__YB_MAP_LOADING__=false;window.YBMapGames?.open?.()};
  s.onerror=()=>{window.__YB_MAP_LOADING__=false;window.showToast?.('Harita modülü yüklenemedi.','error')};
  document.body.appendChild(s);
  return false;
}
function navigate(view){
  if(view==='map')return openMap();
  if(view==='arena'){
    const open=window.YBArena?.open;
    if(!open){window.showToast?.('Arena henüz hazır değil.','error');return false}
    open();
    // Arena internally enters the events shell first; keep the user-facing route as Arena.
    setTimeout(()=>syncActive('arena'),300);
    return true;
  }
  if(typeof window.YURDUNUBIL_NAVIGATE==='function')return window.YURDUNUBIL_NAVIGATE(view);
  return false;
}
document.addEventListener('click',e=>{
  const b=e.target?.closest?.('[data-view="arena"],[data-mobile-view="arena"],[data-view="map"],[data-mobile-view="map"]');
  if(!b)return;
  e.preventDefault();
  e.stopImmediatePropagation();
  navigate(b.dataset.view||b.dataset.mobileView);
},true);
document.addEventListener('yb:navigate',e=>syncActive(e.detail?.view||'home'));
window.addEventListener('load',()=>syncActive(window.YURDUNUBIL_ROUTE||'home'));
window.YBUiRouter={navigate,openMap,sync:()=>syncActive(window.YURDUNUBIL_ROUTE||'home'),labels:LABELS};
})();
