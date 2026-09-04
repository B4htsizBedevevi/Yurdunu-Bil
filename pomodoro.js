/*
 * Yurdunu Bil — Pomodoro Study Timer
 * v1.0.0
 *
 * Local-only study timer. No network requests.
 */
(() => {
  'use strict';

  const ROOT_ID = 'yb-pomodoro';
  const STORAGE_KEY = 'yb_pomodoro_v1';
  const MODES = {
    focus: { label: 'Odak', minutes: 25, hint: 'Telefonu bırak, tek konuya odaklan.' },
    short: { label: 'Kısa Mola', minutes: 5, hint: 'Ayağa kalk, nefes al, gözlerini dinlendir.' },
    long: { label: 'Uzun Mola', minutes: 15, hint: 'Biraz uzaklaş. Sonra daha güçlü dön.' }
  };

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);

  const readState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (_) {
      return {};
    }
  };

  const saveState = (state) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  };

  const clamp = (number, min, max) => Math.min(max, Math.max(min, number));

  const injectStyles = () => {
    if (document.getElementById('yb-pomodoro-style')) return;
    const style = document.createElement('style');
    style.id = 'yb-pomodoro-style';
    style.textContent = `
      #${ROOT_ID}{
        --pom-accent:#6ee7ff;
        --pom-accent-2:#8b5cf6;
        --pom-bg:linear-gradient(135deg,rgba(12,23,40,.98),rgba(8,15,29,.98));
        position:relative; overflow:hidden; margin:14px 0 18px; border:1px solid rgba(148,163,184,.16);
        border-radius:24px; background:var(--pom-bg); box-shadow:0 18px 50px rgba(0,0,0,.22); isolation:isolate;
      }
      #${ROOT_ID}::before,#${ROOT_ID}::after{content:"";position:absolute;border-radius:999px;filter:blur(4px);pointer-events:none;z-index:-1;opacity:.38;}
      #${ROOT_ID}::before{width:180px;height:180px;right:-55px;top:-70px;background:rgba(110,231,255,.18);animation:ybPomFloat 7s ease-in-out infinite;}
      #${ROOT_ID}::after{width:150px;height:150px;left:-65px;bottom:-75px;background:rgba(139,92,246,.16);animation:ybPomFloat 9s ease-in-out infinite reverse;}
      #${ROOT_ID} .pom-inner{padding:20px;position:relative;z-index:1}
      #${ROOT_ID} .pom-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}
      #${ROOT_ID} .pom-kicker{font-size:10px;font-weight:900;letter-spacing:1.5px;color:var(--pom-accent);text-transform:uppercase}
      #${ROOT_ID} .pom-title{font-size:20px;font-weight:900;letter-spacing:-.5px;color:#f8fafc;margin:3px 0 2px}
      #${ROOT_ID} .pom-sub{font-size:11px;color:#94a3b8;line-height:1.45}
      #${ROOT_ID} .pom-session{min-width:84px;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.08);text-align:center}
      #${ROOT_ID} .pom-session b{display:block;font-size:18px;color:#fff;line-height:1}
      #${ROOT_ID} .pom-session span{display:block;font-size:8px;color:#94a3b8;margin-top:4px;text-transform:uppercase;letter-spacing:.7px}
      #${ROOT_ID} .pom-main{display:grid;grid-template-columns:minmax(230px,1fr) minmax(220px,.82fr);gap:18px;align-items:center}
      #${ROOT_ID} .pom-clock-wrap{display:grid;place-items:center;min-height:270px}
      #${ROOT_ID} .pom-clock{width:min(270px,72vw);aspect-ratio:1;position:relative;display:grid;place-items:center}
      #${ROOT_ID} .pom-ring{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg);overflow:visible}
      #${ROOT_ID} .pom-track{fill:none;stroke:rgba(255,255,255,.07);stroke-width:10}
      #${ROOT_ID} .pom-progress{fill:none;stroke:url(#ybPomGradient);stroke-width:10;stroke-linecap:round;transition:stroke-dashoffset .35s ease;filter:drop-shadow(0 0 8px rgba(110,231,255,.35))}
      #${ROOT_ID} .pom-core{width:76%;height:76%;border-radius:50%;display:grid;place-items:center;text-align:center;background:radial-gradient(circle at 35% 25%,rgba(255,255,255,.075),rgba(255,255,255,.018) 45%,rgba(0,0,0,.12));border:1px solid rgba(255,255,255,.08);box-shadow:inset 0 0 30px rgba(255,255,255,.025),0 10px 35px rgba(0,0,0,.18)}
      #${ROOT_ID} .pom-time{font-variant-numeric:tabular-nums;font-size:48px;line-height:1;font-weight:900;letter-spacing:-2px;color:#fff;text-shadow:0 0 24px rgba(110,231,255,.16)}
      #${ROOT_ID} .pom-mode-label{font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--pom-accent);margin-top:7px}
      #${ROOT_ID} .pom-status{font-size:10px;color:#94a3b8;margin-top:4px;min-height:15px}
      #${ROOT_ID} .pom-pulse{position:absolute;inset:5%;border-radius:50%;border:1px solid rgba(110,231,255,.18);opacity:0;pointer-events:none}
      #${ROOT_ID}.is-running .pom-pulse{animation:ybPomPulse 2.4s ease-out infinite}
      #${ROOT_ID}.is-running .pom-core{animation:ybPomBreath 2.4s ease-in-out infinite}
      #${ROOT_ID} .pom-side{display:grid;gap:10px}
      #${ROOT_ID} .pom-panel{padding:12px;border-radius:16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.075)}
      #${ROOT_ID} .pom-panel-label{font-size:9px;font-weight:900;letter-spacing:1px;color:#94a3b8;text-transform:uppercase;margin-bottom:8px}
      #${ROOT_ID} .pom-modes{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
      #${ROOT_ID} button,#${ROOT_ID} select,#${ROOT_ID} input{font:inherit}
      #${ROOT_ID} button{border:0;cursor:pointer;touch-action:manipulation}
      #${ROOT_ID} .pom-mode{min-height:42px;border-radius:10px;color:#94a3b8;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.06);font-size:10px;font-weight:800;transition:transform .18s ease,background .18s ease,border-color .18s ease,color .18s ease}
      #${ROOT_ID} .pom-mode:hover{transform:translateY(-1px)}
      #${ROOT_ID} .pom-mode.active{color:#07111e;background:var(--pom-accent);border-color:var(--pom-accent);box-shadow:0 8px 20px rgba(110,231,255,.16)}
      #${ROOT_ID} .pom-fields{display:grid;grid-template-columns:1.3fr .7fr;gap:7px}
      #${ROOT_ID} .pom-field{min-width:0}
      #${ROOT_ID} .pom-field label{display:block;font-size:9px;color:#94a3b8;margin-bottom:5px}
      #${ROOT_ID} .pom-field select,#${ROOT_ID} .pom-field input{width:100%;height:38px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:#101c2d;color:#e5edf6;padding:0 9px;outline:none;font-size:11px}
      #${ROOT_ID} .pom-field input:focus,#${ROOT_ID} .pom-field select:focus{border-color:rgba(110,231,255,.65);box-shadow:0 0 0 3px rgba(110,231,255,.08)}
      #${ROOT_ID} .pom-actions{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px}
      #${ROOT_ID} .pom-btn{min-height:44px;border-radius:11px;background:rgba(255,255,255,.055);color:#dbeafe;border:1px solid rgba(255,255,255,.07);font-size:10px;font-weight:900;transition:transform .18s ease,background .18s ease}
      #${ROOT_ID} .pom-btn:hover{transform:translateY(-1px);background:rgba(255,255,255,.09)}
      #${ROOT_ID} .pom-btn.primary{background:linear-gradient(135deg,var(--pom-accent),#a7f3d0);color:#06111d;border-color:transparent;box-shadow:0 10px 26px rgba(110,231,255,.16)}
      #${ROOT_ID} .pom-hint{font-size:10px;color:#8fa1b5;line-height:1.45;margin-top:8px;text-align:center}
      #${ROOT_ID} .pom-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
      #${ROOT_ID} .pom-stat{padding:9px;border-radius:11px;background:rgba(0,0,0,.12);text-align:center}
      #${ROOT_ID} .pom-stat b{display:block;color:#f8fafc;font-size:15px}
      #${ROOT_ID} .pom-stat span{font-size:8px;color:#718096;text-transform:uppercase;letter-spacing:.5px}
      #${ROOT_ID} .pom-mini{font-size:9px;color:#64748b;text-align:center;margin-top:10px}
      @keyframes ybPomPulse{0%{transform:scale(.92);opacity:.5}75%,100%{transform:scale(1.06);opacity:0}}
      @keyframes ybPomBreath{0%,100%{box-shadow:inset 0 0 30px rgba(255,255,255,.025),0 10px 35px rgba(0,0,0,.18)}50%{box-shadow:inset 0 0 38px rgba(110,231,255,.07),0 10px 45px rgba(110,231,255,.09)}}
      @keyframes ybPomFloat{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(12px,10px,0)}}
      @media (prefers-reduced-motion:reduce){#${ROOT_ID}::before,#${ROOT_ID}::after,#${ROOT_ID}.is-running .pom-pulse,#${ROOT_ID}.is-running .pom-core{animation:none!important}}
      @media (max-width:760px){
        #${ROOT_ID}{border-radius:18px;margin:12px 0 16px}
        #${ROOT_ID} .pom-inner{padding:15px}
        #${ROOT_ID} .pom-head{margin-bottom:9px}
        #${ROOT_ID} .pom-title{font-size:17px}
        #${ROOT_ID} .pom-main{grid-template-columns:1fr;gap:5px}
        #${ROOT_ID} .pom-clock-wrap{min-height:250px}
        #${ROOT_ID} .pom-clock{width:min(245px,70vw)}
        #${ROOT_ID} .pom-time{font-size:42px}
      }
      @media (max-width:390px){
        #${ROOT_ID} .pom-inner{padding:12px}
        #${ROOT_ID} .pom-session{min-width:70px}
        #${ROOT_ID} .pom-time{font-size:37px}
        #${ROOT_ID} .pom-clock-wrap{min-height:220px}
      }
    `;
    document.head.appendChild(style);
  };

  const createMarkup = () => `
    <section id="${ROOT_ID}" aria-label="Pomodoro ders çalışma sayacı">
      <div class="pom-inner">
        <div class="pom-head">
          <div>
            <div class="pom-kicker">ODAK İSTASYONU</div>
            <div class="pom-title">Ders çalışma zamanı.</div>
            <div class="pom-sub">Pomodoro mantığıyla çalış, molanı ver, ilerlemeni biriktir.</div>
          </div>
          <div class="pom-session"><b data-pom-session>0</b><span>Oturum</span></div>
        </div>
        <div class="pom-main">
          <div class="pom-clock-wrap">
            <div class="pom-clock">
              <svg class="pom-ring" viewBox="0 0 200 200" aria-hidden="true">
                <defs><linearGradient id="ybPomGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6ee7ff"/><stop offset="100%" stop-color="#8b5cf6"/></linearGradient></defs>
                <circle class="pom-track" cx="100" cy="100" r="88"></circle>
                <circle class="pom-progress" cx="100" cy="100" r="88"></circle>
              </svg>
              <div class="pom-pulse"></div>
              <div class="pom-core">
                <div>
                  <div class="pom-time" data-pom-time aria-live="polite">25:00</div>
                  <div class="pom-mode-label" data-pom-mode>ODAK</div>
                  <div class="pom-status" data-pom-status>Hazırsan başla.</div>
                </div>
              </div>
            </div>
          </div>
          <div class="pom-side">
            <div class="pom-panel">
              <div class="pom-panel-label">Mod</div>
              <div class="pom-modes">
                <button type="button" class="pom-mode active" data-mode="focus">25 dk<br>Odak</button>
                <button type="button" class="pom-mode" data-mode="short">5 dk<br>Mola</button>
                <button type="button" class="pom-mode" data-mode="long">15 dk<br>Uzun Mola</button>
              </div>
            </div>
            <div class="pom-panel">
              <div class="pom-panel-label">Bugünkü çalışma</div>
              <div class="pom-fields">
                <div class="pom-field"><label for="yb-pom-subject">Ders / Konu</label><select id="yb-pom-subject" data-pom-subject>
                  <option>Coğrafya</option><option>Türkçe</option><option>Matematik</option><option>Tarih</option><option>Vatandaşlık</option><option>Genel Tekrar</option>
                </select></div>
                <div class="pom-field"><label for="yb-pom-goal">Hedef</label><input id="yb-pom-goal" data-pom-goal type="number" min="1" max="20" step="1" value="4" inputmode="numeric"></div>
              </div>
            </div>
            <div class="pom-actions">
              <button type="button" class="pom-btn" data-action="reset">↺ Sıfırla</button>
              <button type="button" class="pom-btn" data-action="skip">→ Geç</button>
              <button type="button" class="pom-btn primary" data-action="toggle">▶ Başlat</button>
            </div>
            <div class="pom-hint" data-pom-hint>Telefonu sessize al. Tek hedef, tek oturum.</div>
            <div class="pom-stats">
              <div class="pom-stat"><b data-pom-today>0</b><span>Bugün dk</span></div>
              <div class="pom-stat"><b data-pom-completed>0</b><span>Tamamlanan</span></div>
              <div class="pom-stat"><b data-pom-streak>0</b><span>Seri</span></div>
            </div>
          </div>
        </div>
        <div class="pom-mini">Sayaç bu cihazda saklanır · Sayfayı kapatsan bile ilerlemen korunur.</div>
      </div>
    </section>`;

  const mount = () => {
    if (document.getElementById(ROOT_ID)) return document.getElementById(ROOT_ID);
    const view = document.getElementById('view-dashboard');
    if (!view) return null;
    const anchor = view.querySelector('.welcome-row') || view.firstElementChild;
    if (!anchor) return null;
    anchor.insertAdjacentHTML('afterend', createMarkup());
    return document.getElementById(ROOT_ID);
  };

  const init = () => {
    const root = mount();
    if (!root || root.dataset.ready === '1') return;
    root.dataset.ready = '1';
    injectStyles();

    const progress = root.querySelector('.pom-progress');
    const radius = 88;
    const circumference = 2 * Math.PI * radius;
    progress.style.strokeDasharray = String(circumference);

    const saved = readState();
    let mode = MODES[saved.mode] ? saved.mode : 'focus';
    let duration = clamp(Number(saved.duration) || MODES[mode].minutes, 1, 180) * 60;
    let remaining = clamp(Number(saved.remaining), 0, duration);
    if (!Number.isFinite(Number(saved.remaining)) || saved.remaining === undefined) remaining = duration;
    let running = false;
    let lastTick = 0;
    let timerId = null;
    let completed = clamp(Number(saved.completed) || 0, 0, 9999);
    let todayMinutes = clamp(Number(saved.todayMinutes) || 0, 0, 999999);
    let streak = clamp(Number(saved.streak) || 0, 0, 9999);
    let lastDay = saved.lastDay || '';
    let subject = saved.subject || 'Coğrafya';
    let goal = clamp(Number(saved.goal) || 4, 1, 20);

    const todayKey = () => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    };
    const yesterdayKey = () => {
      const d = new Date(); d.setDate(d.getDate() - 1);
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    };
    const refreshDay = () => {
      const today = todayKey();
      if (lastDay === today) return;
      if (lastDay === yesterdayKey()) streak = streak;
      else if (lastDay) streak = 0;
      todayMinutes = 0;
      lastDay = today;
      save();
    };
    const save = () => saveState({ mode, duration, remaining, completed, todayMinutes, streak, lastDay, subject, goal });

    const els = {
      time: root.querySelector('[data-pom-time]'), mode: root.querySelector('[data-pom-mode]'), status: root.querySelector('[data-pom-status]'),
      session: root.querySelector('[data-pom-session]'), today: root.querySelector('[data-pom-today]'), completed: root.querySelector('[data-pom-completed]'), streak: root.querySelector('[data-pom-streak]'),
      hint: root.querySelector('[data-pom-hint]'), toggle: root.querySelector('[data-action="toggle"]'), subject: root.querySelector('[data-pom-subject]'), goal: root.querySelector('[data-pom-goal]')
    };
    els.subject.value = [...els.subject.options].some(o => o.value === subject) ? subject : 'Coğrafya';
    els.goal.value = String(goal);

    const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(Math.floor(seconds % 60)).padStart(2,'0')}`;
    const notify = (message) => {
      els.status.textContent = message;
      if ('vibrate' in navigator) { try { navigator.vibrate([120, 60, 120]); } catch (_) {} }
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        const now = ctx.currentTime;
        [0, .18, .36].forEach((offset, index) => {
          const osc = ctx.createOscillator(); const gain = ctx.createGain();
          osc.frequency.value = [660, 880, 1046][index]; osc.type = 'sine';
          gain.gain.setValueAtTime(.0001, now + offset); gain.gain.exponentialRampToValueAtTime(.13, now + offset + .02); gain.gain.exponentialRampToValueAtTime(.0001, now + offset + .16);
          osc.connect(gain); gain.connect(ctx.destination); osc.start(now + offset); osc.stop(now + offset + .17);
        });
        setTimeout(() => ctx.close().catch(() => {}), 900);
      } catch (_) {}
    };

    const render = () => {
      const ratio = duration > 0 ? remaining / duration : 0;
      progress.style.strokeDashoffset = String(circumference * (1 - ratio));
      els.time.textContent = formatTime(Math.max(0, remaining));
      els.mode.textContent = MODES[mode].label.toUpperCase();
      els.session.textContent = String(completed);
      els.today.textContent = String(Math.round(todayMinutes));
      els.completed.textContent = String(completed);
      els.streak.textContent = String(streak);
      els.hint.textContent = MODES[mode].hint;
      root.classList.toggle('is-running', running);
      els.toggle.textContent = running ? 'Ⅱ Duraklat' : '▶ Başlat';
      root.querySelectorAll('.pom-mode').forEach((button) => button.classList.toggle('active', button.dataset.mode === mode));
      document.title = running ? `${formatTime(remaining)} · ${MODES[mode].label} · Yurdunu Bil` : 'Yurdunu Bil — KPSS Coğrafya Atlası';
    };

    const finish = () => {
      running = false;
      if (mode === 'focus') {
        completed += 1;
        todayMinutes += duration / 60;
        const today = todayKey();
        if (lastDay !== today) { streak = lastDay === yesterdayKey() ? streak + 1 : 1; lastDay = today; }
        else if (streak < 1) streak = 1;
      }
      save();
      notify(mode === 'focus' ? `Odak tamamlandı! ${subject} için bir oturum daha.` : 'Mola bitti. Hazırsan devam edebilirsin.');
      if (mode === 'focus') setMode('short', false);
      else setMode('focus', false);
      render();
    };

    const tick = (now) => {
      if (!running) return;
      if (!lastTick) lastTick = now;
      const elapsed = Math.floor((now - lastTick) / 1000);
      if (elapsed > 0) {
        remaining = Math.max(0, remaining - elapsed);
        lastTick += elapsed * 1000;
        if (remaining <= 0) { finish(); return; }
        render();
        save();
      }
      timerId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (remaining <= 0) remaining = duration;
      running = true; lastTick = 0;
      els.status.textContent = `${subject} · odak devam ediyor…`;
      render();
      cancelAnimationFrame(timerId); timerId = requestAnimationFrame(tick);
    };
    const pause = () => { running = false; cancelAnimationFrame(timerId); save(); els.status.textContent = 'Duraklatıldı. Kaldığın yerden devam edebilirsin.'; render(); };
    const toggle = () => running ? pause() : start();
    const reset = () => { running = false; cancelAnimationFrame(timerId); remaining = duration; lastTick = 0; save(); els.status.textContent = 'Hazırsan başla.'; render(); };
    function setMode(nextMode, autoStart) {
      if (!MODES[nextMode]) return;
      running = false; cancelAnimationFrame(timerId); mode = nextMode; duration = MODES[mode].minutes * 60; remaining = duration; lastTick = 0; save(); render();
      if (autoStart) start();
    }

    refreshDay();
    root.querySelectorAll('.pom-mode').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode, false)));
    root.querySelector('[data-action="toggle"]').addEventListener('click', toggle);
    root.querySelector('[data-action="reset"]').addEventListener('click', reset);
    root.querySelector('[data-action="skip"]').addEventListener('click', () => setMode(mode === 'focus' ? 'short' : 'focus', false));
    els.subject.addEventListener('change', () => { subject = els.subject.value; save(); if (running) els.status.textContent = `${subject} · odak devam ediyor…`; });
    els.goal.addEventListener('change', () => { goal = clamp(Number(els.goal.value) || 4, 1, 20); els.goal.value = String(goal); save(); });
    document.addEventListener('visibilitychange', () => { if (!document.hidden && running) { lastTick = performance.now(); cancelAnimationFrame(timerId); timerId = requestAnimationFrame(tick); } });
    window.addEventListener('beforeunload', save);
    render();
  };

  const boot = () => { if (document.getElementById('view-dashboard')) init(); else setTimeout(boot, 150); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})();
