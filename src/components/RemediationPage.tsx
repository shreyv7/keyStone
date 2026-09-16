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
        title: 'Minimum-Cut Intervention (Recommended)',
        description: 'Upgrade to SnakeYAML 1.34 with SafeConstructor enforced at the internal shared library layer, severing all 4 DAG chains with 0 breaking changes.',
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
    <div className="w-full h-full overflow-y-auto px-6 py-6 select-text ks-bg-app">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                Minimum-Cut Supply Chain Optimization
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
              Remediation Center
            </h1>
            <p className="text-sm mt-2 max-w-2xl text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
              Targeted network interventions: sever maximum downstream reachability paths to mission-critical sinks with minimum engineering overhead.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {onOpenSBOMModal && (
              <button
                onClick={onOpenSBOMModal}
                className="btn-3d-secondary px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer select-none"
              >
                <UploadCloud className="w-4 h-4 text-blue-500" />
                <span>Ingest SBOM / Lockfile</span>
              </button>
            )}

            <button
              onClick={onReturnToGraph}
              className="btn-3d-secondary px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer select-none"
            >
              <Layers className="w-4 h-4 text-blue-500" />
              <span>Topology Map</span>
            </button>

            <button
              onClick={onOpenPRModal}
              className="btn-3d-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer select-none"
            >
              <GitPullRequest className="w-4 h-4" />
              <span>Dispatch Coordinated PR</span>
            </button>
          </div>
        </div>

        {/* 2-Column Layout: Left Package/SBOM Selector vs. Right Remediation Cockpit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Monitored Packages & SBOM Selector (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="connector-3d-card p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
                  Monitored Dependencies ({filteredPackages.length})
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  Select to Remediate
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
                            Cut-Vertex
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] font-mono pt-1.5 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-slate-400">
                        <span>Tier-1 Reach: <strong className="text-slate-700 dark:text-slate-300">{pkg.tier1Reach} Sinks</strong></span>
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
                    Ecosystem: {activePackage.ecosystem} • CVSS Score: {activePackage.conventionalScore}/100 ➔ Systemic Exposure: {activePackage.systemicScore}/100
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleApplyToggle}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                      isCurrentlyApplied
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'btn-3d-secondary text-slate-800 dark:text-slate-200'
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
                        <span>Apply Simulated Cut</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={onOpenPRModal}
                    className="btn-3d-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer select-none"
                  >
                    <GitPullRequest className="w-3.5 h-3.5" />
                    <span>Open PR</span>
                  </button>
                </div>
              </div>

              {/* Strategy Selector Tabs */}
              <div className="flex items-center gap-2 p-1 rounded-xl connector-3d-card overflow-x-auto">
                {activePackage.strategyOptions.map((strat) => (
                  <button
                    key={strat.id}
                    onClick={() => setSelectedStrategyId(strat.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap select-none flex-1 text-center ${
                      selectedStrategyId === strat.id
                        ? 'btn-3d-primary text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
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

              {/* Impact Delta Grid (4 Tiles) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Paths Severed</span>
                  <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
                    {activeStrategy.pathsSevered} / 4
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5">DAG connections cut</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Blast Reduction</span>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                    {activeStrategy.financialReduction}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5">Payment flow saved</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Breaking Changes</span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                    {activeStrategy.breakingChanges}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5">Zero API incompatibilities</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Security Gain</span>
                  <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
                    +{activeStrategy.securityGain}%
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5">Structural insulation</span>
                </div>
              </div>

              {/* Code Diff Preview Card */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold font-mono uppercase text-slate-700 dark:text-slate-300">
                      Prescribed Patch Blueprint
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
                  className="btn-3d-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shrink-0 cursor-pointer select-none"
                >
                  <GitPullRequest className="w-4 h-4" />
                  <span>Create Coordinated PR (F10)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
