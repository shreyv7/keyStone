import React from 'react';
import { 
  MitigationCandidate, 
  PropagationPath 
} from '../types';
import { 
  Wrench, 
  CheckCircle2, 
  GitPullRequest, 
  ArrowRight, 
  X,
  FileCode,
  RotateCcw
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MitigationPanelProps {
  candidates: MitigationCandidate[];
  selectedStrategy: 'min_cut' | 'low_hanging' | 'crown_jewel';
  onSelectStrategy: (strat: 'min_cut' | 'low_hanging' | 'crown_jewel') => void;
  onApplyFix: () => void;
  isApplied: boolean;
  onClose: () => void;
  onOpenPRModal: () => void;
  onResetSimulation: () => void;
}

export const MitigationPanel: React.FC<MitigationPanelProps> = ({
  candidates,
  selectedStrategy,
  onSelectStrategy,
  onApplyFix,
  isApplied,
  onClose,
  onOpenPRModal,
  onResetSimulation
}) => {
  const { isLight } = useTheme();
  const currentCandidate = candidates.find(c => c.strategy === selectedStrategy) || candidates[0];

  return (
    <div className={`absolute top-20 right-6 bottom-6 w-96 lg:w-[440px] z-30 rounded-xl border shadow-xl backdrop-blur-md p-5 flex flex-col justify-between overflow-hidden select-none transition-colors ${
      isLight 
        ? 'bg-white/98 border-slate-200 text-slate-800' 
        : 'bg-[#07090e]/98 border-slate-800 text-slate-100'
    }`}>
      {/* Top Header */}
      <div>
        <div className={`flex items-start justify-between border-b pb-3 mb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${
                isLight 
                  ? 'bg-slate-100 text-slate-700 border-slate-200' 
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                Remediation
              </span>
              {isApplied && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase flex items-center gap-1 ${
                  isLight 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
                }`}>
                  <CheckCircle2 className="w-3 h-3" />
                  Applied
                </span>
              )}
            </div>
            <h2 className={`text-base font-bold flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-slate-100'
            }`}>
              <Wrench className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Minimum-Cut Remediation</span>
            </h2>
            <div className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Minimal SemVer jump cost with maximum path disconnection
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

        {/* Strategy Selector Toggles */}
        <div className="flex flex-col gap-1.5 mb-4">
          <div className={`text-[11px] font-semibold flex items-center justify-between ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <span>Targeting Strategy</span>
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>3 Evaluated Paths</span>
          </div>
          <div className={`grid grid-cols-3 gap-1 p-1 rounded-lg border text-xs ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <button
              onClick={() => onSelectStrategy('min_cut')}
              className={`py-1.5 px-2 rounded-md font-medium transition-all text-center ${
                selectedStrategy === 'min_cut'
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'bg-slate-800 text-white font-semibold'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Minimum Cut
            </button>
            <button
              onClick={() => onSelectStrategy('crown_jewel')}
              className={`py-1.5 px-2 rounded-md font-medium transition-all text-center ${
                selectedStrategy === 'crown_jewel'
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'bg-slate-800 text-white font-semibold'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sink Shield
            </button>
            <button
              onClick={() => onSelectStrategy('low_hanging')}
              className={`py-1.5 px-2 rounded-md font-medium transition-all text-center ${
                selectedStrategy === 'low_hanging'
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'bg-slate-800 text-white font-semibold'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Zero SemVer
            </button>
          </div>
        </div>

        {/* Selected Candidate Card */}
        <div className={`p-4 rounded-lg border flex flex-col gap-3 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <div className={`text-[10px] uppercase font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Intervention Target
              </div>
              <div className={`text-base font-bold font-mono mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {currentCandidate.targetPackage}
              </div>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${
              isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
            }`}>
              Recommended Fix
            </span>
          </div>

          <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            {currentCandidate.rationale}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`p-2.5 rounded-md border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Version Jump</div>
              <div className="font-mono font-semibold text-xs mt-0.5">
                <span>{currentCandidate.fromVersion}</span>
                <span className="mx-1 text-slate-400">→</span>
                <span className="text-emerald-600 font-bold">{currentCandidate.toVersion}</span>
              </div>
            </div>

            <div className={`p-2.5 rounded-md border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Paths Severed</div>
              <div className="font-bold text-xs mt-0.5 text-emerald-600">
                {currentCandidate.pathsSevered} of 4 ({currentCandidate.efficiencyRatio}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        {!isApplied ? (
          <button
            onClick={onApplyFix}
            className={`w-full py-2.5 px-4 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
              isLight 
                ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                : 'bg-slate-100 hover:bg-white text-slate-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Apply Architectural Cut</span>
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              onClick={onOpenPRModal}
              className={`w-full py-2.5 px-4 rounded-md text-xs font-semibold flex items-center justify-center gap-2 border transition-colors ${
                isLight 
                  ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900' 
                  : 'bg-slate-100 hover:bg-white text-slate-900 border-white'
              }`}
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              <span>Export Coordinated PR Manifest</span>
            </button>

            <button
              onClick={onResetSimulation}
              className={`w-full py-2 px-3 rounded-md text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                isLight 
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' 
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Simulation</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
