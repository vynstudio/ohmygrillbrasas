import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { products } from '../data/menu';

const S = {
  cream:'#FAF6EF', dark:'#1a1008', yellow:'#F5C842',
  surface:'#F2EDE4', border:'rgba(26,16,8,.1)',
  sub:'rgba(26,16,8,.5)', faint:'rgba(26,16,8,.3)',
};

function fmt(text) {
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/\n/g,'<br/>');
}
const hhMM = () => new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});

// ── Order summary card ─────────────────────────────────────────────────────────
function OrderCard({ order, onCheckout }) {
  const shipping = order.subtotal >= 35 ? 0 : 2.5;
  const total = order.subtotal + shipping;
  return (
    <div style={{ background:S.surface, borderRadius:12, padding:14, marginTop:6, border:`1px solid ${S.border}` }}>
      <div style={{ fontFamily:"'Fraunces',serif", fontSize:13, fontWeight:600, color:S.dark, marginBottom:8 }}>Resumen del pedido</div>
      {order.items.map((item,i) => (
        <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:`1px solid ${S.border}`, fontSize:12, color:S.dark }}>
          <span style={{ fontWeight:500 }}>{item.qty>1?`${item.qty}× `:''}{item.name}</span>
          <span style={{ fontFamily:"'Fraunces',serif", fontWeight:600 }}>€{(item.price*item.qty).toFixed(2)}</span>
        </div>
      ))}
      <div style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', fontSize:11, color:S.sub }}>
        <span>Envío{shipping===0?' (gratis +€35)':''}</span>
        <span>{shipping===0?'Gratis':'€'+shipping.toFixed(2)}</span>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', paddingTop:8, marginTop:3, borderTop:'1px solid rgba(26,16,8,.15)' }}>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:S.dark }}>Total</span>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:S.dark }}>€{total.toFixed(2)}</span>
      </div>
      <button onClick={() => onCheckout(order)}
        style={{ width:'100%', background:S.yellow, color:S.dark, border:'none', borderRadius:10, padding:11, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', marginTop:10 }}>
        Confirmar y pagar →
      </button>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ChatBot({ onNavigate, activePage }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [quickReplies, setQuickReplies] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // Welcome on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      const welcome = {
        role:'bot', time:hhMM(),
        text:'¡Oh my! Soy **OMG**, el asistente de OhMyGrill. Dime qué quieres pedir o pregúntame lo que sea.',
      };
      setMessages([welcome]);
      setQuickReplies(['Pollo de corral','Pack Carnívoro','¿Qué me recomiendas?','Zonas de entrega']);
      setTimeout(scrollBottom, 80);
    }
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 200); }
  }, [open]);

  useEffect(scrollBottom, [messages, loading]);

  function scrollBottom() {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }

  // Smart quick replies based on bot response context
  function nextReplies(text) {
    const t = text.toLowerCase();
    if (t.includes('pack familiar'))   return ['Añadir Pack Familiar al pedido','¿Qué lleva exactamente?','Ver otros packs'];
    if (t.includes('pack pareja'))     return ['Añadir Pack Pareja al pedido','¿Qué lleva exactamente?','Ver otros packs'];
    if (t.includes('pack carnívoro') || t.includes('pack carnivoro')) return ['Añadir Pack Carnívoro al pedido','¿Qué lleva exactamente?','Ver otros packs'];
    if (t.includes('pollo'))           return ['Añadir pollo al pedido','+ Patatas a las brasas','+ Chimichurri artesano'];
    if (t.includes('chuletón'))        return ['Añadir chuletón al pedido','+ Pan de cristal','+ Chimichurri artesano'];
    if (t.includes('costilla'))        return ['Añadir costillas al pedido','+ Mojo picón','¿Para cuántos somos?'];
    if (t.includes('entrecot'))        return ['Añadir entrecot al pedido','+ Patatas a las brasas','+ Salsa'];
    if (t.includes('1.') || t.includes('2.') || t.includes('elige tu número') || t.includes('elige tu numero') || (t.includes('zona') && t.includes('€')))
      return ['1. Centro','2. Delicias','3. Oliver','4. Las Fuentes','5. Torrero','6. Casablanca','Recogida en local'];
    if (t.includes('entrega') || t.includes('zona') || t.includes('domicilio')) return ['¿Cuánto cuesta el envío?','¿Hacéis recogida?','Quiero hacer un pedido'];
    if (t.includes('horario') || t.includes('abierto'))  return ['Hacer un pedido ahora','Ver la carta'];
    if (t.includes('resumen') || t.includes('pedido'))   return ['Confirmar pedido','Añadir algo más','Cambiar algo'];
    return [];
  }

  // Checkout handoff
  function handleCheckout(order) {
    order.items.forEach(item => {
      const match = products.find(p =>
        p.name.toLowerCase().includes(item.name.toLowerCase().split(' ').slice(0,2).join(' '))
      );
      const product = match || {
        id: item.name.toLowerCase().replace(/\s+/g,'-'),
        name: item.name, price: item.price,
        category:'carnes', description:'', weight:'', available:true,
      };
      for (let i = 0; i < item.qty; i++) addItem(product);
    });
    setOpen(false);
    onNavigate('checkout');
  }

  // Send message
  async function send(text) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput('');
    setQuickReplies([]);

    setMessages(prev => [...prev, { role:'user', text:msg, time:hhMM() }]);
    const newHist = [...history, { role:'user', content:msg }];
    setHistory(newHist);
    setLoading(true);

    try {
      const res = await fetch('/.netlify/functions/chat', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ messages: newHist }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Error');

      const raw = data.content?.[0]?.text || '';
      setHistory(prev => [...prev, { role:'assistant', content:raw }]);

      const orderMatch = raw.match(/__ORDER__(.+?)__END__/s);
      let orderData = null;
      let displayText = raw.replace(/__ORDER__.+?__END__/s,'').trim();
      if (orderMatch) { try { orderData = JSON.parse(orderMatch[1]); } catch(e) {} }

      setMessages(prev => [...prev, { role:'bot', text:displayText, time:hhMM(), order:orderData }]);
      const qrs = nextReplies(displayText);
      if (qrs.length) setQuickReplies(qrs);
      if (!open) setUnread(u => u+1);

    } catch(e) {
      setMessages(prev => [...prev, {
        role:'bot', time:hhMM(),
        text:'Oh my, algo ha fallado. Llámanos al **+34 976 000 000** y te atendemos.',
      }]);
    }
    setLoading(false);
  }

  const onKey = e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  // ── DESKTOP: anchor pill in navbar area, panel opens upward ────────────────
  // ── MOBILE: yellow bar above tab bar, panel is full bottom-sheet ───────────

  const TAB_H = 72; // must match BottomNav

  return (
    <>
      {/* ══ CHAT PANEL ══ */}
      <div style={{
        position:'fixed',
        // Desktop: right side, opens upward from navbar bottom edge
        // Mobile: full-width bottom sheet above tab bar
        ...(isMobile ? {
          bottom: open ? TAB_H : '-100%',
          left:0, right:0,
          height:'70dvh',
          borderRadius:'20px 20px 0 0',
        } : {
            bottom: 108,
          left: 32,
          width: 380,
          height: 560,
          borderRadius: 16,
        }),
        background: S.cream,
        display:'flex', flexDirection:'column',
        boxShadow:'0 24px 80px rgba(0,0,0,.22), 0 0 0 1px rgba(0,0,0,.07)',
        zIndex: 998,
        transform: open
          ? 'translateY(0) scale(1)'
          : isMobile
            ? 'translateY(100%)'
            : 'translateY(12px) scale(.98)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition: 'transform .32s cubic-bezier(.4,0,.2,1), opacity .25s ease',
        overflow:'hidden',
      }}>

        {/* Handle (mobile only) */}
        {isMobile && (
          <div style={{ width:36, height:4, background:S.border, borderRadius:2, margin:'10px auto 0', flexShrink:0 }} />
        )}

        {/* Header */}
        <div style={{ background:S.dark, padding:'12px 16px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', overflow:'hidden', border:'2px solid rgba(245,200,66,.3)', flexShrink:0 }}>
            <img src="/logo.png" alt="OMG" style={{ width:'100%', height:'100%', objectFit:'cover' }}
              onError={e => { e.target.style.display='none'; e.target.parentNode.style.background=S.yellow; e.target.parentNode.innerHTML='<span style="font-size:11px;font-weight:800;color:#1a1008;font-family:Outfit">OMG</span>'; }} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:'#fff' }}>OhMyGrill Brasas</div>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:'#4ade80' }} />
              <span style={{ fontSize:10, color:'rgba(255,255,255,.4)' }}>OMG · Siempre en brasa</span>
            </div>
          </div>
          <button onClick={() => setOpen(false)}
            style={{ background:'rgba(255,255,255,.08)', border:'none', color:'rgba(255,255,255,.55)', width:28, height:28, borderRadius:'50%', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s' }}>×</button>
        </div>

        {/* Messages */}
        <div ref={messagesRef} style={{ flex:1, overflowY:'auto', padding:12, display:'flex', flexDirection:'column', gap:8 }}>
          {messages.map((msg,i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignSelf: msg.role==='user'?'flex-end':'flex-start', maxWidth:'86%', gap:2 }}>
              <div style={{
                padding:'10px 13px', fontSize:13, lineHeight:1.55, wordBreak:'break-word',
                borderRadius: msg.role==='user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                background: msg.role==='user' ? S.dark : '#fff',
                color: msg.role==='user' ? '#fff' : S.dark,
                border: msg.role==='bot' ? `1px solid ${S.border}` : 'none',
                animation:'msgIn .22s ease',
              }} dangerouslySetInnerHTML={{ __html: fmt(msg.text) }} />
              {msg.order && <OrderCard order={msg.order} onCheckout={handleCheckout} />}
              <span style={{ fontSize:10, color:S.faint, padding:'0 3px', textAlign: msg.role==='user'?'right':'left' }}>{msg.time}</span>
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf:'flex-start', padding:'10px 14px', background:'#fff', border:`1px solid ${S.border}`, borderRadius:'4px 16px 16px 16px', display:'flex', gap:4 }}>
              {[0,.2,.4].map((_,i) => <div key={i} style={{ width:5, height:5, borderRadius:'50%', background:S.faint, animation:`typing 1.2s ${_}s infinite` }}/>)}
            </div>
          )}
        </div>

        {/* Quick replies */}
        {quickReplies.length > 0 && (
          <div style={{ padding:'6px 10px', display:'flex', gap:6, overflowX:'auto', scrollbarWidth:'none', flexShrink:0 }}>
            {quickReplies.map((qr,i) => (
              <button key={i} onClick={() => { setQuickReplies([]); send(qr); }}
                style={{ background:'#fff', border:`1.5px solid ${S.border}`, borderRadius:20, padding:'6px 13px', fontSize:12, fontWeight:600, color:S.dark, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit', flexShrink:0, transition:'all .15s' }}
                onMouseEnter={e=>{e.currentTarget.style.background=S.yellow;e.currentTarget.style.borderColor=S.yellow}}
                onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.borderColor=S.border}}>
                {qr}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding:'10px 12px', borderTop:`1px solid ${S.border}`, background:S.cream, flexShrink:0, paddingBottom: isMobile?'calc(10px + env(safe-area-inset-bottom,0px))':10 }}>
          <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
            <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey}
              placeholder="Escribe tu pedido o pregunta..." rows={1} disabled={loading}
              style={{ flex:1, background:'#fff', border:`1.5px solid ${S.border}`, borderRadius:20, padding:'9px 14px', fontSize:13, fontFamily:'inherit', color:S.dark, resize:'none', maxHeight:80, lineHeight:1.4, transition:'border-color .2s' }}
              onFocus={e=>e.target.style.borderColor=S.dark}
              onBlur={e=>e.target.style.borderColor=S.border}
              onInput={e=>{e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,80)+'px'}} />
            <button onClick={() => send()} disabled={loading||!input.trim()}
              style={{ width:38, height:38, background:input.trim()&&!loading?S.dark:S.surface, border:'none', borderRadius:'50%', cursor:input.trim()&&!loading?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .2s' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={input.trim()&&!loading?'#fff':S.faint} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ══ DESKTOP: persistent pill anchored to top-right of viewport ══
           Shows in navbar area — always visible, branded, purposeful        */}
      {!isMobile && (
        <button onClick={() => setOpen(o=>!o)} style={{
          position:'fixed',
          bottom: 32,
          left: 32,
          top: 'auto',
          display:'flex', alignItems:'center', gap:9,
          background: open ? S.surface : S.dark,
          border: `1.5px solid ${open ? S.border : S.dark}`,
          borderRadius: 24,
          padding: '8px 18px 8px 10px',
          cursor:'pointer',
          zIndex: 1001, // above sticky navbar (100)
          boxShadow: open ? 'none' : '0 4px 16px rgba(0,0,0,.18)',
          transition:'all .2s',
          fontFamily:'inherit',
        }}
          onMouseEnter={e=>{if(!open){e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,.22)'}}}
          onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=open?'none':'0 4px 16px rgba(0,0,0,.18)'}}>

          {/* Avatar */}
          <div style={{ width:28, height:28, borderRadius:'50%', overflow:'hidden', border:`1.5px solid ${open?S.border:'rgba(245,200,66,.4)'}`, flexShrink:0, background:S.yellow }}>
            <img src="/logo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}
              onError={e=>e.target.style.display='none'} />
          </div>

          {/* Label */}
          <span style={{ fontSize:13, fontWeight:600, color: open?S.sub:S.yellow, whiteSpace:'nowrap' }}>
            {open ? 'Cerrar chat' : '¿Qué pedimos?'}
          </span>

          {/* Unread badge */}
          {unread > 0 && !open && (
            <div style={{ width:17, height:17, background:S.yellow, color:S.dark, fontSize:9, fontWeight:800, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginLeft:-4 }}>
              {unread}
            </div>
          )}
        </button>
      )}

      {/* ══ MOBILE: yellow "¿Qué pedimos?" bar above tab bar ══
           Replaces the generic floating bubble entirely              */}
      {isMobile && (
        <button onClick={() => setOpen(o=>!o)} style={{
          position:'fixed',
          bottom: TAB_H,
          left:0, right:0,
          background: open ? S.dark : S.yellow,
          border:'none',
          borderTop: `1px solid ${open?'rgba(255,255,255,.08)':'rgba(26,16,8,.12)'}`,
          padding:'11px 20px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          cursor:'pointer',
          zIndex:199,
          fontFamily:'inherit',
          transition:'background .2s',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {/* Logo dot */}
            <div style={{ width:28, height:28, borderRadius:'50%', overflow:'hidden', border:`1.5px solid ${open?'rgba(245,200,66,.3)':'rgba(26,16,8,.2)'}`, flexShrink:0, background: open?S.yellow:S.dark }}>
              <img src="/logo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}
                onError={e=>e.target.style.display='none'} />
            </div>
            <span style={{ fontSize:14, fontWeight:700, color: open?S.yellow:S.dark }}>
              {open ? 'Cerrar chat' : '¿Qué pedimos hoy?'}
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {unread > 0 && !open && (
              <div style={{ width:18, height:18, background:S.dark, color:S.yellow, fontSize:10, fontWeight:800, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {unread}
              </div>
            )}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={open?S.yellow:S.dark} strokeWidth="2.5" strokeLinecap="round">
              <polyline points={open?"6 15 12 9 18 15":"6 9 12 15 18 9"}/>
            </svg>
          </div>
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && open && (
        <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.3)', zIndex:997, backdropFilter:'blur(2px)' }} />
      )}

      <style>{`
        @keyframes msgIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        @keyframes typing{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
      `}</style>
    </>
  );
}
