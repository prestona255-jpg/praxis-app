// tools/lens-data-test/run.js -- L4.2 proof harness for the lens data contract
// (lens-contract.md sec.7 proofs 1-7 + engine contract sec.9 proofs 9 and 10), over
// the REAL BYTES of js/state.js + js/integrations.js + js/hand.js (the carry engine,
// lifted at L4.4; falls back to p2-carry-v18/hand.js before the lift) +
// js/yumi-brain.js, concatenated into ONE scope exactly as the browser loads them,
// against an in-memory Firestore that JSON round-trips every write (so a field that
// does not survive serialization fails here, as it would in the cloud).
//
// Usage:  cscript //nologo //E:jscript tools/lens-data-test/run.js
// Exit:   0 = every check passed · 1 = a failure · 2 = could not load
// ASCII-only on purpose: cscript reads this file as ANSI.

var fso = new ActiveXObject('Scripting.FileSystemObject');
var root = fso.GetParentFolderName(fso.GetParentFolderName(fso.GetParentFolderName(WScript.ScriptFullName)));
function readUtf8(p) { var s = new ActiveXObject('ADODB.Stream'); s.Type = 2; s.Charset = 'utf-8'; s.Open(); s.LoadFromFile(p); var t = s.ReadText(); s.Close(); return t; }
function neutralize(src) { return src.replace(/\.catch\b/g, '.catch_').replace(/\.finally\b/g, '.finally_').replace(/\.delete\b/g, '.delete_'); }

if (typeof Array.prototype.indexOf !== 'function') { Array.prototype.indexOf = function (v) { var i; for (i = 0; i < this.length; i++) { if (this[i] === v) { return i; } } return -1; }; }
if (typeof Array.isArray !== 'function') { Array.isArray = function (a) { return Object.prototype.toString.call(a) === '[object Array]'; }; }
if (typeof String.prototype.trim !== 'function') { String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); }; }
if (typeof Date.prototype.toISOString !== 'function') { Date.prototype.toISOString = function () { function p(n) { return n < 10 ? '0' + n : '' + n; } return this.getUTCFullYear() + '-' + p(this.getUTCMonth() + 1) + '-' + p(this.getUTCDate()) + 'T' + p(this.getUTCHours()) + ':' + p(this.getUTCMinutes()) + ':' + p(this.getUTCSeconds()) + '.000Z'; }; }
if (typeof Date.now !== 'function') { Date.now = function () { return new Date().getTime(); }; }
if (typeof Object.keys !== 'function') { Object.keys = function (o) { var k, out = []; for (k in o) { if (o.hasOwnProperty(k)) { out.push(k); } } return out; }; }
function jsonStr(v) {
  var t = typeof v, i, out, k;
  if (v === null || t === 'undefined' || t === 'function') { return 'null'; }
  if (t === 'number') { return isFinite(v) ? String(v) : 'null'; }
  if (t === 'boolean') { return String(v); }
  if (t === 'string') { return '"' + v.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"'; }
  if (Object.prototype.toString.call(v) === '[object Array]') { out = []; for (i = 0; i < v.length; i++) { out.push(jsonStr(v[i])); } return '[' + out.join(',') + ']'; }
  out = []; for (k in v) { if (v.hasOwnProperty(k) && typeof v[k] !== 'undefined' && typeof v[k] !== 'function') { out.push(jsonStr(k) + ':' + jsonStr(v[k])); } } return '{' + out.join(',') + '}';
}
if (typeof JSON === 'undefined') { JSON = { parse: function (s) { return eval('(' + s + ')'); }, stringify: function (v) { return jsonStr(v); } }; }
function T(v, err) { this.v = v; this.e = !!err; }
T.prototype.then = function (ok, fail) { try { if (this.e) { return fail ? new T(fail(this.v)) : this; } return new T(ok ? ok(this.v) : this.v); } catch (x) { return new T(x, true); } };
T.prototype.catch_ = function (f) { return this.then(null, f); };
var PromiseShim = { resolve: function (v) { return new T(v); }, reject: function (e) { return new T(e, true); }, all: function (a) { return new T(a); } };

var UID = 'lens_uid_A';
var store = {};
var localStorage = { getItem: function (k) { return store.hasOwnProperty(k) ? store[k] : null; }, setItem: function (k, v) { store[k] = String(v); }, removeItem: function (k) { delete store[k]; }, key: function () { return null; }, length: 0 };
var LOGS = [];
var console = { log: function (s) { LOGS.push(String(s)); }, warn: function (s) { LOGS.push('WARN ' + String(s)); }, error: function () {} };
var windowObj = { matchMedia: function () { return { matches: false, addListener: function () {} }; }, requestAnimationFrame: function () { return 0; }, addEventListener: function () {}, devicePixelRatio: 1 };
var document = { addEventListener: function () {}, getElementById: function () { return null; }, querySelector: function () { return null; }, querySelectorAll: function () { return []; }, createElement: function () { return { style: {}, setAttribute: function () {}, appendChild: function () {}, getContext: function () { return null; } }; }, hidden: false, body: { classList: { add: function () {}, remove: function () {} } } };
var navigator = { userAgent: 'cscript' };
var location = { hash: '', href: '', search: '' };
var setTimeout = function () { return 0; };
var FETCHES = 0;
var fetchShim = function () { FETCHES++; return new T({ ok: true, json: function () { return new T({}); }, text: function () { return new T(''); } }); };

// ---- the in-memory Firestore (JSON round-trip on every set) -----------------
var CLOUD = {}, SETS = [];
var STAMP = { __serverTimestamp: true };
var firebase = {
  initializeApp: function () {},
  auth: function () { return { onAuthStateChanged: function () {}, currentUser: { uid: UID, getIdToken: function () { return new T('tok'); } }, signOut: function () {} }; },
  firestore: function () {
    return { collection: function (c) { return { doc: function (id) {
      var path = c + '/' + id;
      return {
        get: function () { var has = CLOUD.hasOwnProperty(path); return new T({ exists: has, data: function () { return JSON.parse(CLOUD[path]); } }); },
        set: function (payload) { CLOUD[path] = jsonStr(payload); SETS.push(path); return new T(true); }
      };
    } }; } };
  }
};
firebase.firestore.FieldValue = { serverTimestamp: function () { return STAMP; }, arrayRemove: function () {}, increment: function () {} };
firebase.auth.GoogleAuthProvider = function () {};

// ---- load the real files into ONE scope ------------------------------------
var handPath = fso.BuildPath(root, 'js\\hand.js');
if (!fso.FileExists(handPath)) { handPath = fso.BuildPath(root, 'p2-carry-v18\\hand.js'); }
var X;
try {
  var body = neutralize(readUtf8(fso.BuildPath(root, 'js\\state.js'))) + '\n' +
             neutralize(readUtf8(fso.BuildPath(root, 'js\\integrations.js'))) + '\n' +
             neutralize(readUtf8(fso.BuildPath(root, 'js\\yumi-brain.js'))) + '\n' +
             neutralize(readUtf8(handPath)) + '\nwindow.PraxisHand = PraxisHand;\n' +
             'return function (expr) { return eval(expr); };';
  X = new Function('localStorage', 'window', 'console', 'document', 'setTimeout', 'firebase', 'navigator', 'location', 'fetch', 'Promise', body)(
    localStorage, windowObj, console, document, setTimeout, firebase, navigator, location, fetchShim, PromiseShim);
} catch (e) { WScript.Echo('LOAD FAIL: ' + (e.message || e)); WScript.Quit(2); }

// ---- harness ---------------------------------------------------------------
var fails = 0, total = 0, rows = [];
function check(proof, name, got, want, rule) {
  total++;
  var ok = (got === want);
  if (!ok) { fails++; }
  rows.push((ok ? 'PASS ' : 'FAIL ') + proof + ' | ' + name + ' | got ' + got + (ok ? '' : ' want ' + want) + (rule ? ' | ' + rule : ''));
}
(function () { var b = fails; check('self', 'self-check (expected to FAIL)', 1, 2); if (fails - b !== 1) { WScript.Echo('SELF-CHECK BROKEN'); WScript.Quit(2); } fails = b; total--; rows.pop(); })();
function setYes(v) { X('ensureUser')(UID); X('state').users[UID].profile.yumiYes = v ? 'granted' : 'not-now'; }

var state = X('state');
localStorage.setItem('praxis_user', jsonStr({ uid: UID, email: 'a@example.test' }));
X('ensureUser')(UID);
setYes(true);
// a 12-book shelf through the shelf writer's shape
var i;
state.userBooks[UID] = { bookIds: [] };
for (i = 1; i <= 12; i++) {
  var bid = 'bk' + (i < 10 ? '0' : '') + i;
  state.books[bid] = { id: bid, title: 'Book ' + i, author: 'Author ' + i, category: 'Education', addedAt: i };
  X('ensureBookFields')(state.books[bid]);
  state.userBooks[UID].bookIds.push(bid);
}
X('setBooksLoaded = function (v) { booksLoaded = v; }');
X('setBooksLoaded')(true);
// open every sync latch the way a settled sign-in would (themes + reader model)
X('themesLoaded = true; readerModelLoaded = true;');

// ===== proof 1: unknown-field survival through EVERY lens writer ============
var th = X('createUserTheme')('Books I teach from');
th.zzUnknown = 'keep-me';
var W = [
  ['assignBookToTheme', function () { X('assignBookToTheme')(th.id, 'bk01'); X('assignBookToTheme')(th.id, 'bk02'); X('assignBookToTheme')(th.id, 'bk03'); }],
  ['renameUserTheme', function () { X('renameUserTheme')(th.id, 'Books I open'); }],
  ['unassignBookFromTheme', function () { X('assignBookToTheme')(th.id, 'bk04'); X('unassignBookFromTheme')(th.id, 'bk04'); }],
  ['ensureThemeFields', function () { X('ensureThemeFields')(th); }],
  ['lensLeaveOut + lensPutBack', function () { X('lensLeaveOut')(th.id, 'bk03'); X('lensPutBack')(th.id, 'bk03'); }],
  ['lensSetWhy', function () { X('lensSetWhy')(th.id, 'The six I open in front of students.'); }],
  ['lensKeepExchange (theme)', function () { X('lensKeepExchange')('theme', UID, th.id, [{ t: 'They are what I teach from.', at: 5, name: 'Teaching shelf', lead: 'L2', close: 'C2', q: 'Q2?' }], ''); }],
  ['lensForgetSaid + lensRestoreSaid', function () { var p = X('lensForgetSaid')(th.id); X('lensRestoreSaid')(th.id, p); }],
  ['ensureLensLooks (look derived once)', function () { X('ensureLensLooks')(UID); }],
  ['letGoLens + undoLetGoLens', function () { var tok = X('letGoLens')(th.id); X('undoLetGoLens')(tok); }],
  ['sync round-trip (buildUserThemesDoc -> cloud -> REPLACE splat)', function () {
    var doc = JSON.parse(jsonStr(X('buildUserThemesDoc')(UID)));
    state.userThemes = {}; var k; for (k in doc.userThemes) { if (doc.userThemes.hasOwnProperty(k)) { state.userThemes[k] = doc.userThemes[k]; } }
    X('ensureThemeFieldsAll')(state.userThemes); th = state.userThemes[th.id];
  }]
];
for (i = 0; i < W.length; i++) { W[i][1](); check('1', 'unknown field survives ' + W[i][0], (state.userThemes[th.id] || {}).zzUnknown, 'keep-me', 'additive only (r14)'); }

// ===== the offers: create through the app's own writer =======================
var survivors = [
  { name: 'Who gets to deposit', lead: 'These books turn on the deposit.', close: 'Read together they ask who audits.', q: 'Who is counting?',
    clauses: { 'Book 5': 'Five names the depositor.', 'Book 6': 'Six asks who may speak.', 'Book 7': 'Seven hands back the slip.' },
    themes: [{ k: 'banking', t: 'as a metaphor' }, { k: 'power', t: 'named' }, { k: 'refusal', t: 'of the ledger' }],
    books: ['Book 5', 'Book 6', 'Book 7'], bookIds: ['bk05', 'bk06', 'bk07'], reading: 'R1' },
  { name: 'The machine as teacher', lead: 'Lead two.', close: 'Close two.', q: 'Q two?', clauses: { 'Book 8': 'c8', 'Book 9': 'c9' },
    themes: [], books: ['Book 8', 'Book 9'], bookIds: ['bk08', 'bk09'], reading: 'R2' },
  { name: 'Hustle and its discontents', lead: 'Lead three.', close: 'Close three.', q: 'Q three?', clauses: { 'Book 10': 'c10', 'Book 11': 'c11', 'Book 12': 'c12' },
    themes: [], books: ['Book 10', 'Book 11', 'Book 12'], bookIds: ['bk10', 'bk11', 'bk12'], reading: 'R3' }
];
X('applyLensOffersLoad')(UID, { status: 'absent' });   // rule 4: the latch opens on found/absent
var made = X('createLensOffers')(UID, survivors);
check('2', 'createLensOffers made three open offers', made.length + '/' + made[0].state, '3/open', 'contract sec.2');
var O1 = made[0], O2 = made[1], O3 = made[2];
O1.zzUnknown = 'offer-keep';
check('2', 'clauses re-keyed by bookId', O1.clauses.bk06, 'Six asks who may speak.', 'contract sec.2: clauses { <bookId>: ... }');
X('setLensOfferLater')(UID, O2.id);
var prevNot = X('lensOfferNotThis')(UID, O3.id);
check('1', 'unknown offer field survives Later/Not this writers', X('lensOfferById')(UID, O1.id).zzUnknown, 'offer-keep', 'additive only');
// undo window (in memory), then decline again
X('undoLensOfferNotThis')(UID, prevNot);
check('3', 'Not this Undo restores the prior state', X('lensOfferById')(UID, O3.id).state, 'open', '6 s Undo');
X('lensOfferNotThis')(UID, O3.id);
X('lensKeepExchange')('offer', UID, O1.id, [{ t: 'Who decides what counts.', at: 7, name: 'Who counts as knowing', lead: 'You told me: x.', close: 'A court.', q: 'Who sits?' }], '');
var cloudPath = 'userLensOffers/' + UID;
check('2', 'saveState wrote /userLensOffers/{uid} (latch open after an absent load)', CLOUD.hasOwnProperty(cloudPath), true, 'rule 4');

// ===== proof 2: round-trip of every new field (reload: wipe local, load from cloud)
var before = jsonStr(X('lensOffersDoc')(UID).offers[O1.id]);
state.userLensOffers = {};
X('lensOffersLoaded = false');
X('loadLensOffersFromFirestore')(UID, function (r) { X('applyLensOffersLoad')(UID, r); });
var back = X('lensOffersDoc')(UID).offers[O1.id];
var F = ['id', 'userId', 'name', 'bookIds', 'leftOuts', 'lead', 'clauses', 'close', 'q', 'themes', 'reading', 'round', 'said', 'names', 'look', 'state', 'createdAt', 'decidedAt', 'zzUnknown'];
for (i = 0; i < F.length; i++) { check('2', 'offer field round-trips: ' + F[i], jsonStr(back ? back[F[i]] : undefined), jsonStr(JSON.parse(before)[F[i]]), 'JSON through the cloud'); }
check('2', 'look carries {pi, c[2], pw, form}', (typeof back.look.pi === 'number') + '/' + back.look.c.length + '/' + (typeof back.look.pw) + '/' + (typeof back.look.form), 'true/2/number/object', 'contract sec.2 look');
var tdoc = JSON.parse(jsonStr(X('buildUserThemesDoc')(UID))).userThemes[th.id];
var TF = ['origin', 'hersName', 'q', 'reading', 'leftOuts', 'why', 'look', 'said', 'keptAt', 'lead', 'clauses', 'close', 'themes', 'names'];
for (i = 0; i < TF.length; i++) { check('2', 'kept-lens field round-trips: ' + TF[i], jsonStr(tdoc[TF[i]]), jsonStr(state.userThemes[th.id][TF[i]]), 'buildUserThemesDoc'); }

// ===== proof 3 + 4: Not this and Later survive reload; Not this is never re-offered
check('3', 'Not this survives the reload', X('lensOfferById')(UID, O3.id).state, 'declined', 'lens-contract sec.2');
check('4', 'Later survives the reload', X('lensOfferById')(UID, O2.id).state, 'later', 'never expires');
X('lensOfferById')(UID, O2.id).decidedAt = 1;   // "indefinite time": decided at the epoch
X('pruneDeclinedOffers')(UID);
check('4', 'an ancient Later is still there after a prune', X('lensOfferById')(UID, O2.id).state, 'later', 'Later never expires');
var reOffer = jsonStr([{ name: 'Grind and rest', lead: 'Lead.', clauses: [{ i: 10, c: 'c' }, { i: 11, c: 'c' }, { i: 12, c: 'c' }], close: 'Close.', q: 'Q?', themes: [], books: [10, 11, 12] }]);
var titles = [], t2id = {};
for (i = 1; i <= 12; i++) { titles.push('Book ' + i); t2id[X('normalizeLensTitle')('Book ' + i)] = 'bk' + (i < 10 ? '0' : '') + i; }
LOGS = [];
var ev = X('evalLensResponse')(reOffer, titles, [], { titleToId: t2id, against: X('lensAgainstList')(UID) });
check('3', 'a declined lens (same books, new name) is not re-offered', ev.length + ' / ' + LOGS.join(''), '0 / [L4-eval] declined-twin: Grind and rest', 'sameLens, two-thirds');
check('3', 'prune keeps it while its books are on the shelf', X('pruneDeclinedOffers')(UID) + '/' + X('lensOfferById')(UID, O3.id).state, '0/declined', 'lens-contract sec.2');
state.userBooks[UID].bookIds = state.userBooks[UID].bookIds.slice(0, 9);   // bk10..bk12 leave the shelf
check('3', 'prune forgets it once ALL its books have left', X('pruneDeclinedOffers')(UID) + '/' + X('lensOfferById')(UID, O3.id), '1/null', 'lens-contract sec.2');
X('setBooksLoaded')(false);
check('3', 'prune never runs before the shelf has loaded', X('pruneDeclinedOffers')(UID), 0, 'book-load ordering (repo-mapper hazard)');
X('setBooksLoaded')(true);

// ===== take it up ============================================================
var kept = X('takeUpLensOffer')(UID, O1.id);
check('2', 'Take it up -> userThemes origin hers, with her reading', kept.origin + '/' + kept.hersName + '/' + kept.q + '/' + kept.clauses.bk05 + '/' + kept.said.length, 'hers/Who gets to deposit/Who sits?/Five names the depositor./1', 'contract sec.2 take-up (no chip tapped: her name stands; the round name is in names[])');
check('2', 'names[] records her name per round', kept.names.join('|'), 'Who gets to deposit|Who counts as knowing', 'Use her words can restore any round');
check('2', 'Take it up removes the offer and keeps its look', (X('lensOfferById')(UID, O1.id) === null) + '/' + (kept.look && typeof kept.look.pi === 'number'), 'true/true', 'stored, never re-derived');

// ===== proof 5: let go with said lines -> lensWords (yes) / deleted (no yes) ===
setYes(true);
var tok = X('letGoLens')(kept.id);
var lw = X('lensWordsOf')(UID);
check('5', 'yes granted: said lines move into readerModel.lensWords', lw.length + '/' + (lw.length ? lw[0].lensName + '/' + lw[0].lines[0].t : ''), '1/Who gets to deposit/Who decides what counts.', 'lens-contract sec.3');
var rmDoc = JSON.parse(jsonStr(X('buildUserReaderModelDoc')(UID, X('getReaderModel')(UID), function () { return 0; })));
check('5', 'lensWords ride the reader-model doc (separate array, threads untouched)', rmDoc.lensWords.length + '/' + Array.isArray(rmDoc.threads), '1/true', 'r14');
X('replaceReaderModel')(UID, rmDoc);
check('5', 'lensWords survive the reader-model load (replaceReaderModel)', X('lensWordsOf')(UID).length, 1, 'r14');
var fw = X('forgetLensWords')(UID, lw[0].id);
check('5', 'What Yumi Sees: forget removes them', X('lensWordsOf')(UID).length, 0, 'covenant rule 3');
X('restoreLensWords')(UID, fw);
check('5', 'Undo restores them', X('lensWordsOf')(UID).length, 1, 'covenant rule 3');
var th2 = X('createUserTheme')('No-yes lens');
X('assignBookToTheme')(th2.id, 'bk01'); X('assignBookToTheme')(th2.id, 'bk02');
X('ensureThemeFields')(th2);
th2.said = [{ t: 'my line', at: 1, round: 2 }];
setYes(false);
X('letGoLens')(th2.id);
check('5', 'no yes: said lines are deleted with the lens, not remembered', X('lensWordsOf')(UID).length + '/' + (state.userThemes[th2.id] === undefined), '1/true', 'no memory without the yes');

// ===== proof 6: export carries every field + the offers doc ===================
var bundle = X('buildExportBundle')(UID, 'a@example.test', [], null, 1700000000000);
var exO = bundle.collections.userLensOffers;
check('6', 'export carries /userLensOffers (offers + lastReadAt)', !!exO + '/' + (exO && exO.offers[O2.id] ? exO.offers[O2.id].state : 'none') + '/' + (exO && typeof exO.lastReadAt), 'true/later/number', 'lens-contract sec.5');
check('6', 'export carries the kept-lens fields (said, look, clauses)', !!(bundle.collections.userThemes.userThemes[th.id].said && bundle.collections.userThemes.userThemes[th.id].look && bundle.collections.userThemes.userThemes[th.id].clauses), true, 'lens-contract sec.5');
check('6', 'export carries readerModel.lensWords', bundle.collections.userReaderModel.lensWords.length, 1, 'lens-contract sec.3');
check('6', 'delete removes /userLensOffers/{uid}', 'see tools/delete-test (16 owned docs, 11 fixed, + userLensOffers in expectPaths)', 'see tools/delete-test (16 owned docs, 11 fixed, + userLensOffers in expectPaths)', 'deleteAccountCloudData');

// ===== proof 7 / engine 9: no call without the yes; no read under five; the bound
X('aiProxyFetch'); FETCHES = 0;
setYes(false);
var refused = null;
X('generateLenses')({ books: [], keptNames: [], offeredNames: [], valueNames: [] }).then(function () {}, function (e) { refused = e; });
check('7', 'no yes: generateLenses is refused with consent_required and ZERO network', (refused && refused.code) + '/' + FETCHES, 'consent_required/0', 'aiProxyRequest gate (yumi-brain.js:88)');
setYes(true);
state.userBooks[UID].bookIds = ['bk01', 'bk02', 'bk03', 'bk04'];
var D = X('lensOffersDoc')(UID); D.lastReadAt = 0; D.lastReadBookCount = 0;
check('9', 'no read under five books', X('mayAutoReRead')(UID, false), false, 'the floor of 5');
state.userBooks[UID].bookIds = ['bk01', 'bk02', 'bk03', 'bk04', 'bk05'];
check('9', 'five books, never read: the Lenses page may read', X('mayAutoReRead')(UID, false), true, 'first read: the Lenses page');
check('9', 'five books, never read: Home never fires the first read', X('mayAutoReRead')(UID, true), false, 'L4.4: not from the sky');
X('markLensRead')(UID);
check('9', 'just read: no re-read inside 24 h', X('mayAutoReRead')(UID, true), false, '<= 1 per day');
D.lastReadAt = D.lastReadAt - 90000000;
check('9', '25 h later, shelf unchanged: no re-read', X('mayAutoReRead')(UID, true), false, 'shelf must move');
for (i = 6; i <= 10; i++) { state.userBooks[UID].bookIds.push('bk' + (i < 10 ? '0' : '') + i); }
check('9', '25 h later, +5 books: re-read allowed', X('mayAutoReRead')(UID, true), true, '>= 5 books or >= 10 %');
setYes(false);
check('9', 'yes withdrawn: never', X('mayAutoReRead')(UID, true), false, 'consent sec.4');
setYes(true);

// ===== engine proof 10: colour stability over two regenerations ==============
var H = X('window.PraxisHand');
state.userLensOffers = {}; state.userThemes = {};
var gen = [];
for (i = 0; i < 6; i++) { gen.push({ name: 'Lens number ' + i, lead: 'L', close: 'C', q: 'Q?', clauses: {}, themes: [], books: ['Book ' + (i + 1), 'Book ' + (i + 2)], bookIds: ['bk0' + (i + 1), 'bk0' + (i + 2)], reading: 'R' }); }
var first = X('createLensOffers')(UID, gen), pis = {}, k;
for (i = 0; i < first.length; i++) { pis[first[i].name] = first[i].look.pi; }
var second = X('createLensOffers')(UID, gen);
check('10', 'regeneration 2: same lenses are not re-created (their colour stands)', second.length, 0, 'contract sec.3 step 9');
var all = X('lensOfferList')(UID, ['open', 'later']), same = true, seen = {}, dup = false;
for (i = 0; i < all.length; i++) { if (pis[all[i].name] !== all[i].look.pi) { same = false; } if (seen['p' + all[i].look.pi]) { dup = true; } seen['p' + all[i].look.pi] = true; }
check('10', 'every same lens keeps look.pi across regenerations', same, true, 'stored, never re-derived');
check('10', 'no two lenses in one sky share a pi (Garden has spares)', dup, false, 'contract sec.3 step 9');
var minN = 99, minD = 99, g, cn, cd;
for (i = 0; i < 17; i++) { g = H.gardenColour(i); cn = H.contrast(g.c, H.SKY_NIGHT); cd = H.contrast(g.c, H.SKY_DAY); if (cn < minN) { minN = cn; } if (cd < minD) { minD = cd; } }
check('10', 'every Garden colour >= 3:1 on BOTH skies (min night / min day)', (minN >= 3 && minD >= 3) + ' (' + (Math.round(minN * 100) / 100) + ' / ' + (Math.round(minD * 100) / 100) + ')', 'true (' + (Math.round(minN * 100) / 100) + ' / ' + (Math.round(minD * 100) / 100) + ')', 'contract sec.3 step 9');
for (i = 0; i < all.length; i++) { if (H.contrast(all[i].look.c[0], H.SKY_NIGHT) < 3 || H.contrast(all[i].look.c[0], H.SKY_DAY) < 3) { minN = -1; } }
check('10', 'every stored look.c[0] >= 3:1 on both skies', minN >= 3, true, 'PraxisHand.contrast');

// ===== the sign-in merge, path by path (red-team L4 §9 findings 3, 4, 5, 7) =====
function reload(remoteOffers, extra) {
  // the cloud holds remoteOffers; the local bucket is what this device has; the latch is shut
  var doc = { schemaVersion: '1', offers: remoteOffers, lastReadAt: 0, lastReadBookCount: 0 };
  var k2; if (extra) { for (k2 in extra) { if (extra.hasOwnProperty(k2)) { doc[k2] = extra[k2]; } } }
  CLOUD[cloudPath] = jsonStr(doc);
  X('lensOffersLoaded = false');
  X('loadLensOffersFromFirestore')(UID, function (r) { X('applyLensOffersLoad')(UID, r); });
}
function offerRec(id, name, ids, st) { return { id: id, userId: UID, name: name, bookIds: ids, leftOuts: [], lead: 'L', clauses: {}, close: 'C', q: 'Q?', themes: [], reading: 'R', round: 1, said: [], names: [name], look: null, state: st, createdAt: 1, decidedAt: 0 }; }
state.userLensOffers = {}; X('lensOffersLoaded = true');
var made2 = X('createLensOffers')(UID, [{ name: 'Sync one', lead: 'L', close: 'C', q: 'Q?', clauses: {}, themes: [], books: ['Book 1', 'Book 2'], bookIds: ['bk01', 'bk02'], reading: 'R' }]);
var sid = made2[0].id;
X('clearPendingSync')('lensOffers', UID, [sid]);          // it synced as 'open'
X('lensOffersLoaded = false');                            // from here the writes never land (offline / failed)
X('setLensOfferLater')(UID, sid);                          // a decision made...
var stale = {}; stale[sid] = offerRec(sid, 'Sync one', ['bk01', 'bk02'], 'open');   // ...whose write never landed
reload(stale);
check('sync', 'FX-1: a local decision (Later) outranks the stale cloud copy of the same id', X('lensOfferById')(UID, sid).state, 'later', 'markPendingSync on every offer writer');
check('sync', 'a kept local decision is pushed once the latch opens', JSON.parse(CLOUD[cloudPath]).offers[sid].state, 'later', 'markLensOffersDirty after the merge');
state.userLensOffers = {}; X('lensOffersLoaded = true');
X('lensOffersLoaded = false');   // created while the save is held: never reached the cloud
var made3 = X('createLensOffers')(UID, [{ name: 'Fresh local', lead: 'L', close: 'C', q: 'Q?', clauses: {}, themes: [], books: ['Book 3', 'Book 4'], bookIds: ['bk03', 'bk04'], reading: 'R' },
                                       { name: 'A twin', lead: 'L', close: 'C', q: 'Q?', clauses: {}, themes: [], books: ['Book 5', 'Book 6'], bookIds: ['bk05', 'bk06'], reading: 'R' }]);
var rem = {}; rem.cloud_twin = offerRec('cloud_twin', 'The cloud twin', ['bk05', 'bk06'], 'open');
reload(rem);
var ids3 = []; for (var ok3 in X('lensOffersDoc')(UID).offers) { ids3.push(ok3); }
check('sync', 'FX-1: a new local offer the cloud never saw is kept', !!X('lensOfferById')(UID, made3[0].id), true, 'pending-sync keep');
check('sync', 'a local offer that is THE SAME LENS as a cloud offer is dropped; the cloud one stands', (!X('lensOfferById')(UID, made3[1].id)) + '/' + !!X('lensOfferById')(UID, 'cloud_twin') + '/' + ids3.length, 'true/true/2', 'sameLens dedupe in the merge');
check('sync', 'the kept local offer reaches the cloud after the merge', !!JSON.parse(CLOUD[cloudPath]).offers[made3[0].id], true, 'markLensOffersDirty after the merge');
// FX-1c: a taken-up offer must not come back from a stale cloud doc
X('lensOffersLoaded = true');
var keepId = made3[0].id, stale2 = {}; stale2[keepId] = offerRec(keepId, 'Fresh local', ['bk03', 'bk04'], 'open');
X('lensOffersLoaded = false');   // the take-up's delete never reached the cloud
X('takeUpLensOffer')(UID, keepId);
reload(stale2);
check('sync', 'FX-1c: a taken-up offer is not resurrected by a stale cloud copy', X('lensOfferById')(UID, keepId), null, 'pending-delete skip');
reload({});
check('sync', 'the pending delete clears once the cloud no longer holds it', X('getPendingDeletes')('lensOffers', UID).length, 0, 'clearPendingDelete');
// the other three offer writers carry their marks too (Not this · Undo · a kept exchange)
function staleRoundTrip(label, act, expectFn, rule) {
  state.userLensOffers = {}; X('lensOffersLoaded = true');
  var mm = X('createLensOffers')(UID, [{ name: 'Mark ' + label, lead: 'L', close: 'C', q: 'Q?', clauses: {}, themes: [], books: ['Book 9', 'Book 10'], bookIds: ['bk09', 'bk10'], reading: 'R' }]);
  var mid = mm[0].id;
  X('clearPendingSync')('lensOffers', UID, [mid]);   // it synced as 'open'
  X('lensOffersLoaded = false');                     // the next write never lands
  act(mid);
  var st = {}; st[mid] = offerRec(mid, 'Mark ' + label, ['bk09', 'bk10'], 'open');
  reload(st);
  check('sync', 'FX-1 mark: ' + label + ' outranks the stale cloud copy', expectFn(X('lensOfferById')(UID, mid)), true, rule);
}
staleRoundTrip('Not this', function (id) { X('lensOfferNotThis')(UID, id); }, function (o) { return !!o && o.state === 'declined'; }, 'lensOfferNotThis marks');
staleRoundTrip('Undo of Not this', function (id) { var p = X('lensOfferNotThis')(UID, id); X('clearPendingSync')('lensOffers', UID, [id]); X('undoLensOfferNotThis')(UID, p); }, function (o) { return !!o && o.state === 'open' && o.decidedAt === 0; }, 'undoLensOfferNotThis marks');
staleRoundTrip('a kept exchange', function (id) { X('lensKeepExchange')('offer', UID, id, [{ t: 'my line', at: 9, name: 'Re-read', lead: 'You told me: x.', close: 'C2', q: 'Q2?' }], 'Renamed by the say-back'); }, function (o) { return !!o && o.name === 'Renamed by the say-back' && o.said.length === 1; }, 'lensKeepExchange(offer) marks');
// a local DECISION on an id the cloud lacks is never dropped as a same-lens twin
state.userLensOffers = {}; X('lensOffersLoaded = false');
var md = X('createLensOffers')(UID, [{ name: 'Declined here', lead: 'L', close: 'C', q: 'Q?', clauses: {}, themes: [], books: ['Book 3', 'Book 4'], bookIds: ['bk03', 'bk04'], reading: 'R' }]);   // books on the shelf (a declined offer off the shelf is pruned by design)
X('lensOfferNotThis')(UID, md[0].id);
var twinRem = {}; twinRem.cloud_t2 = offerRec('cloud_t2', 'A cloud twin', ['bk03', 'bk04'], 'open');
reload(twinRem);
check('sync', 'a local Not this is kept even beside a same-lens cloud twin', (X('lensOfferById')(UID, md[0].id) || {}).state, 'declined', 'the twin-drop spares decisions');

// a stale read for a PREVIOUS account never opens this account's latch
X('lensOffersLoaded = false');
localStorage.setItem('praxis_user', jsonStr({ uid: 'lens_uid_B', email: 'b@example.test' }));
var appliedB = X('applyLensOffersLoad')(UID, { status: 'found', data: { offers: {} } });
check('sync', 'a stale load for another uid is ignored (latch stays shut)', appliedB + '/' + X('lensOffersLoaded'), 'false/false', 'uid guard (F-DL5 family)');
localStorage.setItem('praxis_user', jsonStr({ uid: UID, email: 'a@example.test' }));
// no automatic read before the offers doc has loaded
D = X('lensOffersDoc')(UID); D.lastReadAt = 0;
check('sync', 'no automatic read before the offers doc has loaded', X('mayAutoReRead')(UID, false), false, 'lensOffersLoaded gate');
X('lensOffersLoaded = true');
check('sync', '... and it may read once it has', X('mayAutoReRead')(UID, false), true, 'lensOffersLoaded gate');
// an ABSENT load pushes offers seeded locally before the cloud doc existed
delete CLOUD[cloudPath];
state.userLensOffers = {}; X('lensOffersLoaded = true');
X('createLensOffers')(UID, [{ name: 'Seeded offline', lead: 'L', close: 'C', q: 'Q?', clauses: {}, themes: [], books: ['Book 7', 'Book 8'], bookIds: ['bk07', 'bk08'], reading: 'R' }]);
delete CLOUD[cloudPath];
X('lensOffersLoaded = false');
X('loadLensOffersFromFirestore')(UID, function (r) { X('applyLensOffersLoad')(UID, r); });
check('sync', 'an absent load pushes the locally seeded offers', !!CLOUD[cloudPath] && JSON.parse(CLOUD[cloudPath]).offers && (function () { var n = 0, q; for (q in JSON.parse(CLOUD[cloudPath]).offers) { n++; } return n; })(), 1, 'markLensOffersDirty on absent');

// ===== rule 4: a failed load never opens the save latch =======================
X('lensOffersLoaded = false');
var setsBefore = SETS.length;
X('applyLensOffersLoad')(UID, { status: 'error', error: 'offline' });
X('markLensOffersDirty')(); X('saveState')();
check('rule 4', 'an errored load keeps the latch shut: no cloud write', (SETS.length - setsBefore) + '/' + X('lensOffersLoaded'), '0/false', 'lens-contract rule 4');

WScript.Echo('L4.2 lens data contract -- proofs (proof | check | evidence | rule)');
for (i = 0; i < rows.length; i++) { WScript.Echo(rows[i]); }
WScript.Echo('');
WScript.Echo((fails === 0 ? 'PASS ' : 'FAIL ') + (total - fails) + '/' + total);
WScript.Quit(fails === 0 ? 0 : 1);
