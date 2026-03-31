import { CapturedShot } from '../../types';
import { useLang } from '../../LangContext';

interface ShotSidebarProps {
  shotCount: number;
  onShotCountChange: (n: number) => void;
  capturedShots: CapturedShot[];
  onRetake: (index: number) => void;
  isCapturing: boolean;
  webcamRatio: number | null;
}

export function ShotSidebar({
  shotCount,
  onShotCountChange,
  capturedShots,
  onRetake,
  isCapturing,
  webcamRatio,
}: ShotSidebarProps) {
  const { t } = useLang();
  const slots = Array.from({ length: shotCount });
  const slotAspect = webcamRatio ? `${webcamRatio} / 1` : '4 / 3';

  return (
    <div className="flex flex-col gap-3 w-20 sm:w-24 shrink-0">
      {/* Shot count buttons */}
      <div className="flex flex-col gap-1.5">
        {([1, 2, 3, 4] as const).map(n => (
          <button
            key={n}
            disabled={isCapturing}
            onClick={() => onShotCountChange(n)}
            className={`w-full py-1.5 rounded-lg text-sm font-bold transition-all border-2 ${
              shotCount === n
                ? 'bg-[#BDEFFC] border-[#BDEFFC] text-neutral-900 shadow-[0_0_12px_rgba(189,239,252,0.5)]'
                : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-neutral-500'
            } disabled:opacity-40`}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-700" />

      {/* Shot slots */}
      <div className="flex flex-col gap-2">
        {slots.map((_, i) => {
          const shot = capturedShots[i];
          return (
            <div
              key={i}
              className="relative group cursor-pointer"
              onClick={() => !isCapturing && shot && onRetake(i)}
            >
              <div
                className={`w-full bg-neutral-800 rounded-md overflow-hidden transition-all ${
                  !shot
                    ? 'opacity-40 border-2 border-dashed border-neutral-600'
                    : 'hover:ring-2 ring-[#BDEFFC] ring-offset-1 ring-offset-neutral-900'
                }`}
                style={{ aspectRatio: slotAspect }}
              >
                {shot ? (
                  <img src={shot.dataUrl} alt={`Shot ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-600 text-xs font-medium">
                    {i + 1}
                  </div>
                )}
                {shot && !isCapturing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-[9px] font-bold text-neutral-900 bg-[#BDEFFC] px-1.5 py-0.5 rounded-full text-center leading-tight">
                      {t.clickToRetake}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
