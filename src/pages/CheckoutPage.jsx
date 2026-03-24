import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { deliveryZones } from '../data/menu';
import PhotoPlaceholder from '../components/PhotoPlaceholder';

const S = {
  cream:'#FAF6EF', dark:'#1a1008', yellow:'#F5C842',
  border:'rgba(26,16,8,.1)', sub:'rgba(26,16,8,.5)',
  faint:'rgba(26,16,8,.3)', surface:'#F2EDE4', error:'#c0392b',
};

// ── Step indicator ────────────────────────────────────────────────────────────
function Steps({ current }) {
  return (
    <div style={{ display:'flex', alignItems:'center', marginBottom:32 }}>
      {['Entrega','Contacto','Pago'].map((s,i) => {
        const done=i<current, active=i===current;
        return (
          <div key={s} style={{ display:'flex', alignItems:'center', flex:i<2?1:'none' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:done?S.dark:active?S.yellow:S.surface, color:done?S.yellow:active?S.dark:S.faint, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0, transition:'all .3s' }}>
                {done?'✓':i+1}
              </div>
              <span style={{ fontSize:13, fontWeight:active?600:400, color:active?S.dark:done?S.sub:S.faint, whiteSpace:'nowrap', transition:'all .3s' }}>{s}</span>
            </div>
            {i<2 && <div style={{ flex:1, height:1, background:done?S.dark:S.border, margin:'0 12px', transition:'background .3s' }} />}
          </div>
        );
      })}
    </div>
  );
}

// ── Order summary ─────────────────────────────────────────────────────────────
function OrderSummary() {
  const { items, subtotal, deliveryFee, total, deliveryType, deliveryZone, updateQty } = useCart();
  return (
    <div style={{ background:'#fff', border:`1px solid ${S.border}`, borderRadius:16, overflow:'hidden' }}>
      <div style={{ padding:'18px 22px', borderBottom:`1px solid ${S.border}` }}>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:17, fontWeight:600, color:S.dark }}>Resumen del pedido</div>
      </div>
      <div style={{ padding:'12px 22px' }}>
        {items.map(item => (
          <div key={item.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:`1px solid ${S.border}` }}>
            <div style={{ position:'relative', flexShrink:0 }}>
              <PhotoPlaceholder height={40} width={40} borderRadius={8} />
              <span style={{ position:'absolute', top:-4, right:-4, width:15, height:15, background:S.yellow, color:S.dark, fontSize:9, fontWeight:700, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>{item.qty}</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:S.dark, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
              <div style={{ fontSize:11, color:S.sub, marginTop:1 }}>€{item.price%1===0?item.price:item.price.toFixed(2)} / ud.</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <button onClick={() => updateQty(item.id,item.qty-1)} style={{ width:22, height:22, border:`1px solid ${S.border}`, background:S.surface, borderRadius:'50%', cursor:'pointer', fontSize:13, color:S.sub, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'inherit' }}>−</button>
              <span style={{ fontSize:13, fontWeight:600, color:S.dark, minWidth:14, textAlign:'center' }}>{item.qty}</span>
              <button onClick={() => updateQty(item.id,item.qty+1)} style={{ width:22, height:22, border:'none', background:S.dark, borderRadius:'50%', cursor:'pointer', fontSize:13, color:S.yellow, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'inherit' }}>+</button>
            </div>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:S.dark, minWidth:44, textAlign:'right' }}>€{(item.price*item.qty).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ paddingTop:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:13, color:S.sub }}>
            <span>Subtotal</span><span style={{ fontWeight:600, color:S.dark }}>€{subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12, paddingBottom:12, borderBottom:`1px solid ${S.border}`, fontSize:13, color:S.sub }}>
            <span>Envío {deliveryType==='pickup'?'(recogida)':deliveryZone?`· ${deliveryZone.name}`:''}</span>
            <span style={{ fontWeight:600, color:deliveryFee===0?'#27ae60':S.dark }}>{deliveryType==='pickup'?'Gratis (recogida)':deliveryFee===0?'Gratis':deliveryZone?`€${deliveryFee.toFixed(2)}`:'—'}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:S.dark }}>Total</span>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:S.dark }}>€{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div style={{ borderTop:`1px solid ${S.border}`, padding:'12px 22px', background:S.surface }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:S.sub, marginBottom:6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(26,16,8,.4)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Pago seguro con Stripe
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:S.sub }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(26,16,8,.4)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Entrega en 90 min · Zaragoza
        </div>
      </div>
    </div>
  );
}

// ── Shared form primitives ────────────────────────────────────────────────────
const Lbl = ({ children }) => (
  <label style={{ fontSize:11, fontWeight:700, letterSpacing:'.8px', textTransform:'uppercase', color:S.sub, display:'block', marginBottom:7 }}>{children}</label>
);
const Inp = ({ hasError, ...props }) => (
  <input style={{ width:'100%', padding:'13px 16px', border:`1.5px solid ${hasError?S.error:S.border}`, borderRadius:10, background:S.cream, fontSize:14, color:S.dark, boxSizing:'border-box', WebkitAppearance:'none', fontFamily:'inherit' }}
    onFocus={e => e.target.style.borderColor = S.dark}
    onBlur={e => e.target.style.borderColor = hasError ? S.error : S.border}
    {...props} />
);
const Err = ({ msg }) => msg ? <p style={{ fontSize:12, color:S.error, marginTop:4 }}>{msg}</p> : null;

// ── Step 1: Delivery ──────────────────────────────────────────────────────────
function StepDelivery({ data, onChange, onNext }) {
  const { deliveryType, setDeliveryType, setDeliveryZone, deliveryZone, notes, setNotes, subtotal } = useCart();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (deliveryType === 'delivery') {
      if (!deliveryZone) e.zone = 'Selecciona tu zona';
      if (!data.address?.trim()) e.address = 'Introduce tu dirección';
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  return (
    <div>
      <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:400, color:S.dark, marginBottom:6, letterSpacing:'-.5px' }}>¿Cómo recibes el pedido?</h2>
      <p style={{ fontSize:14, color:S.sub, marginBottom:24, lineHeight:1.6 }}>Entrega a domicilio o recogida en el local.</p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
        {[
          { id:'delivery', title:'A domicilio', desc:'90 min · Zaragoza', icon:<svg width="17" height="13" viewBox="0 0 24 18" fill="none" stroke={S.dark} strokeWidth="2" strokeLinecap="round"><rect x="1" y="2" width="15" height="11"/><polygon points="16 7 20 7 23 10 23 15 16 15 16 7"/><circle cx="5.5" cy="16.5" r="2"/><circle cx="18.5" cy="16.5" r="2"/></svg> },
          { id:'pickup',   title:'Recogida',   desc:'~25 min · Gratis', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={S.dark} strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
        ].map(opt => (
          <button key={opt.id} onClick={() => setDeliveryType(opt.id)} style={{ padding:'16px', border:`1.5px solid ${deliveryType===opt.id?S.dark:S.border}`, borderRadius:12, background:deliveryType===opt.id?'#fff':S.cream, cursor:'pointer', textAlign:'left', transition:'all .2s', boxShadow:deliveryType===opt.id?`0 0 0 1px ${S.dark}`:'none', fontFamily:'inherit' }}>
            <div style={{ width:36, height:36, background:deliveryType===opt.id?S.yellow:S.surface, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10, transition:'background .2s' }}>{opt.icon}</div>
            <div style={{ fontSize:14, fontWeight:700, color:S.dark, marginBottom:2 }}>{opt.title}</div>
            <div style={{ fontSize:12, color:S.sub }}>{opt.desc}</div>
          </button>
        ))}
      </div>

      {deliveryType === 'delivery' && (
        <>
          <div style={{ marginBottom:16 }}>
            <Lbl>Zona de Zaragoza <span style={{ color:S.error }}>*</span></Lbl>
            <select value={deliveryZone?.name||''} onChange={e => setDeliveryZone(deliveryZones.find(z=>z.name===e.target.value)||null)}
              style={{ width:'100%', padding:'13px 16px', border:`1.5px solid ${errors.zone?S.error:S.border}`, borderRadius:10, background:S.surface, fontSize:14, color:S.dark, cursor:'pointer', WebkitAppearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231a1008' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 14px center', paddingRight:36 }}>
              <option value="">Selecciona tu zona...</option>
              {deliveryZones.map(z => <option key={z.name} value={z.name}>{z.name} — {z.eta} · €{z.deliveryFee}</option>)}
            </select>
            <Err msg={errors.zone} />
            {deliveryZone && (
              <p style={{ fontSize:12, color:'#27ae60', marginTop:4, display:'flex', alignItems:'center', gap:4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Entrega estimada: <strong>{deliveryZone.eta}</strong>
                {subtotal >= 35 && <span style={{ marginLeft:6, background:'#27ae60', color:'#fff', fontSize:10, fontWeight:700, padding:'1px 7px', borderRadius:10 }}>Envío gratis</span>}
              </p>
            )}
          </div>
          <div style={{ marginBottom:16 }}>
            <Lbl>Dirección <span style={{ color:S.error }}>*</span></Lbl>
            <Inp type="text" placeholder="Calle, número, piso..." value={data.address||''} onChange={e=>onChange('address',e.target.value)} hasError={!!errors.address} />
            <Err msg={errors.address} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
            <div><Lbl>Código postal</Lbl><Inp type="text" placeholder="500XX" maxLength={5} value={data.postal||''} onChange={e=>onChange('postal',e.target.value)} /></div>
            <div><Lbl>Piso / Puerta</Lbl><Inp type="text" placeholder="Opcional" value={data.floor||''} onChange={e=>onChange('floor',e.target.value)} /></div>
          </div>
        </>
      )}

      {deliveryType === 'pickup' && (
        <div style={{ background:S.yellow, borderRadius:12, padding:'14px 16px', marginBottom:16 }}>
          <div style={{ fontSize:13, fontWeight:700, color:S.dark, marginBottom:4 }}>Dirección del local</div>
          <div style={{ fontSize:13, color:'rgba(26,16,8,.65)', lineHeight:1.7 }}>Calle de las Brasas, 12 · 50001 Zaragoza<br/>Listo en ~25 minutos desde la confirmación.</div>
        </div>
      )}

      <div style={{ marginBottom:24 }}>
        <Lbl>Notas <span style={{ color:S.faint, fontWeight:400, textTransform:'none', letterSpacing:0 }}>(opcional)</span></Lbl>
        <textarea placeholder="Punto de la carne, alergias, instrucciones especiales..." value={notes} onChange={e=>setNotes(e.target.value)} rows={3}
          style={{ width:'100%', padding:'13px 16px', border:`1.5px solid ${S.border}`, borderRadius:10, background:S.surface, fontSize:14, color:S.dark, resize:'vertical', boxSizing:'border-box', fontFamily:'inherit' }} />
      </div>

      <button onClick={() => { if (validate()) onNext(); }}
        style={{ width:'100%', background:S.yellow, color:S.dark, border:'none', borderRadius:12, padding:15, fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
        Continuar · Datos de contacto →
      </button>
    </div>
  );
}

// ── Step 2: Contact ───────────────────────────────────────────────────────────
function StepContact({ data, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const validate = () => {
    const e = {};
    if (!data.name?.trim()) e.name = 'Introduce tu nombre';
    if (!data.phone?.trim() || data.phone.trim().length < 9) e.phone = 'Teléfono no válido';
    if (!data.email?.includes('@')) e.email = 'Email no válido';
    setErrors(e);
    return !Object.keys(e).length;
  };
  return (
    <div>
      <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:400, color:S.dark, marginBottom:6, letterSpacing:'-.5px' }}>Datos de contacto</h2>
      <p style={{ fontSize:14, color:S.sub, marginBottom:24, lineHeight:1.6 }}>Para enviarte la confirmación y avisarte cuando salga tu pedido.</p>
      {[
        { key:'name',  lbl:'Nombre completo', ph:'Tu nombre y apellidos', type:'text' },
        { key:'phone', lbl:'Teléfono',         ph:'+34 600 000 000',       type:'tel' },
        { key:'email', lbl:'Email',             ph:'tu@email.com',          type:'email' },
      ].map(f => (
        <div key={f.key} style={{ marginBottom:16 }}>
          <Lbl>{f.lbl} <span style={{ color:S.error }}>*</span></Lbl>
          <Inp type={f.type} placeholder={f.ph} value={data[f.key]||''} onChange={e=>onChange(f.key,e.target.value)} hasError={!!errors[f.key]} />
          <Err msg={errors[f.key]} />
        </div>
      ))}
      <label style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer', marginBottom:24 }}>
        <input type="checkbox" style={{ marginTop:3, accentColor:S.dark, width:17, height:17, flexShrink:0 }} />
        <span style={{ fontSize:13, color:S.sub, lineHeight:1.55 }}>Quiero recibir ofertas de OhMyGrill Brasas. Me puedo dar de baja en cualquier momento.</span>
      </label>
      <div style={{ display:'flex', gap:12 }}>
        <button onClick={onBack} style={{ background:'transparent', color:S.sub, border:`1.5px solid ${S.border}`, borderRadius:12, padding:'14px 24px', fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>← Volver</button>
        <button onClick={() => { if (validate()) onNext(); }} style={{ flex:1, background:S.yellow, color:S.dark, border:'none', borderRadius:12, padding:14, fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Continuar · Pago →</button>
      </div>
    </div>
  );
}

// ── Step 3: Payment — real Stripe Elements ───────────────────────────────────
function StepPayment({ onBack, onSubmit, total, loading, stripeError }) {
  return (
    <div>
      <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:400, color:S.dark, marginBottom:6, letterSpacing:'-.5px' }}>Pago</h2>
      <p style={{ fontSize:14, color:S.sub, marginBottom:20, lineHeight:1.6 }}>Elige tu método de pago. Procesado por Stripe — 100% seguro.</p>

      {/* Stripe PaymentElement mounts here — shows Bizum, Apple Pay, Google Pay, card */}
      <div id="stripe-payment-element" style={{ marginBottom:20 }} />

      {stripeError && (
        <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'10px 14px', marginBottom:16, fontSize:13, color:S.error }}>
          {stripeError}
        </div>
      )}

      <div style={{ background:S.surface, borderRadius:12, padding:'12px 16px', marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:13, color:S.sub }}>Total a pagar</span>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:600, color:S.dark }}>€{total.toFixed(2)}</span>
      </div>

      <div style={{ display:'flex', gap:12 }}>
        <button onClick={onBack} disabled={loading} style={{ background:'transparent', color:S.sub, border:`1.5px solid ${S.border}`, borderRadius:12, padding:'14px 24px', fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>← Volver</button>
        <button onClick={onSubmit} disabled={loading}
          style={{ flex:1, background:loading?'rgba(26,16,8,.4)':S.dark, color:S.yellow, border:'none', borderRadius:12, padding:14, fontSize:15, fontWeight:600, cursor:loading?'not-allowed':'pointer', fontFamily:'inherit', transition:'background .2s' }}>
          {loading ? (
            <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={S.yellow} strokeWidth="2" strokeLinecap="round" style={{ animation:'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              Procesando...
            </span>
          ) : `Confirmar y pagar · €${total.toFixed(2)} →`}
        </button>
      </div>
      <p style={{ fontSize:11, color:S.faint, textAlign:'center', marginTop:12 }}>
        Apple Pay · Google Pay · Tarjeta · Link · Procesado por Stripe
      </p>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── Main CheckoutPage ─────────────────────────────────────────────────────────
export default function CheckoutPage({ onNavigate }) {
  const { items, itemCount, subtotal, total, deliveryType, deliveryZone, notes, clearCart } = useCart();
  const [step, setStep]         = useState(0);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [orderId, setOrderId]   = useState('');
  const [stripeError, setStripeError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [formData, setFormData] = useState({ address:'', postal:'', floor:'', name:'', phone:'', email:'' });
  const stripeRef   = useRef(null); // Stripe instance
  const elementsRef = useRef(null); // Stripe Elements instance
  const cardRef     = useRef(null); // Card Element

  const onChange = (key, val) => setFormData(p => ({ ...p, [key]: val }));

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // Mount Stripe PaymentElement when we reach step 2
  useEffect(() => {
    if (step !== 2) return;
    if (!window.Stripe) { setStripeError('Stripe no cargado. Recarga la página.'); return; }

    const pk = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    if (!pk) { setStripeError('Clave Stripe no configurada.'); return; }

    const stripe = window.Stripe(pk);
    stripeRef.current = stripe;

    // Create a setup PaymentIntent first to get clientSecret for PaymentElement
    fetch('/.netlify/functions/create-setup-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Math.round(total * 100), currency: 'eur' }),
    })
    .then(r => r.json())
    .then(data => {
      if (data.error) { setStripeError(data.error); return; }

      const elements = stripe.elements({
        clientSecret: data.clientSecret,
        locale: 'es',
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#1a1008',
            colorBackground: '#ffffff',
            colorText: '#1a1008',
            colorDanger: '#c0392b',
            fontFamily: 'Outfit, sans-serif',
            borderRadius: '10px',
            spacingUnit: '4px',
            fontSizeBase: '14px',
          },
          rules: {
            '.Input': { border: '1.5px solid rgba(26,16,8,.12)', padding: '12px 14px', boxShadow: 'none' },
            '.Input:focus': { border: '1.5px solid #1a1008', boxShadow: 'none' },
            '.Tab': { border: '1.5px solid rgba(26,16,8,.12)', borderRadius: '10px', boxShadow: 'none' },
            '.Tab--selected': { border: '1.5px solid #1a1008', boxShadow: '0 0 0 1px #1a1008' },
            '.Tab--selected .TabIcon': { color: '#1a1008' },
            '.Tab--selected .TabLabel': { color: '#1a1008', fontWeight: '600' },
            '.Tab:hover': { border: '1.5px solid rgba(26,16,8,.3)', boxShadow: 'none' },
            '.Block': { border: '1.5px solid rgba(26,16,8,.12)', borderRadius: '10px', boxShadow: 'none' },
          },
        },
      });
      elementsRef.current = elements;

      const paymentEl = elements.create('payment', {
        layout: {
          type: 'tabs',
          defaultCollapsed: false,
          radios: false,
          spacedAccordionItems: false,
        },
        defaultValues: {
          billingDetails: { address: { country: 'ES' } }
        },
        wallets: { applePay: 'auto', googlePay: 'auto' },
        fields: { billingDetails: { address: { country: 'never' } } },
      });
      paymentEl.mount('#stripe-payment-element');
      cardRef.current = paymentEl;

      paymentEl.on('change', e => {
        setStripeError(e.error ? e.error.message : '');
      });
    })
    .catch(err => setStripeError('Error al cargar el pago. Recarga la página.'));

    return () => { try { if(cardRef.current) cardRef.current.unmount(); } catch(e) {} };
  }, [step, total]);

  // ── Submit payment ──────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true);
    setStripeError('');

    try {
      // 1. Create PaymentIntent on server
      const res = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items, deliveryType, deliveryZone, notes,
          contact: { name: formData.name, phone: formData.phone, email: formData.email },
          address: formData,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setStripeError(data.error || 'Error al crear el pedido. Inténtalo de nuevo.');
        setLoading(false);
        return;
      }

      // 2. Confirm the real PaymentIntent using its clientSecret
      // We pass clientSecret directly so Stripe uses the correct PI (not the setup one)
      const { error: confirmError } = await stripeRef.current.confirmPayment({
        elements: elementsRef.current,
        clientSecret: data.clientSecret,
        confirmParams: {
          return_url: window.location.origin + '/#checkout-success',
          payment_method_data: {
            billing_details: {
              name:  formData.name,
              email: formData.email,
              phone: formData.phone,
            },
          },
          receipt_email: formData.email,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setStripeError(confirmError.message);
        setLoading(false);
        return;
      }

      // 3. Success
      setOrderId(data.orderId);
      setSuccess(true);
      clearCart();

    } catch (e) {
      console.error('Payment error:', e);
      setStripeError('Error de conexión. Comprueba tu red e inténtalo de nuevo.');
    }

    setLoading(false);
  };

  // ── Empty cart guard ────────────────────────────────────────────────────────
  if (itemCount === 0 && !success) return (
    <div style={{ background:S.cream, minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, textAlign:'center' }}>
      <div style={{ fontFamily:"'Fraunces',serif", fontSize:28, fontWeight:400, color:S.dark, marginBottom:8 }}>Tu carrito está vacío</div>
      <div style={{ fontSize:15, color:S.sub, marginBottom:28 }}>Añade platos antes de proceder al pago.</div>
      <button onClick={() => onNavigate('menu')} style={{ background:S.yellow, color:S.dark, border:'none', borderRadius:12, padding:'14px 32px', fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Ver la carta →</button>
    </div>
  );

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) return (
    <div style={{ background:S.cream, minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
      <div style={{ maxWidth:480, width:'100%', textAlign:'center' }}>
        <div style={{ width:72, height:72, background:S.yellow, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={S.dark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:34, fontWeight:400, color:S.dark, letterSpacing:'-.8px', marginBottom:10 }}>¡Pedido confirmado!</h1>
        <p style={{ fontSize:15, color:S.sub, lineHeight:1.75, marginBottom:28 }}>Recibirás la confirmación por email y un SMS cuando salga tu pedido.</p>
        <div style={{ background:S.surface, borderRadius:14, padding:'18px 20px', textAlign:'left', marginBottom:28 }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:S.faint, marginBottom:6 }}>Número de pedido</div>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:600, color:S.dark }}>#{orderId}</div>
          <div style={{ fontSize:13, color:S.sub, marginTop:8 }}>Tiempo estimado: <strong style={{ color:S.dark }}>40–55 minutos</strong></div>
        </div>
        <button onClick={() => onNavigate('home')} style={{ width:'100%', background:S.yellow, color:S.dark, border:'none', borderRadius:12, padding:15, fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Volver al inicio</button>
      </div>
    </div>
  );

  // ── Checkout flow ───────────────────────────────────────────────────────────
  return (
    <div style={{ background:S.cream, minHeight:'100vh' }}>
      {/* Header */}
      <div style={{ background:S.cream, borderBottom:`1px solid ${S.border}`, height:56, display:'flex', alignItems:'center', justifyContent:'space-between', padding:`0 ${isMobile?20:56}px` }}>
        <button onClick={() => step>0 ? setStep(step-1) : onNavigate('menu')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', fontSize:13, fontWeight:500, color:S.sub, fontFamily:'inherit' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          {step > 0 ? 'Volver' : 'Volver a la carta'}
        </button>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:S.dark }}>Finalizar pedido</div>
        <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:S.faint }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(26,16,8,.3)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Pago seguro
        </div>
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:isMobile?'24px 20px':'48px 56px', display:isMobile?'block':'grid', gridTemplateColumns:'1fr 360px', gap:52, alignItems:'start' }}>
        <div>
          <Steps current={step} />
          <div style={{ background:'#fff', border:`1px solid ${S.border}`, borderRadius:16, padding:isMobile?24:36 }}>
            {step===0 && <StepDelivery data={formData} onChange={onChange} onNext={() => setStep(1)} />}
            {step===1 && <StepContact  data={formData} onChange={onChange} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
            {step===2 && <StepPayment  onBack={() => setStep(1)} onSubmit={handleSubmit} total={total} loading={loading} stripeError={stripeError} />}
          </div>
        </div>
        {!isMobile && (
          <div style={{ position:'sticky', top:24 }}>
            <OrderSummary />
          </div>
        )}
      </div>
    </div>
  );
}
