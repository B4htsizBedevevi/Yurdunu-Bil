/**
 * Yurdunu Bil 55 — genişletilmiş KPSS coğrafya soru havuzu
 * 120 ek soru • mevcut QUESTION_BANK'a eklenir • benzersiz id
 */
(()=>{'use strict';
const extra = [
  {
    "id": "v55-konum-001",
    "topic": "konum",
    "q": "Türkiye'nin en güneyinde yer alan il aşağıdakilerden hangisidir?",
    "options": ["Hatay", "Antalya", "Mersin", "Adana"],
    "answer": 0,
    "explain": "Doğru cevap: Hatay. Türkiye'nin güney sınırının en güney kesiminde Hatay bulunur.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-konum-002",
    "topic": "konum",
    "q": "Türkiye'nin kuzey-güney genişliği yaklaşık kaç kilometredir?",
    "options": ["420", "666", "900", "1.200"],
    "answer": 1,
    "explain": "Doğru cevap: 666 km. Türkiye'nin 36°-42° kuzey paralelleri arasındaki kuzey-güney genişliği yaklaşık 666 km'dir.",
    "difficulty": "orta"
  },
  {
    "id": "v55-konum-003",
    "topic": "konum",
    "q": "Türkiye'nin doğusu ile batısı arasında yerel saat farkının oluşmasının temel nedeni nedir?",
    "options": ["Enlem farkı", "Boylam farkı", "Yükselti farkı", "İklim farkı"],
    "answer": 1,
    "explain": "Doğru cevap: Boylam farkı. Yerel saat farkı meridyenler arasındaki farktan kaynaklanır.",
    "difficulty": "zor"
  },
  {
    "id": "v55-konum-004",
    "topic": "konum",
    "q": "Türkiye hangi iki yarım kürede yer alır?",
    "options": ["Kuzey ve Doğu", "Kuzey ve Batı", "Güney ve Doğu", "Güney ve Batı"],
    "answer": 0,
    "explain": "Doğru cevap: Kuzey ve Doğu. Türkiye Ekvator'un kuzeyinde ve Greenwich'in doğusunda bulunur.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-konum-005",
    "topic": "konum",
    "q": "Türkiye'nin üç tarafının denizlerle çevrili olması aşağıdakilerden hangisinin sonucudur?",
    "options": ["Özel konum", "Matematik konum", "Mutlak konum", "Jeolojik yaş"],
    "answer": 0,
    "explain": "Doğru cevap: Özel konum. Denizlere göre konum Türkiye'nin özel konum özelliklerindendir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-konum-006",
    "topic": "konum",
    "q": "Türkiye'nin Asya ile Avrupa arasında köprü konumunda olması hangi konum özelliğiyle ilgilidir?",
    "options": ["Matematik", "Özel", "Astronomik", "İklimsel"],
    "answer": 1,
    "explain": "Doğru cevap: Özel. Kıtalar arasındaki konum ve ulaşım koridorları özel konumla ilgilidir.",
    "difficulty": "orta"
  },
  {
    "id": "v55-konum-007",
    "topic": "konum",
    "q": "Türkiye'de doğuya gidildikçe yerel saat nasıl değişir?",
    "options": ["Geri kalır", "Değişmez", "İlerler", "Önce geri sonra ilerler"],
    "answer": 2,
    "explain": "Doğru cevap: İlerler. Doğuya gidildikçe Güneş'in görünür hareketi ve yerel saat ilerler.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-konum-008",
    "topic": "konum",
    "q": "Aşağıdakilerden hangisi Türkiye'nin özel konumunun sonuçlarından biridir?",
    "options": ["Dört mevsimin belirgin yaşanması", "Meridyen farkına bağlı saat farkı", "Enerji koridoru olması", "Güneş ışınlarının hiçbir zaman dik gelmemesi"],
    "answer": 2,
    "explain": "Doğru cevap: Enerji koridoru olması. Türkiye'nin kıtalar ve enerji havzaları arasındaki konumu bunu destekler.",
    "difficulty": "zor"
  },
  {
    "id": "v55-konum-009",
    "topic": "konum",
    "q": "Türkiye'nin Avrupa kıtasındaki topraklarına verilen ad nedir?",
    "options": ["Anadolu", "Trakya", "Kilikya", "Mezopotamya"],
    "answer": 1,
    "explain": "Doğru cevap: Trakya. Türkiye'nin Avrupa'daki toprakları Doğu Trakya olarak adlandırılır.",
    "difficulty": "orta"
  },
  {
    "id": "v55-konum-010",
    "topic": "konum",
    "q": "Türkiye'nin Asya kıtasındaki topraklarına verilen ad nedir?",
    "options": ["Trakya", "Anadolu", "Rumeli", "Makedonya"],
    "answer": 1,
    "explain": "Doğru cevap: Anadolu. Türkiye topraklarının büyük bölümü Asya kıtasındaki Anadolu'dadır.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-konum-011",
    "topic": "konum",
    "q": "Türkiye'nin orta kuşakta bulunmasının sonuçlarından biri hangisidir?",
    "options": ["Batı rüzgarlarının etkili olması", "Güneşin yılda iki kez dik gelmesi", "Kutup gecelerinin yaşanması", "Musonların yıl boyu egemen olması"],
    "answer": 0,
    "explain": "Doğru cevap: Batı rüzgarlarının etkili olması. Orta kuşakta batı rüzgarları ve mevsimlerin belirginliği görülür.",
    "difficulty": "zor"
  },
  {
    "id": "v55-konum-012",
    "topic": "konum",
    "q": "Türkiye'nin doğu-batı yönünde genişlemesi aşağıdakilerden hangisini doğrudan artırır?",
    "options": ["Yerel saat farkını", "Yıllık sıcaklık farkını", "Bitki çeşitliliğini", "Yağış miktarını"],
    "answer": 0,
    "explain": "Doğru cevap: Yerel saat farkını. Doğu-batı yönündeki meridyen farkı yerel saat farkını belirler.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-iklim-013",
    "topic": "iklim",
    "q": "Karadeniz ikliminin doğal bitki örtüsü aşağıdakilerden hangisidir?",
    "options": ["Maki", "Bozkır", "Orman", "Çöl"],
    "answer": 2,
    "explain": "Doğru cevap: Orman. Nem ve yağışın fazla olması Karadeniz kıyılarında ormanları destekler.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-iklim-014",
    "topic": "iklim",
    "q": "Akdeniz ikliminde yaz kuraklığının temel nedeni aşağıdakilerden hangisidir?",
    "options": ["Dinamik yüksek basınç", "Kutup rüzgarları", "Muson alçak basıncı", "Sürekli cephe yağışları"],
    "answer": 0,
    "explain": "Doğru cevap: Dinamik yüksek basınç. Yazın subtropikal yüksek basınç etkisi yağış oluşumunu sınırlar.",
    "difficulty": "zor"
  },
  {
    "id": "v55-iklim-015",
    "topic": "iklim",
    "q": "Karasal iklimde yıllık sıcaklık farkının fazla olmasının temel nedenlerinden biri hangisidir?",
    "options": ["Deniz etkisinin zayıf olması", "Nem oranının çok yüksek olması", "Okyanus akıntıları", "Kıyıların girintili çıkıntılı olması"],
    "answer": 0,
    "explain": "Doğru cevap: Deniz etkisinin zayıf olması. Karasal alanlarda denizlerin sıcaklık düzenleyici etkisi azdır.",
    "difficulty": "orta"
  },
  {
    "id": "v55-iklim-016",
    "topic": "iklim",
    "q": "Karadeniz kıyılarında yağışın fazla olmasında aşağıdakilerden hangisi etkilidir?",
    "options": ["Dağların kıyıya paralel uzanması", "Çöl rüzgarları", "Yükseltinin sıfır olması", "Yaz kuraklığı"],
    "answer": 0,
    "explain": "Doğru cevap: Dağların kıyıya paralel uzanması. Nemli havanın yükselmesi orografik yağışları artırır.",
    "difficulty": "orta"
  },
  {
    "id": "v55-iklim-017",
    "topic": "iklim",
    "q": "Akdeniz ikliminin tipik doğal bitki örtüsü aşağıdakilerden hangisidir?",
    "options": ["Maki", "Tundra", "Bozkır", "Çayır"],
    "answer": 0,
    "explain": "Doğru cevap: Maki. Yaz kuraklığına dayanıklı çalı toplulukları Akdeniz ikliminin karakteristik bitkisidir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-iklim-018",
    "topic": "iklim",
    "q": "İç Anadolu'da ilkbahar yağışlarının fazla olması aşağıdakilerden hangisini destekler?",
    "options": ["Tahıl tarımını", "Çay tarımını", "Muz yetiştiriciliğini", "Turunçgil üretimini"],
    "answer": 0,
    "explain": "Doğru cevap: Tahıl tarımını. İç Anadolu'nun karasal koşulları ve ilkbahar yağışları tahıl tarımı için uygundur.",
    "difficulty": "orta"
  },
  {
    "id": "v55-iklim-019",
    "topic": "iklim",
    "q": "Doğu Anadolu'da kışların uzun ve sert geçmesinde en önemli etkenlerden biri hangisidir?",
    "options": ["Yükseltinin fazla olması", "Deniz etkisinin güçlü olması", "Enlemin çok düşük olması", "Nemliliğin sürekli yüksek olması"],
    "answer": 0,
    "explain": "Doğru cevap: Yükseltinin fazla olması. Yüksek platolar sıcaklıkların düşmesine ve kışların uzamasına neden olur.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-iklim-020",
    "topic": "iklim",
    "q": "Marmara'da farklı iklim özelliklerinin görülmesinde en çok hangi faktör etkilidir?",
    "options": ["Geçiş konumunda bulunması", "Ekvatora yakınlık", "Muson sistemi", "Çöl kuşağı"],
    "answer": 0,
    "explain": "Doğru cevap: Geçiş konumunda bulunması. Marmara farklı denizlerin ve iklim bölgelerinin etkilerini alır.",
    "difficulty": "orta"
  },
  {
    "id": "v55-iklim-021",
    "topic": "iklim",
    "q": "Türkiye'de sıcaklık genel olarak hangi yöne gidildikçe artar?",
    "options": ["Kuzeye", "Güneye", "Doğuya", "Batıya"],
    "answer": 1,
    "explain": "Doğru cevap: Güneye. Türkiye Kuzey Yarım Küre'de olduğundan güneye gidildikçe enlem küçülür ve sıcaklık genel olarak artar.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-iklim-022",
    "topic": "iklim",
    "q": "Yükselti arttıkça sıcaklığın azalması aşağıdakilerden hangisinin sonucudur?",
    "options": ["Atmosferin alt katmanlarının ısınma biçiminin", "Boylamın değişmesinin", "Denizlerin tuzluluğunun", "Gün uzunluğunun"],
    "answer": 0,
    "explain": "Doğru cevap: Atmosferin alt katmanlarının ısınma biçimi. Atmosfer büyük ölçüde yer yüzeyinden ısındığı için yükseldikçe sıcaklık azalır.",
    "difficulty": "zor"
  },
  {
    "id": "v55-iklim-023",
    "topic": "iklim",
    "q": "Karasal iklimin doğal bitki örtüsü aşağıdakilerden hangisidir?",
    "options": ["Bozkır", "Maki", "Gür orman", "Mangrov"],
    "answer": 0,
    "explain": "Doğru cevap: Bozkır. Yağışın sınırlı olduğu karasal alanlarda otsu step toplulukları yaygındır.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-iklim-024",
    "topic": "iklim",
    "q": "Türkiye'de en düşük sıcaklıkların görülme olasılığı en yüksek alanlardan biri hangisidir?",
    "options": ["Erzurum-Kars çevresi", "Çukurova", "Menteşe", "Kıyı Ege"],
    "answer": 0,
    "explain": "Doğru cevap: Erzurum-Kars çevresi. Yükseklik ve karasal koşullar kış sıcaklıklarının çok düşmesine yol açar.",
    "difficulty": "orta"
  },
  {
    "id": "v55-yerseki-025",
    "topic": "yerseki",
    "q": "Türkiye'de delta ovalarının oluşumunda aşağıdakilerden hangisi temel etkendir?",
    "options": ["Akarsuların taşıdığı alüvyonları biriktirmesi", "Buzulların aşındırması", "Rüzgarların kayaları eritmesi", "Volkanik lavların denize akması"],
    "answer": 0,
    "explain": "Doğru cevap: Akarsuların taşıdığı alüvyonları biriktirmesi. Delta ovaları akarsu biriktirmesiyle oluşan kıyı düzlükleridir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-yerseki-026",
    "topic": "yerseki",
    "q": "Bafra Ovası'nı oluşturan akarsu hangisidir?",
    "options": ["Kızılırmak", "Yeşilırmak", "Sakarya", "Meriç"],
    "answer": 0,
    "explain": "Doğru cevap: Kızılırmak. Kızılırmak'ın Karadeniz kıyısındaki delta ovası Bafra Ovası'dır.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-yerseki-027",
    "topic": "yerseki",
    "q": "Çarşamba Ovası'nı oluşturan akarsu hangisidir?",
    "options": ["Yeşilırmak", "Kızılırmak", "Gediz", "Büyük Menderes"],
    "answer": 0,
    "explain": "Doğru cevap: Yeşilırmak. Yeşilırmak'ın Karadeniz'e ulaştığı deltada Çarşamba Ovası gelişmiştir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-yerseki-028",
    "topic": "yerseki",
    "q": "Gediz, Küçük Menderes ve Büyük Menderes ovalarının ortak özelliği nedir?",
    "options": ["Graben alanlarında gelişmeleri", "Volkanik lavlarla oluşmaları", "Buzul vadileri olmaları", "Karstik polye olmaları"],
    "answer": 0,
    "explain": "Doğru cevap: Graben alanlarında gelişmeleri. Batı Anadolu'daki kırıklı yapı geniş çöküntü ovalarının oluşmasını sağlamıştır.",
    "difficulty": "orta"
  },
  {
    "id": "v55-yerseki-029",
    "topic": "yerseki",
    "q": "Türkiye'de karstik şekillerin yaygın olduğu alanların başında hangisi gelir?",
    "options": ["Toroslar", "Yıldız Dağları", "Ergene Havzası", "Kars Platosu"],
    "answer": 0,
    "explain": "Doğru cevap: Toroslar. Kireç taşlarının yaygınlığı ve çözünme süreçleri Toroslar'da karstik şekilleri artırır.",
    "difficulty": "orta"
  },
  {
    "id": "v55-yerseki-030",
    "topic": "yerseki",
    "q": "Obrukların oluşumunda en etkili kayaç grubu hangisidir?",
    "options": ["Kireç taşı gibi çözünebilen kayaçlar", "Granit", "Bazalt", "Gnays"],
    "answer": 0,
    "explain": "Doğru cevap: Kireç taşı gibi çözünebilen kayaçlar. Yer altı boşluklarının büyümesi tavan çökmelerine yol açabilir.",
    "difficulty": "zor"
  },
  {
    "id": "v55-yerseki-031",
    "topic": "yerseki",
    "q": "Pamukkale travertenlerinin oluşumunda hangi süreç belirleyicidir?",
    "options": ["Kalsiyum karbonatlı suların çökelmesi", "Buzulların birikmesi", "Rüzgar aşındırması", "Lav akıntıları"],
    "answer": 0,
    "explain": "Doğru cevap: Kalsiyum karbonatlı suların çökelmesi. Sıcak su kaynaklarının taşıdığı mineraller travertenleri oluşturur.",
    "difficulty": "orta"
  },
  {
    "id": "v55-yerseki-032",
    "topic": "yerseki",
    "q": "Türkiye'nin en yüksek zirvesi aşağıdakilerden hangisidir?",
    "options": ["Ağrı Dağı", "Erciyes", "Kaçkar", "Süphan"],
    "answer": 0,
    "explain": "Doğru cevap: Ağrı Dağı. Zirvesi yaklaşık 5.137 metre ile Türkiye'nin en yüksek noktasıdır.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-yerseki-033",
    "topic": "yerseki",
    "q": "Uludağ hangi dağ türüne örnek olarak gösterilebilir?",
    "options": ["Kıvrım dağları", "Volkanik koni", "Karstik plato", "Delta tepesi"],
    "answer": 0,
    "explain": "Doğru cevap: Kıvrım dağları. Uludağ, Marmara'nın güneyindeki önemli yükseltilerden biridir.",
    "difficulty": "orta"
  },
  {
    "id": "v55-yerseki-034",
    "topic": "yerseki",
    "q": "Kuzey Anadolu Dağları'nın kıyıya paralel uzanmasının sonuçlarından biri hangisidir?",
    "options": ["Kıyı ile iç kesimler arasında ulaşımın zorlaşması", "Kıyı yağışlarının tamamen bitmesi", "Akarsu boylarının kısalması", "Depremlerin ortadan kalkması"],
    "answer": 0,
    "explain": "Doğru cevap: Kıyı ile iç kesimler arasında ulaşımın zorlaşması. Dağların paralel uzanması doğal bir engel oluşturur.",
    "difficulty": "orta"
  },
  {
    "id": "v55-yerseki-035",
    "topic": "yerseki",
    "q": "Toroslar'ın kıyıya paralel uzanması aşağıdakilerden hangisini artırır?",
    "options": ["Akdeniz kıyıları ile iç kesimler arasındaki yükselti farkını", "Kıyı ovalarının sayısını sınırsız artırmayı", "Karadeniz yağışlarını", "Marmara'nın nüfusunu"],
    "answer": 0,
    "explain": "Doğru cevap: Akdeniz kıyıları ile iç kesimler arasındaki yükselti farkını. Toroslar kıyı ile iç kesim arasında güçlü bir relief engeli oluşturur.",
    "difficulty": "zor"
  },
  {
    "id": "v55-yerseki-036",
    "topic": "yerseki",
    "q": "Fırat ve Dicle hangi denize ulaşan havzanın başlıca akarsularıdır?",
    "options": ["Basra Körfezi", "Karadeniz", "Ege Denizi", "Marmara Denizi"],
    "answer": 0,
    "explain": "Doğru cevap: Basra Körfezi. Fırat ve Dicle birleşik bir havza üzerinden Basra Körfezi'ne ulaşır.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-akarsu-037",
    "topic": "akarsu",
    "q": "Türkiye'nin en uzun akarsuyu hangisidir?",
    "options": ["Kızılırmak", "Fırat", "Dicle", "Sakarya"],
    "answer": 0,
    "explain": "Doğru cevap: Kızılırmak. Türkiye sınırları içinde doğup yine Türkiye'de denize ulaşan en uzun akarsudur.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-akarsu-038",
    "topic": "akarsu",
    "q": "Fırat Nehri'nin Türkiye'deki önemli kollarından biri hangisidir?",
    "options": ["Karasu", "Gediz", "Meriç", "Bakırçay"],
    "answer": 0,
    "explain": "Doğru cevap: Karasu. Karasu, Fırat sisteminin Türkiye'deki önemli kaynak kollarındandır.",
    "difficulty": "orta"
  },
  {
    "id": "v55-akarsu-039",
    "topic": "akarsu",
    "q": "Sakarya Nehri hangi denize dökülür?",
    "options": ["Karadeniz", "Ege Denizi", "Akdeniz", "Marmara Denizi"],
    "answer": 0,
    "explain": "Doğru cevap: Karadeniz. Sakarya Nehri kuzey yönünde ilerleyerek Karadeniz'e ulaşır.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-akarsu-040",
    "topic": "akarsu",
    "q": "Meriç Nehri hangi denize dökülür?",
    "options": ["Ege Denizi", "Karadeniz", "Akdeniz", "Marmara Denizi"],
    "answer": 0,
    "explain": "Doğru cevap: Ege Denizi. Meriç, Edirne çevresinden geçerek Ege Denizi'ne ulaşır.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-akarsu-041",
    "topic": "akarsu",
    "q": "Türkiye akarsularının rejimlerinin genellikle düzensiz olmasının temel nedeni hangisidir?",
    "options": ["Yağışın mevsimlere göre değişmesi", "Gelgitin çok güçlü olması", "Akarsuların çok kısa olması", "Deniz seviyesinin sabit kalması"],
    "answer": 0,
    "explain": "Doğru cevap: Yağışın mevsimlere göre değişmesi. Yağış rejimindeki değişiklik akarsu debilerinin yıl içinde farklılaşmasına yol açar.",
    "difficulty": "orta"
  },
  {
    "id": "v55-akarsu-042",
    "topic": "akarsu",
    "q": "Türkiye akarsularının hidroelektrik potansiyelini artıran önemli özellik hangisidir?",
    "options": ["Yatak eğimlerinin fazla olması", "Debilerinin yıl boyu aynı olması", "Tamamının uzun olması", "Gelgit etkisinin güçlü olması"],
    "answer": 0,
    "explain": "Doğru cevap: Yatak eğimlerinin fazla olması. Eğim, akarsuyun enerji üretimi için kullanılabilir potansiyelini artırır.",
    "difficulty": "zor"
  },
  {
    "id": "v55-akarsu-043",
    "topic": "akarsu",
    "q": "Dicle Nehri'nin önemli kollarından biri aşağıdakilerden hangisidir?",
    "options": ["Batman Çayı", "Gediz", "Göksu", "Meriç"],
    "answer": 0,
    "explain": "Doğru cevap: Batman Çayı. Batman Çayı Dicle havzasının önemli kollarındandır.",
    "difficulty": "orta"
  },
  {
    "id": "v55-akarsu-044",
    "topic": "akarsu",
    "q": "Çoruh Nehri hangi denize ulaşır?",
    "options": ["Karadeniz", "Ege Denizi", "Akdeniz", "Marmara Denizi"],
    "answer": 0,
    "explain": "Doğru cevap: Karadeniz. Çoruh Türkiye'nin kuzeydoğusundan akarak Gürcistan üzerinden Karadeniz'e ulaşır.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-akarsu-045",
    "topic": "akarsu",
    "q": "Türkiye'deki akarsuların çoğunda ulaşımın gelişmemesinin nedenlerinden biri hangisidir?",
    "options": ["Yataklarının eğimli ve rejimlerinin düzensiz olması", "Denizlere çok uzak olmaları", "Sularının tamamen tuzlu olması", "Hepsinin yer altından akması"],
    "answer": 0,
    "explain": "Doğru cevap: Yataklarının eğimli ve rejimlerinin düzensiz olması. Bu özellikler düzenli ve güvenli akarsu taşımacılığını sınırlar.",
    "difficulty": "zor"
  },
  {
    "id": "v55-akarsu-046",
    "topic": "akarsu",
    "q": "Akarsuyun taşıdığı malzemeyi biriktirmesiyle aşağıdakilerden hangisi oluşabilir?",
    "options": ["Delta ovası", "Kanyon", "Şelale", "Dev kazanı"],
    "answer": 0,
    "explain": "Doğru cevap: Delta ovası. Akarsuyun taşıdığı alüvyonların uygun kıyı koşullarında birikmesi delta oluşturur.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-akarsu-047",
    "topic": "akarsu",
    "q": "Akarsu yatağının eğiminin azalması aşağıdakilerden hangisini artırır?",
    "options": ["Birikme", "Aşındırma", "Yatak eğimi", "Akış hızının zorunlu olarak artması"],
    "answer": 0,
    "explain": "Doğru cevap: Birikme. Eğim ve akış hızı azaldığında taşınan malzemenin çökelme ihtimali artar.",
    "difficulty": "orta"
  },
  {
    "id": "v55-akarsu-048",
    "topic": "akarsu",
    "q": "Fırat ve Dicle nehirleri Türkiye'nin hangi bölgesinden doğar?",
    "options": ["Doğu Anadolu", "Ege", "Marmara", "Karadeniz"],
    "answer": 0,
    "explain": "Doğru cevap: Doğu Anadolu. Fırat ve Dicle'nin kaynak kolları Doğu Anadolu'nun yüksek alanlarında bulunur.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-goller-049",
    "topic": "goller",
    "q": "Türkiye'nin yüz ölçümü bakımından en büyük gölü hangisidir?",
    "options": ["Van Gölü", "Tuz Gölü", "Beyşehir Gölü", "Eğirdir Gölü"],
    "answer": 0,
    "explain": "Doğru cevap: Van Gölü. Van Gölü yüz ölçümü bakımından Türkiye'nin en büyük gölüdür.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-goller-050",
    "topic": "goller",
    "q": "Tuz Gölü'nün su seviyesinin mevsimsel olarak değişmesinde aşağıdakilerden hangisi etkilidir?",
    "options": ["Yağış-buharlaşma dengesinin değişmesi", "Gelgitin güçlü olması", "Buzulların erimesi", "Okyanus akıntıları"],
    "answer": 0,
    "explain": "Doğru cevap: Yağış-buharlaşma dengesinin değişmesi. Kurak iklim koşullarında buharlaşma su seviyesini güçlü biçimde etkiler.",
    "difficulty": "orta"
  },
  {
    "id": "v55-goller-051",
    "topic": "goller",
    "q": "Beyşehir Gölü hangi bölgededir?",
    "options": ["Akdeniz", "Marmara", "Karadeniz", "Güneydoğu Anadolu"],
    "answer": 0,
    "explain": "Doğru cevap: Akdeniz. Beyşehir Gölü, Göller Yöresi içinde yer alır.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-goller-052",
    "topic": "goller",
    "q": "Eğirdir Gölü hangi il sınırları içinde yer alır?",
    "options": ["Isparta", "Burdur", "Konya", "Antalya"],
    "answer": 0,
    "explain": "Doğru cevap: Isparta. Eğirdir Gölü Göller Yöresi'nde Isparta sınırları içindedir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-goller-053",
    "topic": "goller",
    "q": "Van Gölü'nün suyu hangi özelliğe sahiptir?",
    "options": ["Sodalı ve tuzlu", "Tatlı", "Tamamen asidik", "Deniz suyu ile birebir aynı"],
    "answer": 0,
    "explain": "Doğru cevap: Sodalı ve tuzlu. Van Gölü kapalı havzada yer alan sodalı bir göldür.",
    "difficulty": "orta"
  },
  {
    "id": "v55-goller-054",
    "topic": "goller",
    "q": "Nemrut Krater Gölü hangi ilde bulunur?",
    "options": ["Bitlis", "Van", "Ağrı", "Muş"],
    "answer": 0,
    "explain": "Doğru cevap: Bitlis. Nemrut Krater Gölü, Nemrut Dağı'nın volkanik kraterinde yer alır.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-goller-055",
    "topic": "goller",
    "q": "İznik Gölü hangi bölgede yer alır?",
    "options": ["Marmara", "Ege", "Karadeniz", "İç Anadolu"],
    "answer": 0,
    "explain": "Doğru cevap: Marmara. İznik Gölü Bursa çevresindeki önemli tektonik göllerden biridir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-goller-056",
    "topic": "goller",
    "q": "Sapanca Gölü hangi iki il arasında yer alır?",
    "options": ["Sakarya-Kocaeli", "Bursa-Balıkesir", "Ankara-Çankırı", "İzmir-Manisa"],
    "answer": 0,
    "explain": "Doğru cevap: Sakarya-Kocaeli. Sapanca Gölü Marmara Bölgesi'nin doğu kesiminde bulunur.",
    "difficulty": "orta"
  },
  {
    "id": "v55-goller-057",
    "topic": "goller",
    "q": "Türkiye'deki göllerin oluşumunda aşağıdakilerden hangisi etkili olabilir?",
    "options": ["Tektonizma", "Yalnızca gelgit", "Yalnızca mercan resifleri", "Yalnızca okyanus akıntıları"],
    "answer": 0,
    "explain": "Doğru cevap: Tektonizma. Türkiye'deki göller tektonik, volkanik, karstik ve diğer süreçlerle oluşabilir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-goller-058",
    "topic": "goller",
    "q": "Tortum Gölü hangi ilde bulunur?",
    "options": ["Erzurum", "Artvin", "Rize", "Kars"],
    "answer": 0,
    "explain": "Doğru cevap: Erzurum. Tortum Gölü, Tortum Çayı vadisindeki heyelan seti oluşumlarından biridir.",
    "difficulty": "orta"
  },
  {
    "id": "v55-goller-059",
    "topic": "goller",
    "q": "Salda Gölü hangi il sınırları içindedir?",
    "options": ["Burdur", "Isparta", "Denizli", "Muğla"],
    "answer": 0,
    "explain": "Doğru cevap: Burdur. Salda Gölü Burdur'un Yeşilova ilçesi çevresindedir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-goller-060",
    "topic": "goller",
    "q": "Akşehir ve Eber gölleri hangi bölgenin batı kesiminde yer alır?",
    "options": ["İç Anadolu", "Marmara", "Doğu Anadolu", "Karadeniz"],
    "answer": 0,
    "explain": "Doğru cevap: İç Anadolu. Akşehir ve Eber gölleri İç Anadolu'nun batı kesiminde bulunur.",
    "difficulty": "orta"
  },
  {
    "id": "v55-nufus-061",
    "topic": "nufus",
    "q": "Türkiye'de nüfus yoğunluğunun en yüksek olduğu bölge hangisidir?",
    "options": ["Marmara", "Doğu Anadolu", "Karadeniz", "Akdeniz"],
    "answer": 0,
    "explain": "Doğru cevap: Marmara. Sanayi, ticaret, ulaşım ve büyük şehirler bölgenin nüfus yoğunluğunu yükseltir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-nufus-062",
    "topic": "nufus",
    "q": "Nüfusun kıyı ovalarında yoğunlaşmasının nedenlerinden biri hangisidir?",
    "options": ["Tarım ve ulaşım koşullarının elverişli olması", "Yükseltinin çok fazla olması", "Kışların çok sert olması", "Su kaynaklarının hiç bulunmaması"],
    "answer": 0,
    "explain": "Doğru cevap: Tarım ve ulaşım koşullarının elverişli olması. Düz ve verimli alanlar yerleşmeyi destekler.",
    "difficulty": "orta"
  },
  {
    "id": "v55-nufus-063",
    "topic": "nufus",
    "q": "Doğu Anadolu'da nüfus yoğunluğunun düşük olmasında hangisi etkilidir?",
    "options": ["Yükselti ve engebeliliğin fazla olması", "Sanayinin çok gelişmiş olması", "Kıyı ovalarının geniş olması", "Kışların ılık geçmesi"],
    "answer": 0,
    "explain": "Doğru cevap: Yükselti ve engebeliliğin fazla olması. Fiziki koşullar tarım ve yerleşme alanlarını sınırlar.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-nufus-064",
    "topic": "nufus",
    "q": "Türkiye'de iç göçün önemli nedenlerinden biri hangisidir?",
    "options": ["İş olanaklarının dağılımı", "Güneş tutulmaları", "Boylam farkı", "Gelgit"],
    "answer": 0,
    "explain": "Doğru cevap: İş olanaklarının dağılımı. Eğitim, sağlık ve istihdam imkanları iç göçte önemli rol oynar.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-nufus-065",
    "topic": "nufus",
    "q": "Sanayi faaliyetlerinin yoğun olduğu alanlar genellikle neyi çeker?",
    "options": ["Nüfusu", "Buzulları", "Volkanları", "Delta oluşumunu"],
    "answer": 0,
    "explain": "Doğru cevap: Nüfusu. Sanayi tesisleri iş olanakları oluşturarak nüfusu kendine çekebilir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-nufus-066",
    "topic": "nufus",
    "q": "Kırsal nüfusun tarımla geçimini sürdürdüğü yerlerde aşağıdakilerden hangisi daha belirgindir?",
    "options": ["Tarım sektörünün payı", "Ağır sanayi", "Deniz ticareti", "Havacılık"],
    "answer": 0,
    "explain": "Doğru cevap: Tarım sektörünün payı. Ekonomik faaliyetlerin dağılışı yerleşme özelliklerini etkiler.",
    "difficulty": "orta"
  },
  {
    "id": "v55-nufus-067",
    "topic": "nufus",
    "q": "Türkiye'de büyükşehirlerin çevresinde nüfusun artmasında aşağıdakilerden hangisi etkilidir?",
    "options": ["İş ve hizmet imkanlarının çeşitliliği", "Yükseltinin artması", "Kışların sertleşmesi", "Tarım alanlarının tamamen yok olması"],
    "answer": 0,
    "explain": "Doğru cevap: İş ve hizmet imkanlarının çeşitliliği. Büyük merkezler çevresinde ekonomik ve sosyal çekim oluşturur.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-nufus-068",
    "topic": "nufus",
    "q": "Nüfus yoğunluğu ile nüfus miktarı arasındaki fark nedir?",
    "options": ["Yoğunluk alana düşen nüfusu ifade eder", "İkisi tamamen aynıdır", "Yoğunluk yalnızca şehir nüfusudur", "Nüfus miktarı yalnızca kırsalı ifade eder"],
    "answer": 0,
    "explain": "Doğru cevap: Yoğunluk alana düşen nüfusu ifade eder. Nüfus miktarı toplam kişi sayısını, yoğunluk ise alanla ilişkili dağılışı gösterir.",
    "difficulty": "orta"
  },
  {
    "id": "v55-nufus-069",
    "topic": "nufus",
    "q": "Turizm merkezlerinde mevsimsel nüfus artışının temel nedeni nedir?",
    "options": ["Geçici ziyaretçi ve çalışan hareketliliği", "Boylam farkı", "Deprem kuşakları", "Karstik aşınım"],
    "answer": 0,
    "explain": "Doğru cevap: Geçici ziyaretçi ve çalışan hareketliliği. Turizm sezonunda nüfus geçici olarak artabilir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-nufus-070",
    "topic": "nufus",
    "q": "Türkiye'de nüfusun dağılışını etkileyen doğal faktörlerden biri hangisidir?",
    "options": ["İklim", "Sanayi tesisi", "Ulaşım yatırımı", "Turizm politikası"],
    "answer": 0,
    "explain": "Doğru cevap: İklim. İklim tarım, su, yerleşme ve yaşam koşullarını etkileyen temel doğal faktörlerdendir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-nufus-071",
    "topic": "nufus",
    "q": "Nüfusun seyrek olduğu yüksek dağlık alanlarda aşağıdakilerden hangisi genellikle sınırlıdır?",
    "options": ["Yerleşme ve tarım imkanları", "Yükselti", "Eğim", "Kar örtüsü"],
    "answer": 0,
    "explain": "Doğru cevap: Yerleşme ve tarım imkanları. Yüksek eğim ve sert iklim koşulları yerleşmeyi zorlaştırır.",
    "difficulty": "orta"
  },
  {
    "id": "v55-nufus-072",
    "topic": "nufus",
    "q": "Çukurova'nın yoğun nüfuslanmasında aşağıdakilerden hangisi birlikte etkilidir?",
    "options": ["Verimli tarım alanları ve gelişmiş ulaşım", "Sert kış ve yüksek yükselti", "Çöl iklimi ve kuraklık", "Buzul şekilleri"],
    "answer": 0,
    "explain": "Doğru cevap: Verimli tarım alanları ve gelişmiş ulaşım. Çukurova'nın geniş ovası ekonomik faaliyetleri destekler.",
    "difficulty": "zor"
  },
  {
    "id": "v55-tarim-073",
    "topic": "tarim",
    "q": "Türkiye'de çay tarımının en önemli merkezi hangi ildir?",
    "options": ["Rize", "Konya", "Şanlıurfa", "Manisa"],
    "answer": 0,
    "explain": "Doğru cevap: Rize. Doğu Karadeniz'in yağışlı ve nemli koşulları çay tarımını destekler.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-tarim-074",
    "topic": "tarim",
    "q": "Türkiye'de fındık üretiminde hangi bölge öne çıkar?",
    "options": ["Karadeniz", "Güneydoğu Anadolu", "İç Anadolu", "Doğu Anadolu"],
    "answer": 0,
    "explain": "Doğru cevap: Karadeniz. Nemli iklim ve uygun yamaç koşulları fındık üretimini destekler.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-tarim-075",
    "topic": "tarim",
    "q": "Zeytin üretiminde aşağıdaki bölgelerden hangisi öne çıkar?",
    "options": ["Ege", "Doğu Anadolu", "İç Anadolu", "Güneydoğu Anadolu"],
    "answer": 0,
    "explain": "Doğru cevap: Ege. Özellikle kıyı Ege, zeytin üretiminin önemli merkezlerindendir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-tarim-076",
    "topic": "tarim",
    "q": "Üzüm üretiminde Türkiye'nin önemli merkezlerinden biri hangisidir?",
    "options": ["Manisa", "Rize", "Kars", "Artvin"],
    "answer": 0,
    "explain": "Doğru cevap: Manisa. Gediz Havzası çevresi üzüm üretimiyle öne çıkar.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-tarim-077",
    "topic": "tarim",
    "q": "Pamuk tarımının yaygınlaşmasını destekleyen temel koşul hangisidir?",
    "options": ["Sıcaklık ve sulama imkanları", "Sert kışlar", "Yüksek dağlık alanlar", "Yıl boyu don"],
    "answer": 0,
    "explain": "Doğru cevap: Sıcaklık ve sulama imkanları. Pamuk uzun ve sıcak yetişme dönemi ile yeterli su ister.",
    "difficulty": "orta"
  },
  {
    "id": "v55-tarim-078",
    "topic": "tarim",
    "q": "Güneydoğu Anadolu Projesi'nin tarıma en önemli katkılarından biri hangisidir?",
    "options": ["Sulanan tarım alanlarını artırması", "Kış sıcaklıklarını yükseltmesi", "Dağları alçaltması", "Deniz ulaşımını geliştirmesi"],
    "answer": 0,
    "explain": "Doğru cevap: Sulanan tarım alanlarını artırması. Baraj ve sulama yatırımları tarımsal üretim kapasitesini yükseltir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-tarim-079",
    "topic": "tarim",
    "q": "Buğday Türkiye'de özellikle hangi iklim koşullarında yaygın olarak yetiştirilir?",
    "options": ["Karasal", "Tropikal", "Ekvatoral", "Muson"],
    "answer": 0,
    "explain": "Doğru cevap: Karasal. Buğday, Türkiye'nin iç kesimlerindeki karasal koşullara iyi uyum sağlar.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-tarim-080",
    "topic": "tarim",
    "q": "Muz tarımı Türkiye'de en çok hangi kıyı kuşağında yoğunlaşır?",
    "options": ["Anamur-Alanya çevresi", "Sinop-Samsun çevresi", "Tekirdağ-Edirne çevresi", "Kars-Ardahan çevresi"],
    "answer": 0,
    "explain": "Doğru cevap: Anamur-Alanya çevresi. Akdeniz kıyılarındaki ılık kış koşulları muz yetiştiriciliğine uygundur.",
    "difficulty": "orta"
  },
  {
    "id": "v55-tarim-081",
    "topic": "tarim",
    "q": "Ayçiçeği üretiminde Türkiye'de hangi alan öne çıkar?",
    "options": ["Trakya", "Teke Yöresi", "Hakkari çevresi", "Doğu Karadeniz"],
    "answer": 0,
    "explain": "Doğru cevap: Trakya. Ergene Havzası ve çevresi ayçiçeği üretiminde önemli bir merkezdir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-tarim-082",
    "topic": "tarim",
    "q": "Şeker pancarı üretiminde aşağıdakilerden hangisi önemlidir?",
    "options": ["Sulama ve uygun sıcaklık koşulları", "Tropikal nem", "Yıl boyu yüksek sıcaklık", "Tuzlu deniz suyu"],
    "answer": 0,
    "explain": "Doğru cevap: Sulama ve uygun sıcaklık koşulları. Şeker pancarı farklı iç bölgelerde sulama desteğiyle yetiştirilebilir.",
    "difficulty": "orta"
  },
  {
    "id": "v55-tarim-083",
    "topic": "tarim",
    "q": "Antep fıstığı üretiminde hangi alan öne çıkar?",
    "options": ["Gaziantep-Şanlıurfa çevresi", "Rize-Artvin çevresi", "Edirne-Kırklareli çevresi", "Bursa-Kocaeli çevresi"],
    "answer": 0,
    "explain": "Doğru cevap: Gaziantep-Şanlıurfa çevresi. Sıcak ve nispeten kurak koşullar Antep fıstığı için uygundur.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-tarim-084",
    "topic": "tarim",
    "q": "İncir üretiminde Türkiye'nin en önemli merkezi hangisidir?",
    "options": ["Aydın", "Kars", "Rize", "Nevşehir"],
    "answer": 0,
    "explain": "Doğru cevap: Aydın. Büyük Menderes Havzası çevresi incir üretimiyle öne çıkar.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-maden-085",
    "topic": "maden",
    "q": "Türkiye'de taş kömürü denince ilk akla gelen il hangisidir?",
    "options": ["Zonguldak", "Batman", "Artvin", "Konya"],
    "answer": 0,
    "explain": "Doğru cevap: Zonguldak. Batı Karadeniz taş kömürü havzasının başlıca merkezidir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-maden-086",
    "topic": "maden",
    "q": "Bor minerallerinin Türkiye'deki başlıca kullanım alanlarından biri hangisidir?",
    "options": ["Cam ve seramik sanayisi", "Balıkçılık", "Deniz taşımacılığı", "Orman işletmeciliği"],
    "answer": 0,
    "explain": "Doğru cevap: Cam ve seramik sanayisi. Bor bileşikleri birçok sanayi alanında kullanılmaktadır.",
    "difficulty": "orta"
  },
  {
    "id": "v55-maden-087",
    "topic": "maden",
    "q": "Türkiye'nin önemli bor yataklarından biri hangi il çevresindedir?",
    "options": ["Eskişehir", "Rize", "Mardin", "Sinop"],
    "answer": 0,
    "explain": "Doğru cevap: Eskişehir. Kırka çevresi Türkiye'nin önemli bor yataklarından biridir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-maden-088",
    "topic": "maden",
    "q": "Petrol üretimiyle öne çıkan Güneydoğu Anadolu ili hangisidir?",
    "options": ["Batman", "Rize", "Edirne", "Bolu"],
    "answer": 0,
    "explain": "Doğru cevap: Batman. Güneydoğu Anadolu'da petrol üretimiyle tanınan önemli merkezdir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-maden-089",
    "topic": "maden",
    "q": "Krom yatakları açısından zengin alanlardan biri hangisidir?",
    "options": ["Elazığ-Guleman", "Rize-Hopa", "Edirne-Keşan", "Sinop-Gerze"],
    "answer": 0,
    "explain": "Doğru cevap: Elazığ-Guleman. Guleman krom yataklarıyla bilinen önemli bir madencilik alanıdır.",
    "difficulty": "orta"
  },
  {
    "id": "v55-maden-090",
    "topic": "maden",
    "q": "Demir cevheri üretiminde önemli merkezlerden biri hangisidir?",
    "options": ["Sivas-Divriği", "Rize-Çayeli", "Muğla-Bodrum", "Edirne-Uzunköprü"],
    "answer": 0,
    "explain": "Doğru cevap: Sivas-Divriği. Divriği, Türkiye'nin önemli demir cevheri merkezlerindendir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-maden-091",
    "topic": "maden",
    "q": "Linyit Türkiye'de hangi amaçla yaygın olarak kullanılır?",
    "options": ["Termik santrallerde yakıt", "Camın hammaddesi", "Gübre olarak", "Tekstil lifi olarak"],
    "answer": 0,
    "explain": "Doğru cevap: Termik santrallerde yakıt. Linyit düşük kaliteli kömür olmakla birlikte elektrik üretiminde kullanılır.",
    "difficulty": "orta"
  },
  {
    "id": "v55-maden-092",
    "topic": "maden",
    "q": "Mermer üretimiyle öne çıkan bölgelerden biri hangisidir?",
    "options": ["Marmara ve Ege", "Doğu Karadeniz", "Kars Platosu", "Hakkari Dağları"],
    "answer": 0,
    "explain": "Doğru cevap: Marmara ve Ege. Türkiye'nin farklı kesimlerinde mermer yatakları bulunsa da bu bölgeler önemli üretim alanlarıdır.",
    "difficulty": "orta"
  },
  {
    "id": "v55-maden-093",
    "topic": "maden",
    "q": "Bakır madeni çıkarımında önemli merkezlerden biri hangisidir?",
    "options": ["Artvin-Murgul", "Konya-Cihanbeyli", "Aydın-Söke", "Edirne-İpsala"],
    "answer": 0,
    "explain": "Doğru cevap: Artvin-Murgul. Murgul, bakır madenciliğiyle tanınan merkezlerden biridir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-maden-094",
    "topic": "maden",
    "q": "Zonguldak'taki taş kömürünün çıkarılmasının temel ekonomik sonucu hangisidir?",
    "options": ["Demir-çelik sanayisine hammadde sağlaması", "Çay tarımını artırması", "Turizmi bitirmesi", "Pamuk üretimini doğrudan artırması"],
    "answer": 0,
    "explain": "Doğru cevap: Demir-çelik sanayisine hammadde sağlaması. Taş kömürü özellikle kok kömürü üretimi yoluyla demir-çelikte önemlidir.",
    "difficulty": "zor"
  },
  {
    "id": "v55-maden-095",
    "topic": "maden",
    "q": "Jeotermal enerji potansiyeli Türkiye'de özellikle hangi bölgede yüksektir?",
    "options": ["Ege", "Doğu Anadolu", "Karadeniz", "Güneydoğu Anadolu"],
    "answer": 0,
    "explain": "Doğru cevap: Ege. Fay hatlarının yoğunluğu ve yer içi sıcaklığın yüzeye yakın olması jeotermal kaynakları destekler.",
    "difficulty": "orta"
  },
  {
    "id": "v55-maden-096",
    "topic": "maden",
    "q": "Türkiye'de tuz üretimiyle öne çıkan göllerden biri hangisidir?",
    "options": ["Tuz Gölü", "Van Gölü", "İznik Gölü", "Sapanca Gölü"],
    "answer": 0,
    "explain": "Doğru cevap: Tuz Gölü. Kurak koşullar ve yüksek buharlaşma tuz birikimini destekler.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-sanayi-097",
    "topic": "sanayi",
    "q": "Türkiye'de sanayinin en yoğun olduğu bölge hangisidir?",
    "options": ["Marmara", "Doğu Anadolu", "Karadeniz", "Güneydoğu Anadolu"],
    "answer": 0,
    "explain": "Doğru cevap: Marmara. Pazar, ulaşım, sermaye ve iş gücü olanakları sanayiyi yoğunlaştırmıştır.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-sanayi-098",
    "topic": "sanayi",
    "q": "İstanbul ve çevresinde sanayinin gelişmesinde hangisi önemli rol oynar?",
    "options": ["Pazar, ulaşım ve sermaye olanakları", "Yükseltinin çok fazla olması", "Tarım nüfusunun tamamen kırsalda kalması", "Kışların çok sert olması"],
    "answer": 0,
    "explain": "Doğru cevap: Pazar, ulaşım ve sermaye olanakları. Büyük şehir çevresindeki ekonomik ağ sanayiyi destekler.",
    "difficulty": "orta"
  },
  {
    "id": "v55-sanayi-099",
    "topic": "sanayi",
    "q": "İzmit-Körfez çevresinde hangi sanayi dalı özellikle gelişmiştir?",
    "options": ["Petrokimya", "Çay işleme", "Balık konservesi dışında hiçbir faaliyet", "Halı dokuma"],
    "answer": 0,
    "explain": "Doğru cevap: Petrokimya. Körfez çevresindeki rafineri ve petrokimya yatırımları bu sanayi kolunu güçlendirmiştir.",
    "difficulty": "orta"
  },
  {
    "id": "v55-sanayi-100",
    "topic": "sanayi",
    "q": "Bursa hangi sanayi dalıyla güçlü biçimde ilişkilidir?",
    "options": ["Otomotiv ve tekstil", "Taş kömürü", "Petrol çıkarımı", "Çay işleme"],
    "answer": 0,
    "explain": "Doğru cevap: Otomotiv ve tekstil. Bursa Türkiye'nin önemli otomotiv ve tekstil üretim merkezlerinden biridir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-sanayi-101",
    "topic": "sanayi",
    "q": "Türkiye'de demir-çelik sanayisinin önemli merkezlerinden biri hangisidir?",
    "options": ["İskenderun", "Rize", "Aydın", "Nevşehir"],
    "answer": 0,
    "explain": "Doğru cevap: İskenderun. Liman ve ulaşım olanakları demir-çelik sanayisini desteklemiştir.",
    "difficulty": "orta"
  },
  {
    "id": "v55-sanayi-102",
    "topic": "sanayi",
    "q": "Karabük'ün gelişmesinde hangi sanayi kolu belirleyicidir?",
    "options": ["Demir-çelik", "Petrol rafinerisi", "Çay", "Pamuk ipliği"],
    "answer": 0,
    "explain": "Doğru cevap: Demir-çelik. Karabük, Cumhuriyet döneminin önemli demir-çelik merkezlerinden biridir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-sanayi-103",
    "topic": "sanayi",
    "q": "Türkiye'de organize sanayi bölgelerinin temel amacı nedir?",
    "options": ["Sanayi tesislerini planlı alanlarda toplamak", "Tarım alanlarını sulamak", "Gölleri kurutmak", "Turist sayısını azaltmak"],
    "answer": 0,
    "explain": "Doğru cevap: Sanayi tesislerini planlı alanlarda toplamak. Altyapı ve çevre düzeni açısından planlı sanayileşmeyi destekler.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-sanayi-104",
    "topic": "sanayi",
    "q": "Ulaşım olanaklarının gelişmesi sanayi tesislerinin yer seçiminde neden önemlidir?",
    "options": ["Hammadde ve ürün taşımacılığını kolaylaştırdığı için", "Yağışı artırdığı için", "Depremleri önlediği için", "Sıcaklığı düşürdüğü için"],
    "answer": 0,
    "explain": "Doğru cevap: Hammadde ve ürün taşımacılığını kolaylaştırdığı için. Ulaşım maliyetleri sanayi yer seçiminde önemlidir.",
    "difficulty": "orta"
  },
  {
    "id": "v55-sanayi-105",
    "topic": "sanayi",
    "q": "Çimento fabrikalarının kuruluşunda aşağıdakilerden hangisi önemlidir?",
    "options": ["Hammadde kaynaklarına ve pazara yakınlık", "Yalnızca kar yağışı", "Sadece ormanların yoğunluğu", "Gelgit yüksekliği"],
    "answer": 0,
    "explain": "Doğru cevap: Hammadde kaynaklarına ve pazara yakınlık. Çimento üretiminde taşınması maliyetli hammaddeler önemlidir.",
    "difficulty": "orta"
  },
  {
    "id": "v55-sanayi-106",
    "topic": "sanayi",
    "q": "Türkiye'de dokuma ve hazır giyim sanayisinin geliştiği merkezlerden biri hangisidir?",
    "options": ["İstanbul-Bursa çevresi", "Hakkari çevresi", "Kars çevresi", "Sinop'un dağlık kesimleri"],
    "answer": 0,
    "explain": "Doğru cevap: İstanbul-Bursa çevresi. Büyük pazar, iş gücü ve ulaşım olanakları tekstil sektörünü destekler.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-sanayi-107",
    "topic": "sanayi",
    "q": "Petrol rafinerilerinin kuruluşunda aşağıdakilerden hangisi önemlidir?",
    "options": ["Ham petrol tedariki ve ulaşım", "Yalnızca yüksek yağış", "Sadece mermer yatakları", "Buzul vadileri"],
    "answer": 0,
    "explain": "Doğru cevap: Ham petrol tedariki ve ulaşım. Rafineriler hammadde ve dağıtım bağlantılarına ihtiyaç duyar.",
    "difficulty": "orta"
  },
  {
    "id": "v55-sanayi-108",
    "topic": "sanayi",
    "q": "Türkiye'de sanayi tesislerinin batıda daha yoğun olmasının nedenlerinden biri hangisidir?",
    "options": ["Pazar, ulaşım ve sermaye birikiminin gelişmiş olması", "Yükseltinin sürekli daha fazla olması", "Kışların daha sert olması", "Tarımın tamamen yapılmaması"],
    "answer": 0,
    "explain": "Doğru cevap: Pazar, ulaşım ve sermaye birikiminin gelişmiş olması. Ekonomik altyapı sanayi yoğunluğunu etkiler.",
    "difficulty": "zor"
  },
  {
    "id": "v55-turizm-109",
    "topic": "turizm",
    "q": "Pamukkale hangi ilimizdedir?",
    "options": ["Denizli", "Muğla", "Antalya", "Aydın"],
    "answer": 0,
    "explain": "Doğru cevap: Denizli. Pamukkale travertenleri Denizli'de yer alır.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-turizm-110",
    "topic": "turizm",
    "q": "Kapadokya hangi bölgededir?",
    "options": ["İç Anadolu", "Marmara", "Karadeniz", "Güneydoğu Anadolu"],
    "answer": 0,
    "explain": "Doğru cevap: İç Anadolu. Kapadokya'nın doğal oluşumları Nevşehir ve çevresinde yoğunlaşır.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-turizm-111",
    "topic": "turizm",
    "q": "Ölüdeniz hangi ilimizde bulunur?",
    "options": ["Muğla", "Antalya", "İzmir", "Mersin"],
    "answer": 0,
    "explain": "Doğru cevap: Muğla. Ölüdeniz, Fethiye çevresindeki önemli kıyı turizmi merkezlerinden biridir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-turizm-112",
    "topic": "turizm",
    "q": "Uludağ hangi turizm türüyle özellikle bilinir?",
    "options": ["Kış turizmi", "Kıyı turizmi", "Termal deniz turizmi", "Çöl turizmi"],
    "answer": 0,
    "explain": "Doğru cevap: Kış turizmi. Uludağ, Bursa yakınında önemli bir kayak ve kış turizmi merkezidir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-turizm-113",
    "topic": "turizm",
    "q": "Safranbolu hangi ilimizdedir?",
    "options": ["Karabük", "Bolu", "Kastamonu", "Bartın"],
    "answer": 0,
    "explain": "Doğru cevap: Karabük. Safranbolu, geleneksel Osmanlı evleriyle tanınan tarihi bir ilçedir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-turizm-114",
    "topic": "turizm",
    "q": "Nemrut Dağı'ndaki tarihi heykeller hangi il sınırındadır?",
    "options": ["Adıyaman", "Bitlis", "Ağrı", "Mardin"],
    "answer": 0,
    "explain": "Doğru cevap: Adıyaman. Kommagene Krallığı'na ait Nemrut Dağı kalıntıları Adıyaman'dadır.",
    "difficulty": "orta"
  },
  {
    "id": "v55-turizm-115",
    "topic": "turizm",
    "q": "Efes Antik Kenti hangi ilimizdedir?",
    "options": ["İzmir", "Manisa", "Aydın", "Muğla"],
    "answer": 0,
    "explain": "Doğru cevap: İzmir. Efes, İzmir'in Selçuk ilçesi çevresindeki önemli antik kenttir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-turizm-116",
    "topic": "turizm",
    "q": "Sümela Manastırı hangi ilimizdedir?",
    "options": ["Trabzon", "Rize", "Artvin", "Giresun"],
    "answer": 0,
    "explain": "Doğru cevap: Trabzon. Sümela Manastırı Maçka çevresindeki Altındere Vadisi'ndedir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-turizm-117",
    "topic": "turizm",
    "q": "Göbeklitepe hangi ilimizdedir?",
    "options": ["Şanlıurfa", "Gaziantep", "Mardin", "Diyarbakır"],
    "answer": 0,
    "explain": "Doğru cevap: Şanlıurfa. Göbeklitepe, Şanlıurfa yakınındaki önemli arkeolojik alanlardan biridir.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-turizm-118",
    "topic": "turizm",
    "q": "Peribacalarının oluşumunda aşağıdakilerden hangisi etkilidir?",
    "options": ["Volkanik tüflerin aşınması", "Mercan oluşumu", "Gelgit", "Buzul birikmesi"],
    "answer": 0,
    "explain": "Doğru cevap: Volkanik tüflerin aşınması. Tüflerin farklı dirençteki katmanları aşındıkça peribacası şekilleri gelişir.",
    "difficulty": "orta"
  },
  {
    "id": "v55-turizm-119",
    "topic": "turizm",
    "q": "Antalya'da turizmin gelişmesinde aşağıdakilerden hangisi birlikte etkilidir?",
    "options": ["Ilıman iklim, kıyılar ve doğal-tarihi değerler", "Sert karasal iklim ve yüksek platolar", "Taş kömürü yatakları", "Çöl koşulları"],
    "answer": 0,
    "explain": "Doğru cevap: Ilıman iklim, kıyılar ve doğal-tarihi değerler. Bu özellikler Antalya'yı güçlü bir turizm merkezi yapar.",
    "difficulty": "kolay"
  },
  {
    "id": "v55-turizm-120",
    "topic": "turizm",
    "q": "Termal turizmin gelişmesinde aşağıdakilerden hangisi temel doğal kaynaktır?",
    "options": ["Sıcak su kaynakları", "Buzullar", "Delta ovaları", "Kumullar"],
    "answer": 0,
    "explain": "Doğru cevap: Sıcak su kaynakları. Jeotermal kaynaklar sağlık ve termal turizm faaliyetlerinin temelini oluşturur.",
    "difficulty": "kolay"
  }
];
const bank=Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:(window.QUESTION_BANK=[]);
const seen=new Set(bank.map(q=>String(q?.id||'')));
for(const q of extra){if(!seen.has(String(q.id))){bank.push(q);seen.add(String(q.id));}}
window.QUESTION_BANK=bank;
window.YB55QuestionPool={added:extra.length,total:bank.length};
})();
