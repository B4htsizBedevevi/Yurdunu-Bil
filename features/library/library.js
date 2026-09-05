/* Yurdunu Bil — canonical library facade */
(()=>{'use strict';
if(window.__YB_LIBRARY_CANONICAL__)return;window.__YB_LIBRARY_CANONICAL__=true;
const root=window.YBLibrary=window.YBLibrary||{};
const register=window.YB44?.register;
const state={modules:['library','study','review','expansion','deepening','compact','interactions'],ready:true};
root.state=state;
root.render=()=>{window.YB74Library?.enhance?.();window.YB90Library?.render?.();window.YB87Library?.render?.();};
root.openTopic=id=>window.YB74Library?.openTopic?.(id)||window.YB90Library?.showDetail?.(id);
root.refresh=()=>root.render();
register?.('library',{canonical:true,api:root});
window.addEventListener('yb:ready',()=>root.render(),{once:true});
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='library')setTimeout(root.render,80)});
})();
