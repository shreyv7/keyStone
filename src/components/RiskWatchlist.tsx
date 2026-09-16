import React, { useState, useMemo, useEffect } from 'react';
import { EcosystemNode } from '../types';
import { AlertTriangle, ShieldCheck, ArrowRight, Layers, ExternalLink, TrendingUp, Zap, CornerDownLeft, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CentralityVelocityCard } from './CentralityVelocityCard';
import { ReportExportModal } from './ReportExportModal';
import { OnboardingEmptyState } from './OnboardingEmptyState';
import { KEYSTONE_STATS } from '../data/mockEcosystem';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface RiskWatchlistProps {
  nodes: EcosystemNode[];
  onSelectNode: (nodeId: string) => void;
  onReturnToGraph: () => void;
}

export const RiskWatchlist: React.FC<RiskWatchlistProps> = ({
  nodes,
  onSelectNode,
  onReturnToGraph
}) => {
  const { isLight } = useTheme();
  const [watchlistFilter, setWatchlistFilter] = useState<'all' | 'escalating' | 'cut-vertex' | 'tier1'>('all');
  const [focusedRowIndex, setFocusedRowIndex] = useState<number>(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Filter and sort by systemicScore descending
  const filteredNodes = useMemo(() => {
    let list = [...nodes].sort((a, b) => b.systemicScore - a.systemicScore);
    if (watchlistFilter === 'escalating') {
      list = list.filter(n => n.isEscalatingKeystone || (n.centralityVelocity && n.centralityVelocity >= 100) || n.id === 'snakeyaml' || n.id === 'minimist' || n.id === 'internal-data-pipeline');
    } else if (watchlistFilter === 'cut-vertex') {
      list = list.filter(n => n.articulationPoint);
    } else if (watchlistFilter === 'tier1') {
      list = list.filter(n => n.tier1Reach > 0);
    }
    return list;
  }, [nodes, watchlistFilter]);

  // Keyboard navigation through table rows (P3-2)
  useEffect(() => {
    const handleTableKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (filteredNodes.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedRowIndex(prev => (prev + 1) % filteredNodes.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedRowIndex(prev => (prev - 1 + filteredNodes.length) % filteredNodes.length);
      } else if (e.key === 'Enter') {
        const target = filteredNodes[focusedRowIndex];
        if (target) {
          onSelectNode(target.id);
        }
      }
    };

    window.addEventListener('keydown', handleTableKeyDown);
    return () => window.removeEventListener('keydown', handleTableKeyDown);
  }, [filteredNodes, focusedRowIndex, onSelectNode]);

  const escalatingCount = useMemo(() => {
    return nodes.filter(n => n.isEscalatingKeystone || (n.centralityVelocity && n.centralityVelocity >= 100) || n.id === 'snakeyaml' || n.id === 'minimist').length;
  }, [nodes]);

  const cutVertexCount = useMemo(() => {
    return nodes.filter(n => n.articulationPoint).length;
  }, [nodes]);

  return (
    <div className="w-full h-full overflow-y-auto px-6 py-6 select-text ks-bg-app">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/80 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
              Systemic Risk Watchlist
            </h1>
            <p className="text-sm mt-2 max-w-2xl text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
              Prioritize dependencies by network position, downstream reachability to critical assets, and velocity alarms.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center gap-2 cursor-pointer select-none shadow-xs transition-colors"
              title="Export Systemic Risk Register (CSV, JSON, Markdown)"
            >
              <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Export Risk Register</span>
            </button>

            <button
              onClick={onReturnToGraph}
              className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2 cursor-pointer select-none shadow-xs transition-colors"
            >
              <Layers className="w-4 h-4" />
              <span>Return to Topology Map</span>
            </button>
          </div>
        </div>

        {/* Highlights summary banner (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs flex flex-col justify-between gap-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Top Articulation Keystone</div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">snakeyaml@1.33</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-800">
              Tarjan cut-vertex reaching 4 Tier-1 services (CVSS 48/100).
            </div>
          </div>

          {/* Velocity Summary Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs flex flex-col justify-between gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Leading Velocity Alarm
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold">
                {escalatingCount} Escalating
              </span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white flex items-center gap-1.5 mt-1">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>+142% 90d Surge</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-800">
              <code>snakeyaml</code> Reverse PageRank surged across lockfiles.
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs flex flex-col justify-between gap-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Dependency Concentration</div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">81% in Top 5 Nodes</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-800">
              Ecosystem reachability is concentrated in shared libraries.
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs flex flex-col justify-between gap-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Tier-1 Sinks Exposed</div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">4 Core Services</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-800">
              Payment Gateway, Auth/IAM, Order Core, Realtime Risk.
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setWatchlistFilter('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                watchlistFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Monitored ({nodes.length})
            </button>
            <button
              onClick={() => setWatchlistFilter('escalating')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                watchlistFilter === 'escalating'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Escalating Keystones ({escalatingCount})</span>
            </button>
            <button
              onClick={() => setWatchlistFilter('cut-vertex')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                watchlistFilter === 'cut-vertex'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Cut-Vertices ({cutVertexCount})
            </button>
            <button
              onClick={() => setWatchlistFilter('tier1')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                watchlistFilter === 'tier1'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tier-1 Exposed ({nodes.filter(n => n.tier1Reach > 0).length})
            </button>
          </div>

          <span className="text-xs font-mono text-slate-500 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
            <CornerDownLeft className="w-3.5 h-3.5 text-blue-500" />
            <span>Use ↑↓ arrows to navigate • Enter to inspect</span>
          </span>
        </div>

      {/* Main Table */}
      <div className={`rounded-xl border overflow-hidden ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${
                isLight 
                  ? 'border-slate-200 bg-white text-slate-600' 
                  : 'border-slate-800 bg-slate-950/80 text-slate-400'
              }`}>
                <th className="py-3 px-4">Rank & Component</th>
                <th className="py-3 px-4">Conventional vs. Systemic</th>
                <th className="py-3 px-4">Risk Tier</th>
                <th className="py-3 px-4">Centrality</th>
                <th className="py-3 px-4">Velocity (90d)</th>
                <th className="py-3 px-4">Cut-Vertex</th>
                <th className="py-3 px-4">Downstream</th>
                <th className="py-3 px-4">Tier-1 Reach</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
              {filteredNodes.map((node, index) => {
                const isSnakeYaml = node.id === 'snakeyaml';
                const isEscalating = node.isEscalatingKeystone || (node.centralityVelocity && node.centralityVelocity >= 100);
                const isFocused = index === focusedRowIndex;
                return (
                  <tr
                    key={node.id}
                    onClick={() => onSelectNode(node.id)}
                    tabIndex={0}
                    onFocus={() => setFocusedRowIndex(index)}
                    className={`transition-colors cursor-pointer ${
                      isFocused
                        ? isLight ? 'bg-blue-50/70 ring-2 ring-blue-500 ring-inset' : 'bg-blue-950/30 ring-2 ring-blue-500 ring-inset'
                        : isSnakeYaml 
                        ? isLight ? 'bg-blue-50/30' : 'bg-blue-950/20'
                        : isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'
                    }`}
                    aria-label={`Row ${index + 1}: ${node.name} version ${node.version}, systemic risk ${node.systemicScore}`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-slate-400 w-4">
                          {index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-sm text-slate-900 dark:text-white">
                              {node.name}
                            </span>
                            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                              v{node.version}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {node.operationalDomain || node.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="text-center">
                          <div className="text-xs uppercase text-slate-400 font-medium">CVSS</div>
                          <div className="font-mono font-semibold text-slate-700 dark:text-slate-300 text-sm">
                            {node.conventionalScore}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <div className="text-center">
                          <div className="text-xs uppercase text-slate-400 font-medium">Systemic</div>
                          <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                            {node.systemicScore}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={node.structuralRisk === 'critical' ? 'critical' : node.structuralRisk === 'high' ? 'high' : 'neutral'}>
                        {node.structuralRisk}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-sm text-slate-800 dark:text-slate-200">
                      {(node.reversePageRank * 100).toFixed(1)}%
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <CentralityVelocityCard node={node} mode="sparkline-only" />
                        {isEscalating && (
                          <Badge variant="high">
                            Escalating
                          </Badge>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {node.articulationPoint ? (
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                          Cut-Vertex
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">No</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-sm text-slate-800 dark:text-slate-200">
                      {node.dependents} repos
                    </td>

                    <td className="py-3.5 px-4 font-mono text-sm">
                      <span className={node.tier1Reach > 0 ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'}>
                        {node.tier1Reach} Tier-1
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectNode(node.id)}
                        className="px-3 py-1 rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer select-none shadow-xs transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {nodes.length === 0 && (
        <OnboardingEmptyState
          title="No Dependencies Monitored in Watchlist"
          description="Upload your CycloneDX SBOM or package lockfile to populate the pre-CVE systemic risk watchlist."
        />
      )}

      {/* Report Export Modal (P3-4) */}
      <ReportExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        nodes={nodes}
        stats={KEYSTONE_STATS}
      />
      </div>
    </div>
  );
};
