/* Yurdunu Bil 84 — Events is games-only; Arena stays in primary nav */
(()=>{'use strict';if(window.__YB84_EVENTS_CLEAN__)return;window.__YB84_EVENTS_CLEAN__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function clean(){const v=$('#view-events');if(!v||!v.classList.contains('active'))return;
  $$('.arena-entry,.events-arena-strip,.yb55-arena-restore,[data-yb78-action="arena"],[data-yb55-arena],[data-yb55-social],#open-arena,#open-social',v).forEach(e=>e.remove());
  const dash=$('.events-dashboard',v);if(dash){dash.classList.add('events-games-only');
    const copy=$('.events-hero-copy p',dash);if(copy)copy.textContent='Hızlı turla ısın, mini oyunlarla konuyu pekiştir ve skorunu yükselt. Her tur KPSS coğrafya soru havuzundan beslenir.';
    const h=$('.events-hero-copy h2',dash);if(h)h.innerHTML='Bilgini hızlandır, <strong>skorunu yükselt.</strong>';
    const stats=$$('.events-stat',dash);if(stats.length>=3)stats[2].remove();
  }
}
document.addEventListener('yb:navigate',e=>{if(e.detail?.view==='events')setTimeout(clean,80)});
new MutationObserver(()=>setTimeout(clean,40)).observe(document.body,{childList:true,subtree:true});
window.addEventListener('load',()=>setTimeout(clean,180));setTimeout(clean,500);
})();
