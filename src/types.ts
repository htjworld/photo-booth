export type Step = 'letter' | 'shooting' | 'result';
export type TimerOption = 3 | 5 | 10;
export type FilterType = 'original' | 'bw';

export interface LetterData {
  to: string;
  message: string;
  from: string;
}

export type CapturedShot = {
  id: string;
  dataUrl: string;
};
