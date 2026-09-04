/* Yurdunu Bil — Animated Pomodoro v1.0.1 */
(() => {
  'use strict';
  const ID='yb-pomodoro', KEY='yb_pomodoro_v2';
  const MODES={
    focus:{label:'Odak',seconds:25*60,hint:'Tek konu. Tek hedef. Telefonu bırak.'},
    short:{label:'Kısa Mola',seconds:5*60,hint:'Ayağa kalk, nefes al, gözlerini dinlendir.'},
    long:{label:'Uzun Mola',seconds:15*60,hint:'Biraz uzaklaş. Sonra daha güçlü dön.'}
  };
  const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_){return{}}};
  const write=s=>{try{localStorage.setItem(KEY,JSON.stringify(s))}catch(_){}};
  const day=offset=>{const d=new Date();d.setDate(d.getDate()+offset);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};

  function styles(){
    if(document.getElementById(ID+'-css'))return;
    const s=document.createElement('style');s.id=ID+'-css';s.textContent=`
      #${ID}{--a:#6ee7ff;--b:#8b5cf6;position:relative;overflow:hidden;margin:14px 0 18px;border:1px solid rgba(148,163,184,.16);border-radius:24px;background:linear-gradient(135deg,rgba(12,23,40,.98),rgba(7,14,28,.99));box-shadow:0 18px 55px rgba(0,0,0,.24);isolation:isolate}
      #${ID}:before,#${ID}:after{content:"";position:absolute;border-radius:50%;pointer-events:none;z-index:-1;filter:blur(3px)}
      #${ID}:before{width:220px;height:220px;right:-90px;top:-100px;background:rgba(110,231,255,.12);animation:ybpf 8s ease-in-out infinite}
      #${ID}:after{width:180px;height:180px;left:-90px;bottom:-100px;background:rgba(139,92,246,.12);animation:ybpf 10s ease-in-out infinite reverse}
      #${ID} .pi{padding:20px}.ph{display:flex;justify-content:space-between;gap:12px;margin-bottom:10px}.pk{font-size:9px;font-weight:900;letter-spacing:1.5px;color:var(--a)}.pt{font-size:20px;font-weight:900;color:#f8fafc;letter-spacing:-.5px;margin:3px 0}.ps{font-size:11px;color:#8fa1b5}.pcnt{min-width:70px;padding:8px 10px;text-align:center;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.04)}.pcnt b{display:block;color:#fff;font-size:18px}.pcnt span{font-size:7px;color:#718096;text-transform:uppercase;letter-spacing:.7px}
      #${ID} .grid{display:grid;grid-template-columns:minmax(250px,1fr) minmax(230px,.85fr);gap:18px;align-items:center}.clock{width:min(275px,72vw);aspect-ratio:1;margin:auto;position:relative;display:grid;place-items:center}.ring{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}.track,.prog{fill:none;stroke-width:10}.track{stroke:rgba(255,255,255,.07)}.prog{stroke:url(#ybpg);stroke-linecap:round;transition:stroke-dashoffset .3s ease;filter:drop-shadow(0 0 9px rgba(110,231,255,.3))}.core{width:76%;height:76%;border-radius:50%;display:grid;place-items:center;text-align:center;background:radial-gradient(circle at 35% 25%,rgba(255,255,255,.075),rgba(255,255,255,.015) 48%,rgba(0,0,0,.18));border:1px solid rgba(255,255,255,.08);box-shadow:inset 0 0 32px rgba(255,255,255,.025),0 12px 40px rgba(0,0,0,.2)}.time{font-variant-numeric:tabular-nums;font-size:48px;font-weight:900;letter-spacing:-2px;line-height:1;color:#fff}.mode-label{margin-top:7px;font-size:9px;font-weight:900;letter-spacing:1px;color:var(--a);text-transform:uppercase}.status{font-size:9px;color:#8fa1b5;margin-top:5px;min-height:14px}.pulse{position:absolute;inset:5%;border:1px solid rgba(110,231,255,.2);border-radius:50%;opacity:0}.running .pulse{animation:ybpp 2.4s ease-out infinite}.running .core{animation:ybpb 2.4s ease-in-out infinite}
      #${ID} .side{display:grid;gap:9px}.panel{padding:11px;border-radius:15px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07)}.label{font-size:8px;font-weight:900;letter-spacing:1px;color:#94a3b8;text-transform:uppercase;margin-bottom:7px}.modes{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.mode,.btn{min-height:42px;border-radius:10px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.045);color:#94a3b8;font:inherit;font-size:9px;font-weight:900;cursor:pointer;touch-action:manipulation;transition:.18s ease}.mode.active{background:var(--a);border-color:var(--a);color:#06111d;box-shadow:0 8px 22px rgba(110,231,255,.14)}.mode:hover,.btn:hover{transform:translateY(-1px);background:rgba(255,255,255,.08)}.fields{display:grid;grid-template-columns:1.4fr .7fr;gap:7px}.field label{display:block;font-size:8px;color:#94a3b8;margin-bottom:5px}.field select,.field input{width:100%;height:37px;box-sizing:border-box;border-radius:9px;border:1px solid rgba(255,255,255,.08);background:#101c2d;color:#e5edf6;padding:0 8px;font-size:10px;outline:none}.field select:focus,.field input:focus{border-color:rgba(110,231,255,.65);box-shadow:0 0 0 3px rgba(110,231,255,.07)}.actions{display:grid;grid-template-columns:1fr 1fr 1.2fr;gap:6px}.btn{min-height:44px;color:#dbeafe}.btn.primary{background:linear-gradient(135deg,var(--a),#a7f3d0);border-color:transparent;color:#06111d;box-shadow:0 10px 26px rgba(110,231,255,.15)}.hint{text-align:center;font-size:9px;color:#8293a8;line-height:1.4}.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.stat{text-align:center;padding:8px;border-radius:10px;background:rgba(0,0,0,.12)}.stat b{display:block;color:#fff;font-size:14px}.stat span{font-size:7px;color:#64748b;text-transform:uppercase;letter-spacing:.4px}.mini{text-align:center;color:#596b80;font-size:8px;margin-top:9px}
      @keyframes ybpp{0%{transform:scale(.92);opacity:.5}75%,100%{transform:scale(1.07);opacity:0}}@keyframes ybpb{0%,100%{box-shadow:inset 0 0 32px rgba(255,255,255,.025),0 12px 40px rgba(0,0,0,.2)}50%{box-shadow:inset 0 0 42px rgba(110,231,255,.07),0 12px 48px rgba(110,231,255,.09)}}@keyframes ybpf{0%,100%{transform:translate(0,0)}50%{transform:translate(12px,10px)}}
      @media(max-width:760px){#${ID}{border-radius:18px}.pi{padding:15px}.pt{font-size:17px}.grid{grid-template-columns:1fr;gap:3px}.clock{width:min(245px,70vw)}.time{font-size:42px}}
      @media(max-width:390px){.pi{padding:12px}.time{font-size:37px}.pcnt{min-width:60px}.fields{grid-template-columns:1fr 70px}}
      @media(prefers-reduced-motion:reduce){#${ID}:before,#${ID}:after,.running .pulse,.running .core{animation:none!important}}
    `;document.head.appendChild(s);
  }

  const markup=()=>`<section id="${ID}" aria-label="Pomodoro ders çalışma sayacı"><div class="pi"><div class="ph"><div><div class="pk">ODAK İSTASYONU</div><div class="pt">Ders çalışma zamanı.</div><div class="ps">Pomodoro mantığıyla çalış, molanı ver, ilerlemeni biriktir.</div></div><div class="pcnt"><b data-c>0</b><span>Oturum</span></div></div><div class="grid"><div><div class="clock"><svg class="ring" viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="ybpg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6ee7ff"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs><circle class="track" cx="100" cy="100" r="88"/><circle class="prog" cx="100" cy="100" r="88" data-p/></svg><div class="pulse"></div><div class="core"><div><div class="time" data-t aria-live="polite">25:00</div><div class="mode-label" data-m>ODAK</div><div class="status" data-s>Hazırsan başla.</div></div></div></div></div><div class="side"><div class="panel"><div class="label">Mod</div><div class="modes"><button type="button" class="mode active" data-mode="focus">25 dk<br>Odak</button><button type="button" class="mode" data-mode="short">5 dk<br>Mola</button><button type="button" class="mode" data-mode="long">15 dk<br>Uzun Mola</button></div></div><div class="panel"><div class="label">Bugünkü çalışma</div><div class="fields"><div class="field"><label for="yb-subject">Ders / Konu</label><select id="yb-subject" data-sub><option>Coğrafya</option><option>Türkçe</option><option>Matematik</option><option>Tarih</option><option>Vatandaşlık</option><option>Genel Tekrar</option></select></div><div class="field"><label for="yb-goal">Hedef</label><input id="yb-goal" data-goal type="number" min="1" max="20" value="4" inputmode="numeric"></div></div></div><div class="actions"><button type="button" class="btn" data-a="reset">↺ Sıfırla</button><button type="button" class="btn" data-a="skip">→ Geç</button><button type="button" class="btn primary" data-a="toggle">▶ Başlat</button></div><div class="hint" data-h>Tek hedef, tek oturum.</div><div class="stats"><div class="stat"><b data-today>0</b><span>Bugün dk</span></div><div class="stat"><b data-done>0</b><span>Tamamlanan</span></div><div class="stat"><b data-streak>0</b><span>Gün serisi</span></div></div></div></div><div class="mini">İlerleme bu cihazda saklanır · Sayfayı yenilesen de oturumların korunur.</div></div></section>`;

  function init(){
    if(document.getElementById(ID))return;
    const view=document.getElementById('view-dashboard');if(!view)return;
    const anchor=view.querySelector('.welcome-row')||view.firstElementChild;if(!anchor)return;
    anchor.insertAdjacentHTML('afterend',markup());
    styles();
    const root=document.getElementById(ID), saved=read();
    let mode=MODES[saved.mode]?saved.mode:'focus';
    let duration=clamp(Number(saved.duration)||MODES[mode].seconds,60,180*60);
    let remaining=clamp(Number(saved.remaining),0,duration);if(!Number.isFinite(Number(saved.remaining)))remaining=duration;
    let running=false, raf=0, last=0, done=clamp(Number(saved.done)||0,0,99999), today=clamp(Number(saved.today)||0,0,999999), streak=clamp(Number(saved.streak)||0,0,99999), lastDay=saved.lastDay||'', subject=saved.subject||'Coğrafya';
    const q=s=>root.querySelector(s), p=q('[data-p]'), C=2*Math.PI*88; p.style.strokeDasharray=C;
    const els={t:q('[data-t]'),m:q('[data-m]'),s:q('[data-s]'),c:q('[data-c]'),td:q('[data-today]'),d:q('[data-done]'),st:q('[data-streak]'),h:q('[data-h]'),sub:q('[data-sub]'),goal:q('[data-goal]'),toggle:q('[data-a="toggle"]')};
    if([...els.sub.options].some(o=>o.value===subject))els.sub.value=subject;
    els.goal.value=String(clamp(Number(saved.goal)||4,1,20));
    const save=()=>write({mode,duration,remaining,done,today,streak,lastDay,subject,goal:Number(els.goal.value)||4});
    if(lastDay&&lastDay!==day(0)){today=0;if(lastDay!==day(-1))streak=0;lastDay=day(0);save()}else if(!lastDay){lastDay=day(0);save()}
    const fmt=x=>`${String(Math.floor(x/60)).padStart(2,'0')}:${String(Math.floor(x%60)).padStart(2,'0')}`;
    const beep=()=>{try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const c=new A(),n=c.currentTime;[0,.18,.36].forEach((o,i)=>{const x=c.createOscillator(),g=c.createGain();x.frequency.value=[660,880,1046][i];g.gain.setValueAtTime(.0001,n+o);g.gain.exponentialRampToValueAtTime(.12,n+o+.02);g.gain.exponentialRampToValueAtTime(.0001,n+o+.16);x.connect(g);g.connect(c.destination);x.start(n+o);x.stop(n+o+.17)});setTimeout(()=>c.close().catch(()=>{}),900)}catch(_){}};
    const render=()=>{p.style.strokeDashoffset=C*(1-(duration?remaining/duration:0));els.t.textContent=fmt(Math.max(0,remaining));els.m.textContent=MODES[mode].label.toUpperCase();els.c.textContent=done;els.td.textContent=Math.round(today);els.d.textContent=done;els.st.textContent=streak;els.h.textContent=running?`${subject} · odak devam ediyor…`:MODES[mode].hint;els.toggle.textContent=running?'Ⅱ Duraklat':'▶ Başlat';root.classList.toggle('running',running);root.querySelectorAll('.mode').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));document.title=running?`${fmt(remaining)} · ${MODES[mode].label} · Yurdunu Bil`:'Yurdunu Bil — KPSS Coğrafya Atlası'};
    const finish=()=>{running=false;if(mode==='focus'){done++;today+=duration/60;const d=day(0);if(lastDay!==d){streak=lastDay===day(-1)?streak+1:1;lastDay=d}else if(streak<1)streak=1;beep();try{navigator.vibrate&&navigator.vibrate([120,60,120])}catch(_){}}save();els.s.textContent=mode==='focus'?'Odak tamamlandı! Kısa bir mola zamanı.':'Mola bitti. Hazırsan devam edebilirsin.';mode=mode==='focus'?'short':'focus';duration=MODES[mode].seconds;remaining=duration;save();render()};
    const tick=now=>{if(!running)return;if(!last)last=now;const e=Math.floor((now-last)/1000);if(e>0){remaining=Math.max(0,remaining-e);last+=e*1000;if(remaining<=0){finish();return}render();save()}raf=requestAnimationFrame(tick)};
    const start=()=>{if(remaining<=0)remaining=duration;running=true;last=0;els.s.textContent=`${subject} · odak başladı.`;cancelAnimationFrame(raf);raf=requestAnimationFrame(tick);render()};
    const pause=()=>{running=false;cancelAnimationFrame(raf);save();els.s.textContent='Duraklatıldı. Kaldığın yerden devam edebilirsin.';render()};
    const setMode=x=>{if(!MODES[x])return;running=false;cancelAnimationFrame(raf);mode=x;duration=MODES[x].seconds;remaining=duration;last=0;save();render()};
    root.querySelectorAll('.mode').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
    els.toggle.addEventListener('click',()=>running?pause():start());
    q('[data-a="reset"]').addEventListener('click',()=>{running=false;cancelAnimationFrame(raf);remaining=duration;last=0;save();els.s.textContent='Hazırsan başla.';render()});
    q('[data-a="skip"]').addEventListener('click',()=>setMode(mode==='focus'?'short':'focus'));
    els.sub.addEventListener('change',()=>{subject=els.sub.value;save();render()});
    els.goal.addEventListener('change',()=>{els.goal.value=String(clamp(Number(els.goal.value)||4,1,20));save()});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden&&running){last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(tick)}});
    window.addEventListener('beforeunload',save);render();
  }
  const boot=()=>{if(document.getElementById('view-dashboard'))init();else setTimeout(boot,200)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
