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

$ReleaseUrl = "https://github.com/lamddassds/Loudflow-updat/releases/latest/download/LoudFlow-Setup.exe"
$Destination = Join-Path $env:TEMP "LoudFlow-Setup.exe"

Write-Host ""
Write-Host "  LoudFlow installer" -ForegroundColor Cyan
Write-Host "  ------------------" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Downloading latest release..." -ForegroundColor Gray

try {
    Invoke-WebRequest -Uri $ReleaseUrl -OutFile $Destination -UseBasicParsing
} catch {
    Write-Host ""
    Write-Host "  Download failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  You can download the installer manually from:" -ForegroundColor Yellow
    Write-Host "    $ReleaseUrl" -ForegroundColor Yellow
    exit 1
}

Write-Host "  Launching installer..." -ForegroundColor Gray
Write-Host ""

Start-Process -FilePath $Destination
