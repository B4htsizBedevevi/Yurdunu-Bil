/* Yurdunu Bil 90 v2 — yenilenmiş ana sayfa komuta merkezi */
(()=>{
'use strict';
if(window.__YB90_HOME__)return;
window.__YB90_HOME__=true;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const TOPIC_META={
  konum: ['🧭','Coğrafi Konum','Matematik ve özel konum sonuçları'],
  iklim: ['🌦️','İklim','Dört iklim tipi ve bitki örtüsü'],
  yerseki:['⛰️','Yerşekilleri','Dağlar, ovalar, platolar, kıyılar'],
  su:    ['💧','Su Kaynakları','Akarsular, göller, barajlar'],
  nufus: ['👥','Nüfus','Dağılış, göç ve kentleşme'],
  tarim: ['🌾','Tarım','Ürün dağılışı ve hayvancılık'],
  maden: ['⛏️','Maden & Enerji','Yeraltı zenginlikleri ve enerji'],
  bolgeler:['🗺️','Bölgeler','Yedi coğrafi bölge ve turizm']
};

const EXAM_DATE='2026-10-04T10:15:00+03:00';

/* Güncel veriler */
const STATS_DATA=[
  ['86,09 M','Türkiye nüfusu','TÜİK ADNKS 2025'],
  ['%92,3','Kentleşme oranı','2025'],
  ['81','İl sayısı','İdari'],
  ['7','Coğrafi bölge','1941 Kongresi']
];

function read(k,d={}){try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}}

function stats(){
  const p=read('yb52_progress_v1',{});
  const r=read('yb_state_70',{});
  const results=Array.isArray(r.results)?r.results:[];
  const answers=Number(p.answers||0);
  const correct=Number(p.correct||0);
  const daily=p.daily||{answers:0,correct:0};
  return{
    xp:Number(p.xp||0),streak:Number(p.streak||0),
    best:Number(p.bestStreak||0),answers,correct,
    acc:answers?Math.round(correct/answers*100):0,
    tests:results.length,
    dailyAns:Number(daily.answers||0),
    dailyCorrect:Number(daily.correct||0)
  };
}

function countdown(){
  const ms=Math.max(0,new Date(EXAM_DATE).getTime()-Date.now());
  const d=Math.floor(ms/86400000);
  const h=Math.floor(ms%86400000/3600000);
  const m=Math.floor(ms%3600000/60000);
  return{d,h,m,total:ms};
}

function xpToLevel(xp){
  if(xp>=2000)return{level:5,title:'Uzman',next:null,pct:100};
  if(xp>=1000)return{level:4,title:'İleri',next:2000,pct:Math.round((xp-1000)/10)};
  if(xp>=400)return{level:3,title:'Orta',next:1000,pct:Math.round((xp-400)/6)};
  if(xp>=100)return{level:2,title:'Başlangıç',next:400,pct:Math.round((xp-100)/3)};
  return{level:1,title:'Yeni',next:100,pct:Math.round(xp)};
}

function showHome(){
  const views=['view-home','view-library','view-events','view-settings'];
  views.forEach(id=>$('#'+id)?.classList.remove('active'));
  $('#view-home')?.classList.add('active');
  $$('.nav-item[data-view], .yb81-nav-item').forEach(x=>x.classList.remove('active'));
  $('.yb82-home-nav')?.classList.add('active');
  const pt=$('#page-title');if(pt)pt.textContent='Ana Sayfa';
  render();
}

function render(){
  const v=$('#view-home');
  if(!v||!v.classList.contains('active'))return;
  /* Temizle ve yeniden çiz */
  v.innerHTML='';
  const s=stats();
  const c=countdown();
  const lv=xpToLevel(s.xp);
  const topics=Array.isArray(window.TOPICS)?window.TOPICS:[];
  const qs=Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK.length:0;
  const wrong=read('yb88_question_center',{}).wrong?.length||0;

  v.innerHTML=`
<div class="yb90-home">

  <!-- ── HERO ── -->
  <section class="yb90-hero">
    <div class="yb90-hero-copy">
      <span class="yb90-kicker"><i class="yb90-dot"></i> YURDUNU BİL • KPSS COĞRAFYA 2026</span>
      <h1>Türkiye coğrafyasını <strong>öğren.</strong><br>Bilgini <strong>kanıtla.</strong></h1>
      <p>Konuları kısa parçalarla öğren, kaliteli sorularla pekiştir, 9 farklı oyunla hız kazan, canlı Arena'da rakibine meydan oku.</p>
      <div class="yb90-actions">
        <button type="button" class="btn primary" data90="library">📚 Çalışmaya başla</button>
        <button type="button" class="btn secondary" data90="events">🎮 Oyun merkezine git</button>
        <button type="button" class="btn ghost" data90="arena">⚔️ Arena'ya gir</button>
      </div>
      <div class="yb90-proof">
        <span>📖 ${qs}+ soru</span>
        <span>🗂️ ${topics.length||8} konu</span>
        <span>🎮 9 oyun modu</span>
        <span>⚔️ Canlı Arena</span>
        <span>🔁 Akıllı tekrar</span>
      </div>
    </div>
    <aside class="yb90-hero-side">

      <!-- Geri sayım -->
      <div class="yb90-countdown">
        <div class="yb90-countdown-head">
          <span class="eyebrow">SINAVA KALAN SÜRE</span>
          <b class="yb90-exam-badge">ÖSYM</b>
        </div>
        <h3>2026 KPSS Ön Lisans</h3>
        <p>4 Ekim 2026 · 10:15</p>
        <div class="yb90-timer">
          <div><b data90d>${c.d}</b><span>gün</span></div>
          <div class="yb90-timer-sep">:</div>
          <div><b data90h>${String(c.h).padStart(2,'0')}</b><span>saat</span></div>
          <div class="yb90-timer-sep">:</div>
          <div><b data90m>${String(c.m).padStart(2,'0')}</b><span>dk</span></div>
        </div>
      </div>

      <!-- Kullanıcı istatistikleri -->
      <div class="yb90-user">
        <div class="yb90-user-top">
          <div>
            <span class="eyebrow">SEVİYEN</span>
            <h3 class="yb90-level-title">Lv.${lv.level} ${lv.title}</h3>
          </div>
          <span class="yb90-xp-badge">${s.xp} XP</span>
        </div>
        ${lv.next?`<div class="yb90-xp-bar"><div style="width:${lv.pct}%"></div></div>
        <small class="yb90-xp-hint">${lv.pct}% → ${lv.next} XP gerekli</small>`:'<small class="yb90-xp-hint">Maksimum seviye 🏆</small>'}
        <div class="yb90-user-stats">
          <div><b>${s.answers}</b><span>Toplam cevap</span></div>
          <div><b>${s.acc}%</b><span>Doğruluk</span></div>
          <div><b>${s.streak}</b><span>Aktif seri</span></div>
          <div><b>${s.best}</b><span>En iyi seri</span></div>
        </div>
      </div>

    </aside>
  </section>

  <!-- ── HIZLI KONU SEÇ ── -->
  <section class="yb90-section">
    <div class="yb90-section-head">
      <div>
        <span class="eyebrow">HIZLI KONU SEÇ</span>
        <h2>Bugün ne çalışacaksın?</h2>
        <p>Doğrudan istediğin konuya gir.</p>
      </div>
      <button type="button" class="btn secondary" data90="library">Tüm kütüphane →</button>
    </div>
    <div class="yb90-topic-row">
      ${topics.slice(0,8).map(t=>{
        const m=TOPIC_META[t.id]||['📘',t.title||'Konu',''];
        const qCount=Array.isArray(window.QUESTION_BANK)
          ?window.QUESTION_BANK.filter(q=>q.topic===t.id).length:0;
        return `<button type="button" class="yb90-topic" data90topic="${esc(t.id)}">
          <i>${m[0]}</i>
          <span>${esc(t.title||m[1])}</span>
          <small>${qCount?qCount+' soru':t.level||'KPSS'}</small>
        </button>`;
      }).join('')}
    </div>
  </section>

  <!-- ── KART IZGARASI ── -->
  <section class="yb90-grid">

    <!-- Güncel veriler -->
    <article class="yb90-card">
      <div class="yb90-card-head">
        <div>
          <span class="eyebrow">TÜİK • GÜNCEL</span>
          <h2>Türkiye'den sayılar</h2>
          <p>Sınavda referans alınabilecek güncel göstergeler.</p>
        </div>
        <span class="yb90-badge">2025</span>
      </div>
      <div class="yb90-data-grid">
        ${STATS_DATA.map(x=>`<div class="yb90-data">
          <b>${x[0]}</b><span>${x[1]}</span><em>${x[2]}</em>
        </div>`).join('')}
      </div>
    </article>

    <!-- Nasıl çalışıyor -->
    <article class="yb90-card">
      <div class="yb90-card-head">
        <div>
          <span class="eyebrow">NASIL ÇALIŞIYOR?</span>
          <h2>Yurdunu Bil döngüsü</h2>
          <p>Tek merkezde ders → soru → oyun → Arena.</p>
        </div>
      </div>
      <div class="yb90-steps">
        <div><b>01</b><span>Öğren</span><em>Kısa konu modülü</em></div>
        <div><b>02</b><span>Pekiştir</span><em>Soru merkezi</em></div>
        <div><b>03</b><span>Oyna</span><em>9 oyun modu</em></div>
        <div><b>04</b><span>Yarış</span><em>Canlı Arena</em></div>
      </div>
    </article>

  </section>

  <!-- ── ALT KARTLAR ── -->
  <section class="yb90-footer-grid">

    <!-- Yanlışlar -->
    <article class="yb90-foot-card ${wrong?'yb90-has-wrong':''}">
      <div>
        <span class="eyebrow">🧠 AKILLI TEKRAR</span>
        <h3>${wrong?`${wrong} yanlışın seni bekliyor.`:'Yanlışlar kuyruğu temiz.'}</h3>
        <p>${wrong?'Bir önceki turda yanlış yaptığın soruları çöz, hafızana sabitle.':'Soru çözdükçe yanlışların buraya düşer ve otomatik tekrar kuyruğuna alınır.'}</p>
      </div>
      <button type="button" class="btn ${wrong?'primary':'secondary'}" data90="wrong">
        ${wrong?`${wrong} soruyu çöz →`:'Soru merkezine git →'}
      </button>
    </article>

    <!-- İlerleme -->
    <article class="yb90-foot-card">
      <div>
        <span class="eyebrow">🏆 OYUNCU İLERLEMESİ</span>
        <h3>${s.tests?`${s.tests} test tamamladın.`:'İlk testini bugün çöz.'}</h3>
        <p>${s.xp} XP · En iyi seri ${s.best} · Doğruluk %${s.acc}. Her turda seviye kazanırsın.</p>
      </div>
      <button type="button" class="btn secondary" data90="events">Bir tur oyna →</button>
    </article>

    <!-- Arena çağrısı -->
    <article class="yb90-foot-card yb90-arena-cta">
      <div>
        <span class="eyebrow">⚔️ CANLI ARENA</span>
        <h3>Rakibine meydan oku.</h3>
        <p>Konu seç, oda kur, kodu paylaş. Gerçek zamanlı 1 VS 1 düello, reyting ve sıralama.</p>
      </div>
      <button type="button" class="btn primary" data90="arena">Arena'ya gir →</button>
    </article>

  </section>

</div>`;

  bind(v);
}

function bind(v){
  $$('[data90]',v).forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();
    const x=b.dataset['90']||b.getAttribute('data90');
    if(x==='library'||x==='events'||x==='settings')window.navigate?.(x);
    else if(x==='arena')window.YBArena?.open?.();
    else if(x==='wrong')window.YB88QuestionCenter?.openQuiz?.('wrong');
  }));
  $$('[data90topic]',v).forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();
    const id=b.getAttribute('data90topic');
    window.navigate?.('library');
    setTimeout(()=>document.querySelector(`[data-open-topic="${CSS.escape(id)}"]`)?.click(),100);
  }));
}

function tick(){
  const v=$('#view-home');
  if(!v?.classList.contains('active'))return;
  const c=countdown();
  const d=$('[data90d]',v),h=$('[data90h]',v),m=$('[data90m]',v);
  if(d)d.textContent=c.d;
  if(h)h.textContent=String(c.h).padStart(2,'0');
  if(m)m.textContent=String(c.m).padStart(2,'0');
}

function install(){
  /* Ana sayfa nav butonu bağlama */
  const b=$('.yb82-home-nav');
  if(b&&!b.dataset.yb90){
    b.dataset.yb90='1';
    b.addEventListener('click',e=>{e.preventDefault();showHome()});
  }
}

document.addEventListener('yb:navigate',e=>{
  if(e.detail?.view==='home')setTimeout(render,0);
});

window.addEventListener('load',()=>{
  install();
  setTimeout(()=>{
    if(!$('#app-shell')?.classList.contains('hidden'))render();
  },350);
});

setInterval(install,1200);
setInterval(tick,30000);

window.YB90Home={render,showHome};
})();
