# Portrait — account-page crash fix (v3.143) — checkpoint

**Lane:** `relaxed-lederberg-ac8a2a`, on top of `fffe2c3` (the v3.142 ship that white-screened then was rolled back). Fix-forward; clean fast-forward of `origin/main` (`72db19b`).

## Root cause (one line)
The capstone wired its emblem interactions via `document.getElementById('account-portrait-*')`, but the account `wrap` `<section>` isn't appended to the document until the END of `renderAccountPage` (`host.appendChild(wrap)`, ~line 14143) — so all 6 lookups returned **null** and the first `.addEventListener` (line 13910) threw, aborting the whole render → blank body. (Universal, not sparse-specific; the 3-book account was just the test.)

## Fix A — root cause
The 6 capstone lookups now query the **detached `capCard`** node (which exists at that point) instead of `document`: `document.getElementById('account-portrait-X')` → `capCard.querySelector('#account-portrait-X')`. `querySelector` works on a detached subtree, so the handlers actually attach. Each attach is null-guarded (`if (eChipsWrap) {...}`, `if (showMadeBtn) {...}`, `if (capCard) {...}`, plus inner `if (emblemEl/eExplainEl/madeEl/ackEl)` guards).

## Fix B — umbrella (so this class can't recur)
Each of the 4 portrait sections inside `renderAccountPage` (VALUES, REVEALED-SELF, JOURNEY, CAPSTONE) is wrapped in `try { ... } catch (e) { console.error('portrait X section failed', e); }` (an **ES3 statement**, NOT the banned promise `catch()` method). A failure in any one section now degrades to "that section absent" and can **never again abort `renderAccountPage` or blank the page**. The non-portrait surfaces (live hero, profile editor, stat cards, STAGE-11 transparency, reader-model section, "Your data"/covenant) + the final `host.appendChild(wrap)` are all **outside** the try blocks → they always render.

Sweep confirmed: the 6 capstone `getElementById` were the ONLY element-lookup→`.addEventListener` sites in the portrait region (dialogue/threads/galaxy/field use direct `createElement` refs, never null). 0 `document.getElementById('account-portrait` remain.

## Verify
- **Parse:** cscript `views.js` **PASS** (635,338 chars) — the try/catch-wrapped sections (with nested function declarations) are syntactically valid.
- **Banned-token gate:** = baseline — `.catch`=1 (pre-existing comment; the umbrella uses bare `} catch (e)` statements, not the dotted promise method), `.finally`=0, `=>`=1, backtick=3, `const`=1, real `let`-decl=0.
- **Additive in spirit:** numstat 56/29 — the 29 "deletions" are the Fix-A wiring rewrite (old `getElementById` lookups + unguarded handlers, all re-added in fixed+guarded form); no portrait feature removed.
- **Adversarial critic: CLEAN** — verified (1) the querySelector fix + id-match; (2) the 4 try/catch boundaries (each wraps exactly its section; non-portrait code + `host.appendChild(wrap)` outside all try blocks); (3) function-hoisting runtime safety (every synchronous call occurs AFTER its function's declaration in source order — no call-before-declaration; event-handler callbacks fire later); (4) brace balance + guards.

## Ship
`CACHE_VERSION` v3.142 → **v3.143**. Pushed to `origin/main` (clean fast-forward). Undo anchor `PRESHIP = 72db19b`. Behavior change vs the prior portrait: none beyond defensiveness — the emblem interactions now attach correctly + every section is crash-isolated.
