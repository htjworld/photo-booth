import { useEffect } from 'react';
import { CountdownOverlay } from './CountdownOverlay';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  countdown: number | null;
  showFlash: boolean;
  onRatioDetected?: (ratio: number) => void;
}

export function CameraView({ videoRef, stream, countdown, showFlash, onRatioDetected }: CameraViewProps) {
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full h-full overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl">
        <video
          ref={videoRef}
          className="w-full h-full object-cover scale-x-[-1]"
          autoPlay
          playsInline
          muted
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            if (v.videoWidth && v.videoHeight) {
              onRatioDetected?.(v.videoWidth / v.videoHeight);
            }
          }}
        />
        <CountdownOverlay countdown={countdown} showFlash={showFlash} />
      </div>
    </div>
  );
}
