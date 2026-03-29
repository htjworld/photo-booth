import { Zap, ZapOff } from 'lucide-react';

interface FlashButtonProps {
  active: boolean;
  onToggle: () => void;
}

export function FlashButton({ active, onToggle }: FlashButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all w-20 h-20 ${
        active
          ? 'border-white bg-white/10 text-white'
          : 'border-neutral-700 bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:border-neutral-600'
      }`}
    >
      {active ? <Zap size={28} /> : <ZapOff size={28} />}
      <span className="text-xs mt-2 font-medium">플래시 {active ? 'ON' : 'OFF'}</span>
    </button>
  );
}
