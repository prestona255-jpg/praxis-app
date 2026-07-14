---
surface: profile
route: "#profile"
render_fn: renderProfilePage (js/views.js)
ground: dark-hero / light-below (§7 ground spectrum)
in_nav: yes (nav avatar → #profile; #account redirects)
state: shipped — MERGED Profile (Account collapsed in)
rounds: 2
desktop: native
---

## State

`#profile` → `renderProfilePage`. The single merged Profile (R9a). `#account` → `location.replace('#profile')`
(the R7 /marks precedent); the nav avatar points `#profile`. Owner-only surface with a within-page
"preview as visitor"; the real visitor route stays `#reader/<uid>` → `renderOtherProfile` (unchanged).
Old `renderOwnProfile` / `renderAccountPage` retired **defined-but-unrouted** (~2060 L — S-B deletion debt).

Anatomy: a galaxy hero (bright stars = sub-theories · soft planets = categories sized by books · faint field
= books read · tappable values strip · clickable counts · uncarded thesis), then a containment-card system —
Statement → Values → By-the-numbers → Open questions → Now → (DNA carry: returns/journey/reader-model) →
Published (3-up closing band) → Settings. At ≥1200 the meaning split (voice column / Numbers rail) — the
project's FIRST desktop composition tier. Owner-vs-visitor is a CONTENT fence (`.pf-owner-only` + `.is-visitor`).

## Decisions

- **A1 merge** — one Profile at `#profile`; `#account` redirects; nav avatar repointed. `#reader` unchanged.
- **AM8 (the ONE persisted addition)** — `profile.statement`, migration 1.29.0→1.30.0 + the Firestore twin
  (read-merge + write `.set()`). Everything else DISPLAY-ONLY aggregation over existing data.
- **Owner-vs-visitor = content rule** (fencing), not a layout switch.
- **Value-load EVIDENCE-WEIGHTED** (tier w1–w4 from why-lines + drawing subs), never a printed count (A4).
- **Ground spectrum** — dark-warm galaxy hero feathered into the light below (§7).
- **"arcs" replaced "passages"** as the 3rd By-the-numbers stat (no distinct passages store).
- **Condition-1** — every carried handler re-renders `renderProfilePage`, never the retired renderers
  (`buildReaderModelSection` parameterized with a `rerenderFn`).
- **F1 accepted** — the light-skin re-point matches the shipped light surfaces (R5 Arcs); tokenize app-wide
  is S-B debt.
- **[R9b] Wheel amendment (v3.201)** — the galaxy's field hues are a **diverse muted full-spectrum wheel**
  (`--pf-hue-1..10`, amber/terracotta/rose/plum/slate/teal/sage/olive/clay/steel), not a single warm ramp.
- **[R9b] P1 curated category→wheel hue map (Preston's ruling A, v3.202)** — `_pfFieldHueIdx` consults a fixed
  17-category `_PF_HUE_MAP` (hash fallback for unknown): the 10 common categories on distinct slots, warmest→
  most-read, and **slate = Technology & Society only / steel = Religion & Spirituality only** (the "two grey-blue
  planets" separated). Set-independent lookup → honors the per-slug determinism law.
- **[R9b] One hue system app-wide (P4)** — sky planets · Numbers · Published · Arcs · gaps · value-sublinks all
  resolve a category through `_pfFieldHue`/`_pfFieldHueDeep` (Published+Arcs repointed off `_pfCatHue`). A category
  is ONE colour everywhere. AA: all 10 wheel deeps 5.11–9.15 on both light grounds.
- **[R9b] Dominant label off the sigil axis (P2/P3)** — the dominant category label is placed BESIDE the sigil at
  a font sized to fit the roomier side (cap 19px, floor 11px) so it clears the identity mark's vertical axis at
  every width + name (incl. a 26-char dominant on mobile); the mark stays uncaptioned.
- **[R9b] teal → gold reader-model accents (P9)** — col-header / will-checkmarks → `--gold-deep`, save/add buttons
  → gold gradient; `.rm-panel-title` ("What Yumi remembers") KEPT teal as the one Yumi-voice element (cyan=Yumi-only).

## Gap ledger

- [status: CLOSED v3.198] PA3 — the deferred-social em-dash placeholder is gone (renderOwnProfile retired;
  the merged Profile renders honest states).
- [status: OPEN — S-B] tokenize the shared light-skin literals app-wide (3 surfaces share them).
- [status: OPEN — data-hygiene] duplicate-lens DATA records (surfaced by P3; display-deduped only).
- [status: FELT-FLAG R9b] P1 slate + steel stay blue-family-adjacent — a Technology & Society + Religion &
  Spirituality reader sees two DISTINCT blues (not identical); reassignable in one `_PF_HUE_MAP` line if a
  re-pass wants more separation. (Preston's deployed re-pass = FULL PASS as-is.)
- [status: FELT-FLAG R9b] P5 n=1 published is left-aligned + contained at 600px (void on the right only); P7
  desktop-density hug is conservative (20→15px on thin DNA cards). Both passed the deployed re-pass.
- [status: OPEN — carried] arc-constellation label tap ~15px (<44px) — a redundant secondary affordance; a 44px
  rect would re-introduce the closed sky collisions. Kept small; flagged.
- [status: OPEN — RT#3 residual] transient star-sweep graze — a non-central label's top can be brushed by a star
  core at the exact south orbit angle between samples; below sampling resolution; 0 at rest + the sampled phases.
- [status: OPEN — BETA-READINESS] commons `#reader` DRAFT-sub-body exposure (`integrations.js:2456`) — a
  commons-published arc projects the `bodyPublic` of DRAFT-status subs the profile's own fencing would hide.
  Data/commons concern, NOT the profile's to fix; folded into the BETA-READINESS gate (R11-adjacent).

## Round history

- **R9a — MERGED Profile / Galaxy — SHIPPED v3.198 (`e25ac6f`) + patch v3.199 (`6e96d5b`), 2026-07-12.**
  Deployed felt pass = STRONG PASS; live smoke on `prestonpraxistest` PASSED IN FULL (statement Firestore
  round-trip · retrofit accept · visitor fencing · 8-fix spot-check desktop+390). Both gates cleared
  (fix-red-team no-block; praxis-reviewer HOLD→3-fixed). The v3.199 patch cleared 8 deployed defects (DNA
  data-shapes, widened collision proof, lens dedup, shelf-filter links, header/chevron/excerpt/thesis-omit).
  **Reversals:** Numbers pulled forward (AM11) · lens axis restored (AM44) · "arcs"→"passages" · Published
  re-homed (AM41) · thesis uncarded (AM29) · AM45+sky-lens re-opened. Records: `docs/checkpoints/r9a-*.md`.
- **R9b — arc layer + galaxy depth (TWO LANES + felt-pass patch) — SHIPPED, deployed re-pass = FULL PASS.**
  Lane P v3.200 (question-led arcs · public lineage · Now richness · published quality pack · DNA re-slot ·
  faint-default value web). Lane G v3.201 (sigil-galaxy center + lensing · CSS-only motion + presence + sparse ·
  diverse muted hue wheel + owner sky lens-mode · in-galaxy selection panel · published-arc constellations +
  interaction map · teal→gold). **Felt-pass patch v3.202 (`e73e994`, 2026-07-13):** P1 curated hue map · P2
  dominant off-axis · P3 sparse balanced spread · P4 one hue system + catcard wrap · P5 no "Untitled" +
  contained n=1 · P6 lineage adjacent (desktop) · P7 desktop density · P9 reader-model teal→gold · P8 h-scroll
  verify. Gates: praxis-reviewer ×2 CLEAR; fix-red-team BLOCK→FIXED (dominant off-axis at every width). Records:
  `docs/checkpoints/r9b-laneg*.md` + `r9b-laneP*.md`.

## Next

- **DW-1..3 (Desktop Wave)** touches profile at ≥1200; **S-B** deletes the ~2060-L old profile renderers
  (defined-but-unrouted) + tokenizes the shared light-skin literals. No dedicated profile round is on-deck —
  the surface is shipped; DW + S-B are its next touches. (See `sequence.md`.)
