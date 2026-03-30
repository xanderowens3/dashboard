// Vercel serverless proxy for SmartLead API.
// Forwards requests from the frontend to SmartLead so the API key
// never needs to be hardcoded and CORS is handled server-side.

export default async function handler(req, res) {
  // Build the SmartLead path from the catch-all segment
  const path = req.query.path ? req.query.path.join('/') : '';

  // Forward all query params (api_key, start_date, end_date, etc.)
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key !== 'path') params.append(key, value);
  }

  const url = `https://server.smartlead.ai/api/v1/${path}?${params.toString()}`;

  try {
    const upstream = await fetch(url, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
    });

    const contentType = upstream.headers.get('content-type') ?? '';
    const body = contentType.includes('application/json')
      ? await upstream.json()
      : await upstream.text();

    res.status(upstream.status).json(body);
  } catch (err) {
    res.status(502).json({ error: 'Proxy error', detail: err.message });
  }
}
