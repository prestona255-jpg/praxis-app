# Dictation v2 — Stage 0 RECON (read-only · HALT for Preston)

**Date:** 2026-06-23 · **Lane:** `dictation-v2-lane` (worktree `../praxis-dictation-v2`)
**Base:** `main` = `9493d3a`, live `sw.js` = `praxis-v3.138` (read-only, confirmed)
**Status:** recon complete, **zero code changed**. Decision gate below — STOP and wait for Preston.

## Ground truth (personally verified)

| Fact | Value | Evidence |
|---|---|---|
| `main` HEAD | `9493d3a` | `git rev-parse HEAD` |
| `main` working tree (tracked) | clean | `git status --porcelain --untracked-files=no` → empty |
| v2 worktree | `../praxis-dictation-v2` @ `9493d3a`, branch `dictation-v2-lane` | `git worktree add` |
| `import-dictation-lane` | **does not exist** (already cleaned; manual lanes live at `../praxis-*`) | `git worktree list` / `git branch -a` |
| live SW version | `var CACHE_VERSION = 'praxis-v3.138';` | `sw.js:10` |
| Netlify functions | `claude-proxy.js`, `google-books-proxy.js`, `vision-proxy.js`, `elevenlabs-proxy.js` | `netlify/functions/` |
| `netlify.toml` | **none** → Netlify defaults (auto functions dir, ~6 MB sync request cap) | glob: no file |

How v1 fell back in Preston's environment: dictation v1 gates on `window.VoiceInput && VoiceInput.isSupported()` (Web Speech). Where that is false, the user silently gets the textarea hero — never a mic. MediaRecorder + `getUserMedia` are far more broadly supported (see Q4), so swapping the transport is the fix.

---

## Q1 — `elevenlabs-proxy.js`: TTS or STT?

**It is TTS** (text → audio), not STT. `netlify/functions/elevenlabs-proxy.js`:

- **Request:** `POST`, JSON body `{ text }` (`elevenlabs-proxy.js:56-57`).
- **Upstream:** `POST https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}?output_format=mp3_44100_128`, model `eleven_flash_v2_5` (`:69-84`).
- **Auth (upstream):** header `xi-api-key: process.env.ELEVENLABS_API_KEY` (`:79`). → **The ElevenLabs API key IS in Netlify env** (`ELEVENLABS_API_KEY`, set during Alive-Yumi P2). STT can reuse it with **no new credential**.
- **Response:** binary `audio/mpeg`, base64 body + `isBase64Encoded: true` (`:102-113`); upstream JSON errors relayed as JSON (`:88-98`).
- **`x-praxis-key` gate:** `:40-53` — when `process.env.PRAXIS_CLIENT_KEY` is set, every POST must carry a matching `x-praxis-key` header (case-folded to `X-Praxis-Key`), else `401`; skipped when the env var is unset. **Byte-identical** to the gate in `claude-proxy.js:18-35` and `vision-proxy.js:18-35` — this is the canonical, reusable gate block.

**Conclusion:** `elevenlabs-proxy.js` is TTS-only and must NOT be overloaded for STT. But its key (`ELEVENLABS_API_KEY`) and gate are directly reusable by a sibling function.

## Q2 — Any existing speech-to-text path? → No. Cleanest add.

**No STT path exists** anywhere in the proxies or client. The three upstream services wired today are: Anthropic Messages (`claude-proxy.js`, `vision-proxy.js`), Google Books (`google-books-proxy.js`), ElevenLabs **TTS** (`elevenlabs-proxy.js`). Client proxy-callers all use the same gate header (`x-praxis-key: PRAXIS_CLIENT_KEY`).

**Cleanest add (recommended): a new gated `netlify/functions/transcribe-proxy.js`** that reuses `ELEVENLABS_API_KEY` + the `PRAXIS_CLIENT_KEY` gate and calls **ElevenLabs Scribe** (`POST https://api.elevenlabs.io/v1/speech-to-text`). Per web recon:
- Scribe exists; same account-wide **`xi-api-key`** header → the **same key works for both TTS and STT** (caveat: if `ELEVENLABS_API_KEY` is a *restricted* key rather than full-access, the Speech-to-Text scope must be enabled on it — a console check for Preston).
- **Request:** `multipart/form-data` with `file` (the audio blob) + `model_id`. **Response:** JSON with top-level **`text`** = the transcript.
- **Accepted formats include both `audio/webm`(opus) and `audio/mp4`(aac)** directly — no transcoding; covers Chrome/Firefox AND iOS Safari (see Q4).
- Limits (multi-GB file, 10 h) dwarf a short voice note; the binding limit is Netlify's ~6 MB request, and a few-second note base64s to well under 1 MB.
- **⚠ Model id to verify at build:** recon (changelog `elevenlabs.io/docs/changelog/2026/6/8`) reports **`scribe_v2`** is current and **`scribe_v1` is deprecated/removed 2026-07-09** (~2 weeks out). This date is past my Jan-2026 knowledge cutoff, so it is a **build-time verification item**: pin `model_id` as a swappable config constant (like `ELEVENLABS_MODEL_ID` in the TTS proxy) and confirm the exact string against live docs before Stage 1 PASS. A wrong `model_id` 4xxs the proxy.

**Fallback service (documented only):** OpenAI Whisper (`POST /v1/audio/transcriptions`, `Authorization: Bearer`, `model=whisper-1`, identical multipart `file`+`text` shape, 25 MB cap). Needs a **second vendor key** (new Netlify env var), so adopt only if ElevenLabs STT proves unreliable. Near drop-in at the code level if ever needed.

## Q3 — Current dictation code · downstream reusable as-is? → YES.

All in `js/import-capture.js` (1169 lines; dictation is "Stage 4"). The capture transport is fully decoupled from the pipeline — **only the transport swaps.**

| Anchor | Line | Role |
|---|---|---|
| `renderEntry` hero gate | **404** | `if (window.VoiceInput && VoiceInput.isSupported())` → `buildMicHero` else `buildTypeNoteHero`. **Sever-site #1.** |
| `buildMicHero(panel)` | 918 | `.ic-mic-hero` { `button.ic-mic` (MIC_SVG, click→`startDictation`), `.ic-mic-label` "Talk to Yumi", `.ic-mic-hint` }. |
| `startDictation(panel)` | **988** | guard `VoiceInput.isSupported()` (**989, sever-site #2**) → `renderListening` → `VoiceInput.listen({...})` (**991, sever-site #3**); `onTranscript(text)` → `processDictation(panel, text)`. |
| `renderListening(panel)` | 969 | listening screen: `.ic-listen` > `.ic-bars` (5 equalizer bars) + `.ic-listen-state` + `.ic-transcript`. **Reusable** (add tap-to-stop). |
| **`processDictation(panel, transcript)`** | **1014** | **THE single seam.** `segmentDoc(transcript).then(...)` → `segs[0]` item (or own-note fallback `{text:transcript,type:'note',…}` when empty, `:1022`) → `commitEntries([item])` (`:1024`) → sets `lastDictation`/`lastImport` → `renderDictated`. |
| `renderDictated(panel)` | 1041 | reads the ONE created entry LIVE; "Filed as <register> to <book>" or inline `.ic-guess` confirm (`:1075-1096`); Done / Undo / +Another. |
| `fileDictationToBook` | 1115 | inline re-file in place, guarded by `ownsEntry`. |
| `undoDictation` | 1130 | deletes ONLY `lastDictation.id`, guarded by `ownsEntry` + `deleteEntry`. |
| `segmentDoc` / `matchBook` / `commitEntries` | 127 / 178 / 237 | the shared engine (also `window.ImportCapture` public API, `:1157-1159`). Pure on a string; no transport dependency. |
| textarea fallback composer | 933 (`buildNoteComposer`) / 951 (`buildTypeNoteHero`) / 959 (`renderTypeNote`) | "Hand to Yumi" routes to `processDictation` (`:943`) — the **identical seam** as the mic path. |

**Downstream reusable: TRUE.** A transcript STRING enters the pipeline at exactly one place — `processDictation(panel, str)` (`:1014`), today fed by `VoiceInput.onTranscript` (`:996`) and the textarea click (`:943`). A new transport need only **produce a string and call `processDictation(panel, str)`**; `segmentDoc → matchBook → commitEntries → renderDictated` change **zero** bytes.

**F5-safety (must stay airtight):** the dictated note is its own 1-item import — `lastImport.createdIds = [id]` (`:1028`). `ownsEntry(id)` (`:740`, sole guard, scans `createdIds`) gates `fileDictationToBook` (`:1116`) and `undoDictation` (`:1132`); `commitEntries` is additive + dedupes, never rewriting an existing entry. **The new transport must touch `state`/entries NOT AT ALL** — `recordAndTranscribe` returns a string and stops; `processDictation` stays the sole mutator. The invariant is preserved by construction.

**`VoiceInput` / `SpeechRecognition` dependency to sever (the entire surface):**
- Live code: `:404` (hero detect), `:989` (startDictation guard), `:991` (`VoiceInput.listen`). **That's it — 3 live touchpoints.**
- There is **no** raw `SpeechRecognition`/`webkitSpeechRecognition` in this file: all 4 `SpeechRecognition` grep hits are comments (`:402, 908, 917, 987`); recognition is wholly behind `window.VoiceInput` (in `voice-input.js`).
- `voice-input.js` itself **stays** (Yumi/other surfaces may use it) — v2 only removes the *dictation path's* dependency.

**Grep counts (`js/import-capture.js`):** `VoiceInput` = 5 (3 code + 2 comment); `SpeechRecognition` = 4 (all comment); `processDictation` = 3 (def + 2 callers); `renderDictated` = 4; `segmentDoc` = 10; `matchBook` = 6; `commitEntries` = 8; `ic-guess` = 8 (3 bulk + 3 dictation + 2 container). Confirms the swap is surgical.

## Q4 — `MediaRecorder` / `getUserMedia` support + mimeType

- **`getUserMedia({audio:true})`**: Baseline widely-available since ~Sept 2017 (Chrome 53+, Firefox 36+, Safari 11+, iOS Safari 11+). **HARD secure-context requirement** — only exposed over HTTPS/localhost; on plain HTTP `navigator.mediaDevices` is `undefined` and the property access *throws* before any prompt. Production (`praxis-reading.netlify.app`) is HTTPS ✓. **Feature-detect before calling:** `if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) → textarea fallback`.
- **`MediaRecorder`**: Baseline since ~Apr 2021, gated by Safari. Chrome 49, Firefox 29, Safari desktop 14.1, **iOS Safari 14.5** (the real floor — on by default). Safe on all current iPhones; still feature-detect `window.MediaRecorder`.
- **mimeType (no single cross-browser container):** Chrome/Firefox emit **`audio/webm;codecs=opus`**; iOS/desktop Safari emit **`audio/mp4`** (AAC) and return `false` for every `audio/webm` string. **Negotiate** with `MediaRecorder.isTypeSupported` in preference order `['audio/webm;codecs=opus','audio/webm','audio/mp4']`; pass the winner as `{mimeType}`; if none match, construct `new MediaRecorder(stream)` and read `recorder.mimeType`/first blob `.type` afterward. **The proxy must accept both** webm/opus and mp4/aac — derive the filename/content-type from `blob.type`, don't hardcode. ElevenLabs Scribe accepts both directly (Q2).
- ES3 negotiation helper (var/function only) is ready to lift from recon.

## Q5 — Mic-permission flow + where the textarea fallback stays

- `getUserMedia` returns a Promise; first audio call shows the browser mic prompt. Handle rejections by `error.name` in a two-arg `.then(onStream, onErr)` (no `.catch` — ES3 client rule):
  - `NotAllowedError` (denied / Permissions-Policy; older WebKit `PermissionDeniedError`/`SecurityError`), `NotFoundError` (no mic), `NotReadableError` (hardware busy), `OverconstrainedError`, `AbortError`/`SecurityError` — **all funnel to the textarea fallback.**
  - Unsupported environment (`navigator.mediaDevices`/`window.MediaRecorder` undefined) is caught by the pre-call feature-detect → fallback.
- **iOS specifics:** audio/mp4 only; **user-gesture required** — keep `getUserMedia` + `recorder.start()` inside the tap handler; **no timeslice** — `start()` then one `dataavailable`/single Blob on `stop()` (chunked mp4 on iOS is fragmented); after `stop()` release tracks (`stream.getTracks() … track.stop()`) to clear the iOS recording indicator.
- **Fallback placement (unchanged from v1):** keep the textarea hero exactly where it is — `renderEntry:404` (now gated on `canRecord()` instead of `VoiceInput.isSupported()`), and `renderTypeNote(panel, msg)` for the runtime permission-denied/unsupported path inside `startDictation`. Net effect: the "Voice isn't available here" path becomes **rare** (only no-`getUserMedia`/denied), not the default.

---

## STT DECISION (for the gate)

**ADD a new gated `netlify/functions/transcribe-proxy.js`** (do not overload the TTS `elevenlabs-proxy.js`), reusing `ELEVENLABS_API_KEY` + the `PRAXIS_CLIENT_KEY` gate, calling **ElevenLabs Scribe** (`POST /v1/speech-to-text`, `model_id` pinned as a swappable constant — `scribe_v2` per recon, **verify string at build**). Zero new credentials, one vendor, mirrors the existing proxy style.

**Proposed transport (Stage 1):** client `recordAndTranscribe()` (ES3) → `getUserMedia` → `MediaRecorder` (negotiated mimeType) → single Blob on stop → `FileReader.readAsDataURL` → strip `data:` prefix → `POST {audio:<base64>, mimeType:<blob.type>}` to `/.netlify/functions/transcribe-proxy` with `x-praxis-key: PRAXIS_CLIENT_KEY` (the established header, already used at `import-capture.js:141`). Server decodes base64 → `Buffer` → builds `multipart/form-data` (`file` + `model_id`) via Node 18 global `FormData`/`Blob` (the runtime already uses global `fetch`/`Buffer`/`await`) → ElevenLabs → relays `{transcript: data.text}` or a JSON error. **base64-in-JSON inbound** mirrors `vision-proxy.js` (no multipart parsing on the inbound side; the audio + key never logged).

## Stage-1 byte estimates (measured before+after at build; ranges here)

| File | Change | Est. Δ bytes |
|---|---|---|
| **NEW** `netlify/functions/transcribe-proxy.js` | full function (CORS+gate ~50 lines reused verbatim + base64 decode/validate + multipart build + Scribe fetch + relay) | **+4,000 … +5,500** (~120–160 lines; cf. elevenlabs-proxy 123 lines/~4.0 KB) |
| `js/import-capture.js` | + `recordAndTranscribe()` + `pickAudioMimeType()` + `canRecord()`; rewrite `startDictation` body (− the `VoiceInput.listen` block ~−0.7 KB); flip `:404` gate; reuse `processDictation`/`renderDictated`/`renderTypeNote` unchanged | **net +2,500 … +4,500** |
| `css/components.css` (Stage 2) | `ic-`-prefixed recording / tap-to-stop / "transcribing" states; much reused from `.ic-listen`/`.ic-bars`/`.ic-proc` | **+800 … +2,500** (could be ~0 if fully reused) |
| `theme.css` | likely 0 new tokens (reuse existing); 0–2 if a new accent needed | **0 … small** |
| `sw.js` (Stage 3) | `CACHE_VERSION` `praxis-v3.138` → `praxis-v3.139` (one line, ship commit) | **~0** |

Stage 1 (this gate's scope = server + client capture) ≈ **+6.5 … +10 KB**. No `state`/`SCHEMA_VERSION`/`migrate()` change; no `CACHE_VERSION` bump until Stage 3.

## Build-time verification items (carried into Stage 1)

1. **Confirm the exact Scribe `model_id`** against live ElevenLabs docs (`scribe_v2` vs `scribe_v1`) — pin as a config constant. *(past my Jan-2026 cutoff; sourced from recon changelog.)*
2. **Confirm `ELEVENLABS_API_KEY` has STT scope** if it's a restricted key (console check — Preston). If full-access, no action.
3. Netlify Node runtime exposes global `FormData`/`Blob` (Node 18+) — already implied by `elevenlabs-proxy.js`'s global `fetch`/`Buffer`; confirm at first deploy via the server-side unit check.

---

## ⛔ HALT — decision gate (waiting on Preston)

Recon answers all 5 questions; **zero code changed**; `main` untouched and clean; worktree `dictation-v2-lane` created off `9493d3a`.

**Question:** Go with **adding `transcribe-proxy.js`** (gated, reusing `ELEVENLABS_API_KEY` + ElevenLabs Scribe) as scoped above — or reuse a different service/endpoint? **Any blocker** (notably: is `ELEVENLABS_API_KEY` full-access or a restricted key without STT scope)? On your go-ahead I proceed to **Stage 1 — STT transport (server + client capture)**.
