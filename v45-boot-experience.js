/* Yurdunu Bil 45.5 — premium boot pipeline + auth transition + crash recovery */
(()=>{
'use strict';
if(window.__YB45_BOOT_EXPERIENCE__)return;
window.__YB45_BOOT_EXPERIENCE__=true;
const $=(s,r=document)=>r.querySelector(s);
let overlay,recovery,timer,softTimer,phaseTimer,loading=false,errors=[],submitting=false;
const MAX_ERRORS=4;
const phases=['Çekirdek hazırlanıyor…','Konu kütüphanesi yükleniyor…','Soru bankası hazırlanıyor…','İl verileri ve çalışma alanı kontrol ediliyor…','Son kontroller yapılıyor…'];
let phase=0;
function ensure(){
 if(overlay)return overlay;
 overlay=document.createElement('div');
 overlay.className='yb45-boot-overlay';
 overlay.innerHTML='<div class="yb45-boot-card" role="status" aria-live="polite"><div class="yb45-boot-mark"><span>⌖</span></div><div class="yb45-boot-kicker">YURDUNU BİL • KPSS COĞRAFYA</div><h2 class="yb45-boot-title">Çalışma alanın hazırlanıyor</h2><p class="yb45-boot-text">Hesabın doğrulandı. Notların, testlerin ve ilerlemen hazırlanıyor.</p><div class="yb45-boot-progress"><i></i></div><div class="yb45-boot-status">Çekirdek hazırlanıyor…</div></div>';
 document.body.appendChild(overlay);
 return overlay;
}
function appReady(){const a=$('#app-shell');return !!a&&!a.classList.contains('hidden')}
function authVisible(){const a=$('#auth-screen');return !!a&&!a.classList.contains('hidden')}
function setButtons(disabled){['#login-form button[type="submit"]','#register-form button[type="submit"]','#guest-btn','#google-btn'].forEach(s=>{const b=$(s);if(b)b.disabled=disabled})}
function runPhases(){clearInterval(phaseTimer);phase=0;const o=ensure();const text=$('.yb45-boot-status',o);if(text)text.textContent=phases[0];phaseTimer=setInterval(()=>{phase=Math.min(phase+1,phases.length-1);if(text)text.textContent=phases[phase]},900)}
function show(text='Veriler hazırlanıyor…'){
 loading=true;document.body.classList.add('yb45-booting');document.body.classList.remove('yb45-ready');const o=ensure();$('.yb45-boot-text',o).textContent=text;$('.yb45-boot-status',o).textContent=phases[0];o.classList.add('is-visible');runPhases();clearTimeout(timer);clearTimeout(softTimer);
 timer=setTimeout(()=>{if(appReady())ready();else recoveryScreen('Uygulama beklenenden uzun sürede açıldı. Bağlantıyı kontrol edip güvenli şekilde yeniden deneyebilirsin.')},12000);
 softTimer=setTimeout(()=>{if(authVisible()&&submitting){submitting=false;setButtons(false);hide()}},10000);
}
function ready(){clearInterval(phaseTimer);loading=false;submitting=false;clearTimeout(timer);clearTimeout(softTimer);document.body.classList.add('yb45-ready');document.body.classList.remove('yb45-booting');const o=overlay;if(o){const status=$('.yb45-boot-status',o);if(status)status.textContent='Hazır. Hoş geldin!';setTimeout(()=>o.classList.remove('is-visible'),220)}setButtons(false)}
function hide(){clearInterval(phaseTimer);loading=false;submitting=false;clearTimeout(timer);clearTimeout(softTimer);document.body.classList.add('yb45-ready');document.body.classList.remove('yb45-booting');overlay?.classList.remove('is-visible');setButtons(false)}
function recoveryScreen(message){
 if(recovery)return;
 hide();
 recovery=document.createElement('div');recovery.className='yb45-boot-recovery';
 recovery.innerHTML='<section class="yb45-boot-recovery-card"><span class="eyebrow">YURDUNU BİL • KURTARMA</span><h2>Sayfa toparlanırken bir sorun oluştu.</h2><p class="yb45-recovery-message"></p><div class="yb45-recovery-actions"><button class="btn primary" data-yb45-retry>Güvenli yenile</button><button class="btn ghost" data-yb45-dismiss>Devam etmeyi dene</button></div></section>';
 $('.yb45-recovery-message',recovery).textContent=message||'Uygulama tamamen kapanmadı. Son oturumunu koruyarak sayfayı yeniden yükleyebilirsin.';
 document.body.appendChild(recovery);
 $('[data-yb45-retry]',recovery).onclick=()=>{try{if('caches'in window)caches.keys().then(xs=>Promise.all(xs.map(x=>caches.delete(x)))).finally(()=>location.reload());else location.reload()}catch{location.reload()}};
 $('[data-yb45-dismiss]',recovery).onclick=()=>{recovery.remove();recovery=null;errors=[];document.body.classList.add('yb45-ready')};
}
function beginFromAuth(kind='Giriş'){
 submitting=true;setButtons(true);show(kind==='Kayıt'?'Hesabın oluşturuluyor. Çalışma alanın hazırlanıyor…':'Girişin tamamlanıyor. Çalışma alanın hazırlanıyor…');
}
function watch(){
 const auth=$('#auth-screen'),app=$('#app-shell');
 if(!auth||!app)return;
 const obs=new MutationObserver(()=>{
   const readyNow=!app.classList.contains('hidden');
   const authNow=!auth.classList.contains('hidden');
   if(readyNow&&loading&&document.body.classList.contains('yb45-booting'))setTimeout(ready,650);
   if(authNow&&!submitting&&loading)setTimeout(hide,250);
   const err=$('#login-error,#register-error');
   if(authNow&&submitting&&err&&err.textContent.trim()){submitting=false;setButtons(false);setTimeout(hide,150)}
 });
 obs.observe(auth,{attributes:true,attributeFilter:['class'],subtree:true,childList:true});
 obs.observe(app,{attributes:true,attributeFilter:['class']});
 document.addEventListener('submit',e=>{if(e.target?.id==='login-form')beginFromAuth('Giriş');else if(e.target?.id==='register-form')beginFromAuth('Kayıt')},true);
 document.addEventListener('click',e=>{const b=e.target?.closest?.('#guest-btn,#google-btn');if(b){if(b.id==='google-btn')beginFromAuth('Giriş');else beginFromAuth('Misafir')}},true);
}
function installErrorShield(){
 const push=(msg,detail)=>{errors.push(msg);console.error('[YB45]',detail||msg);if(errors.length>=MAX_ERRORS&&appReady())recoveryScreen('Uygulama içinde art arda hatalar algılandı. Son verilerini korumak için güvenli yenileme öneriyoruz.')};
 window.addEventListener('error',e=>{const msg=e?.error?.message||e?.message||'Bilinmeyen JavaScript hatası';push(msg,e.error||e.message)});
 window.addEventListener('unhandledrejection',e=>{const msg=e?.reason?.message||String(e?.reason||'Bilinmeyen promise hatası');push(msg,e.reason)});
 window.addEventListener('pageshow',()=>{errors=[]});
}
function start(){
 watch();installErrorShield();
 if(appReady()&&!document.body.classList.contains('yb45-ready'))show('Yurdunu Bil yeniden başlatılıyor…');
 else if(!appReady()&&!authVisible())show('Yurdunu Bil başlatılıyor…');
 else if(authVisible())document.body.classList.add('yb45-ready');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.YB45Boot={show,hide,ready,recover:recoveryScreen};
})();
