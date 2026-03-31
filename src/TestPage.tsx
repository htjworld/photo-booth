// ============================================================
// ⚠️  TEST CODE — 웹캠 없는 환경 테스트용. 나중에 이 파일 삭제할 것.
//     main.tsx 에서도 TestPage import 및 isTest 분기 제거 필요.
// ============================================================

import { CardReveal } from './components/result/CardReveal';
import { LangProvider } from './LangContext';

const MOCK_LETTER = {
  to: '민지에게',
  message: '보고 싶었어.\n잘 지내고 있지?\n언제 한번 만나자!',
  from: '지수',
};

// 기존 에셋 이미지를 mock 사진으로 사용
const MOCK_SHOTS = [
  { id: 'test-1', dataUrl: '/photo-booth/photocard-color.jpg' },
  { id: 'test-2', dataUrl: '/photo-booth/paper-card.jpg' },
  { id: 'test-3', dataUrl: '/photo-booth/background.jpg' },
];

export function TestPage() {
  return (
    <LangProvider>
      <CardReveal
        letter={MOCK_LETTER}
        shots={MOCK_SHOTS}
        webcamRatio={4 / 3}
        onRetake={() => alert('처음부터 버튼 클릭됨')}
      />
    </LangProvider>
  );
}

// ============================================================
// ⚠️  TEST CODE 끝
// ============================================================
