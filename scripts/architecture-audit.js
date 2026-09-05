#!/usr/bin/env node
'use strict';

/**
 * Yurdunu Bil — deep architecture/data audit.
 * Dependency-free CI guard for hidden runtime regressions.
 */
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const {execFileSync}=require('child_process');
const ROOT=path.resolve(__dirname,'..');
const failures=[],warnings=[];
const fail=m=>failures.push(`✖ ${m}`),warn=m=>warnings.push(`⚠ ${m}`);
function walk(dir,out=[]){for(const name of fs.readdirSync(dir)){if(name==='.git'||name==='node_modules')continue;const full=path.join(dir,name),st=fs.statSync(full);if(st.isDirectory())walk(full,out);else out.push(path.relative(ROOT,full).replace(/\\/g,'/'))}return out}
const files=walk(ROOT);
const textFiles=files.filter(f=>/\.(?:js|css|html|json|yml|yaml|md|txt)$/.test(f));
const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
const exists=f=>fs.existsSync(path.join(ROOT,f));

/* Boot graph */
if(!exists('core/boot.js'))fail('core/boot.js bulunamadı.');
else{
 const boot=read('core/boot.js');
 const refs=[...boot.matchAll(/['"]((?:data|core|features|onboarding|notifications|flashcards|leaderboard|effects)\/[^'"]+\.js)['"]/g)].map(m=>m[1]);
 const missing=[...new Set(refs)].filter(f=>!exists(f));
 if(missing.length)fail(`Boot grafiğinde eksik modüller: ${missing.join(', ')}`);
 console.log(`✓ Boot grafiği: ${new Set(refs).size} yerel JS modülü doğrulandı.`);
}

/* Security/runtime smell scan. Remote data is allowed; remote executable code is not. */
const activeRoots=new Set(['index.html','app.js','config.js','core','features','data','styles','theme-terra.css','style.css','auth.css','onboarding.css','notifications.css','flashcards.css','leaderboard.css','responsive.css','v100-terra-mobile.css','v72-layout.css','v92-ui-hardening.css','auth-v73.css','v101-ui-controls.css','v102-navigation.css','v103-learning-bridge.css','effects.js']);
const isActive=f=>activeRoots.has(f)||activeRoots.has(f.split('/')[0]);
for(const file of textFiles.filter(isActive)){
 const text=read(file);
 if(/(?:<script[^>]+src\s*=\s*["'`]https?:\/\/|\.src\s*=\s*["'`]https?:\/\/|importScripts\s*\(\s*["'`]https?:\/\/)/i.test(text))fail(`${file}: uzak executable script yükleyicisi bulundu.`);
 if(/(^|[^\w])eval\s*\(|new\s+Function\s*\(/.test(text))fail(`${file}: eval/new Function kullanımı bulundu.`);
 if(/document\.write\s*\(/.test(text))fail(`${file}: document.write kullanımı bulundu.`);
}
console.log('✓ Aktif kaynak güvenlik taraması tamamlandı.');

/* HTML integrity */
if(exists('index.html')){
 const html=read('index.html'),ids=new Map();
 for(const m of html.matchAll(/\bid=["']([^"']+)["']/gi))ids.set(m[1],(ids.get(m[1])||0)+1);
 const dup=[...ids.entries()].filter(([,n])=>n>1).map(([id,n])=>`${id}×${n}`);
 if(dup.length)fail(`index.html duplicate id: ${dup.join(', ')}`);
 const refs=[];for(const m of html.matchAll(/(?:src|href)=["']([^"'#?][^"']*)/gi))refs.push(m[1]);
 const missing=refs.filter(ref=>{if(/^(?:https?:|data:|mailto:|tel:|javascript:)/i.test(ref))return false;const clean=ref.split('?')[0].split('#')[0];return clean&&!exists(clean)});
 if(missing.length)fail(`index.html eksik yerel asset: ${[...new Set(missing)].join(', ')}`);
 console.log(`✓ HTML bütünlüğü: ${ids.size} benzersiz id, ${refs.length} asset referansı.`);
}

/* Deep question-source validation in isolated VMs. */
const questionFiles=files.filter(f=>/^data\/questions(?:-[^/]+)?\.js$/.test(f));
const allQuestions=[],perFile=[];
function sandboxFor(file){
 const window={},noop=()=>{};
 const document={querySelector:()=>null,getElementById:()=>null,createElement:()=>({set src(v){this._src=v},addEventListener:noop}),head:{appendChild:noop},body:{appendChild:noop}};
 const CustomEvent=function(type,init){this.type=type;this.detail=init?.detail};
 const context={window,document,console:{log:noop,warn:noop,error:noop},localStorage:{getItem:()=>null,setItem:noop,removeItem:noop},CustomEvent,setTimeout:noop,clearTimeout:noop,setInterval:noop,clearInterval:noop,URL};
 window.window=window;window.document=document;window.CustomEvent=CustomEvent;window.addEventListener=noop;window.dispatchEvent=noop;
 return vm.createContext(context,{name:file});
}
for(const file of questionFiles){try{const context=sandboxFor(file);new vm.Script(read(file),{filename:file}).runInContext(context,{timeout:1500});const bank=Array.isArray(context.window.QUESTION_BANK)?context.window.QUESTION_BANK:[];perFile.push([file,bank.length]);allQuestions.push(...bank.map(q=>({...q,__source:file})))}catch(error){fail(`${file}: veri paketi çalıştırılamadı — ${error.message}`)}}
const ids=new Map();
const allowedTopics=new Set(['konum','iklim','yerseki','su','nufus','tarim','sanayi','bolgeler','enerji','maden','ulasim','turizm','cevre','afet','dogal-afetler','akarsular','akarsu','goller','harita-bilgisi','harita','toprak','ekonomik','bolge-karsilastirma']);
for(const q of allQuestions){
 const id=String(q?.id??'').trim();
 if(!id)fail(`${q?.__source||'unknown'}: id eksik.`);else ids.set(id,[...(ids.get(id)||[]),q.__source]);
 if(!q||typeof q!=='object'){fail(`${q?.__source||'unknown'}: soru kaydı nesne değil.`);continue}
 if(typeof q.q!=='string'||!q.q.trim())fail(`${q.__source}: ${id||'soru'} soru metni eksik.`);
 if(!Array.isArray(q.options)||q.options.length<2)fail(`${q.__source}: ${id||'soru'} seçenekleri geçersiz.`);
 if(!Number.isInteger(q.answer)||q.answer<0||q.answer>=(Array.isArray(q.options)?q.options.length:0))fail(`${q.__source}: ${id||'soru'} answer index geçersiz.`);
 if(q.topic&&!allowedTopics.has(String(q.topic)))warn(`${q.__source}: ${id||'soru'} bilinmeyen topic '${q.topic}'.`);
 if(q.difficulty&&!['kolay','orta','zor','güncel'].includes(String(q.difficulty)))warn(`${q.__source}: ${id||'soru'} bilinmeyen difficulty '${q.difficulty}'.`);
}
const duplicateIds=[...ids.entries()].filter(([,sources])=>sources.length>1);
if(duplicateIds.length)fail(`Soru ID çakışmaları: ${duplicateIds.slice(0,30).map(([id,s])=>`${id} (${s.join(' + ')})`).join(', ')}${duplicateIds.length>30?' …':''}`);
console.log(`✓ Soru kaynakları: ${questionFiles.length} paket, ${allQuestions.length} ham kayıt.`);
for(const [file,count] of perFile)console.log(`  • ${file}: ${count}`);
if(!duplicateIds.length)console.log('✓ Soru ID bütünlüğü: çakışma yok.');

/* Legacy cleanup candidates. Only files not referenced by the active boot/style graph are reported. */
const legacy=files.filter(f=>/^(?:v\d+[-_].*\.(?:js|css)|auth-v\d+\.css)$/.test(f)||/^data\/questions-v\d+.*\.js$/.test(f));
const graphSources=['index.html','styles/app.css','theme-terra.css','core/boot.js',...files.filter(f=>f.startsWith('core/')||f.startsWith('features/')||f.startsWith('data/')),'app.js','onboarding.js','notifications.js','flashcards.js','leaderboard.js','effects.js'].filter(exists);
const graphText=graphSources.map(read).join('\n');
const orphanLegacy=legacy.filter(file=>!graphText.includes(file));
if(orphanLegacy.length)warn(`Temizlik adayı legacy dosyalar (${orphanLegacy.length}): ${orphanLegacy.slice(0,40).join(', ')}${orphanLegacy.length>40?' …':''}`);

/* Full repository JS syntax pass. */
const jsFiles=files.filter(f=>f.endsWith('.js'));
for(const file of jsFiles){try{execFileSync(process.execPath,['--check',path.join(ROOT,file)],{stdio:'ignore'})}catch{fail(`${file}: Node syntax kontrolü başarısız.`)}}
console.log(`✓ Repo JS syntax taraması: ${jsFiles.length} dosya.`);
if(warnings.length)console.log('\n'+warnings.join('\n'));
if(failures.length){console.error('\n'+failures.join('\n'));process.exitCode=1}else console.log('\n✓ Derin mimari/veri audit temiz.');
