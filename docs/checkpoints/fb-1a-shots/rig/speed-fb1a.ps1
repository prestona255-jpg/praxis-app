# FB-1a rig -- brief 2.5, speed. Times the start-up snapshot (fb1aBegin, all six kinds) and one full
# fb1aChanged pass per kind on a 150-book library, at CPU 4x (Emulation.setCPUThrottlingRate), in headless
# Chrome over the DevTools protocol. Uses serve-fb1a.ps1 (fake Firebase; every cloud call goes unanswered
# here, so no load ever lands and nothing leaves the page). The library is seeded through the rig's own
# helpers (T.addBook = the Add-a-book write site, captureNote, createArc, createSubTheory, createUserTheme),
# then the page is reloaded so the reader is a cached one, as at a real start-up.
#   powershell -NoProfile -ExecutionPolicy Bypass -File speed-fb1a.ps1 -Tree <repo> -Out <log>
param([string]$Tree, [string]$Out, [int]$DbgPort = 9361)
$ErrorActionPreference = 'Stop'
$rigDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$scratchLog = Join-Path $env:TEMP ('fb1a-speed-srv-' + [guid]::NewGuid().ToString('N') + '.txt')
$srv = Start-Process -FilePath 'powershell.exe' -PassThru -WindowStyle Hidden -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Join-Path $rigDir 'serve-fb1a.ps1'), '-Root', $Tree, '-RigDir', $rigDir, '-Out', $scratchLog)
$prof = Join-Path $env:TEMP ('fb1a-speed-' + [guid]::NewGuid().ToString('N'))
Start-Sleep -Seconds 2
$p = Start-Process -FilePath $chrome -PassThru -ArgumentList @('--headless=new', "--remote-debugging-port=$DbgPort", "--user-data-dir=$prof", '--no-first-run', '--window-size=390,844', 'about:blank')
$lines = New-Object System.Collections.ArrayList
function Say($s) { [void]$lines.Add($s); Write-Output $s }
try {
  $pg = $null
  for ($i = 0; $i -lt 40; $i++) { Start-Sleep -Milliseconds 250; try { $tabs = Invoke-RestMethod -Uri "http://127.0.0.1:$DbgPort/json" -TimeoutSec 2; $pg = $tabs | Where-Object { $_.type -eq 'page' } | Select-Object -First 1; if ($pg) { break } } catch {} }
  if (-not $pg) { throw 'no CDP page' }
  $ws = New-Object System.Net.WebSockets.ClientWebSocket
  $ws.ConnectAsync([Uri]$pg.webSocketDebuggerUrl, [Threading.CancellationToken]::None).Wait()
  $script:id = 0
  function Send-Cdp([string]$method, $params) {
    $script:id++
    $msg = @{ id = $script:id; method = $method; params = $params } | ConvertTo-Json -Depth 8 -Compress
    $bytes = [Text.Encoding]::UTF8.GetBytes($msg)
    $ws.SendAsync([ArraySegment[byte]]$bytes, [Net.WebSockets.WebSocketMessageType]::Text, $true, [Threading.CancellationToken]::None).Wait()
    $buf = New-Object byte[] 1048576
    while ($true) {
      $ms = New-Object IO.MemoryStream
      do { $r = $ws.ReceiveAsync([ArraySegment[byte]]$buf, [Threading.CancellationToken]::None); $r.Wait(); $ms.Write($buf, 0, $r.Result.Count) } while (-not $r.Result.EndOfMessage)
      $txt = [Text.Encoding]::UTF8.GetString($ms.ToArray())
      if ($txt -match ('^\{"id":' + $script:id + ',')) { return ($txt | ConvertFrom-Json) }
    }
  }
  function Eval-Js([string]$js) {
    $res = Send-Cdp 'Runtime.evaluate' @{ expression = $js; awaitPromise = $true; returnByValue = $true; timeout = 120000 }
    if ($res.result.exceptionDetails) { return ('EXCEPTION ' + ($res.result.exceptionDetails | ConvertTo-Json -Depth 5 -Compress)) }
    return $res.result.result.value
  }
  function Wait-Ready { for ($i = 0; $i -lt 120; $i++) { Start-Sleep -Milliseconds 500; if ((Eval-Js "typeof captureNote === 'function' && typeof state === 'object' && typeof fb1aBegin === 'function'") -eq $true) { return } }; throw 'app not ready' }
  $helpers = [IO.File]::ReadAllText((Join-Path $rigDir 'helpers.js'), $utf8)
  Send-Cdp 'Page.enable' @{} | Out-Null
  Send-Cdp 'Page.navigate' @{ url = 'http://localhost:8801/index.html' } | Out-Null
  Wait-Ready
  [void](Eval-Js $helpers)
  [void](Eval-Js "__rigSignIn('speedreader')")
  Start-Sleep -Seconds 2
  [void](Eval-Js $helpers)
  $seed = @'
(function () {
  var i, a = [], s = [];
  for (i = 0; i < 150; i++) { T.addBook('Speed book number ' + i); }
  for (i = 0; i < 60; i++) { T.note('a seeded note, number ' + i + ', with a sentence or two of body text so the record is of an ordinary size'); }
  for (i = 0; i < 10; i++) { a.push(T.arc('Seeded arc ' + i)); }
  for (i = 0; i < 30; i++) { var st = createSubTheory(a[i % 10], { header: 'Seeded sub-theory ' + i }); if (st) { s.push(st.id); } }
  for (i = 0; i < 10; i++) { T.lens('Seeded lens ' + i); }
  var ids = T.bookIds();
  for (i = 0; i < 20; i++) { T.artifact(ids[i], 'a seeded artifact ' + i); }
  saveState();
  return JSON.stringify({ books: ids.length, subs: s.length });
})()
'@
  Say ('seed: ' + (Eval-Js $seed))
  Send-Cdp 'Emulation.setCPUThrottlingRate' @{ rate = 4 } | Out-Null
  Send-Cdp 'Page.reload' @{ ignoreCache = $true } | Out-Null
  Start-Sleep -Seconds 2
  Wait-Ready
  [void](Eval-Js $helpers)
  $measure = @'
(function () {
  var u = T.uid(), kinds = ['books', 'arcs', 'subTheories', 'themes', 'artifacts', 'notebook'], out = {}, i, k;
  function stats(f, n) { var a = [], t; for (i = 0; i < n; i++) { t = performance.now(); f(); a.push(performance.now() - t); } var first = a[0]; a.sort(function (x, y) { return x - y; }); return { first: +first.toFixed(2), median: +a[n >> 1].toFixed(2), max: +a[n - 1].toFixed(2), n: n }; }
  var counts = {}; for (i = 0; i < kinds.length; i++) { var o = fb1aOwned(kinds[i], u), c = 0, x; for (x in o) { c++; } counts[kinds[i]] = c; }
  out.cachedReader = u; out.records = counts;
  out.startupBaseHeld = !!(fb1aBase && fb1aBase.books);
  out.fb1aBegin_allSix = stats(function () { fb1aReset(); fb1aBegin(u); }, 20);
  fb1aReset(); fb1aBegin(u);
  for (k = 0; k < kinds.length; k++) { (function (kind) { out['fb1aChanged_' + kind] = stats(function () { fb1aChanged(kind, u); }, 20); })(kinds[k]); }
  var all = stats(function () { for (var j = 0; j < kinds.length; j++) { fb1aChanged(kinds[j], u); } }, 20);
  out.fb1aChanged_allSix = all;
  return JSON.stringify(out, null, 1);
})()
'@
  Say ('CPU throttling rate: 4x (Emulation.setCPUThrottlingRate)')
  Say ('measure: ' + (Eval-Js $measure))
} finally {
  try { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue } catch {}
  try { Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like "*$prof*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } } catch {}
  try { Stop-Process -Id $srv.Id -Force -ErrorAction SilentlyContinue } catch {}
  [IO.File]::WriteAllText($Out, (($lines -join "`n") + "`nSPEED-DONE " + (Get-Date -Format 'yyyy-MM-dd HH:mm') + "`n"), $utf8)
}
