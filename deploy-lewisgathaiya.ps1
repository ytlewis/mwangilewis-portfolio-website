# Deploy to Vercel with project name lewisgathaiya

Write-Host "Deploying to Vercel as lewisgathaiya..." -ForegroundColor Cyan

# Remove existing Vercel config
if (Test-Path ".vercel") {
    Remove-Item -Recurse -Force .vercel
}

# Create responses file for automated deployment
$responses = @"
y
lewisgathaiya
./
n
"@

# Deploy with automated responses
$responses | vercel --prod

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Your site should be at: https://lewisgathaiya.vercel.app" -ForegroundColor Cyan
