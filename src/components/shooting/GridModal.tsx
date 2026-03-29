import { DetailedGridLayout, GRID_LAYOUTS } from '../../utils/gridLayouts';
import { X } from 'lucide-react';

interface GridModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLayout: DetailedGridLayout;
  onSelect: (layout: DetailedGridLayout) => void;
}

export function GridModal({ isOpen, onClose, selectedLayout, onSelect }: GridModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity">
      <div 
        className="bg-white text-black p-6 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">그리드</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {GRID_LAYOUTS.map((layout) => {
            const isSelected = selectedLayout.id === layout.id;
            return (
              <button
                key={layout.id}
                onClick={() => {
                  onSelect(layout);
                  onClose();
                }}
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
                  {layout.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
