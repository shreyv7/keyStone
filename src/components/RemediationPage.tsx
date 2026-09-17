import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  GitPullRequest, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Search, 
  UploadCloud, 
  ShieldCheck, 
  FileCode, 
  RotateCcw, 
  ExternalLink,
  DollarSign,
  Zap,
  Cpu,
  AlertTriangle,
  Building2,
  Check,
  Copy,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { MitigationCandidate, RoleLens, EcosystemNode } from '../types';
import { MOCK_MITIGATION_CANDIDATES, MOCK_NODES } from '../data/mockEcosystem';
import { PageHeader } from './ui/PageHeader';
import { MetricStrip } from './ui/MetricStrip';
import { Disclosure } from './ui/Disclosure';

interface RemediationPageProps {
  candidates?: MitigationCandidate[];
  nodes?: EcosystemNode[];
  activeLens?: RoleLens;
  onOpenPRModal: () => void;
  onOpenSBOMModal?: () => void;
  onReturnToGraph: () => void;
  onApplyFix?: (packageId: string) => void;
  isApplied?: boolean;
}

interface PackageRemediationProfile {
  id: string;
  name: string;
  version: string;
  ecosystem: 'Maven / Java' | 'npm / Node.js' | 'Internal Lib' | 'PyPI / Python';
  systemicScore: number;
  conventionalScore: number;
  articulationPoint: boolean;
  tier1Reach: number;
  targetVersion: string;
  semverJump: 'patch' | 'minor' | 'major';
  pathsSevered: number;
  financialReduction: string;
  diffSnippet: string;
  strategyOptions: Array<{
    id: 'min_cut' | 'low_hanging' | 'crown_jewel';
    title: string;
    description: string;
    pathsSevered: number;
    financialReduction: string;
    breakingChanges: number;
    securityGain: number;
  }>;
}

const PACKAGE_PROFILES: PackageRemediationProfile[] = [
  {
    id: 'snakeyaml',
    name: 'snakeyaml',
    version: '1.33',
    ecosystem: 'Maven / Java',
    systemicScore: 84,
    conventionalScore: 48,
    articulationPoint: true,
    tier1Reach: 4,
    targetVersion: '1.34 (or SnakeYAML 2.0 Engine)',
    semverJump: 'minor',
    pathsSevered: 4,
    financialReduction: '$85M / Day',
    diffSnippet: `--- a/pom.xml
+++ b/pom.xml
@@ -42,7 +42,7 @@
     <dependency>
       <groupId>org.yaml</groupId>
       <artifactId>snakeyaml</artifactId>
-      <version>1.33</version>
+      <version>1.34</version>
+      <!-- SafeConstructor enforce limit: 3MB max payload -->
     </dependency>`,
    strategyOptions: [
      {
        id: 'min_cut',
        title: 'Recommended update',
        description: 'Upgrade to SnakeYAML 1.34 with SafeConstructor enforced at the internal shared library layer, severing all 4 attack paths with 0 breaking changes.',
        pathsSevered: 4,
        financialReduction: '$85M / Day',
        breakingChanges: 0,
        securityGain: 78
      },
      {
        id: 'low_hanging',
        title: 'Safe Parser Isolation Proxy',
        description: 'Wrap data ingestion pipeline with internal-data-pipeline validation gate, dropping malformed payloads before reaching core parsing logic.',
        pathsSevered: 3,
        financialReduction: '$60M / Day',
        breakingChanges: 0,
        securityGain: 62
      },
      {
        id: 'crown_jewel',
        title: 'Payment Gateway Air-Gap',
        description: 'Architectural dual-vendoring: Replace SnakeYAML with Jackson YAML specifically in the Payment Gateway and Auth/IAM microservices.',
        pathsSevered: 2,
        financialReduction: '$70M / Day',
        breakingChanges: 2,
        securityGain: 85
      }
    ]
  },
  {
    id: 'minimist',
    name: 'minimist',
    version: '0.0.8',
    ecosystem: 'npm / Node.js',
    systemicScore: 78,
    conventionalScore: 56,
    articulationPoint: true,
    tier1Reach: 3,
    targetVersion: '1.2.8',
    semverJump: 'major',
    pathsSevered: 3,
    financialReduction: '$42M / Day',
    diffSnippet: `--- a/package.json
+++ b/package.json
@@ -18,7 +18,7 @@
   "dependencies": {
-    "minimist": "0.0.8"
+    "minimist": "^1.2.8"
   }`,
    strategyOptions: [
      {
        id: 'min_cut',
        title: 'SemVer Major Alignment (Recommended)',
        description: 'Upgrade transitive minimist constraints to 1.2.8 across all 18 dependent platform microservices to remediate prototype pollution.',
        pathsSevered: 3,
        financialReduction: '$42M / Day',
        breakingChanges: 0,
        securityGain: 72
      },
      {
        id: 'low_hanging',
        title: 'npm Override Lockfile Enforcement',
        description: 'Add package.json "overrides" stanza to force resolution to 1.2.8 in CI/CD pipeline.',
        pathsSevered: 3,
        financialReduction: '$42M / Day',
        breakingChanges: 0,
        securityGain: 68
      },
      {
        id: 'crown_jewel',
        title: 'Zero-Dependency CLI Parsing',
        description: 'Replace minimist with Node.js built-in util.parseArgs() in partner-api-gateway.',
        pathsSevered: 1,
        financialReduction: '$28M / Day',
        breakingChanges: 1,
        securityGain: 80
      }
    ]
  },
  {
    id: 'internal-data-pipeline',
    name: 'internal-data-pipeline',
    version: '2.4.0',
    ecosystem: 'Internal Lib',
    systemicScore: 74,
    conventionalScore: 92,
    articulationPoint: true,
    tier1Reach: 3,
    targetVersion: '2.5.0 (Sanitized Wrapper)',
    semverJump: 'minor',
    pathsSevered: 3,
    financialReduction: '$55M / Day',
    diffSnippet: `--- a/libs/data-pipeline/config.go
+++ b/libs/data-pipeline/config.go
@@ -12,4 +12,6 @@
+ // Circuit breaker validation gate
+ var EnforceStrictSchema = true
+ var MaxPayloadDepth = 8`,
    strategyOptions: [
      {
        id: 'min_cut',
        title: 'Circuit-Breaker Ingestion Gate (Recommended)',
        description: 'Deploy version 2.5.0 with built-in recursive schema validation and payload depth restrictions to insulate Payment Gateway.',
        pathsSevered: 3,
        financialReduction: '$55M / Day',
        breakingChanges: 0,
        securityGain: 75
      },
      {
        id: 'low_hanging',
        title: 'Downstream Consumer Rate Limiter',
        description: 'Throttle unvalidated ingestion rates across platform microservices.',
        pathsSevered: 2,
        financialReduction: '$35M / Day',
        breakingChanges: 0,
        securityGain: 58
      },
      {
        id: 'crown_jewel',
        title: 'Dual-Path Ingestion Pipeline',
        description: 'Separate trusted internal streams from external unauthenticated client webhooks.',
        pathsSevered: 3,
        financialReduction: '$55M / Day',
        breakingChanges: 1,
        securityGain: 88
      }
    ]
  },
  {
    id: 'api-core',
    name: 'api-core',
    version: '1.9.0',
    ecosystem: 'Internal Lib',
    systemicScore: 68,
    conventionalScore: 88,
    articulationPoint: false,
    tier1Reach: 2,
    targetVersion: '1.9.1',
    semverJump: 'patch',
    pathsSevered: 2,
    financialReduction: '$30M / Day',
    diffSnippet: `--- a/core/routing.ts
+++ b/core/routing.ts
@@ -25,2 +25,4 @@
+ // Strict route parameter sanitization
+ router.use(sanitizeInputParams());`,
    strategyOptions: [
      {
        id: 'min_cut',
        title: 'Patch Upgrade & Route Sanitizer (Recommended)',
        description: 'Bump to 1.9.1 containing input parameter normalization to break propagation into checkout-service.',
        pathsSevered: 2,
        financialReduction: '$30M / Day',
        breakingChanges: 0,
        securityGain: 65
      },
      {
        id: 'low_hanging',
        title: 'WAF Rule Enforcement',
        description: 'Block malformed routing tokens at ingress API gateway.',
        pathsSevered: 1,
        financialReduction: '$20M / Day',
        breakingChanges: 0,
        securityGain: 50
      },
      {
        id: 'crown_jewel',
        title: 'Checkout Service Re-architecture',
        description: 'Decouple api-core dependency directly inside the Order Processing Core service.',
        pathsSevered: 2,
        financialReduction: '$30M / Day',
        breakingChanges: 2,
        securityGain: 82
      }
    ]
  }
];

export const RemediationPage: React.FC<RemediationPageProps> = ({
  onOpenPRModal,
  onOpenSBOMModal,
  onReturnToGraph,
  onApplyFix,
  isApplied: initialIsApplied = false
}) => {
  const { isLight } = useTheme();
  const [selectedPackageId, setSelectedPackageId] = useState<string>('snakeyaml');
  const [selectedStrategyId, setSelectedStrategyId] = useState<'min_cut' | 'low_hanging' | 'crown_jewel'>('min_cut');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedPackages, setAppliedPackages] = useState<Set<string>>(new Set(initialIsApplied ? ['snakeyaml'] : []));
  const [copiedDiff, setCopiedDiff] = useState(false);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    if (!searchQuery.trim()) return PACKAGE_PROFILES;
    const q = searchQuery.toLowerCase();
    return PACKAGE_PROFILES.filter(
      p => p.name.toLowerCase().includes(q) || p.ecosystem.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activePackage = PACKAGE_PROFILES.find(p => p.id === selectedPackageId) || PACKAGE_PROFILES[0];
  const activeStrategy = activePackage.strategyOptions.find(s => s.id === selectedStrategyId) || activePackage.strategyOptions[0];
  const isCurrentlyApplied = appliedPackages.has(activePackage.id);

  const handleApplyToggle = () => {
    setAppliedPackages(prev => {
      const next = new Set(prev);
      if (next.has(activePackage.id)) {
        next.delete(activePackage.id);
      } else {
        next.add(activePackage.id);
      }
      return next;
    });
    onApplyFix?.(activePackage.id);
  };

  const handleCopyDiff = () => {
    navigator.clipboard.writeText(activePackage.diffSnippet);
    setCopiedDiff(true);
    setTimeout(() => setCopiedDiff(false), 2000);
  };

  return (
    <div className="w-full h-full overflow-y-auto px-4 py-5 sm:px-6 select-text ks-bg-app">
      <div className="max-w-7xl mx-auto flex flex-col gap-5">

        <PageHeader
          title="Remediation"
          description="Review the recommended dependency update, its expected protection, and compatibility evidence."
          primaryAction={
            <button
              onClick={onOpenPRModal}
              className="ks-btn ks-btn-primary ks-btn-md"
            >
              <GitPullRequest className="w-4 h-4" />
              <span>Review recommended fix</span>
            </button>
          }
          secondaryActions={
            <>
            {onOpenSBOMModal && (
              <button
                onClick={onOpenSBOMModal}
                className="ks-btn ks-btn-secondary ks-btn-md"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Import data</span>
              </button>
            )}
            <button
              onClick={onReturnToGraph}
              className="ks-btn ks-btn-ghost ks-btn-md"
            >
              <Layers className="w-4 h-4" />
              <span>Topology</span>
            </button>
            </>
          }
        />

        {/* 2-Column Layout: Left Package/SBOM Selector vs. Right Remediation Cockpit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Monitored Packages & SBOM Selector (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="connector-3d-card p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
                  Dependencies ({filteredPackages.length})
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  Select one
                </span>
              </div>

              {/* Search Filter */}
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter packages or ecosystem..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border ks-border outline-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>

              {/* Package List */}
              <div className="flex flex-col gap-2 max-h-[640px] overflow-y-auto pr-0.5">
                {filteredPackages.map((pkg) => {
                  const isSelected = pkg.id === selectedPackageId;
                  const isPkgApplied = appliedPackages.has(pkg.id);

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => {
                        setSelectedPackageId(pkg.id);
                        setSelectedStrategyId('min_cut');
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex flex-col gap-2 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-500 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                            {pkg.name}
                          </span>
                          <span className="font-mono text-xs text-slate-500">
                            v{pkg.version}
                          </span>
                        </div>

                        {isPkgApplied ? (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Fixed
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            Score: {pkg.systemicScore}/100
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{pkg.ecosystem}</span>
                        {pkg.articulationPoint && (
                          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                            High impact
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] font-mono pt-1.5 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-slate-400">
                        <span><strong className="text-slate-700 dark:text-slate-300">{pkg.tier1Reach} critical services</strong></span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{pkg.financialReduction}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Scoped Remediation Cockpit (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">

            {/* Selected Package Header Card */}
            <div className="connector-3d-card p-5 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                      {activePackage.name}
                    </h2>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                      v{activePackage.version}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ➔
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {activePackage.targetVersion}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {activePackage.ecosystem} · Protects {activePackage.tier1Reach} critical services · {activeStrategy.breakingChanges} breaking changes expected
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleApplyToggle}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 select-none shadow-xs ${
                      isCurrentlyApplied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    {isCurrentlyApplied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Fix Simulated</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-blue-500" />
                        <span>Preview applied state</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={onOpenPRModal}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2f2fe4] hover:bg-[#4343f8] shadow-[0_0_15px_rgba(47,47,228,0.35)] flex items-center gap-1.5 cursor-pointer select-none transition-all"
                  >
                    <GitPullRequest className="w-3.5 h-3.5" />
                    <span>Review PR</span>
                  </button>
                </div>
              </div>

              {/* Strategy Selector Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 overflow-x-auto">
                {activePackage.strategyOptions.map((strat) => (
                  <button
                    key={strat.id}
                    onClick={() => setSelectedStrategyId(strat.id)}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap select-none flex-1 text-center ${
                      selectedStrategyId === strat.id
                        ? 'bg-[#2f2fe4] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {strat.title}
                  </button>
                ))}
              </div>

              {/* Strategy Description Banner */}
              <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-800/60 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-blue-900 dark:text-blue-200">
                    {activeStrategy.title}
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {activeStrategy.description}
                  </p>
                </div>
              </div>

              <MetricStrip items={[
                { label: 'Exposure paths removed', value: `${activeStrategy.pathsSevered} / 4`, detail: 'Known propagation paths', tone: 'info' },
                { label: 'Business flow protected', value: activeStrategy.financialReduction, detail: 'Estimated daily impact', tone: 'healthy' },
                { label: 'Breaking changes', value: activeStrategy.breakingChanges, detail: 'Verified call-site compatibility', tone: activeStrategy.breakingChanges === 0 ? 'healthy' : 'warning' },
              ]} />

              <Disclosure title="Implementation preview" summary="Dependency diff and exact version change">
                <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Proposed dependency diff
                    </span>
                  </div>
                  <button
                    onClick={handleCopyDiff}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 font-mono cursor-pointer"
                  >
                    {copiedDiff ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedDiff ? 'Copied' : 'Copy Diff'}</span>
                  </button>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 p-3.5 text-xs font-mono text-slate-200 leading-relaxed">
                  <pre className="overflow-x-auto whitespace-pre">
                    {activePackage.diffSnippet}
                  </pre>
                </div>
                </div>
              </Disclosure>

              {/* Progressive Disclosure: Contract Compatibility & Bytecode Proofs */}
              <details className={`group rounded-xl border p-3.5 transition-colors ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <summary className="flex items-center justify-between text-xs font-semibold cursor-pointer select-none text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Technical compatibility evidence (42/42 methods verified)</span>
                  </span>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    0 Breaking Changes
                  </span>
                </summary>
                <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>AST Call-site Verification:</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">42 INVOKEVIRTUAL calls verified identical</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Vulnerability Remediation:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Removes CVE-2022-1471 (RCE Constructor)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cryptographic Integrity Lock:</span>
                    <span className="font-mono text-[11px] text-slate-500 truncate max-w-[240px]">sha256:7f83b165...88df</span>
                  </div>
                </div>
              </details>

              {/* Action Callout Bar */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Ready to dispatch to GitHub / GitLab?
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Generate multi-repo branch updates, PR descriptions, and CI check passes automatically.
                  </div>
                </div>

                <button
                  onClick={onOpenPRModal}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2f2fe4] hover:bg-[#4343f8] shadow-[0_0_15px_rgba(47,47,228,0.35)] flex items-center gap-2 shrink-0 cursor-pointer select-none transition-all"
                >
                  <GitPullRequest className="w-4 h-4" />
                    <span>Create coordinated PR</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
