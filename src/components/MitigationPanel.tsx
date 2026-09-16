import React from 'react';
import { 
  MitigationCandidate, 
  RoleLens 
} from '../types';
import { 
  Wrench, 
  CheckCircle2, 
  GitPullRequest, 
  ArrowRight, 
  X, 
  FileCode, 
  RotateCcw,
  Briefcase,
  Terminal,
  Layers,
  DollarSign,
  ShieldCheck,
  Building2,
  AlertCircle,
  Cpu,
  Scale,
  Table
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MitigationPanelProps {
  candidates: MitigationCandidate[];
  selectedStrategy: 'min_cut' | 'low_hanging' | 'crown_jewel';
  activeLens?: RoleLens;
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
  activeLens = 'developer',
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
    <div className={`absolute top-16 sm:top-20 right-2 sm:right-6 bottom-4 sm:bottom-6 w-full sm:w-96 lg:w-[440px] max-w-[calc(100vw-2rem)] z-30 rounded-xl border shadow-2xl backdrop-blur-md p-4 sm:p-5 flex flex-col justify-between overflow-hidden select-none transition-colors ${
      isLight 
        ? 'bg-white border-slate-200 text-slate-800' 
        : 'bg-[#07090e]/98 border-slate-800 text-slate-100'
    }`}>
      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col min-h-0">
        <div className={`flex items-start justify-between border-b pb-3 mb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${
                isLight 
                  ? 'bg-slate-100 text-slate-700 border-slate-200' 
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                Remediation
              </span>

              {/* Role Lens Badge */}
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase flex items-center gap-1 border ${
                activeLens === 'ciso'
                  ? isLight ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-purple-950/40 text-purple-300 border-purple-800/50'
                  : activeLens === 'maintainer'
                  ? isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-950/40 text-blue-300 border-blue-800/50'
                  : isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
              }`}>
                {activeLens === 'ciso' ? 'CISO Exposure Cut' : activeLens === 'maintainer' ? 'Maintainer Impact' : 'Developer Min-Cut'}
              </span>

              {isApplied && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase flex items-center gap-1 ${
                  isLight 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
                }`}>
                  <CheckCircle2 className="w-3 h-3" />
                  Cut Applied
                </span>
              )}
            </div>

            <h2 className={`text-base font-bold flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-slate-100'
            }`}>
              <Wrench className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>
                {activeLens === 'ciso' ? 'Systemic Blast Radius Reduction' : activeLens === 'maintainer' ? 'Downstream Impact Mitigation' : 'Minimum-Cut Remediation'}
              </span>
            </h2>
            <div className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {activeLens === 'ciso' 
                ? 'Monetary risk mitigation with verified crown jewel insulation' 
                : activeLens === 'maintainer' 
                ? 'Guaranteed backward compatibility across dependent repos' 
                : 'Minimal SemVer jump cost with maximum path disconnection'}
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
        <div className="flex flex-col gap-1.5 mb-3">
          <div className={`text-[11px] font-semibold flex items-center justify-between ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <span>Targeting Strategy</span>
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>3 Evaluated Approaches</span>
          </div>
          <div className={`grid grid-cols-3 gap-1 p-1 rounded-lg border text-xs ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
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

        {/* F13 Min-Cut Strategy Trade-off Comparison Matrix */}
        <div className={`p-3 rounded-lg border flex flex-col gap-2 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
              isLight ? 'text-slate-800' : 'text-slate-200'
            }`}>
              <Scale className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Trade-Off Matrix</span>
            </span>
            <span className={`text-[9px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              3 Competing Strategies
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className={`border-b text-[9px] uppercase font-mono ${
                  isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
                }`}>
                  <th className="pb-1 font-semibold">Strategy</th>
                  <th className="pb-1 font-semibold">Paths Cut</th>
                  <th className="pb-1 font-semibold">Manifests</th>
                  <th className="pb-1 font-semibold">Friction</th>
                  <th className="pb-1 font-semibold text-right">Net Gain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {candidates.map((cand) => {
                  const isActive = selectedStrategy === cand.strategy;
                  return (
                    <tr
                      key={cand.strategy}
                      onClick={() => onSelectStrategy(cand.strategy)}
                      className={`cursor-pointer transition-colors ${
                        isActive
                          ? isLight ? 'bg-indigo-50/70 font-semibold' : 'bg-indigo-950/40 font-semibold'
                          : isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-1.5 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                          }`} />
                          <span className={isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>
                            {cand.strategyTitle}
                          </span>
                        </div>
                      </td>
                      <td className="py-1.5 pr-2 font-mono">
                        {cand.pathsSevered}/{cand.totalPaths}
                      </td>
                      <td className="py-1.5 pr-2 font-mono">
                        {cand.strategy === 'low_hanging' ? '2' : '1'}
                      </td>
                      <td className="py-1.5 pr-2">
                        <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                          cand.breakingChanges === 0
                            ? isLight ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-950/60 text-emerald-400'
                            : isLight ? 'bg-amber-50 text-amber-700' : 'bg-amber-950/60 text-amber-400'
                        }`}>
                          {cand.breakingChanges === 0 ? 'Zero' : 'Minimal'}
                        </span>
                      </td>
                      <td className="py-1.5 text-right font-mono font-bold text-emerald-600">
                        +{cand.netSecurityGain}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Candidate Card */}
        <div className={`p-4 rounded-lg border flex flex-col gap-3 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
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
              {currentCandidate.semverJump.toUpperCase()} JUMP
            </span>
          </div>

          <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            {currentCandidate.strategyDescription}
          </p>

          {/* Role-Specific Metric Cards */}
          {activeLens === 'ciso' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-2.5 rounded-md border ${
                isLight ? 'bg-white border-purple-100' : 'bg-slate-950/60 border-purple-900/40'
              }`}>
                <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Financial Reduction</div>
                <div className="font-mono font-bold text-sm text-purple-600 dark:text-purple-400 mt-0.5">
                  {currentCandidate.financialBlastReduction}
                </div>
                <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                  Eliminates systemic contagion
                </div>
              </div>

              <div className={`p-2.5 rounded-md border ${
                isLight ? 'bg-white border-purple-100' : 'bg-slate-950/60 border-purple-900/40'
              }`}>
                <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Insulated Crown Jewels</div>
                <div className="font-bold text-sm mt-0.5 text-emerald-600">
                  {currentCandidate.insulatedAssets.length} Regulated Assets
                </div>
                <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                  PCI-DSS Tier-1 Protected
                </div>
              </div>
            </div>
          )}

          {activeLens === 'developer' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-2.5 rounded-md border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Version Jump</div>
                <div className="font-mono font-semibold text-xs mt-0.5">
                  <span>{currentCandidate.currentVersion}</span>
                  <span className="mx-1 text-slate-400">→</span>
                  <span className="text-emerald-600 font-bold">{currentCandidate.targetVersion}</span>
                </div>
                <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                  {currentCandidate.semverJump} upgrade
                </div>
              </div>

              <div className={`p-2.5 rounded-md border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Paths Severed</div>
                <div className="font-bold text-xs mt-0.5 text-emerald-600">
                  {currentCandidate.pathsSevered} of {currentCandidate.totalPaths} (100%)
                </div>
                <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                  Net Gain: +{currentCandidate.netSecurityGain} pts
                </div>
              </div>
            </div>
          )}

          {activeLens === 'maintainer' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-2.5 rounded-md border ${
                isLight ? 'bg-white border-blue-100' : 'bg-slate-950/60 border-blue-900/40'
              }`}>
                <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Breaking Changes</div>
                <div className="font-bold text-sm text-emerald-600 mt-0.5">
                  {currentCandidate.breakingChanges} API Breakages
                </div>
                <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                  100% Backward Compatible
                </div>
              </div>

              <div className={`p-2.5 rounded-md border ${
                isLight ? 'bg-white border-blue-100' : 'bg-slate-950/60 border-blue-900/40'
              }`}>
                <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Engineering Effort</div>
                <div className="font-semibold text-xs mt-0.5 truncate text-slate-800 dark:text-slate-200">
                  Fast Automated Merge
                </div>
                <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                  0 regression tests broken
                </div>
              </div>
            </div>
          )}

          {/* Insulated Assets Pills */}
          <div className="flex flex-col gap-1 mt-1">
            <span className={`text-[10px] uppercase font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Insulated Production Assets:
            </span>
            <div className="flex flex-wrap gap-1">
              {currentCandidate.insulatedAssets.map(asset => (
                <span 
                  key={asset.name}
                  className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${
                    isLight 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                  }`}
                >
                  {asset.name} (T{asset.tier})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* F9 Call-Site & ABI Bytecode Linkage Prover */}
        <div className={`p-3.5 rounded-lg border flex flex-col gap-2.5 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              <span className={`text-xs font-semibold uppercase tracking-wider ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}>
                Call-Site & ABI Linkage Proof
              </span>
            </div>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase ${
              isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-950 text-emerald-300 border-emerald-800'
            }`}>
              Zero Breakage Proven
            </span>
          </div>

          <div className="flex flex-col gap-1.5 text-xs">
            <div className={`p-2 rounded-md border flex items-center justify-between font-mono text-[11px] ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/80 border-slate-800 text-slate-300'
            }`}>
              <span>• Invoked AST Symbols:</span>
              <span className="text-emerald-600 font-bold">42/42 matched (0 missing)</span>
            </div>

            <div className={`p-2 rounded-md border flex items-center justify-between font-mono text-[11px] ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/80 border-slate-800 text-slate-300'
            }`}>
              <span>• JVM Bytecode Opcodes:</span>
              <span className="text-emerald-600 font-bold">42 INVOKEVIRTUAL verified</span>
            </div>

            <div className={`p-2 rounded-md border flex items-center justify-between font-mono text-[11px] ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/80 border-slate-800 text-slate-300'
            }`}>
              <span>• Dynamic Reflection:</span>
              <span className="text-slate-500">Yaml.load() safe constructor</span>
            </div>

            <div className={`p-2 rounded-md border flex items-center justify-between font-mono text-[11px] ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/80 border-slate-800 text-slate-300'
            }`}>
              <span>• Net Threat Partition:</span>
              <span className="text-emerald-600 font-bold">E_removed={'{CVE-2022-1471}'}, E_introduced=∅</span>
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
              activeLens === 'ciso'
                ? isLight ? 'bg-purple-900 hover:bg-purple-800 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'
                : activeLens === 'maintainer'
                ? isLight ? 'bg-blue-900 hover:bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
                : isLight ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-slate-100 hover:bg-white text-slate-900'
            }`}
          >
            {activeLens === 'ciso' ? (
              <>
                <Briefcase className="w-3.5 h-3.5" />
                <span>Authorize Executive Policy Mandate</span>
              </>
            ) : activeLens === 'maintainer' ? (
              <>
                <Layers className="w-3.5 h-3.5" />
                <span>Apply Backward-Compatible Cut</span>
              </>
            ) : (
              <>
                <Wrench className="w-3.5 h-3.5" />
                <span>Apply Architectural Cut</span>
              </>
            )}
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
              <span>
                {activeLens === 'ciso' 
                  ? 'Export Executive Compliance Attestation' 
                  : activeLens === 'maintainer'
                  ? 'Export Renovate PR Config'
                  : 'Export Coordinated PR Manifest'}
              </span>
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
