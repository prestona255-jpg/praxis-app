# Wave 8 · Lane A — The Living Field — STAGE 1 BUILD (refinement pass)

**Re-scoped** per Preston's go-ahead: the Living Field already shipped (Wave 1), so this is
a 4-item refinement, not a conversion. Verdict A (convert in place) and Verdict B (keep
`_stRenderShapes`, no marks.js routing) both accepted. READ face kept as the real
non-generative threads list (honest-placeholder idea retired).

**Repo:** HEAD `972fed6` == origin/main at Stage-0. Foundations byte-locked & UNCHANGED
through this build: `lumen-amber.css` MD5 `9879ddb83a7e68e8378c621e473b0a57` (14,681 B);
`marks.js` MD5 `772886c049d0d6d03d341507e602d88a` (10,255 B). CACHE_VERSION still
`praxis-v3.169` (bump deferred to Stage 2 ship).

**Dirty set (tracked):** `js/views.js` (+109/−14), `assets/components.css` (+7/−0). Nothing
else. (`test-arc-constellation.html` shows as a pre-existing working-tree deletion — it will
NOT be staged, per the standing fence.) `git diff --stat`: views.js 123 lines changed
(116 total insertions incl. components.css's 7; 14 deletions), no EOL flip. views.js grew
across the wave: +39 (items 1/2 + faint-exclusion fix) then item 3 (the reset-confirm gate,
which also replaced the old inline reset loop → the 14 deletions). Absolute sizes: views.js
789,202 B, components.css 522,737 B. `js/arc-constellation.js` NOT touched (not in the diff).

---

## Slice table

| Item | What was built | Files | Parse | Bytes | Grep |
|---|---|---|---|---|---|
| **1 — whisper seam** | New top-level no-op `_stYumiWhisperSeam(sub, cardBody){ return; }` (views.js ~10877) + one call inside `markConcentrate` right before `card.classList.add('is-on')` (views.js:10810). Named mount point for future generative Yumi; renders nothing today. | views.js | cscript exit **0** | +included in +37 | `_stYumiWhisperSeam` ×2 (def+call) |
| **2 — concentrate → gold threads** | `markConcentrate` classes the focal mark's edges `st-edge-lit` and all others `st-edge-dim` (selector `[data-st-edge-a]:not([data-st-edge-faint])` — solid edges only, faint layer left to its own identity); `markRelease` clears them via the same selector. CSS: `line.st-edge-lit{stroke:var(--lum-gold);opacity:1}`, `line.st-edge-dim{opacity:.14}`, + a `transition` on `line[data-st-edge-a]`. | views.js, components.css | cscript exit **0** | +included | `st-edge-lit\|st-edge-dim` ×6 (js) / ×2 (css); `data-st-edge-faint` ×3 (js) |
| **3 — Reset gated (Option A)** | Reset relabeled **"Reset placements"** and routed through a new `openArcResetConfirm(arcId)` in-DOM confirm panel (permanent-language copy + Reset placements/Cancel); reuses the shipped `.arc-confirm-*` chrome (**no new CSS**); the destructive position-clear loop moved into the confirm handler. Tidy/Restore untouched. | views.js | cscript exit **0** | +included | `openArcResetConfirm` ×3, `'Reset placements'` ×3, bare `Reset` textContent ×0 |
| **4 — fully-lit + amber sweep** | Verify-only: field chrome is already fully `var(--lum-*)`-tokenized (recon), and rest state is fully lit. No token drift or umber literal found; nothing to rewrite. The item-2 thread CSS is the only chrome addition. | (covered by 2) | — | — | forbidden umber literals in components.css: **0** |

**Parse gate:** views.js can't go through the ES3 cscript harness whole (`.catch`/`.finally`),
so the three edited/added functions (`_stYumiWhisperSeam`, `markRelease`, `markConcentrate`)
were copied verbatim into an isolated wrapper and parsed — `cscript //E:JScript` exit **0**
(`PARSE OK`). components.css is CSS (no JS parse); validated by grep + byte delta + live
computed-style.

---

## Live verification — computed-style / DOM (the hard evidence)

Rig: static server :8760, Claude_Preview CDP. **SW + caches cleared and reloaded** before
capture (first load served the stale v3.169 SW bundle — caught because `_stYumiWhisperSeam`
read `undefined`; after clear+reload it read `function`, confirming the edited bundle is
live). Seeded a real-shaped arc under a local `getCurrentUser` override: 5 sub-theories
(varied maturity), 3 threads (st1–st2, st1–st3, st3–st4; st5 isolated), 1 attached book
("The Attention Merchants" / Tim Wu), scattered positions.

**Item 2 — concentrate gold (desktop 1280), tap st1:**
- BEFORE: 3 edges each `opacity:0.85`, `stroke:url(#gradient)`; all 5 marks `opacity:1`, no class.
- AFTER: st1's threads (st1–st2, st1–st3) → class `st-edge-lit`, **`stroke: rgb(255,206,74)` (=#ffce4a=`--lum-gold`), `opacity:1`**. Non-focal thread st3–st4 → `st-edge-dim`, `opacity:0.14`. Marks: st1 `st-focal` op1; st2/st3 `st-linked` op1; st4/st5 `st-dim` **op0.26** (rest of field dims). `svg.is-concentrated`=true.
- RELEASE (tap background): edges → class `""`, `opacity:0.85`; marks → op1; `is-concentrated`=false; whisper off. (Confirms the `markRelease` edge-clear I added.)
- **At 390** (tap st3): st3's threads (st1–st3, st3–st4) both `st-edge-lit` gold op1; non-touching st1–st2 `st-edge-dim` op0.14. Identical behavior both widths.

**Item 1 — whisper seam:** `typeof _stYumiWhisperSeam === "function"`; called with args returns
`undefined` (no-op). On concentrate the whisper shows ONLY the deterministic relational line:
*"Attention as a scarce resource connects to 2 ideas: The economics of distraction,
Contemplative practice. Open the sub-theory →"* — no generative content, flow intact.

**Item 4 — fully lit:** at rest, all 5 marks `opacity:1`, no `st-dim`, `is-concentrated`=false.
Amber sweep: `grep` of the 4 forbidden umber literals across components.css = **0**; field
chrome is 100% `var(--lum-*)`. No rewrite needed.

**Faces toggle:**
- READ: `.arcfield-read` present, head "The threads in your field", **3 thread rows**, **5 sub rows**, first thread "Attention as a scarce resource ⟷ The economics of distraction" — real, deterministic, kept.
- PAGE: hands off to the REAL writing surface — "Open the page → `#subtheory/st1/build`", mark drawn via PraxisMarks. (Note: with no sub selected it defaults to the first sub-theory rather than a "choose one" prompt — pre-existing, outside the 4-item scope, not a regression.)
- FIELD restored after.

**Tidy / Restore (behavior verified, not rewired):** Tidy → label "Tidy"→"Restore",
`praxis_arc_tidy`=true, **all 5 marks recompose** scattered→radial. Restore → label back to
"Tidy", flag false, st1 returns to its seeded (353,479) center. View-model only, stored
placements untouched. ✓

**390 reflow:** `matchMedia('(max-width:759px)')`=true; `.arcfield-stage`
`grid-template-columns` collapses 2-track (`1fr 220px`) → **1 track (`342px`)**; rail stacks
**below** the constellation (`railBelowWeb`=true, full width, **no drawer** — matches the
Stage-0 call); **no horizontal scroll** (`scrollWidth 390 == clientWidth`); 5 marks render;
tap targets `min-height:44px`.

**Accessibility snapshot (desktop)** corroborates the whole field: ARC eyebrow + question +
"5 sub-theories · 1 book · tended today", faces tablist Field/Read/Page, "ASK YUMI WHAT SHE
SEES HERE", the SVG, Tidy/Connect/Reset/Layers, "Books in this arc → The Attention Merchants
/ Tim Wu", "＋ Add a sub-theory", drag hint, Yumi FAB.

### Residual — raster screenshots unavailable this session
`preview_screenshot` timed out (30s) on EVERY view including `#home`, at 1280 and 390, with
animations disabled — a session/environment-level capture failure, NOT a page hang (every
`eval` returns instantly; all DOM asserts pass; the text `preview_snapshot` works). Per the
protocol's evidence standard, live-DOM computed-style is the hard PASS/FAIL evidence and
stands; raster shots would have been corroboration only. Flagged honestly as UNVERIFIED-visual
pending a working capture (a Preston eyes-on comp-gate on the live deploy covers it at Stage 2).

---

## Independent review (praxis-reviewer, pre-HOLD)

**Verdict: CLEARED TO COMMIT** — all 9 gates PASS (ES3, CSS-tokens/no-umber, foundation
byte-locks, byte deltas reconciled via the CRLF-vs-LF blob math, EOL no-flip, scope discipline
= views.js + components.css only, no Firestore writes, seam is a genuine no-op, no regression to
drag/connect/hover/faces/tidy/reset — all re-render the full SVG so classes can't bleed).

It flagged one **dormant** latent issue: `querySelectorAll('[data-st-edge-a]')` also matched the
faint edge type (`line.st-layer-faint[data-st-edge-faint]`, arc-constellation.js:1076), whose
`#966E28` dashed identity would be overridden by `st-edge-lit`'s gold stroke IF a `faint:true`
edge ever existed (none do today). **Resolved in-wave** (not deferred): both selectors are now
`[data-st-edge-a]:not([data-st-edge-faint])`, so concentrate never touches faint edges. Re-parsed
(exit 0) and re-verified live — solid edges still light gold identically; every live edge is
`faint:false` so the exclusion changes nothing today, and future faint edges keep their identity.

## DEBT (logged per ruling — NOT fixed this wave)

**Two/three coexisting mark renderers.** The arc-interior draws sub-theory marks through
`arc-constellation.js`'s private `_ST_MARK_TABLE` / `_stRenderShapes` (a verbatim copy of the
16-mark spec), NOT through `assets/marks.js`'s `PraxisMarks.render`. A third renderer,
`tradition-forms-arc.js`'s `renderTraditionFormArc`, is dead on this route (only its neutral
`<defs>` are used live). Verdict B established unification onto `PraxisMarks.render` is
infeasible without editing byte-locked `marks.js` (halo, muted/colorful anatomy, drift/drag
`<g>` nesting, dot sub-layer, SVG-vs-HTML-span injection). The 16-mark *vocabulary* is
identical across renderers, so the contract's "marks via PraxisMarks" clause is satisfied in
substance, but the **duplication of the mark table across `marks.js` and
`arc-constellation.js` is real maintenance debt** — a future change to a mark's geometry must
be mirrored in both. Owner: a dedicated later wave (would require lifting shared geometry into
a byte-locked-compatible surface, out of scope here).

---

## Item-3 proposal — Tidy / Restore / Reset (awaiting Preston's call before any wiring)

**Current live behavior (verified):**
- **Tidy / Restore** (one button, label toggles) — view-model only, non-destructive; composes
  a radial layout without clearing stored placements; Restore brings them straight back. This
  is correct and safe. **Proposal: keep exactly as-is.**
- **Reset** (`data-st-control="reset"`, views.js:11682) — a bare button, **no confirmation**,
  that loops every sub-theory in the arc and `setSubTheoryPosition(k,null,null)` →
  **permanent, persisted** Firestore write-through, wiping all hand-arranged positions. This is
  the hazard: it sits one click away, visually identical to the safe Tidy, and is
  irreversible.

**Proposed relationship (pick one — this is the single HOLD decision):**
- **Option A (recommended):** Gate Reset behind a confirm using the existing
  `#arc-detail-confirm-host` modal pattern (already used for delete/hide-arc), with explicit
  permanent language ("Clear every hand-placed position in this arc? This can't be undone.
  Cancel / Clear placements"), and relabel the button **"Reset placements"** so it reads
  distinct from Tidy. Small, additive, reuses shipped confirm machinery.
- **Option B:** Keep Reset instant but relabel + demote it — move it into the Layers popover as
  "Reset placements", away from the primary control row, no confirm. Lighter, but still
  irreversible on one click.
- **Option C:** Drop Reset entirely — Tidy already gives a non-destructive composed layout, and
  a persisted "clear all placements" is arguably redundant. Removes the hazard at the cost of
  the one-shot permanent-clear affordance.

**DECISION: Option A — chosen by Preston and WIRED (views.js only).** `openArcResetConfirm(arcId)`
mirrors `openArcDeleteConfirm`, reuses the `.arc-confirm-*` chrome (no new CSS), and the
destructive clear runs ONLY on the panel's Confirm. Live-verified end-to-end (seeded 3 subs at
arranged positions): button relabeled **"Reset placements"** (Tidy stays "Tidy"); click →
confirm panel, stored positions INTACT ({180,140}); Cancel → panel gone, positions unchanged;
re-open → Confirm → all stored x/y cleared to null, panel gone, field re-rendered (3 marks).
Parse exit 0; dirty set unchanged (views.js only, no new CSS).

---

## STAGE 1 CLOSE — HOLD (all 4 items built + live-verified)

Items 1, 2, 3 (Option A), 4: **all built and live-verified**. Independent praxis-reviewer
CLEARED the 1/2/4 patch (faint-exclusion fix applied in response); a second pass grades the
item-3 confirm-gate addition. Nothing committed; CACHE_VERSION un-bumped until Stage 2.
Awaiting Preston's explicit "commit and push."
