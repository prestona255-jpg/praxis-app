# PRAXIS SHOT RIG — CDP device-emulation screenshots.
#
# WHY THIS EXISTS (2026-07-22, ARC STANDARD Stage 2):
#   `chrome --headless --window-size=390,N --screenshot` DOES NOT give you a
#   390px viewport on Windows. Chrome clamps the window's layout width to ~512
#   and then writes a 390-wide IMAGE — so the capture is a 512 layout CROPPED,
#   and every mobile claim measured on it is false. Caught by the in-page audit
#   reporting `window.innerWidth = 512` under a `--window-size=390` capture.
#   This is the CLAUDE.md tier lesson wearing a screenshot: verify at the REAL
#   viewport, never at one the renderer merely labelled.
#
#   Emulation.setDeviceMetricsOverride is the only honest lever. This script
#   drives it over CDP and captures full-page.
#
# Usage:
#   powershell -NoProfile -ExecutionPolicy Bypass -File .claude/rig/shoot.ps1 `
#     -Url "file:///C:/.../mockup.html?w=390" -Out "C:/.../shot.png" -Width 390
#
# -Probe returns the page's own viewport readout instead of shooting, so you
# can prove the override took before you trust a capture.

param(
  [Parameter(Mandatory=$true)][string]$Url,
  [string]$Out,
  [int]$Width = 390,
  [int]$Height = 844,
  [double]$Dsf = 2,
  [switch]$Mobile,
  [int]$Port = 9333,
  [int]$SettleMs = 1200,
  [switch]$Probe
)

$ErrorActionPreference = 'Stop'
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$profileDir = Join-Path $env:TEMP ("praxis-shoot-" + $Port)

function Send-Cmd($ws, [int]$id, [string]$method, $params) {
  $msg = @{ id = $id; method = $method }
  if ($params) { $msg.params = $params }
  $json = $msg | ConvertTo-Json -Depth 10 -Compress
  $bytes = [Text.Encoding]::UTF8.GetBytes($json)
  $seg = [System.ArraySegment[byte]]::new($bytes)
  $ws.SendAsync($seg, 'Text', $true, [Threading.CancellationToken]::None).GetAwaiter().GetResult() | Out-Null
}

function Recv-Msg($ws) {
  $buf = [byte[]]::new(131072)
  $seg = [System.ArraySegment[byte]]::new($buf)
  $sb = New-Object System.Text.StringBuilder
  do {
    $r = $ws.ReceiveAsync($seg, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
    [void]$sb.Append([Text.Encoding]::UTF8.GetString($buf, 0, $r.Count))
  } while (-not $r.EndOfMessage)
  return $sb.ToString()
}

function Invoke-Cmd($ws, [ref]$idRef, [string]$method, $params) {
  $idRef.Value = $idRef.Value + 1
  $want = $idRef.Value
  Send-Cmd $ws $want $method $params
  while ($true) {
    $raw = Recv-Msg $ws
    $obj = $raw | ConvertFrom-Json
    if ($obj.PSObject.Properties.Name -contains 'id' -and $obj.id -eq $want) { return $obj }
  }
}

# --- ATTACH to an already-running headless Chrome ---------------------------
# This script does NOT launch the browser: Start-Process is denied under the
# agent sandbox ("Access is denied", 2026-07-22). Start it yourself first, in
# the background, from the Bash tool:
#
#   "/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new \
#     --disable-gpu --hide-scrollbars --remote-debugging-port=9333 \
#     --user-data-dir=<temp>/praxis-shoot-9333 --no-first-run about:blank
#
# Then run this script as many times as you like against that one instance.
try {
  $ver = $null
  for ($i = 0; $i -lt 40; $i++) {
    try { $ver = Invoke-RestMethod "http://127.0.0.1:$Port/json/version"; break } catch { Start-Sleep -Milliseconds 250 }
  }
  if (-not $ver) { throw "No CDP endpoint on port $Port — start headless Chrome first (see header)." }

  $target = Invoke-RestMethod -Method Put "http://127.0.0.1:$Port/json/new?about:blank"
  $ws = New-Object System.Net.WebSockets.ClientWebSocket
  $ws.ConnectAsync([Uri]$target.webSocketDebuggerUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult() | Out-Null
  $id = 0

  Invoke-Cmd $ws ([ref]$id) 'Page.enable' @{} | Out-Null
  Invoke-Cmd $ws ([ref]$id) 'Runtime.enable' @{} | Out-Null

  # THE LOAD-BEARING CALL — a real layout viewport, not a window hint.
  Invoke-Cmd $ws ([ref]$id) 'Emulation.setDeviceMetricsOverride' @{
    width = $Width; height = $Height; deviceScaleFactor = $Dsf; mobile = [bool]$Mobile
  } | Out-Null

  Invoke-Cmd $ws ([ref]$id) 'Page.navigate' @{ url = $Url } | Out-Null

  # wait for document + webfonts, then settle
  for ($i = 0; $i -lt 80; $i++) {
    $r = Invoke-Cmd $ws ([ref]$id) 'Runtime.evaluate' @{
      expression = "document.readyState + '|' + (document.fonts ? document.fonts.status : 'loaded')"
      returnByValue = $true
    }
    if ($r.result.result.value -eq 'complete|loaded') { break }
    Start-Sleep -Milliseconds 150
  }
  Start-Sleep -Milliseconds $SettleMs

  if ($Probe) {
    $r = Invoke-Cmd $ws ([ref]$id) 'Runtime.evaluate' @{
      expression = "JSON.stringify({innerWidth:window.innerWidth,innerHeight:window.innerHeight,dpr:window.devicePixelRatio,scrollWidth:document.documentElement.scrollWidth,bodyClass:document.body.className})"
      returnByValue = $true
    }
    Write-Output $r.result.result.value
  } else {
    if (-not $Out) { throw "-Out is required unless -Probe" }
    $shot = Invoke-Cmd $ws ([ref]$id) 'Page.captureScreenshot' @{
      format = 'png'; captureBeyondViewport = $true
    }
    [IO.File]::WriteAllBytes($Out, [Convert]::FromBase64String($shot.result.data))
    $px = [IO.File]::ReadAllBytes($Out)[16..23]
    $w = [BitConverter]::ToInt32(($px[0..3])[3..0], 0)
    $h = [BitConverter]::ToInt32(($px[4..7])[3..0], 0)
    Write-Output ("{0}  {1} x {2} device px  (css {3} @dsf {4})" -f (Split-Path $Out -Leaf), $w, $h, $Width, $Dsf)
  }

  $ws.CloseAsync('NormalClosure', 'done', [Threading.CancellationToken]::None).GetAwaiter().GetResult() | Out-Null
}
finally {
  # close only OUR tab; the shared browser keeps running for the next shot
  try { Invoke-RestMethod "http://127.0.0.1:$Port/json/close/$($target.id)" | Out-Null } catch {}
}
