/* Yurdunu Bil 21.7.2 — full map category/layer hotfix */
(() => {
  'use strict';
  const DATA = Array.isArray(window.PROVINCE_DATA) ? window.PROVINCE_DATA : [];
  const norm = v => String(v || '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c').trim();
  const get = name => DATA.find(p => norm(p.name) === norm(name));
  const has = v => !!v && v !== '—' && v !== 'Belirtilmemiş';
  const modes = [['default','Standart'],['region','Bölgeler'],['climate','İklim'],['agriculture','Tarım'],['mountains','Dağlar'],['plains','Ovalar'],['water','Su'],['mining','Maden']];
  const palette = {
    region:[['#4c8dff','Marmara'],['#a77bff','Ege'],['#ff876f','Akdeniz'],['#35c9ad','Karadeniz'],['#f0b84d','İç Anadolu'],['#7b8dff','Doğu Anadolu'],['#d86f9d','Güneydoğu Anadolu']],
    climate:[['#ef8a68','Akdeniz'],['#35c9ad','Karadeniz'],['#8c82ef','Karasal'],['#d0ad58','Geçiş']],
    agriculture:[['#35c7a4','Öne çıkan tarım'],['#347fb5','Tarım verisi'],['#253f59','Belirgin veri yok']],
    mountains:[['#8d76e8','Dağ bilgisi var'],['#27455f','Belirgin veri yok']],
    plains:[['#55c982','Ova bilgisi var'],['#27455f','Belirgin veri yok']],
    water:[['#36bce8','Göl / akarsu var'],['#27455f','Belirgin veri yok']],
    mining:[['#d39a4d','Maden / kaynak var'],['#27455f','Belirgin veri yok']],
    default:[['#2ec9a4','Keşfedilen il'],['#54d8ff','Seçili il']]
  };
  let mode = 'default';
  let observer;
  const qs = s => document.querySelector(s);
  const qsa = s => [...document.querySelectorAll(s)];
  const provinceFromPath = el => get(el?.dataset?.province);
  const plainsOf = p => {
    if (!p) return '';
    if (has(p.plains)) return p.plains;
    const parts = String(p.terrain || '').split(';').map(x => x.trim());
    return parts.slice(1).find(x => /ova|düzlük|kıyı ovas/i.test(x)) || '';
  };
  const modeFill = p => {
    if (!p) return '#2b73ad';
    if (mode === 'region') {
      const r = norm(p.region);
      if(r.includes('marmara')) return '#4c8dff'; if(r.includes('ege')) return '#a77bff'; if(r.includes('akdeniz')) return '#ff876f';
      if(r.includes('karadeniz')) return '#35c9ad'; if(r.includes('dogu')) return '#7b8dff'; if(r.includes('guney')) return '#d86f9d'; return '#f0b84d';
    }
    if (mode === 'climate') {
      const s = norm(p.climate); if(s.includes('akdeniz')) return '#ef8a68'; if(s.includes('karadeniz')) return '#35c9ad';
      if(s.includes('karasal')) return '#8c82ef'; if(s.includes('gecis')) return '#d0ad58'; return '#4f82c6';
    }
    if (mode === 'agriculture') {
      const s = norm(p.agriculture); if(/cay|findik|zeytin|pamuk|uzum|kayisi|narenciye|misir|bugday|arpa|seker/.test(s)) return '#35c7a4';
      return has(p.agriculture) ? '#347fb5' : '#253f59';
    }
    if (mode === 'mountains') return has(p.mountains || p.terrain) ? '#8d76e8' : '#27455f';
    if (mode === 'plains') return has(plainsOf(p)) ? '#55c982' : '#27455f';
    if (mode === 'water') return (has(p.lakes) || has(p.rivers)) ? '#36bce8' : '#27455f';
    if (mode === 'mining') return has(p.mining) ? '#d39a4d' : '#27455f';
    return null;
  };
  const apply = () => {
    qsa('#full-svg .province-shape').forEach(el => {
      const p = provinceFromPath(el); if(!p) return;
      const selected = el.classList.contains('selected');
      const fill = modeFill(p); if(fill) el.style.fill = selected ? 'url(#selectedProvinceGradient)' : fill;
    });
    const box = qs('#full-legend-items');
    if(box) box.innerHTML = (palette[mode] || palette.default).map(([c,t]) => `<div class="legend-row"><i class="legend-dot" style="background:${c}"></i>${t}</div>`).join('');
    const note = qs('#full-map-mode-note');
    if(note) note.textContent = `Katman: ${modes.find(x => x[0] === mode)?.[1] || 'Standart'}`;
  };
  const inject = () => {
    const view = qs('#view-map'); if(!view) return;
    const card = view.querySelector('.full-map-card'); const atlas = view.querySelector('#full-atlas');
    if(!card || !atlas) return;
    let controls = view.querySelector('.full-map-controls');
    if(!controls){
      controls = document.createElement('div'); controls.className='full-map-controls';
      controls.innerHTML='<div class="full-map-tabs"></div><span id="full-map-mode-note" class="full-map-mode-note">Katman: Standart</span>';
      card.parentNode.insertBefore(controls,card);
    }
    const tabs = controls.querySelector('.full-map-tabs');
    if(!tabs || tabs.dataset.ready==='1') return;
    tabs.dataset.ready='1';
    tabs.innerHTML=modes.map(([m,label],i)=>`<button type="button" class="map-tab ${i===0?'active':''}" data-full-map-mode="${m}">${label}</button>`).join('');
    tabs.addEventListener('click',e=>{const b=e.target.closest('[data-full-map-mode]');if(!b)return;mode=b.dataset.fullMapMode;tabs.querySelectorAll('.map-tab').forEach(x=>x.classList.toggle('active',x===b));apply();});
    apply();
  };
  const boot=()=>{inject();if(observer)observer.disconnect();const root=qs('#view-map');if(root){observer=new MutationObserver(()=>{inject();setTimeout(apply,30)});observer.observe(root,{childList:true,subtree:true})}setTimeout(apply,120)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
