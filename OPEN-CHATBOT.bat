@echo off
title Open Chatbot
color 0E
echo ================================================
echo   OPENING CHATBOT
echo ================================================
echo.
echo Opening: http://localhost:3000/chatbotAI/chat.html
echo.
echo Features:
echo   - Chat with AI assistant
echo   - Upload files for AI analysis
echo   - Get document recommendations
echo.
echo Make sure server is running first!
echo ================================================
echo.

start http://localhost:3000/chatbotAI/chat.html

timeout /t 2 /nobreak >nul
exit
