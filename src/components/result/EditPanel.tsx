import { FrameType, FilterType, CapturedShot } from '../../types';
import { PhotoReorder } from './PhotoReorder';
import { FlipHorizontal, Download, Calendar } from 'lucide-react';
import { getSpectrumColors } from '../../utils/gradientGenerator';

interface EditPanelProps {
  shots: CapturedShot[];
  shotOrder: number[];
  setShotOrder: (order: number[]) => void;
  frameType: FrameType;
  setFrameType: (f: FrameType) => void;
  frameColor: string;
  setFrameColor: (c: string) => void;
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  mirrorAll: boolean;
  setMirrorAll: (m: boolean) => void;
  watermarkDate: boolean;
  setWatermarkDate: (w: boolean) => void;
  onDownload: () => void;
  onRetake: () => void;
}

const COLORS = [
  '#eb4034', '#eb8c34', '#ebd334', '#71eb34', '#34ebd6', '#3471eb', '#8c34eb', '#eb34a8', '#ffffff', '#000000'
];

export function EditPanel({
  shots, shotOrder, setShotOrder, frameType, setFrameType,
  frameColor, setFrameColor, filter, setFilter,
  mirrorAll, setMirrorAll, watermarkDate, setWatermarkDate, onDownload, onRetake
}: EditPanelProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-xs shrink-0 bg-neutral-950 p-6 rounded-3xl border border-neutral-800/80 shadow-2xl h-full overflow-y-auto">
      
      <div>
        <h3 className="text-sm font-semibold text-neutral-400 mb-3 px-1">사진 순서 <span className="text-xs font-normal ml-1 opacity-70">(드래그)</span></h3>
        <PhotoReorder shots={shots} shotOrder={shotOrder} onChangeOrder={setShotOrder} />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-neutral-400 px-1">프레임 설정</h3>
        <div className="flex gap-2 p-1 bg-neutral-900 rounded-lg">
          <button 
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${frameType === 'spectrum' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-500 hover:text-white'}`}
            onClick={() => setFrameType('spectrum')}
          >
            Spectrum
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${frameType === 'solid' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-500 hover:text-white'}`}
            onClick={() => setFrameType('solid')}
          >
            Solid
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2">
          {COLORS.map(c => {
            const isSelected = frameColor === c;
            let previewStyle = {};
            if (frameType === 'spectrum') {
              const spec = getSpectrumColors(c);
              previewStyle = { background: `linear-gradient(-45deg, ${spec[0]}, ${spec[1]}, ${spec[2]})` };
            } else {
              previewStyle = { backgroundColor: c };
            }
            
            return (
              <button
                key={c}
                onClick={() => setFrameColor(c)}
                className={`w-9 h-9 rounded-full border-2 transition-transform shadow-sm ${isSelected ? 'border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)]' : 'border-neutral-700 hover:scale-110'}`}
                style={previewStyle}
              />
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-400 mb-3 px-1">필터 선택</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('original')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl border-2 transition-all ${filter === 'original' ? 'border-pink-500 bg-pink-500/10 text-pink-400' : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:border-neutral-700'}`}
          >
            오리지널
          </button>
          <button 
            onClick={() => setFilter('bw')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl border-2 transition-all ${filter === 'bw' ? 'border-neutral-300 bg-neutral-200 text-neutral-900 shadow-sm' : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:border-neutral-700'}`}
          >
            흑백 (B&W)
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-neutral-400 px-1">옵션</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMirrorAll(!mirrorAll)}
            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-colors ${mirrorAll ? 'bg-neutral-800 border-neutral-600 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'}`}
          >
            <FlipHorizontal size={20} />
            <span className="text-[11px] font-bold">전체 거울모드</span>
          </button>
          <button
            onClick={() => setWatermarkDate(!watermarkDate)}
            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-colors ${watermarkDate ? 'bg-neutral-800 border-neutral-600 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'}`}
          >
            <Calendar size={20} />
            <span className="text-[11px] font-bold">날짜 워터마크</span>
          </button>
        </div>
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-3">
        <button 
          onClick={onDownload}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg transition-transform active:scale-95 shadow-lg shadow-pink-500/20"
        >
          <Download size={20} className="mb-0.5" />
          다운로드 (PNG)
        </button>
        <button 
          onClick={onRetake}
          className="w-full py-3 rounded-xl bg-transparent border border-neutral-700 hover:bg-neutral-800 text-neutral-300 font-medium text-sm transition-colors"
        >
          처음부터 다시 찍기
        </button>
      </div>

    </div>
  );
}
