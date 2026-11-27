# Praxis rig -- one run of one suite, on Windows. Meets "The contract between a launcher and the page" in README.md.
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools/rig/run.ps1 -Suite <name> -Tree <folder holding index.html>
#              -Label <text> -Out <log file> [-TimeoutSec 900] [-Chrome <path to chrome.exe>]
# -Suite names a file in tools/rig/scenarios/ (fb-1a runs scenarios/fb-1a.js); nothing else about a suite is known here.
# Starts serve.ps1 on the tree, opens the driver page in the installed Chrome, headless, with a FRESH profile (so every
# device's storage starts empty), waits for the driver's RIG-DONE line, then stops Chrome and the server. Downloads nothing.
# Exit code: 0 when RIG-DONE came, the last summary line reads "0 failed" and the run was not stopped; 1 when a check
# failed or the run stopped (or no summary line was printed); 2 when RIG-DONE never came within the timeout, or when
# a rig server was already answering on the ports (it would have taken this run's log lines). Chrome and the server
# are stopped however the run ends.
param([string]$Suite, [string]$Tree, [string]$Label, [string]$Out, [int]$TimeoutSec = 900, [string]$Chrome = '')
$ErrorActionPreference = 'Stop'
if (-not $Suite -or -not $Tree -or -not $Label -or -not $Out) { Write-Output 'usage: run.ps1 -Suite <name> -Tree <folder> -Label <text> -Out <log file>'; exit 2 }
if (-not (Test-Path -LiteralPath (Join-Path $Tree 'index.html') -PathType Leaf)) { Write-Output '-Tree must hold index.html'; exit 2 }
$rigDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $Chrome) {
  foreach ($cand in @((Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'), (Join-Path ${env:ProgramFiles(x86)} 'Google\Chrome\Application\chrome.exe'),
      (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe'))) { if ($cand -and (Test-Path -LiteralPath $cand)) { $Chrome = $cand; break } }
}
if (-not $Chrome) { Write-Output 'no Chrome found: pass -Chrome <path to chrome.exe>'; exit 2 }
$utf8 = New-Object System.Text.UTF8Encoding($false)
$Out = [IO.Path]::GetFullPath($Out)
[IO.File]::WriteAllText($Out, '', $utf8)
$Tree = (Resolve-Path -LiteralPath $Tree).Path
function Q([string]$s) { return '"' + $s + '"' }   # Start-Process joins its arguments with spaces and does not quote them
# The log is read while serve.ps1 appends to it. A plain ReadAllText asks for the file with the other side's writes
# refused, so it threw IOException whenever it landed on an append, the launcher died, and its server and Chrome were
# left running (2026-11-26). Read-Log lets the writer keep writing and tries again on an IOException.
function Read-Log([string]$path) {
  for ($t = 0; $t -lt 25; $t++) {
    try {
      $fs = New-Object System.IO.FileStream($path, [IO.FileMode]::Open, [IO.FileAccess]::Read, ([IO.FileShare]::ReadWrite -bor [IO.FileShare]::Delete))
      try { $sr = New-Object System.IO.StreamReader($fs, $utf8); return $sr.ReadToEnd() } finally { $fs.Dispose() }
    } catch [System.IO.IOException] { Start-Sleep -Milliseconds 200 }
  }
  return ''
}
# A server already answering on the rig's ports is someone else's (another run, or one left behind): this run's own
# server could not bind, and every line this run's page posts would go to that server's log instead of -Out.
$busy = $false
try { $r0 = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:8800/__rig/driver.html' -TimeoutSec 2; $busy = $true } catch {}
if ($busy) {
  $msg = 'RUNNER: a rig server is already answering on localhost:8800 (another run, or one left behind); stop it and run again'
  [IO.File]::AppendAllText($Out, "$msg`n", $utf8); Write-Output $msg; exit 2
}
$srv = $null; $prof = Join-Path $env:TEMP ('praxis-rig-' + [guid]::NewGuid().ToString('N'))
$done = $false; $secs = 0
try {
  $srv = Start-Process -FilePath 'powershell.exe' -PassThru -WindowStyle Hidden -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Q (Join-Path $rigDir 'serve.ps1')), '-Root', (Q $Tree), '-RigDir', (Q $rigDir), '-Out', (Q $Out))
  $ok = $false
  for ($i = 0; $i -lt 50; $i++) { try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:8800/__rig/driver.html' -TimeoutSec 2; if ($r.StatusCode -eq 200) { $ok = $true; break } } catch {}; Start-Sleep -Milliseconds 200 }
  if ($ok -and $srv.HasExited) { $ok = $false }   # something answered, but our server is gone: it is not ours
  if (-not $ok) { Write-Output 'the rig server did not start (is something else on ports 8800-8806?)'; exit 2 }
  $url = 'http://localhost:8800/__rig/driver.html?suite=' + [Uri]::EscapeDataString($Suite) + '&label=' + [Uri]::EscapeDataString($Label)
  $cp = Start-Process -FilePath $Chrome -PassThru -ArgumentList @('--headless=new', ('--user-data-dir=' + (Q $prof)), '--no-first-run', '--no-default-browser-check',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--window-size=1400,900', $url)
  $t0 = Get-Date
  while (((Get-Date) - $t0).TotalSeconds -lt $TimeoutSec) {
    Start-Sleep -Seconds 2
    if ((Read-Log $Out).Contains('RIG-DONE')) { $done = $true; break }
  }
  $secs = [int]((Get-Date) - $t0).TotalSeconds
}
finally {
  # whatever happened above, this run's Chrome and server do not outlive it
  try { Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like "*$prof*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } } catch {}
  if ($srv) { try { Stop-Process -Id $srv.Id -Force -ErrorAction SilentlyContinue } catch {} }
  Start-Sleep -Milliseconds 500
  try { Remove-Item -LiteralPath $prof -Recurse -Force -ErrorAction SilentlyContinue } catch {}
}
if (-not $done) { [IO.File]::AppendAllText($Out, "`nRUNNER: no RIG-DONE within $TimeoutSec s`n", $utf8) }
[IO.File]::AppendAllText($Out, "RUNNER: $Label took $secs s, $(Get-Date -Format 'yyyy-MM-dd HH:mm')`n", $utf8)
$sums = [regex]::Matches((Read-Log $Out), '(?m)^.*: (\d+) / (\d+) passed, (\d+) failed(.*)$')
$clean = $false
if ($done -and $sums.Count -gt 0) { $last = $sums[$sums.Count - 1]; $clean = ($last.Groups[3].Value -eq '0') -and (-not $last.Groups[4].Value.Contains('STOPPED')) }
$note = ''; if (-not $clean) { $note = '   (NOT clean)' }
Write-Output "done: $Label in $secs s -> $Out$note"
if ($clean) { exit 0 } elseif ($done) { exit 1 } else { exit 2 }
