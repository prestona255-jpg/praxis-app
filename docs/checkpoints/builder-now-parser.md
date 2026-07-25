# BUILDER NOW-PARSER FIX — STAGE 0 RECON (read-only) → HARD HALT

Lane: builder-nowparse-lane (worktree C:/Users/pallen/Desktop/praxis-builder-nowparse)
Base HEAD: f8ac91e (v3.256). Model: Opus 4.8, default effort. Ultracode OFF (brief
PREAMBLE overrides the harness "ultracode" keyword flag — no Workflow orchestration).
Scope: ONE tracked file — the Builder generator (tools/studio-build) — plus this checkpoint.
Ground-truth at session start: HEAD f8ac91e · hook ARMED · FIX-PROTOCOL v1.2 · 7 agents present.

STATUS: **HARD HALT after recon. 4 forks/blockers for Preston. No code written.**

═══════════════════════════════════════════════════
0.1 — GENERATOR LOCATED
═══════════════════════════════════════════════════
Real path: `tools/studio-build` (extensionless #!/bin/sh, as expected).
- Canonical committed blob: **117,675 B, LF** (`git show HEAD:tools/studio-build | wc -c`).
- Line count: **1,672**.
- (Worktree working copy = 119,347 B / CRLF — a checkout artifact; see §EOL below. The
  byte BASELINE for all deltas is the **LF blob, 117,675 B**, not the worktree size.)

═══════════════════════════════════════════════════
0.2 — THE `## Now` PARSE + BANNER LOGIC (verbatim)
═══════════════════════════════════════════════════
Parser (SHARED `parse_items`, tools/studio-build:90–106):
    90  # parse checkbox items of a section -> "title <TAB> touches <TAB> body" per item
    91  parse_items() {
    92  awk -v sec="$1" '
    93  function emit(){ if(have){ ... printf "%s\037%s\037%s\n", title, touches, body; ... } }
    94  BEGIN{insec=0;have=0}
    95  /^## /{ emit(); insec=($0 ~ ("^## " sec "([ ]|$)"))?1:0; next }
    96  insec==0{ next }
    97  /^- \[[ xX]\]/{ emit(); line=$0; sub(/^- \[[ xX]\][ ]+/,"",line); title=line;
    98    if(match(line,/\*\*[^*]+\*\*/)){ title=substr(line,RSTART+2,RLENGTH-4) } body=line; have=1; next }
    99  /^[ ]+touches:/{ if(have){ t=$0; sub(/^[ ]+touches:[ ]*\[?/,"",t); sub(/\].*/,"",t); touches=t } next }
   100  /^[ ]+[^ ]/{ if(have){ c=$0; sub(/^[ ]+/,"",c);
   101    if(touches=="" && match(c,/touches:[ ]*\[[^]]*\]/)){ ... touches=tt }
   102    body=body " " c } next }
   103  /^[[:space:]]*$/{ emit(); next }
   104  END{ emit() }
   106  }
Invocations (all one function, section as $1): tools/studio-build:201–202
   201  parse_items Now > "$TMP/now"; parse_items Next > "$TMP/next"; parse_items Then > "$TMP/then"
   202  parse_items Shipped > "$TMP/shipped"; parse_items Discovered > "$TMP/disc"

Banner "NOW — AT THE FRONT OF THE BUILD" + its NEXT line (`render_now_banner`, :623–642):
   624    lead=$(head -1 "$TMP/now"  | awk -F"$US" '{print $1}')
   625    nextt=$(sed -n '2p' "$TMP/now" | awk -F"$US" '{print $1}')
   626    [ -n "$nextt" ] || nextt=$(head -1 "$TMP/next" | awk -F"$US" '{print $1}')
   630    if [ -z "$lead" ]; then
   631      printf '<div class="nb-eyebrow">NOW</div><div class="nb-lead">sequence.md Now not parsed</div>'
   633    else printf '<div class="nb-eyebrow">NOW &mdash; at the front of the build</div>'
   634      printf '<div class="nb-lead">%s</div>' "$(fmt "$lead")"
   635      [ -n "$nextt" ] && printf '<div class="nb-next"><span class="nb-k">next</span>%s</div>' "$(fmt "$nextt")"
The banner headline = FIRST line of $TMP/now; NEXT = SECOND line (or first of $TMP/next
if only one Now item). It is a positional head-1/2p read — NOT marker-aware.

═══════════════════════════════════════════════════
0.3 — MARKER HANDLING TODAY
═══════════════════════════════════════════════════
The item-start regex is `/^- \[[ xX]\]/` (:97). The bracket class `[ xX]` = {space, x, X}.
- `- [ ] ` → MATCHED (item start). Title/body captured. **No checkbox STATE recorded** —
  `[ ]` and `[x]` are stored identically; downstream cannot tell them apart.
- `- [x] ` → MATCHED, identically to `[ ]`. (This is the defect for Now: finished rounds
  render as NOW cards.)
- `- [X] ` → MATCHED (upper-case X allowed).
- `- [~] ` → **NOT MATCHED. No explicit branch anywhere.** Full-file grep for
  `[~]`/tilde/in-progress = **zero hits.** A `[~]` line falls through every rule (it is not
  `## `, not `^- \[[ xX]\]`, not `^[ ]+…`, not blank) → it is SILENTLY DROPPED (the item and
  its continuation lines never set have=1). This is why R-CAPTURE is absent from the render.

═══════════════════════════════════════════════════
0.4 — SCOPE QUESTION → **SHARED. HALT.** (FORK A)
═══════════════════════════════════════════════════
The checkbox parser is **SHARED**, not per-section: ONE `parse_items()` (awk, :91–106) called
with the section name as `$1` for **Now / Next / Then / Shipped / Discovered** (:201–202),
each writing a separate `$TMP/<section>` file. Editing the item-start regex or adding
state-filtering INSIDE `parse_items` would hit **Shipped's 27 `[x]` too** — the collateral
risk R1/2.3 warn about.

Live counts reproduced INDEPENDENTLY from the raw markers (grep `^- \[[ xX~]\]` per section):
- Shipped (seq.md 493–770): **27 × [x]** ✓
- Now     (771–840):        **2 × [ ] , 3 × [x] , 1 × [~]** ✓  (776 [~] · 783 [ ] · 785 [ ] · 790 [x] · 794 [x] · 834 [x])
- Next    (841–863):        **10 × [ ]** ✓
- Then    (864–913):        **6 × [ ]** ✓

Per the brief's 0.4: the code IS shared → I say so and HALT. The section identity is ALREADY
threaded (the `sec` arg + separate temp files), so a section-scoped fix needs NO improvised
mechanism — see the recommended approach in the FORK block below. Preston rules the approach.

═══════════════════════════════════════════════════
0.5 — REACH MAP + THE TWO TOUCHES FORMATS (FORK C)
═══════════════════════════════════════════════════
Reach map DOES derive its slugs from `touches:` inside `## Now` items (and Next):
   196  collect_touches() { awk -F"$US" '{print $2}' "$TMP/$1" | tr ',' '\n' | ... sort -u; }
   242  NOW_TOUCH=$(collect_touches now)   243  NEXT_TOUCH=$(collect_touches next)
   244  # reach-map surface set = union of Now/Next touches, capped at 8 by highest gapcount
Ranking: `MAP=... qgap ... | sort -rn | head -8` (:249) — top-8 surfaces by gapcount.

WHICH FORMAT THE PARSER MATCHES — this is the crux:
- The parser captures touches ONLY from the **`touches:` keyword** form (:99 and the inline
  fallback :101, both keyed on the literal `touches:`).
- The **trailing backticked `` `[...]` ``** form is **NOT matched** — no `touches:` keyword,
  so `match()` fails and touches stays "".
Under the CURRENT `## Now`, the formats split:
  - R-CAPTURE `[~]` (782): backticked `` `[views, notebook, import-capture]` `` → NOT captured.
  - A Yumi round `[ ]` (788): backticked `` `[yumi-brain, views]` `` → NOT captured.
  - FINISH-CHOREO `[ ]` (783): no touches.
  - R-POLISH `[x]` (832): `touches: [global-shell, home, book-detail, arc-detail, notebook, arcs]`
    → CAPTURED. **This is the ONLY Now item whose touches the parser reads.**

CURRENT (BEFORE) reach map — baselined from the COMMITTED builder.html (the v3.256 push-point
render; read-only; see 0.7): **8 orbs**, slug set (human name · gapcount):
  Shelf·43 (books) · Notebook·18 · Arc interior·14 (arc-detail) · Home·11 · Account·6 ·
  Arcs page·5 (arcs) · Book·4 (book-detail) · Yumi panel·3 (yumi-panel).
Independently re-derived: NOW_TOUCH = R-POLISH's 6 {global-shell,home,book-detail,arc-detail,
notebook,arcs}; NEXT_TOUCH = {books,import-capture,yumi-panel,account,profile,arc-detail,various};
union ranked by gapcount, top-8 = exactly the 8 orbs above. ✓ static trace == committed render.

⚠ **This does NOT match the brief's 2.4 BEFORE prediction** {yumi-brain, views, global-shell,
home, book-detail, arc-detail, notebook, arcs}. The COUNT (8) matches; the SLUG SET does not —
global-shell/notebook/home/book-detail/arc-detail/arcs are R-POLISH's; the rest are Next's; and
yumi-brain/views NEVER appear (their only sources are backticked → uncaptured). Per 2.4's own
instruction I report the discrepancy and do NOT retrofit the expectation. See FORK C.

═══════════════════════════════════════════════════
0.6 — OUTPUT PATH → **NO SCRATCH SUPPORT. HALT CONDITION HIT.** (FORK B)
═══════════════════════════════════════════════════
The generator does **NOT** accept an output-path argument and does **NOT** honor an env override:
   24   OUT="$STUDIO/builder.html"        # plain assignment, NOT ${OUT:-…}
  1666  } > "$OUT"                         # the whole document is redirected here at the tail
Full-file sweep: no `getopts`, no `$@`/`$#`, no top-level positional arg, no `${OUT:-…}` default.
Running `OUT=/scratch/x sh tools/studio-build` would be overwritten by line 24 → still writes
docs/studio/builder.html. **There is no way to render to a scratch dir outside the repo.**

This is a listed Stage-0 HALT CONDITION ("no scratch-output support → stop and report").
Stage 2's requirement — "All renders DETACHED, to the scratch dir outside the repo … builder.html
in the working tree stays byte-identical to HEAD" — is **NOT satisfiable as written** until this
is resolved. I did NOT improvise (no tree-copy, no working-tree redirect). See FORK B.

═══════════════════════════════════════════════════
0.7 — BASELINE (from the committed render; a fresh scratch render is blocked by 0.6)
═══════════════════════════════════════════════════
A DETACHED scratch render is impossible (0.6). Substitute = the **committed docs/studio/builder.html**,
read-only. It was regenerated at the v3.256 push-point against the CURRENT sequence.md (the last
three Re-plan entries all state "`## Now` unchanged (R-CAPTURE)"), so it IS the current production
render. Clearly labeled as the committed render, NOT a fresh scratch render.
- NOW-column cards (`pm-c-now` / now-card / thread nodes), current order = the 5 marker-`[ xX]`
  items, `[~]` R-CAPTURE ABSENT:
    1. FINISH-CHOREO S3 — motion dignity + measure     ([ ])
    2. A Yumi round (unscoped) — owns the arc-context gap ([ ])
    3. THE ARC STANDARD — deep round — CLOSED 2026-07-23 ([x])
    4. R-POLISH — the pre-launch polish round — CLOSED  ([x])
    5. R-ARC — the knowledge-arc theorizing system      ([x])
  → **5 NOW cards, R-CAPTURE absent** ✓ (matches the brief's stated current-main expectation).
- Banner NOW title  = "FINISH-CHOREO S3 — motion dignity + measure"  (head-1 of $TMP/now).
- Banner NEXT title = "A Yumi round (unscoped) — owns the arc-context gap" (2p of $TMP/now).
- Shipped tile value = **27 shipped** ✓ (`27 shipped so far`, `pm-shipped">27 shipped`).
- Reach map = 8 orbs (see 0.5).

═══════════════════════════════════════════════════
0.8 — BYTE BASELINE
═══════════════════════════════════════════════════
Generator canonical blob (what commits): **117,675 B, LF** (`git show HEAD:tools/studio-build|wc -c`).
Foundations md5 (byte-locked; NOT in this lane's scope — recorded per FIX-PROTOCOL halt rule):
  assets/lumen-amber.css = 0b5ca22e7416914cea4e150235949471
  assets/marks.js        = 3e4e464d318c0d11f7d3a90dd9b20f94
  (These differ from FIX-PROTOCOL §2's listed md5s — those pre-date the R-POLISH B3 re-baseline;
   irrelevant here, this lane touches neither file. Recorded only to honor the "re-md5 at halt" rule.)

═══════════════════════════════════════════════════
§EOL — WORKTREE CHECKED OUT THE SCRIPT AS CRLF (managed in Stage 1/3, not a fork)
═══════════════════════════════════════════════════
`git ls-files --eol tools/studio-build` → `i/lf  w/crlf  attr/`. Index/blob = LF (117,675 B);
this worktree's working copy = CRLF (119,347 B, 1,672 CR). Main clone = LF (0 CR). No .gitattributes;
EOL is core.autocrlf-governed (unset). **Hazard:** a naive stage of the CRLF worktree copy could flip
all 1,672 lines LF→CRLF (the whole-file EOL flip lessons.md/CLAUDE.md warn about). **Management (Stage 1):**
normalize my working copy to LF before editing (or verify post-stage that the staged blob has 0 CR via
`tr -cd '\r'` and `git diff --cached` shows only my real hunks). Byte reconciliation in Stage 3 uses the
**LF blob (117,675 B)** as base — never the worktree's 119,347.

═══════════════════════════════════════════════════
CONSUMERS OF $TMP/now (bears on 2.6 NO-COLLATERAL — FORK D)
═══════════════════════════════════════════════════
`$TMP/now` feeds **SIX** render regions, not three:
  1. :234  → $TMP/conn → **surface-page "connected" strips** (:1499–1502)   [OUTSIDE 2.6 scope]
  2. :242  → NOW_TOUCH → **reach map**                                       [in 2.6 scope]
  3. :624  → **banner** lead + next                                          [in 2.6 scope]
  4. :648  → **program-map "now" chips** (pm-c-now, render_program_map)      [OUTSIDE 2.6 scope]
  5. :1294 → **Overview "NOW card"** (now-card, id="now")                    [= "NOW column"]
  6. :1349 → **Plan-page NOW thread nodes** (now-lead/now-mid)               [= "NOW column"]
The correct fix (drop the 3 `[x]` rounds, add the `[~]`) changes ALL SIX — a finished round should
vanish from the connected strips (1) and progmap chips (4) too. But 2.6 names only "NOW column,
banner, reach map," so it would FALSE-FLAG regions 1 and 4. See FORK D.

═══════════════════════════════════════════════════
FORKS FOR PRESTON (present, don't pick — FIX-PROTOCOL §4)
═══════════════════════════════════════════════════
FORK A (0.4) — SHARED PARSER. Confirm the section-scoped approach: pass a mode flag on the `Now`
  call so ONLY $TMP/now is marker-filtered (drop [x], keep [~]+[ ]), leaving the `Shipped` call
  (and Next/Then/Discovered) byte-identical. Recommended — no new scoping mechanism, section
  identity already threaded. This makes R1/R2/R4 fall out of one filtered $TMP/now.

FORK B (0.6) — NO SCRATCH OUTPUT (blocks Stage 2 as written). Options:
  B1 (recommended) — the fix ALSO makes OUT overridable: `OUT="${OUT:-$STUDIO/builder.html}"`
     (one line, production path unchanged when OUT unset) so scratch renders + the byte-identical
     working-tree proof become possible.
  B2 — authorize an alternative verification path (name it).

FORK C (0.5 / 2.4) — REACH-MAP INTENT vs CONSTRAINT. Under a marker-ONLY fix that honors R4/0.5
  ("don't alter reach-map parsing" / "don't change this parser"): excluding R-POLISH `[x]` EMPTIES
  NOW_TOUCH (its `touches:` line was the only captured Now touches; R-CAPTURE's + A-Yumi's are
  backticked → still uncaptured). So the AFTER reach map becomes **Next-driven** (~books, arc-detail,
  account, yumi-panel, import-capture, profile, various), **NOT** the brief's predicted 4 orbs
  {views, notebook, import-capture, yumi-brain}. That prediction is only reachable if the parser
  ALSO learns the backticked-touches format — a scope expansion beyond R4/0.5. Note the tension with
  the non-goal "sequence.md content is correct; the parser is wrong" (which forbids fixing it by
  editing sequence.md's items to use `touches:`). Preston rules:
  C1 — accept marker-only (R4 literal; reach map Next-driven; 2.4's predicted values are stale), OR
  C2 — expand scope: also parse the backticked `` `[...]` `` touches form so R-CAPTURE's slugs appear.

FORK D (2.6) — NO-COLLATERAL scope too narrow. $TMP/now feeds 6 regions (above). The fix correctly
  changes the surface "connected" strips + progmap now-chips too. Either widen 2.6's allowed-change
  set to "all $TMP/now-derived regions," or acknowledge those two extra regions change by design.

NEXT: HALT. Await Preston's rulings on A–D (and the B mechanism) before writing any code.

═══════════════════════════════════════════════════
STAGE 1 — RULINGS FOLDED IN + A-MECHANISM MANDATORY PROOF → SECOND HALT
═══════════════════════════════════════════════════
Preston's rulings received: A1 (record state in shared parser, filter at Now consumer,
purely-additive, MANDATORY PROOF) · B1-hardened (STUDIO_OUT, not OUT) · C void→C2 bounded
(parse the backticked touches form; census first) · D (enumerate 6 regions, verify R-CAPTURE
arrival) · CRLF tripwire (≈1,672-line diffstat = EOL flip → revert).

--- C2 CENSUS (Preston's "before editing" gate) = CLEAN ---
The trailing backticked touches form `` `[slug, slug]` `` occurs EXACTLY twice, BOTH under
`## Now` (sequence.md:782 R-CAPTURE, :788 A Yumi round). Zero occurrences outside `## Now`.
No other backticked bracket-lists exist in the file (no `[x]`/`[source:` backtick confusables).
→ C2b bound satisfied; C2 is GO once the A-mechanism is ruled.

--- A1a MANDATORY PROOF: "purely additive" DOES NOT HOLD (the HALT trigger you wrote) ---
EMPIRICAL (Git Bash sh): a 3-var `IFS=$US read -r a b c` on a 4-field line `TT␟CC␟BB␟[x]`
yields `c=[BB␟[x]]` — the last var ABSORBS the 4th field WITH the literal ␟. (4-var read is clean.)

FULL CONSUMER CENSUS of $TMP/{now,shipped,next,then,disc} — who reads positionally AND uses `body`:
  awk -F"$US" (index $1/$2 — SAFE with an appended $4):
    :196 collect_touches($2) · :234 conn($1,$2) · :624/:625 banner($1) · :648/:651/:654 progmap($1)
  positional `read -r title touches body` (last var = body absorbs $4):
    :1294 now-card    Now         uses body      → (Now — I modify)
    :1349 now-nodes   Now         uses body      → (Now — I modify)
    :1321 ship-preview Shipped    uses TITLE only → SAFE (body discarded) — byte-identical
    :1343 ship-list    Shipped    uses TITLE only → SAFE — byte-identical
    :1358 next/then   Next/Then   uses body (render_node $body) → **BREAKS: body→"…␟[ ]"**
    :1374 discovered  Discovered  uses body (fmt "$body")       → **BREAKS: body→"…␟[ ]"**
VERDICT: appending $4 to the SHARED record corrupts Next/Then (:1358) + Discovered (:1374)
rendered output. Two consumers "read by field position" and "would see the extra field" →
your mandatory-proof HALT fires. I did NOT adapt them. Shipped is safe (title-only).

--- THREE CLEAN RESOLUTIONS (Preston rules the mechanism) ---
OPT-3 (RECOMMENDED) — append $4 in parse_items (UNIFORM, no per-caller branching), then at the
  five call sites (:201–202) FILTER([x] out) + ORDER([~] first, R2) for Now and STRIP $4 for
  ALL sections, so every $TMP/* file stays 3-field and EVERY consumer reads byte-identical to
  today. No render consumer touched anywhere; the state field is used only in the Now data-prep
  pipe and never reaches a consumer → the HALT condition (a consumer "seeing" $4) never occurs.
  Honors A1a (parser records state, uniform) + A1b (filter at the Now call-site, not in parser)
  + "every existing consumer keeps reading exactly what it read before" (literally true).
OPT-1 — append $4 uniformly; add an inert throwaway `state` var to the 2 breaking readers
  (:1358, :1374) so body stays clean. Output-neutral (provable by byte-diff) but touches 2
  non-Now read-lines — needs your OK vs "don't adapt consumers."
OPT-2 — append $4 uniformly; project non-Now files back to 3 fields at the call sites; keep $4
  on $TMP/now and change the Now render consumers to read it. Non-Now untouched; Now consumers
  changed.

HALT #2: which mechanism? (Recommend OPT-3.) Everything else — B1/STUDIO_OUT, C2, D's 6-region
enumeration + R-CAPTURE arrival, the CRLF tripwire — is ruled and ready to build the moment the
A-mechanism is chosen.

═══════════════════════════════════════════════════
STAGE 1 — BUILD (OPT-3 ratified + RIDERS 1–4 + B1 + C2)
═══════════════════════════════════════════════════
Rulings enacted: OPT-3 (append $4=state uniformly; FILTER then STRIP at the call sites; every $TMP/*
stays 3-field; zero render consumers touched) · A1a broad-match+dispatch · RIDER 1 (filter-before-strip,
strip the LAST US-field) · RIDER 2 (no reorder; state-aware banner; NEXT = first non-headline in doc
order) · RIDER 3 ([X]→[x] normalise) · RIDER 4 (broad /^- \[.\]/ then dispatch → warn+skip unknown) ·
B1 (STUDIO_OUT override, NOT OUT) · C2 (backtick touches parsed).

CONSUMER CENSUS (Preston's reusable artifact) — how each $TMP reader parses, and whether it uses `body`:
  INDEX-BASED (awk -F"$US" $1/$2 — inert to an appended $4):
    :196 collect_touches($2) · :234 conn($1,$2) · :624/:625 banner($1, now REPLACED) · :648/:651/:654 progmap($1)
  POSITIONAL (`read -r title touches body` — last var absorbs an appended field):
    :1294 now-card  (uses body)   :1321/:1343 shipped (use TITLE only → inert)   :1349 now-nodes (uses body)
    :1358 next/then (uses body)   :1374 discovered (uses body)
  → OPT-3 strips $4 before ALL consumers, so none see it (empirically: a 3-var read on a 4-field line
    yields body="…␟[x]"; strip removes the last field → body clean). Non-Now consumers untouched.

THE 4 EDITS (git diff = 40 ins / 11 del; +2,738 B LF; CR=0):
  E1 :24   OUT="${STUDIO_OUT:-$STUDIO/builder.html}"  (B1; prod path when unset)
  E2 :91-  parse_items: emit 4 fields (…,state); broad /^- \[.\]/ match → dispatch on substr($0,4,1);
           unknown marker → warn to $WARN + skip (RIDER 4); [X]→[x] (RIDER 3); backtick-touches branch (C2)
  E3 :206- $WARN hoisted before parse_items; sf()=awk '{sub(/\037[^\037]*$/,"")}'; Now: parse→FILTER($4!="[x]")→
           STRIP; Next/Then/Shipped/Discovered: parse→STRIP; NOW_LEAD/NOW_HEADI/NOW_NEXT from filtered now_f
  E4 :650- banner uses NOW_LEAD/NOW_NEXT (state-aware) instead of head-1/2p
  (also removed the now-duplicate $WARN init from the 1c-sources line.)
  sh -n + bash -n: OK.

═══════════════════════════════════════════════════
STAGE 2 — PROOF (all PASS)
═══════════════════════════════════════════════════
2.1 SELF-TESTS (L3, real parse_items+sf extracted from the file; each check shown able-to-FAIL then PASS):
  FX-A one-of-each: R1 excludes [x]; RIDER3 excludes [X]; column stays doc-order (Alpha 1st); R2 headline=[~]
    (Delta, though 2nd in column); NEXT=Alpha; CAN-FAIL: naive head-1 → Alpha (wrong). PASS
  FX-B [~] LAST (RIDER 2): stays last in column, headlines banner, NEXT=first [ ]. PASS
  FX-C [?] (RIDER 4): skipped + 1 warning "sequence.md:3 …[?]"; CAN-FAIL: broad match sees [?] (narrow would not). PASS
  FX-D backtick touches (C2): captured "views, notebook, import-capture"; keyword form still works. PASS
  FX-E all-[x] Now: 0 records → NOW_LEAD empty → empty-state branch (no stale card). PASS
A1 GATE (direct): MY parse|sf == pristine parse, BYTE-IDENTICAL — Shipped 27 / Next 10 / Then 6 / Discovered 7.
  now = 3 recs, 2 US each; filter ran against POPULATED state (now_s $4 = [~][ ][ ][x][x][x]). PASS
REAL RENDERS (detached, STUDIO_OUT=scratch): before(pristine+STUDIO_OUT)=592,247 B map 8; after=587,293 B map 7;
  after2=587,293 B map 7; all warnings 0, ship 27, ends </html> (not truncated).
2.2 NOW: banner NOW=R-CAPTURE, NEXT=FINISH-CHOREO S3; NOW column = 3 (R-CAPTURE lead + FINISH + A Yumi);
  progmap chips = same 3; ARC STANDARD/R-POLISH/R-ARC = 0 in every NOW region. Card delta 5→3. PASS
2.3 SHIPPED: tile 27 (both spots); shipped list unchanged in the collateral diff. PASS
2.4 REACH MAP 8→7 — C2c ATTRIBUTION (every AFTER slug a file:line origin; every dropped slug named):
  AFTER orbs: Shelf·43(books, NEXT SCAN :845) · Notebook·18(R-CAPTURE backtick :782) · Arc interior·14(NEXT
    ARC-FIELD :860) · Account·6(NEXT S-B :848) · Yumi panel·3(S-B :848) · Import&capture·3(R-CAPTURE :782 +
    S-B :848, NEW) · Profile·0(S-B :848, NEW).
  DROPPED 8→7: Home·11, Arcs page·5, Book·4 — all R-POLISH-only touches (:832), excluded → no other plan touch.
  ADDED: Import&capture, Profile — freed slots (R-POLISH's high-gap surfaces left top-8).
  CAPTURED-BUT-NOT-RENDERED (pre-existing non-surface drop; qgap empty → awk $2 empty → no orb): views
    (R-CAPTURE :782 + A-Yumi :788) · yumi-brain (A-Yumi :788) · various (Overnight :862) · global-shell
    (was R-POLISH :832, now excluded). Named, not silently vanished. No number to hit — evidence-produced.
2.5 DETERMINISM: after == after2 byte-identical (stamp-normalized, 584,489 B each); only the timestamp differs. PASS
2.6 NO-COLLATERAL (word-diff, whole file): every changed segment ∈ the 6 $TMP/now regions:
  R1 connected strips (s-home/s-book-detail strip vanishes; s-arcs/s-arc-detail lose R-POLISH; s-notebook/
    s-import-capture GAIN R-CAPTURE) · R2 reach map · R3 banner · R4 progmap chips · R5 overview now-card ·
    R6 plan thread nodes. NOTHING outside (heatgrid, Recently, shipped evidence, facts, ledgers unchanged). PASS
  D RIDER — R-CAPTURE first-time ARRIVAL confirmed on notebook + import-capture connected strips (renders correctly).
2.7 builder.html UNCHANGED: git diff --numstat empty (exit 0); size 594,905 = Stage-0; never written (all STUDIO_OUT
  =scratch). (cmp vs HEAD shows only CRLF-vs-LF, w/crlf — cosmetic.) PASS

═══════════════════════════════════════════════════
STAGE 3 — COMMIT LOCAL (no push)
═══════════════════════════════════════════════════
Byte delta: 117,675 → 120,413 LF = +2,738 B (added 40 [code 24, comment 16] / removed 11 [code 9, comment 2]);
  no Stage-1 pre-stated figure (said "minimal surgical diff") — reconciled: dominated by 14 net comment lines +
  dense awk/shell one-liners; no anomaly. CR count 0. CRLF tripwire: diff --cached line count ≪ 1,672 (no EOL flip).
Staged path-explicitly: tools/studio-build + docs/checkpoints/builder-now-parser.md. sw.js untouched (no app bytes,
  no cache bump — tools-only). builder.html NOT staged/written. Regen NOT run — it belongs to R-CAPTURE's close-out
  (single-regen-owner, L9). (commit details appended at commit time.)
