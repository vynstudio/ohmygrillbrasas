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

    const orderId = 'OMG-' + Date.now().toString(36).toUpperCase();
    const amountInCents = Math.round(amount);
    const platformFee = Math.round(amountInCents * 0.05); // 5% to VynStudio

    // Stripe Connect — 95% to OhMyGrill Brasas, 5% to VynStudio
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      automatic_payment_methods: { enabled: true },
      // ── CONNECT: split payments ──────────────────────────────
      application_fee_amount: platformFee,          // 5% stays with VynStudio
      transfer_data: {
        destination: 'acct_1TEG5QSlmSMd37',         // OH MY GRILL SL account
      },
      // ────────────────────────────────────────────────────────
      metadata: {
        contact_name: contact?.name || '',
        contact_email: contact?.email || '',
        contact_phone: contact?.phone || '',
        delivery_type: deliveryType || 'delivery',
        delivery_zone: deliveryZone?.name || '',
        notes: notes || '',
        items_summary: items?.map(i => `${i.qty}x ${i.name}`).join(', ') || '',
        platform_fee_pct: '5',
        platform_fee_eur: (platformFee / 100).toFixed(2),
        restaurant_receives_eur: ((amountInCents - platformFee) / 100).toFixed(2),
        restaurant: 'OhMyGrill Brasas',
        order_id: orderId,
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
