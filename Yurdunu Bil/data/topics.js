/**
 * Yurdunu Bil — Konu Veritabanı
 * KPSS Türkiye coğrafyası müfredatına uygun 8 ana başlık.
 */
window.TOPICS = [
  {
    id: "konum",
    title: "Coğrafi Konum",
    icon: "🧭",
    level: "Yüksek Getiri",
    minutes: 12,
    desc: "Türkiye'nin matematik ve özel konumunun sonuçları; KPSS'de her yıl doğrudan soru gelir.",
    bullets: [
      "Matematik konum: 36°-42° kuzey paralelleri, 26°-45° doğu meridyenleri arasındadır.",
      "Yaz saati uygulanmadığında yerel saat farkı en fazla doğu-batı uçları arasında ortaya çıkar.",
      "Özel konum: Üç kıtayı birbirine bağlayan kara ve deniz yollarının kesişiminde yer alır.",
      "Boğazlar (İstanbul ve Çanakkale) Karadeniz'i Akdeniz'e, dolayısıyla dünya denizlerine bağlar.",
      "Enlem etkisiyle güneyden kuzeye gidildikçe gece-gündüz süresi farkı ve sıcaklık farkı artar.",
      "Boylam etkisiyle doğudan batıya gidildikçe yerel saat ileri-geri kayar, güneşin doğuş-batışı erken/geç olur."
    ],
    tip: "\"Sonuç\" soruları enlem mi boylam mı ayrımını sorar: gece-gündüz süresi ve güneşin geliş açısı → enlem; yerel saat farkı ve güneşin doğuş/batış zamanı → boylam."
  },
  {
    id: "iklim",
    title: "İklim ve Bitki Örtüsü",
    icon: "🌦️",
    level: "Yüksek Getiri",
    minutes: 15,
    desc: "Dört temel iklim tipi, bunların dağılışı ve karakteristik bitki örtüleri.",
    bullets: [
      "Karadeniz iklimi: her mevsim yağışlı, yazı serin kışı ılık; doğal bitki örtüsü orman.",
      "Akdeniz iklimi: yazları sıcak ve kurak, kışları ılık ve yağışlı; maki bitki örtüsü görülür.",
      "İç Anadolu (karasal) iklimi: yazı sıcak-kurak kışı soğuk-kurak; bitki örtüsü step (bozkır).",
      "Doğu Anadolu'da sert karasal iklim görülür; kışlar çok uzun ve soğuktur, step örtüsü hâkimdir.",
      "Marmara, Karadeniz ile Akdeniz/karasal iklimler arasında geçiş özellikleri taşır.",
      "Yükselti arttıkça sıcaklık düşer; bu yüzden aynı enlemde bile Doğu Anadolu, kıyılardan çok daha soğuktur."
    ],
    tip: "Bir ilin bitki örtüsü sorulduğunda önce iklimini, iklimini de yağış rejimi ve sıcaklık farkına bakarak belirle."
  },
  {
    id: "yerseki",
    title: "Yerşekilleri",
    icon: "⛰️",
    level: "Yüksek Getiri",
    minutes: 14,
    desc: "Dağlar, platolar, ovalar ve bunların oluşum süreçleri.",
    bullets: [
      "Kuzey Anadolu Dağları (Karadeniz kıyısına paralel) ile Toroslar (Akdeniz kıyısına paralel) kıyıya yakın uzanır.",
      "İç kesimlerde ortalama yükselti batıdan doğuya artar; en yüksek yerler Doğu Anadolu'dadır (Ağrı Dağı 5137 m).",
      "Ovalar oluşumuna göre ikiye ayrılır: kıyı ovaları (Çukurova, Bafra) ve iç ovalar (Konya, Erzurum-Pasinler).",
      "Karstik ovalar (Obruk, Suğla) ve volkanik ovalar (Erciyes çevresi) farklı oluşum kökenine sahiptir.",
      "Platolar en geniş yer kaplayan yer şeklidir: Erzurum-Kars, Bozok, Cihanbeyli, Teke Platosu gibi.",
      "Fay hatları boyunca (Kuzey Anadolu Fayı, Doğu Anadolu Fayı) depremsellik yüksektir."
    ],
    tip: "Bir yer şeklinin oluşumu sorulursa: akarsu aşındırması → vadi/kanyon, volkanizma → koni/platoluk alan, çözünme → karstik şekil, tektonik → graben/horst anahtar kelimelerini eşleştir."
  },
  {
    id: "su",
    title: "Su Kaynakları",
    icon: "💧",
    level: "Orta",
    minutes: 11,
    desc: "Akarsular, göller, denizler ve bunların ekonomik kullanım alanları.",
    bullets: [
      "En uzun akarsu Kızılırmak'tır; Türkiye sınırları içinde doğup denize ulaşır.",
      "Fırat ve Dicle en fazla su taşıyan akarsulardır; GAP kapsamında çok sayıda baraj barındırır.",
      "Göller oluşumuna göre gruplanır: tektonik (Van, Burdur), karstik (Salda, Suğla), set (Tortum), volkanik (Nemrut Krater).",
      "Van Gölü Türkiye'nin en büyük gölüdür ve dışa akışı olmayan (kapalı havza) bir sodalı göldür.",
      "Akarsuların rejimi düzensizdir; Doğu Karadeniz akarsuları kısa-hızlı akışlı, İç Anadolu akarsuları ise az sulu ve düzensizdir.",
      "Baraj ve HES yoğunluğu bakımından Fırat-Dicle havzası (GAP) ülke genelinde öne çıkar."
    ],
    tip: "Göl kökeni sorularında 'krater/maar' kelimesi volkanik gölü, 'heyelan/lav seti' set gölünü, 'çöküntü/fay' tektonik gölü işaret eder."
  },
  {
    id: "nufus",
    title: "Nüfus ve Yerleşme",
    icon: "👥",
    level: "Orta",
    minutes: 10,
    desc: "Nüfus dağılışını etkileyen faktörler ve güncel demografik eğilimler.",
    bullets: [
      "Nüfus, ekonomik fırsatların yoğunlaştığı kıyı ve büyük ova bölgelerinde (Marmara, Ege, Çukurova) daha yoğundur.",
      "İç ve Doğu Anadolu'nun yüksek-engebeli kesimleri düşük nüfus yoğunluğuna sahiptir.",
      "İstanbul, tek başına Türkiye nüfusunun önemli bir bölümünü barındıran en kalabalık ildir.",
      "İç göç genel olarak kırdan kente ve doğudan batıya doğru gerçekleşir.",
      "Bayburt, Ardahan ve Tunceli en az nüfuslu iller arasında yer alır.",
      "Kentleşme oranı sanayi ve hizmet sektörünün geliştiği illerde daha yüksektir."
    ],
    tip: "Nüfus yoğunluğu sorularında 'iklim + yer şekli + ekonomik faaliyet' üçlüsünü birlikte değerlendir; tek başına hiçbiri yeterli açıklama değildir."
  },
  {
    id: "tarim",
    title: "Tarım ve Hayvancılık",
    icon: "🌾",
    level: "Yüksek Getiri",
    minutes: 13,
    desc: "Bölgesel tarım ürünleri, hayvancılık türleri ve ormancılık.",
    bullets: [
      "Fındık üretiminde Karadeniz kıyıları (Ordu, Giresun, Trabzon) dünya çapında öne çıkar.",
      "Zeytin ve incir Ege ile Akdeniz kıyı kuşağında, çay ise yalnızca Doğu Karadeniz'de yetişir.",
      "Pamuk; Çukurova, Güneydoğu Anadolu (GAP sonrası) ve Ege ovalarında yoğun olarak üretilir.",
      "Küçükbaş hayvancılık (koyun-keçi) engebeli ve kurak bölgelerde, büyükbaş hayvancılık ise nemli çayır-mera alanlarında yaygındır.",
      "Doğu Anadolu'nun yüksek platolarında büyükbaş hayvancılık (özellikle sığır) ön plana çıkar.",
      "Orman varlığı bakımından Karadeniz ve Akdeniz kıyı kuşakları en zengin bölgelerdir."
    ],
    tip: "Bir ürünün 'sadece' belirli bir bölgede yetiştiği ifadeleri (çay gibi) sınav için özel olarak ezberlenmeye değer, çünkü sıkça soru kökü olur."
  },
  {
    id: "sanayi",
    title: "Madenler ve Sanayi",
    icon: "⛏️",
    level: "Orta",
    minutes: 12,
    desc: "Yer altı kaynakları, enerji üretimi ve sanayi bölgeleri.",
    bullets: [
      "Bor rezervleri bakımından Türkiye dünyada ilk sıradadır; Kütahya, Eskişehir, Balıkesir başlıca üretim illeridir.",
      "Krom Doğu ve Güneydoğu Anadolu'da, taş kömürü yalnızca Zonguldak havzasında çıkarılır.",
      "Elazığ-Ergani (Maden) ve çevresinde bakır yatakları önemlidir; demir ise başta Sivas-Divriği'de bulunur.",
      "Hidroelektrik potansiyeli en yüksek havza Fırat-Dicle'dir (GAP projeleri).",
      "Marmara Bölgesi (İstanbul, Kocaeli, Bursa) sanayi üretiminde başı çeker; ham madde ve pazara yakınlık avantajlıdır.",
      "Jeotermal enerjide Batı Anadolu (Aydın, Denizli, Manisa) öne çıkar; bu bölge aynı zamanda deprem kuşağıdır."
    ],
    tip: "'Türkiye'de yalnızca ... ilinde çıkarılır' ifadesi genelde taş kömürü (Zonguldak) veya bor gibi tekil kaynaklar için doğrudur; bu tür kesin ifadeler sınavda sık sorulur."
  },
  {
    id: "bolgeler",
    title: "Bölgeler ve Turizm",
    icon: "🗺️",
    level: "Orta",
    minutes: 10,
    desc: "Yedi coğrafi bölgenin ayırt edici özellikleri, ulaşım ve turizm potansiyeli.",
    bullets: [
      "Türkiye 7 coğrafi bölgeye ayrılır: Marmara, Ege, Akdeniz, İç Anadolu, Karadeniz, Doğu Anadolu, Güneydoğu Anadolu.",
      "Bölgeler tarım ürünü ekonomik ölçüt kullanılarak 1941 Coğrafya Kongresi'nde belirlenmiştir.",
      "Yüz ölçümü en büyük bölge Doğu Anadolu, en küçük bölge ise Doğu Karadeniz alt bölgesidir (ana bölge bazında Marmara en küçüktür).",
      "Kıyı turizmi Akdeniz ve Ege'de, kültür/inanç turizmi İç Anadolu ve Marmara'da, yayla turizmi Karadeniz'de öne çıkar.",
      "Kapadokya (Nevşehir) jeolojik oluşumu ve balon turizmiyle, Pamukkale (Denizli) travertenleriyle tanınır.",
      "Karayolu ağırlıklı ulaşımın yanı sıra boğazlardaki köprüler ve tüpler Anadolu-Avrupa bağlantısını güçlendirir."
    ],
    tip: "Bölge sınırları sorularında bir ilin birden fazla bölgeye yayılabildiğini unutma (örn. Adana Akdeniz, Sivas İç Anadolu ama kimi ilçeleri farklı bölgeye sarkar)."
  }
];
