import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ShoppingBag } from 'lucide-react';
import { toggleSpatialAudio, isAudioActive } from '../utils/audioSynth';

interface NavbarProps {
  onOpenCheckout: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCheckout, activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleAudio = () => {
    toggleSpatialAudio((playing) => {
      setIsAudioPlaying(playing);
    });
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'PRODUCT', id: 'section-hero' },
    { label: 'FEATURES', id: 'section-features' },
    { label: 'SPECS', id: 'section-specs' },
    { label: 'EXPERIENCE', id: 'section-sound' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#070709]/80 backdrop-blur-xl border-b border-white/[0.06] py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Wordmark */}
        <button
          onClick={() => scrollToSection('section-hero')}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <span className="text-xl sm:text-2xl font-black tracking-[0.2em] font-display text-white transition-transform duration-300 group-hover:scale-105">
            SONIQ
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:shadow-[0_0_8px_#22d3ee] transition-shadow" />
        </button>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id.replace('section-', '');
            return (
              <button
                key={link.id}
                id={`nav-${link.id}`}
                onClick={() => scrollToSection(link.id)}
                className={`text-[12px] font-mono-tech tracking-[0.2em] transition-all duration-200 relative py-1 ${
                  isActive
                    ? 'text-cyan-300 font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Audio toggle & CTA */}
        <div className="flex items-center gap-3">
          {/* Spatial Sound Audio Synthesizer Switch */}
          <button
            id="audio-synth-toggle"
            onClick={handleToggleAudio}
            title={isAudioPlaying ? 'Mute Spatial Tone' : 'Experience Spatial Sound (Synthesizer)'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono-tech transition-all duration-300 ${
              isAudioPlaying
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
            }`}
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline text-[10px] tracking-wider">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px] tracking-wider">AUDIO OFF</span>
              </>
            )}
          </button>

          {/* BUY NOW Button */}
          <button
            id="navbar-buy-btn"
            onClick={onOpenCheckout}
            className="group relative px-5 py-2 rounded-full overflow-hidden text-xs font-mono-tech font-semibold tracking-wider text-black bg-white hover:bg-cyan-400 transition-colors duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>BUY NOW</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070709]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 mt-3 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-left text-sm font-mono-tech tracking-[0.2em] text-zinc-300 hover:text-cyan-400 py-2 border-b border-white/5"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 flex justify-between items-center">
            <button
              onClick={handleToggleAudio}
              className="text-xs font-mono-tech text-zinc-400 flex items-center gap-2"
            >
              {isAudioPlaying ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
              {isAudioPlaying ? 'MUTE AUDIO' : 'PLAY SPATIAL TONE'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCheckout();
              }}
              className="px-4 py-2 rounded-full bg-cyan-400 text-black text-xs font-mono-tech font-bold"
            >
              BUY NOW — $299
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
