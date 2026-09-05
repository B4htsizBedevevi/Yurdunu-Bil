#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INDEX = path.join(ROOT, 'index.html');
const REQUIRED = [
  'index.html', 'config.js', 'app.js', 'style.css',
  'data/questions.js', 'data/topics.js', 'data/provinces.js'
];

function exists(rel) { return fs.existsSync(path.join(ROOT, rel)); }
function fail(message) { console.error(`✖ ${message}`); process.exitCode = 1; }

if (!exists('index.html')) fail('index.html bulunamadı.');
else {
  const html = fs.readFileSync(INDEX, 'utf8');
  for (const rel of REQUIRED) if (!exists(rel)) fail(`Gerekli dosya eksik: ${rel}`);

  const refs = [];
  for (const m of html.matchAll(/(?:src|href)=["']([^"'#?]+)(?:[?#][^"']*)?["']/gi)) {
    const ref = m[1];
    if (/^(https?:|data:|mailto:|#|\/\/)/i.test(ref)) continue;
    refs.push(ref.replace(/^\.\//, ''));
  }

  const missing = [...new Set(refs)].filter(rel => !exists(rel));
  if (missing.length) {
    console.error('\nEksik yerel asset referansları:');
    missing.forEach(x => console.error(`  - ${x}`));
    console.error('\nindex.html içindeki referansları düzeltmeden production deploy yapılmamalı.');
    process.exitCode = 1;
  }

  if (!/<main[^>]*id=["']?/.test(html) && !html.includes('id="app-shell"')) {
    fail('Uygulama shell işareti bulunamadı.');
  }
}

if (!process.exitCode) console.log('✓ Site yapısı doğrulandı.');
