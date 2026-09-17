import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCT_SPECS } from '../data/productData';
import { Cpu, ChevronDown, Check, Zap, Shield, Sparkles } from 'lucide-react';

export const SpecificationsSection: React.FC = () => {
  const [showFullSheet, setShowFullSheet] = useState(false);

  const fullSpecs = [
    {
      category: 'ACOUSTIC ARCHITECTURE',
      items: [
        { label: 'Transducer Type', value: '40mm Custom Bio-Cellulose Dynamic' },
        { label: 'Frequency Response', value: '5Hz — 48,000Hz (Hi-Res Audio Certified)' },
        { label: 'Total Harmonic Distortion', value: '< 0.02% @ 1kHz, 100dB SPL' },
        { label: 'Acoustic Principle', value: 'Closed-Back with Dual Pressure Vents' },
        { label: 'Impedance', value: '32 Ω (Passive) / Active DSP Powered' },
      ],
    },
    {
      category: 'CONNECTIVITY & CODECS',
      items: [
        { label: 'Bluetooth Protocol', value: 'Bluetooth 5.4 Low Energy' },
        { label: 'Supported Codecs', value: 'LDAC, aptX Lossless, AAC, SBC' },
        { label: 'Wireless Range', value: 'Up to 25 meters (82 feet)' },
        { label: 'Multipoint Pairing', value: 'Simultaneous Dual-Device Auto-Switching' },
        { label: 'Wired Audio', value: 'USB-C Lossless 24-bit/96kHz & 3.5mm Aux' },
      ],
    },
    {
      category: 'BATTERY & CHARGE',
      items: [
        { label: 'Playback Time', value: '40 Hours (ANC ON) / 55 Hours (ANC OFF)' },
        { label: 'Fast Charge Speed', value: '5 Minutes = 5 Hours Playback' },
        { label: 'Full Charge Time', value: '48 Minutes via USB-C PD' },
        { label: 'Battery Capacity', value: 'Dual 410mAh Lithium-Polymer Cells (820mAh)' },
      ],
    },
    {
      category: 'MATERIALS & FINISH',
      items: [
        { label: 'Chassis', value: 'CNC-Machined 6000-Series Aluminum Alloy' },
        { label: 'Headband', value: 'Spring Steel Band with Breathable Knit Mesh' },
        { label: 'Ear Cushions', value: 'Slow-Rebound Acoustic Memory Foam & Protein Leather' },
        { label: 'Weight', value: '285 grams (10.05 oz)' },
      ],
    },
  ];

  return (
    <section
      id="section-specs"
      className="relative min-h-screen w-full py-28 px-6 max-w-7xl mx-auto flex flex-col justify-center pointer-events-none select-none"
    >
      {/* Top Header */}
      <div className="max-w-2xl pointer-events-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono-tech tracking-[0.25em] mb-4"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>TECHNICAL SPECIFICATIONS</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white uppercase"
        >
          PURE NUMBERS. <br />
          <span className="text-metallic">UNCOMPROMISING PRECISION.</span>
        </motion.h2>
      </div>

      {/* Primary 6 Key Specs Grid with Bold Typography */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 pointer-events-auto">
        {PRODUCT_SPECS.map((spec, idx) => (
          <motion.div
            key={spec.label}
            id={`spec-item-${idx}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="group p-6 sm:p-8 rounded-2xl bg-zinc-950/70 backdrop-blur-xl border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between"
          >
            <div className="text-[11px] font-mono-tech tracking-[0.25em] text-zinc-500 uppercase mb-4 flex items-center justify-between">
              <span>{spec.label}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-cyan-400 transition-colors" />
            </div>

            <div className="text-4xl sm:text-5xl md:text-6xl font-black font-display text-white tracking-tight leading-none group-hover:text-cyan-300 transition-colors">
              {spec.value}
            </div>

            <div className="text-xs text-zinc-400 font-light mt-4 leading-relaxed">
              {spec.subvalue}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expand Full Datasheet Button */}
      <div className="mt-12 text-center pointer-events-auto">
        <button
          id="toggle-full-specs-btn"
          onClick={() => setShowFullSheet(!showFullSheet)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-xs font-mono-tech tracking-[0.2em] text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300"
        >
          <span>{showFullSheet ? 'COLLAPSE FULL SPEC SHEET' : 'EXPAND COMPLETE TECHNICAL DATASHEET'}</span>
          <ChevronDown
            className={`w-4 h-4 text-cyan-400 transition-transform duration-300 ${
              showFullSheet ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Expanded Technical Datasheet Modal / Drawer */}
      <AnimatePresence>
        {showFullSheet && (
          <motion.div
            id="full-datasheet-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 pointer-events-auto overflow-hidden"
          >
            <div className="p-8 rounded-3xl bg-zinc-950/90 backdrop-blur-2xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl text-left">
              {fullSpecs.map((cat) => (
                <div key={cat.category} className="space-y-4">
                  <h4 className="text-xs font-mono-tech tracking-[0.25em] text-cyan-400 uppercase border-b border-white/10 pb-2">
                    {cat.category}
                  </h4>
                  <div className="space-y-2.5">
                    {cat.items.map((it) => (
                      <div key={it.label} className="flex items-baseline justify-between text-xs gap-4">
                        <span className="text-zinc-400 font-light">{it.label}</span>
                        <span className="text-white font-mono-tech text-right font-medium">{it.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
