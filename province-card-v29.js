/* Yurdunu Bil — Province Cards v29
 * Uses only fields already present in PROVINCE_DATA plus calculated ratios.
 * No new geographic claim is invented here.
 */
(() => {
  'use strict';

  const POP = window.POPULATION_2025 || {};
  const AREAS = window.PROVINCE_AREAS || {};
  const DATA = Array.isArray(window.PROVINCE_DATA) ? window.PROVINCE_DATA : [];
  const TOTAL = 86092168;
  const $ = (s, r=document) => r.querySelector(s);
  const norm = v => String(v || '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c').trim();
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function findProvince(name) {
    const n = norm(name);
    return DATA.find(p => norm(p.name) === n) || null;
  }

  function clean(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function density(pop, area) {
    const n = Number(String(pop || '').replace(/\./g, '').replace(/,/g, ''));
    const a = Number(area || 0);
    if (!n || !a) return null;
    return Math.round(n / a);
  }

  function compact(value, max=82) {
    const text = clean(value);
    if (text.length <= max) return text;
    return `${text.slice(0, max - 1).trimEnd()}…`;
  }

  function tokens(p) {
    const values = [p.climate, p.plains, p.rivers, p.agriculture, p.mining]
      .map(clean)
      .filter(Boolean);

    return values
      .join(' • ')
      .split('•')
      .map(x => x.trim())
      .filter(Boolean)
      .slice(0, 5);
  }

  function buildExtra(p) {
    const population = POP[p.name] || p.population;
    const area = AREAS[p.name];
    const dens = density(population, area);
    const share = Number(String(population || '').replace(/\./g, '').replace(/,/g, ''));
    const nationalShare = share ? ((share / TOTAL) * 100).toFixed(2).replace('.', ',') : null;
    const keywords = tokens(p);

    return `
      <div class="province-extra-v29">
        <div class="province-extra-head">
          <div>
            <span>🧭 İLİ 3 SATIRDA OKU</span>
            <p>${esc(p.region || '')} • ${esc(clean(p.climate) || 'Coğrafi özellikleriyle çalış')}</p>
          </div>
          <span class="province-extra-badge">KPSS</span>
        </div>

        <div class="province-extra-grid">
          <article>
            <small>📊 NÜFUS YOĞUNLUĞU</small>
            <b>${dens ? `${dens.toLocaleString('tr-TR')} kişi/km²` : 'Veri hesaplanamadı'}</b>
            ${nationalShare ? `<span>Türkiye nüfusunun yaklaşık %${nationalShare}’i</span>` : ''}
          </article>

          <article>
            <small>📌 HARİTA ANAHTARLARI</small>
            <div class="province-keywords">
              ${keywords.map(x => `<span>${esc(compact(x, 54))}</span>`).join('') || '<span>İl bilgileri mevcut</span>'}
            </div>
          </article>
        </div>

        <div class="province-memory-row">
          <span>🧠 HIZLI EŞLEŞTİR</span>
          <p>
            <b>${esc(p.name)}</b>
            → ${esc(compact(p.agriculture || p.mining || p.fact || '', 110))}
          </p>
        </div>
      </div>
    `;
  }

  function enhance(panel) {
    const title = panel.querySelector('.province-top h2');
    if (!title) return;

    if (panel.querySelector('.province-extra-v29')) return;

    const p = findProvince(title.textContent);
    if (!p) return;

    const actions = panel.querySelector('.province-actions');
    if (!actions) return;

    actions.insertAdjacentHTML('beforebegin', buildExtra(p));
  }

  let timer = null;
  function scan() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      document.querySelectorAll('.province-panel').forEach(enhance);
    }, 40);
  }

  const observer = new MutationObserver(scan);

  function start() {
    scan();
    observer.observe(document.body, {
      subtree:true,
      childList:true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once:true });
  } else {
    start();
  }
})();
