# Portrait Fidelity — G5 (galaxy interaction) + G6 (closeout) — BUILD

**Status:** BUILT + self-verified in `elastic-heisenberg-fa2a77` (clean base `afe1b57` == origin/main, v3.145). **Commits HELD** pending Preston's exact "commit and push." Recon: [portrait-fidelity-g5g6-recon.md](portrait-fidelity-g5g6-recon.md).
**Decisions applied (Preston):** settle = noticeably richer (exceed 1:1); dead-code = full orphaned subtree; trivial extras = emblem mid-ring (yes), THREADS "in M books" = report-only.

---

## G5 — galaxy interaction

| Slice | Files | Change |
|---|---|---|
| No-bond invitation | views.js + components.css | `if (bonds.length === 0)` appends `.portrait-galaxy-invite` inside the galaxy well: *"nothing shares a margin yet — they’ll draw together as your notes start to bridge categories"* (verbatim + typographic). New scoped rule (faint italic serif, `--ink-4`/`--scrim`). Filaments NOT forced. |
| Richer settle | views.js + components.css | Start scale `0.25 → 0.12` (deeper); transition drift `1.4s→1.9s`, scale-in `.9s→1.2s`, opacity `.5s→.6s`. One-time, settles to REST. Reduced-motion media query + `reduceMotion` seed-final branch untouched → still instant. |
| Glow | — | NO CHANGE. Recon: scaling formulas byte-identical to mockup; only the ratified Option-A palette differs (no defect). |

**G5 gates:** cscript PARSE **PASS** · banned-token **= baseline** (catch1/finally0/arrow1/backtick6/const1/let5) · scoped + **no hex** · copy **verbatim + typographic** · umbrella **intact** · reduced-motion **instant**.

## G6 — closeout

| Slice | Files | Change |
|---|---|---|
| A11y focus ring | components.css | Scoped `.account .portrait-*:focus-visible { outline: 2px solid var(--teal); outline-offset: 2px }` for star/tlabel/toggle/pencil/seg-button (focusable) + chip/e-chip/cap-btn (dormant — delegated spans, as in the mockup). **No app-global rule** (bleed-safe). |
| Dead-code removal | views.js + components.css | Removed `_accountOpenMark` + `_accountBuildMarkPanel` (the full orphaned subtree) + `.account-mark-context` + `.account-mark-foot` CSS; fixed the stale comment at the book-detail picker. **0 dangling refs.** |
| Emblem mid-ring tone | views.js | Ring stroke `var(--gold)` → alternate odd rings to `var(--gold-ink)` (deeper), restoring the mockup's gold/deep/gold step over the data-driven 1–4 rings. |
| Soft separators | components.css | `.portrait-ret-row` / `.portrait-thread-row` / `.portrait-mrow` border-top `var(--border)` → `var(--wash)` (mockup used `--line-soft`; spec (a) maps `--line-soft → --wash`). |

**G6 gates:** cscript PARSE **PASS** (628,890 chars) · banned-token **= baseline** · **deletions EXACTLY the dead code** (`_accountOpenMark`/`_accountBuildMarkPanel`/`account-mark-context`/`account-mark-foot`/`account-mark-panel`/`account-mark-open` = **0 refs**; KEEP `_accountEmptyRow`=6 / `_accountBuildPanelHead`=2 / `account-panel-title`=2 / `account-mark-close`=3 / `account-expand-more`=3 all intact) · scoped + **no hex** · umbrella **4/4 intact**.

## Byte deltas (measured before AND after)
| File | Baseline | After G5 | After G6 | Net |
|---|---|---|---|---|
| js/views.js | 630,857 | 631,369 (+512) | 628,890 (−2,479) | **−1,967** |
| assets/components.css | 372,219 | 372,990 (+771) | 373,597 (+607) | **+1,378** |

Scope: only `views.js` + `components.css` dirty; localized hunks (no EOL/whole-file flip). sw.js bump (v3.145→v3.146) happens at ship.

## Honest residuals (report-only — NOT fixed; Preston decides)
- **THREADS per-thread minis** ("that's right"/"dismiss") absent — **RATIFIED** read-only decision (portrait-s3.md:43). Closed, not a regression.
- **THREADS "in {m} books"** clause — omitted (schema stores only `memberNoteIds`); Preston chose report-only.
- **THREADS "a pattern Yumi is still forming"** variant — absent (status-dependent); deferred.
- **Focus ring dormant** on dialogue chips / emblem chips / cap-btns — they're delegated-click spans (no tabindex), exactly as in the mockup. Meaningful rings there need tabindex + keydown = a separate a11y item (not the deferred styling). Stars/toggle/tlabel/pencil/seg get working rings now.
- **MOVEMENT divider** (`.account-revealed` border-top) likely the same `--line-soft→--wash` delta, but it's in the MOVEMENT section (outside the brief's journey/emblem/threads/returns trivial-fix scope) — flagged, not touched.
- **Hero→stance gap** (~40px vs mockup ~14px) — shared already-live #8 hero margin; deferred.
- **COUNTS panel-head** "✕" vs mockup "close ✕" — pre-existing already-live #8 chrome; left.

## Live-verify
**PENDING SHIP** — structural smoke (sw.js=v3.146 server-side; account page renders; console clean; dead code gone; new DOM present) runs after push. Motion/filaments/focus-ring FEEL is Preston's foreground smoke (CC tab can't confirm rAF/0-bond).
