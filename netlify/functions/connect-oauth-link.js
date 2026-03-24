const Stripe = require('stripe');

// Generates a Stripe Connect OAuth URL so the restaurant owner can
// authorize VynStudio's platform to transfer funds to their account.
// GET /.netlify/functions/connect-oauth-link  (or /api/connect-oauth-link)

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Verify the connected account exists and check its status
    const account = await stripe.accounts.retrieve('acct_1TEHzJRv2GOBsXkm');

    const authUrl =
      `https://connect.stripe.com/oauth/authorize` +
      `?response_type=code` +
      `&client_id=${process.env.STRIPE_CLIENT_ID}` +  // your platform's client_id from Connect settings
      `&scope=read_write` +
      `&redirect_uri=${encodeURIComponent(process.env.STRIPE_OAUTH_REDIRECT_URI || 'https://ohmygrillbrasas.com/connect-callback')}` +
      `&stripe_user[email]=${encodeURIComponent(account.email || '')}` +
      `&stripe_user[country]=ES` +
      `&stripe_user[business_type]=company`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        authUrl,
        accountId: account.id,
        accountStatus: {
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled,
          detailsSubmitted: account.details_submitted,
          country: account.country,
          email: account.email,
        },
      }),
    };
  } catch (err) {
    console.error('Connect error:', err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
