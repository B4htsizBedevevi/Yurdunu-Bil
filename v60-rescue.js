/* Yurdunu Bil 60 — UI rescue, map hard-stop, navigation recovery */
(()=>{'use strict';
if(window.__YB60_RESCUE__)return;window.__YB60_RESCUE__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const MAP_RX=/Harita verisi yüklenemedi|Türkiye Coğrafya Haritası|ETKİLEŞİMLİ ATLAS/i;
let queued=false,lastView='';
function killMap(){
  $$('[data-view="map"]').forEach(e=>{e.dataset.yb60Retired='1';e.style.display='none';e.setAttribute('aria-hidden','true')});
  $$('.atlas-card,#dash-atlas,.atlas-shell,.atlas-svg,.yb56-retired-map').forEach(e=>e.remove());
  $$('#toast-root .toast').forEach(e=>{if(MAP_RX.test(e.textContent||''))e.remove()});
}
function repairProfile(){
  const menu=$('#profile-menu'); if(!menu)return;
  menu.classList.add('yb60-profile');
  if(menu.parentElement!==document.body)document.body.appendChild(menu);
}
function activeView(){return $('.view.active')}
function rescueDashboard(){
  const v=$('#view-dashboard');
  if(!v||!v.classList.contains('active'))return;
  const meaningful=v.querySelector('.yb58-dashboard,.yb58-hero,.dashboard-intro,.yb56-dash-empty,.surface,.page-title');
  if(meaningful)return;
  v.innerHTML=`<div class="yb60-rescue"><section class="yb60-hero"><span class="yb60-kicker">YURDUNU BİL • ÇALIŞMA MERKEZİ</span><h1>Bugün ne çalışıyoruz?</h1><p>Harita bakımda. Ders, tekrar, test ve oyun sistemleri hazır.</p><div class="yb60-actions"><button class="btn primary" data-yb60-go="quiz">⚡ Hızlı Test</button><button class="btn secondary" data-yb60-go="library">📚 Konu Tekrarı</button><button class="btn secondary" data-yb60-go="provinceStudy">🧭 81 İl</button><button class="btn ghost" data-yb60-go="events">🎮 Oyun Merkezi</button></div></section><section class="yb60-grid"><article><b>🧠 Öğren</b><span>Konu notlarını oku</span></article><article><b>🔁 Pekiştir</b><span>Akıllı tekrarı çöz</span></article><article><b>🎯 Test Et</b><span>Yeni sorularla kendini sınav</span></article><article><b>🏆 Oyna</b><span>Hazırlığını Arena'ya taşı</span></article></section></div>`;
  $$('#view-dashboard [data-yb60-go]').forEach(b=>b.onclick=()=>go(b.dataset.yb60Go));
}
function go(view){
  const b=$(`.nav-item[data-view="${view}"],.mobile-nav [data-view="${view}"]`);
  if(b)b.click();
}
function refreshActive(){
  killMap();repairProfile();
  const v=activeView(),id=v?.id||'';
  if(id!==lastView){lastView=id}
  if(id==='view-dashboard'){
    try{window.YB58Premium?.render?.()}catch{}
    setTimeout(()=>{killMap();rescueDashboard()},80);
  }
  if(id==='view-library')try{window.YB59Study?.render?.()}catch{}
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;refreshActive()})}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-view]');
  if(b&&b.dataset.view==='map'){
    e.preventDefault();e.stopImmediatePropagation();go('dashboard');
  }
  schedule();
},true);
window.addEventListener('yb:navigate',schedule);
window.addEventListener('yb57-profile-complete',schedule);
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
setInterval(()=>{killMap();repairProfile();const v=activeView();if(v?.id==='view-dashboard')rescueDashboard()},900);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else setTimeout(schedule,60);
window.YB60Rescue={refresh:refreshActive,killMap};
})();
