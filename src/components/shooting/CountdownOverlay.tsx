
interface CountdownOverlayProps {
  countdown: number | null;
  showFlash: boolean;
}

export function CountdownOverlay({ countdown, showFlash }: CountdownOverlayProps) {
  return (
    <>
      {countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
          <span className="text-[120px] font-bold text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] animate-pulse">
            {countdown}
          </span>
        </div>
      )}
      {showFlash && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none opacity-80 transition-opacity duration-100" />
      )}
    </>
  );
}
