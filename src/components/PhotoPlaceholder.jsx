// Reusable photo placeholder — dark bg with subtle image outline SVG
// Replaces all emojis as food item visuals
// When real photos are added, replace with <img> tags
export default function PhotoPlaceholder({ width = '100%', height = 64, borderRadius = 10, style = {} }) {
  return (
    <div style={{ width, height, background:'#1a1008', borderRadius, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0, ...style }}>
      <svg width="32" height="26" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="30" height="24" stroke="rgba(255,255,255,.12)" strokeWidth="1.2"/>
        <circle cx="10" cy="9" r="4" stroke="rgba(255,255,255,.12)" strokeWidth="1.2"/>
        <path d="M1 19l8-7 7 5 6-8 10 10" stroke="rgba(255,255,255,.12)" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}
