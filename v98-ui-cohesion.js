/* Yurdunu Bil 98 — unified navigation + compatibility layer */
(()=>{'use strict';
if(window.__YB98_COHESION__)return;window.__YB98_COHESION__=true;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const ROUTES=['home','library','arena','events','settings'];
const LABELS={home:'Ana Sayfa',library:'Kütüphane',arena:'Arena',events:'Etkinlikler & Oyunlar',settings:'Ayarlar'};
function safeNavigate(view){
 if(view==='arena'&&window.YBArena?.open){window.YBArena.open();return}
 const target=$(`[data-view="${view}"]`); if(target&&target.classList.contains('nav-item')){target.click();return}
 const v=$(`#view-${view}`); if(!v)return;
 $$('.view').forEach(x=>x.classList.toggle('active',x===v));
 $('#page-title')&&( $('#page-title').textContent=LABELS[view]||view );
 document.dispatchEvent(new CustomEvent('yb:navigate',{detail:{view}}));
}
function cleanNav(){
 const nav=$('.side-nav');if(!nav)return;
 const home=$('[data-view="home"]',nav),lib=$('[data-view="library"]',nav),arena=$('#sidebar-arena-btn',nav),events=$('[data-view="events"]',nav),settings=$('[data-view="settings"]',nav);
 if(home)home.remove();
 const firstLabel=$('.nav-label',nav);if(firstLabel)firstLabel.textContent='ÇALIŞMA';
 if(arena){arena.classList.add('yb98-nav-main');arena.innerHTML='<span class="yb98-icon">⚔</span><span>Arena</span>';}
 if(events)events.innerHTML='<span>◈</span>Etkinlikler & Oyunlar';
 [lib,arena,events,settings].forEach((el)=>{if(el)el.removeAttribute('aria-current')});
 let top=$('.yb98-top-nav');
 if(!top){
   top=document.createElement('nav');top.className='yb98-top-nav';top.setAttribute('aria-label','Ana gezinme');
   const brand=$('.breadcrumbs');
   if(brand){const wrap=document.createElement('div');wrap.className='yb98-top-nav-wrap';brand.parentNode.insertBefore(wrap,brand);wrap.appendChild(top);}
 }
 const existing=new Set($$('.yb98-top-link',top).map(x=>x.dataset.view));
 ROUTES.slice(0,4).forEach(view=>{
   if(existing.has(view))return;
   const b=document.createElement('button');b.type='button';b.className='yb98-top-link'+(view==='home'?' active':'');b.dataset.view=view;b.innerHTML=`<span>${view==='home'?'⌂':view==='library'?'▤':view==='arena'?'⚔':'◈'}</span>${LABELS[view]}`;b.addEventListener('click',()=>safeNavigate(view));top.appendChild(b);
 });
}
function hideDuplicateHome(){
 const nav=$('.side-nav');if(nav){$$('[data-view="home"]',nav).forEach(x=>x.remove())}
 const top=$('.yb98-top-nav');if(top){$$('[data-view]',top).forEach(b=>b.classList.toggle('active',b.dataset.view===(document.querySelector('.view.active')?.id||'').replace('view-','')))}
}
function styleShell(){
 if($('#yb98-style'))return;const s=document.createElement('style');s.id='yb98-style';s.textContent=`
.yb98-top-nav-wrap{display:flex;align-items:center;gap:14px;min-width:0}.yb98-top-nav{display:flex;align-items:center;gap:4px;overflow:auto;scrollbar-width:none;white-space:nowrap}.yb98-top-nav::-webkit-scrollbar{display:none}.yb98-top-link{border:1px solid transparent;background:transparent;color:inherit;opacity:.64;border-radius:11px;padding:8px 11px;font:700 12px/1 Inter,sans-serif;cursor:pointer;transition:.18s ease}.yb98-top-link span{margin-right:6px;font-size:14px}.yb98-top-link:hover{opacity:1;background:rgba(255,255,255,.055)}.yb98-top-link.active{opacity:1;background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.08)}
.sidebar .side-nav{padding-top:8px}.sidebar .side-nav>[data-view="home"]{display:none!important}.sidebar .yb98-nav-main{margin-top:2px}.yb98-nav-main .yb81-icon{font-size:16px}.yb98-top-nav button{flex:0 0 auto}.breadcrumbs{flex:0 0 auto}.topbar{gap:14px}.global-search{margin-left:auto}
@media(max-width:900px){.yb98-top-nav-wrap{order:3;width:100%;overflow:hidden}.topbar{flex-wrap:wrap}.global-search{margin-left:0;flex:1}.yb98-top-nav{width:100%}.yb98-top-link{padding:7px 9px;font-size:11px}}
@media(max-width:620px){.yb98-top-link{padding:7px 8px}.yb98-top-link span{margin-right:3px}.yb98-top-link{font-size:10px}.profile-chip small{display:none}}
` ;document.head.appendChild(s);
}
function sync(){cleanNav();hideDuplicateHome();styleShell();const active=$('.view.active')?.id?.replace('view-','');$$('.yb98-top-link').forEach(b=>b.classList.toggle('active',b.dataset.view===active));}
document.addEventListener('yb:navigate',()=>setTimeout(sync,30));
window.addEventListener('load',()=>setTimeout(sync,120));
new MutationObserver(()=>setTimeout(sync,40)).observe(document.body,{childList:true,subtree:true});
})();
