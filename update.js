/* Yurdunu Bil — reliable client update checker */
(()=>{
'use strict';
const meta=document.querySelector('meta[name="yb-version"]');
const CURRENT=meta?.content||'0.0.0';
const RELEASE_URL='yb-release.json';
const $=(s,r=document)=>r.querySelector(s);
const cssClass='yb40-update';
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function parts(v){return String(v).replace(/^v/i,'').split('.').map(x=>parseInt(x,10)||0).slice(0,3).concat([0,0,0]).slice(0,3)}
function newer(a,b){const A=parts(a),B=parts(b);for(let i=0;i<3;i++){if(A[i]!==B[i])return A[i]>B[i]}return false}
function show(remote,message){if($('.'+cssClass))return;document.querySelectorAll('.yb32-update').forEach(x=>x.remove());const n=document.createElement('aside');n.className=cssClass;n.setAttribute('role','dialog');n.innerHTML=`<div class="yb40-update-kicker">🚀 YENİ SÜRÜM HAZIR</div><h3>Yurdunu Bil ${esc(remote)}</h3><p>${esc(message||'Yeni harita, içerik ve hata düzeltmeleri hazır.')}</p><div class="yb40-update-actions"><button type="button" data-yb40-install>Güncellemeyi yükle</button><button type="button" data-yb40-later>Daha sonra</button></div>`;document.body.appendChild(n);n.querySelector('[data-yb40-install]').onclick=()=>install(remote);n.querySelector('[data-yb40-later]').onclick=()=>{try{localStorage.setItem('yb_update_dismissed',remote)}catch{}n.remove()}}
async function flushCaches(){try{if('caches' in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}}catch{}try{if(navigator.serviceWorker){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}}catch{}}
async function install(remote){try{localStorage.setItem('yb_last_seen_version',remote);localStorage.removeItem('yb_update_dismissed')}catch{}const b=$('[data-yb40-install]');if(b){b.disabled=true;b.textContent='Temizleniyor…'}await flushCaches();const u=new URL(location.href);u.searchParams.set('yb_update',remote);u.searchParams.set('cachebust',Date.now().toString());location.replace(u.toString())}
async function check(manual=false){try{const r=await fetch(`${RELEASE_URL}?t=${Date.now()}`,{cache:'no-store',headers:{'Cache-Control':'no-cache','Pragma':'no-cache'}});if(!r.ok)throw new Error('HTTP '+r.status);const data=await r.json(),remote=String(data.version||CURRENT);if(newer(remote,CURRENT)){let dismissed='';try{dismissed=localStorage.getItem('yb_update_dismissed')||''}catch{}if(dismissed!==remote)show(remote,data.message);return{available:true,remote}}try{localStorage.setItem('yb_last_seen_version',CURRENT);localStorage.removeItem('yb_update_dismissed')}catch{}document.querySelector('.'+cssClass)?.remove();return{available:false,remote}}catch(err){if(manual)console.warn('Yurdunu Bil update check:',err);return{available:false,error:true}}}
function start(){check(false);setInterval(()=>check(false),15*60*1000);window.YBCheckUpdate=()=>check(true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
