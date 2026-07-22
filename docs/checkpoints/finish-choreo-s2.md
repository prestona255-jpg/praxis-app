# FINISH-CHOREO S2 (THE THRESHOLD) — build checkpoint

Session: 2026-07-21 · Model: Opus 4.8 (default). Base: `main` @ `e72611d` (code byte-identical
to the recon's `36b7d45` — intervening commits docs-only). Recon: `finish-choreo-s2-recon.md`.
Brief: `finish-choreo-brief.md` D2 + S2. Rulings (Preston, this session):
- **S2-A = A1** — parameterize `_pubOverlay()` with ONE variant-class arg; distinct-but-quiet
  full-screen threshold skin (NOT a scaled-up publish card): the arc's central question as the
  headline, the answering line, Finish / Not yet.
- **S2-B = B1** — direct-mutate at the Finish site, full sibling sequence
  (mutate → `markSubTheoriesDirty()` → `saveState()`); `updateSubTheory` allowlist untouched.

DATA-WRITE slice → push HOLDs for Preston's explicit word regardless of green. Files owned:
`state.js` · `js/views.js` · `assets/components.css` · `sw.js` (cache bump at final). NOT
integrations.js (`ensureSubTheoryFieldsAll` already generic at integrations.js:301).

## STAGE-0 — anchors re-verified at current lines (this session)

| Anchor | Recon line | Current | Confirmed |
|---|---|---|---|
| Finish pill click (crossing-IN `else`) | 11561 | **views.js:11557-11565** | direct-flip toggle; basin-guard triple-layered; sole `status='published'` site |
| `ensureSubTheoryFields` (schema chokepoint) | 644 | **state.js:644** | citationPins/evidenceLayout additive precedent; `answeringLine` absent (0 grep hits) |
| `updateSubTheory` allowlist (untouched) | 2219 | **state.js:2219** | header/bodyPublic/bodyIntellectual only; drops unknown fields |
| `_pubOverlay()` factory | 20096 | **views.js:20096** | hardcodes `panel.className='pub-ceremony-panel'` @:20100; a caller already reassigns it @:20276 |
| `.pub-ceremony-panel` / `.pub-ceremony-scrim` | 14739 / 14732 | **components.css:14739 / 14732** | 420px centered card / fixed flex-center scrim, opacity+translateY, no scale, reduced-motion instant |
| `st-room-threshold` label | 11194 | **views.js:11194-11199** | published branch of `renderSubTheoryPage`; `id` in scope |
| `.st-room-threshold` CSS | 11867 | **components.css:11869-11871** | mono-uppercase eyebrow + flanking gild rule-lines, sized ~24ch |
| arc.title IS the question (blank→"Unnamed") | 13577 | **views.js:13591-13603** | precedent to match: `arc.title ? arc.title : 'Unnamed'` |
| `evidencePrivate()` predicate | 10932 | **views.js:10932-10936** | `kind==='entry' && (!entry || isPrivate===true)`; books/external never private |
| reopen (instant, ceremony-free) | 11258 / 11557 | **views.js:11260 (page) / 11557-58 (build `if`)** | both stay untouched |
| kit motion tokens | — | **assets/praxis-kit.css** (`--dur-gentle`, `--ease-emphasis`, `--ease-standard`) | cite, don't reinvent |

`attachedMarginalia[]` = confirmed DEAD write (never populated) → sweep enumerates `evidence[]`
ONLY, matching `evidencePrivate()`. (Recon §5.)

## BUILD PLAN — slices

- **B1 · schema (state.js).** Add `answeringLine` (typeof-check, default `''`) inside
  `ensureSubTheoryFields`, comment "S2". No `SCHEMA_VERSION` bump (rides both load paths free).
- **B2 · overlay engine (views.js).** `_pubOverlay(variantClass)` → `panel.className =
  variantClass || 'pub-ceremony-panel'`. Additive; existing callers (no arg) unchanged.
- **B3 · threshold ceremony (views.js).** New `openThresholdCeremony(subId, onFinish)`:
  ONE full-screen overlay via `_pubOverlay('threshold-panel')` containing — (a) the privacy
  sweep as a PLAIN section (only when the private set is non-empty), "What stays yours" /
  "What travels", partitioned by the replicated `evidencePrivate` predicate, no toggles; (b)
  headline = `arc.title` verbatim (blank→"Unnamed", matching the arc-head precedent); sub-copy
  "Before this enters the finished room — how does it answer?"; the answering-line input with
  sub-copy "this line travels with it"; (c) primary **Finish**, secondary **Not yet**. One
  overlay, no stacked modals, Finish/Not yet the only controls (no invented "continue").
- **B4 · wire the Finish pill (views.js).** The crossing-IN `else` opens the ceremony; onFinish
  does the B1 write AT the Finish site: `r.status='published'; r.publishedAt=Date.now();
  r.answeringLine=value; r.updatedAt=Date.now(); markSubTheoriesDirty(); saveState(); paintPub()`
  (the quiet settle). Reopen `if` branch + page reopen pill untouched (instant).
- **B5 · label replacement (views.js:11197).** `stThreshold.textContent = answer||'entering the
  finished room'`; add `has-answer` modifier class when an answer exists.
- **B6 · CSS (components.css).** `.threshold-panel` full-screen quiet skin (fills the padded
  scrim, no border/radius/shadow, question centered, KIT tokens, fade+slide via the overlay's
  is-open, NO scale, reduced-motion instant) + the sweep list styling + the `.st-room-threshold.
  has-answer` sentence variant (wrap, quiet serif register, soften the eyebrow rule-lines).
- **B7 · sw.js** CACHE_VERSION `v3.240` → `v3.241` (final commit only).

## FLAGGED FOR PRESTON'S FELT PASS (built at a restrained default, not HALT-worthy)

1. **Threshold-label sentence treatment (§3 recon flag).** D2 rules the replacement; the CSS
   fit is a build-time pass. Default: a `.has-answer` variant that wraps + reads as a quiet
   serif sentence (the reader's own line standing at the threshold), softening the mono-uppercase
   eyebrow + rule-lines. Felt-delta: before = `ENTERING THE FINISHED ROOM` eyebrow → after = the
   reader's answering sentence, quiet, at the threshold.
2. **Sweep-in-one-overlay composition.** D2 says one overlay, sweep (i) → threshold (ii), no
   stacked modals, controls = Finish/Not yet only. Built as a plain sweep SECTION above the
   question in the single full-screen surface (a two-step would invent a "continue" control D2
   doesn't name).
3. **Re-finish prefill (data-preservation).** The answering-line input prefills the existing
   `r.answeringLine` so a reopen→re-finish doesn't silently wipe a prior public answer; a
   deliberate clear still writes `''`. Mechanical anti-data-loss default.

## VERIFICATION — live-DOM proof (rig: `.claude/rig/`, d0tester stub, SW-killed, serve :8795)

Fixture: d0tester-owned arc (`arc_s2test`, title = "Does teaching transmit power, or open it?")
+ draft sub (`sub_s2test`) with 3 evidence — 1 private entry, 1 public entry, 1 book.

| Gate | Result |
|---|---|
| edits live in bundle | `openThresholdCeremony` fn present, uses `_pubOverlay('threshold-panel')`; `_pubOverlay` param'd; `ensureSubTheoryFields` defaults `answeringLine`; `updateSubTheory` still narrow (no answeringLine) — PASS |
| ceremony opens on Finish (crossing IN) | 0 overlays → 1 on `.stb-pubpill` click; overlayCount 1 (no stacked modals) — PASS |
| question = arc.title verbatim | "Does teaching transmit power, or open it?" — PASS |
| privacy sweep (only w/ private evidence) | Stays yours = [private entry]; Travels = [public entry, book] — exact partition; absent on a no-private-evidence sub — PASS |
| ask + note copy | "Before this enters the finished room — how does it answer?" / "Optional. This line travels with it." — PASS |
| B1 write on Finish | draft→**published**, `answeringLine` set + **trimmed**, publishedAt+updatedAt stamped; persisted to `praxis_state_d0tester` — PASS |
| Not yet / no write | status unchanged, overlay closes (260ms teardown, 0 lingering) — PASS |
| reopen instant (both pills) | page pill → draft, **no overlay**, answer preserved — PASS |
| re-finish prefill (anti-wipe) | input prefills prior answer; deliberate clear writes '' — PASS |
| label replacement | finished Page `.st-room-threshold.has-answer` textContent = the answering line — PASS |
| schema round-trip | write persists to disk → survives reload on disk → `ensureSubTheoryFieldsAll` over the real blob PRESERVES it; preserve+default unit cases PASS (full reload-render blocked by rig auth-clobber — noted) |
| motion | transform = `translateY` only (matrix scale 1,1) — NO scale; reduced-motion @media rule targets `.threshold-panel` (present in CSSOM) — PASS |
| full-screen fit | 1360: fills h + ~99% w (15px = page scrollbar); 390: 342×796 fills vp−scrim-padding; hOverflow false both — PASS |
| tap targets (P3) | Finish/Not-yet 41→**44px** after fix; input 16px (iOS guard, P7) — PASS |
| publish-ceremony regression | `_pubOverlay()` no-arg → panel class `pub-ceremony-panel` (unchanged) — PASS |
| console | clean through the full drive — PASS |

MECHANICAL: parse OK (state.js, views.js); content Δ (LF-norm) **state +929 / views +7336 / css
+4493 B**; diff surgical (**views +175/−9, state +13/−0, css +84/−0**), NO whole-file EOL flip
(`i/lf w/crlf`, autocrlf); one live `status='published'` write (in onFinish); grep answeringLine
3/3. sw.js CACHE_VERSION bump v3.240→v3.241 rides the commit.

## GATE FIXES (post red-team + reviewer, pre-commit)
- **Copy → D2 verbatim (reviewer Gate 4).** Sweep labels restored to "What stays yours" /
  "What travels" (were "Stays yours"/"Travels"); input note restored to "This line travels with
  it." (dropped the "Optional." prefix). D2's quoted strings now land byte-exact.
- **migrate() comment corrected (red-team #1).** state.js:735 no longer claims "both load paths
  free"; it now states the true wiring (defaulted at creation + Firestore-merge; settled
  localStorage migrate() does not re-run; reads typeof-guarded; direct Finish-write).
- **Byte table corrected (reviewer Gate 5).** state.js re-measured +517→+929 B / +9→+13 lines
  after the comment fix.
- **FORK audit trail (reviewer Gate 3).** Preston's A1/B1 rulings appended to the recon itself
  (finish-choreo-s2-recon.md §7b/§7c RULED block), not only this checkpoint's header.
- **AUTH-GATED WRITES (red-team #2).** Signed-in Firestore round-trip UNVERIFIED live — the
  explicit line + Preston's live-smoke click-path are recorded above.

## RESIDUALS (for the felt pass / awareness)
- Background page scrollbar visible behind the full-screen overlay when the underlying build
  view scrolls. A body-scroll-lock would remove it, but the shared `_pubOverlay` engine exposes
  no close-hook for its own Esc/backdrop paths, so a correct lock can't be added without either
  hacking the shared engine or changing S1's publish-ceremony behavior — DEFERRED, flagged, not
  hacked. (Conditional: only when the build view itself scrolls.)
- Full reload→render E2E of persistence is blocked by the rig's auth-clobber-on-boot (per-user
  state key); proven instead by write-to-disk + the real load-side chokepoint preserving it.

## AUTH-GATED WRITES — signed-in persistence UNVERIFIED (rig is signed out)

Per CLAUDE.md's AUTH-GATED WRITES rule: this ships a new **public-facing** persisted field, and
all verification ran on the rig's **stubbed localStorage** (`praxis_state_d0tester`), never a
real Firebase session. **Signed-in Firestore round-trip is UNVERIFIED live** — the red-team
confirmed the mechanism BY CODE (the field rides `buildUserSubTheoriesDoc` by-reference into the
`.set()` push, integrations.js:1476-1494; the merge at integrations.js:301 backfills every
snapshot), but that is not a live round-trip. Preston's live-smoke steps (real signed-in account,
e.g. `prestonpraxistest` — `prestona255` is read-only):
1. Open a draft sub-theory's build workshop (`#subtheory/<id>/build`); click **Finish**.
2. In the threshold overlay: type an answering line; click **Finish** → pill flips to "Finished".
3. **Reload** (or open the same account in a second session/device): the sub-theory is Finished
   AND its Page threshold shows the answering line → proves it persisted to `/userSubTheories/{uid}`
   and read back through the Firestore merge.
4. Publish the arc (commons): the finished sub-theory carries its `answeringLine` into the
   projection. Then reopen→re-finish once: the input prefills the prior answer (no silent wipe).
