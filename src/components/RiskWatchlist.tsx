import React from 'react';
import { EcosystemNode } from '../types';
import { AlertTriangle, ShieldCheck, ArrowRight, Layers, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
  // Sort by systemicScore descending
  const sortedNodes = [...nodes].sort((a, b) => b.systemicScore - a.systemicScore);

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
              Topology Analysis
            </span>
            <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Structural Risk Priority
            </span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Systemic Risk Watchlist
          </h1>
          <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Prioritizes dependencies by network position, downstream blast radius, and connectivity to mission-critical Tier-1 services.
          </p>
        </div>

        <button
          onClick={onReturnToGraph}
          className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors flex items-center gap-2 border ${
            isLight 
              ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs' 
              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-slate-500" />
          <span>Return to Topology Map</span>
        </button>
      </div>

      {/* Highlights summary banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg border flex flex-col gap-1 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Top Articulation Keystone</div>
          <div className="text-lg font-bold font-mono text-red-600">snakeyaml@1.33</div>
          <div className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Tarjan cut-vertex reaching 4 Tier-1 services despite moderate CVSS (48/100).
          </div>
        </div>

        <div className={`p-4 rounded-lg border flex flex-col gap-1 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Dependency Concentration</div>
          <div className={`text-lg font-bold font-mono ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>81% in Top 5 Nodes</div>
          <div className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Ecosystem reachability is heavily concentrated in a small cluster of shared libraries.
          </div>
        </div>

        <div className={`p-4 rounded-lg border flex flex-col gap-1 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Tier-1 Sinks Exposed</div>
          <div className={`text-lg font-bold font-mono ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>4 Core Services</div>
          <div className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Payment Gateway, Auth/IAM, Order Core, Realtime Risk.
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className={`rounded-lg border overflow-hidden ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/50 border-slate-800'
      }`}>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${
              isLight 
                ? 'border-slate-200 bg-slate-50/80 text-slate-500' 
                : 'border-slate-800 bg-slate-950/80 text-slate-400'
            }`}>
              <th className="py-3 px-4">Rank & Component</th>
              <th className="py-3 px-4">Conventional vs. Systemic</th>
              <th className="py-3 px-4">Risk Tier</th>
              <th className="py-3 px-4">Centrality</th>
              <th className="py-3 px-4">Cut-Vertex</th>
              <th className="py-3 px-4">Downstream</th>
              <th className="py-3 px-4">Tier-1 Reach</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
            {sortedNodes.map((node, index) => {
              const isSnakeYaml = node.id === 'snakeyaml';
              return (
                <tr
                  key={node.id}
                  className={`transition-colors ${
                    isSnakeYaml 
                      ? isLight ? 'bg-red-50/40' : 'bg-red-950/15'
                      : isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-xs w-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono font-semibold text-xs ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                            {node.name}
                          </span>
                          <span className={`font-mono text-[11px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                            v{node.version}
                          </span>
                        </div>
                        <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {node.operationalDomain || node.category}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <div className={`text-[10px] uppercase ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>CVSS</div>
                        <div className={`font-mono font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                          {node.conventionalScore}
                        </div>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <div className="text-center">
                        <div className={`text-[10px] uppercase ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Systemic</div>
                        <div className={`font-mono font-bold ${node.systemicScore >= 80 ? 'text-red-600' : 'text-amber-600'}`}>
                          {node.systemicScore}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      node.structuralRisk === 'critical'
                        ? isLight ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-red-950/40 text-red-400 border border-red-800/50'
                        : node.structuralRisk === 'high'
                        ? isLight ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-amber-950/40 text-amber-400 border border-amber-800/50'
                        : isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {node.structuralRisk}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-xs">
                    {(node.reversePageRank * 100).toFixed(1)}%
                  </td>

                  <td className="py-3 px-4">
                    {node.articulationPoint ? (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        isLight ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-red-950/40 text-red-400 border border-red-800/50'
                      }`}>
                        Yes (Cut-Vertex)
                      </span>
                    ) : (
                      <span className={`text-[11px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>No</span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono text-xs">
                    {node.dependents} repos
                  </td>

                  <td className="py-3 px-4 font-mono text-xs">
                    <span className={node.tier1Reach > 0 ? 'text-red-600 font-bold' : isLight ? 'text-slate-500' : 'text-slate-400'}>
                      {node.tier1Reach} Tier-1
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectNode(node.id)}
                      className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                        isLight 
                          ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
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
  );
};
