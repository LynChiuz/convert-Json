@echo off
title Word-to-Text Converter

echo Starting Word-to-Text Converter on Windows...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed
    echo Please run setup.bat first or install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist node_modules (
    echo Dependencies not installed. Installing now...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if .env exists
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
)

echo Starting development server...
echo.
echo Application will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

set NODE_ENV=development
tsx server/index.ts