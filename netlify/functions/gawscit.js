exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { Allow: 'POST' }, body: JSON.stringify({ ok: false, error: 'POST requests only.' }) };
  }

  const endpoint = process.env.APPS_SCRIPT_EXEC_URL;
  if (!endpoint) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'The backend endpoint is not configured.' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Invalid request.' }) };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'follow'
    });
    const text = await response.text();
    if (!response.ok) {
      return { statusCode: 502, body: JSON.stringify({ ok: false, error: 'The backend request failed.' }) };
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
      body: text
    };
  } catch (error) {
    return { statusCode: 502, body: JSON.stringify({ ok: false, error: 'The backend could not be reached.' }) };
  }
};
