import React, { useState } from 'react';
import { 
  X, 
  GitPullRequest, 
  Check, 
  Copy, 
  ShieldAlert, 
  Lock, 
  FileJson
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CoordinatedPRModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPackage: string;
  fromVersion: string;
  toVersion: string;
  affectedRepos: number;
  circuitBreakerFrozen: boolean;
  onToggleCircuitBreaker: () => void;
}

export const CoordinatedPRModal: React.FC<CoordinatedPRModalProps> = ({
  isOpen,
  onClose,
  targetPackage,
  fromVersion,
  toVersion,
  affectedRepos,
  circuitBreakerFrozen,
  onToggleCircuitBreaker
}) => {
  const { isLight } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const mockManifestJson = JSON.stringify(
    {
      schema_version: "keystone.orchestration.v1",
      remediation_type: "COORDINATED_MINIMUM_CUT",
      target_dominator_node: `pkg:maven/com.internal/${targetPackage}@${toVersion}`,
      semver_jump_cost: 1.0,
      net_security_gain: "+4 propagation paths severed",
      zero_breaking_changes: true,
      cascade_cve_check: "PASSED (0 new vulnerabilities in target)",
      affected_service_repositories: [
        "acme-inc/payment-service",
        "acme-inc/auth-session-manager",
        "acme-inc/checkout-service",
        "acme-inc/fraud-detection",
        "acme-inc/partner-api-gateway",
        "acme-inc/storefront-web",
        "acme-inc/billing-service"
      ],
      renovate_policy_directive: {
        action: circuitBreakerFrozen ? "CIRCUIT_BREAKER_FROZEN" : "AUTO_MERGE_APPROVED",
        freeze_target: "pkg:maven/org.yaml/snakeyaml@1.33",
        reason: "Tarjan articulation point with systemic contagion risk"
      }
    },
    null,
    2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(mockManifestJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className={`w-full max-w-2xl rounded-xl border shadow-xl flex flex-col overflow-hidden max-h-[90vh] ${
        isLight 
          ? 'bg-white border-slate-200 text-slate-900' 
          : 'bg-[#080c14] border-slate-800 text-slate-100'
      }`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-950/70 border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-md border flex items-center justify-center ${
              isLight 
                ? 'bg-white border-slate-200 text-slate-700' 
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}>
              <GitPullRequest className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>Coordinated Multi-Repository Manifest</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${
                  isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  Remediation Orchestrator
                </span>
              </div>
              <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                1 targeted architectural cut replaces fragmented dependency PRs across {affectedRepos} repositories
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1 rounded-md transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4 text-xs">
          {/* Comparison Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg border ${
              isLight 
                ? 'bg-slate-50 border-slate-200' 
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className={`text-[10px] font-semibold uppercase mb-1 ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Standard Dependency Bot Output
              </div>
              <div className="text-base font-bold text-slate-700 dark:text-slate-300">40 Fragmented PRs</div>
              <div className={`text-[11px] mt-1 leading-snug ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Individual repository notifications with repetitive review fatigue and breaking change risk.
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${
              isLight 
                ? 'bg-emerald-50/60 border-emerald-200' 
                : 'bg-emerald-950/20 border-emerald-900/40'
            }`}>
              <div className={`text-[10px] font-semibold uppercase mb-1 ${
                isLight ? 'text-emerald-800' : 'text-emerald-300'
              }`}>
                KEYSTONE Minimum Cut
              </div>
              <div className="text-base font-bold text-emerald-700 dark:text-emerald-400">1 Coordinated PR</div>
              <div className={`text-[11px] mt-1 leading-snug ${isLight ? 'text-emerald-900/80' : 'text-emerald-300/80'}`}>
                Upgrades single upstream orchestrator <code className="font-mono font-bold">internal-data-pipeline</code>, severing 4 attack paths.
              </div>
            </div>
          </div>

          {/* Circuit Breaker Directive */}
          <div className={`p-3.5 rounded-lg border flex items-center justify-between ${
            circuitBreakerFrozen 
              ? isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-amber-950/30 border-amber-800/40'
              : isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md ${
                circuitBreakerFrozen 
                  ? isLight ? 'bg-amber-100 text-amber-800' : 'bg-amber-900/40 text-amber-300'
                  : isLight ? 'bg-slate-200/70 text-slate-700' : 'bg-slate-800 text-slate-300'
              }`}>
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs flex items-center gap-2">
                  <span>CI/CD Intake Quarantine (Circuit Breaker)</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    circuitBreakerFrozen ? 'bg-amber-200/80 text-amber-900 font-bold' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {circuitBreakerFrozen ? 'LOCKED' : 'MONITORING'}
                  </span>
                </div>
                <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Blocks new builds from importing vulnerable transitive version across all 42 repositories.
                </div>
              </div>
            </div>

            <button
              onClick={onToggleCircuitBreaker}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                circuitBreakerFrozen
                  ? isLight ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : isLight ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900' : 'bg-slate-100 hover:bg-white text-slate-900 border-white'
              }`}
            >
              {circuitBreakerFrozen ? 'Unlock Intake' : 'Engage Quarantine'}
            </button>
          </div>

          {/* JSON Manifest Preview */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                <FileJson className="w-3.5 h-3.5" />
                <span>Orchestration Policy Manifest (JSON)</span>
              </span>
              <button
                onClick={handleCopy}
                className={`text-xs px-2.5 py-1 rounded border transition-colors flex items-center gap-1 font-medium ${
                  isLight 
                    ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Manifest'}</span>
              </button>
            </div>

            <pre className={`p-3 rounded-lg border font-mono text-[11px] leading-snug overflow-x-auto max-h-48 ${
              isLight 
                ? 'bg-slate-50 border-slate-200 text-slate-800' 
                : 'bg-slate-950/80 border-slate-800 text-slate-300'
            }`}>
              {mockManifestJson}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-end gap-2 ${
          isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-950/70 border-slate-800'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md text-xs font-medium border transition-colors ${
              isLight 
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            Close
          </button>
          <button
            onClick={() => {
              handleCopy();
              onClose();
            }}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors ${
              isLight 
                ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                : 'bg-slate-100 hover:bg-white text-slate-900'
            }`}
          >
            Copy & Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
