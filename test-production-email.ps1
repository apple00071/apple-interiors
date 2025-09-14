# Test Production Email Endpoint
$productionUrl = "https://apple-interiors.vercel.app/api/send-email"

# Test data
$testData = @{
    formData = @{
        name = "Test User"
        email = "test@example.com"
        phone = "+911234567890"
        subject = "Test Email from PowerShell"
        message = "This is a test email sent from PowerShell to verify the production email functionality."
    }
} | ConvertTo-Json

try {
    Write-Host "Sending test email to production endpoint..." -ForegroundColor Cyan
    
    $response = Invoke-RestMethod -Uri $productionUrl `
        -Method Post `
        -Body $testData `
        -ContentType "application/json" `
        -UseBasicParsing
    
    Write-Host "✅ Success! Email sent successfully." -ForegroundColor Green
    Write-Host "Response: " -NoNewline
    $response | ConvertTo-Json -Depth 5 | Out-String
} catch {
    Write-Host "❌ Error sending email:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    
    try {
        $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Error Details: " -NoNewline
        $errorResponse | ConvertTo-Json -Depth 5 | Out-String
    } catch {
        Write-Host "Raw Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nCheck your email (aravind.bandaru@appleinteriors.in) for the test message." -ForegroundColor Yellow
