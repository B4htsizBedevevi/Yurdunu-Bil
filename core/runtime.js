/* Yurdunu Bil 46 — first-paint runtime + fail-safe loader */
(()=>{
'use strict';
if(window.__YB46_RUNTIME__)return;
window.__YB46_RUNTIME__=true;
const VERSION='46.0.0';
const root=window.YB44=window.YB44||{};
root.version=VERSION;
root.modules=root.modules||{};
root.env={production:location.hostname!=='localhost'&&location.hostname!=='127.0.0.1',mobile:matchMedia('(max-width: 700px)').matches};
root.register=(name,api={})=>{root.modules[name]={...api,version:VERSION};return root.modules[name]};
root.ready=name=>Boolean(root.modules[name]);
root.require=name=>root.modules[name]||null;
root.diagnostics=()=>({version:VERSION,modules:Object.keys(root.modules),provinceCount:document.querySelectorAll('.yb41-province').length,views:document.querySelectorAll('.view').length});
root.onReady=fn=>{if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else queueMicrotask(fn)};
root.register('runtime',{boot:true});

/* Critical first-paint protection: never leave a mobile user looking at a blank navy screen. */
const style=document.createElement('style');
style.id='yb46-critical-boot-style';
style.textContent=`html.yb46-booting,#yb46-critical-loader{background:#06101d}html.yb46-booting #auth-screen.hidden{display:grid!important;visibility:visible!important;opacity:1!important}html.yb46-booting #app-shell.hidden{visibility:hidden!important}#yb46-critical-loader{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:24px;color:#fff;opacity:1;visibility:visible;pointer-events:auto;transition:opacity .28s ease,visibility .28s ease}#yb46-critical-loader.is-out{opacity:0;visibility:hidden;pointer-events:none}.yb46-critical-card{width:min(410px,92vw);text-align:center}.yb46-critical-logo{width:72px;height:72px;margin:0 auto 20px;border-radius:23px;border:1px solid rgba(112,231,216,.28);display:grid;place-items:center;background:rgba(255,255,255,.05);box-shadow:0 0 70px rgba(63,192,255,.15);animation:yb46CriticalPulse 1.7s ease-in-out infinite}.yb46-critical-logo span{font-size:32px;display:block;animation:yb46CriticalFloat 1.5s ease-in-out infinite}.yb46-critical-kicker{font:800 10px/1.2 Inter,system-ui,sans-serif;letter-spacing:.18em;color:#72e6d5}.yb46-critical-title{margin:9px 0 6px;font:900 24px/1.12 Inter,system-ui,sans-serif;letter-spacing:-.04em}.yb46-critical-text{margin:0;color:#9eb0c4;font:500 13px/1.6 Inter,system-ui,sans-serif}.yb46-critical-bar{height:5px;width:min(280px,80vw);margin:22px auto 0;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden;position:relative}.yb46-critical-bar:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,#73e7d6,#8ed8ff,transparent);transform:translateX(-100%);animation:yb46CriticalLoad 1.15s ease-in-out infinite}.yb46-critical-status{margin-top:10px;color:#6f8195;font:600 10px/1.2 Inter,system-ui,sans-serif;min-height:12px}@keyframes yb46CriticalPulse{0%,100%{transform:scale(1);box-shadow:0 0 55px rgba(34,211,194,.09)}50%{transform:scale(1.045);box-shadow:0 0 90px rgba(34,211,194,.22)}}@keyframes yb46CriticalFloat{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-4px) rotate(2deg)}}@keyframes yb46CriticalLoad{0%{transform:translateX(-100%)}55%{transform:translateX(15%)}100%{transform:translateX(110%)}}@media(prefers-reduced-motion:reduce){.yb46-critical-logo,.yb46-critical-logo span,.yb46-critical-bar:before{animation:none}.yb46-critical-bar:before{transform:none}}`;
(document.head||document.documentElement).appendChild(style);
document.documentElement.classList.add('yb46-booting');

const loader=document.createElement('div');
loader.id='yb46-critical-loader';
loader.setAttribute('role','status');
loader.setAttribute('aria-live','polite');
loader.innerHTML='<div class="yb46-critical-card"><div class="yb46-critical-logo"><span>⌖</span></div><div class="yb46-critical-kicker">YURDUNU BİL • KPSS COĞRAFYA</div><div class="yb46-critical-title">Çalışma alanın hazırlanıyor</div><p class="yb46-critical-text">Haritalar, sorular ve öğrenme araçları yükleniyor…</p><div class="yb46-critical-bar"></div><div class="yb46-critical-status">Çekirdek başlatılıyor…</div></div>';
(document.body||document.documentElement).appendChild(loader);

let done=false;
const finish=(reason='Hazır')=>{if(done)return;done=true;const status=loader.querySelector('.yb46-critical-status');if(status)status.textContent=reason;window.setTimeout(()=>{loader.classList.add('is-out');document.documentElement.classList.remove('yb46-booting');window.setTimeout(()=>loader.remove(),340)},180)};
const stateCheck=()=>{const auth=document.getElementById('auth-screen');const app=document.getElementById('app-shell');if(app&&!app.classList.contains('hidden')){finish('Hazır. Hoş geldin!');return true}if(auth&&!auth.classList.contains('hidden')){const status=loader.querySelector('.yb46-critical-status');if(status)status.textContent='Giriş alanı hazırlanıyor…'}return false};
const bootObserve=()=>{const status=loader.querySelector('.yb46-critical-status');let ticks=0;const iv=window.setInterval(()=>{ticks++;if(stateCheck()){window.clearInterval(iv);return}if(ticks===6&&status)status.textContent='Veriler kontrol ediliyor…';if(ticks===12&&status)status.textContent='Son kontroller…';if(ticks>=80){window.clearInterval(iv);const auth=document.getElementById('auth-screen');const app=document.getElementById('app-shell');if(auth){auth.classList.remove('hidden');auth.style.removeProperty('display');auth.style.removeProperty('visibility');auth.style.removeProperty('opacity')}if(app)app.classList.add('hidden');finish('Güvenli başlangıç tamamlandı.')}},100);window.addEventListener('yb45:ready',()=>finish('Hazır. Hoş geldin!'),{once:true});window.addEventListener('load',()=>window.setTimeout(stateCheck,250),{once:true});};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootObserve,{once:true});else bootObserve();
})();
