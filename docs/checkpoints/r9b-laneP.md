# R9b · Lane P — BUILD checkpoint

Mockup (felt-passed in full 2026-07-13): `docs/studio/mockups/profile-laneP.html`. Recon:
`docs/checkpoints/r9b-laneP-recon.md`. Rails: `views.js` + `assets/components.css`; `js/intros.js` for the
intro hook; `sw.js` bump LAST (v3.199→**v3.200**, verify live+1 at ship). Commit-no-push; both gates
(fix-red-team + praxis-reviewer) before the commit gate. Uses `--star-gold`/`--gold-deep`/`--field-*` — NO
`--lum-*` in new CSS (rails).

## DNA re-slot — implementation determination (low-risk, documented)
`buildReaderModelSection` (views.js:15330, ~500 L) is ONE tightly-integrated interactive node (consent +
will/wont grid + web/voice/talk prefs + editable threads), with a dead `renderAccountPage` caller. Rather than
a risky split of a shared, data-adjacent function, this build keeps it **BYTE-UNCHANGED** and:
- mounts it **Settings-adjacent** (its `#pf-yumi-mount` moves from after-journey to before-Settings) — it
  carries the CONSENT opt-in, so "consent moves Settings-adjacent" is honored;
- adds a NEW display-only `_pfThreadsSection(uid)` after Now (with returns/journey) surfacing
  `getReaderModel().threads` read-only — "threads stay after Now."
Overlap (threads reflected up top + editable in the instrument below) is accepted as coherent (reflect vs
manage). Felt pass confirms.

## Slices (each: parse-check + grep + measured byte delta; PASS/FAIL before next)

- **S1 — components.css (CSS-only).** (a) faint-default `.pf-vline` (opacity 0→.34, .on .66→.78, stroke
  1.3→1.5). (b) ARCS grid: add `"arcs numbers"` row to both grid-template-areas + `.sec-arcs{grid-area:arcs}`.
  (c) NEW rules: `.pf-arc*`, `.pf-lineage`/`.pf-lin-*`, `.pf-thread-row`, `.pf-now-link`, `.pf-pub.untitled .pt`,
  `.pf-pubgrid[data-n="1|2"]`.
- **S2 — views.js builders.** (a) `_pfExcerpt` rewrite (skip quote/heading lines → first clean prose sentence →
  word-boundary clamp ~120). (b) `_profilePublished` title→`''` when headerless + `_pfPublishedSection` quality
  pack (omit-when-Uncategorized, untitled→excerpt-led, no-excerpt graceful, `data-n`). (c) `_pfNowSection`
  richness (+ latest-published `data-sub` cross-link). (d) NEW `_pfArcsSection(uid,vis)` (owned-arc-anchored,
  question-led, fenced, newest-first, sparse-honest). (e) NEW `_pfLineageSection(uid,vis)` (declared-value whys,
  deduped, grouped by value ordered by load, public, sparse owner-invite / visitor-omit). (f) NEW
  `_pfThreadsSection(uid)`. (g) `_pfBuildPage` AM51 re-order + `#pf-yumi-mount` move Settings-adjacent. (h)
  `_pfWire` preview handler: strip `.intro-panel-wrap`/`.intro-summon` (intro owner-only in preview).
- **S3 — js/intros.js.** rename INTROS `account`→`profile` entry + finalize copy; `ROUTE_INTRO` `account`→`profile`.
- **S4 — sw.js.** CACHE_VERSION v3.199→v3.200 (LAST, at ship; verify live+1).

## Named gates (Preston's riders)
- **FAINT-DEFAULT gate:** on the built page prove the value web reads at 390 AND 1280 — print `.pf-vline`
  count + resolved opacity (rest vs `.on`) + tap-to-brighten works.
- **P8/P9 regression:** returns/journey empty-row guards + statement visitor-omit survive the re-order.
- **AM52 fencing:** owner vs visitor element-check — visitor absence: draft arcs/subs, draft counts, questions,
  Now, DNA, consent, Settings, whisper, intro.
- Live finding (R9a line-less @390) + commons `#reader` draft-body debt → verbatim into
  `docs/studio/r9b-laneg-handoff.md` at ship.

## Slice results

- **S1 — components.css — PASS.** +2572 B (647202→649774). vline faint-default (opacity .34 / .on .78,
  stroke 1.5); `"arcs numbers"` added to both grid-template-areas + `.sec-arcs{grid-area:arcs}`; new rules
  `.pf-arc*`(5) `.pf-lin-*`(5) `.pf-thread-row` `.pf-now-link` `.pf-pub.untitled .pt` `.pf-pubgrid[data-n]`(2).
  0 `--lum-` in added lines (4 rails tokens). diffstat 32+/6− (no EOL flip).
- **S2 — views.js — PASS.** **PARSE OK** (cscript). +8158 B (933896→942054). diffstat 148+/21−. New builders
  `_pfArcsSection`/`_pfLineageSection`/`_pfThreadsSection` (def=1, ref=2 each). `_pfExcerpt` rewrite;
  `_profilePublished` header→''; `_pfPublishedSection` quality pack (`data-n`, omit-cat, untitled, graceful);
  `_pfNowSection` +latest-published `data-sub`; `_pfBuildPage` AM51 re-order (sec-arcs in grid; threads after
  journey; lineage before published; `#pf-yumi-mount`→`sec-consent` Settings-adjacent; no leftover `sec-yumi`);
  `_pfWire` preview strips intro panel/summon. P8 guards + P9 statement-omit byte-unchanged. AM51 DOM order
  verified in the tree.
- **S3 — intros.js — PASS.** **PARSE OK.** diffstat 4+/4−. INTROS `account`→`profile` (finalized copy, curly
  apostrophes); `ROUTE_INTRO` `account`→`profile`. No leftover `account` intro id (188/348 = unrelated
  `accountValuesPersist`).
- **Working tree:** only `js/views.js` + `js/intros.js` + `assets/components.css` dirty (state.js/integrations.js
  UNTOUCHED; `buildReaderModelSection` byte-unchanged). sw.js bump pending (S4, at ship).
- **S4 — sw.js — DONE (ship).** live sw.js re-verified v3.199 ×2 → bumped local `CACHE_VERSION` v3.199→**v3.200**.
- **Gates — BOTH CLEARED (pre-commit).** **fix-red-team = NO-BLOCK** (re-derived every hard invariant: zero
  data change; `buildReaderModelSection` byte-unchanged, mount+consumer share the `!vis` gate; ES3 + curly
  apostrophes; parse green on a self-validating harness; visitor fencing airtight on every branch; no odd-data
  crash; no `.pf-vline` bleed; foundations MD5 locked). **praxis-reviewer = CLEARED TO COMMIT** (all 9
  dimensions PASS, byte deltas/numstat/parse independently matched). Residuals (non-blocking, round-close):
  live FAINT-DEFAULT/AM52 evidence must be captured on the deploy; lineage-public forward-exposure note; nits
  (uncategorized arc sublink dot, empty-arc meta string, bare-`-` excerpt) = felt-pass territory.
- **Lane-G handoff written:** `docs/studio/r9b-laneg-handoff.md` (in the commit set; live finding + commons debt
  carried verbatim; confirm-pass STILL OWED; Lane-G locks verbatim; "passages" ruling task; interim contract).
- **HALT at commit gate** — awaiting Preston's exact words. Commit set (path-explicit): `js/views.js`
  `assets/components.css` `js/intros.js` `sw.js` + docs (`r9b-laneg-handoff.md`, `r9b-laneP-recon.md`,
  `r9b-laneP.md`, `mockups/profile-laneP.html`).
