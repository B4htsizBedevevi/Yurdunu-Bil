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
/* 56.3: keep the legacy CSS gate compatible while eliminating the blank-screen failure. */
document.documentElement.classList.add('yb45-runtime-ready');
document.documentElement.classList.add('yb56-ready');
window.YB56Runtime={version:VERSION};window.YB46Runtime=window.YB56Runtime;window.YB46Boot={finish:()=>{document.documentElement.classList.add('yb45-runtime-ready','yb56-ready')}};
})();
