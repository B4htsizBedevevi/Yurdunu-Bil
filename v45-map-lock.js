/* Yurdunu Bil 45.3 — FINAL MAP SHUTDOWN */
(()=>{
'use strict';
if(window.__YB45_MAP_LOCK_FINAL__)return;
window.__YB45_MAP_LOCK_FINAL__=true;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const notice=()=>`<section class="yb45-map-maintenance yb45-map-lock-screen"><div class="yb45-map-orbit"><span>⌖</span></div><span class="eyebrow">TÜRKİYE COĞRAFYA ATLASI • BAKIMDA</span><h1>Harita şu an kullanıma kapalı.</h1><p>Harita modülünü tamamen kapattık. Harita, atlas ve harita tabanlı özellikler şu anda kullanılamıyor. Map 2.0 hazırlanıyor.</p><div class="yb45-map-status"><div><b>MAP 2.0</b><span>Geliştiriliyor</span></div><div><b>81 İL</b><span>Veriler korunuyor</span></div><div><b>KPSS</b><span>Yeni sürüm hazırlanıyor</span></div></div><div class="yb45-map-note">🔒 Harita sekmesi, harita kartları ve eski harita bağlantıları tamamen kapalıdır.</div></section>`;
const mapText=/harita|haritayı|haritadan|türkiye atlası|atlasını aç/i;
function mapControl(el){if(!el)return false;const d=el.dataset||{};return el.matches('[data-view="map"],[data-study-map],[data-vlesson-map]')||'studyMap' in d||'vlessonMap' in d||mapText.test((el.textContent||'').trim())}
function closeMap(){const v=$('#view-map');if(!v)return;$$('.view').forEach(x=>x.classList.remove('active'));v.classList.add('active');v.innerHTML=notice();v.dataset.yb45Closed='1';const p=$('#page-title');if(p)p.textContent='Harita • Bakımda';}
function disable(el){if(!el||el.closest('.yb45-map-maintenance'))return;el.classList.add('yb45-map-disabled');el.removeAttribute('href');el.removeAttribute('data-view');el.removeAttribute('data-study-map');el.removeAttribute('data-vlesson-map');el.setAttribute('aria-disabled','true');el.setAttribute('title','Harita bakımda — Map 2.0 hazırlanıyor');el.innerHTML='🛠️ Harita <small>BAKIMDA</small>';}
function clean(){const d=$('#view-dashboard');if(d){$$('.atlas-card,.atlas-shell,.map-v31-panel,.map-v31-tooltip,#dash-atlas,#dash-svg',d).forEach(x=>x.remove());$$('[data-study-map],[data-vlesson-map]',d).forEach(x=>x.closest('article,section')?.remove()||x.remove());if(!$('.yb45-dashboard-map-notice',d)){const n=document.createElement('section');n.className='yb45-dashboard-map-notice yb45-map-maintenance';n.innerHTML=notice();d.appendChild(n)}}const m=$('#view-map');if(m&&!m.dataset.yb45Closed)closeMap();$$('[data-view="map"],[data-study-map],[data-vlesson-map]').forEach(disable);$$('a,button').forEach(el=>{if(mapControl(el))disable(el)});}
function clickGuard(e){const el=e.target?.closest?.('a,button,[data-study-map],[data-vlesson-map]');if(!el||!mapControl(el))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();closeMap();return false}
document.addEventListener('click',clickGuard,true);
function start(){clean();let t=0;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(clean,30)}).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
