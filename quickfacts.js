/* Yurdunu Bil — quickfacts.js v2
 * Bu dosya artık yalnızca harita pointer-events düzeltmesi yapar.
 * Dashboard hap bilgiler app.js içinde #fact-grid ile yönetildiğinden
 * burada tekrar inject yapılmıyor.
 */
(() => {
  'use strict';
  function fixMap(){
    document.querySelectorAll('.leaflet-container').forEach(map=>{
      map.style.touchAction='pan-x pan-y';
      map.style.pointerEvents='auto';
      map.querySelectorAll('.leaflet-pane,.leaflet-control-container').forEach(x=>x.style.pointerEvents='auto');
    });
    document.querySelectorAll('#view-map,#map,.map-container').forEach(x=>{
      x.style.pointerEvents='auto';
      x.style.touchAction='pan-x pan-y';
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fixMap);
  else fixMap();
})();
