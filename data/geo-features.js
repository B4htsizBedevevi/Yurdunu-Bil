/* Yurdunu Bil — KPSS coğrafya katmanları
   Eğitim amaçlı sadeleştirilmiş ulusal coğrafi unsur katmanları.
   Koordinatlar WGS84 yaklaşık konumlardır; il sınırlarının yerine geçmez.
*/
window.GEO_FEATURES = {
  rivers: [
    {name:"Kızılırmak", points:[[41.72,39.8],[40.75,39.9],[39.8,39.4],[38.7,39.0],[37.7,38.9],[36.6,38.7],[35.7,38.8],[34.7,39.1],[33.6,39.6],[32.7,40.1],[32.0,40.4]]},
    {name:"Sakarya", points:[[40.65,40.9],[40.2,40.2],[39.7,39.7],[39.1,39.4],[38.4,39.2],[37.5,39.4],[36.7,39.5],[35.8,39.6],[34.9,40.0],[34.0,40.4],[31.9,40.7]]},
    {name:"Yeşilırmak", points:[[41.1,40.3],[40.7,40.2],[40.2,40.1],[39.6,40.0],[38.9,40.0],[38.2,40.1],[37.5,40.3],[36.5,40.5],[35.5,40.6]]},
    {name:"Çoruh", points:[[42.65,41.25],[42.2,40.9],[41.7,40.7],[41.1,40.5],[40.5,40.1]]},
    {name:"Fırat", points:[[39.2,39.9],[39.0,39.2],[38.5,38.7],[38.0,38.3],[37.6,37.9],[37.2,37.4],[37.0,36.9]]},
    {name:"Dicle", points:[[41.0,39.7],[41.1,39.1],[41.3,38.6],[41.4,38.1],[41.7,37.6],[42.1,37.3]]},
    {name:"Aras", points:[[43.0,40.0],[43.4,40.1],[43.9,40.2],[44.3,40.0],[44.7,39.9]]},
    {name:"Seyhan", points:[[36.9,37.4],[36.6,37.0],[36.5,36.6],[36.7,36.3]]},
    {name:"Ceyhan", points:[[36.5,38.1],[36.3,37.7],[36.2,37.2],[36.3,36.8],[36.7,36.6]]},
    {name:"Gediz", points:[[29.9,39.2],[29.5,38.9],[29.0,38.7],[28.5,38.5],[27.9,38.5],[27.4,38.6]]},
    {name:"Büyük Menderes", points:[[30.1,38.1],[29.6,37.9],[29.0,37.7],[28.5,37.6],[27.9,37.7]]},
    {name:"Küçük Menderes", points:[[29.0,38.0],[28.5,38.1],[27.9,38.1],[27.2,38.2]]},
    {name:"Meriç", points:[[26.7,42.0],[26.8,41.6],[26.7,41.2],[26.6,40.9]]},
    {name:"Ergene", points:[[27.3,41.7],[27.7,41.5],[28.0,41.4],[28.4,41.3]]},
    {name:"Göksu", points:[[34.2,36.8],[34.0,36.5],[33.7,36.3]]},
    {name:"Manavgat", points:[[31.1,37.2],[31.0,36.9],[31.0,36.6]]},
    {name:"Dalaman", points:[[29.1,37.2],[28.9,36.9],[28.8,36.6]]},
    {name:"Aksu", points:[[30.9,37.1],[30.8,36.8],[30.7,36.5]]}
  ],
  lakes: [
    {name:"Van Gölü",lat:38.63,lon:43.0,rx:45,ry:24},{name:"Tuz Gölü",lat:38.72,lon:33.4,rx:48,ry:18},{name:"Beyşehir Gölü",lat:37.75,lon:31.45,rx:28,ry:16},{name:"Eğirdir Gölü",lat:38.0,lon:30.88,rx:22,ry:13},{name:"İznik Gölü",lat:40.43,lon:29.7,rx:20,ry:12},{name:"Manyas Gölü",lat:40.18,lon:27.98,rx:18,ry:10},{name:"Sapanca Gölü",lat:40.69,lon:30.27,rx:17,ry:9},{name:"Burdur Gölü",lat:37.75,lon:30.18,rx:24,ry:10},{name:"Acıgöl",lat:37.72,lon:29.83,rx:18,ry:8},{name:"Salda Gölü",lat:37.55,lon:29.68,rx:16,ry:9},{name:"Çıldır Gölü",lat:41.0,lon:43.25,rx:17,ry:10},{name:"Hazar Gölü",lat:38.48,lon:39.4,rx:16,ry:8},{name:"Akşehir Gölü",lat:38.56,lon:31.35,rx:25,ry:10},{name:"Eber Gölü",lat:38.62,lon:31.18,rx:20,ry:9},{name:"Uluabat Gölü",lat:40.18,lon:28.57,rx:21,ry:11}
  ],
  mountains: [
    {name:"Ağrı Dağı",lat:39.70,lon:44.30},{name:"Süphan Dağı",lat:38.93,lon:42.82},{name:"Kaçkar Dağları",lat:40.85,lon:41.15},{name:"Erciyes Dağı",lat:38.53,lon:35.45},{name:"Hasan Dağı",lat:38.12,lon:34.05},{name:"Melendiz Dağları",lat:38.20,lon:34.65},{name:"Aladağlar",lat:37.75,lon:35.15},{name:"Bolkar Dağları",lat:37.20,lon:34.55},{name:"Toroslar",lat:36.9,lon:32.2},{name:"Bey Dağları",lat:36.55,lon:30.25},{name:"Amanos Dağları",lat:36.95,lon:36.45},{name:"Uludağ",lat:40.08,lon:29.12},{name:"Kaz Dağları",lat:39.72,lon:26.95},{name:"Madra Dağları",lat:39.35,lon:27.05},{name:"Bozdağlar",lat:38.45,lon:28.0},{name:"Aydın Dağları",lat:37.75,lon:28.1},{name:"Ilgaz Dağları",lat:41.05,lon:33.65},{name:"Küre Dağları",lat:41.7,lon:33.65},{name:"Köroğlu Dağları",lat:40.65,lon:32.7},{name:"Yıldız Dağları",lat:41.85,lon:27.55},{name:"Munzur Dağları",lat:39.35,lon:39.4},{name:"Palandöken",lat:39.9,lon:41.3},{name:"Bingöl Dağları",lat:39.1,lon:40.6},{name:"Cilo-Sat Dağları",lat:37.45,lon:44.0}
  ],
  plains: [
    {name:"Çukurova",lat:36.95,lon:35.4,rx:55,ry:18},{name:"Bafra Ovası",lat:41.45,lon:36.25,rx:28,ry:11},{name:"Çarşamba Ovası",lat:41.2,lon:36.75,rx:24,ry:10},{name:"Ergene Ovası",lat:41.25,lon:27.5,rx:38,ry:13},{name:"Bursa Ovası",lat:40.2,lon:29.0,rx:24,ry:10},{name:"Balıkesir Ovası",lat:39.65,lon:27.9,rx:25,ry:10},{name:"Gediz Ovası",lat:38.6,lon:28.4,rx:38,ry:10},{name:"Büyük Menderes Ovası",lat:37.75,lon:28.3,rx:45,ry:12},{name:"Küçük Menderes Ovası",lat:38.15,lon:27.4,rx:30,ry:9},{name:"Amik Ovası",lat:36.7,lon:36.35,rx:28,ry:14},{name:"Harran Ovası",lat:36.85,lon:39.1,rx:48,ry:20},{name:"Konya Ovası",lat:38.0,lon:32.3,rx:58,ry:25},{name:"Iğdır Ovası",lat:39.95,lon:44.05,rx:35,ry:14},{name:"Erzurum Ovası",lat:39.95,lon:41.25,rx:32,ry:14},{name:"Malatya Ovası",lat:38.35,lon:38.35,rx:28,ry:11},{name:"Muş Ovası",lat:38.75,lon:41.5,rx:34,ry:13},{name:"Elbistan Ovası",lat:38.3,lon:36.8,rx:28,ry:11},{name:"Altınova",lat:40.7,lon:30.35,rx:20,ry:9}
  ],
  mines: [
    {name:"Bor",lat:39.25,lon:29.5},{name:"Krom",lat:38.5,lon:29.0},{name:"Demir",lat:39.0,lon:38.3},{name:"Bakır",lat:40.9,lon:41.6},{name:"Linyit",lat:39.5,lon:28.2},{name:"Petrol",lat:37.9,lon:41.1},{name:"Petrol",lat:37.8,lon:40.7},{name:"Doğal gaz",lat:41.0,lon:27.8},{name:"Mermer",lat:37.8,lon:29.0},{name:"Mermer",lat:38.0,lon:30.5},{name:"Zımpara taşı",lat:37.8,lon:27.8},{name:"Manyezit",lat:39.7,lon:30.5},{name:"Altın",lat:39.0,lon:27.2},{name:"Altın",lat:38.1,lon:32.6}
  ]
};
