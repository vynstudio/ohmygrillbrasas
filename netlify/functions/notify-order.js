// WhatsApp order notifications via Twilio
// Called internally by create-payment-intent after successful PI creation

const TWILIO_SID   = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM  = 'whatsapp:+14155238886';

const NOTIFY_NUMBERS = [
  'whatsapp:+13217580094',   // Diler
  'whatsapp:+34631089479',   // Yoana
];

async function sendWhatsApp(to, message) {
  const body = new URLSearchParams({
    To: to,
    From: TWILIO_FROM,
    Body: message,
  });

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    }
  );
  return res.json();
}

exports.sendOrderNotification = async (order) => {
  if (!TWILIO_SID || !TWILIO_TOKEN) return;

  const { orderId, items, total, deliveryType, deliveryZone, contact, address } = order;

  const itemsList = items.map(i => `  • ${i.qty}× ${i.name} — €${(i.price*i.qty).toFixed(2)}`).join('\n');
  const delivery  = deliveryType === 'pickup'
    ? '🏪 Recogida en local'
    : `🛵 Entrega · ${deliveryZone?.name || ''}\n  📍 ${address?.address || ''}, ${address?.postal || ''}`;

  const msg = `🔥 *NUEVO PEDIDO — OhMyGrill*

📦 *${orderId}*
👤 ${contact?.name} · ${contact?.phone}

${itemsList}

💰 *Total: €${total.toFixed(2)}*
${delivery}

⏱ Confirma el pedido en el panel de admin.`;

  const results = await Promise.allSettled(
    NOTIFY_NUMBERS.map(n => sendWhatsApp(n, msg))
  );

  results.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`WhatsApp to ${NOTIFY_NUMBERS[i]} failed:`, r.reason);
    else if (r.value?.error_code) console.error(`Twilio error to ${NOTIFY_NUMBERS[i]}:`, r.value.message);
    else console.log(`WhatsApp sent to ${NOTIFY_NUMBERS[i]}: ${r.value?.sid}`);
  });
};
