import { useLang } from '../../LangContext';

export function LangToggle() {
  const { lang, toggle } = useLang();
  return (
    <button
      onClick={toggle}
      className="fixed top-3 right-3 z-50 px-2.5 h-8 rounded-full bg-neutral-800/80 border border-neutral-700/60 hover:bg-neutral-700 hover:border-neutral-600 transition-all flex items-center justify-center text-xs font-bold tracking-wide text-neutral-300 shadow-md backdrop-blur-sm"
      title={lang === 'en' ? 'Switch to Korean' : '영어로 전환'}
    >
      {lang === 'en' ? 'KR' : 'EN'}
    </button>
  );
}
