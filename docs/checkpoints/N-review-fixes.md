# Notebook epic — adversarial review + fixes (pre-gate)

A 6-dimension adversarial review ran over the full epic diff (`0d5d4f8..HEAD`) before the
acceptance gate. **Clean:** ES3, F5 (privacy), F4 (consent mirror), NON-GOALs. **Two real blockers
found + fixed** (cross-stage regressions per-stage checks missed):

## Blocker A — logged-out crash (`renderNotebook`)
The N1 rewrite dropped the old `user &&` guard, so the entry loop + `buildNotebookTabModel` read
`user.uid` for a signed-out user → TypeError (the notebook page crashed). My live proofs always
seeded a user, so it never surfaced.
**Fix (views.js):** after the header/hosts, `if (!user) { <sign-in note>; return; }` — the spread is
per-user and never runs with a null user.
**Verified live:** signed-out render `crashed:false`, shows "Sign in to open your notebook.", spread
not rendered; signed-in render unregressed (tabs/counts correct).

## Blocker B — invisible-entry edge (`filed` backfill)
The flat `filed=true` backfill made a **non-journal note with no book** (`filed:true` + empty/absent
`bookIds`) match NO tab — not journal, not Inbox, not a book bank → invisible. Real for any bookless
marginalia/question or a `bookIds:undefined` legacy entry.
**Fix (state.js migrate + integrations.js merge normalizer):** book-aware backfill —
`filed = (register==='journal') ? true : !!(bookIds && bookIds.length>0)`. Journal stays placed
(routes by register); a bookless non-journal note → `filed:false` → **Inbox (visible)**. Strictly
more correct than the Foundation flat-true, and `undefined`-safe. **isPrivate still untouched (F5).**
**Verified:** the migrate harness now asserts `m4` (empty bookIds) and `m5` (no bookIds field) →
`filed:false`; journal → `true`; m1/m2 (with book) → `true`; F5 intact; idempotent.

## Gates (post-fix)
- cscript: parse `state.js` PASS (84082) · parse `views.js` PASS (415246) · migrate harness ALL PASS
  · routing harness ALL PASS.
- ES3 clean on all fix lines; no `isPrivate` assignment in the fix diff (F5).
- numstat: `state.js +6/−1`, `integrations.js +7/−4`, `views.js +11/−0`. Clean tree.

This supersedes the Foundation checkpoint's "filed backfill = TRUE for all" deviation note: the
shipped backfill is **book-aware** (journal→true, else→has-a-book).
