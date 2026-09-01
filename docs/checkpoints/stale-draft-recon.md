# T13 STALE DRAFT CASE — Stage 0 RECON

STALE-DRAFT STARTED · 2026-08-30 · base 7436606 / v3.284 / HEAD == origin/main

---

## 1. Protocol docs — found / missing (by filename)

FOUND (read this session):
- `CLAUDE.md` (41,879 B) — session rules, seams/lessons, conventions, verification
  invariants (T3 call-site rule; agents-barred/§9 rule), Studio Protocol.
- `PROTOCOL.md` (13,402 B, repo root) — present, listed, governs build discipline.
- `docs/FIX-PROTOCOL.md` (19,013 B) — v1.2, confirmed live by `tools/ground-truth`.
- `BOARD.md` (35,270 B, repo root) — coverage board.
- `.claude/agents/` — all 7 agent files present: fix-implementer, fix-red-team,
  praxis-recon, praxis-reviewer, repo-mapper, studio-mockup, studio-scan.
- `docs/studio/sequence.md` — present (session-start read).
- `tools/ground-truth`, `tools/parse-check`, `tools/studio-build` — all present.

MISSING / NOT FOUND: none of the docs named by CLAUDE.md or FIX-PROTOCOL.md were
absent. No `parse-check-views.js` (correct — CLAUDE.md records its non-existence).

`sh tools/ground-truth` output:
```
HEAD:           7436606
hook gate:      ARMED (core.hooksPath = hooks)
FIX-PROTOCOL:   # PRAXIS — Fix & Build Protocol (v1.2)
agents: 7 files
```

### Can §9 run?
**NOT BY DEFAULT — but the bar is CONDITIONAL, and lifting it costs one sentence.**
This session carries a standing instruction — "Do not call the AgentTool unless the
user requested it" — which bars spawning `fix-red-team`. Read the whole clause: the
bar is **conditional on Preston not having asked.** It is not a permission, a config
line, or a broken agent registration (verified 2026-09-01: no `deny` rule in project
or user settings, no managed-settings directory, and `.claude/agents/fix-red-team.md`
is healthy at `model: sonnet`) — it is a per-session system-prompt injection whose own
text carries its exemption. Preston saying "run fix-red-team on this" in the go-ahead
satisfies the `unless` clause, and the gate then runs normally.

So: barred **by default**, never barred **absolutely**. Per CLAUDE.md (agents-barred
rule, ratified at COVERS 2026-08-29) an UNLIFTED bar is a **HALT-tier condition to be
named and ruled on by Preston before push, never silently absorbed or substituted with
an inline pass.** Named here at Stage 0 so the ruling can be made early rather than at
the gate.

> **CORRECTED 2026-09-01.** This section previously read a flat "**NO.**" That
> overstated the bar, and because this doc became cited precedent it risked
> propagating "the gate is unavailable" when the accurate reading is "the gate is one
> request away." The HALT-tier treatment above is correct for a round where the lift
> was never asked for; it is NOT a statement that §9 *cannot* run.

---

## 2. Repo state

| item | value |
|---|---|
| HEAD | `7436606469d51ddb0d68e3f873bb472d6c6e8d76` |
| origin/main | `7436606469d51ddb0d68e3f873bb472d6c6e8d76` (**equal**) |
| CACHE_VERSION | `praxis-v3.284` (`sw.js:10`) |
| tracked-dirty | **0 files** (`git status --porcelain -uno` empty) |
| untracked | **122** entries |
| `js/views.js` | worktree 1,134,070 B · blob 1,134,070 B · blob CR = **0** |
| `js/integrations.js` | blob 152,974 B |
| `sw.js` | blob 6,041 B |

Base matches the prompt exactly.

---

## 3. Anchors

### 3.1 The draft — write, read, clear

| anchor | file:line | note |
|---|---|---|
| `scanDraftKey()` | `js/views.js:9440` | `praxis_scan_draft_<uid>`; **null when signed out** |
| `scanSaveDraft()` | `js/views.js:9441-9446` | writes `{confident, exceptions, rec, savedAt}` |
| `scanLoadDraft()` | `js/views.js:9447-9456` | reads; **does NOT return `savedAt`** |
| `scanClearDraft()` | `js/views.js:9457` | `sv(k, null)` |
| `scanDraftExceptionCount()` | `js/views.js:9458` | badge input only |
| `scanUpdateNavBadge()` | `js/views.js:9459-9465` | nav pip |

Grep counts (`js/views.js`): `scanSaveDraft` 5 · `scanLoadDraft` 3 ·
`scanClearDraft` **2** · `scanDraftKey` 4 · `praxis_scan_draft` **1 (repo-wide)**.

`scanSaveDraft()` call sites — 4 real callers, all proven:
- `9084` in `scanFinishFill` (end of a shelf capture)
- `9329` in `scanAfterWalk` (walker close)
- `9360` in `scanShelve` (after a batch shelve)
- (definition at `9441`)

`scanLoadDraft()` call sites — 2 real callers:
- `9458` (`scanDraftExceptionCount`, badge)
- `9574` (`renderScan`, entry rehydrate)

`scanClearDraft()` — **exactly ONE caller**, the `else` branch inside
`scanSaveDraft` (`9445`). There is **no other clear path anywhere**: no sign-out
clear, no route-exit clear, no expiry.

### 3.2 What the draft stores

`js/views.js:9444`:
```
sv(k, { confident: scanResult.confident, exceptions: scanResult.exceptions,
        rec: scanResult.rec, savedAt: Date.now() });
```
- Full item lists for **both** bands (each item carries title, author, spineText,
  confidence, resolved, cover, coverCandidates, isbn, alternates, exception).
- `rec` — the frozen found/conf/exc record.
- **`savedAt`** — a wall-clock ms stamp, **write-only**. Repo-wide grep for
  `savedAt` = **1 occurrence** (`views.js:9444`, the write). `scanLoadDraft`
  reconstructs the object WITHOUT it, so nothing downstream can see it.
- There is **no `createdAt`** and **no `touchedAt`**. `savedAt` is overwritten on
  every save, so it is effectively a **last-touched** stamp already — but it is
  discarded at load.

### 3.3 Entry point + rehydrate

- Route: `js/views.js:541` (`parts[0] === 'scan'` → `activeRoute='scan'`),
  dispatch at `851`.
- `renderScan(preMode)` — `js/views.js:9554`.
- Rehydrate: `js/views.js:9574` `scanResult = scanLoadDraft();`
- Resume affordance: `9575-9579` — `#scan-primer-resume`, markup at `9664`.
  It lives **inside the `scan-ov-primer` overlay**, which `scanEnter()`
  (`8452-8461`) opens on every entry (unless offline). So it is on the entry path
  — but it disappears the moment the primer is dismissed, i.e. it is **not present
  on the capture view**, which is exactly the R1 concern.
- `scanEnter()` is called from `9581` (renderScan) and `9763` (offline-retry).

### 3.4 Where a new capture combines with existing items — **the cited anchor is WRONG**

The prompt cites `views.js:8820` for the within-scan absorb. **That line does not
hold it.** The real sites, verified:

| what | file:line |
|---|---|
| `scanRunShelfVision` → dispatch | `js/views.js:8949-8969` |
| `scanResolveAndFill(visionBooks)` | `js/views.js:8979` (def) · called ONCE at `8966` |
| within-scan absorb (`seen` map) | `js/views.js:9020-9024` |
| **`scanResult` overwrite** | `js/views.js:8992-8993` |

`scanResolveAndFill` opens with **fresh locals** (`9000-9006`):
```
var seen = {};                    // idKey -> tray cover element (within-scan)
var classified = { confident: [], exceptions: [] };
var found = 0, confident = 0, exceptions = 0;
```
and on completion **replaces `scanResult` wholesale** (`8992`):
```
scanResult = { confident: classified.confident, exceptions: classified.exceptions,
               found: found, rec: {...} };
```
`scanResult` is assigned in exactly **2 places repo-wide**: `8992` (fresh capture)
and `9574` (draft rehydrate). No merge, no append, no union anywhere.

### 3.5 The confidence computation and every input it reads

`scanIsException(vb, resolved)` — `js/views.js:8140-8143`:
```
if (vb && vb.confidence === 'low') { return true; }
return scanGbNoMatch(vb, resolved);
```
Inputs, exhaustively:
1. `vb.confidence` — from the vision layer (`scanShelfVision`, `8050`), stateless
   per request; nothing carries prior-run state into the prompt.
2. `resolved` — `resolveBook(scanQueryForBook(vb), …)`, `js/integrations.js:2339`.

`scanGbNoMatch` (`8123-8138`) returns TRUE (→ exception) when
`!resolved || resolved.status === 'none'`, or when no candidate title corroborates.

`resolveBook` (`integrations.js:2339-2404`) → `googleBooksSearch`
(`integrations.js:2320-2336`). **`googleBooksSearch` never checks `res.ok`.** It
calls `res.json()` on any status; if the parsed body has no `.items`, it
`finish([])`. `resolveBook` then returns `manualStub` → `status:'none'` →
`scanGbNoMatch` TRUE → **exception**.

The Netlify proxy (`netlify/functions/google-books-proxy.js:89-118`) passes the
upstream Google Books **status and body through untouched** — a 429 arrives at the
client as a parseable JSON error object with no `items`. It is therefore
**indistinguishable from "no results"** on the client, and produces a silent
exception for every book in the batch.

`GOOGLE_BOOKS_API_KEY` is optional in the proxy (`:85-88`); unset → unauthenticated
upstream call. (Prior round recorded the keyless GB quota as exhausted.)

⚠ **This is a competing mechanism for the observed degradation that does not
involve the draft at all.** Stage 1 tests it against the draft hypothesis rather
than assuming either.

### 3.6 `scanLastShelvedIds` + batch Undo

| anchor | file:line |
|---|---|
| `var scanLastShelvedIds = []` | `js/views.js:8872` |
| `var scanShelvedAny = false` | `js/views.js:8873` |
| set (only write of substance) | `js/views.js:9354` in `scanShelve` |
| cleared on receipt timeout | `js/views.js:9415` |
| cleared in `scanUndoShelve` | `js/views.js:9426` |
| `scanUndoShelve()` | `js/views.js:9421-9437` |
| `scanCommitBook(spec, cb, out)` | `js/views.js:8742` |

The v3.284 guard is live at `9350-9353`: `if (id && sout.created) { createdIds.push(id); }`
— only a real create enters the Undo list; a folded EXACT match does not.

**Seam for this round:** `scanLastShelvedIds` is module state, NOT part of the draft.
A DISCARD or an EXPIRY that only touches the localStorage draft cannot, by
construction, alter `scanLastShelvedIds`. Stage 2d must still prove the converse —
that discard/expiry does not run in a state where a pending Undo would be
mis-scoped.

### 3.7 Timestamps on the draft

- created-at: **NO**
- last-touched-at: **effectively YES** (`savedAt`, rewritten on every save) but
  **discarded at load** — so functionally unavailable.
- Net: the draft as READ carries **no usable timestamp**. Adding one (or, cheaper,
  simply *returning* the existing `savedAt` in `scanLoadDraft`) is in scope for R2.
  Drafts written before this round DO already carry `savedAt`, so a legacy draft is
  not the common case — but a draft with `savedAt` absent/NaN must not throw and
  must not expire.

---

## 4. Existing expiry / TTL / cleanup on the draft

**NONE.** Evidence, not impression:
- `grep -rn "praxis_scan_draft"` repo-wide (js + html) → **1 hit**, the key builder
  at `views.js:9440`. Nothing else touches the key.
- `grep -c savedAt js/views.js` → **1** (the write). No reader.
- `scanClearDraft` has **exactly one caller** — the empty-result branch of
  `scanSaveDraft`. No lifecycle, sign-out, route-exit, or age-based clear exists.
- `grep -n "ttl\|TTL\|expire\|expiry\|maxAge\|MAX_AGE\|86400"` in `views.js` returns
  no hit inside the scan module (`8040`–`9800`). The only `86400000` hits are
  `3668-3669`, the notebook "touched today" relative-time helper — unrelated.

A draft therefore persists **indefinitely**, per-uid, per-device, until the next
capture overwrites it or a shelve/walk empties it.

---

## 5. Dead anchors

**One.** The prompt's `views.js:8820` ("the within-scan absorb was cited at
views.js:8820 in a prior round; VERIFY") does **not** hold that code. Line 8820 is
inside the cover-node / crop helpers region. The real absorb is `views.js:9020-9024`
inside `scanResolveAndFill` (def `8979`). Corrected above rather than halted — the
prompt asked me to VERIFY that citation, and the correct anchor was found. Flagging
it here as required.

No other anchor failed to resolve. Every function named in the prompt exists at a
real file:line with real callers.

---

## 6. Premise pressure — stated now, tested in Stage 1

Recon has surfaced a structural fact that bears directly on the premise, reported
here because §1 requires "code that contradicts the fix's premise → STOP (fork)":

> `scanResolveAndFill` uses **fresh locals** for `seen`, `classified`, and all three
> counters, and **overwrites** `scanResult` wholesale at `8992`. There is no code
> path anywhere that unions, appends, or compares a persisted draft against a new
> capture's items. A stale draft cannot enter the new run's confident/exception
> classification **by construction of these two functions**.

⚠ Labelled **INFERENCE from static structure, not yet proof.** It is exactly the
kind of "cannot exist by construction" claim CLAUDE.md records being wrong about
twice. Stage 1 will drive it, not assert it. The competing mechanism (§3.5, a
Google Books 429 laundered into "no results" and thence into an exception for every
book) is the leading alternative and is *cumulative across rapid successive runs*
in a way the draft is not.

A corollary that is NOT in doubt: because `8992` overwrites, a second capture
**silently destroys** an unresolved draft. That is a real defect in its own right,
and it is the thing R1's banner would actually prevent — whether or not the draft
also degrades confidence.

---

## 7. ONE question

**None.** No genuine ambiguity blocks Stage 1. (§5's dead anchor was resolvable;
§6's premise pressure is Stage 1's job, not a fork to be pre-ruled.)

---

## STOP — awaiting go-ahead.
