# Books #6 — Stage 7: Fidelity sweep + integration + ship prep

## Change
- **sw.js** — `CACHE_VERSION` `praxis-v3.119` → **`praxis-v3.120`** (single bump for the whole Books #6 batch).

## Live-vs-mockup divergence resolution (Stage 0 list)
| screen | Stage 0 divergence | resolved by |
|---|---|---|
| Shelf grid | broken cover → "?"/blank | S1 self-healing cover; token placeholder gradient |
| A Review | shown≠saved cover; cp-lab "no cover" | S1 persist coverCandidates; "cover pending" |
| A Review | junk auto-confirmed ("The Builder") | S2 scoring + ISBN-required strong gate |
| B Edition picker | (verify-only) | unchanged; renders |
| C Add & barcode | camera dead on iPhone Safari | S5 on-demand zxing decode + messaging |
| D Book detail | empty placeholder; no delete | S1 typographic placeholder; S6 Remove from shelf |
| E Cleanup | no hero, no wrong-cover, undercount | S3 hero + wrong-cover type + broken-cover registry |
| Mobile | bloom overlap; status-bar collision | S4 line hidden + gutter; safe-area-inset-top |

## Self-verify (PASS)
- **parse**: state.js PASS (94770), views.js PASS (483083); integrations.js by live boot (mergeRemoteBookDoc + scoreVolume exercised in preview).
- **ES3**: forbidden tokens (`=>`/const/let/.catch/.finally/backtick) in ADDED lines — integrations.js **0**, views.js **0**; parse harness proves state.js/views.js clean. zxing lib = exempt on-demand external module (loader + call sites are ES3). **FLAGGED**: the only non-ES3 code is the external `@zxing/library` UMD, loaded on demand, never in the core bundle / SW precache (grep zxing in sw.js = 0).
- **CSS tokens-only**: hardcoded hex in ADDED css = **0 real** (the 1 grep hit is a comment documenting the removed `#ecdcae/#cfb06a`). All new rules use var() / color-mix(var()) / env() / calc().
- **diff scoped**: components.css, integrations.js, state.js, views.js (+ sw.js bump) + docs only. No EOL flip (per-file insertions, not whole-file rewrites). 862 ins / 99 del across the batch.
- **CACHE_VERSION**: v3.120.

### Integration smoke (live preview, SW bypassed, logged-out shell + seeded fixtures)
- clean boot, **0 app console errors** across shelf/arcs/notebook/home/account navigation; every route renders (no crash logged-out).
- all Books surfaces' functions present (17/17): buildSelfHealingCover, makeReviewCover, renderShelfBook/Row, renderBookDetail, scanLibraryForCleanup, openLibraryCleanup, deleteBook, loadZxingLibrary, openBarcodeScanner, mergeRemoteBookDoc, resolveBook, scoreVolume, isBookPending/markBookPending, isBookDeletePending/markBookDeletePending.
- shelf: good→`img.shelf-book-cover`, null→`.shelf-book-cover-placeholder`, list-row renders; book-detail: remove btn + cover + existing add-to-arc all present (existing actions not broken).
- **P0 NOT regressed**: a pending ADD (markBookPending) survives a stale (empty) remote read via mergeRemoteBookDoc — kept in books + index + still pending.
- **pendingBookDeletes guard**: delete → scrubbed refs + survives stale remote (no resurrect) + cleared on confirmed removal (Stage 6 sim).

## Residuals → live-Charles ship gate (localhost sign-in broken; NEVER test prestona255)
1. Cover persistence round-trip (review-confirm matched-cover → reload → shelf shows same cover) — Charles.
2. Delete survives a TRUE reload + real Firestore removal without resurrecting — Charles.
3. Cleanup detection count == shelf blank-cards on a real library; hero/wrong-cover on real data — Charles.
4. iPhone Safari: camera barcode decode + mobile bloom/safe-area eyes-on — Preston's iPhone.

PASS → STOP at SHIP GATE. Awaiting Preston's "commit and push".
