# THE ROOM BRIEF — INT-2 · INT-3 · INT-4 (no build; for Preston's ruling)

**Charter source: Preston's felt findings + the July 17 vision session (design-partner
deferral). Pattern: the UNFILED-REACH brief. NOTHING BUILDS until he rules this brief;
Slice 7's ratified lighting technique survives inside this frame and builds only after
the ruling.** Base `4890eb3` / live v3.223. All anchors verified against LIVE code this
session (the S6c stale-comment law).

The mandate this brief answers, in Preston's words: *"the space to create and visualize
my theories feels off"* — and its root, from INT-4's charter: **states mapped to
separate places.** Every stretch of capture → basin → workshop → page → publish reads
as an obstacle because each STATE of a thought lives on a DIFFERENT surface with a
door between each.

---

## 1. INT-4 — THE JOURNEY AUDIT (code-grounded station walk)

### 1.1 The stations as built (every anchor live-verified)

| # | Station | Surface | Arrive by | Code anchor |
|---|---|---|---|---|
| 1 | CAPTURE | Notebook writeline (or book-detail composer / import overlay) | nav click | `captureNote` (views.js:3216 region); book-detail same-session composer :14238-14257 |
| 2 | FILED/INBOX | a card in a notebook tab | automatic | register default; bookless → Inbox (`bookIds:[]`) |
| 3 | GATHER | the same cards, gather toggle per note | 1 click per note | `notebookGathered` :1669 (S2-persisted) |
| 4 | ARC CHOICE | gather bar + picker popover | 1–2 clicks | "Choose an arc"/Change :2363 → `openGatherArcPicker` :2371 |
| 5 | MINT | "Create sub-theory →" → NEWBORN CARD (in place; "no auto-nav" :2249) | 1 click | `notebookCreateSubTheory` :2393 |
| 6 | WORKSHOP | `#subtheory/<id>/build` | "Open the workshop →" 1 click | S4's one door |
| 7 | NAME | title blur in the workshop (the mint) | typing + blur | `updateSubTheory` title-blur |
| 8 | PAGE | `#subtheory/<id>` (read; R6 law) | "Open the page →" 1 click | FF-7 door |
| 9 | PUBLISH | Finish pill (workshop) | 1 click + choreography | `pubDone`; FF-10 pre-name gate = STILL OPEN (never ruled) |

**Count, capture→published (single note, happy path): 4 route-level surfaces**
(Notebook · Workshop · Page · back to Workshop to finish) **+ 3 inline stations**
(gather bar · arc picker · newborn card) **≈ 8–9 deliberate clicks** before any prose
is written — and **every door discards the previous station's context** (the gathering
disappears at the workshop door; the workshop disappears at the page door). The rail
slice (v3.223) closed the worst context loss (evidence now travels INTO the workshop);
the Room charter closes the rest.

### 1.2 Root critique — CONFIRMED at the code level

States are places: unfiled lives in Inbox, gathered lives in the gather bar, the basin
lives in a newborn card, the draft lives in the workshop, the finished piece lives on
the Page. Each transition is a route change that unmounts the prior state's UI. The
diagnosis is structural, not cosmetic.

### 1.3 Collapse proposals — EACH checked against binding rulings

| # | Proposal | Saves | Prior-ruling check |
|---|---|---|---|
| **C1** | **Create lands IN the Room.** "Create sub-theory →" navigates directly to the Room with the gathered notes present as spatial cards; the newborn card's two jobs (orientation + door) are absorbed by ARRIVING. The notebook keeps a quiet newborn RECEIPT (restyled card, no door duplication). | 1 station + 1 click; kills the largest context loss | **⚠ CONFLICTS with S4 as shipped** ("no auto-nav; the author STAYS in the notebook flow," views.js:2249 — Preston-felt-passed). NOT proposed silently — **his re-ruling required.** |
| **C2** | Page↔Workshop: **NO merge proposed.** R6 (Page=read · workshop=sole-editor) is binding and felt-passed twice. The obstacle here is context loss, not the click — and INT-3's Room fixes it by making the workshop side rich enough that the crossing is rare. | — | R6 PRESERVED by design |
| **C3** | **Capture inside the Room.** A quiet in-Room writeline calling the existing `captureNote` (same door, new doorway) so a mid-composition thought needn't leave. Captures land unfiled → immediately visible in the rail's Unfiled group (F1). | 2 route hops per stray thought | No creation-path conflict (capture ≠ minting; T9 untouched). New doorway disclosed. |
| **C4** | Inbox reach from theorizing | — | **ALREADY SHIPPED** (UNFILED-REACH, v3.223). Recorded as the pattern's proof. |
| **C5** | FF-10 finish-gate: the audit surfaces it again — Finish is reachable pre-name (verified live in Wave B). | honesty | **OPEN RULING** (never decided); the Room brief carries it to Preston rather than absorbing. |

---

## 2. INT-3 — THE ROOM AS CANVAS (the charter, made concrete)

### 2.1 The shape

The workshop rebuilt as ONE surface with two coexisting regions:
- **The prose canvas** — writing-canvas.js UNCHANGED at its core (the spike's F-C laws
  govern all decoration; Slice 7 lights it here).
- **The FIELD** — an open spatial region where gathered evidence renders as
  **draggable cards**. Preston arranges freely. **The app NEVER interprets
  arrangement** — no clustering, no inference, no "you grouped these": ruled, and
  codified below as a tripwire. Tap a card = INT-2's note door. FF-1's beat
  orientation lives on this surface (the GATHERING/DRAFT/FINISHED vocabulary from
  FF-7 extended into a quiet loop-position strip).

### 2.2 Position state (the S2 lessons applied)

- **Additive field on the sub-theory:** `evidenceLayout: { [evidenceElementId]:
  { x, y } }` — **normalized 0..1 coordinates** relative to the field (survives
  viewport/device changes), keyed by the evidence element's own `id` (already
  stable, state.js:2409).
- **Both-path ensure (T3):** rides `ensureSubTheoryFields` + the Firestore merge
  twin; additive → NO schema bump. Owner-gated writes only. Debounced persist on
  drag-end (never per-mousemove).
- **Covenant tripwire (NEW, proposed as standing):** `evidenceLayout` NEVER enters
  Yumi context — `assembleContextData` (yumi-brain.js:222-226, the single filter
  site) must not carry it, verified by grep at every Room slice.
  Never-asked-never-forbidden extends to space: arrangement is thinking, not data.

### 2.3 Interaction + mobile (F-E answered)

- Drag: pointer-tracked (mousedown/touchstart family, ES3), 44px handles (mobile
  canon P3), **drag-threshold vs tap** disambiguation (tap = door, drag = arrange).
- **Mobile (recommendation M1-lite):** the SAME field, touch-pannable (scroll axes),
  press-hold to drag, tap to open; cards full-size. Fallback under felt failure: the
  rail's list form remains (shipped, v3.223) — the field never becomes the ONLY way
  to reach evidence. Desktop-composition mandate holds.
- Focus mode: the field recedes with the rail (`.is-focus` hides it — shipped
  behavior inherited).

### 2.4 What the field is NOT (scope fences)

Not a mind-map (no edges/links between cards) · not the arc constellation (T5
renderers untouched) · not an outliner (no order semantics) · not an input to ANY
model call. Cards are the SAME evidence the rail lists — one data source, two
projections; the rail remains the accessibility floor.

---

## 3. INT-2 — THE NOTE DOOR (notes become places)

### 3.1 Recon answers (live-verified)

- **(b) Does an edit path exist today? NO durable one — precisely:**
  `deleteEntry` exists (state.js:2044-2065; ONE caller, views.js:15016) and a
  **same-session-only** body update exists (views.js:14251-14256 — the book-detail
  composer holds `entryId` in a closure; once the session/route ends, no UI can ever
  edit that note again). Notes are create-once. This is DWF-1's MARG-EDIT gap,
  confirmed at today's anchors.
- Provenance data all exists read-side: filed book (`entry.bookIds`), arcs
  (`entry.arcIds`), woven appearances (scan `subTheories[*].evidence` for
  `kind:'entry' && refId === noteId` — the mirror-read of FF-12), timestamps.

### 3.2 The design

- **Route `#note/<id>`** — the note as a place. **This IS Slice 10** (the plan's
  note-deep-link): spotlight + `#search` retarget from bare `#notebook` to
  `#note/<id>`, and spotlight's dead `en.title` match retires — ONE design, not two.
- The surface: the note body (marginalia render via `wcRenderMarkdown`, lit per 6c;
  journal/question plain until their render pass) · a PROVENANCE panel (filed book
  with its door · basins/drafts it's woven into, each with a destination-named door ·
  arcs · created/updated) · the existing acts (gather, delete).
- **Durable editing lands here** — a WritingCanvas mount on the note body (the
  book-detail composer precedent, made durable). Closes MARG-EDIT. **Disclosed
  divergence:** woven `quote` snapshots (frozen at weave-time, state.js:2413) do NOT
  retro-edit — the Page keeps citing what was woven; the note door shows the living
  text. Honest, and arguably correct scholarship; flagged for the ruling.
- Openings: tap a notebook card BODY (no new FF-8 row action — ruled) · tap a field
  card in the Room · search/spotlight results · (future) 6c's lit spans per F-F.

---

## 4. SLICE MAPPING under the charter

| Slice | Becomes | Est. band (density-classed, declared per-recon) |
|---|---|---|
| **ROOM-1** | The field: spatial canvas + draggable cards + `evidenceLayout` (T3) + mobile pan + tap/drag split | NEW FILE `js/room-field.js` (interaction, ~mixed density ~30 B/line): CODE 6–9 KB · views wiring 2–3 KB (DOM ~38 B/line) · CSS 1–2 KB |
| **ROOM-2** | The note door: `#note/<id>` + provenance + durable edit + **absorbs Slice 10 wholly** (spotlight/search retarget + dead-match removal) | views (DOM ~38 B/line) 5–8 KB · spotlight 0.3–0.8 KB |
| **ROOM-3** | Old Slice 12 under the charter: Room composition + FF-1 orientation strip + raised-hand VISIBILITY (proven by measurement) + riders INT-1 "Na…" (confirmed) + FF-11 (conditional, band-permitting) | views/CSS (DOM ~38 B/line) 4–7 KB; the raised-hand SEAT's Yumi half stays Slice 9 |
| **Slice 7** | ROOM-LIGHTING — unchanged mandate, builds INSIDE the Room after ROOM-1 (technique ratified; F-C laws; per-keystroke proven safe, cadence per S6c F3) | views 2–4 KB (algorithmic ~25 B/line) + matcher reuse |
| **Slices 8 · 9** | Unchanged (dismissal store; Yumi raised-hand seat below the frozen gate) — after the Room core | per plan |
| **C1 / C3 / C5** | Ride ROOM-1 (C1, if re-ruled) / ROOM-3 (C3) / Preston's ruling (C5) | disclosed at their recons |

Proposed order: **ROOM-1 → 7 → ROOM-2 → ROOM-3 → 8 → 9.** (ROOM-2 could precede 7
if Preston wants the note door felt sooner — no dependency either way.)

## 5. DECISION POINTS (Preston rules; recommendations marked)

- **D1 — field composition:** (A) prose floats over a full-bleed field · **(B)
  field pane beside the prose, resizable emphasis (recommend — preserves the
  writing posture the felt pass already PASSED)** · mobile = stacked/pannable.
- **D2 — mobile field:** **M1-lite pannable field (recommend)** vs M2 list-only.
- **D3 — C1 (create lands in the Room):** conflicts with S4's shipped "stays in the
  notebook" — **your re-ruling; I recommend C1 WITH the notebook receipt.**
- **D4 — C3 (in-Room capture):** recommend YES (same `captureNote` door).
- **D5 — note editing scope:** **full durable body edit (recommend — closes
  MARG-EDIT)** vs append-only; quote-snapshot divergence stands either way.
- **D6 — positions:** **free x/y (recommend)** vs grid-snap.
- **D7 — ROOM-2 absorbs Slice 10 wholly:** recommend YES (one design).
- **D8 — C5 / FF-10:** Finish pre-name — gate it to named drafts, or leave open?
  (Carried from Part 4 of the routing report; still unruled.)

## 6. COSTS + honesty

Multi-session: ROOM-1 and ROOM-2 are each a full slice-with-gates; ROOM-3 and 7 are
mid-size. Estimates above are charter-tier, density-classed per the standing pricing
lesson; **each slice declares its own two-figure band at recon** — estimates here are
not bands. Risks named now: drag-vs-scroll on touch (the one genuinely new
interaction class in Praxis — ROOM-1's recon spikes it in the rig first) ·
`evidenceLayout` growth on huge evidence sets (cap-free like RR8, same disposition) ·
the covenant tripwire needs its grep gate wired into every Room slice's checklist.

**Deliverable status: brief complete, awaiting Preston's ruling. No Room code
exists; nothing builds until the word.**

---

## RULINGS (Preston, 2026-07-17) — ALL EIGHT DECIDED; REMAP APPROVED

- **D1 = REC** — field beside the prose canvas, one surface. **D2 = REC** —
  M1-lite mobile; **the rail's list = permanent accessibility floor, never
  removed.** **D4 = REC** — in-Room capture via the same `captureNote` door.
  **D5 = REC** — full durable note editing (closes MARG-EDIT); woven quote
  snapshots not retro-edited. **D6 = REC** — free x/y, never interpreted.
  **D7 = REC** — ROOM-2 absorbs Slice 10, one design.
- **D3 — PRESTON RULED: CREATE LANDS IN THE ROOM.** A knowing reversal of
  S4's felt-passed stay-put flow, by his word. RIDER: honest landing — one
  gesture returns to where you created from; no stranding.
- **D8 — RULED: Finish dormant until named, REAFFIRMED as EXISTING LAW.**
  **Reconciliation (this brief's "still unruled" claim was WRONG):** the gate
  is SHIPPED and doubly guarded — `pub.disabled = basin` + "Name it to
  finish" title (views.js:11287-11291) + the click-guard `if (pubIsBasin())
  return;` (:11295). My claim repeated the routing report's Part-4 framing
  without re-verifying live code — the claiming-absence law, violated and
  caught by Preston's record. **The genuinely open remainder is NAMED:
  FINISH-CHOREO** — §4b's finish choreography (privacy sweep → threshold
  question) is unbuilt; the click flips status instantly (:11297-11298).
  A named item, not a re-build of the shipped gate.
- **COVENANT TRIPWIRE RATIFIED as standing law (T11):** `evidenceLayout`
  never enters `assembleContextData` — arrangement is thinking, not data.
  Added to the plan's tripwire roster; in force from ROOM-1 forward.
- **SLICE REMAP APPROVED:** ROOM-1 → 7 → ROOM-2 → ROOM-3 → 8 → 9;
  density-classed bands per-recon per the standing pricing lesson.
