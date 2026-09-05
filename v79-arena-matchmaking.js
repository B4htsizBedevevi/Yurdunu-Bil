/* Yurdunu Bil 79 — mode-first Arena matchmaking */
(()=>{'use strict';
if(window.__YB79_ARENA__)return;window.__YB79_ARENA__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const MODES={duel:{icon:'⚔️',title:'Klasik Düello',desc:'25 sn • dengeli puanlama'},speed:{icon:'⚡',title:'Hız Arenası',desc:'15 sn • hız bonusu'},chain:{icon:'🔗',title:'Bilgi Zinciri',desc:'seri odaklı • baskı yüksek'}};
function open(){
 const v=$('#view-events');
 if(!v)return;
 const arena=$('#modal-root');
 // Existing Arena owns the actual realtime match flow. We present mode selection first,
 // then hand off to its public open() method with a preselected mode hint.
 const wrap=document.createElement('div');wrap.className='yb79-match-modal';
 wrap.innerHTML=`<div class="yb79-match-backdrop"></div><section class="yb79-match-card"><button class="yb79-match-close" aria-label="Kapat">×</button><span class="ybArenaKicker">CANLI ARENA</span><h2>Önce oyun modunu seç.</h2><p>Rakip aramadan önce nasıl yarışacağını belirle. Daha sonra Arena seni doğrudan bu modla eşleştirecek.</p><div class="yb79-mode-picker">${Object.entries(MODES).map(([id,m],i)=>`<button type="button" class="yb79-mode-option ${i===0?'active':''}" data-mode="${id}"><span class="yb79-mode-check">✓</span><span class="yb79-mode-icon">${m.icon}</span><b>${m.title}</b><small>${m.desc}</small></button>`).join('')}</div><div class="yb79-match-actions"><span class="yb79-selected-label">Seçili mod:</span><span class="yb79-mode-badge" data-selected>⚔️ Klasik Düello</span><button class="btn primary" data-start>Arena'da rakip ara →</button></div></section>`;
 arena.appendChild(wrap);
 let selected='duel';
 const select=id=>{selected=id;$$('.yb79-mode-option',wrap).forEach(b=>b.classList.toggle('active',b.dataset.mode===id));const m=MODES[id];const s=$('[data-selected]',wrap);if(s)s.textContent=`${m.icon} ${m.title}`};
 $$('[data-mode]',wrap).forEach(b=>b.addEventListener('click',()=>select(b.dataset.mode)));
 const close=()=>wrap.remove();$('.yb79-match-backdrop',wrap)?.addEventListener('click',close);$('.yb79-match-close',wrap)?.addEventListener('click',close);
 $('[data-start]',wrap)?.addEventListener('click',()=>{localStorage.setItem('yb_arena_mode_pref',selected);close();setTimeout(()=>window.YBArena?.open?.(),40)});
}
// Intercept the Events page's main Arena buttons so they always ask for the mode first.
function bind(){
 const v=$('#view-events');if(!v||!v.classList.contains('active'))return;
 $$('[id="open-arena"], [data-yb78-action="arena"]',v).forEach(b=>{if(b.dataset.yb79Bound)return;b.dataset.yb79Bound='1';b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();open()},true)});
 $$('[data-yb55-arena]',v).forEach(b=>{if(b.dataset.yb79Bound)return;b.dataset.yb79Bound='1';b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();open()},true)});
}
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='events')setTimeout(bind,120)});
window.addEventListener('load',()=>setTimeout(bind,250));
setInterval(bind,1200);
window.YB79Arena={open};
})();
