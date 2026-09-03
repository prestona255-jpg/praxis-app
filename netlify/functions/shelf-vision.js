// shelf-vision.js -- SCAN DE-RISK LANE endpoint (NEW FILE, not app-wired).
//
// Purpose: answer the de-risk question "can a vision model reliably identify
// books from a real shelf photo?" against the DEPLOYED endpoint. It MIRRORED
// the (since-retired) vision-proxy.js pattern -- identical CORS + the
// x-praxis-key shared-secret gate (fail CLOSED), the upstream ANTHROPIC_API_KEY
// stays server-side and is only ever read via process.env. P1 Item 1
// (2026-09-03) DELETED vision-proxy.js (0 client callers); this file is now the
// only vision endpoint and is self-contained.
//
// It WAS distinct from vision-proxy.js on purpose (the differences, kept for
// the record):
//   (a) output contract adds "spineText" (raw legible spine text) + a
//       high|medium|low "confidence" tri-state (vision-proxy uses
//       clear|partial "legibility" and no spineText);
//   (b) an allow-listed optional "model" field lets the de-risk harness run the
//       SAME shelf photo through two models in one deploy -- default
//       claude-sonnet-4-6 (what the app uses today), or the stronger
//       claude-opus-4-8. Absent/malformed -> default; a non-allow-listed value
//       -> clean 4xx (silent coercion would MISLABEL de-risk results, so we
//       reject instead);
//   (c) it BAKES IN the truncation-as-error lesson vision-proxy lacked: a
//       non-'end_turn' stop_reason (esp. 'max_tokens') is an ERROR, never an
//       empty result. Silence never wears the empty state's clothes.
//
// Honest states (the whole contract): found-nothing = 200 {books:[]};
// call-failed = a non-2xx status with {error:"..."}. The two are never confused.
//
// Runtime: Netlify's built-in Node 18+ (global fetch/Buffer) -- zero deps, same
// as the sibling functions. This file uses no ES3 client harness; the client
// conventions do not apply to Netlify functions.

// --- config -----------------------------------------------------------------
// Exactly two allow-listed vision models (Preston's decision: default +
// one stronger). Both support image input.
var ALLOWED_MODELS = { 'claude-sonnet-4-6': true, 'claude-opus-4-8': true };
var DEFAULT_MODEL  = 'claude-sonnet-4-6';
// Generous but non-streaming-safe. A full shelf (~40 books, with spineText)
// lands well under this; 128K is the model ceiling but a large non-streaming
// value risks the synchronous-function timeout, and the stop_reason guard
// below catches the rare truncation honestly rather than silently.
var MAX_TOKENS = 4096;
// Soft inbound guard (base64 chars). ~7.5M b64 chars is ~5.6 MB of binary;
// Netlify caps a synchronous request near 6 MB -- reject larger to avoid a
// doomed upstream call.
var MAX_IMAGE_B64_CHARS = 7500000;

// P1 Item 1: this endpoint JOINS the per-uid AI cost ceiling (R1.5) -- the
// same Firebase-ID-token identity, the same aiUsage/{uid} counter and cap as
// claude-proxy, enforced in ./lib/ceiling.js before any upstream call.
var ceiling = require('./lib/ceiling.js');

exports.handler = async function(event) {
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

  // Shared-secret gate (the pattern vision-proxy.js used: fail CLOSED). When
  // PRAXIS_CLIENT_KEY is set in the Netlify environment, every POST must carry a
  // matching x-praxis-key header. When the env var is UNSET/empty the request is
  // REJECTED (fail-open would be an open relay on a billable key). The key IS
  // set in prod, so this changes nothing in current behavior.
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

  // P1 Item 1: the per-uid ceiling (identity + count) before body parse.
  var gate = await ceiling.enforce(event, Date.now());
  if (gate) { return gate; }

  try {
    var body = JSON.parse(event.body || '{}');

    // Validate mediaType against the vision-supported set.
    var allowedTypes = { 'image/jpeg': true, 'image/png': true, 'image/webp': true };
    if (typeof body.mediaType !== 'string' || !allowedTypes[body.mediaType]) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'mediaType must be image/jpeg, image/png, or image/webp' })
      };
    }

    // Model allow-list. Absent or malformed (not a non-empty string) -> default.
    // A present, non-allow-listed value -> clean 400: a de-risk instrument must
    // never silently run a different model than asked (that mislabels results).
    var model = DEFAULT_MODEL;
    if (typeof body.model === 'string' && body.model.length > 0) {
      if (!ALLOWED_MODELS[body.model]) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type':                'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'model must be claude-sonnet-4-6 or claude-opus-4-8' })
        };
      }
      model = body.model;
    }

    // Validate image. Strip a leading data-URL prefix with the params-agnostic
    // after-first-comma method (a /;base64,/ regex misses parameterized types
    // like image/jpeg;charset=... -- this exact bug bit the transcribe proxy).
    // Bare base64 has no comma, so indexOf -> -1 -> used as-is.
    var image = body.image;
    if (typeof image === 'string') {
      var ci = image.indexOf(',');
      if (ci > -1) { image = image.substring(ci + 1); }
    }
    if (typeof image !== 'string' || image.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'image (bare base64 string) is required' })
      };
    }
    if (image.length > MAX_IMAGE_B64_CHARS) {
      return {
        statusCode: 413,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'image too large' })
      };
    }

    // Extraction prompt built server-side so prompt + contract cannot drift from
    // the client. Strict JSON-only, anti-hallucination discipline inherited from
    // vision-proxy.js; output shape carries spineText + the confidence tri-state.
    var extractionPrompt =
      'You are looking at a photograph of a bookshelf. Your job is to identify the '
      + 'physical BOOKS in it. A book is a bound codex -- printed pages held in a '
      + 'cover with a spine, standing upright or lying flat among other books; its '
      + 'spine or cover carries a title and usually an author. Report an item ONLY '
      + 'when BOTH hold: (1) it really is a book by that physical form, and (2) its '
      + 'title text is ACTUALLY LEGIBLE in the image. Book-ness is the FIRST test, '
      + 'legibility the second. A shelf also holds many text-bearing objects that are '
      + 'NOT books -- a marker or pen, a box or carton, a product package, a jar or '
      + 'bottle, a retail or brand label, a folded textile or garment, a card, a '
      + 'sign, a decoration. Do NOT output any of these, even when their printed '
      + 'words are perfectly legible and look like a title (a marker reading '
      + '"Sharpie", a box reading "FLUX", a label reading "SCARVES" are objects, not '
      + 'books). If you are unsure whether an object is a book, OMIT it. Work '
      + 'systematically across the whole image, left to right, shelf by shelf, so '
      + 'that no readable book spine is skipped. NEVER complete, correct, or guess a '
      + 'title or author from your knowledge of popular or bestselling books. If a '
      + 'spine is blurry, partial, angled, or too small to read, either omit it or '
      + 'mark it low confidence. Returning fewer books than there are in the photo is '
      + 'correct and expected; an invented title or author, or a non-book object '
      + 'reported as a book, is a serious error -- a missed book is not. Spine text '
      + 'is often printed across multiple stacked lines -- join those lines into ONE '
      + 'complete title (a title set on two or three lines is still a single book). '
      + 'Never output a fragment of a longer title as its own entry, and list each '
      + 'physical book at most once. '
      + 'For EACH book output an object with four fields: '
      + '"title" (the legible title, REQUIRED, never empty); '
      + '"author" (the legible author when clearly readable, otherwise an empty '
      + 'string -- never guess an author); '
      + '"spineText" (the raw text you read off the spine or cover, verbatim, as a '
      + 'single string); and '
      + '"confidence" (exactly one of "high", "medium", or "low": "high" = the '
      + 'title and author are crisply legible; "medium" = readable but with some '
      + 'uncertainty about the exact characters; "low" = a partly-occluded, '
      + 'blurry, or angled spine you are less sure of). '
      + 'Report only physical books: ignore every non-book object, whether '
      + 'decorative (speakers, frames, plants) or text-bearing (markers, boxes, '
      + 'labels, packages, textiles), and when in doubt, leave it out. '
      + 'Output ONLY a JSON object of the form {"books": [{"title": "...", '
      + '"author": "...", "spineText": "...", "confidence": "high"}]} with no prose '
      + 'and no markdown code fences. If nothing is legible, output {"books": []}.';

    var anthropicBody = {
      model:      model,
      max_tokens: MAX_TOKENS,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type:       'base64',
                media_type: body.mediaType,
                data:       image
              }
            },
            { type: 'text', text: extractionPrompt }
          ]
        }
      ]
    };
    // temperature 0 gives deterministic transcription on claude-sonnet-4-6, but
    // the Opus 4.7+ family REMOVED sampling params -- temperature/top_p/top_k
    // return a 400 on claude-opus-4-8. Send it only for the sonnet path; omit
    // for opus (which also runs without extended thinking by default, i.e. a
    // fast extraction pass -- exactly what we want).
    if (model === 'claude-sonnet-4-6') {
      anthropicBody.temperature = 0;
    }

    var response = await fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type':      'application/json',
          'x-api-key':         process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(anthropicBody)
      }
    );

    var data = await response.json();

    // Upstream error -- pass the status through, do NOT 200. Log detail
    // server-side; never echo internal upstream text to the client.
    if (response.status !== 200) {
      console.error('[shelf-vision] upstream error', response.status, data);
      return {
        statusCode: response.status,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'vision-upstream-error' })
      };
    }

    // TRUNCATION GUARD -- the bake-in the retired vision-proxy lacked. A clean
    // vision completion is stop_reason 'end_turn'. Anything else is abnormal and
    // is reported as an ERROR, never as an empty {books:[]} result:
    //   'max_tokens' -> the silent killer: output truncated mid-JSON.
    //   'refusal'    -> the safety classifier declined (stop_details populated
    //                   only in this case -- guard before reading it elsewhere).
    //   other        -> anything unexpected is still not a success.
    var stopReason = (data && typeof data.stop_reason === 'string') ? data.stop_reason : '';
    if (stopReason !== 'end_turn') {
      console.error('[shelf-vision] abnormal stop_reason', stopReason);
      var errCode = (stopReason === 'max_tokens') ? 'vision-truncated'
                  : (stopReason === 'refusal')    ? 'vision-refused'
                  :                                 'vision-incomplete';
      return {
        statusCode: 502,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: errCode, stop_reason: stopReason })
      };
    }

    // Parse Claude's text content. Strip json code fences, then slice to the
    // outermost {...} object (Opus without thinking can prepend a reasoning
    // sentence -- slicing survives it), JSON.parse, validate the
    // {books:[{title,author,spineText,confidence}]} shape, coerce each entry
    // (title required + non-empty, author/spineText string-or-'', confidence in
    // {high,medium,low} default 'low'), cap at 80. Any failure is an honest 502
    // -- we never fabricate.
    try {
      var text = '';
      if (data && data.content && data.content.length) {
        var k;
        for (k = 0; k < data.content.length; k++) {
          if (data.content[k] && data.content[k].type === 'text') {
            text = text + data.content[k].text;
          }
        }
      }
      // \x60 is a literal backtick; using the hex escape (not a raw one) keeps this
      // regex byte-identical at runtime while passing the ES3 parse gate, whose
      // JScript tokenizer rejects a literal backtick even inside a regex literal.
      text = text.replace(/^\s*\x60\x60\x60(?:json)?\s*/i, '').replace(/\s*\x60\x60\x60\s*$/i, '');
      var firstBrace = text.indexOf('{');
      var lastBrace  = text.lastIndexOf('}');
      if (firstBrace > -1 && lastBrace > firstBrace) {
        text = text.substring(firstBrace, lastBrace + 1);
      }

      var parsed = JSON.parse(text);
      if (!parsed || Object.prototype.toString.call(parsed.books) !== '[object Array]') {
        throw new Error('no books array');
      }
      var rawList = parsed.books;

      var books = [];
      var i;
      for (i = 0; i < rawList.length && books.length < 80; i++) {
        var entry = rawList[i];
        if (!entry || typeof entry !== 'object') { continue; }
        var title = (typeof entry.title === 'string') ? entry.title.replace(/^\s+|\s+$/g, '') : '';
        if (title.length === 0) { continue; }
        var author    = (typeof entry.author === 'string')    ? entry.author.replace(/^\s+|\s+$/g, '')    : '';
        var spineText = (typeof entry.spineText === 'string') ? entry.spineText.replace(/^\s+|\s+$/g, '') : '';
        var confidence = (entry.confidence === 'high' || entry.confidence === 'medium' || entry.confidence === 'low')
          ? entry.confidence
          : 'low';
        books.push({ title: title, author: author, spineText: spineText, confidence: confidence });
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ books: books, model: model })
      };

    } catch (parseErr) {
      return {
        statusCode: 502,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'extraction-parse-failed' })
      };
    }

  } catch (err) {
    // Keep detail server-side only; never echo internal error text to the client.
    console.error('[shelf-vision] error', err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'server-error' })
    };
  }
};
