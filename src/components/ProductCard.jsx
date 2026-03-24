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
    <div style={{ background:'#FFFFFF', borderRadius:14, border:'1px solid rgba(15,8,0,0.1)', overflow:'hidden', display:'flex', flexDirection:'column', transition:'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(15,8,0,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>

      {/* Image — dark bg for emoji contrast */}
      <div style={{ height: isSmall?96:120, background:'#0F0800', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', fontSize: isSmall?34:44 }}>
        {product.emoji}
        {product.badge && <span style={{ position:'absolute', top:8, left:8, background:'#0F0800', border:'1px solid rgba(255,255,255,0.2)', color:'#FFFFFF', fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:4 }}>{product.badge}</span>}
        {qty > 0 && <span style={{ position:'absolute', top:8, right:8, background:'#FFD43A', color:'#0F0800', fontSize:10, fontWeight:700, width:20, height:20, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>{qty}</span>}
      </div>

      {/* Body — white */}
      <div style={{ padding: isSmall?'10px 12px':'14px 16px', flex:1, display:'flex', flexDirection:'column' }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:4 }}>
            <h3 style={{ fontFamily:"'Fraunces',serif", fontSize: isSmall?14:16, fontWeight:600, color:'#0F0800', margin:0, lineHeight:1.2 }}>{product.name}</h3>
            <span style={{ fontSize:10, color:'rgba(15,8,0,0.4)', background:'#F5F0E8', padding:'2px 7px', borderRadius:4, whiteSpace:'nowrap', marginTop:1, flexShrink:0, fontFamily:"'Outfit',sans-serif" }}>{product.weight}</span>
          </div>
          {!isSmall && <p style={{ fontSize:12, color:'rgba(15,8,0,0.5)', lineHeight:1.5, margin:'0 0 12px', fontFamily:"'Outfit',sans-serif" }}>{product.description}</p>}
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: isSmall?8:0 }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize: isSmall?16:20, fontWeight:600, color:'#0F0800' }}>€{product.price%1===0?product.price:product.price.toFixed(2)}</span>
          <button onClick={handleAdd} style={{ background: added?'#0F0800':'#FFD43A', color: added?'#FFFFFF':'#0F0800', border:'none', borderRadius:20, padding: isSmall?'5px 12px':'7px 16px', fontSize:11, fontFamily:"'Outfit',sans-serif", fontWeight:700, cursor:'pointer', transition:'all 0.2s' }}>
            {added ? '✓ Añadido' : '+ Añadir'}
          </button>
        </div>
      </div>
    </div>
  );
}
