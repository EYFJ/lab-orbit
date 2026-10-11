$ErrorActionPreference = 'Stop'
$script:DockerExe = (Get-Command docker -ErrorAction SilentlyContinue).Source
if (-not $script:DockerExe) {
  foreach ($candidate in @(
    "$env:LOCALAPPDATA\Programs\DockerDesktop\resources\bin\docker.exe",
    "$env:ProgramFiles\Docker\Docker\resources\bin\docker.exe"
  )) {
    if (Test-Path -LiteralPath $candidate) { $script:DockerExe = $candidate; break }
  }
}
if (-not $script:DockerExe) { throw '找不到 Docker，请先安装并打开 Docker Desktop。' }
function Invoke-LabCompose {
  & $script:DockerExe compose --project-directory $PSScriptRoot --env-file "$PSScriptRoot\.env" -f "$PSScriptRoot\compose.yaml" @args
  if ($LASTEXITCODE -ne 0) { throw "Docker 操作失败，退出码：$LASTEXITCODE" }
}