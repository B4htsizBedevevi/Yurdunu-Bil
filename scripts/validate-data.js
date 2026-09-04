"use strict";

/* Yurdunu Bil v31 release check. No network or build tooling required. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.resolve(__dirname, "..");
const context = { window: {} };
vm.createContext(context);
for (const file of ["data/provinces.js", "data/topics.js", "data/questions.js", "data/questions-v30.js", "data/question-topic-fix-v30.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}
const provinces = context.window.PROVINCE_DATA || [];
const topics = context.window.TOPICS || [];
const questions = context.window.QUESTION_BANK || [];
const geojson = JSON.parse(fs.readFileSync(path.join(root, "data/provinces.geojson"), "utf8"));
const topicIds = new Set(topics.map(topic => topic.id));
const plates = new Set(provinces.map(province => Number(province.plate)));
const geoPlates = new Set((geojson.features || []).map(feature => Number(String(feature?.properties?.id || "").replace("TR-P-", ""))));
const failures = [];
if (provinces.length !== 81 || plates.size !== 81) failures.push("İl verisi 81 benzersiz plaka içermiyor.");
if ((geojson.features || []).length !== 81 || geoPlates.size !== 81) failures.push("GeoJSON 81 benzersiz il içermiyor.");
if (topics.length !== 8 || topicIds.size !== 8) failures.push("Konu bankası 8 benzersiz konu içermiyor.");
if (questions.length < 160) failures.push(`Soru bankasında en az 160 soru bulunmalı; bulunan: ${questions.length}.`);
const requiredProvinceFields = ["region", "climate", "terrain", "agriculture", "mining", "rivers", "fact", "kpss"];
provinces.forEach((province, index) => {
  requiredProvinceFields.forEach(field => {
    if (!String(province[field] || "").trim()) failures.push(`İl ${index + 1} ${province.name}: ${field} boş.`);
  });
});
const ids = new Set();
questions.forEach((question, index) => {
  if (ids.has(question.id)) failures.push(`Soru ${index + 1}: tekrar eden id ${question.id}.`);
  ids.add(question.id);
  if (!question.q || !Array.isArray(question.options) || question.options.length !== 4) failures.push(`Soru ${index + 1}: metin veya 4 seçenek geçersiz.`);
  if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer >= question.options.length) failures.push(`Soru ${index + 1}: doğru cevap indisi geçersiz.`);
  if (!topicIds.has(question.topic)) failures.push(`Soru ${index + 1}: tanımsız konu ${question.topic}.`);
});
if (failures.length) { console.error(failures.join("\n")); process.exitCode = 1; }
else console.log(`Doğrulama başarılı: ${provinces.length} il, ${topics.length} konu, ${questions.length} soru, il alanları dolu.`);
