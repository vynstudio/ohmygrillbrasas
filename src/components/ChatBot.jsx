import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { products } from '../data/menu';

const S = {
  cream:'#FAF6EF', dark:'#1a1008', yellow:'#F5C842',
  surface:'#F2EDE4', border:'rgba(26,16,8,.1)',
  sub:'rgba(26,16,8,.5)', faint:'rgba(26,16,8,.3)',
};

function formatText(text) {
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/\n/g,'<br/>');
}

function now() {
  return new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
}

function OrderCard({ order, onCheckout }) {
  const shipping = order.subtotal >= 35 ? 0 : 2.5;
  const total = order.subtotal + shipping;
  return (
    <div style={{ background:S.surface, borderRadius:12, padding:14, marginTop:6, border:`1px solid ${S.border}` }}>
      <div style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:S.dark, marginBottom:10 }}>Resumen del pedido</div>
      {order.items.map((item,i) => (
        <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:`1px solid ${S.border}`, fontSize:13, color:S.dark }}>
          <span style={{ fontWeight:500 }}>{item.qty > 1 ? `${item.qty}× ` : ''}{item.name}</span>
          <span style={{ fontFamily:"'Fraunces',serif", fontWeight:600 }}>€{(item.price*item.qty).toFixed(2)}</span>
        </div>
      ))}
      <div style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', fontSize:12, color:S.sub }}>
        <span>Envío {shipping===0?'(gratis, +€35)':''}</span>
        <span>{shipping===0?'Gratis':'€'+shipping.toFixed(2)}</span>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', paddingTop:8, marginTop:4, borderTop:`1px solid rgba(26,16,8,.2)` }}>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:15, fontWeight:600, color:S.dark }}>Total</span>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:15, fontWeight:600, color:S.dark }}>€{total.toFixed(2)}</span>
      </div>
      <button onClick={() => onCheckout(order)} style={{ width:'100%', background:S.yellow, color:S.dark, border:'none', borderRadius:10, padding:'11px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', marginTop:10, transition:'opacity .15s' }}
        onMouseEnter={e=>e.target.style.opacity='.85'} onMouseLeave={e=>e.target.style.opacity='1'}>
        Confirmar y pagar →
      </button>
    </div>
  );
}

export default function ChatBot({ onNavigate }) {
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

  // Welcome message on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role:'bot',
        text:'¡Oh my! Hola, soy **OMG**, el asistente de OhMyGrill Brasas. Carta, packs, entregas, pedidos — lo que necesites. ¿En qué te ayudo?',
        time: now(),
      }]);
      setQuickReplies(['Ver la carta','¿Qué pack me recomiendas?','Quiero hacer un pedido','¿Hacéis entrega a domicilio?']);
      setTimeout(() => scrollBottom(), 100);
    }
    if (open) { setUnread(0); inputRef.current?.focus(); }
  }, [open]);

  useEffect(() => { scrollBottom(); }, [messages]);

  function scrollBottom() {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }

  function getContextualReplies(text) {
    const t = text.toLowerCase();
    if (t.includes('pack')) return ['Añadir al pedido','¿Qué incluye exactamente?','Ver otros packs'];
    if (t.includes('pollo') || t.includes('codorniz')) return ['Añadir al carrito','¿Qué guarniciones tenéis?','¿Cuánto tarda?'];
    if (t.includes('chuletón') || t.includes('entrecot') || t.includes('costilla') || t.includes('secreto')) return ['Quiero pedirlo','¿Qué salsas tenéis?','Ver carta completa'];
    if (t.includes('entrega') || t.includes('zona') || t.includes('min')) return ['Quiero hacer un pedido','¿Hacéis recogida?','Ver la carta'];
    if (t.includes('horario') || t.includes('abierto') || t.includes('cerr')) return ['Hacer un pedido ahora','Ver la carta','¿Dónde estáis?'];
    return [];
  }

  function handleCheckout(order) {
    // Add items to cart
    order.items.forEach(item => {
      const product = products.find(p => p.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0]));
      if (product) {
        for (let i = 0; i < item.qty; i++) addItem(product);
      } else {
        // Generic product fallback
        for (let i = 0; i < item.qty; i++) addItem({ id: item.name.toLowerCase().replace(/\s/g,'-'), name: item.name, price: item.price, category:'carnes', description:'', weight:'', available:true });
      }
    });
    setOpen(false);
    onNavigate('checkout');
  }

  async function send(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setQuickReplies([]);

    const userMsg = { role:'user', text: msg, time: now() };
    setMessages(prev => [...prev, userMsg]);

    const newHistory = [...history, { role:'user', content: msg }];
    setHistory(newHistory);
    setLoading(true);

    try {
      const res = await fetch('/.netlify/functions/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();

      if (!res.ok || data.error) throw new Error(data.error || 'Error');

      const raw = data.content?.[0]?.text || '';
      setHistory(prev => [...prev, { role:'assistant', content: raw }]);

      // Parse order card
      const orderMatch = raw.match(/__ORDER__(.+?)__END__/s);
      let orderData = null;
      let displayText = raw.replace(/__ORDER__.+?__END__/s,'').trim();

      if (orderMatch) {
        try { orderData = JSON.parse(orderMatch[1]); } catch(e) {}
      }

      const botMsg = { role:'bot', text: displayText, time: now(), order: orderData };
      setMessages(prev => [...prev, botMsg]);

      const qrs = getContextualReplies(displayText);
      if (qrs.length) setQuickReplies(qrs);

      if (!open) setUnread(prev => prev + 1);

    } catch(e) {
      setMessages(prev => [...prev, {
        role:'bot',
        text:'Oh my, algo ha fallado. Llámanos al **+34 976 000 000** y te atendemos directamente.',
        time: now(),
      }]);
    }
    setLoading(false);
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const chatH = isMobile ? '100dvh' : 560;
  const chatW = isMobile ? '100vw' : 380;

  return (
    <>
      {/* ── CHAT PANEL ── */}
      <div style={{
        position:'fixed',
        bottom: isMobile ? 0 : 90,
        right: isMobile ? 0 : 24,
        width: chatW,
        height: chatH,
        background: S.cream,
        borderRadius: isMobile ? '20px 20px 0 0' : 20,
        display:'flex', flexDirection:'column',
        boxShadow:'0 24px 80px rgba(0,0,0,.25), 0 0 0 1px rgba(0,0,0,.08)',
        zIndex:998,
        transform: open ? 'translateY(0) scale(1)' : 'translateY(20px) scale(.97)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition:'all .3s cubic-bezier(.4,0,.2,1)',
        transformOrigin:'bottom right',
        overflow:'hidden',
      }}>

        {/* Header */}
        <div style={{ background:S.dark, padding:'14px 18px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <div style={{ width:38, height:38, borderRadius:'50%', overflow:'hidden', border:'2px solid rgba(245,200,66,.3)', flexShrink:0, background:S.yellow, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <img src="/logo.png" alt="OMG" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:15, fontWeight:600, color:'#fff', letterSpacing:'-.2px' }}>OhMyGrill Brasas</div>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', animation:'pulse 2s infinite' }} />
              <span style={{ fontSize:11, color:'rgba(255,255,255,.4)' }}>OMG · Siempre en brasa</span>
            </div>
          </div>
          <button onClick={() => setOpen(false)} style={{ background:'rgba(255,255,255,.08)', border:'none', color:'rgba(255,255,255,.6)', width:30, height:30, borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, transition:'all .15s' }}
            onMouseEnter={e=>{e.target.style.background='rgba(255,255,255,.18)';e.target.style.color='#fff'}}
            onMouseLeave={e=>{e.target.style.background='rgba(255,255,255,.08)';e.target.style.color='rgba(255,255,255,.6)'}}>
            ×
          </button>
        </div>

        {/* Messages */}
        <div ref={messagesRef} style={{ flex:1, overflowY:'auto', padding:14, display:'flex', flexDirection:'column', gap:10 }}
          css="&::-webkit-scrollbar{width:3px}&::-webkit-scrollbar-thumb{background:var(--border)}">
          {messages.map((msg, i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignSelf: msg.role==='user' ? 'flex-end' : 'flex-start', maxWidth:'84%', gap:3, animation:'msgIn .25s ease' }}>
              <div style={{
                padding:'10px 13px',
                borderRadius: msg.role==='user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                background: msg.role==='user' ? S.dark : '#fff',
                color: msg.role==='user' ? '#fff' : S.dark,
                fontSize:14, lineHeight:1.55,
                border: msg.role==='bot' ? `1px solid ${S.border}` : 'none',
                wordBreak:'break-word',
              }} dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
              {msg.order && <OrderCard order={msg.order} onCheckout={handleCheckout} />}
              <span style={{ fontSize:10, color:S.faint, padding:'0 4px', textAlign: msg.role==='user' ? 'right' : 'left' }}>{msg.time}</span>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ alignSelf:'flex-start', padding:'12px 16px', background:'#fff', border:`1px solid ${S.border}`, borderRadius:'4px 16px 16px 16px', display:'flex', gap:4 }}>
              {[0,.2,.4].map((d,i) => (
                <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:S.faint, animation:`typing 1.2s ${d}s infinite` }} />
              ))}
            </div>
          )}
        </div>

        {/* Quick replies */}
        {quickReplies.length > 0 && (
          <div style={{ padding:'6px 12px', display:'flex', gap:7, overflowX:'auto', scrollbarWidth:'none', flexShrink:0 }}>
            {quickReplies.map((qr,i) => (
              <button key={i} onClick={() => { setQuickReplies([]); send(qr); }}
                style={{ background:'#fff', border:`1.5px solid ${S.border}`, borderRadius:20, padding:'7px 14px', fontSize:12, fontWeight:600, color:S.dark, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit', flexShrink:0, transition:'all .15s' }}
                onMouseEnter={e=>{e.target.style.background=S.yellow;e.target.style.borderColor=S.yellow}}
                onMouseLeave={e=>{e.target.style.background='#fff';e.target.style.borderColor=S.border}}>
                {qr}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding:'12px 14px', borderTop:`1px solid ${S.border}`, background:S.cream, flexShrink:0, paddingBottom: isMobile ? 'calc(12px + env(safe-area-inset-bottom,0px))' : 12 }}>
          <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
            <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey}
              placeholder="Escribe tu pregunta o pedido..." rows={1} disabled={loading}
              style={{ flex:1, background:'#fff', border:`1.5px solid ${S.border}`, borderRadius:22, padding:'10px 15px', fontSize:14, fontFamily:'inherit', color:S.dark, resize:'none', maxHeight:90, lineHeight:1.4, transition:'border-color .2s' }}
              onFocus={e=>e.target.style.borderColor=S.dark}
              onBlur={e=>e.target.style.borderColor=S.border}
              onInput={e=>{e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,90)+'px'}} />
            <button onClick={() => send()} disabled={loading || !input.trim()}
              style={{ width:40, height:40, background: input.trim() && !loading ? S.dark : S.surface, border:'none', borderRadius:'50%', cursor: input.trim() && !loading ? 'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .2s' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={input.trim()&&!loading?'#fff':S.faint} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── FLOATING TRIGGER ── */}
      <button onClick={() => setOpen(o => !o)} style={{
        position:'fixed',
        bottom: isMobile ? 'calc(72px + 14px + env(safe-area-inset-bottom,0px))' : 24,
        right:24,
        width:56, height:56,
        background: open ? S.surface : S.dark,
        border: `2px solid ${open ? S.border : S.dark}`,
        borderRadius:'50%',
        cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 8px 28px rgba(0,0,0,.25)',
        zIndex:999,
        transition:'all .25s cubic-bezier(.4,0,.2,1)',
        transform: open ? 'rotate(0deg)' : 'rotate(0deg)',
      }}
        onMouseEnter={e=>{if(!open)e.currentTarget.style.transform='scale(1.1)'}}
        onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>

        {/* Unread badge */}
        {unread > 0 && !open && (
          <div style={{ position:'absolute', top:-3, right:-3, width:18, height:18, background:S.yellow, color:S.dark, fontSize:10, fontWeight:700, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${S.dark}` }}>
            {unread}
          </div>
        )}

        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={S.sub} strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={S.yellow} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes typing{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
        @keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </>
  );
}
