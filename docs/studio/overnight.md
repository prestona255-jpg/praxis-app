---
name: overnight
title: The Overnight Queue
kind: studio-source
current-round: R7
updated: 2026-07-10
---

# The Overnight Queue

Small, single-surface, revert-safe fixes that can run unattended overnight —
committed but **never pushed**, so Preston does a morning felt pass and pushes
what survives. This file is the **source of truth** for that queue; the
Builder's Overnight panel is a generated view of it (`tools/studio-build`).

Every session that spots a small fix appends it here as `status: proposed`. An
item only becomes `queued` (runnable tonight) after Preston + Claude confirm its
bucket in chat. No session self-promotes its own find to `queued`.

---

## A · Intake rubric — three buckets

Every discovered item lands in exactly one bucket. The rules below are the
contract; the run session enforces them literally.

### OVERNIGHT — runnable unattended

- **single-surface** — one surface per item.
- **CSS + views.js ONLY** — `state.js`, `integrations.js`, `firestore.rules`,
  and `sw.js` are **categorically excluded** (data-model, auth, and service-worker
  changes never go overnight).
- **objectively verifiable** — closable by parse / grep / byte-delta.
- **revert-safe** — a clean single-commit revert restores the prior state.
- **max 3 items per night.**
- **each item = its own independent commit** — never bundled.
- **on FAIL, revert that item and continue** — one failing item does not stop the night.
- **COMMIT ONLY — no push.** Preston pushes after the morning felt pass.
- **visual items carry `felt-pass-required: true`** and are **not closable by code
  evidence alone** — they wait for the felt pass.
- **STALE:** proposed items sitting **2+ rounds** get flagged STALE.

### ROUND GAP — belongs to a surface

- Attach it to that surface's ledger; it **rides that surface's round**. Not an
  overnight item.

### PROGRAM — needs its own slot

- Needs its own **master-sequence slot**; **mock-first**. Not an overnight item.

### Sorting

- Any session that discovers an item **appends it here with `status: proposed`**.
- Buckets are **confirmed by Preston + Claude in chat** before an item becomes `queued`.
- **No session self-promotes** an item to `queued`.

---

## B · Item schema

Each queued/proposed item carries these fields:

- **id** — stable handle (e.g. `ON-1`).
- **title** — short name.
- **plain** — one-sentence plain-English summary.
- **surface** — the single surface it touches.
- **bucket** — `overnight` | `round-gap` | `program`.
- **files** — the files the fix may touch (CSS + views.js only for overnight).
- **anchors** — the code anchors, once the run session finds them (`TBD` until then).
- **verify** — the objective check that closes it (parse / grep / byte-delta / felt pass).
- **revert** — how the single-commit revert restores prior state.
- **felt-pass-required** — `true` for anything visual; blocks code-only closure.
- **status** — `proposed` | `queued` | `ran-PASS` | `ran-FAIL` | `awaiting-felt-pass` | `closed`.
- **evidence** — the recorded proof once it runs (`—` until then).
- **report** — path to the run report (`—` until then).
- **proposed-in** — the round marker it was proposed in (for stale-flagging).

---

## C · Runs

One line per overnight run, appended by the run session. Format:

<!-- FORMAT: - YYYY-MM-DD · items: ON-a, ON-b, ON-c · ON-a PASS · ON-b FAIL · ON-c PASS · report: docs/studio/reports/<file>.md -->

- 2026-07-13 · items: ON-1, ON-4 · ON-1 PASS · ON-4 PASS · report: docs/checkpoints/overnight-on1-on4-2026-07-13.md
  (committed `--no-verify`, no sw.js / no cache bump per the batch law; both `awaiting-felt-pass` — Preston's morning felt pass + push close them)

---

## Queue

The live items. The generator groups these by `status`; queued ones (≤3) form
tonight's slate.

- id: ON-1
  title: Menu overlay bleed
  plain: On mobile the open hamburger menu doesn't fully cover the page — Shelf buttons (Resolve covers / Tidy library) stay visible beneath it.
  surface: books
  bucket: overnight
  files: CSS (+ views.js only if the overlay is built there)
  anchors: TBD by the run session
  verify: at 390px, open the hamburger — overlay covers the full viewport with no Shelf buttons visible beneath, page scroll is locked; mechanical grep of the overlay rule (full-height / fixed cover + body scroll-lock); felt pass at 390.
  revert: single-commit revert of the overlay + scroll-lock CSS (and the views.js overlay hook, if touched).
  felt-pass-required: true
  status: awaiting-felt-pass
  evidence: reproduced live 390 (menu 350px/812vh, 398px shelf exposed beneath, no scroll-lock) -> fixed (open .app-nav-list height:calc(100vh-56px)+overflow-y:auto; body scroll-lock in initNavMobileToggle) -> verified live (788px, covers to viewport bottom, body locked). css +436 / js +410; border-bottom 12->11; overflow-sites 4->6; PARSE OK.
  report: docs/checkpoints/overnight-on1-on4-2026-07-13.md (commit 0c7fbd4, --no-verify, no sw.js)
  proposed-in: R7

- id: ON-2
  title: Shelf → Manage (all sizes)
  plain: At every viewport, keep Add a book / Sort / Filters / the filter field visible and move the other eight shelf controls behind one "Manage" button (mobile bottom sheet, desktop anchored popover).
  surface: books
  bucket: overnight
  files: CSS + views.js
  anchors: renderShelf Manage scaffolding + openManageSheet/closeManageSheet (views.js ~4067-4141), the 7 manageBody.appendChild relocations, renderRoute scroll-lock/listener cleanup (views.js:359); .shelf-manage* CSS + mobile sheet / P2 FAB / P5 sticky (components.css "MW-1 · SHELF MOBILE PASS" block).
  verify: at 390 / 768 / 1280 — Add a book, Sort, Filters, and the filter field stay visible; Covers/List, Select, Scan shelf, Scan barcode, Bulk add, Resolve covers, Tidy library collapse behind ONE "Manage" control; mobile = bottom sheet (slides up, tap-outside + close affordance), desktop = anchored popover; one shared code path, Universal tokens; conforms to docs/studio/praxis-mobile-canon.md (thumb-zone, 44px targets, safe-area insets, motion restraint). Mechanical: grep renderShelf for the shared Manage handler; byte-delta within the run's band. felt pass at all three widths.
  revert: single-commit revert of the renderShelf toolbar restructure.
  felt-pass-required: true
  status: closed
  note: ABSORBED BY MW-1 — shipped as the P1 REFERENCE IMPLEMENTATION in the Shelf mobile pass (commit a405730, 2026-07-10), not overnight. One "Manage" control at every viewport; the 7 secondary controls relocate with handlers intact; mobile bottom sheet + desktop popover, one JS path. Both gates green (praxis-reviewer CLEARED + fix-red-team block fixed). felt pass at 390/768/1280 still Preston's (round-close gate).
  evidence: docs/studio/reports/mw1-2026-07-10.md (Stage A) — live 390 DOM readouts (sheet fixed/bottom/54vh, scroll-lock, focus-in/return, backdrop-tap, 44px targets, h-scroll 0); desktop 1265 popover anchored.
  report: commit a405730 (mw1: shelf mobile pass — canon P1-P9)
  proposed-in: R7

- id: ON-4
  title: Header search-bar sizing
  plain: The header search placeholder truncates mid-word ("Search books, autho…") and the ⌘K chip crowds the field; fix the sizing so the placeholder reads whole.
  surface: cross-cutting
  bucket: overnight
  files: CSS
  anchors: TBD (header search / spotlight input)
  verify: at all widths the placeholder reads whole (no mid-word truncation) and the ⌘K chip no longer crowds the field; mechanical — computed field width admits the full placeholder, no ellipsis clip; grep the sizing fix. Ties to the ledger's existing "placeholder truncation" gap — the run that closes this stamps that gap with a [fix:] anchor.
  revert: single-commit revert of the search-bar placeholder string.
  felt-pass-required: true
  status: awaiting-felt-pass
  evidence: reproduced live (placeholder 178.6px vs 137px input box -> clips ~42px, constant at 768/1280; field cannot widen — nav already -28.6px slack + 8px h-scroll at 768). Fix = shorten copy (Preston Q2 ruling): "Search books, authors, ideas…" -> "Search your shelf…" (110.6px, +26.4px margin). Verified reads-whole live 768. Shortlist + before/after in the report; final string is Preston's felt-pass swap.
  report: docs/checkpoints/overnight-on1-on4-2026-07-13.md (commit a8a851a, --no-verify, index.html)
  proposed-in: R7

- id: ON-5
  title: Floating lens caption
  plain: The "tap to find lenses in your library" caption floats awkwardly over the flower graphic at the bottom-right of Shelf.
  surface: books
  bucket: overnight
  files: CSS
  anchors: TBD
  verify: caption sits cleanly relative to the flower graphic at all widths; felt pass.
  revert: single-commit revert of the caption-position CSS.
  felt-pass-required: true
  status: proposed
  note: NOT runnable — awaiting bucket confirmation in chat.
  evidence: —
  report: —
  proposed-in: R7

- id: ON-6
  title: Info-button overlap
  plain: The floating i (info) button overlaps sidebar content at the bottom-left of Shelf.
  surface: books
  bucket: overnight
  files: CSS
  anchors: TBD
  verify: the info button clears sidebar content at all widths; felt pass.
  revert: single-commit revert of the info-button-position CSS.
  felt-pass-required: true
  status: proposed
  note: NOT runnable — awaiting bucket confirmation in chat.
  evidence: —
  report: —
  proposed-in: R7

- id: ON-7
  title: Book Detail h-scroll (.bk-surface box-sizing) — 760-1199 BAND ONLY (>=1200 fixed in DW-3)
  plain: In the 760-1199 band ONLY, the Book Detail base .bk-surface content-box overflows ~40px, producing a horizontal scrollbar. The >=1200 tier is RESOLVED (DW-3 424545c — box-sizing:border-box scoped to the book-detail >=1200 block; Preston's DW-3 ruling), and <=759 was always border-box (MW-3). This residual is the 760-1199 band's own owner.
  surface: book-detail
  bucket: overnight
  files: CSS
  anchors: .bk-surface base rule (components.css:10615, content-box) — MW3-BKBOX; the >=1200 fix is at the DW-3 book-detail block (components.css:~11049).
  verify: at ~1024 (760-1199 band), #book/<id> STILL has the ~40px h-scroll (baseline — this task fixes it); at 1280/1440/1920 already fixed (scrollWidth == clientWidth, DW-3). A 760-1199 box-sizing fix must NOT disturb the >=1200 or <=759 rules.
  revert: single-commit revert of the 760-1199 box-sizing CSS.
  felt-pass-required: true
  status: proposed (scope narrowed to 760-1199 at the DW-3 close)
  note: RE-SCOPED at DW-3 (Preston's ruling): the >=1200 half of ON-7 shipped in DW-3 (424545c, box-sizing:border-box in the book-detail >=1200 block, verified hScroll 0 @ 1280/1440/1920). What remains is the 760-1199 band only — its own overnight/round item. The DW-3 guard proved the fix is band-scoped: 1024 hScroll STILL 40 (base content-box), matchMedia false.
  evidence: R9b P8 sweep (docs/checkpoints/r9b-laneg.md) — Book Detail 32/32/32 @ 1280/1440/1920 (pre-existing); DW-3 close (docs/checkpoints/dw-3.md) — >=1200 fixed, 1024 band untouched.
  report: —
  proposed-in: R9b

- id: ON-8
  title: Bloom hint collides with marginalia text (INT-9)
  plain: The Yumi Bloom's "tap to think this through with me" hint overlaps note text bottom-right — present in all three of Preston's post-S7 felt screenshots, surface-independent, so it's the hint's own positioning.
  surface: yumi-panel (the Bloom hint chrome; overlays every surface)
  bucket: overnight
  files: CSS (+ views.js only if the hint's mount needs a class)
  anchors: TBD (the Bloom hint element + its position rules; z-ledger — Bloom 9999)
  verify: at 390 + 1280, the hint's bounding rect intersects NO notebook card text (geometry check on seeded cards); hint still appears and still opens Yumi (own-state sweep).
  revert: single-commit revert of the positioning CSS.
  felt-pass-required: true
  status: queued
  evidence: —
  report: —
  proposed-in: R-ARC Wave C (post-S7 felt checkpoint, Preston 2026-07-17 — ruled overnight-eligible standalone; NOT a ROOM-2 rider, band discipline holds)

---

## Confirmed non-overnight

Items that were reviewed and ruled OUT of the overnight rail — parked for their
proper bucket.

- id: DEL-1
  title: Delete lenses / categories / authors
  bucket: dedicated supervised build
  why: data-layer deletion semantics — mirror the deleteBook scrub pattern; not objectively-verifiable-and-revert-safe in the overnight sense.
  scheduled: at the next close-out re-plan.
  ruling: NOT overnight-eligible per the rail (touches data-layer deletion, beyond CSS + views.js).
