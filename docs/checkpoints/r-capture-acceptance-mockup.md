# R-CAPTURE acceptance — SHAPE-B mockup

Surface walked: **true-390** (primary, DOM-geometry via the localhost static rig, SW-cleared) + **1360** + **1920** corroboration. Live pixels are Preston's felt pass (L10 — cannot be simulated; the Browser pane could not composite screenshots this session and a fresh headless Chrome was environment-blocked, so all evidence here is DOM-geometry + computed-style, never a claimed look).
Base commit: 09ba14d   Date: 2026-07-23   Session model: Opus 4.8 (mockup built by studio-mockup / Sonnet, per Model Law v2)
Artifact: docs/studio/mockups/capture.html (76,770 B) · ledger docs/studio/capture.md

Row states: PASS (mockup evidence) · DEFERRED-TO-BUILD (law is a build-stage gate; owning lane named) · OWNER (felt — left blank for Preston, L10).

| # | Law sentence (verbatim, brief §3) | State | Evidence |
|---|-----------------------------------|-------|----------|
| 1 | **<400ms LOCAL-FIRST** — engineered AND perf-gate-measured, including with any carrying-question or association context present: no new pre-keystroke work, ever. | DEFERRED-TO-BUILD (Lane 1 perf gate) | Mockup shows the structural precondition: the sheet + hero field are pre-rendered and the field is present in one frame (hero `textarea`, `font-size:16px`, in-viewport at 390 top 572). No network in the mockup at all (voice/paste simulated, capture.md data-findings). The measured <400ms number is a Lane-1 build gate against the recon's floor (Book-Detail Add-marginalia, the tightest synchronous chain). |
| 2 | **RAW JOINS THE CORPUS** — under success and under failure (CA-2). | DEFERRED-TO-BUILD (Lane 1 persistence + Lane 2 voice) | Mockup shows commit→file success (File it → caught list + save pulse) and the never-silent chip. The failure-law wiring (per-tab per-uid draft gate `praxis_nb_draft_<uid>_<activeKey>`, voice loss-window bound) is Lane-1/2 build, red-team-targeted. |
| 3 | **ONE DOOR** — one component everywhere; new entry points seat into it. | PASS (structural intent) | One `.capdoor-sheet` component carries all 5 modes (Note/Voice/Paste-Import/Photo·seat/Scan·seat); nav `Capture` entry (`cap-n`), the `+` corner, and the Book-Detail `✎ Add marginalia` seam all summon the same component. The build unifies the four bespoke UIs (census §1) — verified at build, not mockup. |
| 4 | **⌘Enter commits, Enter = newline. Input debounced.** | PASS (UI shown) / DEFERRED-TO-BUILD (keybinding + debounce) | Commit control `File it` [capdoor-commit] present; ⌘Enter/Enter split + input debounce are Lane-1 wiring. |
| 5 | **Titleless embers + rename** (inherited, R-ARC F-A). | DEFERRED-TO-BUILD (inherited) | No title field in the sheet — capture is titleless by construction; rename is inherited R-ARC behavior, not re-specified here. |
| 6 | **F-B: delete terminal, forward acts only.** | PASS (CA-1 shown) | The CA-1 "Carry on the desk" bridge is a forward act; un-carrying = clearing (desk-question × clear), not undeleting. Terminal-delete discipline is inherited. |
| 7 | **Raised-hand Yumi** — the sheet never speaks unbidden; Yumi adds nothing the user didn't write; only stops for the ambiguous. | PASS (structural) | The sheet contains NO live Yumi chrome — only the inert CD-4 talk-it-through seat ("arrives with the YG round", `capdoor-seat-btn`, static-by-design). No unbidden speech surface exists in the component. |
| 8 | **Never-asked-never-forbidden.** | DEFERRED-TO-BUILD | Behavioral law; no mockup surface to walk. |
| 9 | **OB L-1 pairing** — first-run's first ember is PLAIN capture — never basin/create, no Room landing. | DEFERRED / RULED-FUTURE-STATE | Preston ruled (2026-07-23) **hold-as-future-state**: R-CAPTURE builds the door only; onboarding rewire is a §7 non-goal; OB L-1's neutral framing is carried as a future ONBOARDING-round requirement (recon §7 contradiction, mismatch #1). |
| 10 | **Universal tokens + ES3.** | PASS (tokens) / DEFERRED-TO-BUILD (ES3) | Token discipline verified: 299 `var(--…)` uses; canonical values wired (`#fffdf8`=--card, `#f4efe4`=--paper, `#d9a441`=--gold-hi, `--ink-2/-3`, `--field-*`, `--scrim`). ES3 is an app-code floor for the build, N/A to the standalone mockup's JS. |

**Composition-at-widths (DOM-geometry, this session):**
- 390: sheet = full-width fixed bottom sheet, open `translateY(0)` → bottom-anchored (bottom=844=H), 458px/54vh, top-radius 16px, `#fffdf8` over scrim opacity 1; hero field in-viewport (16px). Closed rest = below fold. **0 h-overflow.**
- 1360: sheet = card at `+` origin (x24 y426 395×404), `#fffdf8`, scrim `rgba(15,9,4,.6)`, z 10020/10021; both corners (+ x24 / flower x1279, 42×42); CA-1 desk question row (own block, y927 h26). **0 h-overflow.**
- 1920: card anchors as popover (x24 y571 420×430), no reflow; corners x24 / x1839. **0 h-overflow.**

**OWNER felt-call rows — RULED (Preston, 2026-07-23, mockup felt pass = PASS by sight):**
- [x] **Ground** — RULED: **LIGHT as built.** Warm-dim retired.
- [x] **Scrim-click** — RULED: **CD-5 explicit-close as built.** Build wires the override.
- [x] **CD-2 two-size sheet** — RULED: **STANDS.** ⚠ DEFERRED CHECK: the true 390 bottom-sheet felt verdict is taken at the FINAL live pass on Preston's **actual phone** — a stated check in the final felt script, not re-opened before then.
- [x] **CA-1 tap-grammar** — accepted as shown; the true-phone read rides the same final live pass.
- [x] **"Carry on the desk"** — RULED: **STANDS as shown (not a second door).**

**Flags carried in (from recon/shaping):** OB L-1 contradiction (ruled hold-as-future-state); CD-1 bottom-left corner is net-new global surface (not a generalization of `.shelf-add-primary`).
**Flags carried out (new, non-law):** **FORK — scrim-click-to-close.** ImportCapture's live overlay closes on scrim-click (import-capture.js:409); CD-5 rules close as explicit-only. The mockup implements CD-5 (scrim-click nudges the veil, does not close) and flags the collision verbatim for Preston / the build round to re-confirm before wiring over live ImportCapture.
