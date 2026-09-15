import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { EcosystemNode } from '../types';
import { useTheme } from '../context/ThemeContext';

interface CentralityVelocityCardProps {
  node: EcosystemNode;
  mode?: 'full' | 'compact' | 'sparkline-only';
  className?: string;
}

const SNAPSHOT_LABELS = ['Day -90', 'Day -75', 'Day -60', 'Day -45', 'Day -30', 'Day 0'];

export const CentralityVelocityCard: React.FC<CentralityVelocityCardProps> = ({
  node,
  mode = 'full',
  className = ''
}) => {
  const { isLight } = useTheme();
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Derive velocity data
  const velocity = node.centralityVelocity ?? (
    node.id === 'snakeyaml' ? 142 :
    node.id === 'minimist' ? 105 :
    node.id === 'internal-data-pipeline' ? 118 :
    node.id === 'ws-util' ? 85 :
    node.articulationPoint ? 94 :
    Math.round((node.reversePageRankPercentile || 50) * 0.7)
  );

  const history = node.velocityHistory && node.velocityHistory.length === 6
    ? node.velocityHistory
    : (() => {
        // Synthesize smooth historical growth curve based on current percentile
        const endVal = node.reversePageRankPercentile || 75;
        const startVal = Math.max(8, Math.round(endVal * (1 - Math.min(0.85, velocity / 160))));
        const p1 = Math.round(startVal + (endVal - startVal) * 0.12);
        const p2 = Math.round(startVal + (endVal - startVal) * 0.28);
        const p3 = Math.round(startVal + (endVal - startVal) * 0.50);
        const p4 = Math.round(startVal + (endVal - startVal) * 0.75);
        return [startVal, p1, p2, p3, p4, endVal];
      })();

  const isEscalating = velocity >= 100 || !!node.isEscalatingKeystone;

  // Sparkline SVG geometry calculations (for compact / sparkline-only)
  if (mode === 'sparkline-only') {
    const W = 70;
    const H = 22;
    const minVal = Math.min(...history);
    const maxVal = Math.max(...history, 100);
    const range = Math.max(10, maxVal - minVal);
    
    const points = history.map((val, idx) => {
      const x = 4 + (idx / (history.length - 1)) * (W - 8);
      const y = H - 3 - ((val - minVal) / range) * (H - 6);
      return `${x},${y}`;
    }).join(' ');

    const strokeColor = isEscalating ? '#f59e0b' : velocity > 0 ? '#38bdf8' : '#94a3b8';

    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <svg width={W} height={H} className="overflow-visible">
          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
          {/* Last endpoint pulse */}
          {(() => {
            const lastVal = history[history.length - 1];
            const lx = W - 4;
            const ly = H - 3 - ((lastVal - minVal) / range) * (H - 6);
            return (
              <circle
                cx={lx}
                cy={ly}
                r="2.5"
                fill={strokeColor}
                className={isEscalating ? 'animate-ping' : undefined}
              />
            );
          })()}
        </svg>
        <span className={`text-[11px] font-mono font-bold flex items-center ${
          isEscalating ? 'text-amber-500 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'
        }`}>
          {velocity >= 0 ? `+${velocity}%` : `${velocity}%`}
        </span>
      </div>
    );
  }

  // Full interactive card mode
  const SVG_W = 340;
  const SVG_H = 80;
  const PAD_X = 24;
  const PAD_Y = 16;
  const PLOT_W = SVG_W - PAD_X * 2;
  const PLOT_H = SVG_H - PAD_Y * 2;

  const minV = 0;
  const maxV = 100;

  const getSvgX = (idx: number) => PAD_X + (idx / (history.length - 1)) * PLOT_W;
  const getSvgY = (val: number) => PAD_Y + PLOT_H - (val / 100) * PLOT_H;

  const polylinePoints = history.map((val, idx) => `${getSvgX(idx)},${getSvgY(val)}`).join(' ');
  const areaPoints = `${getSvgX(0)},${PAD_Y + PLOT_H} ${polylinePoints} ${getSvgX(history.length - 1)},${PAD_Y + PLOT_H}`;

  const themeStroke = isEscalating 
    ? '#f59e0b' 
    : velocity > 30 
      ? isLight ? '#0284c7' : '#38bdf8' 
      : isLight ? '#64748b' : '#94a3b8';

  return (
    <div className={`p-4 rounded-lg border flex flex-col gap-3 transition-colors ${
      isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/80 border-slate-800'
    } ${className}`}>
      {/* Header with Alarm Badge */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${
            isEscalating 
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400' 
              : isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
          }`}>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                F5 Centrality Velocity
              </span>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase ${
                isEscalating 
                  ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800' 
                  : isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                90-Day Trend
              </span>
            </div>
            <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Reverse PageRank Growth Across Monitored Lockfiles
            </span>
          </div>
        </div>

        {/* Alarm Trend Badge */}
        {isEscalating ? (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500 text-white font-mono text-[10px] font-bold shadow-xs animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span>🚨 ESCALATING_KEYSTONE</span>
          </div>
        ) : (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
            isLight ? 'bg-white text-slate-700 border-slate-200 shadow-xs' : 'bg-slate-800/80 text-slate-300 border-slate-700'
          }`}>
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>NORMAL VELOCITY</span>
          </div>
        )}
      </div>

      {/* Main Metric Stat Bar */}
      <div className="flex items-baseline justify-between border-b pb-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-bold font-mono tracking-tight ${
              isEscalating ? 'text-amber-600 dark:text-amber-400' : isLight ? 'text-slate-900' : 'text-slate-100'
            }`}>
              {velocity >= 0 ? `+${velocity}%` : `${velocity}%`}
            </span>
            <span className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              velocity surge
            </span>
          </div>
          <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Traversed from P{history[0]} to P{history[history.length - 1]} in 6 snapshots
          </p>
        </div>

        <div className="text-right font-mono text-[11px]">
          <span className={`block text-[9px] uppercase ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            Current Centrality
          </span>
          <span className="font-bold text-xs">
            {node.reversePageRankPercentile || history[history.length - 1]}th Percentile
          </span>
        </div>
      </div>

      {/* Interactive SVG Sparkline with Gradient and Hover Tooltips */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-20 overflow-visible"
        >
          <defs>
            <linearGradient id={`sparkline-grad-${node.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={themeStroke} stopOpacity={isLight ? 0.35 : 0.45} />
              <stop offset="100%" stopColor={themeStroke} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Dotted 50th Percentile Baseline */}
          <line
            x1={PAD_X}
            y1={getSvgY(50)}
            x2={PAD_X + PLOT_W}
            y2={getSvgY(50)}
            stroke={isLight ? '#cbd5e1' : '#334155'}
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text
            x={PAD_X - 4}
            y={getSvgY(50) + 3}
            textAnchor="end"
            className={`text-[8px] font-mono ${isLight ? 'fill-slate-400' : 'fill-slate-500'}`}
          >
            P50
          </text>

          {/* Area Fill */}
          <polygon
            points={areaPoints}
            fill={`url(#sparkline-grad-${node.id})`}
          />

          {/* Main Polyline */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke={themeStroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {history.map((val, idx) => {
            const cx = getSvgX(idx);
            const cy = getSvgY(val);
            const isHovered = hoveredPointIndex === idx;

            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPointIndex(idx)}
                onMouseLeave={() => setHoveredPointIndex(null)}
              >
                {/* Hit area */}
                <circle cx={cx} cy={cy} r="10" fill="transparent" />

                {/* Point */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 5 : idx === history.length - 1 ? 4 : 3}
                  fill={isHovered ? '#ffffff' : themeStroke}
                  stroke={themeStroke}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Snapshot Tooltip */}
        {hoveredPointIndex !== null && (
          <div
            className={`absolute z-20 pointer-events-none px-2 py-1 rounded text-[10px] font-mono shadow-md border -translate-x-1/2 -translate-y-7 ${
              isLight ? 'bg-slate-900 text-white border-slate-700' : 'bg-white text-slate-900 border-slate-200'
            }`}
            style={{
              left: `${(getSvgX(hoveredPointIndex) / SVG_W) * 100}%`,
              top: `${(getSvgY(history[hoveredPointIndex]) / SVG_H) * 100}%`
            }}
          >
            <strong>{SNAPSHOT_LABELS[hoveredPointIndex]}:</strong> P{history[hoveredPointIndex]}
          </div>
        )}
      </div>

      {/* Snapshot Axis Markers */}
      <div className="flex justify-between text-[9px] font-mono text-slate-400 px-1 -mt-1">
        <span>Day −90</span>
        <span>Day −60</span>
        <span>Day −30</span>
        <span className="font-bold text-amber-500">Day 0 (Now)</span>
      </div>

      {/* Narrative Callout */}
      <div className={`p-2.5 rounded-md border text-[11px] leading-relaxed flex items-start gap-2 ${
        isEscalating 
          ? isLight ? 'bg-amber-50/70 border-amber-200 text-amber-900' : 'bg-amber-950/20 border-amber-900/40 text-amber-200'
          : isLight ? 'bg-white border-slate-200 text-slate-600 shadow-xs' : 'bg-slate-950/40 border-slate-800 text-slate-400'
      }`}>
        <Zap className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isEscalating ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
        <div>
          {isEscalating ? (
            <span>
              <strong>Leading Trend Alarm: </strong>
              Adoption of <code>{node.name}</code> surged <strong>+{velocity}%</strong> over recent lockfile commits before any public CVE was logged. Keystone flags this accelerating dependency as an emerging single point of failure.
            </span>
          ) : (
            <span>
              <strong>Adoption Cadence: </strong>
              Growth trajectory is steady within expected historical portfolio bounds. No sudden viral lockfile infiltration detected.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
