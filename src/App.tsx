import React, { useState, useEffect, useRef } from 'react';
import { Step, TimerOption, FrameType, FilterType } from './types';
import { getDefaultLayout, DetailedGridLayout } from './utils/gridLayouts';
import { useCamera } from './hooks/useCamera';
import { useCapture } from './hooks/useCapture';
import { CameraView } from './components/shooting/CameraView';
import { ShotSidebar } from './components/shooting/ShotSidebar';
import { TimerSelector } from './components/shooting/TimerSelector';
import { GridModal } from './components/shooting/GridModal';
import { GlowButton } from './components/ui/GlowButton';
import { ShootButton } from './components/ui/ShootButton';
import { LayoutGrid } from 'lucide-react';
import { EditPanel } from './components/result/EditPanel';
import { ResultCanvas, ResultCanvasHandle } from './components/result/ResultCanvas';

function App() {
  const [step, setStep] = useState<Step>('shooting');
  const [layout, setLayout] = useState<DetailedGridLayout>(getDefaultLayout());
  const [timer, setTimer] = useState<TimerOption>(3);
  const [glowActive, setGlowActive] = useState(false);
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);
  
  const { videoRef, error: cameraError } = useCamera();
  const {
    capturedShots,
    isCapturing,
    countdown,
    showFlash,
    startSequence,
    resetCapture,
  } = useCapture(videoRef, layout.shots, timer);

  // Result State
  const [shotOrder, setShotOrder] = useState<number[]>([]);
  const [frameType, setFrameType] = useState<FrameType>('spectrum');
  const [frameColor, setFrameColor] = useState<string>('#eb34a8'); // default pink
  const [filter, setFilter] = useState<FilterType>('original');
  const [mirrorAll, setMirrorAll] = useState<boolean>(true); // user wanted mirror by default
  const [watermarkDate, setWatermarkDate] = useState<boolean>(false);
  const resultCanvasRef = useRef<ResultCanvasHandle>(null);

  const handleShoot = () => startSequence();
  const handleRetake = (index: number) => startSequence(index);
  
  useEffect(() => {
    resetCapture();
  }, [layout.id, resetCapture]);

  const isComplete = capturedShots.length === layout.shots;

  const handleGoResult = () => {
    setShotOrder(capturedShots.map((_, i) => i));
    setStep('result');
  };

  const handleRetakeAll = () => {
    resetCapture();
    setStep('shooting');
  };

  const handleDownload = () => {
    resultCanvasRef.current?.download();
  };
  
  if (step === 'shooting') {
    return (
      <div className="flex flex-col h-full mx-auto max-w-[1400px] px-4 py-8">
        <div className="flex justify-center mb-6">
          <TimerSelector selected={timer} onChange={setTimer} disabled={isCapturing} />
        </div>
        
        <div className="flex flex-col sm:flex-row flex-1 min-h-0 gap-6 lg:gap-12 items-center sm:items-stretch justify-center">
          
          <div className="flex sm:flex-col gap-4 order-3 sm:order-1 sm:mt-0 mt-4 sm:justify-center">
            <button
              onClick={() => setIsGridModalOpen(true)}
              disabled={isCapturing}
              className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-neutral-700 bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:border-neutral-600 transition-all w-20 h-20 disabled:opacity-50"
            >
              <LayoutGrid size={28} />
              <span className="text-xs mt-2 font-medium break-keep">그리드</span>
            </button>
            <GlowButton active={glowActive} onToggle={() => setGlowActive(!glowActive)} />
          </div>

          <div className="flex-1 w-full max-w-3xl h-full order-1 sm:order-2 flex flex-col items-center justify-center">
            {cameraError ? (
              <div className="w-full h-full flex flex-col gap-3 items-center justify-center bg-neutral-900 border border-neutral-800 rounded-md text-red-400 p-8 text-center">
                <span className="text-3xl">📷</span>
                <p>카메라 접근 권한이 필요합니다.</p>
                <p className="text-sm opacity-70">브라우저 설정에서 권한을 허용해주세요.</p>
              </div>
            ) : (
              <CameraView 
                videoRef={videoRef} layout={layout} glowActive={glowActive} 
                countdown={countdown} showFlash={showFlash} 
              />
            )}
            
            <div className="mt-8 flex items-center gap-4 h-[60px]">
              {(!isComplete || isCapturing) && (
                <ShootButton onClick={handleShoot} disabled={isCapturing || !!cameraError} />
              )}
              {isComplete && !isCapturing && (
                <button 
                  onClick={handleGoResult}
                  className="px-8 py-4 rounded-full text-lg font-bold bg-white text-black hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10"
                >
                  결과 확인
                </button>
              )}
            </div>
          </div>

          <div className="order-2 sm:order-3 flex items-center sm:justify-center overflow-auto sm:overflow-visible w-full sm:w-auto h-[120px] sm:h-auto pb-2 sm:pb-0 shrink-0">
            <ShotSidebar layout={layout} capturedShots={capturedShots} onRetake={handleRetake} isCapturing={isCapturing} />
          </div>
        </div>

        <GridModal 
          isOpen={isGridModalOpen} onClose={() => setIsGridModalOpen(false)} 
          selectedLayout={layout} onSelect={setLayout} 
        />
      </div>
    );
  }

  // RESULT STEP
  return (
    <div className="flex flex-col sm:flex-row h-full mx-auto max-w-[1400px] gap-6 lg:gap-12 p-4 sm:p-6 lg:p-8 justify-center items-center sm:items-center overflow-hidden">
        
      <div className="flex-1 flex justify-center items-center min-w-0 min-h-0 w-full animate-in fade-in zoom-in-95 duration-500">
        <ResultCanvas 
          ref={resultCanvasRef}
          layout={layout}
          shots={capturedShots}
          shotOrder={shotOrder}
          frameType={frameType}
          frameColor={frameColor}
          filter={filter}
          mirrorAll={mirrorAll}
          watermarkDate={watermarkDate}
        />
      </div>

      <div className="animate-in fade-in slide-in-from-right-10 duration-500 w-full sm:w-auto flex justify-center h-full max-h-[850px]">
        <EditPanel 
          shots={capturedShots} shotOrder={shotOrder} setShotOrder={setShotOrder}
          frameType={frameType} setFrameType={setFrameType}
          frameColor={frameColor} setFrameColor={setFrameColor}
          filter={filter} setFilter={setFilter}
          mirrorAll={mirrorAll} setMirrorAll={setMirrorAll}
          watermarkDate={watermarkDate} setWatermarkDate={setWatermarkDate}
          onDownload={handleDownload} onRetake={handleRetakeAll}
        />
      </div>
      
    </div>
  );
}

export default App;
