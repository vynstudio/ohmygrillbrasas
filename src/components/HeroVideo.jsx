import { useEffect, useRef, useState } from 'react';

export default function HeroVideo({ src, poster }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Ensure playback even if browser defers autoplay
    const attempt = () => v.play().catch(() => {});
    attempt();
    v.addEventListener('canplay', attempt);
    return () => v.removeEventListener('canplay', attempt);
  }, []);

  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', background:'#0F0800' }}>
      {/* Poster shown instantly while video loads */}
      {poster && (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity: loaded ? 0 : 1, transition:'opacity 0.8s ease' }}
        />
      )}

      <video
        ref={ref}
        src={src}
        poster={poster}
        autoPlay muted loop playsInline preload="metadata"
        onCanPlay={() => setLoaded(true)}
        style={{
          position:'absolute', inset:0,
          width:'100%', height:'100%',
          objectFit:'cover',
          opacity: loaded ? 1 : 0,
          transition:'opacity 1s ease',
        }}
      />

      {/* Overlay — heavy left vignette so text is always readable,
          lighter on right to let fire/smoke breathe */}
      <div style={{
        position:'absolute', inset:0,
        background:'linear-gradient(100deg, rgba(15,8,0,0.88) 0%, rgba(15,8,0,0.65) 50%, rgba(15,8,0,0.30) 100%)',
      }} />

      {/* Bottom fade — anchors content to the section */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:'40%',
        background:'linear-gradient(to top, rgba(15,8,0,0.7) 0%, transparent 100%)',
      }} />
    </div>
  );
}
