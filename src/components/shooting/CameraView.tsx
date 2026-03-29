import { cn } from '../../lib/utils';
import { DetailedGridLayout } from '../../utils/gridLayouts';
import { CountdownOverlay } from './CountdownOverlay';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  layout: DetailedGridLayout;
  glowActive: boolean;
  countdown: number | null;
  showFlash: boolean;
}

export function CameraView({ videoRef, layout, glowActive, countdown, showFlash }: CameraViewProps) {
  return (
    <div className="relative flex justify-center items-center w-full h-full max-h-[80vh] p-4">
      <div 
        className={cn(
          "relative overflow-hidden rounded-md transition-all duration-300 ease-in-out bg-neutral-900 border border-neutral-800 shadow-2xl",
          glowActive && "glow-active"
        )}
        style={{ aspectRatio: layout.cameraRatio, maxHeight: '100%', maxWidth: '100%' }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover scale-x-[-1]"
          autoPlay
          playsInline
          muted
        />
        <CountdownOverlay countdown={countdown} showFlash={showFlash} />
      </div>
    </div>
  );
}
