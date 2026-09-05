/* Yurdunu Bil — canonical boot during staged migration. */
(()=>{
'use strict';
if(window.__YB_CANONICAL_BOOT__)return;
window.__YB_CANONICAL_BOOT__=true;
const root=window.YBRuntime||window.YB44||{};
const base=new URL('../',document.currentScript?.src||location.href);
const files=[
'data/questions.js','data/questions-v55.js','data/questions-v59.js','data/questions-v61.js','data/questions-v84.js','data/questions-v87a.js','data/questions-v87b.js','data/questions-v88.js','data/question-pool.js','data/questions-2026-expansion.js','data/questions-2026-expansion-2.js','data/questions-2026-expansion-3.js','data/questions-2026-expansion-4.js',
'data/provinces.js','data/province-facts-25.js','data/population-2025.js','data/geo-features.js','data/geo-stats.js','data/topics.js','data/learning-index.js',
'app.js','v55-games-plus.js','arena-v1.js','v53-arena-social.js','v71-stability.js','features/library/content.js','features/library/library.js','features/library/study.js','features/library/review.js','v79-arena-matchmaking.js','v80-progress-center.js','features/library/expansion.js','v86-events-single.js','features/library/deepening.js','v88-question-center.js','v90-command-center.js','features/library/compact.js','v91-learning-bridge.js','v92-system-audit.js','v98-ui-cohesion.js','v98-events-plus.js','v104-progress-loop.js','v108-game-progression.js','onboarding.js','notifications.js','flashcards.js','leaderboard.js','effects.js'];
const load=file=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL(file,base).href;s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error(`Yurdunu Bil boot: ${file} yüklenemedi`));document.body.appendChild(s)});
(async()=>{try{for(const file of files)await load(file);root.register?.('boot',{ready:true,modules:files.length,migration:'staged-library'});document.documentElement.classList.add('yb-ready');window.dispatchEvent(new CustomEvent('yb:ready',{detail:{modules:files.length}}));}catch(error){console.error(error);root.register?.('boot',{ready:false,error:String(error)});document.documentElement.classList.add('yb-boot-error');const toast=document.getElementById('toast-root');if(toast)toast.textContent='Uygulama modüllerinden biri yüklenemedi. Sayfayı yenileyin.'}})();
})();
