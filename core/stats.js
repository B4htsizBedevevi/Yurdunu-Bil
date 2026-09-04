/* Yurdunu Bil 44 — statistics module boundary */
(()=>{'use strict';const r=window.YB44;if(!r)return;const results=()=>{try{return JSON.parse(localStorage.getItem('yb_state_25')||'{}').results||[]}catch{return[]}};r.register('stats',{results,solved:()=>results().reduce((n,x)=>n+(Number(x.total)||0),0),correct:()=>results().reduce((n,x)=>n+(Number(x.correct)||0),0)});})();
