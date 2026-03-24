import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, size='normal' }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find(i=>i.id===product.id);
  const qty = inCart?.qty ?? 0;
  const sm = size==='small';

  const handleAdd = () => { addItem(product); setAdded(true); setTimeout(()=>setAdded(false),1200); };

  return (
    <div style={{ background:'#FAF5EC', border:'2px solid #0F0800', overflow:'hidden', display:'flex', flexDirection:'column', transition:'transform 0.2s' }}
      onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'}
      onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
      {/* Image header — dark */}
      <div style={{ height:sm?96:124, background:'#0F0800', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', fontSize:sm?36:48 }}>
        {product.emoji}
        {product.badge && <span style={{ position:'absolute', top:8, left:8, background:'#FFD43A', color:'#0F0800', fontSize:9, fontWeight:900, padding:'3px 8px', letterSpacing:'.5px' }}>{product.badge.toUpperCase()}</span>}
        {qty>0 && <span style={{ position:'absolute', top:8, right:8, background:'#FFD43A', color:'#0F0800', fontSize:10, fontWeight:900, width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center' }}>{qty}</span>}
      </div>
      {/* Body */}
      <div style={{ padding:sm?'10px 12px':'14px 16px', flex:1, display:'flex', flexDirection:'column' }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:4 }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:sm?14:16, fontWeight:700, color:'#0F0800', lineHeight:1.2 }}>{product.name}</div>
            <span style={{ fontSize:10, color:'rgba(15,8,0,0.4)', background:'rgba(15,8,0,0.07)', padding:'2px 6px', whiteSpace:'nowrap', flexShrink:0, fontFamily:"'Outfit',sans-serif", letterSpacing:'.5px' }}>{product.weight}</span>
          </div>
          {!sm && <div style={{ fontSize:12, color:'rgba(15,8,0,0.5)', lineHeight:1.55, margin:'0 0 12px', fontFamily:"'Outfit',sans-serif" }}>{product.description}</div>}
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:sm?8:0 }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:sm?17:21, fontWeight:900, color:'#0F0800' }}>€{product.price%1===0?product.price:product.price.toFixed(2)}</span>
          <button onClick={handleAdd} style={{ background:added?'#0F0800':'#FFD43A', color:added?'#FFD43A':'#0F0800', border:'2px solid #0F0800', padding:sm?'5px 12px':'7px 16px', fontSize:11, fontFamily:"'Outfit',sans-serif", fontWeight:900, cursor:'pointer', transition:'all 0.2s', letterSpacing:'.3px' }}>
            {added?'✓ AÑADIDO':'+ AÑADIR'}
          </button>
        </div>
      </div>
    </div>
  );
}
