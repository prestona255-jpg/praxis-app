# Praxis — build agent guide

## Project
Praxis: vanilla-JS theory-publishing platform with an AI persona, Yumi. Pure static site on Netlify; Firebase/Firestore backend. Live: praxis-reading.netlify.app. Work directly on `main` (no worktrees, no branches).

## How we work
Two tools: a Claude chat is the design partner and brief author; you (Claude Code) are the executor. Engineering mode — lead with the conclusion, work in staged briefs with PASS/FAIL checkpoints, never bundle unrelated changes into one commit.

## Conventions — hard rules
- `var` and `function` only. No `const`, `let`, arrow functions, `class`, or template literals.
- String concatenation, not template strings. Callback-style `.then()` chains.
- CSS variables only — no new hardcoded hex (the code already uses `var(--token)` in SVG fills).
- localStorage only via the `ls(key, default)` / `sv(key, value)` wrappers.

## File load order
state → integrations → yumi-brain → arcs → arc-constellation → tradition-forms-arc → voice-input → yumi-ui → views → app
(arc-constellation and tradition-forms-arc load before views.)

## Environment & deploy
- Node is blocked on the Windows machine — never run `npm` or `node`. The cscript JScript parse harness is ES3: it cannot parse files using `.catch`/`.finally`, so it only validates promise-free files like state.js. Verify integrations.js, yumi-brain.js, and sw.js on the live deploy, not the harness.
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
  - any parse check FAILs (cscript harness for promise-free files;
    parse-check-views.js for views.js; full-diff for harness-exempt)
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

## Design canon — full-app redesign (mobile + desktop) — added June 2026

The single source of truth for the full-app responsive restyle (global shell, Home,
Shelf, Arcs, Account, Book detail, Arc/constellation, Notebook). **Governance order:**
this canon > the two mockups (`design/praxis-full-app-mockup.html` = mobile,
`design/praxis-desktop-mockup.html` = desktop) > everything else. Where this canon names
a supersession of `docs/design-spec.md` (§5), this canon wins **for this build**;
elsewhere design-spec.md and the mockups still stand. The mockups are
**layout/style references only** — never copy their approximate hexes or their sample
text (arc names, marginalia, the 112/2/7/2 stats, book titles); wire the real tokens (§1)
and pull all content from live state.

### 1. Tokens — wire these real `theme.css` vars (never the mockup hexes)

- **Fonts (3):** `--font-serif` = `'Cormorant Garamond', Georgia, 'Times New Roman', serif`
  (titles, prose, italics); `--font-body` = `'DM Sans', -apple-system, …, sans-serif`
  (body, nav, buttons, hero H1); `--font-mono` = `'DM Mono', 'SF Mono', Menlo, Consolas, monospace`
  (eyebrows, labels, meta, desktop nav links per §4-B).
- **Surfaces:** `--surface #ecdcae` (card fill) · `--surface-2 #f2e6c2` (lighter card) ·
  `--color-surface` = `var(--surface)` (page fill / mobile panels) · `--bg #d8bd80` ·
  `--bg-2 #e3c98c` · `--sunk #c9a85f` · `--glass rgba(245,233,200,.5)` ·
  `--glass-2 rgba(245,233,200,.82)` · `--glass-spotlight rgba(245,233,200,.94)`.
- **Page ground** (`body::before`, viewport-fixed — keep the anchoring):
  `radial-gradient(1100px 560px at 50% -6%, #e6cb8e, #d8bd80 55%, #c4a35a 100%)` over flat
  `#c4a35a`.
- **Inks:** `--ink #2a1810` · `--ink-2 #5c3e26` · `--ink-3 #7a5c34` · `--ink-4 #9a7e4e` ·
  `--br-deep #4a2810` · `--text-on-dark #fdfaf3` (text on dark / gradient fills).
- **Gold:** `--gold #a8741a` · `--gold-light #c5912b` · `--gold-text #6b4516` ·
  `--wordmark #8a5e15`.
- **Primary gradient:** `--grad linear-gradient(92deg,#b8841f,#27566a)` (primary buttons,
  avatar, gradient-clip "theory."). The mockups' `135deg #b58f3f→#46707c` is approximate —
  use the real 92° token.
- **Lines / accents:** `--border rgba(58,40,16,.2)` · `--line-2 rgba(58,40,16,.32)` ·
  `--wash rgba(58,40,16,.1)` · `--river #27566a` · `--marginalia-color #1d8f68` (teal) ·
  `--danger #9c3f1c`.
- **Radii:** `--radius-sm 6px` · `--radius-md 10px` · `--radius-lg 16px` ·
  `--radius-xl 22px` · `--radius-pill 999px`.
- No new hardcoded hex: reuse the nearest token, or add one to theme.css with a comment —
  never inline a literal in components.css.

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

- One commit per stage, all **local**; nothing is pushed until Preston's exact "push." A
  single SW bump happens at the final push: **`CACHE_VERSION` v3.107 → v3.108** (live is
  already v3.107 from the mobile-fixes commit `ebba9d6`; do NOT target v3.107).
- The two functional fixes (Arcs "Your arcs" list; picker `scrollIntoView`) are already
  shipped at v3.107 — they are **verify-only**, not build. Fix #1's card *styling* to §4-G
  is the one residual, folded into the Arcs stage.
