# Yurdunu Bil — KPSS Coğrafya Atlası (v8.1)

Türkiye'nin 81 ilini **gerçek il sınırlarıyla** çizilmiş interaktif bir haritada
keşfet, KPSS coğrafya konularını çalış, mini testler çöz ve ilerlemeni
hesabında (Supabase) ya da bu tarayıcıda sakla.

## Çalıştırma

Harita verisi (GeoJSON) `fetch` ile yüklendiği için `index.html`'i doğrudan
çift tıklayıp `file://` ile açmak **çalışmaz**. Basit bir yerel HTTP sunucusu
gerekir.

En kolay yöntem:
1. `start.cmd` dosyasına çift tıkla (Windows, Python gerekir).
2. Tarayıcıda otomatik olarak `http://127.0.0.1:5500` açılır.

Elle çalıştırmak istersen:
```bash
python -m http.server 8000
```
Sonra `http://localhost:8000` adresini aç.

## Dağıtım

Bu proje derleme gerektirmeyen statik bir web uygulamasıdır. `index.html`,
`style.css`, `app.js`, `config.js` ve `data/` klasörünü birlikte Netlify,
Vercel, GitHub Pages ya da herhangi bir statik hosting hizmetine yüklemen
yeterlidir. Tek şart, sunucunun `data/provinces.geojson` dosyasını normal bir
HTTP isteğiyle sunmasıdır.

Yayın öncesi yerel veri bütünlüğünü kontrol etmek için:

```bash
npm test
```

## Hesap sistemi (Supabase)

`config.js` içinde gerçek bir Supabase projesi zaten tanımlı. Kendi projenle
kullanmak istersen:

1. [supabase.com](https://supabase.com) üzerinde yeni bir proje oluştur.
2. `supabase.sql` dosyasının tamamını SQL Editor'de çalıştır (tablolar + RLS
   politikaları + yeni kullanıcı için otomatik profil tetikleyicisi kurulur).
3. Proje ayarlarından **Project URL** ve **anon/publishable key** değerlerini
   `config.js` içine yapıştır:

```js
window.YURDUNUBIL_CONFIG = {
  SUPABASE_URL: "https://XXXX.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_XXXX",
  APP_VERSION: "8.1.0",
  APP_NAME: "Yurdunu Bil"
};
```

> **SERVICE ROLE / SECRET KEY'i asla frontend'e koyma.**

Supabase bilgileri boş/geçersizse uygulama otomatik olarak **demo moda**
düşer: giriş/kayıt bu tarayıcıda `localStorage` üzerinden çalışır, veriler
cihazlar arası senkronize olmaz.

### E-posta doğrulama
Supabase Authentication ayarlarında e-posta doğrulamasını istediğin gibi
yapılandır. Açıksa, kayıt sonrası kullanıcıdan e-postasını doğrulaması
istenir; kapalıysa oturum kayıt anında açılır.

### Google ile giriş
Supabase Authentication → Providers → Google bölümünü ayrıca yapılandırman
gerekir; yapılandırılmadan "Google ile devam et" butonu çalışmaz.

## Klasör yapısı

```
index.html              — tüm ekranlar (giriş/kayıt, harita, konular, test, istatistik, ayarlar)
style.css                — tasarım
app.js                   — auth, harita, quiz, istatistik mantığı
config.js                — Supabase ayarları
supabase.sql             — veritabanı tabloları + RLS politikaları
start.cmd                — Windows için yerel sunucu başlatıcı
data/provinces.js        — 81 il için KPSS coğrafya verisi
data/provinces.geojson   — 81 ilin gerçek sınır verisi (plaka kodlu)
data/topics.js           — 8 ana konu (bullet + KPSS ipucu)
data/questions.js        — 72 soruluk test bankası
```

## v8.1 özellikleri

- **Gerçek** 81 il sınırlı Leaflet + GeoJSON haritası (önceki şematik nokta
  haritasının yerine)
- 4 harita modu: Varsayılan / Tarım / İklim / Yer şekli renklendirmesi
- 8 ana konu, konu başına bullet + "KPSS ipucu" kutusu
- 72 soruluk KPSS tarzı test bankası (kolay/orta/zor karışık)
- Konu ilerleme yüzdesi, keşif istatistikleri, favoriler
- **Gerçek Supabase e-posta/şifre + Google girişi**, e-posta doğrulama,
  şifre sıfırlama
- Supabase yokken sorunsuz çalışan demo modu (localStorage)
- Karanlık/açık tema, mobil uyumlu tasarım
- Kullanıcı bazlı ilerleme senkronizasyonu (il keşifleri, test sonuçları,
  favoriler, profil) — Row Level Security ile korunur

## Notlar / sonraki geliştirmeler

- Nüfus rakamları TÜİK ADNKS 2024 verilerine yakın, **yuvarlanmış yaklaşık**
  değerlerdir; kesin resmi rakam için TÜİK Veri Portalı'na bakılmalıdır.
- Auth ekranı ve uygulama ekranı için çift güvenlikli görünürlük/tıklanabilirlik kilidi
- Login sonrası Supabase senkronizasyonu başarısız olsa bile uygulamanın açılmaya devam etmesi
- Türkçe Auth hata mesajları ve rate-limit/bağlantı hatası yönetimi
- Daha büyük yazılar, erişilebilir odak stilleri ve belirgin buton durumları
- Çalışma Kütüphanesi, hızlı tekrar kartları ve konu filtreleri
- Responsive mobil alt navigasyon
- Harita kontrolleri ve kartlar için daha belirgin etkileşim geri bildirimi
- 500+ soruluk genişletilmiş soru bankası
- "Yanlışlarım" tekrar sistemi ve deneme modu
- Bölge bazlı ayrı katmanlar (dağ/ova/plato/iklim haritaları)
- Görsel galeri ve gerçek fotoğraflar

### Son iyileştirmeler

- Hesap açmadan kullanılabilen, tamamen yerel **misafir modu**
- Haritada açıklayıcı canlı katman bilgisi, il önerileri, ölçek, Türkiye'ye
  dönme ve seçilen ili içeren paylaşılabilir bağlantı
- Koyu CARTO altlığı ve hata durumunda otomatik OpenStreetMap yedeği
- İl keşfinde harita rengini bozan çalışma zamanı hatasının giderilmesi
- Kartlar, butonlar ve klavye odakları için daha net etkileşim geri bildirimi


## Final sürüm notu
- `data/map-engine.js` deneysel çift-harita motoru değildir; uygulamanın gerçek harita motoru `app.js` içindedir.
- GeoJSON `fetch` kullandığı için siteyi `file://` ile değil Live Server veya başka bir HTTP sunucusuyla açın.
- Frontend'e yalnızca Supabase Publishable key konur; Service Role key kullanılmaz.
