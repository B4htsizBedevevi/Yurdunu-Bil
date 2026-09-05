/* Yurdunu Bil — canonical games entrypoint. */
(()=>{'use strict';
if(window.__YB_CANONICAL_GAMES__)return;window.__YB_CANONICAL_GAMES__=true;
const root=window.YB44||window.YBRuntime||{};
root.register?.('games',{canonical:true});
window.YBGames=window.YBGames||{};
window.YBGames.open=()=>{window.YB86Events?.render?.();return window.navigate?.('events')!==false};
window.YBGames.start=id=>{if(window.YB55Games?.start)return window.YB55Games.start(id);window.YBGames.open();return false};
window.YBGames.close=()=>window.YB55Games?.close?.();
})();
