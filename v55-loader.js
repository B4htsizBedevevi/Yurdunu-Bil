/* Yurdunu Bil 55 — safe loader for expanded games */
(()=>{'use strict';
if(window.__YB55_LOADER__)return;window.__YB55_LOADER__=true;
const load=(tag,attrs)=>new Promise(resolve=>{if(document.querySelector(`${tag}[data-yb55-loaded]`)){resolve(true);return}const e=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));e.dataset.yb55Loaded='1';e.onload=()=>resolve(true);e.onerror=()=>resolve(false);(tag==='link'?document.head:document.body).appendChild(e)});
function boot(){Promise.all([load('link',{rel:'stylesheet',href:'/v55-games-plus.css?v=55.0.0'})]).then(()=>load('script',{src:'/v55-games-plus.js?v=55.0.0'}));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
