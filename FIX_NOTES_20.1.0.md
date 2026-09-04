# Yurdunu Bil 20.1.0 — Stability Fix

Bu sürüm mevcut özellikleri silmeden çalışma çakışmalarını düzeltir.

## Düzeltilenler
- Leaflet haritasının v19/v20 CSS tarafından gizlenmesi kaldırıldı.
- İkinci SVG atlas motorunun Leaflet ile çakışması kaldırıldı; v19 artık yalnızca uyumluluk katmanı.
- Full map, görünür olmayan `display:none` görünümünde oluşturulmak yerine harita sekmesi açıldığında başlatılıyor.
- Harita görünümü açıldıktan sonra Leaflet `invalidateSize()` ile yeniden ölçülüyor.
- Dashboard mini harita için de yeniden ölçüm eklendi.
- Mobil drawer `open` / `yb-mobile-open` state'leri tek davranışta senkronlandı.
- Kart, grid ve butonların taşmasını önleyen son stabilizasyon CSS katmanı eklendi.
- Mobil sabit alt navigasyon için içerik alt boşluğu korunuyor.
- Sürüm bilgileri 20.1.0 ile hizalandı.

## Doğrulama
- JavaScript syntax kontrolleri başarılı.
- `npm test` başarılı.
- 81 GeoJSON il doğrulandı.
- Yerel HTTP sunucusunda `index.html` ve `data/provinces.geojson` erişimi doğrulandı.
