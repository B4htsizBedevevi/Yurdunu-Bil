"use strict";
const fs=require("fs"),path=require("path"),vm=require("vm");
const root=path.resolve(__dirname,"..");
const context={window:{}};vm.createContext(context);
for(const file of ["data/provinces.js","data/topics.js","data/questions.js","data/questions-v55.js"]){vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),context,{filename:file})}
const provinces=context.window.PROVINCE_DATA||[],topics=context.window.TOPICS||[],questions=context.window.QUESTION_BANK||[];
const topicIds=new Set(topics.map(x=>x.id)),plates=new Set(provinces.map(x=>Number(x.plate))),ids=new Set(),fail=[];
if(provinces.length!==81||plates.size!==81)fail.push(`İl verisi geçersiz: ${provinces.length} il / ${plates.size} benzersiz plaka.`);
if(topics.length!==8||topicIds.size!==8)fail.push(`Konu verisi geçersiz: ${topics.length} konu.`);
if(questions.length<280)fail.push(`Soru bankası yetersiz: ${questions.length} soru.`);
const required=["region","climate","terrain","agriculture","mining","rivers","fact","kpss"];
provinces.forEach((p,i)=>required.forEach(f=>{if(!String(p[f]||"").trim())fail.push(`İl ${i+1} ${p.name}: ${f} boş.`)}));
questions.forEach((q,i)=>{if(ids.has(q.id))fail.push(`Soru ${i+1}: tekrar eden id ${q.id}.`);ids.add(q.id);if(!q.q||!Array.isArray(q.options)||q.options.length!==4)fail.push(`Soru ${i+1}: metin veya 4 seçenek geçersiz.`);if(!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length)fail.push(`Soru ${i+1}: doğru cevap geçersiz.`);if(!topicIds.has(q.topic))fail.push(`Soru ${i+1}: tanımsız konu ${q.topic}.`)});
if(fail.length){console.error("YB DATA VALIDATION FAILED\n- "+fail.join("\n- "));process.exit(1)}
console.log(`YB DATA OK — 81 il — 8 konu — ${questions.length} soru — eski GeoJSON/legacy soru zinciri gerekmiyor.`);