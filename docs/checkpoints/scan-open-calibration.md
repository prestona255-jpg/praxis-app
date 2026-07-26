# SC12 — PRE-BUILD CALIBRATION PASS

**Status: PENDING — run card issued, awaiting Preston's shelf photos.**
(Preston chose "recon now"; SC12 is NOT deferred — it remains a build-round
prerequisite and this file receives the numbers when the shots are pasted.)

## Run card (issued Stage 2)
- Harness: `https://praxis-reading.netlify.app/scan-derisk.html` (x-praxis-key
  pre-filled; endpoint base blank = same origin).
- Model: **`claude-opus-4-8`** (the shelf model per SC9 — not the sonnet default).
- Input: 3–5 FRESH shelf frames, one row per frame (CAPTURE-PROVENANCE: no reused
  de-risk shots).
- Paste back per shot: raw JSON (`{books:[{title,author,spineText,confidence}],
  model}`) + header `latency __ ms / detected __ / matched __/__` + the titles that
  showed `✗ Google Books: no match`.

## SC6 predicate to simulate — RATIFIED as amended (BRIEF-ERRATA-2, Preston 2026-07-25)
The shelf endpoint returns `confidence` (high/med/low), **no `legibility` field**
(that lives in `vision-proxy`). So on the shelf path the three-arm SC6 predicate
reduces to (ratified):

  **exception ⇔ (Google Books no-match) OR (confidence == low)**

I will sweep the confidence cut across `{low}` vs `{low, medium}` and report:
- books/shot,
- exception RATE at each cut,
- recommended numeric cut + one-sentence reasoning,
- latency stats (min/median/max ms).

## Results
_(awaiting paste — table lands here)_

| shot | books | GB no-match | conf=low | conf=med | exceptions @low | exceptions @low+med | latency ms |
|------|-------|-------------|----------|----------|-----------------|---------------------|------------|
| —    | —     | —           | —        | —        | —               | —                   | —          |

**Recommended cut:** _(pending)_
