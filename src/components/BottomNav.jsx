import { useCart } from '../context/CartContext';

const tabs = [
  { id:'home', label:'Inicio', icon: (a) => <svg width="18" height="18" viewBox="0 0 24 24" fill={a?'#0F0800':'none'} stroke={a?'#0F0800':'rgba(15,8,0,0.35)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id:'menu', label:'Carta', icon: (a) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={a?'#0F0800':'rgba(15,8,0,0.35)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
  { id:'packs', label:'Packs', icon: (a) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={a?'#0F0800':'rgba(15,8,0,0.35)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg> },
  { id:'checkout', label:'Pedido', icon: (a) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={a?'#0F0800':'rgba(15,8,0,0.35)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> },
];

export default function BottomNav({ activePage, onNavigate }) {
  const { itemCount, subtotal } = useCart();

  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:200, background:'#FFFFFF', borderTop:'1.5px solid rgba(15,8,0,0.12)', paddingBottom:'env(safe-area-inset-bottom,0px)' }}>
      {/* Cart bar */}
      {itemCount > 0 && activePage !== 'checkout' && (
        <button onClick={() => onNavigate('checkout')} style={{ width:'100%', background:'#FFD43A', color:'#0F0800', border:'none', borderBottom:'1px solid rgba(15,8,0,0.12)', padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>
          <span style={{ fontSize:13, fontWeight:700 }}>🛒 {itemCount} artículo{itemCount>1?'s':''}</span>
          <span style={{ fontSize:13, fontWeight:700 }}>Ver pedido · €{subtotal.toFixed(2)} →</span>
        </button>
      )}
      {/* Tabs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
        {tabs.map(tab => {
          const active = activePage === tab.id;
          return (
            <button key={tab.id} onClick={() => onNavigate(tab.id)} style={{ background: active ? '#F5F0E8' : '#FFFFFF', border:'none', cursor:'pointer', padding:'10px 0 8px', display:'flex', flexDirection:'column', alignItems:'center', gap:3, position:'relative', borderTop: active ? '2px solid #FFD43A' : '2px solid transparent', transition:'all 0.15s' }}>
              {tab.id === 'checkout' && itemCount > 0 && (
                <span style={{ position:'absolute', top:5, right:'calc(50% - 16px)', background:'#0F0800', color:'#FFFFFF', fontSize:9, fontWeight:700, width:15, height:15, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>{itemCount}</span>
              )}
              {tab.icon(active)}
              <span style={{ fontSize:10, fontWeight: active ? 700 : 400, color: active ? '#0F0800' : 'rgba(15,8,0,0.4)', fontFamily:"'Outfit',sans-serif" }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
