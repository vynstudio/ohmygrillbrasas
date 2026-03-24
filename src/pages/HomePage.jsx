import { useState, useEffect } from 'react';
import { products, packs, restaurantInfo } from '../data/menu';
import { useCart } from '../context/CartContext';
import HeroVideo from '../components/HeroVideo';

const featured = products.filter(p => ['chuleta-buey','costillas-iberico','pollo-corral'].includes(p.id));

// ── Web: Right-side order panel ─────────────────────────────────────────────
function OrderPanel({ onNavigate }) {
  const { items, itemCount, subtotal, deliveryFee, total, deliveryType,
    deliveryZone, updateQty, setDeliveryType } = useCart();

  return (
    <div style={{ width:340, flexShrink:0, display:'flex', flexDirection:'column', background:'#FFD43A', height:'100vh', position:'sticky', top:58, borderLeft:'2px solid #0F0800', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ padding:'20px 24px', borderBottom:'2px solid #0F0800' }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#0F0800', textTransform:'uppercase', fontFamily:"'Outfit',sans-serif" }}>Tu pedido</div>
        <div style={{ fontSize:12, color:'rgba(0,0,0,0.45)', marginTop:3, fontFamily:"'Outfit',sans-serif" }}>{itemCount > 0 ? `${itemCount} artículo${itemCount>1?'s':''}` : 'Carrito vacío'}</div>
      </div>

      {/* Items */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px 24px' }}>
        {itemCount === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 16px' }}>
            <div style={{ width:52, height:52, border:'2px solid #0F0800', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F0800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:'#0F0800', marginBottom:5, fontFamily:"'Outfit',sans-serif" }}>Carrito vacío</div>
            <div style={{ fontSize:11, color:'rgba(0,0,0,0.5)', lineHeight:1.6, fontFamily:"'Outfit',sans-serif" }}>Añade platos de la carta para empezar</div>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid rgba(0,0,0,0.12)' }}>
              <div style={{ width:36, height:36, background:'#0F0800', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{item.emoji}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'#0F0800', fontFamily:"'Outfit',sans-serif", overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
                <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)', fontFamily:"'Outfit',sans-serif" }}>€{item.price.toFixed(2)} / ud.</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                <button onClick={() => updateQty(item.id, item.qty-1)} style={{ width:22, height:22, border:'1.5px solid #0F0800', background:'transparent', borderRadius:'50%', cursor:'pointer', fontSize:13, color:'#0F0800', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>−</button>
                <span style={{ fontSize:12, fontWeight:700, color:'#0F0800', minWidth:14, textAlign:'center', fontFamily:"'Outfit',sans-serif" }}>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty+1)} style={{ width:22, height:22, border:'none', background:'#0F0800', borderRadius:'50%', cursor:'pointer', fontSize:13, color:'#FFD43A', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>+</button>
              </div>
              <span style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:'#0F0800', minWidth:40, textAlign:'right' }}>€{(item.price*item.qty).toFixed(2)}</span>
            </div>
          ))
        )}
      </div>

      {/* Delivery toggle */}
      {itemCount > 0 && (
        <div style={{ padding:'10px 24px', borderTop:'1px solid rgba(0,0,0,0.12)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
            {[{id:'delivery',label:'🛵 Entrega'},{id:'pickup',label:'🏪 Recogida'}].map(o => (
              <button key={o.id} onClick={() => setDeliveryType(o.id)} style={{ padding:'8px', border:`2px solid ${deliveryType===o.id?'#0F0800':'rgba(0,0,0,0.2)'}`, borderRadius:8, background: deliveryType===o.id?'#0F0800':'transparent', color: deliveryType===o.id?'#FFD43A':'rgba(0,0,0,0.5)', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer totals + CTA */}
      <div style={{ padding:'16px 24px', borderTop:'2px solid #0F0800', background:'#FFD43A' }}>
        {itemCount > 0 && (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontFamily:"'Outfit',sans-serif" }}>
              <span style={{ fontSize:12, color:'rgba(0,0,0,0.5)' }}>Subtotal</span>
              <span style={{ fontSize:12, fontWeight:600, color:'#0F0800' }}>€{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14, fontFamily:"'Outfit',sans-serif" }}>
              <span style={{ fontSize:12, color:'rgba(0,0,0,0.5)' }}>Envío</span>
              <span style={{ fontSize:12, fontWeight:600, color:'#0F0800' }}>{deliveryType==='pickup' ? 'Gratis' : deliveryZone ? `€${deliveryFee.toFixed(2)}` : '—'}</span>
            </div>
          </>
        )}
        <button onClick={() => onNavigate(itemCount>0?'checkout':'menu')} style={{ width:'100%', background:'#0F0800', color:'#FFD43A', border:'none', borderRadius:10, padding:'14px', fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer', letterSpacing:'.3px' }}>
          {itemCount > 0 ? `Ir al pago · €${(deliveryType==='delivery'&&deliveryZone?total:subtotal).toFixed(2)} →` : 'Ver la carta →'}
        </button>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginTop:10 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span style={{ fontSize:10, color:'rgba(0,0,0,0.45)', fontFamily:"'Outfit',sans-serif" }}>Pago seguro · Stripe</span>
        </div>
      </div>
    </div>
  );
}

// ── Menu row for web layout ──────────────────────────────────────────────────
function MenuRow({ product }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find(i => i.id === product.id);

  const handleAdd = () => { addItem(product); setAdded(true); setTimeout(() => setAdded(false), 1200); };

  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 0', borderBottom:'1px solid #2A1A00' }}>
      <div style={{ width:52, height:52, background:'#1A1000', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0, position:'relative' }}>
        {product.emoji}
        {inCart?.qty > 0 && <span style={{ position:'absolute', top:-5, right:-5, background:'#FFD43A', color:'#0F0800', fontSize:9, fontWeight:700, width:16, height:16, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>{inCart.qty}</span>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:15, fontWeight:600, color:'#FFFFFF' }}>{product.name}</span>
          {product.badge && <span style={{ background:'#FFD43A', color:'#0F0800', fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:10 }}>{product.badge}</span>}
        </div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:3, fontFamily:"'Outfit',sans-serif" }}>{product.description}</div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', marginTop:3, fontFamily:"'Outfit',sans-serif" }}>{product.weight}</div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, flexShrink:0 }}>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:600, color:'#FFD43A' }}>€{product.price%1===0?product.price:product.price.toFixed(2)}</span>
        <button onClick={handleAdd} style={{ background: added?'#2A1A00':'#FFD43A', color: added?'#FFD43A':'#0F0800', border:'none', borderRadius:20, padding:'6px 16px', fontSize:11, fontFamily:"'Outfit',sans-serif", fontWeight:700, cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}>
          {added ? '✓ Añadido' : '+ Añadir'}
        </button>
      </div>
    </div>
  );
}

// ── Mobile hero card ─────────────────────────────────────────────────────────
function MobileHero({ onNavigate }) {
  const { addItem } = useCart();
  const open = (() => {
    const now = new Date(); const day = now.getDay(); const h = now.getHours() + now.getMinutes()/60;
    if (day>=1&&day<=4) return h>=13&&h<22;
    if (day===5||day===6) return h>=13&&h<23;
    if (day===0) return h>=13&&h<21;
    return false;
  })();

  return (
    <div style={{ background:'#0F0800', padding:'20px 16px 0', fontFamily:"'Outfit',sans-serif" }}>
      {/* Status + brand */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:600, color:'#FFFFFF', lineHeight:1 }}>
            Oh<em style={{ color:'#FFD43A' }}>My</em>Grill
          </div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', letterSpacing:'1px', marginTop:3 }}>BRASAS · ZARAGOZA</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, background:'#1A1000', padding:'6px 12px', borderRadius:20, border:'1px solid #2A1A00' }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background: open?'#FFD43A':'rgba(255,255,255,0.3)' }} />
          <span style={{ fontSize:11, color: open?'#FFD43A':'rgba(255,255,255,0.45)', fontWeight:600 }}>{open?'Abierto':'Cerrado'}</span>
        </div>
      </div>

      {/* Yellow feature card */}
      <div style={{ background:'#FFD43A', borderRadius:16, padding:'20px', marginBottom:20 }}>
        <div style={{ fontSize:9, fontWeight:700, letterSpacing:'2px', color:'rgba(0,0,0,0.5)', textTransform:'uppercase', marginBottom:8 }}>Especial del día</div>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
          <div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:600, color:'#0F0800', lineHeight:1.1 }}>Chuletón<br/>de buey</div>
            <div style={{ fontSize:11, color:'rgba(0,0,0,0.5)', marginTop:6 }}>1 kg · Madurado 45 días · Sal Maldon</div>
          </div>
          <div style={{ fontSize:36 }}>🥩</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:32, fontWeight:600, color:'#0F0800' }}>€48</div>
          <button onClick={() => addItem(products[0])} style={{ background:'#0F0800', color:'#FFD43A', border:'none', borderRadius:24, padding:'10px 22px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>
            + Añadir
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:20 }}>
        {[{n:'+10',l:'años'},{n:'100%',l:'encina'},{n:'4.9★',l:'Google'}].map(s => (
          <div key={s.l} style={{ background:'#1A1000', border:'1px solid #2A1A00', borderRadius:10, padding:'10px 8px', textAlign:'center' }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'#FFD43A' }}>{s.n}</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', marginTop:3, textTransform:'uppercase', letterSpacing:'1px' }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Section label */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingBottom:12, borderBottom:'1px solid #2A1A00' }}>
        <div style={{ fontSize:13, fontWeight:700, color:'#FFFFFF' }}>La carta</div>
        <button onClick={() => onNavigate('menu')} style={{ background:'none', border:'none', color:'#FFD43A', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>Ver todo →</button>
      </div>
    </div>
  );
}

// ── Mobile menu item card ────────────────────────────────────────────────────
function MobileItemCard({ product }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find(i => i.id === product.id);

  const handleAdd = () => { addItem(product); setAdded(true); setTimeout(() => setAdded(false), 1200); };

  return (
    <div style={{ background:'#1A1000', borderRadius:14, border:'1px solid #2A1A00', overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ background:'#0F0800', height:100, display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, position:'relative' }}>
        {product.emoji}
        {product.badge && <span style={{ position:'absolute', top:8, left:8, background:'#FFD43A', color:'#0F0800', fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:8 }}>{product.badge}</span>}
        {inCart?.qty > 0 && <span style={{ position:'absolute', top:8, right:8, background:'#FFD43A', color:'#0F0800', fontSize:10, fontWeight:700, width:20, height:20, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>{inCart.qty}</span>}
      </div>
      <div style={{ padding:'12px', flex:1, display:'flex', flexDirection:'column' }}>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:'#FFFFFF', marginBottom:3 }}>{product.name}</div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', lineHeight:1.5, flex:1, fontFamily:"'Outfit',sans-serif" }}>{product.description}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10 }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:600, color:'#FFD43A' }}>€{product.price%1===0?product.price:product.price.toFixed(2)}</span>
          <button onClick={handleAdd} style={{ background: added?'#2A1A00':'#FFD43A', color: added?'#FFD43A':'#0F0800', border:'none', borderRadius:20, padding:'7px 14px', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>
            {added ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main HomePage ────────────────────────────────────────────────────────────
export default function HomePage({ onNavigate }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 60);
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => { clearTimeout(t); window.removeEventListener('resize', fn); };
  }, []);

  // ── MOBILE ──────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ background:'#0F0800', minHeight:'100vh', fontFamily:"'Outfit',sans-serif" }}>
        <MobileHero onNavigate={onNavigate} />
        {/* Featured items grid */}
        <div style={{ padding:'16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {featured.map(p => <MobileItemCard key={p.id} product={p} />)}
          {/* Packs card */}
          <div onClick={() => onNavigate('packs')} style={{ background:'#FFD43A', borderRadius:14, padding:'16px', cursor:'pointer', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
            <div style={{ fontSize:28 }}>🎁</div>
            <div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'#0F0800', marginBottom:4 }}>Ver packs</div>
              <div style={{ fontSize:11, color:'rgba(0,0,0,0.5)' }}>Combos desde €38</div>
            </div>
            <div style={{ fontSize:18, fontWeight:700, color:'#0F0800', marginTop:8 }}>→</div>
          </div>
        </div>
      </div>
    );
  }

  // ── WEB SPLIT SCREEN ─────────────────────────────────────────────────────
  return (
    <div style={{ display:'flex', minHeight:'calc(100vh - 58px)', background:'#0F0800', fontFamily:"'Outfit',sans-serif" }}>

      {/* LEFT — dark editorial content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>

        {/* Hero section */}
        <section style={{ position:'relative', padding:'64px 48px 48px', borderBottom:'1px solid #2A1A00', overflow:'hidden' }}>
          <HeroVideo src="/videos/brasa.mp4" poster="/videos/brasa-poster.jpg" />
          <div style={{ position:'relative', zIndex:2, opacity: heroVisible?1:0, transform: heroVisible?'translateY(0)':'translateY(24px)', transition:'all 0.7s cubic-bezier(0.4,0,0.2,1)' }}>
            <div style={{ fontSize:10, letterSpacing:'3px', color:'#FFD43A', textTransform:'uppercase', marginBottom:20, fontWeight:600 }}>Brasas · Zaragoza · Est. 2013</div>
            <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:64, fontWeight:600, lineHeight:.95, color:'#FFFFFF', margin:'0 0 20px', letterSpacing:'-2px' }}>
              A la brasa,<br /><em style={{ color:'#FFD43A' }}>como tiene<br />que ser.</em>
            </h1>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.5)', lineHeight:1.75, maxWidth:420, margin:'0 0 36px' }}>
              Leña de encina aragonesa. Carnes maduradas en cámara propia. Sin atajos, sin gas, sin concesiones.
            </p>
            <div style={{ display:'flex', gap:14, alignItems:'center' }}>
              <button onClick={() => onNavigate('menu')} style={{ background:'#FFD43A', color:'#0F0800', border:'none', borderRadius:10, padding:'12px 28px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>Ver la carta →</button>
              <button onClick={() => onNavigate('packs')} style={{ background:'transparent', color:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:10, padding:'12px 24px', fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>Ver packs</button>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', borderBottom:'1px solid #2A1A00' }}>
          {[{n:'+10 años',l:'en Zaragoza'},{n:'100%',l:'leña encina'},{n:'4.9 ★',l:'Google Maps'}].map((s,i) => (
            <div key={s.l} style={{ padding:'20px 32px', borderRight: i<2?'1px solid #2A1A00':'none' }}>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:600, color:'#FFD43A' }}>{s.n}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:4, letterSpacing:'.5px' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Featured menu */}
        <div style={{ padding:'32px 48px', flex:1 }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:20 }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:600, color:'#FFFFFF' }}>Los más pedidos</div>
            <button onClick={() => onNavigate('menu')} style={{ background:'none', border:'none', color:'#FFD43A', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>Ver carta completa →</button>
          </div>
          {featured.map(p => <MenuRow key={p.id} product={p} />)}
        </div>

        {/* Footer strip */}
        <div style={{ background:'#1A1000', borderTop:'1px solid #2A1A00', padding:'14px 48px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', gap:24 }}>
            {['about','contact'].map(id => (
              <button key={id} onClick={() => onNavigate(id)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:12, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>
                {id==='about'?'Nosotros':'Contacto'}
              </button>
            ))}
          </div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.2)', fontFamily:"'Outfit',sans-serif" }}>© 2025 OhMyGrill Brasas · Zaragoza</div>
        </div>
      </div>

      {/* RIGHT — yellow order panel */}
      <OrderPanel onNavigate={onNavigate} />
    </div>
  );
}
