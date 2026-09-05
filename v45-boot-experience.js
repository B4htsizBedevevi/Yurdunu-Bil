/* Yurdunu Bil 45.3 — premium boot transition + graceful crash recovery */
(()=>{
'use strict';
if(window.__YB45_BOOT_EXPERIENCE__)return;
window.__YB45_BOOT_EXPERIENCE__=true;
const $=(s,r=document)=>r.querySelector(s);
let overlay,recovery,timer,loading=false,errors=[];
function ensure(){
 if(!overlay){overlay=document.createElement('div');overlay.className='yb45-boot-overlay';overlay.innerHTML='<div class="yb45-boot-card" role="status" aria-live="polite"><div class="yb45-boot-mark"><span>⌖</span></div><div class="yb45-boot-kicker">YURDUNU BİL • KPSS COĞRAFYA</div><h2 class="yb45-boot-title">Çalışma alanın hazırlanıyor</h2><p class="yb45-boot-text">Hesabın doğrulandı. Notların, testlerin ve ilerlemen yükleniyor.</p><div class="yb45-boot-progress"><i></i></div><div class="yb45-boot-status">Veriler hazırlanıyor…</div></div>';document.body.appendChild(overlay)}
 return overlay;
}
function show(text='Veriler hazırlanıyor…'){loading=true;document.body.classList.add('yb45-booting');const o=ensure();$('.yb45-boot-text',o).textContent=text;$('.yb45-boot-status',o).textContent='Güvenli şekilde hazırlanıyor…';o.classList.add('is-visible');clearTimeout(timer);timer=setTimeout(()=>{if($('#app-shell')&&!$('#app-shell').classList.contains('hidden'))hide()},6500)}
function hide(){loading=false;clearTimeout(timer);document.body.classList.remove('yb45-booting');overlay?.classList.remove('is-visible')}
function recoveryScreen(){if(recovery)return;recovery=document.createElement('div');recovery.className='yb45-boot-recovery';recovery.innerHTML='<section class="yb45-boot-recovery-card"><span class="eyebrow">YURDUNU BİL • KURTARMA</span><h2>Sayfa toparlanırken bir sorun oluştu.</h2><p>Uygulama tamamen kapanmadı. Sayfayı güvenli şekilde yenileyip son oturumunu yeniden yükleyebilirsin.</p><button class="btn primary" data-yb45-retry>Sayfayı güvenli yenile</button><button class="btn ghost" data-yb45-dismiss>Devam etmeyi dene</button></section>';document.body.appendChild(recovery);$('[data-yb45-retry]',recovery).onclick=()=>location.reload();$('[data-yb45-dismiss]',recovery).onclick=()=>{recovery.remove();recovery=null;errors=[]}}
function beginFromAuth(){show('Girişin tamamlandı. Çalışma alanın hazırlanıyor…')}
function watch(){
 const auth=$('#auth-screen'),app=$('#app-shell');
 if(!auth||!app)return;
 const obs=new MutationObserver(()=>{const appReady=!app.classList.contains('hidden');if(appReady&&loading){setTimeout(hide,850)}if(!appReady&&loading&&auth.classList.contains('hidden')){setTimeout(hide,300)}});
 obs.observe(auth,{attributes:true,attributeFilter:['class']});obs.observe(app,{attributes:true,attributeFilter:['class']});
 document.addEventListener('submit',e=>{if(e.target?.id==='login-form'||e.target?.id==='register-form')beginFromAuth()},true);
 document.addEventListener('click',e=>{const b=e.target?.closest?.('#guest-btn,#google-btn');if(b)beginFromAuth()},true);
}
function installErrorShield(){
 window.addEventListener('error',e=>{const msg=e?.error?.message||e?.message||'Bilinmeyen JavaScript hatası';errors.push(msg);console.error('[YB45]',e.error||e.message);if(errors.length>=3&&$('#app-shell')&&!$('#app-shell').classList.contains('hidden'))recoveryScreen()});
 window.addEventListener('unhandledrejection',e=>{const msg=e?.reason?.message||String(e?.reason||'Bilinmeyen promise hatası');errors.push(msg);console.error('[YB45]',e.reason);if(errors.length>=3&&$('#app-shell')&&!$('#app-shell').classList.contains('hidden'))recoveryScreen()});
}
function start(){watch();installErrorShield();if($('#app-shell')&&!$('#app-shell').classList.contains('hidden'))hide()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.YB45Boot={show,hide,recover:recoveryScreen};
})();
