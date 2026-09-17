import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SHOWCASE_ANGLES } from '../data/productData';
import { ShowcaseAngle } from '../types';
import { Disc, ShieldAlert, BatteryCharging, Orbit, Eye, Sparkles } from 'lucide-react';

interface ProductShowcaseProps {
  onSelectAngle: (angle: ShowcaseAngle | null) => void;
  activeAngleId: ShowcaseAngle | null;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  onSelectAngle,
  activeAngleId,
}) => {
  const featureCards = [
    {
      icon: Disc,
      title: '40MM DRIVERS',
      badge: 'ACOUSTIC',
      description: 'Rich, detailed sound with powerful bass.',
      detail: 'Custom bio-cellulose diaphragm with dual neodymium magnetic coils.',
    },
    {
      icon: ShieldAlert,
      title: 'ANC 2.0',
      badge: 'SILENCE',
      description: 'Adaptive noise cancellation for focused listening.',
      detail: 'Octa-microphone array sampling exterior noise 48,000 times per second.',
    },
    {
      icon: BatteryCharging,
      title: '40H BATTERY',
      badge: 'ENDURANCE',
      description: 'All-day listening without interruption.',
      detail: 'Ultra-fast USB-C charge provides 5 hours of playback in just 5 minutes.',
    },
    {
      icon: Orbit,
      title: 'SPATIAL AUDIO',
      badge: 'STAGE',
      description: 'A wider and more immersive soundstage.',
      detail: 'Dynamic head tracking transforms stereo mixes into 360° theater immersion.',
    },
  ];

  return (
    <section
      id="section-showcase"
      className="relative min-h-screen w-full py-28 px-6 max-w-7xl mx-auto flex flex-col justify-center pointer-events-none select-none"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono-tech tracking-[0.25em] mb-4"
        >
          <Sparkles className="w-3 h-3" />
          <span>PRECISION INDUSTRIAL DESIGN</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-white uppercase"
        >
          ENGINEERED FOR <span className="text-metallic">IMMERSION.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-4 text-zinc-400 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed"
        >
          Machined from monolithic aircraft-grade aluminum alloy and paired with ultra-responsive bio-acoustic drivers.
        </motion.p>

        {/* 3D Camera Multi-Angle Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {SHOWCASE_ANGLES.map((angle) => {
            const isSelected = activeAngleId === angle.id;
            return (
              <button
                key={angle.id}
                id={`angle-btn-${angle.id}`}
                onClick={() => onSelectAngle(isSelected ? null : angle.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono-tech tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/10'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>{angle.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pointer-events-auto mt-auto">
        {featureCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              id={`feature-card-${i}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group relative p-6 rounded-2xl bg-zinc-950/75 backdrop-blur-xl border border-white/[0.08] hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.15)] flex flex-col justify-between"
            >
              {/* Card top badge & icon */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:border-cyan-500/50 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono-tech tracking-[0.2em] text-zinc-500 uppercase px-2 py-0.5 rounded-md bg-white/[0.03]">
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-display text-white tracking-wide mb-2">
                  {card.title}
                </h3>

                <p className="text-sm font-medium text-zinc-200 leading-snug mb-3">
                  {card.description}
                </p>
              </div>

              <p className="text-xs text-zinc-400 font-light leading-relaxed border-t border-white/5 pt-3">
                {card.detail}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
