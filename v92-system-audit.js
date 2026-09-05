/* Yurdunu Bil 92 — single navigation and interaction audit */
(()=>{'use strict';
if(window.__YB92_AUDIT__)return;window.__YB92_AUDIT__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ROUTES=new Set(['home','library','events','settings']);
let busy=false;
function route(){return String(window.YURDUNUBIL_ROUTE||'home')}
function setActive(v){
  v=ROUTES.has(v)?v:'home';window.YURDUNUBIL_ROUTE=v;
  $$('.view').forEach(x=>x.classList.toggle('active',x.id==='view-'+v));
  $$('.nav-item[data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view===v));
  $$('.yb82-home-nav').forEach(x=>x.classList.toggle('active',v==='home'));
  $$('.yb81-arena').forEach(x=>x.classList.remove('active'));
  const t=$('#page-title');if(t)t.textContent=({home:'Ana Sayfa',library:'Kütüphane',events:'Etkinlikler & Oyunlar',settings:'Ayarlar'})[v];
  const sc=$('#page-wrap');if(sc)sc.scrollTop=0;
}
function normalizeSidebar(){
  const nav=$('.side-nav');if(!nav)return;
  const work=$$('.nav-label',nav).find(x=>x.textContent.trim()==='ÇALIŞMA');
  const account=$$('.nav-label',nav).find(x=>x.textContent.trim()==='HESAP');
  const home=$('.yb82-home-nav',nav),lib=$('.nav-item[data-view="library"]',nav),arena=$('.yb81-arena',nav),events=$('.nav-item[data-view="events"]',nav),settings=$('.nav-item[data-view="settings"]',nav),logout=$('#logout-btn',nav);
  if(home){home.type='button';home.dataset.view='home';}
  [home,lib,arena,events].filter(Boolean).forEach(x=>x.type='button');
  [settings,logout].filter(Boolean).forEach(x=>x.type='button');
  if(work){let last=work;[home,lib,arena,events].filter(Boolean).forEach(x=>{last.insertAdjacentElement('afterend',x);last=x})}
  if(account){let last=account;[settings,logout].filter(Boolean).forEach(x=>{last.insertAdjacentElement('afterend',x);last=x})}
  const duplicateKeys=new Map();
  $$('.side-nav button',nav).forEach(b=>{const key=b.id||b.dataset.view||b.className; if(duplicateKeys.has(key)&&key!==''){b.remove()}else duplicateKeys.set(key,b)});
}
function cleanEvents(){
  const v=$('#view-events');if(!v)return;
  v.querySelectorAll('.arena-entry,[id="open-arena"],[id="open-social"]').forEach(x=>x.remove());
}
function guardViews(){
  const vs=$$('.view');
  let active=vs.filter(v=>v.classList.contains('active'));
  if(active.length===0){setActive(route());return}
  const target=$('#view-'+route());
  const keep=target||active[0];
  vs.forEach(v=>v.classList.toggle('active',v===keep));
  const current=keep.id.replace('view-','');
  if(current!==route())setActive(current);
}
function run(){if(busy)return;busy=true;try{normalizeSidebar();guardViews();cleanEvents();document.body.classList.add('yb92-hardened')}finally{busy=false}}
function patchHome(){const h=$('.yb82-home-nav');if(h){h.dataset.view='home';h.type='button'}}
document.addEventListener('yb:navigate',e=>{window.YURDUNUBIL_ROUTE=e.detail?.view||window.YURDUNUBIL_ROUTE||'home';setActive(window.YURDUNUBIL_ROUTE);setTimeout(run,0)});
window.addEventListener('load',()=>setTimeout(run,40));
new MutationObserver(()=>requestAnimationFrame(run)).observe(document.body,{childList:true,subtree:true});
patchHome();run();
window.YB92Audit={run,setActive};
})();
