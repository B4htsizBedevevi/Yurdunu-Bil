@echo off
title Yurdunu Bil - KPSS Cografya
color 0B

cd /d "%~dp0"

echo.
echo ===============================================
echo             YURDUNU BIL - KPSS COGRAFYA
echo ===============================================
echo.

where py >nul 2>nul

if %errorlevel%==0 (

    echo Python bulundu.
    echo Yerel sunucu baslatiliyor...
    echo.

    start "" "http://127.0.0.1:5500"

    py -m http.server 5500

    goto END
)

where python >nul 2>nul

if %errorlevel%==0 (

    echo Python bulundu.
    echo Yerel sunucu baslatiliyor...
    echo.

    start "" "http://127.0.0.1:5500"

    python -m http.server 5500

    goto END
)

echo.
echo Python bulunamadi.
echo.
echo VS Code Live Server veya baska
echo bir yerel HTTP sunucusu ile
echo index.html dosyasini calistirabilirsin.
echo.
echo NOT: index.html dosyasini dogrudan cift tiklayip
echo file:// ile acmak haritanin calismamasina neden olur,
echo cunku harita verisi (GeoJSON) fetch ile yukleniyor.
echo.

pause

:END
