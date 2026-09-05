/* Yurdunu Bil — library interaction layer */
(()=>{
  'use strict';
  if(window.__YB_LIBRARY_INTERACTIONS__)return;
  window.__YB_LIBRARY_INTERACTIONS__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const topics=()=>Array.isArray(window.TOPICS)?window.TOPICS:[];
  const bank=()=>Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK.filter(q=>q&&q.q&&Array.isArray(q.options)):[];
  const style=()=>{
    if($('#yb-library-interaction-style'))return;
    const s=document.createElement('style');s.id='yb-library-interaction-style';s.textContent=`
      .note-card{cursor:pointer;position:relative}.note-card:focus-within,.note-card:hover{border-color:rgba(67,225,194,.42)}
      .yb-card-questions{margin-top:10px;border:1px solid rgba(75,201,255,.18);border-radius:10px;background:rgba(8,27,42,.55);overflow:hidden}
      .yb-card-questions summary{cursor:pointer;padding:8px 10px;color:#8fe8d0;font-size:10px;font-weight:900;list-style:none}.yb-card-questions summary::-webkit-details-marker{display:none}
      .yb-card-questions summary:after{content:'＋';float:right}.yb-card-questions[open] summary:after{content:'−'}
      .yb-card-q{padding:8px 10px;border-top:1px solid rgba(75,201,255,.12);font-size:10px;line-height:1.5;color:#cfe0ea}.yb-card-q b{color:#54d5ff;margin-right:5px}
      .yb-card-q button{display:block;margin-top:5px;padding:0;border:0;background:none;color:#55d8ff;font-size:9px;font-weight:900;cursor:pointer}
      .yb-topic-picker{display:flex;align-items:center;gap:8px;flex:0 0 auto}.yb-topic-picker select{height:42px;min-width:190px;border:1px solid var(--line);border-radius:11px;background:#0b1b2c;color:#eaf4fa;padding:0 10px;font-size:12px}.yb-topic-test{white-space:nowrap}
      @media(max-width:760px){.yb-topic-picker{width:100%}.yb-topic-picker select{flex:1;min-width:0}.yb-topic-test{width:100%}}
    `;document.head.appendChild(s);
  };
  function topicForCard(card){return topics().find(t=>String(t.id)===String(card.dataset.topicId)||String(t.title||t.name)===String(card.querySelector('h2')?.textContent?.trim()));}
  function addPicker(v){
    const toolbar=$('.library-toolbar',v);if(!toolbar||$('.yb-topic-picker',toolbar))return;
    const picker=document.createElement('label');picker.className='yb-topic-picker';picker.innerHTML=`<span class="sr-only">Konu seç</span><select id="yb-library-topic"><option value="all">Konu seç: Tümü</option>${topics().map(t=>`<option value="${esc(t.id)}">${esc(t.title||t.name)}</option>`).join('')}</select><button class="btn secondary yb-topic-test" id="yb-library-topic-test" type="button">🎯 Seçili konuyu çöz</button>`;
    toolbar.appendChild(picker);
    const select=$('#yb-library-topic',picker),test=$('#yb-library-topic-test',picker),cards=()=>$$('.note-card',v);
    select.addEventListener('change',()=>{
      const id=select.value;let any=false;
      cards().forEach(card=>{const show=id==='all'||String(card.dataset.topicId)===id;card.classList.toggle('is-hidden',!show);if(show)any=true});
      $('#lib-no-results',v)?.classList.toggle('hidden',any);
      if(id!=='all')cards().find(c=>String(c.dataset.topicId)===id)?.scrollIntoView({behavior:'smooth',block:'center'});
    });
    test.addEventListener('click',()=>{const id=select.value;if(id==='all'){window.YB88QuestionCenter?.openQuiz?.('all');return}const pool=bank().filter(q=>String(q.topic||'')===id);window.YB88QuestionCenter?.openQuiz?.(pool,topics().find(t=>String(t.id)===id)?.title||'Konu Testi');});
  }
  function addCardQuestions(v){
    $$('.note-card',v).forEach(card=>{
      if(card.dataset.ybQuickQuestions==='1')return;
      const t=topicForCard(card);if(!t)return;
      const qs=bank().filter(q=>String(q.topic||'')===String(t.id)).sort(()=>Math.random()-.5).slice(0,3);
      if(!qs.length)return;
      const details=document.createElement('details');details.className='yb-card-questions';
      details.innerHTML=`<summary>🧠 3 hızlı soru ile pekiştir</summary>${qs.map((q,i)=>`<div class="yb-card-q"><b>${i+1}.</b>${esc(q.q)}<button type="button" data-card-test="${esc(q.id||q.q)}">Bu konudan test aç →</button></div>`).join('')}`;
      card.querySelector('.note-card-footer')?.before(details);
      card.dataset.ybQuickQuestions='1';
    });
  }
  function bindCards(v){
    if(v.dataset.ybLibraryClickBound!=='1'){
      v.dataset.ybLibraryClickBound='1';
      v.addEventListener('click',e=>{
        const card=e.target.closest('.note-card');
        if(!card||!v.contains(card)||e.target.closest('button,select,input,summary,a,details'))return;
        card.querySelector('[data-open-topic]')?.click();
      });
      v.addEventListener('click',e=>{
        const b=e.target.closest('[data-card-test]');if(!b)return;
        const card=b.closest('.note-card'),t=topicForCard(card);if(t){e.preventDefault();e.stopPropagation();window.YB88QuestionCenter?.openQuiz?.(bank().filter(q=>String(q.topic||'')===String(t.id)),t.title||t.name)}
      });
    }
  }
  function run(){
    const v=$('#view-library');if(!v||!v.classList.contains('active'))return;
    style();addPicker(v);addCardQuestions(v);bindCards(v);
  }
  document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='library')setTimeout(run,180)});
  window.addEventListener('load',()=>setTimeout(run,350));
  window.YBLibraryInteractions={run};
})();
