export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt("0x" + hex[1] + hex[1]);
    g = parseInt("0x" + hex[2] + hex[2]);
    b = parseInt("0x" + hex[3] + hex[3]);
  } else if (hex.length === 7) {
    r = parseInt("0x" + hex[1] + hex[2]);
    g = parseInt("0x" + hex[3] + hex[4]);
    b = parseInt("0x" + hex[5] + hex[6]);
  }
  r /= 255; g /= 255; b /= 255;
  const cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin;
  let h = 0, s = 0, l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}

export function getSpectrumColors(hexColor: string): [string, string, string] {
  const { h, s } = hexToHSL(hexColor);
  const sat = Math.min(Math.max(s, 35), 72);
  // Strong pastel → very airy center → strong pastel: iPhone-style diagonal gradient
  const c1  = `hsl(${h}, ${sat}%, 82%)`;
  const cMid = `hsl(${(h + 70) % 360}, ${Math.round(sat * 0.3)}%, 94%)`;
  const c2  = `hsl(${(h + 140) % 360}, ${Math.round(sat * 0.9)}%, 80%)`;
  return [c1, cMid, c2];
}
