import React, { useState } from 'react';
import { PropagationPath } from '../types';
import { X, GitFork, ArrowRight, Zap, Hammer, ShieldAlert, CheckCircle, Filter, Cpu, Layers } from 'lucide-react';
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
  const [channelFilter, setChannelFilter] = useState<'all' | 'runtime' | 'build-time'>('all');

  const runtimePaths = paths.filter(p => p.channel === 'runtime');
  const buildTimePaths = paths.filter(p => p.channel === 'build-time');

  const filteredPaths = channelFilter === 'all' 
    ? paths 
    : channelFilter === 'runtime' 
    ? runtimePaths 
    : buildTimePaths;

  return (
    <div className={`absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-[510px] z-30 rounded-xl border shadow-2xl backdrop-blur-md p-5 select-none transition-colors max-h-[85vh] flex flex-col ${
      isLight 
        ? 'bg-white border-slate-200 text-slate-800' 
        : 'bg-slate-950/98 border-slate-800 text-slate-100'
    }`}>
      {/* Header */}
      <div className={`flex items-start justify-between border-b pb-3 mb-3 shrink-0 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitFork className="w-4 h-4 text-cyan-500" />
            <span className={`font-semibold text-xs uppercase tracking-wider ${
              isLight ? 'text-slate-900' : 'text-slate-200'
            }`}>
              Propagation Pathways
            </span>
          </div>
          <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Select a pathway to highlight its trajectory in the topology graph.
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

      {/* Execution Channel Mechanism Banner */}
      <div className={`p-2.5 rounded-lg border mb-3 text-xs leading-relaxed shrink-0 ${
        isLight 
          ? 'bg-slate-50 border-slate-200 text-slate-700' 
          : 'bg-slate-900/60 border-slate-800 text-slate-300'
      }`}>
        <div className="flex items-center justify-between">
          <span className="font-semibold flex items-center gap-1.5 text-[11px]">
            <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Execution Channel Analysis</span>
          </span>
          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
            isLight ? 'bg-white text-slate-700 border border-slate-200' : 'bg-slate-800 text-slate-300 border border-slate-700'
          }`}>
            Runtime + Build-Time
          </span>
        </div>
      </div>

      {/* Channel Filter Tabs */}
      <div className={`flex items-center gap-1.5 p-1 rounded-lg border mb-3 shrink-0 ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/80 border-slate-800'
      }`}>
        <button
          onClick={() => setChannelFilter('all')}
          className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            channelFilter === 'all'
              ? isLight 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'bg-slate-800 text-white shadow-xs'
              : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Filter className="w-3 h-3" />
          <span>All Channels ({paths.length})</span>
        </button>

        <button
          onClick={() => setChannelFilter('runtime')}
          className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            channelFilter === 'runtime'
              ? isLight 
                ? 'bg-cyan-50 text-cyan-900 border border-cyan-300 shadow-xs' 
                : 'bg-cyan-950/60 text-cyan-200 border border-cyan-800 shadow-xs'
              : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3 h-3 text-cyan-500" />
          <span>Runtime ({runtimePaths.length})</span>
        </button>

        <button
          onClick={() => setChannelFilter('build-time')}
          className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            channelFilter === 'build-time'
              ? isLight 
                ? 'bg-amber-50 text-amber-900 border border-amber-300 shadow-xs' 
                : 'bg-amber-950/60 text-amber-200 border border-amber-800 shadow-xs'
              : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Hammer className="w-3 h-3 text-amber-500" />
          <span>Build-Time ({buildTimePaths.length})</span>
        </button>
      </div>

      {/* List of Paths */}
      <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 flex-1">
        {filteredPaths.map((path) => {
          const isSelected = activePathId === path.id;
          const isRuntime = path.channel === 'runtime';
          const nodeSequence = path.nodeIds || (path as any).nodes || [];

          return (
            <div
              key={path.id}
              onClick={() => onSelectPath(isSelected ? null : path)}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? isLight
                    ? isRuntime 
                      ? 'bg-cyan-50/90 border-cyan-400 shadow-sm ring-1 ring-cyan-400/50' 
                      : 'bg-amber-50/90 border-amber-400 shadow-sm ring-1 ring-amber-400/50'
                    : isRuntime
                      ? 'bg-cyan-950/40 border-cyan-600 shadow-sm ring-1 ring-cyan-500/40'
                      : 'bg-amber-950/40 border-amber-600 shadow-sm ring-1 ring-amber-500/40'
                  : isLight
                    ? 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              {/* Card Header: Channel Badge + Criticality */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {isRuntime ? (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase flex items-center gap-1 ${
                      isLight 
                        ? 'bg-cyan-100 text-cyan-800 border-cyan-300' 
                        : 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                    }`}>
                      <Zap className="w-2.5 h-2.5 text-cyan-500 fill-cyan-500" />
                      Runtime In-Memory RPC
                    </span>
                  ) : (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase flex items-center gap-1 ${
                      isLight 
                        ? 'bg-amber-100 text-amber-800 border-amber-300' 
                        : 'bg-amber-950/80 text-amber-300 border-amber-800'
                    }`}>
                      <Hammer className="w-2.5 h-2.5 text-amber-500" />
                      Build-Time CI/CD Hook
                    </span>
                  )}
                  <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Tier-{path.targetAssetTier} Asset
                  </span>
                </div>

                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${
                  isLight 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : 'bg-red-950/40 text-red-400 border-red-800/50'
                }`}>
                  Weight {path.assetWeight.toFixed(1)}
                </span>
              </div>

              {/* Path Label */}
              <div className={`font-semibold text-xs mb-1.5 ${
                isSelected 
                  ? isLight ? 'text-slate-900 font-bold' : 'text-white font-bold' 
                  : isLight ? 'text-slate-800' : 'text-slate-200'
              }`}>
                {path.label}
              </div>

              {/* Contagion Description */}
              <p className={`text-[11px] leading-relaxed mb-2.5 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                {path.description}
              </p>

              {/* Node chain traversal pills */}
              <div className="flex flex-wrap items-center gap-1 text-[11px] font-mono pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                {nodeSequence.map((nodeName: string, idx: number) => (
                  <React.Fragment key={idx}>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      idx === 0
                        ? isLight ? 'bg-red-100 text-red-800 font-bold border border-red-300' : 'bg-red-950/60 text-red-300 font-bold border border-red-800'
                        : idx === nodeSequence.length - 1
                        ? isLight ? 'bg-slate-200 text-slate-900 font-bold' : 'bg-slate-800 text-white font-bold'
                        : isRuntime
                        ? isLight ? 'bg-cyan-50 border border-cyan-200 text-cyan-800' : 'bg-cyan-950/40 text-cyan-300 border border-cyan-900'
                        : isLight ? 'bg-amber-50 border border-amber-200 text-amber-800' : 'bg-amber-950/40 text-amber-300 border border-amber-900'
                    }`}>
                      {nodeName}
                    </span>
                    {idx < nodeSequence.length - 1 && (
                      <ArrowRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          {activePathId ? 'Pathway isolated in graph' : 'Select a path to trace flow'}
        </span>
        <button
          onClick={onComputeMitigation}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            isLight 
              ? 'bg-slate-900 hover:bg-slate-800 text-white' 
              : 'bg-slate-100 hover:bg-white text-slate-900'
          }`}
        >
          <span>Plan Targeted Fix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

