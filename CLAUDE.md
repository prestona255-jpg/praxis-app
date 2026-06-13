# Praxis — build agent guide

## Project
Praxis: vanilla-JS theory-publishing platform with an AI persona, Yumi. Pure static site on Netlify; Firebase/Firestore backend. Live: praxis-reading.netlify.app. Work directly on `main` (no worktrees, no branches).

## How we work
Two tools: a Claude chat is the design partner and brief author; you (Claude Code) are the executor. Engineering mode — lead with the conclusion, work in staged briefs with PASS/FAIL checkpoints, never bundle unrelated changes into one commit.

## Conventions — hard rules
- `var` and `function` only. No `const`, `let`, arrow functions, `class`, or template literals.
- String concatenation, not template strings. Callback-style `.then()` chains.
- CSS variables only — no new hardcoded hex (the code already uses `var(--token)` in SVG fills).
- localStorage only via the `ls(key, default)` / `sv(key, value)` wrappers.

## File load order
state → integrations → yumi-brain → arcs → arc-constellation → tradition-forms-arc → voice-input → yumi-ui → views → app
(arc-constellation and tradition-forms-arc load before views.)

## Environment & deploy
- Node is blocked on the Windows machine — never run `npm` or `node`. The cscript JScript parse harness is ES3: it cannot parse files using `.catch`/`.finally`, so it only validates promise-free files like state.js. Verify integrations.js, yumi-brain.js, and sw.js on the live deploy, not the harness.
- Deploy = commit + push to `main`; Netlify auto-builds. No Drop, no branches, no preview deploys. Verify live behavior on praxis-reading.netlify.app AFTER the push.
- Commit subjects use an em-dash (—).
- Every JS change after a CACHE_VERSION bump needs its own bump, or the service worker serves a stale bundle. An already-open tab keeps the old SW until the user accepts the "new version ready — Reload" banner.

## Verification — non-negotiable
- Open every task with Stage 0 recon: read the files, confirm anchors, report stats, then STOP for go-ahead.
- Byte deltas are measured before AND after — never back-derived. Report grep counts. (Git stores text blobs as LF though the working tree is CRLF, so the autocrlf warning is cosmetic; prove "no EOL flip" with a small diff stat, not the warning.)
- Never commit or push until Preston sends the exact words "commit and push." Then prove it: commit hash, the subject (`git log -1 --format=%s`, em-dash intact), and `HEAD == origin/main`.
- "I did X" is never proof on its own — show the diff/grep/count.

## Where the work stands (read first, every session)
- Current status, every stage's real state, and the open work live in `docs/Checklist and Roadmap/BUILD_STATE.md` — read it first. It is the single canonical tracker, updated per-substage in the same commit that finalizes each checkpoint. (The old `Praxis_Build_Checklist.html` and `Praxis_Roadmap.html` were deleted — they stored state in localStorage, not git, and drifted; recover the old blobs at SHAs `c0ddfe5` and `40de91f` if needed.)
- The locked 9.6 design and stage scope live in `docs/PRAXIS_9_6_AND_VISUAL_UPLIFT.md` — the source of truth the build briefs are written against.
- For any sub-theory work, also read `docs/knowledge-arcs/knowledge-arcs-subtheory-pivot.md`.

## Visual / UI work — read the design spec first

Before any UI, styling, layout, or constellation work, read `docs/design-spec.md`
and conform to its tokens and rules. It is the code-derived visual source of truth
(tokens, per-component rules, and the constellation spec). The mockup and screenshots
are cross-checks; the spec is canonical. When live disagrees with the spec, live is
the drift — conform live toward the spec, staged and live-verified, never a bulk swing.

## After a stage
Record the stage as claimed-done with its evidence (byte deltas, grep, commit hash, live check) — but leave the PASS stamp to Preston.

## Plan-file execution protocol (added June 2026)

This protocol is the DEFAULT for all build work — not a Stage 10
special. Stages are authored into a plan file (docs/<stage>-plan.md);
"Execute <substage> from <plan file>" is the trigger, and the
discipline below governs every build task, plan-file or ad-hoc:

- Read the named substage's section fully before any action. The plan
  file is authoritative for scope; this file is authoritative for
  conventions. Conflict = halt and ask.
- Run the substage's Stage 0 recon first, write findings to
  docs/checkpoints/<substage>-recon.md. If the plan marks a DECISION
  GATE, halt after recon and wait.
- Build slice by slice in the plan's order. After each slice, self-verify
  the mechanical gates and append results to
  docs/checkpoints/<substage>.md. Proceed only if ALL pass.
- MECHANICAL HALT CONDITIONS (stop immediately, write the failure to the
  checkpoint file, await Preston):
  - any parse check FAILs (cscript harness for promise-free files;
    parse-check-views.js for views.js; full-diff for harness-exempt)
  - a byte delta falls outside the plan's stated expected band
  - a grep count does not match the plan's stated expectation
  - any tracked file is dirty that the slice did not intend to touch
  - the diffstat suggests an EOL flip (whole-file change)
  - any genuine ambiguity about what the plan means
- Never bundle slices. Never proceed past a FAIL "because the fix is
  obvious." Never trust your own narrative over computed evidence.
- Commit/push only on Preston's exact words. After push, wait for the
  Netlify build, then open https://praxis-reading.netlify.app in the
  browser, hard-refresh, confirm the new CACHE_VERSION in DevTools, and
  run EVERY pass-check in the substage plan yourself. The human
  provisions the test account and its connected browser session ONCE;
  the executor seeds all data and runs all checks within it, after
  confirming account identity (email + empty/expected state) before any
  write. If no test session is connected, requesting one is the only
  verification step that may be handed to the human — an auth limitation
  is never a reason to hand a check to the human; it is a reason to use
  the test session. Evidence standard: live-DOM structural proof is the
  hard PASS/FAIL evidence; screenshots corroborate, embedded as repo
  files when the tooling exposes a path, else recorded as session IDs
  with descriptions. A pass-check without recorded evidence is
  UNVERIFIED, and a substage cannot be declared complete with any
  UNVERIFIED check. Human-only gates, the complete list — hand the human
  nothing else: (1) commit/push authorization by exact words; (2) design
  comp-gates, visual judgment on live screenshots; (3) real-data
  verification only where test data cannot represent the case, presented
  as a single named check with a click-path.
- End every substage with the report file complete: slice table (parse,
  bytes, greps), live-verify results, screenshots, honest residuals.
  Then STOP. Preston does his eyes-on check and decides what's next.
  Do not start the next substage unprompted.
