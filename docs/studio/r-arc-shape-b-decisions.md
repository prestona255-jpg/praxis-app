# R-ARC — SHAPE-B locked decisions (the mockup's spec)

**Authored:** 2026-07-15, at the recon close, after Preston's rulings on forks F1–F7.
**Governs:** `docs/studio/mockups/r-arc-loop.html` — the SHAPE-B mockup.
**Governance order:** `docs/studio/r-arc-brief.md` (v4, the constitution) > this file > the mockups.
Where this file LOCKS something the brief left open (§7), this file is the decision of record.

**The counter-test:** the mockup is judged by **Preston writing in it** — not by screenshots, not by
computed styles. Every writing surface in it must be genuinely typeable.

---

## 0. The rulings this file encodes (Preston, 2026-07-15)

| Fork | Ruling | Consequence for the mockup |
|---|---|---|
| **F1** | **mote/basin vocabulary BINDING** for the unnamed sub-theory state. **"seed" is off-limits** as a schema key AND as a new user-facing noun. | The mockup never prints the noun "seed". Unnamed sub-theory = **mote** (the visual) accreting into a **basin** (the structure). |
| **F2** | Seedling smallness expresses through the **EXISTING luminosity channel** (brightness = mass). **Protected renderer untouched; node size unchanged.** Revisit only if luminosity alone reads illegible at felt pass. | No size variance anywhere in the field. Mass reads as **brightness only**. |
| **F3** | **CONFIRMED — seedling status is an ARC field only.** No third sub-theory status value, ever. The sub-theory pre-form state is the **basin structure**, not a status enum. | Motes/basins are structures, never `status` values. |
| **F4** | Superseded-block removal proceeds. **No new surface reads `profile.summary`.** All new Yumi speech routes through `gradeUtterance`. | The mockup shows **zero** "From how you read" blocks. |
| **F5** | **Sibling grader BELOW the frozen gate.** `YUMI_GATE_SYSTEM` never extended; the probe lands as a new call site per the in-file seam. | Architecture note only — no mockup surface. |
| **F6** | Yumi's workshop margin is **gold/amber, not cyan**. | Margin chrome = gold/amber. `--lum-cyan` stays Yumi-reserved elsewhere (Bloom/chat). |
| **F7** | 60-second demo = the **verbatim eruption WITHOUT the agenda face**. Agenda face = a **one-beat addendum** via **the thread-graduation moment** (Preston left the unread book blank → graduation is the path). | Two demo tracks — see §5. |
| **ADOPTED** | **Composer draft persistence** into S1 scope — typed-but-uncommitted text must survive navigate-away (local-first law). | The mockup demonstrates it (§2, D4). |

**Ratified record corrections:** the rig browser is `prestonpraxistest` (not `prestona255`); §9b's
screenshots are sourced from the test account; **F-DL5 hazard stands — `prestona255` does not sign into
the rig browser this round.**

---

## 1. ⚠ THE NAMING TABLE — the one thing SHAPE-B must still choose

F1 locked the **sub-theory** layer (mote / basin). The **arc** pre-form layer is still open, and it
carries a live collision the brief never saw:

**`_arcMaturityWord(arcId)` returns the literal string `'seed'`** for any zero-sub-theory arc, rendered
today as "0 sub-theories · seed" in the Arcs-list card meta ([views.js:3549](../../js/views.js)). So a
"seedling arc" would sit directly beside a meta line reading "seed" — two different pre-form nouns, one
surface, and F1 has now put "seed" off-limits as a user-facing noun.

**Therefore the naming table must resolve BOTH at once:**
1. the arc pre-form noun (§7b's "seedling / ember / spark"), and
2. what `_arcMaturityWord` says instead of `'seed'`.

**Recommendation to carry into the mockup (Preston's felt call, not locked here):** the **luminous
register** (ember / spark / kindling) over the **garden register** (seedling / sprout). The argument is
structural, not aesthetic — **F2 just ruled that mass reads as brightness and nothing else.** A garden
word promises growth in *size*, which the field will now never show; a luminous word promises exactly
what the channel actually delivers. "Form follows naming" cuts both ways: the noun should not write a
cheque the renderer can't cash.

The mockup presents the table with **live specimens at three masses**, so the word is judged against the
thing, not in the abstract.

---

## 2. S1 — THE DOOR

**D1 — The compose affordance is its own control, and it NEVER lives inside Bloom.**
Bloom owns bottom-right (z-9999, body-level, not auth-gated). Capture may not route through it — a
covenant reason, not a layout one: **capture is the reader's own act**, and threading it through Yumi's
orb makes her the doorway to the reader's own thought. That inverts "Yumi never speaks for the reader."
- **Desktop:** a persistent compose control in the nav, left of the avatar. Mono, quiet, always present.
- **Mobile:** a fixed control offset from Bloom — never stacked so the two read as one cluster.
- **Z-index:** ⚠ the CLAUDE.md ledger names 5 tiers; the sheet carries ~15+ (z-10000 reused by 3
  unrelated selectors; the `.st-picker`/`.st-confirm` 10010/10011/10020 family undocumented). **A fresh
  audit is required at build — the named 5 are not the whole story.**

**D2 — Zero decisions means DE-EMPHASIS, not a new mechanism.** (Recon correction — the brief framed
this as missing logic; it isn't.) `buildNotebookWriteline` **already** defaults the register
(`marginalia`, or `journal` on the journal tab) and `commit()` already reads it. All nine controls are
real; the defect is that they render at **equal weight** with no cue that "just type" works.
→ The mockup's capture surface: **the writeline is the only thing with visual weight.** Register chips
recede to a single quiet current-state affordance that can be *changed* but never *must* be. Photo /
add-image / paste / import / dictate collapse behind one overflow. **Write first, classify after.**

**D3 — Raw lands instantly; shaping is a separate, explicit act.** Never auto-processed. The capture
commits with no network on the critical path (live code already supports this: `saveState()` writes
localStorage synchronously first, then fires never-awaited syncs; `captureNote()` is fully synchronous;
`getCurrentUser()` is a synchronous `ls()` read). **The mockup must not show a spinner at capture.**

**D4 — Draft persistence (ADOPTED).** Typed-but-uncommitted text survives navigate-away. Today there is
**zero** `beforeunload` in `js/` and no in-progress text is saved — an eruption can still die, just not
in a spinner. The mockup demonstrates this: type, navigate away, come back, **the text is still there**.

**D5 — Raw has presence; the Inbox is the existing one.** (Recon: §9b finding 1 discharges free.) The
Notebook Inbox is a **computed view** — `notebookEntryMatchesTab()` → `filed === false && register !==
'journal'`. A raw capture landing with `filed=false` surfaces there **with no schema work and no second
inbox**. Home shows quiet presence ("3 unshaped captures") — never a hidden queue.

**D6 — Signed-out capture-without-loss is UNBUILT and stays a named gap.** Three independent layers
wall it (`renderNotebook` returns a signed-out prompt before the composer is constructed; `captureNote`
and `commitEntries` each no-op on `!user`), `praxis_state_anon` exists but **has no anon→uid merge**
(`loadState()` explicitly excludes that bucket), and there is no Firebase Anonymous Auth anywhere.
→ **The mockup models the signed-in path.** Signed-out capture is named in the ledger as build-scope,
not mocked as though it exists. ⚠ **Build-time trap:** `ImportCapture.open()`/`renderEntry()` have **no
auth check** — only `commitEntries` gates. The moment a signed-out-reachable compose entry points at
that overlay, a note can be typed, dictated, segmented, then **silently vanish on commit**.

---

## 3. S2 — SHAPING, BIRTH, AND THE SEEDLING

**D7 — The shaping proposal is a SHEET, not bubbles** (§7b). Top: the **question candidate**. Middle:
sources as a **scannable match-state list**. Bottom: **motes as cards**. Anchors shown on tap.

**D8 — Notice-and-ask is absolute: nothing enters that Preston didn't tap.** Every row is a proposal
with an explicit accept. Repairs are *offered*, never applied. **Batch consent is consent** — "Add all
3 shelf-matched books" is ONE explicit tap, and it must read as a decision, not a default.

**D9 — Match-states carry a verify/confidence affordance** (§9b finding 8: "Range" → *Range Rover
Manual*). The live matcher (`matchBook()`, two-pass title-then-author, returns `null` when ambiguous) is
the deterministic substrate — the sheet renders its confidence honestly, including its nulls.

**D10 — ⚠ The fixture is all-READ (Delta 1), and that changes the match-state set.** Every source in the
eruption is read. Sharpening the consequence: the eruption is **8 thinkers + 1 book title** (*Empire of
AI*), and under **Q6** thinkers are **threads, not books** — so "read every source" mostly describes
objects that carry **no book-level read state at all**.
→ **The sheet needs a state for "a thinker I've read but never shelved."** Match-states are therefore
at least: *matched-to-shelf* · *thread (no text chosen yet)* · *ambiguous — verify*. The brief's
two-state framing (matched-to-shelf / flagged-unread) is insufficient for its own mandated fixture.
**This is the sheet detail Preston carried to the mockup; it is the mockup's job to propose it.**

**D11 — Birth: one quiet ~600ms delight. NO CONFETTI, EVER.** Marks settle into a small field.
Reduced-motion honored. The seedling keeps its **birth eruption attached** — "born July 14 from this
capture" — as lineage, one tap from the field.

**D12 — Mass reads as brightness, and only brightness** (F2). No size variance. Named things carry
**shaped marks**; unnamed motes are **formless**, their only visual property brightness = accreted mass.
The protected renderer is untouched: it already maps maturity to halo opacity (`_stLuminosity`, clamped
**[0.32, 0.62]**) with fixed node size.
→ ⚠ **The mockup must test F2's own escape clause.** That clamp is a **1.94× luminosity span** carrying
the entire mass signal. The mockup renders motes at **three masses inside the real clamp** so Preston can
judge at felt pass whether brightness alone is legible — the exact revisit condition F2 names.

**D13 — Naming is the mint.** No title field exists until naming is invited; invitation comes at real
mass ("this gathering keeps circling something — what would you call it?"); naming is **never asked,
never forbidden** — a deliberate act can name early. On naming: the mote takes its mark, becomes a
sub-theory, and **the workshop opens with the basin pre-loaded in the rail**.
⚠ **Build-time asymmetry (recon):** a titleless **mote** is native today (`createSubTheory` never
validates `header`); a titleless **arc** is **not** — `createArc` hard-blocks a blank title
(`if (trimmedTitle === '') return null;`), and **no `updateArc`/`renameArc`/`setArcTitle` exists
anywhere** (zero hits), so `arc.title` is written once at birth and never mutated by any named function.
**"Naming is the mint" at the arc layer needs a rename path that does not exist.** Named here so the
build prompt carries it; not a mockup surface.

---

## 4. S3 — THE ROOM

**D14 — The raised hand is absolute. Yumi never speaks unbidden, ever.** She signals; the notice
unfolds **only on tap**; unread hands age quietly.
⚠ **CHROME SUPERSEDED (Slice 9, ruled Preston 2026-07-18):** the raised-hand SEAT of record is the
**Bloom orb brightening ONE static step to `--gold-hi`** (no breath/pulse/motion, YG-12) — **NO margin
dots, NO presence glyph, NO count, NO badge, NO new chrome** (FELT CANON: "the corner holds only the
orb — no badge, no count, no words"). The desktop-margin-dots / mobile-presence-glyph-with-count model
below is the earlier SHAPE-B chrome, **retained for record but NOT built**. The RD-6 hover/focus chip
carries the words; opening the Bloom delivers the held move (single slot, newest-wins, no queue).
- **Desktop:** true margin dots. *(superseded — see above)*
- **Mobile:** margin dots don't exist at 390px — **one fixed presence glyph with a count**; tap reveals
  the notice and scrolls to its anchor. *(superseded — orb-only, no count)*
- **Non-color affordance required** (never color alone). *(carried: the RD-6 chip + open-to-see is the
  non-color affordance; the brighten is not color-alone.)*
- **Persistence — RECONCILED (Slice 9 D14 pass, 2026-07-18) to the two-part law, NOT "sticky per
  session":** the earlier "no `sv()`" note is **stale** — `recordThreadDismissed` (yumi-brain.js:2233 →
  `_noticedSet` → `sv('praxis_yumi_noticed', …)`, yumi-brain.js:2199) has persisted since v3.128, and
  **Slice 8 (v3.228, `998bc46`) shipped the durable, forward-only `dismissReaderThread` tombstone**
  (state.js:1566 · views.js:21289). Ruled law: the **noticing** persists (may re-raise); the **hand**
  does not (leaving lowers it without spending the noticing — YG-6); **opened = spent**; only **explicit
  reader dismissal** is durable, via Slice 8's F-D path (reused, never rebuilt).

**D15 — The first move is seam-first, pre-lit on entry, opens on tap.** A tension between two of the
reader's **own** passages, as a question. **Never-moves:** never summarizes the pile · never proposes
thesis language · never fills gaps with content · never grades the draft · never repairs prose.
**Silences:** while text flows · while the draft is too young · right after a weave · when dismissed.

**D16 — ZERO "From how you read" blocks** (F4). Both live sites (`views.js:10764` the Page,
`views.js:11087` the workshop) are superseded and removed. ⚠ **The reason is stronger than the brief
knew:** `profile.summary` is generated by `considerProfileRefresh`, whose own comment reads **"NOT gated
through `gradeUtterance`"** — that text **bypassed the fidelity/leakage/stance gate at generation**. Any
replacement reusing it would inherit an ungraded source. **No new surface reads `profile.summary`.**
*(Out of scope — do NOT remove: `buildReaderModelSection` (Account) and `_pfThreadsSection` (Profile) are
labeled, owner-only, deliberately-navigated-to panels.)*

**D17 — Retrieval is legible and deterministic-first.** The rail generates candidates; Yumi **selects
from that set**; every pull carries its visible **why**; the passed-over set is one tap away; rail and
Yumi are **visually distinct**. No asymmetric knowledge.
**Recon correction:** the rail is **already corpus-wide** — it loops every book in `state.books`,
filtered to `register === 'marginalia'` only. **Fork 5's real ask is a REGISTER EXPANSION** (journal ·
question · raw captures · other sub-theories' bodies), not a scope widen. The widen already happened.

**D18 — Resume flow: four causes, four fixes.** (Recon — not one bug.) The mockup models the
**destination**: one obvious way back into the draft, caret placed.
1. `notebookNewborn` is a **bare module-level variable, never persisted** — a reload zeroes the only
   "Continue in the workshop →" door permanently, while the draft sits safe in Firestore.
2. **No persisted "your active drafts" surface exists anywhere** (Home / Notebook / Account).
3. The arc **Page-face** hardwires `focal = subs[0]` — **always the oldest** sub-theory, never the
   most-recently-edited.
4. **Zero auto-focus on Build mount** — `canvas.focus(` appears once in views.js, inside a different
   feature (`openMarginaliaEditor`).

**D19 — Desktop composition is this round's design work** (inherited from DW-3; no DW-POLISH pass).
Census, for the design to answer: `.st-build.lum-amber-deep{ min-height:100vh; }` forces the amber field
to fill the viewport regardless of draft length while `align-items:flex-start` never fills it — the
**mechanical source** of §9b finding 7's "mostly emptiness". Compounding it, `bumpLight()` ties `--lit`
to prose length, so a young draft is **deliberately dimmer**. **The workshop has no `ch` cap at any
tier** — the ≤72ch stopgap exists for the **Page**, not the workshop. **VISUAL GATE: these are computed
rules, not proof of the look.**

**D20 — Yumi's margin is gold/amber** (F6), never cyan.

---

## 5. THE DEMO — two tracks (F7)

**Track A — the 60-second loop, no explanation, all-read fixture:**
`capture (relief) → shape (recognition) → birth (one quiet ~600ms delight) → room (arrival)`
Fixture = the AI-liberation eruption, **verbatim**, every source **READ**. **The agenda face does not
appear.**

**Track B — the one-beat addendum: the agenda face via thread-graduation.**
Preston left the unread-book blank, so graduation is the path — and it is the better read: the unread
candidate is not a pre-existing gap, it **arrives** the moment a thinker-thread graduates into a chosen
text (Q6). One beat: a thread (e.g. a thinker with no text chosen) → choose a text → **it enters as an
unread candidate source**, and the agenda face lights for the first time. This demos the capability
honestly without contradicting the all-read fixture.

**The emotional arc, choreographed:** capture = relief · shaping = recognition · birth = one quiet
delight · graduation = earned pride · threshold = gravity · amber room = arrival. **No confetti, ever.**

**Accessibility:** reduced-motion honored at the threshold; the dim-ground ink-ramp debt is **budgeted,
not deepened**.

---

## 6. Ground + canon rails (non-negotiable in the mockup)

- **THE GROUND SPECTRUM** (CLAUDE.md §7): *you WORK in the light; you ENTER finished thinking in the
  amber.* Capture + Notebook + the Arcs list = **light**. The arc interior = **warm-dim** (dark ink
  kept — **warm-dim never inverts polarity**). The field = **deep-warm cognac**, feathered — never a
  hard dark panel in a light page. Full amber = reading rooms at true thresholds only.
- **Tokens by NAME only** — no new hardcoded hex. Fonts: `--font-serif` (Cormorant Garamond) titles/
  prose/italics · `--font-body` (DM Sans) · `--font-mono` (DM Mono) eyebrows/labels/meta.
- **Nav/menu/overlay chrome stays SOLID** — no `backdrop-filter`, no blur, no `filter`/`transform` on
  any ancestor of an absolutely-positioned child that can overflow it (the iOS nav bug), at every width.
- **Breakpoints are DESKTOP-FIRST**: base rules ARE desktop; `@media (max-width:759px)` steps down. 760
  is the divide. Verify at **390** and **~1280**.
- **Mockup follows the HOUSE PATTERN for fonts — link them, exactly as every shipped mockup does**
  (`subtheory.html`, `arcs.html`, `notebook.html` each carry 2 `fonts.googleapis` links and **zero**
  base64). Degrade to the stack's fallbacks offline. **Never inline base64 font binaries.**
  *(CORRECTED 2026-07-15 after SHAPE-B round 1: this file previously said "no external fetches" AND
  "fonts degrade gracefully" — contradictory, and stricter than the house. An agent resolved the
  contradiction by inlining 194KB of base64, taking the file to 321KB against a ~91KB house norm.
  My spec error, not the agent's.)*
- **No libraries. No CDN scripts. Self-running from `file://` by double-click.**
- **Fixture content is the real eruption, verbatim** — never lorem, never sample arc names.
- **House scale is ~90KB.** Thin fails; bloated fails.

---

## 7. Open — Preston's felt-pass calls (do not pre-decide)

1. **The naming table** (§1) — the arc pre-form noun + what replaces `_arcMaturityWord`'s `'seed'`.
   Luminous vs garden register; the mockup argues luminous, Preston rules.
2. **F2's escape clause** — is brightness alone legible across the real [0.32, 0.62] clamp? The mockup
   renders three masses inside it so the question is answerable by looking.
3. **The compose control's home** (D1) — nav slot vs fixed mobile control, judged in place.
4. **D10's third match-state** — how "a thinker I've read but never shelved" reads on the sheet.

---

## 7b. ⚠ SHAPE-B ROUND 1 FAILED — the five fixes round 2 MUST satisfy

Round 1 (`wf_15286d6c-935`) produced `docs/studio/mockups/r-arc-loop.html` and **failed its own gates**:
five BLOCKs across four independent verify lenses. Its synthesis agent reported *"Everything verifies."*
It did not. **Distrust self-reports — verify the file.** Two of three candidates died to transient API
errors, so the panel collapsed to **n=1**; the survivor won by survivorship, scoring **27/40**
(demo-legibility **5/10**, canon 6/10, decisions 7/10 — only writing-feel, 9/10, was strong).

**These five are gates, not suggestions. A candidate that fails any one of them is discarded.**

1. **THE SIGNAL MUST BE VISIBLE.** Round 1 clipped D14's raised-hand margin dots invisible behind an
   `overflow:hidden` ancestor — Yumi could not signal at any desktop width. The flagship feature of the
   speaking model rendered as nothing. **Prove the dots are visible at 1280 by measuring them, not by
   asserting them.**
2. **NO PRE-BAKED INTERACTIONS — EVER.** Round 1's D17 weave was static HTML posing as a demonstrated
   action: the prose already cited the source, so it *looked* woven. This is the **DWF-1 failure** —
   a control that looks wired and never was. Every claimed behavior must run from a real listener.
   **Cite the handler, or don't claim the behavior.** Same for D13's mint: round 1's basin never
   pre-loaded into the workshop rail.
3. **FIXTURE ISOLATION IS A VERIFIED REQUIREMENT, NOT A CLAIM.** Round 1's own header promised "every
   render function reads FROM this object; Preston's real text swaps in at ONE SITE" — and it was
   **false**. Prove it: change one string in `FIXTURE` and show every beat re-render from it.
4. **THE PLACEHOLDER ERUPTION MUST OBEY D10.** Round 1's placeholder said *"empire of ai just sitting
   there on the shelf **unread**"* — inside the Track-A demo that D10 defines as **all sources read**.
   The fixture argued against its own ruling and blurred the Track A/B split. Messy prose, yes —
   **self-contradicting prose, no.**
5. **TOKENS BY NAME — COUNTED.** Round 1 carried **82** raw hex literals outside `:root` (independently
   confirmed). Report the count; it must be **zero** outside `:root` and the declared review chrome.

**Plus (MAJOR, round 1):** neither emotional payoff landed on screen — birth sat below dense panels with
no `scrollIntoView`, and `enterRoom()` never hid the workshop nor scrolled to the amber room. **A beat
that fires off-screen has not landed.** And the ground spectrum conflated the *graduation* and
*threshold* beats, which §5 lists as distinct.

**What round 1 got genuinely right (keep it):** it is truly typeable end-to-end — real caret, real
`execCommand` insert, and **D4 verified across an actual `window.location.reload()`**. Its `writingFeel`
9/10 is the one result worth inheriting. It survives as round 2's **fourth contender**.

---

## 8. Carried to the build prompt (not mockup surfaces)

- **F3 tripwire:** `ensureSubTheoryFields` coerces — `if (st.status !== 'draft' && st.status !==
  'published') { st.status = 'draft'; }`. Any third sub-theory status is **silently erased on both load
  paths**. Seedling status is an **arc** field only.
- **Additive fields survive both paths:** `migrate()` and the Firestore merge **both** call the same
  `ensureArcFieldsAll` / `ensureSubTheoryFieldsAll`. No migrate step, no SCHEMA_VERSION bump. *(The
  standing "merge bypasses migrate" lesson is handled here — but only because both paths share the
  ensure-call. Anything that skips it re-opens the seam.)*
- **F5 seam:** the probe move is a **9th `gradeUtterance` call site**, new `*_SYSTEM`, own budget/
  cooldown key, one new `window.YumiBrain` export key. `YUMI_GATE_SYSTEM` is **never** extended.
  `claude-proxy` needs no change (verbatim relay: key check · body cap · model allow-list · clamp).
- **D13 asymmetry:** the arc layer has no rename path (`createArc` blocks blank titles; no
  `updateArc`/`renameArc` exists).
- **Never introduce a `state.seeds` key** — taken and load-bearing (migration bookkeeping, never synced).
- **Z-index audit required** before placing the compose control — the ledger's 5 tiers are not the
  sheet's ~15+.
