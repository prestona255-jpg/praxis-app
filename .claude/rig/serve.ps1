param([int]$Port = 8790)
# ── PRAXIS DW RIG · static server ────────────────────────────────────────────
# The desktop-wave (DW) measurement rig's file server. Serves the REPO ROOT
# (two levels up from this script) over http, because the Browser MCPs refuse
# file:// and the app must run on a real origin.
#
# Extracted from .claude/static-server.ps1 at DW batch 4 (2026-07-14) under the
# rig-efficiency law: future sessions LOAD this rig, they do not rebuild it.
#
# ── Hard-won rig facts (do not relearn these) ────────────────────────────────
#  * ONE server port per session. Iterate CSS by swapping the stylesheet <link>
#    to a cache-bust query (see measure.js `bustCss`); a FRESH PORT is needed
#    only when a JS file changes (the SW/browser caches JS per origin).
#  * 127.0.0.1 is a SEPARATE browser origin from localhost -> a fresh-asset twin
#    per port. Binding it needs a urlacl reservation (admin) which this box does
#    not have, so we try and fall back to localhost-only.
#  * KeepAlive MUST be false: HttpListener keep-alive holds the socket open and
#    the pane's network-idle wait never fires.
#  * Cache-Control: no-store on every response — the rig must never serve stale.
#  * Screenshots in this headless pane are PROVEN DEAD (30s timeouts, D0 §2).
#    Geometry is the evidence. Do not try.
# ─────────────────────────────────────────────────────────────────────────────
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
try {
  $listener.Start()
} catch {
  Write-Host "127.0.0.1 twin denied (no urlacl) -> localhost-only on $Port"
  $listener.Prefixes.Remove("http://127.0.0.1:$Port/") | Out-Null
  $listener.Start()
}
Write-Host "praxis-rig serving http://localhost:$Port/ root=$root"
$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".md"   = "text/plain; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".webp" = "image/webp"
  ".ico"  = "image/x-icon"
}
while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    $res.KeepAlive = $false
    $rel = $req.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrEmpty($rel)) { $rel = "index.html" }
    $rel = [System.Uri]::UnescapeDataString($rel)
    $path = Join-Path $root $rel
    if (Test-Path $path -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($path)
      $ext = [System.IO.Path]::GetExtension($path).ToLower()
      if ($mime.ContainsKey($ext)) { $res.ContentType = $mime[$ext] }
      $res.Headers.Add("Cache-Control", "no-store")
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $res.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 not found: $rel")
      $res.OutputStream.Write($msg, 0, $msg.Length)
    }
    $res.OutputStream.Close()
  } catch {
    # keep serving on any per-request error
  }
}
