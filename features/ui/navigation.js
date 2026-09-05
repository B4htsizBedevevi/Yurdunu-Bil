/* Yurdunu Bil — canonical navigation facade. */
(()=>{'use strict';
if(window.__YB_CANONICAL_NAV__)return;window.__YB_CANONICAL_NAV__=true;
const root=window.YB44||window.YBRuntime||{};
root.register?.('navigation',{canonical:true});
window.YBNavigation=window.YBNavigation||{};
window.YBNavigation.go=view=>typeof window.navigate==='function'?window.navigate(view):false;
})();
