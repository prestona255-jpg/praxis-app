"""FB-1a behaviour rig: the REAL app (index.html and every script, unmodified) in headless Chrome,
against a fake Firebase whose cloud lives in this Python process. Each "device" is a browser
context (its own localStorage); they share the cloud. Reads and writes can be made to fail.

Usage: python3 -I fb1a_rig.py <tree> <port> [label]
"""
import sys, json, threading, http.server, functools, copy, time
from playwright.sync_api import sync_playwright

ROOT, PORT = sys.argv[1], int(sys.argv[2])
LABEL = sys.argv[3] if len(sys.argv) > 3 else ROOT.rstrip('/').split('/')[-1]

FAKE = r"""
(function () {
  var RIG = window.__rig = { queue: [], pumping: false, gets: {}, sets: {}, reauths: 0, authDeleteFails: false, authDeleteMs: 0 };
  function call(op, path, body) { return window.rigCloud(op, path, body || '').then(function (r) { return JSON.parse(r); }); }
  function pump() {
    if (RIG.pumping) { return; }
    RIG.pumping = true;
    (function next() {
      if (!RIG.queue.length) { RIG.pumping = false; return; }
      var w = RIG.queue[0];
      call(w.op, w.path, JSON.stringify({ json: w.json, merge: w.merge })).then(function (r) {
        if (r.offline) { RIG.pumping = false; setTimeout(pump, 150); return; }   // stays queued in memory, like the SDK
        RIG.queue.shift();
        if (r.error) { w.reject(new Error(r.error)); } else { w.resolve(); }
        next();
      });
    })();
  }
  function snap(col, id, r) { return { exists: !!r.exists, id: id, ref: docRef(col, id), data: function () { return r.data; }, get: function (k) { return r.data ? r.data[k] : undefined; } }; }
  function docRef(col, id) {
    var path = col + '/' + id;
    function write(op, data, opts) {
      var json = JSON.stringify(data === undefined ? null : data);
      RIG.sets[col] = (RIG.sets[col] || 0) + 1;
      return new Promise(function (resolve, reject) {
        RIG.queue.push({ op: op, path: path, json: json, merge: !!(opts && opts.merge), resolve: resolve, reject: reject });
        pump();
      });
    }
    return {
      id: id, path: path,
      get: function () {
        RIG.gets[col] = (RIG.gets[col] || 0) + 1;
        return call('get', path).then(function (r) {
          if (!r.delay) { return r; }
          return new Promise(function (res) { setTimeout(function () { res(r); }, r.delay); });   // a slow answer
        }).then(function (r) {
          if (r.error) { var e = new Error(r.error); e.code = 'unavailable'; throw e; }
          return snap(col, id, r);
        });
      },
      set: function (data, opts) { return write('set', data, opts); },
      update: function (data) { return write('set', data, { merge: true }); },
      'delete': function () { return write('delete', null, null); },
      collection: function (c2) { return colRef(path + '/' + c2); }
    };
  }
  function emptyQuery() {
    var q = { where: function () { return q; }, orderBy: function () { return q; }, limit: function () { return q; },
      get: function () { return Promise.resolve({ empty: true, size: 0, docs: [], forEach: function () {} }); } };
    return q;
  }
  function colRef(col) {
    var q = emptyQuery();
    q.doc = function (id) { return docRef(col, id || ('auto' + Math.random().toString(36).slice(2))); };
    q.add = function (d) { var r = q.doc(); return r.set(d).then(function () { return r; }); };
    return q;
  }
  var db = { collection: colRef,
    batch: function () { var ops = []; var b = { set: function (r, d, o) { ops.push(r.set(d, o)); return b; }, update: function (r, d) { ops.push(r.update(d)); return b; }, 'delete': function (r) { ops.push(r['delete']()); return b; }, commit: function () { return Promise.all(ops); } }; return b; } };
  function mkUser(uid) {
    return { uid: uid, email: uid + '@rig.test', emailVerified: true, displayName: 'Rig ' + uid, photoURL: null,
      metadata: { creationTime: 'Mon, 01 Jan 2024 00:00:00 GMT', lastSignInTime: 'Mon, 01 Jan 2024 00:00:00 GMT' },
      getIdToken: function () { return Promise.resolve('rig-token'); },
      'delete': function () { return new Promise(function (res, rej) { setTimeout(function () {
          if (RIG.authDeleteFails) { rej(new Error('rig: the login could not be removed')); } else { res(); } }, RIG.authDeleteMs); }); },
      reauthenticateWithPopup: function () { RIG.reauths = RIG.reauths + 1; return Promise.resolve({ user: this }); } };
  }
  var listeners = [];
  var auth = { currentUser: null,
    onAuthStateChanged: function (cb) { listeners.push(cb); var late = 0; try { late = +(localStorage.getItem('rig_auth_delay') || 0); } catch (e) {}
      setTimeout(function () { cb(auth.currentUser); }, late); return function () {}; },
    signInWithPopup: function () { return Promise.reject(new Error('rig: no popup')); },
    signOut: function () { auth.currentUser = null; try { localStorage.removeItem('rig_auth'); } catch (e) {} fire(); return Promise.resolve(); } };
  function fire() { var i; for (i = 0; i < listeners.length; i++) { (function (cb) { setTimeout(function () { cb(auth.currentUser); }, 0); })(listeners[i]); } }
  var saved = null; try { saved = localStorage.getItem('rig_auth'); } catch (e) {}
  if (saved) { auth.currentUser = mkUser(saved); }
  window.__rigSignIn = function (uid) { localStorage.setItem('rig_auth', uid); auth.currentUser = mkUser(uid); fire(); };
  var fb = { initializeApp: function () { return {}; } };
  fb.auth = function () { return auth; };
  fb.auth.GoogleAuthProvider = function () {};
  fb.firestore = function () { return db; };
  fb.firestore.FieldValue = { serverTimestamp: function () { return { __ts: 1 }; }, increment: function (n) { return { __inc: n }; },
    arrayUnion: function () { return { __union: [].slice.call(arguments) }; }, arrayRemove: function () { return { __remove: [].slice.call(arguments) }; },
    'delete': function () { return { __del: 1 }; } };
  window.firebase = fb;
})();
"""

HELPERS = r"""
window.T = {
  uid: function () { var u = getCurrentUser(); return u ? u.uid : null; },
  bookIds: function () { var u = T.uid(); return (state.userBooks[u] && state.userBooks[u].bookIds) ? state.userBooks[u].bookIds.slice() : []; },
  // the Add-a-book write site (views.js, openShelfEditor's save), statement for statement
  addBook: function (title) {
    var user = getCurrentUser(), id = 'bk_' + title.replace(/[^a-z0-9]/gi, '_');
    state.books[id] = { id: id, title: title, author: 'A. Author', isbn: '', addedAt: Date.now(), status: 'reading', genre: '', coverUrl: null };
    ensureBookFields(state.books[id]);
    ensureUser(user.uid);
    state.userBooks[user.uid].bookIds.push(id);
    markBookPending(user.uid, id);
    markBooksDirty();
    saveState();
    return id;
  },
  // a status edit, as the book page's sites do it
  editBook: function (id, status) { state.books[id].status = status; markBooksDirty(); saveState(); },
  note: function (body) { captureNote('marginalia', body, 'inbox', [], true); return nbJustSavedId; },   // the real writer
  editNote: function (id, body) { return updateNotebookEntryBody(id, body); },                        // the real accessor
  delNote: function (id) { var ok = deleteEntry(id); saveState(); return ok; },                        // the real delete + its caller's save
  notes: function () { var u = T.uid(), out = {}, k; for (k in state.notebookEntries) { if (state.notebookEntries[k] && state.notebookEntries[k].userId === u) { out[k] = state.notebookEntries[k].body; } } return out; },
  arc: function (title) { var a = createArc(title, '', T.uid(), null); markArcsDirty(); saveState(); return a ? a.id : null; },
  editArc: function (id, title) { state.arcs[id].title = title; state.arcs[id].updatedAt = Date.now(); markArcsDirty(); saveState(); },
  arcs: function () { var u = T.uid(), out = {}, k; for (k in state.arcs) { if (state.arcs[k] && state.arcs[k].userId === u) { out[k] = state.arcs[k].title; } } return out; },
  latches: function () { return { books: booksLoaded, arcs: arcsLoaded, subTheories: subTheoriesLoaded, themes: themesLoaded, artifacts: artifactsLoaded, notebook: notebookLoaded }; },
  pending: function (kind) { return (typeof getPendingSync === 'function') ? getPendingSync(kind, T.uid()).slice() : []; },
  pendingDel: function (kind) { return (typeof getPendingDeletes === 'function') ? getPendingDeletes(kind, T.uid()).slice() : []; },
  toast: function () { var t = document.querySelector('.praxis-toast'); return t ? t.textContent : null; },
  online: function () { window.dispatchEvent(new Event('online')); },
  // does FB-1a's print of a book name exactly the fields the repo's own mergeBookFingerprint names?
  printsAgree: function () { var ids = T.bookIds(), i, bad = []; for (i = 0; i < ids.length; i++) { if (fb1aPrint('books', state.books[ids[i]]) !== mergeBookFingerprint(state.books[ids[i]])) { bad.push(ids[i]); } } return bad; },
  // what the app writes by itself, statement for statement as its own code leaves a record:
  stampUncategorized: function () { var ids = T.bookIds(), i, n = 0; for (i = 0; i < ids.length; i++) { if (!state.books[ids[i]].category) { state.books[ids[i]].category = CATEGORY_UNCATEGORIZED; n = n + 1; } } markBooksDirty(); saveState(); return n; },   // applyClassifyBatch on a failed call
  coverBackfill: function (id) { var b = state.books[id]; b.coverUrl = 'http://127.0.0.1:1/c.jpg'; b.coverCandidates = ['http://127.0.0.1:1/c.jpg']; b.publisher = 'A Press'; b.pageCount = 321; markBooksDirty(); saveState(); },   // the cover backfill landing
  lens: function (name) { var t = createUserTheme(name); if (typeof markThemesDirty === 'function') { markThemesDirty(); } saveState(); return t ? t.id : null; },
  artifact: function (bookId, body) { var u = T.uid(), now = Date.now(); ensureOneArtifact(u, bookId, { userId: u, bookId: bookId, title: 'An artifact', body: body, createdAt: now, updatedAt: now, yumiMayRead: false, yumiMayReadAt: 0 }); markArtifactsDirty(); saveState(); return artifactKey(u, bookId); },
  lenses: function () { var u = T.uid(), out = {}, k; for (k in state.userThemes) { if (state.userThemes[k] && state.userThemes[k].userId === u) { out[k] = state.userThemes[k].name; } } return out; },
  del: function () { return new Promise(function (res) { deleteAccount(function (r) {
    res({ status: r.status, phase: r.phase || null, recoverable: !!r.recoverable, msg: (r.error && r.error.message) || null }); }, function () {}); }); }
};
"""

USER_COLS = ['userBooks', 'userArcs', 'userSubTheories', 'userThemes', 'userArtifacts', 'userNotebook', 'userLensOffers', 'userProfiles', 'userReaderModel']

class Cloud:
    def __init__(self):
        self.docs = {}; self.log = []; self.offline = set(); self.fail_reads = {}   # device -> set(cols)
        self.slow = {}                                                              # device -> ms a user read takes to answer
    def handle(self, dev, op, path, body):
        col = path.split('/')[0]
        if op == 'get':
            if dev in self.offline or col in self.fail_reads.get(dev, ()):
                self.log.append((dev, 'get-fail', path)); return json.dumps({'error': 'Failed to get document because the client is offline.', 'delay': self.slow.get(dev, 0) if col in USER_COLS else 0})
            self.log.append((dev, 'get', path))
            if col == 'betaAllowlist': return json.dumps({'exists': True, 'data': {'seed': False}})
            d = self.docs.get(path)
            return json.dumps({'exists': d is not None, 'data': d})
        if dev in self.offline: return json.dumps({'offline': True})
        b = json.loads(body)
        if op == 'delete':
            self.docs.pop(path, None); self.log.append((dev, 'delete', path)); return '{}'
        data = json.loads(b['json'])
        if b.get('merge') and isinstance(self.docs.get(path), dict) and isinstance(data, dict):
            self.docs[path] = dict(self.docs[path], **data)
        else:
            self.docs[path] = data
        self.log.append((dev, 'set', path)); return '{}'
    def books(self, uid): d = self.docs.get('userBooks/' + uid) or {}; return sorted(d.get('bookIds', []))
    def book(self, uid, bid): return ((self.docs.get('userBooks/' + uid) or {}).get('books') or {}).get(bid)
    def notes(self, uid): d = self.docs.get('userNotebook/' + uid) or {}; return {k: v.get('body') for k, v in (d.get('notebookEntries') or {}).items()}
    def arcs(self, uid): d = self.docs.get('userArcs/' + uid) or {}; return {k: v.get('title') for k, v in (d.get('arcs') or {}).items()}
    def subs(self, uid): d = self.docs.get('userSubTheories/' + uid) or {}; return {k: v.get('header') for k, v in (d.get('subTheories') or {}).items()}
    def sub(self, uid, sid): d = self.docs.get('userSubTheories/' + uid) or {}; return (d.get('subTheories') or {}).get(sid) or {}
    def arts(self, uid): d = self.docs.get('userArtifacts/' + uid) or {}; return d.get('bookArtifacts') or {}
    def lens_names(self, uid):
        d = self.docs.get('userThemes/' + uid) or {}; m = d.get('userThemes') or d.get('themes') or {}
        return {k: v.get('name') for k, v in m.items()}
    def user_docs(self, uid): return sorted(k for k in self.docs if k.split('/')[0] in USER_COLS and k.endswith('/' + uid))
    def sets(self, dev, col=None): return [e for e in self.log if e[0] == dev and e[1] == 'set' and (col is None or e[2].startswith(col + '/'))]

def serve(root, port):
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
        def end_headers(self):
            self.send_header('Cache-Control', 'no-store'); super().end_headers()
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', port), functools.partial(Q, directory=root))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv

class Device:
    """One browser context = one device's storage. open() = launch the app; close() = swipe it away."""
    def __init__(self, rig, name):
        self.rig, self.name = rig, name
        self.ctx = rig.browser.new_context(viewport={'width': 390, 'height': 844}, service_workers='block')
        self.ctx.expose_function('rigCloud', lambda op, path, body: rig.cloud.handle(name, op, path, body))
        self.ctx.add_init_script(HELPERS_GUARD)
        self.pg = None; self.errors = []
    def open(self, wait=1200):
        if self.pg: self.pg.close()
        pg = self.ctx.new_page(); self.pg = pg
        pg.on('pageerror', lambda e: (self.errors.append(str(e)), TRACE.append('[%s] %s: %s' % (WHERE[0], self.name, getattr(e, 'stack', None) or str(e)))))
        def route(r):
            u = r.request.url
            if '/vendor/firebase/' in u:
                r.fulfill(status=200, content_type='application/javascript', body=FAKE if 'firebase-app-compat' in u else '/* rig */'); return
            if u.startswith('http://127.0.0.1:%d/' % PORT): r.continue_()
            else: r.abort()
        pg.route('**/*', route)
        pg.goto('http://127.0.0.1:%d/index.html' % PORT)
        pg.wait_for_function("typeof captureNote === 'function' && typeof state === 'object'")
        pg.evaluate(HELPERS)
        pg.wait_for_timeout(wait)
        return self
    def close(self):
        if self.pg: self.pg.close(); self.pg = None
    def sign_in(self, uid, wait=1200):
        self.pg.evaluate("__rigSignIn(%s)" % json.dumps(uid)); self.pg.wait_for_timeout(wait); return self
    def ev(self, js): return self.pg.evaluate(js)
    def wait(self, ms=700): self.pg.wait_for_timeout(ms)

HELPERS_GUARD = """
window.__toasts = [];
new MutationObserver(function (ms) { ms.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) {
  if (n.className === 'praxis-toast') { window.__toasts.push(n.textContent); } }); }); }).observe(document, { childList: true, subtree: true });
"""

class Rig:
    def __init__(self):
        serve(ROOT, PORT)
        self.pw = sync_playwright().start()
        self.browser = self.pw.chromium.launch(channel='chrome')
        self.cloud = Cloud(); self.devs = []
    def device(self, name):
        d = Device(self, name); self.devs.append(d); return d
    def fresh_cloud(self):
        self.cloud = Cloud()
        for d in self.devs: d.close()
    def close(self):
        self.browser.close(); self.pw.stop()

results = []
WHERE = ['start']
TRACE = []   # page errors with the scenario, the device and the stack
def check(name, got, want):
    ok = (got == want)
    results.append((name, ok, got, want))
    print(('  PASS  ' if ok else '  FAIL  ') + name + ('' if ok else '\n        got  %r\n        want %r' % (got, want)))

def fail_user_reads(rig, dev, on=True, cols=None):
    if on: rig.cloud.fail_reads[dev] = set(cols or USER_COLS)
    else: rig.cloud.fail_reads.pop(dev, None)

def main():
    rig = Rig()
    try:
        return scenarios(rig)
    except Exception as e:
        # On a tree that LOSES data a later scenario cannot run (the record it edits is gone). Say so and still report.
        print('\n  STOPPED in [%s]: %s' % (WHERE[0], str(e).split('\n')[0][:160]))
        npass = sum(1 for r in results if r[1]); nfail = len(results) - npass
        print('\n%s: %d / %d passed, %d failed, then STOPPED in [%s]' % (LABEL, npass, len(results), nfail, WHERE[0]))
        rig.close()
        return nfail or 1

def scenarios(rig):
    U = 'reader1'
    print('== FB-1a behaviour rig on %s ==' % LABEL)

    # ---------------------------------------------------------------- S0 control: the normal path
    WHERE[0] = 'S0'; print('\n[S0] control: online, nothing failing')
    P = rig.device('phone').open().sign_in(U)
    b1 = P.ev("T.addBook('Pedagogy of the Oppressed')"); b2 = P.ev("T.addBook('All About Love')"); b3 = P.ev("T.addBook('Beloved')")
    n1 = P.ev("T.note('first note, from the phone')"); a1 = P.ev("T.arc('An arc from the phone')")
    P.wait()
    check('S0 three books reach the cloud', rig.cloud.books(U), sorted([b1, b2, b3]))
    check('S0 the note reaches the cloud', rig.cloud.notes(U), {n1: 'first note, from the phone'})
    check('S0 every latch is open after a good load', P.ev("T.latches()"), {k: True for k in ['books', 'arcs', 'subTheories', 'themes', 'artifacts', 'notebook']})
    check('S0 no pending notebook ids once the save is confirmed', P.ev("T.pending('notebook')"), [])
    P.close(); P.open()
    check('S0 reopen: shelf and note still here', [sorted(P.ev("T.bookIds()")), P.ev("T.notes()")], [sorted([b1, b2, b3]), {n1: 'first note, from the phone'}])
    check('S0 no notice on a clean load', P.ev("window.__toasts.slice()"), [])
    if P.ev("typeof fb1aPrint === 'function'"): check('S0 the patch prints a book by the same fields as the repo\'s mergeBookFingerprint', P.ev("T.printsAgree()"), [])

    # ---------------------------------------------------------------- S1 BR-01: a device that is behind
    WHERE[0] = 'S1'; print('\n[S1] BR-01: the laptop is behind, its reads fail, the reader changes something, the signal returns')
    L = rig.device('laptop').open().sign_in(U)                      # laptop loads 3 books + 1 note, then is put away
    check('S1 laptop starts with the 3 books', sorted(L.ev("T.bookIds()")), sorted([b1, b2, b3]))
    L.close()
    b4 = P.ev("T.addBook('Sister Outsider')"); b5 = P.ev("T.addBook('Freedom Dreams')"); b6 = P.ev("T.addBook('Cruel Optimism')"); b7 = P.ev("T.addBook('Black Marxism')")
    n2 = P.ev("T.note('second note, from the phone')"); P.ev("T.editNote(%s, 'first note, REWRITTEN on the phone')" % json.dumps(n1))
    a2 = P.ev("T.arc('A second arc from the phone')")
    P.wait()
    check('S1 phone week: cloud holds 7 books, 2 notes, 2 arcs', [len(rig.cloud.books(U)), len(rig.cloud.notes(U)), len(rig.cloud.arcs(U))], [7, 2, 2])
    fail_user_reads(rig, 'laptop')                                    # bad signal: every read fails, writes still get through
    mark = len(rig.cloud.log)
    L.open()
    check('S1 laptop opens on its old copy (3 books)', sorted(L.ev("T.bookIds()")), sorted([b1, b2, b3]))
    L.ev("T.editBook(%s, 'read')" % json.dumps(b1)); b8 = L.ev("T.addBook('The Fire Next Time')")
    n3 = L.ev("T.note('third note, from the laptop while the read was failing')")
    L.ev("T.editArc(%s, 'An arc RENAMED on the laptop')" % json.dumps(a1))
    L.wait()
    writes_while_failing = [e[2] for e in rig.cloud.log[mark:] if e[0] == 'laptop' and e[1] == 'set' and e[2].split('/')[0] in ('userBooks', 'userNotebook', 'userArcs')]
    check('S1 NO shelf, notebook or arc write leaves the laptop while its reads fail', writes_while_failing, [])
    check('S1 cloud shelf still whole while the laptop waits (7 books)', len(rig.cloud.books(U)), 7)
    lat = L.ev("T.latches()")
    check('S1 laptop latches shut while failing', [lat['books'], lat['notebook'], lat['arcs']], [False, False, False])
    fail_user_reads(rig, 'laptop', False); L.ev("T.online()"); L.wait(1500)       # the signal returns, the app still open
    check('S1 after the retry: cloud shelf = the phone\'s 7 + the laptop\'s 1', rig.cloud.books(U), sorted([b1, b2, b3, b4, b5, b6, b7, b8]))
    check('S1 the laptop\'s status edit reached the cloud', (rig.cloud.book(U, b1) or {}).get('status'), 'read')
    check('S1 cloud notes = phone\'s 2 + laptop\'s 1, phone\'s rewrite intact', rig.cloud.notes(U), {n1: 'first note, REWRITTEN on the phone', n2: 'second note, from the phone', n3: 'third note, from the laptop while the read was failing'})
    check('S1 cloud arcs: laptop rename kept, phone\'s second arc kept', rig.cloud.arcs(U), {a1: 'An arc RENAMED on the laptop', a2: 'A second arc from the phone'})
    check('S1 laptop now shows all 8 books', sorted(L.ev("T.bookIds()")), sorted([b1, b2, b3, b4, b5, b6, b7, b8]))
    check('S1 laptop took the phone\'s rewrite of the untouched note', L.ev("T.notes()").get(n1), 'first note, REWRITTEN on the phone')
    lat = L.ev("T.latches()")
    check('S1 laptop latches open after the retry', [lat['books'], lat['notebook'], lat['arcs']], [True, True, True])

    # ---------------------------------------------------------------- S2 BR-01: a device with no copy
    WHERE[0] = 'S2'; print('\n[S2] BR-01: a new device, the shelf read fails, the reader adds one book')
    N = rig.device('newphone').open()
    fail_user_reads(rig, 'newphone', True, ['userBooks'])
    N.sign_in(U)
    check('S2 new device shows an empty shelf', N.ev("T.bookIds()"), [])
    b9 = N.ev("T.addBook('Braiding Sweetgrass')"); N.wait()
    check('S2 cloud shelf untouched after the add (8 books)', len(rig.cloud.books(U)), 8)
    fail_user_reads(rig, 'newphone', False); N.ev("T.online()"); N.wait(1500)
    check('S2 after the retry: cloud shelf = 8 + the new one', rig.cloud.books(U), sorted([b1, b2, b3, b4, b5, b6, b7, b8, b9]))
    check('S2 the new device now shows all 9', len(N.ev("T.bookIds()")), 9)

    # ---------------------------------------------------------------- S3 BR-02: a note written offline, app closed
    WHERE[0] = 'S3'; print('\n[S3] BR-02: a note written with no signal, the app closed before the signal returns')
    P.close(); P.open()
    rig.cloud.offline.add('phone')
    n4 = P.ev("T.note('written on the train, no signal')"); P.wait(400)
    check('S3 the offline note is on the phone', P.ev("T.notes()").get(n4), 'written on the train, no signal')
    check('S3 it is marked pending', n4 in P.ev("T.pending('notebook')"), True)
    P.close()                                                         # swiped away: the queued write dies with the page
    rig.cloud.offline.discard('phone')
    check('S3 the cloud never saw it', n4 in rig.cloud.notes(U), False)
    P.open()
    check('S3 reopened online: the note is STILL on the phone', P.ev("T.notes()").get(n4), 'written on the train, no signal')
    check('S3 and it has now been pushed to the cloud', rig.cloud.notes(U).get(n4), 'written on the train, no signal')
    check('S3 pending set cleared after the confirmed save', P.ev("T.pending('notebook')"), [])
    check('S3 the other notes are all still there', len(P.ev("T.notes()")), 4)

    # ---------------------------------------------------------------- S4 BR-02 delete symmetry
    WHERE[0] = 'S4'; print('\n[S4] a note deleted with no signal, the app closed, a stale cloud copy at the next open')
    rig.cloud.offline.add('phone')
    P.ev("T.delNote(%s)" % json.dumps(n2)); P.wait(300)
    P.close(); rig.cloud.offline.discard('phone')
    check('S4 the cloud still lists the deleted note', n2 in rig.cloud.notes(U), True)
    P.open()
    check('S4 reopened: the deleted note does NOT come back', n2 in P.ev("T.notes()"), False)
    check('S4 and the delete has now reached the cloud', n2 in rig.cloud.notes(U), False)
    P.close(); P.open()
    check('S4 one more open: the delete mark is cleared', P.ev("T.pendingDel('notebook')"), [])

    # ---------------------------------------------------------------- S5 control: a delete on another device still lands
    WHERE[0] = 'S5'; print('\n[S5] control: a note deleted on the laptop disappears from the phone at its next open')
    L.close(); L.open()          # a FRESH read first: a delete from a device that is behind is BR-04 (next build), not this control
    L.ev("T.delNote(%s)" % json.dumps(n3)); L.wait()
    P.close(); P.open()
    check('S5 the phone dropped the note the laptop deleted', n3 in P.ev("T.notes()"), False)

    # ---------------------------------------------------------------- S6 a brand-new account whose first reads fail
    WHERE[0] = 'S6'; print('\n[S6] a new account, first reads fail, the reader writes, then the read answers "no document yet"')
    U2 = 'reader2'
    D = rig.device('tablet').open(); fail_user_reads(rig, 'tablet'); D.sign_in(U2)
    c1 = D.ev("T.addBook('Teaching to Transgress')"); m1 = D.ev("T.note('my very first note')"); D.wait()
    check('S6 nothing written while the reads fail', rig.cloud.sets('tablet', 'userBooks') + rig.cloud.sets('tablet', 'userNotebook'), [])
    fail_user_reads(rig, 'tablet', False); D.ev("T.online()"); D.wait(1500)
    check('S6 after the retry (absent): the book and the note are pushed', [rig.cloud.books(U2), rig.cloud.notes(U2)], [[c1], {m1: 'my very first note'}])

    # ---------------------------------------------------------------- S7 the timer retries without any event
    WHERE[0] = 'S7'; print('\n[S7] the retry timer: reads fail at open, recover a moment later, no "online" event')
    P.close(); fail_user_reads(rig, 'phone'); P.open()
    check('S7 shut while failing', P.ev("T.latches()")['books'], False)
    try: P.pg.wait_for_function("window.__toasts.length > 0", timeout=4000)   # wait for the notice itself, not a fixed delay
    except Exception: pass                                                     # (untouched main never says it)
    P.wait(900)
    toast_seen = P.ev("window.__toasts.slice()")
    check('S7 the notice is said once, not six times', len(toast_seen), 1)
    fail_user_reads(rig, 'phone', False); P.wait(6500)
    check('S7 the 5-second retry opened the latches', P.ev("T.latches()"), {k: True for k in ['books', 'arcs', 'subTheories', 'themes', 'artifacts', 'notebook']})

    # ---------------------------------------------------------------- S8 edit while failing, app closed before recovery (known limit, unchanged)
    WHERE[0] = 'S8'; print('\n[S8] sign-out while a load is failing leaves nothing behind')
    P.close(); fail_user_reads(rig, 'phone'); P.open()
    P.ev("firebase.auth().signOut()"); P.wait(600)
    fail_user_reads(rig, 'phone', False); mark = len(rig.cloud.log)
    P.ev("T.online()"); P.wait(1200)
    check('S8 no read or write after sign-out', [e for e in rig.cloud.log[mark:] if e[0] == 'phone' and e[2].split('/')[0] in USER_COLS], [])
    P.sign_in(U, 1500)
    check('S8 signing back in loads normally (latches open, 9 books)', [P.ev("T.latches()")['books'], len(P.ev("T.bookIds()"))], [True, 9])

    # ---------------------------------------------------------------- S9 account deletion never starts while a load is unfinished
    WHERE[0] = 'S9'; print('\n[S9] Delete account while the library cannot be read: refused before anything is touched')
    P.close(); fail_user_reads(rig, 'phone'); P.open()
    docs_before = rig.cloud.user_docs(U); r0 = P.ev("__rig.reauths")
    res = P.ev("T.del()")
    check('S9 refused, through the existing "nothing was deleted" branch', [res['status'], res['phase'], res['recoverable']], ['error', 'firestore', False])
    check('S9 no sign-in window was opened and no document was touched', [P.ev("__rig.reauths") - r0, rig.cloud.user_docs(U)], [0, docs_before])
    fail_user_reads(rig, 'phone', False); P.ev("T.online()"); P.wait(1200)

    # ---------------------------------------------------------------- S10 the arcs retry does not reload sub-theories
    WHERE[0] = 'S10'; print('\n[S10] arcs fail, sub-theories load; the arcs retry must not load sub-theories a second time')
    P.close(); fail_user_reads(rig, 'phone', True, ['userArcs']); P.open()
    g1 = P.ev("__rig.gets.userSubTheories || 0")
    fail_user_reads(rig, 'phone', False); P.ev("T.online()"); P.wait(1200)
    check('S10 sub-theories read once per sign-in', [g1, P.ev("__rig.gets.userSubTheories || 0")], [1, 1])
    check('S10 arcs latch open after its retry', P.ev("T.latches()")['arcs'], True)

    # ---------------------------------------------------------------- S11 a stale device that changes NOTHING takes everything
    WHERE[0] = 'S11'; print('\n[S11] the laptop is behind, its reads fail, the reader only LOOKS AROUND, the signal returns')
    L.close()
    P.ev("T.editBook(%s, 'read')" % json.dumps(b2)); b10 = P.ev("T.addBook('Race After Technology')")
    P.ev("T.editNote(%s, 'train note, REWRITTEN on the phone')" % json.dumps(n4)); P.ev("T.editArc(%s, 'Second arc RENAMED on the phone')" % json.dumps(a2)); P.wait()
    fail_user_reads(rig, 'laptop'); mark = len(rig.cloud.log)
    L.open()
    for h in ['#books', '#notebook', '#home', '#book/' + b2, '#lenses', '#profile', '#arcs', '#arc/' + a2, '#search', '#books']:
        L.ev("location.hash = %s" % json.dumps(h)); L.wait(350)
    fail_user_reads(rig, 'laptop', False); L.ev("T.online()"); L.wait(1500)
    check('S11 the laptop wrote nothing to shelf, notebook or arcs', [e[2] for e in rig.cloud.log[mark:] if e[0] == 'laptop' and e[1] == 'set' and e[2].split('/')[0] in ('userBooks', 'userNotebook', 'userArcs')], [])
    check('S11 cloud still holds the phone\'s edits', [(rig.cloud.book(U, b2) or {}).get('status'), rig.cloud.notes(U).get(n4), rig.cloud.arcs(U).get(a2), b10 in rig.cloud.books(U)], ['read', 'train note, REWRITTEN on the phone', 'Second arc RENAMED on the phone', True])
    check('S11 the laptop now shows the phone\'s edits', [L.ev("state.books[%s].status" % json.dumps(b2)), L.ev("T.notes()").get(n4), L.ev("T.arcs()").get(a2), b10 in L.ev("T.bookIds()")], ['read', 'train note, REWRITTEN on the phone', 'Second arc RENAMED on the phone', True])

    # ---------------------------------------------------------------- S12 retries never overlap
    WHERE[0] = 'S12'; print('\n[S12] three retry triggers at once make one read per collection')
    L.close(); fail_user_reads(rig, 'laptop'); L.open()
    L.ev("T.online()"); L.wait(500); L.ev("T.online()"); L.wait(500)          # two retries that FAIL again
    check('S12 still shut after two failed retries', L.ev("T.latches()")['books'], False)
    g0 = L.ev("__rig.gets.userBooks || 0")
    fail_user_reads(rig, 'laptop', False)
    L.ev("T.online(); document.dispatchEvent(new Event('visibilitychange')); T.online();"); L.wait(1200)
    check('S12 one retry read for the shelf, not three', L.ev("__rig.gets.userBooks || 0") - g0, 1)
    check('S12 coming back to the front is a retry trigger too (latches open)', L.ev("T.latches()")['books'], True)

    # ---------------------------------------------------------------- S13 the limit that is NOT closed here (BR-03), stated and measured
    WHERE[0] = 'S13'; print('\n[S13] known limit, unchanged by this build: an EDIT made while failing, app closed before recovery')
    L.close(); fail_user_reads(rig, 'laptop'); L.open()
    L.ev("T.editNote(%s, 'edited on the laptop, then the lid closed')" % json.dumps(n1)); n5 = L.ev("T.note('a NEW note on the laptop, then the lid closed')"); L.wait(300)
    L.close(); fail_user_reads(rig, 'laptop', False); L.open()
    check('S13 the NEW note survives the close and is pushed', [L.ev("T.notes()").get(n5), rig.cloud.notes(U).get(n5)], ['a NEW note on the laptop, then the lid closed'] * 2)
    check('S13 the EDIT reverted to the cloud copy (BR-03, next build)', L.ev("T.notes()").get(n1), 'first note, REWRITTEN on the phone')

    # ---------------------------------------------------------------- S14 sub-theories ride the same guard
    WHERE[0] = 'S14'; print('\n[S14] a sub-theory written while its read is failing')
    st0 = P.ev("(function(){ var s = createSubTheory(%s, { header: 'A sub-theory from the phone' }); return s ? s.id : null; })()" % json.dumps(a1)); P.wait()
    L.close(); L.open(); L.close()
    fail_user_reads(rig, 'laptop'); L.open()
    L.ev("updateSubTheory(%s, { header: 'RENAMED on the laptop while failing' })" % json.dumps(st0)); L.wait(300)
    st_cloud_mid = ((rig.cloud.docs.get('userSubTheories/' + U) or {}).get('subTheories') or {}).get(st0, {}).get('header')
    fail_user_reads(rig, 'laptop', False); L.ev("T.online()"); L.wait(1500)
    st_cloud = ((rig.cloud.docs.get('userSubTheories/' + U) or {}).get('subTheories') or {}).get(st0, {}).get('header')
    check('S14 held while failing, pushed after the retry', [st_cloud_mid, st_cloud], ['A sub-theory from the phone', 'RENAMED on the laptop while failing'])

    # ---------------------------------------------------------------- S15 the first seconds: an edit made BEFORE the read has given up
    WHERE[0] = 'S15'; print('\n[S15] reads take 4 s to fail (as a real offline read does); the reader edits in those first seconds')
    L.close(); L.open(); L.close()                                    # the laptop is level with the cloud, then put away
    b11 = P.ev("T.addBook('The Undercommons')"); P.wait()
    fail_user_reads(rig, 'laptop'); rig.cloud.slow['laptop'] = 4000; mark = len(rig.cloud.log)
    L.open(wait=300)
    check('S15 the reads have not answered yet', [e for e in rig.cloud.log[mark:] if e[0] == 'laptop' and e[1] == 'set' and e[2].split('/')[0] in ('userBooks', 'userNotebook', 'userArcs', 'userSubTheories')], [])
    L.ev("T.editBook(%s, 'will-read')" % json.dumps(b3)); L.ev("T.editNote(%s, 'edited in the first seconds on the laptop')" % json.dumps(n1))
    L.ev("T.editArc(%s, 'renamed in the first seconds')" % json.dumps(a1)); L.ev("updateSubTheory(%s, { header: 'sub renamed in the first seconds' })" % json.dumps(st0))
    L.wait(5200)                                                      # every read has now failed
    check('S15 latches shut once the reads fail', [L.ev("T.latches()")[k] for k in ('books', 'notebook', 'arcs', 'subTheories')], [False] * 4)
    rig.cloud.slow.pop('laptop', None); fail_user_reads(rig, 'laptop', False); L.ev("T.online()")
    # sub-theories load AFTER arcs answer, so their own slow first read is still in flight here; it fails, then the timer retries it
    L.pg.wait_for_function("subTheoriesLoaded === true && arcsLoaded === true && booksLoaded === true && notebookLoaded === true", timeout=30000); L.wait(1200)
    sub_now = ((rig.cloud.docs.get('userSubTheories/' + U) or {}).get('subTheories') or {}).get(st0, {}).get('header')
    check('S15 the four first-seconds edits reached the cloud', [(rig.cloud.book(U, b3) or {}).get('status'), rig.cloud.notes(U).get(n1), rig.cloud.arcs(U).get(a1), sub_now],
          ['will-read', 'edited in the first seconds on the laptop', 'renamed in the first seconds', 'sub renamed in the first seconds'])
    check('S15 and the laptop still shows them', [L.ev("state.books[%s].status" % json.dumps(b3)), L.ev("T.notes()").get(n1), L.ev("T.arcs()").get(a1)],
          ['will-read', 'edited in the first seconds on the laptop', 'renamed in the first seconds'])
    check('S15 the phone\'s new book is still in the cloud, and on the laptop', [b11 in rig.cloud.books(U), b11 in L.ev("T.bookIds()")], [True, True])

    # ---------------------------------------------------------------- S16 account deletion, once the library has loaded
    WHERE[0] = 'S16'; print('\n[S16] Delete account on a loaded device: the failed-login recovery, then the real thing, with a retry trigger fired mid-way')
    D.close(); D.open()
    check('S16 the throwaway account is loaded and has its documents', [D.ev("T.latches()")['books'], 'userBooks/' + U2 in rig.cloud.user_docs(U2), 'userNotebook/' + U2 in rig.cloud.user_docs(U2)], [True, True, True])
    D.ev("__rig.authDeleteFails = true")
    res = D.ev("T.del()")
    check('S16 login removal fails: reported as recoverable', [res['status'], res['phase'], res['recoverable']], ['error', 'auth', True])
    check('S16 and the data really was re-uploaded (the panel says so)', [rig.cloud.books(U2), rig.cloud.notes(U2)], [[c1], {m1: 'my very first note'}])
    D.ev("__rig.authDeleteFails = false; __rig.authDeleteMs = 1500")
    D.ev("window.__del = T.del()"); D.wait(600); D.ev("T.online(); document.dispatchEvent(new Event('visibilitychange'));")   # triggers land between the cloud delete and the local wipe
    res = D.ev("window.__del")
    check('S16 the account is deleted', res['status'], 'deleted')
    D.wait(2500)
    check('S16 and nothing of it is written back afterwards', rig.cloud.user_docs(U2), [])

    # ---------------------------------------------------------------- S17 the same, on a device whose reads were failing a moment ago
    WHERE[0] = 'S17'; print('\n[S17] a device with a failing load: deletion refused; after the load succeeds it runs, and no retry re-creates a document')
    U3 = 'reader3'
    E = rig.device('spare').open().sign_in(U3)
    e1 = E.ev("T.note('a note on the spare device')"); E.wait()
    E.close(); fail_user_reads(rig, 'spare'); E.open()
    e2 = E.ev("T.note('written while the read was failing')"); E.wait(300)
    res = E.ev("T.del()")
    check('S17 refused while failing; the cloud copy is untouched', [res['status'], res['phase'], rig.cloud.notes(U3)], ['error', 'firestore', {e1: 'a note on the spare device'}])
    E.ev("__rig.authDeleteMs = 1500; window.__del = T.del()"); E.wait(400)      # asked again at once, still failing
    check('S17 still refused on a second ask', E.ev("window.__del")['phase'], 'firestore')
    fail_user_reads(rig, 'spare', False); E.ev("T.online()"); E.wait(1500)
    check('S17 the load succeeded and the held note was pushed', rig.cloud.notes(U3).get(e2), 'written while the read was failing')
    E.ev("window.__del = T.del()"); E.wait(600); E.ev("T.online(); document.dispatchEvent(new Event('visibilitychange'));")
    res = E.ev("window.__del"); E.wait(2500)
    check('S17 deleted, and nothing written back', [res['status'], rig.cloud.user_docs(U3)], ['deleted', []])

    # ---------------------------------------------------------------- S18 the same account signs in again while a load is failing
    WHERE[0] = 'S18'; print('\n[S18] a second sign-in event for the SAME account, while a load is failing, with an edit already made')
    P.close(); fail_user_reads(rig, 'phone'); P.open()
    P.ev("T.editNote(%s, 'edited before the second sign-in event')" % json.dumps(n1)); P.wait(300)
    fail_user_reads(rig, 'phone', False)                              # the reads work again, and no retry has run yet...
    P.ev("__rigSignIn(%s)" % json.dumps(U)); P.wait(1500)             # ...when the auth listener fires again for the same uid
    check('S18 the edit survived the new load and reached the cloud', [P.ev("T.notes()").get(n1), rig.cloud.notes(U).get(n1)], ['edited before the second sign-in event'] * 2)
    check('S18 latches open', P.ev("T.latches()")['notebook'], True)

    LATCHES_OPEN = "booksLoaded === true && arcsLoaded === true && subTheoriesLoaded === true && themesLoaded === true && artifactsLoaded === true && notebookLoaded === true"

    # ---------------------------------------------------------------- S19 the app's own writes are not the reader's
    WHERE[0] = 'S19'; print('\n[S19] a device that is behind, reads failing: the app stamps categories, a cover lookup lands, a lens gets its look')
    lz = P.ev("T.lens('A lens from the phone')"); P.wait()
    L.close(); L.open(); L.close()                                     # the laptop is level, then put away
    P.ev("T.editBook(%s, 'read')" % json.dumps(b4)); P.ev("T.editBook(%s, 'read')" % json.dumps(b5))
    P.ev("state.userThemes[%s].name = 'RENAMED on the phone'; state.userThemes[%s].updatedAt = Date.now(); markThemesDirty(); saveState();" % (json.dumps(lz), json.dumps(lz))); P.wait()
    fail_user_reads(rig, 'laptop'); L.open()
    stamped = L.ev("T.stampUncategorized()"); L.ev("T.coverBackfill(%s)" % json.dumps(b5))
    looked = L.ev("(function(){ var t = state.userThemes[%s], lk = lensMakeLook(t.name + ' again', lensSkyLooks(T.uid())); if (!lk) { return false; } t.look = lk; markThemesDirty(); saveState(); return true; })()" % json.dumps(lz))   # the app's own maker, as ensureLensLooks uses it
    check('S19 the lens was given a look by the app\'s own maker', looked, True)
    L.ev("T.editBook(%s, 'will-read')" % json.dumps(b6)); L.wait(300)  # and ONE thing the reader really did
    check('S19 the stamp touched several books', stamped >= 4, True)
    fail_user_reads(rig, 'laptop', False); L.ev("T.online()"); L.pg.wait_for_function(LATCHES_OPEN, timeout=30000); L.wait(1200)
    check('S19 the phone\'s status changes survive in the cloud', [(rig.cloud.book(U, b4) or {}).get('status'), (rig.cloud.book(U, b5) or {}).get('status')], ['read', 'read'])
    check('S19 and reach the laptop', [L.ev("state.books[%s].status" % json.dumps(b4)), L.ev("state.books[%s].status" % json.dumps(b5))], ['read', 'read'])
    check('S19 the phone\'s lens rename survives in the cloud and reaches the laptop', [rig.cloud.lens_names(U).get(lz), L.ev("T.lenses()").get(lz)], ['RENAMED on the phone'] * 2)
    check('S19 the laptop reader\'s own edit still wins', (rig.cloud.book(U, b6) or {}).get('status'), 'will-read')
    check('S19 prints still agree with mergeBookFingerprint', L.ev("T.printsAgree()"), [])

    # ---------------------------------------------------------------- S20 the moment between start-up and the sign-in event
    WHERE[0] = 'S20'; print('\n[S20] the sign-in event comes 3 s after start-up; the reader edits before it; the reads then fail')
    L.ev("localStorage.setItem('rig_auth_delay', '3000')"); L.close()
    fail_user_reads(rig, 'laptop'); L.open(wait=300)
    check('S20 the app is up as the cached reader before the sign-in event', [L.ev("T.uid()"), L.ev("T.latches()")['notebook']], [U, False])
    L.ev("T.editNote(%s, 'edited before the sign-in event')" % json.dumps(n1)); L.ev("T.editBook(%s, 'reading')" % json.dumps(b4))
    L.wait(3800)                                                       # the event has come and the reads have failed
    fail_user_reads(rig, 'laptop', False); L.ev("T.online()"); L.pg.wait_for_function(LATCHES_OPEN, timeout=30000); L.wait(1200)
    check('S20 both edits reached the cloud', [rig.cloud.notes(U).get(n1), (rig.cloud.book(U, b4) or {}).get('status')], ['edited before the sign-in event', 'reading'])
    L.ev("localStorage.removeItem('rig_auth_delay')")

    # ---------------------------------------------------------------- S21 a live arc's public copy on a device that has not read the sub-theories
    WHERE[0] = 'S21'; print('\n[S21] a new device reads the arcs but not the sub-theories, then the reader renames a live arc')
    P.close(); P.open()
    P.ev("state.subTheories[%s].status = 'published'; markSubTheoriesDirty(); state.arcs[%s].published = true; state.arcs[%s].freshness = 'live'; markArcsDirty(); saveState();" % (json.dumps(st0), json.dumps(a1), json.dumps(a1))); P.wait(900)
    pub = 'publishedArcs/' + a1
    check('S21 the phone published the arc (a public copy exists)', pub in rig.cloud.docs, True)
    G = rig.device('guestphone').open(); fail_user_reads(rig, 'guestphone', True, ['userSubTheories']); G.sign_in(U)
    check('S21 the new device has the arc and no sub-theories yet', [a1 in G.ev("T.arcs()"), G.ev("T.latches()")['arcs'], G.ev("T.latches()")['subTheories']], [True, True, False])
    G.ev("T.editArc(%s, 'renamed on the new device')" % json.dumps(a1)); G.wait(900)
    check('S21 the public copy was NOT deleted', pub in rig.cloud.docs, True)
    check('S21 and it still carries the old title (the refresh is owed, not made on half a library)', (rig.cloud.docs.get(pub) or {}).get('title') != 'renamed on the new device', True)
    fail_user_reads(rig, 'guestphone', False); G.ev("T.online()"); G.pg.wait_for_function(LATCHES_OPEN, timeout=30000); G.wait(900)
    check('S21 still there once everything has loaded; the arc is still marked published', [pub in rig.cloud.docs, G.ev("state.arcs[%s].published" % json.dumps(a1))], [True, True])
    check('S21 the owed refresh was paid: the public copy now carries the new title', (rig.cloud.docs.get(pub) or {}).get('title'), 'renamed on the new device')

    # ---------------------------------------------------------------- S24 a live arc edited offline: its public copy follows once the reads succeed
    WHERE[0] = 'S24'; print('\n[S24] a live arc renamed while every read is failing; the reads then succeed')
    L.close(); L.open(); L.close()                                     # the laptop is level, then put away
    fail_user_reads(rig, 'laptop'); L.open()
    L.ev("T.editArc(%s, 'renamed offline on the laptop')" % json.dumps(a1)); L.wait(600)
    check('S24 nothing reached the public copy while the reads fail', (rig.cloud.docs.get(pub) or {}).get('title'), 'renamed on the new device')
    fail_user_reads(rig, 'laptop', False); L.ev("T.online()"); L.pg.wait_for_function(LATCHES_OPEN, timeout=30000); L.wait(1200)
    check('S24 the rename is in the cloud, the public copy carries it, and the arc is still published',
          [rig.cloud.arcs(U).get(a1), (rig.cloud.docs.get(pub) or {}).get('title'), pub in rig.cloud.docs, L.ev("state.arcs[%s].published" % json.dumps(a1))], ['renamed offline on the laptop', 'renamed offline on the laptop', True, True])

    # ---------------------------------------------------------------- S22 a record kept here whose parent was deleted on another device
    WHERE[0] = 'S22'; print('\n[S22] a sub-theory and an artifact edited while failing; the phone deleted the arc and the book meanwhile')
    a3 = P.ev("T.arc('An arc the phone will delete')"); st3 = P.ev("(function(){ var s = createSubTheory(%s, { header: 'a sub-theory of that arc' }); return s ? s.id : null; })()" % json.dumps(a3))
    bx = P.ev("T.addBook('A book the phone will delete')"); ax = P.ev("T.artifact(%s, 'an artifact of that book')" % json.dumps(bx)); P.wait()
    L.close(); L.open(); L.close()
    P.ev("deleteArc(%s); saveState();" % json.dumps(a3)); P.ev("deleteBook(T.uid(), %s)" % json.dumps(bx)); P.wait()
    check('S22 the phone\'s deletes reached the cloud: arc gone, its sub-theory re-homed (arcId null), book gone, artifact gone',
          [a3 in rig.cloud.arcs(U), rig.cloud.sub(U, st3).get('arcId', 'MISSING'), rig.cloud.book(U, bx) is None, ax in rig.cloud.arts(U)], [False, None, True, False])
    fail_user_reads(rig, 'laptop'); L.open()
    check('S22 the laptop still holds all four (it is behind)', [L.ev("!!state.arcs[%s]" % json.dumps(a3)), L.ev("!!state.subTheories[%s]" % json.dumps(st3)), L.ev("!!state.books[%s]" % json.dumps(bx)), L.ev("!!state.bookArtifacts[%s]" % json.dumps(ax))], [True] * 4)
    L.ev("updateSubTheory(%s, { header: 'edited on the laptop while failing' })" % json.dumps(st3))
    L.ev("state.bookArtifacts[%s].body = 'edited on the laptop while failing'; state.bookArtifacts[%s].updatedAt = Date.now(); markArtifactsDirty(); saveState();" % (json.dumps(ax), json.dumps(ax))); L.wait(300)
    fail_user_reads(rig, 'laptop', False); L.ev("T.online()"); L.pg.wait_for_function(LATCHES_OPEN, timeout=30000); L.wait(1200)
    check('S22 the phone\'s deletes hold on the laptop: the arc and the book are gone', [L.ev("!!state.arcs[%s]" % json.dumps(a3)), L.ev("!!state.books[%s]" % json.dumps(bx))], [False, False])
    check('S22 the reader\'s two edits are kept, here and in the cloud',
          [L.ev("state.subTheories[%s].header" % json.dumps(st3)), rig.cloud.sub(U, st3).get('header'), L.ev("state.bookArtifacts[%s].body" % json.dumps(ax)), (rig.cloud.arts(U).get(ax) or {}).get('body')], ['edited on the laptop while failing'] * 4)
    print('        reading: the kept sub-theory\'s arcId is %s (the deleted arc was %s); the kept artifact\'s bookId is %s' % (L.ev("state.subTheories[%s].arcId" % json.dumps(st3)), a3, L.ev("state.bookArtifacts[%s].bookId" % json.dumps(ax))))
    before_errs = len(L.errors); seen = {}; shows = []
    for h in ['#subtheory/' + st3, '#subtheory/' + st3 + '/build', '#artifact/' + bx, '#book/' + bx, '#arcs', '#home', '#search', '#profile', '#notebook', '#books']:
        L.ev("location.hash = %s" % json.dumps(h)); L.wait(500); seen[h] = L.ev("(document.getElementById(APP_EL_ID) || document.body).textContent.length")
        if L.ev("(document.getElementById(APP_EL_ID) || document.body).textContent.indexOf('edited on the laptop while failing') !== -1"): shows.append(h)
    check('S22 every room opens without a page error with those two records present', L.errors[before_errs:], [])
    print('        reading: the kept words are on screen in ' + ', '.join(shows))
    check('S22 and each of those rooms drew something', [h for h in seen if not seen[h]], [])
    L.ev("location.hash = '#arcs'"); L.wait(500)
    check('S22 the kept sub-theory is listed on the Arcs page, under Unrooted', L.ev("(function(){ var el = document.querySelector('.arcs-unrooted'); return !!el && el.textContent.indexOf('edited on the laptop while failing') !== -1; })()"), True)

    # ---------------------------------------------------------------- S23 signed out, then back in: no cached reader at start-up
    WHERE[0] = 'S23'; print('\n[S23] the laptop signs out and back in; reads take 4 s to fail; the reader edits in those seconds')
    L.ev("location.hash = '#home'"); L.wait(300); L.ev("firebase.auth().signOut()"); L.wait(700)
    fail_user_reads(rig, 'laptop'); rig.cloud.slow['laptop'] = 4000
    L.sign_in(U, wait=400)
    L.ev("T.editNote(%s, 'edited straight after signing back in')" % json.dumps(n1)); L.ev("T.editBook(%s, 'read')" % json.dumps(b6))
    L.wait(5200)
    check('S23 latches shut once the reads fail', [L.ev("T.latches()")[k] for k in ('books', 'notebook')], [False, False])
    rig.cloud.slow.pop('laptop', None); fail_user_reads(rig, 'laptop', False); L.ev("T.online()"); L.pg.wait_for_function(LATCHES_OPEN, timeout=40000); L.wait(1200)
    check('S23 both edits reached the cloud', [rig.cloud.notes(U).get(n1), (rig.cloud.book(U, b6) or {}).get('status')], ['edited straight after signing back in', 'read'])

    errs = sum([d.errors for d in rig.devs], [])
    for t in TRACE: print('        page error ' + t.replace('\n', '\n            '))
    check('page errors across every device', errs, [])
    print('\nnotice shown on a failed load: %r' % toast_seen)
    npass = sum(1 for r in results if r[1]); nfail = len(results) - npass
    print('\n%s: %d / %d passed, %d failed' % (LABEL, npass, len(results), nfail))
    rig.close()
    return nfail

if __name__ == '__main__':
    sys.exit(1 if main() else 0)
