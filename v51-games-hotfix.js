/* Yurdunu Bil 51 hotfix — browser back safety */
(()=>{
'use strict';
if(window.__YB51_HISTORY_HOTFIX__)return;
window.__YB51_HISTORY_HOTFIX__=true;
const wait=()=>{if(!window.YB51Games)return setTimeout(wait,40);const api=window.YB51Games;if(api.__historyWrapped)return;const original=api.start;api.start=function(id){if(!history.state?.yb51Game){history.pushState({yb51Game:true},'',location.href)}return original.call(this,id)};api.__historyWrapped=true};
wait();
})();
