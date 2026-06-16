# Notebook epic — FOUNDATION checkpoint (schema 1.18.0 → 1.19.0)

Self-driving Tier-1 stage. Local commit on PASS; **no push** (gated to the final
acceptance gate). Recon confirmed every locked-model anchor (workflow
`w1fvkjwp4`, 6 agents) — go/no-go = GO, no contradiction.

## Scope
Introduce three additive data-model fields end-to-end, NONE touching `isPrivate`:
- `entry.filed` (boolean) — false = Inbox (untriaged), true = placed (book bank / Journal)
- `registerDefaults.question` (boolean, default false = visible like marginalia)
- `profile.yumiReadsAlong` (boolean, default true) — master consent switch, mirrored via `/userProfiles`

## Slice table — predicted vs actual (lines)

| File | Predicted | Actual added | Code lines | Comment lines | Classification |
|---|---|---|---|---|---|
| `js/state.js` | +53 | +70 (diff-stat 77, 8 in-place del) | 46 | 24 | overage = comment verbosity → clears |
| `js/integrations.js` | +12 | +19 | 7 | 12 | overage = comment verbosity → clears |
| `js/views.js` | +2 | +2 | 2 | 0 | exact |

Overage is **comment-only** (proved by `git diff -U0 | grep -v '^\+\s*//'` line
classification — every added code line is planned logic; no stray logic). Per the
deviation-classification rule, comment-only overage clears by line classification.

## Edit sites
- `state.js`: entry-shape doc (+`filed`); `registerDefaults` shape comment (+`question`);
  `ensureUser` (seed + additive field guards for `question` and `yumiReadsAlong`);
  `getProfile` fallback (+`yumiReadsAlong`); `setProfile` (+`yumiReadsAlong` coercion);
  `migrate()` new `1.18.0→1.19.0` block.
- `integrations.js`: notebook auth-merge `filed` normalizer (after the splat, before the
  journal-privacy block — untouched); profile load-merge `yumiReadsAlong` (absent→default-true);
  `saveProfileToFirestore` `.set` `yumiReadsAlong` (default-true-preserving).
- `views.js`: `filed:true` at the two existing creation sites (`openJournalEditor`,
  `openMarginaliaEditor`) so every new entry is schema-complete.

## Mechanical gates
- **cscript parse `state.js`:** `PARSE: PASS (83674 chars)`.
- **ES3 (new lines, all files):** grep for `=> / backtick / .catch / .finally / const / let` → none.
  `integrations.js`/`yumi-brain.js` are parse-exempt; new `integrations.js` lines hand-verified ES3.
- **F5 diff-level:** the only `isPrivate` tokens in the diff are two new *comment* lines; zero
  `isPrivate` code added/removed.
- **F5 computed proof — `.claude/foundationN-migrate-test.js` (cscript): ALL PASS (19 assertions):**
  - schema → `1.19.0`;
  - `isPrivate` UNCHANGED on journal(true), visible-marginalia(false), and a **deliberately-hidden
    marginalia (true stays true)** — the F5-critical case;
  - `filed` backfilled `true` on every legacy entry;
  - `registerDefaults.question === false`, `profile.yumiReadsAlong === true` added; `tagline` preserved;
  - a user with no `registerDefaults`/`profile` does not crash and fields are not fabricated;
  - an existing `filed:false` (Inbox) **survives** (typeof guard respects existing booleans);
  - idempotent on re-run.
- **grep counts:** `yumiReadsAlong` mirror bound at exactly the 2 `integrations.js` sites (load + save).
- **EOL:** diff-stat shows surgical per-line changes, no whole-file rewrite.
- **No NON-GOAL touched:** no `firestore.rules`, constellation, proxy, or `sw.js`.

## Deviations / flags (surfaced at the acceptance gate)
1. **`filed` backfill = TRUE, not the brief's literal "false".** With the F3 routing
   (`Inbox = register!=='journal' && filed===false`), a flat `false` backfill would dump every
   existing book-attached marginalia into Inbox. Inbox did not exist pre-epic, so no legacy entry
   is an untriaged capture → `filed=true` keeps marginalia in its book bank and leaves Inbox empty
   for legacy data. Reasoned, fully reversible, never touches `isPrivate`. **Preston: confirm.**
2. **`yumiReadsAlong` lives in `profile{}`** (not a bare user field) so it reuses the existing
   `/userProfiles` end-to-end mirror — satisfies "on the user record + mirrors via /userProfiles"
   with the least new wiring (no `buildUserProfileDoc` exists; the doc is built inline).
3. **Consent-safety on load-merge:** `yumiReadsAlong` absent in a remote doc → default TRUE, so a
   legacy `/userProfiles` doc can never silently flip Yumi OFF. Only an explicit stored `false` disables.
4. **Pre-existing bug found (OUT OF SCOPE, not fixed here):** the profile load-merge
   (`integrations.js` ~362-365) omits `tagline`, so editing a tagline on one device is wiped on
   another at next sign-in. Unrelated to this epic → flagged separately, not bundled.

## Result: PASS — committed locally. Auto-proceeding to N1 (spread shell, read-only).
