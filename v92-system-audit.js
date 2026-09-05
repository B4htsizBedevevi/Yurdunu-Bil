/* Yurdunu Bil 92 — defensive interaction audit */
(()=>{'use strict';
if(window.__YB92_AUDIT__)return;window.__YB92_AUDIT__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
let lastView='home';
function routeHome(){window.navigate?.('home')}
function routeView(v){if(v==='home')routeHome();else if(v)window.navigate?.(v)}
function normalizeNav(){const nav=$('.side-nav');if(!nav)return;const home=$('.yb82-home-nav',nav),lib=$('.nav-item[data-view="library"]',nav),arena=$('.yb81-arena',nav),events=$('.nav-item[data-view="events"]',nav),settings=$('.nav-item[data-view="settings"]',nav),logout=$('#logout-btn',nav);[home,lib,arena,events,settings,logout].forEach(x=>x?.remove());const label1=[...$$('.nav-label',nav)].find(x=>x.textContent.trim()==='ÇALIŞMA');const label2=[...$$('.nav-label',nav)].find(x=>x.textContent.trim()==='HESAP');
const mk=(cls,html)=>{const b=document.createElement('button');b.type='button';b.className=cls;b.innerHTML=html;return b};
const h=mk('yb81-nav-item yb82-home-nav','<span class="yb81-icon">⌂</span><span>Ana Sayfa</span>');h.addEventListener('click',e=>{e.preventDefault();routeHome()});
const l=mk('nav-item','<span>▤</span>Kütüphane');l.dataset.view='library';l.addEventListener('click',()=>routeView('library'));
const a=mk('yb81-nav-item yb81-arena','<span class="yb81-icon">⚔</span><span>Arena</span>');a.addEventListener('click',e=>{e.preventDefault();window.YBArena?.open?.()});
const ev=mk('nav-item','<span>◈</span>Etkinlikler &amp; Oyunlar');ev.dataset.view='events';ev.addEventListener('click',()=>routeView('events'));
const se=mk('nav-item','<span>⚙</span>Ayarlar');se.dataset.view='settings';se.addEventListener('click',()=>routeView('settings'));
const lo=mk('nav-item','<span>↪</span>Çıkış Yap');lo.id='logout-btn';lo.addEventListener('click',()=>window.__YB92_LOGOUT?.());
if(label1){label1.after(h,l,a,ev)}else nav.prepend(h,l,a,ev);if(label2)label2.after(se,lo);else nav.append(se,lo);
}
function guardViews(){const vs=$$('.view');const active=vs.filter(v=>v.classList.contains('active'));if(active.length>1){const keep=$('#view-'+lastView)||active[0];vs.forEach(v=>v.classList.toggle('active',v===keep))}const now=$('.view.active')?.id?.replace('view-','');if(now)lastView=now}
function bindGeneric(){document.addEventListener('click',e=>{const b=e.target.closest('button,a');if(!b)return;if(b.dataset.view&&['home','library','events','settings'].includes(b.dataset.view)){e.preventDefault();e.stopImmediatePropagation();routeView(b.dataset.view)}} ,true)}
function bridgeLogout(){window.__YB92_LOGOUT__=()=>{const b=$('#logout-btn');if(b&&b.__yb92_real) return b.__yb92_real();window.showToast?.('Çıkış yapılıyor…');const old=b?.getAttribute('onclick');if(old)try{new Function(old)()}catch{};}}
function run(){normalizeNav();guardViews();document.body.classList.add('yb92-hardened')}
bridgeLogout();bindGeneric();window.addEventListener('load',()=>setTimeout(run,30));document.addEventListener('yb:navigate',()=>setTimeout(run,20));setInterval(()=>{if(!document.hidden)run()},1500);
})();