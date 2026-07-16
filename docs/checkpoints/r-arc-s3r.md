# R-ARC SLICE 3R — UN-GRADUATE (the reversal rider)

**Status: BUILT · RIG-VERIFIED (round trip + persistence). Awaiting red-team → review → commit. NOT pushed.**
Base **`36dc570`** / v3.213 → v3.214. Plan: `docs/r-arc-plan.md` (Slice 5 reverse-gear, promoted).

## Why this exists — a felt-pass promotion

Preston, Slice 3 deployed felt pass (2026-07-16): *"I graduated an arc and immediately wanted to move it
back and couldn't."* **Un-graduate promoted from a Slice-5 candidate to a REQUIREMENT** — a graduated arc
with no way back is the dead end REQ#6 forbids. Vehicle ruled to me: Slice 5, or a small rider on the
next slice. **My call: its own tiny commit now (Slice 3R), before 3B** — it completes the ember lifecycle
just felt-tested (arc-lifecycle), and bundling it into 3B (the sub-theory basin — a different concern)
would violate the no-bundle rule.

## What shipped (a few-line mirror)

- **`state.js` — `ungraduateArc(id)`**: flips `status` graduated→ember. Exact mirror of `graduateArc`
  (marks dirty, saves).
- **`views.js` — the affordance**: in `_arcHeadLifecycleControl`, the `graduated` branch now renders a
  quiet **"Return to ember"** button (symmetric with Graduate, which shows only while ember). Styled like
  Rename — a correction, not a forward act.
- **`components.css`**: `.arcfield-ungraduate-btn` added to the existing quiet rename-btn rule (one
  selector). Mobile 44px inherited (it carries `.arcfield-life-btn`, already in the mobile rule).

## Mechanical gates

| Gate | Result |
|---|---|
| Parse (T6) | `PARSE OK` state.js + views.js |
| Bytes | state +428 B · views +467 B · css +50 B · sw +0 (v3.213→v3.214) — small rider |
| ES3 | 0 violations in added lines |
| Byte-locks (T7) | 14,681 / 10,255 exact |
| New hex | none |
| Tripwires | T1 ✅ (no sub-theory status — arc-only) · T2 ✅ (yumi-brain untouched) · T3 ✅ (rides the same `ensureArcFields` `status` field — no new field) · T4 ✅ · T5 ✅ (frozen renderers untouched) |

## Live verification — the rig (port 8801, SW killed)

| Behavior | Result |
|---|---|
| `ungraduateArc` live | ✅ |
| Graduated arc renders "Return to ember" (quiet), no Graduate button | ✅ |
| Click → status graduated→**ember**; chip → "ember"; Graduate button returns; un-graduate gone | ✅ `ROUND_TRIP_WORKS: true` |
| The reversal **persists across a reload** | ✅ `PERSISTED_AS_EMBER: true` |

The graduate↔un-graduate cycle is complete and reversible, both directions verified.

## Residuals

1. **VISUAL GATE owed** — the "Return to ember" button on a graduated arc's detail header (Preston's eyes
   on deploy).
2. **Label** — "Return to ember" uses the locked vocabulary; a felt-pass word choice (swap trivial).
