#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const checks = [
  ['data/questions.js', /window\.QUESTION_BANK\s*=\s*\[/], 'QUESTION_BANK'],
  ['data/topics.js', /window\.TOPICS\s*=\s*\[/, 'TOPICS'],
  ['data/provinces.js', /(?:window\.)?(?:PROVINCES|provinces)\s*=|export\s+/, 'province data']
];

let failed = false;
for (const [file, pattern, label] of checks) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) {
    console.error(`✖ Eksik veri dosyası: ${file}`);
    failed = true;
    continue;
  }
  const text = fs.readFileSync(full, 'utf8');
  if (!pattern.test(text)) {
    console.error(`✖ ${file}: beklenen ${label} yapısı bulunamadı.`);
    failed = true;
  }
}

const q = path.join(ROOT, 'data/questions.js');
if (fs.existsSync(q)) {
  const text = fs.readFileSync(q, 'utf8');
  const count = (text.match(/\bid\s*:/g) || []).length;
  if (count < 100) console.warn(`⚠ Soru bankası yaklaşık ${count} kayıt içeriyor; içerik genişliği ayrıca gözden geçirilmeli.`);
  else console.log(`✓ Soru bankası kontrolü: yaklaşık ${count}+ kayıt.`);
}

if (failed) process.exitCode = 1;
else console.log('✓ Veri kaynakları doğrulandı.');
