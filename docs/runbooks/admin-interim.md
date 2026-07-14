# Praxis — Interim Admin Runbook

**Status:** INTERIM. The admin surface is the **Firebase console**
(`console.firebase.google.com`) for project **`praxis-b25d6`** (verified:
`js/integrations.js:23` — `projectId: "praxis-b25d6"`). A purpose-built admin tool is
future work; §6 (LIMITS) is the honest input for its spec.

**How this was written:** every collection, doc shape, and field name below is verified
against source — `firestore.rules` and the sync layer in `js/integrations.js` — and cited
`file:line`. No console writes, deletes, or account changes were made to produce it.

## 0. Ground rules (read before acting)

- **The console bypasses security rules.** `firestore.rules` constrains the CLIENT app
  only; the console (and the Admin SDK) run with full admin privileges and ignore those
  rules. Example: `publicProfiles` has **no** client delete rule
  (`firestore.rules:98-107`), but the console can still delete a `publicProfiles` doc.
- **Auth is Google sign-in only** — no email/password or anonymous accounts
  (`docs/checkpoints/build3-S0.md:70`). Users are found by email or UID in the Auth console.
- **Every action is manual and platform-un-audited.** The console keeps no record of which
  admin did what. The **Moderation Log (§7) in this file IS the audit trail** — fill it in.
- **`uid`** is the Firebase Auth UID. It keys every private collection and appears as
  `authorUid` / `fromUid` / `uid` on the social docs.

## 1. Data model (verified against source)

### Private workspace — 8 collections, ONE doc per user keyed by `uid`
Each doc is a **denormalized single document holding a map** (e.g. `userArcs/{uid}` =
`{ schemaVersion, arcs: { arcId: {…} }, updatedAt }` — `js/integrations.js:1222-1223`).
Access is owner-only (`request.auth.uid == uid`); deny-by-default everywhere else.

| Collection | Key | Source (rules · sync) |
|---|---|---|
| `userBooks/{uid}` | uid → `{ books: {…} }` | `firestore.rules:35` · `integrations.js:688` |
| `userArcs/{uid}` | uid → `{ arcs: { arcId:{…} } }` | `firestore.rules:39` · `integrations.js:1204,1222` |
| `userNotebook/{uid}` | uid | `firestore.rules:43` · `integrations.js:1304` |
| `userSubTheories/{uid}` | uid | `firestore.rules:47` · `integrations.js:1399` |
| `userProfiles/{uid}` | uid → incl. `penName, displayNameOverride, tagline` | `firestore.rules:51` · `integrations.js:898,2434-2436` |
| `userThemes/{uid}` | uid | `firestore.rules:55` · `integrations.js:1495` |
| `userReaderModel/{uid}` | uid | `firestore.rules:59` · `integrations.js:1013` |
| `userArtifacts/{uid}` | uid | `firestore.rules:63` · `integrations.js:1586` |

### Social projections — 4 collections, cross-user read (authenticated)

| Collection | Key | Fields (allow-list) | Source |
|---|---|---|---|
| `publishedArcs/{arcId}` | arcId | `authorUid, authorPublicName, title, subTheories[], tags[], freshness, seed, walkedBy, publishedAt, revisedAt` | `firestore.rules:83`; field list `firestore.rules:22-23`; builder `integrations.js:2450,2495-2503` |
| `publicProfiles/{uid}` | uid | `publicName, tagline, publishedArcIds[], updatedAt` | `firestore.rules:102`; field list `firestore.rules:28`; writer `integrations.js:2576` |
| `follows/{followerUid_targetUid}` | edge id | `followerUid, targetUid` | `firestore.rules:113` |
| `buildOns/{id}` | id | `type` (`'build-on'`\|`'question'`), `fromUid`, `targetArcId` | `firestore.rules:127`; writer `integrations.js:2761` |

Notes verified from source:
- `publishedArcs` projects **only the public register** (`bodyPublic`), never private
  registers (`integrations.js:2490`). `walkedBy` is an anonymous counter embedded in the
  doc (any authed user may `+1` it — `firestore.rules:11-14,90-93`).
- `publicName` (on `publishedArcs.authorPublicName` and `publicProfiles.publicName`) is
  **pen name OR display name**, per the user's `praxis_publish_identity` choice
  (`integrations.js:2430-2441`) — so a public name **may be a pseudonym**, not their Google name.
- Public route to an arc walk: **`#walk/<arcId>`**; to a profile: **`#reader/<uid>`**
  (`js/views.js:18399-18400,18758`).

## 2. Take down a published arc

**Find it** (Firestore Database → Data):
- Have a link? A walk link is `#walk/<arcId>` (the `arcId` is the `publishedArcs` doc id);
  a profile link is `#reader/<uid>`.
- **By owner uid:** `publishedArcs` → **Filter** `authorUid == <uid>` → each match's doc id
  is the `arcId`.
- **By title:** `publishedArcs` → **Filter** `title == "<exact title>"` (exact only; titles
  are not unique).

**Act — the clean takedown replicates the app's `unpublishArc` (`integrations.js:2603`)
PLUS the cleanup it omits:**
1. `publishedArcs` → open the arc doc → **Delete document.** (Removes the public projection
   and its embedded `walkedBy`.)
2. `publicProfiles` → doc `<authorUid>` → edit the **`publishedArcIds`** array field →
   **remove the `arcId` entry.** (`unpublishArc` does this via `arrayRemove`,
   `integrations.js:2627`; a raw doc-delete does NOT, leaving a dangling id that the
   `#reader/<uid>` page would try to load.)
3. `buildOns` → **Filter** `targetArcId == <arcId>` → **delete each** match. (Nothing in the
   app cascades these — `unpublishArc` never touches `buildOns` — so build-ons/questions on
   the arc are orphaned otherwise.)

**What deleting does NOT clean up (honest):**
- **The private source arc survives.** It lives as `arcs.<arcId>` inside `userArcs/{authorUid}`
  (`integrations.js:1222`), which the takedown does not touch. The author still has it and
  **can re-publish it.** A takedown that must *stick* also requires disabling the account
  (§3) — editing the private map is not a clean console op (§6).
- `follows` edges are user↔user, not arc-scoped — correctly unaffected.

## 3. Handle a bad actor

**Find their uid:** see §4.

**Disable the login:** Firebase console → **Authentication → Users** → search by email or
paste the **UID** → row menu (⋮) → **Disable account.** (Reversible; blocks sign-in. Prefer
*Disable* over *Delete* so the identity survives for evidence.)

**What disabling does NOT do (honest):**
- It does **not** remove or hide their Firestore content. Rules gate on the **reader's** auth
  (`request.auth != null`, e.g. `firestore.rules:84`), not the author's account status — so
  their `publishedArcs`, `publicProfiles`, and `buildOns` stay **publicly readable to any
  signed-in user**.
- Their private workspace docs persist (now inaccessible to them, but not deleted).

**Manual cleanup of the public footprint (always manual):**
1. `publishedArcs` → Filter `authorUid == <uid>` → take down **each** (§2 steps 1–3 per arc).
2. `publicProfiles` → doc `<uid>` → **Delete document** (their public identity card; console
   bypasses the missing client delete rule).
3. `buildOns` → Filter `fromUid == <uid>` → delete each (their contributions on *others'* arcs).
4. `follows` → Filter `followerUid == <uid>` (their follows) and `targetUid == <uid>` (edges
   pointing at them) → delete as appropriate.

> Why it's manual: the app's own `deleteAccount` (`integrations.js:1110`) wipes only **7
> private collections** and **omits `userArtifacts` and every social projection**
> (`integrations.js:1120-1122`). Admin-*deleting* the Auth record does **not** cascade to
> Firestore either. So the social cleanup above is never automatic.

## 4. Find a user's uid (from what a reporter knows)

- **From a profile URL:** it is `#reader/<uid>` — the uid is the last path segment
  (`js/views.js:18758`). Verify: `publicProfiles` → doc `<uid>` exists.
- **From a display / public name:** `publicProfiles` → **Filter** `publicName == "<name>"` →
  the matching **doc id is the uid**. Caveats: `publicName` may be a pen name
  (`integrations.js:2430`), is not unique, and matches exactly only — cross-check against a
  known arc (`publishedArcs.authorPublicName` + `title`).
- **From an arc:** open `publishedArcs/<arcId>` → the **`authorUid`** field is the uid.
- **Confirm in Auth:** Authentication → Users → paste the UID to see email / provider
  (Google) / last sign-in.

## 5. Moderation checklist (5 lines)

1. **VERIFY** — reproduce the report against live content (`#walk/<arcId>` or `#reader/<uid>`);
   confirm a real violation, not a disagreement.
2. **SNAPSHOT** — before acting, copy the evidence into the Moderation Log (§7): arcId/uid,
   offending title/text, the `publishedArcs` field values, and the timestamp.
3. **ACT** — apply §2 (arc) and/or §3 (actor); least-severe effective action
   (take-down < disable < delete).
4. **RECORD** — append a dated row to the Moderation Log (§7): who acted, what, which docs
   were touched, and whether it is reversible.
5. **NOTIFY** — if policy requires an outbound notice, record the channel + date in the log;
   otherwise write "no notice".

## 6. LIMITS — what the console CANNOT do cleanly (spec input for the real admin tool)

- **No bulk delete.** The Firestore console filters a collection but deletes docs **one at a
  time.** Taking down a prolific author (many `publishedArcs` + `buildOns`) is many manual
  deletes → slow and error-prone. Needs a batched Admin-SDK script.
- **No cascade.** Deleting `publishedArcs/<arcId>` does not touch
  `publicProfiles.publishedArcIds`, `buildOns.targetArcId`, or the private `userArcs` source.
  Every cross-reference (§2 steps 2–3) is a separate manual delete/edit.
- **Editing a single private record is not clean.** A user's arcs/books/etc. are a **map
  inside one doc** (`userArcs/{uid}.arcs.<arcId>`, `integrations.js:1222`). Removing one arc
  from a private workspace means editing a nested map field in the console — and the client
  re-syncs its local copy on next load, which can **resurrect** it. Treat private-workspace
  surgery as out-of-scope for the interim tool.
- **Weak find-by-content.** No full-text search; only exact field filters, and public
  names/titles are not unique. Reports that give only a phrase are hard to resolve.
- **No native audit trail.** The console does not record admin identity or action. §7 is the
  only record — keep it.
- **Un-publish ≠ un-say.** A takedown removes the projection but leaves the private original;
  without disabling the account the author can re-publish. Permanent removal of one arc from
  a still-active account is not a clean console operation.

## 7. Moderation Log (append-only — the record of admin actions)

> Copy the template row, fill it, and **never delete a row.** One row per action taken.

| Date (UTC) | Admin | Report / source | Target (arcId / uid) | Action | Docs touched | Reversible? | Notice |
|---|---|---|---|---|---|---|---|
| _YYYY-MM-DD_ | _name_ | _how it came in_ | _arcId / uid_ | _take-down / disable / delete_ | _publishedArcs · publicProfiles · buildOns · follows / Auth_ | _yes/no_ | _channel+date / no notice_ |

---
*Interim runbook — supersede when the admin tool ships. All console paths above are matched
to the real data model in `firestore.rules` + `js/integrations.js` (cited inline).*
