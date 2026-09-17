import React, { useState, useEffect, useRef } from 'react';
import { HeadphoneColor, Hotspot, ShowcaseAngle, AudioMode } from './types';
import { PRODUCT_COLORS, AUDIO_MODES, SHOWCASE_ANGLES } from './data/productData';
import { HeadphoneCanvas } from './components/3d/HeadphoneCanvas';
import { InteractiveHotspotsOverlay } from './components/InteractiveHotspotsOverlay';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductShowcase } from './components/ProductShowcase';
import { InteractiveFeatureSection } from './components/InteractiveFeatureSection';
import { SoundExperienceSection } from './components/SoundExperienceSection';
import { SpecificationsSection } from './components/SpecificationsSection';
import { FinalCTA } from './components/FinalCTA';
import { CheckoutModal } from './components/CheckoutModal';
import { LoadingScreen } from './components/LoadingScreen';
import { CustomCursor } from './components/CustomCursor';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentColor, setCurrentColor] = useState<HeadphoneColor>(PRODUCT_COLORS.black);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [activeAngleId, setActiveAngleId] = useState<ShowcaseAngle | null>(null);
  const [activeAudioMode, setActiveAudioMode] = useState<AudioMode>(AUDIO_MODES[0]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Scroll and section tracking
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [hotspotScreenPositions, setHotspotScreenPositions] = useState<
    Record<string, { x: number; y: number; visible: boolean }>
  >({});

  // Global scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      setScrollProgress(currentProgress);

      // Determine active section based on scroll offset
      const sections = ['hero', 'showcase', 'features', 'sound', 'specs', 'cta'];
      const scrollPos = window.scrollY + window.innerHeight * 0.45;

      for (const sectionId of sections) {
        const el = document.getElementById(`section-${sectionId}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle angle selection from showcase
  const handleSelectAngle = (angleId: ShowcaseAngle | null) => {
    setActiveAngleId(angleId);
    setActiveHotspot(null);
  };

  const currentAngleConfig = activeAngleId
    ? SHOWCASE_ANGLES.find((a) => a.id === activeAngleId)
    : null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070709] text-white selection:bg-cyan-500/25 selection:text-cyan-300">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onLoaded={() => setIsLoading(false)} />}

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Fixed 3D WebGL Canvas Layer */}
      <HeadphoneCanvas
        currentColor={currentColor}
        activeHotspotId={activeHotspot?.id || null}
        onSelectHotspot={setActiveHotspot}
        scrollProgress={scrollProgress}
        currentSection={activeSection}
        isSoundwaveActive={activeSection === 'sound'}
        manualAngle={currentAngleConfig}
        onHotspotsScreenPos={setHotspotScreenPositions}
      />

      {/* Interactive 3D Hotspot HUD Overlay */}
      <InteractiveHotspotsOverlay
        hotspotsPos={hotspotScreenPositions}
        activeHotspotId={activeHotspot?.id || null}
        onSelectHotspot={setActiveHotspot}
        isVisible={activeSection === 'features'}
      />

      {/* Sticky Frosted Navbar */}
      <Navbar
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        activeSection={activeSection}
      />

      {/* Page Content Sections */}
      <main className="relative z-20 flex flex-col">
        {/* 1. Hero Section */}
        <HeroSection
          onExploreClick={() => scrollTo('section-showcase')}
          onBuyNowClick={() => setIsCheckoutOpen(true)}
        />

        {/* 2. Product Showcase */}
        <ProductShowcase
          activeAngleId={activeAngleId}
          onSelectAngle={handleSelectAngle}
        />

        {/* 3. Interactive Feature Section (Exploded Hotspot Architecture) */}
        <InteractiveFeatureSection
          activeHotspotId={activeHotspot?.id || null}
          onSelectHotspot={setActiveHotspot}
        />

        {/* 4. Sound Experience Section (Concentric Soundwaves) */}
        <SoundExperienceSection
          activeAudioMode={activeAudioMode}
          onSelectAudioMode={setActiveAudioMode}
          scrollProgress={scrollProgress}
        />

        {/* 5. Minimalist Technical Specifications */}
        <SpecificationsSection />

        {/* 6. Dramatic Final CTA */}
        <FinalCTA
          currentColor={currentColor}
          onSelectColor={setCurrentColor}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
        />
      </main>

      {/* Interactive Checkout Drawer / Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedColor={currentColor}
        onSelectColor={setCurrentColor}
      />
    </div>
  );
}
