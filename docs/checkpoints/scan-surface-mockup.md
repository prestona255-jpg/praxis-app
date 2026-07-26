# SCAN ROUND — SURFACE MOCKUP (SHAPE-B) · scan-surface.html

**Model:** Claude Opus 4.8, default effort. **Session:** mockup-only, ZERO app source.
**Ground:** HEAD `88b9117` (push gate PASS — origin/main = 88b9117). CACHE_VERSION
`praxis-v3.259` untouched. **Write surface:** `scan-surface.html` (new, root) + this
checkpoint. Nothing else. **Cost:** the mockup makes NO model/proxy calls — fixtures
only, free per use. **Live URL after push:** `https://praxis-reading.netlify.app/scan-surface.html`.

---

## STAGE 0 — preflight (all gates clean)

1. **Push gate PASS** — `origin/main` HEAD = `88b9117` (contains the opening session's
   4 docs commits). Nothing owed.
2. HEAD `88b9117`, tree clean of tracked app source. `scan-surface.html` did not
   exist (confirmed); `scan-mockup.html` / `scan-derisk.html` (de-risk) left untouched.
3. **SW HAZARD — SAFE, no sw edit.** `sw.js:12` `APP_SHELL` is an **explicit hardcoded
   list**, not a glob/manifest. A new root HTML is NOT swept into the precache →
   `scan-surface.html` serves fresh/uncached (correct for live getUserMedia). `sw.js`
   and `CACHE_VERSION` untouched.
4. Write surface confirmed: `scan-surface.html` + this checkpoint + commits.

## STAGE 1 — build (what shipped in the one file)

Mobile-first 390, Universal v1.2 tokens INLINED (values read from `assets/theme.css`
@ `88b9117`), dependency-free ES3 (`var`/`function`, string concat, no arrow/const/
let/backtick — parse-check clean), `env(safe-area-inset-*)` throughout, a
`prefers-reduced-motion` still-state for every mandated signature.

- **Entry + warm-up (SCD-1):** simulated create-door with the five modes and the
  gold **Scan a book** chip + nav-entry framing (Scan link active, draft-count badge
  capability present). Tap → warm-up veil (amber `hour` gradient + pulsing orb + "Warming
  the lens…") that **fades the viewfinder in — never a white flash**.
- **Permission family (SC7):** primer card BEFORE the OS ask (copy: "…images leave only
  as identification requests — nothing is stored"); **Turn on camera** fires the REAL
  `getUserMedia({video:{facingMode:{ideal:'environment'}}})`. DENIED = designed card that
  stays a **working add door** (ISBN field + search stub). KNOWN-OFFLINE (`navigator.onLine
  === false`) card, checked BEFORE the primer.
- **Viewfinder (SC1/SC3):** live `<video playsinline muted autoplay>` full-bleed; Book·Shelf
  two-segment control; corner-bracket reticle; torch glyph with an **Android-only** tooltip;
  a bottom gradient tint so white ink reads over any frame; all chrome inset by `env()`.
- **Book mode (SC4 / signature 1):** simulated auto-fire ~2.6s after entering Book →
  **LOCK-ON SNAP** (brackets tighten inward + gold flare) → verdict card slides over the
  still-warm camera. Three variants: **new** ("Pedagogy of Freedom / Paulo Freire" · context
  "Second Freire on your shelf" · Add), **already-owned** ("All About Love / bell hooks" ·
  "On your shelf" · Add→**Open**), **silent** ("The Order of Things" · no context line).
- **Shelf mode (SC1/SC10 / signature 2):** deliberate shutter → freeze frame (canvas
  `drawImage` of the live video) → **SHIMMER READ** (indeterminate sweep, NO percentages) →
  tray fills one-by-one from the **fixture**. Count line computed at cut={low}: **"36 found ·
  33 confident · 3 need a look."** **Tray dedupe (SCA3):** an All-About-Love re-catch injected
  mid-stream **absorbs with a soft teal tick** (1 tick), leaving 36 unique.
- **Review — the mirror shelf (SCD-3):** quiet **draft-case** variant of the shipped
  carved-cavity grammar (`--shelf-cavity` fill + inset shadow + two-tone `--board-face` /
  `--board-under`, uniform 2:3 covers, scanned order) — NO wheat, embers, desk or ceremony.
  33 **upright** confident covers vs 3 **leaning gray spines** (Law 1 — the lean carries the
  posture, not copy). A **draft-case** badge states nothing's shelved yet.
- **Exception walker (SCA1):** tap a leaning spine or **Review 3** → sequential sheet: the
  **evidence line verbatim** — `I read: 'SECOND CLASS'` (raw spineText, red) — best-guess
  stub, top-candidate stubs, search stub, **Not a book** / **Skip for now**, and a one-tap
  **Skip all N remaining**. Resolving **auto-advances** to the next; closes after the last.
- **Shelve (SCA2 / signature 3 / ERRATA-1):** **Shelve 33** → **SHELVE FLIGHT** (a
  representative dozen covers fly to a shelf glyph) → receipt **"Shelved 33 · Undo"** with
  **IMMEDIATE** batch undo — **no sync-hold state anywhere** (ERRATA-1 retired the SCD-2 hold).
- **Failure family (SC8):** four distinct felt states — **CALL-FAILED** ("nothing was used",
  free retry) / **EMPTY** (coaching card: closer · light · one row) / **TRUNCATED** (keep-partial
  tray + "reshoot the rest" primary) / **REFUSED** (own quiet card) — each reachable from a quiet
  dev-strip.
- **Lifecycle (SCE-1):** the stream is **fully stopped** on Back/leave, on `visibilitychange`
  hidden, AND on `pagehide`; returning while on the viewfinder **re-warms through the warm-up
  transition**. This mockup is the teardown law's first proving ground (the hardware-indicator
  proof is DEVICE-OWED — felt card #4).

## STAGE 2 — verification (headless, evidence)

| check | result |
|---|---|
| **Parse** (`cscript //E:jscript tools/parse-check`, extracted script) | **PARSE OK** |
| ES5+ syntax leak (arrow/const/let/backtick) | **0** |
| **Console errors** — load + every dev-strip state driven live | **0** (`read_console_messages onlyErrors` = none) |
| All states reachable (entry/primer/denied/offline/4 failures/book×3/shelf/review/walker/shelve/undo) | **PASS** — each toggled + asserted via DOM |
| Shelf fill count line (fixture, cut={low}) | **"36 found" + "33 confident · 3 need a look"**; 36 covers; **1** dedupe tick |
| Review counts | `36 found · 33 confident · 3 need a look`; **33** upright, **3** leaning |
| Walker | opens on SECOND CLASS (`'SECOND CLASS'`), walks 3 in scanned order, auto-advances, closes after last |
| Verdict variants | new→"Second Freire on your shelf"; owned→"On your shelf"/**Open**; silent→no context |
| Shelve → receipt → undo | receipt "Shelved 33"; **undo immediate (0 ms, no hold)** |
| `env(safe-area-inset-*)` count | **37** (all four insets) |
| `@media (prefers-reduced-motion: reduce)` block | **1** (covers all 3 signatures + warm-up) |
| Byte size | **76,147 B** |
| App source modified | **0 files** (`git status -- js/ assets/ netlify/ sw.js index.html tools/` empty) |

**Verification FOUND ONE REAL BUG (fixed before commit):** the first fixture reused
"Teaching Community / bell hooks" as BOTH a confident book and exception E3 → identical
`idKey` → E3 absorbed as a duplicate → tray read **35 found / 2 ticks / 2 exceptions**.
Caught by the deterministic count assertion (L7 — count things, not strings). E3 re-cast
as a distinct low-legibility specimen ("Freedom Is a Constant Struggle", spine
`FR—D—M C—NST—NT`); re-run → **36 / 1 tick / 3 exceptions**. Clean.

### DEVICE-OWED (Preston's phone only — the rig can't settle these)
1. Live `getUserMedia` **visible first frame** on iOS Safari AND installed PWA (legacy
   `openBarcodeScanner` acquired a stream with NO picture — this surface must assert a frame).
2. Camera **warm-up perceived delay** (getUserMedia→first frame) — tunes the SCD-1 fade length.
3. **Safe-area** clearance on the real notch + home-indicator (rig resolves `env()=0`).
4. **SCE-1 hardware indicator** dies the instant you leave / background (the teardown's only real proof).
5. **Torch** expectation in real scanning light (Android) — is the iOS EMPTY-state coaching an acceptable substitute?
6. **Reduced-motion** OS setting spot check.
7. **PWA-standalone** grant parity when installed.

## STAGE 3 — ACCEPTANCE CARD (brief laws · PASS / FAIL / DEFERRED · owner)

| # | Brief law | Verdict | Owner / note |
|---|---|---|---|
| 1 | **Two trust postures, one camera** — barcode confident vs shelf claims; upright cover vs leaning gray spine, never copy alone | **PASS** | Book verdict card (confident) vs mirror-shelf upright/leaning; the lean + grayscale carries it, no apology copy |
| 2 | **The camera forgets** (incl. the hardware layer) — images transient; stream released on route exit + backgrounding | **PASS (structure)** · **DEFERRED (hardware)** | teardown wired on back/`visibilitychange`/`pagehide`; the indicator-light proof = felt card #4 (device) |
| 3 | **The quick card is free** — zero LLM on the verdict card; context locally derived; silence over filler | **PASS** | mockup makes **zero** calls by construction; "Second Freire" / "On your shelf" are local; silent variant present |
| 4 | **Exceptions never auto-commit** — maybe-books stay in a draft; only confident shelve | **PASS (structure)** · **DEFERRED (persistence)** | only **Shelve 33** commits; 3 exceptions held in the draft case; real draft persistence (SCE-2) = build+state |
| 5 | **Failure wears its own clothes** — four distinct felt states | **PASS** | CALL-FAILED / EMPTY / TRUNCATED / REFUSED each its own card, all reachable, none laundered |
| 6 | **The shutter is the budget** — deliberate shutter for paid shelf; auto-fire only for Book | **PASS** | Shelf = deliberate shutter only; Book = auto-fire (+ the shot for covers); queue-1 & no-degrade are build-layer |
| 7 | **Raised-hand Yumi** — card context ambient; she doesn't speak here | **PASS** | no Yumi surface on the scan; context is a quiet mono line; enrichment (one tap deeper) not built (correct) |
| 8 | **Canon-native + a11y** — ES3, Universal tokens, control canon, reduced-motion for the 3 signatures; results announced, walker operable | **PASS (structure)** · **DEFERRED (AT pass)** | ES3 parse-OK; tokens inlined; no underlined captions; RM stills; `aria-live` announce + keyboard-operable walker; real screen-reader pass = device |

**Honest DEFERREDs (expected):** real torch control (Android `ImageCapture` — none exists today);
real classify / GB-corroboration / any model call; real batch-Undo race (the ERRATA-1
forced-timing test is a BUILD gate on `prestonpraxistest`); PWA install variance; desktop
honest-secondary (SC7 drop-zone + XL tier) — **not built in this mockup** (390 is the acceptance
surface per L4; desktop is a build item).

## STAGE 3 — 8-ROW COMPLETENESS INVENTORY

| row | state in the mockup |
|---|---|
| **Ground** | Ground spectrum honored: **light** entry → **camera-dark** viewfinder (amber `hour` warm-up/overlays) → **light draft-case** review. Full-amber is the visitor room, NOT scanning — correctly absent. |
| **States** | 20+ states, all reachable & asserted: entry · warm-up · primer · denied · offline · viewfinder(book/shelf) · lock-on · verdict(new/owned/silent) · shimmer · tray-fill · dedupe-tick · review · walker(step 1–3 + skip/skip-all) · shelve-flight · receipt · undo · CALL-FAILED · EMPTY · TRUNCATED(keep-partial) · REFUSED · re-warm. |
| **Controls** | back · torch(+tooltip) · Book·Shelf seg · shutter · auto indicator · Add/Open/dismiss · tray review · review back/walk/shelve · walker candidates/search/not-a-book/skip/skip-all · receipt undo · dev-strip. All fired live headless. |
| **Widths** | **390 built + verified** (375 mobile preset). **Desktop honest-secondary = DEFERRED** (SC7 drop-zone + XL tier is a build item; flagged, not faked). |
| **Motion** | 3 mandated signatures — lock-on snap · shimmer read · shelve flight — each with a **reduced-motion still**; plus the warm-up fade. RM via CSS `@media` + a JS RM flag (shortened timers). |
| **Marks** | Raised-hand Yumi → **no Yumi glyph** (correct). Covers = typeset cloth fallback (no external images; pre-sized 2:3 slots, spine fallback per the media-into-slots truth). Surface marks = reticle brackets + shelf glyph + teal dedupe tick. |
| **Text-registers** | serif (titles/covers) · body (actions/prose) · mono (eyebrows/meta/counts/evidence). Evidence `I read: '<spineText>'` in mono; **no underlined-link captions** (control canon). |
| **Seams** | Entry = the create-door's Scan chip (framing only — **no door built**, SCD-1). Review = draft-case dialect of the **shipped** carved cavity (SCD-3). Evidence needs `shelf-vision` spineText — **wiring is the BUILD-FIRST task, not the mockup**. Undo immediate (ERRATA-1). **No endpoint / state / schema / sw touched.** |

## STAGE 4 — FELT CARD (Preston's phone)

1. Open the live URL on **iPhone Safari** AND from the **installed PWA** (grant parity rides along).
2. Walk it: primer → allow → **warm-up feel** → Book **auto-fire snap** → card → Shelf **shutter** →
   **shimmer** → **tray fill** → **Review 3** walker (the **SECOND CLASS** specimen) → **Shelve 33** →
   **flight** → **Undo**.
3. Flip all four failure states from the dev strip — do they **FEEL different**?
4. Leave the page / switch apps — **DOES THE CAMERA INDICATOR DIE?** (SCE-1.)
5. Notch / home-indicator clearance; reduced-motion spot check if convenient.

### FIXTURE HONESTY NOTE
The raw 36-book Shot-2 JSON was **never committed** (only the distribution + named
specimens live in `scan-open-calibration.md`). The fixture here is a **faithful
reconstruction** of the published Shot-2 distribution (36 detected · 33 confident · 3
low-cut exceptions) using book titles named **publicly** in the committed calibration
doc, plus the marquee named specimens (SECOND CLASS→"Where We Stand"; the Black Beach
phantom; the All-About-Love re-catch). It is NOT the byte payload; it exists to make the
count line, the dedupe, and the walker evidence felt-true at cut={low}. No marginalia /
notes are quoted (privacy pin).

**STATUS: mockup COMPLETE, verified headless, awaiting Preston's felt pass. No push until his word.**
