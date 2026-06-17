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

    // Validate image. Defensively strip a leading data:*;base64, prefix
    // -- the client should send bare base64, but a stray data URL must
    // not 500 the function.
    var image = body.image;
    if (typeof image === 'string') {
      image = image.replace(/^data:[^;]*;base64,/, '');
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

    // Extraction prompt built server-side so prompt + model cannot drift
    // from the client. JSON-only contract, never-invent rule explicit.
    var extractionPrompt =
      'Transcribe the titles of the books whose spine or cover text is '
      + 'ACTUALLY LEGIBLE in this photograph. Work systematically across '
      + 'the whole image -- left to right, shelf by shelf -- so that no '
      + 'readable spine is skipped. '
      + 'This is transcription, not identification: output a title ONLY '
      + 'if you can read its characters in the image. NEVER complete, '
      + 'correct, or guess a title from your knowledge of popular or '
      + 'bestselling books. If a spine is blurry, partial, angled, or too '
      + 'small to read, OMIT it entirely. '
      + 'Returning fewer titles than there are books in the photo is '
      + 'correct and expected. An invented title is a serious error; a '
      + 'missed book is not. '
      + 'Spine text is often printed across multiple stacked lines -- join '
      + 'those lines into ONE complete title (a title set on two or three '
      + 'lines is still a single book). Never output a fragment of a '
      + 'longer title as its own entry. '
      + 'Append the author ONLY when it is clearly legible, after the '
      + 'title and separated by a single space. Never output an author '
      + 'name, publisher, or series name on its own as if it were a title. '
      + 'List each physical book at most once -- no duplicate entries. '
      + 'The photo may include non-book objects (speakers, frames, plants, '
      + 'decor) -- ignore them entirely. '
      + 'Output ONLY a JSON object of the form {"titles": ["...", "..."]} '
      + 'with no prose and no markdown code fences. If nothing is legible, '
      + 'output {"titles": []}.';

    var anthropicBody = {
      model:       'claude-sonnet-4-6',
      max_tokens:  2000,
      temperature: 0,
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

    var response = await fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type':      'application/json',
          'x-api-key':         process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(anthropicBody)
      }
    );

    var data = await response.json();

    // Upstream error -- pass the status through, do not 200. Log the
    // upstream detail server-side; never echo it to the client.
    if (response.status !== 200) {
      console.error('[vision-proxy] upstream error', response.status, data);
      return {
        statusCode: response.status,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'vision-upstream-error' })
      };
    }

    // Parse Claude's text content. Strip ```json fences defensively,
    // JSON.parse, validate the {titles:[...]} shape, coerce entries to
    // non-empty strings, cap at 60. Any failure is an honest 502 -- we
    // never fabricate or guess titles.
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
      text = text.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');

      var parsed = JSON.parse(text);
      if (!parsed || Object.prototype.toString.call(parsed.titles) !== '[object Array]') {
        throw new Error('no titles array');
      }

      var titles = [];
      var i;
      for (i = 0; i < parsed.titles.length && titles.length < 60; i++) {
        var entry = parsed.titles[i];
        if (typeof entry !== 'string') entry = String(entry);
        entry = entry.replace(/^\s+|\s+$/g, '');
        if (entry.length > 0) titles.push(entry);
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ titles: titles })
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

  } catch(err) {
    // Keep the detail server-side only; never echo internal error
    // text to the client.
    console.error('[vision-proxy] error', err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'server-error' })
    };
  }
};
