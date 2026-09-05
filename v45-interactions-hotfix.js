/* Yurdunu Bil 45 — reliable activity + arena interaction layer */
(()=>{
'use strict';
if(window.__YB45_INTERACTIONS_HOTFIX__)return;
window.__YB45_INTERACTIONS_HOTFIX__=true;
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(msg){const root=q('#toast-root');if(!root){alert(msg);return}const e=document.createElement('div');e.className='toast ok';e.textContent=msg;root.appendChild(e);requestAnimationFrame(()=>e.classList.add('show'));setTimeout(()=>{e.classList.remove('show');setTimeout(()=>e.remove(),220)},2400)}
function activate(v){qa('.view').forEach(x=>x.classList.toggle('active',x.id==='view-'+v));qa('[data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view===v));const p=q('#page-title');if(p)p.textContent={library:'Kütüphane',quiz:'Mini Test',events:'Etkinlikler',arena:'Arena',map:'Harita'}[v]||p.textContent}
function eventModal(id){
 const card=qa('[data-lab-open]').find(b=>b.dataset.labOpen===id)?.closest('.yb45-lab-card');
 if(!card)return false;
 let m=q('#yb45-hotfix-modal');if(!m){m=document.createElement('div');m.id='yb45-hotfix-modal';document.body.appendChild(m)}
 const title=q('h2',card)?.textContent||'Etkinlik';const desc=q('p',card)?.textContent||'';
 m.innerHTML=`<div class="yb45-hf-backdrop" data-hf-close></div><section class="yb45-hf-dialog"><button class="yb45-hf-x" data-hf-close>×</button><span class="eyebrow">ETKİNLİK LABORATUVARI</span><h2>${esc(title)}</h2><p>${esc(desc)}</p><div class="yb45-hf-task"><b>Nasıl çalışılır?</b><span>Önce cevabı zihninden kur. Ardından aşağıdaki kartları tek tek açarak kontrol et.</span></div><div class="yb45-hf-actions"><button class="btn primary" data-hf-reveal>✓ Cevabı / ipucunu göster</button><button class="btn secondary" data-hf-close>Kapat</button></div><div class="yb45-hf-reveal" hidden>Bu etkinliğin özgün çalışma içeriği kartın içinde hazır. Cevabı gördükten sonra etkinliği “Tamamlandı” olarak işaretleyebilirsin.</div></section>`;
 m.classList.add('show');q('[data-hf-reveal]',m).onclick=()=>{q('.yb45-hf-reveal',m).hidden=false};qa('[data-hf-close]',m).forEach(x=>x.onclick=()=>m.classList.remove('show'));return true;
}
function arenaAuthMessage(){const v=q('#view-arena');if(!v)return;let m=q('#yb45-arena-auth-help',v);if(!m){m=document.createElement('div');m.id='yb45-arena-auth-help';m.className='yb45-arena-auth-help';v.appendChild(m)}m.innerHTML='<b>⚔️ Gerçek rakiple oynamak için hesap girişi gerekiyor.</b><span>Misafir modu yalnızca kişisel çalışma içindir; oda kodu ve gerçek zamanlı düello Supabase hesabı üzerinden çalışır.</span><button class="btn secondary" data-hf-login>Giriş ekranına dön</button>';q('[data-hf-login]',m).onclick=()=>{q('#logout-btn')?.click();location.reload()}}
function start(){
 document.addEventListener('click',e=>{
   const lab=e.target.closest('[data-lab-open]');
   if(lab){e.preventDefault();e.stopImmediatePropagation();eventModal(lab.dataset.labOpen);return}
   const arena=e.target.closest('[data-arena-create],[data-arena-join],[data-arena-queue],[data-arena-mode]');
   if(arena && !window.YB45Arena){e.preventDefault();e.stopImmediatePropagation();toast('Arena modülü henüz yüklenmedi. Sayfayı yenile.');return}
 },true);
 window.addEventListener('error',e=>{if(String(e.message||'').toLowerCase().includes('arena'))toast('Arena bağlantısında bir hata oluştu. Giriş durumunu kontrol et.')});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
