# R-ARC SLICE 3B-POLISH (the felt-pass rider) — BUILD

**Status: BUILT · RIG-VERIFIED (all 5 fixes + 2 regressions). Awaiting red-team → review → commit. NOT
pushed.** Base **`02b517e`** / v3.215 → v3.216. Approved by Preston (routing rulings, 2026-07-16).

## Scope (Preston's ruling #1 — approved as scoped + the maturity-ramp)

The display defects from the Slice 3B deployed felt pass. **Declared band before build: views logic
≤1,800 B · css ≤350 B.** Final: **views net logic −67 B** (shrank — helper consolidation + dead-fn
removal) · **css rule net 303 B** (≤350). Both within band.

| Fix | Change |
|---|---|
| **FF-9b** | `_stTruncPhrase(s, n)` — one ES3 word-boundary truncation helper; **5 call sites** repointed (newborn · Page · workshop · picker×2 · was raw `.substring`, cutting mid-word). Net-negative (removed 5 inline blocks). |
| **FF-5** | origin phrase → **provisional identity**: quoted + `.nb-newborn-basin` / `.subtheory-readonly-header-basin` modifiers (italic, normal weight, smaller, muted). A basin never reads as a named title. Named subs unchanged. |
| **FF-9a** | `overflow:hidden; text-overflow:ellipsis` on `.stb-title-input` (the clipped placeholder). |
| **FF-9c** | the Page's title-less-entry cite-line (which fell back to the note body that the quote already renders in full) is **suppressed when a quote will carry it**. Book/external + titled entries keep their distinct label. |
| **Maturity-ramp (FF-7 rider)** | **ONE source-of-truth** `_stMaturityWord` (renamed from `_searchSubMaturityWord`); Page inline + #search + Arc-Read face all call it. The Arc-Read face's divergent arc ramp (`_matWordFromScore`, forming/warming/mature/bright) is **removed** — it was that function's only caller. Now Arc-Read == Page == #search on the same score. |

## Two disclosures (Preston's rulings)
- **"Untitled sub-theory" retirement (22 sites) → 3B-MOTE**, not this rider — same reference/list surfaces
  3B-MOTE sweeps; keeps this rider 3R-scale.
- **FF-7 vocab application** (GATHERING state word · door labels · Yumi tag) is a **separate step** gated on
  Preston confirming the applied table — NOT in this rider. This rider carries only the maturity-ramp
  DESYNC (a defect fix; the canonical word was already agreed by 2 of 3 sites).

## Mechanical gates
| Gate | Result |
|---|---|
| Parse (T6) | `PARSE OK: js/views.js` |
| Band | views net logic **−67 B** (≤1,800) · css rule net **303 B** (≤350) — declared band HELD |
| ES3 | 0 violations in added lines |
| Orphan refs | `_matWordFromScore` = removed (only a removal comment); `_searchSubMaturityWord` = renamed (only a provenance comment); `_stMaturityWord` = def + 3 callers; `_stTruncPhrase` = def + 5 callers |
| Byte-locks (T7) | 14,681 / 10,255 exact |
| T5 | frozen renderers untouched |
| New hex | none |
| sw.js | v3.215 → v3.216 |

## Live verification — the rig (port 8807, SW killed)
| # | Behavior | Result |
|---|---|---|
| 1 | `_matWordFromScore` removed, `_stTruncPhrase`/`_stMaturityWord` live | ✅ |
| 2 | **FF-9b** word-boundary: `CLEAN_WORD_BOUNDARY: true` (stem is a prefix, next char is a space) — old raw cut left "…schools and" | ✅ |
| 3 | **FF-5** Page: header quoted, `-basin` class, `font-style:italic`, `font-size:19px` (was 30px display serif) | ✅ |
| 4 | **FF-5** regression: NAMING reverts to title (30px, normal, no `-basin` class) | ✅ |
| 5 | **FF-9c** Page: **0 cite-lines, 1 quote** for a title-less entry (no duplicate) | ✅ |
| 6 | **FF-9a** `.stb-title-input`: `text-overflow: ellipsis` active | ✅ |
| 7 | **Maturity ramp** Page: "Maturity · nascent" (sub ramp) | ✅ |
| 8 | **Maturity ramp** Arc-Read face: sub ramp present, old arc-ramp words gone | ✅ |

## Residuals
1. **VISUAL GATE owed** — the provisional phrase treatment + the placeholder ellipsis, Preston's eyes.
   ⚠ **Point it at the Arc-Read face dot/label pairing (red-team #2):** the maturity *word* now uses the
   `_stMaturityWord` bands (.34/.67) but the glow-dot COLOR class still uses `_arcReadMaturityKey`'s bands
   (.4/.7, class names `is-forming/is-mature/is-bright`). In the narrow .34–.40 and .67–.70 score zones the
   label and the dot's color band disagree. No functional break (no missing class); a pre-existing
   decoupling my word-ramp change made slightly more visible. Left as-is (the dot color is a separate
   visual signal; changing its bands is a visual call) — flag for the felt pass; trivial follow-on if
   Preston wants the dot unified to .34/.67 too.
2. **FF-9c also drops the generic "Note" label for an UNRESOLVABLE entry ref** (red-team #1) — when the
   entry record is missing (`!_clEn`: a deleted-note orphan ref, or a published/visitor view where
   `notebookEntries` isn't loaded), `citeLine` would have returned the constant `'Note'` (not a body-echo),
   but the suppression still fires and shows just the quote. **Benign** (the `<li>` is never empty — the
   suppression only fires when a quote will render; `'Note'` is a low-value generic label), but it is a
   behavior change beyond the stated "body-echo only" scope. Named, not swallowed.
3. **Semantic note (low):** the Page basin identity stays an `<h2>` styled provisional (not a heading
   element); pure styling per the ruling, element type unchanged. Named for the record.
