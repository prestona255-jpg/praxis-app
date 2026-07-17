# R-ARC FF-7 VOCAB RIDER — BUILD CHECKPOINT (HALT at commit gate, path B)

**Model: OPUS 4.8 (already-ruled work).** Base `HEAD = 207eecd` (code state `4a8f425`, live v3.219) →
CACHE_VERSION **v3.220**. Files touched: `js/views.js`, `sw.js` (code); `docs/checkpoints/r-arc-ff7-recon.md`
(new), `docs/checkpoints/r-arc-ff7-applied-vocab.md` (corrected), this file (new). `assets/components.css`,
`js/state.js` = **0 bytes** (unchanged). Forks all ruled at recommendation (Preston, 2026-07-17); recon +
rulings in `r-arc-ff7-recon.md`.

**STATUS: built · all gates green · one band item for Preston (§4).** Novel non-data-loss → FIX-PROTOCOL §5
**path B**: does not self-commit; HALTs for the human final pass. Nothing pushed.

---

## 1. SLICE TABLE (parse · bytes · greps)

| Check | Result |
|---|---|
| Parse `cscript //nologo //E:jscript tools/parse-check js/views.js` | **PARSE OK** (harness self-check: broken copy → PARSE ERROR — not trivially passing) |
| Parse `sw.js` | **PARSE OK** |
| `js/views.js` delta | **+1,244 B LF** (+1,265 CRLF) — **code net +393**, comment net +851 (see §4) |
| `sw.js` delta | **+0 B LF** (length-neutral version bump; CRLF 4,897 unchanged; 135 CR preserved; no BOM) |
| `js/state.js`, `assets/components.css` | **0 B** (untouched — the 3 dot classes at `components.css:12704-7` match the unchanged key strings; only numbers moved) |
| numstat | `views.js` 43+/22− · `sw.js` 1+/1− |
| EOL `git ls-files --eol` | `i/lf w/crlf` on both — **unchanged** (no flip) |
| Byte-locks | `lumen-amber.css` md5 `9879ddb8…` · `marks.js` md5 `772886c0…` — **intact** |

**Grep gate — every swap landed (all in `js/views.js`):**
- Retired **rendered lifecycle** "forming": `STILL FORMING`=0, `A forming sub-theory`=0, `a forming sub-theory`=0. Stale-comment refs to `Continue in the workshop`/`born just now`=0.
- New lifecycle strings — each ×1: `A SUB-THEORY · GATHERING`, `· DRAFT`, `· FINISHED`; `A gathering sub-theory in `, `A draft sub-theory in `; `a gathering sub-theory in `, `a draft sub-theory in `, `a finished sub-theory in `; `gathering · just now`, `draft · just now`.
- Doors: `Open the workshop →`=3; `Open the page →`=1 **code** site (`11318`, workshop action row — correctly untouched); `Edit in the workshop`=0.
- Thresholds: `_arcReadMaturityKey` now `.34/.67` (`13775-6`), matching `_stMaturityWord` (`775-6`).

---

## 2. LIVE BEHAVIORAL SWEEP (rig, port 8797, torn down) — the "behavioral proof" §3 pairs with diffstat

Drove the **actual shipped renderers** against injected records in each lifecycle state (owned `d0tester`, not
seed), read rendered DOM `textContent`. The changed logic is three 3-way conditionals + one label + two
literals — every branch exercised. **Console: clean (no errors) across all renders.**

| Surface / control | basin (unnamed draft) | named draft | finished (published) | Verdict |
|---|---|---|---|---|
| **Page kicker** `.st-tb-kicker` | `A SUB-THEORY · GATHERING` | `A SUB-THEORY · DRAFT` | `A SUB-THEORY · FINISHED` | PASS |
| **Workshop subtitle** `.stb-into` | `a gathering sub-theory in A Pedagogy of Desire` | `a draft sub-theory in …` | `a finished sub-theory in …` | PASS |
| **Newborn eyebrow** (fresh) | `gathering · just now` | `draft · just now` | n/a (never published) | PASS |
| **Newborn eyebrow** (restored) | `gathering` | `draft` | n/a | PASS |
| **Newborn snippet** | `A gathering sub-theory in …` | `A draft sub-theory in …` | n/a | PASS |
| **Newborn door** | `Open the workshop →` | `Open the workshop →` | n/a | PASS |

**Doors — label matches route (behavioral):**
- Page Edit door `.st-edit-door`: `Open the workshop →` → `#subtheory/<id>/build` — PASS
- Workshop action-row `.stb-openpage` (unchanged): `Open the page →` → `#subtheory/<id>` (the Page) — PASS
- **Arc-detail stub** `.arcfield-page-open` (**D2 collision fix**): `Open the workshop →` → `#subtheory/<id>/build`, `routesToBuild:true` — the same-words-opposite-direction collision is resolved — PASS

**Maturity dot/label residual — CLOSED (behavioral).** For 14 scores spanning the tiers, word-tier index
(`_stMaturityWord`) == dot-tier index (`_arcReadMaturityKey`), **zero mismatches**. The two OLD disagreement
zones now pair: `0.35 → developing/mature`, `0.68 → established/bright`. (Old: `0.35` gave developing word +
forming dot.)

---

## 3. GATE RESULTS

- **Self-verify:** PASS (parse, band-classified, greps, EOL, dirty-set = exactly the 2 intended files).
- **fix-red-team** (Sonnet-pinned, `6ad6822`): **no BLOCK-severity code defect.** Independently re-derived (a)–(h): ES3 OK; null-deref OK (both renderers hard-early-return on missing record before the new call sites; `_stIsBasin` also self-guards); `nbIsBasin` hoist OK (no shadow); thresholds OK (only caller feeds clamped `[0,1]`); copy-contract OK (finished branch reachable + correct); exhaustive forming-sweep reproduced (0 unaccounted rendered lifecycle "forming"); door hrefs verified; sw.js exact bump. Findings: **1 CONCERN = the band (§4)**; nits = stale line cites (fixed §5) + FINAL-PASS SUMMARY location (below).
- **praxis-reviewer** (Sonnet-pinned): **HOLD on the band only** — all other 11 gates PASS with independent measurement. See §4.

---

## 4. THE BAND — the one item for Preston (honest reconciliation, NOT silently absorbed)

**What I declared** (recon §3): `js/views.js` core `+150…+450`; forks add `≈ +250…+500` ⇒ fully-extended
ceiling **+950**. **What shipped:** **+1,244 LF**, ~31–33% over that ceiling. Both gate agents flagged it
(reviewer HOLD; red-team CONCERN, "surface to Preston").

**Why it is over, precisely:** classify the diff → **code net +393** (inside the `+150…+450` core band, *with*
the forks folded in — the forks added mostly branch-selection, little code) · **comment net +851**. The entire
overage is **comment**. Root cause: my recon under-priced the repo's provenance-comment idiom — the documented
**FIX-PROTOCOL §3 failure mode: "agent estimates run ~2× low on comment/copy conventions."** I already trimmed
once (comment +1,566 → +851); the remainder is load-bearing (the finished-branch rationale, the
COPY-IS-A-CONTRACT note, the threshold-pairing why).

**The governing rule.** FIX-PROTOCOL §3 (wins for build process): **"Byte deltas are FLOORS … verify by
diffstat + behavioral proof, not by matching the number."** The code floor is respected; diffstat + the §2
behavioral sweep confirm every changed line maps to a ruled intent with **zero logic drift / zero scope
creep**. The R-ARC standing band-discipline likewise: *comment* overage clears by line classification (S4/S5
precedent); *logic* overage halts — the logic delta is in band. By that rule the overage clears.

**Why it still comes to you anyway:** this is a **novel** fix → **path B halts for your final pass
regardless** — I never self-commit it. And I will **not** trim load-bearing provenance further just to duck a
number (§3 forbids matching the number). **This is a band re-baseline surfaced with rationale, not silently
widened** ("NEVER *silently* widen"). **Recommend: accept** the comment-driven overage (code floor +393 is the
real signal); the number was my estimate's error, not the diff's.

**RULED — ACCEPT (Preston, 2026-07-17).** +393 code floor in-band; +851 comment clears by classification per
FIX-PROTOCOL §3 + the 3B-POLISH precedent. **PROCESS RIDER (for all future slices):** a declared band henceforth
carries **TWO figures — a CODE band (hard ceiling) + a COMMENT allowance (soft; clears by line classification).**
A ceiling then means what it says, and this judgment call stops recurring. *(Canonical codification landed in
**FIX-PROTOCOL §3** as its own config commit, per Preston's flag — not bundled into this rider.)*

---

## 5. DOCS RODE WITH THE DIFF
- `r-arc-ff7-applied-vocab.md`: §C marked **SUPERSEDED BY F4 / NO-OP** (the Yumi tag's targets were removed by `3fefc93`; nothing re-added — the covenant stands); D1's **word half** noted as already shipped by `bb70889`; new **"§E WAS INCOMPLETE"** section records FORK 2(A) both extra sites, the named-newborn ruling, and FORMING-REACH (four ramps, frozen-file member routed to 3B-MOTE).
- `r-arc-ff7-recon.md`: new — the Stage-0 recon + the four fork rulings.
- **Nit fix (red-team Finding 2):** stale `_stMaturityWord` Page call-site cite `10947` → **`10958`** (shifted by the kicker's new lines) corrected in both docs.
- No committed doc contradicts the shipped code; no surviving code comment contradicts the new strings (the six `Continue in the workshop`/`born just now` provenance comments were updated; the falsified COPY-IS-A-CONTRACT note at `1778` rewritten to the "· just now" flourish).

---

## FINAL-PASS SUMMARY (§5.5)
```
FINAL-PASS — FF-7 vocab rider @ 207eecd → CACHE_VERSION praxis-v3.220
FILES: js/views.js, sw.js  (+ docs/checkpoints/r-arc-ff7*.md ledger)
PROOF 1 lifecycle branches:  Page kicker basin/named/finished = GATHERING/DRAFT/FINISHED   PASS
PROOF 2 workshop subtitle:   basin/named/finished = gathering/draft/finished (finished reachable+correct)  PASS
PROOF 3 newborn card:        basin=gathering[· just now], named=draft[· just now]; door=Open the workshop  PASS
PROOF 4 doors:               3× "Open the workshop →"→/build (incl. D2 stub); "Open the page →"→Page (kept)  PASS
PROOF 5 dot/label residual:  14 scores, word-tier==dot-tier, 0 mismatch (.35, .68 zones closed)  PASS
BYTES: js/views.js +1,244 LF (code floor +393 in-band; +851 comment — see §4) · sw.js +0 LF (v3.219→v3.220)
PARSE: harness self-check broken→PARSE ERROR / good→exit0 · views.js PARSE OK · sw.js PARSE OK
FOUNDATIONS md5: lumen-amber 9879ddb8… ok · marks 772886c0… ok
git show --stat preview: js/views.js, sw.js (+ 3 docs)
RED-TEAM (§9): no BLOCK code defect; 1 CONCERN = band (§4). praxis-reviewer: HOLD on band only.
RESIDUALS: R1 FORMING-REACH (4 non-lifecycle ramps incl. frozen arc-constellation.js:1433 → rides 3B-MOTE);
           R2 §C Yumi tag NO-OP (deferred to Wave C raised-hand seat); band = Preston's call (§4).
```

**HALT — Preston's word gates the commit + push.** On "commit and push": stage `js/views.js` + `sw.js` +
the 3 docs, `git show --stat` self-check, commit `-F` (em-dash subject), verify `%s`, push, prove
`HEAD==origin==ls-remote` + two cache-busted live `sw.js` reads at v3.220.
