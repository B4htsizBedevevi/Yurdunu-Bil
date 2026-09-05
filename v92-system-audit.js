/* Yurdunu Bil 93 — single interaction kernel */
(()=>{'use strict';
if(window.__YB93_KERNEL__)return;window.__YB93_KERNEL__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ROUTES=new Set(['home','library','events','settings']);
let bypass=false;
const titles={home:'Ana Sayfa',library:'Kütüphane',events:'Etkinlikler & Oyunlar',settings:'Ayarlar'};
function withBypass(fn){bypass=true;try{return fn()}finally{bypass=false}}
function setVisual(v){v=ROUTES.has(v)?v:'home';window.YURDUNUBIL_ROUTE=v;$$('.view').forEach(x=>x.classList.toggle('active',x.id==='view-'+v));$$('.nav-item[data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view===v));$('.yb82-home-nav')?.classList.toggle('active',v==='home');const t=$('#page-title');if(t)t.textContent=titles[v]||titles.home;const s=$('#page-wrap');if(s)s.scrollTop=0;return v}
function go(v){v=ROUTES.has(v)?v:'home';if(v==='home'){if(window.YB90Home?.showHome)return window.YB90Home.showHome();const h=$('.yb82-home-nav');if(h)return withBypass(()=>h.click());setVisual('home');window.dispatchEvent(new CustomEvent('yb:navigate',{detail:{view:'home'}}));return}const b=$(`.nav-item[data-view="${v}"]`);if(b)return withBypass(()=>b.click());setVisual(v);window.dispatchEvent(new CustomEvent('yb:navigate',{detail:{view:v}}))}
window.navigate=go;
window.YBAppNavigate=go;
function normalizeSidebar(){const nav=$('.side-nav');if(!nav)return;const work=$$('.nav-label',nav).find(x=>x.textContent.trim()==='ÇALIŞMA');const account=$$('.nav-label',nav).find(x=>x.textContent.trim()==='HESAP');const home=$('.yb82-home-nav',nav),lib=$('.nav-item[data-view="library"]',nav),arena=$('.yb81-arena',nav),events=$('.nav-item[data-view="events"]',nav),settings=$('.nav-item[data-view="settings"]',nav),logout=$('#logout-btn',nav);[home,lib,arena,events,settings,logout].filter(Boolean).forEach(x=>x.type='button');if(home)home.dataset.view='home';if(work){let last=work;[home,lib,arena,events].filter(Boolean).forEach(x=>{last.insertAdjacentElement('afterend',x);last=x})}if(account){let last=account;[settings,logout].filter(Boolean).forEach(x=>{last.insertAdjacentElement('afterend',x);last=x})}}
function cleanEvents(){const v=$('#view-events');if(!v)return;v.querySelectorAll('.arena-entry,#open-arena,#open-social').forEach(x=>x.remove())}
function audit(){normalizeSidebar();cleanEvents();const v=window.YURDUNUBIL_ROUTE||document.querySelector('.view.active')?.id?.replace('view-','')||'home';setVisual(ROUTES.has(v)?v:'home')}
document.addEventListener('click',e=>{if(bypass)return;const el=e.target.closest?.('.yb81-arena,.quick-test,.yb82-home-nav,[data-view]');if(!el)return;if(el.matches('.yb81-arena')){e.preventDefault();e.stopImmediatePropagation();window.YBArena?.open?.();return}if(el.matches('.quick-test')){e.preventDefault();e.stopImmediatePropagation();go('events');return}if(el.matches('.yb82-home-nav')){e.preventDefault();e.stopImmediatePropagation();if(window.YB90Home?.showHome)window.YB90Home.showHome();else setVisual('home');return}const v=el.dataset.view;if(ROUTES.has(v)){e.preventDefault();e.stopImmediatePropagation();go(v)}} ,true);
document.addEventListener('yb:navigate',e=>{if(bypass)return;const v=e.detail?.view;if(ROUTES.has(v))setVisual(v)});
window.addEventListener('load',()=>setTimeout(audit,120));
setInterval(()=>{if(!document.hidden)audit()},2500);
window.YB93Kernel={audit,go,setVisual};
})();
