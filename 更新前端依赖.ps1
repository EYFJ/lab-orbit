. "$PSScriptRoot\common.ps1"
Invoke-LabCompose restart frontend
Write-Host '前端重启时会比较 package.json 和锁文件，变化后自动执行 npm ci。可运行查看日志脚本检查进度。'