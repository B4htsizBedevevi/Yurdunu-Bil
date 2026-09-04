/* Yurdunu Bil — Visual Lessons v28
 * Original UI/data presentation built from the user's uploaded KPSS geography notes.
 * Does not copy page artwork; it re-expresses the learning structure as interactive web cards.
 */
(() => {
  'use strict';

  const LESSONS = [
    {
      id:'konum', icon:'🧭', tag:'KONUM', title:'Türkiye’nin Coğrafi Konumu',
      intro:'Mutlak ve göreceli konumu tek ekranda ayır; sayı, sonuç ve harita ilişkisini birlikte gör.',
      chips:['36°–42° K','26°–45° D','76 dk','666 km'],
      blocks:[
        ['Mutlak konum','Enlem ve boylama göre belirlenir. Türkiye 36°–42° Kuzey paralelleri ile 26°–45° Doğu meridyenleri arasındadır.','36–42 / 26–45'],
        ['Göreceli konum','Kıtalara, denizlere, boğazlara, komşulara, dağlara, ovalara ve yer altı kaynaklarına göre değerlendirilir.','ASYA + AVRUPA + BOĞAZLAR'],
        ['KPSS kilidi','19 meridyen × 4 dakika = 76 dakika; 6 paralel × 111 km = 666 km.','19×4 / 6×111']
      ],
      mapMode:'default'
    },
    {
      id:'daglar', icon:'⛰️', tag:'YERŞEKİLLERİ', title:'Dağlar: Kıvrım • Kırık • Volkanik',
      intro:'Dağın türünü, oluşumunu ve Türkiye’deki tipik örneğini aynı kartta eşleştir.',
      chips:['Kıvrım','Horst–Graben','Volkanik','5137 m'],
      blocks:[
        ['Kıvrım dağlar','Türkiye’deki dağların çoğu bu gruptadır. Kuzey Anadolu Dağları ve Toroslar başlıca örneklerdir.','ANTİKLİNAL ↑ / SENKLİNAL ↓'],
        ['Kırık dağlar','Faylanma sonucunda horst yükselir, graben çöker. Ege Bölgesi’nde yaygındır.','HORST ↑ / GRABEN ↓'],
        ['Volkanik dağlar','Magma yüzeye çıkıp birikir. Ağrı 5137 m ile Türkiye’nin en yüksek noktasıdır; Erciyes, Süphan, Tendürek ve Nemrut önemli örneklerdir.','AĞRI 5137 m']
      ],
      mapMode:'mountains'
    },
    {
      id:'ovalard', icon:'🌾', tag:'OVALAR', title:'Ovalar: Oluşumlarına Göre',
      intro:'Delta, tektonik, karstik ve volkanik ovaları oluşum şemasıyla ayır.',
      chips:['Delta','Tektonik','Karstik','Volkanik'],
      blocks:[
        ['Delta ovası','Akarsuyun taşıdığı alüvyonun kıyıda birikmesiyle oluşur. Çarşamba–Yeşilırmak, Bafra–Kızılırmak, Çukurova–Seyhan+Ceyhan önemli örneklerdir.','AKARSU → ALÜVYON → KIYI'],
        ['Tektonik ova','Fay hatlarında oluşan çöküntü alanlarıdır. Gediz, Küçük Menderes, Büyük Menderes, Konya, Erzincan, Muş ve Pasinler örneklenir.','FAY → ÇÖKÜNTÜ'],
        ['Karstik / volkanik','Karstik ovalar kalker-kireçtaşı-jips çözünmesiyle; volkanik ovalar lavların çukur alanları doldurmasıyla oluşur.','ÇÖZÜNME / LAV']
      ],
      mapMode:'plains'
    },
    {
      id:'goller', icon:'🏞️', tag:'GÖLLER', title:'Göller: Kökeniyle Hafızaya Al',
      intro:'Göl adını tek başına ezberlemek yerine oluşum türü + örnek + ayırt edici özelliği birlikte öğren.',
      chips:['Tektonik','Volkanik','Karstik','Set'],
      blocks:[
        ['Tektonik','Van, Beyşehir, Eğirdir, Kovada, Tuz, Manyas ve Aktaş gibi örnekler.','FAY / ÇÖKÜNTÜ'],
        ['Volkanik','Nemrut kaldera gölü; Meke maar gölü. Aygır ve Gölcük de volkanik kökenli örnekler arasında verilir.','KRATER / MAAR'],
        ['Set gölleri','Heyelan seti, kıyı seti, alüvyal set ve volkanik set başlıkları altında gruplanır. Terkos, Büyükçekmece, Küçükçekmece; Bafa ve Köyceğiz gibi örnekleri türleriyle eşleştir.','ENGEL → GÖL'],
        ['KPSS kilidi','Van: Türkiye’nin en büyük gölü, sodalı. Beyşehir: Türkiye’nin en büyük tatlı su gölü. Tuz: su seviyesi yıl içinde en fazla değişen göl.','VAN / BEYŞEHİR / TUZ']
      ],
      mapMode:'water'
    },
    {
      id:'akarsular', icon:'💧', tag:'AKARSULAR', title:'Akarsular: Havza + Yön + Özellik',
      intro:'Bir akarsuyu sadece adıyla değil; kaynağı, döküldüğü havza ve ülke sınırları içindeki konumuyla düşün.',
      chips:['Kızılırmak','Fırat–Dicle','Meriç','Asi'],
      blocks:[
        ['Yurt dışına dökülenler','Çoruh Karadeniz’e; Aras–Kura Hazar’a; Fırat–Dicle Basra Körfezi’ne ulaşır.','SINIRI AŞAR'],
        ['Yurt dışından gelenler','Meriç ve Asi Türkiye’ye dışarıdan gelir.','DIŞARIDAN GELİR'],
        ['Sınırlarımız içindeki en uzun','Kızılırmak Türkiye sınırları içinde doğup denize ulaşır. Toplam uzunluğu en fazla olan akarsu ise Fırat’tır.','KIZILIRMAK ≠ FIRAT'],
        ['Kapalı havzalar','Konya, Tuz Gölü, Afyon, Burdur ve Seyfe başlıca kapalı havza örnekleri olarak verilir.','DENİZE ULAŞMAZ']
      ],
      mapMode:'water'
    },
    {
      id:'iklim', icon:'🌦️', tag:'İKLİM', title:'İklim Elemanları: Sebep → Sonuç',
      intro:'Sıcaklık, basınç, rüzgâr, nem ve yağışı birbirinden koparmadan öğren.',
      chips:['200 m = 1°C','Sibirya','İzlanda','Asor + Basra'],
      blocks:[
        ['Yükselti','Her 200 metrede sıcaklık yaklaşık 1°C azalır. Batıdan doğuya yükselti arttığı için doğuya gidildikçe sıcaklık düşer.','↑ YÜKSELTİ → ↓ SICAKLIK'],
        ['Basınç merkezleri','Sibirya termik yüksek basıncı kışın soğuk; İzlanda dinamik alçak basıncı ılık ve yağışlı hava getirir. Asor yüksek, Basra alçak basıncı yaz koşullarında etkilidir.','KIŞ / YAZ'],
        ['Rüzgârlar','KaYıP: Karayel–Yıldız–Poyraz soğutucu; SaKaL: Samyeli–Kıble–Lodos ısıtıcı.','KaYıP / SaKaL'],
        ['Yağış','Konveksiyonel, orografik ve frontal oluşumları ayır. Karadeniz kıyılarında orografik; Akdeniz’de kışın frontal yağış önemlidir.','YÜKSELEN HAVA']
      ],
      mapMode:'climate'
    },
    {
      id:'toprak-bitki', icon:'🌱', tag:'TOPRAK + BİTKİ', title:'İklim → Bitki → Toprak',
      intro:'Harita sorularında üç bilgiyi aynı zincire bağla; tek tek ezber yerine ilişki kur.',
      chips:['Maki','Bozkır','Kayın','Doğu Ladini'],
      blocks:[
        ['Kıyı kuşağı','Nemli ve yağışlı koşullar doğal ormanların gelişmesini destekler. Karadeniz’de orman, Akdeniz’de maki tipik örneklerdir.','İKLİM → BİTKİ'],
        ['İç kesimler','Kuraklık ve karasallık arttıkça bozkır alanları genişler.','KARASALLIK → BOZKIR'],
        ['Harita etkinliği','PDF’de Doğu Ladini, Kayın, Sedir, Kızılçam, Maki, Bozkır, Defne, Çayır, Psödomaki, Antropojen Bozkır, Karaçam ve Yavşan Otu gibi türlerle eşleştirme çalışması bulunuyor.','12 TÜRLÜ EŞLEŞTİRME']
      ],
      mapMode:'default'
    },
    {
      id:'nufus', icon:'👥', tag:'NÜFUS', title:'Nüfus: Yoğunluk Haritasını Okuma',
      intro:'Yoğunluk sorusunda iklim + yer şekli + ekonomik faaliyet üçlüsünü birlikte değerlendir.',
      chips:['Yoğun','Seyrek','Göç','Yerleşme'],
      blocks:[
        ['Yoğun alan mantığı','Sanayi, tarım, ulaşım ve büyük ovalar nüfusu çekebilir. Marmara çevresi bunun güçlü örneklerinden biridir.','EKONOMİ + ULAŞIM'],
        ['Seyrek alan mantığı','Yüksek, engebeli veya ulaşımı zor alanlarda nüfus yoğunluğu düşebilir.','YÜKSELTİ + ENGE DELİLİK'],
        ['Etkinlik','PDF’de nüfus özellikleri eşleştirme, yoğun-seyrek alanları boyama ve 30 büyükşehir belediyesi çalışmaları yer alıyor.','HARİTADA SINIFLANDIR']
      ],
      mapMode:'region'
    },
    {
      id:'tarim', icon:'🌾', tag:'TARIM', title:'Tarım Ürününü Görünce Bölgeyi Hatırla',
      intro:'Ürünü tek başına ezberleme; iklim, relief ve üretim alanı ile birlikte hatırla.',
      chips:['Buğday','Arpa','Şeker Pancarı','Anason'],
      blocks:[
        ['Konya örneği','Yüklenen görselde Konya haritası üzerinde buğday, arpa, şeker pancarı, ayçiçeği, mısır, anason ve kenevir gibi ürünler gösteriliyor. Bu çalışma siteye “ürün → il” eşleştirmesi olarak dönüştürülebilir.','KONYA ÜRÜN HARİTASI'],
        ['Doğu Karadeniz','Fındık üretimi başta Ordu ve Giresun olmak üzere kıyı kuşağında öne çıkar; ürünün iklim–yer şekli ilişkisini hatırla.','FINDIK → DOĞU KARADENİZ'],
        ['Çalışma biçimi','Kartı kapatmadan haritada ilgili ili bul, sonra ürünü tekrar söyle.','ÜRÜN → İL → HARİTA']
      ],
      mapMode:'agriculture'
    },
    {
      id:'turizm', icon:'🏛️', tag:'TURİZM', title:'Turizmde Yer + Şehir + Özellik',
      intro:'Merkezi görür görmez şehir ve ayırt edici özelliği birlikte söyle.',
      chips:['Troya','Pamukkale','Göbeklitepe','Safranbolu'],
      blocks:[
        ['Kültürel miras','PDF’de Troya, Bergama, Efes, Xanthos-Letoon, Çatalhöyük, İstanbul’un tarihî alanları, Ani, Afrodisias, Pamukkale-Hierapolis, Kapadokya, Göbeklitepe, Safranbolu ve başka merkezler harita üzerinde gösteriliyor.','YER → ŞEHİR'],
        ['Şehir eşleştirme','Troya–Çanakkale, Efes–İzmir, Pamukkale–Denizli, Göbeklitepe–Şanlıurfa, Safranbolu–Karabük gibi eşleştirmeler ayrı ayrı çalışılabilir.','ŞEHİR KODU'],
        ['Koridorlar','Turizm koridorları haritada şehir zinciri şeklinde izleniyor: Trakya Kültür, Batı Karadeniz Kıyı, Yayla, Zeytin, İpek Yolu, İnanç ve Kış koridorları.','ŞEHİR ZİNCİRİ']
      ],
      mapMode:'region'
    }
  ];

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function render(root, active='konum', query='') {
    const hit=LESSONS.filter(x=>!query || (x.title+' '+x.tag+' '+x.intro).toLocaleLowerCase('tr-TR').includes(query.toLocaleLowerCase('tr-TR')));
    const lesson=LESSONS.find(x=>x.id===active)||hit[0]||LESSONS[0];
    root.innerHTML=`
      <section class="visual-lessons surface">
        <div class="vl-head">
          <div>
            <span class="eyebrow">GÖRSEL HIZLI TEKRAR • KPSS COĞRAFYA</span>
            <h2>Kitap tarzı değil, kitap mantığıyla çalışan dijital notlar.</h2>
            <p>Başlık → görsel şema → kilit bilgi → harita uygulaması. Aynı konuyu birkaç farklı açıdan görerek çalış.</p>
          </div>
          <div class="vl-counter"><b>${LESSONS.length}</b><span>görsel ders</span></div>
        </div>

        <div class="vl-tabs">${LESSONS.map(x=>`<button type="button" class="${x.id===lesson.id?'active':''}" data-vlesson="${x.id}"><span>${x.icon}</span><small>${esc(x.tag)}</small><b>${esc(x.title)}</b></button>`).join('')}</div>

        <div class="vl-toolbar">
          <label>⌕ <input data-vlesson-search value="${esc(query)}" placeholder="Görsel dersi ara..."></label>
          <span>Seçili ders: <strong>${esc(lesson.title)}</strong></span>
        </div>

        <article class="vl-lesson">
          <div class="vl-hero">
            <div class="vl-icon">${lesson.icon}</div>
            <div><span class="eyebrow">${esc(lesson.tag)}</span><h3>${esc(lesson.title)}</h3><p>${esc(lesson.intro)}</p></div>
          </div>

          <div class="vl-chips">${lesson.chips.map(c=>`<span>${esc(c)}</span>`).join('')}</div>

          <div class="vl-grid">
            ${lesson.blocks.map((b,i)=>`<section class="vl-block vl-block-${i%4}"><div class="vl-block-head"><b>${esc(b[0])}</b><span>${String(i+1).padStart(2,'0')}</span></div><p>${esc(b[1])}</p><div class="vl-code">${esc(b[2])}</div></section>`).join('')}
          </div>

          <div class="vl-visual-row">
            <div class="vl-diagram">
              <div class="vl-diagram-title">Hızlı şema</div>
              ${diagram(lesson)}
            </div>
            <div class="vl-apply">
              <span class="eyebrow">AKTİF ÖĞRENME</span>
              <h4>Bilgiyi haritada uygula.</h4>
              <p>Önce kartı oku, sonra haritadaki ilgili katmanı aç ve konuyu görsel olarak tekrar et.</p>
              <button class="btn primary" type="button" data-vlesson-map="${esc(lesson.mapMode)}">Haritada uygula →</button>
            </div>
          </div>
        </article>
      </section>`;
  }

  function diagram(l){
    if(l.id==='konum') return `<div class="vl-flow"><strong>36°–42° K</strong><i>ENLEM</i><strong>26°–45° D</strong><i>BOYLAM</i><strong>19×4 = 76 dk</strong></div>`;
    if(l.id==='daglar') return `<div class="vl-formation"><span>↑ Horst</span><div>FAY</div><span>↓ Graben</span><b>🌋 Volkanik</b></div>`;
    if(l.id==='ovalard') return `<div class="vl-formation"><span>🌊 Akarsu</span><b>→ Alüvyon</b><span>→ Delta</span><i>Fay → Tektonik</i></div>`;
    if(l.id==='goller') return `<div class="vl-formation grid"><span>Fay</span><span>Volkan</span><span>Karst</span><span>Set</span><b>↓</b><b>↓</b><b>↓</b><b>↓</b></div>`;
    if(l.id==='akarsular') return `<div class="vl-river"><span>KAYNAK</span><b>~~~~~~~→</b><span>HAVZA</span><b>~~~~~~~→</b><span>DENİZ / GÖL</span></div>`;
    if(l.id==='iklim') return `<div class="vl-climate"><span>☀️</span><b>Isınma</b><span>⬆️</span><b>Yükselme</b><span>☁️</span><b>Yağış</b></div>`;
    if(l.id==='toprak-bitki') return `<div class="vl-climate"><span>🌦️</span><b>İklim</b><span>→</span><b>🌿 Bitki</b><span>→</span><b>🌱 Toprak</b></div>`;
    if(l.id==='nufus') return `<div class="vl-pop"><div><b>YOĞUN</b><span>🏙️ 🏭 🚆</span></div><div><b>SEYREK</b><span>⛰️ 🌵 🚧</span></div></div>`;
    if(l.id==='tarim') return `<div class="vl-pop"><div><b>ÜRÜN</b><span>🌾 🌻 🌽</span></div><div><b>İL</b><span>📍 KONYA</span></div></div>`;
    return `<div class="vl-pop"><div><b>YER</b><span>🏛️</span></div><div><b>ŞEHİR</b><span>📍</span></div></div>`;
  }

  function mount(){
    const host=document.querySelector('#view-library');
    if(!host || host.querySelector('.visual-lessons')) return;
    const shell=document.createElement('div');
    shell.className='visual-lessons-anchor';
    host.prepend(shell);
    render(shell);

    shell.addEventListener('click',e=>{
      const tab=e.target.closest('[data-vlesson]');
      if(tab){render(shell,tab.dataset.vlesson,shell.querySelector('[data-vlesson-search]')?.value||'');return;}
      const map=e.target.closest('[data-vlesson-map]');
      if(map){
        document.querySelector('[data-view="map"]')?.click();
        setTimeout(()=>document.querySelector(`#view-map [data-mode="${CSS.escape(map.dataset.vlessonMap)}"]`)?.click(),180);
      }
    });
    shell.addEventListener('input',e=>{
      if(e.target.matches('[data-vlesson-search]')) render(shell,undefined,e.target.value);
    });
  }

  const observer=new MutationObserver(()=>mount());
  function start(){mount();observer.observe(document.body,{subtree:true,childList:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
