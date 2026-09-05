/* Yurdunu Bil — Flash Cards v1: hızlı hatırlama hap kartları */
(()=>{
'use strict';
if(window.__YB_FLASHCARDS__)return;
window.__YB_FLASHCARDS__=true;

const $=(s,r=document)=>r.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const CARDS=[
  /* KONUM */
  {id:'fc-k01',topic:'konum',front:'Türkiye hangi paraleller arasındadır?',back:'36°-42° Kuzey paralelleri',tip:'Orta kuşak → 4 mevsim'},
  {id:'fc-k02',topic:'konum',front:'1° boylam farkı kaç dakika yerel saat farkı oluşturur?',back:'4 dakika',tip:'19° × 4 = 76 dk (TR doğu-batı farkı)'},
  {id:'fc-k03',topic:'konum',front:'Özel konum nedir?',back:'Diğer coğrafi unsurlarla (denizler, kıtalar, yollar) ilişkili konum',tip:'Boğazlar = özel konum örneği'},
  {id:'fc-k04',topic:'konum',front:'Türkiye kaç meridyen arasındadır?',back:'26°-45° Doğu meridyenleri',tip:'Doğu = yerel saat ilerler'},
  /* İKLİM */
  {id:'fc-i01',topic:'iklim',front:'Türkiye\'de en fazla yağış alan bölge?',back:'Doğu Karadeniz (Rize ~2000 mm+)',tip:'Yıl boyu yağış → düzenli akarsu'},
  {id:'fc-i02',topic:'iklim',front:'Akdeniz ikliminin bitki örtüsü?',back:'Maki (frigana)',tip:'Yazı kurak → sklerofil yaprak'},
  {id:'fc-i03',topic:'iklim',front:'100 m yükseldikçe sıcaklık ne kadar düşer?',back:'Yaklaşık 0.65°C',tip:'Ağrı Dağı (5137m) → çok soğuk'},
  {id:'fc-i04',topic:'iklim',front:'Konveksiyonel yağış nasıl oluşur?',back:'Isınan hava yükselir, soğur, yoğunlaşır',tip:'Yazın iç kesimlerde öğleden sonra'},
  {id:'fc-i05',topic:'iklim',front:'İç Anadolu\'nun doğal bitki örtüsü?',back:'Bozkır (step)',tip:'Az yağış + karasal iklim'},
  /* YERŞEKİLLERİ */
  {id:'fc-y01',topic:'yerseki',front:'Türkiye\'nin en yüksek dağı ve yüksekliği?',back:'Ağrı Dağı — 5137 m',tip:'Volkanik kökenli'},
  {id:'fc-y02',topic:'yerseki',front:'Falez nasıl oluşur?',back:'Dalga aşındırması → dik kıyı',tip:'Karadeniz batı kıyısı örnek'},
  {id:'fc-y03',topic:'yerseki',front:'Delta oluşumu için ne gerekir?',back:'Sığ kıyı + güçlü alüvyon taşıması',tip:'Çukurova = en büyük delta ovası'},
  {id:'fc-y04',topic:'yerseki',front:'Horst ve graben hangi hareketle oluşur?',back:'Kırılma (tektonik)',tip:'Büyük Menderes Grabeni örnek'},
  {id:'fc-y05',topic:'yerseki',front:'Peribacaları nerede ve nasıl oluşur?',back:'Kapadokya — volkanik tüfün aşınması',tip:'UNESCO miras alanı'},
  /* SU */
  {id:'fc-s01',topic:'su',front:'Türkiye\'nin en uzun akarsuyı?',back:'Kızılırmak (1355 km)',tip:'Anadolu\'da doğar, Karadeniz\'e dökülür'},
  {id:'fc-s02',topic:'su',front:'Van Gölü nasıl bir göldür?',back:'Kapalı havza, sodalı, set gölü',tip:'En büyük Türkiye gölü'},
  {id:'fc-s03',topic:'su',front:'Beyşehir Gölü özelliği?',back:'En büyük tatlı su gölü',tip:'İç Anadolu, karstik kökenli'},
  {id:'fc-s04',topic:'su',front:'Açık havza ne demektir?',back:'Suları denize ulaşabilen havza',tip:'Kapalı havzada tuzluluk artar'},
  {id:'fc-s05',topic:'su',front:'GAP hangi iki nehir havzasını kapsar?',back:'Fırat ve Dicle',tip:'Güneydoğu Anadolu kalkınma projesi'},
  /* NÜFUS */
  {id:'fc-n01',topic:'nufus',front:'Türkiye\'nin 2025 yılı nüfusu?',back:'Yaklaşık 86 milyon (TÜİK ADNKS)',tip:'İstanbul ~%18 payıyla öne çıkar'},
  {id:'fc-n02',topic:'nufus',front:'İtici faktör örneği?',back:'İşsizlik, yoksulluk, doğal afet',tip:'Çekici faktör = iş olanağı'},
  {id:'fc-n03',topic:'nufus',front:'Aritmetik nüfus yoğunluğu formülü?',back:'Toplam nüfus ÷ yüzölçümü',tip:'Türkiye ort. ~115 kişi/km²'},
  {id:'fc-n04',topic:'nufus',front:'Nüfusu en az olan 3 il?',back:'Bayburt, Ardahan, Tunceli',tip:'Yüksek engebeli, sert iklim'},
  /* TARIM */
  {id:'fc-t01',topic:'tarim',front:'Dünya fındık üretiminde Türkiye\'nin payı?',back:'Yaklaşık %70+ (1. sıra)',tip:'Ordu-Giresun-Trabzon bölgesi'},
  {id:'fc-t02',topic:'tarim',front:'Çay yalnızca nerede yetişir?',back:'Doğu Karadeniz (Rize merkez)',tip:'Nemli iklim şarttır'},
  {id:'fc-t03',topic:'tarim',front:'Nadas ne işe yarar?',back:'Kurak alanlarda toprakta nem biriktirir',tip:'İç Anadolu\'da yaygın'},
  {id:'fc-t04',topic:'tarim',front:'Türkiye\'nin seracılık merkezi?',back:'Antalya ve çevresi',tip:'Ilıman kış, güneşli gün fazlalığı'},
  /* MADEN */
  {id:'fc-m01',topic:'maden',front:'Taş kömürü yalnızca nerede çıkarılır?',back:'Zonguldak havzası',tip:'Klasik sınav sorusu!'},
  {id:'fc-m02',topic:'maden',front:'Türkiye bor rezervleri dünyada kaçıncı?',back:'İlk sıralarda (en büyük rezerv)',tip:'Kütahya-Balıkesir-Eskişehir'},
  {id:'fc-m03',topic:'maden',front:'Sivas-Divriği ne ile meşhur?',back:'Demir madeni (en büyük rezerv)',tip:'Demir-çelik sanayi bağlantısı'},
  {id:'fc-m04',topic:'maden',front:'Jeotermal enerji neyle ilişkilidir?',back:'Fay hatları ve volkanik alanlar',tip:'Aydın — Türkiye lideri'},
  {id:'fc-m05',topic:'maden',front:'Karadeniz\'deki büyük doğalgaz sahası?',back:'Sakarya Gaz Sahası',tip:'2021-22\'de keşfedildi'},
  /* BÖLGELER */
  {id:'fc-b01',topic:'bolgeler',front:'Türkiye kaç coğrafi bölgeye ayrılır ve ne zaman?',back:'7 bölge — 1941 Coğrafya Kongresi',tip:'Marmara en küçük, Doğu Anadolu en büyük'},
  {id:'fc-b02',topic:'bolgeler',front:'En fazla sanayi hangi bölgededir?',back:'Marmara Bölgesi',tip:'İstanbul-Kocaeli-Bursa üçgeni'},
  {id:'fc-b03',topic:'bolgeler',front:'Kapadokya hangi bölgededir ve nereye aittir?',back:'İç Anadolu — Nevşehir',tip:'Turizm + volkanik peribacaları'},
  {id:'fc-b04',topic:'bolgeler',front:'Çay-fındık hangi bölgeye özgüdür?',back:'Karadeniz Bölgesi',tip:'Her mevsim yağış → tarım çeşitliliği'},
  {id:'fc-b05',topic:'bolgeler',front:'Yüzölçümü en büyük bölge?',back:'Doğu Anadolu (~163.000 km²)',tip:'Ama nüfus yoğunluğu en düşük'},
];

const TOPIC_COLORS={
  konum:'#4bc9ff',iklim:'#43e1c2',yerseki:'#f5a623',
  su:'#60c8ff',nufus:'#8e7dff',tarim:'#4ee2ad',
  maden:'#ff9f4a',bolgeler:'#c084fc'
};
const TOPIC_LABELS={
  konum:'🧭 Konum',iklim:'🌦️ İklim',yerseki:'⛰️ Yerşekilleri',
  su:'💧 Su',nufus:'👥 Nüfus',tarim:'🌾 Tarım',
  maden:'⛏️ Maden',bolgeler:'🗺️ Bölgeler'
};

let state={deck:[],index:0,flipped:false,correct:0,total:0,topic:'all',sessionId:null};

function getCards(topic){
  const pool=topic&&topic!=='all'?CARDS.filter(c=>c.topic===topic):CARDS;
  const shuffled=[...pool];
  for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]]}
  return shuffled;
}

function open(topic='all'){
  const existing=document.getElementById('yb-fc-modal');
  if(existing)existing.remove();
  state={deck:getCards(topic),index:0,flipped:false,correct:0,total:0,topic,sessionId:Date.now().toString(36)};
  const wrap=document.createElement('div');
  wrap.id='yb-fc-modal';
  wrap.innerHTML=`
  <div class="yb-fc-backdrop"></div>
  <section class="yb-fc-shell">
    <header class="yb-fc-header">
      <div class="yb-fc-header-left">
        <span class="eyebrow">HAP KARTLAR</span>
        <select id="yb-fc-topic-sel">
          <option value="all">Tüm konular</option>
          ${Object.entries(TOPIC_LABELS).map(([k,v])=>`<option value="${k}"${topic===k?' selected':''}>${v}</option>`).join('')}
        </select>
      </div>
      <div class="yb-fc-progress-wrap">
        <div class="yb-fc-progress-bar"><div id="yb-fc-bar" style="width:0%"></div></div>
        <span id="yb-fc-counter">1 / ${state.deck.length}</span>
      </div>
      <button class="yb-fc-close" type="button" id="yb-fc-close">×</button>
    </header>
    <div class="yb-fc-stage" id="yb-fc-stage">
      <!-- Kart buraya render edilir -->
    </div>
    <div class="yb-fc-controls">
      <button class="btn ghost yb-fc-btn" id="yb-fc-wrong" type="button">✗ Bilmedim</button>
      <button class="btn secondary yb-fc-btn yb-fc-flip" id="yb-fc-flip" type="button">Kartı Çevir ↩</button>
      <button class="btn primary yb-fc-btn" id="yb-fc-correct" type="button">✓ Bildim</button>
    </div>
    <div class="yb-fc-keyboard-hint">← Bilmedim &nbsp;|&nbsp; Boşluk: Çevir &nbsp;|&nbsp; → Bildim &nbsp;|&nbsp; Esc: Kapat</div>
  </section>`;
  document.body.appendChild(wrap);
  requestAnimationFrame(()=>wrap.classList.add('yb-fc-visible'));
  renderCard();
  bindControls(wrap);
}

function renderCard(){
  const card=state.deck[state.index];
  if(!card){showResult();return}
  const color=TOPIC_COLORS[card.topic]||'#4bc9ff';
  const stage=document.getElementById('yb-fc-stage');
  if(!stage)return;
  state.flipped=false;

  stage.innerHTML=`
  <div class="yb-fc-card" id="yb-fc-card" style="--fc-color:${color}">
    <div class="yb-fc-card-inner" id="yb-fc-card-inner">
      <div class="yb-fc-front">
        <span class="yb-fc-topic-tag">${esc(TOPIC_LABELS[card.topic]||card.topic)}</span>
        <div class="yb-fc-question">${esc(card.front)}</div>
        <div class="yb-fc-hint-text">Cevabı düşün, sonra kartı çevir →</div>
      </div>
      <div class="yb-fc-back">
        <span class="yb-fc-topic-tag">${esc(TOPIC_LABELS[card.topic]||card.topic)}</span>
        <div class="yb-fc-answer">${esc(card.back)}</div>
        ${card.tip?`<div class="yb-fc-tip">💡 ${esc(card.tip)}</div>`:''}
      </div>
    </div>
  </div>`;

  /* Sayaç ve bar */
  const counter=document.getElementById('yb-fc-counter');
  const bar=document.getElementById('yb-fc-bar');
  if(counter)counter.textContent=`${state.index+1} / ${state.deck.length}`;
  if(bar)bar.style.width=`${((state.index)/state.deck.length)*100}%`;

  /* Kart tıklayınca çevir */
  document.getElementById('yb-fc-card')?.addEventListener('click',flipCard);
}

function flipCard(){
  const inner=document.getElementById('yb-fc-card-inner');
  if(!inner)return;
  state.flipped=!state.flipped;
  inner.classList.toggle('yb-fc-flipped',state.flipped);
  const flipBtn=document.getElementById('yb-fc-flip');
  if(flipBtn)flipBtn.textContent=state.flipped?'↩ Ön Yüz':'Kartı Çevir ↩';
}

function answer(known){
  state.total++;
  if(known)state.correct++;
  state.index++;
  if(state.index>=state.deck.length){showResult();return}
  const stage=document.getElementById('yb-fc-stage');
  if(stage){
    stage.classList.add('yb-fc-exit');
    setTimeout(()=>{stage.classList.remove('yb-fc-exit');renderCard()},200);
  } else renderCard();
}

function showResult(){
  const pct=state.total?Math.round(state.correct/state.total*100):0;
  const bar=document.getElementById('yb-fc-bar');
  if(bar)bar.style.width='100%';
  const stage=document.getElementById('yb-fc-stage');
  if(!stage)return;
  const icon=pct>=80?'🏆':pct>=60?'🔥':'💪';
  stage.innerHTML=`
  <div class="yb-fc-result">
    <div class="yb-fc-result-icon">${icon}</div>
    <h2>${pct>=80?'Harika!':pct>=60?'İyi iş!':'Devam et!'}</h2>
    <div class="yb-fc-result-score"><b>${state.correct}</b>/${state.total} <span>doğru</span></div>
    <div class="yb-fc-result-pct">${pct}% başarı</div>
    <div class="yb-fc-result-actions">
      <button class="btn primary" id="yb-fc-retry">Tekrar Et</button>
      <button class="btn secondary" id="yb-fc-wrong-only">Sadece Yanlışlar</button>
      <button class="btn ghost" id="yb-fc-exit-btn">Kapat</button>
    </div>
  </div>`;
  document.getElementById('yb-fc-retry')?.addEventListener('click',()=>open(state.topic));
  document.getElementById('yb-fc-exit-btn')?.addEventListener('click',closeFc);
  /* XP kaydet */
  try{
    const p=JSON.parse(localStorage.getItem('yb52_progress_v1')||'{}');
    p.xp=(Number(p.xp)||0)+(state.correct*5);
    localStorage.setItem('yb52_progress_v1',JSON.stringify(p));
  }catch{}
}

function bindControls(wrap){
  wrap.querySelector('#yb-fc-close')?.addEventListener('click',closeFc);
  wrap.querySelector('#yb-fc-backdrop')?.addEventListener('click',closeFc);
  wrap.querySelector('.yb-fc-backdrop')?.addEventListener('click',closeFc);
  document.getElementById('yb-fc-flip')?.addEventListener('click',flipCard);
  document.getElementById('yb-fc-correct')?.addEventListener('click',()=>answer(true));
  document.getElementById('yb-fc-wrong')?.addEventListener('click',()=>answer(false));
  wrap.querySelector('#yb-fc-topic-sel')?.addEventListener('change',e=>open(e.target.value));

  const keyHandler=(e)=>{
    if(!document.getElementById('yb-fc-modal'))return document.removeEventListener('keydown',keyHandler);
    if(e.key==='Escape')closeFc();
    else if(e.key===' '||e.key==='ArrowUp'){e.preventDefault();flipCard()}
    else if(e.key==='ArrowRight')answer(true);
    else if(e.key==='ArrowLeft')answer(false);
  };
  document.addEventListener('keydown',keyHandler);
}

function closeFc(){
  const wrap=document.getElementById('yb-fc-modal');
  if(!wrap)return;
  wrap.classList.remove('yb-fc-visible');
  setTimeout(()=>wrap.remove(),300);
}

/* Kütüphane view'ına hap kartlar butonu ekle */
function mountInLibrary(){
  const v=document.getElementById('view-library');
  if(!v||!v.classList.contains('active'))return;
  if(v.querySelector('.yb-fc-library-cta'))return;
  const toolbar=v.querySelector('.library-toolbar');
  if(!toolbar)return;
  const btn=document.createElement('button');
  btn.className='btn secondary yb-fc-library-cta';
  btn.type='button';
  btn.innerHTML='🃏 Hap Kartlar';
  btn.addEventListener('click',()=>open('all'));
  toolbar.appendChild(btn);
}

document.addEventListener('yb:navigate',e=>{
  if(e.detail?.view==='library')setTimeout(mountInLibrary,200);
});
window.addEventListener('load',()=>setTimeout(mountInLibrary,800));
new MutationObserver(()=>setTimeout(mountInLibrary,80)).observe(document.body,{childList:true,subtree:true});

window.YBFlashCards={open,close:closeFc,cards:CARDS};
})();
