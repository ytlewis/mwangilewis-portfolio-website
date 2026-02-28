# Deploy to Vercel - PowerShell Script

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "║              🚀 DEPLOYING TO VERCEL                            ║" -ForegroundColor Green
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "🔍 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js is not installed" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
Write-Host "🔍 Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: npm is not installed" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if Vercel CLI is installed
Write-Host "🔍 Checking Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = $false
try {
    $vercelVersion = vercel --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        $vercelInstalled = $true
        Write-Host "✅ Vercel CLI is already installed (version: $vercelVersion)" -ForegroundColor Green
    }
} catch {
    # Vercel not installed
}

if (-not $vercelInstalled) {
    Write-Host "📦 Vercel CLI not found. Installing..." -ForegroundColor Yellow
    Write-Host ""
    
    try {
        npm install -g vercel
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Vercel CLI installed successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
            Write-Host "Try running: npm install -g vercel" -ForegroundColor Yellow
            exit 1
        }
    } catch {
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        Write-Host "Try running: npm install -g vercel" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Check if dependencies are installed
Write-Host "🔍 Checking project dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Build the project to check for errors
Write-Host "🔨 Building project to check for errors..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Build failed! Please fix the errors above before deploying." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  - TypeScript errors" -ForegroundColor White
    Write-Host "  - Missing dependencies" -ForegroundColor White
    Write-Host "  - Syntax errors" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 You will be asked a few questions:" -ForegroundColor Yellow
Write-Host "  1. Login to Vercel (if not already logged in)" -ForegroundColor White
Write-Host "  2. Set up and deploy project" -ForegroundColor White
Write-Host "  3. Link to existing project or create new one" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Press Enter to accept default values" -ForegroundColor Cyan
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Run Vercel deployment
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                                                                ║" -ForegroundColor Green
    Write-Host "║              ✅ DEPLOYMENT SUCCESSFUL!                         ║" -ForegroundColor Green
    Write-Host "║                                                                ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Your portfolio is now live on Vercel!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Visit your deployment URL (shown above)" -ForegroundColor White
    Write-Host "  2. Test all features (contact form, admin, etc.)" -ForegroundColor White
    Write-Host "  3. Add custom domain in Vercel dashboard (optional)" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Tips:" -ForegroundColor Yellow
    Write-Host "  - Every git push will auto-deploy to Vercel" -ForegroundColor White
    Write-Host "  - You can add environment variables in dashboard" -ForegroundColor White
    Write-Host "  - Custom domains are free on Vercel" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  1. Not logged in to Vercel" -ForegroundColor White
    Write-Host "     Solution: Run 'vercel login' first" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  2. Network connection issues" -ForegroundColor White
    Write-Host "     Solution: Check your internet connection" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  3. Build errors" -ForegroundColor White
    Write-Host "     Solution: Fix errors shown above" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Try running: vercel login" -ForegroundColor Cyan
    Write-Host "Then run this script again" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
