/* Yurdunu Bil — PDF Study Pack v28
 * Kaynak: cografya-kpss-etkinlik-haritalar.pdf
 * 35 günlük çalışma programı + etkileşimli harita etkinlikleri
 */

(() => {
  "use strict";

  const DAYS = [
    ["Jeolojik Zamanlar", "Yer kabuğunun oluşumu ve jeolojik zamanların temel sıralaması."],
    ["İç Kuvvetler 1", "Orojenez ve epirojenez."],
    ["İç Kuvvetler 2", "Volkanizma ve deprem."],
    ["Dış Kuvvetler 1", "Akarsu ve rüzgâr şekillendirmesi."],
    ["Dış Kuvvetler 2", "Buzul ve karstik şekiller."],
    ["Türkiye'nin Dağları", "Türkiye'deki dağların harita üzerinde tanınması."],
    ["Türkiye'nin Platoları", "Platoları harita üzerinde ayırt etme."],
    ["Türkiye'nin Ovaları", "Başlıca ovaları haritada eşleştirme."],
    ["İklim Elemanları", "Sıcaklık."],
    ["İklim Elemanları", "Basınç ve rüzgârlar."],
    ["İklim Elemanları", "Nem ve yağış."],
    ["Türkiye'nin İklimleri", "İklim tiplerinin dağılışı ve özellikleri."],
    ["Türkiye'de Sular", "Akarsular."],
    ["Türkiye'de Sular", "Göller."],
    ["Türkiye'de Sular", "Denizler ve körfezler."],
    ["Türkiye'de Topraklar", "Türkiye topraklarını harita üzerinde tanıma."],
    ["Türkiye'de Bitkiler", "Bitki türlerini ve dağılışlarını eşleştirme."],
    ["Doğal Afetler 1", "Doğal afetlerin görüldüğü alanları tanıma."],
    ["Doğal Afetler 2", "Doğal afetleri harita alanlarıyla ilişkilendirme."],
    ["Türkiye'de Nüfus", "Nüfus özellikleri."],
    ["Türkiye'de Nüfusun Dağılışı", "Yoğun ve seyrek nüfus alanları."],
    ["Türkiye'de Göçler", "Göç yönleri ve nedenleri."],
    ["Türkiye'de Yerleşmeler", "Yerleşme özellikleri."],
    ["Türkiye'de Tarım", "Tarım ürünlerinin bölgesel dağılışı."],
    ["Türkiye'de Hayvancılık", "Hayvancılık türleri ve alanları."],
    ["Türkiye'de Madenler", "Maden kaynaklarının dağılışı."],
    ["Türkiye'de Enerji", "Enerji kaynakları."],
    ["Türkiye'de Sanayi", "Sanayi faaliyetlerinin dağılışı."],
    ["Türkiye'de Ulaşım", "Ulaşım yolları ve coğrafi ilişkiler."],
    ["Türkiye'de Ticaret-Turizm", "Ticaret ve turizm merkezleri."],
    ["Türkiye'de Bölgeler", "Coğrafi bölgeler."],
    ["Türkiye'de Mevsimler", "Mevsimlerin Türkiye üzerindeki etkileri."],
    ["Coğrafi Konum 1", "Matematik ve özel konum."],
    ["Coğrafi Konum 2", "Konumun sonuçları."],
    ["Genel Tekrar", "35 günlük harita çalışmalarının bütünleştirilmesi."]
  ];

  const ACTIVITIES = [
    {
      id: "buzul",
      icon: "❄️",
      tag: "YERŞEKİLLERİ",
      title: "Buzul şekillerini haritada eşleştir",
      page: "3",
      mode: "mountains",
      desc:
        "PDF'deki etkinlikte numaralandırılmış buzul şekilleri ile bu şekillerin görüldüğü dağları eşleştir.",
      steps: [
        "Haritada numaralı alanları incele.",
        "Buzul şekillerinin hangi dağ kuşaklarında görüldüğünü hatırla.",
        "Site haritasında Dağlar katmanını açıp isimleri tekrar et."
      ]
    },

    {
      id: "kiyi",
      icon: "🌊",
      tag: "KIYI TİPLERİ",
      title: "Kıyı tiplerini konumlarıyla eşleştir",
      page: "4",
      mode: "default",
      desc:
        "PDF'deki Dalmaçya ve kalanklı kıyı tipi örneklerini konumlarıyla birlikte tekrar et.",
      steps: [
        "Dalmaçya kıyı tipinin Finike-Kaş arasındaki konumunu hatırla.",
        "Kalanklı kıyı tipinin Mersin-Silifke arasındaki konumunu tekrar et.",
        "Türkiye'de görülmeyen kıyı tiplerini ayrıca düşün."
      ]
    },

    {
      id: "karstik",
      icon: "🪨",
      tag: "KARSTİK",
      title: "Karstik şekil avı",
      page: "5",
      mode: "plains",
      desc:
        "Karstik kanyon ve mağara örneklerini oluşumlarıyla birlikte hatırlama çalışması.",
      steps: [
        "Karain, Dim, Damlataş, İnsuyu, Ballıca, Karaca ve Yarımburgaz örneklerini tekrar et.",
        "Köprülü, Valla ve Ulubey kanyonlarını ayır.",
        "Çözünme ile oluşan şekilleri diğer dış kuvvet şekilleriyle karıştırma."
      ]
    },

    {
      id: "foto",
      icon: "📸",
      tag: "GÖRSEL EŞLEŞTİRME",
      title: "Fotoğraf → harita eşleştirme",
      page: "6",
      mode: "default",
      desc:
        "PDF'deki fotoğraf etkinliğindeki yer şekillerini Türkiye haritasındaki konumlarıyla eşleştirme mantığını uygula.",
      steps: [
        "Tortum Şelalesi, Elmalı Polyesi ve Bafra Delta Ovası gibi örnekleri tanı.",
        "Karapınar kumulları, Büyük Menderes, Nallıhan kırgıbayırları, Peribacaları ve Kapıdağı örneklerini ayırt et.",
        "Fotoğraftan hangi dış kuvvetin etkili olduğunu söyle."
      ]
    },

    {
      id: "kivrim",
      icon: "🏔️",
      tag: "DAĞLAR",
      title: "Kıvrım dağlarını haritada öğren",
      page: "7",
      mode: "mountains",
      desc:
        "PDF'deki kıvrım dağları testinin harita temelli tekrar mantığını kullan.",
      steps: [
        "Kuzey Anadolu Dağları kuşağını ayrı düşün.",
        "Toros kuşağını ayrı düşün.",
        "Dağların kıyıya paralel uzandığı alanları haritada takip et."
      ]
    },

    {
      id: "kirik-volkanik",
      icon: "🌋",
      tag: "DAĞLAR",
      title: "Kırık ve volkanik dağları ayır",
      page: "8",
      mode: "mountains",
      desc:
        "PDF'deki kırık ve volkanik dağların birlikte gösterildiği harita çalışması.",
      steps: [
        "Kırık dağların oluşum mantığını tekrar et.",
        "Volkanik dağları haritada tek tek bul.",
        "Dağın oluşum tipi ile bulunduğu bölgeyi eşleştir."
      ]
    },

    {
      id: "plato",
      icon: "⛰️",
      tag: "PLATOLAR",
      title: "Plato haritası",
      page: "9",
      mode: "plains",
      desc:
        "PDF'deki 16 numaralı plato etkinliğinin harita tabanlı tekrar versiyonu.",
      steps: [
        "Plato adlarını bölgesel kümelere ayır.",
        "Erzurum-Kars, Bozok, Cihanbeyli ve Teke gibi örnekleri haritada bul.",
        "Plato ile çevresindeki yer şekillerini ilişkilendir."
      ]
    },

    {
      id: "ova",
      icon: "🌾",
      tag: "OVALAR",
      title: "Ovaları haritada yakala",
      page: "11-12",
      mode: "plains",
      desc:
        "PDF'deki 16 ve 25 numaralı ova çalışmalarındaki harita eşleştirme mantığını uygula.",
      steps: [
        "Kıyı ovaları ile iç ovaları ayır.",
        "Delta ovalarını ayrıca düşün.",
        "Konya, Çukurova ve Bafra gibi örnekleri haritada tekrar et."
      ]
    },

    {
      id: "akarsu",
      icon: "💧",
      tag: "AKARSULAR",
      title: "Akarsu adlandırma",
      page: "13 ve 17",
      mode: "water",
      desc:
        "PDF'deki akarsu harita çalışmalarının yöntemini etkileşimli tekrar olarak kullan.",
      steps: [
        "Akarsuyu bulunduğu bölgeyle ilişkilendir.",
        "Ergene, Asi, Devrez, Porsuk, Kelkit, Karasu ve Murat gibi adları tekrar et.",
        "Dalaman, Aksu, Manavgat ve Eşen gibi akarsuları ayrıca düşün."
      ]
    },

    {
      id: "gol",
      icon: "🏞️",
      tag: "GÖLLER",
      title: "Gölleri türleriyle eşleştir",
      page: "14",
      mode: "water",
      desc:
        "PDF'deki göl etkinliğinde verilen göl isimleri ve göl oluşum gruplarını tekrar et.",
      steps: [
        "Uzungöl, Eymir, Mogan, Marmara, Bafa ve Köyceğiz'i haritada düşün.",
        "Çıldır, Balık, Erçek, Haçlı ve Nazik örneklerini tekrar et.",
        "Tortum, Sera, Sülüklü, Abant ve Yedigöller örneklerini ayrıca ayır."
      ]
    },

    {
      id: "toprak",
      icon: "🌱",
      tag: "TOPRAKLAR",
      title: "Toprak haritasını çöz",
      page: "15 ve 18",
      mode: "default",
      desc:
        "PDF'deki renkli toprak haritası ve numaralı toprak türü etkinliklerinin yöntemini kullan.",
      steps: [
        "Haritayı iklim kuşaklarıyla birlikte oku.",
        "Renkleri ezberlemek yerine iklim-bitki-toprak ilişkisini kur.",
        "Boş bir Türkiye haritası üzerinde ana toprak türlerini tekrar et."
      ]
    },

    {
      id: "bitki",
      icon: "🌿",
      tag: "BİTKİLER",
      title: "Bitki türleri ve dağılış",
      page: "19",
      mode: "default",
      desc:
        "PDF'de verilen bitki türlerini harita üzerindeki dağılışlarıyla birlikte tekrar et.",
      steps: [
        "Doğu ladini, kayın ve sedir gibi türleri tekrar et.",
        "Kızılçam, maki ve bozkırı ayırt et.",
        "Çayır, psödomaki, karaçam ve yavşan otu gibi türleri konumlarıyla ilişkilendir."
      ]
    },

    {
      id: "iklim-bitki-toprak",
      icon: "🧩",
      tag: "BİRİKİMLİ",
      title: "İklim → bitki → toprak zinciri",
      page: "20",
      mode: "default",
      desc:
        "PDF'deki iklim-bitki-toprak eşleştirmesinin üçlü düşünme mantığını kullan.",
      steps: [
        "Önce bölgenin iklimini belirle.",
        "Ardından doğal bitki örtüsünü eşleştir.",
        "Son aşamada uygun toprak türünü bul."
      ]
    },

    {
      id: "afet",
      icon: "⚠️",
      tag: "DOĞAL AFETLER",
      title: "Doğal afet bölgelerini eşleştir",
      page: "21",
      mode: "default",
      desc:
        "PDF'deki 10 numaralı doğal afet alanı haritasının çalışma mantığı.",
      steps: [
        "Haritadaki alanı incele.",
        "O bölgede baskın doğal afet türünü düşün.",
        "Afetin oluşum nedeni ile yer şekillerini ilişkilendir."
      ]
    },

    {
      id: "nufus",
      icon: "👥",
      tag: "NÜFUS",
      title: "Yoğun / seyrek nüfus",
      page: "22-23",
      mode: "region",
      desc:
        "PDF'deki nüfus özellikleri eşleştirme ve yoğun/seyrek nüfus alanı çalışmalarını dijital tekrar haline getir.",
      steps: [
        "İstanbul-Bursa-Kocaeli çevresi gibi yoğun alanları düşün.",
        "Yıldız Dağları çevresi gibi seyrek alanları ayır.",
        "Sanayi, tarım, ulaşım, yükselti ve yer şekillerini birlikte değerlendir."
      ]
    },

    {
      id: "buyuksehir",
      icon: "🏙️",
      tag: "YERLEŞME",
      title: "Büyükşehirleri haritada işaretle",
      page: "24",
      mode: "region",
      desc:
        "PDF'deki 30 büyükşehir çalışmasının harita üzerinde bulma ve isimlendirme mantığını uygula.",
      steps: [
        "Haritayı bölgelere ayır.",
        "Büyükşehirleri tek tek bul.",
        "İsimlerini yüksek sesle tekrar et."
      ]
    },

    {
      id: "birikimli",
      icon: "🎯",
      tag: "BİRİKİMLİ TEST",
      title: "Dağ + ova + akarsu + nüfus",
      page: "25",
      mode: "default",
      desc:
        "PDF'deki birikimli çalışmanın dört farklı harita bilgisini tek çalışmada birleştirme mantığı.",
      steps: [
        "Dağları bul.",
        "Ovaları eşleştir.",
        "Akarsuları yerleştir.",
        "Nüfus yoğunluğu bilgisiyle çalışmayı tamamla."
      ]
    },

    {
      id: "unesco",
      icon: "🏛️",
      tag: "TURİZM",
      title: "UNESCO yerlerini haritada bul",
      page: "26-28",
      mode: "default",
      desc:
        "PDF'deki UNESCO ve kültürel miras haritalarında verilen merkezleri şehirleriyle eşleştirme çalışması.",
      steps: [
        "Troya, Bergama, Efes ve Xanthos-Letoon gibi örnekleri tekrar et.",
        "Çatalhöyük, Safranbolu, Selimiye, Nemrut, Divriği ve Hattuşa'yı şehirleriyle eşleştir.",
        "Göbeklitepe, Ani ve diğer kültürel miras merkezlerini haritada tekrar et."
      ]
    },

    {
      id: "koridor",
      icon: "🛣️",
      tag: "BÖLGELER",
      title: "Turizm koridorlarını çiz",
      page: "29",
      mode: "region",
      desc:
        "PDF'de gösterilen turizm koridorlarını ve üzerindeki şehirleri harita üzerinde tekrar et.",
      steps: [
        "Trakya Kültür Koridoru'nu tekrar et.",
        "Batı Karadeniz Kıyı ve Yayla koridorlarını düşün.",
        "Zeytin, İpek Yolu, İnanç ve Kış koridorlarını şehirleriyle eşleştir."
      ]
    },

    {
      id: "masif",
      icon: "🧱",
      tag: "YER KABUĞU",
      title: "Masif arazileri bul",
      page: "30",
      mode: "default",
      desc:
        "PDF'nin son etkinliğindeki koyu renkli masif arazi alanlarını harita üzerinden tekrar et.",
      steps: [
        "Haritadaki koyu alanları bölgesel olarak grupla.",
        "Masif arazi kavramını orojenez kavramından ayır.",
        "Konumlarını Türkiye haritası üzerinde tekrar et."
      ]
    }
  ];

  const STORAGE_KEY = "yb_pdf_study_v28";

  let state = {
    done: {},
    day: 0
  };

  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);

      state = {
        ...state,
        ...parsed,
        done: parsed.done || {}
      };
    } catch (error) {
      console.warn("PDF çalışma verisi okunamadı:", error);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("PDF çalışma verisi kaydedilemedi:", error);
    }
  }

  function completedCount() {
    return Object.values(state.done || {}).filter(Boolean).length;
  }

  function progressPercent() {
    if (!ACTIVITIES.length) return 0;
    return Math.round((completedCount() / ACTIVITIES.length) * 100);
  }

  function buildStudyPack() {
    const host = document.querySelector("#view-library");

    if (!host) return;
    if (host.querySelector(".pdf-study-pack")) return;

    loadState();

    const wrapper = document.createElement("section");
    wrapper.className = "pdf-study-pack surface";

    wrapper.innerHTML = `
      <div class="pdf-pack-head">
        <div>
          <span class="eyebrow">PDF ETKİNLİK ATLASI • 35 GÜN</span>
          <h2>Haritalarla çalış, bilgiyi kalıcı hale getir.</h2>
          <p>
            Yüklediğin çalışma kitabındaki günlük konu akışını ve harita
            etkinliklerini Yurdunu Bil içine taşıyan çalışma alanı.
          </p>
        </div>

        <div class="pdf-pack-progress">
          <strong>${progressPercent()}%</strong>
          <span>${completedCount()}/${ACTIVITIES.length} etkinlik</span>
        </div>
      </div>

      <div class="pdf-day-strip">
        ${DAYS.map((day, index) => `
          <button
            type="button"
            class="${index === state.day ? "active" : ""}"
            data-day="${index}">
            <b>${index + 1}</b>
            <span>${escapeHtml(day[0])}</span>
          </button>
        `).join("")}
      </div>

      <div class="pdf-day-detail">
        <span class="eyebrow">GÜN ${state.day + 1}</span>
        <h3>${escapeHtml(DAYS[state.day][0])}</h3>
        <p>${escapeHtml(DAYS[state.day][1])}</p>
      </div>

      <div class="pdf-pack-toolbar">
        <label>
          ⌕
          <input
            data-study-search
            type="search"
            placeholder="Etkinlik ara..."
          >
        </label>

        <div class="pdf-filter-buttons">
          <button type="button" class="active" data-filter="all">
            Tümü
          </button>

          <button type="button" data-filter="unfinished">
            Devam eden
          </button>

          <button type="button" data-filter="done">
            Tamamlanan
          </button>
        </div>
      </div>

      <div class="pdf-activity-grid"></div>

      <p class="pdf-source-note">
        Kaynak: <strong>cografya-kpss-etkinlik-haritalar.pdf</strong>.
        Kartlar, PDF'deki konu akışı ve etkinlik yönergelerine dayanır.
      </p>
    `;

    host.prepend(wrapper);

    renderActivities(wrapper, "all", "");
    bindStudyPack(wrapper);
  }

  function renderActivities(wrapper, filter = "all", query = "") {
    const grid = wrapper.querySelector(".pdf-activity-grid");

    if (!grid) return;

    const normalizedQuery = query
      .toLocaleLowerCase("tr-TR")
      .trim();

    const activities = ACTIVITIES.filter((activity) => {
      const completed = Boolean(state.done[activity.id]);

      let filterPass = true;

      if (filter === "done") {
        filterPass = completed;
      } else if (filter === "unfinished") {
        filterPass = !completed;
      }

      const searchable = [
        activity.title,
        activity.tag,
        activity.desc,
        activity.page
      ]
        .join(" ")
        .toLocaleLowerCase("tr-TR");

      const queryPass =
        !normalizedQuery ||
        searchable.includes(normalizedQuery);

      return filterPass && queryPass;
    });

    if (!activities.length) {
      grid.innerHTML = `
        <div class="pdf-empty">
          Bu filtrede etkinlik bulunamadı.
        </div>
      `;
      return;
    }

    grid.innerHTML = activities.map((activity) => `
      <article
        class="pdf-activity-card ${state.done[activity.id] ? "is-done" : ""}">

        <div class="pdf-ac-top">

          <span class="pdf-ac-icon">
            ${activity.icon}
          </span>

          <div>
            <small>${escapeHtml(activity.tag)}</small>
            <b>${escapeHtml(activity.title)}</b>
          </div>

          <span class="pdf-ac-page">
            s. ${escapeHtml(activity.page)}
          </span>

        </div>

        <p>
          ${escapeHtml(activity.desc)}
        </p>

        <div class="pdf-ac-actions">

          <button
            type="button"
            class="btn secondary"
            data-open-activity="${escapeHtml(activity.id)}">
            Etkinliği aç →
          </button>

          <button
            type="button"
            class="pdf-done ${state.done[activity.id] ? "checked" : ""}"
            data-toggle-done="${escapeHtml(activity.id)}">
            ${state.done[activity.id] ? "✓ Tamamlandı" : "○ Tamamla"}
          </button>

        </div>

      </article>
    `).join("");
  }

  function openActivity(activityId) {
    const activity = ACTIVITIES.find(
      (item) => item.id === activityId
    );

    if (!activity) return;

    const modal = document.createElement("div");
    modal.className = "pdf-study-modal";

    modal.innerHTML = `
      <div
        class="pdf-study-backdrop"
        data-close-study>
      </div>

      <section
        class="pdf-study-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="${escapeHtml(activity.title)}">

        <button
          type="button"
          class="pdf-close"
          data-close-study>
          ×
        </button>

        <span class="eyebrow">
          ${escapeHtml(activity.tag)}
          • PDF s. ${escapeHtml(activity.page)}
        </span>

        <h2>
          ${activity.icon}
          ${escapeHtml(activity.title)}
        </h2>

        <p class="pdf-modal-desc">
          ${escapeHtml(activity.desc)}
        </p>

        <div class="pdf-steps">
          ${activity.steps.map((step, index) => `
            <div>
              <strong>${index + 1}</strong>
              <span>${escapeHtml(step)}</span>
            </div>
          `).join("")}
        </div>

        <div class="pdf-modal-actions">

          <button
            type="button"
            class="btn primary"
            data-study-map="${escapeHtml(activity.mode)}">
            Haritayı aç →
          </button>

          <button
            type="button"
            class="btn secondary"
            data-study-complete="${escapeHtml(activity.id)}">
            ${
              state.done[activity.id]
                ? "✓ Tamamlandı"
                : "Etkinliği tamamla"
            }
          </button>

        </div>
      </section>
    `;

    document.body.appendChild(modal);

    const closeModal = () => {
      modal.remove();
    };

    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-study]")) {
        closeModal();
        return;
      }

      const mapButton = event.target.closest("[data-study-map]");

      if (mapButton) {
        const mapMode = mapButton.dataset.studyMap;

        document
          .querySelector('[data-view="map"]')
          ?.click();

        setTimeout(() => {
          const modeButton = document.querySelector(
            `#view-map [data-mode="${CSS.escape(mapMode)}"]`
          );

          modeButton?.click();
        }, 180);

        closeModal();
        return;
      }

      const completeButton =
        event.target.closest("[data-study-complete]");

      if (completeButton) {
        const id = completeButton.dataset.studyComplete;

        state.done[id] = !state.done[id];

        saveState();
        closeModal();

        refreshStudyPack();
      }
    });
  }

  function refreshStudyPack() {
    const wrapper =
      document.querySelector(".pdf-study-pack");

    if (!wrapper) return;

    const activeFilter =
      wrapper
        .querySelector(".pdf-filter-buttons .active")
        ?.dataset.filter || "all";

    const query =
      wrapper.querySelector("[data-study-search]")?.value || "";

    const progress = wrapper.querySelector(
      ".pdf-pack-progress"
    );

    if (progress) {
      progress.innerHTML = `
        <strong>${progressPercent()}%</strong>
        <span>
          ${completedCount()}/${ACTIVITIES.length} etkinlik
        </span>
      `;
    }

    const detail =
      wrapper.querySelector(".pdf-day-detail");

    if (detail) {
      detail.innerHTML = `
        <span class="eyebrow">
          GÜN ${state.day + 1}
        </span>

        <h3>
          ${escapeHtml(DAYS[state.day][0])}
        </h3>

        <p>
          ${escapeHtml(DAYS[state.day][1])}
        </p>
      `;
    }

    wrapper
      .querySelectorAll("[data-day]")
      .forEach((button) => {
        button.classList.toggle(
          "active",
          Number(button.dataset.day) === state.day
        );
      });

    renderActivities(
      wrapper,
      activeFilter,
      query
    );
  }

  function bindStudyPack(wrapper) {
    wrapper.addEventListener("click", (event) => {
      const dayButton =
        event.target.closest("[data-day]");

      if (dayButton) {
        state.day = Number(dayButton.dataset.day);

        saveState();
        refreshStudyPack();

        return;
      }

      const filterButton =
        event.target.closest("[data-filter]");

      if (filterButton) {
        wrapper
          .querySelectorAll("[data-filter]")
          .forEach((button) => {
            button.classList.toggle(
              "active",
              button === filterButton
            );
          });

        refreshStudyPack();

        return;
      }

      const openButton =
        event.target.closest("[data-open-activity]");

      if (openButton) {
        openActivity(
          openButton.dataset.openActivity
        );

        return;
      }

      const doneButton =
        event.target.closest("[data-toggle-done]");

      if (doneButton) {
        const id =
          doneButton.dataset.toggleDone;

        state.done[id] = !state.done[id];

        saveState();
        refreshStudyPack();
      }
    });

    const search =
      wrapper.querySelector("[data-study-search]");

    search?.addEventListener("input", () => {
      refreshStudyPack();
    });
  }

  let buildTimer = null;

  const observer =
    new MutationObserver(() => {
      clearTimeout(buildTimer);

      buildTimer = setTimeout(() => {
        buildStudyPack();
      }, 120);
    });

  function start() {
    buildStudyPack();

    observer.observe(document.body, {
      subtree: true,
      childList: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      start,
      { once: true }
    );
  } else {
    start();
  }
})();