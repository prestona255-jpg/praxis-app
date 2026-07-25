# CD-6 SPLIT-CHIP DESKTOP-CLICK FAILURE — STAGE 0 MECHANISM RECON
STARTED · HEAD fee3c72 · v3.257 live · desktop mouse fails / iPhone touch passes

## MECHANISM — PROVEN (rig 1360/1280/375, shipped v3.257 bytes, force-settled)

### The primary bug: the per-child pop is CLIPPED by the scroll container (NOT a dead click)
The child chip's handler fires fine — a real hit-tested click at a scrolled-INTO-VIEW chip returns
`elementFromPoint`=SPAN.lbl (the chip), `is-open` toggles TRUE, and `capRenderSplitChipPop` populates
the pop with 3 options (Inbox + candidates). The pop is INVISIBLE because it opens DOWNWARD into an
`overflow:auto` clip:
- `.capdoor-chip-pop{ position:absolute; top:calc(100% + 6px); ... }` (components.css:16472-16475) — the
  pop opens BELOW the chip. It is a descendant of
- `.capdoor-body{ overflow-y:auto; flex:1 1 auto; }` (components.css:16415) — the scrollable sheet body.
- Handler: views.js:23546-23550 (toggle `wrap.is-open` → render pop); show rule
  `.capdoor-split-chipwrap.is-open .capdoor-chip-pop{ display:block; }` (components.css:16515).
The split review is TALL, so its chips sit in the LOWER body — exactly where the user lands after
scrolling down to reach them. PROOF (chip scrolled to `block:'end'`, body visible 105–691):
chip 659–691 (visible, hittable), click→is-open TRUE, pop rendered (3 children), **pop rect 697–826 —
entirely BELOW the fold → `pop_visible_height_in_body = 0`.** The picker opens in the DOM and is 100%
clipped by the body's overflow. Symptom = "click does nothing, no picker, no options." EXACT match.

### Secondary facet (same root): the door FOOT intercepts below-fold chips at scrollTop=0
At scrollTop=0 the chips are entirely below the fold (hidden); the door's `.capdoor-foot` ⌘Enter `<kbd>`
hint (views.js:23734-23737; static, transparent) occupies that viewport band, so `elementFromPoint` at
a below-fold chip returns the foot's KBD. This is moot for the real flow (the user must scroll a chip
into view to click it, at which point it's hittable) — it's the same root: the review is taller than the
short corner-card body.

### Why iPhone passes but desktop fails
Position-dependent clip, NOT a desktop-only CSS branch (I reproduced the clip on mobile too at the
worst-case chip position). DESKTOP = a SHORT corner-card body (~586px) with the review's chips crowded at
the fold → clicking them reliably clips the downward pop. On Preston's iPhone the taller bottom sheet +
touch-scroll left the tapped chip where its pop had room. Same root defect; desktop geometry makes it the
reliable case. (Top-level door chip works everywhere because #capContext sits near the TOP of the body →
its downward pop is within the visible area.)

### Why rig T4 passed anyway (the L18 divergence)
T4 fired `chip.click()` PROGRAMMATICALLY (dispatches to the element, bypassing hit-testing) and asserted
on DOM STATE (`is-open`, `pop.children.length` = 2) — which are TRUE even when the pop is clipped
invisible. It never (a) used a real hit-tested click, nor (b) checked the pop's VISIBLE rect vs the body
fold. Programmatic-fire + DOM-presence assertions miss both real-click hit-testing AND visual clipping.

### The horizontal scrollbar — SEPARATE defect (own named task, NOT folded)
NOT reproduced in the rig at 1280/1360, pop open OR closed (`scrollW==clientW`; pop_right 413 < body_right
505), NOR with a long unbreakable URL token (the token WRAPPED: `.capdoor-split-text` scrollW 405 ==
clientW 405; whiteSpace pre-wrap). The pop-clip never produces horizontal overflow. So the scrollbar is a
distinct, content-specific defect → **named task SPLIT-HSCROLL** (needs Preston's exact triggering note to
reproduce; candidate = a specific wide element with real data). Do NOT fold into the click fix.

## PROPOSED MINIMAL FIX (Preston rules; NOT implemented in Stage 0)
Root: the split pop opens DOWNWARD into the body's overflow clip. Fix, scoped to the split review only
(door-core capChip/capRenderChipPop/`.capdoor-chip-pop` base rule UNTOUCHED):
- **(A, recommended) Flip-up-when-needed.** In the chip handler (views.js:23547-23550), after opening,
  measure room below the chip inside the body; if insufficient, add `.open-up` to the chipwrap. Add one
  SCOPED rule: `.capdoor-split-chipwrap.open-up.is-open .capdoor-chip-pop{ top:auto; bottom:calc(100% + 6px); }`.
  Blast radius: split-review pop only. Predicted delta ≈ **+450–650 B** views.js + **~+130 B** components.css.
- (B, simpler) Open the split pop UPWARD unconditionally (`.capdoor-split-chipwrap .capdoor-chip-pop{
  top:auto; bottom:calc(100%+6px); }`) — split chips are always in the lower body; risk only for a chip at
  the very top of a short review (never the case: head + rows sit above). Delta ≈ **+130 B** components.css.
- ESCAPE-VALVE CHECK: the fix lives in `capRenderSplitReview` + a `.capdoor-split-chipwrap`-scoped CSS
  rule — NOT door-core. Escape valve NOT triggered.
- Related (already named, NOT this fix): SPLIT-FOCUS-MODE (hide composer chrome + the redundant door-foot
  "File it"/⌘Enter during a review) would also remove the below-fold crowding; CDSEG-NIT2 (chip-pop
  click-outside) unaffected.
