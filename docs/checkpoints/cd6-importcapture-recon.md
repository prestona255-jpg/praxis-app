# CD-6 UNIFICATION · STAGE 3 (ImportCapture retirement / DOOR-SEG) — STAGE 0 RECON

CD6-IMPORTCAPTURE STARTED · HEAD `f8ac91e` · CACHE_VERSION `praxis-v3.256` → ship `v3.257`

Baselines (LF blobs): views.js **1,097,543 B** · import-capture.js **66,681 B** · components.css **858,358 B** · theme.css **44,866 B** · voice-input.js **5,796 B**
Foundations MD5 (must stay): marks.js `772886c0…` · lumen-amber.css `070679b0…`

## HEADLINE (the thing that reframes the whole stage)

**The ImportCapture OVERLAY is already ORPHANED — dead UI.** `ImportCapture.open()` has
ZERO live callers (git `-S` proof: the last caller died in Stage 1, `c59a092`, when the
Notebook writeline's "bring one in" handoffs were removed). Every live thought-entry path
— nav entry, ⌘N, create-corner, book-page ✎, Android share_target — now routes into THE
DOOR (`capOpen`). The overlay cannot be reached by any user gesture.

What is NOT dead in import-capture.js — the parts the app still consumes:
- **The dictation transport** (`canRecord`, `recordAndTranscribe`, `transcribeBlob`,
  `pickAudioMimeType`) — the DOOR's voice mode calls `ImportCapture.recordAndTranscribe`
  + `canRecord` live (views.js:23633/23636/23641). Load-bearing, keep.
- **The segmentation pipeline** (`segmentDoc`, `matchBook`, `candidateBooks`, `registerFor`,
  `looksLikeQuestion`, `normTitle`, `hasSharedToken`, `commitEntries`, `coerceSegments`,
  `parseJSON`, `collectText`, `bodyKey`) — all exposed on `window.ImportCapture` and callable
  from views.js NOW (PRAXIS_CLIENT_KEY is a global, integrations.js:18). The door does NOT
  call them yet — that gap IS the DOOR-SEG debt.

So this stage is NOT "migrate a giant overlay." It is: **delete the orphaned overlay UI,
keep the pipeline + transport as a headless core the door drives, and pay DOOR-SEG by
wiring the door's already-existing paste mode to segmentation.**

## §1 — ENTRY-POINT MAP (post-v3.256)

| Trigger | Live path today | On overlay removal |
|---|---|---|
| Nav "Capture" entry (`.cap-nav-entry`) | `capOpen({mode:'note'})` (views.js:23563) | unaffected |
| ⌘N / Ctrl+N | `capOpen` (views.js:23596) | unaffected |
| Create-corner "+" (`capCreateDoor`) | `capOpen` (views.js:23561) | unaffected |
| Book-page "✎ Add marginalia" | `openCaptureDoor({targetKey})` (Stage 2) | unaffected |
| Android share_target (`?title=&text=`) | `capHandleShareTarget`→`capOpen` (views.js:23686) | unaffected |
| **ImportCapture overlay** | **NO live trigger — orphaned since `c59a092`** | **nothing breaks** |
| Door voice mode | `ImportCapture.recordAndTranscribe` (kept) | keep the transport |
| Door paste mode (`cap-mode-paste`) | dumps raw file/paste text into `capField` → files as ONE note (DOOR-SEG debt) | this is where segmentation seats |

**What breaks if the overlay DOM/UI vanishes: nothing user-reachable.** The only cross-file
dependencies are the transport (kept) + the pipeline functions (kept/retained). 140 `.ic-*`
CSS rules (components.css 10610–12459, incl. the dark `.lum-amber-deep .ic-*` reskin) become
dead once the overlay builders are gone.

## §2 — CAPABILITY INVENTORY (the C-table)

| # | Capability | Where | Verdict |
|---|---|---|---|
| C1 | `segmentDoc(raw)` — LLM split via claude-proxy (`SEG_MODEL=claude-sonnet-4-6`, temp 0), **1 auto-retry on 5xx/network, 4xx not retried**, `coerceSegments` fallback | ic:129 | **MIGRATE (retain headless; door calls it)** — heart of DOOR-SEG |
| C2 | `matchBook`/`candidateBooks` — auto-file (title exact→unique-containment; author unique-token); **conservative: never auto-files when >1 qualifies** | ic:207/801 | **retain headless** |
| C3 | `registerFor`/`looksLikeQuestion` — per-note register inference (quote→marginalia, ?→question) | ic:250/254 | **retain headless** |
| C4 | `commitEntries` — BATCH write of 11-field entries, in-batch + existing dedup (`bodyKey`), one dirty/save/render; **deliberately NOT captureNote** | ic:276 | **SOLE-WRITER SUB-FORK (§4b)** |
| C5 | review-by-exception UI — `renderReceipt`/`buildBookRow`/`buildNoteRow`/`buildFlip`/`buildNeedBar` + `openQueue`/`renderQueue` (book-grouped, progressive disclosure, "N need a book" bar) | ic:572–988 | **REBUILD in the door idiom** (caught-list + chip flip) OR minimal — census-sized |
| C6 | overlay entry/processing screens — `open`/`renderEntry`/`renderProcessing`/`runImport` | ic:416–571 | **RETIRE (orphaned; door replaces)** |
| C7 | overlay's OWN dictation UI — `startDictation`/`processDictation`/`renderDictated`/`buildMicHero`/`buildTypeNoteHero`/`renderListening`/`fileDictationToBook`/`undoDictation` | ic:1156–1423 | **RETIRE (orphaned; door voice already absorbed the transport)** |
| C8 | dictation TRANSPORT — `canRecord`/`recordAndTranscribe`/`transcribeBlob`/`pickAudioMimeType` | ic:1024–1155 | **KEEP (door consumes live)** |
| C9 | undo model — `undoImport` (consumes `lastImport.createdIds`) | ic:989 | door already has `capUndo` (single-note); batch undo = build item |
| C10 | F5 safety / RAW-JOINS-CORPUS — segAttempt's catch keeps raw in the field on any failure | ic:141–166 | **preserve as an invariant of the new seat** |
| C11 | book-picker (`buildBookSearch`) — free-text→bookId for the exception queue | ic:834 | door has `capChip` picker; reuse that idiom |

## §2b — LIVE-CALLER GREP EVIDENCE (counts, not descriptions)

Precise external callers across the whole tree (`ImportCapture.<fn>(` outside import-capture.js):

| fn | external live callers |
|---|---|
| open · close · segmentDoc · matchBook · candidateBooks · commitEntries · registerFor · renderReceipt · openQueue · renderQueue · undoImport · buildBookSearch · transcribeBlob · _lastImport · _normTitle · _registerFor | **0** |
| recordAndTranscribe | **2** (door voice) |
| canRecord | **1** (door voice) |

Internal reachability: `segmentDoc`/`matchBook`/`commitEntries` are called only from `runImport`
(ic:517/526/534) and `processDictation` (ic:1281/1289); `runImport` is called only from
`renderEntry`'s upload/paste handlers (ic:484/490), inside `open()`. `renderReceipt`/`openQueue`
(review-by-exception) are called only from the `runImport` chain (ic:557/667/889/937). **`open()`
has 0 external callers → the whole segmentation + review + queue + book-matching + overlay-dictation
subtree is dead.** Only the transport (recordAndTranscribe/canRecord) is live.

## §3 — USAGE CENSUS — RUN ON REAL SIGNED-IN DATA (prestona255@gmail.com, live, 2026-07-25)

Read-only probe run in Preston's live signed-in session. 29 entries in `state` = **13 his** + 16
`__praxis_seed__` worked-example (2 distinct userIds). His 13 have 13 distinct createdAt — no
masked clustering. No text was read out (structure-only, law G1).

**His 13 real notebook entries:**
- **Provenance — 0 import batches.** 13/13 are direct singletons (unique-ms `createdAt`).
  **He has never created a note through segmentation.**
- **Body shape — 12/13 single-passage** (0 blank-line paragraph breaks), all < 200 chars; **exactly
  1** note is multi-passage (331 chars, 2 para-breaks, 4 newlines, marginalia, unfiled). 0 quote-line
  (`>`) notes; only 1/13 has ≥ 2 newlines.
- **Distribution:** register 11 marginalia / 2 journal; 8 filed / 5 inbox; 2 with images.

**Answer to the census challenge (Preston, this session):** multi-note pastes do NOT dominate —
they are near-absent (0/13 via segmentation; 1/13 structurally). So A's post-hoc split is the
rare/exceptional path (A's intent), and **the numbers RULE the review-UI size: minimal.**

**Honest caveat:** n = 13 is small, and it measures past behavior when segmentation lived in an
overlay Preston evidently (never) opened. Strong evidence of low multi-note frequency; NOT proof
of latent future demand if paste-split were made prominent. It argues for A + a lean review UI,
not for porting the heavy overlay pipeline wholesale.

## §4 — THE CENTRAL FORK: how segmentation seats in the door

The two hardest laws — **raw-joins-corpus (incl. proxy-down / mid-seg failure)** + **<400ms,
never block the receipt** — are the discriminator.

- **(A) file-raw-first-then-offer-split.** "File it" commits the raw blob as ONE note
  INSTANTLY (the door's existing paste commit — already <400ms, already owner-gated). The
  receipt/toast then offers **"Split into N?"** as a FORWARD act on the filed note: tap →
  `segmentDoc` (background, non-blocking) → on success REPLACE the parent with N per-note
  notes + surface only the ambiguous ones for a book/register decision. Proxy-down/failure:
  you already HAVE your raw note; the offer just fails soft. Duplication solved (split
  replaces the parent). New async surface = ONE guarded split on an already-committed,
  already-owned note.
  → **raw-joins-corpus + <400ms satisfied BY CONSTRUCTION.** *(recommended)*
- **(B) paste-mode choice pre-commit ("File as one / Split into notes").** User chooses
  before commit. Split → `segmentDoc` → review → commit N. Re-introduces a blocking
  "processing" beat (the exact thing the door's <400ms law pushed against) unless file-as-one
  stays the instant default; raw is only in the field/draft (not yet in the corpus) until the
  user acts; needs careful failure→file-as-one fallback. Closest to the OLD overlay model.
- **(C) door hands off to a retained review surface.** Keeps a second surface alive →
  contradicts "the overlay is retired"; redundant with the door's caught-list idiom. Not
  recommended.

**Recommendation: A — now census-backed.** It is the only option where both hard laws hold by
construction rather than by fallback wiring, it creates the smallest new cross-account surface, and
it reframes segmentation as a non-destructive-until-accepted enhancement on a note that is already
safe. §3 confirms multi-note pastes are the exceptional case (0/13 via segmentation), which is
exactly the population A optimizes for; B front-loads a split choice on every paste for a case that
essentially never occurs. The census also rules the review UI **minimal** (a lean "Split into N?"
+ per-note book/register flip on the caught-list — not the overlay's full receipt/queue).

### §4b — SOLE-WRITER SUB-FORK (rides the fork)
"captureNote sole entry writer" BINDS (§6). Split = delete-parent + write-N. Write-N options:
**(i)** loop `captureNote` with a batch flag (one render, per-note Yumi suppressed) → ONE
writer, literal compliance; **(ii)** bless `commitEntries` as the sanctioned batch writer
(shape is already byte-identical to captureNote; it already dedups). Recommend **(i)** unless
the census shows large/frequent batches where commitEntries' single-save perf matters.

## §5 — SEAM MAP + expected deltas

- **Retire (delete):** overlay builders C6+C7 + `open`/`close`/`done`/`renderEntry` … the
  full overlay UI (~ic:350–1023 minus the transport, +1156–1423) ≈ **600–750 lines removed**
  from import-capture.js → import-capture.js goes strongly NEGATIVE. 140 `.ic-*` CSS rules
  (components.css 10610–12459) become dead → remove in the same stage (own byte delta).
- **Keep headless:** pipeline core (ic:60–333, 791–870) + transport (ic:1024–1155). Naming
  sub-decision (not load-bearing): keep the `window.ImportCapture` namespace as the headless
  home (zero door churn) OR rename honestly (touches the door's 3 `ImportCapture.*` call
  sites — mechanical). Lean: keep the name, drop the "overlay" meaning.
- **Build in the door:** paste-commit already exists; ADD the split affordance (receipt/
  caught-list "Split into N?"), the segmentation call, the exception review (reuse `capChip`
  picker + register seg), batch undo. New async surface → owner-gate at split-time
  (capOwnerUid), gen-guard if it touches capCommitBusy.
- **views.js delta:** positive (the split UI + wiring), bounded.
- **Draft/guard implications:** the door's draft (`praxis_nb_draft_<uid>_capture`), owner
  reset (BLOCK 1), gen-gating, capMicSeq all already cover the door; the split adds one more
  owner-gated async path to audit in the red-team's cross-account class.

## §6 — Stage 1/2 precedents that BIND (unless overridden here)
Door singleton (Fork-B; no embedded instance) · guards grep-singular · every `capCommitBusy`
release gen-gated · image capture = the Stage-1 photo path (no 2nd pipeline) · **captureNote
sole entry writer** (→ §4b) · `noNav` + route-gated leaf/list refresh + HOLD-2 · L18
interactive-control sweep (fire EVERY mode + EVERY selector at self-verify) · cross-account
guard class covers ANY new async surface (segmentDoc split is a new one).

## §7 — Drift noticed, NOT folded (REVERT JUDGMENT — separate named tasks)
- **DEAD-VOICEINPUT:** `voice-input.js` (5,796 B) is still `<script>`-loaded (index.html:83)
  but the dictation transport explicitly bypasses it ("no VoiceInput", ic:1228). Likely dead
  → its own dead-code task.
- Pre-existing `import-capture.md` REWORK/FIX/ADD ledger items still stand.

HALT — one question (see chat). Rulings come from the chat before any build.

---
## AMENDMENT (Preston, post-Stage-A HALT) — keep-list revised

**buildBookSearch moves keep -> RETIRE** (explicit amendment to the Stage-0 keep-list §5).
candidateBooks STAYS keep and now feeds the door's native capChip picker in the Stage-B review
(the `.ic-` book-search DOM widget is not used — the door has its own chip idiom). `el()` retired
too (it was buildBookSearch's sole remaining consumer). Consequence, ruled by condition (1):
components.css ends this stage with ZERO `.ic-` rules — the pre-existing `.ic-trigger` Stage-1
writeline remnant (3 dead selector-lines in live `.notebook.lum-amber-deep` comma-groups, 0 JS
refs) is removed too, selector-lines only, live `.chip`/`.nb-tab` siblings untouched. This is
surfaced (not silently folded) because condition (1) makes the whole `.ic-` namespace in-scope.
The Stage-0 recon text above is preserved as written; this block records the amendment.

Carried to STAGE B (conditions 3 & 4): L18 walk covers chip-picker states (suggest shown / no
suggestion / manual search / reassign / picker-open-during-owner-change = cross-account class on
the new surface); and capChip/capRenderChipPop is NOT this lane's to refactor — if it needs ANY
change to serve split children, HALT before touching it.
