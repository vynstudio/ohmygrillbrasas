import { useState, useEffect, useRef } from 'react';

const STAGES = [
  { id: 'confirmed',  icon: '✅', label: 'Pedido confirmado',   desc: 'Hemos recibido tu pedido y lo estamos revisando.' },
  { id: 'preparing',  icon: '🔥', label: 'Preparando en brasa', desc: 'Tu pedido está en la brasa. La magia está pasando.' },
  { id: 'ready',      icon: '📦', label: 'Listo para salir',    desc: 'Tu pedido está listo y empaquetado.' },
  { id: 'on_the_way', icon: '🛵', label: 'En camino',           desc: 'Tu pedido va de camino. ¡Prepara la mesa!' },
  { id: 'delivered',  icon: '🏠', label: 'Entregado',           desc: '¡Que lo disfrutes! Esperamos que esté perfecto.' },
];

const PICKUP_STAGES = [
  { id: 'confirmed',  icon: '✅', label: 'Pedido confirmado',   desc: 'Hemos recibido tu pedido.' },
  { id: 'preparing',  icon: '🔥', label: 'Preparando en brasa', desc: 'Tu pedido está en la brasa.' },
  { id: 'ready',      icon: '📦', label: 'Listo para recoger',  desc: '¡Tu pedido está listo! Puedes venir a recogerlo.' },
  { id: 'delivered',  icon: '✨', label: 'Recogido',            desc: '¡Gracias! Esperamos verte pronto.' },
];

// Mock order data — in production fetched from Supabase by order ID
const mockOrders = {
  'OMG-K4X9A': {
    id: 'OMG-K4X9A',
    customer: 'Carlos Martínez',
    items: [{ name: 'Chuletón de buey', qty: 1, price: 48, emoji: '🥩' }, { name: 'Chimichurri artesano', qty: 2, price: 3.5, emoji: '🫙' }],
    total: 55,
    deliveryType: 'delivery',
    zone: 'Centro / Casco Histórico',
    address: 'Calle Mayor 12, 2ºB',
    eta: '30–45 min',
    status: 'preparing',
    createdAt: new Date(Date.now() - 12 * 60000),
    phone: '+34 976 000 000',
  },
  'OMG-R7L3C': {
    id: 'OMG-R7L3C',
    customer: 'Luis Torres',
    items: [{ name: 'Pollo de corral', qty: 2, price: 18, emoji: '🍗' }, { name: 'Patatas a las brasas', qty: 1, price: 8, emoji: '🥔' }],
    total: 44,
    deliveryType: 'pickup',
    zone: '',
    address: '',
    eta: '~25 min',
    status: 'ready',
    createdAt: new Date(Date.now() - 28 * 60000),
    phone: '+34 976 000 000',
  },
};

function TimeAgo({ date }) {
  const [label, setLabel] = useState('');
  useEffect(() => {
    const update = () => {
      const mins = Math.floor((Date.now() - date) / 60000);
      if (mins < 1) setLabel('Hace un momento');
      else if (mins < 60) setLabel(`Hace ${mins} min`);
      else setLabel(`Hace ${Math.floor(mins / 60)}h ${mins % 60}min`);
    };
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, [date]);
  return <span>{label}</span>;
}

function ProgressBar({ stages, currentStatus }) {
  const currentIdx = stages.findIndex(s => s.id === currentStatus);

  return (
    <div style={{ padding: '8px 0 4px' }}>
      {stages.map((stage, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        const upcoming = idx > currentIdx;

        return (
          <div key={stage.id} style={{ display: 'flex', gap: 16, marginBottom: idx < stages.length - 1 ? 0 : 0 }}>
            {/* Left — icon + line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: done ? '#1A1000' : active ? '#0F0800' : '#1A1000',
                border: `2px solid ${done ? '#FFD43A' : active ? '#0F0800' : '#2A1A00'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: active ? 20 : 16,
                transition: 'all 0.4s ease',
                boxShadow: active ? '0 0 0 6px rgba(28,26,20,0.08)' : 'none',
                position: 'relative',
              }}>
                {done ? (
                  <span style={{ color: '#FFD43A', fontSize: 18 }}>✓</span>
                ) : (
                  <span style={{ filter: upcoming ? 'grayscale(1) opacity(0.4)' : 'none' }}>{stage.icon}</span>
                )}
                {active && (
                  <span style={{
                    position: 'absolute', inset: -4, borderRadius: '50%',
                    border: '2px solid #FFD43A',
                    animation: 'pulse 1.8s ease-in-out infinite',
                  }} />
                )}
              </div>
              {idx < stages.length - 1 && (
                <div style={{
                  width: 2, flex: 1, minHeight: 32,
                  background: done ? '#FFD43A' : '#2A1A00',
                  margin: '4px 0',
                  transition: 'background 0.4s ease',
                }} />
              )}
            </div>

            {/* Right — text */}
            <div style={{ paddingBottom: idx < stages.length - 1 ? 28 : 0, paddingTop: 10, flex: 1 }}>
              <p style={{
                fontFamily: "'Fraunces', serif",
                fontSize: active ? 17 : 15,
                fontWeight: active ? 600 : 400,
                color: done ? '#FFD43A' : active ? '#0F0800' : 'rgba(255,255,255,0.45)',
                margin: '0 0 3px',
                transition: 'all 0.3s',
              }}>
                {stage.label}
              </p>
              {active && (
                <p style={{ fontSize: 13, color: 'rgba(15,8,0,0.45)', margin: 0, lineHeight: 1.5 }}>{stage.desc}</p>
              )}
            </div>
          </div>
        );
      })}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function OrderTrackerPage({ onNavigate }) {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const inputRef = useRef(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);

    // Auto-load from URL hash e.g. /#tracker/OMG-K4X9A
    const hash = window.location.hash;
    const match = hash.match(/tracker\/([A-Z0-9-]+)/);
    if (match) {
      setOrderId(match[1]);
      handleSearch(match[1]);
    }

    return () => window.removeEventListener('resize', fn);
  }, []);

  const handleSearch = async (id) => {
    const searchId = (id || orderId).trim().toUpperCase();
    if (!searchId) { setError('Introduce el número de pedido'); return; }
    setLoading(true);
    setError('');
    setOrder(null);

    await new Promise(r => setTimeout(r, 800)); // simulate API call

    // In production: const res = await fetch(`/api/order/${searchId}`)
    const found = mockOrders[searchId];
    if (found) {
      setOrder(found);
      window.location.hash = `tracker/${searchId}`;
    } else {
      setError('Pedido no encontrado. Comprueba el número e inténtalo de nuevo.');
    }
    setLoading(false);
  };

  const stages = order?.deliveryType === 'pickup' ? PICKUP_STAGES : STAGES;
  const currentStageIdx = order ? stages.findIndex(s => s.id === order.status) : -1;
  const isDelivered = order?.status === 'delivered';
  const isReady = order?.status === 'ready' && order?.deliveryType === 'pickup';

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#FAF5EC', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#FAF5EC', padding: isMobile ? '48px 20px 40px' : '64px 0 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -20, right: -10, fontFamily: "'Fraunces', serif", fontSize: 160, fontWeight: 900, color: 'rgba(255,255,255,0.025)', lineHeight: 1, userSelect: 'none' }}>TRACK</div>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: isMobile ? '0' : '0 24px', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? 32 : 44, fontWeight: 600, color: '#0F0800', margin: '0 0 10px', letterSpacing: '-1px' }}>
            Seguimiento de pedido
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(15,8,0,0.45)', margin: '0 0 28px', lineHeight: 1.6 }}>
            Introduce tu número de pedido para ver el estado en tiempo real.
          </p>

          {/* Search bar */}
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="OMG-K4X9A"
              value={orderId}
              onChange={e => setOrderId(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              style={{
                flex: 1, padding: '13px 16px',
                background: '#FAF5EC',
                border: '1.5px solid rgba(255,255,255,0.12)',
                borderRadius: 0, color: '#0F0800',
                fontFamily: "'Outfit', sans-serif",
                fontSize: 16, letterSpacing: '2px',
                outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#FFD43A'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              style={{
                background: '#FFD43A',
                color: '#fff', border: 'none', borderRadius: 0,
                padding: '13px 24px', fontFamily: "'Outfit', sans-serif",
                fontSize: 14, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8,
                whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              {loading ? (
                <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : 'Buscar →'}
            </button>
          </div>
          {error && <p style={{ fontSize: 13, color: 'rgba(15,8,0,0.5)', marginTop: 10 }}>⚠️ {error}</p>}

          {/* Demo hint */}
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 12 }}>
            Demo: prueba con <span style={{ cursor: 'pointer', textDecoration: 'underline', color: 'rgba(15,8,0,0.4)' }} onClick={() => { setOrderId('OMG-K4X9A'); handleSearch('OMG-K4X9A'); }}>OMG-K4X9A</span> o <span style={{ cursor: 'pointer', textDecoration: 'underline', color: 'rgba(15,8,0,0.4)' }} onClick={() => { setOrderId('OMG-R7L3C'); handleSearch('OMG-R7L3C'); }}>OMG-R7L3C</span>
          </p>
        </div>
      </div>

      {/* Order result */}
      {order && (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: isMobile ? '28px 20px' : '40px 24px' }}>

          {/* Status hero card */}
          <div style={{
            background: isDelivered ? '#1A1000' : isReady ? '#1A1000' : '#fff',
            border: `1px solid ${isDelivered ? '#FFD43A' : isReady ? '#FFD43A' : '#2A1A00'}`,
            borderRadius: 0, padding: '24px', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{ fontSize: 44, flexShrink: 0 }}>
              {stages[currentStageIdx]?.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, color: '#FFD43A', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 4px' }}>
                {order.id}
              </p>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 900, color: isDelivered ? '#FFD43A' : '#0F0800', margin: '0 0 4px' }}>
                {stages[currentStageIdx]?.label}
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(15,8,0,0.45)', margin: 0 }}>
                {order.deliveryType === 'delivery'
                  ? isDelivered ? '¡Pedido entregado! Buen provecho 🍽️'
                  : `ETA: ${order.eta} · ${order.zone}`
                  : isReady ? '¡Puedes venir a recogerlo ya!'
                  : `Recogida en local · Calle de las Brasas 12`
                }
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: '#FFD43A', margin: 0 }}>€{order.total.toFixed(2)}</p>
              <p style={{ fontSize: 11, color: 'rgba(15,8,0,0.45)', margin: '3px 0 0' }}>
                <TimeAgo date={order.createdAt} />
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 20 }}>

            {/* Progress tracker */}
            <div style={{ background: '#FAF5EC', border: '2px solid rgba(15,8,0,0.15)', borderRadius: 0, padding: '24px' }}>
              <p style={{ fontSize: 11, letterSpacing: '2px', color: 'rgba(15,8,0,0.45)', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 20px' }}>Estado del pedido</p>
              <ProgressBar stages={stages} currentStatus={order.status} />
            </div>

            {/* Order summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Items */}
              <div style={{ background: '#FAF5EC', border: '2px solid rgba(15,8,0,0.15)', borderRadius: 0, padding: '20px', flex: 1 }}>
                <p style={{ fontSize: 11, letterSpacing: '2px', color: 'rgba(15,8,0,0.45)', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 12px' }}>Artículos</p>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < order.items.length - 1 ? '1px solid #1A1000' : 'none' }}>
                    <div style={{ width: 36, height: 36, background: '#1a1008', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="16" height="12" viewBox="0 0 16 12" fill="none"><rect x=".5" y=".5" width="15" height="11" stroke="rgba(255,255,255,.15)" strokeWidth="1"/><circle cx="4.5" cy="4" r="1.5" stroke="rgba(255,255,255,.15)"/><path d="M.5 9l3.5-3 3 2 3-3.5 5.5 4.5" stroke="rgba(255,255,255,.15)" strokeLinejoin="round"/></svg></div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#0F0800', margin: 0 }}>{item.qty}× {item.name}</p>
                    </div>
                    <span style={{ fontSize: 13, color: 'rgba(15,8,0,0.45)' }}>€{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(15,8,0,0.12)', marginTop: 8 }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 600, color: '#0F0800' }}>Total</span>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 600, color: '#FFD43A' }}>€{order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery info */}
              <div style={{ background: '#FAF5EC', border: '2px solid rgba(15,8,0,0.15)', borderRadius: 0, padding: '16px 18px' }}>
                <p style={{ fontSize: 11, letterSpacing: '2px', color: 'rgba(15,8,0,0.45)', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 10px' }}>
                  {order.deliveryType === 'pickup' ? 'Recogida' : 'Entrega'}
                </p>
                {order.deliveryType === 'delivery' ? (
                  <>
                    <p style={{ fontSize: 13, color: '#0F0800', fontWeight: 500, margin: '0 0 3px' }}>📍 {order.address}</p>
                    <p style={{ fontSize: 12, color: 'rgba(15,8,0,0.45)', margin: 0 }}>{order.zone}</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 13, color: '#0F0800', fontWeight: 500, margin: '0 0 3px' }}>🏪 Recogida en local</p>
                    <p style={{ fontSize: 12, color: 'rgba(15,8,0,0.45)', margin: 0 }}>Calle de las Brasas, 12 · Zaragoza</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Help bar */}
          <div style={{ background: '#FAF5EC', borderRadius: 0, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: '#0F0800', margin: '0 0 2px' }}>¿Tienes algún problema?</p>
              <p style={{ fontSize: 12, color: 'rgba(15,8,0,0.4)', margin: 0 }}>Estamos disponibles durante el horario de reparto</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a href={`tel:${order.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FAF5EC', color: '#0F0800', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0, padding: '9px 14px', fontFamily: "'Outfit', sans-serif", fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                📞 Llamar
              </a>
              <a href={`https://wa.me/34600000000`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FAF5EC', color: '#fff', border: 'none', borderRadius: 0, padding: '9px 14px', fontFamily: "'Outfit', sans-serif", fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                💬 WhatsApp
              </a>
            </div>
          </div>

          {/* New order CTA */}
          {isDelivered && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: 'rgba(15,8,0,0.45)', marginBottom: 12 }}>¿Te ha gustado? ¡Repite!</p>
              <button onClick={() => onNavigate('menu')} style={{ background: '#FFD43A', color: '#0F0800', border: 'none', borderRadius: 0, padding: '13px 28px', fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
                Hacer otro pedido →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty state — no search yet */}
      {!order && !loading && !error && (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: isMobile ? '40px 20px' : '56px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🛵</div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 600, color: '#0F0800', margin: '0 0 10px' }}>
            Encuentra tu pedido
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(15,8,0,0.45)', lineHeight: 1.65, maxWidth: 380, margin: '0 auto 28px' }}>
            El número de pedido lo encontrarás en el email de confirmación que te enviamos al hacer tu pedido.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, maxWidth: 400, margin: '0 auto' }}>
            {[
              { icon: '📧', text: 'Email de confirmación' },
              { icon: '💬', text: 'WhatsApp del local' },
              { icon: '🧾', text: 'Empieza por OMG-' },
            ].map(item => (
              <div key={item.text} style={{ background: '#FAF5EC', border: '2px solid rgba(15,8,0,0.15)', borderRadius: 0, padding: '14px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
                <p style={{ fontSize: 11, color: 'rgba(15,8,0,0.45)', margin: 0, lineHeight: 1.4 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
