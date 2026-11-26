// Praxis rig -- suite r3: the book page and its artifact (R3, L4b-3b, v3.343). Every step is driven through the
// rendered pages (#book/<id>, #artifact/<id>), as a reader taps them.
//   s  the saving proof: the artifact's words changed on its page with no signal, and "This moved me" turned on in
//      "More about this book" with no signal; the app closed; the signal back; reopened: both kept, on the device and
//      in the cloud, and a second device reads them.
//   r  an existing artifact: Edit, every word cleared, Save; then spaces only, Save: what is stored each time.
//   (R-4, Preston's rulings of 26 Nov: A -- the reader's own artifact counts as existing even with no words, "Open it",
//   then Edit; and the guard -- "Write your artifact" refuses a title and no words. Before the fix this suite's first
//   cut read 16 / 18 on the staged build: words typed into Write for an artifact with no words were dropped.)
//   a  an artifact with a title and an empty body (as main can make, and as a load can bring): the new book page
//      offers "Open it", not "Write your artifact".
//   b  Open it, Edit, words, Save; closed; reopened: the words on the device, in the cloud, and on a second device.
//   c  Write your artifact with a title and no words, then spaces only: Save disabled, nothing stored, no artifact.
//   d  Write your artifact with a title and words still saves: on the new page; with BK4_ARTIFACT_PAGE off; and on
//      the earlier page's Write (renderBookDetailV1 called directly on a signed-in device -- no route draws that page
//      signed in, so this proves the shared editor's guard and save there, not that the page is reachable; signed out,
//      the routed earlier page offers no Write at all, which the suite records).
// Run: powershell -NoProfile -ExecutionPolicy Bypass -File tools/rig/run.ps1 -Suite r3 -Tree . -Label HEAD -Out <log>
// The README's seven behaviours this suite imitates: 5 (the app closed before a write lands: s, b). Not 1-4, 6, 7.
// Rig code, not app code: the app's ES3 rule does not bind it.
'use strict';

rigSuite(async function () {
  const U = 'r3-reader';
  const LATCHES_OPEN = 'booksLoaded === true && arcsLoaded === true && subTheoriesLoaded === true && themesLoaded === true && artifactsLoaded === true && notebookLoaded === true';
  print('== R3 behaviour rig on ' + LABEL + ' ==');
  async function reopen(d) { d.close(); await d.open(); await d.waitFor(LATCHES_OPEN, 40000); await d.wait(1200); return d; }
  const go = async (d, h) => { await d.ev('location.hash = ' + J(h)); await d.wait(700); };
  const click = async (d, sel) => { const r = await d.ev('(function(){ var e = document.querySelector(' + J(sel) + '); if (!e) { return false; } e.click(); return true; })()'); await d.wait(500); return r; };
  const clickText = async (d, sel, txt) => { const r = await d.ev('(function(){ var l = document.querySelectorAll(' + J(sel) + '), i; for (i = 0; i < l.length; i++) { if (l[i].textContent.replace(/^\\s+|\\s+$/g, "") === ' + J(txt) + ') { l[i].click(); return true; } } return false; })()'); await d.wait(500); return r; };
  const type = (d, sel, words) => d.ev('(function(){ var t = document.querySelector(' + J(sel) + '); if (!t) { return false; } t.value = ' + J(words) + '; t.dispatchEvent(new Event("input")); return true; })()');
  const art = (d, k) => d.ev('(function(){ var a = state.bookArtifacts[' + J(k) + ']; return a ? { body: a.body, up: a.updatedAt } : null; })()');
  const cloudBody = (k) => { const a = get(rig.cloud.arts(U), k); return a ? get(a, 'body') : null; };
  const moved = (d, b) => d.ev('state.books[' + J(b) + '].movedMe === true');
  const cloudMoved = (b) => { const r = rig.cloud.book(U, b); return r ? r.movedMe === true : null; };
  const offers = (d) => d.ev("(function(){ var l = document.querySelectorAll('#app .bk4 .bk4-btn2'), i, out = []; for (i = 0; i < l.length; i++) { out.push(l[i].textContent); } return out; })()");

  await stage('setup', 'a reader with three books; one carries an artifact with words');
  const P = await (await rig.device('phone').open()).sign_in(U);
  const bS = await P.ev("T.addBook('Book S')"), bE = await P.ev("T.addBook('Book E')"), bW = await P.ev("T.addBook('Book W')");
  const kS = await P.ev('T.artifact(' + J(bS) + ", 'the first words of artifact S')");
  const kE = await P.ev('T.artifact(' + J(bE) + ", 'the words of artifact E')");
  await P.wait(1000);
  check('setup the cloud holds the two artifacts and Book S not moved', [cloudBody(kS), cloudBody(kE), cloudMoved(bS)], ['the first words of artifact S', 'the words of artifact E', false]);

  // ---------------------------------------------------------------- s
  await stage('s', 'no signal: the artifact\'s words changed on its page, "This moved me" turned on; closed; signal back; reopened');
  rig.cloud.offline.add('phone');
  await go(P, '#artifact/' + bS);
  check('s the new artifact page is drawn, Edit opens the field', [await P.ev("!!document.querySelector('#app .bk4.bk4a')"), await click(P, '#bk4-edit'), await P.ev("!!document.querySelector('.bk4 .bk4-ta')")], [true, true, true]);
  await type(P, '.bk4 .bk4-ta', 'artifact S, rewritten with no signal');
  check('s Save', await clickText(P, '.bk4 .bk4-two button', 'Save'), true);
  await go(P, '#book/' + bS);
  check('s More about this book opens', await click(P, '#bk4-mrow'), true);
  check('s "This moved me" turns on', [await click(P, '.bk4 .bk4-more .bk-moved'), await moved(P, bS)], [true, true]);
  check('s on the device at once; the cloud still the old (offline)', [(await art(P, kS)).body, cloudBody(kS), cloudMoved(bS)], ['artifact S, rewritten with no signal', 'the first words of artifact S', false]);
  await P.wait(400);
  P.close(); rig.cloud.offline.delete('phone'); await reopen(P);
  check('s after reopen: the words and moved-me kept, on the device and in the cloud',
    [(await art(P, kS)).body, cloudBody(kS), await moved(P, bS), cloudMoved(bS)],
    ['artifact S, rewritten with no signal', 'artifact S, rewritten with no signal', true, true]);
  const L = await (await rig.device('laptop').open()).sign_in(U);
  await L.waitFor(LATCHES_OPEN, 40000); await L.wait(800);
  check('s a second device reads both', [(await art(L, kS)).body, await moved(L, bS)], ['artifact S, rewritten with no signal', true]);
  L.close();

  // ---------------------------------------------------------------- r
  await stage('r', 'an existing artifact: Edit, every word cleared, Save; then spaces only, Save');
  await go(P, '#artifact/' + bE);
  const e0 = await art(P, kE);
  await click(P, '#bk4-edit'); await type(P, '.bk4 .bk4-ta', '');
  const eDis1 = await P.ev("(function(){ var l = document.querySelectorAll('.bk4 .bk4-two button'); return l[1] ? l[1].disabled : null; })()");
  await clickText(P, '.bk4 .bk4-two button', 'Save');
  check('r cleared: Save is disabled and refused; the stored words and stamp unchanged; the field still open', [eDis1, await art(P, kE), await P.ev("!!document.querySelector('.bk4 .bk4-ta')")], [true, e0, true]);
  await type(P, '.bk4 .bk4-ta', '   \n  ');
  const eDis2 = await P.ev("(function(){ var l = document.querySelectorAll('.bk4 .bk4-two button'); return l[1] ? l[1].disabled : null; })()");
  await clickText(P, '.bk4 .bk4-two button', 'Save');
  check('r spaces only: Save is disabled and refused; the stored words unchanged', [eDis2, await art(P, kE)], [true, e0]);
  await clickText(P, '.bk4 .bk4-two button', 'Cancel');
  await go(P, '#book/' + bE);
  check('r the book page then offers Open it, not Write', await offers(P), ['Open it']);
  await P.wait(600);
  check('r the cloud still holds the words', cloudBody(kE), 'the words of artifact E');

  const EDBODY = '#book-detail-editor-host .notebook-editor-body', EDSAVE = '#book-detail-editor-host .notebook-editor-save';
  const saveOff = (d) => d.ev('(function(){ var b = document.querySelector(' + J(EDSAVE) + '); return b ? b.disabled : null; })()');
  const keyOf = (d, b) => d.ev('artifactKey(T.uid(), ' + J(b) + ')');

  // ---------------------------------------------------------------- a
  await stage('a', 'an artifact with a title and an empty body: the new book page offers Open it, not Write');
  const kW = await P.ev('T.artifact(' + J(bW) + ", '')");
  await P.wait(600);
  check('a the artifact is stored with an empty body, on the device and in the cloud', [(await art(P, kW) || {}).body, cloudBody(kW)], ['', '']);
  await go(P, '#book/' + bW);
  check('a the book page offers Open it and not Write your artifact', await offers(P), ['Open it']);

  // ---------------------------------------------------------------- b
  await stage('b', 'Open it, Edit, words, Save; closed; reopened; a second device');
  check('b Open it goes to the artifact page', [await clickText(P, '#app .bk4 .bk4-btn2', 'Open it'), await P.ev('location.hash')], [true, '#artifact/' + bW]);
  check('b Edit opens the field', [await click(P, '#bk4-edit'), await P.ev("!!document.querySelector('.bk4 .bk4-ta')")], [true, true]);
  await type(P, '.bk4 .bk4-ta', 'the words I wrote into the empty artifact');
  check('b Save', await clickText(P, '.bk4 .bk4-two button', 'Save'), true);
  check('b on the device at once', (await art(P, kW) || {}).body, 'the words I wrote into the empty artifact');
  await P.wait(600);
  P.close(); await reopen(P);
  check('b after a close and reopen: on the device and in the cloud', [(await art(P, kW) || {}).body, cloudBody(kW)], ['the words I wrote into the empty artifact', 'the words I wrote into the empty artifact']);
  const T2 = await (await rig.device('tablet').open()).sign_in(U);
  await T2.waitFor(LATCHES_OPEN, 40000); await T2.wait(800);
  check('b a second device reads the words', (await art(T2, kW) || {}).body, 'the words I wrote into the empty artifact');
  T2.close();

  // ---------------------------------------------------------------- c
  await stage('c', 'Write your artifact with a title and no words, then spaces only: Save disabled, nothing stored');
  const bC = await P.ev("T.addBook('Book C')"); await P.wait(400);
  const kC = await keyOf(P, bC);
  await go(P, '#book/' + bC);
  check('c Write your artifact is offered and opens the editor with the title filled in', [await clickText(P, '#app .bk4 .bk4-btn2', 'Write your artifact'), await P.ev("(document.querySelector('#book-detail-editor-host .notebook-editor-title-input') || {}).value")], [true, 'Book C']);
  await type(P, EDBODY, '');
  const cOff1 = await saveOff(P); await click(P, EDSAVE);
  check('c a title and no words: Save disabled, no artifact stored', [cOff1, await art(P, kC)], [true, null]);
  await type(P, EDBODY, '   \n  ');
  const cOff2 = await saveOff(P); await click(P, EDSAVE);
  check('c spaces only: Save disabled, no artifact stored', [cOff2, await art(P, kC)], [true, null]);
  await P.wait(600);
  check('c the cloud holds no artifact for the book', cloudBody(kC), null);
  await click(P, '#book-detail-editor-host .notebook-editor-cancel');

  // ---------------------------------------------------------------- d
  await stage('d', 'Write your artifact with a title and words still saves: the new page, the switch off, the earlier page');
  const bN = await P.ev("T.addBook('Book N')"), bO = await P.ev("T.addBook('Book O')"), bV = await P.ev("T.addBook('Book V')");
  await P.ev('T.editBook(' + J(bV) + ", 'read')"); await P.wait(400);
  const kN = await keyOf(P, bN), kO = await keyOf(P, bO), kV = await keyOf(P, bV);
  await go(P, '#book/' + bN);
  await clickText(P, '#app .bk4 .bk4-btn2', 'Write your artifact');
  await type(P, EDBODY, 'words for book N');
  const dOff1 = await saveOff(P); await click(P, EDSAVE);
  check('d the new page: Save enabled, the words stored, then Open it offered', [dOff1, (await art(P, kN) || {}).body, await offers(P)], [false, 'words for book N', ['Open it']]);
  await P.ev('BK4_ARTIFACT_PAGE = false');
  await go(P, '#book/' + bO);
  check('d switch off: the book page is still the new page', await P.ev("!!document.querySelector('#app .bk4[data-bk4]')"), true);
  await clickText(P, '#app .bk4 .bk4-btn2', 'Write your artifact');
  await type(P, EDBODY, 'words for book O');
  await click(P, EDSAVE);
  await go(P, '#artifact/' + bO);
  check('d switch off: the words stored, and the earlier artifact page shows them', [(await art(P, kO) || {}).body, await P.ev("!!document.querySelector('#app .bk4')"), await P.ev("(document.querySelector('#app .artifact-body') || {}).textContent")], ['words for book O', false, 'words for book O']);
  await P.ev('BK4_ARTIFACT_PAGE = true');
  await go(P, '#book/' + bV);
  await P.ev('renderBookDetailV1(' + J(bV) + ')'); await P.wait(500);
  check('d the earlier page (drawn signed in) offers its Write', await P.ev("!!document.querySelector('#app .bk-artifact-write')"), true);
  await click(P, '#app .bk-artifact-write');
  await type(P, EDBODY, '');
  const dOff2 = await saveOff(P);
  await type(P, EDBODY, 'words for book V');
  const dOff3 = await saveOff(P); await click(P, EDSAVE);
  check('d the earlier page: the guard holds (no words: disabled), then the words are stored', [dOff2, dOff3, (await art(P, kV) || {}).body], [true, false, 'words for book V']);
  await P.wait(600);
  check('d the three artifacts reach the cloud', [cloudBody(kN), cloudBody(kO), cloudBody(kV)], ['words for book N', 'words for book O', 'words for book V']);
  const G = await rig.device('guestphone').open();
  await G.ev("(function(){ state.books['bk_r3_out'] = { id: 'bk_r3_out', title: 'Signed-out book', author: '', status: 'read' }; ensureBookFields(state.books['bk_r3_out']); })()");
  await go(G, '#book/bk_r3_out');
  check('d signed out: the earlier page is drawn and offers no Write (nothing can be saved signed out)',
    [await G.ev('getCurrentUser() ? getCurrentUser().uid : null'), await G.ev("!!document.querySelector('#app .bk4')"), await G.ev("!!document.querySelector('#app .bk-surface')"), await G.ev("!!document.querySelector('#app .bk-artifact-write')")],
    [null, false, true, false]);
  G.close();

  const errs = [];
  for (const d of [P, L, T2, G]) { for (const e of d.errors) { errs.push(e); } }
  check('page errors on every device', errs, []);
});
