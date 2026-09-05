/* Yurdunu Bil — library feature manifest */
(()=>{'use strict';
if(window.__YB_LIBRARY_MANIFEST__)return;window.__YB_LIBRARY_MANIFEST__=true;
const api=window.YB44?.register?.('library-manifest',{canonical:true})||{};
window.YBLibrary=window.YBLibrary||{};
window.YBLibrary.manifest={
  version:window.YURDUNUBIL_CONFIG?.APP_VERSION||'0.0.0',
  layers:['content','library','study','review','expansion','deepening','compact','interactions'],
  data:{topics:'TOPICS',questions:'QUESTION_BANK'},
  ready:true
};
api.manifest=window.YBLibrary.manifest;
})();
