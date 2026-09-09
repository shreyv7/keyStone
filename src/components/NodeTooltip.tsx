import React from 'react';
import { EcosystemNode } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NodeTooltipProps {
  node: EcosystemNode | null;
  position: { x: number; y: number } | null;
}

export const NodeTooltip: React.FC<NodeTooltipProps> = ({ node, position }) => {
  const { isLight } = useTheme();

  if (!node || !position) return null;

  // Offset tooltip slightly so it doesn't block cursor
  const left = Math.min(position.x + 16, window.innerWidth - 260);
  const top = Math.min(position.y + 16, window.innerHeight - 200);

  const riskBadgeClass =
    node.structuralRisk === 'critical'
      ? isLight 
        ? 'bg-rose-50 text-rose-700 border-rose-200' 
        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
      : node.structuralRisk === 'high'
      ? isLight
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      : node.structuralRisk === 'medium'
      ? isLight
        ? 'bg-sky-50 text-sky-700 border-sky-200'
        : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
      : isLight
        ? 'bg-slate-100 text-slate-600 border-slate-200'
        : 'bg-slate-800 text-slate-400 border-slate-700';

  return (
    <div
      style={{ left: `${left}px`, top: `${top}px` }}
      className={`fixed z-50 pointer-events-none w-60 rounded-lg border shadow-2xl p-3 backdrop-blur-md text-xs select-none animate-in fade-in zoom-in-95 duration-100 ${
        isLight ? 'bg-white/95 border-slate-200 text-slate-800' : 'bg-slate-950/95 border-slate-700/80 text-slate-100'
      }`}
    >
      <div className={`flex items-start justify-between gap-2 border-b pb-2 mb-2 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
        <div>
          <div className={`font-bold font-mono text-[13px] leading-tight flex items-center gap-1.5 ${
            isLight ? 'text-slate-900' : 'text-slate-100'
          }`}>
            {node.name}
            <span className={`text-[10px] font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>v{node.version}</span>
          </div>
          <div className={`text-[10px] capitalize ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{node.category.replace('-', ' ')}</div>
        </div>
        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-semibold ${riskBadgeClass}`}>
          {node.structuralRisk}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-1.5 text-[11px] font-mono mb-2">
        <div className={isLight ? 'text-slate-500' : 'text-slate-400'}>Reverse PageRank:</div>
        <div className={`text-right font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{node.reversePageRankPercentile}th %ile</div>

        <div className={isLight ? 'text-slate-500' : 'text-slate-400'}>Articulation:</div>
        <div className={`text-right font-semibold ${node.articulationPoint ? (isLight ? 'text-rose-600' : 'text-rose-400') : (isLight ? 'text-slate-500' : 'text-slate-400')}`}>
          {node.articulationPoint ? 'YES (Cut-Vertex)' : 'NO'}
        </div>

        <div className={isLight ? 'text-slate-500' : 'text-slate-400'}>Dependents:</div>
        <div className={`text-right ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{node.dependents} services</div>

        <div className={isLight ? 'text-slate-500' : 'text-slate-400'}>Tier-1 Reach:</div>
        <div className={`text-right font-semibold ${node.tier1Reach > 0 ? (isLight ? 'text-rose-600' : 'text-rose-400') : (isLight ? 'text-slate-500' : 'text-slate-400')}`}>
          {node.tier1Reach} Tier-1
        </div>
      </div>

      <div className={`pt-1.5 border-t flex items-center justify-between text-[10px] font-mono ${
        isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-500'
      }`}>
        <span>Click node for deep intelligence</span>
        <span className={isLight ? 'text-cyan-600' : 'text-cyan-400'}>⏎</span>
      </div>
    </div>
  );
};
