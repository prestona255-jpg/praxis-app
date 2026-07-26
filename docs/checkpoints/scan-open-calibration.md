# SC12 — PRE-BUILD CALIBRATION PASS · **COMPLETE** (2026-07-25)

Model `claude-opus-4-8` via the live harness. 3 shots of Preston's real shelf,
107 detected books. GB arm run live against the deployed
`/.netlify/functions/google-books-proxy` (107 queries, 0 errors) using the harness
query shape (`intitle:<title>` + `inauthor:<author>` when present). Confidence
distribution parsed exactly from the pasted JSON (PowerShell ConvertFrom-Json).
Latency = **NOT CAPTURED** (calibration gap, re-measure in the build felt pass).

## SC6 predicate (ratified — BRIEF-ERRATA-2)
**exception ⇔ (Google Books no-match, `totalItems==0`) OR (confidence == low)**
Swept the confidence arm across `{low}` vs `{low, medium}`.

## Detection + confidence distribution (exact)

| shot | detected | high | medium | low | empty-author |
|------|---------:|-----:|-------:|----:|-------------:|
| 1    | 35       | 21   | 10     | 4   | 6            |
| 2    | 36       | 25   | 9      | 2   | 5            |
| 3    | 36       | 24   | 9      | 3   | 12           |
| **Σ** | **107** | **70** | **28** | **9** | **23** |

Combined: high **65.4%** · medium **26.2%** · low **8.4%** · empty-author **21.5%**.

## GB arm result (the decisive finding)
- **GB no-match = 1 / 107** — and it is a **FALSE no-match**: "Sylvia Wynter" queried
  `intitle:Sylvia Wynter inauthor:Katherine McKittrick, editor` → `totalItems=0`;
  the same title **title-only** → `totalItems=300`. A real, correctly-detected book
  the noisy `inauthor` (name + "editor") excluded.
- **GB corroborated 106/107**, including every wrong/phantom book: Kozol→a Kozol
  pamphlet (`totalItems=1`), "Second Class"→"Where We Stand" (`300`), phantom "Black
  Beach"→`300`. **GB's `totalItems>0` test contributes 0 useful exceptions** and its
  single firing is a false-positive on a correct book.

## Exception rate under each cut

| cut | exceptions | rate | GB-arm's marginal contribution |
|-----|-----------:|-----:|--------------------------------|
| **{low}**      | 10 / 107 | **9.3%**  | +1 (Sylvia Wynter, a false flag) |
| **{low, medium}** | 37 / 107 | **34.6%** | +0 (its one no-match is already medium) |

## Named-error inventory — specimen · confidence · GB · which cut catches

| pattern | specimen (shot) | conf | GB `totalItems` | {low} | {low,med} |
|---------|-----------------|------|-----------------|-------|-----------|
| **PLAUSIBLE-WRONG SUBSTITUTION** ⭐ | "Second Class" emitted as *Where We Stand: Class Matters* (S3) | low | 300 (corroborates the **wrong** book) | **CATCH** | CATCH |
| **FALSE-SPLIT** (phantom half) | Black Beach (S1) | low | 300 | **CATCH** | CATCH |
| **FALSE-SPLIT** (real half) | White Sand (S1) | medium | 300 | miss | **CATCH** |
| **FIELD-SWAP** | Kozol / Kozol (S2) | medium | 1 (wrong pamphlet) | miss | **CATCH** |
| **FALSE-GB-NO-MATCH** | Sylvia Wynter (S2) | medium | 0 → 300 title-only | CATCH* | CATCH |
| **EMPTY-AUTHOR** (23 rows) | e.g. Punished for Dreaming (S3) | mostly high | matches title-only | flagged only if low/med | — |
| **RECALL MISS** (~10–20%) | undetected spines | n/a | n/a | **un-catchable by any cut** |

\* Sylvia Wynter is a *correct* ID; {low} flags it only because of the noisy-author GB
no-match — a false exception the build removes by relaxing `inauthor` (below).

## RECOMMENDATION — cut = **{low}** (exception ⇔ confidence == low OR GB no-match)
**One sentence:** the single most dangerous specimen — the plausible-wrong "Second
Class" substitution that Google Books actively corroborates as a real (wrong) book —
landed at LOW confidence, so `{low}` catches it while holding the exception rate at a
one-tap-preserving **9.3%**, whereas escalating to `{low, medium}` triples the burden
to **34.6%** (≈27 correctly-identified medium books sent to the walker) to catch the
rarer medium-tier field-swap (Kozol) and phantom-half (White Sand) that the
now-immediate batch-Undo (ERRATA-1) and SCA3 tray/library dedupe already backstop.

**What {low} catches vs misses among the named errors:**
- CATCHES: the marquee plausible-wrong (Second Class), the phantom fake-half (Black
  Beach), + 7 other low rows.
- MISSES: Kozol field-swap (medium, GB-corroborated-wrong) and White Sand phantom
  real-half (medium) — both backstopped by immediate Undo + dedupe + the walker.

## Build notes falling out of calibration (for the build round, not this session)

1. **GB `totalItems>0` is too weak to be SC6's "independent anchor."** It corroborated
   106/107 including every wrong/phantom book. The build should make the GB arm
   **compare the top result's title/author to the detected title** (reuse
   `bookIdentityKey` / the normalized matcher, `js/views.js:7572`), not merely
   `totalItems>0`. As-wired the GB arm is inert-to-harmful.
2. **Author-noise fallback (Preston's build-note #3, confirmed + generalized).** Empty
   author OR noisy author (editor / PhD / "with X" / comma-lists) must fall back to a
   **title-only** GB query — the ONLY no-match in 107 flipped 0→300 when the noisy
   `inauthor` was dropped. Harness already title-only's empty authors; the build must
   ALSO strip/relax author noise before deciding no-match.
3. **Recall is the ceiling the cut cannot touch (~80–90%).** Preston's annotated misses:
   S1 ~34/35 distinct, S2 36/~44 (≈80%), S3 36/~40 (≈90%). The exception walker only
   operates on **detected** books; a spine never emitted never surfaces — so the surface
   must make "some books weren't seen — reshoot / add manually" a first-class affordance
   (SC8 EMPTY/TRUNCATED grammar + the ever-present ISBN/search door). No confidence cut
   recovers an undetected book.
4. **Latency re-measure** owed in the build felt pass (not captured here).

## Cross-shot / SCA3 identity-key edge cases (from Preston's annotations)
- **"All About Love" appears in ALL 3 shots.** S1 "all about love" + S2 "All About
  Love" → same `bookIdentityKey` (folds); S3 "All About Love: **New Visions**" → a
  DIFFERENT title/edition → separate key (correctly NOT folded). Preston genuinely owns
  multiple copies → **SCA3 dedupe must be a SOFT signal ("you may already own this"),
  never a hard auto-skip.** Real duplicates are legitimate.
- The substitution phantom "Where We Stand" (S3, empty author) vs the real one (S1,
  "bell hooks") get different keys → not folded, which is correct here (S3 is a
  mis-read of a different physical book).

## FELT-CARD ITEM 1 — ANSWERED (plain Safari tab, iPhone, screenshot-backed)
Recorded here (came in the SC12 package); the SCE-1 upgrade is mirrored into
`scan-open-recon.md`:
1. **iOS-Safari live `getUserMedia` grant = PROVEN on real hardware** — the SCAN
   viewfinder premise's hardware half is **GO**.
2. **LEGACY-SCANNER PRESENTATION BUG (pre-existing, NOT SCAN's to fix):**
   `openBarcodeScanner` acquires the stream but the video UI never presented (indicator
   lit, no picture). The new surface's felt card MUST assert a **visible first frame**.
3. **SCE-1 FIELD-CONFIRMED — upgraded predicted-gap → OBSERVED DEFECT:** the stream was
   never released after leaving the scanner (~5 min camera-on, screenshot-backed). The
   SCE-1 teardown (renderRoute-cleanup + visibilitychange) is now a fix for a *proven*
   leak, not a precaution.
- Also observed (legacy-surface ledger, SCAN replaces the journey): "Scan shelf" opens
  straight into the native camera (file-input path — matches recon item 4); the Shelf
  "+" FAB scrolls to the inline add form and collides with the capture sheet + keyboard;
  the capdoor "Scan a book" inert socket renders as built.
- **PWA-standalone pass still owed** — stakes downgraded to grant-parity-when-installed.

---
**SC12 = COMPLETE.** Recommended cut: **{low}** (9.3% exception rate). Endpoint
untouched (non-goal intact); all findings feed the build round.
