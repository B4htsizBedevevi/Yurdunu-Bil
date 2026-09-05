/* Yurdunu Bil 80 — progression & daily motivation */
(()=>{'use strict';
if(window.__YB80_PROGRESS__)return;window.__YB80_PROGRESS__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='yb52_progress_v1';
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
function progress(){const p=read();return {xp:Number(p.xp||0),answers:Number(p.answers||0),correct:Number(p.correct||0),streak:Number(p.streak||0),bestStreak:Number(p.bestStreak||0),daily:p.daily||{date:'',answers:0,correct:0}}}
function levelFromXp(xp){let level=1,need=120,spent=0;while(xp>=spent+need&&level<50){spent+=need;level++;need=Math.round(120+level*35)}return {level,spent,need,inLevel:xp-spent}}
function today(){return new Date().toLocaleDateString('en-CA',{timeZone:'Europe/Istanbul'})}
function enhance(){const v=$('#view-events');if(!v||!v.classList.contains('active')||$('.progress-panel',v))return;const p=progress(),lv=levelFromXp(p.xp),pct=Math.max(0,Math.min(100,Math.round(lv.inLevel/lv.need*100))),daily=p.daily?.date===today()?p.daily:{answers:0,correct:0};
 const anchor=$('.events-quick-grid',v)||$('.events-hero',v);if(!anchor)return;
 const panel=document.createElement('section');panel.className='progress-panel';panel.innerHTML=`<div class="progress-level"><b>${lv.level}</b></div><div class="progress-copy"><span>OYUNCU GELİŞİMİ</span><h3>Seviye ${lv.level} • ${p.xp} XP</h3><p>${lv.need-lv.inLevel} XP sonra yeni seviyedesin.</p><div class="progress-track"><i style="width:${pct}%"></i></div><div class="progress-percent">${pct}% seviye ilerlemesi</div></div><div class="progress-mini"><div><b>${p.streak}</b><span>aktif seri</span></div><div><b>${p.bestStreak}</b><span>rekor seri</span></div><div><b>${p.correct}</b><span>doğru</span></div></div>`;
 anchor.parentNode.insertBefore(panel,anchor.nextSibling);
 const dailyCard=document.createElement('section');dailyCard.className='daily-card';dailyCard.innerHTML=`<div class="daily-icon">🎯</div><div class="daily-copy"><span>BUGÜNÜN GÖREVİ</span><h3>5 doğru cevap yap</h3><p>Bugünkü mini oyun veya aktif hatırlama turunda 5 doğruyu tamamla.</p></div><div class="daily-state"><b>${Math.min(5,daily.correct)}/5</b><span>${daily.correct>=5?'Tamamlandı':'devam ediyor'}</span></div>`;
 panel.insertAdjacentElement('afterend',dailyCard);
}
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='events')setTimeout(enhance,110)});window.addEventListener('load',()=>setTimeout(enhance,220));setInterval(enhance,1800);
})();
