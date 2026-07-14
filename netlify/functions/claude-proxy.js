// --- F-PX1 per-request cost bounds (Stage 1) --------------------------------
// claude-proxy is otherwise a verbatim relay onto the billable Anthropic key,
// so the caps live here. Model + max_tokens are read from the client body and
// clamped/allow-listed before the forward; the raw body is size-checked before
// it is even parsed. Netlify's ~6 MB synchronous-request limit is the platform
// backstop above these.
// Body ceiling-setter is segmentDoc's import paste (import-capture.js:139, a
// bare user paste with no client-side length cap); Yumi/classify bodies are far
// smaller. 1 MiB of text is ~250k tokens -- well past any legitimate call and
// past Anthropic's own context limit -- while blocking a multi-MB abuse body.
var MAX_BODY_BYTES     = 1048576;                      // 1 MiB
// Every client call site sends claude-sonnet-4-6 (YUMI_WEB_MODEL / CLASSIFY_MODEL
// / SEG_MODEL all resolve to it). Anything else is rejected so the relay cannot
// be driven onto a pricier model.
var ALLOWED_MODELS     = { 'claude-sonnet-4-6': true };
// Clamp = min(client, cap). Cap = segmentDoc's 4096 (the largest legitimate
// max_tokens); every other caller asks <= 1024, so no legitimate call changes.
var MAX_OUTPUT_TOKENS  = 4096;

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-praxis-key',
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  // Shared-secret gate (2.0 hardening, batch 2c: fail CLOSED). When
  // PRAXIS_CLIENT_KEY is set in the Netlify environment, every POST must carry a
  // matching x-praxis-key header. When the env var is UNSET/empty the request is
  // REJECTED (it was previously skipped -- fail-open = an open relay on billable
  // keys). The key IS set in prod, so this changes nothing in current behavior.
  var expectedKey = process.env.PRAXIS_CLIENT_KEY;
  if (!expectedKey) {
    return {
      statusCode: 503,
      headers: {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'server misconfigured' })
    };
  }
  var providedKey = (event.headers && (event.headers['x-praxis-key'] || event.headers['X-Praxis-Key'])) || '';
  if (providedKey !== expectedKey) {
    return {
      statusCode: 401,
      headers: {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'unauthorized' })
    };
  }

  // F-PX1 Stage 1a: hard body-size cap, checked BEFORE parsing so an oversized
  // payload never reaches JSON.parse. 413 + a stable code the client can name.
  var rawBodyBytes = event.body
    ? (event.isBase64Encoded ? Buffer.byteLength(event.body, 'base64') : Buffer.byteLength(event.body, 'utf8'))
    : 0;
  if (rawBodyBytes > MAX_BODY_BYTES) {
    return {
      statusCode: 413,
      headers: {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'payload too large', code: 'payload_too_large' })
    };
  }

  try {
    var body = JSON.parse(event.body || '{}');

    // F-PX1 Stage 1c: model allow-list. Reject any model the client does not
    // legitimately send today, so the relay cannot be steered onto a pricier one.
    if (typeof body.model !== 'string' || !ALLOWED_MODELS[body.model]) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'model not allowed', code: 'model_not_allowed' })
      };
    }

    // F-PX1 Stage 1b: server-side max_tokens clamp. effective = min(client, cap).
    var reqTokens = (typeof body.max_tokens === 'number' && body.max_tokens > 0)
      ? body.max_tokens
      : MAX_OUTPUT_TOKENS;
    body.max_tokens = Math.min(reqTokens, MAX_OUTPUT_TOKENS);

    var response = await fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type':      'application/json',
          'x-api-key':         process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body)
      }
    );

    var data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data)
    };

  } catch(err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};