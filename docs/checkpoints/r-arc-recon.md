# R-ARC — Stage 0 recon (READ-ONLY)

**Round:** R-ARC (S1 Door + S2 Seedling + S3 Room, deep). **Canonical spec:** `docs/studio/r-arc-brief.md` v4.
**Session model:** Opus (deep-round work, per MODEL LAW). **Agents:** 3 × `praxis-recon`, all pinned `sonnet`
by frontmatter, dispatched with **no model override** (an override takes precedence over frontmatter and
would break the law).

No code touched. No commits. Tracked tree clean at recon start and end
(`git status --porcelain --untracked-files=no` → empty). Agent memory writes land in
`.claude/agent-memory/`, gitignored at `.gitignore:42` — no repo pollution.

**Anchor discipline:** every anchor below is a function-name grep at HEAD `42ef1a3`. Zero line-number
trust — `renderSubTheoryBuild` alone has been recorded at 9959 (pre-R5), 11128 (R6), and is **10863**
now. Line numbers appear only as at-this-HEAD conveniences; re-grep before citing.

---

## 0. Gate + ground truth

| Check | Result | Evidence |
|---|---|---|
| sequence.md `## Now` = R-ARC | PASS | single Now item; all prior rounds `[x]` under Shipped |
| DW/S-A close `fa278d1` on origin | PASS | **ancestor** of origin/main (3 docs commits past), not equal |
| `r-arc-brief.md` on origin | PASS | API blob `5a21400`, 15,695 B; local md5 == origin blob |
| No other regen-owner | PASS | Now = R-ARC alone; SCAN/R-SHELF unstarted in Next |
| origin HEAD | `42ef1a32b76f3f3cb68622f4604e73ceb77ac142` | ls-remote + GitHub API + local ref agree |
| Live cache version | `praxis-v3.210` | deployed `sw.js`; **matches** origin `sw.js` — deploy current |
| Byte-locks | `lumen-amber.css` 14,681 B · `marks.js` 10,255 B | both match FIX-PROTOCOL §2 |

---

## 1. ⚠ THE F-DL CHECK — CLOSED, NO-INCIDENT (Preston's ruling, 2026-07-15)

The brief §9 / handoff first-check ("Preston's July-14 bounced draft persists in `bodyPublic` — if
absent, STOP: re-open F-DL") is **closed NO-INCIDENT**. Preston's ruling: *"No bounce ever happened —
I don't believe there's any lost July-14 draft to find… the resume-flow gap stays in scope as design
work (it came from my real friction with the workshop, not from a specific lost draft)."*

**What the check actually found before the ruling — recorded so it is never re-litigated from memory:**

- The check was **not runnable** from this rig, and that is **not** the same as "absent." Reporting
  absence would have re-opened F-DL on a false premise.
- The connected browser is signed in as **`prestonpraxistest`**, not `prestona255`.
  *(Corrects `f-dl4.md`, which states the only connected browser is the real account.)*
- `prestonpraxistest` **cloud** (`userSubTheories/IdeCZD…`): 9 sub-theories, newest update
  2026-07-15T18:13, **zero July-14 records**. A real, conclusive cloud read.
- `prestona255` **cloud** (`userSubTheories/5rQp6…`): **unread** — `permission-denied` from the test
  session. The rules fence works as designed (proven, not assumed).
- `prestona255` **local cache** in this browser: max timestamp *anywhere in the blob* =
  **2026-07-13T00:29** (deep-walk of every nested numeric field across all three `praxis_state_*`
  blobs). The cache **stops a day before the event** and is structurally incapable of witnessing it.

**Hazard recorded for any future real-account check:** do **not** sign `prestona255` into this browser.
Its stale July-13 cache is precisely the outgoing-clobber source the F-DL latch family exists to block,
and **F-DL5** (stale-callback re-set race, load callbacks carry no uid-guard) is a documented unfixed
residual (`f-dl4.md`). A verification could become the data loss. Use a Firebase-console read or a
fresh Incognito profile.

**Independently corroborated by code:** the workshop canvas autosaves (700ms debounce) + flushes on
blur → `updateSubTheory` → `markSubTheoriesDirty()` → `saveState()`. There is no draft-loss mechanism
in the workshop to find. The friction is real; the lost artifact was not.

---

## 2. Decision-record delta — reconciliation (Preston's inlined record, 2026-07-15)

| Δ | Item | Verdict |
|---|---|---|
| 1 | Fixture correction: every eruption source is READ; fixture must not flag them unread | **No contradiction.** The brief mandates the reading-agenda face as a *capability* (§4 S2), never as fixture data. The delta self-reconciles ("stays a general capability; not exercised by this fixture"). **But it has a consequence — see Fork F7.** |
| 2 | Sub-theory felt notes COLLECTED → brief §9b | **PASS.** §9b present, exactly **10** numbered findings, "seven desktop screenshots" confirmed. |
| 3 | Rig ruling + MODEL LAW = context | **Honored.** All agents spawned by name, no model override. |

---

## 3. S1 — THE DOOR (capture)

**The Inbox is a computed view, not a collection.** `notebookEntryMatchesTab(entry, tabKey)` (views.js)
— `tabKey==='inbox'` → `entry.register !== 'journal' && entry.filed === false`. Counts rebuilt every
render by `buildNotebookTabModel()`; nothing cached or stored. Writers: `captureNote(register, body,
activeKey, images)` (views.js) sets `filed=false` unless a book tab is active; `commitEntries(items)`
(import-capture.js) sets `filed: bid ? true : false` per `matchBook()`.
→ **§9b finding 1 discharged cheaply:** a raw capture landing with `filed=false` and no book match
surfaces in the existing Inbox **for free**. S1 needs **no new collection** — the reconciliation is
routing/UI only.

**⚠ BRIEF CORRECTION — the register default already exists.** §9b finding 2 frames the capture moment as
*demanding* a register up front. Live code already defaults: `buildNotebookWriteline(activeKey)` sets
`var selected = (activeKey === 'journal') ? 'journal' : 'marginalia';` and `commit()` reads whatever
`selected` is. The user can type and hit Capture touching nothing. The 9-control count **is exact**
(3 register chips · photo · add-image · paste · import · dictate · capture) — but the defect is
**visual hierarchy, not logic**: nine controls at equal weight with no cue that "just type" works.
**This makes S1's zero-decision fix substantially cheaper than the brief implies** — a de-emphasis
pass, not a new default-and-classify-after mechanism.

**Local-first: mostly already true for signed-in users.** `saveState()` writes localStorage
**synchronously first** ("the durability guarantee"), then fires never-awaited per-domain Firestore
syncs behind dirty flags, each re-dirtying on failure. `captureNote()` is fully synchronous — zero
`await`/`.then` on the critical path. `getCurrentUser()` is a synchronous `ls('praxis_user', null)`
read, **not** an async Firebase check — deliberate, so auth survives reload without blocking.
→ **The F2 LAW's TTFK budget is not the problem.** The problem is a **hard sign-in wall**.

**The sign-in wall is three independent layers** (defense in depth, not one gate):
`renderNotebook()` returns a signed-out prompt before the composer is ever constructed ·
`captureNote` no-ops on `!user` · `commitEntries` returns `[]` on `!user`.
`praxis_state_anon` **exists** (`stateKey()` resolves to it when signed out) but **there is no
anon→uid merge**: `loadState()`'s only adoption path explicitly **excludes** the anon bucket. No
Firebase Anonymous Auth anywhere (`signInAnonymously`/`linkWithCredential`: zero hits, whole repo).
→ **§7 open-q7 (signed-out capture-without-loss) is fully unbuilt** — new design + build, not hardening.

**No persistent compose affordance exists.** Nav has wordmark · ⌘K search · 5 links · avatar ·
hamburger. The one persistent, body-level, route-independent, **not-auth-gated** affordance is the Yumi
Bloom (`buildYumiBloom`, mounted once to `document.body` by `renderYumiPanel()`), which owns
bottom-right at z-9999. A new compose control needs a different corner, a speed-dial off Bloom, or a
nav slot — none currently free.

**NEW GAP (not in the brief): the composer has no draft persistence.** Zero `beforeunload` listeners in
`js/` (whole-tree grep). No localStorage write of in-progress text. A typed-but-uncommitted note dies on
navigate-away or refresh. Adjacent to the F2 LAW and arguably inside it — an eruption *can* still die,
just not in a spinner.

**Latent trap for F2:** `ImportCapture.open()`/`renderEntry()` have **no auth check**; only
`commitEntries` gates. Inert today (the overlay is only reachable from the gated Notebook composer). The
moment F2 wires a signed-out-reachable compose entry to that overlay, a note can be typed, dictated,
segmented — then silently vanish on commit.

**Absence proofs (case-insensitive, whole `js/` tree):** `unshaped` · `seedling` · `basin` ·
`proto-arc`/`protoArc` → **zero hits**. No scaffolding exists; all of S1/S2's vocabulary is green-field.

---

## 4. S2 — THE SEEDLING ARC (data model)

### ⚠⚠ FORK F1 — "seed" is already FOUR-WAY overloaded, and one use is live on-screen

The brief §7b flags a collision **inside its own new vocabulary** ("seedling" = unnamed arc vs "seed" =
unnamed sub-theory). It shows **no awareness** of four pre-existing, load-bearing uses:

| # | Use | Where | Live? |
|---|---|---|---|
| 1 | `state.seeds.pedagogyOfDesire` — migration bookkeeping for the worked example | born in `migrate()` (state.js); **never synced** — zero hits in integrations.js | yes |
| 2 | `'__praxis_seed__'` sentinel `userId` — ownership marker for the shared example | views.js / state.js | yes |
| 3 | `seed` boolean on `publishedArcs` docs — allow-listed in `firestore.rules` `publishedArcKeys()`; only writer is the console-only `window.praxisSeedCommons` | integrations.js | yes |
| 4 | **`_arcMaturityWord(arcId)` returns the literal string `'seed'`** for any zero-sub-theory arc — rendered in the Arcs-list card meta ("0 sub-theories · seed") | `views.js:3549` (verified directly this session) | **yes — user-facing prose, today** |

**#4 is the trap.** The round wants to name the pre-form arc state, and shipped code **already renders
the word "seed" for exactly that state**, in the exact surface. Any SHAPE-B naming decision
(§7b's "seedling / ember / spark") must reckon with all four, and **no build may introduce a literal
top-level `state.seeds` key** — that name is taken and load-bearing.

### ⚠ FORK F2 — "the field renders seedlings small" collides with a NON-GOAL

Fork 4's visual law needs an **arc-level size** hook. The shared field renderer Home actually uses
(`arc-constellation.js` — **protected, NON-GOALS list**) maps maturity to **halo opacity only**
(`_stLuminosity`, clamped [0.32, 0.62]); node size is fixed (`_ST_SCALE`). The per-arc-card
mini-constellation (`_arcCardConstellation`, views.js — *not* protected) **does** scale diameter with
maturity — but that is per-sub-theory-within-a-card, not per-arc-within-the-field.
→ **Rendering seedlings small in the field requires either touching the protected renderer (a stated
NON-GOAL) or a views.js-side analogue.** Needs Preston's call; do not infer.

### ⚠ FORK F3 — a third `status` value would be silently erased

`ensureSubTheoryFields(st)` coerces hard (verified directly):
`if (st.status !== 'draft' && st.status !== 'published') { st.status = 'draft'; }`
Any invented sub-theory status ("seedling", "mote") is **wiped on the next normalize pass** — on
**both** load paths. Arcs are clear (no `status` field; `published` is a separate boolean), so **Fork 4's
arc-level status flip is safe** — but only at the arc layer. This is a live tripwire, not a theory.

### Fork 4 is otherwise mechanically supported — the known seam holds

`ensureArcFields` / `ensureSubTheoryFields` are the chokepoints, and **both** the localStorage
`migrate()` path **and** the Firestore merge path (inline in `onAuthStateChanged`, integrations.js) call
the **same state.js functions** (`ensureArcFieldsAll` / `ensureSubTheoryFieldsAll`). So an additive
field needs **no migrate step and no SCHEMA_VERSION bump** to survive both paths — exactly what Fork 4
asserts ("additive fields only; graduation = status flip, never a migration"). The project's standing
"Firestore merge bypasses migrate()" lesson is **handled here** by both paths sharing the ensure-call.

`SCHEMA_VERSION` in the default state is pinned `'1.9.3'` **deliberately** (an anchor, so new users walk
the whole chain); `migrate()` terminates at **`'1.30.0'`**, matching the live blob.

**Naming asymmetry (MEDIUM):** `createArc(title, description, userId)` **hard-blocks a blank title** —
`if (trimmedTitle === '') return null;` (verified directly). `createSubTheory(arcId, fields)` has **no
header validation** — `header` defaults to `''`. So a titleless **seed** (sub-theory) is native today; a
titleless **seedling** (arc) is **not** — it needs the origin phrase passed as `title`, or a new
creation path. The two nested pre-form states are **not** equally cheap. Also: no `updateArc`/
`renameArc`/`setArcTitle` exists anywhere (zero hits) — `arc.title` is written once at birth and never
mutated by any named function, which "naming is the mint" would need.

**Prior art for the Finish gate:** `buildPublishedArcDoc` already filters sub-theories to a non-empty
trimmed `header` before public projection — an unnamed seed **already cannot** appear in a published view.

**`bodyIntellectual`:** dormant but present. The R5 register-collapse folds legacy content into
`bodyPublic` once (idempotency flag `_regMergedV1`) and **never deletes** the source. Zero live write
sites post-R6; reads remain in `subTheoryRowLabel` (display fallback) and `spotlight.js` (still
searches it).

---

## 5. S3 — THE INHABITED ROOM (workshop + Yumi seat)

### Resume flow — one friction, four independent causes

**No data loss** (canvas autosave + flush-on-blur, confirmed) — consistent with the NO-INCIDENT ruling.
`currentSubTheoryId` is **write-only**: set by `renderRoute()`'s hash dispatch purely to drive
yumi-brain's lens; its only read is a dangling-pointer `console.warn`. It is **not** a resume mechanism.

The friction is a compound:
1. `notebookNewborn` is a **bare module-level variable, never persisted** — it renders the "Continue in
   the workshop →" door. **A reload, new tab, or later session zeroes it permanently**, even though the
   draft is intact in Firestore. The only affirmative resume prompt is session-ephemeral.
2. **No persisted "your active drafts" surface exists anywhere** (Home / Notebook / Account).
3. The arc **Page-face** picks `var focal = subs[0]` — **always the oldest sub-theory**, never the
   most-recently-edited. An arc with 2+ drafts can never surface any but the first-ever one.
4. **Zero auto-focus on Build mount.** `canvas.focus(` appears exactly once in views.js — inside
   `openMarginaliaEditor` (a different feature). Re-entering a draft presents static, unfocused prose;
   the caret is never placed, not even at end-of-document.

Every discovery surface routes to the **Page**, never Build; the Page's `stEditDoor` is the sole bridge
("the SOLE way into the workshop") and is only reachable once you've already found the right sub-theory.

### ⚠ BRIEF CORRECTION — the rail is ALREADY corpus-wide

Fork 5 reads as a scope widen (book → arc → corpus). Live, the rail loops **every book in
`state.books`** — the reader's whole library — filtered to `register === 'marginalia'` only.
**The widen already happened.** Fork 5's real ask is a **register expansion**: add journal · question ·
raw captures · other sub-theories' bodies as candidate material. Reframes the work substantially.

`filterPull` is a client-side scan toggling `display` on **already-rendered** DOM nodes — no index, no
query. → **§7 open-q5 answered from code:** today it is unambiguously the client-side-scan end, and it
will not degrade gracefully at corpus scale.

`weaveNote` calls `insertAtCaret(' *Title* ')` **and** `addEvidence(id, {kind:'entry', …})` as **two
uncoordinated writes** — no transactional link between "the prose mentions X" and "evidence contains X"
beyond a render-time title-substring match.

### The superseded blocks — exactly two sites, both verified

`grep -rn "From how you read" js/` → **exactly 2** (verified directly): `views.js:10764` (the Page's
`stYumi`) and `views.js:11087` (the workshop's `.stb-ymargin`). §9b's "sits **inside** the manuscript
column" is literal: `sheet.appendChild(ym)`, sibling to the canvas.
**Out of scope (do not remove):** `buildReaderModelSection` (Account) and `_pfThreadsSection` (Profile)
also consume the reader model, but are deliberately-navigated-to, labeled, owner-only panels and never
construct the string.

**Verdict on the margin seat: wired-but-decorative-in-behavior.** Real dismiss listener (handler cited,
per the DWF-1 own-state lesson), real data sources. **But**: always-visible (no signal-then-tap state
anywhere), and **dismissal is not persisted** — zero `sv()` calls in either handler, so it returns on
every render. That contradicts **Q1's** "sticky per session" and **Q2's** "unfolds only on tap"
simultaneously.

### ⚠⚠ FORK F4 — the superseded text never passed the gate in the first place

`profile.summary` — the exact sentence rendered unbidden in the workshop — is produced by
`considerProfileRefresh` / `generateProfileSummary`, whose own comment reads **"NOT gated through
gradeUtterance"** (verified directly at yumi-brain.js:2846). The superseded blocks don't merely violate
the *speaking model*; their content **bypassed the fidelity/leakage/stance gate at generation**. Any
replacement that reuses `profile.summary` inherits an **ungraded** source. This is a real finding for
the Q1/Q2 replacement design, and it is not in the brief.

### The frozen-gate boundary — mapped, and Fork 5's claim is architecturally TRUE

Gate proper (**must stay byte-identical**): `js/yumi-brain.js` §"YUMI EVAL GATE" — `YUMI_GATE_SYSTEM`,
budget/timeout/cache constants, `_yumiHash`, `_yumiGateBudgetSpend`, `_yumiWithTimeout`,
`buildGateUserMessage`, `_yumiParseGateVerdict`, and **`gradeUtterance(candidateText, readerInput)`** —
the single funnel. **8 call sites** (my `grep -c "gradeUtterance("` = 9 = 8 calls + the definition).

The seam is **self-documented in-file**: *"ALL new code here lives BELOW the frozen gate"* and *"Lives
BELOW the frozen gate."* Every move follows one identical 4-step shape: consent-gated context gather →
generate via its own `*_SYSTEM` + POST to `claude-proxy` → **`gradeUtterance`** → surface only on
`verdict.pass`. A grounding-probe move (Q3) fits as a **9th instance** — new `*_SYSTEM`, new
gather/generate, own budget/cooldown key, calling the **unmodified** `gradeUtterance`, plus one new key
on the `window.YumiBrain` export. **No proxy change needed** — `claude-proxy.js` is a verbatim relay
(key check · body cap · model allow-list · `max_tokens` clamp); zero grading intelligence server-side.

Consent flags live at `state.users[uid].profile.*`: `yumiReadsAlong` (master, default **true**),
`yumiReaderModel` (default **false**), `yumiWebGrounding` (default **false**) — read via `getProfile(uid)`
in views.js and directly in yumi-brain.js (two idioms, same field, not a bug).
→ **Fork 5's "downstream of the frozen gate, behind existing consent flags" is TRUE** — every existing
move already does exactly this.

### ⚠ FORK F5 — Q3's "own eval battery" is ambiguous, and one reading edits the frozen span

Today there is **one** shared rubric (`YUMI_GATE_SYSTEM`) used identically by all 8 call sites. Q3's
"New move family — own eval battery" reads two ways:
- **(a)** a separate sibling grader living downstream — byte-safe, touches nothing frozen; or
- **(b)** extending the **shared** `YUMI_GATE_SYSTEM` text to also check grounding-probe properties —
  which **edits the frozen span** and breaks a NON-GOAL.

Architecturally consequential. **SHAPE-B ruling required; must not be inferred.**

### Desktop composition (census only)

`.st-build.lum-amber-deep { min-height:100vh; }` is the **likely mechanical source** of §9b finding 7's
"mostly emptiness" — the amber field is forced to fill the viewport regardless of draft length, and
`.stb-build{display:flex; align-items:flex-start}` never stretches to fill it. Compounding: `bumpLight()`
ties a `--lit` custom property to prose length, so a young draft is **deliberately dimmer**.
Three tiers: base (≥760, applies 760–1199) `.stb-build{max-width:940px}` + rail 288px, **with no `ch`
cap on the workshop's prose at any tier**; `@media (min-width:1200px)` "DW-3 · SUB-THEORY BUILD" —
`.stb-main{flex:0 0 720px}` fixed, rail grows (comment self-labels "decays to 49% occ at 1920");
`@media (max-width:759px)` stacks. The **≤72ch stopgap the brief §6 names exists for the Page, not the
workshop** (`DW-STP2 · … DESKTOP READING MEASURE (D2)`).

**Per the VISUAL GATE:** these are computed rules, not proof of the look. No screenshot captured — the
design beat owns that.

### ⚠ FORK F6 (LOW) — "the cyan Yumi margin" is stale

The studio docs describe a "cyan Yumi margin." Live code is explicitly gold/amber, with a code comment
recording the R8/S6 recolor to canon gold *"— no blue"*. If any design assumes a cyan surface exists to
restyle, that model is stale.

---

## 6. ⚠ FORK F7 — Delta 1's consequence: the 60-second demo can't show the reading-agenda face

Not a contradiction, but a consequence that needs a call. §7b mandates two things that Delta 1 now puts
in tension:
- the fixture **must** be the AI-liberation eruption, **verbatim**; and
- the whole loop must be demoable in 60 seconds without a word of explanation.

With every source read (Delta 1), the seedling's **reading-agenda face** — a headline S2 capability
(§4 S2: "unread candidate sources are first-class"; §2 B1: "unread sources make an arc a reading
agenda") — has **no data to render** in the mandated demo.
**Options:** (a) demo shows the face in its all-read state; (b) a second fixture exercises it;
(c) the face is out of the 60-second cut and demoed separately. **Preston's call.**

Sharpening it: §1's eruption list is **8 thinkers + 1 book title** (*Empire of AI*). Under **Q6**
(books-spine + threads), thinkers are **threads**, not books — so "has read every source" mostly
describes objects that carry **no book-level read state at all**. The shaping sheet's match-states
(matched-to-shelf / flagged-unread) may not have a slot for "a thinker I've read but never shelved."
Worth resolving at SHAPE-B before the sheet is drawn.

---

## 7. Doc-currency fixes riding this recon's commit (Preston's ruling)

1. `docs/studio/sequence.md` — the Now item's *"**no round brief exists yet**, see Pending inputs"* is
   stale; the brief landed at `28ae86a`.
2. `docs/studio/r-arc.md` — `status: future round` → in-round; Round history seeded.
3. `docs/studio/r-arc-brief.md` §9 — the F-DL first-check annotated **CLOSED — NO-INCIDENT**.
   §1's "tried the workshop and bounced" framing is **left alone** — Preston retracted the lost-draft
   artifact, not his experience of the friction. Flagged, not silently rewritten.

---

## 8. Residuals + what could not be determined

- **`prestona255` cloud contents** — unreadable from this session by design (`permission-denied`).
  Moot under NO-INCIDENT; recorded so no future session assumes it was checked.
- **PWA dictation at real eruption length** (§9 diligence) — needs a device; not attempted.
  Live evidence that it matters: `[keyboard clacking]` captured as a note (§9b).
- **Cross-device draft-conflict behavior** (§9 diligence) — not exercised.
- **The "emptiness" look** — CSS rules cited, no screenshot. Computed rules corroborate; they never
  prove a look (VISUAL GATE).
- **Z-INDEX LEDGER is non-exhaustive** — CLAUDE.md names 5 tiers; the sheet carries ~15+ (z-10000 reused
  by 3 unrelated selectors; the `.st-picker`/`.st-confirm` 10010/10011/10020 family undocumented). A new
  persistent compose affordance needs a fresh z-index audit, not the named 5. *(Doc drift; not fixed
  here — out of this recon's diff.)*
- **`docs/studio/subtheory-build.md`** carries three mutually-inconsistent stale line numbers for
  `renderSubTheoryBuild` (~10449 / ~10242 / 11128; actual 10863). Expected per-round churn; noted, not
  fixed here.

---

## 9. STOP — decision gate

Recon complete. **Seven forks (F1–F7) need Preston's call before SHAPE-B**, per THE FORK RULE:
architecture forks, scope additions, and design-comp changes surface at a HOLD; mechanical
determinations are carried silently.

| Fork | Question | Weight |
|---|---|---|
| **F1** | "seed" is already 4-way overloaded — one use renders on-screen today (`_arcMaturityWord` → `'seed'`). Naming decision must reckon with all four. | **HIGH** |
| **F2** | "Field renders seedlings small" needs an arc-level size hook that exists only in the **protected** renderer (NON-GOAL). Touch it, build a views.js analogue, or drop the visual law? | **HIGH** |
| **F3** | Sub-theory `status` coerces any third value to `'draft'`. Arc-level status is safe; confirm the seedling status lives on the **arc**. | **MEDIUM** (tripwire) |
| **F4** | The superseded blocks' `profile.summary` **bypassed `gradeUtterance` at generation**. Does the replacement inherit an ungraded source? | **HIGH** |
| **F5** | Q3 "own eval battery" — sibling grader (byte-safe) or extend the shared `YUMI_GATE_SYSTEM` (**edits the frozen span**)? | **HIGH** |
| **F6** | "Cyan Yumi margin" is stale — live is gold/amber, "no blue". | LOW |
| **F7** | Delta 1 vs §7b: the 60-second demo can no longer exercise the reading-agenda face. | **MEDIUM** |

Plus three **brief corrections** that make the round *cheaper* than written, and should be reflected
before SHAPE-B: the register default already exists (S1 = hierarchy, not logic) · the pull rail is
already corpus-wide (Fork 5 = register expansion) · resume-flow is four causes, not one.
