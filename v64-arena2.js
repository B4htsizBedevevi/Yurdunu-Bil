/* Yurdunu Bil 64 — Arena 2.0 orchestration */
(()=>{'use strict';if(window.__YB64_ARENA__)return;window.__YB64_ARENA__=true;
const G={sprint:{label:'Bilgi Sprinti',time:15,rounds:10,score:(ok,ms)=>ok?100+Math.max(0,Math.round((12000-Math.min(ms,12000))/400)):0},ten:{label:'10’da 10',time:25,rounds:10,score:(ok)=>ok?100:0},hint:{label:'İpucu Avı',time:25,rounds:10,score:(ok,ms,h)=>ok?Math.max(40,100-(h||0)*20):0},lives:{label:'3 Can',time:25,rounds:10,lives:3,score:(ok)=>ok?100:0},streak:{label:'Seri Ustası',time:15,rounds:10,score:(ok,ms,h,streak)=>ok?100+Math.min(150,(streak||0)*15):0},region:{label:'Bölge Blitz',time:25,rounds:10,topic:'bolgeler',score:(ok)=>ok?110:0}};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const api={games:G,get:(id)=>G[id]||G.ten,score:(id,ok,ms,h,streak)=>api.get(id).score(ok,ms,h,streak),label:(id)=>api.get(id).label};
window.YB64Arena=api;
})();
