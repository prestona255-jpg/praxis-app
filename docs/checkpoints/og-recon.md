# OG1–OG4 + IA4 — honest front door — RECON

OG STARTED @ HEAD e861d59 / cache v3.182. Read-only recon, all anchors verified against live source this session.

## Auth predicate
`getCurrentUser()` (integrations.js:632) = `ls('praxis_user', null)` → **null when signed out**. Every branch below keys on it. Matches the existing signed-out gates (buildNotebookSignedOut, renderArcsPage:3463, renderAccountPage:17067).

## Reusable primitive (no new CSS/UX — "build NO new first-run UX")
`buildSignedOutPrompt(headline, copy)` (views.js:1836): `.empty-state` card, real shared Yumi crest (`yumiGlyphNode`), `.btn btn-primary` → `signInWithGoogle()`. Twin of `buildNotebookSignedOut`. This is the honest CTA primitive reused everywhere below.

## Anchors (all confirmed at stated lines — no post-NB1 drift)

### Slice A — renderHome (views.js:1413) — OG1, OG4, OG2(greeting)
- `wTitle.textContent = 'Welcome back.'` (**:1429**) fires unconditionally — no auth check anywhere in renderHome. Signed-out + new users both see "Welcome back."
- Dead dashboard widgets for empty/signed-out: field stat `'No arcs yet'` (**:1482**), reading stat `'Nothing open right now'` (**:1544**).
- FIX: at top of renderHome, branch on `getCurrentUser()`.
  - **Signed out** → append honest front door into the `home-page lum-amber-deep` wrap: a welcome hero + `buildSignedOutPrompt('Welcome to Praxis', <honest copy>)`, `host.appendChild(wrap)`, **return** — skips the fake dashboard entirely (kills OG1 + OG4 + fake avatar-context for signed-out).
  - **Signed in** → existing render, but honest greeting: `wTitle.textContent = (haveArcs || hasShelf) ? 'Welcome back.' : 'Welcome to Praxis.'`; `hasShelf` = user has ≥1 shelved book (`state.userBooks[uid].bookIds.length > 0`). Fixes "Welcome back" for a brand-new signed-in account.

### Slice B — nav profile populate (views.js:436-461) — OG2
- Signed out today: `initialEl` → `'P'` (:439-445), mobile `navNameEl` → `'Your account'` (:453). Static sublabel `.app-nav-profile-account` = "Account" (index.html:34). Reads "already logged in."
- FIX (text-only, routing untouched → lowest risk): when `navUser` null →
  - `initialEl.textContent = ''` (no fabricated P)
  - `navNameEl.textContent = ''`
  - `.app-nav-profile-account` → `'Sign in'`; link `aria-label` → `'Sign in'`
  - When signed in, explicitly restore sublabel `'Account'` + aria `'Account'` (block re-runs each renderRoute → both branches must set, no stale text across a sign-out→sign-in cycle).
- Click still routes `#account`, which renders a clean sign-in (views.js:17067-17091, verified). No onclick rewire.

### Slice C1 — renderArcsPage (views.js:3413) — OG3
- `arcsUser = getCurrentUser()` (:3463). When null, the "Your arcs" block (:3464-3544) is skipped; page shows header/teaching + "Arcs to learn from" examples (:3546-3641) with **no CTA**.
- FIX: after examples section append, before `host.appendChild(wrap)` (:3641), `if (!arcsUser) wrap.appendChild(buildSignedOutPrompt('Build your own arc', <copy>))`.

### Slice C2 — renderArcDetail seed-arc interior — OG3 (the primary shareable payoff)
- Seed arc (`arc.userId === '__praxis_seed__'`) bypasses the gated-arc branch (:12040 condition false for seed) → renders the full interior to a signed-out visitor with no "sign in to build your own" CTA. The `Sign in` CTA at :12047-12054 only fires for a signed-out user on a NON-seed (private) arc.
- FIX: at the end of renderArcDetail, when `arc.userId === '__praxis_seed__' && !getCurrentUser()`, append `buildSignedOutPrompt('Build your own arc', <copy>)` to the interior wrap. Exact append point resolved at build (read the wrap→host tail).

### Slice D — intros.js onNext (intros.js:386) — IA4
- `onNext()`: on `release` kind → `markSeenAndClose()` → `closeJourney()` (:435) which routes NOWHERE — the completed new user is left on Home (the overlay's host). Trigger `maybeStartOnboarding` (yumi-ui.js:836) opens the journey as a body overlay and never force-routes Home; yumi-ui.js:844 is only the arc-route suppression guard (no fix needed there).
- `markSeenAndClose` is ALSO called by the welcome-skip (:393) → do NOT route in markSeenAndClose; route only in the release branch of onNext.
- FIX: in onNext release branch, after markSeenAndClose(): `var dest = (picked && picked.bookId) ? '#book/' + picked.bookId : '#notebook'; if (location.hash === dest) { if (typeof renderRoute==='function') renderRoute(); } else { location.hash = dest; }`. `picked.bookId` = the book shelved during the act-shelf step (:353/:361, `doShelve` return); absent → `#notebook`. Guarded, runtime-only (renderRoute defined by load order at click time).

## Scope / files
- js/views.js (Slices A, B, C1, C2), js/intros.js (Slice D). index.html NOT edited (sublabel set via JS). sw.js cache bump v3.182→v3.183. docs/LAUNCH-STATUS.md ledger (OG1-OG4 + IA4). Checkpoint files.
- ES3: all-new code is var/function/string-concat only; reuses existing helpers.
- NON-GOALS: no new first-run UX system; no data-model/state/auth change; visibility-toggle bug untouched (moved to register redesign); nav stays solid/no-blur (canon).

## Byte floors (FLOORS, agent estimates run ~2× low)
- views.js: +1200 B floor (Slices A signed-out branch + greeting, B nav both-branch, C1, C2).
- intros.js: +250 B floor (Slice D).
- sw.js: +0 (version string equal length).

## Recon-gate note
Every anchor was read directly from source and quoted with file:line; premises verified against the actual render code (not memory/docs). Presentational, non-data-loss. Per FIX-PROTOCOL the §9 fix-red-team runs post-build and WALKS the signed-out + new-user paths (queue gate) — it also serves as the adversarial validation of this approach; a recon-level miss surfaces there as a gate failure.
