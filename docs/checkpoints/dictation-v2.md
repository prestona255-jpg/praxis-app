# Dictation v2 — build checkpoint (`dictation-v2-lane`)

Base: `main` = `9493d3a`, live `sw.js` = `praxis-v3.138`. Worktree `../praxis-dictation-v2`.
Recon: [dictation-v2-recon.md](dictation-v2-recon.md) (Stage 0, decision gate PASSED — Preston chose `transcribe-proxy` → ElevenLabs Scribe).

---

## Stage 1 — STT TRANSPORT (server + client capture)

**Status:** built, static-verified, **committed LOCAL-ONLY** on `dictation-v2-lane` (not pushed; `CACHE_VERSION` unbumped — that is Stage 3). No app run, no account touched.

### Slices

| # | Slice | File | Change |
|---|---|---|---|
| 1 | Server STT proxy | **NEW** `netlify/functions/transcribe-proxy.js` | Gated (`x-praxis-key` vs `PRAXIS_CLIENT_KEY`, identical to the sibling proxies) Node function. Accepts JSON `{audio:<base64>, mimeType}` (base64-in-JSON mirrors vision-proxy → no inbound multipart), strips a stray `data:` prefix, decodes to `Buffer`, builds `multipart/form-data` (`file` + `model_id`) via Node-18 global `FormData`/`Blob`, POSTs to ElevenLabs Scribe with `xi-api-key: process.env.ELEVENLABS_API_KEY`, relays only `{transcript: data.text}`. Soft 413 over ~5.6 MB. Audio + key NEVER logged (only `response.status` + generic `err.message`). |
| 2 | Client capture | `js/import-capture.js` (+104 lines, additive) | New constant `TRANSCRIBE_PROXY_URL`; new ES3 helpers `canRecord()`, `pickAudioMimeType()`, `transcribeBlob()`, `recordAndTranscribe(cbs)` — `getUserMedia({audio})` → negotiated-mimeType `MediaRecorder` → single Blob on stop → release tracks (iOS) → `FileReader` base64 → POST to the gated proxy with `x-praxis-key` → hand transcript STRING to `cbs.onResult`. Permission-denied/unsupported → `cbs.onError('denied'|'unsupported'|'failed')`. **Dormant** (uncalled) until Stage 2 wires it. Touches no `state`/entries. |

### Model decision (verification item #1 resolved)

Confirmed against **live** ElevenLabs docs (`/docs/api-reference/speech-to-text/convert`): `POST /v1/speech-to-text`, `multipart/form-data` fields **`file`** + **`model_id`**, transcript in top-level **`text`**, auth **`xi-api-key`**. Both `scribe_v2` and `scribe_v1` are valid → pinned **`scribe_v2`** (swappable config constant `ELEVENLABS_STT_MODEL_ID`).

### Static gates (all PASS)

| Gate | Result |
|---|---|
| Scope | Only `netlify/functions/transcribe-proxy.js` (new) + `js/import-capture.js` (M) + the two checkpoint docs (untracked). Nothing else dirty. |
| Diffstat | `js/import-capture.js`: **104 insertions, 0 deletions** — purely additive, no EOL/whole-file flip. |
| Banned ES3 tokens | **0** in the 104 added lines AND **0 across the whole file** — full-file `=>` / backtick / `.catch` / whole-word `const`/`let`/`class` grep → no matches (a lone line-950 `.catch` in a comment was reworded to `(ES3)` to clear it inside this commit). |
| Key/audio never logged | Proxy `console.error` logs only `response.status` (line ~126) and generic `err.message` (line ~153); targeted leak-grep for `audio`/`ELEVENLABS_API_KEY`/`PRAXIS_CLIENT_KEY`/`providedKey`/`expectedKey` in any `console.*` → **none**. |
| `CACHE_VERSION` | Untouched — `sw.js` clean, still `praxis-v3.138` (bump is Stage 3). |
| `main` | Untouched — HEAD `9493d3a`, tracked tree clean. |
| No account | No app run, no Firestore/localStorage write. |

### Byte deltas (measured before+after)

| File | Before | After | Δ | vs recon estimate |
|---|---|---|---|---|
| `js/import-capture.js` | 51,537 | 58,145 | **+6,608** | recon said +2.5–4.5K — **over by ~2.1K**. Cause: comment-heavy helper block (~40 comment lines documenting transport/callbacks/iOS), AND the recon row conflated Stage-1 *add* with the Stage-2 VoiceInput *removal*. Additive only; no logic surprise. |
| `netlify/functions/transcribe-proxy.js` | — | 6,335 | **+6,335** | recon said +4.0–5.5K — **over by ~0.8K**. Cause: substantial header comment. |

Honest classification: both overages are comment density + a conservative-low recon estimate, not unexpected logic. Reported, not silently widened.

### Adversarial review — the prompt's invariants

- **New transport never reads/writes entries.** Helpers reference no `state`/`commitEntries`/`lastImport`/`lastDictation`/`saveState`/`markNotebookDirty`/`deleteEntry`/`ownsEntry`/`processDictation`/`notebookEntries`. (Only `rec.state` appears — that is `MediaRecorder.state`, the recorder lifecycle, not app state.) The transcript exits via `cbs.onResult(text)`; the Stage-2 caller passes it to the unchanged `processDictation`. **PASS.**
- **Commit/undo F5-airtight + unchanged.** None of `commitEntries`/`processDictation`/`undoDictation`/`ownsEntry`/`fileDictationToBook`/`startDictation`/`VoiceInput.*` appear in the diff → that path is **byte-identical to main**. The dormant helpers can't affect it. **PASS.**
- **Key never exposed.** `ELEVENLABS_API_KEY` only in the server function via `process.env`, sent upstream as `xi-api-key`, never returned or logged. Client sends only the existing `PRAXIS_CLIENT_KEY` gate header (already in the bundle, used by every proxy call). **PASS.**

### Residuals / carried to later stages

- **Server unit-check (proxy returns `{transcript}` for sample audio):** cannot run locally (Node blocked, worktree undeployable) — deferred to the Stage 3 **live** smoke, per CLAUDE.md (promise/Node files verify on the live deploy, not the harness). The proxy parse is not ES3-harness-eligible.
- **Verification item #2 — `ELEVENLABS_API_KEY` STT scope:** still open for Preston (console check: full-access key, or a restricted key needing the Speech-to-Text scope). Does not block Stage 1 code; surfaces only at live smoke if the key is scoped without STT.
- **Node-18 globals (`FormData`/`Blob`):** assumed present (Netlify default; sibling proxies already use global `fetch`/`Buffer`); confirmed at first live deploy.
- **Stage 2 (next):** wire `recordAndTranscribe` into `startDictation` + flip the `:404` hero gate to `canRecord()`, add the recording/tap-to-stop/"transcribing" UI states (`ic-` CSS), and **remove the dictation path's `VoiceInput`/`SpeechRecognition` dependency**. Then the full adversarial review + CSS-bleed regression sweep.

### Proposed Stage 1 commit subject (NOT committed — awaiting go-ahead)

`Dictation v2 — Stage 1 (STT transport): gated transcribe-proxy (ElevenLabs Scribe) + dormant recordAndTranscribe client capture`
