import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function Navbar({ activePage, onNavigate, onCartOpen }) {
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleNav = (id) => { setMobileOpen(false); onNavigate(id); };

  const links = [
    { id: 'home', label: 'Inicio' },
    { id: 'menu', label: 'Carta' },
    { id: 'packs', label: 'Packs' },
    { id: 'about', label: 'Nosotros' },
    { id: 'contact', label: 'Contacto' },
  ];

  return (
    <>
      <div style={{ background:'#F5C518', color:'#fff', textAlign:'center', fontSize: isMobile ? 11 : 12, letterSpacing:'1px', padding: isMobile ? '7px 12px' : '8px 16px', fontFamily:"'Outfit',sans-serif", fontWeight:500, lineHeight:1.4 }}>
        🔥 ENVÍO GRATIS +€35 · ZARAGOZA · 90 MIN
      </div>
      <nav style={{ position:'sticky', top:0, zIndex:100, background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom:'1px solid #EDE9E3', transition:'all 0.2s ease', boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 20px', display:'flex', alignItems:'center', justifyContent:'space-between', height:60 }}>
          <button onClick={() => handleNav('home')} style={{ background:'none', border:'none', cursor:'pointer', padding:0, display:'flex', alignItems:'center', gap:8 }}>
            <img src="/logo.png" alt="OhMyGrill Brasas" style={{ height: isMobile ? 44 : 50, width: 'auto', objectFit:'contain' }} />
            {!isMobile && <span style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:600, color:'#1C1A14', letterSpacing:'-0.3px' }}>Oh<em style={{ color:'#F5C518', fontStyle:'italic' }}>My</em>Grill <span style={{ fontSize:12, fontWeight:300, color:'#9A8F85', fontFamily:"'Outfit',sans-serif" }}>Brasas</span></span>}
          </button>

          {!isMobile && (
            <div style={{ display:'flex', gap:28, alignItems:'center' }}>
              {links.map(l => (
                <button key={l.id} onClick={() => handleNav(l.id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, fontFamily:"'Outfit',sans-serif", fontWeight: activePage===l.id ? 500 : 400, color: activePage===l.id ? '#F5C518' : '#7A6E63', padding:'4px 0', borderBottom: activePage===l.id ? '2px solid #F5C518' : '2px solid transparent', transition:'all 0.15s' }}>
                  {l.label}
                </button>
              ))}
            </div>
          )}

          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={onCartOpen} style={{ display:'flex', alignItems:'center', gap:6, background: itemCount>0 ? '#1C1A14' : 'transparent', border:'1.5px solid', borderColor: itemCount>0 ? '#1C1A14' : '#D4CFC9', color: itemCount>0 ? '#fff' : '#7A6E63', borderRadius:24, padding: isMobile ? '7px 14px' : '8px 16px', cursor:'pointer', fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:500, transition:'all 0.2s' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {itemCount > 0 ? itemCount : (!isMobile ? 'Carrito' : '')}
            </button>
            {isMobile && (
              <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background:'none', border:'none', cursor:'pointer', padding:6, display:'flex', flexDirection:'column', gap:5, alignItems:'center' }}>
                <span style={{ display:'block', width:22, height:2, background:'#1C1A14', borderRadius:2, transform: mobileOpen ? 'rotate(45deg) translate(5px,5px)' : 'none', transition:'all 0.2s' }} />
                <span style={{ display:'block', width:22, height:2, background:'#1C1A14', borderRadius:2, opacity: mobileOpen ? 0 : 1, transition:'all 0.2s' }} />
                <span style={{ display:'block', width:22, height:2, background:'#1C1A14', borderRadius:2, transform: mobileOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none', transition:'all 0.2s' }} />
              </button>
            )}
          </div>
        </div>

        {isMobile && (
          <div style={{ maxHeight: mobileOpen ? 400 : 0, overflow:'hidden', transition:'max-height 0.35s cubic-bezier(0.4,0,0.2,1)', borderTop: mobileOpen ? '1px solid #EDE9E3' : 'none', background:'#fff' }}>
            <div style={{ padding:'8px 0 16px' }}>
              {links.map(l => (
                <button key={l.id} onClick={() => handleNav(l.id)} style={{ display:'block', width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', padding:'13px 24px', fontFamily:"'Outfit',sans-serif", fontSize:16, fontWeight: activePage===l.id ? 500 : 400, color: activePage===l.id ? '#F5C518' : '#1C1A14', borderLeft: activePage===l.id ? '3px solid #F5C518' : '3px solid transparent' }}>
                  {l.label}
                </button>
              ))}
              <div style={{ padding:'8px 24px 0' }}>
                <button onClick={() => handleNav('menu')} style={{ width:'100%', background:'#F5C518', color:'#fff', border:'none', borderRadius:12, padding:'14px', fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:500, cursor:'pointer' }}>
                  Pedir ahora →
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
