/* Yurdunu Bil v35.1 — beta map messaging + direct feedback */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const INSTAGRAM='https://www.instagram.com/omer_calkaya/';
function betaNote(){
  const note=document.createElement('aside');note.className='yb35-beta-note';note.innerHTML='<div class="yb35-beta-icon">🧪</div><div><b>Harita bölümü beta aşamasındadır</b><span><strong>Geliştirmeler devam ediyor.</strong> Özellikle göller, akarsular ve bazı coğrafi katmanların gösterimi üzerinde çalışıyoruz.</span></div>';return note;
}
function installMapNotice(){
  const v=$('#view-map');if(!v||!v.classList.contains('active')||v.querySelector('.yb35-map-beta'))return;
  const n=betaNote();n.classList.add('yb35-map-beta');const title=v.querySelector('.page-title');title?title.insertAdjacentElement('afterend',n):v.prepend(n);
}
function installAtlasNotice(){
  $$('.atlas-card').forEach(card=>{if(card.querySelector('.yb35-atlas-beta'))return;const head=$('.atlas-head',card);if(!head)return;const n=betaNote();n.classList.add('yb35-atlas-beta');head.insertAdjacentElement('afterend',n)});
}
function contactButton(){
  const top=$('.top-actions');if(!top||top.querySelector('.yb35-contact-btn'))return;
  const a=document.createElement('a');a.className='yb35-contact-btn';a.href=INSTAGRAM;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label','Sorun, öneri veya şikayet bildir');a.textContent='💬 İletişim';top.insertBefore(a,top.querySelector('#theme-btn')||top.firstChild);
}
function settingsContact(){
  const v=$('#view-settings');if(!v||v.querySelector('.yb35-feedback'))return;
  const box=document.createElement('section');box.className='surface yb35-feedback';box.innerHTML='<b>💬 Sorun, öneri veya şikayet mi var?</b><p>Haritada eksik gördüğün bir bilgi, yanlış bir gösterim veya geliştirme önerin varsa bana doğrudan Instagram üzerinden ulaşabilirsin.</p><a href="'+INSTAGRAM+'" target="_blank" rel="noopener noreferrer">Instagram’da @omer_calkaya aç →</a>';
  const about=v.querySelector('.v30-about');about?about.insertAdjacentElement('afterend',box):v.appendChild(box);
}
function run(){installMapNotice();installAtlasNotice();contactButton();settingsContact()}
run();
new MutationObserver(()=>{clearTimeout(window.__yb351Timer);window.__yb351Timer=setTimeout(run,80)}).observe(document.body,{subtree:true,childList:true});
})();
