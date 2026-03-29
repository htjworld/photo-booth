import { Camera } from 'lucide-react';

interface ShootButtonProps {
  onClick: () => void;
  disabled: boolean;
  label?: string;
}

export function ShootButton({ onClick, disabled, label = "촬영 시작" }: ShootButtonProps) {
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
