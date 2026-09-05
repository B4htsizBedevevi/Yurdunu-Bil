/* Yurdunu Bil 57 — safe feature loader */
(()=>{'use strict';
if(window.__YB57_LOADER__)return;window.__YB57_LOADER__=true;
const V='56.3.0';
const load=(tag,attrs)=>new Promise(resolve=>{const key=tag==='script'?'src':'href',value=attrs[key];if(value&&document.querySelector(`${tag}[${key}="${value}"]`)){resolve(true);return}const e=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));e.dataset.yb57Loaded='1';e.onload=()=>resolve(true);e.onerror=()=>resolve(false);(tag==='link'?document.head:document.body).appendChild(e)});
async function registerSW(){try{if(!('serviceWorker' in navigator))return;const reg=await navigator.serviceWorker.register(`/sw.js?v=${V}`,{scope:'/',updateViaCache:'none'});await reg.update().catch(()=>null)}catch{}}
async function boot(){
 await registerSW();
 await Promise.all([
  load('link',{rel:'stylesheet',href:`/v55-games-plus.css?v=${V}`}),load('link',{rel:'stylesheet',href:`/v56-retention.css?v=${V}`}),load('link',{rel:'stylesheet',href:`/v56-profile-settings.css?v=${V}`}),load('link',{rel:'stylesheet',href:`/v53-arena-social.css?v=${V}`}),load('link',{rel:'stylesheet',href:`/v56-stability.css?v=${V}`}),load('link',{rel:'stylesheet',href:`/v56-events-ux.css?v=${V}`}),load('link',{rel:'stylesheet',href:`/v57-cleanup.css?v=${V}`}),load('link',{rel:'manifest',href:`/manifest.webmanifest?v=${V}`})
 ]);
 await load('script',{src:`/v55-games-plus.js?v=${V}`});await load('script',{src:`/v56-retention.js?v=${V}`});await load('script',{src:`/arena-v1.js?v=${V}`});await load('script',{src:`/v53-arena-social.js?v=${V}`});await load('script',{src:`/v56-profile-settings.js?v=${V}`});await load('script',{src:`/v56-interaction-hotfix.js?v=${V}`});await load('script',{src:`/v56-stability.js?v=${V}`});await load('script',{src:`/v56-events-ux.js?v=${V}`});await load('script',{src:`/v57-onboarding.js?v=${V}`});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
