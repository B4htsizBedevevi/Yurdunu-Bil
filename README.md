# Yurdunu Bil — KPSS Coğrafya Atlası v21.2.0

Bu sürüm arayüzü baştan stabilize eder: tek CSS sistemi, responsive desktop/tablet/mobile düzeni ve Leaflet/tile altyapısı olmadan GeoJSON → SVG 3D Türkiye atlası.

## Çalıştırma
`start.cmd` ile açabilir veya `python -m http.server 5500` kullanabilirsin.

## Veri
`data/provinces.geojson`, `data/provinces.js`, `data/topics.js` ve `data/questions.js` korunmuştur.

## Supabase
`config.js` yalnızca publishable key içerir. `supabase.sql` mevcut RLS tablolarını kurar.
