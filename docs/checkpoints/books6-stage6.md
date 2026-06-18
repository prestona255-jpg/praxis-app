# Books #6 — Stage 6: Delete a book (durable)

## Changes
- **state.js** — `pendingBookDeletes` guard (symmetric to pendingBookSync): `pendingBookDeletesKey` / `getPendingBookDeletes` / `markBookDeletePending` / `isBookDeletePending` / `clearPendingBookDelete`. `flushPendingBooks` now re-pushes when a delete is pending too.
- **integrations.js `mergeRemoteBookDoc`** — builds a `delSet` from pendingBookDeletes; the new index is `remoteIds MINUS delSet`; the book-copy loop skips delSet ids and drops any stray local copy; a pending-delete id the remote no longer lists is a *confirmed* removal → `clearPendingBookDelete`. So a stale remote read cannot resurrect a just-deleted book.
- **views.js** — `deleteBook(uid, id)`: removes the record + index entry, scrubs arc membership, sub-theory book-evidence (`{kind:'book',refId}`), notebook entry bookIds, theme membership, and the book artifact; `clearPendingBookSync` + `markBookDeletePending`; marks each scrubbed collection dirty; `saveState`. Book-detail gains a confirm-gated "Remove from shelf" (inline confirm row — the app avoids native confirm()) → `deleteBook` → toast → `#shelf`.
- **components.css** — `.book-detail-remove` (danger ghost) + inline-confirm row styling (`.book-detail-remove-confirm` / `-msg` / `-actions` / `-cancel` / `-confirm-btn`).

## Self-verify (PASS)
- parse state.js PASS (94770), views.js PASS (483083); integrations.js verified by live boot (mergeRemoteBookDoc exercised below). diffstat 4 files +282/−6.
- grep: pendingBookDeletes plumbing (state) 13; deleteBook (views) 2; delSet/pendingBookDeletes (integrations) 8.

### Durability simulation (live preview, seeded fixture, SW bypassed)
**After `deleteBook('delu_test','db1')`** (db1 referenced in arc + sub-theory + note + theme):
- ok=true; db1 gone from books; db2 kept; index `['db2']`
- arc bookIds `['db2']`; sub-theory evidence `['book:db2','entry:e1']`; note bookIds `['db2']`; theme bookIds `['db2']` → **no dangling refs**
- `isBookDeletePending('db1')` = **true**

**Stale remote read (still lists db1):** db1 NOT in books, NOT in index, db2 present, pending **still set** → **not resurrected** ✓
**Fresh remote read (drops db1):** db1 absent, pending **cleared**, db2 present → confirmed-removal clears the guard ✓

### Confirm-gated UI (renderBookDetail, stubbed user)
- `.book-detail-remove` present ("Remove from shelf"); first click → inline confirm row (book **still present** — never one-tap); msg = `Delete "The Test Title"? This can't be undone.`; Cancel + Delete present; Cancel restores the button. console clean.

## Residual (live-Charles ship gate)
- The true reload round-trip + real Firestore removal is the Charles eyes-on at ship (localhost sign-in broken). Mechanism, ref-scrub, resurrection-guard, confirm-gate, and pending lifecycle are all verified. NEVER destructive-test prestona255.

PASS → committed local → continue Stage 7.
