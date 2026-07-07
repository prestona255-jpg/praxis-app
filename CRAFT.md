# CRAFT.md — the Praxis craft standard

> **Ratified July 4.** The one values call — §3.1, the logged-out philosophy — is
> **locked** to *knowledge open, practice gated*. Everything else is settled canon or
> a grounded standard. A few exact token values point to `theme.css` as the source of
> truth, marked *(confirm against …)* — those are living pointers, not open questions.

**What this is.** The fixed craft bar every wave is held to, and the rubric the
Fable audit scores against. It is *not* the agent protocol (that's `CLAUDE.md`) or
the full product spec (historically the now-archived living document) — it's the standard for what an
excellent Praxis surface looks like, stated concretely enough to check. When a wave
ships, it either meets this bar or it doesn't.

Inherits from: the **six load-bearing principles** (enumerated in the Fable audit —
`docs/audit/fable-audit-combined.md` §2 Lane B, P-1–P-6 — and enforced in code), the
product spec (historically the **living document**, now **archived** to `docs/archive/`),
the **Yumi voice document**, **`CLAUDE.md`** (operational rules + seam guards),
**`BOARD.md`** (the live coverage matrix).

---

## 1. Principles → craft

The six load-bearing principles are the covenant (enumerated in the Fable audit —
`docs/audit/fable-audit-combined.md`, P-1–P-6 — and enforced in code; the **archived**
living document is no longer canonical for them); CRAFT's job is
to make them *checkable*. The rubric in §2 is that translation. The ethos underneath,
in one line:

> **Problem-posing over banking** — the reader is a co-author of knowledge, not a
> consumer of it; knowledge is meant to be acted on and shared, not hoarded.

Every craft decision below serves that. The enforcement practice is the **Drift
Check** (§5): before a surface ships, hold it against the principles and the rubric,
and name any drift.

---

## 2. The craft rubric (the bar, by dimension)

A surface passes when it meets every applicable line.

### 2.1 Visual
- **Ground:** the Amber / Lumen dark system. Convert a surface by keying its route
  into `umberGroundDark` (→ `data-ground="dark"` → the token remap in `theme.css`).
  **Never add a `.lum-amber` root class** — that's a redesign, not a conversion.
- **Color:** live tokens only (`var(…)`). Zero raw hex, with the single exception of
  a documented `rgba()`-of-token wash, each one flagged in a comment.
- **Cyan is Yumi's voice — nowhere else.**
- **Type:** the Cormorant serif for display/reading; body + mono faces per
  `theme.css` *(confirm exact faces against theme.css)*.
- **Bright card on a dark ground:** keep its own `:root` token (e.g. `--panel-yumi`)
  and **scope-repin** its inherited `--ink` tokens back to dark anchors, mirroring
  `.about .orientation` — scoped tightly so it can't bleed into shared surfaces.
- **Marks:** the constellation system (circle-only silhouettes, the treatment × hue
  grammar) is canonical; don't reinvent it.
- *(Confirm container widths + the spacing scale against `theme.css`.)*

### 2.2 Interaction & state
- Every surface has a **designed empty, loading, and error state** — not a
  synchronous blank. The shipped "your shelf is open" empty state is the tone
  exemplar.
- Failure **degrades gracefully and stays in-app** — the local-first-then-sync
  pattern: the local write succeeds, a failed remote write doesn't break the surface.
- Motion is quiet and purposeful; nothing that fights a screenshot-settle.

### 2.3 Voice & writing
- Yumi speaks in her canonical voice (the voice doc). Her generative moments run the
  **five-move pedagogy**, not free-form chat.
- **Live-verbatim doctrine:** quoted material renders exactly as written — no
  paraphrase, no silent trimming.
- Copy is plain, warm, and non-condescending; it invites rather than instructs.

### 2.4 Code
- **ES3 only:** `var` + `function`. No `const` / `let` / arrow / `class` / backticks;
  string concatenation only.
- Tokens over literals; foundations (`lumen-amber.css`, `marks.js`) are
  **byte-locked** and MD5-verified every wave.
- **Explicit-file staging**; parse-gate every edited JS file; prove every change with
  diffs / grep counts / byte deltas / settled screenshots. *(Full procedure lives in
  `CLAUDE.md` — this line is the standard, that's the how.)*
- Auth-gated data actions **mirror an existing guard** (the canonical one is
  `exportWorkspace`), never invent a new auth pattern.

---

## 3. Locked philosophies

The decisions CRAFT exists to fix, so later waves (L2/L3) stop guessing.

### 3.1 Logged-out philosophy — **LOCKED: knowledge open, practice gated**

The census found three coexisting stances (hard-gate, soft-CTA, and no gate at all).
The standard, grounded in the app's own ethos:

> **Knowledge open, practice gated.**

- **Public / commons surfaces** — browsing, published arcs, the shared theory, the
  About/orientation layer — are **open**, or at most a soft, invitational CTA. Gating
  liberatory knowledge behind a mandatory account cuts against everything Praxis is
  built on.
- **Personal + authoring surfaces** — your shelf, your notebook, your artifacts, and
  any *create / publish* action — are **hard-gated**. Your practice and your
  authorship require identity. (This is exactly why the L4 fix gates
  `createSubTheory`.)
- **Retire the "no gate at all" state** (book / marks) by classifying every surface
  as open or gated under this rule — no surface is left ungoverned.

The **L3 retrofit** reads its gating decision directly off this rule: classify each
of the 18 surfaces as *open* or *gated* per the split above, then enforce.

### 3.2 Empty / loading / error philosophy (sets the L2 bar)

Honest, in-voice states everywhere (per §2.2); graceful degrade on failure; no dead
blanks. Comfortable locking this on the rubric unless you object.

---

## 4. Metrics (the wave-to-wave dashboard)

Tracked in `BOARD.md`, read by every wave and by the audit:

- **Surface coverage** — Amber + mobile, out of the 18-surface matrix (**18/18**
  post-Lane-B).
- **Token discipline** — raw-hex count, target **0**.
- **Foundations integrity** — the byte-lock MD5s, unchanged.
- **Dead-code** — grep-0 on retired names.
- **Console** — 0 errors as a ship gate.
- **`views.js` size** — tracked; the split is an open audit question.

---

## 5. The Drift Check

Canonical practice: before shipping, hold the surface against the
principles + this rubric and name any drift — scope creep, a principle violation, a
reinvented pattern. It's the reason a wave stays honest.

---

## Cross-references
- **`CLAUDE.md`** — operational agent protocol (staging, gates, seams).
- **Living document** — *archived* (`docs/archive/praxis-book-app-living-document.html`);
  historical background, **not** current truth. Six principles: `docs/audit/fable-audit-combined.md`
  (P-1–P-6). Visual/spec truth: the code + `docs/design-spec.md`.
- **Yumi voice doc** — canonical voice.
- **`BOARD.md`** — live coverage / metrics.
