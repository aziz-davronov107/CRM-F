# API Server Test Script for Windows PowerShell

Write-Host "🔍 API Server Connection Test" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green

$API_URL = "http://localhost:5000"

Write-Host ""
Write-Host "1. Testing server connection..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $API_URL -Method Head -TimeoutSec 5
    Write-Host "✅ Server is running! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Server connection failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Make sure your API server is running on port 5000" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "2. Testing /branches endpoint..." -ForegroundColor Yellow

try {
    $branches = Invoke-RestMethod -Uri "$API_URL/branches" -Method Get -TimeoutSec 10
    Write-Host "✅ Branches endpoint working!" -ForegroundColor Green
    Write-Host "📊 Found $($branches.Count) branches" -ForegroundColor Cyan
    
    if ($branches.Count -gt 0) {
        Write-Host "📋 First branch: $($branches[0].name)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Branches endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Testing /centers endpoint..." -ForegroundColor Yellow

try {
    $centers = Invoke-RestMethod -Uri "$API_URL/centers" -Method Get -TimeoutSec 10
    Write-Host "✅ Centers endpoint working!" -ForegroundColor Green
    Write-Host "🏢 Found $($centers.Count) centers" -ForegroundColor Cyan
    
    if ($centers.Count -gt 0) {
        Write-Host "🏢 First center: $($centers[0].name)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Centers endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. CORS Test..." -ForegroundColor Yellow

try {
    $headers = @{
        'Origin' = 'http://localhost:3000'
        'Access-Control-Request-Method' = 'GET'
    }
    
    $response = Invoke-WebRequest -Uri "$API_URL/branches" -Method Options -Headers $headers -TimeoutSec 5
    Write-Host "✅ CORS seems to be configured properly" -ForegroundColor Green
} catch {
    Write-Host "⚠️  CORS might need configuration: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Green
Write-Host "- API Base URL: $API_URL"
Write-Host "- Frontend URL: http://localhost:3000"
Write-Host "- Check browser console for more details"
Write-Host ""
Write-Host "🔧 If API is not working:" -ForegroundColor Yellow
Write-Host "1. Start your API server on port 5000"
Write-Host "2. Check server logs for errors"
Write-Host "3. Verify endpoints: GET /branches, GET /centers"
Write-Host "4. Enable CORS for localhost:3000"