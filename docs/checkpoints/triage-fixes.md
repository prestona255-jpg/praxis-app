# Post-ship triage — fix log (built on Stage-0 recon)

Recon: `post-ship-triage-recon.md`. Forward-fix (no active corruption). Code fixes first; gated
data recovery (D/E) last after a Firestore backup. Local commits only; no push until the final gate.

## FIX A — adaptive writeline — DONE (local commit)
- **Change:** `buildNotebookWriteline` (views.js): single-line `<input type="text">` → auto-growing
  `<textarea rows="1">` (grows to `scrollHeight` on input; Enter commits, Shift+Enter newline). CSS:
  `.notebook-writeline-input` gains `resize:none; overflow:hidden; line-height:1.4`; container
  `align-items: flex-end`.
- **Gates:** cscript parse `views.js` PASS (415670); diff `views.js +10/−2`, `components.css +4/−1`
  (≈ predicted); ES3 clean.
- **UI-driven local verify (localhost:8753, stubbed user, real input event):** element `TEXTAREA`;
  height **28px → 198px** for a 4-line note; full text present (`"Line four"`), **not clipped**
  (`scrollHeight == offsetHeight`). No `prestona255` writes.

## FIX B — Create-sub-theory wiring — DONE (local commit)
- **Change (views.js):** (1) `canCreate` — **name optional**; require a **valid existing** arc
  (`state.arcs[aid]`), not just a truthy id. (2) `notebookSharedArc` — return only a shared arc that
  **still exists** (a deleted arc must not surface as the default → enable-but-no-op). (3)
  `notebookCreateSubTheory` — drop the `!name` gate (empty header = a draft named in the editor, like
  "+ Sub-theory"); keep the arc-exists guard.
- **Gates:** cscript parse PASS (416319); diff `views.js +16/−4` (extra = comments); ES3 clean.
- **UI-driven local verify (real clicks, NOT function calls):** gather 2 notes → "Choose an arc" →
  click the arc row (no name typed) → Create **enabled** → **click Create** → a real `draft`
  sub-theory lands in the arc with **both notes as `entry` evidence** (`refIds n1,n2`), gather
  cleared, navigated to `#subtheory/…`. Directly fixes the "can't create" (the name gate was the
  blocker). No `prestona255` writes.

## FIX C — Yumi model (user-approved, in-scope) — DONE (local commit)
- **Root cause:** `claude-sonnet-4-20250514` is retired → Anthropic `404 not_found_error` → proxy
  forwards 404 → "Something went wrong reaching Yumi." Not `assembleContextData`.
- **Change (yumi-brain.js:84,543):** `'claude-sonnet-4-20250514'` → `'claude-sonnet-4-6'` (latest
  Sonnet). No pedagogy/prompt change.
- **Gates:** old id gone (grep 0), new id bound ×2; diff `+2/−2`; ES3 clean (parse-exempt → grepped).
  **Model verified working via the deployed proxy: `claude-sonnet-4-6` → HTTP 200** (`claude-sonnet-4-5`
  also 200; chose the newer). Full Yumi UI 200 round-trip confirms at the ship gate (local has no proxy).
