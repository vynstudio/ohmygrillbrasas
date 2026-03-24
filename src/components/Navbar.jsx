import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

// Web navbar — cream bg, serif logo, yellow active underline, dark cart pill
export default function Navbar({ activePage, onNavigate, onCartOpen }) {
  const { itemCount } = useCart();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth < 768);
    const s = () => setScrolled(window.scrollY > 8);
    window.addEventListener('resize', r);
    window.addEventListener('scroll', s, { passive:true });
    return () => { window.removeEventListener('resize', r); window.removeEventListener('scroll', s); };
  }, []);

  if (isMobile) return null;

  const links = [
    { id:'home', label:'Inicio' }, { id:'menu', label:'Carta' },
    { id:'packs', label:'Packs' }, { id:'about', label:'Nosotros' },
  ];

  return (
    <>
      {/* Yellow ticker — web only */}
      <div style={{ background:'#FFD43A', borderBottom:'2px solid #0F0800', overflow:'hidden', padding:'7px 0' }}>
        <div className="marquee-track">
          {['🔥 LEÑA DE ENCINA','★ DESDE 2013','🛵 ENTREGA 90 MIN','✦ ZARAGOZA','🥩 CARNES PREMIUM','★ 4.9 GOOGLE','🔥 LEÑA DE ENCINA','★ DESDE 2013','🛵 ENTREGA 90 MIN','✦ ZARAGOZA','🥩 CARNES PREMIUM','★ 4.9 GOOGLE'].map((t,i) => (
            <span key={i} style={{ fontSize:12, fontWeight:900, color:'#0F0800', padding:'0 28px', letterSpacing:'1px', fontFamily:"'Outfit',sans-serif" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'#FAF5EC', borderBottom:`2px solid ${scrolled?'#0F0800':'rgba(15,8,0,0.15)'}`, height:60, display:'flex', alignItems:'center', transition:'border-color 0.2s' }}>
        <div style={{ maxWidth:1400, margin:'0 auto', padding:'0 36px', display:'flex', alignItems:'center', gap:40, width:'100%' }}>
          <button onClick={() => onNavigate('home')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:10, padding:0, flexShrink:0 }}>
            <img src="/logo.png" alt="OhMyGrill" style={{ height:38, width:'auto' }} />
            <div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:900, color:'#0F0800', lineHeight:1, letterSpacing:'-.5px' }}>
                OhMy<em style={{ color:'#FFD43A', fontStyle:'italic' }}>Grill</em>
              </div>
              <div style={{ fontSize:9, letterSpacing:'2px', color:'rgba(15,8,0,0.4)', textTransform:'uppercase', fontFamily:"'Outfit',sans-serif", marginTop:1 }}>Brasas</div>
            </div>
          </button>

          <div style={{ display:'flex', gap:0, flex:1 }}>
            {links.map(l => (
              <button key={l.id} onClick={() => onNavigate(l.id)} style={{ background:'none', border:'none', cursor:'pointer', padding:'8px 16px', fontSize:13, fontFamily:"'Outfit',sans-serif", fontWeight:700, color: activePage===l.id ? '#0F0800' : 'rgba(15,8,0,0.45)', borderBottom: activePage===l.id ? '3px solid #FFD43A' : '3px solid transparent', letterSpacing:'.3px', transition:'all 0.15s' }}>
                {l.label.toUpperCase()}
              </button>
            ))}
          </div>

          <button onClick={onCartOpen} style={{ display:'flex', alignItems:'center', gap:8, background: itemCount>0 ? '#0F0800' : '#FAF5EC', border:'2px solid #0F0800', color: itemCount>0 ? '#FFD43A' : '#0F0800', borderRadius:0, padding:'8px 20px', cursor:'pointer', fontFamily:"'Outfit',sans-serif", fontSize:12, fontWeight:900, letterSpacing:'.5px', transition:'all 0.2s', flexShrink:0 }}>
            🛒 {itemCount>0 ? `${itemCount} ARTÍCULO${itemCount>1?'S':''}` : 'CARRITO'}
          </button>
        </div>
      </nav>
    </>
  );
}
