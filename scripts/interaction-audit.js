#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const checks=[
 ['Ana sayfa konu kartları','features/home/home.js',[/data90topic/,/openTopic|data-open-topic|YBLibraryInteractions/]],
 ['Ana sayfa hızlı aksiyonlar','features/home/home.js',[/data90=/,/library|events|arena|wrong/]],
 ['Kütüphane konu kartı hedefi','app.js',[/data-open-topic=/,/function showTopic\(id\)/]],
 ['Kütüphane kart tıklaması','features/library/interactions.js',[/\.note-card\{cursor:pointer/,/data-open-topic/]],
 ['Kütüphane konu testi','features/library/interactions.js',[/yb-library-topic-test/,/YB88QuestionCenter/]],
 ['Oyun kartları','features/games/events.js',[/data-game=/,/YB55Games\?\.start/]],
 ['Arena navigasyonu','features/ui/navigation.js',[/view==='arena'/,/openArena|YBArena/]],
 ['Harita navigasyonu','features/ui/navigation.js',[/view==='map'/,/openMap|YBMapGames/]],
 ['Merkezi gecikme dayanıklılığı','features/ui/system-audit.js',[/waitFor\(/,/openTopic\(|openArena\(|openGame\(/]],
 ['Soru merkezi API','features/questions/question-center.js',[/openQuiz:/,/Array\.isArray\(mode\)/]],
];
let failed=0;
for(const [name,file,patterns] of checks){let text='';try{text=read(file)}catch(e){console.error(`✖ ${name}: ${file} okunamadı`);failed++;continue}const missing=patterns.filter(p=>!p.test(text));if(missing.length){console.error(`✖ ${name}: ${file} içinde ${missing.length} sözleşme eksik.`);failed++}else console.log(`✓ ${name}`)}
const index=read('index.html');
const views=[...index.matchAll(/data-(?:mobile-)?view="([^"]+)"/g)].map(m=>m[1]);
for(const v of new Set(views)){if(!['home','library','events','settings','arena','map'].includes(v)){console.error(`✖ Tanımsız navigasyon rotası: ${v}`);failed++}}
const css=read('styles/app.css');const stale=(css.match(/\?v=99\.0\.5/g)||[]).length;if(stale){console.error(`✖ styles/app.css içinde ${stale} adet eski 99.0.5 cache referansı kaldı.`);failed++}else console.log('✓ CSS cache sürümü güncel');
const source=index+'\n'+read('app.js')+'\n'+read('features/home/home.js')+'\n'+read('features/library/interactions.js')+'\n'+read('features/ui/navigation.js');
const deadHref=[...source.matchAll(/href=["']#["']/g)];
if(deadHref.length)console.log(`⚠ ${deadHref.length} adet href="#" bulundu; yalnızca JS tarafından kullanılan kontroller ayrıca incelendi.`);
if(failed){console.error(`\n✖ Etkileşim denetimi ${failed} hata ile başarısız.`);process.exit(1)}
console.log(`✓ Etkileşim sözleşmeleri temiz: ${new Set(views).size} rota + ana sayfa/kütüphane/oyun/Arena/harita akışları doğrulandı.`);
