# SCAN — FIX LOOP 1 (field felt findings F1–F5) · Opus 4.8

Round STAYS OPEN. Six targeted fixes off Preston's real-device felt pass (iPhone
Safari). Commit-per-slice, verify-per-slice, ONE cache bump at end (v3.265→**v3.266**),
NO push (Preston's word). The rig cannot reproduce camera behavior — the camera fixes
are argued from source with evidence; Preston re-verifies on device (felt pass round 2).

Ground: HEAD f10f4ed (v3.265 live) → 6 local commits `119442e..<FX-F>`. Foundations
byte-locked (md5 unchanged). Per-slice discipline: parse (cscript) + ES3 grep + rig
verify; FX-A..FX-E committed `--no-verify` (sw.js bump deferred to the single loop-end
bump per the directive; each dry-run confirmed the ONLY hook block was the deferred
sw.js), FX-F carries the v3.266 bump (hook-clean).

## Commits
| slice | commit | files | what |
|---|---|---|---|
| FX-A ⭐ | `119442e` | views.js | bulletproof camera teardown |
| FX-B | `67d35dc` | views.js | decode plausibility gate |
| FX-C | `583a311` | views.js | not-found demotes Add |
| FX-D | `700f155` | views.js | legible card text (ground flip) |
| FX-E | `f32f1f9` | views.js, components.css | suppress Bloom on #scan |
| FX-F | (this) | views.js, components.css, sw.js | silence the filler line + v3.266 |

## FX-A ⭐ (F2, privacy) — THE STREAM SURVIVES LEAVING → fixed
Field: the hardware camera light stayed lit after a normal navigation away from #scan.
Source hunt — THREE possible live-track owners: (1) our getUserMedia stream `scanStream`
(views.js:8053 scanStartStream); (2) zxing's `BrowserMultiFormatReader`, which on iOS
Safari opens its OWN stream + attaches it to the video element, released by `reset()`
(views.js:8221 decode; :8232 scanStopBookDecode reset); (3) any track left on a `<video>`
after the DOM swaps.
- `scanStopStream` (views.js:8045) now tears down ALL THREE idempotently: stops every
  registered stream (`scanCamStreams`) + `scanZxingReader.reset()` + a belt-and-suspenders
  sweep of EVERY document `<video>` (stops srcObject tracks; a src-based content video has
  no srcObject → untouched). `scanRegisterStream` tracks our stream + (best-effort, +500ms)
  zxing's.
- Fires on EVERY exit: renderRoute cleanup (views.js:450) · back chevron scanLeave (:8206)
  · visibilitychange hidden (:8874) · pagehide (:8887) · **NEW** hashchange-away
  belt-and-suspenders (:8890).
- **Rig-proven** (streams cannot be real without a camera, so simulated): all 3 owners'
  tracks stopped + zxing reset + refs nulled + video srcObject nulled; end-to-end on
  nav-away (#scan→#arcs) and the back chevron (#scan→#books). **DEVICE-OWED:** the real
  hardware-indicator death — Preston's phone (this is the SCE-1 law; it failed once in the field).

## FX-B (F1) — DECODE PLAUSIBILITY GATE → fixed
Field: a sun/pen-marked barcode decoded as `3127227818366` → a garbage not-found card.
- `scanIsBookBarcode` accepts ONLY a Bookland EAN-13 (978/979 prefix + valid check digit,
  `scanEan13Ok`) or a valid ISBN-10 (`scanIsbn10Ok`); `scanOnBarcode` then requires the
  SAME value read twice consecutively (`scanLastDecode`). Non-qualifying decodes are ignored
  SILENTLY (no card, no error). Buffer resets when decode (re)starts.
- Unit test **12/12** (fail-able): field specimen `3127227818366` REJECT · `9780394739540`
  PASS · bad-check/979/ISBN-10/ISBN-10-X/grocery/short all correct. Live module: garbage
  ignored silently; valid code needs two reads before the verdict fires.

## FX-C (F1 rider) — NOT-FOUND DEMOTES ADD → fixed
On a not-found (no title): primary = **Keep scanning** (gold); "Add to shelf" demotes to
a quiet **Add manually** (no gold) → #books + `openShelfEditor(isbn)` (new optional
prefill; visible `#shelf-editor-host`), ISBN prefilled. A real hit keeps the gold Add/Open.
Rig: not-found → Add "Add manually" quiet + not-gold, dismiss "Keep scanning" gold, kind
`manual`; click → #books + editor opens ISBN-prefilled (`9781234567897`); found → gold retained.

## FX-D (F3) — TITLE LEGIBILITY → fixed
Root cause: `#scan` was in `umberGroundDark`, so the LIGHT cards' `--ink` family resolved
to LIGHT ink on their light fill (ghost). The camera is dark via explicit `--scan-*`
tokens, so the dark ground bought the cards only faint text. Fix: dropped `#scan` from
`umberGroundDark` (bright ground). **Computed-style parity (L12):** verdict title
`rgb(240,235,223)` lum 235 (ghost) → `rgb(36,23,16)` lum 26 on a lum-250 card (~15:1);
review + primer headings lum 26; camera chrome STILL `rgba(246,239,224,.62)` lum 239;
camera bg still `rgb(12,10,7)`.

## FX-E (F4) — BLOOM COLLISION → fixed
The Yumi Bloom clipped "Keep scanning". `renderScan` adds `body.scan-active` (CSS
`body.scan-active .yumi-bloom{display:none}`); the router removes it on every route change
(renderScan re-adds for a #scan re-entry, same synchronous frame → no flicker). Rig: bloom
`flex` on #home → `none` on #scan (`body.scan-active`) → `flex` after leaving.

## FX-F (F5) — SILENCE THE FILLER LINE → fixed
Deleted "Identified — no context on your shelf." (element + CSS + the show-branch): SC4
ruled silence — the context line shows ONLY on a real local signal, else NOTHING. Rig: the
3 real variants still render (author-match "Second Freire on your shelf" · owned "On your
shelf"→Open · silent → context hidden, no filler text in the card); `#scan-vd-silent` gone.

## HALT — felt pass round 2 (Preston, on device, after deploy)
Re-verify on the installed PWA + Safari, incl. the still-untested items: **the camera-light
death re-test that FX-A must now win** · Shelf-mode real shot · walker · Shelve→Undo forced-
timing race (prestonpraxistest) · Book barcode on a marked/glossy code (FX-B) · not-found
demotion feel (FX-C) · card legibility (FX-D) · no Bloom over the card (FX-E) · no filler
line (FX-F). CACHE_VERSION → **v3.266**. Round stays OPEN; push is Preston's word.
NON-GOALS honored: no endpoint changes, no manifest/PWA-install work, no redesign beyond the named fixes.
