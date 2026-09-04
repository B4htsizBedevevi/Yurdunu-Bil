/* Yurdunu Bil 44 — canonical runtime core */
(()=>{
'use strict';
if(window.__YB44_RUNTIME__)return;
window.__YB44_RUNTIME__=true;
const VERSION='44.0.0';
const root=window.YB44=window.YB44||{};
root.version=VERSION;
root.modules=root.modules||{};
root.env={production:location.hostname!=='localhost'&&location.hostname!=='127.0.0.1',mobile:matchMedia('(max-width: 700px)').matches};
root.register=(name,api={})=>{root.modules[name]={...api,version:VERSION};return root.modules[name]};
root.ready=name=>Boolean(root.modules[name]);
root.require=(name)=>root.modules[name]||null;
root.diagnostics=()=>({version:VERSION,modules:Object.keys(root.modules),provinceCount:document.querySelectorAll('.yb41-province').length,views:document.querySelectorAll('.view').length});
root.onReady=(fn)=>{if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else queueMicrotask(fn)};
root.register('runtime',{boot:true});
})();
