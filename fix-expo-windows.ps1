# Fix for Expo Windows node:sea path issue
Write-Host "Applying Windows path fix for Expo..." -ForegroundColor Yellow

$expoExternalsFile = "node_modules\@expo\cli\src\start\server\metro\externals.ts"

if (Test-Path $expoExternalsFile) {
    $content = Get-Content $expoExternalsFile -Raw
    
    # Replace node:sea with node_sea to avoid Windows path issues
    if ($content.Contains('node:sea')) {
        $newContent = $content.Replace('node:sea', 'node_sea')
        Set-Content -Path $expoExternalsFile -Value $newContent -NoNewline
        Write-Host "Fixed: Replaced node:sea with node_sea" -ForegroundColor Green
    }
    
    # Also fix any mkdir calls with node:sea
    if ($content.Contains('mkdir') -and $content.Contains('node:sea')) {
        $newContent = $content.Replace('node:sea', 'node_sea')
        Set-Content -Path $expoExternalsFile -Value $newContent -NoNewline
        Write-Host "Fixed: Updated mkdir paths" -ForegroundColor Green
    }
    
    Write-Host "Fix applied successfully!" -ForegroundColor Green
} else {
    Write-Host "Error: Expo externals.ts file not found" -ForegroundColor Red
    Write-Host "Make sure you have run 'npm install' first" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Try running 'npm start' again." -ForegroundColor Cyan
