import React from 'react';
import { EcosystemNode } from '../types';
import { useTheme } from '../context/ThemeContext';
import { TreePine, X, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface DominatorLeaderboardProps {
  nodes: EcosystemNode[];
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
  onClose?: () => void;
  isOverlay?: boolean;
}

export const DominatorLeaderboard: React.FC<DominatorLeaderboardProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  onClose,
  isOverlay = true
}) => {
  const { isLight } = useTheme();

  // Compute Dominator Metrics for nodes:
  // Dominator Count DC_N: nodes where articulationPoint is true dominate more nodes
  const scoredNodes = nodes
    .filter(n => n.layer <= 3) // Open-source, internal libs, services
    .map(n => {
      const prN = n.reversePageRank;
      const dcRaw = n.articulationPoint ? (n.dependents * 1.5 + n.tier1Reach * 2) : (n.dependents * 0.2);
      const dcN = Math.min(1, Math.max(0, dcRaw / 35));
      const sc = Math.sqrt(dcN * prN);
      const isRedundant = !n.articulationPoint && n.dependents > 5;

      return {
        node: n,
        dcN: parseFloat(dcN.toFixed(2)),
        prN: parseFloat(prN.toFixed(2)),
        sc: parseFloat(sc.toFixed(2)),
        isRedundant
      };
    })
    .sort((a, b) => b.sc - a.sc)
    .slice(0, 7);

  return (
    <div className={`rounded-xl border flex flex-col transition-all ${
      isOverlay
        ? `absolute top-20 right-6 z-30 w-96 shadow-2xl backdrop-blur-md ${
            isLight ? 'bg-white/95 border-slate-300' : 'bg-slate-900/95 border-slate-800'
          }`
        : isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
    }`}>
      {/* Header */}
      <div className={`p-3.5 border-b flex items-center justify-between ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isLight ? 'bg-blue-50 text-blue-600' : 'bg-blue-950 text-blue-400'}`}>
            <TreePine className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                High-impact dependencies
              </span>
            </div>
            <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Ranked by downstream service impact
            </div>
          </div>
        </div>

        {isOverlay && onClose && (
          <button
            onClick={onClose}
            className={`p-1 rounded-md transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="p-3 flex flex-col gap-1.5 max-h-[380px] overflow-y-auto">
        <div className="grid grid-cols-12 text-[10px] font-mono text-slate-500 px-2 pb-1 border-b border-slate-200/50 dark:border-slate-800/50">
          <span className="col-span-1">#</span>
          <span className="col-span-5">Component</span>
          <span className="col-span-2 text-right">Downstream</span>
          <span className="col-span-2 text-right">Centrality</span>
          <span className="col-span-2 text-right font-bold">Score</span>
        </div>

        {scoredNodes.map(({ node, dcN, prN, sc, isRedundant }, idx) => {
          const isSelected = selectedNodeId === node.id;
          return (
            <div
              key={node.id}
              onClick={() => onSelectNode && onSelectNode(node.id)}
              className={`grid grid-cols-12 items-center p-2 rounded-lg text-xs cursor-pointer transition-all border ${
                isSelected
                  ? isLight ? 'bg-blue-50 border-blue-300 shadow-xs' : 'bg-blue-950/40 border-blue-700 shadow-xs'
                  : isLight
                  ? 'hover:bg-slate-50 border-transparent hover:border-slate-200'
                  : 'hover:bg-slate-800/60 border-transparent hover:border-slate-800'
              }`}
            >
              <div className="col-span-1 font-mono font-bold text-slate-400 text-[11px]">
                {idx + 1}
              </div>

              <div className="col-span-5 pr-1">
                <div className={`font-mono text-[11px] font-bold truncate ${
                  isSelected ? 'text-blue-600 dark:text-blue-400' : isLight ? 'text-slate-900' : 'text-slate-100'
                }`}>
                  {node.name}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                    node.articulationPoint
                      ? isLight ? 'bg-slate-200 text-slate-800' : 'bg-slate-800 text-slate-200'
                      : isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {node.articulationPoint ? 'High impact' : isRedundant ? 'Redundant route' : 'Limited impact'}
                  </span>
                </div>
              </div>

              <div className="col-span-2 text-right font-mono text-[11px] text-slate-600 dark:text-slate-300">
                {dcN.toFixed(2)}
              </div>

              <div className="col-span-2 text-right font-mono text-[11px] text-slate-600 dark:text-slate-300">
                {prN.toFixed(2)}
              </div>

              <div className="col-span-2 text-right font-mono font-bold text-[11px] text-blue-600 dark:text-blue-400">
                {sc.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation of redundant dependency paths. */}
      <div className={`p-2.5 rounded-b-xl border-t text-[10px] leading-snug ${
        isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
      }`}>
        <div className="flex items-start gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
          <span>
            <strong>Redundant paths:</strong> Components with multiple fallback routes are less likely to interrupt services when one dependency fails.
          </span>
        </div>
      </div>
    </div>
  );
};
