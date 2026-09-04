/* Yurdunu Bil — v12 Smart Study Center
 * Non-invasive enhancement layer. Reads existing local state and TOPICS data.
 */
(() => {
  'use strict';
  const KEY = 'yurdunubil_v1';
  const GOAL_KEY = 'yurdunubil_daily_goal';
  const $ = s => document.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  function readState() {
    try {
      const raw = localStorage.getItem(KEY) || localStorage.getItem('kpss_atlas_v2');
      return raw ? JSON.parse(raw) : {};
    } catch (_) { return {}; }
  }
  function today() { return new Date().toLocaleDateString('en-CA'); }
  function goal() {
    const n = Number(localStorage.getItem(GOAL_KEY));
    return Number.isFinite(n) && n >= 5 && n <= 200 ? n : 20;
  }
  function getResults(s) { return Array.isArray(s.results) ? s.results : []; }
  function resultTotal(r) { return Number(r?.total ?? r?.questionCount ?? r?.count ?? 0) || 0; }
  function resultCorrect(r) { return Number(r?.correct ?? r?.right ?? 0) || 0; }
  function resultDate(r) { return String(r?.date ?? r?.created_at ?? r?.createdAt ?? '').slice(0,10); }
  function todaySolved(results) { return results.reduce((n,r) => n + (resultDate(r) === today() ? resultTotal(r) : 0), 0); }
  function allSolved(results) { return results.reduce((n,r) => n + resultTotal(r), 0); }

  function topicRows(s) {
    const pct = s.topicPct && typeof s.topicPct === 'object' ? s.topicPct : {};
    const topics = Array.isArray(window.TOPICS) ? window.TOPICS : [];
    const rows = Object.entries(pct).map(([id, value]) => {
      const t = topics.find(x => String(x.id ?? x.key ?? x.slug ?? x.name) === String(id));
      return { id, name: t?.name || t?.title || id, pct: Math.max(0, Math.min(100, Number(value) || 0)) };
    });
    return rows.sort((a,b) => a.pct - b.pct).slice(0,3);
  }

  function ensureStyle() {
    if ($('#v12-style')) return;
    const st = document.createElement('style'); st.id='v12-style';
    st.textContent = `
      .v12-center{margin-top:16px;padding:20px;border:1px solid rgba(255,255,255,.08);border-radius:20px;background:linear-gradient(135deg,rgba(17,34,52,.96),rgba(8,20,33,.96));box-shadow:0 14px 40px rgba(0,0,0,.18)}
      .v12-head{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:16px}.v12-kicker{font-size:10px;letter-spacing:.14em;font-weight:800;opacity:.62}.v12-title{margin:3px 0 0;font-size:20px;font-weight:850}.v12-sub{font-size:12px;opacity:.68;margin-top:4px}
      .v12-grid{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:12px}.v12-card{min-width:0;padding:15px;border-radius:15px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.06)}.v12-card h4{margin:0 0 10px;font-size:13px}.v12-big{font-size:28px;font-weight:900;line-height:1}.v12-muted{font-size:11px;opacity:.62}.v12-bar{height:7px;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden;margin:12px 0 8px}.v12-bar i{display:block;height:100%;border-radius:inherit;background:var(--accent,#55d6a3);width:0;transition:width .5s ease}.v12-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.v12-btn{border:0;border-radius:10px;padding:9px 12px;font:inherit;font-size:11px;font-weight:800;cursor:pointer;background:rgba(255,255,255,.08);color:inherit}.v12-btn.primary{background:var(--accent,#55d6a3);color:#041018}.v12-topic{display:flex;justify-content:space-between;gap:10px;font-size:11px;margin:8px 0}.v12-topic b{white-space:nowrap}.v12-empty{font-size:11px;opacity:.6}
      @media(max-width:760px){.v12-center{padding:15px;border-radius:16px}.v12-head{align-items:flex-start}.v12-grid{grid-template-columns:1fr}.v12-title{font-size:17px}.v12-big{font-size:25px}}
    `;
    document.head.appendChild(st);
  }

  function render() {
    const dash = $('#view-dashboard');
    if (!dash || !dash.classList.contains('active')) return;
    const anchor = dash.querySelector('.topic-progress-panel') || dash.querySelector('.content-grid');
    if (!anchor || $('.v12-center')) return;
    ensureStyle();
    const s=readState(), results=getResults(s), g=goal(), done=todaySolved(results), pct=Math.min(100,Math.round(done/g*100));
    const weak=topicRows(s);
    const streak=Array.isArray(s.streak) ? s.streak.length : Number(s.streak)||0;
    const box=document.createElement('section'); box.className='v12-center';
    box.innerHTML=`<div class="v12-head"><div><div class="v12-kicker">V12 • AKILLI ÇALIŞMA MERKEZİ</div><div class="v12-title">Bugünkü çalışmanı tek ekrandan yönet.</div><div class="v12-sub">Hedefini tamamla, zayıf konularına dön, serini koru.</div></div><button class="v12-btn" id="v12-goal">Hedefi değiştir</button></div><div class="v12-grid"><div class="v12-card"><h4>🎯 Günlük hedef</h4><div><span class="v12-big">${done}</span> <span class="v12-muted">/ ${g} soru</span></div><div class="v12-bar"><i style="width:${pct}%"></i></div><div class="v12-muted">${pct>=100?'Bugünkü hedef tamamlandı! 🔥':`${g-done} soru daha çözersen hedef tamam.`}</div><div class="v12-actions"><button class="v12-btn primary" id="v12-add">+ Soru çözdüm</button></div></div><div class="v12-card"><h4>🧠 Zayıf konular</h4>${weak.length?weak.map(x=>`<div class="v12-topic"><span>${esc(x.name)}</span><b>%${x.pct}</b></div>`).join(''):'<div class="v12-empty">Henüz yeterli konu verisi yok. Test çözdükçe burada otomatik oluşacak.</div>'}<div class="v12-actions"><button class="v12-btn" data-view="topics" id="v12-topics">Konulara git →</button></div></div><div class="v12-card"><h4>🔥 Çalışma serisi</h4><div class="v12-big">${streak}</div><div class="v12-muted">günlük seri</div><div class="v12-actions"><button class="v12-btn" id="v12-refresh">Veriyi yenile</button></div></div></div>`;
    anchor.parentNode.insertBefore(box,anchor);
    $('#v12-goal').onclick=()=>{const v=prompt('Günlük soru hedefin kaç olsun? (5–200)',String(g));if(v!==null){const n=Math.round(Number(v));if(n>=5&&n<=200){localStorage.setItem(GOAL_KEY,String(n));box.remove();render();}}};
    $('#v12-add').onclick=()=>{const n=Number(prompt('Bugün kaç soru çözdün?','5'));if(Number.isFinite(n)&&n>0){const key='yurdunubil_v12_today_extra';const d=Number(localStorage.getItem(key)||0)+Math.round(n);localStorage.setItem(key,String(d));box.remove();render();}};
    $('#v12-refresh').onclick=()=>{box.remove();setTimeout(render,0)};
    $('#v12-topics').onclick=()=>{const b=document.querySelector('[data-view="topics"]');if(b)b.click();};
  }
  function start(){let tries=0;const tick=()=>{tries++;try{render();}catch(e){console.warn('V12 merkez hatası',e)}if(tries<30)setTimeout(tick,500)};tick();new MutationObserver(()=>{if(!$('.v12-center'))render()}).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
