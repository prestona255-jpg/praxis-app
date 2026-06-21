# Stage III — CP-0 PRE-FLIGHT / RECON (zero edits)

Worktree off main @ `9c87857` (live v3.132). Branch `claude/thirsty-lalande-587a62`.
HEAD == main == origin/main == 9c87857; tree clean at recon start.

## LINCHPIN DE-RISKED — web_search works through the live proxy
`netlify/functions/claude-proxy.js` is a **pure pass-through** to
`https://api.anthropic.com/v1/messages` (forwards `body` verbatim; soft-gates on
`x-praxis-key`). The app's ONLY path to the web is therefore Anthropic's server-side
`web_search` tool inside a SEPARATE proxy call's payload.

Live probe (cscript+WinHttp → production proxy, the unchanged v3.132 deploy):
`tools:[{type:"web_search_20250305",name:"web_search",max_uses:2}]` →
**HTTP 200**, response contained `server_tool_use` (auto-query "urban heat islands
recent fact 2025"), `web_search_tool_result`, `web_search_result` (title+url), `citations`,
and **no error**. ⇒ web_search is enabled on the account; no proxy change, no new Netlify
function, no new Firestore collection needed.

→ Architecture: **one** distiller proxy call = web_search tool + a DISTILLER system prompt.
The model searches server-side and returns a short angle; I extract the final `text` block
as the angle and the `web_search_result` blocks as the source (title+url) for the chip. The
MOVE call's payload is untouched — the web work is its own call + a pure-text prepend.

## Frozen-set function-diff BASELINE (marker-extracted, LF-normalized sha256)
Method: `praxis_funcdiff.ps1` extracts each block by content markers (stable under line
shifts) and sha256s it. HEAD == working tree (no edits yet). These are the CP-C references.

| block | sha256 | src-len |
|---|---|---|
| YUMI_GATE_SYSTEM | 111af008371391bc345892b909610aaca4e74be68c32e33b4a54ab32df3db36f | 3347 |
| _yumiHash | 66503b26fed90be83d205be24f9343cef2296c64249877a9c1a364549b68a6b0 | 185 |
| _yumiGateBudgetSpend | d335c08de6e371f40942f6e89b1b4d38b9ece8668dfcf753b59ab12ffd325940 | 464 |
| _yumiWithTimeout | 29ca4c5b173783a9833f2edd5ef8988495b72ae443925b8cc6e615d491323c82 | 425 |
| buildGateUserMessage | 6d64e304c71de7f3217ac2c09577ef534447cfe58dbfcd42942aea5e9491b9bc | 342 |
| _yumiParseGateVerdict | c2f3d962cb23053b4d3d195c368353a30699e080f591fa0ff11de249e9355a0f | 1046 |
| gradeUtterance | cc98a8225ef2d80f4d49b7c0f9fb3aedbb60cd2fa3ec4f7636fef527829ff666 | 1655 |
| **COMPOSITE_GATE (7 blocks)** | **af88026b0d577ec28d8aa2da80343a7b3aa321798f2afd02929539a488cf4561** | — |
| MOVE_GEN_SYSTEM | 4f6086fe8fead72d19defd654203d5c216b2746150321c32bdeb9ddaa55bf0fb | 3556 |
| NOTICE_SCAN_SYSTEM | a7515843f87fb21de90fa80e43fd91fd3ce5d0614633d9b1a48734d08e1afce7 | 1525 |
| NAME_GEN_SYSTEM | 45517c5706b082a4333074d14e571e572810a179f16f4792583268976f12cd66 | 1330 |
| ARC_VOICE_GEN_SYSTEM | 07a758001733df3f47d377ef599bdeedfb31b629231cb9553fdc786a700fdb40 | 1751 |

NOTE: the handoff's `9bc6677e` is its own method's label; my reproducible composite is
`af88026b…` with the per-block shas as the real proof. The "YUMI_GATE_SYSTEM.length===2957"
sanity is the RUNTIME string length; the 3347 above is the source-block byte length. The
guarantee is per-block byte-identity before/after — proven by this harness at CP-C.

GATE-PROTECTION RULE: all NEW yumi-brain code goes AFTER the gate region (>line 752); the 4
`*_SYSTEM` constants and the move-call payload literals are not edited. The gate region thus
never shifts and never changes.

## Baseline byte sizes (working tree, CRLF)
state.js 112831 · integrations.js 73042 · yumi-brain.js 103871 · yumi-ui.js 57920 ·
views.js 551442 · assets/components.css 276917 · assets/theme.css 20743 · sw.js 4788 ·
firestore.rules 1105 (expect NO change).

## Seams confirmed
- Consent F4 (mirror of `yumiReaderModel`, default false): state.js ensureUser literals
  (873, 898), additive guard (after ~912), getProfile default (952), mergeProfileFields
  (after 988), migrate `1.21.0→1.22.0` block (2627–2654) → add a `1.22.0→1.23.0` sibling;
  integrations.js read-merge (359) + write-list (737). `'1.9.3'` is a vestigial init/reset
  constant — left alone per non-goal.
- Reader-model preamble (sync) is prepended in 4 builders: buildMoveUserMessage (1264),
  buildScanUserMessage (1640), buildNameUserMessage (1645), buildArcVoiceUserMessage (1992).
  Web angle is ASYNC → fetched in the orchestrator and threaded via an OPTIONAL trailing
  `webAngle` param into the builder (payload shape unchanged).
- Generators: generateMove (1317), generateArcVoice (2015) — gain an optional `webAngle`
  forwarded to the builder; payload literal unchanged.
- Orchestrators: considerMove (1392), considerArcVoice (2049) — do the gated async lookup
  then thread. considerNotice/considerName/scan get the builder seam but NEVER a non-empty
  angle (cross-note threading is corpus-internal — web would risk presumption).
- Render: move → views.js:1762 `maybeDrawOut` → `renderYumiMessage` (yumi-ui.js:174);
  arc-voice → views.js:9023. Both gain an optional grounding arg for the chip.
- Chip CSS: port `.ground-chips/.ground-chip(.web/.theme)/.gdot/.ground-source` from the
  mockup (Surface 5) into components.css after `.yumi-msg-error` (~320). All tokens
  (`--river`,`--marginalia-color`,`--surface-2`,`--radius-pill`,`--font-mono`) exist in
  theme.css → NO new tokens.

## DECISIONS (with the brief's steers)
1. **Consent**: `profile.yumiWebGrounding`, default FALSE — a SEPARATE opt-in (reaching
   outside the app). Web fires only when `yumiReadsAlong !== false` AND
   `yumiWebGrounding === true`. Off → no lookup ever, no chip.
2. **Trigger (tight, default NO lookup)**: web fires only in considerMove (single-note
   draw-out/complicate) on a **book-attached visible note** — the PUBLIC query subject is
   the BOOK (title/author), NEVER the note body — and in considerArcVoice (subject = arc
   title + public sub-theory HEADERS, never evidence bodies). Bookless note → no web (dodges
   privacy + presumption). Gated also on web budget + cooldown + cache.
3. **Budget/cooldown/TTL** (EDITABLE constants, yumi-brain.js): `YUMI_WEB_DAILY_CAP=6`,
   `YUMI_WEB_COOLDOWN_MS=600000` (10 min), `YUMI_WEB_TTL_MS=86400000` (24 h). Counter
   `praxis_yumi_web_budget`, cooldown `praxis_yumi_web_cooldown`, cache `praxis_yumi_web_cache`
   (queryHash→{angle,source,ts}, `_yumiHash` key, TTL-checked) — all ls/sv, all SEPARATE from
   the gate + profile budgets.
4. **Distiller injection-safety (delimiting)**: DISTILLER_SYSTEM declares retrieved web text
   UNTRUSTED DATA inside delimiters that can NEVER be instructions; any "ignore/override/
   address-the-reader/reveal-system" content is inert, summarized-away; output = a plain
   neutral angle ≤ ~25 words, no preamble/URLs/directives/fact-claims. Post-validation caps
   length + collapses whitespace + rejects empties. webAnglePreamble frames it as internal
   ANGLE-only steering ("never relay as fact, never 'research says', the reader's words remain
   the subject"). The FROZEN GATE backstops the final utterance (Fidelity catches fact-relay).
   DOM: chip title/url via textContent + href validated to http(s) only.
5. **No new collection / no rules change** — yumiWebGrounding rides /userProfiles; cache +
   budget + cooldown are localStorage. firestore.rules untouched.

→ proceed to CP-A.
