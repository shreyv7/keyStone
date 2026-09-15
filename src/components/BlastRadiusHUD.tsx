import React from 'react';
import { Flame, ShieldAlert, GitFork, Activity, ArrowRight } from 'lucide-react';
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

  return (
    <div className={`absolute top-20 right-6 z-20 w-80 rounded-lg p-4 shadow-xl backdrop-blur-md select-none border transition-colors ${
      isLight 
        ? 'bg-white border-slate-200 text-slate-800' 
        : 'bg-slate-950/95 border-slate-800 text-slate-100'
    }`}>
      {/* Title */}
      <div className={`flex items-center justify-between border-b pb-2.5 mb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span className={`font-semibold text-xs tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Blast Radius Telemetry
          </span>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
          isLight 
            ? 'bg-red-50 text-red-700 border-red-200' 
            : 'bg-red-950/40 text-red-400 border-red-800/50'
        }`}>
          Active Cascade
        </span>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className={`p-2.5 rounded-md border flex flex-col ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <span className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Affected Services</span>
          <span className={`text-xl font-bold font-mono mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{affectedServicesCount}</span>
          <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Across 42 repos</span>
        </div>

        <div className={`p-2.5 rounded-md border flex flex-col ${
          isLight ? 'bg-red-50/50 border-red-200' : 'bg-red-950/30 border-red-900/40'
        }`}>
          <span className={`text-[11px] font-semibold ${isLight ? 'text-red-700' : 'text-red-300'}`}>Tier-1 Sinks</span>
          <span className="text-xl font-bold font-mono text-red-600 mt-0.5">{tier1Count}</span>
          <span className={`text-[10px] ${isLight ? 'text-red-600/80' : 'text-red-400/80'}`}>Mission-Critical Sinks</span>
        </div>

        <div className={`p-2.5 rounded-md border flex flex-col ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <span className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Propagation Paths</span>
          <span className={`text-xl font-bold font-mono mt-0.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>{propagationPathsCount}</span>
          <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Active DAG chains</span>
        </div>

        <div className={`p-2.5 rounded-md border flex flex-col ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <span className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Daily Flow Exposed</span>
          <span className="text-base font-bold font-mono text-red-600 mt-0.5">{financialExposure}</span>
          <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Payment throughput</span>
        </div>
      </div>

      {/* F11 Impact Concentration Index Card */}
      <div className={`p-3 rounded-lg border mb-3 text-xs flex flex-col gap-2 ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className={isLight ? 'text-slate-900' : 'text-slate-100'}>F11 Impact Concentration</span>
          </div>
          <span className="font-mono font-bold text-xs text-red-600 dark:text-red-400">
            0.88 / 1.00
          </span>
        </div>

        {/* Horizontal vs Vertical Split Bar */}
        <div className="flex flex-col gap-1">
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div 
              style={{ width: '84%' }} 
              className="bg-gradient-to-r from-amber-500 to-red-600 h-full transition-all duration-500"
              title="Horizontal Spread: 84%"
            />
            <div 
              style={{ width: '16%' }} 
              className="bg-slate-400 dark:bg-slate-600 h-full transition-all duration-500"
              title="Vertical Depth: 16%"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span className="text-red-600 dark:text-red-400 font-semibold">
              ↔ Horizontal Spread: 84%
            </span>
            <span>
              ↕ Vertical Depth: 16%
            </span>
          </div>
        </div>

        {/* Herfindahl Classification Badge */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
            isLight ? 'bg-red-100 text-red-800 border-red-200' : 'bg-red-950/60 text-red-300 border-red-800'
          }`}>
            🚨 Systemic Contagion
          </span>
          <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Herfindahl Metric
          </span>
        </div>

        <p className={`text-[10px] leading-tight ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Distinguishes 50 vulnerabilities in 1 monolith (contained incident) from 4 paths crossing 21 microservices (portfolio emergency).
        </p>
      </div>

      {/* Contagion Summary */}
      <div className={`p-2.5 rounded-md border text-xs leading-relaxed mb-3 ${
        isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-300'
      }`}>
        <div className="text-red-600 font-semibold mb-0.5 flex items-center gap-1">
          <Activity className="w-3.5 h-3.5" />
          <span>Contagion Summary</span>
        </div>
        Compromise of <code className="font-mono font-semibold">snakeyaml@1.33</code> propagates through internal shared utilities into Payment Gateway and Auth/IAM.
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onViewPaths}
          className={`w-full py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 border transition-colors ${
            isLight 
              ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs' 
              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
          }`}
        >
          <GitFork className="w-3.5 h-3.5 text-slate-500" />
          <span>Inspect Propagation Paths ({propagationPathsCount})</span>
        </button>

        {canMitigate && (
          <button
            onClick={onComputeMitigation}
            className={`w-full py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
              isLight 
                ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                : 'bg-slate-100 hover:bg-white text-slate-900'
            }`}
          >
            <span>Calculate Minimum-Cut Remediation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
