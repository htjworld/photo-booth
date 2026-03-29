import { CapturedShot } from '../../types';
import { DetailedGridLayout } from '../../utils/gridLayouts';

interface ShotSidebarProps {
  layout: DetailedGridLayout;
  capturedShots: CapturedShot[];
  onRetake: (index: number) => void;
  isCapturing: boolean;
}

export function ShotSidebar({ layout, capturedShots, onRetake, isCapturing }: ShotSidebarProps) {
  const slots = Array.from({ length: layout.shots });

  return (
    <div className="flex flex-col gap-3 w-24 sm:w-32 bg-neutral-900 border border-neutral-800 p-2 sm:p-4 rounded-xl overflow-y-auto">
      {slots.map((_, i) => {
        const shot = capturedShots[i];
        return (
          <div key={i} className="relative group" onClick={() => !isCapturing && shot && onRetake(i)}>
            <div 
              className={`w-full bg-neutral-800 rounded-md overflow-hidden relative transition-all ${
                !shot ? 'opacity-50 border-2 border-dashed border-neutral-600' : 'cursor-pointer hover:ring-2 ring-pink-500 ring-offset-2 ring-offset-neutral-900'
              }`}
              style={{ aspectRatio: layout.cameraRatio }}
            >
              {shot ? (
                <img 
                  src={shot.dataUrl} 
                  alt={`Slot ${i+1}`} 
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-neutral-600 text-xs sm:text-sm font-medium">
                  {i + 1}
                </div>
              )}
            </div>
            
            {shot && !isCapturing && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[11px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-10 w-fit">
                클릭하여 다시 촬영
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-pink-500" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
