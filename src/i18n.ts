export type Lang = 'en' | 'ko';

export const translations = {
  en: {
    // Letter screen
    withLove: 'With love',
    toLabel: 'To :',
    textLabel: 'Text :',
    fromLabel: 'from :',
    toPlaceholder: 'recipient',
    messagePlaceholder: 'write your message here',
    fromPlaceholder: 'your name',
    startButton: 'Start',
    // Shooting screen
    cameraError: 'Camera permission required.',
    cameraErrorHint: 'Please enable camera access in your browser settings.',
    shoot: 'Shoot',
    checkResult: 'Done',
    clickToRetake: 'Retake',
    glow: 'Glow',
    // Result screen
    saveAll: 'Save',
    saveLetter: 'Save letter',
    savePhoto: 'Save photos',
    retake: 'Retake all',
    frameLabel: 'Frame',
    filterLabel: 'Filter',
    original: 'Color',
    bw: 'B&W',
  },
  ko: {
    withLove: 'With love',
    toLabel: 'To :',
    textLabel: 'Text :',
    fromLabel: 'from :',
    toPlaceholder: '받는 사람',
    messagePlaceholder: '메시지를 적어보세요',
    fromPlaceholder: '보내는 사람',
    startButton: '시작하기',
    cameraError: '카메라 접근 권한이 필요합니다.',
    cameraErrorHint: '브라우저 설정에서 권한을 허용해주세요.',
    shoot: '촬영',
    checkResult: '완료',
    clickToRetake: '다시찍기',
    glow: '조명',
    saveAll: '저장',
    saveLetter: '편지 저장',
    savePhoto: '사진 저장',
    retake: '처음부터',
    frameLabel: '프레임',
    filterLabel: '필터',
    original: '컬러',
    bw: '흑백',
  },
};

export type Translations = typeof translations['en'];
