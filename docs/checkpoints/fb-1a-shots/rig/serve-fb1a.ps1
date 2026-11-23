# FB-1a rig port -- the server (stands in for fb1a_rig.py's serve() and its page.route()).
#   powershell -NoProfile -ExecutionPolicy Bypass -File serve-fb1a.ps1 -Root <tree> -RigDir <this folder> -Out <log file>
# Port 8800 serves the driver page; ports 8801..8806 serve the tree, one port per "device", so each device
# is its own origin and keeps its own localStorage (Playwright gave each its own browser context).
# Like the chat's route(): the three vendored Firebase scripts are answered with the fake (app-compat) or an
# empty script (auth, firestore); every other host is blocked (here by a Content-Security-Policy on the page:
# only the page's own origin may be fetched). The app's files are served byte for byte; index.html alone gets
# two script tags inserted straight after <head> (bridge.js, helpers-guard.js), as add_init_script did.
# POST /__rig/log appends the driver's lines to -Out.
param([string]$Root, [string]$RigDir, [string]$Out)
$ErrorActionPreference = 'Stop'
$Root = (Resolve-Path -LiteralPath $Root).Path
$RigDir = (Resolve-Path -LiteralPath $RigDir).Path
$l = New-Object System.Net.HttpListener
foreach ($p in 8800..8806) { $l.Prefixes.Add("http://localhost:$p/") }
$l.Start()
$pool = [runspacefactory]::CreateRunspacePool(1, 64); $pool.Open()
$h = {
  param($c, $Root, $RigDir, $Out)
  $types = @{ '.html' = 'text/html; charset=utf-8'; '.js' = 'application/javascript; charset=utf-8'; '.css' = 'text/css; charset=utf-8';
    '.json' = 'application/json'; '.svg' = 'image/svg+xml'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.gif' = 'image/gif';
    '.woff2' = 'font/woff2'; '.woff' = 'font/woff'; '.ttf' = 'font/ttf'; '.ico' = 'image/x-icon'; '.webmanifest' = 'application/manifest+json' }
  function Send($c, [byte[]]$b, $type) { $c.Response.ContentType = $type; $c.Response.ContentLength64 = $b.Length; $c.Response.OutputStream.Write($b, 0, $b.Length) }
  try {
    $c.Response.KeepAlive = $false
    $c.Response.Headers.Add('Cache-Control', 'no-store')
    $path = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath)
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    if ($c.Request.HttpMethod -eq 'POST' -and $path -eq '/__rig/log') {
      $rd = New-Object System.IO.StreamReader($c.Request.InputStream, $utf8)
      $txt = $rd.ReadToEnd(); $rd.Close()
      $m = New-Object System.Threading.Mutex($false, 'fb1aRigLog')
      [void]$m.WaitOne(); try { [IO.File]::AppendAllText($Out, $txt, $utf8) } finally { $m.ReleaseMutex() }
      Send $c ($utf8.GetBytes('ok')) 'text/plain'; return
    }
    if ($path -eq '/' -and $c.Request.Url.Port -eq 8800) { $path = '/__rig/driver.html' }
    if ($path -eq '/') { $path = '/index.html' }
    if ($path -like '*/vendor/firebase/*') {
      if ($path -like '*firebase-app-compat*') { Send $c ([IO.File]::ReadAllBytes((Join-Path $RigDir 'fake-firebase.js'))) 'application/javascript; charset=utf-8' }
      else { Send $c ($utf8.GetBytes('/* rig */')) 'application/javascript; charset=utf-8' }
      return
    }
    $base = $Root
    if ($path.StartsWith('/__rig/')) { $base = $RigDir; $path = $path.Substring(6) }
    $f = Join-Path $base ($path.TrimStart('/') -replace '/', '\')
    if ((Test-Path -LiteralPath $f -PathType Leaf) -and ((Resolve-Path -LiteralPath $f).Path.StartsWith($base))) {
      $b = [IO.File]::ReadAllBytes($f)
      $ext = [IO.Path]::GetExtension($f).ToLower()
      $type = 'application/octet-stream'; if ($types.ContainsKey($ext)) { $type = $types[$ext] }
      if ($base -eq $Root -and $path -eq '/index.html') {
        $c.Response.Headers.Add('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:")
        $html = $utf8.GetString($b)
        $i = $html.IndexOf('<head>')
        $inj = '<head><script src="/__rig/bridge.js"></script><script src="/__rig/helpers-guard.js"></script>'
        $html = $html.Substring(0, $i) + $inj + $html.Substring($i + 6)
        $b = $utf8.GetBytes($html)
      }
      Send $c $b $type
    } else { $c.Response.StatusCode = 404 }
  } catch { try { $c.Response.StatusCode = 500 } catch {} }
  finally { try { $c.Response.OutputStream.Close() } catch {} }
}
Write-Output "fb1a rig: serving $Root on localhost:8801-8806, driver on 8800, log -> $Out"
$jobs = New-Object System.Collections.ArrayList
while ($l.IsListening) {
  $c = $l.GetContext()
  $ps = [powershell]::Create(); $ps.RunspacePool = $pool
  [void]$ps.AddScript($h).AddArgument($c).AddArgument($Root).AddArgument($RigDir).AddArgument($Out)
  [void]$jobs.Add(@{ ps = $ps; ar = $ps.BeginInvoke() })
  for ($k = $jobs.Count - 1; $k -ge 0; $k--) { if ($jobs[$k].ar.IsCompleted) { try { $jobs[$k].ps.EndInvoke($jobs[$k].ar) | Out-Null } catch {}; $jobs[$k].ps.Dispose(); $jobs.RemoveAt($k) } }
}
