# PROTOCOL.md — Praxis Wave Build Protocol

**Version:** 1.1
**Applies to:** every surface conversion and feature wave in praxis-app.
**Read this first, every wave. Obey it exactly. It overrides convenience, momentum, and your own judgment about what would be faster.**

> **Changes in v1.1** (learned from Wave 7):
> - BOX 1 now requires a **mockup-derived fidelity manifest** for any wave with a design target — enumerated from the file (never from memory), presented for Preston's approval at the HALT, and mapped against the build row-by-row (§2, §3).
> - §4: the **759 responsive reflow is a built deliverable**, not a verify-only afterthought — build it, then verify at true 390.
> - §9: **live-deployed-bundle verification** is required after push (fetch the deployed origin, not the local server), and byte reconciliation is done via `git diff --stat` (fully determined) rather than summed self-reports.

---

## 0. How this is invoked

Preston pastes a four-line wave header:

```
Read PROTOCOL.md and obey it exactly.
This wave's scope: [surfaces / files].
Out of scope this wave: [adjacent things to NOT touch].
Begin BOX 1. Do not proceed past the HALT.
```

The header carries no rules. All rules live in this file. If the header and this file conflict, this file wins. If scope is ambiguous or the declared anchors don't exist as described, HALT and ask before doing any recon. Do not guess.

---

## 1. The three-box rhythm

Every wave is three pastes, three boxes, in order. You never collapse two boxes into one turn.

- **BOX 1 — RECON → HALT.** Read, report, stop. Zero edits.
- **BOX 2 — BUILD → per-surface HOLD.** One surface at a time, each behind a PASS/FAIL gate.
- **BOX 3 — CLOSE-OUT.** Summary, decision log, version bump, commit on explicit instruction, live verify.

A **HALT** is a full stop that ends your turn and waits for Preston. A **HOLD** is a checkpoint inside BOX 2 where you present one surface's evidence and wait for PASS before touching the next surface.

---

## 2. BOX 1 — Recon

Goal: prove you understand each surface before you change it. Output only, zero edits.

Per file in scope, report:
- Full path and current byte size.
- The exact anchors you'll edit — function name + approximate line, selector, or block — quoted from the file.
- Grep counts for every pattern you intend to add or remove.
- Confirmation the file sits in the current router path (`renderRoute()` in `views.js`, ~line 343), where relevant.
- Any drift you notice that this wave did NOT introduce → flag as a separate task. Do not fold it into this wave.

**Mockup-derived fidelity manifest — required for any surface that has a design/mockup file.** Fidelity means fidelity to the file, not to memory. For each such surface:
- **Read the actual mockup file the build targets** — the one in the repo (e.g. `design/…`). Not this document, not an earlier copy, not your recollection. If two candidate files exist (a zip vs. a prior export), HALT and ask which is the source of truth before enumerating. Never average them or pick one silently.
- **Enumerate every visible element the file defines**, top to bottom, as concrete numbered rows: each structural region + its layout (column / slide-over / grid / full-bleed); every control, button, tab, toggle, pill, chip, field, orb, FAB; every text element + its literal role/label (header, eyebrow, note, meta, caption); every distinct state the mockup shows (empty, flagged, active, seeded); the color/material intent per element (glass vs. solid ground, cyan vs. gold accent); and the type treatment (serif-italic vs. sans).
- **This numbered manifest, derived from the file, IS the fidelity contract for the wave.** It replaces any checklist written from memory. The build maps against it in BOX 2 (§3), and every divergence becomes a decision row for Preston — no divergence is decided silently during the build.
- **Present the full manifest in the BOX 1 HALT report — it is Preston's to review and approve *before* any build begins.** An unreviewed manifest can silently omit an element the mockup actually has, and that element then never becomes a `MISSING` row because the contract itself is blind to it. Preston's sign-off at the HALT is the only check against a blind contract. The manifest is a deliverable, not internal scratch.

Then, per surface, compute and state:
- **Expected byte delta** — your pre-computed estimate of the size change, with reasoning. This is what Preston verifies against later.
- The parse-check method you'll use (§7).

End BOX 1 with the literal line `HALT — awaiting go-ahead for BOX 2.` Nothing edited, nothing committed. Wait.

---

## 3. BOX 2 — Build

One surface at a time. For each surface, in order:

1. Make the edit.
2. Run the parse check (§7). Paste the **actual output**.
3. Report **actual byte delta** beside the **expected** from BOX 1. If they diverge materially, explain why before proceeding.
4. Run render verification (§4) — desktop AND mobile 390. Attach the artifact, not a narrative.
5. **Map the build to the fidelity manifest (§2), row by row.** Mark each row: `BUILT-EXACT` (cite the selector / computed proof), `DIVERGES` (state exactly how and why), `DEFERRED` (state why — e.g. no data-model field), or `MISSING` (in the mockup, not in the build). No row left unmarked. "Looks close" is not a mark.
6. Present a **PASS / FAIL** verdict for the surface with the evidence above.

**Every `DIVERGES`, `DEFERRED`, and `MISSING` row is a decision row for Preston at the HOLD** — and a `MISSING` element (present in the mockup, absent from the build) blocks PASS unless Preston reclassifies it as an accepted `DEFERRED`. A divergence discovered during the build and silently kept is a protocol violation — surface it, don't absorb it. (This is the exact failure Wave 7 hit: divergences appeared in the agent's narrative after the build instead of being ruled on up front.)

**FAIL → revert that surface immediately.** Do not proceed to the next surface. Report what failed and stop at a HOLD.

**PASS → HOLD.** Present the evidence and the manifest map, wait for Preston's go-ahead, then move to the next surface. **One question maximum per HOLD.**

**Judgment clause:** if the parse check surfaces a pre-existing error the current surface did not introduce (matches drift flagged in BOX 1), do NOT auto-revert a clean edit. Flag it, keep the clean edit, note it for a separate task.

---

## 4. Render verification — desktop + mobile, as artifact

"I checked the render" is never accepted. You produce evidence.

Mechanism: drive the **Claude_Preview MCP** against the **PowerShell HttpListener** static server. **Seed representative state first** — enough real data that every element and every mockup state (empty, seeded, flagged, active) actually populates. An unseeded surface renders false-empty and proves nothing. For each surface:

- **Desktop pass:** load the surface, capture a screenshot or assert on the rendered DOM — a specific selector present, expected text, or expected computed style.
- **Mobile pass — a BUILT deliverable, not a verify-only afterthought, and its own named step:** **build the responsive reflow at the 759 breakpoint** in the same wave/commit, then verify at **true 390** (CDP width emulation, real `clientWidth=390`). A surface does not PASS until the reflow is built and the 390 render is green. Rendering at 390 on an inherited layout without building the reflow is **not** a pass — Wave 7 slid through on a layout that happened to work, which was luck, not instruction.

On any re-render after a fix, fully clear SW registrations + caches (→0) and reload before capturing.

If the Preview MCP or the server is unreachable, that is a **FAIL** for the surface. Say so plainly. Never declare PASS on an unverified render.

---

## 5. Autonomy contract — what you decide vs. what stops the build

During BOX 2, you decide every **reversible, local implementation question yourself** and log it in the BOX 3 decision log. You do NOT stop to ask about: variable names, edit ordering within a surface, whitespace, which equivalent selector to target, how to structure a helper, minor refactors that don't cross the HALT list. Deciding these and moving is the job. Stopping to ask about them is the failure.

You HALT — full stop, end turn, wait — **only** for items on the HALT list (§6). Nothing else earns a stop.

Note the boundary with §3: a *fidelity divergence* from the mockup is never a silent local decision — it is always surfaced as a decision row at the HOLD. Deciding how to implement a row is yours; deciding whether to depart from the mockup is Preston's.

---

## 6. THE HALT LIST (load-bearing — the whole protocol rests here)

Stop and wait for Preston before doing any of the following. No exceptions, no "it was obviously fine."

1. **Byte-locked foundation files.** Any change to `lumen-amber.css` (locked at **14,966 B**) or `marks.js` (locked at **10,255 B**). If a wave appears to require touching these, HALT and say why. *(lumen-amber re-baselined 14,681 → 14,966 B at R-POLISH B3: AES-1 dropped the `var(--mk-glow)` read at `:177` so mark glows resolve to one gold app-wide — a single ruled line, authorised by Preston at the B3 Stage-0 rulings, recorded here at the ship commit as ruled. `marks.js` itself was NOT touched.)*
2. **Yumi covenant.** Anything touching the covenant path — `assembleContextData` lines **222–226**, Yumi's **cyan-only** color, the **never-summarizes** behavior. The covenant is a constraint, not a decision. Never bypass it, never "improve" it, never let another surface's change alter it.
3. **The six load-bearing principles.** Any change that would violate: (1) Yumi never summarizes books; (2) Notebook is structurally private; (3) one Book Artifact per user per book; (4) stars de-emphasized, no follower counts as primary UI; (5) no asymmetric knowledge; (6) Knowledge Arcs are intersectional by design. (Canonical articulation + enforcement seams: `docs/PRINCIPLES.md`.)
4. **Dependencies and syntax floor.** Any new dependency of any kind. Any ES5-or-later syntax entering client JS (§7 — the floor is ES3).
5. **Scope.** Anything beyond the surfaces declared in this wave's header, or anything named in `Out of scope this wave`.

---

## 7. Locked conventions (the constraints you build under)

- **Client JS is ES3 only.** `var` and `function` only. String concatenation only — no template literals. No `const`, `let`, arrow functions, `class`, or any modern syntax. Reaching for ES5+ is a HALT (§6.4).
- **CSS lives in `assets/components.css`, per surface.** No inline style injection, no new stylesheets.
- **Git staging is explicit-file only.** Name every file in the `git add`. Never `git add .`, never `git add -A`.
- **Parse check = cscript JScript.** That is the sanctioned parse verification. Paste its real output. **Node.js is blocked on the Windows work machine by IT policy** — do not propose `node` or `npm` as a parse or pre-flight step there. If a stage genuinely needs Node, HALT and ask which workaround Preston wants: live Netlify deploy as the parse check, move to Mac at `~/Desktop/Projects/praxis-app`, or accept the cscript harness's known fragility.
- **Router:** `renderRoute()` in `views.js` (~line 343).
- **Version bump:** state the current `CACHE_VERSION` in BOX 1 recon and increment it by one on ship (e.g. v3.160 → v3.161). Do not hard-code a version from an older prompt — confirm HEAD first.

---

## 8. Verifiability — no claim stands on its own word

Every factual claim in every box carries independent evidence: a byte size, a grep count, parse output, a render artifact, or a commit hash. "I did X" with no attached evidence is treated as **not done**.

**Commit discipline:** `Awaiting go-ahead`, or any close-out that ends without a commit, means **nothing is committed** — the work is still in the working tree. A commit is real only when you report its **hash**. No hash = not committed. Preston relays an explicit `commit and push` before you commit; you confirm with the hash.

---

## 9. BOX 3 — Close-out

- One-paragraph summary of what shipped this wave.
- **Decision log:** every autonomous call you made in BOX 2 (§5), plus every divergence Preston ruled on (§3), one line each.
- **Byte reconciliation:** report final **absolute** byte size per touched file. The canonical wave delta is `git diff --stat <base-hash>..<head-hash>` — fully determined by the commit, not by summed self-reports. Use it.
- New version number.
- Await the explicit `commit and push`. On instruction: commit with explicit-file staging, push, and report the **hash** + `HEAD == origin/main`.
- **Live verification (deployed bundle, after push):** the local preview browser is scoped to the local dev server — verifying `localhost` proves nothing about the deploy. Confirm on the **live origin**: fetch the deployed URL directly (WebFetch) to confirm `CACHE_VERSION` shipped, then render the live site (SW + caches cleared → re-registered) to confirm each surface carries its atmosphere on the deployed bundle. **No hash + no live confirm = not shipped.**

---

*Edit this file in one place. When a rule changes, change it here, bump the version at the top, commit it. The rigor lives in the repo, not in anyone's memory.*
