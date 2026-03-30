import { DetailedGridLayout, GRID_LAYOUTS, getBestLayoutIds, parseCameraRatio } from '../../utils/gridLayouts';
import { X } from 'lucide-react';
import { useLang } from '../../LangContext';

interface GridModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLayout: DetailedGridLayout;
  onSelect: (layout: DetailedGridLayout) => void;
  webcamRatio: number | null;
}

export function GridModal({ isOpen, onClose, selectedLayout, onSelect, webcamRatio }: GridModalProps) {
  const { t } = useLang();
  if (!isOpen) return null;

  const bestIds = webcamRatio !== null ? getBestLayoutIds(webcamRatio) : [];

  // Sort layouts by closeness to webcam ratio (best first), stable within same diff
  const sorted = webcamRatio !== null
    ? [...GRID_LAYOUTS].sort((a, b) => {
        const da = Math.abs(webcamRatio - parseCameraRatio(a.cameraRatio));
        const db = Math.abs(webcamRatio - parseCameraRatio(b.cameraRatio));
        if (Math.abs(da - db) < 0.001) return GRID_LAYOUTS.indexOf(a) - GRID_LAYOUTS.indexOf(b);
        return da - db;
      })
    : GRID_LAYOUTS;

  const optimalLayouts = sorted.filter(l => bestIds.includes(l.id));
  const otherLayouts = sorted.filter(l => !bestIds.includes(l.id));

  const renderGrid = (layouts: typeof GRID_LAYOUTS) => layouts.map((layout) => {
    const isSelected = selectedLayout.id === layout.id;
    const isBest = bestIds.includes(layout.id);
    return (
      <button
        key={layout.id}
        onClick={() => { onSelect(layout); onClose(); }}
        className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
          isSelected ? 'border-pink-500 bg-pink-50 scale-[1.02]' : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 active:scale-95'
        }`}
      >
        <div
          className="flex items-center justify-center rounded-sm mb-3 shadow-[0_0_0_1px_rgba(0,0,0,0.1)] relative"
          style={{ width: '40px', aspectRatio: layout.aspectRatio }}
        >
          {layout.slots.map((slot, i) => (
            <div
              key={i}
              className="absolute bg-neutral-400"
              style={{
                left: `${(slot.x / layout.width) * 100}%`,
                top: `${(slot.y / layout.height) * 100}%`,
                width: `${(slot.w / layout.width) * 100}%`,
                height: `${(slot.h / layout.height) * 100}%`
              }}
            />
          ))}
        </div>
        <span className={`text-xs ${isSelected ? 'text-pink-600 font-semibold' : 'text-neutral-500'}`}>
          {t.layoutNames[layout.name] ?? layout.name}
        </span>
        {isBest && (
          <span className="mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700">
            {t.optimal}
          </span>
        )}
      </button>
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity" onClick={onClose}>
      <div
        className="bg-white text-black p-6 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{t.gridTitle}</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {webcamRatio !== null ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-xs font-semibold text-teal-600 shrink-0">{t.bestForWebcam}</span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {renderGrid(optimalLayouts)}
            </div>

            {otherLayouts.length > 0 && (
              <>
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-neutral-200" />
                  <span className="text-xs font-semibold text-neutral-400 shrink-0">{t.other}</span>
                  <div className="flex-1 h-px bg-neutral-200" />
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {renderGrid(otherLayouts)}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {renderGrid(sorted)}
          </div>
        )}
      </div>
    </div>
  );
}
