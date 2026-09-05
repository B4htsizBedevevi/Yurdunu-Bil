/* Yurdunu Bil — Onboarding v1: avatar + kullanıcı adı seçimi */
(()=>{
'use strict';
if(window.__YB_ONBOARDING__)return;
window.__YB_ONBOARDING__=true;

const STORAGE_KEY='yb_onboarding_done';
const PROFILE_KEY='yb_profile_v1';

const AVATARS=[
  {id:'harita',   emoji:'🗺️', label:'Haritacı'},
  {id:'pusola',   emoji:'🧭', label:'Pusulacı'},
  {id:'dag',      emoji:'⛰️', label:'Dağcı'},
  {id:'su',       emoji:'💧', label:'Su Bilgini'},
  {id:'kitap',    emoji:'📚', label:'Kitap Kurdu'},
  {id:'yildiz',   emoji:'⭐', label:'Yıldız Aday'},
  {id:'roket',    emoji:'🚀', label:'Roketçi'},
  {id:'kalkan',   emoji:'🛡️', label:'Şampiyonluk'},
  {id:'lens',     emoji:'🔍', label:'Araştırmacı'},
  {id:'kupa',     emoji:'🏆', label:'Kupacı'},
  {id:'fener',    emoji:'🔦', label:'Kaşif'},
  {id:'bey',      emoji:'♟️', label:'Stratejist'},
];

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function getProfile(){
  try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}')}catch{return {}}
}
function saveProfile(p){
  try{localStorage.setItem(PROFILE_KEY,JSON.stringify(p))}catch{}
}

function needsOnboarding(){
  if(localStorage.getItem(STORAGE_KEY)==='1')return false;
  const p=getProfile();
  return !p.avatarId||!p.username;
}

function open(){
  if(!needsOnboarding())return;
  const existing=document.getElementById('yb-onboarding');
  if(existing)return;
  const wrap=document.createElement('div');
  wrap.id='yb-onboarding';
  wrap.innerHTML=`
  <div class="yb-ob-backdrop"></div>
  <section class="yb-ob-card" role="dialog" aria-modal="true" aria-label="Hoş geldin">
    <div class="yb-ob-step" id="yb-ob-step1">
      <div class="yb-ob-logo">⌖</div>
      <span class="eyebrow">YURDUNU BİL'E HOŞ GELDİN</span>
      <h2>Sana nasıl seslenelim?</h2>
      <p>Arena ve sıralamada görünecek kullanıcı adını seç. İstediğin zaman ayarlardan değiştirebilirsin.</p>
      <div class="yb-ob-name-wrap">
        <input id="yb-ob-name" type="text" maxlength="20" placeholder="Kullanıcı adın (maks 20 karakter)" autocomplete="off" spellcheck="false">
        <span class="yb-ob-name-count" id="yb-ob-name-count">0/20</span>
      </div>
      <div id="yb-ob-name-err" class="yb-ob-err"></div>
      <button class="btn primary yb-ob-next" id="yb-ob-to-avatar">Avatarımı Seç →</button>
    </div>
    <div class="yb-ob-step hidden" id="yb-ob-step2">
      <span class="eyebrow">ADIMİ ANLAT</span>
      <h2>Avatarını seç.</h2>
      <p>Arena'da rakibinin seni nasıl göreceğini belirle.</p>
      <div class="yb-ob-avatar-grid" id="yb-ob-avatar-grid">
        ${AVATARS.map(a=>`<button type="button" class="yb-ob-av-btn" data-av="${a.id}">
          <span class="yb-ob-av-emoji">${a.emoji}</span>
          <small>${a.label}</small>
        </button>`).join('')}
      </div>
      <div class="yb-ob-step2-actions">
        <button class="btn ghost" id="yb-ob-back">← Geri</button>
        <button class="btn primary" id="yb-ob-finish" disabled>Başlayalım! 🚀</button>
      </div>
    </div>
    <div class="yb-ob-step hidden" id="yb-ob-step3">
      <div class="yb-ob-done-emoji" id="yb-ob-done-av">🧭</div>
      <span class="eyebrow">HAZIRSIN!</span>
      <h2 id="yb-ob-done-name">Merhaba!</h2>
      <p>Profilin oluşturuldu. Şimdi KPSS coğrafyasını öğrenmeye, sorular çözmeye ve Arena'da yarışmaya hazırsın.</p>
      <div class="yb-ob-checklist">
        <div>✅ Kullanıcı adın seçildi</div>
        <div>✅ Avatarın hazır</div>
        <div>✅ Soru bankası yüklendi</div>
      </div>
      <button class="btn primary full yb-ob-go" id="yb-ob-go">Haydi Başlayalım →</button>
    </div>
  </section>`;
  document.body.appendChild(wrap);
  requestAnimationFrame(()=>wrap.classList.add('yb-ob-visible'));
  bind(wrap);
}

function bind(wrap){
  let selectedAv=null;

  /* Karakter sayacı */
  const nameInput=wrap.querySelector('#yb-ob-name');
  const nameCount=wrap.querySelector('#yb-ob-name-count');
  nameInput?.addEventListener('input',()=>{
    const v=nameInput.value;
    nameCount.textContent=`${v.length}/20`;
  });

  /* İleri: isim → avatar */
  wrap.querySelector('#yb-ob-to-avatar')?.addEventListener('click',()=>{
    const name=nameInput?.value.trim()||'';
    if(name.length<2){
      const err=wrap.querySelector('#yb-ob-name-err');
      if(err)err.textContent='En az 2 karakter yazmalısın.';
      nameInput?.focus();
      return;
    }
    wrap.querySelector('#yb-ob-step1')?.classList.add('hidden');
    wrap.querySelector('#yb-ob-step2')?.classList.remove('hidden');
  });

  /* Geri */
  wrap.querySelector('#yb-ob-back')?.addEventListener('click',()=>{
    wrap.querySelector('#yb-ob-step2')?.classList.add('hidden');
    wrap.querySelector('#yb-ob-step1')?.classList.remove('hidden');
  });

  /* Avatar seçimi */
  wrap.querySelectorAll('.yb-ob-av-btn').forEach(b=>b.addEventListener('click',()=>{
    wrap.querySelectorAll('.yb-ob-av-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    selectedAv=b.dataset.av;
    wrap.querySelector('#yb-ob-finish')?.removeAttribute('disabled');
  }));

  /* Bitir */
  wrap.querySelector('#yb-ob-finish')?.addEventListener('click',()=>{
    const name=nameInput?.value.trim()||'Öğrenci';
    const av=AVATARS.find(a=>a.id===selectedAv)||AVATARS[0];
    const profile={username:name,avatarId:av.id,avatarEmoji:av.emoji,avatarLabel:av.label,createdAt:new Date().toISOString()};
    saveProfile(profile);
    localStorage.setItem(STORAGE_KEY,'1');
    /* app.js state ile senkronize et */
    if(window.YURDUNUBIL_STATE){
      window.YURDUNUBIL_STATE.profile.displayName=name;
      try{localStorage.setItem('yb_state_70',JSON.stringify(window.YURDUNUBIL_STATE))}catch{}
    }
    /* Supabase profil güncelle */
    updateSupabase(name,av);
    /* Tamamlandı ekranı */
    wrap.querySelector('#yb-ob-step2')?.classList.add('hidden');
    wrap.querySelector('#yb-ob-step3')?.classList.remove('hidden');
    const doneAv=wrap.querySelector('#yb-ob-done-av');
    const doneName=wrap.querySelector('#yb-ob-done-name');
    if(doneAv)doneAv.textContent=av.emoji;
    if(doneName)doneName.textContent=`Merhaba, ${esc(name)}!`;
    window.dispatchEvent(new CustomEvent('yb:profile-set',{detail:profile}));
  });

  /* Kapat */
  wrap.querySelector('#yb-ob-go')?.addEventListener('click',()=>{
    close(wrap);
    window.dispatchEvent(new CustomEvent('yb:onboarding-done'));
  });
}

async function updateSupabase(name,av){
  try{
    const cfg=window.YURDUNUBIL_CONFIG||{};
    if(!cfg.SUPABASE_URL||!window.supabase)return;
    const sb=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY);
    const {data}=await sb.auth.getSession();
    const uid=data?.session?.user?.id;
    if(!uid)return;
    await sb.from('profiles').upsert({
      id:uid,display_name:name,
      avatar_id:av.id,avatar_emoji:av.emoji
    },{onConflict:'id'});
  }catch(e){console.warn('onboarding supabase',e)}
}

function close(wrap){
  wrap.classList.remove('yb-ob-visible');
  setTimeout(()=>wrap.remove(),350);
}

/* Profil yardımcıları (global) */
window.YBOnboarding={
  open,
  getProfile,
  getAvatarEmoji:()=>{const p=getProfile();return AVATARS.find(a=>a.id===p.avatarId)?.emoji||'🧭'},
  getUsername:()=>{
    const p=getProfile();
    return p.username||window.YURDUNUBIL_STATE?.profile?.displayName||'Öğrenci';
  },
  reset:()=>{localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(PROFILE_KEY);}
};

/* Uygulama hazır olunca aç */
window.addEventListener('yb:app-ready',()=>setTimeout(open,600));
window.addEventListener('load',()=>{
  /* Auth başarılı olunca (misafir dahil) kontrol et */
  const check=()=>{
    if(!document.getElementById('app-shell')?.classList.contains('hidden'))
      setTimeout(open,700);
  };
  setTimeout(check,1200);
  window.addEventListener('yb:navigate',check,{once:true});
});
})();
