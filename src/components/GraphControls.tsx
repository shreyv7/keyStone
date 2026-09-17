import React, { useState, useRef, useEffect } from 'react';
import { 
  Maximize2, 
  Target, 
  Flame, 
  GitFork, 
  RotateCw, 
  HelpCircle,
  SlidersHorizontal,
  TreePine,
  Filter,
  Zap,
  Hammer,
  ShieldCheck,
  ChevronDown,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface GraphControlsProps {
  onResetView: () => void;
  onFocusKeystone: () => void;
  showStructuralRisk: boolean;
  onToggleStructuralRisk: () => void;
  showBlastRadius: boolean;
  onToggleBlastRadius: () => void;
  showPropagation: boolean;
  onTogglePropagation: () => void;
  showDominatorMode?: boolean;
  onToggleDominatorMode?: () => void;
  scopeFilter?: 'all' | 'production' | 'dev';
  onScopeChange?: (scope: 'all' | 'production' | 'dev') => void;
  channelFilter?: 'all' | 'runtime' | 'build';
  onChannelChange?: (channel: 'all' | 'runtime' | 'build') => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onOpenLegend: () => void;
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  onResetView,
  onFocusKeystone,
  showStructuralRisk,
  onToggleStructuralRisk,
  showBlastRadius,
  onToggleBlastRadius,
  showPropagation,
  onTogglePropagation,
  showDominatorMode = false,
  onToggleDominatorMode,
  scopeFilter = 'all',
  onScopeChange,
  channelFilter = 'all',
  onChannelChange,
  autoRotate,
  onToggleAutoRotate,
  onOpenLegend
}) => {
  const { isLight } = useTheme();
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const isFilterActive = (scopeFilter !== 'all') || (channelFilter !== 'all');

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    };
    if (isFilterMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterMenuOpen]);

  return (
    <div className="absolute top-4 left-4 z-20 flex items-center select-none">
      {/* Unified Floating Toolbar */}
      <div className={`flex items-center gap-1.5 p-1 rounded-xl border backdrop-blur-xl shadow-lg transition-all ${
        isLight 
          ? 'bg-white/95 border-slate-200/90 shadow-slate-200/50 text-slate-700' 
          : 'bg-slate-900/90 border-slate-800/90 shadow-black/60 text-slate-200'
      }`}>
        
        {/* Navigation & Focus Group */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={onResetView}
            title="Reset Camera to Wide Overview"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline text-[11px]">Reset</span>
          </button>

          <button
            onClick={onFocusKeystone}
            title="Focus on Primary Structural Keystone (snakeyaml)"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isLight
                ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/60'
                : 'bg-red-950/50 hover:bg-red-900/50 text-red-300 border border-red-800/60'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-red-500" />
            <span className="text-[11px]">Focus Keystone</span>
          </button>
        </div>

        {/* Divider */}
        <div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

        {/* View Mode Segmented Pill */}
        <div className={`flex items-center p-0.5 rounded-lg border ${
          isLight ? 'bg-slate-100/80 border-slate-200/60' : 'bg-slate-950/60 border-slate-800/60'
        }`}>
          <button
            onClick={() => { if (showStructuralRisk) onToggleStructuralRisk(); }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all text-[11px] font-medium cursor-pointer ${
              !showStructuralRisk
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Standard view: Package health scores"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Standard</span>
          </button>

          <button
            onClick={() => { if (!showStructuralRisk) onToggleStructuralRisk(); }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all text-[11px] font-medium cursor-pointer ${
              showStructuralRisk
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="High Impact view: Single points of failure & chokepoints"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>High Impact</span>
          </button>
        </div>

        {/* Divider */}
        <div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

        {/* Overlays Group */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={onToggleBlastRadius}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all text-[11px] cursor-pointer ${
              showBlastRadius
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : isLight ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title="Highlight downstream blast radius to critical services"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Blast Radius</span>
          </button>

          <button
            onClick={onTogglePropagation}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all text-[11px] cursor-pointer ${
              showPropagation
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : isLight ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title="Toggle visibility of transitive dependency flow lines"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Chains</span>
          </button>

          {onToggleDominatorMode && (
            <button
              onClick={onToggleDominatorMode}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all text-[11px] cursor-pointer ${
                showDominatorMode
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : isLight ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
              title="Show key chokepoints leaderboard"
            >
              <TreePine className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Chokepoints</span>
            </button>
          )}
        </div>

        {/* Divider */}
        <div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

        {/* Utilities: Filter Popover, Auto-orbit, Legend */}
        <div className="flex items-center gap-0.5">
          {/* Filter Popover Button */}
          {(onScopeChange || onChannelChange) && (
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setIsFilterMenuOpen(prev => !prev)}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all text-[11px] cursor-pointer ${
                  isFilterActive
                    ? isLight ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200' : 'bg-blue-950/60 text-blue-300 font-semibold border border-blue-800'
                    : isLight ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title="Filter by scope (Prod/Dev) or channel (Runtime/Build)"
              >
                <Filter className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Filters</span>
                {isFilterActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Filter Dropdown Modal */}
              {isFilterMenuOpen && (
                <div className={`absolute top-full left-0 mt-2 w-64 p-3.5 rounded-xl border backdrop-blur-2xl shadow-2xl z-30 flex flex-col gap-3 animate-in fade-in slide-in-from-top-1 ${
                  isLight ? 'bg-white/95 border-slate-200 text-slate-800' : 'bg-slate-900/95 border-slate-800 text-slate-100'
                }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                    <span className="text-xs font-semibold">Graph Filters</span>
                    {isFilterActive && (
                      <button
                        onClick={() => {
                          if (onScopeChange) onScopeChange('all');
                          if (onChannelChange) onChannelChange('all');
                        }}
                        className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Reset All
                      </button>
                    )}
                  </div>

                  {/* Scope Filter */}
                  {onScopeChange && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Deployment Scope</span>
                      <div className="grid grid-cols-3 gap-1">
                        {(['all', 'production', 'dev'] as const).map((sc) => (
                          <button
                            key={sc}
                            onClick={() => onScopeChange(sc)}
                            className={`px-2 py-1 rounded-lg text-xs font-medium transition-all text-center cursor-pointer ${
                              scopeFilter === sc
                                ? isLight ? 'bg-slate-900 text-white font-semibold' : 'bg-blue-600 text-white font-semibold'
                                : isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            {sc === 'all' ? 'All' : sc === 'production' ? 'Prod' : 'Dev'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Channel Filter */}
                  {onChannelChange && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Execution Channel</span>
                      <div className="grid grid-cols-3 gap-1">
                        {(['all', 'runtime', 'build'] as const).map((ch) => (
                          <button
                            key={ch}
                            onClick={() => onChannelChange(ch)}
                            className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              channelFilter === ch
                                ? ch === 'runtime'
                                  ? 'bg-cyan-600 text-white font-semibold'
                                  : ch === 'build'
                                  ? 'bg-amber-600 text-white font-semibold'
                                  : isLight ? 'bg-slate-900 text-white font-semibold' : 'bg-blue-600 text-white font-semibold'
                                : isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            {ch === 'runtime' && <Zap className="w-2.5 h-2.5" />}
                            {ch === 'build' && <Hammer className="w-2.5 h-2.5" />}
                            <span>{ch === 'all' ? 'All' : ch === 'runtime' ? 'Runtime' : 'Build'}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Auto Rotate Toggle */}
          <button
            onClick={onToggleAutoRotate}
            title={autoRotate ? "Pause Auto Orbit" : "Resume Auto Orbit"}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              autoRotate
                ? isLight ? 'bg-blue-50 text-blue-700' : 'bg-blue-950 text-blue-300'
                : isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Legend Button */}
          <button
            onClick={onOpenLegend}
            title="Graph Topology Legend"
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline text-[11px]">Legend</span>
          </button>
        </div>

      </div>
    </div>
  );
};
