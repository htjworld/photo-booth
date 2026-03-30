import { useEffect, useRef } from 'react';
import { DetailedGridLayout } from '../utils/gridLayouts';
import { CapturedShot, FilterType, FrameType } from '../types';
import { getSpectrumColors } from '../utils/gradientGenerator';

interface ComposeProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  layout: DetailedGridLayout;
  shots: CapturedShot[];
  shotOrder: number[];
  frameType: FrameType;
  frameColor: string;
  filter: FilterType;
  mirrorAll: boolean;
  watermarkDate: boolean;
}

export function useCanvasCompose({
  canvasRef, layout, shots, shotOrder, frameType, frameColor, filter, mirrorAll, watermarkDate
}: ComposeProps) {
  // Cache loaded images keyed by shot id — only reload when shots actually change
  const imgCache = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = layout.width;
    canvas.height = layout.height;

    if (frameType === 'solid') {
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      const bgWidth = canvas.width;
      const bgHeight = canvas.height;
      // Diagonal: top-left → bottom-right for natural gradient flow
      const grad = ctx.createLinearGradient(0, 0, bgWidth, bgHeight);
      const colors = getSpectrumColors(frameColor);
      grad.addColorStop(0, colors[0]);
      grad.addColorStop(0.5, colors[1]);
      grad.addColorStop(1, colors[2]);

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, bgWidth, bgHeight);
    }

    const loadImages = async () => {
      // Evict cache entries no longer in shots
      const currentIds = new Set(shots.map(s => s.id));
      for (const key of imgCache.current.keys()) {
        if (!currentIds.has(key)) imgCache.current.delete(key);
      }

      const imgElements = await Promise.all(shotOrder.map((originalIndex) => {
        const shot = shots[originalIndex];
        if (!shot) return Promise.resolve(null);

        // Return cached image if available
        if (imgCache.current.has(shot.id)) {
          return Promise.resolve(imgCache.current.get(shot.id)!);
        }

        return new Promise<HTMLImageElement | null>((resolve) => {
          const img = new Image();
          img.onload = () => { imgCache.current.set(shot.id, img); resolve(img); };
          img.onerror = () => resolve(null);
          img.src = shot.dataUrl;
        });
      }));

      layout.slots.forEach((slot, i) => {
        const img = imgElements[i];
        if (!img) {
          ctx.fillStyle = '#111111';
          ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
          return;
        }

        const imgRatio = img.width / img.height;
        const slotRatio = slot.w / slot.h;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (imgRatio > slotRatio) {
          sw = img.height * slotRatio;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / slotRatio;
          sy = (img.height - sh) / 2;
        }

        // Draw to offscreen canvas first for filter/mirror
        const offscreen = document.createElement('canvas');
        offscreen.width = slot.w;
        offscreen.height = slot.h;
        const offCtx = offscreen.getContext('2d')!;

        if (mirrorAll) {
          offCtx.translate(slot.w, 0);
          offCtx.scale(-1, 1);
        }
        offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, slot.w, slot.h);

        if (filter === 'bw') {
          const imageData = offCtx.getImageData(0, 0, slot.w, slot.h);
          const d = imageData.data;
          for (let j = 0; j < d.length; j += 4) {
            const lum = d[j] * 0.299 + d[j + 1] * 0.587 + d[j + 2] * 0.114;
            d[j] = d[j + 1] = d[j + 2] = lum;
          }
          offCtx.putImageData(imageData, 0, 0);
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(slot.x, slot.y, slot.w, slot.h);
        ctx.clip();
        ctx.drawImage(offscreen, slot.x, slot.y);
        ctx.restore();
      });

      if (watermarkDate) {
        ctx.save();
        const dateObj = new Date();
        const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth()+1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;

        // Vintage ink color: warm sepia on light bg, aged cream on dark bg
        let inkColor: string;
        if (frameType === 'solid') {
          const hx = frameColor.toLowerCase();
          const r = parseInt(hx.substr(1,2),16);
          const g = parseInt(hx.substr(3,2),16);
          const b = parseInt(hx.substr(5,2),16);
          const lum = (r*299 + g*587 + b*114)/1000;
          inkColor = lum < 128 ? 'rgba(210, 185, 150, 0.72)' : 'rgba(72, 42, 22, 0.52)';
        } else {
          // Gradient frames are always light pastels
          inkColor = 'rgba(72, 42, 22, 0.52)';
        }

        const fontSize = Math.max(16, Math.min(canvas.width, canvas.height) * 0.03);
        ctx.font = `${fontSize}px Georgia, "Times New Roman", serif`;
        ctx.fillStyle = inkColor;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(dateStr, canvas.width - canvas.width * 0.045, canvas.height - canvas.height * 0.025);
        ctx.restore();
      }
    };

    loadImages();

  }, [layout, shots, shotOrder, frameType, frameColor, filter, mirrorAll, watermarkDate]);

}
