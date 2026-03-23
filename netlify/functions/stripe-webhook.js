const Stripe = require('stripe');

exports.handler = async (event) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = event.headers['stripe-signature'];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'payment_intent.succeeded') {
    const pi = stripeEvent.data.object;
    const meta = pi.metadata;

    // Log confirmed order — add Supabase insert here later
    console.log('✅ Order confirmed:', {
      orderId: meta.order_id,
      amount: (pi.amount / 100).toFixed(2),
      currency: pi.currency.toUpperCase(),
      customer: meta.contact_name,
      email: meta.contact_email,
      phone: meta.contact_phone,
      items: meta.items_summary,
      delivery: meta.delivery_type,
      zone: meta.delivery_zone,
      notes: meta.notes,
      yourCut: ((pi.amount / 100) * 0.05).toFixed(2),
      restaurantCut: ((pi.amount / 100) * 0.95).toFixed(2),
    });

    // TODO: Send confirmation email via Resend or Sendgrid
    // TODO: Send WhatsApp notification to restaurant via Twilio
    // TODO: Insert order into Supabase orders table
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
