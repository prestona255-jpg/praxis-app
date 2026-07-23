# THE ARC STANDARD — Stage 0 RECON

**Date:** 2026-07-22 · **HEAD:** `9f254a0` · **CACHE_VERSION:** `praxis-v3.243`
**Status:** RECON COMPLETE — **HALTED for rulings.** No app code touched. Nothing staged.

Sources read in full: `docs/studio/arc-standard-brief.md` (main `9f254a0`) ·
`mockups/arc-standard-notes.md` + `mockups/arc-standard-mockup.html`
(`mockup/arc-standard`, head `1ee4bb5`, **confirmed on origin** —
`refs/heads/mockup/arc-standard = 1ee4bb5`).

Byte-locked foundations re-md5'd and unchanged: `lumen-amber.css`
`070679b03453ca0d8405cb6f92ec5ad2` (14,966 B) · `marks.js`
`772886c049d0d6d03d341507e602d88a` (10,255 B).

---

## §0 — What the sources say

**Brief §3 — 12 laws** (the acceptance criteria), counted: one ground · one world ·
the horizon speaks · sparse-honest · one gate · form first · approach never teleport ·
honest doors · soil below sky above · threads are gold · the pull is physical ·
writing has a body. **12 confirmed.**

**Notes-file rulings carried into the build (8):**

| # | ruling | effect on this build |
|---|---|---|
| 1 | **PALETTE-X** — pigments 5 → 10, named not numbered, each ≥3:1 on the sheet **foot** | 10 new pigment tokens; the F6 "five jewel families" sentence is superseded |
| 2 | **SHAPES-X → NINE** (`stone` cut by P-1 at 34px) | silhouette axis = 9, not 10 |
| 3 | **R-2 gold retires as a pigment**; verdigris `#3C9257` holds the 10th slot | gold = attention/coal/harvest only; **m1/gold marks re-point to OCHRE** |
| 4 | **R-1 F-1/P-2 split** accepted as built | fixture concern only; no build effect |
| 5 | **2-line label clamp at 390 STANDS** | resting labels clamp; full name returns on approach |
| 6 | **Approach = ZOOM**, crossfade stays as the built, unruled-out fallback | S2 builds zoom + reduced-motion instant swap |
| 7 | **ember door EMPTY** (`marks.length` gate) | the ember arc's door seat carries no act until a mark exists |
| 8 | rig graduation = a CLOSE ruling, carried | → **FORK 1** below |

**Unrecorded divergences found between mockup and live** — three, all data-shape,
all raised as forks below (§7 FORKS). Nothing else diverged.

---

## §1 — Rig graduation (brief item 2) — **verified, and it collides with a standing ruling**

**The hook check, verified.** `hooks/pre-commit` #3 exempts `docs/`, `tools/` and
`design/` from the "source must ride a cache bump" block:

```
grep -Ev '^docs/' | grep -Ev '^tools/' | grep -Ev '^design/'
```

So `tools/rig/` **is** hook-exempt, exactly as the prompt states. That half checks out.

**But the location is ruled the other way, and the ruling is not stale.**
`.claude/rig/README.md:11-33` carries a Preston ruling of **2026-07-15**: *"the rig
NEVER moves to `tools/rig`."* Its premise is a live probe against
`praxis-reading.netlify.app` — there is **no `netlify.toml`** (confirmed absent this
session), so the publish root **is** the repo root; Netlify does not publish
dot-directories, and that is the only thing keeping the rig off the live site:

| path | live |
|---|---|
| `/.claude/rig/seed.js` | 404 |
| `/tools/parse-check` | **200** — proof `tools/` ships |

The measurement rig's `seed.js` is auth-shaped, which is what made the move
dangerous. **The capture rig is not** — it is `frame.html` (an iframe wrapper) and
`shoot.ps1` (a CDP script). Serving those is a much smaller thing than serving
`seed.js`. So this is a real fork, not a blocker. → **FORK 1.**

**Working state this session:** the capture rig is staged at **`.claude/rigcap/`**,
which `.gitignore` already excludes (`.claude/*` with negations only for `agents/`
and `rig/`) — `git status --porcelain .claude/` returns empty. Nothing about the
final home is decided by that.

**The rig works, and better than the mockup round could manage.** The mockup notes
record that CDP + `Start-Process` were denied under the sandbox. In this session
`chrome --headless=new --screenshot` **does** run from bash — with one condition:
`--screenshot` needs an **absolute Windows path** (a relative path fails
`Access is denied`). Three further traps were hit and fixed, and are written into
`.claude/rigcap/frame-seeded.html`'s header so they are not relearned:

1. **Awaiting `caches.keys()` under `--virtual-time-budget` never settles** — the
   iframe stayed `src`-less and the capture came out as 12 KB of empty wrapper.
   SW/cache teardown is now fire-and-forget.
2. **Seed ids differ per browser profile.** Headless launches a fresh profile, the
   `__praxis_seed__` workspace re-seeds, and the arc id from the Browser pane
   rendered the not-found path. The wrapper now **resolves** the seed arc id
   (`h=seedarc`) instead of taking one.
3. **The auth stub is clobbered by the app's auth boot.** A pre-load
   `praxis_user` write is not enough — the first capture showed the signed-out
   "Build your own arc" CTA. The wrapper now re-stubs **after** iframe load and
   re-renders.

Honest limits, restated wherever its output is used: **dpr 1** (geometry true,
hairline rendering not), `position:fixed` pins to the frame, `100vh` = frame height.

**Fresh, dated captures taken against these bytes (capture-provenance law):**
`.claude/rigcap/shots/before-field-1360.png` · `before-field-390.png`
(2026-07-22, seed arc, signed-in as the rig stub). These are the felt-delta
BEFORE baseline. They are gitignored and are not evidence of anything except the
current bytes.

---

## §2 — Surface census (brief item 3)

### 2.1 Routes and renderers

| route | renderer | views.js |
|---|---|---|
| `#arc/<id>` | `renderArcDetail` | 13034–13595 |
| `#subtheory/<id>` | `renderSubTheoryPage` (READ-only since R6 S2) | 10643–11011 |
| `#subtheory/<id>/build` | `renderSubTheoryBuild` (the workshop — sole editor) | 11011–11742 |
| `#walk/<arcId>` | `renderInteract` (visitor lens) | 20203 |

`renderRoute` maps `arc` / `arcs` / `subtheory` to the `arcs` nav (views.js:497).

### 2.2 The Gate Row census (brief §7.7) — every control, with its handler

Seven-plus controls exist today. Measured live at 1360, signed-in, on the seed arc
(15 focusable controls inside `.arcfield`; the owner-only ones are code-confirmed
and do not render on a seed arc, whose `userId` is the sentinel):

| # | control | class | handler | F5 destination |
|---|---|---|---|---|
| 1 | Field / Read / Page seg | `.seg.arcfield-faces` | `sv('praxis_arc_face')` → re-render | **DISSOLVES** (F5) |
| 2 | `+ Sub-theory` (head canon) | `.arcfield-addsub-canon` | `notebookCreateSubTheory({arcId})` | Gate Row primary act ✔ |
| 3 | `＋ Add a sub-theory` (rail) | `.btn.arcfield-add-sub` | same call | **duplicate — retire** |
| 4 | Delete arc / Hide arc | `.arc-detail-delete` | `openArcDeleteConfirm` | ⋯ overflow ✔ (F5) |
| 5 | Graduate | `.arcfield-graduate-btn` | `graduateArc` → `renderRoute` | → **FORK 4** |
| 6 | Return to ember | `.arcfield-ungraduate-btn` | `ungraduateArc` | ⋯ overflow ✔ (F5) |
| 7 | Rename | `.arcfield-rename-btn` | `_arcInlineRename` | **ceases to exist** ✔ (F5) |
| 8 | ember/graduated chip | `.arcfield-status-chip` | — | kicker word ✔ (F5) |
| 9 | Publish to the commons | `.arcfield-pub-btn` | `openPublishCeremony` | lifecycle door ✔ (F8) |
| 10 | Unpublish | `.arcfield-pub-btn-quiet` | `openUnpublishConfirm` | ⋯ overflow (proposed) |
| 11 | Tidy / Restore | `.arcfield-tidy` | `sv('praxis_arc_tidy')` | **unnamed by F5** → §7 Q |
| 12 | Connect | `[data-st-control=connect]` | `attachSubTheoryDrag` arming → `linkSubTheories` | **unnamed by F5** → §7 Q |
| 13 | Reset placements | `.arc-reset-btn` | `openArcResetConfirm` (destructive) | ⋯ overflow (proposed) |
| 14 | Layers popover | `.st-layers` + 4 switches | ls flags + live svg attrs; palette re-renders | ⋯ overflow (proposed) |
| 15 | Ask Yumi what she sees here | `.arc-voice-ask` | `requestArcVoice` | **unnamed by F5** → §7 Q |
| 16 | value-mark register | `buildValueMarkRegister('arc',id)` | own writes | F4: embers on the sky; panel dissolves ✔ |
| 17 | Change mark ▾ (Read face) | `.read-change-mark` | `openSymbolPicker` | → the mark composer (S4) ✔ |

Controls 11, 12 and 15 are **live, wired behaviour that F5 does not name a seat
for.** Behaviour-preservation outranks structure-match (standing law), so they get
seats — but which seat is a ruling, not a mechanical call. → §7 Question.

### 2.3 READ-FACE-ONLY census (brief §7.1) — nothing dies silently

`_arcFieldReadFace` (13602) → `_arcReadSpine` (13670).

| # | lives only in the Read face | verdict |
|---|---|---|
| R1 | index-proportional gutter thread curves (`_buildReadGutterInto`, 13777) | **RETIRE BY NAME** — the field's real threads supersede a list-gutter approximation |
| R2 | first display line of the body (`_arcReadFirstLine`, 13799) | **CARRIED** — into the approach card (F7 "its read speaks") |
| R3 | maturity glow dot + word (`_arcReadMaturityKey`/`_stMaturityWord`) | **CARRIED** — maturity sizing + single-coal ember (F6/S1) |
| R4 | `private` marker on draft rows (`.read-private`) | **CARRIED — needs an explicit carrier**: the field must show draft/private honestly. Proposed: the FF-7 kicker word on the approach card |
| R5 | per-row thread count (`connCount` "N threads") | **CARRIED** — the approach's count (F7) |
| R6 | `Change mark ▾` → `openSymbolPicker` | **CARRIED** — the mark composer replaces the picker (S4) |
| R7 | arc closing line "N sub-theories · M threads in this field" | **RETIRE BY NAME** — sparse-honest; the counts already ride the Gate Row kicker |
| R8 | row link `#subtheory/<id>` | **CARRIED** — the approach's quiet `Open →` |

⚠ **`_arcReadSpine` MUST NOT BE DELETED.** views.js:13663-64 states it is shared:
*"one renderer, two lenses (the author `_arcFieldReadFace`, and the visitor
`renderInteract` #walk)"*. Only the **arc-author call site** retires. Deleting the
renderer would break the R11-adjacent visitor walk, which is a named non-goal.

**PAGE-FACE-ONLY** (`_arcFieldPageFace`, 13829): focal-mark hero + `Write "<header>"`
+ a fixed blurb + `Open the workshop →`, and a `Write the first sub-theory` empty.
It is a self-described **stub**. **RETIRE BY NAME** — the field's marks are the real
path to the page; the ember horizon covers the empty.

**Also retired with the switcher:** the `praxis_arc_face` localStorage preference
(stop reading it; leave the key inert).

### 2.4 Field-only chrome F1/F4 dissolves

`.arcfield-desc` (`arc.description`, 122 chars on the seed) · the in-canvas legend
row (resonance / faint / gathered / incorporated / book) + its hint line · the
`.arcfield-tidy-help` caption · `.arcfield-whisper` (F-D3 cyan concentrate card —
**carried** into the approach's read) · `.arcfield-rail` "Books in this arc"
(**becomes the soil row**, G1) · `.arcfield-rail` "Notes in this arc"
(**unnamed by G1** → §7 Question) · `.arcfield-empty` zero-sub state
(**replaced** by the ember horizon).

---

## §3 — Input + canvas census (brief §7.12) — **G6's premise is STALE**

**The finding.** G6 rules "full `createWritingCanvas` adoption … replacing the
legacy raw textarea", and names a fallback if the cite-weave closure is too
entangled to swap. **There is no raw textarea to replace.** The workshop already
runs on the canvas, and has since before this brief was written:

```
views.js:11213   canvas = createWritingCanvas(canvasHost, {
                   surfaceId: 'subtheory-build',
                   initialValue: subTheory.bodyPublic || '',
                   onSave: function (markdown, report) { updateSubTheory(id, { bodyPublic: md }); … }
```

Full input census, arc surfaces:

| surface | input | substrate |
|---|---|---|
| workshop prose | `.stb-canvas-host` | **`createWritingCanvas`** (a `contenteditable` `div.wc-input` in `div.wc-wrap`, writing-canvas.js:128-140) |
| workshop title | `.stb-title-input` | native `<input type=text>`, commit on blur |
| gather filter | `.stb-pull-book-sel` | **native `<select>`** — the P-B fracture G4 retires |
| gather search | `.stb-pull-search` | native `<input type=text>` |
| arc name | `.arcfield-q-rename` | native `<input>`, swapped in on Rename |
| sub-theory page | — | **no editor at all** (R6 S2: the Page is READ; the workshop is the sole editor) |

`grep -n "createElement('textarea')" js/views.js` → 8 hits, **zero** on any arc
surface (they are notebook composer, book notes, reader-model, account).

**What Preston actually saw is real, and it is three CSS lines, not a substrate.**
The workshop *strips the canvas's own dress*:

```
components.css:12170  .st-build.lum-amber-deep .stb-canvas-host .wc-wrap{ background:none; border:none; padding:0; }
components.css:12171  … .wc-input{ … min-height:200px; outline:none; }
```

`.wc-wrap` loses its background, border and padding; `.wc-input` is given
`outline:none` with no replacement focus treatment. That is precisely law 12's
failure mode — *"never a bare textarea floating on the ground … with honest
focus"* — produced by de-dressing a real canvas rather than by using a textarea.

**§7.12 VERDICT:** full canvas adoption is **already true**; the named fallback is
**not triggered and must not be invoked** (invoking it would be a fiction). G6's
remaining, real work is:
1. **restore the bounded Lifted-Sheet dress + an honest focus state** on
   `.stb-canvas-host` (law 12), and
2. **the kit-dialect sweep** on the other four inputs above (law 12's second half),
   of which the `<select>` retirement is already G4's job.

This is a **brief-premise correction, not a scope change** — the law is unchanged
and the work shrinks. Recorded here rather than resolved silently. → §7 ruling A.

---

## §4 — Identity data census (brief §7.2) + the migration table (G3)

### 4.1 What exists today

Sub-theory record keys, read live off the seed records:
`id · arcId · userId · header · bodyPublic · bodyIntellectual · evidence ·
attachedMarginalia · linkedSubTheories · citationPins · status · format ·
publishedAt · x · y · createdAt · updatedAt · valueMarks · evidenceLayout ·
_regMergedV1 · originEntryId · answeringLine`

**No `silhouette`, no `treatment`, no `pigment` field exists.** Identity is two
optional integers plus a hash fallback:

| field | range | default when absent |
|---|---|---|
| `markShape` | 0–15 | `_stIdentityHash(id, 11) % 16` (arc-constellation.js:484) |
| `markColor` | 0–15 | `_stIdentityHash(id, 17) % 16` (arc-constellation.js:480) |

`markShape` indexes `_ST_MARK_TABLE` — **16 frozen body paths** with inner detail
(arc-constellation.js, `/*01*/…/*16*/`). `markColor` indexes
`var(--subtheory-N)`, and theme.css:397-412 collapses those 16 tokens onto the
**five** jewels `--m1..--m5` (B2's ruled 16→5, `((N-1) mod 5)+1`).

The `_ST_SILHOUETTES` (4) × `_ST_TREATMENTS` (14) construction at
arc-constellation.js:429-432 is **dead code** on the render path — its own comment
says so ("retires from the render path … remain as dead code"). It is not an
existing treatment axis; there is nothing to migrate from.

Both fields are absent on all four seed sub-theories (`typeof … === 'undefined'`),
so every seed mark is hash-derived today.

### 4.2 Proposed deterministic migration — **DERIVE, DO NOT WRITE**

The strongest form of "no silent identity changes" is to write nothing at all. One
pure function, `_stMarkIdentity(rec) → {silhouette, treatment, pigment}`:

| axis | source | rule |
|---|---|---|
| **pigment** | `markColor` (0–15), else hash %16 | a fixed **16 → 10** table `PIG16[]`. The four surviving jewel anchors keep their slots (m2→terracotta, m3→olive, m4→teal, m5→ochre); **m1/gold → OCHRE** per R-2's migration note; the eleven remaining slots spread across madder · moss · verdigris · lapis · iris · plum. Today's renderer already collapses those 16 slots onto 5 hues, so a 16→10 table strictly **increases** separation |
| **silhouette** | `markShape` (0–15), else hash %16 | a fixed **16 → 9** table `SIL16[]` mapping each `_ST_MARK_TABLE` body to its nearest of `beacon · facet · seed · frond · gate · spire · well · vessel · bloom` |
| **treatment** | none exists | `_stIdentityHash(id, 13) % 3` — the same salt-13 axis the dead treatment code used, narrowed to 3. Independent of silhouette (salt 11) and pigment (salt 17); pure function of the id ⇒ **stable across reloads** |

New persisted fields `markSilhouette` / `markTreatment` / `markPigment` are written
**only by the composer** (S4), never by migration. Consequences worth stating:

- **S1 performs no data write.** The whole field re-composition is display-only,
  which removes the data-loss surface from the round's riskiest gate.
- Every mark's post-migration identity is **disclosed and reproducible** from its id
  + two tables that live in the diff.
- **Uniqueness (law 6) is not guaranteed for pre-existing marks** — 270 combos,
  hash-derived, so an in-arc collision is possible. S4 enforces uniqueness **at the
  mint** and **offers** recomposition for a pre-existing collision, never applies it
  (G3's repair grammar). This is the honest position; claiming migration guarantees
  uniqueness would be false.

### 4.3 Where the ten pigments live

New tokens in `theme.css` (**not** byte-locked; `lumen-amber.css` and `marks.js` are
and stay untouched). `--subtheory-1..16` and `--m1..--m5` are **not** repointed —
the book constellation, the spotlight chips and the picker all read them. The
pigments are an additive set the field's renderer reads.

---

## §5 — Zoom feasibility (brief §7.9) — **MEASURED. Transform-based camera.**

The app's field is **one `<svg viewBox="0 0 600 500">`**, not DOM nodes — which
makes the camera one attribute on one wrapper `<g>`, and makes law 7 true **by
construction**: every mark's authored position lives in its *own*
`transform="translate(x,y)"`, and an ancestor transform cannot mutate a descendant's
attribute.

Measured live, this session, seed arc, 1360:

| density | svg nodes | camera apply + forced reflow | authored positions before vs at 2.8× |
|---|---|---|---|
| 4 marks + 5 books (real seed) | 263 | 45.5 ms *(cold, first paint)* | **IDENTICAL** |
| **24 marks** (20 synthetic probes injected, then removed) | **553** | **3.5 ms** | **IDENTICAL** |

Positions also identical before vs **after** release. Sample, unchanged throughout:
`translate(300,90) · translate(460,250) · translate(300,410) · translate(140,250)`.

**VERDICT: transform-based camera, not staged render.** Not close.

Two riders for S2: (a) 24 halo circles carry inline `filter:blur(9px)`; blur under
scale is the one thing that could cost, so the flight is a CSS transition on the
wrapper (compositor path), not a per-frame attribute write; (b) the 45.5 ms figure
is cold-start including a synchronous forced reflow — 3.5 ms is the steady number.

---

## §6 — The remaining §7 items

- **§7.3 mass-legibility / DUSK CARVE tripwire** — deferred to S1 as designed
  (it is a look judgement at density on real data, not a recon measurement).
- **§7.4 thread/connection chrome.** Field threads are **already gold**:
  `stroke="var(--thread-color)"` (arc-constellation.js:241,246) → `--thread-color`
  → `--thread` `#c2a463` (theme.css:350). Remaining non-gold on arc surfaces, all
  named: `.arcfield-whisper-text` / `-open` and `.arcfield-read-head .dot` →
  `--lum-cyan` (**Yumi's voice — legitimately cyan, keep**); `.st-page .st-maturity
  .glow` → `--teal` (**maturity is attention → gold**, law 10); `.st-page
  .st-pill-publish.done .st-pub-flag` → `--lum-cyan` (**lifecycle → gold**);
  `_arcReadSpine`'s gutter uses `--lum-gold-l` (already gold, and retiring anyway).
- **§7.5 soil-row data.** Source of truth is `arc.bookIds[] → state.books[id]`,
  the same source the rail reads (`buildArcFieldRail`, 12791). Seed arc: 5 books,
  **3 of 5 have `coverUrl`** — so the soil row **must** carry the shelf's cloth-spine
  fallback, not assume covers. Book title lengths 59/45/16/53/28 chars.
- **§7.6 horizon type fit.** Blocked on real data by design — the seed's `title` is
  **20 chars** and is a *name*, not a question (→ FORK 2), and its `description` is
  122. The mockup's 105-char "real seed question" is **synthetic**, as its own notes
  state. Real question lengths get measured on the S1 snapshot, before the horizon
  band is dialled. The mockup measured no truncation needed at 114 chars / 4 lines
  / 390; that stands as the working assumption, not as a verified fact about
  Preston's arcs.
- **§7.8 the stray square glyph — LOCATED.** `_stRenderBooks`
  (arc-constellation.js:1110, called at 1231) draws each `arc.bookIds` member as an
  **inert neutral square inside the arrangement canvas**. Measured live: **17
  `<rect>` nodes** in the seed field, visible in `before-field-1360.png` as dark
  navy squares scattered across the cream field — the only dark objects on it, one
  of them occluding the legend's "incorporated" label. **G1 kills it by ruling**
  ("books are ground, not growth: never inside the arrangement canvas"). The
  `Layers → Books` switch retires with it.
- **§7.10 gather census.** `renderSubTheoryBuild`'s right rail (11365-11660) is
  **already the corpus rail**: it walks *all* `state.books` with marginalia, plus a
  global **Unfiled** group, with `filterPull()` narrowing by `<select>` book +
  free-text search. `weaveNote()` = `canvas.insertAtCaret(' *title* ')` +
  `addEvidence(kind:'entry')` + a lit/unlit dot + "woven into ¶N". G4 replaces
  **only** the `<select>`; the rail machinery is untouched, as ruled.
- **§7.11 weave mechanics — the brief's premise does not exist.** `grep -rn
  proseAnchor js/*.js` → **2 hits, both comments**, and state.js:2494 says it
  plainly: *"proseAnchor / in-prose citation is deferred to Stage 10; evidence stays
  un-cited-in-prose."* There is **no anchor machinery** to land on. What ships is:
  `insertAtCaret` + `addEvidence` + `wovenParagraph()`, which re-finds the citation
  by **searching the body text for the book title** — the "anchor" is the italicised
  title string itself. `citationPins` (state.js:677, consumed views.js:10526) is a
  lowercased-phrase → chosen-source map, adjacent but not an anchor either.
  **Consequence for G5:** drag-across-the-edge can land on the shipped weave, but
  "at the drop point" is genuinely new — today's weave inserts at the *caret*.
  S3 maps drop (x,y) → caret via `document.caretRangeFromPoint`, then calls the
  existing path. Small and contained; **no anchor system is being built**, and none
  is needed. The accessibility twin ("Weave into prose" on the note surface) uses
  the caret path unchanged.

---

## §7 — FORKS AND RULINGS (halt here)

### FORK 1 — where the capture rig lives *(the carried close-ruling)*

`tools/` is hook-exempt as the prompt says — **and** `tools/` is published live
(`/tools/parse-check` → 200), which is exactly the premise on which Preston ruled
"the rig NEVER moves to `tools/rig`" on 2026-07-15. The capture rig is innocuous
(no `seed.js`), so the ruling's *rationale* is weaker here than it was there, but
the ruling is stated absolutely.

- **(a) `.claude/rigcap/` — RECOMMENDED.** Never served (dot-dir, proven 404), sits
  beside the measurement rig, honours the standing ruling verbatim. Cost: the
  pre-commit hook's check #3 blocks `.claude/**` HTML unless `sw.js` rides along —
  so it needs a **one-line hook exemption** (`grep -Ev '^\.claude/'`), which is the
  honest fix since `.claude/` is build-time-only and never linked from `index.html`,
  exactly like `docs/`, `tools/` and `design/`. That hook edit is a config change
  and is yours to approve.
- **(b) `tools/rig/`** — as the prompt rules. Zero hook work; publishes
  `frame.html` and `shoot.ps1` on the live site; contradicts the 2026-07-15 ruling.
- **(c) leave it untracked** in `.claude/rigcap/` for this round and rule at close.
  Costs nothing now, defers the decision a second time.

### FORK 2 — **the arc has no `question` field, and no answer field** *(structural)*

The mockup fixture carries `name` **and** `question` as separate strings
(`arc-standard-mockup.html:790-792`). The live arc record does not:

```
arc keys (read live): id · userId · title · description · bookIds · entryIds ·
                      createdAt · updatedAt · valueMarks · status · originEntryId
```

`arc.title` is **both** — views.js:13117 says *"arc.title IS the question (no
separate field)"* and renders it as `<h1 class="arcfield-q">`, while
`_arcInlineRename`'s placeholder reads *"Name this arc"*. The seed's title is
`A Pedagogy of Desire` — a **name**, not a question. There is likewise **no
`answeringLine` on arcs**; the only answers in the data are per-sub-theory
`answeringLine`s written by the shipped S2 threshold ceremony.

F4 (question on the sky, answer joins it) and F5 (name, edit-in-place, in the Gate
Row) therefore both point at the same single string, and F4's answer has no source.

- **(a) RECOMMENDED — one string, one seat; the answer comes from the ceremony.**
  The horizon carries `arc.title`; **edit-in-place happens on the horizon line
  itself**, which satisfies F5's "name, edit-in-place" without printing the same
  words twice, and lets the Gate Row keep exactly kicker + one act + one door + ⋯.
  The horizon's answer = the **most recently finished sub-theory's
  `answeringLine`** — which is precisely what brief §6 describes ("the ceremony's
  output … now lands on the horizon"), on real shipped data, **zero schema change**.
  The pre-question invitation renders when `arc.title` is blank — already a real
  live state, since rename allows clearing it.
- **(b) add `arc.question` + `arc.answeringLine`.** Cleanest composition, exactly
  the mockup. But it is a schema addition beyond the mark-identity fields the
  prompt's non-goals allow, it needs the Firestore merge twin (the standing
  "migrations must also touch the merge path" law), and carrying-question authoring
  is **R-CAPTURE's named seam** (brief §6) — so this build would be pre-empting it.
- **(c) title = name, `description` = question.** No schema change, but existing
  descriptions are blurbs, not questions (the seed's is a thesis), so the sky would
  print a non-question and call it one. Dishonest on real data.

### FORK 3 — the seats F5 does not name *(behaviour-preservation)*

Three live, wired controls have no seat in F5's "a name, one act, one door, one
overflow". Behaviour-preservation outranks structure-match, so they cannot simply
vanish:

| control | what it does | recommendation |
|---|---|---|
| **Connect** | arms pick-two → `linkSubTheories` — the only way to author a thread | **⋯ overflow**, as an arming mode. (Threads are law 10's subject; losing the authoring path would be a silent behaviour deletion.) |
| **Tidy / Restore** | session-only composed layout, never persisted | **⋯ overflow** |
| **Ask Yumi what she sees here** | `requestArcVoice` — Yumi is a hard non-goal | **⋯ overflow**, or a quiet seat at the field's foot |

Also unseated, minor: **"Notes in this arc"** (the rail's `arc.entryIds` list) — G1
gives the soil row *books* only. Recommendation: **fold into the soil row** as a
second quiet band, or retire by name. Your call, but it must be one of the two.

### FORK 4 — F8's three lives vs. the arc's actual two axes

F8 rules **Finish → / Publish → / Published**. The live arc has
`status: 'ember' | 'graduated'` (`graduateArc` / `ungraduateArc`, state.js:2039-2062)
**and** a separate `published` boolean. There is **no arc-level "finished"**, and
`openThresholdCeremony` — the S2 ceremony — is **per sub-theory**, not per arc.

- **(a) RECOMMENDED — map F8 onto the real axes, one seat, three lives, no dead
  buttons:** ember → **"Graduate →"** · graduated & unpublished → **"Publish →"**
  (`openPublishCeremony`, which already gates on ≥1 finished sub-theory and explains
  itself) · published → quiet **"Published"** carrying share access. Graduation *is*
  the arc's finish; "Graduate" is already the shipped, felt-passed word, and this
  keeps EMBER as a kicker word per F5.
  Rider, per notes ruling #7: while the arc has **zero marks** the door seat is
  **empty** — no act can honestly be taken.
- **(b)** relabel Graduate to "Finish →" for literal F8 fidelity. Renames a
  felt-passed lifecycle word for a mockup's benefit; not recommended.

### ORPHAN FORK — the 7 orphan sub-theories *(carried from the mockup round)*

Sub-theories whose `arcId` resolves to no arc. **Count not reproducible here:** the
seed workspace has **0 orphans** (measured live: 4 subs, 4 resolving). The figure of
7 is from Preston's real account and gets re-verified on the S1 snapshot before any
code depends on it.

- **(a) a quiet "unrooted" seat — RECOMMENDED.** Visible, honest, repairable:
  orphans surface in one quiet band with an *adopt into this arc* act from a court.
  It is the only option that makes a real, currently-invisible data condition both
  legible and fixable, and it matches the repair grammar (offered, never applied).
  Cost: one new state to compose and to keep sparse-honest when empty (which, for
  most users, is always).
- **(b) repair-only** — orphans appear solely in a Manage flow. Cheaper; keeps the
  field pure. But it hides a data problem behind a door most people never open.
- **(c) leave invisible, named debt.** Honest only if it is written down; the
  records stay unreachable and un-deletable from the UI.

### RULING A — G6's stale premise *(§3 above)*

Confirm the honest re-scope: **the canvas is already adopted; the fallback is not
triggered; G6's real work is the bounded/lifted dress + honest focus on
`.stb-canvas-host`, plus the kit-dialect sweep on the four remaining inputs.**
Law 12 is unchanged and fully met by this. No fallback will be invoked, and none
will be silently declared.

### RULING B — §7.11's stale premise *(§6 above)*

Confirm: **there is no `proseAnchor` machinery** (deferred at Stage 10, never
built). G5 lands on `insertAtCaret` + `addEvidence` + a new
`caretRangeFromPoint` drop-mapping. **No anchor system is built in this round.**

---

## §8 — Stage plan and pre-state byte bands

Pre-state, measured this session (bytes, working tree):

| file | bytes |
|---|---|
| `js/views.js` | 1,027,815 |
| `js/arc-constellation.js` | 82,923 |
| `assets/components.css` | 832,301 |
| `assets/theme.css` | 41,061 |
| `js/writing-canvas.js` | 27,272 |
| `js/room-field.js` | 15,203 |
| `sw.js` | 6,041 |

Bands are **two-figure** per the standing convention — a hard CODE ceiling plus a
soft COMMENT allowance that clears by line classification.

| stage | files | code band | comment allowance |
|---|---|---|---|
| **S1 — the field** | views.js · arc-constellation.js · components.css · theme.css · sw.js | +26,000 / −9,000 | +9,000 |
| **S2 — approach + clearing** | views.js · arc-constellation.js · components.css · sw.js | +11,000 / −1,500 | +4,500 |
| **S3 — canvas + gather + weave** | views.js · components.css · sw.js | +12,000 / −4,000 | +4,500 |
| **S4 — composer + fidelity** | views.js · arc-constellation.js · components.css · theme.css · sw.js | +15,000 / −6,000 | +6,000 |

`lumen-amber.css` and `marks.js` are **not** in any stage. No stage edits them.

**Adjustments recon forces on the stage plan as written:**

1. **S1 becomes display-only** (§4.2 derive-don't-write). "Migration executes here"
   is satisfied by a pure derivation function — no data write, no Firestore twin, no
   red-team data-loss surface at the round's riskiest gate.
2. **S3 shrinks** (§3): no substrate migration; dress + focus + the kit sweep.
3. **S3 gains** the `caretRangeFromPoint` drop-mapping (§6, §7 Ruling B) — small,
   but it is net-new capability and is named rather than absorbed.
4. **`_arcReadSpine` is preserved** (§2.3) even though the Read face dissolves —
   the visitor `#walk` lens shares it.
5. **S4 owns the uniqueness law at the mint only**; pre-existing collisions are
   offered a recomposition, never given one (§4.2).

Everything else in the stage plan stands as written.

---

## §9 — Evidence index

| item | evidence |
|---|---|
| mockup branch on origin | `git ls-remote --heads origin` → `1ee4bb5 refs/heads/mockup/arc-standard` |
| byte-locks intact | md5 `070679b0…` / `772886c0…` — match FIX-PROTOCOL §2 |
| `tools/` hook-exempt | `hooks/pre-commit:33` |
| `tools/` published live | `.claude/rig/README.md:24` probe table (`/tools/parse-check` 200) |
| no `netlify.toml` | `cat netlify.toml` → No such file |
| canvas already adopted | views.js:11213 |
| canvas de-dressed | components.css:12170-12171 |
| no `proseAnchor` | `grep -rn proseAnchor js/*.js` → 2 comment hits; state.js:2494 |
| identity fields | arc-constellation.js:477-494, 839-843; theme.css:397-412 |
| dead silhouette/treatment axis | arc-constellation.js:429-432 + the 818-823 comment |
| book squares in the canvas | arc-constellation.js:1110/1231; 17 `<rect>` measured live |
| zoom feasibility | live probe, this session: 553 nodes @ 24 marks, 3.5 ms, positions IDENTICAL |
| arc has no question/answer field | live key read; views.js:13117 |
| arc lifecycle axes | state.js:2039-2062; views.js:12896-12997 |
| field is a panel on a ground | live computed: `.arcfield` `rgb(233,220,188)` vs `#arc-field` `rgb(253,249,238)` |
| before-baseline captures | `.claude/rigcap/shots/before-field-{1360,390}.png`, 2026-07-22, gitignored |

**Nothing was written to any tracked file. Nothing is staged. No commit.**
