/* Yurdunu Bil 44 — hard geographic clipping + atlas presentation guard */
(()=>{
'use strict';
if(window.__YB44_MAP_ENGINE)return;window.__YB44_MAP_ENGINE=1;
const NS='http://www.w3.org/2000/svg',Q=(s,r=document)=>r.querySelector(s),QA=(s,r=document)=>[...r.querySelectorAll(s)];
const E=(tag,attrs={})=>{const x=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>x.setAttribute(k,v));return x};
function insideAny(svg,x,y){const ps=QA('.yb41-province',svg);for(const p of ps){try{if(p.isPointInFill(new DOMPoint(x,y)))return true}catch{}}return false}
function clip(svg,layer){let defs=Q('defs',svg);if(!defs){defs=E('defs');svg.insertBefore(defs,svg.firstChild)}
QA('clipPath[data-yb44]',defs).forEach(x=>x.remove());
const cp=E('clipPath',{id:'yb44-turkey',clipPathUnits:'userSpaceOnUse','data-yb44':'1','clip-rule':'evenodd'});
QA('.yb41-province',svg).forEach(p=>{const d=p.getAttribute('d');if(!d)return;cp.appendChild(E('path',{d,fill:'#fff'}))});defs.appendChild(cp);
layer.setAttribute('clip-path','url(#yb44-turkey)');layer.style.clipPath='url(#yb44-turkey)';
}
function sanitize(svg,layer){
 QA('.yb41-river',layer).forEach(p=>{try{const len=p.getTotalLength();let ok=0,total=Math.min(18,Math.max(8,Math.floor(len/15)));for(let i=0;i<=total;i++){const q=p.getPointAtLength(len*i/total);if(insideAny(svg,q.x,q.y))ok++}if(ok<Math.max(2,total*.28))p.style.display='none';}catch{}});
 QA('.yb41-lake,.yb41-plain,.yb41-plateau,.yb41-mountain,.yb41-mine',layer).forEach(p=>{try{const b=p.getBBox();if(!insideAny(svg,b.x+b.width/2,b.y+b.height/2))p.style.display='none'}catch{}});
 QA('.yb41-feature-label',layer).forEach(t=>{try{const x=Number(t.getAttribute('x')),y=Number(t.getAttribute('y'));if(!insideAny(svg,x,y))t.style.display='none'}catch{}});
}
function style(){if(Q('#yb44-style'))return;const s=document.createElement('style');s.id='yb44-style';s.textContent=`
.yb41-feature-layer{isolation:isolate}.yb41-feature-layer .yb41-river{filter:drop-shadow(0 0 2px rgba(56,197,239,.35))}.yb41-feature-layer .yb41-lake{filter:drop-shadow(0 2px 3px rgba(20,145,205,.22))}.yb41-feature-layer .yb41-plain,.yb41-feature-layer .yb41-plateau{pointer-events:none}.yb41-feature-label{paint-order:stroke;stroke-width:3px}
@media(max-width:600px){#view-map .yb41-map-wrap{height:clamp(380px,62vh,560px)!important;min-height:380px!important}#view-map .yb41-map-wrap svg{height:100%!important;width:100%!important;min-height:0!important;max-height:none!important}#view-map .yb41-counts span{font-size:8px!important}#view-map .yb41-province-label{font-size:7.4px!important}}
`;document.head.appendChild(s)}
function run(){const svg=Q('#view-map [data-yb41-svg]');if(!svg)return;const layer=Q('.yb41-feature-layer',svg);if(!layer||QA('.yb41-province',svg).length!==81)return;style();clip(svg,layer);sanitize(svg,layer);const nav=Q('.mobile-nav');if(nav){const seen=new Set;QA('button[data-view]',nav).forEach(b=>{const v=b.dataset.view;if(seen.has(v))b.remove();else seen.add(v)})}}
let timer;const obs=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(run,120)});function start(){run();obs.observe(document.body,{childList:true,subtree:true});[300,900,1800].forEach(ms=>setTimeout(run,ms))}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
