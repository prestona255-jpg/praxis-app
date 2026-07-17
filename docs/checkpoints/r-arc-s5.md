# R-ARC SLICE 5 — REVERSE GEAR (dissolve a basin → motes) — BUILD LOG

**Status: BUILT · SELF-VERIFY PASS · red-team ✓ (1 BLOCK found+fixed) · reviewer PENDING · rig PENDING.**
Base `6ad6822` (config commit) = code state `dde64db`/v3.218. Model: OPUS. Mode: unattended. Recon:
`docs/checkpoints/r-arc-s5-recon.md`. Plan: `docs/r-arc-plan.md` Slice 5. **Fork F-B RULED B1** (delete
terminal; reverse gear = the loop's forward acts; never undelete).

## Scope built (dissolve = the one missing loop reverse; §4 recon shows ungather/rename/un-graduate/unlink already ship)
The reverse gear of FORMING a basin. A basin (unnamed draft sub-theory) holds its gathered notes as evidence
**references** — forming it never modifies the source notes, so they are always independently present in the
notebook. **Dissolve therefore removes only the basin record; the motes are already loose — nothing is
restored, nothing is lost** (genuinely recoverable → honors "nothing unrecoverable", distinct from terminal
delete). Offered ONLY on a basin with **no author-authored content** (no prose, no valueMarks — see BLOCK).

## Edits (3 files)
1. **`js/state.js`** — `function dissolveBasin(id)` (after `deleteSubTheory`). Record-field guards (no
   `_stIsBasin` dependency): exists · `header` ws-empty · `status!=='published'` · `bodyPublic`+`bodyIntellectual`
   ws-empty · **`valueMarks` empty**. Pass → `deleteSubTheory(id)` (cascade+persist); else `false`.
2. **`js/views.js`** — (a) `confirmDissolveBasin(id, afterDissolve)`: `.st-confirm` modal, reverse-gear copy
   ("The notes you gathered stay in your notebook — only the basin is cleared."), action button
   `.st-confirm-btn-primary` (neutral gold, not danger). (b) `renderSubTheoryBuild` foot SWAP:
   `footIsDissolvableBasin` (basin ∧ prose-empty ∧ valueMarks-empty) → quiet `.stb-dissolve` "Dissolve this
   basin" (→ route to arc); else the existing terminal `.stb-delete` (unchanged).
3. **`assets/components.css`** — additive: `.st-confirm-btn-primary` (+hover); `.stb-dissolve` grouped into
   `.stb-delete`'s shared base rule (identical props) with a distinct NEUTRAL hover; `.stb-dissolve` added to
   the mobile-44px + focus-visible rules (a11y parity, WS-B lesson).

## Design determinations (from recon; both flow from F-B + covenant + band — no new fork)
- **Affordance follows the object's nature:** a prose/value-empty basin gets quiet reverse-gear "Dissolve";
  named/authored sub-theories keep terminal "Delete" (whose "can't be undone" would be false on a note-only basin).
- **Guard mirrors between state + UI:** `footIsDissolvableBasin` ≡ `dissolveBasin`'s guards → never a dead
  control; a prose-typed-after-render race safely no-ops (dissolveBasin re-checks at click; canvas onBlur
  flushes bodyPublic synchronously before the confirm opens).

## Self-verify — PASS
| Gate | Result |
|---|---|
| Parse (cscript) | `PARSE OK: js/state.js` · `PARSE OK: js/views.js` |
| Bytes | state **+1,489** (band 512–1536) · views **+4,926** (2048–5120) · css **+622** (0–700) |
| Greps | `dissolveBasin` 1 def + **1 live caller** (`views.js:10348`; a 2nd hit at `:10312` is comment text) · `confirmDissolveBasin` def+caller · `footIsDissolvableBasin` 2 · 0 stale `footIsProseEmptyBasin` · valueMarks guard present (`state.js:2205`) · `.stb-dissolve` grouped + a11y |
| ES3 | 0 forbidden tokens in added lines |
| Frozen + sw.js | 0-diff (arc-constellation, tradition-forms-arc, yumi-brain, sw.js) |
| Byte-locks | lumen-amber.css 14,681 · marks.js 10,255 (exact) |
| EOL | repo norm `i/lf w/crlf`; numstat surgical (state 22/0 · views 109/13 · css 18/3) |

## Band note (comment-trim for headroom — S4 precedent; logic never over)
Initial drafts overshot on verbose comments: state.js first hit +1,847 (>1,536) and components.css +1,107
(>700) — both **comment-driven, logic within band**. Resolved by trimming comments + a DRY refactor
(`.stb-dissolve`/`.stb-delete` share one base rule). Final deltas all within band. No logic overage; no
silent widening (the components.css band was DECLARED at recon since the plan banded no CSS).

## Red-team — 1 BLOCK (found + fixed), 2 residuals disclosed
- **BLOCK (fixed) — valueMarks silent loss.** `dissolveBasin` originally guarded prose only. `valueMarks[].why`
  is author-typed free-text (`views.js:9405/9476`) authored on the basin's read page (register mounts
  `views.js:11113-11116`, owner-signed-in gate only, **no draft gate**), stored only on the sub-theory record.
  A value-marked basin could be dissolved → `deleteSubTheory` destroys the `why` notes while the copy reassures
  "only the basin is cleared." **FIX:** `valueMarks`-empty guard added to `dissolveBasin` AND to
  `footIsDissolvableBasin` (state guard + UI mirror). Recon §3 corrected (its §2 survey missed valueMarks).
- **R1 (residual — no live loss today):** `evidence[]` external-source (`kind:'external'`) + per-element
  `annotation` are also author-authored + record-only, but have **no live writer** for real users (read-only in
  the live UI; authored external/annotation exist only in `__praxis_seed__` published data, which dissolve
  refuses via `status==='published'`). Safe today; a future external/annotation editor reachable on a basin must
  extend the guard.
- **R2 (nit):** evidence `quote` is a point-in-time snapshot of note body copied at gather time; discarded on
  dissolve. Derived copy (the live note persists), not authored-unique — not a covenant violation.

## Reviewer — **VERDICT: CLEARED TO COMMIT**
Independently re-derived every gate from source: ES3 (0 violations), byte-locks exact (MD5 match), byte
deltas reproduced exactly (state +1,489 · views +4,926 · css +622), EOL surgical, no `.set/.update/.delete`
/ schema drift, yumi-brain 0-diff. Deep data-loss trace: `deleteSubTheory` never touches
`state.notebookEntries`; both gather paths reference-only; **the valueMarks BLOCK fix is complete and
field-for-field identical between the state guard (`state.js:2205`) and the UI mirror (`views.js:11440`)**.
Residual R1 confirmed TRUE by exhaustive `addEvidence(` grep (2 sites, both `kind:'entry'`; the only
`kind:'external'` literal is a synthetic yumi-brain test context, not a live writer). F-B boundary intact,
strict if/else (never both/neither), `.stb-delete` byte-identical, `--gold`/`--br-deep` contrast ≈7.9:1
(past AAA). Two non-blocking self-report nits caught + corrected above (1 live caller not 2; guard at
`:2205` not `:2206`). sw.js bump = its own gate at commit.

## Rig live-verify (INTERACTIVE-CONTROL SWEEP) — **PASS** (rig :8799, d0tester, SW/caches killed, fresh JS confirmed live)
Fresh JS asserted live before measuring: `dissolveBasin` present WITH the valueMarks guard,
`confirmDissolveBasin` present, `renderSubTheoryBuild` carries `footIsDissolvableBasin`.

| Control / check | Fired | Result | PASS |
|---|---|---|---|
| **B1 basin+note — foot control (own state)** | render workshop | `.stb-dissolve` "Dissolve this basin", title "Return its gathered notes to your notebook"; **`.stb-delete` ABSENT** (exactly one); quiet color `rgb(179,164,128)` | ✅ |
| **B1 — dissolve modal (own state)** | real `.click()` | `.st-confirm` "Dissolve basin"; copy "…notes you gathered stay in your notebook — only the basin is cleared"; **no "undone"**; primary "Dissolve" gold `rgb(210,162,62)` / ink `rgb(28,18,9)` (non-danger); Cancel present | ✅ |
| **B1 — dissolve outcome (the covenant)** | real `.click()` Dissolve | basin removed (subs 7→6); **note SURVIVED, body intact**; routed `#arc/…`; modal closed; **persisted** (localStorage: basin gone, note present) | ✅ |
| **B2 named — F-B boundary** | render workshop | terminal `.stb-delete` "Delete this sub-theory", no dissolve (exactly one) | ✅ |
| **B3 value-marked basin — the BLOCK fix live** | render workshop | terminal `.stb-delete`, no dissolve (valueMarks guard flips it though `_stIsBasin`=true) | ✅ |
| **B3 — state guard (defense in depth)** | `dissolveBasin(b3)` | returned **false**, record survives, `why` note intact | ✅ |
| **Shared-CSS bleed** | render Shelf/Arcs/Notebook | all render; `.stb-delete` computed base unchanged (block · DM Mono · 11px · `rgb(179,164,128)` · transparent); **console clean throughout** | ✅ |

## Final commit gate
sw.js `CACHE_VERSION 'praxis-v3.218' → 'praxis-v3.219'` (1 line, +1). Whole-slice self-verify + staging
isolated to the 4 code files + 2 checkpoint docs. **Local commit only. NOTHING pushes without Preston's
exact words** (the push word covers BOTH this commit and the earlier config commit `6ad6822`).
