Write-Host "Starting all CropDeal microservices..." -ForegroundColor Green

$services = @(
    @{Name="UserService"; Port=5024; Path="CropDealBackend\CropDeal.UserService"},
    @{Name="CropService"; Port=5178; Path="CropDealBackend\CropDeal.CropService"},
    @{Name="OrderService"; Port=5105; Path="CropDealBackend\CropDeal.OrderService"},
    @{Name="TransactionService"; Port=5290; Path="CropDealBackend\CropDeal.TransactionService"},
    @{Name="RatingReviewService"; Port=5063; Path="CropDealBackend\CropDeal.RatingReviewService"},
    @{Name="CartItemService"; Port=5248; Path="CropDealBackend\CropDeal.CartItemService"},
    @{Name="BankAccountService"; Port=5111; Path="CropDealBackend\CropDeal.BankAccountService"},
    @{Name="AdminService"; Port=5254; Path="CropDealBackend\CropDeal.AdminService"}
)

foreach ($service in $services) {
    $servicePath = Join-Path $PSScriptRoot $service.Path
    Write-Host "Starting $($service.Name) on port $($service.Port)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$servicePath'; dotnet run" -WindowStyle Normal
    Start-Sleep -Seconds 2
}

Write-Host "`nAll services started!" -ForegroundColor Green
Write-Host "Press any key to stop all services..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "`nStopping all services..." -ForegroundColor Red
Get-Process | Where-Object {$_.ProcessName -eq "dotnet"} | Stop-Process -Force
Write-Host "All services stopped." -ForegroundColor Green
