/**
 * Yurdunu Bil — Yapılandırma
 * Frontend tarafında yalnızca Supabase Publishable key kullanılır.
 * Service Role key'i ASLA buraya ekleme.
 */
window.YURDUNUBIL_CONFIG = {
  SUPABASE_URL: "https://rdgefzwvfqvzmpfoiprj.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_LjA0E5FY6t6ID0YMwjJpxA_vCRNCuY7",
  APP_VERSION: "10.1.0",
  APP_NAME: "Yurdunu Bil",
  EXAM_DATE: "2026-10-04T10:15:00+03:00"
};

/* =========================================================
   v10.1 — UTF-8 / MOBİL POLISH
   Eski mojibake metinlerini DOM seviyesinde düzeltir.
========================================================= */
(() => {
  "use strict";

  const replacements = [
    ["Ã„Â°", "İ"], ["Ã„Â±", "ı"], ["Ã„ÂŸ", "ğ"], ["Ã…Å¸", "ş"],
    ["Ã‡", "Ç"], ["Ãœ", "Ü"], ["Ã–", "Ö"], ["Äž", "Ğ"],
    ["Ã¼", "ü"], ["Ã¶", "ö"], ["Ã§", "ç"], ["Ä±", "ı"],
    ["ÄŸ", "ğ"], ["ÅŸ", "ş"], ["Ä°", "İ"],
    ["âœ“", "✓"], ["âœ•", "✕"], ["â€”", "—"], ["â€“", "–"],
    ["â†’", "→"], ["âš¡", "⚡"], ["Â°", "°"], ["Â·", "·"],
    ["âœ¨", "✨"], ["âš ", "⚠"], ["Â©", "©"], ["Â®", "®"],
    ["âœ”", "✔"], ["â˜…", "★"], ["â˜†", "☆"], ["â†‘", "↑"],
    ["â†“", "↓"], ["â†", "←"], ["â€¢", "•"], ["â€¦", "…"],
    ["â€˜", "‘"], ["â€™", "’"], ["â€œ", "“"], ["â€", "”"]
  ];

  function fixMojibake(value) {
    let text = String(value ?? "");
    if (!/[ÃÂÄÅâ]/.test(text)) return text;
    for (const [bad, good] of replacements) text = text.split(bad).join(good);
    return text;
  }

  function fixTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const fixed = fixMojibake(node.nodeValue);
    if (fixed !== node.nodeValue) node.nodeValue = fixed;
  }

  function fixElement(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      fixTextNode(root);
      return;
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) fixTextNode(node);
  }

  function bootEncodingFix() {
    fixElement(document.body);
    if (window.__YURDUNUBIL_ENCODING_FIX__) return;

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          fixTextNode(mutation.target);
        } else if (mutation.type === "childList") {
          mutation.addedNodes.forEach(fixElement);
        }
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true
    });

    window.__YURDUNUBIL_ENCODING_FIX__ = true;
  }

  if (document.body) bootEncodingFix();
  else document.addEventListener("DOMContentLoaded", bootEncodingFix, { once: true });
})();

/* =========================================================
   Mobile UI polish — injected before the main application starts.
========================================================= */
(() => {
  const style = document.createElement("style");
  style.id = "yurdunubil-mobile-v101";
  style.textContent = `
    @media (max-width: 900px) {
      html, body { width:100%; max-width:100%; overflow-x:hidden; }
      body { -webkit-text-size-adjust:100%; }

      .main-content {
        min-width:0;
        width:100%;
        margin-left:0 !important;
        padding-bottom:110px !important;
      }

      .topbar {
        min-height:68px !important;
        padding:10px 14px !important;
        gap:8px !important;
      }

      .topbar h1,
      .page-title,
      #page-title {
        min-width:0;
        max-width:48vw;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:17px !important;
      }

      .content,
      .page-content,
      .view {
        min-width:0;
        max-width:100%;
      }

      .mobile-bottom-nav {
        position:fixed !important;
        z-index:9998 !important;
        left:12px !important;
        right:12px !important;
        bottom:max(10px, env(safe-area-inset-bottom)) !important;
        width:auto !important;
        min-height:68px !important;
        padding:7px 6px !important;
        border-radius:22px !important;
        background:rgba(6,20,33,.94) !important;
        backdrop-filter:blur(22px) saturate(1.25) !important;
        -webkit-backdrop-filter:blur(22px) saturate(1.25) !important;
        box-shadow:0 16px 45px rgba(0,0,0,.34), inset 0 1px rgba(255,255,255,.05) !important;
      }

      .mobile-bottom-nav button {
        min-width:0 !important;
        flex:1 1 0 !important;
        min-height:54px !important;
        padding:7px 3px !important;
        gap:4px !important;
        border-radius:15px !important;
      }

      .mobile-bottom-nav button span {
        font-size:8px !important;
        line-height:1.1 !important;
      }

      #toast-root {
        position:fixed !important;
        z-index:10000 !important;
        left:12px !important;
        right:12px !important;
        bottom:92px !important;
        width:auto !important;
        pointer-events:none !important;
      }

      #toast-root .toast {
        width:100% !important;
        max-width:520px !important;
        margin:0 auto 8px !important;
        font-size:11px !important;
      }

      .map-mode-bar {
        gap:7px !important;
        overflow-x:auto !important;
        scrollbar-width:none !important;
        padding-bottom:2px !important;
      }
      .map-mode-bar::-webkit-scrollbar { display:none; }
      .map-mode-btn { flex:0 0 auto !important; min-width:112px !important; }

      #full-map,
      #map,
      .leaflet-container {
        min-height:420px !important;
        height:58vh !important;
        max-height:620px !important;
        border-radius:22px !important;
      }

      .map-legend,
      .map-legend-panel {
        max-width:calc(100% - 28px) !important;
        left:14px !important;
        right:14px !important;
        bottom:14px !important;
      }

      .leaflet-control-zoom {
        margin-right:10px !important;
        margin-bottom:10px !important;
      }

      .sidebar {
        max-width:min(88vw, 360px) !important;
      }

      .cards-grid,
      .topic-grid,
      .library-grid,
      .stats-grid {
        grid-template-columns:1fr !important;
      }

      .card,
      .topic-card,
      .library-card,
      .stat-card {
        min-width:0 !important;
      }
    }

    @media (max-width: 480px) {
      .topbar { padding-left:10px !important; padding-right:10px !important; }
      .topbar h1, #page-title { max-width:42vw; font-size:15px !important; }
      .mobile-bottom-nav { left:8px !important; right:8px !important; bottom:max(7px, env(safe-area-inset-bottom)) !important; }
      #toast-root { left:8px !important; right:8px !important; bottom:88px !important; }
      #full-map, #map, .leaflet-container { min-height:360px !important; height:54vh !important; }
    }
  `;
  document.head.appendChild(style);
})();
