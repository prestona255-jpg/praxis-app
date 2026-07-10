# R6 Sub-theory (DEEP) — build checkpoints

Parity source: `docs/studio/mockups/subtheory.html` (rev 1, felt-passed). Recon:
`docs/checkpoints/r6-subtheory-recon.md`. Local commits only, no push; round does NOT
close (Preston's felt pass). Cache bump v3.189→**v3.190** at Stage 7.

Preston's GO rulings: (1) ownership gap = LOW named debt for R9, CARRY not fix, W12
preserved exactly; (2) Finish = mockup wins (workshop + published-Page reopen, none on
draft Page); (3) Stage-6 Yumi recolor = sub-theory surfaces ONLY, notebook R4 teal untouched.

---

## STAGE 1 — Vocabulary (presentation only) ✅

**Mechanism:** UI-string rename only; stored `status` (`'draft'`/`'published'`) unchanged, no
migration (status is separate from the label — recon §3).

**Edits (js/views.js):**
- 9871 Page pill: `'Milestone set' : 'Set as milestone'` → `'Finished' : 'Finish'`.
- 11227 Build pill: `'Published · private' : 'Publish'` → `'Finished' : 'Finish'`.
- 9812-9813 describing comment: "private-milestone publish pill" → "Finish pill" (doc-with-diff).

**Gates:**
- Parse: `cscript tools/parse-check js/views.js` → **PARSE OK**.
- Old strings `Set as milestone|Milestone set|Published · private` → **0**.
- New `'Finished' : 'Finish'` → **2** (both pills).
- Diff = exactly the comment (2 lines) + 2 label lines; the status-write click handlers
  (9874-9883, 11230-11237) and `stPubDone()`/`pubDone()` guards are **byte-identical**.
- Arc-commons/profile "Publish" (`_arcHeadPublishControl`, `_opPublishControl`, etc.) **untouched** —
  decision #5 reserves "Publish" for the commons act.

Commit: `78174f5` (local, --no-verify per Preston's ruling; docs recon+checkpoint ride).

---

## STAGE 2 — The Page becomes the READ ✅

**views.js:** `renderSubTheoryPage` (9751) rebuilt as a read view — the editable canvas call
(was 10086), the hidden `publicBody`, the Write|Preview `previewBtn` toggle, the
`insertCitationAtCursor`/`refreshCitationPreviews` citation engine, and the evidence-attach rail
are all removed. New body: warm-dim (draft) / full-amber (finished) ground by `status`; topbar
with the single Edit door (`st-edit-door-outline` draft / `-quiet` finished) → `/build`; finished
adds the `st-room-threshold`, the reopen `Finished` pill (re-renders to draft), and `st-walknav`
(siblings via `_arcDetailBuildSubTheoryData`, arc name as spine); the read hero wraps
`renderSubTheoryReadOnly`; connections + Yumi kept; 2-col grid (rail column dropped). Splice was
CRLF-safe (numstat 168/1127 (154 body-splice + 14 readonly-evolution lines), no EOL flip). `renderSubTheoryReadOnly` evolved: draft flags private
entry-evidence (`subtheory-attached-private-tag` + cite `title`); finished filters it (extant).
**Delete** removed from the Page (a read surface) → relocates to the workshop (S3, verify/add).

**components.css:** grid 3-col→2-col; added `st-read-hero`, `st-edit-door*`, `st-room-threshold`,
`st-walknav*`, the shared `stb-warm-dim` warm-dim recipe (R5 `.arcfield-warm` literals + Universal
ink tiers, provenance-commented; `--lum-ink-4 #b3a480` = the named build-time stand-in), the AF4
readonly-token fix (folded into S2 — load-bearing for draft legibility), and mobile reflow. Live
tokens throughout (`--lum-gold-d` for threads, not the mockup's `--u-thread`).

**Gates (all PASS):**
- Parse: **PARSE OK**. Page `createWritingCanvas` call **gone** (3 remain: notebook 2148, build
  10301, marginalia 12756). `insertCitationAtCursor`/`refreshCitationPreviews`/`previewBtn`/`publicBody`
  = **0**. numstat 168/1127 (154 body-splice + 14 readonly-evolution lines) (no EOL flip; LF-consistent).
- **Live rig (:8760, synthetic TESTUID, no real account), DOM structural proof + console clean:**
  - **Finished** (stFin): full-amber (no warm-dim), threshold "entering the finished room", kicker
    "FINISHED", quiet edit door → `/build`, reopen "Finished" pill, saved cue, read hero, t-meta "3
    MARKED PASSAGES · 2 BOOKS", **2 superscripts, 2 evidence items (private dropped),
    `privateAsCite:false`** (Miami phrase → plain italics), connections row "Eros in the Classroom",
    Yumi, walk-nav (prev/next siblings + arc spine), **grid 906px/240px @1280**.
  - **Draft** (stDraft): warm-dim (`isWarmDim:true`, body `rgb(36,23,16)` = dark `--lum-ink`, §7
    polarity kept), no threshold, "STILL FORMING", outlined edit door, **no reopen pill, no saved
    chrome**, 0 superscripts, **3 evidence items + private tag shown** (`privateTagInList:1`,
    `privateAsCite:true`), no walk-nav.
  - **Reopen** click: published→draft, re-renders to warm-dim, threshold+pill gone.
  - **W12 signed-out** → "This sub-theory is private / Sign in…", no read-hero leak, **no crash**
    (gate preserved exactly).
  - **Seed read-only path** intact (renders "Desire as Political Refusal" read-only, no editor).
  - **Mobile <760**: grid 1-col, walk-nav `flex-direction:column`, edit door 44px.
  - Screenshots: `computer:screenshot` timed out twice (pane-capture tooling); DOM structural proof
    is the hard PASS/FAIL evidence per protocol; visual felt-pass is Preston's.
- Dead CSS from the removed editor (`st-main`/`st-gutter`/`st-canvas-host`/`st-ev-*`/`st-title-input`/
  `st-tools`/`st-delete`/`st-tb-build`/`subtheory-rail-*`/`subtheory-toggles`) left for the S6
  dead-selector purge.
- Ownership gap (R6-OWN) written to `subtheory-page.md` as LOW R9 debt; stale `9119→9751` anchor fixed.

Commit: `4a2b3cf` (local, --no-verify).

---

## STAGE 3 — The Workshop (sole editor) ✅

**views.js (`renderSubTheoryBuild`):** added `stb-warm-dim` to the workshop wrap (+ signed-out
wrap) — decision #8's warm-dim working register; added **FOCUS MODE** (a `stb-focus-toggle` in
the head acts + an `is-focus` modifier that collapses rail/Yumi/connections and narrows the prose
column); **re-homed Delete** from the Page to the foot of the workshop (a discreet `.stb-delete`
danger link — feature-preservation; the mockup modeled none, carried as a mechanical
determination). Editor (canvas 10301, `weaveNote` 10318, rail) unchanged; Open-the-page + Finish
extant.

**components.css:** the shared `.stb-warm-dim` becomes a CONTAINED rounded panel (`max-width:1220`,
`border-radius:26px`, border — the mockup's felt-passed values) so finishing OPENS the draft's
contained panel into the full-bleed amber room; workshop sheet/rail warm-dim depth; Focus Mode +
`.stb-delete` rules.

**Gates (all PASS):**
- Parse **PARSE OK**. Write|Preview toggle grep = **0** (never existed live). Finish placement:
  workshop `stb-pubpill` always (10270); Page reopen `st-pill-publish done` gated `published`
  (9899); **zero on the draft Page** — "one per direction, zero on draft."
- **Live rig (fresh S3 bundle; console clean):** Workshop `isWarmDim:true`, contained
  `max-width:1220px`/`border-radius:26px`, dark title ink `rgb(36,23,16)`, acts order
  saved·Finish·Focus·Open-the-page, Delete "Delete this sub-theory", rail 13 weave buttons.
  **Focus Mode** click → rail `display:none`, `.stb-main max-width:680px`, Yumi hidden, "Exit
  focus"; toggles back. Draft Page now contained too (no S2 regression).
- **Rig note:** hash-only `navigate` does NOT reload — must navigate to a distinct URL
  (`?cb=`) to load fresh code; verified loaded-code freshness via `fn.toString()` before probing.
- **FLAG for felt pass:** warm-dim = a CONTAINED panel on the route's dark ground (per the
  mockup's `.stb-warm-dim` values Preston felt-passed). If full-bleed was intended, one-line revert.

Commit: `066e056` (local, --no-verify).

---

## STAGE 4 — The Pull System (⚠ data-adjacent) ✅

**views.js (`renderSubTheoryBuild` rail):** the evidence rail graduates to a working organ —
(a) a `.stb-pull-filter` (book `<select>` populated from the reader's real marginalia-bearing
books + a free-text `<input>`), with a deterministic `filterPull()` closure that narrows the
`.stb-book` list by book OR passage-text and shows a `.stb-pull-empty` on no match; (b) every
weave carries a visible WOVEN/UNWOVEN **dot** (`.stb-weave-dot.is-lit` / unlit, from
`isEvidenceAttached`) + label, riding the extant `.stb-weave` inline-flex; (c) a
`wovenParagraph()` helper derives the "woven into ¶N" caption (paragraph split + book-title
marker search). `weaveNote` gains the marg element + flips dot/label + appends the caption.
**`writing-canvas.js` UNTOUCHED** (`insertAtCaret` reused verbatim). No Yumi generation.

**components.css:** `.stb-pull-filter` / `-book-sel` / `-search` / `-empty`, the luminous
`.stb-weave-dot(.is-lit)`, and `.stb-woven-where`. (Weave *colors* + the khaki `.stb-marg`
background are the R#7 skin/contrast fixes — Stage 6.)

**Gates (all PASS):**
- Parse **PARSE OK**. **`git status/diff js/writing-canvas.js` empty** — the shared canvas is
  untouched (the data-adjacent gate). No generative calls in the new code.
- **Live rig (fresh S4; console clean):** filter row present, select populated, **1 lit dot +
  13 unlit**, caption "woven into paragraph 1" (derivation correct). Interactions: text search
  "banking" → only Pedagogy (passage match); no-match → `.stb-pull-empty` shown, 0 visible; book
  filter isolates the chosen title; **weave-in click → dot lit + "woven in" + "woven into
  paragraph 1"** (litDots 1→2).
- **Imprecision noted:** the woven marker is the BOOK title (what a weave inserts), so
  "woven into ¶N" is book-level, not per-note; falls back to no caption when the marker isn't in
  the body. Display-only, no persisted field.

Commit: `d6f9bca` (local, --no-verify).

---

## STAGE 5 — The Notebook birth-only leaf ✅

**views.js:** decision #1 — the working leaf already has no prose composer (the capture composer
lives on the left leaf; the name is the single-line `notebook-forming-name` canvas); added the
reinforcing `nb-name-hint` "Name it — the writing happens in the workshop." decision #2 — the
working-leaf mint (`notebookCreateSubTheory`) drops the auto-nav (`location.hash='subtheory/'+st.id`)
and instead sets a render-layer `notebookNewborn` + re-renders; `buildNotebookRightLeaf` shows a
`buildNotebookNewbornCard` ("born just now · draft" + snippet + "Continue in the workshop →" door +
stay note) that REPLACES the gather form; the door navigates to `/build` and clears the newborn;
a fresh gather supersedes it. **N0: the mint data path (`createSubTheory` + `addEvidenceToSubTheory`)
is byte-unchanged — render/nav-layer only.** The Yumi thread-accept mint (`nameSubTheoryFromThread`,
3073) is OUT OF R6 SCOPE (Yumi feature layer) — untouched.

**components.css:** `nb-name-hint` + `nb-newborn-*` (notebook R4 light-skin literals). The
deep-teal Yumi `.nb-complicate` slot is UNTOUCHED (Preston ruling #3).

**Gates (all PASS):**
- Parse **PARSE OK**. Working-leaf auto-nav removed (only a comment references the old string).
  Data path intact (createSubTheory 2434 / addEvidenceToSubTheory 2440 unchanged).
- **Live rig (fresh S5; console clean) — full birth flow by clicking:** gather 2 notes → name
  hint shown, Create enabled → **click Create** → `noNav:true` (stayed `#notebook`), newborn card
  ("Wanting as a Curriculum", "born just now · draft", "…started from 2 marked passages.",
  "Continue in the workshop →", stay note), gather form replaced, **sub-theory created with
  evidence refs `n1,n2` (zero data loss)**, gather cleared → **click door** → nav to
  `#subtheory/<id>/build`, newborn cleared.
- **Scope guard #3 verified:** the notebook Yumi `.nb-complicate` renders `rgb(31,90,107)` (teal)
  — untouched.
- Reload-persistence is governed by the UNCHANGED `saveState` data path; state-level creation
  verified (a real-account reload cycle is Preston's live-smoke, not representable by synthetic auth).

Commit: `9f0f8b5` (local, --no-verify).

---

## STAGE 6 — Skin + Debt sweep ✅

**R#7 marginalia** (components.css): `.stb-marg` background `rgba(20,12,5,.3)` khaki → warm amber
wash `linear-gradient(rgba(248,224,120,.30),rgba(242,194,90,.20))`; `.stb-pg`/active `.stb-weave`
→ `--lum-gold-d`; `.stb-weave.done` → `--lum-ink-2`; border-top → warm.
**R#8 Yumi no-blue** (SUB-THEORY ONLY — notebook teal untouched per ruling #3): Page
`.st-yumi-eyebrow`/`-note p` → `--lum-gold-d`, `.lum-light`/`::before` → gold radial/gradient;
workshop `.stb-ymargin` → warm amber wash + `--lum-gold-d` text, `.stb-yd` → gold orb. 3 views.js
"cyan" comments updated.
**AF5**: page `.st-tb-saved` (dark ground) `--lum-ink-4`→`-3`; workshop `.stb-saved` (cream, bare-
on-field) →`--lum-ink-2` (a touched pair, taken to AA rather than left at the systemic residual).
**AF4** (readonly `--lum-*`) + **warm-dim glass depth**: shipped S2/S3, verified.
**Dead-CSS purge**: ~55 lines of orphaned Page-editor CSS removed (`.st-main`/`::before`/`.eyebrow`,
`.st-head`, `.st-title-input*`, `.subtheory-toggles-row`, `.st-tools*`, `.st-canvas-host*`,
`.manuscript`, `.st-gutter`/`.subtheory-rail-title`/`.st-ev-*`/page `.st-weave`, `.st-tb-build`, and
the mobile dead refs). `.subtheory-attached-private-tag` KEPT (used by S2 draft tag).

**Gates (all PASS):**
- Parse **PARSE OK**. **CSS braces balanced 3341/3341.** All purged `.st-page.lum-amber-deep`
  editor selectors = **0**. Sub-theory Yumi cyan literal = **0**.
- **Live rig (fresh S6; console clean):** Page Yumi note/eyebrow `rgb(207,156,42)` = gold
  (`yumiNoteIsCyan:false`); read hero/body/connections/walk-nav **intact after purge**; page saved
  `rgb(182,168,136)` = ink-3. Workshop Yumi `rgb(133,84,16)` gold; marginalia amber wash; workshop
  sheet/rail/canvas **intact**.
- **Contrast table** (computed WCAG; cream-ground pairs use a representative bg — the mockup verified
  the amber-wash pairs precisely at the values in ()):
  | pair | ground | ratio | verdict |
  |---|---|---|---|
  | page `st-tb-saved` ink-3 | dark finished | ~7:1 | PASS |
  | workshop `stb-saved` ink-2 | cream | **4.8** | PASS (was 2.35 ink-3) |
  | marginalia passage ink-2 | amber wash | 4.8 | PASS |
  | marginalia `stb-pg`/weave gold-d | amber wash | ~4.5 (mockup 4.72) | PASS |
  | weave.done ink-2 | amber wash | 4.8 | PASS |
  | Page/workshop Yumi gold-d | note wash | ~4.5 (mockup 4.65–5.11) | PASS |
- **Token provenance:** `--lum-gold-d` (register-aware: warm-dim `#855410` / full-amber `#cf9c2a`,
  lumen-amber.css), `--lum-ink-2/-3` (§4 warm-dim remap / lumen-amber.css), amber-wash + dot-orb
  effect literals (`rgba(248,224,120,…)`, `#fff4d6`) lifted from the felt-passed mockup (R5
  `.arcfield-warm` lineage). No new hex COLOR tokens minted.
- **Carried residual (mockup-flagged, systemic — NOT per-element):** the OTHER bare-on-field warm-dim
  labels (`.stb-eyebrow`, `.st-tb-kicker`, `.st-tb-back`) remain `--lum-ink-3`/`-4` on cream (~2.1–2.5:1)
  — the known warm-dim ink-ramp residual (flagged Stage 0 + the mockup R1 eval). Untouched here;
  wants a systemic ramp retune (a future decision), per the mockup's "systemic, not per-element."

Commit: `08f61ac` (local, --no-verify).

---

## STAGE 7 — Red-team + ship (v3.190) ✅ (THE STOP)

**§9 red-team (`fix-red-team`, whole diff b1c4518..HEAD): CLEAN — no block-commit findings.**
Independently re-derived: ES3-clean (0 const/let/arrow/backtick/class in added lines; parse gate
self-validated), `writing-canvas.js` untouched (range + working tree), W12/seed/not-found gates
intact through the ~1300→~330 page-rewrite splice, no detached-node getElementById, mint +
status data-paths byte-intact, `notebookNewborn` lifecycle leak-free, `filterPull`/`wovenParagraph`
loop/ReDoS/XSS-safe, all CSS scoped, braces 3341/3341, purge removed only 0-emission selectors.
Two residuals (non-blocking): (a) **nit FIXED** — `data-book-title` fallback `''`→`'Untitled'` to
match the option value (views.js), so a titleless-but-marginalia'd book's dropdown option isolates
correctly; (b) newborn-card persistence on notebook re-entry — a felt-pass UX judgment (documented).

**praxis-reviewer:** dispatched on the same diff; **still running at ship time** — its grade is the
one outstanding gate, to be confirmed before Preston's push. (fix-red-team already cleared the diff;
the ship commit is local/unpushed/reversible.)

**Full forensic smoke (rig :8760, fresh S6 build, synthetic TESTUID — no real account; console
clean on every surface):**
- **R5 arcs — NO BLEED:** `#arcs` (18 cards) + `#arc/<id>` (constellation) render clean; 0 R6-class
  leak. The shared-CSS bleed risk (the notebook-epic failure mode) is clear.
- **Sub-theory draft:** warm-dim, dark ink `rgb(36,23,16)`, gold Yumi (no cyan), outlined door, no
  pill, no walk-nav.
- **Sub-theory finished:** full-amber room + threshold + reopen + walk-nav + private-filter; read
  intact after the purge.
- **Workshop:** warm-dim contained panel, Focus Mode, pull-system (search/filter/dot/weave/caption),
  re-homed Delete, gold Yumi, amber marginalia.
- **Notebook mint:** gather→name→mint stays put + newborn card, evidence `n1,n2` (zero loss); **teal
  Yumi preserved** (ruling #3).
- **Signed-out:** gated, no crash.

**Cache bump:** `sw.js` `praxis-v3.189` → **`praxis-v3.190`** (PARSE OK).

**Commit list (local, unpushed):**
| stage | hash | subject |
|---|---|---|
| S1 | `78174f5` | vocab: Finish/Finished |
| S2 | `4a2b3cf` | the Page becomes the read |
| S3 | `066e056` | the workshop is the sole editor |
| S4 | `d6f9bca` | the pull system |
| S5 | `9f0f8b5` | the notebook births, the workshop writes |
| S6 | `08f61ac` | skin + debt |
| S7 | (this) | red-team + cache bump v3.190 — THE STOP |

**Carried residuals / for the round close (NOT this stop):**
- Warm-dim ink-ramp (bare-on-field `.stb-eyebrow`/`.st-tb-kicker`/`.st-tb-back` ~2.1–2.5:1) — known
  systemic residual, mockup-flagged, deferred.
- Newborn-card persistence on notebook re-entry — felt-pass judgment.
- **FORK for felt pass:** warm-dim = a CONTAINED panel (mockup's `.stb-warm-dim` values) on the
  route's dark ground; if full-bleed was intended, one-line revert.
- Ownership gap → R9 named debt (subtheory-page.md), server-side backstop verified, carried.
- **Round-close items (Preston's felt pass, then):** commit the mockup docs (`subtheory.html` +
  `subtheory-build.md`); update `sequence.md` (R6 → Shipped) + `BOARD.md`; re-run `tools/studio-build`
  (regenerate `builder.html`); set the surface-ledger frontmatter `state:`.

STOP — Preston's felt pass on the live build gates the round close + any push.

Commit: (recorded below on commit)
