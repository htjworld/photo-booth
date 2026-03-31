import { useState, useRef, useCallback } from 'react';

function convertToGrayscale(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;
      for (let i = 0; i < data.length; i += 4) {
        const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = avg;
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.src = dataUrl;
  });
}
import html2canvas from 'html2canvas';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CapturedShot, FilterType, LetterData } from '../../types';
import { useLang } from '../../LangContext';
import { LangToggle } from '../ui/LangToggle';

interface CardRevealProps {
  letter: LetterData;
  shots: CapturedShot[];
  webcamRatio: number | null;
  onRetake: () => void;
}

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

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className="w-full rounded overflow-hidden bg-neutral-200 cursor-grab active:cursor-grabbing touch-none"
    >
      {shot ? (
        <img
          src={shot.dataUrl}
          alt={`Photo ${index + 1}`}
          data-shot-img="true"
          className="w-full block object-cover pointer-events-none"
          style={{
            aspectRatio,
            filter: filter === 'bw' ? 'grayscale(100%)' : 'none',
          }}
        />
      ) : (
        <div className="w-full bg-neutral-300" style={{ aspectRatio }} />
      )}
    </div>
  );
}

export function CardReveal({ letter, shots, webcamRatio, onRetake }: CardRevealProps) {
  const { t } = useLang();
  const [order, setOrder] = useState<number[]>(() => shots.map((_, i) => i));
  const [filter, setFilter] = useState<FilterType>('original');
  const [isSaving, setIsSaving] = useState(false);

  const downloadRef = useRef<HTMLDivElement>(null);
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

  const handleSave = useCallback(async () => {
    if (!downloadRef.current || isSaving) return;
    setIsSaving(true);

    try {
      const SCALE = 3;
      const wrapperRect = downloadRef.current.getBoundingClientRect();

      // 1단계: html2canvas로 배경·텍스트·레이아웃 캡처
      const baseCanvas = await html2canvas(downloadRef.current, {
        scale: SCALE,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 10000,
        backgroundColor: null,
      });

      // 2단계: 사진 슬롯을 원본 해상도로 덮어 그리기
      const ctx = baseCanvas.getContext('2d')!;
      const photoImgs = Array.from(
        downloadRef.current.querySelectorAll<HTMLImageElement>('[data-shot-img="true"]')
      );

      for (const imgEl of photoImgs) {
        const rect = imgEl.getBoundingClientRect();
        const dx = (rect.left - wrapperRect.left) * SCALE;
        const dy = (rect.top  - wrapperRect.top)  * SCALE;
        const dw = rect.width  * SCALE;
        const dh = rect.height * SCALE;

        const srcUrl = filter === 'bw'
          ? await convertToGrayscale(imgEl.src)
          : imgEl.src;

        await new Promise<void>((resolve) => {
          const fullImg = new Image();
          fullImg.onload = () => {
            // object-fit: cover 재현 — 중앙 기준 크롭
            const scaleX = dw / fullImg.naturalWidth;
            const scaleY = dh / fullImg.naturalHeight;
            const s = Math.max(scaleX, scaleY);
            const srcW = dw / s;
            const srcH = dh / s;
            const srcX = (fullImg.naturalWidth  - srcW) / 2;
            const srcY = (fullImg.naturalHeight - srcH) / 2;

            // 슬롯 영역만 클립해서 덮어 그리기
            ctx.save();
            ctx.beginPath();
            ctx.rect(dx, dy, dw, dh);
            ctx.clip();
            ctx.drawImage(fullImg, srcX, srcY, srcW, srcH, dx, dy, dw, dh);
            ctx.restore();
            resolve();
          };
          fullImg.src = srcUrl;
        });
      }

      // 3단계: 다운로드
      const a = document.createElement('a');
      a.href = baseCanvas.toDataURL('image/png');
      const d = new Date();
      a.download = `photocard_${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}.png`;
      a.click();
    } finally {
      setIsSaving(false);
    }
  }, [filter, isSaving]);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-10 gap-6"
      style={{
        backgroundImage: `url('${import.meta.env.BASE_URL}background.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <LangToggle />

      {/*
        ── Download wrapper ──
        background.png 패딩으로 감싸서 저장 시 배경이 약간 보이게
      */}
      <div
        ref={downloadRef}
        className="relative z-10 rounded-3xl overflow-hidden"
        style={{ padding: 28 }}
      >
        {/* 배경 이미지 (<img> 태그로 html2canvas 정상 렌더링) */}
        <img
          src={`${import.meta.env.BASE_URL}background.png`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* ── 편지 카드 (paper-card.jpg 배경, 포토스트립 포함) ── */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            width: 640,
            boxShadow: '0 10px 40px rgba(0,0,0,0.28)',
          }}
        >
          {/* 편지지 배경 */}
          <img
            src={`${import.meta.env.BASE_URL}paper-card.jpg`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* 카드 콘텐츠 */}
          <div className="relative" style={{ zIndex: 1 }}>
            {/* 헤더 */}
            <div style={{ textAlign: 'center', padding: '26px 32px 12px' }}>
              <p
                style={{
                  fontFamily: 'Italianno, serif',
                  fontSize: 44,
                  color: '#3B9BB8',
                  lineHeight: 1,
                }}
              >
                With love
              </p>
            </div>

            {/* 바디: 편지 텍스트(왼쪽) + 포토스트립(오른쪽) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                padding: '8px 20px 28px 32px',
              }}
            >
              {/* 편지 텍스트 */}
              <div style={{ flex: 1, paddingRight: 24, paddingTop: 6, minHeight: 300, display: 'flex', flexDirection: 'column' }}>
                {letter.to && (
                  <p
                    style={{
                      fontFamily: 'Ownglyph_ParkDaHyun, sans-serif',
                      fontSize: 18,
                      color: '#555',
                      marginBottom: 12,
                    }}
                  >
                    {letter.to}에게
                  </p>
                )}
                {letter.message && (
                  <p
                    style={{
                      fontFamily: 'Ownglyph_ParkDaHyun, sans-serif',
                      fontSize: 17,
                      color: '#333',
                      lineHeight: 1.85,
                      whiteSpace: 'pre-wrap',
                      marginBottom: 16,
                    }}
                  >
                    {letter.message}
                  </p>
                )}
                {letter.from && (
                  <p
                    style={{
                      fontFamily: 'Ownglyph_ParkDaHyun, sans-serif',
                      fontSize: 15,
                      color: '#777',
                      textAlign: 'right',
                      paddingRight: 4,
                      marginTop: 'auto',
                    }}
                  >
                    from. {letter.from}
                  </p>
                )}
              </div>

              {/*
                포토스트립 — 편지지 위에 붙인 느낌
                흰 배경 + 그림자로 위에 올려놓은 느낌 표현
              */}
              <div
                style={{
                  width: 220,
                  flexShrink: 0,
                  alignSelf: 'center',
                  background: 'rgba(255,255,255,0.90)',
                  borderRadius: 8,
                  overflow: 'hidden',
                  boxShadow: '2px 4px 18px rgba(0,0,0,0.22)',
                  margin: '12px 0',
                }}
              >
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={order.map(i => i.toString())}
                    strategy={verticalListSortingStrategy}
                  >
                    <div
                      style={{
                        padding: '12px 12px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      {order.map(originalIdx => (
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
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '6px 10px 12px' }}>
                  <p style={{ fontFamily: 'Italianno, serif', fontSize: 20, color: '#3B9BB8', margin: 0 }}>
                    ♡
                  </p>
                  <p style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: 11, color: '#aaa', margin: 0 }}>
                    {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 컨트롤 ── */}
      <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-sm">
        {/* 필터 토글 */}
        <div className="flex bg-white/60 backdrop-blur-sm rounded-full p-1 border border-neutral-300">
          <button
            onClick={() => setFilter('original')}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
              filter === 'original'
                ? 'bg-[#BDEFFC] text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {t.original}
          </button>
          <button
            onClick={() => setFilter('bw')}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
              filter === 'bw'
                ? 'bg-neutral-700 text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {t.bw}
          </button>
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-3.5 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-60"
          style={{
            background: '#3B9BB8',
            boxShadow: '0 0 20px rgba(59,155,184,0.45)',
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 18,
          }}
        >
          {isSaving ? '...' : t.saveAll}
        </button>

        {/* 다시 찍기 */}
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
