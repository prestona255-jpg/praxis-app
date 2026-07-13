---
surface: profile
route: "#profile"
render_fn: renderProfilePage (js/views.js)
ground: dark-hero / light-below (§7 ground spectrum)
in_nav: yes (nav avatar → #profile; #account redirects)
state: shipped — MERGED Profile (Account collapsed in)
rounds: 1
---

## State

`#profile` → `renderProfilePage`. The single merged Profile (R9a). `#account` → `location.replace('#profile')`
(the R7 /marks precedent); the nav avatar points `#profile`. Owner-only surface with a within-page
"preview as visitor"; the real visitor route stays `#reader/<uid>` → `renderOtherProfile` (unchanged).
Old `renderOwnProfile` / `renderAccountPage` retired **defined-but-unrouted** (~2060 L — S-B deletion debt).

Anatomy: a galaxy hero (bright stars = sub-theories · soft planets = categories sized by books · faint field
= books read · tappable values strip · clickable counts · uncarded thesis), then a containment-card system —
Statement → Values → By-the-numbers → Open questions → Now → (DNA carry: returns/journey/reader-model) →
Published (3-up closing band) → Settings. At ≥1200 the meaning split (voice column / Numbers rail) — the
project's FIRST desktop composition tier. Owner-vs-visitor is a CONTENT fence (`.pf-owner-only` + `.is-visitor`).

## Decisions

- **A1 merge** — one Profile at `#profile`; `#account` redirects; nav avatar repointed. `#reader` unchanged.
- **AM8 (the ONE persisted addition)** — `profile.statement`, migration 1.29.0→1.30.0 + the Firestore twin
  (read-merge + write `.set()`). Everything else DISPLAY-ONLY aggregation over existing data.
- **Owner-vs-visitor = content rule** (fencing), not a layout switch.
- **Value-load EVIDENCE-WEIGHTED** (tier w1–w4 from why-lines + drawing subs), never a printed count (A4).
- **Ground spectrum** — dark-warm galaxy hero feathered into the light below (§7).
- **"arcs" replaced "passages"** as the 3rd By-the-numbers stat (no distinct passages store).
- **Condition-1** — every carried handler re-renders `renderProfilePage`, never the retired renderers
  (`buildReaderModelSection` parameterized with a `rerenderFn`).
- **F1 accepted** — the light-skin re-point matches the shipped light surfaces (R5 Arcs); tokenize app-wide
  is S-B debt.

## Gap ledger

- [status: CLOSED v3.198] PA3 — the deferred-social em-dash placeholder is gone (renderOwnProfile retired;
  the merged Profile renders honest states).
- [status: OPEN — S-B] tokenize the shared light-skin literals app-wide (3 surfaces share them).
- [status: OPEN — data-hygiene] duplicate-lens DATA records (surfaced by P3; display-deduped only).

## Round history

- **R9a — MERGED Profile / Galaxy — SHIPPED v3.198 (`e25ac6f`) + patch v3.199 (`6e96d5b`), 2026-07-12.**
  Deployed felt pass = STRONG PASS; live smoke on `prestonpraxistest` PASSED IN FULL (statement Firestore
  round-trip · retrofit accept · visitor fencing · 8-fix spot-check desktop+390). Both gates cleared
  (fix-red-team no-block; praxis-reviewer HOLD→3-fixed). The v3.199 patch cleared 8 deployed defects (DNA
  data-shapes, widened collision proof, lens dedup, shelf-filter links, header/chevron/excerpt/thesis-omit).
  **Reversals:** Numbers pulled forward (AM11) · lens axis restored (AM44) · "arcs"→"passages" · Published
  re-homed (AM41) · thesis uncarded (AM29) · AM45+sky-lens re-opened. Records: `docs/checkpoints/r9a-*.md`.

## Next

- **R9b — arc layer + galaxy depth (two lanes, one round, fully display-only)** — Lane P (page) ships first,
  then Lane G (galaxy). Self-contained handoff: `docs/checkpoints/r9b-handoff.md`.
