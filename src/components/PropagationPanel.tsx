import React from 'react';
import { PropagationPath } from '../types';
import { X, GitFork, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PropagationPanelProps {
  paths: PropagationPath[];
  activePathId: string | null;
  onSelectPath: (path: PropagationPath | null) => void;
  onClose: () => void;
  onComputeMitigation: () => void;
}

export const PropagationPanel: React.FC<PropagationPanelProps> = ({
  paths,
  activePathId,
  onSelectPath,
  onClose,
  onComputeMitigation
}) => {
  const { isLight } = useTheme();

  return (
    <div className={`absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-[480px] z-30 rounded-xl border shadow-xl backdrop-blur-md p-5 select-none transition-colors ${
      isLight 
        ? 'bg-white/98 border-slate-200 text-slate-800' 
        : 'bg-slate-950/98 border-slate-800 text-slate-100'
    }`}>
      {/* Header */}
      <div className={`flex items-start justify-between border-b pb-3 mb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitFork className="w-4 h-4 text-slate-500" />
            <span className={`font-semibold text-xs uppercase tracking-wider ${
              isLight ? 'text-slate-900' : 'text-slate-200'
            }`}>
              Active Propagation Pathways
            </span>
          </div>
          <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Click any pathway to isolate its contagion flow in the 3D topology map.
          </div>
        </div>
        <button
          onClick={onClose}
          className={`p-1 rounded transition-colors ${
            isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Synthesis Banner */}
      <div className={`p-3 rounded-lg border mb-3 text-xs leading-relaxed ${
        isLight 
          ? 'bg-slate-50 border-slate-200 text-slate-700' 
          : 'bg-slate-900/60 border-slate-800 text-slate-300'
      }`}>
        <div className="font-semibold mb-0.5">
          Root Cause Analysis:
        </div>
        <div>
          <code className="font-mono font-semibold text-red-600">snakeyaml@1.33</code> sits at a single cut-vertex. Without redundant fallback parsing, compromise fans out into all 4 mission-critical application clusters simultaneously.
        </div>
      </div>

      {/* List of Paths */}
      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
        {paths.map((path) => {
          const isSelected = activePathId === path.id;
          return (
            <div
              key={path.id}
              onClick={() => onSelectPath(isSelected ? null : path)}
              className={`p-3 rounded-md border cursor-pointer transition-all ${
                isSelected
                  ? isLight
                    ? 'bg-slate-100 border-slate-400 shadow-xs'
                    : 'bg-slate-800 border-slate-600 shadow-sm'
                  : isLight
                    ? 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <span className={`font-semibold ${
                  isSelected 
                    ? isLight ? 'text-slate-900' : 'text-white' 
                    : isLight ? 'text-slate-800' : 'text-slate-200'
                }`}>
                  {path.label}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${
                  isLight 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : 'bg-red-950/40 text-red-400 border-red-800/50'
                }`}>
                  {path.criticality}
                </span>
              </div>

              {/* Node chain pills */}
              <div className="flex flex-wrap items-center gap-1 text-[11px] font-mono">
                {path.nodes.map((nodeName, idx) => (
                  <React.Fragment key={idx}>
                    <span className={`px-1.5 py-0.5 rounded ${
                      idx === 0
                        ? isLight ? 'bg-red-50 text-red-700 font-bold border border-red-200' : 'bg-red-950/40 text-red-400 font-bold'
                        : idx === path.nodes.length - 1
                        ? isLight ? 'bg-slate-200 text-slate-800 font-bold' : 'bg-slate-800 text-white font-bold'
                        : isLight ? 'bg-white border border-slate-200 text-slate-600' : 'bg-slate-950 text-slate-400'
                    }`}>
                      {nodeName}
                    </span>
                    {idx < path.nodes.length - 1 && (
                      <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          {activePathId ? 'Pathway Isolated on 3D Map' : 'Select a path to trace'}
        </span>
        <button
          onClick={onComputeMitigation}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            isLight 
              ? 'bg-slate-900 hover:bg-slate-800 text-white' 
              : 'bg-slate-100 hover:bg-white text-slate-900'
          }`}
        >
          Compute Minimum Cut
        </button>
      </div>
    </div>
  );
};
