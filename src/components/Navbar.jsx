import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function Navbar({ activePage, onNavigate, onCartOpen }) {
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { id: 'home', label: 'Inicio' },
    { id: 'menu', label: 'Carta' },
    { id: 'packs', label: 'Packs' },
    { id: 'about', label: 'Nosotros' },
    { id: 'contact', label: 'Contacto' },
  ];

  return (
    <>
      {/* Top announcement bar */}
      <div style={{
        background: '#E85820',
        color: '#fff',
        textAlign: 'center',
        fontSize: '12px',
        letterSpacing: '1.5px',
        padding: '8px 16px',
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 500,
      }}>
        🔥 ENVÍO GRATIS EN PEDIDOS +€35 · ZARAGOZA · ENTREGA EN 90 MIN
      </div>

      {/* Main nav */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: '1px solid #EDE9E3',
        transition: 'all 0.2s ease',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}>
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontFamily: "'Fraunces', serif",
              fontSize: 22,
              fontWeight: 600,
              color: '#1C1A14',
              letterSpacing: '-0.5px',
            }}
          >
            Oh<em style={{ color: '#E85820', fontStyle: 'italic' }}>My</em>Grill
            <span style={{ fontSize: 13, fontWeight: 300, color: '#9A8F85', marginLeft: 6, fontFamily: "'Outfit', sans-serif" }}>Brasas</span>
          </button>

          {/* Desktop links */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {links.map(link => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: activePage === link.id ? 500 : 400,
                  color: activePage === link.id ? '#E85820' : '#7A6E63',
                  padding: '4px 0',
                  borderBottom: activePage === link.id ? '2px solid #E85820' : '2px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Cart button */}
          <button
            onClick={onCartOpen}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: itemCount > 0 ? '#1C1A14' : 'transparent',
              border: '1.5px solid',
              borderColor: itemCount > 0 ? '#1C1A14' : '#D4CFC9',
              color: itemCount > 0 ? '#fff' : '#7A6E63',
              borderRadius: 24,
              padding: '8px 16px',
              cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {itemCount > 0 ? `${itemCount} ${itemCount === 1 ? 'artículo' : 'artículos'}` : 'Carrito'}
          </button>
        </div>
      </nav>
    </>
  );
}
