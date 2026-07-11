@echo off
REM Script untuk menjalankan Laravel Reverb WebSocket Server
REM Reverb akan berjalan di ws://localhost:8080

echo Starting Laravel Reverb WebSocket Server...
echo.
echo Reverb akan berjalan di: ws://localhost:8080
echo.
echo Untuk production, pastikan konfigurasi .env sudah benar:
echo - REVERB_HOST=yourdomain.com
echo - REVERB_PORT=443
echo - REVERB_SCHEME=wss
echo.

php artisan reverb:start --host=0.0.0.0 --port=8080
