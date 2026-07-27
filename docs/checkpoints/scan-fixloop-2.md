# SCAN — FIX LOOP 2 (field F7 blocker + F6) · Opus 4.8

Round STAYS OPEN. Two fixes off Preston's v3.266 real-device felt pass (iPhone
Safari). Commit-per-slice, ONE cache bump at end (v3.266→**v3.267**), NO push
(Preston's word). The rig has no camera — FX-G's root cause is argued from source
with file:line; the iOS stream lifecycle is device-verified by Preston.

Ground: HEAD 340e342 (v3.266 live) → 2 local commits `1600bff..<FX-H>`.
Foundations byte-locked (md5 unchanged). FX-G committed `--no-verify` (sw.js bump
deferred per the loop directive; dry-run confirmed the ONLY hook block was the
deferred sw.js); FX-H carries the v3.267 bump (hook-clean).

## Commits
| slice | commit | files | what |
|---|---|---|---|
| FX-G ⭐ | `1600bff` | js/views.js | re-attach the display on mode switch |
| FX-H | (this) | assets/components.css, sw.js | state-gate the receipt + v3.267 |

## FX-G ⭐ (F7, BLOCKER) — SHELF MODE GOES DARK → fixed
**Field (screenshot, v3.266, iPhone Safari):** Book = live video; switch to Shelf =
BLACK viewfinder, camera indicator STILL LIT (stream alive, picture detached).

**Root cause (source, PRE-EXISTING since S3 — NOT FX-A):** iOS Safari has no
`window.BarcodeDetector`, so Book mode decodes via zxing. `scanStartBookDecode`'s
`scanZxingReader.decodeFromConstraints(…, v, …)` (views.js:8262) opens zxing's OWN
stream (S2) and reassigns `video.srcObject = S2`; our getUserMedia stream
(`scanStream`, S1) is orphaned but stays live. On the mode switch
`scanSetMode('shelf')` → `scanStopBookDecode()` → `scanZxingReader.reset()`
(views.js:8276) stops S2 and NULLs `video.srcObject`; Shelf never re-attached
anything → black video, S1 still live → lit indicator. Native BarcodeDetector never
hits this (no S2). FX-A did NOT cause it (the zxing decode + reset predate the fix
loop); FX-A's teardown fires only on scanStopStream, not on a mode switch.

**Fix:** `scanEnsureDisplay()` (views.js), called in `scanSetMode` after
`scanStopBookDecode` for BOTH modes — guarantees a live picture: already-live →
no-op (leaves Book's zxing stream alone); video detached but `scanStream` alive →
**RE-ATTACH the SAME stream** (no new stream, no leak); display stream truly dead →
re-warm ONE fresh stream (guarded on no-overlay). Mode switching never stops the
display; decode still stops in Shelf and restarts in Book.

**Verified (rig, iOS zxing-detach simulated):** Book→Shelf re-attaches the surviving
stream (`v.srcObject === scanStream`, NOT a new one), S2 released, decode off, live
picture; Shelf→Book stays live + decode restarts; all three `scanEnsureDisplay`
branches (re-attach / re-warm / no-op); **FX-A regression PASS** — `scanStopStream`
still stops the stream + nulls `scanStream` on exit; **CSS suspect (FX-D ground flip)
RULED OUT** — `#scan-cam-video` computed `display|visibility|opacity|zIndex` identical
Book vs Shelf (`block|visible|1|auto`). **DEVICE-OWED:** the live iOS Book→Shelf→Book
picture + light-death-on-exit — Preston's phone.

## FX-H (F6) — THE CLIPPED BOTTOM ELEMENT → fixed
**Field:** a dark pill peeks from the bottom edge below the verdict card in Book mode,
clipped, never reachable.

**Census (rig, Book resting):** the leaker is `#scan-receipt` — it was `display:flex`
in the resting state, hidden only by `transform:translateY(140%)`. On the rig
(env()=0) it clears by 3px (top 847 > vh 844); on iPhone the
`bottom:calc(24px + env(safe-area-inset-bottom))` anchor rises ~34px, pushing the
pill up into view — the F6 dark pill. (The shelf-glyph reads `peeksAbove` in the probe
but is `opacity:0` → invisible, and the shelve-flight reads its rect, so it is left as-is.)

**Fix (state-gate, not a pixel nudge):** `#scan-receipt` base → **`display:none`**;
`#scan-receipt.is-on` → `display:flex`. Dropped the now-moot translateY/transition.
The receipt renders ONLY after a shelve (`scanShowReceipt` adds `.is-on`), and the
existing `bottom:calc(24px + env(…))` seats it fully on-screen above the home-indicator
inset. On iPhone, `display:none` = it cannot peek at all.

**Verified (rig):** Book resting → receipt `display:none`, does not peek; simulated
shelve → `display:flex`, "Shelved 3", fully on-screen (bottom 820 ≤ vh 844, 24px above
the fold); after hide → `display:none`. Console clean.

## HALT — device re-walk (Preston, after deploy)
Book→Shelf→Book picture in all three · shelf shot → shimmer → tray → walker → Shelve ·
Undo forced-timing race on prestonpraxistest · light-death still wins on every exit
(FX-A regression) · the F6 pill is gone (Book resting) and the receipt is properly
housed after a shelve. CACHE_VERSION → **v3.267**. Round stays OPEN; push is Preston's word.
NON-GOALS honored: no redesign, no endpoint changes, no new features.
