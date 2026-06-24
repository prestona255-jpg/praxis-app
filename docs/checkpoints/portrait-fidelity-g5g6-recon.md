# Portrait Fidelity — G5 (galaxy interaction) + G6 (closeout) — Stage 0 RECON

**Status:** RECON COMPLETE — read-only, no app files touched. Awaiting Preston's go-ahead + decisions below.
**Base:** worktree `elastic-heisenberg-fa2a77`, clean, HEAD `afe1b57` == origin/main (**v3.145**). ⚠ brief names `peaceful-joliot` as the lane (also clean at `afe1b57`); base-identical, diffs are the same — confirm intended lane before any commit.
**Target:** `praxis-portrait-mockup-v6-instrument.html` (851 lines, untracked Desktop ref — never staged).
**Method:** direct read of all anchors + a 5-agent adversarial full-page fidelity fan-out (RETURNS / THREADS / JOURNEY / EMBLEM / whole-page SWEEP), each delta personally spot-verified.

---

## Pre-state baselines (afe1b57 / v3.145)

| File | Bytes | Notes |
|---|---|---|
| js/views.js | 630,857 | portrait code ~12275–13800 |
| assets/components.css | 372,219 | `.account .portrait-*` 7282–8120 |
| assets/theme.css | 23,158 | not expected to change |
| sw.js | 4,816 | `CACHE_VERSION = 'praxis-v3.145'` → bump to v3.146 at ship |

**views.js banned-token baseline (post-edit must NOT increase):** `.catch`=1 · `.finally`=0 · `=>`=1 · backtick=6 · `\bconst\b`=1 · `\blet\b`=5. (Higher than the older fidelity-spec figures because v3.143–v3.145 portrait code added comments/strings; afe1b57 is the live baseline.)
**Parse policy:** views.js → `.claude/parse-check-views.js` (cscript false-FAILs on its 1 `.catch`). components.css/theme.css/sw.js → full-diff (no JS parse needed for CSS; sw.js is promise-free → cscript OK).

---

## G5 — galaxy interaction

### Bond count (gates the filament work)
- Bonds = notebook entries whose `bookIds` span ≥2 groupings (traditions for categories-axis / userThemes for lenses-axis), computed in `_portraitAxisData` (views.js:12351–12387).
- **Cannot be computed headless** (live-data dependent). Brief itself expects ~0 for Preston. **The implementation is already data-driven:** filaments + partner-brighten draw on hover IFF `bonds.length > 0` (the `lite()` handler at views.js:12656–12699 sets `.portrait-bonds path.show` + `.portrait-star.hi`; paths are built per-bond at 12615–12623). So the filament drawing is NOT broken — it simply has nothing to draw at 0 bonds.
- **DECISION (per brief):** do NOT force filaments. Add the **no-bond INVITATION line** when `n > 0 && bonds.length === 0`. Verbatim copy (brief): *"nothing shares a margin yet — they'll draw together as your notes start to bridge categories"* (typographic apostrophe → "they'll"; `.account .portrait-*`-scoped). Proposed mount: in the galaxy-readout / a `.portrait-galaxy-invite` line under the help, shown only in the 0-bond branch.

### Settling drift-in
- Live `.account .portrait-star` transition (components.css:**7619**) is **byte-identical to the mockup** `.star` (lines 162-163): `left 1.4s cubic-bezier(.22,.61,.36,1), top 1.4s …, transform .9s …, opacity .5s, box-shadow .25s, filter .25s`.
- JS: stars seed centered at `scale(0.25)` opacity `0`; double-rAF → `place()` to final pos/scale(1)/opacity (views.js:12638–12654). Force-sim (`_portraitGalaxyLayout`) params byte-identical to the mockup (440 iters, etc.).
- **Reduced-motion CONFIRMED instant:** `@media (prefers-reduced-motion: reduce){ .account .portrait-star{ transition:none !important } }` (7687-7689) + initial inline style already seeds final op/scale when `reduceMotion` → no drift.
- ⚠ **"More pronounced" = EXCEED the mockup, not match it** (live already matches). This is a design-partner enhancement beyond the 1:1 port. Proposed (one-time, settles to REST, reduced-motion still instant): lengthen position drift (e.g. 1.4s → ~1.9s), deepen the start (scale 0.25 → ~0.12 and/or seed from a tighter central cluster), optional gentle per-star `transition-delay` stagger by index. **NEEDS Preston's nod that exceeding the 1:1 mockup is intended** (it deviates from the fidelity-spec "PORT, do not re-author" rule).

### Galaxy glow
- JS scaling formulas (`hiPct 0.28+br*0.5`, `glow 10+br*30`, `galpha 0.22+br*0.42`, `op 0.82+br*0.18`; views.js:12628) are **byte-identical** to the mockup (line 729). Structure faithful (color-mix equivalents of the mockup's rgba). **No scaling/structural defect.**
- The only difference is the ratified **Option-A token palette** (deeper teal `--teal #2e8a93` vs mockup `#4FBBA0`; gold `--gold #d2a23e` comparable/brighter than `#CBA862`).
- **RECON FINDING: NOT muted by a formula defect.** Whether it "reads muted" is a token-brightness visual call on the live render — Preston's eye. **Recommend NO change** (changing re-introduces deviation/hex over a faithful port). Conditional G5 item ("only if recon found it muted") → recon did not.

---

## G6 — closeout sweep

### A11y focus ring (deferred `:focus-visible`)
- Current state: **no visible ring** on portrait controls. The only portrait `:focus-visible` is `.account .portrait-pencil:focus-visible { opacity: 1 }` (components.css:10183) — an opacity bump, not an outline.
- Mockup had a **global** `:focus-visible{outline:2px solid var(--teal); outline-offset:2px}` (line 252), deferred to avoid app-global bleed.
- **Plan:** add a **scoped** teal ring under `.account .portrait-*` for: `.portrait-star`, `.portrait-toggle`, `.portrait-chip` (dialogue confirm/rename/dismiss), `.portrait-pencil` (ring atop existing opacity), `.portrait-e-chip` (emblem strands), `.portrait-cap-btn`, `.portrait-tlabel`, stone controls. **NO app-global rule** (bleed risk — the reason it was deferred).

### Dead-code removal — EXACT set (zero-ref proven)
**DELETE:**
| Item | Location | Proof |
|---|---|---|
| `_accountOpenMark` (+ doc comment) | views.js **11384–11398** | 0 callers (only a stale comment mention at 10143) |
| `_accountBuildMarkPanel` (+ doc comment) | views.js **11400–11444** | sole caller was `_accountOpenMark`:11393 → orphaned on its removal |
| `.account-mark-context` | components.css **8282–8288** | sole ref was inside `_accountBuildMarkPanel` (11429) |
| `.account-mark-foot` | components.css **8289–8296** | sole ref was inside `_accountBuildMarkPanel` (11440) |
| stale comment fix | views.js **10143** | drop the `_accountOpenMark` name from "Mirrors _accountOpenMark's reveal." (comment-only) |

**KEEP (proven shared/live — must NOT remove):** `_accountEmptyRow` (7 uses incl. COUNTS panels 11616/11634/11654/11669/11686) · `_accountBuildPanelHead` (COUNTS 11623) · `account-panel-title` CSS (COUNTS 11623) · `.account-mark-close` CSS 8269-8281 (used by shared `_accountBuildPanelHead`) · `account-expand-more` (`_accountMoreLink` 11457). `account-mark-panel` / `account-mark-open` are class strings with **no CSS rule** → nothing to delete in CSS.

⚠ Brief literally names only `_accountOpenMark`; the full orphaned subtree above is "EXACTLY the dead code" (each piece is reachable ONLY from `_accountOpenMark`). Removing only `_accountOpenMark` would leave `_accountBuildMarkPanel` + the 2 CSS rules as new dead code, so the coherent removal is the whole subtree. **Confirm scope = full subtree.** (G3 commit `c04cbd6` already removed the constellation-slot CSS + `_accountBuildConstellationData`, explicitly leaving `_accountOpenMark` "for later" = this G6.)

### Full-page fidelity pass — deltas (5-agent fan-out, each spot-verified)

**JOURNEY:** ✅ no deltas. Faithful (eyebrow, help line, season structure, ::before gold-dot + open-end dashed pseudos, :last-child reset — all verbatim/correct).

**RETURNS:** ✅ faithful. The only "delta" raised (eyebrow reuses `account-values-eyebrow`) is the **deliberate cross-section shared selector** (every portrait eyebrow uses it) → **NOT a delta, dismissed.**

**CANDIDATE G6 TRIVIAL FIXES (in journey/emblem/threads/returns scope):**
1. **Soft separators use the wrong token** (CONFIRMED). Live `.portrait-ret-row` (7816) and `.portrait-thread-row` (7930) border-top = `var(--border)`; mockup `.ret-row`(175)/`.thread-row`(194) = `var(--line-soft)`. Spec (a) maps `--line-soft → --wash` (rgba .08), not `--border` (rgba .18) → hairlines ~2× heavier than intended. **Fix: `var(--border)` → `var(--wash)` on those soft separators** (verify each rule's mockup origin was `--line-soft` not `--line`; keep `--border` on card borders / `.season` border-left). Token-only, scoped, no hex.
2. **Emblem mid-ring tone flattened** (CONFIRMED). `RING_SLOTS` all stroked flat `var(--gold)` (views.js:12871); mockup mid-ring was darker `#9C7F45` (spec R6 → `--gold-deep`, which **does not exist** in theme.css; nearest = `--gold-light`). Rings are now data-driven (1–4), so the mockup's fixed 3-ring tone doesn't map cleanly. **Optional:** stroke alternating/even rings with `var(--gold-light)` (no new token) to restore depth — **or report as an accepted flat-gold simplification.** Preston's call (judgment, not a clean 1:1).

**REPORT-FOR-PRESTON (SUBSTANTIAL / out-of-tidy-scope — do NOT auto-fix):**
- **THREADS per-thread minis ("that's right"/"dismiss") absent** — agent SUBSTANTIAL, but this is a **RATIFIED decision**: portrait-s3.md:43 — *"Threads = read-only display in the portrait (no per-thread keep/dismiss minis); thread management stays in the existing reader-model section."* → CLOSED, not a G6 fix.
- **THREADS subline omits "in {m} books"** (live shows only "noticed across N notes"; views.js:13664) — spec (b):153 template includes it; thread schema stores only `memberNoteIds` (no book span). Derivable display-only (map noteIds→note.bookIds, count distinct), but net-new derived data in the interpreted layer. **Preston decides: derive-to-match-template, or ratify the simpler subline.**
- **THREADS "a pattern Yumi is still forming" forming-variant absent** — TRIVIAL, schema-status-dependent (`status==='noticed'` vs `'named'`); low value, interpreted-layer. **Lean: defer/report.**
- **Hero→stance gap ~40px vs mockup ~14px** — `.account-hero.account-card` margin-bottom:40px (components.css:7299) is **shared already-live #8 hero chrome** governing hero→content spacing page-wide; tightening it risks the broader layout. **Lean: defer** (reads fine).
- **COUNTS panel-head "✕" vs mockup "close ✕"** — pre-existing **already-live #8** chrome (account hub CLOSED); all-caps eyebrow already matches the mockup's CSS-uppercased tag. **Lean: leave** (outside portrait-fidelity scope).

---

## Proposed G5 + G6 work order (on go-ahead)

**G5:** (a) no-bond galaxy INVITATION line; (b) richer settle (pending the "exceed-mockup" nod); (c) glow — recommend NO change. → verify battery → commit.
**G6:** (a) scoped `:focus-visible` teal ring; (b) dead-code subtree removal (pending full-subtree scope confirm); (c) trivial fixes: soft-separator `--wash` (+ emblem mid-ring tone pending Preston). → verify battery → commit.
**Ship:** both PASS → bump `CACHE_VERSION` v3.145 → v3.146, commit, push (PRESHIP=afe1b57; revert armed) → structural smoke → HALT for Preston's foreground smoke.

## Decisions needed before build
1. **Lane:** build here (`elastic-heisenberg-fa2a77`) or switch to `peaceful-joliot`? (base-identical)
2. **Settle:** confirm "more pronounced" = intentionally EXCEED the 1:1 mockup.
3. **Dead code:** confirm removal = the full orphaned subtree (`_accountOpenMark` + `_accountBuildMarkPanel` + 2 CSS rules), not only the literally-named `_accountOpenMark`.
4. **Emblem mid-ring tone:** restore via `--gold-light`, or ratify flat-gold? (the other trivial fixes — invitation line, soft-separator `--wash`, focus ring — proceed without a decision.)
5. **THREADS "in {m} books":** derive to match the template, or ratify the simpler subline?
