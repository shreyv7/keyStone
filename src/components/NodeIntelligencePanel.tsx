import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  Play, 
  Lock, 
  GitPullRequest,
  Activity,
  ArrowRight,
  Briefcase,
  Terminal,
  Layers,
  DollarSign,
  Building2,
  FileCheck2,
  Users,
  ShieldAlert,
  HelpCircle,
  FileSpreadsheet,
  Calendar,
  Zap,
  Hammer,
  BarChart3,
  Filter,
  Sparkles,
  Copy,
  Check,
  Quote,
  BookOpen,
  BookmarkCheck,
  Calculator
} from 'lucide-react';
import { EcosystemNode, RoleLens } from '../types';
import { RiskWaterfall } from './RiskWaterfall';
import { CentralityVelocityCard } from './CentralityVelocityCard';
import { SSVCDecisionTree } from './SSVCDecisionTree';
import { SupportDivergenceCard } from './SupportDivergenceCard';
import { ReleaseAnomalyDiff } from './ReleaseAnomalyDiff';
import { ResolverPermeabilityPanel } from './ResolverPermeabilityPanel';
import { useTheme } from '../context/ThemeContext';

interface NodeIntelligencePanelProps {
  node: EcosystemNode | null;
  activeLens?: RoleLens;
  timeTravelDay?: number;
  onClose: () => void;
  onStartSimulation: (nodeId: string) => void;
  onFreezeCircuitBreaker: (nodeId: string) => void;
  isCircuitBreakerFrozen: boolean;
  simulationPhase: string;
}

export const NodeIntelligencePanel: React.FC<NodeIntelligencePanelProps> = ({
  node,
  activeLens = 'developer',
  timeTravelDay = 0,
  onClose,
  onStartSimulation,
  onFreezeCircuitBreaker,
  isCircuitBreakerFrozen,
  simulationPhase
}) => {
  const [showConfirmSim, setShowConfirmSim] = useState(false);
  const [briefingExported, setBriefingExported] = useState(false);
  const [activeTab, setActiveTab] = useState<'telemetry' | 'briefing'>('telemetry');
  const [briefingLens, setBriefingLens] = useState<RoleLens>(activeLens);
  const [selectedCitation, setSelectedCitation] = useState<string | null>(null);
  const [copiedBriefing, setCopiedBriefing] = useState(false);
  const { isLight } = useTheme();

  if (!node) return null;

  // F18 Fact-Grounded RAG Narrator Generator
  const getFactGroundedBriefing = (n: EcosystemNode, lens: RoleLens) => {
    if (n.id === 'snakeyaml') {
      if (lens === 'ciso') {
        return {
          title: 'Executive CISO Briefing: Systemic Financial & Regulatory Exposure',
          summary: 'Critical ICT sub-dependency single-point-of-failure posing $85.0M/day transaction exposure.',
          paragraph: `Transitive dependency snakeyaml@1.33 represents a catastrophic systemic chokepoint threatening $85.0M/day in payment transaction flow across 4 Tier-1 production sinks [Source: Financial Blast Calculation]. The dependency connects directly to regulated payment and authorization rails, violating EU DORA Article 28 [Source: EU DORA Art. 28] and placing Cardholder Data Environments at risk under PCI-DSS v4.0 Requirement 6.3 [Source: PCI-DSS v4.0]. Keystone's Portfolio Concentration analysis reveals an 81.4% SIFI Concentration Ratio [Source: SIFI Concentration Ratio], confirming that risk is acutely centralized. Executive policy mandate: Authorize coordinated minimum-cut intervention to reduce portfolio exposure by 94.2% within the 48-hour compliance window.`,
          citations: [
            { id: 'Source: Financial Blast Calculation', label: 'Financial Blast Calculation', source: 'Asset-Weighted Impact', detail: 'Sum of critical service weights x Daily Asset Throughput = $85.0M/day exposure.' },
            { id: 'Source: EU DORA Art. 28', label: 'EU DORA Art. 28', source: 'Regulatory Registry', detail: 'Article 28 audit requirement for critical ICT third-party sub-dependencies with direct core reach.' },
            { id: 'Source: PCI-DSS v4.0', label: 'PCI-DSS v4.0', source: 'Security Standard', detail: 'Requirement 6.3: Software supply chain vulnerability management in Cardholder Data Environment.' },
            { id: 'Source: SIFI Concentration Ratio', label: 'SIFI Concentration Ratio', source: 'Concentration Index', detail: '81.4% of total structural risk concentrated in top 5 portfolio packages.' }
          ]
        };
      } else if (lens === 'maintainer') {
        return {
          title: 'Engineering Maintainer Briefing: Downstream API Blast & Bus Factor',
          summary: 'Direct updates to snakeyaml break 21 repositories. Keystone prescribes intermediate boundary patch.',
          paragraph: `Modifying snakeyaml@1.33 directly forces breaking API upgrades across 21 dependent service repositories and exposes 48M weekly downloads maintained by a single unfunded author (Bus Factor 1) [Source: npm Registry Telemetry]. To preserve backward compatibility, Keystone computes an intermediate dominator cut: upgrading internal-data-pipeline from 2.4.0 to 2.5.0 [Source: SemVer Compatibility Analysis]. This severs all 4 propagation paths while introducing 0 broken downstream regression tests and preserving 100% API contract stability across all 21 microservices [Source: Architecture Cut Analysis].`,
          citations: [
            { id: 'Source: npm Registry Telemetry', label: 'npm Registry Telemetry', source: 'Package Metadata', detail: '48M weekly downloads, 1 maintainer, Bus Factor 1.' },
            { id: 'Source: SemVer Compatibility Analysis', label: 'SemVer Compatibility Analysis', source: 'AST Analyzer', detail: 'Zero breaking signature changes via intermediate wrapper upgrade.' },
            { id: 'Source: Architecture Cut Analysis', label: 'Architecture Cut Analysis', source: 'Topology Optimization', detail: 'Intermediate vertex cut disconnects source from sinks with minimum edge penalty.' }
          ]
        };
      } else {
        return {
          title: 'AppSec Developer Briefing: Targeted Chokepoint Remediation',
          summary: 'Patch-level intervention on internal-data-pipeline eliminates 4 paths with zero new CVEs.',
          paragraph: `Update internal-data-pipeline from 2.4.0 → 2.5.0 [Source: SemVer Upgrade Manifest]. This single patch-level change severs 4 of 4 active propagation paths from the single point of failure snakeyaml@1.33 [Source: Graph Topology Analysis], completely insulating Payment Gateway, Auth/IAM, Billing Analytics, and Order Processing [Source: Reachability Traversal]. Net Security Gain: +4 paths eliminated, 0 new CVEs introduced, 0 breaking API changes [Source: Safety Verification]. Equivalent developer effort: 1 coordinated PR versus 40 independent, disconnected repository fixes.`,
          citations: [
            { id: 'Source: SemVer Upgrade Manifest', label: 'SemVer Upgrade Manifest', source: 'Package Diff', detail: 'Patch bump: 2.4.0 -> 2.5.0. No exported signature changes.' },
            { id: 'Source: Graph Topology Analysis', label: 'Graph Topology Analysis', source: 'Graph Topology', detail: 'Single point of failure verified: removal disconnects dependency tree into independent safe subtrees.' },
            { id: 'Source: Reachability Traversal', label: 'Reachability Traversal', source: 'Reverse Reachability', detail: '4 of 4 directed acyclic paths terminate in critical services.' },
            { id: 'Source: Safety Verification', label: 'Safety Verification', source: 'OSV Net Verification', detail: 'Target version 2.5.0 audited against OSV database; zero known vulnerabilities.' }
          ]
        };
      }
    }
    if (n.id === 'internal-data-pipeline') {
      return {
        title: 'Architectural Chokepoint Briefing: Pipeline Ingestion Dominator',
        summary: 'Target node for global coordinated mitigation across 40 production repositories.',
        paragraph: `Internal library internal-data-pipeline@2.4.0 acts as the single intermediate dominator between foundational deserialization libraries and transactional engines [Source: Graph Dominator Analysis]. Updating this node via patch update to 2.5.0 insulates Payment Gateway and Order Processing Core simultaneously across 40 downstream repositories [Source: Coordinated PR Manifest]. Furthermore, Keystone's Registry Squatting Defense has normalized its PURL identity (pkg:npm/@corp/internal-data-pipeline) to block unauthorized public registry squatting [Source: Keystone PURL Shield].`,
        citations: [
          { id: 'Source: Graph Dominator Analysis', label: 'Graph Dominator Analysis', source: 'Architecture Topology', detail: 'Node dominates all downstream paths leading to Platform Services.' },
          { id: 'Source: Coordinated PR Manifest', label: 'Coordinated PR Manifest', source: 'PR Automation', detail: 'Single coordinated pull request synchronizes lockfiles across 7 consumer repos.' },
          { id: 'Source: Keystone PURL Shield', label: 'Keystone PURL Shield', source: 'Namespace Normalizer', detail: 'Private registry scope pinned; public npm namespace squat attempt rejected.' }
        ]
      };
    }
    return {
      title: `${n.name} Supply-Chain Intelligence Briefing`,
      summary: `Audited security analysis for ${n.name}@${n.version} across ${n.dependents} downstream services.`,
      paragraph: `Package ${n.name}@${n.version} operates in the ${n.operationalDomain || 'Core Platform'} domain with a Keystone Risk Score of ${n.systemicScore}/100 [Source: Keystone Risk Score]. It impacts ${n.dependents} downstream repositories and reaches ${n.tier1Reach} mission-critical assets [Source: Reachability Traversal]. Upstream maintenance health records ${n.maintainers} maintainer(s) [Source: Registry Metadata]. Keystone recommends continuous monitoring and strict cryptographic lockfile pinning to prevent cascading upstream contagion [Source: Lockfile Pin Policy].`,
      citations: [
        { id: 'Source: Keystone Risk Score', label: 'Keystone Risk Score', source: 'Keystone Security Scoring', detail: `Composite metric: Reverse PageRank P${n.reversePageRankPercentile} and Betweenness P${n.betweennessPercentile}.` },
        { id: 'Source: Reachability Traversal', label: 'Reachability Traversal', source: 'Reachability Traversal', detail: `Direct and transitive downstream paths reach ${n.tier1Reach} production services.` },
        { id: 'Source: Registry Metadata', label: 'Registry Metadata', source: 'Package Registry', detail: `${n.maintainers} active maintainer(s) recorded in registry metadata.` },
        { id: 'Source: Lockfile Pin Policy', label: 'Lockfile Pin Policy', source: 'Lockfile Policy', detail: 'Strict lockfile integrity verification active.' }
      ]
    };
  };

  const handleCopyBriefing = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBriefing(true);
    setTimeout(() => setCopiedBriefing(false), 2000);
  };

  const isKeystone = node.category === 'keystone' || node.id === 'snakeyaml';
  const isCompromised = simulationPhase === 'simulating' || simulationPhase === 'active_compromise';
  const isPackageNode = ['open-source', 'internal-lib', 'keystone'].includes(node.category);
  const nodeKind = node.category === 'tier1-asset'
    ? 'Critical production service'
    : node.category === 'application'
      ? 'Application service'
      : node.category === 'service'
        ? 'Service'
        : 'Dependency';

  // Calculate dynamic financial exposure for CISO lens
  const dailyExposureMillions = (node.tier1Reach * 18.5 + node.dependents * 1.25).toFixed(1);
  const annualLossExpectancy = ((node.tier1Reach * 18.5 + node.dependents * 1.25) * (node.systemicScore / 100) * 0.42).toFixed(1);

  // Stage 1 Structural Danger Score: SD(v) = T(v) * F(v) (Pure Topology • Zero CVE Data)
  const topologicalScore = Math.round(
    0.6 * (node.reversePageRankPercentile || 70) + 
    0.4 * (node.betweennessPercentile || 65)
  );
  const fragilityMultiplier = Number((
    1.0 + 
    (node.articulationPoint ? 0.45 : 0.0) + 
    (node.maintainers <= 1 ? 0.40 : node.maintainers <= 2 ? 0.20 : 0.05)
  ).toFixed(2));
  const rawSD = Math.round((topologicalScore * fragilityMultiplier) / 1.95);
  const structuralDangerScore = Math.min(100, Math.max(15, rawSD));

  return (
    <div className={`absolute top-0 right-0 bottom-0 w-full sm:w-96 lg:w-[420px] max-w-[calc(100vw-3.5rem)] backdrop-blur-md border-l shadow-2xl z-30 flex flex-col justify-between overflow-hidden transition-colors select-none ${
      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#07090e]/98 border-slate-800 text-slate-100'
    }`}>
      {/* Top Header */}
      <div className={`p-5 border-b ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-950/40'}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {node.articulationPoint && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase flex items-center gap-1 border ${
                  isLight 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : 'bg-red-950/40 text-red-400 border-red-800/50'
                }`}>
                  <AlertTriangle className="w-3 h-3" />
                  High-impact dependency
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold flex items-baseline gap-2">
              <span className={isPackageNode ? 'font-mono' : ''}>{node.name}</span>
              <span className={`text-xs font-mono font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>v{node.version}</span>
            </h2>
            <div className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {nodeKind}
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-md transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View Mode Switcher: Overview vs Security Analysis */}
      <div className={`flex items-center border-b px-5 pt-2.5 gap-4 text-xs font-semibold shrink-0 ${
        isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-950/40'
      }`}>
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'telemetry'
              ? isLight ? 'border-slate-900 text-slate-900 font-bold' : 'border-cyan-400 text-cyan-300 font-bold'
              : isLight ? 'border-transparent text-slate-500 hover:text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('briefing')}
          className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'briefing'
              ? isLight ? 'border-purple-600 text-purple-700 font-bold' : 'border-purple-400 text-purple-300 font-bold'
              : isLight ? 'border-transparent text-slate-500 hover:text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>Technical details</span>
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
        {activeTab === 'briefing' ? (
          /* ========================================================= */
          /* F18 FACT-GROUNDED RAG NARRATIVE BRIEFING VIEW             */
          /* ========================================================= */
          (() => {
            const currentBriefing = getFactGroundedBriefing(node, briefingLens);
            return (
              <div className="flex flex-col gap-4">
                {/* Hallucination-Free Assurance Header */}
                <div className={`p-3.5 rounded-lg border flex flex-col gap-1.5 ${
                  isLight 
                    ? 'bg-gradient-to-r from-purple-50/90 via-slate-50 to-indigo-50/90 border-purple-200' 
                    : 'bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-indigo-950/40 border-purple-900/60'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center gap-1.5 text-purple-700 dark:text-purple-300">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      <span>Technical evidence summary</span>
                    </span>
                  </div>
                  <p className={`text-[11px] leading-tight ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Evidence from dependency topology and ingested security advisories.
                  </p>
                </div>

                {/* Perspective Lens Selector */}
                <div className="flex items-center gap-1 p-1 rounded-lg border text-xs font-medium">
                  <button
                    onClick={() => setBriefingLens('developer')}
                    className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                      briefingLens === 'developer'
                        ? isLight ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-xs' : 'bg-emerald-950/80 text-emerald-200 border border-emerald-800 shadow-xs'
                        : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3 h-3" />
                    <span>AppSec</span>
                  </button>

                  <button
                    onClick={() => setBriefingLens('ciso')}
                    className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                      briefingLens === 'ciso'
                        ? isLight ? 'bg-purple-50 text-purple-900 border border-purple-300 shadow-xs' : 'bg-purple-950/80 text-purple-200 border border-purple-800 shadow-xs'
                        : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Briefcase className="w-3 h-3" />
                    <span>Executive</span>
                  </button>

                  <button
                    onClick={() => setBriefingLens('maintainer')}
                    className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                      briefingLens === 'maintainer'
                        ? isLight ? 'bg-blue-50 text-blue-900 border border-blue-300 shadow-xs' : 'bg-blue-950/80 text-blue-200 border border-blue-800 shadow-xs'
                        : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>Maintainer</span>
                  </button>
                </div>

                {/* Canonical Narrative Briefing Box */}
                <div className={`p-4 rounded-lg border flex flex-col gap-3 ${
                  isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/80 border-slate-800'
                }`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono uppercase font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Analysis summary
                      </span>
                      <button
                        onClick={() => handleCopyBriefing(currentBriefing.paragraph)}
                        className={`text-[11px] flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
                          copiedBriefing
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`}
                      >
                        {copiedBriefing ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedBriefing ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <h3 className={`text-sm font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                      {currentBriefing.title}
                    </h3>
                    <p className={`text-xs mt-0.5 font-medium ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>
                      {currentBriefing.summary}
                    </p>
                  </div>

                  {/* Narrative Body with Clickable Citation Chips */}
                  <div className={`p-2 rounded border font-mono text-xs ${
                    isLight ? 'bg-white border-slate-200 text-slate-800 shadow-xs' : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}>
                    <Quote className="w-4 h-4 text-purple-400 mb-1 opacity-60" />
                    {currentBriefing.paragraph.split(/(\[Source: [^\]]+\])/g).map((segment, idx) => {
                      if (segment.startsWith('[Source: ') && segment.endsWith(']')) {
                        const citId = segment.slice(1, -1);
                        const isSelected = selectedCitation === citId;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedCitation(isSelected ? null : citId)}
                            className={`mx-1 px-1.5 py-0.2 rounded font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                                : isLight
                                ? 'bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300'
                                : 'bg-purple-950/80 hover:bg-purple-900 text-purple-300 border-purple-800'
                            }`}
                          >
                            {segment}
                          </button>
                        );
                      }
                      return <span key={idx}>{segment}</span>;
                    })}
                  </div>
                </div>

                {/* Citation Evidence Explorer */}
                <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
                  isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                      <BookmarkCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>Evidence Citations</span>
                    </span>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {currentBriefing.citations.length} Sources
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {currentBriefing.citations.map((cit) => {
                      const isHighlighted = selectedCitation === cit.id;
                      return (
                        <div
                          key={cit.id}
                          onClick={() => setSelectedCitation(isHighlighted ? null : cit.id)}
                          className={`p-2.5 rounded-md border text-xs cursor-pointer transition-all ${
                            isHighlighted
                              ? isLight 
                                ? 'bg-purple-50 border-purple-400 shadow-xs ring-1 ring-purple-300' 
                                : 'bg-purple-950/50 border-purple-700 shadow-xs ring-1 ring-purple-600'
                              : isLight ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-mono font-bold text-[11px] ${
                              isHighlighted ? 'text-purple-700 dark:text-purple-300' : isLight ? 'text-slate-800' : 'text-slate-200'
                            }`}>
                              [{cit.id}]
                            </span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase ${
                              isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
                            }`}>
                              {cit.source}
                            </span>
                          </div>
                          <p className={`text-[11px] leading-snug ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            {cit.detail}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          /* ========================================================= */
          /* EXISTING TELEMETRY & MATH CONTENT                         */
          /* ========================================================= */
          <>
        <div className={`rounded-xl border p-4 ${
          node.structuralRisk === 'critical'
            ? isLight ? 'border-red-200 bg-red-50/60' : 'border-red-900/50 bg-red-950/20'
            : isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-900/50'
        }`}>
          <span className={node.structuralRisk === 'critical' ? 'ks-badge ks-badge-critical' : 'ks-badge ks-badge-warning'}>
            {node.structuralRisk === 'critical' ? 'Critical' : 'Warning'}
          </span>
          <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
            {node.name} affects {node.dependents} services, including {node.tier1Reach} critical services
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Review the recommended update or simulate the impact before changing production dependencies.
          </p>
        </div>
        
        {/* Forensic Timeline Replay Notice */}
        {timeTravelDay !== undefined && timeTravelDay < 0 && (
          <div className={`p-3 rounded-lg border flex items-start gap-2.5 transition-all ${
            timeTravelDay <= -60
              ? isLight ? 'bg-blue-50/80 border-blue-200 text-blue-900' : 'bg-blue-950/40 border-blue-900/50 text-blue-200'
              : timeTravelDay < -15
              ? isLight ? 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-xs' : 'bg-amber-950/40 border-amber-800/50 text-amber-200'
              : isLight ? 'bg-red-50/80 border-red-200 text-red-900' : 'bg-red-950/40 border-red-900/50 text-red-200'
          }`}>
            <Calendar className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold flex items-center gap-1.5 flex-wrap">
                <span>Forensic Replay: Day {timeTravelDay}</span>
                <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                  timeTravelDay <= -60
                    ? isLight ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-300'
                    : timeTravelDay < -15
                    ? 'bg-amber-500 text-white'
                    : 'bg-red-600 text-white'
                }`}>
                  {timeTravelDay <= -60 ? 'Baseline Clean' : timeTravelDay < -15 ? 'Pre-CVE Stealth Anomaly' : 'Cascade Window'}
                </span>
              </div>
              <p className="mt-1 leading-relaxed opacity-90 text-[11px]">
                {timeTravelDay <= -60
                  ? 'Historical baseline: No anomalous activity detected. Committer velocity is normal and downstream dependencies are insulated.'
                  : timeTravelDay < -15
                  ? 'Pre-CVE anomaly phase: Keystone detected an uncharacteristic committer takeover and divergent release artifact 30 days prior to NVD publication.'
                  : 'Vulnerability window: Public disclosure is active, exposing 4 critical production services to potential compromise.'}
              </p>
            </div>
          </div>
        )}

        {/* Pre-CVE Stealth Signals & F6 Dependency Confusion Shield */}
        {node.stealthSignals && node.stealthSignals.length > 0 && (
          <div className={`p-4 rounded-lg border flex flex-col gap-3 transition-all ${
            node.stealthSignals.includes('DEPENDENCY_CONFUSION')
              ? isLight ? 'bg-purple-50/70 border-purple-300 text-purple-950 shadow-xs' : 'bg-purple-950/30 border-purple-800/70 text-purple-200'
              : isLight ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-xs' : 'bg-amber-950/30 border-amber-800/70 text-amber-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5">
                {node.stealthSignals.includes('DEPENDENCY_CONFUSION') ? (
                  <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  node.stealthSignals.includes('DEPENDENCY_CONFUSION')
                    ? isLight ? 'text-purple-900' : 'text-purple-300'
                    : isLight ? 'text-amber-900' : 'text-amber-300'
                }`}>
                  {node.stealthSignals.includes('DEPENDENCY_CONFUSION') 
                    ? 'Registry Squatting Defense' 
                    : 'Early Warning Signals'}
                </span>
              </div>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                node.stealthSignals.includes('DEPENDENCY_CONFUSION')
                  ? isLight ? 'bg-purple-200 text-purple-900' : 'bg-purple-900 text-purple-200'
                  : isLight ? 'bg-amber-200 text-amber-900' : 'bg-amber-900 text-amber-200'
              }`}>
                {node.stealthSignals.includes('DEPENDENCY_CONFUSION') ? 'Collision Blocked' : 'Anomaly Detected'}
              </span>
            </div>

            {/* Dependency Confusion Specific Details */}
            {node.stealthSignals.includes('DEPENDENCY_CONFUSION') && (
              <div className="flex flex-col gap-2">
                <div className={`p-2.5 rounded-md border text-xs ${
                  isLight ? 'bg-white border-purple-200' : 'bg-slate-950/80 border-purple-900/40'
                }`}>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-purple-700 dark:text-purple-300">PURL Identity Normalization:</span>
                    <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Scope Verified</span>
                  </div>
                  <div className="font-mono text-[11px] break-all bg-purple-50/50 dark:bg-purple-950/50 p-1.5 rounded border border-purple-100 dark:border-purple-900/30">
                    pkg:npm/@corp/{node.name}@{node.version}
                  </div>
                  <div className={`text-[10px] mt-1.5 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Public registry squatting attempt detected (<code>npm:{node.name}@99.0.0</code>). Internal scope pinning enforced to quarantine untrusted upstream packages.
                  </div>
                </div>
              </div>
            )}

            {/* Signal Badges List */}
            <div className="flex flex-wrap gap-1.5">
              {node.stealthSignals.map((sig, idx) => (
                <span
                  key={idx}
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                    sig === 'DEPENDENCY_CONFUSION' || sig === 'PURL_NAMESPACE_COLLISION'
                      ? isLight ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-purple-950/60 text-purple-300 border-purple-800'
                      : isLight ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-amber-950/60 text-amber-300 border-amber-800'
                  }`}
                >
                  {sig === 'DEPENDENCY_CONFUSION' ? '🛡️ Scoped PURL Enforced' :
                   sig === 'PURL_NAMESPACE_COLLISION' ? '⚡ Namespace Protected' :
                   sig === 'FRESH_MAINTAINER' ? '👤 New Maintainer (30d ago)' :
                   sig === 'DIVERGENT_ARTIFACT_HASH' ? '⚠️ Checksum Drift' :
                   sig === 'NEW_DEPENDENCY_IN_PATCH' ? '📦 Hidden Patch Dependency' : sig}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Scoring Attribution & Audit Receipt (Progressive Disclosure) */}
        {node.waterfallReceipt && activeLens !== 'developer' && (
          <details className={`group rounded-xl border p-3.5 text-xs transition-colors ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <summary className="cursor-pointer font-semibold flex items-center justify-between text-slate-800 dark:text-slate-200 select-none">
              <span className="flex items-center gap-2">
                <Calculator className="w-3.5 h-3.5 text-blue-500" />
                <span>Scoring Breakdown & Attribution</span>
              </span>
              <span className="text-[10px] text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-3">
              <RiskWaterfall mode="additive" node={node} />
            </div>
          </details>
        )}

        {/* ========================================================= */}
        {/* 1. EXECUTIVE / CISO LENS VIEW                             */}
        {/* ========================================================= */}
        {activeLens === 'ciso' && (
          <>
            {/* Financial Blast Radius Card */}
            <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-purple-950/20 border-purple-900/40'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    isLight ? 'text-purple-900' : 'text-purple-200'
                  }`}>
                    Financial exposure
                  </span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  node.tier1Reach > 0 
                    ? isLight ? 'bg-red-100 text-red-700' : 'bg-red-950/60 text-red-400'
                    : isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-950/60 text-emerald-400'
                }`}>
                  {node.tier1Reach > 0 ? 'High Financial Impact' : 'Standard Exposure'}
                </span>
              </div>

              {/* CISO Infection Vectors Row */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono flex-wrap">
                <span className={`text-[10px] uppercase font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Infection Vectors:</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1 ${
                  isLight ? 'bg-cyan-50 text-cyan-800 border-cyan-200' : 'bg-cyan-950/60 text-cyan-300 border-cyan-800'
                }`}>
                  <Zap className="w-2.5 h-2.5 text-cyan-500 fill-cyan-500" />
                  Runtime In-Memory RPC
                </span>
                {(node.id === 'snakeyaml' || node.category === 'keystone') && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1 ${
                    isLight ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-amber-950/60 text-amber-300 border-amber-800'
                  }`}>
                    <Hammer className="w-2.5 h-2.5 text-amber-500" />
                    CI/CD Toolchain Hook
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className={`p-3 rounded-md border ${
                  isLight ? 'bg-white border-purple-100 shadow-xs' : 'bg-slate-950/80 border-purple-900/40'
                }`}>
                  <span className={`text-[10px] uppercase font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Est. Outage Exposure
                  </span>
                  <div className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-0.5">
                    ${dailyExposureMillions}M<span className="text-xs font-normal text-slate-500">/day</span>
                  </div>
                  <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                    Based on {node.tier1Reach} critical services
                  </span>
                </div>

                <div className={`p-3 rounded-md border ${
                  isLight ? 'bg-white border-purple-100 shadow-xs' : 'bg-slate-950/80 border-purple-900/40'
                }`}>
                  <span className={`text-[10px] uppercase font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Annual Loss Expectancy
                  </span>
                  <div className={`text-xl font-bold font-mono mt-0.5 ${
                    isLight ? 'text-slate-900' : 'text-slate-100'
                  }`}>
                    ${annualLossExpectancy}M
                  </div>
                  <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                    Risk-weighted probability
                  </span>
                </div>
              </div>

              <div className={`text-xs leading-relaxed p-2 rounded ${
                isLight ? 'bg-purple-100/50 text-purple-900' : 'bg-purple-950/50 text-purple-200'
              }`}>
                A breach or denial of service in this node compromises {node.dependents} downstream services and reaches critical production revenue sinks.
              </div>
            </div>

            {/* Regulatory Compliance Exposure */}
            <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <FileCheck2 className={`w-4 h-4 ${isLight ? 'text-slate-700' : 'text-slate-300'}`} />
                  <span className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Regulatory & Compliance Scopes
                  </span>
                </div>
                <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  4 Audit Frameworks
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className={`p-2.5 rounded-md border flex items-center justify-between ${
                  node.tier1Reach > 0
                    ? isLight ? 'bg-red-50/50 border-red-200' : 'bg-red-950/20 border-red-900/40'
                    : isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div>
                    <div className="text-xs font-semibold">DORA (EU) — Article 28</div>
                    <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Critical ICT Third-Party Sub-dependency
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    node.tier1Reach > 0
                      ? isLight ? 'bg-red-100 text-red-700' : 'bg-red-900/60 text-red-300'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {node.tier1Reach > 0 ? 'AUDIT MANDATE' : 'COMPLIANT'}
                  </span>
                </div>

                <div className={`p-2.5 rounded-md border flex items-center justify-between ${
                  node.tier1Reach >= 2
                    ? isLight ? 'bg-amber-50/50 border-amber-200' : 'bg-amber-950/20 border-amber-900/40'
                    : isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div>
                    <div className="text-xs font-semibold">PCI-DSS v4.0 — Req 6.3</div>
                    <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Cardholder Data Environment Reachability
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    node.tier1Reach >= 2
                      ? isLight ? 'bg-amber-100 text-amber-700' : 'bg-amber-950/20 border-amber-900/40'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {node.tier1Reach >= 2 ? 'AT RISK' : 'INSULATED'}
                  </span>
                </div>

                <div className={`p-2.5 rounded-md border flex items-center justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div>
                    <div className="text-xs font-semibold">SEC Cyber Rule 106</div>
                    <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Material Incident Threshold
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    node.systemicScore >= 75
                      ? isLight ? 'bg-red-100 text-red-700' : 'bg-red-900/60 text-red-300'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {node.systemicScore >= 75 ? 'DISCLOSURE REQUIRED' : 'NORMAL'}
                  </span>
                </div>
              </div>
            </div>

            {/* SIFI Systemic Contagion Metric */}
            <div className={`p-4 rounded-xl border flex flex-col gap-2.5 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Portfolio concentration
                </span>
                <span className={`text-xs font-mono font-bold ${
                  node.systemicScore >= 80 ? 'text-red-600' : 'text-amber-600'
                }`}>
                  {node.systemicScore >= 80 ? 'Critical concentration' : 'Moderate concentration'}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    node.systemicScore >= 80 ? 'bg-red-600' : 'bg-amber-500'
                  }`}
                  style={{ width: `${node.systemicScore}%` }}
                />
              </div>
              <div className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {node.summary}
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* 2. APPSEC / DEVELOPER LENS VIEW (DEFAULT)                 */}
        {/* ========================================================= */}
        {activeLens === 'developer' && (
          <details className={`group rounded-xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-800'
          }`}>
            <summary className="cursor-pointer list-none p-3.5 flex items-center justify-between gap-3 select-none">
              <div>
                <span className={`block text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Technical investigation</span>
                <span className={`mt-0.5 block text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>View scoring, package health, release signals, and detailed evidence.</span>
              </div>
              <span className={`text-xs transition-transform group-open:rotate-180 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>⌄</span>
            </summary>
            <div className="border-t border-slate-200 p-3.5 pt-4 dark:border-slate-800 flex flex-col gap-4">
            <section className={`rounded-lg border p-3.5 ${
              node.structuralRisk === 'critical'
                ? isLight ? 'border-red-200 bg-red-50/50' : 'border-red-900/50 bg-red-950/20'
                : isLight ? 'border-slate-200 bg-white' : 'border-slate-900 bg-slate-900/40'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Why this matters</h3>
                  <p className={`mt-1 text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {node.articulationPoint
                      ? 'This dependency has no safe alternate route, so a failure could interrupt connected services.'
                      : 'Keystone found alternate routes, reducing the chance that this dependency alone interrupts service.'}
                  </p>
                </div>
                <span className={`shrink-0 text-xs font-semibold ${
                  structuralDangerScore >= 80 ? 'text-red-600 dark:text-red-400' : structuralDangerScore >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {structuralDangerScore >= 80 ? 'Critical' : structuralDangerScore >= 50 ? 'Elevated' : 'Normal'}
                </span>
              </div>
              <div className={`mt-3 flex items-center gap-4 border-t pt-3 text-xs ${isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'}`}>
                <span><strong className={isLight ? 'text-slate-900' : 'text-slate-100'}>{node.dependents}</strong> affected services</span>
                <span><strong className={node.tier1Reach > 0 ? 'text-red-600 dark:text-red-400' : isLight ? 'text-slate-900' : 'text-slate-100'}>{node.tier1Reach}</strong> critical services</span>
              </div>
            </section>

            {/* F4 XZ Radar: Support Divergence Deficit Barometer (PDI) */}
            <SupportDivergenceCard node={node} />

            {/* F4/F5 Release Anomaly Inspector (Stealth ΔC+ Capability Drift) */}
            <ReleaseAnomalyDiff node={node} />

            {/* F6 Resolver Permeability Lab (4D Vector & Scope Verification) */}
            <ResolverPermeabilityPanel node={node} />

            {/* F8 Dual Infection Channels & Permeability Card */}
            <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/70 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    isLight ? 'text-slate-800' : 'text-slate-200'
                  }`}>
                    Execution Channel Reachability
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                  node.id === 'snakeyaml' || node.category === 'keystone'
                    ? isLight ? 'bg-red-100 text-red-800 border-red-300' : 'bg-red-950/60 text-red-300 border-red-800'
                    : isLight ? 'bg-cyan-100 text-cyan-800 border-cyan-300' : 'bg-cyan-950/60 text-cyan-300 border-cyan-800'
                }`}>
                  {node.id === 'snakeyaml' || node.category === 'keystone' ? 'Dual-Channel Vector' : 'Runtime Vector'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Runtime Vector */}
                <div className={`p-2.5 rounded-md border flex flex-col justify-between ${
                  isLight ? 'bg-white border-cyan-200' : 'bg-slate-950/80 border-cyan-900/40'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold flex items-center gap-1 text-cyan-700 dark:text-cyan-300 text-[11px]">
                        <Zap className="w-3 h-3 text-cyan-500 fill-cyan-500" />
                        Runtime RPC
                      </span>
                      <span className="text-[9px] font-bold text-emerald-600 uppercase">ACTIVE</span>
                    </div>
                    <div className={`text-[10px] leading-tight ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      In-memory execution calls reach {node.tier1Reach} critical production services.
                    </div>
                  </div>
                  <div className={`text-[9px] font-mono mt-2 pt-1 border-t ${isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-500'}`}>
                    Reachability: 1.0 (Direct)
                  </div>
                </div>

                {/* Build-Time Vector */}
                <div className={`p-2.5 rounded-md border flex flex-col justify-between ${
                  node.id === 'snakeyaml' || node.category === 'keystone'
                    ? isLight ? 'bg-white border-amber-200' : 'bg-slate-950/80 border-amber-900/40'
                    : isLight ? 'bg-white border-slate-200 opacity-80' : 'bg-slate-950/80 border-slate-800 opacity-80'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold flex items-center gap-1 text-amber-700 dark:text-amber-300 text-[11px]">
                        <Hammer className="w-3 h-3 text-amber-500" />
                        Build-Time CI/CD
                      </span>
                      <span className={`text-[9px] font-bold uppercase ${
                        node.id === 'snakeyaml' || node.category === 'keystone' ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        {node.id === 'snakeyaml' || node.category === 'keystone' ? 'HOOK VECTOR' : 'SHIELDED'}
                      </span>
                    </div>
                    <div className={`text-[10px] leading-tight ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {node.id === 'snakeyaml' || node.category === 'keystone'
                        ? 'Pre-install lifecycle scripts inject backdoor into compiled artifacts during CI/CD.'
                        : 'No active lifecycle scripts; locked lockfiles halt contagion at repo boundary.'}
                    </div>
                  </div>
                  <div className={`text-[9px] font-mono mt-2 pt-1 border-t ${isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-500'}`}>
                    {node.id === 'snakeyaml' || node.category === 'keystone' ? 'Evades Runtime Scanners' : 'Strict Lockfile Pinned'}
                  </div>
                </div>
              </div>

              {/* Dual-Vector Footnote */}
              <div className={`text-[10px] leading-relaxed p-2 rounded border ${
                isLight ? 'bg-cyan-50/50 border-cyan-100 text-cyan-950' : 'bg-cyan-950/20 border-cyan-900/30 text-cyan-300'
              }`}>
                <strong>Dual-Channel Isolation: </strong>
                Tracks build-time ingestion pipelines independently from runtime execution flow.
              </div>
            </div>

            {/* Three-Layer Triage & Signal Quality Stack */}
            <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/70 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    isLight ? 'text-slate-900' : 'text-slate-100'
                  }`}>
                    Triage & Signal Quality Filter
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                  (node.reachabilityMultiplier || 1.0) === 0.1
                    ? isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                    : isLight ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-blue-950/60 text-blue-300 border-blue-800'
                }`}>
                  {(node.reachabilityMultiplier || 1.0) === 0.1 ? '🛡️ -90% Noise Suppressed' : 'Active Triage Gated'}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {/* Layer 1: Structural Reachability Multiplier */}
                <div className={`p-2.5 rounded-md border flex items-start justify-between gap-2 ${
                  (node.reachabilityMultiplier || 1.0) === 0.1
                    ? isLight ? 'bg-emerald-50/70 border-emerald-200' : 'bg-emerald-950/30 border-emerald-900/40'
                    : isLight ? 'bg-white border-slate-200' : 'bg-slate-950/80 border-slate-800'
                }`}>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Layer 1:</span>
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">Structural Reachability Heuristic</span>
                    </div>
                    <div className={`text-[11px] mt-0.5 leading-snug ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {(node.reachabilityMultiplier || 1.0) === 0.1
                        ? 'Dead code detection: Package is linked in lockfile but vulnerable AST methods are uninvoked in production. Reachability multiplier clamped to 0.1.'
                        : (node.reachabilityMultiplier || 1.0) === 0.5
                        ? 'Potentially reachable: Linked in active package boundary; method-level call path unverified.'
                        : 'Confirmed execution path: Dynamic call-graph confirms active runtime invocation from application handlers.'}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                      (node.reachabilityMultiplier || 1.0) === 0.1
                        ? isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : (node.reachabilityMultiplier || 1.0) === 0.5
                        ? isLight ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-950 text-amber-300 border-amber-700'
                        : isLight ? 'bg-slate-100 text-slate-800 border-slate-300' : 'bg-slate-800 text-slate-200 border-slate-700'
                    }`}>
                      {node.reachabilityMultiplier ? `${node.reachabilityMultiplier}× Multiplier` : '1.0× Reachable'}
                    </span>
                    <div className="text-[9px] text-slate-500 mt-1 uppercase font-semibold">
                      {node.reachabilityStatus === 'UNREACHABLE_DEAD_CODE' ? 'Dead Code Suppressed' : node.reachabilityStatus === 'POTENTIALLY_REACHABLE' ? 'Unverified Path' : 'Direct Call Path'}
                    </div>
                  </div>
                </div>

                {/* Layer 2: Dual Channel Gating */}
                <div className={`p-2.5 rounded-md border flex items-start justify-between gap-2 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-950/80 border-slate-800'
                }`}>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Layer 2:</span>
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">Dual-Channel Execution Gating</span>
                    </div>
                    <div className={`text-[11px] mt-0.5 leading-snug ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Zero cross-contamination between channels: Build-time lifecycle risks only trigger CI/CD breaker directives, eliminating runtime triage false alarms.
                    </div>
                  </div>
                  <span className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${
                    isLight ? 'bg-cyan-50 text-cyan-800 border-cyan-200' : 'bg-cyan-950/60 text-cyan-300 border-cyan-800'
                  }`}>
                    Gated Channels
                  </span>
                </div>

                {/* Layer 3: CycloneDX VEX Ingestion */}
                <div className={`p-2.5 rounded-md border flex items-start justify-between gap-2 ${
                  node.vexStatus === 'not_affected'
                    ? isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-emerald-950/20 border-emerald-900/40'
                    : isLight ? 'bg-white border-slate-200' : 'bg-slate-950/80 border-slate-800'
                }`}>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Layer 3:</span>
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">CycloneDX SBOM VEX Ingestion</span>
                    </div>
                    <div className={`text-[11px] mt-0.5 leading-snug ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {node.vexJustification || 'Ingests formal machine-readable VEX statements from upstream maintainers to suppress non-exploitable CVE declarations.'}
                    </div>
                  </div>
                  <span className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded border uppercase shrink-0 ${
                    node.vexStatus === 'not_affected'
                      ? isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : node.vexStatus === 'affected'
                      ? isLight ? 'bg-red-100 text-red-800 border-red-300' : 'bg-red-950 text-red-300 border-red-700'
                      : isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    VEX: {node.vexStatus || 'INSPECTED'}
                  </span>
                </div>
              </div>

              {/* Noise Reduction Proof Banner */}
              <div className={`p-2.5 rounded-md text-[10px] leading-relaxed border ${
                isLight ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-emerald-950/30 border-emerald-900/40 text-emerald-200'
              }`}>
                <strong>Signal Filtration: </strong>
                Suppresses uninvoked dead code and non-exploitable dependencies using structural reachability, channel boundaries, and VEX statements.
              </div>
            </div>

            {/* F11 Impact Concentration Index Card */}
            {(() => {
              const concentrationRatio = node.impactConcentrationRatio !== undefined 
                ? node.impactConcentrationRatio 
                : (node.dependents >= 15 ? 0.88 : node.dependents >= 8 ? 0.74 : node.dependents >= 3 ? 0.42 : 0.12);
              const horizontalSpread = Math.round(concentrationRatio * 100);
              const verticalDepth = 100 - horizontalSpread;
              const isSystemic = concentrationRatio >= 0.65;

              return (
                <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-all ${
                  isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/70 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-amber-500" />
                      <span className={`text-xs font-semibold uppercase tracking-wider ${
                        isLight ? 'text-slate-900' : 'text-slate-100'
                      }`}>
                        Impact Concentration Index
                      </span>
                    </div>
                    <span className="font-mono font-bold text-xs text-red-600 dark:text-red-400">
                      {concentrationRatio.toFixed(2)} / 1.00 HICI
                    </span>
                  </div>

                  {/* Horizontal vs Vertical Split Bar */}
                  <div className="flex flex-col gap-1.5">
                    <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <div 
                        style={{ width: `${horizontalSpread}%` }} 
                        className={`h-full transition-all duration-500 ${
                          isSystemic 
                            ? 'bg-gradient-to-r from-amber-500 to-red-600' 
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                        }`}
                        title={`Horizontal Spread: ${horizontalSpread}%`}
                      />
                      <div 
                        style={{ width: `${verticalDepth}%` }} 
                        className="bg-slate-400 dark:bg-slate-600 h-full transition-all duration-500"
                        title={`Vertical Depth: ${verticalDepth}%`}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] font-mono">
                      <span className={isSystemic ? 'text-red-600 dark:text-red-400 font-bold' : 'text-cyan-600 font-bold'}>
                        ↔ Horizontal Spread: {horizontalSpread}% ({node.dependents} downstream services)
                      </span>
                      <span className="text-slate-500">
                        ↕ Vertical Monolith Depth: {verticalDepth}%
                      </span>
                    </div>
                  </div>

                  {/* Classification Pill + Concentration Explanation */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      isSystemic
                        ? isLight ? 'bg-red-100 text-red-800 border-red-300' : 'bg-red-950/60 text-red-300 border-red-800'
                        : isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                    }`}>
                      {isSystemic ? 'Systemic Multi-Service Risk' : 'Contained Service Risk'}
                    </span>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Concentration Metric
                    </span>
                  </div>

                  <p className={`text-[10px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {isSystemic 
                      ? `Contagion spreads horizontally across ${node.dependents} distinct microservices into ${node.tier1Reach} critical services.`
                      : 'Risk is concentrated within isolated local modules with low cross-repository propagation probability.'}
                  </p>
                </div>
              );
            })()}

            {/* F5 Centrality Velocity & Trend Analysis Card */}
            <CentralityVelocityCard node={node} />

            {/* Risk Comparison: Conventional Score vs Systemic Risk */}
            <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className={`text-[11px] font-semibold flex items-center justify-between ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                <span>Risk Evaluation</span>
                <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Package score vs. service impact</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Conventional Score */}
                <div className={`p-2.5 rounded-md border flex flex-col gap-1 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-950/80 border-slate-800'
                }`}>
                  <div className={`text-[10px] uppercase font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Conventional CVSS</div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-xl font-bold font-mono ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>{node.conventionalScore}</span>
                    <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>/ 100</span>
                  </div>
                  <div className={`text-[10px] font-semibold uppercase ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                    {node.conventionalSeverity} Severity
                  </div>
                  <div className={`text-[10px] leading-tight mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Evaluated in isolation without graph topology context.
                  </div>
                </div>

                {/* Systemic Score */}
                <div className={`p-2.5 rounded-md border flex flex-col gap-1 ${
                  isLight ? 'bg-red-50/50 border-red-200' : 'bg-red-950/20 border-red-900/40'
                }`}>
                  <div className={`text-[10px] uppercase font-semibold ${isLight ? 'text-red-800' : 'text-red-300'}`}>Service impact risk</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono text-red-600">{node.systemicScore}</span>
                    <span className={`text-[10px] ${isLight ? 'text-red-600/70' : 'text-red-400/70'}`}>/ 100</span>
                  </div>
                  <div className={`text-[10px] font-semibold uppercase text-red-700 dark:text-red-400`}>
                    {node.structuralRisk} Risk
                  </div>
                  <div className={`text-[10px] leading-tight mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Connects multiple critical sinks with no redundant fallback.
                  </div>
                </div>
              </div>
            </div>

            {/* Key Topological Metrics */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className={`p-2.5 rounded-md border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Dependents</span>
                <div className="text-base font-bold font-mono mt-0.5">{node.dependents}</div>
              </div>
              <div className={`p-2.5 rounded-md border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Critical services</span>
                <div className={`text-base font-bold font-mono mt-0.5 ${node.tier1Reach > 0 ? 'text-red-600' : ''}`}>
                  {node.tier1Reach}
                </div>
              </div>
              <div className={`p-2.5 rounded-md border ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Centrality</span>
                <div className="text-base font-bold font-mono mt-0.5">
                  {(node.reversePageRank * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* F8 Dual Triage: SSVC Qualitative Decision Tree */}
            <SSVCDecisionTree node={node} />

            <details className={`group rounded-lg border p-3 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <summary className={`cursor-pointer list-none flex items-center justify-between text-xs font-semibold ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                <span>Scoring methodology</span>
                <span className={`transition-transform group-open:rotate-180 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>⌄</span>
              </summary>
              <div className="mt-3 flex flex-col gap-4">
                <RiskWaterfall mode="ore" node={node} />
                <RiskWaterfall mode="additive" node={node} />
              </div>
            </details>
            </div>
          </details>
        )}

        {/* ========================================================= */}
        {/* 3. ENGINEERING / MAINTAINER LENS VIEW                     */}
        {/* ========================================================= */}
        {activeLens === 'maintainer' && (
          <>
            {/* Downstream Consumer Intelligence Card */}
            <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-blue-950/20 border-blue-900/40'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    isLight ? 'text-blue-900' : 'text-blue-200'
                  }`}>
                    Downstream Consumer Blast
                  </span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  node.dependents > 15
                    ? isLight ? 'bg-amber-100 text-amber-800' : 'bg-amber-950/60 text-amber-300'
                    : isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
                }`}>
                  {node.dependents > 15 ? 'High Blast Radius' : 'Moderate Radius'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-1 text-center">
                <div className={`p-2.5 rounded-md border ${
                  isLight ? 'bg-white border-blue-100 shadow-xs' : 'bg-slate-950/80 border-blue-900/40'
                }`}>
                  <span className={`text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Downstream Repos
                  </span>
                  <div className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                    {node.dependents}
                  </div>
                </div>

                <div className={`p-2.5 rounded-md border ${
                  isLight ? 'bg-white border-blue-100 shadow-xs' : 'bg-slate-950/80 border-blue-900/40'
                }`}>
                  <span className={`text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Weekly Downloads
                  </span>
                  <div className={`text-lg font-bold font-mono mt-0.5 ${
                    isLight ? 'text-slate-900' : 'text-slate-100'
                  }`}>
                    {node.weeklyDownloads || '450K'}
                  </div>
                </div>

                <div className={`p-2.5 rounded-md border ${
                  isLight ? 'bg-white border-blue-100 shadow-xs' : 'bg-slate-950/80 border-blue-900/40'
                }`}>
                  <span className={`text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Maintainers
                  </span>
                  <div className={`text-lg font-bold font-mono mt-0.5 ${
                    node.maintainers <= 2 ? 'text-red-600' : isLight ? 'text-slate-900' : 'text-slate-100'
                  }`}>
                    {node.maintainers}
                  </div>
                </div>
              </div>

              {/* Bus Factor Warning */}
              {node.maintainers <= 2 && (
                <div className={`p-2.5 rounded-md border flex items-start gap-2 ${
                  isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-950/30 border-amber-900/50 text-amber-200'
                }`}>
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold">Bus Factor Fragility: </span>
                    Only {node.maintainers} active maintainer(s). If an API contract breaks or maintenance halts, {node.dependents} internal services are stranded.
                  </div>
                </div>
              )}
            </div>

            {/* Who breaks if I change this API? */}
            <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Downstream API Compatibility Impact
                </span>
                <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  SemVer Blast Analysis
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className={`p-2.5 rounded-md border text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between font-semibold">
                    <span>Direct Downstream Importers</span>
                    <span className="font-mono text-blue-600">Tier 2 Platform</span>
                  </div>
                  <div className={`text-[11px] mt-1 font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    • internal-data-pipeline (v2.4.0)<br />
                    • kafka-broker-gateway (v1.2.0)<br />
                    • telemetry-collector (v0.9.1)
                  </div>
                </div>

                <div className={`p-2.5 rounded-md border text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between font-semibold">
                    <span>Indirect Production Sinks</span>
                    <span className="font-mono text-red-600">Critical Services</span>
                  </div>
                  <div className={`text-[11px] mt-1 font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    • Payment Gateway Core<br />
                    • Auth & IAM Token Service<br />
                    • Order Processing Dispatcher
                  </div>
                </div>
              </div>

              <div className={`p-2.5 rounded-md text-xs leading-relaxed border ${
                isLight ? 'bg-blue-50/50 border-blue-200 text-blue-900' : 'bg-blue-950/30 border-blue-900/40 text-blue-200'
              }`}>
                <strong>Recommended SemVer Policy:</strong> Publish fix as a zero-breaking patch. Any signature alteration requires synchronized updates across {node.dependents} consumer repositories.
              </div>
            </div>
          </>
        )}

          </>
        )}
      </div>

      {/* Action Footer - Conditional based on activeLens */}
      <div className={`p-4 border-t flex flex-col gap-2.5 shrink-0 ${
        isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-950/40'
      }`}>
        {/* CISO Actions */}
        {activeLens === 'ciso' && (
          <>
            <button
              onClick={() => onStartSimulation(node.id)}
              className={`w-full py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                isLight 
                  ? 'bg-purple-900 hover:bg-purple-800 text-white' 
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Authorize Emergency Mitigation Mandate</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onFreezeCircuitBreaker(node.id)}
                className={`py-2 px-2.5 rounded-md text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                  isCircuitBreakerFrozen
                    ? isLight ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-amber-950/40 text-amber-300 border-amber-800/50'
                    : isLight ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>{isCircuitBreakerFrozen ? 'Quarantined' : 'Quarantine Dependency'}</span>
              </button>

              <button
                onClick={() => setBriefingExported(true)}
                className={`py-2 px-2.5 rounded-md text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                  briefingExported
                    ? isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                    : isLight ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                <span>{briefingExported ? 'Briefing Ready' : 'Export Briefing'}</span>
              </button>
            </div>
          </>
        )}

        {/* Developer Actions */}
        {activeLens === 'developer' && (
          <>
            <button
              onClick={() => onStartSimulation(node.id)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all bg-[#2f2fe4] hover:bg-[#4343f8] text-white shadow-xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>
                {node.id === 'snakeyaml' || node.articulationPoint || node.category === 'keystone'
                  ? 'Review recommended fix'
                  : 'Simulate impact'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onFreezeCircuitBreaker(node.id)}
              className={`w-full py-2 px-3 rounded-md text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                isCircuitBreakerFrozen
                  ? isLight ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-amber-950/40 text-amber-300 border-amber-800/50'
                  : isLight ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>{isCircuitBreakerFrozen ? 'Dependency Quarantined' : 'Quarantine Dependency'}</span>
            </button>
          </>
        )}

        {/* Maintainer Actions */}
        {activeLens === 'maintainer' && (
          <>
            <button
              onClick={() => onStartSimulation(node.id)}
              className={`w-full py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                isLight 
                  ? 'bg-blue-900 hover:bg-blue-800 text-white' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Simulate compatibility impact</span>
            </button>

            <button
              onClick={() => onFreezeCircuitBreaker(node.id)}
              className={`w-full py-2 px-3 rounded-md text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                isCircuitBreakerFrozen
                  ? isLight ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-amber-950/40 text-amber-300 border-amber-800/50'
                  : isLight ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>{isCircuitBreakerFrozen ? 'CI/CD Ingestion Locked' : 'Audit Downstream Consumers'}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
