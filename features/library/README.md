# Library Feature

Kütüphanenin tek kanonik sınırı.

## Katmanlar

- `manifest.js` — özellik sözleşmesi ve yüklenen alt katmanlar
- `content.js` — konu kartı/detay metadata zenginleştirmesi
- `library.js` — kütüphane ana görünümü ve konu sıralama
- `study.js` — çalışma modülleri
- `review.js` — tekrar/yanlış odaklı çalışma
- `expansion.js` — içerik genişletmeleri
- `deepening.js` — derin öğrenme katmanı
- `compact.js` — kompakt görünüm
- `interactions.js` — kullanıcı etkileşimleri

Yeni kütüphane davranışları burada geliştirilir; yeni `vXXX` dosyası oluşturulmaz.

Eski katmanlar, davranışları kanonik dosyalara taşındıkça ve repo referans taraması temiz geçtikten sonra silinir.
