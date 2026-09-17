import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HOTSPOTS } from '../data/productData';
import { Hotspot } from '../types';
import { Sparkles, ChevronRight, X } from 'lucide-react';

interface InteractiveHotspotsOverlayProps {
  hotspotsPos: Record<string, { x: number; y: number; visible: boolean }>;
  activeHotspotId: string | null;
  onSelectHotspot: (hotspot: Hotspot | null) => void;
  isVisible: boolean;
}

export const InteractiveHotspotsOverlay: React.FC<InteractiveHotspotsOverlayProps> = ({
  hotspotsPos,
  activeHotspotId,
  onSelectHotspot,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {/* Dynamic leader line & badge for each hotspot */}
      {HOTSPOTS.map((hotspot) => {
        const screenData = hotspotsPos[hotspot.id];
        if (!screenData || !screenData.visible) return null;

        const isSelected = activeHotspotId === hotspot.id;
        const posX = screenData.x;
        const posY = screenData.y;

        // Offset positions for floating card
        const cardX = posX + hotspot.labelOffset.x;
        const cardY = posY + hotspot.labelOffset.y;

        return (
          <div key={hotspot.id} className="pointer-events-auto">
            {/* SVG Glowing Leader Line (when selected or hovered) */}
            <svg
              className="absolute inset-0 pointer-events-none w-full h-full"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <linearGradient id={`grad-${hotspot.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {(isSelected || isVisible) && (
                <path
                  d={`M ${posX} ${posY} Q ${(posX + cardX) / 2} ${posY}, ${cardX > posX ? cardX : cardX + 120} ${cardY + 20}`}
                  fill="none"
                  stroke={`url(#grad-${hotspot.id})`}
                  strokeWidth={isSelected ? 1.5 : 1}
                  strokeDasharray={isSelected ? 'none' : '3,3'}
                  className="transition-all duration-300 opacity-60 hover:opacity-100"
                />
              )}
            </svg>

            {/* Glowing Hotspot Node Pin */}
            <div
              id={`hotspot-node-${hotspot.id}`}
              style={{
                left: `${posX}px`,
                top: `${posY}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute cursor-pointer group"
              onClick={() => onSelectHotspot(isSelected ? null : hotspot)}
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isSelected ? 'bg-cyan-400' : 'bg-cyan-500/50'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 transition-all duration-300 ${
                    isSelected ? 'bg-cyan-300 shadow-[0_0_12px_#22d3ee] scale-125' : 'bg-white shadow-[0_0_8px_#38bdf8]'
                  }`}
                />
              </span>

              {/* Minimal floating pill tag next to pin */}
              {!isSelected && (
                <div
                  className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono-tech tracking-wider text-zinc-300 opacity-80 group-hover:opacity-100 transition-opacity ${
                    hotspot.labelOffset.x > 0 ? 'left-6' : 'right-6'
                  }`}
                >
                  {hotspot.title}
                </div>
              )}
            </div>

            {/* Rich Detailed Glass Card on Selection */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  id={`hotspot-card-${hotspot.id}`}
                  initial={{ opacity: 0, scale: 0.92, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 10 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  style={{
                    left: `${Math.max(16, Math.min(window.innerWidth - 300, cardX))}px`,
                    top: `${Math.max(80, Math.min(window.innerHeight - 240, cardY))}px`,
                  }}
                  className="absolute w-72 p-4 rounded-xl bg-zinc-950/85 backdrop-blur-xl border border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.15)] text-left"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="inline-block text-[9px] font-mono-tech uppercase tracking-widest text-cyan-400 mb-0.5">
                        {hotspot.category}
                      </span>
                      <h4 className="text-sm font-bold text-white tracking-wide font-display">
                        {hotspot.title}
                      </h4>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectHotspot(null);
                      }}
                      className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                    {hotspot.description}
                  </p>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-tech text-zinc-400">
                    <span className="text-cyan-300">{hotspot.spec}</span>
                    <Sparkles className="w-3 h-3 text-cyan-400/70" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Floating feature selector chips at the bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-zinc-950/80 backdrop-blur-md border border-white/10 max-w-[92vw] overflow-x-auto no-scrollbar">
        {HOTSPOTS.map((h) => {
          const active = activeHotspotId === h.id;
          return (
            <button
              key={h.id}
              id={`chip-hotspot-${h.id}`}
              onClick={() => onSelectHotspot(active ? null : h)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-mono-tech whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                active
                  ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-black' : 'bg-cyan-400'}`} />
              {h.title}
            </button>
          );
        })}
      </div>
    </div>
  );
};
