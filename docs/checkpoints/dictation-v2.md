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

Sizes are **LF blob bytes** (`git cat-file -s`) for apples-to-apples — comparing a `git show` LF blob to a CRLF working tree (`wc -c`) inflates the delta by ~1 byte/line, so those mixed numbers are not used.

| File | Before | After | Δ | vs recon estimate |
|---|---|---|---|---|
| `js/import-capture.js` | 51,537 | 56,873 | **+5,336** | recon said +2.5–4.5K — over by ~0.8K (comment-heavy helper block ~40 comment lines). *(An earlier +6,608 figure mixed an LF blob vs a CRLF working tree — corrected to the LF delta here.)* |
| `netlify/functions/transcribe-proxy.js` | — | 6,335 | **+6,335** | recon said +4.0–5.5K — over by ~0.8K (substantial header comment). |

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

### Stage 1 commit (local-only, not pushed)

`6dad5b6` — `Dictation v2 — Stage 1 (STT transport): gated transcribe-proxy (ElevenLabs Scribe) + dormant recordAndTranscribe client capture` (em-dash intact). 4 files, +446/−0. Lane HEAD `6dad5b6` ≠ origin/main `9493d3a`; nothing pushed.

---

## Stage 2 — SWAP THE DICTATION UI to record-and-transcribe

**Status:** built, static-verified, **adversarial-reviewed (3/3 PASS)**, **committed LOCAL-ONLY** on `dictation-v2-lane` (not pushed; `CACHE_VERSION` still `v3.138` — that is Stage 3). No app run, no account touched.

### What changed (5 JS swaps + 1 CSS rule, in the already-touched surfaces)

| Site | File:line | Change |
|---|---|---|
| renderEntry hero gate | `import-capture.js` ~404 | `window.VoiceInput && VoiceInput.isSupported()` → **`canRecord()`** |
| `startDictation` | `import-capture.js` ~1097 | `VoiceInput.listen({onTranscript,…})` → **`recordAndTranscribe({onStart,onTranscribing,onResult,onError})`**; `onResult` trims + (non-empty) → `processDictation(panel, text)`; `onTranscribing` → existing `renderProcessing` beat; denied/unsupported → `renderTypeNote`, empty/failed → `renderError`. Stop button wired to `session.stop()`. |
| `renderListening` | `import-capture.js` ~1073 | added a **`.ic-stop` tap-to-stop** button; returns it in the handle |
| section + mic-hero comments | `import-capture.js` 909, 1021 | reworded to describe the record-and-transcribe transport |
| `.ic-stop` | `assets/components.css` (after `.ic-transcript`) | new rule, **`var()` tokens only** (`--font-mono`/`--ink-3`/`--surface-2`/`--border`/`--ink`/`--ink-4`/`--radius-pill`) |

The transcribing beat reuses the existing `.ic-proc` UI (no new beat CSS). Auto-stop-on-silence is **not** implemented (the build prompt's "and/or" — explicit tap-to-stop is the robust choice; VAD is a possible later polish). `renderDictated`, the inline `.ic-guess` confirm, `fileDictationToBook`, `undoDictation`, `deleteEntry`, `commitEntries`, `processDictation` — all **untouched**.

### Static gates (all PASS)

| Gate | Result |
|---|---|
| Banned ES3 tokens (whole file) | **0** (`=>`/backtick/`.catch`/`const`/`let`/`class` → none) |
| `VoiceInput`/`SpeechRecognition` in dictation path | **0 code references** — only 2 descriptive comments remain (lines 921, 1095); the 3 live touchpoints are severed |
| Raw hex in new CSS | **0** (added `.ic-stop` lines use only `var()` tokens) |
| Diffstat (vs main, working tree) | localized: `import-capture.js` 44 ins / 22 del, `components.css` +9 — **no EOL/whole-file flip** |
| `CACHE_VERSION` | untouched (`praxis-v3.138`) |
| `main` | untouched (`9493d3a`, clean) |
| Scope | only `js/import-capture.js` + `assets/components.css` (+ this checkpoint) |

### Byte deltas (LF blob, `git cat-file -s`)

| File | Stage-1 (HEAD) | Stage-2 | Δ |
|---|---|---|---|
| `js/import-capture.js` | 56,873 | 57,496 | **+623** |
| `assets/components.css` | 338,474 | 339,010 | **+536** |

(import-capture.js cumulative vs main = **+5,959** LF.)

### Adversarial review — 3 independent lenses, **3/3 PASS, 0 findings**

- **Entry-mutation (state-pure):** PASS. None of `state`/`notebookEntries`/`commitEntries`/`lastImport`/`lastDictation`/`saveState`/`markNotebookDirty`/`deleteEntry`/`ownsEntry` appear inside the 5 transport functions. Sole entry-write route = `recordAndTranscribe.onResult → processDictation → commitEntries([item])` (the unchanged batched writer). `rec.state` is MediaRecorder lifecycle, not app state.
- **F5-airtight:** PASS. Reviewer ran `git diff 9493d3a` and **extracted + diffed each F5 function body** → `commitEntries`/`ownsEntry`/`processDictation`/`fileDictationToBook`/`undoDictation` all **IDENTICAL** to main. Undo deletes only `lastDictation.id` guarded by `ownsEntry` (scans `createdIds`); a pre-existing entry can never be touched.
- **Key-exposure (security):** PASS, all 5 claims. `ELEVENLABS_API_KEY` referenced once (`xi-api-key` outbound), in no response body, never logged; gate byte-structurally identical to siblings; audio never logged; **error responses generic — stricter than `elevenlabs-proxy`/`vision-proxy`** (no upstream-detail echo); client sends only the already-public `PRAXIS_CLIENT_KEY` gate header, body is just `{audio, mimeType}`.

### Residuals / carried to Stage 3

- **UI smoke is Stage-3 live only** (no app run this session): tap-mic→record→transcribe→file; non-shelf book → inline `.ic-guess` confirm → resolve; undo→restored; iOS Safari (audio/mp4); permission-denied→textarea fallback; upload/paste no-regression; CSS-bleed sweep on Shelf/Arcs/Notebook (`components.css` is global — the `.ic-stop` rule is `ic-`-scoped, low bleed risk, but verify).
- **Verification item #2 (`ELEVENLABS_API_KEY` STT scope)** still open for Preston (console).
- **Stage 3:** rebase on main, bump `CACHE_VERSION` `v3.138`→`v3.139` in the same commit as shell changes + the new function, **HALT** for Preston's exact em-dash ship subject + "commit and push," then guarded ff-merge + full live smoke.

### Stage 2 commit subject

`Dictation v2 — Stage 2 (UI swap): record-and-transcribe replaces Web Speech in the dictation path; tap-to-stop + transcribing beat; VoiceInput dependency severed`
