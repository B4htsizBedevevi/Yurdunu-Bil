/* Yurdunu Bil 104 — progress loop bridge; additive and non-destructive. */
(()=>{'use strict';if(window.__YB104_PROGRESS__)return;window.__YB104_PROGRESS__=true;
const KEY='yb104_daily_v1';
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const dayKey=()=>new Date().toISOString().slice(0,10);
function loadLibraryReader(){if(window.__YB106_LIBRARY_CARDS__||window.__YB106_LOADING__)return;window.__YB106_LOADING__=true;const s=document.createElement('script');s.src='v106-library-cards.js?v=106.0.0';s.onload=()=>{window.__YB106_LOADING__=false};s.onerror=()=>{window.__YB106_LOADING__=false};document.body.appendChild(s)}
function get(){const old=read(KEY,null);if(!old||old.day!==dayKey())return{day:dayKey(),answers:0,correct:0,games:0,topics:[],xp:0};return old}
function set(x){save(KEY,x);render()}
function render(){loadLibraryReader();const home=document.querySelector('#view-home.active');if(!home)return;let box=document.querySelector('#yb104-progress-loop');const s=get();const target=10;const done=Math.min(s.answers,target);const pct=Math.round(done/target*100);if(!box){box=document.createElement('section');box.id='yb104-progress-loop';box.className='yb104-progress-loop';const root=home.querySelector('.yb90-home');if(root)root.appendChild(box);else return}box.innerHTML=`<div class="yb104-progress-head"><div><span class="eyebrow">🎯 BUGÜNÜN HEDEFİ</span><h2>Çalışma zincirini koparma.</h2><p>10 soru çöz, ardından bir oyunla pekiştir.</p></div><strong>${done}/10</strong></div><div class="yb104-progress-track"><i style="width:${pct}%"></i></div><div class="yb104-progress-grid"><button data-yb104="quiz"><span>🎯</span><b>${Math.max(0,target-done)} soru</b><small>${done>=target?'Hedef tamamlandı':'Hedefe kalan'}</small></button><button data-yb104="game"><span>🎮</span><b>${s.games?'✓ '+s.games+' oyun':'1 oyun'}</b><small>${s.games?'Bugün oynandı':'Pekiştirmeye geç'}</small></button><button data-yb104="library"><span>📚</span><b>${s.topics.length||0} konu</b><small>${s.topics.length?'Bugün dokunuldu':'Bir konu seç'}</small></button></div>`;box.querySelectorAll('[data-yb104]').forEach(b=>b.onclick=()=>{const x=b.dataset.yb104;if(x==='quiz')window.YB88QuestionCenter?.openQuiz?.('all');else if(x==='game')window.navigate?.('events');else window.navigate?.('library')})}
function markAnswer(correct){const s=get();s.answers++;if(correct)s.correct++;s.xp+=correct?10:2;set(s)}
function markGame(){const s=get();s.games++;s.xp+=15;set(s)}
function markTopic(id){if(!id)return;const s=get();if(!s.topics.includes(id))s.topics.push(id);set(s)}
window.YBProgress={answer:markAnswer,game:markGame,topic:markTopic,refresh:render};
window.addEventListener('yb:navigate',e=>{if(e.detail?.view==='home')setTimeout(render,120)});
document.addEventListener('click',e=>{const topic=e.target.closest('[data-open-topic]');if(topic)markTopic(topic.dataset.openTopic);if(e.target.closest('.yb55-game-card,.yb86-game-card'))setTimeout(()=>render(),80)});
setTimeout(render,700);setInterval(()=>{if(document.visibilityState==='visible')render()},3000);
})();