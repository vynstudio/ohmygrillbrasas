const { createClient } = require('@supabase/supabase-js');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function getSupabase() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error('Supabase env vars not set');
  return createClient(url, key);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };

  // Simple password check — admin calls include the admin token
  const adminToken = event.headers['x-admin-token'] || '';
  const validToken = process.env.ADMIN_TOKEN || 'omg2025';
  if (adminToken !== validToken) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const { action, id, patch, items } = JSON.parse(event.body);
    const sb = getSupabase();

    switch (action) {

      case 'update_item': {
        // Allowed fields only — never let the client set arbitrary columns
        const safe = {};
        if (patch.price     !== undefined) safe.price     = parseFloat(patch.price);
        if (patch.available !== undefined) safe.available = Boolean(patch.available);
        if (patch.name      !== undefined) safe.name      = String(patch.name).slice(0, 100);
        if (patch.description !== undefined) safe.description = String(patch.description).slice(0, 500);
        if (patch.badge     !== undefined) safe.badge     = patch.badge ? String(patch.badge).slice(0, 50) : null;

        const { error } = await sb.from('menu_items').update(safe).eq('id', id);
        if (error) throw error;
        return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
      }

      case 'save_menu': {
        // Batch upsert — used when admin saves all changes at once
        const rows = items.map(item => ({
          id:          item.id,
          name:        String(item.name || '').slice(0, 100),
          price:       parseFloat(item.price),
          available:   Boolean(item.available),
          description: String(item.description || '').slice(0, 500),
          badge:       item.badge ? String(item.badge).slice(0, 50) : null,
          weight:      item.weight ? String(item.weight).slice(0, 50) : null,
          category:    item.category,
        }));

        const { error } = await sb.from('menu_items').upsert(rows, { onConflict: 'id' });
        if (error) throw error;
        return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, count: rows.length }) };
      }

      case 'update_order': {
        const safe = {};
        if (patch.status !== undefined) safe.status = String(patch.status);
        if (patch.notes  !== undefined) safe.notes  = String(patch.notes || '');
        safe.updated_at = new Date().toISOString();

        const { error } = await sb.from('orders').update(safe).eq('id', id);
        if (error) throw error;
        return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
      }

      default:
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: `Unknown action: ${action}` }) };
    }

  } catch (err) {
    console.error('admin-menu error:', err.message);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
