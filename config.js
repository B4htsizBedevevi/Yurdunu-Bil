/**
 * Yurdunu Bil — yapılandırma
 * Frontend tarafında yalnızca Supabase Publishable key kullanılır.
 * Service Role key ASLA buraya eklenmez.
 */
window.YURDUNUBIL_CONFIG = {
  SUPABASE_URL: "https://rdgefzwvfqvzmpfoiprj.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_LjA0E5FY6t6ID0YMwjJpxA_vCRNCuY7",
  APP_VERSION: "11.0.0",
  APP_NAME: "Yurdunu Bil",
  EXAM_DATE: "2026-10-04T10:15:00+03:00"
};

/* ============================================================
   v11 — GERÇEK UTF-8 / MOJIBAKE KORUMASI
   Eski JS dosyalarındaki bozuk UTF-8 metinleri yalnızca DOM'da
   değil, HTML eklenirken de temizler. Ayrıca GitHub Actions
   kaynak dosyalarını kalıcı olarak onarır.
============================================================ */
(() => {
  "use strict";

  const direct = new Map([
    ["Ã¼", "ü"], ["Ãœ", "Ü"], ["Ã¶", "ö"], ["Ã–", "Ö"],
    ["Ã§", "ç"], ["Ã‡", "Ç"], ["Ä±", "ı"], ["Ä°", "İ"],
    ["ÄŸ", "ğ"], ["Äž", "Ğ"], ["ÅŸ", "ş"], ["Åž", "Ş"],
    ["Ã¢", "â"], ["Ã‚", "Â"], ["Ãª", "ê"], ["Ã®", "î"],
    ["Ã´", "ô"], ["Ã»", "û"], ["Ã‰", "É"], ["Ã©", "é"],
    ["Ã¨", "è"], ["Ã§", "ç"], ["Ã±", "ñ"],
    ["âœ“", "✓"], ["âœ”", "✔"], ["âœ•", "✕"], ["âœ¨", "✨"],
    ["â†’", "→"], ["â†�", "←"], ["â†‘", "↑"], ["â†“", "↓"],
    ["â€“", "–"], ["â€”", "—"], ["â€¦", "…"], ["â€¢", "•"],
    ["â˜…", "★"], ["â˜†", "☆"], ["âš¡", "⚡"], ["âš ", "⚠"],
    ["Â°", "°"], ["Â·", "·"], ["Â©", "©"], ["Â®", "®"], ["Â±", "±"]
  ]);

  function decodeFragment(fragment) {
    try {
      const bytes = Uint8Array.from([...fragment], ch => ch.charCodeAt(0));
      const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      return decoded.includes("�") ? fragment : decoded;
    } catch (_) {
      return fragment;
    }
  }

  function repair(value) {
    if (typeof value !== "string" || !value) return value;
    let text = value;

    for (const [bad, good] of direct) {
      text = text.split(bad).join(good);
    }

    // Bozuk UTF-8 parçaları, gerçek Türkçe karakterlere dokunmadan düzelt.
    for (let pass = 0; pass < 3; pass++) {
      let changed = false;
      text = text.replace(/[\u0000-\u00ff]*[ÃÂÄÅâ][\u0000-\u00ff]*/g, part => {
        if (!/[ÃÂÄÅâ]/.test(part)) return part;
        const decoded = decodeFragment(part);
        if (decoded !== part && !decoded.includes("�")) {
          changed = true;
          return decoded;
        }
        return part;
      });
      if (!changed) break;
    }

    return text;
  }

  function repairNode(node) {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const fixed = repair(node.nodeValue);
      if (fixed !== node.nodeValue) node.nodeValue = fixed;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;

    if (node.nodeType === Node.ELEMENT_NODE) {
      for (const attr of ["title", "aria-label", "placeholder", "alt", "value"]) {
        if (!node.hasAttribute(attr)) continue;
        const oldValue = node.getAttribute(attr);
        const fixedValue = repair(oldValue);
        if (fixedValue !== oldValue) node.setAttribute(attr, fixedValue);
      }
    }

    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let textNode;
    while ((textNode = walker.nextNode())) repairNode(textNode);
  }

  function repairHtml(html) {
    return repair(html);
  }

  // HTML üretiminde sorunlu string daha DOM'a girmeden temizlenir.
  try {
    const innerHTML = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
    if (innerHTML?.set) {
      Object.defineProperty(Element.prototype, "innerHTML", {
        configurable: true,
        enumerable: innerHTML.enumerable,
        get: innerHTML.get,
        set(value) { innerHTML.set.call(this, repairHtml(String(value))); }
      });
    }
  } catch (_) {}

  try {
    const originalInsertAdjacentHTML = Element.prototype.insertAdjacentHTML;
    Element.prototype.insertAdjacentHTML = function(position, html) {
      return originalInsertAdjacentHTML.call(this, position, repairHtml(String(html)));
    };
  } catch (_) {}

  function boot() {
    if (!document.body || window.__YB_UTF8_GUARD_V11__) return;
    window.__YB_UTF8_GUARD_V11__ = true;

    repairNode(document.body);

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") repairNode(mutation.target);
        if (mutation.type === "childList") mutation.addedNodes.forEach(repairNode);
      }
    });

    observer.observe(document.body, {subtree:true, childList:true, characterData:true});
    window.__YB_REPAIR_TEXT__ = repairNode;
  }

  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot, {once:true});
})();

/* ============================================================
   v11 — MOBILE UI SCALE / SAFE AREA / OVERLAP SYSTEM
============================================================ */
(() => {
  const style = document.createElement("style");
  style.id = "yurdunubil-v110-mobile";
  style.textContent = `
    /* ---------- global safety ---------- */
    *, *::before, *::after { box-sizing:border-box; min-width:0; }
    html { overflow-x:hidden; }
    body { overflow-x:hidden; }
    button, a, input, select, textarea { max-width:100%; }
    img, svg, video, canvas { max-width:100%; }
    [class*="card"], [class*="panel"], [class*="box"], [class*="banner"] { overflow-wrap:anywhere; }

    @media (max-width:760px) {
      /* ---------- page / scroll ---------- */
      html, body { width:100%; max-width:100%; overflow-x:hidden !important; }
      body { -webkit-text-size-adjust:100%; padding-bottom:0 !important; }
      .app-screen { min-height:100dvh !important; }
      .app-shell { min-height:100dvh !important; }
      .main-content {
        width:100% !important;
        max-width:100% !important;
        min-width:0 !important;
        margin:0 !important;
        padding:0 12px calc(104px + env(safe-area-inset-bottom)) !important;
      }
      .view-container { width:100% !important; max-width:100% !important; }
      .view { width:100% !important; max-width:100% !important; padding-bottom:12px !important; }

      /* ---------- top bar ---------- */
      .topbar {
        position:sticky !important;
        top:0 !important;
        z-index:90 !important;
        height:58px !important;
        min-height:58px !important;
        padding:7px 8px !important;
        gap:6px !important;
      }
      .breadcrumb { flex:1 1 auto !important; min-width:0 !important; }
      .breadcrumb strong, #page-title {
        display:block !important;
        max-width:48vw !important;
        overflow:hidden !important;
        text-overflow:ellipsis !important;
        white-space:nowrap !important;
        font-size:14px !important;
      }
      .breadcrumb small, .breadcrumb span { font-size:8px !important; }
      .topbar-right { flex:0 0 auto !important; gap:4px !important; }
      .topbar-right > * { flex:0 0 auto !important; }
      .mobile-menu-btn, .icon-btn, .profile-btn { width:36px !important; height:36px !important; min-width:36px !important; }
      .profile-btn .pname, .profile-btn .pchev { display:none !important; }

      /* ---------- every common card gets a compact mobile rhythm ---------- */
      .hero-banner, .panel, .stat-card, .big-stat, .topic-card, .library-card,
      .settings-card, .settings-profile-card, .quiz-card, .quiz-start,
      .map-control-panel, .province-detail, .kpss-box, .topic-progress-panel,
      .auth-card, .auth-v6-panel {
        min-height:0 !important;
        height:auto !important;
        max-height:none !important;
      }
      .panel, .hero-banner, .map-control-panel, .province-detail, .topic-progress-panel { padding:12px !important; border-radius:15px !important; }
      .panel-head { gap:7px !important; margin-bottom:8px !important; }
      .panel-head h3 { font-size:15px !important; line-height:1.2 !important; }
      .panel-head p { font-size:9px !important; line-height:1.4 !important; }

      /* ---------- headings ---------- */
      .view-head, .welcome-row { display:flex !important; align-items:flex-end !important; gap:8px !important; margin:12px 0 10px !important; }
      .view-head h2, .welcome-row h2 { font-size:22px !important; line-height:1.08 !important; letter-spacing:-.5px !important; margin:0 !important; }
      .view-head p, .welcome-row p { font-size:10px !important; line-height:1.45 !important; margin:3px 0 0 !important; }

      /* ---------- dashboard ---------- */
      .hero-banner { padding:14px !important; border-radius:16px !important; }
      .hero-banner h1 { font-size:24px !important; line-height:1.05 !important; margin:7px 0 6px !important; }
      .hero-banner p { font-size:10px !important; line-height:1.45 !important; margin:0 !important; }
      .hero-actions { display:grid !important; grid-template-columns:1fr 1fr !important; gap:6px !important; margin-top:9px !important; }
      .hero-actions > * { width:100% !important; min-height:38px !important; padding:8px 7px !important; font-size:9px !important; }
      .stats-grid { display:grid !important; grid-template-columns:repeat(2,minmax(0,1fr)) !important; gap:6px !important; margin:7px 0 !important; }
      .stat-card { min-height:92px !important; padding:8px !important; border-radius:13px !important; }
      .stat-card > strong { font-size:21px !important; margin-top:5px !important; }
      .stat-card span, .stat-foot { font-size:8px !important; line-height:1.3 !important; }
      .stat-foot { margin-top:4px !important; }

      /* ---------- progress / study route ---------- */
      .study-list { display:grid !important; gap:4px !important; }
      .study-item { min-height:0 !important; padding:7px 8px !important; gap:7px !important; border-radius:11px !important; }
      .study-title { font-size:10px !important; line-height:1.25 !important; }
      .study-meta { font-size:7px !important; line-height:1.2 !important; }
      .study-check { width:20px !important; height:20px !important; flex:0 0 20px !important; }
      .topic-progress-panel { padding:10px !important; }
      .topic-bars { gap:5px !important; }
      .topic-bar-row { padding:8px !important; border-radius:10px !important; }
      .topic-bar-label { font-size:9px !important; margin-bottom:4px !important; }
      .topic-bar-label strong { font-size:9px !important; }
      .topic-bar-label b { font-size:10px !important; }
      .topic-progress-icon { width:23px !important; height:23px !important; }
      .topic-bar-track { height:5px !important; }
      .topic-bar-row small { font-size:7px !important; margin-top:3px !important; }

      /* ---------- topics / library: two compact columns where possible ---------- */
      .topics-grid, .library-grid { display:grid !important; grid-template-columns:repeat(2,minmax(0,1fr)) !important; gap:7px !important; }
      .topic-card, .library-card { padding:10px !important; border-radius:13px !important; min-height:0 !important; height:auto !important; }
      .topic-icon { width:31px !important; height:31px !important; font-size:14px !important; margin-bottom:5px !important; }
      .topic-card h3, .library-card h3 { font-size:13px !important; line-height:1.12 !important; margin:6px 0 4px !important; }
      .topic-card p, .library-card p { min-height:0 !important; font-size:8px !important; line-height:1.35 !important; margin:3px 0 !important; }
      .topic-meta { font-size:7px !important; }
      .topic-progress { height:3px !important; margin-top:5px !important; }
      .library-icon { width:34px !important; height:34px !important; border-radius:10px !important; font-size:16px !important; }
      .library-level { font-size:6px !important; padding:3px 5px !important; }
      .library-card-number { top:47px !important; right:9px !important; font-size:7px !important; }
      .library-note-list { gap:3px !important; margin-top:6px !important; }
      .library-note { grid-template-columns:17px 1fr !important; gap:4px !important; padding:4px 5px !important; border-radius:7px !important; }
      .library-note span { width:17px !important; height:17px !important; font-size:7px !important; }
      .library-note p { font-size:7px !important; line-height:1.3 !important; }
      .library-card-foot { margin-top:6px !important; padding-top:5px !important; }
      .library-card-foot > div:first-child { font-size:6px !important; }
      .library-card-foot strong { font-size:8px !important; }
      .library-progress { height:3px !important; margin:4px 0 5px !important; }
      .library-open { min-height:32px !important; font-size:8px !important; padding:0 7px !important; }
      .topic-card:after, .library-card:after { right:7px !important; bottom:7px !important; font-size:6px !important; padding:3px 4px !important; }

      /* ---------- map ---------- */
      .map-control-panel { padding:10px !important; gap:6px !important; }
      .map-control-copy strong { font-size:12px !important; }
      .map-control-copy small { font-size:7px !important; line-height:1.35 !important; }
      .map-mode-bar { display:grid !important; grid-template-columns:repeat(2,minmax(0,1fr)) !important; gap:5px !important; }
      .map-mode-btn { min-width:0 !important; min-height:42px !important; padding:5px !important; border-radius:9px !important; }
      .map-mode-btn span { font-size:13px !important; }
      .map-mode-btn b { font-size:8px !important; }
      .map-mode-btn small { font-size:6px !important; }
      .full-map-wrap, .full-map-wrap #full-map, #full-map, #dashboard-map { min-height:360px !important; height:48vh !important; max-height:500px !important; }
      .map-search-floating { left:8px !important; right:8px !important; top:8px !important; width:auto !important; height:36px !important; }
      .map-search-floating input { font-size:9px !important; }
      .map-legend-panel { left:8px !important; right:8px !important; bottom:8px !important; width:auto !important; max-height:110px !important; padding:7px !important; }
      .map-legend-head { padding-bottom:4px !important; margin-bottom:4px !important; }
      .map-legend-item b { font-size:7px !important; }
      .map-legend-item small { font-size:6px !important; }
      .province-detail { padding:12px !important; }
      .province-name { font-size:22px !important; }
      .province-plate { font-size:8px !important; }
      .kpss-box { padding:10px !important; border-radius:11px !important; }
      .kpss-box p { font-size:9px !important; line-height:1.45 !important; }
      .fact-cell { padding:8px !important; border-radius:9px !important; }
      .fact-cell-label { font-size:6px !important; }
      .fact-cell p { font-size:8px !important; }
      .province-actions { display:grid !important; grid-template-columns:1fr 1fr !important; gap:5px !important; margin-top:8px !important; }
      .province-action-btn { min-height:36px !important; font-size:8px !important; padding:6px !important; }

      /* ---------- quiz ---------- */
      .quiz-start { display:grid !important; grid-template-columns:64px 1fr !important; align-items:center !important; gap:10px !important; padding:12px !important; border-radius:14px !important; }
      .quiz-start-visual { width:64px !important; height:64px !important; margin:0 !important; font-size:19px !important; }
      .quiz-start-copy h3 { font-size:18px !important; line-height:1.1 !important; margin:0 0 4px !important; }
      .quiz-start-copy p { font-size:8px !important; line-height:1.35 !important; margin:0 !important; }
      .quiz-start-actions { margin-top:7px !important; }
      .quiz-card { padding:10px !important; border-radius:13px !important; }
      .quiz-question { font-size:13px !important; line-height:1.35 !important; }
      .quiz-option { min-height:38px !important; padding:7px 8px !important; font-size:9px !important; }
      .quiz-action-row { display:grid !important; grid-template-columns:1fr 1fr !important; gap:5px !important; margin-top:8px !important; padding-top:8px !important; }
      .quiz-check-btn, .quiz-next-btn { width:100% !important; min-height:37px !important; font-size:8px !important; }

      /* ---------- learning modal ---------- */
      .modal-backdrop { padding:7px !important; align-items:flex-end !important; }
      .modal-box { width:100% !important; max-width:100% !important; max-height:88dvh !important; border-radius:17px 17px 0 0 !important; overflow:auto !important; }
      .topic-learning-modal { max-height:88dvh !important; }
      .topic-learning-head { padding:11px !important; }
      .topic-modal-title { font-size:16px !important; }
      .topic-learning-body { padding:10px !important; }
      .topic-learning-body p, .topic-learning-body li { font-size:9px !important; line-height:1.45 !important; }
      .topic-learning-actions { display:grid !important; grid-template-columns:1fr 1fr !important; gap:5px !important; padding:8px 10px !important; }
      .topic-learning-actions button { min-height:36px !important; font-size:8px !important; }

      /* ---------- buttons: never collide / never overflow ---------- */
      .primary-btn, .ghost-btn, .danger-btn, .text-btn, .link-btn,
      .library-open, .province-action-btn, .quiz-check-btn, .quiz-next-btn {
        max-width:100% !important;
        min-width:0 !important;
        white-space:normal !important;
        text-align:center !important;
      }
      .hero-actions, .province-actions, .quiz-action-row, .topic-learning-actions,
      .settings-actions, .form-actions, .action-row, .button-row, .actions {
        width:100% !important;
        min-width:0 !important;
      }
      .hero-actions > *, .province-actions > *, .quiz-action-row > *, .topic-learning-actions > *,
      .settings-actions > *, .form-actions > *, .action-row > *, .button-row > *, .actions > * {
        min-width:0 !important;
        max-width:100% !important;
      }

      /* ---------- fixed bottom navigation: content can never sit underneath it ---------- */
      .mobile-bottom-nav {
        position:fixed !important;
        left:8px !important;
        right:8px !important;
        bottom:max(7px, env(safe-area-inset-bottom)) !important;
        width:auto !important;
        height:62px !important;
        min-height:62px !important;
        padding:5px !important;
        margin:0 !important;
        z-index:9999 !important;
        display:flex !important;
        align-items:stretch !important;
        gap:3px !important;
      }
      .mobile-bottom-nav button {
        position:relative !important;
        flex:1 1 0 !important;
        width:auto !important;
        min-width:0 !important;
        min-height:0 !important;
        height:52px !important;
        padding:4px 2px !important;
        margin:0 !important;
        display:flex !important;
        flex-direction:column !important;
        align-items:center !important;
        justify-content:center !important;
        gap:2px !important;
        border-radius:10px !important;
      }
      .mobile-bottom-nav button span { display:block !important; font-size:7px !important; line-height:1 !important; white-space:nowrap !important; }
      .mobile-bottom-nav svg { width:17px !important; height:17px !important; flex:0 0 17px !important; }
      #toast-root { bottom:calc(78px + env(safe-area-inset-bottom)) !important; left:9px !important; right:9px !important; }
      #toast-root .toast { max-width:100% !important; font-size:9px !important; }

      /* ---------- settings / favorites / stats ---------- */
      .settings-grid, .favorites-grid, .stats-detail-grid, .profile-grid { grid-template-columns:repeat(2,minmax(0,1fr)) !important; gap:6px !important; }
      .settings-card, .settings-profile-card, .favorite-card, .stat-detail-card, .profile-card { padding:10px !important; border-radius:12px !important; }
      .settings-card h3, .favorite-card h3, .stat-detail-card h3 { font-size:11px !important; }
      .settings-card p, .favorite-card p, .stat-detail-card p { font-size:8px !important; line-height:1.35 !important; }

      /* ---------- leaflets / controls ---------- */
      .leaflet-control-zoom a { width:30px !important; height:30px !important; line-height:30px !important; }
      .leaflet-control-attribution { font-size:7px !important; }
    }

    @media (max-width:390px) {
      .main-content { padding-left:9px !important; padding-right:9px !important; padding-bottom:calc(104px + env(safe-area-inset-bottom)) !important; }
      .topics-grid, .library-grid { grid-template-columns:1fr !important; gap:6px !important; }
      .topic-card, .library-card { padding:9px !important; }
      .hero-actions, .province-actions, .quiz-action-row, .topic-learning-actions { grid-template-columns:1fr !important; }
      .quiz-start { grid-template-columns:56px 1fr !important; gap:8px !important; }
      .quiz-start-visual { width:56px !important; height:56px !important; }
      .mobile-bottom-nav { left:5px !important; right:5px !important; }
    }

    @media (max-width:340px) {
      .main-content { padding-left:7px !important; padding-right:7px !important; }
      .mobile-bottom-nav { left:3px !important; right:3px !important; }
      .mobile-bottom-nav button span { font-size:6px !important; }
    }
  `;
  document.head.appendChild(style);
})();
