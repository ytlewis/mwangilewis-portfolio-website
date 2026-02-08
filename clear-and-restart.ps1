# Clear Cache and Restart Dev Server
Write-Host "Clearing Next.js cache..." -ForegroundColor Yellow

# Remove .next directory
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "✓ Cleared .next cache" -ForegroundColor Green
}

# Clear node_modules/.cache if it exists
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force node_modules/.cache
    Write-Host "✓ Cleared node_modules cache" -ForegroundColor Green
}

Write-Host "`nCache cleared successfully!" -ForegroundColor Green
Write-Host "`nNow please:" -ForegroundColor Cyan
Write-Host "1. Open your browser (Edge)" -ForegroundColor White
Write-Host "2. Press Ctrl + Shift + Delete" -ForegroundColor White
Write-Host "3. Select 'All time' and check 'Cached images and files'" -ForegroundColor White
Write-Host "4. Click 'Clear now'" -ForegroundColor White
Write-Host "5. Then press Ctrl + Shift + R on http://localhost:3000" -ForegroundColor White
Write-Host "`nDev server is already running at:" -ForegroundColor Cyan
Write-Host "  Local:   http://localhost:3000" -ForegroundColor Green
Write-Host "  Network: http://10.13.11.167:3000" -ForegroundColor Green
