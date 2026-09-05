/* Yurdunu Bil — resilient navigation bridge */
(()=>{'use strict';
if(window.__YB98_NAV_BRIDGE__)return;
window.__YB98_NAV_BRIDGE__=true;
const LABELS={home:'Ana Sayfa',library:'Kütüphane',arena:'Arena',events:'Etkinlikler & Oyunlar',settings:'Ayarlar'};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const pending=new Map();
function syncActive(view){const route=LABELS[view]?view:'home';$$('.nav-item[data-view],.yb98-top-link,.mobile-bottom-link,[data-mobile-view]').forEach(x=>x.classList.toggle('active',(x.dataset.view||x.dataset.mobileView)===route));const title=$('#page-title');if(title)title.textContent=LABELS[route];window.YURDUNUBIL_ROUTE=route;}
function loadScript(src,key){if(window[key])return Promise.resolve(window[key]);if(pending.has(key))return pending.get(key);const p=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src+'?v=99.0.6';s.async=true;s.onload=()=>window[key]?resolve(window[key]):reject(new Error(key+' missing'));s.onerror=()=>reject(new Error(key+' load failed'));document.body.appendChild(s)}).finally(()=>pending.delete(key));pending.set(key,p);return p}
async function openMap(){if(window.YBMapGames?.open)return window.YBMapGames.open();if(window.__YB_MAP_LOADING__)return false;window.__YB_MAP_LOADING__=true;try{await loadScript('features/games/map-games.js','YBMapGames');return window.YBMapGames?.open?.()||false}catch(e){window.showToast?.('Harita modülü yüklenemedi. Tekrar deneyin.','error');return false}finally{window.__YB_MAP_LOADING__=false}}
async function openArena(){if(window.YBArena?.open){window.YBArena.open();setTimeout(()=>syncActive('arena'),300);return true}if(window.__YB_ARENA_LOADING__)return false;window.__YB_ARENA_LOADING__=true;try{await loadScript('features/arena/arena.js','YBArena');if(!window.YBArena?.open)throw new Error('Arena API missing');window.YBArena.open();setTimeout(()=>syncActive('arena'),300);return true}catch(e){window.showToast?.('Arena modülü yüklenemedi. Tekrar deneyin.','error');return false}finally{window.__YB_ARENA_LOADING__=false}}
function navigate(view){if(view==='map'){openMap();return true}if(view==='arena'){openArena();return true}if(!LABELS[view])return false;if(typeof window.YURDUNUBIL_NAVIGATE==='function')return window.YURDUNUBIL_NAVIGATE(view);window.showToast?.('Sayfa henüz hazır değil. Tekrar deneyin.','error');return false}
document.addEventListener('click',e=>{const b=e.target?.closest?.('[data-view="arena"],[data-mobile-view="arena"],[data-view="map"],[data-mobile-view="map"]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();navigate(b.dataset.view||b.dataset.mobileView)},true);
document.addEventListener('yb:navigate',e=>syncActive(e.detail?.view||'home'));
window.addEventListener('load',()=>syncActive(window.YURDUNUBIL_ROUTE||'home'));
window.YBUiRouter={navigate,openMap,openArena,sync:()=>syncActive(window.YURDUNUBIL_ROUTE||'home'),labels:LABELS};
})();