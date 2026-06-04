// api/config.js — Vercel Serverless Function
// Serves Firebase config & ZapUPI key to frontend securely

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Only serve to same-origin requests (Referer check)
  const referer = req.headers.referer || '';
  const origin  = req.headers.origin  || '';
  const allowed = process.env.ALLOWED_ORIGIN || '';

  if (allowed && !referer.startsWith(allowed) && !origin.startsWith(allowed)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  return res.status(200).json({
    firebase: {
      apiKey:            process.env.FIREBASE_API_KEY,
      authDomain:        process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL:       process.env.FIREBASE_DATABASE_URL,
      projectId:         process.env.FIREBASE_PROJECT_ID,
      storageBucket:     process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId:             process.env.FIREBASE_APP_ID,
      measurementId:     process.env.FIREBASE_MEASUREMENT_ID,
    },
    zapKey: process.env.ZAP_KEY,
  });
};
