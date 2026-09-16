import React from 'react';
import { EcosystemNode } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Scale, Activity, ShieldAlert, CheckCircle, Clock, GitCommit, Award } from 'lucide-react';

interface SupportDivergenceCardProps {
  node: EcosystemNode;
  className?: string;
}

export const SupportDivergenceCard: React.FC<SupportDivergenceCardProps> = ({ node, className = '' }) => {
  const { isLight } = useTheme();

  // Internal structural demand P_S (0 to 100%)
  const psPercent = node.reversePageRankPercentile || Math.round(node.reversePageRank * 100) || 80;

  // External community support Q_supp (0 to 100%)
  // If explicitly provided via mock or compute:
  const openSsf = node.openSsfScore !== undefined ? node.openSsfScore : (node.conventionalScore / 10);
  const humanCommits = node.humanCommits12m !== undefined ? node.humanCommits12m : (node.maintainers * 6);
  const botFiltered = node.botCommitsFiltered !== undefined ? node.botCommitsFiltered : 45;
  const daysSince = node.daysSinceRelease !== undefined ? node.daysSinceRelease : 320;

  // Q_1: OpenSSF normalized (0..1)
  const q1 = Math.min(1, Math.max(0, openSsf / 10));
  // Q_2: Human commits normalized
  const q2 = Math.min(1, humanCommits / 50);
  // Q_3: Recency normalized (decay after 180 days)
  const q3 = Math.max(0.05, Math.min(1, 1 - (daysSince - 60) / 400));

  const qSuppVal = (q1 * 0.4 + q2 * 0.35 + q3 * 0.25);
  const qSuppPercent = Math.round(qSuppVal * 100);

  // PDI Deficit
  const pdi = node.pdiScore !== undefined ? node.pdiScore : Math.max(0, psPercent - qSuppPercent);
  const isCritical = pdi >= 70;
  const isModerate = pdi >= 40 && pdi < 70;

  return (
    <div className={`p-4 rounded-xl border flex flex-col gap-3.5 transition-all ${
      isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/80 border-slate-800'
    } ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${
            isCritical
              ? isLight ? 'bg-red-50 text-red-700' : 'bg-red-950/60 text-red-400'
              : isLight ? 'bg-amber-50 text-amber-700' : 'bg-amber-950/60 text-amber-400'
          }`}>
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Support Risk & Divergence
              </span>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase ${
                isCritical
                  ? isLight ? 'bg-red-50 text-red-700 border-red-200' : 'bg-red-950/50 text-red-300 border-red-800'
                  : isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-amber-950/50 text-amber-300 border-amber-800'
              }`}>
                Upstream Fragility
              </span>
            </div>
            <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Enterprise Demand (P_S) vs Upstream Maintenance (Q_supp)
            </p>
          </div>
        </div>

        <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border uppercase ${
          isCritical
            ? isLight ? 'bg-red-50 text-red-700 border-red-200' : 'bg-red-950/60 text-red-300 border-red-800'
            : isModerate
            ? isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-amber-950/60 text-amber-300 border-amber-800'
            : isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
        }`}>
          {isCritical ? 'Critical Deficit' : isModerate ? 'Moderate Divergence' : 'Equilibrium'}
        </span>
      </div>

      {/* Tug of War Comparison Bars */}
      <div className="flex flex-col gap-2.5">
        {/* Internal Demand P_S */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`font-medium flex items-center gap-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <Activity className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span>Internal Structural Demand (P_S)</span>
            </span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
              {psPercent.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${psPercent}%` }}
            />
          </div>
          <div className={`text-[9px] mt-0.5 flex justify-between ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Topological Centrality Percentile</span>
            <span>Touches {node.dependents} apps & {node.tier1Reach} Tier-1 crown jewels</span>
          </div>
        </div>

        {/* Upstream Community Support Q_supp */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`font-semibold flex items-center gap-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <ShieldAlert className="w-3 h-3 text-emerald-500" />
              <span>External Ecosystem Support (Q_supp)</span>
            </span>
            <span className={`font-mono font-bold ${
              qSuppPercent < 25 ? 'text-red-500' : qSuppPercent < 50 ? 'text-amber-500' : 'text-emerald-500'
            }`}>
              {qSuppPercent.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                qSuppPercent < 25
                  ? 'bg-red-500'
                  : qSuppPercent < 50
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${qSuppPercent}%` }}
            />
          </div>
          <div className={`text-[9px] mt-0.5 flex justify-between ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Multi-Signal Maintenance Quality</span>
            <span>{node.maintainers} author(s) / {node.weeklyDownloads} weekly downloads</span>
          </div>
        </div>

        {/* Net Divergence Deficit (PDI) */}
        <div className={`p-3 rounded-lg border flex items-center justify-between ${
          isCritical
            ? isLight ? 'bg-red-50/80 border-red-200' : 'bg-red-950/40 border-red-900/50'
            : isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold ${isCritical ? 'text-red-700 dark:text-red-400' : isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                Support Deficit: Very low upstream maintenance
              </span>
            </div>
            <div className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {isCritical
                ? 'Severe under-resourced dependency at central chokepoint (PDI = max(0, P_S - Q_supp))'
                : 'Balanced community backing relative to architectural usage'}
            </div>
          </div>
          <div className="text-right">
            <span className={`text-xl font-mono font-bold ${
              isCritical ? 'text-red-600 dark:text-red-400' : isLight ? 'text-slate-900' : 'text-slate-100'
            }`}>
              +{pdi.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Sub-signal breakdown metrics */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className={`p-2 rounded-lg border flex flex-col justify-between ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Award className="w-3 h-3 text-amber-500" />
            <span>OpenSSF Score</span>
          </div>
          <div className="font-mono font-bold text-xs mt-1">
            {openSsf.toFixed(1)} <span className="text-[9px] font-normal text-slate-500">/10</span>
          </div>
        </div>

        <div className={`p-2 rounded-lg border flex flex-col justify-between ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <GitCommit className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>Human Commits</span>
          </div>
          <div className="font-mono font-bold text-xs mt-1">
            {humanCommits} <span className="text-[9px] font-normal text-slate-500">({botFiltered} bot)</span>
          </div>
        </div>

        <div className={`p-2 rounded-lg border flex flex-col justify-between ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Release Recency</span>
          </div>
          <div className="font-mono font-bold text-xs mt-1">
            {daysSince}d <span className="text-[9px] font-normal text-slate-500">ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};
