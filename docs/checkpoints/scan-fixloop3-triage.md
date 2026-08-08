# SCAN — FIX-LOOP-3 TRIAGE (F6 blur · F7 candidate junk · F8 invented books)

**READ-ONLY.** Opus 4.8, default effort. No code, no commits, no doc edits beyond this
file. Ends at a HALT for Preston's rulings; the fix build is a separate session.

Ground: HEAD `30cd777` == origin/main == local (verified, `git fetch`); no tracked
modifications. CACHE_VERSION live = praxis-v3.267 (fix-loop-2 shipped). Round STAYS OPEN.

> Label note: this loop's F6/F7/F8 are NEW findings from the Aug-5 real-device felt pass.
> They are NOT the fix-loop-2 F6/F7 (bottom-pill / shelf-dark). FX-G (fix-loop-2) is the
> suspect for THIS F6.

---

## STAGE 1 — EVIDENCE BASE (is the real shot's pipeline output readable locally?)

**No — device-only.** The scan draft is the only persisted pipeline output, written by
`scanSaveDraft` (views.js:8887) to **localStorage** under `praxis_scan_draft_<uid>`
(`scanDraftKey`, :8886) as `{confident:[…], exceptions:[…], savedAt}`; each item carries
`{title, author, spineText, confidence, resolved, alternates, exception, cover}`. That store
lives in **Preston's iPhone Safari/PWA localStorage** — not in the repo, not reachable from
the rig (the rig is a different origin/profile with no camera and a stub uid). The captured
**images are never persisted** at all (Law 2, THE CAMERA FORGETS — transient end-to-end).

⇒ Ground-truth fragments are taken **from the prompt verbatim**: 13 found / 4 confident (all
4 correct) / 9 need-a-look; best-guess partial **"THE ESSENTIAL"** with candidates *The Texas
criminal reports · Report of the Commissioner of Agriculture · Lectures Introductory to the
Theory of Functions of Two Complex Variables (1893) · The Fortnightly Review*; invented
needs-a-look items **"SCARVES", "FLUX", "Sharpie"** (Preston confirms non-book objects).

---

## STAGE 2 — F6 ROOT-CAUSE (Shelf viewfinder blurry after Book→Shelf switch)

### Evidence (line-cited)
- **(a) Shelf reuses Book's stream — it does not request fresh.** `scanSetMode('shelf')`
  (views.js:8165) → `scanStopBookDecode()` (:8175) → `scanEnsureDisplay()` (:8176). On iOS
  Safari (no `window.BarcodeDetector`) Book mode decodes via zxing:
  `scanZxingReader.decodeFromConstraints({video:{facingMode:{ideal:'environment'}}}, v, …)`
  (:8291) opens zxing's OWN capture stream **S2** and sets `v.srcObject = S2`; our original
  getUserMedia stream **S1** (`scanStream`, opened in `scanStartStream` :8085) is orphaned
  but stays live (registered for teardown at :8297). Switching to Shelf calls
  `scanZxingReader.reset()` (:8304) which stops S2 and nulls `v.srcObject`; then
  `scanEnsureDisplay` (:8125): `scanTrackLive(v.srcObject)` is false (nulled) → `scanTrackLive(scanStream)`
  is true (S1 survived) → **re-attaches S1** (`v.srcObject = scanStream`, :8130). No fresh
  acquisition. (Native-BarcodeDetector devices never open S2 — Book decodes on S1 in place —
  so a switch is a no-op and there is no blur; the fault is **iOS-only**, matching the iPhone
  report.)
- **(b) No resolution / focus constraints, per mode.** `scanStartStream` requests
  `{video:{facingMode:{ideal:'environment'}}, audio:false}` (:8088) — **no width/height/
  focusMode/advanced**. zxing's S2 (:8291) likewise carries only `facingMode`. iOS therefore
  picks a default capture resolution for both.
- **(c) The Shelf STILL capture comes from that same track.** `scanCaptureBase64` (:8558)
  reads `v.videoWidth/videoHeight` of whatever stream is attached (S1 after the switch),
  scales to ≤1600px, JPEG q0.82 — so a soft/low-res S1 becomes the shelf image sent to Opus.
- **(d) Render path is NOT the cause.** `#scan-cam-video` (components.css:16686) is
  `object-fit:cover; width/height:100%` with **no `filter`, no `transform`, no `blur`**
  (fix-loop-2 already computed-style-ruled this out). The softness is intrinsic to the feed.

### Asymmetry that explains "Book sharp / Shelf blurry"
On iOS a single camera cannot cleanly back two live getUserMedia tracks. During Book mode,
zxing's **S2 owns the camera** and is what the user sees (sharp, freshly acquired with a
focus/exposure sweep); **S1 is demoted while backgrounded.** On the switch, S2 is stopped and
FX-G re-attaches the **demoted S1**. Re-attaching an existing `MediaStream` to a `<video>`
does **not** re-trigger the camera's initial autofocus/auto-exposure convergence the way a
*fresh* getUserMedia acquisition (the warm-up path, or zxing's S2) does — so Shelf lands on a
soft, un-refocused S1. Compounded by (b): S1 is at whatever low default iOS chose, upscaled by
`object-fit:cover` onto a Retina viewfinder. A **fresh** #scan/shelf entry (Manage-sheet "Scan
shelf") does NOT hit this — it warms one fresh S1 and never opens S2 — consistent with the
fault being specific to the *switch* (the FX-G re-attach path).

### MECHANISM (one sentence, with a named second candidate)
**Primary:** *On iOS, Book mode displays zxing's freshly-acquired stream (S2) while our
original stream (S1) is demoted; the Book→Shelf switch stops S2 and FX-G re-attaches the
surviving-but-demoted S1, and a re-attached iOS stream resumes without re-running autofocus/
exposure, so Shelf shows a soft S1 — worsened because `scanStartStream` sets no resolution
constraints, leaving S1 at a low default.*
**Second candidate (if the focus theory is wrong):** the blur is purely **low-resolution** —
no `width/height:{ideal}` on either stream, so iOS delivers a low default that `object-fit:
cover` upscales, and the shelf shot inherits it. Both candidates **converge on the same fix**
(fresh high-res acquisition on Shelf entry), so the ambiguity does not fork the fix.

### Cross-cutting note
F6's low-res/soft capture is also **root input to F7 and F8**: a soft shelf image makes Opus
mis-read partials (F7 fuel) and mis-identify objects (F8). Fixing the capture resolution has
positive spillover on both.

---

## STAGE 3 — F7 ROOT-CAUSE (walker "did you mean" candidates are implausible)

### The candidate pipeline
1. `scanQueryForBook(vb)` (views.js:7889) → `{kind:'title', title:vb.title, author:(noisy?'':author)}`.
   `scanAuthorIsNoisy` (:7877) relaxes empty/editor/comma-list authors to **title-only**.
2. `resolveBook({kind:'title', …})` (integrations.js:2310): builds `q = 'intitle:'+title`
   (+`'+inauthor:'+author` only if a clean author survived) (:2348–2349) → `googleBooksSearch`
   (:2294) POSTs `{q}` to `google-books-proxy`, which forwards **verbatim** to
   `https://www.googleapis.com/books/v1/volumes?q=<encodeURIComponent(q)>` (proxy :80).
   **No `printType`, no `langRestrict`, no `country`, no `maxResults`** (defaults; maxResults 10).
3. Results are scored (`scoreVolume` :2087), sorted desc (:2358); `top` = best,
   **`alternates` = the next up to 5 by score** (:2361–2364).
4. The **walker shows `resolved.alternates` as the candidates** (built in `scanResolveAndFill`
   :2629 / `scanClassify` :7953; consumed by the walker `scanOpenWalker`/`scanResolveStep`).

### Why the candidates are junk
- **Query is a generic fragment.** "THE ESSENTIAL" is a partial spine read; `intitle:THE
  ESSENTIAL` (title-only, author dropped) matches GB's enormous **public-domain-scan** mass —
  1870s–1910s periodicals, court reports, agricultural-commissioner reports.
- **`scoreVolume` only REORDERS, never WITHHOLDS.** It down-ranks periodicals (−25),
  pre-1900 (−30), non-BOOK printType (−12), missing ISBN (−10) — but the walker takes the
  **top-5 alternates regardless of absolute score**, so when the *whole* set is junk the
  "best 5 junk" are shown.
- **The periodical keyword list has holes.** `scoreVolume`'s regex (:2120) catches
  `index|proceedings|transactions|periodical|magazine|bulletin|gazette|catalogue|catalog|annual report`
  — but **misses** "**review**" (The Fortnightly **Review**), "**reports**" (The Texas Criminal
  **Reports**), "**lectures**", "**commissioner**", "**cases**". So three of Preston's four
  junk candidates aren't even down-ranked as periodicals.
- **The GB-corroboration anchor can be spuriously satisfied.** `scanTitleCorroborates`
  (:7900) treats a ≥6-char shorter title that is a substring of a longer one as corroborating
  — which lets one-word/short fragments match unrelated longer titles (see F8).

### REPRODUCTION (curl, read-only)
- Faithful path (`www.googleapis.com/books/v1/volumes?q=intitle:THE ESSENTIAL`) returned
  **HTTP 429 — daily quota exhausted for the keyless anonymous consumer** (`project_number:
  624717413613`); retried with `country=US` and the `books.googleapis.com` host — same 429.
  The app's prod proxy uses a keyed project with its own quota, so **Preston's Aug-5 device
  candidates ARE the live v1 reproduction from prod.**
- Independent corroboration via the **legacy GData feed** (`books.google.com/books/feeds/
  volumes?q=intitle:THE+ESSENTIAL`, HTTP 200 — a *different* endpoint/ranking, so it
  corroborates the *pattern*, not the exact app set) returned, among the first entries:

  | GData title (intitle:THE ESSENTIAL) | year | matches a field candidate? |
  |---|---|---|
  | The Essential Life | 2022 | (a plausible modern top) |
  | The Massachusetts register | 1906 | periodical |
  | Journal of the Royal Horticultural Society | 1898 | periodical |
  | **The Texas Criminal Reports** | 1899 | ✅ Preston's candidate |
  | **Lectures Introductory to the Theory of Functions of Two Complex Variables** | 1914 | ✅ Preston's candidate |
  | **Report of the Commissioner of Agriculture** | 1871 | ✅ Preston's candidate |

  **3 of Preston's 4 exact junk candidates reproduced** (the 4th, *The Fortnightly Review*, is
  the same 19th-c-periodical class). Mechanism confirmed — the query is too loose and the shown
  candidates have no plausibility floor.
- Tying F7↔F8, the two real non-book reads through the same query (GData):
  `intitle:FLUX` → *Flux and Reflux · Science in Flux · **FLUX** (1959)*; `intitle:Sharpie` →
  ***Stolen Sharpie Revolution** · Sharpie Art Workshop for Kids*. A non-book label finds
  **real books** in GB (and "Sharpie" ⊂ "Stolen Sharpie Revolution" corroborates via the
  ≥6-char rule), so GB no-match does NOT reliably catch non-books.

### FIX OPTIONS (F7)
- **F7-A — plausibility FLOOR on shown candidates (client only).** Gate each alternate before
  the walker shows it: require ISBN + printType BOOK + a minimum `titleCloseness` to the read
  fragment + not-periodical/not-pre-1950, using the signals `scoreVolume` already computes;
  also extend the periodical regex to cover review/reports/lectures/commissioner/cases. If
  **no** candidate clears the floor, show an honest "no confident match — search" row instead
  of junk. Fixes: the felt problem directly (junk → honest silence/search). Might wrongly
  exclude: a legit match with a missing ISBN/cover, or a genuinely old reprint. Size: ~30–50 L
  in views.js walker + integrations.js. Binds: SC4 / Law 3 (silence over filler — the floor
  turns garbage into honest silence while keeping the SC6-sanctioned candidate UX).
- **F7-B — shape the QUERY (client only).** Add `printType=books`, `langRestrict=en`, a
  `country`, use the clean author fragment when present, and require a minimum fragment length
  before querying at all. Fixes: reduces the junk set at source. Might wrongly exclude: nothing
  much, BUT `printType=books` still returns public-domain scans (court/agri "reports" are
  "books"), so it does not eliminate junk alone. Size: small (proxy/query params) — but note
  the proxy passes `q` verbatim, so a param add touches `google-books-proxy.js` and/or the
  `googleBooksSearch` contract.
- **F7-C — both (B then A).** Query shaping to shrink the junk set + a floor to withhold what
  remains. Fixes: defense in depth (the repro shows BOTH failures). Largest. Recommended if
  Preston wants the thorough pass.

---

## STAGE 4 — F8 ROOT-CAUSE (non-book objects reported as spines)

### The prompt (verbatim, shelf-vision.js:158–186)
It DOES say books-only and to ignore non-books — but weakly:
- "Output a book **ONLY if you can read its characters** in the image." ← the real gate is
  *legibility*, not *is-it-a-book*.
- "NEVER complete, correct, or guess a title or author"; "an invented title or author is a
  serious error."
- "The photo may include **non-book objects (speakers, frames, plants, decor) — ignore them
  entirely.**" ← an **example list of non-text décor**. It does NOT cover **text-bearing**
  objects: a **Sharpie** marker (brand printed on the barrel), a **FLUX** box, a **SCARVES**
  retail label — each presents legible, title-like text on a spine-like vertical form.
- title is REQUIRED/non-empty; confidence tri-state high/medium/low.

### How non-books survive to the tray
1. **The model obeys the literal instruction.** "SCARVES"/"FLUX"/"Sharpie" have crisply
   legible characters on spine-like forms → the model outputs them as titles (often high/medium
   confidence — they're clearly legible). The prompt never asks "is this object a book," and
   its non-book exclusion is a décor example list that misses text-bearing goods.
2. **No downstream is-a-book gate exists.** shelf-vision → `scanResolveAndFill` → `resolveBook`
   → `scanIsException` (:7931): an item is dropped only if it's a within-scan duplicate;
   otherwise it enters the tray, and GB no-match / low-confidence merely routes it to the
   **needs-a-look walker** (whose "Not a book / skip" is a MANUAL tap). There is **no confidence
   floor that drops** and no non-book class.
3. **The GB anchor is fooled.** As Stage 3 showed, non-book labels corroborate real GB books
   ("FLUX" 1959; "Sharpie" ⊂ "Stolen Sharpie Revolution"), so a high/medium-confidence non-book
   can even classify **confident** and be **shelved on "Shelve N"** — a worse manifestation than
   the needs-a-look pile Preston happened to see. A **confidence floor cannot catch them** (they
   read crisply).

### FIX OPTIONS (F8)
- **F8-A — strengthen the vision prompt (endpoint).** Add an explicit BOOK definition (a
  physical book: a title, usually an author, on a vertical spine or cover) and a do-NOT-emit
  list for text-bearing non-books (product packaging, stationery/markers, boxes, brand labels,
  single-word object/retail labels, décor with text) + "if unsure whether an object is a book,
  OMIT it." Fixes: at the only layer that sees the object's form; smallest. Over-filtering risk:
  a real one-word-title book (there IS a book titled *Flux*), an art/boxed/spine-less book could
  be omitted. **Touches `netlify/functions/shelf-vision.js` — the ENDPOINT (see FORK below).**
- **F8-B — add an `isBook`/`kind` field to the vision contract (endpoint + client).** The model
  classifies each legible region book vs object; the client **drops `kind!=='book'` silently**
  (keeping a count for honesty). Fixes: a firm structural gate; lets the model flag an object
  WITHOUT hallucinating a title. Over-filtering risk: same as A plus a contract/coercion change
  (shelf-vision.js output shape + the `scanShelfVision` parse at views.js:7855). Larger; also
  endpoint-touch.
- **F8-C — client-only mitigation (no endpoint).** A confidence floor and/or a stationery/brand
  denylist client-side. **Weakest / not recommended:** the repro shows these read at high/medium
  confidence (floor misses them) and spuriously corroborate GB; a denylist is brittle and risks
  dropping real one-word-title books. Kept only as the no-endpoint option.

### Verification given the rig has no camera — the ONE sanctioned round-3 device shot must show
A single real shelf row that **deliberately includes a known non-book object** (a marker / a
labelled box / a scarf) among real books, shot on the iPhone:
1. **F8:** the non-book object does **NOT** appear in the tray or needs-a-look pile; the real
   books on the row **do** (no over-filtering).
2. **F7:** for any partial read the walker's candidates are **plausible** (or an honest "no
   match — search"), with zero 19th-century periodicals/court-reports.
3. **F6:** the Shelf viewfinder after a **Book→Shelf switch** is **sharp** (and the shelf shot
   it produces is sharp).
(One opus call — budget-sanctioned. Rig can pre-verify only the pure client logic of F7-A's
floor and any client parse for F8-B against stubbed vision JSON; the camera/vision felt is device-only.)

---

## FORKS TO SURFACE (per FORK-VERBATIM — Preston's call, not absorbed)

- **FORK-α (F8 endpoint touch).** F8's effective fixes (F8-A prompt, F8-B contract) BOTH edit
  `netlify/functions/shelf-vision.js` — the vision **ENDPOINT** — which the SCAN round brief
  lists under **NON-GOALS ("No endpoint changes")**. A felt-pass FAIL can revisit a non-goal,
  but that is Preston's ruling to make. Sub-options: (1) fix F8 at the endpoint (accept the
  non-goal revisit); (2) client-only F8-C (weaker, brittle); (3) defer F8 to a separate
  endpoint-sanctioned session while F6+F7 (both client-only) ship now.
- **FORK-β (F6 sits on FX-G).** The F6 fix edits `scanEnsureDisplay` / the mode-switch path —
  **prior-fix (FX-G) code.** Per FIX-PROTOCOL §1 the build must sit BESIDE FX-G's guarantees:
  a fresh-stream approach must **stop the old streams before opening** so it does not
  re-introduce FX-G's black-viewfinder or a stream leak. Not a blocker — a named constraint.

---

## FORK CARD (one decision per finding; options lettered; ONE recommendation each)

**F6 — BLUR.** How to fix the soft Shelf viewfinder after a Book→Shelf switch.
- **A — Fresh high-res acquisition on Shelf entry** (stop old streams, `getUserMedia` with
  `width/height:{ideal:~1920–2560}`, behind the warm-up fade) instead of re-attaching S1.
- B — Keep re-attach; add high-res constraints to `scanStartStream` + a focus nudge on re-attach.
- C — Add resolution constraints only, leave FX-G as-is.
- ★ **Recommend A** — it re-runs iOS autofocus AND raises capture resolution (spillover onto
  F7/F8 shelf-shot quality); B/C don't guarantee the focus sweep that a fresh acquisition gives.

**F7 — CANDIDATE JUNK.** How to stop implausible "did you mean" candidates.
- **A — Plausibility FLOOR** on shown candidates (ISBN + BOOK + min title-closeness + not
  periodical/old, reusing `scoreVolume` signals) + extend the periodical regex; none clear →
  honest "no match — search."
- B — Shape the query (`printType=books`, `langRestrict`, use author, min fragment length).
- C — Both (B then A).
- ★ **Recommend A** — the repro proves the failure is *showing* unfiltered top-5 junk; a
  withhold-floor converts garbage into honest silence (Law 3) and is the smallest fix that fully
  removes the felt junk. Offer C if Preston wants query shaping too.

**F8 — INVENTED BOOKS.** How to stop non-book objects reaching the tray.
- **A — Strengthen the vision prompt** (BOOK-only definition + do-not-emit text-bearing non-books
  + "if unsure, omit").
- B — Add an `isBook`/`kind` field; client drops non-books.
- C — Client-only confidence floor / denylist (no endpoint).
- ★ **Recommend A** — puts the judgment at the only layer that sees the object's form, smallest
  change; C is proven too weak (crisp reads defeat a floor; brands corroborate GB). **Gated on
  FORK-α** (endpoint touch is Preston's call); B is the more robust endpoint option if he wants it.

---

## HALT
Read-only triage complete. HEAD `30cd777`, tree clean, nothing built. Preston's rulings on the
three fork-card decisions (and FORK-α / FORK-β) are the next input; the fix build is a separate
session.
