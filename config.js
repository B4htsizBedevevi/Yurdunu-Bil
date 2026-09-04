/**
 * Yurdunu Bil — yapılandırma
 * Frontend tarafında yalnızca Supabase Publishable key kullanılır.
 * Service Role key ASLA buraya eklenmez.
 */
window.YURDUNUBIL_CONFIG = {
  SUPABASE_URL: "https://rdgefzwvfqvzmpfoiprj.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_LjA0E5FY6t6ID0YMwjJpxA_vCRNCuY7",
  APP_VERSION: "21.1.0",
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
    ["Ã§", "ç"], ["Ã‡", "Ç"], ["Ä±", "ı"], ["İ", "İ"],
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
