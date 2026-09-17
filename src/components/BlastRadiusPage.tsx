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
import { PageHeader } from './ui/PageHeader';
import { MetricStrip } from './ui/MetricStrip';
import { Disclosure } from './ui/Disclosure';

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
    <div className="w-full h-full overflow-y-auto px-4 py-5 sm:px-6 select-text ks-bg-app">
      <div className="max-w-7xl mx-auto flex flex-col gap-5">

        <PageHeader
          title="Blast Radius"
          description="See which services fail together when a high-impact dependency is compromised."
          primaryAction={
            <button
              onClick={onNavigateRemediation}
              className="ks-btn ks-btn-primary ks-btn-md"
            >
              <span>Plan recommended fix</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          }
          secondaryActions={
            <>
            <button
              onClick={handleSimulateRipple}
              disabled={isSimulating}
              className="ks-btn ks-btn-secondary ks-btn-md"
            >
              <Activity className={`w-4 h-4 text-blue-500 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Simulating...' : 'Simulate impact'}</span>
            </button>
            <button
              onClick={onReturnToGraph}
              className="ks-btn ks-btn-ghost ks-btn-md"
            >
              <Layers className="w-4 h-4" />
              <span>Open topology</span>
            </button>
            </>
          }
        />

        <MetricStrip items={[
          { label: 'Affected services', value: '21', detail: 'Across 42 repositories', tone: 'warning' },
          { label: 'Critical services', value: '4 exposed', detail: 'Payment, identity, orders, and risk', tone: 'critical' },
          { label: 'Business flow at risk', value: '$85M/day', detail: 'Estimated transaction exposure', tone: 'critical' },
        ]} />

        {/* Main 2-Column Split: F11 Impact Concentration vs. Propagation Path Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: F11 Impact Concentration (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-5 dark:border-red-900/50 dark:bg-red-950/20">
              <span className="ks-badge ks-badge-critical">Critical</span>
              <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">One dependency can disrupt four critical services</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                A compromise of <code className="font-mono font-semibold">snakeyaml@1.33</code> can spread through shared utilities into payment and identity systems.
              </p>
              <button
                onClick={onNavigateRemediation}
                className="ks-btn ks-btn-primary ks-btn-md mt-4 w-full"
              >
                <span>Plan recommended fix</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <Disclosure title="How impact concentration was calculated" summary="Advanced spread and depth analysis">
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between"><span>Impact concentration</span><strong className="font-mono text-slate-900 dark:text-white">0.88 / 1.00</strong></div>
                <div className="flex items-center justify-between"><span>Horizontal spread</span><strong>84%</strong></div>
                <div className="flex items-center justify-between"><span>Vertical depth</span><strong>16%</strong></div>
                <p>Four independent paths cross 21 services, making this a broad portfolio risk rather than a contained application issue.</p>
              </div>
            </Disclosure>
          </div>

          {/* Right Column: Interactive Propagation Path Explorer (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="connector-3d-card p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base font-heading text-slate-900 dark:text-white">
                    Affected service paths ({MOCK_PROPAGATION_PATHS.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select a path to see how the dependency reaches a critical service.
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold">
                  Runtime paths
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
                            Critical service
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
                      Critical service: {activePath.targetAsset}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    Connection: {activePath.channel}
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
                  <span>View recommended fix</span>
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
