import { useCart } from '../context/CartContext';
import { deliveryZones } from '../data/menu';

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { items, itemCount, subtotal, deliveryFee, total, deliveryType, deliveryZone,
    updateQty, removeItem, setDeliveryType, setDeliveryZone, notes, setNotes } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(28,26,20,0.4)',
          zIndex: 200, opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
        background: '#FAFAF5', zIndex: 201,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(28,26,20,0.12)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #EDE9E3',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff',
        }}>
          <div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: '#1C1A14', margin: 0 }}>
              Tu pedido
            </h2>
            {itemCount > 0 && (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#9A8F85', margin: '2px 0 0' }}>
                {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
              </p>
            )}
          </div>
          <button onClick={onClose} style={{
            background: '#F5F1EC', border: 'none', borderRadius: '50%',
            width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#7A6E63',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>

          {itemCount === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9A8F85' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: '#1C1A14', marginBottom: 8 }}>
                Tu carrito está vacío
              </p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, lineHeight: 1.6 }}>
                Añade algunos platos de nuestra carta para empezar tu pedido.
              </p>
            </div>
          ) : (
            <>
              {/* Items */}
              <div style={{ marginBottom: 20 }}>
                {items.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
                    borderBottom: '1px solid #F0EDE8',
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 10,
                      background: 'linear-gradient(135deg, #2A1005, #7C2D0C)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22, flexShrink: 0,
                    }}>
                      {item.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, color: '#1C1A14', margin: 0 }}>
                        {item.name}
                      </p>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#9A8F85', margin: '1px 0 0' }}>
                        €{item.price % 1 === 0 ? item.price : item.price.toFixed(2)} / ud.
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => updateQty(item.id, item.qty - 1)} style={{
                        width: 26, height: 26, border: '1px solid #D4CFC9', background: '#fff',
                        borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, color: '#7A6E63', fontWeight: 500,
                      }}>−</button>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, color: '#1C1A14', minWidth: 16, textAlign: 'center' }}>
                        {item.qty}
                      </span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} style={{
                        width: 26, height: 26, border: 'none', background: '#1C1A14',
                        borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, color: '#fff', fontWeight: 500,
                      }}>+</button>
                    </div>
                    <span style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 600, color: '#1C1A14', minWidth: 48, textAlign: 'right' }}>
                      €{(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery type */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500, color: '#1C1A14', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Tipo de entrega
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[{ id: 'delivery', label: '🛵 A domicilio' }, { id: 'pickup', label: '🏪 Recogida' }].map(opt => (
                    <button key={opt.id} onClick={() => setDeliveryType(opt.id)} style={{
                      padding: '10px 12px', border: '1.5px solid',
                      borderColor: deliveryType === opt.id ? '#ffd43a' : '#D4CFC9',
                      borderRadius: 10, background: deliveryType === opt.id ? '#FEF3EE' : '#fff',
                      cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                      fontSize: 13, fontWeight: deliveryType === opt.id ? 500 : 400,
                      color: deliveryType === opt.id ? '#ffd43a' : '#7A6E63',
                      transition: 'all 0.15s ease',
                    }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zone selector */}
              {deliveryType === 'delivery' && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500, color: '#1C1A14', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Tu zona en Zaragoza
                  </p>
                  <select
                    value={deliveryZone?.name || ''}
                    onChange={e => {
                      const z = deliveryZones.find(z => z.name === e.target.value);
                      setDeliveryZone(z || null);
                    }}
                    style={{
                      width: '100%', padding: '10px 12px', border: '1px solid #D4CFC9',
                      borderRadius: 10, background: '#fff', fontFamily: "'Outfit', sans-serif",
                      fontSize: 13, color: '#1C1A14', cursor: 'pointer',
                    }}
                  >
                    <option value="">Selecciona tu zona...</option>
                    {deliveryZones.map(z => (
                      <option key={z.name} value={z.name}>{z.name} — {z.eta}</option>
                    ))}
                  </select>
                  {deliveryZone && (
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#1a7a4a', marginTop: 6 }}>
                      ✓ Entrega estimada: {deliveryZone.eta}
                    </p>
                  )}
                </div>
              )}

              {/* Notes */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500, color: '#1C1A14', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Notas del pedido
                </p>
                <textarea
                  placeholder="Alergias, punto de la carne, instrucciones de entrega..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #D4CFC9',
                    borderRadius: 10, background: '#fff', fontFamily: "'Outfit', sans-serif",
                    fontSize: 13, color: '#1C1A14', resize: 'vertical', boxSizing: 'border-box',
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer / totals */}
        {itemCount > 0 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #EDE9E3', background: '#fff' }}>
            <div style={{ marginBottom: 12 }}>
              {[
                { label: 'Subtotal', value: `€${subtotal.toFixed(2)}` },
                { label: 'Envío', value: deliveryType === 'pickup' ? 'Gratis (recogida)' : deliveryZone ? `€${deliveryFee.toFixed(2)}` : 'Selecciona zona' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#7A6E63' }}>{row.label}</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#1C1A14', fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #EDE9E3', marginTop: 6 }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, color: '#1C1A14' }}>Total</span>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, color: '#ffd43a' }}>
                  €{(deliveryType === 'delivery' && deliveryZone ? total : subtotal).toFixed(2)}
                </span>
              </div>
            </div>
            <button
              onClick={onCheckout}
              disabled={deliveryType === 'delivery' && !deliveryZone}
              style={{
                width: '100%', padding: '14px', background: '#1C1A14', color: '#fff',
                border: 'none', borderRadius: 12, fontFamily: "'Outfit', sans-serif",
                fontSize: 15, fontWeight: 500, cursor: 'pointer',
                opacity: (deliveryType === 'delivery' && !deliveryZone) ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              Ir al pago → €{(deliveryType === 'delivery' && deliveryZone ? total : subtotal).toFixed(2)}
            </button>
            {deliveryType === 'delivery' && !deliveryZone && (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#ffd43a', textAlign: 'center', marginTop: 8 }}>
                Selecciona tu zona para continuar
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
