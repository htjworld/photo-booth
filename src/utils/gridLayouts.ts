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
  createLayout('film-1', '사진 1장', 1, 600, 900, 3, 4, [
    { x: 50, y: 150, w: 500, h: 600 }
  ]),
  // 2: wide-2h
  createLayout('wide-2h', '사진 2장', 2, 1200, 800, 3, 4, [
    { x: 60, y: 60, w: 510, h: 680 },
    { x: 630, y: 60, w: 510, h: 680 }
  ]),
  // 3: strip-2v
  createLayout('strip-2v', '사진 2장', 2, 600, 1200, 4, 3, [
    { x: 50, y: 50, w: 500, h: 375 },
    { x: 50, y: 475, w: 500, h: 375 }
  ]),
  // 4: strip-3v
  createLayout('strip-3v', '사진 3장', 3, 400, 1200, 4, 3, [
    { x: 30, y: 30, w: 340, h: 255 },
    { x: 30, y: 315, w: 340, h: 255 },
    { x: 30, y: 600, w: 340, h: 255 }
  ]),
  // 5: wide-3h
  createLayout('wide-3h', '사진 3장', 3, 1200, 600, 3, 4, [
    { x: 40, y: 40, w: 346, h: 462 },
    { x: 426, y: 40, w: 346, h: 462 },
    { x: 812, y: 40, w: 346, h: 462 }
  ]),
  // 6: strip-4v
  // Classic vertical photobooth
  createLayout('strip-4v', '사진 4장', 4, 400, 1200, 4, 3, [
    { x: 20, y: 20, w: 360, h: 270 },
    { x: 20, y: 310, w: 360, h: 270 },
    { x: 20, y: 600, w: 360, h: 270 },
    { x: 20, y: 890, w: 360, h: 270 }
  ]),
  // 7: grid-4
  // 2x2 square (window frame)
  createLayout('grid-4', '사진 4장', 4, 800, 800, 4, 3, [
    { x: 30, y: 30, w: 355, h: 266 },
    { x: 415, y: 30, w: 355, h: 266 },
    { x: 30, y: 326, w: 355, h: 266 },
    { x: 415, y: 326, w: 355, h: 266 } // Centered tightly in the square
  ]),
  // 8: left-4
  // Strip aligned left, empty space on right
  createLayout('left-4', '사진 4장', 4, 800, 1200, 4, 3, [
    { x: 40, y: 40, w: 340, h: 255 },
    { x: 40, y: 335, w: 340, h: 255 },
    { x: 40, y: 630, w: 340, h: 255 },
    { x: 40, y: 925, w: 340, h: 255 }
  ]),
  // 9: right-4
  createLayout('right-4', '사진 4장', 4, 800, 1200, 4, 3, [
    { x: 420, y: 40, w: 340, h: 255 },
    { x: 420, y: 335, w: 340, h: 255 },
    { x: 420, y: 630, w: 340, h: 255 },
    { x: 420, y: 925, w: 340, h: 255 }
  ]),
  // 10: wide-4h
  createLayout('wide-4h', '사진 4장', 4, 1600, 600, 3, 4, [
    { x: 40, y: 40, w: 350, h: 466 },
    { x: 430, y: 40, w: 350, h: 466 },
    { x: 820, y: 40, w: 350, h: 466 },
    { x: 1210, y: 40, w: 350, h: 466 }
  ]),
  // 11: tall-4
  // 2 col, 2 row, portrait result
  createLayout('tall-4', '사진 4장', 4, 800, 1200, 4, 5, [
    { x: 40, y: 40, w: 340, h: 425 },
    { x: 420, y: 40, w: 340, h: 425 },
    { x: 40, y: 505, w: 340, h: 425 },
    { x: 420, y: 505, w: 340, h: 425 }
  ]),
  // 12: strip-4b
  // Big gap at bottom for date/text
  createLayout('strip-4b', '사진 4장', 4, 400, 1400, 4, 3, [
    { x: 20, y: 20, w: 360, h: 270 },
    { x: 20, y: 310, w: 360, h: 270 },
    { x: 20, y: 600, w: 360, h: 270 },
    { x: 20, y: 890, w: 360, h: 270 } // bottom 240px is blank
  ])
];

export const getDefaultLayout = () => GRID_LAYOUTS[5]; // strip-4v
