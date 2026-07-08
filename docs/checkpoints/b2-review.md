# B2 — Builder v3 — independent review

Base commit: `a591e6c` (D1). Nothing committed; all evidence re-derived directly
from the working tree via Bash/Grep/Read (no self-report file existed to diff
against — `docs/checkpoints/` had no b2-*.md at review time).

## NON-GOALS / scope

- **PASS** — `git diff --name-only HEAD` = exactly `docs/studio/builder.html`,
  `docs/studio/sequence.md`, `tools/studio-build`. No fourth entry.
- **PASS** — law files byte-identical: `git diff --stat HEAD -- docs/studio/praxis-universal-token-sheet.md docs/studio/universal-depth.css design/praxis-design-canon.html design/praxis-profile-galaxy-mockup.html` → empty for all four.
- **PASS** — `git diff --name-only HEAD -- js assets index.html sw.js` → empty. `sw.js` CACHE_VERSION untouched (`praxis-v3.184`, read-only stamp in generator, no bump needed — doc/tooling build).
- **PASS** — `universal-depth.css` inlined byte-identical: extracted `<style id="universal-depth">…</style>` (9700 B) vs `docs/studio/universal-depth.css` (9699 B); `diff` shows exactly one extra trailing blank line in the extracted copy, nothing else. Header `Universal depth v1.2 — canonical source; copies must cite this file+version.` present at builder.html:209 (and again at :217, both inside the inlined comment block itself).

## Stage 1 — generator (Builder v3)

- **PASS** — Default landing: `var h=location.hash||'#page-overview'` (builder.html:1222); `id="page-plan"` and `id="page-overview"` both present.
- **PASS** — Sidebar: 3 `brail-link brail-dest` (Overview/Plan/Mockups) + 6 `brail-group` headers (core/reading/writing/social/yumi/system). `brail-slug` spans render human names only (`Shelf`, `Sub-theory page`, `What Yumi sees`, etc. — grep of all 23 `brail-slug` spans confirms zero raw slugs as link text). Raw slugs appear only in `href="#s-…"`, `id="s-…"`, `data-md="…"`, and a `surf-slug` badge on each surface's own page (a `<span>`, not a link — not "link text").
- **PASS** — Overview: "Where the build stands" (h1), `now-card` present, heat grid = 23 `heat-tile`s (22 surfaces + cross-cutting) under the 6 group labels, `pfill` progress bar at `width:0%` (0/22 closed — every surface md's `state:` front-matter is `untouched`, confirmed by independent grep).
- **PASS** — Plan thread: 14 `tnode`s total — 1 plain `tnode` (Shipped `<details>` collapse), 1 `tnode now-lead`, 11 `tnode dim` (Next=2 + Then=9), 1 `tnode launch`. 12 `ptick-box` checkboxes rendered (data-key list confirms Now1+Next2+Then9=12; the 13th grep hit for the substring "ptick-box" is the JS selector string in `wireTicks()`, not a 13th control). `propcard` template exists (`tools/studio-build:328-331,512`) and renders **zero** instances (`grep -c 'class="propcard'` on builder.html = 0), matching zero `PROPOSED:` lines in sequence.md.
- **PASS** — Reach-map: `class="reachmap"` count = 1 (the only dark element); inline `<svg>` count = 1 with exactly 5 `rm-node` text elements (SHIPPED/NOW/NEXT/THEN/LAUNCH); caption text "GOLD THREAD = THE PLAN …" present verbatim.
- **PASS** — Typography discipline: mono (`var(--mono)`) confined to chips/badges/eyebrows/meta (`.chip`, `.touch-chip`, `.heat-meta`, `.facts`, `.brail-group`, `.now-eyebrow`, `.rm-title/.rm-node/.rm-caption`, `.md-h3`). Now-move (`.now-move{font-family:var(--serif)…}`), thread sentences (`.tsent` inherits body `var(--sans)`; `.now-lead .tsent` is serif), Shipped list items (`.si`), aux bullets (`.bl`), replan log (`.rl`) all carry no mono override — body/serif as required.
- **PASS** — Embedded runtime JS is ES3: extracted the `(function(){…})();` block (72 lines) and ran `cscript //nologo //E:jscript tools/parse-check b2-extracted-script.js` (copied to repo root to route around the FSO-sandbox quirk noted in prior reviews) → `PARSE OK: b2-extracted-script.js`, exit 0. Grep on the extracted block: `const`=0, `let`=0, `=>`=0, JS `class{`/`class(`=0; the one backtick hit is inside a regex literal (`` /`([^`]+)`/g ``) matching literal backtick characters in markdown source, not a template literal.
- **PASS** — `<meta name="viewport" content="width=device-width, initial-scale=1.0">` present; `@media (max-width:640px){` present. HEAD stamp in the doc = `a591e6c`, matches `git rev-parse --short HEAD`. Tag balance: div 203/203, a 90/90, details 4/4, svg 1/1, section 27/27 — all even; traced `render_node()`'s own div-open/close sequence by hand (4 opens/4 closes with a card wrap, 3/3 without) to confirm genuine nesting, not just coincidental global counts (no Python available in this sandbox for a full stack-based re-check).

## Stage 2 — touches seeding

- **PASS** — exactly 5 `touches:` lines in sequence.md, matching the named set: R2 `[books, home]`, Signed-out/first-run `[home, onboarding]`, Goodreads `[import-capture]`, Public commons `[commons]`, Values–arcs `[profile, arcs]`. `git diff HEAD -- docs/studio/sequence.md` shows these 5 lines as the *entire* diff — nothing else touched in the file.
- Judged each seed against its own item text:
  - R2 "(Shelf or Home)" → `books` confirmed as Shelf's real slug (`books.md` front-matter `render_fn: renderShelf`). Derivable.
  - Signed-out/first-run: text names "Home" and "onboarding" directly. Derivable.
  - Goodreads: text says "the import infra is real work" — maps to the one surface literally named `import-capture`. Derivable, if a slightly looser paraphrase than the other two.
  - Public commons: title + body both say "Public commons"/"public routes". Derivable, unambiguous.
  - Values–arcs: body says "profile values shape how arcs form" — both surfaces named directly. Derivable, unambiguous.
  - R1 correctly has **no** touches — it names `design/*.html` (law files), not census surfaces. Correct exclusion.
  - Flagged-but-correctly-excluded borderline cases: "Shared-tab account-switch race" touches `state.js` (a code file, not a census surface, and cross-cuts 8 latches app-wide — no single-surface name); "Backport the aesthetic uplift" is explicitly app-wide; "Galaxy encoding" names "Galaxy" (not a standalone census surface — galaxy lives inside `profile.md`) and could arguably seed `profile`, but the item text never says "profile," so under the stated no-inference rule, leaving it unseeded is defensible, not clearly wrong; "Register redesign + consented door" touches two plausible surfaces (notebook registers vs. arcs/sub-theory publish pill) with neither named explicitly — ambiguous, correctly left unseeded. None of these look like a rule violation; they read as intentionally conservative.
- **PASS** — every seeded slug (`books`, `home`, `onboarding`, `import-capture`, `commons`, `profile`, `arcs`) exists in the 22-surface census.
- **PASS** — 8 `touch-chip`s total, split 2/2/1/1/2 exactly as named.
- **PASS** — reach-map shows the union of Now+Next touches only: Now(R1)=none, Next(Studio-install=none, R2=books,home) → 2 orbs rendered (`Home · 9`, `Shelf · 8`), not cold-start (the `MAPCOUNT -eq 0` / "no reach data yet" branch is present and correctly unreached here — confirmed both the code path and the live output).
- **PASS** — CONNECTED strips appear on exactly 7 surface pages — `s-home`, `s-books`, `s-arcs`, `s-profile`, `s-commons`, `s-onboarding`, `s-import-capture` — matching every Now/Next/Then touch, and only those; `notebook` (untouched) confirmed to carry no `connected` div.

## Seam-hunt

1. **Content fidelity bug (real, found independently) — malformed HTML from the new `fmt()` shell formatter.** The "Shared-tab account-switch race" Then-item body contains `` `*Loaded` `` and `` `*WritePending` `` (literal code spans naming the eight `*Loaded`/`*WritePending` state latches — this exact text already existed in HEAD's sequence.md, unchanged by B2). `tools/studio-build`'s new `fmt()` (builder.html-generation only; **does not exist in HEAD's `tools/studio-build` at all** — confirmed via `git show HEAD:tools/studio-build | grep '^fmt()'` returning nothing, so this is a wholly new v3 code path) processes backtick code-spans *before* italic markup, with no masking — so the lone `*` inside each code span is picked up by the later `s/\*([^*]+)\*/<em>…/` pass and matches across both spans, producing invalid tag soup: `<code><em>Loaded</code> and <code></em>WritePending</code>` (verified at builder.html:365, in the rendered Plan-page HTML). This does not break the page's overall tag balance (div/a/details/svg/section counts all check out) and a browser will silently repair it, but it **does misrepresent the source content** — the reader sees "Loaded" and "WritePending" run together in broken italics instead of the intended literal `*Loaded`/`*WritePending` code text. It is not present anywhere else in the touched markdown (grep for `` `\*[A-Za-z] `` across all of `docs/studio/*.md` returns only these two lines) so the blast radius is one sentence on one page, but it is a genuine, reproducible defect in the new generator code, not a pre-existing issue newly exposed by content — the client-side JS `inline()` function (used for surface-page markdown) has the identical unguarded ordering and would hit the same bug if a surface `.md` ever used `` `*word` `` — worth a follow-up note for whoever writes the next surface ledger entry.
2. Empty-`touches` field parsing (the `\037` delimiter) verified correct: 9 of the 11 `tnode dim` items have no `touches:` line in sequence.md and all 9 still render their `tsent` body correctly (confirmed in the raw dump) — no field-shift or truncation.
3. `render_node` div nesting: balanced by direct trace of the function body (see Stage 1).
4. Cold-start dignity: the "no reach data yet — touches appear as rounds are planned" branch exists and is wired to fire whenever `MAPCOUNT -eq 0`; not currently exercised (2 touches exist) but present and reachable.
5. No fabricated content found — every number (22 surfaces, 0 closed, 146 gaps, 7/7/9/9-per-round-shipped-count, per-surface gap counts) was independently re-derived from the surface `.md` front-matter/gap-ledgers and matched the rendered output exactly.

## Other gates

- **Gate 4 (EOL)** — PASS. All three touched files are LF in both the HEAD blob and the current working tree (0 CR bytes each way); the "LF will be replaced by CRLF" message is the standing cosmetic autocrlf warning, not an actual flip.
- **Gate 5 (CACHE_VERSION)** — N/A / correctly untouched. This is a tooling+doc build; `sw.js` diff is empty, `CACHE_VERSION` stays `praxis-v3.184` (read-only stamp in the generator).
- **Gate 6 (diff --check / staging)** — PASS. `git diff --check` clean (exit 0, no whitespace errors beyond the cosmetic CRLF warning). Nothing is staged/committed yet, so no `-A` risk to grade; `test-arc-constellation.html` is untouched (not in the diff).
- **Gate 7 (Sanctioned accessors)** — N/A. No Firestore `.set/.update/.delete` or `.collection(`/`.doc(` calls anywhere in the 3 touched files; the only hits are prose citations inside the embedded gap-ledger data islands (e.g. `firestore.rules`, `publishedArcs` mentions from the Fable audit), not code.
- **Gate 8 (Yumi covenant)** — N/A / untouched. `js/state.js` and `js/yumi-brain.js` are not in the diff; every "assembleContextData"/"covenant" hit in the touched files is a prose reference inside sequence.md or an embedded gap-ledger citation, not a code change.
- **Gate 9 (Honest empty states)** — N/A for this build's own surface (this is a build-tooling change, not an app surface with logged-out/zero-data paths) — the closest analogue, cold-start dignity for the reach-map when there are no touches, is present and reachable (see seam-hunt #4).

## Honest residuals (not defects)

- No prior B2 self-report/checkpoint file existed in `docs/checkpoints/` to reconcile against — all figures in this review are independently derived, not diffed against a builder claim.
- The Mockups page glob-lists whatever `design/*.html` files currently sit in the working tree, including several untracked, spaced-filename mockups (`Wave 2 The Shell.html`, `Wave 5 - Identity.html`) — environmental, not something this build introduced or should filter.
- Byte deltas (measured, absolute): `builder.html` 113,215 → 121,752 B (+8,537); `sequence.md` 7,751 → 7,882 B (+131); `tools/studio-build` 28,395 → 43,285 B (+14,890). `git diff --stat` corroborates: builder.html 650 lines changed, sequence.md +5/-0, tools/studio-build 880 lines changed.

## VERDICT

**PASS** — with one logged finding: the new `fmt()` formatter in `tools/studio-build` mis-renders one existing sequence.md sentence (backtick-wrapped `*Loaded`/`*WritePending`) into malformed nested `<code>/<em>` tag soup on the Plan page. It does not break tag balance, scope, or any hard gate, and is isolated to that single sentence — but it is a real content-fidelity defect in the new v3 code, not a pre-existing issue, and should be fixed (mask code-spans before running bold/italic passes, in both the shell `fmt()` and the client-side `inline()`, which shares the same unguarded ordering) before this pattern appears in more content.
