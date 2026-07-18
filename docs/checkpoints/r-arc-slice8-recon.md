# R-ARC SLICE 8 — THE DISMISSAL STORE (REQ#1c) — RECON

Stage-0, READ-ONLY (praxis-recon, Sonnet). HEAD `62ab1c4` == origin/main (v3.227).
Foundations byte-locked exact (lumen 14,681 · marks 10,255). Tree clean.
**F-D RULED: REMEMBERED — dismissals persist durable/synced, per MATCH, not per
session.** But the recon finds F-D leaves the ARCHITECTURE, SCOPE, match-key,
consent, and merge semantics UNRESOLVED — this recon HALTS the build at a decision
gate (see §FORKS). (Persisted by the Opus build session — the recon agent is
hard read-only and returned findings inline.)

## 1. Every current "dismissal" site (FOUR independent, non-unified mechanisms)

| Site | File:line | Persists? | Scope |
|---|---|---|---|
| `lensSuggestDismiss(pid)` | yumi-ui.js:1577-1582 | **No** — splices in-memory `lensSuggestLenses` only, zero `sv()` | Shelf "Not this" on an AI lens |
| `lens._pid` feeding it | yumi-ui.js:1537 (reassigned every `startLensSuggest` :1522) | positional index, **not stable across regen** | — |
| `mountNameProposal` Reject | yumi-ui.js:401-406 → `recordThreadDismissed` | **local-device only** | Yumi chat NAME-proposal |
| `recordThreadDismissed` | yumi-brain.js:2233 → `_noticedSet(...,'dismissed')` → `ls('praxis_yumi_noticed')` (:2195-2200) | **never syncs** | thread-notice idempotency |
| `considerName` reject branch | yumi-brain.js:2419 — same local store | local-only | name fallback |
| `_noticedOverlaps` (the suppression gate) | yumi-brain.js:2211-2218, called :2395 | reads only `praxis_yumi_noticed` (ls) | fuzzy overlap ≥ NOTICE_OVERLAP_MIN=2 (:2109) |
| Portrait "Set aside" | views.js:21287-21290 → `deleteReaderThread` + `saveReaderModelToFirestore` | **durable+synced but HARD-DELETES** (no tombstone) | Profile through-lines panel |
| `readerModel.threads[i].status==='dismissed'` filter | views.js:21250 | **DEAD CODE today** — filter exists, nothing writes that status | same panel |
| `PORTRAIT_DISMISS_KEY` category proposals | views.js:17401-17411 | **local-device only** (`ls('praxis_portrait_dismissed')`) | a **4th** dismiss mechanism the plan doesn't name |
| `citationPins` | state.js:677-683/742-754/3514 | shaped, **0 writers**, NOT a dismissal | cited by plan as shape precedent only |

**Net: four independent dismiss mechanisms, none durable+synced with tombstone.**

## 2. What a "MATCH" is — no stable match-ID exists today
Two fuzzy-cluster candidates, neither exact-key:
- **Thread/notice**: identity = a set of notebookEntry ids (`memberIds`); sameness = `_idsOverlap(a,b) >= 2` (yumi-brain.js:2201-2218) — the synced twin `readerModel.threads[i]` uses the SAME fuzzy overlap (READER_THREAD_OVERLAP_MIN=2, state.js:1667, in `addReaderThreadFromName` :1677-1727).
- **Lens suggestion**: `lens._pid` = positional render index, reassigned every regen — structurally cannot survive. No content key exists.
**F-D does not say which "match," nor fuzzy-vs-exact.**

## 3. The persistence SEAM — TWO architectures live, not one
**(A) Canonical T3 (arcs/subs/notebook/themes) — dirty-flag + incremental REPLACE-merge:**
ensure fns state.js:644-736/766-807 (+ …FieldsAll :742-754/811-823); migrate() tail :3586-3587;
Firestore twins integrations.js:220-222 (arcs) / 277-279 (subs, the 10.5.9/citationPins precedent).
**(B) profile/readerModel (F-DL3) — full-doc `.set()`, HAND-LISTED fields, no dirty flag:**
seed `ensureUser` state.js:1352-1370; load `loadReaderModelFromFirestore` integrations.js:1000-1029 (unconditional, onAuth :587-606) → `replaceReaderModel` state.js:1598-1633 (REPLACE-on-found/KEEP-on-absent, coerces status→'dismissed' already at :1612); save `saveReaderModelToFirestore` integrations.js:1036-1082, **`.set()` literal field list :1063-1075** (`threads` passed wholesale :1064). ⚠ **A field added to the in-memory shape but NOT to that literal is silently dropped from Firestore every save.** Inherits still-open **F-DL5** race (integrations.js:562-564,598-600). Consent: readerModel LOAD is unconditional; every live SAVE call site is behind `profile.yumiReaderModel` (opt-in default false, state.js:1309-1315).

## 4. Two candidate build shapes (NEITHER ruled)
**Candidate 1 — extend readerModel's existing `status:'dismissed'`** (minimal): repoint Portrait "Set aside" (views.js:21287-21290) from `deleteReaderThread` (hard delete) to an in-place `status='dismissed'` tombstone — which ACTIVATES the already-live dead read-filter (views.js:21250) for free, and rides the existing sync (threads wholesale → NO integrations.js change). Additive, no schema bump. **Covers ONLY the Portrait/readerModel path — NOTHING for lens/notice/category.** Matches the plan's state.js+views.js scope.
**Candidate 2 — a new unified top-level dismissal store** covering lens too: needs new ensureXFieldsAll + migrate tail + NEW integrations.js load/save/merge + a stable content-key for lenses (doesn't exist). Touches yumi-ui.js/yumi-brain.js (outside plan scope, adjacent to the T2 frozen gate). Materially bigger.
The plan's tiny byte estimate (state.js +0.4–1.0KB, ZERO integrations.js) only fits Candidate 1 → implies C1 intended, but F-D never says so, and C1 leaves 3 of 4 mechanisms local-only.

## 5. Data-loss proof plan (4 proofs)
1. **Reproduce:** "Set aside" (deleteReaderThread) removes the record; `_noticedOverlaps` (local) unaffected → Yumi re-notices the same cluster same-device; on device B, guaranteed re-surface. Reproducible at HEAD, zero new code.
2. **Fix:** dismissal survives ls-clear + fresh sign-in on device A (Firestore round-trip) AND suppresses on device B never having seen the notice (write path).
3. **Control:** a DIFFERENT non-dismissed match still surfaces (keyed to identity, not a blanket "Yumi quiet" regression — live risk given considerNotice's existing liberal suppression).
4. **No new silent loss:** cross-device — `replaceReaderModel` REPLACE-splats the WHOLE threads array (not per-record), so two devices dismissing different matches offline can clobber each other. Pre-existing pattern-(B) property; the "Firestore merge bypasses migrate()" lesson, generalized.

## 6. Tripwires
T3 (core — prove BOTH the ensure/backfill AND the Firestore path; for C1 verify the `.set()` literal :1063-1075 carries it — threads passes wholesale so OK, but VERIFY not assume). T4 seed N/A (grep anyway). T1 N/A. T11 N/A (no Room code). T10 if any label renders (`_portraitEsc` at views.js:21261 — match it).

## 7. Density bands (two, per the §4 fork)
| Scenario | File | CODE band (hard) | Comment |
|---|---|---|---|
| **C1 minimal** | state.js | ~1,900–3,420 B (ceiling ≈4,100) | ≤500 |
| | views.js | ~200–600 B | ≤150 |
| | sw.js | ±0, v3.227→v3.228 | — |
| **C2 unified** | state.js | ~3,400–5,300 | ≤700 |
| | views.js | ~600–1,200 | ≤200 |
| | yumi-ui.js (out of plan scope) | ~1,150–2,300 | ≤300 |
| | integrations.js (out of plan scope) | flag at build | — |
⚠ **C1's own re-derived band (state.js 1,900–4,100 B) ALREADY EXCEEDS the plan's 0.4–1.0KB** — flag, don't silently widen (either the plan under-priced the upsert fn, or reuse `addReaderThreadFromName` almost verbatim to land smaller).

## 8. Prior-fix collisions (beside, not on)
Yumi-intel I (readerModel/consent, c5b2bfe — C1 completes its dead `addReaderThreadFromName`); 2.0-2a (the ensure-twin pattern, 601d4f3); 10.5.9 (the "ensured-not-backfilled → undefined on synced record" comment, integrations.js:271-279); F-DL3/4/5 (readerModel single-doc-write race family — riding readerModel INHERITS F-DL5's open write-side race, disclose don't absorb); DWF-1 (false-absence lesson — re-verify, `addReaderThreadFromName` looked unused but is dead-shaped, not absent).

## ANCHOR TABLE (key symbols)
lensSuggestDismiss yumi-ui.js:1577 · startLensSuggest :1522-1545 · mountNameProposal reject :401-406 · recordThreadDismissed yumi-brain.js:2233 · _noticedOverlaps :2211-2218 · considerNotice :2380-2408 · considerName :2413-2429 · NOTICE_OVERLAP_MIN=2 :2109 · readerModel seed/ensureUser state.js:1352-1370 · addReaderThread(live) :1494-1515 (caller views.js:16838) · deleteReaderThread(live) :1519-1558 (callers views.js:16519,16561,21288) · **addReaderThreadFromName DEAD 0-callers :1677-1727** · READER_THREAD_OVERLAP_MIN=2 :1667 · replaceReaderModel :1598-1633 · loadReaderModelFromFirestore integrations.js:1000-1029 · saveReaderModelToFirestore :1036-1082 (`.set()` literal 1063-1075) · onAuth load :587-606 · renderPortraitThreads views.js:21238-21295 (dead filter :21250, live "Set aside" :21287-21290) · PORTRAIT_DISMISS_KEY :17401-17411 · ensure*/…FieldsAll state.js:644-823 · migrate tail :3586-3587 · Firestore twins integrations.js:220-222/277-279 · F-DL3 comment integrations.js:48,56-60 · F-DL5 integrations.js:562-564,598-600 · Slice 8 plan r-arc-plan.md:259-266 · F-D r-arc-plan.md:309,327 · D14 r-arc-shape-b-decisions.md:152-159 · raised-hand fwd-refs (unbuilt) views.js:3324,11071,11413.

## PERSISTENCE-SEAM MAP
```
C1 (readerModel status-flip):
  WRITE  new state.js fn (upsert-by-overlap, mirrors addReaderThreadFromName 1677-1727)
         → readerModel.threads[i].status='dismissed'
  ENSURE already both-path: ensureUser 1352-1370 + replaceReaderModel 1598-1633 (coerces at 1612)
  SYNC   saveReaderModelToFirestore 1036-1082 — threads wholesale (1064), NO literal edit needed
  READ   views.js:21250 — ALREADY LIVE (dead today), activates for free
C2 (new store): new state key + new ensure + migrate tail + NEW integrations load/save/merge +
  new read/suppress sites in yumi-ui.js/yumi-brain.js (outside plan scope).
```

## FORKS / AMBIGUITIES — F-D does NOT resolve these (build HALTS here)
1. **Which mechanism(s) does Slice 8 serve?** C1 fixes only readerModel/Portrait; does nothing for lens, chat NOTICE/NAME, or category proposals.
2. **Plan scope mismatch:** plan says state.js+views.js, but dismiss actions live in yumi-ui.js/yumi-brain.js (near the T2 frozen gate) — unifying necessarily exceeds scope.
3. **Match-key precision:** keep the existing fuzzy ≥2-overlap, or exact key? Unruled.
4. **Cross-device merge:** REPLACE-splat clobbers a sibling device's offline write; F-D's "survives devices" implies correctness here but doesn't address it.
5. **Consent:** should dismissals sync for users NOT opted into `profile.yumiReaderModel`?
6. **Lens has NO content key** — C1 can't cover it; building one is C2-sized.
7. **`addReaderThreadFromName` is fully-built dead code** — the closer analog to reuse (better than citationPins).
8. **Doc-drift:** ROOM-3 handoff (r-arc-room3-handoff.md:30-34) projected ROOM-3 would ship the raised-hand D14 chrome; shipped ROOM-3 has NO such item — scope narrowed silently. Affects Slice 9 planning. Flag.
9. **D14 decisions-doc possibly stale** (says "no sv()" but recordThreadDismissed calls sv() since v3.128).

## CLAIMING-ABSENCE PROOFS
lensSuggestDismiss persistence=0 (full body read); `citationPins[` write=0 repo-wide; addReaderThreadFromName callers=0 (only its own def); readerModel in yumi-brain.js=0 (only readerModelPreamble context-string); raised-hand chrome still absent at 62ab1c4 (same 3 fwd-ref comments predating ROOM-3); byte-locks exact.
