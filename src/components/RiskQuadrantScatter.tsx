import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Layers, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  Target,
  Info
} from 'lucide-react';
import { EcosystemNode, RoleLens } from '../types';
import { useTheme } from '../context/ThemeContext';

export type QuadrantType = 'emergency' | 'fragile' | 'pillar' | 'noise';

interface RiskQuadrantScatterProps {
  nodes: EcosystemNode[];
  onSelectNode: (nodeId: string) => void;
  onGoToEcosystem?: () => void;
  activeLens?: RoleLens;
  selectedNodeId?: string;
}

export const RiskQuadrantScatter: React.FC<RiskQuadrantScatterProps> = ({
  nodes,
  onSelectNode,
  onGoToEcosystem,
  activeLens = 'developer',
  selectedNodeId
}) => {
  const { isLight } = useTheme();
  const [filterQuadrant, setFilterQuadrant] = useState<'all' | QuadrantType>('all');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [diagnosticNodeId, setDiagnosticNodeId] = useState<string | null>('snakeyaml');
  const [yAxisMode, setYAxisMode] = useState<'psfi' | 'ce_max'>('psfi');

  // Compute coordinates for each node
  const plottedNodes = useMemo(() => {
    return nodes.map((node) => {
      // X-axis: Blast Radius BR(v)
      // Tier-1 reach (18 pts each) + dependents (1.0 pt each) + cut-vertex bonus (8 pts)
      const rawBlast = (node.tier1Reach * 18) + ((node.dependents || 0) * 1.0) + (node.articulationPoint ? 8 : 0);
      const blastRadius = Math.min(96, Math.max(8, Math.round(rawBlast)));

      // Y-axis: Structural Danger SD(v) or Capability Exposure CE_max(v)
      let structuralDanger: number;
      if (yAxisMode === 'ce_max') {
        const hasCapabilities = (node.capabilityDelta && node.capabilityDelta.length > 0) || node.stealthSignals?.includes('CAPABILITY_TAMPERING');
        const hasNetworkOrExec = node.capabilityDelta?.some(c => c.capability.includes('Socket') || c.capability.includes('child_process'));
        if (hasNetworkOrExec) {
          structuralDanger = 94;
        } else if (hasCapabilities || node.id === 'snakeyaml') {
          structuralDanger = 88;
        } else if (node.category === 'open-source') {
          structuralDanger = 52;
        } else {
          structuralDanger = 24;
        }
      } else {
        // Pure topological fragility & cut-vertex centrality (PSFI)
        structuralDanger = node.systemicScore;
        if (typeof structuralDanger !== 'number') {
          const topo = 0.6 * (node.reversePageRankPercentile || 50) + 0.4 * (node.betweennessPercentile || 50);
          const frag = 1.0 + (node.articulationPoint ? 0.45 : 0) + (node.maintainers <= 1 ? 0.40 : 0.10);
          structuralDanger = Math.round((topo * frag) / 1.95);
        }
      }
      structuralDanger = Math.min(95, Math.max(10, structuralDanger));

      // Determine quadrant:
      // X >= 50, Y >= 50: Emergency Keystone
      // X >= 50, Y < 50: Fragile Micro-Package (XZ Utils class)
      // X < 50, Y >= 50: Critical Local Pillar
      // X < 50, Y < 50: Peripheral Noise
      let quadrant: QuadrantType;
      if (blastRadius >= 50 && structuralDanger >= 50) {
        quadrant = 'emergency';
      } else if (blastRadius >= 50 && structuralDanger < 50) {
        quadrant = 'fragile';
      } else if (blastRadius < 50 && structuralDanger >= 50) {
        quadrant = 'pillar';
      } else {
        quadrant = 'noise';
      }

      return {
        node,
        blastRadius,
        structuralDanger,
        quadrant
      };
    });
  }, [nodes]);

  // Quadrant counts
  const counts = useMemo(() => {
    const c = { emergency: 0, fragile: 0, pillar: 0, noise: 0 };
    plottedNodes.forEach(p => {
      c[p.quadrant]++;
    });
    return c;
  }, [plottedNodes]);

  // SVG Dimension Constants
  const SVG_WIDTH = 540;
  const SVG_HEIGHT = 310;
  const MARGIN = { left: 46, right: 16, top: 22, bottom: 38 };
  const PLOT_WIDTH = SVG_WIDTH - MARGIN.left - MARGIN.right; // 478
  const PLOT_HEIGHT = SVG_HEIGHT - MARGIN.top - MARGIN.bottom; // 250
  const MID_X = MARGIN.left + PLOT_WIDTH / 2; // 285
  const MID_Y = MARGIN.top + PLOT_HEIGHT / 2; // 147

  // Coordinate transform functions
  const getSvgX = (br: number) => MARGIN.left + (br / 100) * PLOT_WIDTH;
  const getSvgY = (sd: number) => (MARGIN.top + PLOT_HEIGHT) - (sd / 100) * PLOT_HEIGHT;

  const hoveredPlotItem = useMemo(() => {
    if (!hoveredNodeId) return null;
    return plottedNodes.find(p => p.node.id === hoveredNodeId) || null;
  }, [hoveredNodeId, plottedNodes]);

  const handleNodeClick = (nodeId: string) => {
    setDiagnosticNodeId(nodeId);
    onSelectNode(nodeId);
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Top Filter Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterQuadrant('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer border ${
              filterQuadrant === 'all'
                ? isLight 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                  : 'bg-slate-100 text-slate-900 border-white shadow-xs'
                : isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' 
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            All Nodes ({nodes.length})
          </button>

          <button
            onClick={() => setFilterQuadrant(filterQuadrant === 'emergency' ? 'all' : 'emergency')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer border flex items-center gap-1 ${
              filterQuadrant === 'emergency'
                ? 'bg-red-600 text-white border-red-700 shadow-xs ring-2 ring-red-400/40'
                : isLight
                  ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                  : 'bg-red-950/40 hover:bg-red-900/60 text-red-300 border-red-900/60'
            }`}
          >
            <span>Critical</span>
            <span className="font-mono text-[10px] opacity-80">({counts.emergency})</span>
          </button>

          <button
            onClick={() => setFilterQuadrant(filterQuadrant === 'fragile' ? 'all' : 'fragile')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer border flex items-center gap-1 ${
              filterQuadrant === 'fragile'
                ? 'bg-amber-600 text-white border-amber-700 shadow-xs ring-2 ring-amber-400/40'
                : isLight
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border-amber-800/60'
            }`}
          >
            <span>Fragile</span>
            <span className="font-mono text-[10px] opacity-80">({counts.fragile})</span>
          </button>

          <button
            onClick={() => setFilterQuadrant(filterQuadrant === 'pillar' ? 'all' : 'pillar')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer border flex items-center gap-1 ${
              filterQuadrant === 'pillar'
                ? 'bg-blue-600 text-white border-blue-700 shadow-xs ring-2 ring-blue-400/40'
                : isLight
                  ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                  : 'bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 border-blue-900/60'
            }`}
          >
            <span>Local Pillar</span>
            <span className="font-mono text-[10px] opacity-80">({counts.pillar})</span>
          </button>

          <button
            onClick={() => setFilterQuadrant(filterQuadrant === 'noise' ? 'all' : 'noise')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer border flex items-center gap-1 ${
              filterQuadrant === 'noise'
                ? 'bg-slate-600 text-white border-slate-700 shadow-xs'
                : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <span>Peripheral</span>
            <span className="font-mono text-[10px] opacity-80">({counts.noise})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* F3 Capability Triage Switcher */}
          <div className={`flex items-center gap-1 p-0.5 rounded-lg border text-[10px] font-mono ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <span className={`px-1 text-[9px] uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Y-Axis:
            </span>
            <button
              onClick={() => setYAxisMode('psfi')}
              className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                yAxisMode === 'psfi'
                  ? isLight ? 'bg-purple-600 text-white shadow-xs' : 'bg-purple-600 text-white shadow-xs'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Package Structural Fragility"
            >
              Fragility
            </button>
            <button
              onClick={() => setYAxisMode('ce_max')}
              className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                yAxisMode === 'ce_max'
                  ? isLight ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-600 text-white shadow-xs'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Capability Exposure"
            >
              Capabilities
            </button>
          </div>

          <div className={`text-[11px] font-medium hidden sm:flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>• Click dot for diagnostic drawer</span>
          </div>
        </div>
      </div>

      {/* SVG Scatter Plot Container */}
      <div className={`relative rounded-xl border p-2 overflow-hidden select-none transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950 border-slate-800'
      }`}>
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-auto block"
          style={{ maxHeight: '330px' }}
        >
          <defs>
            {/* Glowing filter for critical dots */}
            <filter id="glow-emergency" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-fragile" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Amber hatching pattern for XZ Utils quadrant */}
            <pattern id="amber-stripes" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="12" stroke={isLight ? '#f59e0b20' : '#f59e0b18'} strokeWidth="2.5" />
            </pattern>
          </defs>

          {/* ========================================================= */}
          {/* QUADRANT BACKGROUND SHADING                               */}
          {/* ========================================================= */}

          {/* Top-Left: Critical Local Pillar */}
          <rect
            x={MARGIN.left}
            y={MARGIN.top}
            width={PLOT_WIDTH / 2}
            height={PLOT_HEIGHT / 2}
            fill={isLight ? 'rgba(59, 130, 246, 0.04)' : 'rgba(59, 130, 246, 0.05)'}
            stroke={isLight ? '#93c5fd40' : '#1e3a8a30'}
            strokeWidth="1"
          />

          {/* Top-Right: 🚨 EMERGENCY KEYSTONES */}
          <rect
            x={MID_X}
            y={MARGIN.top}
            width={PLOT_WIDTH / 2}
            height={PLOT_HEIGHT / 2}
            fill={isLight ? 'rgba(239, 68, 68, 0.06)' : 'rgba(239, 68, 68, 0.08)'}
            stroke={isLight ? '#fca5a550' : '#7f1d1d40'}
            strokeWidth="1"
          />

          {/* Bottom-Left: Peripheral Noise */}
          <rect
            x={MARGIN.left}
            y={MID_Y}
            width={PLOT_WIDTH / 2}
            height={PLOT_HEIGHT / 2}
            fill={isLight ? 'rgba(100, 116, 139, 0.03)' : 'rgba(100, 116, 139, 0.04)'}
            stroke={isLight ? '#cbd5e140' : '#33415530'}
            strokeWidth="1"
          />

          {/* Bottom-Right: ⚠️ FRAGILE MICRO-PACKAGE (XZ UTILS CLASS) - Amber Highlighted */}
          <rect
            x={MID_X}
            y={MID_Y}
            width={PLOT_WIDTH / 2}
            height={PLOT_HEIGHT / 2}
            fill={isLight ? 'rgba(245, 158, 11, 0.09)' : 'rgba(245, 158, 11, 0.12)'}
            stroke={isLight ? '#f59e0b' : '#d97706'}
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          {/* Subtle amber stripe overlay on XZ Utils quadrant */}
          <rect
            x={MID_X}
            y={MID_Y}
            width={PLOT_WIDTH / 2}
            height={PLOT_HEIGHT / 2}
            fill="url(#amber-stripes)"
          />

          {/* ========================================================= */}
          {/* QUADRANT LABELS / WATERMARKS                              */}
          {/* ========================================================= */}

          {/* Top-Left: P3 Fragile Leaf */}
          <text
            x={MARGIN.left + 8}
            y={MARGIN.top + 16}
            className={`text-[10px] font-bold uppercase tracking-wider font-mono ${
              isLight ? 'fill-orange-700' : 'fill-orange-400'
            }`}
          >
            P3: FRAGILE LEAF
          </text>
          <text
            x={MARGIN.left + 8}
            y={MARGIN.top + 28}
            className={`text-[9px] font-sans ${isLight ? 'fill-slate-500' : 'fill-slate-400'}`}
          >
            Low Criticality • High Fragility
          </text>

          {/* Top-Right: P1 Critical Chokepoint */}
          <text
            x={MID_X + 8}
            y={MARGIN.top + 16}
            className={`text-[10px] font-bold uppercase tracking-wider font-mono ${
              isLight ? 'fill-red-700' : 'fill-red-400'
            }`}
          >
            P1: CRITICAL CHOKEPOINT
          </text>
          <text
            x={MID_X + 8}
            y={MARGIN.top + 28}
            className={`text-[9px] font-sans ${isLight ? 'fill-slate-500' : 'fill-slate-400'}`}
          >
            High Criticality • High Fragility (Critical Chokepoints)
          </text>

          {/* Bottom-Left: Routine Dependency */}
          <text
            x={MARGIN.left + 8}
            y={MID_Y + 16}
            className={`text-[10px] font-bold uppercase tracking-wider font-mono ${
              isLight ? 'fill-slate-500' : 'fill-slate-400'
            }`}
          >
            ROUTINE DEPENDENCY
          </text>
          <text
            x={MARGIN.left + 8}
            y={MID_Y + 28}
            className={`text-[9px] font-sans ${isLight ? 'fill-slate-400' : 'fill-slate-500'}`}
          >
            Low Criticality • Low Fragility (Redundant Fallbacks)
          </text>

          {/* Bottom-Right: P2 Resilient Foundation */}
          <g>
            <rect
              x={MID_X + 8}
              y={MID_Y + 8}
              width="216"
              height="26"
              rx="4"
              fill={isLight ? 'rgba(254, 243, 199, 0.95)' : 'rgba(69, 26, 3, 0.85)'}
              stroke={isLight ? '#f59e0b' : '#b45309'}
              strokeWidth="1"
            />
            <text
              x={MID_X + 16}
              y={MID_Y + 22}
              className={`text-[9.5px] font-bold uppercase tracking-wider font-mono ${
                isLight ? 'fill-amber-900' : 'fill-amber-300'
              }`}
            >
              P2: RESILIENT FOUNDATION
            </text>
          </g>

          <text
            x={MID_X + 16}
            y={MID_Y + 46}
            className={`text-[9px] font-sans ${isLight ? 'fill-amber-800/80' : 'fill-amber-400/70'}`}
          >
            High Criticality • Low Fragility (Well-Funded Anchor)
          </text>

          {/* ========================================================= */}
          {/* AXIS LINES & CENTER CROSSHAIRS                            */}
          {/* ========================================================= */}

          {/* Center Dividing Lines */}
          <line
            x1={MID_X}
            y1={MARGIN.top}
            x2={MID_X}
            y2={MARGIN.top + PLOT_HEIGHT}
            stroke={isLight ? '#94a3b8' : '#475569'}
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <line
            x1={MARGIN.left}
            y1={MID_Y}
            x2={MARGIN.left + PLOT_WIDTH}
            y2={MID_Y}
            stroke={isLight ? '#94a3b8' : '#475569'}
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Bounding Outer Axis Box */}
          <line
            x1={MARGIN.left}
            y1={MARGIN.top + PLOT_HEIGHT}
            x2={MARGIN.left + PLOT_WIDTH}
            y2={MARGIN.top + PLOT_HEIGHT}
            stroke={isLight ? '#64748b' : '#64748b'}
            strokeWidth="1.5"
          />
          <line
            x1={MARGIN.left}
            y1={MARGIN.top}
            x2={MARGIN.left}
            y2={MARGIN.top + PLOT_HEIGHT}
            stroke={isLight ? '#64748b' : '#64748b'}
            strokeWidth="1.5"
          />

          {/* Axis Ticks and Labels */}
          {/* X-Axis Labels */}
          <text
            x={MARGIN.left}
            y={MARGIN.top + PLOT_HEIGHT + 14}
            className={`text-[9px] font-mono ${isLight ? 'fill-slate-500' : 'fill-slate-400'}`}
          >
            0%
          </text>
          <text
            x={MID_X}
            y={MARGIN.top + PLOT_HEIGHT + 14}
            textAnchor="middle"
            className={`text-[9px] font-mono ${isLight ? 'fill-slate-500' : 'fill-slate-400'}`}
          >
            50% Blast
          </text>
          <text
            x={MARGIN.left + PLOT_WIDTH}
            y={MARGIN.top + PLOT_HEIGHT + 14}
            textAnchor="end"
            className={`text-[9px] font-mono ${isLight ? 'fill-slate-500' : 'fill-slate-400'}`}
          >
            100%
          </text>
          <text
            x={MID_X}
            y={MARGIN.top + PLOT_HEIGHT + 28}
            textAnchor="middle"
            className={`text-[10px] font-medium font-sans ${isLight ? 'fill-slate-700' : 'fill-slate-300'}`}
          >
            SC (Structural Criticality) → (Downstream Tier-1 Reach & Repositories)
          </text>

          {/* Y-Axis Labels */}
          <text
            x={MARGIN.left - 6}
            y={MARGIN.top + PLOT_HEIGHT}
            textAnchor="end"
            className={`text-[9px] font-mono ${isLight ? 'fill-slate-500' : 'fill-slate-400'}`}
          >
            0
          </text>
          <text
            x={MARGIN.left - 6}
            y={MID_Y + 3}
            textAnchor="end"
            className={`text-[9px] font-mono ${isLight ? 'fill-slate-500' : 'fill-slate-400'}`}
          >
            50
          </text>
          <text
            x={MARGIN.left - 6}
            y={MARGIN.top + 6}
            textAnchor="end"
            className={`text-[9px] font-mono ${isLight ? 'fill-slate-500' : 'fill-slate-400'}`}
          >
            100
          </text>
          <text
            x={-(MARGIN.top + PLOT_HEIGHT / 2)}
            y={14}
            transform="rotate(-90)"
            textAnchor="middle"
            className={`text-[10px] font-medium font-sans ${isLight ? 'fill-slate-700' : 'fill-slate-300'}`}
          >
            {yAxisMode === 'ce_max' ? '↑ Capability Exposure' : '↑ Structural Fragility'}
          </text>

          {/* ========================================================= */}
          {/* PLOTTED NODES (INTERACTIVE SCATTER DOTS)                  */}
          {/* ========================================================= */}
          {plottedNodes.map(({ node, blastRadius, structuralDanger, quadrant }) => {
            const cx = getSvgX(blastRadius);
            const cy = getSvgY(structuralDanger);
            const isHovered = hoveredNodeId === node.id;
            const isSelected = selectedNodeId === node.id;
            const matchesFilter = filterQuadrant === 'all' || filterQuadrant === quadrant;

            // Dot Color by Quadrant
            let dotFill = '#64748b';
            let dotStroke = '#94a3b8';
            let glowFilter = undefined;

            if (quadrant === 'emergency') {
              dotFill = '#ef4444';
              dotStroke = '#fee2e2';
              glowFilter = 'url(#glow-emergency)';
            } else if (quadrant === 'fragile') {
              dotFill = '#f59e0b';
              dotStroke = '#fef3c7';
              glowFilter = 'url(#glow-fragile)';
            } else if (quadrant === 'pillar') {
              dotFill = '#3b82f6';
              dotStroke = '#dbeafe';
            }

            const baseRadius = node.articulationPoint ? 7.5 : node.systemicScore >= 80 ? 6.5 : 5;
            const radius = isHovered ? baseRadius + 3 : baseRadius;

            // Prominent names for landmark nodes
            const showDirectLabel = ['snakeyaml', 'internal-data-pipeline', 'minimist', 'internal-auth', 'ws-util'].includes(node.id);

            return (
              <g
                key={node.id}
                className="cursor-pointer transition-all duration-150"
                style={{
                  opacity: matchesFilter ? 1 : 0.15,
                  pointerEvents: matchesFilter ? 'auto' : 'none'
                }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={() => handleNodeClick(node.id)}
              >
                {/* Articulation point halo */}
                {node.articulationPoint && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius + 4}
                    fill="none"
                    stroke={dotFill}
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                    opacity={isHovered ? 0.9 : 0.6}
                    className="animate-pulse"
                  />
                )}

                {/* Main Scatter Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill={dotFill}
                  stroke={isSelected ? '#38bdf8' : isHovered ? '#ffffff' : dotStroke}
                  strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                  filter={glowFilter}
                />

                {/* Direct text label for landmark packages */}
                {showDirectLabel && matchesFilter && (
                  <text
                    x={cx + (blastRadius > 80 ? -8 : 8)}
                    y={cy - 6}
                    textAnchor={blastRadius > 80 ? 'end' : 'start'}
                    className={`text-[9.5px] font-mono font-bold pointer-events-none ${
                      isHovered
                        ? isLight ? 'fill-slate-900 font-extrabold' : 'fill-white font-extrabold'
                        : quadrant === 'emergency'
                        ? isLight ? 'fill-red-800' : 'fill-red-300'
                        : quadrant === 'fragile'
                        ? isLight ? 'fill-amber-800' : 'fill-amber-300'
                        : isLight ? 'fill-slate-700' : 'fill-slate-300'
                    }`}
                  >
                    {node.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* ========================================================= */}
        {/* INTERACTIVE FLOATING TOOLTIP                              */}
        {/* ========================================================= */}
        {hoveredPlotItem && (
          <div 
            className={`absolute z-30 p-3 rounded-lg border shadow-xl backdrop-blur-md pointer-events-none transition-all flex flex-col gap-1.5 min-w-[240px] max-w-[280px] ${
              isLight ? 'bg-white/95 border-slate-300 text-slate-900' : 'bg-slate-900/95 border-slate-700 text-slate-100'
            }`}
            style={{
              top: '12px',
              right: '12px'
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b pb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-xs">{hoveredPlotItem.node.name}</span>
                <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  v{hoveredPlotItem.node.version}
                </span>
              </div>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase ${
                hoveredPlotItem.quadrant === 'emergency'
                  ? 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
                  : hoveredPlotItem.quadrant === 'fragile'
                  ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                  : hoveredPlotItem.quadrant === 'pillar'
                  ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                  : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}>
                {hoveredPlotItem.quadrant === 'fragile' ? 'Fragile' : hoveredPlotItem.quadrant === 'emergency' ? 'Critical' : hoveredPlotItem.quadrant}
              </span>
            </div>

            {hoveredPlotItem.node.articulationPoint && (
              <div className="text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>High-impact dependency</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-0.5">
              <div>
                <span className={`block text-[9px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Blast Radius
                </span>
                <span className="font-mono font-bold text-xs">
                  {hoveredPlotItem.blastRadius}%
                </span>
                <div className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {hoveredPlotItem.node.tier1Reach} T1 Sinks • {hoveredPlotItem.node.dependents} Repos
                </div>
              </div>

              <div>
                <span className={`block text-[9px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Structural Danger
                </span>
                <span className={`font-mono font-bold text-xs ${
                  hoveredPlotItem.structuralDanger >= 80 ? 'text-red-600' : hoveredPlotItem.structuralDanger >= 50 ? 'text-amber-600' : 'text-slate-400'
                }`}>
                  {hoveredPlotItem.structuralDanger} / 100
                </span>
                <div className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {hoveredPlotItem.node.maintainers} maintainer(s)
                </div>
              </div>
            </div>

            <div className={`pt-1 border-t text-[10px] font-medium flex items-center gap-1 ${
              isLight ? 'text-cyan-700' : 'text-cyan-400'
            }`}>
              <Target className="w-3 h-3" />
              <span>Click dot to fly to 3D Topology →</span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* F3 WEAKEST-DIMENSION DIAGNOSTIC DRAWER                    */}
      {/* ========================================================= */}
      {(() => {
        const diagNode = nodes.find(n => n.id === diagnosticNodeId);
        if (!diagNode) return null;

        // Compute 4 dimensions:
        // 1. VLC_N: Version Lifecycle (e.g. 85%)
        const vlc = diagNode.systemicScore >= 80 ? 85 : diagNode.systemicScore >= 60 ? 55 : 20;
        // 2. PBS: Upgrade Breaking Barrier (20% for patch, 75% for major)
        const pbs = diagNode.id === 'snakeyaml' ? 75 : 20;
        // 3. RDT_N: Relative Depth Tax (nesting depth)
        const rdt = diagNode.layer <= 2 ? 65 : 30;
        // 4. PMI*: Pinning Monoculture Index
        const pmi = diagNode.dependents >= 15 ? 80 : 40;

        const dimensions = [
          { 
            name: '1. Version Lifecycle (VLC_N)', 
            formula: '(t_now - t_rel) / (t_EOL - t_rel)',
            val: vlc, 
            note: vlc >= 70 ? 'EOL Imminent / 412d stale release cadence' : 'Active upstream cycle' 
          },
          { 
            name: '2. Upgrade Barrier (PBS)', 
            formula: '|E_broken| / |E_client|',
            val: pbs, 
            note: pbs >= 60 ? 'Major Breaking API jump (2.0 bytecode break)' : 'Seamless backwards-compatible patch' 
          },
          { 
            name: '3. Depth Tax (RDT_N)', 
            formula: 'Shortest path depth percentile',
            val: rdt, 
            note: rdt >= 50 ? 'Deeply nested transitive layer (Layer 1-2)' : 'Direct or shallow dependency' 
          },
          { 
            name: '4. Pinning Monoculture (PMI*)', 
            formula: 'Herfindahl portfolio concentration',
            val: pmi, 
            note: pmi >= 70 ? 'Widespread strict lockfile pinning across repos' : 'Flexible range resolution' 
          }
        ];

        // Find limiting factor (highest score)
        const limiting = [...dimensions].sort((a, b) => b.val - a.val)[0];
        const emittedPoints = (25 * (limiting.val / 100)).toFixed(2);

        return (
          <div className={`p-4 rounded-xl border flex flex-col gap-3.5 transition-all shadow-lg animate-in fade-in slide-in-from-top-2 ${
            isLight ? 'bg-white border-purple-200 ring-1 ring-purple-100' : 'bg-slate-900/90 border-purple-900/50 ring-1 ring-purple-900/30'
          }`}>
            <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg ${isLight ? 'bg-purple-50 text-purple-700' : 'bg-purple-950/60 text-purple-400'}`}>
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                      Dimension Breakdown: <code className="font-mono text-purple-600 dark:text-purple-400">{diagNode.name}@{diagNode.version}</code>
                    </span>
                  </div>
                  <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Structural risk breakdown across core security dimensions
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onGoToEcosystem && (
                  <button
                    onClick={() => {
                      onSelectNode(diagNode.id);
                      onGoToEcosystem();
                    }}
                    className={`text-xs px-2.5 py-1 rounded-md border font-semibold flex items-center gap-1 transition-all ${
                      isLight ? 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-300' : 'bg-purple-950/60 hover:bg-purple-900 text-purple-200 border-purple-800'
                    }`}
                  >
                    <span>Fly to 3D Topology</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => setDiagnosticNodeId(null)}
                  className="text-xs px-1.5 py-0.5 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Close diagnostic drawer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 4 Dimension Bars with Mathematical Formulas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {dimensions.map((dim, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                    dim.name === limiting.name
                      ? isLight ? 'bg-red-50/60 border-red-300 ring-1 ring-red-200' : 'bg-red-950/30 border-red-800 ring-1 ring-red-700'
                      : isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-semibold">{dim.name}</span>
                      <span className={`font-mono font-bold ${
                        dim.val >= 70 ? 'text-red-600' : dim.val >= 40 ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {dim.val}%
                      </span>
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 mb-1.5">
                      Formula: {dim.formula}
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          dim.val >= 70 ? 'bg-red-600' : dim.val >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${dim.val}%` }}
                      />
                    </div>
                  </div>
                  <div className={`text-[10px] mt-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {dim.note}
                  </div>
                </div>
              ))}
            </div>

            {/* Limiting Factor Summary Pill & Downstream Interface */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
              <div className={`p-2.5 rounded-lg border flex-1 flex items-center gap-2 ${
                isLight ? 'bg-red-50 border-red-200 text-red-900' : 'bg-red-950/40 border-red-800 text-red-200'
              }`}>
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  <strong>Weakest-Dimension Principle:</strong> Limiting factor is <strong>{limiting.name}</strong> ({limiting.val}%). A single severe axis dictates $PSFI = \max(VLC_N, PBS, RDT_N, PMI^*)$.
                </span>
              </div>

              <div className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 font-mono ${
                isLight ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-purple-950/40 border-purple-800 text-purple-200'
              }`}>
                <div className="text-[10px]">
                  <span className="font-bold">DOWNSTREAM INTERFACE:</span>
                  <div>Emits F_pts = 25 * PSFI = <strong className="text-purple-600 dark:text-purple-300">{emittedPoints} pts</strong></div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================= */}
      {/* ⚠️ XZ UTILS CALLOUT BANNER                                 */}
      {/* ========================================================= */}
      <div className={`p-3.5 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isLight 
          ? 'bg-amber-50/90 border-amber-200 text-amber-950 shadow-xs' 
          : 'bg-amber-950/30 border-amber-900/60 text-amber-100'
      }`}>
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <div className="text-xs font-bold flex items-center gap-2">
              <span>High-Reach, Low-CVSS Dependencies (Sleeper Risks)</span>
            </div>
            <p className={`text-[11px] leading-relaxed max-w-xl ${isLight ? 'text-amber-900/80' : 'text-amber-200/80'}`}>
              Packages in this quadrant possess broad transitive blast radius across critical services despite low direct CVSS scores.
            </p>
          </div>
        </div>

        <button
          onClick={() => setFilterQuadrant('fragile')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 border shrink-0 ${
            filterQuadrant === 'fragile'
              ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
              : isLight
                ? 'bg-white hover:bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-amber-900/60 hover:bg-amber-800 text-amber-100 border-amber-700'
          }`}
        >
          <span>{filterQuadrant === 'fragile' ? 'Showing Sleeper Risks' : 'Filter Sleeper Risks'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
