import { GridLayout } from '../types';

// Extend base GridLayout with specific sizing and slot math for canvas
export interface DetailedGridLayout extends GridLayout {
  width: number;   // reference width unit
  height: number;  // reference height unit
  slots: { x: number; y: number; w: number; h: number }[];
}

// Helper to create grid layouts easily
const createLayout = (
  id: string, name: string, shots: number,
  w: number, h: number, 
  cw: number, ch: number, 
  slots: { x: number; y: number; w: number; h: number }[]
): DetailedGridLayout => ({
  id, name, shots,
  cameraRatio: `${cw} / ${ch}`,
  aspectRatio: `${w} / ${h}`,
  width: w, height: h,
  slots
});

export const GRID_LAYOUTS: DetailedGridLayout[] = [
  // 1: film-1
  // A vertical thick film strip. Huge top and bottom padding.
  createLayout('film-1', '1 Photo', 1, 600, 900, 3, 4, [
    { x: 50, y: 150, w: 500, h: 600 }
  ]),
  // 2: wide-2h
  createLayout('wide-2h', '2 Photos', 2, 1200, 800, 3, 4, [
    { x: 60, y: 60, w: 510, h: 680 },
    { x: 630, y: 60, w: 510, h: 680 }
  ]),
  // 3: strip-2v
  createLayout('strip-2v', '2 Photos', 2, 600, 1200, 4, 3, [
    { x: 50, y: 50, w: 500, h: 375 },
    { x: 50, y: 475, w: 500, h: 375 }
  ]),
  // 4: strip-3v
  createLayout('strip-3v', '3 Photos', 3, 400, 1200, 4, 3, [
    { x: 30, y: 30, w: 340, h: 255 },
    { x: 30, y: 315, w: 340, h: 255 },
    { x: 30, y: 600, w: 340, h: 255 }
  ]),
  // 5: wide-3h
  createLayout('wide-3h', '3 Photos', 3, 1200, 600, 3, 4, [
    { x: 40, y: 40, w: 346, h: 462 },
    { x: 426, y: 40, w: 346, h: 462 },
    { x: 812, y: 40, w: 346, h: 462 }
  ]),
  // 6: strip-4v
  // Classic vertical photobooth
  createLayout('strip-4v', '4 Photos', 4, 400, 1200, 4, 3, [
    { x: 20, y: 20, w: 360, h: 270 },
    { x: 20, y: 310, w: 360, h: 270 },
    { x: 20, y: 600, w: 360, h: 270 },
    { x: 20, y: 890, w: 360, h: 270 }
  ]),
  // 7: grid-4
  // 2x2 square (window frame)
  createLayout('grid-4', '4 Photos', 4, 800, 800, 4, 3, [
    { x: 30, y: 30, w: 355, h: 266 },
    { x: 415, y: 30, w: 355, h: 266 },
    { x: 30, y: 326, w: 355, h: 266 },
    { x: 415, y: 326, w: 355, h: 266 } // Centered tightly in the square
  ]),
  // 8: left-4
  // Strip aligned left, empty space on right
  createLayout('left-4', '4 Photos', 4, 800, 1200, 4, 3, [
    { x: 40, y: 40, w: 340, h: 255 },
    { x: 40, y: 335, w: 340, h: 255 },
    { x: 40, y: 630, w: 340, h: 255 },
    { x: 40, y: 925, w: 340, h: 255 }
  ]),
  // 9: right-4
  createLayout('right-4', '4 Photos', 4, 800, 1200, 4, 3, [
    { x: 420, y: 40, w: 340, h: 255 },
    { x: 420, y: 335, w: 340, h: 255 },
    { x: 420, y: 630, w: 340, h: 255 },
    { x: 420, y: 925, w: 340, h: 255 }
  ]),
  // 10: wide-4h
  createLayout('wide-4h', '4 Photos', 4, 1600, 600, 3, 4, [
    { x: 40, y: 40, w: 350, h: 466 },
    { x: 430, y: 40, w: 350, h: 466 },
    { x: 820, y: 40, w: 350, h: 466 },
    { x: 1210, y: 40, w: 350, h: 466 }
  ]),
  // 11: tall-4
  // 2 col, 2 row, portrait result
  createLayout('tall-4', '4 Photos', 4, 800, 1200, 4, 5, [
    { x: 40, y: 40, w: 340, h: 425 },
    { x: 420, y: 40, w: 340, h: 425 },
    { x: 40, y: 505, w: 340, h: 425 },
    { x: 420, y: 505, w: 340, h: 425 }
  ]),
  // 12: strip-4b
  // Big gap at bottom for date/text
  createLayout('strip-4b', '4 Photos', 4, 400, 1400, 4, 3, [
    { x: 20, y: 20, w: 360, h: 270 },
    { x: 20, y: 310, w: 360, h: 270 },
    { x: 20, y: 600, w: 360, h: 270 },
    { x: 20, y: 890, w: 360, h: 270 } // bottom 240px is blank
  ]),

  // --- 16:9 layouts (optimized for Windows / most webcams) ---

  // 13: wide-1 — single 16:9 photo on landscape canvas
  createLayout('wide-1', '1 Photo', 1, 900, 600, 16, 9, [
    { x: 40, y: 70, w: 820, h: 461 }
  ]),

  // 14: wide-2v — 2 photos stacked, 16:9 each
  createLayout('wide-2v', '2 Photos', 2, 600, 700, 16, 9, [
    { x: 30, y: 30, w: 540, h: 304 },
    { x: 30, y: 366, w: 540, h: 304 }
  ]),

  // 15: wide-3v — 3 photos stacked, 16:9 each
  createLayout('wide-3v', '3 Photos', 3, 600, 1000, 16, 9, [
    { x: 30, y: 22, w: 540, h: 304 },
    { x: 30, y: 348, w: 540, h: 304 },
    { x: 30, y: 674, w: 540, h: 304 }
  ]),

  // 16: wide-4v — 4 photos stacked, 16:9 each (Windows classic strip)
  createLayout('wide-4v', '4 Photos', 4, 600, 1320, 16, 9, [
    { x: 30, y: 20, w: 540, h: 304 },
    { x: 30, y: 344, w: 540, h: 304 },
    { x: 30, y: 668, w: 540, h: 304 },
    { x: 30, y: 992, w: 540, h: 304 }
  ]),

  // 17: wide-4g — 2x2 grid, 16:9 each
  createLayout('wide-4g', '4 Photos', 4, 1200, 720, 16, 9, [
    { x: 30, y: 30, w: 560, h: 315 },
    { x: 610, y: 30, w: 560, h: 315 },
    { x: 30, y: 375, w: 560, h: 315 },
    { x: 610, y: 375, w: 560, h: 315 }
  ])
];

export const getDefaultLayout = () => GRID_LAYOUTS[5]; // strip-4v

export function parseCameraRatio(ratioStr: string): number {
  const [a, b] = ratioStr.split('/').map(s => parseFloat(s.trim()));
  return a / b;
}

export function getBestLayoutIds(webcamRatio: number): string[] {
  const diffs = GRID_LAYOUTS.map(layout => ({
    id: layout.id,
    diff: Math.abs(webcamRatio - parseCameraRatio(layout.cameraRatio))
  }));
  const minDiff = Math.min(...diffs.map(d => d.diff));
  return diffs.filter(d => d.diff - minDiff < 0.001).map(d => d.id);
}

// Among best-matching layouts, pick the most photobooth-like default
export function getDefaultLayoutForRatio(webcamRatio: number): DetailedGridLayout {
  const bestIds = getBestLayoutIds(webcamRatio);
  // Prefer 4-shot vertical strips as the canonical photobooth default
  const priority = ['wide-4v', 'strip-4v'];
  for (const id of priority) {
    if (bestIds.includes(id)) return GRID_LAYOUTS.find(l => l.id === id)!;
  }
  return GRID_LAYOUTS.find(l => l.id === bestIds[0]) ?? GRID_LAYOUTS[5];
}
