/* Yurdunu Bil 81 — dedicated Arena in primary navigation */
(()=>{'use strict';
if(window.__YB81_NAV__)return;window.__YB81_NAV__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function install(){
 const nav=$('.side-nav');if(!nav)return;
 let arena=$('.yb81-nav-item.yb81-arena',nav);
 if(!arena){
   arena=document.createElement('button');arena.type='button';arena.className='yb81-nav-item yb81-arena';arena.innerHTML='<span class="yb81-icon">⚔</span><span>Arena</span>';
   const events=$('.nav-item[data-view="events"]',nav);
   if(events)events.parentNode.insertBefore(arena,events);else nav.appendChild(arena);
 }
 if(!arena.dataset.bound){arena.dataset.bound='1';arena.addEventListener('click',()=>window.YBArena?.open?.())}
 const events=$('.nav-item[data-view="events"]',nav);
 if(events){events.innerHTML='<span>◈</span>Etkinlikler & Oyunlar'}
 const quick=$('.quick-test');if(quick&&!quick.dataset.yb81Bound){quick.dataset.yb81Bound='1';quick.textContent='⚡ Hızlı Oyuna Başla  →';quick.addEventListener('click',()=>{const b=$('.nav-item[data-view="events"]',nav);b?.click()})}
}
function markEvents(){const v=$('#view-events');if(v)v.classList.add('events-games-only')}
function run(){install();markEvents()}
window.addEventListener('load',()=>setTimeout(run,80));setInterval(run,1000);document.addEventListener('yb:navigate',run);
})();
