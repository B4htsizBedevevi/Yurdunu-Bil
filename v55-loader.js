/* Yurdunu Bil 68 — minimal stable loader. No maps, no legacy version chain. */
(()=>{'use strict';if(window.__YB68_LOADER__)return;window.__YB68_LOADER__=true;const V='68.0.0';
const load=(tag,attrs)=>new Promise(resolve=>{const key=tag==='script'?'src':'href',value=attrs[key];if(value&&document.querySelector(`${tag}[${key}="${value}"]`)){resolve(true);return}const e=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));e.onload=()=>resolve(true);e.onerror=()=>resolve(false);(tag==='link'?document.head:document.body).appendChild(e)});
async function clearLegacySW(){try{if('serviceWorker'in navigator){const regs=await navigator.serviceWorker.getRegistrations();for(const r of regs)await r.unregister()}if('caches'in window){for(const k of await caches.keys())await caches.delete(k)}}catch(e){console.warn('cache cleanup',e)}}
async function boot(){await clearLegacySW();await load('link',{rel:'stylesheet',href:`/v55-games-plus.css?v=${V}`});await load('script',{src:`/v55-games-plus.js?v=${V}`});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
