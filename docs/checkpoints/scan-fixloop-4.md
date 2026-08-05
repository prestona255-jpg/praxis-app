# SCAN — FIX LOOP 4 (F9: crop Shelf capture to the frame) · Opus 4.8

STARTED. Round STAYS OPEN. SINGLE-slice loop: ONE commit carries code + sw.js bump
(v3.268→v3.269) + this checkpoint, through the hook NORMALLY (no --no-verify). NO push.
Model pin: Opus 4.8, default. Reading list read (CLAUDE.md, lessons.md, scan-fixloop-3.md).

## STAGE 0 — STATE + MECHANISM CONFIRM
Ground: HEAD `30f6d99` == origin/main == local (git fetch); tracked tree clean;
CACHE_VERSION live = praxis-v3.268. Foundations byte-locked (verify at commit).

F9 mechanism CONFIRMED in code (no existing crop → not a re-triage):
- **(a) capture draws the FULL frame, no region logic** — `scanCaptureBase64` (views.js:8593):
  `cv.getContext('2d').drawImage(v, 0, 0, cw, ch)` draws the whole video scaled to the canvas;
  no source (sx,sy,sw,sh) args. Callers: `scanFireShelfShot` (:8606, Shelf shutter — the F9
  path) and `scanFireCoverShot` (:8959, Book cover — MUST stay untouched). The desktop
  drop-zone (`scanShelfFromFile` :8552) uses `downscaleShelfPhoto` on a File (no video/frame) —
  out of scope, unchanged.
- **(b) frame element = `#scan-reticle`** (shell HTML :9093), CSS `.scan-reticle`
  (components.css:16716): `position:absolute; left:50%; top:46%; transform:translate(-50%,-50%);
  width:min(74vw,340px); height:min(50vh,300px)`. Measurable via `getBoundingClientRect()`.
  Stable across modes — never hidden/resized by JS or a mode class; only `.is-lock` nudges the
  corner brackets (`.scan-br`), not the reticle box (and lock-on only fires in Book decode, not
  the Shelf shutter). The `.reticle` at :9397 is a SEPARATE legacy class, not this element.
- **(c) `#scan-cam-video` is `object-fit:cover`** (components.css:16686) → the crop mapping must
  invert cover (scale = max axis ratio; centered overflow offsets).

Ruled design: crop to the reticle rect + 5%-of-frame overscan per edge, clamped to video bounds,
BEFORE the existing 1600px downscale; fallback = full-frame capture when the frame is unmeasurable.

## STAGE 1 — BUILD (views.js)

Three additions/edits (Shelf shot only; Book cover shot + drop-zone untouched):
- **`scanFrameToVideoRect(Vw,Vh,Dw,Dh,rx,ry,rw,rh)`** — PURE, no DOM. Inverts object-fit:cover
  (`s = max(Dw/Vw, Dh/Vh)`; centered overflow offsets `offX/offY`), maps the frame (display px)
  to a source rect (video px), grows it by a 5%-of-frame overscan per edge, clamps to
  `[0,Vw]×[0,Vh]`. Returns `{sx,sy,sw,sh}` or `null` (bad/degenerate inputs → caller fallback).
- **`scanShelfCropRect()`** — the DOM call-site: measures `#scan-cam-video` + `#scan-reticle`
  via `getBoundingClientRect()`, returns `scanFrameToVideoRect(...)` or `null` when either is
  unmeasurable (absent / display:none / zero-size → zero-size rect → null).
- **`scanCaptureBase64(crop)`** — optional crop: `drawImage(v, sx,sy,sw,sh, 0,0,cw,ch)` from the
  crop region (else full frame, byte-equivalent to the old whole-frame draw), THEN the existing
  ≤1600px downscale + JPEG q0.82. So with a crop, the full 1600px budget lands on in-frame content.
- **`scanFireShelfShot`**: `scanCaptureBase64(scanShelfCropRect())` — crop, `null` → full-frame
  fallback. **`scanFireCoverShot` (Book) still calls `scanCaptureBase64()` (no arg) → full frame,
  UNTOUCHED** (views.js:9009). Drop-zone `scanShelfFromFile` uses `downscaleShelfPhoto` (a File) —
  no video/frame, unchanged.

### FALLBACK (grep-proven, degraded-beats-broken)
`scanShelfCropRect` → `null` on 2 guards (video/reticle absent or `!v.videoWidth`; any zero-size
rect). `scanFrameToVideoRect` → `null` on 3 guards (non-positive inputs; `s<=0`; degenerate after
clamp). `scanCaptureBase64` line: `if (crop && crop.sw > 0 && crop.sh > 0)` else full frame. So a
missing/invalid frame → full-frame capture unchanged.

### TWO HAND-COMPUTED FIXTURE CHECKS (independent of the code, so the harness isn't self-licking)
**#1 landscape video / portrait display (cover crops WIDTH):** Vw2560 Vh1440, Dw390 Dh844,
frame rx51 ry238 rw288 rh300. s=max(390/2560,844/1440)=0.586111. offX=(2560·0.586111−390)/2=555.22,
offY=(1440·0.586111−844)/2=0. sx=(51+555.22)/0.586111=1034.3, sy=238/0.586111=406.1,
sw=288/0.586111=491.4, sh=300/0.586111=511.9. +5% overscan (24.6/25.6): sx→1009.7, sy→380.5,
sw→540.5, sh→563.0. No clamp. **Expected rounded {sx1010, sy380, sw541, sh563}.**
**#2 portrait video / square display (cover crops HEIGHT):** Vw1080 Vh1920, Dw390 Dh390,
frame rx51 ry45 rw288 rh300. s=max(390/1080,390/1920)=0.361111. offX=(1080·0.361111−390)/2=0,
offY=(1920·0.361111−390)/2=151.67. sx=51/0.361111=141.2, sy=(45+151.67)/0.361111=544.6,
sw=288/0.361111=797.5, sh=300/0.361111=830.8. +5% (39.9/41.5): sx→101.4, sy→503.1, sw→877.3,
sh→913.9. No clamp. **Expected rounded {sx101, sy503, sw877, sh914}.**

### FIXTURE HARNESS (rig pane, live `scanFrameToVideoRect`) — VERDICT **PASS** (0 fails)
| case | got | exp | ok |
|---|---|---|---|
| landscape-in-portrait (crop width) | {1010,380,541,563} | {1010,380,541,563} | ✓ (matches hand-calc #1) |
| portrait-in-square (crop height) | {101,503,877,914} | {101,503,877,914} | ✓ (matches hand-calc #2) |
| 1:1 centered (overscan only) | {390,390,220,220} | {390,390,220,220} | ✓ |
| corner clamp | {89,89,11,11} | {89,89,11,11} | ✓ |
| zero-frame → null (fallback) | null | null | ✓ |
| frame ≥ video → clamp full | {0,0,100,100} | {0,0,100,100} | ✓ |

### EFFECTIVE-RESOLUTION MATH (type case: 390×844 phone, FX-I 2560×1440 Shelf stream)
The frame maps to a 491×512 source region (491×512 core; 540×563 with overscan).
- **BEFORE F9:** full 2560×1440 → downscale 0.625 → 1600×900 sent; the framed shelf occupies only
  **~307×320 px** of that payload (the rest is the shelf above/below + margins).
- **AFTER F9:** crop 540×563 → longest side 563 < 1600 → NO downscale → sent at 540×563; the
  in-frame core is at its **native ~491×512 px.**
- ⇒ in-frame content **~307×320 → ~491×512** (≈1.6× linear, ≈2.6× area), AND out-of-frame rows are
  gone from the payload entirely. Payload SIZE also drops (540×563 JPEG < 1600×900 JPEG), still well
  under the endpoint's 7,500,000-char cap.

### GATES
| gate | result |
|---|---|
| parse-check views.js (cscript) | **PARSE OK** |
| ES3 forbidden tokens in added code | **0** |
| Book cover shot untouched (scanCaptureBase64() no-arg @:9009) | **PASS** |
| foundations md5 (lumen-amber 070679b0… / marks 772886c0…) | **unchanged** |
| boot smoke (rig, camera absent): surface+video+reticle mount; reticle rect measurable (340×300); scanShelfCropRect→null (fallback); scanCaptureBase64 both paths no-throw ('' guarded) | **PASS** |
| console error class vs v3.268 baseline | **IDENTICAL** (404s + camera-less NotFoundError; +1 rig ERR_TIMED_OUT resource timeout — not F9; F9 adds no network) |

## CACHE_VERSION
Single bump praxis-v3.268 → **praxis-v3.269** (sw.js:10), riding this one commit.

## COMMIT (LOCAL — NO push)
ONE commit through the hook NORMALLY (code + sw.js + checkpoint): `fix(scan F9) — crop Shelf
capture to frame (v3.269)`. Builder/sequence/BOARD DEFERRED to round close.

## HALT — NO PUSH. Preston's push word ships v3.269; felt round 4 is the round's next input.

## FELT CARD — SCAN round 4 (installed PWA + Safari, after push; fresh SW)
- [ ] **Frame promise** — one shot with the frame around ONE shelf row, other rows visibly
  above/below → the tray contains ONLY the framed row's books.
- [ ] **In-frame accuracy holds** — the confident reads inside the frame still land.
- [ ] **Partials cleaner** — fewer leading-garbage edge reads ("ND THE EDUCATION OF DESIRE S").
- [ ] **Spot-check** — Shelf still sharp (F6), non-books still absent (F8), Book decode +
  light-death still fine (FX-A/G), FX-H receipt still correct.
