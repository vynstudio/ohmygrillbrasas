import { useState, useMemo, useEffect } from 'react';
import { products as staticProducts, categories, packs } from '../data/menu';
import { db } from '../lib/supabase';
import { useCart } from '../context/CartContext';

// ── Shared: product row (web) ────────────────────────────────────────────────
function ProductRow({ product }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find(i => i.id === product.id);

  const handleAdd = () => { addItem(product); setAdded(true); setTimeout(() => setAdded(false), 1200); };

  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 0', borderBottom:'1px solid #2A1A00' }}>
      <div style={{ width:52, height:52, background:'#1A1000', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0, position:'relative' }}>
        {product.emoji}
        {inCart?.qty > 0 && <span style={{ position:'absolute', top:-5, right:-5, background:'#FFD43A', color:'#0F0800', fontSize:9, fontWeight:700, width:16, height:16, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>{inCart.qty}</span>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:15, fontWeight:600, color:'#FFFFFF' }}>{product.name}</span>
          {product.badge && <span style={{ background:'#FFD43A', color:'#0F0800', fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:10 }}>{product.badge}</span>}
        </div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:3, fontFamily:"'Outfit',sans-serif" }}>{product.description}</div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', marginTop:2, fontFamily:"'Outfit',sans-serif" }}>{product.weight}</div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, flexShrink:0 }}>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:600, color:'#FFD43A' }}>€{product.price%1===0?product.price:product.price.toFixed(2)}</span>
        <button onClick={handleAdd} style={{ background: added?'#2A1A00':'#FFD43A', color: added?'#FFD43A':'#0F0800', border:'none', borderRadius:20, padding:'6px 16px', fontSize:11, fontFamily:"'Outfit',sans-serif", fontWeight:700, cursor:'pointer', transition:'all 0.2s' }}>
          {added ? '✓ Añadido' : '+ Añadir'}
        </button>
      </div>
    </div>
  );
}

// ── Mobile: large item card ──────────────────────────────────────────────────
function MobileCard({ product }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find(i => i.id === product.id);

  const handleAdd = () => { addItem(product); setAdded(true); setTimeout(() => setAdded(false), 1200); };

  return (
    <div style={{ background:'#1A1000', borderRadius:14, border:'1px solid #2A1A00', overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ background:'#0F0800', height:88, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, position:'relative' }}>
        {product.emoji}
        {product.badge && <span style={{ position:'absolute', top:7, left:7, background:'#FFD43A', color:'#0F0800', fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:8 }}>{product.badge}</span>}
        {inCart?.qty > 0 && <span style={{ position:'absolute', top:7, right:7, background:'#FFD43A', color:'#0F0800', fontSize:9, fontWeight:700, width:18, height:18, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>{inCart.qty}</span>}
      </div>
      <div style={{ padding:'11px 12px', flex:1, display:'flex', flexDirection:'column', gap:4 }}>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:13, fontWeight:600, color:'#FFFFFF', lineHeight:1.2 }}>{product.name}</div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', lineHeight:1.45, flex:1, fontFamily:"'Outfit',sans-serif" }}>{product.description}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:6 }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:17, fontWeight:600, color:'#FFD43A' }}>€{product.price%1===0?product.price:product.price.toFixed(2)}</span>
          <button onClick={handleAdd} style={{ background: added?'#2A1A00':'#FFD43A', color: added?'#FFD43A':'#0F0800', border:'none', borderRadius:16, padding:'6px 13px', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:"'Outfit',sans-serif", transition:'all 0.2s' }}>
            {added ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Web: right order panel (reused from HomePage) ───────────────────────────
function WebOrderPanel({ onNavigate }) {
  const { items, itemCount, subtotal, deliveryFee, total, deliveryType, deliveryZone, updateQty, setDeliveryType } = useCart();

  return (
    <div style={{ width:300, flexShrink:0, display:'flex', flexDirection:'column', background:'#FFD43A', height:'calc(100vh - 58px)', position:'sticky', top:58, borderLeft:'2px solid #0F0800', overflow:'hidden' }}>
      <div style={{ padding:'16px 20px', borderBottom:'2px solid #0F0800' }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', color:'#0F0800', textTransform:'uppercase', fontFamily:"'Outfit',sans-serif" }}>Tu pedido</div>
        <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)', marginTop:2, fontFamily:"'Outfit',sans-serif" }}>{itemCount > 0 ? `${itemCount} artículo${itemCount>1?'s':''}` : 'Vacío'}</div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'10px 20px' }}>
        {itemCount === 0 ? (
          <div style={{ textAlign:'center', padding:'40px 12px', color:'rgba(0,0,0,0.4)', fontSize:12, fontFamily:"'Outfit',sans-serif" }}>
            <div style={{ fontSize:28, marginBottom:10 }}>🛒</div>
            Añade platos para empezar
          </div>
        ) : items.map(item => (
          <div key={item.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 0', borderBottom:'1px solid rgba(0,0,0,0.1)' }}>
            <div style={{ width:30, height:30, background:'#0F0800', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>{item.emoji}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:11, fontWeight:600, color:'#0F0800', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:"'Outfit',sans-serif" }}>{item.name}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              <button onClick={() => updateQty(item.id, item.qty-1)} style={{ width:20, height:20, border:'1.5px solid #0F0800', background:'transparent', borderRadius:'50%', cursor:'pointer', fontSize:12, color:'#0F0800', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>−</button>
              <span style={{ fontSize:11, fontWeight:700, color:'#0F0800', minWidth:12, textAlign:'center', fontFamily:"'Outfit',sans-serif" }}>{item.qty}</span>
              <button onClick={() => updateQty(item.id, item.qty+1)} style={{ width:20, height:20, border:'none', background:'#0F0800', borderRadius:'50%', cursor:'pointer', fontSize:12, color:'#FFD43A', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>+</button>
            </div>
            <span style={{ fontSize:12, fontWeight:700, color:'#0F0800', minWidth:36, textAlign:'right', fontFamily:"'Fraunces',serif" }}>€{(item.price*item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>
      {itemCount > 0 && (
        <div style={{ padding:'8px 20px', borderTop:'1px solid rgba(0,0,0,0.15)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:5 }}>
            {[{id:'delivery',label:'🛵 Entrega'},{id:'pickup',label:'🏪 Recogida'}].map(o => (
              <button key={o.id} onClick={() => setDeliveryType(o.id)} style={{ padding:'7px', border:`2px solid ${deliveryType===o.id?'#0F0800':'rgba(0,0,0,0.2)'}`, borderRadius:7, background: deliveryType===o.id?'#0F0800':'transparent', color: deliveryType===o.id?'#FFD43A':'rgba(0,0,0,0.5)', fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>{o.label}</button>
            ))}
          </div>
        </div>
      )}
      <div style={{ padding:'14px 20px', borderTop:'2px solid #0F0800' }}>
        {itemCount > 0 && (
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, fontFamily:"'Outfit',sans-serif" }}>
            <span style={{ fontSize:11, color:'rgba(0,0,0,0.5)' }}>Total</span>
            <span style={{ fontSize:13, fontWeight:700, color:'#0F0800' }}>€{(deliveryType==='delivery'&&deliveryZone?total:subtotal).toFixed(2)}</span>
          </div>
        )}
        <button onClick={() => onNavigate(itemCount>0?'checkout':'home')} style={{ width:'100%', background:'#0F0800', color:'#FFD43A', border:'none', borderRadius:8, padding:'13px', fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, cursor:'pointer' }}>
          {itemCount > 0 ? 'Ir al pago →' : '← Volver al inicio'}
        </button>
      </div>
    </div>
  );
}

// ── Main MenuPage ────────────────────────────────────────────────────────────
export default function MenuPage({ onNavigate }) {
  const { itemCount, subtotal } = useCart();
  const [activeCategory, setActiveCategory] = useState('todo');
  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [products, setProducts] = useState(staticProducts);

  useEffect(() => {
    db.getMenu().then(data => {
      if (data?.length > 0) {
        setProducts(data.map(d => ({ ...staticProducts.find(p => p.id===d.id), ...d, price: parseFloat(d.price) })).filter(Boolean));
      }
    }).catch(() => {
      try { const s = localStorage.getItem('omg_menu_v1'); if (s) { const saved = JSON.parse(s); setProducts(staticProducts.map(p => { const sv = saved.find(i=>i.id===p.id); return sv?{...p,price:sv.price,available:sv.available}:p; })); } } catch(e) {}
    });
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const filtered = useMemo(() => {
    let list = activeCategory==='todo'||activeCategory==='packs' ? products : products.filter(p => p.category===activeCategory);
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(p => p.name.toLowerCase().includes(q)||p.description.toLowerCase().includes(q)); }
    return list;
  }, [activeCategory, search, products]);

  const grouped = useMemo(() => {
    if (activeCategory!=='todo'||search.trim()) return null;
    const g = {};
    filtered.forEach(p => { if(!g[p.category]) g[p.category]=[]; g[p.category].push(p); });
    return g;
  }, [activeCategory, filtered, search]);

  const catLabels = { carnes:'Carnes', aves:'Aves y volatería', verduras:'Verduras y guarniciones', salsas:'Salsas y extras' };
  const showPacks = activeCategory==='todo'||activeCategory==='packs';

  // ── MOBILE ────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ background:'#0F0800', minHeight:'100vh', fontFamily:"'Outfit',sans-serif" }}>
        {/* Sticky header */}
        <div style={{ background:'#0F0800', padding:'16px 16px 0', position:'sticky', top:0, zIndex:10, borderBottom:'1px solid #2A1A00' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:600, color:'#FFFFFF' }}>La carta</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>Brasa de leña · Zaragoza</div>
          </div>
          {/* Search */}
          <div style={{ position:'relative', marginBottom:12 }}>
            <input type="text" placeholder="Buscar plato..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width:'100%', padding:'10px 14px 10px 36px', background:'#1A1000', border:'1px solid #2A1A00', borderRadius:10, color:'#FFFFFF', fontSize:13, fontFamily:"'Outfit',sans-serif", boxSizing:'border-box', outline:'none' }} />
            <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          {/* Category pills */}
          <div style={{ display:'flex', gap:7, overflowX:'auto', paddingBottom:12, scrollbarWidth:'none' }}>
            {categories.map(c => (
              <button key={c.id} onClick={() => { setActiveCategory(c.id); setSearch(''); }} style={{ background: activeCategory===c.id?'#FFD43A':'#1A1000', color: activeCategory===c.id?'#0F0800':'rgba(255,255,255,0.55)', border: activeCategory===c.id?'none':'1px solid #2A1A00', borderRadius:20, padding:'7px 16px', fontSize:12, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', fontFamily:"'Outfit',sans-serif", flexShrink:0 }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding:'16px' }}>
          {grouped && Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom:24 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'#FFFFFF' }}>{catLabels[cat]||cat}</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)', background:'#1A1000', padding:'2px 8px', borderRadius:10 }}>{items.length}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {items.map(p => <MobileCard key={p.id} product={p} />)}
              </div>
            </div>
          ))}
          {!grouped && filtered.map(p => <MobileCard key={p.id} product={p} />)}
          {showPacks && !search && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'#FFFFFF', marginBottom:12 }}>Packs</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {packs.map(pack => (
                  <div key={pack.id} onClick={() => onNavigate('packs')} style={{ background:'#1A1000', border:'1px solid #2A1A00', borderRadius:14, padding:'14px 12px', cursor:'pointer' }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>{pack.emoji}</div>
                    <div style={{ fontFamily:"'Fraunces',serif", fontSize:13, fontWeight:600, color:'#FFFFFF', marginBottom:4 }}>{pack.name}</div>
                    <div style={{ fontSize:16, fontWeight:700, color:'#FFD43A', fontFamily:"'Fraunces',serif" }}>€{pack.price}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', textDecoration:'line-through', fontFamily:"'Outfit',sans-serif" }}>€{pack.originalPrice}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── WEB SPLIT SCREEN ──────────────────────────────────────────────────────
  return (
    <div style={{ display:'flex', background:'#0F0800', minHeight:'calc(100vh - 58px)', fontFamily:"'Outfit',sans-serif" }}>
      <div style={{ flex:1, minWidth:0 }}>
        {/* Page header */}
        <div style={{ background:'#0F0800', padding:'32px 48px 0', borderBottom:'1px solid #2A1A00' }}>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:36, fontWeight:600, color:'#FFFFFF', margin:'0 0 4px' }}>La carta</h1>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', margin:'0 0 20px' }}>Brasa de leña de encina · Zaragoza</p>
          {/* Search */}
          <div style={{ position:'relative', maxWidth:400, marginBottom:16 }}>
            <svg style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Buscar plato..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width:'100%', padding:'10px 14px 10px 40px', background:'#1A1000', border:'1px solid #2A1A00', borderRadius:10, color:'#FFFFFF', fontSize:13, fontFamily:"'Outfit',sans-serif", boxSizing:'border-box', outline:'none' }}
              onFocus={e => e.target.style.borderColor='#FFD43A'} onBlur={e => e.target.style.borderColor='#2A1A00'} />
          </div>
          {/* Category tabs */}
          <div style={{ display:'flex', gap:4, overflowX:'auto', scrollbarWidth:'none' }}>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setSearch(''); }} style={{ background: activeCategory===cat.id?'#FFD43A':'transparent', color: activeCategory===cat.id?'#0F0800':'rgba(255,255,255,0.5)', border: 'none', borderBottom: activeCategory===cat.id?'none':'2px solid transparent', borderRadius: activeCategory===cat.id?'8px 8px 0 0':'0', padding:'9px 18px', fontSize:13, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', fontFamily:"'Outfit',sans-serif", flexShrink:0, transition:'all 0.15s' }}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product list */}
        <div style={{ padding:'24px 48px' }}>
          {grouped && Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom:32 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:600, color:'#FFFFFF', margin:0 }}>{catLabels[cat]||cat}</h2>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)', background:'#1A1000', padding:'2px 8px', borderRadius:10 }}>{items.length}</span>
              </div>
              <div style={{ borderTop:'2px solid #FFD43A', width:32, marginBottom:12 }} />
              {items.map(p => <ProductRow key={p.id} product={p} />)}
            </div>
          ))}
          {!grouped && filtered.map(p => <ProductRow key={p.id} product={p} />)}
          {showPacks && !search && (
            <div style={{ marginTop:grouped?0:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:600, color:'#FFFFFF', margin:0 }}>Packs</h2>
              </div>
              <div style={{ borderTop:'2px solid #FFD43A', width:32, marginBottom:12 }} />
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
                {packs.map(pack => (
                  <div key={pack.id} style={{ background:'#1A1000', borderRadius:14, padding:'20px', border:'1px solid #2A1A00', cursor:'pointer' }} onClick={() => onNavigate('packs')}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                      <div>
                        <span style={{ background:'#FFD43A', color:'#0F0800', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10, display:'inline-block', marginBottom:6 }}>{pack.badge}</span>
                        <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:600, color:'#FFFFFF' }}>{pack.name}</div>
                      </div>
                      <span style={{ fontSize:28 }}>{pack.emoji}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                      <span style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:600, color:'#FFD43A' }}>€{pack.price}</span>
                      <span style={{ fontSize:12, color:'rgba(255,255,255,0.3)', textDecoration:'line-through' }}>€{pack.originalPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right panel */}
      <WebOrderPanel onNavigate={onNavigate} />
    </div>
  );
}
