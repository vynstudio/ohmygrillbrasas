import { useState, useEffect, useRef } from 'react';
import { db } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { deliveryZones } from '../data/menu';

// ─── Step indicator ────────────────────────────────────────────────────────────
function Steps({ current }) {
  const steps = ['Entrega', 'Contacto', 'Pago'];
  return (
    <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:32 }}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} style={{ display:'flex', alignItems:'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{
                width:28, height:28, borderRadius:'50%',
                background: done ? '#1a7a4a' : active ? '#ffd43a' : '#2A1A00',
                color: done || active ? '#fff' : '#C8860A',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:12, fontWeight:600, flexShrink:0, transition:'all 0.3s',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{ fontSize:13, fontWeight: active ? 500 : 400, color: active ? '#0F0800' : done ? '#1a7a4a' : '#C8860A', transition:'all 0.3s', whiteSpace:'nowrap' }}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex:1, height:1, background: done ? '#1a7a4a' : '#2A1A00', margin:'0 12px', transition:'background 0.3s' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Order summary sidebar ─────────────────────────────────────────────────────
function OrderSummary({ isMobile }) {
  const { items, subtotal, deliveryFee, total, deliveryType, deliveryZone, updateQty } = useCart();

  return (
    <div style={{ background:'#FFFFFF', border:'1px solid #E8E2D8', borderRadius:20, overflow:'hidden' }}>
      <div style={{ background:'#1A0F00', padding:'18px 22px' }}>
        <p style={{ fontFamily:"'Fraunces',serif", fontSize:17, fontWeight:600, color:'#FFF8DC', margin:0 }}>Resumen del pedido</p>
      </div>
      <div style={{ padding:'16px 22px' }}>
        {items.map(item => (
          <div key={item.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid #1A1000' }}>
            <div style={{ width:40, height:40, borderRadius:8, background:'linear-gradient(135deg,#2A1005,#7C2D0C)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
              {item.emoji}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:13, fontWeight:500, color:'#FFF8DC', margin:0 }}>{item.name}</p>
              <p style={{ fontSize:11, color:'#C8860A', margin:'2px 0 0' }}>€{(item.price % 1 === 0 ? item.price : item.price.toFixed(2))} / ud.</p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
              <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width:22, height:22, border:'1px solid #D4CFC9', background:'#1A1000', borderRadius:'50%', cursor:'pointer', fontSize:13, color:'#C8860A', display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
              <span style={{ fontSize:13, fontWeight:500, color:'#FFF8DC', minWidth:14, textAlign:'center' }}>{item.qty}</span>
              <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width:22, height:22, border:'none', background:'#0F0800', borderRadius:'50%', cursor:'pointer', fontSize:13, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
            </div>
            <span style={{ fontSize:14, fontWeight:600, color:'#FFF8DC', minWidth:44, textAlign:'right' }}>€{(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}

        <div style={{ paddingTop:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:13, color:'#C8860A' }}>Subtotal</span>
            <span style={{ fontSize:13, color:'#FFF8DC' }}>€{subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12, paddingBottom:12, borderBottom:'1px solid #F0EDE8' }}>
            <span style={{ fontSize:13, color:'#C8860A' }}>Envío {deliveryType === 'pickup' ? '(recogida)' : deliveryZone ? `· ${deliveryZone.name}` : ''}</span>
            <span style={{ fontSize:13, color: deliveryFee === 0 ? '#1a7a4a' : '#0F0800' }}>
              {deliveryFee === 0 ? 'Gratis' : `€${deliveryFee.toFixed(2)}`}
            </span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'#FFF8DC' }}>Total</span>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'#ffd43a' }}>€{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div style={{ borderTop:'1px solid #F0EDE8', padding:'12px 22px', background:'#0F0800' }}>
        {[{ icon:'🔒', text:'Pago seguro con Stripe' }, { icon:'🛵', text:'Entrega en 90 min · Zaragoza' }].map(i => (
          <div key={i.text} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <span style={{ fontSize:13 }}>{i.icon}</span>
            <span style={{ fontSize:12, color:'#C8860A' }}>{i.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 1: Delivery ──────────────────────────────────────────────────────────
function StepDelivery({ data, onChange, onNext }) {
  const { deliveryType, setDeliveryType, setDeliveryZone, deliveryZone, notes, setNotes } = useCart();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (deliveryType === 'delivery') {
      if (!deliveryZone) e.zone = 'Selecciona tu zona';
      if (!data.address?.trim()) e.address = 'Introduce tu dirección';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div>
      <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:600, color:'#1A0F00', margin:'0 0 20px' }}>¿Cómo quieres recibir tu pedido?</h2>

      {/* Delivery type toggle */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:24 }}>
        {[{ id:'delivery', icon:'🛵', title:'A domicilio', desc:'Entrega en tu dirección' }, { id:'pickup', icon:'🏪', title:'Recogida', desc:'Recoge en el local' }].map(opt => (
          <button key={opt.id} onClick={() => setDeliveryType(opt.id)} style={{ padding:'14px 16px', border:`2px solid ${deliveryType===opt.id ? '#ffd43a' : '#2A1A00'}`, borderRadius:14, background: deliveryType===opt.id ? '#1A0F00' : '#FFFFFF', cursor:'pointer', textAlign:'left', transition:'all 0.15s' }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{opt.icon}</div>
            <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight: deliveryType===opt.id ? 500 : 400, color: deliveryType===opt.id ? '#ffd43a' : '#0F0800', margin:'0 0 2px' }}>{opt.title}</p>
            <p style={{ fontSize:12, color:'#C8860A', margin:0 }}>{opt.desc}</p>
          </button>
        ))}
      </div>

      {deliveryType === 'delivery' && (
        <>
          {/* Zone selector */}
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:13, fontWeight:500, color:'#1A0F00', display:'block', marginBottom:6 }}>Zona de Zaragoza *</label>
            <select value={deliveryZone?.name || ''} onChange={e => { const z = deliveryZones.find(z => z.name === e.target.value); setDeliveryZone(z || null); }} style={{ width:'100%', padding:'11px 14px', border:`1.5px solid ${errors.zone ? '#E24B4A' : '#2A1A00'}`, borderRadius:12, fontFamily:"'Outfit',sans-serif", fontSize:14, color:'#FFF8DC', background:'#1A1000', cursor:'pointer' }}>
              <option value="">Selecciona tu zona...</option>
              {deliveryZones.map(z => <option key={z.name} value={z.name}>{z.name} — {z.eta} · €{z.deliveryFee}</option>)}
            </select>
            {errors.zone && <p style={{ fontSize:12, color:'#E24B4A', marginTop:4 }}>{errors.zone}</p>}
            {deliveryZone && <p style={{ fontSize:12, color:'#1a7a4a', marginTop:4 }}>✓ Entrega estimada: {deliveryZone.eta}</p>}
          </div>

          {/* Address */}
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:13, fontWeight:500, color:'#1A0F00', display:'block', marginBottom:6 }}>Dirección de entrega *</label>
            <input type="text" placeholder="Calle, número, piso..." value={data.address || ''} onChange={e => onChange('address', e.target.value)} style={{ width:'100%', padding:'11px 14px', border:`1.5px solid ${errors.address ? '#E24B4A' : '#2A1A00'}`, borderRadius:12, fontFamily:"'Outfit',sans-serif", fontSize:14, color:'#FFF8DC', boxSizing:'border-box', outline:'none' }} onFocus={e => e.target.style.borderColor='#ffd43a'} onBlur={e => e.target.style.borderColor= errors.address ? '#E24B4A' : '#2A1A00'} />
            {errors.address && <p style={{ fontSize:12, color:'#E24B4A', marginTop:4 }}>{errors.address}</p>}
          </div>
        </>
      )}

      {deliveryType === 'pickup' && (
        <div style={{ background:'#FEF3EE', border:'1px solid rgba(232,88,32,0.2)', borderRadius:12, padding:'14px 16px', marginBottom:16 }}>
          <p style={{ fontSize:13, fontWeight:500, color:'#ffd43a', margin:'0 0 4px' }}>📍 Dirección del local</p>
          <p style={{ fontSize:13, color:'#C8860A', margin:0 }}>Calle de las Brasas, 12 · 50001 Zaragoza</p>
          <p style={{ fontSize:12, color:'#C8860A', margin:'6px 0 0' }}>Listo en ~25 minutos desde la confirmación</p>
        </div>
      )}

      {/* Notes */}
      <div style={{ marginBottom:24 }}>
        <label style={{ fontSize:13, fontWeight:500, color:'#1A0F00', display:'block', marginBottom:6 }}>Notas del pedido <span style={{ color:'#C8860A', fontWeight:400 }}>(opcional)</span></label>
        <textarea placeholder="Punto de la carne, alergias, instrucciones especiales..." value={notes} onChange={e => setNotes(e.target.value)} rows={3} style={{ width:'100%', padding:'11px 14px', border:'1.5px solid #E8E2D8', borderRadius:12, fontFamily:"'Outfit',sans-serif", fontSize:14, color:'#1A0F00', resize:'vertical', boxSizing:'border-box', outline:'none' }} onFocus={e => e.target.style.borderColor='#ffd43a'} onBlur={e => e.target.style.borderColor='#2A1A00'} />
      </div>

      <button onClick={() => { if (validate()) onNext(); }} style={{ width:'100%', background:'#ffd43a', color:'#fff', border:'none', borderRadius:14, padding:'15px', fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:500, cursor:'pointer', transition:'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity='0.9'} onMouseLeave={e => e.currentTarget.style.opacity='1'}>
        Continuar → Datos de contacto
      </button>
    </div>
  );
}

// ─── Step 2: Contact ───────────────────────────────────────────────────────────
function StepContact({ data, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!data.name?.trim()) e.name = 'Introduce tu nombre';
    if (!data.phone?.trim()) e.phone = 'Introduce tu teléfono';
    else if (!/^[0-9+\s]{9,}$/.test(data.phone)) e.phone = 'Teléfono no válido';
    if (!data.email?.trim()) e.email = 'Introduce tu email';
    else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Email no válido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const fields = [
    { key:'name', label:'Nombre completo', placeholder:'Tu nombre', type:'text', required:true },
    { key:'phone', label:'Teléfono', placeholder:'+34 600 000 000', type:'tel', required:true },
    { key:'email', label:'Email', placeholder:'tu@email.com', type:'email', required:true },
  ];

  return (
    <div>
      <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:600, color:'#1A0F00', margin:'0 0 6px' }}>Datos de contacto</h2>
      <p style={{ fontSize:13, color:'#C8860A', margin:'0 0 24px' }}>Te enviaremos la confirmación por email y te avisaremos cuando salga tu pedido.</p>

      {fields.map(f => (
        <div key={f.key} style={{ marginBottom:16 }}>
          <label style={{ fontSize:13, fontWeight:500, color:'#1A0F00', display:'block', marginBottom:6 }}>
            {f.label} {f.required && <span style={{ color:'#ffd43a' }}>*</span>}
          </label>
          <input type={f.type} placeholder={f.placeholder} value={data[f.key] || ''} onChange={e => onChange(f.key, e.target.value)}
            style={{ width:'100%', padding:'11px 14px', border:`1.5px solid ${errors[f.key] ? '#E24B4A' : '#2A1A00'}`, borderRadius:12, fontFamily:"'Outfit',sans-serif", fontSize:14, color:'#FFF8DC', boxSizing:'border-box', outline:'none' }}
            onFocus={e => e.target.style.borderColor='#ffd43a'} onBlur={e => e.target.style.borderColor = errors[f.key] ? '#E24B4A' : '#2A1A00'} />
          {errors[f.key] && <p style={{ fontSize:12, color:'#E24B4A', marginTop:4 }}>{errors[f.key]}</p>}
        </div>
      ))}

      <div style={{ background:'#1A1000', borderRadius:12, padding:'12px 14px', marginBottom:24, display:'flex', gap:10, alignItems:'flex-start' }}>
        <span style={{ fontSize:16, flexShrink:0 }}>🔒</span>
        <p style={{ fontSize:12, color:'#C8860A', margin:0, lineHeight:1.5 }}>Tus datos solo se usan para gestionar el pedido. Nunca los compartimos con terceros.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:10 }}>
        <button onClick={onBack} style={{ background:'transparent', color:'#C8860A', border:'1.5px solid #2A1A00', borderRadius:14, padding:'14px', fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:500, cursor:'pointer' }}>
          ← Atrás
        </button>
        <button onClick={() => { if (validate()) onNext(); }} style={{ background:'#ffd43a', color:'#fff', border:'none', borderRadius:14, padding:'14px', fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:500, cursor:'pointer' }}>
          Continuar → Pago
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Payment (Stripe Elements) ────────────────────────────────────────
function StepPayment({ contactData, onBack, onSuccess }) {
  const { items, total, deliveryType, deliveryZone, notes, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cardReady, setCardReady] = useState(false);
  const cardElementRef = useRef(null);
  const stripeRef = useRef(null);
  const elementsRef = useRef(null);

  useEffect(() => {
    // Initialize Stripe Elements
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    if (!stripeKey) { setError('Error de configuración: clave Stripe no encontrada.'); return; }
    const stripe = window.Stripe(stripeKey);
    stripeRef.current = stripe;
    const elements = stripe.elements();
    elementsRef.current = elements;

    const card = elements.create('card', {
      style: {
        base: {
          fontFamily: "'Outfit', sans-serif",
          fontSize: '15px',
          color: '#0F0800',
          '::placeholder': { color: '#C8860A' },
          iconColor: '#ffd43a',
        },
        invalid: { color: '#E24B4A', iconColor: '#E24B4A' },
      },
      hidePostalCode: true,
    });

    card.mount(cardElementRef.current);
    card.on('ready', () => setCardReady(true));
    card.on('change', (e) => { if (e.error) setError(e.error.message); else setError(''); });

    return () => card.destroy();
  }, []);

  const handlePay = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: 'eur',
          items, contact: contactData, deliveryType, deliveryZone, notes,
        }),
      });
      if (!res.ok) { const { error } = await res.json(); throw new Error(error || 'Error del servidor'); }
      const { clientSecret, orderId } = await res.json();

      const cardElement = elementsRef.current.getElement('card');
      const { error: stripeError, paymentIntent } = await stripeRef.current.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: contactData.name, email: contactData.email, phone: contactData.phone },
        },
      });

      if (stripeError) throw new Error(stripeError.message);

      await db.insertOrder({
        id: orderId,
        customer_name: contactData.name,
        customer_email: contactData.email,
        customer_phone: contactData.phone,
        items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price, emoji: i.emoji })),
        total, delivery_type: deliveryType,
        delivery_zone: deliveryZone?.name || null,
        address: contactData.address || null,
        notes: notes || null, status: 'pending',
      }).catch(console.error);

      clearCart();
      onSuccess({ orderId, contact: contactData, total });
    } catch (err) {
      setError(err.message || 'Error al procesar el pago. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:600, color:'#1A0F00', margin:'0 0 6px' }}>Pago seguro</h2>
      <p style={{ fontSize:13, color:'#C8860A', margin:'0 0 24px' }}>Procesado por Stripe · Cifrado SSL · No almacenamos datos de tarjeta</p>

      {/* Accepted cards */}
      <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:20 }}>
        {['VISA', 'MC', 'AMEX'].map(c => (
          <div key={c} style={{ background:'#1A1000', border:'1px solid #2A1A00', borderRadius:6, padding:'4px 10px', fontSize:11, fontWeight:600, color:'#C8860A', letterSpacing:'0.5px' }}>{c}</div>
        ))}
        <span style={{ fontSize:12, color:'#C8860A' }}>+ Bizum próximamente</span>
      </div>

      {/* Stripe Elements card */}
      <div style={{ background:'#FAF6EF', border:'1px solid #E8E2D8', borderRadius:16, padding:'20px', marginBottom:20 }}>
        <label style={{ fontSize:13, fontWeight:500, color:'#1A0F00', display:'block', marginBottom:10 }}>Datos de tarjeta</label>
        <div ref={cardElementRef} style={{ background:'#FFFFFF', border:'1.5px solid #E8E2D8', borderRadius:12, padding:'13px 14px', minHeight:44 }} />
        {!cardReady && <p style={{ fontSize:12, color:'#C8860A', marginTop:6 }}>Cargando formulario seguro...</p>}
      </div>

      {/* Error message */}
      {error && (
        <div style={{ background:'#FCEBEB', border:'1px solid #F09595', borderRadius:10, padding:'12px 14px', marginBottom:16, display:'flex', gap:8, alignItems:'center' }}>
          <span style={{ fontSize:16 }}>⚠️</span>
          <p style={{ fontSize:13, color:'#A32D2D', margin:0 }}>{error}</p>
        </div>
      )}

      {/* Total + pay button */}
      <div style={{ background:'#1A0F00', borderRadius:14, padding:'16px 20px', marginBottom:12 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <p style={{ fontSize:12, color:'rgba(240,235,227,0.5)', margin:0 }}>Total a pagar</p>
            <p style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:600, color:'#FFF8DC', margin:'2px 0 0' }}>€{total.toFixed(2)}</p>
          </div>
          <button onClick={handlePay} disabled={loading} style={{ background: loading ? '#C8860A' : '#ffd43a', color:'#fff', border:'none', borderRadius:12, padding:'13px 24px', fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:500, cursor: loading ? 'not-allowed' : 'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', gap:8, minWidth:140, justifyContent:'center' }}>
            {loading ? (
              <>
                <span style={{ display:'inline-block', width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
                Procesando...
              </>
            ) : (
              <>🔒 Pagar €{total.toFixed(2)}</>
            )}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:10 }}>
        <button onClick={onBack} style={{ background:'transparent', color:'#C8860A', border:'1.5px solid #2A1A00', borderRadius:14, padding:'13px', fontFamily:"'Outfit',sans-serif", fontSize:14, cursor:'pointer' }}>
          ← Atrás
        </button>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <span style={{ fontSize:11 }}>🔒</span>
          <span style={{ fontSize:11, color:'#C8860A' }}>Cifrado SSL · Procesado por Stripe</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main CheckoutPage ─────────────────────────────────────────────────────────
export default function CheckoutPage({ onNavigate }) {
  const { items, itemCount } = useCart();
  const [step, setStep] = useState(0);
  const [deliveryData, setDeliveryData] = useState({});
  const [contactData, setContactData] = useState({});
  const [orderResult, setOrderResult] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // Empty cart guard
  if (itemCount === 0 && !orderResult) {
    return (
      <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, fontFamily:"'Outfit',sans-serif", padding:'40px 24px', textAlign:'center' }}>
        <div style={{ fontSize:52 }}>🛒</div>
        <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:26, fontWeight:600, color:'#FFF8DC', margin:0 }}>Tu carrito está vacío</h2>
        <p style={{ fontSize:14, color:'#C8860A' }}>Añade platos de la carta antes de pagar.</p>
        <button onClick={() => onNavigate('menu')} style={{ background:'#ffd43a', color:'#fff', border:'none', borderRadius:24, padding:'13px 28px', fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:500, cursor:'pointer' }}>
          Ver la carta →
        </button>
      </div>
    );
  }

  // Order success screen
  if (orderResult) {
    return (
      <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Outfit',sans-serif", padding:'40px 24px' }}>
        <div style={{ maxWidth:520, width:'100%', textAlign:'center' }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:'#EDFBF3', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:36 }}>✅</div>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:32, fontWeight:600, color:'#FFF8DC', margin:'0 0 10px' }}>¡Pedido confirmado!</h1>
          <p style={{ fontSize:14, color:'#C8860A', lineHeight:1.65, marginBottom:24 }}>
            Gracias, <strong>{orderResult.contact.name}</strong>. Hemos recibido tu pedido y lo estamos preparando.<br />
            Te enviaremos la confirmación a <strong>{orderResult.contact.email}</strong>.
          </p>

          <div style={{ background:'#1A1000', border:'1px solid #2A1A00', borderRadius:16, padding:'20px 24px', marginBottom:24, textAlign:'left' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12, paddingBottom:12, borderBottom:'1px solid #F0EDE8' }}>
              <span style={{ fontSize:13, color:'#C8860A' }}>Número de pedido</span>
              <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'#ffd43a' }}>{orderResult.orderId}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <span style={{ fontSize:13, color:'#C8860A' }}>Total pagado</span>
              <span style={{ fontSize:14, fontWeight:600, color:'#FFF8DC' }}>€{orderResult.total.toFixed(2)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:13, color:'#C8860A' }}>Tiempo estimado</span>
              <span style={{ fontSize:13, color:'#1a7a4a', fontWeight:500 }}>~25–45 minutos</span>
            </div>
          </div>

          <div style={{ background:'#FEF3EE', border:'1px solid rgba(232,88,32,0.2)', borderRadius:12, padding:'14px 16px', marginBottom:28, display:'flex', gap:10, alignItems:'center' }}>
            <span style={{ fontSize:20 }}>📱</span>
            <p style={{ fontSize:13, color:'#C8860A', margin:0, lineHeight:1.5 }}>
              ¿Tienes dudas? Escríbenos por WhatsApp: <strong style={{ color:'#ffd43a' }}>+34 600 000 000</strong>
            </p>
          </div>

          <button onClick={() => onNavigate('tracker')} style={{ width:'100%', background:'#ffd43a', color:'#fff', border:'none', borderRadius:14, padding:'15px', fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:500, cursor:'pointer', marginBottom:10 }}>
            🛵 Seguir mi pedido en tiempo real
          </button>
          <button onClick={() => onNavigate('home')} style={{ width:'100%', background:'transparent', color:'#C8860A', border:'none', padding:'12px', fontFamily:"'Outfit',sans-serif", fontSize:14, cursor:'pointer' }}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:"'Outfit',sans-serif", background:'#FAF6EF', minHeight:'100vh' }}>
      {/* Header */}
      <div style={{ background:'#0F0800', borderBottom:'1px solid #2A1A00', padding: isMobile ? '24px 20px 20px' : '32px 0 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding: isMobile ? '0' : '0 24px' }}>
          <button onClick={() => step === 0 ? onNavigate('menu') : setStep(s => s - 1)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:'#C8860A', fontFamily:"'Outfit',sans-serif", padding:'0 0 12px', display:'flex', alignItems:'center', gap:6 }}>
            ← {step === 0 ? 'Volver a la carta' : 'Paso anterior'}
          </button>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize: isMobile ? 26 : 34, fontWeight:600, color:'#1A0F00', margin:'0 0 20px' }}>Finalizar pedido</h1>
          <Steps current={step} />
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding: isMobile ? '24px 20px' : '32px 24px', display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 360px', gap:32, alignItems:'start' }}>

        {/* Left — step form */}
        <div style={{ background:'#FFFFFF', borderRadius:20, border:'1px solid #E8E2D8', padding: isMobile ? '24px 20px' : '32px' }}>
          {step === 0 && (
            <StepDelivery data={deliveryData} onChange={(k,v) => setDeliveryData(d => ({ ...d, [k]:v }))} onNext={() => setStep(1)} />
          )}
          {step === 1 && (
            <StepContact data={contactData} onChange={(k,v) => setContactData(d => ({ ...d, [k]:v }))} onNext={() => setStep(2)} onBack={() => setStep(0)} />
          )}
          {step === 2 && (
            <StepPayment contactData={contactData} onBack={() => setStep(1)} onSuccess={setOrderResult} />
          )}
        </div>

        {/* Right — order summary */}
        {!isMobile && <OrderSummary />}

        {/* Mobile order summary — collapsible */}
        {isMobile && (
          <details style={{ background:'#1A1000', borderRadius:16, border:'1px solid #2A1A00', overflow:'hidden' }}>
            <summary style={{ padding:'16px 20px', fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'#FFF8DC', cursor:'pointer', listStyle:'none', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              Ver resumen del pedido
              <span style={{ fontSize:12, color:'#ffd43a' }}>▼</span>
            </summary>
            <OrderSummary isMobile />
          </details>
        )}
      </div>
    </div>
  );
}
