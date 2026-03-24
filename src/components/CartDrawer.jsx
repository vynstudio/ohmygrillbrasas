import { useCart } from '../context/CartContext';
import { deliveryZones } from '../data/menu';

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { items, itemCount, subtotal, deliveryFee, total, deliveryType, deliveryZone,
    updateQty, setDeliveryType, setDeliveryZone, notes, setNotes } = useCart();

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none', transition:'opacity 0.3s' }} />

      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:420, background:'#0F0800', zIndex:201, transform: open ? 'translateX(0)' : 'translateX(100%)', transition:'transform 0.35s cubic-bezier(0.4,0,0.2,1)', display:'flex', flexDirection:'column', borderLeft:'1px solid #2A1A00' }}>

        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid #2A1A00', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:600, color:'#FFFFFF', margin:0 }}>Tu pedido</h2>
            {itemCount > 0 && <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', margin:'2px 0 0' }}>{itemCount} {itemCount===1?'artículo':'artículos'}</p>}
          </div>
          <button onClick={onClose} style={{ background:'#1A1000', border:'1px solid #2A1A00', borderRadius:'50%', width:36, height:36, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.55)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px 24px' }}>
          {itemCount === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 20px' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🛒</div>
              <p style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:600, color:'#FFFFFF', marginBottom:8 }}>Carrito vacío</p>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.6 }}>Añade platos de nuestra carta para empezar.</p>
            </div>
          ) : (
            <>
              {/* Items */}
              <div style={{ marginBottom:20 }}>
                {items.map(item => (
                  <div key={item.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid #2A1A00' }}>
                    <div style={{ width:48, height:48, borderRadius:10, background:'#1A1000', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{item.emoji}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:13, fontWeight:500, color:'#FFFFFF', margin:0 }}>{item.name}</p>
                      <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', margin:'1px 0 0' }}>€{item.price%1===0?item.price:item.price.toFixed(2)} / ud.</p>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                      <button onClick={() => updateQty(item.id, item.qty-1)} style={{ width:26, height:26, border:'1px solid #2A1A00', background:'#1A1000', borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'rgba(255,255,255,0.55)', fontWeight:500 }}>−</button>
                      <span style={{ fontSize:13, fontWeight:500, color:'#FFFFFF', minWidth:16, textAlign:'center' }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty+1)} style={{ width:26, height:26, border:'none', background:'#FFD43A', borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'#0F0800', fontWeight:700 }}>+</button>
                    </div>
                    <span style={{ fontFamily:"'Fraunces',serif", fontSize:15, fontWeight:600, color:'#FFD43A', minWidth:48, textAlign:'right' }}>€{(item.price*item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Delivery toggle */}
              <div style={{ marginBottom:16 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:8, textTransform:'uppercase', letterSpacing:'1px' }}>Entrega</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {[{id:'delivery',label:'🛵 A domicilio'},{id:'pickup',label:'🏪 Recogida'}].map(opt => (
                    <button key={opt.id} onClick={() => setDeliveryType(opt.id)} style={{ padding:'10px 12px', border:`1.5px solid ${deliveryType===opt.id?'#FFD43A':'#2A1A00'}`, borderRadius:10, background: deliveryType===opt.id?'#FFD43A':'#1A1000', cursor:'pointer', fontSize:13, fontWeight:700, color: deliveryType===opt.id?'#0F0800':'rgba(255,255,255,0.55)', transition:'all 0.15s' }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {deliveryType==='delivery' && (
                <div style={{ marginBottom:16 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:8, textTransform:'uppercase', letterSpacing:'1px' }}>Zona Zaragoza</p>
                  <select value={deliveryZone?.name||''} onChange={e => setDeliveryZone(deliveryZones.find(z=>z.name===e.target.value)||null)} style={{ width:'100%', padding:'10px 12px', border:'1px solid #2A1A00', borderRadius:10, background:'#1A1000', color:'#FFFFFF', fontSize:13, cursor:'pointer' }}>
                    <option value="">Selecciona tu zona...</option>
                    {deliveryZones.map(z => <option key={z.name} value={z.name}>{z.name} — {z.eta}</option>)}
                  </select>
                  {deliveryZone && <p style={{ fontSize:12, color:'#FFD43A', marginTop:6 }}>✓ Entrega estimada: {deliveryZone.eta}</p>}
                </div>
              )}

              <div style={{ marginBottom:16 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:8, textTransform:'uppercase', letterSpacing:'1px' }}>Notas</p>
                <textarea placeholder="Alergias, punto de la carne..." value={notes} onChange={e => setNotes(e.target.value)} rows={3} style={{ width:'100%', padding:'10px 12px', border:'1px solid #2A1A00', borderRadius:10, background:'#1A1000', color:'#FFFFFF', fontSize:13, resize:'vertical', boxSizing:'border-box' }} />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {itemCount > 0 && (
          <div style={{ padding:'16px 24px', borderTop:'1px solid #2A1A00', background:'#1A1000' }}>
            {[{label:'Subtotal',value:`€${subtotal.toFixed(2)}`},{label:'Envío',value:deliveryType==='pickup'?'Gratis':deliveryZone?`€${deliveryFee.toFixed(2)}`:'—'}].map(r => (
              <div key={r.label} style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>{r.label}</span>
                <span style={{ fontSize:13, color:'#FFFFFF', fontWeight:500 }}>{r.value}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', paddingTop:10, borderTop:'1px solid #2A1A00', marginTop:6, marginBottom:14 }}>
              <span style={{ fontFamily:"'Fraunces',serif", fontSize:17, fontWeight:600, color:'#FFFFFF' }}>Total</span>
              <span style={{ fontFamily:"'Fraunces',serif", fontSize:17, fontWeight:600, color:'#FFD43A' }}>€{(deliveryType==='delivery'&&deliveryZone?total:subtotal).toFixed(2)}</span>
            </div>
            <button onClick={onCheckout} disabled={deliveryType==='delivery'&&!deliveryZone} style={{ width:'100%', padding:'14px', background:'#FFD43A', color:'#0F0800', border:'none', borderRadius:12, fontSize:15, fontWeight:700, cursor:'pointer', opacity:(deliveryType==='delivery'&&!deliveryZone)?0.4:1, transition:'opacity 0.2s' }}>
              Ir al pago → €{(deliveryType==='delivery'&&deliveryZone?total:subtotal).toFixed(2)}
            </button>
            {deliveryType==='delivery'&&!deliveryZone&&<p style={{ fontSize:11, color:'#FFD43A', textAlign:'center', marginTop:8, opacity:0.7 }}>Selecciona tu zona para continuar</p>}
          </div>
        )}
      </div>
    </>
  );
}
