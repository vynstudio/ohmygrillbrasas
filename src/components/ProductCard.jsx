import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, size = 'normal' }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find(i => i.id === product.id);
  const qty = inCart?.qty ?? 0;
  const isSmall = size === 'small';

  const handleAdd = () => { addItem(product); setAdded(true); setTimeout(() => setAdded(false), 1200); };

  return (
    <div
      style={{ background:'#1A1000', borderRadius:16, border:'1px solid #2A1A00', overflow:'hidden', display:'flex', flexDirection:'column', transition:'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Image — darkest surface */}
      <div style={{ height: isSmall ? 100 : 130, background:'#0F0800', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', fontSize: isSmall ? 36 : 48 }}>
        {product.emoji}
        {product.badge && (
          <span style={{ position:'absolute', top:10, left:10, background:'#FFD43A', color:'#0F0800', fontSize:10, fontFamily:"'Outfit',sans-serif", fontWeight:700, padding:'3px 10px', borderRadius:20 }}>
            {product.badge}
          </span>
        )}
        {qty > 0 && (
          <span style={{ position:'absolute', top:10, right:10, background:'#FFD43A', color:'#0F0800', fontSize:11, fontWeight:700, width:22, height:22, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {qty}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: isSmall ? '12px 14px' : '16px 18px', flex:1, display:'flex', flexDirection:'column' }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:4 }}>
            <h3 style={{ fontFamily:"'Fraunces',serif", fontSize: isSmall ? 15 : 17, fontWeight:600, color:'#FFFFFF', margin:0, lineHeight:1.2 }}>
              {product.name}
            </h3>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)', background:'#0F0800', padding:'2px 8px', borderRadius:10, whiteSpace:'nowrap', marginTop:2 }}>
              {product.weight}
            </span>
          </div>
          {!isSmall && (
            <p style={{ fontSize:12.5, color:'rgba(255,255,255,0.45)', lineHeight:1.55, margin:'0 0 14px' }}>
              {product.description}
            </p>
          )}
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: isSmall ? 10 : 0 }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize: isSmall ? 18 : 22, fontWeight:600, color:'#FFD43A' }}>
            €{product.price % 1 === 0 ? product.price : product.price.toFixed(2)}
          </span>
          <button onClick={handleAdd} style={{ background: added ? '#2A5C2A' : '#FFD43A', color: added ? '#FFFFFF' : '#0F0800', border:'none', borderRadius:24, padding: isSmall ? '6px 14px' : '8px 18px', fontSize:12, fontFamily:"'Outfit',sans-serif", fontWeight:700, cursor:'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', gap:6 }}>
            {added ? <>✓ Añadido</> : <>+ Añadir</>}
          </button>
        </div>
      </div>
    </div>
  );
}
