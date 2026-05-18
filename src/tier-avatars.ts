// 20×20 pixel art axolotl
// 0=transparent 1=body 2=gill 3=gill-tip 4=eye 5=highlight
const PIXELS: readonly (readonly number[])[] = [
  [0,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,2,3,0,0], //  0 – gill tips
  [0,3,2,2,3,2,0,0,0,0,0,0,0,0,2,3,2,2,3,0], //  1 – gill mid
  [2,2,2,2,2,2,0,0,0,0,0,0,0,0,2,2,2,2,2,2], //  2 – gill base
  [2,2,0,0,2,1,1,1,1,1,1,1,1,1,1,2,0,0,2,2], //  3 – gill base + head top
  [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0], //  4 – head wide
  [0,0,0,0,1,1,5,1,1,1,1,1,1,5,1,1,0,0,0,0], //  5 – highlight above eyes
  [0,0,0,0,1,1,4,4,1,1,1,1,4,4,1,1,0,0,0,0], //  6 – eyes
  [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0], //  7 – head
  [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0], //  8 – head narrows
  [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0], //  9 – neck
  [0,0,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0,0,0], // 10 – front leg tips
  [0,0,0,0,1,1,0,1,1,1,1,1,1,0,1,1,0,0,0,0], // 11 – front legs
  [0,0,0,0,1,1,0,1,1,1,1,1,1,0,1,1,0,0,0,0], // 12 – front legs
  [0,0,0,0,0,1,0,0,1,1,1,1,0,0,1,0,0,0,0,0], // 13 – back leg start
  [0,0,0,0,0,1,1,0,1,1,1,1,0,1,1,0,0,0,0,0], // 14 – back legs + tail top
  [0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0], // 15 – tail
  [0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0], // 16 – tail narrow
  [0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0], // 17 – tail wavy
  [0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0], // 18 – tail tip
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 19
];

interface Palette {
  body: string; gill: string; gillTip: string; eye: string; highlight: string; glow?: string;
}

const PALETTES: [Palette, Palette, Palette, Palette, Palette] = [
  // Spark (1–5) — translucent pale pink, barely glowing
  { body: '#f0d6f0', gill: '#ffb8cc', gillTip: '#ffe8f4', eye: '#6b3d6b', highlight: '#fff8ff' },
  // Ember (6–10) — warm peach, orange gills
  { body: '#ffd4a0', gill: '#ff8800', gillTip: '#ffcc44', eye: '#3d2000', highlight: '#fff8e8', glow: '#ff880028' },
  // Flame (11–15) — coral, red-orange gills
  { body: '#ff9966', gill: '#ff2200', gillTip: '#ff7700', eye: '#1a0000', highlight: '#ffd0b8', glow: '#ff330038' },
  // Beacon (16–20) — golden, blazing gills
  { body: '#ffd566', gill: '#ff6600', gillTip: '#ffe500', eye: '#2a1400', highlight: '#ffffc0', glow: '#ffaa0048' },
  // Nova (21–25) — cosmic blue-white, stellar gills
  { body: '#a8d8ff', gill: '#44aaff', gillTip: '#ffffff', eye: '#000820', highlight: '#e8f8ff', glow: '#88bbff48' },
];

function buildSVG(p: Palette): string {
  const colors = ['none', p.body, p.gill, p.gillTip, p.eye, p.highlight];
  let inner = '';

  if (p.glow) inner += `<circle cx="10" cy="10" r="9.5" fill="${p.glow}"/>`;

  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 20; x++) {
      const c = PIXELS[y][x];
      if (c === 0) continue;
      inner += `<rect x="${x}" y="${y}" width="1" height="1" fill="${colors[c]}"/>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" `
    + `style="image-rendering:pixelated;image-rendering:crisp-edges">${inner}</svg>`;
}

export const TIER_AVATARS: [string, string, string, string, string] =
  PALETTES.map(buildSVG) as [string, string, string, string, string];
