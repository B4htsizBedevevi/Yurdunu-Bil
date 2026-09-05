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
let html='';
if(exists('index.html')){
 const file=path.join(ROOT,'index.html');html=fs.readFileSync(file,'utf8');
 for(const rel of refs(html,/(?:src|href)=["']([^"'#?]+)(?:[?#][^"']*)?["']/gi))if(!/^(https?:|data:|mailto:|#|\/\/)/i.test(rel)&&!exists(rel))fail(`index.html eksik asset: ${rel}`);
 if(!html.includes('id="app-shell"'))fail('Uygulama shell işareti bulunamadı.');
 const routes=[...new Set((html.match(/data-view=["']([^"']+)["']/g)||[]).map(x=>x.match(/data-view=["']([^"']+)["']/)?.[1]).filter(Boolean))];
 const allowed=new Set(['home','library','arena','events','settings','map']);
 for(const route of routes)if(!allowed.has(route))fail(`index.html bilinmeyen data-view rotası: ${route}`);
 const ids=[...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);const dup=ids.filter((id,i)=>ids.indexOf(id)!==i);for(const id of [...new Set(dup)])fail(`index.html yinelenen id: ${id}`);
}
const cssFiles=[],jsFiles=[];function walk(dir,rx,out){for(const name of fs.readdirSync(dir)){if(['node_modules','.git'].includes(name))continue;const full=path.join(dir,name),st=fs.statSync(full);if(st.isDirectory())walk(full,rx,out);else if(rx.test(name))out.push(full)}}walk(ROOT,/\.css$/i,cssFiles);walk(ROOT,/\.js$/i,jsFiles);
for(const file of cssFiles){const text=fs.readFileSync(file,'utf8');for(const rel of refs(text,/@import\s+(?:url\()?['"]([^'"]+)['"]\)?/gi)){if(/^(https?:|data:|\/\/)/i.test(rel))continue;const resolved=resolveLocal(file,rel);if(!exists(resolved))fail(`${path.relative(ROOT,file)} eksik CSS importu: ${rel}`)}}
for(const file of jsFiles){const r=cp.spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(r.status!==0)fail(`${path.relative(ROOT,file)} JavaScript sözdizimi hatası: ${(r.stderr||r.stdout||'').trim()})`)}
for(const file of jsFiles){if(path.relative(ROOT,file)==='scripts/validate-site.js')continue;const text=fs.readFileSync(file,'utf8');for(const rel of refs(text,/(?:\.src\s*=|import\s*\()\s*["']([^"']+\.js)(?:[?#][^"']*)?["']/g)){if(/^(https?:|\/\/)/i.test(rel))continue;const resolved=resolveLocal(file,rel);if(!exists(resolved))fail(`${path.relative(ROOT,file)} eksik dinamik JS: ${rel}`)}}
if(exists('core/boot.js')){const bootFile=path.join(ROOT,'core/boot.js'),boot=fs.readFileSync(bootFile,'utf8'),m=boot.match(/(?:const\s+coreFiles|const\s+dataFiles)\s*=\s*\[/);if(!m)fail('core/boot.js modül listesi bulunamadı.');else{for(const listMatch of boot.matchAll(/const\s+(?:dataFiles|coreFiles|featureGroups)\s*=\s*([\s\S]*?);\n/g)){for(const rel of refs(listMatch[1],/["']([^"']+\.js)["']/g)){const resolved=resolveLocal(bootFile,rel);if(!exists(resolved))fail(`core/boot.js eksik modül: ${rel}`)}}}}
if(exists('app.js')){const app=fs.readFileSync(path.join(ROOT,'app.js'),'utf8');for(const route of [...app.matchAll(/view-([a-z0-9_-]+)/g)].map(m=>m[1]))if(!html.includes(`id="view-${route}"`))fail(`app.js rota görünümü index.html'de yok: ${route}`);if(!/const\s+labels\s*=/.test(app))fail('app.js route etiketleri bulunamadı.')}
if(exists('features/ui/system-audit.js')){const audit=fs.readFileSync(path.join(ROOT,'features/ui/system-audit.js'),'utf8');for(const route of ['home','library','events','settings'])if(!audit.includes(`'${route}'`))fail(`system-audit.js eksik rota: ${route}`)}
if(exists('features/ui/navigation.js')){const nav=fs.readFileSync(path.join(ROOT,'features/ui/navigation.js'),'utf8');if(!nav.includes("view==='arena'"))fail('navigation.js Arena rotasını yönetmiyor.');if(!nav.includes("view==='map'"))fail('navigation.js harita rotasını yönetmiyor.')}
if(errors){console.error(`\n${errors} doğrulama hatası bulundu.`);process.exitCode=1}else console.log(`✓ Site doğrulandı: ${jsFiles.length} JS + ${cssFiles.length} CSS; yerel bağımlılıklar, boot modülleri, rotalar ve JS sözdizimleri temiz.`);
