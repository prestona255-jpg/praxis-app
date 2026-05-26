# Arc constellation — polish backlog

Known visual polish items observed during arc constellation build. Not blocking; not part of any open stage. Roll into a dedicated polish pass once the constellation renderer is in place and threads/marginalia are wired.

## Items

### P-1 — Poetry Band 2 inner-light reads darker than peers
**Observed:** Stage 2 checkpoint (2026-05-26) visual verification on live deploy.
**Symptom:** Across the 9×3 grid, Poetry's Band 2 inner-light ellipse reads slightly darker / less luminous than the inner lights on the other eight traditions, despite using the same `tfa-innerL` radial gradient (#FFF8E7 at 0.9 → 0 over 30%).
**Suspected cause:** Cobalt (#4858B8) is the only cool base color in the set. The warm cream gradient (#FFF8E7) sits over a cool-dark core (#1A2280), and warm-on-cool reads as muddied to the eye in a way the other warm-on-warm pairs do not. The gradient itself is not the bug; the *perceptual* contrast is the bug.
**Possible fixes (defer until polish pass):**
- Brighten Poetry's inner-light specifically: a per-tradition inner-light gradient (e.g. `tfa-innerL-poetry` with a slightly cooler or higher-opacity stop) rather than the shared `tfa-innerL`.
- Lift Poetry's core color toward a lighter cobalt at Band 2 so the inner-light has more to play against.
- Nudge Poetry's inner-light slightly larger (rx/ry +1px at scale 60) so more of the ellipse sits above the dark core.
**Do not pursue now.** Cosmetic only. Document the choice when fixing.

### P-2 — Threads cross through central question text at high book counts
**Observed:** Stage 3 checkpoint (2026-05-26) visual verification of the 12-book constellation stress test.
**Symptom:** When an arc has 12+ books, the deterministic scatter layout places books on a ring around the central question gravity. Threads between books on opposite sides of the ring pass straight through the visual center, crossing through and visually breaking the italic serif question text.
**Suspected cause:** The current collision-avoidance pass in `_arcConstellationLayout` (`js/arc-constellation.js`) handles book-to-book overlap (min gap 36 between centers) but treats threads as pure straight `<line>` segments with no awareness of the question text region. As book count rises, the probability that *some* thread passes through center approaches 1.
**Possible fixes (defer until real arcs surface this):**
- Curve threads around the center: bend each thread away from the centroid via a quadratic Bézier whose control point is offset perpendicular to the segment, scaled by how close the segment passes to center.
- Reserve a "no-fly" radius around the question text and re-route threads that intrude (e.g. via a midpoint waypoint pushed outward).
- Render the question text with a thin halo / outline matching the wheat ground so threads visually pass *behind* the letters rather than *through* them. Cheapest fix; doesn't solve the geometry but solves the readability symptom.
**Do not pursue now.** Real arcs in the wild may not hit 12+ books often enough to justify the complexity; the readability halo (third option) may be sufficient. Revisit once real arc data exists.
