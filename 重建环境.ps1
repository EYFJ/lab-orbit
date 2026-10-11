. "$PSScriptRoot\common.ps1"
Invoke-LabCompose up -d --build --force-recreate --wait --wait-timeout 600
Invoke-LabCompose ps