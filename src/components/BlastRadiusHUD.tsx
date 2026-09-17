import React, { useState } from 'react';
import { Flame, ArrowRight, ChevronUp, ChevronDown, GitFork } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface BlastRadiusHUDProps {
  affectedServicesCount: number;
  tier1Count: number;
  propagationPathsCount: number;
  financialExposure: string;
  isSimulating: boolean;
  onViewPaths: () => void;
  onComputeMitigation: () => void;
  canMitigate: boolean;
}

export const BlastRadiusHUD: React.FC<BlastRadiusHUDProps> = ({
  affectedServicesCount,
  tier1Count,
  propagationPathsCount,
  financialExposure,
  isSimulating,
  onViewPaths,
  onComputeMitigation,
  canMitigate
}) => {
  const { isLight } = useTheme();
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  if (isMinimized) {
    return (
      <div className="absolute top-4 right-4 z-20 select-none animate-in fade-in slide-in-from-top-1 duration-200">
        <button
          onClick={() => setIsMinimized(false)}
          title="Expand Blast Radius Telemetry"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-xl shadow-lg text-xs font-semibold transition-all hover:scale-105 cursor-pointer ${
            isLight
              ? 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-200/50'
              : 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-black/60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
          <span className="font-semibold text-red-500 font-mono text-[11px]">
            {affectedServicesCount} Services Affected
          </span>
          <span className="text-slate-400 font-normal text-[11px]">({financialExposure})</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
        </button>
      </div>
    );
  }

  return (
    <div className={`absolute top-4 right-4 z-20 w-72 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl select-none border transition-all animate-in fade-in slide-in-from-top-1 duration-200 flex flex-col gap-3 ${
      isLight 
        ? 'bg-white/95 border-slate-200/90 shadow-slate-300/40 text-slate-800' 
        : 'bg-[#0a0f1d]/95 border-slate-800/90 shadow-black/80 text-slate-100'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className={`font-bold text-xs tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Blast Radius Telemetry
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            isLight 
              ? 'bg-red-50 text-red-700 border-red-200' 
              : 'bg-red-950/40 text-red-400 border-red-800/50'
          }`}>
            Active Cascade
          </span>
          <button
            onClick={() => setIsMinimized(true)}
            title="Minimize Telemetry HUD"
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Clean 4-Stat Strip (No heavy nested boxes) */}
      <div className="grid grid-cols-4 gap-2 py-1">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Affected</span>
          <span className="text-lg font-bold font-mono text-slate-900 dark:text-white leading-tight">{affectedServicesCount}</span>
          <span className="text-[9px] text-slate-400 block">services</span>
        </div>
        <div>
          <span className="text-[10px] text-red-500 uppercase font-mono block">Critical</span>
          <span className="text-lg font-bold font-mono text-red-500 leading-tight">{tier1Count}</span>
          <span className="text-[9px] text-slate-400 block">Tier-1</span>
        </div>
        <div>
          <span className="text-[10px] text-amber-500 uppercase font-mono block">Paths</span>
          <span className="text-lg font-bold font-mono text-amber-500 leading-tight">{propagationPathsCount}</span>
          <span className="text-[9px] text-slate-400 block">active</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Daily Flow</span>
          <span className="text-sm font-bold font-mono text-red-500 leading-tight block mt-0.5">{financialExposure}</span>
        </div>
      </div>

      {/* Clean Contagion Breadth Bar */}
      <div className="pt-2 pb-1 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Contagion Breadth</span>
          <span className="font-mono font-bold text-red-500 text-xs">88% Horizontal</span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div style={{ width: '88%' }} className="h-full bg-red-500 rounded-full transition-all duration-500" />
        </div>
        <div className="flex justify-between text-[9px] text-slate-400 font-mono">
          <span>↔ Across Services: 84%</span>
          <span>↕ Depth: 16%</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-200/80 dark:border-slate-800/80">
        {canMitigate && (
          <button
            onClick={onComputeMitigation}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all bg-[#2f2fe4] hover:bg-[#4343f8] text-white shadow-xs cursor-pointer"
          >
            <span>Plan Targeted Fix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={onViewPaths}
          className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            isLight 
              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <GitFork className="w-3 h-3 text-slate-400" />
          <span>Inspect {propagationPathsCount} Propagation Paths</span>
        </button>
      </div>
    </div>
  );
};
