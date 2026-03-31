import { useState, useEffect, useRef } from 'react';
import { Step, TimerOption, LetterData } from './types';
import { useCamera } from './hooks/useCamera';
import { useCapture } from './hooks/useCapture';
import { CameraView } from './components/shooting/CameraView';
import { ShotSidebar } from './components/shooting/ShotSidebar';
import { TimerSelector } from './components/shooting/TimerSelector';
import { GlowButton } from './components/ui/GlowButton';
import { ShootButton } from './components/ui/ShootButton';
import { LetterScreen } from './components/letter/LetterScreen';
import { CardReveal } from './components/result/CardReveal';
import { LangToggle } from './components/ui/LangToggle';
import { useLang } from './LangContext';

function App() {
  const { t } = useLang();
  const [step, setStep] = useState<Step>('letter');
  const [letter, setLetter] = useState<LetterData>({ to: '', message: '', from: '' });
  const [timer, setTimer] = useState<TimerOption>(3);
  const [shotCount, setShotCount] = useState(4);
  const [webcamRatio, setWebcamRatio] = useState<number | null>(null);

  // Glow
  const [glowActive, setGlowActive] = useState(false);
  const [glowVisible, setGlowVisible] = useState(false);
  const glowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleGlowToggle = () => {
    if (!glowActive) {
      if (glowTimer.current) clearTimeout(glowTimer.current);
      setGlowActive(true);
      setGlowVisible(true);
    } else {
      setGlowActive(false);
      glowTimer.current = setTimeout(() => setGlowVisible(false), 800);
    }
  };

  const { videoRef, stream, error: cameraError, startCamera, stopCamera } = useCamera();
  const {
    capturedShots,
    isCapturing,
    countdown,
    showFlash,
    startSequence,
    resetCapture,
  } = useCapture(videoRef, shotCount, timer);

  // Reset shots when shotCount changes
  useEffect(() => {
    resetCapture();
  }, [shotCount, resetCapture]);

  const isComplete = capturedShots.length === shotCount;

  const handleStart = (data: LetterData) => {
    setLetter(data);
    startCamera();
    setStep('shooting');
  };

  const handleGoResult = () => {
    stopCamera();
    setStep('result');
  };

  const handleStartOver = () => {
    resetCapture();
    setLetter({ to: '', message: '', from: '' });
    setStep('letter');
  };

  // ── Letter step ────────────────────────────────────────────────
  if (step === 'letter') {
    return <LetterScreen onStart={handleStart} />;
  }

  // ── Result step ────────────────────────────────────────────────
  if (step === 'result') {
    return (
      <CardReveal
        letter={letter}
        shots={capturedShots}
        webcamRatio={webcamRatio}
        onRetake={handleStartOver}
      />
    );
  }

  // ── Shooting step ──────────────────────────────────────────────
  return (
    <div className="relative h-full overflow-hidden bg-black">
      {/* Glow overlay */}
      {glowVisible && <div className={glowActive ? 'glow-overlay' : 'glow-overlay-exit'} />}

      {/* Flash overlay */}
      {showFlash && <div className="flash-overlay" />}

      {/* Full-screen camera */}
      {cameraError ? (
        <div className="absolute inset-0 flex flex-col gap-3 items-center justify-center bg-neutral-900 text-red-400 p-8 text-center">
          <span className="text-3xl">📷</span>
          <p>{t.cameraError}</p>
          <p className="text-sm opacity-70">{t.cameraErrorHint}</p>
        </div>
      ) : (
        <div className="absolute inset-0">
          <CameraView
            videoRef={videoRef}
            stream={stream}
            countdown={countdown}
            showFlash={showFlash}
            onRatioDetected={setWebcamRatio}
          />
        </div>
      )}

      {/* LangToggle */}
      <LangToggle />

      {/* Glow button — fixed bottom-left */}
      <div className="fixed bottom-6 left-4 z-50">
        <GlowButton active={glowActive} onToggle={handleGlowToggle} />
      </div>

      {/* Top center: timer */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pt-3 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <TimerSelector selected={timer} onChange={setTimer} disabled={isCapturing} />
        </div>
      </div>

      {/* Right side: sidebar */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
        <ShotSidebar
          shotCount={shotCount}
          onShotCountChange={setShotCount}
          capturedShots={capturedShots}
          onRetake={i => startSequence(i)}
          isCapturing={isCapturing}
          webcamRatio={webcamRatio}
        />
      </div>

      {/* Bottom: Shoot / Done */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4 z-20">
        {(!isComplete || isCapturing) && (
          <ShootButton onClick={() => startSequence()} disabled={isCapturing || !!cameraError} />
        )}
        {isComplete && !isCapturing && (
          <button
            onClick={handleGoResult}
            className="px-8 py-4 rounded-full text-lg font-bold bg-[#BDEFFC] text-neutral-900 hover:bg-[#A8E5F5] transition-colors shadow-[0_0_20px_rgba(189,239,252,0.5)] active:scale-95"
          >
            {t.checkResult}
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
