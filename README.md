# Yurdunu Bil — KPSS Coğrafya Atlası v21.3.0

Bu sürüm arayüzü baştan stabilize eder: tek CSS sistemi, responsive desktop/tablet/mobile düzeni ve Leaflet/tile altyapısı olmadan GeoJSON → SVG 3D Türkiye atlası.

## Çalıştırma
`start.cmd` ile açabilir veya `python -m http.server 5500` kullanabilirsin.

## Veri
`data/provinces.geojson`, `data/provinces.js`, `data/topics.js` ve `data/questions.js` korunmuştur.

## Supabase
`config.js` yalnızca publishable key içerir. `supabase.sql` mevcut RLS tablolarını kurar.


## 21.5.0 veri güncellemesi

İl veri kartları 81 ilin tamamında genişletildi. Her il için başlıca **dağlar, ovalar, göller/sulak alanlar ve akarsular** ayrı alanlarda tutulur; ayrıca iklim, tarım, maden/kaynak ve coğrafya notu gösterilir. Nüfus alanı 31 Aralık 2025 ADNKS verisine güncellendi.

Nüfusun resmi dayanağı TÜİK'in **Adrese Dayalı Nüfus Kayıt Sistemi Sonuçları 2025** bültenidir. Coğrafi içerik; il/kurum tanıtım sayfaları, MEB coğrafya materyalleri ve yaygın kullanılan coğrafi adlar esas alınarak KPSS için başlıca unsurlar düzeyinde özetlenmiştir.
