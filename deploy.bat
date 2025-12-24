@echo off
echo ==========================================
echo      TrimTrack Deployment Script
echo ==========================================

echo.
echo [1/2] Building the application...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed. Please check the errors above.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Deploying to Vercel...
echo.
echo NOTE: If this is your first time, you will be asked to:
echo       1. Log in to Vercel (browser will open)
echo       2. Confirm project settings (press Enter for defaults)
echo.
call npx vercel --prod
if %errorlevel% neq 0 (
    echo Deployment failed.
    pause
    exit /b %errorlevel%
)

echo.
echo ==========================================
echo      Deployment Complete!
echo ==========================================
echo.
echo Your app is now live!
echo.
echo IMPORTANT NOTES:
echo - Data is stored in browser localStorage
echo - Each user's data is separate and local to their browser
echo - Clearing browser cache will reset the data
echo.
pause
