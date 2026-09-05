/* Yurdunu Bil — canonical runtime safety layer */
(()=>{'use strict';
if(window.__YB_CANONICAL_RUNTIME__)return;
window.__YB_CANONICAL_RUNTIME__=true;
const config=window.YURDUNUBIL_CONFIG||{};
const root=window.YB44=window.YB44||{};
root.version=config.APP_VERSION||root.version||'0.0.0';
root.modules=root.modules||{};
root.env={production:!['localhost','127.0.0.1'].includes(location.hostname),mobile:matchMedia('(max-width:700px)').matches};
root.register=root.register||((name,api={})=>(root.modules[name]={...api,version:root.version},root.modules[name]));
root.ready=root.ready||((name)=>Boolean(root.modules[name]));
root.require=root.require||((name)=>root.modules[name]||null);
root.diagnostics=root.diagnostics||(()=>({version:root.version,modules:Object.keys(root.modules),views:document.querySelectorAll('.view').length,route:window.YURDUNUBIL_ROUTE||'home'}));
root.onReady=root.onReady||((fn)=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):queueMicrotask(fn));
root.register('runtime',{boot:true,canonical:true});
const report=(message,detail)=>{
  console.error('[Yurdunu Bil]',message,detail||'');
  window.__YB_LAST_ERROR__={message:String(message||'Bilinmeyen hata'),detail:String(detail||''),at:Date.now()};
  const toast=document.getElementById('toast-root');
  if(toast&&!document.hidden){
    const e=document.createElement('div');e.className='toast error';e.textContent='Bir işlem tamamlanamadı. Tekrar deneyin.';toast.appendChild(e);
    requestAnimationFrame(()=>e.classList.add('show'));setTimeout(()=>{e.classList.remove('show');setTimeout(()=>e.remove(),220)},2600);
  }
};
window.addEventListener('error',e=>{
  const src=String(e.filename||'');
  if(src.includes('/supabase.min.js'))return;
  report(e.message||'JavaScript hatası',src?`${src}:${e.lineno||0}`:'');
});
window.addEventListener('unhandledrejection',e=>report('Beklenmeyen işlem hatası',e.reason?.message||e.reason||''));
document.documentElement.classList.add('yb-runtime-ready');
window.YBRuntime=root;
})();
