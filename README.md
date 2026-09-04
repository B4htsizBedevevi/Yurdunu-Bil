# Yurdunu Bil — KPSS Coğrafya Atlası (v21.0)

Türkiye'nin 81 ilini **gerçek il sınırlarıyla** çizilmiş interaktif haritada
keşfet, KPSS coğrafya konularını çalış, mini testler çöz ve ilerlemeni
hesabında (Supabase) ya da bu tarayıcıda sakla.

## Yenilikler — v21.0

- **3D harita efektleri** — CARTO Dark Matter tiles, glow overlay, zengin tooltip
- **Unified CSS** — config.js / ux-v20.js çakışan CSS tek yerden (style.css v21)
- **Emoji/Türkçe karakter düzeltmeleri** — tüm template string'lerde temizlendi
- **Responsive iyileştirme** — tek yetkili bottom nav yüksekliği, buton çakışmaları giderildi
- **Performans** — CARTO tile önbelleği, canvas renderer, flyToBounds animasyonu

## Çalıştırma

Harita verisi (GeoJSON) `fetch` ile yüklendiği için `index.html`'i doğrudan
çift tıklayıp `file://` ile açmak **çalışmaz**. Basit bir yerel HTTP sunucusu gerekir.

```bash
# Python 3
python -m http.server 8000
# Sonra: http://localhost:8000
```

Windows'ta `start.cmd` dosyasına çift tıklayabilirsin.

## Dağıtım (Render)

`render.yaml` ile Render'da statik site olarak deploy edilir. Build komutu yok.
`staticPublishPath: .` — root dizin yayınlanır. Her push'ta otomatik deploy.

## Klasör yapısı

```
index.html              — tüm ekranlar (giriş/kayıt, harita, konular, test, istatistik, ayarlar)
style.css               — tasarım sistemi (v4 → v21, unified responsive)
app.js                  — auth, harita, quiz, istatistik mantığı
config.js               — Supabase ayarları + UTF-8 guard
ux-v20.js               — mobil drawer + emoji repair (v21, CSS yok)
updates.js              — sürüm bildirim sistemi
data/provinces.js       — 81 il KPSS coğrafya verisi
data/provinces.geojson  — 81 ilin gerçek sınır verisi (plaka kodlu)
data/topics.js          — 8 ana konu (bullet + KPSS ipucu)
data/questions.js       — KPSS soru bankası
version.json            — güncel sürüm takibi
render.yaml             — Render deployment config
supabase.sql            — veritabanı tabloları + RLS politikaları
```

## Hesap sistemi (Supabase)

`config.js` içinde gerçek bir Supabase projesi tanımlı.
Kendi projenle kullanmak istersen `supabase.sql`'i SQL Editor'de çalıştır,
ardından URL ve publishable key'i `config.js`'e yapıştır.

> **SERVICE ROLE / SECRET KEY'i asla frontend'e koyma.**

Supabase bilgileri boş/geçersizse uygulama otomatik **demo moda** düşer.

## Notlar

- Nüfus rakamları TÜİK ADNKS 2024 verilerine yakın, yuvarlanmış yaklaşık değerlerdir.
- GeoJSON `fetch` kullandığı için siteyi `file://` ile değil HTTP sunucusuyla aç.
- Frontend'e yalnızca Supabase Publishable key konur; Service Role key kullanılmaz.
