import { useEffect, useState } from 'react';

const S = { cream:'#FAF6EF', dark:'#1a1008', yellow:'#F5C842', border:'rgba(26,16,8,.1)', sub:'rgba(26,16,8,.5)', faint:'rgba(26,16,8,.3)', surface:'#F2EDE4' };

function PhotoBlock({ height=200, radius=12, label='' }) {
  return (
    <div style={{ width:'100%', height, background:S.dark, borderRadius:radius, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'hidden', position:'relative' }}>
      <svg width="44" height="36" viewBox="0 0 44 36" fill="none">
        <rect x="1" y="1" width="42" height="34" stroke="rgba(255,255,255,.08)" strokeWidth="1.5"/>
        <circle cx="13" cy="12" r="5" stroke="rgba(255,255,255,.08)" strokeWidth="1.5"/>
        <path d="M1 26l12-10 9 7 8-10 14 12" stroke="rgba(255,255,255,.08)" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      {label && <span style={{ position:'absolute', bottom:10, left:12, fontSize:9, fontWeight:600, letterSpacing:'1.5px', color:'rgba(255,255,255,.18)', textTransform:'uppercase' }}>{label}</span>}
    </div>
  );
}

const STAR = <svg width="13" height="13" viewBox="0 0 16 16" fill="#F5C842"><path d="M8 1l1.8 5h5.2l-4.2 3 1.6 5L8 11l-4.4 3 1.6-5L1 6h5.2z"/></svg>;
const REVIEWS = [
  { name:'Carlos M.', detail:'Zaragoza', quote:'"El chuletón llegó perfecto, caliente y en su punto. Impresionante para ser delivery."' },
  { name:'Ana R.', detail:'Delicias · Pack Familiar', quote:'"Pack Familiar para el cumpleaños de mi padre. Las costillas ibéricas, una locura. Repetiremos."' },
  { name:'Javier L.', detail:'Centro · Desde 2021', quote:'"Tres años pidiendo el pollo de corral todos los viernes. No hay nada igual en Zaragoza."' },
];

export default function AboutPage({ onNavigate, initialSection }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth<768);
  useEffect(()=>{ const fn=()=>setIsMobile(window.innerWidth<768); window.addEventListener('resize',fn); return ()=>window.removeEventListener('resize',fn); },[]);
  useEffect(()=>{ if(initialSection==='contact'){ setTimeout(()=>{ const el=document.getElementById('contact-section'); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); },120); } },[initialSection]);

  const today = new Date().getDay();

  return (
    <div style={{ background:S.cream, minHeight:'100vh', fontFamily:"'Outfit',sans-serif" }}>

      {/* Hero */}
      <section style={{ background:S.dark, padding: isMobile?'32px 20px 28px':'72px 56px 64px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:240, height:240, background:'radial-gradient(circle,rgba(245,200,66,.06) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:680, position:'relative' }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'2.5px', textTransform:'uppercase', color:S.yellow, marginBottom:20 }}>Nuestra historia</div>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize: isMobile?40:56, fontWeight:400, color:'#fff', lineHeight:.92, letterSpacing:'-2px', marginBottom:20 }}>
            Diez años<br/>encendiendo<br/><em style={{ fontStyle:'italic', fontWeight:300, color:S.yellow }}>la brasa.</em>
          </h1>
          <p style={{ fontSize: isMobile?14:16, color:'rgba(255,255,255,.44)', lineHeight:1.75, marginBottom:32, maxWidth:480 }}>
            OhMyGrill nació en Zaragoza en 2013 con una sola obsesión: la mejor carne a la brasa de la ciudad. Sin atajos, sin gas, sin concesiones.
          </p>
          <div style={{ display:'flex', gap: isMobile?28:48, paddingTop:22, borderTop:'1px solid rgba(255,255,255,.07)' }}>
            {[{n:'2013',l:'fundación'},{n:'+10k',l:'pedidos'},{n:'4.9★',l:'Google'}].map(s=>(
              <div key={s.l}><div style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:600, color:S.yellow }}>{s.n}</div><div style={{ fontSize:10, color:'rgba(255,255,255,.3)', marginTop:3 }}>{s.l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo grid */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr 1fr':'1fr 1fr 1fr 1fr', gap:2, background:'#0d0804' }}>
        {['Brasa encendida','Chuletón en brasa','Leña de encina','Equipo OhMyGrill'].map(l=>(
          <div key={l} style={{ height: isMobile?140:200, background:'#1a1008', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:9, fontWeight:600, letterSpacing:'1.5px', color:'rgba(255,255,255,.18)', textTransform:'uppercase', textAlign:'center', padding:10 }}>{l}</span>
          </div>
        ))}
      </div>

      {/* Story */}
      <section style={{ padding: isMobile?'32px 20px':'72px 56px', borderBottom:`1px solid ${S.border}`, display: isMobile?'block':'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'start' }}>
        <div>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'2.5px', textTransform:'uppercase', color:S.yellow, marginBottom:18 }}>El origen</div>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize: isMobile?30:42, fontWeight:400, color:S.dark, letterSpacing:'-1.2px', lineHeight:.95, marginBottom:24 }}>Una obsesión por la <em style={{ fontStyle:'italic', fontWeight:300 }}>brasa</em> bien hecha</h2>
          <p style={{ fontSize:15, color:S.sub, lineHeight:1.8, marginBottom:18 }}>Todo empezó en 2013, cuando Miguel Montoya decidió que Zaragoza merecía una brasa de verdad. La que se hace con leña de encina aragonesa, con tiempo, y con los cortes que merece ese fuego.</p>
          <div style={{ borderLeft:`3px solid ${S.yellow}`, padding:'6px 0 6px 20px', margin:'24px 0' }}>
            <p style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:400, fontStyle:'italic', color:S.dark, lineHeight:1.4 }}>"La brasa no perdona el mal producto. Por eso empezamos por ahí."</p>
            <cite style={{ fontSize:11, fontWeight:700, color:S.sub, letterSpacing:'1px', textTransform:'uppercase', display:'block', marginTop:8, fontStyle:'normal' }}>— Miguel Montoya, fundador</cite>
          </div>
          <p style={{ fontSize:15, color:S.sub, lineHeight:1.8 }}>Hoy somos el referente de la carne a domicilio en Zaragoza, pero el proceso es exactamente el mismo que el primer día.</p>
        </div>
        {!isMobile && (
          <div>
            <PhotoBlock height={280} label="Cocina / brasa" />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12 }}>
              <PhotoBlock height={160} label="Maduración" />
              <PhotoBlock height={160} label="Servicio" />
            </div>
          </div>
        )}
      </section>

      {/* Values */}
      <section style={{ background:S.dark, padding: isMobile?'32px 20px':'64px 56px', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:'2.5px', textTransform:'uppercase', color:S.yellow, marginBottom:14 }}>Lo que nos define</div>
        <h2 style={{ fontFamily:"'Fraunces',serif", fontSize: isMobile?28:38, fontWeight:400, color:'#fff', letterSpacing:'-1px', marginBottom:36 }}>Tres principios.<br/>Sin excepciones.</h2>
        <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'repeat(3,1fr)', gap: isMobile?12:16 }}>
          {[
            { n:'01', title:'Leña de encina, siempre', desc:'No usamos gas. No usamos carbón de bolsa. Solo leña de encina aragonesa, cortada y curada para dar el calor correcto.' },
            { n:'02', title:'Producto de primera', desc:'Cada corte se selecciona personalmente. Maduración propia, ibéricos de bellota certificados, aves criadas en libertad en Aragón.' },
            { n:'03', title:'El tiempo que toca', desc:'Un buen chuletón necesita su tiempo en la brasa. No lo aceleramos. Cuando está, está. Por eso pedimos que pidas con algo de margen.' },
          ].map(v=>(
            <div key={v.n} style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', borderRadius:14, padding:isMobile?'20px':'28px 24px', transition:'border-color .2s' }}>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:40, fontWeight:300, color:'rgba(245,200,66,.2)', lineHeight:1, marginBottom:14, letterSpacing:'-1px' }}>{v.n}</div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:400, color:'#fff', marginBottom:10, letterSpacing:'-.2px' }}>{v.title}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,.4)', lineHeight:1.75 }}>{v.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Numbers */}
      <div style={{ background:S.yellow, padding:'0', display:'grid', gridTemplateColumns: isMobile?'1fr 1fr':'repeat(4,1fr)', borderTop:'1px solid rgba(0,0,0,.06)' }}>
        {[{n:'+10',l:'años en Zaragoza'},{n:'100%',l:'leña de encina'},{n:'4.9★',l:'Google Maps'},{n:'+10k',l:'pedidos completados'}].map((s,i)=>(
          <div key={s.l} style={{ padding:'24px 16px', textAlign:'center', borderRight: i<3?'1px solid rgba(26,16,8,.1)':'none', borderBottom: isMobile&&i<2?'1px solid rgba(26,16,8,.1)':'none' }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize: isMobile?28:44, fontWeight:600, color:S.dark, lineHeight:1, letterSpacing:'-1.5px' }}>{s.n}</div>
            <div style={{ fontSize: isMobile?11:13, color:'rgba(26,16,8,.5)', marginTop:4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Process */}
      <section style={{ padding: isMobile?'32px 20px':'72px 56px', borderBottom:`1px solid ${S.border}` }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:'2.5px', textTransform:'uppercase', color:S.yellow, marginBottom:14 }}>Cómo lo hacemos</div>
        <h2 style={{ fontFamily:"'Fraunces',serif", fontSize: isMobile?28:38, fontWeight:400, color:S.dark, letterSpacing:'-1px', marginBottom: isMobile?28:48 }}>De la maduración a tu puerta</h2>
        <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'repeat(4,1fr)', gap: isMobile?0:0, border:`1px solid ${S.border}` }}>
          {[
            { n:'01', title:'Selección', desc:'Elegimos los cortes cada mañana. Si no llega bien, no sale a la carta.' },
            { n:'02', title:'Maduración', desc:'Los cortes que lo requieren maduran en nuestra propia cámara. El chuletón, mínimo 45 días.' },
            { n:'03', title:'La brasa', desc:'Leña de encina, el tiempo que necesita cada corte. Sin prisas. Sin gas.' },
            { n:'04', title:'En tu puerta', desc:'Embalado para conservar el calor. En 90 minutos o 25 si vienes a recoger.' },
          ].map((p,i)=>(
            <div key={p.n} style={{ padding:'28px 24px', borderRight: !isMobile&&i<3?`1px solid ${S.border}`:'none', borderBottom: isMobile&&i<3?`1px solid ${S.border}`:'none', position:'relative' }}>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:32, fontWeight:300, color:'rgba(26,16,8,.1)', lineHeight:1, marginBottom:14, letterSpacing:'-1px' }}>{p.n}</div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:400, color:S.dark, marginBottom:8 }}>{p.title}</div>
              <div style={{ fontSize:13, color:S.sub, lineHeight:1.65 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section style={{ background:S.surface, padding: isMobile?'32px 20px':'64px 56px', borderBottom:`1px solid ${S.border}` }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:'2.5px', textTransform:'uppercase', color:S.yellow, marginBottom:14 }}>Lo que dicen</div>
        <h2 style={{ fontFamily:"'Fraunces',serif", fontSize: isMobile?26:34, fontWeight:400, color:S.dark, letterSpacing:'-.8px', marginBottom:28 }}>Clientes que repiten</h2>
        <div style={{ display: isMobile?'flex':'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, overflowX: isMobile?'auto':'visible', scrollSnapType: isMobile?'x mandatory':'none', scrollbarWidth:'none', paddingBottom: isMobile?4:0 }}>
          {REVIEWS.map((r,i)=>(
            <div key={i} style={{ background:'#fff', border:`1px solid ${S.border}`, borderRadius:14, padding:'22px 20px', flexShrink: isMobile?0:'unset', width: isMobile?280:'auto', scrollSnapAlign: isMobile?'start':'unset' }}>
              <div style={{ display:'flex', gap:3, marginBottom:12 }}>{[1,2,3,4,5].map(n=><span key={n}>{STAR}</span>)}</div>
              <p style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:400, color:S.dark, fontStyle:'italic', lineHeight:1.55, marginBottom:16 }}>{r.quote}</p>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, background:S.dark, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:S.dark }}>{r.name}</div>
                  <div style={{ fontSize:11, color:S.sub, marginTop:1 }}>{r.detail}</div>
                </div>
                <span style={{ marginLeft:'auto', fontSize:9, fontWeight:700, color:S.faint, background:S.surface, padding:'3px 8px', borderRadius:10, whiteSpace:'nowrap' }}>Google</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact + Hours */}
      <section id="contact-section" style={{ padding: isMobile?'32px 20px':'72px 56px', borderBottom:`1px solid ${S.border}`, display: isMobile?'block':'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'start' }}>
        <div>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'2.5px', textTransform:'uppercase', color:S.yellow, marginBottom:14 }}>Encuéntranos</div>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize: isMobile?28:40, fontWeight:400, color:S.dark, letterSpacing:'-1px', marginBottom:20 }}>Estamos en Zaragoza</h2>
          {[
            { icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={S.dark} strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, lbl:'Dirección', val:'Calle de las Brasas, 12', sub:'50001 Zaragoza · Casco Histórico' },
            { icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={S.dark} strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.61 4.48 2 2 0 0 1 3.6 2.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.88-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.78 17z"/></svg>, lbl:'Teléfono', val:'+34 976 000 000', sub:'También por WhatsApp' },
            { icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={S.dark} strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, lbl:'Email', val:'hola@ohmygrillbrasas.com', sub:'Respondemos en menos de 24h' },
          ].map(r=>(
            <div key={r.lbl} style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:20 }}>
              <div style={{ width:40, height:40, background:S.surface, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{r.icon}</div>
              <div>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', color:S.faint, marginBottom:3 }}>{r.lbl}</div>
                <div style={{ fontSize:15, fontWeight:600, color:S.dark }}>{r.val}</div>
                <div style={{ fontSize:12, color:S.sub, marginTop:2 }}>{r.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: isMobile?24:0 }}>
          <div style={{ background:S.dark, borderRadius:14, padding:'22px 20px', marginBottom:14 }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:S.yellow, marginBottom:16 }}>Horario de pedidos</div>
            {[{id:'lj',days:'Lun – Jue',time:'13:00 – 22:00',d:[1,2,3,4]},{id:'vs',days:'Vie – Sáb',time:'13:00 – 23:00',d:[5,6]},{id:'dom',days:'Domingo',time:'13:00 – 21:00',d:[0]}].map(h=>{
              const isToday = h.d.includes(today);
              return (
                <div key={h.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 0', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
                  <span style={{ fontSize:13, fontWeight:500, color:isToday?S.yellow:'rgba(255,255,255,.5)' }}>{h.days}</span>
                  <span style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:isToday?S.yellow:'#fff' }}>{h.time}</span>
                </div>
              );
            })}
          </div>
          <button onClick={()=>window.open('https://maps.google.com/?q=Zaragoza','_blank')} style={{ width:'100%', background:S.surface, border:`1px solid ${S.border}`, borderRadius:12, padding:'16px 18px', display:'flex', alignItems:'center', gap:12, cursor:'pointer', fontFamily:'inherit', transition:'background .15s' }}
            onMouseEnter={e=>e.currentTarget.style.background='#ede8df'} onMouseLeave={e=>e.currentTarget.style.background=S.surface}>
            <div style={{ width:40, height:40, background:S.dark, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div style={{ textAlign:'left', flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600, color:S.dark }}>Abrir en Google Maps</div>
              <div style={{ fontSize:12, color:S.sub, marginTop:2 }}>Calle de las Brasas, 12 · Zaragoza</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={S.faint} strokeWidth="2" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </button>
        </div>
      </section>

      {/* CTA */}
      <div style={{ background:S.yellow, padding: isMobile?'28px 20px':'40px 56px', textAlign: isMobile?'center':'left', display:'flex', flexDirection: isMobile?'column':'row', alignItems:'center', justifyContent:'space-between', gap:20 }}>
        <div>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize: isMobile?26:34, fontWeight:400, color:S.dark, letterSpacing:'-.8px', marginBottom:6 }}>¿Listo para pedir?</h2>
          <p style={{ fontSize:14, color:'rgba(26,16,8,.55)', lineHeight:1.6 }}>Entrega en 90 min o recogida en el local · Toda Zaragoza · Todos los días.</p>
        </div>
        <button onClick={()=>onNavigate('menu')} style={{ background:S.dark, color:S.yellow, border:'none', borderRadius:50, padding:'15px 36px', fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'inherit', flexShrink:0 }}>Pedir ahora →</button>
      </div>

      {/* Footer */}
      {!isMobile && (
        <footer style={{ background:S.dark, padding:'20px 56px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:S.yellow }}>OhMyGrill Brasas</div>
          <div style={{ display:'flex', gap:24 }}>
            {['home','menu','packs'].map(id=>(
              <button key={id} onClick={()=>onNavigate(id)} style={{ background:'none', border:'none', fontSize:12, color:'rgba(255,255,255,.28)', cursor:'pointer', fontFamily:'inherit' }}>{{home:'Inicio',menu:'Carta',packs:'Packs'}[id]}</button>
            ))}
          </div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.15)' }}>© 2025 OhMyGrill Brasas · Zaragoza</div>
        </footer>
      )}
    </div>
  );
}
