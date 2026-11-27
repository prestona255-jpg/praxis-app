// Praxis rig -- suite r2: Find a book (R2, v3.346). Driven through the rendered Shelf panel, Search's "All books"
// side and the Capture sheet, as a reader taps them. The lookups are replaced on each device with fixed answers --
// the drawing's own catalogue (praxis-r2-kit-26nov.zip, drawing/index.html, CAT), so no run needs the network:
// openLibrarySearch, openLibraryEditions, googleBooksSearch and resolveBook are swapped; findBooks is the shipped one.
//    1  a tap adds: on the device, in the cloud, and read by a second device, as Will read
//    2  Undo straight after the tap, before the save has landed: gone on the device and in the cloud, and after a reopen
//    3  a tap with no signal, the app closed, the signal back, reopened: the book is kept
//    4  a book already on the shelf (by title and author; by ISBN) is not added again, from the panel or from Search;
//       no Undo is offered for it; deleteBook is never called for it; a row drawn before the book arrived adds nothing
//    5  an edition picked: its year, publisher, pageCount and ISBN are what is stored
//    6  by hand: a title alone saves; with no title "Add to shelf" stays disabled, even with an ISBN typed
//    7  Open Library failing falls to Google Books; both failing: the lookup-down card; both empty: no results;
//       offline: the offline card and no call
//    8  findbook=old: the pill opens the typed form, Search has no All books side, the Capture chip is absent
//    9  a late answer for older words is not drawn over the newer words' rows
//   10  after a tap the field keeps its words and the cursor, the list is there, the Shelf's count line reads one more
//   11  a title holding <img src=x onerror=...> is drawn as text and runs nothing
//   12  no page errors on any device
//   Claude Code's own: c the Capture chip opens the panel with the cursor in the field; b Back from a book opened from
//   the panel brings the panel back with its words and list; s Back from a book opened from All books keeps Search's words.
// Run: powershell -NoProfile -ExecutionPolicy Bypass -File tools/rig/run.ps1 -Suite r2 -Tree . -Label HEAD -Out <log>
// The README's seven behaviours this suite imitates: 3 (the app writing by itself: a cover lookup landing after an
// add, which redraws the Shelf under the panel; 1, 10), 4 (a second device behind the cloud: 1), 5 (the app closed
// before a write lands: 2, 3). Not 1, 2, 6, 7.
// Rig code, not app code: the app's ES3 rule does not bind it.
'use strict';

rigSuite(async function () {
  const U = 'r2-reader';
  const LATCHES_OPEN = 'booksLoaded === true && arcsLoaded === true && subTheoriesLoaded === true && themesLoaded === true && artifactsLoaded === true && notebookLoaded === true';
  print('== R2 behaviour rig on ' + LABEL + ' ==');

  // ---- the drawing's catalogue (CAT), with an Open Library work number (n), a real cover id (cov) and the ISBNs
  // the scenarios need; eds are the drawing's editions. Two rows are the suite's own: the ISBN-only twin of a shelved
  // book (4) and the hostile title (11).
  const CAT = [
    { n: 1, t: 'All About Love', a: 'bell hooks', y: 2000, cat: 'Essays & Criticism', cov: 42317, isbn: '9780060959470', isbnTitle: 'All About Love: New Visions' },
    { n: 2, t: 'Teaching to Transgress', a: 'bell hooks', y: 1994, cat: 'Education', cov: 3881117, eds: [{ y: 1994, p: 'Routledge', n: '216 pages', isbn: '9780415908085' }, { y: 2014, p: 'Routledge', n: 'E-book', isbn: '9781135200008' }] },
    { n: 3, t: 'Teaching Community', a: 'bell hooks', y: 2003, cat: 'Education', cov: 269813 },
    { n: 4, t: 'Teaching Critical Thinking', a: 'bell hooks', y: 2010, cat: 'Education', cov: 7370449 },
    { n: 5, t: "Ain't I a Woman", a: 'bell hooks', y: 1981, cat: 'Race & Identity', cov: 7884139 },
    { n: 6, t: 'The Will to Change', a: 'bell hooks', y: 2004, cat: 'Essays & Criticism', cov: 477610, eds: [{ y: 2004, p: 'Atria Books', n: '188 pages' }, { y: 2004, p: 'Washington Square Press', n: '208 pages' }] },
    { n: 7, t: 'Where We Stand', a: 'bell hooks', y: 2000, cat: 'Essays & Criticism', cov: 269176 },
    { n: 8, t: 'Feminism Is for Everybody', a: 'bell hooks', y: 2000, cat: 'Essays & Criticism', cov: 695380, eds: [{ y: 2014, p: 'Routledge', n: '138 pages' }, { y: 2000, p: 'South End Press', n: '123 pages' }] },
    { n: 9, t: 'Bone Black', a: 'bell hooks', y: 1996, cat: 'Essays & Criticism', cov: 8278801 },
    { n: 10, t: 'Pedagogy of the Oppressed', a: 'Paulo Freire', y: 1970, cat: 'Education', cov: 630082, isbn: '9781501314131', eds: [{ y: 2018, p: 'Bloomsbury Academic', n: '50th anniversary edition' }, { y: 2000, p: 'Continuum', n: '30th anniversary edition' }, { y: 1970, p: 'Herder and Herder', n: 'First edition in English' }] },
    { n: 11, t: 'Pedagogy of Hope', a: 'Paulo Freire', y: 1994, cat: 'Education', cov: 629886 },
    { n: 12, t: 'Pedagogy of Freedom', a: 'Paulo Freire', y: 1998, cat: 'Education', cov: 0 },
    { n: 13, t: 'Pedagogy of the Heart', a: 'Paulo Freire', y: 1997, cat: 'Education', cov: 13354505 },
    { n: 14, t: 'Education for Critical Consciousness', a: 'Paulo Freire', y: 1974, cat: 'Education', cov: 630851 },
    { n: 15, t: 'We Make the Road by Walking', a: 'Myles Horton, Paulo Freire', y: 1990, cat: 'Education', cov: 6574841 },
    { n: 16, t: 'Empire of AI', a: 'Karen Hao', y: 2025, cat: 'Technology & Society', cov: 15092439 },
    { n: 17, t: 'Power/Knowledge', a: 'Michel Foucault', y: 1980, cat: 'Theory & Philosophy', cov: 358378 },
    { n: 18, t: 'Discipline and Punish', a: 'Michel Foucault', y: 1975, cat: 'Theory & Philosophy', cov: 5539160, eds: [{ y: 1995, p: 'Vintage Books', n: '333 pages', isbn: '9780679752554' }, { y: 1977, p: 'Pantheon Books', n: 'First edition in English', isbn: '9780394499420' }, { y: 1975, p: 'Gallimard', n: 'First edition, in French' }] },
    { n: 19, t: 'The Human Condition', a: 'Hannah Arendt', y: 1958, cat: 'Theory & Philosophy', cov: 5746840 },
    { n: 20, t: 'The Origins of Totalitarianism', a: 'Hannah Arendt', y: 1951, cat: 'Theory & Philosophy', cov: 10793645 },
    { n: 21, t: 'The Undercommons', a: 'Stefano Harney, Fred Moten', y: 2013, cat: 'Theory & Philosophy', cov: 0 },
    { n: 22, t: '<img src=x onerror="window.__xss=1">Xss Book', a: 'Mallory <b onclick="window.__xss=2">Bold</b>', y: 2020, cat: 'Fiction', cov: 0 }
  ];
  const STUB = '(function(){' +
    'if (window.__r2Stubbed) { return "again"; } window.__r2Stubbed = true;' +
    'var CAT = ' + JSON.stringify(CAT) + ';' +
    'window.__r2Mode = { ol: "ok", gb: "ok", rbFail: false, eds: "ok", delay: {} };' +
    'window.__r2Calls = { ol: [], gb: [], rb: [], eds: [], del: [] };' +
    'function norm(s){ return String(s).toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\\s+/g, " ").trim(); }' +
    'function look(q){ var nq = norm(q), toks = nq.split(" ").filter(Boolean); var l = CAT.filter(function(b){ var k = norm(b.t + " " + b.a); return toks.every(function(t){ return k.indexOf(t) !== -1; }); });' +
    '  l.sort(function(x, y){ return (norm(y.t).indexOf(nq) === 0) - (norm(x.t).indexOf(nq) === 0); }); return l.slice(0, 10); }' +
    'function cov(b){ return b.cov ? "https://covers.openlibrary.org/b/id/" + b.cov + "-M.jpg" : null; }' +
    'function item(b){ var c = cov(b); return { title: b.t, author: b.a, year: String(b.y), pageCount: null, publisher: "", description: "", isbn: "", coverUrl: c, coverCandidates: c ? [c] : [], rawCategories: [], workKey: "/works/OL" + b.n + "W", editionCount: b.eds ? b.eds.length : 1 }; }' +
    'function later(q, f){ var ms = (window.__r2Mode.delay && window.__r2Mode.delay[q]) || 60; setTimeout(f, ms); }' +
    'window.openLibrarySearch = function(q, cb){ __r2Calls.ol.push(q); later(q, function(){ var m = __r2Mode.ol; if (m === "fail") { cb([], { kind: "network", status: 0 }); return; } if (m === "empty") { cb([], null); return; } cb(look(q).map(item), null); }); };' +
    'window.openLibraryEditions = function(key, cb){ __r2Calls.eds.push(key); setTimeout(function(){ if (__r2Mode.eds === "fail") { cb([], { kind: "network" }); return; } var b = CAT.filter(function(x){ return "/works/OL" + x.n + "W" === key; })[0]; if (!b || !b.eds) { cb([], null); return; }' +
    '  cb(b.eds.map(function(e){ var m = /([0-9]+) pages/.exec(e.n); return { year: String(e.y), publisher: e.p, pageCount: m ? +m[1] : null, isbn: e.isbn || "", coverUrl: cov(b), detail: e.n }; }), null); }, 60); };' +
    'window.googleBooksSearch = function(q, cb){ __r2Calls.gb.push(q); setTimeout(function(){ var m = __r2Mode.gb; if (m === "fail") { cb([], { kind: "http", status: 429 }); return; } if (m === "empty") { cb([], null); return; }' +
    '  cb(look(q).map(function(b){ return { volumeInfo: { title: b.t, authors: b.a.split(", "), publishedDate: String(b.y), publisher: "GB Press", pageCount: 222, categories: [b.cat], industryIdentifiers: b.isbn ? [{ type: "ISBN_13", identifier: b.isbn }] : [] }, printType: "BOOK" }; }), null); }, 60); };' +
    'window.resolveBook = function(query, cb){ __r2Calls.rb.push(query); setTimeout(function(){ var b = CAT.filter(function(x){ return x.isbn && x.isbn === query.isbn; })[0];' +
    '  if (b) { cb({ status: "strong", book: { title: b.isbnTitle || b.t, author: b.a, year: String(b.y), pageCount: null, publisher: "", description: "", isbn: b.isbn, coverUrl: cov(b), coverCandidates: cov(b) ? [cov(b)] : [], rawCategories: [] }, alternates: [], query: query }); return; }' +
    '  cb({ status: "none", lookupFailed: !!__r2Mode.rbFail, book: { title: "", author: "", isbn: query.isbn }, alternates: [], query: query }); }, 60); };' +
    'var del0 = window.deleteBook; window.deleteBook = function(u, id){ __r2Calls.del.push(id); return del0(u, id); };' +
    // a book put on the shelf the way the app's own add sites do it (T.addBook, with its author, ISBN and status)
    'window.__r2Book = function(title, author, isbn, status){ var user = getCurrentUser(), id = "bk_" + title.replace(/[^a-z0-9]/gi, "_"); state.books[id] = { id: id, title: title, author: author, isbn: isbn || "", addedAt: Date.now(), status: status, genre: "", coverUrl: null }; ensureBookFields(state.books[id]); ensureUser(user.uid); state.userBooks[user.uid].bookIds.push(id); markBookPending(user.uid, id); markBooksDirty(); saveState(); return id; };' +
    'return "stubbed"; })()';

  const stub = (d) => d.ev(STUB);
  async function reopen(d) { d.close(); await d.open(); await d.waitFor(LATCHES_OPEN, 40000); await d.wait(1200); await stub(d); return d; }
  const go = async (d, h) => { await d.ev('location.hash = ' + J(h)); await d.wait(700); };
  const ev = (d, js) => d.ev('(function(){ ' + js + ' })()');
  const click = async (d, sel) => { const r = await ev(d, 'var e = document.querySelector(' + J(sel) + '); if (!e) { return false; } e.click(); return true;'); await d.wait(400); return r; };
  const clickText = async (d, sel, txt) => { const r = await ev(d, 'var l = document.querySelectorAll(' + J(sel) + '), i; for (i = 0; i < l.length; i++) { if (l[i].textContent.replace(/^\\s+|\\s+$/g, "") === ' + J(txt) + ') { l[i].click(); return true; } } return false;'); await d.wait(400); return r; };
  // type into a field as a reader does: focused, its value set, an input event
  const type = async (d, sel, v, ms) => { await ev(d, 'var t = document.querySelector(' + J(sel) + '); if (!t) { return false; } t.focus(); t.value = ' + J(v) + '; t.dispatchEvent(new Event("input")); return true;'); await d.wait(ms === undefined ? 700 : ms); };
  // the rows in the results holder: "+" added, "=" owned, "" a plus row; the two scan rows are left out
  const rows = (d) => ev(d, 'var l = document.querySelectorAll("#fb-body .fb-row:not(.is-way):not(.is-wait)"), o = [], i; for (i = 0; i < l.length; i++) { var b = l[i].querySelector(".fb-tx > b"); o.push((l[i].classList.contains("is-added") ? "+" : (l[i].classList.contains("is-owned") ? "=" : "")) + (b ? b.textContent : "?")); } return o;');
  const rowOf = (title) => 'var rs = document.querySelectorAll("#fb-body .fb-row"), row = null, i; for (i = 0; i < rs.length; i++) { var b = rs[i].querySelector(".fb-tx > b"); if (b && b.textContent === ' + J(title) + ') { row = rs[i]; } }';
  const tapRow = async (d, title, ms) => { const r = await ev(d, rowOf(title) + ' if (!row) { return "no row"; } var h = row.querySelector(":scope > .fb-hit"); if (!h) { return "no hit"; } h.click(); return h.getAttribute("aria-label");'); await d.wait(ms === undefined ? 500 : ms); return r; };
  const rowInfo = (d, title) => ev(d, rowOf(title) + ' if (!row) { return null; } var seg = row.querySelector(".fb-seg"), p = seg ? seg.querySelector("[aria-pressed=true]") : null, on = row.querySelector(".fb-on");' +
    ' return { cls: row.className, on: on ? on.textContent : null, undo: !!row.querySelector(".fb-undo"), plus: !!row.querySelector(":scope > .fb-hit[aria-label^=\\"Add \\"]"), pressed: p ? p.textContent : null, eds: !!row.querySelector(".fb-eds"), small: row.querySelector(".fb-tx > small").textContent };');
  const card = (d) => ev(d, 'var n = document.querySelector("#fb-body .fb-note"); if (!n) { return null; } var b = n.querySelectorAll(".fb-btn"), o = [], i; for (i = 0; i < b.length; i++) { o.push(b[i].textContent); } return { title: n.querySelector("b").textContent, text: n.querySelector("p").textContent, btns: o };');
  const byTitle = (d, t) => ev(d, 'var k, b; for (k in state.books) { b = state.books[k]; if (b && b.title === ' + J(t) + ' && state.userBooks[getCurrentUser().uid].bookIds.indexOf(k) !== -1) { return { id: k, status: b.status, year: b.year, publisher: b.publisher, pageCount: b.pageCount, isbn: b.isbn, author: b.author }; } } return null;');
  const countTitle = (d, t) => ev(d, 'var n = 0, k, ids = state.userBooks[getCurrentUser().uid].bookIds; for (k = 0; k < ids.length; k++) { if (state.books[ids[k]] && state.books[ids[k]].title === ' + J(t) + ') { n++; } } return n;');
  const cloudTitle = (t) => { const ids = rig.cloud.books(U); for (let i = 0; i < ids.length; i++) { const b = rig.cloud.book(U, ids[i]); if (b && b.title === t) { return { id: ids[i], status: b.status, year: b.year, publisher: b.publisher, pageCount: b.pageCount, isbn: b.isbn }; } } return null; };
  const countLine = (d) => ev(d, 'var c = document.querySelector(".shelf.sh3 .sh3-count"); return c ? c.textContent : null;');
  const openPanel = async (d) => { await go(d, '#books'); await click(d, '.shelf.sh3 .sh3-add'); return ev(d, 'return { panel: !!document.querySelector("#shelf-editor-host > .fb"), focus: document.activeElement && document.activeElement.id };'); };
  const panelState = (d) => ev(d, 'var q = document.getElementById("fb-q"), a = document.activeElement; return { q: q ? q.value : null, focus: !!(a && a === q), caret: (a === q) ? [q.selectionStart, q.selectionEnd] : null, rows: document.querySelectorAll("#fb-body .fb-row:not(.is-way)").length, inShelf: !!document.querySelector(".shelf.sh3 #shelf-editor-host > .fb") };');
  const mode = (d, m) => ev(d, 'var k, m = ' + J(m) + '; for (k in m) { window.__r2Mode[k] = m[k]; } return true;');
  const calls = (d) => ev(d, 'return { ol: __r2Calls.ol.length, gb: __r2Calls.gb.length, rb: __r2Calls.rb.length, eds: __r2Calls.eds.length, del: __r2Calls.del.slice() };');

  await stage('setup', 'a reader with three books on the shelf: All About Love (Have read), Teaching Community (Have read), Empire of AI (Reading)');
  const P = await (await rig.device('phone').open()).sign_in(U);
  await P.waitFor(LATCHES_OPEN, 40000); await P.wait(800);
  check('setup the lookups are replaced on the device', await stub(P), 'stubbed');
  const sAAL = await P.ev("__r2Book('All About Love', 'bell hooks', '9780060959470', 'read')");
  await P.ev("__r2Book('Teaching Community', 'bell hooks', '', 'read')");
  await P.ev("__r2Book('Empire of AI', 'Karen Hao', '', 'reading')");
  await P.wait(1500);
  check('setup the cloud holds the three', rig.cloud.books(U).length, 3);

  // ---------------------------------------------------------------- 1 and 10
  await stage('1', 'a tap adds: on the device, in the cloud, and read by a second device, as Will read (and 10: the panel holds)');
  const o1 = await openPanel(P);
  check('1 the pill opens the panel under the Shelf\'s head, the cursor in its field', o1, { panel: true, focus: 'fb-q' });
  check('1 nothing typed: the two scan rows', await ev(P, 'var l = document.querySelectorAll("#fb-body .fb-row.is-way .fb-tx b"), o = [], i; for (i = 0; i < l.length; i++) { o.push(l[i].textContent); } return o;'), ['Scan a book', 'Scan a shelf']);
  check('1 the count line before', await countLine(P), '3 books');
  await type(P, '#fb-q', 'teach');
  check('1 "teach": three rows, the shelved one as owned', await rows(P), ['Teaching to Transgress', '=Teaching Community', 'Teaching Critical Thinking']);
  check('1 the plus\'s name', await tapRow(P, 'Teaching to Transgress', 900), 'Add Teaching to Transgress by bell hooks to your shelf');
  check('1 the row is the added row: the tick, On your shelf · Undo, Will read pressed', await rowInfo(P, 'Teaching to Transgress'),
    { cls: 'fb-row is-added', on: 'On your shelf ·Undo', undo: true, plus: false, pressed: 'Will read', eds: false, small: 'bell hooks · 1994' });
  const b1 = await byTitle(P, 'Teaching to Transgress');
  check('1 on the device: Will read, the year kept', [b1 && b1.status, b1 && b1.year, b1 && b1.author], ['will-read', '1994', 'bell hooks']);
  // 10 -- read straight after the tap
  check('10 the field keeps its words and the cursor, the list is there, the panel is in the redrawn Shelf', await panelState(P), { q: 'teach', focus: true, caret: [5, 5], rows: 3, inShelf: true });
  check('10 the Shelf\'s count line reads one more', await countLine(P), '4 books');
  await P.wait(1500);
  const c1 = cloudTitle('Teaching to Transgress');
  check('1 in the cloud: Will read, 1994', [c1 && c1.status, c1 && c1.year], ['will-read', '1994']);
  const L = await (await rig.device('laptop').open()).sign_in(U);
  await L.waitFor(LATCHES_OPEN, 40000); await L.wait(1000);
  check('1 a second device reads it as Will read', await byTitle(L, 'Teaching to Transgress').then((b) => b && b.status), 'will-read');
  L.close();
  // the status buttons write as the book page does
  await ev(P, rowOf('Teaching to Transgress') + ' var l = row.querySelectorAll(".fb-seg button"), i; for (i = 0; i < l.length; i++) { if (l[i].textContent === "Reading") { l[i].click(); } } return true;');
  await P.wait(900);
  check('1 Reading pressed: on the device and the row, the panel still holds', [await byTitle(P, 'Teaching to Transgress').then((b) => b.status), (await rowInfo(P, 'Teaching to Transgress')).pressed, (await panelState(P)).q], ['reading', 'Reading', 'teach']);
  await P.wait(1200);
  check('1 Reading reaches the cloud', cloudTitle('Teaching to Transgress').status, 'reading');

  // ---------------------------------------------------------------- 2
  await stage('2', 'Undo straight after the tap, before the save has landed');
  const before2 = rig.cloud.books(U).length;
  await ev(P, rowOf('Teaching Critical Thinking') + ' row.querySelector(":scope > .fb-hit").click(); var u = document.evaluate("//*[@id=\'fb-body\']//div[contains(@class,\'is-added\')][.//b[text()=\'Teaching Critical Thinking\']]//button[contains(@class,\'fb-undo\')]", document, null, 9, null).singleNodeValue; if (!u) { return "no undo"; } u.click(); return true;');
  check('2 the row is a plus row again', (await rowInfo(P, 'Teaching Critical Thinking')).plus, true);
  check('2 gone on the device', await countTitle(P, 'Teaching Critical Thinking'), 0);
  check('2 deleteBook called once, for the book this visit created', (await calls(P)).del.length, 1);
  await P.wait(2000);
  check('2 gone in the cloud', [cloudTitle('Teaching Critical Thinking'), rig.cloud.books(U).length], [null, before2]);
  await reopen(P);
  check('2 after a close and a reopen: still gone, on the device and in the cloud', [await countTitle(P, 'Teaching Critical Thinking'), cloudTitle('Teaching Critical Thinking')], [0, null]);

  // ---------------------------------------------------------------- 3
  await stage('3', 'a tap with no signal, the app closed, the signal back, reopened');
  rig.cloud.offline.add('phone');
  await openPanel(P);
  await type(P, '#fb-q', 'bone');
  check('3 the tap', await tapRow(P, 'Bone Black', 800), 'Add Bone Black by bell hooks to your shelf');
  check('3 on the device; not yet in the cloud', [await countTitle(P, 'Bone Black'), cloudTitle('Bone Black')], [1, null]);
  await P.wait(400);
  P.close(); rig.cloud.offline.delete('phone'); await reopen(P);
  check('3 reopened with the signal back: kept, on the device and in the cloud', [await countTitle(P, 'Bone Black'), cloudTitle('Bone Black') && cloudTitle('Bone Black').status], [1, 'will-read']);
  // the guard for 6's finishedAt check: a book added as Will read by a tap carries no finishedAt
  const fin3 = await ev(P, 'var k, b; for (k in state.books) { b = state.books[k]; if (b && b.title === "Bone Black") { return { id: k, fin: (b.finishedAt === undefined || b.finishedAt === null) ? "none" : b.finishedAt }; } } return null;');
  const c3 = rig.cloud.book(U, fin3.id);
  check('3 a tap adds Will read: no finishedAt, on the device or in the cloud', [fin3.fin, c3 ? ((c3.finishedAt === undefined || c3.finishedAt === null) ? 'none' : c3.finishedAt) : 'no cloud record'], ['none', 'none']);

  // ---------------------------------------------------------------- 4
  await stage('4', 'a book already on the shelf is never added again, and Undo never reaches it');
  const del4 = (await calls(P)).del.length;
  await openPanel(P);
  await type(P, '#fb-q', 'love');
  check('4 by title and author: an owned row with its status, no plus, no Undo, no Editions', await rowInfo(P, 'All About Love'),
    { cls: 'fb-row is-owned', on: 'On your shelf · Have read', undo: false, plus: false, pressed: null, eds: false, small: 'bell hooks · 2000' });
  check('4 its tap target names it', await ev(P, rowOf('All About Love') + ' return row.querySelector(".fb-hit").getAttribute("aria-label");'), 'Open All About Love, already on your shelf');
  await type(P, '#fb-q', '978-0-06-095947-0', 900);
  check('4 by ISBN (a title the identity key would not match): found by resolveBook, owned', [await rows(P), (await calls(P)).rb], [['=All About Love: New Visions'], 1]);
  check('4 the ISBN row\'s second line', (await rowInfo(P, 'All About Love: New Visions')).small, 'bell hooks · 2000 · ISBN 9780060959470');
  // a row drawn as a plus, then the same book arrives (another device, a scan): the tap adds nothing
  await type(P, '#fb-q', 'will to change');
  check('4 The Will to Change: a plus row', (await rowInfo(P, 'The Will to Change')).plus, true);
  await P.ev("__r2Book('The Will to Change', 'bell hooks', '', 'reading')");
  await tapRow(P, 'The Will to Change', 700);
  check('4 tapped after it arrived: one copy, the row owned, no Undo', [await countTitle(P, 'The Will to Change'), (await rowInfo(P, 'The Will to Change')).cls, (await rowInfo(P, 'The Will to Change')).undo], [1, 'fb-row is-owned', false]);
  // and from Search's All books side
  await go(P, '#search');
  await clickText(P, '.r1-search .r1-side-b', 'All books');
  await type(P, '#r1-q', 'love');
  check('4 from Search: the owned row', (await rowInfo(P, 'All About Love')).cls, 'fb-row is-owned');
  await type(P, '#r1-q', '9780060959470', 900);
  check('4 from Search, by ISBN: owned', await rows(P), ['=All About Love: New Visions']);
  check('4 deleteBook never called in 4; one All About Love on the shelf', [(await calls(P)).del.length - del4, await countTitle(P, 'All About Love')], [0, 1]);

  // ---------------------------------------------------------------- 5
  await stage('5', 'an edition picked: its year, publisher, pageCount and ISBN are what is stored');
  await openPanel(P);
  await type(P, '#fb-q', 'discipline');
  check('5 the row offers Editions', (await rowInfo(P, 'Discipline and Punish')).eds, true);
  await ev(P, rowOf('Discipline and Punish') + ' row.querySelector(".fb-eds").click(); return true;');
  await P.wait(500);
  check('5 the picker opens inside the row', await ev(P, rowOf('Discipline and Punish') + ' var l = row.querySelectorAll(".fb-edl .fb-ed .fb-tx b"), o = [], i; for (i = 0; i < l.length; i++) { o.push(l[i].textContent); } return [row.querySelector(".fb-eds").getAttribute("aria-expanded"), o];'),
    ['true', ['1995 · Vintage Books', '1977 · Pantheon Books', '1975 · Gallimard']]);
  check('5 the edition\'s plus names it', await ev(P, rowOf('Discipline and Punish') + ' var h = row.querySelector(".fb-edl .fb-ed .fb-hit"); h.click(); return h.getAttribute("aria-label");'), 'Add the 1995 Vintage Books edition of Discipline and Punish');
  await P.wait(900);
  check('5 on the device: 1995, Vintage Books, 333, its ISBN', await byTitle(P, 'Discipline and Punish').then((b) => [b.year, b.publisher, b.pageCount, b.isbn]), ['1995', 'Vintage Books', 333, '9780679752554']);
  check('5 the row: added, the edition\'s year', (await rowInfo(P, 'Discipline and Punish')).small, 'Michel Foucault · 1995');
  await P.wait(1500);
  check('5 in the cloud the same', [cloudTitle('Discipline and Punish').year, cloudTitle('Discipline and Punish').publisher, cloudTitle('Discipline and Punish').pageCount, cloudTitle('Discipline and Punish').isbn], ['1995', 'Vintage Books', 333, '9780679752554']);
  // a picker that fails: the link goes away quietly
  await mode(P, { eds: 'fail' });
  await type(P, '#fb-q', 'feminism');
  await ev(P, rowOf('Feminism Is for Everybody') + ' row.querySelector(".fb-eds").click(); return true;');
  await P.wait(500);
  check('5 the picker failing: the Editions link goes, the row stays', [(await rowInfo(P, 'Feminism Is for Everybody')).eds, (await rowInfo(P, 'Feminism Is for Everybody')).plus], [false, true]);
  await mode(P, { eds: 'ok' });

  // ---------------------------------------------------------------- 6
  await stage('6', 'by hand: a title alone saves; no title, no save, even with an ISBN');
  await type(P, '#fb-q', 'the lathe of heaven');
  check('6 no results: the card', await card(P), { title: 'No book matches “the lathe of heaven”', text: 'Check the spelling or try the author’s name. You can also add it by hand.', btns: ['Add it by hand'] });
  await clickText(P, '#fb-body .fb-btn', 'Add it by hand');
  const hf = await ev(P, 'return { t: document.getElementById("fb-ht").value, i: document.getElementById("fb-hi").value, dis: document.getElementById("fb-hsave").disabled, focus: document.activeElement && document.activeElement.id, pressed: document.querySelector("#fb-hs [aria-pressed=true]").textContent };');
  check('6 the form: what was typed is the title, the cursor there, Will read pressed', hf, { t: 'the lathe of heaven', i: '', dis: false, focus: 'fb-ht', pressed: 'Will read' });
  await type(P, '#fb-ht', '', 200); await type(P, '#fb-hi', '9780000000002', 200);
  check('6 no title, an ISBN: Add to shelf disabled', await ev(P, 'return document.getElementById("fb-hsave").disabled;'), true);
  const n6 = await ev(P, 'return state.userBooks[getCurrentUser().uid].bookIds.length;');
  await ev(P, 'var f = document.getElementById("fb-form"); f.requestSubmit ? f.requestSubmit() : f.dispatchEvent(new Event("submit")); return true;');
  await P.wait(500);
  check('6 a submit anyway (Enter): nothing saved', await ev(P, 'return state.userBooks[getCurrentUser().uid].bookIds.length;'), n6);
  await type(P, '#fb-hi', '', 200); await type(P, '#fb-ht', 'The Lathe of Heaven', 200);
  await clickText(P, '#fb-body .fb-seg button', 'Have read');
  await clickText(P, '#fb-body .fb-btn', 'Add to shelf');
  await P.wait(800);
  check('6 a title alone: saved, no author, Have read', await byTitle(P, 'The Lathe of Heaven').then((b) => b && [b.author, b.status, b.isbn]), ['', 'read', '']);
  // Have read by hand stamps finishedAt, as the book page and the status buttons do the first time a book goes 'read'
  await P.wait(1500);
  const fin6 = await ev(P, 'var k, b; for (k in state.books) { b = state.books[k]; if (b && b.title === "The Lathe of Heaven") { return { id: k, fin: typeof b.finishedAt }; } } return null;');
  const c6 = rig.cloud.book(U, fin6.id);
  check('6 Have read by hand: finishedAt a number, on the device and in the cloud', [fin6.fin, c6 ? typeof c6.finishedAt : 'no cloud record'], ['number', 'number']);
  check('6 the field emptied; the scan rows and every book added in this visit (the edition from 5, then this one), its second line empty (nothing invented)', [(await panelState(P)).q, await rows(P), (await rowInfo(P, 'The Lathe of Heaven')).small], ['', ['+Discipline and Punish', '+The Lathe of Heaven'], '']);
  await type(P, '#fb-q', '0123456789', 900);
  check('6 an ISBN with no match: its own card', (await card(P)).text, 'Check the number, or add the book by hand.');
  await clickText(P, '#fb-body .fb-btn', 'Add it by hand');
  check('6 an ISBN typed goes into ISBN; Title starts empty; Add to shelf disabled', await ev(P, 'return [document.getElementById("fb-ht").value, document.getElementById("fb-hi").value, document.getElementById("fb-hsave").disabled];'), ['', '0123456789', true]);
  await clickText(P, '#fb-body .fb-btn', 'Back to search');
  check('6 Back to search: the card again, from memory', [(await card(P)).text, (await calls(P)).rb], ['Check the number, or add the book by hand.', 3]);

  // ---------------------------------------------------------------- 7
  await stage('7', 'the lookup failing, empty, and with no connection');
  await mode(P, { ol: 'fail', gb: 'ok' });
  let c7 = await calls(P);
  await type(P, '#fb-q', 'hope', 900);
  check('7 Open Library failing: Google Books answers', [await rows(P), (await calls(P)).gb - c7.gb], [['Pedagogy of Hope'], 1]);
  await tapRow(P, 'Pedagogy of Hope', 800);
  check('7 a Google Books row adds with its publisher, pages and subjects', await ev(P, 'var k, b; for (k in state.books) { b = state.books[k]; if (b.title === "Pedagogy of Hope") { return [b.publisher, b.pageCount, b.rawCategories]; } } return null;'), ['GB Press', 222, ['Education']]);
  await mode(P, { ol: 'fail', gb: 'fail' });
  await type(P, '#fb-q', 'freedom', 900);
  check('7 both failing: the lookup-down card', await card(P), { title: 'The book lookup isn’t answering', text: 'Try again in a minute, or add the book by hand.', btns: ['Try again', 'Add it by hand'] });
  await mode(P, { ol: 'ok', gb: 'ok' });
  await clickText(P, '#fb-body .fb-btn', 'Try again');
  await P.wait(500);
  check('7 Try again asks again for the same words', await rows(P), ['Pedagogy of Freedom']);
  await mode(P, { ol: 'empty', gb: 'empty' });
  await type(P, '#fb-q', 'zzzz nothing', 900);
  check('7 both empty: no results', (await card(P)).title, 'No book matches “zzzz nothing”');
  await mode(P, { ol: 'ok', gb: 'ok' });
  await ev(P, 'Object.defineProperty(navigator, "onLine", { configurable: true, get: function () { return false; } }); return true;');
  c7 = await calls(P);
  await type(P, '#fb-q', 'origins', 900);
  check('7 offline: the offline card', await card(P), { title: 'You’re offline', text: 'Finding a book needs a connection. You can still add one by hand.', btns: ['Add it by hand', 'Try again'] });
  const c7b = await calls(P);
  check('7 offline: nothing was asked', [c7b.ol - c7.ol, c7b.gb - c7.gb, c7b.rb - c7.rb], [0, 0, 0]);
  await ev(P, 'delete navigator.onLine; return navigator.onLine;');
  await clickText(P, '#fb-body .fb-btn', 'Try again');
  await P.wait(500);
  check('7 back online, Try again: the rows', await rows(P), ['The Origins of Totalitarianism']);

  // ---------------------------------------------------------------- 9
  await stage('9', 'a late answer for older words is not drawn over the newer words\' rows');
  await mode(P, { delay: { pedag: 1600 } });
  await type(P, '#fb-q', 'pedag', 500);    // asked; its answer is held back
  await type(P, '#fb-q', 'arendt', 700);   // asked and answered
  check('9 the newer words\' rows', await rows(P), ['The Human Condition', 'The Origins of Totalitarianism']);
  await P.wait(1600);                      // the older answer lands now
  check('9 after the late answer: still the newer words\' rows, the field unchanged', [await rows(P), (await panelState(P)).q], [['The Human Condition', 'The Origins of Totalitarianism'], 'arendt']);
  check('9 the late answer is kept: "pedag" again is drawn from memory, not asked again', await (async () => { const n = (await calls(P)).ol; await type(P, '#fb-q', 'pedag', 500); return [(await calls(P)).ol - n, (await rows(P)).length]; })(), [0, 4]);
  // B4: a later lookup leaves the old list in place, dimmed, until the new one lands (the red-team's second pass: it never did)
  await mode(P, { delay: { freire: 1500 } });
  await type(P, '#fb-q', 'freire', 600);
  check('9 while the next answer is on its way: the old list stays, dimmed; no placeholder rows', await ev(P, 'var l = document.querySelector("#fb-body .fb-list"); return [l ? l.className : null, document.querySelectorAll("#fb-body .fb-row.is-wait").length, document.querySelectorAll("#fb-body .fb-list .fb-row").length];'), ['fb-list is-stale', 0, 4]);
  await P.wait(1500);
  check('9 then the new rows, not dimmed', await ev(P, 'var l = document.querySelector("#fb-body .fb-list"); return [l.className, l.querySelectorAll(".fb-row").length > 4];'), ['fb-list', true]);
  await mode(P, { delay: {} });

  // ---------------------------------------------------------------- 11
  await stage('11', 'a title holding markup is drawn as text and runs nothing');
  await type(P, '#fb-q', 'xss book', 900);
  const x11 = await ev(P, 'var r = document.querySelector("#fb-body .fb-row:not(.is-way)"); return { title: r.querySelector(".fb-tx > b").textContent, small: r.querySelector(".fb-tx > small").textContent, imgs: r.querySelectorAll(".fb-tx img, .fb-tx b b").length, xss: window.__xss === undefined ? "none" : window.__xss, tile: r.querySelector(".fb-cov").textContent };');
  check('11 drawn as text; no element made from it; nothing ran', x11, { title: '<img src=x onerror="window.__xss=1">Xss Book', small: 'Mallory <b onclick="window.__xss=2">Bold</b> · 2020', imgs: 0, xss: 'none', tile: '<' });
  await tapRow(P, '<img src=x onerror="window.__xss=1">Xss Book', 800);
  await go(P, '#books');
  check('11 added and drawn on the Shelf: still nothing ran', await ev(P, 'return window.__xss === undefined ? "none" : window.__xss;'), 'none');

  // ---------------------------------------------------------------- b
  await stage('b', 'Back from a book opened from the panel: the panel, its words and its list');
  await openPanel(P);
  await type(P, '#fb-q', 'teach');
  const rb0 = await rows(P);
  await tapRow(P, 'Teaching Community', 800);
  check('b an owned row opens its book page', await P.ev('location.hash.indexOf("#book/") === 0'), true);
  await click(P, '#app .ol-back');
  await P.wait(700);
  check('b Back: the Shelf with the panel open, the same words and list', [await P.ev('location.hash'), (await panelState(P)).inShelf, (await panelState(P)).q, await rows(P)], ['#books', true, 'teach', rb0]);
  await go(P, '#home'); await go(P, '#books');
  check('b any other way back to the Shelf: the panel closed', await ev(P, 'return !!document.querySelector("#shelf-editor-host > .fb");'), false);
  await openPanel(P);
  await clickText(P, '.shelf.sh3 .fb-done', 'Done');
  check('b Done closes it; the pill takes the focus', await ev(P, 'return [!!document.querySelector("#fb"), document.activeElement && document.activeElement.className];'), [false, 'sh3-add']);

  // ---------------------------------------------------------------- u (the red-team's F1)
  await stage('u', 'Undo ends when the reader leaves the room the book was added in');
  const delU = (await calls(P)).del.length;
  await openPanel(P);
  await type(P, '#fb-q', 'hooks');
  await tapRow(P, 'Feminism Is for Everybody', 800);
  check('u added: the row offers Undo', (await rowInfo(P, 'Feminism Is for Everybody')).undo, true);
  await tapRow(P, 'Teaching Community', 800);   // leaves for a book page
  await P.ev('T.artifact(' + J((await byTitle(P, 'Feminism Is for Everybody')).id) + ", 'words written on the new book while away')");
  await click(P, '#app .ol-back');
  await P.wait(700);
  check('u Back: the panel and its words; the added book is now an owned row with no Undo; nothing deleted',
    [(await panelState(P)).q, (await rowInfo(P, 'Feminism Is for Everybody')).cls, (await rowInfo(P, 'Feminism Is for Everybody')).undo, await ev(P, 'return document.querySelectorAll("#fb-body .fb-undo").length;'), (await calls(P)).del.length - delU, await countTitle(P, 'Feminism Is for Everybody')],
    ['hooks', 'fb-row is-owned', false, 0, 0, 1]);
  await go(P, '#search');
  await clickText(P, '.r1-search .r1-side-b', 'All books');
  await type(P, '#r1-q', 'freire', 800);
  await tapRow(P, 'Pedagogy of the Heart', 800);
  check('u on Search: added, with Undo', (await rowInfo(P, 'Pedagogy of the Heart')).undo, true);
  await tapRow(P, 'Pedagogy of Hope', 800);   // an owned row: leaves for its book page
  await click(P, '#app .ol-back');
  await P.wait(700);
  check('u on Search, back from the book: All books, the words, the row owned with no Undo; nothing deleted',
    [await P.ev('location.hash'), await P.ev('document.getElementById("r1-q").value'), (await rowInfo(P, 'Pedagogy of the Heart')).undo, (await rowInfo(P, 'Pedagogy of the Heart')).cls, (await calls(P)).del.length - delU],
    ['#search', 'freire', false, 'fb-row is-owned', 0]);

  // ---------------------------------------------------------------- f (the red-team's F3)
  await stage('f', 'a redraw the panel did not ask for (a sync landing) keeps the field\'s focus and caret');
  await openPanel(P);
  await type(P, '#fb-q', 'arendt');
  await ev(P, 'var q = document.getElementById("fb-q"); q.focus(); q.setSelectionRange(2, 4); return true;');
  await ev(P, 'renderShelf(); return true;');
  check('f after renderShelf from outside: the same words, focus, caret [2,4], the list', await panelState(P), { q: 'arendt', focus: true, caret: [2, 4], rows: 2, inShelf: true });
  await clickText(P, '.shelf.sh3 .fb-done', 'Done');

  // ---------------------------------------------------------------- s
  await stage('s', 'All books: Back from a book opened from it keeps the words; a fresh visit forgets them (R-1)');
  await go(P, '#search');
  check('s a fresh visit opens on Your library, its hint as before', await ev(P, 'var q = document.getElementById("r1-q"); return [q.value, q.placeholder, q.getAttribute("aria-label")];'), ['', 'A title, an author, a note, a lens', 'Search your shelf, notes and lenses']);
  await type(P, '#r1-q', 'nothing like it', 400);
  check('s no match on Your library: the line and a way to All books, in one fb-body', await ev(P, 'var b = document.querySelector("#r1-res .fb-body"); return b ? [b.querySelector(".ol-foot").textContent, b.querySelector(".fb-hand").textContent] : null;'),
    ['Nothing on your shelf, in your notes or among your lenses matches “nothing like it”.', 'Look for “nothing like it” in All books']);
  await click(P, '#r1-res .fb-body .fb-hand');
  await P.wait(500);
  check('s it switches to All books with the words kept', await ev(P, 'var q = document.getElementById("r1-q"); return [q.value, q.placeholder, q.getAttribute("aria-label"), document.querySelectorAll(".r1-side-b")[1].getAttribute("aria-pressed")];'), ['nothing like it', 'Title, author or ISBN', 'Find a book by title, author or ISBN', 'true']);
  await type(P, '#r1-q', 'hooks', 800);
  check('s All books rows in the full-width holder', await ev(P, 'return !!document.querySelector("#r1-res .r1-wide > .fb-body > .fb-list");'), true);
  await tapRow(P, 'Teaching Community', 800);
  await click(P, '#app .ol-back');
  await P.wait(700);
  check('s Back from the book: Search, All books, the words kept', await ev(P, 'return [location.hash, document.getElementById("r1-q").value, document.querySelectorAll(".r1-side-b")[1].getAttribute("aria-pressed")];'), ['#search', 'hooks', 'true']);
  await tapRow(P, 'Teaching Community', 800);
  await go(P, '#home');
  await go(P, '#book/' + (await byTitle(P, 'Teaching Community')).id);
  await go(P, '#search');
  check('s R-1: book from Search, then Home, then the same book, then Search: a fresh visit', await ev(P, 'return [document.getElementById("r1-q").value, document.querySelectorAll(".r1-side-b")[0].getAttribute("aria-pressed")];'), ['', 'true']);
  check('s C-1: the device line', await ev(P, 'return document.querySelector(".r1-under .ol-foot").textContent;'), 'Searched on this device. The Journal is never searched.');

  // ---------------------------------------------------------------- c
  await stage('c', 'the Capture chip: after Scan a book; it opens the panel with the cursor in the field');
  await go(P, '#home');
  await click(P, '#capCreateDoor');
  check('c the chip follows "Scan a book"', await ev(P, 'var l = document.querySelectorAll(".capdoor-modes .capdoor-mode"), o = [], i; for (i = 0; i < l.length; i++) { o.push(l[i].getAttribute("data-mode") + ":" + l[i].textContent.replace(/[^ -~]/g, "")); } return o.slice(-2);'), ['scan:Scan a book', 'find:Find a book']);
  await click(P, '.capdoor-mode[data-mode="find"]');
  await P.wait(900);
  check('c the sheet closed; the Shelf with the panel open, the cursor in its field', await ev(P, 'return [document.getElementById("capSheet").classList.contains("is-open"), location.hash, !!document.querySelector("#shelf-editor-host > .fb"), document.activeElement && document.activeElement.id];'), [false, '#books', true, 'fb-q']);

  // ---------------------------------------------------------------- 8
  await stage('8', 'findbook=old: the typed form, no All books side, no Capture chip');
  await ev(P, 'sv("praxis_r1_findbook_" + getCurrentUser().uid, false); return true;');
  await go(P, '#home'); await go(P, '#books');
  await click(P, '.shelf.sh3 .sh3-add');
  check('8 the pill opens the typed form, not the panel', await ev(P, 'var h = document.getElementById("shelf-editor-host"); return [!!h.querySelector(".fb"), !!h.querySelector("input"), h.childElementCount > 0];'), [false, true, true]);
  await go(P, '#search');
  check('8 Search has no All books side', await ev(P, 'return document.querySelectorAll(".r1-sides").length;'), 0);
  await click(P, '#capCreateDoor');
  check('8 the Capture chip is absent', await ev(P, 'return document.querySelectorAll(".capdoor-mode[data-mode=find]").length;'), 0);
  await ev(P, 'capClose(); sv("praxis_r1_findbook_" + getCurrentUser().uid, true); return true;');
  await click(P, '#capCreateDoor');
  check('8 back to new: the chip again', await ev(P, 'var n = document.querySelectorAll(".capdoor-mode[data-mode=find]").length; capClose(); return n;'), 1);

  // ---------------------------------------------------------------- e (an empty shelf)
  await stage('e', 'an empty shelf: the panel is always there, for the first book, with no Done');
  const E = await (await rig.device('newphone').open()).sign_in('r2-empty');
  await E.waitFor(LATCHES_OPEN, 40000); await E.wait(800); await stub(E);
  await go(E, '#books');
  check('e the panel is open, headed for the first book, no Done; the empty line reworded; no "+ Add a book"', await ev(E, 'var f = document.querySelector("#shelf-editor-host > .fb"); return [!!f, f && f.className, f && f.querySelector(".fb-h").textContent, !!document.querySelector(".fb-done"), document.querySelector(".shelf-empty-zero-line").textContent, document.querySelectorAll(".shelf-empty-zero-add").length];'),
    [true, 'fb is-first', 'Find your first book', false, 'Your shelf is empty. Each book you add shows up here.', 0]);
  await type(E, '#fb-q', 'undercommons');
  check('e a book with no cover: its first letter, The skipped', await ev(E, 'var c = document.querySelector("#fb-body .fb-row:not(.is-way) .fb-cov"); return [c.className, c.textContent];'), ['fb-cov is-none', 'U']);
  await tapRow(E, 'The Undercommons', 900);
  check('e the first book added: the panel stays, now "Find a book" with Done; the shelf reads 1 book', await ev(E, 'var f = document.querySelector("#shelf-editor-host > .fb"); return [f && f.className, f && f.querySelector(".fb-h").textContent, !!document.querySelector(".fb-done"), document.querySelector(".sh3-count").textContent];'), ['fb', 'Find a book', true, '1 book']);
  E.close();

  // ---------------------------------------------------------------- 12
  await stage('12', 'no page errors on any device');
  check('12 page errors, every device', { phone: P.errors, laptop: L.errors, newphone: E.errors }, { phone: [], laptop: [], newphone: [] });
});
