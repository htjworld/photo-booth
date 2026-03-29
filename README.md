# Photo Booth

웹캠 기반 포토부스 앱. 다양한 레이아웃으로 연속 촬영하고, 필터/프레임을 적용해 이미지로 저장.

## 시작하기

```bash
npm install
npm run dev
```

## 주요 기능

- 12가지 그리드 레이아웃 (스트립, 와이드, 격자 등)
- 타이머 설정 (0 / 3 / 5초)
- 필터 (원본, 흑백)
- 프레임 (spectrum, solid color)
- 미러 모드 토글
- 날짜 워터마크
- 촬영 후 사진 순서 재배열 (드래그 앤 드롭)
- PNG 다운로드

## 스택

- React 19 + TypeScript
- Vite
- Tailwind CSS
- @dnd-kit (드래그 앤 드롭)
- lucide-react (아이콘)
