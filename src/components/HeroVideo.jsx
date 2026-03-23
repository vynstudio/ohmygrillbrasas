import { useEffect, useRef, useState } from 'react';

export default function HeroVideo({ src, poster }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (ref.current) ref.current.play().catch(() => {});
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        autoPlay muted loop playsInline
        onCanPlay={() => setLoaded(true)}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(105deg, rgba(12,10,6,0.90) 0%, rgba(12,10,6,0.60) 45%, rgba(12,10,6,0.25) 100%)',
      }} />
    </div>
  );
}
