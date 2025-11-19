@echo off
title Open My Documents
color 0C
echo ================================================
echo   OPENING MY DOCUMENTS PAGE
echo ================================================
echo.
echo Opening: http://localhost:3000/sinhvien/my-documents.html
echo.
echo This page shows YOUR uploaded documents
echo ================================================
echo.

start http://localhost:3000/sinhvien/my-documents.html

timeout /t 2 /nobreak >nul
exit
