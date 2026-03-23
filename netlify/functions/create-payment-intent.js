const Stripe = require('stripe');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { amount, currency = 'eur', items, contact, deliveryType, deliveryZone, notes } = JSON.parse(event.body);

    if (!amount || amount < 100) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid amount' }) };
    }

    // Create payment intent — goes straight to YOUR Stripe account
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // already in cents from frontend
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        // Order details stored in metadata for your records
        contact_name: contact?.name || '',
        contact_email: contact?.email || '',
        contact_phone: contact?.phone || '',
        delivery_type: deliveryType || 'delivery',
        delivery_zone: deliveryZone?.name || '',
        notes: notes || '',
        items_summary: items?.map(i => `${i.qty}x ${i.name}`).join(', ') || '',
        // Commission tracking
        platform_fee_pct: '5',
        restaurant: 'OhMyGrill Brasas',
        order_id: 'OMG-' + Date.now().toString(36).toUpperCase(),
      },
      receipt_email: contact?.email,
      description: `OhMyGrill Brasas · ${items?.length} plato${items?.length !== 1 ? 's' : ''} · ${deliveryType === 'pickup' ? 'Recogida' : deliveryZone?.name || 'Entrega'}`,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        orderId: paymentIntent.metadata.order_id,
      }),
    };

  } catch (err) {
    console.error('Stripe error:', err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
