import { useState, useEffect } from 'react';
import { packs, products } from '../data/menu';
import { useCart } from '../context/CartContext';
import PhotoPlaceholder from '../components/PhotoPlaceholder';

const S = { cream:'#FAF6EF', dark:'#1a1008', yellow:'#F5C842', border:'rgba(26,16,8,.1)', sub:'rgba(26,16,8,.5)', faint:'rgba(26,16,8,.3)', surface:'#F2EDE4' };

const PACK_DATA = [
  { id:'pack-familiar', label:'Pack Familiar', persons:'Para 4 personas', tagline:'La opción más completa · Ideal para celebraciones', popular:true,
    price:62, originalPrice:76, save:14, perPerson:'~€15.50 / persona',
    desc:'Combinación perfecta de carnes y aves para una mesa de cuatro. Salsas y guarnición incluidas.',
    items:[{n:'2× Pollo de corral entero',d:'Marinado 24h · Leña de encina'},{n:'Chuletón de buey 1 kg',d:'Madurado 45 días · Sal Maldon'},{n:'Verduras de temporada',d:'Selección del mercado · Brasa'},{n:'2 salsas a elegir + pan',d:'Chimichurri · Mojo · Alioli'}] },
  { id:'pack-pareja', label:'Pack Pareja', persons:'Para 2 personas', tagline:'Una noche especial · El equilibrio perfecto', popular:false,
    price:38, originalPrice:46, save:8, perPerson:'~€19 / persona',
    desc:'Dos platos principales con guarnición completa. Carne roja y ave para compartir.',
    items:[{n:'Entrecot Angus 400 g',d:'Ternera irlandesa · Punto a elegir'},{n:'Pollo de corral (medio)',d:'Marinado · Leña de encina'},{n:'Patatas a la brasa',d:'Romero · Sal gruesa'},{n:'Salsa chimichurri',d:'Receta propia de la casa'}] },
  { id:'pack-carnivoro', label:'Pack Carnívoro', persons:'Para 2–3 personas', tagline:'Solo carnes · Para los que no perdonan', popular:false,
    price:52, originalPrice:64, save:12, perPerson:'~€18–26 / persona',
    desc:'Tres cortes de carne premium a la brasa. Sin aves. Solo lo que importa.',
    items:[{n:'Chuletón de buey 1 kg',d:'Madurado 45 días · Sal Maldon'},{n:'Costillas ibéricas 800 g',d:'Ibérico de bellota · Adobo 4h'},{n:'Secreto ibérico 350 g',d:'Corte exclusivo · Ibérico puro'},{n:'Pan de cristal + chimichurri',d:'Receta propia de la casa'}] },
];

const IMG_SM = <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><rect x="1" y="1" width="14" height="10" stroke="rgba(255,255,255,.15)" strokeWidth="1"/><circle cx="4.5" cy="4" r="1.5" stroke="rgba(255,255,255,.15)" strokeWidth="1"/><path d="M1 9l3-2.5 2.5 2 2.5-3 5 3.5" stroke="rgba(255,255,255,.15)" strokeWidth="1" strokeLinejoin="round"/></svg>;

function PackCard({ pack, onAdd, isMobile }) {
  const [added, setAdded] = useState(false);
  const { items } = useCart();
  const inCart = items.find(i=>i.id===pack.id);
  const handleAdd = () => { onAdd(); setAdded(true); setTimeout(()=>setAdded(false),1500); };

  const cardStyle = isMobile ? { background:S.cream, borderBottom:`1px solid ${S.border}`, overflow:'hidden' }
    : { background:S.cream, borderBottom:`1px solid ${S.border}`, display:'grid', gridTemplateColumns:'1fr 280px', gap:0, alignItems:'start' };

  return (
    <div style={cardStyle}>
      {/* Left: info */}
      <div style={{ padding: isMobile ? '0' : '40px 52px' }}>
        {/* Photo */}
        <PhotoPlaceholder height={isMobile?180:200} borderRadius={isMobile?0:12} style={{ width:'100%', marginBottom: isMobile?0:24, position:'relative' }}>
          <div style={{ position:'absolute', top:14, left:14, background:S.yellow, color:S.dark, fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:10 }}>Pack 0{PACK_DATA.indexOf(pack)+1}</div>
          {pack.popular && <div style={{ position:'absolute', top:14, right:14, background:'rgba(0,0,0,.5)', color:'#fff', fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:10, backdropFilter:'blur(8px)' }}>Más popular</div>}
        </PhotoPlaceholder>

        <div style={{ padding: isMobile ? '20px 20px 0' : '0' }}>
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:'2.5px', textTransform:'uppercase', color:S.yellow, marginBottom:8 }}>{pack.label}</div>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize: isMobile?28:34, fontWeight:400, color:S.dark, letterSpacing:'-1px', marginBottom:4 }}>{pack.persons}</div>
          <div style={{ fontSize:13, color:S.sub, marginBottom:14 }}>{pack.tagline}</div>
          <div style={{ fontSize:14, color:S.sub, lineHeight:1.7, marginBottom:22 }}>{pack.desc}</div>

          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:S.faint, marginBottom:10 }}>Incluye</div>
          <div style={{ marginBottom: isMobile?0:0 }}>
            {pack.items.map((item,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom: i<pack.items.length-1?`1px solid ${S.border}`:'none' }}>
                <div style={{ width:36, height:36, background:S.dark, borderRadius:7, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>{IMG_SM}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:S.dark }}>{item.n}</div>
                  <div style={{ fontSize:11, color:S.sub, marginTop:1 }}>{item.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: price + CTA */}
      <div style={{ padding: isMobile ? '20px' : '40px 28px 40px 0' }}>
        <div style={{ background: isMobile?S.surface:'#F2EDE4', borderRadius:14, padding:'24px 20px' }}>
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:S.faint, marginBottom:14 }}>{pack.label}</div>
          <PhotoPlaceholder height={130} borderRadius={10} style={{ width:'100%', marginBottom:18 }} />
          <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:4 }}>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:36, fontWeight:600, color:S.dark, letterSpacing:'-1px' }}>€{pack.price}</span>
            <span style={{ fontSize:14, color:S.faint, textDecoration:'line-through' }}>€{pack.originalPrice}</span>
            <span style={{ background:S.yellow, color:S.dark, fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10 }}>−€{pack.save}</span>
          </div>
          <div style={{ fontSize:12, color:S.faint, marginBottom:18 }}>{pack.perPerson}</div>
          <button onClick={handleAdd} style={{ width:'100%', background:added?S.dark:S.yellow, color:added?S.yellow:S.dark, border:'none', borderRadius:50, padding:14, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', marginBottom:10, transition:'all .15s' }}>
            {added?`En carrito${inCart?` (${inCart.qty})`:''}`:inCart?`En carrito (${inCart.qty}) +`:'Añadir al pedido'}
          </button>
          <div style={{ fontSize:11, color:S.faint, textAlign:'center', lineHeight:1.6 }}>Puedes indicar preferencias en las notas del pedido.</div>
        </div>
      </div>
    </div>
  );
}

export default function PacksPage({ onNavigate }) {
  const { addItem, items, itemCount, subtotal } = useCart();
  const [isMobile, setIsMobile] = useState(window.innerWidth<768);
  useEffect(()=>{ const fn=()=>setIsMobile(window.innerWidth<768); window.addEventListener('resize',fn); return ()=>window.removeEventListener('resize',fn); },[]);

  const addPack = (pack) => {
    const product = { id:pack.id, name:pack.label, price:pack.price, category:'packs', description:pack.tagline, weight:pack.persons, available:true };
    addItem(product);
  };

  return (
    <div style={{ background:S.cream, minHeight:'100vh' }}>
      {/* Hero */}
      <div style={{ background:S.dark, padding: isMobile?'32px 20px 28px':'56px 56px 48px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:240, height:240, background:'radial-gradient(circle, rgba(245,200,66,.06) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ fontSize:10, fontWeight:600, letterSpacing:'2.5px', textTransform:'uppercase', color:S.yellow, marginBottom:14 }}>Packs y combos</div>
        <h1 style={{ fontFamily:"'Fraunces',serif", fontSize: isMobile?38:52, fontWeight:400, color:'#fff', lineHeight:.92, letterSpacing:'-2px', marginBottom:14 }}>
          Todo lo que<br/>necesitas,<br/><em style={{ fontStyle:'italic', fontWeight:300, color:S.yellow }}>en un solo pedido.</em>
        </h1>
        <p style={{ fontSize: isMobile?14:16, color:'rgba(255,255,255,.42)', lineHeight:1.7, maxWidth:520, marginBottom:28 }}>Combos pensados para compartir. Ahorra hasta €14 sobre el precio individual.</p>
        <div style={{ display:'flex', gap: isMobile?28:48, paddingTop:22, borderTop:'1px solid rgba(255,255,255,.07)' }}>
          {[{n:'3 packs',l:'disponibles'},{n:'Hasta €14',l:'de ahorro'},{n:'2–4 pers.',l:'por pack'}].map(s=>(
            <div key={s.l}><div style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:600, color:S.yellow }}>{s.n}</div><div style={{ fontSize:10, color:'rgba(255,255,255,.3)', marginTop:3 }}>{s.l}</div></div>
          ))}
        </div>
      </div>

      {/* Pack cards */}
      {PACK_DATA.map(pack=>(
        <PackCard key={pack.id} pack={pack} onAdd={()=>addPack(pack)} isMobile={isMobile} />
      ))}

      {/* Compare table */}
      <div style={{ background:S.surface, padding: isMobile?'28px 20px':'40px 56px', borderTop:`1px solid ${S.border}` }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:S.faint, marginBottom:16 }}>Comparar packs</div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:360 }}>
            <thead>
              <tr>
                <th style={{ fontSize:11, fontWeight:700, color:S.sub, textAlign:'left', padding:'8px 0', letterSpacing:'.5px', textTransform:'uppercase' }}></th>
                {PACK_DATA.map(p=><th key={p.id} style={{ fontSize:11, fontWeight:700, color:S.sub, textAlign:'center', padding:'8px 12px', letterSpacing:'.5px', textTransform:'uppercase' }}>{p.label.replace('Pack ','')}</th>)}
              </tr>
            </thead>
            <tbody>
              {[['Personas','4','2','2–3'],['Carne roja','✓','✓','✓'],['Aves','✓','✓','—'],['Verduras','✓','—','—'],['Salsas','2 uds.','1 ud.','1 ud.'],['Pan','✓','—','✓'],['Precio','€62','€38','€52'],['Ahorro','€14','€8','€12']].map(([label,...vals])=>(
                <tr key={label} style={{ borderTop:`1px solid ${S.border}` }}>
                  <td style={{ fontSize:13, fontWeight:500, color:S.dark, padding:'11px 0' }}>{label}</td>
                  {vals.map((v,i)=><td key={i} style={{ fontSize:13, textAlign:'center', padding:'11px 12px', color:v==='—'?S.faint:label==='Precio'||label==='Ahorro'?S.dark:v==='✓'?S.dark:S.sub, fontWeight:label==='Precio'||label==='Ahorro'?700:400 }}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      {!isMobile && (
        <footer style={{ background:S.dark, padding:'20px 56px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:S.yellow }}>OhMyGrill Brasas</div>
          <button onClick={()=>onNavigate('menu')} style={{ background:'none', border:'none', fontSize:12, color:'rgba(255,255,255,.3)', cursor:'pointer', fontFamily:'inherit' }}>← Volver a la carta</button>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.15)' }}>© 2025 OhMyGrill Brasas</div>
        </footer>
      )}
    </div>
  );
}
