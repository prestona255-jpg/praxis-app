// ElevenLabs Text-to-Speech proxy. Mirrors claude-proxy.js: identical CORS +
// the shared-secret x-praxis-key gate. The upstream key (ELEVENLABS_API_KEY)
// lives server-side only and never reaches the client. Voice + model + format
// are config constants below (swappable). Unlike the JSON proxies, a success
// returns BINARY audio/mpeg, base64-encoded with isBase64Encoded so the
// Lambda binary-response contract is honored; upstream errors (JSON) are
// relayed as JSON. The client only ever speaks gate-PASSED lines (see
// yumi-ui.js renderYumiMessage speak path).

// --- config (swappable) ---------------------------------------------------
// "Jessica" -- NOT the default young-Jessica voice (FGY2WhTYpPnrIDTdsKH5).
var ELEVENLABS_VOICE_ID = 'Gvx1qZk9R4BUiBfsNPBU';
// Flash: ~75ms low-latency conversational TTS (verified against ElevenLabs
// docs / models reference). Swap here to change engine.
var ELEVENLABS_MODEL_ID = 'eleven_flash_v2_5';
// output_format is an ElevenLabs query parameter; mp3 is the default family.
var ELEVENLABS_OUTPUT_FORMAT = 'mp3_44100_128';

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

  // Optional shared-secret gate. When PRAXIS_CLIENT_KEY is set in the
  // Netlify environment, every POST must carry a matching x-praxis-key
  // header. When the env var is unset or empty the check is skipped,
  // preserving the unauthenticated behavior used in early development.
  var expectedKey = process.env.PRAXIS_CLIENT_KEY;
  if (expectedKey) {
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
  }

  try {
    var body = JSON.parse(event.body || '{}');
    var text = (body && typeof body.text === 'string') ? body.text : '';
    if (text === '') {
      return {
        statusCode: 400,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'missing text' })
      };
    }

    var url = 'https://api.elevenlabs.io/v1/text-to-speech/' +
      encodeURIComponent(ELEVENLABS_VOICE_ID) +
      '?output_format=' + encodeURIComponent(ELEVENLABS_OUTPUT_FORMAT);

    var response = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key':   process.env.ELEVENLABS_API_KEY,
          'Accept':       'audio/mpeg',
        },
        body: JSON.stringify({ text: text, model_id: ELEVENLABS_MODEL_ID })
      }
    );

    // Upstream error: ElevenLabs returns JSON (not audio) -- relay it as JSON
    // so the client can fail gracefully (skip audio, render text).
    if (!response.ok) {
      var errText = await response.text();
      return {
        statusCode: response.status,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'tts upstream', status: response.status, detail: errText })
      };
    }

    // Success: binary audio. Netlify returns binary via base64 body +
    // isBase64Encoded; relabel as audio/mpeg for the browser.
    var audioBuf = await response.arrayBuffer();
    var b64 = Buffer.from(audioBuf).toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Content-Type':                'audio/mpeg',
        'Access-Control-Allow-Origin': '*',
      },
      body: b64,
      isBase64Encoded: true
    };

  } catch(err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
