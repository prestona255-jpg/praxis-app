# R-ARC ROOM-3 — WORKSHOP COMPOSITION — RECON

Stage-0, READ-ONLY. Praxis recon agent (Sonnet, gate-agent frontmatter per
MODEL LAW v2). HEAD `470d7cf` ("docs(r-arc): ROOM-3 succession handoff") ==
`origin/main` (verified `git rev-parse HEAD origin/main` both return
`470d7cf88d0049da06ed80610b5619fd0e1cad99`). Live `sw.js` CACHE_VERSION =
`'praxis-v3.226'` (sw.js:10), matches the handoff doc's claimed live version
exactly — no drift.

Tracked tree: **CLEAN** (`git status --porcelain -uno` = zero output; also
verified clean on the 5 files this slice will touch). Untracked design/docs
scratch files present (design/, docs checkpoints, Instructions and Process
Information/) — pre-existing working-copy clutter, not this recon's concern,
not touched.

Foundation byte-locks — **BOTH EXACT, NO DEVIATION**:

| File | Expected MD5 | Measured MD5 | Expected bytes | Measured bytes |
|---|---|---|---|---|
| assets/lumen-amber.css | `9879ddb8…` | `9879ddb83a7e68e8378c621e473b0a57` | 14,681 | 14,681 |
| assets/marks.js | `772886c0…` | `772886c049d0d6d03d341507e602d88a` | 10,255 | 10,255 |

---

## §7 CHECKLIST — 10 ITEMS

### 1. Surface census (with MOUNT-SITE RAIL)

`renderSubTheoryBuild(id)` — **js/views.js:11163-11971** (confirmed exact
span; next fn `renderArtifact` starts :11973). **Single call site in the
entire repo**: `js/views.js:571`, inside `renderRoute`'s
`parts[0]==='subtheory' && parts[1] && parts[2]==='build'` branch
(views.js:561, route `#subtheory/<id>/build`). No seed/public render path
exists — confirmed by contrast with the sibling read Page
(`renderSubTheoryPage`, views.js:10800-10815), which has an explicit
seed-exemption (`stpIsSeed`, userId `'__praxis_seed__'`) letting the "A
Pedagogy of Desire" worked example open signed-out; the comment at
views.js:10809-10811 states plainly **"the BUILD surface
(renderSubTheoryBuild) stays hard-gated"** — no such exemption exists in
11163-11971. Signed-out branch: views.js:11172-11179, unconditional
`if (!stbUser || !stbUser.uid)` → `buildSignedOutPrompt` inside a
`.st-build.lum-amber-deep.stb-warm-dim` shell, return. Not-found guard:
views.js:11181-11191.

| Surface | Anchor (file:line) |
|---|---|
| Return chip (`.stb-return-chip`, one-shot, arrived-from-create) | views.js:11201-11207 |
| Intro eyebrow + h1 (`.stb-intro/.stb-eyebrow/.stb-h1`) | views.js:11209-11222 |
| Name court — hero-mark | views.js:11233-11247 |
| Name court — title input | views.js:11251-11257 |
| Name court — into-line | views.js:11258-11270 |
| Name court — basin-note (invite + origin phrase) | views.js:11276-11294 |
| Acts — saved dot | views.js:11299-11302 |
| Acts — Finish/pub pill | views.js:11303-11329 |
| Acts — Focus toggle | views.js:11333-11345 |
| Acts — Open the page door | views.js:11346-11350 |
| Sheet — canvas host (writing canvas mount) | views.js:11358-11384 |
| Sheet — Connections card | views.js:11431-11469 |
| Foot — Dissolve/Delete (object-nature branch) | views.js:11483-11515 |
| Rail — field pane (conditional on `gEv.length`) | views.js:11896-11962 |
| Rail — Gathered panel (`.stb-gathered`, unconditional) | views.js:11820-11892, 11964 |
| Rail — pull-source (books + Unfiled group + filter) | views.js:11519-11813 |

### 2. Gathered-panel dissolution safety — inventory + PROOF

`.stb-gathered` unique data/behavior, all cited:

| Datum | Anchor | RD-5 coverage |
|---|---|---|
| Count sub-line ("N passages — what this piece stands on" / "nothing gathered yet") | views.js:11830-11834 | Covered — moves verbatim into the field header per RD-5 |
| Empty-state copy ("Weave notes in from your reading below — they gather here.") | views.js:11836-11841 | **Structural conflict, not just a copy move** — see below |
| Per-card kind/provenance line (kind-derivation triplicated with the field-card loop) | views.js:11855-11879 vs 11916-11934 (near-identical logic, two copies) | Unify into ONE derivation (field-card loop survives as sole source) |
| "Open the book →" door, kind `'entry'` w/ filed book | views.js:11861-11864, 11883-11887 (doorId=gBid) | **NOT covered by RD-5's stated mechanism** (see fork below) |
| "Open the book →" door, kind `'book'` direct | views.js:11869-11873, 11883-11887 (doorId=ev.refId) | **NOT covered** — no note exists for kind `'book'`; see fork |
| kind `'external'` — never had a door (confirmed, no doorId branch for `else if (ev.kind==='external')`, views.js:11874-11878) | — | No gap (parity already zero) |

**FORK 1 (named, returns to Preston per §7 instruction) — the field pane is
currently GATED on evidence existing.** `if (gEv.length && typeof
createRoomField === 'function')` (views.js:11896) means **the field pane
does not render at all when there is no evidence** — today, the ONLY place
the empty-state copy renders is inside `.stb-gathered` (views.js:11836-11841).
RD-3's canon (§3 sentence 6, "An empty field is quiet ground with one line
of ink") requires the field to **always render**, even at zero cards. Since
RD-5 dissolves `.stb-gathered` (the only surface that currently owns this
copy), the length-gate at 11896 must be removed and the empty-state line
must move INTO the field pane itself (room-field.js or its views.js caller)
— this is a load-bearing behavior change, not incidental to the "dissolve".

**FORK 2 (named) — "Open the book" door coverage gap for kind `'book'`
evidence.** RD-5 states: *"Tap/click the card body opens the ROOM-2 note
surface (…'Open the book' lives there via provenance)."* `renderNoteSurface`
(views.js:14834) is **entry-kind only** — it requires
`state.notebookEntries[entryId]` (views.js:14843) and 404s otherwise
(views.js:14846-14858). Sub-theory evidence of `kind:'book'` has **no
underlying notebookEntry and no `#note/<id>` to route to** — its Gathered-
panel door went straight to `#book/<refId>` (views.js:11871-11873,
11883-11887), bypassing any note surface entirely. RD-5's stated mechanism
("click → the note surface") **structurally cannot apply to kind:'book'
cards** — they need their OWN direct door (`#book/<refId>`), not a detour
through a note that doesn't exist for them. This is a real gap the builder
must resolve (likely: card door target is kind-dependent — `entry`→`#note/
<refId>`, `book`→`#book/<refId>` directly, `external`→no door, unchanged) —
**not automatically covered by the brief's one-sentence mechanism.**

### 3. Field mechanics census (js/room-field.js, 171 lines / 7,435 B)

| Mechanic | Value | Anchor |
|---|---|---|
| Logical canvas | `FIELD_W=1200`, `FIELD_H=900` (fixed constants) | room-field.js:19-20 |
| Scroll container | `.rf-pane{height:340px; overflow:auto}` — **both axes**, native OS scrollbars (the keyhole, RM6) | components.css:11841 |
| Canvas element | `.rf-canvas{width:1200px; height:900px}` — fixed, mirrors the JS constants exactly | components.css:11842 |
| Drag clamp | `nl∈[0, FIELD_W-240]`, `nt∈[0, FIELD_H-120]` (960×780 px range) | room-field.js:104-105 |
| Drag-end normalize | `nx=left/960, ny=top/780`, `clamp01` both | room-field.js:115-117 |
| place() (layout→pixel) | `left=round(clamp01(x)*960)`, `top=round(clamp01(y)*780)` | room-field.js:47-50 |
| Spawn default | `defaultPos(i) = {x: 0.06+(i%3)*0.32, y: 0.05+floor(i/3)*0.24}` — **pure index math, ignores `layout` entirely; no collision awareness against existing/user-placed cards** | room-field.js:43-45 |
| Card width | fixed `240px` | components.css:11843 |
| Card body clip | `.rf-body{max-height:3.9em; overflow:hidden}` — **geometric crop, zero ellipsis/line-clamp** (mirrors the R-ARC S3B FF-9a placeholder-clip defect class from prior memory) — lifted state removes the clip (`max-height:none`) | components.css:11845, 11847 |

**RD-2/RD-3 replace-vs-extend map:**
- **REPLACE:** `.rf-pane{overflow:auto}` two-axis scroll (RD-2 kills all inner
  scroll — the pane-as-window-onto-canvas model is retired outright, not
  restyled).
- **REPLACE:** `FIELD_H=900` fixed constant → must become a computed value
  (lowest card + one card-height + minimum floor, growing, no ratchet).
- **REPLACE:** `defaultPos()` → collision-avoiding row-major scan (RD-3);
  the module already receives full `layout` so this is buildable without a
  new data channel, but it is a materially different algorithm, not a tweak.
- **EXTEND:** drag clamp math stays the same SHAPE (bound x to column
  width, bound y to ≥0) but the upper y-bound becomes dynamic instead of the
  fixed `FIELD_H-120`.
- **NEW:** RD-2a boundary-growth-under-drag (detect near-bottom during
  `move()`, grow the canvas height live) has no current analogue at all.
- **NEW:** clip-law compliance (typographic ellipsis/line-clamp, never
  geometric crop) — `.rf-body`'s current `overflow:hidden` with no ellipsis
  must be fixed regardless of the rest of ROOM-3 (RD-3 sentence 4/6 binds it).

**NAMED CONSIDERATION — the coordinate-migration question (item 3, explicit
per task instruction).** `setEvidenceLayout` (state.js:2445-2458) clamps
**both** `x` and `y` independently to `[0,1]` (state.js:2451-2452) with no
knowledge of canvas dimensions — it is a pure normalized-fraction store. The
GO's assumption ("clamp constrains existing writes… flag if recon finds
otherwise") is **satisfiable without touching state.js** ONLY if the
builder keeps `y` as a fraction of *some* height reference computed
consistently at both read (`place()`) and write (drag-end normalize) time —
i.e. `ny = pixelY / currentCanvasHeight` where `currentCanvasHeight` is
JS-derived from content each render, not the fixed `900`. Under that scheme
`state.js` stays byte-identical (as expected/declared in §7 item 7). The
**named risk**, not resolved by the brief: if the canvas's computed height
changes between saves (e.g. a card removed shrinks the lowest-card
extent), previously-saved normalized `y` values silently re-map to
different absolute pixel positions on the next render, because their
divisor changed — a card near the bottom could visually drift upward
without the user moving it. RD-3's absolute law ("your arrangement never
moves unless your hand moves it") is at stake here specifically for the
**height-shrinks** case; the brief does not name this, and it is worth one
line of confirmation before build (a monotonic-height policy — height only
ever grows to the max ever seen this session, never shrinks — would close
it cheaply, but that is a design call, not a mechanical default).

### 4. Openings reconciliation — ROOM-2's three built openings vs RD-5's card door

| # | Opening | Anchor | Mechanism today |
|---|---|---|---|
| 1 | Notebook card body | views.js:15219-15223 | click → selection-empty guard → `location.hash='#note/'+entry.id` |
| 2 | Field lifted-card door | views.js:11946-11959 (onTap override) | **TWO-STEP today**: tap #1 toggles `.rf-lifted` (own-state, no navigation); a SEPARATE `.rf-door` link appears inside the lift (views.js:11953-11957, `href='#note/'+fEv.refId`, kind `'entry'` only) — a second click navigates |
| 3 | spotlight / #search | spotlight.js:168-178 (`route:'#note/'+en.id`); views.js:913-921 (`#search` items builder, `route:'#note/'+en.id`) | direct deep-link, one click |
| route branch | `renderRoute` `#note/<id>` | views.js:586-593 | clears `currentBookId/ArcId/SubTheoryId` (H2 fix), calls `renderNoteSurface(parts[1])` |

**Reconciliation:** RD-5's card grammar law ("click/tap = door · drag =
arrange") **collapses opening #2 from two clicks to one** — the field
card's click must go DIRECTLY to `#note/<refId>` for `kind:'entry'` cards,
retiring the current lift-then-see-door two-step for that kind. This is a
confirmed, explicit behavior change (not merely a copy/CSS pass) to
`room-field.js`'s `onTap` contract and/or `views.js`'s `onTap` callback
(views.js:11946-11959). **No fourth path exists or is proposed** — openings
#1 and #3 are untouched by ROOM-3 (out of this slice's file list). Openings
reconcile to ONE mechanism for entry-kind cards; kind:`'book'`/`'external'`
cards need their own resolution per FORK 2 above, since they have no
`#note/<id>` target at all.

### 5. Tripwire audit T11 (+ T1/T4/T10 relevance)

**T11 — exhaustive, repo-wide `evidenceLayout` grep, `js/` scope:**

```
js\state.js:684   (comment)
js\state.js:686   ensure-init guard
js\state.js:687   ensure-init guard
js\state.js:2450  setEvidenceLayout guard
js\state.js:2453  setEvidenceLayout write
js\views.js:11895 (comment)
js\views.js:11940 layout: subTheory.evidenceLayout || {}
```
**Zero hits in `js/yumi-brain.js`** — separately grepped, `No matches
found` (empty result set; the pattern search returned nothing at all,
proving absence rather than a narrow/miscounted grep). T11 = 0, re-proven.
All reads of `evidenceLayout` are confined to `state.js`'s own
ensure/setter and `views.js`'s single pass-to-`room-field.js` read
(11940) — spawn/collision reads, per RD-3, would also live here (layout
code only), never near `assembleContextData` or any Yumi-context builder.

**T1 (no third sub-theory status):** schema chokepoint confirmed —
`state.js:690`: `if (st.status !== 'draft' && st.status !== 'published') {
st.status = 'draft'; }` — binary by construction. All 4 read/write sites in
the workshop (views.js:11305, 11313, 11323-11324, 11265) only ever compare
against `'draft'`/`'published'`. Clean.

**T4 ('seed'):** exhaustive grep confined to `renderSubTheoryBuild`'s exact
line range (11163-11971 via `awk 'NR==11163,NR==11971' | grep 'seed'`) =
**zero matches** (grep exit 1). `room-field.js` also zero matches. Clean.

**T10 (innerHTML / user text):** same confined-range grep found 5 hits, all
pre-existing and none carrying user-authored text: `host.innerHTML=''`
(11169, mount-clear idiom) · `heroMark.innerHTML=_stMarkOrMote(...)` (11236,
system glyph) · `cg.innerHTML=bookSubMarkHTML(...)` (11448, system glyph) ·
`chev.innerHTML='&#9656;'` ×2 (11598, 11705, static entity). `room-field.js`
has **zero** innerHTML anywhere (separately grepped, empty result) — all
card text is `textContent` (room-field.js:59, 63). Baseline is clean; the
build must keep new card/door text on `textContent`/`createTextNode`.

### 6. RM7 stale layout entries — re-verified, still CLOSED

Re-ran the exact grep ROOM-2 used: `removeEvidence` = 0 hits repo-wide;
`evidence.splice` = 0 hits; the only `.evidence = []` hits are the two init
defaults (state.js:660, state.js:2412) — unchanged from ROOM-2's finding.
**Disposition unchanged: CLOSED as unreachable-today** (no evidence-removal
path exists at all, so no `evidenceLayout` entry can go stale). Not
re-ledgered; nothing for ROOM-3 to build here.

### 7. Density pricing — THE BUILD'S BANDS

Per the standing ratified laws: DOM/interaction default **~38 B/line**
(Addendum v2, no tighter class proven here — see arithmetic note below),
CSS **~125 B/line** (ratified CSS Pricing Addendum), **+20% line-count
contingency**, line counts from **branch structure**. "CODE measured" in
every prior ROOM/Slice checkpoint prices **inserted/changed lines only**
(the diff `+` side) — pure deletions (e.g. most of the Gathered-panel
removal) reduce file size but are not priced into the hard ceiling.

**js/room-field.js note:** the file's OWN shipped density (5,970 B logic /
~140 code lines ≈ 42.6 B/line) is close to but not clearly tighter than the
38 B/line default, and this round is a **rewrite touching most of the
file's mechanics** (height model, spawn algorithm, clamp math), not a
narrow addition — so the conservative 38 B/line default is used, per the
addendum's own instruction ("unless a tighter class is PROVEN").

| File | Branch-derived lines (see itemized list below) | +20% | CODE (hard) | COMMENT (soft) |
|---|---|---|---|---|
| js/room-field.js (rewrite) | 121 | 145 | **+4,600–5,800 B** | ≤1,600 B |
| js/views.js (RD-4+RD-5+field header+door reconciliation) | 99 | 119 | **+3,800–4,700 B** | ≤950 B |
| assets/components.css | 28 | 34 | **+3,200–4,300 B** | ≤300 B |
| sw.js | version swap only | — | ±0 (v3.226→v3.227) | — |

Arithmetic, room-field.js (121 lines): height/growth model + RD-2a live-grow
(30) + collision-avoiding spawn rewrite (30) + clamp/place/move/end dynamic-
height updates (15) + pane/scroll-role restructure (10) + empty-state render
(10) + P1 reduced-motion guard (8) + P2 keyboard/tabindex/Enter-Space (12) +
tap→door callback contract change (6) = 121. ×1.2 = 145. ×38 ≈ 5,510,
banded 4,600–5,800.

Arithmetic, views.js (99 lines): kicker/breadcrumb merge reusing existing
`_stIsBasin`/`pubDone()` booleans (12) + court restructure/saved+focus
regrouping (15) + metadata-line generalization (12, uncertain — see FORK 3
below) + RD-4a door-mirror reposition (8) + field-header merge text (6) +
field-always-renders restructure incl. empty-case wiring (14) + onTap→door
kind-reconciliation rewrite (22) + D4 reserved-seat markup (4) + Connections
quiet-class hookup (2) + Gathered-count-retention during removal (4) = 99.
×1.2 = 119. ×38 ≈ 4,522, banded 3,800–4,700.

Arithmetic, components.css (28 lines): field mechanics — scroll-role
removal, dynamic canvas height, empty-state line style, clip-law line-clamp
fix, RD-2a growth transition, P1 reduced-motion media query (10) + kicker/
court/door-mirror layout rules (8) + focus-mode coherence touch-up if any
(2) + D4 reserved-seat placeholder style (2) + mobile/desktop tier mirrors
of the above (6) = 28. ×1.2 = 34. ×125 = 4,250, banded 3,200–4,300.
(Dead-CSS cleanup of `.stb-gathered/.stb-gath-list/.stb-gath-door` if the
builder removes them is a deletion, not priced into this band.)

**FORK 3 (named, feeds the views.js estimate's largest uncertainty) — RD-4's
"Yumi's invitation… never clamped mid-thought" identity is ambiguous.** The
brief's exact words ("the origin phrase as one --ink-3 line; Yumi's
invitation in gold italic…") map textually to the code's EXISTING
`.stb-origin-phrase` (ink-3, views.js:11285-11292/components.css:11760) and
`.stb-name-invite` (gold italic, views.js:11279-11284/components.css:11759)
— but those two elements **only render when `_stIsBasin(subTheory)` is
true** (views.js:11276). A named/published sub-theory shows NEITHER line
today. If RD-4's "≤2 quiet lines" is meant to apply at **every** lifecycle
state (not just basin), the copy for "Yumi's invitation" cannot literally
be the basin-only naming prompt ("what would you call it?") once a
sub-theory is named — a new, state-varying one-line micro-copy would be
needed. This changes the views.js line estimate materially (a new small
copy-selection branch, ~8-12 extra lines) and is a genuine content/design
call, not mechanical — flagged for chat before or at build, not resolved
here.

**State.js:** per the coordinate-migration analysis (item 3), **confirmed
NO change expected**, contingent on the builder choosing a
dynamic-height-relative normalization scheme (keeping the 0..1 semantics
intact) rather than an asymmetric/unbounded-y clamp. If the builder instead
needs an asymmetric clamp, this assumption breaks and state.js re-enters
scope — named, not assumed.

### 8. Connections card — carry-forward, no internals touched

`.stb-conn` render: views.js:11431-11469 (head 11434-11437, links loop
11438-11456, empty state 11457-11462, add-connection button 11463-11468,
mounted into `sheet` at 11469) — **exact match to the task's stated
anchor, zero drift.** CSS: components.css:11787-11794 (base) +
components.css:11884 (mobile 44px target) + components.css:11951
(desktop ≥1200 focus-visible ring). §5's "visually quieted to match the
court" is achievable as a pure CSS/class change (e.g. one added modifier
class, priced at ~1-2 lines in the views.js estimate above); nothing in
the render function's logic (link derivation, empty state, add-connection
navigation) needs to move.

### 9. Focus-mode census (P3)

Current mechanism, `.is-focus` modifier on `wrap` (toggled views.js:11338-
11344):

| Rule | Anchor | Effect |
|---|---|---|
| `.is-focus .stb-rail{display:none}` | components.css:11661 | hides BOTH pull-source and field-pane (children of `.stb-rail`) wholesale |
| `.is-focus .stb-conn{display:none}` | components.css:11662 | hides Connections |
| `.is-focus .stb-build{justify-content:center}` | components.css:11663 | recenters the flex row |
| `.is-focus .stb-main{max-width:680px}` | components.css:11664 | narrows the prose column |

**Coherence verdict: stays coherent by construction, not ambiguous.** The
mechanism is coarse — it hides two whole containers (`.stb-rail`,
`.stb-conn`) and constrains one (`.stb-main`). RD-4's DE-CARDED sheet and
recomposed court both live inside `.stb-main` (untouched by the hide
rules); RD-5's field-pane + pull-source both live inside `.stb-rail`
(hidden together, exactly as today — dissolving Gathered doesn't change
what's inside the hidden container, only what's inside it). **One
placement constraint for the builder, not a fork to Preston:** RD-4a's
door-mirror pill must be placed as a descendant of `.stb-main` (or a
sibling of `.stb-build` inside `.st-build` proper) and never inside
`.stb-rail`/`.stb-conn`, or Focus mode would silently swallow a
destination-named door — a coherence-breaking regression Focus's existing
rules would cause by accident, not one the brief asks for.

### 10. D4 capture-door census

`captureNote` (defined views.js:3237) has exactly two non-definition call
sites in `js/views.js`: **3082** and **3102**, both inside the Notebook
writeline flow (per the adjacent comment at views.js:2855, "commits via
captureNote. Mounted at the top of the left leaf" — i.e. `#notebook`, not
the workshop). The third call site, `js/intros.js:337`, is the onboarding
scripted demo. **Grep confined to `renderSubTheoryBuild`'s own line range
(11163-11971) finds zero `captureNote` occurrences** (cross-checked against
the whole-file hit list above — neither 3082 nor 3102 falls in range).
**D4/in-Room capture has NOT shipped anywhere in the workshop** — confirmed
absent, not merely unwired.

Reserved-seat default per the brief: the field's header region, beside
"arrange freely" (views.js:11899-11909, `fHead`/`fSub`/`fTitle`). Under
RD-5's merged field header ("The field · N passages — what this piece
stands on · arrange freely"), the capture-door seat is a sibling element in
that same header block — **reserve-only this round** (a placed, inert
element/space, ~4 lines per the density estimate above), never wired to
`captureNote` in ROOM-3 (D4's own build and R-CAPTURE inherit the seat per
§6 of the brief).

---

## (a) ANCHOR TABLE — surface → function → file:line

| Surface | Function | Anchor |
|---|---|---|
| Workshop root | `renderSubTheoryBuild` | js/views.js:11163-11971 |
| Route | `renderRoute` `#subtheory/<id>/build` | js/views.js:561-572 |
| Signed-out gate | inline in `renderSubTheoryBuild` | js/views.js:11172-11179 |
| Not-found gate | inline | js/views.js:11181-11191 |
| Field module | `createRoomField` | js/room-field.js:27-167 (whole file 171 lines / 7,435 B) |
| Field layout setter | `setEvidenceLayout` | js/state.js:2445-2458 |
| Field layout ensure | `ensureSubTheoryFields`-adjacent init | js/state.js:684-689 |
| Gathered panel (dissolving) | inline | js/views.js:11820-11892, 11964 |
| Pull-source rail | inline | js/views.js:11519-11813 |
| Connections card | inline | js/views.js:11431-11469 |
| Delete/Dissolve foot | inline | js/views.js:11483-11515 |
| Note surface (ROOM-2 target) | `renderNoteSurface` | js/views.js:14834-15013+ |
| Notebook card body opening | `renderNotebookEntry` | js/views.js:15153, click 15219-15223 |
| #search opening | items builder | js/views.js:913-921 |
| spotlight opening | inline | js/spotlight.js:161-181 (route 177) |
| Focus-mode toggle | inline | js/views.js:11333-11345 |
| Focus-mode CSS | — | assets/components.css:11661-11664 |
| Workshop CSS block | — | assets/components.css:11729-11923 (WAVE 3 + MW-3 mobile) + 11925-11956 (DW-3 ≥1200) |
| Field CSS | — | assets/components.css:11839-11848 |
| Gathered CSS (dissolving) | — | assets/components.css:11853-11857 |

## (b) DENSITY / BANDS TABLE

| File | CODE (hard ceiling) | COMMENT (soft allowance) |
|---|---|---|
| js/room-field.js | **+4,600–5,800 B** | ≤1,600 B |
| js/views.js | **+3,800–4,700 B** | ≤950 B |
| assets/components.css | **+3,200–4,300 B** | ≤300 B |
| js/state.js | **±0 expected** (contingent — see coordinate-migration note) | — |
| sw.js | ±0 (v3.226→v3.227 version-swap only) | — |

## (c) FORKS / AMBIGUITIES — return to Preston before/at build

1. **Field pane's existing-evidence gate (views.js:11896) must be removed**
   for RD-3's empty state to have anywhere to render — the "dissolve" is not
   copy-only, it changes when the field mounts at all. (item 2)
2. **"Open the book" door for `kind:'book'` evidence has no note surface to
   route through** — RD-5's stated mechanism ("click → the note surface")
   only covers `kind:'entry'`; `book`/`external` kinds need their own
   resolution, undocumented in the brief. (item 2, item 4)
3. **RD-4's "Yumi's invitation" line identity is ambiguous** — textually
   matches the existing BASIN-ONLY `.stb-name-invite`/`.stb-origin-phrase`
   pair, but RD-4 implies a persistent ≤2-line sandwich at every lifecycle
   state; the existing pair only renders for unnamed basins. Needs one line
   of confirmation: reuse basin-only copy (named/published subs show only
   the "into" line, not 2), or design new state-varying micro-copy. (item 7)
4. **Coordinate-migration risk under RD-2's growing height** — keeping
   `state.js` untouched requires a dynamic-height-relative normalization
   scheme; if the canvas height ever shrinks between sessions, previously
   saved card `y` positions will silently re-map, in tension with RD-3's
   "your arrangement never moves unless your hand moves it." Not fatal, not
   named in the brief — a monotonic-height policy is the cheap fix but is a
   design call. (item 3, item 7)
5. **RM6's reserved felt-pass call — rail/field width.** Preston reserved
   "wider field emphasis" as a felt-pass call, not a mechanical one; the
   rail is fixed 288px at <1200px width (components.css:11740) and
   `flex:1 1 0`/auto-width only at ≥1200px (components.css:11943) — ROOM-3's
   RD-2/RD-3 rewrite does not itself resolve RM6, it only removes the inner
   scrollbar; the width question stays live for the felt checkpoint.
6. Focus-mode: **not a fork** — verified coherent by construction (item 9),
   with one placement constraint communicated to the builder (RD-4a's door
   pill must sit outside `.stb-rail`/`.stb-conn`).

## (d) CLAIMING-ABSENCE PROOFS

- **T11 = 0 in yumi-brain.js:** `Grep pattern:'evidenceLayout'
  path:js/yumi-brain.js` → "No matches found" (full-file search, not a
  narrow substring).
- **RM7 (removeEvidence/evidence.splice) = 0 repo-wide:** `Grep
  pattern:'removeEvidence|evidence\.splice|evidence\s*=\s*\[\]'
  path:js/` → only the two init-default hits (state.js:660, state.js:2412);
  zero removal-path hits.
- **T4 ('seed') = 0 inside `renderSubTheoryBuild`:** `awk
  'NR==11163,NR==11971' js/views.js | grep 'seed'` → exit 1 (no match);
  `Grep pattern:"'seed'" path:js/room-field.js` → "No matches found".
- **D4 (`captureNote`) = 0 inside `renderSubTheoryBuild`:** whole-file
  `captureNote` hit list (views.js:3082, 3102, 3237-def; js/import-capture.js
  and js/intros.js references are comments/demo-only) cross-checked against
  the 11163-11971 range — none fall inside it.
- **innerHTML in room-field.js = 0:** `Grep pattern:'innerHTML'
  path:js/room-field.js` → "No matches found".
- **Foundations unchanged:** MD5 + byte count both re-measured this session
  (not carried from memory), both exact matches — see header table.

---

**STOP. No build performed. No files edited. Recon only.**
