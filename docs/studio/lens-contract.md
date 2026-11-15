# The lens data contract

Thirteenth sitting, ruling 6, written 17 October 2026 (Opus 5.5, in design).
This binds L4 (lens engine + sky) and the Yumi lane. It is the shape of a lens; the screens that show it are drawn in the walk (v16) and the day-three walk.

## What exists today (live, a0c7ce4)
- A lens is `state.userThemes[id] = { id, userId, name, bookIds, createdAt, updatedAt }` (`createUserTheme`, state.js:2571; `assignBookToTheme` :2595).
- All of a reader's lenses live in ONE Firestore doc, `/userThemes/{uid}`, field `userThemes` (map). It is REPLACE-merged on load (integrations.js:360–409), and missing fields are backfilled by `ensureThemeFields` (state.js:888).
- Yumi's lens suggestions exist only in memory (`lensSuggestLenses`, yumi-ui.js). "Not this" is a splice (`lensSuggestDismiss`, yumi-ui.js:1690): nothing is remembered.
- Yumi's memory is `/userReaderModel/{uid}` = `{ threads: [...], profile: { summary, updatedAt }, updatedAt }` (state.js:1735). A thread row is `id, label, oneLine, status ('noticed'|'named'|'dismissed'), memberNoteIds, arcId, subTheoryId, createdAt, updatedAt`.

## Rules every change here obeys
1. **Additive only (r14).** No existing field is renamed, removed or retyped. New fields are optional, with the defaults below, backfilled by `ensureThemeFields`. A build that does not know a field must leave it untouched.
2. **Consent (r4, r5).** Nothing in this contract calls the AI without the yes. With the yes withdrawn, kept lenses stay (they are the reader's); Yumi stops reading and offering.
3. **Readable, correctable, endable (the covenant).** Everything Yumi keeps about a lens appears on What Yumi Sees and can be forgotten there, with Undo.
4. **The offers doc saves only after a successful or empty load (Preston, 10 Nov 2026 — a standing rule).** `/userLensOffers/{uid}` opens its outgoing-write latch only when its sign-in load comes back *found* or *absent*. On an *error* the latch stays shut: the local copy waits, and nothing is written until a later load settles. **Why** (the repo-mapper's finding, L4 pre-build, 10 Nov 2026): the `/userThemes` latch opens on ANY load outcome, the error included (integrations.js:416), and its save is a full-document `.set()` (integrations.js:1919), so a failed read followed by a save can overwrite a cloud doc that was never read with a partial local copy. The offers doc does not copy that hazard (integrations.js `applyLensOffersLoad`; proven in tools/lens-data-test, "rule 4").

## 1 · A kept lens — `userThemes[id]` gains these optional fields

| Field | Type, default | Meaning | Ruled in |
|---|---|---|---|
| `origin` | `'hers' \| 'yours'`, default `'yours'` | Taken up from her offer, or named by the reader | seventh sitting (RULINGS.md:144) |
| `hersName` | string, `''` | Her name at the moment it was taken up, so "Use her words" can restore it | v14 rulings, "her words, until you type" (RULINGS.md:63) |
| `q` | string, `''` | The question kept with the lens: the round it was kept in. Existing lenses have none. | v14 rulings (RULINGS.md:60); tenth sitting (RULINGS.md:391) |
| `reading` | string, `''` | Her reading of the thread (the offer card's paragraph) | seventh sitting L4 (RULINGS.md:205) |
| `leftOuts` | array of bookIds, `[]` | Books she read but left out of the lens | seventh sitting L4 (RULINGS.md:205) |
| `why` | string, `''`, max 200 characters | The reader's optional "why I keep returning to it" | ninth sitting (RULINGS.md:300) |
| `look` | object, `null` | The painted form, STORED, never re-derived: `{ hue, L, c:[2 colours], pw, form:{ R, t, rev, kind, motif, rot, ay } }` (mockup `makeLook`, v16/hand.js:192). `null` = derive once on first draw, then store. | ninth sitting (RULINGS.md:332) |
| `said` | array, `[]`, max 4 entries, each max 500 characters | The reader's lines back: `[{ t, at, round }]` (three readings + one "Say more") | tenth sitting (RULINGS.md:377); eleventh r4 |
| `keptAt` | ms epoch, default `createdAt` | When it was taken up or named | — |

A lens's books stay in `bookIds`, unchanged. A book may belong to any number of lenses (live behaviour).

## 2 · Offers not yet kept — NEW doc `/userLensOffers/{uid}`

```
{ offers: { <offerId>: {
      id, name, reading, themes: [≤3 strings], q, bookIds: [], leftOuts: [],
      round: 1..3, said: [{ t, at, round }],
      state: 'open' | 'later' | 'declined',
      createdAt, decidedAt
  } },
  lastReadAt, lastReadBookCount }
```
- **Later** = `state:'later'`. It **never expires** (Preston, 17 Oct). It shows as the "Later · N" chip until it is taken up or set aside as Not this.
- **Not this** = `state:'declined'`. It is remembered and **never re-offered while its books are on the shelf**. A declined offer is pruned when none of its `bookIds` remain on the shelf (seventh sitting, "materially changed", RULINGS.md:226).
- **The same lens** (for not re-offering) = the same name, ignoring case, OR at least two-thirds of its books shared.
- **Taking one up** moves it into `userThemes` with `origin:'hers'`, `hersName`, `q` (from its round), `reading`, `leftOuts`, `said`, `look`; the offer is then removed.
- Firestore rule: owner-only read/write, the same as `/userThemes/{uid}`. Sync uses the existing `markPendingSync` guard.

## 3 · Letting a lens go — the reader's words stay in her memory (Preston, 17 Oct)
- The lens leaves `userThemes`; its books stay on the shelf.
- If it has `said` lines and the yes is granted, they move into `/userReaderModel/{uid}` as a NEW optional array `lensWords: [{ id, lensName, lines:[{t,at}], at }]`. It is a separate array, so the thread schema and its status machine stay untouched (r14).
- If the yes is not granted at that moment, the lines are deleted with the lens: no memory without the yes.
- **The Let it go confirmation says so:** "Your words to this lens stay in Yumi's memory. You can forget them on What Yumi Sees." The reader gets Undo for a few seconds.
- What Yumi Sees lists them in the let-go row, worded as consent-copy.md's "Let-go words" line, each with "Let her forget this" (with Undo). Lines on lenses the reader still keeps have their own row beside it (consent-copy.md, "Added 14 Nov" #2; ruled by Preston, 14 Nov 2026).
- Yumi may quote them in her first line ("You told me: …") only while they are in memory.

## 4 · Where each field shows

| Surface | Reads |
|---|---|
| The sky (stop, Home, You galaxy) | `name`, `look`, `origin`, `bookIds.length`; offers by `state` |
| Offer card | offer `name`, `reading`, `themes`, `q`, `bookIds` |
| Lens sheet | `look`, counts, three covers from `bookIds`, `q`, `said`, `why`, Rename, Let it go |
| Shelf, Lenses mode | `name`, `bookIds` (bands) |
| Yumi's first line and panel | `q`, `said`, `lensWords` |
| What Yumi Sees | `said` rows (kept lenses) and `lensWords` rows (let go) |
| Later chip and tray | offers with `state:'later'` |

## 5 · Export, delete, size
- **Export** (`buildExportBundle`, integrations.js:2772) includes every new field and `/userLensOffers/{uid}`.
- **Delete account** (`deleteAccountCloudData`, integrations.js:1246) adds `/userLensOffers/{uid}` to its batch.
- **Size:** one doc per reader, so the 1 MiB Firestore limit applies. At 50 lenses × (reading ~600 + said 4×500 + look ~200 + the rest) ≈ 150 KB, it fits. L4 enforces the caps above.

## 6 · Existing lenses (Preston's account and the test accounts)
They keep everything they have. On first load, `ensureThemeFields` backfills `origin:'yours'`, empty strings, empty arrays and `look:null`. Nothing asks Yumi to invent a question for an old lens.

## 7 · What L4 must prove (its PASS checks)
1. **Unknown-field survival:** write a lens carrying a field the current build does not know, run EVERY lens writer (create, rename, add or remove a book, take up, let go, sync round-trip) and confirm the field survives. This is r14's proof.
2. A round-trip of every new field through Firestore, using the app's own writers (the CLAUDE.md fixture rule).
3. "Not this" survives a reload and is not re-offered. It is pruned only when its books leave the shelf.
4. Later survives a reload and indefinite time.
5. Letting go with `said` lines and the yes granted puts them in `lensWords` (visible on What Yumi Sees). With the yes not granted, they are deleted.
6. Export contains the new fields. Delete account removes `/userLensOffers/{uid}`.
7. With the yes not granted, no lens call leaves the phone (r5's gate in `aiProxyRequest`).
