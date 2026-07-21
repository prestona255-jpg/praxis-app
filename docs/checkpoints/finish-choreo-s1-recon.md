# FINISH-CHOREO S1 (PUBLISH SPINE) — Stage-0 recon

STARTED 2026-07-21. Model Opus 4.8, gate agents Sonnet. HEAD `bb2dcae` / v3.239 live.
Brief: `docs/studio/finish-choreo-brief.md` (S1). Data-write slice → push HOLDs for the
explicit word regardless of green. **HALT at the migration fork before building the filter.**

## Anchors — confirmed at current HEAD (all exist, line-verified this session)

| Site | file:line | Role in S1 |
|---|---|---|
| `buildPublishedArcDoc` | integrations.js:2499-2553 | **the status-filter site** — selection loop 2505-2516 |
| — the exact filter condition | integrations.js:2509-2511 | `st.arcId===arcId && typeof st.header==='string' && header!==''` — **add `&& st.status==='published'`** here |
| `publishArc` | integrations.js:2561-2646 | writes `publishedArcs/{arcId}`; first-publish vs re-publish; identity store at :2581-2583 |
| `unpublishArc` | integrations.js:2652-2694 | **no confirm today** — one-click delete of the projection |
| `republishLiveArcs` | integrations.js:2703-2728 | **the migration lever** — re-projects every `published===true && freshness==='live'` arc on each saveState |
| `praxisResolvePublicName` | integrations.js:2479-2490 | canonical identity resolution (`praxis_publish_identity` ls) — the shared ceremony calls THIS |
| `_arcHeadPublishControl` | views.js:13353-13399 | **Entry 1** (arc-head) — today asks nothing (`{freshness:'frozen'}` only) |
| `_opPublishControl` | views.js:20020-20145 | **Entry 2** (own-profile) — has its own hand-rolled identity+freshness panel |
| `_arcSubsOf` / `_arcSubCount` | views.js:3918 / 3936 | current publish gate counts subs **regardless of status** — the ≥1-finished gate replaces/augments this |
| `openArcDeleteConfirm` | views.js:14375 | the in-DOM confirm pattern to reuse for **unpublish confirms** |
| `ensureSubTheoryFields` | state.js:644 | (S2's `answeringLine` schema lands here — noted, not S1) |
| Firestore read rules | firestore.rules:83-94 | `publishedArcs` = **authed read only**; projected doc allow-list has NO `status` field |

Frozen files untouched (marks / lumen-amber / arc-constellation). ES3 throughout.

## Planned edits + byte FLOORS (measured after build, floors stated now)
- `integrations.js` — the one-line filter condition + a shared identity resolver already exists
  (`praxisResolvePublicName`). FLOOR ~+80 B (the filter + a projection-empty guard). Code band.
- `views.js` — the shared publish-ceremony component (both entries call it) + the ≥1-finished gate +
  the two unpublish confirms. FLOOR ~+2,500 B code (the ceremony DOM/handlers), + comment allowance.
- `components.css` — the ceremony's panel/summary chrome (fade+slide only, kit tokens). FLOOR ~+900 B.
- Bands are floors, not targets; measured bytes reported at build. `sw.js` bump rides the push.

## THE MIGRATION FORK — FORK-VERBATIM, Preston rules BEFORE the filter is built

Adding `st.status==='published'` to `buildPublishedArcDoc` (2509-2511) is a one-line change, but its
effect on **already-published** arcs splits by freshness — and the population cannot be censused:

**Effect split (deterministic, from code):**
1. **LIVE published arcs** re-project on the next `saveState` (`republishLiveArcs`, 2703-2728). A live
   arc whose named sub-theories are all `status!=='published'` **silently re-projects to EMPTY**
   (title + zero subTheories) on the owner's next edit — content they believe is in the commons vanishes
   with no notice.
2. **FROZEN published arcs** never re-project until a manual republish. Their existing Firestore doc —
   **already containing draft `bodyPublic` prose** — stays byte-identical. **The filter does NOT
   retroactively clean the leak gate #5 names**; it persists for every already-frozen-published arc
   until that owner happens to republish.

**Census limitation (honest — this is WHY it's a fork, not a table):** the population is not enumerable
by me, and not centrally by anyone. `publishedArcs` is authed-read-only (no signed-out sweep); the
projected doc carries no source `status`; and each arc's sub-theory statuses live in per-user-private
`userSubTheories/{uid}`. **Only each arc's OWNER can determine their own arcs' exposure.** I can seed +
demonstrate the exact effect on `prestonpraxistest`, but "the existing publishedArcs population" is
structurally not knowable from here — so the disposition must be a GENERAL policy, not a per-arc list.

**Bounded, and shrinking:** the ≥1-finished gate (brief D3) stops all FUTURE all-draft publishes, so this
only concerns arcs published BEFORE the gate+filter ship; the set never grows and drains as owners
republish. But the frozen leak is **data-at-rest** (draft bodies sitting in authed-readable docs).

**Disposition options (Preston's ruling):**
- **A — filter only.** Ship the one-liner. New publishes correct; live arcs self-correct on next save
  (accepting silent-empty for live all-draft arcs); frozen arcs keep their old draft-leaking projection
  until republish. → **gate #5 does NOT fully close** (frozen leak persists); live content can vanish silently.
- **B — filter + per-owner republish-all-on-load.** After the filter ships, each owner's client, on load,
  re-projects ALL their published arcs (frozen included) once; any that would go empty is
  **unpublished-with-a-notice** instead of left blank. Only the owner has the statuses, so it must run
  owner-side. → **gate #5 fully closes**, no silent vanish. More build + its own red-team.
- **C — filter + read-side guard.** Ship the filter; commons/#reader renders an empty-projection arc as
  "being revised" (or hides it) rather than blank. Does NOT clean the frozen data-at-rest leak (draft
  bodies still sit in the docs, just unshown).
- **D — filter + block-empty-at-write.** Any (re)projection yielding 0 subs unpublishes instead of writing
  empty. Live arcs self-heal; frozen still need B's per-owner pass to trigger.

**Recommendation:** **B (optionally B+D).** The brief says gate #5 "flips as a verified side effect once
red-teamed" — that verification requires the frozen leak actually be closed, which only B/D reach; A ships
the filter while leaving gate #5's leak open for existing frozen arcs, and silently empties live ones.
But this is a data-migration scope call and it is Preston's.

## MIGRATION FORK — RULED B+D (Preston, 2026-07-21)
Filter ships; D block-empty-at-write (publishArc + republishLiveArcs → unpublish+notice on 0 published subs);
B corrected = FROZEN SANITIZE (freshness-preserving, remove-unverifiable, idempotent `sanitizedV1`, empty→unpublish);
the quiet per-arc notice; heaviest verification (fixture + headless + keep-predicate red-team); gate #5 flips only
on both halves red-teamed.

## ⚖ FORK #2 (surfaced under FORK-VERBATIM) — the frozen sanitize has NO JOIN KEY

**Premise-vs-code gap.** The ruling says "remove any entry whose current status is not 'published'" and
"entries whose id no longer exists locally are removed." But a stored `publishedArcs` sub-theory entry is
`{ header, body, markShape, markColor }` (integrations.js:2537-2542) — **it carries no id and no status.**
There is nothing on the stored entry to look up a "current status" or match "the id no longer exists." The
sanitize's keep-predicate must be RECONSTRUCTED by joining anonymous stored entries back to local sub-theories,
and the only human-meaningful join key is the **header string**. This is exactly the keep-predicate the FX-1
lesson warns about — I will not pick it silently.

**Scope note that shrinks the problem:** future frozen docs are CLEAN BY CONSTRUCTION — once the filter +
≥1-finished gate ship, a publish never projects a draft, so post-filter frozen docs never contain draft
entries. **The sanitize is therefore LEGACY-ONLY** (arcs frozen-published before this ships), and those legacy
entries are irreducibly anonymous — there is no id to add retroactively.

**Proposed keep-predicate (my recommendation):** keep a stored entry E iff there is EXACTLY ONE local
sub-theory S with `S.arcId===thisArc && trim(S.header)===trim(E.header)` AND `S.status==='published'`; else
REMOVE E (no match / draft match / ambiguous multi-match). Empty result → unpublish + notice. Conservative,
remove-on-doubt — aligns with "privacy outranks freshness."

**Residual risks this predicate CANNOT fully eliminate (the honest part):**
- (a) A published sub whose header was EDITED after the arc was frozen no longer matches its frozen entry →
  that finished entry is dropped (freshness loss, privacy-safe). Bounded.
- (b) Irreducible leak edge: a LOCALLY-DELETED draft's frozen entry whose header happens to uniquely equal a
  still-published sub's header would MATCH that published sub and be KEPT — the draft body survives. Requires
  delete + exact-header-collision + uniqueness; narrow, but real, and unfixable without an id the legacy docs
  never stored. Uniqueness handles the common collision (draft+published sharing a header both live → 2 matches
  → ambiguous → removed); (b) is only the deleted-draft variant.

**The question for chat-Claude to rule:** accept the header-match keep-predicate with residual (b) as the
faithful realization of "surgical sanitize"? Or, given (b), escalate legacy frozen arcs that contain ANY
non-verifiable entry to a whole-arc unpublish+notice (zero residual, but coarser than "surgical" and
contradicts "keep the surviving entries' frozen bytes")? Or add marks to the join (header+markShape+markColor —
tighter, still not unique, marks may have drifted)?

## FORK #2 — RULED (Preston, 2026-07-21): header-match keep-predicate (option 1), amended — DUAL-SIDE UNIQUENESS
Keep stored entry E iff ALL hold: **(i)** exactly ONE local sub S in this arc with `trim(S.header) == trim(E.header)`;
**(ii)** `S.status === 'published'`; **(iii)** exactly ONE stored entry in this doc carries that trimmed header.
Anything else — no match, draft match, ambiguity on EITHER side — is removed. **Remove-on-doubt, both directions.**
The stored-side clause (iii) removes residual (b)'s main vector (a frozen doc holding BOTH a deleted draft's entry
AND a published sub's entry under the same header — local uniqueness alone would keep both and the draft body
survives; stored-side uniqueness removes that pair entirely). What remains is only the truly irreducible case (a
deleted draft's LONE entry whose header uniquely equals a published sub that entered after freeze) — vanishingly
narrow, legacy-only (post-filter docs are clean by construction).
- **Rejected:** option 2 (whole-arc unpublish — contradicts the surgical/freshness ruling; "don't burn a library
  to sanitize a page") and option 3 (mark-based joins — trade real freshness losses from mark drift for less
  narrowing than the dual-uniqueness clause provides).
- **Residual (a)** — renamed-after-freeze published subs losing their frozen entry — ACCEPTED: privacy-safe
  freshness loss, consistent with "privacy outranks freshness." Both residuals named in the S1 checkpoint + a
  one-line footnote on gate #5's launch-runway row.
- **Red-team mandate:** the fixture must cover — clean keep · draft removal · no-match · local-side collision ·
  STORED-side collision (both removed) · renamed-published drop (a, expected) · deleted-draft-unique-match (b,
  irreducible) · empty→unpublish+notice · idempotence no-op. (Shipped as the 9/9 keep-predicate sim.)

## FORK #3 — SURFACED + RULED (Preston, 2026-07-21): the idempotence stamp is rules-blocked
Building the sanitize surfaced a THIRD collision: the ruled idempotence ("stamp the doc `sanitizedV1:true`")
is DENIED by `firestore.rules` — `publishedArcKeys()` (rules:21-24) is a closed 10-key allow-list enforced by
`keys().hasOnly(...)` on every update (rules:92); `sanitizedV1` is not in it, so a write adding it is
permission-denied and would fail SILENTLY in prod, leaving the leak. (The sanitize's content edit — rewriting
`subTheories` with fewer entries — IS rules-legal; only the stamp field is blocked.)
- **RULED: option 2 — client-side idempotence** via `ls`/`sv` (`praxis_sanitized_arcs`), per device, once. The
  literal "stamp the doc" is **RETRACTED as rules-blocked.** Do NOT touch firestore.rules; no manual-publish
  dependency enters this slice. A re-run on another device re-evaluates the keep-predicate against the already-
  clean doc and no-ops. Harmless-by-construction beats globally-stamped-and-unverifiable.
- **S2 open question, LOGGED not built (Preston):** a frozen arc whose published sub is later REOPENED to draft
  keeps its frozen public entry (the one-time sanitize won't catch post-sanitize reopens; frozen never re-projects).
  Whether finished-ness should govern public MEMBERSHIP continuously — even for frozen — belongs to S2's
  threshold/reopening semantics. Nothing built for it here.

Build proceeded on all three rulings; the build log is `finish-choreo-s1.md`.
