/* Yurdunu Bil 94 — single interaction kernel + dead-control bridge */
(()=>{'use strict';
if(window.__YB94_KERNEL__)return;window.__YB94_KERNEL__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ROUTES=new Set(['home','library','events','settings']);
let bypass=false;
const titles={home:'Ana Sayfa',library:'Kütüphane',events:'Etkinlikler & Oyunlar',settings:'Ayarlar'};
function withBypass(fn){bypass=true;try{return fn()}finally{bypass=false}}
function routeVisual(v){v=ROUTES.has(v)?v:'home';window.YURDUNUBIL_ROUTE=v;$$('.view').forEach(x=>x.classList.toggle('active',x.id==='view-'+v));$$('.nav-item[data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view===v));$('.yb82-home-nav')?.classList.toggle('active',v==='home');const t=$('#page-title');if(t)t.textContent=titles[v]||titles.home;return v}
function go(v){v=ROUTES.has(v)?v:'home';if(v==='home'){if(window.YB90Home?.showHome)return window.YB90Home.showHome();const h=$('.yb82-home-nav');if(h)return withBypass(()=>h.click());routeVisual('home');window.dispatchEvent(new CustomEvent('yb:navigate',{detail:{view:'home'}}));return}const b=$(`.nav-item[data-view="${v}"]`);if(b)return withBypass(()=>b.click());routeVisual(v);window.dispatchEvent(new CustomEvent('yb:navigate',{detail:{view:v}}))}
window.navigate=go;window.YBAppNavigate=go;
function normalizeSidebar(){const nav=$('.side-nav');if(!nav)return;const work=$$('.nav-label',nav).find(x=>x.textContent.trim()==='ÇALIŞMA'),account=$$('.nav-label',nav).find(x=>x.textContent.trim()==='HESAP');const home=$('.yb82-home-nav',nav),lib=$('.nav-item[data-view="library"]',nav),arena=$('.yb81-arena',nav),events=$('.nav-item[data-view="events"]',nav),settings=$('.nav-item[data-view="settings"]',nav),logout=$('#logout-btn',nav);[home,lib,arena,events,settings,logout].filter(Boolean).forEach(x=>x.type='button');if(home)home.dataset.view='home';if(work){let last=work;[home,lib,arena,events].filter(Boolean).forEach(x=>{last.insertAdjacentElement('afterend',x);last=x})}if(account){let last=account;[settings,logout].filter(Boolean).forEach(x=>{last.insertAdjacentElement('afterend',x);last=x})}}
function cleanEvents(){const v=$('#view-events');if(!v)return;v.querySelectorAll('.arena-entry,#open-arena,#open-social,.yb55-arena-restore').forEach(x=>x.remove())}
function openTopic(id){go('library');setTimeout(()=>document.querySelector(`[data-open-topic="${CSS.escape(String(id))}"]`)?.click(),40)}
function openWrong(){if(window.YB88QuestionCenter?.openQuiz)return window.YB88QuestionCenter.openQuiz('wrong');go('library');setTimeout(()=>document.querySelector('#yb88-start-wrong')?.click(),60)}
function handleSpecial(el){
 const d=el.dataset||{};
 if(d.view&&ROUTES.has(d.view))return go(d.view);
 if(d.yb55Game)return window.YB55Games?.start?.(d.yb55Game);
 if(d.game)return window.YB55Games?.start?.(d.game);
 if(d.yb55Arena)return window.YBArena?.open?.();
 if(d.yb55Social)return window.YB53Social?.open?.();
 if(d.yb78Action==='arena')return window.YB79Arena?.open?.()||window.YBArena?.open?.();
 if(el.matches('[data90="library"]'))return go('library');
 if(el.matches('[data90="events"]'))return go('events');
 if(el.matches('[data90="arena"]'))return window.YBArena?.open?.();
 if(el.matches('[data90="wrong"]'))return openWrong();
 if(el.hasAttribute('data90topic'))return openTopic(el.getAttribute('data90topic'));
}
function audit(){normalizeSidebar();cleanEvents();const v=window.YURDUNUBIL_ROUTE||document.querySelector('.view.active')?.id?.replace('view-','')||'home';routeVisual(v)}
document.addEventListener('click',e=>{
 if(bypass)return;
 const el=e.target.closest?.('.yb81-arena,.quick-test,.yb82-home-nav,[data-view],[data90],[data90topic],[data-yb55-game],[data-game],[data-yb55-arena],[data-yb55-social],[data-yb78-action]');
 if(!el)return;
 if(el.matches('.yb81-arena')){e.preventDefault();e.stopImmediatePropagation();window.YBArena?.open?.();return}
 if(el.matches('.quick-test')){e.preventDefault();e.stopImmediatePropagation();go('events');return}
 if(el.matches('.yb82-home-nav')){e.preventDefault();e.stopImmediatePropagation();window.YB90Home?.showHome?.();return}
 const special=handleSpecial(el);
 if(special!==undefined){e.preventDefault();e.stopImmediatePropagation()}
},true);
document.addEventListener('yb:navigate',e=>{if(bypass)return;const v=e.detail?.view;if(ROUTES.has(v))routeVisual(v)});
window.addEventListener('load',()=>setTimeout(audit,120));
setInterval(()=>{if(!document.hidden)audit()},2500);
window.YB94Kernel={audit,go,route:routeVisual};
})();
