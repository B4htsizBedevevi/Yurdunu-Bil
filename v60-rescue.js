/* Yurdunu Bil — retired-map hard stop + safe dashboard fallback */
(()=>{'use strict';
if(window.__YB60_RESCUE__)return;window.__YB60_RESCUE__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const MAP_RX=/Harita verisi yüklenemedi|Türkiye Coğrafya Haritası|ETKİLEŞİMLİ ATLAS|GEOJSON|atlas-svg/i;
let queued=false;
function killMap(){
  $$('[data-view="map"],#view-map').forEach(e=>{e.dataset.yb60Retired='1';e.style.display='none';e.setAttribute('aria-hidden','true')});
  $$('.atlas-card,#dash-atlas,.atlas-shell,.atlas-svg,.yb56-retired-map,[id*="map"],[class*="map-"] .atlas-shell').forEach(e=>{if(e.id!=='view-dashboard')e.remove()});
  $$('#toast-root .toast,[role="alert"],[role="status"]').forEach(e=>{if(MAP_RX.test(e.textContent||''))e.remove()});
}
function repairProfile(){const menu=$('#profile-menu');if(!menu)return;menu.classList.add('yb60-profile');if(menu.parentElement!==document.body)document.body.appendChild(menu)}
function go(view){const b=$(`.nav-item[data-view="${view}"],.mobile-nav [data-view="${view}"]`);if(b)b.click()}
function safeDashboard(){
  const v=$('#view-dashboard');if(!v||!v.classList.contains('active'))return;
  const before=v.querySelector('.atlas-card,#dash-atlas,.atlas-shell,.atlas-svg')||MAP_RX.test(v.textContent||'');
  killMap();
  const broken=v.children.length===0||before;
  if(!broken)return;
  v.innerHTML=`<div class="yb60-rescue"><section class="yb60-hero"><span class="yb60-kicker">YURDUNU BİL • ÇALIŞMA MERKEZİ</span><h1>Bugün ne çalışıyoruz?</h1><p>Harita bölümü bakımda. Ders, tekrar, test ve oyun sistemleri aktif.</p><div class="yb60-actions"><button class="btn primary" data-yb60-go="quiz">⚡ Hızlı Test</button><button class="btn secondary" data-yb60-go="library">📚 Konu Tekrarı</button><button class="btn secondary" data-yb60-go="provinceStudy">🧭 81 İl</button><button class="btn ghost" data-yb60-go="events">🎮 Oyun Merkezi</button></div></section><section class="yb60-grid"><article><b>🧠 Öğren</b><span>Konu notlarını çalış</span></article><article><b>🔁 Pekiştir</b><span>Zayıf konularını tekrar et</span></article><article><b>🎯 Test Et</b><span>KPSS tipi sorular çöz</span></article><article><b>🏆 Oyna</b><span>Arena ve mini oyunlarla pratik yap</span></article></section></div>`;
  $$('[data-yb60-go]',v).forEach(b=>b.onclick=()=>go(b.dataset.yb60Go));
}
function ensureView(){
  const active=$('.view.active');
  if(active?.id==='view-map'){go('dashboard');return true}
  return false;
}
function refresh(){
  repairProfile();
  if(ensureView()){setTimeout(()=>{killMap();safeDashboard()},50);return}
  killMap();safeDashboard();
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;refresh()})}
document.addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b&&b.dataset.view==='map'){e.preventDefault();e.stopImmediatePropagation();go('dashboard')}schedule()},true);
window.addEventListener('yb:navigate',schedule);
window.addEventListener('yb57-profile-complete',schedule);
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
setInterval(refresh,2500);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else setTimeout(schedule,80);
window.YB60Rescue={refresh,killMap};
})();
