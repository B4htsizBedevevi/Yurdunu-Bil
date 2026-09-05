/* Yurdunu Bil — Efektler: konfeti, XP toast, ses geri bildirimleri */
(()=>{
'use strict';
if(window.__YB_EFFECTS__)return;
window.__YB_EFFECTS__=true;

/* ── Konfeti ── */
const COLORS=['#4bc9ff','#43e1c2','#f5a623','#ef7180','#8e7dff','#4ee2ad','#fff','#ffd700'];

function confetti(duration=2200){
  const wrap=document.createElement('div');
  wrap.className='yb-confetti-wrap';
  document.body.appendChild(wrap);
  const count=72;
  for(let i=0;i<count;i++){
    const p=document.createElement('div');
    p.className='yb-confetti-piece';
    const color=COLORS[Math.floor(Math.random()*COLORS.length)];
    p.style.cssText=`
      left:${Math.random()*100}%;
      background:${color};
      width:${6+Math.random()*7}px;
      height:${8+Math.random()*10}px;
      animation-duration:${1.2+Math.random()*1.6}s;
      animation-delay:${Math.random()*.8}s;
    `;
    wrap.appendChild(p);
  }
  setTimeout(()=>wrap.remove(),duration+800);
}

/* ── XP Toast ── */
function xpToast(amount,x,y){
  const el=document.createElement('div');
  el.className='yb-xp-toast';
  el.textContent=`+${amount} XP`;
  el.style.left=(x||window.innerWidth/2-20)+'px';
  el.style.top=(y||window.innerHeight/2-20)+'px';
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1600);
}

/* ── Ses oluşturucu (Web Audio API) ── */
let audioCtx=null;
function getAudio(){
  if(!audioCtx){
    try{audioCtx=new(window.AudioContext||window.webkitAudioContext)()}
    catch{return null}
  }
  return audioCtx;
}

function playTone(freq,type='sine',duration=0.12,vol=0.15){
  const ctx=getAudio();if(!ctx)return;
  try{
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.connect(gain);gain.connect(ctx.destination);
    osc.type=type;osc.frequency.value=freq;
    gain.gain.setValueAtTime(vol,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+duration);
    osc.start();osc.stop(ctx.currentTime+duration);
  }catch{}
}

function soundCorrect(){
  playTone(520,'sine',0.08,0.12);
  setTimeout(()=>playTone(660,'sine',0.1,0.12),80);
}
function soundWrong(){
  playTone(260,'sawtooth',0.12,0.1);
}
function soundVictory(){
  [520,660,780,1040].forEach((f,i)=>setTimeout(()=>playTone(f,'sine',0.15,0.12),i*100));
}
function soundClick(){
  playTone(440,'sine',0.06,0.06);
}

/* ── Ses ayarı ── */
let soundEnabled=localStorage.getItem('yb_sound')!=='0';
function toggleSound(){
  soundEnabled=!soundEnabled;
  localStorage.setItem('yb_sound',soundEnabled?'1':'0');
  return soundEnabled;
}
function safe(fn){return soundEnabled?fn():undefined}

/* ── Oyun cevap olaylarını dinle ── */
document.addEventListener('click',e=>{
  const ansBtn=e.target.closest('[data-answer]');
  if(!ansBtn)return;
  /* kısa gecikme ile sonuç sınıfı kontrol et */
  setTimeout(()=>{
    if(ansBtn.classList.contains('correct')){
      safe(soundCorrect);
      /* XP toast */
      const rect=ansBtn.getBoundingClientRect();
      xpToast(10,rect.left+rect.width/2,rect.top-20);
    } else if(ansBtn.classList.contains('wrong')){
      safe(soundWrong);
    }
  },50);
});

/* ── Arena zafer ── */
window.addEventListener('yb:arena-victory',e=>{
  const {winner}=e.detail||{};
  if(winner){confetti();safe(soundVictory)}
});

/* ── Oyun tamamlandı ── */
window.addEventListener('yb:game-complete',e=>{
  const {pct}=e.detail||{};
  if(pct>=80){confetti(1800);safe(soundVictory)}
  else safe(soundCorrect);
});

/* ── Arena kritik timer ── */
const originalArenaTimerCheck=()=>{
  const timerEl=document.getElementById('yb-arena-timer');
  if(!timerEl)return;
  const m=timerEl.textContent.match(/(\d+)/);
  if(m&&Number(m[1])<=5)timerEl.classList.add('yb-arena-critical');
  else timerEl.classList.remove('yb-arena-critical');
};
setInterval(originalArenaTimerCheck,500);

/* ── Ses ayar butonu (ayarlar sayfasına eklenir) ── */
function mountSoundBtn(){
  const settings=document.getElementById('view-settings');
  if(!settings||!settings.classList.contains('active'))return;
  if(settings.querySelector('.yb-sound-toggle'))return;
  const appearance=settings.querySelector('.settings-appearance-card');
  if(!appearance)return;
  const btn=document.createElement('button');
  btn.className='btn secondary yb-sound-toggle';
  btn.type='button';
  btn.textContent=soundEnabled?'🔊 Ses: Açık':'🔇 Ses: Kapalı';
  btn.addEventListener('click',()=>{
    const on=toggleSound();
    btn.textContent=on?'🔊 Ses: Açık':'🔇 Ses: Kapalı';
    if(on)safe(soundClick);
  });
  appearance.appendChild(btn);
}

document.addEventListener('yb:navigate',e=>{
  if(e.detail?.view==='settings')setTimeout(mountSoundBtn,200);
});

window.YBEffects={confetti,xpToast,soundCorrect,soundWrong,soundVictory,soundClick,toggleSound,isSoundEnabled:()=>soundEnabled};
})();
