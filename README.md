# Yurdunu Bil — KPSS Coğrafya

2026 KPSS Önlisans için Türkiye coğrafyasını **konu + harita verisi + soru bankası + oyun + Arena** mantığıyla çalıştıran responsive web uygulaması.

## Durum

- Release tabanı: **98.0.0**
- 81 il ve Türkiye coğrafyası veri katmanı
- Geniş KPSS coğrafya soru bankası ve konu kütüphanesi
- Mini oyunlar, flashcard, ilerleme ve liderlik özellikleri
- Supabase giriş/kayıt, sonuç ve favori senkronizasyonu
- Canlı Arena, matchmaking ve server-authoritative sonuç akışı
- Adaptive Learning / öğrenme ilerlemesi altyapısı
- Mobil / tablet / masaüstü responsive arayüz
- Render üzerinde statik yayın

## Kanonik uygulama yapısı

- `index.html` — uygulama kabuğu ve kontrollü yükleme sırası
- `app.js` — auth, temel navigasyon ve uygulama çekirdeği
- `config.js` — Supabase ve çalışma zamanı yapılandırması
- `style.css` / `theme-terra.css` / `responsive.css` — temel görsel sistem
- `data/` — soru, konu, il, nüfus ve coğrafi veri kaynakları
- `v90-command-center.js` — aktif ana sayfa / çalışma merkezi
- `v90-library-compact.js` — aktif kütüphane düzeni
- `v88-question-center.js` — soru merkezi
- `v98-ui-cohesion.js` — merkezi navigasyon ve lazy-load harita akışı
- `v98-events-plus.js` — etkinlik/günlük görev akışı
- `v91-learning-bridge.js` / `v104-progress-loop.js` — öğrenme ve ilerleme köprüleri
- `v108-game-progression.js` — oyun ilerlemesi ve başarı sistemi
- `arena-v1.js` / `v53-arena-social.js` / `v79-arena-matchmaking.js` — Arena altyapısı
- `v55-games-plus.js` — oyun merkezi
- `v99-map-games.js` — yalnızca harita açıkça istendiğinde yüklenen harita oyunları
- `core/runtime.js` — deterministik runtime kaynağı
- `scripts/` — veri, site, production smoke ve release doğrulamaları
- `supabase/migrations/` — Arena ve öğrenme sistemi veritabanı değişiklikleri

## Temizlik ilkesi

Repo geçmişteki sürüm katmanlarının birikmesi nedeniyle gereksiz dosyalarla şişmişti. Temizlikte yalnızca **kanıtlanmış şekilde kullanılmayan veya boş uyumluluk dosyaları** kaldırılır. Soru verileri ve çalışan özellikler sırf eski sürüm numarası taşıyor diye silinmez.

Aktif dosyalar tek bir yükleme zincirinde tutulur; eski shell/navigation katmanları uygulama girişinden çıkarılmıştır. Harita da yalnızca açıkça istendiğinde yüklenerek başlangıçta gereksiz DOM/JS yükünü azaltır.

## Geliştirme

```bash
npm install
npm test
```

Statik geliştirme için:

```bash
python -m http.server 5500
```

## Kalite kontrolü

`npm test` şu kontrolleri çalıştırır:

1. Yerel asset ve HTML referansları
2. Soru / konu / il veri bütünlüğü
3. JavaScript syntax kontrolü
4. Production dosyalarının bulunabilirliği
5. Sürüm ve release bütünlüğü

GitHub Actions, `main` dalına yapılan değişikliklerde bu kontrolleri otomatik çalıştırır.

## Mimari hedef

Yeni özellikler yeni bir `vXXX` dosyası eklemek yerine mümkün olduğunca mevcut kanonik modüllere taşınacaktır. Birleştirme sırasında önce bağımlılık ve yükleme sırası doğrulanır, ardından gereksiz katman kaldırılır ve CI ile tekrar doğrulanır.
