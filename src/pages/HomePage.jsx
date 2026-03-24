import { useState, useEffect } from 'react';
import { products, packs, restaurantInfo } from '../data/menu';
import { useCart } from '../context/CartContext';
import HeroVideo from '../components/HeroVideo';

const featured = products.filter(p => ['chuleta-buey','costillas-iberico','pollo-corral'].includes(p.id));

// ── WEB: right-column order panel ────────────────────────────────────────────
function OrderPanel({ onNavigate }) {
  const { items, itemCount, subtotal, deliveryFee, total, deliveryType, deliveryZone, updateQty, setDeliveryType } = useCart();
  return (
    <div style={{ width:320, flexShrink:0, display:'flex', flexDirection:'column', background:'#FFD43A', height:'calc(100vh - 97px)', position:'sticky', top:97, borderLeft:'2px solid #0F0800', overflow:'hidden' }}>
      <div style={{ padding:'18px 22px', borderBottom:'2px solid #0F0800' }}>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:900, color:'#0F0800', letterSpacing:'-.3px' }}>Tu pedido</div>
        <div style={{ fontSize:10, fontWeight:900, letterSpacing:'1.5px', color:'rgba(15,8,0,0.5)', marginTop:2, fontFamily:"'Outfit',sans-serif" }}>{itemCount>0?`${itemCount} ARTÍCULO${itemCount>1?'S':''}`:'CARRITO VACÍO'}</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'12px 22px' }}>
        {itemCount===0 ? (
          <div style={{ textAlign:'center', padding:'44px 12px' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🛒</div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:900, color:'#0F0800', marginBottom:6 }}>Carrito vacío</div>
            <div style={{ fontSize:12, color:'rgba(15,8,0,0.55)', lineHeight:1.6, fontFamily:"'Outfit',sans-serif" }}>Añade platos para empezar</div>
          </div>
        ) : items.map(item => (
          <div key={item.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid rgba(15,8,0,0.15)' }}>
            <div style={{ width:36, height:36, background:'#0F0800', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{item.emoji}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#0F0800', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:"'Outfit',sans-serif" }}>{item.name}</div>
              <div style={{ fontSize:10, color:'rgba(15,8,0,0.5)', fontFamily:"'Outfit',sans-serif" }}>€{item.price.toFixed(2)}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              <button onClick={()=>updateQty(item.id,item.qty-1)} style={{ width:22, height:22, border:'2px solid #0F0800', background:'transparent', cursor:'pointer', fontSize:13, color:'#0F0800', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900 }}>−</button>
              <span style={{ fontSize:12, fontWeight:900, color:'#0F0800', minWidth:14, textAlign:'center', fontFamily:"'Outfit',sans-serif" }}>{item.qty}</span>
              <button onClick={()=>updateQty(item.id,item.qty+1)} style={{ width:22, height:22, border:'none', background:'#0F0800', cursor:'pointer', fontSize:13, color:'#FFD43A', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900 }}>+</button>
            </div>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:13, fontWeight:900, color:'#0F0800', minWidth:38, textAlign:'right' }}>€{(item.price*item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {itemCount>0 && (
        <div style={{ padding:'10px 22px', borderTop:'1px solid rgba(15,8,0,0.15)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
            {[{id:'delivery',label:'🛵 Entrega'},{id:'pickup',label:'🏪 Recogida'}].map(o=>(
              <button key={o.id} onClick={()=>setDeliveryType(o.id)} style={{ padding:'8px 6px', border:`2px solid #0F0800`, background:deliveryType===o.id?'#0F0800':'transparent', color:deliveryType===o.id?'#FFD43A':'#0F0800', fontSize:11, fontWeight:900, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>{o.label}</button>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding:'14px 22px', borderTop:'2px solid #0F0800', background:'#FAF5EC' }}>
        {itemCount>0 && (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, fontFamily:"'Outfit',sans-serif" }}>
              <span style={{ fontSize:12, color:'rgba(15,8,0,0.5)' }}>Subtotal</span>
              <span style={{ fontSize:12, fontWeight:700, color:'#0F0800' }}>€{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12, fontFamily:"'Outfit',sans-serif" }}>
              <span style={{ fontSize:12, color:'rgba(15,8,0,0.5)' }}>Envío</span>
              <span style={{ fontSize:12, fontWeight:700, color:'#0F0800' }}>{deliveryType==='pickup'?'Gratis':deliveryZone?`€${deliveryFee.toFixed(2)}`:'—'}</span>
            </div>
          </>
        )}
        <button onClick={()=>onNavigate(itemCount>0?'checkout':'menu')} style={{ width:'100%', background:'#0F0800', color:'#FFD43A', border:'none', padding:'14px', fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:900, cursor:'pointer', letterSpacing:'.5px' }}>
          {itemCount>0?`IR AL PAGO · €${(deliveryType==='delivery'&&deliveryZone?total:subtotal).toFixed(2)} →`:'VER LA CARTA →'}
        </button>
      </div>
    </div>
  );
}

// ── WEB: menu row ────────────────────────────────────────────────────────────
function MenuRow({ product }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find(i=>i.id===product.id);
  const handleAdd = () => { addItem(product); setAdded(true); setTimeout(()=>setAdded(false),1200); };
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 0', borderBottom:'1px solid rgba(15,8,0,0.1)' }}>
      <div style={{ width:54, height:54, background:'#0F0800', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0, position:'relative' }}>
        {product.emoji}
        {inCart?.qty>0 && <span style={{ position:'absolute', top:-6, right:-6, background:'#FFD43A', color:'#0F0800', fontSize:9, fontWeight:900, width:17, height:17, display:'flex', alignItems:'center', justifyContent:'center' }}>{inCart.qty}</span>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:700, color:'#0F0800' }}>{product.name}</span>
          {product.badge && <span style={{ background:'#FFD43A', color:'#0F0800', fontSize:9, fontWeight:900, padding:'2px 7px', letterSpacing:'.5px' }}>{product.badge.toUpperCase()}</span>}
        </div>
        <div style={{ fontSize:11, color:'rgba(15,8,0,0.45)', marginTop:3, fontFamily:"'Outfit',sans-serif" }}>{product.description}</div>
        <div style={{ fontSize:10, color:'rgba(15,8,0,0.25)', marginTop:2, fontFamily:"'Outfit',sans-serif", letterSpacing:'.5px' }}>{product.weight}</div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, flexShrink:0 }}>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:900, color:'#0F0800' }}>€{product.price%1===0?product.price:product.price.toFixed(2)}</span>
        <button onClick={handleAdd} style={{ background:added?'#0F0800':'#FFD43A', color:added?'#FFD43A':'#0F0800', border:'2px solid #0F0800', padding:'6px 16px', fontSize:11, fontFamily:"'Outfit',sans-serif", fontWeight:900, cursor:'pointer', transition:'all 0.2s', letterSpacing:'.3px' }}>
          {added?'✓ AÑADIDO':'+ AÑADIR'}
        </button>
      </div>
    </div>
  );
}

// ── MOBILE: ticker marquee ───────────────────────────────────────────────────
function MobileTicker() {
  const items = ['🔥 LEÑA DE ENCINA','★ DESDE 2013','🛵 ENTREGA 90 MIN','✦ ZARAGOZA','🥩 CARNES PREMIUM','★ 4.9 GOOGLE'];
  return (
    <div style={{ background:'#FFD43A', borderBottom:'2px solid #0F0800', overflow:'hidden', padding:'7px 0' }}>
      <div className="marquee-track">
        {[...items,...items].map((t,i) => (
          <span key={i} style={{ fontSize:11, fontWeight:900, color:'#0F0800', padding:'0 20px', letterSpacing:'1px', fontFamily:"'Outfit',sans-serif", whiteSpace:'nowrap' }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ── MOBILE: hero ─────────────────────────────────────────────────────────────
function MobileHero({ onNavigate }) {
  const { addItem } = useCart();
  const open = (() => { const n=new Date(),d=n.getDay(),h=n.getHours()+n.getMinutes()/60; if(d>=1&&d<=4)return h>=13&&h<22; if(d===5||d===6)return h>=13&&h<23; if(d===0)return h>=13&&h<21; return false; })();

  return (
    <div style={{ background:'#FAF5EC', fontFamily:"'Outfit',sans-serif" }}>
      {/* Brand bar */}
      <div style={{ padding:'14px 16px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:26, fontWeight:900, color:'#0F0800', letterSpacing:'-.5px', lineHeight:1 }}>OhMy<em style={{ color:'#FFD43A' }}>Grill</em></div>
          <div style={{ fontSize:9, letterSpacing:'2px', color:'rgba(15,8,0,0.4)', textTransform:'uppercase', marginTop:2 }}>Brasas · Zaragoza</div>
        </div>
        <div style={{ background: open?'#0F0800':'rgba(15,8,0,0.1)', padding:'6px 13px', display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ width:6, height:6, background:open?'#FFD43A':'rgba(15,8,0,0.35)' }} />
          <span style={{ fontSize:10, fontWeight:900, color:open?'#FFD43A':'rgba(15,8,0,0.5)', letterSpacing:'1px' }}>{open?'ABIERTO':'CERRADO'}</span>
        </div>
      </div>

      {/* Hero headline */}
      <div style={{ padding:'20px 16px 16px' }}>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:56, fontWeight:900, color:'#0F0800', lineHeight:.88, letterSpacing:'-2px', marginBottom:4 }}>A la<br/>brasa.</div>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:56, fontWeight:900, color:'#FFD43A', lineHeight:.88, letterSpacing:'-2px', fontStyle:'italic', marginBottom:16 }}>Siempre.</div>
        <div style={{ fontSize:12, color:'rgba(15,8,0,0.5)', lineHeight:1.7, marginBottom:20 }}>Leña de encina aragonesa. Carnes maduradas en cámara propia. Sin gas, sin atajos.</div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={()=>onNavigate('menu')} style={{ flex:1, background:'#0F0800', color:'#FFD43A', border:'none', padding:'14px', fontSize:13, fontWeight:900, cursor:'pointer', letterSpacing:'.5px' }}>VER LA CARTA →</button>
          <button onClick={()=>onNavigate('packs')} style={{ flex:1, background:'transparent', color:'#0F0800', border:'2px solid #0F0800', padding:'14px', fontSize:13, fontWeight:900, cursor:'pointer', letterSpacing:'.5px' }}>VER PACKS</button>
        </div>
      </div>

      {/* Dark quote band */}
      <div style={{ background:'#0F0800', padding:'18px 16px', margin:'0 0 0 0' }}>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontStyle:'italic', color:'#FAF5EC', lineHeight:1.3 }}>"Como tiene que ser."</div>
        <div style={{ fontSize:10, letterSpacing:'2px', color:'rgba(255,255,255,0.3)', marginTop:6, textTransform:'uppercase' }}>— OhMyGrill Brasas</div>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', borderBottom:'2px solid #0F0800' }}>
        {[{n:'+10',l:'AÑOS'},{n:'100%',l:'ENCINA'},{n:'4.9★',l:'GOOGLE'}].map((s,i)=>(
          <div key={s.l} style={{ padding:'14px 8px', textAlign:'center', borderRight:i<2?'1px solid rgba(15,8,0,0.12)':'none' }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:900, color:'#0F0800' }}>{s.n}</div>
            <div style={{ fontSize:8, letterSpacing:'2px', color:'rgba(15,8,0,0.4)', marginTop:3 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Quick menu label */}
      <div style={{ padding:'14px 16px 10px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'2px solid #0F0800' }}>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:900, color:'#0F0800', letterSpacing:'-.3px' }}>Carta rápida</div>
        <button onClick={()=>onNavigate('menu')} style={{ background:'none', border:'none', color:'#0F0800', fontSize:11, fontWeight:900, cursor:'pointer', letterSpacing:'.5px', textDecoration:'underline', textUnderlineOffset:3 }}>VER TODO →</button>
      </div>
    </div>
  );
}

// ── MOBILE: item row (list style like proposal A) ────────────────────────────
function MobileItemRow({ product }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find(i=>i.id===product.id);
  const handleAdd = () => { addItem(product); setAdded(true); setTimeout(()=>setAdded(false),1200); };
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom:'1px solid rgba(15,8,0,0.08)', background:'#FAF5EC' }}>
      <div style={{ width:44, height:44, background:'#0F0800', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0, position:'relative' }}>
        {product.emoji}
        {inCart?.qty>0 && <span style={{ position:'absolute', top:-5, right:-5, background:'#FFD43A', color:'#0F0800', fontSize:8, fontWeight:900, width:15, height:15, display:'flex', alignItems:'center', justifyContent:'center' }}>{inCart.qty}</span>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:700, color:'#0F0800' }}>{product.name}</span>
          {product.badge && <span style={{ background:'#FFD43A', color:'#0F0800', fontSize:8, fontWeight:900, padding:'2px 6px', letterSpacing:'.5px' }}>{product.badge.toUpperCase()}</span>}
        </div>
        <div style={{ fontSize:10, color:'rgba(15,8,0,0.45)', marginTop:2, fontFamily:"'Outfit',sans-serif" }}>{product.description}</div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6, flexShrink:0 }}>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:900, color:'#0F0800' }}>€{product.price%1===0?product.price:product.price.toFixed(2)}</span>
        <button onClick={handleAdd} style={{ background:added?'#0F0800':'#FFD43A', color:added?'#FFD43A':'#0F0800', border:'2px solid #0F0800', padding:'5px 12px', fontSize:10, fontWeight:900, cursor:'pointer', fontFamily:"'Outfit',sans-serif", letterSpacing:'.3px' }}>
          {added?'✓':'+ AÑADIR'}
        </button>
      </div>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function HomePage({ onNavigate }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(()=>setVisible(true), 60);
    const fn = ()=>setIsMobile(window.innerWidth<768);
    window.addEventListener('resize', fn);
    return ()=>{ clearTimeout(t); window.removeEventListener('resize',fn); };
  }, []);

  // ── MOBILE ────────────────────────────────────────────────────────────────
  if (isMobile) return (
    <div style={{ background:'#FAF5EC', minHeight:'100vh' }}>
      <MobileTicker />
      <MobileHero onNavigate={onNavigate} />
      {featured.map(p => <MobileItemRow key={p.id} product={p} />)}
      {/* Packs CTA band */}
      <div style={{ background:'#FFD43A', borderTop:'2px solid #0F0800', padding:'20px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }} onClick={()=>onNavigate('packs')}>
        <div>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:900, color:'#0F0800', letterSpacing:'-.3px' }}>Ver packs</div>
          <div style={{ fontSize:11, color:'rgba(15,8,0,0.55)', fontFamily:"'Outfit',sans-serif", marginTop:2 }}>Combos desde €38 · Ahorra hasta €14</div>
        </div>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:32, fontWeight:900, color:'#0F0800' }}>→</div>
      </div>
    </div>
  );

  // ── WEB SPLIT SCREEN ──────────────────────────────────────────────────────
  return (
    <div style={{ display:'flex', minHeight:'calc(100vh - 97px)', background:'#FAF5EC' }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>

        {/* Hero — dark with video */}
        <section style={{ position:'relative', padding:'64px 52px 52px', borderBottom:'2px solid #0F0800', overflow:'hidden', background:'#0F0800', minHeight:440 }}>
          <HeroVideo src="/videos/brasa.mp4" poster="/videos/brasa-poster.jpg" />
          <div style={{ position:'relative', zIndex:2, opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(20px)', transition:'all 0.7s' }}>
            <div style={{ fontSize:10, letterSpacing:'3px', color:'#FFD43A', textTransform:'uppercase', marginBottom:20, fontWeight:900, fontFamily:"'Outfit',sans-serif" }}>Brasas · Zaragoza · Est. 2013</div>
            <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:72, fontWeight:900, lineHeight:.88, color:'#FFFFFF', margin:'0 0 6px', letterSpacing:'-3px' }}>A la brasa,</h1>
            <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:72, fontWeight:900, lineHeight:.88, color:'#FFD43A', fontStyle:'italic', margin:'0 0 24px', letterSpacing:'-3px' }}>siempre.</h1>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.5)', lineHeight:1.75, maxWidth:380, margin:'0 0 36px', fontFamily:"'Outfit',sans-serif" }}>Leña de encina aragonesa. Carnes maduradas. Sin atajos.</p>
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={()=>onNavigate('menu')} style={{ background:'#FFD43A', color:'#0F0800', border:'none', padding:'13px 32px', fontSize:13, fontWeight:900, cursor:'pointer', fontFamily:"'Outfit',sans-serif", letterSpacing:'.5px' }}>VER LA CARTA →</button>
              <button onClick={()=>onNavigate('packs')} style={{ background:'transparent', color:'rgba(255,255,255,0.7)', border:'2px solid rgba(255,255,255,0.3)', padding:'13px 28px', fontSize:13, fontWeight:900, cursor:'pointer', fontFamily:"'Outfit',sans-serif", letterSpacing:'.5px' }}>VER PACKS</button>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', background:'#FAF5EC', borderBottom:'2px solid #0F0800' }}>
          {[{n:'+10 años',l:'en Zaragoza'},{n:'100% encina',l:'siempre leña'},{n:'4.9 ★',l:'Google Maps'}].map((s,i)=>(
            <div key={s.l} style={{ padding:'20px 36px', borderRight:i<2?'1px solid rgba(15,8,0,0.12)':'none' }}>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:900, color:'#0F0800', letterSpacing:'-.5px' }}>{s.n}</div>
              <div style={{ fontSize:11, color:'rgba(15,8,0,0.4)', marginTop:4, fontFamily:"'Outfit',sans-serif", letterSpacing:'.5px' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Featured menu */}
        <div style={{ padding:'32px 52px', flex:1 }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:20 }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:900, color:'#0F0800', letterSpacing:'-.5px' }}>Los más pedidos</div>
            <button onClick={()=>onNavigate('menu')} style={{ background:'none', border:'none', color:'#0F0800', fontSize:12, fontWeight:900, cursor:'pointer', fontFamily:"'Outfit',sans-serif", letterSpacing:'.5px', textDecoration:'underline', textUnderlineOffset:3 }}>VER CARTA COMPLETA →</button>
          </div>
          {featured.map(p=><MenuRow key={p.id} product={p} />)}
        </div>

        {/* Yellow packs CTA band */}
        <div style={{ background:'#FFD43A', borderTop:'2px solid #0F0800', padding:'24px 52px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }} onClick={()=>onNavigate('packs')}>
          <div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:900, color:'#0F0800', letterSpacing:'-.5px' }}>Packs y combos · Ahorra hasta €14</div>
            <div style={{ fontSize:13, color:'rgba(15,8,0,0.55)', marginTop:4, fontFamily:"'Outfit',sans-serif" }}>Pack Familiar, Pareja, Carnívoro — pensados para compartir.</div>
          </div>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:40, fontWeight:900, color:'#0F0800', flexShrink:0 }}>→</div>
        </div>

        {/* Footer */}
        <div style={{ background:'#0F0800', padding:'16px 52px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', gap:24 }}>
            {['about','contact'].map(id=>(
              <button key={id} onClick={()=>onNavigate(id)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:11, cursor:'pointer', fontFamily:"'Outfit',sans-serif", fontWeight:700, letterSpacing:'.5px' }}>{id==='about'?'NOSOTROS':'CONTACTO'}</button>
            ))}
          </div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.2)', fontFamily:"'Outfit',sans-serif", letterSpacing:'.5px' }}>© 2025 OHMYGRILL BRASAS · ZARAGOZA</div>
        </div>
      </div>

      <OrderPanel onNavigate={onNavigate} />
    </div>
  );
}
