import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function Navbar({ activePage, onNavigate, onCartOpen }) {
  const { itemCount } = useCart();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('resize', onResize); window.removeEventListener('scroll', onScroll); };
  }, []);

  if (isMobile) return null;

  const links = [
    { id:'home', label:'Inicio' }, { id:'menu', label:'Carta' },
    { id:'packs', label:'Packs' }, { id:'about', label:'Nosotros' },
  ];

  return (
    <nav style={{ position:'sticky', top:0, zIndex:100, background:'#FFFFFF', borderBottom:`1px solid ${scrolled ? 'rgba(15,8,0,0.12)' : 'rgba(15,8,0,0.08)'}`, transition:'border-color 0.2s', height:58, display:'flex', alignItems:'center' }}>
      <div style={{ maxWidth:1400, margin:'0 auto', padding:'0 32px', display:'flex', alignItems:'center', gap:40, width:'100%' }}>
        <button onClick={() => onNavigate('home')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:10, padding:0, flexShrink:0 }}>
          <img src="/logo.png" alt="OhMyGrill" style={{ height:36, width:'auto' }} />
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'#0F0800', letterSpacing:'-.3px' }}>
            Oh<em style={{ color:'#FFD43A', fontStyle:'italic' }}>My</em>Grill
            <span style={{ fontSize:10, fontWeight:400, color:'rgba(15,8,0,0.35)', fontFamily:"'Outfit',sans-serif", marginLeft:6 }}>Brasas</span>
          </span>
        </button>

        <div style={{ display:'flex', gap:2, flex:1 }}>
          {links.map(l => (
            <button key={l.id} onClick={() => onNavigate(l.id)} style={{ background:'none', border:'none', cursor:'pointer', padding:'6px 14px', borderRadius:6, fontSize:13, fontFamily:"'Outfit',sans-serif", fontWeight: activePage===l.id ? 600 : 400, color: activePage===l.id ? '#0F0800' : 'rgba(15,8,0,0.45)', borderBottom: activePage===l.id ? '2px solid #FFD43A' : '2px solid transparent', transition:'all 0.15s' }}>
              {l.label}
            </button>
          ))}
        </div>

        <button onClick={onCartOpen} style={{ display:'flex', alignItems:'center', gap:8, background: itemCount>0 ? '#FFD43A' : '#F5F0E8', border:`1px solid ${itemCount>0 ? '#FFD43A' : 'rgba(15,8,0,0.12)'}`, color:'#0F0800', borderRadius:24, padding:'8px 18px', cursor:'pointer', fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, transition:'all 0.2s', flexShrink:0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          {itemCount > 0 ? `${itemCount} artículo${itemCount>1?'s':''}` : 'Carrito'}
        </button>
      </div>
    </nav>
  );
}
