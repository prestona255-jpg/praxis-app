// tools/lens-eval-test/run.js -- L4.1 proof harness for the lens eval v2
// (engine contract sec.3 / sec.9 proofs 8 and 11), over the REAL BYTES of
// js/yumi-brain.js, loaded whole under cscript JScript with shims (Node is
// blocked on the build box). No DOM, no network: aiProxyFetch is stubbed and
// every call is counted.
//
// Usage:  cscript //nologo //E:jscript tools/lens-eval-test/run.js
// Exit:   0 = every fixture and assertion passed - 1 = a failure - 2 = could not load
//
// 23 fixtures (Preston's ruling 4: the brief's 12 + the contract's second
// old-shape and second reader-claim), on a 20-title numbered library, each with
// its expected survivors and expected [L4-eval] log lines.

var fso = new ActiveXObject('Scripting.FileSystemObject');
var root = fso.GetParentFolderName(fso.GetParentFolderName(fso.GetParentFolderName(WScript.ScriptFullName)));
function readUtf8(p) { var s = new ActiveXObject('ADODB.Stream'); s.Type = 2; s.Charset = 'utf-8'; s.Open(); s.LoadFromFile(p); var t = s.ReadText(); s.Close(); return t; }
function neutralize(src) { return src.replace(/\.catch\b/g, '.catch_').replace(/\.finally\b/g, '.finally_').replace(/\.delete\b/g, '.delete_'); }

// ---- shims (cscript is ES3; the browser has these) ------------------------
if (typeof Array.prototype.indexOf !== 'function') { Array.prototype.indexOf = function (v) { var i; for (i = 0; i < this.length; i++) { if (this[i] === v) { return i; } } return -1; }; }
if (typeof Array.isArray !== 'function') { Array.isArray = function (a) { return Object.prototype.toString.call(a) === '[object Array]'; }; }
if (typeof String.prototype.trim !== 'function') { String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); }; }
function jsonStr(v) {
  var t = typeof v, i, out, k;
  if (v === null) { return 'null'; }
  if (t === 'number' || t === 'boolean') { return String(v); }
  if (t === 'string') { return '"' + v.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'; }
  if (Object.prototype.toString.call(v) === '[object Array]') { out = []; for (i = 0; i < v.length; i++) { out.push(jsonStr(v[i])); } return '[' + out.join(',') + ']'; }
  out = []; for (k in v) { if (v.hasOwnProperty(k)) { out.push(jsonStr(k) + ':' + jsonStr(v[k])); } } return '{' + out.join(',') + '}';
}
if (typeof JSON === 'undefined') { JSON = { parse: function (s) { return eval('(' + s + ')'); }, stringify: jsonStr }; }
// a synchronous thenable (cscript has no Promise)
function T(v, err) { this.v = v; this.e = !!err; }
T.prototype.then = function (ok, fail) {
  try {
    if (this.e) { return fail ? new T(fail(this.v)) : this; }
    return new T(ok ? ok(this.v) : this.v);
  } catch (x) { return new T(x, true); }
};
T.prototype.catch_ = function (f) { return this.then(null, f); };
var Promise = { resolve: function (v) { return new T(v); }, reject: function (e) { return new T(e, true); } };
var LOGS = [];
var console = { log: function (s) { LOGS.push(String(s)); }, warn: function () {}, error: function () {} };
var window = this;
var store = {};
var localStorage = { getItem: function (k) { return store.hasOwnProperty(k) ? store[k] : null; }, setItem: function (k, v) { store[k] = String(v); }, removeItem: function (k) { delete store[k]; } };
var document = { addEventListener: function () {}, getElementById: function () { return null; }, querySelector: function () { return null; }, createElement: function () { return { style: {}, setAttribute: function () {}, appendChild: function () {} }; } };
var navigator = { userAgent: 'cscript' };
var location = { hash: '', href: '' };
var setTimeout = function () { return 0; };
var fetch = function () { return new T(null); };
function ls(k, d) { return store.hasOwnProperty(k) ? JSON.parse(store[k]) : d; }
function sv(k, v) { store[k] = jsonStr(v); }
function getCurrentUser() { return { uid: 'u_test' }; }
function isYumiYesGranted() { return true; }
function getProfile() { return { values: [] }; }
function valueNamesFromArr(a) { return a; }
var state = { books: {}, userBooks: {}, userThemes: {} };

// ---- load the real file ---------------------------------------------------
var SRC;
try { SRC = readUtf8(fso.BuildPath(root, 'js\\yumi-brain.js')); } catch (e) { WScript.Echo('LOAD FAIL: js/yumi-brain.js'); WScript.Quit(2); }
try { eval(neutralize(SRC)); } catch (e2) { WScript.Echo('EVAL FAIL: ' + (e2.message || e2)); WScript.Quit(2); }
if (typeof evalLensResponse !== 'function' || typeof sameLens !== 'function') { WScript.Echo('LOAD FAIL: functions missing'); WScript.Quit(2); }

// the stubbed proxy: counts every call, returns the next queued reply text
var CALLS = 0, NEXT = '', LASTPAYLOAD = null;
aiProxyFetch = function (payload) { CALLS++; LASTPAYLOAD = payload; return new T({ content: [{ type: 'text', text: NEXT }], usage: { input_tokens: 1, output_tokens: 1 } }); };

// ---- the 20-title library -------------------------------------------------
var LIB = ['Pedagogy of the Oppressed', 'Teaching to Transgress', 'For White Folks Who Teach in the Hood',
  'Weapons of Math Destruction', 'Atlas of AI', 'Race After Technology', 'Automating Inequality',
  'Algorithms of Oppression', 'The Undercommons', 'Braiding Sweetgrass', 'The Fire Next Time', 'Beloved',
  'All About Love', 'Power, Crisis, and Education for Liberation', 'Deep Work', 'Rest', 'Laziness Does Not Exist',
  'Failure to Disrupt', 'The Age of Surveillance Capitalism', 'Cruel Optimism'];
var T2ID = {}, ii;
for (ii = 0; ii < LIB.length; ii++) { T2ID[normalizeLensTitle(LIB[ii])] = 'bk' + (ii < 9 ? '0' : '') + (ii + 1); }
function id(n) { return 'bk' + (n < 10 ? '0' : '') + n; }
var AGAINST = [
  { name: 'Books I teach from', bookIds: [id(18), id(19), id(20)], kind: 'kept' },
  { name: 'Cruel, everywhere', bookIds: [id(15), id(16), id(17)], kind: 'declined' }
];
var THEMES = [{ k: 'power', t: 'named, not implied' }, { k: 'refusal', t: 'of the ledger itself' }, { k: 'care', t: 'as a practice' }];
function clause(n) { return 'Book ' + n + ' sets its title against the others.'; }
function clean(name, nums, over) {
  var o = { name: name, lead: 'These books turn on one question about the classroom.', clauses: [], close: 'Read together they ask what the room is for.',
            q: 'Who decides what counts?', themes: THEMES, books: nums }, i, k;
  for (i = 0; i < nums.length; i++) { o.clauses.push({ i: nums[i], c: clause(nums[i]) }); }
  if (over) { for (k in over) { if (over.hasOwnProperty(k)) { o[k] = over[k]; } } }
  return o;
}
function readingOf(o, keepNums) {
  var parts = [], i;
  for (i = 0; i < keepNums.length; i++) { parts.push(clause(keepNums[i])); }
  return o.lead + (parts.length ? ' ' + parts.join(' ') : '') + ' ' + o.close;
}
var LDQ = String.fromCharCode(8220), RDQ = String.fromCharCode(8221), ELL = String.fromCharCode(8230), MDASH = String.fromCharCode(8212), RSQ = String.fromCharCode(8217);
var longQ = 'What would it take for a classroom to stop depositing and start asking what the deposit was for and who counts it at the end';

var F1 = clean('Who gets to deposit', [1, 2, 3]);
var F2 = clean('The machine as teacher', [4, 5, 6, 7]);
var F3 = clean('Maps against the pacing guide', [1, 2, 3, 4, 5, 6, 7, 8, 9]);
var F16 = clean('Six on one shelf', [1, 2, 3, 4, 5, 6]);
// L4 hotfix 2: the cut-off fixtures. HB carries braces INSIDE its strings, so a salvage that
// did not skip quoted strings would miscount depth and lose it.
var H1 = clean('The bank and the classroom', [1, 2]), H2 = clean('Machines that sort', [4, 5]), H3 = clean('Land as teacher', [10, 12]);
var HB = clean('Who holds the {key}', [1, 2], { lead: 'These books ask who holds the {key} and who is } locked out.' });
// L4 hotfix 3 (14 Nov 2026): every line EXACTLY at the told limits (lead 180, clause 100,
// close 130, q 100), then the same reply with one close at 161 (over the 160 cap).
function exactLen(seed, n, last) { var s = seed; while (s.length < n) { s = s + ' ' + seed; } return s.substring(0, n - 1) + (last || '.'); }
function atLimits(name, nums, closeLen) {
  var o = { name: name, lead: exactLen('These books set the ledger beside the classroom', 180), clauses: [],
            close: exactLen('Read together they ask what the room is for', closeLen || 130),
            q: exactLen('Who decides what a classroom is for', 100, '?'), themes: THEMES, books: nums }, i;
  for (i = 0; i < nums.length; i++) { o.clauses.push({ i: nums[i], c: exactLen('Book ' + nums[i] + ' sets its title against the others', 100) }); }
  return o;
}
var LIM1 = atLimits('Ledgers of the classroom', [6, 7]), LIM2 = atLimits('Sorting as a machine', [8, 9]);
var LIM1OVER = atLimits('Ledgers of the classroom', [6, 7], 161);
function atLimitsOk(o) { return o.lead.length === 180 && o.close.length === 130 && o.q.length === 100 && o.clauses[0].c.length === 100 && o.clauses[1].c.length === 100; }
var F10 = clean('Watching before the screen', [5, 6, 7], { clauses: [{ i: 5, c: clause(5) }, { i: 6, c: clause(6) }, { i: 19, c: clause(19) }] });
var F6 = { name: 'Who counts as knowing', lead: 'You told me: ' + LDQ + 'you never finish these.' + RDQ + ' Through that, the three ask who is allowed to count.',
           close: 'Read that way the bank is a court.', q: 'Who sits on the bench?', books: [1, 2, 3] };
var RE_TITLES = [LIB[0], LIB[1], LIB[2]];

var FIX = [
  { n: 1,  what: 'clean, 3 books',                    reply: jsonStr([F1]), keep: ['Who gets to deposit'], logs: [], check: function (o) { return o[0].reading === readingOf(F1, [1, 2, 3]) && o[0].clauses[LIB[2]] === clause(3) && o[0].bookIds.join() === 'bk01,bk02,bk03' && o[0].themes.length === 3; } },
  { n: 2,  what: 'clean, 4 books',                    reply: jsonStr([F2]), keep: ['The machine as teacher'], logs: [], check: function (o) { return o[0].books.length === 4 && o[0].clauses[LIB[6]] === clause(7) && o[0].reading === readingOf(F2, [4, 5, 6, 7]); } },
  { n: 3,  what: 'clean, 9 cited -> first 5 kept',    reply: jsonStr([F3]), keep: ['Maps against the pacing guide'], logs: [], check: function (o) { return o[0].books.length === 5 && !o[0].clauses.hasOwnProperty(LIB[5]) && o[0].reading === readingOf(F3, [1, 2, 3, 4, 5]); } },
  { n: 4,  what: 'reader-claim: the live phrase',     reply: jsonStr([clean('Selfhood', [10, 11, 12], { lead: 'Across these three you keep circling the same question.' })]), keep: [], logs: ['[L4-eval] voice: "you keep": Selfhood'] },
  { n: 5,  what: 'reader-claim: in a clause',         reply: jsonStr([clean('Love as a discipline', [12, 13], { clauses: [{ i: 12, c: 'You seem drawn to Morrison here.' }, { i: 13, c: clause(13) }] })]), keep: [], logs: ['[L4-eval] voice: "you seem": Love as a discipline'] },
  { n: 6,  what: 're-reading: "You told me:" exempt', reply: jsonStr(F6), reRead: true, keep: ['Who counts as knowing'], logs: [], check: function (o) { return o[0].books.length === 3 && o[0].reading === F6.lead + ' ' + F6.close; } },
  { n: 7,  what: 'declined twin by name',             reply: jsonStr([clean('cruel, EVERYWHERE', [10, 11, 12])]), keep: [], logs: ['[L4-eval] declined-twin: cruel, EVERYWHERE'] },
  { n: 8,  what: 'declined twin by two-thirds books', reply: jsonStr([clean('Hustle culture', [15, 16, 17])]), keep: [], logs: ['[L4-eval] declined-twin: Hustle culture'] },
  { n: 9,  what: 'under two books',                   reply: jsonStr([clean('One book only', [4])]), keep: [], logs: ['[L4-eval] under-2: One book only'] },
  { n: 10, what: 'clause for an uncited book',        reply: jsonStr([F10]), keep: ['Watching before the screen'], logs: [], check: function (o) { return o[0].books.join('|') === LIB[4] + '|' + LIB[5] && o[0].reading === readingOf(F10, [5, 6]); } },
  { n: 11, what: 'over-length q without "?"',         reply: jsonStr([clean('The long question', [8, 9], { q: longQ })]), keep: [], logs: ['[L4-eval] question: The long question'] },
  { n: 12, what: 'old shape {name, why, books}',      reply: '[{"name":"Selfhood and its makers","why":"Books about the self and who makes it.","books":[1,2]}]', keep: [], logs: ['[L4-eval] thin (old shape, no clauses): Selfhood and its makers'] },
  { n: 13, what: 'old shape, reader-claim in why',    reply: '[{"name":"Technologies of liberation","why":"You keep circling the machine.","books":[4,5,6]}]', keep: [], logs: ['[L4-eval] thin (old shape, no clauses): Technologies of liberation'] },
  { n: 14, what: 'unparseable reply',                 reply: 'Sorry ' + MDASH + ' I could not read the shelf this time.', keep: [], logs: ['[L4-eval] unparseable: (reply)'] },
  // L4 hotfix (R1, R2, 14 Nov 2026): extras are DROPPED, never the whole reply.
  { n: 15, what: 'four lenses -> first 2 kept (hf2 R1)',  reply: jsonStr([clean('The bank and the classroom', [1, 2]), clean('Machines that sort', [4, 5]), clean('Land as teacher', [10, 12]), clean('Rest as refusal', [13, 14])]),
    keep: ['The bank and the classroom', 'Machines that sort'], logs: ['[L4-eval] cap: Land as teacher', '[L4-eval] cap: Rest as refusal'] },
  { n: 16, what: 'six-book lens -> first 5 kept (R2)', reply: jsonStr([F16]), keep: ['Six on one shelf'], logs: [], check: function (o) { return o[0].books.length === 5 && !o[0].clauses.hasOwnProperty(LIB[5]) && o[0].reading === readingOf(F16, [1, 2, 3, 4, 5]); } },
  // L4 hotfix 2 (R3, 14 Nov 2026): a cut-off reply keeps every lens that arrived COMPLETE.
  { n: 17, what: 'two lenses, cut inside the 2nd -> 1 kept', reply: '[' + jsonStr(H1) + ',' + jsonStr(H2).substring(0, jsonStr(H2).indexOf('"close"') + 15), keep: ['The bank and the classroom'], logs: [] },
  { n: 18, what: 'cut inside the 1st -> unreadable',    reply: '[' + jsonStr(H1).substring(0, 90), keep: [], logs: ['[L4-eval] unparseable: (reply)'] },
  { n: 19, what: 'complete two-lens reply, unchanged',  reply: jsonStr([H1, H2]), keep: ['The bank and the classroom', 'Machines that sort'], logs: [] },
  { n: 20, what: 'three lenses -> first 2 + one cap',   reply: jsonStr([H1, H2, H3]), keep: ['The bank and the classroom', 'Machines that sort'], logs: ['[L4-eval] cap: Land as teacher'] },
  { n: 21, what: 'cut in a string holding a brace',     reply: '[' + jsonStr(HB) + ',{"name":"Machines that sort","lead":"A brace } then the cut', keep: ['Who holds the {key}'], logs: [] },
  // L4 hotfix 3: the told limits clear the eval; one char over the close CAP drops that lens only.
  { n: 22, what: 'two lenses at the told limits -> 2',  reply: jsonStr([LIM1, LIM2]), keep: ['Ledgers of the classroom', 'Sorting as a machine'], logs: [],
    check: function () { return atLimitsOk(LIM1) && atLimitsOk(LIM2) && LIM1OVER.close.length === 161; } },
  { n: 23, what: 'one close at 161 -> that lens dropped', reply: jsonStr([LIM1OVER, LIM2]), keep: ['Sorting as a machine'], logs: ['[L4-eval] length: close: Ledgers of the classroom'] }
];

// ---- run the fixtures -----------------------------------------------------
var pass = 0, fail = 0, rows = [], f, out, names, ok, why, k2;
function pad(s, n) { s = String(s); while (s.length < n) { s += ' '; } return s; }
for (ii = 0; ii < FIX.length; ii++) {
  f = FIX[ii]; LOGS = [];
  out = f.reRead
    ? evalLensResponse(f.reply, RE_TITLES, [], { reReading: true, titleToId: T2ID, against: [] })
    : evalLensResponse(f.reply, LIB, [], { titleToId: T2ID, against: AGAINST });
  names = []; for (k2 = 0; k2 < out.length; k2++) { names.push(out[k2].name); }
  var evalLogs = []; for (k2 = 0; k2 < LOGS.length; k2++) { if (LOGS[k2].indexOf('[L4-eval]') === 0) { evalLogs.push(LOGS[k2]); } }
  ok = (names.join('|') === f.keep.join('|')) && (evalLogs.join('|') === f.logs.join('|'));
  why = ok ? '' : ('got [' + names.join('|') + '] logs [' + evalLogs.join('|') + ']');
  if (ok && f.check && !f.check(out)) { ok = false; why = 'shape check failed: ' + jsonStr(out[0]); }
  if (ok) { pass++; } else { fail++; }
  rows.push(pad(f.n, 3) + pad(f.what, 38) + pad(f.keep.length ? 'survives' : 'dropped', 10) + (f.logs[0] || '(no drop log)') + '  ' + (ok ? 'PASS' : 'FAIL ' + why));
}

// ---- assertions -----------------------------------------------------------
var A = [];
function assert(name, cond, detail) { A.push((cond ? 'PASS ' : 'FAIL ') + name + ((!cond && detail) ? '\n     detail: ' + detail() : '')); if (cond) { pass++; } else { fail++; } }
// L4 hotfix (14 Nov 2026): the prompt must EQUAL the contract, character for
// character -- sec.1's quoted block (the "> " lines between **System prompt** and
// **User message**), blank ">" lines as paragraph breaks, the JSON line's
// backticks stripped. A length check alone cannot see a five->three swap.
var CONTRACT_PROMPT = (function () {
  var md = readUtf8(fso.BuildPath(root, 'docs\\studio\\l4-lens-engine-contract.md')).replace(/\r\n/g, '\n').split('\n'), i, on = false, out = [], ln;
  for (i = 0; i < md.length; i++) {
    if (md[i].indexOf('**System prompt**') === 0) { on = true; continue; }
    if (md[i].indexOf('**User message**') === 0) { break; }
    if (!on || md[i].charAt(0) !== '>') { continue; }
    ln = md[i].replace(/^> ?/, '');
    if (/^`.*`$/.test(ln)) { ln = ln.substring(1, ln.length - 1); }
    out.push(ln);
  }
  return out.join('\n');
})();
function firstDiff(a, b) { var i = 0; while (i < a.length && i < b.length && a.charAt(i) === b.charAt(i)) { i++; } return i; }
assert('LENS_GEN_SYSTEM === contract sec.1 quoted prompt, character for character (' + CONTRACT_PROMPT.length + ' chars)',
  CONTRACT_PROMPT.length > 2000 && LENS_GEN_SYSTEM === CONTRACT_PROMPT,
  function () { var d = firstDiff(LENS_GEN_SYSTEM, CONTRACT_PROMPT); return 'lengths ' + LENS_GEN_SYSTEM.length + ' / ' + CONTRACT_PROMPT.length + '; first diff at ' + d + ': code [' + LENS_GEN_SYSTEM.substr(d, 40) + '] contract [' + CONTRACT_PROMPT.substr(d, 40) + ']'; });
assert('LENS_GEN_SYSTEM is the contract text (2,639 chars, ban list quotes the live phrase)',
  LENS_GEN_SYSTEM.length === 2639 && LENS_GEN_SYSTEM.indexOf('never "you keep circling"') !== -1 && LENS_GEN_SYSTEM.indexOf('marked "You told me: ' + ELL + '"') !== -1,
  function () { return 'length ' + LENS_GEN_SYSTEM.length + ', ban-list at ' + LENS_GEN_SYSTEM.indexOf('never "you keep circling"') + ', exemption at ' + LENS_GEN_SYSTEM.indexOf('marked "You told me: ' + ELL + '"'); });
// metadata-only payload: build a real meta and look for every id
state.userBooks = { u_test: { bookIds: [] } }; state.books = {};
for (ii = 0; ii < LIB.length; ii++) {
  state.books[id(ii + 1)] = { id: id(ii + 1), title: LIB[ii], author: 'Author ' + (ii + 1), genre: 'g', category: (ii === 0 ? 'Education' : ''), categoryOverride: (ii === 1 ? 'Race & Identity' : '') };
  state.userBooks.u_test.bookIds.push(id(ii + 1));
}
var isValidCategoryLabel = function (s) { return s === 'Education' || s === 'Race & Identity'; };
var lensOfferNamesForPrompt = function () { return ['Hustle and its discontents', 'Cruel, everywhere']; };
state.userThemes = { th1: { id: 'th1', userId: 'u_test', name: 'Books I teach from', bookIds: [id(1)] } };
var META = gatherLensLibraryMetadata();
var MSG = buildLensGenUserMessage(META);
assert('payload carries no book id (titleToId never serialized)', !/bk[0-9][0-9]/.test(MSG) && !/th1/.test(MSG));
assert('payload numbers the shelf with [Category]; override wins; blank -> no bracket',
  MSG.indexOf('1. "Pedagogy of the Oppressed" by Author 1 [Education]') !== -1 &&
  MSG.indexOf('2. "Teaching to Transgress" by Author 2 [Race & Identity]') !== -1 &&
  MSG.indexOf('3. "For White Folks Who Teach in the Hood" by Author 3\n') !== -1);
assert('payload items in contract order: shelf, kept, offered (values empty -> left out)',
  MSG.indexOf('Lenses they keep: Books I teach from') > MSG.indexOf('20. "') &&
  MSG.indexOf('Lenses already offered ' + MDASH + ' do not offer these again: Hustle and its discontents, Cruel, everywhere') > MSG.indexOf('Lenses they keep:') &&
  MSG.indexOf('Values they have declared') === -1,
  function () { return 'tail: ' + MSG.substring(MSG.indexOf('20. "')).replace(/\n/g, ' / '); });
CALLS = 0; NEXT = jsonStr([F1]);
var got = null; generateLenses(META).then(function (t) { got = t; });
assert('one generation = one call; max_tokens 800; model sonnet-4-6', CALLS === 1 && got === NEXT && LASTPAYLOAD.max_tokens === 800 && LASTPAYLOAD.model === 'claude-sonnet-4-6');
// L4 hotfix 2 (R4, D-1): a reply cut at max_tokens resolves (it is not unreadable), logs
// "[L4-eval] truncated: kept N" once, and records stop / chars / cut / kept for ?lenstime=on.
var CUT17 = FIX[16].reply, STOPNEXT = 'max_tokens';
aiProxyFetch = function (payload) { CALLS++; LASTPAYLOAD = payload; return new T({ content: [{ type: 'text', text: NEXT }], usage: { input_tokens: 3310, output_tokens: 800 }, stop_reason: STOPNEXT }); };
CALLS = 0; NEXT = CUT17; LOGS = []; got = null; var cutRejected = false;
generateLenses(META).then(function (t) { got = t; }, function () { cutRejected = true; });
var LU = lensLastUsageVal, truncLogs = []; for (ii = 0; ii < LOGS.length; ii++) { if (LOGS[ii].indexOf('[L4-eval] truncated') === 0) { truncLogs.push(LOGS[ii]); } }
assert('a reply cut at max_tokens resolves, logs "truncated: kept 1" once, records stop/chars/cut/kept',
  !cutRejected && got === CUT17 && truncLogs.join('|') === '[L4-eval] truncated: kept 1' && LU && LU.stop === 'max_tokens' && LU.cut === true && LU.kept === 1 && LU.chars === CUT17.length && LU.output === 800,
  function () { return 'rejected ' + cutRejected + ', logs [' + truncLogs.join('|') + '], usage ' + jsonStr(LU); });
CALLS = 0; NEXT = jsonStr([H1, H2]); STOPNEXT = 'end_turn'; LOGS = []; generateLenses(META).then(function () {}, function () {});
truncLogs = []; for (ii = 0; ii < LOGS.length; ii++) { if (LOGS[ii].indexOf('[L4-eval] truncated') === 0) { truncLogs.push(LOGS[ii]); } }
assert('a complete reply (end_turn): no truncated log; cut false, kept 2', truncLogs.length === 0 && lensLastUsageVal.cut === false && lensLastUsageVal.kept === 2 && lensLastUsageVal.stop === 'end_turn');
STOPNEXT = undefined;
// (d) parseValueRetrofitArray is untouched: a cut-off array is still null there (the value
// retrofit keeps its honest ERROR state), while the lens parse now salvages.
assert('parseValueRetrofitArray unchanged: a cut-off array -> null; parseLensReply salvages 1',
  parseValueRetrofitArray(CUT17) === null && parseLensReply(CUT17, false) !== null && parseLensReply(CUT17, false).length === 1);
CALLS = 0; NEXT = 'Sorry, nothing readable.'; var rejected = false;
generateLenses(META).then(function () {}, function () { rejected = true; });
assert('an unreadable reply rejects into the error state (LENS-1), one call', CALLS === 1 && rejected);
CALLS = 0; NEXT = jsonStr(F6); var rr = null;
generateLensReReading(META, { name: 'Who gets to deposit', lead: F1.lead, close: F1.close, q: F1.q, bookIds: [id(1), id(2), id(3)] }, 'It' + RSQ + 's about who gets to decide what counts as knowledge.').then(function (r) { rr = r; });
var RMSG = LASTPAYLOAD.messages[0].content;
assert('re-reading: one call, the lens sub-list, the reader line, no id',
  CALLS === 1 && rr && rr.bookMeta.books.length === 3 && RMSG.indexOf('1. "Pedagogy of the Oppressed"') !== -1 &&
  RMSG.indexOf('The reader said: "It' + RSQ + 's about who gets to decide what counts as knowledge."') !== -1 && !/bk[0-9][0-9]/.test(RMSG));
assert('sameLens: name ignoring case; two-thirds of the larger; symmetric',
  sameLens({ name: 'A', bookIds: [] }, { name: ' a ', bookIds: [] }) &&
  sameLens({ name: 'x', bookIds: ['1', '2', '3'] }, { name: 'y', bookIds: ['1', '2', '3', '4'] }) &&
  !sameLens({ name: 'x', bookIds: ['1', '2', '3'] }, { name: 'y', bookIds: ['1', '2', '3', '4', '5'] }) &&
  !sameLens({ name: 'y', bookIds: ['1', '2', '3', '4', '5'] }, { name: 'x', bookIds: ['1', '2', '3'] }));

WScript.Echo('L4.1 lens eval v2 -- 23 fixtures on a 20-title library');
WScript.Echo(pad('#', 3) + pad('fixture', 38) + pad('expect', 10) + 'expected log  verdict');
for (ii = 0; ii < rows.length; ii++) { WScript.Echo(rows[ii]); }
WScript.Echo('');
for (ii = 0; ii < A.length; ii++) { WScript.Echo(A[ii]); }
var fixPass = 0; for (ii = 0; ii < rows.length; ii++) { if (/PASS$/.test(rows[ii])) { fixPass++; } }
WScript.Echo('');
WScript.Echo('FIXTURES ' + (fixPass === FIX.length ? 'PASS ' : 'FAIL ') + fixPass + '/' + FIX.length + ' - ASSERTIONS ' + (A.length - (fail - (FIX.length - fixPass))) + '/' + A.length);
WScript.Echo(fail === 0 ? 'PASS ' + pass + '/' + pass : 'FAIL (' + fail + ' failing)');
WScript.Quit(fail === 0 ? 0 : 1);
