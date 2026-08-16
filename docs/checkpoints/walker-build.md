# R-FIRSTSHELF — WALKER LANE · TIER 1 BUILD checkpoint

Base `4163244` (pushed). Model Opus 4.8. Target CACHE_VERSION `praxis-v3.278` (bump at S6).
Files: `js/views.js` + `assets/components.css` only (no integrations.js — Tier 2 deferred, D4).
Evidence = rendered rig state (localhost:8796, uid `d0tester`, 390×734, force-settled, L19
hit-tested), never source-read. Privacy: counts/ids/titles only.

---

## S0 — GROUND TRUTH — PASS
HEAD `4163244` == origin/main, 0/0, tree clean. CACHE_VERSION `v3.277`. Baselines (LF,
tree==blob, CR=0): views.js **1,109,151** · components.css **875,160** · sw.js **6,041**.
All anchors confirmed live. Rig server 8795 stopped before build (pids 22432/5696 killed).

## D2 DEPENDENCY — SETTLED FIRST (as required)
The existing "alternates 2-6 acceptable" path is `scanResolveStep('picked', cand)`
(views.js) → it **pushes to `scanResult.confident` (the ready-to-shelve tray), NOT
`state.books`.** Rendered-state proof: accepting incremented `scanResult.confident` by 1
while `state.userBooks[uid].bookIds` and `Object.keys(state.books)` were unchanged.
**D2 was already satisfied — no accept-semantics change needed.** The new primary accept
reuses the same `scanResolveStep('picked', …)` path, so both accept routes share one
semantic (tray, never direct write). No split semantics.

---

## SLICE TABLE (parse · bytes · greps)

| slice | files | parse | notes |
|---|---|---|---|
| S1 accept+picker | views.js | OK | walker gains primary accept + "or did you mean" |
| S2 status will-read | views.js | OK | 4 sites: 8525/8585/8652/9018 |
| S3a badge | views.js | OK | reads real library count |
| S3b record | views.js | OK | `scanResult.rec` fixed, persisted in draft |
| S3c shelve disabled | views.js + css | OK | `.disabled` + `.scan-btn:disabled` |
| S3d clamp | css | — | `overflow-wrap:break-word` + ellipsis |
| S3e guide | views.js + css | OK | `scanGuideVisible()` + `.is-hidden` |
| S3f capdoor | views.js + css | OK | dev note removed + mobile `opacity:0` |
| S4 "+" collider | css | — | scan-active hide + nav z:10010 when open |

**Final byte deltas (LF-normalized, tree CR=0), incl. the S5 red-team BLOCK-1 fix:**
views.js **+2,514** (1,109,151 → 1,111,665) · components.css **+1,651** (875,160 →
876,811) · sw.js +0 (v3.277 → v3.278, equal-length). PARSE OK (cscript). ES3 clean (no
const/let/arrow/backtick in added code lines).

---

## S1 — ACCEPT + CANDIDATE PICKER (D1, D2) — PASS (rig, 390×734, L19)

The walker's `scan-wk-guess` now shows the **resolver's own top pick** (`b.resolved.book`,
degrading to the vision read when GB returned nothing — the `manualStub` carries the read
title/author, so it is never empty). A **primary gold accept** ("Add to ready-to-shelve")
sits above the alternates; the plausible alternates render beneath as **"or did you mean"**
(only when present). Not-a-book / Skip / Skip-all unchanged.

**Proofs (rendered state, hit-tested clicks):**
- Accept button on-screen (rect 18–213 × 426–474) and **hit-testable** — `elementFromPoint`
  at its visible center returned the accept button (`hitIsAccept:true`).
- Step 0 (GB top pick): guess = "Dark Matters: On the Surveillance of Blackness" (the
  resolver's pick, not the vision "Dark Matters"); alternate "Dark Matter / Blake Crouch"
  under "or did you mean". Accept → **ready-to-shelve +1**, walker advanced to "2 of 2",
  **library unchanged** (libDelta 0, bookKeysDelta 0).
- Step 1 (GB-empty stub): guess degraded to the vision read "Pedagogy of Hope", accept
  present + hittable, no alternates → no "or did you mean" header. Accept → walker closed,
  confident=2, **library still 7 / 8 keys** (unchanged across the whole walk).
- **Shelve is the single commit point:** with 2 ready, "Shelve 2" (enabled, hittable);
  firing it moved **libDelta +2**, both committed with **status will-read**. Accepting never
  wrote to `state.books`; only shelving did. (D2 proof complete.)

## S2 — DEFAULT STATUS (D3) — PASS
Four scan-commit sites `reading → will-read`: barcode verdict spec (8525), `scanCommitBook`
default (8588), ISBN door (8652), shelf-scan shelve (9018). Proof: `scanCommitBook` with
**omitted** status now yields `will-read`; 7 shelf-scanned books → all `will-read`.
**Fold re-measure @390×734, N=7: case-top 569, clears the 734 fold (+125).** Desk shows the
existing honest line **"Nothing in hand right now."** (true — nothing is currently reading;
no NEW desk copy written, so no shared-line churn — see D5).
**Blast radius grep (8400–9100): no literal `'reading'` remains** in the scan block; the
only "reading" mentions are comments, the "Shelf reading is resting" cost-refusal copy, and
status-neutral "Added to your shelf" announces. Nothing downstream assumes scanned = reading
(the desk membership is `normalizeStatus === 'reading'`, which will-read correctly excludes —
that IS the fold fix).

## S3 — HONEST-STATE CLUSTER (D4) — all six PASS
- **a — badge reads real state.** `scanRenderReview` sets the badge from the user's library
  count: `>0` → "◲ Draft case — these aren't on your shelf yet"; `0` → "◲ Draft case —
  nothing's on your shelf yet". Both branches rig-proven (the empty-library string still
  fires when the library is truly empty — the check can fail).
- **b — record preserved.** The scan's totals are frozen on `scanResult.rec` at fill and
  persisted in the draft; the count line renders `rec`, not the live residual. After the S5
  red-team BLOCK (below), the count line shows only **"N found · N confident"** — the
  "need a look" term is DROPPED because the live "Need a look" band owns that word. Device
  proof: 2-confident/3-exception scan, shelve the 2 → count line stays **"5 found · 2
  confident"** (did NOT drop to "3 found · 0 confident"); the "Ready to shelve" band shows
  live 0. Walker proof (the BLOCK scenario): accept one exception + not-a-book another → count
  line still "5 found · 2 confident" (no "need a look"), bands live "Ready to shelve 3 / Need a
  look 1" — no same-word contradiction.
- **c — Shelve disabled at 0.** `scanRenderReview` sets `disabled = (conf===0)`; CSS
  `.scan-btn:disabled{opacity:.4;filter:grayscale(.55);cursor:default}`. Rig: "Shelve 0",
  disabled true, opacity 0.4, grayscale — no live gold.
- **d — clamp, not clip garbage.** `.scan-dc .cap .t` and `.scan-cov .cov-t` gain
  `overflow-wrap:break-word; word-break:break-word; text-overflow:ellipsis`. **Two-line clamp
  SURVIVES** (proven): the three test titles now show `hOverflow=false` (scrollW==clientW:
  64==64, 47==47) — long words wrap inside the box instead of clipping mid-glyph — while
  `-webkit-line-clamp` stays 2/4 (clientH 24 = 2 lines). NOTE: a literal `clip→ellipsis` swap
  is a **no-op** for this bug — the overflow was a single word WIDER than the box (horizontal),
  and `text-overflow` doesn't apply to a `-webkit-box`; **`overflow-wrap:break-word` is the
  load-bearing fix** (the clamp's own ellipsis then covers vertical overflow past 2 lines).
  Reported transparently as a mechanical determination serving D1's ruled outcome (clean
  ellipsis, clamp intact), not the literal property named.
- **e — one label at a time.** New `scanGuideVisible(on)` toggles `.scan-vf-guide.is-hidden`
  (visibility:hidden); called at both shimmer-show sites (hide guide) and shimmer-hide-after-
  read sites (restore). Rig: during the read the guide is `visibility:hidden` while
  "Reading the shelf…" is displayed (`onlyOneLabelPainted:true`); restored after.
- **f — dev note gone + robust hide.** The `.capdoor-eyebrow-sub` span ("pre-rendered — zero
  network before your first keystroke") is deleted from `buildCaptureDoor`. Mobile
  `.capdoor-sheet` hidden state now `opacity:0` (was `opacity:1`, transform-only), so a
  transformed/filtered ancestor or the iOS dynamic viewport can't leak the painted sheet.
  Rig on #books: `eyebrowSubExists=false`; `#capSheet` computed opacity `0`, not painted.

## S4 — THE "+" COLLIDER (re-opened) — enumerated + fixed (rendered state) — PASS
**Enumeration @390×734 (fixed/absolute painting in the viewport):**
- The "+" = **`#capCreateDoor.cap-create-door`** — the global "Catch a thought" create door
  (bottom-left, `z:9999`, pre-rendered at boot, NOT per-surface). This is the collider.
- `#books`: "+" (cap-on-shelf, 24–66 × 606–648) clears "+ Add a book" (`.shelf-add-primary`
  z:90, 24–144 × 666–710) by 18px, and is opposite the bloom (right) → **no collision on the
  Shelf** in current bytes (cap-on-shelf already handles it).
- **nav overlay open:** `.app-nav-list` is `z:100` **inside `.app-nav` (position:sticky/
  relative, `z:30`)**, so the whole nav sits below the body-level `z:9999` FABs →
  `elementFromPoint` at the "+" center returned the "+" (`plusPaintsAboveNav:true`). Confirmed
  from rendered state (not source). The bloom (also z:9999) had the same problem.

**Fixes:**
1. `body.scan-active .cap-create-door{ display:none }` (joined the existing bloom rule) —
   the "+" no longer collides with Review/Not-a-book. Rig: on #scan (viewfinder + review +
   walker) the "+" AND bloom are `display:none`.
2. `.app-nav.app-nav-mobile-open{ z-index:10010 }` (mobile block) — lifts the nav's stacking
   context above the FABs **only when the menu is open** (closed nav returns to z:30; not a
   transform, canon §2 safe). Rig with menu open: nav computed z 10010; `elementFromPoint` at
   the "+" center now returns `.app-nav-list` (`plusStillOnTop:false`), and the bloom is
   covered too (`bloomStillOnTop:false`) — **both fixed without touching the bloom's CSS**
   (the non-goal is honored: the bloom is neither moved nor restyled; the nav simply covers
   it when open).

## SMOKE (views.js + shared CSS → mandated) — PASS
Shelf (.shelf, htmlLen 12,168), Arcs (present, 8,420), Notebook (present, 2,447), back to
Shelf — all render, no blanks, no crashes. Console errors all environmental rig noise (SW/
netlify-function 404s, camera "device not found", openlibrary CORS on a cover fetch) — none
from app code. Shared-CSS bleed check: every new selector is scoped (`.scan-*`, `.capdoor-*`,
`.app-nav.app-nav-mobile-open`) — no leak onto Shelf/Arcs/Notebook.

---

## S5 — RED-TEAM GATE (fix-red-team, Sonnet, fresh context) — 1 BLOCK + 2 NOTES, all cleared
The Sonnet red-team independently re-derived byte deltas, parse, ES3, foundations MD5, and
the D2 tray boundary — all clean — and confirmed D3's 4 sites + blast radius, the clamp
safety, and the S4 stacking fix.
- **BLOCK 1 (FIXED):** the frozen `rec` count line ("N need a look") and the LIVE "Need a
  look" band shared vocabulary; after a walker accept/not-a-book (this build's own S1 × S3b
  interaction) they diverged on one screen (e.g. record "3 need a look" vs band "1"). **Fix:**
  the count line drops the "need a look" term, keeping the scan's immutable "N found · N
  confident"; the live band owns "Need a look". Rig-proven across the exact walk scenario —
  `recordHasNeedLook:false`, no contradiction. views.js −1 term (+ comment).
- **NOTE 2 (advisory, no change):** the report's "Shelve is the single commit point" is true
  of the walker/tray flow but not the whole #scan surface — the pre-existing barcode Add
  (`scanVerdictAdd`) and ISBN doors also call `scanCommitBook`. Out of scope; phrasing scoped
  to S1 here. (Recorded honestly, not fixed — pre-existing, unrelated.)
- **NOTE 3 (FIXED):** the new `.scan-wk-accept` had no margin and rendered 195px (minor).
  Added `.scan-wk-accept{ display:block; width:100%; margin-top:14px }`; rig now 354px block,
  14px above the evidence box.

## NEW / CHANGED USER-FACING STRINGS (D5 — Preston's to revise, shipped provisionally)
1. **"Add to ready-to-shelve"** — the walker primary accept button (NEW). Ties to the
   "Ready to shelve" band; explicit that accept goes to the tray, not the shelf.
2. **"or did you mean"** — the walker alternates header (CHANGED from "Did you mean";
   now subordinate to the primary accept).
3. **"◲ Draft case — these aren't on your shelf yet"** — the draft badge, library-non-empty
   branch (NEW). The empty-library branch keeps the original "nothing's on your shelf yet".
   Also: the string **"No confident match"** is REMOVED from the walker (there is always an
   accept now).
4. **The review count line** changed from "N found · N confident · N need a look" to
   **"N found · N confident"** (S5 BLOCK-1 fix — the live band owns "Need a look").

## RESIDUALS / NOTES
- Existing empty-desk line "Nothing in hand right now." reused for the will-read case (honest,
  already present) — deliberately NOT rewritten to avoid churning a shared line; flag if you
  want warmer copy.
- Tier 2 (matcher query/ranking) NOT shipped (D4) — the walker still shows the resolver's
  current top pick; a wrong GB top pick is now at least visible + skippable + correctable via
  alternates, and the vision read is always acceptable.
- The wrong-top-pick risk (GB returns a bad #1): the evidence line "I read: '<spine>'" sits
  directly under the guess so a mismatch is visible before Add; alternates + Skip remain.
