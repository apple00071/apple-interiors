$url = "https://apple-interiors.vercel.app/api/send-email"
$body = @{
    formData = @{
        name = "Test User"
        email = "test@example.com"
        phone = "+911234567890"
        subject = "Test Email from PowerShell"
        message = "Testing production email functionality"
    }
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Success! Status Code: $($response.StatusCode)" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
} catch {
    Write-Host "❌ Error:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 5
    }
}
