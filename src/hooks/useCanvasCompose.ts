import { useEffect } from 'react';
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
      const grad = ctx.createLinearGradient(bgWidth, 0, 0, bgHeight);
      const colors = getSpectrumColors(frameColor);
      grad.addColorStop(0, colors[0]);
      grad.addColorStop(0.5, colors[1]);
      grad.addColorStop(1, colors[2]);
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, bgWidth, bgHeight);
    }

    const loadImages = async () => {
      const imgElements = await Promise.all(shotOrder.map((originalIndex) => {
        return new Promise<HTMLImageElement | null>((resolve) => {
          const shot = shots[originalIndex];
          if (!shot) return resolve(null);
          const img = new Image();
          img.onload = () => resolve(img);
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

        ctx.save();
        
        if (filter === 'bw') {
          ctx.filter = 'grayscale(100%)';
        }

        ctx.beginPath();
        ctx.rect(slot.x, slot.y, slot.w, slot.h);
        ctx.clip();

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

        if (mirrorAll) {
          ctx.translate(slot.x + slot.w, slot.y);
          ctx.scale(-1, 1);
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, slot.w, slot.h);
        } else {
          ctx.drawImage(img, sx, sy, sw, sh, slot.x, slot.y, slot.w, slot.h);
        }
        
        ctx.restore();
      });

      if (watermarkDate) {
        ctx.save();
        const dateObj = new Date();
        const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth()+1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
        
        let lum = 255;
        if (frameType === 'solid') {
            const h = frameColor.toLowerCase();
            const r = parseInt(h.substr(1,2),16);
            const g = parseInt(h.substr(3,2),16);
            const b = parseInt(h.substr(5,2),16);
            lum = (r*299 + g*587 + b*114)/1000;
        }
        ctx.fillStyle = lum < 128 ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)';
        
        ctx.font = `bold ${Math.max(16, canvas.width * 0.02)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        // Date located at the bottom center with padding
        ctx.fillText(dateStr, canvas.width / 2, canvas.height - (canvas.height * 0.015));
        ctx.restore();
      }
    };

    loadImages();

  }, [layout, shots, shotOrder, frameType, frameColor, filter, mirrorAll, watermarkDate]);

}
