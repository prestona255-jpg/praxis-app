# R-FIRSTSHELF — COVERS + WALKER-VOICE · device felt-pass fix (P0)

Base 2fef2f1 (v3.279). Model Opus 4.8, default effort. Four text/layout defects
observed by Preston on-device walking v3.279. Fixes: assets/components.css +
js/intros.js (+ sw.js bump v3.279 -> v3.280). views.js UNTOUCHED.
Evidence = rendered rig geometry (localhost:8790, uid d0tester, 390x734,
fonts-settled). Screenshot capture is dead agent-side (headless pane, no
compositing) -> device pixels are Preston's; measured geometry + quoted rules here.

## DEFECT 1 — mid-word title breaking — PASS (Blink-proven; iOS felt = Preston)
Two title elements, two jobs (Preston's ruling):
- `.cov-t` (typeset title INSIDE the ~47px cover slot) is STAND-IN ART, not the
  label. It was breaking words mid-word ("Independen/ce") via overflow-wrap:break-word
  in a box too narrow for serif titles -- ubiquitous because 12/15 covers don't
  resolve (cover-resolution is a separate non-goal). FIX: widen the inset
  (padding 8px 7px 7px 10px -> 7px 4px 7px 6px; inner 47px -> 54px) and
  overflow-wrap:break-word -> overflow-wrap:normal, so whole words stay on the line
  and a word too wide simply CLIPS at the box edge -- never stacks (clip is
  engine-independent; normal never breaks a word on any engine).
- `.cap .t` (the 64px caption below) IS the label -- UNCHANGED (the S2 fix already
  gives word-boundary wrap + line-clamp + ellipsis + last-resort break).

Rig proof (54px `.cov-t`): every title wraps at word boundaries; only genuinely-long
single words clip. Character-survival in the 54px box at iOS Cormorant metrics
(~1.15-1.20x wider than Blink): Revolution (widest ordinary) 10/10 = 100%;
Prescription 11/12 = 92%; Independence 9-10/12 = 75-83%. Worst case 75% > half ->
reads as a designed cover cut, not breakage (Preston ruled: accepted as treatment,
no smaller-font alternative). `.cap .t` (64px): all word-boundary, nothing clips.

## DEFECT 2 — floating controls collide with content — PASS
ONE shared token, applied as bottom padding on every scroll container carrying a
floating control (no per-screen drift):
  :root{ --floating-stack-h:160px; }   /* tallest reach: shelf-raised "+" = --sp-5
     (24) + 62 lift + 42 height = 128, + 32 gap = 160 */
  #app padding-bottom: calc(var(--floating-stack-h) + env(safe-area-inset-bottom))
     (was calc(96px + ...))
  .scan-rv-wrap bottom pad: var(--floating-stack-h) (was 120px)
Clearances (pad - control reach), rig 390x734 -- safe-area cancels between control
and pad, so these hold on iOS regardless of the dynamic viewport:
  Home "+" FAB:                 160 - 66  = +94
  Shelf "+" FAB (raised):       160 - 128 = +32   (was -32 OVERLAP at 96px pad)
  Shelf "+ Add a book"
    (.shelf-add-primary, fixed): 160 - 68  = +92
  Scan Review/Shelve foot:      160 - 74  = +86
Home clearance measured directly (matches construction exactly), validating the
model for the others. All four of Preston's observed collisions covered.

## DEFECT 3 — capture-sheet "Scan a book"/field overlap — UNPROVEN (do NOT close)
NOT reproducible in Blink: `.capdoor-modes` and `.capdoor-field-wrap` are static
normal-flow siblings (field cleanly below modes, 0px overlap). The overlap requires
the wrapped mode row / body to mis-lay-out on iOS-WebKit.

- ATTEMPT 1 (v3.280, DISPROVEN on device): `.capdoor-modes{ align-content:flex-start;
  width:100%; box-sizing:border-box; }`. Device walk showed the overlap UNCHANGED.
  align-content only redistributes when the flex container has extra cross-axis space
  (a constrained height) — modes has content-height, so it was a no-op. REVERTED at
  v3.281 (not stacked as dead CSS).
- ATTEMPT 2 (v3.281, current, UNPROVEN): `.capdoor-body{ ... min-height:0; }`. The body
  is a flex item (flex:1 1 auto) in the column-flex sheet with overflow-y:auto and
  content overflowing its box by a MEASURED 24px (@390 note mode). Default
  min-height:auto lets iOS-WebKit refuse to shrink the item, so overflow-y:auto never
  engages and the field lays over the modes' 2nd row. min-height:0 lets it shrink and
  scroll. Canonical iOS flex-scroll signature. Zero effect in Blink (it already
  shrinks; field still starts exactly at modes.bottom, 0 overlap).

STILL UNPROVEN — a green Blink rig does NOT close it; rests on Preston's device walk.
If Attempt 2 also fails on device, next hypothesis: de-flex the modes row.

## FINDING 2 (v3.281) — shelf section header over the iOS status bar — FIXED
Mechanism: on mobile the nav is position:relative (an intentional iOS-composite-bug
avoidance, components.css ~5572) and scrolls fully away; once gone, page content —
which carries no top safe-area — scrolls under the iOS status bar (dark band-header
text over the clock, no nav behind). Root PRE-EXISTING; the D2 token (144->160) merely
surfaced more of it by raising max-scroll 64px (measured). Do NOT revert the token.
FIX (direction A, the status-bar scrim):
  index.html:    <div id="statusbar-scrim" aria-hidden="true"></div> (shell, before <nav>)
  components.css: #statusbar-scrim{ position:fixed; top:0; left:0; right:0;
                    height:env(safe-area-inset-top,0px); background:var(--surface);
                    z-index:25; pointer-events:none; }
Ground-color decision: background:var(--surface) — the SAME per-ground token the mobile
nav paints (flips light/dark via [data-ground="dark"] on <body>, set per route by
renderRoute; `books` IS in umberGroundDark so the shelf body is dark and its nav+scrim
are legitimately dark). So the scrim is IDENTICAL to the nav's status-bar-zone color on
every route (verified scrimBg===navBg on shelf/home/signed-out) — it reads as the nav's
cap persisting. z:25 = above content, below nav (30) and every overlay. Verified: height
0px in rig (no-op non-notch); scan-surface (z9000), capdoor backdrop (z10020)+sheet
(z10021) all COVER it; signed-out welcome not broken; band header z:auto(0) < scrim(25)
so status-bar-zone content paints under the scrim. pointer-events:none.

## DEFECT 4 — pre-auth orientation card — PASS
Per-page intro cards fired for signed-out visitors ("Yesterday you marked Freire..."
shown to someone who has marked nothing). FIX (js/intros.js, top of maybeShowPanel,
BEFORE markPanelSeen so the seen-flag is not consumed pre-auth):
  if (typeof getCurrentUser === 'function' && !getCurrentUser()) { return; }
Rig proof: signed-OUT + seen-flag cleared -> no .intro-panel-wrap, seen-flag stays
false; signed-IN -> panel fires ("Where today gathers"), seen-flag then set. About's
"Re-enter a page" retake (showPanel/startJourney) is a deliberate action, ungated.

## GATES
PARSE OK (cscript, js/intros.js exit 0). ES3 clean (0 arrow/const/let/class/backtick
in added JS). views.js UNTOUCHED. CSS tokens resolve (--floating-stack-h 160px;
.cov-t overflow-wrap normal; .capdoor-modes align-content flex-start). SMOKE PASS
(Shelf + Arcs list & #arcs + Notebook render; all 21 modules 200; console clean of
app-origin errors -- only environmental 404/SW-fetch/no-camera).

## BYTE DELTAS (LF-normalized vs 2fef2f1) + CR
  assets/components.css  +1,902  CR=0
  js/intros.js             +554  CR=0
  js/views.js                +0  (untouched)
  sw.js  version string only (v3.279 -> v3.280)

## SEPARATE FINDING (flagged, NOT fixed this loop)
docs/FIX-PROTOCOL.md sec.1/sec.2 reference docs/LAUNCH-STATUS.md as the status
ledger, but that file does not exist; the live ledgers are BOARD.md +
docs/studio/sequence.md. Its own cleanup task, not folded here.

## NON-GOALS respected
Cover resolution (3/15) untouched; the "John Steinbeck as title" spine misparse
untouched; no redesign beyond the four defects; onboarding spine / scan logic /
arcs / notebook / yumi untouched; no new deps, no refactors; the 106 untracked
entries and the foreign stash untouched.
