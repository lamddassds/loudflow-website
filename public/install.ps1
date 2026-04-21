#Requires -Version 5.1
<#
.SYNOPSIS
  LoudFlow installer.

.DESCRIPTION
  Downloads the latest LoudFlow Windows installer from GitHub Releases
  and runs it. Usage:

    irm https://loudflow.xyz/install.ps1 | iex
#>

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$ApiUrl = "https://api.github.com/repos/lamddassds/Loudflow-updat/releases/latest"
$FallbackUrl = "https://github.com/lamddassds/Loudflow-updat/releases/latest/download/LoudFlow-Setup.exe"

Write-Host ""
Write-Host "  LoudFlow installer" -ForegroundColor Cyan
Write-Host "  ------------------" -ForegroundColor DarkGray
Write-Host ""

# Resolve the latest .exe asset from the GitHub API
$DownloadUrl = $null
$FileName = "LoudFlow-Setup.exe"
try {
    $release = Invoke-RestMethod -Uri $ApiUrl -Headers @{ "User-Agent" = "LoudFlow-Installer" }
    $asset = $release.assets |
        Where-Object { $_.name -like "*.exe" } |
        Sort-Object -Property @{ Expression = { $_.name -match "setup|installer" }; Descending = $true } |
        Select-Object -First 1
    if ($asset) {
        $DownloadUrl = $asset.browser_download_url
        $FileName = $asset.name
        Write-Host "  Version:   $($release.tag_name)" -ForegroundColor Gray
        Write-Host "  File:      $FileName" -ForegroundColor Gray
        if ($asset.size) {
            $sizeMb = [math]::Round($asset.size / 1MB, 1)
            Write-Host "  Size:      $sizeMb MB" -ForegroundColor Gray
        }
        Write-Host ""
    }
} catch {
    Write-Host "  (Could not query GitHub API, using fallback URL)" -ForegroundColor DarkYellow
}

if (-not $DownloadUrl) { $DownloadUrl = $FallbackUrl }

$Destination = Join-Path $env:TEMP $FileName
Write-Host "  Downloading..." -ForegroundColor Gray

try {
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $Destination -UseBasicParsing
} catch {
    Write-Host ""
    Write-Host "  Download failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  You can download the installer manually from:" -ForegroundColor Yellow
    Write-Host "    https://loudflow.xyz/download" -ForegroundColor Yellow
    exit 1
}

Write-Host "  Launching installer..." -ForegroundColor Gray
Write-Host ""

Start-Process -FilePath $Destination
