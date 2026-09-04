/* Yurdunu Bil 44 — additional KPSS geography feature data */
(()=>{
'use strict';
const g=window.GEO_FEATURES=window.GEO_FEATURES||{};
const add=(key,items)=>{g[key]=[...(g[key]||[]),...items]};
add('rivers',[
{name:'Kura',points:[[41.5,42.7],[41.7,43.1],[41.9,43.5],[42.0,43.8]]},
{name:'Göksu',points:[[37.2,34.0],[36.9,33.8],[36.7,33.6],[36.5,33.4]]},
{name:'Sarısu',points:[[38.5,43.0],[38.2,42.8],[38.0,42.6]]},
{name:'Menderes',points:[[38.0,30.0],[37.8,29.5],[37.7,28.8],[37.7,28.1]]},
{name:'Köprüçay',points:[[37.2,31.4],[37.0,31.6],[36.8,31.7]]},
{name:'Dalaman Çayı',points:[[37.3,29.1],[37.0,29.0],[36.7,28.9]]},
{name:'Aksu',points:[[37.2,31.0],[36.9,30.9],[36.6,30.8]]},
{name:'Karpuzçay',points:[[37.1,30.5],[36.9,30.3],[36.7,30.2]]},
{name:'Devrez',points:[[41.0,33.0],[40.8,32.7],[40.6,32.5]]},
{name:'Zamantı',points:[[38.1,36.7],[37.8,36.5],[37.5,36.3]]},
{name:'Göksu (Sivas)',points:[[39.4,37.2],[39.1,37.0],[38.8,36.8]]},
{name:'Kızılırmak Alt Havzası',points:[[40.3,34.5],[39.6,34.8],[38.9,35.1]]}
]);
add('lakes',[
{name:'Beyşehir Gölü',lat:37.75,lon:31.45,rx:28,ry:16},{name:'İznik Gölü',lat:40.43,lon:29.72,rx:20,ry:12},
{name:'Sapanca Gölü',lat:40.69,lon:30.28,rx:18,ry:9},{name:'Manyas Gölü',lat:40.18,lon:27.98,rx:18,ry:10},
{name:'Uluabat Gölü',lat:40.18,lon:28.57,rx:21,ry:11},{name:'Hazar Gölü',lat:38.48,lon:39.40,rx:16,ry:8},
{name:'Çıldır Gölü',lat:41.03,lon:43.25,rx:17,ry:10},{name:'Akşehir Gölü',lat:38.56,lon:31.35,rx:25,ry:10},
{name:'Eber Gölü',lat:38.62,lon:31.18,rx:20,ry:9},{name:'Bafa Gölü',lat:37.50,lon:27.45,rx:17,ry:9},
{name:'Kovada Gölü',lat:37.63,lon:30.86,rx:12,ry:6},{name:'Köyceğiz Gölü',lat:36.93,lon:28.69,rx:16,ry:9}
]);
add('plains',[
{name:'Silifke Ovası',lat:36.40,lon:33.90,rx:25,ry:9},{name:'Tarsus Ovası',lat:36.92,lon:34.90,rx:25,ry:10},
{name:'Dalaman Ovası',lat:36.78,lon:28.80,rx:20,ry:8},{name:'Milas Ovası',lat:37.32,lon:27.78,rx:20,ry:8},
{name:'Akhisar Ovası',lat:38.92,lon:27.85,rx:24,ry:9},{name:'Alaşehir Ovası',lat:38.35,lon:28.52,rx:22,ry:8},
{name:'Kütahya Ovası',lat:39.42,lon:29.98,rx:23,ry:9},{name:'Eskişehir Ovası',lat:39.78,lon:30.52,rx:27,ry:10},
{name:'Ankara Ovası',lat:39.92,lon:32.82,rx:25,ry:10},{name:'Çorum Ovası',lat:40.55,lon:34.95,rx:22,ry:9},
{name:'Tokat Ovası',lat:40.32,lon:36.55,rx:22,ry:9},{name:'Sivas Ovası',lat:39.75,lon:37.02,rx:28,ry:10},
{name:'Erzincan Ovası',lat:39.75,lon:39.48,rx:25,ry:9},{name:'Isparta Ovası',lat:37.77,lon:30.55,rx:20,ry:8},
{name:'Kahramanmaraş Ovası',lat:37.60,lon:36.95,rx:26,ry:10},{name:'Adıyaman Ovası',lat:37.75,lon:38.30,rx:24,ry:9}
]);
add('mountains',[
{name:'Küre Dağları',lat:41.70,lon:33.65},{name:'Ilgaz Dağları',lat:41.05,lon:33.65},{name:'Köroğlu Dağları',lat:40.65,lon:32.70},
{name:'Samanlı Dağları',lat:40.60,lon:29.80},{name:'Kaz Dağları',lat:39.72,lon:26.95},{name:'Madra Dağları',lat:39.35,lon:27.05},
{name:'Bozdağlar',lat:38.45,lon:28.00},{name:'Aydın Dağları',lat:37.75,lon:28.10},{name:'Geyik Dağları',lat:36.95,lon:32.75},
{name:'Bolkar Dağları',lat:37.20,lon:34.55},{name:'Aladağlar',lat:37.75,lon:35.15},{name:'Munzur Dağları',lat:39.35,lon:39.40},
{name:'Palandöken Dağları',lat:39.90,lon:41.30},{name:'Allahuekber Dağları',lat:40.50,lon:42.65},{name:'Yalnızçam Dağları',lat:41.05,lon:42.35},
{name:'Cilo Dağları',lat:37.45,lon:44.00},{name:'Sat Dağları',lat:37.55,lon:44.20},{name:'Nur Dağları',lat:36.95,lon:36.45}
]);
add('plateaus',[
{name:'Haymana Platosu',lat:39.25,lon:32.75,rx:30,ry:13},{name:'Cihanbeyli Platosu',lat:38.80,lon:32.85,rx:38,ry:14},
{name:'Obruk Platosu',lat:38.20,lon:33.25,rx:32,ry:13},{name:'Bozok Platosu',lat:39.55,lon:35.35,rx:38,ry:15},
{name:'Teke Platosu',lat:37.15,lon:29.75,rx:28,ry:13},{name:'Taşeli Platosu',lat:36.85,lon:32.95,rx:27,ry:13},
{name:'Erzurum-Kars Platosu',lat:40.05,lon:42.95,rx:48,ry:19},{name:'Ardahan Platosu',lat:41.10,lon:42.75,rx:30,ry:13},
{name:'Gaziantep Platosu',lat:37.05,lon:37.35,rx:28,ry:13},{name:'Şanlıurfa Platosu',lat:37.20,lon:38.80,rx:35,ry:15}
]);
add('mines',[
{name:'Bor',lat:39.25,lon:29.50},{name:'Bor',lat:39.65,lon:29.80},{name:'Linyit',lat:39.50,lon:28.20},
{name:'Linyit',lat:38.70,lon:29.40},{name:'Krom',lat:38.50,lon:29.00},{name:'Krom',lat:37.90,lon:28.90},
{name:'Demir',lat:39.00,lon:38.30},{name:'Demir',lat:40.55,lon:39.70},{name:'Bakır',lat:40.90,lon:41.60},
{name:'Petrol',lat:37.90,lon:41.10},{name:'Petrol',lat:37.80,lon:40.70},{name:'Doğal gaz',lat:41.00,lon:27.80},
{name:'Mermer',lat:37.80,lon:29.00},{name:'Mermer',lat:38.00,lon:30.50},{name:'Zımpara taşı',lat:37.80,lon:27.80},
{name:'Manyezit',lat:39.70,lon:30.50},{name:'Altın',lat:39.00,lon:27.20},{name:'Altın',lat:38.10,lon:32.60}
]);
})();
