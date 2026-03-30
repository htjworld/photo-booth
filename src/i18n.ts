export type Lang = 'en' | 'ko';

export const translations = {
  en: {
    // App
    grid: 'Grid',
    cameraError: 'Camera permission required.',
    cameraErrorHint: 'Please enable camera access in your browser settings.',
    checkResult: 'View Result',
    // ShootButton
    shoot: 'Shoot',
    // FlashButton
    flash: 'Flash',
    // GlowButton
    glow: 'Glow',
    // ShotSidebar
    clickToRetake: 'Click to retake',
    // GridModal
    gridTitle: 'Grid',
    bestForWebcam: 'Best for your webcam',
    other: 'Other',
    optimal: 'Best',
    // Layout names (English is canonical)
    layoutNames: {} as Record<string, string>,
    // EditPanel
    photoOrder: 'Photo Order',
    dragHint: 'drag',
    frameSettings: 'Frame',
    filterLabel: 'Filter',
    original: 'Original',
    bw: 'B&W',
    options: 'Options',
    mirrorMode: 'Mirror',
    dateWatermark: 'Date',
    download: 'Download (PNG)',
    retake: 'Retake',
  },
  ko: {
    grid: '그리드',
    cameraError: '카메라 접근 권한이 필요합니다.',
    cameraErrorHint: '브라우저 설정에서 권한을 허용해주세요.',
    checkResult: '결과 확인',
    shoot: '촬영 시작',
    flash: '플래시',
    glow: '글로우',
    clickToRetake: '클릭하여 다시 촬영',
    gridTitle: '그리드',
    bestForWebcam: '내 웹캠에 최적',
    other: '기타',
    optimal: '최적',
    layoutNames: {
      '1 Photo': '사진 1장',
      '2 Photos': '사진 2장',
      '3 Photos': '사진 3장',
      '4 Photos': '사진 4장',
    } as Record<string, string>,
    photoOrder: '사진 순서',
    dragHint: '드래그',
    frameSettings: '프레임 설정',
    filterLabel: '필터 선택',
    original: '오리지널',
    bw: '흑백 (B&W)',
    options: '옵션',
    mirrorMode: '전체 거울모드',
    dateWatermark: '날짜 워터마크',
    download: '다운로드 (PNG)',
    retake: '처음부터 다시 찍기',
  },
};

export type Translations = typeof translations['en'];
