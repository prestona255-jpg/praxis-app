---
surface: account
route: "#account"
render_fn: redirect → renderProfilePage (was renderAccountPage, retired defined-but-unrouted)
ground: n/a (redirects)
in_nav: no (nav avatar → #profile)
state: MERGED → #profile (R9a, v3.198)
rounds: 0 (merged, not rounded on its own)
---

## State

**MERGED into the single Profile at `#profile` (R9a, v3.198 `e25ac6f`).** `#account` →
`location.replace('#profile')` (the R7 /marks precedent — refresh-stable, no history push); old links +
bookmarks land on the merged Profile. The nav avatar was repointed `#account`→`#profile`. `renderAccountPage`
(and `renderOwnProfile`) were **DELETED by the S-B sweep** (2026-08-08, v3.270–272, ~2,133 L incl. `_opPublishControl` + 14 `_account*` helpers; both Sonnet gates clear). Their orphaned `.account-*` CSS (~92 selectors) is ledgered for a dedicated CSS-dead-sweep (`sb-sweep-debt-table.md`). All the
account DNA carried into `renderProfilePage`: settings + identity + sign-out + "Your data" covenant, the Yumi
value-offer retrofit (AM19 dock), and the reader-model consent + threads/journey/returns (owner-only, via the
parameterized `buildReaderModelSection`). Arc publish was NOT lost — it lives on the arc-detail page. See
`docs/studio/profile.md` for the live surface.

## Decisions

## Gap ledger

- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: HIGH] PA1 — Account cross-links ("View your public profile →" etc.) render as mono labels with a near-invisible underline (components.css:11899-11905) — the "links look accidental" friction.
- [source: fable-audit-combined.md 2026-07-07] [status: unverified] [sev: upgrade] Upgrade (VC5) — Flagship values-preset moment: today values are a buried free-text "What you're reading toward" field; the maker wants a first-run, preset-driven values moment ("Love is liberation," etc.). Storage (`setProfile{values}`) already exists to receive it (views.js:17213-17262). Gap, medium.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Export] Account / reader-portrait Export (high priority) — complete the export NOW: artifacts, lenses, and reader-model, user-filtered, from a single source of truth. Import/restore and making the cloud a first-class citizen ride the durability closeout.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: FIX] Account / reader-portrait FIX now — keyboard and tab-index on the chips; extend the try/catch umbrella over the reader-model, transparency, and data tail; dark-mode contrast to AA.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: REWORK] Account / reader-portrait REWORK — unify the DUPLICATED reader-model consent toggle into one; add a re-entrancy guard on the page render.
- [source: praxis-2.0-phase2-ledger.md 2026-06-27] [status: unverified] [sev: Rebuild-requirement] Account / reader-portrait Rebuild requirement — the mobile galaxy and the import panel.

## Round history

- **R8 — Values (retrofit + values section) — SHIPPED v3.195 (`37ea1f0`), 2026-07-11.** The values section
  ("What you're reading toward") gained the **Yumi value-RETROFIT**: a button-triggered, metadata-only,
  eval-gated suggestion panel (offer-cards accept/rename/reject) that adds a DECLARED value (a `profile.values`
  stone) — NEVER auto-marks an object. Ember scope (`.account-retro-*`, `--lum-*`). The copy-contract on the
  values note was corrected ("…Yumi may notice values your shelf carries, but never fills them in for you").
  Partially closes VC5 (the flagship values-preset moment — the onboarding beat is the other half). Live
  smoke: real proxy returned grounded suggestions ("Power Named", "Relational Ground"); accept added a stone,
  `noAutoMark` verified. touches: renderAccountPage.
- **R9a — MERGED into #profile — SHIPPED v3.198 (`e25ac6f`) + patch v3.199 (`6e96d5b`), 2026-07-12.** The
  Account page ceased to exist as a surface: `#account` redirects to the merged Profile, `renderAccountPage`
  retired defined-but-unrouted. The merge resolves several account gaps by construction — PA1 (the
  "accidental" cross-links are gone with the account chrome), the REWORK duplicate reader-model consent
  toggle (the merged Profile mounts ONE `buildReaderModelSection`), and it completes VC5's other half via the
  re-homed values-offer dock + the R9a values section. Remaining account gaps (Export, the FIX try/catch
  umbrella, mobile-galaxy rebuild) migrate to the Profile's ledger / S-B. touches: [profile, account].
- **P1 SAFETY Item 3 — EXPORT — LOCAL v3.297, 2026-09-03.** The Export gap closes: a "Your data" card in
  the Profile's Settings register — one ZIP (praxis.json from the eight sync payload builders + Markdown +
  photos, hand-written store zip, Share sheet on iOS). Record: `docs/checkpoints/p1-safety-build.md`. Felt
  pass PENDING. touches: [profile]. (Item 2 — account deletion — is the NEXT commit and will add its own
  line here; it is not built as of this line.)

## Next
