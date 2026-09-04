/* Yurdunu Bil — UX v20.0.3
 * Single responsive layout kernel. No stacked mobile patch system.
 * This file owns mobile layout, drawer state, legacy artifact cleanup and text repair.
 */
(() => {
  'use strict';

  const STYLE_ID = 'yb-v20-style';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const REPAIRS = {
    'ğŸ—ºï¸':'🗺️','ğŸ—º':'🗺️','ğŸ“š':'📚','ğŸ”¥':'🔥','ğŸ’¡':'💡','ğŸ§ ':'🧠','ğŸŽ¯':'🎯','ğŸ“Š':'📊','ğŸ“':'📍','ğŸ“':'📝','ğŸŒ':'🌍','ğŸ”„':'🔄','ğŸŒ¾':'🌾','ğŸ”ï¸':'🏔️','ğŸŒŠ':'🌊','ğŸš¢':'🚢','ğŸ­':'🏭','ğŸ”¨':'🔨','ğŸŒ§ï¸':'🌧️','âœ“':'✓','âœ”ï¸':'✔️','âœ•':'✕','âœï¸':'✏️','â†’':'→','â†':'←','âš¡':'⚡','âš ï¸':'⚠️','âœ¨':'✨'
  };

  function repairText() {
    if (!document.body) return;
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(n => {
      let v = n.nodeValue || '';
      for (const [bad, good] of Object.entries(REPAIRS)) v = v.split(bad).join(good);
      if (v !== n.nodeValue) n.nodeValue = v;
    });
  }

  function css() {
    if ($('#' + STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      *,*::before,*::after{box-sizing:border-box;min-width:0}
      html,body{width:100%;max-width:100%;overflow-x:hidden!important}
      img,svg,canvas,video{max-width:100%}
      button,input,select,textarea{max-width:100%;font:inherit}
      #yb-atlas-v17{display:none!important}
      #full-map .leaflet-tile-pane,#full-map .leaflet-overlay-pane,#full-map .leaflet-shadow-pane,#full-map .leaflet-marker-pane,#full-map .leaflet-tooltip-pane,#full-map .leaflet-control-container,
      #dashboard-map .leaflet-tile-pane,#dashboard-map .leaflet-overlay-pane,#dashboard-map .leaflet-shadow-pane,#dashboard-map .leaflet-marker-pane,#dashboard-map .leaflet-tooltip-pane,#dashboard-map .leaflet-control-container{display:none!important;visibility:hidden!important}
      .yb-legacy-nav-hidden{display:none!important;visibility:hidden!important;pointer-events:none!important}

      @media(max-width:760px),(pointer:coarse) and (max-width:1100px){
        html,body{min-width:0!important;max-width:100%!important;overflow-x:hidden!important;overflow-y:auto!important}
        body{min-height:100dvh!important;padding:0!important}
        .app-screen,.app-shell,.main-content,.view,.view.active,.view-container{width:100%!important;max-width:100%!important;min-width:0!important}
        .app-shell{display:block!important;min-height:100dvh!important}
        .main-content{display:block!important;margin:0!important;padding:8px 9px calc(104px + env(safe-area-inset-bottom))!important;overflow:visible!important}
        .view,.view-container{padding:0!important;margin:0!important;overflow:visible!important}
        .topbar{position:sticky!important;top:0!important;z-index:900!important;width:100%!important;height:54px!important;min-height:54px!important;margin:0 0 8px!important;padding:6px!important;border-radius:14px!important;display:flex!important;align-items:center!important;gap:6px!important}
        .breadcrumb{min-width:0!important;flex:1 1 auto!important;overflow:hidden!important}
        .breadcrumb strong,#page-title{display:block!important;max-width:48vw!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:13px!important}
        .topbar-right{gap:3px!important;flex:0 0 auto!important}.topbar-right>*{flex:0 0 36px!important}
        .mobile-menu-btn{display:grid!important;place-items:center!important;position:relative!important;z-index:2147483700!important;width:38px!important;height:38px!important;min-width:38px!important;max-width:38px!important;padding:0!important;border:1px solid rgba(143,222,255,.2)!important;border-radius:12px!important;background:rgba(8,24,40,.88)!important}
        .icon-btn,.profile-btn{width:36px!important;height:36px!important;min-width:36px!important;max-width:36px!important}
        .mobile-bottom-nav{position:fixed!important;left:9px!important;right:9px!important;bottom:calc(7px + env(safe-area-inset-bottom))!important;width:auto!important;height:70px!important;min-height:70px!important;padding:5px!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:3px!important;z-index:2147482000!important;border-radius:20px!important;box-shadow:0 18px 55px rgba(0,0,0,.45)!important;transition:opacity .18s ease,transform .18s ease!important}
        .mobile-bottom-nav>*{width:100%!important;min-width:0!important;max-width:none!important;min-height:60px!important;border-radius:14px!important}
        .mobile-bottom-nav button,.mobile-bottom-nav a{touch-action:manipulation!important}
        .sidebar{position:fixed!important;inset:0 auto 0 0!important;width:min(84vw,330px)!important;max-width:min(84vw,330px)!important;transform:translate3d(-110%,0,0)!important;visibility:hidden!important;z-index:2147483600!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;transition:transform .24s ease,visibility 0s linear .24s!important}
        .sidebar.yb-mobile-open{transform:translate3d(0,0,0)!important;visibility:visible!important;transition:transform .24s ease,visibility 0s!important}
        .sidebar-body{overflow-y:auto!important;overflow-x:hidden!important;flex:1 1 auto!important;min-height:0!important}.sidebar-footer{flex:0 0 auto!important}
        .yb-sidebar-backdrop{position:fixed!important;inset:0!important;z-index:2147483500!important;background:rgba(2,9,17,.66)!important;backdrop-filter:blur(3px)!important;opacity:0!important;pointer-events:none!important;transition:opacity .18s ease!important}
        .yb-sidebar-backdrop.show{opacity:1!important;pointer-events:auto!important}
        .yb-mobile-menu{position:fixed!important;top:calc(10px + env(safe-area-inset-top))!important;left:10px!important;width:42px!important;height:42px!important;z-index:2147483700!important;touch-action:manipulation!important}
        body.yb-drawer-open .mobile-bottom-nav{opacity:0!important;pointer-events:none!important;transform:translateY(120%)!important}
        body.yb-drawer-open{overflow:hidden!important}
        body.yb-drawer-open .main-content,body.yb-drawer-open .topbar{filter:brightness(.62)!important}
        .panel,.hero-banner,.stat-card,.big-stat,.topic-card,.library-card,.settings-card,.settings-profile-card,.quiz-card,.quiz-start,.province-detail,.province-empty,.map-selection-card,.kpss-box,.topic-progress-panel,.map-control-panel,.map-preview-card{width:100%!important;min-width:0!important;max-width:100%!important;height:auto!important;min-height:0!important;max-height:none!important}
        .panel,.hero-banner,.topic-card,.library-card,.settings-card,.quiz-card,.quiz-start,.province-detail,.province-empty,.map-selection-card,.kpss-box,.topic-progress-panel{overflow:hidden!important}
        .topics-grid,.library-grid,.stats-grid{width:100%!important;max-width:100%!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important}
        .topic-card,.library-card{padding:10px!important;border-radius:14px!important}
        .topic-card h3,.library-card h3{line-height:1.18!important;overflow-wrap:anywhere!important}.topic-card p,.library-card p{min-height:0!important;overflow-wrap:anywhere!important}.topic-card>*,.library-card>*{max-width:100%!important}
        button,.nav-item,.map-mode-btn,.library-open,.primary-btn,.ghost-btn{min-height:40px!important;max-width:100%!important;touch-action:manipulation!important}.nav-item{width:100%!important}
        input,select,textarea{font-size:16px!important;max-width:100%!important}
        #view-map{width:100%!important;max-width:100%!important;min-width:0!important}
        #view-map .full-map-wrap{width:100%!important;max-width:100%!important;min-width:0!important;display:flex!important;flex-direction:column!important;gap:9px!important}
        #view-map #full-map{width:100%!important;max-width:100%!important;height:clamp(365px,55dvh,500px)!important;min-height:365px!important;max-height:500px!important;margin:0!important;border-radius:20px!important;overflow:hidden!important;position:relative!important;isolation:isolate!important;touch-action:none!important}
        #view-map #full-map .leaflet-container{width:100%!important;height:100%!important;background:transparent!important;touch-action:none!important}
        #view-map .map-search-floating,#view-map #province-select{display:none!important}
        #view-map .map-legend-panel{position:relative!important;inset:auto!important;width:100%!important;max-width:none!important;max-height:none!important;margin:0!important;order:3!important}
        #view-map .map-legend-items{max-height:130px!important;overflow:auto!important}
        #view-map #map-status{pointer-events:none!important}
        #view-map .province-empty,#view-map .map-selection-card{min-height:0!important;height:auto!important;margin:9px 0 0!important;padding:12px 14px!important;border-radius:15px!important}
        #view-map .province-empty:empty,#view-map .map-selection-card:empty{display:none!important}
        #view-map .province-detail *{max-width:100%!important;overflow-wrap:anywhere!important}
        .library-card .library-card-art,.library-card .library-card-image,.library-card .library-visual,.library-card .card-art,.library-card .visual,.library-card .decor,.library-card .illustration{display:none!important}
      }
      @media(max-width:390px){
        .main-content{padding-left:7px!important;padding-right:7px!important;padding-bottom:104px!important}
        .topics-grid,.library-grid,.stats-grid{gap:6px!important}
        #view-map #full-map{height:370px!important;min-height:370px!important;max-height:370px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function drawerOpen() {
    return !!$('.sidebar.yb-mobile-open');
  }

  function setDrawer(open) {
    const sidebar = $('.sidebar');
    const backdrop = $('.yb-sidebar-backdrop');
    const legacyButton = $('.yb-mobile-menu');
    if (!sidebar || !backdrop) return;
    sidebar.classList.toggle('yb-mobile-open', open);
    backdrop.classList.toggle('show', open);
    document.body.classList.toggle('yb-drawer-open', open);
    $('#mobile-menu-btn')?.setAttribute('aria-expanded', open ? 'true' : 'false');
    legacyButton?.setAttribute('aria-expanded', open ? 'true' : 'false');
    const nav = $('.mobile-bottom-nav');
    if (nav) nav.setAttribute('aria-hidden', open ? 'true' : 'false');
  }

  function ensureBackdrop() {
    let backdrop = $('.yb-sidebar-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'yb-sidebar-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);
    }
    return backdrop;
  }

  function installDrawerController() {
    const sidebar = $('.sidebar');
    const menu = $('#mobile-menu-btn');
    const legacyMenu = $('.yb-mobile-menu');
    if (!sidebar || (!menu && !legacyMenu)) return;
    const backdrop = ensureBackdrop();

    const toggle = () => setDrawer(!drawerOpen());
    if (menu && !menu.dataset.ybDrawerBound) {
      menu.dataset.ybDrawerBound = '1';
      menu.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggle(); }, {capture:true});
    }
    if (legacyMenu && !legacyMenu.dataset.ybDrawerBound) {
      legacyMenu.dataset.ybDrawerBound = '1';
      legacyMenu.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggle(); }, {capture:true});
    }
    if (!backdrop.dataset.ybDrawerBound) {
      backdrop.dataset.ybDrawerBound = '1';
      backdrop.addEventListener('click', () => setDrawer(false));
    }
    sidebar.addEventListener('click', e => {
      if (e.target.closest('.nav-item,[data-view]')) setTimeout(() => setDrawer(false), 0);
    }, {passive:true});
    if (!sidebar.dataset.ybDrawerObserved) {
      sidebar.dataset.ybDrawerObserved = '1';
      new MutationObserver(() => {
        const open = drawerOpen();
        document.body.classList.toggle('yb-drawer-open', open);
        backdrop.classList.toggle('show', open);
      }).observe(sidebar, {attributes:true, attributeFilter:['class']});
    }
    if (!drawerOpen()) setDrawer(false);
  }

  function cleanDuplicateMobileNav() {
    const primary = $('.mobile-bottom-nav');
    if (!primary) return;

    const expected = new Set(['dashboard','map','topics','library','quiz']);
    const isCandidate = el => {
      if (!el || el === primary || el.closest('.sidebar') || el.id === 'mobile-menu-btn' || el.classList?.contains('mobile-bottom-nav')) return false;
      const buttons = $$('[data-view]', el);
      const views = buttons.map(b => b.dataset.view).filter(Boolean);
      const unique = [...new Set(views)];
      if (unique.length < 5 || !unique.every(v => expected.has(v))) return false;
      if (!unique.includes('dashboard') || !unique.includes('map') || !unique.includes('topics') || !unique.includes('library') || !unique.includes('quiz')) return false;
      const text = (el.textContent || '').replace(/\s+/g,' ').trim();
      if (!/Panel/.test(text) || !/Harita/.test(text) || !/Konular/.test(text) || !/Kütüphane/.test(text) || !/Test/.test(text)) return false;
      return true;
    };

    $$('body *').forEach(el => {
      if (!isCandidate(el)) return;
      el.classList.add('yb-legacy-nav-hidden');
      el.setAttribute('aria-hidden','true');
    });
  }

  function cleanBackdrops() {
    const sidebar = $('.sidebar');
    const backdrop = $('.yb-sidebar-backdrop');
    const open = !!sidebar?.classList.contains('yb-mobile-open');
    document.body.classList.toggle('yb-drawer-open', open);
    if (backdrop) backdrop.classList.toggle('show', open);
    if (!open) sidebar?.style.removeProperty('filter');
  }

  function cleanLegacyMapLayers() {
    ['#full-map','#dashboard-map'].forEach(sel => {
      const host = $(sel);
      if (!host) return;
      host.querySelectorAll('#yb-atlas-v17').forEach(n => n.remove());
      host.querySelectorAll('.leaflet-tile-pane,.leaflet-overlay-pane,.leaflet-shadow-pane,.leaflet-marker-pane,.leaflet-tooltip-pane,.leaflet-control-container').forEach(n => {
        n.style.display = 'none';
        n.style.visibility = 'hidden';
      });
    });
  }

  function scheduleCleanup() {
    repairText();
    cleanDuplicateMobileNav();
    cleanBackdrops();
    cleanLegacyMapLayers();
  }

  function boot() {
    css();
    installDrawerController();
    scheduleCleanup();
    [250,700,1200,2000].forEach(ms => setTimeout(scheduleCleanup, ms));

    if (!window.__YB_V20_OBSERVER__) {
      window.__YB_V20_OBSERVER__ = new MutationObserver(() => {
        clearTimeout(window.__YB_V20_CLEAN_TIMER__);
        window.__YB_V20_CLEAN_TIMER__ = setTimeout(() => {
          installDrawerController();
          scheduleCleanup();
        }, 30);
      });
      window.__YB_V20_OBSERVER__.observe(document.body, {subtree:true, childList:true, attributes:true, attributeFilter:['class','style']});
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();
