import { useCart } from '../context/CartContext';
import { deliveryZones } from '../data/menu';

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { items, itemCount, subtotal, deliveryFee, total, deliveryType, deliveryZone,
    updateQty, setDeliveryType, setDeliveryZone, notes, setNotes } = useCart();

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(15,8,0,0.5)', zIndex:200, opacity:open?1:0, pointerEvents:open?'all':'none', transition:'opacity 0.3s' }} />
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:400, background:'#FAF5EC', zIndex:201, transform:open?'translateX(0)':'translateX(100%)', transition:'transform 0.35s cubic-bezier(0.4,0,0.2,1)', display:'flex', flexDirection:'column', borderLeft:'2px solid #0F0800' }}>

        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'2px solid #0F0800', display:'flex', alignItems:'center', justifyContent:'space-between', background:'#FAF5EC' }}>
          <div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:900, color:'#0F0800', letterSpacing:'-.5px' }}>Tu pedido</div>
            {itemCount>0 && <div style={{ fontSize:11, color:'rgba(15,8,0,0.45)', marginTop:2, fontFamily:"'Outfit',sans-serif", letterSpacing:'.5px' }}>{itemCount} ARTÍCULO{itemCount>1?'S':''}</div>}
          </div>
          <button onClick={onClose} style={{ background:'#0F0800', border:'none', width:34, height:34, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#FFD43A' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px 24px' }}>
          {itemCount === 0 ? (
            <div style={{ textAlign:'center', padding:'56px 20px' }}>
              <div style={{ fontSize:48, marginBottom:14 }}>🛒</div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:900, color:'#0F0800', marginBottom:6 }}>Carrito vacío</div>
              <div style={{ fontSize:13, color:'rgba(15,8,0,0.45)', lineHeight:1.6, fontFamily:"'Outfit',sans-serif" }}>Añade platos para empezar tu pedido.</div>
            </div>
          ) : (
            <>
              {items.map(item => (
                <div key={item.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 0', borderBottom:'1px solid rgba(15,8,0,0.1)' }}>
                  <div style={{ width:44, height:44, background:'#0F0800', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{item.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#0F0800', fontFamily:"'Outfit',sans-serif" }}>{item.name}</div>
                    <div style={{ fontSize:11, color:'rgba(15,8,0,0.45)', marginTop:1, fontFamily:"'Outfit',sans-serif" }}>€{item.price%1===0?item.price:item.price.toFixed(2)} / ud.</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <button onClick={() => updateQty(item.id,item.qty-1)} style={{ width:24, height:24, border:'2px solid #0F0800', background:'transparent', cursor:'pointer', fontSize:13, color:'#0F0800', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>−</button>
                    <span style={{ fontSize:13, fontWeight:700, color:'#0F0800', minWidth:14, textAlign:'center', fontFamily:"'Outfit',sans-serif" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id,item.qty+1)} style={{ width:24, height:24, border:'none', background:'#0F0800', cursor:'pointer', fontSize:13, color:'#FFD43A', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>+</button>
                  </div>
                  <span style={{ fontFamily:"'Fraunces',serif", fontSize:15, fontWeight:700, color:'#0F0800', minWidth:44, textAlign:'right' }}>€{(item.price*item.qty).toFixed(2)}</span>
                </div>
              ))}

              <div style={{ marginTop:16 }}>
                <div style={{ fontSize:10, fontWeight:900, letterSpacing:'2px', color:'rgba(15,8,0,0.4)', marginBottom:8, textTransform:'uppercase', fontFamily:"'Outfit',sans-serif" }}>Tipo de entrega</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {[{id:'delivery',label:'🛵 A domicilio'},{id:'pickup',label:'🏪 Recogida'}].map(o => (
                    <button key={o.id} onClick={() => setDeliveryType(o.id)} style={{ padding:'10px', border:`2px solid ${deliveryType===o.id?'#0F0800':'rgba(15,8,0,0.2)'}`, background: deliveryType===o.id?'#0F0800':'transparent', color: deliveryType===o.id?'#FFD43A':'rgba(15,8,0,0.5)', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:"'Outfit',sans-serif", letterSpacing:'.2px' }}>{o.label}</button>
                  ))}
                </div>
                {deliveryType==='delivery' && (
                  <select value={deliveryZone?.name||''} onChange={e=>setDeliveryZone(deliveryZones.find(z=>z.name===e.target.value)||null)} style={{ width:'100%', marginTop:8, padding:'10px 12px', border:'2px solid rgba(15,8,0,0.2)', background:'#FAF5EC', color:'#0F0800', fontSize:13, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>
                    <option value="">Selecciona tu zona...</option>
                    {deliveryZones.map(z=><option key={z.name} value={z.name}>{z.name} — {z.eta}</option>)}
                  </select>
                )}
              </div>

              <div style={{ marginTop:14 }}>
                <div style={{ fontSize:10, fontWeight:900, letterSpacing:'2px', color:'rgba(15,8,0,0.4)', marginBottom:6, textTransform:'uppercase', fontFamily:"'Outfit',sans-serif" }}>Notas</div>
                <textarea placeholder="Alergias, punto de la carne..." value={notes} onChange={e=>setNotes(e.target.value)} rows={2} style={{ width:'100%', padding:'10px 12px', border:'2px solid rgba(15,8,0,0.2)', background:'#FAF5EC', color:'#0F0800', fontSize:13, resize:'none', boxSizing:'border-box', fontFamily:"'Outfit',sans-serif" }} />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {itemCount > 0 && (
          <div style={{ padding:'16px 24px', borderTop:'2px solid #0F0800', background:'#FFD43A' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontFamily:"'Outfit',sans-serif" }}>
              <span style={{ fontSize:12, color:'rgba(15,8,0,0.6)' }}>Subtotal</span>
              <span style={{ fontSize:12, fontWeight:700, color:'#0F0800' }}>€{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14, fontFamily:"'Outfit',sans-serif" }}>
              <span style={{ fontSize:12, color:'rgba(15,8,0,0.6)' }}>Envío</span>
              <span style={{ fontSize:12, fontWeight:700, color:'#0F0800' }}>{deliveryType==='pickup'?'Gratis':deliveryZone?`€${deliveryFee.toFixed(2)}`:'—'}</span>
            </div>
            <button onClick={onCheckout} style={{ width:'100%', padding:'14px', background:'#0F0800', color:'#FFD43A', border:'none', fontSize:14, fontWeight:900, cursor:'pointer', fontFamily:"'Outfit',sans-serif", letterSpacing:'.5px' }}>
              IR AL PAGO · €{(deliveryType==='delivery'&&deliveryZone?total:subtotal).toFixed(2)} →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
