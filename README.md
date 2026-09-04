# Yurdunu Bil — KPSS Coğrafya Atlası 44.0

2026 KPSS Önlisans için Türkiye coğrafyasını **harita + kısa ders notu + soru bankası + il kartları** mantığıyla çalıştıran responsive web uygulaması.

## Mimari

Uygulama artık yeni özelliklerin bağlandığı **kanonik v44 katmanına** sahiptir. Eski sürüm dosyaları geriye dönük uyumluluk için şimdilik korunur; yeni kod doğrudan eski hotfix zincirine eklenmez.

- `app.js` — ana uygulama çekirdeği, auth, navigasyon, quiz ve sayfa renderları
- `data/` — konu, soru, il, nüfus ve coğrafi veri kaynakları
- `v44-map-engine.js` — gerçek 81 il geometrisine göre atlas katmanlarını kırpar ve temizler
- `data/geo-features-v44.js` — v44 coğrafi unsur veri genişletmesi
- `v44-architecture.js` — kanonik runtime kayıt/diagnostic/uyumluluk katmanı
- `v44-architecture.css` — mimari seviyede responsive görsel normalizasyon
- `v41-atlas.*` — mevcut atlas arayüzünün geriye dönük uyumluluk katmanı

## İçerik

- 81 il
- Türkiye il geometrileri
- Bölge, iklim, tarım ve nüfus tematik haritaları
- Akarsu, göl, ova, plato, dağ ve maden katmanları
- İl bazlı çalışma kartları
- KPSS coğrafya soru bankası
- Mini test ve sonuç takibi
- Favoriler
- Supabase giriş/kayıt ve ilerleme senkronizasyonu
- Mobil/tablet/masaüstü responsive arayüz

## Çalıştırma

`npm install`

`npm test`

veya statik geliştirme için `python -m http.server 5500`

## Doğrulama

`npm test` artık 81 il geometrisini, yerel assetleri, JavaScript sözdizimini, tek mobil harita hedefini ve v44 kanonik mimari dosyalarını kontrol eder.
