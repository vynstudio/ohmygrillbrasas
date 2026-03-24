// One-time function to register domain with Apple Pay via Stripe
// Call: POST /.netlify/functions/register-apple-pay-domain
const Stripe = require('stripe');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });

    const domain = await stripe.applePayDomains.create({
      domain_name: 'ohmygrillbrasas.com',
    });

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ ok: true, domain }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
