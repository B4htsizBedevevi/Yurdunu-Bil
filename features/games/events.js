/* Yurdunu Bil 86+ — Events & Games hub, 9 mod */
(()=>{
'use strict';
if(window.__YB86_EVENTS__)return;
window.__YB86_EVENTS__=true;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

const modes=[
  ['sprint','⚡','Bilgi Sprinti','60 sn','Refleksini hızlandır, mümkün olduğunca çok doğru yap.','SÜRELİ'],
  ['ten','🎯','10\'da 10','10 soru','Seriyi bozmadan on soruyu tamamla.','KLASİK'],
  ['hint','💡','İpucu Avı','8 soru','Yanlış seçenekleri ele, puanını koru.','TAKTİK'],
  ['lives','❤️','3 Can','12 soru','Üç hata hakkın var; mümkün olduğunca ilerle.','ELEME'],
  ['streak','🔥','Seri Ustası','8 soru','Her doğru cevapla serini ve puan çarpanını büyüt.','SERİ'],
  ['region','🧭','Bölge Blitz','8 soru','Bölgeler konusunu hızlıca tara.','BÖLGELER'],
  ['countdown','⏰','Geri Sayım','15 soru','Doğru +5 sn, yanlış -3 sn. Süreyi koruyabilir misin?','YENİ'],
  ['levels','🔀','Karışık Seviyeler','12 soru','Kolay-Orta-Zor kademeleriyle ilerle.','YENİ'],
  ['random','🎲','Rastgele Konu','10 soru','Her soruda farklı konu — maksimum çeşitlilik.','YENİ']
];

function stats(){
  try{
    const p=JSON.parse(localStorage.getItem('yb52_progress_v1')||'{}');
    return {xp:Number(p.xp||0),streak:Number(p.streak||0),best:Number(p.bestStreak||0),answers:Number(p.answers||0),correct:Number(p.correct||0)};
  }catch{return {xp:0,streak:0,best:0,answers:0,correct:0}}
}

function render(){
  const v=$('#view-events');
  if(!v||!v.classList.contains('active'))return;
  if($('.yb86-events-page',v))return;
  const s=stats();
  const acc=s.answers?Math.round(s.correct/s.answers*100):null;
  const qCount=Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK.length:0;

  v.innerHTML=`<div class="yb86-events-page events-dashboard" data-yb86-owner="events">
  <section class="yb86-games-hero">
    <div>
      <span class="yb86-games-kicker"><i></i> ETKİNLİKLER &amp; OYUN MERKEZİ</span>
      <h1>Bilgini <strong>oynayarak</strong> pekiştir.</h1>
      <p>9 farklı oyun modu, ${qCount}+ soru. Kısa bir tur seç ve serini başlat. Arena için sol menüden ⚔ Arena'ya tıkla.</p>
      <div class="yb86-games-actions">
        <button class="btn primary" data-game="sprint">⚡ Hemen Başla</button>
        <button class="btn secondary" data-game="ten">🎯 10'da 10</button>
        <button class="btn ghost" data-game="countdown">⏰ Geri Sayım</button>
      </div>
    </div>
    <div class="yb86-games-stats">
      <div><b>${s.xp}</b><span>XP</span></div>
      <div><b>${s.streak}</b><span>aktif seri</span></div>
      <div><b>${s.best}</b><span>rekor seri</span></div>
      <div><b>${acc===null?'--':acc+'%'}</b><span>doğruluk</span></div>
    </div>
  </section>

  <section class="yb86-game-section">
    <div class="yb86-section-head">
      <div>
        <span>TÜM OYUNLAR</span>
        <h2>9 farklı mod, tek soru havuzu.</h2>
        <p>Her mod aynı soru bankasını farklı bir refleksle tekrar ettirir.</p>
      </div>
      <span class="yb86-pool">${qCount}+ soru</span>
    </div>
    <div class="yb86-game-grid">
      ${modes.map(m=>`<article class="yb86-game-card${m[5]==='YENİ'?' yb86-new':''}">
        <div class="yb86-game-top">
          <div class="yb86-game-icon">${m[1]}</div>
          <span>${m[5]==='YENİ'?'🆕 YENİ':m[5]}</span>
        </div>
        <h3>${m[2]}</h3>
        <p>${m[4]}</p>
        <div class="yb86-game-foot">
          <small>${m[3]}</small>
          <button type="button" class="btn secondary" data-game="${m[0]}">Oyna →</button>
        </div>
      </article>`).join('')}
    </div>
  </section>

  <section class="yb86-today">
    <div class="yb86-today-icon">🎯</div>
    <div>
      <span>BUGÜNÜN HEDEFİ</span>
      <h3>Bir oyun tamamla ve serini başlat.</h3>
      <p>5 doğru cevap yaptığında günlük ilerleme kaydedilir.</p>
    </div>
    <button class="btn primary" data-game="sprint">Başla →</button>
  </section>

  <div class="yb86-hidden-engine">
    <div class="yb55-games-panel"><div class="yb55-games-head"></div></div>
  </div>
  </div>`;

  bind(v);
}

function bind(v){
  $$('[data-game]',v).forEach(b=>{
    if(b.dataset.yb86Bound)return;
    b.dataset.yb86Bound='1';
    b.addEventListener('click',()=>window.YB55Games?.start?.(b.dataset.game));
  });
}

document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='events')setTimeout(render,0)});
window.addEventListener('load',()=>setTimeout(render,250));
window.YB86Events={render};
})();
