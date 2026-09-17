import * as THREE from 'three';
import { HeadphoneColor } from '../../types';

export interface HeadphoneMeshGroup {
  root: THREE.Group;
  metalMaterials: THREE.MeshStandardMaterial[];
  cushionMaterials: THREE.MeshStandardMaterial[];
  accentMaterials: THREE.MeshBasicMaterial[];
  soundwaveRings: THREE.Mesh[];
  hotspotMarkers: { id: string; object: THREE.Object3D }[];
  updateColor: (color: HeadphoneColor) => void;
  setSoundwavesActive: (active: boolean, speedMultiplier?: number) => void;
}

/**
 * Creates an equirectangular studio environment texture procedurally
 * to simulate high-end studio photography lighting (softboxes & rim lights).
 */
export function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark studio gradient background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, '#0a0d14');
  bgGrad.addColorStop(0.5, '#050608');
  bgGrad.addColorStop(1, '#020304');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Softbox 1: Overhead key softbox (broad warm white)
  const softboxTop = ctx.createRadialGradient(512, 100, 10, 512, 100, 200);
  softboxTop.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  softboxTop.addColorStop(0.4, 'rgba(230, 240, 255, 0.7)');
  softboxTop.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = softboxTop;
  ctx.fillRect(200, 0, 624, 250);

  // Softbox 2: Left rim strip light (cool cyan tint)
  const stripLeft = ctx.createLinearGradient(100, 0, 200, 0);
  stripLeft.addColorStop(0, 'rgba(0, 0, 0, 0)');
  stripLeft.addColorStop(0.5, 'rgba(165, 220, 255, 0.9)');
  stripLeft.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = stripLeft;
  ctx.fillRect(100, 80, 100, 350);

  // Softbox 3: Right rim strip light (clean white)
  const stripRight = ctx.createLinearGradient(824, 0, 924, 0);
  stripRight.addColorStop(0, 'rgba(0, 0, 0, 0)');
  stripRight.addColorStop(0.5, 'rgba(240, 245, 255, 0.85)');
  stripRight.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = stripRight;
  ctx.fillRect(824, 80, 100, 350);

  // Ground bounce reflection
  const groundBounce = ctx.createLinearGradient(0, 400, 0, 512);
  groundBounce.addColorStop(0, 'rgba(0, 0, 0, 0)');
  groundBounce.addColorStop(1, 'rgba(60, 70, 90, 0.25)');
  ctx.fillStyle = groundBounce;
  ctx.fillRect(0, 400, 1024, 112);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Builds the complete 3D realistic stylized headphone model using Three.js geometry.
 */
export function buildHeadphoneModel(initialColor: HeadphoneColor): HeadphoneMeshGroup {
  const root = new THREE.Group();
  root.name = 'headphone_root';

  const metalMaterials: THREE.MeshStandardMaterial[] = [];
  const cushionMaterials: THREE.MeshStandardMaterial[] = [];
  const accentMaterials: THREE.MeshBasicMaterial[] = [];
  const soundwaveRings: THREE.Mesh[] = [];
  const hotspotMarkers: { id: string; object: THREE.Object3D }[] = [];

  // Primary metallic material (Earcups, gimbals, sliders)
  const metalMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(initialColor.metalColor),
    metalness: initialColor.metalness,
    roughness: initialColor.roughness,
    envMapIntensity: 1.4,
  });
  metalMaterials.push(metalMat);

  // Polished chrome chamfer material for bevels and hardware
  const chromeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#d4d4d8'),
    metalness: 0.98,
    roughness: 0.1,
    envMapIntensity: 2.0,
  });
  metalMaterials.push(chromeMat);

  // Matte ear cushion leatherette material
  const cushionMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(initialColor.cushionColor),
    metalness: 0.1,
    roughness: 0.75,
    envMapIntensity: 0.5,
  });
  cushionMaterials.push(cushionMat);

  // Acoustic grille material (perforated inner speaker baffle)
  const grilleMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0a0c10'),
    metalness: 0.4,
    roughness: 0.6,
  });

  // Glowing status LED / accent material
  const accentLedMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(initialColor.accentColor),
  });
  accentMaterials.push(accentLedMat);

  // Headband mesh fabric material
  const fabricMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1c1d22'),
    metalness: 0.15,
    roughness: 0.9,
  });

  // Earcups distance spacing
  const cupSpacing = 1.38;

  // Helper to construct one earcup assembly
  const createEarcupAssembly = (isRight: boolean) => {
    const cupGroup = new THREE.Group();
    cupGroup.name = isRight ? 'right_earcup' : 'left_earcup';
    const sideSign = isRight ? 1 : -1;
    cupGroup.position.set(sideSign * cupSpacing, -0.3, 0);

    // Subtle ergonomic inward angle
    cupGroup.rotation.y = sideSign * 0.08;
    cupGroup.rotation.z = sideSign * -0.05;

    // 1. Main outer shell (tapered ergonomic cup)
    const shellGeo = new THREE.CylinderGeometry(0.72, 0.78, 0.38, 48, 1);
    shellGeo.rotateZ(Math.PI / 2);
    shellGeo.scale(1, 1.18, 0.92); // Ergonomic oval ear profile
    const shellMesh = new THREE.Mesh(shellGeo, metalMat);
    shellMesh.castShadow = true;
    shellMesh.receiveShadow = true;
    cupGroup.add(shellMesh);

    // 2. Polished chamfered outer trim ring
    const trimGeo = new THREE.TorusGeometry(0.74, 0.022, 16, 48);
    trimGeo.rotateY(Math.PI / 2);
    trimGeo.scale(1, 1.18, 0.92);
    trimGeo.translate(sideSign * 0.17, 0, 0);
    const trimMesh = new THREE.Mesh(trimGeo, chromeMat);
    cupGroup.add(trimMesh);

    // 3. Capacitive glass touch plate (outer disc)
    const plateGeo = new THREE.CylinderGeometry(0.66, 0.66, 0.03, 48);
    plateGeo.rotateZ(Math.PI / 2);
    plateGeo.scale(1, 1.16, 0.9);
    plateGeo.translate(sideSign * 0.19, 0, 0);
    const plateMesh = new THREE.Mesh(plateGeo, metalMat);
    cupGroup.add(plateMesh);

    // Concentric micro-groove ring on touch plate
    const grooveGeo = new THREE.RingGeometry(0.35, 0.36, 48);
    grooveGeo.rotateY(sideSign > 0 ? Math.PI / 2 : -Math.PI / 2);
    grooveGeo.translate(sideSign * 0.208, 0, 0);
    const grooveMesh = new THREE.Mesh(grooveGeo, chromeMat);
    cupGroup.add(grooveMesh);

    // 4. Memory foam ear cushion
    // Plush torus cushion angled towards the head
    const cushionGeo = new THREE.TorusGeometry(0.68, 0.18, 24, 48);
    cushionGeo.rotateY(Math.PI / 2);
    cushionGeo.scale(1, 1.22, 0.96);
    cushionGeo.translate(-sideSign * 0.22, 0, 0);
    const cushionMesh = new THREE.Mesh(cushionGeo, cushionMat);
    cushionMesh.castShadow = true;
    cupGroup.add(cushionMesh);

    // 5. Driver baffle & acoustic grille (inside the cushion)
    const driverGeo = new THREE.CircleGeometry(0.6, 36);
    driverGeo.rotateY(sideSign > 0 ? -Math.PI / 2 : Math.PI / 2);
    driverGeo.translate(-sideSign * 0.28, 0, 0);
    const driverMesh = new THREE.Mesh(driverGeo, grilleMat);
    cupGroup.add(driverMesh);

    // Inner driver core badge
    const coreGeo = new THREE.RingGeometry(0.12, 0.24, 32);
    coreGeo.rotateY(sideSign > 0 ? -Math.PI / 2 : Math.PI / 2);
    coreGeo.translate(-sideSign * 0.282, 0, 0);
    const coreMesh = new THREE.Mesh(coreGeo, chromeMat);
    cupGroup.add(coreMesh);

    // 6. Gimbal yoke fork (attaches cup to slider)
    const yokeGroup = new THREE.Group();
    yokeGroup.name = isRight ? 'right_yoke' : 'left_yoke';

    // Outer curved arch embracing the cup
    const yokeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(sideSign * 0.05, -0.65, 0),
      new THREE.Vector3(sideSign * 0.24, 0, 0.5),
      new THREE.Vector3(sideSign * 0.24, 0.65, 0),
      new THREE.Vector3(sideSign * 0.24, 0, -0.5),
      new THREE.Vector3(sideSign * 0.05, -0.65, 0),
    ]);
    const yokeGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.4, 16);
    yokeGeo.rotateZ(sideSign * -0.15);
    yokeGeo.translate(sideSign * 0.22, 0.15, 0);
    const yokeMesh = new THREE.Mesh(yokeGeo, chromeMat);
    yokeGroup.add(yokeMesh);

    // Pivot axle joint
    const pivotGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.08, 24);
    pivotGeo.rotateZ(Math.PI / 2);
    pivotGeo.translate(sideSign * 0.22, 0.72, 0);
    const pivotMesh = new THREE.Mesh(pivotGeo, chromeMat);
    yokeGroup.add(pivotMesh);

    cupGroup.add(yokeGroup);

    // 7. Small micro-details:
    // ANC microphone grill pinholes
    const micGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.02, 12);
    micGeo.rotateX(Math.PI / 2);
    micGeo.translate(sideSign * 0.12, -0.62, 0.38);
    const micMesh = new THREE.Mesh(micGeo, chromeMat);
    cupGroup.add(micMesh);

    // LED ring on right cup
    if (isRight) {
      const ledGeo = new THREE.RingGeometry(0.66, 0.675, 48);
      ledGeo.rotateY(Math.PI / 2);
      ledGeo.translate(0.198, 0, 0);
      const ledMesh = new THREE.Mesh(ledGeo, accentLedMat);
      cupGroup.add(ledMesh);

      // USB-C port cutout on bottom of right cup
      const portGeo = new THREE.BoxGeometry(0.04, 0.025, 0.08);
      portGeo.translate(0, -0.82, 0);
      const portMesh = new THREE.Mesh(portGeo, chromeMat);
      cupGroup.add(portMesh);
    }

    return cupGroup;
  };

  const leftCup = createEarcupAssembly(false);
  const rightCup = createEarcupAssembly(true);
  root.add(leftCup);
  root.add(rightCup);

  // 8. Headband Arch Assembly
  const headbandGroup = new THREE.Group();
  headbandGroup.name = 'headband_group';

  // Arched spline for sleek ergonomic curve
  const archCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-cupSpacing + 0.1, 0.45, 0),
    new THREE.Vector3(0, 2.05, 0),
    new THREE.Vector3(cupSpacing - 0.1, 0.45, 0)
  );

  // Main extruded headband band
  const bandPoints = archCurve.getPoints(40);
  const bandShape = new THREE.Shape();
  bandShape.moveTo(-0.16, -0.025);
  bandShape.lineTo(0.16, -0.025);
  bandShape.lineTo(0.16, 0.025);
  bandShape.lineTo(-0.16, 0.025);
  bandShape.closePath();

  const bandExtrudeSettings = {
    steps: 50,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 3,
    extrudePath: archCurve,
  };
  const bandGeo = new THREE.ExtrudeGeometry(bandShape, bandExtrudeSettings);
  const bandMesh = new THREE.Mesh(bandGeo, metalMat);
  bandMesh.castShadow = true;
  headbandGroup.add(bandMesh);

  // Inner memory cushion on the underside of headband
  const cushionCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-cupSpacing * 0.65, 0.95, 0),
    new THREE.Vector3(0, 1.95, 0),
    new THREE.Vector3(cupSpacing * 0.65, 0.95, 0)
  );
  const cushionBandGeo = new THREE.TubeGeometry(cushionCurve, 30, 0.07, 16, false);
  cushionBandGeo.scale(1, 0.6, 1.8);
  const cushionBandMesh = new THREE.Mesh(cushionBandGeo, fabricMat);
  headbandGroup.add(cushionBandMesh);

  // Telescoping extension sliders on left & right
  const createSliderStem = (isRight: boolean) => {
    const sideSign = isRight ? 1 : -1;
    const stemGroup = new THREE.Group();
    stemGroup.position.set(sideSign * (cupSpacing - 0.14), 0.55, 0);
    stemGroup.rotation.z = sideSign * -0.22;

    const sliderGeo = new THREE.BoxGeometry(0.06, 0.45, 0.14);
    const sliderMesh = new THREE.Mesh(sliderGeo, chromeMat);
    stemGroup.add(sliderMesh);

    // Laser-etched scale tick notches
    for (let i = -3; i <= 3; i++) {
      const notchGeo = new THREE.BoxGeometry(0.064, 0.008, 0.08);
      notchGeo.translate(0, i * 0.045, 0);
      const notchMesh = new THREE.Mesh(notchGeo, metalMat);
      stemGroup.add(notchMesh);
    }
    return stemGroup;
  };

  headbandGroup.add(createSliderStem(false));
  headbandGroup.add(createSliderStem(true));
  root.add(headbandGroup);

  // 9. Soundwave concentric rings (originating from cups for Sound Experience section)
  const soundwavesGroup = new THREE.Group();
  soundwavesGroup.name = 'soundwaves_group';
  soundwavesGroup.visible = false;

  const ringRadii = [0.9, 1.3, 1.75, 2.2, 2.7];
  ringRadii.forEach((r, idx) => {
    const ringGeo = new THREE.RingGeometry(r, r + 0.025, 64);
    ringGeo.rotateY(Math.PI / 2);

    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(initialColor.accentColor),
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    // Left soundwave ring
    const leftRing = new THREE.Mesh(ringGeo, ringMat);
    leftRing.position.set(-cupSpacing, -0.3, 0);
    leftRing.userData = { initialRadius: r, phase: idx * 0.5, speed: 0.015 };
    soundwavesGroup.add(leftRing);
    soundwaveRings.push(leftRing);

    // Right soundwave ring
    const rightRing = new THREE.Mesh(ringGeo, ringMat.clone());
    rightRing.position.set(cupSpacing, -0.3, 0);
    rightRing.userData = { initialRadius: r, phase: idx * 0.5, speed: 0.015 };
    soundwavesGroup.add(rightRing);
    soundwaveRings.push(rightRing);
  });
  root.add(soundwavesGroup);

  // 10. Floating subtle product shadow plane (contact shadow underneath)
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const sCtx = shadowCanvas.getContext('2d')!;
  const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
  sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
  sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  sCtx.fillStyle = sGrad;
  sCtx.fillRect(0, 0, 256, 256);

  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeo = new THREE.PlaneGeometry(4.5, 4.5);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = -1.65;
  root.add(shadowMesh);

  // 11. Interactive Hotspot anchors (Object3D anchors attached to the model)
  const hotspotIds = ['drivers', 'cushions', 'controls', 'microphones', 'usbc', 'battery'];
  hotspotIds.forEach((id) => {
    const anchor = new THREE.Object3D();
    anchor.name = `hotspot_${id}`;
    // Position matching productData coordinates
    if (id === 'drivers') anchor.position.set(-cupSpacing, -0.3, 0);
    if (id === 'cushions') anchor.position.set(-cupSpacing + 0.2, -0.4, 0.3);
    if (id === 'controls') anchor.position.set(cupSpacing + 0.2, -0.2, 0);
    if (id === 'microphones') anchor.position.set(cupSpacing + 0.1, -0.7, 0.3);
    if (id === 'usbc') anchor.position.set(cupSpacing * 0.7, -1.1, 0.1);
    if (id === 'battery') anchor.position.set(-cupSpacing * 0.7, -1.0, -0.1);
    root.add(anchor);
    hotspotMarkers.push({ id, object: anchor });
  });

  // Dynamic color updating function
  const updateColor = (color: HeadphoneColor) => {
    metalMat.color.set(color.metalColor);
    metalMat.metalness = color.metalness;
    metalMat.roughness = color.roughness;

    cushionMat.color.set(color.cushionColor);

    accentLedMat.color.set(color.accentColor);
    soundwaveRings.forEach((r) => {
      (r.material as THREE.MeshBasicMaterial).color.set(color.accentColor);
    });
  };

  const setSoundwavesActive = (active: boolean) => {
    soundwavesGroup.visible = active;
  };

  return {
    root,
    metalMaterials,
    cushionMaterials,
    accentMaterials,
    soundwaveRings,
    hotspotMarkers,
    updateColor,
    setSoundwavesActive,
  };
}
