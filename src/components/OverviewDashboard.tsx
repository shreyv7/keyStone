import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Layers, 
  ArrowRight, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Play,
  FileSpreadsheet,
  Briefcase,
  Terminal,
  DollarSign,
  Building2,
  FileCheck2,
  Users,
  ShieldCheck,
  Lock,
  GitPullRequest,
  BarChart3,
  UploadCloud,
  TreePine,
  Scale,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { KeystoneStats, EcosystemNode, RoleLens } from '../types';
import { useTheme } from '../context/ThemeContext';
import { RiskQuadrantScatter } from './RiskQuadrantScatter';
import { DominatorLeaderboard } from './DominatorLeaderboard';
import { PortfolioRiskTrendChart } from './PortfolioRiskTrendChart';
import { ReportExportModal } from './ReportExportModal';
import { OnboardingEmptyState } from './OnboardingEmptyState';
import { Download, LayoutTemplate } from 'lucide-react';

interface OverviewDashboardProps {
  stats: KeystoneStats;
  nodes?: EcosystemNode[];
  topRisks?: EcosystemNode[];
  activeLens?: RoleLens;
  onSelectNode: (nodeId: string) => void;
  onGoToEcosystem?: () => void;
  onLaunchHeroDemo?: () => void;
  onStartDemoScenario?: () => void;
  onOpenPRModal?: () => void;
  onOpenRiskWatchlist?: () => void;
  onOpenSBOMModal?: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  stats,
  nodes = [],
  topRisks,
  activeLens = 'developer',
  onSelectNode,
  onGoToEcosystem,
  onLaunchHeroDemo,
  onStartDemoScenario,
  onOpenPRModal,
  onOpenRiskWatchlist,
  onOpenSBOMModal
}) => {
  const { isLight } = useTheme();
  const [rightPanelTab, setRightPanelTab] = useState<'quadrant' | 'dominator' | 'lens_matrix'>('quadrant');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPreviewEmptyState, setIsPreviewEmptyState] = useState(false);
  const [expandedBriefingId, setExpandedBriefingId] = useState<string | null>('snakeyaml');

  // Filter severe support divergence chokepoints (PDI >= 70%)
  const severeDivergenceNodes = useMemo(() => {
    return nodes.filter(n => (n.pdiScore !== undefined && n.pdiScore >= 70) || (n.systemicScore >= 75 && n.maintainers <= 1));
  }, [nodes]);

  // Combine topRisks or nodes safely
  const riskList = useMemo(() => {
    const list = topRisks && topRisks.length > 0 ? topRisks : nodes;
    return [...list].sort((a, b) => b.systemicScore - a.systemicScore).slice(0, 5);
  }, [topRisks, nodes]);

  const handleHeroAction = () => {
    if (onLaunchHeroDemo) onLaunchHeroDemo();
    else if (onStartDemoScenario) onStartDemoScenario();
    else if (onGoToEcosystem) onGoToEcosystem();
  };

  return (
    <div className={`absolute inset-0 z-20 backdrop-blur-md p-8 flex flex-col gap-6 overflow-y-auto select-none ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#080616]/95 text-slate-100'
    }`}>
      {/* Header */}
      <div className={`flex items-start justify-between border-b pb-5 ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded border ${
              isLight 
                ? 'bg-slate-100 text-slate-700 border-slate-200' 
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              Portfolio Posture
            </span>

            {/* Active Lens Badge */}
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded uppercase flex items-center gap-1 border ${
              activeLens === 'ciso'
                ? isLight ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-purple-950/40 text-purple-300 border-purple-800/50'
                : activeLens === 'maintainer'
                ? isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-950/40 text-blue-300 border-blue-800/50'
                : isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
            }`}>
              {activeLens === 'ciso' && <Briefcase className="w-3 h-3" />}
              {activeLens === 'developer' && <Terminal className="w-3 h-3" />}
              {activeLens === 'maintainer' && <Layers className="w-3 h-3" />}
              {activeLens === 'ciso' ? 'Executive (CISO) Lens' : activeLens === 'maintainer' ? 'Engineering (Maintainer) Lens' : 'AppSec (Developer) Lens'}
            </span>

            <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {activeLens === 'ciso' 
                ? 'Financial Exposure & Regulatory Compliance Posture' 
                : activeLens === 'maintainer'
                ? 'Downstream Consumer Cascade & Bus Factor Vulnerabilities'
                : 'Deterministic Topological Risk Analysis'}
            </span>
          </div>

          <h1 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            {activeLens === 'ciso' 
              ? 'Executive Supply Chain Risk Governance' 
              : activeLens === 'maintainer'
              ? 'Ecosystem Dependency & Consumer Health'
              : 'Supply Chain Structural Risk Overview'}
          </h1>
          <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {activeLens === 'ciso'
              ? 'Quantifies enterprise exposure in $-denominated potential daily loss, regulatory non-compliance mandates (DORA, PCI-DSS), and systemic contagion ratios across critical assets.'
              : activeLens === 'maintainer'
              ? 'Analyzes downstream breaking change cascades, library maintenance health, and single-point-of-failure packages before API contract updates are released.'
              : 'Prioritizes open source and internal dependencies by structural network position, reachability to production sinks, and articulation chokepoints.'}
          </p>
        </div>

        {/* Global Action CTA */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleHeroAction}
            className={`px-4 py-2 rounded-md font-medium text-xs transition-colors flex items-center gap-2 ${
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
                <span>Simulate Keystone Financial Outage</span>
              </>
            ) : activeLens === 'maintainer' ? (
              <>
                <Layers className="w-3.5 h-3.5" />
                <span>Simulate Downstream API Cascade</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Keystone Attack</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenPRModal}
            className={`px-3.5 py-2 rounded-md text-xs font-medium border transition-colors flex items-center gap-2 ${
              isLight 
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs' 
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {activeLens === 'ciso' ? 'CISO Audit Manifest' : activeLens === 'maintainer' ? 'Renovate / Dependabot PRs' : 'Remediation Manifest'}
            </span>
          </button>

          {onOpenSBOMModal && (
            <button
              onClick={onOpenSBOMModal}
              className={`px-3.5 py-2 rounded-md text-xs font-medium border transition-colors flex items-center gap-2 ${
                isLight 
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs' 
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
              }`}
              title="Connect Repository / Upload CycloneDX SBOM or Lockfile"
            >
              <UploadCloud className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Ingest SBOM / Lock</span>
            </button>
          )}

          <button
            onClick={() => setIsExportModalOpen(true)}
            className={`px-3.5 py-2 rounded-md text-xs font-medium border transition-colors flex items-center gap-2 cursor-pointer ${
              isLight 
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs' 
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
            }`}
            title="Export Systemic Risk & Compliance Report (Markdown, JSON, CSV)"
          >
            <Download className="w-3.5 h-3.5 text-cyan-500" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => setIsPreviewEmptyState(prev => !prev)}
            className={`px-3 py-2 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isPreviewEmptyState
                ? 'bg-amber-500/20 text-amber-500 border-amber-500/40 font-semibold'
                : isLight
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
            }`}
            title="Toggle Enterprise Onboarding / Empty State Preview"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-amber-500" />
            <span>{isPreviewEmptyState ? 'Exit Empty Preview' : 'Preview Empty State'}</span>
          </button>
        </div>
      </div>

      {nodes.length === 0 || isPreviewEmptyState ? (
        <OnboardingEmptyState
          onOpenSBOMModal={onOpenSBOMModal}
          onLoadDemoData={() => setIsPreviewEmptyState(false)}
        />
      ) : (
        <>

      {/* Critical Alert Callout */}
      <div className={`p-4 rounded-lg border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        activeLens === 'ciso'
          ? isLight ? 'bg-purple-50/70 border-purple-200 text-purple-950' : 'bg-purple-950/20 border-purple-900/50 text-purple-200'
          : isLight ? 'bg-red-50/50 border-red-200 text-red-900' : 'bg-red-950/20 border-red-900/50 text-red-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-md shrink-0 ${
            activeLens === 'ciso'
              ? isLight ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/40 text-purple-300'
              : isLight ? 'bg-red-100 text-red-700' : 'bg-red-900/40 text-red-400'
          }`}>
            {activeLens === 'ciso' ? <DollarSign className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">
              <span>{activeLens === 'ciso' ? 'Systemic Financial Exposure Alert:' : 'Critical Articulation Point Identified:'}</span>
              <code className="font-mono px-1.5 py-0.5 rounded text-xs bg-white/80 dark:bg-black/40 font-bold">snakeyaml@1.33</code>
            </div>
            <p className="text-xs mt-1 leading-relaxed opacity-90">
              {activeLens === 'ciso'
                ? 'Single transitive dependency creates an estimated $85M/day financial exposure across 21 revenue services and 4 regulated PCI/DORA Tier-1 sinks. Immediate remediation mandate recommended.'
                : activeLens === 'maintainer'
                ? 'Package has only 1 primary maintainer while serving as an un-mocked transitive dependency for 21 internal repositories. High risk of abandonment or uncoordinated breaking changes.'
                : 'A single transitive dependency connects 21 downstream services into 4 regulated Tier-1 assets. A targeted update to internal-data-pipeline severs all active attack vectors.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectNode('snakeyaml')}
          className={`shrink-0 px-3.5 py-1.5 rounded-md text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
            activeLens === 'ciso'
              ? isLight ? 'bg-white hover:bg-purple-50 text-purple-800 border-purple-200 shadow-xs' : 'bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 border-purple-700/50'
              : isLight ? 'bg-white hover:bg-red-50 text-red-800 border-red-200 shadow-xs' : 'bg-red-900/40 hover:bg-red-900/60 text-red-200 border-red-700/50'
          }`}
        >
          <span>{activeLens === 'ciso' ? 'Review Exposure' : 'Inspect Node'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Cards (Role-Specific) */}
      {activeLens === 'ciso' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg border flex flex-col ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Est. Financial Exposure</span>
            <span className="text-2xl font-bold font-mono mt-1 text-purple-600 dark:text-purple-400">$85.0M<span className="text-xs font-normal text-slate-500">/day</span></span>
            <span className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Cumulative outage risk</span>
          </div>

          <div className={`p-4 rounded-lg border flex flex-col ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>SIFI Concentration Ratio</span>
            <span className={`text-2xl font-bold font-mono mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>81.4%</span>
            <span className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Concentrated in top 5 keystones</span>
          </div>

          <div className={`p-4 rounded-lg border flex flex-col ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>DORA / PCI Non-Compliance</span>
            <span className="text-2xl font-bold font-mono mt-1 text-red-600">4 Sinks</span>
            <span className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Article 28 third-party scope</span>
          </div>

          <div className={`p-4 rounded-lg border flex flex-col ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Cyber Insurability Grade</span>
            <span className={`text-2xl font-bold font-mono mt-1 text-amber-600`}>B- (Risk Action)</span>
            <span className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Underwriting renewal alert</span>
          </div>
        </div>
      ) : activeLens === 'maintainer' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg border flex flex-col ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Downstream Repos at Risk</span>
            <span className="text-2xl font-bold font-mono mt-1 text-blue-600 dark:text-blue-400">21 Services</span>
            <span className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Transitive breaking cascade</span>
          </div>

          <div className={`p-4 rounded-lg border flex flex-col ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Bus Factor Fragile Libs</span>
            <span className="text-2xl font-bold font-mono mt-1 text-red-600">3 Packages</span>
            <span className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>≤ 2 active maintainers</span>
          </div>

          <div className={`p-4 rounded-lg border flex flex-col ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Weekly Ecosystem Pulls</span>
            <span className={`text-2xl font-bold font-mono mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>125M+</span>
            <span className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Across shared packages</span>
          </div>

          <div className={`p-4 rounded-lg border flex flex-col ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Max Transitive Depth</span>
            <span className={`text-2xl font-bold font-mono mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>5 Layers</span>
            <span className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Indirect inheritance depth</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg border flex flex-col ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Dependencies Analyzed</span>
            <span className={`text-2xl font-bold font-mono mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              {nodes.length > 0 ? nodes.length : stats.repositories * 3}
            </span>
            <span className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{stats.repositories || 42} service repositories</span>
          </div>

          <div className={`p-4 rounded-lg border flex flex-col ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Critical Chokepoints</span>
            <span className={`text-2xl font-bold font-mono mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{stats.criticalDependencies}</span>
            <span className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>High reachability & centrality</span>
          </div>

          <div className={`p-4 rounded-lg border flex flex-col ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Tier-1 Assets Exposed</span>
            <span className="text-2xl font-bold font-mono mt-1 text-red-600">{stats.tier1Assets}</span>
            <span className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Mission-critical production sinks</span>
          </div>

          <div className={`p-4 rounded-lg border flex flex-col ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Active Cut-Vertices</span>
            <span className={`text-2xl font-bold font-mono mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{stats.activeStructuralRisks}</span>
            <span className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Single points of failure</span>
          </div>
        </div>
      )}

      {/* Portfolio Risk Trajectory Chart (P3-3) */}
      <PortfolioRiskTrendChart />

      {/* Two Column Layout: Tailored to Active Lens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: Main Ranking Table                           */}
        {/* ========================================================= */}
        <div className={`p-5 rounded-lg border flex flex-col gap-4 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              {activeLens === 'ciso' ? (
                <DollarSign className="w-4 h-4 text-purple-600" />
              ) : activeLens === 'maintainer' ? (
                <Users className="w-4 h-4 text-blue-600" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-red-600" />
              )}
              <span className={`font-semibold text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {activeLens === 'ciso' 
                  ? 'Financial Exposure Ranking (Top 5 Keystones)' 
                  : activeLens === 'maintainer'
                  ? 'Downstream Consumer Cascade Ranking'
                  : 'Top Structural Keystones'}
              </span>
            </div>
            {onOpenRiskWatchlist && (
              <button
                onClick={onOpenRiskWatchlist}
                className={`text-xs font-medium hover:underline flex items-center gap-1 ${
                  isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>View Full Watchlist</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {riskList.map((item, idx) => {
              const dailyExposure = (item.tier1Reach * 18.5 + item.dependents * 1.25).toFixed(1);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectNode(item.id)}
                  className={`p-3 rounded-md border cursor-pointer transition-all flex items-center justify-between group ${
                    isLight 
                      ? 'bg-slate-50/50 hover:bg-slate-100 border-slate-200 hover:border-slate-300' 
                      : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-mono font-medium text-xs w-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-semibold text-xs ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                          {item.name}
                        </span>
                        <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          v{item.version}
                        </span>
                        {item.articulationPoint && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 rounded">
                            CUT-VERTEX
                          </span>
                        )}
                      </div>
                      <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {activeLens === 'ciso'
                          ? `Estimated Financial Risk: $${dailyExposure}M/day • ${item.tier1Reach} Tier-1 Sinks`
                          : activeLens === 'maintainer'
                          ? `${item.dependents} Downstream Repos • ${item.maintainers} Maintainer(s) • ${item.weeklyDownloads} dl/wk`
                          : `${item.dependents} downstream services • ${item.tier1Reach} Tier-1 sinks`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {activeLens === 'ciso' ? (
                        <>
                          <div className="text-xs font-bold font-mono text-purple-600 dark:text-purple-400">
                            ${dailyExposure}M/d
                          </div>
                          <div className={`text-[10px] uppercase font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {item.tier1Reach > 0 ? 'DORA Scope' : 'Internal'}
                          </div>
                        </>
                      ) : activeLens === 'maintainer' ? (
                        <>
                          <div className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">
                            {item.dependents} repos
                          </div>
                          <div className={`text-[10px] uppercase font-medium ${item.maintainers <= 2 ? 'text-red-600 font-bold' : isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {item.maintainers <= 2 ? 'Bus Factor Alert' : 'Maintained'}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={`text-xs font-bold font-mono ${item.systemicScore >= 80 ? 'text-red-600' : 'text-amber-600'}`}>
                            {item.systemicScore} / 100
                          </div>
                          <div className={`text-[10px] uppercase font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {item.structuralRisk}
                          </div>
                        </>
                      )}
                    </div>
                    <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform ${
                      isLight ? 'text-slate-400 group-hover:text-slate-700' : 'text-slate-500 group-hover:text-slate-300'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>
              {/* ========================================================= */}
        {/* RIGHT COLUMN: 2×2 Risk Quadrant & Framework Matrix        */}
        {/* ========================================================= */}
        <div className={`p-5 rounded-lg border flex flex-col gap-4 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 flex-wrap gap-2 ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              <Activity className={`w-4 h-4 ${isLight ? 'text-slate-700' : 'text-slate-300'}`} />
              <span className={`font-semibold text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {rightPanelTab === 'quadrant'
                  ? '2×2 Systemic Risk Quadrant (F21)'
                  : activeLens === 'ciso' 
                  ? 'Regulatory Compliance Scope Matrix' 
                  : activeLens === 'maintainer'
                  ? 'Upstream Bus Factor & Maintenance Health'
                  : 'Risk Quadrant Classification Matrix'}
              </span>
            </div>

            {/* Sub-tab view toggler: Quadrant vs Specialized Lens Matrix */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg border text-xs">
              <button
                onClick={() => setRightPanelTab('quadrant')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  rightPanelTab === 'quadrant'
                    ? isLight 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-900 shadow-xs'
                    : isLight 
                      ? 'text-slate-600 hover:text-slate-900' 
                      : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>2×2 Scatter Plot</span>
              </button>

              <button
                onClick={() => setRightPanelTab('dominator')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  rightPanelTab === 'dominator'
                    ? isLight 
                      ? 'bg-purple-900 text-white shadow-xs' 
                      : 'bg-purple-600 text-white shadow-xs'
                    : isLight 
                      ? 'text-purple-700 hover:bg-purple-50' 
                      : 'text-purple-400 hover:bg-purple-950/40'
                }`}
              >
                <TreePine className="w-3.5 h-3.5" />
                <span>Dominator Leaderboard</span>
              </button>

              {activeLens === 'ciso' && (
                <button
                  onClick={() => setRightPanelTab('lens_matrix')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    rightPanelTab === 'lens_matrix'
                      ? isLight 
                        ? 'bg-purple-900 text-white shadow-xs' 
                        : 'bg-purple-600 text-white shadow-xs'
                      : isLight 
                        ? 'text-slate-600 hover:text-slate-900' 
                        : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>DORA / PCI Scope</span>
                </button>
              )}

              {activeLens === 'maintainer' && (
                <button
                  onClick={() => setRightPanelTab('lens_matrix')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    rightPanelTab === 'lens_matrix'
                      ? isLight 
                        ? 'bg-blue-900 text-white shadow-xs' 
                        : 'bg-blue-600 text-white shadow-xs'
                      : isLight 
                        ? 'text-slate-600 hover:text-slate-900' 
                        : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Bus Factor Matrix</span>
                </button>
              )}
            </div>
          </div>

          {rightPanelTab === 'quadrant' ? (
            <RiskQuadrantScatter
              nodes={nodes}
              onSelectNode={onSelectNode}
              onGoToEcosystem={onGoToEcosystem}
              activeLens={activeLens}
            />
          ) : rightPanelTab === 'dominator' ? (
            <DominatorLeaderboard
              nodes={nodes}
              onSelectNode={(id) => {
                onSelectNode(id);
                if (onGoToEcosystem) onGoToEcosystem();
              }}
              isOverlay={false}
            />
          ) : activeLens === 'ciso' ? (
            <div className="flex flex-col gap-3">
              <div className={`p-3 rounded-md border flex items-center justify-between ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div>
                  <div className="font-semibold text-xs">EU DORA (Digital Operational Resilience Act)</div>
                  <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Article 28 requirement for transitive ICT providers with direct Tier-1 core reach.
                  </div>
                </div>
                <span className="text-xs font-bold font-mono px-2 py-1 bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 rounded">
                  4 Violations
                </span>
              </div>

              <div className={`p-3 rounded-md border flex items-center justify-between ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div>
                  <div className="font-semibold text-xs">PCI-DSS v4.0 Requirement 6.3</div>
                  <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Software supply chain vulnerability management for Cardholder Data Environments.
                  </div>
                </div>
                <span className="text-xs font-bold font-mono px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded">
                  2 At-Risk Sinks
                </span>
              </div>

              <div className={`p-3 rounded-md border flex items-center justify-between ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div>
                  <div className="font-semibold text-xs">SEC Cyber Item 106 Disclosure</div>
                  <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Material cybersecurity risk process documentation across systemic dependencies.
                  </div>
                </div>
                <span className="text-xs font-bold font-mono px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded">
                  Documented
                </span>
              </div>

              <div className={`p-3 rounded-md border text-xs leading-relaxed ${
                isLight ? 'bg-purple-50/50 border-purple-200 text-purple-900' : 'bg-purple-950/30 border-purple-900/40 text-purple-200'
              }`}>
                <span className="font-semibold">Executive Remediation SLA: </span>
                Tier-1 crown jewel cut-vertices require coordinated PR application within 48 hours to preserve compliance certification.
              </div>
            </div>
          ) : activeLens === 'maintainer' ? (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className={`p-3 rounded-md border flex flex-col justify-between ${
                  isLight ? 'bg-red-50/60 border-red-200' : 'bg-red-950/20 border-red-900/40'
                }`}>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-700 dark:text-red-300">
                      Single Maintainer (Bus Factor = 1)
                    </span>
                    <div className="text-lg font-mono font-bold mt-1 text-red-600">
                      snakeyaml, semver
                    </div>
                  </div>
                  <div className={`text-[11px] mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    High abandonment risk. 39 total internal downstream dependencies.
                  </div>
                </div>

                <div className={`p-3 rounded-md border flex flex-col justify-between ${
                  isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-amber-950/20 border-amber-900/40'
                }`}>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">
                      Dual Maintainers (Bus Factor = 2)
                    </span>
                    <div className="text-lg font-mono font-bold mt-1 text-amber-600">
                      fastxml-bind
                    </div>
                  </div>
                  <div className={`text-[11px] mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Stalled release cadence. Critical parser in payment pathway.
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-md border text-xs leading-relaxed ${
                isLight ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-blue-950/30 border-blue-900/40 text-blue-200'
              }`}>
                <span className="font-semibold">Maintainer Recommendation: </span>
                Wrap single-maintainer dependencies behind internal abstractions (e.g. <code>internal-data-pipeline</code>) to isolate internal microservices from upstream breaking changes.
              </div>
            </div>
          ) : null}
        </div>    </div>
      </div>

      {/* ========================================================= */}
      {/* F4 XZ RADAR: SEVERE SUPPORT DIVERGENCE ALERTS (PDI >= 70%) */}
      {/* ========================================================= */}
      <div className={`p-5 rounded-xl border flex flex-col gap-4 ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="flex items-center justify-between border-b pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isLight ? 'bg-red-50 text-red-600' : 'bg-red-950/60 text-red-400'}`}>
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  Severe Support Divergence Inspector (The "XZ Radar")
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-bold uppercase">
                  PDI ≥ 70% DEFICIT ALERT
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase ${
                  isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  F4 Pre-CVE Disjointness
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Detects catastrophic divergence where internal structural load (P_S) dominates, but observed open-source backing (Q_supp) is near zero.
              </p>
            </div>
          </div>
        </div>

        {/* List of Severe Divergence Nodes */}
        <div className="grid grid-cols-1 gap-4">
          {severeDivergenceNodes.map((item) => {
            const pStructural = item.reversePageRankPercentile || 92;
            const qSupport = item.openSsfScore ? ((item.openSsfScore / 10) * 0.38).toFixed(1) : "12.4";
            const pdi = item.pdiScore || 79.6;
            const isBriefingOpen = expandedBriefingId === item.id;

            return (
              <div 
                key={item.id}
                className={`p-4 rounded-xl border flex flex-col gap-3.5 transition-all ${
                  isLight ? 'bg-slate-50/70 border-slate-200 shadow-xs' : 'bg-slate-950/70 border-slate-800/80'
                }`}
              >
                {/* Item Top Bar */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm">{item.name}</span>
                        <span className="text-xs font-mono text-slate-500">v{item.version}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold">
                          pkg:maven/org.yaml/{item.name}@{item.version}
                        </span>
                      </div>
                      <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {item.summary}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedBriefingId(isBriefingOpen ? null : item.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border ${
                        isBriefingOpen
                          ? isLight ? 'bg-purple-600 text-white border-purple-700' : 'bg-purple-600 text-white border-purple-500'
                          : isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isBriefingOpen ? 'Hide CISO Briefing' : 'Generate CISO Action Briefing'}</span>
                      {isBriefingOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        onSelectNode(item.id);
                        if (onGoToEcosystem) onGoToEcosystem();
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all border ${
                        isLight ? 'bg-slate-900 text-white border-slate-900' : 'bg-blue-600 text-white border-blue-500 shadow-xs'
                      }`}
                    >
                      <span>Inspect Topology</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Tug-of-War Divergence Barometer */}
                <div className={`p-3.5 rounded-lg border font-mono text-xs flex flex-col gap-2.5 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider pb-1 border-b border-slate-200 dark:border-slate-800">
                    <span>Tug-of-War Support Divergence Barometer (Disjointness: P_S ⊥ Q_supp)</span>
                    <span className="text-red-600 dark:text-red-400">PDI Deficit: {pdi}% (CRITICAL)</span>
                  </div>

                  {/* Internal Demand Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Internal Structural Demand (P_S):
                      </span>
                      <span className="font-bold text-red-600 dark:text-red-400">{pStructural}% (Percentile)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: `${pStructural}%` }}></div>
                    </div>
                  </div>

                  {/* External Support Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        External Ecosystem Support (Q_supp):
                      </span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{qSupport}% (Geometric Mean)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${qSupport}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* 3-Signal Telemetry Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
                  }`}>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Q1: OpenSSF Scorecard</span>
                    <div className="font-mono font-bold text-sm mt-0.5 text-amber-600 dark:text-amber-400">
                      {item.openSsfScore || 3.2} / 10.0
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Missing branch protection & code review</div>
                  </div>

                  <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
                  }`}>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Q2: Human Commits (12m)</span>
                    <div className="font-mono font-bold text-sm mt-0.5 text-red-600 dark:text-red-400">
                      {item.humanCommits12m || 4} commits
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.botCommitsFiltered || 98} bot commits filtered out</div>
                  </div>

                  <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
                  }`}>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Q3: Release Recency</span>
                    <div className="font-mono font-bold text-sm mt-0.5 text-red-600 dark:text-red-400">
                      {item.daysSinceRelease || 412} days
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Stagnant release cadence (Bus Factor 1)</div>
                  </div>
                </div>

                {/* CISO Action Briefing Directive (Expandable) */}
                {isBriefingOpen && (
                  <div className={`p-3.5 rounded-lg border flex flex-col gap-2 text-xs animate-in fade-in slide-in-from-top-2 ${
                    isLight ? 'bg-purple-50/70 border-purple-200 text-purple-950' : 'bg-purple-950/20 border-purple-900/40 text-purple-200'
                  }`}>
                    <div className="flex items-center justify-between pb-1 border-b border-purple-200 dark:border-purple-900/40">
                      <span className="font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>Pre-Configured CISO Executive Action Directive (Policy PDI-70)</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase text-purple-600 dark:text-purple-300">
                        Mandatory Dual-Vendoring
                      </span>
                    </div>

                    <p className="text-[11px] leading-relaxed">
                      <strong>Risk Synopsis:</strong> <code>{item.name}</code> handles critical payload parsing across Tier-1 assets, yet relies on an unfunded single maintainer with 4 human commits in 12 months. This matches the exact precursor signature of the <em>XZ Utils</em> backdoor and <em>left-pad</em> systemic collapse.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 font-mono text-[10px] pt-1">
                      <div className={`p-2 rounded border ${isLight ? 'bg-white border-purple-200' : 'bg-purple-950/50 border-purple-900/40'}`}>
                        <strong>1. ARCHITECTURAL DUAL-VENDORING:</strong> Direct engineering leads to evaluate drop-in secondary parsers (e.g. Jackson YAML / SnakeYAML 2.0).
                      </div>
                      <div className={`p-2 rounded border ${isLight ? 'bg-white border-purple-200' : 'bg-purple-950/50 border-purple-900/40'}`}>
                        <strong>2. ESCROW REPO FORK:</strong> Maintain a mirror fork on internal Gitlab with automated static analysis CI gates.
                      </div>
                      <div className={`p-2 rounded border ${isLight ? 'bg-white border-purple-200' : 'bg-purple-950/50 border-purple-900/40'}`}>
                        <strong>3. FOUNDATION SPONSORSHIP:</strong> Allocate corporate OSS stewardship funds through Linux Foundation to sustain upstream maintainer.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
        </>
      )}

      {/* Report Export Modal (P3-4) */}
      <ReportExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        nodes={nodes}
        stats={stats}
        activeLens={activeLens}
      />
    </div>
  );
};
