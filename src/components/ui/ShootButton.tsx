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
          : 'bg-pink-500 text-white hover:bg-pink-600 active:scale-95 shadow-lg shadow-pink-500/20'
      }`}
    >
      <Camera size={24} />
      {label}
    </button>
  );
}
