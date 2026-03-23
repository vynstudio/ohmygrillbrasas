// Direct REST calls to Supabase — no SDK, no CORS issues
const URL = 'https://howkzkjipkrwnwxcavj.supabase.co/rest/v1';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhvd2t6a2ppcGtyd253eGN2YXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODgwNTMsImV4cCI6MjA4OTg2NDA1M30.zHlvqhI3mZrDn8F6Hliv5tArMnb8UakWBMrS3bH9nY0';

const headers = {
  'apikey': KEY,
  'Authorization': `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
};

export const db = {
  async getMenu() {
    const res = await fetch(`${URL}/menu_items?select=*&order=sort_order`, { headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async updateItem(id, data) {
    const res = await fetch(`${URL}/menu_items?id=eq.${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return true;
  },
  async insertOrder(order) {
    const res = await fetch(`${URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error(await res.text());
    return true;
  },
  async getOrders() {
    const res = await fetch(`${URL}/orders?select=*&order=created_at.desc`, { headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async updateOrder(id, data) {
    const res = await fetch(`${URL}/orders?id=eq.${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return true;
  },
};

// Keep supabase export for any remaining references
export const supabase = { from: () => ({ select: () => ({ order: () => ({ data: [], error: null }) }) }) };
