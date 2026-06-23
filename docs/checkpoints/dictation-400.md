# Dictation 400 — fix lane · Stage 0 diagnosis (read-only)

**Date:** 2026-06-23 · **Lane:** `dictation-400-lane` (`../praxis-dictation-400`) off `main` `1d7fb67` · live `sw.js` = `praxis-v3.139`.
**Bug:** live v3.139 dictation never transcribes — the transcribe-proxy POST returns 400.

## Single precise mismatch (confirmed)

The data-URL prefix-strip regex **`/^data:[^;]*;base64,/`** does **not** tolerate a parameterized media type. `[^;]*` stops at the first `;`, so for `data:audio/webm;codecs=opus;base64,…` it then expects `;base64,` but meets `;codecs=opus;base64,` → **no match → prefix retained.**

Empirically demonstrated (`grep -E`):
```
FAILS ✗ (prefix RETAINED): data:audio/webm;codecs=opus;base64,QQQQ   <- Chrome/Firefox negotiated type
STRIPS ✓ :                 data:audio/webm;base64,QQQQ
STRIPS ✓ :                 data:audio/mp4;base64,QQQQ                 <- iOS Safari
```

`pickAudioMimeType` returns `audio/webm;codecs=opus` first ([import-capture.js:945-947]), and `rec.mimeType` keeps the codecs param → `blob.type = "audio/webm;codecs=opus"` → `FileReader.readAsDataURL` emits `data:audio/webm;codecs=opus;base64,…`. **So on Chrome/Firefox the bug always fires; iOS (`audio/mp4`, no param) would strip fine.** This matches "the env that fell back before" recording webm/opus.

## Trace (both sides retain the prefix → corrupt decode)

- **Client** `transcribeBlob` ([import-capture.js:955]): `var b64 = String(reader.result||'').replace(/^data:[^;]*;base64,/, '');` → regex fails → `b64` = the **full data URL**. `:956 if(!b64)` non-empty → POSTs `{audio: <full data URL>, mimeType}` ([:960]).
- **Proxy** ([transcribe-proxy.js:68-71]): `audio = body.audio; audio.replace(/^data:[^;]*;base64,/, '')` → **same regex, same failure** → `audio` stays the full data URL. `:72` `length===0`? No (non-empty) → the **"audio… required" 400 does NOT fire**. → `:105 Buffer.from(audio,'base64')` decodes the prefix-corrupted string (Node base64 is lenient — ignores `: ; ,` but folds the prefix's alphabet chars `data audio webm codecs opus base64 / =` into the bytes, misaligning the whole stream) → corrupt audio → **ElevenLabs 400** → proxy relays `400 {error:'stt-upstream-error'}` ([:126-133]).

**Precise note:** the observed body is most likely `stt-upstream-error` (relayed ElevenLabs 400), **not** the `"audio… required"` validation 400 — that guard only fires on an *empty* string, and the unstripped prefix keeps it non-empty. The prime-suspect *mechanism* (retained prefix corrupts the decode) is exactly right; only the specific 400 body differs.

## Secondary suspects — ruled out as the 400 cause

- **Empty (size-0) recording:** already guarded — `recordAndTranscribe.onstop` ([import-capture.js:1000]) `if (!blob.size) { onError('failed'); return; }` → never POSTs, goes to the textarea. Plus `transcribeBlob:956 if(!b64)`. So size-0 is **not** the 400. (Stage 1 will make its message honest, per the plan.)
- **JSON field-name mismatch:** none — client sends `{audio, mimeType}` ([:960]); proxy reads `body.audio` ([:68]) + `body.mimeType` ([:96]). **Match.**

## Fix (proposed — for Stage 1, on Preston's go)

**Side: CLIENT (smallest, client-only).** Replace the fragile regex at `import-capture.js:955` with a robust raw-base64 extraction that ignores mime parameters — take everything after the first comma (a data URL always has its data after the first `,`):
```
var url = String(reader.result || '');
var ci = url.indexOf(',');
var b64 = (ci > -1) ? url.substring(ci + 1) : url;   // RAW base64, params-agnostic
```
Now the client sends RAW base64 → the proxy's `Buffer.from` decodes clean audio.

**Optional (defense-in-depth, trivial):** harden the proxy's identical regex ([transcribe-proxy.js:70]) the same way (`/^data:[^,]*;base64,/` or indexOf-comma), so a stray data URL can never corrupt again. With the client fix the proxy strip is a no-op, but this prevents recurrence. → scope becomes `import-capture.js` (+ `transcribe-proxy.js` if Preston wants the proxy hardened too).

**Plus the empty-blob guard (Stage 1):** make the `blob.size === 0` path send an *honest* message → textarea (rather than the generic "couldn't transcribe").

## HALT

Stage 0 read-only complete; no code changed; `main` untouched (`1d7fb67`). Awaiting Preston's go on the fix (client-only vs client + proxy-harden), then Stage 1.

---

## Stage 1 — fix applied (committed local-only)

**Go:** client + proxy hardened (defense-in-depth). Params-agnostic raw-base64 extraction — everything after the first comma — at:
- `js/import-capture.js` `transcribeBlob` (`var ci = url.indexOf(','); var b64 = (ci > -1) ? url.substring(ci + 1) : url;`)
- `netlify/functions/transcribe-proxy.js` (`var ci = audio.indexOf(','); if (ci > -1) { audio = audio.substring(ci + 1); }`)

Plus the **empty-blob guard**: `recordAndTranscribe.onstop` emits `onError('empty')` (was `'failed'`); `startDictation.onError` handles `'empty'` → textarea with an honest message ("I didn't catch any audio — type your note here…"). Transport-only; the entry pipeline (segmentDoc→matchBook→commitEntries→renderDictated) is untouched.

**Round-trip proof (cscript JScript ES3 — Node blocked, no network):**
```
decoder sanity (decode(true b64)==orig): PASS
audio/webm;codecs=opus  OLD: prefix retained YES, OLD===b64 FALSE, round-trip FAIL (15B garbage 75ab5a..)   NEW: ===b64 TRUE, round-trip PASS (17B 1a45df.. == orig)
audio/mp4               OLD: ===b64 TRUE, round-trip PASS (no regression)                                    NEW: round-trip PASS
```
i.e. OLD pipeline fed `data:audio/webm;codecs=opus;base64,…` (not base64) to the decoder → 15-byte garbage → ElevenLabs 400; NEW pipeline delivers exactly the true base64 → clean 17-byte round-trip. mp4 already worked under OLD (no regression).

**Static gates:** ES3 banned tokens **0**; diffstat localized (import-capture **+13/−2**, proxy **+10**); byte deltas LF — import-capture **+594** (57,858→58,452), proxy **+158** (6,335→6,493); scope = the 2 code files; `CACHE_VERSION` untouched (`praxis-v3.139`); `main` untouched (`1d7fb67`). Next: Stage 2 (timeout→textarea + renderProcessing escape hatch).
