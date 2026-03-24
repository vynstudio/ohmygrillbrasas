import { useCart } from '../context/CartContext';
import { deliveryZones } from '../data/menu';

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { items, itemCount, subtotal, deliveryFee, total, deliveryType, deliveryZone,
    updateQty, setDeliveryType, setDeliveryZone, notes, setNotes } = useCart();

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(15,8,0,0.3)', zIndex:200, opacity: open?1:0, pointerEvents: open?'all':'none', transition:'opacity 0.3s' }} />
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:400, background:'#FFFFFF', zIndex:201, transform: open?'translateX(0)':'translateX(100%)', transition:'transform 0.35s cubic-bezier(0.4,0,0.2,1)', display:'flex', flexDirection:'column', borderLeft:'1px solid rgba(15,8,0,0.12)' }}>

        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(15,8,0,0.1)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:600, color:'#0F0800', margin:0 }}>Tu pedido</h2>
            {itemCount > 0 && <p style={{ fontSize:12, color:'rgba(15,8,0,0.45)', margin:'2px 0 0', fontFamily:"'Outfit',sans-serif" }}>{itemCount} artículo{itemCount>1?'s':''}</p>}
          </div>
          <button onClick={onClose} style={{ background:'#F5F0E8', border:'none', borderRadius:'50%', width:34, height:34, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(15,8,0,0.5)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px 24px' }}>
          {itemCount === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'rgba(15,8,0,0.4)' }}>
              <div style={{ fontSize:44, marginBottom:14 }}>🛒</div>
              <p style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'#0F0800', marginBottom:6 }}>Carrito vacío</p>
              <p style={{ fontSize:13, lineHeight:1.6, fontFamily:"'Outfit',sans-serif" }}>Añade platos de la carta para empezar.</p>
            </div>
          ) : (
            <>
              {items.map(item => (
                <div key={item.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid rgba(15,8,0,0.08)' }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:'#0F0800', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{item.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13, fontWeight:600, color:'#0F0800', margin:0, fontFamily:"'Outfit',sans-serif" }}>{item.name}</p>
                    <p style={{ fontSize:11, color:'rgba(15,8,0,0.45)', margin:'1px 0 0', fontFamily:"'Outfit',sans-serif" }}>€{item.price%1===0?item.price:item.price.toFixed(2)} / ud.</p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
                    <button onClick={() => updateQty(item.id, item.qty-1)} style={{ width:24, height:24, border:'1.5px solid rgba(15,8,0,0.2)', background:'#FFFFFF', borderRadius:'50%', cursor:'pointer', fontSize:13, color:'#0F0800', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600 }}>−</button>
                    <span style={{ fontSize:13, fontWeight:600, color:'#0F0800', minWidth:14, textAlign:'center', fontFamily:"'Outfit',sans-serif" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty+1)} style={{ width:24, height:24, border:'none', background:'#0F0800', borderRadius:'50%', cursor:'pointer', fontSize:13, color:'#FFD43A', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>+</button>
                  </div>
                  <span style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:'#0F0800', minWidth:44, textAlign:'right' }}>€{(item.price*item.qty).toFixed(2)}</span>
                </div>
              ))}

              {/* Delivery */}
              <div style={{ marginTop:16 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'rgba(15,8,0,0.4)', marginBottom:8, textTransform:'uppercase', letterSpacing:'1px', fontFamily:"'Outfit',sans-serif" }}>Entrega</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {[{id:'delivery',label:'🛵 A domicilio'},{id:'pickup',label:'🏪 Recogida'}].map(opt => (
                    <button key={opt.id} onClick={() => setDeliveryType(opt.id)} style={{ padding:'10px 12px', border:`1.5px solid ${deliveryType===opt.id?'#0F0800':'rgba(15,8,0,0.15)'}`, borderRadius:10, background: deliveryType===opt.id?'#0F0800':'#FFFFFF', cursor:'pointer', fontSize:12, fontWeight:700, color: deliveryType===opt.id?'#FFD43A':'rgba(15,8,0,0.5)', transition:'all 0.15s', fontFamily:"'Outfit',sans-serif" }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {deliveryType==='delivery' && (
                  <select value={deliveryZone?.name||''} onChange={e => setDeliveryZone(deliveryZones.find(z=>z.name===e.target.value)||null)} style={{ width:'100%', marginTop:8, padding:'10px 12px', border:'1px solid rgba(15,8,0,0.15)', borderRadius:10, background:'#F5F0E8', color:'#0F0800', fontSize:13, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>
                    <option value="">Selecciona tu zona...</option>
                    {deliveryZones.map(z => <option key={z.name} value={z.name}>{z.name} — {z.eta}</option>)}
                  </select>
                )}
              </div>

              {/* Notes */}
              <div style={{ marginTop:14 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'rgba(15,8,0,0.4)', marginBottom:6, textTransform:'uppercase', letterSpacing:'1px', fontFamily:"'Outfit',sans-serif" }}>Notas</p>
                <textarea placeholder="Alergias, punto de la carne..." value={notes} onChange={e => setNotes(e.target.value)} rows={2} style={{ width:'100%', padding:'10px 12px', border:'1px solid rgba(15,8,0,0.15)', borderRadius:10, background:'#F5F0E8', color:'#0F0800', fontSize:13, resize:'none', boxSizing:'border-box', fontFamily:"'Outfit',sans-serif" }} />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {itemCount > 0 && (
          <div style={{ padding:'16px 24px', borderTop:'1px solid rgba(15,8,0,0.1)', background:'#F5F0E8' }}>
            {[{label:'Subtotal',val:`€${subtotal.toFixed(2)}`},{label:'Envío',val:deliveryType==='pickup'?'Gratis':deliveryZone?`€${deliveryFee.toFixed(2)}`:'—'}].map(r => (
              <div key={r.label} style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontFamily:"'Outfit',sans-serif" }}>
                <span style={{ fontSize:13, color:'rgba(15,8,0,0.5)' }}>{r.label}</span>
                <span style={{ fontSize:13, fontWeight:600, color:'#0F0800' }}>{r.val}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', paddingTop:10, borderTop:'1px solid rgba(15,8,0,0.1)', marginTop:4, marginBottom:14 }}>
              <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'#0F0800' }}>Total</span>
              <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'#0F0800' }}>€{(deliveryType==='delivery'&&deliveryZone?total:subtotal).toFixed(2)}</span>
            </div>
            <button onClick={onCheckout} disabled={deliveryType==='delivery'&&!deliveryZone} style={{ width:'100%', padding:'14px', background:'#FFD43A', color:'#0F0800', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer', opacity:(deliveryType==='delivery'&&!deliveryZone)?0.4:1, fontFamily:"'Outfit',sans-serif" }}>
              Ir al pago →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
