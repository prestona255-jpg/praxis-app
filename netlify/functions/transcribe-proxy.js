// ElevenLabs Speech-to-Text proxy. Mirrors claude-proxy.js / elevenlabs-proxy.js:
// identical CORS + the shared-secret x-praxis-key gate. The upstream key
// (ELEVENLABS_API_KEY -- the SAME account key the TTS proxy uses) lives
// server-side only and never reaches the client. The audio and the key are
// NEVER logged. Inbound shape mirrors vision-proxy: the client sends bare
// base64 audio in a JSON body (no inbound multipart parsing); this function
// decodes it and forwards a multipart/form-data upload to ElevenLabs Scribe,
// then relays ONLY the plain transcript string as JSON { transcript }.
//
// Requires the Node 18+ runtime (Netlify default) for the global fetch /
// FormData / Blob / Buffer used below -- the sibling proxies already rely on
// global fetch + Buffer, so the runtime is established. Verified on the live
// deploy (this file uses no ES3 harness; the client conventions do not apply
// to Netlify functions).

// --- config (swappable) ---------------------------------------------------
// Scribe model. scribe_v2 is the current recommended model; scribe_v1 is the
// older model (recon flagged it as deprecation-bound). Swap here to change.
var ELEVENLABS_STT_MODEL_ID = 'scribe_v2';
var ELEVENLABS_STT_URL = 'https://api.elevenlabs.io/v1/speech-to-text';
// Soft inbound guard (base64 chars). A short voice note is well under this;
// Netlify itself caps a synchronous request near 6 MB. ~7.5M base64 chars is
// ~5.6 MB of binary audio -- reject larger to avoid a doomed upstream call.
var MAX_AUDIO_B64_CHARS = 7500000;

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

    // Audio: bare base64 string. Defensively accept a data: URL of ANY media
    // type (incl. a parameter like audio/webm;codecs=opus) by taking everything
    // after the FIRST comma -- a /;base64,/ regex misses parameterized types.
    // Raw base64 has no comma, so indexOf -> -1 -> used as-is.
    var audio = body.audio;
    if (typeof audio === 'string') {
      var ci = audio.indexOf(',');
      if (ci > -1) { audio = audio.substring(ci + 1); }
    }
    if (typeof audio !== 'string' || audio.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'audio (bare base64 string) is required' })
      };
    }
    if (audio.length > MAX_AUDIO_B64_CHARS) {
      return {
        statusCode: 413,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'audio too large' })
      };
    }

    // mimeType drives the upload content-type + filename. The browser emits
    // audio/webm (Chrome/Firefox) or audio/mp4 (Safari/iOS); accept any
    // audio/* string and fall back to audio/webm. ElevenLabs accepts both.
    var mimeType = (typeof body.mimeType === 'string' && body.mimeType.indexOf('audio/') === 0)
      ? body.mimeType
      : 'audio/webm';
    var filename = (mimeType.indexOf('mp4') > -1) ? 'audio.mp4'
      : (mimeType.indexOf('mpeg') > -1) ? 'audio.mp3'
      : (mimeType.indexOf('ogg') > -1) ? 'audio.ogg'
      : (mimeType.indexOf('wav') > -1) ? 'audio.wav'
      : 'audio.webm';

    var buf = Buffer.from(audio, 'base64');

    // Build the multipart upload ElevenLabs expects: file + model_id. Do NOT
    // set Content-Type by hand -- fetch derives the multipart boundary from
    // the FormData body.
    var form = new FormData();
    form.append('model_id', ELEVENLABS_STT_MODEL_ID);
    form.append('file', new Blob([buf], { type: mimeType }), filename);

    var response = await fetch(
      ELEVENLABS_STT_URL,
      {
        method: 'POST',
        headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY },
        body: form
      }
    );

    // Upstream error -- pass the status through, do not 200. Log the status
    // server-side only (never the audio or the key); return a generic error.
    if (!response.ok) {
      if (console && console.error) { console.error('[transcribe-proxy] upstream error', response.status); }
      return {
        statusCode: response.status,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'stt-upstream-error' })
      };
    }

    var data = await response.json();
    // Single-channel Scribe response: top-level "text" holds the transcript.
    var transcript = (data && typeof data.text === 'string') ? data.text : '';

    return {
      statusCode: 200,
      headers: {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ transcript: transcript })
    };

  } catch(err) {
    // Keep the detail server-side only; never echo internal error text (or
    // any audio) to the client.
    if (console && console.error) { console.error('[transcribe-proxy] error', err && err.message ? err.message : 'error'); }
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'server-error' })
    };
  }
};
