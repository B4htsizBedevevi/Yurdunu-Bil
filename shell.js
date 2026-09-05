/* Yurdunu Bil — shell.js: sistem modülleri birleşik dosyası */

/* ── v71-stability.js ── */
/* Yurdunu Bil 71 â€” recovered feature stabilization */
(()=>{'use strict';
if(window.__YB71_STABILITY__)return;window.__YB71_STABILITY__=true;
const $=(s,r=document)=>r.querySelector(s);
function fixEvents(){
  const v=$('#view-events');
  if(!v||!v.classList.contains('active'))return;
  v.querySelectorAll('.yb55-games-panel').forEach(p=>{
    if(!p.querySelector('.yb55-game-card')&&!p.querySelector('.yb55-games-head'))p.remove();
  });
}
function normalizeEvents(){fixEvents()}
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='events')setTimeout(normalizeEvents,80)});
new MutationObserver(()=>{if($('#view-events')?.classList.contains('active'))setTimeout(normalizeEvents,40)}).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',()=>setTimeout(normalizeEvents,120));
setTimeout(normalizeEvents,250);
})();


/* ── v73-content.js ── */
/* Yurdunu Bil 73 â€” library information hierarchy */
(()=>{'use strict';
if(window.__YB73_CONTENT__)return;window.__YB73_CONTENT__=true;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function data(){
  return {
    topics:Array.isArray(window.TOPICS)?window.TOPICS:[],
    questions:Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:[]
  };
}
function countFor(topic,questions){return questions.filter(q=>String(q.topic||'')===String(topic.id)).length}
function levelClass(level){const n=String(level||'').toLocaleLowerCase('tr-TR');return n.includes('yÃ¼ksek')?'high':n.includes('orta')?'mid':'low'}
function enhanceLibrary(){
  const v=$('#view-library');
  if(!v||!v.classList.contains('active'))return;
  const {topics,questions}=data();
  $$('.note-card',v).forEach(card=>{
    if(card.dataset.yb73Enhanced==='1')return;
    const title=card.querySelector('h2')?.textContent?.trim()||'';
    const topic=topics.find(t=>String(t.title||t.name||'').trim()===title);
    if(!topic)return;
    const n=countFor(topic,questions);
    const meta=document.createElement('div');
    meta.className='topic-meta';
    meta.innerHTML=`<span class="topic-level ${levelClass(topic.level)}">${esc(topic.level||'KPSS')}</span><span>â—· ${Number(topic.minutes||10)} dk</span><span>â“ ${n} soru</span><span>â–£ ${(topic.bullets||[]).length} bilgi</span>`;
    const p=card.querySelector(':scope>p');
    if(p)p.insertAdjacentElement('afterend',meta);
    const btn=card.querySelector('[data-open-topic]');
    if(btn)btn.textContent='Konuya devam et â†’';
    card.dataset.yb73Enhanced='1';
  });
}
function enhanceDetail(){
  const v=$('#view-library');
  const d=$('.topic-detail',v||document);
  if(!d||d.dataset.yb73Enhanced==='1')return;
  const h=d.querySelector('.topic-detail-head');
  const title=h?.querySelector('h2')?.textContent?.trim()||'';
  const {topics,questions}=data();
  const topic=topics.find(t=>String(t.title||t.name||'').trim()===title);
  if(!topic)return;
  const meta=document.createElement('div');
  meta.className='topic-detail-meta';
  meta.innerHTML=`<div><b>${countFor(topic,questions)}</b><span>soru</span></div><div><b>${Number(topic.minutes||10)}</b><span>dakika</span></div><div><b>${(topic.bullets||[]).length}</b><span>temel bilgi</span></div><div><b>${esc(topic.level||'KPSS')}</b><span>Ã¶ncelik</span></div>`;
  const cols=d.querySelector('.detail-columns');
  if(cols)cols.insertAdjacentElement('beforebegin',meta);
  const h3=d.querySelector('.detail-columns h3');
  if(h3)h3.textContent=`Temel bilgiler â€¢ ${(topic.bullets||[]).length} kritik nokta`;
  d.dataset.yb73Enhanced='1';
}
function run(){enhanceLibrary();enhanceDetail()}
document.addEventListener('yb:navigate',e=>setTimeout(()=>{if(e.detail?.view==='library')run()},60));
new MutationObserver(()=>setTimeout(run,30)).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',()=>setTimeout(run,160));
setTimeout(run,300);
})();


/* ── v74-home-library.js ── */
/* Yurdunu Bil 74 â€” enriched library home */
(()=>{'use strict';
if(window.__YB74_HOME__)return;window.__YB74_HOME__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const topics=()=>Array.isArray(window.TOPICS)?window.TOPICS:[];
const questions=()=>Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:[];
const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
function state(){try{return JSON.parse(localStorage.getItem('yb_state_70')||'{}')}catch{return {}}}
function results(){const r=state().results;return Array.isArray(r)?r:[]}
function topicQuestions(id){return questions().filter(q=>String(q.topic||'')===String(id)).length}
function highTopic(){return topics().find(t=>/yÃ¼ksek/i.test(t.level||''))||topics()[0];}
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
   const name=(document.querySelector('#top-name')?.textContent||'Ã–ÄŸrenci').trim().split(/\s+/)[0]||'Ã–ÄŸrenci';
   const totalNotes=topics().reduce((n,t)=>n+(Array.isArray(t.bullets)?t.bullets.length:0),0);
   const focus=highTopic();
   const home=document.createElement('section');
   home.className='library-home';
   home.innerHTML=`<section class="library-hero">
     <div class="library-hero-copy">
       <span class="library-hero-kicker"><i></i> KPSS COÄRAFYA â€¢ BUGÃœN</span>
       <h2>HazÄ±rsan <strong>${esc(name)}</strong>, baÅŸlayalÄ±m.</h2>
       <p>Bilgiyi sadece okumak deÄŸil, hatÄ±rlamak iÃ§in Ã§alÄ±ÅŸ. Ã–nce yÃ¼ksek getirili konuyu seÃ§, ardÄ±ndan sorularla kendini sÄ±nayarak oyun merkezine geÃ§.</p>
       <div class="library-hero-actions">
         <button class="btn primary" data-yb74-topic="${esc(focus?.id||'')}">ğŸ§­ ${esc(focus?.title||'Konuya baÅŸla')} â†’</button>
         <button class="btn secondary" data-yb74-events>âš¡ HÄ±zlÄ± teste geÃ§</button>
       </div>
     </div>
     <div class="library-hero-side">
       <div class="library-stat accent"><b>${topics().length}</b><span>ana konu</span></div>
       <div class="library-stat"><b>${questions().length}+</b><span>soru</span></div>
       <div class="library-stat"><b>${totalNotes}</b><span>temel bilgi</span></div>
       <div class="library-stat"><b>${last?pct+'%':'â€”'}</b><span>son test doÄŸruluÄŸu</span></div>
     </div>
   </section>
   <section class="library-focus">
     <div class="library-focus-copy">
       <span>BugÃ¼nÃ¼n rotasÄ±</span>
       <h3>${esc(focus?.title||'Ä°lk konunu seÃ§')}</h3>
       <p>${esc(focus?.desc||'KÃ¼tÃ¼phaneden bir konu seÃ§erek Ã¶ÄŸrenme turuna baÅŸla.')}</p>
       <div class="library-focus-progress"><div class="library-progress"><i style="width:${pct}%"></i></div><b>${last?pct+'% son performans':'Ä°lk turunu baÅŸlat'}</b></div>
     </div>
     <button class="btn secondary" data-yb74-topic="${esc(focus?.id||'')}">Ã‡alÄ±ÅŸmaya baÅŸla</button>
   </section>`;
   toolbar.parentNode.insertBefore(home,toolbar);
 }
 if(!$('.library-topic-head',v)){
   const head=document.createElement('div');head.className='library-topic-head';head.innerHTML=`<div><span class="eyebrow">KONU KÃœTÃœPHANESÄ°</span><h2>Konunu seÃ§ ve ilerle</h2><p>Her kart kÄ±sa tekrar iÃ§in tasarlandÄ±; detaydan sonra doÄŸrudan Ã§alÄ±ÅŸma modÃ¼llerine geÃ§ebilirsin.</p></div><div class="library-topic-sort"><button class="active" type="button" data-yb74-sort="default">TÃ¼mÃ¼</button><button type="button" data-yb74-sort="high">YÃ¼ksek getiri</button><button type="button" data-yb74-sort="short">KÄ±sa konular</button></div>`;
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
   if(mode==='high')return (/yÃ¼ksek/i.test(b.dataset.level||'')?1:0)-(/yÃ¼ksek/i.test(a.dataset.level||'')?1:0)||(Number(a.dataset.qcount)-Number(b.dataset.qcount));
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


/* ── v78-events-center.js ── */
/* Yurdunu Bil 78 â€” games-only events center */
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
  <div class="events-hero-copy"><span class="events-kicker"><i></i> OYUN MERKEZÄ° â€¢ CANLI</span><h2>BugÃ¼n nasÄ±l <strong>oynayacaksÄ±n?</strong></h2><p>KonularÄ± mini oyunlarla pekiÅŸtir. HÄ±zÄ±nÄ±, dikkatini ve bilgini farklÄ± oyun modlarÄ±nda test et.</p><div class="events-hero-actions"><button class="btn primary" data-yb78-action="sprint">âš¡ HÄ±zlÄ± tur baÅŸlat</button><button class="btn secondary" data-yb78-action="random">ğŸ¯ Rastgele oyun</button></div></div>
  <div class="events-hero-stats"><div class="events-stat accent"><b>${questions().length}+</b><span>soru havuzu</span></div><div class="events-stat"><b>6</b><span>mini oyun</span></div><div class="events-stat"><b>âˆ</b><span>tekrar</span></div><div class="events-stat"><b>${acc===null?'â€”':acc+'%'}</b><span>ortalama doÄŸruluk</span></div></div>
 </section>
 <section class="events-quick-grid">
  <article class="events-quick primary-card"><div class="events-quick-icon">âš¡</div><div class="events-quick-copy"><span>En hÄ±zlÄ± rota</span><h3>Bilgi Sprinti</h3><p>60 saniyede mÃ¼mkÃ¼n olduÄŸunca Ã§ok doÄŸru yap.</p></div><button class="btn primary" data-yb78-action="sprint">Oyna</button></article>
  <article class="events-quick"><div class="events-quick-icon">ğŸ¯</div><div class="events-quick-copy"><span>GÃ¼nlÃ¼k hedef</span><h3>10 soru tamamla</h3><p>KÄ±sa bir turla bugÃ¼nkÃ¼ serini baÅŸlat.</p></div><button class="btn secondary" data-yb78-action="ten">BaÅŸla</button></article>
  <article class="events-quick"><div class="events-quick-icon">ğŸ”¥</div><div class="events-quick-copy"><span>Seri hedefi</span><h3>Serini bÃ¼yÃ¼t</h3><p>Arka arkaya doÄŸru cevaplarla rekorunu zorla.</p></div><button class="btn secondary" data-yb78-action="streak">BaÅŸla</button></article>
 </section>
 <div class="events-section-head"><div><span class="eyebrow">OYUN MODLARI</span><h2>FarklÄ± refleksler, aynÄ± hedef.</h2><p>Her mod KPSS coÄŸrafya soru havuzundan beslenir.</p></div></div>
 <section class="events-mode-grid">
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">âš¡</div><span>SÃœRE</span></div><h3>Bilgi Sprinti</h3><p>Zamana karÅŸÄ± hÄ±zlÄ± cevap ver, doÄŸru sayÄ±nÄ± maksimuma Ã§Ä±kar.</p><div class="events-mode-foot"><small>60 sn</small><button class="btn secondary" data-yb78-game="sprint">BaÅŸla â†’</button></div></article>
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">ğŸ”Ÿ</div><span>KLASÄ°K</span></div><h3>10â€™da 10</h3><p>10 soruyu tamamla, seri bonuslarÄ±yla puanÄ±nÄ± yÃ¼kselt.</p><div class="events-mode-foot"><small>10 soru</small><button class="btn secondary" data-yb78-game="ten">BaÅŸla â†’</button></div></article>
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">ğŸ’¡</div><span>TAKTÄ°K</span></div><h3>Ä°pucu AvÄ±</h3><p>YanlÄ±ÅŸ ÅŸÄ±klarÄ± eleyerek puanÄ± akÄ±llÄ±ca kullan.</p><div class="events-mode-foot"><small>8 soru</small><button class="btn secondary" data-yb78-game="hint">BaÅŸla â†’</button></div></article>
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">â¤ï¸</div><span>ELEME</span></div><h3>3 Can</h3><p>ÃœÃ§ hata hakkÄ±nÄ± yÃ¶net ve mÃ¼mkÃ¼n olduÄŸunca uzaÄŸa git.</p><div class="events-mode-foot"><small>12 soru</small><button class="btn secondary" data-yb78-game="lives">BaÅŸla â†’</button></div></article>
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">ğŸ”¥</div><span>SERÄ°</span></div><h3>Seri UstasÄ±</h3><p>Tek yanlÄ±ÅŸla serinin bozulduÄŸu baskÄ±lÄ± kÄ±sa tur.</p><div class="events-mode-foot"><small>8 soru</small><button class="btn secondary" data-yb78-game="streak">BaÅŸla â†’</button></div></article>
  <article class="events-mode-card"><div class="events-mode-top"><div class="events-mode-icon">ğŸŒ</div><span>BÃ–LGELER</span></div><h3>BÃ¶lge Blitz</h3><p>TÃ¼rkiye'nin bÃ¶lgelerini hÄ±zlÄ±ca ayÄ±rt ve puanÄ± kap.</p><div class="events-mode-foot"><small>8 soru</small><button class="btn secondary" data-yb78-game="region">BaÅŸla â†’</button></div></article>
 </section>
 <div class="events-footer-note"><b>ğŸ’¡ DÃ¶ngÃ¼:</b> kÃ¼tÃ¼phaneden Ã§alÄ±ÅŸ â†’ oyunda pekiÅŸtir â†’ skorunu yÃ¼kselt.</div>
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


/* ── v79-arena-matchmaking.js ── */
/* Yurdunu Bil 79 â€” mode-first Arena matchmaking */
(()=>{'use strict';
if(window.__YB79_ARENA__)return;window.__YB79_ARENA__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const MODES={duel:{icon:'âš”ï¸',title:'Klasik DÃ¼ello',desc:'25 sn â€¢ dengeli puanlama'},speed:{icon:'âš¡',title:'HÄ±z ArenasÄ±',desc:'15 sn â€¢ hÄ±z bonusu'},chain:{icon:'ğŸ”—',title:'Bilgi Zinciri',desc:'seri odaklÄ± â€¢ baskÄ± yÃ¼ksek'}};
function open(){
 const arena=$('#modal-root');if(!arena)return;
 const wrap=document.createElement('div');wrap.className='yb79-match-modal';
 wrap.innerHTML=`<div class="yb79-match-backdrop"></div><section class="yb79-match-card"><button class="yb79-match-close" aria-label="Kapat">Ã—</button><span class="ybArenaKicker">CANLI ARENA</span><h2>Ã–nce oyun modunu seÃ§.</h2><p>Rakip aramadan Ã¶nce nasÄ±l yarÄ±ÅŸacaÄŸÄ±nÄ± belirle. SeÃ§imini yaptÄ±ktan sonra Arena doÄŸrudan bu modda eÅŸleÅŸme baÅŸlatacak.</p><div class="yb79-mode-picker">${Object.entries(MODES).map(([id,m])=>`<button type="button" class="yb79-mode-option" data-mode="${id}"><span class="yb79-mode-check">âœ“</span><span class="yb79-mode-icon">${m.icon}</span><b>${m.title}</b><small>${m.desc}</small></button>`).join('')}</div><div class="yb79-match-actions"><span class="yb79-selected-label">SeÃ§ili mod:</span><span class="yb79-mode-badge" data-selected></span><button class="btn primary" data-start>Arena'da rakip ara â†’</button></div></section>`;
 arena.appendChild(wrap);
 let selected=localStorage.getItem('yb_arena_mode_pref')||'duel';if(!MODES[selected])selected='duel';
 const select=id=>{selected=id;$$('.yb79-mode-option',wrap).forEach(b=>b.classList.toggle('active',b.dataset.mode===id));const m=MODES[id];const s=$('[data-selected]',wrap);if(s)s.textContent=`${m.icon} ${m.title}`};
 select(selected);
 $$('[data-mode]',wrap).forEach(b=>b.addEventListener('click',()=>select(b.dataset.mode)));
 const close=()=>wrap.remove();$('.yb79-match-backdrop',wrap)?.addEventListener('click',close);$('.yb79-match-close',wrap)?.addEventListener('click',close);
 $('[data-start]',wrap)?.addEventListener('click',()=>{localStorage.setItem('yb_arena_mode_pref',selected);close();setTimeout(()=>startSelectedMode(selected),80)});
}
function startSelectedMode(mode){
 window.YBArena?.open?.();
 setTimeout(()=>{
   const v=$('#view-events');if(!v)return;
   const b=$(`.ybArenaModes button[data-arena-mode="${CSS.escape(mode)}"]`,v);
   if(b)b.click();
   setTimeout(()=>{
     const find=$('[data-arena-action="matchmake"]',v);
     if(find)find.click();
   },90);
 },180);
}
function bind(){
 const v=$('#view-events');if(!v||!v.classList.contains('active'))return;
 $$('[id="open-arena"], [data-yb78-action="arena"]',v).forEach(b=>{if(b.dataset.yb79Bound)return;b.dataset.yb79Bound='1';b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();open()},true)});
 $$('[data-yb55-arena]',v).forEach(b=>{if(b.dataset.yb79Bound)return;b.dataset.yb79Bound='1';b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();open()},true)});
}
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='events')setTimeout(bind,120)});
window.addEventListener('load',()=>setTimeout(bind,250));
setInterval(bind,1200);
window.YB79Arena={open,startSelectedMode};
})();


/* ── v80-progress-center.js ── */
/* Yurdunu Bil 80 â€” progression & daily motivation */
(()=>{'use strict';
if(window.__YB80_PROGRESS__)return;window.__YB80_PROGRESS__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='yb52_progress_v1';
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
function progress(){const p=read();return {xp:Number(p.xp||0),answers:Number(p.answers||0),correct:Number(p.correct||0),streak:Number(p.streak||0),bestStreak:Number(p.bestStreak||0),daily:p.daily||{date:'',answers:0,correct:0}}}
function levelFromXp(xp){let level=1,need=120,spent=0;while(xp>=spent+need&&level<50){spent+=need;level++;need=Math.round(120+level*35)}return {level,spent,need,inLevel:xp-spent}}
function today(){return new Date().toLocaleDateString('en-CA',{timeZone:'Europe/Istanbul'})}
function enhance(){const v=$('#view-events');if(!v||!v.classList.contains('active')||$('.progress-panel',v))return;const p=progress(),lv=levelFromXp(p.xp),pct=Math.max(0,Math.min(100,Math.round(lv.inLevel/lv.need*100))),daily=p.daily?.date===today()?p.daily:{answers:0,correct:0};
 const anchor=$('.events-quick-grid',v)||$('.events-hero',v);if(!anchor)return;
 const panel=document.createElement('section');panel.className='progress-panel';panel.innerHTML=`<div class="progress-level"><b>${lv.level}</b></div><div class="progress-copy"><span>OYUNCU GELÄ°ÅÄ°MÄ°</span><h3>Seviye ${lv.level} â€¢ ${p.xp} XP</h3><p>${lv.need-lv.inLevel} XP sonra yeni seviyedesin.</p><div class="progress-track"><i style="width:${pct}%"></i></div><div class="progress-percent">${pct}% seviye ilerlemesi</div></div><div class="progress-mini"><div><b>${p.streak}</b><span>aktif seri</span></div><div><b>${p.bestStreak}</b><span>rekor seri</span></div><div><b>${p.correct}</b><span>doÄŸru</span></div></div>`;
 anchor.parentNode.insertBefore(panel,anchor.nextSibling);
 const dailyCard=document.createElement('section');dailyCard.className='daily-card';dailyCard.innerHTML=`<div class="daily-icon">ğŸ¯</div><div class="daily-copy"><span>BUGÃœNÃœN GÃ–REVÄ°</span><h3>5 doÄŸru cevap yap</h3><p>BugÃ¼nkÃ¼ mini oyun veya aktif hatÄ±rlama turunda 5 doÄŸruyu tamamla.</p></div><div class="daily-state"><b>${Math.min(5,daily.correct)}/5</b><span>${daily.correct>=5?'TamamlandÄ±':'devam ediyor'}</span></div>`;
 panel.insertAdjacentElement('afterend',dailyCard);
}
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='events')setTimeout(enhance,110)});window.addEventListener('load',()=>setTimeout(enhance,220));setInterval(enhance,1800);
})();


/* ── v81-navigation.js ── */
/* Yurdunu Bil 81 â€” dedicated Arena in primary navigation */
(()=>{'use strict';
if(window.__YB81_NAV__)return;window.__YB81_NAV__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function install(){
 const nav=$('.side-nav');if(!nav)return;
 let arena=$('.yb81-nav-item.yb81-arena',nav);
 if(!arena){
   arena=document.createElement('button');arena.type='button';arena.className='yb81-nav-item yb81-arena';arena.innerHTML='<span class="yb81-icon">âš”</span><span>Arena</span>';
   const events=$('.nav-item[data-view="events"]',nav);
   if(events)events.parentNode.insertBefore(arena,events);else nav.appendChild(arena);
 }
 if(!arena.dataset.bound){arena.dataset.bound='1';arena.addEventListener('click',()=>window.YBArena?.open?.())}
 const events=$('.nav-item[data-view="events"]',nav);
 if(events){events.innerHTML='<span>â—ˆ</span>Etkinlikler & Oyunlar'}
 const quick=$('.quick-test');if(quick&&!quick.dataset.yb81Bound){quick.dataset.yb81Bound='1';quick.textContent='âš¡ HÄ±zlÄ± Oyuna BaÅŸla  â†’';quick.addEventListener('click',()=>{const b=$('.nav-item[data-view="events"]',nav);b?.click()})}
}
function markEvents(){const v=$('#view-events');if(v)v.classList.add('events-games-only')}
function run(){install();markEvents()}
window.addEventListener('load',()=>setTimeout(run,80));setInterval(run,1000);document.addEventListener('yb:navigate',run);
})();


/* ── v86-system-clean.js ── */
/* Yurdunu Bil 86 â€” single navigation owner + no flash transitions */
(()=>{'use strict';
if(window.__YB86_CLEAN__)return;window.__YB86_CLEAN__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function openHome(){const v=$('#view-home');if(!v)return;$$('.view').forEach(x=>x.classList.remove('active'));v.classList.add('active');$$('.nav-item,.yb81-nav-item').forEach(x=>x.classList.remove('active'));$('.yb81-home-nav')?.classList.add('active');const t=$('#page-title');if(t)t.textContent='Ana Sayfa';window.dispatchEvent(new CustomEvent('yb:navigate',{detail:{view:'home'}}));window.scrollTo({top:0,behavior:'instant'});}
function dedupeHome(){const nav=$('.side-nav');if(!nav)return;const homes=$$('.yb81-home-nav,.yb82-home-nav',nav);if(!homes.length)return;const keep=homes[0];homes.slice(1).forEach(x=>x.remove());keep.classList.add('yb86-home-single');if(keep.dataset.yb86Bound)return;keep.dataset.yb86Bound='1';keep.onclick=e=>{e.preventDefault();e.stopPropagation();openHome()};}
function noFlash(){
 document.addEventListener('click',e=>{
  const topic=e.target.closest('[data-yb82-topic],[data-yb83-topic]');
  if(topic){e.preventDefault();e.stopImmediatePropagation();const id=topic.dataset.yb82Topic||topic.dataset.yb83Topic;const lib=$('.nav-item[data-view="library"]');lib?.click();const target=$(`[data-open-topic="${CSS.escape(id)}"]`);target?.click();return;}
  const game=e.target.closest('[data-yb82-game]');
  if(game){e.preventDefault();e.stopImmediatePropagation();const events=$('.nav-item[data-view="events"]');events?.click();window.YB55Games?.start?.('sprint');return;}
 },true);
}
function cleanEvents(){const v=$('#view-events');if(!v?.classList.contains('active'))return;$$('.arena-entry,.events-arena-strip,.yb55-arena-restore,#open-arena,#open-social,[data-yb78-action="arena"],[data-yb55-arena],[data-yb55-social]',v).forEach(x=>x.remove());v.classList.add('yb86-games-only');}
new MutationObserver(()=>{dedupeHome();cleanEvents()}).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',()=>{dedupeHome();noFlash();cleanEvents();setTimeout(dedupeHome,250);setTimeout(cleanEvents,250)});
document.addEventListener('yb:navigate',()=>{dedupeHome();setTimeout(cleanEvents,0)});
setInterval(dedupeHome,700);setInterval(cleanEvents,700);
})();


/* ── v90-library-compact.js ── */
/* Yurdunu Bil 90 â€” library focus controller */
(()=>{'use strict';if(window.__YB90_LIBRARY__)return;window.__YB90_LIBRARY__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function mount(){const v=$('#view-library');if(!v?.classList.contains('active'))return;const grid=$('.study-module-grid',v);const zone=$('.study-zone',v);if(!grid||!zone||$('.yb90-library-toolbar',zone))return;const cards=$$('.study-module',grid);if(!cards.length)return;const toolbar=document.createElement('div');toolbar.className='yb90-library-toolbar';toolbar.innerHTML=`<span><b>${cards.length}</b> Ã§alÄ±ÅŸma modÃ¼lÃ¼ Â· Ä°lk ekranda odaklan, gerektiÄŸinde tÃ¼mÃ¼nÃ¼ aÃ§.</span><button type="button" class="btn secondary yb90-show-more">TÃ¼m modÃ¼lleri gÃ¶ster</button>`;grid.parentElement.insertBefore(toolbar,grid);cards.forEach((c,i)=>{if(i>=12)c.classList.add('yb90-hidden-module')});const btn=$('.yb90-show-more',toolbar);btn.onclick=()=>{const hidden=cards.filter(c=>c.classList.contains('yb90-hidden-module'));const show=hidden.length>0;cards.forEach(c=>c.classList.toggle('yb90-hidden-module',!show&&false));if(show){cards.forEach(c=>c.classList.remove('yb90-hidden-module'));btn.textContent='Sadece ilk 12 modu gÃ¶ster'}else{cards.forEach((c,i)=>{if(i>=12)c.classList.add('yb90-hidden-module')});btn.textContent='TÃ¼m modÃ¼lleri gÃ¶ster'}toolbar.querySelector('span').innerHTML=show?`<b>${cards.length}</b> Ã§alÄ±ÅŸma modÃ¼lÃ¼ Â· Tam liste aÃ§Ä±k.`:`<b>${cards.length}</b> Ã§alÄ±ÅŸma modÃ¼lÃ¼ Â· Ä°lk 12 modÃ¼l odakta.`};}
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='library')setTimeout(mount,300)});window.addEventListener('load',()=>setTimeout(mount,800));new MutationObserver(()=>setTimeout(mount,180)).observe(document.body,{childList:true,subtree:true});
})();

/* ── v91-learning-bridge.js ── */
/* Yurdunu Bil 91 â€” Supabase learning bridge */
(()=>{'use strict';
if(window.__YB91_LEARNING__)return;window.__YB91_LEARNING__=true;
const $=(s,r=document)=>r.querySelector(s);
const cfg=window.YURDUNUBIL_CONFIG||{};
let sb=null,uid=null;
try{if(cfg.SUPABASE_URL&&cfg.SUPABASE_PUBLISHABLE_KEY&&window.supabase)sb=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY)}catch(e){console.warn('YB91 supabase bridge',e)}
const key='yb91_learning_dashboard';
const save=x=>{try{localStorage.setItem(key,JSON.stringify({...x,saved_at:new Date().toISOString()}))}catch{}};
async function boot(){if(!sb)return;try{const {data}=await sb.auth.getSession();uid=data?.session?.user?.id||null;if(uid)await refresh();sb.auth.onAuthStateChange(async(_,s)=>{uid=s?.user?.id||null;if(uid)await refresh()})}catch(e){console.warn('YB91 learning boot',e)}}
async function refresh(){if(!sb||!uid)return null;try{const {data,error}=await sb.rpc('get_learning_dashboard');if(error)throw error;save(data||{});window.YB91LearningDashboard=data||{};window.dispatchEvent(new CustomEvent('yb:learning-refresh',{detail:data||{}}));return data||{}}catch(e){console.warn('YB91 dashboard',e);return null}}
async function record(q,correct,sessionId){if(!sb||!uid||!q?.id)return;try{const source=String(q.id)+':'+String(sessionId||'single');const r=await sb.rpc('record_learning_answer',{p_topic_id:String(q.topic||'genel'),p_correct:!!correct,p_source_id:source,p_difficulty:Math.max(1,Math.min(5,Number(q.difficultyLevel||({kolay:2,orta:3,zor:5}[q.difficulty]||3))))});if(r.error)throw r.error;if(r.data&&!r.data.duplicate)window.YB91LearningLast=r.data;await refresh()}catch(e){console.warn('YB91 record answer',e)}}
function watchQuiz(){document.addEventListener('click',e=>{const b=e.target.closest('#yb88-quiz [data-answer]');if(!b)return;const root=$('#yb88-quiz');if(!root)return;const session=root.dataset.yb91Session||(root.dataset.yb91Session=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8));setTimeout(()=>{const modal=$('#yb88-quiz .yb88-q-modal');if(!modal)return;const text=modal.querySelector('h2')?.textContent?.trim()||'';const q=(Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:[]).find(x=>String(x.q||'').trim()===text);if(!q)return;record(q,b.classList.contains('correct'),session)},0)})}
window.YB91Learning={refresh,record};
watchQuiz();boot();
})();


/* ── v92-system-audit.js ── */
/* Yurdunu Bil 96 â€” NavigationKernel: tÃ¼m buton/link/sekme sorunlarÄ±nÄ± yakala ve dÃ¼zelt */
(()=>{
'use strict';
if(window.__YB96_KERNEL__)return;
window.__YB96_KERNEL__=true;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const ROUTES=new Set(['home','library','events','settings']);
const LABELS={home:'Ana Sayfa',library:'KÃ¼tÃ¼phane',events:'Etkinlikler & Oyunlar',settings:'Ayarlar'};

/* â”€â”€â”€ Tema kalÄ±cÄ± yÃ¼kleme â”€â”€â”€ */
try{
  const saved=localStorage.getItem('yb_theme');
  if(saved==='light')document.body.classList.add('light');
  else if(saved==='dark')document.body.classList.remove('light');
}catch{}

/* â”€â”€â”€ Navigasyon â”€â”€â”€ */
function syncViews(v){
  v=ROUTES.has(v)?v:'home';
  window.YURDUNUBIL_ROUTE=v;
  $$('.view').forEach(el=>el.classList.toggle('active',el.id==='view-'+v));
  /* nav-item'larÄ± gÃ¼ncelle */
  $$('.nav-item[data-view]').forEach(el=>el.classList.toggle('active',el.dataset.view===v));
  $$('.yb82-home-nav, .yb81-nav-item.yb82-home-nav').forEach(el=>el.classList.toggle('active',v==='home'));
  /* Arena butonu hiÃ§bir zaman aktif gÃ¶rÃ¼nmemeli */
  $$('.yb81-arena').forEach(el=>el.classList.remove('active'));
  /* Sayfa baÅŸlÄ±ÄŸÄ± */
  const pt=$('#page-title');if(pt)pt.textContent=LABELS[v]||v;
  /* Scroll sÄ±fÄ±rla */
  const pw=$('#page-wrap');if(pw)pw.scrollTop=0;
  return v;
}

function navigate(v){
  if(!ROUTES.has(v))v='home';
  syncViews(v);
  window.dispatchEvent(new CustomEvent('yb:navigate',{detail:{view:v}}));
  if(v==='home'){
    setTimeout(()=>window.YB90Home?.render?.(),0);
  }
}

/* YardÄ±mcÄ±: drawer ve profil kapat */
function closeDrawer(){
  $('#sidebar')?.classList.remove('open');
  $('#drawer-backdrop')?.classList.remove('open');
}
function openDrawer(){
  $('#sidebar')?.classList.add('open');
  $('#drawer-backdrop')?.classList.add('open');
}
function closeProfile(){$('#profile-menu')?.classList.add('hidden')}

/* Tema toggle */
function toggleTheme(){
  const toLight=!document.body.classList.contains('light');
  document.body.classList.toggle('light',toLight);
  try{localStorage.setItem('yb_theme',toLight?'light':'dark')}catch{}
  /* app.js state ile senkronize et */
  if(window.YURDUNUBIL_STATE){
    window.YURDUNUBIL_STATE.theme=toLight?'light':'dark';
    try{localStorage.setItem('yb_state_70',JSON.stringify(window.YURDUNUBIL_STATE))}catch{}
  }
}

/* Logout */
function logout(){
  try{localStorage.removeItem('yb_demo_session_70')}catch{}
  /* Supabase oturumu varsa kapat */
  const cfg=window.YURDUNUBIL_CONFIG||{};
  if(cfg.SUPABASE_URL&&cfg.SUPABASE_PUBLISHABLE_KEY&&window.supabase){
    try{
      const sb=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY);
      sb.auth.signOut().finally(()=>location.reload());
      return;
    }catch{}
  }
  location.reload();
}

/* â”€â”€â”€ Merkezi tÄ±klama yÃ¶nlendirici (capture phase) â”€â”€â”€ */
function handle(e){
  const el=e.target?.closest?.('button,[role="button"],a');
  if(!el||!document.contains(el))return;

  /* === Topbar === */
  if(el.id==='theme-btn'){
    e.preventDefault();e.stopImmediatePropagation();
    toggleTheme();return;
  }
  if(el.id==='profile-btn'){
    e.preventDefault();e.stopImmediatePropagation();
    $('#profile-menu')?.classList.toggle('hidden');return;
  }
  if(el.id==='menu-btn'){
    e.preventDefault();e.stopImmediatePropagation();
    openDrawer();return;
  }
  if(el.id==='sidebar-close'){
    e.preventDefault();e.stopImmediatePropagation();
    closeDrawer();return;
  }

  /* === Drawer backdrop === */
  if(el.id==='drawer-backdrop'||e.target?.id==='drawer-backdrop'){
    closeDrawer();return;
  }

  /* === Logout === */
  if(el.id==='logout-btn'||el.id==='menu-logout'){
    e.preventDefault();e.stopImmediatePropagation();
    if(confirm('Ã‡Ä±kÄ±ÅŸ yapmak istediÄŸinden emin misin?'))logout();
    return;
  }

  /* === Arena sidebar butonu === */
  if(el.classList.contains('yb81-arena')||el.id==='sidebar-arena-btn'){
    e.preventDefault();e.stopImmediatePropagation();
    closeDrawer();closeProfile();
    window.YBArena?.open?.();
    return;
  }

  /* === Quick test (hÄ±zlÄ± oyuna baÅŸla) === */
  if(el.classList.contains('quick-test')){
    e.preventDefault();e.stopImmediatePropagation();
    navigate('events');closeDrawer();return;
  }

  /* === data-view yÃ¶nlendirme === */
  const dv=el.dataset?.view||el.closest('[data-view]')?.dataset?.view;
  if(ROUTES.has(dv)){
    e.preventDefault();e.stopImmediatePropagation();
    navigate(dv);closeDrawer();closeProfile();return;
  }

  /* === data90 ana sayfa butonlarÄ± === */
  const d90=el.getAttribute('data90');
  if(d90){
    e.preventDefault();e.stopImmediatePropagation();
    if(d90==='library'||d90==='events'||d90==='settings')navigate(d90);
    else if(d90==='home')navigate('home');
    else if(d90==='arena')window.YBArena?.open?.();
    else if(d90==='wrong'){
      const fn=window.YB88QuestionCenter?.openQuiz;
      if(fn)fn('wrong');
      else{navigate('library');setTimeout(()=>$('#yb88-start-wrong')?.click(),150)}
    }
    closeDrawer();closeProfile();return;
  }

  /* === data90topic konu butonu === */
  const dt=el.getAttribute('data90topic');
  if(dt){
    e.preventDefault();e.stopImmediatePropagation();
    navigate('library');
    setTimeout(()=>document.querySelector(`[data-open-topic="${CSS.escape(dt)}"]`)?.click(),120);
    closeDrawer();closeProfile();return;
  }

  /* === Oyun baÅŸlatma === */
  const g=el.dataset?.yb55Game||el.dataset?.game;
  if(g){
    e.preventDefault();e.stopImmediatePropagation();
    window.YB55Games?.start?.(g);return;
  }
  if(el.hasAttribute('data-yb55-arena')){
    e.preventDefault();e.stopImmediatePropagation();
    window.YBArena?.open?.();return;
  }
  if(el.hasAttribute('data-yb55-social')){
    e.preventDefault();e.stopImmediatePropagation();
    window.YB53Social?.open?.()||window.YBArena?.open?.();return;
  }

  /* === Etkinlikler sayfasÄ± arena/sosyal butonlarÄ± === */
  if(el.id==='open-arena'){
    e.preventDefault();e.stopImmediatePropagation();
    window.YBArena?.open?.();return;
  }
  if(el.id==='open-social'){
    e.preventDefault();e.stopImmediatePropagation();
    window.YB53Social?.open?.();return;
  }

  /* === Arena aksiyon butonlarÄ± === */
  const aa=el.dataset?.arenaAction;
  if(aa){
    /* arena-v1.js kendi handler'Ä±nÄ± yÃ¶netir, mÃ¼dahale etme */
    return;
  }
}

document.addEventListener('click',handle,true);

/* Backdrop tÄ±klamasÄ± (element deÄŸil, overlay) */
document.addEventListener('click',e=>{
  if(e.target?.id==='drawer-backdrop')closeDrawer();
},false);

/* â”€â”€â”€ Sidebar bÃ¼tÃ¼nlÃ¼k kontrolÃ¼ â”€â”€â”€ */
function auditSidebar(){
  const nav=$('.side-nav');if(!nav)return;

  /* Ana sayfa butonu â€” data-view='home' olmalÄ± */
  const homeBtn=$('.yb82-home-nav',nav);
  if(homeBtn&&!homeBtn.dataset.view)homeBtn.dataset.view='home';

  /* Arena butonu â€” click handler */
  const arenaBtn=$('.yb81-arena',nav)||$('#sidebar-arena-btn',nav);
  if(arenaBtn&&!arenaBtn.dataset.auditBound){
    arenaBtn.dataset.auditBound='1';
    arenaBtn.addEventListener('click',()=>{
      closeDrawer();
      window.YBArena?.open?.();
    });
  }

  /* TÃ¼m nav butonlarÄ± type=button */
  $$('button',nav).forEach(b=>{if(!b.type)b.type='button'});
}

/* â”€â”€â”€ Etkinlikler sayfasÄ± tamamlama â”€â”€â”€ */
function auditEventsPage(){
  const v=$('#view-events');
  if(!v||!v.classList.contains('active'))return;

  /* Arena ve sosyal butonlarÄ± â€” varsa baÄŸla */
  const ob=$('#open-arena',v);
  if(ob&&!ob.dataset.evtBound){
    ob.dataset.evtBound='1';
    ob.addEventListener('click',()=>window.YBArena?.open?.());
  }
  const os=$('#open-social',v);
  if(os&&!os.dataset.evtBound){
    os.dataset.evtBound='1';
    os.addEventListener('click',()=>window.YB53Social?.open?.());
  }
}

/* â”€â”€â”€ Genel eksik baÄŸlantÄ± taramasÄ± â”€â”€â”€ */
function auditAllButtons(){
  /* Sayfada data-view olan ama baÄŸlanmamÄ±ÅŸ tÃ¼m butonlara gÃ¼venlik aÄŸÄ± */
  $$('[data-view]').forEach(el=>{
    const v=el.dataset.view;
    if(!ROUTES.has(v))return;
    if(el.dataset.auditNav)return;
    el.dataset.auditNav='1';
    /* Capture handler zaten yakalar ama ek gÃ¼vence */
  });

  auditSidebar();
  auditEventsPage();
}

/* â”€â”€â”€ Periyodik denetim â”€â”€â”€ */
document.addEventListener('yb:navigate',e=>{
  if(ROUTES.has(e.detail?.view)){
    syncViews(e.detail.view);
    setTimeout(auditEventsPage,150);
  }
});

new MutationObserver(()=>setTimeout(auditAllButtons,80))
  .observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});

window.addEventListener('load',()=>{
  auditAllButtons();
  /* Tema kalÄ±cÄ±lÄ±ÄŸÄ± */
  try{
    const t=localStorage.getItem('yb_theme');
    if(t==='light')document.body.classList.add('light');
  }catch{}
  /* Ä°lk render */
  const cur=window.YURDUNUBIL_ROUTE||'home';
  syncViews(cur);
  setTimeout(()=>{
    if(!$('#app-shell')?.classList.contains('hidden'))window.YB90Home?.render?.();
  },200);
});

setInterval(auditAllButtons,2000);

/* Global eriÅŸim */
window.navigate=navigate;
window.YBAppNavigate=navigate;
window.YB96Kernel={navigate,syncViews,auditAllButtons,toggleTheme,logout};

/* â”€â”€â”€ Konsol Ã¶zet raporu â”€â”€â”€ */
window.addEventListener('load',()=>setTimeout(()=>{
  const total=$$('button').length+$$('[role="button"]').length;
  const unbound=$$('button:not([data-view]):not([id]):not([class*="nav"]):not([class*="btn"]):not([data-arena]):not([data90]):not([data-yb55])').length;
  console.groupCollapsed('[YB96 Kernel] Navigasyon Denetimi');
  console.log(`Toplam buton: ${total}`);
  console.log(`Soru bankasÄ±: ${Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK.length:0} soru`);
  console.log(`Konular: ${Array.isArray(window.TOPICS)?window.TOPICS.length:0}`);
  console.log('Ã‡alÄ±ÅŸan modÃ¼ller:', [
    window.__YB55_GAMES__&&'YB55Games',
    window.__YB_ARENA_V1__&&'ArenaV1',
    window.__YB53_SOCIAL__&&'SocialArena',
    window.__YB88_QUESTION_CENTER__&&'QuestionCenter',
    window.__YB90_HOME__&&'HomeV2',
    window.__YB79_ARENA__&&'Matchmaking',
    window.__YB81_NAV__&&'Navigation',
  ].filter(Boolean).join(', '));
  console.groupEnd();
},600));

})();

