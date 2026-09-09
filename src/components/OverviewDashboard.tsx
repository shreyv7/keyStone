import React from 'react';
import { 
  ShieldAlert, 
  Layers, 
  ArrowRight, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Play,
  FileSpreadsheet
} from 'lucide-react';
import { KeystoneStats, EcosystemNode } from '../types';
import { useTheme } from '../context/ThemeContext';

interface OverviewDashboardProps {
  stats: KeystoneStats;
  topRisks: EcosystemNode[];
  onSelectNode: (nodeId: string) => void;
  onLaunchHeroDemo: () => void;
  onOpenPRModal: () => void;
  onOpenRiskWatchlist: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  stats,
  topRisks,
  onSelectNode,
  onLaunchHeroDemo,
  onOpenPRModal,
  onOpenRiskWatchlist
}) => {
  const { isLight } = useTheme();

  return (
    <div className={`absolute inset-0 z-20 backdrop-blur-md p-8 flex flex-col gap-6 overflow-y-auto select-none ${
      isLight ? 'bg-slate-50/95 text-slate-900' : 'bg-[#06080d]/95 text-slate-100'
    }`}>
      {/* Header */}
      <div className={`flex items-start justify-between border-b pb-5 ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded border ${
              isLight 
                ? 'bg-slate-100 text-slate-700 border-slate-200' 
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              Portfolio Posture
            </span>
            <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Deterministic Topological Risk Analysis
            </span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Supply Chain Risk Overview
          </h1>
          <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Prioritizes open source and internal dependencies by structural network position, reachability to production sinks, and articulation chokepoints.
          </p>
        </div>

        {/* Global Action CTA */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onLaunchHeroDemo}
            className={`px-4 py-2 rounded-md font-medium text-xs transition-colors flex items-center gap-2 ${
              isLight 
                ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                : 'bg-slate-100 hover:bg-white text-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Keystone Attack</span>
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
            <span>Remediation Manifest</span>
          </button>
        </div>
      </div>

      {/* Critical Alert Callout */}
      <div className={`p-4 rounded-lg border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isLight 
          ? 'bg-red-50/50 border-red-200 text-red-900' 
          : 'bg-red-950/20 border-red-900/50 text-red-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-md shrink-0 ${isLight ? 'bg-red-100 text-red-700' : 'bg-red-900/40 text-red-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">
              <span>Critical Articulation Point Identified:</span>
              <code className="font-mono px-1.5 py-0.5 rounded text-xs bg-white/80 dark:bg-black/40 font-bold">snakeyaml@1.33</code>
            </div>
            <p className="text-xs mt-1 leading-relaxed opacity-90">
              A single transitive dependency connects 21 downstream services into 4 regulated Tier-1 assets. A targeted update to <code>internal-data-pipeline</code> severs all active attack vectors.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectNode('snakeyaml')}
          className={`shrink-0 px-3.5 py-1.5 rounded-md text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
            isLight 
              ? 'bg-white hover:bg-red-50 text-red-800 border-red-200 shadow-xs' 
              : 'bg-red-900/40 hover:bg-red-900/60 text-red-200 border-red-700/50'
          }`}
        >
          <span>Inspect Node</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Executive Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border flex flex-col ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Dependencies Analyzed</span>
          <span className={`text-2xl font-bold font-mono mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{stats.totalNodes}</span>
          <span className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>42 service repositories</span>
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

      {/* Two Column Layout: Top Structural Risks + Reachability Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Top 5 Structural Risks */}
        <div className={`p-5 rounded-lg border flex flex-col gap-4 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span className={`font-semibold text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Top Structural Keystones
              </span>
            </div>
            <button
              onClick={onOpenRiskWatchlist}
              className={`text-xs font-medium hover:underline flex items-center gap-1 ${
                isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>View Full Watchlist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {topRisks.map((item, idx) => (
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
                    </div>
                    <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {item.dependents} downstream services • {item.tier1Reach} Tier-1 sinks
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-xs font-bold font-mono ${item.systemicScore >= 80 ? 'text-red-600' : 'text-amber-600'}`}>
                      {item.systemicScore} / 100
                    </div>
                    <div className={`text-[10px] uppercase font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {item.structuralRisk}
                    </div>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform ${
                    isLight ? 'text-slate-400 group-hover:text-slate-700' : 'text-slate-500 group-hover:text-slate-300'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Reachability vs Centrality Risk Matrix */}
        <div className={`p-5 rounded-lg border flex flex-col gap-4 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              <Activity className={`w-4 h-4 ${isLight ? 'text-slate-700' : 'text-slate-300'}`} />
              <span className={`font-semibold text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Risk Matrix (Reachability vs. Centrality)
              </span>
            </div>
            <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Topological Categorization
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            {/* Top Left */}
            <div className={`p-3 rounded-md border flex flex-col justify-between h-28 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div>
                <span className={`text-[10px] uppercase font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Low Centrality / High Direct
                </span>
                <div className={`font-semibold mt-1 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Isolated Dependency
                </div>
              </div>
              <div className={`text-[11px] leading-tight ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Localized service impact. Contained within single repository boundary.
              </div>
            </div>

            {/* Top Right */}
            <div className={`p-3 rounded-md border flex flex-col justify-between h-28 ${
              isLight ? 'bg-red-50/60 border-red-200' : 'bg-red-950/20 border-red-900/40'
            }`}>
              <div>
                <span className={`text-[10px] uppercase font-semibold ${isLight ? 'text-red-800' : 'text-red-300'}`}>
                  High Blast / High Centrality
                </span>
                <div className={`font-semibold mt-1 text-red-700 dark:text-red-400`}>
                  Critical Keystone
                </div>
              </div>
              <div className={`text-[11px] leading-tight ${isLight ? 'text-red-800/80' : 'text-red-300/80'}`}>
                Articulation chokepoints. Compromise impacts multiple regulated sinks.
              </div>
            </div>

            {/* Bottom Left */}
            <div className={`p-3 rounded-md border flex flex-col justify-between h-28 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div>
                <span className={`text-[10px] uppercase font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Low Blast / Low Centrality
                </span>
                <div className={`font-semibold mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Low Priority / Noise
                </div>
              </div>
              <div className={`text-[11px] leading-tight ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Peripheral dependencies with redundant pathways. Deprioritized.
              </div>
            </div>

            {/* Bottom Right */}
            <div className={`p-3 rounded-md border flex flex-col justify-between h-28 ${
              isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-amber-950/20 border-amber-900/40'
            }`}>
              <div>
                <span className={`text-[10px] uppercase font-semibold ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                  High Blast / Transitive
                </span>
                <div className={`font-semibold mt-1 text-amber-800 dark:text-amber-300`}>
                  Transitive Chokepoint
                </div>
              </div>
              <div className={`text-[11px] leading-tight ${isLight ? 'text-amber-800/80' : 'text-amber-300/80'}`}>
                Deeply nested dependency with wide reach, often masked by low CVSS.
              </div>
            </div>
          </div>

          <div className={`p-3 rounded-md border text-xs leading-relaxed ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/80 border-slate-800 text-slate-300'
          }`}>
            <span className="font-semibold">Analysis Method: </span>
            Tarjan cut-vertex evaluation combined with Reverse PageRank identifies single points of failure before vulnerability advisory release.
          </div>
        </div>
      </div>
    </div>
  );
};
