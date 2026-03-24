import { useState, useEffect } from 'react';
import { packs, products } from '../data/menu';
import { useCart } from '../context/CartContext';

const packProducts = {
  'pack-familiar': ['chuleta-buey', 'pollo-corral', 'verduras-temporada', 'salsa-chimichurri', 'salsa-mojo'],
  'pack-pareja':   ['entrecot-angus', 'pollo-corral', 'patatas-brasas', 'salsa-chimichurri'],
  'pack-carnivoro':['chuleta-buey', 'costillas-iberico', 'secreto-iberico', 'pan-cristal', 'salsa-chimichurri'],
};

function PackHero({ pack, idx, onAdd, added, isMobile }) {
  const [hovered, setHovered] = useState(false);
  const accent = idx === 2 ? '#ffd43a' : idx === 0 ? '#1a7a4a' : '#185FA5';
  const accentLight = idx === 2 ? 'rgba(232,88,32,0.12)' : idx === 0 ? 'rgba(26,122,74,0.12)' : 'rgba(24,95,165,0.12)';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 24,
        border: `2px solid ${hovered ? accent : '#EDE9E3'}`,
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? `0 16px 48px rgba(0,0,0,0.10)` : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top band */}
      <div style={{ background: '#1C1A14', padding: '28px 28px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -24, right: -16, fontSize: 100, opacity: 0.07, userSelect: 'none' }}>{pack.emoji}</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <span style={{ background: accent, color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20, letterSpacing: '0.3px', display: 'inline-block', marginBottom: 10 }}>
                {pack.badge}
              </span>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600, color: '#F0EBE3', margin: 0, lineHeight: 1.1 }}>{pack.name}</h2>
              <p style={{ fontSize: 13, color: 'rgba(240,235,227,0.45)', margin: '5px 0 0' }}>{pack.subtitle}</p>
            </div>
            <span style={{ fontSize: 42 }}>{pack.emoji}</span>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(240,235,227,0.55)', lineHeight: 1.65, margin: 0 }}>{pack.description}</p>
        </div>
      </div>

      {/* Items list */}
      <div style={{ padding: '20px 28px', flex: 1 }}>
        <p style={{ fontSize: 11, letterSpacing: '2px', color: '#9A8F85', fontWeight: 600, textTransform: 'uppercase', marginBottom: 12 }}>Incluye</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {pack.items.map((item, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < pack.items.length - 1 ? '1px solid #F5F1EC' : 'none' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: '#1C1A14' }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 28px 24px', borderTop: '1px solid #F5F1EC' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 34, fontWeight: 600, color: '#1C1A14', lineHeight: 1 }}>€{pack.price}</span>
              <span style={{ fontSize: 14, color: '#B8AFA8', textDecoration: 'line-through' }}>€{pack.originalPrice}</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: accentLight, borderRadius: 20, padding: '3px 10px', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: accent, fontWeight: 600 }}>Ahorras €{pack.savings}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, color: '#9A8F85', margin: '0 0 2px' }}>Precio por persona</p>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, color: '#7A6E63', margin: 0 }}>
              €{(pack.price / (idx === 0 ? 4 : idx === 1 ? 2 : 2.5)).toFixed(2)}
            </p>
          </div>
        </div>
        <button
          onClick={() => onAdd(pack)}
          style={{
            width: '100%', background: added ? '#1a7a4a' : accent,
            color: '#fff', border: 'none', borderRadius: 14,
            padding: '14px', fontFamily: "'Outfit', sans-serif",
            fontSize: 15, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8,
          }}
        >
          {added ? '✓ Añadido al carrito' : `Pedir ${pack.name} →`}
        </button>
      </div>
    </div>
  );
}

function ComparisonTable({ isMobile }) {
  const rows = [
    { label: 'Personas', vals: ['4', '2', '2–3'] },
    { label: 'Carnes', vals: ['Chuletón + pollo', 'Entrecot + pollo', '3 cortes ibéricos'] },
    { label: 'Guarnición', vals: ['Verduras brasa', 'Patatas brasas', 'Pan de cristal'] },
    { label: 'Salsas', vals: ['2 salsas', '1 salsa', 'Chimichurri'] },
    { label: 'Precio/persona', vals: ['€15.50', '€19.00', '€20.80'] },
    { label: 'Ahorro', vals: ['€14', '€8', '€12'] },
  ];
  const cols = ['Pack Familiar', 'Pack Pareja', 'Pack Carnívoro'];
  const accents = ['#1a7a4a', '#185FA5', '#ffd43a'];

  return (
    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #EDE9E3', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '120px repeat(3,1fr)' : '180px repeat(3,1fr)', background: '#1C1A14' }}>
        <div style={{ padding: '16px 20px' }} />
        {cols.map((col, i) => (
          <div key={col} style={{ padding: '16px 12px', textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? 13 : 15, fontWeight: 600, color: accents[i], margin: 0 }}>{col}</p>
          </div>
        ))}
      </div>
      {/* Rows */}
      {rows.map((row, ri) => (
        <div key={row.label} style={{ display: 'grid', gridTemplateColumns: isMobile ? '120px repeat(3,1fr)' : '180px repeat(3,1fr)', background: ri % 2 === 0 ? '#fff' : '#FAFAF5', borderTop: '1px solid #F0EDE8' }}>
          <div style={{ padding: isMobile ? '12px 16px' : '14px 20px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: isMobile ? 12 : 13, fontWeight: 500, color: '#7A6E63' }}>{row.label}</span>
          </div>
          {row.vals.map((val, vi) => (
            <div key={vi} style={{ padding: isMobile ? '12px 8px' : '14px 12px', textAlign: 'center', borderLeft: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: isMobile ? 12 : 13, color: '#1C1A14', fontWeight: row.label === 'Ahorro' ? 600 : 400, color: row.label === 'Ahorro' ? accents[vi] : '#1C1A14' }}>{val}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function PacksPage({ onNavigate }) {
  const { addItem, items, subtotal } = useCart();
  const [addedId, setAddedId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const handleAdd = (pack) => {
    addItem({ id: pack.id, name: pack.name, price: pack.price, emoji: pack.emoji, description: pack.subtitle });
    setAddedId(pack.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#FAFAF5', minHeight: '100vh' }}>

      {/* Hero header */}
      <div style={{ background: '#1C1A14', padding: isMobile ? '48px 20px 40px' : '64px 0 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, fontSize: 220, opacity: 0.03, userSelect: 'none', fontFamily: "'Fraunces', serif", fontWeight: 900, lineHeight: 1 }}>PACK</div>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0' : '0 24px', position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-block', background: 'rgba(232,88,32,0.2)', border: '1px solid rgba(232,88,32,0.3)', color: '#ffd43a', fontSize: 11, letterSpacing: '2px', fontWeight: 600, padding: '5px 14px', borderRadius: 20, marginBottom: 16, textTransform: 'uppercase' }}>
            Combos especiales
          </span>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? 36 : 52, fontWeight: 600, color: '#F0EBE3', margin: '0 0 12px', letterSpacing: '-1px', lineHeight: 1.05 }}>
            Packs y promociones
          </h1>
          <p style={{ fontSize: isMobile ? 14 : 16, color: 'rgba(240,235,227,0.5)', maxWidth: 520, lineHeight: 1.7, margin: '0 0 32px' }}>
            Combina tus platos favoritos y ahorra. Pensados para compartir en buena compañía.
          </p>
          {/* Stats */}
          <div style={{ display: 'flex', gap: isMobile ? 16 : 32, flexWrap: 'wrap' }}>
            {[{ num: '3 packs', label: 'disponibles' }, { num: 'Hasta €14', label: 'de ahorro' }, { num: '90 min', label: 'entrega Zaragoza' }].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: '#ffd43a' }}>{s.num}</span>
                <span style={{ fontSize: 13, color: 'rgba(240,235,227,0.35)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '32px 20px' : '48px 24px' }}>

        {/* Pack cards */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 20, marginBottom: 56 }}>
          {packs.map((pack, idx) => (
            <PackHero key={pack.id} pack={pack} idx={idx} onAdd={handleAdd} added={addedId === pack.id} isMobile={isMobile} />
          ))}
        </div>

        {/* Comparison table */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? 24 : 30, fontWeight: 600, color: '#1C1A14', margin: '0 0 6px' }}>Compara los packs</h2>
          <p style={{ fontSize: 14, color: '#9A8F85', margin: '0 0 24px' }}>¿No sabes cuál elegir? Aquí lo ves claro.</p>
          <div style={{ overflowX: 'auto' }}>
            <ComparisonTable isMobile={isMobile} />
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? 24 : 30, fontWeight: 600, color: '#1C1A14', margin: '0 0 20px' }}>Preguntas frecuentes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
            {[
              { q: '¿Puedo personalizar el pack?', a: 'Usa el campo de notas en el checkout para indicar preferencias — punto de la carne, salsas alternativas, alergias.' },
              { q: '¿Los packs incluyen el envío?', a: 'El envío se calcula según tu zona de Zaragoza. Pedidos mayores de €35 tienen envío gratis.' },
              { q: '¿Cuánto tarda en llegar?', a: 'Entre 30 y 65 minutos según tu zona. Lo verás antes de confirmar el pedido en el checkout.' },
              { q: '¿Puedo combinar un pack con platos de la carta?', a: 'Sí, puedes añadir cualquier plato de la carta además de un pack en el mismo pedido.' },
            ].map(faq => (
              <div key={faq.q} style={{ background: '#fff', border: '1px solid #EDE9E3', borderRadius: 14, padding: '20px 22px' }}>
                <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, color: '#1C1A14', margin: '0 0 8px' }}>{faq.q}</h4>
                <p style={{ fontSize: 13, color: '#7A6E63', lineHeight: 1.65, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: '#1C1A14', borderRadius: 24, padding: isMobile ? '36px 24px' : '48px 56px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto', gap: 24, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? 24 : 32, fontWeight: 600, color: '#F0EBE3', margin: '0 0 10px', lineHeight: 1.1 }}>
              ¿Prefieres elegir tú mismo?
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(240,235,227,0.45)', lineHeight: 1.65, margin: 0 }}>
              Explora la carta completa y monta tu pedido a tu gusto.
            </p>
          </div>
          <button onClick={() => onNavigate('menu')} style={{ background: '#ffd43a', color: '#fff', border: 'none', borderRadius: 14, padding: isMobile ? '14px 24px' : '14px 32px', fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', width: isMobile ? '100%' : 'auto' }}>
            Ver la carta →
          </button>
        </div>
      </div>

      {/* Mobile floating cart bar */}
      {isMobile && itemCount > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px', background: '#fff', borderTop: '1px solid #EDE9E3', zIndex: 50, boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
          <button onClick={() => onNavigate('checkout')} style={{ width: '100%', background: '#ffd43a', color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>🛒 {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}</span>
            <span>Ver pedido · €{subtotal.toFixed(2)} →</span>
          </button>
        </div>
      )}
    </div>
  );
}
