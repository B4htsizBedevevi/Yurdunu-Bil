/* Yurdunu Bil 44 — province module boundary */
(()=>{'use strict';const r=window.YB44;if(!r)return;const all=()=>Array.isArray(window.PROVINCE_DATA)?window.PROVINCE_DATA:[];r.register('province',{count:()=>all().length,find:name=>{const n=String(name||'').toLocaleLowerCase('tr-TR');return all().find(p=>String(p.name||'').toLocaleLowerCase('tr-TR')===n)||null}});})();
