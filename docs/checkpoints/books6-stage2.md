# Books #6 — Stage 2: Matcher accuracy

## Change (integrations.js only)
`scoreVolume` penalties added; strong-confidence gate raised.
- ISBN absent: `-10` (was `+10`/`0`). Cover absent: `-6` (soft). Non-BOOK printType: `-12` (was `-10`).
- Implausibly-old: year `<1900 → -30`, `<1950 → -6` (catches the "The Builder" 1890 scanned-periodical artifact).
- Periodical/index markers in title+subtitle (`index|proceedings|transactions|periodical|magazine|bulletin|gazette|catalogue|catalog|annual report`, `vol. N`, `no. N`): `-25`.
- Strong gate (title-kind): `score>=60 && closeness>=0.65 && volumeIsbn(top)` (was `score>=55 && closeness>=0.6`). No ISBN → falls to 'weak' → review flags "check this". ISBN-kind query stays 'strong' (authoritative).
- `flagOf` in views.js already maps `status==='weak'` → 'low' → "check this"; no views change.

## Self-verify (PASS — actual shipped functions, live in preview, SW bypassed)
`hasNewSource:true` (confirmed new scoreVolume body loaded, not stale SW cache).

| fixture | score | status | expected |
|---|---|---|---|
| "The Builder" 1890 periodical (ISBN+cover) | 47 | **weak** | flagged, not auto-picked ✓ |
| Pedagogy of the Oppressed (modern, ISBN+cover+author) | 102 | **strong** | auto-picks ✓ |
| "Journal of Education, Vol. 12" vs "Education Today" | 12 | — | heavily down-ranked (periodical −25) ✓ |
| The Fire Next Time, NO ISBN (good title+author+cover) | 82 | **weak** | no-ISBN can't auto-confirm ✓ |
| The Fire Next Time, ISBN, NO cover | 88 | **strong** | legit no-cover still auto-picks (mockup parity) ✓ |

- byte delta integrations.js: 64574 → 66187 (+1613); diffstat 1 file +31/−6 (scoped).
- `score -= ` count: 6; `topHasIsbn`: 2.
- console errors after boot: none; "views.js loaded" / "App init" normal.

PASS → committed local → continue Stage 3.
