# R-ARC RAIL SLICE — FF-12 + UNFILED-REACH + FF-2 — STARTED

Base `6c5423a` / live v3.222 (verified). Wave C (Fable 5), unattended run-mode.
Scope per Preston's ruling (2026-07-17):
- **FF-12** — gathered evidence (THIS sub-theory's `evidence[]`) rendered
  beside the prose canvas in the workshop; no more weaving from memory.
- **UNFILED-REACH** per the ruled F1–F4: F1 GLOBAL "Unfiled" browse group in
  the rail (all the reader's `bookIds:[]` captures) · F2 the Page meta gains
  the quiet "· N BOOKS · N UNFILED" tail (shown when unfiled > 0) · F3
  weaving NEVER files (display/read-side only; `addEvidence` untouched) · F4
  NO new Inbox sibling.
- **FF-2 riding** — per-passage doors on the evidence cards, destination-named
  (FF-7 door law).
- Arc-detail lighting: NOT in scope unless recon shows a trivial fit —
  disclose as rider at the pre-build gate or leave named.
- WAVE-C-INT-1 ("Na…") is Slice 12's rider — NOT here.

Commit LOCAL, HALT for push word. Anchors below are re-verified against LIVE
code (the S6c stale-comment lesson) — the UNFILED-REACH brief's citations
predate Wave B's views.js shifts.

## Stage 0 recon (LIVE anchors, re-verified this session)

- Rail: views.js:11484-11690 (`renderSubTheoryBuild` right rail). Book-keyed
  `marginaliaFor` :11501-11513 (register==='marginalia' + bookIds contains
  bookId — unfiled can NEVER appear, confirmed live). Book-group builder
  :11529-11622 (.stb-book → .stb-brow + .stb-marg-wrap of .stb-marg cards).
- `filterPull` :11660-11682 narrows `.stb-book` els via `data-book-title` +
  `.stb-passage` text — **an Unfiled group in the .stb-book SHAPE is
  searchable/filterable + select-listed with ZERO filterPull changes** (the
  brief's "pool fix, not search fix", confirmed against live code).
- `weaveNote` :11368-11390 — inserts ` *Title* ` + `addEvidence(kind entry)`;
  **null-book tolerant** (`citeTitle` falls back to 'a note'). `addEvidence`
  state.js:2381-2422 — **NEVER touches entry.bookIds → F3 holds structurally,
  zero write-path changes needed.** Evidence element shape:
  {id, kind:'book'|'entry'|'external', refId, external, quote, annotation,
  addedAt} (quote = capture-time snapshot — survives entry deletion).
- Page meta (F2 site): views.js:10967-10994 — the stBookN dedupe loop; the
  entry branch (:10978-10985) is where bookless entries fall through
  silently. Tail appends there.
- CSS: rail skin block components.css:11740-11831 (`.st-build.lum-amber-deep`
  prefix; `--lum-*` token family; `.stb-marg`/`.stb-pg`/`.stb-passage` are
  SKIN-scoped, not wrap-scoped (:11819-11821) → reusable in an always-visible
  gathered list outside the collapsing `.stb-marg-wrap`). Focus mode hides
  the whole rail (:11661) — gathered panel inherits, consistent.
- Baselines: views.js 1,009,976 B · components.css 717,225 B · sw.js 4,922 B.

## Design (session-owned)

- **FF-12 panel** = `<div class="stb-source stb-gathered">` FIRST in the rail
  (above "Pull from your reading"), reusing srchead/src-title/src-sub + the
  .stb-marg card shape in an always-visible `.stb-gath-list`. Title
  "Gathered for this piece"; count sub-line; honest empty state ("Weave notes
  in from your reading below — they gather here."). Cards per kind: entry
  (live body, else the quote snapshot with "original removed" provenance) ·
  book (title) · external (title — author). **FF-2 doors:** destination-named
  quiet link "Open the book →" (`#book/<id>`) on cards with a live filed
  source; unfiled/external cards carry NO door (no destination exists — note
  deep-link is Slice 10; a dead-looking door would break DWF-1).
- **F1 Unfiled group** = a `.stb-book`-shaped group appended AFTER the book
  groups: `data-book-title="Unfiled"`, cloth cover, title "Unfiled" (quiet
  D9 marker styling), count "N notes · not filed to a book (· M already
  woven)", cards = the exact .stb-marg structure with provenance
  "marginalia · unfiled", weave via `weaveNote(null, …)` (F3: attach-only).
  Sets `anyBook=true` → the filter row appears and the "No marked passages"
  empty copy is honestly suppressed; `pullBookTitles` gains 'Unfiled' → the
  select works unchanged.
- **F2 tail:** count entry-kind evidence whose LIVE entry has bookIds.length
  0 (missing entries not counted — unknown filing is not "unfiled") → append
  " · K UNFILED" when K > 0.
- **F4:** no Inbox affordance anywhere in this diff (grep-provable).
- **Arc-detail lighting rider: DECLINED at recon** — arc-detail's rows are
  plain textContent (not wcRenderMarkdown output); lighting them is a render
  adoption, not a trivial fit. Stays a named candidate.

## Band declaration (two figures, FIX-PROTOCOL §3)

| File | CODE band (hard) | COMMENT allowance (soft) |
|---|---|---|
| js/views.js | **+2,600–5,200 B** | ≤1,000 B |
| assets/components.css | **+250–700 B** | ≤200 B |
| sw.js | bump v3.222→v3.223, **±0 net** | — |

state.js / index.html / recognition.js untouched (F3 = read-side only).

## ⛔ MECHANICAL HALT — HARD CODE-BAND BREACH (2026-07-17)

Build completed and parses (views.js PARSE OK exit 0; sw.js v3.223 ±0 at
4,922 B; css within band: logic 565 of 250–700, comment 73 of ≤200). But the
measured views.js addition classifies as:

| Figure | Measured | Declared | Verdict |
|---|---|---|---|
| CODE (hard) | **7,148 B** | +2,600–5,200 | **BREACH +1,948** |
| COMMENT (soft) | 1,056 B | ≤1,000 | over 56 B (trim-clearable; moot until the code band is ruled) |

**Why the estimate missed:** the recon priced ~190 lines at S6b/6c density
(~25 B/line, tight algorithmic code). This slice is DOM-BUILDER code — the
unfiled group mirrors the existing book-group construction verbatim and the
FF-12 panel is card construction — running ~37–38 B/line. Same line count,
wider lines. **Scope itself did not drift:** the diff contains exactly the
four ruled features (F1 group · FF-12 panel · FF-2 doors · F2 tail) and
nothing else; every added byte serves the ruled scope.

**Halted per the standing rules** (CODE breach = halt; never silently widen;
unattended-mode halt condition 2). Nothing committed; no gates dispatched;
working tree carries the build. Options put to Preston:
(a) **re-band at measured size** (S2/S3 precedent — his ruling, never mine);
(b) a dedupe pass sharing a card factory between the two NEW blocks
(~−800–1,200 B; lands ~6,000 — still needs a re-band, smaller);
(c) scope cut (his call — any cut unpicks part of the 2026-07-17 ruling).

## RE-BAND RULED (Preston, 2026-07-17) — option (a)

**views.js CODE ≤7,400 B hard · COMMENT ≤1,100 B soft** — the honest cost of
the ruled scope, re-banded by explicit word per FIX-PROTOCOL §3 precedent.
Option (b) DECLINED: structural fidelity to the book-group idiom preferred
over a diverging dedupe. Comment overage trimmed (~60 B, the F2 comment).
Conditions bound to the re-band: (1) the reviewer independently maps the diff
to EXACTLY the four ruled features + re-derives the classification to the
byte; (2) full gate suite (red-team → reviewer → fresh-port rig battery), S5
precedent on any BLOCK; (3) the pricing lesson below.

**⚠ PRICING LESSON (standing, per Preston's condition):** recon byte
estimates must declare their DENSITY CLASS — **DOM-builder code prices at
~38 B/line; tight algorithmic code at ~25 B/line.** This slice priced ~190
DOM-builder lines at algorithmic density and broke its own band at the exact
ratio of the two classes (7,148 ≈ 4,800 × 38/25). Future recons name the
class beside the band.

## Self-verify (post-re-band, all session-run)

| Gate | Result |
|---|---|
| Parse | views.js **PARSE OK exit 0** (×3 through the trims) |
| views.js bands (re-banded) | added-code gross 7,148 B; **true NET logic 6,975 B ≤7,400 hard ✓** (reviewer netted the 174 B of replaced lines — 6,975+983 reconciles exactly to the 7,958 LF whole-file delta; gross-vs-net amended per review) · **comment 983** (≤1,000 original figure restored by two trims; ≤1,100 ruled) ✓ |
| components.css | logic 565 (250–700 ✓) · comment 73 (≤200 ✓); **LF delta +638** (565+73; the earlier "+644" was the CRLF-basis wc figure — amended per review) |
| sw.js | v3.223, **±0 net** (4,922 B), CRLF restored post-sed |
| Greps (added lines) | ES3 tokens 0 · `innerHTML` **1 — NAMED: the static chevron entity `&#9656;`, byte-identical mirror of the existing book-group line (T10 static-literal carve-out)** · `inbox` 1 — the F4 comment itself; zero Inbox affordance code |
| Scope | tracked dirt exactly views.js · components.css · sw.js |

## Rig live-verify (:8933 fresh port, seed + d0tester, injected fixture)

Fixture: 2 unfiled + 1 filed marginalia (d0tester) · `st_rail_test` with
5-branch evidence (filed entry · unfiled entry · book · external ·
deleted-ref with quote snapshot) · `st_rail_empty` (0 evidence).

- **FF-12 panel — 5/5 card branches exact:** filed entry (provenance
  "marginalia · <title>", door `#book/<id>` "Open the book →") · unfiled
  entry ("marginalia · unfiled", NO door) · book (title + door) · external
  ("The Undercommons — Moten & Harney", no door) · deleted-ref ("note ·
  original removed", quote snapshot shown, no door). Rail order: gathered
  FIRST, pull source second. Sub-line "5 passages — what this piece stands
  on".
- **Empty control:** `st_rail_empty` → "nothing gathered yet" + "Weave notes
  in from your reading below — they gather here.", 0 cards.
- **F1:** Unfiled group present LAST (`data-book-title="Unfiled"`, quiet
  `.stb-bt-unfiled`), count "2 notes · not filed to a book · 1 already
  woven" (computed, correct), 2 cards "marginalia · unfiled"; select carries
  "Unfiled"; **search 'zombie pedagogy' → ONLY the Unfiled group visible;
  select Unfiled → same** (filterPull + select worked with ZERO changes —
  the pool fix, proven).
- **F3 (the critical proof):** weaving an unfiled note — before/after:
  evidence 5→6, `isEvidenceAttached` false→true, button own-state
  `+ weave in`→`woven in` + dot lit; **`bookIds.length` 0→0,
  `filed` false→false — WEAVING NEVER FILES, proven live.** Canvas received
  the ` *a note* ` marker (null-book fallback, existing behavior).
- **F2:** `st_rail_test` Page meta = "STARTED FROM 6 MARKED PASSAGES ·
  3 BOOKS · **2 UNFILED**" (both live bookless entries counted; deleted-ref
  correctly NOT counted). **Zero-tail control:** `st_rail_empty` Page =
  "…0 BOOKS" with **no UNFILED text**.
- **Sweep:** existing book-group brow toggle flips own-state ✓ · the NEW
  unfiled brow toggle flips own-state ✓ · filter input + select drive
  narrowing ✓ · gathered doors are real `<a href>` ✓.
- **Re-mount consistency:** returning to the workshop shows 6 gathered cards
  (the new weave included) — the panel is a pure render of evidence.
- **390 leg:** gathered + rail full-width (325px), **no page h-scroll**;
  **console zero errors** across the entire drive.

## Residuals

- RR1 — the gathered panel does not live-append during the SAME mount (a
  weave appears on next render). Deterministic, honest; a live-append is a
  polish candidate for Slice 12/the felt pass.
- RR2 — FF-2 doors go to the BOOK only; a per-note door awaits Slice 10's
  note deep-link (no destination exists today — DWF-1 forbids a dead door).
- RR3 — the unfiled weave inserts the existing ` *a note* ` fallback marker
  (weaveNote untouched); wording is felt-retunable.
- RR4 — arc-detail lighting: DECLINED as a rider at recon (plain-textContent
  rows; a render adoption, not a trivial fit) — stays a named candidate.
- RR5 — VISUAL GATE: pane screenshots dead; geometry + computed evidence
  recorded; Preston's deployed eyes remain the gate.
- RR6 *(red-team NOTE 3)* — a real book literally titled "Unfiled" would share
  `data-book-title` with the F1 group: the select would show both together.
  Low-probability, cosmetic, named not fixed.
- RR7 *(red-team NOTE 4)* — `weaveNote(null, …)` is a NEWLY-REACHABLE path
  (first caller ever to pass null): `wovenParagraph('a note', body)` can
  mis-caption "woven into ¶N" when prose legitimately contains the words
  "a note". Cosmetic caption only; wording rethink rides the felt pass (RR3).
- RR8 *(red-team NOTE 5)* — the gathered panel renders ALL evidence uncapped;
  a huge `evidence[]` renders every card. Display-only; a clamp/`show all`
  is a polish candidate.

## Live Forensic Smoke (red-team BLOCK-procedural → EVIDENCED)

The CLAUDE.md minimum for any views.js/shared-CSS change, driven on :8933
signed-in (d0tester, seed + fixture), console-error scan across the WHOLE
drive:
- **Shelf** — `.shelf-book` rendered **5 == 5 stored, once each** (an initial
  52 was an over-broad probe selector counting descendants — reconciled).
- **Arcs List** — renders with content, 1 arc stored, no crash.
- **Arcs Web** (`#arc/<seed>`) — constellation face renders: 4 SVGs, title
  "A Pedagogy of Desire", content present, no crash.
- **Notebook** — 2 cards rendered == exactly the 2 unfiled entries scoped to
  the default tab (the filed entry lives on its book tab — count matches
  data); writeline present.
- **Console: zero errors** across shelf → arcs → arc web → notebook → back.

## Gate verdicts + dispositions

- **praxis-reviewer: CLEARED TO COMMIT.** All three of Preston's re-band
  conditions confirmed: hunk-by-hunk map = exactly the four ruled features,
  zero unmapped hunks repo-wide; classification re-derived to the byte
  (found my gross-vs-net slip: true NET logic 6,975 ≤7,400 — amended above);
  pricing lesson present. F3 re-proven from `addEvidence`'s full body;
  signed-out unreachability confirmed (`renderSubTheoryBuild` hard-gates
  before any new code). Two numeric doc flags → both amended.
- **fix-red-team: 1 BLOCK-procedural + 1 HOLD + 3 NOTE.** BLOCK (smoke
  minimum unevidenced) → **FIXED**, the section above. HOLD (ff7 door-count
  line stale) → **FIXED same-commit** (`r-arc-ff7-applied-vocab.md` amended;
  the law holds, the count superseded). NOTEs → RR6/RR7/RR8. Red-team's
  clean-list independently confirmed: bands to the byte, F3 real, chevron
  byte-identical, F4 comment-only, focus-mode inheritance, no-unfiled
  regression path byte-identical, `bookIds[0]` = established house idiom.
