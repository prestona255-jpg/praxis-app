# FB-1a rig port -- one run (stands in for `python -I fb1a_rig.py <tree> <port> <label>`).
#   powershell -NoProfile -ExecutionPolicy Bypass -File run-fb1a.ps1 -Tree <folder holding index.html> -Label <name> -Out <log file>
# Starts serve-fb1a.ps1 on the tree, opens the driver page in the installed Chrome, headless, with a FRESH profile
# (so every device's storage starts empty, as Playwright's new contexts did), waits for the driver's RIG-DONE line,
# then stops Chrome and the server. Downloads nothing.
param([string]$Tree, [string]$Label, [string]$Out, [int]$TimeoutSec = 900, [string]$Mode = '')
$ErrorActionPreference = 'Stop'
$rigDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (Test-Path -LiteralPath $Out) { Remove-Item -LiteralPath $Out -Force }
[IO.File]::WriteAllText($Out, '', (New-Object System.Text.UTF8Encoding($false)))
$srv = Start-Process -FilePath 'powershell.exe' -PassThru -WindowStyle Hidden -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Join-Path $rigDir 'serve-fb1a.ps1'), '-Root', $Tree, '-RigDir', $rigDir, '-Out', $Out)
$prof = Join-Path $env:TEMP ('fb1a-rig-' + [guid]::NewGuid().ToString('N'))
$ok = $false
for ($i = 0; $i -lt 50; $i++) { try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:8800/__rig/driver.html' -TimeoutSec 2; if ($r.StatusCode -eq 200) { $ok = $true; break } } catch {}; Start-Sleep -Milliseconds 200 }
if (-not $ok) { Stop-Process -Id $srv.Id -Force; throw 'server did not start' }
$url = 'http://localhost:8800/__rig/driver.html?label=' + [Uri]::EscapeDataString($Label)
if ($Mode) { $url = $url + '&mode=' + [Uri]::EscapeDataString($Mode) }
$cp = Start-Process -FilePath $chrome -PassThru -ArgumentList @('--headless=new', "--user-data-dir=$prof", '--no-first-run', '--no-default-browser-check',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--window-size=1400,900', $url)
$t0 = Get-Date
while (((Get-Date) - $t0).TotalSeconds -lt $TimeoutSec) {
  Start-Sleep -Seconds 2
  $txt = [IO.File]::ReadAllText($Out)
  if ($txt.Contains('RIG-DONE')) { break }
}
$secs = [int]((Get-Date) - $t0).TotalSeconds
try { Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like "*$prof*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } } catch {}
try { Stop-Process -Id $srv.Id -Force -ErrorAction SilentlyContinue } catch {}
Start-Sleep -Milliseconds 500
try { Remove-Item -LiteralPath $prof -Recurse -Force -ErrorAction SilentlyContinue } catch {}
$txt = [IO.File]::ReadAllText($Out)
if (-not $txt.Contains('RIG-DONE')) { [IO.File]::AppendAllText($Out, "`nRUNNER: no RIG-DONE within $TimeoutSec s`n") }
[IO.File]::AppendAllText($Out, "RUNNER: $Label took $secs s, $(Get-Date -Format 'yyyy-MM-dd HH:mm')`n")
Write-Output "done: $Label in $secs s -> $Out"
