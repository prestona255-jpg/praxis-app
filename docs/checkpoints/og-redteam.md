# OG1–OG4 + IA4 — §9 fix-red-team verdict

**RED-TEAM: no block-commit findings.** Gate PASSED. All 5 slices walked against source and every
mechanical claim re-derived independently.

## Confirmed
- Byte deltas (LF-normalized): views.js +3655 B · intros.js +416 B · sw.js +0 (version string). No EOL flip.
- Parse gate exits **0** on both files; harness **self-validates** (broken ES6 copy → PARSE ERROR / exit 1).
- Additions ES3-clean (no `=>`/`const`/`let`/backtick/`class`).
- Only the 3 intended code files dirty.
- **Signed-out #home**: `!homeUser.uid` → prompt + return before the fake dashboard; widgets never reached (views.js:1453-1460).
- **New signed-in user**: `homeOwnArcs` excludes seed; `hasShelf` matches state.userBooks shape → greeting "Welcome to Praxis." (views.js:1472-1474).
- **Nav cycle-safety**: signed-in `textContent=initial` clears the prior signed-out SVG; all 4 DOM props reset both branches; selectors exist (index.html:32-34); signed-in praxis_user always carries .uid.
- **Signed-out #arc/<seed>**: seed bypasses the gate → reaches tail CTA; non-seed hits existing gate (no double-CTA); signed-in seed = no CTA (views.js:12585).
- **IA4 routing**: `renderRoute` is a bare global reachable from the intros IIFE at click time; else-branch fires real hashchange (app.js:19); same-hash branch meaningful; `markSeenAndClose` does NOT route (only onNext release does); onSkip welcome does NOT route; `picked.bookId` = real doShelve id or null→#notebook; journey only runs for a signed-in uid.
- No CSS touched (nav solid/no-blur); visibility-toggle untouched; no dangling handlers on the skipped home constellation.

## Non-blocking findings (dispositions)
1. **Ledger must ride the commit** — FIX-PROTOCOL §2. → FIXED: docs/LAUNCH-STATUS.md updated + staged in this commit.
2. **Tier = path B (novel → default HALT), not self-drive** — correct re the DEFAULT posture. Disposition: the
   STAGE 1 autonomous-sweep prompt is Preston's explicit standing authorization to run the full chain
   (recon→patch→red-team→commit→push→live-verify) and stop ONLY on a gate failure. Gate = red-team clean (met).
   Proceeding to commit+push under that authorization.
3. **The look is unverified (VISUAL GATE)** — the signed-out card / nav silhouette appearance at 390 + ~1280 is
   presentational and unproven by structure alone. Mitigation: the `buildSignedOutPrompt` primitive's render is
   ALREADY SHIPPED on #search (verified live via getCurrentUser→null stub: readable, light-on-dark, styled
   gradient CTA, left-aligned/sans — the app's established signed-out treatment). Post-deploy I do a structural
   live-verify of the deployed bundle. **RESIDUAL: Preston's eyes-on the signed-out Home/Arcs/seed + nav
   silhouette** (a centered-serif polish, if wanted, is a separate CSS ticket — out of this sweep's stated files).
4. **Stale recon anchors** — og-recon.md line refs predate my edits (edits shifted lines). Fix landed correctly
   in every case; doc nit only.
