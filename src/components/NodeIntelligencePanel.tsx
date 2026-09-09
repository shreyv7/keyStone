import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  Play, 
  Lock, 
  GitPullRequest,
  Activity,
  ArrowRight
} from 'lucide-react';
import { EcosystemNode } from '../types';
import { RiskWaterfall } from './RiskWaterfall';
import { useTheme } from '../context/ThemeContext';

interface NodeIntelligencePanelProps {
  node: EcosystemNode | null;
  onClose: () => void;
  onStartSimulation: (nodeId: string) => void;
  onFreezeCircuitBreaker: (nodeId: string) => void;
  isCircuitBreakerFrozen: boolean;
  simulationPhase: string;
}

export const NodeIntelligencePanel: React.FC<NodeIntelligencePanelProps> = ({
  node,
  onClose,
  onStartSimulation,
  onFreezeCircuitBreaker,
  isCircuitBreakerFrozen,
  simulationPhase
}) => {
  const [showConfirmSim, setShowConfirmSim] = useState(false);
  const { isLight } = useTheme();

  if (!node) return null;

  const isKeystone = node.category === 'keystone' || node.id === 'snakeyaml';
  const isCompromised = simulationPhase === 'simulating' || simulationPhase === 'active_compromise';

  return (
    <div className={`absolute top-0 right-0 bottom-0 w-96 lg:w-[420px] backdrop-blur-md border-l shadow-xl z-30 flex flex-col justify-between overflow-hidden transition-colors select-none ${
      isLight ? 'bg-white/98 border-slate-200 text-slate-800' : 'bg-[#07090e]/98 border-slate-800 text-slate-100'
    }`}>
      {/* Top Header */}
      <div className={`p-5 border-b ${isLight ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800 bg-slate-950/40'}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
              }`}>
                {node.category.replace('-', ' ')}
              </span>
              {node.articulationPoint && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase flex items-center gap-1 border ${
                  isLight 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : 'bg-red-950/40 text-red-400 border-red-800/50'
                }`}>
                  <AlertTriangle className="w-3 h-3" />
                  Cut-Vertex
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold flex items-baseline gap-2">
              <span className="font-mono">{node.name}</span>
              <span className={`text-xs font-mono font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>v{node.version}</span>
            </h2>
            <div className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{node.operationalDomain || 'Ecosystem Component'}</div>
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

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
        {/* Risk Comparison: Conventional Score vs Systemic Risk */}
        <div className={`p-4 rounded-lg border flex flex-col gap-3 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className={`text-[11px] font-semibold flex items-center justify-between ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <span>Risk Evaluation</span>
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Isolated vs. Systemic</span>
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
              <div className={`text-[10px] uppercase font-semibold ${isLight ? 'text-red-800' : 'text-red-300'}`}>Systemic Risk</div>
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
            <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Tier-1 Reach</span>
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

        {/* Risk Breakdown Waterfall */}
        <div className={`p-4 rounded-lg border ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <RiskWaterfall node={node} />
        </div>
      </div>

      {/* Action Footer */}
      <div className={`p-4 border-t flex flex-col gap-2 ${
        isLight ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800 bg-slate-950/40'
      }`}>
        <button
          onClick={() => onStartSimulation(node.id)}
          className={`w-full py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
            isLight 
              ? 'bg-slate-900 hover:bg-slate-800 text-white' 
              : 'bg-slate-100 hover:bg-white text-slate-900'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Simulate Compromise on this Node</span>
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
          <span>{isCircuitBreakerFrozen ? 'Circuit Breaker: FROZEN' : 'Freeze CI/CD Intake (Circuit Breaker)'}</span>
        </button>
      </div>
    </div>
  );
};
