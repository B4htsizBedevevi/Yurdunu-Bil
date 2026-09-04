/* Yurdunu Bil — KPSS Coğrafya Hap Bilgiler v1 */
(() => {
  'use strict';
  const KEY='yb_quickfacts_v1';
  const today=()=>new Date().toLocaleDateString('en-CA');
  const facts=[
    ['🐐','Tarım & Hayvancılık','Tiftik keçisi en fazla nerede yetiştirilir?','Ankara ve çevresi','KPSS'],
    ['👥','Nüfus','Türkiye’de nüfus yoğunluğu en fazla olan bölge hangisidir?','Marmara Bölgesi','KPSS'],
    ['🍵','Tarım','Türkiye’de çay tarımı en fazla hangi bölgede yapılır?','Doğu Karadeniz','KPSS'],
    ['🌧️','İklim','Türkiye’de yıllık yağışın en fazla olduğu yer neresidir?','Doğu Karadeniz kıyıları','Dikkat'],
    ['🌾','Tarım','Türkiye’de buğday üretiminde öne çıkan bölge hangisidir?','İç Anadolu Bölgesi','KPSS'],
    ['🏔️','Türkiye’nin Enleri','Türkiye’nin en yüksek dağı hangisidir?','Ağrı Dağı — 5.137 m','Ezberle'],
    ['🌊','Türkiye’nin Enleri','Türkiye’nin en uzun kıyı şeridine sahip bölgesi hangisidir?','Ege Bölgesi','KPSS'],
    ['🫒','Tarım','Zeytin üretiminde Türkiye’de öne çıkan bölge hangisidir?','Ege Bölgesi','KPSS'],
    ['🍊','Tarım','Turunçgil üretiminde en önemli merkezlerden biri hangi bölgededir?','Akdeniz Bölgesi','KPSS'],
    ['🧶','Tarım & Hayvancılık','Koyun yetiştiriciliği için en elverişli alanların başında hangi bölge gelir?','İç Anadolu Bölgesi','KPSS'],
    ['⛏️','Maden','Türkiye’de bor minerallerinin önemli yatakları hangi bölgelerde bulunur?','Eskişehir, Kütahya, Balıkesir ve Bursa çevresi','Dikkat'],
    ['⚡','Enerji','Türkiye’nin hidroelektrik potansiyeli en yüksek bölgesi hangisidir?','Doğu Anadolu Bölgesi','KPSS'],
    ['🌲','Bitki Örtüsü','Türkiye’de ormanların en geniş yer kapladığı bölge hangisidir?','Karadeniz Bölgesi','KPSS'],
    ['🏭','Sanayi','Türkiye’de sanayinin en fazla geliştiği bölge hangisidir?','Marmara Bölgesi','KPSS'],
    ['🚢','Ulaşım','Türkiye’nin en işlek limanlarından biri olan Ambarlı hangi şehir sınırlarındadır?','İstanbul','KPSS'],
    ['🌋','Yer Şekilleri','Türkiye’de volkanik dağların yoğunlaştığı alanlardan biri neresidir?','Doğu Anadolu Bölgesi','KPSS'],
    ['🌾','Tarım','Çukurova hangi tarım ürünü ve verimli ovalarıyla öne çıkar?','Pamuk başta olmak üzere birçok tarım ürünü; Akdeniz tarımı','Dikkat'],
    ['❄️','İklim','Karasal iklimin sıcaklık farkları en belirgin olduğu bölgelerden biri hangisidir?','Doğu Anadolu Bölgesi','KPSS'],
    ['🏖️','Turizm','Türkiye’de kıyı turizminin en gelişmiş olduğu bölgelerin başında hangisi gelir?','Akdeniz Bölgesi','KPSS'],
    ['🧂','Maden','Türkiye’de kaya tuzu üretimiyle bilinen önemli alanlardan biri neresidir?','Çankırı çevresi','Ezberle'],
    ['🌻','Tarım','Ayçiçeği üretiminde Türkiye’de en önemli alanlardan biri neresidir?','Trakya — Marmara Bölgesi','KPSS'],
    ['🍇','Tarım','Türkiye’de üzüm üretiminde öne çıkan merkezlerden biri hangisidir?','Ege Bölgesi — özellikle Manisa çevresi','KPSS'],
    ['🐑','Hayvancılık','Küçükbaş hayvancılık hangi doğal koşullarda daha yaygındır?','Bozkır ve kurak/yarı kurak alanlarda','Dikkat'],
    ['🌳','Bitki Örtüsü','Maki bitki örtüsü Türkiye’de en çok hangi kıyılarda görülür?','Akdeniz ve Ege kıyıları','KPSS'],
    ['🗺️','Bölgeler','Türkiye’de yüz ölçümü en büyük coğrafi bölge hangisidir?','Doğu Anadolu Bölgesi','Ezberle'],
    ['🏙️','Nüfus','Türkiye’de nüfusun en az yoğun olduğu bölge hangisidir?','Doğu Anadolu Bölgesi','KPSS'],
    ['🌊','Denizler','Türkiye’nin en büyük gölü hangisidir?','Van Gölü','Ezberle'],
    ['💧','Denizler','Türkiye’nin en uzun akarsuyu hangisidir?','Kızılırmak','Ezberle'],
    ['🏞️','Yer Şekilleri','Türkiye’nin en yüksek platolarından biri hangi bölgede bulunur?','Doğu Anadolu Bölgesi','KPSS'],
    ['🌿','Tarım','Fındık üretiminde Türkiye’nin en önemli bölgesi hangisidir?','Karadeniz Bölgesi','KPSS']
  ];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  function pick(){
    let state={}; try{state=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(_){ }
    const d=today();
    if(state.date!==d){state={date:d,seen:[]};}
    const pool=facts.map((_,i)=>i).filter(i=>!state.seen.includes(i));
    if(pool.length<4){state.seen=[];}
    const fresh=(pool.length>=4?pool:facts.map((_,i)=>i)).sort(()=>Math.random()-.5).slice(0,4);
    state.seen=[...new Set([...state.seen,...fresh])].slice(-24);
    try{localStorage.setItem(KEY,JSON.stringify(state))}catch(_){ }
    return fresh.map(i=>facts[i]);
  }
  function inject(){
    const view=document.querySelector('#view-dashboard');
    if(!view||document.querySelector('#yb-quickfacts'))return;
    const anchor=view.querySelector('.welcome-row')||view.firstElementChild;
    const section=document.createElement('section'); section.id='yb-quickfacts'; section.className='yb-qf';
    section.innerHTML=`<div class="yb-qf-head"><div><span class="yb-qf-live">● CANLI HAP BİLGİ</span><h3>🧠 Bugünün Coğrafya Hap Bilgileri</h3><p>KPSS için kısa, net ve ezberlenebilir bilgiler.</p></div><button id="yb-qf-refresh" type="button">↻ Yeni Bilgiler</button></div><div class="yb-qf-grid" id="yb-qf-grid"></div>`;
    anchor?.after(section);
    const style=document.createElement('style');style.textContent=`.yb-qf{margin:18px 0;padding:18px;border:1px solid rgba(255,255,255,.09);border-radius:22px;background:linear-gradient(135deg,rgba(19,28,49,.96),rgba(11,18,33,.96));box-shadow:0 14px 35px rgba(0,0,0,.14)}.yb-qf-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px}.yb-qf-live{font-size:10px;font-weight:900;letter-spacing:.12em;opacity:.7}.yb-qf h3{margin:5px 0 2px;font-size:20px}.yb-qf p{margin:0;opacity:.62;font-size:12px}.yb-qf-head button{border:0;border-radius:12px;padding:10px 13px;font-weight:800;cursor:pointer}.yb-qf-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.yb-qf-card{min-width:0;padding:15px;border-radius:17px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.07);transition:transform .2s,background .2s}.yb-qf-card:hover{transform:translateY(-2px);background:rgba(255,255,255,.07)}.yb-qf-icon{font-size:25px}.yb-qf-cat{font-size:10px;font-weight:900;opacity:.55;margin:7px 0}.yb-qf-q{font-size:13px;font-weight:800;line-height:1.4;min-height:37px}.yb-qf-a{margin-top:10px;padding:9px 10px;border-radius:10px;background:rgba(255,255,255,.06);font-size:12px;font-weight:900}.yb-qf-badge{display:inline-block;margin-top:9px;font-size:9px;font-weight:900;letter-spacing:.08em;opacity:.58}@media(max-width:900px){.yb-qf-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.yb-qf{margin:12px 0;padding:14px;border-radius:17px}.yb-qf-head{align-items:flex-start}.yb-qf-head button{padding:9px 10px;font-size:11px}.yb-qf h3{font-size:16px}.yb-qf-grid{grid-template-columns:1fr 1fr;gap:8px}.yb-qf-card{padding:11px;border-radius:14px}.yb-qf-icon{font-size:21px}.yb-qf-q{font-size:11px;min-height:0}.yb-qf-a{font-size:11px;margin-top:7px;padding:8px}.yb-qf-cat{font-size:8px}}@media(max-width:380px){.yb-qf-grid{grid-template-columns:1fr}.yb-qf-head{display:block}.yb-qf-head button{margin-top:9px}}`;document.head.appendChild(style);
    function render(){document.querySelector('#yb-qf-grid').innerHTML=pick().map(f=>`<article class="yb-qf-card"><div class="yb-qf-icon">${esc(f[0])}</div><div class="yb-qf-cat">${esc(f[1])}</div><div class="yb-qf-q">${esc(f[2])}</div><div class="yb-qf-a">→ ${esc(f[3])}</div><span class="yb-qf-badge">${esc(f[4])}</span></article>`).join('')}
    render();document.querySelector('#yb-qf-refresh')?.addEventListener('click',render);
  }
  function fixMap(){
    document.querySelectorAll('.leaflet-container').forEach(map=>{map.style.touchAction='pan-x pan-y';map.style.pointerEvents='auto';map.querySelectorAll('.leaflet-pane,.leaflet-control-container').forEach(x=>x.style.pointerEvents='auto')});
    document.querySelectorAll('#view-map,#map,.map-container').forEach(x=>{x.style.pointerEvents='auto';x.style.touchAction='pan-x pan-y'});
  }
  function start(){inject();fixMap();new MutationObserver(()=>{inject();fixMap()}).observe(document.body,{childList:true,subtree:true});window.addEventListener('resize',fixMap,{passive:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
