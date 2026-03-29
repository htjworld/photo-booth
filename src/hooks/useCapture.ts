import { useState, useCallback } from 'react';
import { CapturedShot } from '../types';

export function useCapture(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  totalShots: number,
  timerSeconds: number
) {
  const [capturedShots, setCapturedShots] = useState<CapturedShot[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  
  const captureFrame = useCallback(async () => {
    if (!videoRef.current) return null;

    // Flash first, then capture
    setShowFlash(true);
    await new Promise(res => setTimeout(res, 80));

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) { setShowFlash(false); return null; }

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    setTimeout(() => setShowFlash(false), 280);

    return dataUrl;
  }, [videoRef]);

  const startSequence = useCallback(async (retakeIndex: number | null = null) => {
    if (isCapturing) return;
    setIsCapturing(true);

    const runCountdown = async () => {
      for (let i = timerSeconds; i > 0; i--) {
        setCountdown(i);
        await new Promise(res => setTimeout(res, 1000));
      }
      setCountdown(null);
    };

    if (retakeIndex !== null) {
      await runCountdown();
      const dataUrl = await captureFrame();
      if (dataUrl) {
        setCapturedShots(prev => {
          const newShots = [...prev];
          newShots[retakeIndex] = { id: Date.now().toString(), dataUrl };
          return newShots;
        });
      }
    } else {
      setCapturedShots([]);
      for (let i = 0; i < totalShots; i++) {
        await runCountdown();
        const dataUrl = await captureFrame();
        if (dataUrl) {
          setCapturedShots(prev => [...prev, { id: Date.now().toString() + i, dataUrl }]);
        }
        await new Promise(res => setTimeout(res, 500));
      }
    }

    setIsCapturing(false);
  }, [isCapturing, timerSeconds, totalShots, captureFrame]);

  const resetCapture = useCallback(() => {
    setCapturedShots([]);
    setIsCapturing(false);
    setCountdown(null);
  }, []);

  return {
    capturedShots,
    isCapturing,
    countdown,
    showFlash,
    startSequence,
    resetCapture
  };
}
