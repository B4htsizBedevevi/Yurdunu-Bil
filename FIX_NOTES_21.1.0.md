# Yurdunu Bil 21.1.0 — Stability Fix

Mevcut özellikler korunarak harita, kart, buton ve responsive çakışmaları stabilize edildi.

- Dashboard mini harita ve full harita ortak Leaflet davranışına göre düzeltildi.
- Dashboard haritasındaki hatalı `dashLayer.resetStyle` akışı düzeltildi.
- Tile fallback yalnızca bir kez devreye giriyor; tekrar tekrar OSM layer eklenmiyor.
- Leaflet container üzerinde 3D transform/perspective kaldırıldı; görsel 3D süsleri etkileşim motorundan ayrıldı.
- Card/grid/button geometry için son stabilizasyon katmanı eklendi.
- Mobil bottom navigation için güvenli alt boşluk korundu.
- Sürüm numaraları 21.1.0 ile hizalandı.

## Doğrulama
- `npm test` başarılı.
- JS syntax kontrolü başarılı.
