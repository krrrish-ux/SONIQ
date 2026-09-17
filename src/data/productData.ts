import { HeadphoneColor, Hotspot, ShowcaseAngleConfig, AudioMode } from '../types';

export const PRODUCT_COLORS: Record<string, HeadphoneColor> = {
  black: {
    id: 'black',
    name: 'Phantom Black',
    description: 'Matte anodized aircraft-grade aluminum with stealth black acoustic mesh.',
    metalColor: '#18191d',
    cushionColor: '#101114',
    accentColor: '#06b6d4', // cyan tint
    roughness: 0.28,
    metalness: 0.92,
  },
  silver: {
    id: 'silver',
    name: 'Titanium Silver',
    description: 'Satin bead-blasted aluminum alloy with lustrous chamfered edges.',
    metalColor: '#9aa0a6',
    cushionColor: '#2b2d35',
    accentColor: '#38bdf8',
    roughness: 0.22,
    metalness: 0.96,
  },
  obsidian: {
    id: 'obsidian',
    name: 'Cyber Obsidian',
    description: 'Deep midnight blue-grey with iridescent dark chrome accents.',
    metalColor: '#151922',
    cushionColor: '#0b0e14',
    accentColor: '#818cf8',
    roughness: 0.25,
    metalness: 0.94,
  },
};

export const HOTSPOTS: Hotspot[] = [
  {
    id: 'drivers',
    title: 'CUSTOM DRIVERS',
    category: 'ACOUSTIC ARCHITECTURE',
    description: '40mm custom bio-cellulose diaphragms with dual neodymium magnet assemblies produce sub-bass down to 5Hz with ultra-low distortion.',
    spec: '5Hz - 48,000Hz | < 0.02% THD',
    position: [-1.45, 0.0, 0.0],
    labelOffset: { x: -160, y: -40 },
    cameraTarget: { rotX: 0.1, rotY: 1.4, zoom: 4.2 },
  },
  {
    id: 'cushions',
    title: 'MEMORY FOAM',
    category: 'ERGONOMICS',
    description: 'Acoustic seal memory foam enveloped in breathable micro-perforated protein leather creates an isolated passive noise barrier.',
    spec: 'Viscoelastic High-Density 65kg/m³',
    position: [-1.2, -0.4, 0.5],
    labelOffset: { x: -170, y: 70 },
    cameraTarget: { rotX: 0.2, rotY: 1.1, zoom: 4.4 },
  },
  {
    id: 'controls',
    title: 'TOUCH CONTROLS',
    category: 'INTERACTION',
    description: 'Capacitive touch glass faceplate with haptic motor feedback enables frictionless volume slides, track toggles, and Siri/Assistant prompts.',
    spec: 'Capacitive Glass + Haptic Pulse',
    position: [1.45, 0.2, 0.2],
    labelOffset: { x: 160, y: -50 },
    cameraTarget: { rotX: 0.05, rotY: -1.3, zoom: 4.3 },
  },
  {
    id: 'microphones',
    title: 'ANC MICROPHONES',
    category: 'NOISE CANCELLATION',
    description: 'Array of 8 precision beamforming microphones sampling ambient acoustic waves 48,000 times per second for instant anti-phase nullification.',
    spec: '8-Mic Array | 48kHz Sampling',
    position: [1.35, -0.6, 0.4],
    labelOffset: { x: 170, y: 60 },
    cameraTarget: { rotX: 0.3, rotY: -1.0, zoom: 4.5 },
  },
  {
    id: 'usbc',
    title: 'USB-C',
    category: 'CONNECTIVITY',
    description: 'Fast-charge USB-C PD delivering 5 hours of playback from a 5-minute charge, with lossless 24-bit/96kHz digital audio input.',
    spec: 'USB Power Delivery + 24-bit Hi-Res Audio',
    position: [0.95, -1.2, 0.1],
    labelOffset: { x: 150, y: 90 },
    cameraTarget: { rotX: 0.5, rotY: -0.6, zoom: 4.6 },
  },
  {
    id: 'battery',
    title: '40H BATTERY',
    category: 'POWER MANAGEMENT',
    description: 'Dual balanced lithium-polymer cells distributed across both earcups maintain perfect weight symmetry while powering 40 continuous hours with ANC.',
    spec: '820mAh Dual Cell | 40h ANC Enabled',
    position: [-0.95, -1.1, -0.1],
    labelOffset: { x: -160, y: 100 },
    cameraTarget: { rotX: 0.4, rotY: 0.7, zoom: 4.6 },
  },
];

export const SHOWCASE_ANGLES: ShowcaseAngleConfig[] = [
  {
    id: 'hero',
    label: 'Overview',
    rotX: 0.15,
    rotY: -0.4,
    rotZ: 0.05,
    zoom: 5.5,
    description: 'Balanced symmetrical perspective displaying the sculpted acoustic form.',
  },
  {
    id: 'angle45',
    label: '45° Precision',
    rotX: 0.2,
    rotY: 0.75,
    rotZ: -0.05,
    zoom: 4.8,
    description: 'Highlights the chamfered aluminum gimbals and seamless joint tolerances.',
  },
  {
    id: 'profile',
    label: 'Profile Silhouettes',
    rotX: 0.0,
    rotY: 1.57,
    rotZ: 0.0,
    zoom: 4.6,
    description: 'Pure side profile revealing the capacitive glass disc and vented acoustic chambers.',
  },
  {
    id: 'drivers',
    label: 'Driver View',
    rotX: -0.1,
    rotY: -1.5,
    rotZ: 0.0,
    zoom: 4.2,
    description: 'Direct view into the ergonomic angled acoustic baffle and ear cushion depth.',
  },
  {
    id: 'top',
    label: 'Headband Arc',
    rotX: 1.25,
    rotY: 0.0,
    rotZ: 0.0,
    zoom: 5.0,
    description: 'Telescopic stainless steel band and breathable tension-relieving knit mesh.',
  },
];

export const AUDIO_MODES: AudioMode[] = [
  {
    id: 'spatial',
    name: 'Spatial Atmos 360°',
    tagline: 'Dynamic head-tracking soundstage placing instruments in physical space around you.',
    frequencyRange: '15Hz — 45,000Hz',
    waveSpeed: 1.2,
    waveCount: 5,
    waveColor: '#06b6d4', // cyan
  },
  {
    id: 'studio',
    name: 'Pure Reference 24-Bit',
    tagline: 'Uncolored linear response tuned for mixing engineers and audiophile purists.',
    frequencyRange: '5Hz — 48,000Hz (Flat ±0.5dB)',
    waveSpeed: 0.8,
    waveCount: 4,
    waveColor: '#38bdf8', // sky
  },
  {
    id: 'bass',
    name: 'Acoustic Resonance Boost',
    tagline: 'Deep visceral sub-bass without masking midrange clarity or vocal presence.',
    frequencyRange: '10Hz — 28,000Hz (Bass Enhanced)',
    waveSpeed: 1.8,
    waveCount: 7,
    waveColor: '#818cf8', // indigo
  },
];

export const PRODUCT_SPECS = [
  {
    label: 'DRIVER',
    value: '40mm',
    subvalue: 'Bio-Cellulose Dynamic',
    highlight: true,
  },
  {
    label: 'BATTERY',
    value: '40H',
    subvalue: 'Continuous with ANC ON',
    highlight: true,
  },
  {
    label: 'CONNECTIVITY',
    value: 'BT 5.4',
    subvalue: 'Multipoint + LDAC / aptX',
    highlight: true,
  },
  {
    label: 'NOISE CANCELLATION',
    value: 'ANC 2.0',
    subvalue: 'Adaptive Real-Time Hybrid',
    highlight: true,
  },
  {
    label: 'WEIGHT',
    value: '285g',
    subvalue: 'Ultralight Balanced Frame',
    highlight: true,
  },
  {
    label: 'CHARGING',
    value: 'USB-C',
    subvalue: '5 min = 5 hours playback',
    highlight: true,
  },
];
