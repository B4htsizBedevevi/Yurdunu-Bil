/* Yurdunu Bil — v13 Live Current Information */
(() => {
  'use strict';

  const STORAGE = 'yb_live_news_v1';
  const INTERVAL = 180000;
  const MAX_ITEMS = 12;
  const FEEDS = [
    { name: 'ÖSYM / KPSS', url: 'https://news.google.com/rss/search?q=KPSS%20OR%20%C3%96SYM&hl=tr&gl=TR&ceid=TR:tr', type: 'KPSS' },
    { name: 'Türkiye', url: 'https://news.google.com/rss/search?q=T%C3%BCrkiye%20g%C3%BCndem&hl=tr&gl=TR&ceid=TR:tr', type: 'Türkiye' },
    { name: 'Bilim & Teknoloji', url: 'https://news.google.com/rss/search?q=bilim%20teknoloji%20T%C3%BCrkiye&hl=tr&gl=TR&ceid=TR:tr', type: 'Bilim' },
    { name: 'Dünya', url: 'https://news.google.com/rss/search?q=d%C3%BCnya%20g%C3%BCndem&hl=tr&gl=TR&ceid=TR:tr', type: 'Dünya' }
  ];
  const API = 'https://api.rss2json.com/v1/api.json?rss_url=';
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[c]));
  const strip = (v) => String(v ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const read = () => { try { return JSON.parse(localStorage.getItem(STORAGE) || '{}'); } catch (_) { return {}; } };
  const save = (items) => { try { localStorage.setItem(STORAGE, JSON.stringify({ savedAt: Date.now(), items })); } catch (_) {} };
  const relative = (date) => {
    const t = Date.parse(date);
    if (!Number.isFinite(t)) return 'Yeni';
    const m = Math.max(0, Math.floor((Date.now() - t) / 60000));
    if (m < 1) return 'Az önce';
    if (m < 60) return `${m} dk önce`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} sa önce`;
    return `${Math.floor(h / 24)} gün önce`;
  };
  const important = (title) => /kpss|ösym|sinav|sınav|eğitim|üniversite|deprem|meteoroloji|iklim|kuraklık|orman|yangın|ekonomi|bilim|teknoloji|uzay|nasa|coğrafya|türkiye|avrupa|dünya/i.test(title);

  async function fetchFeed(feed) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(API + encodeURIComponent(feed.url) + '&t=' + Date.now(), { cache: 'no-store', signal: controller.signal });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (!data || data.status !== 'ok' || !Array.isArray(data.items)) throw new Error('Feed unavailable');
      return data.items.slice(0, 8).map(x => ({
        title: strip(x.title),
        link: String(x.link || ''),
        source: strip(x.author || feed.name) || feed.name,
        date: x.pubDate || new Date().toISOString(),
        category: feed.type
      })).filter(x => x.title && x.link);
    } finally { clearTimeout(timer); }
  }

  function style() {
    if ($('#yb-news-style')) return;
    const s = document.createElement('style');
    s.id = 'yb-news-style';
    s.textContent = `
      .yb-news{margin:18px 0;padding:18px;border:1px solid rgba(255,255,255,.09);border-radius:22px;background:linear-gradient(135deg,rgba(18,29,48,.98),rgba(8,15,28,.98));box-shadow:0 16px 40px rgba(0,0,0,.16);overflow:hidden}
      .yb-news-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:14px}
      .yb-news-kicker{font-size:10px;font-weight:900;letter-spacing:.13em;opacity:.68;display:flex;align-items:center;gap:7px}
      .yb-news-dot{width:7px;height:7px;border-radius:50%;background:#46e28a;box-shadow:0 0 12px rgba(70,226,138,.7);display:inline-block;animation:ybpulse 1.8s infinite}
      @keyframes ybpulse{50%{opacity:.35;transform:scale(.75)}}
      .yb-news h3{margin:5px 0 3px;font-size:20px;letter-spacing:-.02em}
      .yb-news-sub{margin:0;font-size:12px;opacity:.58}
      .yb-news-actions{display:flex;gap:8px;align-items:center;flex-shrink:0}
      .yb-news-status{font-size:10px;font-weight:800;opacity:.55;white-space:nowrap}
      .yb-news-refresh{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.06);color:inherit;border-radius:12px;padding:9px 11px;font-weight:850;cursor:pointer}
      .yb-news-refresh:hover{background:rgba(255,255,255,.1)}
      .yb-news-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
      .yb-news-card{display:block;text-decoration:none;color:inherit;padding:14px;border-radius:16px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.035);min-width:0;transition:transform .18s,background .18s,border-color .18s}
      .yb-news-card:hover{transform:translateY(-2px);background:rgba(255,255,255,.065);border-color:rgba(255,255,255,.13)}
      .yb-news-meta{display:flex;justify-content:space-between;gap:8px;margin-bottom:8px;font-size:9px;font-weight:900;letter-spacing:.06em;opacity:.55;text-transform:uppercase}
      .yb-news-title{font-size:13px;font-weight:800;line-height:1.42;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
      .yb-news-bottom{display:flex;justify-content:space-between;gap:8px;margin-top:10px;font-size:9px;font-weight:800;opacity:.48}
      .yb-news-kpss{font-size:8px;letter-spacing:.08em;padding:3px 6px;border-radius:6px;background:rgba(70,226,138,.1);color:#79e8a6}
      .yb-news-empty{padding:20px;text-align:center;font-size:12px;opacity:.6;border:1px dashed rgba(255,255,255,.1);border-radius:14px}
      @media(max-width:900px){.yb-news-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:600px){.yb-news{margin:12px 0;padding:14px;border-radius:17px}.yb-news-head{display:block}.yb-news-actions{margin-top:10px;justify-content:space-between}.yb-news-grid{grid-template-columns:1fr 1fr;gap:8px}.yb-news-card{padding:11px;border-radius:13px}.yb-news-title{font-size:11px}.yb-news-sub{font-size:10px}.yb-news h3{font-size:16px}.yb-news-bottom{font-size:8px}.yb-news-meta{font-size:8px}}
      @media(max-width:380px){.yb-news-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(s);
  }

  function inject() {
    const view = $('#view-dashboard');
    if (!view || $('#yb-live-news')) return;
    const anchor = view.querySelector('.hero-banner') || view.querySelector('.welcome-row') || view.firstElementChild;
    const section = document.createElement('section');
    section.id = 'yb-live-news';
    section.className = 'yb-news';
    section.innerHTML = `<div class="yb-news-head"><div><div class="yb-news-kicker"><span class="yb-news-dot"></span> CANLI GÜNCEL BİLGİ</div><h3>📰 Bugünün Gündemi</h3><p class="yb-news-sub">KPSS'ye yarayabilecek güncel gelişmeler, ÖSYM ve Türkiye gündemi.</p></div><div class="yb-news-actions"><span id="yb-news-status" class="yb-news-status">İlk kontrol yapılıyor…</span><button id="yb-news-refresh" class="yb-news-refresh" type="button">↻ Yenile</button></div></div><div id="yb-news-grid" class="yb-news-grid"><div class="yb-news-empty">Güncel bilgiler yükleniyor…</div></div>`;
    anchor?.after(section);
    style();
    $('#yb-news-refresh')?.addEventListener('click', () => load(true));
  }

  function render(items, stale = false) {
    const grid = $('#yb-news-grid');
    const status = $('#yb-news-status');
    if (!grid) return;
    if (!items.length) {
      grid.innerHTML = '<div class="yb-news-empty">Şu an güncel akış alınamadı. Bir sonraki kontrol otomatik yapılacak.</div>';
    } else {
      grid.innerHTML = items.slice(0, MAX_ITEMS).map(x => `<a class="yb-news-card" href="${esc(x.link)}" target="_blank" rel="noopener noreferrer"><div class="yb-news-meta"><span>${esc(x.category)}</span><span>${esc(relative(x.date))}</span></div><div class="yb-news-title">${esc(x.title)}</div><div class="yb-news-bottom"><span>${esc(x.source || 'Haber kaynağı')}</span>${important(x.title) ? '<span class="yb-news-kpss">KPSS</span>' : ''}</div></a>`).join('');
    }
    if (status) status.textContent = stale ? 'Son kayıt gösteriliyor' : `Son kontrol: ${new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})}`;
  }

  async function load(manual = false) {
    const cached = read();
    if (!manual && Array.isArray(cached.items) && cached.items.length) render(cached.items, true);
    const status = $('#yb-news-status');
    if (status) status.textContent = 'Güncelleniyor…';
    try {
      const batches = await Promise.allSettled(FEEDS.map(fetchFeed));
      const fresh = batches.flatMap(x => x.status === 'fulfilled' ? x.value : []);
      const seen = new Set();
      const merged = fresh.filter(x => {
        const key = x.link || x.title;
        if (seen.has(key)) return false;
        seen.add(key); return true;
      }).sort((a,b) => Date.parse(b.date) - Date.parse(a.date));
      if (!merged.length) throw new Error('No feed data');
      const filtered = merged.filter(x => important(x.title));
      const finalItems = (filtered.length >= 6 ? filtered : merged).slice(0, MAX_ITEMS);
      save(finalItems);
      render(finalItems, false);
    } catch (_) {
      const old = read();
      render(Array.isArray(old.items) ? old.items : [], true);
    }
  }

  function start() {
    inject();
    if (!$('#yb-live-news')) return;
    load(false);
    setInterval(() => {
      if (document.visibilityState === 'visible') load(false);
    }, INTERVAL);
    new MutationObserver(() => { if (!$('#yb-live-news')) inject(); }).observe(document.body, { childList:true, subtree:true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
