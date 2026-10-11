. "$PSScriptRoot\common.ps1"
Invoke-LabCompose up -d --wait --wait-timeout 600
Invoke-LabCompose ps
$portLine = Get-Content -LiteralPath "$PSScriptRoot\.env" | Where-Object { $_ -match '^FRONTEND_PORT=' }
$frontPort = ($portLine -split '=',2)[1]
Write-Host "访问 http://localhost:$frontPort ，首次使用打开 /setup。"