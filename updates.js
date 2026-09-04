/*
 * Yurdunu Bil — sürüm / güncelleme sistemi
 * v21.1.0
 */
(() => {
  "use strict";

  const CFG = window.YURDUNUBIL_CONFIG || {};
  const CURRENT = String(CFG.APP_VERSION || "21.1.0");
  const VERSION_URL = "version.json?ts=" + Date.now();
  const SEEN_KEY = "yb_seen_update_version";
  const RELEASE = {
    version: CURRENT,
    title: "Daha temiz, daha güncel",
    items: [
      "Yeni sürüm bildirim sistemi eklendi.",
      "Eski tarayıcı önbelleğinin sürümü geri göstermesi engellendi.",
      "Mobil arayüz ve kart ölçeklendirmesi iyileştirildi.",
      "Türkçe karakter / UTF-8 düzeltmeleri güçlendirildi."
    ]
  };

  function css() {
    if (document.getElementById("yb-update-style")) return;
    const s = document.createElement("style");
    s.id = "yb-update-style";
    s.textContent = `
      #yb-update-toast{position:fixed;right:18px;bottom:22px;z-index:2147483646;width:min(390px,calc(100vw - 24px));padding:16px;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:rgba(7,18,31,.96);color:#fff;box-shadow:0 18px 55px rgba(0,0,0,.35);font:500 14px/1.45 Inter,system-ui,sans-serif;backdrop-filter:blur(18px);animation:ybIn .28s ease}
      #yb-update-toast b{display:block;font-size:16px;margin-bottom:5px}#yb-update-toast small{display:block;color:#aebdca;margin-bottom:12px}
      #yb-update-toast button{border:0;border-radius:11px;padding:10px 13px;background:#fff;color:#07121f;font-weight:800;cursor:pointer;margin-right:6px}
      #yb-update-toast button.alt{background:rgba(255,255,255,.09);color:#fff}
      @keyframes ybIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
      @media(max-width:760px){#yb-update-toast{right:12px;bottom:calc(82px + env(safe-area-inset-bottom));width:calc(100vw - 24px)}}
    `;
    document.head.appendChild(s);
  }

  function clearBrowserCaches() {
    try {
      if ("caches" in window) {
        caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key)))).catch(() => {});
      }
      try { sessionStorage.removeItem("yb_force_old_ui"); } catch (_) {}
    } catch (_) {}
  }

  function show(message, remoteVersion, force) {
    css();
    const old = document.getElementById("yb-update-toast");
    if (old) old.remove();
    const el = document.createElement("div");
    el.id = "yb-update-toast";
    el.innerHTML = `
      <b>${force ? "Yeni sürüm hazır 🚀" : `Yurdunu Bil ${remoteVersion || CURRENT}`}</b>
      <small>${message}</small>
      <button id="yb-update-now">Şimdi yenile</button>
      <button id="yb-update-later" class="alt">Daha sonra</button>
    `;
    document.body.appendChild(el);
    document.getElementById("yb-update-now").onclick = () => {
      clearBrowserCaches();
      location.replace(location.pathname + "?v=" + encodeURIComponent(remoteVersion || CURRENT) + "&refresh=" + Date.now());
    };
    document.getElementById("yb-update-later").onclick = () => el.remove();
  }

  function showReleaseOnce() {
    try {
      if (localStorage.getItem(SEEN_KEY) === CURRENT) return;
      localStorage.setItem(SEEN_KEY, CURRENT);
      const text = RELEASE.items.map(x => "• " + x).join("  ");
      setTimeout(() => show(text, CURRENT, false), 900);
    } catch (_) {}
  }

  async function checkRemoteVersion() {
    try {
      const response = await fetch(VERSION_URL, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
      });
      if (!response.ok) return;
      const remote = await response.json();
      const remoteVersion = String(remote.version || "");
      if (!remoteVersion || remoteVersion === CURRENT) return;
      if (remoteVersion !== CURRENT) {
        show(remote.message || `Yeni sürüm ${remoteVersion} yayınlandı.`, remoteVersion, true);
      }
    } catch (_) {}
  }

  function boot() {
    if (window.__YB_UPDATE_SYSTEM__) return;
    window.__YB_UPDATE_SYSTEM__ = true;
    showReleaseOnce();
    checkRemoteVersion();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once:true });
  else boot();
})();
