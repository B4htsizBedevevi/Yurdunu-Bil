/* Yurdunu Bil — Leaderboard v2: gerçek kullanıcılar + canlı yenileme */
(()=>{
'use strict';
if(window.__YB_LEADERBOARD__)return;
window.__YB_LEADERBOARD__=true;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MEDAL=['🥇','🥈','🥉'];
let sb=null,uid=null,channel=null,currentTab='global',refreshTimer=null;
function init(){
 const cfg=window.YURDUNUBIL_CONFIG||{};
 try{if(cfg.SUPABASE_URL&&cfg.SUPABASE_PUBLISHABLE_KEY&&window.supabase)sb=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY)}catch(e){console.warn('leaderboard init',e)}
}
async function session(){if(!sb)return null;try{const {data}=await sb.auth.getSession();uid=data?.session?.user?.id||null;return data?.session||null}catch{return null}}
async function fetchBoard(tab){
 if(!sb)return {rows:[],error:'Sıralama için hesap bağlantısı gerekli.'};
 const table=tab==='arena'?'arena_ratings':'learning_stats';
 const fields=tab==='arena'?'user_id,rating,wins,losses,best_streak,matches':'user_id,xp,total_questions,total_correct,best_streak';
 const sort=tab==='arena'?'rating':'xp';
 const {data,error}=await sb.from(table).select(fields).order(sort,{ascending:false}).limit(200);
 if(error)throw error;
 const stats=data||[];
 if(!stats.length)return {rows:[],total:0};
 const ids=stats.map(x=>x.user_id).filter(Boolean);
 const {data:profiles,pError}=await sb.from('profiles').select('id,display_name,avatar_emoji').in('id',ids);
 if(pError)throw pError;
 const map={};(profiles||[]).forEach(p=>{map[p.id]=p});
 const rows=stats.map(r=>{const p=map[r.user_id]||{};return {id:r.user_id,username:String(p.display_name||'').trim(),avatar:p.avatar_emoji||'🧭',xp:Number(tab==='arena'?r.rating:r.xp)||0,answers:Number(tab==='arena'?r.matches:r.total_questions)||0,correct:Number(tab==='arena'?r.wins:r.total_correct)||0,streak:Number(r.best_streak)||0,isYou:r.user_id===uid}}).filter(r=>r.username.length>=2);
 return {rows,total:rows.length};
}
function rankFor(rows,id){const i=rows.findIndex(x=>x.id===id);return i<0?null:i+1}
function render(list,rows,tab,total){
 const isArena=tab==='arena';
 if(!rows.length){list.innerHTML='<div class="yb-lb-empty"><b>Henüz sıralama oluşmadı.</b><span>İlk soruları çözen gerçek kullanıcılar burada görünecek.</span></div>';return}
 const myRank=rankFor(rows,uid);
 const header=`<div class="yb-lb-header"><span>Sıra</span><span>Avatar</span><span>Oyuncu</span><span>${isArena?'RP':'XP'}</span><span>Seri</span></div>`;
 const visible=rows.slice(0,50);
 const body=visible.map((r,i)=>`<div class="yb-lb-row ${r.isYou?'yb-lb-you':''}" data-user-id="${esc(r.id)}"><span class="yb-lb-rank">${i<3?MEDAL[i]:String(i+1)}</span><span class="yb-lb-av">${esc(r.avatar)}</span><div class="yb-lb-info"><b>${esc(r.username)}${r.isYou?' <em>(Sen)</em>':''}</b><small>${isArena?`${r.answers} maç · ${r.correct} galibiyet`:`${r.answers} soru · ${r.correct} doğru`}</small></div><div class="yb-lb-score"><b>${r.xp.toLocaleString('tr-TR')}</b><small>${isArena?'RP':'XP'}</small></div><div class="yb-lb-streak">🔥${r.streak}</div></div>`).join('');
 let me='';
 if(uid&&myRank){const r=rows[myRank-1];if(myRank>50)me=`<div class="yb-lb-me"><b>Sen #${myRank}</b><span>${esc(r.username)} · ${r.xp.toLocaleString('tr-TR')} ${isArena?'RP':'XP'}</span></div>`}
 list.innerHTML=header+body+me;
 const foot=list.parentElement?.querySelector('.yb-lb-foot span');if(foot)foot.textContent=`Canlı sıralama · ${total} gerçek oyuncu`;
}
async function loadTab(tab,list){
 currentTab=tab;list.innerHTML='<div class="yb-lb-loading"><div class="yb-lb-spin"></div><span>Gerçek sıralama yükleniyor…</span></div>';
 try{const result=await fetchBoard(tab);render(list,result.rows,tab,result.total)}catch(e){console.warn('leaderboard fetch',e);list.innerHTML='<div class="yb-lb-empty"><b>Sıralama şu anda alınamadı.</b><span>Bağlantıyı kontrol edip tekrar dene.</span><button class="btn secondary" id="yb-lb-retry">Tekrar dene</button></div>';list.querySelector('#yb-lb-retry')?.addEventListener('click',()=>loadTab(tab,list))}
}
function subscribe(){
 if(!sb)return;
 if(channel){try{sb.removeChannel(channel)}catch{}}
 channel=sb.channel('yb-live-leaderboard').on('postgres_changes',{event:'*',schema:'public',table:'learning_stats'},()=>refresh()).on('postgres_changes',{event:'*',schema:'public',table:'arena_ratings'},()=>{if(currentTab==='arena')refresh()}).on('postgres_changes',{event:'*',schema:'public',table:'profiles'},()=>refresh()).subscribe();
}
function refresh(){const list=document.getElementById('yb-lb-list');if(list)loadTab(currentTab,list)}
function open(){
 const old=document.getElementById('yb-lb-modal');if(old){old.classList.add('yb-lb-visible');refresh();return}
 const wrap=document.createElement('div');wrap.id='yb-lb-modal';wrap.innerHTML=`<div class="yb-lb-backdrop"></div><section class="yb-lb-shell"><header class="yb-lb-top"><div><span class="eyebrow">🏆 SIRALAMA</span><h2>Liderlik Tablosu</h2></div><button class="yb-lb-close" type="button">×</button></header><div class="yb-lb-tabs"><button class="yb-lb-tab active" data-lbtab="global">🌍 Genel (XP)</button><button class="yb-lb-tab" data-lbtab="arena">⚔️ Arena (RP)</button></div><div class="yb-lb-list" id="yb-lb-list"></div><div class="yb-lb-foot"><span>Canlı sıralama</span><button class="btn secondary" id="yb-lb-refresh">↻ Yenile</button></div></section>`;
 document.body.appendChild(wrap);requestAnimationFrame(()=>wrap.classList.add('yb-lb-visible'));
 const list=wrap.querySelector('#yb-lb-list');loadTab('global',list);wrap.querySelector('.yb-lb-backdrop').onclick=close;wrap.querySelector('.yb-lb-close').onclick=close;wrap.querySelector('#yb-lb-refresh').onclick=refresh;
 wrap.querySelectorAll('.yb-lb-tab').forEach(b=>b.onclick=()=>{wrap.querySelectorAll('.yb-lb-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');loadTab(b.dataset.lbtab,list)});
}
function close(){const w=document.getElementById('yb-lb-modal');if(w){w.classList.remove('yb-lb-visible');setTimeout(()=>w.remove(),300)}}
function mount(){const nav=document.querySelector('.side-nav');if(!nav||nav.querySelector('#yb-lb-nav-btn'))return;const btn=document.createElement('button');btn.id='yb-lb-nav-btn';btn.type='button';btn.className='nav-item';btn.innerHTML='<span>🏆</span>Sıralama';btn.onclick=open;nav.appendChild(btn)}
init();window.addEventListener('load',async()=>{await session();subscribe();setTimeout(mount,800)});window.addEventListener('yb:profile-set',()=>refresh());window.addEventListener('yb:auth-ready',async()=>{await session();subscribe();refresh()});refreshTimer=setInterval(()=>{if(document.visibilityState==='visible')refresh()},60000);
window.YBLeaderboard={open,close,refresh};
})();