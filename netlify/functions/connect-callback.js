const Stripe = require('stripe');

// Handles the redirect back from Stripe after the restaurant owner
// authorizes your platform. Exchanges the `code` for the connected
// account ID and stores it.
// GET /.netlify/functions/connect-callback?code=xxx

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const { code, error, error_description } = event.queryStringParameters || {};

  if (error) {
    console.error('OAuth denied:', error, error_description);
    return {
      statusCode: 302,
      headers: { Location: `https://ohmygrillbrasas.com/#admin?connect=denied` },
      body: '',
    };
  }

  if (!code) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing code parameter' }) };
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Exchange authorization code for the connected account's access token
    const response = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code,
    });

    const connectedAccountId = response.stripe_user_id;

    console.log('✅ Stripe Connect authorized:', {
      connectedAccountId,
      scope: response.scope,
      tokenType: response.token_type,
    });

    // In production: save connectedAccountId to Supabase so you don't
    // rely on the hardcoded acct_ value.
    // await supabase.from('settings').upsert({ key: 'stripe_connected_account', value: connectedAccountId });

    // Redirect admin back to the admin panel with success flag
    return {
      statusCode: 302,
      headers: {
        Location: `https://ohmygrillbrasas.com/#admin?connect=success&account=${connectedAccountId}`,
      },
      body: '',
    };
  } catch (err) {
    console.error('OAuth exchange error:', err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
