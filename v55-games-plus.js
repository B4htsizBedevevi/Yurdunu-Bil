/* Yurdunu Bil 55+ — genişletilmiş oyun motoru (9 mod) */
(()=>{
'use strict';
if(window.__YB55_GAMES__)return;
window.__YB55_GAMES__=true;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='yb55_game_state_v1';
const RECENT='yb55_recent_questions_v1';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=(fn,f)=>{try{return fn()}catch{return f}};
const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};

const bank=()=>safe(()=>Array.isArray(window.QUESTION_BANK)
  ?window.QUESTION_BANK.filter(q=>q&&q.q&&Array.isArray(q.options)&&q.options.length>=2
    &&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length)
  :[],[]);

function load(k,d){return safe(()=>JSON.parse(localStorage.getItem(k)||'null')??d,d)}
function save(k,v){safe(()=>localStorage.setItem(k,JSON.stringify(v)),null)}
function recent(){return new Set(load(RECENT,[]).slice(-80))}
function remember(ids){const a=load(RECENT,[]);save(RECENT,[...a,...ids].slice(-80))}
function poolFor(topic){const p=bank();return topic?p.filter(q=>String(q.topic||'')===topic):p}

function pickQuestions(count,topic){
  const all=poolFor(topic),seen=recent();
  let fresh=shuffle(all.filter(q=>!seen.has(String(q.id||q.q))));
  if(fresh.length<count)fresh=fresh.concat(shuffle(all.filter(q=>seen.has(String(q.id||q.q)))));
  const used=new Set();
  return fresh.filter(q=>{const k=String(q.id||q.q);if(used.has(k))return false;used.add(k);return true}).slice(0,count);
}

function progressAward(ok,mode){
  const p=load('yb52_progress_v1',{xp:0,answers:0,correct:0,bestStreak:0,streak:0,modes:{},daily:{date:'',answers:0,correct:0}});
  const day=new Date().toLocaleDateString('en-CA',{timeZone:'Europe/Istanbul'});
  p.xp=Number(p.xp||0);p.answers=Number(p.answers||0)+1;
  p.correct=Number(p.correct||0)+(ok?1:0);
  p.streak=ok?Number(p.streak||0)+1:0;
  p.bestStreak=Math.max(Number(p.bestStreak||0),p.streak);
  p.xp+=ok?10+Math.min(25,Math.max(0,(p.streak-1)*2)):2;
  p.modes=p.modes||{};p.modes[mode]=p.modes[mode]||{a:0,c:0};p.modes[mode].a++;if(ok)p.modes[mode].c++;
  p.daily=p.daily||{date:'',answers:0,correct:0};
  if(p.daily.date!==day)p.daily={date:day,answers:0,correct:0};
  p.daily.answers++;if(ok)p.daily.correct++;
  save('yb52_progress_v1',p);
}

function recordResult(mode,correct,total,ids){
  const s=load(KEY,{games:0,answers:0,correct:0});
  s.games++;s.answers+=total;s.correct+=correct;
  save(KEY,s);remember(ids);
}

function host(){return $('#view-events')}

/* ── Oyun kartları (9 mod) ── */
function gameCard(icon,title,text,tag,id,isNew){
  return `<button class="yb55-game-card${isNew?' yb55-game-new':''}" data-yb55-game="${id}" type="button">
    <span class="yb55-game-icon">${icon}</span>
    <span class="yb55-game-tag">${isNew?'🆕 '+tag:tag}</span>
    <b>${title}</b><small>${text}</small>
    <strong>Oyna →</strong>
  </button>`;
}

function gamesPanel(){
  return `<section class="yb55-games-panel">
    <div class="yb55-games-head">
      <div>
        <span class="eyebrow">ETKİLEŞİMLİ OYUNLAR</span>
        <h2>9 farklı oyun modu.</h2>
        <p>Yakın geçmişte gördüğün sorular arkaplanda bekler; her turda farklı sorular gelir.</p>
      </div>
      <div class="yb55-pool-badge">📚 <b>${bank().length}+</b><span>aktif soru</span></div>
    </div>
    <div class="yb55-game-grid">
      ${gameCard('⚡','Bilgi Sprinti','60 saniyede mümkün olduğunca çok doğru yap.','SÜRELİ','sprint')}
      ${gameCard('🎯','10\'da 10','10 KPSS tipi soru. Seri yaptıkça puan yükselir.','KLASİK','ten')}
      ${gameCard('💡','İpucu Avı','Yanlış şıkları elemek için puan karşılığı ipucu kullan.','TAKTİK','hint')}
      ${gameCard('❤️','3 Can','12 soruya kadar ilerle. Hataların üç canını azaltır.','ELEME','lives')}
      ${gameCard('🔥','Seri Ustası','8 soruluk kısa seri; tek yanlış seriyi sıfırlar.','SERİ','streak')}
      ${gameCard('🧭','Bölge Blitz','Bölgeler bilgisini hedefleyen hızlı mini tur.','BÖLGELER','region')}
      ${gameCard('⏰','Geri Sayım','Her doğru cevap süreye +5 sn ekler, yanlış −3 sn.','SÜRE YARIŞI','countdown',true)}
      ${gameCard('🔀','Karışık Seviyeler','Kolay → Orta → Zor sırasıyla ilerleyen 12 soruluk tur.','KADEME','levels',true)}
      ${gameCard('🎲','Rastgele Konu','Her soruda farklı konu — maksimum çeşitlilik.','ÇEŞİTLİ','random',true)}
    </div>
  </section>`;
}

function arenaCard(){
  return `<section class="yb55-arena-restore">
    <div class="yb55-arena-mark">⚔️</div>
    <div class="yb55-arena-copy">
      <span>CANLI REKABET</span>
      <h2>Arena burada.</h2>
      <p>1 VS 1 düello, Klasik • Hız • Bilgi Zinciri, konu seçimi, oda kodu, reyting ve Sosyal Arena.</p>
      <div class="yb55-arena-pills"><b>1 VS 1</b><b>⚡ Hız</b><b>🏆 Reyting</b><b>👥 Sosyal</b><b>📚 Konu Seç</b></div>
    </div>
    <div class="yb55-arena-actions">
      <button class="btn primary" data-yb55-arena>⚔️ Arena\'yı Aç →</button>
      <button class="btn ghost" data-yb55-social>🏆 Sosyal Arena</button>
    </div>
  </section>`;
}

function mount(){
  const v=host();if(!v)return;
  if(v.querySelector('.ybArena')||v.querySelector('.yb55-games-panel')){bind(v);return}
  v.insertAdjacentHTML('afterbegin',arenaCard()+gamesPanel());
  bind(v);
}

function bind(v){
  $$('[data-yb55-game]',v).forEach(b=>{
    if(b.dataset.bound)return;b.dataset.bound='1';
    b.onclick=()=>start(b.dataset.yb55Game);
  });
  const a=$('[data-yb55-arena]',v);
  if(a&&!a.dataset.bound){a.dataset.bound='1';a.onclick=()=>window.YBArena?.open?.()}
  const s=$('[data-yb55-social]',v);
  if(s&&!s.dataset.bound){s.dataset.bound='1';s.onclick=()=>window.YB53Social?.open?.()||window.YBArena?.open?.()}
}

/* ─── MOD TANIMLARI ─── */
let state=null,timer=null;

const MODES={
  sprint:{title:'Bilgi Sprinti',sub:'60 saniye • doğru sayısını maksimuma çıkar',count:20,time:60,points:30},
  ten:   {title:'10\'da 10',sub:'10 soru • seri bonusu',count:10,time:25,points:100},
  hint:  {title:'İpucu Avı',sub:'8 soru • şık eleme ipucunu puanla satın al',count:8,time:30,points:100},
  lives: {title:'3 Can',sub:'12 soru • üç hata hakkın var',count:12,time:20,points:80},
  streak:{title:'Seri Ustası',sub:'8 soru • tek yanlış seriyi sıfırlar',count:8,time:22,points:90},
  region:{title:'Bölge Blitz',sub:'8 soru • Bölgeler & Turizm',count:8,time:20,points:90,topic:'bolgeler'},
  /* YENİ MODLAR */
  countdown:{title:'Geri Sayım',sub:'Doğru +5 sn • Yanlış −3 sn • Başlangıç 30 sn',count:15,time:30,points:80,dynamic:true},
  levels:   {title:'Karışık Seviyeler',sub:'Kolay → Orta → Zor kademeleri',count:12,time:25,points:120,leveled:true},
  random:   {title:'Rastgele Konu',sub:'Her soruda farklı konu — 10 soru',count:10,time:22,points:90}
};

/* ── Seviyeli soru seçimi ── */
function pickLeveledQuestions(count){
  const easy=shuffle(bank().filter(q=>q.difficulty==='kolay')).slice(0,Math.ceil(count/3));
  const medium=shuffle(bank().filter(q=>q.difficulty==='orta')).slice(0,Math.ceil(count/3));
  const hard=shuffle(bank().filter(q=>q.difficulty==='zor')).slice(0,Math.floor(count/3));
  return [...easy,...medium,...hard].slice(0,count);
}

function start(id){
  const m=MODES[id];if(!m)return;
  let qs;
  if(m.leveled)qs=pickLeveledQuestions(m.count);
  else qs=pickQuestions(m.count,m.topic);
  if(!qs.length){showToastFallback('Bu oyun için yeterli soru bulunamadı.');return}
  state={
    id,m,qs,index:0,correct:0,score:0,streak:0,
    lives:id==='lives'?3:undefined,
    usedHint:false,
    countdownTime:id==='countdown'?m.time:undefined,
    sessionIds:qs.map(q=>String(q.id||q.q))
  };
  renderQuestion();
}

function showToastFallback(msg){
  if(typeof window.showToast==='function')window.showToast(msg,'error');
  else alert(msg);
}

function modal(){
  document.querySelector('.yb55-modal')?.remove();
  const x=document.createElement('div');
  x.className='yb55-modal';
  document.body.appendChild(x);
  return x;
}

function difficultyBadge(q){
  if(!q.difficulty)return '';
  const colors={kolay:'#43e1c2',orta:'#f5a623',zor:'#ef7180'};
  const c=colors[q.difficulty]||'#8fa7ba';
  return `<span class="yb55-diff" style="color:${c}">${q.difficulty.toUpperCase()}</span>`;
}

function renderQuestion(){
  const m=state.m,q=state.qs[state.index];
  if(!q){finish();return}
  state.answered=false;state.usedHint=false;
  const opts=shuffle(q.options.map((text,i)=>({text,i})));
  state.opts=opts;
  const x=modal();
  const timeLeft=state.id==='countdown'?(state.countdownTime??m.time):m.time;
  const livesHtml=state.id==='lives'?`<em>❤️ ${state.lives}</em>`:`<em>🔥 ${state.streak}</em>`;
  const hintHtml=state.id==='hint'?'<button class="btn ghost" data-hint>💡 İpucu — 20 puan</button>':'';
  x.innerHTML=`<div class="yb55-game-shell">
    <header>
      <div><span>${esc(m.title)}</span><h2>${esc(m.sub)}</h2></div>
      <button data-close aria-label="Kapat">×</button>
    </header>
    <div class="yb55-game-stats">
      <b>Tur ${state.index+1}/${Math.min(m.count,state.qs.length)}</b>
      <strong>${state.score} puan</strong>
      ${livesHtml}
    </div>
    <article class="yb55-question">
      <div class="yb55-q-meta">
        <span class="yb55-topic-badge">${esc(q.topic||'genel')}</span>
        ${difficultyBadge(q)}
        ${q.subtopic?`<span class="yb55-subtopic">${esc(q.subtopic)}</span>`:''}
      </div>
      <h3>${esc(q.q)}</h3>
      <div class="yb55-options">
        ${opts.map((o,i)=>`<button data-answer="${o.i}" type="button">
          <b>${String.fromCharCode(65+i)}</b>${esc(o.text)}
        </button>`).join('')}
      </div>
      <div class="yb55-tools">
        ${hintHtml}
        <span data-time>⏱ ${timeLeft}s</span>
      </div>
      <div class="yb55-feedback" data-feedback></div>
    </article>
  </div>`;
  x.querySelector('[data-close]').onclick=()=>closeGame();
  $$('[data-answer]',x).forEach(b=>b.onclick=()=>answer(Number(b.dataset.answer)));
  x.querySelector('[data-hint]')?.addEventListener('click',hint);
  startTimer();
}

function resetTimer(){if(timer)clearInterval(timer);timer=null}

function startTimer(){
  resetTimer();
  let left=state.id==='countdown'?(state.countdownTime??state.m.time):state.m.time;
  const e=$('[data-time]');
  if(e)e.textContent='⏱ '+left+'s';
  timer=setInterval(()=>{
    left--;
    if(state.id==='countdown')state.countdownTime=left;
    if(e)e.textContent='⏱ '+Math.max(0,left)+'s';
    if(left<=0){resetTimer();answer(-1,true)}
  },1000);
}

function hint(){
  if(state.answered||state.usedHint)return;
  state.usedHint=true;state.score=Math.max(0,state.score-20);
  const q=state.qs[state.index];
  const wrong=state.opts.filter(o=>o.i!==q.answer);
  const remove=shuffle(wrong).slice(0,Math.max(1,wrong.length>2?2:1));
  remove.forEach(o=>$(`[data-answer="${o.i}"]`)?.setAttribute('disabled','disabled'));
  const b=$('[data-hint]');
  if(b){b.disabled=true;b.textContent='💡 İpucu kullanıldı'}
  const f=$('[data-feedback]');
  if(f)f.textContent=`İpucu: ${remove.length} yanlış seçenek elendi.`;
}

function answer(index,timed=false){
  if(!state||state.answered)return;
  state.answered=true;resetTimer();
  const q=state.qs[state.index];
  const ok=index===q.answer;
  let pts=0;
  if(ok){
    pts=state.m.points+(state.streak*10);
    /* Geri Sayım: doğruda +5 sn */
    if(state.id==='countdown')state.countdownTime=Math.min((state.countdownTime||0)+5,99);
  } else {
    /* Geri Sayım: yanlışta −3 sn */
    if(state.id==='countdown')state.countdownTime=Math.max((state.countdownTime||0)-3,0);
  }
  state.correct+=ok?1:0;
  state.score+=ok?pts:0;
  state.streak=ok?state.streak+1:0;
  if(state.id==='lives'&&!ok)state.lives--;
  progressAward(ok,state.m.title);

  $$('[data-answer]').forEach(b=>{
    b.disabled=true;
    const n=Number(b.dataset.answer);
    if(n===q.answer)b.classList.add('correct');
    if(n===index&&index!==q.answer)b.classList.add('wrong');
  });

  const f=$('[data-feedback]');
  if(f)f.innerHTML=ok
    ?`✓ Doğru! +${pts} puan${q.explain?` <small>${esc(q.explain)}</small>`:''}`
    :`✕ ${timed?'Süre doldu. ':'Yanlış. '}Doğru: <b>${esc(q.options[q.answer])}</b>${q.explain?`<small>${esc(q.explain)}</small>`:''}`;

  const isLast=state.index>=Math.min(state.m.count,state.qs.length)-1
    ||(state.id==='lives'&&state.lives<=0)
    ||(state.id==='countdown'&&(state.countdownTime||0)<=0);

  const btn=document.createElement('button');
  btn.className='btn primary yb55-next';
  btn.textContent=isLast?'Sonuçları Gör':'Devam Et →';
  btn.onclick=()=>{
    if(isLast)finish();
    else{state.index++;renderQuestion()}
  };
  $('.yb55-question')?.appendChild(btn);
}

function finish(){
  resetTimer();
  const total=Math.min(state.index+1,state.qs.length);
  recordResult(state.m.title,state.correct,total,state.sessionIds);
  const x=modal();
  const pct=Math.round(state.correct/Math.max(1,total)*100);
  const icon=pct>=80?'🏆':pct>=60?'🔥':'💪';
  const msg=pct>=80?'Mükemmel! Bilgiyi özümsemişsin.':pct>=60?'İyi gidiyorsun. Bir tur daha seriyi yükseltir.':'Yanlışlarını Kütüphane\'den tekrar et.';
  x.innerHTML=`<div class="yb55-result">
    <span class="yb55-result-icon">${icon}</span>
    <span>OYUN TAMAMLANDI</span>
    <h2>${esc(state.m.title)}</h2>
    <strong>${state.score} puan</strong>
    <div><b>${state.correct}</b> doğru · <b>${total-state.correct}</b> yanlış · <b>${pct}%</b> başarı</div>
    <p>${msg}</p>
    <div class="yb55-result-actions">
      <button class="btn primary" data-again>Tekrar Oyna</button>
      <button class="btn secondary" data-exit>Kapat</button>
    </div>
  </div>`;
  x.querySelector('[data-again]').onclick=()=>start(state.id);
  x.querySelector('[data-exit]').onclick=closeGame;
}

function closeGame(){resetTimer();document.querySelector('.yb55-modal')?.remove();state=null}

new MutationObserver(()=>setTimeout(mount,60)).observe(document.body,{childList:true,subtree:true});
setTimeout(mount,500);
window.YB55Games={start,close:closeGame,pool:()=>bank().length};
})();
