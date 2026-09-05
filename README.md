# Yurdunu Bil — KPSS Coğrafya

2026 KPSS Önlisans için Türkiye coğrafyasını **konu + harita verisi + soru bankası + oyun + Arena** mantığıyla çalıştıran responsive web uygulaması.

## Durum

- Sürüm: **63.1.0**
- 81 il verisi ve coğrafi veri kaynakları
- KPSS coğrafya soru bankası ve konu kütüphanesi
- Mini oyunlar, flashcard, ilerleme ve liderlik özellikleri
- Supabase giriş/kayıt, sonuç ve favori senkronizasyonu
- Canlı Arena altyapısı ve Supabase migration'ları
- Mobil / tablet / masaüstü responsive arayüz
- Render üzerinde statik yayın

## Yapı

- `index.html` — uygulama kabuğu ve yükleme sırası
- `app.js` — ana uygulama çekirdeği, auth, navigasyon ve temel ekranlar
- `data/` — soru, konu, il, nüfus ve coğrafi veri kaynakları
- `arena-v1.js` / `v53-arena-social.js` — Arena ve sosyal oyun altyapısı
- `v55-games-plus.js` — oyun merkezi
- `v89-command-center.js` / `v90-command-center.js` — ana sayfa ve çalışma merkezi
- `core/runtime.js` — deterministik runtime kaynağı
- `scripts/` — site, veri, JavaScript ve release doğrulamaları
- `supabase/migrations/` — Arena ve öğrenme sistemi veritabanı değişiklikleri

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
3. Tüm JavaScript dosyalarının syntax kontrolü
4. Üretim dosyalarının bulunabilirliği
5. Sürüm ve release bütünlüğü

GitHub Actions, `main` dalına yapılan değişikliklerde bu kontrolleri otomatik çalıştırır.

## Mimari hedef

Yeni özellikler eski sürüm dosyalarının üzerine rastgele eklenmek yerine, mevcut çalışan çekirdeği koruyarak kademeli şekilde kanonik modüllere taşınacaktır. Eski dosyalar yalnızca gerçekten kullanılmıyorsa temizlenecektir; çalışan özellikler sırf dosya adı eski diye silinmeyecektir.
