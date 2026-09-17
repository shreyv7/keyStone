import React, { useState, useMemo } from 'react';
import { TrendingUp, AlertTriangle, ShieldCheck, Clock, Zap, Activity } from 'lucide-react';
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
    systemicScore: 82,
    financialExposureM: 78.4,
    keystonesCount: 5,
    narrative: 'Transitive reachability permeates Payment Gateway and Auth/IAM pipelines.'
  },
  {
    day: 0,
    date: 'Day 0 (Current State)',
    systemicScore: 84,
    financialExposureM: 85.0,
    keystonesCount: 5,
    milestone: 'Day 0 Risk Alert',
    badgeType: 'cve',
    narrative: 'Active SIFI State: Articulation cut-vertex dominating data parsing across 21 services.'
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

  const activeSnapshot = visibleSnapshots[Math.min(hoveredIndex, visibleSnapshots.length - 1)] || visibleSnapshots[visibleSnapshots.length - 1];

  const chartWidth = 760;
  const chartHeight = 190;
  const padX = 45;
  const padY = 22;
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
        maxVal = 100;
      } else if (metric === 'keystones') {
        val = snap.keystonesCount;
        maxVal = 8;
      }

      const y = padY + graphHeight - (val / maxVal) * graphHeight;
      return { x, y, snap, i };
    });
  }, [visibleSnapshots, metric, graphWidth, graphHeight]);

  const { linePath, areaPath } = useMemo(() => {
    if (points.length === 0) return { linePath: '', areaPath: '' };
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx1 = prev.x + (curr.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (curr.x - prev.x) / 2;
      const cy2 = curr.y;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
    }

    const last = points[points.length - 1];
    const first = points[0];
    const baselineY = padY + graphHeight;
    const area = `${d} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
    return { linePath: d, areaPath: area };
  }, [points, graphHeight]);

  return (
    <div className="connector-3d-card p-5 select-none flex flex-col gap-4">
      {/* Chart Header Controls - Connectors Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white font-heading">
              Portfolio Risk Trajectory (90-Day Timeline)
            </h3>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              Risk History
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracks aggregate systemic exposure over time, highlighting pre-CVE anomalies and minimum-cut insulation.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-0.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setMetric('score')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                metric === 'score'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Risk Score
            </button>
            <button
              onClick={() => setMetric('exposure')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                metric === 'exposure'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Financial
            </button>
            <button
              onClick={() => setMetric('keystones')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                metric === 'keystones'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Keystones
            </button>
          </div>

          {/* Time Range Tabs */}
          <div className="flex items-center gap-0.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => { setTimeRange('90d'); setHoveredIndex(6); }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                timeRange === '90d'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              90d
            </button>
            <button
              onClick={() => { setTimeRange('30d'); setHoveredIndex(4); }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                timeRange === '30d'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              30d
            </button>
            <button
              onClick={() => { setTimeRange('14d'); setHoveredIndex(2); }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                timeRange === '14d'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
            {/* Unified Brand Blue Area Gradient */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1755e6" stopOpacity={isLight ? '0.22' : '0.35'} />
              <stop offset="70%" stopColor="#2e70ee" stopOpacity={isLight ? '0.05' : '0.08'} />
              <stop offset="100%" stopColor="#2e70ee" stopOpacity="0.0" />
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
                  className="text-[9px] font-mono fill-slate-400"
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
            stroke="#1755e6" 
            strokeWidth="2.5" 
            strokeLinecap="round"
          />

          {/* Interactive Data Points */}
          {points.map(({ x, y, snap, i }) => {
            const isHovered = hoveredIndex === i;
            const isCritical = snap.day === 0;

            return (
              <g 
                key={snap.day} 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
              >
                {/* Active Hover Guide Line */}
                {isHovered && (
                  <line 
                    x1={x} 
                    y1={padY} 
                    x2={x} 
                    y2={padY + graphHeight} 
                    stroke="#1755e6" 
                    strokeWidth="1.5" 
                    strokeDasharray="3 3"
                    opacity={0.8}
                  />
                )}

                {/* Point Halo */}
                {isCritical && (
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={isHovered ? 11 : 8} 
                    fill="none" 
                    stroke="#1755e6" 
                    strokeWidth="2"
                    strokeDasharray="3 2"
                    className="animate-pulse"
                  />
                )}

                {/* Point Dot */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isHovered ? 6 : isCritical ? 5 : 4} 
                  fill={isCritical ? '#1755e6' : isHovered ? '#2e70ee' : '#ffffff'} 
                  stroke={isCritical ? '#ffffff' : '#1755e6'} 
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  className="transition-all duration-150"
                />

                {/* X-axis date labels */}
                <text 
                  x={x} 
                  y={padY + graphHeight + 16} 
                  textAnchor="middle" 
                  className={`text-[9px] font-mono ${
                    isHovered 
                      ? 'fill-blue-600 font-bold' 
                      : 'fill-slate-400'
                  }`}
                >
                  {snap.day === 0 ? 'Day 0' : snap.day > 0 ? `+${snap.day}d` : `${snap.day}d`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Snapshot Narrative Drawer - Clean Connectors Style */}
      <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
            <Activity className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                {activeSnapshot.date}
              </span>
              {activeSnapshot.milestone && (
                <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {activeSnapshot.milestone}
                </span>
              )}
            </div>
            <p className="text-xs mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
              {activeSnapshot.narrative}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 shrink-0 font-mono text-xs border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-between sm:justify-start">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Systemic Risk</span>
            <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
              {activeSnapshot.systemicScore}/100
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Exposure</span>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              ${activeSnapshot.financialExposureM}M/d
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Keystones</span>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              {activeSnapshot.keystonesCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
