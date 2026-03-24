import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { products } from '../data/menu';

const S = {
  cream:'#FAF6EF', dark:'#1a1008', yellow:'#F5C842',
  surface:'#F2EDE4', border:'rgba(26,16,8,.1)',
  sub:'rgba(26,16,8,.5)', faint:'rgba(26,16,8,.3)',
};

const fmt = t => t
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
  .replace(/\*(.+?)\*/g,'<em>$1</em>')
  .replace(/\n/g,'<br/>');

const hhmm = () => new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});

// ── Parse __OPTIONS__ from bot response ──────────────────────────────────────
function parseOptions(text) {
  const m = text.match(/__OPTIONS__(.+?)__END__/);
  if (!m) return [];
  return m[1].split('|').map(s => s.trim()).filter(Boolean).slice(0, 3);
}

// ── Order card ────────────────────────────────────────────────────────────────
function OrderCard({ order, onCheckout }) {
  const fee = order.deliveryFee ?? (order.subtotal >= 35 ? 0 : 3);
  const total = order.subtotal + fee;
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
        <span>{order.zone ? `Envío · ${order.zone}` : 'Envío'}{fee===0?' (gratis)':''}</span>
        <span>{fee===0?'Gratis':'€'+fee.toFixed(2)}</span>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', paddingTop:8, marginTop:3, borderTop:'1px solid rgba(26,16,8,.15)' }}>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:S.dark }}>Total</span>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:S.dark }}>€{total.toFixed(2)}</span>
      </div>
      <button onClick={() => onCheckout(order)}
        style={{ width:'100%', background:S.yellow, color:S.dark, border:'none', borderRadius:10, padding:12, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit', marginTop:10, transition:'opacity .15s' }}
        onMouseEnter={e=>e.currentTarget.style.opacity='.85'}
        onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
        Confirmar y pagar →
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ChatBot({ onNavigate }) {
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState([]);
  const [history, setHistory]     = useState([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [unread, setUnread]       = useState(0);

  const [isMobile, setIsMobile]   = useState(window.innerWidth < 768);
  const msgRef  = useRef(null);
  const inputRef = useRef(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // First open — welcome + first guided question
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role:'bot', time:hhmm(),
        text:'¡Oh my! Soy **OMG**, el asistente de OhMyGrill. Vamos a hacerte el pedido perfecto. ¿Para cuántos coméis hoy?',
      }]);
      setQuickReplies(['Solo yo','Para 2','Para 3–4','Para 5 o más']);
      setTimeout(scrollBot, 80);
    }
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 200); }
  }, [open]);

  useEffect(scrollBot, [messages, loading]);

  function scrollBot() {
    if (msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight;
  }

  // Checkout handoff — adds items to cart, navigates to checkout
  function handleCheckout(order) {
    order.items.forEach(item => {
      const match = products.find(p =>
        p.name.toLowerCase().includes(item.name.toLowerCase().split(' ').slice(0,2).join(' ').toLowerCase())
      ) || {
        id: item.name.toLowerCase().replace(/\s+/g,'-'),
        name: item.name, price: item.price,
        category:'carnes', description:'', weight:'', available:true,
      };
      for (let i = 0; i < (item.qty||1); i++) addItem(match);
    });
    setOpen(false);
    onNavigate('checkout');
  }

  // Send message to API
  async function send(text) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role:'user', text:msg, time:hhmm() };
    setMessages(prev => [...prev, userMsg]);
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

      // Parse order JSON
      const orderMatch = raw.match(/__ORDER__(.+?)__END__/s);
      let orderData = null;
      let displayText = raw.replace(/__ORDER__.+?__END__/s,'').trim();
      if (orderMatch) { try { orderData = JSON.parse(orderMatch[1]); } catch(e) {} }

      // Parse options from bot response
      const options = parseOptions(raw);
      const cleanText = displayText.replace(/__OPTIONS__.+?__END__/s,'').trim();

      setMessages(prev => [...prev, { role:'bot', text:cleanText, time:hhmm(), order:orderData }]);
      setQuickReplies(options);

      if (!open) setUnread(u => u+1);

    } catch(e) {
      setMessages(prev => [...prev, {
        role:'bot', time:hhmm(),
        text:'Oh my, algo ha fallado. Llámanos al **+34 976 000 000** y te atendemos.',
      }]);
    }
    setLoading(false);
  }

  const onKey = e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  const qrs = quickReplies;
  const TAB_H = 72;

  return (
    <>
      {/* ══ CHAT PANEL ══ */}
      <div style={{
        position:'fixed',
        ...(isMobile ? {
          bottom: open ? TAB_H : 0,
          left:0, right:0,
          height:'68dvh',
          borderRadius:'20px 20px 0 0',
        } : {
          bottom: 100,
          left: 32,
          width: 360,
          height: Math.min(520, window.innerHeight - 140),
          borderRadius: 14,
        }),
        background: S.cream,
        display:'flex', flexDirection:'column',
        boxShadow:'0 24px 80px rgba(0,0,0,.22), 0 0 0 1px rgba(0,0,0,.07)',
        zIndex:998,
        transform: open
          ? 'translateY(0) scale(1)'
          : isMobile ? 'translateY(100%)' : 'translateY(14px) scale(.97)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition:'transform .32s cubic-bezier(.4,0,.2,1), opacity .25s ease',
        transformOrigin:'bottom left',
        overflow:'hidden',
      }}>

        {/* Handle mobile */}
        {isMobile && <div style={{ width:36, height:4, background:S.border, borderRadius:2, margin:'10px auto 0', flexShrink:0 }} />}

        {/* Header */}
        <div style={{ background:S.dark, padding:'12px 16px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', overflow:'hidden', border:'2px solid rgba(245,200,66,.3)', flexShrink:0 }}>
            <img src="/logo.png" alt="OMG" style={{ width:'100%', height:'100%', objectFit:'cover' }}
              onError={e=>{e.target.style.display='none';e.target.parentNode.style.background=S.yellow;}} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:'#fff' }}>OhMyGrill Brasas</div>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:'#4ade80' }} />
              <span style={{ fontSize:10, color:'rgba(255,255,255,.4)' }}>OMG · Siempre en brasa</span>
            </div>
          </div>
          {/* Reset button */}
          <button onClick={() => { setMessages([]); setHistory([]); setStage('welcome'); setUnread(0); }}
            title="Nuevo chat"
            style={{ background:'rgba(255,255,255,.07)', border:'none', color:'rgba(255,255,255,.4)', width:28, height:28, borderRadius:'50%', cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', marginRight:4, transition:'all .15s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.15)';e.currentTarget.style.color='#fff'}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.07)';e.currentTarget.style.color='rgba(255,255,255,.4)'}}>↺</button>
          <button onClick={() => setOpen(false)}
            style={{ background:'rgba(255,255,255,.07)', border:'none', color:'rgba(255,255,255,.4)', width:28, height:28, borderRadius:'50%', cursor:'pointer', fontSize:17, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.15)';e.currentTarget.style.color='#fff'}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.07)';e.currentTarget.style.color='rgba(255,255,255,.4)'}}>×</button>
        </div>

        {/* Progress bar — shows flow stage visually */}
        <div style={{ height:2, background:S.surface, flexShrink:0 }}>
          <div style={{
            height:'100%', background:S.yellow, transition:'width .4s ease',
            width: messages.length <= 1 ? '10%' : messages.length <= 3 ? '35%' : messages.length <= 5 ? '65%' : quickReplies.some(q=>q.includes('Confirmar')) ? '100%' : '80%',
          }} />
        </div>

        {/* Messages */}
        <div ref={msgRef} style={{ flex:1, overflowY:'auto', padding:'12px 12px 4px', display:'flex', flexDirection:'column', gap:8 }}>
          {messages.map((msg,i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignSelf:msg.role==='user'?'flex-end':'flex-start', maxWidth:'88%', gap:2 }}>
              <div style={{
                padding:'10px 13px', fontSize:13, lineHeight:1.55, wordBreak:'break-word',
                borderRadius: msg.role==='user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                background: msg.role==='user' ? S.dark : '#fff',
                color: msg.role==='user' ? '#fff' : S.dark,
                border: msg.role==='bot' ? `1px solid ${S.border}` : 'none',
                animation:'msgIn .22s ease',
              }} dangerouslySetInnerHTML={{ __html: fmt(msg.text) }} />
              {msg.order && <OrderCard order={msg.order} onCheckout={handleCheckout} />}
              <span style={{ fontSize:10, color:S.faint, padding:'0 3px', textAlign:msg.role==='user'?'right':'left' }}>{msg.time}</span>
            </div>
          ))}

          {/* Typing dots */}
          {loading && (
            <div style={{ alignSelf:'flex-start', padding:'10px 14px', background:'#fff', border:`1px solid ${S.border}`, borderRadius:'4px 16px 16px 16px', display:'flex', gap:4 }}>
              {[0,.2,.4].map((_,i) => <div key={i} style={{ width:5, height:5, borderRadius:'50%', background:S.faint, animation:`typing 1.2s ${_}s infinite` }} />)}
            </div>
          )}
        </div>

        {/* Quick replies — guided flow buttons */}
        {qrs.length > 0 && !loading && (
          <div style={{ padding:'8px 10px 4px', display:'flex', gap:6, flexWrap:'wrap', flexShrink:0, borderTop:`1px solid ${S.border}`, background:'#fff' }}>
            {qrs.map((qr,i) => (
              <button key={i} onClick={() => { setStage('free'); send(qr); }}
                style={{
                  background: S.cream, border:`1.5px solid ${S.border}`,
                  borderRadius:20, padding:'7px 14px',
                  fontSize:12, fontWeight:600, color:S.dark,
                  cursor:'pointer', fontFamily:'inherit',
                  transition:'all .15s',
                  // First option always highlighted as recommended
                  ...(i===0 ? { background:S.yellow, borderColor:S.yellow } : {}),
                }}
                onMouseEnter={e=>{e.currentTarget.style.background=S.yellow;e.currentTarget.style.borderColor=S.yellow}}
                onMouseLeave={e=>{if(i!==0){e.currentTarget.style.background=S.cream;e.currentTarget.style.borderColor=S.border}}}>
                {qr}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding:'10px 12px', borderTop:`1px solid ${S.border}`, background:S.cream, flexShrink:0, paddingBottom:isMobile?'calc(10px + env(safe-area-inset-bottom,0px))':10 }}>
          <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
            <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey}
              placeholder={stage==='welcome'?'O escribe directamente lo que quieres...':'Escribe tu pedido o pregunta...'}
              rows={1} disabled={loading}
              style={{ flex:1, background:'#fff', border:`1.5px solid ${S.border}`, borderRadius:20, padding:'9px 14px', fontSize:13, fontFamily:'inherit', color:S.dark, resize:'none', maxHeight:80, lineHeight:1.4, transition:'border-color .2s' }}
              onFocus={e=>e.target.style.borderColor=S.dark}
              onBlur={e=>e.target.style.borderColor=S.border}
              onInput={e=>{e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,80)+'px'}} />
            <button onClick={()=>send()} disabled={loading||!input.trim()}
              style={{ width:38, height:38, background:input.trim()&&!loading?S.dark:S.surface, border:'none', borderRadius:'50%', cursor:input.trim()&&!loading?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .2s' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={input.trim()&&!loading?'#fff':S.faint} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ══ DESKTOP PILL — bottom-left, yellow ══ */}
      {!isMobile && (
        <button onClick={() => setOpen(o=>!o)} style={{
          position:'fixed', bottom:32, left:32, top:'auto',
          display:'flex', alignItems:'center', gap:9,
          background: open ? S.dark : S.yellow,
          border:`2px solid ${open?'rgba(255,255,255,.1)':'rgba(26,16,8,.15)'}`,
          borderRadius:24, padding:'9px 20px 9px 10px',
          cursor:'pointer', zIndex:1001, fontFamily:'inherit',
          minWidth:160, whiteSpace:'nowrap',
          boxShadow: open ? '0 4px 20px rgba(0,0,0,.25)' : '0 4px 20px rgba(245,200,66,.45)',
          transition:'all .2s',
        }}
          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=open?'0 6px 24px rgba(0,0,0,.3)':'0 8px 28px rgba(245,200,66,.6)'}}
          onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=open?'0 4px 20px rgba(0,0,0,.25)':'0 4px 20px rgba(245,200,66,.45)'}}>
          <div style={{ width:30, height:30, borderRadius:'50%', overflow:'hidden', border:`2px solid ${open?'rgba(245,200,66,.3)':'rgba(26,16,8,.2)'}`, flexShrink:0 }}>
            <img src="/logo.png" alt="OMG" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'} />
          </div>
          <span style={{ fontSize:13, fontWeight:700, color:open?S.yellow:S.dark, letterSpacing:'-.1px' }}>
            {open ? 'Cerrar chat' : '¿Qué pedimos?'}
          </span>
          {unread > 0 && !open && (
            <div style={{ width:17, height:17, background:S.dark, color:S.yellow, fontSize:9, fontWeight:800, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>{unread}</div>
          )}
        </button>
      )}

      {/* ══ MOBILE BAR — above tab bar ══ */}
      {isMobile && (
        <button onClick={() => setOpen(o=>!o)} style={{
          position:'fixed', bottom:TAB_H, left:0, right:0,
          background: open ? S.dark : S.yellow,
          border:'none', borderTop:`1px solid ${open?'rgba(255,255,255,.08)':'rgba(26,16,8,.12)'}`,
          padding:'11px 20px', display:'flex', alignItems:'center', justifyContent:'space-between',
          cursor:'pointer', zIndex:199, fontFamily:'inherit', transition:'background .2s',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', overflow:'hidden', border:`1.5px solid ${open?'rgba(245,200,66,.3)':'rgba(26,16,8,.2)'}`, flexShrink:0 }}>
              <img src="/logo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'} />
            </div>
            <span style={{ fontSize:14, fontWeight:700, color:open?S.yellow:S.dark }}>
              {open ? 'Cerrar chat' : '¿Qué pedimos hoy?'}
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {unread>0 && !open && (
              <div style={{ width:18, height:18, background:S.dark, color:S.yellow, fontSize:10, fontWeight:800, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>{unread}</div>
            )}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={open?S.yellow:S.dark} strokeWidth="2.5" strokeLinecap="round">
              <polyline points={open?'6 15 12 9 18 15':'6 9 12 15 18 9'}/>
            </svg>
          </div>
        </button>
      )}

      {/* Mobile backdrop */}
      {isMobile && open && (
        <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.35)', zIndex:997, backdropFilter:'blur(2px)' }} />
      )}

      <style>{`
        @keyframes msgIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        @keyframes typing{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
      `}</style>
    </>
  );
}
