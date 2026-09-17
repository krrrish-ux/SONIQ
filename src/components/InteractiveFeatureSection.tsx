import React from 'react';
import { motion } from 'motion/react';
import { HOTSPOTS } from '../data/productData';
import { Hotspot } from '../types';
import { Layers, Crosshair, ArrowRight } from 'lucide-react';

interface InteractiveFeatureSectionProps {
  activeHotspotId: string | null;
  onSelectHotspot: (hotspot: Hotspot | null) => void;
}

export const InteractiveFeatureSection: React.FC<InteractiveFeatureSectionProps> = ({
  activeHotspotId,
  onSelectHotspot,
}) => {
  return (
    <section
      id="section-features"
      className="relative min-h-screen w-full py-28 px-6 max-w-7xl mx-auto flex flex-col justify-between pointer-events-none select-none"
    >
      {/* Top Header */}
      <div className="max-w-2xl pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono-tech tracking-[0.25em] mb-4"
        >
          <Crosshair className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
          <span>EXPLODED ARCHITECTURE</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-white uppercase"
        >
          ANATOMY OF <br />
          <span className="text-metallic">ABSOLUTE CLARITY.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-4 text-zinc-400 text-sm sm:text-base font-light leading-relaxed max-w-lg"
        >
          Hover or tap on glowing nodes to reveal the aerospace engineering and bespoke acoustic components within.
        </motion.p>
      </div>

      {/* Side Quick Inspection List (Desktop Floating HUD) */}
      <div className="pointer-events-auto self-end w-full sm:w-80 flex flex-col gap-2 my-auto z-20">
        <div className="text-[11px] font-mono-tech tracking-[0.2em] text-zinc-500 uppercase px-2 mb-1 flex items-center justify-between">
          <span>SELECT COMPONENT</span>
          <Layers className="w-3 h-3 text-cyan-400" />
        </div>

        {HOTSPOTS.map((h, i) => {
          const isSelected = activeHotspotId === h.id;
          return (
            <button
              key={h.id}
              id={`hotspot-list-item-${h.id}`}
              onClick={() => onSelectHotspot(isSelected ? null : h)}
              className={`p-3 rounded-xl text-left font-mono-tech transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/15 border border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  : 'bg-zinc-950/70 border border-white/[0.06] hover:border-white/20 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full transition-all ${
                    isSelected ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee] scale-125' : 'bg-zinc-600 group-hover:bg-zinc-400'
                  }`}
                />
                <div>
                  <div className={`text-xs font-semibold tracking-wider ${isSelected ? 'text-cyan-300' : 'text-zinc-300 group-hover:text-white'}`}>
                    {h.title}
                  </div>
                  <div className="text-[10px] text-zinc-500 tracking-wide font-normal">
                    {h.category}
                  </div>
                </div>
              </div>

              <ArrowRight
                className={`w-3.5 h-3.5 transition-transform ${
                  isSelected ? 'text-cyan-400 translate-x-1' : 'text-zinc-600 group-hover:text-zinc-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Bottom Hint */}
      <div className="pointer-events-auto text-center sm:text-left text-xs font-mono-tech text-zinc-500 tracking-widest pt-6 border-t border-white/5">
        <span>360° PRECISION GIMBAL &bull; CAPACITIVE ACOUSTIC BAFFLE &bull; BILATERAL DUAL-CELL BATTERY</span>
      </div>
    </section>
  );
};
