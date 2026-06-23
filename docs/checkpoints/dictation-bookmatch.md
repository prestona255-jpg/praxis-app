# Dictation book-association — build lane (`dictation-bookmatch-lane`)

Base: `main` = `844f913`, live `sw.js` = `praxis-v3.140`. Worktree `../praxis-dictation-bookmatch`.
Recon: `docs/checkpoints/dictation-book-match-recon.md` (in main's working tree). Scope = all three fixes (a leading-clip + b author/fuzzy matching + c review-panel picker). Test shelf: **"Pedagogy of the Oppressed", "Empire of AI", "All About Love"** ("the Oppressed" is unique to Pedagogy).

Non-goals (untouched): entry pipeline (commitEntries/deleteEntry/F5 ownsEntry/segmentDoc→matchBook→commit flow); SCHEMA/migrate/normalizer; state.js & views.js core; yumi-brain titleToId/lens; transcribe-proxy/STT; TTS proxy; Web Speech/live-caption; new-book CREATION (picker searches existing library only); CACHE_VERSION until Stage 4.

---

## Stage 1 — leading-clip fix (committed local-only)

`js/import-capture.js` only.
- **`renderListening`** label seeded **`'Warming up…'`** (was `'Listening'`) — so the UI no longer invites speech before capture.
- **`recordAndTranscribe`**: removed the **synchronous `onStart`** after `rec.start()`; now **polls `rec.state`** every 40ms and fires `onStart` only once it is `'recording'` (or a ~600ms / 15-tick safety cap fires regardless, so the UI never wedges on "Warming up…"; clears early if `rec.state==='inactive'` from a stop). `onStart`'s handler still flips the label to **`'Listening'`** — now the genuine speak-now cue. Polling chosen over `rec.onstart` (iOS reliability).

**Static gates (PASS):** ES3 banned tokens **0**; scope = `import-capture.js`; diffstat **+16/−2** (localized); byte delta LF **+794** (60,512→61,306); **no F5/matcher function** in the diff (only `recordAndTranscribe` + `renderListening`); `CACHE_VERSION` untouched (`praxis-v3.140`); `main` untouched (`844f913`). Commit `bc5a9a2`. Next: Stage 2 (author-aware + fuzzy matching).

---

## Stage 2 — author-aware + fuzzy matching (committed local-only)

`js/import-capture.js` only. New shared helper `hasSharedToken(tokens, text)` (≥4-char whole-word overlap).
- **`matchBook` (auto-file) — two passes, conservative.** PASS 1 = TITLE, **byte-for-behavior unchanged** (exact wins; else unique bidirectional containment; ambiguous title → null). PASS 2 runs **only when no title matched** — AUTHOR: a **unique** author containment / shared-token match auto-files; **ambiguity (>1) → null → Inbox.** So it never auto-files when more than one book qualifies. Purely additive over the old title-only behavior (the only changed outcome is: title-miss + unique-author now files instead of Inbox).
- **`candidateBooks` (review chips) — generous.** Now matches **title OR author** containment, else a shared ≥4-char token in **either** title or author (was title-only). So `"Freire"` surfaces every Freire book. Cap unchanged (4); author still attached for display.
- Call sites unchanged: `commitEntries` (:288) + `runImport` (:516) still call `matchBook(item.bookGuess)` (single-arg signature preserved).

**Round-trip proof (cscript JScript ES3 — Node blocked, no network; mirrors the source over the 3-book shelf + a synthetic 2-Freire case) — 12/12 PASS:**
```
matchBook: 'Pedagogy of the Oppressed'->b1 (exact) | 'the Oppressed'->b1 (unique title) |
           'Freire'->b1 (unique AUTHOR, the reported case) | 'Empire'->b2 | 'hooks'->b3 |
           'Marx'->null (Inbox) | ''->null | 'Freire' w/ TWO Freire books -> null (Inbox, NO mis-file)
candidateBooks: 'Freire'->[b1,b4] (both Freire) | 'the Oppressed'->[b1] | 'love'->[b3] | ''->[]
RESULT: 12 pass, 0 fail
```

**Static gates:** ES3 banned tokens **0** (a backtick in a new comment was reworded to clear it); scope = `import-capture.js`; diffstat ~**+45/−23** (localized); byte delta LF **+1,473** (61,306→62,779); **no F5/commit-flow function** in the diff (`commitEntries`/`processDictation`/`undoDictation`/`ownsEntry`/`fileDictationToBook` untouched — only `matchBook`/`candidateBooks` + the new `hasSharedToken`); `CACHE_VERSION` untouched (`praxis-v3.140`); `main` untouched (`844f913`). Next: Stage 3 (review-panel picker/search).