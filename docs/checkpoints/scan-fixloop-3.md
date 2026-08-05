# SCAN — FIX LOOP 3 (FX-I blur · FX-J candidate junk · FX-K invented books) · Opus 4.8

STARTED. Round STAYS OPEN. Commit-per-slice LOCAL, ONE cache bump at end (v3.267→v3.268), NO push.

Model pin: Opus 4.8, default effort. Reading list read (CLAUDE.md, lessons.md, triage spec).

## STAGE 0 — STATE + CITE RE-VERIFY
Ground: HEAD `30cd777` == origin/main == local (git fetch); tracked tree clean.
CACHE_VERSION live = praxis-v3.267 (sw.js). Foundations byte-locked (verify at halt).

Triage line cites — ALL HOLD (clean tree = triage's tree):
| cite | resolves to | status |
|---|---|---|
| views.js:8088 | getUserMedia({facingMode env}) in scanStartStream | HOLDS |
| views.js:8125 | function scanEnsureDisplay | HOLDS |
| views.js:8130 | re-attach `v.srcObject = scanStream` (FX-G) | HOLDS |
| views.js:8291 | zxing decodeFromConstraints (S2 open) | HOLDS |
| views.js:8304 | scanZxingReader.reset() (scanStopBookDecode) | HOLDS |
| views.js:8558 | function scanCaptureBase64 | HOLDS |
| integrations.js:2120 | periodical down-rank regex | HOLDS |
| integrations.js:2348 | `var q = 'intitle:' + qTitle;` | HOLDS |
| integrations.js:2362 | alternates loop (`< 5`) | HOLDS |
| views.js:7900 | function scanTitleCorroborates | HOLDS |
| shelf-vision.js:158 | var extractionPrompt (158-186) | HOLDS |

## FX-I — F6 fresh high-res Shelf acquisition (views.js)

### PAYLOAD GATE (step 4) — NO capture-path edit needed
`scanCaptureBase64` (views.js:8558) already downscales to `maxDim = 1600` (longest side) +
JPEG q0.82 BEFORE base64, so a 2560-wide source is capped to <=1600px. Endpoint limit
`MAX_IMAGE_B64_CHARS = 7,500,000` (shelf-vision.js:44). Worst-case math:
- 2560x1440 source -> scale 0.625 -> 1600x900 canvas; dense JPEG q0.82 ~0.4-1.5 MB binary
  -> base64 ~0.5-2.0M chars << 7.5M. Portrait 1440x2560 -> 900x1600, same order. PASS.
The path does NOT send full-res -> capture sharp, send what the endpoint already expects.

### Design (mode-aware acquisition; scanCamReady discriminates setup vs live switch)
- `scanStreamConstraints()` — Shelf => width/height ideal 2560x1440; Book => default (untouched).
- `scanSetMode`: on a GENUINE live switch (`scanCamReady` true) re-acquire per mode —
  Shelf => `scanAcquireShelf` (stop ALL first, then fresh hi-res); Book => `scanStopStream`
  then FX-G `scanEnsureDisplay` (re-warm fresh book stream; no hi-res orphan into Book).
  Initial entry setup (`scanCamReady` false) keeps FX-G's `scanEnsureDisplay` UNTOUCHED.
- `scanAcquireShelf()` — overlay-guarded; `scanStopStream()` (FX-A teardown, FORK-β stop-before-open)
  then warm + fresh `scanStartStream` (hi-res via scanMode).

### FX-I verification (rig localhost:8791, seed d0tester; camera absent)
| gate | result |
|---|---|
| parse-check views.js (cscript) | **PARSE OK** |
| ES3 forbidden tokens in added CODE lines (=>/const/let/class/backtick) | **0** |
| helpers defined (scanStreamConstraints/scanAcquireShelf/scanSetMode) | **function/function/function** |
| Shelf constraints | `{video:{facingMode:{ideal:environment},width:{ideal:2560},height:{ideal:1440}},audio:false}` |
| Book constraints (untouched) | `{video:{facingMode:{ideal:environment}},audio:false}` |
| #scan surface + video mount; primer OPEN at entry; scanCamReady FALSE at entry | **PASS** (FX-I did NOT fire getUserMedia before the SC7 primer) |
| fresh-entry switches (scanCamReady false → else scanEnsureDisplay) no-throw | **PASS** (Shelf title=Shelf, Book title=Book) |
| live-switch Book→Shelf → scanAcquireShelf reached | **no-throw** |
| live-switch Shelf→Book → scanStopStream+scanEnsureDisplay reached | **no-throw** |
| console error CLASS vs BASELINE (git-stash A/B on the rig) | **IDENTICAL** — baseline v3.267 emits the same 404s + "Uncaught NotFoundError: Requested device not found" (getUserMedia on a camera-less rig, from FX-G's entry path). **No NEW error class from FX-I.** |

### STOP-BEFORE-OPEN enumeration (both directions — every stream-open preceded by a stop)
| path | open | preceding stop |
|---|---|---|
| Book→Shelf switch (live) | scanAcquireShelf → scanStartStream(hi-res) | **scanStopStream()** (in scanAcquireShelf, before start) |
| Shelf→Book switch (live) | scanEnsureDisplay re-warm + trailing scanStartBookDecode (zxing S2) | **scanStopStream()** (in scanSetMode book branch, before both) — hi-res shelf stream stopped before any Book open |
| fresh Shelf entry | primer→scanGrantAndWarm→scanStartStream(hi-res) | first acquisition (no prior live stream in scope) |
| fresh Book entry | primer→scanGrantAndWarm→scanStartStream(default) | first acquisition |
| scanEnsureDisplay re-warm (visibilitychange/dead) | scanStartStream | only fires when scanStream is DEAD (nothing live to stop) |
zxing S2 (scanStartBookDecode) only ever opens in Book mode; the only path INTO Book with a
live hi-res Shelf stream is the Shelf→Book switch, which scanStopStream()s first ⇒ **no hi-res
orphan into Book** (FORK-β satisfied on both platforms).
Device-owed: the actual SHARPNESS after the switch (rig has no camera) — round-3 felt card.

## FX-J — F7 candidate plausibility floor + widened regex (integrations.js + views.js)

### Change
- integrations.js: `candidateIsPeriodical(text)` (widened list adds review/reviews/reports/
  lectures/commissioner/cases to the original + vol./no. markers) — now SHARED by
  `scoreVolume` (replaced the inline regex at old :2120, so ranking widens too) and the floor.
- integrations.js: `candidateIsPlausible(detectedTitle, book)` — a shown "did you mean"
  candidate must have an ISBN, not be a periodical/scan artifact, not be pre-1900, and clear
  `titleCloseness >= 0.5` with the read fragment. (`book` = normalized volumeToBook record.)
- views.js `scanRenderWalkerStep`: filters `b.alternates` through `candidateIsPlausible`;
  >0 survivors -> "Did you mean" + the plausible buttons; 0 survivors -> honest "No confident
  match" header + only the existing "Search on the Shelf instead" (Law 3, wired not invented).

### FX-J verification
| gate | result |
|---|---|
| parse-check integrations.js + views.js | **PARSE OK** (both) |
| ES3 forbidden tokens in added code | **0** |
| helpers defined once, shared (scoreVolume + walker) | **PASS** (grep) |
| FIXTURE HARNESS (rig pane, live functions; `scratchpad/fxj-floor-fixtures.js`) | **PASS** |

FIXTURE OUTPUT (verbatim, detected "THE ESSENTIAL"):
- junk WITHHELD (plausible:false) — Texas Criminal Reports (periodical:true, close 0.25) ·
  Lectures…Two Complex Variables (periodical:true, close 0.09) · Report of the Commissioner
  of Agriculture (periodical:true, close 0.17) · The Fortnightly Review (periodical:true, close 0.33).
- real SURVIVE (plausible:true, close 0.85 via containment) — The Essential Rumi · The
  Essential Kierkegaard · The Essential Gandhi.
- gate probes (fail-ability / independence): "The Fortnightly Review" WITH a fake ISBN still
  withheld (regex gate); a 1871 book WITH a fake ISBN still withheld (era gate) — floor is not
  ISBN-only. VERDICT **PASS** (0 fails).
- Sharpie probe: candidateIsPlausible('Sharpie', 'Stolen Sharpie Revolution' + ISBN) = **true**
  (0.85 containment) — the floor does NOT catch this; **FX-K owns it upstream** (Sharpie must
  never be emitted as a book). Reported per plan.

### WALKER DOM PROOF (rig pane; L19 — rendered, not just the function)
Seeded scanResult with two exceptions, opened `scanOpenWalker`:
- exception[0] junk-only alternates -> header **"No confident match"**, **0 cand buttons**,
  Search present. (honest no-match)
- exception[1] mixed alternates -> header **"Did you mean"**, **1 cand button "The Essential
  Rumi"** (the plausible one); "The Fortnightly Review" WITHHELD from the same list; Search present.
- console error class vs rig baseline: IDENTICAL (404s + camera-less device-not-found); no NEW error.

### Might wrongly exclude (reported per plan)
- A real edition that legitimately lacks an ISBN in Google Books (rare for modern trade books)
  is withheld from the "did you mean" list — the walker still routes to "Search on the Shelf".
- A real book whose title contains a widened keyword ("review"/"reports"/"cases") is withheld
  (e.g. a title literally "… Review"). Ruled acceptable (Law 3 favors silence; Search remains).
The plausibility floor is DISPLAY-ONLY (walker candidate list); `scanIsException` /
`scanGbNoMatch` corroboration LOGIC is unchanged (it still reads the full `alternates` via
`titleCloseness`, no floor applied). The one ranking-side effect is intentional and ruled: the
widened `candidateIsPeriodical` is shared with `scoreVolume`, so a periodical/scan artifact is
now down-ranked harder in the resolver's TOP pick too — it can only improve which volume wins
`top` vs `alternates`, never demote a real book (real books carry none of the added keywords).

## FX-K — F8 book-ness gate in the vision prompt (shelf-vision.js, PROMPT-ONLY)

### Change (two prose blocks; schema/format byte-identical)
- Opening prose rewritten book-ness FIRST: defines a book (bound codex, spine, title+usually
  author), makes book-ness the primary test and legibility secondary, and lists text-bearing
  NON-books to OMIT — generalized (marker/pen, box/carton, package, jar/bottle, retail/brand
  label, textile/garment, card, sign, decoration) with Preston's three as illustrations
  ("Sharpie"/"FLUX"/"SCARVES" are objects, not books). Adds the silence clause: "If you are
  unsure whether an object is a book, OMIT it." Non-book-reported-as-book joined to the
  serious-error line.
- The weak line ("non-book objects (speakers, frames, plants, decor) -- ignore them entirely")
  replaced with a reinforcement covering decorative AND text-bearing objects + "when in doubt,
  leave it out."

### PARSE-CONTRACT GATE (step 10)
| check | result |
|---|---|
| diff hunks | **2, prose-only** (lines 159-171 opening; 182-183 weak line) |
| contract lines in diff (four-fields intro / field defs / JSON format / no-fences) | **0** (byte-identical) |
| 4 schema keys present post-edit (title/author/spineText/confidence) | **all present** |
| JSON-format line intact | **1** |
| non-string (model/token/param/parser) lines changed | **0** (prose-only) |
| client parser untouched (scanShelfVision reads json.books) | **PASS** (views.js:7855 unchanged; FX-K = shelf-vision.js only) |
| model/max_tokens/temperature/allow-list/coercion (lines outside the prompt) | **unchanged** (0 non-string diff lines) |
| syntax validity (node blocked, cscript rejects async → block eval'd in the pane) | **VALID** — extractionPrompt evaluates to a 2698-char string; BOOK def + "OMIT it" + 3 examples + intact contract all confirmed by substring probe |

Honesty rail: shelf-vision BEHAVIOR (does Opus now omit the objects?) is VISION-RAIL, device-owed
— verified only by the round-3 sanctioned opus shelf shot (felt card). No vision call made here.

### HOOK POSTURE for shelf-vision.js
The pre-commit hook counts `netlify/functions/shelf-vision.js` as "served source", so it BLOCKS
(source staged without sw.js) — same as any code slice. Per the loop-1/2 precedent FX-K is the
FINAL code slice, so it CARRIES the single v3.268 bump + this checkpoint and goes through the
hook NORMALLY (source + sw.js together). FX-I and FX-J were the interim slices → `--no-verify`
with the dry-run recorded below. (No other reason for `--no-verify`; no `--amend`.)

## HOOK DRY-RUN RECORDS (interim slices, bump deferred)
- **FX-I** (`git add js/views.js`): hook `BLOCK: source files staged without sw.js` (staged
  source: js/views.js), exit 1 — the ONLY block was the deferred sw.js. Committed `--no-verify`.
- **FX-J** (`git add js/integrations.js js/views.js`): hook `BLOCK: source without sw.js` +
  a `WARN` on a backtick inside a comment (`\`book\``) — reworded the comment off the trigger,
  re-staged → block was then sw.js-only. Committed `--no-verify`.
- **FX-K** (final): staged `netlify/functions/shelf-vision.js` + `sw.js` (v3.268) + this
  checkpoint → hook passes NORMALLY (source + sw.js). No `--no-verify`.

## COMMITS (all LOCAL — NO push)
| slice | commit | files | what |
|---|---|---|---|
| FX-I | `a5e6668` | js/views.js | fresh high-res Shelf acquisition |
| FX-J | `21ecfc3` | js/integrations.js, js/views.js | candidate plausibility floor |
| FX-K | (this) | netlify/functions/shelf-vision.js, sw.js, docs/checkpoints/scan-fixloop-3.md | book-ness gate + v3.268 bump + gate record |

## FOUNDATIONS (byte-locked; re-md5 at halt)
- `assets/lumen-amber.css` md5 `070679b0…` (14,966 B) — **unchanged**.
- `assets/marks.js` md5 `772886c0…` (10,255 B) — **unchanged**.
- Neither touched this loop. state.js / firestore.rules / theme.css untouched.

## CACHE_VERSION
Single bump `praxis-v3.267 → praxis-v3.268` (sw.js:10), riding FX-K (the final code slice).

## BYTE DELTAS (LF-normalized working tree)
| file | slice | note |
|---|---|---|
| js/views.js | FX-I + FX-J | +38/-3 (FX-I) then +18/-4 (FX-J walker filter) |
| js/integrations.js | FX-J | +46/-7 (2 helpers + scoreVolume refactor + backtick reword) |
| netlify/functions/shelf-vision.js | FX-K | +27/-15 (prose only; contract byte-identical) |
| sw.js | FX-K | version digit swap (equal length → +0 B) |

## BUILDER / SEQUENCE / BOARD — DEFERRED (round-close owns them; non-goal here)
Per the plan non-goals: no Builder regen, no sequence.md/BOARD.md edits — those ride the round
CLOSE after Preston's felt pass. This is a fix loop, round STAYS OPEN.

## HALT — NO PUSH. Commits are LOCAL (`a5e6668` · `21ecfc3` · FX-K). Preston's push word ships
v3.268; his felt round 3 is the round's next input.

## FELT CARD — SCAN round 3 (installed PWA + Safari, after push)
- [ ] **F6** — Shelf viewfinder is SHARP after a Book→Shelf switch (fresh high-res acquire,
  not the soft re-attach); the shelf shot it produces is sharp.
- [ ] **FX-A/FX-G not re-broken** — Book mode: camera light dies on nav-away/app-switch; no
  black viewfinder on Book↔Shelf; barcode decode still works.
- [ ] **F8** — ONE sanctioned opus shelf shot with a Sharpie + scarves (or a labelled box) in
  frame: the non-books are ABSENT from the tray / needs-a-look; the real books still land.
- [ ] **F7** — the walker on remaining partials shows plausible candidates OR the honest "No
  confident match — Search on the Shelf" — zero 1890s periodical/court-report junk.
- [ ] **Undo race (owed from round 2, prestonpraxistest)** — Shelve → instant Undo mid-sync →
  reload → zero resurrection.
- [ ] **FX-H** — the bottom pill stays hidden at rest; the receipt appears only on Shelve.
