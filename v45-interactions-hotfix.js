/* Yurdunu Bil 45 — reliable activity + arena interaction layer */
(()=>{
'use strict';
if(window.__YB45_INTERACTIONS_HOTFIX__)return;
window.__YB45_INTERACTIONS_HOTFIX__=true;
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(msg){const root=q('#toast-root');if(!root){alert(msg);return}const e=document.createElement('div');e.className='toast ok';e.textContent=msg;root.appendChild(e);requestAnimationFrame(()=>e.classList.add('show'));setTimeout(()=>{e.classList.remove('show');setTimeout(()=>e.remove(),220)},2400)}
function eventModal(id){
 const card=qa('[data-lab-open]').find(b=>b.dataset.labOpen===id)?.closest('.yb45-lab-card');if(!card)return false;
 let m=q('#yb45-hotfix-modal');if(!m){m=document.createElement('div');m.id='yb45-hotfix-modal';document.body.appendChild(m)}
 const title=q('h2',card)?.textContent||'Etkinlik',desc=q('p',card)?.textContent||'';
 m.innerHTML=`<div class="yb45-hf-backdrop" data-hf-close></div><section class="yb45-hf-dialog"><button class="yb45-hf-x" data-hf-close>×</button><span class="eyebrow">ETKİNLİK LABORATUVARI</span><h2>${esc(title)}</h2><p>${esc(desc)}</p><div class="yb45-hf-task"><b>Çalışma görevi</b><span>Önce cevabı zihninden kur. Ardından etkinlikteki ilişkileri açıklayarak bilgiyi kullan.</span></div><div class="yb45-hf-actions"><button class="btn primary" data-hf-reveal>✓ İpucunu göster</button><button class="btn secondary" data-hf-done>✓ Tamamlandı</button><button class="btn ghost" data-hf-close>Kapat</button></div><div class="yb45-hf-reveal" hidden>Doğru ilişkiyi kurarken <b>konum → neden → sonuç</b> zincirini düşün. KPSS sorularında yalnızca kavramı değil, nedenini de hatırlamak daha kalıcıdır.</div></section>`;
 m.classList.add('show');q('[data-hf-reveal]',m).onclick=()=>{q('.yb45-hf-reveal',m).hidden=false};q('[data-hf-done]',m).onclick=()=>{q(`[data-lab-done="${CSS.escape(id)}"]`,card)?.click();m.classList.remove('show');toast('Etkinlik tamamlandı ✓')};qa('[data-hf-close]',m).forEach(x=>x.onclick=()=>m.classList.remove('show'));return true;
}
function start(){document.addEventListener('click',e=>{const lab=e.target.closest('[data-lab-open]');if(lab){e.preventDefault();e.stopImmediatePropagation();eventModal(lab.dataset.labOpen);return}},true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
