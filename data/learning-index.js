/* Yurdunu Bil — 2026 öğrenme indeks katmanı */
(()=>{'use strict';
const T={
konum:[['Matematik konum','Enlem, boylam ve bunların sonuçları'],['Özel konum','Kıtalar, denizler, boğazlar ve stratejik konum'],['Enlem sonuçları','Sıcaklık, güneş açısı, gece-gündüz süreleri'],['Boylam sonuçları','Yerel saat ve güneşin doğuş-batış farkları'],['Harita bilgisi','Ölçek, yön, koordinat ve konum okuma']],
iklim:[['Karadeniz iklimi','Yağış rejimi, sıcaklık ve orman örtüsü'],['Akdeniz iklimi','Yaz kuraklığı, maki ve kıyı kuşağı'],['Karasal iklim','Sıcaklık farkı, step ve yağış rejimi'],['Yükselti etkisi','Sıcaklığın yükseltiyle değişmesi'],['İklim-günlük yaşam','Tarım, yerleşme ve ulaşım üzerindeki etkiler']],
yerseki:[['Dağlar','Kuzey Anadolu, Toroslar ve başlıca volkanik dağlar'],['Platolar','Erzurum-Kars, Bozok, Cihanbeyli ve Teke'],['Ovalar','Çukurova, Bafra, Çarşamba, Konya ve diğerleri'],['Karstik şekiller','Obruk, traverten, mağara ve karstik ovalar'],['Tektonik şekiller','Horst, graben, fay ve depremsellik']],
su:[['Akarsular','Kızılırmak, Fırat, Dicle, Sakarya ve havzalar'],['Akarsu rejimi','Yağış ve kar erimelerinin rejime etkisi'],['Göller','Van, Tuz, Beyşehir, Eğirdir ve oluşum türleri'],['Barajlar ve HES','GAP, Keban, Atatürk ve enerji üretimi'],['Kapalı havzalar','Van ve Tuz Gölü çevresindeki drenaj özellikleri']],
nufus:[['Nüfus dağılışı','Doğal ve beşerî faktörler'],['Yoğunluk','Üretim, ulaşım ve yerleşme ilişkisi'],['İç göç','Kır-kent ve doğu-batı göç dinamikleri'],['Kentleşme','Sanayi ve hizmetlerin şehirleşmeye etkileri'],['Yerleşme tipleri','Kır, kent, toplu ve dağınık yerleşmeler']],
tarim:[['Tahıllar','Buğday, arpa, çavdar ve bölgesel dağılış'],['Endüstri bitkileri','Pamuk, tütün, şeker pancarı ve ayçiçeği'],['Meyvecilik','Fındık, üzüm, zeytin, turunçgiller ve incir'],['Hayvancılık','Büyükbaş, küçükbaş, arıcılık ve mera ilişkisi'],['Ormancılık','Orman bölgeleri ve ekonomik kullanım']],
sanayi:[['Madenler','Bor, krom, demir, bakır ve taş kömürü'],['Enerji kaynakları','HES, linyit, jeotermal ve doğal gaz'],['Sanayi bölgeleri','Marmara, Ege, İç Anadolu ve diğer merkezler'],['Hammadde-pazar','Sanayi kuruluş yeri faktörleri'],['Ulaşım-sanayi','Liman, demiryolu ve karayolu bağlantıları']],
bolgeler:[['Marmara','Nüfus, sanayi, ulaşım ve geçiş özelliği'],['Ege','Tarım, kıyı turizmi ve graben ovaları'],['Akdeniz','Turizm, seracılık ve Toroslar'],['Karadeniz','Orman, yağış, fındık-çay ve yaylacılık'],['İç Anadolu','Bozkır, tahıl, ova ve plato'],['Doğu Anadolu','Yükselti, sert karasal iklim ve hayvancılık'],['Güneydoğu Anadolu','GAP, tarım ve sıcaklık koşulları'],['Türkiye turizmi','Kıyı, kültür, doğa, termal ve kış turizmi']]
};
const topicNames={konum:'Coğrafi Konum',iklim:'İklim ve Bitki Örtüsü',yerseki:'Yerşekilleri',su:'Su Kaynakları',nufus:'Nüfus ve Yerleşme',tarim:'Tarım ve Hayvancılık',sanayi:'Madenler ve Sanayi',bolgeler:'Bölgeler ve Turizm'};
const subtopics=Object.fromEntries(Object.entries(T).map(([topic,rows])=>[topic,rows.map(([name,desc],i)=>({id:`${topic}-${i+1}`,name,desc,topic,title:topicNames[topic]}))]));
window.YBLearningIndex={version:'2026.3',topics:T,topicNames,subtopics,totalSubtopics:Object.values(T).reduce((n,a)=>n+a.length,0)};
if(!window.__YB104_LOADER__){window.__YB104_LOADER__=true;const s=document.createElement('script');s.src='v104-library-deep-study.js?v=104.0.0';s.defer=true;document.head.appendChild(s)}
if(!window.__YB105_LOADER__){window.__YB105_LOADER__=true;const s=document.createElement('script');s.src='v105-library-subtopic-hook.js?v=105.0.0';s.defer=true;document.head.appendChild(s)}
})();
