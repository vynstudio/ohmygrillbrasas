import { createClient } from '@supabase/supabase-js';

const SUPA_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPA_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Public anon client — read-only queries (menu, etc.)
export const supabase = (SUPA_URL && SUPA_ANON) ? createClient(SUPA_URL, SUPA_ANON) : null;

// Admin token stored in sessionStorage after login
const getToken = () => sessionStorage.getItem('omg_admin_token') || 'omg2025';

async function adminFetch(body) {
  const res = await fetch('/.netlify/functions/admin-menu', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': getToken(),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const db = {

  // ── Menu reads (anon client — public) ──────────────────────────────────────
  async getMenu() {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('menu_items')
      .select('id, name, price, available, description, badge, weight, category')
      .order('category').order('id');
    if (error) { console.error('getMenu:', error.message); return null; }
    return data?.length ? data : null;
  },

  // ── Menu writes (service key via Netlify function) ─────────────────────────
  async updateItem(id, patch) {
    return adminFetch({ action: 'update_item', id, patch });
  },

  async saveMenu(items) {
    return adminFetch({ action: 'save_menu', items });
  },

  // ── Order reads (anon client) ──────────────────────────────────────────────
  async getOrders() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) { console.error('getOrders:', error.message); return []; }
    return data || [];
  },

  // ── Order writes ───────────────────────────────────────────────────────────
  async updateOrder(id, patch) {
    return adminFetch({ action: 'update_order', id, patch });
  },

  async insertOrder() { return true; }, // handled by create-payment-intent
};
