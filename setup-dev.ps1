# Lewis Portfolio Website - Development Setup Script (PowerShell)
Write-Host "🚀 Setting up Lewis Portfolio Website development environment..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
    
    # Check Node.js version
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -lt 18) {
        Write-Host "❌ Node.js version 18+ is required. Current version: $nodeVersion" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if MongoDB is available (optional)
try {
    mongod --version | Out-Null
    Write-Host "✅ MongoDB detected" -ForegroundColor Green
} catch {
    Write-Host "⚠️  MongoDB not detected locally. Make sure to configure MongoDB Atlas URI in backend/.env" -ForegroundColor Yellow
}

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Blue
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Blue
Set-Location backend
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Create backend .env file if it doesn't exist
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating backend .env file..." -ForegroundColor Blue
    Copy-Item .env.example .env
    Write-Host "⚠️  Please edit backend/.env with your configuration before starting the servers" -ForegroundColor Yellow
} else {
    Write-Host "✅ Backend .env file already exists" -ForegroundColor Green
}

Set-Location ..

# Create frontend .env.local file if it doesn't exist
if (-not (Test-Path .env.local)) {
    Write-Host "📝 Creating frontend .env.local file..." -ForegroundColor Blue
    @"
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
"@ | Out-File -FilePath .env.local -Encoding UTF8
    Write-Host "✅ Frontend .env.local file created" -ForegroundColor Green
} else {
    Write-Host "✅ Frontend .env.local file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Development environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit backend/.env with your MongoDB URI and email configuration"
Write-Host "2. Start the backend server: cd backend && npm run dev"
Write-Host "3. Start the frontend server: npm run dev"
Write-Host "4. Visit http://localhost:3000 to see your portfolio"
Write-Host ""
Write-Host "🧪 To run tests:" -ForegroundColor Cyan
Write-Host "- Frontend tests: npm test"
Write-Host "- Backend tests: cd backend && npm test"
Write-Host ""
Write-Host "📚 For more information, see README.md" -ForegroundColor Cyan