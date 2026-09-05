/* Yurdunu Bil 91 — navigation, sidebar and view hardening */
(()=>{'use strict';
if(window.__YB91_SYSTEM__)return;window.__YB91_SYSTEM__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ROUTES=new Set(['home','library','events','settings']);
let switching=false,booted=false;
function title(v){return ({home:'Ana Sayfa',library:'Kütüphane',events:'Etkinlikler & Oyunlar',settings:'Ayarlar'})[v]||'Ana Sayfa'}
function setActive(v){
  $$('.view').forEach(x=>x.classList.toggle('active',x.id==='view-'+v));
  $$('.side-nav [data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view===v));
  $$('.side-nav .yb91-home-nav').forEach(x=>x.classList.toggle('active',v==='home'));
  $$('.side-nav .yb81-arena').forEach(x=>x.classList.toggle('active',false));
  const t=$('#page-title');if(t)t.textContent=title(v);
  const sc=$('#page-wrap');if(sc)sc.scrollTop=0;
}
function nativeNavigate(v){
  const fn=window.__YB91_NATIVE_NAV__;
  if(typeof fn==='function')return fn(v);
  if(v==='home')return; 
  setActive(ROUTES.has(v)?v:'home');
  document.dispatchEvent(new CustomEvent('yb:navigate',{detail:{view:ROUTES.has(v)?v:'home'}}));
}
window.__YB91_NATIVE_NAV__=window.navigate;
window.navigate=(v)=>{
  v=ROUTES.has(v)?v:'home';
  if(v==='home'){
    setActive('home');
    document.dispatchEvent(new CustomEvent('yb:navigate',{detail:{view:'home'}}));
    window.YB90Home?.render?.();
    return;
  }
  nativeNavigate(v);
  setActive(v);
};
function reorderSidebar(){
 const nav=$('.side-nav');if(!nav)return;
 let home=$('.yb81-nav-item.yb82-home-nav',nav)||$('.yb91-home-nav',nav);
 if(!home){home=document.createElement('button');home.type='button';home.className='yb81-nav-item yb82-home-nav yb91-home-nav';home.innerHTML='<span class="yb81-icon">⌂</span><span>Ana Sayfa</span>';}
 home.classList.add('yb91-home-nav');
 const lib=$('.nav-item[data-view="library"]',nav), arena=$('.yb81-arena',nav), events=$('.nav-item[data-view="events"]',nav);
 const label=$('.nav-label',nav);
 if(label)label.insertAdjacentElement('afterend',home);
 if(lib)home.insertAdjacentElement('afterend',lib);
 if(arena)lib?.insertAdjacentElement('afterend',arena);
 if(events)arena?.insertAdjacentElement('afterend',events);
 if(!home.dataset.yb91Bound){home.dataset.yb91Bound='1';home.addEventListener('click',e=>{e.preventDefault();window.navigate('home');close();});}
 const quick=$('.quick-test');if(quick&&!quick.dataset.yb91Bound){quick.dataset.yb91Bound='1';quick.addEventListener('click',e=>{e.preventDefault();window.navigate('events');close();});}
}
function close(){document.body.classList.remove('sidebar-open');$('#sidebar')?.classList.remove('open');$('#drawer-backdrop')?.classList.remove('open');}
function enforceSingleView(){
 const views=$$('.view');const active=views.filter(v=>v.classList.contains('active'));
 if(active.length!==1){const keep=active[0]||$('#view-home')||views[0];views.forEach(v=>v.classList.toggle('active',v===keep));}
}
function defaultHome(){
 const shell=$('#app-shell');if(!shell||shell.classList.contains('hidden')||booted)return;
 booted=true;
 setTimeout(()=>{if($('#view-library')?.classList.contains('active'))window.navigate('home');},0);
}
function bindGlobal(){
 document.addEventListener('click',e=>{
   const home=e.target.closest('.yb82-home-nav,.yb91-home-nav,[data-view="home"],[data-home="home"]');
   if(home){e.preventDefault();window.navigate('home');close();}
   const arena=e.target.closest('.yb81-arena,[data-home="arena"]');
   if(arena){e.preventDefault();$('.side-nav .yb81-arena')?.classList.add('active');window.YBArena?.open?.();close();}
 });
 window.addEventListener('error',e=>{try{console.error('YB91 runtime error',e.error||e.message)}catch{}});
 window.addEventListener('unhandledrejection',e=>{try{console.error('YB91 promise rejection',e.reason)}catch{}});
}
function watch(){
 const shell=$('#app-shell');
 if(shell&&!shell.classList.contains('hidden')){reorderSidebar();defaultHome();}
 enforceSingleView();
}
bindGlobal();
new MutationObserver(()=>{if(switching)return; switching=true; requestAnimationFrame(()=>{switching=false;watch()})}).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',()=>setTimeout(watch,150));
setInterval(watch,1200);
})();
