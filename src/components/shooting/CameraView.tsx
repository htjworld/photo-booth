import { useEffect } from 'react';
import { DetailedGridLayout } from '../../utils/gridLayouts';
import { CountdownOverlay } from './CountdownOverlay';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  layout: DetailedGridLayout;
  countdown: number | null;
  showFlash: boolean;
  onRatioDetected?: (ratio: number) => void;
}

export function CameraView({ videoRef, stream, layout, countdown, showFlash, onRatioDetected }: CameraViewProps) {
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <div className="relative flex justify-center items-center w-full h-full max-h-[80vh] p-4">
      <div
        className="relative overflow-hidden rounded-md transition-all duration-300 ease-in-out bg-neutral-900 border border-neutral-800 shadow-2xl"
        style={{ aspectRatio: layout.cameraRatio, maxHeight: '100%', maxWidth: '100%' }}
      >
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
