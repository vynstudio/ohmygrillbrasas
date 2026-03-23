// Simple localStorage-based persistence
// Prices and availability saved locally, synced via URL params for now
// Supabase can be reconnected later when project is not paused

const MENU_KEY = 'omg_menu_v1';

export const db = {
  async getMenu() {
    try {
      const saved = localStorage.getItem(MENU_KEY);
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return null;
  },
  async updateItem(id, data) {
    try {
      const saved = localStorage.getItem(MENU_KEY);
      const items = saved ? JSON.parse(saved) : [];
      const idx = items.findIndex(i => i.id === id);
      if (idx >= 0) items[idx] = { ...items[idx], ...data };
      localStorage.setItem(MENU_KEY, JSON.stringify(items));
    } catch(e) {}
    return true;
  },
  async saveMenu(items) {
    localStorage.setItem(MENU_KEY, JSON.stringify(items));
    return true;
  },
  async insertOrder(order) {
    try {
      const saved = localStorage.getItem('omg_orders') || '[]';
      const orders = JSON.parse(saved);
      orders.unshift({ ...order, created_at: new Date().toISOString() });
      localStorage.setItem('omg_orders', JSON.stringify(orders));
    } catch(e) {}
    return true;
  },
  async getOrders() {
    try {
      const saved = localStorage.getItem('omg_orders');
      return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
  },
  async updateOrder(id, data) {
    try {
      const saved = localStorage.getItem('omg_orders') || '[]';
      const orders = JSON.parse(saved);
      const idx = orders.findIndex(o => o.id === id);
      if (idx >= 0) orders[idx] = { ...orders[idx], ...data };
      localStorage.setItem('omg_orders', JSON.stringify(orders));
    } catch(e) {}
    return true;
  },
};

export const supabase = null;
