/* Yurdunu Bil — semantic boot */
(()=>{'use strict';
if(window.__YB_CANONICAL_BOOT__)return;window.__YB_CANONICAL_BOOT__=true;
const root=window.YBRuntime||window.YB44||{};
const base=new URL('../',document.currentScript?.src||location.href);
const dataFiles=['data/questions.js','data/questions-v55.js','data/questions-v59.js','data/questions-v61.js','data/questions-v84.js','data/questions-v87a.js','data/questions-v87b.js','data/questions-v88.js','data/question-pool.js','data/questions-2026-expansion.js','data/questions-2026-expansion-2.js','data/questions-2026-expansion-3.js','data/questions-2026-expansion-4.js','data/provinces.js','data/province-facts-25.js','data/population-2025.js','data/geo-features.js','data/geo-stats.js','data/topics.js','data/learning-index.js'];
const coreFiles=['core/runtime.js','app.js','core/ui-guard.js'];
const featureGroups=[
 ['features/games/games-core.js','features/games/events.js','features/games/events-plus.js'],
 ['features/arena/arena.js','features/arena/social.js'],
 ['features/library/manifest.js','features/library/content.js','features/library/library.js','features/library/study.js','features/library/review.js','features/library/expansion.js','features/library/deepening.js','features/library/compact.js','features/library/interactions.js'],
 ['features/progress/progress.js','features/progress/progress-loop.js','features/progress/game-progression.js'],
 ['features/questions/questions.js','features/questions/question-center.js'],
 ['features/home/home.js','features/ui/learning-bridge.js','features/ui/system-audit.js','features/ui/stability.js','features/ui/navigation.js','onboarding.js','notifications.js','flashcards.js','leaderboard.js','effects.js']
];
const load=file=>new Promise(resolve=>{const s=document.createElement('script');s.src=new URL(file,base).href;s.async=false;s.onload=()=>resolve({file,ok:true});s.onerror=()=>resolve({file,ok:false,error:`${file} yüklenemedi`});document.body.appendChild(s)});
const loadParallel=files=>Promise.all(files.map(load));
(async()=>{
 const results=[];
 results.push(...await loadParallel(dataFiles));
 results.push(...await loadParallel(coreFiles));
 for(const group of featureGroups)results.push(...await loadParallel(group));
 const failed=results.filter(x=>!x.ok);
 if(failed.length){
   console.error('Yurdunu Bil boot eksikleri:',failed);
   root.register?.('boot',{ready:false,error:failed.map(x=>x.error).join('; '),failed:failed.map(x=>x.file)});
   document.documentElement.classList.add('yb-boot-partial');
   const toast=document.getElementById('toast-root');
   if(toast){toast.textContent=`${failed.length} yardımcı modül yüklenemedi; temel uygulama çalışmaya devam ediyor.`;toast.setAttribute('role','status')}
 }else{
   root.register?.('boot',{ready:true,modules:results.length,migration:'semantic',parallel:true});
   document.documentElement.classList.add('yb-ready');
   window.dispatchEvent(new CustomEvent('yb:ready',{detail:{modules:results.length}}));
 }
})();
})();
