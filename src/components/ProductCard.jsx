import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, size = 'normal' }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  const inCart = items.find(i => i.id === product.id);
  const qty = inCart?.qty ?? 0;

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const isSmall = size === 'small';

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      border: '1px solid #3D2200',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(28,26,20,0.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image area */}
      <div style={{
        height: isSmall ? 100 : 130,
        background: 'linear-gradient(135deg, #2A1005 0%, #7C2D0C 60%, #B84020 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontSize: isSmall ? 36 : 48,
      }}>
        {product.emoji}
        {product.badge && (
          <span style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: product.badgeColor || '#1A1500',
            color: '#fff',
            fontSize: 10,
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            letterSpacing: '0.5px',
            padding: '3px 10px',
            borderRadius: 20,
          }}>
            {product.badge}
          </span>
        )}
        {qty > 0 && (
          <span style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: '#ffd43a',
            color: '#fff',
            fontSize: 11,
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            width: 22,
            height: 22,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {qty}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: isSmall ? '12px 14px' : '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
            <h3 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: isSmall ? 15 : 17,
              fontWeight: 600,
              color: '#1A1500',
              margin: 0,
              lineHeight: 1.2,
            }}>
              {product.name}
            </h3>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 11,
              color: '#C4A265',
              background: '#2A1800',
              padding: '2px 8px',
              borderRadius: 10,
              whiteSpace: 'nowrap',
              marginTop: 2,
            }}>
              {product.weight}
            </span>
          </div>
          {!isSmall && (
            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 12.5,
              color: '#C4A265',
              lineHeight: 1.55,
              margin: '0 0 14px 0',
            }}>
              {product.description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: isSmall ? 10 : 0 }}>
          <span style={{
            fontFamily: "'Fraunces', serif",
            fontSize: isSmall ? 18 : 22,
            fontWeight: 600,
            color: '#ffd43a',
          }}>
            €{product.price % 1 === 0 ? product.price : product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            style={{
              background: added ? '#1a7a4a' : '#1A1500',
              color: '#fff',
              border: 'none',
              borderRadius: 24,
              padding: isSmall ? '6px 14px' : '8px 18px',
              fontSize: 12,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {added ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Añadido
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Añadir
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
