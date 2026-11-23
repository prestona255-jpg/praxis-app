// FB-1a rig port -- the driver. A line-for-line port of fb1a_rig.py's Cloud, Device, Rig, check() and
// scenarios() (S0..S24, in the file's own order) to a page that holds the shared cloud and drives one
// iframe per "device" (each on its own localhost port, so each has its own localStorage). The fake Firebase
// (fake-firebase.js), the page helpers (helpers.js) and the toast observer (helpers-guard.js) are lifted
// byte for byte from fb1a_rig.py; bridge.js stands in for Playwright's expose_function / evaluate / pageerror.
// Rig code, not app code: the app's ES3 rule does not bind it. Run by run-fb1a.ps1; the log goes to the server.
'use strict';

const LABEL = new URLSearchParams(location.search).get('label') || 'tree';
const PORTS = { phone: 8801, laptop: 8802, newphone: 8803, tablet: 8804, spare: 8805, guestphone: 8806 };
const USER_COLS = ['userBooks', 'userArcs', 'userSubTheories', 'userThemes', 'userArtifacts', 'userNotebook', 'userLensOffers', 'userProfiles', 'userReaderModel'];
let HELPERS = '';
const OUT = [];
function print(s) { OUT.push(s); document.getElementById('log').textContent += s + '\n'; }
async function flush() {
  if (!OUT.length) { return; }
  const txt = OUT.splice(0).join('\n') + '\n';
  try { await fetch('/__rig/log', { method: 'POST', body: txt }); } catch (e) {}
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const J = (v) => JSON.stringify(v);

// Python-equality: deep, dict key order ignored, None == null == undefined.
function canon(v) {
  if (v === undefined || v === null) { return 'null'; }
  if (Array.isArray(v)) { return '[' + v.map(canon).join(',') + ']'; }
  if (typeof v === 'object') { return '{' + Object.keys(v).sort().map((k) => J(k) + ':' + canon(v[k])).join(',') + '}'; }
  return J(v);
}
function get(o, k) { return (o && Object.prototype.hasOwnProperty.call(o, k) && o[k] !== undefined) ? o[k] : null; }
const sorted = (a) => a.slice().sort();
function allTrue(keys) { const o = {}; keys.forEach((k) => { o[k] = true; }); return o; }

class Cloud {
  constructor() { this.docs = {}; this.log = []; this.offline = new Set(); this.fail_reads = {}; this.slow = {}; }
  handle(dev, op, path, body) {
    const col = path.split('/')[0];
    if (op === 'get') {
      if (this.offline.has(dev) || (this.fail_reads[dev] && this.fail_reads[dev].has(col))) {
        this.log.push([dev, 'get-fail', path]);
        return J({ error: 'Failed to get document because the client is offline.', delay: USER_COLS.includes(col) ? (this.slow[dev] || 0) : 0 });
      }
      this.log.push([dev, 'get', path]);
      if (col === 'betaAllowlist') { return J({ exists: true, data: { seed: false } }); }
      const d = Object.prototype.hasOwnProperty.call(this.docs, path) ? this.docs[path] : null;
      return J({ exists: d !== null, data: d });
    }
    if (this.offline.has(dev)) { return J({ offline: true }); }
    const b = JSON.parse(body);
    if (op === 'delete') { delete this.docs[path]; this.log.push([dev, 'delete', path]); return '{}'; }
    const data = JSON.parse(b.json);
    const cur = this.docs[path];
    if (b.merge && cur && typeof cur === 'object' && !Array.isArray(cur) && data && typeof data === 'object' && !Array.isArray(data)) {
      this.docs[path] = Object.assign({}, cur, data);
    } else { this.docs[path] = data; }
    this.log.push([dev, 'set', path]); return '{}';
  }
  books(uid) { const d = this.docs['userBooks/' + uid] || {}; return sorted(d.bookIds || []); }
  book(uid, bid) { return get(((this.docs['userBooks/' + uid] || {}).books) || {}, bid); }
  notes(uid) { const d = this.docs['userNotebook/' + uid] || {}, o = {}, m = d.notebookEntries || {}; Object.keys(m).forEach((k) => { o[k] = get(m[k], 'body'); }); return o; }
  arcs(uid) { const d = this.docs['userArcs/' + uid] || {}, o = {}, m = d.arcs || {}; Object.keys(m).forEach((k) => { o[k] = get(m[k], 'title'); }); return o; }
  sub(uid, sid) { const d = this.docs['userSubTheories/' + uid] || {}; return get(d.subTheories || {}, sid) || {}; }
  arts(uid) { const d = this.docs['userArtifacts/' + uid] || {}; return d.bookArtifacts || {}; }
  lens_names(uid) { const d = this.docs['userThemes/' + uid] || {}, m = d.userThemes || d.themes || {}, o = {}; Object.keys(m).forEach((k) => { o[k] = get(m[k], 'name'); }); return o; }
  user_docs(uid) { return sorted(Object.keys(this.docs).filter((k) => USER_COLS.includes(k.split('/')[0]) && k.endsWith('/' + uid))); }
  sets(dev, col) { return this.log.filter((e) => e[0] === dev && e[1] === 'set' && (!col || e[2].startsWith(col + '/'))); }
}

const WHERE = ['start'];
const TRACE = [];
const results = [];
let evSeq = 0;
const evWaiting = {};
const byPort = {};

class Device {
  constructor(rig, name) { this.rig = rig; this.name = name; this.port = PORTS[name]; this.frame = null; this.errors = []; byPort[this.port] = this; }
  async open(wait = 1200) {
    this.close();
    const f = document.createElement('iframe');
    this.frame = f;
    const loaded = new Promise((r) => f.addEventListener('load', r, { once: true }));
    f.src = 'http://localhost:' + this.port + '/index.html';
    document.body.appendChild(f);
    await loaded;
    await this.waitFor("typeof captureNote === 'function' && typeof state === 'object'", 30000);
    await this.ev(HELPERS);
    await sleep(wait);
    return this;
  }
  close() { if (this.frame) { this.frame.remove(); this.frame = null; } }
  async sign_in(uid, wait = 1200) { await this.ev('__rigSignIn(' + J(uid) + ')'); await sleep(wait); return this; }
  ev(js) {
    if (!this.frame || !this.frame.contentWindow) { return Promise.reject(new Error('device ' + this.name + ' is not open')); }
    evSeq = evSeq + 1;
    const id = evSeq, win = this.frame.contentWindow;
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => { delete evWaiting[id]; reject(new Error('evaluate timed out after 60 s: ' + js.slice(0, 80))); }, 60000);
      evWaiting[id] = { resolve, reject, t };
      win.postMessage({ rig: 'ev', id: id, js: js }, '*');
    });
  }
  async waitFor(js, timeout = 30000) {
    const end = Date.now() + timeout;
    for (;;) {
      let ok = false;
      try { ok = await this.ev('!!(' + js + ')'); } catch (e) { ok = false; }
      if (ok) { return; }
      if (Date.now() > end) { throw new Error('Timeout ' + timeout + 'ms exceeded waiting for: ' + js); }
      await sleep(100);
    }
  }
  wait(ms = 700) { return sleep(ms); }
}

window.addEventListener('message', (ev) => {
  const m = ev.data;
  if (!m || typeof m !== 'object') { return; }
  const port = +new URL(ev.origin).port;
  const dev = byPort[port];
  if (!dev) { return; }
  if (m.rig === 'call') {
    const text = rig.cloud.handle(dev.name, m.op, m.path, m.body);
    try { ev.source.postMessage({ rig: 'reply', id: m.id, text: text }, '*'); } catch (e) {}
  } else if (m.rig === 'evr') {
    const w = evWaiting[m.id];
    if (!w) { return; }
    delete evWaiting[m.id]; clearTimeout(w.t);
    if (m.ok) { w.resolve(JSON.parse(m.json)); } else { w.reject(new Error(m.err)); }
  } else if (m.rig === 'pageerror') {
    dev.errors.push(m.text);
    TRACE.push('[' + WHERE[0] + '] ' + dev.name + ': ' + m.text);
  }
});

class Rig {
  constructor() { this.cloud = new Cloud(); this.devs = []; }
  device(name) { const d = new Device(this, name); this.devs.push(d); return d; }
}
const rig = new Rig();

function check(name, got, want) {
  const ok = canon(got) === canon(want);
  results.push([name, ok, got, want]);
  print((ok ? '  PASS  ' : '  FAIL  ') + name + (ok ? '' : '\n        got  ' + canon(got) + '\n        want ' + canon(want)));
}
function fail_user_reads(r, dev, on = true, cols = null) {
  if (on) { r.cloud.fail_reads[dev] = new Set(cols || USER_COLS); } else { delete r.cloud.fail_reads[dev]; }
}
async function stage(name, title) { WHERE[0] = name; await flush(); print('\n[' + name + '] ' + title); }

async function scenarios() {
  const U = 'reader1';
  let toast_seen = [];
  print('== FB-1a behaviour rig on ' + LABEL + ' == (port of fb1a_rig.py: page + iframes + bridge.js, headless Chrome)');

  // ---------------------------------------------------------------- S0 control: the normal path
  await stage('S0', 'control: online, nothing failing');
  const P = await (await rig.device('phone').open()).sign_in(U);
  const b1 = await P.ev("T.addBook('Pedagogy of the Oppressed')"), b2 = await P.ev("T.addBook('All About Love')"), b3 = await P.ev("T.addBook('Beloved')");
  const n1 = await P.ev("T.note('first note, from the phone')"), a1 = await P.ev("T.arc('An arc from the phone')");
  await P.wait();
  check('S0 three books reach the cloud', rig.cloud.books(U), sorted([b1, b2, b3]));
  check('S0 the note reaches the cloud', rig.cloud.notes(U), { [n1]: 'first note, from the phone' });
  check('S0 every latch is open after a good load', await P.ev('T.latches()'), allTrue(['books', 'arcs', 'subTheories', 'themes', 'artifacts', 'notebook']));
  check('S0 no pending notebook ids once the save is confirmed', await P.ev("T.pending('notebook')"), []);
  P.close(); await P.open();
  check('S0 reopen: shelf and note still here', [sorted(await P.ev('T.bookIds()')), await P.ev('T.notes()')], [sorted([b1, b2, b3]), { [n1]: 'first note, from the phone' }]);
  check('S0 no notice on a clean load', await P.ev('window.__toasts.slice()'), []);
  if (await P.ev("typeof fb1aPrint === 'function'")) { check("S0 the patch prints a book by the same fields as the repo's mergeBookFingerprint", await P.ev('T.printsAgree()'), []); }

  // ---------------------------------------------------------------- S1 BR-01: a device that is behind
  await stage('S1', 'BR-01: the laptop is behind, its reads fail, the reader changes something, the signal returns');
  const L = await (await rig.device('laptop').open()).sign_in(U);
  check('S1 laptop starts with the 3 books', sorted(await L.ev('T.bookIds()')), sorted([b1, b2, b3]));
  L.close();
  const b4 = await P.ev("T.addBook('Sister Outsider')"), b5 = await P.ev("T.addBook('Freedom Dreams')"), b6 = await P.ev("T.addBook('Cruel Optimism')"), b7 = await P.ev("T.addBook('Black Marxism')");
  const n2 = await P.ev("T.note('second note, from the phone')"); await P.ev('T.editNote(' + J(n1) + ", 'first note, REWRITTEN on the phone')");
  const a2 = await P.ev("T.arc('A second arc from the phone')");
  await P.wait();
  check('S1 phone week: cloud holds 7 books, 2 notes, 2 arcs', [rig.cloud.books(U).length, Object.keys(rig.cloud.notes(U)).length, Object.keys(rig.cloud.arcs(U)).length], [7, 2, 2]);
  fail_user_reads(rig, 'laptop');
  let mark = rig.cloud.log.length;
  await L.open();
  check('S1 laptop opens on its old copy (3 books)', sorted(await L.ev('T.bookIds()')), sorted([b1, b2, b3]));
  await L.ev('T.editBook(' + J(b1) + ", 'read')"); const b8 = await L.ev("T.addBook('The Fire Next Time')");
  const n3 = await L.ev("T.note('third note, from the laptop while the read was failing')");
  await L.ev('T.editArc(' + J(a1) + ", 'An arc RENAMED on the laptop')");
  await L.wait();
  const writes_while_failing = rig.cloud.log.slice(mark).filter((e) => e[0] === 'laptop' && e[1] === 'set' && ['userBooks', 'userNotebook', 'userArcs'].includes(e[2].split('/')[0])).map((e) => e[2]);
  check('S1 NO shelf, notebook or arc write leaves the laptop while its reads fail', writes_while_failing, []);
  check('S1 cloud shelf still whole while the laptop waits (7 books)', rig.cloud.books(U).length, 7);
  let lat = await L.ev('T.latches()');
  check('S1 laptop latches shut while failing', [lat.books, lat.notebook, lat.arcs], [false, false, false]);
  fail_user_reads(rig, 'laptop', false); await L.ev('T.online()'); await L.wait(1500);
  check("S1 after the retry: cloud shelf = the phone's 7 + the laptop's 1", rig.cloud.books(U), sorted([b1, b2, b3, b4, b5, b6, b7, b8]));
  check("S1 the laptop's status edit reached the cloud", get(rig.cloud.book(U, b1) || {}, 'status'), 'read');
  check("S1 cloud notes = phone's 2 + laptop's 1, phone's rewrite intact", rig.cloud.notes(U), { [n1]: 'first note, REWRITTEN on the phone', [n2]: 'second note, from the phone', [n3]: 'third note, from the laptop while the read was failing' });
  check("S1 cloud arcs: laptop rename kept, phone's second arc kept", rig.cloud.arcs(U), { [a1]: 'An arc RENAMED on the laptop', [a2]: 'A second arc from the phone' });
  check('S1 laptop now shows all 8 books', sorted(await L.ev('T.bookIds()')), sorted([b1, b2, b3, b4, b5, b6, b7, b8]));
  check("S1 laptop took the phone's rewrite of the untouched note", get(await L.ev('T.notes()'), n1), 'first note, REWRITTEN on the phone');
  lat = await L.ev('T.latches()');
  check('S1 laptop latches open after the retry', [lat.books, lat.notebook, lat.arcs], [true, true, true]);

  // ---------------------------------------------------------------- S2 BR-01: a device with no copy
  await stage('S2', 'BR-01: a new device, the shelf read fails, the reader adds one book');
  const N = await rig.device('newphone').open();
  fail_user_reads(rig, 'newphone', true, ['userBooks']);
  await N.sign_in(U);
  check('S2 new device shows an empty shelf', await N.ev('T.bookIds()'), []);
  const b9 = await N.ev("T.addBook('Braiding Sweetgrass')"); await N.wait();
  check('S2 cloud shelf untouched after the add (8 books)', rig.cloud.books(U).length, 8);
  fail_user_reads(rig, 'newphone', false); await N.ev('T.online()'); await N.wait(1500);
  check('S2 after the retry: cloud shelf = 8 + the new one', rig.cloud.books(U), sorted([b1, b2, b3, b4, b5, b6, b7, b8, b9]));
  check('S2 the new device now shows all 9', (await N.ev('T.bookIds()')).length, 9);

  // ---------------------------------------------------------------- S3 BR-02: a note written offline, app closed
  await stage('S3', 'BR-02: a note written with no signal, the app closed before the signal returns');
  P.close(); await P.open();
  rig.cloud.offline.add('phone');
  const n4 = await P.ev("T.note('written on the train, no signal')"); await P.wait(400);
  check('S3 the offline note is on the phone', get(await P.ev('T.notes()'), n4), 'written on the train, no signal');
  check('S3 it is marked pending', (await P.ev("T.pending('notebook')")).includes(n4), true);
  P.close();
  rig.cloud.offline.delete('phone');
  check('S3 the cloud never saw it', n4 in rig.cloud.notes(U), false);
  await P.open();
  check('S3 reopened online: the note is STILL on the phone', get(await P.ev('T.notes()'), n4), 'written on the train, no signal');
  check('S3 and it has now been pushed to the cloud', get(rig.cloud.notes(U), n4), 'written on the train, no signal');
  check('S3 pending set cleared after the confirmed save', await P.ev("T.pending('notebook')"), []);
  check('S3 the other notes are all still there', Object.keys(await P.ev('T.notes()')).length, 4);

  // ---------------------------------------------------------------- S4 BR-02 delete symmetry
  await stage('S4', 'a note deleted with no signal, the app closed, a stale cloud copy at the next open');
  rig.cloud.offline.add('phone');
  await P.ev('T.delNote(' + J(n2) + ')'); await P.wait(300);
  P.close(); rig.cloud.offline.delete('phone');
  check('S4 the cloud still lists the deleted note', n2 in rig.cloud.notes(U), true);
  await P.open();
  check('S4 reopened: the deleted note does NOT come back', n2 in (await P.ev('T.notes()')), false);
  check('S4 and the delete has now reached the cloud', n2 in rig.cloud.notes(U), false);
  P.close(); await P.open();
  check('S4 one more open: the delete mark is cleared', await P.ev("T.pendingDel('notebook')"), []);

  // ---------------------------------------------------------------- S5 control: a delete on another device still lands
  await stage('S5', 'control: a note deleted on the laptop disappears from the phone at its next open');
  L.close(); await L.open();
  await L.ev('T.delNote(' + J(n3) + ')'); await L.wait();
  P.close(); await P.open();
  check('S5 the phone dropped the note the laptop deleted', n3 in (await P.ev('T.notes()')), false);

  // ---------------------------------------------------------------- S6 a brand-new account whose first reads fail
  await stage('S6', 'a new account, first reads fail, the reader writes, then the read answers "no document yet"');
  const U2 = 'reader2';
  const D = await rig.device('tablet').open(); fail_user_reads(rig, 'tablet'); await D.sign_in(U2);
  const c1 = await D.ev("T.addBook('Teaching to Transgress')"), m1 = await D.ev("T.note('my very first note')"); await D.wait();
  check('S6 nothing written while the reads fail', rig.cloud.sets('tablet', 'userBooks').concat(rig.cloud.sets('tablet', 'userNotebook')), []);
  fail_user_reads(rig, 'tablet', false); await D.ev('T.online()'); await D.wait(1500);
  check('S6 after the retry (absent): the book and the note are pushed', [rig.cloud.books(U2), rig.cloud.notes(U2)], [[c1], { [m1]: 'my very first note' }]);

  // ---------------------------------------------------------------- S7 the timer retries without any event
  await stage('S7', 'the retry timer: reads fail at open, recover a moment later, no "online" event');
  P.close(); fail_user_reads(rig, 'phone'); await P.open();
  check('S7 shut while failing', (await P.ev('T.latches()')).books, false);
  try { await P.waitFor('window.__toasts.length > 0', 4000); } catch (e) { /* untouched main never says it */ }
  await P.wait(900);
  toast_seen = await P.ev('window.__toasts.slice()');
  check('S7 the notice is said once, not six times', toast_seen.length, 1);
  fail_user_reads(rig, 'phone', false); await P.wait(6500);
  check('S7 the 5-second retry opened the latches', await P.ev('T.latches()'), allTrue(['books', 'arcs', 'subTheories', 'themes', 'artifacts', 'notebook']));

  // ---------------------------------------------------------------- S8
  await stage('S8', 'sign-out while a load is failing leaves nothing behind');
  P.close(); fail_user_reads(rig, 'phone'); await P.open();
  await P.ev('firebase.auth().signOut()'); await P.wait(600);
  fail_user_reads(rig, 'phone', false); mark = rig.cloud.log.length;
  await P.ev('T.online()'); await P.wait(1200);
  check('S8 no read or write after sign-out', rig.cloud.log.slice(mark).filter((e) => e[0] === 'phone' && USER_COLS.includes(e[2].split('/')[0])), []);
  await P.sign_in(U, 1500);
  check('S8 signing back in loads normally (latches open, 9 books)', [(await P.ev('T.latches()')).books, (await P.ev('T.bookIds()')).length], [true, 9]);

  // ---------------------------------------------------------------- S9
  await stage('S9', 'Delete account while the library cannot be read: refused before anything is touched');
  P.close(); fail_user_reads(rig, 'phone'); await P.open();
  const docs_before = rig.cloud.user_docs(U), r0 = await P.ev('__rig.reauths');
  let res = await P.ev('T.del()');
  check('S9 refused, through the existing "nothing was deleted" branch', [res.status, res.phase, res.recoverable], ['error', 'firestore', false]);
  check('S9 no sign-in window was opened and no document was touched', [(await P.ev('__rig.reauths')) - r0, rig.cloud.user_docs(U)], [0, docs_before]);
  fail_user_reads(rig, 'phone', false); await P.ev('T.online()'); await P.wait(1200);

  // ---------------------------------------------------------------- S10
  await stage('S10', 'arcs fail, sub-theories load; the arcs retry must not load sub-theories a second time');
  P.close(); fail_user_reads(rig, 'phone', true, ['userArcs']); await P.open();
  const g1 = await P.ev('__rig.gets.userSubTheories || 0');
  fail_user_reads(rig, 'phone', false); await P.ev('T.online()'); await P.wait(1200);
  check('S10 sub-theories read once per sign-in', [g1, await P.ev('__rig.gets.userSubTheories || 0')], [1, 1]);
  check('S10 arcs latch open after its retry', (await P.ev('T.latches()')).arcs, true);

  // ---------------------------------------------------------------- S11
  await stage('S11', 'the laptop is behind, its reads fail, the reader only LOOKS AROUND, the signal returns');
  L.close();
  await P.ev('T.editBook(' + J(b2) + ", 'read')"); const b10 = await P.ev("T.addBook('Race After Technology')");
  await P.ev('T.editNote(' + J(n4) + ", 'train note, REWRITTEN on the phone')"); await P.ev('T.editArc(' + J(a2) + ", 'Second arc RENAMED on the phone')"); await P.wait();
  fail_user_reads(rig, 'laptop'); mark = rig.cloud.log.length;
  await L.open();
  for (const h of ['#books', '#notebook', '#home', '#book/' + b2, '#lenses', '#profile', '#arcs', '#arc/' + a2, '#search', '#books']) { await L.ev('location.hash = ' + J(h)); await L.wait(350); }
  fail_user_reads(rig, 'laptop', false); await L.ev('T.online()'); await L.wait(1500);
  check('S11 the laptop wrote nothing to shelf, notebook or arcs', rig.cloud.log.slice(mark).filter((e) => e[0] === 'laptop' && e[1] === 'set' && ['userBooks', 'userNotebook', 'userArcs'].includes(e[2].split('/')[0])).map((e) => e[2]), []);
  check("S11 cloud still holds the phone's edits", [get(rig.cloud.book(U, b2) || {}, 'status'), get(rig.cloud.notes(U), n4), get(rig.cloud.arcs(U), a2), rig.cloud.books(U).includes(b10)], ['read', 'train note, REWRITTEN on the phone', 'Second arc RENAMED on the phone', true]);
  check("S11 the laptop now shows the phone's edits", [await L.ev('state.books[' + J(b2) + '].status'), get(await L.ev('T.notes()'), n4), get(await L.ev('T.arcs()'), a2), (await L.ev('T.bookIds()')).includes(b10)], ['read', 'train note, REWRITTEN on the phone', 'Second arc RENAMED on the phone', true]);

  // ---------------------------------------------------------------- S12
  await stage('S12', 'three retry triggers at once make one read per collection');
  L.close(); fail_user_reads(rig, 'laptop'); await L.open();
  await L.ev('T.online()'); await L.wait(500); await L.ev('T.online()'); await L.wait(500);
  check('S12 still shut after two failed retries', (await L.ev('T.latches()')).books, false);
  const g0 = await L.ev('__rig.gets.userBooks || 0');
  fail_user_reads(rig, 'laptop', false);
  await L.ev("T.online(); document.dispatchEvent(new Event('visibilitychange')); T.online();"); await L.wait(1200);
  check('S12 one retry read for the shelf, not three', (await L.ev('__rig.gets.userBooks || 0')) - g0, 1);
  check('S12 coming back to the front is a retry trigger too (latches open)', (await L.ev('T.latches()')).books, true);

  // ---------------------------------------------------------------- S13
  await stage('S13', 'known limit, unchanged by this build: an EDIT made while failing, app closed before recovery');
  L.close(); fail_user_reads(rig, 'laptop'); await L.open();
  await L.ev('T.editNote(' + J(n1) + ", 'edited on the laptop, then the lid closed')"); const n5 = await L.ev("T.note('a NEW note on the laptop, then the lid closed')"); await L.wait(300);
  L.close(); fail_user_reads(rig, 'laptop', false); await L.open();
  check('S13 the NEW note survives the close and is pushed', [get(await L.ev('T.notes()'), n5), get(rig.cloud.notes(U), n5)], ['a NEW note on the laptop, then the lid closed', 'a NEW note on the laptop, then the lid closed']);
  check('S13 the EDIT reverted to the cloud copy (BR-03, next build)', get(await L.ev('T.notes()'), n1), 'first note, REWRITTEN on the phone');

  // ---------------------------------------------------------------- S14
  await stage('S14', 'a sub-theory written while its read is failing');
  const st0 = await P.ev('(function(){ var s = createSubTheory(' + J(a1) + ", { header: 'A sub-theory from the phone' }); return s ? s.id : null; })()"); await P.wait();
  L.close(); await L.open(); L.close();
  fail_user_reads(rig, 'laptop'); await L.open();
  await L.ev('updateSubTheory(' + J(st0) + ", { header: 'RENAMED on the laptop while failing' })"); await L.wait(300);
  const subHdr = () => get(get(((rig.cloud.docs['userSubTheories/' + U] || {}).subTheories) || {}, st0) || {}, 'header');
  const st_cloud_mid = subHdr();
  fail_user_reads(rig, 'laptop', false); await L.ev('T.online()'); await L.wait(1500);
  check('S14 held while failing, pushed after the retry', [st_cloud_mid, subHdr()], ['A sub-theory from the phone', 'RENAMED on the laptop while failing']);

  // ---------------------------------------------------------------- S15
  await stage('S15', 'reads take 4 s to fail (as a real offline read does); the reader edits in those first seconds');
  L.close(); await L.open(); L.close();
  const b11 = await P.ev("T.addBook('The Undercommons')"); await P.wait();
  fail_user_reads(rig, 'laptop'); rig.cloud.slow.laptop = 4000; mark = rig.cloud.log.length;
  await L.open(300);
  check('S15 the reads have not answered yet', rig.cloud.log.slice(mark).filter((e) => e[0] === 'laptop' && e[1] === 'set' && ['userBooks', 'userNotebook', 'userArcs', 'userSubTheories'].includes(e[2].split('/')[0])), []);
  await L.ev('T.editBook(' + J(b3) + ", 'will-read')"); await L.ev('T.editNote(' + J(n1) + ", 'edited in the first seconds on the laptop')");
  await L.ev('T.editArc(' + J(a1) + ", 'renamed in the first seconds')"); await L.ev('updateSubTheory(' + J(st0) + ", { header: 'sub renamed in the first seconds' })");
  await L.wait(5200);
  lat = await L.ev('T.latches()');
  check('S15 latches shut once the reads fail', ['books', 'notebook', 'arcs', 'subTheories'].map((k) => lat[k]), [false, false, false, false]);
  delete rig.cloud.slow.laptop; fail_user_reads(rig, 'laptop', false); await L.ev('T.online()');
  await L.waitFor('subTheoriesLoaded === true && arcsLoaded === true && booksLoaded === true && notebookLoaded === true', 30000); await L.wait(1200);
  check('S15 the four first-seconds edits reached the cloud', [get(rig.cloud.book(U, b3) || {}, 'status'), get(rig.cloud.notes(U), n1), get(rig.cloud.arcs(U), a1), subHdr()],
    ['will-read', 'edited in the first seconds on the laptop', 'renamed in the first seconds', 'sub renamed in the first seconds']);
  check('S15 and the laptop still shows them', [await L.ev('state.books[' + J(b3) + '].status'), get(await L.ev('T.notes()'), n1), get(await L.ev('T.arcs()'), a1)],
    ['will-read', 'edited in the first seconds on the laptop', 'renamed in the first seconds']);
  check("S15 the phone's new book is still in the cloud, and on the laptop", [rig.cloud.books(U).includes(b11), (await L.ev('T.bookIds()')).includes(b11)], [true, true]);

  // ---------------------------------------------------------------- S16
  await stage('S16', 'Delete account on a loaded device: the failed-login recovery, then the real thing, with a retry trigger fired mid-way');
  D.close(); await D.open();
  check('S16 the throwaway account is loaded and has its documents', [(await D.ev('T.latches()')).books, rig.cloud.user_docs(U2).includes('userBooks/' + U2), rig.cloud.user_docs(U2).includes('userNotebook/' + U2)], [true, true, true]);
  await D.ev('__rig.authDeleteFails = true');
  res = await D.ev('T.del()');
  check('S16 login removal fails: reported as recoverable', [res.status, res.phase, res.recoverable], ['error', 'auth', true]);
  check('S16 and the data really was re-uploaded (the panel says so)', [rig.cloud.books(U2), rig.cloud.notes(U2)], [[c1], { [m1]: 'my very first note' }]);
  await D.ev('__rig.authDeleteFails = false; __rig.authDeleteMs = 1500');
  await D.ev('window.__del = T.del()'); await D.wait(600); await D.ev("T.online(); document.dispatchEvent(new Event('visibilitychange'));");
  res = await D.ev('window.__del');
  check('S16 the account is deleted', res.status, 'deleted');
  await D.wait(2500);
  check('S16 and nothing of it is written back afterwards', rig.cloud.user_docs(U2), []);

  // ---------------------------------------------------------------- S17
  await stage('S17', 'a device with a failing load: deletion refused; after the load succeeds it runs, and no retry re-creates a document');
  const U3 = 'reader3';
  const E = await (await rig.device('spare').open()).sign_in(U3);
  const e1 = await E.ev("T.note('a note on the spare device')"); await E.wait();
  E.close(); fail_user_reads(rig, 'spare'); await E.open();
  const e2 = await E.ev("T.note('written while the read was failing')"); await E.wait(300);
  res = await E.ev('T.del()');
  check('S17 refused while failing; the cloud copy is untouched', [res.status, res.phase, rig.cloud.notes(U3)], ['error', 'firestore', { [e1]: 'a note on the spare device' }]);
  await E.ev('__rig.authDeleteMs = 1500; window.__del = T.del()'); await E.wait(400);
  check('S17 still refused on a second ask', (await E.ev('window.__del')).phase, 'firestore');
  fail_user_reads(rig, 'spare', false); await E.ev('T.online()'); await E.wait(1500);
  check('S17 the load succeeded and the held note was pushed', get(rig.cloud.notes(U3), e2), 'written while the read was failing');
  await E.ev('window.__del = T.del()'); await E.wait(600); await E.ev("T.online(); document.dispatchEvent(new Event('visibilitychange'));");
  res = await E.ev('window.__del'); await E.wait(2500);
  check('S17 deleted, and nothing written back', [res.status, rig.cloud.user_docs(U3)], ['deleted', []]);

  // ---------------------------------------------------------------- S18
  await stage('S18', 'a second sign-in event for the SAME account, while a load is failing, with an edit already made');
  P.close(); fail_user_reads(rig, 'phone'); await P.open();
  await P.ev('T.editNote(' + J(n1) + ", 'edited before the second sign-in event')"); await P.wait(300);
  fail_user_reads(rig, 'phone', false);
  await P.ev('__rigSignIn(' + J(U) + ')'); await P.wait(1500);
  check('S18 the edit survived the new load and reached the cloud', [get(await P.ev('T.notes()'), n1), get(rig.cloud.notes(U), n1)], ['edited before the second sign-in event', 'edited before the second sign-in event']);
  check('S18 latches open', (await P.ev('T.latches()')).notebook, true);

  const LATCHES_OPEN = 'booksLoaded === true && arcsLoaded === true && subTheoriesLoaded === true && themesLoaded === true && artifactsLoaded === true && notebookLoaded === true';

  // ---------------------------------------------------------------- S19
  await stage('S19', 'a device that is behind, reads failing: the app stamps categories, a cover lookup lands, a lens gets its look');
  const lz = await P.ev("T.lens('A lens from the phone')"); await P.wait();
  L.close(); await L.open(); L.close();
  await P.ev('T.editBook(' + J(b4) + ", 'read')"); await P.ev('T.editBook(' + J(b5) + ", 'read')");
  await P.ev('state.userThemes[' + J(lz) + "].name = 'RENAMED on the phone'; state.userThemes[" + J(lz) + '].updatedAt = Date.now(); markThemesDirty(); saveState();'); await P.wait();
  fail_user_reads(rig, 'laptop'); await L.open();
  const stamped = await L.ev('T.stampUncategorized()'); await L.ev('T.coverBackfill(' + J(b5) + ')');
  const looked = await L.ev('(function(){ var t = state.userThemes[' + J(lz) + "], lk = lensMakeLook(t.name + ' again', lensSkyLooks(T.uid())); if (!lk) { return false; } t.look = lk; markThemesDirty(); saveState(); return true; })()");
  check("S19 the lens was given a look by the app's own maker", looked, true);
  await L.ev('T.editBook(' + J(b6) + ", 'will-read')"); await L.wait(300);
  check('S19 the stamp touched several books', stamped >= 4, true);
  fail_user_reads(rig, 'laptop', false); await L.ev('T.online()'); await L.waitFor(LATCHES_OPEN, 30000); await L.wait(1200);
  check("S19 the phone's status changes survive in the cloud", [get(rig.cloud.book(U, b4) || {}, 'status'), get(rig.cloud.book(U, b5) || {}, 'status')], ['read', 'read']);
  check('S19 and reach the laptop', [await L.ev('state.books[' + J(b4) + '].status'), await L.ev('state.books[' + J(b5) + '].status')], ['read', 'read']);
  check("S19 the phone's lens rename survives in the cloud and reaches the laptop", [get(rig.cloud.lens_names(U), lz), get(await L.ev('T.lenses()'), lz)], ['RENAMED on the phone', 'RENAMED on the phone']);
  check("S19 the laptop reader's own edit still wins", get(rig.cloud.book(U, b6) || {}, 'status'), 'will-read');
  check('S19 prints still agree with mergeBookFingerprint', await L.ev('T.printsAgree()'), []);

  // ---------------------------------------------------------------- S20
  await stage('S20', 'the sign-in event comes 3 s after start-up; the reader edits before it; the reads then fail');
  await L.ev("localStorage.setItem('rig_auth_delay', '3000')"); L.close();
  fail_user_reads(rig, 'laptop'); await L.open(300);
  check('S20 the app is up as the cached reader before the sign-in event', [await L.ev('T.uid()'), (await L.ev('T.latches()')).notebook], [U, false]);
  await L.ev('T.editNote(' + J(n1) + ", 'edited before the sign-in event')"); await L.ev('T.editBook(' + J(b4) + ", 'reading')");
  await L.wait(3800);
  fail_user_reads(rig, 'laptop', false); await L.ev('T.online()'); await L.waitFor(LATCHES_OPEN, 30000); await L.wait(1200);
  check('S20 both edits reached the cloud', [get(rig.cloud.notes(U), n1), get(rig.cloud.book(U, b4) || {}, 'status')], ['edited before the sign-in event', 'reading']);
  await L.ev("localStorage.removeItem('rig_auth_delay')");

  // ---------------------------------------------------------------- S21
  await stage('S21', 'a new device reads the arcs but not the sub-theories, then the reader renames a live arc');
  P.close(); await P.open();
  await P.ev('state.subTheories[' + J(st0) + "].status = 'published'; markSubTheoriesDirty(); state.arcs[" + J(a1) + '].published = true; state.arcs[' + J(a1) + "].freshness = 'live'; markArcsDirty(); saveState();"); await P.wait(900);
  const pub = 'publishedArcs/' + a1;
  check('S21 the phone published the arc (a public copy exists)', pub in rig.cloud.docs, true);
  const G = await rig.device('guestphone').open(); fail_user_reads(rig, 'guestphone', true, ['userSubTheories']); await G.sign_in(U);
  check('S21 the new device has the arc and no sub-theories yet', [a1 in (await G.ev('T.arcs()')), (await G.ev('T.latches()')).arcs, (await G.ev('T.latches()')).subTheories], [true, true, false]);
  await G.ev('T.editArc(' + J(a1) + ", 'renamed on the new device')"); await G.wait(900);
  check('S21 the public copy was NOT deleted', pub in rig.cloud.docs, true);
  check('S21 and it still carries the old title (the refresh is owed, not made on half a library)', get(rig.cloud.docs[pub] || {}, 'title') !== 'renamed on the new device', true);
  fail_user_reads(rig, 'guestphone', false); await G.ev('T.online()'); await G.waitFor(LATCHES_OPEN, 30000); await G.wait(900);
  check('S21 still there once everything has loaded; the arc is still marked published', [pub in rig.cloud.docs, await G.ev('state.arcs[' + J(a1) + '].published')], [true, true]);
  check('S21 the owed refresh was paid: the public copy now carries the new title', get(rig.cloud.docs[pub] || {}, 'title'), 'renamed on the new device');

  // ---------------------------------------------------------------- S24
  await stage('S24', 'a live arc renamed while every read is failing; the reads then succeed');
  L.close(); await L.open(); L.close();
  fail_user_reads(rig, 'laptop'); await L.open();
  await L.ev('T.editArc(' + J(a1) + ", 'renamed offline on the laptop')"); await L.wait(600);
  check('S24 nothing reached the public copy while the reads fail', get(rig.cloud.docs[pub] || {}, 'title'), 'renamed on the new device');
  fail_user_reads(rig, 'laptop', false); await L.ev('T.online()'); await L.waitFor(LATCHES_OPEN, 30000); await L.wait(1200);
  check('S24 the rename is in the cloud, the public copy carries it, and the arc is still published',
    [get(rig.cloud.arcs(U), a1), get(rig.cloud.docs[pub] || {}, 'title'), pub in rig.cloud.docs, await L.ev('state.arcs[' + J(a1) + '].published')], ['renamed offline on the laptop', 'renamed offline on the laptop', true, true]);

  // ---------------------------------------------------------------- S22
  await stage('S22', 'a sub-theory and an artifact edited while failing; the phone deleted the arc and the book meanwhile');
  const a3 = await P.ev("T.arc('An arc the phone will delete')"); const st3 = await P.ev('(function(){ var s = createSubTheory(' + J(a3) + ", { header: 'a sub-theory of that arc' }); return s ? s.id : null; })()");
  const bx = await P.ev("T.addBook('A book the phone will delete')"); const ax = await P.ev('T.artifact(' + J(bx) + ", 'an artifact of that book')"); await P.wait();
  L.close(); await L.open(); L.close();
  await P.ev('deleteArc(' + J(a3) + '); saveState();'); await P.ev('deleteBook(T.uid(), ' + J(bx) + ')'); await P.wait();
  const s3 = rig.cloud.sub(U, st3);
  check("S22 the phone's deletes reached the cloud: arc gone, its sub-theory re-homed (arcId null), book gone, artifact gone",
    [a3 in rig.cloud.arcs(U), Object.prototype.hasOwnProperty.call(s3, 'arcId') ? s3.arcId : 'MISSING', rig.cloud.book(U, bx) === null, ax in rig.cloud.arts(U)], [false, null, true, false]);
  fail_user_reads(rig, 'laptop'); await L.open();
  check('S22 the laptop still holds all four (it is behind)', [await L.ev('!!state.arcs[' + J(a3) + ']'), await L.ev('!!state.subTheories[' + J(st3) + ']'), await L.ev('!!state.books[' + J(bx) + ']'), await L.ev('!!state.bookArtifacts[' + J(ax) + ']')], [true, true, true, true]);
  await L.ev('updateSubTheory(' + J(st3) + ", { header: 'edited on the laptop while failing' })");
  await L.ev('state.bookArtifacts[' + J(ax) + "].body = 'edited on the laptop while failing'; state.bookArtifacts[" + J(ax) + '].updatedAt = Date.now(); markArtifactsDirty(); saveState();'); await L.wait(300);
  fail_user_reads(rig, 'laptop', false); await L.ev('T.online()'); await L.waitFor(LATCHES_OPEN, 30000); await L.wait(1200);
  check("S22 the phone's deletes hold on the laptop: the arc and the book are gone", [await L.ev('!!state.arcs[' + J(a3) + ']'), await L.ev('!!state.books[' + J(bx) + ']')], [false, false]);
  check("S22 the reader's two edits are kept, here and in the cloud",
    [await L.ev('state.subTheories[' + J(st3) + '].header'), get(rig.cloud.sub(U, st3), 'header'), await L.ev('state.bookArtifacts[' + J(ax) + '].body'), get(get(rig.cloud.arts(U), ax) || {}, 'body')], ['edited on the laptop while failing', 'edited on the laptop while failing', 'edited on the laptop while failing', 'edited on the laptop while failing']);
  print("        reading: the kept sub-theory's arcId is " + J(await L.ev('state.subTheories[' + J(st3) + '].arcId')) + ' (the deleted arc was ' + a3 + "); the kept artifact's bookId is " + J(await L.ev('state.bookArtifacts[' + J(ax) + '].bookId')));
  const before_errs = L.errors.length, seen = {}, shows = [];
  for (const h of ['#subtheory/' + st3, '#subtheory/' + st3 + '/build', '#artifact/' + bx, '#book/' + bx, '#arcs', '#home', '#search', '#profile', '#notebook', '#books']) {
    await L.ev('location.hash = ' + J(h)); await L.wait(500); seen[h] = await L.ev('(document.getElementById(APP_EL_ID) || document.body).textContent.length');
    if (await L.ev("(document.getElementById(APP_EL_ID) || document.body).textContent.indexOf('edited on the laptop while failing') !== -1")) { shows.push(h); }
  }
  check('S22 every room opens without a page error with those two records present', L.errors.slice(before_errs), []);
  print('        reading: the kept words are on screen in ' + shows.join(', '));
  check('S22 and each of those rooms drew something', Object.keys(seen).filter((h) => !seen[h]), []);
  await L.ev("location.hash = '#arcs'"); await L.wait(500);
  check('S22 the kept sub-theory is listed on the Arcs page, under Unrooted', await L.ev("(function(){ var el = document.querySelector('.arcs-unrooted'); return !!el && el.textContent.indexOf('edited on the laptop while failing') !== -1; })()"), true);

  // ---------------------------------------------------------------- S23
  await stage('S23', 'the laptop signs out and back in; reads take 4 s to fail; the reader edits in those seconds');
  await L.ev("location.hash = '#home'"); await L.wait(300); await L.ev('firebase.auth().signOut()'); await L.wait(700);
  fail_user_reads(rig, 'laptop'); rig.cloud.slow.laptop = 4000;
  await L.sign_in(U, 400);
  await L.ev('T.editNote(' + J(n1) + ", 'edited straight after signing back in')"); await L.ev('T.editBook(' + J(b6) + ", 'read')");
  await L.wait(5200);
  lat = await L.ev('T.latches()');
  check('S23 latches shut once the reads fail', [lat.books, lat.notebook], [false, false]);
  delete rig.cloud.slow.laptop; fail_user_reads(rig, 'laptop', false); await L.ev('T.online()'); await L.waitFor(LATCHES_OPEN, 40000); await L.wait(1200);
  check('S23 both edits reached the cloud', [get(rig.cloud.notes(U), n1), get(rig.cloud.book(U, b6) || {}, 'status')], ['edited straight after signing back in', 'read']);

  const errs = [].concat(...rig.devs.map((d) => d.errors));
  for (const t of TRACE) { print('        page error ' + t.replace(/\n/g, '\n            ')); }
  check('page errors across every device', errs, []);
  print('\nnotice shown on a failed load: ' + J(toast_seen));
  const npass = results.filter((r) => r[1]).length, nfail = results.length - npass;
  print('\n' + LABEL + ': ' + npass + ' / ' + results.length + ' passed, ' + nfail + ' failed');
  return nfail;
}

// ======================================================================================================
// THE EXECUTOR'S OWN COVERAGE (brief 2.4) -- NOT part of the chat's rig. ?mode=extra. Each drives what the
// chat's rig did not: the two composers and capture's Undo through the page's own controls, a lens and an
// artifact CREATED while failing, an account switch while a load fails, the 15 s and 45 s timer steps, and the
// real shelf sort and the real lens render writing by themselves (their network calls are blocked by the rig).
async function extras() {
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
  const npass = results.filter((r) => r[1]).length, nfail = results.length - npass;
  print('\n' + LABEL + ': ' + npass + ' / ' + results.length + ' passed, ' + nfail + ' failed');
}

async function main() {
  HELPERS = await (await fetch('/__rig/helpers.js')).text();
  try {
    if (new URLSearchParams(location.search).get('mode') === 'extra') { await extras(); } else { await scenarios(); }
  } catch (e) {
    print('\n  STOPPED in [' + WHERE[0] + ']: ' + String((e && e.message) || e).split('\n')[0].slice(0, 160));
    for (const t of TRACE) { print('        page error ' + t.replace(/\n/g, '\n            ')); }
    const npass = results.filter((r) => r[1]).length, nfail = results.length - npass;
    print('\n' + LABEL + ': ' + npass + ' / ' + results.length + ' passed, ' + nfail + ' failed, then STOPPED in [' + WHERE[0] + ']');
  }
  print('RIG-DONE');
  await flush();
}
main();
