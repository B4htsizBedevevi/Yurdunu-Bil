/* Yurdunu Bil v31 — province-data map coloring
 * Category tabs are backed by actual province fields, not placeholder booleans.
 */
(()=>{
'use strict';
const DATA=Array.isArray(window.PROVINCE_DATA)?window.PROVINCE_DATA:[];
const norm=v=>String(v||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c').trim();
const clean=v=>String(v||'').trim();
const pof=n=>{const q=norm(n);return DATA.find(p=>norm(p.name)===q)||null};
const has=(...xs)=>xs.some(v=>{const n=norm(v);return n&&n!=='yok'&&!n.includes('bulunmuyor')&&!n.includes('bulunmaz')&&!n.includes('sinirli')&&!n.includes('sınırlı')});
const colors={default:'#4d87d9',region:{Marmara:'#5d8fe5',Ege:'#69b86f',Akdeniz:'#df9857','İç Anadolu':'#d5aa4d',Karadeniz:'#49bfa2','Doğu Anadolu':'#8d79d7','Güneydoğu Anadolu':'#c87177'},climate:{akdeniz:'#df8e63',karadeniz:'#48bca6',karasal:'#8d7bd2',gecis:'#c8a85d'},agriculture:'#36b98c',mountains:'#ad855b',plains:'#d7b04f',plateaus:'#b58b63',lakes:'#3b91c4',rivers:'#397dab',mining:'#d27d51',neutral:'#718392'};
function mode(shell){return shell.querySelector('.mode-tabs [data-v30-mode].active')?.dataset.v30Mode||'default'}
function regionColor(r){return colors.region[r]||colors.default}
function paint(svg){const shell=svg.closest('.atlas-shell');if(!shell)return;const m=mode(shell);svg.querySelectorAll('.province-shape,[data-province]').forEach(el=>{const p=pof(el.dataset.province||el.getAttribute('data-province'));if(!p)return;let c=colors.neutral;if(m==='default')c=p.color||colors.default;else if(m==='region')c=regionColor(p.region);else if(m==='climate'){const n=norm(p.climate);c=n.includes('akdeniz')?colors.climate.akdeniz:n.includes('karadeniz')?colors.climate.karadeniz:n.includes('karasal')||n.includes('sert')?colors.climate.karasal:colors.climate.gecis}else if(m==='agriculture')c=has(p.agriculture)?colors.agriculture:colors.neutral;else if(m==='mountains')c=has(p.mountains)&&/dag|dağ|toros|kackar|kaçkar|uludag|uludağ|köroglu|köroğlu|ararat/i.test(clean(p.terrain)+' '+clean(p.mountains))?colors.mountains:colors.neutral;else if(m==='plains')c=has(p.plains)||/ova|graben|duzluk|düzlük/i.test(clean(p.terrain)+' '+clean(p.plains))?colors.plains:colors.neutral;else if(m==='plateaus')c=/plato|yayla/i.test(clean(p.terrain)+' '+clean(p.plains))?colors.plateaus:colors.neutral;else if(m==='lakes')c=has(p.lakes)||/gol|göl|goller|göller/i.test(clean(p.terrain)+' '+clean(p.rivers))?colors.lakes:colors.neutral;else if(m==='rivers')c=has(p.rivers)&&!/^van golu|^van gölü/i.test(clean(p.rivers))?colors.rivers:colors.neutral;else if(m==='mining')c=has(p.mining)?colors.mining:colors.neutral;el.style.setProperty('--fill',c);el.style.fill=c;el.dataset.mapMode=m;});}
function bind(shell){const tabs=shell.querySelector('.mode-tabs');if(tabs&&!tabs.dataset.v31ColorBound){tabs.dataset.v31ColorBound='1';tabs.addEventListener('click',()=>setTimeout(()=>{const svg=shell.querySelector('.atlas-svg');if(svg)paint(svg)},20))}}
function refresh(){document.querySelectorAll('.atlas-shell').forEach(shell=>{bind(shell);const svg=shell.querySelector('.atlas-svg');if(svg)paint(svg)})}
let t=0;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(refresh,70)}).observe(document.body,{subtree:true,childList:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();
})();
