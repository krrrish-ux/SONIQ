import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';
import { PRODUCT_COLORS } from '../data/productData';
import { HeadphoneColorId, HeadphoneColor } from '../types';

interface FinalCTAProps {
  currentColor: HeadphoneColor;
  onSelectColor: (color: HeadphoneColor) => void;
  onOpenCheckout: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  currentColor,
  onSelectColor,
  onOpenCheckout,
}) => {
  return (
    <section
      id="section-cta"
      className="relative min-h-screen w-full flex flex-col justify-between items-center px-6 py-28 pointer-events-none select-none text-center"
    >
      <div className="w-full max-w-4xl mx-auto my-auto flex flex-col items-center relative z-20">
        {/* Subdued Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono-tech tracking-[0.25em] mb-6"
        >
          <span>FLAGSHIP SERIES 2026</span>
        </motion.div>

        {/* Big Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-display tracking-tight text-white uppercase leading-none drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)]"
        >
          YOUR WORLD.
          <br />
          <span className="text-metallic text-subtle-glow">YOUR SOUND.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 sm:mt-8 text-base sm:text-xl md:text-2xl text-zinc-300 font-light max-w-lg leading-relaxed"
        >
          Put them on. Everything else disappears.
        </motion.p>

        {/* Interactive Color Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="pointer-events-auto mt-8 flex flex-col items-center gap-3"
        >
          <div className="text-[11px] font-mono-tech tracking-[0.2em] text-zinc-400 uppercase">
            FINISH: <span className="text-white font-semibold">{currentColor.name}</span>
          </div>

          <div className="flex items-center gap-4 p-2 rounded-full bg-zinc-950/80 backdrop-blur-xl border border-white/10">
            {Object.values(PRODUCT_COLORS).map((c) => {
              const isSelected = currentColor.id === c.id;
              return (
                <button
                  key={c.id}
                  id={`color-swatch-${c.id}`}
                  onClick={() => onSelectColor(c)}
                  className={`relative p-1 rounded-full transition-transform cursor-pointer ${
                    isSelected ? 'scale-110' : 'hover:scale-105'
                  }`}
                  title={c.name}
                >
                  <span
                    style={{ backgroundColor: c.metalColor }}
                    className={`block w-7 h-7 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'border-cyan-400 shadow-[0_0_15px_#22d3ee]'
                        : 'border-white/20 hover:border-white/50'
                    }`}
                  />
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center text-cyan-300">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Glowing BUY NOW Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="pointer-events-auto mt-10"
        >
          <button
            id="cta-buynow-btn"
            onClick={onOpenCheckout}
            className="group relative px-10 py-5 rounded-full overflow-hidden text-sm sm:text-base font-mono-tech font-extrabold tracking-[0.2em] text-black bg-cyan-400 hover:bg-white transition-all duration-300 shadow-[0_0_50px_rgba(6,182,212,0.6)] hover:shadow-[0_0_70px_rgba(255,255,255,0.7)] hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-black" />
            <span>BUY NOW — $299</span>
          </button>
        </motion.div>

        {/* Guarantees Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="pointer-events-auto mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono-tech text-zinc-400"
        >
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" />
            <span>FREE EXPRESS SHIPPING</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>30-DAY RISK-FREE TRIAL</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>2-YEAR REPLACEMENT WARRANTY</span>
          </div>
        </motion.div>
      </div>

      {/* Subtle Copyright Tag */}
      <div className="pointer-events-auto text-xs font-mono-tech text-zinc-600 tracking-widest pt-8 border-t border-white/5 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>&copy; 2026 SONIQ ACOUSTICS INC. ALL RIGHTS RESERVED.</div>
        <div>DESIGNED IN CALIFORNIA // ASSEMBLED IN TOKYO</div>
      </div>
    </section>
  );
};
