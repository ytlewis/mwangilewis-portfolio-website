# Update Vercel with Railway Backend URL

$BACKEND_URL = "https://lewis-portfolio-production.up.railway.app"

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "║         🔗 CONNECTING BACKEND TO FRONTEND                      ║" -ForegroundColor Green
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "Backend URL: " -NoNewline -ForegroundColor Yellow
Write-Host $BACKEND_URL -ForegroundColor Green
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 MANUAL STEPS TO CONNECT:" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Go to Vercel Dashboard:" -ForegroundColor Yellow
Write-Host "   https://vercel.com/lewis-projects-6eb496b8/lewisgathaiya/settings/environment-variables" -ForegroundColor White
Write-Host ""

Write-Host "2. Click 'Add New' button" -ForegroundColor Yellow
Write-Host ""

Write-Host "3. Add this environment variable:" -ForegroundColor Yellow
Write-Host "   Name:  " -NoNewline -ForegroundColor White
Write-Host "NEXT_PUBLIC_BACKEND_URL" -ForegroundColor Cyan
Write-Host "   Value: " -NoNewline -ForegroundColor White
Write-Host $BACKEND_URL -ForegroundColor Green
Write-Host "   Environment: " -NoNewline -ForegroundColor White
Write-Host "Production, Preview, Development (select all)" -ForegroundColor Cyan
Write-Host ""

Write-Host "4. Click 'Save'" -ForegroundColor Yellow
Write-Host ""

Write-Host "5. Redeploy your site:" -ForegroundColor Yellow
Write-Host "   vercel --prod" -ForegroundColor White
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Write-Host "OR use this command (you'll need to paste the URL when prompted):" -ForegroundColor Cyan
Write-Host ""
Write-Host "  echo '$BACKEND_URL' | vercel env add NEXT_PUBLIC_BACKEND_URL production" -ForegroundColor White
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Write-Host "Would you like to open Vercel dashboard now? (Y/N): " -NoNewline -ForegroundColor Yellow
$response = Read-Host

if ($response -eq 'Y' -or $response -eq 'y') {
    Start-Process "https://vercel.com/lewis-projects-6eb496b8/lewisgathaiya/settings/environment-variables"
    Write-Host ""
    Write-Host "✅ Opening Vercel dashboard in browser..." -ForegroundColor Green
    Write-Host ""
    Write-Host "Copy this URL to add as environment variable:" -ForegroundColor Yellow
    Write-Host $BACKEND_URL -ForegroundColor Green
    Write-Host ""
    
    # Copy to clipboard
    Set-Clipboard -Value $BACKEND_URL
    Write-Host "✅ Backend URL copied to clipboard!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "After adding the environment variable, run:" -ForegroundColor Cyan
Write-Host "  vercel --prod" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
