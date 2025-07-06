# Read the portfolio data
$portfolioData = Get-Content -Path "src/app/data/portfolio.json" | ConvertFrom-Json

# Base URL of the production site
$baseUrl = "https://apple-interiors.vercel.app"

# Create necessary directories
$categories = @("living-room", "dining", "bedroom", "kitchen", "false-ceiling")
foreach ($category in $categories) {
    $dirPath = "public/portfolio/$category"
    if (-not (Test-Path $dirPath)) {
        New-Item -ItemType Directory -Path $dirPath -Force
    }
}

# Download images
foreach ($item in $portfolioData.items) {
    foreach ($imageUrl in $item.images) {
        $fullUrl = "$baseUrl$imageUrl"
        $localPath = "public$imageUrl"
        
        Write-Host "Downloading: $fullUrl"
        try {
            Invoke-WebRequest -Uri $fullUrl -OutFile $localPath -UseBasicParsing
            Write-Host "Successfully downloaded: $imageUrl"
        } catch {
            Write-Host "Failed to download: $imageUrl"
            Write-Host $_.Exception.Message
        }
        # Add a small delay to avoid overwhelming the server
        Start-Sleep -Milliseconds 100
    }
} 