export type HeadphoneColorId = 'black' | 'silver' | 'obsidian';

export interface HeadphoneColor {
  id: HeadphoneColorId;
  name: string;
  description: string;
  metalColor: string;
  cushionColor: string;
  accentColor: string;
  roughness: number;
  metalness: number;
}

export interface Hotspot {
  id: string;
  title: string;
  category: string;
  description: string;
  spec: string;
  position: [number, number, number]; // 3D local coordinate
  labelOffset: { x: number; y: number }; // 2D screen offset for leader line
  cameraTarget: {
    rotX: number;
    rotY: number;
    zoom: number;
  };
}

export interface AudioMode {
  id: string;
  name: string;
  tagline: string;
  frequencyRange: string;
  waveSpeed: number;
  waveCount: number;
  waveColor: string;
}

export type ShowcaseAngle = 'hero' | 'profile' | 'angle45' | 'drivers' | 'top';

export interface ShowcaseAngleConfig {
  id: ShowcaseAngle;
  label: string;
  rotX: number;
  rotY: number;
  rotZ: number;
  zoom: number;
  description: string;
}
