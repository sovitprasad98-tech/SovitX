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
      apiKey:            process.env.AIzaSyBMY_dmCX2dDfES5ecDM57j4rrrv8_pPZc,
      authDomain:        process.env.codexhub-85d35.firebaseapp.com,
      databaseURL:       process.env.https://codexhub-85d35-default-rtdb.firebaseio.com,
      projectId:         process.env.codexhub-85d35,
      storageBucket:     process.env.codexhub-85d35.firebasestorage.app,
      messagingSenderId: process.env.50514494667,
      appId:             process.env.1:50514494667:web:facf9362e4082f867a474e,
    },
    zapKey: process.env.ZAP_KEY,
  });
};
