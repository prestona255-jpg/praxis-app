# R-FIRSTSHELF — COVERS + WALKER VOICE checkpoint

STARTED. Base 93ee9a1 (v3.278). Model Opus 4.8, default effort.
Files expected: js/views.js + assets/components.css (+ sw.js bump at S6).
Evidence = rendered rig state / observed URLs, never source-read reasoning.
Privacy: counts / ids / titles only.

## S0 — GROUND TRUTH — PASS
HEAD 93ee9a1 == origin/main, tree clean (only pre-existing untracked drift).
CACHE_VERSION v3.278. Baselines (LF, CR=0): views.js 1,111,665 · components.css
876,811 · sw.js 6,041. All match Tier 1's shipped state.

## S1 — WHY COVERS ARE MISSING — DIAGNOSED (source-certain), fix designed

### The http mixed-content hypothesis is DISPROVEN (by existing code, cited)
The 3.10i work already normalizes http:// -> https:// at EVERY ingest/load site:
- integrations.js:1879-1881 (fetchGoogleBooks read) + its recommend twin ~1981
- integrations.js:2045 (googleBooksLargestCover) — the scan resolver's GB URLs
- state.js:3079-3103 (normalizeCoverUrlsToHttps) run by migrate() 1.9.1->1.9.2
  (state.js:3286) AND loadBooksFromFirestore 'found' branch.
OL URLs are already https. No http:// survives into any scan-path coverUrl.
Mixed content is NOT the mechanism here.

### The REAL cause — a DOCUMENTED-CONTRACT VIOLATION in the scan path (smoking gun)
integrations.js:2028-2030 states the design intent verbatim:
  "?default=false makes OL 404 (instead of returning a 1x1 blank) when it has no
   cover, so an <img> onerror can fall through to the Google Books image
   (coverCandidates[1])."
So the app DELIBERATELY makes OL 404 in order to trigger an onerror fall-through
to the GB cover. `buildSelfHealingCover` (views.js:7014) implements this walk on
EVERY surface (shelf 4992, book-detail 9621, home 1612, notebook 2006, review-row
7054) — OL fails -> try GB -> paint.

The scan path is the ONE exception. It never walks:
- volumeToBook (integrations.js:2159): coverUrl = candidates[0] = OL-by-ISBN
  (when ISBN present); coverCandidates = [OL, GB].
- scanClassify (views.js:8028): item.cover = rz.book.coverUrl (SINGLE OL URL);
  the candidate list survives ONLY on item.resolved.book.coverCandidates.
- scanCoverNode (views.js:8088-8102): img.onerror = hide the img -> typeset
  placeholder. NO candidate walk. OL 404 -> placeholder; GB (coverCandidates[1])
  NEVER tried. This renders the scan REVIEW draft-case (8871/8884/8947) + tray
  (8826) + walker step (8947) + barcode verdict (8503).
- scanShelve (views.js:9048) -> scanCommitBook (8590): persists coverUrl ONLY,
  not coverCandidates. So the SHELVED record also self-heals to just [OL] ->
  placeholder persists onto the shelf too.
- scanResolveStep (views.js:9019): a walker-picked candidate is stored with
  cover: cand.coverUrl only — candidates dropped there as well.

MATCHES THE SYMPTOM: a "confident" match => GB returned a volume (=> GB imageLinks
very likely present, coverCandidates[1] set), but the book's OL cover 404s (OL
lacks that ISBN's art) => scanCoverNode shows the placeholder without trying GB.
The FOUR that painted (Cannery Row, Body Keeps the Score, Pale-Faced Lie, Gender
Trouble) are books OL HAS covers for (candidate[0] loads). The TEN that failed are
OL-misses whose GB art was never reached.

### Empirical work attempted + its HONEST limits (per brief: "say so plainly")
- GB volumes API (real volume for a failing title): HTTP 429 everywhere, incl. via
  WebFetch's egress IP. The keyless quota is exhausted; could NOT obtain a live GB
  imageLinks payload to quote its scheme. (Brief option (a) unavailable.)
- Preston's stored coverUrl values for the 10 vs 4 (brief option (b)): egress to
  the live app / his Firestore is BLOCKED from this env; could NOT read the records.
- curl to any host = status 000 (no egress). WebFetch DOES reach OpenLibrary but the
  actual cover IMAGE download is blocked by the fetch proxy (307 -> localhost/block),
  and OL for one guessed ISBN (Thinking in Systems 9781603580557) returned 302 to a
  real archive.org cover — i.e. for THAT ISBN OL has art, underlining that the exact
  outcome is ISBN/edition-specific and only Preston's stored records settle it.
CONCLUSION: the decisive live evidence (stored coverUrl per book · live GB imageLinks)
is UNREACHABLE from here. But the diagnosis does NOT rest on it — it rests on the
source-certain contract violation above (the scan path omits the candidate-walk the
rest of the app performs, which the ?default=false design comment exists to enable).
This is a proven structural defect, not a guess.

### The fix (source-grounded, strictly non-regressing — a Pareto improvement)
Make the scan path walk coverCandidates (OL -> GB) exactly like buildSelfHealingCover:
1. scanCoverNode gains an optional candidates array; onerror advances through it and
   only hides the img (revealing the typeset cloth slot) once ALL are exhausted.
2. scanClassify carries coverCandidates onto each item (from rz.book.coverCandidates).
3. scanRenderReview / tray / walker pass item.coverCandidates to scanCoverNode.
4. scanResolveStep (walker-picked) carries cand.coverCandidates onto the promoted item.
5. scanShelve passes coverCandidates to scanCommitBook; scanCommitBook stores it.
   (CORRECTION, S5 red-team NOTE 2: ensureBookFields does NOT touch coverCandidates —
   legacy records are handled at RENDER time by buildSelfHealingCover, which falls back
   to [coverUrl] when coverCandidates is absent. No ensureBookFields change is needed.)
6. barcode scanShowVerdict passes book.coverCandidates too.
Cannot regress: candidate[0] (OL) still shows first when it loads; the walk only
adds tries when it FAILS. Whichever source has art wins; if NONE do, the typeset
placeholder still shows (honest fallback preserved — the "genuinely no art" answer).

RESIDUAL (named, not absorbed): books ALREADY shelved under the old bytes carry only
coverUrl (no coverCandidates) and cannot be reconstructed offline (GB URL isn't
stored; GB quota is zero) — they heal on re-scan or when GB quota returns
(fetchAndApplyCover retries). Go-forward scans carry candidates end-to-end.
OWNER CHECK (the decisive evidence I couldn't reach): console snippet for Preston to
dump stored cover data for the 10 vs 4 — recorded at S1-build close.

## S1–S4 BUILD + RIG PROOF (localhost:8797, uid d0tester, 390×734, force-settled, L19 hit-tested)

Files: js/views.js (+6,431 B) · assets/components.css (+2,408 B) · sw.js pending v3.279 bump (S6).
PARSE OK (cscript). ES3 clean (0 arrow, 0 const/let/class keyword; the lone diff backtick is
inside a // comment). Foundations MD5 unchanged (070679b0… / 772886c0…). CR=0 both files (no EOL flip).

### S1 — COVERS FIX — PASS (offline, deterministic; data-URI candidates need no egress)
scanCoverNode(title,author,coverUrl,candidates) now WALKS the list (OL->GB) on error, only
revealing the typeset slot when ALL are exhausted — matching buildSelfHealingCover. Candidates
threaded through scanClassify (item.coverCandidates), the review/tray/walker cover calls,
scanResolveStep (picked), scanShelve->scanCommitBook (persist), and the barcode scanShowVerdict.
- WalkToGB [BAD,GOOD]: cand0 errors -> WALKS to cand1 -> PAINTS ART (display:block, naturalW 1).
  This is the whole fix: the old single-URL node hid the img on the first error and showed the
  placeholder here, with the GB cover untried.
- LoadsFirst [GOOD]: paints (no regression on a currently-working cover).
- AllFail [BAD,BAD2]: img hidden -> typeset placeholder (honest fallback preserved).
- NoCands []: no img -> typeset placeholder (dead-code check: placeholder stays reachable).
- PERSISTENCE (real scanShelve of a [BAD,GOOD] item): committed record carries coverCandidates
  length 2 + status will-read -> the SHELF's buildSelfHealingCover self-heals OL->GB too.
  (Egress is blocked here so REAL OL/GB art cannot render on the rig; the walk MECHANISM is proven.
  Whether Preston's specific 10 titles paint is his live check — see OWNER CHECK below.)

### S2 — TRUNCATION — PASS (the caption, the S2 target)
Removed word-break:break-word from .scan-dc .cap .t + .scan-cov .cov-t; kept overflow-wrap:break-word.
Reconstructed visual lines (Range rects), 390 viewport:
- .cap .t (2-line clamp, the always-visible caption): "Data Independence" -> ["Data ",
  "Independence"] — CLEAN word-boundary wrap; the reported "Data Independen/ce" is FIXED.
  clientH=24 (2 lines) for all five; cap_hOverflow=false for all. Titles with a single word wider
  than 64px (Transformation, Accommodation) break ONLY that word, clamp ellipsis at 2 lines —
  exactly S2's spec ("break inside a word only when a single word cannot fit").
  Full rendered cap lines: Data Independence=[Data|Independence]; Ordinary Resurrections=[Ordinary|
  Resurrections]; Doorways to Transformation=[Doorways to|Transformatio|n](clamped to 2+ellipsis);
  The Accommodation=[The|Accommodati|on](clamped); America at War with Itself=[America at|War with|
  Itself](clamped).
- .cov-t (typeset cover, ~47px inner, 4-line clamp): shown ONLY when no art loads. "Independence"
  cannot fit ~47px so overflow-wrap:break-word breaks it (spec-compliant: single word cannot fit),
  and this surface is largely moot post-S1 (real art paints over it). Reported honestly, not a
  regression — no word-break greedy pack remains.

### S3 — WALKER VOICE — PASS (register + glyph ONLY, zero model calls)
- Yumi ASKS: .scan-wk-ask = shared yumiGlyphNode (glyph host + SVG; yumiGlyph is the single source,
  confirmed) + serif "Is this the one?". The mono "Best guess" log-label is GONE.
- Guess: title + author; warm fallbacks ("I couldn't quite read this one" / "author I couldn't
  make out") replace "Unclear" / "author unclear".
- Evidence: the raw spine read is KEPT verbatim (honesty the brief protects) — "What I could read
  on the spine: “…”" — re-registered to --ink-2 (rgb 100,89,64), NOT the orange --danger.
- Accept OUTWEIGHS refusals: gold gradient, 354px full-width, 15px ("Yes — that's the one") vs the
  three refusals as quiet 12.5px transparent text-buttons (Not a book · Skip for now · Skip the
  rest (N)), grouped, 44px tap targets. Uncertainty PRESERVED — all three exits present + raw read
  shown. network_calls_during_render = 0.
- Candidates header "Or did I mean —"; search "Look it up on the Shelf".
- Accept hit-tested (L19): elementFromPoint = the accept; click promotes exception->confident
  carrying coverCandidates length 2 (persistence intact through the walker path).

### S4 — DONE SCREEN — PASS
Composed per shelf-look grammar (quiet, centered, light ground) — no new dialect:
- .scan-rv-wrap.is-done = flex column; the done block grows + centers. Children constrained
  flex:0 0 auto (the primary .scan-btn base carries flex:1 and was stretching to 449px, which
  un-centered the cluster — caught + fixed on the rig). Result: a 229px cluster (mark -> line ->
  View-your-shelf -> Undo), balanced 268px above / 236px below, centered within 50px of the
  viewport middle. Previously the content sat in the top quarter with ~1000px empty below.
- Undo is LEGIBLE + co-located: a 13px quiet text-button beneath the primary, 44px tap target,
  "Undo — put them back". Hit-tested (L19): removes the shelved books (lib 1->0), then hides itself
  and flips the line to "None of these were added to your shelf." (honest post-undo).
- The bottom-edge FLOATING TOAST is SUPPRESSED in the everything-shelved case (its confirmation +
  Undo now live in the centered done door). PARTIAL shelve (exceptions remain) STILL shows the
  toast ("Shelved 1") — regression check PASS.
- Undo-window PERSISTENCE: previously the ONLY Undo was the 9s toast (borderline discoverable). Now
  the done-door Undo persists with the screen (until "View your shelf →" or back-to-camera) —
  effectively unbounded while the done state shows, and the 9s auto-clear is not armed in the empty
  case. The transient toast (partial case) is unchanged at 9s.

### SMOKE (views.js + shared CSS mandated) — PASS
Shelf (.shelf, 8,191) · Arcs (present, 826) · Notebook (present, 2,396) — all render, none missing.
buildSelfHealingCover still walks candidates (cross-surface S1 consistency intact). Console errors
are ALL environmental (SW register, camera "device not found", openlibrary CORS on the seed
workspace's cover fetch — which itself corroborates the OL egress story) — none from app code.

## NEW / CHANGED USER-FACING STRINGS (D5 — Preston's to revise; all provisional)
S3 walker:
1. "Is this the one?" — NEW Yumi-ask header (replaces the "Best guess" mono log-label).
2. "I couldn't quite read this one" — guess-title fallback (was "Unclear").
3. "author I couldn't make out" — guess-author fallback (was "author unclear").
4. "What I could read on the spine:" — evidence lead (was "I read:").
5. raw spine quote now in curly quotes “…” at --ink-2 (was single quotes at --danger orange).
6. "Yes — that's the one" — primary accept (was "Add to ready-to-shelve").
7. "Or did I mean —" — candidates header (was "or did you mean").
8. "Look it up on the Shelf" — search (was "Search on the Shelf instead").
9. "Skip the rest (N)" — was "Skip all N remaining"; now grouped quietly with Not a book / Skip for now.
S4 done:
10. "Undo — put them back" — NEW legible done-door Undo (the toast's "Undo" is unchanged, partial case).
(The done-line copy "Everything from this scan is on your shelf." / "None of these were added to
your shelf." is UNCHANGED from Tier 1; the latter now also renders after an Undo.)

## RESIDUALS (named, not absorbed)
- R1 — Books ALREADY shelved under the pre-fix bytes carry only coverUrl (no coverCandidates) and
  cannot be reconstructed offline (GB URL is not stored; GB quota=0). They heal on re-scan or when
  GB quota returns (fetchAndApplyCover). Go-forward scans carry candidates end-to-end.
- R2 — .cov-t breaks a single word wider than its ~47px box (spec-compliant; mostly hidden by real
  art post-S1). Not fixed (would need a font/box change, out of scope).
- R3 — Post-undo done-line reuses the "None of these were added" copy (accurate about END state,
  slightly action-past in phrasing). Provisional (D5); the stale-line-after-toast-undo bug that
  PRE-EXISTED is now also corrected by the re-render.

## OWNER CHECK (the decisive evidence unreachable from this env — Preston's live console)
On praxis-reading.netlify.app, signed into the test account, run in DevTools to dump the stored
cover data for the failures vs successes (privacy: ids/titles/scheme only):
  Object.keys(state.books).map(function(k){var b=state.books[k];return {t:b.title,
    coverUrl:(b.coverUrl||'').slice(0,60), cands:(b.coverCandidates||[]).length};});
Expect the 10 failures to show a single OL coverUrl (covers.openlibrary.org …?default=false) with
cands<=1, and the 4 successes an OL url OL actually has. After this ship, re-scanning any of the 10
should paint real GB art in the review (the walk) and persist cands=2.

## S5 — RED-TEAM GATE (fix-red-team, Sonnet, fresh context) — 1 BLOCK + 3 NOTES

The Sonnet red-team independently re-derived byte deltas (+6,431/+2,408 pre-fix), parse
(harness self-check confirmed non-trivial), ES3, foundations MD5, the coverUrl===coverCandidates[0]
invariant, zero network on the walker, and the uncertainty-preservation — all clean. Findings:

- **BLOCK 1 (FIXED + rig-verified):** the denied/offline ISBN door (scanWireIsbnDoor, views.js
  ~8682, wired at scan-denied-isbn-add + scan-offline-isbn-add) is a scan-commit site too and
  committed WITHOUT threading coverCandidates — reproducing the diagnosed bug for camera-off adds.
  It was the same site the PRIOR fix enumerated (walker-build.md S2 "ISBN door 8652"); my S1 scope
  enumeration missed it. **Fix:** thread b.coverCandidates (b comes from resolveBook/volumeToBook)
  into the scanCommitBook spec, same one-line pattern as the barcode verdict. Rig-verified on a
  fresh origin (8801): scanWireIsbnDoor now contains 'coverCandidates: bCands'; scanCommitBook
  stores length 2. views.js final delta +6,914 B (from +6,431). PARSE OK, ES3 clean, CR=0.
- **NOTE 2 (FIXED, doc):** the checkpoint's S1 fix step 5 wrongly claimed "ensureBookFields backfills
  coverCandidates:[]". ensureBookFields (state.js:387-427) does NOT touch coverCandidates; legacy
  records are handled at RENDER by buildSelfHealingCover's [coverUrl] fallback. Corrected above.
- **NOTE 3 (residual, advisory — not fixed):** scanShowReceipt's toast-suppress-on-empty branch
  reads scanResult at the moment the ~600-900ms scanShelveFlight callback fires. If the user starts
  a NEW scan pass inside that window (resetting scanResult), reviewEmpty could evaluate off the new
  empty state and drop the previous shelve's confirmation. Narrow, no data loss (books are already
  committed), pre-existing-adjacent (the flight callback timing existed before). Documented, not
  blocked.
- **NOTE 4 (residual, advisory — not fixed):** .scan-rv-wrap.is-done sits on the base rule (no
  media query), so it also applies at desktop widths; rig proof is at 390×734 only. Low risk (the
  camera-capture flow is practically mobile-only), but the desktop width of the done state is
  unverified per OWNER-VIEWPORT PRIMACY. Flag for Preston's felt pass if desktop scan matters.

RED-TEAM verdict: do-not-self-drive; BLOCK 1 returned to the build. BLOCK 1 is now CLOSED
(rig-verified); NOTE 2 corrected; NOTES 3+4 carried as named residuals. Proceeding to S6 (local
commit + HALT for the push word).
