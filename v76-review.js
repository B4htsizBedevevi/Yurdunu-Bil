/* Yurdunu Bil 76 — active recall mini test */
(()=>{'use strict';
if(window.__YB76_REVIEW__)return;window.__YB76_REVIEW__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const key='yb_review_76';let quiz=null;
function saved(){try{return JSON.parse(localStorage.getItem(key)||'{"done":{},"xp":0,"streak":0}')}catch{return {done:{},xp:0,streak:0}}}
function persist(x){try{localStorage.setItem(key,JSON.stringify(x))}catch{}}
function topicFromModule(el){return el?.dataset.topic||el?.closest('[data-topic]')?.dataset.topic||el?.closest('.study-module')?.dataset.topic||''}
function injectLaunch(){
  $$('.study-module').forEach(m=>{
    if(m.querySelector('.review-launch'))return;
    const topic=m.dataset.topic||''; if(!topic)return;
    const b=document.createElement('div');b.className='review-launch';b.innerHTML=`<div class="review-launch-copy"><span>AKTİF HATIRLAMA</span><b>5 soruyla pekiştir</b><small>Notu okuduktan hemen sonra mini test yap.</small></div><button class="review-launch-btn" type="button" data-review-topic="${esc(topic)}">Başla →</button>`;
    const open=m.querySelector('.study-open');(open||m).appendChild(b);
  });
}
function mountModal(){
  if($('#yb76-review-modal'))return;
  const d=document.createElement('div');d.id='yb76-review-modal';d.innerHTML=`<div class="review-backdrop"></div><section class="review-card" role="dialog" aria-modal="true" aria-labelledby="yb76-title"><div class="review-head"><div><span class="review-kicker">AKTİF HATIRLAMA</span><h2 id="yb76-title">Mini tekrar</h2></div><button class="review-close" type="button" data-review-close>×</button></div><div class="review-progress"><i></i></div><div id="yb76-body"></div></section>`;document.body.appendChild(d);
}
function topicQuestions(topic){
 const bank=Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:[];
 const pool=bank.filter(q=>String(q.topic||'')===String(topic));
 if(pool.length>=5)return shuffle(pool).slice(0,5);
 return shuffle(bank).slice(0,5);
}
function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function topicTitle(topic){const t=(window.TOPICS||[]).find(x=>String(x.id)===String(topic));return t?.title||'Konu Tekrarı'}
function open(topic){
 mountModal();quiz={topic,items:topicQuestions(topic),i:0,correct:0,answered:false};$('#yb76-review-modal').classList.add('show');document.body.classList.add('yb76-review-open');render();
}
function close(){const m=$('#yb76-review-modal');if(m)m.classList.remove('show');document.body.classList.remove('yb76-review-open');quiz=null}
function render(){
 if(!quiz)return;const q=quiz.items[quiz.i],body=$('#yb76-body'),bar=$('.review-progress i');if(!q||!body)return;
 if(bar)bar.style.width=`${Math.round((quiz.i/quiz.items.length)*100)}%`;
 body.innerHTML=`<div class="review-question"><small>Soru ${quiz.i+1} / ${quiz.items.length}</small><h3>${esc(q.q)}</h3><div class="review-options">${(q.options||[]).map((o,i)=>`<button type="button" class="review-option" data-review-answer="${i}">${esc(o)}</button>`).join('')}</div><div class="review-feedback" id="yb76-feedback"></div><button class="btn primary review-next hidden" type="button" id="yb76-next">Sonraki soru →</button></div>`;
 $$('.review-option',body).forEach(b=>b.addEventListener('click',()=>answer(Number(b.dataset.reviewAnswer))));
 $('#yb76-next')?.addEventListener('click',next);
}
function answer(i){if(!quiz||quiz.answered)return;quiz.answered=true;const q=quiz.items[quiz.i],ok=i===Number(q.answer);if(ok)quiz.correct++;$$('.review-option').forEach((b,n)=>{b.disabled=true;if(n===Number(q.answer))b.classList.add('correct');if(n===i&&!ok)b.classList.add('wrong')});const f=$('#yb76-feedback');if(f){f.className='review-feedback '+(ok?'good':'bad');f.textContent=ok?`✓ Doğru! ${q.explain||'Bu bilgiyi doğru hatırladın.'}`:`✕ Yanlış. ${q.explain||'Doğru seçeneği tekrar et.'}`};$('#yb76-next')?.classList.remove('hidden')}
function next(){if(!quiz)return;if(quiz.i<quiz.items.length-1){quiz.i++;quiz.answered=false;render()}else finish()}
function finish(){
 const s=saved(),prev=s.done?.[quiz.topic]||0,pct=Math.round((quiz.correct/quiz.items.length)*100),xpGain=quiz.correct*10;
 const out={...s,done:{...(s.done||{}),[quiz.topic]:Math.max(prev,pct)},xp:(s.xp||0)+xpGain,streak:(quiz.correct===quiz.items.length?(s.streak||0)+1:0)};persist(out);
 const bar=$('.review-progress i');if(bar)bar.style.width='100%';
 const title=quiz.correct===5?'🔥 Mükemmel!':quiz.correct>=4?'💪 Çok iyi!':quiz.correct>=3?'🎯 İyi gidiyor!':'🔁 Bir tekrar daha iyi olur.';
 $('#yb76-body').innerHTML=`<div class="review-finish"><h3>${title}</h3><p>${esc(topicTitle(quiz.topic))} mini tekrarını tamamladın. Yanlışlarını şimdi yeniden okuyup hemen bir oyunla pekiştirebilirsin.</p><div class="review-score"><div><b>${quiz.correct}/5</b><span>doğru</span></div><div><b>%${pct}</b><span>başarı</span></div><div><b>+${xpGain} XP</b><span>kazanıldı</span></div></div><button class="btn primary review-next" type="button" id="yb76-finish-close">Kapat</button></div>`;
 $('#yb76-finish-close').onclick=close;
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-review-topic]');if(b)open(b.dataset.reviewTopic)});
document.addEventListener('click',e=>{if(e.target.matches('[data-review-close],.review-backdrop'))close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#yb76-review-modal')?.classList.contains('show'))close()});
let t=null;function schedule(){clearTimeout(t);t=setTimeout(injectLaunch,80)}
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='library')setTimeout(injectLaunch,120)});
window.addEventListener('load',()=>{mountModal();setTimeout(injectLaunch,150)});
})();
