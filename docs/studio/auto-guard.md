# AUTO-GUARD — the pre-commit rails linter (`hooks/pre-commit` §5)

Commissioned July 21. Built on branch `auto-guard-lane` (worktree `../praxis-auto-guard`),
committed LOCAL, never pushed — the push word is Preston's. Zero new dependencies: POSIX
`sh`/`grep`/`sed` only. Base: `b7b358a` (v3.258). Hook byte delta **2,588 → 4,899 B (+2,311)**.

The guard is **live machinery**: `core.hooksPath=hooks`, so the moment `hooks/pre-commit` is
edited it governs commits. It was built AFTER v3.258 fully shipped, and the guard's own B4
commit runs THROUGH the new rails (the first real proof it does not false-fire).

## What it adds

Four pre-existing gates are unchanged (foundations byte-lock, test-arc block, source-rides-
`sw.js`, and the ES3 **warning**). AUTO-GUARD adds **§5 — two BLOCKING rails** on the **added
lines** of **client app files only**, each fixture-proven fail-able AND false-positive-free on
the current tree.

### Scope table (§5 rails)

| | In scope | Out of scope (by construction) |
|---|---|---|
| Files | `js/*.js`, `assets/*.css` | `tools/`, `docs/`, `*.md`, `sw.js`, `hooks/pre-commit` itself |
| Lines | staged **added** lines (`git diff --cached`, `^+`) | context / removed / unchanged lines |
| Hex (5b) exemption | — | `assets/theme.css` (the sanctioned home for hex literals) |

`tools/` is excluded on purpose: tool scripts are shell and use backticks / heredocs
legitimately — scoping to `js/*.js` + `assets/*.css` keeps every tool commit clean. Since the
pathspecs never match `tools/`/`docs/`/`*.md`/`sw.js`/the hook, no wrong-scoping can brick them.

### The two rails + their L3 fixture proofs

**5a — dynamic CSS-custom-property construction (the `setProperty` / concat seam).** Building a
`--var` name at runtime via string concat is a forbidden seam (**0 in the tree today**, so it
can never fire on an edit near a legacy line). Patterns: `setProperty([^,)]*+`, a CSS-var-shaped
string literal `'--foo-'` immediately followed by `+`, or `+` immediately followed by one. The
prose case `+ '-- word'` (a dash-dash-**space** markdown dash in a system prompt) is excluded by
requiring a **letter right after `--`**.
- REJECTS: `el.style.setProperty("--register-" + r, v)` → BLOCK ✓ · `var s = "--subtheory-" + id;` → BLOCK ✓
- PASSES: `setProperty("--foo", v)` (static name) · `+ '-- attach that title'` (prose string)

**5b — new hardcoded hex color in client CSS outside `theme.css` (the tokens-only rule,
CLAUDE.md conventions).** Value-context only (`:...#hex`) so `#id` selectors do not trip it;
`theme.css` is exempt.
- REJECTS: `.x{ color:#abc123; }` added to `components.css` → BLOCK ✓
- PASSES: `--test-x:#abc123;` added to `theme.css` (exempt) ✓ · a clean `var(--token)` rule ✓

### Negative fixtures (must commit / pass cleanly)

- **(a) scope:** a `tools/` shell file containing backticks → NOT flagged ✓
- **(b) real-shaped clean:** a v3.258-shaped change (a `components.css` `var()`-only rule + a
  `js/views.js` `var`/`function` + `sw.js` bump) → **commits cleanly, exit 0** ✓
- **(c) added-lines-only:** a clean `var()` line added to `components.css` while its **190 legacy
  hex on unchanged lines** are not in the diff → NOT flagged ✓

### Fixture hygiene

All fixtures ran on a throwaway branch `b2-fixtures` inside the worktree, hard-discarded after
capturing proof (violations tested by invoking `sh hooks/pre-commit` on the staged state — the
exact commit-time gate — then `git reset`; the one clean specimen committed then discarded). The
`auto-guard-lane` history Preston pushes contains **exactly one commit: the guard itself**.

## Checks deliberately OMITTED (never a decorative guard)

Per the GUARD-BUG VALVE, a rail that rejects a provably-clean line is a bug, not a feature. These
were considered and **left out as BLOCKS**, with the reason:

- **ES3 syntax as a BLOCK** — a raw-diff regex for `const`/`let`/`=>`/backtick/`class` false-
  positives on comments and strings (e.g. the pre-existing `capCommit` comment "…account switch
  **let** a newer commit…"). It stays the existing **WARN** (§4); real ES3 enforcement is the
  cscript parse-gate + `fix-red-team` (FIX-PROTOCOL §2/§5).
- **`--lum-*` / `--register-*` / `--subtheory-*` USAGE** — these are heavily-used legit tokens
  (`--lum-*` 1,013×, `--subtheory-*` 96×, `--register-*` 56×). Blocking their **usage** would
  false-fire pervasively. Only their **dynamic construction** (5a) is forbidden.
- **Hex on an EDITED legacy line** — with 190 existing hex lines in `components.css`, blocking
  every added line that carries a hex would reject an unrelated edit to a legacy line. 5b flags
  it as a **nudge to tokenize**; `--no-verify` (with a one-line reason) is the sanctioned escape.
- **"transform-rig tokens"** — no false-positive-free literal set is defined for these, so no
  clean fail-provable check could be written. Omitted; re-open if a token list is specified.

## B3 — smoke wiring: SKIPPED (named follow-on)

The Live Forensic Smoke (CLAUDE.md) is **manual / UI-driven** — it drives the rendered app in a
signed-in browser and needs human observation; there is no headless runner (`tools/` has only
`ground-truth`, `parse-check`, `studio-build`; FIX-PROTOCOL's "Build-3 automated smoke" does not
exist yet). It is **live-only by design**, so it is NOT wired into the hook (a pre-commit hook
cannot drive a browser). **Follow-on: wire a smoke stage on `sw.js`-staged commits once the
Build-3 automated smoke lands.**

## Emergency bypass

`git commit --no-verify` skips the whole gate. Reserve it for a genuine false-positive or an
emergency, and state the one-line reason in the commit body. If a rail rejects a provably-clean
line, that is a **guard bug** — fix the rail or omit the check and report; never `--no-verify`
past it silently.
