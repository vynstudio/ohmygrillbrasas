import { useState, useEffect } from 'react';
import { products, packs } from '../data/menu';
import { useCart } from '../context/CartContext';
import HeroVideo from '../components/HeroVideo';
import PhotoPlaceholder from '../components/PhotoPlaceholder';

const S = { cream:'#FAF6EF', dark:'#1a1008', yellow:'#F5C842', border:'rgba(26,16,8,.1)', sub:'rgba(26,16,8,.5)', faint:'rgba(26,16,8,.3)', surface:'#F2EDE4' };
const featured = products.filter(p => ['chuleta-buey','costillas-iberico','pollo-corral','entrecot-angus'].includes(p.id));

function isOpen() {
  const n=new Date(),d=n.getDay(),h=n.getHours()+n.getMinutes()/60;
  if(d>=1&&d<=4) return h>=13&&h<22;
  if(d===5||d===6) return h>=13&&h<23;
  if(d===0) return h>=13&&h<21;
  return false;
}

// ── Desktop: right order panel ──────────────────────────────────────────────
function OrderPanel({ onNavigate }) {
  const { items, itemCount, subtotal, deliveryFee, total, deliveryType, deliveryZone, updateQty, setDeliveryType } = useCart();
  return (
    <div style={{ width:320, flexShrink:0, display:'flex', flexDirection:'column', background:S.yellow, height:'calc(100vh - 97px)', position:'sticky', top:97, borderLeft:`1px solid ${S.dark}`, overflow:'hidden' }}>
      <div style={{ padding:'20px 22px', borderBottom:`2px solid ${S.dark}` }}>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:600, color:S.dark }}>Tu pedido</div>
        <div style={{ fontSize:11, color:'rgba(26,16,8,.5)', marginTop:2 }}>{itemCount>0?`${itemCount} artículo${itemCount>1?'s':''}`:'Carrito vacío'}</div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'12px 22px' }}>
        {itemCount===0 ? (
          <div style={{ textAlign:'center', padding:'44px 12px' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(26,16,8,.2)" strokeWidth="1.5" style={{ margin:'0 auto 12px', display:'block' }}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:15, fontWeight:600, color:S.dark, marginBottom:4 }}>Carrito vacío</div>
            <div style={{ fontSize:12, color:'rgba(26,16,8,.5)', lineHeight:1.6 }}>Añade platos para empezar</div>
          </div>
        ) : items.map(item => (
          <div key={item.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid rgba(26,16,8,.15)' }}>
            <PhotoPlaceholder height={32} width={32} borderRadius={6} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:600, color:S.dark, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
              <div style={{ fontSize:10, color:'rgba(26,16,8,.5)' }}>€{item.price.toFixed(2)}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              <button onClick={()=>updateQty(item.id,item.qty-1)} style={{ width:22, height:22, border:'2px solid #1a1008', background:'transparent', borderRadius:'50%', cursor:'pointer', fontSize:13, fontWeight:700, color:S.dark, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
              <span style={{ fontSize:12, fontWeight:700, color:S.dark, minWidth:14, textAlign:'center' }}>{item.qty}</span>
              <button onClick={()=>updateQty(item.id,item.qty+1)} style={{ width:22, height:22, border:'none', background:S.dark, borderRadius:'50%', cursor:'pointer', fontSize:13, fontWeight:700, color:S.yellow, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
            </div>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:13, fontWeight:600, color:S.dark, minWidth:38, textAlign:'right' }}>€{(item.price*item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>
      {itemCount>0 && (
        <div style={{ padding:'10px 22px', borderTop:'1px solid rgba(26,16,8,.15)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
            {[{id:'delivery',label:'Entrega'},{id:'pickup',label:'Recogida'}].map(o=>(
              <button key={o.id} onClick={()=>setDeliveryType(o.id)} style={{ padding:'8px', border:'2px solid #1a1008', background:deliveryType===o.id?S.dark:'transparent', color:deliveryType===o.id?S.yellow:S.dark, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>{o.label}</button>
            ))}
          </div>
        </div>
      )}
      <div style={{ padding:'14px 22px', borderTop:`2px solid ${S.dark}`, background:S.cream }}>
        {itemCount>0 && (<>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:13, color:S.sub }}><span>Subtotal</span><span style={{ fontWeight:600, color:S.dark }}>€{subtotal.toFixed(2)}</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12, fontSize:13, color:S.sub }}><span>Envío</span><span style={{ fontWeight:600, color:S.dark }}>{deliveryType==='pickup'?'Gratis':deliveryZone?`€${deliveryFee.toFixed(2)}`:'—'}</span></div>
        </>)}
        <button onClick={()=>onNavigate(itemCount>0?'checkout':'menu')} style={{ width:'100%', background:S.dark, color:S.yellow, border:'none', borderRadius:12, padding:14, fontFamily:'inherit', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          {itemCount>0?`Finalizar pedido · €${(deliveryType==='delivery'&&deliveryZone?total:subtotal).toFixed(2)} →`:'Pedir ahora →'}
        </button>
      </div>
    </div>
  );
}

// ── Desktop menu row ─────────────────────────────────────────────────────────
function MenuRow({ product }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find(i=>i.id===product.id);
  const handleAdd = () => { addItem(product); setAdded(true); setTimeout(()=>setAdded(false),1300); };
  return (
    <div style={{ display:'flex', alignItems:'center', gap:18, padding:'20px 0', borderBottom:`1px solid ${S.border}` }}>
      <div style={{ position:'relative', flexShrink:0 }}>
        <PhotoPlaceholder height={64} width={64} borderRadius={10} />
        {inCart?.qty>0 && <span style={{ position:'absolute', top:-5, right:-5, background:S.yellow, color:S.dark, fontSize:9, fontWeight:700, width:17, height:17, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>{inCart.qty}</span>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:17, fontWeight:500, color:S.dark, letterSpacing:'-.2px' }}>{product.name}</span>
          {product.badge && <span style={{ background:S.yellow, color:S.dark, fontSize:10, fontWeight:600, padding:'2px 9px', borderRadius:20 }}>{product.badge}</span>}
        </div>
        <div style={{ fontSize:12, color:S.sub, lineHeight:1.55, marginBottom:3 }}>{product.description}</div>
        <div style={{ fontSize:11, color:S.faint, letterSpacing:'.3px' }}>{product.weight}</div>
      </div>
      <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10 }}>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:600, color:S.dark }}>€{product.price%1===0?product.price:product.price.toFixed(2)}</span>
        <button onClick={handleAdd} style={{ background:added?S.dark:S.yellow, color:added?S.yellow:S.dark, border:'none', borderRadius:20, padding:'7px 18px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all .15s' }}>
          {added?'✓ Añadido':'+ Añadir'}
        </button>
      </div>
    </div>
  );
}

// ── Mobile hero ───────────────────────────────────────────────────────────────
function MobileHero({ onNavigate }) {
  const { addItem } = useCart();
  const open = isOpen();
  const chuleta = products.find(p=>p.id==='chuleta-buey');
  return (
    <div style={{ background:S.cream }}>
      {/* Ticker */}
      <div style={{ background:S.yellow, borderBottom:`1px solid rgba(26,16,8,.1)`, overflow:'hidden', padding:'7px 0' }}>
        <div className="ticker-track">
          {['Leña de encina','·','Desde 2013','·','Entrega 90 min','·','Zaragoza','·','4.9 Google','·','Leña de encina','·','Desde 2013','·','Entrega 90 min','·','Zaragoza','·','4.9 Google','·'].map((t,i)=>(
            <span key={i} style={{ fontSize:11, fontWeight:600, color:S.dark, padding:'0 16px', letterSpacing:'.5px' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Nav row */}
      <div style={{ padding:'14px 20px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:600, color:S.dark, lineHeight:1, letterSpacing:'-.3px' }}>OhMyGrill</div>
          <div style={{ fontSize:9, color:S.faint, letterSpacing:'1.5px', textTransform:'uppercase', marginTop:2 }}>Brasas · Zaragoza</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, background:open?S.dark:'rgba(26,16,8,.08)', padding:'6px 12px', borderRadius:20 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:open?S.yellow:'rgba(26,16,8,.25)' }} />
          <span style={{ fontSize:11, fontWeight:600, color:open?S.yellow:'rgba(26,16,8,.5)' }}>{open?'Abierto':'Cerrado'}</span>
        </div>
      </div>

      {/* Hero section */}
      <div style={{ position:'relative', background:S.dark, minHeight:380, display:'flex', alignItems:'flex-end', overflow:'hidden' }}>
        <HeroVideo src="/videos/brasa.mp4" poster="/videos/brasa-poster.jpg" />
        <div style={{ position:'relative', zIndex:2, padding:'28px 20px 24px', width:'100%' }}>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:44, fontWeight:400, color:'#fff', lineHeight:.9, letterSpacing:'-1.8px', marginBottom:6 }}>A la brasa,</h1>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:44, fontWeight:400, color:S.yellow, lineHeight:.9, letterSpacing:'-1.8px', fontStyle:'italic', marginBottom:16 }}>como tiene que ser.</h1>
          <p style={{ fontSize:14, color:'rgba(255,255,255,.5)', lineHeight:1.65, marginBottom:22, maxWidth:280 }}>Carnes premium a la brasa de leña de encina. Pedidos para Zaragoza.</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <button onClick={()=>onNavigate('menu')} style={{ background:S.yellow, color:S.dark, border:'none', borderRadius:50, padding:'14px 18px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Pedir ahora →</button>
            <button onClick={()=>onNavigate('packs')} style={{ background:'rgba(255,255,255,.1)', color:'rgba(255,255,255,.8)', border:'1px solid rgba(255,255,255,.2)', borderRadius:50, padding:'14px 18px', fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>Ver packs</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', background:S.surface, borderBottom:`1px solid ${S.border}` }}>
        {[{n:'+10',l:'años'},{n:'100%',l:'encina'},{n:'4.9★',l:'Google'},{n:"90'",l:'entrega'}].map((s,i)=>(
          <div key={s.l} style={{ padding:'14px 8px', textAlign:'center', borderRight:i<3?`1px solid ${S.border}`:'none' }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:17, fontWeight:600, color:S.dark }}>{s.n}</div>
            <div style={{ fontSize:9, color:S.faint, marginTop:3, letterSpacing:'.5px' }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Special card */}
      {chuleta && (
        <div style={{ margin:20, background:S.dark, borderRadius:16, overflow:'hidden' }}>
          <div style={{ background:'rgba(255,255,255,.04)', height:140, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
            <PhotoPlaceholder height={140} borderRadius={0} />
            <span style={{ position:'absolute', top:12, left:12, background:S.yellow, color:S.dark, fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:10 }}>Especial del día</span>
          </div>
          <div style={{ padding:'18px 20px 20px' }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:400, color:'#fff', marginBottom:4, letterSpacing:'-.3px' }}>{chuleta.name}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.44)', lineHeight:1.55, marginBottom:16 }}>{chuleta.description}</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontFamily:"'Fraunces',serif", fontSize:28, fontWeight:600, color:S.yellow }}>€{chuleta.price}</span>
              <button onClick={()=>addItem(chuleta)} style={{ background:S.yellow, color:S.dark, border:'none', borderRadius:50, padding:'12px 22px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Añadir al pedido</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Mobile item row ───────────────────────────────────────────────────────────
function MobileItemRow({ product }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find(i=>i.id===product.id);
  const handleAdd = () => { addItem(product); setAdded(true); setTimeout(()=>setAdded(false),1300); };
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px', borderBottom:`1px solid ${S.border}`, background:S.cream }}>
      <div style={{ position:'relative', flexShrink:0 }}>
        <PhotoPlaceholder height={58} width={58} borderRadius={10} />
        {inCart?.qty>0 && <span style={{ position:'absolute', top:-5, right:-5, background:S.yellow, color:S.dark, fontSize:8, fontWeight:700, width:16, height:16, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>{inCart.qty}</span>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap', marginBottom:4 }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:15, fontWeight:500, color:S.dark, letterSpacing:'-.2px' }}>{product.name}</span>
          {product.badge && <span style={{ background:S.yellow, color:S.dark, fontSize:9, fontWeight:700, padding:'1px 7px', borderRadius:10 }}>{product.badge}</span>}
        </div>
        <div style={{ fontSize:11, color:S.sub, lineHeight:1.45, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{product.description}</div>
      </div>
      <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:17, fontWeight:600, color:S.dark }}>€{product.price%1===0?product.price:product.price.toFixed(2)}</span>
        <button onClick={handleAdd} style={{ background:added?S.dark:S.yellow, color:added?S.yellow:S.dark, border:'none', borderRadius:50, padding:'7px 14px', fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit', minWidth:72, transition:'all .15s' }}>
          {added?'✓':inCart?.qty>0?`(${inCart.qty})+`:'+ Añadir'}
        </button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function HomePage({ onNavigate }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(()=>setVisible(true), 60);
    const fn = ()=>setIsMobile(window.innerWidth<768);
    window.addEventListener('resize',fn);
    return ()=>{ clearTimeout(t); window.removeEventListener('resize',fn); };
  }, []);

  // MOBILE
  if (isMobile) return (
    <div style={{ background:S.cream, minHeight:'100vh' }}>
      <MobileHero onNavigate={onNavigate} />
      <div style={{ padding:'22px 20px 10px', display:'flex', alignItems:'baseline', justifyContent:'space-between', borderBottom:`1px solid ${S.border}` }}>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:400, color:S.dark, letterSpacing:'-.5px' }}>Los más pedidos</div>
        <button onClick={()=>onNavigate('menu')} style={{ background:'none', border:'none', fontSize:13, fontWeight:600, color:S.sub, cursor:'pointer', textDecoration:'underline', textUnderlineOffset:2 }}>Ver todo →</button>
      </div>
      {featured.map(p=><MobileItemRow key={p.id} product={p} />)}
      {/* Packs band */}
      <div onClick={()=>onNavigate('packs')} style={{ background:S.dark, padding:'24px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}>
        <div>
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:S.yellow, marginBottom:8 }}>Packs y combos</div>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:400, color:'#fff', letterSpacing:'-.5px', marginBottom:5 }}>Todo lo que necesitas.</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,.4)' }}>Ahorra hasta €14 por pedido.</div>
        </div>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:40, fontWeight:400, color:S.yellow, flexShrink:0, marginLeft:16 }}>→</div>
      </div>
    </div>
  );

  // DESKTOP SPLIT SCREEN
  return (
    <div style={{ display:'flex', minHeight:'calc(100vh - 97px)', background:S.cream }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Dark hero */}
        <section style={{ position:'relative', background:S.dark, minHeight:460, display:'flex', alignItems:'center', borderBottom:`1px solid rgba(255,255,255,.06)`, overflow:'hidden' }}>
          <HeroVideo src="/videos/brasa.mp4" poster="/videos/brasa-poster.jpg" />
          <div style={{ position:'relative', zIndex:2, padding:'64px 56px', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(18px)', transition:'all .7s' }}>
            <div style={{ fontSize:10, letterSpacing:'3px', color:S.yellow, textTransform:'uppercase', marginBottom:20, fontWeight:600 }}>Brasas · Zaragoza · Est. 2013</div>
            <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:72, fontWeight:400, color:'#fff', lineHeight:.9, letterSpacing:'-2.5px', marginBottom:8 }}>A la brasa,</h1>
            <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:72, fontWeight:400, color:S.yellow, fontStyle:'italic', lineHeight:.9, letterSpacing:'-2.5px', marginBottom:26 }}>como tiene que ser.</h1>
            <p style={{ fontSize:16, color:'rgba(255,255,255,.48)', lineHeight:1.75, maxWidth:400, marginBottom:38 }}>Carnes premium a la brasa de leña de encina. Pedidos para toda Zaragoza.</p>
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={()=>onNavigate('menu')} style={{ background:S.yellow, color:S.dark, border:'none', borderRadius:32, padding:'15px 34px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Pedir ahora →</button>
              <button onClick={()=>onNavigate('packs')} style={{ background:'rgba(255,255,255,.08)', color:'rgba(255,255,255,.8)', border:'1px solid rgba(255,255,255,.18)', borderRadius:32, padding:'15px 30px', fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>Ver packs</button>
            </div>
            <div style={{ display:'flex', gap:28, marginTop:44, paddingTop:28, borderTop:'1px solid rgba(255,255,255,.08)' }}>
              {[{n:'+10 años',l:'en Zaragoza'},{n:'100% encina',l:'siempre leña'},{n:'4.9 ★',l:'Google Maps'},{n:"90'",l:'entrega'}].map(s=>(
                <div key={s.l}><div style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:600, color:S.yellow }}>{s.n}</div><div style={{ fontSize:10, color:'rgba(255,255,255,.3)', marginTop:3, letterSpacing:'.5px' }}>{s.l}</div></div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured menu */}
        <div style={{ padding:'40px 56px', flex:1, background:S.cream }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:28 }}>
            <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:32, fontWeight:400, color:S.dark, letterSpacing:'-.8px' }}>Los más pedidos</h2>
            <button onClick={()=>onNavigate('menu')} style={{ background:'none', border:'none', fontSize:13, fontWeight:600, color:S.sub, cursor:'pointer', textDecoration:'underline', textUnderlineOffset:2 }}>Ver carta completa →</button>
          </div>
          {featured.map(p=><MenuRow key={p.id} product={p} />)}
        </div>

        {/* Packs CTA band */}
        <div onClick={()=>onNavigate('packs')} style={{ background:S.dark, padding:'28px 56px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', transition:'background .15s' }}
          onMouseEnter={e=>e.currentTarget.style.background='#2a1a08'} onMouseLeave={e=>e.currentTarget.style.background=S.dark}>
          <div>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:'2.5px', textTransform:'uppercase', color:S.yellow, marginBottom:8 }}>Packs y combos</div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:28, fontWeight:400, color:'#fff', letterSpacing:'-.8px' }}>Todo lo que necesitas — Ahorra hasta €14</div>
          </div>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:44, fontWeight:400, color:S.yellow, flexShrink:0 }}>→</div>
        </div>

        {/* Footer */}
        <footer style={{ background:S.dark, padding:'20px 56px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:S.yellow }}>OhMyGrill Brasas</div>
          <div style={{ display:'flex', gap:24 }}>
            {['about','contact'].map(id=>(
              <button key={id} onClick={()=>onNavigate(id)} style={{ background:'none', border:'none', fontSize:12, color:'rgba(255,255,255,.28)', cursor:'pointer', fontFamily:'inherit' }}>{id==='about'?'Nosotros':'Contacto'}</button>
            ))}
          </div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.15)' }}>© 2026 OhMyGrill Brasas · Zaragoza</div>
        </footer>
      </div>
      <OrderPanel onNavigate={onNavigate} />
    </div>
  );
}
