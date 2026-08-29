# COVERS-DIAGNOSIS — scan covers only ever tried the OpenLibrary url

Session 2026-08-29 · base `1fe7cfc` / v3.281 · ships v3.282 (fix) + v3.283 (dead code)
Stage-0 recon: `docs/checkpoints/covers-diagnosis-recon.md`

## The report

Preston, live shelf scan, iPhone Safari, v3.279: **"22 found · 20 confident"**, of which
**8 painted real cover art and 12 fell back to the typographic placeholder.** The failure
set was NOT sorted by obscurity — mass-market in-print titles (Karr, Helen Fisher, Melanie
Mitchell, Jefferson Fisher) failed while narrow academic titles (Ordinary Affects, Zombie
Politics, Predatory Culture) succeeded. The prior round diagnosed mixed content and shipped
an https rewrite, moving 4/14 (29%) → 8/20 (40%): a real but small gain, the signature of a
genuine contributing factor fixed while the dominant cause stood.

## The cause

`scanResolveAndFill` (views.js:8784) is the **only live scan resolve path**. Proven chain to
a real gesture:

    shutter click  (addEventListener, views.js:8282)  -> scanFireShelfShot (8772)
    file / drop    (views.js 8659, 8661)              -> scanShelfFromFile (8663)
                             both -> scanRunShelfVision -> scanResolveAndFill (8784)

Its item literal set `cover` but **never `coverCandidates`**. The four `scanCoverNode` call
sites — tray 8842, review confident 8887, review exceptions 8900, walker 8992 — therefore
received `undefined`, and `scanCoverNode`'s own fallback collapsed the walk to a **single
url**. That url is `coverCandidates[0]`, which `volumeToBook` (integrations.js:2174-2177)
sets to the **OpenLibrary-by-ISBN** cover whenever an ISBN exists. The Google Books art sat
unused in `coverCandidates[1]`.

So a confident match painted real art **iff OpenLibrary happened to hold a cover for that
exact ISBN** — uncorrelated with how findable the book is in the world. That is the observed
shape, and 8/20 is an OpenLibrary per-ISBN hit rate, not a matcher-quality signal.

### Why the v3.279 fix did not take

S1 of v3.279 built the candidate walk into `scanCoverNode` correctly, and threaded
`coverCandidates` onto an item literal — **in `scanClassify` (views.js:8016), a function with
zero call sites since birth at v3.260.** `grep -c 'scanClassify' js/views.js` == 2 (definition
+ one stale comment); `git log -S 'scanClassify('` returns exactly one commit, `71c0bcf`, where
the single occurrence appeared — the count never rose, so it never had a caller. The line was
real, the comment was accurate, the parse gate was green, and no device ever changed behavior.
Filed as a standing verification invariant in CLAUDE.md (§ Verification — non-negotiable).

## Mechanism proof — headless, no network, verbatim bytes

Rig: `.claude/rig/serve.ps1` on :8791 (serves the repo root; a real 404 for a missing path —
exactly OpenLibrary's `?default=false` miss). Fixtures: a real 631-byte 1x1 JPEG (200) and two
absent paths (404). The harness ran **`scanCoverNode` extracted verbatim** from the tree,
`md5 894c5388cd9ec8f5bac044ec56ffffe5`, unchanged by either commit. Observation is at the DOM
boundary only: `document.createElement` is wrapped so each `<img>` gets an instrumented `src`
setter that records the assignment then forwards to the native one. Source untouched.
Geometry taken at the real call-site size (64x96).

| | attempted urls, in order | count | img | typeset slot |
|---|---|---|---|---|
| **P1** candidates ABSENT | `ol-miss…?default=false` | **1** | `display:none`, 0x0, natural 0x0 | 64x96 visible |
| **P2** candidates PRESENT `[OL miss, GB hit]` | `ol-miss…`, then `gb-hit…` | **2** | `display:block`, **64x96**, natural 1x1, complete | 64x96 (behind) |
| **P3** candidates PRESENT, both miss | `ol-miss…`, then `gb-miss…` | **2** | `display:none`, 0x0 — no broken-image icon | 64x96 visible |

Network layer corroborates: `performance.getEntriesByType('resource')` → OL miss **404**,
GB hit **200**, GB miss **404**. Console: exactly the 2 intentional 404s, no script errors.

**P2 is the load-bearing one** — the inline walk really does advance to index 1. So the defect
is a missing key, not a broken walk, and the fix is one assignment.

### P4 — the patched bytes, end to end

Verbatim `openLibraryIsbnCover` + `googleBooksLargestCover` + `volumeIsbn` + `volumeToBook`
(integrations.js 2031-34, 2038-51, 2054-60, 2159-84) driven on a realistic Google Books
`volumeInfo`, feeding the verbatim **patched** item literal, feeding verbatim `scanCoverNode`:

- **P4a** `volumeToBook` → `candidates.length` 2; `[0]` is `covers.openlibrary.org/...`,
  `[1]` is `books.google.com/...` (https-normalized, `&edge=curl` stripped); `coverUrl` == `[0]`.
  This is the direct measurement of "the stored url is OpenLibrary."
- **P4b** patched literal → `hasOwnProperty('coverCandidates')` true, length **2**.
- **P4c** control, no throw: empty array → `[]`; missing key → `[]`; `resolved` null → `[]`;
  no `.book` → `[]`. `[]` degrades to today's single-url behavior inside `scanCoverNode`.
- **P4d** full chain on local fixtures → **2** urls attempted in order, final `src` is the GB
  hit, `display:block`, natural 1x1, rect **64x96**.

## What shipped

**`d9d47e5` — v3.282, the fix.** `js/views.js` +722 B (2 code lines, 7 comment), `sw.js` +0
(equal-length version string). Staged-blob CR 0 on both. Parse gate exit 0.

**v3.283, the dead code.** `scanClassify` + its 4-line header removed (29 lines); the stale
comment claiming `#scan uses scanClassify` corrected to name `scanResolveAndFill`; the S2
comment's own line-number citations re-pointed after the shift. Separate commit so a revert
of the fix does not drag the cleanup with it.

## Honest residuals

- **R1 — not device-verified.** Egress to `praxis-reading.netlify.app` is blocked from this
  machine (curl 000) and the rig has no camera. The mechanism is proven at the byte level; the
  RESOLVE RATE on Preston's real shelf is not measured and cannot be from here. The 20-row
  resolve table, before/after percentage, no-regression on the 8, and two-run stability are a
  **device pass**, not deliverable here. See "What Preston runs" below.
- **R2 — non-array `coverCandidates` passes the guard.** A truthy non-array with a `.length`
  (e.g. a string) satisfies `.length > 0` and is carried through as-is. Unreachable in practice:
  `rz.book.coverCandidates` is only ever written by `volumeToBook` (array) or `manualStub` (`[]`).
  The shelve path's guard (views.js:9099-9102) has the identical property; mirroring it was the
  instruction, and diverging would have invented a guard.
- **R3 — draft size.** `scanSaveDraft` serializes the item array to localStorage. Each item
  already carries `resolved` (the full resolveBook result, including `book.coverCandidates` and
  up to 5 `alternates` with description strings), so the added 2-element array is marginal
  against what was already stored. **Estimated, not measured.**
- **R4 — pre-fix drafts load clean.** A draft saved before v3.282 has items with no
  `coverCandidates` key; those reach `scanCoverNode` as `undefined` and get today's single-url
  behavior. No throw, no migration needed.
- **R5 — FIX-PROTOCOL §9 red-team subagent NOT run.** This session operates under a standing
  instruction not to spawn agents. The §9 pass was performed inline instead (call-chain trace to
  a real gesture, consumer sweep, control branches, collateral-damage md5). That is a **weaker**
  gate than the named agent, so this stands as a HALT-tier change awaiting Preston's read —
  which it already is; there is no push in this task.

## What Preston runs (the device pass this cannot replace)

1. Hard-refresh `praxis-reading.netlify.app`, accept the update banner, confirm
   `CACHE_VERSION` reads **praxis-v3.283** in DevTools.
2. Re-run the same shelf scan. Record, per confident match: title, real art vs placeholder.
3. **No-regression check** — the 8 that worked at v3.279 (McLaren, Freire *Politics*, Giroux
   *Zombie*, Stewart, Coontz, Love, Pollan, Westover) must still paint real art. Per the
   pre-decided ruling: **different art on those 8 is EXPECTED and is not a regression** — a
   second candidate is now in play where there was one. Only real-art → placeholder reverts.
4. Run the scan twice more; the resolved set should be stable.
5. Optional discriminator, one tap: shelve a book that still shows a placeholder in the tray.
   The shelve path (views.js:9099-9102) already threads the full list, so if it paints art on
   the shelf but not in the scan tray, a scan-path url is still being dropped.

## Carried debt filed

T1 (three divergent cover decision paths) · T2 (FIX-PROTOCOL's stale `docs/LAUNCH-STATUS.md`
path; the tracked file is `docs/studio/LAUNCH-STATUS.md`) · T4 (OL-before-GB ordering
unexamined) → `docs/launch-runway.md` CARRIED-DEBT LEDGER.
T3 (a fix must prove its call site executes) → `CLAUDE.md` § Verification — non-negotiable.
