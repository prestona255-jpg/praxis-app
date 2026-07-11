# R8 — Values · Reviewer verdict

**Reviewer:** praxis-reviewer (independent, code-level verification against `git diff f6c3a5a..HEAD`, HEAD = `fad3e57`).
**Builder self-report graded:** `docs/checkpoints/r8-values.md` + `docs/checkpoints/r8-values-recon.md`.
**Spec graded against:** `docs/studio/mockups/values.html`.

## VERDICT: HOLD

One blocking defect (a real, quantified WCAG contrast failure on the round's flagship new UI component, on all three of its mount surfaces), plus two lower-severity rule violations and two self-report accuracy misses. Nothing here requires re-architecture — the fix is additive CSS (a token re-point), consistent with how four sibling surfaces already solved the identical problem — but it must ship before commit.

---

## Gate-by-gate (system protocol gates)

**1. ES3 sweep — PASS.**
Added-lines-only sweep across all four touched JS files for `const`, `let`, `=>`, bare `class` keyword, and backticks: **0/0/0/0/0**.
```
git diff f6c3a5a..HEAD -- js/ | grep -nE '^\+[^+]' | grep -E '\bconst\b|\blet\b|=>|\bclass\b|`'
```
returns nothing. Whole-file grep counts (const/let/=>/class/backtick) are byte-identical base-vs-HEAD for state.js, views.js, yumi-brain.js; intros.js shows `class` +6, all six are `class="ij-vchip..."` HTML-attribute string literals (js/intros.js:60-73), not the reserved word — confirmed by grepping added lines and excluding `class="`. `Array.isArray` appears in the new state.js code (S1) but is pre-existing codebase convention (20 prior uses in state.js, 16 in views.js) — not a new-syntax violation.
Independent parse-check (cscript JScript, not the builder's self-report): `PARSE OK` on all four files, matching the builder's claim.

**2. Foundation locks — PASS.**
`assets/lumen-amber.css` = 14,681 B, `assets/marks.js` = 10,255 B — unchanged (`git diff f6c3a5a..HEAD` on both files is empty; `ls -la` confirms byte sizes).

**3. Byte deltas — FAIL (self-report accuracy; shipped content independently verified correct).**
The checkpoint's per-slice "bytes" column is actually `git diff --numstat` (line insertions/deletions), not measured byte deltas, and two of the six slices misreport even that:
- S4: checkpoint claims `views.js +145/-1`. Actual (`git show 34c1e97 --numstat`): **`144 1 js/views.js`** — insertions off by 1.
- S6: checkpoint claims `intros.js +86/-3`. Actual (`git show fad3e57 --numstat`): **`83 3 js/intros.js`** — insertions off by 3.
All other four slices' numstat self-reports match exactly (S1 32/0, S2 63/0+6/0+223/0, S3 19/0, S5 83/2).
True LF-normalized byte deltas (never reported by the builder at all; measured via `git show HEAD:<file> | wc -c` vs `git show f6c3a5a:<file> | wc -c`, base-of-round to HEAD): `js/state.js` +1,733 B (157,149→158,882) · `js/views.js` +19,812 B (831,219→851,031) · `js/yumi-brain.js` +5,969 B (131,534→137,503) · `js/intros.js` +4,328 B (33,817→38,145) · `assets/theme.css` +497 B (22,674→23,171) · `assets/components.css` +10,682 B (614,316→624,998).
Severity: low — every diff line was independently read in full; nothing is missing or extra, only the self-report arithmetic is off.

**4. EOL — PASS.**
`git ls-files --eol`: components.css and intros.js are `i/lf w/lf`; theme.css, state.js, views.js, yumi-brain.js are `i/lf w/crlf`. `.gitattributes` is untouched in this diff (confirms the convention wasn't altered), and per-file added/removed line counts are small relative to total file line counts (e.g. state.js +32 of 3,444 lines) — no whole-file EOL-flip signature. `git diff --check f6c3a5a..HEAD` is clean.

**5. sw.js CACHE_VERSION — N/A (correctly, per scope).** `git diff f6c3a5a..HEAD -- sw.js` is empty — confirmed deliberately deferred, not silently dropped.

**6. git diff --check / staging plan — PASS.** Diff-check clean. Each of the six commits touches only its named files (`git show --name-only` per commit), narrow and slice-scoped — no evidence of `git add -A`. `test-arc-constellation.html`: zero diff, untouched. Working tree is clean on all six graded files right now (`git status --porcelain` on the file list returns nothing) — no mid-review stray edits.

**7. Sanctioned accessors — PASS.** Zero new `.set(`/`.update(`/`.delete(`/`firestore()` calls anywhere in the added JS lines. All new writes route through pre-existing chokepoints: `markBooksDirty`/`markArcsDirty`/`markSubTheoriesDirty` (state.js:939/1090/1111, unmodified) + `saveState()` for the three per-object registers (js/views.js:164, `_valueMarkDirty`), and `setProfile`+`saveProfileToFirestore` via the existing `accountValuesPersist`/`accountValuesCollect`/`accountValuesMakeRow` idiom (views.js:17899/17907/17947, unmodified — reused, not edited) for both the onboarding preset (js/intros.js `doValues`) and the retrofit "Add this value" action. No new Firestore collection (`FX-1` stays parked — confirmed no new `collection(` calls added).

**8. Yumi covenant — PASS.** `assembleContextData` (js/yumi-brain.js:181) has zero diff-touch. Cyan-only voice preserved: the new onboarding `values` beat reuses the existing, unmodified `.ij-dock-words`/`.ij-crest` cyan chrome (components.css:13138/13218, zero diff) rather than introducing its own; the new value-hue system deliberately uses gilding gold (`--gold-hi`/`--gold-deep`), never `--cyan`/`--teal` — confirmed by reading every new selector in the diff. `renderAccountPage`'s pre-existing "`--teal` is NOT remapped → cyan stays Yumi-only" comment (views.js:17691) is untouched.

**9. Honest empty states — PASS.** Zero-declared-values: "You haven't set any values yet. Add them in Account → Values, then mark what your reading carries." (views.js, `buildValueMarkRegister` picker, `vocab.length === 0` branch). All-marked: "Every one of your values is already marked here." (`any === false` branch). Retrofit: <2 books → "Yumi needs a few books to notice a pattern — add some to your shelf first."; zero grounded suggestions → "Yumi didn't find clear new values to name yet…"; proxy failure → "Yumi couldn't look just now — try again in a moment." (all in `renderAccountPage`'s `retroRun`/`retroRenderOffers`). Logged-out: Account page's own pre-existing `if (!user || !user.uid)` gate (views.js:17702, unmodified) sits upstream of the retrofit code, so it's unreachable signed-out; sub-theory page's own pre-existing signed-out/seed early-returns (views.js:10365-10388, unmodified) sit upstream of the sub-theory register. Shelf's zero-value-filter-result path correctly joins the existing `filterActive` OR-chain (views.js:5353, `shelfFilter.value !== null`) so it reads as "filtered to nothing," not "shelf is empty" — the exact trap the recon flagged (§5).

---

## Task-specific dimensions (1–7)

**1. ES3 — PASS.** (Folded into gate 1 above.)

**2. Guarded-sync mandate — PASS, independently traced.**
- `valueMarks:[]` guard added to `ensureBookFields` (state.js:422), `ensureSubTheoryFields` (state.js:671-674), `ensureArcFields` (state.js:772-775) — all idempotent, array-only, matching the `evidence`/`attachedMarginalia` convention.
- `createArc` (state.js:1853) and `createSubTheory` (state.js:2007) literals both carry `valueMarks: []`.
- Migration: `1.28.0 → 1.29.0` step (state.js:3429-3439) calls `ensureBookFieldsAll`/`ensureArcFieldsAll`/`ensureSubTheoryFieldsAll` — confirmed these `*All` helpers exist (state.js:432/729/783) and each iterates its map calling the singular `ensure*Fields`.
- Merge-path twin-trap: confirmed **without editing integrations.js** that it already calls `ensureArcFieldsAll` (integrations.js:221), `ensureSubTheoryFieldsAll` (:278), `ensureBookFieldsAll` (:787) — so `valueMarks` rides the existing merge chokepoint for free, exactly as claimed.
- Per-user safety: traced `buildUserBookDoc` (integrations.js:804-824, whole-object copy into `/userBooks/{uid}`), `buildUserArcsDoc` (:1219-1237, filtered `arc.userId===uid`), `buildUserSubTheoriesDoc` (:1415-1433, filtered `st.userId===uid`) — none allowlist-strip fields, so `valueMarks` is per-user-safe like `movedMe`, no cross-user leak.
- `movedMe` itself: zero non-comment diff lines touch it (`git diff | grep movedMe` shows only new comments referencing it).
- No new Firestore collection created (confirmed under gate 7).

**3. CSS — HOLD-BLOCKING.**

*Token discipline (partial pass):* The two gilding golds are correctly promoted to `:root` with a comment (assets/theme.css:41-46, `--gold-hi`/`--gold-deep`, identical to pre-existing scoped values already used ~15× elsewhere in components.css — genuinely a promotion, not a new color). The retrofit CSS is fully scoped to `.account.lum-amber-ember` (every `.account-retro-*` selector prefixed — confirmed, zero bleed).

But two *additional* raw hex literals were introduced beyond the disclosed two, never mentioned in the S2/S4 self-report: `assets/components.css:13351-13352` (`.vr-orb{ background:radial-gradient(circle at 35% 30%, #fff4d6 0%, var(--gold-hi) 55%, var(--gold-deep) 100%); }`) and `assets/components.css:13366` (`.vr-edit-save{ color:#3d2807; ...}`). Both values duplicate a pre-existing pattern used ~15× elsewhere in the file for the identical semantic role (gold-ink-on-fill text, orb highlight), so they are not *novel* colors, but they are new raw literals in new code where CLAUDE.md's hard rule ("CSS variables only — no new hardcoded hex") and the design canon (§1: "add one to theme.css with a comment — never inline a literal") both required either reuse of an existing token (`--lum-gold-ink`, used elsewhere with a `var(..., #3d2807)` fallback pattern) or a third promoted global. Minor severity — cosmetic, not a rendering defect — but a real, uncredited rule violation.

*The blocking defect — `.vr-*` does not "render correctly across the book(light)/sub-theory+arc(warm-dim)/account(ember) scopes" as required.* It renders correctly on none of the three object-mount scopes (book, sub-theory, arc); only the Account retrofit offer-cards (a separate, fully-`--lum-*`-scoped component) are unaffected.

Root cause, traced end-to-end: `.vr-card` and its children (components.css:13334-13363) use *base* tokens — `--ink`, `--ink-2`, `--ink-3`, `--surface`, `--page-2`, `--line-page`, `--danger` — not the `--lum-*` namespace every pre-existing rule in these three surfaces uses exclusively (confirmed: zero pre-existing `.bk-*`/`.st-*`/`.arcfield-*` rule anywhere in the file references a base token). `router()` sets `body[data-ground="dark"]` for the `book`, `subtheory`, and `arc` routes (js/views.js:390, `umberGroundDark` map, unmodified). theme.css's `[data-ground="dark"]` block (theme.css:342-367) remaps base `--ink`/`--ink-2`/`--ink-3`/`--surface` to the **dark-ground** palette (`--text-d:#f0e3c8`, `--muted:#c2a87f`, `--surface-d:#3e2814`) — appropriate for text on a dark background. None of `.bk-surface.lum-amber-deep` (components.css:10719-10736, R7), `.st-page.lum-amber-deep`/`.stb-warm-dim` (R6), or `.arcfield.arcfield-warm .arcfield-page` (components.css:12079-12087, R5) re-point these *base* tokens back — each re-points only its own `--lum-*` set. This is not new debt introduced by R8: it's a working, safe assumption in all three surfaces *until now*, because no pre-existing rule inside them ever consumed a base token. `.vr-*` is the first to do so.

Meanwhile `--page-2` (`.vr-card`'s own background) is *never* ground-redefined anywhere in the codebase — it stays the light `#fcf6e8` literally everywhere, including inside these three dark-grounded scopes. The result: `.vr-card` always renders a light-cream panel, but its text (`--ink`/`--ink-2`/`--ink-3`) always resolves to the pale, dark-ground-appropriate palette meant to sit on a *dark* background — producing near-invisible text, regardless of which of the three surfaces it's mounted on.

Quantified (WCAG relative-luminance contrast, computed independently, not from a screenshot):
- `.vr-mark-name` (the actual value-name text — "Liberation," "Inheritance," etc.), `color:var(--ink)` → `#f0e3c8` on `.vr-card`'s `background:var(--page-2)` → `#fcf6e8`: **1.18:1** (WCAG AA requires 4.5:1 for body text; this is a near-total fail — the primary content of the round's flagship new component is effectively invisible).
- `.vr-h`/`.vr-sub`/`.vr-why` (`color:var(--ink-2)`) → `#c2a87f` on `#fcf6e8`: **2.12:1** (fails AA at every size, including large text's 3:1 floor).
- `.vr-mark-x` (the remove-mark `×` button, `color:var(--ink-3)`) — same `#c2a87f`/`#fcf6e8` pairing: **2.12:1**.
- `.vr-mark-x:hover{color:var(--danger)}` → base `--danger:#c2603a` (never ground-redefined) on `#fcf6e8`: **3.88:1** — also sub-AA; this is the *same* color R7's own comment (components.css:10721) already flagged and replaced with `--lum-rose` for Book Detail's own rules ("was #c2603a ~4.1:1... #b8563f ~4.65:1") — `.vr-mark-x:hover` reintroduces the exact color R7 retired.
- For comparison, the *correct* light-scope pairing that four sibling surfaces (Shelf, Home, Notebook, Arcs-list) already use for this exact purpose — `--lum-ink-2:#645940` on `#fcf6e8` — computes to **6.40:1**, comfortably AA.
- `.vr-edit-in`/`.vr-whyin`/`.vr-opt` (`background:var(--surface)` → `#3e2814`, dark brown) sit inside the light `.vr-card` — internally legible (10.88:1 white-on-dark) but visually a dark island incongruously floating inside a light card, not a color-blindness/contrast issue but a clear look-mismatch.

This is exactly the "Scoped ground re-point verify by cascade" / "Cross-namespace ink token gap" failure class this project has hit before (Shelf's own MW-1 comment at components.css:11810-11814 documents having *already learned* this trap: "the Shelf is a LIGHT-ground surface via its R2 re-points, so semantic --surface/--border/--color-surface resolve DARK here and are NOT used; the sheet chrome wires the non-lum LIGHT primitives instead: fill --page-2, hair-line --line-page(-2)... text --ink/--gold-deep" — Shelf's own `.shelf.lum-amber-deep` block *does* re-point base `--ink` (components.css:11642) precisely so this pairing is safe there; book/sub-theory/arc never got that treatment because, until R8, nothing inside them needed it).

Both slice self-reports (S2, S3) describe only *structural* live-verification ("component builds `.vr-card` with 1 seeded mark + its lineage line + gilding-gold orb gradient") — DOM presence, never a computed-style or visual check — so this was never caught. This is the CLAUDE.md "VISUAL GATE" lesson recurring in a new form: not "computed style ≠ a look," but no computed-style check at all was run on the new component's own text color.

**The fix is additive and narrow** (does not require reopening S1/S4/S5/S6): add a `--ink`/`--ink-2`/`--ink-3`/`--surface`/`--danger` base-token re-point, scoped to wherever `.vr-card` mounts in each of the three surfaces (or scope `.vr-*` itself to consume `--lum-*` the way `.account-retro-*` correctly does) — the exact technique Shelf/Home/Notebook/Arcs-list already carry.

**4. Mobile-canon (P1-P9) — PASS on size/touch/scroll (contrast defect above is separate and cross-cutting).**
44px targets present in the `@media (max-width:759px)` blocks for `.vr-mark`/`.vr-mark-name`/`.vr-mark-x`/`.vr-add`/`.vr-opt`/`.vr-edit-save`/`.vr-edit-cancel` (components.css:13369-13376), `.ij-vchip`/`.ij-vown input` (components.css:13232-13235), and `.account-retro-btn`/`.account-retro-add/-rename/-no` (components.css:13418-13423). 16px inputs confirmed for `.vr-edit-in`/`.vr-whyin` and `.ij-vown input` (no iOS zoom). All new flex rows (`.vr-marks`, `.ij-vchips`, `.account-retro-acts`, `.vr-pick-grid`) use `flex-wrap:wrap` — no h-scroll risk. The shelf value-filter row adds zero new CSS, reusing `.shelf-filter-group/-label/-list` (pre-existing, already mobile-treated) — consistent with the self-report. Note: because of the Gate-3 defect above, the register is size/target-correct but its text is unreadable at every width, not just desktop.

**5. Copy-is-a-contract — PASS.**
The Account values note fix is honest and non-overclaiming: `'You place these. Yumi never fills them in.'` → `'You place these — you always accept, rename, or wave away. Yumi may notice values your shelf carries, but never fills them in for you.'` (views.js diff, S4) — correctly reflects the new retrofit's suggest-only, human-accept behavior, doesn't overclaim automation. The onboarding beat's new dock copy (`dockValues`, js/intros.js) independently and consistently says "Yumi never fills them in... Later she may notice more, but only you accept them" — matches, no drift between the two copy sites. Retrofit covenant copy preserved near-verbatim: "From your titles, authors, and genres only — never from inside your books or your private notes. Nothing is added until you accept it." No other new copy promises unbuilt behavior (checked every new `.textContent`/`innerHTML` string in the S2-S6 diff).

**6. Ownership/seed gating — PASS, independently traced (not just trusting the comment).**
- Arc register: explicit `if (user && user.uid && arc.userId === user.uid)` (views.js, `renderArcDetail`) — airtight, excludes both signed-out and the seed sentinel `'__praxis_seed__'`.
- Sub-theory register: `if (stpUser && stpUser.uid)` alone, no explicit `subTheory.userId` check — but traced the full function: `renderSubTheoryPage` hard-gates signed-out at the top (views.js:10365-10371, unmodified, pre-existing) and early-returns seed records to a separate read-only renderer (views.js:10377-10388, unmodified) *before* the register mount is reached. Verified the "owner-only by construction" claim by tracing that another user's real (non-seed) sub-theory is architecturally never loadable into `state.subTheories` locally — cross-user viewing goes through the entirely separate `renderInteract`/`#walk/<arcId>` path (views.js:17369-17420) which reads `loadPublishedArc`'s Firestore payload directly into a local closure variable, never merging into `state.arcs`/`state.subTheories`. Claim holds.
- Book register: `if (user)` only, no shelf-membership check — this is a direct, deliberate mirror of `movedMe`'s existing (unmodified) gating pattern, not a new gap; `renderBookDetail` itself has no shelf-membership check for any of its actions, so this is inherited pre-existing behavior, correctly scoped to R8's mandate ("mirror movedMe").

**7. Dead code / scope drift / silent divergence — one minor finding.**
`js/intros.js:8` and `:79` still read "the first-run guided journey (7 steps)" / "JOURNEY — 7 steps" — stale now that S6 inserted a `values` beat, making it 8 steps. Not a functional bug (the dot-indicator renders dynamically off `JOURNEY.length`, confirmed at js/intros.js:393), but an uncorrected doc/comment left behind by the same commit that invalidated it — never disclosed in the S6 self-report. Everything else checked clean: no orphaned functions, no `FX-1` collection reopened, `evalValueResponse` is a genuine one-line alias to `evalLensResponse` (not a divergent copy, per the ruling), the 10 presets match the locked list verbatim and in order, no `profile.values`/`valueMarks` aliasing anywhere in the diff, `movedMe` untouched, mockup's five touchpoints (P1-P5) all built except P5 (value-load) — correctly deferred to R9, nothing of it was prematurely built.

---

## Summary of blocking items

1. **(BLOCKING)** `.vr-*` value-mark register renders at ~1.18:1 / ~2.12:1 contrast (WCAG AA requires 4.5:1) on Book Detail, Sub-theory, and Arc Detail — all three of its mount surfaces — because it consumes base tokens (`--ink`/`--ink-2`/`--ink-3`/`--surface`/`--danger`) that these three scopes never re-point, while its own background (`--page-2`) is always light. The round's flagship new UI is not legible as shipped. Fix is additive (a base-token re-point matching the pattern Shelf/Home/Notebook/Arcs-list already carry); does not require touching S1/S4/S5/S6.

## Non-blocking, should be corrected in the same commit as the fix above
2. Two new raw hex literals in components.css (`#fff4d6` at :13351-13352, `#3d2807` at :13366) beyond the disclosed two golds — not novel colors (both duplicate an existing ~15×-used pattern) but uncredited and against the hard "no new hardcoded hex" rule.
3. Self-report numstat mismatches: S4 views.js claimed +145/-1 vs actual +144/-1; S6 intros.js claimed +86/-3 vs actual +83/-3. Shipped content independently verified complete and correct in both cases — this is a self-report accuracy issue only.
4. Stale "7 steps" comments at js/intros.js:8 and :79 (now 8 steps after S6). Cosmetic, non-functional.

## Cleared, no action needed
Gates 1, 2, 4, 6, 7, 8, 9 (system protocol) and dimensions 1, 2, 4, 5, 6 (task-specific) all PASS with independent evidence above.
