/* Yurdunu Bil 56.2 — stable update controller */
(()=>{'use strict';
const RAW='https://raw.githubusercontent.com/B4htsizBedevevi/Yurdunu-Bil/main/',CFG=window.YURDUNUBIL_CONFIG||{},META=document.querySelector('meta[name="yb-version"]'),CURRENT=String(CFG.APP_VERSION||META?.content||'56.2.0');
const $=(s,r=document)=>r.querySelector(s),parts=v=>String(v||'0').replace(/^v/i,'').split('.').map(x=>parseInt(x,10)||0),newer=(a,b)=>{const A=parts(a),B=parts(b);for(let i=0;i<3;i++)if(A[i]!==B[i])return A[i]>B[i];return false};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let checking=false;
async function check(){if(checking)return;checking=true;try{const r=await fetch(RAW+'yb-release.json?probe='+Date.now(),{cache:'no-store',headers:{'Cache-Control':'no-cache'}});if(!r.ok)return;const d=await r.json(),remote=String(d.version||CURRENT);if(!newer(remote,CURRENT))return;show(remote,d.message||'Yeni sürüm hazır.')}catch{}finally{checking=false}}
function show(remote,msg){if($('.yb56-update'))return;const n=document.createElement('aside');n.className='yb56-update';n.innerHTML=`<small>🚀 YENİ SÜRÜM HAZIR</small><b>Yurdunu Bil ${esc(remote)}</b><small>${esc(msg)}</small><div class="yb56-update-actions"><button class="btn primary" data-update-now>Şimdi yenile</button><button class="btn ghost" data-update-later>Daha sonra</button></div>`;document.body.appendChild(n);n.querySelector('[data-update-later]').onclick=()=>n.remove();n.querySelector('[data-update-now]').onclick=apply}
async function apply(){const b=$('[data-update-now]'),n=$('.yb56-update');if(!b)return;b.disabled=true;b.textContent='Güncelleniyor…';try{
 const regs=navigator.serviceWorker?.getRegistrations?await navigator.serviceWorker.getRegistrations():[];
 await Promise.all(regs.map(reg=>reg.update().catch(()=>null)));
 if(regs.length){await Promise.race([new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true})),new Promise(resolve=>setTimeout(resolve,2500))]);}
 // Remove only obsolete Yurdunu Bil caches. The active cache is owned by the new worker.
 if(window.caches){const keys=await caches.keys();await Promise.all(keys.filter(k=>/^yurdunu-bil-v/.test(k)&&k!=='yurdunu-bil-v56.2').map(k=>caches.delete(k)));}
}catch{}
n?.remove();
location.replace(location.pathname+location.search+'?v='+Date.now());
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(check,1800),{once:true});else setTimeout(check,1800);
})();
