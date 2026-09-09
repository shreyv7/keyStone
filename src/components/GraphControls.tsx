import React from 'react';
import { 
  Maximize2, 
  Target, 
  Flame, 
  GitFork, 
  RotateCw, 
  HelpCircle,
  SlidersHorizontal
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
  autoRotate,
  onToggleAutoRotate,
  onOpenLegend
}) => {
  const { isLight } = useTheme();

  return (
    <div className="absolute top-5 left-5 z-20 flex flex-wrap items-center gap-2 select-none">
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
        <button
          onClick={onToggleStructuralRisk}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-all ${
            showStructuralRisk
              ? isLight ? 'bg-slate-900 text-white font-medium' : 'bg-slate-700 text-white font-medium'
              : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Scale nodes by structural criticality instead of conventional score"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Structural Scale</span>
        </button>

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
  );
};
