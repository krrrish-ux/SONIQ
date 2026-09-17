import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AUDIO_MODES } from '../data/productData';
import { AudioMode } from '../types';
import { Radio, Waves, Activity, Volume2, Sparkles } from 'lucide-react';
import { toggleSpatialAudio, isAudioActive } from '../utils/audioSynth';

interface SoundExperienceSectionProps {
  activeAudioMode: AudioMode;
  onSelectAudioMode: (mode: AudioMode) => void;
  scrollProgress: number;
}

export const SoundExperienceSection: React.FC<SoundExperienceSectionProps> = ({
  activeAudioMode,
  onSelectAudioMode,
  scrollProgress,
}) => {
  const [isPlaying, setIsPlaying] = useState(isAudioActive());

  const handleToggleSound = () => {
    toggleSpatialAudio((active) => {
      setIsPlaying(active);
    });
  };

  return (
    <section
      id="section-sound"
      className="relative min-h-screen w-full py-28 px-6 max-w-7xl mx-auto flex flex-col justify-between items-center text-center pointer-events-none select-none"
    >
      {/* Top Header */}
      <div className="max-w-3xl mx-auto pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono-tech tracking-[0.25em] mb-4"
        >
          <Waves className="w-3.5 h-3.5" />
          <span>ACOUSTIC RESONANCE CHAMBER</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-white uppercase"
        >
          SOUND, WITHOUT <span className="text-metallic">LIMITS.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-4 text-zinc-400 text-sm sm:text-base font-light leading-relaxed max-w-xl mx-auto"
        >
          Dynamic beamforming transforms every stereo recording into an expansive three-dimensional soundstage with zero phase cancellation.
        </motion.p>
      </div>

      {/* Center Visual Concentric Pulsing Sound Wave Graphic Background (in addition to 3D rings) */}
      <div className="relative w-full max-w-md h-48 flex items-center justify-center pointer-events-none my-auto">
        <div className="absolute w-72 h-72 rounded-full border border-cyan-500/15 animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute w-96 h-96 rounded-full border border-sky-400/10 animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute w-56 h-56 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      </div>

      {/* Bottom Mode Selector & Acoustic Stats */}
      <div className="w-full max-w-4xl pointer-events-auto flex flex-col items-center gap-6 mt-auto">
        {/* Audio Mode Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {AUDIO_MODES.map((mode) => {
            const isSelected = activeAudioMode.id === mode.id;
            return (
              <button
                key={mode.id}
                id={`audio-mode-tab-${mode.id}`}
                onClick={() => onSelectAudioMode(mode)}
                className={`px-5 py-2.5 rounded-full text-xs font-mono-tech tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                    : 'bg-zinc-950/80 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-white/10'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{mode.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Mode Explainer Card */}
        <motion.div
          key={activeAudioMode.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl p-5 rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-center justify-between gap-4 text-left"
        >
          <div className="flex-1">
            <div className="text-[10px] font-mono-tech tracking-[0.2em] text-cyan-400 uppercase mb-1">
              {activeAudioMode.frequencyRange}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-light">
              {activeAudioMode.tagline}
            </p>
          </div>

          <button
            onClick={handleToggleSound}
            className={`px-4 py-2 rounded-xl text-xs font-mono-tech font-semibold flex items-center gap-2 transition-all ${
              isPlaying
                ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-zinc-900 text-zinc-300 border border-white/15 hover:border-cyan-400/50 hover:text-white'
            }`}
          >
            <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce' : ''}`} />
            <span>{isPlaying ? 'ACTIVE' : 'TEST TONE'}</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
