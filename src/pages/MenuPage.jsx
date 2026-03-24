import { useState, useMemo, useEffect } from 'react';
import { products as staticProducts, categories, packs } from '../data/menu';
import { db } from '../lib/supabase';
import { useCart } from '../context/CartContext';

const CAT_LABELS = { carnes:'Carnes', aves:'Aves y volatería', verduras:'Verduras y guarniciones', salsas:'Salsas y extras' };

// ── Product row ──────────────────────────────────────────────────────────────
function ProductRow({ product }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find(i=>i.id===product.id);
  const handleAdd = ()=>{ addItem(product); setAdded(true); setTimeout(()=>setAdded(false),1200); };
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 0', borderBottom:'1px solid rgba(15,8,0,0.08)' }}>
      <div style={{ width:50, height:50, background:'#0F0800', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0, position:'relative' }}>
        {product.emoji}
        {inCart?.qty>0 && <span style={{ position:'absolute', top:-5, right:-5, background:'#FFD43A', color:'#0F0800', fontSize:8, fontWeight:900, width:15, height:15, display:'flex', alignItems:'center', justifyContent:'center' }}>{inCart.qty}</span>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:15, fontWeight:700, color:'#0F0800' }}>{product.name}</span>
          {product.badge && <span style={{ background:'#FFD43A', color:'#0F0800', fontSize:8, fontWeight:900, padding:'2px 7px', letterSpacing:'.5px' }}>{product.badge.toUpperCase()}</span>}
        </div>
        <div style={{ fontSize:11, color:'rgba(15,8,0,0.45)', marginTop:2, fontFamily:"'Outfit',sans-serif" }}>{product.description}</div>
        <div style={{ fontSize:10, color:'rgba(15,8,0,0.25)', marginTop:1, fontFamily:"'Outfit',sans-serif", letterSpacing:'.5px' }}>{product.weight}</div>
      </div>
      <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:19, fontWeight:900, color:'#0F0800' }}>€{product.price%1===0?product.price:product.price.toFixed(2)}</span>
        <button onClick={handleAdd} style={{ background:added?'#0F0800':'#FFD43A', color:added?'#FFD43A':'#0F0800', border:'2px solid #0F0800', padding:'5px 14px', fontSize:10, fontWeight:900, cursor:'pointer', fontFamily:"'Outfit',sans-serif", letterSpacing:'.3px', transition:'all 0.2s' }}>
          {added?'✓ AÑADIDO':'+ AÑADIR'}
        </button>
      </div>
    </div>
  );
}

// ── Mobile card ──────────────────────────────────────────────────────────────
function MobileCard({ product }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find(i=>i.id===product.id);
  const handleAdd = ()=>{ addItem(product); setAdded(true); setTimeout(()=>setAdded(false),1200); };
  return (
    <div style={{ background:'#FAF5EC', border:'2px solid #0F0800', overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ background:'#0F0800', height:84, display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, position:'relative' }}>
        {product.emoji}
        {product.badge && <span style={{ position:'absolute', top:7, left:7, background:'#FFD43A', color:'#0F0800', fontSize:8, fontWeight:900, padding:'2px 6px', letterSpacing:'.5px' }}>{product.badge.toUpperCase()}</span>}
        {inCart?.qty>0 && <span style={{ position:'absolute', top:7, right:7, background:'#FFD43A', color:'#0F0800', fontSize:8, fontWeight:900, width:16, height:16, display:'flex', alignItems:'center', justifyContent:'center' }}>{inCart.qty}</span>}
      </div>
      <div style={{ padding:'10px 11px', flex:1, display:'flex', flexDirection:'column', gap:4 }}>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:13, fontWeight:700, color:'#0F0800', lineHeight:1.2 }}>{product.name}</div>
        <div style={{ fontSize:10, color:'rgba(15,8,0,0.45)', lineHeight:1.4, flex:1, fontFamily:"'Outfit',sans-serif" }}>{product.description}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:6 }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:17, fontWeight:900, color:'#0F0800' }}>€{product.price%1===0?product.price:product.price.toFixed(2)}</span>
          <button onClick={handleAdd} style={{ background:added?'#0F0800':'#FFD43A', color:added?'#FFD43A':'#0F0800', border:'2px solid #0F0800', padding:'5px 10px', fontSize:10, fontWeight:900, cursor:'pointer', fontFamily:"'Outfit',sans-serif", transition:'all 0.2s' }}>{added?'✓':'+'}</button>
        </div>
      </div>
    </div>
  );
}

// ── Web right panel ──────────────────────────────────────────────────────────
function WebOrderPanel({ onNavigate }) {
  const { items, itemCount, subtotal, deliveryFee, total, deliveryType, deliveryZone, updateQty, setDeliveryType } = useCart();
  return (
    <div style={{ width:280, flexShrink:0, display:'flex', flexDirection:'column', background:'#FFD43A', height:'calc(100vh - 97px)', position:'sticky', top:97, borderLeft:'2px solid #0F0800', overflow:'hidden' }}>
      <div style={{ padding:'14px 18px', borderBottom:'2px solid #0F0800' }}>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:900, color:'#0F0800' }}>Tu pedido</div>
        <div style={{ fontSize:9, fontWeight:900, letterSpacing:'1.5px', color:'rgba(15,8,0,0.5)', marginTop:1, fontFamily:"'Outfit',sans-serif" }}>{itemCount>0?`${itemCount} ARTÍCULO${itemCount>1?'S':''}`:'VACÍO'}</div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'10px 18px' }}>
        {itemCount===0 ? (
          <div style={{ textAlign:'center', padding:'36px 10px', color:'rgba(15,8,0,0.45)', fontFamily:"'Outfit',sans-serif", fontSize:12 }}>
            <div style={{ fontSize:28, marginBottom:8 }}>🛒</div>Añade platos para empezar
          </div>
        ) : items.map(item=>(
          <div key={item.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 0', borderBottom:'1px solid rgba(15,8,0,0.15)' }}>
            <div style={{ width:30, height:30, background:'#0F0800', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>{item.emoji}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#0F0800', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:"'Outfit',sans-serif" }}>{item.name}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              <button onClick={()=>updateQty(item.id,item.qty-1)} style={{ width:20, height:20, border:'2px solid #0F0800', background:'transparent', cursor:'pointer', fontSize:12, color:'#0F0800', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900 }}>−</button>
              <span style={{ fontSize:11, fontWeight:900, color:'#0F0800', minWidth:12, textAlign:'center', fontFamily:"'Outfit',sans-serif" }}>{item.qty}</span>
              <button onClick={()=>updateQty(item.id,item.qty+1)} style={{ width:20, height:20, border:'none', background:'#0F0800', cursor:'pointer', fontSize:12, color:'#FFD43A', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900 }}>+</button>
            </div>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:12, fontWeight:900, color:'#0F0800', minWidth:34, textAlign:'right' }}>€{(item.price*item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>
      {itemCount>0 && (
        <div style={{ padding:'8px 18px', borderTop:'1px solid rgba(15,8,0,0.15)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:5 }}>
            {[{id:'delivery',label:'🛵 Entrega'},{id:'pickup',label:'🏪 Recogida'}].map(o=>(
              <button key={o.id} onClick={()=>setDeliveryType(o.id)} style={{ padding:'7px', border:'2px solid #0F0800', background:deliveryType===o.id?'#0F0800':'transparent', color:deliveryType===o.id?'#FFD43A':'#0F0800', fontSize:10, fontWeight:900, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>{o.label}</button>
            ))}
          </div>
        </div>
      )}
      <div style={{ padding:'12px 18px', borderTop:'2px solid #0F0800', background:'#FAF5EC' }}>
        {itemCount>0 && (
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, fontFamily:"'Outfit',sans-serif" }}>
            <span style={{ fontSize:11, color:'rgba(15,8,0,0.5)' }}>Total</span>
            <span style={{ fontSize:13, fontWeight:900, color:'#0F0800' }}>€{(deliveryType==='delivery'&&deliveryZone?total:subtotal).toFixed(2)}</span>
          </div>
        )}
        <button onClick={()=>onNavigate(itemCount>0?'checkout':'home')} style={{ width:'100%', background:'#0F0800', color:'#FFD43A', border:'none', padding:'12px', fontFamily:"'Outfit',sans-serif", fontSize:12, fontWeight:900, cursor:'pointer', letterSpacing:'.3px' }}>
          {itemCount>0?'IR AL PAGO →':'← VOLVER AL INICIO'}
        </button>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function MenuPage({ onNavigate }) {
  const { itemCount, subtotal } = useCart();
  const [activeCat, setActiveCat] = useState('todo');
  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth<768);
  const [products, setProducts] = useState(staticProducts);

  useEffect(()=>{
    db.getMenu().then(d=>{ if(d?.length>0) setProducts(d.map(r=>({...staticProducts.find(p=>p.id===r.id),...r,price:parseFloat(r.price)})).filter(Boolean)); })
      .catch(()=>{ try{ const s=localStorage.getItem('omg_menu_v1'); if(s){ const sv=JSON.parse(s); setProducts(staticProducts.map(p=>{ const f=sv.find(i=>i.id===p.id); return f?{...p,price:f.price,available:f.available}:p; })); } }catch(e){} });
    const fn=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener('resize',fn);
    return ()=>window.removeEventListener('resize',fn);
  },[]);

  const filtered = useMemo(()=>{
    let list = activeCat==='todo'||activeCat==='packs' ? products : products.filter(p=>p.category===activeCat);
    if(search.trim()){ const q=search.toLowerCase(); list=list.filter(p=>p.name.toLowerCase().includes(q)||p.description.toLowerCase().includes(q)); }
    return list;
  },[activeCat,search,products]);

  const grouped = useMemo(()=>{
    if(activeCat!=='todo'||search.trim()) return null;
    const g={};
    filtered.forEach(p=>{ if(!g[p.category])g[p.category]=[]; g[p.category].push(p); });
    return g;
  },[activeCat,filtered,search]);

  const showPacks = activeCat==='todo'||activeCat==='packs';

  // MOBILE
  if (isMobile) return (
    <div style={{ background:'#FAF5EC', minHeight:'100vh', fontFamily:"'Outfit',sans-serif" }}>
      {/* Sticky header */}
      <div style={{ background:'#FAF5EC', position:'sticky', top:0, zIndex:10, borderBottom:'2px solid #0F0800' }}>
        <div style={{ padding:'14px 16px 0', display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:900, color:'#0F0800', letterSpacing:'-.5px' }}>La carta</div>
          <div style={{ fontSize:10, color:'rgba(15,8,0,0.4)', letterSpacing:'1px' }}>BRASAS · ZARAGOZA</div>
        </div>
        <div style={{ padding:'10px 14px', position:'relative' }}>
          <input type="text" placeholder="Buscar plato..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{ width:'100%', padding:'10px 14px 10px 36px', background:'#FAF5EC', border:'2px solid rgba(15,8,0,0.2)', color:'#0F0800', fontSize:13, boxSizing:'border-box' }}
            onFocus={e=>e.target.style.borderColor='#0F0800'} onBlur={e=>e.target.style.borderColor='rgba(15,8,0,0.2)'} />
          <svg style={{ position:'absolute', left:26, top:'50%', transform:'translateY(-50%)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(15,8,0,0.35)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <div style={{ display:'flex', gap:6, padding:'0 14px 12px', overflowX:'auto', scrollbarWidth:'none' }}>
          {categories.map(c=>(
            <button key={c.id} onClick={()=>{ setActiveCat(c.id); setSearch(''); }} style={{ background:activeCat===c.id?'#0F0800':'transparent', color:activeCat===c.id?'#FFD43A':'rgba(15,8,0,0.55)', border:'2px solid'+( activeCat===c.id?' #0F0800':' rgba(15,8,0,0.2)'), padding:'6px 14px', fontSize:11, fontWeight:900, cursor:'pointer', whiteSpace:'nowrap', fontFamily:"'Outfit',sans-serif", letterSpacing:'.3px', flexShrink:0 }}>
              {c.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:'14px' }}>
        {grouped && Object.entries(grouped).map(([cat,items])=>(
          <div key={cat} style={{ marginBottom:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:900, color:'#0F0800', letterSpacing:'-.3px' }}>{CAT_LABELS[cat]||cat}</div>
              <span style={{ background:'#0F0800', color:'#FFD43A', fontSize:9, fontWeight:900, padding:'3px 8px', letterSpacing:'.5px' }}>{items.length}</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {items.map(p=><MobileCard key={p.id} product={p} />)}
            </div>
          </div>
        ))}
        {!grouped && filtered.map(p=><MobileCard key={p.id} product={p} />)}
        {showPacks && !search && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:900, color:'#0F0800', marginBottom:12, letterSpacing:'-.3px' }}>Packs</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {packs.map(pack=>(
                <div key={pack.id} onClick={()=>onNavigate('packs')} style={{ background:'#FFD43A', border:'2px solid #0F0800', padding:'14px 12px', cursor:'pointer' }}>
                  <div style={{ fontSize:26, marginBottom:8 }}>{pack.emoji}</div>
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:900, color:'#0F0800', marginBottom:4, letterSpacing:'-.2px' }}>{pack.name}</div>
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:900, color:'#0F0800' }}>€{pack.price}</div>
                  <div style={{ fontSize:10, color:'rgba(15,8,0,0.5)', textDecoration:'line-through', fontFamily:"'Outfit',sans-serif" }}>€{pack.originalPrice}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // WEB
  return (
    <div style={{ display:'flex', background:'#FAF5EC', minHeight:'calc(100vh - 97px)', fontFamily:"'Outfit',sans-serif" }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ background:'#FAF5EC', padding:'32px 52px 0', borderBottom:'2px solid #0F0800' }}>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:40, fontWeight:900, color:'#0F0800', margin:'0 0 4px', letterSpacing:'-1.5px' }}>La carta</h1>
          <p style={{ fontSize:12, color:'rgba(15,8,0,0.4)', margin:'0 0 20px', letterSpacing:'1px', textTransform:'uppercase', fontWeight:700 }}>Brasa de leña de encina · Zaragoza</p>
          <div style={{ position:'relative', maxWidth:380, marginBottom:16 }}>
            <svg style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(15,8,0,0.35)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Buscar plato..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{ width:'100%', padding:'10px 14px 10px 38px', background:'#FAF5EC', border:'2px solid rgba(15,8,0,0.2)', color:'#0F0800', fontSize:13, boxSizing:'border-box' }}
              onFocus={e=>e.target.style.borderColor='#0F0800'} onBlur={e=>e.target.style.borderColor='rgba(15,8,0,0.2)'} />
          </div>
          <div style={{ display:'flex', gap:0, overflowX:'auto', scrollbarWidth:'none' }}>
            {categories.map(cat=>(
              <button key={cat.id} onClick={()=>{ setActiveCat(cat.id); setSearch(''); }} style={{ background:activeCat===cat.id?'#FFD43A':'transparent', color:'#0F0800', border:'2px solid #0F0800', borderBottom:activeCat===cat.id?'2px solid #FFD43A':'2px solid #0F0800', marginRight:-2, padding:'9px 20px', fontSize:11, fontWeight:900, cursor:'pointer', whiteSpace:'nowrap', fontFamily:"'Outfit',sans-serif", letterSpacing:'.5px', transition:'all 0.15s' }}>
                {cat.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding:'28px 52px' }}>
          {grouped && Object.entries(grouped).map(([cat,items])=>(
            <div key={cat} style={{ marginBottom:36 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:900, color:'#0F0800', margin:0, letterSpacing:'-.5px' }}>{CAT_LABELS[cat]||cat}</h2>
                <span style={{ background:'#0F0800', color:'#FFD43A', fontSize:9, fontWeight:900, padding:'3px 8px', letterSpacing:'.5px' }}>{items.length}</span>
              </div>
              <div style={{ borderTop:'3px solid #FFD43A', width:36, marginBottom:14 }} />
              {items.map(p=><ProductRow key={p.id} product={p} />)}
            </div>
          ))}
          {!grouped && filtered.map(p=><ProductRow key={p.id} product={p} />)}
          {showPacks && !search && (
            <div style={{ marginTop:grouped?8:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:900, color:'#0F0800', margin:0, letterSpacing:'-.5px' }}>Packs</h2>
              </div>
              <div style={{ borderTop:'3px solid #FFD43A', width:36, marginBottom:14 }} />
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
                {packs.map(pack=>(
                  <div key={pack.id} style={{ background:'#FFD43A', border:'2px solid #0F0800', padding:'20px', cursor:'pointer', transition:'transform 0.2s' }}
                    onClick={()=>onNavigate('packs')}
                    onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                    onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                      <div>
                        <span style={{ background:'#0F0800', color:'#FFD43A', fontSize:9, fontWeight:900, padding:'2px 8px', letterSpacing:'.5px', display:'inline-block', marginBottom:6 }}>{pack.badge.toUpperCase()}</span>
                        <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:900, color:'#0F0800', letterSpacing:'-.3px' }}>{pack.name}</div>
                      </div>
                      <span style={{ fontSize:30 }}>{pack.emoji}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                      <span style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:900, color:'#0F0800' }}>€{pack.price}</span>
                      <span style={{ fontSize:12, color:'rgba(15,8,0,0.45)', textDecoration:'line-through' }}>€{pack.originalPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <WebOrderPanel onNavigate={onNavigate} />
    </div>
  );
}
