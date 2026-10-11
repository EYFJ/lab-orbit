. "$PSScriptRoot\common.ps1"
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupPath = Join-Path "$PSScriptRoot\backups" $stamp
Invoke-LabCompose stop
try {
  New-Item -ItemType Directory -Path $backupPath | Out-Null
  Copy-Item -LiteralPath "$PSScriptRoot\data" -Destination $backupPath -Recurse
  Copy-Item -LiteralPath "$PSScriptRoot\.env" -Destination $backupPath
  Write-Host "备份保存到 $backupPath"
} finally {
  Invoke-LabCompose start
}