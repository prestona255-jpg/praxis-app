---
name: praxis-mobile-canon
kind: canon
state: v1
patterns: 9
breakpoint: 759
verification: two-layer (static relational + live 390 CDP)
---

# PRAXIS MOBILE CANON — v1

The mobile interaction language for Praxis. Nine patterns, each with an
applies-when rule, the Praxis-specific constraint, and a verifiable check.
A surface's mobile pass walks this list; its responsive manifest cites
patterns by id. Every check is enforceable through the standing two-layer
mobile gate: static relational check + live 390 CDP render.

Rails that bind every pattern: strict ES3 (var/function only), Universal
v1.2 tokens only, breakpoint 759/760, no --lum-* / concat token families,
no setProperty seams, no transform-rig tokens.

Chip vocabulary (rendered per surface in the Builder):
- desktop-only — no mobile pass yet (default when the surface ledger has
  no `mobile:` frontmatter field)
- reflowed — collapses cleanly at 759 with two-layer gate evidence cited
  in the ledger, but canon patterns not yet applied
- native — mobile pass complete; applicable canon patterns verified, with
  evidence anchors in the ledger

A surface earns an upgrade only through ledger evidence written during a
round or mobile pass — never by editing the Builder.

---

## P1 — Bottom sheet

Applies: secondary or overflow actions on mobile — management controls,
bulk operations, pickers, anything that would crowd the primary surface.
Reference implementation: Shelf Manage (ON-2, all-sizes ruling — bottom
sheet on mobile, popover on desktop, same visible set everywhere).

Rule: sheet is a fixed-position panel anchored to the bottom edge, sliding
up over a dimmed backdrop. Backdrop tap and an explicit close control both
dismiss. Sheet content scrolls internally if tall; the page behind does
not scroll while the sheet is open. Focus moves into the sheet on open and
returns to the trigger on close. ES3 handlers only. Sheet chrome uses
--color-surface / --line tokens; backdrop is a token-derived ink at low
opacity, never a hard-coded black.

Check (static): sheet container class exists in markup; open/close
functions in views.js are ES3; backdrop element has a dismiss handler;
grep 0 transform-rig tokens in the sheet CSS.
Check (live 390): sheet opens from its trigger, covers ≤ 90% of viewport
height, internal scroll works, backdrop tap dismisses, focus returns.

## P2 — Thumb-zone anchoring

Applies: the primary action of any mobile surface — the one thing the
user came to do (Add a book, Catch a note, publish).

Rule: at ≤759, the primary action lives in the bottom third of the
viewport — bottom-anchored bar, floating control, or the composer itself
sitting low. Header-row buttons are acceptable only for secondary
navigation, never for the surface's primary verb. Bottom-anchored chrome
respects safe-area insets (P4).

Check (static): the media block relocates or duplicates the primary
control below the content region for the surface's real selectors (named
in recon — relational check, no silent no-op).
Check (live 390): primary action is reachable with the screen's lower
third without scrolling the control into view.

## P3 — Tap targets ≥ 44px

Applies: every interactive element on every surface — buttons, chips,
list rows, toggles, close controls, mark pickers.

Rule: minimum effective hit area 44×44 CSS px at ≤759. Visual size may
stay smaller when density matters; padding or a pseudo-element expands
the hit area. Adjacent targets keep ≥ 8px of separation so mis-taps
don't fire neighbors.

Check (static): mobile media block carries min-height / padding rules for
the surface's interactive classes.
Check (live 390): sample the surface's smallest controls via
getBoundingClientRect — computed hit height ≥ 44 on each sampled control;
report the sampled list and values, not a bare pass.

## P4 — Safe-area insets

Applies: app-wide — the viewport meta, plus any fixed or bottom-anchored
chrome (nav rail, sheets, composers, toasts).

Rule: viewport meta includes viewport-fit=cover. Fixed chrome pads with
env(safe-area-inset-bottom) (and -top where pinned high) so standalone
PWA mode on notched/home-indicator devices is edge-to-edge without
controls hiding under system UI. Insets are additive padding, never
replacements for existing spacing tokens.

Check (static): grep index.html viewport meta for viewport-fit=cover
(count 1); grep CSS for env(safe-area-inset — count matches the number
of fixed chrome elements, reported as a list.
Check (live 390): with CDP device emulation, bottom-anchored controls
clear the home-indicator band.

## P5 — Large-title collapse

Applies: primary destination pages with a page title (Shelf, Arcs,
Notebook, Account) — not modals, sheets, or interior faces.

Rule: title renders large at rest (Cormorant display scale) and compacts
into a sticky bar as the page scrolls, keeping orientation without
spending vertical space. Position: sticky implementation; transitions
limited to opacity and font-size steps — no transform rigs. Collapse is
CSS-first; any JS assist is a scroll listener in ES3 with a passive flag
omitted (ES3 addEventListener options caution — use the simple boolean
form).

Check (static): sticky rule present on the title bar selector inside the
mobile block; grep 0 transform-rig tokens.
Check (live 390): scroll the page — title compacts, stays visible, no
layout jump, no h-scroll introduced.

## P6 — Segmented control

Applies: switching between sibling panes or leaves that share one region
at ≤759 — the pattern that replaces side-by-side leaves when width
collapses. Precedent: Notebook Capture|Working toggle.

Rule: a two-to-four segment control, full-width or centered, directly
above the region it switches. Exactly one segment active; switching never
loses in-progress state in the hidden pane (panes hide, they are not
destroyed — the W3 drop-risk lesson: preserve wiring like
setProfile/covenant when relocating). ES3 handlers; active state uses
gold tokens per the 3-gold split, restraint laws apply.

Check (static): both panes' markup persists in the DOM structure across
the toggle (display switch, not re-render that drops handlers) OR the
re-render provably rebinds every wired feature — recon enumerates the
feature inventory either way.
Check (live 390): flip segments with a draft in progress in each pane —
nothing lost, handlers alive.

## P7 — Input discipline

Applies: every text input, textarea, and writing canvas on mobile.

Rule: font-size ≥ 16px on inputs at ≤759 (kills Safari's focus zoom-jump).
inputmode attributes on non-prose fields (numeric, search, email).
Composers account for the software keyboard: the active input stays
visible when the keyboard opens — bottom-anchored composers ride above
it, and long pages don't trap the caret under it. No autofocus on page
load at mobile widths (it fires the keyboard before the user chose to
type).

Check (static): mobile media block sets input/textarea font-size ≥ 16px
for the surface's real input selectors; grep inputmode count matches the
non-prose field list; grep 0 autofocus in mobile-rendered markup paths.
Check (live 390): focus the composer — caret visible, no viewport zoom.

## P8 — Scroll discipline

Applies: app-wide, every surface, every state.

Rule: zero horizontal scroll at 390 — the standing hard gate. Internal
panes that scroll (sheets, rails-turned-drawers, long lists inside fixed
chrome) scroll on their own axis without trapping the page. Fixed-px
side-rail widths are 0 unguarded at ≤759 (the W3 rule). Sticky headers
never overlap the first content row.

Check (static): grep the mobile block — desktop multi-column grid
selectors reappear as 1-col inside it (the relational check); 0 unguarded
fixed-px rail widths.
Check (live 390): document.scrollWidth ≤ document.documentElement
.clientWidth on every routed surface state exercised; report the values.

## P9 — Motion restraint

Applies: any transition or animation introduced by mobile work.

Rule: motion vocabulary is exactly two moves — opacity fades and the
sheet's slide-up (a transition on the sheet's own position/translate
only, scoped to the sheet class). Nothing else animates. A
prefers-reduced-motion block zeroes both. No transform-rig tokens, ever
(standing rail). Durations short and token-consistent; no springs, no
bounces, no parallax.

Check (static): grep transition properties in mobile-introduced CSS —
set is a subset of {opacity, transform-on-sheet-class}; prefers-reduced-
motion block present; grep 0 transform-rig tokens.
Check (live 390): toggle reduced-motion emulation in CDP — sheet still
opens/closes instantly and correctly.

---

## Application law

1. Desktop-first stands: main builds ship desktop; mobile evolutions are
   their own passes (locked July 9).
2. A mobile pass takes one surface, walks P1–P9, applies what fits, and
   cites pattern ids in the responsive manifest and ledger evidence.
3. Small conforming items (P3 tap targets, P7 input font) are CSS +
   views-only and overnight-eligible under the standing rails; structural
   items (P1 sheet conversions, P5 title collapse, P6 pane surgery) are
   pass work, never overnight.
4. Chip upgrades require ledger evidence with anchors; the Builder only
   renders what the ledgers prove.
