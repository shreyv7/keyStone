import React, { useState } from 'react';
import { 
  Flame, 
  Layers, 
  ArrowRight, 
  Activity, 
  GitFork, 
  ShieldAlert, 
  Server, 
  DollarSign, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
  RotateCcw
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { MOCK_PROPAGATION_PATHS, MOCK_NODES } from '../data/mockEcosystem';

interface BlastRadiusPageProps {
  onNavigateRemediation: () => void;
  onReturnToGraph: () => void;
  onSelectNode?: (nodeId: string) => void;
}

export const BlastRadiusPage: React.FC<BlastRadiusPageProps> = ({
  onNavigateRemediation,
  onReturnToGraph,
  onSelectNode
}) => {
  const { isLight } = useTheme();
  const [selectedPathId, setSelectedPathId] = useState<string>(MOCK_PROPAGATION_PATHS[0].id);
  const [isSimulating, setIsSimulating] = useState(false);

  const activePath = MOCK_PROPAGATION_PATHS.find(p => p.id === selectedPathId) || MOCK_PROPAGATION_PATHS[0];

  const handleSimulateRipple = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1500);
  };

  return (
    <div className="w-full h-full overflow-y-auto px-6 py-6 select-text ks-bg-app">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
              Blast Radius Intelligence
            </h1>
            <p className="text-sm mt-2 max-w-2xl text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
              Deterministic transitive reachability modeling across internal microservices, platform DAGs, and revenue-critical sinks.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={handleSimulateRipple}
              disabled={isSimulating}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center gap-2 cursor-pointer select-none shadow-xs transition-colors"
            >
              <Activity className={`w-4 h-4 text-blue-500 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Propagating Wave...' : 'Re-Simulate Cascade'}</span>
            </button>

            <button
              onClick={onReturnToGraph}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center gap-2 cursor-pointer select-none shadow-xs transition-colors"
            >
              <Layers className="w-4 h-4 text-blue-500" />
              <span>Inspect on 3D Graph</span>
            </button>

            <button
              onClick={onNavigateRemediation}
              className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2 cursor-pointer select-none shadow-xs transition-colors"
            >
              <span>Calculate Remediation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4-Card Status Telemetry Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="connector-3d-card p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Affected Services</span>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            </div>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">21</span>
              <span className="text-xs text-slate-500 font-mono">services</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
              Spans across <strong className="text-slate-700 dark:text-slate-300">42 core repos</strong>
            </div>
          </div>

          <div className="connector-3d-card p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Tier-1 Apex Sinks</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20">
                CRITICAL
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-3xl font-bold font-mono text-rose-600 dark:text-rose-400">4</span>
              <span className="text-xs text-slate-500 font-mono">crown jewels</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
              Payment Gateway, Auth/IAM, Core Engine
            </div>
          </div>

          <div className="connector-3d-card p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Active Propagation DAGs</span>
              <GitFork className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">4</span>
              <span className="text-xs text-slate-500 font-mono">independent chains</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
              Chokepoint: <code className="text-blue-600 dark:text-blue-400 font-semibold font-mono">snakeyaml@1.33</code>
            </div>
          </div>

          <div className="connector-3d-card p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Daily Flow Exposed</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">$85M</span>
              <span className="text-xs text-slate-500 font-mono">/ day</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
              Critical transaction throughput at risk
            </div>
          </div>
        </div>

        {/* Main 2-Column Split: F11 Impact Concentration vs. Propagation Path Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: F11 Impact Concentration (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Herfindahl Index Card */}
            <div className="connector-3d-card p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <h3 className="font-semibold text-sm font-heading text-slate-900 dark:text-white">
                    Impact Concentration
                  </h3>
                </div>
                <span className="font-mono font-bold text-base text-rose-600 dark:text-rose-400">
                  0.88 / 1.00
                </span>
              </div>

              {/* Progress Split Bar */}
              <div className="flex flex-col gap-1.5">
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: '84%' }} 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-500"
                    title="Horizontal Spread: 84%"
                  />
                  <div 
                    style={{ width: '16%' }} 
                    className="bg-slate-400 dark:bg-slate-600 h-full transition-all duration-500"
                    title="Vertical Depth: 16%"
                  />
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    ↔ Horizontal Spread: 84%
                  </span>
                  <span className="text-slate-500">
                    ↕ Vertical Depth: 16%
                  </span>
                </div>
              </div>

              {/* Herfindahl Classification */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase">
                    Systemic Contagion
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Herfindahl Metric
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Distinguishes 50 vulnerabilities in 1 monolith (contained incident) from 4 paths crossing 21 microservices (portfolio emergency).
                </p>
              </div>

              {/* Narrative Contagion Summary */}
              <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs flex flex-col gap-2">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                  <Activity className="w-3.5 h-3.5 text-blue-500" />
                  <span>Contagion Summary</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Compromise of <code className="font-mono font-semibold text-blue-600 dark:text-blue-400">snakeyaml@1.33</code> propagates through internal shared utilities into Payment Gateway and Auth/IAM.
                </p>
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Downstream Tier-1 Reach: <strong>4 Assets</strong></span>
                  <span>Cut-Vertex Articulation: <strong>YES</strong></span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onNavigateRemediation}
                className="w-full py-2 px-4 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 cursor-pointer select-none shadow-xs transition-colors"
              >
                <span>Calculate Minimum-Cut Remediation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Propagation Path Explorer (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="connector-3d-card p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base font-heading text-slate-900 dark:text-white">
                    Propagation Pathways ({MOCK_PROPAGATION_PATHS.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select a path to trace downstream service hops and isolation recommendations.
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold">
                  Runtime Channels
                </span>
              </div>

              {/* Path List */}
              <div className="flex flex-col gap-2.5">
                {MOCK_PROPAGATION_PATHS.map((path, idx) => {
                  const isSelected = path.id === selectedPathId;
                  return (
                    <div
                      key={path.id}
                      onClick={() => setSelectedPathId(path.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 ring-1 ring-blue-500'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-semibold text-sm text-slate-900 dark:text-white">
                              {path.label}
                            </span>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {path.description}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            Tier-{path.targetAssetTier} Asset
                          </span>
                          <div className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mt-1">
                            ${path.assetWeight}M / Day
                          </div>
                        </div>
                      </div>

                      {/* Hop Pipeline Preview */}
                      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 overflow-x-auto text-xs font-mono">
                        {path.nodeIds.map((nodeId, nodeIdx) => (
                          <React.Fragment key={nodeId}>
                            <span 
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectNode?.(nodeId);
                              }}
                              className={`px-2 py-1 rounded border text-[11px] whitespace-nowrap cursor-pointer transition-colors ${
                                nodeIdx === 0
                                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 font-bold'
                                  : nodeIdx === path.nodeIds.length - 1
                                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50 font-bold'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                              }`}
                            >
                              {nodeId}
                            </span>
                            {nodeIdx < path.nodeIds.length - 1 && (
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Path Deep Dive Box */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono">
                      Target Sink: {activePath.targetAsset}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    Channel: {activePath.channel}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Traffic into <strong>{activePath.targetAsset}</strong> can be insulated by replacing <code>snakeyaml</code> with a drop-in safe parser (e.g. SnakeYAML 2.0 or Jackson YAML) or placing an internal proxy validation gate.
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-slate-800">
                  <button
                    onClick={onReturnToGraph}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View this chain on 3D Graph</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    onClick={onNavigateRemediation}
                    className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>View Prescribed Fix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
