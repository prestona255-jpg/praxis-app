# D1 — Light & Depth Law + Builder v2 + Gap Import — independent review

**Reviewer:** praxis-reviewer (independent re-derivation, not the builder's narrative)
**Date:** 2026-07-08 20:17 UTC
**Scope:** docs / mockup / tooling only, per the wave's stated non-goals. Nothing
committed; this verdict gates the commit.

---

## Gate-by-gate verdict

**1. No live-app file touched** — PASS.
`git status --porcelain -uall -- js/ assets/ sw.js index.html test-arc-constellation.html`
returns empty for every one of those paths. Only 4 tracked files are modified
(`CLAUDE.md`, `design/praxis-design-canon.html`, `design/praxis-profile-galaxy-mockup.html`,
`docs/studio/praxis-universal-token-sheet.md`) plus new untracked files under
`docs/studio/`, `tools/studio-build`, `.claude/agents/studio-scan.md`. `test-arc-constellation.html`
mtime is 2026-07-07 10:38, predating this session — untouched.

**2. Foundation locks (byte-exact)** — PASS.
`wc -c assets/lumen-amber.css assets/marks.js` = **14681** and **10255** bytes exactly,
matching the locked values, and `git status` confirms both files are clean (zero diff).

**3. §8 Light & Depth law in the token sheet** — PASS.
`docs/studio/praxis-universal-token-sheet.md` title/Status bumped to v1.2 (the only
2 deleted lines in the diff are exactly the old v1.1 title + Status line — a clean
version bump, not a stealth content edit: `git diff --numstat` = 117/2). §8 present
with exactly 8 recipe names (gilded hairline, luminous orb, ink-to-gold, lamplight,
gilded button, atmospheric ground, constellation thread, glyph color language) and
exactly 6 restraint laws (glow-only-on-meaning, one-lamplight-per-region,
gilding-edge-not-fill, v3-is-ceiling, **PERFORMANCE**, **ACCESSIBILITY** — both present
verbatim as their own bullets).

**4. `docs/studio/universal-depth.css` — new single source** — PASS.
Header line 2 reads verbatim `Universal depth v1.2 — canonical source; copies must
cite this file+version.` All named classes present: `.u-gild-hairline`, `.u-orb`
(+ `.u-orb--lit/--soft/--unlit` + 10 hue modifiers: amber/coral/rose/pink/sage/mint/
periwinkle/palegold/honey/russet), `.u-inkgold`, `.u-lamplight`, `.u-btn-gild`,
`.u-ground-atmo`, `.u-panel`, `.u-sheet`, `.u-thread` (+ `.u-thread--v`/`-stroke`),
`.u-glyph-*` (8 kind classes). Brace balance: 41 open `{` == 41 close `}`.

**5. `design/praxis-design-canon.html` §13** — PASS.
All 12 prior `<h2>` headers present byte-identical (Philosophy, Color, Typography,
Space & form, The galaxy, Motion, Components, Interaction laws, Public & private —
the two faces, Voice, Forming states, What the profile still needs — confirmed
against `git show HEAD:...` line-by-line, text identical, only line numbers shifted
by the inserted CSS block) plus the new §13 "Light & depth". `<section>` tag count
13 open == 13 close. `git diff --numstat` = 126 insertions / **0 deletions** — pure
addition, links `../docs/studio/universal-depth.css`.

**6. `design/praxis-profile-galaxy-mockup.html` — style-only depth pass** — PASS,
critical invariant confirmed. `git diff --numstat` = 22/9 (9 deletions are the old
CSS values being replaced by new gradient/gilding values — expected for a "depth
pass"). Every diff hunk (`@@` lines 20, 37, 60, 80, 96, 149) falls between file
lines 20–169, entirely inside `<style>` (opens line 10, closes line 234) — the
`<script>` block starts at line 353, far below any touched line. No
`function`/`appendChild`/`getElementById`/`addEventListener` in any `+` line
(grep = empty). **`.galaxy-night{...}` block diffed directly against HEAD is
byte-for-byte identical** (`diff <(...) <(...)` exit 0) — `--surface:#101019`,
`--night-line:#3a2c15`, night `--ink:#f0e3c8`, `--gold:#d2a23e` all unchanged.
`:root` v1.1 values (`--paper #f4efe4`, `--surface #fffdf8`, `--ink #241710`,
`--ink-2 #645940`, `--ink-3 #978b6d`, `--line #e3d8c1`, `--gold #a8761a`,
`--gold-deep #855410`) all present unchanged (zero `+`/`-` lines touch the `:root`
block in the diff).

**7. Builder v2 — single-source inline integrity** — PASS.
`tools/studio-build` line 239-241 `cat`s `docs/studio/universal-depth.css` verbatim
into `<style id="universal-depth">` at generation time — confirmed by direct
extraction: `sed -n '178,327p' docs/studio/builder.html` vs
`docs/studio/universal-depth.css` diff is **empty except one trailing blank line**
from the generator's own `printf '\n</style>'` — i.e. byte-identical content, no
divergent hand-copy. `builder.html` also contains the literal header string
`Universal depth v1.2 — canonical source` (line 179) and `<style id="universal-depth">`
(line 177).

**8. Builder v2 — behavior** — PASS.
`location.hash||'#page-overview'` present (line 1416) — opens on overview by
default. Sidebar rail lists 23 `#s-<slug>` links (22 surfaces + `cross-cutting`),
each with a state-orb span (`orbcls()` in the generator maps closed/building/
shaped/scanned/untouched → `.u-orb--lit/--soft/--unlit` + hue). Progress bar present
(`.progress`/`.pbar`/`.pfill`, gilded gradient). `function cardify()` present
(line 1340) splitting `## `-sectioned markdown into `.bcard` sections and injecting
`<span class="bcard-none">no entries yet</span>` when a card's body is empty after
trim — confirmed by direct code read, and confirmed structurally correct against
`reader.md`/`walk.md` (Gap ledger header present, zero items beneath it before the
next `## `).

**9. Builder v2 embedded runtime — ES3** — PASS.
Extracted the `(function(){ … })();` block (builder.html lines 1279–1438) to a
standalone file and ran the sanctioned harness:
`cscript //nologo //E:jscript tools/parse-check <file>` → **`PARSE OK`**, exit 0
(harness self-test also passed, so the result is trusted). Independent grep sweep
on the extracted block: `const` 0, `let` 0, `=>` 0 hits; `\bclass\b` and a backtick
both showed non-zero grep -c but on inspection every hit is inside an HTML-string
literal (`class="md-h..."` etc.) or a regex literal matching markdown backticks
(`` /`([^`]+)`/g ``) — not the JS keyword/template-literal syntax. Genuinely ES3.

**10. `CLAUDE.md` — append-only** — PASS.
`git diff --numstat HEAD -- CLAUDE.md` = **47 insertions, 0 deletions**. The added
text is the Studio Protocol's re-plan rule + guardrail ("THE SEQUENCE IS A LIVING
PLAN..." / "GUARDRAIL — THE AGENT ADAPTS, PRESTON STEERS...") appended after the
existing RENDER RIG bullet — both present verbatim.

**11. `docs/studio/sequence.md` — Re-plan log** — PASS.
`## Re-plan log` present at line 14 with a dated entry
(`**2026-07-08** — installed → depth law...`) matching the guardrail's dated-
rationale requirement.

**12. Gap-import arithmetic** — PASS, exact.
`grep -r '^- \[source: ' docs/studio/*.md | wc -l` = **146**. Cross-cutting alone =
**44** (`docs/studio/cross-cutting.md`). Surfaces (all files minus cross-cutting)
= **102**. 102 + 44 = 146, matching the claimed breakdown exactly. Per-source
breakdown independently summed: fable-audit-combined.md = 81, phase2-ledger.md =
60, charter.md §4 = 2, pass3-scope.md = 1, pass3-writing-loop.md = 2 → **81+60+2+1+2
= 146**, exact match. `grep -roh` of every unique `[source: ...]` tag returns
exactly those 5 filenames — no 6th source snuck in. Confirmed pass1/pass2-craft/
pass3-summary/pass3-ia/pass3-values are cited **zero** times (the "0 net-new,
already in combined" claim holds).

**13. Every imported line carries `[status: unverified]`** — PASS.
`grep -r '^- \[source: ' | grep -v '\[status: unverified\]'` = 0 lines. All 146
match the required `[source: <doc> <date>] [status: unverified] [sev: <sev>] <finding>`
shape.

**14. No fabrication (spot-check against source docs)** — PASS, 8 of 8 checked.
Cross-checked account.md/PA1, arc-detail.md/OG3+F-MA1+AF6, artifact.md/VC3,
about.md's 3 phase2-ledger imports, and notebook.md's pass3-writing-loop import
directly against `docs/audit/fable-audit-combined.md`, `docs/praxis-2.0-phase2-ledger.md`,
and `docs/checkpoints/pass3-writing-loop.md`. Every finding text, severity, and
file:line citation matches the source verbatim or as a faithful close paraphrase.
No invented finding found in the sample.

**15. Pre-existing ledger shape preserved** — PASS (with a scope caveat).
Sampled `about.md`, `notebook.md`, `reader.md`: all carry the census scaffold shape
(`## State` / `## Decisions` / `## Gap ledger` / `## Round history` / `## Next`),
with State/Decisions/Round-history/Next empty and only `## Gap ledger` populated —
consistent with "surface ledgers were empty before import." **Caveat:** these
files are untracked (never committed — `git log --all -- docs/studio/<slug>.md`
returns nothing for any of them), so this cannot be proven by `git diff`; it is
confirmed by structural inspection only, not diff-provenance.

**16. `.claude/agents/studio-scan.md` — STEP 0 verify-first duty** — PASS
(same untracked caveat as #15). The file contains the exact described mechanic:
"STEP 0 — VERIFY IMPORTED FINDINGS FIRST," the sanctioned single rewrite (flip
`[status: unverified]` → `[status: open, verified <date>]` or
`[status: resolved <date>, ...]`), and the rule that only the status tag may
change, never the finding text/source/order. This file has zero git history
(`git log --all --oneline -- .claude/agents/studio-scan.md` = empty) — its
"amended" framing cannot be diff-verified against a prior committed version, only
confirmed present and correctly worded now.

**17. `git diff --check`** — PASS. Exit 0, no whitespace/conflict-marker errors on
any tracked touched file. (CRLF warnings on all 4 tracked files are the documented
cosmetic autocrlf notice, not an actual flip — see #18.)

**18. EOL preserved** — PASS. `git ls-files --eol` on all 4 tracked touched files
shows `i/lf w/lf` (index LF, working tree LF) — no flip, matches pre-existing
convention. All new untracked files are `w/lf`, consistent with the sibling
tooling/doc files already in the repo (e.g. `tools/parse-check`).

**19. Nothing staged, staging plan is explicit-file** — PASS (moot but confirmed).
`git diff --cached --name-only` is empty — nothing is staged yet, so there is no
staging-plan violation to grade; this gate is satisfied by "nothing has been
staged with `-A`."

**20. Sanctioned accessors / no new schema fields** — PASS, trivially. Zero `js/`
files touched (gate #1), so there is no Firestore accessor or profile/schema
surface for this wave to have violated.

**21. Yumi covenant untouched** — PASS. `assembleContextData` lives at
`js/yumi-brain.js:181` (not `js/state.js` — the CLAUDE.md/MEMORY.md pointer is
stale, per a standing memory note); `git status` confirms `js/yumi-brain.js` and
`js/state.js` are both clean (zero diff). Covenant path untouched.

**22. Honest empty states** — PASS. The builder's `cardify()` (builder.html:1340,
verified via cscript parse + code read) converts any `## `-sectioned card whose
body is empty after trim into `.bcard-empty` + `<span class="bcard-none">no
entries yet</span>` (builder.html line ~1358 / universal-depth source line 164).
Verified structurally against `reader.md`/`walk.md`, whose `## Gap ledger` /
`## Round history` / `## Next` sections have zero items — these render the honest
empty state, not a fabricated entry.

**23. sw.js CACHE_VERSION** — PASS (not bumped, correctly). `git status` shows
`sw.js` clean; current version `praxis-v3.184` unchanged — correct for a
docs/tooling-only wave that ships nothing to the live app.

---

## Residuals (not blocking, worth Preston's eyes)

1. **No `docs/checkpoints/d1-*.md` recon/build checkpoint file exists.** The
   builder's report was apparently narrative-only this round; there is no
   artifact carrying the builder's own pre/post byte-delta numbers for me to
   diff against. I measured everything independently instead (all figures
   above are my own `wc -c` / `git diff --numstat` / grep counts, not
   back-derived from a self-report). Recommend the close-out add one before
   commit, per FIX-PROTOCOL's "byte deltas measured before AND after."
2. **Gates #15 and #16 (ledger-shape preservation, studio-scan.md amendment)
   are diff-unverifiable** — both target files are untracked with zero commit
   history in this repo. My PASS rests on structural/content inspection, not
   on `git diff` proof against a prior committed state. This is a process gap
   inherited from the whole `docs/studio` scaffold being local/uncommitted
   since its install (per standing project memory), not something D1
   introduced.
3. **`docs/studio/reader.md` and `docs/studio/walk.md`** carry mtimes from an
   earlier pass (13:07) than the rest of the surface files (15:03) — consistent
   with "0 gaps found, no import needed" rather than being skipped in error;
   confirmed both render 0 `[source:` lines and both show correctly in the
   builder's overview grid with no gap count. Flagging only so it's a named,
   checked fact rather than a silent gap.

---

## VERDICT

**VERDICT: PASS**

All 23 checked gates pass on independently re-derived evidence (byte sizes, grep
counts, brace balance, cscript parse output, and direct diff/content inspection —
none accepted on the builder's narrative alone). No live-app file was touched, the
two foundation locks are byte-exact untouched, the `.galaxy-night` invariant and
`:root` v1.1 values are byte-identical to HEAD, the single-source CSS genuinely
drives both the canon page and the regenerated Builder (verified by direct
byte-diff of the inlined block), the embedded Builder runtime parses clean under
the sanctioned ES3 harness, and the 146-line gap import reconciles exactly
(102 + 44) with zero fabrication found across an 8-item spot-check against the
five named source docs.

CLEARED TO COMMIT.
