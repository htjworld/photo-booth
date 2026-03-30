export type Step = 'shooting' | 'result';
export type TimerOption = 3 | 5 | 10;
export type FrameType = 'spectrum' | 'solid';
export type FilterType = 'original' | 'bw';

export interface GridLayout {
  id: string;
  name: string;
  shots: number; // Number of photos in this layout
  aspectRatio: string; // The overall aspect ratio of the generated image, e.g., '3 / 4'
  cameraRatio: string; // The aspect ratio to preview the camera in, e.g., '4 / 3'
}

export type CapturedShot = {
  id: string;
  dataUrl: string;
};
