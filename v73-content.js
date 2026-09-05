/* Yurdunu Bil 73 — library information hierarchy */
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
function levelClass(level){const n=String(level||'').toLocaleLowerCase('tr-TR');return n.includes('yüksek')?'high':n.includes('orta')?'mid':'low'}
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
    meta.innerHTML=`<span class="topic-level ${levelClass(topic.level)}">${esc(topic.level||'KPSS')}</span><span>◷ ${Number(topic.minutes||10)} dk</span><span>❓ ${n} soru</span><span>▣ ${(topic.bullets||[]).length} bilgi</span>`;
    const p=card.querySelector(':scope>p');
    if(p)p.insertAdjacentElement('afterend',meta);
    const btn=card.querySelector('[data-open-topic]');
    if(btn)btn.textContent='Konuya devam et →';
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
  meta.innerHTML=`<div><b>${countFor(topic,questions)}</b><span>soru</span></div><div><b>${Number(topic.minutes||10)}</b><span>dakika</span></div><div><b>${(topic.bullets||[]).length}</b><span>temel bilgi</span></div><div><b>${esc(topic.level||'KPSS')}</b><span>öncelik</span></div>`;
  const cols=d.querySelector('.detail-columns');
  if(cols)cols.insertAdjacentElement('beforebegin',meta);
  const h3=d.querySelector('.detail-columns h3');
  if(h3)h3.textContent=`Temel bilgiler • ${(topic.bullets||[]).length} kritik nokta`;
  d.dataset.yb73Enhanced='1';
}
function run(){enhanceLibrary();enhanceDetail()}
document.addEventListener('yb:navigate',e=>setTimeout(()=>{if(e.detail?.view==='library')run()},60));
new MutationObserver(()=>setTimeout(run,30)).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',()=>setTimeout(run,160));
setTimeout(run,300);
})();
