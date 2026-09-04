/* Yurdunu Bil v31 — province-aware atlas UI
 * Haritadaki her ili doğrudan PROVINCE_DATA ile eşleştirir.
 * Hover: hızlı özet / Click: kalıcı il bilgi paneli.
 */
(()=>{
'use strict';
const DATA=Array.isArray(window.PROVINCE_DATA)?window.PROVINCE_DATA:[];
const POP=window.POPULATION_2025||{};
const NS='http://www.w3.org/2000/svg';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=v=>String(v||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=v=>String(v||'').replace(/\s+/g,' ').trim();
function find(name){const n=norm(name);return DATA.find(p=>norm(p.name)===n)||null}
function val(p,key,fallback='—'){return clean(p?.[key])||fallback}
function positive(v){const n=norm(v);return !!n && !['yok','bulunmuyor','bulunmaz','bilgi yok','sinirli','sınırlı üretim','sınırlı'].includes(n) && !/^yok\b/.test(n)}
function first(v){return clean(v).split(/[,;•/]/).map(x=>x.trim()).filter(x=>x&&norm(x)!=='yok')[0]||'—'}
function population(p){return POP[p.name]||p.population||'—'}
function short(text,max=115){const t=clean(text);return t.length>max?t.slice(0,max-1).trimEnd()+'…':t}
function modeLabel(shell){return $('.mode-tabs [data-v30-mode].active',shell)?.textContent?.trim()||'Standart'}
function shellFor(svg){return svg?.closest('.atlas-shell')||null}
function selectedFromShell(shell){const h=$('.province-panel h2',shell.closest('.dashboard-layout,.map-layout')||document)?.textContent||'';return find(h)}
function ensureUI(shell){
 if(!shell||shell.querySelector('.map-v31-panel'))return;
 const panel=document.createElement('aside');panel.className='map-v31-panel';panel.setAttribute('aria-live','polite');
 panel.innerHTML=`<div class="map-v31-empty"><span class="map-v31-pin">⌖</span><div><b>Haritadan bir il seç</b><p>İlin üzerine gelerek hızlı özeti gör, tıklayarak KPSS bilgilerini sabitle.</p></div></div>`;
 const tools=$('.atlas-tools',shell);if(tools)tools.insertAdjacentElement('afterend',panel);else shell.insertAdjacentElement('afterbegin',panel);
 const tooltip=document.createElement('div');tooltip.className='map-v31-tooltip';tooltip.hidden=true;shell.appendChild(tooltip);
}
function cards(p){return [
 ['🧭','Bölge / iklim',`${val(p,'region')} • ${val(p,'climate')}`],
 ['⛰️','Yer şekilleri',short(val(p,'terrain'))],
 ['🌾','Tarım',short(val(p,'agriculture'))],
 ['⛏️','Maden / enerji',short(val(p,'mining'))],
 ['💧','Akarsular',short(val(p,'rivers'))],
 ['👥','Nüfus',population(p)]
]}
function renderPanel(shell,p){
 const panel=$('.map-v31-panel',shell);if(!panel)return;
 if(!p){panel.innerHTML=`<div class="map-v31-empty"><span class="map-v31-pin">⌖</span><div><b>Haritadan bir il seç</b><p>İlin üzerine gelerek hızlı özeti gör, tıklayarak KPSS bilgilerini sabitle.</p></div></div>`;return}
 const mode=modeLabel(shell);
 panel.innerHTML=`<div class="map-v31-head"><div><span class="eyebrow">${esc(mode)} • İL ATLASI</span><h3>${esc(p.name)} <small>${String(p.plate).padStart(2,'0')}</small></h3><p>${esc(val(p,'region'))} • ${esc(val(p,'climate'))}</p></div><span class="map-v31-live">● SEÇİLDİ</span></div><div class="map-v31-grid">${cards(p).map(c=>`<article><span>${c[0]}</span><small>${esc(c[1])}</small><b>${esc(c[2])}</b></article>`).join('')}</div><div class="map-v31-kpss"><span>🎯 KPSS ODAĞI</span><p>${esc(short(val(p,'kpss',val(p,'fact')),190))}</p></div><div class="map-v31-memory"><span>🧠 HAFIZA KANCASI</span><b>${esc(p.name)} → ${esc(short(val(p,'fact',val(p,'kpss')),150))}</b></div><div class="map-v31-actions"><button type="button" class="btn secondary" data-map-v31-study>📍 İl çalışmasına git</button><button type="button" class="btn primary" data-map-v31-quiz>✓ Test çöz</button></div><div class="map-v31-source">Nüfus: TÜİK ADNKS 2025 • Diğer alanlar: KPSS il atlası</div>`;
 panel.querySelector('[data-map-v31-study]')?.addEventListener('click',()=>{const b=document.querySelector('[data-view="provinceStudy"]');b?.click()});
 panel.querySelector('[data-map-v31-quiz]')?.addEventListener('click',()=>{const b=document.querySelector('[data-view="quiz"]');b?.click()});
}
function tooltip(shell,p,x,y){const t=$('.map-v31-tooltip',shell);if(!t)return;if(!p){t.hidden=true;return}t.innerHTML=`<b>${esc(p.name)}</b><span>${esc(val(p,'region'))} • ${esc(first(p.agriculture))}</span>`;t.hidden=false;const r=shell.getBoundingClientRect();t.style.left=Math.max(8,Math.min(shell.clientWidth-220,x-r.left+12))+'px';t.style.top=Math.max(8,y-r.top-14)+'px'}
function annotate(svg){
 const shapes=$$('.province-shape,[data-province]',svg);if(!shapes.length)return;
 shapes.forEach(shape=>{
  const raw=shape.dataset.province||shape.getAttribute('data-province')||shape.getAttribute('aria-label')||'';
  const p=find(raw);if(!p)return;
  shape.dataset.mapProvince=p.name;shape.setAttribute('tabindex','0');shape.setAttribute('role','button');shape.setAttribute('aria-label',`${p.name} ili — ${p.region}, ${p.climate}`);
  let title=shape.querySelector(':scope > title');if(!title){title=document.createElementNS(NS,'title');shape.insertBefore(title,shape.firstChild)}
  title.textContent=`${p.name} • ${p.region} • ${p.climate} • Tarım: ${first(p.agriculture)}`;
 });
}
function bind(svg){if(!svg||svg.dataset.mapV31==='1')return;svg.dataset.mapV31='1';const shell=shellFor(svg);ensureUI(shell);annotate(svg);
 const over=e=>{const shape=e.target.closest?.('.province-shape,[data-province]');if(!shape||!svg.contains(shape))return;const p=find(shape.dataset.mapProvince||shape.dataset.province);tooltip(shell,p,e.clientX,e.clientY);shape.classList.add('map-v31-hover')};
 const out=e=>{const shape=e.target.closest?.('.province-shape,[data-province]');if(shape)shape.classList.remove('map-v31-hover');if(!e.relatedTarget||!shell.contains(e.relatedTarget))tooltip(shell,null)};
 svg.addEventListener('pointerover',over);svg.addEventListener('pointermove',e=>{const shape=e.target.closest?.('.province-shape,[data-province]');if(shape){const p=find(shape.dataset.mapProvince||shape.dataset.province);tooltip(shell,p,e.clientX,e.clientY)}});svg.addEventListener('pointerout',out);
 const choose=e=>{const shape=e.target.closest?.('.province-shape,[data-province]');if(!shape||!svg.contains(shape))return;const p=find(shape.dataset.mapProvince||shape.dataset.province);if(!p)return;renderPanel(shell,p);$$('.map-v31-selected',svg).forEach(x=>x.classList.remove('map-v31-selected'));shape.classList.add('map-v31-selected');};
 svg.addEventListener('click',choose);svg.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const shape=e.target.closest?.('.province-shape,[data-province]');if(shape){e.preventDefault();shape.click()}}});
}
function refresh(){ $$('.atlas-shell').forEach(shell=>{const svg=$('.atlas-svg',shell);if(!svg)return;ensureUI(shell);annotate(svg);bind(svg);const p=selectedFromShell(shell);if(p&&shell.dataset.mapV31Selected!==p.name){shell.dataset.mapV31Selected=p.name;renderPanel(shell,p)}})}
let timer=0;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(refresh,80)}).observe(document.body,{subtree:true,childList:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();
})();
