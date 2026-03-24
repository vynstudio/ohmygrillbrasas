import { useState, useMemo, useEffect } from 'react';
import { products as staticProducts, categories } from '../data/menu';
import { db } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import PhotoPlaceholder from '../components/PhotoPlaceholder';

const S = { cream:'#FAF6EF', dark:'#1a1008', yellow:'#F5C842', border:'rgba(26,16,8,.1)', sub:'rgba(26,16,8,.5)', faint:'rgba(26,16,8,.3)', surface:'#F2EDE4' };
const CAT = { carnes:'Carnes', aves:'Aves y volatería', verduras:'Verduras y guarniciones', salsas:'Salsas y extras' };

function ItemRow({ product, mobile=false }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find(i=>i.id===product.id);
  const handleAdd = () => { if(!product.available) return; addItem(product); setAdded(true); setTimeout(()=>setAdded(false),1300); };

  if (mobile) return (
    <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px', borderBottom:`1px solid ${S.border}`, background:S.cream }}>
      <div style={{ position:'relative', flexShrink:0 }}>
        <PhotoPlaceholder height={72} width={72} borderRadius={12} />
        {!product.available && <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.55)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,.7)', letterSpacing:1, textTransform:'uppercase' }}>Agotado</span></div>}
        {inCart?.qty>0 && <span style={{ position:'absolute', top:-5, right:-5, background:S.yellow, color:S.dark, fontSize:8, fontWeight:700, width:16, height:16, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>{inCart.qty}</span>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap', marginBottom:4 }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:500, color:S.dark }}>{product.name}</span>
          {product.badge && <span style={{ background:S.yellow, color:S.dark, fontSize:9, fontWeight:700, padding:'1px 7px', borderRadius:10 }}>{product.badge}</span>}
        </div>
        <div style={{ fontSize:11, color:S.sub, lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', marginBottom:4 }}>{product.description}</div>
        <div style={{ fontSize:10, color:S.faint, letterSpacing:'.3px' }}>{product.weight}</div>
      </div>
      <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:600, color:S.dark }}>€{product.price%1===0?product.price:product.price.toFixed(2)}</span>
        <button onClick={handleAdd} disabled={!product.available} style={{ background:!product.available?S.surface:added?S.dark:S.yellow, color:!product.available?S.faint:added?S.yellow:S.dark, border:'none', borderRadius:50, padding:'7px 14px', fontSize:11, fontWeight:600, cursor:product.available?'pointer':'not-allowed', fontFamily:'inherit', minWidth:72, textAlign:'center', transition:'all .15s' }}>
          {!product.available?'Agotado':added?'✓':inCart?.qty>0?`(${inCart.qty})+`:'+ Añadir'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display:'flex', alignItems:'center', gap:18, padding:'18px 0', borderBottom:`1px solid ${S.border}` }}>
      <div style={{ position:'relative', flexShrink:0 }}>
        <PhotoPlaceholder height={68} width={68} borderRadius={10} />
        {!product.available && <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.55)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,.7)', letterSpacing:1, textTransform:'uppercase' }}>Agotado</span></div>}
        {inCart?.qty>0 && <span style={{ position:'absolute', top:-5, right:-5, background:S.yellow, color:S.dark, fontSize:9, fontWeight:700, width:17, height:17, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>{inCart.qty}</span>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:17, fontWeight:500, color:S.dark }}>{product.name}</span>
          {product.badge && <span style={{ background:S.yellow, color:S.dark, fontSize:10, fontWeight:600, padding:'2px 9px', borderRadius:20 }}>{product.badge}</span>}
          {!product.available && <span style={{ fontSize:10, color:S.faint, background:S.surface, padding:'2px 8px', borderRadius:10 }}>No disponible</span>}
        </div>
        <div style={{ fontSize:12, color:S.sub, lineHeight:1.55, marginBottom:3 }}>{product.description}</div>
        <div style={{ fontSize:11, color:S.faint, letterSpacing:'.3px' }}>{product.weight}</div>
      </div>
      <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10 }}>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:600, color:S.dark }}>€{product.price%1===0?product.price:product.price.toFixed(2)}</span>
        <button onClick={handleAdd} disabled={!product.available} style={{ background:!product.available?S.surface:added?S.dark:S.yellow, color:!product.available?S.faint:added?S.yellow:S.dark, border:'none', borderRadius:20, padding:'7px 18px', fontSize:12, fontWeight:600, cursor:product.available?'pointer':'not-allowed', fontFamily:'inherit', transition:'all .15s' }}>
          {!product.available?'Agotado':added?'✓ Añadido':'+ Añadir'}
        </button>
      </div>
    </div>
  );
}

function WebOrderPanel({ onNavigate }) {
  const { items, itemCount, subtotal, deliveryFee, total, deliveryType, deliveryZone, updateQty, setDeliveryType } = useCart();
  return (
    <div style={{ width:300, flexShrink:0, display:'flex', flexDirection:'column', background:S.yellow, height:'calc(100vh - 97px)', position:'sticky', top:97, borderLeft:`1px solid ${S.dark}`, overflow:'hidden' }}>
      <div style={{ padding:'16px 20px', borderBottom:`2px solid ${S.dark}` }}>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:S.dark }}>Tu pedido</div>
        <div style={{ fontSize:10, color:'rgba(26,16,8,.5)', marginTop:1 }}>{itemCount>0?`${itemCount} artículo${itemCount>1?'s':''}`:'Vacío'}</div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'10px 20px' }}>
        {itemCount===0 ? <div style={{ textAlign:'center', padding:'36px 10px', color:'rgba(26,16,8,.4)', fontSize:12 }}>Añade platos para empezar</div>
        : items.map(item=>(
          <div key={item.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 0', borderBottom:'1px solid rgba(26,16,8,.15)' }}>
            <PhotoPlaceholder height={30} width={30} borderRadius={6} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:11, fontWeight:600, color:S.dark, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              <button onClick={()=>updateQty(item.id,item.qty-1)} style={{ width:20, height:20, border:'2px solid #1a1008', background:'transparent', borderRadius:'50%', cursor:'pointer', fontSize:12, fontWeight:700, color:S.dark, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
              <span style={{ fontSize:11, fontWeight:700, color:S.dark, minWidth:12, textAlign:'center' }}>{item.qty}</span>
              <button onClick={()=>updateQty(item.id,item.qty+1)} style={{ width:20, height:20, border:'none', background:S.dark, borderRadius:'50%', cursor:'pointer', fontSize:12, fontWeight:700, color:S.yellow, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
            </div>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:12, fontWeight:600, color:S.dark, minWidth:34, textAlign:'right' }}>€{(item.price*item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>
      {itemCount>0 && (
        <div style={{ padding:'8px 20px', borderTop:'1px solid rgba(26,16,8,.15)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:5 }}>
            {[{id:'delivery',label:'Entrega'},{id:'pickup',label:'Recogida'}].map(o=>(
              <button key={o.id} onClick={()=>setDeliveryType(o.id)} style={{ padding:'7px', border:'2px solid #1a1008', background:deliveryType===o.id?S.dark:'transparent', color:deliveryType===o.id?S.yellow:S.dark, fontSize:10, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>{o.label}</button>
            ))}
          </div>
        </div>
      )}
      <div style={{ padding:'12px 20px', borderTop:`2px solid ${S.dark}`, background:S.cream }}>
        {itemCount>0 && <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:13, color:S.sub }}><span>Total</span><span style={{ fontWeight:700, color:S.dark }}>€{(deliveryType==='delivery'&&deliveryZone?total:subtotal).toFixed(2)}</span></div>}
        <button onClick={()=>onNavigate(itemCount>0?'checkout':'home')} style={{ width:'100%', background:S.dark, color:S.yellow, border:'none', borderRadius:10, padding:12, fontFamily:'inherit', fontSize:12, fontWeight:600, cursor:'pointer' }}>
          {itemCount>0?'Finalizar pedido →':'← Volver al inicio'}
        </button>
      </div>
    </div>
  );
}

export default function MenuPage({ onNavigate }) {
  const [activeCat, setActiveCat] = useState('todo');
  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth<768);
  const [products, setProducts] = useState(staticProducts);

  useEffect(()=>{
    db.getMenu().then(d=>{ if(d?.length>0) setProducts(d.map(r=>({...staticProducts.find(p=>p.id===r.id),...r,price:parseFloat(r.price)})).filter(Boolean)); })
      .catch(()=>{ /* Supabase unavailable — use static menu data */ });
    const fn=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener('resize',fn); return ()=>window.removeEventListener('resize',fn);
  },[]);

  const filtered = useMemo(()=>{
    let list = activeCat==='todo'?products:products.filter(p=>p.category===activeCat);
    if(search.trim()){ const q=search.toLowerCase(); list=list.filter(p=>p.name.toLowerCase().includes(q)||p.description.toLowerCase().includes(q)); }
    return list;
  },[activeCat,search,products]);

  const grouped = useMemo(()=>{
    if(activeCat!=='todo'||search.trim()) return null;
    const g={}; filtered.forEach(p=>{ if(!g[p.category])g[p.category]=[]; g[p.category].push(p); }); return g;
  },[activeCat,filtered,search]);

  const CATS = [{id:'todo',label:'Todo'},...categories.filter(c=>c.id!=='todo'&&c.id!=='packs')];

  // MOBILE
  if (isMobile) return (
    <div style={{ background:S.cream, minHeight:'100vh' }}>
      <div style={{ background:S.cream, position:'sticky', top:0, zIndex:10, borderBottom:`1px solid ${S.border}` }}>
        <div style={{ padding:'14px 20px 0', display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:400, color:S.dark, letterSpacing:'-.5px' }}>La carta</div>
          <div style={{ fontSize:11, color:S.faint }}>Brasa de encina · Zaragoza</div>
        </div>
        <div style={{ padding:'10px 16px', position:'relative' }}>
          <svg style={{ position:'absolute', left:28, top:'50%', transform:'translateY(-50%)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(26,16,8,.35)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Buscar plato..." value={search} onChange={e=>{setSearch(e.target.value);setActiveCat('todo');}} style={{ width:'100%', padding:'11px 14px 11px 38px', background:S.surface, border:'1.5px solid transparent', borderRadius:12, fontSize:14, boxSizing:'border-box', color:S.dark }} onFocus={e=>e.target.style.borderColor=S.dark} onBlur={e=>e.target.style.borderColor='transparent'} />
        </div>
        <div style={{ display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none', padding:'0 16px 12px' }}>
          {CATS.map(c=>(
            <button key={c.id} onClick={()=>{setActiveCat(c.id);setSearch('');}} style={{ flexShrink:0, padding:'8px 18px', borderRadius:50, fontSize:13, fontWeight:600, fontFamily:'inherit', border:'1.5px solid'+(activeCat===c.id?` ${S.dark}`:`  rgba(26,16,8,.15)`), background:activeCat===c.id?S.dark:S.cream, color:activeCat===c.id?S.yellow:S.sub, cursor:'pointer', whiteSpace:'nowrap' }}>
              {c.label}
            </button>
          ))}
        </div>
      </div>
      {grouped ? Object.entries(grouped).map(([cat,items])=>(
        <div key={cat}>
          <div style={{ padding:'20px 20px 10px', background:S.cream, borderBottom:`1px solid ${S.border}`, position:'sticky', top:152, zIndex:5, display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:400, color:S.dark }}>{CAT[cat]||cat}</span>
            <span style={{ background:S.surface, color:S.sub, fontSize:10, fontWeight:700, padding:'2px 9px', borderRadius:20 }}>{items.length}</span>
          </div>
          {items.map(p=><ItemRow key={p.id} product={p} mobile />)}
        </div>
      )) : filtered.map(p=><ItemRow key={p.id} product={p} mobile />)}
      {!filtered.length && <div style={{ padding:'56px 20px', textAlign:'center', color:S.sub }}><div style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:400, color:S.dark, marginBottom:6 }}>Sin resultados</div><div style={{ fontSize:14 }}>Prueba con otro término.</div></div>}
    </div>
  );

  // DESKTOP
  return (
    <div style={{ display:'flex', background:S.cream, minHeight:'calc(100vh - 97px)' }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ background:S.cream, padding:'32px 52px 0', borderBottom:`1px solid ${S.border}` }}>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:40, fontWeight:400, color:S.dark, letterSpacing:'-1.2px', marginBottom:4 }}>La carta</h1>
          <p style={{ fontSize:13, color:S.sub, marginBottom:20 }}>Brasa de leña de encina · Zaragoza · Delivery y recogida</p>
          <div style={{ position:'relative', maxWidth:380, marginBottom:16 }}>
            <svg style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(26,16,8,.35)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Buscar plato..." value={search} onChange={e=>{setSearch(e.target.value);setActiveCat('todo');}} style={{ width:'100%', padding:'11px 14px 11px 40px', background:S.surface, border:'1.5px solid transparent', borderRadius:10, fontSize:13, boxSizing:'border-box', color:S.dark }} onFocus={e=>e.target.style.borderColor=S.dark} onBlur={e=>e.target.style.borderColor='transparent'} />
          </div>
          <div style={{ display:'flex', overflowX:'auto', scrollbarWidth:'none' }}>
            {CATS.map(c=>(
              <button key={c.id} onClick={()=>{setActiveCat(c.id);setSearch('');}} style={{ background:activeCat===c.id?S.yellow:'transparent', color:S.dark, border:`2px solid ${S.dark}`, marginRight:-2, padding:'9px 22px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', transition:'all .15s' }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding:'28px 52px' }}>
          {grouped ? Object.entries(grouped).map(([cat,items])=>(
            <div key={cat} style={{ marginBottom:36 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:400, color:S.dark }}>{CAT[cat]||cat}</h2>
                <span style={{ background:S.surface, color:S.sub, fontSize:10, fontWeight:700, padding:'2px 9px', borderRadius:20 }}>{items.length}</span>
              </div>
              <div style={{ width:36, height:2, background:S.yellow, marginBottom:14 }} />
              {items.map(p=><ItemRow key={p.id} product={p} />)}
            </div>
          )) : (<>{filtered.map(p=><ItemRow key={p.id} product={p} />)}{!filtered.length&&<div style={{ padding:'56px 20px', textAlign:'center', color:S.sub }}>Sin resultados para "{search}"</div>}</>)}
        </div>
      </div>
      <WebOrderPanel onNavigate={onNavigate} />
    </div>
  );
}
