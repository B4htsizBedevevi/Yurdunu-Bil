/* Yurdunu Bil 57 — deterministic single boot runtime */
(()=>{
'use strict';
if(window.__YB57_RUNTIME__)return;
window.__YB57_RUNTIME__=true;
const VERSION='57.0.0',root=window.YB44=window.YB44||{};
root.version=VERSION;root.modules=root.modules||{};root.env={production:!['localhost','127.0.0.1'].includes(location.hostname),mobile:matchMedia('(max-width:700px)').matches};
root.register=(name,api={})=>{root.modules[name]={...api,version:VERSION};return root.modules[name]};
root.ready=name=>Boolean(root.modules[name]);root.require=name=>root.modules[name]||null;root.diagnostics=()=>({version:VERSION,modules:Object.keys(root.modules),views:document.querySelectorAll('.view').length});
root.onReady=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):queueMicrotask(fn);
root.register('runtime',{boot:true});
document.documentElement.classList.add('yb57-ready');
window.YB57Runtime={version:VERSION};
})();
