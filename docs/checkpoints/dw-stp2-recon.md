# DW-STP2 — Stage 0 recon (subtheory-page · D2 reading-measure cap)

Standalone item (Preston ruled 2026-07-14): the DW-3 rider named `subtheory-page`'s D2 gap but
DW-3 shipped it docs-only as a named gap (`be050e5`). Its host batch is closed (`f15fb2a`,
pushed, live v3.206), so DW-STP2 runs on its own: own regen, own sw.js bump (→ v3.207), own
small commit. Standing delegation (Preston, July 14) applies: forks ruled at my recommendation,
no mockup, no mid-run halt; chip under-claimed `composed` (felt pass decides `native`).

## Ground truth

- HEAD `f15fb2a` == `origin/main`; tracked tree clean; hook gate ARMED; FIX-PROTOCOL v1.2.
- Live SW cache observed in-rig: `praxis-v3.206` (matches `sw.js`).
- Target rule: `assets/components.css:11197`
  `.st-page.lum-amber-deep .subtheory-readonly-body{ font-size:20px; line-height:1.78; }` —
  no `max-width`; base rule `:6348` (18px). Neither is width-scoped.
- Layout chain: `.st-page.lum-amber-deep > .st-grid{max-width:1180; padding:0 30}` (:11096) +
  `.st-grid{grid-template-columns:minmax(0,1fr) 240px; gap:34}` (:11119) → main column 825px,
  **fixed at every desktop width** (hence D2 fails identically at 1280/1440/1920).
- EOL baseline: CR == LF == **14092**; bytes **691170**; md5 `5d4e70e41ffd1bf041eebcfd84c9cb3d`.
- TRUE `@media(min-width:1200px)` rule-blocks: **8** (opening-brace count; the loose grep reads 9,
  sweeping the prose comment at :13738 — the DW-3 correction, honored here).

## Rig (reproduces DW-3's numbers exactly)

PowerShell HttpListener :8791 · SW unregistered + `praxis-v3.206` cache deleted · **auth stub
uid `d0tester` + seed workspace re-owned in memory only** (never `sv('praxis_state')`).

**Fixture is real, not synthetic:** the four `__praxis_seed__` sub-theories ("A Pedagogy of
Desire") carry genuine authored prose. `subtheory_1784076222339_958848` ("Pain and Struggle on
the Path of Liberation", bodyPublic **3156 chars**) is the D2 fixture — the longest body, so the
honest worst case.

**Reproduce-first caught a rig trap.** Signed-OUT, the seed sentinel opens the read page but
renders **no `.st-grid` / no `.st-gutter`** — a bare full-bleed structure (body = 1904.7px /
199.7ch @1920). That is a *different code path* from DW-3's. Only after the auth stub + re-own
does the composed structure render — and it then reproduces DW-3 **exactly**:

| DW-3 recorded | this rig | match |
|---|---|---|
| body 825px | **825px** | ✓ exact |
| body 86.4ch | **86.4ch** | ✓ exact |
| occ 79.9% @1920 | 81.5% (textSpan) | ✓ definition confirmed (seed differs) |

## Baseline gates (pre-fix)

| width | cw | D1 textSpan | D1 grid | D2 body | D3 hScroll | D4 pointer | D5 body-fs |
|---|---|---|---|---|---|---|---|
| 1280 | 1265 | 98.0% | 98.0% | **86.4ch / 824.7px** | 0 | 10/10 | 20px |
| 1440 | 1425 | 92.0% | 87.0% | **86.4ch / 824.7px** | 0 | 10/10 | 20px |
| 1920 | 1905 | 81.5% | 65.1% | **86.4ch / 824.7px** | 0 | 10/10 | 20px |

D1/D3/D4/D5 PASS. **D2 FAILS** — confirmed, reproduced, premise intact.

## Findings that qualify the rider's premise

**1 — the one-line cap DOES clear D2 (scope holds).** D2's check reads "widest text-bearing
prose block ≤72ch", and other blocks measure over 72ch:

| block | container | text len | flows >72ch? |
|---|---|---|---|
| `.st-room-threshold` | 196.7ch | mono eyebrow label | no — not prose |
| `seealso-item` | 125.5ch | 21 / 26 chars | no — never wraps |
| **`body`** | **86.4ch** | **3156 chars** | **YES — the violation** |
| `cite-line` / `evidence-item` | 83.8ch | 39 / 60 chars | no — never wraps |
| `header` | 57.6ch | 43 chars | passes outright |

Only the body actually *flows* text at >72ch; the rest are short strings in wide containers.
This is exactly how DW-3 scored D2 (it named the body alone), so the body cap clears D2 under
the program's operative definition. **Ruled: cap the body only — no scope addition.**

**2 — D6 is thinner than the ledger records (NEW GAP, not fixed here).** Canon D6 samples
"top-nav links, primary buttons, and chips". Live: **1 of 11** interactive elements on this
surface is matched by any `:focus-visible` rule (`.st-hero-mark-ed`); the primary button
`.st-pill-publish` and 9 others are **uncovered**. DW-3's "D6 present PASS" was a
sampled-presence reading.

**Ruled: score D6 on the ledger's rubric (PASS), do NOT re-score, do NOT silently fix.**
Rationale: every already-flipped surface (book-detail, subtheory-build) was scored by that same
rubric, so tightening D6 now is a **program-level rubric change**, not a DW-STP2 change — and it
would retroactively unseat chips Preston already ratified. Per the CLAUDE.md GUARDRAIL that is a
`PROPOSED:` item for Preston, filed as gap **DW-STP2-D6** + a Re-plan log entry. Adding rings
here (the DW-3 subtheory-build precedent, `:11529`) was considered and rejected as scope creep
against an explicit one-line ruling.

## Plan

One `@media (min-width:1200px)` block inserted after the section end marker `:11285`
(`/* ===== end R6 S2 · THE PAGE BECOMES THE READ ===== */`) — the DW-3 placement pattern.
`max-width:72ch` on `.st-page.lum-amber-deep .subtheory-readonly-body` (source order beats equal
specificity; `ch` resolves against the element's own 20px serif). Expected band: **+6…+10 bytes
of rule**, components.css only, no JS. Then: live D1–D6 re-run at 1280/1440/1920 · chip →
`composed` · `tools/studio-build` regen · sw.js `CACHE_VERSION` +1 (read at commit time).

**Watch:** capping prose narrows the text fill — re-measure D1 after, since a textSpan-based
occupancy could in principle drop. (Grid columns are unchanged, so the risk is low but untested.)
