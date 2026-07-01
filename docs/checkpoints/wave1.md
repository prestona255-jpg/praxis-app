# Wave 1 — Living Field (S1) + Shelf (S5) → Amber/Lumen conversion

Protocol: PROTOCOL.md v1.1 (three-box). Rulings locked by Preston (see below).
Targets: `design/Wave 1 Anchors.zip` → `praxis-field-amber.html`, `praxis-shelf-amber.html`.
Baseline HEAD `b35915f`, live `CACHE_VERSION praxis-v3.161` → ship bump **v3.162** (final push only).

Files in scope: `js/views.js`, `assets/components.css`, `sw.js` (one bump at ship).
Off-limits (HALT / non-goals): `assets/lumen-amber.css` (14,681), `assets/marks.js` (10,255),
`js/arc-constellation.js` renderer/drift (§4-H), data model, ES3-only, explicit-file staging.

---

## DEFERRED FEATURE LOG — generative-Yumi layer (NOT built this wave)

Per SPINE ruling (Wave-7 Surface-B rule): no model-calling Yumi behavior is built in a
conversion wave. Each item below is a real Yumi feature that needs its own dedicated build
**plus an EXTERNAL Yumi eval** (behavioral / relationship / pedagogical — never self-graded),
awaiting Preston's greenlight. Nothing here is stubbed with fabricated content; where a face or
line would have shown generated prose, this wave shows deterministic real-data or omits.

1. **Field — READ-face narration (F-D2).** Yumi's flowing narration of the arc's connective
   tissue ("a roam, not a summary"). This wave builds the Read shell + a DETERMINISTIC real-data
   view (the field's actual threads + the sub-theories they connect). Generative prose → DEFERRED.
2. **Field — concentrate-whisper prose (F-D3).** Per-mark Yumi whisper on focus. This wave builds
   the interaction (focal scale, thread highlight, whisper card) populated with DETERMINISTIC
   relational data (real thread count / what the focused mark connects to). Generated prose → DEFERRED.
3. **Field — latent-thread suggestion (F-D6).** "Yumi offers a connection." DEFERRED ENTIRELY —
   no latent thread built this wave; suggested connections are generative by nature.
4. **Shelf — reading-lean line (S-D1).** "Lately your reading leans toward the erotic…" This wave
   builds a DETERMINISTIC, count-based line from real taxonomy ("Most-shelved lens: <lens> · N
   books"), cyan per mockup. Interpretive "leans toward" + model call → DEFERRED.

Covenant note: all four brush never-summarizes / no-asymmetric-knowledge; the header excluded the
Yumi panel. They are logged, not smuggled.

---

## BOX 1 — RECON → HALT (COMPLETE)

Full recon + mockup-derived fidelity manifest delivered and approved. Key facts:
- Router: `#books` → `renderShelf()` (views.js:549→557); `#arc/<id>` → `renderArcDetail()` (538→546).
- `renderShelf()` @2846; `renderArcDetail()` @10817. Parse: `cscript //nologo .claude/parse-check-views.js`
  (baseline PASS 700161 chars; views.js has 0 `.catch(`/`.finally(`).
- `--lum-*` fully adopted (334 refs in components.css); conversion pattern = add `lum-amber-deep`
  root class + a scoped `.<surface>.lum-amber-deep` override block (notebook template @11295-11444).
- lumen-amber.css:16 assigns the Shelf to `.lum-amber-deep` (reading room).
- Real reusable helpers: `rootedSubTheories(id)` @6450, `marginaliaForBook(id)` @6489,
  `bookAmberCover(book,alight)` @6367 (`.bk-cover-alight`/`.bk-cover-rmark`), `bookYumiLine` @6433.

---

## RULINGS (locked) — Shelf

- S-D1 yumiline → DETERMINISTIC count line (defer generative). S-D2 rooted/alight → APPROVED,
  computed display-only, predicate = ≥1 marginalia OR ≥1 sub-theory derived; bind to REAL fields.
  S-D3 keep real covers + Amber frame + alight. S-D4 add "All" + all four status rows always.
  S-D5 keep Author rail + Ask-Yumi (reskin only). S-D6 keep all 5 chips. S-D7 no `.peek` (real nav).
  S-D8 per-lens glow → OMIT (lenses carry no real per-lens color; `bookLensTags` uses a uniform gold dot).

---

## BOX 2 — SHELF build

### FIRM byte estimate (locked from rulings — landing far off = scope crept → stop)
- `assets/components.css`: **+9,000 … +13,000 B** (new `.shelf.lum-amber-deep` conversion block +
  `@media (max-width:759px)` drawer/44px reflow; mirrors the ~11k notebook block, shelf simpler).
- `js/views.js`: **+1,800 … +3,500 B** (root class; deterministic yumiline; status All + always-4;
  computed alight set + rmark; legend). `sw.js`: 0 (bump only at final ship).

### Slices (self-verify parse + bytes + greps after each; append results below)
- S-1 views.js: (a) `wrap.className='shelf lum-amber-deep'`; (b) deterministic Yumi lean line;
  (c) status "All" + drop zero-count skip; (d) computed alight set → renderShelfBook/Row + rmark;
  (e) `.shelf-rootednote` legend.
- S-2 components.css: `.shelf.lum-amber-deep` conversion block + 759 reflow.

### S-1 views.js — RESULT (BYTE GATE TRIPPED → reported, awaiting call)

- Parse: `cscript //nologo .claude/parse-check-views.js` → **PARSE: PASS (706767 chars)**.
- Byte delta: 700,161 → 706,767 = **+6,606 B**. FIRM band was +1,800…+3,500 → **OVER by ~+3,100 (≈2×)**.
- `git diff --numstat`: **138 added / 8 removed**; every hunk inside
  renderShelf/renderShelfBook/renderShelfBookRow (2860–4146) — no stray hunks.
- Added-line classification: 132 non-header → **97 code / 29 comment / 6 blank**.
- Classification verdict: **NOT scope creep.** All 97 code lines map to ruled slices —
  S-D1 lean line (~17), S-D4 All row + show-all (~19), S-D2 alight IIFE (~38) + rmark×2 (~10)
  + legend (~13), loop/sig wiring (~4). The overage is the single-pass alight IIFE (chosen for
  O(entries+subs)-once perf over an O(books×store) per-book helper call) + house comment density.
  My firm estimate under-sized the IIFE; the code is exactly the ruled scope.
- Greps (all as intended): shelf-yumiline 1 · Most-shelved lens 1 · alight set refs 6 ·
  shelf-book-rmark 2 · shelf-rootednote 2 · isAlight signatures 2 · zero-count skip removed (0).
- **DECISION NEEDED before CSS slice** (bigger byte chunk): accept a revised views.js band
  (~+6,600, planned code + comments) OR trim (swap the single-pass IIFE for per-book
  `marginaliaForBook()`+`rootedSubTheories()` reuse ≈ −2,000 B, at O(books×store) per render).

### Byte-band call: Preston ACCEPTED revised views.js band (~+6,600); proceeded to CSS.

### S-2 components.css — RESULT
- Byte delta: 460,581 → 472,755 = **+12,174 B** (FIRM band +9,000…+13,000 → IN BAND).
- New `.shelf.lum-amber-deep { … }` block appended after the Notebook block (11446→). 81 rules.
  **Token-pure** (0 hex literals; rgba glass/glow tints are the lumen material idiom, as in
  lumen-amber.css + the notebook block). Base `.shelf` (9984-10055) + `.shelf-book` (2355-2543)
  UNTOUCHED (arc member list + pickers keep the theme look). `git diff --stat`: insertions-only,
  no EOL flip. Only views.js + components.css dirty (+ pre-existing `D test-arc-constellation.html`).
- Parse (views.js) re-check: **PARSE: PASS (706767 chars)**.

### FINAL byte reconciliation (SHELF)
| File | before | after | Δ | band |
|---|---|---|---|---|
| js/views.js | 700,161 | 706,767 | **+6,606** | revised (accepted) |
| assets/components.css | 460,581 | 472,755 | **+12,174** | +9,000…+13,000 ✓ |
| combined | | | **+18,780** | |

### RENDER VERIFICATION (Claude_Preview MCP, praxisapp-w1 :8763; seeded 10 books incl. 3 alight)
Hard evidence = live-DOM computed proof; screenshots corroborate.
- **Desktop 1265**: shelf full-bleed **1249px**, content centered **1080** (canon §4-J), grid **184×4**
  cols, `scrollWidth==clientWidth` (no overflow); hit-test x=1240 → `.shelf.lum-amber-deep`;
  ground = amber radial. Title Cormorant / `--lum-ink`. Console clean.
- **True 390 (CDP)**: clientW 390, **no overflow**, single-col (374), grid **162×2**, sidebar
  `position:fixed` off-canvas drawer, Filters btn `display:flex`. Screenshot ✓.
- **Mobile drawer**: `.click()` on Filters → `.shelf-sidebar-mobile-open` → `transform:none`,
  left 0, **solid `--lum-base`** (no blur, canon §2), 0.35s slide; backdrop `.on`; All(10)+Reading(4)
  +Finished(4)+Unread(2), Lenses|Cat seg, Ask-Yumi, Author. Screenshot ✓.
- **List view**: 10 rows, **3 alight rows w/ leading rmark**, `--lum-glass-bd-2` border, Cormorant titles.
- **Empty state**: Cormorant "Nothing on the shelf matches." on no-match filter.
- **Chip reskin** (signed-in-only; probed): DM Sans, glass border, pill radius, no-uppercase.
- **Counts == data** everywhere: 10 cards, 3 alight == 3 rmarks, status 4/4/2, lenses 4/3/3.

### SHELF fidelity manifest — re-tick (every row marked)
| # | Element | Verdict | Proof |
|---|---|---|---|
| S1 | head: title + mono count | **BUILT-EXACT** | "Your shelf" Cormorant `--lum-ink`; "10 books · 4 reading · 4 finished" |
| S2 | Yumi lean line | **BUILT-DIVERGES** (ruled S-D1) | deterministic "Most-shelved lens: The erotic · 4 books", cyan `.lum-yumi`; generative → DEFERRED LOG |
| S3 | + Add a book (primary) | **BUILT-EXACT** | gold-gradient `.btn-primary` (signed-out → "Sign in to add books", correct auth branch) |
| S4 | Covers\|List seg | **BUILT-EXACT** | glass seg, gold `.is-on` |
| S5 | Filters btn (mobile) | **BUILT-EXACT** | `display:flex` <760, hidden ≥760 |
| S6 | secondary chips | **BUILT-DIVERGES** (ruled S-D6: 5 kept) | chip reskin computed: DM Sans, glass border, pill, no-uppercase (signed-in-only) |
| S7 | search | **BUILT-EXACT** | glass well, ⌕, "Filter shelf…" |
| S8 | status rail All + 4 always | **BUILT-EXACT** (ruled S-D4) | All(10) is-on, Reading(4)/Finished(4)/Unread(2). Label "Unread" vs mockup "On the shelf" = minor wording DIVERGES (kept live) |
| S9 | Lenses\|Categories + lens rows | **BUILT-EXACT** (S-D5 kept) | glass toggle, gold; The erotic(4)/Critical pedagogy(3)/Refusal(3); Author rail + Ask-Yumi reskinned, logic untouched |
| S9-orb | per-lens glow marker | **DEFERRED/OMITTED** (ruled S-D8) | lenses carry no real per-lens color (`bookLensTags` uniform gold dot) → omitted, not fabricated |
| S10 | covers frame + alight + rmark | **BUILT-EXACT** (S-D2) + **DIVERGES** (S-D3 real covers) | 4 real covers + 6 placeholders framed; alight 3 == rmark 3, gold glow; predicate = real marginalia OR sub-theory |
| S11 | list rows | **BUILT-EXACT** | 10 rows, lumen type, alight leading rmark |
| S12 | empty state | **BUILT-EXACT** | Cormorant lumen empty |
| S13 | rootednote legend | **BUILT-EXACT** | gold orb + "Alight = … marginalia, or a sub-theory built from it. …" |
| S14 | mobile scrim | **BUILT-EXACT** | backdrop `.shelf-sidebar-backdrop-open` → display:block |
| S15 | peek nav stand-in | **NOT BUILT / DIVERGES** (ruled S-D7) | real `#book/<id>` navigation kept |

No MISSING rows. SHELF surface: **PASS** (Preston PASS-stamped). Residuals ruled: keep broader
alight predicate (book-detail follow-up logged below); signed-in chip/alight confirm folded into ship.

**Follow-up logged (out of scope, W4 shipped):** widen Book Detail alight predicate
(`rootedSubTheories`-only @6662/7134) to marginalia-OR-subtheory to match the shelf. Interim seam accepted.

---

## BOX 2 — FIELD build (S1 arc interior: Field / Read / Page)

### FIRM byte estimate (byte gate armed; landing far off = stop + report)
- `js/views.js`: **+9,000 … +14,000 B** (face toggle+state; keep+reskin constellation branch; Tidy
  session-compose; concentrate+whisper interaction; NEW Read face; NEW Page stub; remove List body).
- `assets/components.css`: **+11,000 … +16,000 B** (`.arcfield.lum-amber` conversion block: head, faces
  seg, ghost/Tidy, fld-stage/constellation chrome reskin (control bars, Layers popover, tooltip, rail),
  whisper, Read, Page + 759 reflow). `sw.js`: 0 (bump at final ship).

### Recon confirmations (all additive; renderer UNTOUCHED)
- Face state: `getArcViewMode` hard-rejects non list/web → add NEW `ls/sv('praxis_arc_face','field')`.
- `renderSubTheoryConstellation(arc,svg,opts)` opts = visibility/palette only; **positions + `edges`
  (from `linkedSubTheories`) flow through `_arcDetailBuildSubTheoryData` (10131)** → Tidy = session
  x/y override on that arcData (no persist, no renderer touch); Read/whisper read the same `edges`.
- Interaction layer `_stConstellationAttachInteractions` is in **views.js:10302** (touchable); drag/connect
  selection is in arc-constellation.js (untouched). Marks carry `data-st-sub-id` → concentrate = additive
  CSS classes from views.js. Write route: `#subtheory/<id>/build` (renderSubTheoryBuild) / `#subtheory/<id>`.
- Atmosphere: FIELD = `.lum-amber` ("your thinking", lumen-amber.css:15), not -deep.

### Decisions I will take (mockup-faithful; surfaced, not blocking) — unless you rule otherwise
- **Tidy** = opt-in session compose (radial/gentle arrange) via arcData x/y override, Restore reverts,
  never auto. Connect/Reset/Layers KEPT + reskinned, scoped to the Field face.
- **Concentrate (F-D3)** = tap a mark → focal scale + dim others + highlight its linked marks + a Yumi
  cyan whisper card with DETERMINISTIC data ("Connects to N: <headers>"); no prose. Includes an
  "Open the sub-theory →" link so tap-to-open is preserved one step in.
- **Read (F-D2)** = deterministic: the real threads (edges) listed as "A ⟷ B" + each sub-theory's
  connection count; no generated prose. Generative narration → Deferred Log.
- **Page** = STUB: focal (or first) sub-theory mark + "Write '<name>'" + "Open the page →" →
  `#subtheory/<id>/build`; empty → "+ Add a sub-theory". Writing surface NOT rebuilt.

### DECISIONS FOR PRESTON (need a ruling before I execute this core-surface restructure)
1. **F-D1 REQUIRED FLAG — List retirement loses the attached-ENTRIES view.** The rail
   (`buildArcFieldRail`) shows the arc's **books only** ("Books in this arc"); the retired List showed
   books **and notebook entries** (`arc.entryIds` → `renderNotebookEntry`). Constellation marks =
   sub-theories, not raw entries. So retiring List removes the only in-arc view of attached entries.
   **Options:** (a) add "Notes in this arc" to the rail (preserves entries, my recommendation) ·
   (b) accept the loss (entries reachable from the Notebook) · (c) keep a minimal List affordance.
2. **Tap-model change (confirm):** live tap = open sub-theory; mockup + F-D3 = tap = concentrate.
   Recommendation: tap = concentrate with "Open →" in the whisper (above). OK, or keep tap-to-open
   and trigger concentrate another way?

### DEFERRED FEATURE LOG (Field) — restated, not built
Field generative-Yumi: READ narration (F-D2), concentrate-whisper PROSE (F-D3), latent-thread
suggestions (F-D6). Each needs its own build + EXTERNAL Yumi eval. Awaiting greenlight.

RULED: #1 → add "Notes in this arc" to the rail (preserve entries). #2 → tap = concentrate,
open-in-whisper. Tidy impl = session-only null-position override on arcData → renderer's own
composed radial layout (no persist, no coordinate guessing, renderer untouched).

### FIELD slices (self-verify parse+bytes+greps after each)
- V-1 views.js: root `.lum-amber`; face state `praxis_arc_face`; Field/Read/Page seg;
  branch → field/read/page; Tidy (session null-override) in field control bar; rail "Notes in this arc";
  concentrate+whisper in `_stConstellationAttachInteractions`; Page stub → `#subtheory/<id>/build`.
- V-2 components.css: `.arcfield.lum-amber` conversion block + 759 reflow.

### FIELD RESULTS
- V-1 views.js: **PARSE PASS (717928)**; Δ **+11,161 B** (band +9k–14k ✓). Greps: face state 3,
  faces seg 1, Tidy 2, read/page fns 2 each, "Notes in this arc" 2, concentrate/whisper 10,
  old members-list body removed (0). **Renderer-untouched proof: `git diff --stat` empty for
  arc-constellation.js / marks.js / lumen-amber.css.**
- V-2 components.css: **token-pure** (0 hex); Δ **+11,007 B** (band +11k–16k ✓); 79 rules;
  insertions-only (no EOL flip). Only views.js + components.css dirty (+ pre-existing D).

### FIELD render verification (praxisapp-w1 :8763; seeded arc a1: 5 sub-theories, 3 real threads, 2 books, 1 note)
SW cache cleared (→0) + reload before capture (fresh files confirmed: face reads "Field", not old List/Web).
- **Desktop 1265**: root full-bleed **1249**, content centered **1080**, stage grid **788+220**
  (constellation + rail), no overflow, amber radial ground, Cormorant question. Console clean (0 errors).
- **True 390**: clientW 390, **no overflow**, stage single-col (342), 44px face targets, 7 marks. Screenshot ✓.
- **Concentrate (F-D3)**: tap s1 → `is-concentrated`, focal/linked/dim = 2/3/2 (all 7 marks partitioned);
  whisper (settled opacity 1) = DETERMINISTIC "Teaching that begins in longing connects to 2 ideas:
  The lit room, Against mastery." + open link `#subtheory/s1`. No prose.
- **Read (F-D2)**: 3 real threads ("… ⟷ The lit room"), degree counts [2,1,2,1,no threads]; no
  constellation, no prose.
- **Page**: focal mark (PraxisMarks svg) + 'Write "Teaching that begins in longing"' + open →
  `#subtheory/s1/build` (existing writing route; surface NOT rebuilt).
- **Tidy (F-D5)**: Tidy↔Restore + is-active; persisted x/y (123/77) **untouched** when on (session-only,
  never persisted); Restore returns them. Connect/Reset/Layers kept + reskinned (8 bottom controls).
- **Rail (F-D1 ruling)**: "Books in this arc" (2) + "Notes in this arc" (1 marginalia) — entries preserved.

### FINAL byte reconciliation (FIELD): views.js +11,161 · components.css +11,007 · combined +22,168.

### FIELD fidelity manifest — re-tick
| # | Element | Verdict | Proof |
|---|---|---|---|
| F1 | scaler rig | **DIVERGES** (ruled F-D7) | responsive full-bleed, rig not ported |
| F2 | arc-kicker eyebrow | **BUILT-EXACT** | `.eyebrow` "ARC" gold mono |
| F3 | arc-title (name) | **DIVERGES** | live data model has no separate arc-name; title IS the question (F5) |
| F4 | arc-meta computed | **BUILT-EXACT** (fields differ) | "5 sub-theories · 2 books · tended today" (live fields; no threads/load-bearing count) |
| F5 | arc-q question | **BUILT-EXACT** | `.arcfield-q` serif = arc.title |
| F6 | Field/Read/Page seg | **BUILT-EXACT** | 3 tabs, gold active; List retired (F-D1) |
| F7 | Tidy control | **BUILT-EXACT** (placement DIVERGES) | Tidy/Restore session-compose; sits in the control bar with C/R/L, not the faces row |
| F8 | fld-stage | **BUILT-EXACT** | constellation host reskinned; renderer untouched (F-D4) |
| F9 | fld-threads | **BUILT-EXACT** (highlight DIVERGES) | renderer threads kept; concentrate highlights linked MARKS (no edge DOM hook w/o renderer touch), not the paths |
| F10 | fld-node marks | **BUILT-EXACT** (focal DIVERGES) | renderer marks + maturity glow; focal via opacity, not transform-scale (SVG `<g>` carries translate) |
| F11 | fld-hint | **BUILT-EXACT** | renderer's own hint/legend row |
| F12 | idlewhisper (pre-tap) | **DEFERRED** | generated prose → Deferred Log; no fabricated idle line |
| F13 | concentrate whisper | **BUILT-DIVERGES** (ruled F-D3) | deterministic thread facts + open link; generative prose → Deferred Log |
| F14 | READ face | **BUILT-DIVERGES** (ruled F-D2) | deterministic threads + degree counts; generative narration → Deferred Log |
| F15 | PAGE face | **BUILT-EXACT** | stub → `#subtheory/<id>/build`; writing surface not rebuilt |
| + | Connect/Reset/Layers | **BUILT-DIVERGES** (ruled F-D5) | kept + reskinned, Field-scoped (mockup shows only Tidy; omission≠deletion) |
| + | rail "Notes in this arc" | **BUILT** (ruled F-D1) | attached entries preserved in the rail |
| + | latent-thread offer | **DEFERRED** (ruled F-D6) | not built (generative) |
| + | renderer/drift (F-D4) | **UNTOUCHED** | `git diff --stat` empty for arc-constellation.js/marks.js/lumen-amber.css |

Residuals (non-blocking): (a) when **Connect is armed**, tapping a mark both arms the connect
(arc-constellation.js capture handler) AND concentrates — a minor visual overlap; connect still works
(can't coordinate without touching the renderer, F-D4). (b) concentrate is tap-only (no hover/touch
distinction) — per your ruling. FIELD surface: **PASS** (pending your eyes-on).
