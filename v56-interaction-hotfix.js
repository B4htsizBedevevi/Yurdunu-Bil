(()=>{'use strict';
if(window.__YB56_INTERACTION_HOTFIX__)return;window.__YB56_INTERACTION_HOTFIX__=true;
const $=(s,r=document)=>r.querySelector(s);
const toast=(m,t='ok')=>{if(typeof window.showToast==='function')window.showToast(m,t)};
const nav=v=>{if(typeof window.navigate==='function')window.navigate(v)};
function removeLegacyProfile(){const old=$('#profile-menu');if(old)old.remove()}
function profileHeader(){const b=$('[data-yb56-profile]');if(!b||b.dataset.bound==='1')return;if(!$('#view-settings'))return;b.dataset.bound='1';b.addEventListener('click',e=>{e.preventDefault();nav('settings');setTimeout(()=>window.YB56ProfileSettings?.open?.('profile'),0)})}
function socialFallback(){document.addEventListener('click',e=>{const b=e.target.closest('[data-yb55-social]');if(!b)return;if(typeof window.YB53Social?.open==='function')return;e.preventDefault();e.stopImmediatePropagation();if(typeof window.YBArena?.open==='function')window.YBArena.open();else toast('Arena şu anda hazırlanıyor.','error')},true)}
function deadAnchorGuard(){document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a)return;const href=(a.getAttribute('href')||'').trim();if(href==='#'||href.toLowerCase().startsWith('javascript:')){e.preventDefault();if(a.dataset.view)nav(a.dataset.view)}},true)}
function routeAudit(){const valid=['dashboard','topics','provinceStudy','library','quiz','events','stats','favorites','settings'];document.querySelectorAll('[data-view]').forEach(el=>{const v=el.dataset.view;if(v!=='map'&&!valid.includes(v))console.warn('[YB56] Unknown internal route:',v)})}
function boot(){removeLegacyProfile();profileHeader();socialFallback();deadAnchorGuard();routeAudit();new MutationObserver(()=>{removeLegacyProfile();profileHeader();routeAudit()}).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else setTimeout(boot,0);
})();