/* Yurdunu Bil 51 — expanded event engine, larger pools, stable learning flow */
(()=>{
'use strict';
if(window.__YB51_GAMES__) return;
window.__YB51_GAMES__=true;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
const sample=(a,n)=>shuffle(a).slice(0,Math.min(n,a.length));
const DATA={
regions:[
['Marmara','Sanayi, ticaret ve ulaşım çok gelişmiştir.','Nüfus ve şehirleşme yoğunluğu yüksektir.'],
['Ege','Zeytin, üzüm ve incir üretimi önemlidir.','Batı Anadolu’da horst-graben sistemi belirgindir.'],
['Akdeniz','Turunçgil, muz ve seracılık gelişmiştir.','Kışlar ılık, yazlar sıcak ve kuraktır.'],
['Karadeniz','Her mevsim yağışlı koşullar görülür.','Çay ve fındık üretimi öne çıkar.'],
['İç Anadolu','Bozkır bitki örtüsü yaygındır.','Buğday tarımı ve küçükbaş hayvancılık önemlidir.'],
['Doğu Anadolu','Ortalama yükselti ve engebelilik fazladır.','Kışlar uzun, nüfus yoğunluğu genellikle düşüktür.'],
['Güneydoğu Anadolu','Yazlar çok sıcak ve kuraktır.','Antep fıstığı, mercimek ve pamuk önemlidir.']
],
blanks:[
['Türkiye’nin yüz ölçümü en büyük ili ____’dır.','Konya',['Konya','Sivas','Ankara','Erzurum'],'Konya yüz ölçümü bakımından Türkiye’nin en büyük ilidir.'],
['Türkiye sınırları içindeki en uzun akarsu ____’dır.','Kızılırmak',['Kızılırmak','Fırat','Dicle','Sakarya'],'Kızılırmak Türkiye sınırları içinde doğup yine Türkiye’de denize ulaşan en uzun akarsudur.'],
['Çay tarımında ____ ili öne çıkar.','Rize',['Rize','Ordu','Aydın','Konya'],'Doğu Karadeniz’in nemli ve yağışlı koşulları çay tarımını destekler; Rize öne çıkar.'],
['Taş kömürü ile özdeşleşen il ____’dır.','Zonguldak',['Zonguldak','Manisa','Batman','Elazığ'],'Zonguldak, Batı Karadeniz taş kömürü havzasının başlıca merkezidir.'],
['Türkiye’nin yüz ölçümü en büyük gölü ____ Gölü’dür.','Van',['Van','Tuz','Beyşehir','Eğirdir'],'Van Gölü yüz ölçümü bakımından Türkiye’nin en büyük gölüdür.'],
['Bafra Ovası ____ Nehri deltasında oluşmuştur.','Kızılırmak',['Kızılırmak','Yeşilırmak','Sakarya','Meriç'],'Bafra Ovası Kızılırmak’ın Karadeniz’e ulaştığı deltada oluşmuştur.'],
['Çarşamba Ovası ____ Nehri deltasındadır.','Yeşilırmak',['Yeşilırmak','Kızılırmak','Gediz','Meriç'],'Çarşamba Ovası Yeşilırmak’ın Karadeniz’e ulaştığı deltadır.'],
['Menteşe Yöresi ____ Bölgesi’ndedir.','Ege',['Ege','Akdeniz','Marmara','Karadeniz'],'Menteşe Yöresi Güneybatı Anadolu’da Ege Bölgesi sınırları içindedir.'],
['Karstik şekillerin en yaygın görüldüğü bölge ____’dir.','Akdeniz',['Akdeniz','Marmara','Karadeniz','Doğu Anadolu'],'Toroslar ve çevresinde kireç taşlarının yaygınlığı karstik şekilleri artırır.'],
['Türkiye’nin en doğu ucuna sahip il ____’dır.','Iğdır',['Iğdır','Kars','Ardahan','Van'],'Iğdır, Türkiye’nin en doğu kesiminde Aras Ovası çevresinde yer alır.'],
['Çukurova, ____ ve Ceyhan’ın taşıdığı alüvyonlarla oluşmuştur.','Seyhan',['Seyhan','Fırat','Dicle','Gediz'],'Çukurova, Seyhan ve Ceyhan’ın getirdiği alüvyonların birikmesiyle oluşmuştur.'],
['Türkiye’de nüfus yoğunluğu en yüksek bölge genellikle ____’dır.','Marmara',['Marmara','Doğu Anadolu','Karadeniz','Güneydoğu Anadolu'],'Sanayi, ticaret, ulaşım ve büyük şehirler Marmara’nın nüfus yoğunluğunu yükseltir.'],
['Pamukkale travertenleri ____ ilindedir.','Denizli',['Denizli','Muğla','Aydın','Manisa'],'Pamukkale travertenleri Denizli’de, Büyük Menderes Havzası çevresindedir.'],
['Uludağ ____ ilinin güneyindedir.','Bursa',['Bursa','Balıkesir','Bilecik','Kocaeli'],'Uludağ Bursa’nın güneyinde yer alan önemli bir kütledir.'],
['Nemrut Dağı’nın krater gölü ____ ilindedir.','Bitlis',['Bitlis','Van','Muş','Ağrı'],'Nemrut Krater Gölü Bitlis’te yer alır.'],
['Türkiye’nin en yüksek dağı ____ Dağı’dır.','Ağrı',['Ağrı','Kaçkar','Erciyes','Süphan'],'Ağrı Dağı Türkiye’nin en yüksek zirvesidir.'],
['Teke Yöresi ____ Bölgesi’nin batı kesimindedir.','Akdeniz',['Akdeniz','Ege','Marmara','Karadeniz'],'Teke Yöresi Antalya çevresinde Akdeniz Bölgesi’nde yer alır.'],
['Keban Barajı ____ Nehri üzerinde kurulmuştur.','Fırat',['Fırat','Dicle','Kızılırmak','Sakarya'],'Keban Barajı Fırat Nehri üzerindeki önemli barajlardan biridir.'],
['Sakarya Nehri ____ Denizi’ne dökülür.','Karadeniz',['Karadeniz','Ege','Akdeniz','Marmara'],'Sakarya Nehri Karadeniz’e ulaşır.'],
['Ergene Havzası ____ Bölgesi’nin Avrupa yakasındadır.','Marmara',['Marmara','Ege','Karadeniz','İç Anadolu'],'Ergene Havzası Trakya’da, Marmara Bölgesi sınırları içindedir.'],
['Tuz Gölü çevresinde doğal bitki örtüsü olarak ____ yaygındır.','Bozkır',['Bozkır','Maki','Orman','Çayır'],'Kurak ve yarı kurak karasal koşullar bozkırın yayılmasını destekler.'],
['Fındık üretiminde Türkiye’de ____ kıyıları öne çıkar.','Karadeniz',['Karadeniz','Ege','Akdeniz','Marmara'],'Nemli iklim koşulları özellikle Orta ve Doğu Karadeniz’de fındık üretimini destekler.'],
['Gediz Ovası ____ Bölgesi’nde yer alır.','Ege',['Ege','Akdeniz','Marmara','Karadeniz'],'Gediz Havzası Batı Anadolu’da Ege Bölgesi’ndedir.'],
['Harran Ovası ____ Bölgesi’ndedir.','Güneydoğu Anadolu',['Güneydoğu Anadolu','İç Anadolu','Doğu Anadolu','Akdeniz'],'Harran Ovası Şanlıurfa çevresinde Güneydoğu Anadolu’dadır.']
],
tf:[
['Türkiye’de yağışın en fazla olduğu kıyı kuşağı genel olarak Karadeniz’dir.',true,'Doğru. Karadeniz’de özellikle denize bakan yamaçlarda orografik yağışlar fazladır.'],
['Konya, yüz ölçümü bakımından Türkiye’nin en büyük ilidir.',true,'Doğru. Konya yüz ölçümü bakımından ilk sıradadır.'],
['Tuz Gölü Türkiye’nin yüz ölçümü en büyük gölüdür.',false,'Yanlış. Yüz ölçümü bakımından en büyük göl Van Gölü’dür.'],
['Ege Bölgesi’nde horst-graben sistemi görülür.',true,'Doğru. Batı Anadolu’daki kırılmalar bu yapıyı oluşturmuştur.'],
['Zonguldak taş kömürü ile özdeşleşmiştir.',true,'Doğru. Batı Karadeniz taş kömürü havzasının önemli merkezidir.'],
['Nüfus yoğunluğu en yüksek bölge Doğu Anadolu’dur.',false,'Yanlış. Nüfus yoğunluğu bakımından Marmara öne çıkar.'],
['Çukurova Akdeniz Bölgesi’ndedir.',true,'Doğru. Seyhan-Ceyhan deltası çevresindeki Çukurova Akdeniz’dedir.'],
['Bafra Ovası Yeşilırmak deltasında oluşmuştur.',false,'Yanlış. Bafra Ovası Kızılırmak deltasıdır; Çarşamba Ovası Yeşilırmak deltasıdır.'],
['Bozkır İç Anadolu’da yaygındır.',true,'Doğru. Karasal ve yarı kurak koşullar bozkırı yaygınlaştırır.'],
['Menteşe Yöresi Karadeniz Bölgesi’ndedir.',false,'Yanlış. Menteşe Yöresi Güneybatı Anadolu’da Ege Bölgesi’ndedir.'],
['Akdeniz kıyılarında maki bitki örtüsü görülür.',true,'Doğru. Akdeniz iklimi makinin yayılmasına uygundur.'],
['Doğu Anadolu’nun ortalama yükseltisi Türkiye’nin diğer bölgelerinden genellikle daha fazladır.',true,'Doğru. Bölge yüksek ve engebeli bir yapıya sahiptir.'],
['Marmara Bölgesi’nde sanayi faaliyetleri gelişmemiştir.',false,'Yanlış. Marmara Türkiye’nin en gelişmiş sanayi ve ticaret alanıdır.'],
['Rize’de çay tarımı için uygun nemli koşullar bulunur.',true,'Doğru. Yağışlı ve nemli iklim çay için uygundur.'],
['Ağrı Dağı Türkiye’nin en yüksek dağıdır.',true,'Doğru. Ağrı Dağı’nın zirvesi 5.137 m civarındadır.'],
['Kızılırmak Türkiye sınırları içindeki en uzun akarsudur.',true,'Doğru. Türkiye’de doğup Türkiye’de denize ulaşan en uzun akarsudur.'],
['Çarşamba Ovası Kızılırmak deltasında oluşmuştur.',false,'Yanlış. Çarşamba Ovası Yeşilırmak deltasındadır.'],
['Pamukkale travertenleri Denizli’dedir.',true,'Doğru. Pamukkale Denizli’deki önemli doğal ve turistik oluşumdur.'],
['Karstik şekillerin en yaygın olduğu bölge genel olarak Marmara’dır.',false,'Yanlış. Torosların etkisiyle Akdeniz Bölgesi karstik şekiller açısından zengindir.'],
['Harran Ovası Güneydoğu Anadolu’dadır.',true,'Doğru. Şanlıurfa çevresindeki Harran Ovası GAP’ın önemli tarım alanlarındandır.'],
['Sakarya Nehri Karadeniz’e dökülür.',true,'Doğru. Sakarya Nehri Karadeniz kıyısında denize ulaşır.'],
['Uludağ Antalya’dadır.',false,'Yanlış. Uludağ Bursa’nın güneyinde yer alır.'],
['Ege Bölgesi’nde kıyı ile iç kesimler arasında ulaşımın görece kolay olmasında graben ovaları etkilidir.',true,'Doğru. Gediz, Küçük Menderes ve Büyük Menderes gibi vadiler ulaşımı kolaylaştırır.'],
['Güneydoğu Anadolu’da yaz kuraklığı belirgindir.',true,'Doğru. Sıcak ve kurak yazlar karasal özellikleri güçlendirir.']
],
clues:[
['İç Anadolu’da yer alır; yüz ölçümü Türkiye’nin en büyük ilidir.','Konya','Konya’nın geniş yüz ölçümü ve İç Anadolu’daki konumu ayırt edicidir.'],
['Çay tarımıyla özdeşleşen Doğu Karadeniz ilidir.','Rize','Rize’nin nemli ve yağışlı iklimi çay tarımını destekler.'],
['Taş kömürü havzasının başlıca merkezidir.','Zonguldak','Batı Karadeniz’de taş kömürü çıkarımıyla tanınır.'],
['Marmara’nın nüfus, sanayi, ticaret ve ulaşım merkezi olan büyük şehridir.','İstanbul','İstanbul boğazlar ve ulaşım ağları sayesinde ekonomik açıdan çok güçlüdür.'],
['Palandöken Dağları ile özdeşleşen Doğu Anadolu ilidir.','Erzurum','Yüksek ve karasal konumu ile kış sporları açısından da öne çıkar.'],
['Fındık üretiminde Karadeniz’in öne çıkan illerindendir.','Ordu','Ordu kıyı kuşağında fındık üretimiyle tanınır.'],
['Aras Nehri havzasında, Türkiye’nin en doğu kesiminde yer alır.','Iğdır','Iğdır’ın doğudaki konumu ve Aras Ovası önemli ipuçlarıdır.'],
['Ege’de zeytin ve pamuk tarımıyla öne çıkar.','Aydın','Aydın Ege’nin önemli tarım merkezlerindendir.'],
['Akdeniz kıyısında; turizm, narenciye ve seracılıkla öne çıkan ildir.','Antalya','Antalya Akdeniz kıyısında turizm ve tarımsal faaliyetleriyle öne çıkar.'],
['GAP kapsamında sulama ve tarımsal üretimle öne çıkan Güneydoğu Anadolu ilidir.','Şanlıurfa','Şanlıurfa çevresindeki Harran Ovası sulama yatırımlarıyla önem kazanmıştır.'],
['Ege’nin sanayi ve tarım merkezlerinden; üzüm üretimiyle de tanınır.','Manisa','Manisa Gediz Havzası çevresinde gelişmiş tarım ve sanayi faaliyetlerine sahiptir.'],
['Karadeniz kıyısında; çay ve fındık kuşağı arasında yer alan önemli liman kentidir.','Trabzon','Trabzon Doğu Karadeniz’in ulaşım ve ticaret merkezlerinden biridir.'],
['İç Anadolu’nun başkenti ve önemli ulaşım kavşağıdır.','Ankara','Ankara İç Anadolu’nun merkezinde, Türkiye’nin başkentidir.'],
['Akdeniz kıyısında; turunçgil ve seracılığın güçlü olduğu büyük tarım kentidir.','Mersin','Mersin Akdeniz kıyısında tarım, liman ve ticaret faaliyetleriyle öne çıkar.'],
['Doğu Anadolu’da yüksek plato üzerinde yer alır; kışları serttir.','Kars','Kars yüksek ve karasal koşullarıyla Doğu Anadolu’nun belirgin illerindendir.'],
['Marmara’nın güneyinde; otomotiv ve sanayi faaliyetleriyle öne çıkar.','Bursa','Bursa sanayi, tarım ve tarihî özellikleriyle önemli bir Marmara kentidir.'],
['Ege kıyısında; zeytin, incir ve tarım faaliyetleriyle öne çıkan ildir.','Aydın','Aydın’ın tarımsal üretiminde zeytin ve incir önemlidir.'],
['Doğu Anadolu’nun yüksek kesiminde; Van Gölü kıyısındaki büyük ildir.','Van','Van Gölü çevresindeki konumu ve yüksek plato özellikleri belirgindir.'],
['Karadeniz’de fındık üretimi ve limanıyla bilinen ildir.','Samsun','Samsun Orta Karadeniz’in önemli ulaşım, tarım ve liman merkezidir.'],
['Batı Karadeniz’de; taş kömürü havzasına komşu önemli ildir.','Bartın','Bartın Batı Karadeniz’de Zonguldak çevresindeki havzaya yakın konumdadır.'],
['Ege Bölgesi’nde, büyük bir körfezin kıyısındaki önemli liman ve sanayi şehridir.','İzmir','İzmir Ege’nin en büyük kentlerinden ve önemli limanlarından biridir.'],
['İç Anadolu’da; Tuz Gölü çevresine uzanan geniş düzlükleriyle bilinir.','Aksaray','Aksaray İç Anadolu’da yer alır ve Tuz Gölü çevresindeki plato-düzlüklerle ilişkilidir.'],
['Doğu Anadolu’da; Ağrı Dağı’nın bulunduğu ildir.','Ağrı','Ağrı Dağı Türkiye’nin en yüksek zirvesidir ve Ağrı ili sınırları içindedir.'],
['Akdeniz’in doğusunda; Çukurova tarım alanlarının önemli merkezidir.','Adana','Adana Çukurova’nın tarım, sanayi ve nüfus merkezlerinden biridir.']
],
classic:[
['Türkiye’nin yüz ölçümü en büyük gölü hangisidir?','Van Gölü',['Van Gölü','Tuz Gölü','Beyşehir Gölü','Eğirdir Gölü'],'Van Gölü yüz ölçümü bakımından Türkiye’nin en büyük gölüdür.'],
['Türkiye sınırları içindeki en uzun akarsu hangisidir?','Kızılırmak',['Kızılırmak','Fırat','Dicle','Sakarya'],'Kızılırmak Türkiye sınırları içinde doğup denize ulaşan en uzun akarsudur.'],
['Horst-graben sistemi en belirgin hangi bölgede görülür?','Ege',['Ege','Karadeniz','Doğu Anadolu','Marmara'],'Batı Anadolu’daki tektonik hareketler horst-graben sistemini oluşturmuştur.'],
['Bozkırın yaygın olduğu bölge hangisidir?','İç Anadolu',['İç Anadolu','Karadeniz','Marmara','Akdeniz'],'Karasal ve yarı kurak koşullar nedeniyle İç Anadolu’da bozkır yaygındır.'],
['Bafra Ovası hangi nehrin deltasındadır?','Kızılırmak',['Kızılırmak','Yeşilırmak','Meriç','Gediz'],'Bafra Ovası Kızılırmak deltasıdır.'],
['Çarşamba Ovası hangi nehrin deltasındadır?','Yeşilırmak',['Yeşilırmak','Kızılırmak','Sakarya','Gediz'],'Çarşamba Ovası Yeşilırmak deltasıdır.'],
['Nüfus yoğunluğu bakımından Türkiye’de öne çıkan bölge hangisidir?','Marmara',['Marmara','Doğu Anadolu','Karadeniz','Güneydoğu Anadolu'],'Sanayi, ticaret ve büyük şehirler Marmara’nın nüfus yoğunluğunu artırır.'],
['Çukurova hangi bölgede yer alır?','Akdeniz',['Akdeniz','Ege','Marmara','Karadeniz'],'Çukurova Seyhan-Ceyhan çevresinde Akdeniz Bölgesi’ndedir.'],
['Menteşe Yöresi hangi bölgededir?','Ege',['Ege','Akdeniz','Karadeniz','Marmara'],'Menteşe Yöresi Güneybatı Anadolu’da Ege Bölgesi’ndedir.'],
['Taş kömürü ile özdeşleşen il hangisidir?','Zonguldak',['Zonguldak','Batman','Manisa','Elazığ'],'Zonguldak Batı Karadeniz taş kömürü havzasıyla bilinir.'],
['Çay tarımında öne çıkan il hangisidir?','Rize',['Rize','Aydın','Konya','Bursa'],'Rize’nin yağışlı ve nemli iklimi çay tarımına uygundur.'],
['Pamukkale travertenleri hangi ildedir?','Denizli',['Denizli','Muğla','Aydın','Manisa'],'Pamukkale Denizli’dedir.'],
['Uludağ hangi ildedir?','Bursa',['Bursa','Balıkesir','Kocaeli','Bilecik'],'Uludağ Bursa’nın güneyinde yer alır.'],
['Ağrı Dağı hangi il sınırları içinde bulunur?','Ağrı',['Ağrı','Erzurum','Kars','Van'],'Ağrı Dağı’nın büyük bölümü Ağrı ili sınırları içindedir.'],
['Harran Ovası hangi bölgede yer alır?','Güneydoğu Anadolu',['Güneydoğu Anadolu','İç Anadolu','Doğu Anadolu','Akdeniz'],'Harran Ovası Şanlıurfa çevresinde Güneydoğu Anadolu’dadır.'],
['Keban Barajı hangi nehir üzerindedir?','Fırat',['Fırat','Dicle','Kızılırmak','Sakarya'],'Keban Barajı Fırat üzerindedir.'],
['Karstik şekiller açısından en zengin bölge hangisidir?','Akdeniz',['Akdeniz','Marmara','Karadeniz','İç Anadolu'],'Toroslar’daki kireç taşları karstik şekillerin gelişmesini sağlar.'],
['Fındık üretiminde öne çıkan bölge hangisidir?','Karadeniz',['Karadeniz','Ege','Akdeniz','İç Anadolu'],'Nemli iklim koşulları Karadeniz’de fındık tarımını destekler.'],
['Türkiye’nin en yüksek dağı hangisidir?','Ağrı Dağı',['Ağrı Dağı','Erciyes','Kaçkar','Süphan'],'Ağrı Dağı yaklaşık 5.137 m ile Türkiye’nin en yüksek zirvesidir.'],
['Gediz Ovası hangi bölgededir?','Ege',['Ege','Akdeniz','Marmara','Karadeniz'],'Gediz Havzası Batı Anadolu’da Ege Bölgesi’ndedir.'],
['Tuz Gölü çevresinde hangi doğal bitki örtüsü yaygındır?','Bozkır',['Bozkır','Maki','Orman','Çayır'],'Yarı kurak karasal koşullar bozkırı destekler.'],
['Türkiye’nin başkenti hangi ilde yer alır?','Ankara',['Ankara','Konya','İstanbul','Eskişehir'],'Ankara Türkiye’nin başkentidir ve İç Anadolu’dadır.'],
['Meriç Nehri Türkiye’de hangi bölgenin batı sınırına yakındır?','Marmara',['Marmara','Ege','Karadeniz','İç Anadolu'],'Meriç, Trakya’da Edirne çevresinde yer alır.'],
['Doğu Anadolu’nun ortalama yükseltisi nasıldır?','Yüksek',['Yüksek','Düşük','Çok alçak','Deniz seviyesine yakın'],'Doğu Anadolu Türkiye’nin ortalama yükseltisi en fazla olan bölgesidir.'],
['Akdeniz ikliminde yazlar genellikle nasıldır?','Sıcak ve kurak',['Sıcak ve kurak','Soğuk ve yağışlı','Serin ve sürekli yağışlı','Çok soğuk ve kurak'],'Akdeniz ikliminin temel özelliği sıcak-kurak yaz ve ılık-yağışlı kıştır.'],
['Ege’de kıyı ile iç kesimler arasındaki ulaşımı kolaylaştıran doğal unsur hangisidir?','Graben ovaları',['Graben ovaları','Yüksek dağ sıraları','Buzullar','Delta bataklıkları'],'Gediz, Küçük Menderes ve Büyük Menderes vadileri ulaşımı kolaylaştırır.'],
['Sakarya Nehri hangi denize dökülür?','Karadeniz',['Karadeniz','Ege Denizi','Akdeniz','Marmara Denizi'],'Sakarya Nehri Karadeniz’e dökülür.'],
['Van Gölü hangi bölgemizdedir?','Doğu Anadolu',['Doğu Anadolu','İç Anadolu','Güneydoğu Anadolu','Karadeniz'],'Van Gölü Doğu Anadolu’nun doğusunda yer alır.'],
['Antep fıstığı üretimiyle öne çıkan bölge hangisidir?','Güneydoğu Anadolu',['Güneydoğu Anadolu','Karadeniz','Marmara','İç Anadolu'],'Gaziantep ve çevresinde Antep fıstığı üretimi önemlidir.'],
['Türkiye’de seracılığın en gelişmiş olduğu kıyı kuşağı hangisidir?','Akdeniz',['Akdeniz','Karadeniz','Marmara','Ege'],'Kışların ılık olması nedeniyle özellikle Antalya-Mersin çevresinde seracılık gelişmiştir.'],
['İstanbul ve Çanakkale Boğazları hangi denizleri birbirine bağlayan geçiş sistemindedir?','Karadeniz-Akdeniz sistemi',['Karadeniz-Akdeniz sistemi','Hazar-Kızıldeniz sistemi','Ege-Hazar sistemi','Aral-Marmara sistemi'],'Boğazlar Karadeniz’i Marmara üzerinden Ege ve Akdeniz sistemine bağlar.'],
['Küçük Menderes Ovası hangi bölgemizdedir?','Ege',['Ege','Marmara','Akdeniz','Karadeniz'],'Küçük Menderes Havzası İzmir çevresinde Ege Bölgesi’ndedir.'],
['Doğu Karadeniz’de kıyı ile iç kesimler arasındaki ulaşım neden zordur?','Dağların kıyıya paralel uzanması',['Dağların kıyıya paralel uzanması','Geniş delta ovaları','Çöl iklimi','Alçak plato yüzeyleri'],'Kıyıya paralel uzanan dağlar kısa mesafede yükselerek ulaşımı zorlaştırır.'],
['Türkiye’de küçükbaş hayvancılığın bozkır alanlarında gelişmesinde hangi unsur etkilidir?','Doğal otlakların bozkır karakteri',['Doğal otlakların bozkır karakteri','Tropikal ormanlar','Yıl boyu aşırı yağış','Buzul vadileri'],'Bozkır alanlarında küçükbaş hayvancılık için uygun doğal otlaklar bulunur.'],
['Güneydoğu Anadolu Projesi’nin kısaltması hangisidir?','GAP',['GAP','DAP','KOP','DOKAP'],'GAP, Güneydoğu Anadolu Projesi’nin kısaltmasıdır.'],
['KOP ağırlıklı olarak hangi bölgenin su ve tarım sorunlarına yönelik projeler içerir?','İç Anadolu',['İç Anadolu','Karadeniz','Marmara','Ege'],'KOP, Konya Ovası merkezli su ve tarımsal kalkınma projelerini kapsar.'],
['DOKAP hangi bölgeyle daha çok ilişkilidir?','Doğu Karadeniz',['Doğu Karadeniz','Güneydoğu Anadolu','İç Anadolu','Marmara'],'DOKAP, Doğu Karadeniz Projesi’dir.'],
['DAP hangi geniş coğrafi alanla ilişkilidir?','Doğu Anadolu',['Doğu Anadolu','Ege','Marmara','Akdeniz'],'DAP, Doğu Anadolu Projesi’dir.']
]
};
const MODES={
region:{name:'Bölge Eşleştirme',icon:'◈',desc:'İpuçlarından doğru coğrafi bölgeyi bul.',time:210,count:10,kind:'region'},
blank:{name:'Boşluk Doldur',icon:'✦',desc:'Eksik bilgiyi doğru seçenekle tamamla.',time:240,count:12,kind:'blank'},
tf:{name:'Doğru / Yanlış',icon:'✓',desc:'Bilgiyi KPSS mantığıyla hızlıca değerlendir.',time:240,count:12,kind:'tf'},
clue:{name:'İl Avı',icon:'⌖',desc:'Coğrafi ipuçlarından doğru ili yakala.',time:240,count:12,kind:'clue'},
speed:{name:'Hızlı 10',icon:'⚡',desc:'10 karışık soruyu süre baskısıyla çöz.',time:180,count:10,kind:'speed'},
classic:{name:'Klasik KPSS',icon:'◆',desc:'Karışık mini deneme: bölge, il, göl, akarsu ve ekonomi.',time:300,count:15,kind:'classic'}
};
const PROV=['Adana','Ağrı','Aksaray','Ankara','Antalya','Aydın','Bartın','Bitlis','Bursa','Erzurum','Iğdır','İstanbul','İzmir','Kars','Konya','Manisa','Mersin','Ordu','Rize','Samsun','Şanlıurfa','Trabzon','Van','Zonguldak'];
let S={mode:null,items:[],index:0,score:0,time:0,timer:null,answered:false,locked:false,history:false,session:0,streak:0,selected:null};
function css(){if($('#yb51-style'))return;const s=document.createElement('style');s.id='yb51-style';s.textContent=`
#view-events .yb51{max-width:1120px;margin:auto;padding:0 0 108px;color:#edf4f8}.yb51-hero{padding:8px 4px 17px}.yb51-k{font-size:10px;font-weight:950;letter-spacing:.17em;color:#72e6d5;text-transform:uppercase}.yb51 h1{margin:6px 0 7px;font-size:clamp(28px,4vw,43px);letter-spacing:-.055em}.yb51 p{margin:0;color:#91a5ba;line-height:1.55}.yb51-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.yb51-card{padding:17px;border:1px solid rgba(255,255,255,.09);border-radius:20px;background:linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.025));min-height:175px;box-shadow:0 18px 50px rgba(0,0,0,.16);transition:transform .18s,border-color .18s}.yb51-card:hover{transform:translateY(-2px);border-color:rgba(114,230,213,.25)}.yb51-icon{font-size:25px}.yb51-card h3{margin:8px 0 5px;font-size:17px}.yb51-card p{font-size:12px;min-height:39px;margin-bottom:12px}.yb51-meta{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 12px}.yb51-chip{padding:5px 8px;border-radius:99px;background:rgba(255,255,255,.055);color:#9fb1c3;font-size:10px;font-weight:800}.yb51-btn{border:0;border-radius:12px;padding:10px 14px;background:#79e6d6;color:#06101d;font-weight:950;cursor:pointer}.yb51-btn.alt{background:rgba(255,255,255,.08);color:#e5edf3}.yb51-shell{position:relative}.yb51-back{display:inline-flex;align-items:center;gap:6px;margin:0 0 11px;padding:9px 12px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.045);color:#cbd8e3;font-weight:850;cursor:pointer}.yb51-box{border:1px solid rgba(255,255,255,.09);border-radius:23px;background:linear-gradient(145deg,rgba(255,255,255,.065),rgba(255,255,255,.025));padding:16px;box-shadow:0 18px 55px rgba(0,0,0,.18)}.yb51-top{display:grid;grid-template-columns:1fr auto auto auto;gap:8px;align-items:center}.yb51-pill{padding:8px 10px;border-radius:999px;background:rgba(255,255,255,.075);font-size:11px;font-weight:900;text-align:center}.yb51-time.urgent{background:rgba(255,82,110,.14);color:#ffb1bd}.yb51-streak{background:rgba(114,230,213,.09);color:#82e7d6}.yb51-bar{height:6px;border-radius:99px;background:rgba(255,255,255,.075);overflow:hidden;margin:12px 0 17px}.yb51-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#68e3cd,#8ed8ff);transition:width .3s}.yb51-q{font-size:clamp(21px,3vw,31px);font-weight:900;line-height:1.3;letter-spacing:-.03em;margin:14px 0 17px}.yb51-opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.yb51-opt{position:relative;border:1px solid rgba(255,255,255,.095);background:rgba(255,255,255,.045);color:#edf3f8;border-radius:15px;padding:14px;text-align:left;font-weight:800;cursor:pointer;transition:.16s;min-height:52px}.yb51-opt:hover{transform:translateY(-1px);border-color:rgba(121,230,214,.42)}.yb51-opt.good{border-color:#58e3c4;background:rgba(62,220,180,.15);box-shadow:0 0 0 1px rgba(88,227,196,.13) inset}.yb51-opt.good:before{content:'✓';float:right;color:#71edcf;font-size:20px;font-weight:950}.yb51-opt.bad{border-color:#ff879c;background:rgba(255,70,100,.11)}.yb51-opt.bad:before{content:'×';float:right;color:#ff9bad;font-size:20px;font-weight:950}.yb51-opt:disabled{cursor:default;transform:none}.yb51-feedback{margin-top:13px;padding:14px;border-radius:16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);line-height:1.55;color:#b8c7d4;font-size:13px}.yb51-feedback.correct{border-color:rgba(80,227,190,.3);background:rgba(62,220,180,.07)}.yb51-feedback.wrong{border-color:rgba(255,90,115,.25);background:rgba(255,70,100,.06)}.yb51-answer{display:flex;align-items:center;gap:9px;padding:10px 12px;border-radius:12px;background:rgba(70,225,190,.13);border:1px solid rgba(83,228,193,.35);color:#bff9e8;margin-bottom:8px}.yb51-answer b{color:#79f0d1}.yb51-learning{margin-top:9px;padding:10px 12px;border-radius:13px;background:rgba(114,230,213,.055);border-left:3px solid rgba(114,230,213,.65);color:#b9cad8;font-size:12px}.yb51-next{display:none;margin-top:11px}.yb51-next.show{display:inline-flex}.yb51-hint{margin-top:9px;color:#73879b;font-size:10px}.yb51-result{text-align:center;padding:28px 18px}.yb51-big{font-size:60px;font-weight:950;letter-spacing:-.07em}.yb51-result h2{margin:2px 0 5px;font-size:27px}.yb51-result p{max-width:560px;margin:auto}.yb51-actions{display:flex;justify-content:center;gap:9px;flex-wrap:wrap;margin-top:19px}.yb51-tag-good{display:inline-block;margin-top:11px;padding:7px 10px;border-radius:999px;background:rgba(70,225,190,.11);color:#79e8d0;font-size:11px;font-weight:900}@media(max-width:850px){.yb51-grid{grid-template-columns:1fr 1fr}}@media(max-width:560px){#view-events .yb51{padding-bottom:96px}.yb51-hero{padding:5px 2px 13px}.yb51-grid{grid-template-columns:1fr 1fr;gap:9px}.yb51-card{min-height:0;padding:14px;border-radius:17px}.yb51-card h3{font-size:15px}.yb51-card p{font-size:11px;min-height:34px}.yb51-meta{gap:4px}.yb51-chip{font-size:9px;padding:4px 6px}.yb51-card .yb51-btn{width:100%;padding:9px 10px}.yb51-box{padding:12px;border-radius:19px}.yb51-top{grid-template-columns:1fr 1fr;gap:6px}.yb51-top .yb51-pill:first-child{grid-column:1/-1}.yb51-q{font-size:20px;margin:13px 0 14px}.yb51-opts{grid-template-columns:1fr;gap:8px}.yb51-opt{padding:13px;min-height:50px}.yb51-feedback{font-size:12px}.yb51-big{font-size:52px}}`;
document.head.appendChild(s)}
function stats(){try{return JSON.parse(localStorage.getItem('yb51_stats')||'{"xp":0,"games":0,"correct":0}')}catch{return {xp:0,games:0,correct:0}}}
function saveStats(ok){const x=stats();x.xp+=(ok?12:3);x.games++;if(ok)x.correct++;try{localStorage.setItem('yb51_stats',JSON.stringify(x))}catch{}return x}
function pushHistory(){if(!S.history){history.pushState({yb51Game:true},'',location.href);S.history=true}}
function stopTimer(){if(S.timer){clearInterval(S.timer);S.timer=null}}
function backToHub(fromPop=false){stopTimer();S={mode:null,items:[],index:0,score:0,time:0,timer:null,answered:false,locked:false,history:false,session:S.session+1,streak:0,selected:null};hub();if(!fromPop&&history.state?.yb51Game)history.back()}
window.addEventListener('popstate',()=>{if(S.history){stopTimer();S.history=false;S.mode=null;hub()}});
function buildRegion(){return sample(DATA.regions,10).map(([name,a,b])=>({q:`Aşağıdaki özellikler hangi coğrafi bölgeye aittir?`,extra:`${a} ${b}`,answer:name,options:shuffle([name,...sample(DATA.regions.filter(x=>x[0]!==name),3).map(x=>x[0])]),note:`${a} ${b}`}))}
function buildBlank(){return sample(DATA.blanks,12).map(x=>({q:x[0],answer:x[1],options:shuffle(x[2]),note:x[3]}))}
function buildTF(){return sample(DATA.tf,12).map(x=>({q:x[0],answer:x[1]?'Doğru':'Yanlış',options:['Doğru','Yanlış'],note:x[2]}))}
function buildClue(){return sample(DATA.clues,12).map(x=>({q:'Bu il hangisidir?',extra:x[0],answer:x[1],options:shuffle([x[1],...sample(PROV.filter(p=>p!==x[1]),3)]),note:x[2]}))}
function buildClassic(){return sample(DATA.classic,15).map(x=>({q:x[0],answer:x[1],options:shuffle(x[2]),note:x[3]}))}
function build(kind){if(kind==='region')return buildRegion();if(kind==='blank')return buildBlank();if(kind==='tf')return buildTF();if(kind==='clue')return buildClue();return buildClassic()}
function hub(){css();const v=$('#view-events');if(!v)return;const st=stats();v.dataset.yb51='1';v.innerHTML=`<div class="yb51"><section class="yb51-hero"><div class="yb51-k">YURDUNU BİL • ETKİNLİKLER</div><h1>Öğrenmeyi oyuna çevir.</h1><p>Her tur farklı soru kombinasyonu. Cevap ver, doğruyu gör, kısa notu oku ve sonra devam et.</p></section><div class="yb51-grid">${Object.entries(MODES).map(([id,m])=>`<article class="yb51-card"><div class="yb51-icon">${m.icon}</div><h3>${m.name}</h3><p>${m.desc}</p><div class="yb51-meta"><span class="yb51-chip">${m.count} soru</span><span class="yb51-chip">${Math.floor(m.time/60)} dk</span><span class="yb51-chip">Yeni kombinasyon</span></div><button class="yb51-btn" data-game="${id}">Başla →</button></article>`).join('')}</div><div class="yb51-tag-good">${st.xp||0} XP • ${st.games||0} cevap • ${st.correct||0} doğru</div></div>`}
function start(id){const m=MODES[id];if(!m)return;stopTimer();S={mode:id,items:build(m.kind),index:0,score:0,time:m.time,timer:null,answered:false,locked:false,history:true,session:S.session+1,streak:0,selected:null};pushHistory();render();S.timer=setInterval(()=>{if(!S.mode)return;S.time--;if(S.time<=0){S.time=0;stopTimer();if(!S.answered)timeout()}updateTop();},1000)}
function updateTop(){const t=$('.yb51-time');if(t){t.textContent=`${S.time} sn`;t.classList.toggle('urgent',S.time<=20)}const bar=$('.yb51-bar i');if(bar){bar.style.width=`${Math.min(100,(S.index/S.items.length)*100)}%`}}
function render(){const v=$('#view-events');if(!v)return;const m=MODES[S.mode],item=S.items[S.index];if(!item){finish();return}S.answered=false;S.locked=false;S.selected=null;v.innerHTML=`<div class="yb51"><div class="yb51-shell"><button class="yb51-back" data-back="1">← Etkinliklere dön</button><div class="yb51-box"><div class="yb51-top"><span class="yb51-pill">${m.name}</span><span class="yb51-pill">${S.index+1} / ${S.items.length}</span><span class="yb51-pill yb51-streak">${S.streak>1?'🔥 '+S.streak+' seri':'Seri 0'}</span><span class="yb51-pill yb51-time">${S.time} sn</span></div><div class="yb51-bar"><i style="width:${(S.index/S.items.length)*100}%"></i></div><div class="yb51-q">${esc(item.q)}</div>${item.extra?`<div class="yb51-learning" style="margin:0 0 14px"><b>İpucu:</b> ${esc(item.extra)}</div>`:''}<div class="yb51-opts">${item.options.map((o,i)=>`<button class="yb51-opt" data-answer="${esc(o)}" data-i="${i}">${esc(o)}</button>`).join('')}</div><div id="yb51-feedback"></div><button class="yb51-btn yb51-next" data-next="1">Devam Et →</button><div class="yb51-hint">Cevapladıktan sonra ekran sabit kalır. Doğru cevabı ve notu okuyup kendin devam edebilirsin.</div></div></div></div>`}
function timeout(){if(S.answered)return;S.answered=true;S.locked=true;const item=S.items[S.index];$$('.yb51-opt').forEach(b=>{b.disabled=true;if(b.dataset.answer===String(item.answer))b.classList.add('good')});showFeedback(false,item,true);}
function answer(value){if(S.locked||S.answered)return;S.locked=true;S.answered=true;const item=S.items[S.index],ok=String(value)===String(item.answer);S.selected=value;if(ok){S.score++;S.streak++}else S.streak=0;saveStats(ok);$$('.yb51-opt').forEach(b=>{b.disabled=true;if(b.dataset.answer===String(item.answer))b.classList.add('good');if(b.dataset.answer===String(value)&&!ok)b.classList.add('bad')});showFeedback(ok,item,false)}
function showFeedback(ok,item,timedOut){const box=$('#yb51-feedback');if(!box)return;box.className='yb51-feedback '+(ok?'correct':'wrong');box.innerHTML=`<div class="yb51-answer">${ok?'✓':'✕'} <span>Doğru cevap: <b>${esc(item.answer)}</b></span></div>${timedOut?'<div style="margin-bottom:7px;color:#ffb3be;font-weight:800">Süre doldu. Bu soruyu öğrenme fırsatına çevirelim.</div>':''}<div><strong>${ok?'Doğru!':'Yanlış.'}</strong> ${esc(item.note||'Bu bilgi için kısa bir KPSS notu.')}</div><div class="yb51-learning"><b>Mini tekrar:</b> ${esc(item.note||'Doğru cevabı tekrar et ve benzer soruda ipucunu yakala.')}</div>`;const next=$('.yb51-next');if(next){next.classList.add('show');next.disabled=true;let left=5;next.textContent=`${left} sn sonra devam et →`;const id=setInterval(()=>{left--;if(left<=0){clearInterval(id);next.disabled=false;next.textContent='Devam Et →'}else next.textContent=`${left} sn sonra devam et →`},1000)}}
function next(){if(!S.answered)return;if(S.index>=S.items.length-1){finish();return}S.index++;render()}
function finish(){stopTimer();const v=$('#view-events'),m=MODES[S.mode],pct=Math.round((S.score/S.items.length)*100),msg=pct>=85?'Harika tur! KPSS bilgilerin sağlam.':pct>=65?'İyi gidiyorsun. Yanlışları tekrar ederek neti yükselt.':'Bu turu tekrar çöz; özellikle gösterilen mini notları çalış.';v.innerHTML=`<div class="yb51"><div class="yb51-box yb51-result"><div class="yb51-k">${esc(m.name)} • TUR TAMAMLANDI</div><div class="yb51-big">${S.score}/${S.items.length}</div><h2>%${pct} başarı</h2><p>${msg}</p><div class="yb51-tag-good">${S.streak>1?'🔥 Son seri: '+S.streak:'Tekrar turu önerilir'}</div><div class="yb51-actions"><button class="yb51-btn" data-retry="1">Yeni kombinasyon →</button><button class="yb51-btn alt" data-back="1">Etkinliklere dön</button></div></div></div>`;S.answered=true;S.locked=true}
document.addEventListener('click',e=>{const game=e.target.closest('[data-game]');if(game){start(game.dataset.game);return}if(e.target.closest('[data-back]')){backToEvents(false);return}if(e.target.closest('[data-next]')){next();return}if(e.target.closest('[data-retry]')){start(S.mode);return}const opt=e.target.closest('[data-answer]');if(opt){answer(opt.dataset.answer)}});
window.YB51Games={hub,start,version:'51.0.0'};
css();hub();
})();
