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

    // ── Calculate amount server-side. Never trust the client. ──────────────
    const subtotalCents     = Math.round(items.reduce((s, i) => s + i.price * i.qty, 0) * 100);
    const deliveryFeeCents  = deliveryType === 'pickup' ? 0 : Math.round((deliveryZone?.deliveryFee ?? 0) * 100);
    const totalCents        = subtotalCents + deliveryFeeCents;

    if (totalCents < 100) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Pedido demasiado pequeño' }) };
    }

    const orderId     = 'OMG-' + Date.now().toString(36).toUpperCase();
    const destination = process.env.STRIPE_CONNECTED_ACCOUNT; // acct_1TEHzJRv2GOBsXkm

    // ── 5% platform fee to VynStudio, 95% to OhMyGrill ─────────────────────
    // application_fee_amount = what Vyn Studio keeps (5%)
    // Stripe automatically routes the rest (95%) to the destination account
    const applicationFeeCents = Math.round(totalCents * 0.05);

    const piParams = {
      amount:   totalCents,
      currency: 'eur',
      payment_method_types: ['card', 'link'],
      metadata: {
        order_id:           orderId,
        contact_name:       contact?.name    || '',
        contact_email:      contact?.email   || '',
        contact_phone:      contact?.phone   || '',
        delivery_type:      deliveryType     || 'delivery',
        delivery_zone:      deliveryZone?.name || '',
        delivery_address:   address?.address || '',
        notes:              notes            || '',
        items_summary:      items.map(i => `${i.qty}x ${i.name}`).join(', '),
        subtotal_eur:       (subtotalCents        / 100).toFixed(2),
        delivery_eur:       (deliveryFeeCents      / 100).toFixed(2),
        total_eur:          (totalCents            / 100).toFixed(2),
        vyn_fee_eur:        (applicationFeeCents   / 100).toFixed(2),
        restaurant_eur:     ((totalCents - applicationFeeCents) / 100).toFixed(2),
        restaurant:         'OhMyGrill Brasas',
        split:              '95% OhMyGrill / 5% VynStudio',
      },
      receipt_email: contact?.email || undefined,
      description: `OhMyGrill Brasas · ${items.length} plato${items.length !== 1 ? 's' : ''} · ${
        deliveryType === 'pickup' ? 'Recogida' : deliveryZone?.name || 'Entrega'
      }`,
    };

    // ── Stripe Connect destination charge with cross-border support ──────────
    // on_behalf_of  → makes acct_1TEHzJRv2GOBsXkm (Spain) the settlement merchant
    //                 required for cross-region charges (US platform → ES account)
    //                 uses Spanish fee structure, EUR settlement, Spanish statement descriptor
    // transfer_data → routes 95% of funds to her account automatically
    // application_fee_amount → Vyn Studio keeps this (5%)
    if (destination) {
      piParams.on_behalf_of          = destination;
      piParams.application_fee_amount = applicationFeeCents;
      piParams.transfer_data          = { destination };
    }

    const paymentIntent = await stripe.paymentIntents.create(piParams);

    // ── Save order to Supabase ───────────────────────────────────────────────
    if (process.env.VITE_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(
          process.env.VITE_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_KEY
        );
        await supabase.from('orders').insert({
          id:                       orderId,
          stripe_payment_intent_id: paymentIntent.id,
          status:                   'pending_payment',
          items:                    JSON.stringify(items),
          delivery_type:            deliveryType,
          delivery_zone:            deliveryZone?.name    || null,
          delivery_address:         address?.address      || null,
          notes:                    notes                 || null,
          contact_name:             contact?.name,
          contact_email:            contact?.email,
          contact_phone:            contact?.phone,
          subtotal:                 subtotalCents    / 100,
          delivery_fee:             deliveryFeeCents / 100,
          total:                    totalCents       / 100,
          platform_fee:             applicationFeeCents / 100,
          created_at:               new Date().toISOString(),
        });
      } catch (dbErr) {
        // Non-fatal — order still processes even if DB write fails
        console.error('Supabase insert failed:', dbErr.message);
      }
    }

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        orderId,
        amount:       totalCents,
        fee:          applicationFeeCents,
        restaurant:   totalCents - applicationFeeCents,
      }),
    };

  } catch (err) {
    console.error('PaymentIntent error:', err.message);

    // Surface Stripe-specific errors clearly
    const userMessage = err.type === 'StripeInvalidRequestError'
      ? `Error de Stripe: ${err.message}`
      : 'Error al procesar el pago. Inténtalo de nuevo.';

    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: userMessage, raw: err.message }),
    };
  }
};
