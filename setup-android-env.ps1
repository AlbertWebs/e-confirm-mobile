# Android Environment Setup Script for Windows
# Run this script to configure Android development environment

Write-Host "=== Android Environment Setup ===" -ForegroundColor Cyan

# Check for Android SDK in common locations
$sdkPaths = @(
    "$env:LOCALAPPDATA\Android\Sdk",
    "C:\Android\Sdk",
    "$env:USERPROFILE\AppData\Local\Android\Sdk"
)

$foundSdk = $null
foreach ($path in $sdkPaths) {
    if (Test-Path $path) {
        $foundSdk = $path
        Write-Host "✓ Found Android SDK at: $path" -ForegroundColor Green
        break
    }
}

if (-not $foundSdk) {
    Write-Host "✗ Android SDK not found in common locations" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Android Studio from: https://developer.android.com/studio" -ForegroundColor Yellow
    Write-Host "Or set ANDROID_HOME manually to your SDK location" -ForegroundColor Yellow
    exit 1
}

# Check for ADB
$adbPath = Join-Path $foundSdk "platform-tools\adb.exe"
if (Test-Path $adbPath) {
    Write-Host "✓ ADB found at: $adbPath" -ForegroundColor Green
} else {
    Write-Host "✗ ADB not found. Install Android SDK Platform-Tools" -ForegroundColor Red
    Write-Host "  Open Android Studio > SDK Manager > SDK Tools > Android SDK Platform-Tools" -ForegroundColor Yellow
}

# Set environment variables for current session
$env:ANDROID_HOME = $foundSdk
$env:ANDROID_SDK_ROOT = $foundSdk
$env:PATH = "$foundSdk\platform-tools;$foundSdk\tools;$env:PATH"

Write-Host ""
Write-Host "=== Environment Variables (Current Session) ===" -ForegroundColor Cyan
Write-Host "ANDROID_HOME = $env:ANDROID_HOME"
Write-Host "ANDROID_SDK_ROOT = $env:ANDROID_SDK_ROOT"

Write-Host ""
Write-Host "=== To Make These Permanent ===" -ForegroundColor Cyan
Write-Host "Run these commands in PowerShell as Administrator:" -ForegroundColor Yellow
Write-Host ""
Write-Host '[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "' + $foundSdk + '", "User")' -ForegroundColor White
Write-Host '[System.Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", "' + $foundSdk + '", "User")' -ForegroundColor White
Write-Host ""
Write-Host "Then add to PATH (User):" -ForegroundColor Yellow
Write-Host "  $foundSdk\platform-tools" -ForegroundColor White
Write-Host "  $foundSdk\tools" -ForegroundColor White
Write-Host ""
Write-Host "Or set them manually:" -ForegroundColor Yellow
Write-Host "  1. Open System Properties > Environment Variables" -ForegroundColor White
Write-Host "  2. Add ANDROID_HOME = $foundSdk" -ForegroundColor White
Write-Host "  3. Add $foundSdk\platform-tools to PATH" -ForegroundColor White
Write-Host ""

# Test ADB
if (Test-Path $adbPath) {
    Write-Host "Testing ADB..." -ForegroundColor Cyan
    & $adbPath version
    Write-Host ""
}

Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Restart your terminal/PowerShell" -ForegroundColor Yellow
Write-Host "2. Start Android emulator or connect device" -ForegroundColor Yellow
Write-Host "3. Run: npm run android" -ForegroundColor Yellow
Write-Host ""


