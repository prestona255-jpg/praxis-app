# R-ARC SLICE 1 — the disabled-state law + the silent block (REQ#7a)

**Status: BUILT · LIVE-VERIFIED on the rig · RED-TEAMED (3 BLOCKs, all fixed) · REVIEWED (HOLD, cleared).**
**NOT committed at time of writing — this file rides that commit. NOT pushed.**
Base **`3e6665e`** · `sw.js` v3.210 → **v3.211**. Plan: `docs/r-arc-plan.md` (Slice 1). Forks: plan §4.

## The defect, correctly diagnosed

Preston hit a dead "Create sub-theory →" live, 2026-07-15 ~10:26 PM. **Two hypotheses were falsified
before the true cause was found** — recorded so neither is repeated:

- ❌ *"`createSubTheory` returns null into a swallow."* — No. `notebookCreateSubTheory()` guards first
  (`if (!ids.length || !arcId || !state.arcs[arcId]) { return; }`) and the button is correctly disabled
  (`createBtn.disabled = !canCreate()`). A disabled `<button>` never dispatches `click`.
- ❌ *"Wire `showToast()` at the create path"* (the **plan's own text**) — impossible for the same reason.
  A click-handler toast on a disabled button can never fire; the listener already there is already dead.
- ❌ *"Guidance is missing."* — It isn't. The bar already renders **"No arc chosen"** + a working
  **"Choose an arc"** chip, and "Create an arc first — sub-theories live inside an arc." when `hasArcs`
  is false.

✅ **The cause is purely visual.** `components.css` carried **12** `[disabled]` selectors, **none** for
`.btn`. Every rule painting the button is unconditional, and `.btn`'s own `cursor:pointer` (an author
style) beats the UA's `disabled → cursor:default`. **A disabled primary rendered pixel-identical to a
live one** — full `--grad` gold, beside a label truthfully reading "No arc chosen".
`git log -S"canCreate"` → true since the flow shipped (`e46bd1b`); never had disabled styling.

## The fix

| File | Change | LF-delta |
|---|---|---|
| `assets/components.css` | `.btn[disabled] { opacity:.55; cursor:default; pointer-events:none; }` | +674 B (**rule = 69 B**, band +40…+90 ✅; 605 B comment) |
| `js/views.js` | Path (a) (`#arc/<id>/new-subtheory`) null branch → `showToast()` before `location.replace('#arcs')` | +479 B (**logic = 190 B**, band +150…+400 ✅; 289 B comment) |
| `sw.js` | `praxis-v3.210` → **`praxis-v3.211`** (+1 exactly) | +0 B (same-length string) |

⭐ **`pointer-events:none` is load-bearing.** A CSSOM match test on the live disabled button found the
winner of `cursor`:
`.notebook.lum-amber-deep .btn-primary, .notebook.lum-amber-deep .createbtn { cursor:pointer }` —
specificity **(0,3,0)**, outranking `.btn[disabled]` **(0,2,0)**. `cursor:default` therefore **loses on
the exact surface the only disabled `.btn` lives on**. The working mechanism is **hit-test removal** →
the cursor resolves from the **parent**. Recon's "`.btn`'s cursor:pointer beat the UA default" was
**incomplete**: a second, higher-specificity `cursor:pointer` is scoped to the Notebook.

## Gate findings — what the gates caught (all fixed, none waved)

**`fix-red-team`: BLOCK-COMMIT ×3 + 4 concerns. `praxis-reviewer`: HOLD ×2.** Every one was real:

| # | Finding | Resolution |
|---|---|---|
| **B1** | **The shipped CSS comment stated a FALSIFIED premise.** It cited `.btn-primary:hover (0,4,0)` and claimed the mechanism was "suppressing the hover STATE" — but **no `:hover` rule declares `cursor` on a `.btn` at all**; the real winner is a **non-hover** rule at (0,3,0), and the real mechanism is hit-test removal. Written from the hypothesis and never corrected after the probe disproved it. **Load-bearing wrong**: the next reader greps `:hover`, finds nothing, calls the comment stale, deletes `pointer-events:none`, and the bug returns. | **Comment rewritten** to the measured truth. CSS re-probed after the rewrite: `ruleParsed:1`, `decls:"opacity: 0.55; cursor: default; pointer-events: none;"` — the rewrite did not swallow the rule. |
| **B2** | **No `sw.js` bump → `hooks/pre-commit` rule #3 would hard-BLOCK** ("source files staged without sw.js"). The plan's own T8 said "once at the final push", which contradicts the armed hook. | **Bumped v3.210 → v3.211.** `--no-verify` rejected: CLAUDE.md says never skip hooks unless Preston asks; the overnight `--no-verify` carve-out is his, and is for overnight batches. Plan T8 corrected. |
| **B3** | **The checkpoint's status header was FALSE** — claimed "Committed LOCAL" when nothing was committed, and cited base `03e2da0` instead of `3e6665e`. | **Rewritten** (this file). No commit is claimed before it exists. |
| **C4** | **The ternary lied in one quadrant.** `createSubTheory` guards the **arc before auth**; the old branch tested auth, so *signed-out + arc-absent* said "Sign in to start a sub-theory" — which would not fix it. | **Re-ordered to match the guard**: `nsArcOk` tests the arc first. |
| **C5** | **Residual #3 overstated the blast radius** ("a look change everywhere"). | **Corrected** — see the sweep below. Exactly **one** control. |
| **C6** | **`.chip` has no `[disabled]` law** — the sibling primitive in the same block. No live defect (both disabled chips are covered by per-class rules), but "the family law" implied completeness. | **Named as a future item** below, with its trap. |
| **C7** | **Byte deltas were CRLF-raw, not LF-normalized** as §3 requires. | **Re-measured LF-normalized** (table above). Both still in band. |
| **R9** | The plan's "sweep every `.btn-primary` in the app" gate was **not evidenced** by the 2-control table. | **Sweep run first-hand** below. |

## App-wide sweep — every element that is BOTH `.btn` AND ever disabled

Exhaustive search (word-boundary discipline — the bare `btn` **token**, not a substring):
- `\.disabled\s*=` across `js/` → **44** sites
- `setAttribute\(["']disabled` across `js/` + `*.html` → **0**
- Cross-referencing each site's `className`:

| Candidate | className | Verdict |
|---|---|---|
| `createBtn` (`views.js`, notebook gather bar) | `'btn btn-primary'` | ✅ **the only true `.btn`** |
| `btn` @ `views.js:8148/8152` | param of `handleShelfScanFile(input, btn)`; caller passes `scanBtn` = `'chip shelf-scan-btn'` | ❌ a **chip** |
| `btn` @ `voice-input.js:111` | param of `attachMicButton(btn)`; callers pass `'yumi-mic-btn yumi-icon-btn'` | ❌ token is `yumi-mic-btn` |
| `micBtn` / `unpub` | `'yumi-mic-btn …'` / `'arcfield-pub-btn …'`, `'op-pub-btn …'` | ❌ substring only — **grep false positives**, no bare `btn` token |

**Result: exactly ONE element in shipped app code is both `.btn` and ever disabled — `createBtn`.**
Independently reached by the red-team and the reviewer, then verified first-hand here. The rule is a
sound **law for the future**; its present effect is **one button**.

## Mechanical gates — ALL PASS

| Gate | Result |
|---|---|
| Parse (T6) | `PARSE OK: js/views.js` · `PARSE OK: sw.js` |
| Bytes (LF-normalized, §3) | views **logic 190 B** / band +150…+400 ✅ · css **rule 69 B** / band +40…+90 ✅ · sw **+0** ✅ |
| Classification | overage is **comment-only** — both logic lines printed and verified; 0 CSS declarations hide in the comment block. Logic in band; **band never widened.** |
| Greps | `.btn[disabled]` = **1** ✅ · `showToast(` = **6** ⚠ investigated: **recon undercounted** (4 pre-existing calls, not 3) + line drift from this edit. 1 def + 4 + 1 mine = 6. Code right, expectation wrong. *(Line numbers deliberately not cited — zero-line-number-trust.)* |
| ES3 | 0 hits for `const`/`let`/`=>`/backtick/`class` in added lines ✅ |
| EOL | `git ls-files --eol` → `i/lf` on all three ✅. `sw.js` committed blob CR count **0 before and after** — the Edit-tool CRLF gotcha is immaterial here (the blob is LF regardless). |
| Diffstat | css 9+/0− · views 6+/0− · sw 1+/1− ✅ |
| Scope | only the 3 intended files + this checkpoint ✅ (explicit paths — `git add -A` stages ~100 strays) |
| Byte-locks (T7) | lumen-amber **14,681** ✅ · marks.js **10,255** ✅ |
| Hook | `hooks/pre-commit` rule #3 now satisfied (sw.js rides the commit) ✅ |
| Tripwires | T1/T3/T4/T5 **n/a, verified true** (0 `status`/`seed` hits in the diff; yumi-brain + arc-constellation + tradition-forms-arc `git status` clean). T2 **n/a** (yumi-brain untouched). **T9 relevant**: this edits one of the 3 creation paths but retires none — Slice 4 owns that. |

## Live verification — the rig (`.claude/rig/`, LOADED not rebuilt)

`serve.ps1 -Port 8793` (fresh port, no urlacl) · `seedRig({signedIn:true})` → `auth:stubbed:d0tester`,
SW unregistered, caches deleted · **`cssRuleLive: 1`** — the rule is in the *served* sheet, so this
measures the real bundle, not a stale SW copy.

**Preston's exact scenario reproduced:** one bookless capture → Inbox → real `.notebook-entry-gather`
click → bar reads **`"1 gathered · No arc chosen | Choose an arc | Create sub-theory →"`**.

| Probe | @1280 | @390 |
|---|---|---|
| `disabled` (own state) | `true` | `true` |
| computed `opacity` | **0.55** ✅ | **0.55** ✅ |
| computed `pointer-events` | **none** ✅ | **none** ✅ |
| computed `cursor` **on the button** | `pointer` ⚠ *(outranked — moot, see below)* | — |
| **`elementFromPoint` at its centre** | **`DIV.nb-gather`** — hit-testing **SKIPS the button** ✅ | — |
| **cursor the user ACTUALLY sees** | **`auto`** (the parent's), not pointer ✅ | — |
| click reaches handler | **false** ✅ | — |
| tap target | — | **44px** preserved ✅ |
| **LIVE `.btn` untouched** | "Capture" → opacity **1**, pe **auto** ✅ | — |
| **revives when an arc is chosen** | opacity **1**, pe **auto**, `disabled:false`, hit-test → **THE BUTTON (clickable)** ✅ | — |

The own-state + hit-test pairing is deliberate (DWF-1): a global-only probe would score this fixed while
the user still saw a pointer cursor; a computed-cursor-only probe would score it **BROKEN when it is
not**. Both directions, or the gate manufactures phantoms and misses real ones.

## Residuals — honest

1. **VISUAL GATE OWED — Preston's eyes.** The Browser pane renders at a dpr making the shot illegible
   (~0.17 scale) and **region-crop zoom is unsupported**, so no screenshot worth judging exists.
   Computed styles never prove a look. **This closes on the deployed build, not before.**
2. **`cursor:default` in the new rule is functionally inert.** `pointer-events:none` already routes
   hit-testing to the parent, so the declaration never decides anything. Kept for family idiom
   (`.otp-follow`/`.itx-send`/`.op-pub-confirm`); the comment says so, so it cannot mislead.
3. **Blast radius is ONE control today** (corrected from "everywhere" — C5). The law applies app-wide but
   only `createBtn` is ever both `.btn` and disabled. Preston's VISUAL GATE has exactly one place to look:
   the Notebook gather bar with notes gathered and no arc chosen.
4. **`showToast` on path (a) is UNVERIFIED live.** Reaching it needs a stale `#arc/<bad-id>/new-subtheory`
   deep link or a signed-out caller. Code-read + reviewer-traced only (`showToast` is a hoisted top-level
   declaration in the same file; the toast mounts to `document.body` `position:fixed` and survives the
   same-document hash nav). **Flagged, not claimed.**
5. **`.chip` has no `[disabled]` law** (C6). No live defect — the two disabled chips (`shelf-resolve-covers-btn`,
   `shelf-scan-btn`) are covered by per-class rules. **The next disabled `.chip` added gets no disabled
   state, silently.** ⚠ **Trap for whoever extends the law:** `scanBtn` carries a `title` tooltip **and**
   gets disabled — `pointer-events:none` would suppress that native tooltip. Extending `.btn`'s law to
   `.chip` verbatim breaks it. **Named as a future item, not absorbed here.**
