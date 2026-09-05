/* Yurdunu Bil 92 — defensive interaction audit */
(()=>{'use strict';
if(window.__YB92_AUDIT__)return;window.__YB92_AUDIT__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function ensureHome(){const nav=$('.side-nav');if(!nav)return;const home=$('.yb82-home-nav',nav);if(!home)return;home.dataset.view='home';home.type='button';if(!home.dataset.yb92Bound){home.dataset.yb92Bound='1';home.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.navigate?.('home')})}}
function normalizeOrder(){const nav=$('.side-nav');if(!nav)return;const home=$('.yb82-home-nav',nav),lib=$('.nav-item[data-view="library"]',nav),arena=$('.yb81-arena',nav),events=$('.nav-item[data-view="events"]',nav);if(!home||!lib||!arena||!events)return;const labels=$$('.nav-label',nav),work=labels.find(x=>x.textContent.trim()==='ÇALIŞMA'),account=labels.find(x=>x.textContent.trim()==='HESAP'),settings=$('.nav-item[data-view="settings"]',nav),logout=$('#logout-btn',nav);if(work)work.after(home,lib,arena,events);if(account&&settings)account.after(settings);if(account&&logout)settings?.after(logout)}
function cleanEvents(){const v=$('#view-events');if(!v)return;v.querySelectorAll('.arena-entry').forEach(x=>x.remove());v.querySelectorAll('[id="open-arena"],[id="open-social"]').forEach(x=>x.remove())}
function activeSync(){const active=document.querySelector('.view.active')?.id?.replace('view-','');if(!active)return;$('.yb82-home-nav')?.classList.toggle('active',active==='home');$$('.nav-item[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===active))}
function guardViews(){const vs=$$('.view'),active=vs.filter(v=>v.classList.contains('active'));if(active.length>1){const keep=$('#view-home')?.classList.contains('active')?$('#view-home'):active[0];vs.forEach(v=>v.classList.toggle('active',v===keep))}}
function run(){ensureHome();normalizeOrder();activeSync();cleanEvents();document.body.classList.add('yb92-hardened')}
document.addEventListener('yb:navigate',run);window.addEventListener('load',()=>setTimeout(run,60));setInterval(()=>{if(!document.hidden)run()},2000);
})();