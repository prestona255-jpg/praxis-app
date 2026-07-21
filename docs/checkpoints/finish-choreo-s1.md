# FINISH-CHOREO S1 (PUBLISH SPINE) — build log

HEAD at build `bb2dcae` / v3.239 live. Recon + forks: `finish-choreo-s1-recon.md`.
One commit; sw.js bump rides the push. Data-write → push HOLDs for Preston's word
regardless of green. Three forks ruled: B+D · dual-side-uniqueness header-match ·
client-side ls idempotence (NO firestore.rules change).

## What shipped (3 files)

### integrations.js
- **THE FILTER** (buildPublishedArcDoc:2520): `st.status === 'published' &&` added — only
  finished sub-theories project to the commons (the future half of beta-gate #5).
- **D — block-empty-at-write** in BOTH write paths: `publishArc` (a republish that projects 0
  → unpublish+notice if it was published, else refuse without writing) and `republishLiveArcs`
  (a live arc projecting 0 → unpublish+notice, no empty doc ever written).
- **B — `sanitizeFrozenPublishedArcs` + `_sanitizeOneFrozenArc`**: the legacy frozen-leak
  cleanup. Dual-side-uniqueness header-match keep-predicate (see sim). Kept entries keep their
  FROZEN bytes verbatim; partial removal writes back the filtered stored array (rules-legal —
  only `subTheories` changes, no stamp field); empty result → unpublish+notice. **Client-side ls
  idempotence** (`praxis_sanitized_arcs`), per-device, re-evaluation-safe.
- **Notice queue** (`_commonsQueueExit`, ls-backed, deduped) + `_trimH`.
- **Load hook** (integrations.js:319): `sanitizeFrozenPublishedArcs(u.uid)` at the end of the
  sub-theories load callback — arcs+subs both settled.

### views.js
- **Shared publish ceremony** (`openPublishCeremony`): identity → freshness → "What travels: N
  finished · What stays: M drafts" → confirm. The **≥1-finished gate** lives inside it (0 finished
  → plain explain, writes nothing). Both entries (`_arcHeadPublishControl`, `_opPublishControl`)
  now open it — the own-profile inline panel + its hand-rolled identity/freshness segs are RETIRED
  (one ceremony, one identity resolution via the stored `praxis_publish_identity`).
- **Unpublish confirms** (`openUnpublishConfirm`) on BOTH entries — quiet copy (not danger-red),
  "may never be quieter than deleting a draft."
- **Shared overlay** (`_pubOverlay`): fade+slide, Esc/backdrop close, **no scale()** (P9),
  reduced-motion instant (CSS).
- **`drainCommonsExits`** wired into renderRoute (once/render) + exposed on `window.views`
  (so the sanitize can surface its notice); `_arcFinishedCounts` for the gate + summary.

### assets/components.css
- `.pub-ceremony-*` + `.pub-confirm-*`: fade the scrim, slide the panel, kit tokens
  (`--dur-gentle`/`--ease-emphasis`), reduced-motion instant. Ground-adaptive tokens (works over
  light OR dark route). All 21 referenced tokens confirmed defined.

## Verification
- **parse-gate**: integrations.js PASS · views.js PASS.
- **ES3**: no const/let/arrow/backtick in any new code (grep-clean, both files).
- **Keep-predicate sim** (`scratchpad/sim-sanitize.js`, cscript, predicate copied verbatim from
  `_sanitizeOneFrozenArc`): **9 / 9 PASS** — clean keep · draft removal · no-match · local-side
  collision · **stored-side collision (both removed — residual-b main vector neutralized)** ·
  renamed-published drop (residual a, expected) · **deleted-draft unique-match (residual b, leak
  survives — documented irreducible)** · empty→unpublish · idempotence no-op.
- **firestore.rules UNTOUCHED** — every write path is within `publishedArcKeys()`; the sanitize's
  partial write changes only `subTheories`; no stamp field. Rules-legality is a named red-team item.
- **Retired-CSS residual**: `.op-pub-panel/-seg/-row/-confirm/-hint/-note` are now dead (the inline
  panel was retired). Left for the S-B dead-code sweep; `.op-pub`/`-btn`/`-status`/`-unpub` stay live.

## Residuals (named, privacy-safe) + the S2 open question
- **Residual (a)** — a published sub RENAMED after its arc was frozen loses its frozen public entry
  (its old header no longer matches). Privacy-safe freshness loss, consistent with "privacy > freshness."
- **Residual (b)** — a LOCALLY-DELETED draft's frozen entry whose header UNIQUELY equals a still-published
  sub survives (kept). Narrow, legacy-only (post-filter docs are clean by construction), irreducible without
  an id the legacy docs never stored. Dual-side uniqueness kills the common (both-live) collision vector.
- **S2 OPEN QUESTION (logged, NOT built — Preston 2026-07-21):** a frozen arc whose published sub is later
  REOPENED to draft keeps its frozen public entry (the one-time sanitize won't catch post-sanitize reopens,
  and live-style re-projection never fires for frozen). Whether finished-ness should govern public MEMBERSHIP
  continuously — even for frozen arcs — belongs to S2's threshold/reopening semantics. Nothing built for it here.

## Fixture posture (mirrors FX-1 / OV-1)
- **Headless mechanism proof (evidence of record):** the 9/9 keep-predicate sim above (the FX-1-risk surface,
  the red-team's attack target) + the real-app UI wiring (ceremony/gate/confirm paths).
- **Live Firestore round-trip on `prestonpraxistest` = Preston's corroboration:** the actual read-sanitize-write
  cycle needs an interactive Firebase sign-in (2FA), which is prohibited for the agent. The exact fixture
  click-path (publish an arc with draft subs pre-filter, freeze, reload, observe the sanitize) is the OV-style
  step Preston runs when laptop + test account align. `prestona255` read-only always.

## Byte deltas (BYTES, LF-normalized — the standing self-check) — after the correction pass
integrations.js **+10,719** · views.js **+7,795** · components.css **+3,381** · launch-runway.md **+106**.
All clear the recon's pre-fork floors (the sanitize subsystem grew the scope after FORK #2; floors are floors,
not targets). No EOL flip (`git ls-files --eol` uniform; 0 bare-LF lines in the CRLF files).

## Gates — fix-red-team + praxis-reviewer both RAN; every finding ADDRESSED
Both independently re-derived the CODE as sound (parse ×2, ES3, sim 9/9 re-run with guard-removal counterfactuals,
rules-legality of every write path, foundations lock, no EOL flip, scope). Findings + dispositions:
- **RED-TEAM #1 [BLOCK] → FIXED.** The sanitize fired UNCONDITIONALLY after the sub-theories load; on an
  'error'/'absent' load its own `publishedArcs` read could succeed against stale/incomplete local subs → a
  legitimately-published entry wrongly removed / the arc auto-unpublished from a transient network failure (no
  rename/edit/delete needed — distinct from residual a/b). FIX: the call now sits INSIDE the
  `stResult.status === 'found'` branch (integrations.js:~308) — runs ONLY when the remote sub-theory doc
  definitively merged; retries on the next clean load (ls marks nothing until a definitive outcome).
- **RED-TEAM #4 [nit] → FIXED.** `_arcFinishedCounts` now requires a non-empty header for the finished count,
  matching `buildPublishedArcDoc`, so the gate can't claim "1 finished" then have D block an empty write.
- **REVIEWER #10 [BLOCK] → FIXED.** FORK #2 + FORK #3 rulings appended verbatim to `finish-choreo-s1-recon.md`
  (matching FORK #1) — no longer resolved only in a code comment (FORK-VERBATIM).
- **Stale docstring (both gates) → FIXED** (views.js:~20011 now describes the shared ceremony). Byte deltas +
  token count (17→21) corrected here.
- **RED-TEAM #2 [residual, documented]** — `republishLiveArcs`' D-branch flips `arc.published` locally via
  `markArcsDirty` (NOT `saveState` — avoids recursion inside the flush), so `/userArcs` persists the flag on the
  NEXT save; the PUBLIC doc delete + `publicProfiles` arrayRemove fire immediately (no empty doc ever exposed). If
  a session ends before any further save, `/userArcs` can hold a stale `published:true` on reload — a display-
  desync, NOT a leak, self-healing on any subsequent activity. (`publishArc`'s D-branch + the sanitize's empty-
  branch call `saveState()` directly and persist at once; this asymmetry is the documented cost of no-recursion.)
- **RED-TEAM #3 [residual, named debt]** — the ceremony's identity CHOOSER (shows pen/display + persists the
  choice) is per-ceremony; the RESOLUTION at write IS canonical (`praxisResolvePublicName`). Consolidated 2
  hand-rolled choosers → 1, not to 0 (chooser ≠ resolver). Named debt per the brief's escape hatch.

## Re-red-team on the corrected sanitize trigger — RED-TEAM: CLEAN (2026-07-21)
Both fixes verified sound: FIX #1 single gated call site (only on `'found'`), `_sanitizeMarkDone` only on
definitive outcomes (no-op / confirmed-write / doc-absent — never on read/write failure), `'found'` subs
authoritative (the REPLACE-merge runs just above), no permanent strand (a published user necessarily achieved a
`/userSubTheories` write, so `'absent'` on every load is unreachable; `'error'` is transient/retried). Keep-
predicate independently re-transcribed → 9/9 + stored-side-uniqueness counterfactual confirms the guard is
load-bearing. FIX #4 byte-for-byte matches `buildPublishedArcDoc`. Parse/ES3/EOL/rules/foundations re-clean.
- **Residual (arcs-status not co-gated) — RESOLVED, Preston ruled HARDEN (2026-07-21).** The sanitize is now
  **co-gated on BOTH loads being authoritative** — `arcResult.status === 'found' && stResult.status === 'found'`
  (integrations.js:319; `arcResult` is the enclosing arcs-load result in the closure). state.arcs (which selects
  WHICH arcs to sanitize) and state.subTheories (the keep-predicate's join) are both current, or the sanitize
  doesn't run and retries next clean load. FIX #1's principle verbatim: a destructive op runs on definitive data
  or not at all. **The residual is ELIMINATED, not documented.** integrations.js delta +10,719 → **+10,881 B**.

## Re-red-team on the CO-GATE — RED-TEAM: CLEAN (2026-07-21)
Independently verified: `arcResult` is a live single-shot closure reference at integrations.js:319 (both loads are
one-shot `.get().then()` with `done` guards; the arcs if/else runs to completion — incl. saveState + render —
before the nested subs load fires), so the effective gate is `(subs 'found' AND arcs 'found')`. Exactly one call
site (`:320` call, `:2832` def). Keep-predicate re-transcribed into a fresh harness → 9/9, and residual (b) still
honestly SURVIVES (the co-gate doesn't sweep it under). parse exit 0 · foundations `070679b0`/`772886c0` · byte
delta **+10,881** (LF-normalized, exact) · firestore.rules untouched · F-DL1 latches untouched · scope = the 4
files. **No permanent strand** (`/userArcs` writes are gated on the `arcsLoaded` latch which opens on ANY settled
status, so any published user reliably gets arcs `'found'` on the next healthy sign-in; perpetual non-'found' =
offline, where NOT running a destructive op is correct, and the sanitize idempotently retries). **The added line's
only ES3-token hit is a backtick INSIDE a comment (`arcResult`), not code — cleared.** Residual (arcs-status)
ELIMINATED. Both original gate BLOCKS fixed; the co-gate hardening clean. Data-loss tier → HOLDS for Preston's
read + explicit push word.

## FINAL-PASS — FINISH-CHOREO S1 (build base bb2dcae) → CACHE_VERSION v3.240
```
FILES: js/integrations.js · js/views.js · assets/components.css · docs/launch-runway.md
       + docs/checkpoints/finish-choreo-s1.md + finish-choreo-s1-recon.md   (+ sw.js bump at push)
PROOF 1 keep-predicate (9 cases incl. both residuals): sim 9/9 PASS, guard-removal counterfactual-verified   PASS
PROOF 2 no-empty-write (D): publishArc + republishLiveArcs unpublish+notice on 0 finished — never write empty   PASS
PROOF 3 sanitize-safety: runs ONLY on a 'found' load; read/write failure leaves the arc UNMARKED (retry)         PASS
PROOF 4 rules-legality: every write ⊆ publishedArcKeys/publicProfileKeys; firestore.rules untouched; 0 sanitizedV1 PASS
BYTES: integrations +10,881 · views +7,795 · components +3,381 · launch-runway +106 · sw.js +0 (bump at push)
PARSE: harness self-validates; integrations.js + views.js exit 0
FOUNDATIONS md5: lumen-amber 070679b0 ✓ · marks 772886c0 ✓
RED-TEAM: 1 block (sanitize-on-stale) FIXED + #2/#3/#4 addressed    REVIEWER: 1 block (fork record) FIXED
RESIDUALS: (a) renamed-drop · (b) deleted-draft-unique · #2 flag-lag display-desync · #3 chooser-not-resolver debt
TIER: DATA-LOSS — HOLDS for Preston's genuine human read + explicit push word (§5 path C, until Build-3 smoke).
      Live read-sanitize-write on prestonpraxistest = Preston's corroboration (interactive sign-in, prohibited for the agent).
```
