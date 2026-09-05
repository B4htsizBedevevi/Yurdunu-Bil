/* Yurdunu Bil — canonical games entrypoint. */
(()=>{'use strict';
if(window.__YB_CANONICAL_GAMES__)return;window.__YB_CANONICAL_GAMES__=true;
const root=window.YB44||window.YBRuntime||{};
root.register?.('games',{canonical:true});
window.YBGames=window.YBGames||{};
window.YBGames.open=()=>{ if(window.YB86Events?.open){window.YB86Events.open();return true} if(window.YB55Games?.open){window.YB55Games.open();return true} if(typeof window.navigate==='function'){window.navigate('events');return true} return false; };
})();
