#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const config = fs.readFileSync(path.join(ROOT, 'config.js'), 'utf8');

const version = packageJson.version;
const configVersion = (config.match(/APP_VERSION\s*=\s*['"]([^'"]+)/) || [])[1];

if (!version) {
  console.error('✖ package.json sürümü bulunamadı.');
  process.exit(1);
}
if (configVersion && configVersion !== version) {
  console.error(`✖ Sürüm uyuşmazlığı: package.json=${version}, config.js=${configVersion}`);
  process.exit(1);
}

for (const dir of ['scripts', 'data']) {
  if (!fs.existsSync(path.join(ROOT, dir))) {
    console.error(`✖ Release dizini eksik: ${dir}/`);
    process.exit(1);
  }
}

console.log(`✓ Release bütünlüğü: Yurdunu Bil ${version}`);
