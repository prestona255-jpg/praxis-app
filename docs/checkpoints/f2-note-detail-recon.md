# F2 — NOTE-DETAIL CANON REPAINT — S0 RECON

HEAD `bc0de4d` (post Part-1 docs re-scope) · CACHE_VERSION `praxis-v3.258` → **v3.259**.
Verdict: **PROCEED** (styling fix, not structural — F2-0 escape valve NOT tripped).

## 1 · Render path + families

- Route: `renderRoute` (views.js:669) `parts[0]==='note' && parts[1]` → clears lens
  pointers → `renderNoteSurface(parts[1])` (views.js:15094). Route is LIVE + linked
  from 4 surfaces: spotlight search (spotlight.js:177), a note list (views.js:1003),
  the sub-theory finished-room (views.js:11896), a direct nav (views.js:15489).
- Surface: `renderNoteSurface` (views.js:15094-15275). Wrap =
  `section.note-surface lum-amber-deep`. CSS = one base block, components.css
  11831-11846 (2192 B); NO mobile @media rule exists.

## 2 · WHY it looks broken (ground-check, PROVEN — L8)

- The dark token layer is triggered by **`[data-ground="dark"]`** (theme.css:646) —
  NOT by `.lum-amber-deep`. The `umberGroundDark` map (views.js:480) lists every
  dark route; **`'note'` is NOT in it** → the note route resolves
  `data-ground="bright"` → the LIGHT `:root` tokens: `--ink #241710` (DARK brown),
  `--surface #fffdf8` (light), `--border --line-page` (light), `--gold-text --gold-ink`.
- BUT the wrap wears `lum-amber-deep`, whose ONLY effect (lumen-amber.css:82-89,
  byte-locked) is to paint a **DARK amber background** (`#33240f→#181006`).
- ⇒ **DARK `--ink` body text on a DARK amber ground = "barely readable"; the
  `--gold-text` back-link vanishes on dark.** Exactly the F2 report. It is a
  half-built surface: a `.lum-amber-deep` skin that never got the light-paper
  re-point its siblings got (theme.css:675-677 states the intent: *"Scoped
  .lum-amber-deep skins keep their own #855410 on their light paper"*).
- SIBLING PATTERN: **book-detail** (R7 light PAGE) carries **no `lum-amber-deep`**
  (`.book-detail`, components.css:2628) and sits on the default light ground; the
  **notebook** keeps `.notebook.lum-amber-deep` but re-points to light. A note is a
  notebook ENTRY and a working surface → the **LIGHT working-page family** (GROUND
  SPECTRUM: "you WORK in the light"). Fix = give it its light ground.

## 3 · Ground-check citation (binding trap)

Family = light working reading-page. Note is `data-ground="bright"`, so `--surface`
/`--border` are NOT the L8 trap here (they already resolve LIGHT on `:root`) — but
per the ruling I use the explicit light-canon set anyway: **`--page-2` light fills ·
`--line-page` lines · `--gold-deep` (#855410, AA 5.7 on light) for gold-as-text**;
`--gold-hi` NOT used as text; the ink ramp `--ink`/`--ink-2`/`--ink-3` stays (light-
page dark inks, AA-correct once the ground is light). Primary button keeps
`--grad`/`--text-on-dark`.

## 4 · Content vs the ruled anatomy (all present — repaint, don't rebuild)

| Ruled anatomy | Live | Action |
|---|---|---|
| register + date header | `.note-eyebrow` (mono·--ink-3) 15127 | keep |
| note body, readable serif at measure | `.note-body` serif 17px, max-width 720px 11835 | repaint ground; **un-clamp** (see below) |
| edit affordance (wiring UNTOUCHED, restyle shell) | `.note-edit-btn`→`renderEdit` → `createWritingCanvas`(marg)/textarea(journal-q) → `updateNotebookEntryBody` (sole edit writer, 15170/15179/15195) | restyle `.note-edit-*` only; wiring untouched |
| where-this-note-lives (book/arc chips) | `.note-prov` rows (Filed to / In the arc / Woven into) 15216-15273 | repaint |
| back-link | `.note-back` hardcoded `#notebook` 15121 | add "came from" (see §6) |

**Drift noted (not folded):**
- The ruling names `openMarginaliaEditor` as the edit wiring; that is the BOOK-DETAIL
  pencil (views.js:14526/8489), a DIFFERENT surface. Note-detail's real edit path is
  `.note-edit-btn`→`createWritingCanvas`/textarea. The ruling's INTENT (don't touch
  edit wiring, restyle shell) is honored against the real path.
- **NOTE-IMG (pre-existing, NAMED not folded):** `renderNoteSurface` renders no
  attached photos — a note with images shows its text body + prov only. Adding photo
  rendering is new content/DOM (IDB load, pre-sized slots) beyond a canon repaint →
  residual for its own lane. The "with images" walk verifies the surface does not
  BREAK, not that photos appear.
- **BODY-CLAMP (in-scope, "made legible"):** marginalia body = `note-body
  notebook-entry-body-md`; `.notebook-entry-body-md` carries `max-height:15em;
  overflow:hidden` (components.css:10695 — a LIST-preview clamp) which `.note-body`
  inherits → long marginalia notes TRUNCATE on the full page. Fix: `.note-surface
  .note-body{ max-height:none; overflow:visible; }`.

## 5 · Safety checks

- `.notebook-entry-body-md` markdown styling (10695-10704) + `.rec-lit` recog
  underline (10717 = dotted `--gold`) are **plain-class scoped, NOT lum-amber-deep-
  dependent** → dropping `lum-amber-deep` does not unstyle the markdown/recog.
  `_recogLightEl` (15375) just wraps recognized terms in a decorative gold dotted
  underline — ground-agnostic.
- Foundations MD5 baseline: lumen-amber `070679b0…` · marks `772886c0…` (match locked).
  NOT touched.
- No `backdrop-filter`/`blur` in any note-* rule (dead-backdrop grep = 0 already).

## 6 · Build plan (F2-1)

**JS (views.js renderNoteSurface + a small tracker):**
1. `wrap.className = 'note-surface lum-amber-deep'` → `'note-surface'` (15105) — the core fix (drop the dark skin; light `:root` ink lands on the light wheat ground).
2. Back-link "came from": module-level prev-hash tracker via an own `hashchange`
   listener (mirrors capUpdateCreateDoorPos's accepted pattern, views.js:23835 — NOT
   a router/route change, additive observation) → `_noteBackPrevHash`. Helper returns
   `{href,label}`: known non-note in-app surface → `{prev, '← Back'}`, else
   `{'#notebook', '← Back to the notebook'}`; note→note guarded to fallback. Applied at
   both back-link sites (not-found 15111-15114 · main 15121-15125). views.js loads
   before app.js → the tracker's listener fires before renderRoute reads it.
3. Wording (15246): "Unfiled — not filed to a book" → **"In the Inbox — not yet filed
   to a book"** (agrees with THE DOOR's "Filed to Inbox" receipt; capture.md F3).

**CSS (components.css 11831-11846 + a new mobile block):**
4. `.note-surface .note-body{ max-height:none; overflow:visible; }` (un-clamp — §4).
5. `.note-back`,`.note-prov-door`: `--gold-text` → `--gold-deep` (rest + hover underline).
6. `.note-edit-btn`,`.note-edit-done`,`.note-edit-plain`: fills `--surface`→`--page-2`, borders `--border`→`--line-page`. (`.note-edit-done` keeps `--grad`/`--text-on-dark` primary.)
7. `.note-prov` top border `--border`→`--line-page`.
8. NEW `@media (max-width:759px)`: P3 `.note-edit-btn`/`.note-edit-done{min-height:44px}`; P8 `.note-prov-row{flex-wrap:wrap}` (long-label door never h-scrolls at 390).

**sw.js:** CACHE_VERSION `praxis-v3.258` → `praxis-v3.259` (+0 B, equal length).

## 7 · Pre-stated byte deltas (measured after)

- views.js: CODE floor **+~700 B** (tracker+helper+2 sites+wording); COMMENT +~150 B.
- components.css: **+~350–500 B** (mobile block ~+300 · property/token edits net +50–150).
- sw.js: **+0 B** (version string equal length).
- lumen-amber.css / marks.js: **+0 B** (untouched — re-md5 at gate).

## 8 · #note/<id> route (out of scope — report only)

The route is LIVE and linked from 4 surfaces already; the "R5 rejected until F2"
concern was that the surface LOOKED broken (dark-on-dark). F2 makes it canon-native →
**the surface is no longer broken, so its promotion/wider reliance is UNLOCKED for the
round-close ruling.** Not built here.

## 9 · Escape-valve check (F2-0 abort-gate)

Mechanism is **styling** (ground repoint + un-clamp), NOT structural. Content does NOT
fork beyond the ruled anatomy (all rows present). No door-core, no route change (the
back-link tracker observes history; routing dispatch is untouched). **⇒ PROCEED to F2-1.**
