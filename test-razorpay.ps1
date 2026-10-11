# Razorpay Integration Test Script
# This script tests the Razorpay endpoints

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     Razorpay Integration Test Script                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Configuration
$baseUrl = "http://localhost:5290/api/transaction"
$orderServiceUrl = "http://localhost:5105/api/orders"

Write-Host "⚙️  Configuration:" -ForegroundColor Yellow
Write-Host "   Transaction Service: $baseUrl" -ForegroundColor Gray
Write-Host "   Order Service: $orderServiceUrl" -ForegroundColor Gray
Write-Host ""

# Check if services are running
Write-Host "🔍 Checking if services are running..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/../swagger/index.html" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   ✅ Transaction Service is running" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Transaction Service is NOT running on port 5290" -ForegroundColor Red
    Write-Host "   Please start the service using START_ALL_SERVICES.bat" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "📝 Test Instructions:" -ForegroundColor Yellow
Write-Host "   1. Make sure you have updated Razorpay credentials in appsettings.json" -ForegroundColor Gray
Write-Host "   2. Login to the application as a Dealer" -ForegroundColor Gray
Write-Host "   3. Create an order" -ForegroundColor Gray
Write-Host "   4. Note the Order ID" -ForegroundColor Gray
Write-Host "   5. Get the JWT token from browser localStorage" -ForegroundColor Gray
Write-Host ""

# Prompt for inputs
$orderId = Read-Host "Enter Order ID to test"
$token = Read-Host "Enter JWT Token (from localStorage)"

if ([string]::IsNullOrWhiteSpace($orderId) -or [string]::IsNullOrWhiteSpace($token)) {
    Write-Host "❌ Order ID and Token are required!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🧪 Testing Razorpay Create Order Endpoint..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        orderId = [int]$orderId
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/create-order" -Method Post -Headers $headers -Body $body
    
    Write-Host "   ✅ Razorpay Order Created Successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Response:" -ForegroundColor Cyan
    Write-Host "   ├─ Razorpay Order ID: $($response.orderId)" -ForegroundColor Gray
    Write-Host "   ├─ Amount: ₹$($response.amount)" -ForegroundColor Gray
    Write-Host "   ├─ Currency: $($response.currency)" -ForegroundColor Gray
    Write-Host "   └─ Key ID: $($response.keyId)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   🎉 Integration is working correctly!" -ForegroundColor Green
    Write-Host "   You can now test the full payment flow in the UI" -ForegroundColor Green
    
} catch {
    Write-Host "   ❌ Error creating Razorpay order" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Common issues:" -ForegroundColor Yellow
    Write-Host "   • Razorpay credentials not configured in appsettings.json" -ForegroundColor Gray
    Write-Host "   • Invalid JWT token" -ForegroundColor Gray
    Write-Host "   • Order ID doesn't exist" -ForegroundColor Gray
    Write-Host "   • User is not a Dealer" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
