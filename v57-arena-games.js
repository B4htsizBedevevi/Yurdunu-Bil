/* Yurdunu Bil 57.1 — Arena game-room experience */
(()=>{'use strict';
if(window.__YB57_ARENA_GAMES__)return;window.__YB57_ARENA_GAMES__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const GAMES={
 sprint:{icon:'⚡',title:'Bilgi Sprinti',desc:'Süre baskısı yüksek. En hızlı doğru cevapları topla.',tag:'HIZ',mode:'speed',time:'15 sn',rounds:'10 tur'},
 ten:{icon:'🎯',title:'10’da 10',desc:'Tam 10 soru. Hedef basit: rakibinden daha çok doğru.',tag:'KLASİK',mode:'duel',time:'25 sn',rounds:'10 tur'},
 hint:{icon:'💡',title:'İpucu Avı',desc:'Yanlış seçenekleri ele, risk al ve doğruyu bul.',tag:'TAKTİK',mode:'chain',time:'25 sn',rounds:'10 tur'},
 lives:{icon:'❤️',title:'3 Can',desc:'Hata baskısı yüksek. Üç kritik hata hakkın var.',tag:'ELEME',mode:'duel',time:'25 sn',rounds:'10 tur'},
 streak:{icon:'🔥',title:'Seri Ustası',desc:'Arka arkaya doğru cevaplarla rakibine fark at.',tag:'SERİ',mode:'speed',time:'15 sn',rounds:'10 tur'},
 region:{icon:'🧭',title:'Bölge Blitz',desc:'Türkiye’nin bölgeleri ve coğrafya bilgisi üzerine hızlı kapışma.',tag:'BÖLGELER',mode:'chain',time:'25 sn',rounds:'10 tur'}
};
let selected='ten', originalOpen=null, originalCreate=null, originalMatchmake=null;
function toast(t){const r=$('#toast-root');if(!r)return;const e=document.createElement('div');e.className='toast ok';e.textContent=t;r.appendChild(e);requestAnimationFrame(()=>e.classList.add('show'));setTimeout(()=>{e.classList.remove('show');setTimeout(()=>e.remove(),220)},1800)}
function activateMode(mode){const b=$(`.ybArenaModes [data-arena-mode="${mode}"]`);if(b)b.click();else{$$('.ybArenaModes button').forEach(x=>x.classList.toggle('active',x.dataset.arenaMode===mode))}}
function selectGame(id){selected=GAMES[id]?id:'ten';const g=GAMES[selected];activateMode(g.mode);$$('.yb57-arena-game').forEach(x=>x.classList.toggle('selected',x.dataset.game===selected));const n=$('#yb57-arena-selected');if(n)n.innerHTML=`<span>${g.icon}</span><div><b>${esc(g.title)}</b><small>${esc(g.rounds)} • ${esc(g.time)} • ${esc(g.tag)}</small></div>`;const rule=$('#yb57-arena-rule');if(rule)rule.textContent=g.desc}
function roomPanel(){const old=$('.ybArenaGrid article:nth-child(2)');if(!old)return;originalCreate=$('[data-arena-action="create"]',old);originalMatchmake=$('[data-arena-action="matchmake"]');const p=document.createElement('article');p.className='ybArenaCard yb57-room-card';p.innerHTML=`<div class="yb57-room-head"><div class="ybArenaIcon">🎮</div><div><span class="ybArenaTag">ODA KUR</span><h3>Oyununuzu seçin</h3></div></div><p>Artık Arena sadece klasik soru düellosu değil. Odayı kurarken oynanış tipini belirle.</p><div class="yb57-game-picker">${Object.entries(GAMES).map(([id,g])=>`<button type="button" class="yb57-arena-game${id===selected?' selected':''}" data-game="${id}"><span>${g.icon}</span><div><b>${esc(g.title)}</b><small>${esc(g.desc)}</small></div><i>✓</i></button>`).join('')}</div><div class="yb57-room-selected" id="yb57-arena-selected"></div><div class="yb57-room-rule"><b>Oyun kuralı</b><span id="yb57-arena-rule"></span></div><button class="btn primary full" id="yb57-create-room">Odayı Kur →</button>`;old.replaceWith(p);$$('[data-game]',p).forEach(b=>b.onclick=()=>selectGame(b.dataset.game));$('#yb57-create-room')?.addEventListener('click',()=>{activateMode(GAMES[selected].mode);if(originalCreate)originalCreate.click();else toast('Oda oluşturma düğmesi hazır değil.')});selectGame(selected)}
function fastPanel(){const old=$('.ybArenaGrid article:first-child');if(!old||$('.yb57-fast-card'))return;old.classList.add('yb57-fast-card');const p=document.createElement('div');p.className='yb57-fast-choice';p.innerHTML=`<span class="yb57-mini-label">SEÇİLİ OYUN</span><div id="yb57-fast-selected"></div>`;old.querySelector('p')?.after(p);const b=old.querySelector('[data-arena-action="matchmake"]');if(b)b.textContent='Bu oyunla rakip bul →';function paint(){const g=GAMES[selected];const e=$('#yb57-fast-selected');if(e)e.innerHTML=`<span>${g.icon}</span><b>${esc(g.title)}</b><small>${esc(g.tag)} • ${esc(g.time)}</small>`}paint();window.addEventListener('yb57-arena-game-selected',paint)}
function enhance(){const v=$('#view-events');if(!v||!$('.ybArena',v))return;if($('.yb57-room-card',v))return;roomPanel();fastPanel()}
function open(){if(originalOpen)originalOpen();setTimeout(enhance,50);setTimeout(enhance,250);setTimeout(enhance,700)}
function boot(){const wait=setInterval(()=>{if(window.YBArena?.open){clearInterval(wait);originalOpen=window.YBArena.open.bind(window.YBArena);window.YBArena.open=open;enhance()}},100);setTimeout(()=>clearInterval(wait),10000)}
new MutationObserver(()=>{if($('.ybArena'))setTimeout(enhance,40)}).observe(document.body,{childList:true,subtree:true});
window.addEventListener('yb57-profile-complete',()=>setTimeout(enhance,200));boot();
window.YB57ArenaGames={select:id=>selectGame(id),games:GAMES};
})();
