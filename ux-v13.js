/* Yurdunu Bil — v13 Mobile UX + Map Hardening */
(() => {
  'use strict';
  const REPAIRS = {
    'ğŸ—ºï¸':'🗺️','ğŸ“š':'📚','ğŸ”¥':'🔥','ğŸ’¡':'💡','ğŸ§ ':'🧠','ğŸŽ¯':'🎯','ğŸ“Š':'📊','ğŸ”„':'🔄','ğŸŒ':'🌍','ğŸ“Œ':'📌','ğŸ':'🐐','ğŸŒ¾':'🌾','ğŸ”ï¸':'🏔️','ğŸŒŠ':'🌊','ğŸš¢':'🚢','ğŸ­':'🏭','ğŸ”¨':'🔨','ğŸŒ§ï¸':'🌧️','âœ“':'✓','âœ•':'✕','âœ”ï¸':'✔️','âœï¸':'✏️','âš ï¸':'⚠️'
  };
  function repairText(value){
    let s=String(value??'');
    Object.entries(REPAIRS).forEach(([a,b])=>{s=s.split(a).join(b)});
    return s;
  }
  function repairDOM(root=document.body){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];let n;
    while((n=walker.nextNode()))nodes.push(n);
    nodes.forEach(node=>{const next=repairText(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next});
  }
  function installStyle(){
    if(document.getElementById('yb-v13-style'))return;
    const style=document.createElement('style');style.id='yb-v13-style';
    style.textContent=`
      .leaflet-container{position:relative!important;z-index:1!important;touch-action:pan-x pan-y pinch-zoom!important;-webkit-tap-highlight-color:transparent}
      .leaflet-overlay-pane,.leaflet-marker-pane,.leaflet-shadow-pane{pointer-events:auto!important}
      .leaflet-overlay-pane svg,.leaflet-overlay-pane canvas{pointer-events:auto!important}
      .leaflet-interactive{pointer-events:auto!important;cursor:pointer}
      .leaflet-control-container{pointer-events:none}.leaflet-control{pointer-events:auto}
      .map-legend-panel{z-index:900!important}.map-search-floating{z-index:910!important}
      @media(max-width:760px){
        .view.active{padding-bottom:112px!important}
        #view-map .full-map-wrap{overflow:visible!important}
        #view-map #full-map{min-height:420px!important;height:min(62vh,560px)!important;max-height:560px!important}
        #view-map .leaflet-container{border-radius:22px!important;overflow:hidden}
        .mobile-bottom-nav{z-index:9999!important}.yb-qf{margin-bottom:18px!important}.v12-center{margin-bottom:18px!important}
      }
      @media(max-width:390px){#view-map #full-map{min-height:390px!important;height:56vh!important}.map-legend-panel{bottom:8px!important;max-height:96px!important;overflow:auto!important}}
    `;document.head.appendChild(style);
  }
  function hardenLeaflet(){
    if(typeof L==='undefined'||!L.Map||L.Map.__ybV13)return;
    L.Map.__ybV13=true;
    try{
      L.Map.addInitHook(function(){
        const map=this,el=map.getContainer?.(),isFull=el?.id==='full-map';
        try{
          map.options.tap=true;map.options.touchZoom=true;map.options.doubleClickZoom=true;
          if(isFull){map.options.dragging=true;map.options.scrollWheelZoom=true;map.options.preferCanvas=false;map.options.renderer=L.svg();}
          if(map.dragging&&isFull)map.dragging.enable();if(map.touchZoom)map.touchZoom.enable();if(map.doubleClickZoom)map.doubleClickZoom.enable();
        }catch(_){ }
        const refresh=()=>{try{map.invalidateSize({pan:false,animate:false})}catch(_){}};
        setTimeout(refresh,80);setTimeout(refresh,350);setTimeout(refresh,900);setTimeout(refresh,1800);
        window.addEventListener('resize',refresh,{passive:true});
        document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()},{passive:true});
      });
    }catch(error){console.warn('V13 Leaflet hook:',error)}
  }
  function watch(){
    repairDOM();
    const observer=new MutationObserver(mutations=>{for(const m of mutations){if(m.type==='childList'&&m.addedNodes.length)m.addedNodes.forEach(node=>{if(node.nodeType===1)repairDOM(node)});else if(m.type==='characterData'){const next=repairText(m.target.nodeValue);if(next!==m.target.nodeValue)m.target.nodeValue=next}}});
    observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  }
  function start(){installStyle();hardenLeaflet();watch();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
