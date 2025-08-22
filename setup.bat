@echo off
echo Setting up Word-to-Text Converter on Windows...

echo.
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js is installed
node --version

echo.
echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Checking for .env file...
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
)

echo.
echo Setup completed successfully!
echo.
echo This application uses in-memory storage - no database required!
echo Next steps:
echo 1. Run: start.bat
echo 2. Or run: npm run dev
echo.
pause