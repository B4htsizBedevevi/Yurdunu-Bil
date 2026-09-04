# Yurdunu Bil — KPSS Coğrafya Atlası 23.0.0

Final unified static-site release. Tek UI çekirdeği, responsive desktop/tablet/mobile/landscape düzeni ve GeoJSON → SVG 3D atlas kullanır.

## İçerik
- 81 il
- 8 KPSS ana konu
- 120 soru
- İl kartlarında iklim, dağlar, ovalar, göller/sulak alanlar, akarsular, tarım, maden/kaynak, 2025 nüfusu, coğrafya notu ve KPSS hafıza kodu
- Harita katmanları: Standart, Bölgeler, İklim, Tarım, Dağlar, Ovalar, Su, Maden
- Seçili il sağ panelde açılır; tam ekran il modalı ve odak kaynaklı sayfa kayması yoktur.
- Supabase auth/progress/favorites/quiz sync korunur.

## Çalıştırma
`start.cmd` veya `python -m http.server 5500`

## Doğrulama
`npm test` ve `npm run check`
