/* Yurdunu Bil — Province Focus Bridge v1.0.0 */
(() => {
  'use strict';
  const ROOT = 'yb-province-focus';
  const KEY = 'yb_selected_province_v1';
  const esc = (v) => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const read = () => { try { return localStorage.getItem(KEY) || ''; } catch (_) { return ''; } };
  const write = (v) => { try { localStorage.setItem(KEY, v); } catch (_) {} };

  function boot() {
    const timer = document.getElementById('yb-pomodoro');
    const data = Array.isArray(window.PROVINCE_DATA) ? window.PROVINCE_DATA : [];
    if (!timer || !data.length || document.getElementById(ROOT)) return !!timer && !!data.length;

    const sorted = data.slice().sort((a,b) => (a.plate || 999) - (b.plate || 999));
    const saved = read();
    let selected = sorted.find(p => p.name === saved) || sorted[0];

    const style = document.createElement('style');
    style.id = ROOT + '-css';
    style.textContent = `
      #${ROOT}{margin-top:9px;padding:12px;border:1px solid rgba(110,231,255,.14);border-radius:15px;background:linear-gradient(135deg,rgba(110,231,255,.045),rgba(139,92,246,.045));overflow:hidden}
      #${ROOT} .pf-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}
      #${ROOT} .pf-k{font-size:8px;font-weight:900;letter-spacing:1px;color:#6ee7ff;text-transform:uppercase}
      #${ROOT} .pf-title{font-size:12px;font-weight:900;color:#f8fafc;margin-top:2px}
      #${ROOT} .pf-badge{font-size:8px;font-weight:900;color:#dbeafe;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);padding:5px 7px;border-radius:8px;white-space:nowrap}
      #${ROOT} select{width:100%;height:38px;border-radius:9px;border:1px solid rgba(255,255,255,.09);background:#101c2d;color:#e5edf6;padding:0 9px;font-size:10px;outline:none}
      #${ROOT} select:focus{border-color:rgba(110,231,255,.6);box-shadow:0 0 0 3px rgba(110,231,255,.07)}
      #${ROOT} .pf-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:7px}
      #${ROOT} .pf-fact{padding:7px 8px;border-radius:9px;background:rgba(0,0,0,.13);min-width:0}
      #${ROOT} .pf-fact span{display:block;font-size:7px;color:#718096;text-transform:uppercase;letter-spacing:.45px;margin-bottom:3px}
      #${ROOT} .pf-fact b{display:block;font-size:9px;line-height:1.35;color:#e5edf6;overflow-wrap:anywhere}
      #${ROOT} .pf-note{margin-top:7px;font-size:8px;line-height:1.45;color:#8495aa}
      #${ROOT} .pf-actions{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}
      #${ROOT} button{min-height:40px;border-radius:9px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.045);color:#dbeafe;font:inherit;font-size:9px;font-weight:900;cursor:pointer;touch-action:manipulation}
      #${ROOT} button.primary{background:linear-gradient(135deg,#6ee7ff,#a7f3d0);color:#06111d;border-color:transparent}
      #${ROOT} button:active{transform:scale(.985)}
      @media(max-width:390px){#${ROOT}{padding:10px}.pf-grid{grid-template-columns:1fr 1fr}.pf-title{font-size:11px}}
    `;
    document.head.appendChild(style);

    const wrap = document.createElement('div');
    wrap.innerHTML = `<section id="${ROOT}" aria-label="İl odak çalışma bağlantısı">
      <div class="pf-head"><div><div class="pf-k">İL ODAĞI</div><div class="pf-title" data-title>${esc(selected.name)} ile çalış</div></div><div class="pf-badge" data-region>${esc(selected.region)}</div></div>
      <select data-province aria-label="Çalışılacak il seç"><option value="">İl seç...</option>${sorted.map(p => `<option value="${esc(p.name)}">${String(p.plate || '').padStart(2,'0')} · ${esc(p.name)}</option>`).join('')}</select>
      <div class="pf-grid"><div class="pf-fact"><span>İklim</span><b data-climate>${esc(selected.climate)}</b></div><div class="pf-fact"><span>Arazi</span><b data-terrain>${esc(selected.terrain)}</b></div><div class="pf-fact"><span>Tarım</span><b data-agri>${esc(selected.agriculture)}</b></div><div class="pf-fact"><span>Maden</span><b data-mine>${esc(selected.mining)}</b></div></div>
      <div class="pf-note" data-note>${esc(selected.fact || selected.kpss || '')}</div>
      <div class="pf-actions"><button type="button" data-map>🗺 Haritada aç</button><button type="button" class="primary" data-focus>▶ Bu ili çalış</button></div>
    </section>`;
    timer.querySelector('.side')?.appendChild(wrap.firstElementChild);

    const root = document.getElementById(ROOT);
    const select = root.querySelector('[data-province]');
    const setView = (p) => {
      selected = p || selected;
      select.value = selected.name;
      write(selected.name);
      root.querySelector('[data-title]').textContent = `${selected.name} ile çalış`;
      root.querySelector('[data-region]').textContent = selected.region || 'Türkiye';
      root.querySelector('[data-climate]').textContent = selected.climate || '—';
      root.querySelector('[data-terrain]').textContent = selected.terrain || '—';
      root.querySelector('[data-agri]').textContent = selected.agriculture || '—';
      root.querySelector('[data-mine]').textContent = selected.mining || '—';
      root.querySelector('[data-note]').textContent = selected.fact || selected.kpss || 'Bu il için çalışma notu.';
    };
    setView(selected);

    select.addEventListener('change', () => {
      const p = sorted.find(x => x.name === select.value);
      if (p) setView(p);
    });

    root.querySelector('[data-map]').addEventListener('click', () => {
      const nav = document.querySelector('.nav-item[data-view="map"]');
      if (nav) nav.click();
      setTimeout(() => {
        const input = document.getElementById('province-search');
        if (input) { input.value = selected.name; input.dispatchEvent(new Event('input', {bubbles:true})); input.dispatchEvent(new Event('change', {bubbles:true})); input.focus(); }
      }, 250);
    });

    root.querySelector('[data-focus]').addEventListener('click', () => {
      const subject = document.querySelector('#yb-subject');
      if (subject) {
        const wanted = 'Coğrafya';
        if ([...subject.options].some(o => o.value === wanted)) { subject.value = wanted; subject.dispatchEvent(new Event('change', {bubbles:true})); }
      }
      const button = document.querySelector('#yb-pomodoro [data-a="toggle"]');
      if (button && button.textContent.includes('Başlat')) button.click();
      root.querySelector('[data-focus]').textContent = `● ${selected.name} odakta`;
      setTimeout(() => { root.querySelector('[data-focus]').textContent = '▶ Bu ili çalış'; }, 1800);
    });
    return true;
  }

  let tries = 0;
  const wait = () => {
    if (boot()) return;
    if (++tries < 80) setTimeout(wait, 150);
  };
  wait();
})();
