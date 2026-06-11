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
      'Identify the book titles visible on the spines or covers in this '
      + 'photograph of books. For each book, give the title; append the '
      + 'author after the title separated by a single space ONLY when the '
      + 'author is clearly legible. Output ONLY a JSON object of the form '
      + '{"titles": ["...", "..."]} with no prose and no markdown code '
      + 'fences. If no books are identifiable, output {"titles": []}. '
      + 'Never invent a title that cannot actually be read in the image.';

    var anthropicBody = {
      model:      'claude-sonnet-4-20250514',
      max_tokens: 1500,
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

    // Upstream error -- pass the status through with detail, do not 200.
    if (response.status !== 200) {
      return {
        statusCode: response.status,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'vision-upstream-error', detail: data })
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
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
