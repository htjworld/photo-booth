import { Lightbulb, LightbulbOff } from 'lucide-react';

interface GlowButtonProps {
  active: boolean;
  onToggle: () => void;
}

export function GlowButton({ active, onToggle }: GlowButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all w-20 h-20 ${
        active 
          ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400' 
          : 'border-neutral-700 bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:border-neutral-600'
      }`}
    >
      {active ? <Lightbulb size={28} /> : <LightbulbOff size={28} />}
      <span className="text-xs mt-2 font-medium">글로우 {active ? 'ON' : 'OFF'}</span>
    </button>
  );
}
