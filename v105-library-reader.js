/* Yurdunu Bil 105 — bite-sized library reader */
(()=>{'use strict';
if(window.__YB105_LIBRARY_READER__)return;window.__YB105_LIBRARY_READER__=true;
const $=(s,r=document)=>r.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state=null;
function injectStyle(){if($('#yb105-style'))return;const s=document.createElement('style');s.id='yb105-style';s.textContent=`
.yb105-reader{max-width:980px;margin:4px auto 0;padding:20px;border:1px solid rgba(91,202,145,.18);border-radius:24px;background:linear-gradient(145deg,rgba(10,38,27,.96),rgba(7,27,21,.98));box-shadow:0 18px 55px rgba(0,0,0,.22)}
.yb105-back{display:inline-flex;align-items:center;gap:7px;border:0;background:transparent;color:#8ed8b2;font:800 12px/1 Inter,sans-serif;padding:4px 0;cursor:pointer}
.yb105-head{display:flex;gap:14px;align-items:center;margin:12px 0 18px}.yb105-icon{width:54px;height:54px;display:grid;place-items:center;border-radius:17px;background:rgba(70,180,118,.12);border:1px solid rgba(102,211,151,.16);font-size:29px}.yb105-head h2{margin:2px 0 3px;font-size:23px;color:#f0f7f2}.yb105-head p{margin:0;color:#9bb4a8;font-size:12px}.yb105-progress{height:6px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden;margin:0 0 18px}.yb105-progress i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#3cae72,#8dd7b1);transition:width .25s ease}.yb105-kicker{display:flex;justify-content:space-between;gap:10px;color:#779489;font:800 10px/1 Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px}.yb105-facts{display:grid;gap:10px}.yb105-fact{display:grid;grid-template-columns:34px 1fr;gap:11px;align-items:start;padding:13px 14px;border:1px solid rgba(116,190,160,.12);border-radius:16px;background:rgba(16,54,39,.62)}.yb105-fact b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;background:rgba(80,190,129,.13);color:#87d7ae;font-size:10px}.yb105-fact p{margin:0;color:#dcebe2;font-size:13px;line-height:1.55}.yb105-tip{margin-top:12px;padding:13px 14px;border-radius:16px;background:rgba(191,154,72,.08);border:1px solid rgba(191,154,72,.15)}.yb105-tip strong{display:block;color:#d9b86b;font-size:10px;letter-spacing:.08em;margin-bottom:5px}.yb105-tip p{margin:0;color:#b9c8c0;font-size:12px;line-height:1.5}.yb105-actions{display:flex;gap:9px;margin-top:16px}.yb105-actions button{flex:1;min-height:44px;border-radius:13px;border:1px solid rgba(100,195,146,.18);background:rgba(27,76,55,.55);color:#dceee3;font:800 12px Inter,sans-serif;cursor:pointer}.yb105-actions .primary{background:linear-gradient(135deg,#2e9561,#3eb97b);color:#fff;border-color:rgba(117,226,166,.25)}.yb105-actions button:disabled{opacity:.35;cursor:default}.yb105-quiz{margin-top:10px}.yb105-quiz button{width:100%}
@media(max-width:600px){.yb105-reader{margin:0;padding:16px;border-radius:20px}.yb105-head{align-items:flex-start}.yb105-head h2{font-size:20px}.yb105-fact{padding:12px}.yb105-fact p{font-size:12px}.yb105-actions{position:sticky;bottom:86px;background:linear-gradient(transparent,#071812 25%);padding-top:12px}}
body.light .yb105-reader{background:linear-gradient(145deg,#f7fcf8,#edf7f0);border-color:rgba(31,113,75,.16)}body.light .yb105-head h2{color:#173126}body.light .yb105-head p,body.light .yb105-fact p,body.light .yb105-tip p{color:#587064}body.light .yb105-fact{background:#fff;border-color:rgba(31,113,75,.12)}body.light .yb105-actions button{background:#eef7f1;color:#244438}
`;document.head.appendChild(s)}
function openTopic(id){
 const topics=Array.isArray(window.TOPICS)?window.TOPICS:[];const t=topics.find(x=>String(x.id)===String(id));if(!t)return;
 const host=$('#library-content');if(!host)return;
 state={t,items:Array.isArray(t.bullets)?t.bullets.filter(Boolean):[],page:0};injectStyle();render();
 host.scrollIntoView({behavior:'smooth',block:'start'});
}
function render(){
 const {t,items,page}=state,total=Math.max(1,Math.ceil(items.length/2)),start=page*2,chunk=items.slice(start,start+2);
 const host=$('#library-content');if(!host)return;
 host.innerHTML=`<section class="yb105-reader" aria-label="${esc(t.title||t.name)} konu anlatımı">
   <button class="yb105-back" id="yb105-back" type="button">← Kütüphaneye dön</button>
   <div class="yb105-head"><span class="yb105-icon">${t.icon||'📚'}</span><div><span class="eyebrow">${esc(t.level||'KPSS')} • ${t.minutes||10} DK</span><h2>${esc(t.title||t.name)}</h2><p>${esc(t.desc||t.description||'Konuyu kısa parçalar halinde çalış.')}</p></div></div>
   <div class="yb105-kicker"><span>BÖLÜM ${page+1} / ${total}</span><span>${items.length} temel bilgi</span></div>
   <div class="yb105-progress"><i style="width:${Math.round(((page+1)/total)*100)}%"></i></div>
   <div class="yb105-facts">${chunk.map((x,i)=>`<article class="yb105-fact"><b>${String(start+i+1).padStart(2,'0')}</b><p>${esc(x)}</p></article>`).join('')}</div>
   ${page===total-1&&t.tip?`<div class="yb105-tip"><strong>⚡ SINAV İPUCU</strong><p>${esc(t.tip)}</p></div>`:''}
   <div class="yb105-actions">
     <button id="yb105-prev" type="button" ${page===0?'disabled':''}>← Önceki</button>
     ${page<total-1?`<button class="primary" id="yb105-next" type="button">Devam et →</button>`:`<button class="primary" id="yb105-quiz" type="button">🎯 Sorulara geç →</button>`}
   </div>
 </section>`;
 $('#yb105-back').onclick=backToLibrary;
 $('#yb105-prev')?.addEventListener('click',()=>{state.page--;render();host.scrollIntoView({behavior:'smooth',block:'start'})});
 $('#yb105-next')?.addEventListener('click',()=>{state.page++;render();host.scrollIntoView({behavior:'smooth',block:'start'})});
 $('#yb105-quiz')?.addEventListener('click',()=>{const pool=(Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:[]).filter(q=>q.topic===t.id);if(pool.length)window.YB88QuestionCenter?.openQuiz?.(pool);else window.YB55Games?.start?.('ten')});
}
function backToLibrary(){const b=document.querySelector('.yb98-top-link[data-view="library"]')||document.querySelector('[data-view="library"]');if(b)b.click();else location.reload()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-open-topic]');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openTopic(b.dataset.openTopic)},true);
window.YB105LibraryReader={open:openTopic};
})();