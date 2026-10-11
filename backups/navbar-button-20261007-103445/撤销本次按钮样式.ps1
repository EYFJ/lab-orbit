$ErrorActionPreference='Stop'
$targetPath='C:\Users\QW201\Desktop\项目\lab-orbit-1.1\frontend\src\components\Navbar.vue'
$fragment=[IO.File]::ReadAllText("$PSScriptRoot\inserted-style.txt")
$currentText=[IO.File]::ReadAllText($targetPath)
$count=([regex]::Matches($currentText,[regex]::Escape($fragment))).Count
if($count -ne 1){throw '本次样式片段已变化或已撤销，请停止自动回退以保护其他修改。'}
Copy-Item -LiteralPath $targetPath -Destination "$PSScriptRoot\Navbar.vue.before-rollback" -Force
$fileBytes=[IO.File]::ReadAllBytes($targetPath)
$hasBom=$fileBytes.Length -ge 3 -and $fileBytes[0] -eq 239 -and $fileBytes[1] -eq 187 -and $fileBytes[2] -eq 191
[IO.File]::WriteAllText($targetPath,$currentText.Replace($fragment,''),[Text.UTF8Encoding]::new($hasBom))
Write-Host '已撤销本次按钮样式，其他代码保持不变。浏览器刷新即可。'