#!/usr/bin/env node
'use strict';
const fs=require('fs');const path=require('path');const cp=require('child_process');
const ROOT=path.resolve(__dirname,'..');let errors=0;
const fail=m=>{console.error(`✖ ${m}`);errors++};const exists=rel=>fs.existsSync(path.join(ROOT,rel));
const normalize=rel=>String(rel||'').split(/[?#]/)[0].replace(/^\.\//,'');
const resolveLocal=(fromFile,ref)=>{const clean=normalize(ref);if(/^(?:data|features|core|app\.js|config\.js|onboarding\.js|notifications\.js|flashcards\.js|leaderboard\.js|effects\.js|v\d)/.test(clean))return path.normalize(clean);return path.normalize(path.join(path.dirname(path.relative(ROOT,fromFile)),clean))};
const REQUIRED=['index.html','config.js','app.js','style.css','data/questions.js','data/topics.js','data/provinces.js','core/runtime.js','core/boot.js'];
for(const rel of REQUIRED)if(!exists(rel))fail(`Gerekli dosya eksik: ${rel}`);
function refs(text,re){const out=[];for(const m of text.matchAll(re))out.push(normalize(m[1]));return out}
if(exists('index.html')){const file=path.join(ROOT,'index.html'),html=fs.readFileSync(file,'utf8');for(const rel of refs(html,/(?:src|href)=["']([^"'#?]+)(?:[?#][^"']*)?["']/gi))if(!/^(https?:|data:|mailto:|#|\/\/)/i.test(rel)&&!exists(rel))fail(`index.html eksik asset: ${rel}`);if(!html.includes('id="app-shell"'))fail('Uygulama shell işareti bulunamadı.')}
const cssFiles=[],jsFiles=[];function walk(dir,rx,out){for(const name of fs.readdirSync(dir)){if(['node_modules','.git'].includes(name))continue;const full=path.join(dir,name),st=fs.statSync(full);if(st.isDirectory())walk(full,rx,out);else if(rx.test(name))out.push(full)}}walk(ROOT,/\.css$/i,cssFiles);walk(ROOT,/\.js$/i,jsFiles);
for(const file of cssFiles){const text=fs.readFileSync(file,'utf8');for(const rel of refs(text,/@import\s+(?:url\()?['"]([^'"]+)['"]\)?/gi)){if(/^(https?:|data:|\/\/)/i.test(rel))continue;const resolved=resolveLocal(file,rel);if(!exists(resolved))fail(`${path.relative(ROOT,file)} eksik CSS importu: ${rel}`)}}
for(const file of jsFiles){const r=cp.spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(r.status!==0)fail(`${path.relative(ROOT,file)} JavaScript sözdizimi hatası: ${(r.stderr||r.stdout||'').trim()}`)}
for(const file of jsFiles){if(path.relative(ROOT,file)==='scripts/validate-site.js')continue;const text=fs.readFileSync(file,'utf8');for(const rel of refs(text,/(?:\.src\s*=|import\s*\()\s*["']([^"']+\.js)(?:[?#][^"']*)?["']/g)){if(/^(https?:|\/\/)/i.test(rel))continue;const resolved=resolveLocal(file,rel);if(!exists(resolved))fail(`${path.relative(ROOT,file)} eksik dinamik JS: ${rel}`)}}
if(errors){console.error(`\n${errors} doğrulama hatası bulundu.`);process.exitCode=1}else console.log(`✓ Site doğrulandı: ${jsFiles.length} JS + ${cssFiles.length} CSS; yerel bağımlılıklar ve JS sözdizimleri temiz.`);