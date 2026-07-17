# R-ARC S6c — READ-ONLY LIGHTING (marginalia cards) — STARTED

Base `5f2bce0` / live v3.221 (verified: two cache-busted reads, Age 0). Wave C
(Fable 5). Wave B formally CLOSED this date — felt verdict ALL FOUR PASS
(gathering/draft vocab · honest doors · dot/word pairing · dissolve). Code-push
gate CLEARED. This slice commits LOCAL and HALTS for the push word (standing
rule — the gate cleared; the word is still per-commit).

Scope (plan 6c + Preston's instruction): deterministic recognition lighting on
MARGINALIA cards only — the static, non-editable render path (no caret, no
undo, rebuilt every paint). F-C: display-layer only; renderer untouched for
decoration (light AFTER `wcRenderMarkdown` fills the card); T10: user text via
moved text nodes only, zero innerHTML. **LIGHT-ONLY: spans are deliberately
NON-interactive** (no link affordance, no cursor change) — the DWF-1
pencil-decoration law: a lit span that looks clickable but isn't ships a dead
control; linking (titles → book, authors → filtered shelf per F-F) lands with
the Room/rail work, named follow-on.

## Stage 0 recon (verified anchors)

- THE render site: views.js:14587-14592 — `renderNotebookEntry`'s isMarg branch
  (`wcRenderMarkdown(bodyEl, entry.body)`); journal/question stay plain
  textContent (out of 6c per plan — "a separate, larger job").
- **CORRECTED AT THE GATES (red-team BLOCK + reviewer Finding B — recon error,
  mine):** the original recon claimed arc-detail's member stream reuses
  `renderNotebookEntry` ("lights there too"). **FALSE.** That read the STALE
  Stage 3.9-a comment at views.js:12645-12655; the LIVE arc-detail code
  (~:12750-12819) builds its own plain-`textContent` rows and never calls
  `wcRenderMarkdown`. `renderNotebookEntry` has exactly ONE call site —
  views.js:2210 (`buildNotebookLeftLeaf`, the Notebook page). **Lighting
  reaches the NOTEBOOK ONLY this slice.** The DOC=POINTER / LIVE=SOURCE trap,
  caught by the gates before commit; arc-detail lighting is a named candidate
  for the rail slice / Slice 7, not a shipped behavior.
- CSS: `.notebook-entry-body-md` block at components.css:10756-10766; the new
  rule lands beside it as a BASE rule (both widths want the identical value —
  the one case a base edit is legal).
- Baselines: views.js 1,007,118 B · components.css 717,031 B · sw.js 4,922 B
  (v3.221).

## Design (session-owned)

- `_recogIndex()` memo in views.js: rebuilds via `PraxisRecognition.buildIndex()`
  when `uid + ':' + bookIds.length` changes (sign-in/out + add/delete safe).
  Residual: a title RENAME at unchanged count leaves a stale term until the
  next count change/reload — display-only, F4-expendable, named below.
- `_recogLightEl(el)`: walk text nodes (capture node refs + cumulative starts +
  ORIGINAL lengths before any mutation) → `scan(idx, fullText)` → apply matches
  in REVERSE, and within a match wrap per-node intersections in REVERSE node
  order (spike technique: guarded splitText + span insert; segment-wise across
  inline-element boundaries). No caret handling — static cards. Spans:
  `rec-lit rec-lit-<kind>`, stateless, no data attrs, no handlers.
- Call site: one line after views.js:14589. CSS: one quiet base rule
  (`border-bottom:1px dotted var(--gold)`), no cursor change, no hover.

## Band declaration (two figures, FIX-PROTOCOL §3)

| File | CODE band (hard) | COMMENT allowance (soft) |
|---|---|---|
| js/views.js | **+1,400–2,800 B** | ≤700 B |
| assets/components.css | **+60–220 B** | ≤120 B |
| sw.js | bump v3.221→v3.222, **±0 net** | — |

Nothing else. recognition.js and index.html untouched this slice.

## Wave B close + intake (round-doc currency, per Preston's instruction)

- **WAVE B FORMALLY CLOSED 2026-07-17** — felt verdict v3.220 ALL FOUR PASS
  (gathering/draft vocab ✓ · honest doors ✓ · dot/word pairing ✓ · dissolve ✓
  — notes survived, modal register correct, gold primary).
- **INTAKE WAVE-C-INT-1 ("Na…"):** the workshop's narrow-column header renders
  the name placeholder as "Na..." — mid-word truncation of "Name it…" (FF-9
  family, cosmetic). NOT fixed here (no silent fixes). Proposed vehicle:
  **Slice 12** (owns the workshop's composition/header) — confirm at the next
  slotting touchpoint; alternative: a disclosed rider on the rail slice if its
  band has room.

## Self-verify (all session-run)

| Gate | Result |
|---|---|
| Parse | `tools/parse-check js/views.js` → **PARSE OK, exit 0** |
| views.js band | added (LF-norm, diff-classified): **logic 2,169 B** (hard 1,400–2,800 ✓) · **comment 625 B** (soft ≤700 ✓) · raw delta +2,858 |
| components.css band | added: **logic 75 B** (hard 60–220 ✓) · **comment 115 B** (soft ≤120 ✓) · raw delta +194 |
| sw.js | v3.221→**v3.222**, **±0 net** (4,922 B exact); sed flipped the working copy to LF → restored CRLF via unix2dos (blob LF regardless — repo-wide fact); diffstat 1/1 surgical |
| Greps | added code: innerHTML 0 · seed 0 · ES3 tokens 0 · `_recogLightEl` = 2 (def+call) · `rec-lit` views 1 / css 1 |
| Scope | tracked dirt = exactly views.js · components.css · sw.js |

## Rig live-verify (:8932 fresh port — JS changed; full app, seed + d0tester stub)

- **Unit (renderNotebookEntry direct):** injected marginalia body naming
  `Hidden Potential` (×2, one inside `**bold**`) + `bell hooks` + three honest
  darks — **3/3 lit exactly**: `rec-lit-title` ×2 (one wrapped INSIDE
  `<strong>` — the segment technique live in a real card), `rec-lit-author` ×1;
  `fullTextIntact: true` (byte compare); computed `border-bottom: dotted 1px`;
  **cursor: auto** (non-interactive, DWF-1 honest).
- **Honest darks held:** `Giroux` alone (F-F full-name only) · `yearning`
  (title term is the full normalized string) · `Range` alone (ditto) — none lit.
- **Route (#notebook via real nav click):** injected card renders lit in the
  live surface; **page-total lit = 3 = exactly the expectations** (zero
  spurious lights across every other card); text intact.
- **Journal/question control:** `.rec-lit` outside `-md` bodies = **0** (plain
  textContent path untouched).
- **INTERACTIVE-CONTROL SWEEP (lit card):** kebab fired — OWN state
  `aria-expanded:"true"` + `.notebook-entry-overflow is-open` (7 items) +
  `.notebook-entry-acts` visible (3); second click toggled closed; spans held
  (3) through the interaction. (First probe's selector missed the class —
  own-state probing caught the real behavior, the sweep-law lesson again.)
- **390 leg:** 3 lit at 375px, `dotted 1px` computed, **no page h-scroll**.
- **Console: zero errors** across boot → inject → route → sweep → resize.
- VISUAL GATE residual: pane screenshots are dead (rig law); computed style +
  geometry recorded — **Preston's eyes on the deployed build remain the gate.**

## Residuals (post-gates wording)

- R1 — index memo keyed `uid:bookIds.length`: **any same-count library
  mutation** (title rename · delete+add swap · bulk replace) leaves stale
  terms until the next count change/reload (red-team NOTE 2 broadened the
  original rename-only wording). Display-only, F4-expendable. uid in the key
  prevents cross-user leaks (verified).
- R2 — **STRUCK** (the arc-detail claim was false — see the corrected recon
  above). Replacement: arc-detail's "Notes in this arc" rail is plain
  textContent and UNLIT; lighting it = named candidate for the rail slice.
- R3 — linking (titles → book, authors → filtered shelf per F-F) is the named
  follow-on; spans stay deliberately non-interactive until it lands.
- R4 — journal/question lighting = the plan's named "separate, larger job"
  (needs a first render pass for those registers).
- R5 — **PERFORMANCE (F6 carried forward, measured, not silent):** pathological
  card (4,760 chars, 80 lit spans, 10-term index) renders in **6.1 ms** total;
  `scan()` alone ≈1.08 ms → **~28 ms extrapolated at a 260-term library** for
  such a card (linear in terms — per-term indexOf sweep). Typical cards
  (~200 chars) extrapolate to ~1–2 ms each. Acceptable now; **Slice 7 must
  band its own matcher-pass cost** (per-keystroke-adjacent cadence) and owns
  any single-pass optimization.
- R6 — clamp-boundary nit (red-team 4): a lit span landing exactly on the
  `.notebook-entry-body-md` 15em clamp line was not specifically driven
  (inline border-bottom adds no block height — judged no-risk, recorded as
  untested).

## Gate verdicts + dispositions

- **fix-red-team: 1 BLOCK + 2 NOTE + 1 nit.** BLOCK (false arc-detail
  reuse claim in recon/R2) → **FIXED** (corrected recon + R2 struck; the claim
  is now the opposite fact, verified by call-site grep: one call site,
  views.js:2210). NOTE 2 (R1 under-scoped) → **FIXED** (broadened). NOTE 3
  (F6 perf law silently dropped + cross-boundary case undriven) → **FIXED
  with evidence**: R5 carries measured numbers; the partial-outside→inside-
  `<strong>` case was DRIVEN live post-gates — **4 segment spans exactly**
  (`Hidden `|P + `Potential`|STRONG title; `bell `|P + `hooks`|STRONG author),
  full text byte-intact. Nit 4 → recorded as R6. Red-team's independent
  re-derivations (reverse-loop hand-trace incl. two-in-one-node and
  boundary-exact; band recount; kind literal-safety; base-rule compliance)
  all corroborated the build.
- **praxis-reviewer: HOLD (documentary only; every mechanical gate PASS).**
  Finding B = the same false claim → FIXED as above. Finding A (studio
  round-doc currency must ride this commit) → **FIXED**: r-arc.md ledger +
  status and sequence.md Wave-B-close currency edited into THIS commit;
  Builder regen run detached and its output rides too. Reviewer's independent
  band re-derivation (2,169/625 · 75/115 · ±0) matched to the byte.
