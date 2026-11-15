# Praxis P2 — sixteenth sitting (28–30 Oct 2026): L1 felt passes, L1.2, L1.2c

Status: chat-side ruling record, continuing the fifteenth sitting (rulings 40–72). All at rec unless marked. Ground: praxis-v3.313 (1a74f48, L1.1) → v3.314 (94ebcb9, L1.2a) → v3.315 (b73459e, L1.2b), pushed and deployed 29 Oct. L1.2c (v3.316) is open: Stage 0 answered 30 Oct; the build is under way.

## A. L1.1 — gate, push, felt pass (28 Oct)

- L1.1's third red-team pass found a NEW family: Fraunces sets the Profile name wider than Cormorant did, so "D0 Tester" wrapped into `_pfPlaceInvite`'s invite. Ruled: `.pf-name` goes to one line with an ellipsis (plus `min-width:0` on its flex parents), and the truncation is logged as the residual **L1-NAME** for the profile round. The real fix is `_pfPlaceInvite` or the name layout. At 390 the name box is 108px beside the "preview as visitor" pill, so even "D0 Tester" shows as "D0 Tes…".
- L1.1 committed as 1a74f48 (hook passed against lumen-amber md5 ed83f972…; a stray hex in a comment was reworded, never --no-verify). The kit byte record is 14,983 B (−1,678); the checkpoint first said 14,977 and was corrected in L1.2a's commit.
- Preston's 28 Oct phone walk (24 screenshots, `felt-pass/l1-phone-28oct/`), compared against the Day Three mockup captured in both moods (`felt-pass/day3-mock-*.png`).

73. **L1.1's paint passes in both moods.** The day ground matched (#D7C38F in the app, #D7C390 in the mockup). Selected segments are ink fill with paper text, gold sits on the one primary pill, terracotta is Yumi's alone, and there is no error red anywhere. Search, the not-on-the-list card and the offline font check carried over to L1.2's felt pass.
74. F1 Profile header collision (the pen-name line and the invite overprint): `_pfPlaceInvite` excludes the header's box. The ellipsis stays.
75. F4 Profile category stat lines under floor (day 3.89 / 4.32 / 4.33; L1.2's Stage 0 found night at 1.01–1.46) → `--ink`. The dot and the bar keep the category colour (ruling 43's family).
76. F3 the capture door's Paste/Import glyph showed an empty box. Resolved in L1.2 as U+2B73 ⭳ → U+2193 ↓, which the self-hosted DM Sans draws.
77. F2 "[object Object]" on Profile → bisect; existed before L1 (corrupt stored value names via `normalizeValue`, R10 S1). Logged, no code.
78. F5 Yumi's opener clipped. Stage 0 called it "scrolls already", but the build found the real opener is the empty-state greeting, which was clipped at the top. Fixed with min-height.
79. **NEW LANE L4b, "the Day Three rooms"**: Search (r45), the lens page (r46), the category page (r47), the Notebook head and Settings link, the What Yumi Sees page, the bottom tabs and Search pill (the floating + retired). It sits after L4 and before L5. Order: L1 → L2 → L4 → L4b → L5 → L6 → L7b, with the Scan lane as before. Recorded in sequence.md by L1.2b.
80. The D-list gains four items. They take the NEXT FREE numbers, because l3.md's D9 and D10 already belong to the L1.1 contrast items: **D11** Home "117 books open" vs Shelf "112 reading"; **D12** a Journal note's page says "In the Inbox — not yet filed"; **D13** the "+ Add a book" pill overlaps the Education heading and the floating +; **D14** "[object Object]" (F2). The error-counts copy was checked against consent-copy.md item 9, matches word for word, and is not logged.
81. L1.2 = two commits in one chat (L1.2a fixes + the arc-route sweep; L1.2b the flat pass), one push, one felt pass.
82. **The beta ships the GARDEN lens palette only.** Galaxy and the "choose the hand" cards in the first walk are post-beta; rulings 48 and 49 are DEFERRED, not cancelled. L4 builds one palette, Settings drops its Lens colours row, and the walk drops the two cards. A lens keeps its shape, so a second palette can be added later without restructuring. This goes into L4's prompt.

## B. L1.2 gate rulings (29 Oct; full prompt in prompts/L1.2-felt-pass-fixes.txt)

- Stage 0 forks: **F-1** at rec, with a FORCED fixture proof (a profile built to collide at HEAD, shown colliding, then 0 intersections on both fixtures). **F-2** logged. **F-3** ↓ authorised as a one-character js edit. **F-4** = **NEW METHOD M9**: the Arcs list and the arc interior take the day token values in both moods (scope-pinned; theory colours untouched). The night Arcs list had read 1.01:1. M9 is written into docs/studio/v1-canon-delta-amend-1.4-corrections.md. **F-5 OVERRIDDEN**: next free D numbers (ruling 80).
- Also: the arc-field gold "1.82" premise was false (dead CSS, zero callers since 0759e09; recorded, not deleted). The sub-theory primary hover failed in NIGHT (1.49 → 9.52, two places). #profile overflowing below 364px existed before L1 (recorded). The Close section of the L1 prompt was given to the build chat and saved into the checkpoint.
- L1.2a gate: views.js +2,801 and theme.css +268 accepted as R74 work (every added line sits inside `_pfPlaceInvite`, its helper, the sky stash and the call sites, plus the R76 glyph). Five extra re-points to `--ink` approved under ruling 43: the shelf author line, the "from the arc…" line, the inactive Arcs sort buttons, "Illustrated example", and the sub-theory links / Open-questions names.
- L1.2b questions: **Q-A** keep `font-family:inherit`; `button{font:inherit}` dropped because it resized 88 controls (ruling A amended). **Q-B** titles → `--ink`; drawn marks (chevron, "taken" hatch) and the two scroll-edge fades kept; lines and marks flat in their own colour; glows → none unless they match a §1 light (none did; four "glows" were whole marks and became flat discs). **Q-C** the role token in both moods (23 surfaces). **Q-D** theory and camera gradients untouched. **Q-E** shadows → the canon §4 set (41 mapped, 12 kept). **Q-F AMENDED**: motion literals → `--dur`, `--dur-half` and `--ease`; loops of 600ms or more keep their durations; one global reduced-motion guard that SHORTENS (about 0.01ms, iteration 1) and never sets none; js/ has no end-event listeners.
- **TITLE-ROLE EXEMPTIONS** from DM Sans (written into the corrections doc beside M9): the shelf's category headings, the arc's question, its no-question fallback line, and the reader's carried question once written. These stay in the display serif.
- L1.2b result: blur 20 → 0; gradients 230 → 64 (canon §1's 7 lights, 7 kept marks and fades, 36 theory, 14 camera); 58 button rules to DM Sans; §5 clean on 18 routes in both moods apart from L1.1's ruled residuals. lumen-amber md5 is now 631bc2aa… (recorded in FIX-PROTOCOL §2 and PROTOCOL §6).

## C. L1.2 felt pass (29 Oct, v3.315; `felt-pass/l1-phone-29oct/`, 20 shots)

PASS: the ↓ glyph in both moods; Yumi's greeting shows whole; the day stat lines are ink; gold controls are flat (Add marginalia sampled #E8B23A at top and bottom in night, #D9931A in day); the palette matches the mockup. NOT YET WALKED: the #profile header on Preston's own account (the F1 proof), Profile stat lines in night, Search, the offline font check, the not-on-the-list card. These go on L1.2c's sheet.

Three new paint defects → **L1.2c (praxis-v3.316)**, prompt in prompts/L1.2c-paint-fixes.txt:
- **G1** In day, the strip behind the iPhone status bar read olive #675B41 on 5 of 7 screens. Shelf and Settings read #ECD79E. Content also scrolls under the clock.
- **G2** The Add-a-book radios render in iOS's system colours (a blue selected dot, black empty rings).
- **G3** The band under the Shelf's wheat stalks reads grey #524534 on the night card.

## D. L1.2c Stage 0 and rulings (30 Oct)

Recon: G1 is not `theme-color`, which holds #EDD79E. `#capScrim` (and `.shelf-manage-backdrop`) stay mounted on every route at opacity:0 but still carry `--scrim`. #EDD79E under it computes to #685B41, one level from the phone's olive, so the inferred cause is the browser's status-area tint sampling a closed scrim (an iOS sampler can't be proven on the Windows rig). With an emulated 59px inset, `#statusbar-scrim` already covers the zone, so the under-the-clock scroll did not reproduce. That suggests the phone was a Safari tab (inset 0). Shelf and Settings reading clean is unexplained. G2: three native inputs on `--page-3`; the day labels are 4.07:1. G3: the band is `--ink` at 22% over `--page`, which flips with the mood.

Ruled (go given, 30 Oct; build BOTH status-bar fixes so the answer doesn't matter):
- **C-1** the safe-area band paints `--page` only where `env(safe-area-inset-top) > 0`. It sits BELOW every open scrim or sheet (it dims with them) and takes the camera's sky over Scan (r62).
- **C-2** closed scrims → `visibility:hidden` with a transparent background; open restores both and keeps the fade. Proof: the census of fixed top-edge elements with a non-transparent background while closed = 0.
- **C-3** custom radios with `appearance:none` (13px box, native inputs kept): ring `--ink-2`, checked `--ink`, labels `--ink`, a visible `:focus-visible`, the ring ≥3:1 on `--page-3`.
- **C-4** `--wheat-soil-2` = `--sky` at 22%.
- fix-red-team on the recon first, then build to the L1.2c commit gate. The felt-pass sheet gains "Opened from: Home Screen icon or Safari tab".

## E. Asked and answered

- App Store updates (29 Oct): Praxis ships BUNDLED (Capacitor, L7a), so app-side changes need a new build through TestFlight and App Store review (often about a day). Server-side changes (Netlify functions, Firebase rules, Yumi prompts) are instant. L7b may include a one-command release script, and Xcode Cloud is an option. Live-update services are possible later; decide after launch.
- When the sky and flowers arrive: L4 (lens engine + sky), two lanes after L1.2. The L2/L4 order is an open fork for L1's close-out.
