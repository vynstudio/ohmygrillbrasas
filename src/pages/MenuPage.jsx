import { useState, useMemo, useEffect } from 'react';
import { products as staticProducts, categories, packs } from '../data/menu';
import { db } from '../lib/supabase';
import { useCart } from '../context/CartContext';

function ProductRow({ product }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find(i => i.id === product.id);
  const qty = inCart?.qty ?? 0;

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 0', borderBottom:'1px solid #F0EDE8', transition:'background 0.15s' }}>
      {/* Emoji thumb */}
      <div style={{ width:56, height:56, borderRadius:12, background:'linear-gradient(135deg,#2A1005,#7C2D0C)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0, position:'relative' }}>
        {product.emoji}
        {qty > 0 && (
          <span style={{ position:'absolute', top:-6, right:-6, background:'#E85820', color:'#fff', fontSize:10, fontWeight:600, width:18, height:18, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>{qty}</span>
        )}
      </div>
      {/* Info */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'#1C1A14', margin:0 }}>{product.name}</h3>
          {product.badge && (
            <span style={{ background: product.badgeColor || '#1C1A14', color:'#fff', fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>{product.badge}</span>
          )}
        </div>
        <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:12.5, color:'#9A8F85', margin:'3px 0 0', lineHeight:1.5 }}>{product.description}</p>
        <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:11, color:'#B8AFA8', background:'#F5F1EC', padding:'2px 8px', borderRadius:10, display:'inline-block', marginTop:5 }}>{product.weight}</span>
      </div>
      {/* Price + add */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, flexShrink:0 }}>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:600, color:'#E85820' }}>
          €{product.price % 1 === 0 ? product.price : product.price.toFixed(2)}
        </span>
        <button onClick={handleAdd} style={{ background: added ? '#1a7a4a' : '#1C1A14', color:'#fff', border:'none', borderRadius:24, padding:'7px 16px', fontSize:12, fontFamily:"'Outfit',sans-serif", fontWeight:500, cursor:'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', gap:5, whiteSpace:'nowrap' }}>
          {added ? '✓ Añadido' : '+ Añadir'}
        </button>
      </div>
    </div>
  );
}

function PackCard({ pack, onNavigate }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ id: pack.id, name: pack.name, price: pack.price, emoji: pack.emoji });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div style={{ background:'#1C1A14', borderRadius:16, padding:'22px 20px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', bottom:-16, right:-8, fontSize:72, opacity:0.06, userSelect:'none' }}>{pack.emoji}</div>
      <div style={{ position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
          <div>
            <span style={{ background:'#E85820', color:'#fff', fontSize:10, fontWeight:600, padding:'2px 10px', borderRadius:20, display:'inline-block', marginBottom:8 }}>{pack.badge}</span>
            <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:600, color:'#F0EBE3', margin:0 }}>{pack.name}</h3>
            <p style={{ fontSize:12, color:'rgba(240,235,227,0.45)', marginTop:2 }}>{pack.subtitle}</p>
          </div>
          <span style={{ fontSize:28 }}>{pack.emoji}</span>
        </div>
        <ul style={{ margin:'0 0 14px', padding:0, listStyle:'none' }}>
          {pack.items.map(item => (
            <li key={item} style={{ fontSize:12, color:'rgba(240,235,227,0.6)', padding:'2px 0', display:'flex', alignItems:'center', gap:7 }}>
              <span style={{ color:'#E85820', fontSize:9 }}>●</span>{item}
            </li>
          ))}
        </ul>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:600, color:'#F0EBE3' }}>€{pack.price}</span>
            <span style={{ fontSize:12, color:'rgba(240,235,227,0.3)', marginLeft:7, textDecoration:'line-through' }}>€{pack.originalPrice}</span>
          </div>
          <button onClick={handleAdd} style={{ background: added ? '#1a7a4a' : '#E85820', color:'#fff', border:'none', borderRadius:24, padding:'9px 18px', fontSize:12, fontFamily:"'Outfit',sans-serif", fontWeight:500, cursor:'pointer', transition:'all 0.2s' }}>
            {added ? '✓ Añadido' : 'Pedir pack'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MenuPage({ onNavigate }) {
  const { itemCount, total, subtotal } = useCart();
  const [activeCategory, setActiveCategory] = useState('todo');
  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [products, setProducts] = useState(staticProducts);

  useEffect(() => {
    db.getMenu()
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data.map(d => ({
            ...staticProducts.find(p => p.id === d.id),
            ...d,
            badgeColor: d.badge_color,
            available: d.available,
            price: parseFloat(d.price),
          })).filter(Boolean));
        }
      })
      .catch(() => {
        try {
          const saved = localStorage.getItem('omg_menu_v1');
          if (saved) {
            const savedItems = JSON.parse(saved);
            setProducts(staticProducts.map(p => {
              const s = savedItems.find(i => i.id === p.id);
              return s ? { ...p, price: s.price, available: s.available } : p;
            }));
          }
        } catch(e) {}
      });
  }, []);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== 'todo' && activeCategory !== 'packs') {
      list = list.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return list;
  }, [activeCategory, search]);

  const showPacks = activeCategory === 'todo' || activeCategory === 'packs';
  const showProducts = activeCategory !== 'packs';

  // Group products by category for "Todo" view
  const grouped = useMemo(() => {
    if (activeCategory !== 'todo' || search.trim()) return null;
    const groups = {};
    filtered.forEach(p => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [activeCategory, filtered, search]);

  const categoryLabels = { carnes:'Carnes', aves:'Aves y volatería', verduras:'Verduras y guarniciones', salsas:'Salsas y extras' };

  return (
    <div style={{ fontFamily:"'Outfit',sans-serif", background:'#FAFAF7', minHeight:'100vh' }}>

      {/* Page header */}
      <div style={{ background:'#fff', borderBottom:'1px solid #EDE9E3', padding: isMobile ? '28px 20px 0' : '40px 0 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding: isMobile ? '0' : '0 24px' }}>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize: isMobile ? 30 : 40, fontWeight:600, color:'#1C1A14', margin:'0 0 4px' }}>
            La carta
          </h1>
          <p style={{ fontSize:14, color:'#9A8F85', margin:'0 0 20px' }}>
            Brasa de leña de encina · Zaragoza
          </p>

          {/* Search */}
          <div style={{ position:'relative', maxWidth:440, marginBottom:20 }}>
            <svg style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#B8AFA8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar plato..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width:'100%', padding:'10px 14px 10px 40px', border:'1.5px solid #EDE9E3', borderRadius:12, fontFamily:"'Outfit',sans-serif", fontSize:14, color:'#1C1A14', background:'#FAFAF7', boxSizing:'border-box', outline:'none', transition:'border-color 0.15s' }}
              onFocus={e => e.target.style.borderColor = '#E85820'}
              onBlur={e => e.target.style.borderColor = '#EDE9E3'}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#B8AFA8', fontSize:18, lineHeight:1, padding:0 }}>×</button>
            )}
          </div>

          {/* Category tabs */}
          <div style={{ display:'flex', gap:4, overflowX:'auto', paddingBottom:0, scrollbarWidth:'none' }}>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setSearch(''); }} style={{ background: activeCategory===cat.id ? '#1C1A14' : 'transparent', color: activeCategory===cat.id ? '#fff' : '#7A6E63', border: activeCategory===cat.id ? 'none' : '1px solid #EDE9E3', borderRadius:'12px 12px 0 0', padding:'9px 18px', fontSize:13, fontFamily:"'Outfit',sans-serif", fontWeight: activeCategory===cat.id ? 500 : 400, cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.15s', flexShrink:0 }}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding: isMobile ? '24px 20px' : '32px 24px', display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap:32, alignItems:'start' }}>

        {/* Left — product list */}
        <div>
          {search && (
            <p style={{ fontSize:13, color:'#9A8F85', marginBottom:16 }}>
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para "<strong style={{ color:'#1C1A14' }}>{search}</strong>"
            </p>
          )}

          {/* Grouped view (Todo, no search) */}
          {grouped && showProducts && Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom:36 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:4 }}>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:600, color:'#1C1A14', margin:0 }}>{categoryLabels[cat] || cat}</h2>
                <span style={{ fontSize:12, color:'#B8AFA8', background:'#F5F1EC', padding:'2px 10px', borderRadius:20 }}>{items.length}</span>
              </div>
              <div style={{ borderTop:'2px solid #E85820', width:40, marginBottom:16 }} />
              {items.map(p => <ProductRow key={p.id} product={p} />)}
            </div>
          ))}

          {/* Flat filtered view */}
          {!grouped && showProducts && (
            <div style={{ marginBottom:36 }}>
              {activeCategory !== 'todo' && (
                <div style={{ marginBottom:16 }}>
                  <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:600, color:'#1C1A14', margin:'0 0 4px' }}>
                    {categoryLabels[activeCategory] || categories.find(c=>c.id===activeCategory)?.label}
                  </h2>
                  <div style={{ borderTop:'2px solid #E85820', width:40 }} />
                </div>
              )}
              {filtered.length === 0 ? (
                <div style={{ textAlign:'center', padding:'60px 20px', color:'#9A8F85' }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
                  <p style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:600, color:'#1C1A14', marginBottom:6 }}>Sin resultados</p>
                  <p style={{ fontSize:14 }}>Prueba con otro término</p>
                </div>
              ) : (
                filtered.map(p => <ProductRow key={p.id} product={p} />)
              )}
            </div>
          )}

          {/* Packs */}
          {showPacks && !search && (
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:4 }}>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:600, color:'#1C1A14', margin:0 }}>Packs y promociones</h2>
              </div>
              <div style={{ borderTop:'2px solid #E85820', width:40, marginBottom:16 }} />
              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap:14 }}>
                {packs.map(pack => <PackCard key={pack.id} pack={pack} onNavigate={onNavigate} />)}
              </div>
            </div>
          )}
        </div>

        {/* Right — sticky order summary */}
        {!isMobile && (
          <div style={{ position:'sticky', top:80 }}>
            <div style={{ background:'#fff', border:'1px solid #EDE9E3', borderRadius:20, overflow:'hidden' }}>
              <div style={{ background:'#1C1A14', padding:'20px 24px' }}>
                <p style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:600, color:'#F0EBE3', margin:0 }}>Tu pedido</p>
                {itemCount > 0 && <p style={{ fontSize:12, color:'rgba(240,235,227,0.45)', margin:'3px 0 0' }}>{itemCount} {itemCount===1?'artículo':'artículos'}</p>}
              </div>

              {itemCount === 0 ? (
                <div style={{ padding:'40px 24px', textAlign:'center' }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>🛒</div>
                  <p style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'#1C1A14', marginBottom:6 }}>Carrito vacío</p>
                  <p style={{ fontSize:13, color:'#9A8F85', lineHeight:1.5 }}>Añade platos de la carta para empezar tu pedido.</p>
                </div>
              ) : (
                <div style={{ padding:'16px 24px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #F0EDE8' }}>
                    <span style={{ fontSize:13, color:'#7A6E63' }}>Subtotal</span>
                    <span style={{ fontSize:13, fontWeight:500, color:'#1C1A14' }}>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0 16px' }}>
                    <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'#1C1A14' }}>Total</span>
                    <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'#E85820' }}>€{subtotal.toFixed(2)}</span>
                  </div>
                  <button onClick={() => onNavigate('checkout')} style={{ width:'100%', background:'#E85820', color:'#fff', border:'none', borderRadius:12, padding:'13px', fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:500, cursor:'pointer' }}>
                    Ir al pago →
                  </button>
                  <button onClick={() => onNavigate('home')} style={{ width:'100%', background:'transparent', color:'#9A8F85', border:'none', padding:'10px', fontFamily:"'Outfit',sans-serif", fontSize:12, cursor:'pointer', marginTop:4 }}>
                    ← Seguir comprando
                  </button>
                </div>
              )}

              {/* Delivery info */}
              <div style={{ borderTop:'1px solid #F0EDE8', padding:'14px 24px', background:'#FAFAF7' }}>
                {[
                  { icon:'🛵', text:'Envío gratis en pedidos +€35' },
                  { icon:'⏱', text:'Entrega en 90 min · Zaragoza' },
                  { icon:'🔒', text:'Pago seguro con Stripe' },
                ].map(item => (
                  <div key={item.text} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <span style={{ fontSize:14 }}>{item.icon}</span>
                    <span style={{ fontSize:12, color:'#7A6E63' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile floating cart bar */}
      {isMobile && itemCount > 0 && (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'12px 16px', background:'#fff', borderTop:'1px solid #EDE9E3', zIndex:50, boxShadow:'0 -4px 20px rgba(0,0,0,0.08)' }}>
          <button onClick={() => onNavigate('checkout')} style={{ width:'100%', background:'#E85820', color:'#fff', border:'none', borderRadius:14, padding:'15px', fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span>🛒 {itemCount} {itemCount===1?'artículo':'artículos'}</span>
            <span>Ver pedido · €{subtotal.toFixed(2)} →</span>
          </button>
        </div>
      )}
    </div>
  );
}
