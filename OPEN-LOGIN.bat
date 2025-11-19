@echo off
title Open Login Page
color 0A
echo ================================================
echo   OPENING LOGIN PAGE
echo ================================================
echo.
echo Opening: http://localhost:3000/login.html
echo.
echo Test accounts:
echo   Admin: admin@test.com / admin123
echo   Student: student@test.com / 123456
echo.
echo Make sure server is running first!
echo ================================================
echo.

start http://localhost:3000/login.html

timeout /t 2 /nobreak >nul
exit
