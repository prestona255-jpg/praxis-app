# R-CAPTURE — Lane 3 checkpoint (Android share_target)

Recon item 6 verdict: **Conditional GO for Android text-only.** NO-GO file/image
(the SW bails on non-GET, `sw.js`); NO-GO iOS (WebKit has no Web Share Target). Built
the GO path only.

## Text-only share_target  ✅ COMPLETE (committed local)

- `manifest.json`: `share_target { action:"/", method:"GET", params:{title,text,url} }`.
- `js/views.js`: `capHandleShareTarget()` — net-new `location.search` plumbing (the
  recon flagged the router is 100% hash-based, zero query handling existed). Composes
  title+text+url, opens the door pre-filled, then `history.replaceState` strips the
  query so a reload never re-fires. No-op when there is no share payload.
- `js/app.js`: called once at boot, right after `initCaptureDoor`.

Parse PASS (views + app); manifest JSON valid.

Live-verify (localhost rig — a real Android share intent needs an installed PWA on a
device, a Preston live-smoke item): loaded `/?title=…&text=…&url=…#home` →

| Check | Evidence |
|---|---|
| Door opens on landing | `#capSheet.is-open` = true |
| Pre-filled, composed | field = `"An article\nA shared thought about dignity\nhttps://example.com/x"` |
| Query stripped | `location.search === ''` |
| Hash route preserved | `location.hash === '#home'` |
| Field focused | `activeElement === capField` |
| No-op on normal open | prior cold opens never auto-opened the door; `?cb=N` (no share keys) returns before stripping |
| No console errors | clean |

Explicitly NOT built (recon NO-GO, recorded): file/image share (would need SW POST
interception — real surgery), and any iOS path (platform does not implement it).

Residual (Preston live-smoke): a real Android "Share → Praxis" intent from another app
on an installed PWA.
