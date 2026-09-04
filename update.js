/* Yurdunu Bil 45 — deployment-aware update monitor + study-first loader */
(()=>{
'use strict';
const meta=document.querySelector('meta[name="yb-version"]');
const CURRENT=meta?.content||'0.0.0';
const RAW='https://raw.githubusercontent.com/B4htsizBedevevi/Yurdunu-Bil/main/';
const $=(s,r=document)=>r.querySelector(s);
const css='yb41-update';
const parts=v=>String(v||'0').replace(/^v/i,'').split('.').map(x=>parseInt(x,10)||0).slice(0,3).concat([0,0,0]).slice(0,3);
const newer=(a,b)=>{const A=parts(a),B=parts(b);for(let i=0;i<3;i++){if(A[i]!==B[i])return A[i]>B[i]}return false};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function text(url){const r=await fetch(url+'?t='+Date.now(),{cache:'no-store',headers:{'Cache-Control':'no-cache','Pragma':'no-cache'}});if(!r.ok)throw Error('HTTP '+r.status);return r.text()}
async function remoteVersion(){const html=await text(RAW+'index.html');const m=html.match(/name=["']yb-version["'][^>]*content=["']([^"']+)["']/i);return m?.[1]||CURRENT}
async function release(){try{return JSON.parse(await text(RAW+'yb-release.json'))}catch{return{}}}
async function liveVersion(){try{const html=await text(location.origin+location.pathname);const m=html.match(/name=["']yb-version["'][^>]*content=["']([^"']+)["']/i);return m?.[1]||CURRENT}catch{return CURRENT}}
function remove(){document.querySelector('.'+css)?.remove()}
function show(remote,msg){if($('.'+css))return;const n=document.createElement('aside');n.className=css;n.innerHTML=`<div class="yb41-update-kicker">🚀 YENİ SÜRÜM DAĞITILIYOR</div><h3>Yurdunu Bil ${esc(remote)}</h3><p>${esc(msg||'Yeni içerik ve hata düzeltmeleri hazırlanıyor. Render dağıtımı tamamlanınca bu sayfa otomatik yenilenecek.')}</p><div class="yb41-update-status"><span class="yb41-update-dot"></span><b data-yb41-update-state>Dağıtım bekleniyor…</b></div><div class="yb41-update-actions"><button type="button" data-yb41-now>Şimdi kontrol et</button><button type="button" data-yb41-close>Daha sonra</button></div>`;document.body.appendChild(n);n.querySelector('[data-yb41-now]').onclick=()=>poll(remote,true);n.querySelector('[data-yb41-close]').onclick=()=>n.remove()}
async function flush(){try{if('caches'in window){for(const k of await caches.keys())await caches.delete(k)}}catch{}try{if(navigator.serviceWorker){for(const r of await navigator.serviceWorker.getRegistrations())await r.unregister()}}catch{}}
async function poll(remote,manual=false){const s=$('[data-yb41-update-state]');try{const live=await liveVersion();if(newer(live,CURRENT)||live===remote){if(s)s.textContent='Yeni sürüm yayında — yenileniyor…';await flush();const u=new URL(location.href);u.searchParams.set('v',remote);u.searchParams.set('refresh',Date.now());location.replace(u.toString());return true}if(s)s.textContent='Render dağıtımı bekleniyor…';return false}catch(e){if(manual&&s)s.textContent='Bağlantı tekrar kontrol edilecek.';return false}}
async function check(manual=false){try{const remote=await remoteVersion();if(!newer(remote,CURRENT)){remove();return}const r=await release();show(remote,r.message);await poll(remote,manual)}catch(e){if(manual)console.warn('Yurdunu Bil update:',e)}}
function start(){check(false);setInterval(()=>check(false),10*60*1000);window.YBCheckUpdate=()=>check(true)}
function loadStudyFirst(){
 const addCss=(src,key)=>{if(document.querySelector('link['+key+']'))return;const l=document.createElement('link');l.rel='stylesheet';l.href=src;l.setAttribute(key,'1');document.head.appendChild(l)};
 const addJs=(src,key)=>{if(document.querySelector('script['+key+']'))return;const s=document.createElement('script');s.src=src;s.setAttribute(key,'1');document.body.appendChild(s)};
 addCss('v45-study.css?v=45.0.0','data-yb45-css');
 addCss('v45-activity-pack.css?v=45.0.0','data-yb45-activity-css');
 addJs('v45-study-fixed.js?v=45.0.0','data-yb45-js');
 addJs('v45-study-ui-hotfix.js?v=45.0.0','data-yb45-ui-hotfix');
 addJs('v45-activity-pack.js?v=45.0.0','data-yb45-activity-js');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{start();loadStudyFirst()},{once:true});else{start();loadStudyFirst()}
})();
