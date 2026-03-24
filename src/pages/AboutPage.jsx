import { useState, useEffect } from 'react';

export default function AboutPage({ onNavigate }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formState, setFormState] = useState('idle'); // idle | sending | sent | error
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Introduce tu nombre';
    if (!formData.email.trim()) e.email = 'Introduce tu email';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Email no válido';
    if (!formData.message.trim()) e.message = 'Escribe tu mensaje';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setFormState('sending');
    // Simulate send — wire to Netlify Forms or Resend later
    await new Promise(r => setTimeout(r, 1500));
    setFormState('sent');
  };

  const inputStyle = (hasError) => ({
    width: '100%', padding: '12px 14px',
    border: `1.5px solid ${hasError ? '#E24B4A' : '#EDE9E3'}`,
    borderRadius: 12, fontFamily: "'Outfit', sans-serif",
    fontSize: 14, color: '#1C1A14', background: '#fff',
    boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.15s',
  });

  const team = [
    { name: 'María García', role: 'Fundadora & Chef', years: '+12 años en brasas', emoji: '👩‍🍳' },
    { name: 'Carlos Ruiz', role: 'Maestro de la brasa', years: '+8 años de oficio', emoji: '🔥' },
    { name: 'Ana López', role: 'Atención al cliente', years: 'El alma del local', emoji: '😊' },
  ];

  const values = [
    { icon: '🔥', title: 'Leña de encina', desc: 'Solo usamos leña de encina aragonesa. Le da a la carne ese aroma inconfundible que no consigue ningún otro combustible.' },
    { icon: '🥩', title: 'Producto local', desc: 'Trabajamos con ganaderos de Aragón y La Rioja. Carne madurada en nuestra propia cámara, nunca congelada.' },
    { icon: '⏰', title: '+10 años en Zaragoza', desc: 'Desde 2013 sirviendo brasas en Zaragoza. Hemos crecido gracias a los clientes que repiten, no a la publicidad.' },
    { icon: '📦', title: 'Ahora online', desc: 'Pedidos a domicilio para toda Zaragoza. La misma calidad del local, en tu mesa en menos de 90 minutos.' },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#FAFAF5', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ background: '#1C1A14', padding: isMobile ? '56px 20px 48px' : '80px 0 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -40, right: -20, fontFamily: "'Fraunces', serif", fontSize: 200, fontWeight: 900, color: 'rgba(255,255,255,0.025)', lineHeight: 1, userSelect: 'none' }}>OMG</div>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0' : '0 24px', position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-block', background: 'rgba(232,88,32,0.2)', border: '1px solid rgba(232,88,32,0.3)', color: '#E4AC21', fontSize: 11, letterSpacing: '2px', fontWeight: 600, padding: '5px 14px', borderRadius: 20, marginBottom: 20, textTransform: 'uppercase' }}>
            Nuestra historia
          </span>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? 38 : 58, fontWeight: 600, color: '#F0EBE3', margin: '0 0 20px', lineHeight: 1.0, letterSpacing: '-1px' }}>
            Más de diez años<br />
            <em style={{ color: '#E4AC21', fontStyle: 'italic' }}>demostrando que un buen<br />pollo necesita pocas cosas.</em>
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 17, color: 'rgba(240,235,227,0.55)', lineHeight: 1.75, maxWidth: 580, margin: 0 }}>
            Producto aragonés de calidad, marinado honesto y paciencia sobre el carbón. Eso es OhMyGrill Brasas.
          </p>
        </div>
      </section>

      {/* ── STORY ── */}
      <section style={{ background: '#fff', padding: isMobile ? '48px 20px' : '72px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0' : '0 24px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 64, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? 28 : 38, fontWeight: 600, color: '#1C1A14', margin: '0 0 20px', lineHeight: 1.1 }}>
              Empezamos con<br />una brasa y una idea.
            </h2>
            <p style={{ fontSize: 15, color: '#7A6E63', lineHeight: 1.8, margin: '0 0 16px' }}>
              En 2013, María García abrió un pequeño local en el centro de Zaragoza con una sola obsesión: hacer la brasa como debe hacerse. Sin atajos, sin gas, sin congelados.
            </p>
            <p style={{ fontSize: 15, color: '#7A6E63', lineHeight: 1.8, margin: '0 0 16px' }}>
              Lo que empezó como un restaurante de barrio se convirtió en una referencia en la ciudad. Los clientes volvían. Y traían a sus familias. Y a sus amigos.
            </p>
            <p style={{ fontSize: 15, color: '#7A6E63', lineHeight: 1.8, margin: 0 }}>
              Hoy, más de diez años después, seguimos usando la misma leña de encina, los mismos ganaderos de Aragón y la misma receta de siempre. Solo añadimos la posibilidad de pedirlo desde casa.
            </p>
          </div>
          {/* Visual stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { num: '2013', label: 'Año de apertura', sub: 'Zaragoza, España' },
              { num: '+10', label: 'Años de oficio', sub: 'Siempre en la misma brasa' },
              { num: '100%', label: 'Leña de encina', sub: 'Nunca gas, nunca carbón' },
              { num: '4.9★', label: 'Google Maps', sub: 'Más de 200 reseñas' },
            ].map(s => (
              <div key={s.label} style={{ background: '#FAFAF5', border: '1px solid #EDE9E3', borderRadius: 16, padding: '22px 18px' }}>
                <p style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 600, color: '#E4AC21', margin: '0 0 4px', lineHeight: 1 }}>{s.num}</p>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#1C1A14', margin: '0 0 3px' }}>{s.label}</p>
                <p style={{ fontSize: 11, color: '#9A8F85', margin: 0 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ background: '#FAFAF5', padding: isMobile ? '48px 20px' : '72px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0' : '0 24px' }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? 26 : 34, fontWeight: 600, color: '#1C1A14', margin: '0 0 8px', textAlign: 'center' }}>Lo que nos define</h2>
          <p style={{ fontSize: 14, color: '#9A8F85', textAlign: 'center', margin: '0 0 36px' }}>Por qué nuestros clientes llevan más de diez años volviendo</p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: 16 }}>
            {values.map(v => (
              <div key={v.title} style={{ background: '#fff', border: '1px solid #EDE9E3', borderRadius: 18, padding: '24px 20px' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FEF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{v.icon}</div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, color: '#1C1A14', margin: '0 0 8px' }}>{v.title}</h3>
                <p style={{ fontSize: 13, color: '#7A6E63', lineHeight: 1.65, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ background: '#fff', padding: isMobile ? '48px 20px' : '72px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0' : '0 24px' }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? 26 : 34, fontWeight: 600, color: '#1C1A14', margin: '0 0 8px', textAlign: 'center' }}>El equipo</h2>
          <p style={{ fontSize: 14, color: '#9A8F85', textAlign: 'center', margin: '0 0 36px' }}>Las personas detrás de cada brasa</p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 20 }}>
            {team.map(member => (
              <div key={member.name} style={{ background: '#FAFAF5', border: '1px solid #EDE9E3', borderRadius: 20, padding: '28px 24px', textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#1C1A14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 16px' }}>{member.emoji}</div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 600, color: '#1C1A14', margin: '0 0 4px' }}>{member.name}</h3>
                <p style={{ fontSize: 13, color: '#E4AC21', fontWeight: 500, margin: '0 0 6px' }}>{member.role}</p>
                <p style={{ fontSize: 12, color: '#9A8F85', margin: 0 }}>{member.years}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ background: '#FAFAF5', padding: isMobile ? '48px 20px' : '72px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0' : '0 24px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 64 }}>

          {/* Left — info */}
          <div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? 28 : 38, fontWeight: 600, color: '#1C1A14', margin: '0 0 12px', lineHeight: 1.1 }}>
              Hablemos
            </h2>
            <p style={{ fontSize: 15, color: '#7A6E63', lineHeight: 1.75, margin: '0 0 36px' }}>
              ¿Tienes una pregunta sobre un pedido, una alergia o quieres hacer un pedido grande para un evento? Escríbenos.
            </p>

            {/* Contact cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: '📍', label: 'Dirección', value: 'Calle de las Brasas, 12', sub: '50001 Zaragoza, España' },
                { icon: '📞', label: 'Teléfono', value: '+34 976 000 000', sub: 'Lun–Dom 13:00–22:00' },
                { icon: '💬', label: 'WhatsApp', value: '+34 600 000 000', sub: 'Respuesta en menos de 1 hora' },
                { icon: '📸', label: 'Instagram', value: '@ohmygrillbrasas', sub: 'Síguenos para novedades' },
              ].map(item => (
                <div key={item.label} style={{ background: '#fff', border: '1px solid #EDE9E3', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FEF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <p style={{ fontSize: 11, color: '#9A8F85', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px' }}>{item.label}</p>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#1C1A14', margin: '0 0 2px' }}>{item.value}</p>
                    <p style={{ fontSize: 12, color: '#9A8F85', margin: 0 }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Hours */}
            <div style={{ background: '#1C1A14', borderRadius: 16, padding: '22px 20px', marginTop: 20 }}>
              <p style={{ fontSize: 11, letterSpacing: '2px', color: '#E4AC21', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 14px' }}>Horario de pedidos</p>
              {[
                { day: 'Lunes – Jueves', hours: '13:00 – 22:00' },
                { day: 'Viernes – Sábado', hours: '13:00 – 23:00' },
                { day: 'Domingo', hours: '13:00 – 21:00' },
              ].map(h => (
                <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 13, color: 'rgba(240,235,227,0.5)' }}>{h.day}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#F0EBE3' }}>{h.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — contact form */}
          <div>
            <div style={{ background: '#fff', border: '1px solid #EDE9E3', borderRadius: 24, padding: isMobile ? '28px 20px' : '36px 32px' }}>
              {formState === 'sent' ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#EDFBF3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>✅</div>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: '#1C1A14', margin: '0 0 10px' }}>¡Mensaje enviado!</h3>
                  <p style={{ fontSize: 14, color: '#7A6E63', lineHeight: 1.65, margin: '0 0 24px' }}>Te responderemos en menos de 24 horas. También puedes contactarnos por WhatsApp para una respuesta más rápida.</p>
                  <button onClick={() => { setFormState('idle'); setFormData({ name:'', email:'', phone:'', message:'' }); }} style={{ background: '#E4AC21', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: '#1C1A14', margin: '0 0 6px' }}>Envíanos un mensaje</h3>
                  <p style={{ fontSize: 13, color: '#9A8F85', margin: '0 0 24px' }}>Respondemos en menos de 24 horas</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, color: '#1C1A14', display: 'block', marginBottom: 6 }}>Nombre *</label>
                      <input type="text" placeholder="Tu nombre" value={formData.name} onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                        style={inputStyle(errors.name)}
                        onFocus={e => e.target.style.borderColor = '#E4AC21'} onBlur={e => e.target.style.borderColor = errors.name ? '#E24B4A' : '#EDE9E3'} />
                      {errors.name && <p style={{ fontSize: 11, color: '#E24B4A', marginTop: 3 }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, color: '#1C1A14', display: 'block', marginBottom: 6 }}>Teléfono</label>
                      <input type="tel" placeholder="+34 600..." value={formData.phone} onChange={e => setFormData(d => ({ ...d, phone: e.target.value }))}
                        style={inputStyle(false)}
                        onFocus={e => e.target.style.borderColor = '#E4AC21'} onBlur={e => e.target.style.borderColor = '#EDE9E3'} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#1C1A14', display: 'block', marginBottom: 6 }}>Email *</label>
                    <input type="email" placeholder="tu@email.com" value={formData.email} onChange={e => setFormData(d => ({ ...d, email: e.target.value }))}
                      style={inputStyle(errors.email)}
                      onFocus={e => e.target.style.borderColor = '#E4AC21'} onBlur={e => e.target.style.borderColor = errors.email ? '#E24B4A' : '#EDE9E3'} />
                    {errors.email && <p style={{ fontSize: 11, color: '#E24B4A', marginTop: 3 }}>{errors.email}</p>}
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#1C1A14', display: 'block', marginBottom: 6 }}>Mensaje *</label>
                    <textarea placeholder="¿En qué podemos ayudarte?" value={formData.message} onChange={e => setFormData(d => ({ ...d, message: e.target.value }))} rows={5}
                      style={{ ...inputStyle(errors.message), resize: 'vertical' }}
                      onFocus={e => e.target.style.borderColor = '#E4AC21'} onBlur={e => e.target.style.borderColor = errors.message ? '#E24B4A' : '#EDE9E3'} />
                    {errors.message && <p style={{ fontSize: 11, color: '#E24B4A', marginTop: 3 }}>{errors.message}</p>}
                  </div>

                  <button onClick={handleSubmit} disabled={formState === 'sending'} style={{ width: '100%', background: formState === 'sending' ? '#9A8F85' : '#E4AC21', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 500, cursor: formState === 'sending' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {formState === 'sending' ? (
                      <><span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Enviando...</>
                    ) : 'Enviar mensaje →'}
                  </button>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
                    <div style={{ flex: 1, height: 1, background: '#EDE9E3' }} />
                    <span style={{ fontSize: 12, color: '#9A8F85' }}>o</span>
                    <div style={{ flex: 1, height: 1, background: '#EDE9E3' }} />
                  </div>

                  <a href="https://wa.me/34600000000" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, background: '#25D366', color: '#fff', border: 'none', borderRadius: 14, padding: '13px', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}>
                    <span style={{ fontSize: 18 }}>📱</span> Escríbenos por WhatsApp
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP PLACEHOLDER ── */}
      <section style={{ background: '#1C1A14', padding: isMobile ? '48px 20px' : '64px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0' : '0 24px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 48, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? 26 : 34, fontWeight: 600, color: '#F0EBE3', margin: '0 0 16px' }}>Encuéntranos</h2>
            <p style={{ fontSize: 15, color: 'rgba(240,235,227,0.5)', lineHeight: 1.75, margin: '0 0 28px' }}>
              Estamos en el centro de Zaragoza. Si prefieres venir a recoger tu pedido, estaremos encantados de atenderte en el local.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '📍', text: 'Calle de las Brasas, 12 · 50001 Zaragoza' },
                { icon: '🅿️', text: 'Parking público a 2 minutos' },
                { icon: '🚌', text: 'Líneas de bus: 21, 34, 52' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, color: 'rgba(240,235,227,0.55)' }}>{item.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate('menu')} style={{ marginTop: 28, background: '#E4AC21', color: '#fff', border: 'none', borderRadius: 14, padding: '13px 28px', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              Pedir ahora →
            </button>
          </div>

          {/* Map embed placeholder */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden', height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 40 }}>🗺️</span>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: 'rgba(240,235,227,0.4)', margin: 0 }}>Google Maps</p>
            <p style={{ fontSize: 12, color: 'rgba(240,235,227,0.25)', margin: 0 }}>Integración pendiente de API key</p>
          </div>
        </div>
      </section>

    </div>
  );
}
