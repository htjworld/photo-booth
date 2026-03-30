import { Camera } from 'lucide-react';
import { useLang } from '../../LangContext';

interface ShootButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function ShootButton({ onClick, disabled }: ShootButtonProps) {
  const { t } = useLang();
  const label = t.shoot;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-8 py-4 rounded-full text-lg font-bold transition-all transform ${
        disabled 
          ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700' 
          : 'bg-[#BDEFFC] text-neutral-900 hover:bg-[#A8E5F5] active:scale-95 shadow-[0_0_20px_rgba(189,239,252,0.6)]'
      }`}
    >
      <Camera size={24} />
      {label}
    </button>
  );
}
