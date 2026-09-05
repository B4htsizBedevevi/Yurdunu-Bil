#!/usr/bin/env node
'use strict';

/**
 * Yurdunu Bil — deep architecture/data audit.
 *
 * This is intentionally dependency-free so it can run in CI before deployment.
 * It catches the class of regressions that ordinary syntax checks miss:
 * missing boot assets, duplicate question IDs, malformed question records,
 * broken local asset references, duplicate DOM ids, and unsafe remote/eval code.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const failures = [];
const warnings = [];

const fail = msg => failures.push(`✖ ${msg}`);
const warn = msg => warnings.push(`⚠ ${msg}`);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else out.push(path.relative(ROOT, full).replace(/\\/g, '/'));
  }
  return out;
}

const files = walk(ROOT);
const textFiles = files.filter(f => /\.(?:js|css|html|json|yml|yaml|md|txt)$/.test(f));
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

function exists(file) {
  return fs.existsSync(path.join(ROOT, file));
}

// 1) Boot graph: every explicitly loaded local module must exist exactly where boot expects it.
const bootFile = 'core/boot.js';
if (!exists(bootFile)) {
  fail('core/boot.js bulunamadı.');
} else {
  const boot = read(bootFile);
  const bootRefs = [...boot.matchAll(/['"]((?:data|core|features|onboarding|notifications|flashcards|leaderboard|effects)\/[^'"]+\.js)['"]/g)].map(m => m[1]);
  const missing = [...new Set(bootRefs)].filter(f => !exists(f));
  if (missing.length) fail(`Boot grafiğinde eksik modüller: ${missing.join(', ')}`);
  console.log(`✓ Boot grafiği: ${new Set(bootRefs).size} yerel JS modülü doğrulandı.`);
}

// 2) Static safety scan on active source files. Historical, unreferenced files are reported separately.
const activeRoots = new Set(['index.html', 'app.js', 'config.js', 'core', 'features', 'data', 'onboarding.js', 'notifications.js', 'flashcards.js', 'leaderboard.js', 'effects.js']);
const isActive = file => {
  const top = file.split('/')[0];
  return activeRoots.has(top) || file === 'index.html';
};
for (const file of textFiles.filter(isActive)) {
  const text = read(file);
  if (/raw\.githubusercontent\.com|githubusercontent\.com\//i.test(text)) fail(`${file}: uzak GitHub/harici kod yükleyicisi bulundu.`);
  if (/(^|[^\w])eval\s*\(|new\s+Function\s*\(/.test(text)) fail(`${file}: eval/new Function kullanımı bulundu.`);
  if (/document\.write\s*\(/.test(text)) fail(`${file}: document.write kullanımı bulundu.`);
}
console.log('✓ Aktif kaynak güvenlik taraması tamamlandı.');

// 3) index.html duplicate IDs + local asset existence.
if (exists('index.html')) {
  const html = read('index.html');
  const ids = new Map();
  for (const m of html.matchAll(/\bid=["']([^"']+)["']/gi)) {
    const id = m[1];
    ids.set(id, (ids.get(id) || 0) + 1);
  }
  const duplicates = [...ids.entries()].filter(([, count]) => count > 1).map(([id, count]) => `${id}×${count}`);
  if (duplicates.length) fail(`index.html duplicate id: ${duplicates.join(', ')}`);

  const refs = [];
  for (const m of html.matchAll(/(?:src|href)=["']([^"'#?][^"']*)/gi)) refs.push(m[1]);
  const missing = refs.filter(ref => {
    if (/^(?:https?:|data:|mailto:|tel:|javascript:)/i.test(ref)) return false;
    const clean = ref.split('?')[0].split('#')[0];
    return clean && !exists(clean);
  });
  if (missing.length) fail(`index.html eksik yerel asset: ${[...new Set(missing)].join(', ')}`);
  console.log(`✓ HTML bütünlüğü: ${ids.size} benzersiz id, ${refs.length} asset referansı.`);
}

// 4) Deep question-source validation. Each question pack is executed in an isolated VM so
// malformed records are found before question-pool silently drops them.
const questionFiles = files.filter(f => /^data\/questions(?:-[^/]+)?\.js$/.test(f));
const allQuestions = [];
const perFile = [];

function sandboxFor(file) {
  const window = {};
  const noop = () => {};
  const document = {
    querySelector: () => null,
    getElementById: () => null,
    createElement: () => ({ set src(v) { this._src = v; }, addEventListener: noop }),
    head: { appendChild: noop },
    body: { appendChild: noop },
  };
  const context = {
    window,
    document,
    console: { log: noop, warn: noop, error: noop },
    localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
    CustomEvent: function CustomEvent(type, init) { this.type = type; this.detail = init?.detail; },
    setTimeout: noop,
    clearTimeout: noop,
    setInterval: noop,
    clearInterval: noop,
    URL,
  };
  window.window = window;
  window.document = document;
  window.CustomEvent = context.CustomEvent;
  window.addEventListener = noop;
  window.dispatchEvent = noop;
  return vm.createContext(context, { name: file });
}

for (const file of questionFiles) {
  try {
    const source = read(file);
    const context = sandboxFor(file);
    new vm.Script(source, { filename: file }).runInContext(context, { timeout: 1500 });
    const bank = Array.isArray(context.window.QUESTION_BANK) ? context.window.QUESTION_BANK : [];
    perFile.push([file, bank.length]);
    allQuestions.push(...bank.map(q => ({ ...q, __source: file })));
  } catch (error) {
    fail(`${file}: veri paketi çalıştırılamadı — ${error.message}`);
  }
}

const ids = new Map();
const allowedTopics = new Set(['konum', 'iklim', 'yerseki', 'su', 'nufus', 'tarim', 'sanayi', 'bolgeler', 'enerji', 'maden', 'ulasim', 'turizm', 'cevre', 'afet', 'dogal-afetler', 'akarsular']);
for (const q of allQuestions) {
  const id = String(q?.id ?? '').trim();
  if (!id) fail(`${q.__source}: id eksik.`);
  else ids.set(id, [...(ids.get(id) || []), q.__source]);

  if (!q || typeof q !== 'object') { fail(`${q?.__source || 'unknown'}: soru kaydı nesne değil.`); continue; }
  if (typeof q.q !== 'string' || !q.q.trim()) fail(`${q.__source}: ${id || 'soru'} soru metni eksik.`);
  if (!Array.isArray(q.options) || q.options.length < 2) fail(`${q.__source}: ${id || 'soru'} seçenekleri geçersiz.`);
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (Array.isArray(q.options) ? q.options.length : 0)) fail(`${q.__source}: ${id || 'soru'} answer index geçersiz.`);
  if (q.topic && !allowedTopics.has(String(q.topic))) warn(`${q.__source}: ${id || 'soru'} bilinmeyen topic '${q.topic}' — normalizer alias'ına bırakıldı.`);
  if (q.difficulty && !['kolay', 'orta', 'zor'].includes(String(q.difficulty))) warn(`${q.__source}: ${id || 'soru'} bilinmeyen difficulty '${q.difficulty}'.`);
}

const duplicateIds = [...ids.entries()].filter(([, sources]) => sources.length > 1);
if (duplicateIds.length) {
  fail(`Soru ID çakışmaları: ${duplicateIds.slice(0, 30).map(([id, sources]) => `${id} (${sources.join(' + ')})`).join(', ')}${duplicateIds.length > 30 ? ' …' : ''}`);
}

const total = allQuestions.length;
console.log(`✓ Soru kaynakları: ${questionFiles.length} paket, ${total} ham kayıt.`);
for (const [file, count] of perFile) console.log(`  • ${file}: ${count}`);
if (!duplicateIds.length) console.log('✓ Soru ID bütünlüğü: çakışma yok.');

// 5) Warn about versioned files which are not in the active boot/style graph. They are cleanup
// candidates, not CI failures, because a historical asset may still be intentionally referenced.
const legacy = files.filter(f => /^(?:v\d+[-_].*\.(?:js|css)|auth-v\d+\.css)$/.test(f) || /^data\/questions-v\d+.*\.js$/.test(f));
const graphText = textFiles.filter(isActive).map(read).join('\n');
const orphanLegacy = legacy.filter(file => !graphText.includes(file));
if (orphanLegacy.length) {
  warn(`Temizlik adayı legacy dosyalar (${orphanLegacy.length}): ${orphanLegacy.slice(0, 40).join(', ')}${orphanLegacy.length > 40 ? ' …' : ''}`);
}

// 6) Run Node's parser on every JS file once more. This complements production-smoke and catches
// files that are not loaded by the boot graph.
const jsFiles = files.filter(f => f.endsWith('.js'));
for (const file of jsFiles) {
  try { execFileSync(process.execPath, ['--check', path.join(ROOT, file)], { stdio: 'ignore' }); }
  catch { fail(`${file}: Node syntax kontrolü başarısız.`); }
}
console.log(`✓ Repo JS syntax taraması: ${jsFiles.length} dosya.`);

if (warnings.length) {
  console.log('\n' + warnings.join('\n'));
}
if (failures.length) {
  console.error('\n' + failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('\n✓ Derin mimari/veri audit temiz.');
}
