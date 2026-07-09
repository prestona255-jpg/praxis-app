# R4 NOTEBOOK — LIVE BUILD (Universal v1.2 LIGHT) — checkpoint

R4-NOTEBOOK STARTED — Stage 0 recon. LIGHT ONLY (Preston felt-pass retired the dark pole).

## STAGE 0 — RECON DIGEST (auto-proceed; no conflict found)

- **HEAD** `563fe7e` == origin/main; tree clean (only untracked files). Deployed **CACHE_VERSION praxis-v3.187** (sw.js:10). Mockup commit present at HEAD (563fe7e = "R4 Notebook shape — felt-passed Universal-light mockup … render_fn 1737→1754").
- **Foundations md5 OK:** lumen-amber.css `9879ddb8…` · marks.js `772886c0…` (both match FIX-PROTOCOL lock). Byte baselines: views.js **854206** · components.css **549411** · sw.js **4762**.
- **JS anchors verified FRESH (zero drift vs recon):** renderNotebook **1754** · buildNotebookBookBand **1639** · buildNotebookLeftLeaf **2027** · buildNotebookRightLeaf **2103** · buildNotebookWriteline **2596** · renderNotebookEntry **13943** · setNotebookComposing **2580**. wrap.className `notebook lum-amber-deep` **@1760**. umberGroundDark `notebook:1` **@373** (route STAYS dark — Option-B).
- **Composer seam confirmed:** JS emits `.nb-ce`/`.nb-composer` (2604/2598); dark block styles the never-emitted `.nb-capfield` (**11043**); so composer falls to legacy cream `.notebook .nb-composer{background:var(--page)}` (**9576**) + `.nb-ce{color:var(--br-deep)}` (**9577**) = NB1/NB2.
- **Capmodes:** `.nb-capmodes` triplet @2046, all three call `ImportCapture.open()` (2051/2060/2070), "talk it through with Yumi" @2069; CSS 11063–11068 (run-in prose).
- **Band:** `.nb-bb-cover` 92×138 @10978; dead `.bc`/`.nb-bookhead` display:none @11008. Seespanel cyan @10994.
- **Dead composing CSS:** @4381–4394 targets stale `.notebook-header`/`.notebook-tabs`/`.notebook-secthead` + a grid-collapse on `.notebook-spread` (live spread is `display:block`) → visually inert. Live class = `.notebook-composing` (verify target elem in setNotebookComposing at build).
- **Mechanism = R3 Option-B (confirmed):** Home `.home-page.lum-amber-deep{ --lum-*:light … }` re-point (@11705) + recipe/literal-rescue overrides (@11743+); route stays in umberGroundDark. Shelf R2 identical (@11242). Notebook mirror = `.notebook.lum-amber-deep{ --lum-*:light … }` + recipe overrides, NEW block appended after the R3 home block. Token values = mockup `.skin-universal{}` (lines 399–448) verbatim.
- **Parity target = docs/studio/mockups/notebook.html LIGHT pole** (`.skin-universal`, 1205 lines; 8 states). Read in full.

**No conflict between brief / mockup / live source. AUTO-PROCEED to Stage 1.**

### Build map (stage → files/anchors)
- **S1 skin:** components.css — new `.notebook.lum-amber-deep` re-point + literal-rescue block (mirror home 11705–11793); fix composer-seam selectors (`.nb-composer`/`.nb-ce`/`.crow`/`.seg`/`.seg-opt`/`.btn-primary` light rules); repoint dead composing CSS 4381–4394 → live classes (`.notebook-head`/`.nb-tabs`/`.leaf-right`/`.leaf-left`/`.nb-composer`).
- **S2 composer:** views.js buildNotebookLeftLeaf 2027 + capmodes 2041–2075 → `.nb-modes` labeled chips (paste/import/dictate/photo[/add image]); DROP talk-to-Yumi; handlers byte-identical. components.css `.nb-modes*` rules.
- **S3 band+chips:** views.js buildNotebookBookBand 1639 (band evolve, structure kept) + renderNotebookEntry 13943 (per-note `.nb-entry-bookchip` 22×32 via buildSelfHealingCover, Inbox/Journal only, suppress on `<book>` tab). components.css `.nb-entry-bookchip`/`.nb-chip-*`.
- **S4 hierarchy+empty:** labels/names/spacing; per-tab empty bodies + gathered-empty + signed-out; Yumi resting slot light coherence; copy verbatim ("yours to set" / "never a verdict").
- **S5 ship gate:** fix-red-team + praxis-reviewer, whole-file parse gate views.js, banned-token grep, byte deltas, live smoke sweep, SW v3.187→v3.188. HALT for Preston.

---

## STAGES 1–4 — BUILD EVIDENCE (all PASS; local, uncommitted)

**Verification rig:** local static server :8760 (praxisapp); fresh views.js/components.css
injected per stage (page caches under `?sw_v=`), then getComputedStyle/DOM probes.
Notebook is auth-gated → signed-out CSSOM proof + function-level DOM builds for the
spread (composer/entry/band/right-leaf). FULL signed-in live smoke = Stage 5 (deployed).

### STAGE 1 — SKIN (Universal-light + seam + composing repair)
- Mechanism = R3 Option-B: new `.notebook.lum-amber-deep{ --lum-*:light … }` re-point +
  recipe/literal-rescue block (mirrors home 11705–11793 / shelf 11242), appended after
  the R3 home block. Route STAYS in umberGroundDark.
- Composer seam CLOSED: `.notebook.lum-amber-deep .nb-composer`/`.nb-ce`/`.seg`/`.btn-primary`
  rules (0,3,0 / 0,4,0) beat the legacy cream `.notebook .nb-composer` (9576).
- Composing recede REPOINTED (4381–4396): stale `.notebook-header/.notebook-tabs` +
  grid-collapse → live `.notebook-head`/`.nb-tabs`/`.leaf-right`/`.leaf-left`.
- CSSOM: body `data-ground=dark` ✓ (Option-B, not a map-flip); wrap bg rgb(244,239,228)
  (--paper) + gradient; --lum-ink #241710, --u-sheet-1 #fffdf6, --marginalia-color #2f7d73.
  console clean. GATES: foundations md5 unchanged; 0 hex in rule bodies; RAILS 0 new
  (--register-*/--subtheory-*/setProperty); braces 3232/3232, comments 779/779 whole-file.

### STAGE 2 — COMPOSER (unified labeled modes)
- buildNotebookWriteline: crow → seg + spacer + Capture (photo chips removed); new
  `.nb-modes` row (paste/import/dictate handoff + photo/library inline); talk-to-Yumi
  DROPPED. capmodes block removed from buildNotebookLeftLeaf. Helper buildNotebookModeChip.
- Handlers byte-identical: window.ImportCapture.open() / cameraInput.click() /
  libraryInput.click(). import-capture.js UNTOUCHED.
- DOM proof: composerOrder [nb-ce,nb-shots,crow,nb-modes,inputs]; crow=[seg,spacer,btn];
  5 modes [paste,import,dictate]:handoff + [photo,library]:inline; label "or bring one in";
  talkInMarkup=false. CSSOM: mode chip bg rgb(244,236,219) (--u-chip), Capture gilded
  (border rgb(133,84,16), text rgb(61,40,7)), seg-on gilded. PARSE OK. 'talk'/'nb-capmodes'
  remaining = comments only.

### STAGE 3 — BAND + PER-NOTE CHIPS
- Band cover → buildSelfHealingCover (cloth fallback) — ONE cover path (PRECEDENT).
  Band title italic 26px (NAME tier), author DM-Mono uppercase.
- renderNotebookEntry(entry, gatherable, showBookChip): src line removed; `.nb-entry-bookchip`
  (22×32 buildSelfHealingCover thumb + title) on Inbox+Journal all 3 registers, suppressed
  on `<book>` tabs; presentation-only (reads bookIds, writes nothing). Caller passes
  showChip=(inbox||journal).
- DOM proof: chip on all 3 registers (Inbox), title correct, coverImg for b1 / coverCloth
  for b2, noSrcLine; book tab → NO chip. chip cover 22×32, bg --u-chip, title --lum-ink-2.
  Band coverImg self-heals; cloth fallback for coverless. PARSE OK, 0 hex.

### STAGE 4 — HIERARCHY + EMPTY STATES + YUMI RESTING SLOT
- buildNotebookInboxEmpty(): rich `.nb-empty` (mark+title+body+3 steps) on empty Inbox;
  Journal/book keep quiet one-line empties.
- Yumi resting slot → coherent light-teal: complicate flex + --u-teal-deep + transparent bg
  (no cream bleed), ybubble teal radial, ctag/ctext deep-teal (NB6 legibility). Name field +
  gnote → Cormorant italic. Copy verbatim: "yours to set", "never a verdict".
- Signed-out `.empty-state p`: rescued rgb(100,89,64) (--lum-ink-3, ~6:1) — NOTEBOOK-scoped
  only; global .empty-state stays the R3 craft-pass debt.
- DOM/CSSOM proof: empty title italic, 3 steps, mark gradient; complicate display=flex
  color rgb(31,90,107) bg transparent; ybubble radial; gnote/name italic. PARSE OK, 0 hex.

## BYTE DELTAS (vs HEAD 563fe7e — LF-normalized via `git show HEAD` vs CR-stripped working)
- js/views.js: 834970 → 839618 (**+4648 LF**). [CRLF working-tree wc -c reads 858912; the
  earlier "+4706" mixed CRLF — corrected per red-team NIT #1. Includes the 3 comment fixes.]
- assets/components.css: 549411 → 566450 (**+17,039 LF**). [Includes the rescue-comment fix.]
- sw.js: 4762 (CACHE_VERSION bump v3.187→v3.188 pending, Stage 5).
- EOL-flip guard: `git diff --numstat` = components.css +241/−22, views.js +173/−87 — small
  line deltas, NOT a whole-file change → no EOL flip. ES3 grep clean (control-verified).
  PARSE OK (harness self-validated: broken copy → exit 1, backtick → exit 1, real → exit 0).

## RED-TEAM (fix-red-team) — VERDICT: no block-commit finding
Re-derived every proof (scope, foundations md5, rails, bleed, behavior, ES3, closures, parse).
4 items, all doc/proof-hygiene, addressed: NIT#1 byte-delta CRLF→LF (fixed above); NIT#2 rescue
comment causal story (fixed, components.css ~12009); NIT#3 two stale "capmodes" comments
(fixed, views.js 1776/1843); RESIDUAL shared cover registry (documented below).

## RESIDUALS / FLAGS FOR PRESTON
- **VIS-INDICATOR divergence (LIVE-WINS):** live `.notebook .leaf-left .notebook-entry-vis-on{display:none}`
  (10028) HIDES the "Visible to Yumi" badge; only "Private" shows (muted). The mockup shows
  the badge prominently. NOT a locked decision → preserved live behavior, did NOT flip it.
- **Band cover → buildSelfHealingCover:** honored the PRECEDENT ("never a second cover path");
  slightly more than "skin the band" but unifies the cover path + adds self-heal.
- **Shared cover registry (red-team RESIDUAL):** band + per-note chip covers now render via
  buildSelfHealingCover, so a coverless/broken cover joins the in-session `coverBrokenIds`
  runtime registry (views.js:6868 — non-persisted, no ls/sv/Firestore) that Shelf cleanup
  counts. Intended unification per the precedent; NOT a data-model touch.
- **Signed-out .empty-state p** fixed notebook-scoped only (global debt remains, per R3).

## STAGE 5 — LIVE FORENSIC SMOKE SWEEP (local :8760, signed-out + synthetic spread)
- **BLEED PROOF (global stylesheet):** with fresh components.css loaded, on #books / #arcs /
  #home the new tokens `--u-sheet-1 / --u-teal-deep / --u-chip` are UNDEFINED on body/root,
  and body `--lum-ink` stays `#fdf8ec` (dark) — the notebook re-point is strictly scoped to
  `.notebook.lum-amber-deep`, ZERO leak. Home's own light skin intact (`.home-page` --lum-ink
  #241710). Console CLEAN on Shelf / Arcs / Home / Notebook.
- **Assembled book-tab spread (real build fns, seeded):** wrap bg rgb(244,239,228) (--paper);
  spread gradient + backdrop-filter NONE (bound signature = radius+shadow only); composer light
  sheet; entry bg rgb(255,253,246) (--u-sheet-1); **entry body italic 17px (UNCHANGED tier)**;
  band panel gradient; tag-m rgb(133,84,16) (--gold-deep, AA); band present; 5 nb-modes; chips=0
  on book tab (correct suppression); 2 entries.
- Screenshot tool hung twice (renderer strain from re-injected script) — text/CSSOM proof used
  instead; the visual felt-pass is Preston's on the DEPLOYED bundle (fresh Incognito).
