import { useState } from 'react';
import { LetterData } from '../../types';
import { useLang } from '../../LangContext';
import { LangToggle } from '../ui/LangToggle';

interface LetterScreenProps {
  onStart: (data: LetterData) => void;
}

export function LetterScreen({ onStart }: LetterScreenProps) {
  const { t } = useLang();
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [from, setFrom] = useState('');

  const handleStart = () => {
    onStart({ to, message, from });
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Warm overlay */}
      <div className="absolute inset-0 bg-[#FAF5E4]/60 pointer-events-none" />

      <LangToggle />

      {/* Card */}
      <div
        className="relative z-10 w-[340px] rounded-2xl shadow-2xl px-8 pt-8 pb-10"
        style={{
          backgroundImage: "url('/paper-card.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* With love header */}
        <p
          className="text-center mb-6 select-none"
          style={{
            fontFamily: 'Italianno, serif',
            fontSize: 44,
            lineHeight: 1.1,
            color: '#3B9BB8',
          }}
        >
          {t.withLove}
        </p>

        {/* To field */}
        <div className="mb-5">
          <label
            className="block mb-1"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              fontSize: 17,
              color: '#555',
            }}
          >
            {t.toLabel}
          </label>
          <input
            type="text"
            value={to}
            onChange={e => setTo(e.target.value)}
            placeholder={t.toPlaceholder}
            className="cursive-input w-full bg-transparent outline-none"
            style={{
              fontFamily: 'Ownglyph_ParkDaHyun, sans-serif',
              fontSize: 19,
              color: '#333',
              borderBottom: '1.5px dashed #999',
              paddingBottom: 4,
            }}
          />
        </div>

        {/* Message field */}
        <div className="mb-5">
          <label
            className="block mb-1"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              fontSize: 17,
              color: '#555',
            }}
          >
            {t.textLabel}
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={t.messagePlaceholder}
            rows={4}
            className="cursive-input w-full bg-transparent outline-none resize-none"
            style={{
              fontFamily: 'Ownglyph_ParkDaHyun, sans-serif',
              fontSize: 19,
              color: '#333',
              lineHeight: 1.7,
              borderBottom: '1.5px dashed #999',
              paddingBottom: 4,
            }}
          />
        </div>

        {/* From field */}
        <div>
          <label
            className="block mb-1 text-right"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              fontSize: 17,
              color: '#555',
            }}
          >
            {t.fromLabel}
          </label>
          <input
            type="text"
            value={from}
            onChange={e => setFrom(e.target.value)}
            placeholder={t.fromPlaceholder}
            className="cursive-input w-full bg-transparent outline-none text-right"
            style={{
              fontFamily: 'Ownglyph_ParkDaHyun, sans-serif',
              fontSize: 17,
              color: '#555',
              borderBottom: '1.5px dashed #999',
              paddingBottom: 4,
            }}
          />
        </div>
      </div>

      {/* Start button — outside card */}
      <button
        onClick={handleStart}
        className="relative z-10 mt-6 px-10 py-3 rounded-2xl font-bold text-lg text-neutral-900 transition-all active:scale-95 shadow-lg"
        style={{
          background: '#BDEFFC',
          boxShadow: '0 0 20px rgba(189,239,252,0.5)',
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 20,
          letterSpacing: '0.03em',
        }}
      >
        {t.startButton}
      </button>
    </div>
  );
}
