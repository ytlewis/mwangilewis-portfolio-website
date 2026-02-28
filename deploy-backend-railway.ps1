# Deploy Backend to Railway - PowerShell Script

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "║         🚂 DEPLOYING BACKEND TO RAILWAY                        ║" -ForegroundColor Green
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
Write-Host "🔍 Checking Railway CLI..." -ForegroundColor Yellow
try {
    $railwayVersion = railway --version
    Write-Host "✅ Railway CLI version: $railwayVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install Railway CLI:" -ForegroundColor Yellow
    Write-Host "  npm install -g @railway/cli" -ForegroundColor White
    Write-Host ""
    Write-Host "Or visit: https://docs.railway.app/develop/cli" -ForegroundColor Cyan
    exit 1
}

Write-Host ""

# Check if logged in to Railway
Write-Host "🔍 Checking Railway login status..." -ForegroundColor Yellow
$loginCheck = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Railway" -ForegroundColor Red
    Write-Host ""
    Write-Host "Logging in to Railway..." -ForegroundColor Yellow
    railway login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to login to Railway" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Logged in successfully!" -ForegroundColor Green
} else {
    Write-Host "✅ Already logged in to Railway" -ForegroundColor Green
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Navigate to backend directory
Write-Host "📂 Navigating to backend directory..." -ForegroundColor Yellow
Set-Location backend

# Check if backend dependencies are installed
Write-Host "🔍 Checking backend dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Check if .env file exists
Write-Host "🔍 Checking environment configuration..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Warning: .env file not found" -ForegroundColor Yellow
    Write-Host "   You'll need to set environment variables in Railway dashboard" -ForegroundColor Gray
} else {
    Write-Host "✅ .env file found" -ForegroundColor Green
    Write-Host "   Note: Railway will use its own environment variables" -ForegroundColor Gray
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Initialize Railway project
Write-Host "🚂 Initializing Railway project..." -ForegroundColor Cyan
Write-Host ""
Write-Host "You'll be asked:" -ForegroundColor Yellow
Write-Host "  1. Create new project or link existing?" -ForegroundColor White
Write-Host "  2. Project name (e.g., 'lewis-portfolio-backend')" -ForegroundColor White
Write-Host ""

railway init

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to initialize Railway project" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host ""
Write-Host "✅ Railway project initialized!" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Deploy to Railway
Write-Host "🚀 Deploying to Railway..." -ForegroundColor Cyan
Write-Host ""

railway up

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                                                                ║" -ForegroundColor Green
    Write-Host "║           ✅ BACKEND DEPLOYED SUCCESSFULLY!                    ║" -ForegroundColor Green
    Write-Host "║                                                                ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 IMPORTANT NEXT STEPS:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Get your Railway backend URL:" -ForegroundColor Cyan
    Write-Host "   railway domain" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Set environment variables in Railway:" -ForegroundColor Cyan
    Write-Host "   railway variables" -ForegroundColor White
    Write-Host ""
    Write-Host "   Required variables:" -ForegroundColor Yellow
    Write-Host "   - MONGODB_URI (your MongoDB Atlas connection string)" -ForegroundColor White
    Write-Host "   - JWT_SECRET (random secret key)" -ForegroundColor White
    Write-Host "   - FRONTEND_URL (https://lewisgathaiya.vercel.app)" -ForegroundColor White
    Write-Host "   - NODE_ENV (production)" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Update Vercel frontend with backend URL:" -ForegroundColor Cyan
    Write-Host "   - Go to Vercel dashboard" -ForegroundColor White
    Write-Host "   - Settings → Environment Variables" -ForegroundColor White
    Write-Host "   - Add: NEXT_PUBLIC_BACKEND_URL = [your-railway-url]" -ForegroundColor White
    Write-Host "   - Redeploy: vercel --prod" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Railway Dashboard: https://railway.app/dashboard" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  1. Not logged in to Railway" -ForegroundColor White
    Write-Host "     Solution: railway login" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  2. Project not initialized" -ForegroundColor White
    Write-Host "     Solution: railway init" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  3. Build errors" -ForegroundColor White
    Write-Host "     Solution: Check logs with 'railway logs'" -ForegroundColor Gray
    Write-Host ""
    Set-Location ..
    exit 1
}

# Return to root directory
Set-Location ..

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
