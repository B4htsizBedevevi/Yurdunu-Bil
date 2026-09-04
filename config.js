/**
 * Yurdunu Bil — yapılandırma
 * Frontend tarafında yalnızca Supabase Publishable key kullanılır.
 * Service Role key ASLA buraya eklenmez.
 */
window.YURDUNUBIL_CONFIG = {
  SUPABASE_URL: "https://rdgefzwvfqvzmpfoiprj.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_LjA0E5FY6t6ID0YMwjJpxA_vCRNCuY7",
  APP_VERSION: "12.0.0",
  APP_NAME: "Yurdunu Bil",
  EXAM_DATE: "2026-10-04T10:15:00+03:00"
};

/* ============================================================
   v11 — GERÇEK UTF-8 / MOJIBAKE KORUMASI
============================================================ */
(() => {
  "use strict";
  const repair = value => {
    if (!value || !/[ÃÂÄÅÆÇÐÑÒÓÔÕÖØÙÚÛÜÝÞß]/.test(value)) return value;
    try {
      return decodeURIComponent(escape(value));
    } catch (_) {
      return value;
    }
  };
  const walk = node => {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const fixed = repair(node.nodeValue);
      if (fixed !== node.nodeValue) node.nodeValue = fixed;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    for (const child of [...node.childNodes]) walk(child);
  };
  try {
    const originalHTML = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
    if (originalHTML?.set) {
      Object.defineProperty(Element.prototype, "innerHTML", {
        configurable: true,
        get: originalHTML.get,
        set(value) { originalHTML.set.call(this, repair(String(value))); walk(this); }
      });
    }
  } catch (_) {}
  try {
    const originalInsert = Element.prototype.insertAdjacentHTML;
    Element.prototype.insertAdjacentHTML = function(position, text) {
      return originalInsert.call(this, position, repair(String(text)));
    };
  } catch (_) {}
  const observer = new MutationObserver(mutations => mutations.forEach(m => m.addedNodes.forEach(walk)));
  const boot = () => { walk(document.body); observer.observe(document.body, {childList:true, subtree:true}); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, {once:true}); else boot();
})();

/* Mobile v11 */
(() => {
  if (document.getElementById("yurdunu-bil-mobile-v11")) return;
  const style = document.createElement("style");
  style.id = "yurdunu-bil-mobile-v11";
  style.textContent = `
    html,body{overflow-x:hidden!important;max-width:100%;}
    .main-content{padding-bottom:calc(92px + env(safe-area-inset-bottom))!important;}
    .mobile-bottom-nav{z-index:9999!important;bottom:0!important;padding-bottom:env(safe-area-inset-bottom)!important;}
    .toast{bottom:calc(76px + env(safe-area-inset-bottom))!important;}
    .hero-banner,.stat-card,.panel,.study-item,.topic-card,.quiz-start-card,.quiz-card{box-sizing:border-box;}
    @media(max-width:760px){
      .hero-banner{padding:16px!important;min-height:0!important;}
      .stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important;}
      .stat-card{padding:12px!important;min-height:0!important;}
      .stat-card strong{font-size:22px!important;}
      .content-grid{grid-template-columns:1fr!important;gap:12px!important;}
      .panel{padding:14px!important;border-radius:15px!important;}
      .study-list{gap:8px!important;}
      .study-item{padding:11px!important;min-height:0!important;}
      .topic-bars{gap:8px!important;}
      .full-map-wrap,#full-map,#dashboard-map{height:48vh!important;min-height:330px!important;max-height:500px!important;}
      .topics-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important;}
      .quiz-options{gap:8px!important;}
      .quiz-option{padding:12px!important;min-height:0!important;}
      .quiz-actions{gap:8px!important;flex-wrap:wrap!important;}
      .view-head{margin-bottom:12px!important;}
    }
    @media(max-width:390px){.topics-grid{grid-template-columns:1fr!important}.stats-grid{gap:7px!important}.stat-card{padding:10px!important}.panel{padding:12px!important}.main-content{padding-left:10px!important;padding-right:10px!important;}}
    @media(max-width:340px){.stats-grid{grid-template-columns:1fr!important}.map-mode-bar{grid-template-columns:repeat(2,minmax(0,1fr))!important;}}
  `;
  document.head.appendChild(style);
})();
