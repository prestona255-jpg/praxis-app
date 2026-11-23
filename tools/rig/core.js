// Praxis rig -- core.js: everything in the driver that is not a scenario. The shared cloud (Cloud), one
// iframe per "device" (Device; each on its own localhost port, so each has its own localStorage), check(),
// stage(), fail_user_reads(), the log, and the runner. It holds no scenario and names no suite: the runner
// reads ?suite=<name>, loads /__rig/scenarios/<name>.js, runs the one async function that file hands to
// rigSuite(), then prints the summary line and RIG-DONE. Where it came from, and the contract with the
// launchers: README.md. Rig code, not app code: the app's ES3 rule does not bind it.
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

// ======================================================================================================
// THE RUNNER. A suite is one file, tools/rig/scenarios/<name>.js, that calls rigSuite() once with an async
// function. The function drives devices and calls check(); it may throw (the run then STOPS in the scenario
// stage() last named). Everything above is in scope for it: rig, check, stage, fail_user_reads, get, sorted,
// allTrue, J, sleep, print, LABEL, USER_COLS, TRACE, results.
const SUITE_NAME = new URLSearchParams(location.search).get('suite') || '';
let SUITE = null;
let suiteLoadError = '';
function rigSuite(fn) {
  if (typeof fn !== 'function') { throw new Error('rigSuite takes one async function'); }
  if (SUITE) { throw new Error('a suite file calls rigSuite once'); }
  SUITE = fn;
}
window.addEventListener('error', (e) => {
  if (e && e.filename && e.filename.indexOf('/__rig/scenarios/') !== -1) { suiteLoadError = String(e.message || e); }
});
function loadSuite(name) {
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = '/__rig/scenarios/' + name + '.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}
function summary(tail) {
  const npass = results.filter((r) => r[1]).length, nfail = results.length - npass;
  print('\n' + LABEL + ': ' + npass + ' / ' + results.length + ' passed, ' + nfail + ' failed' + tail);
}
async function main() {
  let ready = false;
  if (!/^[A-Za-z0-9_-]+$/.test(SUITE_NAME)) {
    print('no suite to run: the page was opened without ?suite=<name> (letters, digits, - and _ only); got ' + J(SUITE_NAME));
  } else if (!(await loadSuite(SUITE_NAME))) {
    print('no suite named ' + J(SUITE_NAME) + ': tools/rig/scenarios/' + SUITE_NAME + '.js was not found');
  } else if (!SUITE) {
    print('the suite ' + J(SUITE_NAME) + ' registered nothing: tools/rig/scenarios/' + SUITE_NAME + '.js did not call rigSuite()' + (suiteLoadError ? ' (' + suiteLoadError + ')' : ''));
  } else { ready = true; }
  if (ready) {
    HELPERS = await (await fetch('/__rig/helpers.js')).text();
    try {
      await SUITE();
      summary('');
    } catch (e) {
      print('\n  STOPPED in [' + WHERE[0] + ']: ' + String((e && e.message) || e).split('\n')[0].slice(0, 160));
      for (const t of TRACE) { print('        page error ' + t.replace(/\n/g, '\n            ')); }
      summary(', then STOPPED in [' + WHERE[0] + ']');
    }
  }
  print('RIG-DONE');
  await flush();
}
main();
