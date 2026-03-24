import { useState, useEffect } from 'react';
import { products, packs, restaurantInfo } from '../data/menu';
import ProductCard from '../components/ProductCard';
import HeroVideo from '../components/HeroVideo';
import { useCart } from '../context/CartContext';

const featured = products.filter(p => ['chuleta-buey','costillas-iberico','pollo-corral'].includes(p.id));

export default function HomePage({ onNavigate }) {
  const { addItem } = useCart();
  const [heroVisible, setHeroVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    const onResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize); };
  }, []);

  const isOpen = () => {
    const now = new Date(); const day = now.getDay(); const h = now.getHours() + now.getMinutes() / 60;
    if (day >= 1 && day <= 4) return h >= 13 && h < 22;
    if (day === 5 || day === 6) return h >= 13 && h < 23;
    if (day === 0) return h >= 13 && h < 21;
    return false;
  };
  const open = isOpen();

  return (
    <div style={{ fontFamily:"'Outfit',sans-serif", background:'#0F0800' }}>

      {/* ── HERO ── */}
      <section style={{ position:'relative', minHeight: isDesktop ? '92vh' : isMobile ? '100svh' : '80vh', display:'flex', alignItems:'center', overflow:'hidden', background:'#0C0A06' }}>
        {isDesktop && <HeroVideo src="/videos/brasa.mp4" poster="/videos/brasa-poster.jpg" />}

        <div style={{ position:'relative', zIndex:2, maxWidth:1200, margin:'0 auto', padding: isDesktop ? '80px 64px' : isMobile ? '40px 20px 48px' : '60px 32px', display:'grid', gridTemplateColumns: isDesktop ? '1fr 420px' : '1fr', gap: isDesktop ? 64 : 0, alignItems:'center', width:'100%' }}>

          {/* Headline */}
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(28px)', transition:'all 0.8s cubic-bezier(0.4,0,0.2,1)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom: isMobile ? 20 : 28 }}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6, background: '#1A1000', color: open ? '#FFD43A' : 'rgba(255,255,255,0.55)', border:'1px solid #2A1A00', fontSize:12, fontWeight:500, padding:'5px 14px', borderRadius:20, backdropFilter:'blur(8px)' }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background: open ? '#4ade80' : '#fb923c', boxShadow: open ? '0 0 8px #4ade80' : 'none', display:'inline-block' }} />
                {open ? 'Abierto ahora' : 'Cerrado ahora'}
              </span>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>· Zaragoza</span>
            </div>

            <h1 style={{ fontFamily:"'Fraunces',serif", fontSize: isMobile ? 52 : isDesktop ? 72 : 60, fontWeight:600, lineHeight:0.95, color:'#F5EFE6', margin:`0 0 ${isMobile ? 20 : 24}px`, letterSpacing:'-2px' }}>
              A la brasa,<br />
              <em style={{ color:'#FFD43A', fontStyle:'italic' }}>como tiene<br />que ser.</em>
            </h1>

            <p style={{ fontSize: isMobile ? 15 : 17, color:'rgba(245,239,230,0.60)', lineHeight:1.75, maxWidth:440, margin:`0 0 ${isMobile ? 28 : 40}px` }}>
              Carnes premium a la brasa de leña de encina. Pedidos online para toda Zaragoza.
            </p>

            <div style={{ display:'flex', gap:12, flexDirection: isMobile ? 'column' : 'row' }}>
              <button onClick={() => onNavigate('menu')} style={{ background:'#FFD43A', color:'#fff', border:'none', borderRadius:32, padding: isMobile ? '16px 24px' : '15px 32px', fontSize:15, fontWeight:500, cursor:'pointer', , transition:'all 0.2s', fontFamily:"'Outfit',sans-serif", textAlign:'center' }}>
                Ver la carta →
              </button>
              <button onClick={() => onNavigate('packs')} style={{ background:'rgba(255,255,255,0.08)', color:'rgba(245,239,230,0.85)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:32, padding: isMobile ? '16px 24px' : '15px 32px', fontSize:15, fontWeight:500, cursor:'pointer', backdropFilter:'blur(8px)', transition:'all 0.2s', fontFamily:"'Outfit',sans-serif", textAlign:'center' }}>
                Ver packs
              </button>
            </div>

            <div style={{ display:'flex', gap: isMobile ? 16 : 28, marginTop: isMobile ? 28 : 48, flexWrap:'wrap' }}>
              {[{icon:'🔥',text:'Leña de encina'},{icon:'⏱',text:'Entrega 90 min'},{icon:'🌿',text:'Ingredientes frescos'}].map(b => (
                <div key={b.text} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontSize:14 }}>{b.icon}</span>
                  <span style={{ fontSize:12, color:'rgba(245,239,230,0.45)' }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order card — desktop only */}
          {isDesktop && (
            <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(32px)', transition:'all 0.9s cubic-bezier(0.4,0,0.2,1) 0.2s' }}>
              <div style={{ background:'rgba(20,16,10,0.75)', backdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.10)', borderRadius:24, padding:28, boxShadow:'0 32px 80px rgba(0,0,0,0.5)' }}>
                <p style={{ fontSize:11, letterSpacing:'2.5px', color:'#FFD43A', marginBottom:18, fontWeight:600, textTransform:'uppercase' }}>Especial del día</p>
                <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'18px 20px', marginBottom:14 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
                    <span style={{ fontSize:38 }}>🥩</span>
                    <div>
                      <p style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:600, color:'#F5EFE6', margin:0 }}>Chuletón de buey</p>
                      <p style={{ fontSize:12, color:'rgba(245,239,230,0.40)', margin:'3px 0 0' }}>1 kg · Madurado 45 días · Sal Maldon</p>
                    </div>
                    <span style={{ marginLeft:'auto', fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:600, color:'#FFD43A' }}>€48</span>
                  </div>
                  <button onClick={() => addItem(products[0])} style={{ width:'100%', background:'#FFD43A', color:'#fff', border:'none', borderRadius:10, padding:'11px', fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:500, cursor:'pointer' }}>
                    Añadir al pedido
                  </button>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                  {[{num:'+4 años',label:'en Zaragoza'},{num:'100%',label:'leña encina'},{num:'4.9 ★',label:'Google Maps'}].map(s => (
                    <div key={s.label} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'12px 10px', textAlign:'center' }}>
                      <p style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'#F5EFE6', margin:0 }}>{s.num}</p>
                      <p style={{ fontSize:11, color:'rgba(245,239,230,0.35)', margin:'3px 0 0' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mobile stats strip */}
          {isMobile && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginTop:32 }}>
              {[{num:'+4 años',label:'Zaragoza'},{num:'100%',label:'Leña encina'},{num:'4.9 ★',label:'Google'}].map(s => (
                <div key={s.label} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'10px 8px', textAlign:'center' }}>
                  <p style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:'#F5EFE6', margin:0 }}>{s.num}</p>
                  <p style={{ fontSize:10, color:'rgba(245,239,230,0.35)', margin:'2px 0 0' }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {isDesktop && (
          <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:6, opacity:0.4, zIndex:2, animation:'bounce 2s ease-in-out infinite' }}>
            <span style={{ fontSize:11, letterSpacing:'2px', color:'#fff', textTransform:'uppercase' }}>Explorar</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        )}
        <style>{`@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(6px)}}`}</style>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section style={{ background:'#1A1000', padding: isMobile ? '48px 0' : '72px 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:`0 ${isMobile ? 20 : 24}px` }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: isMobile ? 24 : 36 }}>
            <div>
              <h2 style={{ fontFamily:"'Fraunces',serif", fontSize: isMobile ? 26 : 34, fontWeight:600, color:'#FFFFFF', margin:0 }}>Los más pedidos</h2>
              {!isMobile && <p style={{ fontSize:14, color:'rgba(255,255,255,0.45)', marginTop:6 }}>Los platos que hacen volver a nuestros clientes</p>}
            </div>
            <button onClick={() => onNavigate('menu')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:'#FFD43A', fontFamily:"'Outfit',sans-serif", fontWeight:500, textDecoration:'underline', textUnderlineOffset:3, whiteSpace:'nowrap' }}>
              Ver todo →
            </button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 14 : 20 }}>
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── PACKS ── */}
      <section style={{ padding: isMobile ? '48px 0' : '72px 0', background:'#0F0800' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:`0 ${isMobile ? 20 : 24}px` }}>
          <div style={{ textAlign:'center', marginBottom: isMobile ? 28 : 44 }}>
            <h2 style={{ fontFamily:"'Fraunces',serif", fontSize: isMobile ? 26 : 34, fontWeight:600, color:'#FFFFFF', margin:`0 0 ${isMobile ? 6 : 8}px` }}>Packs y promociones</h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.45)' }}>Combina y ahorra. Pensados para compartir.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 14 : 20 }}>
            {packs.map((pack, idx) => (
              <div key={pack.id} style={{ background: idx===2 ? '#0F0800' : '#fff', borderRadius:20, padding: isMobile ? '22px 20px' : '28px 24px', border: idx===2 ? 'none' : '1px solid #2A1A00', position:'relative', overflow:'hidden' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
                  <div>
                    <span style={{ display:'inline-block', background: idx===2 ? '#FFD43A' : '#1A1000', color: idx===2 ? '#fff' : '#FFD43A', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, marginBottom:8 }}>{pack.badge}</span>
                    <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:600, color: '#FFFFFF', margin:0 }}>{pack.name}</h3>
                    <p style={{ fontSize:12, color: 'rgba(255,255,255,0.45)', marginTop:2 }}>{pack.subtitle}</p>
                  </div>
                  <span style={{ fontSize:30 }}>{pack.emoji}</span>
                </div>
                <ul style={{ margin:'0 0 16px', padding:0, listStyle:'none' }}>
                  {pack.items.map(item => (
                    <li key={item} style={{ fontSize:13, color: 'rgba(255,255,255,0.45)', padding:'3px 0', display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ color:'#FFD43A', fontSize:10 }}>●</span>{item}
                    </li>
                  ))}
                </ul>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <span style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:600, color: '#FFFFFF' }}>€{pack.price}</span>
                    <span style={{ fontSize:13, color: 'rgba(255,255,255,0.35)', marginLeft:8, textDecoration:'line-through' }}>€{pack.originalPrice}</span>
                  </div>
                  <button onClick={() => onNavigate('packs')} style={{ background: idx===2 ? '#FFD43A' : '#0F0800', color:'#fff', border:'none', borderRadius:24, padding:'10px 20px', fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>
                    Pedir pack
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background:'#1A1000', padding: isMobile ? '48px 0' : '72px 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:`0 ${isMobile ? 20 : 24}px` }}>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize: isMobile ? 26 : 34, fontWeight:600, color:'#FFD43A', textAlign:'center', margin:`0 0 ${isMobile ? 32 : 52}px` }}>Pide en 3 pasos</h2>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 28 : 40 }}>
            {[
              {step:'01',icon:'📋',title:'Elige tu plato',desc:'Explora la carta, elige tus cortes favoritos y personaliza tu pedido con notas especiales.'},
              {step:'02',icon:'💳',title:'Paga con seguridad',desc:'Pago seguro con tarjeta a través de Stripe. Tu información siempre protegida.'},
              {step:'03',icon:'🛵',title:'Lo recibes caliente',desc:'Preparamos y enviamos tu pedido. Seguimiento en tiempo real hasta tu puerta en Zaragoza.'},
            ].map(s => (
              <div key={s.step} style={{ display:'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 16 : 0, textAlign: isMobile ? 'left' : 'center' }}>
                <div style={{ width:56, height:56, borderRadius:'50%', background:'#2A1A00', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:24, marginBottom: isMobile ? 0 : 16 }}>
                  {s.icon}
                </div>
                <div>
                  <span style={{ fontSize:11, letterSpacing:'2px', color:'#FFD43A', fontWeight:600, display:'block', marginBottom:4 }}>{s.step}</span>
                  <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:600, color:'#FFFFFF', margin:'0 0 6px' }}>{s.title}</h3>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,0.45)', lineHeight:1.6, margin:0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'#0F0800', padding: isMobile ? '56px 20px' : '80px 24px' }}>
        <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize: isMobile ? 32 : 44, fontWeight:600, color:'#FFFFFF', margin:`0 0 ${isMobile ? 12 : 16}px`, lineHeight:1.1 }}>
            ¿Listo para el mejor chuletón{' '}
            <em style={{ color:'#FFD43A' }}>de Zaragoza?</em>
          </h2>
          <p style={{ fontSize: isMobile ? 14 : 15, color:'rgba(240,235,227,0.5)', lineHeight:1.65, marginBottom: isMobile ? 28 : 36 }}>
            Pedido mínimo €20 · Envío gratis +€35 · Toda Zaragoza
          </p>
          <button onClick={() => onNavigate('menu')} style={{ background:'#FFD43A', color:'#fff', border:'none', borderRadius:32, padding: isMobile ? '15px 32px' : '16px 40px', fontSize: isMobile ? 15 : 16, fontWeight:500, cursor:'pointer', fontFamily:"'Outfit',sans-serif", , width: isMobile ? '100%' : 'auto' }}>
            Pedir ahora →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#111', padding: isMobile ? '40px 20px 28px' : '52px 24px 32px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr', gap: isMobile ? 28 : 40, marginBottom: isMobile ? 28 : 40 }}>
            <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:600, color:'#FFFFFF', marginBottom:10 }}>
                Oh<em style={{ color:'#FFD43A' }}>My</em>Grill Brasas
              </div>
              <p style={{ fontSize:13, color:'rgba(240,235,227,0.4)', lineHeight:1.65, maxWidth:260 }}>
                Carnes a la brasa de leña de encina. Pedidos online para Zaragoza.
              </p>
            </div>
            <div>
              <p style={{ fontSize:11, letterSpacing:'2px', color:'#FFD43A', marginBottom:12, fontWeight:600, textTransform:'uppercase' }}>Carta</p>
              {['Carnes','Aves','Verduras','Salsas','Packs'].map(l => <p key={l} style={{ fontSize:13, color:'rgba(240,235,227,0.45)', marginBottom:7, cursor:'pointer' }}>{l}</p>)}
            </div>
            <div>
              <p style={{ fontSize:11, letterSpacing:'2px', color:'#FFD43A', marginBottom:12, fontWeight:600, textTransform:'uppercase' }}>Info</p>
              {['Sobre nosotros','Reparto','FAQ','Contacto'].map(l => <p key={l} style={{ fontSize:13, color:'rgba(240,235,227,0.45)', marginBottom:7, cursor:'pointer' }}>{l}</p>)}
            </div>
            {!isMobile && (
              <div>
                <p style={{ fontSize:11, letterSpacing:'2px', color:'#FFD43A', marginBottom:12, fontWeight:600, textTransform:'uppercase' }}>Horario</p>
                {Object.entries(restaurantInfo.hours).map(([day, h]) => (
                  <div key={day} style={{ marginBottom:6 }}>
                    <p style={{ fontSize:11, color:'rgba(240,235,227,0.3)', margin:0 }}>{day}</p>
                    <p style={{ fontSize:12, color:'rgba(240,235,227,0.6)', margin:'1px 0 0', fontWeight:500 }}>{h}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:20, display:'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent:'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 10 : 0 }}>
            <p style={{ fontSize:12, color:'rgba(240,235,227,0.25)', margin:0 }}>© 2025 OhMyGrill Brasas · Zaragoza</p>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              {['Privacidad','Cookies','Aviso legal'].map(l => <span key={l} style={{ fontSize:12, color:'rgba(240,235,227,0.25)', cursor:'pointer' }}>{l}</span>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
