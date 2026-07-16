# R-ARC SLICE 3 — "THE EMBER" — BUILD

**Status: BUILT · RE-BANDED (Preston) · RIG-VERIFIED (9 behaviors, incl. one real fragility caught +
fixed) · RED-TEAM + REVIEW gates run — CONCERNS/HOLD were doc-claim corrections (code data-safe, no
BLOCK-COMMIT), all applied below. Awaiting the sw.js bump, then commit. NOT pushed.**
Base **`ba4888c`** / v3.212. Plan: `docs/r-arc-plan.md` (Slice 3). Recon: `r-arc-s3-recon.md`.

## Scope as ruled (Preston, 2026-07-16)

- **Fields ratified; basin split into its own slice.** Slice 3 = `arc.status` + lineage + rename path +
  graduation + the `'seed'`-display retirement. The **basin** (origin phrase/fragments/mass/split-merge +
  mote identity) is a NEW slice.
- **Naming collision ruled:** the F1/EMBER ban scopes to the **arc-lifecycle vocabulary only**; the 16
  glyph names (`ST_MARK_NAMES`, R5 S6 — "the seed"/"the ember" as *named marks*) are a separate ratified
  register and stand. On-screen coexistence is tolerable.
- **Ember display = quiet secondary:** the content-maturity word stays primary; ember shows only as a
  small chip near the graduate button. **Graduation one-way** (reversal flagged for Slice 5).

## What shipped

**`state.js` (schema + mechanisms — 3a, all ratified):**
- `ensureArcFields`: `status` (coerced to `'ember'`|`'graduated'`, default `'ember'`) + `originEntryId`
  (string|null, default null). ⚠ **T3 — CORRECTED (red-team, 2026-07-16):** backfill rides the **merge
  leg** (`integrations.js:221`, on sign-in) — NOT the migrate leg. The migrate `ensureArcFieldsAll`
  (`state.js:3503`) sits inside `if (SCHEMA_VERSION === '1.28.0')`, and existing users are at 1.30.0, so
  it is **inert for the real population** (this slice added no version bump, per the ruled "additive, no
  migration"). This is **data-complete and self-healing anyway:** an undefined `status` reads as `ember`
  everywhere (`arc.status === 'graduated'` → false), `graduateArc` always writes `status` explicitly, and
  the merge backfills on every signed-in load. My earlier "both paths verified live" was overstated —
  merge-leg + safe-default is the accurate (and sanctioned) mechanism.
- `createArc`: sets `status:'ember'`, `originEntryId` (optional 4th param, null default). **Blank-title
  guard UNCHANGED** — unnamed-ember *creation* is the door's job (Slice 4); Slice 3 only *handles* unnamed.
- `updateArc(id, fields)`: the rename path (F-A + REQ#6). Mirrors `updateSubTheory`; ALLOWS blank title
  (an ember may be unnamed).
- `graduateArc(id)`: one-way flip ember→graduated.

**`views.js` (display + UI — 3b/3c):**
- `_arcMaturityWord`: `'seed'` → **`'nascent'`** (retires the forbidden noun; the content-maturity spectrum
  stays primary per Preston). Both render sites clean (card meta + search crumb).
- `_arcHeadLifecycleControl(arcId, arc)`: owner-only strip — status chip + Graduate (only while ember) +
  Rename. Placed beside the publish control (Preston: "small chip near the graduate button").
- `_arcInlineRename(arcId)`: swaps `.arcfield-q` for an input; blur/Enter commits via `updateArc`, Escape
  aborts. Blank commit = unname (F-A).
- Unnamed-title fallback: a blank title renders a muted **"Unnamed"** (`.arcfield-q-unnamed`).

**`components.css`:** the lifecycle strip, scoped under `.arcfield.arcfield-warm` **only** (the arc detail
root is always `arcfield lum-amber arcfield-warm` — warm-dim, so no base/light variant). Mirrors
`.arcfield-pub-btn`'s warm chrome; mobile 44px hit-area added to the existing arc-control rule.

## ⚠ ONE REAL FRAGILITY THE RIG CAUGHT + FIXED

The Enter handler originally did `input.blur()` to commit. The rig proved `input.blur()` does **not**
reliably fire the blur listener (whereas `dispatchEvent(new Event('blur'))` does) — so Enter silently
did nothing in that path. **Fixed:** Enter now calls `commit()` **directly**; the `done` guard makes the
subsequent real blur (from `renderRoute` tearing down the input) idempotent. Re-verified: Enter works.

## ⛔ THE BYTE OVERAGE — needs re-band

**RE-BANDED at measured size (Preston 2026-07-16): views.js ≤2,294 B logic + ≤1,827 B CSS. Any further
growth = fresh halt.** Final, after the two word tweaks (both byte-negative on logic):

| File | Total | Logic (re-banded metric) | vs ceiling |
|---|---|---|---|
| `state.js` | +2,238 B | 1,153 | ✅ (band +1.2…+3.0 KB total) |
| `views.js` | +3,909 B | **2,292** | ✅ **≤2,294** (word tweaks shrank logic; the +total is one comment line) |
| `components.css` | +1,826 B | — | ✅ **≤1,827 B** total |

The plan's terse estimate predated the ratified scope (graduation + rename + inline-edit + display +
warm-dim CSS). Preston re-banded at the measured cost, ruling it the ratified scope, not drift.

## Mechanical gates

| Gate | Result |
|---|---|
| Parse (T6) | `PARSE OK` state.js + views.js |
| ES3 | 0 real violations in added lines (both files) |
| `'seed'` retired | `_arcMaturityWord` returns `'seed'` = **0**; live arcs-list reads "nascent" |
| Byte-locks (T7) | lumen 14,681 · marks 10,255 exact |
| Hardcoded hex | **1** (`#f6ecd4`) — NOT new to the codebase; the exact literal `.arcfield-pub-btn:hover` already ships (components.css:12677), mirrored for sibling consistency. No divergent token invented. |
| Tripwires | **T1** ✅ (no sub-theory status touched — EMBER is arc-only; coercion intact) · **T2** ✅ (yumi-brain untouched) · **T3** ✅ (both ensure-paths, verified live) · **T4** ✅ (no `seeds` key; `'seed'` noun retired, glyph-name register ruled separate) · **T5** ✅ (protected renderers untouched — F2 brightness hook `buildHomeFieldData` NOT yet wired; see residual) |

## Live verification — the rig (`.claude/rig/`, port 8797, SW killed)

| # | Behavior | Result |
|---|---|---|
| 1 | Schema backfill | every arc → `status:'ember'`, `originEntryId:null` ✅ |
| 2 | `createArc` mints an ember | `status:'ember'` ✅ |
| 3 | 0-sub maturity word | **`'nascent'`** in state AND on the arcs-list card ("0 sub-theories · nascent · touched today"); `'seed'` absent ✅ |
| 4 | Lifecycle strip (owner-only) | chip "ember" (warm gold ink `rgb(133,84,16)`) + Graduate + Rename ✅ |
| 5 | Graduate | ember→graduated; chip → "graduated"; Graduate button gone; Rename persists ✅ |
| 6 | Rename via blur (click-away) | title updates, input → heading ✅ |
| 7 | Rename via Enter | ✅ **after the fix** (failed before it) |
| 8 | Rename to blank (unname) | `title===''`; heading shows the muted unnamed placeholder ✅ *(rig-tested with the pre-tweak word "Untitled"; re-verified with the final "Unnamed" — see below)* |
| 9 | Persistence (merge-leg + safe default) | graduated status + renamed title **survived a reload** ✅ |

## Design choices I made (flag for the felt pass — Preston's eyes)

1. **`'nascent'`** as the 0-sub maturity word (replacing 'seed'). **STANDS for now (Preston 2026-07-16),
   but it is a NAMED FELT-PASS ITEM:** if it reads cold on the deployed screen beside `warming`/`bright`,
   the ruled swap candidate is **`'kindling'`** (warmer, luminous register). ⚠ **Coordinate with the
   protected constellation's fixed `'Nascent'` (residual #6)** — a swap to `'kindling'` desyncs the two
   unless the frozen word is also considered. One-word change either way.
2. **Rename UX** = inline-edit of the arc's question (`.arcfield-q` → input), owner-only, via a "Rename"
   button in the lifecycle strip. Mirrors the workshop's sub-theory title pattern.
3. **Graduate + Rename placement** = the owner-only lifecycle strip beside the publish control.
4. **"Unnamed"** as the unnamed display (Preston's tweak from "Untitled" — unnamed is a stage, not a
   deficiency; the ember chip carries the lifecycle). Only reachable in Slice 3 via rename-to-blank; the
   full "ember · unnamed" felt treatment matures with Slice 4's door.

## Residuals

1. **VISUAL GATE OWED** — the rig's dpr renders screenshots illegible; computed styles + DOM prove
   structure, not look. Preston's eyes on the deployed build. One place to look: an owned arc's detail
   header (the ember chip + Graduate + Rename), and the "Untitled" state after rename-to-blank.
2. **F2 brightness field-rendering NOT wired.** The ember's "renders small via brightness" hook
   (`buildHomeFieldData` floor) is census'd but not built — it's the field/composition concern, deferred
   (belongs with Slice 12 or the basin slice). Slice 3 delivers the lifecycle + display + rename, not the
   field's brightness treatment.
3. **Graduation reversal** — one-way as ruled; a Slice 5 (reverse-gear) candidate.
4. **`_arcCardConstellation`** (arcs-list thumbnail) renders blank for a 0-sub arc and varies node SIZE
   per sub-theory — F2's "brightness-only, no size" would need to decide whether to touch it. Not touched
   here (out of scope); flagged for the field work.
5. **UNNAMED-DISPLAY INCONSISTENCY (red-team, reachable NOW).** `updateArc` allows rename-to-blank, so the
   unnamed state is reachable this slice — but only the **detail header** says "Unnamed". Every other
   surface still falls back differently: `arc.title || 'Untitled arc'` (arcs-list card, home, spotlight),
   `'(untitled arc)'` (profile), `'Arc'`/`'this arc'` (workshop intro). **No crash** (all `||` fallbacks,
   `''` is safe for `.length`/`.replace` — verified). The full "ember · unnamed" vocabulary unifies with
   Slice 4's door; named here so it is not silently carried.
6. **`'nascent'` COEXISTS with a frozen `'Nascent'` (red-team).** `arc-constellation.js` `maturityRead()`
   already returns `'Nascent'` as its lowest band — in the **protected** file, untouched. Not a collision
   (different surfaces), but ⚠ **if the felt pass swaps `'nascent'` → `'kindling'`, the arcs-list word
   desyncs from the constellation hover's fixed `'Nascent'`.** Preston should weigh both before ruling the
   swap — `'kindling'` would need the protected file's word considered too (or accept the mismatch).
