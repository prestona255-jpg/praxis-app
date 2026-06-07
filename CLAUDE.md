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
- Current and next stage live in `docs/Checklist and Roadmap/Praxis_Build_Checklist.html` — read it first.
- The locked 9.6 design and stage scope live in `docs/PRAXIS_9_6_AND_VISUAL_UPLIFT.md` — the source of truth the build briefs are written against.
- For any sub-theory work, also read `docs/knowledge-arcs/knowledge-arcs-subtheory-pivot.md`.
- `Praxis_Roadmap.html` is the strategic narrative — read on request, never import (large JS-rendered SPA).

## After a stage
Record the stage as claimed-done with its evidence (byte deltas, grep, commit hash, live check) — but leave the PASS stamp to Preston.
