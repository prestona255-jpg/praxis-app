# R-ARC SLICE 2 — persistence, the hard gate (REQ#3; D4 adopted)

**Status: BUILT · RED-TEAMED ×3 (3 BLOCK-COMMIT, all fixed + proven) · RE-BANDED + RESIDUAL #2 FIXED ·
net logic 3,965 B ≤ 4,000 ceiling. ⛔ HELD ON A FORK — the reviewer surfaced a pre-existing image-path
cross-account write (RESIDUAL #10); awaiting Preston's carry-vs-fix ruling before commit. NOT pushed.**
Base **`98738b0`** · `sw.js` v3.211 → **v3.212**. Plan: `docs/r-arc-plan.md` (Slice 2).

> Preston, REQ#3: *"PERSISTENCE = the hard gate: gathered cards and drafts survive beat-switch,
> navigate-away, and reload. Non-negotiable."*

## THE BAND — RE-BANDED, then RESIDUAL #2 fixed within it

**Preston re-banded Slice 2 to a 4,000 B net-logic ceiling** (2026-07-16), ruling the original
+1,500…+3,500 estimate was overtaken by three BLOCK-COMMIT silent-data-loss fixes it could not have
foreseen. He then **ELEVATED residual #2** ("clear before write confirmed") to fix-now, inside that same
ceiling. Final:

| | bytes |
|---|---|
| total LF-delta, `js/views.js` | **+8,542** *(corrected 2026-07-16 from an errant +8,230 the reviewer caught; the gating net-logic number below was always right)* |
| added logic | 4,065 |
| **deleted logic** (dead `nbSessionKey` + old single-key fns) | **−100** |
| **NET LOGIC** | **3,965** ✅ **ceiling 4,000 (35 B headroom)** |
| added comment | 4,566 (comment-only, classified) |
| reconcile | 4,566 + 4,065 − 100 + 11 (blank-line newlines) = **8,542** ✓ |
| `sw.js` | **+0** (same-length version string) |

**Ruling 2 fix (residual #2 — the durability law: never destroy text on a branch that writes nothing):**
`commit()` now **guards on `getCurrentUser()` and returns before touching the store** if signed out, and
`nbDraftClear` moved to the **two sites where `captureNote` is certain to run** — inline on the sync
path, and **inside `finalize()`** on the image path (reached only at `remaining === 0`, so a hung or
aborted IndexedDB transaction never clears the draft). **PROVEN below.** *(notebookActiveTab restore +
cross-window ghost + quota-revert = carried as named residuals per ruling 3.)*

## The gap (confirmed at recon)

`beforeunload` = **0 hits repo-wide**. The composer is a plain `<textarea class="nb-ce">` with no
autosave. `notebookGathered` / `GatherArc` / `GatherName` / `Newborn` are **bare module vars**, so a
reload threw away the gather set, the typed name, and the only "Continue in the workshop →" door.
*(The **workshop** canvas already autosaves via `createWritingCanvas` → `bodyPublic`. That half was never
at risk. This slice is the notebook half.)*

## The build — `js/views.js` only

A device-local, per-uid, **per-tab**, pre-commit store on the sanctioned `ls`/`sv` wrappers. **Nothing
touches Firestore** — `captureNote`/`createSubTheory` stay the only writers of real data, so a stale
session can never forge a record.

| Piece | What |
|---|---|
| `nbDraftKey(uid, activeKey)` | **`praxis_nb_draft_<uid>_<activeKey>`** — the tab is IN the key |
| `nbDraftSave/Load/Clear(uid, …, activeKey)` | uid is a **parameter**, never re-read inside |
| `nbGatherSave` / `nbGatherRestore(uid)` | `praxis_nb_gather_<uid>`; both gated on `notebookSessionUid` |
| `nbInstallDraftHooks` | `visibilitychange`(hidden) + `pagehide`, installed **once** |
| wiring | 7 gather-mutation sites · composer restore-on-mount · 300ms debounce + blur flush · clear on commit |

**⚠ SCOPE REDUCTION vs the plan: `js/state.js` NOT touched** (planned +0.4…+1.2 KB). `ls`/`sv` are
already global. **Note the original justification for this was FALSE** ("per-uid keyed, so B can never
read A's draft" — see BLOCK 2). The reduction still stands, but on a *different* and now-verified basis:
the **owner gates**, not the keying, are what keep accounts apart.

## ⛔ THE THREE BLOCK-COMMIT FINDINGS — all real, all fixed, all proven

### BLOCK 1 — the tab-scope was a READ FILTER over a SINGLE key
`nbSessionKey('draft')` returned one key per uid. The scope was enforced only in `nbDraftLoad`; the
**write was unconditional**, and an empty body wrote `sv(k, null)` — **destroying** whatever tab's draft
sat there. Three clicks, no reload: type in Inbox → switch to Journal → background the page → the empty
Journal composer's flush **erases the Inbox draft**. *The hook installed to prevent loss was causing it.*
**Worse on reload:** `notebookActiveTab` resets to `'inbox'` and is never persisted, so a **book-tab or
Journal draft never restored** and was then erased by the first `pagehide`. **REQ#3 held for exactly one
of three tab classes.**
> **My live "PASS" was trivially-passing** — its evidence string reads `"activeKey":"inbox"`, the one tab
> where the hardcoded default coincidentally matches. The test could not have failed.

**FIX:** the tab is in the key. **PROVEN** — the kill scenario verbatim: keys `..._inbox` and
`..._journal` exist **separately**; Inbox draft **`SURVIVED: true`**. And the previously-impossible case
now passes: a **Journal** draft crossed a real `location.reload()` (`keyCrossedReload: true`), **survived
the post-reload Inbox composer's pagehide** (`survivedInboxPagehideAfterReload: true`), and restored on
return.

### BLOCK 2 — cross-account contamination (a STRICT REGRESSION vs base)
`nbDraftFlushFn` outlived the account; the key was re-derived at write time; **an account switch happens
with NO reload** (`clearUserState(); sv('praxis_user', B); loadState()`). So A's detached textarea could
flush into **B's** key → B's composer restores it → B commits **A's words**, synced to Firestore under B.
This regressed prior fix **14.2**, whose stated purpose is that A's data cannot leak into B's session.
My shipped comment claimed the exact opposite and was **false**.
**FIX:** the composer captures `nbOwnerUid` once; every **draft/gather-store** write is gated on
`getCurrentUser().uid === nbOwnerUid`. **PROVEN for the stores** — after A types → switch to B →
`pagehide`: only `praxis_nb_draft_accountA_inbox` exists, **no B key**, `A_TEXT_LEAKED_TO_B: false`.
⚠ **SCOPE CORRECTION (reviewer, 2026-07-16):** this gates the two S2 *stores*, NOT the base
`captureNote` write — which reads `getCurrentUser()` fresh and is unguarded. On the **multi-image** commit
path only, `captureNote` runs inside `finalize()` after the async IndexedDB puts, so an account switch in
that window would write A's note under B. **Pre-existing base behavior** (the call is byte-identical in
`98738b0`), **narrow** (ms-scale put window vs the 700ms draft window), and **out of S2's store scope** —
carried as **RESIDUAL #10**, surfaced to Preston as a fork, NOT silently absorbed. The sync path is safe
(`captureNote` runs same-tick as the guard, no async gap).

### BLOCK 3 (round 2) — I applied my own law to ONE of my TWO stores
The re-check caught that `nbGatherSave()` still called `nbSessionKey('gather')`, **re-reading the uid at
write time, ungated** — 46 lines below my own comment stating *"Uid is a parameter, never re-read here."*
**Reachable with no click at all:** the gather-name `createWritingCanvas` has a **700ms debounce** whose
`onSave` calls `nbGatherSave()`; an account flip inside that window writes A's gathered ids, typed name,
and newborn into **B's** key — and `nbGatherRestore(B)` then hydrates B's notebook with A's work, where
`notebookCreateSubTheory` would mint it under B. **I had deleted one false comment and left its twin
standing** (`"an account switch re-restores instead of leaking…"`), which was false by the same mechanism.
**FIX:** `nbGatherSave` gates on `notebookSessionUid` (the uid the set was hydrated for) and writes under
it — no signature change needed at the 7 call sites. The dead `nbSessionKey` was removed. **PROVEN** —
after A gathers + names → switch to B → stale save: only `praxis_nb_gather_accountA` exists,
`B_key_contents: null`, `A_WORK_LEAKED_TO_B: false`.

## Hazards designed around (each a real bug avoided)

1. **THE COMMIT RACE.** Enter can land inside the 300ms debounce; the pending timer would then fire
   against a **detached** textarea and re-save the just-committed text as a **ghost draft** beside the
   real note. Guard: **cancel the timer, then clear** (order matters). **PROVEN:** entries 18→19, key
   `null` immediately **and** still `null` after the window elapsed.
2. **LISTENER LEAK.** `buildNotebookWriteline` runs every render — per-composer document listeners would
   accumulate one pair per render, each flushing a detached textarea. Guard: hooks installed **once**.
3. **`visibilitychange`/`pagehide`, not `beforeunload`.** iOS may never fire `beforeunload` (plausibly
   why this repo has none). **Mobile backgrounding is the real loss case.**

## ⚠ A COPY CHANGE, carried — Preston can reverse it

The newborn eyebrow reads **"born just now · draft"**. Persisted across a reload that is **false**, so a
restored newborn is flagged and reads **"draft"** instead — it keeps its door (the point) and drops the
flourish (not the point). *Red-team verified the flag round-trips correctly: fresh → "born just now",
restored → "draft", and a same-session navigate-away-and-back correctly keeps "born just now".*

## Mechanical gates

| Gate | Result |
|---|---|
| Parse (T6) | `PARSE OK: js/views.js` · `PARSE OK: sw.js` |
| **Bytes** | ⛔ **NET LOGIC 3,796 B — BAND BREACHED (+1,500…+3,500). HALT.** Comment 4,165 B classified. `sw.js` +0. |
| Greps | `nbGatherSave` = 8 (1 def + **7** call sites) ⚠ my expectation said 6 — **miscount on my side**, code right. Red-team + reviewer independently census'd every mutation of the four vars: **all 7 persisted, none missing.** |
| Arity | all 3 `nbDraft*` sites pass `(uid, …, activeKey)` correctly — red-team verified exhaustively incl. dynamic dispatch |
| Wrappers only | **0** raw `localStorage` in added lines ✅ |
| ES3 | 0 hits `const`/`let`/`=>`/backtick/`class` ✅ |
| EOL | `i/lf` both ✅ · Byte-locks **14,681** / **10,255** ✅ · Scope: only the 2 files ✅ |
| Tripwires | T1 ✅ · T2 ✅ (yumi-brain byte-untouched) · **T3 n/a — verified: no synced field, device-local only** · T4 ✅ · T5 ✅ · T10 ✅ (0 innerHTML) |
| Prior-fix regression | F-DL latches, `resetSyncLatches`, and the 14.2 switch **byte-untouched** (red-team verified) |

## Live verification — the rig

> **⚠ TWO HARNESS TRAPS CAUGHT, disclosed.**
> **(1) The SW re-registered mid-verification and served a STALE `views.js`.** Caught by an arity tell
> (`nbDraftSave.length` 3 = stale, 4 = fixed). Killed SW + caches and re-verified on the real bundle.
> **A gate run on that stale bundle would have been fiction.**
> **(2) Rig artifact:** localhost has no Firebase session, so `onAuthStateChanged(null)` clears the auth
> stub ~1s after every load. Reload tests re-apply the stub after that fires. **The keys themselves
> crossed the reload untouched — that is the measured claim** (`KEYS_CROSSED_RELOAD`), not an inference.

| # | Case | Verdict |
|---|---|---|
| 1 | navigate-away → back | ✅ text intact |
| 2 | reload (Inbox) | ✅ `KEYS_CROSSED_RELOAD {draft:true, gather:true}`, matches pre-reload |
| 3 | gathered cards survive reload | ✅ bar "1 gathered", `notebookGatheredIds() = 1` |
| 4 | beat-switch (tab) | ✅ doesn't follow to Journal; waiting on return to Inbox |
| 5 | **the commit race** | ✅ 18→19, no ghost draft |
| 6 | **BLOCK 1 kill scenario** | ✅ `SURVIVED: true` — separate keys |
| 7 | **Journal draft across reload** (was impossible) | ✅ survived the Inbox pagehide, restored on return |
| 8 | **BLOCK 2 kill scenario** | ✅ `A_TEXT_LEAKED_TO_B: false` |
| 9 | **BLOCK 3 kill scenario** | ✅ `A_WORK_LEAKED_TO_B: false` |
| 10 | **Ruling-2 loss branch 1** (signed-out commit) | ✅ `TEXT_PRESERVED: true` — guard returns before clearing; draft survives |
| 11 | **Ruling-2 happy path** (signed-in commit) | ✅ note written 16→17, draft cleared, no ghost |
| 12 | **Ruling-2 loss branch 2** (image `tx.onabort`) | ✅ **structural** — the sole image-path `nbDraftClear` is inside `finalize()`, which runs only at `remaining === 0`; an unfired abort leaves the draft. Verified by read, not a live abort sim. |

**A bad probe, disclosed:** an early tab-scope attempt clicked `"☰Paste↗"` (an overflow control, not a
tab) and reported a false negative; a later gather probe ran on the wrong tab and reported
`gatherPersisted: false`. **Both were harness artifacts, re-run correctly, and both pass.** Recorded
because a discarded red result should never vanish quietly.

## Residuals — honest, incl. the ones the red-team named

1. **THE BAND — RE-BANDED to ≤4,000 B (above). Final: 3,965 B, 35 B headroom.**
2. **✅ FIXED (Preston elevated it).** `commit()` clears the draft before the write is confirmed → the two
   loss branches (`captureNote` `!user` early-return; image-path unhandled `tx.onabort`) destroyed text on
   a branch that wrote nothing. Fix: guard on `getCurrentUser()` before touching the store, and clear only
   where `captureNote` is certain to run (sync inline · image inside `finalize`). Proven — cases 10–12.
   ⚠ **One nested edge remains, carried:** if the user signs out *during* the async image puts,
   `finalize`'s `captureNote` no-ops but the clear already ran. Edge of the rare image path; named, not
   built (a second `getCurrentUser` guard inside `finalize` would close it but costs band).
3. **Cross-window ghost draft.** Two windows, same uid, same tab: W2 commits (key cleared); W1 then
   backgrounds → its flush re-saves the committed text as a draft, committable twice. No `storage`-event
   sync exists. Case 5's "no ghost draft" is **single-window scoped** and should not be read wider.
4. **`notebookActiveTab` is still not persisted.** The erasure is fixed; the **restore** is not — after a
   reload the notebook always opens on Inbox with **no signal a Journal/book draft is waiting**. Edge: if
   a book tab's last placed note is deleted, `buildNotebookTabModel` stops emitting the tab and that
   draft key becomes **unreachable from the UI**. Bytes survive; the door doesn't.
5. **Key growth is NOT a quota risk** (red-team measured: ~19 KB even at 130 book tabs). `sv(k,null)`
   leaves a `"null"` string per tab forever — harmless (`ls` parses it to `null`). *Corrects my earlier
   "one key per uid" wording: it is now one per uid **per tab**.*
6. **`sv()` quota failure silently reverts to a STALE draft.** `sv` swallows the error and
   `nbDraftSave` ignores its return, so on quota the *previous* draft stays and restores — reading as
   corruption, not absence. Nothing surfaces it. Low likelihood given (5).
7. **Mobile backgrounding UNVERIFIED on a real device.** Wired and desktop-proven; the iOS
   background-kill case needs the phone leg. **Flagged, not claimed.**
8. **Staged images are not draft-persisted.** `stagedImages` holds blobs in memory until commit (by
   design). Text survives a reload; **staged photos do not.** If REQ#3 is meant to cover them, that is a
   real build (pre-commit IndexedDB staging), not a tweak.
9. **Nit (carried):** `nbDraftFlush` cancels its timer *before* the owner gate decides, so a blocked
   flush drops the pending write with no retry. Self-heals on the next keystroke.
10. **⚠ IMAGE-PATH CROSS-ACCOUNT WRITE — pre-existing, surfaced as a FORK (reviewer, 2026-07-16).** The
   multi-image commit path calls base `captureNote` inside `finalize()` after async IndexedDB puts;
   `captureNote` reads `getCurrentUser()` fresh, so an account switch (no reload) landing in that window
   writes A's text+photos under **B**. Same family as BLOCK 2, but on the base write S2 never touched
   (byte-identical call in `98738b0`), and far narrower (ms put window). A cheap `finalize` guard breaches
   the 35 B band **and** would silently drop A's note instead of writing it under A (the correct fix needs
   `captureNote` to honor an owner uid — a shared-function change, out of S2 scope). **Preston's fork:
   carry as a named pre-existing item (recommended, mirrors F-B), or open a scoped follow-on.** Also
   applies: the sign-out-during-image-puts nested edge (residual #2) is the same window, milder outcome.
11. **Restored newborn can outlive its sub-theory (nit, red-team).** `notebookNewborn` now persists across
   reload; if its sub-theory is later deleted, the "Continue in the workshop →" door routes to a deleted
   id. **Verified benign** — the route tolerates a missing record and `renderSubTheoryBuild` owns the
   not-found render (no crash, no loss; just a dead door). Named beside the existing stale-ref note.
