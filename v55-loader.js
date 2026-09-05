/* Yurdunu Bil 56 — safe feature loader */
(()=>{'use strict';
if(window.__YB56_LOADER__)return;window.__YB56_LOADER__=true;
const load=(tag,attrs)=>new Promise(resolve=>{if(document.querySelector(`${tag}[data-yb56-loaded]`)){resolve(true);return}const e=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));e.dataset.yb56Loaded='1';e.onload=()=>resolve(true);e.onerror=()=>resolve(false);(tag==='link'?document.head:document.body).appendChild(e)});
async function boot(){await Promise.all([load('link',{rel:'stylesheet',href:'/v55-games-plus.css?v=55.0.0'}),load('link',{rel:'stylesheet',href:'/v56-retention.css?v=56.0.0'}),load('link',{rel:'manifest',href:'/manifest.webmanifest'})]);await load('script',{src:'/v55-games-plus.js?v=55.0.0'});await load('script',{src:'/v56-retention.js?v=56.0.0'});await load('link',{rel:'stylesheet',href:'/v56-stability.css?v=56.0.0'});await load('script',{src:'/v56-stability.js?v=56.0.0'});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
