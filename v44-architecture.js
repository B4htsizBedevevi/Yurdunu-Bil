/* Yurdunu Bil 44 — canonical application architecture bridge */
(()=>{
'use strict';
if(window.__YB44_ARCHITECTURE__) return;
window.__YB44_ARCHITECTURE__ = true;
const VERSION='44.0.0';
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const state=window.YB44=window.YB44||{};
state.version=VERSION;
state.modules=state.modules||{};
state.register=(name,api={})=>{state.modules[name]={...api,version:VERSION};return state.modules[name]};
state.ready=(name)=>Boolean(state.modules[name]);
state.diagnostics=()=>({version:VERSION,provinceCount:qa('.yb41-province').length,featureLayers:qa('.yb41-feature-layer').length,activeView:q('.view.active')?.id||null});
function dedupeNav(){
 const nav=q('.mobile-nav'); if(!nav)return;
 const seen=new Set();
 qa('button[data-view]',nav).forEach(b=>{const key=b.dataset.view;if(seen.has(key))b.remove();else seen.add(key)});
}
function cleanLegacyDuplicates(){
 qa('.yb34-duplicate').forEach((el,i)=>{if(i)el.remove()});
 qa('#view-dashboard .atlas-shell > .map-v31-panel,#view-dashboard .atlas-shell > .map-v31-tooltip').forEach(el=>el.remove());
 qa('#view-map #yb42-turkey-silhouette').forEach(el=>el.remove());
}
function markRuntime(){
 document.documentElement.dataset.ybArchitecture=VERSION;
 document.body.dataset.ybArchitecture=VERSION;
}
function run(){markRuntime();dedupeNav();cleanLegacyDuplicates();state.diagnostics();}
state.register('shell',{navigate:v=>window.navigate?.(v),version:VERSION});
state.register('atlas',{mapEngine:'v44-map-engine',data:'data/geo-features-v44.js'});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
let timer=0;
new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(run,180)}).observe(document.body,{childList:true,subtree:true});
})();
