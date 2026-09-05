@echo off
setlocal EnableExtensions

title Yurdunu Bil - PDF Study Pack v28

echo.
echo ================================================
echo       YURDUNU BIL - PDF STUDY PACK v28
echo ================================================
echo.

cd /d "%~dp0"

if not exist "study-pack-v28.js" (
    echo [HATA] study-pack-v28.js bulunamadi.
    echo.
    pause
    exit /b 1
)

if not exist "study-pack-v28.css" (
    echo [HATA] study-pack-v28.css bulunamadi.
    echo.
    pause
    exit /b 1
)

if not exist "index.html" (
    echo [HATA] index.html bulunamadi.
    echo Proje klasorunde calistirdigindan emin ol.
    echo.
    pause
    exit /b 1
)

echo [1/4] index.html kontrol ediliyor...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"$path='index.html'; ^
$content=Get-Content $path -Raw; ^
if($content -notmatch 'study-pack-v28\.css'){ ^
    $content=$content -replace '</head>', '<link rel=\"stylesheet\" href=\"study-pack-v28.css?v=28.0.0\"></head>' ^
}; ^
if($content -notmatch 'study-pack-v28\.js'){ ^
    $content=$content -replace '</body>', '<script src=\"study-pack-v28.js?v=28.0.0\"></script></body>' ^
}; ^
Set-Content $path $content -Encoding UTF8"

if errorlevel 1 (
    echo [HATA] index.html guncellenemedi.
    pause
    exit /b 1
)

echo [2/4] Baglantilar kontrol edildi.
echo [3/4] PDF calisma paketi hazir.
echo [4/4] Kurulum tamamlandi.

echo.
echo ================================================
echo       KURULUM TAMAMLANDI
echo ================================================
echo.
echo Yuklenen:
echo.
echo   study-pack-v28.js
echo   study-pack-v28.css
echo.
echo index.html icine otomatik baglandi.
echo.
echo Sonraki adim:
echo.
echo   git add .
echo   git commit -m "feat: add PDF study pack v28"
echo   git push
echo.
pause
exit /b 0