# R-ARC SLICE 4 — ONE DOOR (EXPANDED) — STAGE 0 RECON + RE-BAND

**Status: RECON COMPLETE · RE-BAND PRESENTED AT THE PRE-BUILD GATE · AWAITING PRESTON'S RULING. Nothing
built, nothing staged.** Base **`379dead`** / live v3.217. Model: **OPUS** (cross-surface UX restructure).

Trigger: "SLICE 4 — GO" (Preston, 2026-07-16), EXPANDED per routing ruling #5 (FF-8) and inheriting the
arc-picker BOUND FINDING (plan Slice 4). This slice HALTS here — the RE-BAND is ruled before any build.

---

## 1. SCOPE — three workstreams (the expansion)

- **WS-A — ONE DOOR** (plan Slice 4 core, REQ#4/#7b): collapse the **3** sub-theory creation paths to one.
  `notebookCreateSubTheory` (flow b) becomes THE door; the `#arc/<id>/new-subtheory` route (flow a) and the
  Yumi `nameSubTheoryFromThread` accept (flow c) retire/fold. No route orphaned; grep proves exactly one
  live creation path after.
- **WS-B — FF-8 NOTE ACTION-ROW COLLAPSE** (ruling #5 expansion): the 6 equal-weight actions on a notebook
  note card → one primary + overflow; the destructive **Delete** comes OFF the row.
- **WS-C — ARC-PICKER GROUND-CORRECT** (BOUND FINDING): the shared picker renders dark-on-light under any
  `lum-amber-deep` surface. Ship it ground-correct (light popover, not an inline dark box). One shared CSS
  re-light serves every site.

---

## 2. CENSUS — the 3 creation paths (EXHAUSTIVE, matches T9)

`createSubTheory` def at `state.js:2073`; **exactly 3 call sites** (escaped grep `createSubTheory(`):

| Flow | Trigger | Call site | Lands | Slice-4 disposition |
|---|---|---|---|---|
| (a) `#arc/<id>/new-subtheory` route | 2 "＋ Add a sub-theory" controls set the hash (`views.js:12723`, `views.js:13117`) → route handler `views.js:560` | `createSubTheory(parts[1], {})` @ **`views.js:561`** | mints draft → `/build`; null-arc → silent `location.replace('#arcs')` | **RETIRE / fold to the one door** |
| (b) `notebookCreateSubTheory()` @ `views.js:2620` | "Create sub-theory →" (btn wired `views.js:2415`) | `createSubTheory(arcId, {header,originEntryId})` @ **`views.js:2630`** | newborn card + door | **KEEP — becomes THE door** |
| (c) `nameSubTheoryFromThread()` @ `views.js:3308` | Yumi "Accept" a name proposal (`yumi-ui.js:392-393`) | `createSubTheory(arcId, {header,bodyPublic})` @ **`views.js:3324`** | can auto-mint an arc; no door | **RETIRE / fold** |

Exhaustive-absence proof: `git log -S "createSubTheory(" -- js/` = **4 commits ever** (matches the plan's T9);
no 4th live path. The two `new-subtheory` hash-setters are the only reachers of route (a).

---

## 3. PICKER INVENTORY — the BOUND FINDING is APP-WIDE (⚠ premise correction: 4 sites, not 5)

`buildArcPickerPanel` def at **`views.js:14043`** (renders `panel.className='arc-picker-panel'`). Escaped grep
`buildArcPickerPanel(` = def + **4 live invocations** (no 5th anywhere):

| # | Enclosing fn | Call site | Mounts under wrap | Ground today | Slice-4 |
|---|---|---|---|---|---|
| 1 | `openGatherArcPicker` (2600) | `views.js:2605` | `.notebook lum-amber-deep` (1935) | **DARK bug** | the DOOR's picker — ships ground-correct |
| 2 | `shelfMoveToArc` (6229) | `views.js:6235` | `.shelf lum-amber-deep` (4225) | **DARK bug** | survives; re-lit by the shared fix |
| 3 | `openBookArcPicker` (14119) | `views.js:14126` | `.bk-surface lum-amber-deep` (8467) | **DARK bug** | survives; re-lit by the shared fix |
| 4 | `openEntryArcPicker` (14162) | `views.js:14168` | `.notebook lum-amber-deep` (1935) | **DARK bug** | survives; re-lit by the shared fix |

**Root cause (confirmed):** `.arc-picker-panel` reads `background:var(--surface-2)` + `border:var(--ink-4)`
(`components.css:5125-5126`), labels/status read `var(--ink-3)`. `lum-amber-deep` repoints `--surface-2 →
--surface-d2`, `--ink-4/--ink-3 → --muted` (`theme.css:369-372`). EVERY major wrap carries `lum-amber-deep`
(home 1499/1519, notebook 1935, arcs 3923, shelf 4225, book 8467, st-page 10740/52/91, st-build 11086/109),
so **all 4 pickers render dark-on-light.** Preston saw only the notebook instance; it is systemic.

**⚠ CORRECTION for the gate:** the ruling said "all **5** buildArcPickerPanel sites." Source proves **4**
invocations (`openGatherArcPicker`, `shelfMoveToArc`, `openBookArcPicker`, `openEntryArcPicker`) + the def.
The `openFileToBookPicker` (book picker, comment `views.js:3370`) and the send-to-sub-theory picker (comment
`views.js:14227`) are SEPARATE functions that *mirror* the panel, not `buildArcPickerPanel` call sites. The
shared `.arc-picker-panel` re-light serves all 4 real sites in one change.

---

## 4. FF-8 — the note action row (`renderNotebookEntry`, `views.js:14419-14676`)

Container `div.notebook-entry-acts` (`views.js:14529`). The 6 equal-weight `<a>` actions, in append order:

| # | Action | Class | Guard | Site |
|---|---|---|---|---|
| 1 | Gather / Gathered ✓ | `.notebook-entry-gather` | gatherable, non-journal (journal → 🔒 lock indicator) | 14545 |
| 2 | ask Yumi | `.notebook-entry-drawout` | gatherable, non-journal, `maybeDrawOut` exists | 14560 |
| 3 | Add to arc | `.notebook-entry-add-to-arc` | always | 14571 |
| 4 | File to book | `.notebook-entry-file-to-book` | Inbox only (`filed===false`) | 14590 |
| 5 | Send to sub-theory | `.notebook-entry-send-to-subtheory` | always | 14613 |
| 6 | **Delete** (destructive) | `.notebook-entry-delete` (+ `-confirm` / `-cancel`, 3-link click-to-confirm) | always | 14626 |

Census note (`docs/studio/notebook.md:166`): **inbox = 6**, book tab = 5 (no File-to-book). FF-8 = 1 primary
+ overflow; **Delete off the row** (its 3-link confirm pattern preserved, relocated).

**CSS spread (⚠ the row is styled THREE times over):** base `4224-4261`; legacy hover-gate
`.notebook .leaf-left .notebook-entry-acts` `9845-9851`; and `lum-amber-deep` re-light blocks
`11931-11952` / `13250-13255` / `13316`; focus `5345`. The overflow restructure must satisfy all three
grounds — this is the largest CSS unknown in the band.

---

## 5. BYTE ANCHORS (measured `wc -c`, pre-build)

| File | Bytes | In-scope regions |
|---|---|---|
| `js/views.js` | **999,364** | 560-585 (route a) · 2600-2652 (door b + gather picker) · 3308-3368 (flow c) · 14043-14126 (picker def) · 14419-14676 (note card + acts row) |
| `js/yumi-ui.js` | **84,790** | 392-393 (flow c accept caller) |
| `assets/components.css` | **712,558** | 4224-4261 + 9845-9851 + 11931-13316 (acts) · 4265 + 5122-5194 + 5350-51 + 5778 + 6433 (arc-picker) |
| `js/state.js` | 87k-class | `createSubTheory` (2073) — expected **0 change** |
| `assets/lumen-amber.css` | **14,681** (LOCK) · `assets/marks.js` **10,255** (LOCK) | untouched |

sw.js `CACHE_VERSION` today = **`praxis-v3.217`** → bump to **v3.218** at final push only.

---

## 6. THE RE-BAND (declared; HARD halt on breach; comment-only clears by line classification)

The plan's original band (`views.js +3…+7 KB` · `yumi-ui.js ±0.5 KB`) covered **only WS-A** and banded **no
CSS**. The RE-BAND adds WS-B (FF-8) and WS-C (picker) and introduces a net-new `components.css` band. WS-A is
retirement-heavy (flow a route + flow c body deleted) so its net can go **negative** — the plan's "+3…+7"
lower bound does not fit; the RE-BAND spans negative-to-positive.

| File | RE-BAND (net) | Per-workstream basis |
|---|---|---|
| `js/views.js` | **−4 KB … +7 KB** | WS-A −4…+6 (retire a+c ≈ −3.5; unified door + optional-arc handling + repoint 2 controls ≤ +6) · WS-B +0.5…+2.5 (overflow container + toggle; 6 handlers remain) · WS-C +0…+0.5 (mount hook, if any) |
| `js/yumi-ui.js` | **−0.5 … +0.3 KB** | retire the `nameSubTheoryFromThread` accept caller (392-393) |
| `assets/components.css` | **+1.0 … +4.0 KB** *(NET-NEW band)* | WS-B FF-8 overflow across 3 ground blocks +1.0…+2.5 · WS-C `.arc-picker-panel` re-light + popover treatment +0.5…+1.5 |
| `js/state.js` | **0** | `createSubTheory` unchanged |
| `sw.js` | **+1 CACHE_VERSION** (v3.217→v3.218) | final push only |

Frozen census-only (untouched, verified at build): `arc-constellation.js`, `tradition-forms-arc.js`, the
yumi eval-gate region of `yumi-brain.js`. Byte-locks hold: `lumen-amber.css` 14,681 / `marks.js` 10,255.

---

## 7. FORKS & CORRECTIONS FOR PRESTON'S RULING (surfaced per THE FORK RULE)

- **S4-1 (factual):** picker sites = **4, not 5**. Ship all 4 ground-correct via the shared `.arc-picker-panel`
  re-light? (Honors the "all sites" intent with a one-cluster fix.)
- **S4-2 (scope):** the bug is **app-wide** — the shared re-light also corrects shelf move-to-arc + book-detail
  pickers, slightly beyond "the door's picker" but the same change. Confirm shipping all 4.
- **S4-3 (design):** FF-8 **primary action** — which of {Gather · Add to arc · Send to sub-theory} leads the
  collapsed row? (BD1 precedent: one ranked primary.) A shape decision, needed before the WS-B build.
- **S4-4 (design):** the one door's **arc context** — the 2 "＋ Add a sub-theory" controls fire from arc
  surfaces (arc already known); the notebook door PICKS the arc. The unified door must accept an optional
  pre-selected arc. Confirm the door serves both entry contexts.
- **Band notes:** (i) the `components.css` band is **net-new** (plan banded only JS) — ratify it; (ii) WS-A
  views.js can be **net-negative** — the RE-BAND's negative floor is deliberate, not an error.

---

## 8. CROSS-CHECK + GATES AHEAD

- **Independent cross-check COMPLETE + FOLDED (see §9).** The `repo-mapper` pass CONFIRMED all three counts
  (3 creation paths · 4 picker sites · 6 FF-8 actions) and the app-wide picker bug. It surfaced 3 precision
  deltas (WS-A writer scope · WS-C true mechanism · FF-8 single-surface) — folded in §9. **None breach the
  RE-BAND; the §6 band stands.**
- **Gate order (handoff §5), unchanged:** RE-BAND ruled → build slice-by-slice (WS-A → WS-B → WS-C) →
  self-verify (parse via `cscript … tools/parse-check`, byte band, greps, EOL via `git ls-files --eol`) →
  **fix-red-team** → **praxis-reviewer** (verdict gates the commit) → rig live-verify → checkpoint → STOP.
- **Rig discipline:** load `.claude/rig/`; fresh port; kill SW + caches before measuring; `d0tester` stub.

---

## 9. CROSS-CHECK FOLDED (repo-mapper, complete)

The `repo-mapper` source map (read-only) **CONFIRMED**: 3 creation paths, **4** picker call sites (not 5),
6 FF-8 actions, and the app-wide dark-picker bug on all 4 sites. Three precision deltas refine the recon;
**none move the RE-BAND (§6)**:

- **Δ1 — WS-A gate phrasing (CLAIMING-ABSENCE):** `createSubTheory` is the sole *user-triggered* creation
  path, but `state.subTheories[k]=` is ALSO written by two NON-creation code paths — the Firestore
  merge/hydration (`integrations.js:265`, loads existing remote docs on sign-in) and the `migrate()` seed
  injection (`state.js:3462`, the gated `__praxis_seed__` fixture via `podMkSt`). The WS-A gate proves
  **exactly one live creation TRIGGER** (createSubTheory reached only via the one door); a "sole write path
  to `state.subTheories`" claim would be FALSE and must not ship.
- **Δ2 — WS-C true mechanism (refines §3):** the dark repoint is driven by **`[data-ground="dark"]`**
  (`theme.css:362-387`), set per-route by `umberGroundDark` (`views.js:397`) — NOT the `.lum-amber-deep`
  class (§3's/the plan's attribution is imprecise; the class re-lights each surface's *bespoke* tokens, but
  none of Notebook/Shelf/Book relight the *generic* `--surface-2`/`--ink-4` the picker reads). The
  relight-generic-tokens technique is PROVEN precedent in the same file — `.arcs.lum-amber-deep` sets
  `--surface-2:#efe7d6` (`components.css:1707-1734`), + About/Yumi-sees/Account/Profile/Import.
  **⚠ NEW FORK S4-5 (WS-C approach):** *narrow* (edit `.arc-picker-panel` + rows/labels to explicit light
  tokens — smallest blast radius; safe because the picker never mounts on genuinely-dark chrome) vs *broad*
  (relight generic tokens per light-surface scope — follows precedent but changes every in-surface consumer
  of those tokens). **Recommend NARROW.** Band unchanged either way.
- **Δ3 — FF-8 is single-surface:** `renderNotebookEntry` has **exactly one caller** (`views.js:2232`, the
  notebook-spread left leaf). "inbox 6 / book 5" is the inbox-vs-book TAB *within* the notebook spread, NOT
  a second (book-detail) surface — book-detail renders its notes by a different path. WS-B edits one render
  fn on one surface (across its tab + ground states). NARROWS WS-B; band holds.
- **Note — `git log -S`:** repo-mapper lacked Bash and could not run it; I ran it — `git log -S
  "createSubTheory(" -- js/` = **4 commits ever** (T9 confirmed).
