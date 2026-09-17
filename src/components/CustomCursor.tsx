import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if device supports fine hover (desktop)
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if target or parent is interactive
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, [role="button"], canvas, .cursor-pointer');
        setIsHovered(!!interactive);
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Outer Follower Ring */}
      <div
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${
            isClicked ? 0.85 : isHovered ? 1.6 : 1
          })`,
          transition: 'transform 0.14s ease-out, border-color 0.2s, background-color 0.2s, width 0.2s, height 0.2s',
        }}
        className={`fixed top-0 left-0 rounded-full border pointer-events-none ${
          isHovered
            ? 'w-11 h-11 border-cyan-400/80 bg-cyan-400/10 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
            : 'w-8 h-8 border-white/30 bg-transparent'
        }`}
      />

      {/* Center Dot */}
      <div
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
        }}
        className={`fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none transition-colors duration-150 ${
          isHovered ? 'bg-cyan-300 shadow-[0_0_8px_#22d3ee]' : 'bg-white'
        }`}
      />
    </div>
  );
};
