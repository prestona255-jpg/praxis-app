# R-ARC FF-7 VOCAB RIDER — STAGE 0 RECON (HALT: 4 forks the rulings don't cover)

**Model: OPUS (already-ruled work).** Base `207eecd` (code state `4a8f425`, live v3.219). Working tree clean.
Method: inline greps + an 8-probe / 16-agent census workflow (Sonnet-pinned per MODEL LAW v2 SONNET-CHECKS),
each probe adversarially re-run by an independent refuter. Two probes were REFUTED; both refutations are recorded
below and neither overturns an operative conclusion.

**VERDICT: HALT after recon — standing condition (1), a NEW fork the rulings don't cover ×4.** The confirmed
core (§1) is ready to build as ruled. But the table's applied scope (§E) is **incomplete relative to its own
anchor 1** ("'forming' retires everywhere"), and one ruled scope item (§C, the Yumi tag) **has no target left
in the code**. Shipping §E alone would leave the app self-contradictory on the very words this rider unifies.

---

## 0. THE HEADLINE — the table is STALE in two directions

The FF-7 table was mapped from `r-arc-ff-routing.md` Part 2, which was enumerated **before Slice F4 and before
S3B-POLISH shipped.** Two of its five scope items have since moved under it:

| Table item | Reality at `4a8f425` | Consequence |
|---|---|---|
| **§C — unify the Yumi tag across Page + Workshop** | **F4 (`3fefc93`, v3.217) REMOVED both blocks.** `"From how you read"` = **0** in `js/`, `assets/`, `index.html` (exhaustive grep, exit 1; `git log -S` shows the removal). ff-routing itself annotates these rows *"(These are the F4 blocks — see Part 3)"*, and Part 3 rules them wholesale removed (D16). | **§C is a NO-OP.** There is no string to swap. Applying it literally would **re-add Yumi speech F4 deliberately removed** — contradicting D16's covenant + the Wave C raised-hand deferral. |
| **§D1 — unify the maturity ramp WORDS** | **Already shipped** by `bb70889` (S3B-POLISH): `_searchSubMaturityWord` → `_stMaturityWord`; Page (10958 post-rider) + #search (846) + Arc-Read word (13585) all call it. | Ruling (2)'s **word half is DONE**. Only the **dot thresholds** remain — 2 numeric literals. |

Neither is a build error — they are the **DOC = POINTER, LIVE FILE = SOURCE** lesson landing twice. Both doc
corrections ride the rider's commit.

---

## 1. THE CONFIRMED CORE — fully ruled, zero ambiguity, ready to build

| # | Site | Current | → Ruled | Proof |
|---|---|---|---|---|
| 1 | `views.js:10886` Page kicker | `published ? 'A SUB-THEORY · FINISHED' : 'A SUB-THEORY · STILL FORMING'` | 3-way: `published ? '· FINISHED' : (_stIsBasin(subTheory) ? '· GATHERING' : '· DRAFT')` | `subTheory` in scope from `views.js:10819`, single decl, no shadowing (probe NOT refuted). `_stIsBasin` = unpublished ∧ blank header (`8491`). |
| 2 | `views.js:2487` newborn door | `'Continue in the workshop →'` | `'Open the workshop →'` | route `2491` → `/build` ✓ |
| 3 | `views.js:10936` Page Edit door | `'Edit in the workshop →'` | `'Open the workshop →'` | href `10935` → `/build` ✓ |
| 4 | `views.js:13809` Arc-detail stub (**D2**) | `'Open the page →'` | `'Open the workshop →'` | **href `13808` already → `/build`.** Label-only fix; the collision is real and reproduced. |
| 5 | `views.js:13756-7` `_arcReadMaturityKey` | `.4 / .7` | `.34 / .67` | Closes the Arc-Read dot/label residual — see §2. |
| 6 | `views.js:2475` newborn eyebrow, **basin case only** | `'born just now · draft'` / `'draft'` | `'gathering · just now'` / `'gathering'` | Named case = **FORK 3**. |

**`views.js:11301` "Open the page →" is CORRECT and unchanged** — href `11300` → `#subtheory/<id>`. Verified,
not assumed.

### The dot/label residual, reproduced concretely
`13584`/`13585` derive **both** signals from the **same** `mat`, on **different thresholds**:
`maturityKey: _arcReadMaturityKey(mat)` (.4/.7) vs `maturityWord: _stMaturityWord(mat)` (.34/.67).
→ at `mat ∈ [0.34, 0.4)` the row renders the word **"developing"** beside an **`is-forming`** dot; at
`[0.67, 0.7)`, **"established"** beside `is-mature`. Repointing the key to .34/.67 closes it exactly as ruled.

**Zero CSS bytes.** `components.css:12704-12707` carries exactly 3 dot classes (`.is-bright/.is-mature/
.is-forming`) matching the 3 returned keys; only the numbers move, so the key strings — and thus the selectors —
are untouched. *(Refutation logged: the "no other selectors" claim missed an inline `<style>` in
`docs/studio/mockups/arcs.html:376-9` — a MOCKUP, not shipped. Operative conclusion stands.)*

**The `|| r.maturityKey` 'forming' leak never fires.** `_arcReadSpine` has exactly 2 callers: `13590` (sets key
**and** word, unconditionally) and `19544` (visitor `#walk` — passes no maturity at all). Probe NOT refuted.

---

## 2. THE FOUR FORKS — each needs one word from Preston

### FORK 1 — §C (Yumi tag): confirm NO-OP
Your GO named "one Yumi tag across both surfaces." **There is no tag on either surface** (§0). Building it =
re-adding what F4 removed.
**Recommend:** §C = **no-op**; the anchor stands as *forward* vocabulary for Wave C's raised-hand seat; correct
the FF-7 doc's §C + the Open-items row in the same commit. **No code.**

### FORK 2 — "a forming sub-theory in <arc>" ×2, the table MISSED (the sharp one)
Anchor 1 retires "forming" everywhere, but §E enumerates **only** the Page kicker. Two more **rendered**
lifecycle "forming"s exist, both **unconditional** (no basin/named branch):

| Site | Surface | String |
|---|---|---|
| `views.js:2481` | Notebook newborn card snippet | `'A forming sub-theory in ' + arcTitle + ', started from N marked passage(s).'` |
| `views.js:11218` | **Workshop** (`renderSubTheoryBuild`) subtitle | `'a forming sub-theory in '` + `<em>arc</em>` |

**Ship §E alone and the app contradicts itself:** the Page reads `A SUB-THEORY · GATHERING` while the Notebook
card and the Workshop subtitle directly below still say **"forming"**. That is precisely COPY IS A CONTRACT.
**Complication:** both are unconditional, so a blind `forming→gathering` swap makes a **named draft** read
"a gathering sub-theory" — contradicting the ruled lifecycle (named → DRAFT).
**Recommend (A):** extend §E to both, each branched: basin → `"a gathering sub-theory in X"`; named →
`"a draft sub-theory in X"`. *(B: swap the word only, unbranched — cheaper, but wrong for named drafts.
C: leave both — ships the contradiction.)*

### FORK 3 — the NAMED newborn eyebrow has no ruled words
Table §A rules the eyebrow only "**(while unnamed)**". A **named newborn is reachable** (probe NOT refuted):
`notebookGatherName` non-empty via the working-leaf name canvas (`2325`) **or** Yumi's S4 NAME-proposal Accept
(`yumi-ui.js:389-396` → `notebookGatherFromThread` `3320`) → `createSubTheory` persists `header` verbatim
(`state.js:2088`) → `_stIsBasin` false → the card renders **named**. The eyebrow (`2475`) keys **only** on
`nb.restored` — it has no basin/named branch today.
→ Swap the basin words in blind and a **named** newborn reads **"gathering"**, contradicting named → DRAFT.
**Recommend:** branch it, mirroring the ruled pair and keeping the temporal cue —
basin: `'gathering · just now'` / `'gathering'`; named: **`'draft · just now'`** / `'draft'`.
⚠ `'draft · just now'` is a **new user-facing string not in the table** — hence a ruling, not a determination.

### FORK 4 — "forming" outside the sub-theory lifecycle: 4 more rendered sites, 3 domains, 1 FROZEN file
Exhaustive sweep of shipped code: **22 hits, 7 rendered.** Three are the lifecycle (§1 #1 + FORK 2). The other
four are **different spectra**, and taking anchor 1 literally reaches all of them:

| Site | What | In §E? |
|---|---|---|
| `views.js:3742` `_arcMaturityWord` | **ARC-AGGREGATE** ramp (forming/warming/mature/bright, .2/.4/.7) → arc-card meta (`3776`→`4008`/`18889`), search crumb (`817`→`989`). Probe NOT refuted: consumes `_arcAggregateMaturity` — **a different score** from the per-sub ramp; self-consistent subsystem, incl. `HOME_GROWING_MAX=0.7` ("still growing"). | **No** — unifying it needs a ruling on the arc-level *concept*, not a word swap. |
| `arc-constellation.js:1433` `maturityRead` | A **FOURTH** ramp — `Nascent/Forming/Developing/Mature`, **.25/.5/.75**, capitalised — constellation hover card. | **No** — and the file is **FROZEN (census only)**. Needs explicit authorisation. |
| `views.js:18523` | `'Yumi noticed a value forming'` — **VALUES** domain (R8). | No |
| `views.js:20406` | `'A lens forming around your notes.'` — **LENS** domain. | No |

*(`state.js:589 'performing arts'` is a **substring false positive** — the wildcard trap, excluded. The
remaining 15 hits are comments / internal ids / the CSS class.)*
**Finding:** the table says "3 sources, one disagreeing"; there are **FOUR** maturity ramps. **Recommend:**
hold all four **out** of this rider (file them as a named residual, "FORMING-REACH", for a later round) —
§E is a *vocabulary* rider, not a maturity-model redesign, and one target is a frozen file.

---

## 3. BAND — declared, contingent on the rulings

Confirmed core only (§1, no forks): **`js/views.js` +150 … +450 bytes** (5 string swaps net ≈ −5; the kicker
3-way branch ≈ +60; 2 threshold literals +2; comment updates the balance) · **`assets/components.css` 0** ·
**`js/state.js` 0** · **`sw.js`** v3.219 → **v3.220** (read-at-commit +1, length-neutral). No schema, no route.
FORK 2(A) + FORK 3 add ≈ **+250 … +500** more to `views.js`. **Baselines (working-tree CRLF / git blob LF):**
`views.js` 1,005,853 / 984,292 · `components.css` 717,031 / 702,531 · `state.js` 169,333 / 165,755 ·
`sw.js` 4,897 / 4,762. All four `i/lf w/crlf`. Byte-locks intact: `lumen-amber.css` 14,681 · `marks.js` 10,255.

## 4. WHAT I NEED (four words, then I run unattended to a local commit)
1. **FORK 1** — §C no-op + fix the doc? (recommend **yes**)
2. **FORK 2** — **A** (branch both), B (blind swap), or C (leave)? (recommend **A**)
3. **FORK 3** — named newborn = `'draft · just now'` / `'draft'`? (recommend **yes**)
4. **FORK 4** — hold all four out as residual **FORMING-REACH**? (recommend **yes**)
