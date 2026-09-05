/* Yurdunu Bil 82 — home dashboard */
(()=>{'use strict';if(window.__YB82_HOME__)return;window.__YB82_HOME__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const topics=()=>Array.isArray(window.TOPICS)?window.TOPICS:[],questions=()=>Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function progress(){try{return JSON.parse(localStorage.getItem('yb52_progress_v1')||'{}')}catch{return {}}}
function review(){try{return JSON.parse(localStorage.getItem('yb_review_76')||'{"done":{},"xp":0,"streak":0}')}catch{return {done:{},xp:0,streak:0}}}
function state(){try{return JSON.parse(localStorage.getItem('yb_state_70')||'{}')}catch{return {results:[]}}}
function level(xp){let l=1,need=120,spent=0;while(xp>=spent+need&&l<50){spent+=need;l++;need=Math.round(120+l*35)}return {l,need,spent,inLevel:Math.max(0,xp-spent)}}
function openHome(){
 const wrap=$('#page-wrap');if(!wrap)return;
 let v=$('#view-home');if(!v){v=document.createElement('section');v.id='view-home';v.className='view';wrap.appendChild(v)}
 $$('.view',wrap).forEach(x=>x.classList.toggle('active',x===v));
 $$('.nav-item[data-view]',document).forEach(x=>x.classList.remove('active'));
 $$('.yb81-nav-item',document).forEach(x=>x.classList.remove('active'));
 $('.yb82-home-nav')?.classList.add('active');
 const pt=$('#page-title');if(pt)pt.textContent='Ana Sayfa';
 render(v);
}
function render(v){
 const p=progress(),r=review(),s=state(),lv=level(Number(p.xp||r.xp||0));
 const xp=Number(p.xp||r.xp||0),answers=Number(p.answers||0),correct=Number(p.correct||0),acc=answers?Math.round(correct/answers*100):null;
 const results=Array.isArray(s.results)?s.results:[];
 const done=r.done||{};
 const mastered=topics().filter(t=>Number(done[t.id]||0)>=80).length;
 const today=p.daily?.date===new Date().toLocaleDateString('en-CA',{timeZone:'Europe/Istanbul'})?p.daily:{correct:0,answers:0};
 const weakest=topics().slice().sort((a,b)=>Number(done[a.id]||0)-Number(done[b.id]||0)).slice(0,4);
 const recent=results.slice(0,4);
 v.innerHTML=`<div class="yb82-home">
 <section class="yb82-hero"><div class="yb82-hero-copy"><span class="yb82-kicker"><i></i> ANA SAYFA • BUGÜN</span><h1>Bugün biraz daha <strong>iyileş.</strong></h1><p>Önce eksik olduğun konuyu yakala, kısa bir tekrar yap, ardından mini oyunla kendini sınayarak ilerle.</p><div class="yb82-actions"><button class="btn primary" data-yb82-library>📚 Kütüphaneye git →</button><button class="btn secondary" data-yb82-game>⚡ Hemen oyun oyna</button><button class="btn ghost" data-yb82-arena>⚔ Arena</button></div></div><div class="yb82-hero-side"><div class="yb82-stat accent"><b>Seviye ${lv.l}</b><span>${xp} XP</span></div><div class="yb82-stat"><b>${answers}</b><span>toplam cevap</span></div><div class="yb82-stat"><b>${acc===null?'—':acc+'%'}</b><span>doğruluk</span></div><div class="yb82-stat"><b>${mastered}/${topics().length}</b><span>ustalık</span></div></div></section>
 <section class="yb82-grid"><article class="yb82-card"><span class="eyebrow">GELİŞİM</span><h2>Seviye ${lv.l}</h2><p>${Math.max(0,lv.need-lv.inLevel)} XP sonra yeni seviyeye çıkıyorsun.</p><div class="yb82-progress"><i style="width:${Math.min(100,Math.round(lv.inLevel/lv.need*100))}%"></i></div><div class="yb82-row"><span>${Math.round(lv.inLevel/lv.need*100)}% tamamlandı</span><b>${xp} XP</b></div></article><article class="yb82-card"><span class="eyebrow">BUGÜN</span><h2>Günlük hedef</h2><p>5 doğru cevap tamamla.</p><div class="yb82-task"><div class="yb82-task-icon">🎯</div><div><b>${Math.min(5,Number(today.correct||0))}/5 doğru</b><span>${Number(today.correct||0)>=5?'Bugünün hedefi tamamlandı.':'Bir oyunla tamamlayabilirsin.'}</span></div></div></article><article class="yb82-card"><span class="eyebrow">SERİ</span><h2>🔥 ${Number(p.streak||r.streak||0)} gün</h2><p>En iyi serin <strong>${Number(p.bestStreak||0)||Number(r.streak||0)}.</strong></p><div class="yb82-task"><div class="yb82-task-icon">🏆</div><div><b>Seriyi koru</b><span>Bugün en az bir tur tamamla.</span></div></div></article></section>
 <div class="yb82-section"><div><span class="eyebrow">SANA ÖNERDİKLERİMİZ</span><h2>Eksik kalan yerlerden başla</h2><p>Düşük ustalık yüzdesine göre öne çıkan konular.</p></div><div class="yb82-chip-row"><span class="yb82-chip active">Akıllı öneriler</span><span class="yb82-chip">Kısa tekrar</span><span class="yb82-chip">Yüksek getiri</span></div></div>
 <section class="yb82-topic-grid">${weakest.map(t=>{const pct=Math.max(0,Math.min(100,Number(done[t.id]||0)));return `<article class="yb82-topic"><div class="yb82-topic-icon">${esc(t.icon||'📚')}</div><span>${esc(pct>=70?'İYİ GİDİYOR':pct?'GELİŞTİR':'YENİ')}</span><h3>${esc(t.title||t.name)}</h3><p>${esc(t.desc||'Konu temel bilgilerini pekiştir.')}</p><div class="yb82-progress"><i style="width:${pct}%"></i></div><div class="yb82-row"><span>%${pct} ustalık</span><button type="button" data-yb82-topic="${esc(t.id)}">Çalış →</button></div></article>`}).join('')}</section>
 <section class="yb82-card"><div class="yb82-section"><div><span class="eyebrow">SON HAREKETLER</span><h2>Son testlerin</h2><p>Performansını hızlıca kontrol et.</p></div></div><div class="yb82-recent">${recent.length?recent.map(x=>`<div class="yb82-result"><div><b>${Number(x.correct||0)}/${Number(x.total||0)} doğru</b><span>${x.created_at?new Date(x.created_at).toLocaleDateString('tr-TR'):'Son test'}</span></div><strong>${Number(x.score||0)} puan</strong></div>`).join(''):'<div class="yb82-result"><div><b>Henüz test sonucu yok</b><span>İlk turun burada görünecek.</span></div><strong>Başla →</strong></div>'}</div></section>
 </div>`;
 bind(v);
}
function bind(v){
 $$('[data-yb82-library]',v).forEach(b=>b.onclick=()=>document.querySelector('.nav-item[data-view="library"]')?.click());
 $$('[data-yb82-game]',v).forEach(b=>b.onclick=()=>window.YB55Games?.start?.('sprint'));
 $$('[data-yb82-arena]',v).forEach(b=>b.onclick=()=>window.YBArena?.open?.());
 $$('[data-yb82-topic]',v).forEach(b=>b.onclick=()=>{document.querySelector('.nav-item[data-view="library"]')?.click();setTimeout(()=>document.querySelector(`[data-open-topic="${CSS.escape(b.dataset.yb82Topic)}"]`)?.click(),80)});
}
function injectNav(){const nav=$('.side-nav');if(!nav||$('.yb82-home-nav',nav))return;const b=document.createElement('button');b.type='button';b.className='yb81-nav-item yb82-home-nav';b.innerHTML='<span class="yb81-icon">⌂</span><span>Ana Sayfa</span>';nav.insertBefore(b,nav.firstElementChild?.nextSibling||nav.firstChild);}
document.addEventListener('click',e=>{const b=e.target.closest('.yb82-home-nav');if(!b)return;e.preventDefault();e.stopImmediatePropagation();openHome()},true);
document.addEventListener('click',e=>{if(e.target.closest('.yb82-home-nav'))return;const b=e.target.closest('[data-yb82-home]');if(b){e.preventDefault();e.stopImmediatePropagation();openHome()}},true);
window.addEventListener('load',()=>{injectNav();});
setTimeout(injectNav,500);
})();