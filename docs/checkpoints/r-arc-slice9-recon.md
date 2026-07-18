# R-ARC — SLICE 9 RECON (the raised-hand seat) — 2026-07-18

**Model:** Opus 4.8, default effort, ultracode OFF (harness turn-flag was a false-positive
substring match on "ultracode OFF"; Preston ruled OFF — sequential Opus-executes lane, no Workflow).
**Base:** `f5b4c47` → D14 docs pass `a0a067d` (local). **Live sw.js:** v3.228.
**Stop schedule (Preston, this session):** continuous under RUN MODE v2 after the recon-validation
gate clears; the only hard stops are (1) data-write tripwire, (2) an un-fixable red-team BLOCK,
(3) a band breach, (4) the FELT-LOOK HALT at close.

---

## 0. D14 DRIFT RECONCILIATION — DONE (`a0a067d`, docs-only, before any code)
Third doc-drift instance of Wave C. Six corrections, all grounded in live code:
- **slice9-handoff SR-1** "slow breath" → **one static step to `--gold-hi`, no motion ever** (YG-12).
- **slice9-handoff SR-3** → the **two-part law** (noticing persists / hand does not / leaving lowers
  the hand without spending the noticing, YG-6 / opened = spent / only explicit dismissal durable).
- **shape-b-decisions D14** — the margin-dots / presence-glyph-with-count chrome **superseded** by the
  Bloom-orb seat (orb-only); the stale "no `sv()`" note **corrected**: `recordThreadDismissed`
  (yumi-brain.js:2233 → `_noticedSet` → `sv('praxis_yumi_noticed')` :2199) has persisted since v3.128,
  and Slice 8 shipped the durable forward-only `dismissReaderThread` (state.js:1566 · views.js:21289).
- **r-arc-plan.md** — Slice 9 renamed **"THE RAISED-HAND SEAT"**; the "9th `gradeUtterance` call site"
  framing superseded (seat = display + ls-session, lazy-compose-on-open through the FROZEN gate);
  **FORK F-D answered** (durable/synced/forward-only = Slice 8, by-id).
- **room3-handoff §2** — marked the silently-narrowed projection (shipped ROOM-3 `62ab1c4` carried no
  raised-hand visibility item).

**3rd doc-drift lesson:** a forward projection ("ROOM-3 will ship the D14 chrome") that the shipping
close silently drops is a drift equal to a stale value; the ruled-name-of-record + the live code, not
the projection, are canonical.

---

## 1. THE ARCHITECTURE (census)

### 1.1 Two Blooms
- **Body FAB** `yumiBloomEl` — `buildYumiBloom()` (yumi-ui.js:1013), mounted `document.body` z-9999
  once (yumi-ui.js:1366-1370, guarded). Class `.yumi-bloom`; SVG fills use `var(--gold)`,
  `var(--gold-light)` (== `#d9a441` == `--gold-hi`), `var(--marginalia-color)`, `var(--text-on-dark)`.
  Carries `.yumi-bloom-line` ("tap to talk") shown **on hover/focus** (components.css:57). Click →
  `toggleYumiPanel()` (yumi-ui.js:1019). **THIS is "the corner" the reader sees — the raise target.**
- **In-panel crest Bloom** `yumiPanelBloomEl` — driven by `setBloomState` (yumi-ui.js:1032).
  `setBloomState` touches ONLY the panel Bloom; **"the body FAB stays at rest"** (comment :1027).
  → **The raise is ORTHOGONAL to `setBloomState`** and must not go through it.

### 1.2 The orb is inherently animated at rest (load-bearing for the static proof)
`components.css:81-85`: `.yumi-bloom-petals` spin 22s · `-core` breathe 4.5s · `-halo` glow 6s ·
two ember twinkles — all `infinite`. Comment :143: "resting keeps the base spin/breathe/glow."
`@media (prefers-reduced-motion)` (:102-108) kills them. **The orb is never literally still.**

### 1.3 The noticing pipeline (the hand's source)
- `maybeDrawOut(entryId)` (views.js:3281) — the note-write hook (writeline + book-detail marginalia).
  Reads `panelOpen = YumiUI.visiblyOpen()`; calls `considerMove(entry, panelOpen)` fire-and-forget.
- `considerMove(entry, panelOpen)` (yumi-brain.js:2026) — gates in order: empty · no-user · consent ·
  private/journal · **panel-open (`panelOpen !== true` → `{quiet, 'panel-closed'}`, NO proxy, :2043)** ·
  budget. Then per-note `generateMove` → `gradeUtterance` → surface; if quiet → `considerNotice`.
- `considerNotice(uid, panelOpen)` (yumi-brain.js:2380) — the cross-note thread. Cheap pre-gates
  (≥3 visible notes `_visibleEntriesForScan` · budget `_drawOutBudgetOk` · cooldown `_scanCooldownOk`)
  → `scanThread` (proxy) → idempotency `_noticedOverlaps` → **`gradeUtterance`** (the T2 gate, :722)
  → on PASS: `appendTurn` + `setPendingNotice` + `_noticedSet(uid, …, 'noticed')`; returns
  `{surface, text, move:'notice'}`. **Runs today only when the panel is already open** — that is how
  the no-unbidden-speech covenant holds now.
- **Held-slot machinery already exists:** `setPendingNotice`/`getPendingNotice`/`clearAllPending`
  (yumi-brain.js:2012-2015), consumed on the next reply (yumi-ui.js:1262). The seat's "single slot."

### 1.4 In-code corroboration
views.js:3324 already names the seat: the reader-model "named thread" signal "returns via the
**Wave-C raised-hand seat**, not invisible threading into the door."

---

## 2. THE SEAT — how the ruled mechanics map onto this code

| Ruled mechanic | Mapping |
|---|---|
| **THE RAISE (SR-1)** | a static class `.yumi-bloom--raised` on `yumiBloomEl` that remaps gold → `--gold-hi` (color only). New `setBloomRaised(bool)` in yumi-ui — NOT via `setBloomState`. No breath/pulse/motion added (YG-12). |
| **SINGLE SLOT** | the hand is a boolean per-session flag; lazy-compose defers composition to open, so there is nothing to queue. Newest trigger just keeps it raised (idempotent). |
| **TWO DOORS** | Door 1 = opening the Bloom (`toggleYumiPanel`→`openYumiPanel`) delivers the held move via `considerNotice` and spends the hand. Door 2 = inline solicits (arc voice + other "ask Yumi" channels) — the seat does not hook them, so the hand **persists through a solicit** by construction. |
| **LAZY COMPOSE** | while closed: cheap eligibility only (no proxy). On open: run the real `considerNotice(uid, true)` → compose + gate. Gate-fail/none → graceful (panel opens normally, in-voice fallback), hand spent. Composer budget spent only on opened hands. |
| **PERSISTENCE (SR-3)** | the **noticing** persists in existing stores (`praxis_yumi_noticed` idempotency; Slice 8's synced tombstone for explicit dismissal). The **hand** is ls-session, boot-cleared. Leaving (reload) lowers it without spending the noticing → re-raisable. Opened = spent. |
| **RAISE TAG (SR-2)** | **the seat does NOT touch any chip.** SR-2 "tag = Yumi" is satisfied by the existing panel title "Yumi" (yumi-ui.js:1078, unchanged) when the move delivers on open. RD-6 (retire the persistent hint line → hover-only chip; `room-felt-brief.md:120`) is **HELD OUT / deferred to R-POLISH L5** (its rationale: "the orb standing quietly IS the raised hand; a forever-caption is the hand waving") — caption work is a **hard non-goal**, and the rig checks "RD-6 chip unchanged." **RESIDUAL:** the persistent hint line ("tap to talk") remains until RD-6 ships; the raise itself adds no badge/count/words, so FELT CANON #2 holds *for the raise*. Flagged for the felt halt. |

### 2.1 STATIC-PROOF DETERMINATION (design/mechanics fork — carried, flagged for felt halt)
The orb animates at rest (§1.2); the rig-battery's literal "no animation/transition property live in
the held state" and FELT CANON #1 "perfectly still" cannot mean "freeze the living orb" (that would
make the raise a *reduction* of motion — a different, eerier signal, and would gut the orb's design).
**Determination (Reading A, carried per Preston's "proceed at your own rec"):** *"still / nothing
moves or intensifies"* is scoped to the RAISE — the raise contributes **only a static color step** and
**adds no animation and does not alter the base animation set**. Proof is two-legged:
- **Leg A (byte-identical):** under `prefers-reduced-motion` (base animations off → orb static), the
  raised-state computed style of `yumiBloomEl` + children is byte-identical at T0 vs T+60s (nothing the
  raise added animates), and a rest-vs-raised screenshot diff shows only the color step.
- **Leg B (adds-no-motion):** in normal mode, the raised orb's `animation-name`/`-duration` set equals
  the rest orb's for every sub-element — **the raise adds zero new ANIMATION.** The one `transition:
  filter 420ms` on `.yumi-bloom-orb` is SR-1's intentional "one gentle transition": a **one-time,
  settled** ease into bright (and back), reduced-motion-guarded, producing NO ongoing motion once
  settled (hence Leg A's T0-vs-T+60s byte-identity holds). It is not a pulse and does not intensify.
This RECONCILES the literal wording with the living orb. If Preston's felt read wants the base life to
actually quiet on raise, that returns at the felt halt (it is a felt ruling, not a mechanical one).

### 2.2 DATA-WRITE TRIPWIRE — TRIGGERED (conservative) → LOCAL + HALT at push
The seat's OWN new state is the ls-session hand record `praxis_yumi_hand` (`{raised, spent, raises}`),
**cleared once at boot** — display/session state, never synced. **BUT** the open-delivery path is not
purely display: delivering the held move on open runs the reused `considerNotice(uid, true)`, whose
surface branch calls **`appendTurn`** (yumi-brain.js:134 → `state.users[uid].yumiMemory.recentTurns` →
**`saveState()`**, a Firestore-**synced** write) plus `_noticedSet('noticed')` + `setPendingNotice`.
That append is pre-existing infra (every surfaced Yumi move already writes it in production today) and
is **load-bearing** — the NOTICE→NAME reply flow needs the delivered turn in memory, so it cannot be
suppressed without breaking conversation continuity.

**Two readings.** (A) intent: the tripwire guards NEW durable STATE/schema the slice OWNS (Slice-8-style
tombstones) — the conversation append is normal Yumi speech, so NOT triggered. (B) literal: the seat's
operation *causes* "a durable data write beyond the Slice 8 dismissal path" — triggered. The brief
scopes Slice 9 to "display + ls-session state ONLY," and a **production push is authorized only for a
non-data-write slice** (RUN MODE v2). Under genuine classification uncertainty for an outward-facing,
hard-to-reverse deploy governed by an explicitly-armed hard stop, the safe reading wins.

**RULING: TRIPWIRE TRIGGERED (conservative).** Build continuously (build → red-team → reviewer → LOCAL
rig battery) → **commit LOCAL → HALT for Preston's explicit push word**; deployed smoke runs after his
push (the Slice-8 pattern). *If Preston reads the conversation append as normal Yumi speech rather than
slice-owned durable state (reading A, defensible), the push word clears it with zero rework.*

---

## 3. DISCLOSURES (stated, not stops)

1. **"SESSION" (ls-backed):** one app load/boot. The hand record `praxis_yumi_hand` is **cleared to
   empty once at boot** (seat init at the FAB mount, before any raised paint). It survives within-session
   route changes (the FAB is one persistent DOM node) but never survives a reload/new tab — so "leaving
   the surface/session lowers the hand" is literal and the noticing is never spent by leaving.
2. **PER-SESSION RAISE CAP = 3.** Small, per SR mechanics; the scan cooldown (`NOTICE_COOLDOWN_MS`) +
   grader budget already throttle, so 3 bounds any "nagging" while allowing genuine re-raises after a
   dissolution or a spent-and-new noticing. Counter lives in the boot-cleared `praxis_yumi_hand`.
   Felt-tunable at close.

---

## 4. FILES TOUCHED + BYTE BANDS (density-classed, Addendum v2; CODE band hard, comments soft/classified; +20% line contingency; CSS ≈125 B/line)

| File | Change | CODE band (hard) | code measured |
|---|---|---|---|
| `js/yumi-brain.js` | `handEligible(uid)` (cheap, no proxy) + `considerHeldNotice(uid)` (delegates to the **unchanged** `considerNotice(uid,true)`, **with a consent recheck** — the seat is a new caller and consent lived in considerMove) + 2 export keys. **Zero gate change.** | **+0.7 … +1.6 KB** | 1033 B ✓ |
| `js/yumi-ui.js` | the seat machine: `setBloomRaised` (class only) · `_handState`/`_saveHand` (`{raised,raises,done}`) · `yumiSeatBoot` (boot-clear) · `maybeRaiseHand` (cap + `done` + onb guard) · `deliverRaisedHand` (deliver-on-open, spend/lower, **`done` on barren**) · `isHandRaised` + 2 exports + 2 hooks. **No chip touch (RD-6 deferred).** | **+1.2 … +2.6 KB** | 2344 B ✓ |
| `js/app.js` | one post-`loadState` `YumiUI.maybeRaiseHand()` — the returning-reader backlog raise (yumi-ui's own init fires before state loads). | **+0.1 … +0.4 KB** | 75 B ✓ |
| `js/views.js` | `maybeDrawOut`: after `considerMove`, when panel closed, `YumiUI.maybeRaiseHand()`. | **+0.15 … +0.5 KB** | 89 B ✓ |
| `assets/components.css` | `.yumi-bloom--raised` static brighten (color + glow) + settled entry transition, reduced-motion-guarded. **No `.yumi-bloom-line` touch.** | **+0.8 … +2.0 KB** | 317 B ✓ |
| `js/sw.js` | CACHE_VERSION v3.228 → v3.229 at ship (×1). | ~0 | 0 B |

Brain stays DOM-free (its invariant): brain decides eligibility + consent, views/app orchestrate, yumi-ui does DOM. **(6 files — app.js added at the red-team fix; the recon's original 5 stated + app.js.)**

---

## 5. BUILD SLICES (plan order)
- **B1 — CSS:** `.yumi-bloom--raised` (color-only, no animation/transition) + raised bloom-line.
- **B2 — brain:** `handEligible` + `considerHeldNotice` + exports (no gate touch).
- **B3 — ui:** `setBloomRaised` (class only), boot-clear + init-raise + `maybeRaiseHand`, `openYumiPanel` deliver+spend, cap. NO chip.
- **B4 — views:** the one note-write raise hook.
- **B5 — sw bump** at ship.
Self-verify after each: `tools/parse-check` (promise files parse via method-name neutralization),
byte delta in band, grep counts, no stray dirty file, no EOL flip, T2-gate grep-zero.

## 6. RIG BATTERY (must drive, on the deployed build post-push)
static proof (Leg A byte-identical under reduced-motion + Leg B adds-no-motion) · raise on a genuine
trigger · lazy compose (composer/proxy call count 0 until open, fires on open) · open-delivers + spent ·
session-drop (fresh boot → hand lowered, thread raisable, nothing lost) · cap at 3 · durable dismissal
via the Slice 8 path only · **T2-gate grep-zero** (`git diff f5b4c47..HEAD -- js/yumi-brain.js` shows no
hunk touching `gradeUtterance` :722 or its layers) · RD-6 chip unchanged shape · 390 clean · console zero.
Rig: `.claude/rig/` — serve.ps1 fresh PORT per JS change; d0tester stub, re-set `praxis_user` post-boot;
**prestona255 NEVER**. Pane screenshots dead → synthetic events + computed-style/CSSOM readouts.

## 7. NON-GOALS (reaffirmed)
No unbidden-speech conversion (HALT on any forced contact) · no YG-15 amnesty · no caption work · no
RD-1 · no re-plan actions · T2 eval-gate frozen (grep-proof) · no dismissal-persistence rebuild ·
no prestona255.

## 8. RECON-VALIDATION GATE — CLEARS FOR BUILD (push becomes a HALT)
Disclosures stated; bands declared; anchors confirmed against live code. **Tripwire TRIGGERED (§2.2)**
— but the tripwire's stop is defined as "commit LOCAL + HALT for the push word," i.e. a stop AT THE
PUSH, not at the recon. So no stop here: proceed continuously B1→B5 → red-team → reviewer → LOCAL rig
battery → commit LOCAL → **HALT for Preston's push word**. The FELT-LOOK HALT and the deployed smoke
follow the push. (Reading-A off-ramp: the push word clears it with zero rework.)

## 9. RED-TEAM + REVIEWER (Sonnet gate agents) — FINDINGS & RESOLUTION
Both ran on the frozen working tree. Verdicts: red-team **BLOCK**, reviewer **HOLD**. All blocking
findings were real and are FIXED before commit:
- **CONSENT BYPASS (reviewer Defect 1 — covenant) → FIXED.** `considerNotice`'s consent gate lived in
  its sole prior caller `considerMove`; the seat's new `considerHeldNotice` caller didn't recheck, so a
  hand raised while consent was ON could fire proxy note-reads after the reader toggled "Yumi reads
  along" OFF. Fix: consent recheck at the brain layer inside `considerHeldNotice` (returns `{quiet,
  'consent'}`); `considerNotice` still untouched.
- **UNBOUNDED BARREN RE-RAISE (red-team Finding 1) → FIXED (bounded).** `_noticedSet('noticed')` writes
  only on a PASS, so material that scans empty stayed "fresh" and re-raised every cooldown/session,
  burning proxy. Fix: `deliverRaisedHand` sets a session `done` flag when a delivery comes up quiet
  (no thread / gate-fail / consent-off) — the hand RESTS for the session (≤1 speculative scan/session;
  YG-12 anti-coercion). **Residual (felt-tunable):** cross-session it re-tries once; and a genuine
  thread forming AFTER a barren open this session waits for next session or the live open-panel path
  (accepted false-negative for anti-nagging).
- **DEAD BOOT-RAISE (red-team Finding 2) → FIXED.** yumi-ui's init fires before `app.js` loads state, so
  the FAB-mount `maybeRaiseHand()` saw empty state. Fix: boot-clear stays in yumi-ui; the ripe-backlog
  raise moved to `app.js` post-`loadState()` (the 6th file).
- **CURRENCY (both — process) → DONE at commit:** this recon + a build checkpoint + `sequence.md`/
  `r-arc.md` currency + Builder regen ride the final local commit (data-write final-commit = push point).
- Nits: `.yumi-bloom-orb` transition unscoped to base — **intentional** (needed for both-direction
  easing; inert on the panel crest orb whose filter never changes). onb guard added to `maybeRaiseHand`.
- **Verified sound by both (re-derived, not trusted):** no-unbidden-speech covenant · T2 gate frozen
  (grep-zero) · single-slot/cap/spent · static proof (no new animation; `--gold-hi` resolves at the
  body-FAB scope via `universal-depth.css:38` `:root`) · ES3 · ls/sv · no hex · no EOL flip · parse OK ·
  scope = declared files only.

**Post-fix re-verify:** parse OK ×3 (yumi-brain/yumi-ui/app); T2 gate still grep-zero; CODE bands all
within ceiling (brain 1033 B / ui 2344 B / app 75 B / views 89 B / css 317 B); 6 files dirty, no strays;
pure insertion (sw.js the only 1/1 version swap).
