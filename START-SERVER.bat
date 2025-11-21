@echo off
title DocShare Server
color 0A

:: Change to script directory
cd /d "%~dp0"

:: Check if Node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js chua duoc cai dat!
    echo Vui long tai va cai dat Node.js tai: https://nodejs.org/
    pause
    exit
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Dang cai dat cac thu vien can thiet...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Cai dat that bai! Vui long kiem tra lai ket noi internet.
        pause
        exit
    )
)

cls
echo ================================================
echo   DOCSHARE SERVER - RUNNING
echo ================================================
echo.
echo Server dang chay tai: http://localhost:3000
echo.
echo Nhan Ctrl+C de dung server
echo ================================================
echo.

:: Open browser automatically
start http://localhost:3000

:: Start server
npm start

pause
