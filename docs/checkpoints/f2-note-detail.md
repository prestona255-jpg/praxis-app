# F2 — NOTE-DETAIL CANON REPAINT — BUILD + VERIFY

HEAD base `bc0de4d` · target CACHE_VERSION **v3.259**. Recon: `f2-note-detail-recon.md`.
Self-run (F2 exactly as written): build → verify → red-team → pre-authorized ship.

## Slices built

**JS (js/views.js):**
- S1: `renderNoteSurface` wrap `note-surface lum-amber-deep` → **`note-surface`** (drop
  the dark reading-room skin; the 'note' route is `data-ground="bright"`, so light ink lands).
- S2: back-link "came from" — module-level prev-hash tracker via an own `hashchange`
  listener (additive observation; routing untouched) + `noteBackAffordance()` helper;
  applied at both back-link sites (not-found + main). Known non-note prev → `{prev, '← Back'}`;
  notebook / unknown / note→note → `{'#notebook', '← Back to the notebook'}`.
- S3: wording — "Unfiled — not filed to a book" → **"In the Inbox — not yet filed to a book"**.

**CSS (assets/components.css, note-* block + new mobile @media):**
- `--gold-text`→`--gold-deep` (back-link + prov-door, rest + hover); `--surface`→`--page-2`,
  `--border`→`--line-page` (edit btn/done/plain fills + prov top border); `.note-edit-done`
  keeps `--grad`/`--text-on-dark`. Body un-clamp: `.note-surface .note-body{ max-height:none;
  overflow:visible }` (overrides the inherited `.notebook-entry-body-md` 15em list-preview cap —
  note-SCOPED, the notebook list preview keeps its clamp). Mobile `@media (max-width:759px)`:
  P3 edit btns `min-height:44px`; P8 `.note-prov-row{ flex-wrap:wrap }`.

## Gates (F2-2)

- **ES3:** diff grep for `=>`/`const`/`let`/backtick/`class` → CLEAN.
- **Parse:** `cscript parse-check js/views.js` → PARSE OK.
- **Byte deltas (LF-normalized blob sizes):** views.js +1549 B (28 code / 5 comment lines) ·
  components.css +868 B (16 code / 3 comment) · sw.js +0 B (version string equal length). Floors
  ran ~2× low (expected, FIX-PROTOCOL §3); overage is comment/provenance, no CODE ceiling declared.
- **Foundations MD5:** lumen-amber `070679b0…` · marks `772886c0…` — UNCHANGED (not touched).
- **Sole-writers:** `captureNote` (views.js:3072) + `updateNotebookEntryBody` (state.js:2609)
  NOT in the diff — edit/capture wiring untouched.
- **Dead-backdrop:** no `backdrop-filter`/`blur` in any note-* rule (was 0, stays 0).

## Live rig verification (localhost:8790, d0tester stub; prestona255 never touched)

Screenshots dead in headless pane → geometry/computed-style evidence (felt pass = Preston, live).
5 injected d0tester entries: filed-marginalia · unfiled-journal · long-marginalia · with-images · question+arc.

**Ground-check + core (1280):**
- `data-ground="bright"` ✓ · surface class = `note-surface`, `lum-amber-deep` absent ✓ ·
  `background-image:none` (no dark ground) ✓ · body color `rgb(36,23,16)` (#241710 dark) on light = **readable** ✓ ·
  `max-height:none` ✓ · back-link color `rgb(133,84,16)` (#855410 --gold-deep) **visible** ✓ ·
  prov-door color `rgb(133,84,16)` ✓ · body font 17px serif ✓ · eyebrow "Marginalia · 7/25/2026" ✓.

**Content walk:**
- unfiled journal → prov **"In the Inbox — not yet filed to a book"** ✓
- long marginalia → body scrollH 861px == clientH (NOT clamped) ✓
- question+arc → "In the Inbox…" + "In the arc A Pedagogy of Desire · Open the arc →" ✓
- with-images → renders text+prov, no break (images not shown = pre-existing NOTE-IMG, named) ✓
- **edit opens**: `.note-edit-btn` click → `.note-edit-done` + `.note-edit-canvas`/`.note-edit-plain` present ✓

**Back-link came-from (real async hashchange):**
- from #search → `#search` "← Back" ✓ · from #notebook → `#notebook` "← Back to the notebook" ✓ ·
  from #book/<id> → `#book/<id>` "← Back" ✓ · note→note → `#notebook` fallback ✓

**390 mobile:** docScrollW 390 == clientW 390, **no h-scroll** ✓ · 0 overflowers (no text-vs-object
collision) ✓ · prov-row `flex-wrap:wrap` ✓ · edit btn + done both 44px (P3) ✓.
**1280:** no h-scroll, 0 overflowers ✓.
**Signed-out:** no `.note-surface`; renders "This note is private / Sign in to read and edit your notes."
(no crash) ✓.
**Console:** no errors on any surface walked.

## Residuals (named, not folded)
- **NOTE-IMG** — note-detail renders no attached photos (pre-existing; own lane).
- **openMarginaliaEditor naming drift** — the ruling named the book-detail pencil; note-detail's
  real edit path (`createWritingCanvas`/textarea) was restyled shell-only per the intent.

## #note/<id> route (report-only)
Live + linked from 4 surfaces already; F2 makes it canon-native (no longer dark-on-dark) →
its promotion/wider reliance is **UNLOCKED** for the round-close ruling. Not built here.

## Red-team (F2-3, Sonnet, against the diff) — 1 BLOCK cleared + 2 NOTEs folded

Independently re-derived byte deltas (3 ways), MD5, parse/ES3, CSS scoping (no bleed —
traced the two body-render DOM paths: the un-clamped `.note-body` is under `.note-surface`;
the notebook LIST preview's clamped `bodyEl` (views.js:15498-15505) has no `.note-surface`
ancestor), edit-wiring (zero touch — 3 hunks only), hashchange listener safety (additive,
registers before app.js), ground-check (`--gold-deep`/`--ink` values confirmed on the bright
scope). All PASS.
- **BLOCK — build checkpoint unstaged** → CLEARED: `docs/checkpoints/f2-note-detail.md`
  staged with the fix (precedent: b7b358a / fee3c72 stage recon + build together).
- **NOTE — `backOk` narrower than `umberGroundDark`** → FOLDED: added `artifact` + `yumi-sees`
  so the allowlist mirrors the 16-route map (minus 'note'). No wired path came from those
  surfaces, so behavior for all real links is unchanged; safe-default preserved.
- **NOTE — gold-token framing** → CLARIFIED: `--gold-text`→`--gold-deep` is forward-looking
  canon-compliance, NOT the causal fix — both resolve to `#855410` on the bright scope today.
  The causal fix is **dropping `lum-amber-deep`** (S1); the token swaps make the surface use
  the explicit light-canon set per the ruling and guard against future `--gold-text` divergence.
