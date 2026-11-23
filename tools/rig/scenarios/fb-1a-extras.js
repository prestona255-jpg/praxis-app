// Praxis rig -- suite fb-1a-extras: the executor's own scenarios X0..X7 from FB-1a (brief 2.4), NOT part of
// the chat's rig. Each drives what the chat's rig did not: the two composers and capture's Undo through the
// page's own controls, a lens and an artifact CREATED while failing, an account switch while a load fails,
// the 15 s and 45 s timer steps, and the real shelf sort and the real lens render writing by themselves
// (their network calls are blocked by the rig). Moved here from the FB-1a page rig's driver.js (it ran there
// as ?mode=extra), statement for statement: only the line that registers the suite and the closing summary
// (printed by core.js's runner now) changed.
// Rig code, not app code: the app's ES3 rule does not bind it.
'use strict';

rigSuite(async function () {
  const A = 'readerX';
  const LATCHES_OPEN = 'booksLoaded === true && arcsLoaded === true && subTheoriesLoaded === true && themesLoaded === true && artifactsLoaded === true && notebookLoaded === true';
  print('== FB-1a coverage extras on ' + LABEL + ' == (the executor\'s own scenarios, brief 2.4)');

  await stage('X0', 'set-up: one account, a level phone with 6 books, a note, an arc, a lens');
  const P = await (await rig.device('phone').open()).sign_in(A);
  const bk = [];
  for (const t of ['One', 'Two', 'Three', 'Four', 'Five', 'Six']) { bk.push(await P.ev('T.addBook(' + J('Book ' + t) + ')')); }
  const n0 = await P.ev("T.note('a note from the phone')"); const a0 = await P.ev("T.arc('An arc')"); const lz = await P.ev("T.lens('A lens')"); await P.wait(900);
  check('X0 set-up reached the cloud', [rig.cloud.books(A).length, Object.keys(rig.cloud.notes(A)).length, Object.keys(rig.cloud.arcs(A)).length], [6, 1, 1]);

  await stage('X1', 'the JOURNAL composer, through its own Save button, with no signal; the app closed before the signal returns');
  rig.cloud.offline.add('phone');
  await P.ev("location.hash = '#notebook'"); await P.wait(500);
  const x1 = await P.ev("(function(){ openJournalEditor(); var b = document.querySelector('.notebook-editor-body'), s = document.querySelector('.notebook-editor-save'); if (!b || !s) { return 'no editor'; } b.value = 'a journal entry, written offline'; b.dispatchEvent(new Event('input')); var before = Object.keys(state.notebookEntries); s.click(); var k; for (k in state.notebookEntries) { if (before.indexOf(k) === -1) { return k; } } return 'no new entry'; })()");
  await P.wait(400);
  check('X1 the Save button made a journal entry, marked pending', [typeof x1 === 'string' && x1.indexOf('no ') !== 0, (await P.ev("T.pending('notebook')")).includes(x1)], [true, true]);
  P.close(); rig.cloud.offline.delete('phone'); await P.open();
  check('X1 reopened online: the journal entry is kept and pushed', [get(await P.ev('T.notes()'), x1), get(rig.cloud.notes(A), x1)], ['a journal entry, written offline', 'a journal entry, written offline']);

  await stage('X2', 'the MARGINALIA composer, typed into and autosaved, while every read is failing; the app closed before recovery');
  P.close(); fail_user_reads(rig, 'phone'); await P.open();
  await P.ev('location.hash = ' + J('#book/' + bk[0])); await P.wait(700);
  const x2 = await P.ev('(function(){ openMarginaliaEditor(' + J(bk[0]) + "); var ed = document.querySelector('.wc-input'); if (!ed) { return 'no canvas'; } ed.focus(); ed.textContent = 'a margin note, typed while failing'; ed.dispatchEvent(new Event('input', { bubbles: true })); return 'typed'; })()");
  await P.wait(1500);   // the canvas autosaves 700 ms after the last input
  const x2id = await P.ev("(function(){ var k; for (k in state.notebookEntries) { if (state.notebookEntries[k].body === 'a margin note, typed while failing') { return k; } } return null; })()");
  check('X2 the canvas autosaved a new margin note, marked pending', [x2, x2id !== null, x2id !== null && (await P.ev("T.pending('notebook')")).includes(x2id)], ['typed', true, true]);
  P.close(); fail_user_reads(rig, 'phone', false); await P.open();
  check('X2 reopened: the margin note is kept and pushed', [get(await P.ev('T.notes()'), x2id), get(rig.cloud.notes(A), x2id)], ['a margin note, typed while failing', 'a margin note, typed while failing']);

  await stage('X3', "capture's UNDO, through the toast's own Undo control, with no signal; the app closed; a stale cloud copy at the next open");
  await P.ev("location.hash = '#notebook'"); await P.wait(500);
  const x3 = await P.ev("(function(){ openCaptureDoor({}); var f = capEl('capField'); if (!f) { return 'no field'; } f.value = 'caught, then undone'; f.dispatchEvent(new Event('input')); var before = Object.keys(state.notebookEntries); capCommit(); var k; for (k in state.notebookEntries) { if (before.indexOf(k) === -1) { return k; } } return null; })()");   // not nbJustSavedId: capture re-renders the Notebook, which clears it (views.js 20082)
  await P.wait(900);
  print('        reading: the filed id ' + J(x3) + '; on the device ' + J(await P.ev('(function(){ var e = state.notebookEntries[' + J(x3) + ']; return e ? { body: e.body, register: e.register, userId: e.userId } : null; })()')) +
    '; notebook latch ' + J(await P.ev('notebookLoaded')) + '; in the cloud ' + J(get(((rig.cloud.docs['userNotebook/' + A] || {}).notebookEntries) || {}, x3)));
  check('X3 the capture filed and the note reached the cloud', get(rig.cloud.notes(A), x3), 'caught, then undone');
  rig.cloud.offline.add('phone');
  const undone = await P.ev("(function(){ var u = capEl('capToastUndo'); if (!u || u.style.display === 'none') { return 'no undo'; } u.click(); return 'clicked'; })()"); await P.wait(400);
  check('X3 Undo was clicked and the note left the device', [undone, x3 in (await P.ev('T.notes()'))], ['clicked', false]);
  P.close(); rig.cloud.offline.delete('phone');
  check('X3 the cloud still lists the undone note', x3 in rig.cloud.notes(A), true);
  await P.open();
  check('X3 reopened: the undone note does NOT come back, and the delete reaches the cloud', [x3 in (await P.ev('T.notes()')), x3 in rig.cloud.notes(A)], [false, false]);

  await stage('X4', 'a lens and an artifact CREATED while every read is failing');
  P.close(); fail_user_reads(rig, 'phone'); await P.open();
  const lz2 = await P.ev("T.lens('A lens made while failing')"); const ax2 = await P.ev('T.artifact(' + J(bk[1]) + ", 'an artifact made while failing')"); await P.wait(400);
  check('X4 neither is written while failing', [lz2 in rig.cloud.lens_names(A), ax2 in rig.cloud.arts(A)], [false, false]);
  fail_user_reads(rig, 'phone', false); await P.ev('T.online()'); await P.waitFor(LATCHES_OPEN, 30000); await P.wait(1200);
  check('X4 both pushed after the retry, the older lens kept', [get(rig.cloud.lens_names(A), lz2), get(get(rig.cloud.arts(A), ax2) || {}, 'body'), lz in rig.cloud.lens_names(A)], ['A lens made while failing', 'an artifact made while failing', true]);

  await stage('X5', 'an account switch while a load is failing, then a cached reader whose sign-in event brings another account');
  const B = 'readerY';
  P.close(); fail_user_reads(rig, 'phone'); await P.open();
  await P.ev('T.editNote(' + J(n0) + ", 'an edit made as the first account, while failing')"); await P.wait(300);
  const aDocsBefore = JSON.stringify([rig.cloud.books(A), rig.cloud.notes(A), rig.cloud.arcs(A)]);
  await P.ev('__rigSignIn(' + J(B) + ')'); await P.wait(1200);
  fail_user_reads(rig, 'phone', false); await P.ev('T.online()'); await P.waitFor(LATCHES_OPEN, 30000); await P.wait(1200);
  check('X5 after the switch the device is the second account, with none of the first one\'s records', [await P.ev('T.uid()'), (await P.ev('T.bookIds()')).length, Object.keys(await P.ev('T.notes()')).length], [B, 0, 0]);
  check("X5 the first account's cloud documents are untouched", JSON.stringify([rig.cloud.books(A), rig.cloud.notes(A), rig.cloud.arcs(A)]), aDocsBefore);
  check('X5 nothing of the first account was written under the second', [rig.cloud.books(B), rig.cloud.notes(B)], [[], {}]);
  const yb = await P.ev("T.addBook('The second account\\'s book')"); await P.wait(700);
  // praxis_user still names B; the fake's stored sign-in is set to A, so the next open boots as cached B and the event brings A
  await P.ev("localStorage.setItem('rig_auth', " + J(A) + ')'); P.close(); fail_user_reads(rig, 'phone'); await P.open();
  check('X5 the event brought the first account over a cached second one', await P.ev('T.uid()'), A);
  await P.ev('T.editBook(' + J(bk[2]) + ", 'read')"); await P.wait(300);
  fail_user_reads(rig, 'phone', false); await P.ev('T.online()'); await P.waitFor(LATCHES_OPEN, 30000); await P.wait(1200);
  check("X5 the first account's edit reached its own cloud; the second account's shelf is untouched", [get(rig.cloud.book(A, bk[2]) || {}, 'status'), rig.cloud.books(B)], ['read', [yb]]);

  await stage('X6', 'the 15 s and 45 s timer steps, with no event: reads fail for 25 s from the first failure');
  P.close(); fail_user_reads(rig, 'phone'); await P.open(0);
  await P.waitFor('window.__toasts.length > 0', 10000); const t0 = Date.now();
  await sleep(1000);
  setTimeout(() => fail_user_reads(rig, 'phone', false), 25000);
  const seenAt = [];
  for (;;) {
    const open = await P.ev('booksLoaded === true');
    if (open) { seenAt.push(Math.round((Date.now() - t0) / 1000)); break; }
    if (Date.now() - t0 > 90000) { seenAt.push('never'); break; }
    await sleep(500);
  }
  print('        reading: the shelf latch opened ' + seenAt[0] + ' s after the first failure (retries due at 5, 20, 65 s; reads restored at 25 s)');
  check('X6 the 5 s and 20 s retries failed and the 65 s one opened the latch (60..72 s)', typeof seenAt[0] === 'number' && seenAt[0] >= 60 && seenAt[0] <= 72, true);

  await stage('X7', 'the REAL shelf sort and the REAL lens render on a device that is behind, reads failing (their network is blocked)');
  const L = await (await rig.device('laptop').open()).sign_in(A); L.close();
  await P.ev('T.editBook(' + J(bk[3]) + ", 'read')"); await P.ev('T.editBook(' + J(bk[4]) + ", 'read')");
  await P.ev('state.userThemes[' + J(lz) + "].name = 'RENAMED on the phone'; state.userThemes[" + J(lz) + '].look = null; state.userThemes[' + J(lz) + '].updatedAt = Date.now(); markThemesDirty(); saveState();'); await P.wait(700);
  fail_user_reads(rig, 'laptop'); await L.open();
  await L.ev("(function(){ var u = T.uid(); ensureUser(u); if (!state.users[u].profile) { state.users[u].profile = {}; } state.users[u].profile.yumiYes = 'granted'; return isYumiYesGranted(u); })()");
  const unsortedBefore = await L.ev("T.bookIds().filter(function (id) { return !state.books[id].category; }).length");
  await L.ev("location.hash = '#books'"); await L.wait(6000);
  const stampedReal = await L.ev("T.bookIds().filter(function (id) { return state.books[id].category === CATEGORY_UNCATEGORIZED; }).length");
  await L.ev("location.hash = '#lenses'"); await L.wait(1500);
  const lookReal = await L.ev('!!(state.userThemes[' + J(lz) + '] && state.userThemes[' + J(lz) + '].look)');
  print('        reading: ' + unsortedBefore + ' books unsorted before the shelf rendered; ' + stampedReal + " stamped 'Uncategorized' by the real sort; the lens has a look after #lenses rendered: " + lookReal);
  fail_user_reads(rig, 'laptop', false); await L.ev('T.online()'); await L.waitFor(LATCHES_OPEN, 30000); await L.wait(1500);
  check("X7 the phone's two status changes survive in the cloud and reach the laptop", [get(rig.cloud.book(A, bk[3]) || {}, 'status'), get(rig.cloud.book(A, bk[4]) || {}, 'status'), await L.ev('state.books[' + J(bk[3]) + '].status'), await L.ev('state.books[' + J(bk[4]) + '].status')], ['read', 'read', 'read', 'read']);
  check("X7 the phone's lens rename survives in the cloud and reaches the laptop", [get(rig.cloud.lens_names(A), lz), get(await L.ev('T.lenses()'), lz)], ['RENAMED on the phone', 'RENAMED on the phone']);

  const errs = [].concat(...rig.devs.map((d) => d.errors));
  for (const t of TRACE) { print('        page error ' + t.replace(/\n/g, '\n            ')); }
  check('page errors across every device', errs, []);
});
