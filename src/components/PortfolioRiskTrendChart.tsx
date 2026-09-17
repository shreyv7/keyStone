import React, { useState, useMemo } from 'react';
import { TrendingUp, AlertTriangle, ShieldCheck, Clock, Zap, DollarSign, Activity } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TrendSnapshot {
  day: number;
  date: string;
  systemicScore: number;
  financialExposureM: number;
  keystonesCount: number;
  milestone?: string;
  badgeType?: 'baseline' | 'anomaly' | 'cve' | 'remediated';
  narrative: string;
}

const SNAPSHOTS_90D: TrendSnapshot[] = [
  {
    day: -90,
    date: 'Day -90 (Nov 12)',
    systemicScore: 32,
    financialExposureM: 14.5,
    keystonesCount: 1,
    milestone: 'Baseline',
    badgeType: 'baseline',
    narrative: 'Pristine ecosystem baseline. Minimal transitive articulation points detected.'
  },
  {
    day: -75,
    date: 'Day -75 (Nov 27)',
    systemicScore: 35,
    financialExposureM: 16.8,
    keystonesCount: 1,
    narrative: 'Routine minor SemVer updates across internal data libraries.'
  },
  {
    day: -60,
    date: 'Day -60 (Dec 12)',
    systemicScore: 41,
    financialExposureM: 22.0,
    keystonesCount: 2,
    narrative: 'Internal services begin centralizing ingestion pathways into shared libraries.'
  },
  {
    day: -45,
    date: 'Day -45 (Dec 27)',
    systemicScore: 54,
    financialExposureM: 34.5,
    keystonesCount: 3,
    narrative: 'Centrality velocity begins accelerating (+48%) across transitive dependencies.'
  },
  {
    day: -30,
    date: 'Day -30 (Jan 11)',
    systemicScore: 76,
    financialExposureM: 59.2,
    keystonesCount: 5,
    milestone: 'Stealth Anomaly',
    badgeType: 'anomaly',
    narrative: 'Stealth Anomaly: Un-notified maintainer churn & commit surge in snakeyaml.'
  },
  {
    day: -15,
    date: 'Day -15 (Jan 26)',
    systemicScore: 84,
    financialExposureM: 71.8,
    keystonesCount: 6,
    narrative: 'Structural articulation point hardens across 21 downstream services.'
  },
  {
    day: 0,
    date: 'Day 0 (Today)',
    systemicScore: 92,
    financialExposureM: 85.0,
    keystonesCount: 7,
    milestone: 'Public CVE',
    badgeType: 'cve',
    narrative: '💥 Public Disclosure: CVE-2022-1471 Deserialization RCE published.'
  },
  {
    day: 7,
    date: 'Projected Fix (Day +7)',
    systemicScore: 18,
    financialExposureM: 4.9,
    keystonesCount: 0,
    milestone: 'Targeted Fix',
    badgeType: 'remediated',
    narrative: '🛡️ Targeted Fix Applied: internal-data-pipeline v2.5.0 severs all attack vectors.'
  }
];

export const PortfolioRiskTrendChart: React.FC = () => {
  const { isLight } = useTheme();
  const [timeRange, setTimeRange] = useState<'90d' | '30d' | '14d'>('90d');
  const [metric, setMetric] = useState<'score' | 'exposure' | 'keystones'>('score');
  const [hoveredIndex, setHoveredIndex] = useState<number>(6); // Default to Day 0

  // Filter snapshots according to selected range
  const visibleSnapshots = useMemo(() => {
    if (timeRange === '14d') {
      return SNAPSHOTS_90D.filter(s => s.day >= -15);
    }
    if (timeRange === '30d') {
      return SNAPSHOTS_90D.filter(s => s.day >= -30);
    }
    return SNAPSHOTS_90D;
  }, [timeRange]);

  // Selected snapshot for inspection
  const activeSnapshot = visibleSnapshots[Math.min(hoveredIndex, visibleSnapshots.length - 1)] || visibleSnapshots[visibleSnapshots.length - 1];

  // Chart coordinate mapping (viewBox: 760 x 200)
  const chartWidth = 760;
  const chartHeight = 200;
  const padX = 45;
  const padY = 25;
  const graphWidth = chartWidth - padX * 2;
  const graphHeight = chartHeight - padY * 2;

  const points = useMemo(() => {
    const n = visibleSnapshots.length;
    return visibleSnapshots.map((snap, i) => {
      const x = padX + (i / (n - 1)) * graphWidth;
      let val = snap.systemicScore;
      let maxVal = 100;

      if (metric === 'exposure') {
        val = snap.financialExposureM;
        maxVal = 100; // up to $100M
      } else if (metric === 'keystones') {
        val = snap.keystonesCount;
        maxVal = 8;
      }

      const y = padY + graphHeight - (val / maxVal) * graphHeight;
      return { x, y, snap, i };
    });
  }, [visibleSnapshots, metric, graphWidth, graphHeight]);

  // Generate SVG path strings
  const { linePath, areaPath } = useMemo(() => {
    if (points.length === 0) return { linePath: '', areaPath: '' };

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      // Smooth cubic bezier
      const cp1x = prev.x + (curr.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) / 2;
      const cp2y = curr.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    const last = points[points.length - 1];
    const first = points[0];
    const bottomY = padY + graphHeight;
    const area = `${d} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;

    return { linePath: d, areaPath: area };
  }, [points, graphHeight]);

  return (
    <div className={`p-5 rounded-xl border transition-colors select-none ${
      isLight 
        ? 'bg-white border-slate-200 shadow-xs' 
        : 'bg-slate-900/50 border-slate-800'
    }`}>
      {/* Chart Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 mb-4 border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-sm font-bold tracking-tight">Portfolio Risk Trajectory (90-Day Timeline)</h3>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Tracks aggregate systemic fragility over time, highlighting pre-CVE anomaly emergence and post-fix insulation.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Metric Selector Pills */}
          <div className={`p-0.5 rounded-lg border flex items-center ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-800 border-slate-700'
          }`}>
            <button
              onClick={() => setMetric('score')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                metric === 'score'
                  ? isLight ? 'bg-white text-cyan-700 shadow-xs font-semibold' : 'bg-cyan-950 text-cyan-300 font-semibold'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Risk Score
            </button>
            <button
              onClick={() => setMetric('exposure')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                metric === 'exposure'
                  ? isLight ? 'bg-white text-purple-700 shadow-xs font-semibold' : 'bg-purple-950 text-purple-300 font-semibold'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              $ Financial
            </button>
            <button
              onClick={() => setMetric('keystones')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                metric === 'keystones'
                  ? isLight ? 'bg-white text-amber-700 shadow-xs font-semibold' : 'bg-amber-950 text-amber-300 font-semibold'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Keystones
            </button>
          </div>

          {/* Time Range Pills */}
          <div className={`p-0.5 rounded-lg border flex items-center ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700'
          }`}>
            <button
              onClick={() => { setTimeRange('90d'); setHoveredIndex(6); }}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                timeRange === '90d'
                  ? isLight ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'bg-slate-700 text-white font-semibold'
                  : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              90d
            </button>
            <button
              onClick={() => { setTimeRange('30d'); setHoveredIndex(4); }}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                timeRange === '30d'
                  ? isLight ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'bg-slate-700 text-white font-semibold'
                  : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              30d
            </button>
            <button
              onClick={() => { setTimeRange('14d'); setHoveredIndex(2); }}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                timeRange === '14d'
                  ? isLight ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'bg-slate-700 text-white font-semibold'
                  : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              14d
            </button>
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart Stage */}
      <div className="relative w-full overflow-hidden">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full h-44 overflow-visible"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={isLight ? '0.35' : '0.45'} />
              <stop offset="40%" stopColor="#f59e0b" stopOpacity={isLight ? '0.2' : '0.25'} />
              <stop offset="85%" stopColor="#06b6d4" stopOpacity={isLight ? '0.08' : '0.1'} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((ratio, idx) => {
            const y = padY + graphHeight * (1 - ratio);
            return (
              <g key={idx}>
                <line 
                  x1={padX} 
                  y1={y} 
                  x2={chartWidth - padX} 
                  y2={y} 
                  stroke={isLight ? '#e2e8f0' : '#1e293b'} 
                  strokeDasharray="4 4" 
                  strokeWidth="1"
                />
                <text 
                  x={padX - 8} 
                  y={y + 3} 
                  textAnchor="end" 
                  className={`text-[9px] font-mono fill-current ${
                    isLight ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {metric === 'score' 
                    ? `${Math.round(ratio * 100)}` 
                    : metric === 'exposure' 
                    ? `$${Math.round(ratio * 100)}M` 
                    : `${Math.round(ratio * 8)}`}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Main Trend Line */}
          <path 
            d={linePath} 
            fill="none" 
            stroke="url(#strokeGradient)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Active Hover Scrub Line */}
          {points[hoveredIndex] && (
            <line 
              x1={points[hoveredIndex].x} 
              y1={padY} 
              x2={points[hoveredIndex].x} 
              y2={padY + graphHeight} 
              stroke={isLight ? '#64748b' : '#94a3b8'} 
              strokeDasharray="3 3" 
              strokeWidth="1.5"
            />
          )}

          {/* Data Points with Milestone Highlights */}
          {points.map(({ x, y, snap, i }) => {
            const isHovered = i === hoveredIndex;
            const isAnomaly = snap.day === -30;
            const isCve = snap.day === 0;
            const isRemediated = snap.day === 7;

            let fillColor = '#06b6d4';
            if (snap.day <= -60) fillColor = '#10b981';
            else if (isAnomaly) fillColor = '#f59e0b';
            else if (isCve) fillColor = '#ef4444';
            else if (isRemediated) fillColor = '#10b981';

            return (
              <g 
                key={snap.day} 
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredIndex(i)}
              >
                {/* Milestone Pulse Rings */}
                {(isAnomaly || isCve) && (
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={isHovered ? 14 : 9} 
                    fill={fillColor} 
                    opacity="0.25" 
                    className="animate-ping" 
                  />
                )}

                {/* Outer Ring */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isHovered ? 7 : (isAnomaly || isCve || isRemediated) ? 5.5 : 4} 
                  fill={fillColor} 
                  stroke={isLight ? '#ffffff' : '#090d16'} 
                  strokeWidth={isHovered ? 2.5 : 1.5} 
                />

                {/* X-Axis Date Labels */}
                <text 
                  x={x} 
                  y={padY + graphHeight + 16} 
                  textAnchor="middle" 
                  className={`text-[10px] font-mono transition-colors ${
                    isHovered 
                      ? 'font-bold fill-cyan-500' 
                      : isLight ? 'text-slate-400 fill-slate-400' : 'text-slate-500 fill-slate-500'
                  }`}
                >
                  {snap.day === 0 ? 'Day 0' : snap.day === 7 ? 'Fix +7d' : `${snap.day}d`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Snapshot Narrative & Telemetry Bar */}
      <div className={`mt-3 p-3 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        activeSnapshot.badgeType === 'cve'
          ? isLight ? 'bg-red-50/70 border-red-200 text-red-950' : 'bg-red-950/20 border-red-900/50 text-red-200'
          : activeSnapshot.badgeType === 'anomaly'
          ? isLight ? 'bg-amber-50/70 border-amber-200 text-amber-950' : 'bg-amber-950/20 border-amber-900/50 text-amber-200'
          : activeSnapshot.badgeType === 'remediated'
          ? isLight ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-emerald-950/20 border-emerald-900/50 text-emerald-200'
          : isLight ? 'bg-white border-slate-200 text-slate-800 shadow-xs' : 'bg-slate-900/40 border-slate-800 text-slate-300'
      }`}>
        <div className="flex items-start sm:items-center gap-3">
          <div className={`p-2 rounded-md shrink-0 ${
            activeSnapshot.badgeType === 'cve'
              ? 'bg-red-500/20 text-red-500'
              : activeSnapshot.badgeType === 'anomaly'
              ? 'bg-amber-500/20 text-amber-500'
              : activeSnapshot.badgeType === 'remediated'
              ? 'bg-emerald-500/20 text-emerald-500'
              : 'bg-slate-500/20 text-slate-400'
          }`}>
            {activeSnapshot.badgeType === 'cve' ? (
              <AlertTriangle className="w-4 h-4" />
            ) : activeSnapshot.badgeType === 'anomaly' ? (
              <Zap className="w-4 h-4" />
            ) : activeSnapshot.badgeType === 'remediated' ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <Clock className="w-4 h-4" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold font-mono">{activeSnapshot.date}</span>
              {activeSnapshot.milestone && (
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
                  {activeSnapshot.milestone}
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
              {activeSnapshot.narrative}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 font-mono text-xs border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-between sm:justify-start">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Systemic Risk</span>
            <span className="font-bold text-sm text-cyan-600 dark:text-cyan-400">
              {activeSnapshot.systemicScore}/100
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Exposure</span>
            <span className="font-bold text-sm text-purple-600 dark:text-purple-400">
              ${activeSnapshot.financialExposureM}M/d
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Keystones</span>
            <span className="font-bold text-sm text-amber-600 dark:text-amber-400">
              {activeSnapshot.keystonesCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
