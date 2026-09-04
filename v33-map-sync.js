/* Yurdunu Bil v36.1 — reliable atlas selection sync
 * Tek seçim kaynağı: iki atlas aynı ili, modu ve seçili görseli kullanır.
 */
(()=>{
'use strict';
const MODE_KEY='yb_map_mode_v33';
const PROVINCE_KEY='yb_map_province_v33';
const DATA=Array.isArray(window.PROVINCE_DATA)?window.PROVINCE_DATA:[];
const POP=window.POPULATION_2025||{};
const AREAS=window.PROVINCE_AREAS||{};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=v=>String(v||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=v=>String(v??'').replace(/\s+/g,' ').trim()||'Veri yok';
const find=name=>DATA.find(p=>norm(p.name)===norm(name))||null;
function shells(){return $$('.atlas-shell')}
function activeMode(shell){return $('.mode-tabs [data-v30-mode].active',shell)?.dataset.v30Mode||shell?.dataset.v30Mode||'default'}
function getMode(){try{return localStorage.getItem(MODE_KEY)||'default'}catch{return 'default'}}
function getProvince(){try{return localStorage.getItem(PROVINCE_KEY)||''}catch{return ''}}
function saveMode(id){try{localStorage.setItem(MODE_KEY,id)}catch{}}
function saveProvince(name){try{name?localStorage.setItem(PROVINCE_KEY,name):localStorage.removeItem(PROVINCE_KEY)}catch{}}
function shapeName(shape){return shape?.dataset.province||shape?.getAttribute('data-province')||shape?.dataset.mapProvince||''}
function findShape(shell,name){const n=norm(name);const svg=$('.atlas-svg',shell);if(!svg||!n)return null;return $$('.province-shape,[data-province]',svg).find(s=>norm(shapeName(s))===n)||null}
function paintSelection(name){
 const n=norm(name);
 shells().forEach(shell=>{
  const svg=$('.atlas-svg',shell);if(!svg)return;
  $$('.province-shape',svg).forEach(s=>s.classList.toggle('selected',!!n&&norm(shapeName(s))===n));
  $$('.province-shape',svg).forEach(s=>s.classList.toggle('map-v31-selected',!!n&&norm(shapeName(s))===n));
  $$('.province-label',svg).forEach(t=>t.classList.toggle('selected',!!n&&norm(t.dataset.provinceLabel||'')===n));
 });
}
function panelHtml(p){
 if(!p)return `<div class="empty-province"><div class="empty-icon">⌖</div><h2>Bir il seç</h2><p>Haritadaki bir ile tıklayarak o ilin KPSS için önemli coğrafya bilgilerini aç.</p><div class="empty-pills"><span>⛰️ Dağlar</span><span>🌾 Ovalar</span><span>💧 Göller</span><span>🌊 Akarsular</span><span>🌱 Tarım</span><span>⛏️ Maden</span></div></div>`;
 const val=k=>esc(clean(p[k]));
 const pop=POP[p.name]||p.population||'Veri yok';
 const area=AREAS[p.name];
 return `<div class="province-panel-inner"><div class="province-top"><div class="plate">${esc(p.plate)}</div><div><span class="eyebrow">SEÇİLEN İL • ${esc(p.region)} BÖLGESİ</span><h2>${esc(p.name)}</h2><p>${val('fact')}</p></div><button class="icon-btn close-province" type="button" data-yb-clear-province>×</button></div><div class="quick-note"><span>🧠 KPSS HIZLI ÖZET</span><b>${val('kpss')}</b></div><div class="geo-grid"><div><small>🌦️ İKLİM</small><b>${val('climate')}</b></div><div><small>⛰️ DAĞLAR / ARAZİ</small><b>${val('terrain')}</b></div><div><small>🌾 OVALAR</small><b>${val('plains')}</b></div><div><small>💧 GÖLLER / SULAK</small><b>${val('lakes')}</b></div><div><small>🌊 AKARSULAR</small><b>${val('rivers')}</b></div><div><small>🌱 TARIM</small><b>${val('agriculture')}</b></div><div><small>⛏️ MADEN / KAYNAK</small><b>${val('mining')}</b></div><div><small>👥 2025 NÜFUSU</small><b>${esc(pop)}</b></div>${area?`<div><small>📐 YÜZ ÖLÇÜMÜ</small><b>${area.toLocaleString('tr-TR')} km²</b></div>`:''}</div><div class="geography-note"><span>▦ COĞRAFYA NOTU</span><p>${val('fact')}</p></div><div class="memory"><span>⚡ HAFIZA KODU</span><p>${val('kpss')}</p></div></div>`;
}
function syncPanels(name){const p=find(name);const html=panelHtml(p);$$('.province-panel').forEach(panel=>panel.innerHTML=html);$$('[data-yb-clear-province]').forEach(b=>b.onclick=()=>{saveProvince('');paintSelection('');syncPanels('')})}
function selectProvince(name,source){
 const p=find(name);if(!p)return;
 const canonical=p.name;
 saveProvince(canonical);
 paintSelection(canonical);
 syncPanels(canonical);
 shells().forEach(shell=>{
  if(shell===source)return;
  const target=findShape(shell,canonical);
  if(target&&!target.classList.contains('selected')){
   target.click();
  }
 });
 paintSelection(canonical);
 syncPanels(canonical);
}
function setModeEverywhere(id){
 saveMode(id);
 shells().forEach(shell=>{
  const b=$(`.mode-tabs [data-v30-mode="${id}"]`,shell);
  if(b&&!b.classList.contains('active'))b.click();
 });
}
function bindShell(shell){
 if(!shell||shell.dataset.yb361==='1')return;
 shell.dataset.yb361='1';
 shell.addEventListener('click',e=>{
  const modeBtn=e.target.closest?.('.mode-tabs [data-v30-mode]');
  if(modeBtn){e.stopPropagation();setModeEverywhere(modeBtn.dataset.v30Mode);return}
  const shape=e.target.closest?.('.province-shape,[data-province]');
  if(shape&&$('.atlas-svg',shell)?.contains(shape)){
   e.stopPropagation();
   selectProvince(shapeName(shape),shell);
  }
 },true);
}
function restore(){
 shells().forEach(bindShell);
 const mode=getMode();
 if(mode) shells().forEach(shell=>{
  const b=$(`.mode-tabs [data-v30-mode="${mode}"]`,shell);
  if(b&&!b.classList.contains('active'))b.click();
 });
 const name=getProvince();
 if(name){
  const p=find(name);
  if(p){paintSelection(p.name);syncPanels(p.name)}
 }else{paintSelection('')}
}
let timer=0;
new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(restore,80)}).observe(document.body,{subtree:true,childList:true});
window.addEventListener('storage',e=>{if(e.key===MODE_KEY||e.key===PROVINCE_KEY)setTimeout(restore,30)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',restore,{once:true});else restore();
})();
