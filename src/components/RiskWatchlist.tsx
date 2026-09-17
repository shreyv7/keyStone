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
import { PageHeader } from './ui/PageHeader';
import { MetricStrip } from './ui/MetricStrip';

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
    <div className="w-full h-full overflow-y-auto px-4 py-5 sm:px-6 select-text ks-bg-app">
      <div className="max-w-7xl mx-auto flex flex-col gap-5">
        <PageHeader
          title="Risk Watchlist"
          description="Prioritize dependencies by severity, affected services, and the action that reduces the most risk."
          primaryAction={
            <button
              onClick={() => filteredNodes[0] && onSelectNode(filteredNodes[0].id)}
              className="ks-btn ks-btn-primary ks-btn-md"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Inspect highest risk</span>
            </button>
          }
          secondaryActions={
            <>
              <button onClick={() => setIsExportModalOpen(true)} className="ks-btn ks-btn-secondary ks-btn-md">
                <Download className="w-4 h-4" /> Export
              </button>
              <button onClick={onReturnToGraph} className="ks-btn ks-btn-ghost ks-btn-md">
                <Layers className="w-4 h-4" /> Topology
              </button>
            </>
          }
        />

        <MetricStrip items={[
          { label: 'Critical risks', value: cutVertexCount, detail: 'High-impact dependencies', tone: 'critical' },
          { label: 'Affected services', value: '21', detail: 'Across the leading risk', tone: 'warning' },
          { label: 'Escalating risks', value: escalatingCount, detail: 'Impact increased recently', tone: 'info' },
        ]} />

        {/* Filter Tabs */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setWatchlistFilter('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                watchlistFilter === 'all'
                  ? 'bg-[#2f2fe4] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({nodes.length})
            </button>
            <button
              onClick={() => setWatchlistFilter('escalating')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                watchlistFilter === 'escalating'
                  ? 'bg-[#2f2fe4] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Escalating ({escalatingCount})</span>
            </button>
            <button
              onClick={() => setWatchlistFilter('cut-vertex')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                watchlistFilter === 'cut-vertex'
                  ? 'bg-[#2f2fe4] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              High impact ({cutVertexCount})
            </button>
            <button
              onClick={() => setWatchlistFilter('tier1')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                watchlistFilter === 'tier1'
                  ? 'bg-[#2f2fe4] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Reaches critical services ({nodes.filter(n => n.tier1Reach > 0).length})
            </button>
          </div>

          <span className="text-xs font-mono text-slate-500 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
            <CornerDownLeft className="w-3.5 h-3.5 text-blue-500" />
            <span>Use ↑↓ arrows to navigate • Enter to inspect</span>
          </span>
        </div>

      {/* Main Table (6 Clean Consolidated Columns) */}
      <div className={`rounded-xl border overflow-hidden ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${
                isLight 
                ? 'border-slate-200 bg-slate-50 text-slate-600'
                  : 'border-slate-800 bg-slate-950/80 text-slate-400'
              }`}>
                <th className="py-3 px-4">Dependency</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Impact</th>
                <th className="hidden py-3 px-4 lg:table-cell">Why it is prioritized</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
              {filteredNodes.map((node, index) => {
                const isSnakeYaml = node.id === 'snakeyaml';
                const isEscalating = node.isEscalatingKeystone || (node.centralityVelocity && node.centralityVelocity >= 100);
                const isFocused = index === focusedRowIndex;
                const divergence = node.systemicScore - node.conventionalScore;

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
                    {/* 1. Rank & Component */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-slate-400 w-4">
                          {index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-semibold text-sm text-slate-900 dark:text-white">
                              {node.name}
                            </span>
                            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                              v{node.version}
                            </span>
                            {node.articulationPoint && (
                              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                                High impact
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {node.operationalDomain || node.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Risk Severity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={node.structuralRisk === 'critical' ? 'critical' : node.structuralRisk === 'high' ? 'high' : 'neutral'}>
                          {node.structuralRisk}
                        </Badge>
                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-semibold">
                          {node.systemicScore}/100
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {node.dependents} services
                        </span>
                        <span className={node.tier1Reach > 0 ? 'text-rose-600 dark:text-rose-400 font-medium text-[11px]' : 'text-slate-400 text-[11px]'}>
                          {node.tier1Reach > 0 ? `${node.tier1Reach} critical services reached` : '0 critical services'}
                        </span>
                      </div>
                    </td>

                    <td className="hidden py-3.5 px-4 lg:table-cell">
                      <div className="flex items-center gap-2">
                        <CentralityVelocityCard node={node} mode="sparkline-only" />
                        <span className="text-xs text-slate-500">
                          {isEscalating ? 'Impact increasing' : divergence > 15 ? 'Business impact exceeds CVSS' : 'Stable'}
                        </span>
                      </div>
                    </td>

                    {/* 6. Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectNode(node.id);
                        }}
                        className="px-3 py-1 rounded-md text-xs font-semibold text-white bg-[#2f2fe4] hover:bg-[#4343f8] cursor-pointer select-none shadow-xs transition-all"
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
