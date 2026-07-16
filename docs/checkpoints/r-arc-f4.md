# R-ARC SLICE F4 — remove the "From how you read" blocks (+ N1, N2 riders) — BUILD

**Status: BUILT · RIG-VERIFIED (Page + Workshop + both riders). Awaiting red-team → review → commit. NOT
pushed.** Base **`bb70889`** / v3.216 → v3.217. Approved by Preston (routing rulings + felt-pass notes).

## Scope (Preston's rulings)

**Core F4 (D16):** remove the superseded **"From how you read"** Yumi blocks — the covenant (Yumi never
speaks unbidden) admits no exception even for grounded speech; that noticing returns via the raised-hand
margin seat in **Wave C**. **The WHOLE Page aside goes** (incl. the evidence-grounded "you marked this
same nerve" notes), per Preston. Plus two disclosed riders (F4 already touches these surfaces):
- **N1:** the workshop name-field placeholder → **"Name it…"** (the felt clip survived FF-9a's ellipsis;
  fix the copy, matching the Notebook panel's existing string).
- **N2:** **Finish dormant pre-mint** (FF-10 ruling) — disabled per the Slice 1 law, with a quiet reason
  tied to the naming invitation. Naming stays never-asked-never-forbidden; finishing requires a name.

## What shipped

**Removed (D16):**
- `renderSubTheoryPage`: the whole `aside.st-yumi` — the `stAddYumiNote` helper, the evidence-note loop,
  the reader-model note, the fallback prompt, the `stUser`/`stProf`/`stReadsAlong` reads that fed it, AND
  the now-dead `stEvidenceSourceBook` (its only caller was that loop). The grid drops `stGrid.appendChild(stYumi)`.
- `renderSubTheoryBuild`: the whole `div.stb-ymargin` block + its dead `stUser`/`stProf`/`readsAlong` reads.
- CSS: all `.st-yumi*` (13 rules) + `.stb-ymargin*`/`.stb-yd`/`.stb-yx` rules, and the dead selectors
  surgically dropped from 3 shared compound groups (`.is-focus` display:none, the mobile 44px group, the
  `:focus-visible` outline group).
- **`.st-grid` gutter fix (Preston-mandated, same slice):** `grid-template-columns: minmax(0,1fr) 240px`
  → `minmax(0,1fr)` — single column, **no blank right gutter** left by the removed margin.

**⚠ Reader-model infra UNTOUCHED:** only the two DISPLAY sites are removed. `getReaderModel` /
`profile.summary` are still read by Account ("What Yumi sees"), Profile threads, and the chat-grounding
in `yumi-brain.js` — all confirmed untouched (T2: `yumi-brain.js` byte-identical).

**N1:** `titleInput` placeholder `'Name the forming sub-theory'` → `'Name it…'`.

**N2:** `paintPub` now disables the Finish pill when `_stIsBasin` (`pub.disabled = true`, `is-dormant`
class, `title="Name it to finish"`); the click handler guards (`if (pubIsBasin()) return;`); CSS
`.stb-pubpill[disabled]{ opacity:.5; cursor:default; pointer-events:none; }` (the Slice 1 law). Re-evaluated
on the next render (as the mote/invite are) — naming a basin re-enables Finish on re-render.

## Mechanical gates
| Gate | Result |
|---|---|
| Parse (T6) | `PARSE OK: js/views.js` |
| Bytes (net logic) | **views −3,859 B · css −2,961 B** (a removal; N2 ~+450 B is dwarfed by the deletion) — matches the declared "strongly negative" band. N1 −17 B. |
| `"From how you read"` | **0** in js AND css (fully gone) |
| Orphan refs | `stAddYumiNote`/`stEvidenceSourceBook`/`stYumi`/`stb-ymargin` = comment-only in js; **0** live `.st-yumi*`/`.stb-ymargin*`/`.stb-yx`/`.stb-yd` CSS rules remain |
| ES3 | 0 violations in added lines |
| T2/T5 | `yumi-brain.js` / `arc-constellation.js` / `tradition-forms-arc.js` **byte-untouched** (reader-model generation + frozen renderers intact) |
| Byte-locks (T7) | 14,681 / 10,255 exact |
| sw.js | v3.216 → v3.217 |

## Live verification — the rig (port 8809, SW killed, reader-model consent ON to prove removal ≠ absence-by-consent)
| # | Behavior | Result |
|---|---|---|
| 1 | Page: `st-yumi` aside **gone** (with reads-along ON, where it WOULD have rendered) | ✅ `yumiAsideGone:true` |
| 2 | Page: **no blank gutter** — `.st-grid` computes to a single 1158px track, 1 child (stCenter) | ✅ `singleColumn_noGutter:true` |
| 3 | Workshop: `stb-ymargin` note **gone** | ✅ |
| 4 | `"From how you read"` absent in the DOM on both surfaces | ✅ |
| 5 | **N1** workshop placeholder = **"Name it…"** | ✅ |
| 6 | **N2** basin: Finish **disabled**, opacity .5, pointer-events none, title "Name it to finish" | ✅ |
| 7 | **N2** basin click-guard: a programmatic click (bypassing pointer-events) does **NOT** publish — status stays `draft` | ✅ |
| 8 | **N2** named sub: Finish **enabled**, no reason tooltip | ✅ |

## Residuals
1. **VISUAL GATE — PASSED (Preston, deployed v3.217, 2026-07-16, NO findings).** The Page reading room
   without its right margin (single-column composition) and the dormant Finish pill both cleared his eyes.
   Carry-item cleared in the Wave B handoff §7.
2. **N2 re-enable timing (low):** naming a basin in the workshop re-enables Finish on the **next render**
   (consistent with the mote/invite, which also update on re-render, not on the title blur). If Preston
   wants live re-enable, that's a follow-on requiring the workshop to re-render on naming.
3. **The raised-hand margin seat** (the covenant-correct return of Yumi's noticing) is **Wave C** — F4
   only removes; it does not replace.
4. **Studio-census drift (round-close currency, both gates flagged):** the studio census
   (`docs/studio/subtheory-build.md` + the generated `builder.html:~2654`) still names the removed
   `.stb-ymargin` in its FOCUS-MODE table. Consistent with how S1–S3B deferred per-slice studio-census
   updates — the R-ARC round is tracked via these `r-arc-*` checkpoints + `r-arc-plan.md`, and the studio
   surface markdown + Builder regen refresh at the **round close** (doing it per-slice for 12+ slices is
   prohibitive). Named so it is not lost.
