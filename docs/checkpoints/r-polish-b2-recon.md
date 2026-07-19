# R-POLISH B2 — THE ARC CLUSTER · STAGE 0 RECON

Model: Opus 4.8, default effort (ultracode OFF per Preston) · gate agents Sonnet ·
base HEAD `19cf306` (v3.232)

## VERDICT: **HALT AT STAGE 0** — 2 dead anchors + 3 frozen-gate collisions

The brief's Stage-0 gate says "HALT only on dead anchors." Two anchors are dead, and three
scope items collide head-on with gates this repo declares frozen in code. No build started.

---

## 0.1 · Gate checks — ALL PASS

| Check | Result |
|---|---|
| HEAD | `19cf30627a270b69bdd0203812934a18915c0644` |
| `origin/main` | identical |
| `refs/remotes/origin/main` | identical — **TRIPLE MATCH ✓** |
| tracked dirty | none |
| untracked strays | 103 (unchanged) |
| live `sw.js` fetch #1 | **`praxis-v3.232`** |
| live `sw.js` fetch #2 | **`praxis-v3.232`** (agree) |
| `lumen-amber.css` / `marks.js` byte-locks | 14,681 B / 10,255 B — EXACT |

## 0.2 · Baseline bytes (LF-normalized)

| File | Bytes | Lines |
|---|---|---|
| `assets/components.css` | 739,419 | 15,157 |
| `assets/theme.css` | 32,743 | 650 |
| `js/views.js` | 1,018,557 | 22,270 |
| `js/arc-constellation.js` | 82,923 | 1,787 |
| `js/room-field.js` | — (drag surface) | — |
| `assets/marks.js` | 10,255 | 106 (BYTE-LOCKED) |
| `index.html` | 7,939 | 172 |
| `sw.js` | 4,837 | 138 |

---

## DEAD ANCHOR 1 — the `\|t` escape artifact has NO code source

The brief orders: *"the raw `\|t` escape artifact in sub-theory body (page + workshop)."*

Exhaustive search, all patterns escaped:

| Search | Hits |
|---|---|
| `\\\|` (literal backslash-pipe) across `js/*.js` | **0** |
| fixed-string `\|t` across `*.js *.html *.json` (`grep -F`) | **0** |
| `.join('|')` / `.split('|')` across all `.js` | **0** |
| every `.body =` / `bodyPublic` assignment site (`views.js`, `state.js`, `import-capture.js`) | no pipe writes |
| the two display functions touching `bodyPublic` (`parseCitations` `views.js:10649`, `wovenParagraph` `views.js:11513`) | `*asterisk*` markers only, no pipe |

The one regex-escape helper (`yumi-brain.js:1058`) escapes a title only to build a
`RegExp` for name-collision testing; the escaped string is never rendered.

**There is no templating/serialization bug to fix.** The artifact is almost certainly a
stored value — typed, dictated, imported, or Yumi-generated into an actual `bodyPublic`.
"Fix at the source" has no source. **This is the B1-FIX uppercase-leak pattern exactly**,
and I will not fabricate a fix for it. Needs the affected sub-theory's raw stored string
inspected first (`state.subTheories['<id>'].bodyPublic`), then a ruling: clean the datum, or
add a display-layer sanitizer (a different, larger job).

## DEAD ANCHOR 2 — `--field-N` is not what the mark renderer reads

The brief orders RD-1 with *"--field jewel hues, candy pastels retire."* The v3.232
`theme.css:133` comment I shipped says the jewel marks *"retire the --field-N pastel candy."*
**Both name the wrong target.**

| Claim | Evidence |
|---|---|
| `arc-constellation.js` reads `--field-N` | **FALSE — zero grep hits in the file** |
| what it actually reads | `--subtheory-N` (fill: `829-898`, lines `844,869,873,882-884`) and `--subtheory-N-edge` (strokes/dots: `845,876,888,914,962`) |
| corroboration | `docs/checkpoints/r-polish-b1.md:654` — "`--field-1` … **not used by these renderers**" |
| `--m1..--m5`, `--window-bg`, `--window-line` | **zero consumers app-wide** — pure prep, nothing wired |

A slice that "swaps `--field-N` for `--m1..--m5`" per the literal brief text would **touch
nothing the renderer reads.** My own v3.232 comment is wrong and needs correcting in
whatever commit lands next.

---

## FROZEN-GATE COLLISION 1 — RD-1 requires editing the frozen `--subtheory-*` palette

The renderer's real candy is `--subtheory-1..16` + `-edge`. `theme.css:24-26` declares:

> "The frozen `--subtheory-*` mark palette and the `--tradition-*` renderer feed are
> intentionally left at their values (tradition retint is a separate, deferred task)."

RD-1's "candy retires → jewel marks" is therefore **a 16-way → 5-way collapse of an
explicitly frozen palette**. That is a design decision (which 16 hues map onto which 5
jewels, and what happens to the distinctions the 16 encoded), not a mechanical swap.

## FROZEN-GATE COLLISION 2 — GR-1 "one renderer" spans a byte-locked file

There are **four** mark-rendering paths for the same visual object:

| Site | Renderer | Reads real `x`/`y`? |
|---|---|---|
| Home whole-field (`views.js:1352`) | `renderSubTheoryConstellation` | N/A — arc-level, no positions exist in state |
| Home left-off card (`views.js:1399`) | `renderSubTheoryConstellation` | **YES** |
| Arc interior Field face (`views.js:13768`) | `renderSubTheoryConstellation` | **YES** |
| Arc interior **Page** face (`views.js:14112`) | `bookSubMarkHTML` → **marks.js** | single focal mark |
| **Arcs-index card** (`views.js:3957-4007`) | `bookSubMarkHTML` → **marks.js** | **NO — synthetic id-hash positions** |

Two independent breaks of "one grammar thumbnail→interior": the Arcs-index card uses a
*different renderer* (`marks.js`, HTML-span output, different anatomy), and the split exists
*within the arc interior itself* (Page face vs Field face, one click apart).

`assets/marks.js` is **BYTE-LOCKED at 10,255 B**. Unifying it with
`arc-constellation.js`'s `_ST_MARK_TABLE` is a from-scratch reconciliation of two different
output formats, not a thin adapter.

**The one genuinely cheap win inside GR-1:** the Arcs-index card ignores stored `sub.x`/
`sub.y` even though the data exists and is read correctly elsewhere in the same file
(`views.js:12205`). That is a wiring fix — but the Arcs-index page is a **declared B2
non-goal** ("renderer only; composition is B4"), so even this needs a scope ruling.

## FROZEN-GATE COLLISION 3 — R1's 11px labels live inside the locked renderer

`_stRenderYumi` (`arc-constellation.js:1041`) hardcodes `font-size="11"` — a bare literal,
not a token. The same violation runs through **all five legend labels** (`1072, 1077, 1082,
1087, 1092`) plus a 10.5px interaction hint (`1095`).

The brief says "fix at the source (locked renderer)" — which acknowledges the collision but
does not dissolve it. Three governance comments forbid exactly this edit:

- `views.js:1351` — "Locked renderer only."
- `views.js:12423` — "the frozen renderer's SVG is untouched."
- `components.css:12839-12840` — "chrome only — **the frozen renderer's SVG output is
  styled, never edited**."

Per CLAUDE.md's FORK RULE this is Preston's call, not a silent mechanical bump.

---

## TECHNICAL OBSTACLE — L4 settle is destroyed on the Field face

Not a fork, a real engineering constraint worth knowing before the slice is planned.

There are **two unrelated drag systems**, not one surface described twice:

| | Workshop field | Arc Field marks |
|---|---|---|
| File | `js/room-field.js:34-241` | `js/arc-constellation.js:1292-1426` |
| Mechanism | `el.style.left/top` px | SVG `transform` attribute |
| Today's choreography | `.rf-dragging` z-index + deeper shadow, **no transition, no transform** (`components.css:11890`) | **none**; only an unrelated `opacity .28s` (`components.css:12637`) |
| Drop targets | **none exist** — free placement | none for placement |
| Reduced-motion | absent in both |

**DR-1's "valid targets brighten on approach" has no target to brighten on either surface** —
free placement is the model. And on the Field face, `onCommit` (`views.js:13810-13813`)
calls `setSubTheoryPosition` then **immediately `renderArcDetail(arcId)`**, a full SVG
teardown/rebuild — any settle/overshoot animation on the dragged `<g>` is destroyed at the
instant of drop unless the re-render is deferred or the new render seeds the animation.

**Also contradicting the brief's "no schema/state writes":** both surfaces ALREADY persist on
drag-end — `setSubTheoryPosition` (`state.js:2181-2191`) and `setEvidenceLayout`
(`state.js:2468-2481`), each calling `markSubTheoriesDirty(); saveState();`. Pre-existing, so
DR-1 adds no new write, but the constraint as written is not literally true of these surfaces.

**Reusable, no invention needed:** MO-1 tokens already exist — `praxis-kit.css:36-37`
`--dur-fast:150ms` / `--dur-gentle:300ms` / `--ease-emphasis:cubic-bezier(.34,1.2,.5,1)`,
which literally overshoots — a direct fit for DR-1's settle. B1 already consumes these
verbatim (`components.css:14857-14872`).

## HD-1 — buildable, with one decision

- Nav is `position:sticky; top:0; z-index:30` at `components.css:632-661`; desktop pill at
  `816-825`; **mobile `<760` resets `position:relative`** (`5456-5477`) — so reveal-on-intent
  needs an explicit mobile decision, not an assumption desktop's sticky extends there. The
  brief says "<760 behavior unchanged," which reads as: mobile stays in-flow, no reveal.
- **No scroll-direction logic exists anywhere** to reuse. Two threshold-only handlers exist
  (`views.js:4448`, `views.js:22185`); the correct home for a new single-bind listener is the
  `initNavMobileToggle` idiom (`views.js:315-348`), since the nav is static `index.html`
  markup never re-created per route.
- **⌘K does NOT focus the nav input.** `onSpotlightKeydown` (`spotlight.js:412-422`) opens a
  *separate modal overlay* and focuses that. The nav's `.app-nav-search-input` is inert —
  clicking it blurs and routes to `#search` (`spotlight.js:441-443`). HD-1's "⌘K reveals +
  focuses search" is therefore **new behavior**, not a rewiring of an existing path.

## RM6 — clean, buildable, no fork

Field is capped at **788px** (`1032px` content − `220px` rail − `24px` gap;
`components.css:12591-12613`). **No `@media (min-width:…)` rule references `.arcfield` at
all** (all 18 min-width blocks scanned) — so 788px holds from ~1128px through 2560. The cap
is incidental, inherited from the shared 1080px page shell. B2 authors a net-new XL rule;
nothing to fight.

---

## WHAT IS ACTUALLY BUILDABLE WITHOUT A RULING

| Item | Status |
|---|---|
| **RM6** field width cap (net-new XL rule) | READY |
| **HD-1** header reveal-on-intent (desktop; mobile unchanged per brief) | READY — ⌘K reveal is new behavior, noted |
| **L4** workshop drag choreography (`room-field.js` + `.rf-card`) | READY — reuse kit MO-1 tokens; no targets to brighten |
| **ASK YUMI chip** (`views.js:13040-13058`) | READY — root cause is *zero container styling*, not a position bug; and it renders on **all three faces**, not just Field |
| L4 on the Field face | BLOCKED by the re-render-on-commit teardown |
| RD-1 palette retirement | BLOCKED — frozen `--subtheory-*` |
| GR-1 one-renderer | BLOCKED — byte-locked `marks.js`, 4 paths |
| R1 11px labels | BLOCKED — frozen renderer |
| `\|t` artifact | BLOCKED — no source exists |

## THE FOUR RULINGS NEEDED

1. **RD-1 palette** — unfreeze `--subtheory-*` and rule the 16→5 jewel collapse, or keep the
   16 and re-tune them for the parchment ground?
2. **GR-1 scope** — accept four renderers and fix only the Arcs-index *data wiring* (a B4
   non-goal today), or authorize a real renderer unification against byte-locked `marks.js`?
3. **R1 labels** — authorize editing the locked renderer for the 12px floor, or style around
   it / defer?
4. **`\|t`** — inspect the stored datum first (I can, with a live probe on the affected
   sub-theory) and treat as data, or authorize a display-layer sanitizer?

Nothing built. Nothing staged. No commit. Tree clean at `19cf306`.
