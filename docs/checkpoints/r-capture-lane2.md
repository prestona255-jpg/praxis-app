# R-CAPTURE — Lane 2 checkpoint (mode integrations)

## Voice mode  ✅ COMPLETE (committed local)

The sheet's voice mode reuses the SHIPPED dictation transport directly (recon §5:
the machinery is in `import-capture.js`, NOT `voice-input.js`). `canRecord` +
`recordAndTranscribe` are exposed on `window.ImportCapture`; `initCaptureDoor` wires
`capMic` to them. The transcript writes into the SHARED field the instant it exists
(`onResult` → `capField`, draft-persisted via `capScheduleDraftSave`), then is filed
via the sheet like any note — NOT through `processDictation`'s own commit path. Loss
window = mic-tap → `rec.onstop` only, bounded + disclosed in the hero copy; the
session is stopped on mode-change and on close (its transcript still lands — RAW
joins the corpus).

Files: `js/import-capture.js` (expose `canRecord` + `recordAndTranscribe`),
`js/views.js` (`capMicSession` + the mic handler; session-stop in `setMode`/`capClose`).

Parse PASS (views + import-capture). Live-verify (localhost rig, stubbed transport —
real mic + transcribe-proxy round-trip needs a device + live proxy + auth, a Preston
live-smoke item):

| Check | Evidence |
|---|---|
| Transport exposed | `ImportCapture.recordAndTranscribe` + `canRecord` present; `canRecord()` boolean |
| Voice mode opens | `openCaptureDoor({mode:'voice'})` → `cap-mode-voice`, mic hero shown |
| Transcript → shared field | stub `onResult('…')` → text appended to `capField`, autogrow, draft-scheduled |
| Fail-gracefully (CA-2) | unsupported/denied/failed/empty each set a clear hero message, never a crash |
| No console errors | clean |

Paste / upload: shipped in Lane 1a (real `FileReader`, no network). Photo / OCR:
inert labeled SEAT (§7 — SCAN owns the camera; the mode-set socket is ours).

Residual (Preston live-smoke): a real dictation round-trip (mic permission →
MediaRecorder → transcribe-proxy → transcript in the field → file it) on a signed-in
device — the rig cannot exercise the proxy.
