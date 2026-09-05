/* Yurdunu Bil 78 — games-only events center */
(()=>{'use strict';
if(window.__YB78_EVENTS__)return;window.__YB78_EVENTS__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const questions=()=>Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:[];
function getState(){try{return JSON.parse(localStorage.getItem('yb_state_70')||'{}')}catch{return {}}}
function accuracy(){const rs=getState().results,r=Array.isArray(rs)?rs:[];if(!r.length)return null;const c=r.reduce((n,x)=>n+Number(x.correct||0),0),t=r.reduce((n,x)=>n+Number(x.total||0),0);return t?Math.round(c/t*100):null}
function enhance(){
 const v=$('#view-events');if(!v||!v.classList.contains('active'))return;if($('.events-dashboard',v))return;
 const root=document.createElement('div');root.className='events-dashboard';const acc=accuracy();
 root.innerHTML=`<section class="events-hero">
  <div class="events-hero-copy"><span class="events-kicker"><i></i> OYUN MERKEZİ • CANLI</span><h2>Bugün nasıl <strong>oynayacaksın?</strong></h2><p>Konuları mini oyunlarla pekiştir. Hızını, dikkatini ve bilgini farklı oyun modlarında test et.</p><div class="events-hero-actions"><button class="btn primary" data-yb78-action="sprint">⚡ Hızlı tur başlat</button><button class="btn secondary" data-yb78-action="random">🎯 Rastgele oyun</button></div></div>
  <div class="events-hero-stats"><div class="events-stat accent"><b>${questions().length}+</b><span>soru havuzu</span></div><div class="events-stat"><b>6</b><span>mini oyun</span></div><div class="events-stat"><b>∞</b><span>tekrar</span></div><div class="events-stat"><b>${acc===null?'—':acc+'%'}</b><span>ortalama doğruluk</span></div></div>
 </section>
 <section class="events-quick-grid">
  <article class="events-quick primary-card"><div class="events-quick-icon">⚡</div><div class="events-quick-copy"><span>En hızlı rota</span><h3>Bilgi Sprinti</h3><p>60 saniyede mümkün olduğunca çok doğru yap.</p></div><button class="btn primary" data-yb78-action="sprint">Oyna</button></article>
  <article class="events-quick"><div class="events-quick-icon">🎯</div><div class="events-quick-copy"><span>Günlük hedef</span><h3>10 soru tamamla</h3><p>Kısa bir turla bugünkü serini başlat.</p></div><button class="btn secondary" data-yb78-action="ten">Başla</button></article>
  <article class="events-quick"><div class="events-quick-icon">🔥</div><div class="events-quick-copy"><span>Seri hedefi</span><h3>Serini büyüt</h3><p>Arka arkaya doğru cevaplarla rekorunu zorla.</p></div><button class="btn secondary" data-yb78-action="streak">Başla</button></article>
 </section>
 <div class="events-section-head"><div><span class="eyebrow">OYUN MODLARI</span><h2>Farklı refleksler, aynı hedef.</h2><p>Her mod KPSS coğrafya soru havuzundan beslenir.</p></div></div>
 <section class="events-mode-grid">
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">⚡</div><span>SÜRE</span></div><h3>Bilgi Sprinti</h3><p>Zamana karşı hızlı cevap ver, doğru sayını maksimuma çıkar.</p><div class="events-mode-foot"><small>60 sn</small><button class="btn secondary" data-yb78-game="sprint">Başla →</button></div></article>
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">🔟</div><span>KLASİK</span></div><h3>10’da 10</h3><p>10 soruyu tamamla, seri bonuslarıyla puanını yükselt.</p><div class="events-mode-foot"><small>10 soru</small><button class="btn secondary" data-yb78-game="ten">Başla →</button></div></article>
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">💡</div><span>TAKTİK</span></div><h3>İpucu Avı</h3><p>Yanlış şıkları eleyerek puanı akıllıca kullan.</p><div class="events-mode-foot"><small>8 soru</small><button class="btn secondary" data-yb78-game="hint">Başla →</button></div></article>
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">❤️</div><span>ELEME</span></div><h3>3 Can</h3><p>Üç hata hakkını yönet ve mümkün olduğunca uzağa git.</p><div class="events-mode-foot"><small>12 soru</small><button class="btn secondary" data-yb78-game="lives">Başla →</button></div></article>
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">🔥</div><span>SERİ</span></div><h3>Seri Ustası</h3><p>Tek yanlışla serinin bozulduğu baskılı kısa tur.</p><div class="events-mode-foot"><small>8 soru</small><button class="btn secondary" data-yb78-game="streak">Başla →</button></div></article>
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">🌍</div><span>BÖLGELER</span></div><h3>Bölge Blitz</h3><p>Türkiye'nin bölgelerini hızlıca ayırt ve puanı kap.</p><div class="events-mode-foot"><small>8 soru</small><button class="btn secondary" data-yb78-game="region">Başla →</button></div></article>
 </section>
 <div class="events-footer-note"><b>💡 Döngü:</b> kütüphaneden çalış → oyunda pekiştir → skorunu yükselt.</div>
 <div class="yb78-legacy-suppress" aria-hidden="true"><div class="yb55-games-panel"><div class="yb55-games-head"></div></div></div>
 </section>`;
 Array.from(v.children).forEach(x=>x.remove());v.appendChild(root);bind(v)
}
function bind(v){
 $$('[data-yb78-game]',v).forEach(b=>b.addEventListener('click',()=>window.YB55Games?.start?.(b.dataset.yb78Game)));
 $$('[data-yb78-action="sprint"]',v).forEach(b=>b.addEventListener('click',()=>window.YB55Games?.start?.('sprint')));
 $$('[data-yb78-action="ten"]',v).forEach(b=>b.addEventListener('click',()=>window.YB55Games?.start?.('ten')));
 $$('[data-yb78-action="streak"]',v).forEach(b=>b.addEventListener('click',()=>window.YB55Games?.start?.('streak')));
 $$('[data-yb78-action="random"]',v).forEach(b=>b.addEventListener('click',()=>{const ids=['sprint','ten','hint','lives','streak','region'];window.YB55Games?.start?.(ids[Math.floor(Math.random()*ids.length)])}));
}
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='events')setTimeout(enhance,90)});
window.addEventListener('load',()=>setTimeout(enhance,180));setTimeout(enhance,400);
})();
