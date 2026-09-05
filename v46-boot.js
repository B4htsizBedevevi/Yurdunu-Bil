/* Yurdunu Bil 46 — deterministic boot controller */
(()=>{
'use strict';
if(window.__YB46_BOOT__)return;
window.__YB46_BOOT__=true;
const V='46.0.1', root=()=>document.getElementById('yb46-first-boot'), auth=()=>document.getElementById('auth-screen'), app=()=>document.getElementById('app-shell');
const phases=['Çekirdek hazırlanıyor…','Konu kütüphanesi hazırlanıyor…','Soru bankası kontrol ediliyor…','İl verileri hazırlanıyor…','Son kontroller yapılıyor…'];
let phase=0, phaseTimer=0, hardTimer=0, observer=0, done=false;
function status(t){const e=document.querySelector('#yb46-first-boot [data-boot-status]');if(e)e.textContent=t}
function visible(e){return !!e&&!e.classList.contains('hidden')&&getComputedStyle(e).display!=='none'}
function reveal(){document.documentElement.classList.add('yb45-runtime-ready');document.body.classList.add('yb45-ready');document.body.classList.remove('yb45-booting')}
function finish(){if(done)return;done=true;clearInterval(phaseTimer);clearTimeout(hardTimer);clearInterval(observer);reveal();const o=root();if(o){status('Hazır. Hoş geldin!');requestAnimationFrame(()=>setTimeout(()=>o.classList.add('yb46-boot-hidden'),120));setTimeout(()=>o.remove(),650)}}
function recover(){if(done)return;clearInterval(phaseTimer);clearInterval(observer);const o=root();if(!o)return;const old=o.querySelector('.yb46-boot-card');if(old)old.innerHTML='<div class="yb46-boot-mark"><span>⌖</span></div><div class="yb46-boot-kicker">YURDUNU BİL • KURTARMA</div><h2 class="yb46-boot-title">Başlangıç gecikti</h2><p class="yb46-boot-text">Sayfa boş bırakılmadı. Güvenli başlatma ile tekrar deneyebilirsin.</p><div style="margin-top:20px"><button id="yb46-retry" class="btn primary">Güvenli yenile</button></div>';document.getElementById('yb46-retry')?.addEventListener('click',()=>{try{if('caches'in window)caches.keys().then(a=>Promise.all(a.map(k=>caches.delete(k)))).finally(()=>location.replace(location.pathname+'?v='+V+'&r='+Date.now()));else location.reload()}catch{location.reload()}});reveal()}
function boot(){
const o=root();if(!o){return}
status(phases[0]);phaseTimer=setInterval(()=>{phase=Math.min(phase+1,phases.length-1);status(phases[phase])},650);
observer=setInterval(()=>{if(visible(auth())||visible(app()))finish()},100);
window.addEventListener('error',()=>{if(visible(auth())||visible(app()))finish()});
window.addEventListener('unhandledrejection',()=>{if(visible(auth())||visible(app()))finish()});
window.addEventListener('pageshow',()=>{if(visible(auth())||visible(app()))finish()});
// Never leave a user staring at a blank page indefinitely.
 hardTimer=setTimeout(()=>{if(!visible(auth())&&!visible(app()))recover()},9000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.YB46Boot={finish,recover,version:V};
})();
