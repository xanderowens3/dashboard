// Vercel serverless proxy for SmartLead API.
// Forwards /api/smartlead/* requests to SmartLead server-side,
// keeping the API key off the client bundle and handling CORS.

module.exports = async function handler(req, res) {
  const path = Array.isArray(req.query.path) ? req.query.path.join('/') : (req.query.path || '');

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key !== 'path') params.append(key, value);
  }

  const url = `https://server.smartlead.ai/api/v1/${path}?${params.toString()}`;

  try {
    const upstream = await fetch(url, { method: req.method });
    const contentType = upstream.headers.get('content-type') ?? '';
    const body = contentType.includes('application/json')
      ? await upstream.json()
      : await upstream.text();

    res.status(upstream.status).json(body);
  } catch (err) {
    res.status(502).json({ error: 'Proxy error', detail: err.message });
  }
};
