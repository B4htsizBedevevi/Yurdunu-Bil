/* Yurdunu Bil — Library Plus compatibility layer */
(()=>{
  'use strict';
  if(window.__YB_LIBRARY_PLUS__) return;
  window.__YB_LIBRARY_PLUS__=true;
  const $=(s,r=document)=>r.querySelector(s);
  const labels={konum:'Coğrafi Konum',iklim:'İklim ve Bitki Örtüsü',yerseki:'Yerşekilleri',su:'Su Kaynakları',nufus:'Nüfus ve Yerleşme',tarim:'Tarım ve Hayvancılık',sanayi:'Madenler ve Sanayi',bolgeler:'Bölgeler ve Turizm'};
  function pool(){return window.YBQuestionPool&&Array.isArray(window.YBQuestionPool.questions)?window.YBQuestionPool.questions:(Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:[])}
  function mount(){
    const v=$('#view-library');
    if(!v||!v.classList.contains('active')||$('.yb-library-plus',v))return;
    const b=pool();
    const total=b.length;
    const counts=Object.keys(labels).map(k=>[k,b.filter(q=>q.topic===k).length]);
    const easy=b.filter(q=>q.difficulty==='kolay').length;
    const medium=b.filter(q=>q.difficulty==='orta').length;
    const hard=b.filter(q=>q.difficulty==='zor').length;
    const el=document.createElement('section');
    el.className='yb-library-plus';
    el.innerHTML=`<div class="yb-library-plus-head"><div><span class="yb-library-kicker">ÇALIŞMA MERKEZİ</span><h2>Kütüphane çalışma özeti</h2><p>${total} kullanılabilir soru, 8 ana konu ve dengeli zorluk dağılımı.</p></div><div class="yb-library-total"><b>${total}</b><span>AKTİF SORU</span></div></div><div class="yb-library-metrics"><div><b>${easy}</b><span>Kolay</span></div><div><b>${medium}</b><span>Orta</span></div><div><b>${hard}</b><span>Zor</span></div><div><b>8</b><span>Ana konu</span></div></div><div class="yb-library-topic-grid">${counts.map(([k,n])=>{const pct=total?Math.round(n/total*100):0;return `<article class="yb-library-topic"><div class="yb-library-topic-main"><b>${labels[k]}</b><span>${n} soru · %${pct}</span><i><em style="width:${pct}%"></em></i></div><button type="button" data-yb-topic="${k}">Test →</button></article>`}).join('')}</div>`;
    v.prepend(el);
    el.querySelectorAll('[data-yb-topic]').forEach(btn=>btn.addEventListener('click',()=>{
      const select=v.querySelector('#yb88-topic');
      if(select)select.value=btn.dataset.ybTopic;
      const start=v.querySelector('#yb88-start-quick');
      if(start)start.click();
    }));
  }
  document.addEventListener('yb:navigate',e=>{if(e.detail&&e.detail.view==='library')setTimeout(mount,350)});
  window.addEventListener('load',()=>setTimeout(mount,900));
  new MutationObserver(()=>{if($('#view-library')&&$('#view-library').classList.contains('active'))setTimeout(mount,120)}).observe(document.body,{childList:true,subtree:true});
  window.YBLibraryPlus={refresh:()=>{const v=$('#view-library');const old=v&&v.querySelector('.yb-library-plus');if(old)old.remove();mount()}};
})();
