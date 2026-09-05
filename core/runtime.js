/* Yurdunu Bil 56.3 — deterministic single boot runtime */
(()=>{
'use strict';
if(window.__YB56_RUNTIME__)return;
window.__YB56_RUNTIME__=true;
const VERSION='56.3.0',root=window.YB44=window.YB44||{};
root.version=VERSION;root.modules=root.modules||{};root.env={production:!['localhost','127.0.0.1'].includes(location.hostname),mobile:matchMedia('(max-width:700px)').matches};
root.register=(name,api={})=>{root.modules[name]={...api,version:VERSION};return root.modules[name]};
root.ready=name=>Boolean(root.modules[name]);root.require=name=>root.modules[name]||null;root.diagnostics=()=>({version:VERSION,modules:Object.keys(root.modules),views:document.querySelectorAll('.view').length});
root.onReady=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):queueMicrotask(fn);
root.register('runtime',{boot:true});
window.__YB45_BOOT_EXPERIENCE__=true;window.__YB46_SINGLE_BOOT__=true;
const style=document.createElement('style');style.id='yb56-critical-boot-style';style.textContent=`html.yb56-booting,body.yb56-booting{background:#06101d!important}#auth-screen.hidden{display:none}#yb56-critical-loader{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 50% 18%,rgba(67,190,255,.15),transparent 34%),radial-gradient(circle at 20% 82%,rgba(53,224,195,.08),transparent 30%),#06101d;color:#fff;opacity:1;visibility:visible;pointer-events:auto;transition:opacity .3s ease,visibility .3s ease}.yb56-critical-card{width:min(420px,92vw);text-align:center}.yb56-critical-logo{width:72px;height:72px;margin:0 auto 18px;border:1px solid rgba(112,231,216,.28);border-radius:22px;display:grid;place-items:center;background:rgba(255,255,255,.055);box-shadow:0 0 60px rgba(63,192,255,.15);animation:yb56p 1.5s ease-in-out infinite}.yb56-critical-logo span{font-size:32px}.yb56-critical-kicker{font:800 10px/1.2 Inter,system-ui,sans-serif;letter-spacing:.18em;color:#72e6d5}.yb56-critical-title{margin:9px 0 6px;font:900 24px/1.12 Inter,system-ui,sans-serif;letter-spacing:-.04em}.yb56-critical-text{margin:0;color:#9eb0c4;font:500 13px/1.6 Inter,system-ui,sans-serif}.yb56-critical-status{margin-top:10px;color:#6f8195;font:600 10px/1.2 Inter,system-ui,sans-serif;min-height:12px}@keyframes yb56p{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}`;(document.head||document.documentElement).appendChild(style);
document.documentElement.classList.add('yb56-booting');document.body?.classList.add('yb56-booting');
const loader=document.createElement('div');loader.id='yb56-critical-loader';loader.setAttribute('role','status');loader.innerHTML='<div class="yb56-critical-card"><div class="yb56-critical-logo"><span>⌖</span></div><div class="yb56-critical-kicker">YURDUNU BİL • KPSS COĞRAFYA</div><div class="yb56-critical-title">Güncel sürüm hazırlanıyor</div><p class="yb56-critical-text">Çalışma alanı ve oyunlar yükleniyor…</p><div class="yb56-critical-status">56.3.0 başlatılıyor…</div></div></div>';
(document.body||document.documentElement).appendChild(loader);
const started=Date.now(),MIN=700,MAX=5000;let done=false;
function cleanup(){document.querySelectorAll('#yb46-first-boot,.yb45-boot-overlay,#yb45-boot-overlay,.yb45-boot-card').forEach(e=>e.remove());document.documentElement.classList.remove('yb45-booting');document.body?.classList.remove('yb45-booting')}
function finish(msg='Hazır.'){
 if(done)return;const wait=Math.max(0,MIN-(Date.now()-started));if(wait){setTimeout(()=>finish(msg),wait);return}done=true;cleanup();const s=loader.querySelector('.yb56-critical-status');if(s)s.textContent=msg;document.documentElement.classList.add('yb56-ready');document.documentElement.classList.remove('yb56-booting');document.body?.classList.add('yb56-ready');document.body?.classList.remove('yb56-booting');setTimeout(()=>{loader.style.opacity='0';loader.style.visibility='hidden';loader.style.pointerEvents='none';setTimeout(()=>loader.remove(),320)},100)
}
function watch(){let n=0;const timer=setInterval(()=>{n++;cleanup();const a=document.getElementById('auth-screen'),app=document.getElementById('app-shell');if(app&&!app.classList.contains('hidden')){clearInterval(timer);finish('Çalışma alanı hazır.')}else if(a&&!a.classList.contains('hidden')){clearInterval(timer);finish('Giriş alanı hazır.')}else if(n>=50){clearInterval(timer);finish('Güvenli başlangıç tamamlandı.')}},100)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
window.YB56Runtime={version:VERSION};window.YB46Runtime=window.YB56Runtime;window.YB46Boot={finish};
})();
