@echo off
title Open Upload Page
color 0B
echo ================================================
echo   OPENING UPLOAD PAGE
echo ================================================
echo.
echo Opening: http://localhost:3000/sinhvien/upload.html
echo.
echo Make sure server is running first!
echo ================================================
echo.

start http://localhost:3000/sinhvien/upload.html

timeout /t 2 /nobreak >nul
exit
