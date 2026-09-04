/* Yurdunu Bil — Sınav Modu + Günün Challenge v1 */
(() => {
  'use strict';
  const KEY='yb_daily_challenge_v1';
  const BANK=[
    {q:'Türkiye’de tiftik keçisi yetiştiriciliği ile özdeşleşen merkez neresidir?',a:'Ankara çevresi',o:['Ankara çevresi','Rize çevresi','Antalya çevresi','Erzurum çevresi']},
    {q:'Türkiye’de çay tarımının temel merkezi hangi alandır?',a:'Doğu Karadeniz',o:['Doğu Karadeniz','İç Anadolu','Güneydoğu Anadolu','Trakya']},
    {q:'Türkiye’nin yüz ölçümü bakımından en büyük coğrafi bölgesi hangisidir?',a:'Doğu Anadolu Bölgesi',o:['Marmara Bölgesi','Doğu Anadolu Bölgesi','Karadeniz Bölgesi','Akdeniz Bölgesi']},
    {q:'Türkiye’nin en yüksek dağı hangisidir?',a:'Ağrı Dağı',o:['Erciyes Dağı','Uludağ','Ağrı Dağı','Kaçkar Dağları']},
    {q:'Türkiye’de sanayinin en fazla geliştiği bölge hangisidir?',a:'Marmara Bölgesi',o:['Doğu Anadolu Bölgesi','Marmara Bölgesi','Karadeniz Bölgesi','Akdeniz Bölgesi']},
    {q:'Maki bitki örtüsü özellikle hangi kıyılarda yaygındır?',a:'Akdeniz ve Ege kıyıları',o:['Akdeniz ve Ege kıyıları','Doğu Karadeniz kıyıları','Doğu Anadolu içleri','Trakya’nın kuzeyi']},
    {q:'Türkiye’nin en büyük gölü hangisidir?',a:'Van Gölü',o:['Tuz Gölü','Van Gölü','Beyşehir Gölü','Eğirdir Gölü']},
    {q:'Türkiye’nin en uzun akarsuyu hangisidir?',a:'Kızılırmak',o:['Fırat','Dicle','Kızılırmak','Sakarya']},
    {q:'Ayçiçeği üretiminde öne çıkan alan hangisidir?',a:'Trakya',o:['Trakya','Doğu Karadeniz','Hakkâri çevresi','Teke Yöresi']},
    {q:'Fındık üretiminde Türkiye’de öne çıkan bölge hangisidir?',a:'Karadeniz Bölgesi',o:['Karadeniz Bölgesi','Güneydoğu Anadolu Bölgesi','İç Anadolu Bölgesi','Doğu Anadolu Bölgesi']},
    {q:'Türkiye’de hidroelektrik potansiyeli bakımından öne çıkan bölge hangisidir?',a:'Doğu Anadolu Bölgesi',o:['Marmara Bölgesi','Doğu Anadolu Bölgesi','Ege Bölgesi','Trakya']},
    {q:'Türkiye’de nüfus yoğunluğu en fazla olan bölge hangisidir?',a:'Marmara Bölgesi',o:['Marmara Bölgesi','Doğu Anadolu Bölgesi','Karadeniz Bölgesi','Akdeniz Bölgesi']}
  ];
  const today=()=>new Date().toLocaleDateString('en-CA');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const shuffle=a=>a.slice().sort(()=>Math.random()-.5);
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(_){return {}}}
  function save(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch(_){} }
  function pick(){let s=load();if(s.date!==today()){s={date:today(),ids:shuffle([...Array(BANK.length).keys()]).slice(0,5),answers:{},score:null}}if(!Array.isArray(s.ids)||s.ids.length!==5)s.ids=shuffle([...Array(BANK.length).keys()]).slice(0,5);save(s);return s}
  function inject(){
    const dash=document.querySelector('#view-dashboard');if(!dash||!dash.classList.contains('active')||document.querySelector('#yb-challenge'))return;
    const anchor=dash.querySelector('#yb-quickfacts')||dash.querySelector('.welcome-row')||dash.firstElementChild;if(!anchor)return;
    const box=document.createElement('section');box.id='yb-challenge';box.className='yb-challenge';
    box.innerHTML=`<div class="yb-ch-head"><div><span>⚡ GÜNÜN CHALLENGE</span><h3>5 Soruluk Hızlı Coğrafya</h3><p>Bugününü tek dakikada test et. Sonuçların cihazında saklanır.</p></div><div class="yb-ch-score" id="yb-ch-score">—/5</div></div><div id="yb-ch-body"></div>`;anchor.after(box);
    const st=document.createElement('style');st.textContent=`.yb-challenge{margin:16px 0;padding:18px;border:1px solid rgba(255,255,255,.09);border-radius:22px;background:linear-gradient(135deg,rgba(31,26,55,.97),rgba(12,18,35,.97));box-shadow:0 14px 35px rgba(0,0,0,.14)}.yb-ch-head{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:14px}.yb-ch-head span{font-size:10px;font-weight:900;letter-spacing:.12em;opacity:.65}.yb-ch-head h3{margin:4px 0;font-size:19px}.yb-ch-head p{margin:0;font-size:12px;opacity:.62}.yb-ch-score{font-size:24px;font-weight:950;white-space:nowrap}.yb-ch-q{padding:14px;border-radius:15px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.06);margin-top:9px}.yb-ch-q b{display:block;font-size:13px;line-height:1.45;margin-bottom:10px}.yb-ch-options{display:grid;grid-template-columns:1fr 1fr;gap:7px}.yb-ch-opt{border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.035);color:inherit;border-radius:11px;padding:10px;text-align:left;font:inherit;font-size:11px;font-weight:750;cursor:pointer}.yb-ch-opt:hover{background:rgba(255,255,255,.08)}.yb-ch-opt.correct{border-color:rgba(70,220,150,.65);background:rgba(70,220,150,.13)}.yb-ch-opt.wrong{border-color:rgba(255,90,110,.6);background:rgba(255,90,110,.1)}.yb-ch-result{margin-top:12px;padding:12px;border-radius:12px;background:rgba(255,255,255,.05);font-size:12px;font-weight:800}.yb-ch-actions{display:flex;gap:8px;margin-top:10px}.yb-ch-btn{border:0;border-radius:10px;padding:9px 12px;font:inherit;font-size:11px;font-weight:850;cursor:pointer}.yb-ch-btn.primary{background:var(--accent,#55d6a3);color:#061018}@media(max-width:600px){.yb-challenge{padding:14px;border-radius:17px}.yb-ch-head{align-items:flex-start}.yb-ch-head h3{font-size:16px}.yb-ch-score{font-size:19px}.yb-ch-options{grid-template-columns:1fr}.yb-ch-q{padding:11px}.yb-ch-opt{padding:9px}}`;document.head.appendChild(st);
    let state=pick();let current=0;
    function render(){
      const body=box.querySelector('#yb-ch-body'),score=box.querySelector('#yb-ch-score');
      if(state.score!==null){score.textContent=`${state.score}/5`;body.innerHTML=`<div class="yb-ch-result">${state.score>=4?'🔥 Harika! Coğrafya refleksin iyi.':state.score>=3?'💪 Gayet iyi. Birkaç tekrar daha ile tamam.':'🧠 Yanlışlarını tekrar et; bugün kaybettiğin neti yarın kazanırsın.'}<div class="yb-ch-actions"><button class="yb-ch-btn primary" id="yb-ch-again">Soruları yeniden çöz</button></div></div>`;box.querySelector('#yb-ch-again').onclick=()=>{state={date:today(),ids:shuffle([...Array(BANK.length).keys()]).slice(0,5),answers:{},score:null};save(state);current=0;render()};return}
      const id=state.ids[current],item=BANK[id],answered=state.answers[current];score.textContent=`${Object.keys(state.answers).length}/5`;
      body.innerHTML=`<div class="yb-ch-q"><b>${current+1}/5 · ${esc(item.q)}</b><div class="yb-ch-options">${shuffle(item.o).map(x=>`<button class="yb-ch-opt" data-a="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>`;
      body.querySelectorAll('.yb-ch-opt').forEach(btn=>{btn.onclick=()=>{if(state.answers[current])return;const val=btn.dataset.a;state.answers[current]=val===item.a?'correct':'wrong';if(val===item.a)btn.classList.add('correct');else{btn.classList.add('wrong');body.querySelectorAll('.yb-ch-opt').forEach(b=>{if(b.dataset.a===item.a)b.classList.add('correct')})}save(state);setTimeout(()=>{current++;if(current>=5){state.score=Object.values(state.answers).filter(x=>x==='correct').length;save(state)}render()},450)}});
    }
    render();
  }
  function start(){let n=0;const tick=()=>{if(!document.querySelector('#yb-challenge'))inject();if(++n<30)setTimeout(tick,500)};tick();new MutationObserver(()=>{if(!document.querySelector('#yb-challenge'))inject()}).observe(document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
