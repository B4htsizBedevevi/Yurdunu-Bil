/* Yurdunu Bil — emergency boot recovery */
(()=>{'use strict';
if(window.__YB67_EMERGENCY__)return;window.__YB67_EMERGENCY__=true;
const MAP_RE=/Harita verisi yüklenemedi|Türkiye Coğrafya Haritası|ETKİLEŞİMLİ ATLAS|GEOJSON|atlas-svg/i;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function removeMap(){
  $$('[data-view="map"],#view-map').forEach(e=>{e.style.display='none';e.setAttribute('aria-hidden','true')});
  $$('.atlas-card,#dash-atlas,.atlas-shell,.atlas-svg,.yb56-retired-map').forEach(e=>e.remove());
  $$('#toast-root .toast,[role="alert"],[role="status"]').forEach(e=>{if(MAP_RE.test(e.textContent||''))e.remove()});
}
function dashboard(){
  const v=$('#view-dashboard');if(!v||!v.classList.contains('active'))return;
  removeMap();
  if(v.querySelector('.yb67-safe-home'))return;
  v.innerHTML='<div class="yb67-safe-home"><section class="yb67-hero"><span>YURDUNU BİL • KPSS COĞRAFYA</span><h1>Çalışmaya devam et.</h1><p>Harita bölümü bakımda. Test, konu notları, 81 il çalışması ve oyun merkezi hazır.</p><div class="yb67-actions"><button data-view="quiz">⚡ Mini Test</button><button data-view="library">📚 Kütüphane</button><button data-view="provinceStudy">🧭 81 İl</button><button data-view="events">🎮 Oyun Merkezi</button></div></section><section class="yb67-grid"><article><b>🧠 Öğren</b><small>Konu notlarını çalış</small></article><article><b>🎯 Test Et</b><small>KPSS tipi sorular çöz</small></article><article><b>🔁 Pekiştir</b><small>Zayıf konularını tekrar et</small></article><article><b>🏆 Oyna</b><small>Arena ve mini oyunlara katıl</small></article></section></div>';
  $$('.yb67-actions [data-view]',v).forEach(b=>b.addEventListener('click',()=>{const target=b.dataset.view;const nav=$(`.nav-item[data-view="${target}"],.mobile-nav [data-view="${target}"]`);if(nav)nav.click()}));
}
function repair(){removeMap();dashboard()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',repair,{once:true});else setTimeout(repair,0);
setTimeout(repair,500);setTimeout(repair,1500);setInterval(repair,4000);
window.YB67Emergency={repair,removeMap};
})();
