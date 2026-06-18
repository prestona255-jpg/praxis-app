# Books #6 — Stage 5: Camera barcode scan (lazy @zxing/library)

## Change (views.js only)
- New ES3 lazy loader `loadZxingLibrary(cb)` + `zxingReady()` + queue: injects `https://cdn.jsdelivr.net/npm/@zxing/library@0.20.0/umd/index.min.js` ONLY when the scanner opens on a browser lacking native BarcodeDetector. Idempotent, queues concurrent callers, `cb(false)` on failure. NOT in the core bundle / SW precache.
- `openBarcodeScanner`: `canCamera` = mediaDevices+getUserMedia. Camera path now `if (hasDetector && canCamera) {native}` `else if (canCamera) {zxing}`. The zxing branch builds `new ZXing.BrowserMultiFormatReader()` and decodes via `decodeFromConstraints({video:{facingMode:{ideal:'environment'}}}, video, cb)` (falls back to `decodeFromVideoDevice`); a decoded result → `lookupIsbn(result.getText())` → shared resolver → review.
- `zxingReader` ref + `stopCamera()` calls `zxingReader.reset()` (cancel/escape/after-decode cleanup). Cancel-during-load guard via `document.body.contains(video)`.
- Messaging: `sub` + fallback label now key off `canCamera` (live scan is available whenever a camera is). ISBN type-in fallback unchanged + always present.
- The lib (external) is exempt from ES3 rules; the loader + call sites are ES3. The external lib loads via `<script>` (the on-demand `@zxing/library` module is the only non-ES3 code; flagged for Stage 7).

## Self-verify (PASS)
- parse views.js: PASS (477041 chars). diffstat: 1 file +82/−7.
- grep: loadZxingLibrary 2, zxingReader 9, decodeFrom 4; **zxing in sw.js: 0** (not precached).

### Live preview (SW bypassed)
- at boot: `loadZxingLibrary` function, `zxingReady` function, `window.ZXing` **undefined**, `zxingLoadState` **idle** — lib does NOT load on the rest of the app ✓
- after `loadZxingLibrary(cb)`: ok=true, state=ready, `window.ZXing` object, `BrowserMultiFormatReader` function, `decodeFromConstraints` function, `decodeFromVideoDevice` function, `reset` function — API matches the decode wiring ✓
- idempotent: second call returns true synchronously, 1 script tag, no duplicate injection ✓
- console errors: none.

## Residual (iPhone eyes-on at ship)
- The actual camera decode (getUserMedia stream → zxing → ISBN) can only be confirmed on Preston's iPhone Safari (no camera + native BarcodeDetector present in the desktop-Chrome preview, so the zxing branch is not exercised there). The loader, reader construction, decode-method presence, and ISBN hand-off are all verified.

PASS → committed local → continue Stage 6.
