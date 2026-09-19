@echo off
title E-Internship Suara Surabaya Media - Production Launcher
color 0A
cls

echo =============================================================
echo    MEMULAI E-INTERNSHIP SUARA SURABAYA (MODE PRODUCTION)
echo =============================================================
echo.

:: 1. Pastikan service PostgreSQL aktif
echo [1/5] Memeriksa Layanan PostgreSQL Lokal...
net start postgresql-x64-18 > nul 2>&1

:: 2. Bersihkan sisa proses lama di port 8000 dan 3000 jika ada
echo [2/5] Menyiapkan Port dan Alokasi RAM...
taskkill /F /IM php.exe > nul 2>&1
taskkill /F /IM node.exe > nul 2>&1

:: 3. Jalankan Backend Laravel & Queue Worker
echo [3/5] Menjalankan Server Backend (Laravel API & Queue)...
cd /d "%~dp0backend"
start /b php artisan serve --port=8000 > nul 2>&1
start /b php artisan queue:work > nul 2>&1

:: 4. Jalankan Frontend Next.js dalam Mode Production
echo [4/5] Menjalankan Server Frontend (Production Mode)...
cd /d "%~dp0frontend"
if not exist ".next" (
    echo       Folder build belum ditemukan. Melakukan build production perdana...
    call npm run build
)
start /b npm run start > nul 2>&1

:: 5. Tunggu sejenak dan buka browser
echo [5/5] Membuka Antarmuka Website di Browser...
timeout /t 3 > nul
start http://localhost:3000

cls
echo =============================================================
echo        E-INTERNSHIP SUARA SURABAYA MEDIA TELAH AKTIF!
echo =============================================================
echo.
echo  * Status Mode  : PRODUCTION (Super Cepat, Ringan, 0 Lag)
echo  * Frontend URL : http://localhost:3000
echo  * Backend API  : http://127.0.0.1:8000
echo  * Database     : PostgreSQL Lokal (Port 5432)
echo  * File Storage : Local Public Storage (Server Lokal)
echo.
echo -------------------------------------------------------------
echo  Informasi Akun Bawaan (Seeder):
echo   - Admin    : admin@suarasurabaya.net / password123
echo   - Pimpinan : pimpinan@suarasurabaya.net / password123
echo   - Pelamar  : ahmad.fauzi@student.ac.id / password123
echo -------------------------------------------------------------
echo.
echo  [PETUNJUK] Jendela ini dapat dibiarkan terbuka selama Anda
echo  menggunakan website.
echo.
echo  Untuk mematikan sistem kapan saja, tekan sembarang tombol di sini
echo  atau jalankan file "STOP_APLIKASI.bat".
echo =============================================================
echo.
pause > nul

echo.
echo Menghentikan seluruh layanan sistem...
taskkill /F /IM node.exe > nul 2>&1
taskkill /F /IM php.exe > nul 2>&1
echo Sistem telah berhasil dihentikan.
timeout /t 2 > nul
exit
