// error-counts.js -- L3.1 (thirteenth r8): the ONE place error counts may go,
// and only when the reader has turned on Send error counts in Settings.
//
// What it accepts is the About covenant's term 5, made checkable: EXACTLY
//   { kinds: { "<file>:<line>": <count>, ... }, opened: <boolean>, version: "<praxis-vN.N>" | "" }
// -- error counts by kind, where a kind is a source FILE NAME + LINE NUMBER and
// never any part of an error message; "opened" = the app opened today; the bundle
// version. Any other key, any text-shaped kind, any non-integer count -> 400.
//
// Who may send: a signed-in reader on the invite allowlist (Firebase ID token, verified
// by lib/ceiling.js's verifyClaims; listed per its isListed -- L3.2) through the same
// shared-secret gate the other functions use. The
// uid is used ONLY to admit the request and is NEVER stored: each report becomes
// one Firestore document errorReports/<random id> = { day, version, opened, kinds },
// written with the service account (the rules grant no client access to it).
//
// var/function + async/await only (no arrows, const, let, class, backticks -- the
// hook's ES3 rail warns on those in any staged JS).

var crypto  = require('crypto');
var ceiling = require('./lib/ceiling.js');

var MAX_BODY_BYTES = 8192;
var MAX_KINDS      = 40;
// A kind is a source file name ending .js (or "?" when unknown) + a line number --
// RT-5: tightened from any 40 chars, so free text cannot ride in a kind.
var KIND_RE        = /^(?:[A-Za-z0-9_\-]{1,32}\.js|\?):[0-9]{1,7}$/;
var VERSION_RE     = /^praxis-v[0-9]+\.[0-9]+$/;

function _json(status, obj) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(obj)
  };
}

// PURE: returns { ok: true, value } or { ok: false, why }. Exactly three keys.
function validateCounts(obj) {
  if (!obj || typeof obj !== 'object' || obj instanceof Array) { return { ok: false, why: 'not an object' }; }
  var k, n = 0;
  for (k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      if (k !== 'kinds' && k !== 'opened' && k !== 'version') { return { ok: false, why: 'unexpected key' }; }
      n = n + 1;
    }
  }
  if (n !== 3) { return { ok: false, why: 'missing key' }; }
  if (typeof obj.opened !== 'boolean') { return { ok: false, why: 'opened' }; }
  if (typeof obj.version !== 'string' || (obj.version !== '' && !VERSION_RE.test(obj.version))) { return { ok: false, why: 'version' }; }
  var kinds = obj.kinds;
  if (!kinds || typeof kinds !== 'object' || kinds instanceof Array) { return { ok: false, why: 'kinds' }; }
  var out = {}, m = 0, v;
  for (k in kinds) {
    if (!Object.prototype.hasOwnProperty.call(kinds, k)) { continue; }
    if (!KIND_RE.test(k)) { return { ok: false, why: 'kind shape' }; }
    v = kinds[k];
    if (typeof v !== 'number' || v < 0 || v > 10000000 || Math.floor(v) !== v) { return { ok: false, why: 'count' }; }
    m = m + 1;
    if (m > MAX_KINDS) { return { ok: false, why: 'too many kinds' }; }
    out[k] = v;
  }
  return { ok: true, value: { kinds: out, opened: obj.opened, version: obj.version } };
}

function _firestoreFields(value, day) {
  var kf = {}, k;
  for (k in value.kinds) {
    if (Object.prototype.hasOwnProperty.call(value.kinds, k)) { kf[k] = { integerValue: String(value.kinds[k]) }; }
  }
  return {
    day:     { stringValue: day },
    version: { stringValue: value.version },
    opened:  { booleanValue: value.opened },
    kinds:   { mapValue: { fields: kf } }
  };
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-praxis-key, Authorization'
      },
      body: ''
    };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  // Shared-secret gate, fail CLOSED (the batch-2c pattern every function uses).
  var expectedKey = process.env.PRAXIS_CLIENT_KEY;
  if (!expectedKey) { return _json(503, { error: 'server misconfigured' }); }
  var providedKey = (event.headers && (event.headers['x-praxis-key'] || event.headers['X-Praxis-Key'])) || '';
  if (providedKey !== expectedKey) { return _json(401, { error: 'unauthorized' }); }

  var raw = event.body || '';
  if (event.isBase64Encoded) { raw = Buffer.from(raw, 'base64').toString('utf8'); }
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) { return _json(413, { error: 'too large' }); }

  var sa = ceiling.loadServiceAccount();
  if (!sa) { return _json(503, { error: 'unconfigured', code: 'ceiling_unconfigured' }); }
  var nowMs = Date.now();
  var claims = await ceiling.verifyClaims(ceiling.bearer(event), sa.project_id, nowMs);
  var uid = claims ? claims.sub : null;
  if (!uid) { return _json(401, { error: 'unauthenticated', code: 'unauthenticated' }); }
  // uid admitted the request; from here it is not read again and never written.

  var parsed;
  try { parsed = JSON.parse(raw); } catch (e) { return _json(400, { error: 'bad json' }); }
  var check = validateCounts(parsed);
  if (!check.ok) { return _json(400, { error: 'rejected', why: check.why }); }

  try {
    var access = await ceiling.saAccessToken(sa, nowMs);
    // L3.2 RT-2: the same allowlist as the rules and the AI proxies (a read failure throws
    // to the catch below: 503, nothing written).
    if (!(await ceiling.isListed(sa.project_id, claims, access))) {
      return _json(403, { error: 'not on the list', code: 'not_listed' });
    }
    var id =crypto.randomBytes(12).toString('hex');
    var name = 'projects/' + sa.project_id + '/databases/(default)/documents/errorReports/' + id;
    var day = new Date(nowMs).toISOString().substring(0, 10);
    var res = await fetch('https://firestore.googleapis.com/v1/projects/' + sa.project_id + '/databases/(default)/documents:commit', {
      method:  'POST',
      headers: { 'Authorization': 'Bearer ' + access, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ writes: [ { update: { name: name, fields: _firestoreFields(check.value, day) }, currentDocument: { exists: false } } ] })
    });
    if (!res.ok) { return _json(503, { error: 'store unavailable' }); }
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*' }, body: '' };
  } catch (e) {
    return _json(503, { error: 'store unavailable' });
  }
};

exports.validateCounts = validateCounts;
