# P1 -- the Praxis checks. Runs every check the repo already has and reports each one.
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools/checks.ps1
# Takes no arguments, and runs from any folder: the repo root is the parent of the folder this file is in,
# so a copy of the tree checks itself. Windows PowerShell 5.1, cscript and the installed Chrome; nothing is
# downloaded and nothing inside the repo is written (logs go to a new folder under %TEMP%).
# What runs, in order: two self checks (the parse check must reject a broken file; the rig must not pass a suite
# that does not exist), the parse check on sw.js, js/*.js and assets/*.js, every cscript harness in $Harnesses
# below, and every rig suite in tools/rig/scenarios/ (picked up by itself). One PASS or FAIL line per check.
# Exit: 0 when every check passed; 1 when any check failed; 2 when this script itself could not finish.
# A NEW HARNESS is added as one line in $Harnesses, and nowhere else.
# With PRAXIS_PROVE_RED=true a last check fails on purpose (the workflow's "prove red" run).
# With GITHUB_ACTIONS=true it also prints two annotations and writes the step summary.

$Harnesses = @(
  @('fx1c-sim',          'tools/fx1c-sim'),
  @('delete-test',       'tools/delete-test'),
  @('export-test',       'tools/export-test'),
  @('ceiling-core-test', 'tools/ceiling-core-test'),
  @('lens-data-test',    'tools/lens-data-test/run.js'),
  @('lens-eval-test',    'tools/lens-eval-test/run.js'),
  @('r1-test',           'tools/r1-test'),
  @('r3-test',           'tools/r3-test')
)
$CscriptTimeoutSec = 300
$RigTimeoutSec = 1000

$ErrorActionPreference = 'Stop'
$script:results = New-Object System.Collections.ArrayList
$script:ci = ($env:GITHUB_ACTIONS -eq 'true')

# Every printed line goes through Scrub, so no path under the user's profile is ever shown: a check's own output
# (a harness that names the file it could not load, say) reads %TEMP%\... or %USERPROFILE%\... instead.
function Scrub([string]$s) {
  if (-not $s) { return $s }
  foreach ($pair in @(@($env:TEMP, '%TEMP%'), @($env:USERPROFILE, '%USERPROFILE%'))) {
    $v = $pair[0]
    if ($v -and $v.Length -gt 3) {
      $s = [regex]::Replace($s, [regex]::Escape($v), $pair[1], 'IgnoreCase')
      $s = [regex]::Replace($s, [regex]::Escape($v.Replace('\', '/')), $pair[1], 'IgnoreCase')
    }
  }
  return $s
}

function Say([string]$s) { [Console]::Out.WriteLine((Scrub $s)); [Console]::Out.Flush() }

function Q([string]$s) { return '"' + $s + '"' }

function Last-Line([string]$text) {
  $last = ''
  foreach ($ln in ($text -split "`r?`n")) { if ($ln.Trim() -ne '') { $last = $ln.Trim() } }
  return $last
}

# Runs one command and returns @{ code; out; secs; timedOut }. The exit code is read from the process itself.
# Standard output and standard error are both captured through pipes, so nothing written to stderr can raise a
# PowerShell error. A command still running after $timeoutSec is ended, with its whole process tree.
function Run-Command([string]$exe, [string[]]$argList, [int]$timeoutSec) {
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $exe
  $psi.Arguments = (($argList | ForEach-Object { Q $_ }) -join ' ')
  $psi.UseShellExecute = $false
  $psi.CreateNoWindow = $true
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.WorkingDirectory = $script:root
  $t0 = Get-Date
  $p = New-Object System.Diagnostics.Process
  $p.StartInfo = $psi
  [void]$p.Start()
  $outTask = $p.StandardOutput.ReadToEndAsync()
  $errTask = $p.StandardError.ReadToEndAsync()
  $timedOut = $false
  if (-not $p.WaitForExit($timeoutSec * 1000)) {
    $timedOut = $true
    try {
      $kpsi = New-Object System.Diagnostics.ProcessStartInfo
      $kpsi.FileName = 'taskkill.exe'
      $kpsi.Arguments = '/T /F /PID ' + $p.Id
      $kpsi.UseShellExecute = $false
      $kpsi.CreateNoWindow = $true
      $kpsi.RedirectStandardOutput = $true
      $kpsi.RedirectStandardError = $true
      $k = [System.Diagnostics.Process]::Start($kpsi)
      [void]$k.WaitForExit(30000)
    } catch {}
    try { if (-not $p.HasExited) { $p.Kill() } } catch {}
    [void]$p.WaitForExit(30000)
  } else {
    $p.WaitForExit()
  }
  $out = ''
  if ($outTask.Wait(30000)) { $out += $outTask.Result }
  if ($errTask.Wait(30000)) { $err = $errTask.Result; if ($err) { $out += $err } }
  $code = -1
  if ($p.HasExited -and -not $timedOut) { $code = $p.ExitCode }
  $secs = ((Get-Date) - $t0).TotalSeconds
  return @{ code = $code; out = $out; secs = $secs; timedOut = $timedOut }
}

function Record([string]$id, [bool]$pass, [int]$code, [double]$secs, [string]$detail, [string]$output) {
  $word = 'FAIL'; if ($pass) { $word = 'PASS' }
  $s = $secs.ToString('0.0', [Globalization.CultureInfo]::InvariantCulture)
  Say ($word + '  ' + $id + '  exit ' + $code + '  ' + $s + ' s  | ' + $detail)
  if (-not $pass) {
    Say ('----- output of ' + $id + ' -----')
    if ($output) { Say ($output.TrimEnd()) }
    Say '----- end -----'
  }
  [void]$script:results.Add(@{ id = $id; pass = $pass; secs = $s; detail = $detail })
}

# A cscript check. $wantCode is the exit code that means PASS.
function Check-Cscript([string]$id, [string[]]$cscriptArgs, [int]$wantCode, [string]$fixedDetail) {
  $r = Run-Command 'cscript.exe' (@('//nologo', '//E:jscript') + $cscriptArgs) $CscriptTimeoutSec
  if ($r.timedOut) { Record $id $false $r.code $r.secs 'timed out' $r.out; return }
  $detail = $fixedDetail; if (-not $detail) { $detail = Last-Line $r.out }
  Record $id ($r.code -eq $wantCode) $r.code $r.secs $detail $r.out
}

# A rig run of one suite. $wantCode is the exit code that means PASS. Its detail is the last summary line of its log.
function Check-Rig([string]$id, [string]$suite, [string]$label, [string]$log, [int]$wantCode, [string]$fixedDetail) {
  $runPs1 = Join-Path $script:root 'tools\rig\run.ps1'
  $r = Run-Command 'powershell.exe' @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $runPs1, '-Suite', $suite,
    '-Tree', $script:root, '-Label', $label, '-Out', $log) $RigTimeoutSec
  $logText = ''
  if (Test-Path -LiteralPath $log -PathType Leaf) { $logText = [IO.File]::ReadAllText($log) }
  $shown = $logText; if (-not $shown) { $shown = $r.out }
  if ($r.timedOut) { Record $id $false $r.code $r.secs 'timed out' $shown; return }
  $detail = $fixedDetail
  if (-not $detail) {
    $m = [regex]::Matches($logText, '(?m)^.*: \d+ / \d+ passed, \d+ failed.*$')
    if ($m.Count -gt 0) { $detail = $m[$m.Count - 1].Value.Trim() } else { $detail = Last-Line $r.out }
  }
  Record $id ($r.code -eq $wantCode) $r.code $r.secs $detail $shown
}

function Sorted-Names([string]$dir, [string]$ext) {
  $names = New-Object System.Collections.ArrayList
  if (Test-Path -LiteralPath $dir -PathType Container) {
    foreach ($f in (Get-ChildItem -LiteralPath $dir -File)) { if ($f.Extension -eq $ext) { [void]$names.Add($f.BaseName) } }
  }
  # Sorted on the name WITHOUT its extension, ordinal: fb-1a before fb-1a-extras on every machine.
  $arr = [string[]]$names.ToArray([string])
  [Array]::Sort($arr, [StringComparer]::Ordinal)
  for ($i = 0; $i -lt $arr.Length; $i++) { $arr[$i] = $arr[$i] + $ext }
  return ,$arr
}

function Gh-Escape([string]$s) { return $s.Replace('%', '%25').Replace("`r", ' ').Replace("`n", ' ') }

try {
  $script:root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
  Set-Location -LiteralPath $script:root
  [Environment]::CurrentDirectory = $script:root

  $logName = 'praxis-checks-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '-' + ([guid]::NewGuid().ToString('N').Substring(0, 6))
  $logDir = Join-Path $env:TEMP $logName
  [void](New-Item -ItemType Directory -Path $logDir)

  # INFO lines (not checks)
  $sha = 'none'
  if ((Test-Path -LiteralPath (Join-Path $script:root '.git')) -and (Get-Command git.exe -ErrorAction SilentlyContinue)) {
    $g = Run-Command 'git.exe' @('rev-parse', '--short', 'HEAD') 60
    if ($g.code -eq 0 -and (Last-Line $g.out)) { $sha = Last-Line $g.out }
  }
  $version = 'unknown'; $eol = 'unknown'
  $swPath = Join-Path $script:root 'sw.js'
  if (Test-Path -LiteralPath $swPath -PathType Leaf) {
    $sw = [IO.File]::ReadAllText($swPath)
    $vm = [regex]::Match($sw, "CACHE_VERSION\s*=\s*'([^']+)'")
    if ($vm.Success) { $version = $vm.Groups[1].Value }
    if ($sw.Contains("`r`n")) { $eol = 'CRLF' } else { $eol = 'LF' }
  }
  $psv = $PSVersionTable.PSVersion.ToString()
  $chrome = 'not found'
  foreach ($cand in @((Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'), (Join-Path ${env:ProgramFiles(x86)} 'Google\Chrome\Application\chrome.exe'),
      (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe'))) { if ($cand -and (Test-Path -LiteralPath $cand)) { $chrome = 'found'; break } }
  Say ('INFO commit ' + $sha)
  Say ('INFO version ' + $version)
  Say ('INFO line-endings sw.js ' + $eol)
  Say ('INFO powershell ' + $psv)
  Say ('INFO chrome ' + $chrome)
  Say ('INFO logs %TEMP%\' + $logName)

  # Self checks: each must see its check FAIL.
  $broken = Join-Path $logDir 'broken.js'
  [IO.File]::WriteAllText($broken, 'var x = ;;; function {{{', (New-Object System.Text.UTF8Encoding($false)))
  Check-Cscript 'self parse-rejects-broken' @('tools/parse-check', $broken) 1 'wanted exit 1'
  Check-Rig 'self rig-missing-suite' 'no-such-suite' 'none' (Join-Path $logDir 'rig-none.txt') 1 'wanted exit 1'

  # The parse check on every served script.
  $targets = New-Object System.Collections.ArrayList
  if (Test-Path -LiteralPath $swPath -PathType Leaf) { [void]$targets.Add('sw.js') }
  foreach ($n in (Sorted-Names (Join-Path $script:root 'js') '.js')) { [void]$targets.Add('js/' + $n) }
  foreach ($n in (Sorted-Names (Join-Path $script:root 'assets') '.js')) { [void]$targets.Add('assets/' + $n) }
  if ($targets.Count -eq 0) { Record 'parse none found' $false 1 0 'no served script was found' '' }
  foreach ($t in $targets) { Check-Cscript ('parse ' + $t) @('tools/parse-check', $t) 0 '' }

  # Every cscript harness.
  foreach ($h in $Harnesses) { Check-Cscript ('harness ' + $h[0]) @($h[1]) 0 '' }

  # Every rig suite, one at a time.
  $suites = Sorted-Names (Join-Path $script:root 'tools\rig\scenarios') '.js'
  if ($suites.Count -eq 0) { Record 'rig none found' $false 1 0 'no suite was found in tools/rig/scenarios' '' }
  foreach ($n in $suites) {
    $suite = $n.Substring(0, $n.Length - 3)
    Check-Rig ('rig ' + $suite) $suite $suite (Join-Path $logDir ('rig-' + $suite + '.txt')) 0 ''
  }

  if ($env:PRAXIS_PROVE_RED -eq 'true') { Record 'prove-red' $false 1 0 'deliberate failure' 'PRAXIS_PROVE_RED is true: this check fails on purpose.' }

  # The summary.
  $total = $script:results.Count
  $failedIds = New-Object System.Collections.ArrayList
  foreach ($x in $script:results) { if (-not $x.pass) { [void]$failedIds.Add($x.id) } }
  $failed = $failedIds.Count
  $passed = $total - $failed
  $checksLine = 'CHECKS: ' + $passed + ' of ' + $total + ' passed, ' + $failed + ' failed'
  $failedList = ($failedIds.ToArray() -join '; ')

  if ($script:ci) {
    if ($failed -eq 0) { Say ('::notice title=Praxis checks::' + (Gh-Escape $checksLine)) }
    else { Say ('::error title=Praxis checks::' + (Gh-Escape ($checksLine + ' -- failed: ' + $failedList))) }
    Say ('::notice title=Praxis checks info::' + (Gh-Escape ('commit ' + $sha + ', ' + $version + ', sw.js ' + $eol + ', powershell ' + $psv + ', chrome ' + $chrome)))
    if ($env:GITHUB_STEP_SUMMARY) {
      $md = New-Object System.Text.StringBuilder
      [void]$md.Append('## ' + $checksLine + "`n`n| check | result | seconds | detail |`n|---|---|---|---|`n")
      foreach ($x in $script:results) {
        $res = 'FAIL'; if ($x.pass) { $res = 'PASS' }
        [void]$md.Append('| ' + $x.id + ' | ' + $res + ' | ' + $x.secs + ' | ' + ($x.detail.Replace('|', '\|')) + " |`n")
      }
      [IO.File]::AppendAllText($env:GITHUB_STEP_SUMMARY, (Scrub $md.ToString()),(New-Object System.Text.UTF8Encoding($false)))
    }
  }

  Say $checksLine
  if ($failed -gt 0) { Say ('FAILED: ' + $failedList) }
  Say 'CHECKS-DONE'
  if ($failed -gt 0) { exit 1 }
  exit 0
} catch {
  Say ('CHECKS: could not finish: ' + $_.Exception.Message)
  exit 2
}
