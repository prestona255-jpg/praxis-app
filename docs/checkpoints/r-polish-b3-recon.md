# R-POLISH B3 — STAGE 0 RECON

Model: Opus 4.8, default effort (ultracode OFF per Preston) · gate agents Sonnet ·
base HEAD `989e175` (v3.233)

## VERDICT: **HALT** — 1 dead anchor + 1 frozen-gate collision (both named halt conditions)

Everything else in both lanes is cleanly anchored. No code written.

---

## 0.1 · Gates — ALL PASS

| Check | Result |
|---|---|
| HEAD / `origin/main` / `refs/remotes/origin/main` | `989e175…` ×3 — **TRIPLE MATCH ✓** |
| tracked dirty | none |
| untracked strays | 103 (unchanged) |
| live `sw.js` ×2 cache-busted | **`praxis-v3.233`** both, agree |
| `assets/marks.js` byte-lock | 10,255 B — EXACT |
| `assets/lumen-amber.css` byte-lock | 14,681 B — EXACT |

Baselines: `components.css` 748,836 B / 15,333 L · `theme.css` 36,485 B / 702 L ·
`views.js` 1,023,857 B / 22,371 L · `arc-constellation.js` 82,923 B · `room-field.js`
14,906 B · `praxis-kit.css` 15,285 B · `index.html` 7,939 B · `sw.js` 4,837 B.

---

## BLOCKER 1 — FROZEN-GATE COLLISION · AES-1 has TWO glow mechanisms, not one

The glows are not one system. They are two, with different reachability.

**Mechanism A — the Field's own halo. CLEAN, no frozen edit needed.**
`arc-constellation.js:871` (muted) / `:882` (colorful) emit, per mark, a bare
`<circle r="54" fill="var(--subtheory-N)" style="filter:blur(9px)">` as the first child of
the mark group. `fill` is a **presentation attribute**, so CSS wins — the same lever that
closed R1 in B2 without touching the locked renderer. Reachable via a structural selector
(`.st-drift > g:not(.st-layer-dots) > circle:first-child`). **Buildable.**

*Important sub-finding:* there is **no separate gold/ember channel on marks today.** The
halo's opacity is `lum = _stLuminosity(sub.maturity)` (0.32–0.62), and maturity is
**annotation density** (`views.js:12362`), not touched-today. Hue and density are welded
into one value. "Retire the per-hue glow, keep the gold presence channel" therefore means
*splitting* one declaration into two: fix `fill` to gold, keep `opacity` varying by `lum`.
That is a real behavior decision, not a recolor.

**Mechanism B — `PraxisMarks` glow. COLLIDES WITH A BYTE-LOCK.**
Used by the Arcs-list card thumbs, other-profile thumbs, and every `bookSubMarkHTML` site —
architecturally separate from the Field. `marks.js:96` stamps a **literal hex** into an
inline `style="--mk-glow:<hex>"`, and the paint lives at
**`lumen-amber.css:177`** — `.lum-mark > .g{ background:radial-gradient(circle, var(--mk-glow) 0%, transparent 68%); opacity:.55 }`.

The clean one-line fix (drop the `var(--mk-glow)` read, point at a gold token) requires
editing **`assets/lumen-amber.css`, which is byte-locked at 14,681 B** — a persistent
foundation invariant, and one your B3 GO did not name among the frozen files. Per THE FORK
RULE this is your call, not a mechanical determination. Three options:

1. **Re-baseline the `lumen-amber.css` byte-lock** for this build (one-line edit, recorded).
2. **Leave Mechanism B untouched this round** — the Field's marks lose their halos while
   Arcs-list and other-profile thumbs keep theirs. Splits the felt canon row
   ("marks are jewels, not stickers") across surfaces.
3. **`!important` override from an unfrozen file.** Legal cascade (author `!important` beats
   inline), but fragile and against house style. Not recommended.

## BLOCKER 2 — DEAD ANCHOR · AES-5a "cover dog-ear artifact"

Exhaustive, case-insensitive `dog.?ear` across the whole repo — `js/`, `assets/`,
`design/`, `docs/` — returns **zero hits**. `components.css` contains **zero `clip-path`
declarations** anywhere. The two nearest candidates were inspected and ruled out:
`.shelf-book-rmark` (`components.css:12298`) is a `border-radius:50%` gold dot (the alight
indicator), and `.register-glyph-wrap` (`:2320`) has **zero JS call sites** — dead code.

There is nothing named "dog-ear" to retire. Either it is a mockup-only concept never built,
or it is your term for something I have not identified. **Point me at it on the live page
and I will retire it; I will not guess at a visual and delete something else.**

---

## SCOPE SURPRISE (not a halt, but the brief mis-sizes it) — AES-4

The GO reads as a swap: native `<select>` → "the kit's custom listbox". **The kit listbox
has zero behavior.** `praxis-kit.css:81-86` defines `.k-listbox / -btn / -pop / -opt` as
pure presentation — `.k-listbox-pop` even ships `display:none` with no toggle rule — and
**`grep "k-listbox" js/` returns zero matches app-wide.**

So CC-1 here is a **from-scratch component build**: open/close, option click, keyboard
navigation (arrows/home/end/escape/type-ahead), ARIA roles and active-descendant, focus
management, and value-sync back to `filterPull` (`views.js:12007-12031`). That is a
component, not a costume. Anchor is clean (`views.js:11983-12031`); the estimate is not.

Flagging because the GO's framing ("the B2 GO's miss, closed here") implies a small closure.
Build it if you want it — but it should be sized as new behavior, and it is the single
largest item in Lane 1.

---

## CLEANLY ANCHORED — buildable the moment you rule

| Item | Anchor | Note |
|---|---|---|
| **AES-1 Mechanism A** | `arc-constellation.js:871/882` → CSS override | needs the hue/density split decision |
| **AES-2 Shelf ground** | `components.css:12398-12404` → transparent | mirrors Home's `:13301-13305` |
| **AES-2 Notebook ground** | `components.css:13674-13683` → transparent | layout rules `:12236`/`:12080` untouched |
| **AES-3 header → kit** | seg `views.js:13617-13637` · chip `:13342` · life-btns `:13348-13368` · DELETE `:13600-13607` | all bespoke today; kit peers exist; **DELETE ARC is already confirm-gated** (`openArcDeleteConfirm`, `:14293+`) — preserve the panel, re-skin only |
| **AES-5b thumbnail plate-frame** | `.arc-const` `:1819` · `.home-arc-ff` `:13155` | `.home-wf` already has a plate at `:13517` — precedent to match |
| **Book Detail** | `renderBookDetail` `views.js:9762-10212`; CSS `10877-11442`, XL block `11355-11391` | an XL block already exists — this is a re-tune, not a net-new tier |
| **Profile dawn seam** | `renderProfilePage` `views.js:19394-19423`; CSS `14599-14963`, **seam at `14640`/`14653`**, XL `14872-14916` | seam anchors confirmed |
| **`--m1` rider** | `theme.css:147-151` (`--m1..--m5`), collapse block `296-372` | `--teal-on-ground` precedent |

**AES-2 finding worth your eye:** Shelf and Notebook still run the *pre-Home* mechanism —
each paints its own opaque full-viewport ground (`background-attachment:fixed` on Notebook),
the exact technique B1-FIX retired for Home. They never got the follow-up conversion. So
AES-2 is genuinely a two-rule edit, exactly as ruled.

**Stale memory corrected:** a prior recon memory claimed the Arcs-index thumbnail ignores
real `sub.x/.y`. **That is now stale — B2 shipped that fix** (`views.js:4008-4076`,
GR-1 block). Annotated.

---

## LANE 2 RECON — INCOMPLETE, DISCLOSED

The Lane 2 agent returned its file/anchor map (recorded in the table above) but its analytic
report did not come back intact. I have **confirmed anchors** for Book Detail, the Profile
seam, and the `--m1` rider, but **not** the derived findings I asked for: current occupancy
at 1920, the rail's button inventory for consolidation, the ✎ re-wire feasibility verdict,
or the full `--m1` consumer list split by parchment-vs-dark ground.

The ✎ item in particular was specified as "builds only if band-cheap, else named intake" —
**I cannot make that call without the feasibility read**, so I will not guess it. Re-running
that half is cheap and I will do it as the first act after your ruling.

---

## THE RULINGS NEEDED

1. **AES-1 Mechanism B** — re-baseline the `lumen-amber.css` byte-lock, leave B untouched
   (split canon across surfaces), or `!important` (not recommended)?
2. **AES-1 hue/density split** — marks currently weld hue and annotation-density into one
   value. Confirm: fix `fill` to gold, keep `opacity` varying by density?
3. **AES-5a dog-ear** — what is it? Point me at it live.
4. **AES-4** — proceed knowing it is a from-scratch listbox component, or defer to its own
   vehicle?

Nothing built. Nothing staged. Tree clean at `989e175`.
