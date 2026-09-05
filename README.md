# Yurdunu Bil — KPSS Coğrafya

2026 KPSS Önlisans için Türkiye coğrafyasını **konu + harita verisi + soru bankası + oyun + Arena** mantığıyla çalıştıran responsive web uygulaması.

## Durum

- 81 il ve Türkiye coğrafyası veri katmanı
- Geniş KPSS coğrafya soru bankası ve konu kütüphanesi
- Mini oyunlar, flashcard, ilerleme ve liderlik özellikleri
- Supabase giriş/kayıt, sonuç ve favori senkronizasyonu
- Canlı Arena, matchmaking ve sonuç akışı
- Adaptive Learning / öğrenme ilerlemesi altyapısı
- Mobil / tablet / masaüstü responsive arayüz
- Render üzerinde statik yayın

## Kanonik mimari

Uygulama artık yeni özellikler için `vXXX` dosyaları üretmek yerine sorumluluk bazlı tek bir yapı kullanır:

```text
index.html
config.js
core/
  boot.js
  runtime.js
features/
  auth/
  home/
  library/
  games/
  arena/
  progress/
  questions/
  onboarding/
  notifications/
  flashcards/
  leaderboard/
  ui/
data/
  geography/
  learning/
  questions/
styles/
  app.css
  components.css
  features.css
  responsive.css
app.js
supabase/
scripts/
```

- `index.html` — yalnızca uygulama kabuğu ve tek canonical boot giriş noktası
- `config.js` — Supabase ve çalışma zamanı yapılandırması
- `core/runtime.js` — ortak runtime ve modül kayıt sistemi
- `core/boot.js` — veri, çekirdek ve feature yükleme sırasının merkezi sahibi
- `features/home/` — ana sayfa ve çalışma merkezi
- `features/library/` — kütüphane, çalışma, tekrar ve konu derinleştirme akışı
- `features/games/` — oyun ve etkinlik merkezi
- `features/arena/` — Arena, sosyal özellikler ve matchmaking
- `features/progress/` — ilerleme, tekrar döngüsü ve oyun gelişimi
- `features/questions/` — soru merkezi
- `features/ui/` — navigasyon, öğrenme köprüsü ve sistem yardımcıları
- `data/` — soru, konu, il, nüfus ve coğrafi veri kaynakları
- `styles/` — canonical stil girişleri ve ortak responsive katman
- `scripts/` — veri, site, production smoke ve release doğrulamaları
- `supabase/migrations/` — veritabanı değişiklikleri

## Temizlik ilkesi

Repo geçmişte çok sayıda ardışık `vXX` katmanı nedeniyle büyüdü. Temizlik sırasında çalışan davranış önce canonical feature modüllerine taşınır, referanslar doğrulanır, CI çalıştırılır ve ancak bundan sonra eski dosya kaldırılır.

Sırf dosyanın eski bir sürüm numarası taşıması, tek başına silme gerekçesi değildir. Özellikle soru bankası ve veri dosyaları içerik bütünlüğü korunarak ayrı bir veri katmanında tutulur.

Harita oyunları gibi ağır özellikler ihtiyaç anında yüklenir. Böylece ilk açılışta gereksiz JavaScript ve DOM maliyeti oluşturulmaz.

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

## Mimari kural

Yeni özellikler yeni bir `vXXX` dosyası olarak eklenmez. Değişiklik mevcut canonical feature modülüne işlenir; yeni sorumluluk gerekiyorsa `features/<alan>/` altında isimlendirilmiş bir modül oluşturulur. Birleştirme sonrası referans taraması ve CI zorunludur.
