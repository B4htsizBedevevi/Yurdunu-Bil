#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..');
const files=['v55-loader.js','v63-core.js','v64-learning.js','v64-learning2.js','v64-arena2.js','arena-v1.js'];
const fail=[];
for(const f of files){const p=path.join(root,f);if(!fs.existsSync(p)){fail.push(`missing ${f}`);continue}try{execFileSync(process.execPath,['--check',p],{stdio:'pipe'})}catch(e){fail.push(`syntax ${f}`)}}
const loader=fs.readFileSync(path.join(root,'v55-loader.js'),'utf8');
for(const f of ['v64-learning.js','v64-learning2.js','v64-arena2.js'])if(!loader.includes(`/${f}?`))fail.push(`loader missing ${f}`);
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
if(/data-view=["']map["']/.test(index))fail.push('map navigation resurrected');
if(fail.length){console.error('PRODUCTION SMOKE FAILED\n- '+fail.join('\n- '));process.exit(1)}
console.log('PRODUCTION SMOKE OK — loader, adaptive learning, Arena modules and map retirement validated.');
