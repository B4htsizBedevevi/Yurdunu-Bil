/* Yurdunu Bil — Leaderboard v1: genel, haftalık, arkadaşlar sıralaması */
(()=>{
'use strict';
if(window.__YB_LEADERBOARD__)return;
window.__YB_LEADERBOARD__=true;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const MEDAL=['🥇','🥈','🥉'];

function getLocalEntry(){
  try{
    const p=JSON.parse(localStorage.getItem('yb52_progress_v1')||'{}');
    const prof=window.YBOnboarding?.getProfile?.()||{};
    const username=prof.username||window.YURDUNUBIL_STATE?.profile?.displayName||'Sen';
    const avatar=prof.avatarEmoji||'🧭';
    return {
      username,avatar,
      xp:Number(p.xp||0),
      answers:Number(p.answers||0),
      correct:Number(p.correct||0),
      streak:Number(p.bestStreak||0),
      isYou:true
    };
  }catch{return null}
}

/* Demo/offline sıralama — Supabase yokken gösterilir */
function getDemoBoard(){
  const you=getLocalEntry();
  const board=[
    {username:'KorumalıKırkçalı',avatar:'🏆',xp:4280,answers:312,correct:268,streak:18,isYou:false},
    {username:'CoğrafyaUzmanı',avatar:'🗺️',xp:3760,answers:290,correct:241,streak:14,isYou:false},
    {username:'AnatoliaWatcher',avatar:'⛰️',xp:3210,answers:260,correct:210,streak:11,isYou:false},
    {username:'HaritaDeli',avatar:'🧭',xp:2890,answers:224,correct:178,streak:9,isYou:false},
    {username:'KPSSMaster2026',avatar:'📚',xp:2450,answers:198,correct:154,streak:7,isYou:false},
    {username:'BölgeBlitzKing',avatar:'🔥',xp:2110,answers:170,correct:130,streak:5,isYou:false},
    {username:'SorucuDelisi',avatar:'🎯',xp:1820,answers:142,correct:108,streak:4,isYou:false},
    {username:'AtlasGezgini',avatar:'🌍',xp:1560,answers:118,correct:88,streak:3,isYou:false},
    {username:'MeridyenHunter',avatar:'⭐',xp:1320,answers:96,correct:70,streak:2,isYou:false},
    {username:'TopraküstüAdayı',avatar:'💡',xp:980,answers:74,correct:52,streak:1,isYou:false},
  ];
  /* Kullanıcıyı listeye ekle ve sırala */
  if(you){
    const idx=board.findIndex(r=>r.xp<=you.xp);
    if(idx>=0)board.splice(idx,0,you);
    else board.push(you);
  }
  return board.slice(0,15);
}

async function getSupabaseBoard(tab='global'){
  try{
    const cfg=window.YURDUNUBIL_CONFIG||{};
    if(!cfg.SUPABASE_URL||!window.supabase)return null;
    const sb=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY);
    const {data:sess}=await sb.auth.getSession();
    const uid=sess?.session?.user?.id;

    if(tab==='global'){
      const {data}=await sb.from('learning_stats')
        .select('user_id,xp,total_questions,total_correct,best_streak')
        .order('xp',{ascending:false}).limit(50);
      if(!data?.length)return null;
      /* Profil isimlerini getir */
      const ids=data.map(r=>r.user_id);
      const {data:profiles}=await sb.from('profiles').select('id,display_name,avatar_emoji').in('id',ids);
      const pmap={};(profiles||[]).forEach(p=>{pmap[p.id]=p});
      return data.map(r=>{
        const prof=pmap[r.user_id]||{};
        return {
          username:prof.display_name||'Anonim',
          avatar:prof.avatar_emoji||'🧭',
          xp:r.xp,answers:r.total_questions,correct:r.total_correct,streak:r.best_streak,
          isYou:r.user_id===uid
        };
      });
    }
    if(tab==='arena'){
      const {data}=await sb.from('arena_ratings')
        .select('user_id,rating,wins,losses,best_streak,matches')
        .order('rating',{ascending:false}).limit(50);
      if(!data?.length)return null;
      const ids=data.map(r=>r.user_id);
      const {data:profiles}=await sb.from('profiles').select('id,display_name,avatar_emoji').in('id',ids);
      const pmap={};(profiles||[]).forEach(p=>{pmap[p.id]=p});
      return data.map(r=>{
        const prof=pmap[r.user_id]||{};
        return {
          username:prof.display_name||'Anonim',
          avatar:prof.avatar_emoji||'⚔️',
          xp:r.rating,answers:r.matches,correct:r.wins,streak:r.best_streak,
          isYou:r.user_id===uid,
          isArena:true
        };
      });
    }
  }catch(e){console.warn('leaderboard',e);return null}
  return null;
}

function renderRows(board,isArena){
  return board.map((r,i)=>`
  <div class="yb-lb-row ${r.isYou?'yb-lb-you':''}">
    <span class="yb-lb-rank">${i<3?MEDAL[i]:String(i+1)}</span>
    <span class="yb-lb-av">${esc(r.avatar)}</span>
    <div class="yb-lb-info">
      <b>${esc(r.username)}${r.isYou?' <em>(Sen)</em>':''}</b>
      <small>${isArena?`${r.answers||0} maç · ${r.correct||0} galiyet`:`${r.answers||0} soru · ${r.correct||0} doğru`}</small>
    </div>
    <div class="yb-lb-score">
      <b>${Number(r.xp||0).toLocaleString('tr-TR')}</b>
      <small>${isArena?'RP':'XP'}</small>
    </div>
    <div class="yb-lb-streak" title="En iyi seri">🔥${r.streak||0}</div>
  </div>`).join('');
}

async function loadTab(tab,listEl){
  listEl.innerHTML='<div class="yb-lb-loading"><div class="yb-lb-spin"></div><span>Yükleniyor…</span></div>';
  let board=tab==='offline'?getDemoBoard():await getSupabaseBoard(tab);
  if(!board)board=getDemoBoard();
  const isArena=tab==='arena';
  const header=isArena?
    '<div class="yb-lb-header"><span>Sıra</span><span>Avatar</span><span>Oyuncu</span><span>Reyting</span><span>Seri</span></div>':
    '<div class="yb-lb-header"><span>Sıra</span><span>Avatar</span><span>Oyuncu</span><span>XP</span><span>Seri</span></div>';
  listEl.innerHTML=header+renderRows(board,isArena);
}

function open(){
  const existing=document.getElementById('yb-lb-modal');
  if(existing){existing.classList.toggle('yb-lb-visible');return}
  const wrap=document.createElement('div');
  wrap.id='yb-lb-modal';
  wrap.innerHTML=`
  <div class="yb-lb-backdrop"></div>
  <section class="yb-lb-shell">
    <header class="yb-lb-top">
      <div>
        <span class="eyebrow">🏆 SIRALAMA</span>
        <h2>Liderlik Tablosu</h2>
      </div>
      <button class="yb-lb-close" type="button">×</button>
    </header>
    <div class="yb-lb-tabs">
      <button class="yb-lb-tab active" data-lbtab="global">🌍 Genel (XP)</button>
      <button class="yb-lb-tab" data-lbtab="arena">⚔️ Arena (RP)</button>
    </div>
    <div class="yb-lb-list" id="yb-lb-list"></div>
    <div class="yb-lb-foot">
      <span>Sıralama her saat güncellenir</span>
      <button class="btn secondary" id="yb-lb-arena-btn">⚔️ Beni Sıralamaya Kat</button>
    </div>
  </section>`;
  document.body.appendChild(wrap);
  requestAnimationFrame(()=>wrap.classList.add('yb-lb-visible'));

  const list=document.getElementById('yb-lb-list');
  loadTab('global',list);

  wrap.querySelector('.yb-lb-backdrop').addEventListener('click',()=>close());
  wrap.querySelector('.yb-lb-close').addEventListener('click',()=>close());
  wrap.querySelectorAll('.yb-lb-tab').forEach(b=>b.addEventListener('click',()=>{
    wrap.querySelectorAll('.yb-lb-tab').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    loadTab(b.dataset.lbtab,list);
  }));
  document.getElementById('yb-lb-arena-btn')?.addEventListener('click',()=>{close();window.YBArena?.open?.()});
}

function close(){
  const wrap=document.getElementById('yb-lb-modal');
  if(!wrap)return;
  wrap.classList.remove('yb-lb-visible');
  setTimeout(()=>wrap.remove(),300);
}

/* Sidebar'a sıralama butonu ekle */
function mountSidebarBtn(){
  const nav=document.querySelector('.side-nav');
  if(!nav||nav.querySelector('#yb-lb-nav-btn'))return;
  const eventsBtn=nav.querySelector('[data-view="events"]');
  if(!eventsBtn)return;
  const btn=document.createElement('button');
  btn.id='yb-lb-nav-btn';btn.type='button';
  btn.className='nav-item';
  btn.innerHTML='<span>🏆</span>Sıralama';
  btn.addEventListener('click',open);
  eventsBtn.parentNode.insertBefore(btn,eventsBtn.nextSibling);
}

window.addEventListener('load',()=>setTimeout(mountSidebarBtn,1000));
new MutationObserver(()=>setTimeout(mountSidebarBtn,200)).observe(document.body,{childList:true,subtree:true});

window.YBLeaderboard={open,close};
})();
