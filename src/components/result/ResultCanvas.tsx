import { useRef, useImperativeHandle, forwardRef } from 'react';
import { DetailedGridLayout } from '../../utils/gridLayouts';
import { CapturedShot, FilterType, FrameType } from '../../types';
import { useCanvasCompose } from '../../hooks/useCanvasCompose';

interface ResultCanvasProps {
  layout: DetailedGridLayout;
  shots: CapturedShot[];
  shotOrder: number[];
  frameType: FrameType;
  frameColor: string;
  filter: FilterType;
  mirrorAll: boolean;
  watermarkDate: boolean;
}

export interface ResultCanvasHandle {
  download: () => void;
}

export const ResultCanvas = forwardRef<ResultCanvasHandle, ResultCanvasProps>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useCanvasCompose({
    canvasRef,
    ...props
  });

  useImperativeHandle(ref, () => ({
    download: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png'); // Lossless PNG
      const a = document.createElement('a');
      a.href = dataUrl;
      const d = new Date();
      const dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
      a.download = `photobooth_${dateStr}.png`;
      a.click();
    }
  }));

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div 
        className="relative shadow-[0_0_50px_rgba(0,0,0,0.6)] ring-1 ring-white/10 rounded-lg overflow-hidden flex items-center justify-center" 
        style={{ aspectRatio: props.layout.aspectRatio, maxHeight: 'calc(100vh - 40px)', maxWidth: '100%' }}
      >
        <canvas
          ref={canvasRef}
          className="bg-neutral-900 max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
});
