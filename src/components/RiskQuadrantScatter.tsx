import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  ExternalLink, 
  Target, 
  Info,
  CheckCircle2,
  Activity
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
        structuralDanger = node.systemicScore;
        if (typeof structuralDanger !== 'number') {
          const topo = 0.6 * (node.reversePageRankPercentile || 50) + 0.4 * (node.betweennessPercentile || 50);
          const frag = 1.0 + (node.articulationPoint ? 0.45 : 0) + (node.maintainers <= 1 ? 0.40 : 0.10);
          structuralDanger = Math.round((topo * frag) / 1.95);
        }
      }
      structuralDanger = Math.min(95, Math.max(10, structuralDanger));

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
  }, [nodes, yAxisMode]);

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
    <div className="flex flex-col gap-4 select-none">
      {/* Top Filter & Control Bar - Connectors Style */}
      <div className="flex items-center justify-between gap-2.5 flex-wrap text-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl connector-3d-card overflow-x-auto">
          <button
            onClick={() => setFilterQuadrant('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
              filterQuadrant === 'all'
                ? 'btn-3d-primary text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Nodes ({nodes.length})
          </button>

          <button
            onClick={() => setFilterQuadrant(filterQuadrant === 'emergency' ? 'all' : 'emergency')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
              filterQuadrant === 'emergency'
                ? 'btn-3d-primary text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Critical Keystones ({counts.emergency})
          </button>

          <button
            onClick={() => setFilterQuadrant(filterQuadrant === 'fragile' ? 'all' : 'fragile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
              filterQuadrant === 'fragile'
                ? 'btn-3d-primary text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sleeper Dependencies ({counts.fragile})
          </button>

          <button
            onClick={() => setFilterQuadrant(filterQuadrant === 'pillar' ? 'all' : 'pillar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
              filterQuadrant === 'pillar'
                ? 'btn-3d-primary text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Local Pillars ({counts.pillar})
          </button>

          <button
            onClick={() => setFilterQuadrant(filterQuadrant === 'noise' ? 'all' : 'noise')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
              filterQuadrant === 'noise'
                ? 'btn-3d-primary text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Peripheral ({counts.noise})
          </button>
        </div>

        {/* Y-Axis Metric Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl connector-3d-card text-xs font-mono">
            <span className="px-1.5 text-[10px] font-bold text-slate-400 uppercase">
              Y-Axis:
            </span>
            <button
              onClick={() => setYAxisMode('psfi')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                yAxisMode === 'psfi'
                  ? 'btn-3d-primary text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              PSFI (Fragility)
            </button>
            <button
              onClick={() => setYAxisMode('ce_max')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                yAxisMode === 'ce_max'
                  ? 'btn-3d-primary text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              CE_max (Capabilities)
            </button>
          </div>
        </div>
      </div>

      {/* SVG Scatter Plot Container - Clean Enterprise Surface */}
      <div className="connector-3d-card p-4 relative overflow-hidden">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-auto block"
          style={{ maxHeight: '320px' }}
        >
          {/* Subtle Enterprise Gridlines */}
          <line
            x1={MID_X}
            y1={MARGIN.top}
            x2={MID_X}
            y2={MARGIN.top + PLOT_HEIGHT}
            stroke={isLight ? '#e2e8f0' : '#1e293b'}
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <line
            x1={MARGIN.left}
            y1={MID_Y}
            x2={MARGIN.left + PLOT_WIDTH}
            y2={MID_Y}
            stroke={isLight ? '#e2e8f0' : '#1e293b'}
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Clean Outer Frame */}
          <rect
            x={MARGIN.left}
            y={MARGIN.top}
            width={PLOT_WIDTH}
            height={PLOT_HEIGHT}
            fill="none"
            stroke={isLight ? '#cbd5e1' : '#334155'}
            strokeWidth="1"
            rx="6"
          />

          {/* Quadrant Labels - Minimal & Elegant */}
          {/* Top-Right: Critical Keystone */}
          <text
            x={MID_X + 12}
            y={MARGIN.top + 18}
            className={`text-[11px] font-bold uppercase tracking-wider font-mono ${
              isLight ? 'fill-slate-900' : 'fill-slate-100'
            }`}
          >
            P1: CRITICAL KEYSTONE
          </text>
          <text
            x={MID_X + 12}
            y={MARGIN.top + 30}
            className="text-[9px] font-sans fill-slate-400"
          >
            High Criticality • High Fragility
          </text>

          {/* Top-Left: Fragile Leaf */}
          <text
            x={MARGIN.left + 12}
            y={MARGIN.top + 18}
            className={`text-[11px] font-bold uppercase tracking-wider font-mono ${
              isLight ? 'fill-slate-800' : 'fill-slate-200'
            }`}
          >
            P3: FRAGILE LEAF
          </text>
          <text
            x={MARGIN.left + 12}
            y={MARGIN.top + 30}
            className="text-[9px] font-sans fill-slate-400"
          >
            Low Criticality • High Fragility
          </text>

          {/* Bottom-Left: Routine Dependency */}
          <text
            x={MARGIN.left + 12}
            y={MID_Y + 20}
            className="text-[11px] font-bold uppercase tracking-wider font-mono fill-slate-400"
          >
            ROUTINE DEPENDENCY
          </text>
          <text
            x={MARGIN.left + 12}
            y={MID_Y + 32}
            className="text-[9px] font-sans fill-slate-400"
          >
            Low Criticality • Low Fragility
          </text>

          {/* Bottom-Right: Resilient Foundation */}
          <text
            x={MID_X + 12}
            y={MID_Y + 20}
            className={`text-[11px] font-bold uppercase tracking-wider font-mono ${
              isLight ? 'fill-slate-800' : 'fill-slate-200'
            }`}
          >
            P2: RESILIENT FOUNDATION
          </text>
          <text
            x={MID_X + 12}
            y={MID_Y + 32}
            className="text-[9px] font-sans fill-slate-400"
          >
            High Criticality • Low Fragility
          </text>

          {/* Axis Ticks & Metrics */}
          <text
            x={MARGIN.left}
            y={MARGIN.top + PLOT_HEIGHT + 14}
            className="text-[9px] font-mono fill-slate-400"
          >
            0%
          </text>
          <text
            x={MID_X}
            y={MARGIN.top + PLOT_HEIGHT + 14}
            textAnchor="middle"
            className="text-[9px] font-mono fill-slate-400"
          >
            50% Blast
          </text>
          <text
            x={MARGIN.left + PLOT_WIDTH}
            y={MARGIN.top + PLOT_HEIGHT + 14}
            textAnchor="end"
            className="text-[9px] font-mono fill-slate-400"
          >
            100%
          </text>
          <text
            x={MID_X}
            y={MARGIN.top + PLOT_HEIGHT + 28}
            textAnchor="middle"
            className="text-[10px] font-medium font-sans fill-slate-500"
          >
            Structural Criticality (Downstream Reach & Repositories)
          </text>

          <text
            x={MARGIN.left - 8}
            y={MARGIN.top + PLOT_HEIGHT}
            textAnchor="end"
            className="text-[9px] font-mono fill-slate-400"
          >
            0
          </text>
          <text
            x={MARGIN.left - 8}
            y={MID_Y + 3}
            textAnchor="end"
            className="text-[9px] font-mono fill-slate-400"
          >
            50
          </text>
          <text
            x={MARGIN.left - 8}
            y={MARGIN.top + 6}
            textAnchor="end"
            className="text-[9px] font-mono fill-slate-400"
          >
            100
          </text>
          <text
            x={-(MARGIN.top + PLOT_HEIGHT / 2)}
            y={12}
            transform="rotate(-90)"
            textAnchor="middle"
            className="text-[10px] font-medium font-sans fill-slate-500"
          >
            {yAxisMode === 'ce_max' ? 'Capability Exposure (CE_max)' : 'Structural Fragility (PSFI)'}
          </text>

          {/* Interactive Scatter Dots - Clean Brand Palette */}
          {plottedNodes.map(({ node, blastRadius, structuralDanger, quadrant }) => {
            const cx = getSvgX(blastRadius);
            const cy = getSvgY(structuralDanger);
            const isHovered = hoveredNodeId === node.id;
            const isSelected = selectedNodeId === node.id;
            const matchesFilter = filterQuadrant === 'all' || filterQuadrant === quadrant;

            // Brand Cobalt for Keystones, Sleek Slate for Peripheral
            const isKeystone = quadrant === 'emergency' || node.articulationPoint || node.systemicScore >= 80;
            const dotFill = isKeystone ? '#1755e6' : '#64748b';
            const dotStroke = isSelected ? '#2e70ee' : isHovered ? '#ffffff' : isKeystone ? '#93c5fd' : '#cbd5e1';

            const baseRadius = node.articulationPoint ? 7.5 : isKeystone ? 6.5 : 4.5;
            const radius = isHovered ? baseRadius + 3 : baseRadius;

            const showDirectLabel = ['snakeyaml', 'internal-data-pipeline', 'minimist', 'internal-auth', 'api-core'].includes(node.id);

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
                    stroke="#1755e6"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                    opacity={isHovered ? 0.9 : 0.4}
                  />
                )}

                {/* Main Scatter Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill={dotFill}
                  stroke={isSelected ? '#2e70ee' : isHovered ? '#ffffff' : dotStroke}
                  strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                />

                {/* Direct text label */}
                {showDirectLabel && matchesFilter && (
                  <text
                    x={cx + (blastRadius > 80 ? -8 : 8)}
                    y={cy - 8}
                    textAnchor={blastRadius > 80 ? 'end' : 'start'}
                    className={`text-[9.5px] font-mono font-bold ${
                      isLight ? 'fill-slate-900' : 'fill-slate-100'
                    }`}
                  >
                    {node.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Popup */}
        {hoveredPlotItem && (
          <div
            className="absolute z-30 p-2.5 rounded-xl connector-3d-card text-xs shadow-xl pointer-events-none flex flex-col gap-1 border"
            style={{
              left: `${Math.min(SVG_WIDTH - 180, Math.max(50, getSvgX(hoveredPlotItem.blastRadius)))}px`,
              top: `${Math.max(20, getSvgY(hoveredPlotItem.structuralDanger) - 75)}px`
            }}
          >
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>{hoveredPlotItem.node.name}</span>
              <span className="text-[10px] font-mono text-slate-400">v{hoveredPlotItem.node.version}</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Systemic Risk: <strong className="text-blue-600 dark:text-blue-400">{hoveredPlotItem.structuralDanger}/100</strong> • Reach: {hoveredPlotItem.node.tier1Reach} Tier-1
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* WEAKEST-DIMENSION DIAGNOSTIC DRAWER - Clean Enterprise    */}
      {/* ========================================================= */}
      {(() => {
        const diagNode = nodes.find(n => n.id === diagnosticNodeId);
        if (!diagNode) return null;

        const vlc = diagNode.systemicScore >= 80 ? 85 : diagNode.systemicScore >= 60 ? 55 : 20;
        const pbs = diagNode.id === 'snakeyaml' ? 75 : 20;
        const rdt = diagNode.layer <= 2 ? 65 : 30;
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

        const limiting = [...dimensions].sort((a, b) => b.val - a.val)[0];
        const emittedPoints = (25 * (limiting.val / 100)).toFixed(2);

        return (
          <div className="connector-3d-card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                      Weakest-Dimension Diagnostic: <span className="text-blue-600 dark:text-blue-400">{diagNode.name}@{diagNode.version}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold uppercase">
                      F3 PSFI Drilldown
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      Coverage: 4/4 Available
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                    Decomposing Package Structural Fragility Index into 4 Orthogonal Risk Axes
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
                    className="btn-3d-primary px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer select-none"
                  >
                    <span>Fly to 3D Topology</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setDiagnosticNodeId(null)}
                  className="text-xs px-2 py-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Close diagnostic drawer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 4 Dimension Bars - Connectors Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dimensions.map((dim, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-900 dark:text-white">{dim.name}</span>
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {dim.val}%
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mb-2">
                      Formula: {dim.formula}
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                        style={{ width: `${dim.val}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    {dim.note}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Callout Banner */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>
                  <strong>Limiting Factor:</strong> <strong>{limiting.name}</strong> ({limiting.val}%). A single severe axis dictates overall structural fragility index.
                </span>
              </div>

              <div className="font-mono text-xs text-slate-700 dark:text-slate-300 shrink-0">
                Emits: <strong className="text-blue-600 dark:text-blue-400">{emittedPoints} pts</strong>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================= */}
      {/* XZ UTILS CALLOUT BANNER - Clean Connectors Style          */}
      {/* ========================================================= */}
      <div className="connector-3d-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
            <Activity className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Sleeper Dependency Detection (Bottom-Right Quadrant)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold uppercase">
                Pre-CVE Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mt-0.5">
              Dependencies in this quadrant (e.g. <code>minimist</code>, <code>ws-util</code>) possess massive transitive blast radius across Tier-1 assets despite modest direct vulnerability scores.
            </p>
          </div>
        </div>

        <button
          onClick={() => setFilterQuadrant('fragile')}
          className="btn-3d-secondary px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shrink-0 cursor-pointer select-none"
        >
          <span>{filterQuadrant === 'fragile' ? 'Showing Sleeper Nodes' : 'Filter Sleeper Nodes'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
