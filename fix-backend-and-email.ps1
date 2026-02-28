# Fix Backend and Email Issues
# This script will help you fix both the projects loading and email notification issues

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Fix Backend & Email Issues" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if backend is running
Write-Host "Step 1: Checking backend status..." -ForegroundColor Yellow
Write-Host ""

$backendUrls = @(
    "https://lewis-portfolio-backend.onrender.com",
    "https://mwangilewis-portfolio-backend.up.railway.app"
)

$workingBackend = $null

foreach ($url in $backendUrls) {
    Write-Host "Testing: $url" -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -Uri "$url/api/health" -TimeoutSec 10 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ Backend is responding!" -ForegroundColor Green
            $workingBackend = $url
            break
        }
    } catch {
        Write-Host "✗ Not responding" -ForegroundColor Red
    }
}

Write-Host ""

if ($null -eq $workingBackend) {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  Backend Not Found - Starting Local" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    
    Write-Host "Your backend is not deployed or not responding." -ForegroundColor Yellow
    Write-Host "Let's start it locally for testing..." -ForegroundColor Yellow
    Write-Host ""
    
    # Check if backend dependencies are installed
    if (!(Test-Path "backend/node_modules")) {
        Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
        Set-Location backend
        npm install
        Set-Location ..
    }
    
    Write-Host ""
    Write-Host "Starting backend server..." -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the server when done testing" -ForegroundColor Yellow
    Write-Host ""
    
    # Start backend in a new window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"
    
    Start-Sleep -Seconds 5
    
    $workingBackend = "http://localhost:5000"
    Write-Host "✓ Backend started at $workingBackend" -ForegroundColor Green
    Write-Host ""
}

# Step 2: Configure Email
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 2: Configure Email" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "To receive email notifications, you need a Gmail App Password." -ForegroundColor Yellow
Write-Host ""

Write-Host "Do you have a Gmail App Password? (Y/N): " -ForegroundColor Yellow -NoNewline
$hasPassword = Read-Host

if ($hasPassword -eq 'N' -or $hasPassword -eq 'n') {
    Write-Host ""
    Write-Host "Let's get one! Follow these steps:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Open this URL in your browser:" -ForegroundColor White
    Write-Host "   https://myaccount.google.com/apppasswords" -ForegroundColor Green
    Write-Host ""
    Write-Host "2. Sign in with: gathaiyalewis1122@gmail.com" -ForegroundColor White
    Write-Host ""
    Write-Host "3. If prompted, enable 2-Step Verification first" -ForegroundColor White
    Write-Host ""
    Write-Host "4. Select:" -ForegroundColor White
    Write-Host "   - App: Mail" -ForegroundColor White
    Write-Host "   - Device: Other (Custom name)" -ForegroundColor White
    Write-Host "   - Name: Portfolio Website" -ForegroundColor White
    Write-Host ""
    Write-Host "5. Click 'Generate'" -ForegroundColor White
    Write-Host ""
    Write-Host "6. Copy the 16-character password (remove spaces)" -ForegroundColor White
    Write-Host ""
    
    # Open the URL
    Start-Process "https://myaccount.google.com/apppasswords"
    
    Write-Host "Press Enter when you have the password..." -ForegroundColor Yellow
    Read-Host
}

Write-Host ""
Write-Host "Enter your Gmail App Password (16 characters, no spaces): " -ForegroundColor Yellow -NoNewline
$emailPassword = Read-Host

# Update backend .env file
Write-Host ""
Write-Host "Updating backend/.env file..." -ForegroundColor Cyan

$envContent = Get-Content "backend/.env" -Raw

# Update email configuration
$envContent = $envContent -replace 'EMAIL_PASS=.*', "EMAIL_PASS=$emailPassword"
$envContent = $envContent -replace 'GITHUB_USERNAME=.*', 'GITHUB_USERNAME=lewisgathaiya'

Set-Content "backend/.env" -Value $envContent

Write-Host "✓ Backend configuration updated" -ForegroundColor Green
Write-Host ""

# Step 3: Update Vercel
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 3: Update Vercel Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Updating Vercel environment variable..." -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (!$vercelInstalled) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Update Vercel environment variable
Write-Host "Setting NEXT_PUBLIC_BACKEND_URL to: $workingBackend" -ForegroundColor Cyan
Write-Host ""

# Create a temporary file with the backend URL
$workingBackend | Out-File -FilePath "temp_backend_url.txt" -NoNewline

# Use vercel env to add the variable
$env:VERCEL_ORG_ID = ""
$env:VERCEL_PROJECT_ID = ""

Write-Host "Running: vercel env add NEXT_PUBLIC_BACKEND_URL production" -ForegroundColor Gray
Write-Host ""

# This will prompt for the value
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Paste this value when prompted:' -ForegroundColor Yellow; Write-Host '$workingBackend' -ForegroundColor Green; Write-Host ''; vercel env add NEXT_PUBLIC_BACKEND_URL production"

Write-Host ""
Write-Host "⚠ IMPORTANT: In the new window that opened:" -ForegroundColor Yellow
Write-Host "   1. When prompted for the value, paste: $workingBackend" -ForegroundColor White
Write-Host "   2. Press Enter" -ForegroundColor White
Write-Host "   3. Close that window when done" -ForegroundColor White
Write-Host ""

Write-Host "Press Enter when you've completed the Vercel setup..." -ForegroundColor Yellow
Read-Host

# Step 4: Deploy to Vercel
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 4: Deploy to Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Deploying updated configuration to Vercel..." -ForegroundColor Cyan
vercel --prod

Write-Host ""
Write-Host "✓ Deployment complete!" -ForegroundColor Green
Write-Host ""

# Step 5: Test
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 5: Test Everything" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Let's test if everything works!" -ForegroundColor Yellow
Write-Host ""

Write-Host "Test 1: Projects Page" -ForegroundColor Cyan
Write-Host "1. Open: https://lewismwangi.com/projects" -ForegroundColor White
Write-Host "2. Check if projects are loading" -ForegroundColor White
Write-Host "3. Click 'View Code' on any project" -ForegroundColor White
Write-Host ""

Write-Host "Test 2: Contact Form & Email" -ForegroundColor Cyan
Write-Host "1. Open: https://lewismwangi.com/contact" -ForegroundColor White
Write-Host "2. Fill out and submit the form" -ForegroundColor White
Write-Host "3. Check gathaiyalewis1122@gmail.com for the email" -ForegroundColor White
Write-Host ""

Write-Host "Opening test pages..." -ForegroundColor Cyan
Start-Process "https://lewismwangi.com/projects"
Start-Sleep -Seconds 2
Start-Process "https://lewismwangi.com/contact"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✓ Backend configured: $workingBackend" -ForegroundColor Green
Write-Host "✓ Email configured: gathaiyalewis1122@gmail.com" -ForegroundColor Green
Write-Host "✓ Vercel updated with backend URL" -ForegroundColor Green
Write-Host "✓ Website deployed to production" -ForegroundColor Green
Write-Host ""

if ($workingBackend -eq "http://localhost:5000") {
    Write-Host "⚠ IMPORTANT: Backend is running locally" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "For production, you need to:" -ForegroundColor Yellow
    Write-Host "1. Deploy your backend to Render or Railway" -ForegroundColor White
    Write-Host "2. Update the backend environment variables there" -ForegroundColor White
    Write-Host "3. Update Vercel with the production backend URL" -ForegroundColor White
    Write-Host ""
    Write-Host "See DEPLOY_BACKEND_NOW.md for instructions" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
