/* Yurdunu Bil — single-owner navigation bridge */
(()=>{'use strict';
if(window.__YB_NAV_SINGLE_OWNER__)return;
window.__YB_NAV_SINGLE_OWNER__=true;

const LABELS={home:'Ana Sayfa',library:'Kütüphane',arena:'Arena',events:'Etkinlikler & Oyunlar',settings:'Ayarlar'};
const ROUTES=new Set(Object.keys(LABELS));
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const pending=new Map();

/* app.js owns the actual view renderer; this bridge owns click routing + active state. */
const appNavigate=typeof window.navigate==='function'?window.navigate:null;

function routeFromView(){
  const active=$$('.view.active')[0];
  const id=active?.id?.replace(/^view-/,'');
  return ROUTES.has(id)?id:'home';
}

function syncActive(view=routeFromView()){
  const route=ROUTES.has(view)?view:'home';
  $$('[data-view],[data-mobile-view]').forEach(el=>{
    const value=el.dataset.view||el.dataset.mobileView;
    if(ROUTES.has(value))el.classList.toggle('active',value===route);
  });
  const title=$('#page-title');
  if(title)title.textContent=LABELS[route];
  window.YURDUNUBIL_ROUTE=route;
  document.documentElement.dataset.ybRoute=route;
}

function closeTransient(){
  $('#sidebar')?.classList.remove('open');
  $('#drawer-backdrop')?.classList.remove('open');
  $('#profile-menu')?.classList.add('hidden');
}

function loadScript(src,key){
  if(window[key])return Promise.resolve(window[key]);
  if(pending.has(key))return pending.get(key);
  const p=new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src=src+'?v=99.0.6';
    s.async=true;
    s.onload=()=>window[key]?resolve(window[key]):reject(new Error(key+' missing'));
    s.onerror=()=>reject(new Error(key+' load failed'));
    document.body.appendChild(s);
  }).finally(()=>pending.delete(key));
  pending.set(key,p);
  return p;
}

async function openMap(){
  if(window.YBMapGames?.open)return window.YBMapGames.open();
  if(window.__YB_MAP_LOADING__)return false;
  window.__YB_MAP_LOADING__=true;
  try{
    await loadScript('features/games/map-games.js','YBMapGames');
    return window.YBMapGames?.open?.()||false;
  }catch(e){
    window.showToast?.('Harita modülü yüklenemedi. Tekrar deneyin.','error');
    return false;
  }finally{window.__YB_MAP_LOADING__=false}
}

async function openArena(){
  /* Arena is rendered inside the Events host. Never mark Arena active while Home is still visible. */
  if(typeof appNavigate==='function')appNavigate('events');
  else if(typeof window.navigate==='function')window.navigate('events');

  await new Promise(r=>setTimeout(r,0));

  if(window.YBArena?.open){
    await window.YBArena.open();
    syncActive('arena');
    return true;
  }
  if(window.__YB_ARENA_LOADING__)return false;
  window.__YB_ARENA_LOADING__=true;
  try{
    await loadScript('features/arena/arena.js','YBArena');
    if(!window.YBArena?.open)throw new Error('Arena API missing');
    await window.YBArena.open();
    syncActive('arena');
    return true;
  }catch(e){
    syncActive('events');
    window.showToast?.('Arena modülü yüklenemedi. Tekrar deneyin.','error');
    return false;
  }finally{window.__YB_ARENA_LOADING__=false}
}

function navigate(view){
  const route=String(view||'').trim();
  if(route==='map'){openMap();return true}
  if(route==='arena'){openArena();return true}
  if(!ROUTES.has(route))return false;
  closeTransient();
  if(typeof appNavigate==='function'){
    appNavigate(route);
    syncActive(route);
    return true;
  }
  if(typeof window.navigate==='function')return window.navigate(route)!==false;
  window.showToast?.('Sayfa henüz hazır değil. Tekrar deneyin.','error');
  return false;
}

/* Capture every primary navigation click before legacy bubble listeners can also consume it. */
document.addEventListener('click',e=>{
  const b=e.target?.closest?.('[data-view],[data-mobile-view]');
  if(!b)return;
  const route=b.dataset.view||b.dataset.mobileView;
  if(!ROUTES.has(route)&&route!=='map')return;
  e.preventDefault();
  e.stopImmediatePropagation();
  navigate(route);
},true);

document.addEventListener('yb:navigate',e=>syncActive(e.detail?.view||routeFromView()));
window.addEventListener('load',()=>syncActive(routeFromView()));
window.addEventListener('yb:ready',()=>syncActive(routeFromView()));

window.YBUiRouter={navigate,openMap,openArena,sync:()=>syncActive(routeFromView()),labels:LABELS};
syncActive(routeFromView());
})();