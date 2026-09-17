import React, { useState } from 'react';
import { 
  X, 
  GitPullRequest, 
  Check, 
  Copy, 
  ShieldAlert, 
  Lock, 
  FileJson,
  ExternalLink,
  ArrowUpRight
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
        reason: "Critical chokepoint with systemic contagion risk"
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
          isLight ? 'bg-white border-slate-200' : 'bg-slate-950/70 border-slate-800'
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
              <div className="text-sm font-bold flex items-center gap-2 flex-wrap">
                <span>Coordinated Multi-Repository Manifest</span>
                {circuitBreakerFrozen && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Quarantined
                  </span>
                )}
              </div>
              <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                1 targeted fix replaces fragmented dependency PRs across {affectedRepos} repositories
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleCircuitBreaker}
              className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 font-medium transition-colors ${
                circuitBreakerFrozen
                  ? isLight ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200' : 'bg-amber-900/40 text-amber-300 border-amber-700 hover:bg-amber-900/60'
                  : isLight ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title={circuitBreakerFrozen ? "Click to Unlock CI/CD Intake" : "Click to Quarantine CI/CD Intake"}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{circuitBreakerFrozen ? 'Frozen' : 'Quarantine'}</span>
            </button>
            <button
              onClick={onClose}
              className={`p-1 rounded-md transition-colors ${
                isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4 text-xs">
          {/* Comparison Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg border ${
              isLight 
                ? 'bg-white border-slate-200 shadow-xs' 
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
                KEYSTONE Targeted Fix
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
              : isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/40 border-slate-800'
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
              className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                circuitBreakerFrozen
                  ? isLight ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : isLight ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900' : 'bg-slate-100 hover:bg-white text-slate-900 border-white'
              }`}
            >
              {circuitBreakerFrozen ? 'Unlock Intake' : 'Engage Quarantine'}
            </button>
          </div>

          {/* F10 Phased Cohort Rollout Cockpit */}
          <div className={`rounded-lg border p-3.5 flex flex-col gap-2.5 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" />
                <span className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Phased Rollout Pipeline
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Cohort 0 */}
              <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                isLight ? 'bg-emerald-50/70 border-emerald-300' : 'bg-emerald-950/30 border-emerald-800'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[11px] text-emerald-700 dark:text-emerald-400">Cohort 0: Canary</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-600 text-white">
                      PROMOTED ✓
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                    sandbox-runner, dev-portal
                  </div>
                </div>
                <div className="text-[9px] text-emerald-700 dark:text-emerald-400 mt-2">
                  0 regressions detected in 24h
                </div>
              </div>

              {/* Cohort 1 */}
              <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                isLight ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-300' : 'bg-blue-950/30 border-blue-800 ring-1 ring-blue-700'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[11px] text-blue-700 dark:text-blue-400">Cohort 1: Core Svc</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-600 text-white animate-pulse">
                      VALIDATING
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                    billing-service, fraud-detection
                  </div>
                </div>
                <div className="text-[9px] text-blue-700 dark:text-blue-400 mt-2">
                  Canary bake: 1h 14m remaining
                </div>
              </div>

              {/* Cohort 2 */}
              <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                isLight ? 'bg-purple-50/70 border-purple-300' : 'bg-purple-950/30 border-purple-800'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[11px] text-purple-700 dark:text-purple-400">Cohort 2: Critical Services</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-700 text-white">
                      HELD (SOX Freeze)
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                    payment-service, auth-iam
                  </div>
                </div>
                <div className="text-[9px] text-purple-700 dark:text-purple-400 mt-2">
                  Requires 2 approvals + signoff
                </div>
              </div>
            </div>
          </div>

          {/* Affected Repositories List with Direct GitHub Deep Links (P3-7) */}
          <div className={`rounded-lg border p-3 flex flex-col gap-2 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs flex items-center gap-1.5">
                <GitPullRequest className="w-3.5 h-3.5 text-emerald-500" />
                <span>Targeted Repositories for Coordinated PR ({affectedRepos})</span>
              </span>
              <a
                href="https://github.com/orgs/acme-inc/repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>View Org on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
              {[
                { repo: 'acme-inc/payment-service', tier: 'Tier-1 Revenue Sink' },
                { repo: 'acme-inc/auth-session-manager', tier: 'Tier-1 IAM Sink' },
                { repo: 'acme-inc/checkout-service', tier: 'Tier-1 Revenue Sink' },
                { repo: 'acme-inc/fraud-detection', tier: 'Risk Engine' },
                { repo: 'acme-inc/partner-api-gateway', tier: 'External Gateway' },
                { repo: 'acme-inc/storefront-web', tier: 'Consumer Web App' },
                { repo: 'acme-inc/billing-service', tier: 'Tier-1 Settlement' }
              ].map(({ repo, tier }) => (
                <div key={repo} className={`p-2 rounded border text-[11px] font-mono flex items-center justify-between ${
                  isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950/60 border-slate-800/80 text-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="font-semibold">{repo}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-sans ${
                      isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tier}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <a
                      href={`https://github.com/${repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5 font-sans font-medium"
                    >
                      <span>Open Repo</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <a
                      href="https://security.snyk.io/vuln/SNYK-JAVA-ORGYAML-3054694"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5 font-sans font-medium"
                    >
                      <span>Snyk Vuln</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
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
                className={`text-xs px-2.5 py-1 rounded border transition-colors flex items-center gap-1 font-medium cursor-pointer ${
                  isLight 
                    ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Manifest'}</span>
              </button>
            </div>

            <pre className={`p-3 rounded-lg border font-mono text-[11px] leading-snug overflow-x-auto max-h-40 ${
              isLight 
                ? 'bg-white border-slate-200 text-slate-800 shadow-xs' 
                : 'bg-slate-950/80 border-slate-800 text-slate-300'
            }`}>
              {mockManifestJson}
            </pre>
          </div>
        </div>

        {/* Footer with Deep Link CTAs (P3-7) */}
        <div className={`p-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-950/70 border-slate-800'
        }`}>
          {/* External Integration Deep Links */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="https://docs.renovatebot.com/configuration-options/"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isLight 
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs' 
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <span>Configure in Renovate</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href="https://security.snyk.io/vuln/SNYK-JAVA-ORGYAML-3054694"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isLight 
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs' 
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <span>Inspect in Snyk</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href="https://osv.dev/vulnerability/GHSA-mjrt-cq8q-wjp4"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isLight 
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs' 
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <span>OSV Advisory</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={onClose}
              className={`px-3.5 py-2 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
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
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                isLight 
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs' 
                  : 'bg-slate-100 hover:bg-white text-slate-900'
              }`}
            >
              Copy & Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
