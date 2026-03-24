import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const TICKER_ITEMS = ['Leña de encina','Desde 2013','Entrega 90 min','Zaragoza','Carnes premium','4.9 Google'];

export default function Navbar({ activePage, onNavigate, onCartOpen }) {
  const { itemCount } = useCart();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth < 768);
    const s = () => setScrolled(window.scrollY > 8);
    window.addEventListener('resize', r);
    window.addEventListener('scroll', s, { passive: true });
    return () => { window.removeEventListener('resize', r); window.removeEventListener('scroll', s); };
  }, []);

  if (isMobile) return null;

  const links = [
    { id:'home', label:'Inicio' }, { id:'menu', label:'Carta' },
    { id:'packs', label:'Packs' }, { id:'about', label:'Nosotros' }, { id:'contact', label:'Contacto' },
  ];

  return (
    <>
      {/* Yellow ticker */}
      <div style={{ background:'#F5C842', borderBottom:'1px solid rgba(26,16,8,.1)', overflow:'hidden', padding:'7px 0' }}>
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={i} style={{ fontSize:12, fontWeight:600, color:'#1a1008', padding:'0 28px', letterSpacing:'.6px' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'#FAF6EF', borderBottom:`1px solid ${scrolled ? 'rgba(26,16,8,.12)' : 'rgba(26,16,8,.07)'}`, height:68, display:'flex', alignItems:'center', transition:'border-color .2s' }}>
        <div style={{ maxWidth:1400, margin:'0 auto', padding:'0 56px', display:'flex', alignItems:'center', width:'100%' }}>
          {/* Logo */}
          <button onClick={() => onNavigate('home')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:10, padding:0, flexShrink:0, marginRight:32 }}>
            <img src="/logo.png" alt="OhMyGrill Brasas" style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover', flexShrink:0 }}/>
            <div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:15, fontWeight:600, color:'#1a1008', lineHeight:1, letterSpacing:'-.2px' }}>OhMyGrill</div>
              <div style={{ fontSize:10, color:'rgba(26,16,8,.35)', letterSpacing:'1.5px', textTransform:'uppercase' }}>Brasas</div>
            </div>
          </button>

          {/* Links */}
          <div style={{ display:'flex', flex:1 }}>
            {links.map(l => (
              <button key={l.id} onClick={() => onNavigate(l.id)} style={{ background:'none', border:'none', borderBottom:`2px solid ${activePage===l.id ? '#F5C842' : 'transparent'}`, cursor:'pointer', padding:'0 20px', height:68, fontSize:13, fontFamily:"'Outfit',sans-serif", fontWeight: activePage===l.id ? 600 : 500, color: activePage===l.id ? '#1a1008' : 'rgba(26,16,8,.5)', transition:'all .15s', letterSpacing:'.1px' }}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Cart */}
          <button onClick={itemCount>0 ? onCartOpen : ()=>onNavigate('menu')} style={{ display:'flex', alignItems:'center', gap:8, background: itemCount>0 ? '#1a1008' : '#FAF6EF', border:`1.5px solid ${itemCount>0 ? '#1a1008' : 'rgba(26,16,8,.12)'}`, borderRadius:24, padding:'9px 20px', cursor:'pointer', fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600, color: itemCount>0 ? '#F5C842' : '#1a1008', transition:'all .2s', flexShrink:0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {itemCount > 0 ? `Carrito (${itemCount})` : 'Pedir ahora'}
          </button>
        </div>
      </nav>
    </>
  );
}
