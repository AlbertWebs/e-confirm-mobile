# eConfirm Mobile App - Build Script (PowerShell)
# This script builds the app for all platforms on Windows

Write-Host "🚀 Starting eConfirm Mobile App Build Process..." -ForegroundColor Blue

# Check Node version
Write-Host "Checking Node.js version..." -ForegroundColor Cyan
$nodeVersion = node -v
Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm ci

# Clean previous builds
Write-Host "Cleaning previous builds..." -ForegroundColor Cyan
npm run clean

# Build Web
Write-Host "Building Web app..." -ForegroundColor Green
$env:NODE_ENV = "production"
npm run web:build
Write-Host "✓ Web build complete! Output: web-build/" -ForegroundColor Green

# Build Android
Write-Host "Building Android app..." -ForegroundColor Green
Set-Location android
.\gradlew.bat clean
.\gradlew.bat assembleRelease
Write-Host "✓ Android APK build complete!" -ForegroundColor Green
Write-Host "APK location: android/app/build/outputs/apk/release/app-release.apk" -ForegroundColor Cyan

# Build AAB for Play Store
Write-Host "Building Android App Bundle..." -ForegroundColor Green
.\gradlew.bat bundleRelease
Write-Host "✓ Android AAB build complete!" -ForegroundColor Green
Write-Host "AAB location: android/app/build/outputs/bundle/release/app-release.aab" -ForegroundColor Cyan
Set-Location ..

Write-Host "🎉 Build process complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Build outputs:" -ForegroundColor Yellow
Write-Host "  - Web: web-build/"
Write-Host "  - Android APK: android/app/build/outputs/apk/release/"
Write-Host "  - Android AAB: android/app/build/outputs/bundle/release/"

