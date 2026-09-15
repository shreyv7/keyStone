import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface BlastEvent {
  x: number;
  y: number;
  nodeName: string;
  affectedCount: number;
  timestamp: number;
}

interface InteractiveTopologyCanvasProps {
  onBlast?: (blast: BlastEvent) => void;
}

interface GraphNode {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  name: string;
  type: 'foundational' | 'bridge' | 'sink' | 'keystone';
  color: string;
  glowColor: string;
  isExploded: boolean;
  reconstituteTimer: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

const DEPENDENCY_NAMES = [
  'keystone-core@2.4',
  'snakeyaml@1.33',
  'log4j-bridge',
  'spring-webflux',
  'openssl-compat',
  'grpc-transport',
  'commons-compress',
  'internal-auth-v2',
  'kafka-sink-pipe',
  'redis-cluster-bus',
  'postgres-pool-core',
  'aws-sdk-v3-shim',
  'billing-router',
  'telemetry-agent',
  'crypto-vault-provider',
  'event-stream-broker',
  'oauth2-gateway',
  'schema-validator',
  'envoy-wasm-filter',
  'k8s-operator-sync'
];

export const InteractiveTopologyCanvas: React.FC<InteractiveTopologyCanvasProps> = ({
  onBlast
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hudReceipt, setHudReceipt] = useState<{
    text: string;
    subtext: string;
    x: number;
    y: number;
  } | null>(null);

  const onBlastRef = useRef(onBlast);
  useEffect(() => {
    onBlastRef.current = onBlast;
  }, [onBlast]);

  const mouseRef = useRef({
    x: -1000,
    y: -1000
  });

  const nodesRef = useRef<GraphNode[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);

  // Trigger click explosion effect
  const triggerBlast = useCallback((clickX: number, clickY: number) => {
    const nodeToDetonate = nodesRef.current.reduce((closest, node) => {
      if (node.isExploded) return closest;
      const dist = Math.hypot(node.x - clickX, node.y - clickY);
      if (!closest || dist < closest.dist) {
        return { node, dist };
      }
      return closest;
    }, null as { node: GraphNode; dist: number } | null)?.node;

    const blastX = nodeToDetonate ? nodeToDetonate.x : clickX;
    const blastY = nodeToDetonate ? nodeToDetonate.y : clickY;
    const nodeName = nodeToDetonate ? nodeToDetonate.name : 'structural-keystone';
    const affected = Math.floor(Math.random() * 8) + 14;

    // Shockwave ripple
    shockwavesRef.current.push({
      x: blastX,
      y: blastY,
      radius: 4,
      maxRadius: 180,
      alpha: 0.85,
      color: '#3b82f6'
    });

    if (nodeToDetonate) {
      nodeToDetonate.isExploded = true;
      nodeToDetonate.reconstituteTimer = 160;
    }

    // Spark particles
    const count = 28;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 4.5 + 1.5;
      particlesRef.current.push({
        x: blastX,
        y: blastY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1.5,
        color: i % 2 === 0 ? '#3b82f6' : '#ef4444',
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015
      });
    }

    setHudReceipt({
      text: `💥 KEYSTONE COMPROMISED: ${nodeName}`,
      subtext: `Cascade Blast Radius: ${affected} Services • Restabilizing...`,
      x: blastX,
      y: blastY - 45
    });

    if (onBlastRef.current) {
      onBlastRef.current({
        x: blastX,
        y: blastY,
        nodeName,
        affectedCount: affected,
        timestamp: Date.now()
      });
    }
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerBlast(e.clientX - rect.left, e.clientY - rect.top);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initial setup of dense, thick nodes ONLY ONCE on mount
    const count = Math.min(85, Math.max(50, Math.floor((width * height) / 14000)));
    const nodes: GraphNode[] = [];

    const types: Array<'foundational' | 'bridge' | 'sink' | 'keystone'> = [
      'foundational',
      'bridge',
      'sink',
      'keystone'
    ];

    const typeColors = {
      foundational: { color: '#c5a880', glow: 'rgba(197, 168, 128, 0.45)' },
      bridge: { color: '#d4b285', glow: 'rgba(212, 178, 133, 0.40)' },
      sink: { color: '#a38f78', glow: 'rgba(163, 143, 120, 0.35)' },
      keystone: { color: '#b45309', glow: 'rgba(180, 83, 9, 0.55)' }
    };

    for (let i = 0; i < count; i++) {
      const type = i % 7 === 0 ? 'keystone' : types[i % 3];
      const name = DEPENDENCY_NAMES[i % DEPENDENCY_NAMES.length];
      const baseRadius = type === 'keystone' ? 8 : type === 'bridge' ? 6 : 4.5;

      // Constant, peaceful, slow automatic drift velocity
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.12 + Math.random() * 0.08; // 0.12 - 0.20 px/frame

      nodes.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseRadius,
        radius: baseRadius,
        name,
        type,
        color: typeColors[type].color,
        glowColor: typeColors[type].glow,
        isExploded: false,
        reconstituteTimer: 0
      });
    }

    nodesRef.current = nodes;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Do NOT regenerate nodes on resize, just wrap existing ones
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    let animFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const allNodes = nodesRef.current;

      // Update positions strictly automatically and slowly
      for (let i = 0; i < allNodes.length; i++) {
        const node = allNodes[i];

        if (node.isExploded) {
          node.reconstituteTimer -= 1;
          if (node.reconstituteTimer <= 0) {
            node.isExploded = false;
            node.type = 'foundational';
            node.color = '#10b981';
            node.glowColor = 'rgba(16, 185, 129, 0.5)';
          }
          continue;
        }

        // Apply constant slow velocities (NO mouse velocity disruption)
        node.x += node.vx;
        node.y += node.vy;

        // Screen wrap
        if (node.x < -30) node.x = width + 30;
        if (node.x > width + 30) node.x = -30;
        if (node.y < -30) node.y = height + 30;
        if (node.y > height + 30) node.y = -30;
      }

      // Draw Steady Dense Proximity Edges
      const maxDistance = 165;

      for (let i = 0; i < allNodes.length; i++) {
        const a = allNodes[i];
        if (a.isExploded) continue;

        for (let j = i + 1; j < allNodes.length; j++) {
          const b = allNodes[j];
          if (b.isExploded) continue;

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.38;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);

            if (a.type === 'keystone' || b.type === 'keystone') {
              ctx.strokeStyle = `rgba(180, 83, 9, ${alpha * 0.85})`;
              ctx.lineWidth = 1.3;
            } else {
              ctx.strokeStyle = `rgba(197, 168, 128, ${alpha * 0.70})`;
              ctx.lineWidth = 1.0;
            }

            ctx.stroke();
          }
        }
      }

      // Draw Thicker Nodes
      for (let i = 0; i < allNodes.length; i++) {
        const node = allNodes[i];
        if (node.isExploded) continue;

        const isHovered =
          mouse.x > 0 && Math.hypot(node.x - mouse.x, node.y - mouse.y) < 30;

        // Outer ambient glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * (isHovered ? 2.6 : 2.2), 0, Math.PI * 2);
        ctx.fillStyle = node.glowColor;
        ctx.fill();

        // Core Node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? '#f3e8d9' : node.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Label on direct hover or keystone
        if (isHovered || node.type === 'keystone') {
          ctx.font = '10px monospace';
          ctx.fillStyle = node.type === 'keystone' ? '#b45309' : '#574838';
          ctx.fillText(node.name, node.x + node.radius + 7, node.y + 3);
        }
      }

      // Draw Shockwaves
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.12 + 3;
        sw.alpha *= 0.94;

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.globalAlpha = 1;

        if (sw.alpha < 0.02 || sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(i, 1);
        }
      }

      // Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animFrameId);
    };
  }, []); // Run ONCE on mount! Never re-initializes on mouse events

  useEffect(() => {
    if (!hudReceipt) return;
    const timeout = setTimeout(() => {
      setHudReceipt(null);
    }, 2800);
    return () => clearTimeout(timeout);
  }, [hudReceipt]);

  return (
    <div className="fixed inset-0 pointer-events-auto z-0 overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="w-full h-full cursor-pointer"
      />

      {hudReceipt && (
        <div
          style={{
            left: `${hudReceipt.x}px`,
            top: `${hudReceipt.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
          className="pointer-events-none absolute z-20 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="px-3.5 py-1.5 rounded-lg bg-slate-950/90 text-white border border-blue-500/40 shadow-xl backdrop-blur-md flex flex-col items-center gap-0.5">
            <span className="text-xs font-mono font-bold text-red-400 tracking-tight flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
              {hudReceipt.text}
            </span>
            <span className="text-[10px] font-mono text-blue-200">
              {hudReceipt.subtext}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
