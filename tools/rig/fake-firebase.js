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
