export interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

export interface LogEntry {
  id: string;
  label: string;
  score: number;
  timestamp: string;
  camera: string;
}

export enum AppView {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  ANALYTICS = 'ANALYTICS',
  PDF_REPORT = 'PDF_REPORT'
}

export type ModelType = 'coco-ssd';