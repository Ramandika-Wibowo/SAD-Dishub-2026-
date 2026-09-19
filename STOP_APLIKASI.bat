@echo off
title Menghentikan E-Internship Suara Surabaya Media
color 0C
echo ========================================================
echo   Menghentikan Seluruh Layanan E-Internship Suara Surabaya...
echo ========================================================
echo.

echo [1/3] Menghentikan Frontend Next.js...
taskkill /F /IM node.exe > nul 2>&1

echo [2/3] Menghentikan Backend Laravel & Queue Worker...
taskkill /F /IM php.exe > nul 2>&1

echo [3/3] Memeriksa Port 3000 dan 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 :8000"') do (
    taskkill /F /PID %%a > nul 2>&1
)

echo.
echo ========================================================
echo   [BERHASIL] Seluruh sistem telah dimatikan dengan aman!
echo ========================================================
echo.
timeout /t 3
exit
