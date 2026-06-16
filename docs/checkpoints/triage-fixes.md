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
