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

_(no runs yet)_

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
  status: queued
  evidence: —
  report: —
  proposed-in: R7

- id: ON-2
  title: Shelf → Manage (all sizes)
  plain: At every viewport, keep Add a book / Sort / Filters / the filter field visible and move the other eight shelf controls behind one "Manage" button (mobile bottom sheet, desktop anchored popover).
  surface: books
  bucket: overnight
  files: CSS + views.js
  anchors: TBD (renderShelf toolbar)
  verify: at 390 / 768 / 1280 — Add a book, Sort, Filters, and the filter field stay visible; Covers/List, Select, Scan shelf, Scan barcode, Bulk add, Resolve covers, Tidy library collapse behind ONE "Manage" control; mobile = bottom sheet (slides up, tap-outside + close affordance), desktop = anchored popover; one shared code path, Universal tokens; conforms to docs/studio/praxis-mobile-canon.md (thumb-zone, 44px targets, safe-area insets, motion restraint). Mechanical: grep renderShelf for the shared Manage handler; byte-delta within the run's band. felt pass at all three widths.
  revert: single-commit revert of the renderShelf toolbar restructure.
  felt-pass-required: true
  status: queued
  note: Mobile Canon P1 REFERENCE IMPLEMENTATION — the run session conforms it to docs/studio/praxis-mobile-canon.md.
  evidence: —
  report: —
  proposed-in: R7

- id: ON-4
  title: Header search-bar sizing
  plain: The header search placeholder truncates mid-word ("Search books, autho…") and the ⌘K chip crowds the field; fix the sizing so the placeholder reads whole.
  surface: cross-cutting
  bucket: overnight
  files: CSS
  anchors: TBD (header search / spotlight input)
  verify: at all widths the placeholder reads whole (no mid-word truncation) and the ⌘K chip no longer crowds the field; mechanical — computed field width admits the full placeholder, no ellipsis clip; grep the sizing fix. Ties to the ledger's existing "placeholder truncation" gap — the run that closes this stamps that gap with a [fix:] anchor.
  revert: single-commit revert of the search-bar sizing CSS.
  felt-pass-required: true
  status: queued
  evidence: —
  report: —
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
