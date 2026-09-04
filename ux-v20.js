/* Yurdunu Bil — UX v20
 * Final mobile conflict resolver: drawer layering, stable atlas, safe scrolling.
 */
(() => {
  'use strict';
  const STYLE_ID='yb-v20-style';
  const $=(s,r=document)=>r.querySelector(s);

  function css(){
    if($('#'+STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      @media(max-width:760px){
        html,body{width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:hidden!important;overflow-y:auto!important}
        .main-content{width:100%!important;max-width:100%!important;min-width:0!important;padding:8px 9px calc(132px + env(safe-area-inset-bottom))!important;overflow:visible!important}
        .view,.view-container{width:100%!important;max-width:100%!important;min-width:0!important;overflow:visible!important}

        /* Drawer wins over the bottom bar while open. */
        .sidebar{z-index:2147483005!important;width:min(86vw,340px)!important;max-width:min(86vw,340px)!important}
        .mobile-bottom-nav{z-index:2147482000!important;transition:opacity .18s ease,transform .18s ease!important}
        body.yb-drawer-open .mobile-bottom-nav{opacity:0!important;pointer-events:none!important;transform:translateY(120%)!important}
        body.yb-drawer-open .main-content{filter:brightness(.62)!important}
        body.yb-drawer-open .topbar{filter:brightness(.62)!important}
        body.yb-drawer-open{overflow:hidden!important}
        .yb-sidebar-backdrop{z-index:2147482900!important}
        .yb-mobile-menu{z-index:2147483010!important}

        /* Never allow the legacy v17 atlas to sit above the current atlas. */
        #yb-atlas-v17{display:none!important}
        #full-map .leaflet-tile-pane,#full-map .leaflet-overlay-pane,#full-map .leaflet-shadow-pane,#full-map .leaflet-marker-pane,#full-map .leaflet-tooltip-pane,#full-map .leaflet-control-container{display:none!important;visibility:hidden!important}

        /* Stable, responsive map sizing. */
        #view-map #full-map{width:100%!important;max-width:100%!important;height:clamp(360px,54dvh,500px)!important;min-height:360px!important;max-height:500px!important;border-radius:20px!important;overflow:hidden!important;margin:0!important}
        @media(max-width:390px){#view-map #full-map{height:365px!important;min-height:365px!important;max-height:365px!important}}

        /* Details below the atlas must never be hidden behind navigation. */
        #view-map .province-detail,#view-map .province-empty,#view-map .map-selection-card{width:100%!important;max-width:100%!important;min-width:0!important;height:auto!important;min-height:180px!important;margin:9px 0 0!important;padding:18px 14px 22px!important;border-radius:18px!important;overflow:hidden!important}
        #view-map .province-detail *{max-width:100%!important;overflow-wrap:anywhere!important}

        /* No fixed legacy heights on cards. */
        .panel,.hero-banner,.stat-card,.big-stat,.topic-card,.library-card,.settings-card,.quiz-card,.quiz-start,.province-detail,.kpss-box,.topic-progress-panel{height:auto!important;min-height:0!important;max-height:none!important;width:100%!important;min-width:0!important;max-width:100%!important}
        .topics-grid,.library-grid,.stats-grid{width:100%!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important}
        .topic-card,.library-card{overflow:hidden!important}
      }
    `;document.head.appendChild(s);
  }

  function syncDrawer(){
    const open=!!$('.sidebar.yb-mobile-open');
    document.body.classList.toggle('yb-drawer-open',open);
    const nav=$('.mobile-bottom-nav');
    if(nav)nav.setAttribute('aria-hidden',open?'true':'false');
  }

  function observe(){
    const sidebar=$('.sidebar');
    if(!sidebar)return;
    syncDrawer();
    new MutationObserver(syncDrawer).observe(sidebar,{attributes:true,attributeFilter:['class']});
    new MutationObserver(syncDrawer).observe(document.body,{childList:true,subtree:true});
    document.addEventListener('click',()=>setTimeout(syncDrawer,0),{passive:true});
    window.addEventListener('resize',syncDrawer,{passive:true});
  }

  function stabilizeAtlas(){
    const host=$('#full-map');
    if(!host)return;
    const clean=()=>{
      $('#yb-atlas-v17',host)?.remove();
      host.querySelectorAll('.leaflet-tile-pane,.leaflet-overlay-pane,.leaflet-shadow-pane,.leaflet-marker-pane,.leaflet-tooltip-pane').forEach(n=>n.style.display='none');
    };
    clean();
    new MutationObserver(clean).observe(host,{childList:true,subtree:true});
  }

  function boot(){
    css();
    observe();
    stabilizeAtlas();
    setTimeout(stabilizeAtlas,700);
    setTimeout(stabilizeAtlas,1800);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
