const fs=require('fs');
const path=require('path');
const {execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..');
const fail=[];
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const index=read('index.html');
let release;
try{release=JSON.parse(read('yb-release.json'))}catch(e){fail.push('yb-release.json okunamıyor')}
const version=release?.version||'';
const indexVersion=(index.match(/name="yb-version" content="([^"]+)"/)||[])[1];
if(!version)fail.push('Release version missing');
if(!indexVersion)fail.push('index.html yb-version meta etiketi eksik');
const localRefs=[...index.matchAll(/(?:src|href)="([^"?#]+)(?:\?[^"#]*)?"/g)].map(m=>m[1]).filter(x=>!x.startsWith('http')&&!x.startsWith('//')&&!x.startsWith('#'));
for(const ref of localRefs){if(!fs.existsSync(path.join(root,ref)))fail.push(`Missing asset: ${ref}`)}
const scripts=[...new Set(localRefs.filter(x=>x.endsWith('.js')))];
const extra=['update.js','v45-activity-bridge.js','v46-platform.js'];
const core=['core/runtime.js','core/app.js','core/atlas.js','core/province.js','core/quiz.js','core/library.js','core/stats.js'];
for(const file of [...core,...scripts,...extra]){if(!fs.existsSync(path.join(root,file)))fail.push(`Missing core/script: ${file}`);else try{execFileSync(process.execPath,['--check',path.join(root,file)],{stdio:'pipe'})}catch(e){fail.push(`JS syntax error: ${file}`)}}
if(!index.includes('v44-architecture.js'))fail.push('v44 architecture bridge reference missing');
if(!index.includes('update.js'))fail.push('Runtime updater reference missing');
if(!fs.existsSync(path.join(root,'v46-platform.css')))fail.push('v46-platform.css missing');
if(!index.includes('data-view="events"'))fail.push('Events view missing');
if(!index.includes('data-view="library"'))fail.push('Library navigation missing');
const mobile=(index.match(/<nav class="mobile-nav">([\s\S]*?)<\/nav>/)||[])[1]||'';
if((mobile.match(/data-view="map"/g)||[]).length>0)fail.push('Retired map target still present in static mobile navigation');
try{const g=JSON.parse(read('data/provinces.geojson'));if(!Array.isArray(g.features)||g.features.length!==81)fail.push(`GeoJSON province count is ${g.features?.length}, expected 81`)}catch(e){fail.push('GeoJSON cannot be parsed')}
try{const p=JSON.parse(read('package.json'));if(p.version!=='46.0.0')fail.push(`package version is ${p.version}, expected 46.0.0`)}catch(e){fail.push('package.json cannot be parsed')}
if(fail.length){console.error('YB SITE VALIDATION FAILED');fail.forEach(x=>console.error(' - '+x));process.exit(1)}
console.log(`YB SITE VALIDATION OK — release ${version} — index ${indexVersion} — 81 provinces — v46 platform/bridge syntax valid — retired map target absent`);
