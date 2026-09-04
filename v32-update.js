/* Yurdunu Bil 40 — legacy-compatible updater bridge */
(()=>{
'use strict';
if(window.YBCheckUpdate)return;
const CURRENT='40.0.0';
async function check(){try{const r=await fetch('yb-release.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)return;const d=await r.json();if(String(d.version||CURRENT)!==CURRENT){const n=document.createElement('div');n.textContent='Yeni Yurdunu Bil sürümü hazır: '+d.version;document.body.appendChild(n)}}catch{}}
window.addEventListener('load',check,{once:true});
})();
