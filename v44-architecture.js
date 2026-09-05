/* Yurdunu Bil 45.6 — canonical shell + retired map remover */
(()=>{
'use strict';
if(window.__YB45_ARCHITECTURE__)return;
window.__YB45_ARCHITECTURE__=true;
const VERSION='45.6.0';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const state=window.YB44=window.YB44||{};state.version=VERSION;state.modules=state.modules||{};
state.register=state.register||((name,api={})=>{state.modules[name]={...api,version:VERSION};return state.modules[name]});
state.ready=state.ready||((name)=>Boolean(state.modules[name]));
function removeMap(){qa('[data-view="map"],[data-study-map],[data-vlesson-map]').forEach(x=>x.remove());q('#view-map')?.remove();const d=q('#view-dashboard');if(d)qa('.atlas-card,.atlas-shell,.map-v31-panel,.map-v31-tooltip,#dash-atlas,#dash-svg',d).forEach(x=>x.closest('.atlas-card')?.remove()||x.remove());qa('button,a').forEach(el=>{const t=(el.textContent||'').trim();if(/^harita(\s|$)/i.test(t)&&el.closest('.sidebar,.mobile-nav,.topbar'))el.remove()});qa('.yb45-map-maintenance,.yb45-dashboard-map-notice,.yb45-map-disabled').forEach(x=>x.remove())}
function bindSearch(){const input=q('#global-search');if(!input||input.dataset.yb45Bound)return;input.dataset.yb45Bound='1';input.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const p=state.modules.province?.find?.(input.value);if(p){window.navigate?.('provinceStudy');requestAnimationFrame(()=>state.modules.province.open?.(p))}})}
function mark(){document.documentElement.dataset.ybArchitecture=VERSION;if(document.body){document.body.dataset.ybArchitecture=VERSION;document.body.classList.add('yb45-ready')}}
function run(){removeMap();bindSearch();mark()}
state.register('shell',{navigate:v=>window.navigate?.(v)});state.register('runtime',{boot:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
let timer=0;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(run,25)}).observe(document.body,{childList:true,subtree:true});
})();
