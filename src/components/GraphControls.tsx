import React from 'react';
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
  ShieldCheck
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

  return (
    <div className="absolute top-5 left-5 z-20 flex flex-col gap-2 select-none">
      {/* Main Controls Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Navigation Buttons */}
        <div className={`flex items-center gap-1 backdrop-blur-md border p-1 rounded-md shadow-xs text-xs transition-colors ${
          isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <button
            onClick={onResetView}
            title="Reset Camera to Wide Overview"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors ${
              isLight ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset View</span>
          </button>

          <button
            onClick={onFocusKeystone}
            title="Focus on Primary Structural Keystone (snakeyaml)"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors font-medium ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-red-600" />
            <span>Focus Keystone</span>
          </button>
        </div>

        {/* Mode Toggles */}
        <div className={`flex items-center gap-1 backdrop-blur-md border p-1 rounded-md shadow-xs text-xs transition-colors ${
          isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-900/90 border-slate-800'
        }`}>
          {/* Perspective Switcher: Standard vs Risk View */}
          <div className="flex items-center gap-1 border-r pr-1.5 mr-1 border-slate-200 dark:border-slate-800">
            <button
              onClick={() => { if (showStructuralRisk) onToggleStructuralRisk(); }}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-all cursor-pointer text-[11px] ${
                !showStructuralRisk
                  ? isLight ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-emerald-600 text-white font-bold shadow-xs'
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Standard view: Colored by individual package rating"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Standard</span>
            </button>

            <button
              onClick={() => { if (!showStructuralRisk) onToggleStructuralRisk(); }}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-all cursor-pointer text-[11px] ${
                showStructuralRisk
                  ? isLight ? 'bg-slate-900 text-white font-bold shadow-xs' : 'bg-purple-600 text-white font-bold shadow-xs'
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Risk view: Highlights single points of failure across services"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>High Impact</span>
            </button>
          </div>

          <button
            onClick={onToggleBlastRadius}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-all ${
              showBlastRadius
                ? isLight ? 'bg-slate-900 text-white font-medium' : 'bg-slate-700 text-white font-medium'
                : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Emphasize downstream blast radius to critical services"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Blast Radius</span>
          </button>

          <button
            onClick={onTogglePropagation}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-all ${
              showPropagation
                ? isLight ? 'bg-slate-900 text-white font-medium' : 'bg-slate-700 text-white font-medium'
                : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Toggle visibility of transitive dependency flow lines"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Chains</span>
          </button>

          {onToggleDominatorMode && (
            <button
              onClick={onToggleDominatorMode}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-all ${
                showDominatorMode
                  ? isLight ? 'bg-purple-700 text-white font-medium shadow-xs' : 'bg-purple-600 text-white font-medium shadow-xs'
                  : isLight ? 'text-purple-700 hover:bg-purple-50' : 'text-purple-400 hover:bg-purple-950/50'
              }`}
              title="Show key chokepoints leaderboard"
            >
              <TreePine className="w-3.5 h-3.5" />
              <span>Chokepoints</span>
            </button>
          )}
        </div>

        {/* Camera Rotation & Legend */}
        <div className={`flex items-center gap-1 backdrop-blur-md border p-1 rounded-md shadow-xs text-xs transition-colors ${
          isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <button
            onClick={onToggleAutoRotate}
            title={autoRotate ? "Pause Auto Orbit" : "Resume Auto Orbit"}
            className={`p-1.5 rounded transition-colors ${
              autoRotate
                ? isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-800 text-slate-200'
                : isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenLegend}
            title="Graph Topology Legend"
            className={`flex items-center gap-1 px-2 py-1.5 rounded transition-colors ${
              isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Legend</span>
          </button>
        </div>
      </div>

      {/* F1 Filter Chips Row (Scope & Execution Channel) */}
      {(onScopeChange || onChannelChange) && (
        <div className={`flex items-center gap-3 backdrop-blur-md border px-2.5 py-1 rounded-md shadow-xs text-xs transition-colors w-fit ${
          isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/85 border-slate-800'
        }`}>
          {/* Scope Filters */}
          {onScopeChange && (
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] uppercase font-mono font-semibold flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <Filter className="w-2.5 h-2.5" />
                <span>Scope:</span>
              </span>
              <div className="flex items-center gap-1">
                {(['all', 'production', 'dev'] as const).map((sc) => (
                  <button
                    key={sc}
                    onClick={() => onScopeChange(sc)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-all ${
                      scopeFilter === sc
                        ? isLight ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-900'
                        : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {sc === 'all' ? 'All' : sc === 'production' ? 'Prod' : 'Dev'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <span className={`h-3 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

          {/* Channel Filters */}
          {onChannelChange && (
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] uppercase font-mono font-semibold flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>Channel:</span>
              </span>
              <div className="flex items-center gap-1">
                {(['all', 'runtime', 'build'] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => onChannelChange(ch)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-0.5 transition-all ${
                      channelFilter === ch
                        ? ch === 'runtime'
                          ? isLight ? 'bg-cyan-600 text-white' : 'bg-cyan-500 text-slate-950 font-bold'
                          : ch === 'build'
                          ? isLight ? 'bg-amber-600 text-white' : 'bg-amber-500 text-slate-950 font-bold'
                          : isLight ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-900'
                        : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'
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
  );
};
