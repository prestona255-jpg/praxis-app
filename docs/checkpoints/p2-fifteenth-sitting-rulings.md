# Praxis P2 — fifteenth sitting (2026-10-25, Fable 5.1): the design chat, week two

Status: chat-side ruling record for RULINGS.md and the carry bundle. All at rec unless marked. Ground: live praxis-v3.308 (ba7b289, SCAN-FIX.6); Day Three mockup https://claude.ai/artifact/BmfRosMKbojCNcGLTAC2R7 (v2.3, Version 9); token canon https://claude.ai/artifact/StHiVkvrCAdNdiNDnDQNKP (Version 3); lens colours https://claude.ai/artifact/Fji2ud2Pivyif1DrHh5emM; consent copy https://claude.ai/artifact/LPaGkxjAynXjzE5CUTjAUy.

## A. The token canon (19 Oct, confirmed here)
40. L1 = the whole token layer across five sheets (theme · lumen-amber · praxis-kit · universal-depth · the scope blocks of components.css), then a flat pass as stage 2 (backdrop-filter 16→0, gradient fills flat, button{font:inherit}). theme.css alone reaches 395 of 880 definitions; the beta's rooms define their tokens as literals in components.css.
41. NIGHT IS THE DEFAULT (restores r39 of 18 Oct; the 19 Oct "follow the phone" tap had not been offered it). :root holds night; [data-mood="day"] and [data-mood="auto"] (Match my phone, under prefers-color-scheme: light) are the day blocks. theme-color, manifest and launch screen #24180C. Supersedes v1.1 R1's day default.
42. No error colour: the quiet card (gold-ink rule). --danger → --gold-ink. Retired hues are aliased, not purged.
43. Four canon numbers corrected by measurement: --stem #3D6446 on paper (was #45704F, 4.02); --stem-sky #8DB08A on any sky; body text on --page-3 is --ink only; NEW --line-field = ink-3 / on-night-3 for field boundaries; the Bloom's day edge .38 → .56.
44. The Day Three mockup takes the token sheet's paper values (files win for values).

## B. Day Three (walked and approved 25 Oct: "everything is good")
45. SEARCH, redrawn: a labelled "Search" pill on Home, Shelf and Notebook; the scope (Books · Notes · Lenses with counts, the Journal never) sits under the box and never leaves; recent searches say what they found; one list in three groups with one row anatomy; scope chips filter.
46. OPEN LENS replaces "Open on the shelf": a lens page (#lens/<id>) — mark and name, counts; the reader's ideas first (Yumi's question, why you keep returning, what you said back) with "Think it through with Yumi" pinned to the lens; every book; the notes on those books; Rename · See on the shelf · Let it go. Back returns to origin.
47. A CATEGORY PAGE the same way (#category/<id>): tap a band's name or See all — every book, the lenses through them, the notes, "Ask Yumi about these books" pinned to the category.
48. TWO HANDS FOR THE LENS COLOURS: Garden (amendment 1.3's ten) and Galaxy (the You page's muted wheel), switchable in Settings ("Lens colours"). A lens keeps its shape and inner design across the switch. Options A (hashed hue), C (pigments) and E (sunflower only) not taken. Terracotta stays Yumi's and appears in neither.
49. THE READER CHOOSES THE HAND IN THE FIRST WALK: at the lens sky, with their first lenses moving, two cards under them; tapping re-paints live; whichever is on at "Keep going" is kept. No new stop. Folds into the walk mockup with L5.
50. Pills centre their words (the row-button reset was leaking into segmented controls).
51. The suite tools/walk3.py (every state × night/day × 390/360/320) is the gate for the Day Three mockup: 360 runs, 0 fails at v2.3.

## C. Consent (item 6) — see praxis-consent-copy.md
52. The consent sheet is the L3 source for every ask: the one yes, the ledger, reads-along (off for new accounts), outside angles, dictation's first ask, mic/camera refused, read-aloud (asks once, ruled), "Yumi may read this" (off), error counts (off), the camera card's honest wording, the sign-in sub-line. Flags additive only.

53. Call A ruled: read-aloud asks once on first use, same shape as dictation's sheet ("Her words go to ElevenLabs to be spoken, including any of your notes she quotes. · Read aloud · Not now"); flag profile.readAloudAsked NEW. The Settings row "Each asks the first time" stands. No open calls remain on the consent sheet.

## D. The Scan screen (item 5) — mockup https://claude.ai/artifact/EWwdQLnb1KVuLrYZwUttCb (16 states, suite 96 runs / 0 FAIL)
54. TYPE IT IN has a home on the live camera: a glass pill under the guide line, in Book and Shelf mode alike, labelled with the words. It opens one sheet over the dimmed camera (decode stops while it is up).
55. One field, two meanings: digits are an ISBN, words search titles and authors on Google Books (no AI, nothing of the reader's sent). The hint says so.
56. A typed ISBN never commits at once: it goes through the same verdict sheet as a barcode, with the source line reading "Typed · <isbn>" and "Not this one" returning to the field with the digits kept. Closes thirteenth O7c (a typo pulling a junk Open Library record straight onto the shelf). A number that checks out but finds nothing, or fails its check digit, says "No book has this ISBN" above the field and offers Search by title instead.
57. Title results: at most five rows, cover · title · author · year, the same row shape as Add a book on the Shelf (twelfth r23). Tapping a row opens the verdict; nothing is added from the list.
58. The verdict's empty state leads to typing: "Not found" shows the barcode's ISBN and offers "Type the title instead" as the primary door (the typed sheet opens with that ISBN noted); Keep scanning is the quiet one. Already-shelved keeps the fold and offers Open it.
59. The camera card says what is true (consent sheet card 10): "Before the camera comes on" — a barcode is read on the phone and nothing leaves; a photo of a shelf or a cover goes to Claude to read the titles, Praxis doesn't keep it, Anthropic deletes it within 30 days. Turn on camera; the hatch "Add without the camera" opens Type it in directly over the dark ground. The gate, the remembered grant and Safari's own prompt are unchanged.
60. Camera refused and offline cards carry the typed field inside the card ("Or type it in" / "ISBN, kept for later"), so adding by name is one tap here rather than a hand-off to #books. Refused wording as ruled (r35; consent sheet).
61. Inside the App Store app the viewfinder is the iPhone's own scanner (thirteenth r25, L7b): the ring reads "iPhone · auto", the title carries "iPhone's scanner", and everything the reader touches — pill, modes, shutter, verdict, tray — is unchanged. The web keeps zxing.
62. The camera is always the seed-head sky whatever the mood; the sheets and cards over it follow the mood (day paper by day).

63. THE NOT-ON-THE-LIST SCREEN (L3, never drawn; ruled in words, quiet-card dialect, r35): title "Praxis is a small beta right now"; body "This address isn't on the list yet. Preston adds readers by hand, so nothing is wrong on your side."; one action "Ask Preston for a place" (the feedback door's mail route); quiet "Sign out". Shown after sign-in when the uid is not in the allowlist; no data is read or written for that uid.
64. L3 OPENS as two commits in one chat: L3.1 consent (v3.309) then L3.2 hygiene (v3.310); the one-yes sheet is built as a component reachable from What Yumi Sees and the quiet Yumi dock, and the first-run walk reuses it in L5. The twelfth's "Google sign-in in the installed app, redirect fallback" is superseded by native sign-in in L7b and is not in L3.

## E. Next
App Store screenshots in December, after L1. Item 4's remaining screens (Settings, Fix-this-book preview, day two) are in Day Three already.
