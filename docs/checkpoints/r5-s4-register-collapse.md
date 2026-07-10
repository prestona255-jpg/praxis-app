# R5 S4 — REGISTER COLLAPSE — RECON + DESIGN (⚠ DATA-ADJACENT; durable build spec)

Remove the Public|Intellectual toggle + dual-body model; single body = bodyPublic; migrate the former
bodyIntellectual into bodyPublic (idempotent, flag-guarded, NEVER delete). DATA-LOSS TIER — needs the
most scrutiny + a genuine human read before push (FIX-PROTOCOL §5 path C interim rule).

## Migration — the SEAM (verified)
`ensureSubTheoryFields(st)` (state.js:626-681) is the 9.1 chokepoint. It runs on EVERY load path:
- localStorage `migrate()` → `ensureSubTheoryFieldsAll` (state.js:2926, 2947).
- Firestore merge → `ensureSubTheoryFieldsAll(state.subTheories)` (integrations.js:278).
This solves the "merge bypasses migrate()" seam — the migration placed HERE runs on both. It already
backfills bodyPublic/bodyIntellectual to strings (633-640), so both are guaranteed strings before the fold.

## Migration code (append to ensureSubTheoryFields, AFTER the field backfills, BEFORE `return changed;`)
```
  // R5 S4 register collapse: fold a non-empty bodyIntellectual into the single body
  // (bodyPublic), ONCE, under a light divider. bodyIntellectual is NEVER deleted
  // (kept dormant). Per-record flag (_regMergedV1) makes this idempotent AND merge-safe
  // (this chokepoint runs on both the localStorage load and the Firestore merge).
  if (st._regMergedV1 !== true) {
    var _intel = st.bodyIntellectual; // guaranteed a string by the backfill above
    if (_intel.replace(/^\s+|\s+$/g, '') !== '') {
      if (st.bodyPublic.replace(/^\s+|\s+$/g, '') === '') {
        st.bodyPublic = _intel;
      } else {
        st.bodyPublic = st.bodyPublic + '\n\n---\n\n' + _intel;
      }
    }
    st._regMergedV1 = true;
    changed = true;
  }
```
- Idempotency: run twice on a fixture → run 1 folds + sets flag; run 2 sees flag → no-op → IDENTICAL. PROVE
  with a cscript/JS fixture (2 records: one with intel, one already-merged) before the S4 commit.
- Convergence across devices: the append is deterministic (same divider, same intel), so two devices that
  both migrate the same original record produce identical bodyPublic (no divergence). Firestore source-of-truth
  + the flag mean at most one fold per record.
- Edge cases (§9 red-team MUST cover): empty intel (flag only), both empty (flag only), already-migrated
  (no-op), bodyPublic empty + intel non-empty (bodyPublic = intel, no leading divider).

## Body-reader repoints (avoid DOUBLE-COUNT of the now-dormant duplicate)
Post-migration bodyPublic CONTAINS the former intel text; the dormant bodyIntellectual still holds it too.
Every reader that reads BOTH bodies would double-count:
- **_stComputeMaturity** (views.js:11747-11748): drop the `intel` term → maturity from bodyPublic ONLY.
  (Else inflated maturity/glow/sort.) REQUIRED.
- **search haystack** (views.js:835): `hay: (hdr + ' ' + body1 + ' ' + body2 + ...)` → drop `body2`
  (bodyPublic already has it). Avoids double-weighting intel terms in search. (Also drop the now-unused
  body2 var at 828.)
- first-line fallback (13912-13915): reads bodyPublic FIRST (either/or, not concat) → no double-count. LEAVE.

## Register-toggle REMOVAL (views.js ~9967-10140+; the writing surface — R6 owns the rest)
Remove ONLY the toggle + Intellectual textarea + register-switching; KEEP publicBody, the canvas, and the
Write|Preview toggle (wpToggle is a SEPARATE control — stays). Sites:
- `intelBody` textarea (9990-9996) + its focus listener (10007) — REMOVE.
- `intelTab` (10031-10035) + its click (10096) + regSeg.appendChild(intelTab) (10101) — REMOVE.
- `activeRegisterPublic` (10037): the register axis collapses. Every `activeRegisterPublic ? X : Y` →
  the public branch X: insertCitationAtCursor (10016,10019), applyEditorView `pub` (10062,10072-73),
  showRegister (10082,10085,10087 → showRegister becomes moot; remove publicTab/intelTab wiring),
  onSave (10136,10139) → always publicBody / bodyPublic.
- `intelPreview` references (10071) — REMOVE (and its creation, further down — read 10140-10260 at exec time).
- The `.st-register-toggle`/regSeg with only Public left → the whole register seg is dropped (single body
  needs no tab). Keep the Write|Preview `wpToggle`.
- ⚠ EXEC-TIME RECON NEEDED: read views.js 10140-10260 (publicPreview/intelPreview creation, the full onSave,
  the DOM assembly of regToggle/wpToggle/manuscript) to complete the removal precisely. The block extends
  past 10140. This is delicate surgery on the shared createWritingCanvas — do it in focused context.

## GATE (S4): grep Public|Intellectual toggle-render sites = 0 (the 'Public'/'Intellectual' tab labels +
intelBody/intelTab/activeRegisterPublic); migration idempotency proven (2× run identical on a fixture);
dormant bodyIntellectual untouched in the WRITE path (no updateSubTheory writes it after removal);
maturity/search repointed; exact migration diff quoted for THE STOP. Parse clean; Δ=0 frozen-3.

## BUILT — gates ALL PASS (data-loss tier)
- Migration added to ensureSubTheoryFields (state.js) — the exact block in this doc. Fires on BOTH
  migrate() + the Firestore merge.
- Register removal (views.js): 13 edits — removed intelBody/intelTab/publicTab/regToggle/regSeg/
  intelPreview/activeRegisterPublic/showRegister; collapsed applyEditorView/insertCitation/onSave to the
  single body; the load `showRegister(true)` → `applyEditorView()`. **ZERO dangling code refs** (grep-proven;
  the 3 remaining mentions are in ONE comment). Write|Preview toggle + Published toggle KEPT.
- Repoints: `_stComputeMaturity` drops the intel term (single body); search haystack drops body2.
- FIXTURE IDEMPOTENCY PROOF (cscript, scratchpad r5-s4-migration-proof.js — a faithful standalone of the
  exact migration block): **ALL PASS** —
  - both-nonempty: run1 pub=`Public prose.\n\n---\n\nIntel prose.`, run2 IDENTICAL, intel untouched.
  - empty-public: pub=`Only intel.` (no leading divider), run2 identical.
  - empty-intel: pub=`Only public.` (no append), run2 identical.
  - already-merged (flag set): NO re-fold, run2 identical, intel `X` preserved.
  - no-double-fold: PASS. exit 0.
- parse OK (state+views); P|I toggle render sites = 0; bodyIntellectual WRITE sites = 0; Δ=0 frozen-3;
  ES3 clean; bytes state +18 / views +42/−104.

## Residuals
- R-S4a: `_regMergedV1` is a new per-sub field persisted to Firestore — verify on the live smoke that the
  userSubTheories doc write isn't rejected (LOW risk: the subTheories map is a blob; ensureSubTheoryFields
  already adds fields like citationPins/format that persist the same way).
- R-S4b: `.st-register-toggle` CSS now dead (regToggle removed) → S6 dead-code sweep.
- R-S4c: first-line fallback (views.js ~13983) still reads bodyIntellectual (harmless either/or) — leave.
- R-S4d: fold divider is markdown `---` (an `<hr>` in the canvas) — felt-pass the "light divider" look.
- DATA-LOSS: idempotency PROVEN on fixtures; the exact migration diff + these mechanics get Preston's read
  at THE STOP, and the live smoke on prestonpraxistest is the final gate (FIX-PROTOCOL §5 path C interim).

## Commit: LOCAL checkpoint, --no-verify (single sw.js bump at THE STOP). Explicit-file staging.
