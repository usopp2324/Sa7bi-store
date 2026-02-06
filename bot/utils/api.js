const fetch = require('node-fetch');

async function postToDjango(path, payload, apiBaseUrl, apiSecret) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiSecret,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = data.error || `Request failed with status ${response.status}`;
    throw new Error(error);
  }
  return data;
}

module.exports = {
  postToDjango,
};
