import { useState, useEffect, useMemo } from 'react';
import { products as initialProducts, packs as initialPacks, categories } from '../data/menu';
import { db } from '../lib/supabase';

// ── Mock orders for demo ───────────────────────────────────────────────────────
const mockOrders = [
  { id:'OMG-K4X9A', customer:'Carlos Martínez', phone:'+34 612 345 678', email:'carlos@email.com', items:[{name:'Chuletón de buey',qty:1,price:48},{name:'Chimichurri artesano',qty:2,price:3.5}], total:55, deliveryType:'delivery', zone:'Centro / Casco Histórico', address:'Calle Mayor 12, 2ºB', notes:'Poco hecho por favor', status:'pending', createdAt: new Date(Date.now()-8*60000) },
  { id:'OMG-M2P1B', customer:'Ana García', phone:'+34 654 987 321', email:'ana@email.com', items:[{name:'Pack Familiar',qty:1,price:62}], total:64.5, deliveryType:'delivery', zone:'Delicias / Arrabal', address:'Av. Madrid 45, 1ºA', notes:'', status:'preparing', createdAt: new Date(Date.now()-22*60000) },
  { id:'OMG-R7L3C', customer:'Luis Torres', phone:'+34 698 111 222', email:'luis@email.com', items:[{name:'Pollo de corral',qty:2,price:18},{name:'Patatas a las brasas',qty:1,price:8}], total:44, deliveryType:'pickup', zone:'', address:'', notes:'Alérgico al gluten', status:'ready', createdAt: new Date(Date.now()-35*60000) },
  { id:'OMG-T5N8D', customer:'María López', phone:'+34 677 333 444', email:'maria@email.com', items:[{name:'Entrecot Angus',qty:1,price:32},{name:'Pack Pareja',qty:1,price:38}], total:70, deliveryType:'delivery', zone:'Las Fuentes / San José', address:'C/ Valencia 8, 3ºC', notes:'', status:'delivered', createdAt: new Date(Date.now()-95*60000) },
  { id:'OMG-V9Q2E', customer:'Pedro Ruiz', phone:'+34 611 555 666', email:'pedro@email.com', items:[{name:'Pack Carnívoro',qty:1,price:52}], total:55.5, deliveryType:'delivery', zone:'Oliver / Valdefierro', address:'Calle Boggiero 22', notes:'Sin chimichurri', status:'delivered', createdAt: new Date(Date.now()-140*60000) },
];

const STATUS_CONFIG = {
  pending:   { label:'Nuevo',      color:'#EF9F27', bg:'#FAEEDA', next:'preparing', nextLabel:'Aceptar' },
  preparing: { label:'Preparando', color:'#FFD43A', bg:'#E6F1FB', next:'ready',     nextLabel:'Listo para entrega' },
  ready:     { label:'Listo',      color:'#FFD43A', bg:'#2A1A00', next:'delivered', nextLabel:'Marcar entregado' },
  delivered: { label:'Entregado',  color:'#888780', bg:'#F1EFE8', next:null,        nextLabel:null },
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function timeAgo(date) {
  const mins = Math.floor((Date.now() - date) / 60000);
  if (mins < 1) return 'Ahora mismo';
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  return `Hace ${hrs}h ${mins % 60}min`;
}

function Badge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return <span style={{ background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>{cfg.label}</span>;
}

// ── Login screen ───────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const handle = () => {
    if (pw === 'omg2025') { onLogin(); setError(false); }
    else { setError(true); setTimeout(() => setError(false), 2000); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0C0A06', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#FFFFFF', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '48px 40px', width: '100%', maxWidth: 380, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>🔥</div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 600, color: '#0F0800', margin: '0 0 6px' }}>Panel de administración</h1>
        <p style={{ fontSize: 13, color: 'rgba(15,8,0,0.4)', margin: '0 0 32px' }}>OhMyGrill Brasas · Zaragoza</p>
        <input
          type="password" placeholder="Contraseña"
          value={pw} onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handle()}
          style={{ width: '100%', padding: '13px 16px', background: '#F5F0E8', border: `1.5px solid ${error ? '#E24B4A' : 'rgba(255,255,255,0.1)'}`, borderRadius: 12, color: '#0F0800', fontFamily: "'Outfit', sans-serif", fontSize: 15, marginBottom: 12, boxSizing: 'border-box', outline: 'none', textAlign: 'center', letterSpacing: '4px' }}
        />
        {error && <p style={{ fontSize: 12, color: '#E24B4A', marginBottom: 12 }}>Contraseña incorrecta</p>}
        <button onClick={handle} style={{ width: '100%', background: '#FFD43A', color: '#0F0800', border: 'none', borderRadius: 12, padding: '13px', fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
          Entrar →
        </button>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 20 }}>Contraseña demo: omg2025</p>
      </div>
    </div>
  );
}

// ── Order card ─────────────────────────────────────────────────────────────────
function OrderCard({ order, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status];

  return (
    <div style={{ background: '#fff', border: `1px solid ${order.status === 'pending' ? '#EF9F27' : '#2A1A00'}`, borderRadius: 16, overflow: 'hidden', transition: 'box-shadow 0.2s', boxShadow: order.status === 'pending' ? '0 0 0 3px rgba(239,159,39,0.15)' : 'none' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderBottom: expanded ? '1px solid rgba(15,8,0,0.12)' : 'none' }} onClick={() => setExpanded(!expanded)}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 600, color: '#0F0800' }}>{order.id}</span>
            <Badge status={order.status} />
            {order.status === 'pending' && <span style={{ fontSize: 10, background: '#FFD43A', color: '#0F0800', padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>NUEVO</span>}
          </div>
          <p style={{ fontSize: 13, color: 'rgba(15,8,0,0.45)', margin: '3px 0 0' }}>{order.customer} · {timeAgo(order.createdAt)}</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: '#FFD43A', margin: 0 }}>€{order.total.toFixed(2)}</p>
          <p style={{ fontSize: 11, color: 'rgba(15,8,0,0.45)', margin: '2px 0 0' }}>{order.deliveryType === 'pickup' ? '🏪 Recogida' : '🛵 Entrega'}</p>
        </div>
        <span style={{ fontSize: 16, color: 'rgba(15,8,0,0.45)', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: '16px 18px' }}>
          {/* Items */}
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 11, letterSpacing: '1.5px', color: 'rgba(15,8,0,0.45)', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 8px' }}>Artículos</p>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0', borderBottom: '1px solid #1A1000' }}>
                <span style={{ color: '#0F0800' }}>{item.qty}× {item.name}</span>
                <span style={{ color: 'rgba(15,8,0,0.45)', fontWeight: 500 }}>€{(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Delivery info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[
              { label: 'Cliente', val: order.customer },
              { label: 'Teléfono', val: order.phone },
              { label: 'Tipo', val: order.deliveryType === 'pickup' ? 'Recogida en local' : 'Entrega a domicilio' },
              { label: 'Zona', val: order.zone || '—' },
            ].map(item => (
              <div key={item.label}>
                <p style={{ fontSize: 11, color: 'rgba(15,8,0,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 2px' }}>{item.label}</p>
                <p style={{ fontSize: 13, color: '#0F0800', margin: 0 }}>{item.val}</p>
              </div>
            ))}
          </div>

          {order.address && (
            <div style={{ background: '#FFFFFF', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: 'rgba(15,8,0,0.45)', margin: '0 0 2px' }}>📍 Dirección</p>
              <p style={{ fontSize: 13, color: '#0F0800', margin: 0 }}>{order.address}</p>
            </div>
          )}

          {order.notes && (
            <div style={{ background: '#F5F0E8', border: '1px solid rgba(15,8,0,0.12)', borderRadius: 10, padding: '10px 12px', marginBottom: 14 }}>
              <p style={{ fontSize: 11, color: '#FFD43A', margin: '0 0 2px', fontWeight: 600 }}>📝 Notas</p>
              <p style={{ fontSize: 13, color: 'rgba(15,8,0,0.45)', margin: 0 }}>{order.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            {cfg.next && (
              <button onClick={() => onStatusChange(order.id, cfg.next)} style={{ flex: 1, background: '#FFFFFF', color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                {cfg.nextLabel} →
              </button>
            )}
            <a href={`tel:${order.phone}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#F5F0E8', color: '#FFD43A', border: 'none', borderRadius: 10, padding: '11px 16px', fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}>
              📞 Llamar
            </a>
            <a href={`https://wa.me/${order.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#F5F0E8', color: '#FFD43A', border: 'none', borderRadius: 10, padding: '11px 16px', fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}>
              💬 WA
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Menu editor ────────────────────────────────────────────────────────────────
function MenuEditor() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    db.getMenu()
      .then(data => { if (data && data.length > 0) setMenuItems(data.map(d => ({...d, badgeColor: d.badge_color}))); else setMenuItems(initialProducts); })
      .catch(() => { try { const s = localStorage.getItem("omg_menu"); setMenuItems(s ? JSON.parse(s) : initialProducts); } catch(e) { setMenuItems(initialProducts); } })
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id) => {
    const item = menuItems.find(i => i.id === id);
    const newVal = !item.available;
    // Optimistic update
    setMenuItems(items => items.map(i => i.id === id ? { ...i, available: newVal } : i));
    db.updateItem(id, { available: newVal }).catch(console.error);
    setMenuItems(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, available: newVal } : i);
      localStorage.setItem('omg_menu', JSON.stringify(updated));
      return updated;
    });
  };

  const handlePriceChange = (id, price) => {
    setMenuItems(items => items.map(i => i.id === id ? { ...i, price: parseFloat(price) || i.price } : i));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      // Upsert all items at once
      await db.saveMenu(menuItems);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err.message || 'Error al guardar. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const grouped = menuItems.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  const catLabels = { carnes: 'Carnes', aves: 'Aves', verduras: 'Verduras', salsas: 'Salsas y extras' };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '48px 20px', color: 'rgba(15,8,0,0.45)' }}>
      <div style={{ width: 32, height: 32, border: '3px solid #2A1A00', borderTopColor: '#FFD43A', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14 }}>Cargando carta desde Supabase...</p>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: '#0F0800', margin: 0 }}>Editor de carta</h3>
          <p style={{ fontSize: 13, color: 'rgba(15,8,0,0.45)', margin: '3px 0 0' }}>Activa/desactiva platos y actualiza precios</p>
        </div>
<div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {saveError && <p style={{ fontSize:12, color:'#E24B4A', margin:0 }}>{saveError}</p>}
          <button onClick={handleSave} disabled={saving} style={{ background: '#FFD43A', color: '#0F0800', border: 'none', borderRadius: 10, padding: '10px 20px', fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s', display:'flex', alignItems:'center', gap:6 }}>
            {saving ? <><span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite', display:'inline-block' }} />Guardando...</> : saved ? '✓ Guardado en Supabase' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 28 }}>
          <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, color: '#0F0800', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
            {catLabels[cat]}
            <span style={{ width: 32, height: 1, background: '#F5F0E8', display: 'inline-block' }} />
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(item => (
              <div key={item.id} style={{ background: item.available ? '#fff' : '#1A1000', border: '1px solid rgba(15,8,0,0.12)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, opacity: item.available ? 1 : 0.6 }}>
                <span style={{ fontSize: 22 }}>{item.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#0F0800', margin: 0 }}>{item.name}</p>
                  <p style={{ fontSize: 11, color: 'rgba(15,8,0,0.45)', margin: '1px 0 0' }}>{item.weight}</p>
                </div>
                {/* Price editor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 13, color: 'rgba(15,8,0,0.45)' }}>€</span>
                  <input
                    type="number" step="0.5" min="0"
                    value={item.price}
                    onChange={e => handlePriceChange(item.id, e.target.value)}
                    style={{ width: 64, padding: '6px 8px', border: '1.5px solid #2A1A00', borderRadius: 8, fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500, color: '#0F0800', textAlign: 'center', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#FFD43A'}
                    onBlur={e => e.target.style.borderColor = '#2A1A00'}
                  />
                </div>
                {/* Toggle */}
                <button onClick={() => handleToggle(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: item.available ? '#FFD43A' : '#2A1A00', border: 'none', borderRadius: 20, padding: '6px 12px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500, color: item.available ? '#0F0800' : 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.available ? '#0F0800' : 'rgba(255,255,255,0.35)', display: 'inline-block' }} />
                  {item.available ? 'Disponible' : 'No disponible'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Stats section ──────────────────────────────────────────────────────────────
function StatsSection({ orders }) {
  const today = orders.filter(o => {
    const d = new Date(o.createdAt);
    const now = new Date();
    return d.getDate() === now.getDate();
  });

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const todayRevenue = today.reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length ? totalRevenue / orders.length : 0;
  const pending = orders.filter(o => o.status === 'pending').length;

  const stats = [
    { icon: '📦', label: 'Pedidos hoy', value: today.length, sub: `${orders.length} en total`, color: '#FFD43A' },
    { icon: '💶', label: 'Ingresos hoy', value: `€${todayRevenue.toFixed(0)}`, sub: `€${totalRevenue.toFixed(0)} total`, color: '#FFD43A' },
    { icon: '🧾', label: 'Ticket medio', value: `€${avgOrder.toFixed(0)}`, sub: 'Por pedido', color: '#FFD43A' },
    { icon: '🔔', label: 'Pendientes', value: pending, sub: 'Sin confirmar', color: pending > 0 ? '#EF9F27' : '#888780' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 24 }}>
      {stats.map(s => (
        <div key={s.label} style={{ background: '#fff', border: '1px solid rgba(15,8,0,0.12)', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>{s.icon}</span>
            <span style={{ fontSize: 11, color: 'rgba(15,8,0,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</span>
          </div>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 600, color: s.color, margin: '0 0 3px', lineHeight: 1 }}>{s.value}</p>
          <p style={{ fontSize: 12, color: 'rgba(15,8,0,0.45)', margin: 0 }}>{s.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ── Main Admin Page ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('omg_admin') === 'true');
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState(mockOrders);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Load real orders from Supabase when authed
  useEffect(() => {
    if (!authed) return;
    setOrdersLoading(true);
    db.getOrders()
      .then(data => {
        if (data && data.length > 0) {
          setOrders(data.map(o => ({
            id: o.id,
            customer: o.customer_name,
            phone: o.customer_phone || '+34 976 000 000',
            email: o.customer_email,
            items: o.items || [],
            total: parseFloat(o.total),
            deliveryType: o.delivery_type,
            zone: o.delivery_zone || '',
            address: o.address || '',
            notes: o.notes || '',
            status: o.status,
            createdAt: new Date(o.created_at),
          })));
        }
        setOrdersLoading(false);
      }).catch(() => setOrdersLoading(false));

    // Realtime: poll every 30s for new orders
    const interval = setInterval(() => {
      db.getOrders().then(data => {
        if (data && data.length > 0) {
          setOrders(data.map(o => ({
            id: o.id, customer: o.customer_name, phone: o.customer_phone || '+34 976 000 000',
            email: o.customer_email, items: o.items || [], total: parseFloat(o.total),
            deliveryType: o.delivery_type, zone: o.delivery_zone || '',
            address: o.address || '', notes: o.notes || '',
            status: o.status, createdAt: new Date(o.created_at),
          })));
        }
      }).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [authed]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem('omg_admin', 'true');
    setAuthed(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('omg_admin');
    setAuthed(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    await db.updateOrder(id, { status: newStatus }).catch(console.error);
  };

  const filteredOrders = useMemo(() => {
    if (filterStatus === 'all') return orders;
    return orders.filter(o => o.status === filterStatus);
  }, [orders, filterStatus]);

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  if (!authed) return <AdminLogin onLogin={handleLogin} />;

  const tabs = [
    { id: 'orders', label: 'Pedidos', badge: pendingCount > 0 ? pendingCount : null },
    { id: 'menu', label: 'Carta' },
    { id: 'stats', label: 'Estadísticas' },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#F5F0E8', minHeight: '100vh' }}>

      {/* Top bar */}
      <div style={{ background: '#FFFFFF', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🔥</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, color: '#0F0800' }}>OhMyGrill</span>
          <span style={{ fontSize: 11, color: 'rgba(15,8,0,0.35)', background: '#F5F0E8', padding: '2px 8px', borderRadius: 10 }}>Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {pendingCount > 0 && (
            <span style={{ background: '#FFD43A', color: '#0F0800', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>
              {pendingCount} nuevo{pendingCount > 1 ? 's' : ''}
            </span>
          )}
          <button onClick={handleLogout} style={{ background: '#F5F0E8', color: 'rgba(255,255,255,0.6)', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: 12 }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(15,8,0,0.12)', padding: '0 20px', display: 'flex', gap: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '14px 16px', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: tab === t.id ? 500 : 400, color: tab === t.id ? '#FFD43A' : 'rgba(255,255,255,0.45)', borderBottom: `2px solid ${tab === t.id ? '#FFD43A' : 'transparent'}`, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            {t.label}
            {t.badge && <span style={{ background: '#0F0800', color: '#FFFFFF', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.badge}</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <div>
            <StatsSection orders={orders} />

            {/* Filter bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
              {[{ id: 'all', label: 'Todos' }, ...Object.entries(STATUS_CONFIG).map(([id, cfg]) => ({ id, label: cfg.label }))].map(f => (
                <button key={f.id} onClick={() => setFilterStatus(f.id)} style={{ background: filterStatus === f.id ? '#FFD43A' : '#1A1000', color: filterStatus === f.id ? '#0F0800' : 'rgba(255,255,255,0.45)', border: '1px solid rgba(15,8,0,0.12)', borderRadius: 20, padding: '7px 16px', fontFamily: "'Outfit', sans-serif", fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {f.label} {f.id !== 'all' && <span style={{ opacity: 0.6 }}>({orders.filter(o => o.status === f.id).length})</span>}
                </button>
              ))}
            </div>

            {/* Orders list */}
            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(15,8,0,0.45)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <p style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: '#0F0800', marginBottom: 6 }}>Sin pedidos</p>
                <p style={{ fontSize: 13 }}>No hay pedidos con este filtro</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filteredOrders
                  .sort((a, b) => {
                    const order = ['pending','preparing','ready','delivered'];
                    return order.indexOf(a.status) - order.indexOf(b.status);
                  })
                  .map(order => (
                    <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ── MENU TAB ── */}
        {tab === 'menu' && (
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(15,8,0,0.12)', padding: isMobile ? '24px 20px' : '32px' }}>
            <MenuEditor />
          </div>
        )}

        {/* ── STATS TAB ── */}
        {tab === 'stats' && (
          <div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: '#0F0800', margin: '0 0 20px' }}>Resumen de actividad</h3>

            {orders.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(15,8,0,0.45)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
                <p style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: '#0F0800', marginBottom: 6 }}>Sin datos todavía</p>
                <p style={{ fontSize: 13 }}>Las estadísticas aparecerán cuando haya pedidos completados.</p>
              </div>
            )}

            {orders.length > 0 && <>
            {/* Revenue by zone */}
            <div style={{ background: '#fff', border: '1px solid rgba(15,8,0,0.12)', borderRadius: 20, padding: '24px', marginBottom: 16 }}>
              <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, color: '#0F0800', margin: '0 0 16px' }}>Ingresos por zona</h4>
              {Object.entries(
                orders.reduce((acc, o) => {
                  const zone = o.zone || 'Recogida en local';
                  acc[zone] = (acc[zone] || 0) + o.total;
                  return acc;
                }, {})
              ).sort((a, b) => b[1] - a[1]).map(([zone, rev]) => {
                const zoneRevs = Object.values(orders.reduce((acc,o) => { const z=o.zone||'Recogida en local'; acc[z]=(acc[z]||0)+o.total; return acc; }, {}));
                const maxRev = zoneRevs.length > 0 ? Math.max(...zoneRevs) : 1;
                const pct = (rev / maxRev) * 100;
                return (
                  <div key={zone} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: '#0F0800' }}>{zone}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#FFD43A' }}>€{rev.toFixed(0)}</span>
                    </div>
                    <div style={{ height: 6, background: '#F5F0E8', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: '#FFD43A', borderRadius: 3, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top products */}
            <div style={{ background: '#fff', border: '1px solid rgba(15,8,0,0.12)', borderRadius: 20, padding: '24px' }}>
              <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, color: '#0F0800', margin: '0 0 16px' }}>Platos más pedidos</h4>
              {Object.entries(
                orders.flatMap(o => o.items).reduce((acc, item) => {
                  acc[item.name] = (acc[item.name] || 0) + item.qty;
                  return acc;
                }, {})
              ).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, qty], i) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < 5 ? '1px solid #1A1000' : 'none' }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, color: 'rgba(15,8,0,0.45)', minWidth: 20 }}>{i + 1}</span>
                  <span style={{ fontSize: 13, color: '#0F0800', flex: 1 }}>{name}</span>
                  <span style={{ background: '#F5F0E8', color: '#FFD43A', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{qty} uds</span>
                </div>
              ))}
            </div>
            </>}
          </div>
        )}
      </div>
    </div>
  );
}
