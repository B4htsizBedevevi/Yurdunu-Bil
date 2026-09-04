/**
 * Yurdunu Bil — Yapılandırma
 * Frontend tarafında yalnızca Supabase Publishable key kullanılır.
 * Service Role key'i ASLA buraya ekleme.
 */
window.YURDUNUBIL_CONFIG = {
  SUPABASE_URL: "https://rdgefzwvfqvzmpfoiprj.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_LjA0E5FY6t6ID0YMwjJpxA_vCRNCuY7",
  APP_VERSION: "10.3.0",
  APP_NAME: "Yurdunu Bil",
  EXAM_DATE: "2026-10-04T10:15:00+03:00"
};

/* ============================================================
   v10.3 — GLOBAL UTF-8 / MOJIBAKE REPAIR
   Some legacy JavaScript strings were stored as UTF-8 bytes
   decoded as Latin-1/Windows-1252 (Ã¼, ÄŸ, ÅŸ, â†’ ...).
   Repair is applied to visible DOM text and common attributes,
   including content generated later by app.js.
============================================================ */
(() => {
  "use strict";

  const direct = new Map([
    ["Ã¼", "ü"], ["Ãœ", "Ü"],
    ["Ã¶", "ö"], ["Ã–", "Ö"],
    ["Ã§", "ç"], ["Ã‡", "Ç"],
    ["Ä±", "ı"], ["Ä°", "İ"],
    ["ÄŸ", "ğ"], ["Äž", "Ğ"],
    ["ÅŸ", "ş"], ["Åž", "Ş"],
    ["âœ“", "✓"], ["âœ”", "✔"], ["âœ•", "✕"],
    ["â†’", "→"], ["â†�", "←"], ["â†‘", "↑"], ["â†“", "↓"],
    ["â€“", "–"], ["â€”", "—"], ["â€¦", "…"], ["â€¢", "•"],
    ["â˜…", "★"], ["â˜†", "☆"], ["âš¡", "⚡"], ["âš ", "⚠"],
    ["âœ¨", "✨"], ["Â°", "°"], ["Â·", "·"], ["Â©", "©"], ["Â®", "®"]
  ]);

  function latin1Utf8Repair(text) {
    try {
      if (!/[ÃÂÄÅâ]/.test(text)) return text;
      const bytes = new Uint8Array([...text].map(ch => ch.charCodeAt(0)));
      if ([...bytes].some(byte => byte > 255)) return text;
      const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      return decoded.includes("�") ? text : decoded;
    } catch (_) {
      return text;
    }
  }

  function repair(value) {
    if (typeof value !== "string" || !value) return value;
    if (!/[ÃÂÄÅâ]/.test(value)) return value;

    let text = value;
    for (const [bad, good] of direct) text = text.split(bad).join(good);

    // Catch less common mojibake combinations that are not in the map.
    return latin1Utf8Repair(text);
  }

  function repairTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const fixed = repair(node.nodeValue);
    if (fixed !== node.nodeValue) node.nodeValue = fixed;
  }

  function repairElement(root) {
    if (!root) return;

    if (root.nodeType === Node.TEXT_NODE) {
      repairTextNode(root);
      return;
    }

    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;

    const attrs = ["aria-label", "title", "placeholder", "alt"];
    if (root.nodeType === Node.ELEMENT_NODE) {
      for (const attr of attrs) {
        if (root.hasAttribute(attr)) {
          const oldValue = root.getAttribute(attr);
          const fixedValue = repair(oldValue);
          if (fixedValue !== oldValue) root.setAttribute(attr, fixedValue);
        }
      }
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) repairTextNode(node);
  }

  function bootEncodingGuard() {
    if (!document.body || window.__YB_UTF8_GUARD__) return;
    window.__YB_UTF8_GUARD__ = true;

    repairElement(document.body);

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          repairTextNode(mutation.target);
        } else if (mutation.type === "childList") {
          mutation.addedNodes.forEach(repairElement);
        }
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true
    });

    window.__YB_REPAIR_TEXT__ = repairElement;
  }

  if (document.body) bootEncodingGuard();
  else document.addEventListener("DOMContentLoaded", bootEncodingGuard, { once: true });
})();

/* ============================================================
   v10.3 — MOBILE SCALE / OVERLAP / SCROLL FIXES
============================================================ */
(() => {
  const style = document.createElement("style");
  style.id = "yurdunubil-v103-mobile";
  style.textContent = `
    /* Universal overflow safety */
    *, *::before, *::after { min-width: 0; }
    img, svg, video, canvas { max-width: 100%; }
    .topic-card, .library-card, .panel, .stat-card, .big-stat,
    .settings-card, .settings-profile-card, .quiz-card, .quiz-start,
    .hero-banner, .map-control-panel, .province-detail {
      overflow-wrap: anywhere;
    }

    @media (max-width: 760px) {
      html, body { width:100%; max-width:100%; overflow-x:hidden; }
      body { padding-bottom:116px !important; -webkit-text-size-adjust:100%; }
      .main-content { width:100% !important; min-width:0 !important; margin-left:0 !important; padding:0 12px 132px !important; }
      .view-container { width:100% !important; max-width:100% !important; }

      /* Topbar: title and action buttons never collide. */
      .topbar { height:62px !important; min-height:62px !important; padding:8px 10px !important; gap:5px !important; }
      .breadcrumb { flex:1 1 auto !important; min-width:0 !important; }
      .breadcrumb strong, #page-title { display:block !important; max-width:42vw !important; overflow:hidden !important; text-overflow:ellipsis !important; white-space:nowrap !important; font-size:15px !important; }
      .topbar-right { flex:0 0 auto !important; gap:4px !important; }
      .mobile-menu-btn, .icon-btn, .profile-btn { width:37px !important; height:37px !important; min-width:37px !important; }
      .profile-btn .pname, .profile-btn .pchev { display:none !important; }

      /* Headers */
      .view-head, .welcome-row { gap:7px !important; margin-bottom:13px !important; }
      .view-head h2, .welcome-row h2 { font-size:24px !important; line-height:1.12 !important; }
      .view-head p, .welcome-row p { font-size:12px !important; line-height:1.5 !important; }

      /* Dashboard */
      .hero-banner { min-height:0 !important; padding:16px !important; border-radius:17px !important; }
      .hero-banner h1 { font-size:26px !important; line-height:1.05 !important; margin:9px 0 7px !important; }
      .hero-banner p { font-size:12px !important; line-height:1.5 !important; }
      .hero-actions { display:grid !important; grid-template-columns:1fr !important; gap:6px !important; margin-top:11px !important; }
      .hero-actions > * { width:100% !important; min-height:42px !important; }
      .stats-grid { grid-template-columns:1fr 1fr !important; gap:6px !important; margin:8px 0 10px !important; }
      .stat-card { min-height:108px !important; padding:9px !important; border-radius:15px !important; }
      .stat-card > strong { font-size:23px !important; margin-top:7px !important; }
      .stat-card span { font-size:9px !important; }
      .stat-foot { font-size:9px !important; margin-top:5px !important; }
      .panel { padding:11px !important; border-radius:16px !important; }
      .panel-head h3 { font-size:16px !important; }
      .panel-head p { font-size:10px !important; }

      /* Study route / progress */
      .study-list { gap:1px !important; }
      .study-item { padding:7px !important; gap:7px !important; }
      .study-title { font-size:11px !important; line-height:1.3 !important; }
      .study-meta { font-size:8px !important; }
      .study-check { width:21px !important; height:21px !important; flex-basis:21px !important; }
      .topic-progress-panel { padding:12px !important; }
      .topic-bars { gap:7px !important; }
      .topic-bar-row { padding:10px !important; border-radius:12px !important; }
      .topic-bar-label { font-size:11px !important; margin-bottom:5px !important; }
      .topic-bar-label strong { font-size:11px !important; }
      .topic-bar-label b { font-size:12px !important; }
      .topic-progress-icon { width:26px !important; height:26px !important; }
      .topic-bar-track { height:6px !important; }
      .topic-bar-row small { font-size:8px !important; margin-top:4px !important; }

      /* Topic + library cards: remove desktop-sized vertical waste. */
      .topics-grid, .library-grid { grid-template-columns:1fr !important; gap:8px !important; }
      .topic-card, .library-card { min-height:0 !important; height:auto !important; padding:13px !important; border-radius:15px !important; }
      .topic-icon { width:35px !important; height:35px !important; font-size:16px !important; margin-bottom:7px !important; }
      .topic-card h3, .library-card h3 { font-size:18px !important; line-height:1.14 !important; margin:10px 0 5px !important; }
      .topic-card p, .library-card p { min-height:0 !important; font-size:11px !important; line-height:1.45 !important; margin:4px 0 !important; }
      .topic-meta { font-size:8px !important; }
      .topic-progress { height:4px !important; margin-top:7px !important; }
      .library-icon { width:42px !important; height:42px !important; border-radius:13px !important; font-size:20px !important; }
      .library-level { font-size:8px !important; padding:4px 7px !important; }
      .library-card-number { top:60px !important; right:13px !important; font-size:9px !important; }
      .library-note-list { gap:5px !important; margin-top:9px !important; }
      .library-note { grid-template-columns:20px 1fr !important; gap:6px !important; padding:6px 7px !important; border-radius:10px !important; }
      .library-note span { width:20px !important; height:20px !important; }
      .library-note p { font-size:10px !important; line-height:1.4 !important; }
      .library-card-foot { margin-top:9px !important; padding-top:8px !important; }
      .library-card-foot > div:first-child { font-size:8px !important; }
      .library-card-foot strong { font-size:10px !important; }
      .library-progress { height:4px !important; margin:5px 0 7px !important; }
      .library-open { min-height:37px !important; font-size:10px !important; padding:0 10px !important; }
      .topic-card:after, .library-card:after { right:9px !important; bottom:9px !important; font-size:7px !important; padding:4px 6px !important; }

      /* Map */
      .map-control-panel { padding:11px !important; border-radius:16px !important; gap:8px !important; }
      .map-control-copy strong { font-size:14px !important; }
      .map-control-copy small { font-size:9px !important; line-height:1.4 !important; }
      .map-mode-bar { display:flex !important; gap:5px !important; flex-wrap:wrap !important; overflow:visible !important; }
      .map-mode-btn { flex:1 1 calc(50% - 5px) !important; min-width:0 !important; min-height:47px !important; padding:6px 7px !important; border-radius:10px !important; }
      .map-mode-btn span { font-size:15px !important; }
      .map-mode-btn b { font-size:9px !important; }
      .map-mode-btn small { font-size:7px !important; }
      .full-map-wrap, .full-map-wrap #full-map, #full-map, #dashboard-map { min-height:440px !important; height:54vh !important; max-height:560px !important; }
      .map-search-floating { left:10px !important; top:10px !important; width:calc(100% - 20px) !important; height:40px !important; }
      .map-search-floating input { font-size:10px !important; }
      .map-legend-panel { left:10px !important; right:10px !important; bottom:10px !important; width:auto !important; max-height:135px !important; padding:9px !important; }
      .map-legend-head { padding-bottom:6px !important; margin-bottom:5px !important; }
      .map-legend-item b { font-size:8px !important; }
      .map-legend-item small { font-size:7px !important; }
      .map-help-chip { left:10px !important; right:10px !important; bottom:7px !important; font-size:8px !important; padding:7px 8px !important; }
      .province-detail { padding:16px !important; }
      .province-name { font-size:25px !important; }
      .province-plate { font-size:10px !important; }
      .kpss-box { padding:13px !important; border-radius:14px !important; }
      .kpss-box p { font-size:11px !important; line-height:1.55 !important; }
      .fact-cell { padding:11px !important; border-radius:12px !important; }
      .fact-cell-label { font-size:8px !important; }
      .fact-cell p { font-size:10px !important; }
      .province-actions { grid-template-columns:1fr !important; gap:6px !important; margin-top:11px !important; }
      .province-action-btn { min-height:42px !important; font-size:10px !important; }

      /* Quiz */
      .quiz-start { padding:17px !important; border-radius:17px !important; }
      .quiz-start-visual { width:84px !important; height:84px !important; margin-bottom:11px !important; font-size:24px !important; }
      .quiz-start-copy h3 { font-size:24px !important; }
      .quiz-start-copy p { font-size:11px !important; line-height:1.45 !important; }
      .quiz-rules { gap:4px !important; margin:9px 0 !important; }
      .quiz-rules span { font-size:9px !important; padding:5px 7px !important; }
      .quiz-card-body { padding:16px 13px 18px !important; }
      .quiz-card-topline { padding:12px 13px 0 !important; }
      .quiz-question-v8 { font-size:20px !important; line-height:1.3 !important; margin-bottom:14px !important; }
      .quiz-option-v8 { min-height:55px !important; grid-template-columns:32px 1fr 15px !important; gap:7px !important; padding:8px 9px !important; font-size:11px !important; border-radius:11px !important; }
      .quiz-option-v8 .option-label { width:30px !important; height:30px !important; }
      .quiz-action-row { flex-direction:column !important; gap:7px !important; margin-top:12px !important; padding-top:11px !important; }
      .quiz-check-btn, .quiz-next-btn { width:100% !important; min-height:44px !important; }

      /* Learning modal */
      .modal-backdrop { padding:8px !important; }
      .modal-box { max-height:94vh !important; border-radius:20px !important; }
      .topic-learning-head { padding:14px !important; }
      .topic-learning-body { padding:11px !important; }
      .topic-modal-icon { width:44px !important; height:44px !important; font-size:22px !important; }
      .topic-learning-head h2 { font-size:21px !important; }
      .topic-modal-subtitle { font-size:10px !important; }
      .topic-learning-intro { padding:11px !important; margin-bottom:9px !important; }
      .topic-learning-intro p { font-size:11px !important; line-height:1.5 !important; }
      .topic-learning-section { padding:11px !important; margin-bottom:8px !important; border-radius:12px !important; }
      .topic-learning-section-title { margin-bottom:7px !important; }
      .topic-learning-section-title b { font-size:13px !important; }
      .topic-learning-section-title small { font-size:8px !important; }
      .topic-bullets { gap:5px !important; }
      .topic-bullets li { padding:8px 8px 8px 33px !important; font-size:10px !important; line-height:1.45 !important; }
      .topic-bullets li:before { left:8px !important; top:8px !important; width:19px !important; height:19px !important; }
      .topic-memory-card { padding:11px !important; }
      .topic-memory-card p { font-size:10px !important; line-height:1.5 !important; }
      .topic-learning-actions { gap:6px !important; }
      .topic-learning-actions button { min-height:43px !important; }

      /* Fixed navigation + notifications always have their own safe zone. */
      .mobile-bottom-nav { left:8px !important; right:8px !important; bottom:max(7px, env(safe-area-inset-bottom)) !important; height:60px !important; min-height:60px !important; padding:5px !important; z-index:120 !important; }
      .mobile-bottom-nav button { flex:1 1 20% !important; min-width:0 !important; min-height:50px !important; padding:5px 2px !important; gap:3px !important; }
      .mobile-bottom-nav button span { font-size:7px !important; }
      .mobile-bottom-nav svg { width:18px !important; height:18px !important; }
      #toast-root { left:9px !important; right:9px !important; bottom:78px !important; z-index:2000 !important; }
      #toast-root .toast { width:100% !important; min-width:0 !important; max-width:none !important; margin-bottom:6px !important; font-size:11px !important; }
      .app-status { bottom:84px !important; z-index:1999 !important; }
    }

    @media (max-width: 430px) {
      .main-content { padding-left:9px !important; padding-right:9px !important; padding-bottom:132px !important; }
      .stats-grid { gap:5px !important; }
      .stat-card { min-height:104px !important; }
      .stat-card > strong { font-size:22px !important; }
      .hero-banner h1 { font-size:24px !important; }
      .topic-card h3, .library-card h3 { font-size:17px !important; }
      .full-map-wrap, .full-map-wrap #full-map, #full-map, #dashboard-map { min-height:410px !important; height:52vh !important; }
      .map-mode-btn { flex-basis:100% !important; }
    }

    @media (max-width: 360px) {
      .topbar { padding-left:7px !important; padding-right:7px !important; }
      .mobile-menu-btn, .icon-btn, .profile-btn { width:34px !important; height:34px !important; min-width:34px !important; }
      .hero-banner { padding:13px !important; }
      .stat-card { padding:8px !important; }
    }
  `;
  document.head.appendChild(style);
})();
