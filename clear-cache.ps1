# Clear Expo and Metro caches for Windows
Write-Host "Clearing Expo and Metro caches..." -ForegroundColor Yellow

# Remove .expo directory
if (Test-Path .expo) {
    Remove-Item -Recurse -Force .expo
    Write-Host "✓ Removed .expo directory" -ForegroundColor Green
} else {
    Write-Host "✓ .expo directory doesn't exist" -ForegroundColor Gray
}

# Remove node_modules cache
if (Test-Path node_modules\.cache) {
    Remove-Item -Recurse -Force node_modules\.cache
    Write-Host "✓ Removed node_modules cache" -ForegroundColor Green
} else {
    Write-Host "✓ node_modules cache doesn't exist" -ForegroundColor Gray
}

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "✓ npm cache cleared" -ForegroundColor Green

Write-Host "`nCache cleared! You can now run 'npm start'" -ForegroundColor Green


