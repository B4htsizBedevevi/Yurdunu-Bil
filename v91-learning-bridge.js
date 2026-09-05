/* Yurdunu Bil 91 — Supabase learning bridge */
(()=>{'use strict';
if(window.__YB91_LEARNING__)return;window.__YB91_LEARNING__=true;
const $=(s,r=document)=>r.querySelector(s);
const cfg=window.YURDUNUBIL_CONFIG||{};
let sb=null,uid=null;
try{if(cfg.SUPABASE_URL&&cfg.SUPABASE_PUBLISHABLE_KEY&&window.supabase)sb=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY)}catch(e){console.warn('YB91 supabase bridge',e)}
const key='yb91_learning_dashboard';
const save=x=>{try{localStorage.setItem(key,JSON.stringify({...x,saved_at:new Date().toISOString()}))}catch{}};
async function boot(){if(!sb)return;try{const {data}=await sb.auth.getSession();uid=data?.session?.user?.id||null;if(uid)await refresh();sb.auth.onAuthStateChange(async(_,s)=>{uid=s?.user?.id||null;if(uid)await refresh()})}catch(e){console.warn('YB91 learning boot',e)}}
async function refresh(){if(!sb||!uid)return null;try{const {data,error}=await sb.rpc('get_learning_dashboard');if(error)throw error;save(data||{});window.YB91LearningDashboard=data||{};window.dispatchEvent(new CustomEvent('yb:learning-refresh',{detail:data||{}}));return data||{}}catch(e){console.warn('YB91 dashboard',e);return null}}
async function record(q,correct,sessionId){if(!sb||!uid||!q?.id)return;try{const source=String(q.id)+':'+String(sessionId||'single');const r=await sb.rpc('record_learning_answer',{p_topic_id:String(q.topic||'genel'),p_correct:!!correct,p_source_id:source,p_difficulty:Math.max(1,Math.min(5,Number(q.difficultyLevel||({kolay:2,orta:3,zor:5}[q.difficulty]||3))))});if(r.error)throw r.error;if(r.data&&!r.data.duplicate)window.YB91LearningLast=r.data;await refresh()}catch(e){console.warn('YB91 record answer',e)}}
function watchQuiz(){document.addEventListener('click',e=>{const b=e.target.closest('#yb88-quiz [data-answer]');if(!b)return;const root=$('#yb88-quiz');if(!root)return;const session=root.dataset.yb91Session||(root.dataset.yb91Session=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8));setTimeout(()=>{const modal=$('#yb88-quiz .yb88-q-modal');if(!modal)return;const text=modal.querySelector('h2')?.textContent?.trim()||'';const q=(Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:[]).find(x=>String(x.q||'').trim()===text);if(!q)return;record(q,b.classList.contains('correct'),session)},0)})}
window.YB91Learning={refresh,record};
watchQuiz();boot();
})();
