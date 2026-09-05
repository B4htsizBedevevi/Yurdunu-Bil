/* Yurdunu Bil Arena v2 — konu seçimli oda + hızlı arena + gelişmiş UI */
(()=>{
'use strict';
if(window.__YB_ARENA_V1__)return;
window.__YB_ARENA_V1__=true;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const CFG=window.YURDUNUBIL_CONFIG||{};

let sb=null,user=null,match=null,me=null,opponent=null,channel=null;
let questions=[],questionStarted=0,timer=null,answered=false,poll=null;

try{
  if(CFG.SUPABASE_URL&&CFG.SUPABASE_PUBLISHABLE_KEY&&window.supabase)
    sb=window.supabase.createClient(CFG.SUPABASE_URL,CFG.SUPABASE_PUBLISHABLE_KEY);
}catch(e){console.warn('Arena Supabase',e)}

const TOPIC_LABELS={
  all:'Tüm Konular',konum:'🧭 Coğrafi Konum',iklim:'🌦️ İklim',
  yerseki:'⛰️ Yerşekilleri',su:'💧 Su Kaynakları',nufus:'👥 Nüfus',
  tarim:'🌾 Tarım',maden:'⛏️ Maden & Enerji',bolgeler:'🗺️ Bölgeler'
};

const MODE_META={
  duel:{icon:'⚔️',label:'Klasik Düello',desc:'25 sn/soru • dengeli puan'},
  speed:{icon:'⚡',label:'Hız Arenası',desc:'15 sn/soru • hız bonusu'},
  chain:{icon:'🔗',label:'Bilgi Zinciri',desc:'Seri odaklı • baskı yüksek'}
};

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const playerName=()=>{
  const n=window.YURDUNUBIL_STATE?.profile?.displayName
    ||localStorage.getItem('yb_arena_name')||'Oyuncu';
  return String(n).trim()||'Oyuncu';
};

const toast=(t,type='ok')=>{
  const root=$('#toast-root');if(!root)return;
  const e=document.createElement('div');
  e.className='toast '+(type==='error'?'error':'ok');
  e.textContent=t;root.appendChild(e);
  requestAnimationFrame(()=>e.classList.add('show'));
  setTimeout(()=>{e.classList.remove('show');setTimeout(()=>e.remove(),220)},2400);
};

function getPool(topic){
  const raw=Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:[];
  const base=raw.map((x,i)=>({
    id:String(x.id||i),q:x.q||x.question||'',
    opts:Array.isArray(x.options)?x.options:[],
    a:Number.isInteger(x.answer)?x.answer:0,
    ex:x.explain||'',topic:x.topic||'genel'
  })).filter(x=>x.q&&x.opts.length>=2&&x.a>=0&&x.a<x.opts.length);
  if(topic&&topic!=='all')return base.filter(x=>x.topic===topic);
  return base;
}

function seedRand(seed){
  let h=2166136261;
  for(const c of String(seed)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
  return()=>{h+=0x6D2B79F5;let t=h;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296};
}

function buildQuestions(topic){
  const p=getPool(topic||match?.topic||'all');
  const r=seedRand(match?.id||'arena');
  const a=[...p];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  return a.slice(0,Math.min(match?.question_count||10,20)).map(x=>{
    const opts=x.opts.map((v,i)=>({v,i}));
    for(let i=opts.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[opts[i],opts[j]]=[opts[j],opts[i]]}
    return {...x,displayOpts:opts};
  });
}

async function auth(){
  if(!sb){toast('Arena sunucusu hazır değil.','error');return null}
  const r=await sb.auth.getSession();
  user=r.data?.session?.user||null;
  if(!user){toast('Arena için giriş yapmalısın.','error');return null}
  return user;
}

function goEvents(){try{if(typeof window.navigate==='function')window.navigate('events')}catch{}}
function view(){return $('#view-events')}
function profileRow(players,uid){return players.find(p=>p.user_id===uid)||players.find(p=>p.id===uid)||null}

async function loadMatchPlayers(){
  if(!match)return;
  const r=await sb.from('arena_players').select('*').eq('match_id',match.id).order('joined_at',{ascending:true});
  const ps=r.data||[];
  me=profileRow(ps,user.id);
  opponent=ps.find(p=>p.user_id!==user.id)||null;
}

function cleanup(){
  if(timer){clearInterval(timer);timer=null}
  if(poll){clearInterval(poll);poll=null}
  if(channel){sb?.removeChannel(channel);channel=null}
}

function shell(content){
  const v=view();if(!v)return;
  v.innerHTML='<div class="ybArena">'+content+'</div>';
}

/* ─── HUB ─── */
async function hub(){
  cleanup();match=null;me=null;opponent=null;
  await loadRating();
  const topicOpts=Object.entries(TOPIC_LABELS)
    .map(([k,v])=>`<option value="${k}">${v}</option>`).join('');
  const modeButtons=Object.entries(MODE_META)
    .map(([id,m])=>`<button data-arena-mode="${id}" class="yb-mode-btn${id==='duel'?' active':''}">
      <span>${m.icon}</span><b>${m.label}</b><small>${m.desc}</small>
    </button>`).join('');

  shell(`
  <section class="ybArenaHero">
    <span class="ybArenaKicker">YURDUNU BİL • ARENA</span>
    <h1>Bilgini rakibine karşı kanıtla.</h1>
    <p>Gerçek zamanlı 1 VS 1 düello. Konu seç, oda kur, kodu paylaş.</p>
    <div class="ybArenaStats">
      <div><b>1 VS 1</b><small>Canlı düello</small></div>
      <div><b>+25</b><small>Galibiyet RP</small></div>
      <div><b>10</b><small>Tur</small></div>
      <div><b>8</b><small>Konu seçeneği</small></div>
    </div>
  </section>

  <section class="ybArenaGrid">

    <!-- Rakip Bul -->
    <article class="ybArenaCard featured">
      <div class="ybArenaIcon">⚔️</div>
      <span class="ybArenaTag">HIZLI EŞLEŞTİRME</span>
      <h3>Rakip Bul</h3>
      <p>Konu ve mod seç, sistem sana uygun rakip ararken oda açar.</p>
      <div class="yb-arena-hub-row">
        <label class="yb-arena-select-wrap">
          <span>Konu</span>
          <select id="quick-topic-select">${topicOpts}</select>
        </label>
        <label class="yb-arena-select-wrap">
          <span>Mod</span>
          <select id="quick-mode-select">
            <option value="duel">⚔️ Klasik</option>
            <option value="speed">⚡ Hız</option>
            <option value="chain">🔗 Zincir</option>
          </select>
        </label>
      </div>
      <button class="btn primary" data-arena-action="matchmake">Rakip Bul →</button>
    </article>

    <!-- Oda Oluştur -->
    <article class="ybArenaCard">
      <div class="ybArenaIcon">🔐</div>
      <h3>Oda Oluştur</h3>
      <p>Konu ve modu kendin belirle, kodu arkadaşınla paylaş.</p>
      <div class="yb-mode-picker">${modeButtons}</div>
      <label class="yb-arena-select-wrap" style="margin:10px 0 8px">
        <span>Konu seç</span>
        <select id="create-topic-select">${topicOpts}</select>
      </label>
      <button class="btn secondary" data-arena-action="create">Oda Kodu Oluştur →</button>
    </article>

    <!-- Koda Katıl -->
    <article class="ybArenaCard">
      <div class="ybArenaIcon">🎟️</div>
      <h3>Koda Katıl</h3>
      <p>Arkadaşının paylaştığı 6 haneli kodu gir.</p>
      <div class="ybArenaJoin">
        <input id="ybArenaCode" maxlength="6" inputmode="text" placeholder="ABC123" style="text-transform:uppercase">
        <button class="btn secondary" data-arena-action="join">Katıl →</button>
      </div>
      <p class="yb-arena-hint">Kodu büyük/küçük harf fark etmez.</p>
    </article>

  </section>

  <section class="ybArenaBoard">
    <div>
      <span class="ybArenaKicker">LİGLER</span>
      <h2>Reyting merdiveni</h2>
      <p>1000 başlangıç puanı. Galibiyet +25 · Mağlubiyet −18 · Beraberlik +5</p>
    </div>
    <div class="ybArenaLeague" id="ybArenaLeague">Yükleniyor…</div>
  </section>`);

  /* mod buton seçimi */
  $$('.yb-mode-btn').forEach(b=>b.onclick=()=>{
    $$('.yb-mode-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
  });

  /* kod input büyük harf */
  const codeInput=$('#ybArenaCode');
  if(codeInput)codeInput.addEventListener('input',()=>{codeInput.value=codeInput.value.toUpperCase()});

  $$('[data-arena-action]',view()).forEach(b=>b.onclick=()=>arenaAction(b.dataset.arenaAction));
}

async function loadRating(){
  if(!sb)return;
  user=user||await auth();if(!user)return;
  await sb.from('arena_ratings').upsert({user_id:user.id},{onConflict:'user_id'});
  const r=await sb.from('arena_ratings').select('*').eq('user_id',user.id).maybeSingle();
  const d=r.data||{rating:1000,wins:0,losses:0,draws:0,matches:0,best_streak:0};
  const league=d.rating>=1500?'🏆 Elit':d.rating>=1300?'⚔️ Usta':d.rating>=1150?'🎯 Uzman':d.rating>=1000?'📈 Yükselen':'🌱 Çaylak';
  const e=$('#ybArenaLeague');
  if(e)e.innerHTML=`<strong>${league}</strong><span>${d.rating} RP</span><small>🏆 ${d.wins}G · ${d.losses}M · 🔥 ${d.best_streak} seri</small>`;
}

async function arenaAction(action){
  user=await auth();if(!user)return;
  const mode=$('.yb-mode-btn.active')?.dataset.arenaMode
    ||$('#quick-mode-select')?.value||'duel';
  const topic=action==='create'
    ?($('#create-topic-select')?.value||'all')
    :($('#quick-topic-select')?.value||'all');
  if(action==='matchmake')await matchmake(mode,topic);
  if(action==='create')await create(mode,topic);
  if(action==='join')await join($('#ybArenaCode')?.value||'');
}

async function create(mode,topic){
  const t=topic==='all'?null:topic;
  const r=await sb.rpc('arena_create_match',{p_mode:mode,p_topic:t,p_question_count:10});
  if(r.error){toast(r.error.message,'error');return}
  match=r.data;await loadMatchPlayers();showWaitingMatch(mode,topic);subscribe();
}

async function join(code){
  code=String(code).trim().toUpperCase();
  if(code.length<4){toast('Arena kodunu gir.','error');return}
  const r=await sb.rpc('arena_join_match',{p_code:code});
  if(r.error){
    toast(r.error.message==='match_not_found'?'Oda bulunamadı veya doldu.':r.error.message,'error');
    return;
  }
  match=r.data;await loadMatchPlayers();
  if(match.status==='active')renderArenaGame();
  else showWaitingMatch(match.mode,match.topic||'all');
  subscribe();
}

async function matchmake(mode,topic){
  shell(`<section class="ybArenaWait">
    <div class="ybArenaPulse">⚔️</div>
    <span class="ybArenaKicker">EŞLEŞME ARANIYOR</span>
    <h1>Rakip aranıyor…</h1>
    <p>Konu: <b>${esc(TOPIC_LABELS[topic]||'Tüm Konular')}</b> · Mod: <b>${esc(MODE_META[mode]?.label||mode)}</b></p>
    <div class="ybArenaSearchLine"><i></i><i></i><i></i></div>
    <button class="btn ghost" data-arena-cancel>Vazgeç</button>
  </section>`);
  $('[data-arena-cancel]')?.addEventListener('click',()=>{cleanup();hub()});

  let tries=0;
  const attempt=async()=>{
    tries++;
    const t=topic==='all'?null:topic;
    const q=await sb.from('arena_matches').select('*')
      .eq('mode',mode).eq('status','waiting')
      .neq('created_by',user.id)
      .order('created_at',{ascending:true}).limit(1);
    const candidate=q.data?.[0];
    if(candidate){
      const j=await sb.rpc('arena_join_match',{p_code:candidate.code});
      if(!j.error){match=j.data;await loadMatchPlayers();renderArenaGame();subscribe();return}
    }
    if(tries===1){
      const c=await sb.rpc('arena_create_match',{p_mode:mode,p_topic:t,p_question_count:10});
      if(c.error){toast(c.error.message,'error');hub();return}
      match=c.data;await loadMatchPlayers();showWaitingMatch(mode,topic);subscribe();
    }
  };
  await attempt();
}

function showWaitingMatch(mode,topic){
  const modeMeta=MODE_META[mode]||{icon:'⚔️',label:mode};
  const topicLabel=TOPIC_LABELS[topic||'all']||'Tüm Konular';
  shell(`<section class="ybArenaWait">
    <div class="ybArenaPulse">🛡️</div>
    <span class="ybArenaKicker">ODA HAZIR</span>
    <h1>Rakibini bekliyoruz.</h1>
    <div class="yb-wait-meta">
      <span>${modeMeta.icon} ${esc(modeMeta.label)}</span>
      <span>📚 ${esc(topicLabel)}</span>
    </div>
    <p>Bu kodu arkadaşına gönder veya eşleşmeyi bekle.</p>
    <div class="ybArenaCode">${esc(match.code)}</div>
    <button class="btn primary" data-arena-copy>📋 Kodu Kopyala</button>
    <button class="btn ghost" data-arena-cancel>İptal</button>
    <div class="ybArenaHint">Oyuncu geldiğinde oyun otomatik başlar.</div>
  </section>`);
  $('[data-arena-copy]')?.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(match.code);toast('Arena kodu kopyalandı.')}
    catch{toast(match.code)}
  });
  $('[data-arena-cancel]')?.addEventListener('click',()=>{cleanup();hub()});
}

function subscribe(){
  if(channel)sb.removeChannel(channel);
  channel=sb.channel('yb-arena-'+match.id)
    .on('postgres_changes',{event:'UPDATE',schema:'public',table:'arena_matches',filter:'id=eq.'+match.id},p=>onMatch(p.new))
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'arena_players',filter:'match_id=eq.'+match.id},async()=>{
      await loadMatchPlayers();
      if(match?.status==='waiting'&&opponent)showWaitingMatch(match.mode,match.topic||'all');
    }).subscribe();
  poll=setInterval(async()=>{
    const r=await sb.from('arena_matches').select('*').eq('id',match.id).maybeSingle();
    if(r.data)onMatch(r.data);
  },1500);
}

function onMatch(m){
  match=m;
  if(m.status==='waiting'){
    if(opponent&&!$('.ybArenaQuestion',view()))renderArenaGame();return;
  }
  if(m.status==='active'){
    loadMatchPlayers().then(()=>{
      if(!view()?.querySelector('.ybArenaQuestion'))renderArenaGame();
      else updateScore();
    });
  }
  if(m.status==='finished')finishScreen();
}

function updateScore(){
  const a=$('#ybArenaMeScore'),b=$('#ybArenaOppScore');
  if(a)a.textContent=String(me?.score||0);
  if(b)b.textContent=String(opponent?.score||0);
  const qn=$('#ybArenaQNum');
  if(qn)qn.textContent=`Tur ${Math.min(match.current_question+1,match.question_count)} / ${match.question_count}`;
}

function renderArenaGame(){
  questions=buildQuestions(match.topic);
  answered=false;questionStarted=Date.now();
  const item=questions[Math.min(match.current_question,questions.length-1)]||questions[0];
  if(!item)return;
  const my=me||{},op=opponent||{};
  const modeMeta=MODE_META[match.mode]||{icon:'⚔️',label:match.mode};
  const topicLabel=TOPIC_LABELS[match.topic||'all']||'Tüm Konular';
  shell(`
  <section class="ybArenaTop">
    <div>
      <span class="ybArenaKicker">${modeMeta.icon} ${esc(modeMeta.label.toUpperCase())} • ${esc(topicLabel.toUpperCase())}</span>
      <h1>Canlı Düello</h1>
    </div>
    <div class="ybArenaRound" id="ybArenaQNum">Tur ${match.current_question+1} / ${match.question_count}</div>
  </section>
  <section class="ybArenaScore">
    <div class="ybArenaPlayer me">
      <span>🧑‍💻</span>
      <div><b>${esc(my.display_name||playerName())}</b><small>Sen • <strong id="ybArenaMeScore">${my.score||0}</strong> puan</small></div>
    </div>
    <div class="ybArenaVS">VS</div>
    <div class="ybArenaPlayer">
      <span>⚔️</span>
      <div><b>${esc(op.display_name||'Rakip')}</b><small>Rakip • <strong id="ybArenaOppScore">${op.score||0}</strong> puan</small></div>
    </div>
  </section>
  <section class="ybArenaQuestion">
    <div class="ybArenaQuestionMeta">
      <span id="yb-arena-timer">⏱ ${match.mode==='speed'?'15':'25'} sn</span>
      <span>${esc(item.topic||'Genel')}</span>
    </div>
    <h2>${esc(item.q)}</h2>
    <div class="ybArenaOptions">
      ${item.displayOpts.map((o,i)=>`<button data-arena-answer="${o.i}">
        <b>${String.fromCharCode(65+i)}</b><span>${esc(o.v)}</span>
      </button>`).join('')}
    </div>
    <div class="ybArenaLive" id="ybArenaLive">Rakibin cevabı bekleniyor…</div>
  </section>`);
  updateScore();
  startTimer(match.mode==='speed'?15:25,item);
}

function startTimer(seconds,item){
  if(timer)clearInterval(timer);
  let left=seconds;
  const e=$('#yb-arena-timer');
  if(e)e.textContent='⏱ '+left+' sn';
  timer=setInterval(()=>{
    left--;
    if(e)e.textContent='⏱ '+Math.max(0,left)+' sn';
    if(left<=0){clearInterval(timer);timer=null;if(!answered)submit(item,-1,false,seconds*1000)}
  },1000);
  $$('[data-arena-answer]').forEach(b=>b.onclick=()=>{
    if(answered)return;
    const idx=Number(b.dataset.arenaAnswer);
    submit(item,idx,idx===item.a,Date.now()-questionStarted);
  });
}

async function submit(item,answerIndex,ok,responseMs){
  if(answered)return;answered=true;
  if(timer){clearInterval(timer);timer=null}
  $$('[data-arena-answer]').forEach(b=>{
    b.disabled=true;
    const idx=Number(b.dataset.arenaAnswer);
    if(idx===item.a)b.classList.add('correct');
    if(idx===answerIndex&&!ok&&answerIndex!==-1)b.classList.add('wrong');
  });
  const points=ok?100+(match.mode==='speed'?Math.max(0,Math.round((12000-Math.min(responseMs,12000))/500)):0):0;
  const playerId=me?.id;
  if(!playerId){toast('Oyuncu kaydı bulunamadı.','error');return}
  const r=await sb.rpc('arena_submit_answer',{
    p_match_id:match.id,p_player_id:playerId,
    p_question_index:match.current_question,
    p_answer_index:answerIndex,p_is_correct:ok,
    p_response_ms:responseMs,p_points:points
  });
  if(r.error){toast(r.error.message,'error');return}
  match=r.data;await loadMatchPlayers();
  const live=$('#ybArenaLive');
  if(live){
    if(ok)live.innerHTML=`✓ Doğru! <small>${esc(item.ex||'')}</small>`;
    else live.innerHTML=`✕ ${answerIndex===-1?'Süre doldu.':'Yanlış.'} Doğru: <b>${esc(item.opts[item.a]||'')}</b>`;
  }
  if(match.status==='finished')finishScreen();
}

async function finishScreen(){
  cleanup();await loadMatchPlayers();
  const myScore=me?.score||0,opScore=opponent?.score||0;
  let result='Berabere!',emoji='🤝';
  if(myScore>opScore){result='Zafer!';emoji='🏆'}
  else if(myScore<opScore){result='Bu tur rakibinin.';emoji='⚔️'}
  let rating=null;
  if(sb&&user){const r=await sb.from('arena_ratings').select('*').eq('user_id',user.id).maybeSingle();rating=r.data}
  const ratingDiff=myScore>opScore?'+25':myScore<opScore?'-18':'+5';
  const mode=match?.mode||'duel';
  shell(`<section class="ybArenaResult">
    <div class="ybArenaResultEmoji">${emoji}</div>
    <span class="ybArenaKicker">ARENA SONUCU</span>
    <h1>${result}</h1>
    <div class="ybArenaFinal">
      <div><small>${esc(me?.display_name||playerName())}</small><b>${myScore}</b></div>
      <strong>—</strong>
      <div><small>${esc(opponent?.display_name||'Rakip')}</small><b>${opScore}</b></div>
    </div>
    <div class="ybArenaReward">
      <span>🏅 ${rating?.rating||1000} RP</span>
      <span class="yb-rating-diff">${ratingDiff} RP</span>
      <span>🔥 ${rating?.best_streak||0} en iyi seri</span>
    </div>
    <div class="ybArenaResultActions">
      <button class="btn primary" data-arena-rematch>Tekrar Oyna</button>
      <button class="btn secondary" data-arena-home>Arena Ana Sayfa</button>
    </div>
  </section>`);
  $('[data-arena-home]')?.addEventListener('click',hub);
  $('[data-arena-rematch]')?.addEventListener('click',()=>matchmake(mode,match?.topic||'all'));
}

window.YBArena={
  open:async()=>{
    goEvents();
    setTimeout(async()=>{user=await auth();if(user)hub()},0);
  },
  hub
};
})();
