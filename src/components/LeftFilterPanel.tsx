import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Zap, 
  Hammer, 
  Sliders, 
  CheckSquare, 
  Square,
  TreePine,
  ShieldAlert,
  Boxes
} from 'lucide-react';

interface LeftFilterPanelProps {
  scopeFilter: 'all' | 'production' | 'dev';
  onScopeChange: (scope: 'all' | 'production' | 'dev') => void;
  channelFilter: 'all' | 'runtime' | 'build';
  onChannelChange: (channel: 'all' | 'runtime' | 'build') => void;
  depthFilter: number; // 1, 2, 3, 4 (0 = all)
  onDepthChange: (depth: number) => void;
  showDominators: boolean;
  onToggleDominators: () => void;
  showP1Only: boolean;
  onToggleP1Only: () => void;
  showClusters: boolean;
  onToggleClusters: () => void;
  className?: string;
}

export const LeftFilterPanel: React.FC<LeftFilterPanelProps> = ({
  scopeFilter,
  onScopeChange,
  channelFilter,
  onChannelChange,
  depthFilter,
  onDepthChange,
  showDominators,
  onToggleDominators,
  showP1Only,
  onToggleP1Only,
  showClusters,
  onToggleClusters,
  className = ''
}) => {
  const { isLight } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div className={`absolute top-20 left-5 z-20 select-none ${className}`}>
        <button
          onClick={() => setIsCollapsed(false)}
          className={`p-2 rounded-lg border shadow-lg backdrop-blur-md flex items-center gap-1.5 text-xs font-semibold transition-all ${
            isLight ? 'bg-white/95 border-slate-300 text-slate-800 hover:bg-slate-50' : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-800'
          }`}
          title="Expand Topology Filters"
        >
          <Filter className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-[11px]">Filters</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <div className={`absolute top-20 left-5 z-20 w-64 rounded-xl border shadow-xl backdrop-blur-md select-none transition-all flex flex-col text-xs ${
      isLight ? 'bg-white/95 border-slate-200/95 text-slate-800' : 'bg-slate-900/90 border-slate-800/90 text-slate-200'
    } ${className}`}>
      {/* Header */}
      <div className={`p-3 border-b flex items-center justify-between ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className="flex items-center gap-1.5 font-bold text-xs">
          <Filter className="w-3.5 h-3.5 text-indigo-500" />
          <span>Topology Filters</span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className={`p-1 rounded transition-colors ${
            isLight ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-slate-800 text-slate-400'
          }`}
          title="Collapse Panel"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3.5 flex flex-col gap-3.5 overflow-y-auto max-h-[75vh]">
        {/* Scope Filter */}
        <div className="flex flex-col gap-1.5">
          <span className={`text-[10px] font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Environment Scope
          </span>
          <div className="grid grid-cols-3 gap-1">
            {(['all', 'production', 'dev'] as const).map((s) => (
              <button
                key={s}
                onClick={() => onScopeChange(s)}
                className={`py-1 rounded-md text-[11px] font-semibold transition-all text-center border ${
                  scopeFilter === s
                    ? isLight ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-900 border-white'
                    : isLight ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100' : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {s === 'all' ? 'All' : s === 'production' ? 'Prod' : 'Dev'}
              </button>
            ))}
          </div>
        </div>

        {/* Channel Filter */}
        <div className="flex flex-col gap-1.5">
          <span className={`text-[10px] font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Execution Channel
          </span>
          <div className="grid grid-cols-3 gap-1">
            {(['all', 'runtime', 'build'] as const).map((c) => (
              <button
                key={c}
                onClick={() => onChannelChange(c)}
                className={`py-1 px-1 rounded-md text-[10px] font-semibold transition-all flex items-center justify-center gap-1 border ${
                  channelFilter === c
                    ? c === 'runtime'
                      ? isLight ? 'bg-cyan-600 text-white border-cyan-700' : 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : c === 'build'
                      ? isLight ? 'bg-amber-600 text-white border-amber-700' : 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : isLight ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-900 border-white'
                    : isLight ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100' : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {c === 'runtime' && <Zap className="w-2.5 h-2.5" />}
                {c === 'build' && <Hammer className="w-2.5 h-2.5" />}
                <span>{c === 'all' ? 'All' : c === 'runtime' ? 'Runtime' : 'Build'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Depth Pruning Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Nesting Depth
            </span>
            <span className={`font-mono text-[10px] font-bold ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>
              {depthFilter === 0 ? 'All Strata' : `≤ Level ${depthFilter}`}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {[1, 2, 3, 4, 0].map((d) => (
              <button
                key={d}
                onClick={() => onDepthChange(d)}
                className={`py-0.5 rounded text-[10px] font-mono font-bold border transition-all ${
                  depthFilter === d
                    ? isLight ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-indigo-500 text-white border-indigo-400'
                    : isLight ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {d === 0 ? 'ALL' : `L${d}`}
              </button>
            ))}
          </div>
        </div>

        {/* Semantic Visibility Toggles */}
        <div className={`flex flex-col gap-1.5 pt-1 border-t ${
          isLight ? 'border-slate-200/60' : 'border-slate-800/60'
        }`}>
          <span className={`text-[10px] font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Filter Overlays
          </span>

          {/* Dominator Chokepoints Toggle */}
          <button
            onClick={onToggleDominators}
            className={`p-2 rounded-lg border flex items-center justify-between transition-all cursor-pointer ${
              showDominators
                ? isLight ? 'bg-purple-50 border-purple-300 text-purple-900 font-semibold' : 'bg-purple-950/40 border-purple-800 text-purple-300 font-semibold'
                : isLight ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <TreePine className="w-3.5 h-3.5 text-purple-500" />
              <span>High-impact dependencies</span>
            </div>
            {showDominators ? (
              <CheckSquare className="w-3.5 h-3.5 text-purple-600" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* P1 Critical Keystones Only */}
          <button
            onClick={onToggleP1Only}
            className={`p-2 rounded-lg border flex items-center justify-between transition-all cursor-pointer ${
              showP1Only
                ? isLight ? 'bg-red-50 border-red-300 text-red-900 font-semibold' : 'bg-red-950/40 border-red-800 text-red-300 font-semibold'
                : isLight ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
              <span>P1 Keystones Only</span>
            </div>
            {showP1Only ? (
              <CheckSquare className="w-3.5 h-3.5 text-red-600" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* Collapsed Cluster Hulls Toggle */}
          <button
            onClick={onToggleClusters}
            className={`p-2 rounded-lg border flex items-center justify-between transition-all cursor-pointer ${
              showClusters
                ? isLight ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold' : 'bg-indigo-950/40 border-indigo-800 text-indigo-300 font-semibold'
                : isLight ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-indigo-500" />
              <span>Subtree Clusters</span>
            </div>
            {showClusters ? (
              <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
