/* Yurdunu Bil v36.1 — reliable atlas selection sync
 * Tek seçim kaynağı: iki atlas aynı ili, modu ve seçili görseli kullanır.
 */
(()=>{
'use strict';
const MODE_KEY='yb_map_mode_v33',PROVINCE_KEY='yb_map_province_v33';
const DATA=Array.isArray(window.PROVINCE_DATA)?window.PROVINCE_DATA:[],POP=window.POPULATION_2025||{},AREAS=window.PROVINCE_AREAS||{};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=v=>String(v||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=v=>String(v??'').replace(/\s+/g,' ').trim()||'Veri yok';
const find=name=>DATA.find(p=>norm(p.name)===norm(name))||null;
const shells=()=>$$('.atlas-shell');
const getMode=()=>{try{return localStorage.getItem(MODE_KEY)||'default'}catch{return'default'}};
const getProvince=()=>{try{return localStorage.getItem(PROVINCE_KEY)||''}catch{return''}};
const saveMode=id=>{try{localStorage.setItem(MODE_KEY,id)}catch{}};
const saveProvince=name=>{try{name?localStorage.setItem(PROVINCE_KEY,name):localStorage.removeItem(PROVINCE_KEY)}catch{}};
const shapeName=s=>s?.dataset.province||s?.getAttribute('data-province')||s?.dataset.mapProvince||'';
function findShape(shell,name){const svg=$('.atlas-svg',shell),n=norm(name);if(!svg||!n)return null;return $$('.province-shape,[data-province]',svg).find(s=>norm(shapeName(s))===n)||null}
function paint(name){const n=norm(name);shells().forEach(shell=>{const svg=$('.atlas-svg',shell);if(!svg)return;$$('.province-shape',svg).forEach(s=>{const on=!!n&&norm(shapeName(s))===n;s.classList.toggle('selected',on);s.classList.toggle('map-v31-selected',on)});$$('.province-label',svg).forEach(t=>t.classList.toggle('selected',!!n&&norm(t.dataset.provinceLabel||'')===n))})}
function panel(p){
 if(!p)return `<div class="empty-province"><div class="empty-icon">⌖</div><h2>Bir il seç</h2><p>Haritadaki bir ile tıklayarak o ilin KPSS için önemli coğrafya bilgilerini aç.</p><div class="empty-pills"><span>⛰️ Dağlar</span><span>🌾 Ovalar</span><span>💧 Göller</span><span>🌊 Akarsular</span><span>🌱 Tarım</span><span>⛏️ Maden</span></div></div>`;
 const v=k=>esc(clean(p[k])),pop=POP[p.name]||p.population||'Veri yok',area=AREAS[p.name];
 return `<div class="province-panel-inner"><div class="province-top"><div class="plate">${esc(p.plate)}</div><div><span class="eyebrow">SEÇİLEN İL • ${esc(p.region)} BÖLGESİ</span><h2>${esc(p.name)}</h2><p>${v('fact')}</p></div><button class="icon-btn close-province" type="button" data-yb-clear-province>×</button></div><div class="quick-note"><span>🧠 KPSS HIZLI ÖZET</span><b>${v('kpss')}</b></div><div class="geo-grid"><div><small>🌦️ İKLİM</small><b>${v('climate')}</b></div><div><small>⛰️ DAĞLAR / ARAZİ</small><b>${v('terrain')}</b></div><div><small>🌾 OVALAR</small><b>${v('plains')}</b></div><div><small>💧 GÖLLER / SULAK</small><b>${v('lakes')}</b></div><div><small>🌊 AKARSULAR</small><b>${v('rivers')}</b></div><div><small>🌱 TARIM</small><b>${v('agriculture')}</b></div><div><small>⛏️ MADEN / KAYNAK</small><b>${v('mining')}</b></div><div><small>👥 2025 NÜFUSU</small><b>${esc(pop)}</b></div>${area?`<div><small>📐 YÜZ ÖLÇÜMÜ</small><b>${area.toLocaleString('tr-TR')} km²</b></div>`:''}</div><div class="geography-note"><span>▦ COĞRAFYA NOTU</span><p>${v('fact')}</p></div><div class="memory"><span>⚡ HAFIZA KODU</span><p>${v('kpss')}</p></div></div>`;
}
function syncPanels(name){const p=find(name),html=panel(p);$$('.province-panel').forEach(x=>x.innerHTML=html);$$('[data-yb-clear-province]').forEach(b=>b.onclick=()=>{saveProvince('');paint('');syncPanels('')})}
function select(name,source){const p=find(name);if(!p)return;const canonical=p.name;saveProvince(canonical);paint(canonical);syncPanels(canonical);shells().forEach(shell=>{if(shell===source)return;const target=findShape(shell,canonical);if(target&&!target.classList.contains('selected'))target.click()});paint(canonical);syncPanels(canonical)}
let syncingMode=false;
function setMode(id){if(syncingMode)return;syncingMode=true;saveMode(id);shells().forEach(shell=>{const b=$(`.mode-tabs [data-v30-mode="${id}"]`,shell);if(b&&!b.classList.contains('active'))b.click()});syncingMode=false}
function bind(shell){if(!shell||shell.dataset.yb361==='1')return;shell.dataset.yb361='1';shell.addEventListener('click',e=>{const mb=e.target.closest?.('.mode-tabs [data-v30-mode]');if(mb){setMode(mb.dataset.v30Mode);return}const shape=e.target.closest?.('.province-shape,[data-province]');if(shape&&$('.atlas-svg',shell)?.contains(shape))select(shapeName(shape),shell)},true)}
function restore(){shells().forEach(bind);const m=getMode();shells().forEach(shell=>{const b=$(`.mode-tabs [data-v30-mode="${m}"]`,shell);if(b&&!b.classList.contains('active'))b.click()});const n=getProvince();if(n&&find(n)){paint(find(n).name);syncPanels(find(n).name)}else paint('')}
let timer=0;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(restore,80)}).observe(document.body,{subtree:true,childList:true});
window.addEventListener('storage',e=>{if(e.key===MODE_KEY||e.key===PROVINCE_KEY)setTimeout(restore,30)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',restore,{once:true});else restore();
})();
