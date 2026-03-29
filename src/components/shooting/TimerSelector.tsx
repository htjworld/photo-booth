import { TimerOption } from '../../types';
import { Timer } from 'lucide-react';

interface TimerSelectorProps {
  selected: TimerOption;
  onChange: (t: TimerOption) => void;
  disabled: boolean;
}

export function TimerSelector({ selected, onChange, disabled }: TimerSelectorProps) {
  return (
    <div className="flex bg-neutral-800/80 backdrop-blur-sm p-1 rounded-full border border-neutral-700/50 shadow-lg inline-flex">
      {([3, 5, 10] as TimerOption[]).map((t) => (
        <button
          key={t}
          disabled={disabled}
          onClick={() => onChange(t)}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
            selected === t 
              ? 'bg-neutral-600 text-white shadow-sm' 
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Timer size={16} />
          {t}s
        </button>
      ))}
    </div>
  );
}
