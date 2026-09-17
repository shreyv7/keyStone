import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EcosystemNode, EcosystemEdge, PropagationPath } from '../types';
import { useTheme } from '../context/ThemeContext';
import { ChevronUp, ChevronDown, Layers } from 'lucide-react';

interface EcosystemGraphProps {
  nodes: EcosystemNode[];
  edges: EcosystemEdge[];
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onHoverNode: (nodeId: string | null, mousePos: { x: number; y: number } | null) => void;
  showStructuralSize: boolean;
  simulationPhase: 'idle' | 'preparing' | 'simulating' | 'active_compromise' | 'mitigation_computed' | 'mitigation_applied';
  activePropagationPath: PropagationPath | null;
  compromisedNodeIds: Set<string>;
  severedEdgeIds: Set<string>;
  highlightedNodeIds?: Set<string>;
  timeTravelDay?: number;
  autoRotate?: boolean;
  showDominatorMode?: boolean;
  scopeFilter?: 'all' | 'production' | 'dev';
  channelFilter?: 'all' | 'runtime' | 'build';
  depthFilter?: number;
  showP1Only?: boolean;
  showClusters?: boolean;
  isKeystoneFocused?: boolean;
}

export const EcosystemGraph: React.FC<EcosystemGraphProps> = ({
  nodes,
  edges,
  selectedNodeId,
  hoveredNodeId,
  onSelectNode,
  onHoverNode,
  showStructuralSize,
  simulationPhase,
  activePropagationPath,
  compromisedNodeIds,
  severedEdgeIds,
  highlightedNodeIds,
  timeTravelDay = 0,
  autoRotate = false,
  showDominatorMode = false,
  scopeFilter = 'all',
  channelFilter = 'all',
  depthFilter = 0,
  showP1Only = false,
  showClusters = false,
  isKeystoneFocused = false,
}) => {
  const { isLight } = useTheme();
  const [isStratumExpanded, setIsStratumExpanded] = useState<boolean>(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Mesh registries for fast updates and raycasting
  const nodeMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const edgeLinesRef = useRef<Map<string, { line: THREE.Line; baseColor: THREE.Color; isProp: boolean }>>(new Map());
  const pulseParticlesRef = useRef<THREE.Points | null>(null);
  const pulsePositionsRef = useRef<Float32Array | null>(null);
  const pulseProgressRef = useRef<Float32Array | null>(null);
  const pulseEdgeMappingRef = useRef<Array<{ edge: EcosystemEdge; p1: THREE.Vector3; p2: THREE.Vector3 }>>([]);
  const starMatRef = useRef<THREE.PointsMaterial | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const dirLight1Ref = useRef<THREE.DirectionalLight | null>(null);
  const dirLight2Ref = useRef<THREE.DirectionalLight | null>(null);
  const layerRingsRef = useRef<THREE.Mesh[]>([]);
  const lightningParticlesRef = useRef<THREE.Points | null>(null);
  const lightningPositionsRef = useRef<Float32Array | null>(null);
  const lightningProgressRef = useRef<Float32Array | null>(null);
  const allEdgeEndpointsRef = useRef<Array<{ id: string; p1: THREE.Vector3; p2: THREE.Vector3 }>>([]);

  // Camera animation target
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetLookAtRef = useRef<THREE.Vector3 | null>(null);

  // Default initial camera locked vertically at an optimal elevation (~81 degrees)
  const FIXED_POLAR_ANGLE = Math.PI * 0.45;
  const DEFAULT_CAM_DISTANCE = 92;
  const DEFAULT_CAM_POS = new THREE.Vector3(
    0,
    DEFAULT_CAM_DISTANCE * Math.cos(FIXED_POLAR_ANGLE),
    DEFAULT_CAM_DISTANCE * Math.sin(FIXED_POLAR_ANGLE)
  );
  const DEFAULT_LOOK_AT = new THREE.Vector3(0, 0, 0);

  // Dependency Cone Calculation for strict chokepoint / blast radius isolation
  const dependencyCone = useMemo(() => {
    const focusId = selectedNodeId || (isKeystoneFocused ? 'snakeyaml' : null);
    if (!focusId) return null;

    // Upstream dependents (reaching upwards towards sinks L5)
    // Edge: source (upstream/dependency) -> target (downstream/dependent)
    const ancestors = new Set<string>();
    const upQueue = [focusId];
    while (upQueue.length > 0) {
      const curr = upQueue.shift()!;
      edges.forEach(e => {
        if (e.source === curr && !ancestors.has(e.target)) {
          ancestors.add(e.target);
          upQueue.push(e.target);
        }
      });
    }

    // Downward dependencies (reaching downwards towards foundational L1)
    const descendants = new Set<string>();
    const downQueue = [focusId];
    while (downQueue.length > 0) {
      const curr = downQueue.shift()!;
      edges.forEach(e => {
        if (e.target === curr && !descendants.has(e.source)) {
          descendants.add(e.source);
          downQueue.push(e.source);
        }
      });
    }

    const allConeNodes = new Set<string>([focusId, ...ancestors, ...descendants]);
    const coneEdges = new Set<string>();
    edges.forEach(e => {
      if (allConeNodes.has(e.source) && allConeNodes.has(e.target)) {
        coneEdges.add(e.id);
      }
    });

    return { focusId, allConeNodes, coneEdges, ancestors, descendants };
  }, [selectedNodeId, isKeystoneFocused, edges]);

  // Keep dependencyConeRef synced for 60fps animation loop
  const dependencyConeRef = useRef(dependencyCone);
  useEffect(() => {
    dependencyConeRef.current = dependencyCone;
  }, [dependencyCone]);

  // Node sizes: strict SC (Systemic Centrality) vs Conventional Vulnerability mapping
  const getNodeRadius = useCallback(
    (node: EcosystemNode) => {
      if (showStructuralSize) {
        if (node.id === 'snakeyaml') {
          // Dynamic time-travel expansion: from Day -90 (2.0) -> Day -30 (3.8) -> Day 0 (5.8)
          if (timeTravelDay <= -60) return 2.0;
          if (timeTravelDay <= -30) {
            const t = (timeTravelDay - (-60)) / 30;
            return 2.0 + t * 1.8;
          }
          const t = (timeTravelDay - (-30)) / 30;
          return 3.8 + t * 2.0;
        }
        // Strict SC formula: from 1.2 to 4.8 strictly proportional to systemicScore (0 to 100)
        const sc = (node.systemicScore || 0) / 100;
        return 1.2 + sc * 3.6;
      }
      
      // Conventional Vulnerability View Mode (Feature 11 Popularity Paradox):
      // Nodes are scaled strictly by conventional CVSS/OpenSSF score
      // A chokepoint like snakeyaml (CVSS 0, OpenSSF 48) appears as a tiny, inconspicuous dot (1.4)
      const conv = (node.conventionalScore || 30) / 100;
      return 1.0 + conv * 1.6;
    },
    [showStructuralSize, timeTravelDay]
  );

  // Node color resolution based on state, risk and simulation phase
  const getNodeColors = useCallback(
    (node: EcosystemNode) => {
      const isSelected = node.id === selectedNodeId;
      const isHovered = node.id === hoveredNodeId;
      const isCompromised = compromisedNodeIds.has(node.id);
      const isHighlighted = highlightedNodeIds?.has(node.id);
      const isPathActive = activePropagationPath?.nodeIds.includes(node.id);
      const isIntervention = node.id === 'internal-data-pipeline' && 
        (simulationPhase === 'mitigation_computed' || simulationPhase === 'mitigation_applied');
      const isInsulated = simulationPhase === 'mitigation_applied' && node.category === 'tier1-asset';

      if (isInsulated) {
        return {
          main: 0x10b981, // Emerald green for insulated asset
          emissive: 0x059669,
          emissiveIntensity: 0.9,
          ringColor: 0x34d399
        };
      }

      if (isIntervention) {
        return {
          main: 0x06b6d4, // Cyan electric for intervention node
          emissive: 0x0891b2,
          emissiveIntensity: 1.2,
          ringColor: 0x38bdf8
        };
      }

      if (isCompromised) {
        return {
          main: 0xef4444, // Bright crimson red
          emissive: 0xdc2626,
          emissiveIntensity: node.id === 'snakeyaml' ? 1.6 : 1.1,
          ringColor: 0xf87171
        };
      }

      // Time travel stealth simulation with continuous progressive states
      if (node.id === 'snakeyaml') {
        if (timeTravelDay <= -60) {
          return { main: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 0.4, ringColor: 0x60a5fa };
        }
        if (timeTravelDay < -15) {
          const progress = (-timeTravelDay - 15) / 45;
          return { 
            main: 0xf59e0b, 
            emissive: 0xd97706, 
            emissiveIntensity: 0.7 + (1 - progress) * 0.4, 
            ringColor: 0xfbbf24 
          };
        }
        // Day -15 to Day 0
        const progress = -timeTravelDay / 15;
        return { 
          main: 0xf43f5e, 
          emissive: 0xe11d48, 
          emissiveIntensity: 1.1 + (1 - progress) * 0.5, 
          ringColor: 0xfb7185 
        };
      }

      if (isPathActive) {
        return {
          main: 0xf97316, // Orange active path
          emissive: 0xea580c,
          emissiveIntensity: 1.0,
          ringColor: 0xfba94c
        };
      }

      if (isHighlighted) {
        return {
          main: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 1.1,
          ringColor: 0x7dd3fc
        };
      }

      // Feature 11: Conventional Vulnerability Perspective Coloring
      if (!showStructuralSize && node.category !== 'tier1-asset' && node.category !== 'application') {
        if (node.conventionalSeverity === 'CRITICAL' || node.conventionalScore >= 80) {
          return { main: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.8, ringColor: 0xf87171 };
        }
        if (node.conventionalSeverity === 'HIGH' || node.conventionalScore >= 65) {
          return { main: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.6, ringColor: 0xfb923c };
        }
        if (node.conventionalSeverity === 'MODERATE' || node.conventionalScore >= 45) {
          return { main: 0xeab308, emissive: 0xca8a04, emissiveIntensity: 0.4, ringColor: 0xfde047 };
        }
        // Low conventional score / no active advisory -> innocuous green dot
        return { main: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.4, ringColor: 0x34d399 };
      }

      // Default palette by category/tier
      if (node.category === 'tier1-asset') {
        return {
          main: 0x1755e6, // Primary Cobalt Blue for Tier-1
          emissive: 0x0f3da8,
          emissiveIntensity: 0.6,
          ringColor: 0x4682f9
        };
      }
      if (node.category === 'application') {
        return {
          main: 0x2e70ee, // Royal Blue
          emissive: 0x1a54c4,
          emissiveIntensity: 0.4,
          ringColor: 0x60a5fa
        };
      }
      if (node.category === 'service') {
        return {
          main: 0x60a5fa, // Sky Blue
          emissive: 0x2563eb,
          emissiveIntensity: 0.3,
          ringColor: 0x93c5fd
        };
      }
      if (node.category === 'internal-lib') {
        return {
          main: 0x64748b, // Slate Steel
          emissive: 0x334155,
          emissiveIntensity: 0.3,
          ringColor: 0x94a3b8
        };
      }
      // Open source
      return {
        main: 0x334155, // Dark Slate Keystones
        emissive: 0x1e293b,
        emissiveIntensity: 0.2,
        ringColor: 0x475569
      };
    },
    [selectedNodeId, hoveredNodeId, compromisedNodeIds, highlightedNodeIds, activePropagationPath, simulationPhase, timeTravelDay, showStructuralSize]
  );

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    const bgHex = isLight ? 0xffffff : 0x080616;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, isLight ? 0.0035 : 0.0055);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.copy(DEFAULT_CAM_POS);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLight ? 1.15 : 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Controls - Turntable Orbit (strictly fixed on X-axis elevation, rotates around Y-axis)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minPolarAngle = FIXED_POLAR_ANGLE;
    controls.maxPolarAngle = FIXED_POLAR_ANGLE;
    controls.enablePan = false;
    controls.minDistance = 40;
    controls.maxDistance = 145;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.6;
    controlsRef.current = controls;

    // 5. Subtle ambient & directional lights
    const ambientLight = new THREE.AmbientLight(isLight ? 0xffffff : 0xdbeafe, isLight ? 1.3 : 0.9);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight1 = new THREE.DirectionalLight(isLight ? 0x0284c7 : 0x38bdf8, isLight ? 1.1 : 1.4);
    dirLight1.position.set(40, 60, 40);
    scene.add(dirLight1);
    dirLight1Ref.current = dirLight1;

    const dirLight2 = new THREE.DirectionalLight(isLight ? 0x6366f1 : 0x818cf8, isLight ? 0.8 : 0.9);
    dirLight2.position.set(-40, -30, -30);
    scene.add(dirLight2);
    dirLight2Ref.current = dirLight2;

    // 6. Atmospheric Layer Guides (Subtle circular spatial planes for layers 1 to 5)
    const layerYCoords = [-32, -15, 2, 20, 35];
    layerRingsRef.current = [];
    
    layerYCoords.forEach((y, i) => {
      const ringRadius = 45 - Math.abs(y) * 0.3;
      const ringGeo = new THREE.RingGeometry(ringRadius - 0.2, ringRadius, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 4 ? (isLight ? 0x1755e6 : 0x2e70ee) : (isLight ? 0x94a3b8 : 0x334155),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isLight ? 0.25 : 0.12
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = y;
      scene.add(ringMesh);
      layerRingsRef.current.push(ringMesh);
    });

    // 7. Subtle background particle stars
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 350;
      starPositions[i + 1] = (Math.random() - 0.5) * 250;
      starPositions[i + 2] = (Math.random() - 0.5) * 350;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: isLight ? 0x94a3b8 : 0x64748b,
      size: isLight ? 0.7 : 0.8,
      transparent: true,
      opacity: isLight ? 0.3 : 0.45
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);
    starMatRef.current = starMat;

    // 8. Build Edge Mesh geometry with Batched High-Performance Pipeline (P3-8)
    const nodeMap = new Map<string, EcosystemNode>(nodes.map(n => [n.id, n]));
    const edgeLines = new Map<string, { line: THREE.Line; baseColor: THREE.Color; isProp: boolean }>();
    const propEdgesForPulse: Array<{ edge: EcosystemEdge; p1: THREE.Vector3; p2: THREE.Vector3 }> = [];

    // Pre-allocated buffers for large portfolio edge rendering
    const batchedPositions: number[] = [];
    const batchedColors: number[] = [];

    edges.forEach(edge => {
      const src = nodeMap.get(edge.source);
      const tgt = nodeMap.get(edge.target);
      if (!src || !tgt) return;

      const [sx, sy, sz] = src.position;
      const [tx, ty, tz] = tgt.position;
      const p1 = new THREE.Vector3(sx, sy, sz);
      const p2 = new THREE.Vector3(tx, ty, tz);

      const isProp = !!edge.isPropagationPath;
      const baseColor = isProp 
        ? new THREE.Color(0xf43f5e) 
        : edge.channel === 'build-time'
          ? new THREE.Color(isLight ? 0xb45309 : 0xca8a04)
          : new THREE.Color(isLight ? 0x94a3b8 : 0x334155);

      batchedPositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      batchedColors.push(baseColor.r, baseColor.g, baseColor.b, baseColor.r, baseColor.g, baseColor.b);

      const points = [p1, p2];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

      const lineMat = new THREE.LineBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: isLight ? (isProp ? 0.6 : 0.28) : (isProp ? 0.45 : 0.2),
        linewidth: 1
      });

      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
      edgeLines.set(edge.id, { line, baseColor, isProp });

      if (isProp) {
        propEdgesForPulse.push({ edge, p1, p2 });
      }
    });

    // Individual edge lines pipeline
    edgeLinesRef.current = edgeLines;
    pulseEdgeMappingRef.current = propEdgesForPulse;

    // 9. Particle pulse stream for propagation simulation
    const pulseCount = propEdgesForPulse.length * 3;
    const pulsePosArray = new Float32Array(pulseCount * 3);
    const pulseProgressArray = new Float32Array(pulseCount);
    for (let i = 0; i < pulseCount; i++) {
      pulseProgressArray[i] = Math.random();
    }
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePosArray, 3));
    const pulseMat = new THREE.PointsMaterial({
      color: 0xff3b30,
      size: 2.2,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const pulsePoints = new THREE.Points(pulseGeo, pulseMat);
    pulsePoints.visible = false;
    scene.add(pulsePoints);
    pulseParticlesRef.current = pulsePoints;
    pulsePositionsRef.current = pulsePosArray;
    // Store all edge endpoints for lightning current traversal
    const allEdgesWithEndpoints: Array<{ id: string; p1: THREE.Vector3; p2: THREE.Vector3 }> = [];
    edges.forEach(edge => {
      const src = nodeMap.get(edge.source);
      const tgt = nodeMap.get(edge.target);
      if (src && tgt) {
        allEdgesWithEndpoints.push({
          id: edge.id,
          p1: new THREE.Vector3(...src.position),
          p2: new THREE.Vector3(...tgt.position)
        });
      }
    });
    allEdgeEndpointsRef.current = allEdgesWithEndpoints;

    // Electric Lightning Current Pulse Stream for Affected Nodes
    const MAX_LIGHTNING_PULSES = 200;
    const lightningPosArray = new Float32Array(MAX_LIGHTNING_PULSES * 3);
    const lightningProgressArray = new Float32Array(MAX_LIGHTNING_PULSES);
    for (let i = 0; i < MAX_LIGHTNING_PULSES; i++) {
      lightningProgressArray[i] = Math.random();
    }
    const lightningGeo = new THREE.BufferGeometry();
    lightningGeo.setAttribute('position', new THREE.BufferAttribute(lightningPosArray, 3));
    const lightningMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 2.8,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const lightningPoints = new THREE.Points(lightningGeo, lightningMat);
    lightningPoints.visible = false;
    scene.add(lightningPoints);
    lightningParticlesRef.current = lightningPoints;
    lightningPositionsRef.current = lightningPosArray;
    lightningProgressRef.current = lightningProgressArray;

    // 10. Build 3D Node Meshes with Geometry Pooling (P3-8)
    const nodeMeshes = new Map<string, THREE.Group>();
    const sharedUnitSphereGeo = new THREE.SphereGeometry(1, 24, 24);
    const sharedUnitDominatorRingGeo = new THREE.RingGeometry(1.22, 1.38, 32);
    const sharedUnitPsfiRingGeo = new THREE.RingGeometry(1.46, 1.60, 32);
    const sharedUnitPdiRingGeo = new THREE.RingGeometry(1.68, 1.82, 32);
    const sharedUnitAnomalyGeo = new THREE.IcosahedronGeometry(1.35, 1);

    nodes.forEach(node => {
      const group = new THREE.Group();
      group.position.set(node.position[0], node.position[1], node.position[2]);
      group.userData = { nodeId: node.id, nodeData: node, currentRadius: getNodeRadius(node) };

      const radius = getNodeRadius(node);
      const colors = getNodeColors(node);

      // Core sphere mesh with shared unit geometry - strictly sized by SC
      const sphereMat = new THREE.MeshStandardMaterial({
        color: colors.main,
        roughness: isLight ? 0.3 : 0.25,
        metalness: isLight ? 0.3 : 0.4,
        emissive: colors.emissive,
        emissiveIntensity: colors.emissiveIntensity
      });
      const sphereMesh = new THREE.Mesh(sharedUnitSphereGeo, sphereMat);
      sphereMesh.name = 'coreSphere';
      sphereMesh.userData = { baseRadius: 1.0 };
      sphereMesh.scale.setScalar(radius);
      group.add(sphereMesh);

      // Dedicated Gold Dominator Ring (Lengauer-Tarjan articulation chokepoint)
      const isDominator = node.articulationPoint || !!node.dominatorMetrics?.isDominatorChokepoint;
      const dominatorRingMat = new THREE.MeshBasicMaterial({
        color: 0xeab308, // Gold
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isDominator ? 0.9 : 0.0
      });
      const dominatorRingMesh = new THREE.Mesh(sharedUnitDominatorRingGeo, dominatorRingMat);
      dominatorRingMesh.name = 'dominatorRing';
      dominatorRingMesh.rotation.x = Math.PI / 2;
      dominatorRingMesh.scale.setScalar(radius);
      dominatorRingMesh.visible = isDominator;
      group.add(dominatorRingMesh);

      // Dedicated PSFI Fragility Ring (single maintainer / high fragility)
      const hasHighPsfi = (node.fragilityScore || 0) >= 60;
      const psfiColor = (node.fragilityScore || 0) >= 80 ? 0xf43f5e : 0xf59e0b;
      const psfiRingMat = new THREE.MeshBasicMaterial({
        color: psfiColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: hasHighPsfi ? 0.8 : 0.0
      });
      const psfiRingMesh = new THREE.Mesh(sharedUnitPsfiRingGeo, psfiRingMat);
      psfiRingMesh.name = 'psfiRing';
      psfiRingMesh.rotation.x = Math.PI / 2;
      psfiRingMesh.scale.setScalar(radius);
      psfiRingMesh.visible = hasHighPsfi;
      group.add(psfiRingMesh);

      // Dedicated PDI Package Divergence Cyan Ring (registry divergence >= 70)
      const hasHighPdi = !!(node.pdi?.divergenceScore && node.pdi.divergenceScore >= 70);
      const pdiRingMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4, // Cyan
        side: THREE.DoubleSide,
        transparent: true,
        opacity: hasHighPdi ? 0.85 : 0.0
      });
      const pdiRingMesh = new THREE.Mesh(sharedUnitPdiRingGeo, pdiRingMat);
      pdiRingMesh.name = 'pdiRing';
      pdiRingMesh.rotation.x = Math.PI / 2;
      pdiRingMesh.scale.setScalar(radius);
      pdiRingMesh.visible = hasHighPdi;
      group.add(pdiRingMesh);

      // Dedicated Capability Drift / Anomaly Halo (wireframe)
      const hasAnomaly = !!(node.f4Anomaly?.isAnomalous || node.id === 'snakeyaml');
      const anomalyMat = new THREE.MeshBasicMaterial({
        color: 0xd946ef, // Fuchsia / Magenta
        wireframe: true,
        transparent: true,
        opacity: hasAnomaly ? 0.35 : 0.0
      });
      const anomalyMesh = new THREE.Mesh(sharedUnitAnomalyGeo, anomalyMat);
      anomalyMesh.name = 'anomalyHalo';
      anomalyMesh.scale.setScalar(radius);
      anomalyMesh.visible = hasAnomaly;
      group.add(anomalyMesh);

      scene.add(group);
      nodeMeshes.set(node.id, group);
    });

    nodeMeshesRef.current = nodeMeshes;

    // 11. Raycasting setup for Hover and Click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getIntersectedNode = (event: MouseEvent): EcosystemNode | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const clickableMeshes: THREE.Object3D[] = [];
      nodeMeshes.forEach(group => {
        const core = group.getObjectByName('coreSphere');
        if (core) clickableMeshes.push(core);
      });

      const intersects = raycaster.intersectObjects(clickableMeshes, false);
      if (intersects.length > 0) {
        const hitGroup = intersects[0].object.parent;
        if (hitGroup && hitGroup.userData?.nodeData) {
          return hitGroup.userData.nodeData as EcosystemNode;
        }
      }
      return null;
    };

    const handlePointerMove = (event: MouseEvent) => {
      const hitNode = getIntersectedNode(event);
      if (hitNode) {
        container.style.cursor = 'pointer';
        onHoverNode(hitNode.id, { x: event.clientX, y: event.clientY });
      } else {
        container.style.cursor = 'default';
        onHoverNode(null, null);
      }
    };

    let pointerDownPos = { x: 0, y: 0 };
    const handlePointerDown = (event: MouseEvent) => {
      if (event.button !== 0) return;
      pointerDownPos = { x: event.clientX, y: event.clientY };
    };

    const handleClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      const dx = Math.abs(event.clientX - pointerDownPos.x);
      const dy = Math.abs(event.clientY - pointerDownPos.y);
      // If user dragged more than 6px, treat as turntable rotation, not a click
      if (dx > 6 || dy > 6) return;

      const hitNode = getIntersectedNode(event);
      if (hitNode) {
        onSelectNode(hitNode.id);
      } else {
        // Deselect node on empty space click
        onSelectNode(null);
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('click', handleClick);

    // 12. Resize Observer (Window + Container resize for dynamic compression)
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // 13. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Orbit controls update
      controls.update();

      // Camera smooth transition if target is explicitly requested
      if (targetCamPosRef.current && targetLookAtRef.current) {
        camera.position.lerp(targetCamPosRef.current, 0.05);
        controls.target.lerp(targetLookAtRef.current, 0.05);
        if (camera.position.distanceTo(targetCamPosRef.current) < 0.4) {
          targetCamPosRef.current = null;
          targetLookAtRef.current = null;
        }
      }

      // Animate electric lightning current flowing between all affected nodes
      const activeCone = dependencyConeRef.current;
      if (
        activeCone && 
        activeCone.coneEdges.size > 0 && 
        lightningParticlesRef.current && 
        lightningPositionsRef.current && 
        lightningProgressRef.current
      ) {
        const activeEdges = allEdgeEndpointsRef.current.filter(e => activeCone.coneEdges.has(e.id));
        if (activeEdges.length > 0) {
          lightningParticlesRef.current.visible = true;
          const currentSpeed = 1.65;
          const pulseCount = lightningProgressRef.current.length;

          for (let i = 0; i < pulseCount; i++) {
            lightningProgressRef.current[i] = (lightningProgressRef.current[i] + delta * currentSpeed) % 1.0;
            const edgeIndex = i % activeEdges.length;
            const edgeItem = activeEdges[edgeIndex];
            const t = lightningProgressRef.current[i];

            // Linear traversal along connecting edge wire
            const basePos = edgeItem.p1.clone().lerp(edgeItem.p2, t);

            // Subtle electric micro-arc jitter (high-tech cyber stream)
            const jitter = Math.sin(elapsedTime * 45 + i * 1.7) * 0.14;
            lightningPositionsRef.current[i * 3] = basePos.x + jitter;
            lightningPositionsRef.current[i * 3 + 1] = basePos.y + jitter;
            lightningPositionsRef.current[i * 3 + 2] = basePos.z + jitter;
          }
          lightningParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        } else {
          lightningParticlesRef.current.visible = false;
        }
      } else if (lightningParticlesRef.current) {
        lightningParticlesRef.current.visible = false;
      }

      // Rotate semantic rings around key nodes
      nodeMeshes.forEach(group => {
        const dRing = group.getObjectByName('dominatorRing');
        if (dRing && dRing.visible) dRing.rotation.z += 0.012;
        const psfi = group.getObjectByName('psfiRing');
        if (psfi && psfi.visible) psfi.rotation.z -= 0.015;
        const pdi = group.getObjectByName('pdiRing');
        if (pdi && pdi.visible) pdi.rotation.z += 0.018;
        const anomaly = group.getObjectByName('anomalyHalo');
        if (anomaly && anomaly.visible) {
          anomaly.rotation.y += 0.01;
          anomaly.rotation.x += 0.006;
        }
      });

      // Animate edge pulse particles during propagation simulation
      if (pulseParticlesRef.current && pulsePositionsRef.current && pulseProgressRef.current) {
        const pulseCount = pulseProgressRef.current.length;
        const edgeCount = pulseEdgeMappingRef.current.length;

        if (edgeCount > 0) {
          const speed = simulationPhase === 'simulating' || simulationPhase === 'active_compromise' ? 0.65 : 0.2;
          for (let i = 0; i < pulseCount; i++) {
            pulseProgressRef.current[i] = (pulseProgressRef.current[i] + delta * speed) % 1.0;
            const edgeIndex = i % edgeCount;
            const edgeItem = pulseEdgeMappingRef.current[edgeIndex];
            const t = pulseProgressRef.current[i];

            // Interpolate position from source (L1) to target (L5)
            const curPos = edgeItem.p1.clone().lerp(edgeItem.p2, t);
            pulsePositionsRef.current[i * 3] = curPos.x;
            pulsePositionsRef.current[i * 3 + 1] = curPos.y;
            pulsePositionsRef.current[i * 3 + 2] = curPos.z;
          }
          pulseParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('click', handleClick);
      controls.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Update controls auto-rotate state
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Update node sizes, colors, and scales when props change
  useEffect(() => {
    nodeMeshesRef.current.forEach((group, nodeId) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      const colors = getNodeColors(node);
      let targetRadius = getNodeRadius(node);

      // Dependency Cone membership
      const inCone = dependencyCone ? dependencyCone.allConeNodes.has(nodeId) : true;
      const isConeFocus = dependencyCone ? dependencyCone.focusId === nodeId : false;

      // P1 Filter
      const isP1 = node.ssvcPriority === 'p1_immediate' || node.structuralRisk === 'critical';
      const matchesP1 = showP1Only ? isP1 : true;

      // Depth Filter (1..4 strata)
      const matchesDepth = depthFilter === 0 ? true : node.layer <= depthFilter;

      // Scope Filter
      const isScopeDimmed = 
        (scopeFilter === 'production' && node.category === 'open-source' && node.tier1Reach === 0) ||
        (scopeFilter === 'dev' && node.layer === 5);

      const isDimmed = !inCone || !matchesP1 || !matchesDepth || isScopeDimmed;

      if (isConeFocus) {
        targetRadius *= 1.35;
      } else if (isDimmed) {
        targetRadius *= 0.4;
      }
      group.userData.currentRadius = targetRadius;

      const core = group.getObjectByName('coreSphere') as THREE.Mesh;
      if (core) {
        const mat = core.material as THREE.MeshStandardMaterial;
        mat.color.setHex(colors.main);
        mat.emissive.setHex(colors.emissive);
        mat.emissiveIntensity = isConeFocus ? 2.4 : (isDimmed ? 0.02 : colors.emissiveIntensity);

        if (isDimmed) {
          mat.opacity = 0.08;
          mat.transparent = true;
        } else {
          mat.opacity = 1.0;
          mat.transparent = false;
        }
        core.scale.setScalar(targetRadius);
      }

      // Dominator Ring (Gold)
      const dRing = group.getObjectByName('dominatorRing') as THREE.Mesh;
      if (dRing) {
        const isDom = (showDominatorMode || inCone) && (node.articulationPoint || !!node.dominatorMetrics?.isDominatorChokepoint);
        dRing.visible = isDom && !isDimmed;
        if (dRing.visible) {
          dRing.scale.setScalar(targetRadius);
          (dRing.material as THREE.MeshBasicMaterial).opacity = isConeFocus ? 1.0 : 0.85;
        }
      }

      // PSFI Fragility Ring
      const psfi = group.getObjectByName('psfiRing') as THREE.Mesh;
      if (psfi) {
        const hasPsfi = (node.fragilityScore || 0) >= 60;
        psfi.visible = hasPsfi && !isDimmed;
        if (psfi.visible) {
          psfi.scale.setScalar(targetRadius);
        }
      }

      // PDI Package Divergence Cyan Ring
      const pdi = group.getObjectByName('pdiRing') as THREE.Mesh;
      if (pdi) {
        const hasPdi = !!(node.pdi?.divergenceScore && node.pdi.divergenceScore >= 70);
        pdi.visible = hasPdi && !isDimmed;
        if (pdi.visible) {
          pdi.scale.setScalar(targetRadius);
        }
      }

      // Capability Drift / Anomaly Halo
      const anomaly = group.getObjectByName('anomalyHalo') as THREE.Mesh;
      if (anomaly) {
        const hasAnomaly = !!(node.f4Anomaly?.isAnomalous || (node.id === 'snakeyaml' && timeTravelDay > -60));
        anomaly.visible = hasAnomaly && !isDimmed;
        if (anomaly.visible) {
          anomaly.scale.setScalar(targetRadius);
        }
      }
    });

    // Dim stratum layer rings and stars when isolating a subsystem
    if (layerRingsRef.current.length > 0) {
      layerRingsRef.current.forEach(r => {
        const mat = r.material as THREE.MeshBasicMaterial;
        mat.opacity = dependencyCone ? 0.03 : (isLight ? 0.22 : 0.12);
      });
    }
    if (starMatRef.current) {
      starMatRef.current.opacity = dependencyCone ? 0.05 : (isLight ? 0.3 : 0.45);
    }
  }, [
    nodes,
    showStructuralSize,
    getNodeRadius,
    getNodeColors,
    simulationPhase,
    highlightedNodeIds,
    showDominatorMode,
    scopeFilter,
    dependencyCone,
    showP1Only,
    depthFilter,
    timeTravelDay
  ]);

  // Update edge visual states with strict Cone Isolation and channel filtering
  useEffect(() => {
    edgeLinesRef.current.forEach((item, edgeId) => {
      const isSevered = severedEdgeIds.has(edgeId);
      const edge = edges.find(e => e.id === edgeId);
      if (!edge) return;

      const lineMat = item.line.material as THREE.LineBasicMaterial;

      // Channel filtering: dim opposing channels
      if (channelFilter === 'runtime' && edge.channel === 'build-time') {
        lineMat.opacity = 0.02;
        return;
      }
      if (channelFilter === 'build' && edge.channel === 'runtime') {
        lineMat.opacity = 0.02;
        return;
      }

      if (isSevered) {
        lineMat.color.setHex(0x1e293b);
        lineMat.opacity = 0.05;
        return;
      }

      // Strict Dependency Cone Isolation on Edges
      if (dependencyCone) {
        const isInConeEdge = dependencyCone.coneEdges.has(edgeId);
        if (!isInConeEdge) {
          lineMat.color.setHex(isLight ? 0xe2e8f0 : 0x0f172a);
          lineMat.opacity = 0.015; // Deep ghosted dimming outside cone
          return;
        } else {
          // Live electric wire connection between affected nodes
          lineMat.color.setHex(0x38bdf8);
          lineMat.opacity = 0.85;
          return;
        }
      }

      // Check if this edge is part of active propagation path
      const isInActivePath = activePropagationPath && (
        activePropagationPath.nodeIds.includes(edge.source) &&
        activePropagationPath.nodeIds.includes(edge.target)
      );

      if (isInActivePath) {
        lineMat.color.setHex(0xf97316); // Bright orange active path
        lineMat.opacity = 0.95;
        return;
      }

      if (compromisedNodeIds.has(edge.source) && compromisedNodeIds.has(edge.target)) {
        lineMat.color.setHex(0xef4444); // Crimson red
        lineMat.opacity = 0.85;
        return;
      }

      if (simulationPhase === 'mitigation_applied' && edge.isCutCandidate) {
        lineMat.color.setHex(0x10b981); // Emerald severed line
        lineMat.opacity = 0.45;
        return;
      }

      // Default state inside active cone or full portfolio view
      lineMat.color.copy(item.baseColor);
      lineMat.opacity = isLight 
        ? (item.isProp ? 0.65 : (dependencyCone ? 0.55 : 0.28)) 
        : (item.isProp ? 0.55 : (dependencyCone ? 0.45 : 0.18));
    });

    // Control pulse visibility
    if (pulseParticlesRef.current) {
      const isSimulating = simulationPhase === 'simulating' || simulationPhase === 'active_compromise';
      pulseParticlesRef.current.visible = isSimulating || !!activePropagationPath;
    }
  }, [
    severedEdgeIds, 
    activePropagationPath, 
    compromisedNodeIds, 
    simulationPhase, 
    edges, 
    isLight, 
    channelFilter, 
    dependencyCone
  ]);

  // Update Three.js scene background, fog, and materials when theme changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    const bgHex = isLight ? 0xffffff : 0x080616;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, isLight ? 0.0035 : 0.0055);

    // Update WebGLRenderer clearColor & tone mapping exposure
    if (rendererRef.current) {
      rendererRef.current.setClearColor(bgHex, 1);
      rendererRef.current.toneMappingExposure = isLight ? 1.2 : 1.1;
    }

    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = isLight ? 1.5 : 0.9;
      ambientLightRef.current.color.setHex(isLight ? 0xffffff : 0xdbeafe);
    }

    if (dirLight1Ref.current) {
      dirLight1Ref.current.intensity = isLight ? 1.1 : 1.4;
      dirLight1Ref.current.color.setHex(isLight ? 0x0284c7 : 0x38bdf8);
    }

    if (dirLight2Ref.current) {
      dirLight2Ref.current.intensity = isLight ? 0.8 : 0.9;
      dirLight2Ref.current.color.setHex(isLight ? 0x6366f1 : 0x818cf8);
    }

    if (starMatRef.current) {
      starMatRef.current.color.setHex(isLight ? 0x94a3b8 : 0x64748b);
      starMatRef.current.opacity = isLight ? 0.35 : 0.45;
    }

    layerRingsRef.current.forEach((mesh, idx) => {
      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (idx === 4) mat.color.setHex(isLight ? 0x4f46e5 : 0x6366f1);
      else if (idx === 0) mat.color.setHex(isLight ? 0xe11d48 : 0xf43f5e);
      else mat.color.setHex(isLight ? 0x94a3b8 : 0x334155);
      mat.opacity = isLight ? 0.25 : 0.12;
    });

    // Recompute base colors on edges
    edgeLinesRef.current.forEach((item, edgeId) => {
      const edge = edges.find(e => e.id === edgeId);
      if (!edge) return;
      const isProp = !!edge.isPropagationPath;
      const baseColor = isProp 
        ? new THREE.Color(0xf43f5e) 
        : edge.channel === 'build-time'
          ? new THREE.Color(isLight ? 0xb45309 : 0xca8a04)
          : new THREE.Color(isLight ? 0x64748b : 0x334155);
      item.baseColor = baseColor;
      
      if (!severedEdgeIds.has(edgeId)) {
        const lineMat = item.line.material as THREE.LineBasicMaterial;
        lineMat.color.copy(baseColor);
        lineMat.opacity = isLight ? (isProp ? 0.65 : 0.35) : (isProp ? 0.45 : 0.2);
      }
    });

    // Update all 3D node mesh materials for crisp theme rendering
    nodeMeshesRef.current.forEach((group, nodeId) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;
      const colors = getNodeColors(node);
      const sphere = group.getObjectByName('coreSphere') as THREE.Mesh;
      if (sphere && sphere.material) {
        const mat = sphere.material as THREE.MeshStandardMaterial;
        mat.color.setHex(colors.main);
        mat.emissive.setHex(colors.emissive);
        mat.emissiveIntensity = isLight ? colors.emissiveIntensity * 0.8 : colors.emissiveIntensity;
        mat.roughness = isLight ? 0.35 : 0.25;
        mat.metalness = isLight ? 0.3 : 0.4;
      }
      const dRing = group.getObjectByName('dominatorRing') as THREE.Mesh;
      if (dRing && dRing.material) {
        (dRing.material as THREE.MeshBasicMaterial).color.setHex(0xeab308);
      }
      const psfi = group.getObjectByName('psfiRing') as THREE.Mesh;
      if (psfi && psfi.material) {
        (psfi.material as THREE.MeshBasicMaterial).color.setHex((node.fragilityScore || 0) >= 80 ? 0xf43f5e : 0xf59e0b);
      }
      const pdi = group.getObjectByName('pdiRing') as THREE.Mesh;
      if (pdi && pdi.material) {
        (pdi.material as THREE.MeshBasicMaterial).color.setHex(0x06b6d4);
      }
      const anomaly = group.getObjectByName('anomalyHalo') as THREE.Mesh;
      if (anomaly && anomaly.material) {
        (anomaly.material as THREE.MeshBasicMaterial).color.setHex(0xd946ef);
      }
    });
  }, [isLight, edges, severedEdgeIds, nodes, getNodeColors]);

  // Camera stays fixed in X-axis (no fly-in/zoom on node click)

  return (
    <div className={`relative w-full h-full overflow-hidden select-none transition-colors duration-300 ${
      isLight ? 'bg-white' : 'bg-[#080616]'
    }`}>
      <div ref={mountRef} className="w-full h-full" />

      {/* Sleek Collapsible Stratum Indicator at Bottom-Left */}
      <div className="absolute left-4 bottom-4 z-10 select-none">
        <div className={`rounded-xl border backdrop-blur-xl shadow-lg transition-all ${
          isLight ? 'bg-white/95 border-slate-200/90 shadow-slate-200/50 text-slate-800' : 'bg-slate-900/90 border-slate-800/90 shadow-black/60 text-slate-200'
        }`}>
          {/* Always visible compact header button */}
          <button
            onClick={() => setIsStratumExpanded(prev => !prev)}
            title={isStratumExpanded ? "Collapse architecture tiers" : "Expand architecture tiers"}
            className="flex items-center gap-2 px-3 py-1.5 cursor-pointer text-xs font-medium hover:opacity-90 transition-opacity"
          >
            {dependencyCone ? (
              <>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping shrink-0" />
                <span className="font-semibold text-blue-600 dark:text-blue-400 text-[11px]">
                  Impact Scope: {dependencyCone.allConeNodes.size} packages ({dependencyCone.coneEdges.size} connections)
                </span>
              </>
            ) : (
              <>
                <div className="flex items-center -space-x-1 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 border border-slate-900" />
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-slate-900" />
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 border border-slate-900" />
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 border border-slate-900" />
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-slate-900" />
                </div>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">5 Architecture Tiers</span>
              </>
            )}
            <ChevronUp className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isStratumExpanded ? 'rotate-180' : ''}`} />
          </button>

          {/* Expanded Tier Details (Collapsible) */}
          {isStratumExpanded && (
            <div className="px-3 pb-2.5 pt-1.5 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-1">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded bg-indigo-500 shrink-0 shadow-xs shadow-indigo-500/50"></span>
                <span>Tier 1: Critical Services</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded bg-blue-500 shrink-0"></span>
                <span>Tier 2: Business Applications</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded bg-sky-500 shrink-0"></span>
                <span>Tier 3: Platform Microservices</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded bg-teal-500 shrink-0"></span>
                <span>Tier 4: Shared Libraries</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded bg-rose-500 shrink-0 shadow-xs shadow-rose-500/50"></span>
                <span>Tier 5: Open-Source Dependencies</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
