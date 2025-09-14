# Test Production Email Endpoint with curl
$url = "https://apple-interiors.vercel.app/api/send-email"
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    formData = @{
        name = "Test User"
        email = "test@example.com"
        phone = "+911234567890"
        subject = "Test Email from PowerShell"
        message = "This is a test email sent from PowerShell to verify the production email functionality."
    }
} | ConvertTo-Json

try {
    Write-Host "Testing production email endpoint..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "✅ Email sent successfully!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5 | Out-String
} catch {
    Write-Host "❌ Error sending email:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        try {
            $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
            if ($errorDetails) {
                Write-Host "Error Details:" -ForegroundColor Red
                $errorDetails | ConvertTo-Json -Depth 5 | Out-String
            } else {
                Write-Host "Raw Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
            }
        } catch {
            Write-Host "Could not parse error details: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "No additional error details available." -ForegroundColor Red
    }
}

Write-Host "`nCheck your email (aravind.bandaru@appleinteriors.in) for the test message." -ForegroundColor Yellow
