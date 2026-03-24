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

    const { items, deliveryType, deliveryZone, notes, contact, address } = JSON.parse(event.body);

    if (!items?.length) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'No items in order' }) };
    }

    // Calculate amount server-side — never trust client amounts
    const subtotalCents = Math.round(items.reduce((s, i) => s + i.price * i.qty, 0) * 100);
    const deliveryFeeCents = deliveryType === 'pickup' ? 0 : Math.round((deliveryZone?.deliveryFee ?? 0) * 100);
    const totalCents = subtotalCents + deliveryFeeCents;

    if (totalCents < 100) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Order too small' }) };
    }

    const orderId = 'OMG-' + Date.now().toString(36).toUpperCase();
    const platformFee = Math.round(totalCents * 0.05); // 5% to VynStudio

    const piParams = {
      amount: totalCents,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        order_id:           orderId,
        contact_name:       contact?.name  || '',
        contact_email:      contact?.email || '',
        contact_phone:      contact?.phone || '',
        delivery_type:      deliveryType   || 'delivery',
        delivery_zone:      deliveryZone?.name || '',
        delivery_address:   address?.address  || '',
        notes:              notes || '',
        items_summary:      items.map(i => `${i.qty}x ${i.name}`).join(', '),
        subtotal_eur:       (subtotalCents / 100).toFixed(2),
        delivery_eur:       (deliveryFeeCents / 100).toFixed(2),
        total_eur:          (totalCents / 100).toFixed(2),
        platform_fee_eur:   (platformFee / 100).toFixed(2),
        restaurant:         'OhMyGrill Brasas',
      },
      receipt_email: contact?.email || undefined,
      description: `OhMyGrill Brasas · ${items.length} plato${items.length !== 1 ? 's' : ''} · ${deliveryType === 'pickup' ? 'Recogida' : deliveryZone?.name || 'Entrega'}`,
    };

    // Stripe Connect — only add transfer if destination account is verified
    const destination = process.env.STRIPE_CONNECTED_ACCOUNT;
    if (destination) {
      piParams.application_fee_amount = platformFee;
      piParams.transfer_data = { destination };
    }

    const paymentIntent = await stripe.paymentIntents.create(piParams);

    // Save order to Supabase if available
    if (process.env.VITE_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
        await supabase.from('orders').insert({
          id: orderId,
          stripe_payment_intent_id: paymentIntent.id,
          status: 'pending_payment',
          items,
          delivery_type: deliveryType,
          delivery_zone: deliveryZone?.name || null,
          delivery_address: address?.address || null,
          notes: notes || null,
          contact_name: contact?.name,
          contact_email: contact?.email,
          contact_phone: contact?.phone,
          subtotal: subtotalCents / 100,
          delivery_fee: deliveryFeeCents / 100,
          total: totalCents / 100,
          created_at: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.error('Supabase insert failed (non-fatal):', dbErr.message);
      }
    }

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        orderId,
        amount: totalCents,
      }),
    };

  } catch (err) {
    console.error('Payment intent error:', err.message);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
