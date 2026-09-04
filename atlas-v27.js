/* Yurdunu Bil — Atlas interaction core v27.2
 * Stable map controls: pan from anywhere, click-to-select, pinch zoom,
 * state survives province selection/re-render, and refresh never reloads page.
 */
(() => {
  'use strict';

  const ROOTS = ['dash-svg', 'map-svg'];
  const mapStates = new Map();
  const pointers = new Map();
  let liveIndex = 0;
  let liveTimer = null;

  const LIVE = [
    { icon:'👥', label:'Türkiye nüfusu', value:'86.092.168', note:'TÜİK ADNKS 2025 • 31 Aralık 2025' },
    { icon:'🏙️', label:'İstanbul nüfusu', value:'15.754.053', note:'TÜİK ADNKS 2025' },
    { icon:'🏛️', label:'Ankara nüfusu', value:'5.910.320', note:'TÜİK ADNKS 2025' },
    { icon:'🌊', label:'İzmir nüfusu', value:'4.504.185', note:'TÜİK ADNKS 2025' },
    { icon:'🏭', label:'Bursa nüfusu', value:'3.263.011', note:'TÜİK ADNKS 2025' },
    { icon:'🌴', label:'Antalya nüfusu', value:'2.777.677', note:'TÜİK ADNKS 2025' },
    { icon:'📉', label:'Nüfusu azalan il sayısı', value:'33 il', note:'2025’te bir önceki yıla göre azalış' },
    { icon:'🏙️', label:'İl/ilçe merkezlerinde yaşayanlar', value:'%93,6', note:'TÜİK ADNKS 2025' },
    { icon:'🏙️', label:'Yoğun kent nüfusu', value:'%67,5', note:'TÜİK kent-kır sınıflaması, 2025' },
    { icon:'📐', label:'En büyük yüz ölçümü', value:'Konya', note:'40.838 km²' },
    { icon:'◻️', label:'En küçük yüz ölçümü', value:'Yalova', note:'798 km²' }
  ];

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function getState(svg) {
    const key = svg.id || 'map';
    let state = mapStates.get(key);
    if (!state) {
      state = {
        x: 0, y: 0, zoom: 1,
        dragging: false, moved: false,
        startX: 0, startY: 0, baseX: 0, baseY: 0,
        suppressClick: false,
        pinchDistance: 0, pinchZoom: 1
      };
      mapStates.set(key, state);
    }
    return state;
  }

  function getBounds(svg) {
    const rect = svg.getBoundingClientRect();
    const w = Math.max(280, rect.width || 900);
    const h = Math.max(220, rect.height || 500);
    const z = getState(svg).zoom;
    return {
      x: Math.min(360, Math.max(90, (w * Math.max(z - 1, .08)) * .56 + 120)),
      y: Math.min(220, Math.max(65, (h * Math.max(z - 1, .08)) * .56 + 70))
    };
  }

  function apply(svg) {
    const state = getState(svg);
    const bounds = getBounds(svg);
    state.x = clamp(state.x, -bounds.x, bounds.x);
    state.y = clamp(state.y, -bounds.y, bounds.y);
    state.zoom = clamp(state.zoom, .82, 2.35);
    svg.style.transform = `translate3d(${state.x}px,${state.y}px,0) scale(${state.zoom})`;
    svg.classList.toggle('atlas-panning', state.dragging);
    const note = svg.closest('.atlas-shell')?.querySelector('.atlas-reset-note');
    if (note) note.textContent = `${Math.round(state.zoom * 100)}%`;
  }

  function reset(svg) {
    const state = getState(svg);
    state.x = 0; state.y = 0; state.zoom = 1;
    state.dragging = false; state.moved = false;
    state.suppressClick = false; state.pinchDistance = 0; state.pinchZoom = 1;
    apply(svg);
  }

  function pan(svg, dx, dy) {
    const state = getState(svg);
    state.x += dx; state.y += dy;
    apply(svg);
  }

  function zoom(svg, delta, centerX=null, centerY=null) {
    const state = getState(svg);
    const old = state.zoom;
    const next = clamp(old + delta, .82, 2.35);
    if (next === old) return;

    if (centerX != null && centerY != null) {
      const rect = svg.getBoundingClientRect();
      const cx = centerX - (rect.left + rect.width / 2);
      const cy = centerY - (rect.top + rect.height / 2);
      const ratio = next / old - 1;
      state.x -= cx * ratio;
      state.y -= cy * ratio;
    }

    state.zoom = next;
    apply(svg);
  }

  function addControls(svg) {
    const shell = svg.closest('.atlas-shell');
    if (!shell || shell.querySelector('.atlas-nav')) return;

    const nav = document.createElement('div');
    nav.className = 'atlas-nav';
    nav.innerHTML = `
      <button type="button" data-map-left aria-label="Sola kaydır">‹</button>
      <button type="button" data-map-zoom-out aria-label="Uzaklaştır">−</button>
      <button type="button" class="atlas-reset" data-map-reset aria-label="Haritayı sıfırla">⌂</button>
      <button type="button" data-map-zoom-in aria-label="Yakınlaştır">+</button>
      <button type="button" data-map-right aria-label="Sağa kaydır">›</button>
      <span class="atlas-reset-note">100%</span>
    `;
    shell.appendChild(nav);

    const hint = document.createElement('div');
    hint.className = 'atlas-gesture-hint';
    hint.textContent = 'Haritanın her yerinde sürükle • tekerlek/pinch ile yakınlaştır';
    shell.appendChild(hint);

    nav.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      if (button.dataset.mapLeft !== undefined) pan(svg, -90, 0);
      else if (button.dataset.mapRight !== undefined) pan(svg, 90, 0);
      else if (button.dataset.mapZoomIn !== undefined) zoom(svg, .18);
      else if (button.dataset.mapZoomOut !== undefined) zoom(svg, -.18);
      else if (button.dataset.mapReset !== undefined) reset(svg);
    });
  }

  function pointerDistance() {
    const values = [...pointers.values()];
    if (values.length < 2) return 0;
    return Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y);
  }

  function bindMap(svg) {
    if (!svg || svg.dataset.atlasV272 === '1') {
      if (svg) { addControls(svg); apply(svg); }
      return;
    }

    svg.dataset.atlasV272 = '1';
    addControls(svg);
    const state = getState(svg);
    apply(svg);

    svg.addEventListener('wheel', (event) => {
      event.preventDefault();
      zoom(svg, event.deltaY < 0 ? .13 : -.13, event.clientX, event.clientY);
    }, { passive:false });

    svg.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      pointers.set(event.pointerId, {x:event.clientX, y:event.clientY});
      try { svg.setPointerCapture(event.pointerId); } catch {}

      if (pointers.size >= 2) {
        state.pinchDistance = pointerDistance();
        state.pinchZoom = state.zoom;
        state.dragging = false;
        return;
      }

      state.dragging = true;
      state.moved = false;
      state.suppressClick = false;
      state.startX = event.clientX;
      state.startY = event.clientY;
      state.baseX = state.x;
      state.baseY = state.y;
      apply(svg);
    });

    svg.addEventListener('pointermove', (event) => {
      if (pointers.has(event.pointerId)) {
        pointers.set(event.pointerId, {x:event.clientX, y:event.clientY});
      }

      if (pointers.size >= 2) {
        const distance = pointerDistance();
        if (!distance || !state.pinchDistance) return;
        state.zoom = clamp(state.pinchZoom * (distance / state.pinchDistance), .82, 2.35);
        apply(svg);
        event.preventDefault();
        return;
      }

      if (!state.dragging) return;

      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;

      if (Math.abs(dx) + Math.abs(dy) > 6) {
        state.moved = true;
        state.suppressClick = true;
      }

      if (!state.moved) return;

      state.x = state.baseX + dx;
      state.y = state.baseY + dy;
      apply(svg);
      event.preventDefault();
    }, { passive:false });

    const end = (event) => {
      pointers.delete(event.pointerId);
      try { svg.releasePointerCapture(event.pointerId); } catch {}
      if (pointers.size < 2) state.pinchDistance = 0;
      if (pointers.size === 0) {
        state.dragging = false;
        apply(svg);
        if (state.suppressClick) setTimeout(() => { state.suppressClick = false; }, 120);
      }
    };

    svg.addEventListener('pointerup', end);
    svg.addEventListener('pointercancel', end);

    svg.addEventListener('click', (event) => {
      if (!state.suppressClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      state.suppressClick = false;
    }, true);

    svg.addEventListener('dblclick', (event) => {
      event.preventDefault();
      reset(svg);
    });
  }

  function enhanceMaps() {
    ROOTS.forEach(id => {
      const svg = document.getElementById(id);
      if (svg) bindMap(svg);
    });
  }

  function renderLive(el) {
    if (!el) return;
    const item = LIVE[liveIndex % LIVE.length];
    const main = el.querySelector('.live-main');
    if (!main) return;

    main.innerHTML = `
      <span class="live-icon">${item.icon}</span>
      <div><small>${item.label}</small><strong>${item.value}</strong><p>${item.note}</p></div>
    `;

    $$('.live-dots i', el).forEach((dot, index) => {
      dot.classList.toggle('active', index === liveIndex % LIVE.length);
    });
  }

  function syncLiveIndex(el) {
    const current = el?.querySelector('.live-main small')?.textContent?.trim();
    const index = LIVE.findIndex(x => x.label === current);
    if (index >= 0) liveIndex = index;
  }

  function bindLive() {
    const el = $('#live-stats');
    if (!el) return;

    if (el.dataset.atlasLive272 === '1') {
      syncLiveIndex(el);
      return;
    }

    el.dataset.atlasLive272 = '1';
    syncLiveIndex(el);

    const head = el.querySelector('.live-head');
    if (head && !head.querySelector('[data-atlas-refresh]')) {
      const refresh = document.createElement('button');
      refresh.type = 'button';
      refresh.className = 'live-refresh';
      refresh.dataset.atlasRefresh = '1';
      refresh.textContent = '↻ Yenile';
      head.appendChild(refresh);
    }

    const main = el.querySelector('.live-main');
    if (main && !el.querySelector('.live-switcher')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'live-switcher';
      wrapper.innerHTML = `
        <button type="button" data-live-prev aria-label="Önceki veri">‹</button>
        <div class="live-track"></div>
        <button type="button" data-live-next aria-label="Sonraki veri">›</button>
      `;
      main.parentNode.insertBefore(wrapper, main);
      wrapper.querySelector('.live-track').appendChild(main);
    }

    el.addEventListener('click', (event) => {
      const button = event.target.closest('[data-live-prev],[data-live-next],[data-atlas-refresh]');
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      liveIndex += button.dataset.livePrev !== undefined ? -1 : 1;
      liveIndex = (liveIndex + LIVE.length) % LIVE.length;
      renderLive(el);
    });

    let startX = 0;
    let startY = 0;
    el.addEventListener('touchstart', event => {
      const touch = event.touches[0];
      if (!touch) return;
      startX = touch.clientX;
      startY = touch.clientY;
    }, {passive:true});

    el.addEventListener('touchend', event => {
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        liveIndex += dx < 0 ? 1 : -1;
        liveIndex = (liveIndex + LIVE.length) % LIVE.length;
        renderLive(el);
        event.preventDefault();
      }
    }, {passive:false});

    renderLive(el);
  }

  function startLiveRotation() {
    if (liveTimer) clearInterval(liveTimer);
    liveTimer = setInterval(() => {
      const el = $('#live-stats');
      if (!el) return;
      liveIndex = (liveIndex + 1) % LIVE.length;
      renderLive(el);
    }, 180000);
  }

  let observerTimer = 0;
  const observer = new MutationObserver(() => {
    clearTimeout(observerTimer);
    observerTimer = setTimeout(() => {
      enhanceMaps();
      bindLive();
    }, 80);
  });

  function start() {
    enhanceMaps();
    bindLive();
    startLiveRotation();
    observer.observe(document.body, {subtree:true, childList:true});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, {once:true});
  } else {
    start();
  }
})();
