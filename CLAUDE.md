# Praxis — build agent guide

## Session rules (read first, every session)

- IMPORTANT: Read PROTOCOL.md before any wave or build work. It governs
  all build discipline. If this file and PROTOCOL.md ever disagree,
  PROTOCOL.md wins for build process.
- IMPORTANT: Load docs/FIX-PROTOCOL.md every session — the standing fix &
  build discipline (v1.2) for any staged code change; its invariants are
  enforced by the hooks/pre-commit gate.
- Run `sh tools/ground-truth` at session start to confirm the fix-infra is live
  (agents, hook armed, protocol version, HEAD) before any build work.
- Before answering ANY planning, status, or roadmap question, use the
  praxis-recon agent to establish ground truth from the repo. Never
  answer from memory of past sessions or from docs alone.
- After any build completes and BEFORE any commit, use the
  praxis-reviewer agent to grade the work. Its verdict gates the commit.
- Docs ride with the diff: if this session's work contradicts any
  committed doc (this file, BUILD_STATE, docs/checkpoints), correct that
  doc in the SAME commit — never "separately later."
- Known correction: there is NO parse-check-views.js harness in this
  repo. The sanctioned JS parse check is cscript JScript on isolated
  functions. (Remove any contrary claim found elsewhere in this file.)
- BOARD.md at the repo root is the coverage board — one row per
  surface. Any wave that changes a cell (Amber, mobile, states,
  logged-out) updates BOARD.md in the SAME commit.

## Lessons — the seams (read before any wave)

Almost every failure this project has hit came from a seam, not from
syntax. Guard the seams:

- VISUAL GATE: computed styles never prove a look. A wave that changes
  what a surface *looks like* is not done until settled screenshots
  render at 1280 + true 390 AND Preston's eyes pass it. (W8 Lane A
  "verified" by computed style, then needed a second commit for the skin.)
- MOCKUP FIRST: a signed-off mockup is committed to design/ BEFORE its
  build prompt runs — it is the spec. (W9/W10 build prompts blocked on
  mockups that lived only in chat.)
- COPY IS A CONTRACT: never ship copy promising behavior that isn't
  built. When touching a surface, grep its copy for promises. (About told
  users each room "introduces itself in Yumi's voice" for weeks with no
  such code.)
- DOC = POINTER, LIVE FILE = SOURCE: when a committed doc and the code
  disagree, build against the code and fix the doc in the SAME commit.
  (CLAUDE.md's --grad values didn't match theme.css.)
- AUTH-GATED WRITES: any HOLD report touching signed-in writes must state
  "persistence unverified — rig is signed out" and list Preston's exact
  live-smoke steps. "Fully real" without that line overstates.
- SCREENSHOTS: force-settle reveal animations before capture; note dpr.
  DOM geometry corroborates; neither alone suffices. (W9 stance screen
  shot blank mid-animation, nearly read as a bug.)
- THE FORK RULE: architecture forks, scope additions, and design-comp
  changes surface at a HOLD for Preston's call; mechanical determinations
  are carried silently.

## Project
Praxis: vanilla-JS theory-publishing platform with an AI persona, Yumi. Pure static site on Netlify; Firebase/Firestore backend. Live: praxis-reading.netlify.app. Work on `main` by default. Use worktrees only for parallel lanes, and only via the Worktree & Merge Protocol below — never freehand.

## How we work
Two tools: a Claude chat is the design partner and brief author; you (Claude Code) are the executor. Engineering mode — lead with the conclusion, work in staged briefs with PASS/FAIL checkpoints, never bundle unrelated changes into one commit.

## Conventions — hard rules
- `var` and `function` only. No `const`, `let`, arrow functions, `class`, or template literals.
- String concatenation, not template strings. Callback-style `.then()` chains.
- CSS variables only — no new hardcoded hex (the code already uses `var(--token)` in SVG fills).
- localStorage only via the `ls(key, default)` / `sv(key, value)` wrappers.

## File load order
state → tradition-forms-arc → arc-constellation → integrations → yumi-brain → arcs → voice-input → yumi-ui → spotlight → writing-canvas → views → import-capture → app
(tradition-forms-arc loads before arc-constellation, which depends on it; both load before views.)

## Environment & deploy
- Node is blocked on the Windows machine — never run `npm` or `node`. The standard parse harness is `tools/parse-check` (cscript JScript, ES3, `new Function()`; run `cscript //nologo //E:jscript tools/parse-check <file.js>`): it neutralizes reserved-word method names (`.catch`/`.delete`/`.finally`) so promise-using files DO parse; ES5+ *syntax* (arrow, `const`, `let`, backtick) still fails — correct, since Praxis is ES3-only. It checks syntax, not runtime, so still live-verify integrations.js, yumi-brain.js, and sw.js on the deploy as a backstop.
- Deploy = commit + push to `main`; Netlify auto-builds. No Drop, no branches, no preview deploys. Verify live behavior on praxis-reading.netlify.app AFTER the push.
- Commit subjects use an em-dash (—).
- Every JS change after a CACHE_VERSION bump needs its own bump, or the service worker serves a stale bundle. An already-open tab keeps the old SW until the user accepts the "new version ready — Reload" banner.

## Verification — non-negotiable
- Open every task with Stage 0 recon: read the files, confirm anchors, report stats, then STOP for go-ahead.
- Byte deltas are measured before AND after — never back-derived. Report grep counts. (Git stores text blobs as LF though the working tree is CRLF, so the autocrlf warning is cosmetic; prove "no EOL flip" with a small diff stat, not the warning.)
- Never commit or push until Preston sends the exact words "commit and push." Then prove it: commit hash, the subject (`git log -1 --format=%s`, em-dash intact), and `HEAD == origin/main`.
- "I did X" is never proof on its own — show the diff/grep/count.

## Where the work stands (read first, every session)
- Current status, every stage's real state, and the open work live in `docs/Checklist and Roadmap/BUILD_STATE.md` — read it first. It is the single canonical tracker, updated per-substage in the same commit that finalizes each checkpoint. (The old `Praxis_Build_Checklist.html` and `Praxis_Roadmap.html` were deleted — they stored state in localStorage, not git, and drifted; recover the old blobs at SHAs `c0ddfe5` and `40de91f` if needed.)
- The locked 9.6 design and stage scope live in `docs/PRAXIS_9_6_AND_VISUAL_UPLIFT.md` — the source of truth the build briefs are written against.
- For any sub-theory work, also read `docs/knowledge-arcs/knowledge-arcs-subtheory-pivot.md`.

## Visual / UI work — read the design spec first

Before any UI, styling, layout, or constellation work, read `docs/design-spec.md`
and conform to its tokens and rules. It is the code-derived visual source of truth
(tokens, per-component rules, and the constellation spec). The mockup and screenshots
are cross-checks; the spec is canonical. When live disagrees with the spec, live is
the drift — conform live toward the spec, staged and live-verified, never a bulk swing.

## After a stage
Record the stage as claimed-done with its evidence (byte deltas, grep, commit hash, live check) — but leave the PASS stamp to Preston.

## Plan-file execution protocol (added June 2026)

This protocol is the DEFAULT for all build work — not a Stage 10
special. Stages are authored into a plan file (docs/<stage>-plan.md);
"Execute <substage> from <plan file>" is the trigger, and the
discipline below governs every build task, plan-file or ad-hoc:

- Read the named substage's section fully before any action. The plan
  file is authoritative for scope; this file is authoritative for
  conventions. Conflict = halt and ask.
- Run the substage's Stage 0 recon first, write findings to
  docs/checkpoints/<substage>-recon.md. If the plan marks a DECISION
  GATE, halt after recon and wait.
- Build slice by slice in the plan's order. After each slice, self-verify
  the mechanical gates and append results to
  docs/checkpoints/<substage>.md. Proceed only if ALL pass.
- MECHANICAL HALT CONDITIONS (stop immediately, write the failure to the
  checkpoint file, await Preston):
  - any parse check FAILs (`tools/parse-check` cscript harness — now parses
    promise files via method-name neutralization; else full-diff / live-verify)
  - a byte delta falls outside the plan's stated expected band
  - a grep count does not match the plan's stated expectation
  - any tracked file is dirty that the slice did not intend to touch
  - the diffstat suggests an EOL flip (whole-file change)
  - any genuine ambiguity about what the plan means
- Never bundle slices. Never proceed past a FAIL "because the fix is
  obvious." Never trust your own narrative over computed evidence.
- Commit/push only on Preston's exact words. After push, wait for the
  Netlify build, then open https://praxis-reading.netlify.app in the
  browser, hard-refresh, confirm the new CACHE_VERSION in DevTools, and
  run EVERY pass-check in the substage plan yourself. The human
  provisions the test account and its connected browser session ONCE;
  the executor seeds all data and runs all checks within it, after
  confirming account identity (email + empty/expected state) before any
  write. If no test session is connected, requesting one is the only
  verification step that may be handed to the human — an auth limitation
  is never a reason to hand a check to the human; it is a reason to use
  the test session. Evidence standard: live-DOM structural proof is the
  hard PASS/FAIL evidence; screenshots corroborate, embedded as repo
  files when the tooling exposes a path, else recorded as session IDs
  with descriptions. A pass-check without recorded evidence is
  UNVERIFIED, and a substage cannot be declared complete with any
  UNVERIFIED check. Human-only gates, the complete list — hand the human
  nothing else: (1) commit/push authorization by exact words; (2) design
  comp-gates, visual judgment on live screenshots; (3) real-data
  verification only where test data cannot represent the case, presented
  as a single named check with a click-path.
- End every substage with the report file complete: slice table (parse,
  bytes, greps), live-verify results, screenshots, honest residuals.
  Then STOP. Preston does his eyes-on check and decides what's next.
  Do not start the next substage unprompted.

## Worktree & Merge Protocol

Use git worktrees to run parallel builds that touch DIFFERENT files.
Rule: two lanes may run concurrently ONLY if they share zero files.
Same-file work (anything editing views.js) stays in ONE worktree,
sequential. Usual collision points: components.css, views.js,
sw.js CACHE_VERSION.

### Create a lane (from a clean, current main)
git worktree add ../praxis-<lane> -b <lane>-lane
One worktree per lane; open each in its own session. Build, verify,
and commit inside it. Never push a lane branch to its own live
deploy — only main ships to Netlify.

### Merge a lane back — GUARDED, run WITH the human
Never merge onto main directly. Rebase the lane onto main FIRST so
conflicts surface in the lane, never on main.
0. RECON (read-only): confirm main + ../praxis-<lane> are clean
   (git status); report both HEADs; list files differing between
   <lane> and main. STOP — one question: proceed?
1. REBASE: git checkout <lane>; git rebase main. For EACH conflict,
   show the hunk, propose a resolution, and WAIT for human ok before
   writing it. CACHE_VERSION → take the higher number. One at a time.
2. RE-VERIFY the lane: re-run that build's pass-checks (diffs, grep
   counts, parse/computed-style). FAIL → git rebase --abort, report,
   STOP.
3. MERGE: git checkout main; git merge <lane> (expect clean
   fast-forward). Show git diff --stat. STOP for the human's exact
   commit words — do NOT push yet.
4. SHIP + LIVE-VERIFY: on exact words, commit via git commit -F
   (UTF-8 file, em-dash, verify %s before push), push; drive
   SKIP_WAITING; hard-refresh the live URL; re-run live PASS checks
   on the merged result. Report PASS/FAIL per check. Regression →
   report, never paper over.
5. CLEANUP on confirm: git worktree remove ../praxis-<lane>;
   git branch -d <lane>.

### Always
- Merge ONE lane at a time → re-verify → ship → next (single live
  deploy can't verify two branches at once).
- Never accept "done" without a diff, grep count, or computed-style
  readout. One question per step. Ambiguity → STOP and ask.

## Design canon — full-app redesign (mobile + desktop) — added June 2026

The single source of truth for the full-app responsive restyle (global shell, Home,
Shelf, Arcs, Account, Book detail, Arc/constellation, Notebook). **Governance order:**
this canon > the two reference mockups (`design/praxis-design-canon.html`,
`design/praxis-profile-galaxy-mockup.html`) > everything else. Where this canon names
a supersession of `docs/design-spec.md` (§5), this canon wins **for this build**;
elsewhere design-spec.md and the mockups still stand. The mockups are
**layout/style references only** — never copy their approximate hexes or their sample
text (arc names, marginalia, the 112/2/7/2 stats, book titles); wire the real tokens (§1)
and pull all content from live state.

### 1. Tokens — wire these real `theme.css` / `lumen-amber.css` vars (never hardcode a hex here)

`theme.css` and `lumen-amber.css` are the canonical source for token VALUES — do NOT restate
hex literals in this doc. (The prior hardcoded list drifted from the live tree — none of its
literals matched live CSS; the R0 recon carries the verified resolved snapshot. See
`docs/studio/recon/r0-recon.md` §1.2–§1.4.) Live values resolve through a **primitive →
semantic → `[data-ground="dark"]`** layer, so no single literal can capture a token: wire the
token by NAME and read its value from `theme.css` (or the recon report's Stage-1 snapshot).

- **Fonts (3):** `--font-serif` = `'Cormorant Garamond', Georgia, 'Times New Roman', serif`
  (titles, prose, italics); `--font-body` = `'DM Sans', -apple-system, …, sans-serif`
  (body, nav, buttons, hero H1); `--font-mono` = `'DM Mono', 'SF Mono', Menlo, Consolas, monospace`
  (eyebrows, labels, meta, desktop nav links per §4-B). (These three stacks DO match live
  `theme.css:9-11`.)
- **Surfaces:** `--surface` (card fill) · `--surface-2` (lighter card) · `--color-surface`
  (page fill / mobile panels) · `--bg` · `--bg-2` · `--sunk` · `--glass` / `--glass-2` /
  `--glass-spotlight` (translucent chrome fills).
- **Page ground:** the viewport-fixed `body::before` radial gradient — keep the anchoring;
  value lives in `theme.css`.
- **Inks:** `--ink` · `--ink-2` · `--ink-3` · `--ink-4` (primary → tertiary text) ·
  `--br-deep` · `--text-on-dark` (text on dark / gradient fills).
- **Gold:** `--gold` · `--gold-light` · `--gold-text` · `--wordmark`.
- **Primary gradient:** `--grad` (primary buttons, avatar, gradient-clip "theory."). Use the
  token, not the mockups' approximate angle/stops.
- **Lines / accents:** `--border` · `--line-2` · `--wash` · `--river` · `--marginalia-color`
  (teal) · `--danger`.
- **Radii:** `--radius-sm` · `--radius-md` · `--radius-lg` · `--radius-xl` · `--radius-pill`.
- No new hardcoded hex: reuse the nearest token, or add one to theme.css with a comment —
  never inline a literal in components.css (or in this doc).

### 2. Build guardrails (scope of this redesign)

- ES3 client only (`var`/`function`, `for`-loops not `.map`/`.filter`, string concat,
  two-arg `.then`). No libraries. No data-model / state / routing / auth / Yumi / proxy
  changes (computed display-only aggregation like §4-G's counts is allowed).
- Reuse existing tokens and class names; **ADD rules, don't rewrite the load-bearing
  ones.** No token/var renames, no CSS-architecture restructure.
- **Nav, hamburger menu, and any dropdown/overlay chrome stay SOLID** — no
  `backdrop-filter`/`blur`, and no `filter`/`transform` on any ancestor of an
  absolutely/fixed-positioned child that can overflow it (this is the iOS nav bug), at
  every width.

### 3. Breakpoint discipline — DESKTOP-FIRST (load-bearing)

The CSS is **desktop-first**: base rules (no media query) ARE the desktop layout; the
only `@media (min-width:760px)` block today is the nav pill; `@media (max-width:…)`
blocks step *down* for narrower widths. A base-rule edit therefore hits **both** widths.

- **Net-new desktop-only change → wrap it in `@media (min-width:760px)`.**
- **Net-new mobile-only change → put it in `@media (max-width:759px)`** (the main mobile
  block is the `MOBILE BREAKPOINT (<760px)` section, components.css ~line 4049).
- **Edit a shared base rule ONLY when both widths want the identical value.** Otherwise
  split: base + a compensating mobile override, or a desktop-only min-width block.
- **Leave the legacy `@media (max-width:720px)` blocks alone** (arcs-create, arc-card,
  subtheory-layout) and the `max-width:499px` / `max-width:1099px` shelf-grid steps — do
  not restructure them; add at 759 unless a screen you are already reworking owns one.
- 760 is the mobile↔desktop divide. Every stage: verify at **390** (device-mode) and
  **~1280**, and confirm the OTHER width is byte-for-byte undisturbed.

### 4. Resolved design decisions (A–J)

- **A — Nav blur removed.** Nav/menu/overlay chrome carries a SOLID fill, no
  `backdrop-filter`, no blur, at every width. (Live desktop nav's `blur(8px)` +
  translucent `--glass` is the drift to fix.)
- **B — Nav active = gold underline.** A 2px `--gold` underline marks the active link,
  not a wash-fill pill. Reserve the underline's space (transparent border) so toggling
  active never shifts layout. Desktop links are `--font-mono`, uppercase, ~12px,
  letter-spacing ~.13em.
- **C — Keep the ⌘K search, restyle quiet.** The wired nav search (spotlight.js) stays;
  make it visually recessed/quiet so it does not compete with wordmark + links + avatar.
  Desktop only (hidden on the mobile bar, as today).
- **D — Shared primitives are ADDITIVE.** Add primitive classes (primary gradient button,
  ghost, quiet, card surface, segmented control, mono eyebrow, status dot, Yumi FAB). Do
  NOT rewrite the existing per-surface classes (`home-cta-*`, `shelf-new-book`,
  `book-detail-*`); adopt the primitives only where a stage's markup is already touched.
- **E — Shelf toolbar decluttered.** One primary `+ Add a book` (gradient) +
  `Covers|List` segmented + **quiet chips** for Scan shelf / Bulk add / Resolve covers +
  the search. Restructure `renderShelf` markup so the 4 near-equal header buttons become
  1 primary + 3 chips.
- **F — Arcs grid = 1-up mobile / 3-up desktop.** Follows the mockup (overrides the
  brief's "2-up mobile"). Applies to both "Your arcs" and the examples section.
- **G — Arc card = thumb + title + description + mono meta line.** A single constellation
  thumbnail, the title, the description, and a mono meta line with **computed counts**
  ("N books · M sub-theories · K marginalia"). Counts are **display-only** aggregation in
  `renderArcsPage` — no data-model change. **Drop the 5 cover thumbnails.**
- **H — Constellation Layers + legend OUT OF SCOPE.** Restyle the existing constellation
  chrome (the Connect/Reset/Layers chips, the legend text) **visually only**. Do NOT
  rebuild Layers into toggle switches, do NOT change the legend's item set/semantics, do
  NOT touch the mark renderer / drift / "the question" label.
- **I — Book-detail mobile reorder.** At ≤759: cover → title → author → meta → primary
  `Add to an arc` → secondary pair `[Send to sub-theory | Add marginalia]` → quiet
  `Mark as finished` → artifact card, via DOM/CSS `order`. Desktop stays two-column
  (cover + action stack left; title + artifact right). "Add to an arc" is the standalone
  primary; the paired secondaries are Send-to-sub-theory + Add-marginalia. (Fix #2's
  picker `scrollIntoView` is already shipped — verify, don't rebuild.)
- **J — Home CTA + width.** Home actions stack on mobile (≤759, flex-column),
  side-by-side on desktop. Standardize centered-content `max-width` to 1080 only where a
  stage already touches that surface; don't churn untouched widths.

### 5. Supersession vs `docs/design-spec.md` (A / B / H)

For this build only, this canon overrides these design-spec points:
- **A → supersedes** design-spec B.1's nav `backdrop-filter:blur(8px)` and the nav entry
  of the A.5 "blur invariant." Nav is now solid / no-blur. (The spotlight modal blur(14px)
  is out of this build's scope and untouched; the constellation control-bar blur belongs
  to the deferred §4-H constellation work, not this build.)
- **B → supersedes** design-spec B.1's active-link treatment: gold underline, not the
  wash-fill pill.
- **H → scope carve-out (not a value override):** design-spec C.3/C.4 (Layers as toggle
  switches, 5-item legend, slow drift, "the question" center label, book-evidence layer)
  remain the canonical *future* target for the constellation but are **explicitly
  deferred** here. This build restyles existing constellation chrome without regressing
  those behaviors and without partially implementing them.
- Everywhere else, `docs/design-spec.md` and the mockups continue to apply.

### 6. Cache + the two fixes

- One commit per stage, all **local**; nothing is pushed until Preston's exact "push." When a
  stage ships a code change, bump the service worker cache once at the final push: read the
  current `CACHE_VERSION` in `sw.js` at commit time and increment it by exactly one — never
  target a hardcoded version number.
- The two functional fixes (Arcs "Your arcs" list; picker `scrollIntoView`) are already
  shipped earlier — they are **verify-only**, not build. Fix #1's card *styling* to §4-G
  is the one residual, folded into the Arcs stage.

## Live Forensic Smoke Test — MANDATORY before any "done" or ship

**Why this exists.** Data-layer checks ("I called the function and it returned" / "I wrote the doc and
read it back") are necessary but **not sufficient**. Render regressions, CSS bleed across surfaces,
broken hover/affordances, dead buttons, and data duplication/orphaning are **invisible** to
function-level verification — they only surface when you drive the real rendered UI a human touches.
The Notebook v3.112 ship passed a "9/9" data-layer check and still shipped a dead Create button, a dead
Yumi chat, a broken Arcs List view, lost hover affordances, and a duplicated shelf — all of which a
60-second UI pass catches instantly. **If a human can't see it or click it, it isn't done.**

### Verification-safety rules (always, no exceptions)
- **UI-driven > function-call.** Prove behavior by clicking/typing through the rendered app, not by
  invoking functions in the console. A green function-level check is a precondition, never the proof.
- **Never run destructive verification on a real user account.** No clearing its `localStorage`, no
  forced auth-merges, no write/delete cycles on `prestona255` (or any real account). Use a **fresh
  throwaway Firebase account** for all write/behavior tests. (Destructive verification on the real
  account is the suspected cause of the v3.112 shelf-duplication damage.)
- **Back up before any recovery write** to a real account — export the relevant Firestore docs to a
  local JSON file first, so the action is reversible.
- **Counts must match data.** On every data-bearing surface, the rendered count must equal the stored
  count (this is how you catch duplication and orphaning).
- **Console must be clean** on every surface you check.

### When to run
- **FULL smoke test before every final acceptance gate / ship.**
- **Any change touching `views.js` or shared CSS (`components.css` / `theme.css`)** automatically
  triggers, at minimum, a render check of **Shelf + Arcs (List & Web) + Notebook + a console scan** —
  because the stylesheet is global and a single over-broad selector bleeds across surfaces (exactly how
  the notebook epic broke the Arcs List view from a notebook-only change).

### The surface checklist (drive each, signed in, on representative data)
- **Home** — hero + "open the constellation" render; no console errors.
- **Shelf** — books render **once each (no duplicates)**, covers correct, read-status chips present;
  Covers + List views both render; add/scan/bulk controls present. **Rendered count == stored count.**
- **Arcs — List** — arcs render; each arc's sub-theories render as a **proper list (NOT blown-up book
  covers)**; descriptions intact.
- **Arcs — Web / constellation** — glyphs + links render; no crash.
- **Sub-theory** — **hover a sub-theory card reveals its action affordances (unlink, etc.) and they
  click**; the sub-theory detail opens (evidence rail + register/publish controls present).
- **Notebook (the spread, Alt 1)** — tabs + counts correct; **writeline grows with content (type past
  one line — nothing is clipped or unreachable)**; capture in each register (marginalia / journal /
  question) routes correctly (by-kind visibility; bookless → Inbox); **gather → Choose an arc → Create
  produces a real sub-theory** with the gathered notes as evidence (verify end-to-end **by clicking**);
  master "Yumi reads along" switch + "What Yumi sees" present and reflect state.
- **Yumi** — chat opens and a message **round-trips**; if the endpoint is gated or down, it must **fail
  gracefully with the expected message**, not a generic crash.
- **Logged-out** — protected pages (Notebook, Arcs) render a sign-in prompt with **no crash**.

Record each surface as **PASS/FAIL with the actual observed evidence** (rendered values, console
output, screenshots where useful). **A single FAIL blocks "done."**

## Operational notes

- Z-INDEX LEDGER (consult before adding stacked chrome): Yumi Bloom 9999
  · app modals/pickers 10021 · intro panels 10005 · intro summon 9990 ·
  intro journey 10060.
- RENDER RIG: clear the service worker + caches before verifying any edit
  (the SW precaches index.html/components.css, so stale files serve
  otherwise); reset per-surface seen-flags when testing first-run flows.

## Studio Protocol (added July 2026)

How Praxis gets built now: a repeatable loop, one surface at a time, tracked in
`docs/studio`. The Builder (`docs/studio/builder.html`) is a generated view of it.

- THE LOOP — **scan → shape → build → close.** scan = the `studio-scan` agent
  audits ONE surface through the seven lenses and drafts a round brief; shape =
  forks resolved with Preston + the surface mockup reconstructed against Universal;
  build = a staged Claude Code build under FIX-PROTOCOL discipline, one commit;
  close = a round closes ONLY on Preston's felt pass.
- THE SEVEN LENSES (every scan): code health · data/state integrity · performance ·
  accessibility · UX/interaction · canon fidelity (against Universal + the gilding
  law) · product gaps.
- `docs/studio` IS THE STUDIO'S TRUTH — the markdown is the record: `sequence.md`
  (the build sequence) + one `<slug>.md` per surface (census facts + Decisions,
  Gap ledger, Round history, Next). The defect audit maps what's BROKEN; the studio
  loop maps what's MISSING; both file here.
- THE BUILDER IS A GENERATED VIEW — `docs/studio/builder.html`, emitted by
  `tools/studio-build` (run `sh tools/studio-build`). Never hand-edit it; edit the
  markdown and regenerate.

Two standing rules — they join the existing session rituals:
- SESSION-START — before any studio, build, or roadmap work, read
  `docs/studio/sequence.md` for the current build state (alongside
  `sh tools/ground-truth`).
- CURRENCY — every round close and every studio-relevant build MUST update the
  surface markdown + `sequence.md` and re-run `tools/studio-build`. Automatic, not
  optional — the Builder drifts the moment the markdown moves without a regenerate.

A round closes ONLY on Preston's felt pass — computed styles and green gates are
necessary, never sufficient (the VISUAL GATE lesson).

- THE SEQUENCE IS A LIVING PLAN, NOT A LOG. At every round close (and any build
  that materially changes direction), re-evaluate `docs/studio/sequence.md` — not
  just append: promote gaps that proved severe, demote or retire work that closed
  or lost relevance, keep `## Now` to the 3 truest next moves, move completed items
  to Shipped, and record a one-line rationale for any reordering under `## Re-plan
  log` (dated). Then regenerate the Builder. The Builder's front sections must
  always reflect the CURRENT direction, not the direction as of install.
- GUARDRAIL — THE AGENT ADAPTS, PRESTON STEERS. Re-ordering WITHIN Now/Next on
  fresh evidence is autonomous (with a dated rationale). But any re-plan that (a)
  changes the launch spine, (b) retires an item outright, or (c) contradicts a
  decision Preston made is NEVER applied silently — it is written as `PROPOSED:` in
  the Re-plan log and rendered as a flagged, distinct entry at the top of the
  Builder's sequence page for Preston to confirm or reject. The plan adapts to
  reality; the direction stays his.
