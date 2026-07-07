# Pass 3 — LANE C: Structural / IA (§3e)

*Read-only audit lane, run `wf_75daf543-b02`. HEAD `a92c499` / `praxis-v3.180`. Findings only — no code changed. References (not re-files) prior Pass 1/2 ids.*

---

# Fable Audit â€” Pass 3 Â· Lane C: Structural / IA (Â§3e, P1/P2)

**Ground truth (re-established this run):** HEAD `a92c499` (charter's `aa730e5` +7 commits) / CACHE `praxis-v3.180`. All Pass-3 surface files (`js/views.js`, `assets/components.css`, `theme.css`, `assets/*`) are BYTE-UNCHANGED since the charter SHA per step-1 recon, so every line anchor below is valid. Read-only; no app file changed (one agent-memory note added).

**Method:** traced `renderRoute()` (views.js:343-694), the static nav (index.html:20-38), `renderArcsPage` (3413-3642), `_searchBuildIndex`/`renderSearch` (742-1016), the social entry points (17183-17196, 16322-16815), `maybeStartOnboarding` (yumi-ui.js:836-854) â†’ `Intros.startJourney`/`markSeenAndClose` (intros.js:279-398), and the mobile nav CSS (components.css:5387-5406). Prior-pass ids referenced, not re-filed.

## Coverage matrix â€” surface Ã— IA dimension

`F#` = ledger row Â· `CLEAN` = examined, no new IA finding Â· `refs` = covered by a prior-pass id.

| Surface | Nav coherence | Findability (reach) | Orphan / dead | Redundant path | Onboarding handoff |
|---|---|---|---|---|---|
| **global / top-nav** | IA2 IA7 | IA1 | â€” | â€” | â€” |
| `#home` | CLEAN | CLEAN | CLEAN | IA3 (whole-fieldâ†’single arc) | IA4 (journey lands here) |
| `#books` shelf | CLEAN (nav slot) | CLEAN | CLEAN | CLEAN | â€” |
| `#book/<id>` | CLEAN (sub of Shelf) | CLEAN | CLEAN | CLEAN | â€” |
| `#book/<id>/marks` | CLEAN | CLEAN (from book detail) | CLEAN | CLEAN | â€” |
| `#artifact/<id>` | CLEAN (sub of Shelf) | CLEAN (openLink 7839) | CLEAN | CLEAN | â€” |
| `#arcs` | CLEAN (nav slot) | CLEAN | CLEAN | **IA3 (auto-open NOT reproduced)** | â€” |
| `#arc/<id>` Field | CLEAN | CLEAN | CLEAN | refs AF6 | â€” |
| `#subtheory/<id>` Read | IA6 | CLEAN | CLEAN | refs AF1 | â€” |
| `#subtheory/<id>/build` | IA6 | CLEAN | CLEAN | refs AF1/AF6 | â€” |
| `#notebook` | CLEAN (nav slot) | CLEAN | CLEAN | CLEAN | IA4 (not deposited here) |
| `#account` | CLEAN (avatar slot) | CLEAN | CLEAN | IA8 (dup identity) | â€” |
| `#profile` | IA2-adjacent (buried) | CLEAN (from Account) | CLEAN | IA8 (dup identity) | â€” |
| `#about` | IA7 (over-weighted slot) | CLEAN | CLEAN | CLEAN | â€” |
| `#yumi-sees` | CLEAN (Yumi-panel entry) | CLEAN (FAB works mobile) | CLEAN | CLEAN | â€” |
| `#commons` | **IA2** | **IA2** (2 levels under avatar) | CLEAN | CLEAN | â€” |
| `#reader/<uid>` | **IA2** | IA2 (only via #walk/#commons) | CLEAN | CLEAN | â€” |
| `#walk/<arcId>` | **IA2** | IA2 (via commons cards) | CLEAN | CLEAN | â€” |
| `#search` | **IA1** | **IA1 (mobile-orphan)** / IA5 (index) | **IA1 on mobile** | CLEAN | â€” |

## Ledger

| id | Surface | Issue | Sev | Type | Effort | File:Line | Fix direction |
|---|---|---|---|---|---|---|---|
| **IA1** | global / `#search` | Global Search is UI-unreachable on mobile: only entries are the `.app-nav-search` pill (hidden `display:none` <760px) and âŒ˜K (no touch keyboard); the hamburger menu is only the 6 `.app-nav-list` links. A whole surface is orphaned on phones. | should-fix | bug | small | components.css:5400; index.html:26-38; spotlight.js:432-444 | Add a Search entry (or search icon) to the mobile hamburger menu that routes to `#search`. |
| **IA2** | `#commons`/`#reader`/`#walk` | The entire social-discovery layer is buried two levels under the avatar (Account â†’ "Explore the commons â†’"); no top-level surface and every social route sets `activeRoute='account'`. This is the maker's Â§3e promotion ask. | should-fix | redesign | medium | views.js:398-407, 17196; index.html:26-31 | Promote Commons to a first-class nav link like Shelf; the router 'commons' branch already exists, so the reach is: one nav `<li data-route="commons">` + a new `activeRoute` case. |
| **IA3** | `#arcs` | The maker's "#arcs auto-opens one specific arc" friction is NOT reproduced at HEAD â€” `renderArcsPage` renders a genuine overview (header + "Your arcs" grid + examples), no redirect. Closest live analog: Home's whole-field tap (`homeFieldNav`) opens a single arc, and a zero-arc user's whole field opens the seed arc. | nice-to-have | polish | trivial | views.js:3413-3642 (clean); analog views.js:1264-1278 | No arc-page fix needed; if the perception persists it traces to the Home whole-field tap â€” label/soften that instead. Correct the stale friction note. |
| **IA4** | onboarding â†’ core loop | The guided journey's final "Enter Praxis" step calls `markSeenAndClose`â†’`closeJourney` with NO navigation, dropping the user wherever they were (Home from the auth callback), not into the Notebook or the book they just shelved. Plus OG6: arc-route entrants get no onboarding at all. | should-fix | gap | small | intros.js:387,279-288; yumi-ui.js:844 | On release, navigate the user to the live writing loop (e.g. `#notebook` or the shelved book) so onboarding hands off into the core loop; connect to OG6. |
| **IA5** | `#search` | Search indexes 4 kinds (arcs/subs/books/notes) but omits artifacts (finished rooms) and marginalia/marks, and note hits route only to `#notebook` (no per-note anchor) â€” a matched note text can't actually be located. Incomplete index. | should-fix | gap | medium | views.js:742-875 (note route:870) | Add artifacts + marginalia to `_searchBuildIndex`; give notes a deep-link target (e.g. a notebook anchor) so a note hit lands on the note. |
| **IA6** | `#arc`/`#subtheory`/`/build` | The arc's three faces (Field / Read / Build) carry no breadcrumb or wayfinding, so on top of AF1's three edit-doorways the user can't tell where they are in arcâ†’sub-theoryâ†’build. | should-fix | redesign | medium | views.js:8883-9063 (bare read, refs AF2), 10522/12628 (refs AF1) | Add a consistent arcâ†’sub-theory breadcrumb/eyebrow across the three faces; resolve alongside AF1's single-editor collapse. |
| **IA7** | top-nav | Nav real-estate weighting is off: static `#about` holds a permanent top-nav slot while Search, Profile, and the whole social layer have none. Top-level priorities don't match how the product wants to be navigated. | nice-to-have | polish | small | index.html:26-34 | Re-weight the nav: consider demoting About into Account/overflow and elevating Search or Commons. |
| **IA8** | `#account` + `#profile` | Two identity destinations â€” the Account portrait and the own-Profile â€” both present galaxy/identity content; unclear which is the canonical "you," and the galaxy is duplicated (refs PA4/PA5). | nice-to-have | redesign | medium | views.js:17183-17196 | Merge or clearly differentiate the two identity surfaces (Account = settings, Profile = public view); dedupe the galaxy per PA4/PA5. |

## Owned deferred items â€” resolution

1. **"#arcs auto-opens one arc"** â†’ **IA3: NOT reproduced.** `renderArcsPage` (3413-3642) is an overview; router `#arcs` block (572-583) has no redirect; cold-open defaults to `#home` (app.js:15-16). The maker's note is stale; the live analog worth noting is the Home whole-field tap.
2. **Social-discovery promotion** â†’ **IA2: real, and cheap.** All three social routes fold into `activeRoute='account'` (398-407) and are reached only from Account-page links (17196) or intra-social back-links. Promotion reach is small because the 'commons' router branch already exists (649-655): it needs a nav `<li>` + an `activeRoute` case, not a new surface.

## Honest residuals / not-examined

- I did NOT drive the live app (read-only source trace); the mobile-orphan (IA1) and journey-handoff (IA4) are OBSERVED in source/CSS but a device smoke would confirm no other hidden mobile entry exists.
- Deep social graph reach (follower lists â†’ #reader) traced only enough to confirm reachability; I did not enumerate every inbound edge.
- Charter Â§6 do-not-flag respected: I did NOT flag opening #commons to signed-out (deferred security item); IA2 is about NAV promotion within the signed-in app only.
- Prior ids referenced not re-filed: AF1, AF2, AF6, PA4, PA5, OG6, H4.

## Canaries suspected

- **IA1 (mobile Search orphan)** â€” a whole surface unreachable on the primary launch device is exactly the kind of known-but-withheld issue Â§5 describes.
- **IA5 (incomplete search index / no note deep-link)** â€” a plausible withheld findability gap.
