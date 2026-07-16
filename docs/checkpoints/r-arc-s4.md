# R-ARC SLICE 4 — ONE DOOR (EXPANDED) — BUILD LOG

**Status: WS-A BUILT · SELF-VERIFY PASS · gate suite running (red-team → reviewer → rig → checkpoint).**
Base `379dead` / v3.217. Band ruled + approved. Model: OPUS. Unattended. **S4-6 RULED (A) FOLD** — Yumi's
Accept pre-gathers the noticed notes + offers the name in the notebook gather bar, routes to the one door;
name is an OFFER (editable/clearable, never sticky; cleared → unnamed basin); reader-model "named thread"
write goes QUIET + documented (regains signal via the Wave-C raised-hand seat).

## Rulings recorded (Preston, band gate)
Band APPROVED as presented. S4-1 YES (4 sites; plan's "5" corrected — `r-arc-plan.md:216/221` done).
S4-2 YES (app-wide via one cluster). S4-3 GATHER primary · ask Yumi 2nd tier · Add-to-arc/File-to-book/
Send-to-sub-theory overflow · Delete off-row; RIDER: Send-to-sub-theory stays reachable in overflow.
S4-4 YES (optional pre-selected arc; both contexts). S4-5 NARROW (scope `.arc-picker-panel` to light tokens).

## WS-A design (the one-door collapse) — T9 target: exactly ONE live `createSubTheory` call site
Today 3 call sites: route-a `views.js:561` · notebook door `views.js:2630` · Yumi thread `views.js:3324`.

- **Route (a) retires — MECHANICAL (S4-4).** Remove the `#arc/<id>/new-subtheory` handler (`views.js:551-577`).
  The two "＋ Add a sub-theory" controls (`views.js:12717-12726` rail · `views.js:13108-13120` header) funnel
  into the ONE door — `notebookCreateSubTheory` **generalized** to accept an optional pre-selected arc + an
  empty note set. Arc-detail context (arc known, no gathered notes) lands in the workshop (preserves flow a's
  current end-state; least-change). The sole surviving `createSubTheory` call site is the door's (`2630`).
- **Notebook door (b) stays — MECHANICAL.** `notebookCreateSubTheory` is THE door; its create is the one
  `createSubTheory` call. Generalized so a pre-selected arc + zero gathered notes is valid (arc-detail entry).
- **Yumi thread (c) — ⚠ NEW FORK S4-6 (below).** `nameSubTheoryFromThread` (`views.js:3308-3350`) holds the
  3rd `createSubTheory` call AND auto-mints an arc (`createArc`, `views.js:3317`) + creates silently (no door)
  + records a reader-model "named thread". Retiring this call site changes the shipped Yumi NOTICE+NAME move
  (v3.129); how it retires is a covenant/design decision, not mechanical.

## ⚠ FORK S4-6 (NEW) — the Yumi NAME move's fate on flow (c) retirement — HALTED
**Why a HALT, not carried:** it changes a shipped Yumi move's behavior with covenant + reader-model
implications; (A) and (B) diverge materially — a Yumi-grammar design call (THE FORK RULE + MODEL LAW). The
plan's "retire OR fold (c)" grants latitude but does not pick; F4's covenant ruling (Yumi's noticing returns
via the Wave-C raised-hand seat) may bear on it. Accept can't be left dead (S1 law / DWF-1 lesson).

- **(A) FOLD — reroute Accept into the one door [RECOMMENDED].** `mountNameProposal` Accept
  (`yumi-ui.js:388-397`) pre-gathers the member notes + pre-fills the name in the notebook gather bar,
  navigates to `#notebook`; the reader picks the arc and hits Create (the ONE door). True one-door (T9 ✓);
  preserves Yumi's noticing; covenant-aligned (she proposes, the reader creates through their own surface).
  **Consequence:** the auto reader-model "named thread" recording (`addReaderThreadFromName`) no longer fires
  at Accept — default = goes quiet + documented (no scope creep into yumi-intelligence), unless you want it
  threaded into the door's create.
- **(B) REMOVE — retire the move's create entirely.** Delete `nameSubTheoryFromThread` + the Accept-create;
  Yumi still notices but no longer offers to create. Simpler; guts a shipped move + drops the noticing→naming
  affordance.

**Recommendation: (A) FOLD**, reader-model recording quiet + documented (cleanest, reversible, keeps the move).

## WS-A — BUILT (One Door collapse) — 6 edits, js/views.js + js/yumi-ui.js
1. Route (a) `#arc/<id>/new-subtheory` handler REMOVED (`views.js:551-577` → 5-line retirement comment). The
   `#subtheory/<id>/build` route (the build surface) is untouched.
2. `notebookCreateSubTheory(opts)` GENERALIZED — the sole `createSubTheory` call site. Notebook gather
   (opts absent) = create from gathered notes → newborn card. Arc-detail (opts.arcId) = pre-selected arc, no
   notes → empty draft → `location.replace('#subtheory/<id>/build')` (preserves the retired route's landing).
3+4. The two "＋ Add a sub-theory" controls (`views.js:12722` rail · `views.js:13116` header) repointed from
   the retired hash to `notebookCreateSubTheory({ arcId: arcId })` (S4-4, both entry contexts served).
5. `nameSubTheoryFromThread` RETIRED → replaced by `notebookGatherFromThread(memberIds, proposedName)` (the
   S4-6 FOLD): pre-gathers the noticed notes + offers the name in the gather bar, marks the thread 'named'
   for idempotency ONLY (no reader-model write), routes to `#notebook`. No auto-mint, no silent create.
6. `yumi-ui.js` Accept (mountNameProposal) repointed to `notebookGatherFromThread` + a new message.

### WS-A self-verify — PASS
| Gate | Result |
|---|---|
| Parse (cscript) | `PARSE OK: js/views.js` · `PARSE OK: js/yumi-ui.js` |
| **T9 one door** | `createSubTheory(` = 1 def (`state.js:2073`) + **exactly 1** live call (`views.js:2617`) — was 3 |
| Route orphan | 0 live `new-subtheory` hash setters; a stale `#arc/<id>/new-subtheory` bookmark falls through to the arc-detail route (renders the arc, graceful — red-team to confirm) |
| `nameSubTheoryFromThread` | **0** (fully retired) |
| `notebookGatherFromThread` | def `views.js:3306` + 1 caller `yumi-ui.js:395` |
| `addReaderThreadFromName` | def only (`state.js:1671`), **0 callers** — reader-model "named thread" write QUIET by ruling (state.js untouched) |
| ES3 | added lines clean (var/function/concat; grep hits are false positives) |
| Bytes | views **−371 B** · yumi-ui **+253 B** — both within band |
| EOL | diff surgical (views 67+/80−; yumi-ui 8+/5−, NOT a 21k-line flip); HEAD blob CR=0 (commits LF) |
| Tree | only `r-arc-plan.md` + `views.js` + `yumi-ui.js` dirty; no strays |

### WS-A residuals to disclose (for the gate + felt pass)
- **R1** `addReaderThreadFromName` orphaned by the S4-6 ruling (intended; the named-thread reader-model
  signal returns in Wave C via the raised-hand seat). Left defined in state.js (band=0).
- **R2** the fold drops the old body-seed (Yumi's `oneLineRead` no longer pre-fills `bodyPublic`) — more
  covenant-aligned (the reader writes their own), disclosed.
- **R3** stale `#arc/<id>/new-subtheory` deep links now render the arc detail (graceful fallback), not a mint.

### WS-A gates — red-team (found + fixed a BLOCK) → live-verify PASS
**fix-red-team: 1 BLOCK (fixed), 1 CONCERN (documented as R4), rest CLEAN.**

- **BLOCK (fixed):** the fold silently lost its gather whenever the Notebook hadn't rendered this session.
  `nbGatherSave` no-ops until `notebookSessionUid` is latched (only by `renderNotebook`→`nbGatherRestore`),
  and the navigation's `nbGatherRestore` then RESET the in-memory gather + reloaded an unwritten key —
  dropping the whole hand-off while Yumi's message claimed success (COPY-IS-A-CONTRACT). Reachable on the
  common path (boot→#home, NOTICE from book-detail marginalia — no Notebook render). **FIX:** latch
  `notebookSessionUid = user.uid` BEFORE `nbGatherSave()` in `notebookGatherFromThread` — makes the save
  persist AND the restore a no-op. Parse OK; +7 lines. Latching to the CURRENT uid keeps nbGatherSave's
  owner-gate honest (no cross-account leak).
- **R4 (documented, from the CONCERN):** the fold REPLACES an in-progress manual gather (Yumi's Accept
  discards a staged selection/arc/name toward a different sub-theory — notes persist, staged work is lost).
  Matches the ruling ("pre-gathers the noticed notes" = set the gather). Merge-vs-replace is a felt-pass
  follow-on if Preston wants it; replace shipped (simpler, avoids a confused mixed-intent gather).

**Live-verify (rig port 8796, d0tester, SW/caches killed, fixed JS confirmed live) — INTERACTIVE-CONTROL SWEEP:**
| Control | Fired | Result | PASS |
|---|---|---|---|
| **Yumi fold** (from the BLOCK scenario: #home, `sessionUid=null`) | `notebookGatherFromThread(3 notes, "Offered Name")` | latched d0tester · gather **persisted** (3 + name) · routed #notebook · survived render — bar: "3 gathered · No arc chosen · Choose an arc · Create sub-theory →" · offer name in field | ✅ (was silent no-op pre-fix) |
| **Notebook door** "Create sub-theory →" | real `.click()` | subs 4→5 · gather cleared · newborn card in DOM · new sub-theory on arc, header "Offered Name", **3 evidence** | ✅ |
| **Arc-detail "+ Sub-theory"** (canonical) | real `.click()` | subs 5→6 · empty draft (0 evidence, no header) on the arc · routed `#subtheory/<id>/build` · build surface renders (currentSubId matches) | ✅ |
| **Yumi Accept** wiring | code-confirm | `mountNameProposal` calls `notebookGatherFromThread`, not the retired fn | ✅ |

Console clean through the sweep (only the pre-existing benign `yumi-voice.md` 503). Bytes after fix: views
**+206 B** vs base (within band); diff surgical (views 74+/80−, yumi-ui 8+/5−).

### WS-A praxis-reviewer — **VERDICT: CLEAR TO COMMIT**
Independently re-derived every gate: T9 (1 live `createSubTheory` call), the BLOCK-fix sound on all 3 paths
(same-uid no-op, account-switch writes fresh values under the current real uid, signed-out early-returns),
orphan safety (`nameSubTheoryFromThread` 0 refs, `addReaderThreadFromName` def-only/0-callers), ES3 (0
violations in 82 added lines), parse OK, byte band (views +206 B, yumi-ui +253 B — both within), EOL surgical
(74+/80−, 8+/5−; the `i/lf w/crlf` is the repo-wide pre-existing convention), state.js 0, byte-locks exact
(MD5 match), covenant/reader-model readers untouched. **No blocking findings.**

Two non-blocking residuals (recorded, not reopened — reviewer had already CLEARED):
- **R5 (reviewer catch — latent coupling):** the fold does not touch `notebookNewborn`; a stale (possibly
  cross-account) newborn would ride the next `nbGatherSave()` payload — safe TODAY only because an unrelated
  pre-existing guard in `buildNotebookRightLeaf` (`views.js:2241`, "a fresh gather supersedes the last birth
  card") nulls it + re-saves before any render (the fold's `any`-check guarantees `ids.length>0`). Named so a
  future edit to that guard can't silently reopen a cross-account newborn leak.
- **R6 (rider edge — felt-pass judgment):** the Yumi-panel Accept reverts an emptied field to `proposal.name`
  (`yumi-ui.js:389-390`) BEFORE the fold, so clearing is honored at the DOOR (gather bar → basin) but not the
  panel. Defensible either way (panel-revert protects Yumi's suggestion from an accidental clear; the reader
  deliberately clears at the door). Left as-is; Preston's call at the felt pass whether the panel must also
  honor clear-to-basin. Reviewer PASSED the rider at its real target (the creation surface).

**WS-A gate suite COMPLETE:** self-verify ✓ · red-team ✓ (BLOCK found+fixed) · live-verify ✓ (control sweep) ·
reviewer ✓ CLEAR · checkpoint ✓. **Nothing committed** (commit is the final gate after WS-C). → WS-B.

---

## WS-B — BUILT (FF-8 action-row collapse) — js/views.js + assets/components.css
Design (S4-3): the note's 6 equal-weight actions → one primary + a quiet overflow.
- **Primary row** (`.notebook-entry-acts`): **Gather** (primary) · **ask Yumi** (2nd tier) · **⋯** toggle.
  (Journal note: 🔒 lock + ⋯.)
- **Overflow** (`.notebook-entry-overflow`, hidden until ⋯): **Add to arc** · **File to book** (inbox only) ·
  **Send to sub-theory** · [rule] · **Delete** (+ confirm/cancel) — destructive OFF the row, `--danger`,
  separated below a `.nb-of-sep` rule. Send-to-sub-theory stays reachable in overflow (S4-3 RIDER ✓).
- ⋯ = a `<button.notebook-entry-more>` with `aria-label` + `aria-expanded`, toggling `.is-open`.
- **DESIGN NOTE (felt pass):** the overflow is an INLINE REVEAL (a block below the row), not a floating
  popover — lowest-risk, no z-index/overlay chrome. Preston's call at the felt pass on the exact form.

### WS-B self-verify — PASS
| Gate | Result |
|---|---|
| Parse | `PARSE OK: js/views.js` |
| Bytes | views cumulative **+1,563 B** (WS-A+B; band −4…+7 KB) · components.css **+2,269 B** (band +1.0…+4.0 KB) |
| Structure | 3 overflow actions + delete-trio + `.nb-of-sep` → `overflow`; `moreBtn` → `acts`; `card.appendChild(overflow)`; **no stale** `acts.appendChild` for moved actions |
| CSS diff | components.css **39+/0−** — pure additions, ZERO existing rules modified (no bleed vector) |
| ES3 | clean · EOL repo-norm · diff surgical (views 105+/86−) |

### WS-B live-verify (rig 8796, d0tester, fresh JS+CSS) — INTERACTIVE-CONTROL SWEEP PASS
| Control / check | Result |
|---|---|
| FF-8 live | `renderNotebookEntry` has overflow+more; CSS overflow `display` none→flex |
| Primary row | `["Gather","ask Yumi","⋯"]` |
| Overflow | `["Add to arc","Send to sub-theory","<sep>","Delete","confirm delete","cancel"]` (File-to-book absent on a filed note — correct) |
| ⋯ toggle | `display` none→flex→none · `aria-expanded` false→true→false |
| Delete (moved) | click → confirm/cancel shown · cancel → restored · color `--danger` rgb(194,96,58) |
| Add-to-arc (moved) | fires → picker mounts (dark-on-light — WS-C fixes) |
| ⋯ color | `--lum-ink-4` rgb(151,139,109) (quiet) |
| Shared-CSS bleed | Shelf 51 covers · Arcs 13 · Notebook — all render; 0 stray overflow; **console clean** |

### WS-B red-team — 1 BLOCK (fixed) + 1 nit (fixed)
- **BLOCK (fixed) — mobile 44px touch-target regression.** The notebook's `@media (max-width:759px)` block
  (`components.css:12024-12034`) grants `min-height:44px` to `.notebook-entry-acts a` + `.notebook-entry-gather`.
  WS-B moved the 6 actions OUT of `.notebook-entry-acts` into `.notebook-entry-overflow` and added the `⋯`
  `.notebook-entry-more` button — **neither** inherited the 44px floor, so at 390 the ⋯ (the sole mobile
  gateway) + all overflow controls dropped to ~13px targets. I had also skipped the 390 sweep. **FIX:** added
  `.notebook-entry-overflow a` + `.notebook-entry-more` to the mobile 44px rule.
- **Nit (fixed) — focus-ring width asymmetry.** The primary-row links' ring was `@media(min-width:1200)`-only
  (pre-existing); the new overflow rings are all-width. **FIX:** folded `.notebook-entry-acts a:focus-visible`
  into the all-width ring so ALL note-action controls ring at every width.
- Re-derived CLEAN by the red-team: closures/no-dead-controls, per-card ⋯ independence, CSS additive (43/0,
  now 48/0), journal path, structure-coupling, ES3.

### WS-B mobile (390) live-verify — PASS (the leg I owed)
Viewport 390, `@media(max-width:759px)` active. Touch-target heights (getBoundingClientRect):
⋯ **45** · Gather **45** · Add-to-arc **44** · Send-to-sub-theory **44** · Delete **44** · confirm **44** ·
cancel **44** — all ≥44px. Desktop (≥760) re-confirmed: structure `[Gather, ask Yumi, ⋯]` intact, toggle
none→flex, ⋯ ~15px (no mobile forcing). components.css now **+3,011 B** (within band); diff 48+/0− (additive).

### WS-B praxis-reviewer — **VERDICT: CLEAR TO COMMIT**
Re-derived every gate: mobile 44px fix (overflow a + ⋯ now floored, incl. confirm/cancel via cleared inline
display), CSS additive 48/0 (no bleed — `.is-open` always compound-scoped, `notebook-entry-more/overflow`
classnames single-call-site), structure/closures intact, ⋯ per-card + aria synced, focus rings all-width (the
≥1200 rule's `.notebook-entry-acts a` is now a harmless redundant dup), ES3 0 violations, byte deltas EXACT
(views +1,563 / components.css +3,011 / yumi-ui +253 — reviewer self-caught a CRLF-vs-LF measurement false
alarm), EOL surgical, state.js/yumi-brain.js untouched, byte-locks exact, journal path non-empty. **No blockers.**
Residuals (non-blocking): a pre-existing comment at views.js:14518-14522 reads slightly stale post-restructure
(clarified by the new FF-8 comment 3 lines below); sw.js CACHE_VERSION untouched (correct — commit is after WS-C).

**WS-B gate suite COMPLETE:** self-verify ✓ · red-team ✓ (BLOCK+nit fixed) · live-verify ✓ (desktop + 390) ·
reviewer ✓ CLEAR · checkpoint ✓. → WS-C.

---

## WS-C — BUILT (arc-picker ground-correct, S4-5 NARROW) — assets/components.css only
The BOUND FINDING: `.arc-picker-panel` reads generic `--surface-2`/`--ink*`/`--gold-*`; `body[data-ground="dark"]`
(theme.css:362) repoints them dark → the picker rendered a **dark box on the light working page** on all 4
call sites (notebook gather, shelf move-to-arc, book-detail, per-note add-to-arc) + the send-to-sub-theory
mirror — every `.arc-picker-panel` mounts inside a `.lum-amber-deep` light surface. **Fix (S4-5 NARROW):** one
additive block re-points the picker's OWN tokens to the surface's light `--lum-*` set + a legible row-hover
(the base hover collapses to `--gold-soft` on `--gold-soft`). Scoped to `.lum-amber-deep .arc-picker-panel`
(specificity beats the base) — the picker never mounts on genuinely-dark chrome.

```
.lum-amber-deep .arc-picker-panel{ --surface-2:var(--page-2); --ink:var(--lum-ink); --ink-2:var(--lum-ink-2);
  --ink-3:var(--lum-ink-3); --ink-4:var(--lum-glass-bd-2); --border:var(--lum-glass-bd-2); }
.lum-amber-deep .arc-picker-row:hover{ background:color-mix(in srgb,var(--lum-gold-l) 20%,transparent); color:var(--lum-ink); }
```

### WS-C self-verify — PASS
| Gate | Result |
|---|---|
| Bytes | components.css cumulative (WS-B+C) **+3,851 B** — within band +1.0…+4.0 KB (trimmed the comment from +4,067 for headroom) |
| CSS diff | additive (**56+/0−** — WS-B 48 + WS-C 8); scoped `.lum-amber-deep .arc-picker-panel` — no existing rule modified, no over-broad selector |
| Tokens | `--page-2` global light-fixed (theme.css:32); `--lum-ink/-2/-3`, `--lum-glass-bd-2`, `--lum-gold-l` defined light in every `.lum-amber-deep` surface scope |

### WS-C live-verify — PASS (via injected rule; see caveat)
Real dark-ground condition (`body[data-ground="dark"]`, `.lum-amber-deep` ancestor). Picker computed styles
with the WS-C rule applied — **notebook · shelf · book-detail all identical:** bg **`rgb(252,246,232)` LIGHT**
(was `rgb(74,49,25)` dark) · row ink **`rgb(36,23,16)` DARK** (high contrast) · border `#e3d8c1` light · label
`#645940`. App-wide (S4-2): the one shared rule re-lights all 4 sites.
**⚠ RIG CAVEAT:** the rig SW served a stale `components.css` (precached, pathname-keyed — the `<link>`
cache-bust couldn't bypass it; a `fetch` could). The rig **server** serves the fresh file (probed: 716,409 B,
WS-C rule present). Live-verify therefore injected the EXACT WS-C rule text (matches disk + server). The
DEPLOYED build serves the file directly once CACHE_VERSION is bumped at push. Rule EFFECT is proven; the
VISUAL GATE (Preston's eyes on deploy) is the felt confirmation.

### WS-C red-team — **CLEAN** (no BLOCK, no CONCERN)
Re-derived from the cascade (not the stale-SW rig): direct-set custom props beat inherited (WS-C wins on
every mount); every mount surface re-lights `--lum-ink` to dark `#241710` (no invisible cream-on-light);
`--page-2` ground-stable light; `--ink-4` feeds only border/underline hairlines (not text); all 3 pickers +
mirrors carry `.arc-picker-panel`/`.arc-picker-row`; hover legible; no bleed. Non-blocking note: the selector
is broader than today's mount set (correct-by-construction, documented in the WS-C comment).

---

## FINAL COMMIT GATE

**sw.js:** `CACHE_VERSION 'praxis-v3.217' → 'praxis-v3.218'` (1 line, blob LF).

**Final whole-slice self-verify — PASS:** parse OK (views/yumi-ui/sw) · T9 = 1 live `createSubTheory` ·
bytes views +1,563 / yumi-ui +253 / components.css +3,851 (all in band) · frozen (arc-constellation,
tradition-forms-arc, yumi-brain) + state.js **0 diff** · byte-locks 14,681 / 10,255 exact · EOL surgical ·
tree = the intended 5 tracked + 2 new checkpoints, no strays.

**Final whole-slice praxis-reviewer — VERDICT: CLEAR TO COMMIT.** Re-derived all gates (ES3, exact byte
bands, parse, T9, frozen 0-diff, locks, sw.js bump, staging isolated, no `.set/.update/.delete`, covenant
intact, honest empty/logged-out states), and graded WS-C fully (first reviewer pass): cascade correctness,
the row-hover bug real + the fix necessary, a full 7-call-chain mount census (every site inside a
`.lum-amber-deep` root), `--lum-ink=#241710` identical across all 6 scope variants incl. `.stb-warm-dim`.
Two disclosed **non-blocking** residuals (both recorded here):
- **R7:** `docs/r-arc-plan.md` working-tree EOL flipped CRLF→LF during the S4-1 edit (the known Edit-tool-on-
  docs gotcha). **Immaterial:** `git show 379dead:docs/r-arc-plan.md` is already 0-CR (LF blob), so the
  committed blob is LF regardless; numstat 4/2 is surgical, not a whole-file flip.
- **R8:** the WS-C self-verify table first read "58+/0−"; the true count is **56/0** (WS-B 48 + WS-C 8) —
  corrected above. The byte-delta gate (+3,851 B, the one that governs the band) was exact throughout.

**Commit:** `feat(r-arc S4): one door — three creation paths collapse, FF-8 row, arc-picker relit`.
Local commit only. **NOTHING PUSHES without Preston's exact words.**
