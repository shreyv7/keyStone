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
    <div className="absolute top-4 left-4 z-25 select-none">
      {/* Slim Double-Row Floating Toolbar */}
      <div className={`flex flex-col gap-1.5 p-1.5 rounded-xl border backdrop-blur-xl shadow-lg transition-all w-fit max-w-[320px] ${
        isLight 
          ? 'bg-white/95 border-slate-200/90 shadow-slate-200/50 text-slate-700' 
          : 'bg-[#0a0f1d]/90 border-slate-800/80 shadow-black/60 text-slate-200'
      }`}>
        
        {/* Row 1: Focus & View Mode Toggle */}
        <div className="flex items-center justify-between gap-1.5 w-full">
          {/* Navigation & Focus Group */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={onResetView}
              title="Reset Camera to Wide Overview"
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            <button
              onClick={onFocusKeystone}
              title="Center Camera on Primary Keystone (snakeyaml)"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isLight
                  ? 'hover:bg-slate-100 text-slate-700'
                  : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="text-[11px] font-medium">Focus</span>
            </button>
          </div>

          {/* Divider */}
          <div className={`h-4 w-px shrink-0 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

          {/* View Mode Segmented Pill */}
          <div className={`flex items-center p-0.5 rounded-lg border shrink-0 ${
            isLight ? 'bg-slate-100 border-slate-200/80' : 'bg-slate-950/80 border-slate-800/80'
          }`}>
            <button
              onClick={() => { if (showStructuralRisk) onToggleStructuralRisk(); }}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all text-[11px] font-medium cursor-pointer whitespace-nowrap shrink-0 ${
                !showStructuralRisk
                  ? isLight 
                    ? 'bg-white text-slate-900 shadow-xs font-semibold' 
                    : 'bg-slate-800 text-white shadow-xs font-semibold'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Standard view: Package health scores"
            >
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span>Standard</span>
            </button>

            <button
              onClick={() => { if (!showStructuralRisk) onToggleStructuralRisk(); }}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all text-[11px] font-medium cursor-pointer whitespace-nowrap shrink-0 ${
                showStructuralRisk
                  ? isLight 
                    ? 'bg-white text-slate-900 shadow-xs font-semibold' 
                    : 'bg-slate-800 text-white shadow-xs font-semibold'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="High Impact view: Single points of failure & chokepoints"
            >
              <SlidersHorizontal className="w-3 h-3 shrink-0" />
              <span>High Impact</span>
            </button>
          </div>
        </div>

        {/* Row 2: Overlays & Utilities */}
        <div className="flex items-center justify-between gap-1 w-full pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
          {/* Overlays Group */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={onToggleBlastRadius}
              className={`p-1.5 rounded-lg transition-all text-[11px] cursor-pointer shrink-0 ${
                showBlastRadius
                  ? 'bg-[#2f2fe4] text-white font-semibold shadow-xs'
                  : isLight ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
              title="Toggle Blast Radius overlay (Critical downstream spread)"
            >
              <Flame className="w-3.5 h-3.5 shrink-0" />
            </button>

            <button
              onClick={onTogglePropagation}
              className={`p-1.5 rounded-lg transition-all text-[11px] cursor-pointer shrink-0 ${
                showPropagation
                  ? 'bg-[#2f2fe4] text-white font-semibold shadow-xs'
                  : isLight ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
              title="Toggle Chains (Transitive dependency flow lines)"
            >
              <GitFork className="w-3.5 h-3.5 shrink-0" />
            </button>

            {onToggleDominatorMode && (
              <button
                onClick={onToggleDominatorMode}
                className={`p-1.5 rounded-lg transition-all text-[11px] cursor-pointer shrink-0 ${
                  showDominatorMode
                    ? 'bg-[#2f2fe4] text-white font-semibold shadow-xs'
                    : isLight ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
                title="Toggle Chokepoints (Single points of failure)"
              >
                <TreePine className="w-3.5 h-3.5 shrink-0" />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className={`h-3.5 w-px shrink-0 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

          {/* Utilities: Filter Popover, Auto-orbit, Legend */}
          <div className="flex items-center gap-0.5 shrink-0">
            {/* Filter Popover Button */}
            {(onScopeChange || onChannelChange) && (
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setIsFilterMenuOpen(prev => !prev)}
                  className={`flex items-center gap-1 px-1.5 py-1 rounded-lg transition-all text-[11px] cursor-pointer shrink-0 ${
                    isFilterActive
                      ? isLight ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200' : 'bg-blue-950/60 text-blue-300 font-semibold border border-blue-800'
                      : isLight ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                  title="Filter by scope (Prod/Dev) or channel (Runtime/Build)"
                >
                  <Filter className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[11px]">Filters</span>
                  {isFilterActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  )}
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Filter Dropdown Modal */}
                {isFilterMenuOpen && (
                  <div className={`absolute top-full left-0 mt-2 w-64 p-3.5 rounded-xl border backdrop-blur-2xl shadow-2xl z-30 flex flex-col gap-3 animate-in fade-in slide-in-from-top-1 ${
                    isLight ? 'bg-white/95 border-slate-200 text-slate-800' : 'bg-[#0a0f1d]/95 border-slate-800 text-slate-100'
                  }`}>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                      <span className="text-xs font-semibold">Graph Filters</span>
                      <button 
                        onClick={() => setIsFilterMenuOpen(false)}
                        className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Channel Filter (Runtime vs Build-time) */}
                    {onChannelChange && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-medium text-slate-400">Dependency Channel</label>
                        <div className="grid grid-cols-3 gap-1">
                          {(['all', 'runtime', 'build'] as const).map(ch => (
                            <button
                              key={ch}
                              onClick={() => onChannelChange(ch)}
                              className={`py-1 px-1.5 rounded text-[11px] font-medium capitalize transition-colors ${
                                channelFilter === ch
                                  ? isLight ? 'bg-blue-600 text-white font-semibold' : 'bg-[#2f2fe4] text-white font-semibold'
                                  : isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              {ch === 'all' ? 'All Channels' : ch}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Scope Filter (Production vs Dev) */}
                    {onScopeChange && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-medium text-slate-400">Environment Scope</label>
                        <div className="grid grid-cols-3 gap-1">
                          {(['all', 'production', 'dev'] as const).map(sc => (
                            <button
                              key={sc}
                              onClick={() => onScopeChange(sc)}
                              className={`py-1 px-1.5 rounded text-[11px] font-medium capitalize transition-colors ${
                                scopeFilter === sc
                                  ? isLight ? 'bg-blue-600 text-white font-semibold' : 'bg-[#2f2fe4] text-white font-semibold'
                                  : isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              {sc === 'all' ? 'All Scopes' : sc === 'production' ? 'Prod' : 'Dev'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Active Filters Summary & Reset */}
                    {isFilterActive && (
                      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-blue-500 font-medium">Filters Applied</span>
                        <button
                          onClick={() => {
                            onChannelChange?.('all');
                            onScopeChange?.('all');
                          }}
                          className="text-[10px] text-slate-400 hover:text-rose-400 underline transition-colors"
                        >
                          Reset Filters
                        </button>
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
              className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                autoRotate
                  ? isLight ? 'bg-blue-50 text-blue-700' : 'bg-blue-950/60 text-blue-300'
                  : isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'text-blue-500' : 'text-slate-400'}`} />
            </button>

            {/* Legend Button */}
            <button
              onClick={onOpenLegend}
              title="Graph Topology Legend"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                isLight ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
