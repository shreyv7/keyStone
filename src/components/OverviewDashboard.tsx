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
  FileText,
  Clock,
  Ban
} from 'lucide-react';
import { KeystoneStats, EcosystemNode, RoleLens } from '../types';
import { useTheme } from '../context/ThemeContext';
import { RiskQuadrantScatter } from './RiskQuadrantScatter';
import { DominatorLeaderboard } from './DominatorLeaderboard';
import { PortfolioRiskTrendChart } from './PortfolioRiskTrendChart';
import { ReportExportModal } from './ReportExportModal';
import { OnboardingEmptyState } from './OnboardingEmptyState';
import { VulnerabilityDetectedModal } from './VulnerabilityDetectedModal';
import { Download, LayoutTemplate } from 'lucide-react';
import { PageHeader } from './ui/PageHeader';
import { MetricStrip, MetricStripItem } from './ui/MetricStrip';
import { Disclosure } from './ui/Disclosure';

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
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<'ranking' | 'quadrant' | 'dominator' | 'lens_matrix'>('ranking');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isVulnerabilityModalOpen, setIsVulnerabilityModalOpen] = useState(false);
  const [isShipmentBlocked, setIsShipmentBlocked] = useState(false);
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
    setIsVulnerabilityModalOpen(true);
  };

  const headlineMetrics: MetricStripItem[] = activeLens === 'ciso'
    ? [
        { label: 'Estimated exposure', value: '$85M/day', detail: 'Across 21 services', tone: 'critical' },
        { label: 'Risk concentration', value: '81.4%', detail: 'Across five dependencies', tone: 'warning' },
        { label: 'Critical services', value: '4 exposed', detail: 'Regulated production scope', tone: 'critical' },
      ]
    : activeLens === 'maintainer'
      ? [
          { label: 'Affected services', value: '21', detail: 'Downstream consumers', tone: 'warning' },
          { label: 'Fragile packages', value: '3', detail: 'Two or fewer maintainers', tone: 'critical' },
          { label: 'Weekly downloads', value: '125M+', detail: 'Across shared packages', tone: 'info' },
        ]
      : [
          { label: 'Critical risks', value: '3', detail: 'Require attention', tone: 'critical' },
          { label: 'Affected services', value: '21', detail: 'Including 4 critical services', tone: 'warning' },
          { label: 'Open risks', value: stats.activeStructuralRisks || 5, detail: 'Prioritized by impact', tone: 'neutral' },
        ];

  return (
    <div className={`absolute inset-0 z-20 backdrop-blur-md p-4 sm:p-6 lg:p-8 flex flex-col gap-5 overflow-y-auto select-none ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#080616]/95 text-slate-100'
    }`}>
      <PageHeader
        title="Security Posture"
        description={activeLens === 'ciso'
          ? 'See which dependencies create the greatest business exposure and what action reduces it.'
          : activeLens === 'maintainer'
            ? 'Find fragile shared packages before they disrupt dependent services.'
            : 'Find and fix dependencies that put your services at risk.'}
        primaryAction={
          <button
            onClick={onOpenPRModal}
            className="ks-btn ks-btn-primary ks-btn-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Review recommended fix</span>
          </button>
        }
        secondaryActions={
          <details className="group relative">
            <summary className="ks-btn ks-btn-secondary ks-btn-md list-none">
              More actions
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="absolute right-0 top-full z-40 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <button onClick={handleHeroAction} className="ks-btn ks-btn-ghost ks-btn-sm w-full justify-start">
                <Play className="h-3.5 w-3.5" /> Simulate impact
              </button>
              <button onClick={() => setIsExportModalOpen(true)} className="ks-btn ks-btn-ghost ks-btn-sm w-full justify-start">
                <Download className="h-3.5 w-3.5" /> Export report
              </button>
            </div>
          </details>
        }
      />

      {/* Shipment Blocked Warning Banner */}
      {isShipmentBlocked && (
        <div className="p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 shrink-0">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                <span>Production Deployment Blocked</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-600 text-white font-bold">
                  Do Not Ship
                </span>
                <span className="text-xs font-mono opacity-80">CVE-2022-1471</span>
              </div>
              <p className="text-xs mt-0.5 opacity-90">
                A critical vulnerability in <code className="font-mono font-bold">snakeyaml@1.33</code> could reach 4 critical services. Production releases are paused.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsVulnerabilityModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-400 dark:border-red-600 hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              Inspect Advisory
            </button>
            {onOpenPRModal && (
              <button
                onClick={onOpenPRModal}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
              >
                Apply Fix PR
              </button>
            )}
          </div>
        </div>
      )}

      {nodes.length === 0 || isPreviewEmptyState ? (
        <OnboardingEmptyState
          onOpenSBOMModal={onOpenSBOMModal}
          onLoadDemoData={() => setIsPreviewEmptyState(false)}
        />
      ) : (
        <>

      {/* ─── 1. ECOSYSTEM STATUS & DRIFT (Airy inline row) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2 flex-wrap text-slate-600 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Monitoring up to date</span>
          <span className="text-slate-400 dark:text-slate-600">·</span>
          <span>42 repositories</span>
          <span className="text-slate-400 dark:text-slate-600">·</span>
          <span>1,489 dependencies mapped</span>
        </div>
      </div>

      {/* ─── 2. PRIMARY RISK ALERT (What is wrong? Scope? What to do?) ─── */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
        activeLens === 'ciso'
          ? isLight ? 'bg-purple-50/70 border-purple-200 text-purple-950' : 'bg-purple-950/20 border-purple-900/50 text-purple-200'
          : isLight ? 'bg-red-50/50 border-red-200 text-red-900' : 'bg-red-950/25 border-red-900/50 text-red-200'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
            activeLens === 'ciso'
              ? isLight ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/40 text-purple-300'
              : isLight ? 'bg-red-100 text-red-700' : 'bg-red-900/40 text-red-400'
          }`}>
            {activeLens === 'ciso' ? <DollarSign className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-2 flex-wrap">
              <span>3 dependency risks require attention</span>
              <span className="ks-badge ks-badge-critical">Critical</span>
            </div>
            <p className={`text-xs mt-1.5 leading-relaxed max-w-3xl ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {activeLens === 'ciso'
                ? 'snakeyaml@1.33 creates an estimated $85M/day financial exposure across 21 revenue services and 4 regulated critical services.'
                : activeLens === 'maintainer'
                ? 'snakeyaml@1.33 has 1 primary maintainer while serving 21 internal repositories, presenting elevated abandonment risk.'
                : 'One dependency affects 21 services, including 4 critical services. The recommended update removes every known exposure path.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectNode('snakeyaml')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1 cursor-pointer ${
              activeLens === 'ciso'
                ? isLight ? 'bg-white hover:bg-purple-50 text-purple-800 border-purple-200 shadow-xs' : 'bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 border-purple-700/50'
                : isLight ? 'bg-white hover:bg-red-50 text-red-800 border-red-200 shadow-xs' : 'border-slate-700 hover:bg-slate-800 text-slate-200'
            }`}
          >
            <span>Inspect dependency</span>
          </button>
        </div>
      </div>

      <MetricStrip items={headlineMetrics} />

      <Disclosure
        title="Portfolio trend and recent activity"
        summary="Maintainer inactivity changed on 2 core packages; 1 recommended fix is ready."
      >
        <PortfolioRiskTrendChart />
      </Disclosure>

      {/* ========================================================= */}
      {/* ANALYTICS & DEPENDENCY RISK (FULL-WIDTH EXPANSIVE)        */}
      {/* ========================================================= */}
      <div className={`p-5 rounded-2xl border flex flex-col gap-5 ${
        isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-slate-900/60 border-slate-800'
      }`}>
        {/* Section Header & Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {activeAnalyticsTab === 'ranking' ? (
              activeLens === 'ciso' ? <DollarSign className="w-4 h-4 text-purple-600" /> :
              activeLens === 'maintainer' ? <Users className="w-4 h-4 text-blue-600" /> :
              <ShieldAlert className="w-4 h-4 text-red-600" />
            ) : activeAnalyticsTab === 'quadrant' ? (
              <BarChart3 className="w-4 h-4 text-blue-600" />
            ) : activeAnalyticsTab === 'dominator' ? (
              <TreePine className="w-4 h-4 text-purple-600" />
            ) : (
              <Building2 className="w-4 h-4 text-purple-600" />
            )}
            <h3 className={`font-bold text-sm tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              {activeAnalyticsTab === 'ranking'
                ? activeLens === 'ciso' 
                  ? 'Financial Exposure Ranking (Top Dependencies)' 
                  : activeLens === 'maintainer'
              ? 'Dependencies with the widest service impact'
                  : 'Highest-Risk Dependencies'
                : activeAnalyticsTab === 'quadrant'
                ? 'Dependency impact distribution'
                : activeAnalyticsTab === 'dominator'
                ? 'High-impact dependencies'
                : activeLens === 'ciso'
                ? 'Regulatory Compliance Scope Matrix (DORA / PCI)'
                : 'Upstream Bus Factor & Maintenance Health'}
            </h3>
          </div>

          {/* Clean Segmented Tab Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl border text-xs bg-slate-100/80 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800 flex-wrap">
            <button
              onClick={() => setActiveAnalyticsTab('ranking')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeAnalyticsTab === 'ranking'
                  ? isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-slate-800 text-white shadow-xs'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Ranked Dependencies ({riskList.length})</span>
            </button>

            <button
              onClick={() => setActiveAnalyticsTab('quadrant')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeAnalyticsTab === 'quadrant'
                  ? isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-slate-800 text-white shadow-xs'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>2×2 Risk Matrix</span>
            </button>

            <button
              onClick={() => setActiveAnalyticsTab('dominator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeAnalyticsTab === 'dominator'
                  ? isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-slate-800 text-white shadow-xs'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TreePine className="w-3.5 h-3.5" />
              <span>High-impact dependencies</span>
            </button>

            {activeLens === 'ciso' && (
              <button
                onClick={() => setActiveAnalyticsTab('lens_matrix')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeAnalyticsTab === 'lens_matrix'
                    ? isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-slate-800 text-white shadow-xs'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>DORA / PCI Scope</span>
              </button>
            )}

            {activeLens === 'maintainer' && (
              <button
                onClick={() => setActiveAnalyticsTab('lens_matrix')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeAnalyticsTab === 'lens_matrix'
                    ? isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-slate-800 text-white shadow-xs'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Bus Factor Matrix</span>
              </button>
            )}

            {onOpenRiskWatchlist && activeAnalyticsTab === 'ranking' && (
              <button
                onClick={onOpenRiskWatchlist}
                className={`ml-1 px-2.5 py-1.5 text-xs font-medium hover:underline flex items-center gap-1 cursor-pointer ${
                  isLight ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'
                }`}
              >
                <span>Full Watchlist</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: RANKED DEPENDENCIES (FULL-WIDTH EXPANSIVE CARDS) */}
        {activeAnalyticsTab === 'ranking' && (
          <div className="flex flex-col gap-3">
            {riskList.map((item, idx) => {
              const dailyExposure = (item.tier1Reach * 18.5 + item.dependents * 1.25).toFixed(1);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectNode(item.id)}
                  className={`w-full p-4 rounded-xl border cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:scale-[1.003] ${
                    isLight 
                      ? 'bg-slate-50/60 hover:bg-slate-100/90 border-slate-200/90 hover:border-blue-400 shadow-2xs' 
                      : 'bg-slate-950/50 hover:bg-slate-800/70 border-slate-800/90 hover:border-blue-500/50 shadow-2xs'
                  }`}
                >
                  {/* Left: Rank + Name + Version + Chokepoint Tag */}
                  <div className="flex items-center gap-3.5 min-w-[280px]">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      idx < 3
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                        : isLight ? 'bg-slate-200/80 text-slate-700' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-mono font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {item.name}
                        </span>
                        <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          v{item.version}
                        </span>
                        {item.articulationPoint && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full">
                            High impact
                          </span>
                        )}
                        {item.ssvcPriority === 'p1_immediate' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full">
                            Immediate Action
                          </span>
                        )}
                      </div>
                      <div className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Category: <strong className="font-medium text-slate-700 dark:text-slate-300">{item.category}</strong> • Layer: Tier {item.layer}
                      </div>
                    </div>
                  </div>

                  {/* Center: Downstream Impact Reach */}
                  <div className="flex-1 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span>
                      {activeLens === 'ciso'
                        ? `Estimated Financial Risk: $${dailyExposure}M/day across ${item.tier1Reach} critical services`
                        : activeLens === 'maintainer'
                        ? `${item.dependents} downstream repos • ${item.maintainers} maintainer(s) • ${item.weeklyDownloads} dl/wk`
                        : `${item.dependents} downstream services • ${item.tier1Reach} critical services reached`}
                    </span>
                  </div>

                  {/* Right: Score & CTA */}
                  <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                    <div className="text-right">
                      <div className={`text-base font-bold font-mono ${
                        item.systemicScore >= 80 ? 'text-red-500' : 'text-amber-500'
                      }`}>
                        {activeLens === 'ciso' ? `$${dailyExposure}M/d` : `${item.systemicScore} / 100`}
                      </div>
                      <div className="text-[10px] uppercase font-mono font-medium text-slate-400">
                        {activeLens === 'ciso' ? (item.tier1Reach > 0 ? 'DORA Scope' : 'Internal') : item.structuralRisk}
                      </div>
                    </div>

                    <div className={`p-2 rounded-lg transition-all group-hover:translate-x-1 duration-200 ${
                      isLight ? 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600' : 'bg-slate-800 text-slate-300 group-hover:bg-blue-950/60 group-hover:text-blue-400'
                    }`}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: 2×2 RISK MATRIX (FULL-WIDTH EXPANSIVE) */}
        {activeAnalyticsTab === 'quadrant' && (
          <div className="w-full">
            <RiskQuadrantScatter
              nodes={nodes}
              onSelectNode={onSelectNode}
              onGoToEcosystem={onGoToEcosystem}
              activeLens={activeLens}
            />
          </div>
        )}

        {/* TAB 3: DOMINATOR LEADERBOARD (FULL-WIDTH EXPANSIVE) */}
        {activeAnalyticsTab === 'dominator' && (
          <div className="w-full">
            <DominatorLeaderboard
              nodes={nodes}
              onSelectNode={(id) => {
                onSelectNode(id);
                if (onGoToEcosystem) onGoToEcosystem();
              }}
              isOverlay={false}
            />
          </div>
        )}

        {/* TAB 4: LENS SPECIALIZED MATRIX (CISO OR MAINTAINER) */}
        {activeAnalyticsTab === 'lens_matrix' && activeLens === 'ciso' && (
          <div className="flex flex-col gap-3">
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div>
                <div className="font-semibold text-sm">EU DORA (Digital Operational Resilience Act)</div>
                <div className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Article 28 requirement for third-party providers that reach critical production services.
                </div>
              </div>
              <span className="text-xs font-bold font-mono px-2.5 py-1 bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 rounded-lg">
                4 Violations
              </span>
            </div>

            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div>
                <div className="font-semibold text-sm">PCI-DSS v4.0 Requirement 6.3</div>
                <div className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Software supply chain vulnerability management for Cardholder Data Environments.
                </div>
              </div>
              <span className="text-xs font-bold font-mono px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded-lg">
                2 At-Risk Services
              </span>
            </div>

            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div>
                <div className="font-semibold text-sm">SEC Cyber Item 106 Disclosure</div>
                <div className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Material cybersecurity risk documentation across shared dependencies.
                </div>
              </div>
              <span className="text-xs font-bold font-mono px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-lg">
                Documented
              </span>
            </div>

            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
              isLight ? 'bg-purple-50/50 border-purple-200 text-purple-900' : 'bg-purple-950/30 border-purple-900/40 text-purple-200'
            }`}>
              <span className="font-semibold">Executive Remediation SLA: </span>
              High-impact dependencies require remediation within 48 hours to maintain compliance certification.
            </div>
          </div>
        )}

        {activeAnalyticsTab === 'lens_matrix' && activeLens === 'maintainer' && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
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
                <div className={`text-xs mt-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  High abandonment risk. 39 total internal downstream dependencies.
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
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
                <div className={`text-xs mt-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Stalled release cadence. Critical parser in payment pathway.
                </div>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
              isLight ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-blue-950/30 border-blue-900/40 text-blue-200'
            }`}>
              <span className="font-semibold">Maintainer Recommendation: </span>
              Wrap single-maintainer dependencies behind internal abstractions (e.g. <code>internal-data-pipeline</code>) to isolate internal microservices from upstream breaking changes.
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* UNMAINTAINED HIGH-IMPACT DEPENDENCIES                     */}
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
                  Unmaintained High-Impact Dependencies
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 uppercase tracking-wide">
                  High Maintenance Deficit
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Dependencies with high internal reliance where upstream maintenance has stalled.
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
                      <span>{isBriefingOpen ? 'Hide Briefing' : 'View Action Briefing'}</span>
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
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider pb-1 border-b border-slate-200 dark:border-slate-800">
                    <span>Dependency Resilience Assessment</span>
                    <span className="text-red-600 dark:text-red-400">Maintenance Deficit: {pdi}% (Critical)</span>
                  </div>

                  {/* Internal Demand Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Internal Service Reliance:
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
                        Upstream Maintenance Backing:
                      </span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{qSupport}% (Overall Health)</span>
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
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Security Scorecard</span>
                    <div className="font-mono font-bold text-sm mt-0.5 text-amber-600 dark:text-amber-400">
                      {item.openSsfScore || 3.2} / 10.0
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Missing branch protection & code review</div>
                  </div>

                  <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
                  }`}>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Active Maintainer Commits</span>
                    <div className="font-mono font-bold text-sm mt-0.5 text-red-600 dark:text-red-400">
                      {item.humanCommits12m || 4} commits
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.botCommitsFiltered || 98} bot commits filtered out</div>
                  </div>

                  <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
                  }`}>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Release Cadence</span>
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
                        <span>Remediation Policy Directive</span>
                      </span>
                      <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-300">
                        Dual-Vendoring Mandate
                      </span>
                    </div>

                    <p className="text-[11px] leading-relaxed">
                      <strong>Risk Synopsis:</strong> <code>{item.name}</code> processes payloads across critical assets but relies on a single maintainer with low commit activity over the past 12 months.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 font-mono text-[10px] pt-1">
                      <div className={`p-2 rounded border ${isLight ? 'bg-white border-purple-200' : 'bg-purple-950/50 border-purple-900/40'}`}>
                        <strong>1. DUAL-VENDORING:</strong> Evaluate drop-in secondary parsers (e.g. Jackson YAML / SnakeYAML 2.0).
                      </div>
                      <div className={`p-2 rounded border ${isLight ? 'bg-white border-purple-200' : 'bg-purple-950/50 border-purple-900/40'}`}>
                        <strong>2. ESCROW FORK:</strong> Maintain a mirror fork with automated static analysis CI gates.
                      </div>
                      <div className={`p-2 rounded border ${isLight ? 'bg-white border-purple-200' : 'bg-purple-950/50 border-purple-900/40'}`}>
                        <strong>3. UPSTREAM SPONSORSHIP:</strong> Allocate stewardship funds through OSS foundations to sustain upstream maintenance.
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

      {/* Critical Vulnerability Detection Alert Modal */}
      <VulnerabilityDetectedModal
        isOpen={isVulnerabilityModalOpen}
        onClose={() => setIsVulnerabilityModalOpen(false)}
        onBlockShipment={() => {
          setIsShipmentBlocked(true);
          setIsVulnerabilityModalOpen(false);
        }}
        onSimulateInGraph={() => {
          setIsVulnerabilityModalOpen(false);
          if (onLaunchHeroDemo) onLaunchHeroDemo();
          else if (onStartDemoScenario) onStartDemoScenario();
          else if (onGoToEcosystem) onGoToEcosystem();
        }}
        onOpenPRModal={() => {
          setIsVulnerabilityModalOpen(false);
          if (onOpenPRModal) onOpenPRModal();
        }}
      />
    </div>
  );
};
