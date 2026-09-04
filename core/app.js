/* Yurdunu Bil 44 — application runtime facade */
(()=>{'use strict';const r=window.YB44;if(!r)return;const api={version:'44.0.0',navigate:view=>typeof window.navigate==='function'?window.navigate(view):null,toast:msg=>typeof window.showToast==='function'?window.showToast(msg):null};r.register('app',api);})();
