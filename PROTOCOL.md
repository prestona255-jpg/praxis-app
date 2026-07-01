# PROTOCOL.md — Praxis Wave Build Protocol

**Version:** 1.0
**Applies to:** every surface conversion and feature wave in praxis-app.
**Read this first, every wave. Obey it exactly. It overrides convenience, momentum, and your own judgment about what would be faster.**

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
- **BOX 3 — CLOSE-OUT.** Summary, decision log, version bump, commit on explicit instruction.

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
5. Present a **PASS / FAIL** verdict for the surface with the evidence above.

**FAIL → revert that surface immediately.** Do not proceed to the next surface. Report what failed and stop at a HOLD.

**PASS → HOLD.** Present the evidence, wait for Preston's go-ahead, then move to the next surface. **One question maximum per HOLD.**

**Judgment clause:** if the parse check surfaces a pre-existing error the current surface did not introduce (matches drift flagged in BOX 1), do NOT auto-revert a clean edit. Flag it, keep the clean edit, note it for a separate task.

---

## 4. Render verification — desktop + mobile, as artifact

"I checked the render" is never accepted. You produce evidence.

Mechanism: drive the **Claude_Preview MCP** against the **PowerShell HttpListener** static server. For each surface:

- **Desktop pass:** load the surface, capture a screenshot or assert on the rendered DOM — a specific selector present, expected text, or expected computed style.
- **Mobile pass — its own named step, never folded into desktop:** **CDP 390-width emulation**, same capture/assertion. A surface does not PASS until the 390 pass is green.

If the Preview MCP or the server is unreachable, that is a **FAIL** for the surface. Say so plainly. Never declare PASS on an unverified render.

---

## 5. Autonomy contract — what you decide vs. what stops the build

During BOX 2, you decide every **reversible, local implementation question yourself** and log it in the BOX 3 decision log. You do NOT stop to ask about: variable names, edit ordering within a surface, whitespace, which equivalent selector to target, how to structure a helper, minor refactors that don't cross the HALT list. Deciding these and moving is the job. Stopping to ask about them is the failure.

You HALT — full stop, end turn, wait — **only** for items on the HALT list (§6). Nothing else earns a stop.

---

## 6. THE HALT LIST (load-bearing — the whole protocol rests here)

Stop and wait for Preston before doing any of the following. No exceptions, no "it was obviously fine."

1. **Byte-locked foundation files.** Any change to `lumen-amber.css` (locked at **14,681 B**) or `marks.js` (locked at **10,255 B**). If a wave appears to require touching these, HALT and say why.
2. **Yumi covenant.** Anything touching the covenant path — `assembleContextData` lines **222–226**, Yumi's **cyan-only** color, the **never-summarizes** behavior. The covenant is a constraint, not a decision. Never bypass it, never "improve" it, never let another surface's change alter it.
3. **The six load-bearing principles.** Any change that would violate: (1) Yumi never summarizes books; (2) Notebook is structurally private; (3) one Book Artifact per user per book; (4) stars de-emphasized, no follower counts as primary UI; (5) no asymmetric knowledge; (6) Knowledge Arcs are intersectional by design.
4. **Dependencies and syntax floor.** Any new dependency of any kind. Any ES5-or-later syntax entering client JS (§7 — the floor is ES3).
5. **Scope.** Anything beyond the surfaces declared in this wave's header, or anything named in `Out of scope this wave`.

---

## 7. Locked conventions (the constraints you build under)

- **Client JS is ES3 only.** `var` and `function` only. String concatenation only — no template literals. No `const`, `let`, arrow functions, `class`, or any modern syntax. Reaching for ES5+ is a HALT (§6.4).
- **CSS lives in `assets/components.css`, per surface.** No inline style injection, no new stylesheets.
- **Git staging is explicit-file only.** Name every file in the `git add`. Never `git add .`, never `git add -A`.
- **Parse check = cscript JScript.** That is the sanctioned parse verification. Paste its real output. **Node.js is blocked on the Windows work machine by IT policy** — do not propose `node` or `npm` as a parse or pre-flight step there. If a stage genuinely needs Node, HALT and ask which workaround Preston wants: live Netlify deploy as the parse check, move to Mac at `~/Desktop/Projects/praxis-app`, or accept the cscript harness's known fragility.
- **Router:** `renderRoute()` in `views.js` (~line 343).
- **Version bump:** main is at **v3.160**; the next ship increments to **v3.161**, then onward. State the new version in BOX 3.

---

## 8. Verifiability — no claim stands on its own word

Every factual claim in every box carries independent evidence: a byte size, a grep count, parse output, a render artifact, or a commit hash. "I did X" with no attached evidence is treated as **not done**.

**Commit discipline:** `Awaiting go-ahead`, or any close-out that ends without a commit, means **nothing is committed** — the work is still in the working tree. A commit is real only when you report its **hash**. No hash = not committed. Preston relays an explicit `commit and push` before you commit; you confirm with the hash.

---

## 9. BOX 3 — Close-out

- One-paragraph summary of what shipped this wave.
- **Decision log:** every autonomous call you made in BOX 2 (§5), one line each.
- Final byte sizes of all touched files, expected-vs-actual reconciled.
- New version number.
- Await the explicit `commit and push`. On instruction: commit with explicit-file staging, push, and report the hash.

---

*Edit this file in one place. When a rule changes, change it here, bump the version at the top, commit it. The rigor lives in the repo, not in anyone's memory.*
