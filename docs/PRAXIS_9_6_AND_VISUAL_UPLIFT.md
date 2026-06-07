# Praxis — Stage 9.6 lock + Visual System Uplift plan

Supersedes the open items in `PRAXIS_9_6_SCOPE.md` (most are now decided below).
Three parts: (1) lock Stage 9.6 for the checklist now, (2) name the app-wide
visual uplift as its own initiative, (3) a kickoff scaffold for the deep-dive
that realigns the checklist and roadmap in a fresh chat.

---

## Part 1 — Stage 9.6: the constellation workspace  (lock now)

**What it is.** The arc Web view becomes an interactive thinking-workspace, not a
static render. Sub-theories are luminous identity-panes the user arranges; books are
a quiet evidence layer beneath them; both connect.

**Locked decisions**
- **Palette:** Scheme A (soft multi-hue — lavender, peach, rose, amber-rust, sage,
  slate-blue) as identity colors, on a vibrant golden-wheat ground with an amber
  question-glow. Luminous translucent panes (lit from behind), not flat saturated fills.
- **Marginalia marks:** gathered (hollow teal) vs incorporated (solid teal + tether),
  in the `--marginalia-color #1d9e75` family. **Visibility is optional** — a toggle
  hides them.
- **Books:** a quiet, smaller, dimmer evidence layer tethered to the sub-theories they
  feed. A book feeding 2+ sub-theories renders once and bridges them — intersectionality
  made visible. **Visibility is optional** — a toggle hides the whole layer.
- **Motion:** alive, per the agreed scope-refinement (reading surfaces stay still; the
  constellation is the thinking-workspace where gentle, diegetic motion is allowed).
- **Map vs workspace:** resolved in favor of **workspace** (draggable, arrangeable).

**Build implications (the honest weight)**
- Position must persist → new schema fields on the sub-theory (x/y, and arc layout).
- Book layer is **derived** from `evidence[].refId` (kind `book`) deduped across the
  arc's sub-theories — no new schema to read it.
- "Attach a book" = `addEvidence`; "resonance" = `linkSubTheories` (already shipped).
- Drag, hover cards, the toggles, and the book layer are all new UI.

**Suggested sub-stage split (buildable increments, each verifiable)**
- **9.6a** — schema + position persistence (x/y on sub-theory, migrate, `saveState`). Foundation, no visual change.
- **9.6b** — re-skin: Scheme A + golden wheat + luminous panes + gathered/incorporated marks + maturity-luminosity + the marginalia toggle. (Replaces the 9.5 muted render.)
- **9.6c** — interactivity: drag (persisting position), hover cards, add sub-theory, resonance connect (wires `linkSubTheories`).
- **9.6d** — the book evidence layer: derived book nodes, tethers, bridges, book-attach (`addEvidence`), the Books toggle.

---

## Part 2 — The Visual System Uplift  (named initiative)

**Decision:** this design-and-interaction standard — the golden-wheat material language,
luminous treatment, the editorial chrome, the considered motion-flow, the interaction
quality — applies to **every page and surface** of Praxis, not just the constellation.

This is an **initiative**, not a single dated stage. It spans: theme.css evolution
(reconcile the canonical palette to the locked direction), and a per-surface uplift of
the shelf, Notebook, book detail, the writing surface, the Yumi panel, settings, empty
states, and onboarding. The deep-dive (Part 3) turns it into a sequenced plan.

---

## Part 3 — The deep-dive  (new chat) — kickoff scaffold

**Why a new chat:** clean context for a whole-app audit; this thread is design-saturated.

**What to audit (dimensions)**
1. **Setup & onboarding** — first-run, auth, empty states, the entry experience.
2. **Data & channels** — what's Firestore-synced vs localStorage-only (arcs, notebook,
   sub-theories are currently local-only — a real launch gap, the A2 item); the
   `saveState` chokepoint; `ensureBookFields` / `ensureSubTheoryFields`; the Netlify
   Anthropic proxy; `getYumiContext` (still stubbed).
3. **Surfaces** — shelf, Notebook (Marginalia + Journal graph), Arcs (list + the new
   constellation workspace), book detail, the writing surface, Yumi panel, transparency
   view, settings — each scored for functionality gaps AND design-language gap.
4. **Functionality gaps** — the Stage 9.4 field-notes items (F1–F6), persistence,
   Yumi eval/TTS, citation (Stage 10), Yumi transparency (Stage 11).
5. **Roadmap re-sequencing** — fit 9.6, the uplift, and the existing stages (10, 11,
   A2 sync) into one coherent order.

**Inputs to bring to that chat**
- `praxis-design-system.md`, `theme.css`, this doc, the current `checklist.html` + roadmap.
- A screenshot of the final builder mockup (the locked aesthetic target).
- `state.js`, `views.js`, the relevant stage files, the field notes.

**Output of the deep-dive**
- A realigned `checklist.html` + roadmap.
- A per-surface uplift backlog (functionality gap + design gap per surface).
- A clean stage sequence: 9.6a–d, the uplift surfaces, and the existing roadmap, ordered.

---

## Sequencing — the answer to your question

Yes to your plan, refined — and the checklist edit folds into the new chat too:
1. **Now (this chat):** decisions are captured — that's this doc. Nothing to edit yet.
2. **New chat:** open it with the Part 3 inputs (this doc + `checklist.html` + roadmap +
   the design-system doc + theme.css + the builder screenshot + the core JS files). In
   that one chat: (a) write the Stage 9.6a–d rows into `checklist.html` from the locked
   decisions here, (b) record the Visual System Uplift as a named initiative, (c) run the
   deep-dive audit, (d) realign the full checklist + roadmap from its findings.
   Doing the 9.6 rows and the realignment in the same pass avoids editing the checklist
   twice.
