/* Yurdunu Bil — shell reliability + auth gate */
(()=>{
'use strict';
if(window.__YB_UI_GUARD__)return;window.__YB_UI_GUARD__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reveal=()=>document.body.classList.remove('yb-starting');
const syncRoute=v=>{$$('.mobile-bottom-link').forEach(b=>b.classList.toggle('active',b.dataset.view===v));$$('.primary-nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===v));$$('.desktop-top-nav [data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===v))};
const animateNumber=(el,target,duration=900)=>{if(!el)return;target=Math.max(0,Number(target)||0);if(el.dataset.countAnimated===String(target))return;el.dataset.countAnimated=String(target);el.textContent='0';const start=performance.now();const frame=now=>{const p=Math.min(1,(now-start)/duration),eased=1-Math.pow(1-p,3);el.textContent=Math.round(target*eased).toLocaleString('tr-TR');if(p<1)requestAnimationFrame(frame)};requestAnimationFrame(frame)};
const animateAuthCounts=()=>{const topics=Array.isArray(window.TOPICS)?window.TOPICS:[],questions=Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:[];if(topics.length)animateNumber($('#auth-topic-count'),topics.length,650);if(questions.length)animateNumber($('#auth-question-count'),questions.length,1200)};
/* app.js owns home/library/events/settings; this guard only intercepts Arena because the legacy core normalises it to home. */
document.addEventListener('click',e=>{const el=e.target?.closest?.('[data-view="arena"],[data-mobile-view="arena"]');if(!el)return;e.preventDefault();e.stopImmediatePropagation();window.YBArena?.open?.();syncRoute('arena')},true);
document.addEventListener('yb:navigate',e=>syncRoute(e.detail?.view||'home'));
const finishBoot=()=>{animateAuthCounts();const app=$('#app-shell'),auth=$('#auth-screen');if(app&&!app.classList.contains('hidden'))reveal();else if(auth&&!auth.classList.contains('hidden'))reveal()};
const watch=id=>{const el=$(id);if(el)new MutationObserver(finishBoot).observe(el,{attributes:true,attributeFilter:['class']})};
watch('#app-shell');watch('#auth-screen');
window.addEventListener('load',()=>{finishBoot();setTimeout(finishBoot,300);setTimeout(finishBoot,1200)});
animateAuthCounts();
})();
