#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const jsFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.js')) jsFiles.push(full);
  }
}
walk(ROOT);

let failed = false;
for (const file of jsFiles) {
  const r = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (r.status !== 0) {
    console.error(`✖ JavaScript syntax hatası: ${path.relative(ROOT, file)}`);
    if (r.stderr) console.error(r.stderr.trim());
    failed = true;
  }
}

for (const rel of ['index.html', 'config.js', 'app.js', 'style.css']) {
  if (!fs.existsSync(path.join(ROOT, rel))) {
    console.error(`✖ Production çekirdeği eksik: ${rel}`);
    failed = true;
  }
}

if (!failed) console.log(`✓ Production smoke: ${jsFiles.length} JavaScript dosyası syntax kontrolünden geçti.`);
else process.exitCode = 1;
