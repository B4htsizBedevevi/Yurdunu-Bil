/* Yurdunu Bil 78 — events & games center */
(()=>{'use strict';
if(window.__YB78_EVENTS__)return;window.__YB78_EVENTS__=true;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const questions=()=>Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:[];
function getState(){try{return JSON.parse(localStorage.getItem('yb_state_70')||'{}')}catch{return {}}}
function accuracy(){const rs=getState().results;const r=Array.isArray(rs)?rs:[];if(!r.length)return null;const c=r.reduce((n,x)=>n+Number(x.correct||0),0),t=r.reduce((n,x)=>n+Number(x.total||0),0);return t?Math.round(c/t*100):null}
function enhance(){
 const v=$('#view-events');if(!v||!v.classList.contains('active'))return;
 if($('.events-dashboard',v))return;
 const root=document.createElement('div');root.className='events-dashboard';
 const acc=accuracy();
 root.innerHTML=`
 <section class="events-hero">
  <div class="events-hero-copy">
   <span class="events-kicker"><i></i> OYUN MERKEZİ • CANLI</span>
   <h2>Bilgini sınırla, <strong>rekabete taşı.</strong></h2>
   <p>Hızlı turla ısın, mini oyunlarla konuyu pekiştir, sonra Arena'da gerçek rakibe karşı yarış. Her tur KPSS coğrafya soru havuzundan beslenir.</p>
   <div class="events-hero-actions"><button class="btn primary" data-yb78-action="sprint">⚡ 60 saniye başla</button><button class="btn secondary" data-yb78-action="arena">⚔️ Arena'ya git</button></div>
  </div>
  <div class="events-hero-stats"><div class="events-stat accent"><b>${questions().length}+</b><span>soru havuzu</span></div><div class="events-stat"><b>6</b><span>mini oyun</span></div><div class="events-stat"><b>1 VS 1</b><span>canlı arena</span></div><div class="events-stat"><b>${acc===null?'—':acc+'%'}</b><span>ortalama doğruluk</span></div></div>
 </section>
 <section class="events-quick-grid">
  <article class="events-quick primary-card"><div class="events-quick-icon">⚡</div><div class="events-quick-copy"><span>En hızlı rota</span><h3>Coğrafya Hız Turu</h3><p>60 saniyede mümkün olduğunca çok doğru yap.</p></div><button class="btn primary" data-yb78-action="sprint">Oyna</button></article>
  <article class="events-quick"><div class="events-quick-icon">🎯</div><div class="events-quick-copy"><span>Günlük görev</span><h3>1 oyun tamamla</h3><p>Bugünkü çalışma serini başlat.</p></div><button class="btn secondary" data-yb78-action="sprint">Başla</button></article>
  <article class="events-quick"><div class="events-quick-icon">🏆</div><div class="events-quick-copy"><span>Rekabet</span><h3>Sıralamaya gir</h3><p>Mini oyun skorlarını yükselt.</p></div><button class="btn secondary" data-yb78-action="social">Aç</button></article>
 </section>
 <div class="events-section-head"><div><span class="eyebrow">MODLAR</span><h2>Bugün nasıl oynayacaksın?</h2><p>Farklı modlarla aynı bilgiyi farklı reflekslerle tekrar et.</p></div></div>
 <section class="events-mode-grid">
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">⚡</div><span>SÜRE</span></div><h3>Bilgi Sprinti</h3><p>Zamana karşı hızlı cevap ver, refleksini güçlendir.</p><div class="events-mode-foot"><small>60 sn</small><button class="btn secondary" data-yb78-game="sprint">Başla →</button></div></article>
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">🔟</div><span>HATASIZ</span></div><h3>10’da 10</h3><p>Seriyi bozmadan on soruyu tamamlamayı dene.</p><div class="events-mode-foot"><small>10 soru</small><button class="btn secondary" data-yb78-game="ten">Başla →</button></div></article>
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">💡</div><span>İPUCU</span></div><h3>İpucu Avı</h3><p>İpuçlarını kullanarak doğru cevabı daha hızlı bul.</p><div class="events-mode-foot"><small>strateji</small><button class="btn secondary" data-yb78-game="hint">Başla →</button></div></article>
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">❤️</div><span>DAYANIKLILIK</span></div><h3>3 Can</h3><p>Hatalarını yönet, üç canını tüketmeden ilerle.</p><div class="events-mode-foot"><small>3 can</small><button class="btn secondary" data-yb78-game="lives">Başla →</button></div></article>
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">🔥</div><span>SERİ</span></div><h3>Seri Ustası</h3><p>Arka arkaya doğru cevaplarla çarpanını büyüt.</p><div class="events-mode-foot"><small>combo</small><button class="btn secondary" data-yb78-game="streak">Başla →</button></div></article>
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">🌍</div><span>BÖLGE</span></div><h3>Bölge Blitz</h3><p>Türkiye bölgelerini hızlı sınıflandır ve puanı kap.</p><div class="events-mode-foot"><small>bölge</small><button class="btn secondary" data-yb78-game="region">Başla →</button></div></article>
 </section>
 <section class="events-arena-strip"><div class="events-arena-icon">⚔️</div><div class="events-arena-copy"><span>CANLI ARENA</span><h3>Gerçek rakip bul, reytingini yükselt.</h3><p>Otomatik eşleşme veya oda koduyla arkadaşınla karşılaş.</p></div><div class="events-arena-actions"><button class="btn primary" data-yb78-action="arena">Arena'yı aç</button><button class="btn secondary" data-yb78-action="social">Sosyal</button></div></section>
 <div class="events-footer-note"><b>💡 Çalışma döngüsü:</b> konu kartını oku → mini oyunla pekiştir → Arena'da hızını test et.</div>
 <div class="yb78-legacy-suppress" aria-hidden="true"><div class="yb55-games-panel"><div class="yb55-games-head"></div></div></div>
 </section>`;
 const old=Array.from(v.children);old.forEach(x=>x.remove());v.appendChild(root);bind(v);
}
function bind(v){
 $$('[data-yb78-game]',v).forEach(b=>b.addEventListener('click',()=>window.YB55Games?.start?.(b.dataset.yb78Game)));
 $$('[data-yb78-action="sprint"]',v).forEach(b=>b.addEventListener('click',()=>window.YB55Games?.start?.('sprint')));
 $$('[data-yb78-action="arena"]',v).forEach(b=>b.addEventListener('click',()=>window.YBArena?.open?.()));
 $$('[data-yb78-action="social"]',v).forEach(b=>b.addEventListener('click',()=>window.YB53Social?.open?.()));
}
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='events')setTimeout(enhance,90)});
window.addEventListener('load',()=>setTimeout(enhance,180));
setTimeout(enhance,400);
})();
