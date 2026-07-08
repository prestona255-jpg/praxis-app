# Praxis — the six load-bearing principles

The canonical home for the six principles that govern every wave, fix, and design
decision in Praxis. They are the *why* under the conventions. Any change that
would violate one is a HALT (`PROTOCOL.md` §6.3) and a covenant question, never a
local decision (`docs/FIX-PROTOCOL.md` §4 fork; `CLAUDE.md` "the seams").

**Sources synthesized here (not invented):** `PROTOCOL.md` §6.3 (the enumerated
HALT list), the archived north-star `docs/archive/praxis-book-app-living-document.html`
("Hard constraints"), and the audit's values/covenant charter
`docs/fable-audit-charter.md` §3d + `docs/audit/fable-audit-combined.md`. Where a
principle names an enforcement seam, that seam is the live source of truth — this
doc points at it, it does not replace it.

---

## 1. Yumi never summarizes books
Yumi draws the reader *out*; she never stands in for the reading. She is not a
summary generator. She asks, complicates, notices, names — she does not hand back
a book pre-chewed.
- **Enforcement seam:** the never-summarizes behavior + Yumi's cyan-only identity
  are covenant constraints (`PROTOCOL.md` §6.2). The context she is given is
  assembled by `assembleContextData` (`js/yumi-brain.js` ~222–226); her moves live
  in `considerMove`/`considerArcVoice`.
- **Related:** [Principle 5](#5-no-asymmetric-knowledge) (she sees only what you allow).

## 2. The Notebook is structurally private
Marginalia, journal, and questions are the reader's own. The **journal register is
inviolably private** — Gather-locked, never publishable as evidence. Yumi reads
along **only by consent, only as much as allowed** — never by default, never in full.
- **Enforcement seam:** the canonical covenant filter is `assembleContextData`'s
  `isPrivate === true || register === 'journal'` skip (`js/yumi-brain.js` ~225–227).
  Every body-reader that feeds Yumi's context OR the `#yumi-sees` transparency panel
  MUST apply that same predicate — the VC1 leak was four readers that had drifted to
  an `isPrivate`-only check and leaked Visible-journal notes (fixed `165bbe3`/v3.181).
  A weaker check on any new reader re-opens the leak.
- **Related:** [Principle 5](#5-no-asymmetric-knowledge).

## 3. One Book Artifact per user per book
A strict structural rule: each reader produces exactly **one** coherent Book
Artifact per book — what that book *became* in their hands, not a formulaic review.
The artifact is where the brand lives.
- **Enforcement seam:** the artifact editor / `bookArtifacts` owner-keyed model
  (`js/state.js`, `js/integrations.js` artifacts sync). One per (uid, bookId).

## 4. Stars are de-emphasized; no follower/like/reshare counts as primary UI
Star ratings may exist but stay de-emphasized. **No follower counts, like counts, or
reshare counts as primary UI.** Vanity metrics never drive the surface; discovery is
by engagement depth and concept overlap, not collaborative filtering on ratings.
- **Enforcement seam:** social surfaces (`#commons`, profiles) keep counts secondary;
  the `walkedBy` metric stays de-emphasized (audit F-RL2 / P-4). Recommendations are
  concept-overlap, not rating-driven.

## 5. No asymmetric knowledge
Yumi never knows more about the reader than the reader can see. Whatever Yumi holds
about you is inspectable by you. Consent is real and revocable; the reader model is
opt-in.
- **Enforcement seam:** the **"What Yumi sees"** panel (`#yumi-sees`, `openTransparencyView`
  → `getContextSnapshot` = `assembleContextData`) is the transparency guarantee — it must
  show exactly what Yumi is fed, no more, no less. Consent gates the reader model
  (`yumiReaderModel` / `yumiReadsAlong` profile flags). If `#yumi-sees` can ever show
  less than Yumi actually receives, this principle is broken.
- **Related:** [Principle 2](#2-the-notebook-is-structurally-private).

## 6. Knowledge Arcs are intersectional by design
An arc is a path the reader builds *through* their reading — books from **any
tradition, set side by side, so they speak to each other**. The intellectual value
is the connections: across books within an arc, and across arcs. Arcs are not
folders or reading lists; the intersections are the point.
- **Enforcement seam:** `renderArcsPage` / `renderArcDetail` (the constellation
  field) + `arc-constellation.js`. Sub-theories are the intersections made explicit.
  Copy must not promise an intersectional visualization the build doesn't yet render
  (COPY IS A CONTRACT).

---

*Keep this list at six. To change a principle, change it here in a deliberate commit
and reconcile `PROTOCOL.md` §6.3 in the same commit — the principles live in the repo,
not in anyone's memory.*
