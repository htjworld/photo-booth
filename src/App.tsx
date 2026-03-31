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
  const [shotCount, setShotCount] = useState(1);
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
    setStep('shooting');
  };

  const handleGoResult = () => {
    stopCamera();
    setStep('result');
  };

  const handleRetakeAll = () => {
    resetCapture();
    startCamera();
    setStep('shooting');
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
        onRetake={handleRetakeAll}
      />
    );
  }

  // ── Shooting step ──────────────────────────────────────────────
  return (
    <div
      className="relative flex flex-col h-full overflow-hidden bg-black"
    >
      <LangToggle />

      {/* Glow overlay */}
      {glowVisible && <div className={glowActive ? 'glow-overlay' : 'glow-overlay-exit'} />}

      {/* Flash overlay */}
      {showFlash && <div className="flash-overlay" />}

      {/* Glow button — fixed bottom-left */}
      <div className="fixed bottom-6 left-4 z-50">
        <GlowButton active={glowActive} onToggle={handleGlowToggle} />
      </div>

      {/* Timer — top center */}
      <div className="flex justify-center pt-4 pb-2 shrink-0">
        <TimerSelector selected={timer} onChange={setTimer} disabled={isCapturing} />
      </div>

      {/* Main area: camera + sidebar */}
      <div className="flex flex-1 min-h-0 gap-3 px-3 pb-2">
        {/* Camera — fills all available space */}
        <div className="flex-1 min-w-0 flex items-center justify-center">
          {cameraError ? (
            <div className="w-full h-full flex flex-col gap-3 items-center justify-center bg-neutral-900 border border-neutral-800 rounded-md text-red-400 p-8 text-center">
              <span className="text-3xl">📷</span>
              <p>{t.cameraError}</p>
              <p className="text-sm opacity-70">{t.cameraErrorHint}</p>
            </div>
          ) : (
            <CameraView
              videoRef={videoRef}
              stream={stream}
              countdown={countdown}
              showFlash={showFlash}
              onRatioDetected={setWebcamRatio}
            />
          )}
        </div>

        {/* Sidebar: shot count + slots */}
        <div className="flex items-center py-2">
          <ShotSidebar
            shotCount={shotCount}
            onShotCountChange={setShotCount}
            capturedShots={capturedShots}
            onRetake={i => startSequence(i)}
            isCapturing={isCapturing}
            webcamRatio={webcamRatio}
          />
        </div>
      </div>

      {/* Bottom: Shoot / Done */}
      <div className="flex justify-center items-center gap-4 py-4 shrink-0">
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
