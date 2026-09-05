/* Yurdunu Bil 98 — unified navigation + mobile shell */
(()=>{'use strict';
if(window.__YB98_COHESION__)return;window.__YB98_COHESION__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const LABELS={home:'Ana Sayfa',library:'Kütüphane',arena:'Arena',events:'Etkinlikler & Oyunlar',settings:'Ayarlar'};
function loadLearningIndex(){if(window.YBLearningIndex||window.__YB_LEARNING_LOADING__)return;window.__YB_LEARNING_LOADING__=true;const s=document.createElement('script');s.src='data/learning-index.js?v=98.0.0';s.onload=()=>window.__YB_LEARNING_READY__=true;s.onerror=()=>window.__YB_LEARNING_LOADING__=false;document.head.appendChild(s)}
function safeNavigate(view){
 if(view==='arena'&&window.YBArena?.open){window.YBArena.open();return}
 const b=$(`.yb98-top-link[data-view="${view}"]`);if(b&&view!=='arena'){b.classList.add('active');b.dispatchEvent(new MouseEvent('click',{bubbles:true}));return}
 const fallback=$(`[data-view="${view}"]`);if(fallback&&view!=='arena'){fallback.click();return}
 const v=$(`#view-${view}`);if(!v)return;
 $$('.view').forEach(x=>x.classList.toggle('active',x===v));
 const title=$('#page-title');if(title)title.textContent=LABELS[view]||view;
 document.dispatchEvent(new CustomEvent('yb:navigate',{detail:{view}}));
}
function cleanDrawer(){
 const nav=$('.side-nav');if(!nav)return;
 $$('[data-view="home"],[data-view="library"],[data-view="events"],.yb81-arena,#sidebar-arena-btn',nav).forEach(x=>x.remove());
 const labels=$$('.nav-label',nav);labels.forEach(x=>x.textContent='HESAP');
}
function ensureTopNav(){
 let top=$('.yb98-top-nav');
 if(!top){const host=$('.breadcrumbs');if(!host)return;top=document.createElement('nav');top.className='yb98-top-nav';top.setAttribute('aria-label','Ana gezinme');host.insertAdjacentElement('afterend',top)}
 const defs=[['home','⌂'],['library','▤'],['arena','⚔'],['events','◈']];
 defs.forEach(([view,icon])=>{
   let b=$(`.yb98-top-link[data-view="${view}"]`,top);
   if(!b){b=document.createElement('button');b.type='button';b.className='yb98-top-link';b.dataset.view=view;b.innerHTML=`<span class="yb98-icon">${icon}</span><span class="yb98-top-label">${LABELS[view]}</span>`;b.addEventListener('click',()=>safeNavigate(view));top.appendChild(b)}
 });
 const active=$('.view.active')?.id?.replace(/^view-/,'')||'home';$$('.yb98-top-link',top).forEach(b=>b.classList.toggle('active',b.dataset.view===active));
}
function styleShell(){
 if($('#yb98-style'))return;
 const s=document.createElement('style');s.id='yb98-style';s.textContent=`
.topbar{position:relative;display:flex;align-items:center;gap:12px;min-width:0;flex-wrap:nowrap}.breadcrumbs{flex:0 0 auto;min-width:0}.yb98-top-nav{display:flex;align-items:center;gap:3px;min-width:0;max-width:min(52vw,620px);overflow-x:auto;scrollbar-width:none;white-space:nowrap;border:1px solid rgba(255,255,255,.07);background:rgba(8,19,33,.68);border-radius:15px;padding:3px}.yb98-top-nav::-webkit-scrollbar{display:none}.yb98-top-link{display:inline-flex;align-items:center;justify-content:center;gap:5px;border:1px solid transparent;background:transparent;color:inherit;opacity:.62;border-radius:11px;padding:8px 10px;font:800 11px/1 Inter,sans-serif;cursor:pointer;transition:transform .16s ease,background .16s ease,opacity .16s ease}.yb98-top-link:hover{opacity:.95;background:rgba(255,255,255,.06);transform:translateY(-1px)}.yb98-top-link.active{opacity:1;background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.06)}.yb98-icon{font-size:14px}.top-actions{margin-left:auto;min-width:0}.global-search{max-width:320px}.sidebar .side-nav{padding-top:8px}.sidebar .nav-label{margin-top:4px}.sidebar-user{margin-top:auto}.quick-test{margin-top:6px}
@media(max-width:1100px){.yb98-top-nav{max-width:46vw}.global-search{max-width:240px}.yb98-top-label{display:none}}
@media(max-width:760px){.topbar{flex-wrap:wrap;gap:8px;padding-bottom:6px}.breadcrumbs{flex:1 1 auto}.yb98-top-nav{order:4;flex:1 0 100%;width:100%;max-width:none;overflow-x:auto;padding:3px}.yb98-top-link{flex:1 0 auto;min-width:70px}.yb98-top-label{display:inline}.top-actions{order:2;margin-left:auto;max-width:58%}.global-search{display:none}.profile-chip{min-width:auto}.profile-chip>span:nth-child(2){display:none}}
@media(max-width:480px){.yb98-top-label{font-size:10px}.yb98-top-link{padding:8px 7px;min-width:0}.yb98-icon{font-size:13px}.breadcrumbs>b{display:none}.breadcrumbs>span{display:none}.breadcrumbs>strong{font-size:18px}}
`;
 document.head.appendChild(s);
}
function sync(){loadLearningIndex();cleanDrawer();ensureTopNav();styleShell()}
document.addEventListener('yb:navigate',()=>setTimeout(sync,30));
window.addEventListener('load',()=>setTimeout(sync,100));
new MutationObserver(()=>setTimeout(sync,50)).observe(document.body,{childList:true,subtree:true});
})();
