/* Yurdunu Bil v31 — İl çalışma katmanı
 * Amaç: 81 ilin kartlarını KPSS için daha öğretici hale getirmek.
 * Mevcut PROVINCE_DATA alanlarını kullanır; yeni coğrafi iddia üretmez.
 */
(()=>{
'use strict';
const DATA=Array.isArray(window.PROVINCE_DATA)?window.PROVINCE_DATA:[];
const POP=window.POPULATION_2025||{};
const $=(s,r=document)=>r.querySelector(s);
const norm=v=>String(v||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=v=>String(v||'').replace(/\s+/g,' ').trim();
const storage='yb_province_study_v31';
function load(){try{return JSON.parse(localStorage.getItem(storage)||'{}')}catch{return {}}}
function save(x){try{localStorage.setItem(storage,JSON.stringify(x))}catch{}}
function province(name){const n=norm(name);return DATA.find(p=>norm(p.name)===n)||null}
function split(v){return clean(v).split(/[,;•/]/).map(x=>x.trim()).filter(x=>x&&x.toLocaleLowerCase('tr-TR')!=='yok').slice(0,4)}
function first(v,f='Belirtilmemiş'){const a=split(v);return a[0]||f}
function build(p){
 const st=load(), done=!!st[p.name];
 const pop=POP[p.name]||p.population||'—';
 const studyKey=`${p.region||'Türkiye'} • ${first(p.climate,'İklim')}`;
 const cards=[
  ['🧭','Konum & bölge',`${p.region||'Türkiye'} • ${clean(p.climate)||'İklim bilgisi mevcut'}`],
  ['⛰️','Yer şekilleri',clean(p.terrain)||'Yer şekilleri bilgisi mevcut'],
  ['🌾','Tarım',clean(p.agriculture)||'Tarım bilgisi mevcut'],
  ['⛏️','Maden / enerji',clean(p.mining)||'Maden bilgisi mevcut'],
  ['💧','Akarsu / su',clean(p.rivers)||'Su varlıkları bilgisi mevcut'],
  ['👥','Nüfus',pop]
 ];
 const memory=clean(p.fact)||clean(p.kpss)||'Bu ilin coğrafi özelliklerini alanlar arasında ilişkilendir.';
 return `<section class="province-study-v31" data-province="${esc(p.name)}">
   <div class="ps31-head">
    <div><span class="eyebrow">${esc(studyKey)}</span><h3>${esc(p.name)} <small>${String(p.plate).padStart(2,'0')}</small></h3><p>Bu ili KPSS için tek bakışta kodla.</p></div>
    <button class="ps31-done ${done?'is-done':''}" type="button" data-ps-done>${done?'✓ Çalışıldı':'○ Çalışıldı işaretle'}</button>
   </div>
   <div class="ps31-grid">${cards.map(c=>`<article><span>${c[0]}</span><small>${esc(c[1])}</small><b>${esc(c[2])}</b></article>`).join('')}</div>
   <div class="ps31-focus"><div><span>🎯 KPSS ODAĞI</span><p>${esc(clean(p.kpss)||memory)}</p></div><div><span>🧠 HAFIZA KANCASI</span><p><b>${esc(p.name)}</b> → ${esc(memory)}</p></div></div>
   <div class="ps31-actions"><button class="btn secondary" type="button" data-ps-expand>↕ Detayları aç</button><button class="btn primary" type="button" data-view="quiz">✓ Test çöz</button></div>
   <div class="ps31-detail" hidden>
    <div><b>İklim</b><p>${esc(clean(p.climate)||'—')}</p></div>
    <div><b>Yer şekilleri</b><p>${esc(clean(p.terrain)||'—')}</p></div>
    <div><b>Tarım</b><p>${esc(clean(p.agriculture)||'—')}</p></div>
    <div><b>Maden</b><p>${esc(clean(p.mining)||'—')}</p></div>
    <div><b>Akarsular</b><p>${esc(clean(p.rivers)||'—')}</p></div>
    <div><b>KPSS kısa not</b><p>${esc(clean(p.kpss)||memory)}</p></div>
   </div>
 </section>`;
}
function enhance(panel){
 const title=panel.querySelector('.province-top h2'); if(!title)return;
 const p=province(title.textContent); if(!p)return;
 let old=panel.querySelector('.province-study-v31');
 if(!old){const actions=panel.querySelector('.province-actions');if(!actions)return;actions.insertAdjacentHTML('beforebegin',build(p));old=panel.querySelector('.province-study-v31')}
 bind(old,p);
 const legacy=panel.querySelector('.province-extra-v29');if(legacy)legacy.hidden=true;
}
function bind(root,p){
 if(root.dataset.bound)return;root.dataset.bound='1';
 const done=root.querySelector('[data-ps-done]');
 done?.addEventListener('click',()=>{const st=load();st[p.name]=!st[p.name];save(st);done.classList.toggle('is-done',!!st[p.name]);done.textContent=st[p.name]?'✓ Çalışıldı':'○ Çalışıldı işaretle';});
 root.querySelector('[data-ps-expand]')?.addEventListener('click',e=>{const d=root.querySelector('.ps31-detail');const open=!d.hidden;d.hidden=open;e.currentTarget.textContent=open?'↕ Detayları aç':'↕ Detayları kapat';});
}
function scan(){document.querySelectorAll('.province-panel').forEach(enhance)}
const obs=new MutationObserver(()=>setTimeout(scan,30));
function start(){scan();obs.observe(document.body,{subtree:true,childList:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
