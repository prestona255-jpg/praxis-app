# R-ARC S6b — DETERMINISTIC MATCHER + LIBRARY INDEX — STARTED

Base `aa33a3e` / live v3.220. Wave C (Fable 5); build delegated to a supervised
Sonnet agent per Preston's ruling (2026-07-17) — the session owns the evidence.
Scope (plan Slice 6b): generalize matchBook's two-pass title/author logic +
normTitle from "one guess → one bookId" to "scan prose for every occurrence";
build the library index (none exists). Deterministic, local, no model call,
private. F-F ruled: authors light + link to the filtered shelf. Commit LOCAL,
HALT — no push (v3.220 felt-verdict hard gate).

## Stage 0 recon (verified anchors)

- `normTitle` = import-capture.js:166-172 (lowercase · punctuation→space ·
  collapse runs · trim; its own header mirrors yumi-brain.js:866 — the repo's
  established duplicate-with-pointer precedent for this normalization).
- `matchBook` = import-capture.js:191-225 (two-pass title→author, unique-wins,
  ambiguous→null; library source = `state.userBooks[uid].bookIds` →
  `state.books[bid]`, guarded via `getCurrentUser()`).
- `hasSharedToken` = import-capture.js:176-182 (≥4-char whole-word tokens).
- Exports: import-capture.js:1413-1417 exposes `matchBook` + `_normTitle`
  (underscore-private) — NOT reused across modules; recognition duplicates the
  3-line transform with a pointer comment (precedent above) and names the
  single-source hoist as debt.
- Load order: index.html:52-65; new file slots AFTER `/js/state.js` (:52) —
  call-time-only deps (`state`, `getCurrentUser`), available to every later
  consumer (views, import-capture, canvas surfaces).
- sw.js: `CACHE_VERSION = 'praxis-v3.220'` (:10); js precache list :22-34; new
  precache line after `/js/state.js` (:22). Baselines: sw.js 4,897 B ·
  index.html 6,989 B.
- No existing recognition code (grep `recognition|praxisRecog` js/ → only
  voice-input.js SpeechRecognition comments, unrelated).

## Design (Fable-owned; the agent builds to this spec)

New file `js/recognition.js`, ONE global `window.PraxisRecognition`, stateless
pure API (no hidden cache — consumers own index lifetime, F4-adjacent):
- `norm(s)` — normTitle-identical transform (pointer comment to
  import-capture.js:166 + yumi-brain.js:866).
- `buildIndex()` — current user's deduped library (matchBook's exact source
  chain); one term per book title (kind `title`) + author terms (kind `author`,
  full string; ALSO split on `;`, `&`, ` and ` — never comma: "hooks, bell"
  inversion is F-F follow-on territory). Terms dedupe to
  `{ term, kind, bookIds[] }` (same-title books collect ids). **Term floor:
  normalized length ≥ 4** (deterministic guard against "it"-class bombs; named
  design decision, felt-retunable).
- `scan(index, text)` — normalized-haystack search with an OFFSET MAP back to
  raw text (normalization is length-changing: punct→space, collapsed runs; map
  records the raw index of every normalized char; match start = map[nStart],
  end = map[nStart+len-1]+1 so trailing raw punctuation stays outside the
  span). Whole-word boundaries in normalized space (single-space haystack
  guarantees them). **Longest-term-first, non-overlapping** (occupancy check).
  Returns `[{ start, end, kind, bookIds, term }]` in raw offsets, sorted by
  start. Zero DOM, zero network, zero writes (T10 trivially clean).

## Band declaration (two figures, FIX-PROTOCOL §3)

| File | CODE band (hard) | COMMENT allowance (soft) |
|---|---|---|
| js/recognition.js (new) | **2,048–4,096 B logic** | ≤1,800 B |
| index.html | **+40–80 B** (one script line) | — |
| sw.js | precache line **+25–45 B**; version bump ±0 (equal-length string) | — |

No other tracked file. state.js untouched (no schema — T3 n/a). Rider per
Preston's ruling: `.claude/rig/spike-caret.html` (the S6a harness) RIDES this
slice's sw-bump commit. Greps to prove: `seed` 0 in new file (T4) ·
`innerHTML` 0 (T10) · ES3 tokens 0 · exactly 1 `window.PraxisRecognition`
assignment. Parse: cscript parse-check. CACHE_VERSION → v3.221.

## Build + self-verify (supervised Sonnet build; session-owned evidence)

Builder delivered to spec with two disclosed cosmetic deviations (comment prose
reworded to keep ES3-token greps literally 0; one comment-trim pass). Both
accepted. **Supervision catch (session, Fable):** the scanner's classifier
appended `ch.toLowerCase()` whole (can be multi-char for exotic input, e.g.
İ→i̇) while pushing ONE map entry — a latent offset desync for all text after.
Patched: lowercase first, then classify each RESULTING char (norm()'s own
order), map entry per emitted char. Proven live (below). Comment trim ×2
brought the soft figure back under its ceiling after the patch.

| Gate | Result |
|---|---|
| Parse (`cscript //nologo //E:jscript tools/parse-check js/recognition.js`) | **PARSE OK, exit 0** (independently re-run post-patch) |
| recognition.js bands (awk line-classified) | **logic 4,020 B** (hard 2,048–4,096 ✓, 76 B headroom) · **comment 1,769 B** (soft ≤1,800 ✓) · blank 14 · total 5,803 |
| index.html | 6,989 → 7,033 B = **+44 B** (band +40–80 ✓); 1 script line after /js/state.js |
| sw.js | 4,897 → 4,922 B = **+25 B** (band +25–45 ✓); precache line + `CACHE_VERSION 'praxis-v3.221'` (±0 version string) |
| Greps | innerHTML 0 · seed 0 (case-insensitive) · const/let/arrow/class/backtick 0 · `window.PraxisRecognition` = 1 · precache entry 1 · script tag 1 |
| EOL | index.html/sw.js `i/lf w/crlf` (normal), diffstat surgical (1+ / 3±) — no flip; recognition.js pure LF (CR count 0) |
| Scope | `git status` intended files only: M index.html · M sw.js · ?? js/recognition.js (+ pre-existing clutter untouched) |
| Norm equivalence | builder's cscript proof: classifier output === norm() over 5 fixtures incl. em-dash + all-punctuation + empty — ALL PASS |

## Rig live-verify (the real module, served at :8931, driven in the pane)

Fixture: 7 books incl. same-title pair (b1/b4), floor-length title (`Care`),
sub-length title (`It`), nested title (`Pedagogy` ⊂ `Pedagogy of the
Oppressed`), multi-author string (`bell hooks & Cornel West`). Index:
**12 terms** — `It` correctly floored out, `the enclosed garden` deduped to
`bookIds [b1,b4]`, authors split on `&`.

Scan of a punctuated/case-mangled/newline prose — **8/8 matches, every raw
span byte-exact** (`substring(start,end)` equality):
`THE ENCLOSED   GARDEN` (case+collapsed-run mapping; comma outside; ids b1+b4)
· `Pedagogy of the Oppressed` (! outside; **longest-wins** — no nested
`pedagogy` double-light) · `Beloved` (**`Belovedness` stayed dark** — boundary)
· `bell hooks` + `Cornel West` (split terms; `;` outside) · `Stephen King`
(curly-apostrophe boundary: `’s` outside) · standalone `Pedagogy` lit at its
own site · `care` (floor boundary case, `?` outside). `It stays unlit` — dark ✓.
Edges: **Unicode desync probe** — `İstanbul reading, again: Beloved.` →
match slice === `Beloved` exactly (multi-char lowercase upstream; the patch's
live proof) · empty index scan 0 · empty text 0 · null text 0 · signed-out
`buildIndex()` → 0 terms.

## Named residuals (design decisions, felt-retunable)

- R1 — term floor 4: 1–3-char titles never light (e.g. "It"). Deterministic
  guard against common-word bombs; revisit only on felt evidence.
- R2 — common-WORD 4+ titles ("Care") light aggressively; the Slice 8
  dismissal store (F-D: remembered) is the ruled remedy, not a stoplist.
- R3 — author matching is full-name (post-split) only; surname-only and
  "hooks, bell" inversion = F-F follow-on (named at close-out).
- R4 — normalization now lives in 3 places (yumi-brain titleToId :897 ·
  import-capture normTitle :166 · recognition norm), all pointer-commented;
  single-source hoist = named debt. *(Reviewer nit: the repo-wide `:866`
  citation for titleToId is stale — actual :897; corrected byte-neutrally in
  recognition.js; import-capture.js:164's own copy of the stale number is
  pre-existing and untouched here.)*
- R5 — matches spanning inline-format boundaries in DECORATED text are 6c/7's
  concern (the spike's per-text-node law); scan() itself is plain-text and
  unaffected.
- R6 *(red-team HOLD 1)* — if one book's TITLE and another book's AUTHOR
  normalize to the identical string (equal length by construction), the two
  same-length index entries tie in the longest-first sort and the winning
  `kind` for a shared span falls to library insertion order — deterministic
  for a fixed library, but order-dependent. Cosmetic (both entries still
  carry correct bookIds); a kind tie-break rule can land with 6c's display
  work if the felt pass ever surfaces it.
- R7 *(red-team HOLD 2)* — **THIS SLICE SHIPS DARK: zero call sites.**
  `grep -rn PraxisRecognition` = the module + this doc only. The script tag +
  SW precache entry are real bytes on every load for zero behavioral change
  until 6c wires the first consumer. Named deliberately: the module is 6c/7's
  dependency, landed first so its gates are its own.
- Sort-stability note *(red-team NOTE)* — `terms.sort`/`results.sort` rely on
  comparator-tie stability (spec since ES2019; de-facto in all engines Praxis
  ships to). Recorded HERE rather than as a file comment — the comment
  allowance sits at 1,769/1,800 B and a NOTE-tier nit does not justify
  re-breaching a just-cleared band.
