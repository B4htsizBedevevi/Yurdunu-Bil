#!/usr/bin/env node
'use strict';

const fs=require('fs');
const path=require('path');
const cp=require('child_process');
const ROOT=path.resolve(__dirname,'..');
const REQUIRED=['index.html','config.js','app.js','style.css','data/questions.js','data/topics.js','data/provinces.js','core/runtime.js','core/boot.js'];
let errors=0;
const fail=m=>{console.error(`✖ ${m}`);errors++};
const exists=rel=>fs.existsSync(path.join(ROOT,rel));
const normalize=rel=>String(rel||'').replace(/^\.\//,'').split(/[?#]/)[0];

for(const rel of REQUIRED)if(!exists(rel))fail(`Gerekli dosya eksik: ${rel}`);

function localRefsFromText(text,regex){const out=[];for(const m of text.matchAll(regex)){const ref=normalize(m[1]);if(!ref||/^(https?:|data:|mailto:|#|\/\/)/i.test(ref))continue;out.push(ref)}return out}

if(exists('index.html')){
 const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
 const refs=localRefsFromText(html,/(?:src|href)=["']([^"'#?]+)(?:[?#][^"']*)?["']/gi);
 for(const rel of [...new Set(refs)])if(!exists(rel))fail(`index.html eksik asset: ${rel}`);
 if(!html.includes('id="app-shell"')&&!/<main[^>]*id=["']/.test(html))fail('Uygulama shell işareti bulunamadı.');
}

// Validate every local CSS @import. Broken imports silently degrade the UI and are easy to miss in browser smoke tests.
const cssFiles=[];
function walk(dir){for(const name of fs.readdirSync(dir)){if(['node_modules','.git'].includes(name))continue;const full=path.join(dir,name),st=fs.statSync(full);if(st.isDirectory())walk(full);else if(/\.css$/i.test(name))cssFiles.push(full)}}
walk(ROOT);
for(const file of cssFiles){const text=fs.readFileSync(file,'utf8');for(const rel0 of localRefsFromText(text,/@import\s+(?:url\()?['"]([^'"]+)['"]\)?/gi)){const rel=path.normalize(path.join(path.dirname(path.relative(ROOT,file)),rel0));if(!exists(rel))fail(`${path.relative(ROOT,file)} eksik CSS importu: ${rel0}`)}}

// Syntax-check all JavaScript files. This catches parse crashes before deployment.
const jsFiles=[];function walkJs(dir){for(const name of fs.readdirSync(dir)){if(['node_modules','.git'].includes(name))continue;const full=path.join(dir,name),st=fs.statSync(full);if(st.isDirectory())walkJs(full);else if(/\.js$/i.test(name))jsFiles.push(full)}}walkJs(ROOT);
for(const file of jsFiles){const r=cp.spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(r.status!==0)fail(`${path.relative(ROOT,file)} JavaScript sözdizimi hatası: ${(r.stderr||r.stdout||'').trim()}`)}

// Detect local dynamic script references (s.src = 'foo.js', import('foo.js'), etc.).
for(const file of jsFiles){const text=fs.readFileSync(file,'utf8');for(const rel0 of localRefsFromText(text,/(?:\.src\s*=|import\s*\()\s*["']([^"']+\.js)(?:[?#][^"']*)?["']/g)){const rel=normalize(rel0);const resolved=path.normalize(path.join(path.dirname(path.relative(ROOT,file)),rel));if(!exists(resolved))fail(`${path.relative(ROOT,file)} eksik dinamik JS: ${rel0}`)}}

if(errors){console.error(`\n${errors} doğrulama hatası bulundu.`);process.exitCode=1}else console.log(`✓ Site doğrulandı: ${jsFiles.length} JS + ${cssFiles.length} CSS dosyası, yerel bağımlılık ve sözdizimi kontrolleri temiz.`);