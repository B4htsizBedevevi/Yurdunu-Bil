/* Yurdunu Bil — Notifications v1: in-app + push bildirimleri */
(()=>{
'use strict';
if(window.__YB_NOTIF__)return;
window.__YB_NOTIF__=true;

const STORAGE='yb_notif_v1';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ── In-app bildirim kuyruğu ── */
let queue=[];
let container=null;

function getContainer(){
  if(container&&document.contains(container))return container;
  container=document.getElementById('yb-notif-container');
  if(!container){
    container=document.createElement('div');
    container.id='yb-notif-container';
    document.body.appendChild(container);
  }
  return container;
}

function show({title,body,icon='🔔',type='info',duration=5000,action=null,actionLabel=''}){
  const c=getContainer();
  const el=document.createElement('div');
  el.className=`yb-notif yb-notif-${type}`;
  el.innerHTML=`
    <div class="yb-notif-icon">${esc(icon)}</div>
    <div class="yb-notif-body">
      <b>${esc(title)}</b>
      <span>${esc(body)}</span>
      ${action&&actionLabel?`<button class="yb-notif-action" type="button">${esc(actionLabel)}</button>`:''}
    </div>
    <button class="yb-notif-close" type="button" aria-label="Kapat">×</button>
  `;
  c.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('yb-notif-show'));

  el.querySelector('.yb-notif-close')?.addEventListener('click',()=>dismiss(el));
  if(action)el.querySelector('.yb-notif-action')?.addEventListener('click',()=>{dismiss(el);action()});

  if(duration>0)setTimeout(()=>dismiss(el),duration);
  return el;
}

function dismiss(el){
  el.classList.remove('yb-notif-show');
  el.classList.add('yb-notif-hide');
  setTimeout(()=>el.remove(),320);
}

/* ── Push bildirimi izni ── */
async function requestPush(){
  if(!('Notification' in window))return false;
  if(Notification.permission==='granted')return true;
  if(Notification.permission==='denied')return false;
  const p=await Notification.requestPermission();
  return p==='granted';
}

function pushNotif(title,body,icon='/icon-192.svg'){
  if(!('Notification' in window)||Notification.permission!=='granted')return;
  try{new Notification(title,{body,icon,badge:'/icon-192.svg',tag:'yurdunubil',renotify:true})}
  catch(e){console.warn('push notif',e)}
}

/* ── Zamanlanmış bildirimler (in-app + push) ── */
const MESSAGES=[
  {tag:'daily_reminder',minHours:20,title:'Hey, bugün ne kadar ilerledi?',body:'Bir tur kısa soru çözmek bile aklında tutar.',icon:'📚',type:'info'},
  {tag:'streak_at_risk',minHours:22,title:'Serin kopmak üzere! 🔥',body:'Bugün en az bir soru çöz ve serini koru.',icon:'🔥',type:'warning'},
  {tag:'quiz_call',minHours:18,title:'Soru bekliyor!',body:'Yanlışların tekrar kuyruğunda bekliyor. Hepsini bitir.',icon:'🎯',type:'info'},
];

function load(){try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{return {}}}
function save(d){try{localStorage.setItem(STORAGE,JSON.stringify(d))}catch{}}

function checkScheduled(){
  const now=Date.now();
  const data=load();
  MESSAGES.forEach(m=>{
    const last=data[m.tag]||0;
    const diffH=(now-last)/3600000;
    if(diffH<m.minHours)return;
    data[m.tag]=now;
    save(data);
    /* In-app */
    show({title:m.title,body:m.body,icon:m.icon,type:m.type,duration:8000});
    /* Push (arka plana gidilmişse) */
    if(document.hidden)pushNotif(m.title,m.body);
  });
}

/* ── Arena davet bildirimi ── */
function arenaInvite(fromName,roomCode){
  const username=window.YBOnboarding?.getUsername?.()??'Sen';
  show({
    title:`⚔️ ${esc(fromName)} seni düelloya çağırıyor!`,
    body:`Oda kodu: ${roomCode} — Hemen katıl ve bilginizi karşılaştırın!`,
    icon:'⚔️',type:'arena',duration:15000,
    action:()=>{
      window.navigate?.('events');
      setTimeout(()=>{
        window.YBArena?.open?.();
        setTimeout(()=>{
          const input=document.getElementById('ybArenaCode');
          if(input){input.value=roomCode;input.dispatchEvent(new Event('input'))}
        },500);
      },200);
    },
    actionLabel:'Katıl →'
  });
  /* Push */
  pushNotif(`⚔️ ${fromName} seni Arena'ya davet etti!`,`Oda kodu: ${roomCode}`);
}

/* ── Arkadaşlık isteği bildirimi ── */
function friendRequest(fromName){
  show({
    title:`👥 ${esc(fromName)} arkadaşlık isteği gönderdi!`,
    body:'Hemen kabul et, bilgilerini karşılaştırın ve Arena\'da kapışın.',
    icon:'👥',type:'friend',duration:12000,
    action:()=>{
      window.YB53Social?.open?.()
    },
    actionLabel:'İncele →'
  });
  pushNotif(`${fromName} sana arkadaşlık isteği attı!`,'Kabul et, Arena\'da kapışın!');
}

/* ── Supabase realtime dinleyici (arena davetleri) ── */
async function listenArenaInvites(){
  try{
    const cfg=window.YURDUNUBIL_CONFIG||{};
    if(!cfg.SUPABASE_URL||!window.supabase)return;
    const sb=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY);
    const {data}=await sb.auth.getSession();
    const uid=data?.session?.user?.id;
    if(!uid)return;
    sb.channel('yb-invites-'+uid)
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'arena_invites',filter:`invitee_id=eq.${uid}`},
        payload=>{
          const inv=payload.new;
          arenaInvite(inv.inviter_name||'Bir arkadaşın',inv.room_code||'??????');
        })
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'friend_requests',filter:`target_id=eq.${uid}`},
        payload=>{
          friendRequest(payload.new.sender_name||'Bir kullanıcı');
        })
      .subscribe();
  }catch(e){console.warn('notif listen',e)}
}

/* ── Service Worker mesajları ── */
if('serviceWorker' in navigator){
  navigator.serviceWorker.addEventListener('message',e=>{
    if(e.data?.type==='yb-notif'){
      show({title:e.data.title||'Yurdunu Bil',body:e.data.body||'',icon:e.data.icon||'🔔',type:e.data.notifType||'info'});
    }
  });
}

/* ── İzin butonu (onboarding sonrası) ── */
window.addEventListener('yb:onboarding-done',async()=>{
  const granted=await requestPush();
  if(granted){
    setTimeout(()=>show({
      title:'Bildirimler açık! 🔔',
      body:'Giriş hatırlatmaları ve Arena davetleri artık sana ulaşacak.',
      icon:'✅',type:'success',duration:4000
    }),500);
  }
});

/* ── Görev tamamlama bildirimi (oyunlardan çağrılır) ── */
window.addEventListener('yb:game-complete',e=>{
  const {score,correct,total,mode}=e.detail||{};
  if(!score)return;
  const pct=Math.round(correct/Math.max(1,total)*100);
  if(pct>=80){
    show({title:'🏆 Harika sonuç!',body:`${mode||'Oyun'}: ${correct}/${total} doğru · ${score} puan`,icon:'🏆',type:'success',duration:5000});
  } else if(pct>=60){
    show({title:'🔥 İyi iş!',body:`${mode||'Oyun'}: ${correct}/${total} doğru. Daha da iyi olacaksın!`,icon:'🔥',type:'info',duration:4000});
  }
});

/* Başlat */
window.addEventListener('load',()=>{
  setTimeout(checkScheduled,3000);
  setTimeout(listenArenaInvites,2000);
});

/* Periyodik kontrol (her 30 dk) */
setInterval(checkScheduled,30*60*1000);

window.YBNotif={show,dismiss,arenaInvite,friendRequest,requestPush,pushNotif};
})();
