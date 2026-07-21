# R-SHELF — Round Brief v3 (THE FELT DIAL)

**Status:** v3 supersedes v2 (committed at 3f5df8b, `docs/studio/r-shelf-brief.md`).
**Provenance:** v3 original of July 17, recovered from the owner's download July 21.
**Session:** July 17, 2026 — Fable felt-dial design conversation (Preston's July 15 plan change: dial first, then mockup).
**Commit target:** `docs/studio/r-shelf-brief.md` — DOCS-ONLY commit, path-scoped, no code.
**⚠ SPAWN RULE:** The mockup worktree spawns off the **v3 commit**, not 5cb60e4. The self-running-from-v2 path (CC prompt of July 14) is **superseded** — its gate must be re-pointed at the v3 commit hash before any run.

**Splice discipline for the commit session:** Sections marked `[CARRY-FORWARD]` are carried **verbatim from the v2 file at 3f5df8b** — do not trust this document's paraphrase of them; splice the committed text. Sections marked `[NEW v3]` or `[AMENDED v3]` are authoritative as written here. **DIFF-GATE (PASS/FAIL):** before committing, diff the assembled file against the v2 file at 3f5df8b — changes may appear ONLY inside `[NEW v3]`/`[AMENDED v3]` sections and section headers; every `[CARRY-FORWARD]` block must be byte-identical to its v2 text. Any drift in a carry-forward block = FAIL, fix the splice, re-diff.

---

## 1. FINDING `[CARRY-FORWARD]`

July 6 felt pass: "Shelf — mostly good." This is an ELEVATION round, not a repair round.
The problem: the shelf is the one surface that could belong to any book app. Everything around it — arcs with maturity, values with marks and load, the galaxy, soon seedlings — has grown meaning the shelf doesn't carry. R-SHELF gives the library face its own identity inside the instrument frame: the shelf is where the library is *worked*, not just stored.

---

## 2. RULED FORKS `[CARRY-FORWARD, with v3 pointer]`

- **F1 METAPHOR = BOOKCASE ROWS** — horizontal shelf bands, covers standing on a drawn shelf line, bands grouped by the ACTIVE MODE. *Preston's amendment:* the Categories⇄Lenses toggle survives and the bands regroup per mode — the toggle becomes a **re-shelving act**: flip it and the whole case rearranges around a different way of seeing.
- **F2 NOW BAND LEADS** — page opens on what you're carrying: still-reading + books under active questions.
- **F3 QUIET MEANING MARKS** — covers wear their life quietly: annotation-density under-glow (existing maturity grammar), value embers, arc presence on tap. Never badge clutter.
- **F4 CONTROLS = SLIM HEADER** — search + mode toggle up top; Re-classify folds into Manage; the sidebar dissolves; band labels ARE the navigation; one column.
- **F5 ROW BEHAVIOR** — one shelf line per band; horizontal overflow scroll on desktop; label tap → focused full view.
- **F6 VALUES = FILTER LIGHT** — header value chips ILLUMINATE matching books and dim the rest across all bands. Never a grouping (multi-mark books would duplicate across value shelves).
- **F7 YUMI LENS GENERATION = MODE-SCOPED** — a quiet "Ask Yumi to see your shelf" row at the end of the lens bands, doubling as the lens-mode empty state. The act lives where its result appears. Eval gate unchanged.
- **F8 ADD FAB = SINGLE-ACTION** — Scan seam noted only: the FAB is the door R-SCAN may later open into Add-manually/Scan. Nothing pre-built this round.
- **F9 THE GROUND = BOOKCASE + WHEAT HORIZON** — *Preston's motif; ruled Horizon + Bookcase.* Two parts:
  - **The bookcase:** each band is a shelf CAVITY with inset depth and a real board with an underside shadow — drawn entirely from the token world. Warm paper tones, no photo wood, no glossy textures. (Overturns v1's "drawn line only" mandate — a deliberate ruling, not drift.)
  - **The wheat horizon:** the page opens on an animated wheat strip — a window band above the header. Two depth layers, staggered CSS-only sway, low-sun glow, a soil line where the library begins. It is CONTAINED: never behind covers or text. Reduced-motion = a still field.
  - **The meaning move:** the field motif unifies app-wide — *the field is where your thinking grows, and it is always on the horizon of the library.* The library and the growing-ground stay distinct rooms; the horizon is the window between them. This also resolves the July 6 Home wheat-section ambiguity (see Seams).
  - *F9's felt parameters are dialed in §3 (v3). §3 governs where they overlap.*
- **A1 MOBILE BANDS (critique amendment)** — bands stack to a SECOND shelf line at ≤759 before any sideways scroll, then a See-all tile. (Real bookcases have multiple shelves; keeps ~6–8 covers visible per band instead of 3.)
- **A2 LENS DUPLICATION (critique amendment)** — in lens mode a book MAY appear on multiple lens shelves (a lens is an angle, not a location); the focused view carries a quiet "also under…" line. Recon verifies real lens membership.

Controls census, fully placed: Re-classify → Manage (F4) · R8 values filter row → superseded by header chips (F6) · Manage = the maintenance room (edit/delete, Re-classify; future DEL-1 delete-lenses/categories lands here) · Add FAB bottom-left, Bloom bottom-right = untouched.

---

## 3. THE FELT DIAL `[NEW v3]` — July 17 rulings, all tappable

Four knobs, two open-question closures, and two completeness rulings (§3.7–3.8) from the second pass. Each ruling ends in a **countable law sentence** — the mockup is measured against these sentences, not against adjectives.

### 3.1 CAVITY DEPTH — ruled: CARVED (variant B)
One soft inset shadow per cavity, cast from the top edge only (light-from-above). Board face = two flat tones: face + thin darker underside strip. Cavity interior one step darker than page ground. No grain, no gradient walls, no side vignettes, no contact shadows under covers.
Rejected: Whisper (tone-only — re-fails the founding contrast complaint; a fence, not a house) and Deep case (iBooks silhouette in token clothes; ground out-shouts the marks).
**Law sentence: one inset shadow per cavity, ground layer only, never on covers.**

### 3.2 WHEAT MOTION — ruled: BREEZE (variant A)
Sway period ≥ 8s per cycle. Tip-lean only (a degree or two). Exactly two layers; far layer at ~half the near layer's amplitude, slightly out of phase, one tone dimmer. CSS transforms only, GPU-composited. Reduced-motion = still field (no breath substitute).
Rejected: Wind (attention doesn't respect the containment law's borders — the contrast complaint reborn as motion) and Still+breath (deletes the rustle Preston twice affirmed).
**Law sentence: period ≥ 8s, tip-lean only, exactly two layers, far layer half-amplitude and one tone dimmer. Animate transform and opacity only — never filter.**

### 3.3 EMBERS — ruled: SINGLE COAL (variant A)
One ember per cover, maximum, ever — presence + weight, not count. Two brightness steps only (marked vs. heavily-marked), satisfying the evidence-weighted law. Rest state: `--gold` at reduced opacity; under chip illumination lifts to `--gold-hi` full. Under-glow keeps g0–3 with **g0 = absence** (no halo of any kind on unannotated covers — sparse-honest). Value *count and identity* are answered by F6 chip illumination and by tap — never by the resting shelf.
Rejected: capped-3 (redundant with chips; at real-library density the cap becomes the census) and full census (CN-5's killed jumble reborn on the shelf).
**Law sentence: one ember + one glow per cover, two ember brightness steps, g0 = absence, chips carry the count.**

### 3.4 NOW TREATMENT — ruled: THE DESK (variant B)
NOW sits **in front of the case**, not in it — a quiet paper-ground card between the wheat horizon and the first shelf: books pulled down, lying in hand. Composition grammar this completes: **field → desk → case** (where thinking grows → what you're carrying → what you hold). Desk chrome: none — no border; ground tone = page tone or lighter; the carrying-question line does the work. Carrying-question line carries from the sketch unchanged.
**Unifying law (subsumes v2's two special cases):** *inside the case = shelved; outside the case = in motion.* NOW (desk) and the unshelved pile are the two instances.
**Empty state (sparse-honest):** when nothing is carried, the card frame does not render at all — a single `--ink-3` line ("Nothing in hand right now") sits in its place and the case begins.
Rejected: top-shelf (demotes the present to first-band-among-nine) and the sill (couples content to the one region reduced-motion must freeze; worsens Q7).
**Law sentence: desk tone = page or lighter, cavities darker — light falls on what's in hand; empty = one line, no furniture.**

### 3.5 Q7 CLOSED — HORIZON HEIGHT: slim fixed strip
~64px at 390; may breathe to ~96–120px at desktop widths (desktop composition remains deferred per the early-SHAPE-B ruling). **Not sticky** — the strip scrolls away with the page: the field is the horizon you leave as you descend into the library, and the motion tax ends at first scroll. At 390 the first viewport must show strip + desk + first shelf.
**Law sentence: 64px fixed at 390, scrolls with the page, never sticky.**

### 3.6 Q8 CLOSED — TIME-OF-DAY TONES: NO, ratified
Closed for this round and this build. Recorded as a possible far-future delight (post-beta, requires its own ruling); not a mockup variable, not a recon item.

### 3.7 FOCUSED FULL VIEW — ruled: THE CASE OPENS (July 17, tappable, at rec)
F5's label-tap view stands on the **same carved grammar** — the band's cavity expands to multi-row within one cavity family. Strip and desk are **absent** in the focused view: you have stepped inside the case; the horizon is behind you. No new ground register anywhere in the round.
Rejected: plain grid (the house vanishes the moment you approach it — backwards).
**Law sentence: one ground grammar round-wide; the focused view is the case opened, with strip and desk absent.**

### 3.8 HEADER DEPARTURE AT 390 — ruled: SCROLLS AWAY (July 17, tappable, at rec)
The slim header (search + mode toggle) is **not sticky** at ≤759 — it departs with the strip and desk in one continuous exit (field, desk, then you're in the case). Bands are the navigation (F4 as intended); Add FAB and Bloom remain the persistent acts. Sticky-header is a **desktop-canon question**, deferred with the rest of desktop composition.
**Law sentence: at 390 nothing above the case is sticky; FAB and Bloom are the only persistent chrome.**

---

## 4. LAWS `[AMENDED v3]`

Laws 1–7 carry verbatim from v2:

1. **One illumination grammar.** Search and values both LIGHT matches and DIM the rest. Illumination never rearranges, hides, or removes. Grouping changes only via the mode toggle.
2. **Same library, re-shelved.** Modes regroup the same books. Category mode = exclusive (one home per book). Lens mode = angles (duplication allowed, A2).
3. **Evidence-weighted marks only.** Glow rides real annotation counts; embers ride real value-marks. No tallies, no streaks, nothing performative.
4. **Sparse-honest everywhere.** NOW band empty state honest; a 1–2 book band still gets a dignified shelf; lens-mode empty = the F7 invitation itself.
5. **Canon-native.** Mobile canon P1–P9 (P3 44px targets on chips/labels/covers, P8 no overflow beyond the intended shelf rails, reduced-motion freeze). Desktop composition per the desktop canon — the round runs post-DW.
6. **Ground check.** The shelf is light-repointed: light primitives (--page-2 / --line-page / --scrim); gold as text = --gold-deep; --gold-hi = embers/glyphs only. No --lum-* in new CSS. Strict ES3.
7. **Animation containment.** Ambient motion lives in the horizon band ONLY — never behind content. CSS-only; reduced-motion renders a still field; the band scrolls away with the page (it is a window, not chrome). Perf verified at recon (see §5.7).

v3 adds:

**Law 8 — THE FELT CANON.** The six law sentences of §3 are binding mockup acceptance criteria. Any felt adjustment during the mockup that would break a law sentence returns to chat for a ruling; it is not the mockup session's call.

**Illumination-grammar rider (Law 1):** chip/search dimming applies as **cover opacity only** — cavity ground never changes under illumination (prevents dim-on-dark crush inside carved cavities).

---

## 5. SHAPE-B MANDATES `[AMENDED v3]`

Carry v2's mandate list verbatim:

- **The signature = the horizon over the case.** The page's one memorable thing is the pairing: life above (the swaying field), bones below (the shelves). Spend the boldness there; everything else stays quiet.
- **Bookcase execution** — cavity: inset top + side shadows on a slightly deepened panel tone; board: ~10px, gradient face, underside cast shadow; all colors from the token/paper world. If it ever reads as "themed," pull back toward the paper ground — the iBooks-wood failure is the named anti-pattern.
- **Wheat horizon execution** — two stalk layers (back dimmer/shorter), randomized heights/durations/delays, low-sun radial at the horizon, soil gradient at the base. Height ≈150px desktop / ≈118px at 390 (verify against NOW-band visibility, §8.7).
- **Cover-less books render as SPINES** standing on the line (weakness becomes charm).
- **Uncategorized renders as the UNSHELVED PILE** — rotated stack, OUTSIDE the case furniture, last on the page, with the classify invitation ("no shelf yet — classify to give them a home").
- **NOW band treatment** — a quiet card (--page-2) in every ground: what you're carrying sits on the desk, not in the case. Slightly larger covers; the carrying-question in mono italic --gold-deep under its book; "still reading" micro-mark.
- **See-all tile** — dashed cover-sized tile ends an overflowing band (mobile, after 2 shelves).
- **Fixture** — the round's mockup uses the REAL library (actual covers, the real 17-category census; the chat sketch used 6 categories and generated cover blocks).
- **60-second standard** — arrive at the field, flip the toggle, tap a value, tap a label: legible with zero explanation.

then amend:

- ~~"NOW treatment"~~ open item → **RESOLVED: the desk (§3.4)**; mockup builds it as ruled.
- Add: **the desk** joins the signature — the mockup's first-viewport composition at 390 is strip → desk → case, per §3.5.
- Re-shelving motion rider: **the case never moves — only the books do.** The Categories⇄Lenses flip animates covers between fixed cavities; cavities and boards never animate. Reduced-motion = instant regroup, no transition.
- Fixture rider: the mockup must show the desk in **both states** — carried (2–3 real books + a real carrying question) and empty (the one-line, no-furniture state per §3.4) — and the focused full view (§3.7) for at least one band.

---

## 6. STAGE-0 RECON CHECKLIST `[AMENDED v3]`

Items 1–7 carry verbatim from v2:

1. Real lens membership on Preston's data — is multi-membership actually present? Counts per lens? (A2's "also under…" depends on it.)
2. Real per-category counts across all 17 — band-density truth at ~129 books; how thin do thin bands get?
3. NOW band ingredients — still-reading source of truth; whether R-ARC's question/lens fields have shipped by round start (they should — R-SHELF runs after R-ARC). If absent, NOW ships still-reading-only, sparse-honest.
4. Current render path (renderShelf), the Manage sheet (canon P1 REFERENCE IMPLEMENTATION — preserve), filters-sheet residue, and the R8 Values-rail removal path (its count==data proof exists; removal must not orphan it).
5. Cover coverage census — how many cover-less books → real spine frequency.
6. Performance — 17 bands × lazy cover loading; the existing lazy classify/cover orchestration must survive re-grouping untouched.
7. **Horizon perf on a real phone** — sway animation cost at 390 (jank/battery), stalk count budget, and whether an off-screen pause is warranted; reduced-motion path proven.

v3 adds three **mockup-verification flags** from the July 17 adversarial pass:

8. **Ember-vs-cavity luminance** — sample the rest-state ember against the *darkened cavity tone*, not the page tone; starting bracket = 50–65% opacity on `--gold`, tuned by eye from there. The coal must read at arm's length without approaching cover luminance. ⚠ Riskiest felt ambiguity of the round.
9. **Desk-tone-vs-cavity-tone** — verify the desk reads as *outside* the case (page-or-lighter vs. one-step-darker); if the tones converge, the inside/outside grammar collapses.
10. **Strip-not-banner** — first-glance check (not after-study): the 64px band must not scan as a loading skeleton or ad slot. Judge at cold first paint, fixture loaded.

---

## 7. SEAMS `[AMENDED v3]`

Carry v2 verbatim:

- **R-ARC** — books-under-question (Q11 sheddable lens) feeds the NOW band. Sequencing already favors this: R-ARC ships first.
- **HOME** — F9's meaning move is app-wide: the Home wheat section (flagged "unclear" July 6) inherits the same statement — the field on the horizon of your reading life. A Home alignment pass = named follow-on (§9), not this round's scope.
- **R-SCAN** — the Add FAB is the future door (F8). R-SCAN decides its own entry when it runs.
- **DEL-1** — delete lenses/categories/authors lands inside Manage later; F4's Manage consolidation is its landing pad.
- **Profile/Galaxy** — shelf = the working library; galaxy = the portrait. Related grammars, no forced shared components.
- **R10 Connections** — the value-light is per-page filtering only; cross-arc value viz stays R10's.

v3 adds:

- **Desktop canon seam:** the strip's desktop breathing range (96–120px) and full-width behavior at ≥1280 are deferred to the desktop composition pass; the mobile ruling does not bind desktop height, only the not-sticky law.

---

## 8. NON-GOALS `[CARRY-FORWARD]`

- No data-model changes to books, categories, lenses, or values. This is a display + IA round; any schema need = STOP and surface.
- No changes to the classification engine, Re-classify logic, or the lens/value GENERATORS — placement only.
- Manage sheet internals preserved (canon P1 reference implementation).
- Add FAB and Bloom: position and behavior untouched.
- No Scan UI of any kind.
- Galaxy untouched. Home untouched (the Home alignment is a follow-on, §9).
- state.js / integrations.js expected READ-only (a views.js + CSS round); stop and surface if a change genuinely seems required.

---

## 9. OPEN QUESTIONS `[AMENDED v3]`

Q1–Q6 carry verbatim from v2 at 3f5df8b:

1. Focused band view (label tap): own route vs expand-in-place. (SHAPE-B decides.)
2. Band order: fixed taxonomy order vs size vs recency of activity.
3. Search-empty state: everything dims + one honest line?
4. Value-chip overflow: 10 presets (plus named-own) in a 390px header — wrap vs scroll vs top-N + more.
5. NOW membership rules, exact: what counts as "still reading"; what counts as "carrying a question."
6. Band-count proof obligation: carry R8's count==data standard onto every band label (recommended: yes).

- Q7: **CLOSED** (§3.5). Q8: **CLOSED** (§3.6).
- No new open questions from the dial. The three adversarial flags are recon items (§6), not open questions — they have pass/fail answers.

---

## 10. PROCESS RECORD `[AMENDED v3]`

Carry v2's record:

Shaped July 14 in a dedicated chat, R-ARC pattern. The lived walk was intentionally skipped at Preston's steer — the July 6 verdict ("mostly good") makes this a composition round, and Preston directed the round at look + placement. Forks decided tappable: F1 carried Preston's mode-grouping amendment; A1/A2 arose from Claude's critique pass; F2–F8 landed at rec. **F9 was Preston's generative push** — he proposed the developed ground and the wheat-field motif, overruling v1's restraint mandate; Claude's horizon synthesis (field-as-window, not field-as-wallpaper) answered the meaning-collision and contrast concerns; ruled **Horizon + Bookcase** at rec, July 14. **Honest flag (R-ARC precedent):** most rulings landed at Claude's recommendation — the deployed felt pass on real data is the counter-test where this shape meets reality.

append:

*July 17 felt-dial session (Fable 5, per the July 15 plan change): four knobs ruled tappable (carved / breeze / single-coal / desk), Q7+Q8 closed, adversarial pass produced recon items 8–10. All four knob recs were taken at rec; the desk ruling generated the inside/outside unifying law. A second completeness pass surfaced and ruled §3.7 (focused view = case opens) and §3.8 (header scrolls away at 390, sticky = desktop question), both at rec, and hardened the brief with the splice diff-gate, the case-never-moves motion rider, the transform/opacity-only perf fence, and the dual-state desk fixture mandate. v3 = the dialed brief; mockup worktree spawns off its commit.*

---
*End of brief v3. Supersedes v2 (3f5df8b). Mockup gate = this file's commit hash.*
