import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EcosystemNode, EcosystemEdge, PropagationPath } from '../types';
import { useTheme } from '../context/ThemeContext';

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
}) => {
  const { isLight } = useTheme();
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
  const layerRingsRef = useRef<THREE.Mesh[]>([]);

  // Camera animation target
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetLookAtRef = useRef<THREE.Vector3 | null>(null);

  // Default initial camera
  const DEFAULT_CAM_POS = new THREE.Vector3(0, 5, 85);
  const DEFAULT_LOOK_AT = new THREE.Vector3(0, 0, 0);

  // Node sizes based on category and toggle
  const getNodeRadius = useCallback(
    (node: EcosystemNode) => {
      if (showStructuralSize) {
        if (node.id === 'snakeyaml') return 5.8;
        if (node.structuralRisk === 'critical') return 4.2;
        if (node.structuralRisk === 'high') return 3.2;
        if (node.structuralRisk === 'medium') return 2.2;
        return 1.4;
      }
      // Natural category base sizes
      switch (node.category) {
        case 'keystone':
          return 4.8;
        case 'tier1-asset':
          return 3.8;
        case 'application':
          return 3.0;
        case 'service':
          return 2.4;
        case 'internal-lib':
          return 2.0;
        case 'open-source':
        default:
          return 1.5;
      }
    },
    [showStructuralSize]
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

      // Time travel stealth simulation
      if (node.id === 'snakeyaml') {
        if (timeTravelDay === -90) {
          return { main: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 0.4, ringColor: 0x60a5fa };
        }
        if (timeTravelDay === -30) {
          return { main: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 1.0, ringColor: 0xfbbf24 };
        }
        // Day 0
        return { main: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 1.4, ringColor: 0xfb7185 };
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

      // Default palette by category/tier
      if (node.category === 'tier1-asset') {
        return {
          main: 0x6366f1, // Indigo / Royal Violet for Tier-1
          emissive: 0x4338ca,
          emissiveIntensity: 0.7,
          ringColor: 0x818cf8
        };
      }
      if (node.category === 'application') {
        return {
          main: 0x3b82f6, // Blue
          emissive: 0x1d4ed8,
          emissiveIntensity: 0.4,
          ringColor: 0x60a5fa
        };
      }
      if (node.category === 'service') {
        return {
          main: 0x0ea5e9, // Sky blue
          emissive: 0x0369a1,
          emissiveIntensity: 0.3,
          ringColor: 0x38bdf8
        };
      }
      if (node.category === 'internal-lib') {
        return {
          main: 0x14b8a6, // Teal
          emissive: 0x0f766e,
          emissiveIntensity: 0.4,
          ringColor: 0x2dd4bf
        };
      }
      // Open source
      return {
        main: 0x64748b, // Cool Slate
        emissive: 0x334155,
        emissiveIntensity: 0.2,
        ringColor: 0x94a3b8
      };
    },
    [selectedNodeId, hoveredNodeId, compromisedNodeIds, highlightedNodeIds, activePropagationPath, simulationPhase, timeTravelDay]
  );

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    const bgHex = isLight ? 0xf8fafc : 0x06080d;
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

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 220;
    controls.minDistance = 15;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.6;
    controlsRef.current = controls;

    // 5. Subtle ambient & directional lights
    const ambientLight = new THREE.AmbientLight(isLight ? 0xffffff : 0xdbeafe, isLight ? 1.3 : 0.9);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, isLight ? 1.2 : 1.4);
    dirLight1.position.set(40, 60, 40);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 0.9);
    dirLight2.position.set(-40, -30, -30);
    scene.add(dirLight2);

    // 6. Atmospheric Layer Guides (Subtle circular spatial planes for layers 1 to 5)
    const layerYCoords = [-32, -15, 2, 20, 35];
    layerRingsRef.current = [];
    
    layerYCoords.forEach((y, i) => {
      const ringRadius = 45 - Math.abs(y) * 0.3;
      const ringGeo = new THREE.RingGeometry(ringRadius - 0.2, ringRadius, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 4 ? (isLight ? 0x4f46e5 : 0x6366f1) : i === 0 ? (isLight ? 0xe11d48 : 0xf43f5e) : (isLight ? 0x94a3b8 : 0x334155),
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

    // 8. Build Edge Mesh geometry
    const nodeMap = new Map<string, EcosystemNode>(nodes.map(n => [n.id, n]));
    const edgeLines = new Map<string, { line: THREE.Line; baseColor: THREE.Color; isProp: boolean }>();
    const propEdgesForPulse: Array<{ edge: EcosystemEdge; p1: THREE.Vector3; p2: THREE.Vector3 }> = [];

    edges.forEach(edge => {
      const src = nodeMap.get(edge.source);
      const tgt = nodeMap.get(edge.target);
      if (!src || !tgt) return;

      const [sx, sy, sz] = src.position;
      const [tx, ty, tz] = tgt.position;
      const p1 = new THREE.Vector3(sx, sy, sz);
      const p2 = new THREE.Vector3(tx, ty, tz);

      const points = [p1, p2];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      
      const isProp = !!edge.isPropagationPath;
      const baseColor = isProp 
        ? new THREE.Color(0xf43f5e) 
        : edge.channel === 'build-time'
          ? new THREE.Color(isLight ? 0xb45309 : 0xca8a04)
          : new THREE.Color(isLight ? 0x94a3b8 : 0x334155);

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
    pulseProgressRef.current = pulseProgressArray;

    // 10. Build 3D Node Meshes
    const nodeMeshes = new Map<string, THREE.Group>();

    nodes.forEach(node => {
      const group = new THREE.Group();
      group.position.set(node.position[0], node.position[1], node.position[2]);
      group.userData = { nodeId: node.id, nodeData: node };

      const radius = getNodeRadius(node);
      const colors = getNodeColors(node);

      // Core sphere geometry
      const sphereGeo = new THREE.SphereGeometry(radius, 28, 28);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: colors.main,
        roughness: 0.25,
        metalness: 0.4,
        emissive: colors.emissive,
        emissiveIntensity: colors.emissiveIntensity
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.name = 'coreSphere';
      sphereMesh.userData = { baseRadius: radius };
      group.add(sphereMesh);

      // Distinctive orbital outer ring for Tier-1 and Keystone
      if (node.category === 'keystone' || node.category === 'tier1-asset') {
        const ringGeo = new THREE.RingGeometry(radius * 1.35, radius * 1.55, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: colors.ringColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.75
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.name = 'haloRing';
        ringMesh.rotation.x = Math.PI / 2;
        group.add(ringMesh);

        // Secondary wireframe aura
        const auraGeo = new THREE.IcosahedronGeometry(radius * 1.25, 1);
        const auraMat = new THREE.MeshBasicMaterial({
          color: colors.ringColor,
          wireframe: true,
          transparent: true,
          opacity: 0.25
        });
        const auraMesh = new THREE.Mesh(auraGeo, auraMat);
        auraMesh.name = 'auraWire';
        group.add(auraMesh);
      }

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

    const handlePointerDown = (event: MouseEvent) => {
      // Only handle left clicks
      if (event.button !== 0) return;
      const hitNode = getIntersectedNode(event);
      if (hitNode) {
        onSelectNode(hitNode.id);
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handlePointerDown);

    // 12. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 13. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Orbit controls update
      controls.update();

      // Camera smooth transition if target is specified
      if (targetCamPosRef.current && targetLookAtRef.current) {
        camera.position.lerp(targetCamPosRef.current, 0.05);
        controls.target.lerp(targetLookAtRef.current, 0.05);
        if (camera.position.distanceTo(targetCamPosRef.current) < 0.4) {
          targetCamPosRef.current = null;
          targetLookAtRef.current = null;
        }
      }

      // Rotate decorative rings around key nodes
      nodeMeshes.forEach(group => {
        const halo = group.getObjectByName('haloRing');
        if (halo) {
          halo.rotation.z += 0.015;
        }
        const aura = group.getObjectByName('auraWire');
        if (aura) {
          aura.rotation.y += 0.01;
          aura.rotation.x += 0.005;
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
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handlePointerDown);
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

      const targetRadius = getNodeRadius(node);
      const colors = getNodeColors(node);

      const core = group.getObjectByName('coreSphere') as THREE.Mesh;
      if (core) {
        const mat = core.material as THREE.MeshStandardMaterial;
        mat.color.setHex(colors.main);
        mat.emissive.setHex(colors.emissive);
        mat.emissiveIntensity = colors.emissiveIntensity;

        // Smooth scale adjustment
        const currentRadius = (core.userData?.baseRadius as number) || 1.5;
        const scaleFactor = targetRadius / currentRadius;
        core.scale.set(scaleFactor, scaleFactor, scaleFactor);
      }

      const halo = group.getObjectByName('haloRing') as THREE.Mesh;
      if (halo) {
        const hMat = halo.material as THREE.MeshBasicMaterial;
        hMat.color.setHex(colors.ringColor);
        halo.scale.set(targetRadius / 4, targetRadius / 4, targetRadius / 4);
      }
    });
  }, [nodes, showStructuralSize, getNodeRadius, getNodeColors, simulationPhase]);

  // Update edge visual states (severed, active path, compromised pulse)
  useEffect(() => {
    edgeLinesRef.current.forEach((item, edgeId) => {
      const isSevered = severedEdgeIds.has(edgeId);
      const edge = edges.find(e => e.id === edgeId);
      if (!edge) return;

      const lineMat = item.line.material as THREE.LineBasicMaterial;

      if (isSevered) {
        // Dim and turn grey-dashed or transparent
        lineMat.color.setHex(0x1e293b);
        lineMat.opacity = 0.08;
        return;
      }

      // Check if this edge is part of the active propagation path
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
        lineMat.opacity = 0.8;
        return;
      }

      if (simulationPhase === 'mitigation_applied' && edge.isCutCandidate) {
        lineMat.color.setHex(0x10b981); // Emerald severed line
        lineMat.opacity = 0.4;
        return;
      }

      // Default state
      lineMat.color.copy(item.baseColor);
      lineMat.opacity = isLight ? (item.isProp ? 0.5 : 0.25) : (item.isProp ? 0.35 : 0.15);
    });

    // Control pulse visibility
    if (pulseParticlesRef.current) {
      const isSimulating = simulationPhase === 'simulating' || simulationPhase === 'active_compromise';
      pulseParticlesRef.current.visible = isSimulating || !!activePropagationPath;
    }
  }, [severedEdgeIds, activePropagationPath, compromisedNodeIds, simulationPhase, edges, isLight]);

  // Update Three.js scene background, fog, and materials when theme changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    const bgHex = isLight ? 0xf8fafc : 0x06080d;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, isLight ? 0.0035 : 0.0055);

    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = isLight ? 1.3 : 0.9;
      ambientLightRef.current.color.setHex(isLight ? 0xffffff : 0xdbeafe);
    }

    if (starMatRef.current) {
      starMatRef.current.color.setHex(isLight ? 0x94a3b8 : 0x64748b);
      starMatRef.current.opacity = isLight ? 0.3 : 0.45;
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
          : new THREE.Color(isLight ? 0x94a3b8 : 0x334155);
      item.baseColor = baseColor;
      
      if (!severedEdgeIds.has(edgeId)) {
        const lineMat = item.line.material as THREE.LineBasicMaterial;
        lineMat.color.copy(baseColor);
        lineMat.opacity = isLight ? (isProp ? 0.5 : 0.25) : (isProp ? 0.35 : 0.15);
      }
    });
  }, [isLight, edges, severedEdgeIds]);

  // Handle Camera Smooth Focus on Selection
  useEffect(() => {
    if (!selectedNodeId) return;
    const selectedNode = nodes.find(n => n.id === selectedNodeId);
    if (!selectedNode || !cameraRef.current || !controlsRef.current) return;

    const [nx, ny, nz] = selectedNode.position;
    const targetLookAt = new THREE.Vector3(nx, ny, nz);
    
    // Position camera offset from the node with high visibility
    const offset = selectedNode.id === 'snakeyaml' ? 32 : 24;
    const targetCamPos = new THREE.Vector3(nx + offset * 0.4, ny + offset * 0.3, nz + offset);

    targetCamPosRef.current = targetCamPos;
    targetLookAtRef.current = targetLookAt;
  }, [selectedNodeId, nodes]);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none transition-colors duration-300 ${
      isLight ? 'bg-slate-50' : 'bg-[#06080d]'
    }`}>
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating 3D Depth Layer Indicators on Left Edge */}
      <div className={`absolute left-6 bottom-8 z-10 flex flex-col gap-1.5 pointer-events-none transition-opacity ${
        isLight ? 'opacity-90' : 'opacity-80'
      }`}>
        <div className={`text-[10px] font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5 ${
          isLight ? 'text-slate-500 font-semibold' : 'text-slate-500'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          Ecosystem Spatial Topology
        </div>
        <div className={`flex items-center gap-2 text-xs font-mono ${isLight ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
          <span className="w-2.5 h-2.5 rounded bg-indigo-500 shadow-xs shadow-indigo-500/50"></span>
          <span>Layer 5: Tier-1 Assets & Sinks (Apex)</span>
        </div>
        <div className={`flex items-center gap-2 text-xs font-mono ${isLight ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
          <span className="w-2.5 h-2.5 rounded bg-blue-500"></span>
          <span>Layer 4: Business Applications</span>
        </div>
        <div className={`flex items-center gap-2 text-xs font-mono ${isLight ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
          <span className="w-2.5 h-2.5 rounded bg-sky-500"></span>
          <span>Layer 3: Platform Microservices</span>
        </div>
        <div className={`flex items-center gap-2 text-xs font-mono ${isLight ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
          <span className="w-2.5 h-2.5 rounded bg-teal-500"></span>
          <span>Layer 2: Shared Internal Libraries</span>
        </div>
        <div className={`flex items-center gap-2 text-xs font-mono ${isLight ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
          <span className="w-2.5 h-2.5 rounded bg-rose-500 shadow-xs shadow-rose-500/50"></span>
          <span>Layer 1: Foundational Open-Source (Keystones)</span>
        </div>
      </div>
    </div>
  );
};
