import { useCart } from '../context/CartContext';
import { deliveryZones } from '../data/menu';

const IMG = <svg width="20" height="16" viewBox="0 0 20 16" fill="none"><rect x="1" y="1" width="18" height="14" stroke="rgba(255,255,255,.15)" strokeWidth="1"/><circle cx="6" cy="5.5" r="2" stroke="rgba(255,255,255,.15)" strokeWidth="1"/><path d="M1 11l4-3.5 4 3 4-4.5 6 4.5" stroke="rgba(255,255,255,.15)" strokeWidth="1" strokeLinejoin="round"/></svg>;

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { items, itemCount, subtotal, deliveryFee, total, deliveryType, deliveryZone,
    updateQty, setDeliveryType, setDeliveryZone, notes, setNotes } = useCart();

  const s = { cream:'#FAF6EF', dark:'#1a1008', yellow:'#F5C842', border:'rgba(26,16,8,.1)', sub:'rgba(26,16,8,.5)', surface:'#F2EDE4' };

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.35)', zIndex:200, opacity:open?1:0, pointerEvents:open?'all':'none', transition:'opacity .3s' }} />
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:380, background:s.cream, zIndex:201, transform:open?'translateX(0)':'translateX(100%)', transition:'transform .35s cubic-bezier(.4,0,.2,1)', display:'flex', flexDirection:'column', borderLeft:`1px solid ${s.border}` }}>

        {/* Header */}
        <div style={{ padding:'22px 24px', borderBottom:`1px solid ${s.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:600, color:s.dark }}>Tu pedido</div>
            {itemCount>0 && <div style={{ fontSize:11, color:s.sub, marginTop:2 }}>{itemCount} artículo{itemCount>1?'s':''}</div>}
          </div>
          <button onClick={onClose} style={{ width:32, height:32, background:'rgba(26,16,8,.07)', border:'none', borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:s.dark }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex:1, overflowY:'auto', padding:'14px 24px' }}>
          {itemCount === 0 ? (
            <div style={{ textAlign:'center', padding:'56px 20px', color:s.sub }}>
              <div style={{ fontSize:40, marginBottom:14 }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(26,16,8,.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              </div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:s.dark, marginBottom:6 }}>Carrito vacío</div>
              <div style={{ fontSize:13, lineHeight:1.6 }}>Añade platos para empezar tu pedido.</div>
            </div>
          ) : (
            <>
              {items.map(item => (
                <div key={item.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:`1px solid ${s.border}` }}>
                  <div style={{ width:44, height:44, background:s.dark, borderRadius:8, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>{IMG}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:s.dark, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize:11, color:s.sub, marginTop:1 }}>€{item.price%1===0?item.price:item.price.toFixed(2)} / ud.</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <button onClick={() => updateQty(item.id,item.qty-1)} style={{ width:24, height:24, border:`1px solid ${s.border}`, background:s.cream, borderRadius:'50%', cursor:'pointer', fontSize:14, fontWeight:600, color:s.dark, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                    <span style={{ fontSize:13, fontWeight:600, color:s.dark, minWidth:16, textAlign:'center' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id,item.qty+1)} style={{ width:24, height:24, border:'none', background:s.dark, borderRadius:'50%', cursor:'pointer', fontSize:14, fontWeight:600, color:s.yellow, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                  </div>
                  <span style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:s.dark, minWidth:44, textAlign:'right' }}>€{(item.price*item.qty).toFixed(2)}</span>
                </div>
              ))}

              <div style={{ marginTop:16 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:s.sub, marginBottom:8 }}>Tipo de entrega</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {[{id:'delivery',label:'A domicilio'},{id:'pickup',label:'Recogida'}].map(o=>(
                    <button key={o.id} onClick={() => setDeliveryType(o.id)} style={{ padding:'10px', border:`1.5px solid ${deliveryType===o.id?s.dark:s.border}`, borderRadius:10, background: deliveryType===o.id?s.dark:s.cream, color: deliveryType===o.id?s.yellow:s.sub, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all .15s' }}>{o.label}</button>
                  ))}
                </div>
                {deliveryType==='delivery' && (
                  <select value={deliveryZone?.name||''} onChange={e=>setDeliveryZone(deliveryZones.find(z=>z.name===e.target.value)||null)} style={{ width:'100%', marginTop:8, padding:'11px 14px', border:`1px solid ${s.border}`, borderRadius:10, background:s.surface, color:s.dark, fontSize:13, cursor:'pointer' }}>
                    <option value="">Selecciona tu zona...</option>
                    {deliveryZones.map(z=><option key={z.name} value={z.name}>{z.name} — {z.eta}</option>)}
                  </select>
                )}
              </div>

              <div style={{ marginTop:14 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:s.sub, marginBottom:6 }}>Notas</div>
                <textarea placeholder="Alergias, punto de la carne..." value={notes} onChange={e=>setNotes(e.target.value)} rows={2} style={{ width:'100%', padding:'11px 14px', border:`1px solid ${s.border}`, borderRadius:10, background:s.surface, color:s.dark, fontSize:13, resize:'none', boxSizing:'border-box' }} />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {itemCount > 0 && (
          <div style={{ padding:'16px 24px', borderTop:`1px solid ${s.border}`, background:s.surface }}>
            {[{l:'Subtotal',v:`€${subtotal.toFixed(2)}`},{l:'Envío',v:deliveryType==='pickup'?'Gratis':deliveryZone?`€${deliveryFee.toFixed(2)}`:'—'}].map(r=>(
              <div key={r.l} style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:13, color:s.sub }}>
                <span>{r.l}</span><span style={{ fontWeight:600, color:s.dark }}>{r.v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0 14px', borderTop:`1px solid ${s.border}`, marginTop:4 }}>
              <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:s.dark }}>Total</span>
              <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:s.dark }}>€{(deliveryType==='delivery'&&deliveryZone?total:subtotal).toFixed(2)}</span>
            </div>
            <button onClick={onCheckout} style={{ width:'100%', padding:14, background:s.yellow, color:s.dark, border:'none', borderRadius:12, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
              Finalizar pedido →
            </button>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5, marginTop:10, fontSize:11, color:s.sub }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(26,16,8,.3)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Pago seguro con Stripe
            </div>
          </div>
        )}
      </div>
    </>
  );
}
