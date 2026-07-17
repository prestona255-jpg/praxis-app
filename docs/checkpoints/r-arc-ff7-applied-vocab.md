# FF-7 — APPLIED VOCABULARY TABLE (for Preston's confirm; NO BUILD until confirmed)

Applies the **RULED anchors** (handoff #2 §5) to every current string enumerated in
`r-arc-ff-routing.md` Part 2. This is the mechanical mapping (current → canonical → surface); the anchors
were your ruling, so this table is a **confirm**, not a fresh design. On confirm, a small rider applies it.

**The four ruled anchors:**
1. **Pre-mint state word = GATHERING** (never "forming").
2. **Identity = the origin phrase** in provisional styling; fallback **"Unnamed basin."**
3. **Doors are destination-named, one verb** — "Open the workshop →" / "Open the page →", each used ONLY
   toward its own destination.
4. **One Yumi corner tag app-wide = "I'm here when you want to talk it through."**

## RULINGS (Preston, 2026-07-17) — CONFIRMED; the vocab rider is cleared to build

- **(1) Lifecycle words as tabled** — the chip reads **"GATHERING"**; the newborn eyebrow reads
  **"gathering · just now"**.
- **(2) Unify the maturity ramp — words AND dot-color thresholds — to the WORD ramp's .34/.67** (one source
  of truth: **nascent / developing / established**). This retires the banned "forming" AND **closes the
  standing Arc-Read dot/label residual** (handoff §6): the dot-color key repoints from .4/.7 → **.34/.67** to
  match the word, so dot and label can never disagree in a narrow score zone again.
- **(3) Door convention CONFIRMED** — destination-named **"Open the workshop →"** / **"Open the page →"**,
  including the Arc-detail Page-face stub fix (its → `/build` label becomes "Open the workshop →").

---

## A. Lifecycle-state phrases
The lifecycle reads: **unnamed basin → GATHERING · named draft → DRAFT · finished → FINISHED.** ("Forming"
retires everywhere; "gathering" is the one pre-mint word.)

| State | Current string | → Canonical | Surface / source |
|---|---|---|---|
| Just-minted (session) | "born just now · draft" | **"gathering · just now"** (a fresh basin IS gathering; keep the temporal cue) | newborn card eyebrow (`buildNotebookNewbornCard`) |
| Just-minted (reload) | "draft" | **"gathering"** (while unnamed) | newborn card, restored |
| Draft on the Page — basin | "A SUB-THEORY · STILL FORMING" | **"A SUB-THEORY · GATHERING"** | Page kicker (`renderSubTheoryPage`) |
| Draft on the Page — named | "A SUB-THEORY · STILL FORMING" | **"A SUB-THEORY · DRAFT"** | Page kicker |
| Published on the Page | "A SUB-THEORY · FINISHED" | **"A SUB-THEORY · FINISHED"** (unchanged) | Page kicker |
| Unnamed basin identity | "Unnamed basin" | **"Unnamed basin"** (unchanged — anchor 2 fallback) | newborn card + Page read-only title |
| Legacy blank header | "Untitled sub-theory" (**22 sites**) | **origin phrase (provisional) → "Unnamed basin"** fallback | 22 call sites — the actual swap is **3B-MOTE's build** (handoff §6); FF-7 only rules the word |
| Naming invite | "This gathering keeps circling something — what would you call it?" | **unchanged** (already "gathering"; anchor-consistent) | Workshop (§4b verbatim) |

## B. Door labels (anchor 3 — destination-named)

| Current string | → Canonical | Routes to |
|---|---|---|
| "Continue in the workshop →" | **"Open the workshop →"** | `#subtheory/<id>/build` |
| "Edit in the workshop →" | **"Open the workshop →"** | `#subtheory/<id>/build` |
| "Open the page →" (Workshop action row) | **"Open the page →"** (unchanged — already correct) | `#subtheory/<id>` |
| "Open the page →" ⚠ (Arc-detail Page-face stub) | **"Open the workshop →"** | `#subtheory/<id>/build` — **fixes the same-words-opposite-direction collision** |

Result: exactly two door labels app-wide, each meaning exactly one destination.
*(AMENDED at the Wave C rail slice, 2026-07-17: a THIRD label — "Open the
book →" → `#book/<id>` — landed on the FF-12 gathered-evidence cards. It
follows this section's LAW exactly (destination-named, one label ↔ one
destination); only the enumerated count above is superseded. The law stands.)*

## C. Yumi corner tag (anchor 4 — one app-wide) — ⚠ **SUPERSEDED BY F4; NO-OP** (Preston, 2026-07-17)

> **STALE AS TABLED — this section shipped NO code in the FF-7 rider.** The rows below were mapped from
> `r-arc-ff-routing.md` Part 2, enumerated **before Slice F4**. **F4 (`3fefc93`, v3.217) removed both blocks
> wholesale** (D16, the covenant: Yumi never monologues unbidden). At the rider's recon, `"From how you read"`
> = **0** in `js/`, `assets/`, `index.html` (exhaustive grep, exit 1; corroborated by `git log -S`), and **no
> Yumi tag renders on either surface** — so there is no string to unify. Applying §C literally would have
> **re-added the speech F4 deliberately deleted.**
> **RULED (Preston, 2026-07-17): §C = NO-OP. Nothing re-added; the covenant stands.** Anchor 4's wording
> survives as **forward vocabulary** for Wave C's **raised-hand margin seat** (F4's covenant deferral), which
> is where Yumi's noticing returns. This is the DOC = POINTER, LIVE FILE = SOURCE lesson: the table is the
> pointer, the code was the source.

| Current (as tabled, pre-F4 — **no longer exists**) | → Canonical | Surface |
|---|---|---|
| ~~"From how you read: " (Page: "YUMI" eyebrow + up to 2 dismissible notes)~~ | **"I'm here when you want to talk it through."** — *deferred to Wave C's raised-hand seat* | ~~Page~~ — removed by F4 |
| ~~"From how you read: " (Workshop: no eyebrow, one note, summary overwrites prompt)~~ | **"I'm here when you want to talk it through."** — *deferred to Wave C's raised-hand seat* | ~~Workshop~~ — removed by F4 |

---

## D. Two named collisions — resolution (fold into this ruling)

- **D1 — maturity ramp disagreement.** ⚠ **PARTLY SHIPPED BEFORE THE RIDER:** the **WORD** half was already
  unified by **`bb70889` (S3B-POLISH)** — `_searchSubMaturityWord` → **`_stMaturityWord`**, with Page
  (`views.js:10958`, was `10947` pre-rider), #search (`846`) and the Arc-Read word (`13585`) all calling it. The rider therefore
  shipped only the **remaining** half: the **dot-colour thresholds** `.4/.7 → .34/.67` in
  `_arcReadMaturityKey` (`views.js:13775-6`). Text below is the pre-rider statement, kept for the record.
  Page + #search use **nascent / developing / established** (.34/.67);
  the Arc Read face uses **forming / warming / mature / bright** (.2/.4/.7) on the SAME score. Anchor 1 bans
  "forming," so the Arc-Read ramp cannot stand. **Recommend: unify to nascent / developing / established
  everywhere** (retires "forming," collapses the ramp disagreement). ⚠ NOTE this is a WORD unification; the
  separate **dot-COLOR key** (.4/.7 in `_arcReadMaturityKey` vs the word's .34/.67) is the trivial follow-on
  named in handoff §6 (residual "Arc-Read dot/label pairing") — confirm whether to unify the thresholds too,
  or only the words.
- **D2 — "Open the page →" two directions.** Resolved by §B (the Arc-detail stub → "Open the workshop →").

---

## E. Applied-change surface (for the later rider's scope)

Confirmed, the rider touches (approx.): newborn eyebrow (2 strings), Page kicker (2 branches +
basin/named split), 3 door labels repointed to destination-named, 1 Yumi tag unified across 2 surfaces, and
the Arc-Read maturity words → the shared ramp. The **22-site "Untitled sub-theory" retirement rides 3B-MOTE**,
not this rider. Estimated rider: small (~string swaps + the basin/named kicker branch), no schema, no route.

**RULED (Preston, 2026-07-17, see top):** (1) lifecycle words as tabled (chip "GATHERING", eyebrow
"gathering · just now"); (2) D1 — unify the maturity ramp to nascent/developing/established AND repoint the
dot-color thresholds to .34/.67 (closes the Arc-Read dot/label residual); (3) two-label destination-named
door convention. **The FF-7 vocab rider is cleared to build.**

---

## ⚠ §E WAS INCOMPLETE — the rider's ACTUAL surface (recon finding, ruled 2026-07-17)

§E above enumerated **one** rendered lifecycle "forming" (the Page kicker), but anchor 1 retires the word
**everywhere**. The recon's exhaustive sweep (22 hits in shipped code, 7 rendered; `state.js:589
'performing arts'` excluded as a substring false positive) found **two more**, both **unconditional**:

| Site | Surface | Was | Now (RULED: FORK 2 = **A**, branch both) |
|---|---|---|---|
| `views.js:2481` | Notebook newborn snippet | `'A forming sub-theory in '` | basin → `'A gathering sub-theory in '` · named → `'A draft sub-theory in '` |
| `views.js:11218` | **Workshop** subtitle | `'a forming sub-theory in '` | basin → `gathering` · named → `draft` · **published → `'a finished sub-theory in '`** |

Shipping §E alone would have left the Page reading `· GATHERING` while the Notebook card and the Workshop
subtitle below it still said "forming" — COPY IS A CONTRACT.
**The Workshop's third branch is a carried determination** (not separately ruled): a published sub-theory
**does** reach that subtitle (the Page's Open door renders at every status), so a bare basin/named split would
have called a finished sub-theory a draft. It applies the ruled lifecycle's own third state (finished →
FINISHED), mirroring the Page kicker. Preston's veto point is the felt pass.

**NAMED NEWBORN (RULED):** a named newborn is reachable (typed name, or Yumi's S4 NAME-proposal Accept), and
the eyebrow keyed only on `nb.restored`. It now branches: basin → `'gathering · just now'` / `'gathering'`;
named → **`'draft · just now'`** / `'draft'` — the S2 restored/new truthfulness preserved.

**FORMING-REACH (RULED: residual, NOT this rider).** Four rendered non-lifecycle "forming"s stay untouched:
`views.js:3742` `_arcMaturityWord` (**arc-AGGREGATE** ramp — a different score; self-consistent with
`HOME_GROWING_MAX`) · `views.js:18523` (values) · `views.js:20406` (lenses) · and **`arc-constellation.js:1433`
`maturityRead`** — a **FOURTH** ramp (`Nascent/Forming/Developing/Mature`, .25/.5/.75). **ROUTING (Preston):
the frozen-file member rides 3B-MOTE's already-authorised single frozen edit — decided inside 3B-MOTE, not
here.** (So: there are **four** maturity ramps in the app, not the three D1 assumed.)
