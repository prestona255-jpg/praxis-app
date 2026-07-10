# R5 S2 — GROUNDS (+ D4) — STARTED

Option-B scoped skin (route map umberGroundDark UNTOUCHED). Files: js/views.js + assets/components.css.
Mechanism = R3/R4 precedent: scoped `.<surface>.lum-amber-deep{ --tokens:light }` re-point + literal rescues.

## Slices
1. **LIST → Universal light.** views.js renderArcsPage className `arcs lum-amber`→`arcs lum-amber-deep`.
   components.css: APPEND `.arcs.lum-amber-deep` light block (re-point globals to Shelf/Home light set +
   light ground + D1 auto-fit grid + grid-auto-rows equal tiles + solid card [glass/blur dropped] +
   quiet ink meta + light mini-constellation band). Old `.arcs.lum-amber` left INERT → S6 dead-code sweep.
   Cards carry no renderer text → NO renderer-global re-point needed (unlike interior).
2. **INTERIOR → warm-dim.** views.js renderArcDetail className `arcfield lum-amber`→`arcfield lum-amber
   arcfield-warm`. components.css: `.arcfield.arcfield-warm` re-point `--lum-*`→toasted-parchment
   (ink KEPT dark, no inversion) + literal rescues for dark-alpha; FIELD STAGE stays DARK cognac
   (`.arcfield.arcfield-warm .arc-detail-web-view` override + softened vignette per mockup .field-room;
   control-bar-inside-stage + renderer globals stay dark-appropriate); Read/Page frame warm; the
   S1-deferred `.arcfield-tidy-help`/`.arc-reset-btn` styling lands here.
3. **D4 (AF6).** views.js renderArcDetail head: add `.arcfield-headctl` wrapper w/ `.arcfield-addsub-canon`
   (+ Sub-theory, user-gated, all faces) + move faces seg into it; REMOVE header instance (12814-23),
   dead control-bar instance (12904-12), Page-face empty add (13334-43). Rail add-sub (12656-65) KEPT
   (mockup retains it, line 709/855). components.css `.arcfield-addsub-canon`.

## GATE (S2): umber literals confined to field-stage + visitor-room; warm-dim no inversion; AA pairs;
route-map diff = 0 lines; parse clean; Δ=0 frozen-3.

## Slice log — ALL PASS
- **Slice 1 (list light):** views.js className `arcs lum-amber`→`arcs lum-amber-deep`; appended
  `.arcs.lum-amber-deep` light block (re-point verbatim from home 11707-41 + D1 auto-fit grid +
  equal tiles + solid card + quiet-ink meta + light band). Old `.arcs.lum-amber` INERT (S6 sweep).
- **Slice 2 (interior warm-dim):** views.js className `arcfield lum-amber`→`+ arcfield-warm`; appended
  `.arcfield.arcfield-warm` block: warm full-bleed ground + `--lum-*` warm re-point SCOPED to chrome
  containers (head/rail/read/page) so the field stage (their sibling) keeps inherited dark tokens;
  seg/seg-opt literal rescues; field-stage cognac + softened feathered vignette (the ONLY umber block);
  D5 tidy-help/reset-btn styling (dark-stage) + D4 headctl/canon CSS.
- **Slice 3 (D4/AF6):** views.js renderArcDetail head → `.arcfield-headctl` (faces seg + canon);
  REMOVED header instance, dead stControlBar+addSubBtn, Page-face empty add; rail add-sub KEPT.

## Gates — ALL PASS
- parse: PARSE OK js/views.js (exit 0). state.js untouched in S2.
- bytes (git diff --stat): components.css +119 · views.js +114/−67 (net +47; −67 = removed 3 addsub sites).
- Δ=0 frozen 3: absent from diff. route-map object (umberGroundDark @373 / renderRoute fn): NOT in diff
  (2 diff hits were comment text only). ES3 scan: clean.
- D4 grep-proof: newSubTheoryBtn=0, addSubBtn=0, stControlBar code-refs=0 (comments only), addSubCanon +
  arcfield-headctl + arcfield-addsub-canon present.
- umber literals confined: only `#2f1c0e` + the `rgba(47,28,14)/rgba(74,49,25)` vignette, both inside
  `.arc-detail-web-view` field-stage block. warm-dim = NO inversion (ink kept #241710/#645940).
- CSS brace balance whole-file: 3298 open == 3298 close.
- AA: list --ink-2 #645940 on #fffdf8 ≈6.8:1; warm --ink-2 on #f6ecd4/#efe1c1 ≈4.6-4.9:1 (pass);
  ink-3 COLLAPSED to #645940 for text (avoids the mockup's ≈2.3:1 debt); ink-4 #978b6d = hairline/placeholder only.

## Self-red-team / residuals
- R-S2a: arc-voice inline box uses GLOBAL --ink/--surface-2 (S1 inline styles); reads dark-accented on
  the warm interior. Re-pointing globals would break the dark-stage renderer (reads global --ink-2/--sunk),
  so left. Minor Yumi click-to-reveal affordance. → felt-pass note.
- R-S2b: Read face still shows OLD content (cyan read-head, flat list) inside a warm FRAME — S3 rebuilds
  the Read spine. Transient/expected.
- R-S2c: `.arcs.lum-amber` dark block now inert → S6 dead-code sweep.
- R-S2d: whisper + read-head cyan stay cyan on warm (Yumi seam, covenant — intended).
- VISUAL GATE: the LOOK is unverified until Preston's felt pass on the DEPLOYED app (computed styles + token
  derivation are necessary, not sufficient).

## Commit
- LOCAL checkpoint, --no-verify (single sw.js bump at THE STOP). Explicit-file staging.
