// Praxis rig -- suite d1a: fix build 1b, part one (D1a, 24 Nov 2026). An edit to a record the cloud already
// has, made while its write cannot land, survives the app being closed (audit BR-03; fb-1a.md L1); the
// duplicate merge's artifact site (fb-1a.md L4); the size meter on each reader document. Scenarios a to h are
// the brief's, in its order; i, j and k are Preston's three additions of 24 Nov 2026, and l to o his ruling at the commit gate
// (an artifact whose book is gone, a sub-theory whose arc is gone: stays deleted; D1a's memory cleared); i to o run before h.
// Each one fails on the code before D1a (v3.340) and passes after it.
// Run: powershell -NoProfile -ExecutionPolicy Bypass -File tools/rig/run.ps1 -Suite d1a -Tree . -Label HEAD -Out <log>
// The README's seven behaviours this suite imitates: 2 (a sign-in event after the app is up: i), 3 (the app
// writing by itself: f), 4 (a second device behind the cloud: b, c, e, f), 5 (the app closed before a write
// lands: a, b, c, d, f, g, j, k), 6 (one collection's read failing alone: j). Not 1 or 7.
// Rig code, not app code: the app's ES3 rule does not bind it.
'use strict';

rigSuite(async function () {
  const U = 'd1a-reader';
  const LATCHES_OPEN = 'booksLoaded === true && arcsLoaded === true && subTheoriesLoaded === true && themesLoaded === true && artifactsLoaded === true && notebookLoaded === true';
  const ROOM = 'Praxis is running low on room for your library. Please tell Preston.';
  const FULL = 'Praxis can’t save more of your library to the cloud. Your work is kept on this device. Please tell Preston.';
  print('== D1a behaviour rig on ' + LABEL + ' ==');
  // A write that lands in the cloud while its answer is lost (d3): applied, then answered "offline", so the
  // device keeps it queued and never hears it landed.
  let dropAck = null;
  const baseHandle = rig.cloud.handle.bind(rig.cloud);
  rig.cloud.handle = function (dev, op, path, body) {
    if (dropAck && op === 'set' && dev === dropAck.dev && path.indexOf(dropAck.col + '/') === 0) { baseHandle(dev, op, path, body); return J({ offline: true }); }
    return baseHandle(dev, op, path, body);
  };
  const waiting = (d) => d.ev("(function(){ if (typeof d1aWaiting !== 'function') { return 'no record of what is waiting'; } var w = d1aWaiting(T.uid()), k, out = {}; for (k in w) { if (w[k].changed.length + w[k].created.length + w[k].deleted.length) { out[k] = w[k]; } } return out; })()");

  // A device opened afresh with a signal, its six loads answered.
  async function reopen(d) { d.close(); await d.open(); await d.waitFor(LATCHES_OPEN, 40000); await d.wait(1200); return d; }
  // The artifact page's "Yumi may read this" switch (R3 moved it there from the book page), clicked as a reader clicks it. Returns its state after the click.
  async function flip(d, bookId) {
    await d.ev('location.hash = ' + J('#artifact/' + bookId)); await d.wait(500);
    return d.ev("(function(){ var s = document.querySelector('.art-may-switch'); if (!s) { return 'no switch'; } s.click(); return s.getAttribute('aria-checked'); })()");
  }
  const devArt = (d, k) => d.ev('(function(){ var a = state.bookArtifacts[' + J(k) + ']; return a ? { body: a.body, on: a.yumiMayRead === true } : null; })()');
  const cloudArt = (k) => { const a = get(rig.cloud.arts(U), k); return a ? { body: get(a, 'body'), on: a.yumiMayRead === true } : null; };
  const devStatus = (d, b) => d.ev('state.books[' + J(b) + '] ? normalizeStatus(state.books[' + J(b) + '].status) : null');
  const cloudStatus = (b) => { const r = rig.cloud.book(U, b); return r ? r.status : null; };

  // ---------------------------------------------------------------- set-up, online
  await stage('setup', 'the phone signs in and writes the records the scenarios change; the laptop loads them');
  const P = await (await rig.device('phone').open()).sign_in(U);
  const bA = await P.ev("T.addBook('Book A')"), bC = await P.ev("T.addBook('Book C')"), bD = await P.ev("T.addBook('Book D')"), bD2 = await P.ev("T.addBook('Book D two')");
  const bE = await P.ev("T.addBook('Book E')"), bF1 = await P.ev("T.addBook('Book F one')"), bF2 = await P.ev("T.addBook('Book F two')");
  const nA = await P.ev("T.note('note A, as first written')"), nB1 = await P.ev("T.note('note B1, as first written')"), nB2 = await P.ev("T.note('note B2, as first written')"), nE = await P.ev("T.note('note E, as first written')");
  const lA = await P.ev("T.lens('Lens A')"), lC = await P.ev("T.lens('Lens C')");
  const arcA = await P.ev("T.arc('Arc A')");
  const stA = await P.ev('(function(){ var s = createSubTheory(' + J(arcA) + ", { header: 'Sub-theory A' }); return s ? s.id : null; })()");
  const nF = await P.ev("T.note('note F, from an older device')");
  const aA = await P.ev('T.artifact(' + J(bA) + ", 'artifact A')"), aD = await P.ev('T.artifact(' + J(bD) + ", 'artifact D')");
  await P.wait(600);
  check('setup the switch on Book A turns on', await flip(P, bA), 'true');
  await P.ev("location.hash = '#home'"); await P.wait(900);
  check('setup the cloud holds every record, Book A\'s switch on, Book D\'s off',
    [rig.cloud.books(U).length, Object.keys(rig.cloud.notes(U)).length, get(rig.cloud.lens_names(U), lA), cloudArt(aA), cloudArt(aD)],
    [7, 5, 'Lens A', { body: 'artifact A', on: true }, { body: 'artifact D', on: false }]);
  check('setup the arc and its sub-theory are in the cloud', [get(rig.cloud.arcs(U), arcA), get(rig.cloud.sub(U, stA), 'header')], ['Arc A', 'Sub-theory A']);
  const L = await (await rig.device('laptop').open()).sign_in(U);
  await L.waitFor(LATCHES_OPEN, 40000); await L.wait(600);
  check('setup the laptop has the 7 books and 5 notes', [(await L.ev('T.bookIds()')).length, Object.keys(await L.ev('T.notes()')).length], [7, 5]);
  L.close();

  // ---------------------------------------------------------------- a
  await stage('a', 'no signal after a good load: a note, a book, a lens and the switch (off) are changed; closed; signal back; reopened');
  rig.cloud.offline.add('phone');
  await P.ev('T.editNote(' + J(nA) + ", 'note A, edited with no signal')");
  await P.ev('T.editBook(' + J(bA) + ", 'read')");
  await P.ev('renameUserTheme(' + J(lA) + ", 'Lens A, renamed with no signal')");
  check('a the switch on Book A turns off', await flip(P, bA), 'false');
  await P.ev('T.editArc(' + J(arcA) + ", 'Arc A, renamed with no signal')");
  await P.ev('updateSubTheory(' + J(stA) + ", { header: 'Sub-theory A, renamed with no signal' })");
  await P.wait(400);
  P.close(); rig.cloud.offline.delete('phone'); await reopen(P);
  check('a the arc and the sub-theory changes are kept, on the phone and in the cloud',
    [get(await P.ev('T.arcs()'), arcA), await P.ev('state.subTheories[' + J(stA) + '].header'), get(rig.cloud.arcs(U), arcA), get(rig.cloud.sub(U, stA), 'header')],
    ['Arc A, renamed with no signal', 'Sub-theory A, renamed with no signal', 'Arc A, renamed with no signal', 'Sub-theory A, renamed with no signal']);
  check('a on the phone: the four changes are there',
    [get(await P.ev('T.notes()'), nA), await devStatus(P, bA), get(await P.ev('T.lenses()'), lA), (await devArt(P, aA) || {}).on],
    ['note A, edited with no signal', 'read', 'Lens A, renamed with no signal', false]);
  check('a in the cloud: the four changes are there',
    [get(rig.cloud.notes(U), nA), cloudStatus(bA), get(rig.cloud.lens_names(U), lA), (cloudArt(aA) || {}).on],
    ['note A, edited with no signal', 'read', 'Lens A, renamed with no signal', false]);

  // ---------------------------------------------------------------- b
  await stage('b', 'the same note changed on two devices before they sync: the newer edit wins, in both orders');
  await reopen(L);
  rig.cloud.offline.add('phone'); rig.cloud.offline.add('laptop');
  await P.ev('T.editNote(' + J(nB1) + ", 'B1: the phone, older')"); await sleep(60);
  await L.ev('T.editNote(' + J(nB1) + ", 'B1: the laptop, newer')"); await sleep(60);
  await L.ev('T.editNote(' + J(nB2) + ", 'B2: the laptop, older')"); await sleep(60);
  await P.ev('T.editNote(' + J(nB2) + ", 'B2: the phone, newer')"); await P.wait(300);
  P.close(); L.close(); rig.cloud.offline.delete('phone'); rig.cloud.offline.delete('laptop');
  await reopen(P);
  check('b the phone syncs first: B1 holds its own older edit for now, B2 its newer one',
    [get(rig.cloud.notes(U), nB1), get(rig.cloud.notes(U), nB2)], ['B1: the phone, older', 'B2: the phone, newer']);
  await reopen(L);
  await reopen(P);
  check('b B1 (the newer edit synced last): the laptop\'s newer edit, on both devices and in the cloud',
    [get(await P.ev('T.notes()'), nB1), get(await L.ev('T.notes()'), nB1), get(rig.cloud.notes(U), nB1)],
    ['B1: the laptop, newer', 'B1: the laptop, newer', 'B1: the laptop, newer']);
  check('b B2 (the newer edit synced first): the phone\'s newer edit, on both devices and in the cloud',
    [get(await P.ev('T.notes()'), nB2), get(await L.ev('T.notes()'), nB2), get(rig.cloud.notes(U), nB2)],
    ['B2: the phone, newer', 'B2: the phone, newer', 'B2: the phone, newer']);
  L.close();

  // ---------------------------------------------------------------- c
  await stage('c', 'the same book changed on two devices: the device with the unconfirmed change wins');
  rig.cloud.offline.add('phone');
  await P.ev('T.editBook(' + J(bC) + ", 'will-read')");
  await P.ev('renameUserTheme(' + J(lC) + ", 'Lens C, renamed on the phone with no signal')"); await P.wait(300);
  P.close(); rig.cloud.offline.delete('phone');
  await reopen(L);
  await L.ev('T.editBook(' + J(bC) + ", 'read')");
  await L.ev('renameUserTheme(' + J(lC) + ", 'Lens C, renamed LATER on the laptop')"); await L.wait(600);
  check('c the laptop\'s changes land first (cloud: read, the laptop\'s lens name)', [cloudStatus(bC), get(rig.cloud.lens_names(U), lC)], ['read', 'Lens C, renamed LATER on the laptop']);
  L.close();
  await reopen(P);
  await reopen(L);
  check('c the phone\'s unconfirmed change wins: will-read on the phone, the laptop and in the cloud',
    [await devStatus(P, bC), await devStatus(L, bC), normalizeStatusRig(cloudStatus(bC))], ['will-read', 'will-read', 'will-read']);
  check('c a lens is not a book (F1, 24 Nov): the laptop\'s LATER rename wins over the phone\'s unconfirmed one, everywhere',
    [get(await P.ev('T.lenses()'), lC), get(await L.ev('T.lenses()'), lC), get(rig.cloud.lens_names(U), lC)],
    ['Lens C, renamed LATER on the laptop', 'Lens C, renamed LATER on the laptop', 'Lens C, renamed LATER on the laptop']);
  L.close();

  // ---------------------------------------------------------------- d
  await stage('d', 'the switch turned ON with no signal, the app closed, the cloud still says off');
  rig.cloud.offline.add('phone');
  check('d1 the switch on Book D turns on with no signal', await flip(P, bD), 'true');
  const aD2 = await P.ev('T.artifact(' + J(bD2) + ", 'artifact D two, written with no signal')");
  check('d2 a new artifact, written with no signal, has its switch turned on', await flip(P, bD2), 'true');
  await P.ev("location.hash = '#home'"); await P.wait(300);
  P.close(); rig.cloud.offline.delete('phone'); await reopen(P);
  check('d1 Book D\'s switch is off on the phone and in the cloud', [(await devArt(P, aD) || {}).on, (cloudArt(aD) || {}).on], [false, false]);
  check('d2 the new artifact is kept, on the phone and in the cloud', [(await devArt(P, aD2) || {}).body, (cloudArt(aD2) || {}).body],
    ['artifact D two, written with no signal', 'artifact D two, written with no signal']);
  check('d2 and its switch is off on the phone and in the cloud', [(await devArt(P, aD2) || {}).on, (cloudArt(aD2) || {}).on], [false, false]);
  // d3: the switch turned ON online; the write LANDS but its answer never reaches the phone, which closes.
  dropAck = { dev: 'phone', col: 'userArtifacts' };
  check('d3 the switch on Book D turns on, online', await flip(P, bD), 'true');
  await P.wait(600);
  P.close(); dropAck = null;
  check('d3 the cloud did get the ON', (cloudArt(aD) || {}).on, true);
  await reopen(P);
  check('d3 an ON the cloud has is not turned off: on, on the phone and in the cloud', [(await devArt(P, aD) || {}).on, (cloudArt(aD) || {}).on], [true, true]);

  // ---------------------------------------------------------------- e
  await stage('e', 'a write that landed and was confirmed leaves nothing waiting; a later change elsewhere is taken');
  rig.cloud.offline.add('phone');
  await P.ev('T.editNote(' + J(nE) + ", 'note E, edited with no signal')"); await P.wait(300);
  check('e control: an edit with no signal is recorded as waiting (that note only)', await waiting(P), { notebook: { changed: [nE], created: [], deleted: [] } });
  P.close(); rig.cloud.offline.delete('phone'); await reopen(P);
  check('e after the reopen it has been sent, and nothing is waiting', [get(rig.cloud.notes(U), nE), await waiting(P)], ['note E, edited with no signal', {}]);
  await P.ev('T.editNote(' + J(nE) + ", 'note E, edited online on the phone')"); await P.ev('T.editBook(' + J(bE) + ", 'read')"); await P.wait(900);
  check('e both edits reached the cloud', [get(rig.cloud.notes(U), nE), cloudStatus(bE)], ['note E, edited online on the phone', 'read']);
  check('e the phone records nothing waiting to sync', await waiting(P), {});
  P.close();
  await reopen(L);
  await L.ev('T.editNote(' + J(nE) + ", 'note E, edited later on the laptop')"); await L.ev('T.editBook(' + J(bE) + ", 'will-read')"); await L.wait(600);
  L.close();
  await reopen(P);
  check('e the phone takes the laptop\'s later changes', [get(await P.ev('T.notes()'), nE), await devStatus(P, bE)], ['note E, edited later on the laptop', 'will-read']);
  check('e and the cloud keeps them', [get(rig.cloud.notes(U), nE), normalizeStatusRig(cloudStatus(bE))], ['note E, edited later on the laptop', 'will-read']);

  // ---------------------------------------------------------------- f
  await stage('f', 'the app writing by itself (a category stamp, a cover landing, a lens filled in at render, a note from an older device) is not the reader\'s change');
  // a note as an older device wrote it: no 'filed', no 'images' (the merge fills them in on load)
  (function () { const e = rig.cloud.docs['userNotebook/' + U].notebookEntries[nF]; delete e.filed; delete e.images; })();
  await reopen(P);
  // a lens created and confirmed in THIS session, then filled in by the app when drawn, with no load between
  const lF = await P.ev("T.lens('Lens F')"); await P.wait(600);
  check('f a new lens is filled in by the app when it is drawn (no save)', await P.ev('(function(){ var had = state.userThemes[' + J(lF) + '].hasOwnProperty(\'leftOuts\'); lensThemeById(' + J(lF) + '); return [had, state.userThemes[' + J(lF) + '].hasOwnProperty(\'leftOuts\')]; })()'), [false, true]);
  check('f the fill-in is not the reader\'s change: nothing is waiting', await waiting(P), {});
  rig.cloud.offline.add('phone');
  const stamped = await P.ev('T.stampUncategorized()');
  await P.ev('T.coverBackfill(' + J(bF1) + ')');
  await P.ev('T.editBook(' + J(bF2) + ", 'read')"); await P.wait(300);
  print('        reading: the stamp touched ' + stamped + ' books on the phone');
  P.close(); rig.cloud.offline.delete('phone');
  await reopen(L);
  await L.ev('T.editBook(' + J(bF1) + ", 'will-read')");
  await L.ev('renameUserTheme(' + J(lF) + ", 'Lens F, renamed on the laptop')");
  await L.ev('addEntryToArc(' + J(arcA) + ', ' + J(nF) + '); saveState();'); await L.wait(600);   // changes the note's arcIds, stamping no time
  L.close();
  await reopen(P);
  check('f the lens filled in at render takes the laptop\'s rename, on the phone and in the cloud',
    [get(await P.ev('T.lenses()'), lF), get(rig.cloud.lens_names(U), lF)], ['Lens F, renamed on the laptop', 'Lens F, renamed on the laptop']);
  check('f the note from the older device takes the laptop\'s change, on the phone and in the cloud',
    [await P.ev('state.notebookEntries[' + J(nF) + '].arcIds'), get(get(((rig.cloud.docs['userNotebook/' + U] || {}).notebookEntries) || {}, nF) || {}, 'arcIds')], [[arcA], [arcA]]);
  check('f Book F one: the laptop\'s change is taken, on the phone and in the cloud (the stamp and the cover were not the reader\'s)',
    [await devStatus(P, bF1), normalizeStatusRig(cloudStatus(bF1))], ['will-read', 'will-read']);
  check('f Book F two: the reader\'s own change with no signal is kept, on the phone and in the cloud',
    [await devStatus(P, bF2), normalizeStatusRig(cloudStatus(bF2))], ['read', 'read']);

  // ---------------------------------------------------------------- g
  await stage('g', 'Tidy library\'s duplicate merge with no signal, the app closed, the signal back');
  // two copies of each book, through the app's Add-a-book writer (T.addBook keys a book by its title, so the copies differ by a word)
  const g1k = await P.ev("T.addBook('Dup One')"), g1d = await P.ev("T.addBook('Dup One, again')");
  const g2k = await P.ev("T.addBook('Dup Two')"), g2d = await P.ev("T.addBook('Dup Two, again')");
  const g3k = await P.ev("T.addBook('Dup Three')"), g3d = await P.ev("T.addBook('Dup Three, again')");
  const g1art = await P.ev('T.artifact(' + J(g1d) + ", 'written on the copy of Dup One')");
  const g2keepArt = await P.ev('T.artifact(' + J(g2k) + ", 'written on Dup Two')"), g2art = await P.ev('T.artifact(' + J(g2d) + ", 'written on the copy of Dup Two')");
  const g3art = await P.ev('T.artifact(' + J(g3d) + ", 'written on the copy of Dup Three')");
  await P.wait(900);
  const keyOf = (b) => U + ':' + b;
  check('g set-up: the four artifacts are in the cloud', [!!cloudArt(g1art), !!cloudArt(g2keepArt), !!cloudArt(g2art), !!cloudArt(g3art)], [true, true, true, true]);
  // g1 and g2: merged with no signal, closed, reopened
  rig.cloud.offline.add('phone');
  await P.ev('mergeBookDuplicates(T.uid(), ' + J(g1k) + ', [' + J(g1d) + '])');
  await P.ev('mergeBookDuplicates(T.uid(), ' + J(g2k) + ', [' + J(g2d) + '])'); await P.wait(300);
  P.close(); rig.cloud.offline.delete('phone'); await reopen(P);
  check('g1 the moved artifact is on the kept book and not on the dropped one, on the phone',
    [((await devArt(P, keyOf(g1k))) || {}).body || null, await devArt(P, keyOf(g1d))], ['written on the copy of Dup One', null]);
  check('g1 and in the cloud', [(cloudArt(keyOf(g1k)) || {}).body || null, cloudArt(keyOf(g1d))], ['written on the copy of Dup One', null]);
  const g2want = 'written on Dup Two\n\n— merged from a duplicate copy —\nAn artifact\nwritten on the copy of Dup Two';
  check('g2 both had one: the kept artifact carries the dropped one\'s writing, the dropped key is gone, on the phone',
    [((await devArt(P, keyOf(g2k))) || {}).body || null, await devArt(P, keyOf(g2d))], [g2want, null]);
  check('g2 and in the cloud', [(cloudArt(keyOf(g2k)) || {}).body || null, cloudArt(keyOf(g2d))], [g2want, null]);
  check('g the dropped books are gone, on the phone and in the cloud',
    [await P.ev('[!!state.books[' + J(g1d) + '], !!state.books[' + J(g2d) + ']]'), rig.cloud.books(U).includes(g1d) || rig.cloud.books(U).includes(g2d)], [[false, false], false]);
  // g3: merged and then undone, online; reopened
  const tomb = await P.ev('mergeBookDuplicates(T.uid(), ' + J(g3k) + ', [' + J(g3d) + '])'); await P.wait(900);
  check('g3 merged online: the cloud has the artifact on the kept book only', [!!cloudArt(keyOf(g3k)), !!cloudArt(keyOf(g3d))], [true, false]);
  check('g3 Undo is accepted', await P.ev('undoBookMerge(T.uid(), ' + J(tomb) + ')'), true); await P.wait(900);
  await reopen(P);
  check('g3 after Undo and a reopen: the artifact is back on its own book only, on the phone and in the cloud',
    [((await devArt(P, keyOf(g3d))) || {}).body || null, await devArt(P, keyOf(g3k)), (cloudArt(keyOf(g3d)) || {}).body || null, cloudArt(keyOf(g3k))],
    ['written on the copy of Dup Three', null, 'written on the copy of Dup Three', null]);
  await reopen(P);
  check('g3 and it stays there at the next load too', [((await devArt(P, keyOf(g3d))) || {}).body || null, (cloudArt(keyOf(g3d)) || {}).body || null],
    ['written on the copy of Dup Three', 'written on the copy of Dup Three']);
  P.close();

  // ---------------------------------------------------------------- i (Preston's addition 1)
  await stage('i', 'an edit made before the sign-in event arrives, on a load whose first answer succeeds');
  await reopen(P);
  const nI = await P.ev("T.note('note I, as first written')"), bI = await P.ev("T.addBook('Book I')"); await P.wait(900);
  P.close();
  await P.open(1);   // storage kept; the next line delays the sign-in event of the open after it
  await P.ev("localStorage.setItem('rig_auth_delay', '3000')"); P.close();
  await P.open(300);
  check('i the app is up as the cached reader, before the sign-in event', [await P.ev('T.uid()'), (await P.ev('T.latches()')).notebook], [U, false]);
  await P.ev('T.editNote(' + J(nI) + ", 'note I, edited before the sign-in event')"); await P.ev('T.editBook(' + J(bI) + ", 'read')");
  await P.waitFor(LATCHES_OPEN, 40000); await P.wait(1200);
  await P.ev("localStorage.removeItem('rig_auth_delay')");
  check('i the first answer succeeded: no read failed on this open', (await P.ev('window.__toasts.slice()')).filter((s) => s.indexOf('reach your library') !== -1).length, 0);
  check('i both edits are kept, on the phone and in the cloud',
    [get(await P.ev('T.notes()'), nI), await devStatus(P, bI), get(rig.cloud.notes(U), nI), normalizeStatusRig(cloudStatus(bI))],
    ['note I, edited before the sign-in event', 'read', 'note I, edited before the sign-in event', 'read']);

  // ---------------------------------------------------------------- j (Preston's addition 2)
  await stage('j', 'the notes read alone fails; the reader edits a note; the app is closed before the read recovers');
  P.close(); fail_user_reads(rig, 'phone', true, ['userNotebook']); await P.open();
  await P.waitFor('booksLoaded === true', 30000); await P.wait(600);
  check('j only the notes latch is shut', [(await P.ev('T.latches()')).notebook, (await P.ev('T.latches()')).books], [false, true]);
  const jCloudNote = get(rig.cloud.notes(U), nI);
  await P.ev('T.editNote(' + J(nI) + ", 'note I, edited while the notes read failed')"); await P.ev('T.editBook(' + J(bI) + ", 'will-read')"); await P.wait(600);
  check('j the book edit (its read had succeeded) reached the cloud at once; the note did not', [normalizeStatusRig(cloudStatus(bI)), get(rig.cloud.notes(U), nI) === jCloudNote], ['will-read', true]);
  P.close(); fail_user_reads(rig, 'phone', false); await reopen(P);
  check('j the note edit is kept and pushed', [get(await P.ev('T.notes()'), nI), get(rig.cloud.notes(U), nI)], ['note I, edited while the notes read failed', 'note I, edited while the notes read failed']);

  // ---------------------------------------------------------------- k (Preston's addition 3)
  await stage('k', 'a save SENT but never acknowledged before the app closed');
  // k1: sent, never landed (no signal): it is still waiting at the next load, and is sent then
  rig.cloud.offline.add('phone');
  await P.ev('T.editNote(' + J(nI) + ", 'note I, k1: sent with no signal')"); await P.wait(600);
  check('k1 before the close: sent, not acknowledged, so still waiting', await waiting(P), { notebook: { changed: [nI], created: [], deleted: [] } });
  P.close(); rig.cloud.offline.delete('phone');
  let kmark = rig.cloud.log.length;
  await reopen(P);
  check('k1 after the reopen: kept, and written to the cloud once', [get(await P.ev('T.notes()'), nI), get(rig.cloud.notes(U), nI), rig.cloud.log.slice(kmark).filter((e) => e[0] === 'phone' && e[1] === 'set' && e[2].indexOf('userNotebook/') === 0).length], ['note I, k1: sent with no signal', 'note I, k1: sent with no signal', 1]);
  check('k1 and nothing is waiting once that write is acknowledged', await waiting(P), {});
  // k2: sent and LANDED, but the answer never reached the phone
  dropAck = { dev: 'phone', col: 'userNotebook' };
  await P.ev('T.editNote(' + J(nI) + ", 'note I, k2: landed, never acknowledged')"); await P.wait(800);
  check('k2 the cloud holds the change', get(rig.cloud.notes(U), nI), 'note I, k2: landed, never acknowledged');
  check('k2 before the close: not acknowledged, so still waiting', await waiting(P), { notebook: { changed: [nI], created: [], deleted: [] } });
  P.close(); dropAck = null;
  kmark = rig.cloud.log.length;
  await reopen(P);
  check('k2 after the reopen: the change the cloud already holds is not written a second time', rig.cloud.log.slice(kmark).filter((e) => e[0] === 'phone' && e[1] === 'set' && e[2].indexOf('userNotebook/') === 0).length, 0);
  check('k2 and the phone shows it, with nothing waiting', [get(await P.ev('T.notes()'), nI), await waiting(P)], ['note I, k2: landed, never acknowledged', {}]);
  P.close();

  // ---------------------------------------------------------------- l (Preston's ruling of 24 Nov, proof 1)
  await stage('l', 'a book and its artifact deleted on another device; this device has an unsent change to that artifact, its switch confirmed on');
  await reopen(P);
  const bL = await P.ev("T.addBook('Book L, deleted elsewhere')"), aL = await P.ev('T.artifact(' + J(bL) + ", 'artifact L')"); await P.wait(600);
  check('l set-up: the switch on Book L turns on, and the cloud confirms it', [await flip(P, bL), await (async () => { await P.wait(700); return (cloudArt(aL) || {}).on; })()], ['true', true]);
  await reopen(L); L.close();
  rig.cloud.offline.add('phone');
  await P.ev('(function(){ var a = state.bookArtifacts[' + J(aL) + "]; a.body = 'artifact L, changed with no signal'; a.updatedAt = Date.now(); markArtifactsDirty(); saveState(); })()"); await P.wait(300);
  P.close(); rig.cloud.offline.delete('phone');
  await reopen(L);
  await L.ev('deleteBook(T.uid(), ' + J(bL) + ')'); await L.wait(700);
  check('l the laptop\'s delete reached the cloud: the book and its artifact are gone', [rig.cloud.book(U, bL), cloudArt(aL)], [null, null]);
  L.close();
  await reopen(P);
  check('l the artifact stays deleted, on the phone and in the cloud', [await devArt(P, aL), cloudArt(aL)], [null, null]);
  check('l and nothing is left waiting', await waiting(P), {});
  // l2: the same, but the artifacts load answers BEFORE the books load (the shelf read fails at first)
  const bL2 = await P.ev("T.addBook('Book L two, deleted elsewhere')"), aL2 = await P.ev('T.artifact(' + J(bL2) + ", 'artifact L two')"); await P.wait(700);
  await reopen(L); L.close();
  rig.cloud.offline.add('phone');
  await P.ev('(function(){ var a = state.bookArtifacts[' + J(aL2) + "]; a.body = 'artifact L two, changed with no signal'; a.updatedAt = Date.now(); markArtifactsDirty(); saveState(); })()"); await P.wait(300);
  P.close(); rig.cloud.offline.delete('phone');
  await reopen(L); await L.ev('deleteBook(T.uid(), ' + J(bL2) + ')'); await L.wait(700); L.close();
  fail_user_reads(rig, 'phone', true, ['userBooks']); P.close(); await P.open();
  await P.waitFor('artifactsLoaded === true', 30000); await P.wait(800);
  print('        reading (l2, the books read still failing): the phone holds the artifact: ' + J(!!(await devArt(P, aL2))) + ', the cloud: ' + J(!!cloudArt(aL2)));
  fail_user_reads(rig, 'phone', false); await P.ev('T.online()'); await P.waitFor(LATCHES_OPEN, 40000); await P.wait(1200);
  check('l2 once the books load answers, the artifact is gone, on the phone and in the cloud', [await devArt(P, aL2), cloudArt(aL2)], [null, null]);
  await reopen(P);
  check('l2 and at the next load nothing is left waiting', await waiting(P), {});

  // ---------------------------------------------------------------- m (proof 2)
  await stage('m', 'a sub-theory deleted on another device along with its arc; this device has an unsent change to it');
  const arcM = await P.ev("T.arc('Arc M, deleted elsewhere')");
  const stM = await P.ev('(function(){ var s = createSubTheory(' + J(arcM) + ", { header: 'Sub-theory M' }); return s ? s.id : null; })()"); await P.wait(700);
  await reopen(L); L.close();
  rig.cloud.offline.add('phone');
  await P.ev('updateSubTheory(' + J(stM) + ", { header: 'Sub-theory M, changed with no signal' })"); await P.wait(300);
  P.close(); rig.cloud.offline.delete('phone');
  await reopen(L);
  await L.ev('deleteArc(' + J(arcM) + '); deleteSubTheory(' + J(stM) + '); saveState();'); await L.wait(700);
  check('m the laptop\'s deletes reached the cloud: the arc and the sub-theory are gone', [get(rig.cloud.arcs(U), arcM), Object.keys(rig.cloud.sub(U, stM)).length], [null, 0]);
  L.close();
  await reopen(P);
  check('m the sub-theory stays deleted, on the phone and in the cloud', [await P.ev('!!state.subTheories[' + J(stM) + ']'), Object.keys(rig.cloud.sub(U, stM)).length], [false, 0]);
  check('m and nothing is left waiting', await waiting(P), {});
  // a reading, not a check: the arc alone deleted elsewhere. deleteArc never deletes a sub-theory; it re-homes it
  // (arcId null, stamped), so the cloud still has it and nothing here revives it. Which copy wins is newer-wins.
  const arcM2 = await P.ev("T.arc('Arc M two, deleted elsewhere')");
  const stM2 = await P.ev('(function(){ var s = createSubTheory(' + J(arcM2) + ", { header: 'Sub-theory M two' }); return s ? s.id : null; })()"); await P.wait(700);
  await reopen(L); await L.ev('deleteArc(' + J(arcM2) + '); saveState();'); await L.wait(700); L.close();
  rig.cloud.offline.add('phone');
  await P.ev('updateSubTheory(' + J(stM2) + ", { header: 'Sub-theory M two, changed with no signal after the arc was deleted elsewhere' })"); await P.wait(300);
  P.close(); rig.cloud.offline.delete('phone'); await reopen(P);
  print('        reading (m2, the arc alone deleted elsewhere): the phone keeps the sub-theory with arcId ' + J(await P.ev('state.subTheories[' + J(stM2) + '] ? state.subTheories[' + J(stM2) + '].arcId : "GONE"')) + ', the cloud with arcId ' + J(get(rig.cloud.sub(U, stM2), 'arcId')) + ' (the deleted arc was ' + arcM2 + ')');

  // ---------------------------------------------------------------- n (proof 3)
  await stage('n', 'a note changed here whose book was deleted elsewhere is still kept (a note can live without a book)');
  const bN = await P.ev("T.addBook('Book N, deleted elsewhere')");
  const nN = await P.ev("(function(){ var id = T.note('note N, on Book N'); state.notebookEntries[id].bookIds = [" + J(bN) + ']; markNotebookDirty(); saveState(); return id; })()');
  const nN2 = await P.ev("(function(){ var id = T.note('note N two, on Book N'); state.notebookEntries[id].bookIds = [" + J(bN) + ']; markNotebookDirty(); saveState(); return id; })()'); await P.wait(700);
  await reopen(L); L.close();
  rig.cloud.offline.add('phone');
  await P.ev('T.editNote(' + J(nN) + ", 'note N, changed with no signal')"); await P.ev('T.editNote(' + J(nN2) + ", 'note N two, changed with no signal')"); await P.wait(300);
  P.close(); rig.cloud.offline.delete('phone');
  await reopen(L); await L.ev('deleteBook(T.uid(), ' + J(bN) + ')'); await L.ev('T.delNote(' + J(nN2) + ')'); await L.wait(700);
  check('n the book, and the second note, are gone from the cloud', [rig.cloud.book(U, bN), get(rig.cloud.notes(U), nN2)], [null, null]);
  L.close();
  await reopen(P);
  check('n the note and its change are kept, on the phone and in the cloud', [get(await P.ev('T.notes()'), nN), get(rig.cloud.notes(U), nN)], ['note N, changed with no signal', 'note N, changed with no signal']);
  check('n2 a note deleted elsewhere with its book, changed here, is kept too (C3: the ruling does not cover notes)', [get(await P.ev('T.notes()'), nN2), get(rig.cloud.notes(U), nN2)], ['note N two, changed with no signal', 'note N two, changed with no signal']);
  P.close();

  // ---------------------------------------------------------------- o (proof 4)
  await stage('o', 'an account switch, A to B: nothing of A is held in D1a\'s memory; then B\'s account wiped');
  const MA = 'd1a-mem-a', MB = 'd1a-mem-b';
  const N2 = await (await rig.device('newphone').open()).sign_in(MA);
  await N2.waitFor(LATCHES_OPEN, 40000);
  const aIds = [await N2.ev("T.addBook('A\\'s book')"), await N2.ev("T.note('A\\'s note')"), await N2.ev("T.lens('A\\'s lens')")]; await N2.wait(700);
  const memOf = "(function(){ var s = ''; try { s = JSON.stringify([typeof d1aCache === 'undefined' ? null : d1aCache, typeof d1aStartedFor === 'undefined' ? null : d1aStartedFor, typeof d1aRevived === 'undefined' ? null : d1aRevived, typeof d1aDocBytes === 'undefined' ? null : d1aDocBytes]); } catch (e) { s = 'unreadable'; } return s; })()";
  check('o control: while A is signed in, D1a\'s memory holds A\'s records (A\'s note id is in it)', (await N2.ev(memOf)).indexOf(aIds[1]) !== -1, true);
  await N2.ev('__rigSignIn(' + J(MB) + ')'); await N2.wait(400);
  const memAfter = await N2.ev(memOf);
  check('o after the switch to B: none of A\'s ids, and not A\'s uid, in D1a\'s memory', [aIds.filter((id) => memAfter.indexOf(id) !== -1), memAfter.indexOf(MA) !== -1], [[], false]);
  await N2.waitFor(LATCHES_OPEN, 40000);
  await N2.ev("T.note('B\\'s note')"); await N2.wait(700);
  const del = await N2.ev('T.del()'); await N2.wait(600);
  check('o B\'s account wiped: the deletion ran, and D1a\'s memory is empty', [del.status, await N2.ev("(typeof d1aCache === 'undefined') ? 'no D1a memory to read' : JSON.stringify([d1aCache, d1aStartedFor, d1aDocBytes])")], ['deleted', '[{},null,{}]']);
  N2.close();

  // ---------------------------------------------------------------- h
  await stage('h', 'the size meter: a small document says nothing; past 700 KB the first line, once; at the cap the second, once');
  const M = 'd1a-meter';
  const realHandle = rig.cloud.handle.bind(rig.cloud);
  rig.cloud.handle = function (dev, op, path, body) {   // the real service refuses a document over 1 MiB (1,048,576 bytes)
    if (op === 'set' && body) {
      const n = new TextEncoder().encode(JSON.parse(body).json).length;
      if (n > 1048576) { this.log.push([dev, 'set-refused', path]); return J({ error: 'Document cannot be written because its size (' + n + ' bytes) exceeds the maximum allowed size of 1,048,576 bytes.' }); }
    }
    return realHandle(dev, op, path, body);
  };
  const Tb = await (await rig.device('tablet').open()).sign_in(M);
  await Tb.waitFor(LATCHES_OPEN, 40000);
  const said = async () => { const t = await Tb.ev('window.__toasts.slice()'); return [t.filter((s) => s === ROOM).length, t.filter((s) => s === FULL).length]; };
  await Tb.ev("T.note('a small note')"); await Tb.wait(500);
  check('h a small document: neither line', await said(), [0, 0]);
  await Tb.ev("T.note(new Array(740 * 1024 + 1).join('x'))"); await Tb.wait(1200);
  check('h past 700 KB: the first line, once', await said(), [1, 0]);
  await Tb.ev("T.note('another small note')"); await Tb.wait(900);
  check('h the next save the same day: not said again', await said(), [1, 0]);
  check('h the 740 KB document was accepted by the cloud', Object.keys(rig.cloud.notes(M)).length, 3);
  await Tb.ev("T.note(new Array(400 * 1024 + 1).join('y'))"); await Tb.wait(1500);
  check('h at the cap the save is refused: the second line, once', await said(), [1, 1]);
  await Tb.ev("T.note('a note after the cap')"); await Tb.wait(1200);
  check('h refused again the same day: neither line again', await said(), [1, 1]);
  check('h the refused notes are kept on the device (5), the cloud keeps its last accepted copy (3)',
    [Object.keys(await Tb.ev('T.notes()')).length, Object.keys(rig.cloud.notes(M)).length], [5, 3]);
  await Tb.ev("(function(){ var k, i, ks = []; for (i = 0; i < localStorage.length; i++) { k = localStorage.key(i); if (k.indexOf('praxis_d1a_said_') === 0) { ks.push(k); } } for (i = 0; i < ks.length; i++) { localStorage.setItem(ks[i], JSON.stringify('2026-01-01')); } return ks.length; })()");
  await Tb.ev("T.note('a note on the next day')"); await Tb.wait(1200);
  check('h a day later the lines are said again, once each', await said(), [2, 2]);
  Tb.close();
  // the meter on a second document: the artifacts', on a fresh device and account
  const Sp = await (await rig.device('spare').open()).sign_in('d1a-meter-two');
  await Sp.waitFor(LATCHES_OPEN, 40000);
  const spBook = await Sp.ev("T.addBook('A book with a long artifact')"); await Sp.wait(400);
  await Sp.ev('T.artifact(' + J(spBook) + ", new Array(740 * 1024 + 1).join('z'))"); await Sp.wait(1200);
  const spSaid = await Sp.ev('window.__toasts.slice()');
  check('h the artifacts document past 700 KB: the first line, once', [spSaid.filter((s) => s === ROOM).length, spSaid.filter((s) => s === FULL).length], [1, 0]);
  rig.cloud.handle = realHandle;
  Sp.close();

  const errs = [].concat(...rig.devs.map((d) => d.errors));
  for (const t of TRACE) { print('        page error ' + t.replace(/\n/g, '\n            ')); }
  check('page errors across every device', errs, []);
});

// the app's normalizeStatus, for a status read from the cloud (rig side)
function normalizeStatusRig(s) {
  if (s === 'finished' || s === 'read') { return 'read'; }
  if (s === 'want' || s === 'will-read') { return 'will-read'; }
  if (s === 'reading') { return 'reading'; }
  return s === null || s === undefined ? null : 'reading';
}
