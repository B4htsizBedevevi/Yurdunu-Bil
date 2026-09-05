/* Yurdunu Bil — semantic question center */
(()=>{
  'use strict';
  if(window.__YB88_QUESTION_CENTER__)return;
  window.__YB88_QUESTION_CENTER__=true;
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const topics={konum:'Coğrafi Konum',iklim:'İklim ve Bitki Örtüsü',yerseki:'Yerşekilleri',su:'Su Kaynakları',nufus:'Nüfus ve Yerleşme',tarim:'Tarım ve Hayvancılık',sanayi:'Madenler ve Sanayi',maden:'Madenler ve Enerji',bolgeler:'Bölgeler ve Turizm'};
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  function bank(){return Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK.filter(q=>q&&q.q&&Array.isArray(q.options)):[]}
  function read(){try{return Object.assign({wrong:[],bookmarks:[],attempts:0,correct:0},JSON.parse(localStorage.getItem('yb88_question_center')||'{}'))}catch{return {wrong:[],bookmarks:[],attempts:0,correct:0}}}
  function write(x){try{localStorage.setItem('yb88_question_center',JSON.stringify(x))}catch{}}
  function toast(msg){const t=$('#toast-root');if(!t)return;const x=document.createElement('div');x.className='toast';x.textContent=msg;t.appendChild(x);setTimeout(()=>x.remove(),2200)}
  function filtered(mode){
    const t=$('#yb88-topic')?.value||'all';
    const d=$('#yb88-diff')?.value||'all';
    const term=($('#yb88-search')?.value||'').trim().toLocaleLowerCase('tr-TR');
    let out=bank().filter(q=>{
      const text=(q.q+' '+(q.subtopic||'')+' '+q.options.join(' ')).toLocaleLowerCase('tr-TR');
      return (t==='all'||q.topic===t)&&(d==='all'||q.difficulty===d)&&(!term||text.includes(term));
    });
    if(mode==='wrong'){
      const ids=new Set(read().wrong||[]);
      out=out.filter(q=>ids.has(q.id));
    }
    return out;
  }
  function close(){const root=$('#yb88-quiz');if(root)root.classList.remove('show')}
  function openQuiz(list,title){
    if(!Array.isArray(list)||!list.length){toast('Bu filtrede soru bulunamadı.');return}
    let pool=list.slice();
    for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
    pool=pool.slice(0,Math.min(10,pool.length));
    let index=0,score=0,answered=false;
    let root=$('#yb88-quiz');
    if(!root){root=document.createElement('div');root.id='yb88-quiz';document.body.appendChild(root)}
    root.className='show';
    const draw=()=>{
      if(index>=pool.length){
        const state=read();state.attempts=Number(state.attempts||0)+1;write(state);
        root.innerHTML=`<div class="yb88-q-backdrop"></div><section class="yb88-q-modal yb88-result"><span class="yb88-kicker">TEST TAMAMLANDI</span><div class="yb88-result-score"><b>${score}/${pool.length}</b><span>doğru</span></div><h2>${score>=8?'Çok iyi! 🔥':score>=5?'Güzel gidiyor. 💪':'Bir tekrar turu daha iyi olur.'}</h2><p>${score>=8?'Konunun mantığını yakalamışsın.':score>=5?'Yanlışlarını tekrar et ve bir tur daha dene.':'Yanlışlarını tekrar et; bir sonraki turda daha iyi olacaksın.'}</p><div class="yb88-q-actions"><button class="btn primary" data-q-retry>Tekrar Çöz</button><button class="btn secondary" data-q-close>Kapat</button></div></section>`;
        root.querySelector('[data-q-retry]').onclick=()=>openQuiz(pool,title);
        root.querySelector('[data-q-close]').onclick=close;
        return;
      }
      const q=pool[index];answered=false;
      root.innerHTML=`<div class="yb88-q-backdrop"></div><section class="yb88-q-modal"><button class="yb88-q-close" type="button">×</button><div class="yb88-q-top"><span>${index+1}/${pool.length}</span><span>${esc(topics[q.topic]||q.topic||'Coğrafya')} · ${esc(q.difficulty||'orta')}</span></div><div class="yb88-q-progress"><i style="width:${(index/pool.length)*100}%"></i></div><span class="yb88-q-sub">${esc(q.subtopic||'Soru')}</span><h2>${esc(q.q)}</h2><div class="yb88-options">${q.options.map((o,n)=>`<button type="button" data-answer="${n}">${String.fromCharCode(65+n)} <span>${esc(o)}</span></button>`).join('')}</div><div class="yb88-feedback" hidden></div><button class="btn primary yb88-next" type="button" disabled>Sonraki soru →</button></section>`;
      root.querySelector('.yb88-q-close').onclick=close;
      $$('[data-answer]',root).forEach(btn=>btn.onclick=()=>answer(q,Number(btn.dataset.answer),root));
      root.querySelector('.yb88-next').onclick=()=>{index++;draw()};
    };
    const answer=(q,n,container)=>{
      if(answered)return;answered=true;
      const state=read();const correct=n===Number(q.answer);const wrong=new Set(state.wrong||[]);
      if(correct){score++;state.correct=Number(state.correct||0)+1;wrong.delete(q.id)}else wrong.add(q.id);
      state.wrong=Array.from(wrong);write(state);
      $$('[data-answer]',container).forEach(btn=>{btn.disabled=true;const x=Number(btn.dataset.answer);btn.classList.toggle('correct',x===Number(q.answer));btn.classList.toggle('wrong',x===n&&!correct)});
      const fb=$('.yb88-feedback',container);if(fb){fb.hidden=false;fb.innerHTML=correct?`<b>Doğru! ✓</b><span>${esc(q.explain||'Güzel.')}</span>`:`<b>Yanlış.</b><span>${esc(q.explain||'Doğru cevabı tekrar incele.')}</span>`}
      const next=$('.yb88-next',container);if(next)next.disabled=false;
    };
    draw();
  }
  function render(){
    const v=$('#view-library');
    if(!v||!v.classList.contains('active')||$('.yb88-question-center',v))return;
    const b=bank(),state=read();
    v.insertAdjacentHTML('afterbegin',`<section class="yb88-question-center"><div class="yb88-qc-head"><div><span>YENİ • SORU MERKEZİ</span><h2>Soru bankasını istediğin gibi çalış.</h2><p>${b.length} soruyu konu, zorluk ve arama ile filtrele. Yanlışların otomatik tekrar listesine alınır.</p></div><div class="yb88-qc-stats"><div><b class="yb88-count">${b.length}</b><span>SORU</span></div><div><b>${(state.wrong||[]).length}</b><span>YANLIŞ</span></div><div><b>${(state.bookmarks||[]).length}</b><span>KAYITLI</span></div></div></div><div class="yb88-qc-controls"><label><span>Konu</span><select id="yb88-topic"><option value="all">Tüm konular</option>${Object.entries(topics).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label><label><span>Zorluk</span><select id="yb88-diff"><option value="all">Tüm seviyeler</option><option value="kolay">Kolay</option><option value="orta">Orta</option><option value="zor">Zor</option></select></label><label class="yb88-qc-search"><span>Ara</span><input id="yb88-search" placeholder="Kavram veya soru ara..."></label><button class="btn primary" id="yb88-start-quick" type="button">10 Soruluk Test →</button><button class="btn secondary" id="yb88-start-wrong" type="button">Yanlışlarımı Çöz</button></div><div class="yb88-qc-note"><span>🧠</span><b>Akıllı tekrar:</b><span>Yanlış yaptığın sorular bir sonraki tekrarında öncelik kazanır.</span></div></section>`);
    const refresh=()=>{const n=$('.yb88-qc-note');if(n)n.dataset.filtered=String(filtered().length)};
    ['yb88-topic','yb88-diff','yb88-search'].forEach(id=>{const el=$('#'+id);if(el)el.addEventListener(id==='yb88-search'?'input':'change',refresh)});
    $('#yb88-start-quick')?.addEventListener('click',()=>openQuiz(filtered(),'Hızlı Test'));
    $('#yb88-start-wrong')?.addEventListener('click',()=>openQuiz(filtered('wrong'),'Yanlışlarım'));
    refresh();
  }
  document.addEventListener('yb:navigate',e=>{if(e.detail&&e.detail.view==='library')setTimeout(render,100)});
  window.addEventListener('load',()=>setTimeout(render,500));
  window.YB88QuestionCenter={openQuiz:(mode='all',title='Hızlı Test')=>Array.isArray(mode)?openQuiz(mode,title):openQuiz(mode==='wrong'?filtered('wrong'):filtered(),mode==='wrong'?'Yanlışlarım':title),render};
})();
