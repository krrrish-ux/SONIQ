import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { HeadphoneColor, Hotspot } from '../../types';
import { buildHeadphoneModel, createStudioEnvironment, HeadphoneMeshGroup } from './headphoneModel';
import { HOTSPOTS } from '../../data/productData';

interface HeadphoneCanvasProps {
  currentColor: HeadphoneColor;
  activeHotspotId: string | null;
  onSelectHotspot: (hotspot: Hotspot | null) => void;
  scrollProgress: number; // 0 to 1 across entire page
  currentSection: string;
  isSoundwaveActive: boolean;
  manualAngle?: { rotX: number; rotY: number; zoom: number } | null;
  onHotspotsScreenPos?: (positions: Record<string, { x: number; y: number; visible: boolean }>) => void;
}

export const HeadphoneCanvas: React.FC<HeadphoneCanvasProps> = ({
  currentColor,
  activeHotspotId,
  onSelectHotspot,
  scrollProgress,
  currentSection,
  isSoundwaveActive,
  manualAngle,
  onHotspotsScreenPos,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // References for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const headphoneGroupRef = useRef<HeadphoneMeshGroup | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Interaction state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const mouseParallaxRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.1, y: -0.4 });
  const currentRotationRef = useRef({ x: 0.1, y: -0.4 });
  const targetZoomRef = useRef(5.2);
  const currentZoomRef = useRef(5.2);
  const targetHeadphonePosRef = useRef({ x: 0, y: 0, z: 0 });
  const currentHeadphonePosRef = useRef({ x: 0, y: 0, z: 0 });

  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Initial Three.js Scene Setup
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const isMobile = width < 768;
    const initialFov = isMobile ? 48 : 38;
    const camera = new THREE.PerspectiveCamera(initialFov, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 6.8 : 5.4);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // Studio Environment
    const studioEnv = createStudioEnvironment(renderer);
    scene.environment = studioEnv;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Key soft light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    // Rim cool strip light (accentuating curves)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 3.0);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    // Warm fill light
    const fillLight = new THREE.DirectionalLight(0xffeedd, 1.2);
    fillLight.position.set(2, -3, 2);
    scene.add(fillLight);

    // Subtle floating dust motes / light particles
    const particleCount = isMobile ? 80 : 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const opacities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      opacities[i] = Math.random() * 0.5 + 0.2;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.03 : 0.045,
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // Build Headphone Model
    const headphone = buildHeadphoneModel(currentColor);
    headphoneGroupRef.current = headphone;
    scene.add(headphone.root);

    setIsLoaded(true);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia interpolation for rotation
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.06;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.06;

      // Mouse parallax addition
      const parallaxX = mouseParallaxRef.current.x * 0.2;
      const parallaxY = mouseParallaxRef.current.y * 0.15;

      if (headphone.root) {
        // Floating gentle breathing motion
        const floatOffset = Math.sin(elapsedTime * 1.4) * 0.06;

        headphone.root.rotation.x = currentRotationRef.current.x + parallaxY;
        headphone.root.rotation.y = currentRotationRef.current.y + parallaxX;
        headphone.root.position.y = currentHeadphonePosRef.current.y + floatOffset;
        headphone.root.position.x = currentHeadphonePosRef.current.x;
        headphone.root.position.z = currentHeadphonePosRef.current.z;

        // Animate soundwaves if active
        if (headphone.soundwaveRings.length > 0) {
          headphone.soundwaveRings.forEach((ring) => {
            const mat = ring.material as THREE.MeshBasicMaterial;
            const data = ring.userData;
            data.phase += delta * 1.8;
            const scale = 1 + (Math.sin(data.phase) * 0.5 + 0.5) * 0.8;
            ring.scale.set(scale, scale, 1);
            mat.opacity = Math.max(0, (1 - (scale - 1) / 0.8) * 0.65);
          });
        }
      }

      // Smooth camera zoom interpolation
      currentZoomRef.current += (targetZoomRef.current - currentZoomRef.current) * 0.08;
      if (cameraRef.current) {
        cameraRef.current.position.z = currentZoomRef.current;
      }

      // Animate floating particles
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += delta * 0.08;
          if (positions[i + 1] > 3.5) {
            positions[i + 1] = -3.5;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.rotation.y = elapsedTime * 0.02;
      }

      // Calculate 2D Screen Positions of Hotspots for React Overlay
      if (onHotspotsScreenPos && containerRef.current && cameraRef.current && headphone.root) {
        const rect = containerRef.current.getBoundingClientRect();
        const positionsMap: Record<string, { x: number; y: number; visible: boolean }> = {};

        headphone.hotspotMarkers.forEach(({ id, object }) => {
          const worldPos = new THREE.Vector3();
          object.getWorldPosition(worldPos);

          // Check if point is facing camera (not occluded from the back)
          const camDir = new THREE.Vector3().subVectors(cameraRef.current!.position, worldPos).normalize();
          // Approximate visibility dot
          const normalApprox = new THREE.Vector3(worldPos.x, worldPos.y, worldPos.z).normalize();
          const dot = normalApprox.dot(camDir);

          const screenPos = worldPos.clone().project(cameraRef.current!);
          const x = ((screenPos.x + 1) * rect.width) / 2;
          const y = ((-screenPos.y + 1) * rect.height) / 2;

          // Visible if on screen and reasonably facing front
          const visible = screenPos.z < 1 && dot > -0.25;

          positionsMap[id] = { x, y, visible };
        });

        onHotspotsScreenPos(positionsMap);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      const isMob = newWidth < 768;

      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.fov = isMob ? 48 : 38;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(newWidth, newHeight);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      studioEnv.dispose();
      scene.clear();
    };
  }, []);

  // 2. Synchronize Headphone Material Color
  useEffect(() => {
    if (headphoneGroupRef.current) {
      headphoneGroupRef.current.updateColor(currentColor);
    }
  }, [currentColor]);

  // 3. Synchronize Soundwave Visibility
  useEffect(() => {
    if (headphoneGroupRef.current) {
      headphoneGroupRef.current.setSoundwavesActive(isSoundwaveActive);
    }
  }, [isSoundwaveActive]);

  // 4. Update Target Camera & Rotation Based on Section / Scroll
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const baseZoom = isMobile ? 6.6 : 5.4;

    if (manualAngle) {
      targetRotationRef.current = { x: manualAngle.rotX, y: manualAngle.rotY };
      targetZoomRef.current = manualAngle.zoom * (isMobile ? 1.25 : 1.0);
      return;
    }

    if (activeHotspotId) {
      const spot = HOTSPOTS.find((h) => h.id === activeHotspotId);
      if (spot) {
        targetRotationRef.current = {
          x: spot.cameraTarget.rotX,
          y: spot.cameraTarget.rotY,
        };
        targetZoomRef.current = (spot.cameraTarget.zoom - 0.2) * (isMobile ? 1.2 : 1.0);
        return;
      }
    }

    // Scroll-driven choreographies across sections
    switch (currentSection) {
      case 'hero':
        targetRotationRef.current = {
          x: 0.12,
          y: -0.4 + scrollProgress * 1.5,
        };
        targetZoomRef.current = baseZoom;
        currentHeadphonePosRef.current = { x: 0, y: 0, z: 0 };
        break;

      case 'showcase':
        targetRotationRef.current = {
          x: 0.25,
          y: 0.65 + scrollProgress * 1.2,
        };
        targetZoomRef.current = baseZoom * 0.92;
        currentHeadphonePosRef.current = { x: isMobile ? 0 : 0.4, y: 0, z: 0 };
        break;

      case 'features':
        targetRotationRef.current = {
          x: 0.15,
          y: -0.2,
        };
        targetZoomRef.current = baseZoom * 0.88;
        currentHeadphonePosRef.current = { x: 0, y: 0, z: 0 };
        break;

      case 'sound':
        targetRotationRef.current = {
          x: 0.0,
          y: Math.PI / 2 + Math.sin(scrollProgress * 4) * 0.3,
        };
        targetZoomRef.current = baseZoom * 0.95;
        currentHeadphonePosRef.current = { x: 0, y: -0.1, z: 0 };
        break;

      case 'specs':
        targetRotationRef.current = {
          x: 0.35,
          y: -1.2 + scrollProgress * 0.8,
        };
        targetZoomRef.current = baseZoom * 0.92;
        currentHeadphonePosRef.current = { x: isMobile ? 0 : -0.5, y: 0.1, z: 0 };
        break;

      case 'cta':
        targetRotationRef.current = {
          x: 0.1,
          y: 0.2 + scrollProgress * 0.5,
        };
        targetZoomRef.current = baseZoom * 1.05;
        currentHeadphonePosRef.current = { x: 0, y: -0.1, z: 0 };
        break;

      default:
        targetRotationRef.current = {
          x: 0.15,
          y: -0.4 + scrollProgress * 3.0,
        };
        break;
    }
  }, [currentSection, scrollProgress, activeHotspotId, manualAngle]);

  // 5. User Mouse / Touch 360° Drag & Parallax Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Parallax tracking
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      mouseParallaxRef.current = { x: normX, y: normY };
    }

    // Direct 360 drag rotation
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    targetRotationRef.current.y += deltaX * 0.007;
    targetRotationRef.current.x += deltaY * 0.005;

    // Clamp vertical tilt to prevent unnatural flipping
    targetRotationRef.current.x = Math.max(-1.1, Math.min(1.1, targetRotationRef.current.x));

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
    const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x += deltaY * 0.006;
    targetRotationRef.current.x = Math.max(-1.0, Math.min(1.0, targetRotationRef.current.x));

    previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      id="three-canvas-container"
      className="fixed inset-0 pointer-events-auto z-10 select-none overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Subdued ambient corner vignettes */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,7,9,0.75)_100%)]" />

      {/* Subtle interaction tip on desktop */}
      <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/60 backdrop-blur-md border border-white/5 text-[11px] font-mono-tech tracking-wider text-zinc-400 pointer-events-none opacity-60 hover:opacity-100 transition-opacity">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        DRAG TO ROTATE 360°
      </div>
    </div>
  );
};
