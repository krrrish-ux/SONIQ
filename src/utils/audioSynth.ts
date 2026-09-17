/**
 * Lightweight Web Audio API spatial synthesizer for interactive demonstration.
 * Creates an ultra-smooth, ambient spatial soundstage experience without external audio files.
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isPlaying = false;
let oscillators: OscillatorNode[] = [];
let lfo: OscillatorNode | null = null;

export function toggleSpatialAudio(onStateChange?: (playing: boolean) => void): boolean {
  if (isPlaying) {
    stopSpatialAudio();
    onStateChange?.(false);
    return false;
  } else {
    startSpatialAudio();
    onStateChange?.(true);
    return true;
  }
}

export function isAudioActive(): boolean {
  return isPlaying;
}

export function startSpatialAudio() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 1.5);
    masterGain.connect(audioCtx.destination);

    // Filter for warm, deep spatial tone
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, audioCtx.currentTime);
    filter.connect(masterGain);

    // Dual harmonic drone (Warm 110Hz + 220Hz harmonic fifths)
    const freqs = [110, 164.81, 220, 329.63];
    oscillators = freqs.map((freq, i) => {
      const osc = audioCtx!.createOscillator();
      const oscGain = audioCtx!.createGain();
      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx!.currentTime);

      // Stereo panner for spatial separation
      try {
        const panner = audioCtx!.createStereoPanner();
        panner.pan.setValueAtTime((i % 2 === 0 ? -0.5 : 0.5) * (i * 0.3), audioCtx!.currentTime);
        oscGain.connect(panner);
        panner.connect(filter);
      } catch {
        oscGain.connect(filter);
      }

      oscGain.gain.setValueAtTime(0.08 / (i + 1), audioCtx!.currentTime);
      osc.connect(oscGain);
      osc.start();
      return osc;
    });

    // Subtle LFO modulation for breathing acoustic presence
    lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.setValueAtTime(0.15, audioCtx.currentTime); // slow pulse
    lfoGain.gain.setValueAtTime(80, audioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    isPlaying = true;
  } catch (err) {
    console.warn('Audio initialization deferred to user gesture', err);
  }
}

export function stopSpatialAudio() {
  if (!audioCtx || !masterGain) return;
  try {
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
    setTimeout(() => {
      oscillators.forEach(o => {
        try { o.stop(); o.disconnect(); } catch {}
      });
      oscillators = [];
      if (lfo) {
        try { lfo.stop(); lfo.disconnect(); } catch {}
        lfo = null;
      }
      isPlaying = false;
    }, 600);
  } catch {
    isPlaying = false;
  }
}
