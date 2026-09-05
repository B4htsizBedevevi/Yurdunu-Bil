/* Yurdunu Bil 74 — enriched library home */
(()=>{'use strict';
if(window.__YB74_HOME__)return;window.__YB74_HOME__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const topics=()=>Array.isArray(window.TOPICS)?window.TOPICS:[];
const questions=()=>Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:[];
const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
function state(){try{return JSON.parse(localStorage.getItem('yb_state_70')||'{}')}catch{return {}}}
function results(){const r=state().results;return Array.isArray(r)?r:[]}
function topicQuestions(id){return questions().filter(q=>String(q.topic||'')===String(id)).length}
function highTopic(){return topics().find(t=>/yüksek/i.test(t.level||''))||topics()[0];}
function enhance(){
 const v=$('#view-library');
 if(!v||!v.classList.contains('active'))return;
 const grid=$('.library-note-grid',v);
 const toolbar=$('.library-toolbar',v);
 if(!grid||!toolbar)return;
 if(!$('.library-home',v)){
   const rs=results();
   const last=rs[0];
   const correct=last?.correct??0,total=last?.total??0;
   const pct=total?Math.max(0,Math.min(100,Math.round((correct/total)*100))):0;
   const name=(document.querySelector('#top-name')?.textContent||'Öğrenci').trim().split(/\s+/)[0]||'Öğrenci';
   const totalNotes=topics().reduce((n,t)=>n+(Array.isArray(t.bullets)?t.bullets.length:0),0);
   const focus=highTopic();
   const home=document.createElement('section');
   home.className='library-home';
   home.innerHTML=`<section class="library-hero">
     <div class="library-hero-copy">
       <span class="library-hero-kicker"><i></i> KPSS COĞRAFYA • BUGÜN</span>
       <h2>Hazırsan <strong>${esc(name)}</strong>, başlayalım.</h2>
       <p>Bilgiyi sadece okumak değil, hatırlamak için çalış. Önce yüksek getirili konuyu seç, ardından sorularla kendini sınayarak oyun merkezine geç.</p>
       <div class="library-hero-actions">
         <button class="btn primary" data-yb74-topic="${esc(focus?.id||'')}">🧭 ${esc(focus?.title||'Konuya başla')} →</button>
         <button class="btn secondary" data-yb74-events>⚡ Hızlı teste geç</button>
       </div>
     </div>
     <div class="library-hero-side">
       <div class="library-stat accent"><b>${topics().length}</b><span>ana konu</span></div>
       <div class="library-stat"><b>${questions().length}+</b><span>soru</span></div>
       <div class="library-stat"><b>${totalNotes}</b><span>temel bilgi</span></div>
       <div class="library-stat"><b>${last?pct+'%':'—'}</b><span>son test doğruluğu</span></div>
     </div>
   </section>
   <section class="library-focus">
     <div class="library-focus-copy">
       <span>Bugünün rotası</span>
       <h3>${esc(focus?.title||'İlk konunu seç')}</h3>
       <p>${esc(focus?.desc||'Kütüphaneden bir konu seçerek öğrenme turuna başla.')}</p>
       <div class="library-focus-progress"><div class="library-progress"><i style="width:${pct}%"></i></div><b>${last?pct+'% son performans':'İlk turunu başlat'}</b></div>
     </div>
     <button class="btn secondary" data-yb74-topic="${esc(focus?.id||'')}">Çalışmaya başla</button>
   </section>`;
   toolbar.parentNode.insertBefore(home,toolbar);
 }
 if(!$('.library-topic-head',v)){
   const head=document.createElement('div');head.className='library-topic-head';head.innerHTML=`<div><span class="eyebrow">KONU KÜTÜPHANESİ</span><h2>Konunu seç ve ilerle</h2><p>Her kart kısa tekrar için tasarlandı; detaydan sonra doğrudan çalışma modüllerine geçebilirsin.</p></div><div class="library-topic-sort"><button class="active" type="button" data-yb74-sort="default">Tümü</button><button type="button" data-yb74-sort="high">Yüksek getiri</button><button type="button" data-yb74-sort="short">Kısa konular</button></div>`;
   grid.parentNode.insertBefore(head,grid);
 }
 prepareCards(v);
 bind(v);
}
function prepareCards(v){
 $$('.note-card',v).forEach(card=>{
   if(card.dataset.yb74Prepared==='1')return;
   const title=card.querySelector('h2')?.textContent||'';
   const t=topics().find(x=>(x.title||x.name)===title);
   if(!t)return;
   card.dataset.topicId=t.id;card.dataset.level=t.level||'';card.dataset.minutes=t.minutes||10;card.dataset.qcount=topicQuestions(t.id);card.dataset.yb74Prepared='1';
 });
}
function openTopic(id){
 if(!id)return;
 const b=$(`.note-card[data-topic-id="${CSS.escape(id)}"] [data-open-topic]`);
 if(b)b.click();
}
function bind(v){
 $$('.library-home [data-yb74-topic]',v).forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.addEventListener('click',()=>openTopic(b.dataset.yb74Topic))});
 $$('.library-home [data-yb74-events]',v).forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.addEventListener('click',()=>{const n=document.querySelector('.nav-item[data-view="events"]');n?.click()})});
 $$('.library-topic-sort [data-yb74-sort]',v).forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.addEventListener('click',()=>sortCards(v,b.dataset.yb74Sort))});
}
function sortCards(v,mode){
 const grid=$('.library-note-grid',v);if(!grid)return;
 const cards=$$('.note-card',grid);
 $$('.library-topic-sort button',v).forEach(x=>x.classList.toggle('active',x.dataset.yb74Sort===mode));
 const order=cards.slice();
 order.sort((a,b)=>{
   if(mode==='high')return (/yüksek/i.test(b.dataset.level||'')?1:0)-(/yüksek/i.test(a.dataset.level||'')?1:0)||(Number(a.dataset.qcount)-Number(b.dataset.qcount));
   if(mode==='short')return Number(a.dataset.minutes)-Number(b.dataset.minutes);
   return cards.indexOf(a)-cards.indexOf(b);
 }).forEach(c=>grid.appendChild(c));
}
let timer=null;
function schedule(){clearTimeout(timer);timer=setTimeout(enhance,60)}
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='library')setTimeout(enhance,50)});
window.addEventListener('load',()=>setTimeout(enhance,100));
setTimeout(enhance,250);
})();
