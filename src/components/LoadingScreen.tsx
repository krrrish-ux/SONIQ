import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  onLoaded: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            setTimeout(onLoaded, 600);
          }, 300);
          return 100;
        }
        // Smooth random progression
        const step = Math.floor(Math.random() * 18) + 8;
        return Math.min(prev + step, 100);
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onLoaded]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          id="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070709] text-white px-6 select-none"
        >
          {/* Subtle background glow */}
          <div className="absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
            {/* Wordmark */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-[0.25em] font-display text-white mb-2"
            >
              SONIQ
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-[11px] font-mono-tech tracking-[0.3em] text-zinc-400 uppercase mb-8"
            >
              INITIALIZING AUDIO EXPERIENCE...
            </motion.p>

            {/* Minimal Progress Bar */}
            <div className="w-48 h-[2px] bg-zinc-800/80 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 shadow-[0_0_12px_#06b6d4]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Percentage counter */}
            <div className="mt-4 text-xs font-mono-tech text-zinc-500 tracking-wider">
              {progress.toString().padStart(3, '0')}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
