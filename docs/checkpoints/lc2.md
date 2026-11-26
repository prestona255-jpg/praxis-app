# LC2 — the blue sky and sunset burst (v3.344)

LC2 STARTED 2026-11-26. BETA.md row LC2, size SMALL (look only). Rulings r88, r89, r90
(`docs/checkpoints/p2-eighteenth-sitting-rulings.md`) and Preston's R1–R8 of 26 Nov below. Applied byte for byte from the
build chat's patch and its follow-on lc2-fix1.patch (Preston's go-on, G1–G3). Model: Opus. HEAD at start `93fe836` (R3, v3.343), branch main.

## Protocol docs
Found and read: CLAUDE.md, PROTOCOL.md (v1.2), docs/FIX-PROTOCOL.md (v1.3), BETA.md; the agent files they name in
.claude/agents/ (fix-red-team, praxis-reviewer, praxis-recon, repo-mapper, fix-implementer, studio-mockup, studio-scan);
the ledgers BETA.md says must agree with it (BOARD.md, docs/studio/sequence.md, docs/launch-runway.md,
docs/studio/LAUNCH-STATUS.md, docs/Checklist and Roadmap/BUILD_STATE.md). Missing: none. (FIX-PROTOCOL §1 names
`docs/LAUNCH-STATUS.md`; that path does not exist — the status ledgers are BOARD.md and BUILD_STATE.md, as at R1 and R3.)
`sh tools/ground-truth`: HEAD 93fe836, hook gate ARMED (core.hooksPath = hooks), FIX-PROTOCOL v1.3, seven agents.

## Rulings for this build (Preston deferred every decision to the build chat, 26 Nov 2026)
- R1 Order: LC2 now, ahead of Find a book (R2). Preston, 26 Nov: "could we do the sky build next once the book page is
  good". The book page (R3) is live and passed his phone check.
- R2 js/hand.js unlocked for this build only: was locked at `dc6a021e5b89652cf5e6c0a84ae249cd` (53,596 B), locked again
  at **`4000e9cc347643f7099f75c3e994a692` (55,796 B)** after the follow-on lc2-fix1.patch (G2, below). (The first LC2
  patch alone left it at `13f369cf741247bc429cc1e0157e729c`, 55,761 B — never committed.)
- R3 The blue is scoped to the sky's own hosts (`.sky` and the Open Lens band). `--sky` keeps its brown values everywhere
  else: Yumi's panel, covers, sunk fields, the category page and the book page do not change.
- R4 The burst is one still background layer. hand.js tells the host where the flower is (`--sky-fx`, `--sky-fy`,
  `--sky-rx`, `--sky-ry`) so the burst sits behind the flower on Home, on You and on desktop.
- R5 In the blue sky a stroke is coloured only by its distance from the flower (gold, coral, pink, pale blue), as the
  Style Study drew it. The old tint toward a nearby lens applies only in the brown sky. Gold strokes unchanged in both.
- R6 No stored lens look changes; `gardenColour` unchanged. 10 of the 17 Garden colours read under 3:1 as flat marks on
  the Day blue; they ship as drawn in the approved Style Study. Residual with the full table (below); a dated note beside
  the colour law in `docs/studio/l4-lens-engine-contract.md` (§ the colour law, item 9), the law itself not rewritten.
- R7 The way back is a code switch, `LC2_BLUE_SKY` in js/views.js, plus `?sky=brown` for one load. Nothing stored; no new
  storage key.
- R8 The theme-color meta is not changed. Residual: the phone's top strip stays brown above the blue sky.

## Stage 0 — pre-flight
- Branch main; HEAD `93fe836` (= expected); `sw.js` CACHE_VERSION `praxis-v3.343`. One tracked file dirty:
  `docs/checkpoints/r3.md` (R3's post-push record, written "uncommitted (rides the next build)"); it rides this commit.
- Patch `lc2.patch` from Downloads, copied to the session scratch folder: **10,777 B, md5 `7861e179b5b0182c9bd0ac194b1b99d0`** — MATCH.
- `git apply --check --verbose`: "Checking patch" × 5, exit 0. `git apply --stat`: 5 files changed, 63 insertions(+),
  4 deletions(-) — MATCH.

## Stage 1 — applied and staged
`git apply` exit 0; `git add` of the five files by name. The STAGED copies (`git cat-file -s`, md5 of `git show :<f>`,
blob from `git ls-files -s`, CR bytes of the blob):

| file | size | md5 | blob | CR | vs expected |
|---|---|---|---|---|---|
| js/hand.js | 55,761 (was 53,596, +2,165) | 13f369cf741247bc429cc1e0157e729c | d8d2580bcd87094169e610a7a1d53940990dcb98 | 0 | MATCH ×4 |
| js/views.js | 1,489,681 (was 1,489,203, +478) | ee68199f5ebbc618cef2af9b497bcde3 | a605e79f4cfd50d9c8626aee814d7958d59c6b6f | 0 | MATCH ×4 |
| assets/theme.css | 42,746 (was 41,721, +1,025) | d259945d5dfcdb76f99e24d1c061a178 | 662ff64113426b5a248ea24c0f3020170d34f83b | 0 | MATCH ×4 |
| assets/components.css | 996,584 (was 995,364, +1,220) | 210190d9692fe1a6112000f062ebc0d1 | bbcdfc73217ee5948da4d780a304f1f5074c1bd5 | 0 | MATCH ×4 |
| sw.js | 6,894 (same) | d141236e100fde5698b30d04d696da3c | 68a283dbdc1fddb0ddda4dcc15aeae1cd2d86774 | 0 | MATCH ×4 |

Locks re-md5'd from the index: lumen-amber.css `631bc2aad9f55bbf77b090b30f6807db` (11,953 B), marks.js
`772886c049d0d6d03d341507e602d88a` (10,255 B) — unchanged. js/state.js, js/integrations.js, js/app.js, firestore.rules:
index md5 = HEAD md5 (untouched).

## Stage 2 — proofs
**2.1 Parse** (`tools/parse-check` on the staged bytes written out LF): `PARSE OK` js/hand.js exit 0 · js/views.js exit 0 ·
sw.js exit 0.

**2.2 tools/lc2-test** (new; cscript JScript, ES3; strips CR on read; one line added to `$Harnesses` in tools/checks.ps1).
It compiles js/hand.js twice into a stub page with a recording canvas context — OLD (`git show 93fe836:js/hand.js`, md5
`dc6a021e…`) and NEW (the tree under test) — and drives both with the same three lenses, the same flow field (host
390 × 560, field 390 × 520 under a 40 px head) and the same clock, 40 steps after the build. Cases a–g as briefed; on
the red-team's review (below) c and d were tightened and g's version pin loosened, before the final runs:
- c also proves R5 exactly: every non-gold blue stroke must equal the ramp step and alpha that its start point's distance
  from the flower gives (worked out in the harness, not read from hand.js), with strokes both near and far.
- d also pins `--sky-rx` 328px and `--sky-ry` 178px (the geometry's values at 390), as well as fx 195px, fy 300px.
- g reads "praxis-v3.344 or later", so the next build's cache bump does not turn Checks red.
- Where OLD comes from: the second argument; else `git show 93fe836:js/hand.js`; else (a shallow clone, as on the Checks
  machine, or a copy with no .git) fingerprints recorded from OLD — brown 11,355 strokes `273d22fd`, looks and Garden
  `07b13a22`, Yumi 9,069 strokes `077dd2ea` — which every run with OLD re-proves against OLD (section 0). The run prints
  which source it used.
- The chat's figure of 10,534 strokes came from its own sky size; this stub's is 11,355 (287 particles). Same law.
- Correction during the build: my first count of the CSS block's rules was wrong (I wrote 4; it has 3 rules carrying 5
  selectors). The harness's expectation was corrected; the patch was not touched.

Readings (final harness, staged md5 of tools/lc2-test recorded at the gate):
- RED, root = `git archive 93fe836` tree, OLD = file: **22 of 41, exit 1**. Fails exactly c (NEW = OLD; strokes off the
  ramp; not the distance colour), d (no `--sky-*` written), f (no `--sky-blue`, no LC2 block), g (no switch; reads
  v3.343). Passes a, b, e and section 0. (With no OLD file, on a tree with no .git, the same tree reads 17 of 36, exit 1:
  the fingerprint mode has no section 0; the reviewer reproduced both.)
- GREEN, root = staged bytes written out LF, OLD = file: **41 of 41, exit 0**. a: 11,355 strokes identical; b: identical;
  c: 915 gold strokes in the same places as the brown run, 10,440 others, all on the 33 steps, 0 off the distance colour,
  697 near / 2,034 far, highest alpha 0.576; d: 195px 300px 328px 178px, brown writes none; e: 9,069 strokes identical,
  no burst stroke; f: --sky #1C120A ×1 / #2B1E12 ×2, --sky-blue #0F2F5E ×1 / #1D5AA6 ×2, 3 rules / 5 selectors all under
  `html:not([data-sky="brown"])`, 0 hex; g: switch ×1, v3.344.
- GREEN in the repo with no argument (OLD by git): **41 of 41, exit 0**. GREEN on the LF copy with no argument and no
  .git (OLD by fingerprints, as CI runs it): **36 of 36, exit 0**.
- Mutations of the staged hand.js (one line each, scratch only): m1 burst centred on the first lens instead of the
  flower → **40 of 41, exit 1** (the distance-colour case); m2 the lens tint left on in the blue sky near a lens →
  **39 of 41, exit 1**.

**2.3 tools/checks.ps1** on a fresh LF copy of the index (`git -c core.autocrlf=false checkout-index -a`):
`INFO commit none · INFO version praxis-v3.344 · INFO line-endings sw.js LF` (tools/lc2-test in the copy = index, md5
`53e72f17b5be653d1e5bed7bd9c9e80e`). Two self checks PASS; parse PASS × 21; harnesses fx1c-sim, delete-test,
export-test, ceiling-core-test, lens-data-test, lens-eval-test, r1-test, lc2-test (36 of 36, by fingerprints) PASS;
**r3-test FAIL, 67/68 (F-1)**; rigs _template 1/1, d1a 82/82, fb-1a 99/99, fb-1a-extras 20/20, r3 32/32 PASS.
**`CHECKS: 36 of 37 passed, 1 failed` / `FAILED: harness r3-test`, exit 1.** The last recorded run (R3's push) was 36 of
36; this tree has one more check, as briefed, and one red.
The same copy with the one-line r3-test fix of F-1 (scratch only, 2 changed lines in the diff, CR 0): `r3-test 68/68`,
**`CHECKS: 37 of 37 passed, 0 failed`, exit 0.** (An earlier run on the first harness version read the same: 36 of 37,
r3-test the only red.)

**2.4 Review agents.**
- fix-red-team (§9, Sonnet): **no block-commit findings; 2 should-fix, 3 nits.** Should-fix 1 (g pinned v3.344 exactly,
  so the next bump would turn Checks red) — taken: g now reads "v3.344 or later". Should-fix 2 (c did not prove R5's
  distance-only colour; d did not pin rx/ry) — taken: the exact distance-colour case and the rx/ry values, proved by the
  two mutations above. Nits, recorded, not acted on: `?sky=brown\b` also matches `?sky=brown-x` (it can only go brown);
  aliases declared at :root as `var(--sky)` (`--ground`, `--br-deep`, `--sunk-d`) resolve brown inside the blue hosts;
  the Day/auto selector list also hands the new tokens to `.arcs.lum-amber-deep` and `.arcfield`, which read none of them.
  It confirmed against source: YumiSky never takes the burst; `burst()` cannot be reached with an empty current; the
  `--sky-*` writes happen only on change; views.js sets `data-sky` before any sky is built; the auto block covers light
  and the root covers dark; ES3 holds; CACHE_VERSION +1; no storage write in the diff.
- praxis-reviewer (Sonnet): **HOLD on one item, F-1** (pushing this tree turns Checks red; the fix is Preston's call).
  Measured and passed: the staged table (sizes, md5, CR 0); the locks; i/lf on every staged file; sw.js one line;
  checks.ps1 one line plus the comma; ES3 in tools/lc2-test and the views.js lines; `git diff --check` clean; non-goals
  untouched; tools/lc2-test 41 of 41 exit 0 in the repo and red on the 93fe836 tree; BETA.md 136 lines and every ledger
  agreeing on the order; the hand.js relock recorded in BOARD, sequence, BUILD_STATE, the engine contract and here.
  Confirmed F-2 (about 1.01:1) and F-3 (fx has no left offset). Also raised: builder.html is regenerated once at the
  gate and staged by name; my capture count read 18 where there are 14 (corrected); NITs (older dated entries in
  sequence.md and BOARD.md:72 read as history).

**2.5 Pictures** — the repo's capture path (headless Chrome over CDP, as R1 and R3; the rig in
`.claude/rig/captures/lc2/`, untracked, seeding through R3's `r3-rig.js`): the applied working tree served on
localhost:8940 (served sw.js `praxis-v3.344`), 390 × 844 dpr 3 mobile + touch and 1360 × 900 dpr 1, signed in by the
`praxis_user` stub (4 books, 5 lenses, 5 notes; nothing reaches Firestore), taken fresh 2026-11-26 13:20. 14 viewport
captures in `docs/checkpoints/lc2-shots/`: `lc2-home-blue-{390,1360}-{night,day}`, `lc2-you-blue-{390,1360}-{night,day}`,
`lc2-lens-blue-390-{night,day}` (the Open Lens band), `lc2-home-brown-{390,1360}-{night,day}` (`?sky=brown`). Read from
each rendered page (log `.claude/rig/captures/lc2/log-measure.txt`):
- Blue: `data-sky` absent; the sky host's `--sky` `#0F2F5E` Night / `#1D5AA6` Day, background-color `rgb(15,47,94)` /
  `rgb(29,90,166)`; the burst is a radial-gradient at the flower: Home 390 at 171px 279px (flower centre 195, 279 — the
  burst's x is where the turning flower's field puts it), You 390 at 195px 216px (flower 195, 216), Home 1360 at 300px
  423px (flower 300, 423), You 1360 at 680px 216px (flower 680, 216). Lens names carry the dark edge.
- Outside the sky: `--sky` on `<html>` and on Yumi's panel stays `#1C120A` Night / `#2B1E12` Day in every capture (R3).
- The Open Lens band: `--sky` `#0F2F5E` / `#1D5AA6`, background the same blue (r90).
- `?sky=brown`: `data-sky="brown"`, `--sky` brown, the old pool/lamp background, no `--sky-*` written, no text edge.
- Page errors 0.
Home 390: the burst sits 24 px left of the flower (x 171 vs 195) — finding F-3 below. (These were the first gate's
captures; all 14 were retaken after lc2-fix1 — see "The go-on" below. The files in lc2-shots/ are the retaken ones.)

## Findings at the first gate — all three closed by the go-on (below)
The patch was not repaired at the first gate. F-1 closed by Preston's G1 (the r3-test fix, in this commit); F-2 and F-3
closed by the chat's lc2-fix1.patch (G2), applied byte for byte. As first found:
- **F-1 — tools/r3-test reads past its own block.** Its B8 case slices components.css from the R3 block's begin marker to
  the END OF THE FILE (`tools/r3-test:168`). LC2's block now follows R3's, so r3-test counts LC2's 11 selector lines as
  R3's and fails 67 / 68. The assumption was in r3-test before this patch; the patch is clean (r3-test is 68 / 68 on the
  93fe836 tree). One-line fix, proved in scratch only: end the slice at R3's own end marker
  (`csrc.slice(csrc.indexOf(BEG), csrc.indexOf(END) + END.length)`) → 68 / 68 on the staged tree and on 93fe836.
  Pushing LC2 without it turns the push's Checks run red. Preston's call: fold it into this commit, or its own task.
- **F-2 — in Day, the sky's quiet links are near invisible on the blue.** "Name your own", "Ask Yumi again" and
  "Lenses ›" are `.lx .quiet` buttons coloured `--ink-3` (Day `#6A5646`), which LC2 does not re-point. On the Day blue
  `#1D5AA6` they read **1.01:1** (on the Day brown `#2B1E12` they read 2.34:1, already low). Night is fine: `#BFAB94` on
  `#0F2F5E` 5.96:1. Seen in `lc2-home-blue-390-day.jpg`. A design call for the chat (a follow-up patch); recorded here.
- **F-3 — on a phone's Home the burst is 24 px left of the flower (R4).** `skyVars` (hand.js) writes `--sky-fy` as the
  field's top offset plus its middle, but `--sky-fx` as the field's middle alone, with no left offset. The radial
  gradient is drawn in the host's box. Measured in the browser on the applied tree at 390 (Home): the host has
  `padding-left: 24px`, the field `offsetLeft` 24, `clientWidth` 342; `--sky-fx` 171px, the flower's centre 195 px from
  the host's left. On You at 390 and on Home and You at 1360 the field has no left inset and the burst is centred (195,
  300, 680). tools/lc2-test case d did not catch it: its stub field has offsetLeft 0. The burst is 287 px wide there, so
  the shift is soft; Preston's eye decides whether it shows. The fix (fx + the field's offsetLeft) is a hand.js change for
  the chat; the patch is not repaired here.

## The go-on (Preston's rulings G1–G3, 26 Nov 2026, same build, same commit)
- G1 The r3-test red: fixed in this commit. tools/r3-test's CSS slice ends at R3's own end marker; nothing else changed.
- G2 The burst offset (F-3) and the Day quiet links (F-2): fixed before the commit by the chat's follow-on
  lc2-fix1.patch. No fix of my own for either.
- G3 The Garden colours on the blue stay a recorded residual (R-1). No change.

**G1 — tools/r3-test.** One line (`tools/r3-test:168`):
`var blk = csrc.slice(csrc.indexOf(BEG), csrc.indexOf(END) + END.length), lines = ...` — staged 13,995 → 14,027 B, md5
`b2c16ff74f55c330cca597f32c0a0409`, CR 0. Readings: **68/68** on the staged tree (LF copy), **68/68** on the 93fe836 tree.

**lc2-fix1.patch** — from Downloads (14:43), copied to the scratch folder: **1,653 B, md5
`8f6d5f85c1e41970f35558e4cfa8165f`** — MATCH. Cut on the staged LC2 state: `git apply --check --verbose` exit 0 (Checking
patch assets/components.css, js/hand.js); `--stat` 2 files changed, 2 insertions(+), 1 deletion(-) — MATCH. Its diff: in
hand.js `skyVars`, `fx=Math.round(((S.field&&S.field.offsetLeft)||0)+G.cx)` (was `Math.round(G.cx)`); in components.css,
inside the LC2 block, `html:not([data-sky="brown"]) .sky .quiet{color:var(--on-night-2);text-shadow:var(--sky-edge)}`.
`git apply` exit 0; both files staged by name. The STAGED copies:

| file | size | md5 | blob | CR | vs expected |
|---|---|---|---|---|---|
| js/hand.js | 55,796 (was 55,761, +35) | 4000e9cc347643f7099f75c3e994a692 | b80169a129e9db85a6bde9ce87d0a739c8cb13a4 | 0 | MATCH ×4 |
| assets/components.css | 996,678 (was 996,584, +94) | ff83df4e88d6d815da525d7c35e231a6 | 94ac341826030262a40ebf9f3a7a2c519ae2f5dd | 0 | MATCH ×4 |
| js/views.js · theme.css · sw.js | unchanged | ee68199f… · d259945d… · d141236e… | a605e79f… · 662ff641… · 68a283db… | 0 | as the first table |

**tools/lc2-test, extended** (staged md5 `5918ee6712f7562aae3ef71a020b8527`): f now reads 4 rules / 6 selectors, and two
cases are added. (1) d: with the stub field inset 24 px in its host (342 wide, its flower at 171), `--sky-fx` must be
`195px` (24 + 171) and `--sky-fy` stays `300px`; with no inset, `--sky-fx` is `195px` as before. (2) f: exactly one rule in
the LC2 block for the sky's quiet links, starting `html:not([data-sky="brown"]) .sky .quiet` and using
`color:var(--on-night-2)`. Readings:
- GREEN, staged bytes (fresh LF copy of the index), OLD = file: **46 of 46, exit 0**. In the repo, OLD by git: **46 of 46,
  exit 0**. LF copy with no .git, OLD by fingerprints (as CI runs it): **41 of 41, exit 0**.
- RED, the 93fe836 tree: **22 of 46, exit 1** (c, d — the inset cases included — f, the quiet-link cases included, and g).
- MUTATION, the offset taken back out of hand.js in scratch — byte for byte the pre-fix1 hand.js, md5 `13f369cf…`:
  **45 of 46, exit 1**, the one red `field inset 24: --sky-fx is 24 + the flower's x in the field (171) = 195px`.
- Untouched cases, as pasted from the green run: section 0 `brown strokes, count = 11355`, `brown strokes, fingerprint =
  273d22fd`, `looks and Garden colours, fingerprint = 07b13a22`, `Yumi strokes, count = 9069`, `Yumi strokes, fingerprint
  = 077dd2ea`; a `the current ran = true`, `NEW vs OLD, every strokeStyle in order (11355 strokes) = identical`; b `NEW vs
  OLD = identical`; e `Yumi's current ran = true`, `NEW vs OLD, every strokeStyle in order (9069 strokes) = identical`,
  `no burst stroke in Yumi's panel = none`.

**Checks on a fresh LF copy of the index** (`git -c core.autocrlf=false checkout-index -a`, after the go-on):
`INFO commit none · INFO version praxis-v3.344 · INFO line-endings sw.js LF`. Self checks PASS ×2; parse PASS ×21;
harnesses fx1c-sim 72/72, delete-test 58/58, export-test 58/58, ceiling-core-test 36/36, lens-data-test 101/101,
lens-eval-test 68/68, r1-test 87, **r3-test 68/68**, **lc2-test 41 of 41** (by fingerprints, no .git); rigs _template 1/1,
d1a 82/82, fb-1a 99/99, fb-1a-extras 20/20, r3 32/32. **`CHECKS: 37 of 37 passed, 0 failed`, exit 0** — one more check
than the last recorded run (R3's push, 36 of 36), all green.

**Pictures and measurements, retaken** 2026-11-26 14:45 on the applied working tree served on localhost:8941 (served
hand.js, CR stripped, md5 `4000e9cc…`; served components.css carries the `.sky .quiet` rule ×1), same rig, viewports and
seed as above. All 14 captures retaken (the same names), including `lc2-home-blue-390-{day,night}` — the Home state with
"Name your own" under the sky ("Lenses come once your shelf holds five books"). Page errors 0. Measured, not eyeballed
(`.claude/rig/captures/lc2/log-measure.txt`; burst x = `--sky-fx`, flower x = the `.core` centre in the host):

| surface | burst x | flower x | difference |
|---|---|---|---|
| Home 390 (Night, Day) | 195 | 195 | 0 px |
| You 390 (Night, Day) | 195 | 195 | 0 px |
| Home 1360 (Night, Day) | 300 | 300 | 0 px |
| You 1360 (Night, Day) | 680 | 680 | 0 px |

The quiet links on the sky (computed colour against the sky host's background colour, in the page): Day `rgb(227,236,248)`
on `rgb(29,90,166)` **5.75:1**; Night `rgb(220,230,245)` on `rgb(15,47,94)` **10.50:1** — the chat's figures exactly; text
shadow the soft dark edge. Same at 390 and 1360, Home and You. The way back unchanged: with `?sky=brown` the link is
`--ink-3` again (Night 8.30:1, Day 2.34:1 on the brown — as before LC2), no `--sky-*` written.

**Review of the delta:**
- fix-red-team (Sonnet): **RED-TEAM: clean** — no block-commit or should-fix findings. It confirmed against source: the
  field is a direct child of the `position:relative` `.sky` host built by `lxSkyHost` for Home and You, so `offsetLeft` is
  measured against the host; the cache key now carries the offset; `skyVars` runs from `build` and `place`, and the one
  new layout read adds no forced reflow beyond the `getBoundingClientRect` that `visible()` already makes each frame; the
  new rule (0,3,1) beats `.lx .quiet` (0,2,0); the only `.quiet` buttons in a sky are the three from `lxFillLines`;
  `.lx .quiet` has no hover/active colour, only a `:focus-visible` outline. Nits, recorded: the L4d line "the sky reads no
  layout while it moves" was already not literal (`visible()`), so it is not cited as proof here; the gold focus ring on
  the blue sky has no measured contrast figure.
- praxis-reviewer (Sonnet): **CLEAR**. It re-measured the staged bytes, reverse-applied lc2-fix1.patch onto the staged
  blobs cleanly (the patch equals the staged delta), r3-test 1 line changed / 68/68, lc2-test 46 of 46 and ES3, the locks,
  the relock value `4000e9cc…` in every ledger (`13f369cf…` only as history), the burst table and contrast figures against
  the rig log, 14 captures all after 14:40, and the non-goals.

## Residuals
- R-1 (R6) The Garden on the blue skies, as flat marks (`gardenColour(i).c`, unchanged; computed from the staged hand.js):

| i | name | base | colour | Day blue #1D5AA6 | Night blue #0F2F5E | brown night / day |
|---|---|---|---|---|---|---|
| 0 | Liberation | #EDB52F | #EDB52F | 3.67 | 7.08 | 9.87 / 8.67 |
| 1 | Power, named | #D4472F | #D4472F | 1.55 **under 3** | 2.98 **under 3** | 4.16 / 3.66 |
| 2 | Dignity | #9A6CC9 | #9A6CC9 | 1.75 **under 3** | 3.38 | 4.70 / 4.13 |
| 3 | Solidarity | #5F9AE0 | #5F9AE0 | 2.34 **under 3** | 4.52 | 6.30 / 5.54 |
| 4 | Care | #E58AA6 | #E58AA6 | 2.78 **under 3** | 5.36 | 7.47 / 6.57 |
| 5 | Doubt | #7FBFAE | #7FBFAE | 3.25 | 6.27 | 8.74 / 7.68 |
| 6 | Praxis | #E67E3A | #E67E3A | 2.42 **under 3** | 4.66 | 6.50 / 5.71 |
| 7 | Inheritance | #9C4A6E | #a15273 | 1.30 **under 3** | 2.50 **under 3** | 3.48 / 3.06 |
| 8 | Hope | #86B25B | #86B25B | 2.78 **under 3** | 5.37 | 7.48 / 6.58 |
| 9 | Craft | #F3E6C8 | #F3E6C8 | 5.53 | 10.68 | 14.88 / 13.08 |
| 10 | own 1 | #F2A07B | #F2A07B | 3.29 | 6.35 | 8.85 / 7.78 |
| 11 | own 2 | #C3A6E8 | #C3A6E8 | 3.24 | 6.26 | 8.72 / 7.66 |
| 12 | own 3 | #9CC7F0 | #9CC7F0 | 3.86 | 7.45 | 10.38 / 9.13 |
| 13 | own 4 | #B7C24A | #B7C24A | 3.53 | 6.82 | 9.50 / 8.35 |
| 14 | own 5 | #C65BCF | #C65BCF | 1.89 **under 3** | 3.65 | 5.09 / 4.47 |
| 15 | own 6 | #2F7F9E | #2F7F9E | 1.52 **under 3** | 2.93 **under 3** | 4.08 / 3.59 |
| 16 | own 7 | #C9A66B | #C9A66B | 2.99 **under 3** | 5.76 | 8.02 / 7.05 |

  Day blue: 10 of 17 under 3:1 (lowest 7 at 1.30, 15 at 1.52, 1 at 1.55), as the chat measured. Night blue: 3 of 17
  (1, 7, 15) — not in the chat's figures; recorded. Ships as drawn (R6).
- R-2 (R8) The phone's top strip (meta theme-color) stays brown above the blue sky. Owed to Preston's phone check.
- R-3 The chat's pictures were taken on a test page. This build's captures are the real app on the applied tree, signed
  in by the rig's stub with a seeded library — not Preston's account and not a phone. Desktop is captured at 1360 only.
- R-4 Preston's phone check in Day and Night is owed (below).
- R-5 The sky's battery and motion test (contract §6, the motion gate on the installed app) is still owed before the beta.
- R-6 F-1, F-2 and F-3: closed by the go-on (G1, lc2-fix1). Note: with `?sky=brown` the Day quiet links are 2.34:1 on the
  brown, as they were before LC2 (the way back restores the old page exactly).
- R-7 The way back by `LC2_BLUE_SKY = false` also needs tools/lc2-test case g updated (it pins the switch on).

## What Preston runs (after the push; this machine cannot reach the live site)
1. Open praxisreader.com on the phone; accept "new version ready — Reload" if offered. Confirm the version is
   `praxis-v3.344` (the `#diag` route's version line).
2. Home in Night: the sky is deep blue with a warm burst behind the flower and warm ground at its foot; the current is
   gold, coral, pink and pale blue by distance from the flower; lens names readable.
3. Switch to Day: the sky is a brighter blue with the burst centred behind the flower; "Name your own" under the sky reads
   clearly in pale text with a soft dark edge.
4. You: the You sky is blue with the burst behind its flower. Open a lens: its band is the same blue.
5. Yumi's panel, a book page, a category page: unchanged (brown where they were brown).
6. Load praxisreader.com/?sky=brown once: the brown sky is back; a normal reload is blue again.
7. The strip at the very top of the phone is still brown (R-2): say whether that is acceptable.
Pass: 2–6 as described; 3 and 7 are Preston's call.

## Commit gate
Stopped here, 26 Nov 2026, after the go-on; nothing committed. Staged now: the five app files (with lc2-fix1),
tools/lc2-test, tools/checks.ps1, tools/r3-test. To be staged by explicit name at the commit: BETA.md, BOARD.md,
docs/studio/sequence.md, docs/Checklist and Roadmap/BUILD_STATE.md, docs/launch-runway.md,
docs/studio/l4-lens-engine-contract.md, docs/checkpoints/r3.md, docs/checkpoints/lc2.md, the 14 captures in
docs/checkpoints/lc2-shots/, and docs/studio/builder.html (regenerated by tools/studio-build after the go-on's records).
Nothing open for a ruling. Owed after the push: Preston's phone check (above), the battery and motion test (R-5).
