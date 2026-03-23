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

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize); };
  }, []);

  const isOpen = () => {
    const now = new Date();
    const day = now.getDay();
    const h = now.getHours() + now.getMinutes() / 60;
    if (day >= 1 && day <= 4) return h >= 13 && h < 22;
    if (day === 5 || day === 6) return h >= 13 && h < 23;
    if (day === 0) return h >= 13 && h < 21;
    return false;
  };
  const open = isOpen();

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#FAFAF7' }}>

      {/* ── HERO — full bleed video desktop, dark mobile ── */}
      <section style={{
        position: 'relative',
        minHeight: isDesktop ? '92vh' : 'auto',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: '#0C0A06',
      }}>
        {isDesktop && (
          <HeroVideo src="/videos/brasa.mp4" poster="/videos/brasa-poster.jpg" />
        )}

        <div style={{
          position: 'relative', zIndex: 2,
          maxWidth: 1200, margin: '0 auto',
          padding: isDesktop ? '80px 64px' : '48px 24px',
          display: 'grid',
          gridTemplateColumns: isDesktop ? '1fr 420px' : '1fr',
          gap: isDesktop ? 64 : 40,
          alignItems: 'center',
          width: '100%',
        }}>

          {/* Left — headline */}
          <div style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: open ? 'rgba(26,122,74,0.25)' : 'rgba(232,88,32,0.2)',
                color: open ? '#4ade80' : '#fb923c',
                border: `1px solid ${open ? 'rgba(74,222,128,0.3)' : 'rgba(251,146,60,0.3)'}`,
                fontSize: 12, fontWeight: 500, padding: '5px 14px', borderRadius: 20,
                backdropFilter: 'blur(8px)',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: open ? '#4ade80' : '#fb923c', boxShadow: open ? '0 0 8px #4ade80' : 'none', display: 'inline-block' }} />
                {open ? 'Abierto ahora' : 'Cerrado ahora'}
              </span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>· Zaragoza</span>
            </div>

            <h1 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: isDesktop ? 72 : 48,
              fontWeight: 600, lineHeight: 0.95,
              color: '#F5EFE6', margin: '0 0 24px',
              letterSpacing: '-2px',
            }}>
              A la brasa,<br />
              <em style={{ color: '#E85820', fontStyle: 'italic' }}>como tiene<br />que ser.</em>
            </h1>

            <p style={{ fontSize: isDesktop ? 17 : 15, color: 'rgba(245,239,230,0.60)', lineHeight: 1.75, maxWidth: 440, margin: '0 0 40px' }}>
              Carnes premium asadas a la brasa de leña de encina. Pedidos online para toda Zaragoza.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => onNavigate('menu')} style={{ background: '#E85820', color: '#fff', border: 'none', borderRadius: 32, padding: '15px 32px', fontSize: 15, fontWeight: 500, cursor: 'pointer', boxShadow: '0 4px 28px rgba(232,88,32,0.45)', transition: 'all 0.2s', fontFamily: "'Outfit', sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 36px rgba(232,88,32,0.55)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 28px rgba(232,88,32,0.45)'; }}>
                Ver la carta →
              </button>
              <button onClick={() => onNavigate('packs')} style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(245,239,230,0.85)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 32, padding: '15px 32px', fontSize: 15, fontWeight: 500, cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.2s', fontFamily: "'Outfit', sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                Ver packs
              </button>
            </div>

            <div style={{ display: 'flex', gap: 28, marginTop: 48, flexWrap: 'wrap' }}>
              {[{ icon: '🔥', text: 'Leña de encina' }, { icon: '⏱', text: 'Entrega en 90 min' }, { icon: '🌿', text: 'Ingredientes frescos' }].map(b => (
                <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 15 }}>{b.icon}</span>
                  <span style={{ fontSize: 13, color: 'rgba(245,239,230,0.45)' }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — glassmorphism order card */}
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(32px)', transition: 'all 0.9s cubic-bezier(0.4,0,0.2,1) 0.2s' }}>
            <div style={{ background: 'rgba(20,16,10,0.75)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 24, padding: 28, boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
              <p style={{ fontSize: 11, letterSpacing: '2.5px', color: '#E85820', marginBottom: 18, fontWeight: 600, textTransform: 'uppercase' }}>Especial del día</p>
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 20px', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <span style={{ fontSize: 38 }}>🥩</span>
                  <div>
                    <p style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: '#F5EFE6', margin: 0 }}>Chuletón de buey</p>
                    <p style={{ fontSize: 12, color: 'rgba(245,239,230,0.40)', margin: '3px 0 0' }}>1 kg · Madurado 45 días · Sal Maldon</p>
                  </div>
                  <span style={{ marginLeft: 'auto', fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 600, color: '#E85820' }}>€48</span>
                </div>
                <button onClick={() => addItem(products[0])} style={{ width: '100%', background: '#E85820', color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  Añadir al pedido
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[{ num: '+4 años', label: 'en Zaragoza' }, { num: '100%', label: 'leña encina' }, { num: '4.9 ★', label: 'Google Maps' }].map(stat => (
                  <div key={stat.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
                    <p style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, color: '#F5EFE6', margin: 0 }}>{stat.num}</p>
                    <p style={{ fontSize: 11, color: 'rgba(245,239,230,0.35)', margin: '3px 0 0' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        {isDesktop && (
          <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.4, zIndex: 2, animation: 'bounce 2s ease-in-out infinite' }}>
            <span style={{ fontSize: 11, letterSpacing: '2px', color: '#fff', textTransform: 'uppercase' }}>Explorar</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        )}
        <style>{`@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(6px)}}`}</style>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ background: '#fff', padding: '64px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 600, color: '#1C1A14', margin: 0 }}>
                Los más pedidos
              </h2>
              <p style={{ fontSize: 14, color: '#9A8F85', marginTop: 6 }}>
                Los platos que hacen volver a nuestros clientes
              </p>
            </div>
            <button
              onClick={() => onNavigate('menu')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, color: '#E85820', fontFamily: "'Outfit', sans-serif",
                fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3,
              }}
            >
              Ver carta completa →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {featured.slice(0, 3).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* PACKS SECTION */}
      <section style={{ padding: '64px 0', background: '#FAFAF7' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 600, color: '#1C1A14', margin: '0 0 8px' }}>
              Packs y promociones
            </h2>
            <p style={{ fontSize: 14, color: '#9A8F85' }}>
              Combina y ahorra. Pensados para compartir.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {packs.map((pack, idx) => (
              <div key={pack.id} style={{
                background: idx === 2 ? '#1C1A14' : '#fff',
                borderRadius: 20, padding: '28px 24px',
                border: idx === 2 ? 'none' : '1px solid #EDE9E3',
                position: 'relative', overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = idx === 2
                    ? '0 12px 40px rgba(28,26,20,0.3)'
                    : '0 8px 32px rgba(28,26,20,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {idx === 2 && (
                  <div style={{
                    position: 'absolute', top: -20, right: -20,
                    fontFamily: "'Fraunces', serif", fontSize: 80,
                    color: 'rgba(255,255,255,0.04)', userSelect: 'none',
                  }}>🔥</div>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <span style={{
                      display: 'inline-block',
                      background: idx === 2 ? '#E85820' : '#FEF3EE',
                      color: idx === 2 ? '#fff' : '#E85820',
                      fontSize: 11, fontWeight: 600, letterSpacing: '0.5px',
                      padding: '3px 10px', borderRadius: 20, marginBottom: 10,
                    }}>
                      {pack.badge}
                    </span>
                    <h3 style={{
                      fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600,
                      color: idx === 2 ? '#F0EBE3' : '#1C1A14', margin: 0,
                    }}>
                      {pack.name}
                    </h3>
                    <p style={{ fontSize: 12, color: idx === 2 ? 'rgba(240,235,227,0.5)' : '#9A8F85', marginTop: 3 }}>
                      {pack.subtitle}
                    </p>
                  </div>
                  <span style={{ fontSize: 32 }}>{pack.emoji}</span>
                </div>

                <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none' }}>
                  {pack.items.map(item => (
                    <li key={item} style={{
                      fontSize: 13, color: idx === 2 ? 'rgba(240,235,227,0.65)' : '#7A6E63',
                      padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <span style={{ color: '#E85820', fontSize: 10 }}>●</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{
                      fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600,
                      color: idx === 2 ? '#F0EBE3' : '#1C1A14',
                    }}>
                      €{pack.price}
                    </span>
                    <span style={{
                      fontSize: 13, color: idx === 2 ? 'rgba(240,235,227,0.4)' : '#9A8F85',
                      marginLeft: 8, textDecoration: 'line-through',
                    }}>
                      €{pack.originalPrice}
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate('packs')}
                    style={{
                      background: idx === 2 ? '#E85820' : '#1C1A14',
                      color: '#fff', border: 'none',
                      borderRadius: 24, padding: '10px 20px',
                      fontSize: 13, fontWeight: 500,
                      cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    Pedir pack
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: '#fff', padding: '64px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 600, color: '#1C1A14', textAlign: 'center', margin: '0 0 48px' }}>
            Pide en 3 pasos
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              { step: '01', icon: '📋', title: 'Elige tu plato', desc: 'Explora la carta, elige tus cortes favoritos y personaliza tu pedido con notas especiales.' },
              { step: '02', icon: '💳', title: 'Paga con seguridad', desc: 'Pago seguro con tarjeta o Bizum a través de Stripe. Tu información siempre protegida.' },
              { step: '03', icon: '🛵', title: 'Lo recibimos caliente', desc: 'Preparamos y enviamos tu pedido. Seguimiento en tiempo real hasta tu puerta en Zaragoza.' },
            ].map(s => (
              <div key={s.step} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: '#FEF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', fontSize: 28,
                }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: 11, letterSpacing: '2px', color: '#E85820', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                  {s.step}
                </span>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: '#1C1A14', margin: '0 0 10px' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: '#7A6E63', lineHeight: 1.65, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: '#1C1A14', padding: '64px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 40, fontWeight: 600, color: '#F0EBE3', margin: '0 0 16px', lineHeight: 1.15 }}>
            ¿Listo para el mejor chuletón<br />
            <em style={{ color: '#E85820' }}>de Zaragoza?</em>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(240,235,227,0.55)', lineHeight: 1.65, marginBottom: 32 }}>
            Pedido mínimo €20 · Envío gratis en pedidos +€35 · Toda Zaragoza
          </p>
          <button
            onClick={() => onNavigate('menu')}
            style={{
              background: '#E85820', color: '#fff', border: 'none',
              borderRadius: 28, padding: '16px 36px',
              fontSize: 16, fontWeight: 500, cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
              boxShadow: '0 4px 24px rgba(232,88,32,0.4)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Pedir ahora →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#111', padding: '48px 24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: '#F0EBE3', marginBottom: 12 }}>
                Oh<em style={{ color: '#E85820' }}>My</em>Grill Brasas
              </div>
              <p style={{ fontSize: 13, color: 'rgba(240,235,227,0.45)', lineHeight: 1.65, maxWidth: 260 }}>
                Carnes a la brasa de leña de encina. Pedidos online para Zaragoza.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 11, letterSpacing: '2px', color: '#E85820', marginBottom: 14, fontWeight: 600, textTransform: 'uppercase' }}>Carta</p>
              {['Carnes', 'Aves', 'Verduras', 'Salsas', 'Packs'].map(l => (
                <p key={l} style={{ fontSize: 13, color: 'rgba(240,235,227,0.5)', marginBottom: 8, cursor: 'pointer' }}>{l}</p>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 11, letterSpacing: '2px', color: '#E85820', marginBottom: 14, fontWeight: 600, textTransform: 'uppercase' }}>Info</p>
              {['Sobre nosotros', 'Zonas de reparto', 'FAQ', 'Contacto'].map(l => (
                <p key={l} style={{ fontSize: 13, color: 'rgba(240,235,227,0.5)', marginBottom: 8, cursor: 'pointer' }}>{l}</p>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 11, letterSpacing: '2px', color: '#E85820', marginBottom: 14, fontWeight: 600, textTransform: 'uppercase' }}>Horario</p>
              {Object.entries(restaurantInfo.hours).map(([day, hours]) => (
                <div key={day} style={{ marginBottom: 6 }}>
                  <p style={{ fontSize: 12, color: 'rgba(240,235,227,0.35)', margin: 0 }}>{day}</p>
                  <p style={{ fontSize: 13, color: 'rgba(240,235,227,0.65)', margin: '1px 0 0', fontWeight: 500 }}>{hours}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 12, color: 'rgba(240,235,227,0.3)', margin: 0 }}>
              © 2025 OhMyGrill Brasas · Zaragoza, España
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Política de privacidad', 'Cookies', 'Aviso legal'].map(l => (
                <span key={l} style={{ fontSize: 12, color: 'rgba(240,235,227,0.3)', cursor: 'pointer' }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
