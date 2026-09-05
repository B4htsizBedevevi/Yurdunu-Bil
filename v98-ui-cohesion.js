/* Yurdunu Bil 98.2 — single-owner navigation + mobile shell hardening */
(()=>{'use strict';
if(window.__YB98_COHESION__)return;window.__YB98_COHESION__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const LABELS={home:'Ana Sayfa',library:'Kütüphane',arena:'Arena',events:'Etkinlikler & Oyunlar',settings:'Ayarlar'};
const NAV_LABELS={home:'Ana Sayfa',library:'Kütüphane',arena:'Arena',events:'Etkinlikler'};

function loadLearningIndex(){if(window.YBLearningIndex||window.__YB_LEARNING_LOADING__)return;window.__YB_LEARNING_LOADING__=true;const s=document.createElement('script');s.src='data/learning-index.js?v=98.2.0';s.onload=()=>window.__YB_LEARNING_READY__=true;s.onerror=()=>window.__YB_LEARNING_LOADING__=false;document.head.appendChild(s)}

function safeNavigate(view){
 if(view==='arena'&&window.YBArena?.open){window.YBArena.open();closeDrawer();return}
 const b=$(`.yb98-top-link[data-view="${view}"]`);
 if(b&&view!=='arena'){b.click();closeDrawer();return}
 const fallback=$(`[data-view="${view}"]`);if(fallback&&view!=='arena'){fallback.click();closeDrawer();return}
 const v=$(`#view-${view}`);if(!v)return;
 $$('.view').forEach(x=>x.classList.toggle('active',x===v));
 const title=$('#page-title');if(title)title.textContent=LABELS[view]||view;
 document.dispatchEvent(new CustomEvent('yb:navigate',{detail:{view}}));
 closeDrawer();
}

/* Eski sürümlerin drawer'a tekrar Arena/ana navigasyon eklemesini engelle. */
function cleanDrawer(){
 const sidebar=$('#sidebar');if(!sidebar)return;
 $$('.yb81-arena,#sidebar-arena-btn,.yb81-nav-item,.arena-entry,.events-arena-strip,.yb55-arena-restore,[data-yb55-arena],[data-yb55-social]',sidebar).forEach(x=>x.remove());
 const nav=$('.side-nav',sidebar);
 if(nav){
   $$('[data-view="home"],[data-view="library"],[data-view="events"]',nav).forEach(x=>x.remove());
   $$('.nav-label',nav).forEach(x=>x.textContent='HESAP');
 }
}

function ensureTopNav(){
 let top=$('.yb98-top-nav');
 if(!top){const host=$('.breadcrumbs');if(!host)return;top=document.createElement('nav');top.className='yb98-top-nav';top.setAttribute('aria-label','Ana gezinme');host.insertAdjacentElement('afterend',top)}
 const defs=[['home','⌂'],['library','▤'],['arena','⚔'],['events','◈']];
 defs.forEach(([view,icon])=>{
   let b=$(`.yb98-top-link[data-view="${view}"]`,top);
   if(!b){b=document.createElement('button');b.type='button';b.className='yb98-top-link';b.dataset.view=view;b.innerHTML=`<span class="yb98-icon">${icon}</span><span class="yb98-top-label"></span>`;b.addEventListener('click',()=>safeNavigate(view));top.appendChild(b)}
   const label=$('.yb98-top-label',b);if(label){label.textContent=NAV_LABELS[view]||LABELS[view]||view;label.title=LABELS[view]||view}
 });
 const active=$('.view.active')?.id?.replace(/^view-/,'')||'home';$$('.yb98-top-link',top).forEach(b=>b.classList.toggle('active',b.dataset.view===active));
}

function closeDrawer(){
 $('#sidebar')?.classList.remove('open');
 $('#drawer-backdrop')?.classList.remove('open');
 document.body.classList.remove('drawer-open');
}

function styleShell(){
 if($('#yb98-style'))return;
 const s=document.createElement('style');s.id='yb98-style';s.textContent=`
/* 98.2 — mobile shell: no giant translucent drawer, no legacy Arena card */
.topbar{position:relative;display:flex;align-items:center;gap:12px;min-width:0;flex-wrap:nowrap}
.breadcrumbs{flex:0 0 auto;min-width:0}
.yb98-top-nav{display:flex;align-items:center;gap:3px;min-width:0;max-width:min(52vw,620px);overflow-x:auto;scrollbar-width:none;white-space:nowrap;border:1px solid rgba(255,255,255,.07);background:rgba(8,19,33,.88);border-radius:15px;padding:3px}
.yb98-top-nav::-webkit-scrollbar{display:none}
.yb98-top-link{display:inline-flex;align-items:center;justify-content:center;gap:5px;border:1px solid transparent;background:transparent;color:inherit;opacity:.62;border-radius:11px;padding:8px 10px;font:800 11px/1 Inter,sans-serif;cursor:pointer;transition:transform .16s ease,background .16s ease,opacity .16s ease}
.yb98-top-link:hover{opacity:.95;background:rgba(255,255,255,.06);transform:translateY(-1px)}
.yb98-top-link.active{opacity:1;background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.06)}
.yb98-icon{font-size:14px}
.top-actions{margin-left:auto;min-width:0}
.global-search{max-width:320px}
.sidebar .side-nav{padding-top:8px}
.sidebar .nav-label{margin-top:4px}
.sidebar-user{margin-top:auto}
.quick-test{margin-top:6px}
/* Any old script that injects these nodes into the drawer is visually inert as well. */
#sidebar .yb81-arena,#sidebar #sidebar-arena-btn,#sidebar .yb81-nav-item,#sidebar .arena-entry,#sidebar .events-arena-strip,#sidebar .yb55-arena-restore{display:none!important}
@media(max-width:1100px){.yb98-top-nav{max-width:46vw}.global-search{max-width:240px}.yb98-top-label{display:none}}
@media(max-width:760px){
 .topbar{flex-wrap:wrap;gap:8px;padding-bottom:6px}
 .breadcrumbs{flex:1 1 auto;min-width:0}
 .yb98-top-nav{order:4;flex:1 0 100%;width:100%;max-width:none;overflow:hidden;padding:3px}
 .yb98-top-link{flex:1 1 0;min-width:0;padding:8px 5px;font-size:10px}
 .yb98-top-label{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
 .top-actions{order:2;margin-left:auto;max-width:58%}
 .global-search{display:none}
 .profile-chip{min-width:auto}
 .profile-chip>span:nth-child(2){display:none}
 /* Drawer is a compact sheet, never 70%+ of the screen. */
 #sidebar.sidebar{width:min(390px,88vw)!important;max-width:390px!important;min-width:0!important;background:#071522!important;background-color:#071522!important;box-shadow:18px 0 55px rgba(0,0,0,.42);border-right:1px solid rgba(105,205,255,.22)}
 #sidebar.sidebar.open{transform:translateX(0)!important}
 #drawer-backdrop.drawer-backdrop{background:rgba(1,7,14,.78)!important;backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px)}
 #sidebar .sidebar-user{margin-bottom:max(8px,env(safe-area-inset-bottom))}
 #sidebar .quick-test{min-height:58px!important}
 #sidebar .side-nav{margin-top:12px}
}
@media(max-width:480px){
 .yb98-top-label{font-size:10px}
 .yb98-top-link{padding:8px 4px}
 .yb98-icon{font-size:13px}
 .breadcrumbs>b,.breadcrumbs>span{display:none}
 .breadcrumbs>strong{font-size:18px}
 #sidebar.sidebar{width:88vw!important}
}
`;
 document.head.appendChild(s);
}

function sync(){loadLearningIndex();cleanDrawer();ensureTopNav();styleShell()}
document.addEventListener('yb:navigate',()=>setTimeout(sync,30));
window.addEventListener('load',()=>setTimeout(sync,100));
new MutationObserver(()=>setTimeout(sync,50)).observe(document.body,{childList:true,subtree:true});
})();
