// FB-1a rig port -- the device-side bridge. The server injects this (then helpers-guard.js, lifted
// verbatim from fb1a_rig.py's HELPERS_GUARD) as the first scripts in <head> of each device's
// index.html, which is what Playwright's add_init_script did in the chat's rig. It stands in for
// three Playwright facilities and nothing else:
//   ctx.expose_function('rigCloud', ...)  -> window.rigCloud(op, path, body), a postMessage round trip
//                                            to the driver page, which holds the one shared cloud;
//   page.evaluate(js)                     -> a message {rig:'ev'} answered with the JSON of the value;
//   page.on('pageerror')                  -> uncaught errors and unhandled rejections, sent to the driver.
// service_workers='block' -> navigator.serviceWorker.register answers a promise that never settles.
(function () {
  var seq = 0, waiting = {};
  function post(m) { try { window.parent.postMessage(m, '*'); } catch (e) {} }
  window.rigCloud = function (op, path, body) {
    seq = seq + 1;
    var id = seq;
    return new Promise(function (resolve) {
      waiting[id] = resolve;
      post({ rig: 'call', id: id, op: op, path: path, body: body });
    });
  };
  function settle(id, ok, value, err) {
    var json = null;
    if (ok) { try { json = JSON.stringify(value === undefined ? null : value); } catch (e) { ok = false; err = 'unserialisable: ' + e; } }
    post({ rig: 'evr', id: id, ok: ok, json: json, err: err || null });
  }
  window.addEventListener('message', function (ev) {
    var m = ev.data;
    if (!m || typeof m !== 'object') { return; }
    if (m.rig === 'reply' && waiting[m.id]) { var r = waiting[m.id]; delete waiting[m.id]; r(m.text); return; }
    if (m.rig === 'ev') {
      var v;
      try { v = (0, eval)(m.js); } catch (e) { settle(m.id, false, null, String((e && e.stack) || e)); return; }
      if (v && typeof v.then === 'function') {
        v.then(function (x) { settle(m.id, true, x); }, function (e) { settle(m.id, false, null, String((e && e.stack) || e)); });
      } else { settle(m.id, true, v); }
    }
  });
  window.addEventListener('error', function (e) {
    post({ rig: 'pageerror', text: (e.error && e.error.stack) || e.message || 'error' });
  });
  window.addEventListener('unhandledrejection', function (e) {
    var r = e.reason;
    post({ rig: 'pageerror', text: 'Uncaught (in promise) ' + ((r && r.stack) || String(r)) });
  });
  try {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.register = function () { return new Promise(function () {}); };
    }
  } catch (e) {}
})();
