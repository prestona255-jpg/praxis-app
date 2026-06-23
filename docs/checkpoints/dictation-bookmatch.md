# Dictation book-association — build lane (`dictation-bookmatch-lane`)

Base: `main` = `844f913`, live `sw.js` = `praxis-v3.140`. Worktree `../praxis-dictation-bookmatch`.
Recon: `docs/checkpoints/dictation-book-match-recon.md` (in main's working tree). Scope = all three fixes (a leading-clip + b author/fuzzy matching + c review-panel picker). Test shelf: **"Pedagogy of the Oppressed", "Empire of AI", "All About Love"** ("the Oppressed" is unique to Pedagogy).

Non-goals (untouched): entry pipeline (commitEntries/deleteEntry/F5 ownsEntry/segmentDoc→matchBook→commit flow); SCHEMA/migrate/normalizer; state.js & views.js core; yumi-brain titleToId/lens; transcribe-proxy/STT; TTS proxy; Web Speech/live-caption; new-book CREATION (picker searches existing library only); CACHE_VERSION until Stage 4.

---

## Stage 1 — leading-clip fix (committed local-only)

`js/import-capture.js` only.
- **`renderListening`** label seeded **`'Warming up…'`** (was `'Listening'`) — so the UI no longer invites speech before capture.
- **`recordAndTranscribe`**: removed the **synchronous `onStart`** after `rec.start()`; now **polls `rec.state`** every 40ms and fires `onStart` only once it is `'recording'` (or a ~600ms / 15-tick safety cap fires regardless, so the UI never wedges on "Warming up…"; clears early if `rec.state==='inactive'` from a stop). `onStart`'s handler still flips the label to **`'Listening'`** — now the genuine speak-now cue. Polling chosen over `rec.onstart` (iOS reliability).

**Static gates (PASS):** ES3 banned tokens **0**; scope = `import-capture.js`; diffstat **+16/−2** (localized); byte delta LF **+794** (60,512→61,306); **no F5/matcher function** in the diff (only `recordAndTranscribe` + `renderListening`); `CACHE_VERSION` untouched (`praxis-v3.140`); `main` untouched (`844f913`). Next: Stage 2 (author-aware + fuzzy matching).