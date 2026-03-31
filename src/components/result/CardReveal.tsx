import { useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CapturedShot, FilterType, LetterData } from '../../types';
import { useLang } from '../../LangContext';

type ZoomState = 'none' | 'letter' | 'photo';

interface CardRevealProps {
  letter: LetterData;
  shots: CapturedShot[];
  webcamRatio: number | null;
  onRetake: () => void;
}

// ── Sortable photo item inside strip ────────────────────────────
function SortablePhotoSlot({
  shot,
  index,
  aspectRatio,
  filter,
}: {
  shot: CapturedShot | undefined;
  index: number;
  aspectRatio: string;
  filter: FilterType;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: index.toString(),
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-full rounded-md overflow-hidden bg-neutral-200 cursor-grab active:cursor-grabbing touch-none"
    >
      {shot ? (
        <img
          src={shot.dataUrl}
          alt={`Photo ${index + 1}`}
          className="w-full object-cover pointer-events-none"
          style={{
            aspectRatio,
            filter: filter === 'bw' ? 'grayscale(100%)' : 'none',
            display: 'block',
          }}
        />
      ) : (
        <div className="w-full bg-neutral-300" style={{ aspectRatio }} />
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export function CardReveal({ letter, shots, webcamRatio, onRetake }: CardRevealProps) {
  const { t } = useLang();
  const totalShots = shots.length;

  const [frameCount, setFrameCount] = useState(totalShots);
  const [order, setOrder] = useState<number[]>(() => shots.map((_, i) => i));
  const [filter, setFilter] = useState<FilterType>('original');
  const [zoom, setZoom] = useState<ZoomState>('none');
  const [isSaving, setIsSaving] = useState(false);

  const fullViewRef = useRef<HTMLDivElement>(null);
  const letterCardRef = useRef<HTMLDivElement>(null);
  const photoStripRef = useRef<HTMLDivElement>(null);

  const photoAspect = webcamRatio ? `${webcamRatio}` : '1.33';

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = order.indexOf(Number(active.id));
      const newIdx = order.indexOf(Number(over.id));
      setOrder(arrayMove(order, oldIdx, newIdx));
    }
  };

  const visibleOrder = order.slice(0, frameCount);
  const hiddenOrder = order.slice(frameCount);

  // Save
  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      let canvas: HTMLCanvasElement;

      if (zoom === 'letter' && letterCardRef.current) {
        // Save letter card — capture without rotation for clean output
        canvas = await html2canvas(letterCardRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          imageTimeout: 10000,
          backgroundColor: null,
          onclone: (_, el) => {
            el.style.transform = 'none';
            el.style.position = 'static';
            el.style.boxShadow = 'none';
          },
        });
      } else if (zoom === 'photo' && photoStripRef.current) {
        // Save photo strip — capture without rotation
        canvas = await html2canvas(photoStripRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          imageTimeout: 10000,
          backgroundColor: null,
          onclone: (_, el) => {
            el.style.transform = 'none';
            el.style.position = 'static';
            el.style.boxShadow = 'none';
          },
        });
      } else {
        // Save combined — capture full view with both cards
        if (!fullViewRef.current) return;
        canvas = await html2canvas(fullViewRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          imageTimeout: 10000,
          backgroundColor: '#FAF5E4',
        });
      }

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      const d = new Date();
      a.download = `photocard_${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}.png`;
      a.click();
    } finally {
      setIsSaving(false);
    }
  }, [zoom, isSaving]);

  const saveLabel =
    zoom === 'letter' ? t.saveLetter :
    zoom === 'photo'  ? t.savePhoto  :
    t.saveAll;

  const handleLetterClick = () => setZoom(z => z === 'letter' ? 'none' : 'letter');
  const handlePhotoClick  = () => setZoom(z => z === 'photo'  ? 'none' : 'photo');

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-6"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[#FAF5E4]/60 pointer-events-none" />

      {/* ── Cards area ── */}
      {/* Outer visible container: 480×620 */}
      <div className="relative z-10" style={{ width: 480, height: 620 }}>
        {/*
          fullViewRef: same size with padding so rotated cards aren't clipped.
          padding: 70px all sides; margin: -70px; content-box → captured size: 620×760
        */}
        <div
          ref={fullViewRef}
          className="relative"
          style={{
            width: 480,
            height: 620,
            padding: 70,
            margin: -70,
            boxSizing: 'content-box',
            background: 'transparent',
          }}
        >
          {/* ── Letter card ── */}
          <div
            ref={letterCardRef}
            onClick={handleLetterClick}
            className="absolute rounded-2xl shadow-xl overflow-hidden select-none"
            style={{
              width: 280,
              top: 30,
              left: 20,
              transform: zoom === 'letter'
                ? 'rotate(0deg) scale(1.1) translate(50px, 40px)'
                : zoom === 'photo'
                ? 'rotate(-14deg) scale(0.88) translateX(-10px)'
                : 'rotate(-10deg)',
              transition: 'transform 0.4s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.4s ease',
              zIndex: zoom === 'letter' ? 10 : zoom === 'photo' ? 1 : 3,
              boxShadow: zoom === 'letter'
                ? '0 16px 40px rgba(0,0,0,0.25)'
                : '0 4px 16px rgba(0,0,0,0.14)',
              cursor: zoom === 'photo' ? 'default' : 'pointer',
            }}
          >
            {/* Background image via <img> so html2canvas renders it correctly */}
            <img
              src="/paper-card.jpg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            {/* Content */}
            <div className="relative" style={{ zIndex: 1, padding: '22px 24px 26px' }}>
              <p style={{ fontFamily: 'Italianno, serif', fontSize: 34, color: '#3B9BB8', marginBottom: 10, textAlign: 'center' }}>
                With love
              </p>
              {letter.to && (
                <p style={{ fontFamily: 'Ownglyph_ParkDaHyun, sans-serif', fontSize: 16, color: '#555', marginBottom: 6 }}>
                  {letter.to}에게
                </p>
              )}
              {letter.message && (
                <p style={{ fontFamily: 'Ownglyph_ParkDaHyun, sans-serif', fontSize: 16, color: '#333', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 8 }}>
                  {letter.message}
                </p>
              )}
              {letter.from && (
                <p style={{ fontFamily: 'Ownglyph_ParkDaHyun, sans-serif', fontSize: 14, color: '#777', textAlign: 'right' }}>
                  from. {letter.from}
                </p>
              )}
            </div>
          </div>

          {/* ── Photo strip card ── */}
          <div
            ref={photoStripRef}
            onClick={handlePhotoClick}
            className="absolute rounded-xl shadow-xl overflow-hidden select-none"
            style={{
              width: 230,
              top: 80,
              left: 220,
              transform: zoom === 'photo'
                ? 'rotate(0deg) scale(1.1) translate(-30px, 20px)'
                : zoom === 'letter'
                ? 'rotate(10deg) scale(0.88) translateX(10px)'
                : 'rotate(6deg)',
              transition: 'transform 0.4s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.4s ease',
              zIndex: zoom === 'photo' ? 10 : zoom === 'letter' ? 1 : 4,
              boxShadow: zoom === 'photo'
                ? '0 16px 40px rgba(0,0,0,0.25)'
                : '0 6px 20px rgba(0,0,0,0.18)',
              cursor: zoom === 'letter' ? 'default' : 'pointer',
            }}
          >
            {/* Background image via <img> */}
            <img
              src="/photocard-color.jpg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            {/* Content */}
            <div className="relative" style={{ zIndex: 1, padding: '14px 16px 18px' }}>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={visibleOrder.map(i => i.toString())} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col gap-2">
                    {visibleOrder.map((originalIdx) => (
                      <SortablePhotoSlot
                        key={originalIdx}
                        shot={shots[originalIdx]}
                        index={originalIdx}
                        aspectRatio={photoAspect}
                        filter={filter}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              <p style={{ fontFamily: 'Italianno, serif', fontSize: 20, color: '#3B9BB8', textAlign: 'center', marginTop: 10 }}>
                With love
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-xs">

        {/* Frame count selector */}
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: 15, color: '#555' }}>
            {t.frameLabel}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalShots }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setFrameCount(n)}
                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all border-2 ${
                  frameCount === n
                    ? 'bg-[#BDEFFC] border-[#BDEFFC] text-neutral-900 shadow-[0_0_10px_rgba(189,239,252,0.5)]'
                    : 'bg-white/60 border-neutral-300 text-neutral-600 hover:border-[#BDEFFC]'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Excluded photos indicator */}
        {hiddenOrder.length > 0 && (
          <div className="flex gap-1.5 items-center">
            <span className="text-xs text-neutral-500" style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic' }}>
              excluded:
            </span>
            {hiddenOrder.map(idx => (
              <img
                key={idx}
                src={shots[idx]?.dataUrl}
                className="w-8 h-8 rounded object-cover opacity-30 ring-1 ring-neutral-400"
              />
            ))}
          </div>
        )}

        {/* Filter toggle */}
        <div className="flex bg-white/60 backdrop-blur-sm rounded-full p-1 border border-neutral-300">
          <button
            onClick={() => setFilter('original')}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
              filter === 'original' ? 'bg-[#BDEFFC] text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {t.original}
          </button>
          <button
            onClick={() => setFilter('bw')}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
              filter === 'bw' ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {t.bw}
          </button>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-3.5 rounded-2xl font-bold text-lg text-neutral-900 transition-all active:scale-95 disabled:opacity-60"
          style={{
            background: '#BDEFFC',
            boxShadow: '0 0 20px rgba(189,239,252,0.5)',
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 18,
          }}
        >
          {isSaving ? '...' : saveLabel}
        </button>

        {/* Retake button */}
        <button
          onClick={onRetake}
          className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors underline underline-offset-2"
          style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic' }}
        >
          {t.retake}
        </button>
      </div>
    </div>
  );
}
