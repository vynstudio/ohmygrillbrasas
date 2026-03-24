// Creates a PaymentIntent upfront so Stripe PaymentElement can load
// (PaymentElement requires a clientSecret before it can display payment methods)
const Stripe = require('stripe');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });
    const { amount, currency = 'eur' } = JSON.parse(event.body || '{}');

    // Minimum €1 for setup, will be finalized in create-payment-intent
    const finalAmount = Math.max(Math.round(amount || 100), 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency,
      payment_method_types: ['card', 'klarna', 'link'],
      capture_method: 'automatic',
    });

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (err) {
    console.error('Setup intent error:', err.message);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
