@echo off
title DocShare Server - Running
color 0A
echo ================================================
echo   DOCSHARE SERVER - RUNNING
echo ================================================
echo.
echo Server dang chay tai: http://localhost:3000
echo.
echo Nhan Ctrl+C de dung server
echo ================================================
echo.

cd /d "%~dp0"
node server.js

pause
