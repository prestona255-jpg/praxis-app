// ceiling.js -- P1 Item 1: the SERVER-SIDE per-user AI cost ceiling. Node glue
// around ./ceiling-core.js (the pure ES3 decision core). Called by claude-proxy
// and shelf-vision AFTER the shared-secret gate and BEFORE any upstream call.
//
//   var ceiling = require('./lib/ceiling.js');
//   var gate = await ceiling.enforce(event, Date.now());
//   if (gate) { return gate; }            // 401 / 429 / 503 response object
//
// IDENTITY (R1.1). The caller must carry `Authorization: Bearer <Firebase ID
// token>`. The token is verified HERE, statelessly, with Node's built-in
// crypto.verify only -- no firebase-admin, no dependency:
//   header: alg === 'RS256' and a kid are REQUIRED;
//   signing certs: https://www.googleapis.com/robot/v1/metadata/x509/
//     securetoken@system.gserviceaccount.com, cached per kid at module scope
//     honoring the response's Cache-Control max-age, refetched ONCE on an
//     unknown kid;
//   then: iss === 'https://securetoken.google.com/<PROJECT_ID>',
//         aud === '<PROJECT_ID>', non-empty sub, exp > now, iat <= now
//         (60 s skew allowed on both).
// Any failure -> 401 { code: 'unauthenticated' }. No other claim is trusted;
// the uid is `sub` and nothing else -- a uid in the request BODY is never read.
// NOTE: tokens are STATELESS and remain valid until `exp` after sign-out;
// revocation is out of scope for this ceiling.
//
// THE COUNTER (R1.3). Firestore document aiUsage/{uid} = { day: 'YYYY-MM-DD'
// (UTC), count: int }, reached through the Firestore REST API with a
// service-account access token: the SA JWT is signed with crypto.sign (RS256)
// and exchanged at https://oauth2.googleapis.com/token for a datastore-scoped
// access token, cached at module scope until expiry minus 60 s. Per request:
// GET the doc; if day matches and count >= cap -> 429; else COMMIT a
// fieldTransforms increment of +1 (or write { day: today, count: 1 } when the
// day rolled / no doc). Count-before-forward (R1.9): the attempt is counted.
// OVERSHOOT: two concurrent requests from one uid can both read count = cap-1
// and both be admitted; the overshoot is bounded by that uid's own
// concurrency and is acceptable for a COST ceiling -- no hand-rolled
// transaction here, by ruling. The doc is never client-writable (no client
// rule grants create/update; the rules change for Item 2 grants the owner
// DELETE only, so account deletion can remove it).
//
// CONFIG (all Netlify env vars):
//   PRAXIS_SA_KEY           full service-account JSON (SECRET). Unset -> 503
//                           { code: 'ceiling_unconfigured' } -- fail CLOSED,
//                           never open.
//   PRAXIS_AI_DAILY_CAP     default cap per uid per UTC day (default 300).
//   PRAXIS_AI_CAP_OVERRIDES "uid:cap,uid:cap" -- a per-uid config value, not
//                           a bypass; every uid is counted.
//
// var/function + async/await only (no arrows, const, let, class, backticks --
// the hook's ES3 rail warns on those in any staged JS).

var crypto = require('crypto');
var core   = require('./ceiling-core.js');

var CERT_URL   = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
var TOKEN_URL  = 'https://oauth2.googleapis.com/token';
var SKEW_MS    = 60 * 1000;

// Module-scope caches: survive warm invocations, vanish on cold start (which
// only costs a refetch -- the COUNT itself never lives here).
var _certs        = null;   // { kid: pem }
var _certsExpires = 0;      // ms epoch
var _saToken      = null;   // access token string
var _saTokenExp   = 0;      // ms epoch (already minus 60 s)

function _json(status, obj) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(obj)
  };
}

function _b64urlToBuf(s) {
  s = String(s || '').replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4 !== 0) { s = s + '='; }
  return Buffer.from(s, 'base64');
}
function _b64url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

// ---------------------------------------------------------------- certs
function _parseMaxAge(cacheControl) {
  var m = /max-age=(\d+)/.exec(String(cacheControl || ''));
  if (!m) { return 0; }
  return parseInt(m[1], 10) * 1000;
}

async function _fetchCerts(nowMs) {
  var res = await fetch(CERT_URL);
  if (!res.ok) { throw new Error('cert fetch ' + res.status); }
  var data = await res.json();
  _certs = data;
  _certsExpires = nowMs + Math.max(_parseMaxAge(res.headers.get('cache-control')), SKEW_MS);
  return _certs;
}

async function _certForKid(kid, nowMs) {
  if (!_certs || nowMs >= _certsExpires) { await _fetchCerts(nowMs); }
  if (_certs && Object.prototype.hasOwnProperty.call(_certs, kid)) { return _certs[kid]; }
  // Unknown kid: refetch ONCE (key rotation), then give up.
  await _fetchCerts(nowMs);
  if (_certs && Object.prototype.hasOwnProperty.call(_certs, kid)) { return _certs[kid]; }
  return null;
}

// ---------------------------------------------------------------- token
// Returns the verified uid (sub) or null. Never throws to the caller.
async function verifyIdToken(token, projectId, nowMs) {
  try {
    if (typeof token !== 'string') { return null; }
    var parts = token.split('.');
    if (parts.length !== 3) { return null; }
    var header = JSON.parse(_b64urlToBuf(parts[0]).toString('utf8'));
    if (!header || header.alg !== 'RS256' || typeof header.kid !== 'string' || header.kid.length === 0) { return null; }
    var pem = await _certForKid(header.kid, nowMs);
    if (!pem) { return null; }
    // Google's endpoint returns X.509 CERTIFICATE PEMs. Extract the public key
    // explicitly (createPublicKey accepts a certificate PEM and yields its SPKI
    // key) rather than relying on crypto.verify's implicit fallback; if the
    // extraction itself throws, the string is handed through unchanged. Either
    // way a verification failure is a null -> 401, never an admit.
    var keyObj;
    try { keyObj = crypto.createPublicKey(pem); } catch (ek) { keyObj = pem; }
    var ok = crypto.verify(
      'RSA-SHA256',
      Buffer.from(parts[0] + '.' + parts[1], 'utf8'),
      keyObj,
      _b64urlToBuf(parts[2])
    );
    if (!ok) { return null; }
    var claims = JSON.parse(_b64urlToBuf(parts[1]).toString('utf8'));
    if (!claims) { return null; }
    var nowS = Math.floor(nowMs / 1000);
    var skewS = SKEW_MS / 1000;
    if (claims.iss !== 'https://securetoken.google.com/' + projectId) { return null; }
    if (claims.aud !== projectId) { return null; }
    if (typeof claims.sub !== 'string' || claims.sub.length === 0) { return null; }
    if (typeof claims.exp !== 'number' || claims.exp <= nowS - skewS) { return null; }
    if (typeof claims.iat !== 'number' || claims.iat > nowS + skewS) { return null; }
    return claims.sub;
  } catch (e) {
    return null;
  }
}

function _bearer(event) {
  var h = event && event.headers ? (event.headers['authorization'] || event.headers['Authorization'] || '') : '';
  var m = /^Bearer\s+(.+)$/i.exec(String(h));
  return m ? m[1].replace(/\s+/g, '') : null;
}

// ---------------------------------------------------------------- SA token
async function _saAccessToken(sa, nowMs) {
  if (_saToken && nowMs < _saTokenExp) { return _saToken; }
  var iat = Math.floor(nowMs / 1000);
  var head = _b64url(Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' }), 'utf8'));
  var claim = _b64url(Buffer.from(JSON.stringify({
    iss:   sa.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud:   TOKEN_URL,
    iat:   iat,
    exp:   iat + 3600
  }), 'utf8'));
  var sig = crypto.sign('RSA-SHA256', Buffer.from(head + '.' + claim, 'utf8'), sa.private_key);
  var assertion = head + '.' + claim + '.' + _b64url(sig);
  var res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') +
          '&assertion=' + encodeURIComponent(assertion)
  });
  if (!res.ok) { throw new Error('sa token ' + res.status); }
  var data = await res.json();
  if (!data || typeof data.access_token !== 'string') { throw new Error('sa token: no access_token'); }
  _saToken = data.access_token;
  var ttl = (typeof data.expires_in === 'number' ? data.expires_in : 3600) * 1000;
  _saTokenExp = nowMs + ttl - SKEW_MS;
  return _saToken;
}

// ---------------------------------------------------------------- store
function _docPath(projectId, uid) {
  return 'projects/' + projectId + '/databases/(default)/documents/aiUsage/' + encodeURIComponent(uid);
}

async function _readUsage(projectId, uid, access) {
  var res = await fetch('https://firestore.googleapis.com/v1/' + _docPath(projectId, uid), {
    headers: { 'Authorization': 'Bearer ' + access }
  });
  if (res.status === 404) { return null; }
  if (!res.ok) { throw new Error('usage read ' + res.status); }
  var data = await res.json();
  var f = (data && data.fields) ? data.fields : {};
  var count = 0;
  if (f.count && typeof f.count.integerValue === 'string') { count = parseInt(f.count.integerValue, 10); }
  else if (f.count && typeof f.count.integerValue === 'number') { count = f.count.integerValue; }
  if (isNaN(count) || count < 0) { count = 0; }
  return { day: (f.day && typeof f.day.stringValue === 'string') ? f.day.stringValue : '', count: count };
}

async function _writeUsage(projectId, uid, access, decision) {
  var name = _docPath(projectId, uid);
  var write;
  if (decision.rolled) {
    write = { update: { name: name, fields: { day: { stringValue: decision.day }, count: { integerValue: '1' } } } };
  } else {
    write = { transform: { document: name, fieldTransforms: [ { fieldPath: 'count', increment: { integerValue: '1' } } ] } };
  }
  var res = await fetch('https://firestore.googleapis.com/v1/projects/' + projectId + '/databases/(default)/documents:commit', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + access, 'Content-Type': 'application/json' },
    body: JSON.stringify({ writes: [ write ] })
  });
  if (!res.ok) { throw new Error('usage write ' + res.status); }
}

// ---------------------------------------------------------------- enforce
// Returns null when the request is admitted (and counted), else a response
// object the function returns as-is.
async function enforce(event, nowMs) {
  if (typeof nowMs !== 'number') { nowMs = Date.now(); }
  var raw = process.env.PRAXIS_SA_KEY;
  if (!raw) {
    return _json(503, { error: 'ceiling unconfigured', code: 'ceiling_unconfigured' });
  }
  var sa;
  try { sa = JSON.parse(raw); } catch (e) { sa = null; }
  if (!sa || typeof sa.project_id !== 'string' || typeof sa.client_email !== 'string' || typeof sa.private_key !== 'string') {
    return _json(503, { error: 'ceiling unconfigured', code: 'ceiling_unconfigured' });
  }
  var projectId = sa.project_id;

  var uid = await verifyIdToken(_bearer(event), projectId, nowMs);
  if (!uid) {
    return _json(401, { error: 'unauthenticated', code: 'unauthenticated' });
  }

  var cap = core.capFor(uid, core.defaultCap(process.env.PRAXIS_AI_DAILY_CAP), process.env.PRAXIS_AI_CAP_OVERRIDES);
  try {
    var access = await _saAccessToken(sa, nowMs);
    var doc = await _readUsage(projectId, uid, access);
    var decision = core.decide(doc, nowMs, cap);
    if (!decision.allowed) {
      return _json(429, {
        error:   'daily limit reached',
        code:    'daily_limit',
        limit:   decision.cap,
        used:    decision.used,
        resetAt: decision.resetAt
      });
    }
    await _writeUsage(projectId, uid, access, decision);
    return null;
  } catch (e) {
    // The counter could not be read or written: fail CLOSED (never admit an
    // uncounted call), with a code the client can name apart from a limit.
    console.error('ceiling: store unavailable', e && e.message);
    return _json(503, { error: 'ceiling unavailable', code: 'ceiling_unavailable' });
  }
}

module.exports = { enforce: enforce, verifyIdToken: verifyIdToken };
