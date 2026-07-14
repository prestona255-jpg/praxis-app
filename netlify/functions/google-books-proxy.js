// F-PX1 Stage 1a (Preston ruling #1): hard query-length cap. `q` is a book
// search (title/author/isbn) -- a few dozen chars in legitimate use, incl. the
// signed-out startup cover-backfill (app.js). 300 gives headroom while blocking
// an oversized query. Google Books is low-cost, but the endpoint is reachable
// signed-out, so it gets the same 413 idiom as the billable proxies.
var MAX_Q_CHARS = 300;

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

  try {
    var body = JSON.parse(event.body || '{}');

    if (typeof body.q !== 'string' || body.q.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'missing q' })
      };
    }
    if (body.q.length > MAX_Q_CHARS) {
      return {
        statusCode: 413,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'query too large', code: 'payload_too_large' })
      };
    }

    // Single authoritative encode of q happens here. Callers send the
    // raw, unencoded q in the JSON body; the proxy URL-encodes it
    // exactly once when building the upstream request.
    var upstreamUrl = 'https://www.googleapis.com/books/v1/volumes?q=' + encodeURIComponent(body.q);

    // If GOOGLE_BOOKS_API_KEY is unset, fall through to an unauthenticated
    // request -- same behavior as the pre-proxy direct call. This keeps
    // the function verifiable before the env var is configured.
    var apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    if (apiKey) {
      upstreamUrl = upstreamUrl + '&key=' + encodeURIComponent(apiKey);
    }

    var response = await fetch(upstreamUrl);

    // Read upstream body as text first. Google Books can return non-JSON
    // (HTML or empty) on error statuses like 429. If we call response.json()
    // directly, a parse throw would convert an upstream 429 into a proxy 500
    // and hide the real status. Instead: try-parse, and on parse failure
    // pass the upstream status + raw text through untouched. The client's
    // existing fail-soft (totalItems guard / .catch) handles non-JSON
    // responses correctly because data.totalItems is absent.
    var text = await response.text();
    var parsed;
    var parsedOk;
    try {
      parsed = JSON.parse(text);
      parsedOk = true;
    } catch (parseErr) {
      parsedOk = false;
    }

    if (parsedOk) {
      return {
        statusCode: response.status,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(parsed)
      };
    }

    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: text
    };

  } catch(err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
