import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Layers, ShieldAlert, Target, GitFork, AlertCircle, ChevronDown } from 'lucide-react';

interface TopKPIStripProps {
  totalNodes?: number;
  p1Count?: number;
  dominatorsCount?: number;
  criticalPathsCount?: number;
  activeThreatScope?: string;
  onSelectThreatScope?: (scope: string) => void;
  onFilterDominators?: () => void;
  onFilterKeystones?: () => void;
  className?: string;
}

export const TopKPIStrip: React.FC<TopKPIStripProps> = ({
  totalNodes = 1284,
  p1Count = 12,
  dominatorsCount = 4,
  criticalPathsCount = 4,
  activeThreatScope = 'all',
  onSelectThreatScope,
  onFilterDominators,
  onFilterKeystones,
  className = ''
}) => {
  const { isLight } = useTheme();

  return (
    <div className={`absolute top-5 left-1/2 -translate-x-1/2 z-20 select-none transition-all ${className}`}>
      <div className={`backdrop-blur-md border px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-3 text-xs ${
        isLight ? 'bg-white/90 border-slate-200/90 text-slate-800' : 'bg-slate-900/85 border-slate-800/90 text-slate-200'
      }`}>
        {/* Total Managed Nodes */}
        <div className={`flex items-center gap-1.5 pr-2.5 border-r ${
          isLight ? 'border-slate-200/60' : 'border-slate-800/60'
        }`}>
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex items-baseline gap-1">
            <span className="font-mono font-bold text-xs">{totalNodes.toLocaleString()}</span>
            <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Nodes</span>
          </div>
        </div>

        {/* P1 Keystones */}
        <button
          onClick={onFilterKeystones}
          className={`flex items-center gap-1.5 pr-2.5 border-r transition-colors cursor-pointer ${
            isLight ? 'border-slate-200/60 hover:text-red-700' : 'border-slate-800/60 hover:text-red-400'
          }`}
          title="Filter to P1 Critical Keystones"
        >
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
          <div className="flex items-baseline gap-1">
            <span className={`font-mono font-bold text-xs ${isLight ? 'text-red-600' : 'text-red-400'}`}>{p1Count}</span>
            <span className={`text-[10px] font-semibold ${isLight ? 'text-red-800' : 'text-red-300'}`}>P1 Keystones</span>
          </div>
        </button>

        {/* Dominators */}
        <button
          onClick={onFilterDominators}
          className={`flex items-center gap-1.5 pr-2.5 border-r transition-colors cursor-pointer ${
            isLight ? 'border-slate-200/60 hover:text-purple-700' : 'border-slate-800/60 hover:text-purple-400'
          }`}
          title="Filter to Lengauer-Tarjan Dominators"
        >
          <Target className="w-3.5 h-3.5 text-purple-500" />
          <div className="flex items-baseline gap-1">
            <span className={`font-mono font-bold text-xs ${isLight ? 'text-purple-600' : 'text-purple-400'}`}>{dominatorsCount}</span>
            <span className={`text-[10px] font-semibold ${isLight ? 'text-purple-800' : 'text-purple-300'}`}>Dominators</span>
          </div>
        </button>

        {/* Critical Threat Paths */}
        <div className={`flex items-center gap-1.5 pr-2.5 border-r ${
          isLight ? 'border-slate-200/60' : 'border-slate-800/60'
        }`}>
          <GitFork className="w-3.5 h-3.5 text-amber-500" />
          <div className="flex items-baseline gap-1">
            <span className={`font-mono font-bold text-xs ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>{criticalPathsCount}</span>
            <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Threat Paths</span>
          </div>
        </div>

        {/* Risk Distribution Breakdown Bar */}
        <div className={`hidden lg:flex items-center gap-2 pr-2.5 border-r ${
          isLight ? 'border-slate-200/60' : 'border-slate-800/60'
        }`}>
          <div className="flex items-center gap-1 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            <span>3</span>
            <span className="text-slate-400">·</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>17</span>
            <span className="text-slate-400">·</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>82</span>
            <span className="text-slate-400">·</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>1,182</span>
          </div>
        </div>

        {/* Threat Scope Selector */}
        {onSelectThreatScope && (
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-mono uppercase font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Scope:
            </span>
            <select
              value={activeThreatScope}
              onChange={(e) => onSelectThreatScope(e.target.value)}
              className={`text-[11px] font-mono font-semibold py-0.5 px-2 rounded-md border outline-none cursor-pointer ${
                isLight 
                  ? 'bg-slate-100 border-slate-300 text-slate-800' 
                  : 'bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <option value="all">Entire Topology (All Vectors)</option>
              <option value="cve-2022-1471">CVE-2022-1471 (SnakeYAML)</option>
              <option value="cve-2020-7598">CVE-2020-7598 (Minimist)</option>
              <option value="dependency-confusion">Dependency Confusion Vector</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
