(()=>{'use strict';
if(window.__YB56_STABILITY__)return;window.__YB56_STABILITY__=true;
const $=(s,r=document)=>r.querySelector(s);
const load=(tag,attrs)=>new Promise(resolve=>{if(document.querySelector(`${tag}[data-yb56-stability]`)){resolve(true);return}const e=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));e.dataset.yb56Stability='1';e.onload=()=>resolve(true);e.onerror=()=>resolve(false);(tag==='link'?document.head:document.body).appendChild(e)});
async function ensureArena(){if(window.YBArena?.open)return true;await load('link',{rel:'stylesheet',href:'/arena-v1.css?v=56.0.0'});await load('script',{src:'/arena-v1.js?v=56.0.0'});return !!window.YBArena?.open}
function navGuard(){document.addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(!b)return;const v=b.dataset.view;if(v==='map'){e.preventDefault();e.stopImmediatePropagation();window.navigate?.('dashboard');window.showToast?.('Harita bölümü şu anda bakımda.');return}if(!document.querySelector('#view-'+v)){e.preventDefault();e.stopImmediatePropagation();window.navigate?.('dashboard')}} ,true)}
function arenaGuard(){document.addEventListener('click',async e=>{const b=e.target.closest('[data-yb55-arena]');if(!b)return;if(window.YBArena?.open)return;e.preventDefault();e.stopImmediatePropagation();b.disabled=true;b.textContent='Arena hazırlanıyor…';const ok=await ensureArena();b.disabled=false;b.textContent="Arena'yı Aç →";if(ok)window.YBArena.open();else window.showToast?.('Arena şu anda yüklenemedi. Lütfen tekrar dene.','error')},true)}
function boot(){navGuard();arenaGuard();window.addEventListener('error',e=>{if(/arena|ybArena/i.test(String(e.message||'')))console.warn('[YB56] Arena recovered',e.message)});ensureArena()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
