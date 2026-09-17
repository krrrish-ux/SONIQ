import React from 'react';
import { ArrowDown, ShoppingBag, Sparkles, Sliders } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onBuyNowClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, onBuyNowClick }) => {
  return (
    <section
      id="section-hero"
      className="relative min-h-screen w-full flex flex-col justify-between items-center px-6 pt-32 pb-16 pointer-events-none select-none"
    >
      {/* Top Eyebrow Tag */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/60 backdrop-blur-md border border-white/10 text-[11px] font-mono-tech tracking-[0.25em] text-zinc-300"
      >
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>SONIQ GENESIS 01 — SPATIAL EDITION</span>
      </motion.div>

      {/* Main Headline & Subheading */}
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto my-auto relative z-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-display tracking-tight text-white uppercase leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
        >
          HEAR THE
          <br />
          <span className="text-metallic text-subtle-glow">DIFFERENCE.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-6 sm:mt-8 text-base sm:text-xl md:text-2xl text-zinc-300 font-light max-w-xl tracking-wide leading-relaxed"
        >
          Immersive sound. Engineered for everything.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="pointer-events-auto mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          {/* EXPLORE button */}
          <button
            id="hero-explore-btn"
            onClick={onExploreClick}
            className="w-48 sm:w-auto px-8 py-3.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800/90 text-white font-mono-tech text-xs tracking-[0.2em] border border-white/15 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2 group"
          >
            <span>EXPLORE</span>
            <ArrowDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* BUY NOW button */}
          <button
            id="hero-buynow-btn"
            onClick={onBuyNowClick}
            className="w-48 sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-cyan-400 text-black font-mono-tech text-xs font-bold tracking-[0.2em] transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>BUY NOW — $299</span>
          </button>
        </motion.div>
      </div>

      {/* Bottom Floating Stats / Scroll Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="pointer-events-auto w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-tech text-zinc-500 border-t border-white/5 pt-6"
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-zinc-300 font-medium">IN STOCK</span>
          </div>
          <div>READY TO SHIP WORLDWIDE</div>
        </div>

        <button
          onClick={onExploreClick}
          className="flex items-center gap-2 text-zinc-400 hover:text-cyan-400 transition-colors group cursor-pointer"
        >
          <span className="tracking-widest text-[11px]">SCROLL TO DISCOVER</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-1 h-1.5 rounded-full bg-cyan-400"
            />
          </div>
        </button>

        <div className="hidden sm:flex items-center gap-4 text-zinc-400">
          <span>SPATIAL AUDIO 360°</span>
          <span>•</span>
          <span>40H BATTERY</span>
        </div>
      </motion.div>
    </section>
  );
};
