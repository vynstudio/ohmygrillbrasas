// OhMyGrill — Strict 3-color system
// Web A: Dark dominant  |  Mobile D: Full dark
//
// RULE: Only these 3 values ever appear in the codebase.
// #C8860A, #FAF6EF, #1A1000, rgba(...) are BANNED.
// Opacity variants of the 3 colors are allowed.

export const C = {
  dark:   '#0F0800',   // background, surfaces, text on yellow
  yellow: '#FFD43A',   // CTAs, prices, active states, accents
  white:  '#FFFFFF',   // text on dark, card backgrounds, light surfaces
};

// Derived — opacity only, no new hues
export const O = {
  darkCard:     '#1A1000',  // dark brown card (10% lighter) — only surface variant allowed
  darkBorder:   '#2A1A00',  // border on dark bg
  whiteDim:     'rgba(255,255,255,0.55)',   // secondary text on dark
  whiteFaint:   'rgba(255,255,255,0.25)',   // tertiary text on dark
  whiteBorder:  'rgba(255,255,255,0.12)',   // border on dark bg
  yellowDark:   '#CC9F00',  // yellow pressed state
  blackText:    '#0F0800',  // text on white/yellow bg
};
