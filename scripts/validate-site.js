const fs=require('fs');
const path=require('path');
const {execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..');
const fail=[];
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const index=read('index.html');
const version=(index.match(/name="yb-version" content="([^"]+)"/)||[])[1];
const release=JSON.parse(read('yb-release.json'));
if(version!==release.version)fail.push(`Version mismatch: index=${version}, release=${release.version}`);
const localRefs=[...index.matchAll(/(?:src|href)="([^"?#]+)(?:\?[^"#]*)?"/g)].map(m=>m[1]).filter(x=>!x.startsWith('http')&&!x.startsWith('//')&&!x.startsWith('#'));
for(const ref of localRefs){if(!fs.existsSync(path.join(root,ref)))fail.push(`Missing asset: ${ref}`)}
const scripts=[...new Set(localRefs.filter(x=>x.endsWith('.js')))];
for(const file of scripts){try{execFileSync(process.execPath,['--check',path.join(root,file)],{stdio:'pipe'})}catch(e){fail.push(`JS syntax error: ${file}`)}}
try{const g=JSON.parse(read('data/provinces.geojson'));if(!Array.isArray(g.features)||g.features.length!==81)fail.push(`GeoJSON province count is ${g.features?.length}, expected 81`)}catch(e){fail.push('GeoJSON cannot be parsed')}
const mobile=(index.match(/<nav class="mobile-nav">([\s\S]*?)<\/nav>/)||[])[1]||'';
const mobileMaps=(mobile.match(/data-view="map"/g)||[]).length;
if(mobileMaps!==1)fail.push(`Mobile nav map target count is ${mobileMaps}, expected 1`);
if(!index.includes('v41-atlas.css?v='+version)||!index.includes('v41-atlas.js?v='+version))fail.push('v41 cache-busting references are not aligned');
if(!index.includes('v44-architecture.css?v='+version)||!index.includes('v44-architecture.js?v='+version))fail.push('v44 architecture references are not aligned');
if(!index.includes('v44-map-engine.js?v='+version))fail.push('v44 map engine reference is missing');
if(!index.includes('data/geo-features-v44.js?v='+version))fail.push('v44 feature data reference is missing');
if(fail.length){console.error('YB SITE VALIDATION FAILED');fail.forEach(x=>console.error(' - '+x));process.exit(1)}
console.log(`YB SITE VALIDATION OK — ${version} — ${scripts.length} JS files — 81 provinces — canonical v44 bridge active`);
