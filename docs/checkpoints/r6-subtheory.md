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
CRLF-safe (numstat 154/1127, no EOL flip). `renderSubTheoryReadOnly` evolved: draft flags private
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
  = **0**. numstat 154/1127 (no EOL flip; LF-consistent).
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

Commit: (recorded below on commit)
