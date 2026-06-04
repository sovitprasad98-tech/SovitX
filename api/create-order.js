// api/create-order.js — Vercel Serverless Function
// Proxies ZapUPI order creation so key stays server-side

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { order_id, amount, remark, customer_mobile } = req.body;

  if (!order_id || !amount) {
    return res.status(400).json({ error: 'order_id and amount are required' });
  }

  try {
    const payload = {
      zap_key:  process.env.ZAP_KEY,
      order_id,
      amount:   String(amount),
      remark:   (remark || 'SovitX Order').replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 50),
    };
    if (customer_mobile) payload.customer_mobile = customer_mobile;

    const response = await fetch('https://zapupi.com/api/create-order', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
};
