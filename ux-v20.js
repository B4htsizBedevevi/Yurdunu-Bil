/* Yurdunu Bil — UX v21
 * Mobil drawer sistemi + legacy cleanup + emoji repair.
 * CSS artık style.css v21 bloğundan geliyor — burada CSS yok.
 */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ------- Emoji / mojibake onarım tablosu ------- */
  const REPAIRS = Object.freeze({});

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

  /* ------- Drawer state ------- */
  function drawerOpen() {
    return !!$('.sidebar.yb-mobile-open') || !!$('.sidebar.open');
  }

  function setDrawer(open) {
    const sidebar = $('.sidebar');
    const backdrop = $('.yb-sidebar-backdrop');
    if (!sidebar || !backdrop) return;
    sidebar.classList.toggle('yb-mobile-open', open);
    sidebar.classList.toggle('open', open);
    backdrop.classList.toggle('show', open);
    document.body.classList.toggle('yb-drawer-open', open);
    $('#mobile-menu-btn')?.setAttribute('aria-expanded', String(open));
    const nav = $('.mobile-bottom-nav');
    if (nav) {
      nav.setAttribute('aria-hidden', String(open));
      nav.style.opacity = open ? '0' : '';
      nav.style.pointerEvents = open ? 'none' : '';
      nav.style.transform = open ? 'translateY(120%)' : '';
    }
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }

  function ensureBackdrop() {
    let bd = $('.yb-sidebar-backdrop');
    if (!bd) {
      bd = document.createElement('div');
      bd.className = 'yb-sidebar-backdrop';
      bd.setAttribute('aria-hidden', 'true');
      Object.assign(bd.style, {
        position: 'fixed', inset: '0', zIndex: '2147483500',
        background: 'rgba(2,9,17,.68)', backdropFilter: 'blur(4px)',
        opacity: '0', pointerEvents: 'none',
        transition: 'opacity .18s ease'
      });
      document.body.appendChild(bd);
    }
    return bd;
  }

  function ensureBackdropStyles() {
    if (document.getElementById('yb-backdrop-css')) return;
    const s = document.createElement('style');
    s.id = 'yb-backdrop-css';
    s.textContent = `
      .yb-sidebar-backdrop { opacity:0; pointer-events:none; transition:opacity .18s ease; }
      .yb-sidebar-backdrop.show { opacity:1 !important; pointer-events:auto !important; }
    `;
    document.head.appendChild(s);
  }

  function installDrawerController() {
    const sidebar = $('.sidebar');
    const menu = $('#mobile-menu-btn');
    if (!sidebar) return;

    ensureBackdropStyles();
    const backdrop = ensureBackdrop();

    const toggle = () => setDrawer(!drawerOpen());

    if (menu && !menu.dataset.ybDrawerBound) {
      menu.dataset.ybDrawerBound = '1';
      menu.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggle(); }, { capture: true });
    }

    if (!backdrop.dataset.ybDrawerBound) {
      backdrop.dataset.ybDrawerBound = '1';
      backdrop.addEventListener('click', () => setDrawer(false));
    }

    // Sidebar link tıklaması drawer'ı kapat
    if (!sidebar.dataset.ybLinkBound) {
      sidebar.dataset.ybLinkBound = '1';
      sidebar.addEventListener('click', e => {
        if (e.target.closest('.nav-item,[data-view]')) setTimeout(() => setDrawer(false), 0);
      }, { passive: true });
    }

    // Escape tuşu
    if (!window.__YB_ESC_BOUND__) {
      window.__YB_ESC_BOUND__ = true;
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && drawerOpen()) setDrawer(false);
      });
    }
  }

  /* ------- Legacy cleanup ------- */
  function cleanDuplicateMobileNav() {
    const primary = $('.mobile-bottom-nav');
    if (!primary) return;
    $$('body *').forEach(el => {
      if (!el || el === primary) return;
      if (el.closest('.sidebar')) return;
      if (el.classList.contains('mobile-bottom-nav') && el !== primary) {
        el.style.setProperty('display', 'none', 'important');
      }
    });
  }

  function cleanLegacyMapLayers() {
    ['#full-map', '#dashboard-map'].forEach(sel => {
      const host = $(sel);
      if (!host) return;
      host.querySelectorAll('#yb-atlas-v17, .yb-legacy-map-layer').forEach(n => n.remove());
    });
  }

  function scheduleCleanup() {
    repairText();
    cleanDuplicateMobileNav();
    cleanLegacyMapLayers();
  }

  /* ------- Boot ------- */
  function boot() {
    installDrawerController();
    scheduleCleanup();
    [300, 800, 1500, 2500].forEach(ms => setTimeout(scheduleCleanup, ms));

    if (!window.__YB_V21_OBSERVER__) {
      window.__YB_V21_OBSERVER__ = new MutationObserver(() => {
        clearTimeout(window.__YB_V21_CLEAN_TIMER__);
        window.__YB_V21_CLEAN_TIMER__ = setTimeout(() => {
          installDrawerController();
          scheduleCleanup();
        }, 40);
      });
      window.__YB_V21_OBSERVER__.observe(document.body, {
        subtree: true, childList: true,
        attributes: true, attributeFilter: ['class', 'style']
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
