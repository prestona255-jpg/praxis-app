# R-SHELF / FINISH-CHOREO — session handoff

Written at chat retirement (token limit). Successor: read this + `docs/studio/lessons.md`
+ `docs/studio/acceptance-card.md` + the two round briefs. Standing law unchanged
(FORK-VERBATIM, felt-delta, owner-viewport, S2 data-write hold; `prestona255` read-only).

## KEY HASHES
- **`125d823`** — FINISH-CHOREO **S1** (v3.240), PUSHED + LIVE. The publish spine (status filter,
  D block-empty, frozen sanitize, shared publish ceremony). Record: `docs/checkpoints/finish-choreo-s1.md`.
- **`36b7d45`** — R-SHELF **brief v3** (THE FELT DIAL) + SEQUENCE RULING v2 re-plan, PUSHED. The
  mockup gate hash; the base for the mockup worktree + the ARC branch.
- **`a7ef5cf`** — docs: `lessons.md` (fault-pattern canon L1-L10) + `acceptance-card.md` (protocol +
  R-SHELF SEED card + elevation-loop trial), PUSHED. **= current `main` HEAD.**
- **`8675cb2`** — R-SHELF mockup **elevation pass 1** (10→17/18), **worktree-local on branch
  `rshelf-mockup`, NOT pushed/merged.** Both prerequisite fixes RATIFIED (kept). `main` untouched.

## STANDING STATE
- **Build lane** = one lane (shared `views.js` / `components.css`). **S2 owns it until it ships.**
  R-SHELF's BUILD takes the lane on Preston's mockup felt-pass; ARC STANDARD's build queues behind R-SHELF.
- **Order:** FINISH-CHOREO **S2** → R-SHELF build → ARC STANDARD build → R-CAPTURE. S3 (motion dignity)
  rides where cheapest. Pipeline law: design overlaps, builds serialize.
- **S2 gate = GO** (Preston: S1 corroboration + felt landed; OV flips ruled). S2's BUILD is HELD only
  by forks A + B below. S2 is a DATA-WRITE slice → push HOLDs for Preston's word regardless of green.
- **Worktrees:** `../praxis-rshelf-mockup` (branch `rshelf-mockup` @ `8675cb2` — the elevation mockup;
  file `docs/studio/mockups/r-shelf.html`). Branch `arc-standard-mockup` (off `36b7d45`, do-not-merge,
  EMPTY, no worktree — holds for Preston's ARC STANDARD chat mockup spec; **do NOT self-design**).
  Stale/unrelated: `../praxis-scan-derisk`, `../praxis-yumi-mockup` (clean up eventually).
- **Phone package** for Preston's R-SHELF felt read: `C:\Users\pallen\AppData\Local\Temp\shelf-preview\index.html`
  (self-contained; Netlify Drop). His felt read at 390 is PENDING and gates the R-SHELF build.
- **OV corroboration (Preston's clock):** the live FINISH-CHOREO S1 frozen-sanitize round-trip on
  `prestonpraxistest` (click-path in the S1 report). Beta-gate #5 flips only when it lands. NOT the agent's
  (interactive sign-in prohibited). Two named privacy-safe residuals (renamed-drop; deleted-draft-unique)
  + one S2 open question (post-sanitize reopen of a frozen arc's published sub) are logged in S1.

## RATIFIED THIS SESSION — mockup §5-vs-§3 collision (CLOSED)
The v3 brief's §5 "carried-forward" v2 Mandates textually contradict §3's dial rulings on three features.
**RULED (Preston): §3's Law-8 sentences GOVERN** — flat two-tone boards (§3.1 over §5 gradient-face),
slim 64px strip (§3.5 over §5 150/118px), chrome-free desk (§3.4 over §5 bordered card). **The mockup's
implementation (per §3) STANDS.** §5's stale lines are amended at R-SHELF CLOSE — **recorded here as a
close-out rider** (do NOT touch the brief now; it's a close-out edit).

---

## FORK S2-A — the threshold overlay shape (AWAITING PRESTON)

**Context to present cold:** FINISH-CHOREO S2 (THE THRESHOLD) builds the finishing ceremony on top of the
shipped S1. Its brief decision **D2** requires the threshold be *"one quiet full-screen overlay — never
stacked modals."* S1 already shipped a shared overlay helper, `_pubOverlay()` (`views.js:20096`), whose
MECHANICS are exactly D4/P9-correct (Esc + backdrop close, fade+slide, **no `scale()`**, reduced-motion
instant). BUT it hardcodes `panel.className = 'pub-ceremony-panel'`, and that CSS (`components.css:14739`)
is a **centered 420px-max modal card** — not full-screen. So the threshold can't reuse `_pubOverlay()`
as-is; the overlay needs a full-screen treatment.

**The fork — two resolutions:**
- **A1 (RECOMMENDED):** parameterize `_pubOverlay()` to accept a variant class → reuse the proven overlay
  engine, add a quiet full-screen `.threshold-*` skin (the arc's central question as the headline, the
  answering-line input, primary "Finish" / secondary "Not yet"). ONE overlay engine, TWO skins. Least code,
  reuses proven mechanics, keeps the family coherent.
- **A2:** build a separate full-screen overlay factory. More code, no shared engine.

**The design dimension (genuinely Preston's, not mechanical):** should the threshold read as a full-bleed
SIBLING of the publish ceremony (same visual family, bigger), or its OWN distinct full-screen treatment?
D2 fixes the behavior (full-screen, quiet, one moment); the visual relationship to the publish ceremony is
open. **Recommendation: A1 mechanics + a distinct-but-quiet full-screen skin** (the threshold is a bigger
moment than publish — it deserves its own restraint, not a scaled-up card).

---

## FORK S2-B — how `answeringLine` is persisted (AWAITING PRESTON)

**Context to present cold:** S2 adds a new persisted field, `subTheory.answeringLine` (the reader's answer
to the arc's central question, authored AT the finishing crossing; **public-facing by design** — it travels
with the finished sub-theory into the commons projection). The SCHEMA add rides `ensureSubTheoryFields`
(`state.js:644`) for free — both the migrate() and the Firestore-merge load paths are already generically
wired, so **no SCHEMA_VERSION bump** (the `citationPins`/`evidenceLayout` precedent). The open question is
only the WRITE at the Finish click.

**The fork — two resolutions:**
- **B1 (RECOMMENDED):** direct-mutate `r.answeringLine = value; saveState()` at the Finish site
  (`views.js:11557-11565`) — exactly the pattern the neighboring status-flip already uses (it direct-mutates
  `r.status`). Consistent, local, no allowlist churn.
- **B2:** extend the `updateSubTheory()` allowlist (`state.js:2219`, currently header/bodyPublic/
  bodyIntellectual only — it silently DROPS unknown fields, so `answeringLine` written through it today
  would vanish). More surface area; the allowlist is a deliberate guard.

**Recommendation: B1** — matches the sibling status-flip, avoids widening the `updateSubTheory` guard.

---

## S2 BUILD ANCHORS (verified at 36b7d45 — successor re-checks; lines drift)
Recon: `docs/checkpoints/finish-choreo-s2-recon.md`. Brief: `docs/studio/finish-choreo-brief.md` (D2 + S2 slice).
- Finish trigger: `.stb-pubpill` click, `views.js:11557-11565` (only site setting `status='published'`; basin-guard intact).
- Arc's central question = **`arc.title`** verbatim (no separate field; `views.js:13577`).
- Privacy-sweep source = **`evidencePrivate()`** (`views.js:10932`), over `subTheory.evidence[]` keyed on
  `notebookEntries[refId].isPrivate`. ⚠ `attachedMarginalia[]` is a DEAD write — the trap.
- `.st-room-threshold` label at `views.js:11194` → replaced by the answering line when one exists, else current copy.
- Reopen stays INSTANT (`views.js:11258-11275`, `:11560`) — ceremony marks the crossing IN only.
- Motion: cite the R-POLISH L4 drag tokens + mobile-canon P9 (one quiet full-screen moment, never stacked modals).

## SUCCESSOR FIRST MOVES
1. If Preston's phone felt read on the R-SHELF mockup (`8675cb2`) came back: on PASS, the R-SHELF build takes
   the lane AFTER S2 ships (it's second in the serial order). On fail, elevation pass 2 (max 3 passes).
2. On Preston's S2-A + S2-B rulings: build S2 (staged flow → red-team + reviewer → data-write HOLD at push).
3. ARC STANDARD build waits on its ratified mockup (Preston's chat spec → the empty `arc-standard-mockup` branch).
