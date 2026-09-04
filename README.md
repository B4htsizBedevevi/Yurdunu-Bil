# Yurdunu Bil — KPSS Coğrafya Atlası 24.1

Temizlenmiş, tek çekirdekli responsive KPSS Coğrafya Atlası. Masaüstü, tablet, telefon ve yatay/dikey ekranlara göre düzenlenir.

## İçerik
- 81 il
- 8 KPSS ana konu
- 120 soru
- İl kartlarında iklim, dağlar, ovalar, göller/sulak alanlar, akarsular, tarım, maden/kaynak, nüfus ve KPSS notları
- Harita katmanları: Standart, Bölgeler, İklim, Tarım, Dağlar, Ovalar, Su, Maden
- Su katmanında akarsular + göller; Dağlar katmanında önemli dağlar; Ovalar katmanında başlıca ovalar; Maden katmanında kaynak işaretleri gösterilir.
- Keşfedilme sistemi ve eski UX/hotfix/update scriptleri kaldırıldı.
- Supabase auth, favoriler ve quiz senkronizasyonu korunur.
- 2025 il nüfusları ayrı veri dosyasında tutulur.

## Çalıştırma
`start.cmd` veya `python -m http.server 5500`

## Doğrulama
`npm test`
`npm run check`
`npm run check:enhancer`
