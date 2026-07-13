# Overnight batch — morning report (2026-07-13)

**Items run:** ON-1 · ON-4. **ON-7 does not exist** (the queue holds ON-1/2/4/5/6;
the "ON-1/4/7" label names a nonexistent third item — already flagged in
`docs/checkpoints/r8-values-recon.md:16`). Documented no-op, no work.

**Result:** ON-1 **PASS** · ON-4 **PASS** (both `felt-pass-required` — NOT closed;
they await Preston's morning felt pass + push). Batch ran under the overnight law:
reproduce-first, one independent commit per item, **committed `--no-verify`**,
**zero `sw.js` touches, no cache bump** (the CSS/copy reaches clients at Lane G's
v3.201 bump — Preston's Q1 ruling, 2026-07-13). `prestona255` never touched;
verification ran on the deployed v3.200 render (DOM-geometry only — screenshots
hang in this rig).

**Commits (local, unpushed — Preston pushes):**
- `ebc1ff2` — R9b Lane P live-smoke evidence recorded (docs-only; the pre-batch
  clean-tree commit of the one stray modified file, per Preston's step 0).
- `0c7fbd4` — ON-1 (components.css + views.js; `--no-verify`; no sw.js).
- `a8a851a` — ON-4 (index.html; `--no-verify`; no sw.js).

---

## ON-1 — Menu overlay bleed → PASS (felt-pass-required)

**Reproduced (live 390, deployed v3.200):** the open hamburger menu
(`.app-nav.app-nav-mobile-open .app-nav-list`, components.css:5278) was a
content-height `position:absolute; top:56px` dropdown with no `height`/`bottom`
and no scroll-lock. Measured: list height **350px in an 812px viewport**,
`coversToViewportBottom:false`, **398px of shelf exposed beneath**,
`body overflow: visible` (page scrollable behind). The toggle
(`initNavMobileToggle`, views.js:334) only toggled the class — no body lock.

**Fix (one commit `0c7fbd4`, two files):**
- `components.css` — the open list now fills the viewport below the bar:
  `height: calc(100vh - 56px)` + `overflow-y:auto` +
  `-webkit-overflow-scrolling:touch` + `padding` bottom safe-area inset; the
  obsolete `border-bottom` dropped. Kept `position:absolute; top:56px` (the
  nav-relative context is immune to the 8px body margin — see Discovery 1).
- `views.js` — the hamburger toggle locks `document.body.style.overflow='hidden'`
  on open and clears it on close. `renderRoute` already clears overflow +
  removes the open class on every route change, so every close path releases it.
  Reuses the app's proven Manage-sheet lock mechanism (MW-1 P1 reference).

**Verified (live 390, new rule injected + measured):** list height **350 → 788px**,
`coversToViewportBottom: true`, **398px exposed → 0** (−40px overshoot, clipped by
the lock), `overflow-y:auto`, opaque bg, `body overflow: hidden`.

**Mechanical gates:** bytes **components.css +436** (649774→650210), **views.js
+410** (942054→942464); grep `border-bottom:1px solid var(--border)` **12→11**,
`document.body.style.overflow` **4→6**; new props present; `PARSE OK` (cscript
JScript, views.js); diffstat 16 ins / 2 del — no EOL flip.

**Felt-pass notes:** the full-viewport menu reads as a full-screen takeover (empty
space below the ~5 items + profile row) — an intentional coverage design, but
Preston's eyes decide the aesthetic. The Yumi bloom orb (z-9999) still floats over
the menu on mobile by the z-index ledger (pre-existing; not touched).

---

## ON-4 — Header search placeholder truncates → PASS (felt-pass-required)

**Reproduced (live, deployed v3.200):** the nav search placeholder
"Search books, authors, ideas…" measures **178.6px** but the recessed field's
`<input>` content box is only **137px** → clips **~41.6px** ("…autho…"),
**constant at 768 and 1280** (the clip is the input's intrinsic ~137px width, not
space pressure). No intervening commit touched the rule (`-S` history = pre-R7
only). Showing it whole needs **+41px**, but at 768 the nav already runs
**−28.6px slack with an 8px document h-scroll** (Discovery 2) — it cannot widen.
A sizing-only fix cannot satisfy "reads whole at all widths"; per Preston's Q2
ruling the fix **shortens the copy**.

**Shortlist (canvas measure @ 13px DM Sans, field content box = 137px; the ⌘K
badge is a separate element, untouched):**

| candidate | px | reads whole (≤137) | margin |
|---|---|---|---|
| `Search books, authors, ideas…` (BEFORE) | 178.6 | no | −41.6 |
| `Search books, authors…` | 140.5 | no | −3.5 |
| `Search books & ideas…` | 137.3 | no | −0.3 |
| `Search your library…` | 119.5 | yes | +17.5 |
| **`Search your shelf…`  ← SHIPPED** | **110.6** | **yes** | **+26.4** |
| `Search your shelf` | 103.7 | yes | +33.3 |

**Shipped (commit `a8a851a`):** `index.html` placeholder
`"Search books, authors, ideas…"` → `"Search your shelf…"` (`&hellip;` entity kept).
Chosen for Preston's named "shelf" register + the app's own nav label "Shelf" +
a safe +26.4px margin. **Longest-that-fits alternative = `Search your library…`**
(+17.5px). Touches `index.html` markup (not CSS) — sanctioned by the shorten-copy
ruling. The spotlight ⌘K **overlay** input (spotlight.js:310) is a separate
full-width field and was left unchanged.

**Verified (live 768, narrowest desktop where the field shows — it is
`display:none` <760):** `Search your shelf…` = 110.6px in the 137px box →
`readsWhole: true`, **+26.4px margin**. Field width is viewport-invariant
(content box = 137px measured at 768/1000/1280), so it reads whole at every
desktop width.

**Mechanical gates:** true content delta **−11 bytes** (LF blob HEAD~1→HEAD:
6843→6832); diffstat 1 ins / 1 del (single line); old placeholder absent (0),
new present (1); overlay string intact (2 in spotlight.js).

**Felt-pass call:** the final string is Preston's — swap to `Search your library…`
(or any listed candidate) is a one-line revert either way.

---

## Discoveries — out of scope, bucketed (NOT fixed tonight)

1. **Unreset 8px UA `<body>` margin → NAMED HANDOFF TO LANE G STAGE 1.**
   The deployed site's `<body>` computes `margin: 8px` (unreset UA default) — an
   app-wide 8px gutter; the nav bar sits at y8–65, `#app` at y65. This is a **D3
   root-cause candidate**: Lane G Stage 1's occupancy/no-h-scroll gates run at
   1280/1440/1920 and should **verify-then-fix** it there (Preston's ruling). Do
   not fix on the overnight rail.

2. **Nav h-scrolls 8px at ~768px → DW-wave ledger line.**
   At 768 the top nav's children (wordmark 51 + search 210 + list 442 + gaps)
   sum to ~738.6px vs 710px inner width → **−28.6px slack, `document.scrollWidth`
   8px over `clientWidth`**. A pre-existing narrow-desktop D3 micro-violation,
   independent of ON-4; **Desktop-Wave (DW) candidate.** (Related to Discovery 1's
   8px body margin — both feed the DW/Stage-1 D3 work.)

---

## Runs ledger (also appended to `docs/studio/overnight.md` §C)

`2026-07-13 · items: ON-1, ON-4 · ON-1 PASS · ON-4 PASS · report:
docs/checkpoints/overnight-on1-on4-2026-07-13.md`

## Residuals / owed
- Both items `awaiting-felt-pass` — Preston's morning felt pass (mobile menu
  coverage look; ON-4 final string) + his push close them.
- `overnight.md` statuses flipped queued→awaiting-felt-pass; the **Builder regen**
  rides Lane G's round close-out (per handoff §7 — not run on the overnight rail).
- After Preston's push, Lane G Stage 0 re-runs its gates from the top; **this
  report satisfies the "ON-1/4/7 morning report exists in docs/checkpoints/"
  gate.**
