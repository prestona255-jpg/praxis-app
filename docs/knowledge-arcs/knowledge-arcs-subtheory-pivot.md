# Knowledge Arcs — The Sub-Theory Constellation

**Status:** Settled design, pre-build. Written during the May 2026 design conversation
following the May 27 pivot to Praxis-as-theory-publishing-platform.

**Supersedes:** the books-as-glyphs sections of `knowledge-arcs-visual-system.md`.
That document remains as a record of pre-pivot thinking — the books-constellation
was the correct design for "Praxis as reading companion" and shipped to production
in Stages 7.1 and 8.1. It is a learning artifact, not an error. This document
describes what the constellation becomes once Praxis is a theory-publishing platform.

---

## The one-sentence change

The constellation's glyphs were **books**. They become **sub-theories**. Books do not
disappear — they move from being the elements of the constellation to being the
**evidence** a sub-theory draws on, surfaced inside the sub-theory rather than as a
shape on the map.

---

## What the constellation is now

The arc-detail Web view IS the theory view. One surface, not two. There is no separate
card-based theory list — the constellation already shows you your sub-theories and the
material gathered around them, so cards would be redundant.

The arc question holds the gravitational center. Sub-theories orbit it as shapes. Around
each sub-theory shape sits a cloud of marginalia — the notes, quotes, and concepts the
user has pulled toward it. The whole surface is a picture of thinking-in-progress: ideas
gathering around a question until they cohere into sub-theories, and sub-theories
thickening as they get fed.

This collapses what the old roadmap called Stage 9.3 ("theory view as cards") into the
constellation itself.

---

## Sub-theory shapes: identity, not category

Each sub-theory gets a distinct shape and color — a quadrilateral, a triangle, an oval,
and so on. **The shape encodes nothing.** It is identity only: a recognizable form so
the user can tell their sub-theories apart at a glance and build a spatial memory of
where each one lives.

This is a deliberate break from the books-constellation, where shape encoded register
(square = theory, circle = memoir, oval = novel, diamond = history, triangle = poetry).
Sub-theories do not have a register vocabulary, so shape carries no category meaning.
Reusing the book shape-vocabulary would imply a taxonomy that does not exist.

---

## Luminosity: maturity made visible

A sub-theory's **color saturation / brightness reflects how developed it is.** A
barely-begun sub-theory glows faint. A richly worked one — many marginalia incorporated,
substantial body written — burns vivid.

This ports the strongest idea from the old books-constellation ("saturation encodes
engagement depth") from books to sub-theories. It pairs with the marginalia cloud so that
depth reads two reinforcing ways at once: cloud density and core luminosity. A vivid
sub-theory ringed with tethered marks reads as "alive, worked, integrated." A faint one
with a few hollow marks reads as "just started."

**No number, no progress bar, no percentage.** Luminosity is the only depth signal, and
it is felt, not counted. This holds the load-bearing anti-engagement-metric principle.

**Open question — luminosity formula.** What exactly maturity is computed from
(incorporated-marginalia count? body word count? both? something else?) is a render-time
decision deferred to the constellation-rework stage. The spec commits to "brightness
reflects maturity"; it does not yet commit to the formula.

---

## The marginalia cloud

Around each sub-theory shape sit its marginalia — short notes, quotes, concepts the user
has gathered toward it. Cloud density is part of the depth signal: a sub-theory thick with
marks has had a lot pulled toward it; a sparse one has not.

### Two states

Marginalia attached to a sub-theory exist in one of two states:

- **Gathered** — a hollow mark, loose in orbit, no tether. The user pulled it close
  because they sense it belongs, but it is not yet woven into the prose. It is raw
  material in orbit.
- **Incorporated** — a solid mark, tethered to the shape by a thin line. The note has
  been pulled into the body and cited (like the boxed Grant paragraph in the written
  Sub-theory 1 draft). It is now load-bearing in the argument.

The **visible gap between gathered and incorporated is the point.** It shows the drama of
theory-building: you gather more than you use, and the distance between "collected" and
"metabolized" is exactly where the work lives. A writer can see their own avoidance — a
sub-theory with twelve hollow marks and two solid ones is telling them something. This is
integration made visible, with no count attached.

### How marginalia attach: deliberately

The user pulls every note in by hand. The act of selecting a note and pulling it toward a
sub-theory IS the intellectual work — it is the moment of deciding "this fragment feeds
this argument." Nothing auto-attaches.

**Yumi never attaches marginalia.** She may, in a later stage, surface candidates in her
own panel ("you have 3 notes that mention struggle — want to look at them?"), but she
never makes the connection herself. The user makes every attachment. This holds the
"Yumi never summarizes / no asymmetric knowledge" principles: Yumi can notice, she
cannot decide what feeds what.

### Click behavior splits by state

- Click a **gathered** mark → see the note itself (its content + which book it came
  from). "Remind me what this is."
- Click an **incorporated** mark → jump into the sub-theory and scroll to the exact
  passage in the prose where it is cited. "Take me to where I used it."

The constellation orbit thus becomes a table of contents made of fragments — each
incorporated note is a doorway to the place it does its work.

---

## The data shape this forces

### Many-to-many

A note lives permanently on its book (where it was written) and can be **referenced by one
or more sub-theories** (where it is used). A note is never *moved* into a sub-theory; the
sub-theory holds a pointer to it.

Consequences:
- Delete a sub-theory and its referenced notes survive on their books.
- The same note can orbit several sub-theories at once. A single insight about struggle
  might feed both "Adversity as access to desire" and "You can't desire what you can't
  be recognized in."
- Each attachment carries its **own gathered/incorporated state**. The same note can be
  incorporated in one sub-theory's argument and still merely gathered in another. That is
  not a bug; it is the feature.

This is the "Notebook is a graph not a list" principle applied one level up, and it is
demanded by "Knowledge Arcs are intersectional by design — books across traditions must
speak to each other in one arc." Cutting many-to-many to save build cost would quietly
violate that principle.

### The prose anchor

An incorporated note is not a boolean ("cited: yes/no"). It carries a **pointer to a
location in the sub-theory body** — where it is cited. This is the same link Stage 10's
citation system walks in the other direction: Stage 10 builds prose → evidence (click a
citation in the text, see the source); the constellation walks evidence → prose (click the
orbit mark, jump to the citation). One bidirectional link, traversed both ways.

For v1: **one incorporation point per note per sub-theory.** Multi-citation of the same
note within a single sub-theory's prose is a Stage 10 refinement, deferred.

### What Stage 9.1 must carry

The sub-theory schema (Stage 9.1) must be designed with this constellation in mind, or it
will be the wrong schema. It must carry:
- a list of attached marginalia references (not copies)
- per-attachment state: gathered vs. incorporated
- for incorporated attachments, a prose anchor into the body
- the existing planned fields: id, arcId, header, bodyPublic, bodyIntellectual,
  evidence array, linkedSubTheories array, status (draft/published), timestamps, format

The marginalia-reference list is either the `evidence` array or a sibling to it — a 9.1
design call, now answerable because we know what the constellation will read.

---

## Layout: a swappable function

The constellation has **no fixed geometry.** Position is a swappable layout function; the
visual vocabulary (shapes, luminosity, clouds, edges, Yumi) is constant across layouts.
This mirrors the existing books-constellation, which already switches between
`_arcConstellationLayout` and `_arcSpareFocalLayout` by book count.

Two candidate layouts, both valid:
- **Radial** — question at center, sub-theories orbiting around it. (Matches the original
  hand sketch.)
- **Curved sweep** — question anchoring a curve that the sub-theories scatter along,
  giving the field directionality.

The renderer may pick by sub-theory count (radial for few, sweep for many) the way the
books-constellation picks by book count, or expose it as a choice. Not committed here.

The principle, carried verbatim from the old spec: **"No fixed shape — the arc is whatever
pattern its sub-theories make together."** Relocated from books to sub-theories, but
intact.

---

## Resonance edges

Sub-theories that speak to each other are connected by resonance edges (the
`linkedSubTheories` relationship). Edge strength reads through both line weight and
opacity — a strong link glows, a faint one nearly disappears. Two weights minimum; a
luminosity gradient is the richer treatment carried from the old spec.

---

## Yumi

Yumi is present as a **noticing entity**, not a glyph in the arc — the dashed circle in
the periphery, as in every prior constellation. She never summarizes, never auto-attaches
marginalia. On the current build her tooltip reads "Quiet today" until real noticing state
wires up (Stage 11).

---

## What is NOT carried from the old spec

- **Shape = register.** Gone. Sub-theory shapes are identity only.
- **The dark constellation field.** Considered and declined for now. The surface stays on
  the light / parchment ground consistent with the rest of Praxis. (The dark field remains
  a possible future direction; not adopted.)
- **Marginalia / journal dot distinction (small green vs. larger dark).** Replaced by the
  gathered / incorporated distinction (hollow vs. solid+tethered), which carries more
  meaning for the theory-building surface.

---

## Open questions (flagged, not solved)

1. **High-density legibility.** A sub-theory worked for months could carry 30+ marginalia.
   The cloud is beautiful at low density and risks becoming mud at high density. Candidate
   answers: a cap on visible marks, a "show all" expansion on click-in, a zoom. No
   commitment. This is the map-vs-workspace tension; it does not block Stage 9.1.

2. **Luminosity formula.** What maturity is computed from. Deferred to the
   constellation-rework stage.

3. **Map vs. workspace.** Whether the constellation is a place you *build* (drag marks,
   attach/detach in place) or a place you *see* and then click into to do the work
   elsewhere. The current lean is map-that-you-click-into; the writing surface (Stage 9.2)
   is where building happens. Not finally settled.

---

## Build sequencing this implies

1. **Stage 9.1** — sub-theory data model, schema designed to feed this constellation
   (marginalia references, per-attachment state, prose anchors). No visual change. Ships
   first. The books-constellation (7.1/8.1) stays live in production until sub-theories
   exist in state.
2. **Stage 9.2** — sub-theory writing surface, including the deliberate marginalia
   attachment and the gathered → incorporated transition.
3. **Stage 9.x (new)** — replace the books-constellation with the sub-theory constellation,
   once data exists to feed it. This is where shapes, luminosity, and clouds get built.
4. **Stage 10** — evidence and citation, the formal bidirectional channel between
   marginalia and prose (the prose anchor's other direction).

The old roadmap's Stage 9.3 ("theory view as cards") is absorbed into step 3.
