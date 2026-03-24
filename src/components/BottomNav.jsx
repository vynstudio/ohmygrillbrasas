import { useCart } from '../context/CartContext';

const LOGO_SVG = (
  <svg width="15" height="14" viewBox="0 0 20 18" fill="none">
    <path d="M3 14 Q3 4 10 4 Q17 4 17 14" stroke="#F5C842" strokeWidth="2" strokeLinecap="round"/>
    <line x1="1" y1="17" x2="19" y2="17" stroke="#F5C842" strokeWidth="2" strokeLinecap="round"/>
    <line x1="4" y1="17" x2="4" y2="14" stroke="#F5C842" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="10" y1="17" x2="10" y2="13" stroke="#F5C842" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="16" y1="17" x2="16" y2="14" stroke="#F5C842" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const TABS = [
  { id:'home', label:'Inicio', icon:(a) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?'#1a1008':'rgba(26,16,8,.3)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id:'menu', label:'Carta', icon:(a) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?'#1a1008':'rgba(26,16,8,.3)'} strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
  { id:'packs', label:'Packs', icon:(a) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?'#1a1008':'rgba(26,16,8,.3)'} strokeWidth="2" strokeLinecap="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg> },
  { id:'about', label:'Nosotros', icon:(a) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?'#1a1008':'rgba(26,16,8,.3)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg> },
];

export default function BottomNav({ activePage, onNavigate }) {
  const { itemCount, subtotal } = useCart();
  const isCheckout = activePage === 'checkout';

  return (
    <>
      {/* Yellow cart bar above tabs */}
      {itemCount > 0 && !isCheckout && (
        <button onClick={() => onNavigate('checkout')} style={{ position:'fixed', bottom:72, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:430, background:'#F5C842', color:'#1a1008', border:'none', borderTop:'1px solid rgba(26,16,8,.12)', padding:'13px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', fontFamily:"'Outfit',sans-serif", zIndex:199 }}>
          <span style={{ fontSize:13, fontWeight:700 }}>🛒 {itemCount} artículo{itemCount>1?'s':''}</span>
          <span style={{ fontSize:13, fontWeight:700 }}>Finalizar pedido · €{subtotal.toFixed(2)} →</span>
        </button>
      )}

      {/* Tab bar */}
      <nav style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:430, background:'#fff', borderTop:'1px solid rgba(26,16,8,.1)', height:72, display:'grid', gridTemplateColumns:'repeat(4,1fr)', zIndex:200, paddingBottom:'env(safe-area-inset-bottom,0px)' }}>
        {TABS.map((tab) => {
          const active = activePage === tab.id || (tab.id === 'about' && activePage === 'contact');
          return (
            <button key={tab.id} onClick={() => onNavigate(tab.id)} style={{ background: active ? '#F2EDE4' : '#fff', border:'none', borderTop:`2px solid ${active ? '#F5C842' : 'transparent'}`, cursor:'pointer', paddingTop:2, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, transition:'all .15s', position:'relative' }}>
              {tab.id === 'menu' && itemCount > 0 && !isCheckout && (
                <span style={{ position:'absolute', top:6, right:'calc(50% - 14px)', background:'#F5C842', color:'#1a1008', fontSize:9, fontWeight:700, width:15, height:15, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>{itemCount}</span>
              )}
              {tab.icon(active)}
              <span style={{ fontSize:10, fontWeight: active ? 700 : 500, color: active ? '#1a1008' : 'rgba(26,16,8,.35)', fontFamily:"'Outfit',sans-serif" }}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
